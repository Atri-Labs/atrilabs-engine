import { getFiles } from "../utils";
import path from "path";
import fs from "fs";
import { camelCase } from "lodash";
import { ComponentGeneratorOutput, PropsGeneratorOutput } from "../types";

export function createReactAppTemplateManager(
  paths: {
    reactAppTemplate: string;
    reactAppDest: string;
  },
  rootComponentId: string
) {
  const pagesTemplateDirectory = path.resolve(
    paths.reactAppTemplate,
    "src",
    "pages"
  );
  const pagesDestDirectory = path.resolve(paths.reactAppDest, "src", "pages");
  const examplePageFile = path.resolve(pagesTemplateDirectory, "Example.jsx");
  const examplePageFileText = fs.readFileSync(examplePageFile).toString();
  const appJSXTemplatePath = path.resolve(
    paths.reactAppTemplate,
    "src",
    "App.jsx"
  );
  const appJSXDestPath = path.resolve(paths.reactAppDest, "src", "App.jsx");
  const useStoreDestPath = path.resolve(
    paths.reactAppDest,
    "src",
    "hooks",
    "useStore.js"
  );
  const useStoreTemplatePath = path.resolve(
    paths.reactAppTemplate,
    "src",
    "hooks",
    "useStore.js"
  );

  // variables to manage writes in App.jsx
  const pageImports: { name: string; route: string; source: string }[] = [];

  // variables to manage writes for a page (initial number will be 1)
  const identiferRegistry: { [identifer: string]: number } = {};
  const pageImportMap: {
    [pageName: string]: {
      [source: string]: { identifier: string; localIdentifier: string }[];
    };
  } = {};
  const componentMap: {
    [pageName: string]: {
      [compId: string]: {
        localIdentifier: string;
        alias: string;
        parent: { id: string; index: number };
      };
    };
  } = {};
  const propsMap: { [pageName: string]: PropsGeneratorOutput } = {};

  function copyTemplate() {
    const files = getFiles(paths.reactAppTemplate);
    files.forEach((file) => {
      // file from pages directory should not be copied
      if (file.match(pagesDestDirectory)) {
        return;
      }
      const dirname = path.dirname(file);
      const relativeDirname = path.relative(paths.reactAppTemplate, dirname);
      const destDirname = path.resolve(paths.reactAppDest, relativeDirname);
      const relativeFilename = path.relative(paths.reactAppTemplate, file);
      const destFilename = path.resolve(paths.reactAppDest, relativeFilename);
      if (!fs.existsSync(destDirname)) {
        fs.mkdirSync(destDirname, { recursive: true });
      }
      fs.writeFileSync(destFilename, fs.readFileSync(file));
    });
    // create pages directory
    if (!fs.existsSync(pagesDestDirectory)) {
      fs.mkdirSync(pagesDestDirectory);
    }
  }

  function getFilenameForPage(name: string) {
    const filenameWithExt = name[0].toUpperCase() + name.slice(1) + ".jsx";
    return filenameWithExt;
  }

  function getPageDestPath(name: string) {
    const filenameWithExt = getFilenameForPage(name);
    return path.resolve(pagesDestDirectory, filenameWithExt);
  }

  function getPageComponentName(name: string) {
    const casedName = camelCase(name);
    return casedName[0].toUpperCase() + casedName.slice(1);
  }

  function createPage(name: string) {
    fs.writeFileSync(
      getPageDestPath(name),
      examplePageFileText.replace("Example", getPageComponentName(name))
    );
  }

  function addPageToApp(page: { name: string; route: string }) {
    pageImports.push({
      name: page.name,
      route: page.route,
      source: path.resolve(pagesDestDirectory, getFilenameForPage(page.name)),
    });
  }

  function replaceText(
    initial: string,
    slices: { index: number; length: number; replaceWith: string }[]
  ) {
    slices.sort((a, b) => a.index - b.index);
    const newPieces: string[] = [];
    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      if (i === 0) newPieces.push(initial.slice(0, slice.index));
      else {
        const prevSlice = slices[i - 1];
        newPieces.push(
          initial.slice(prevSlice.index + prevSlice.length, slice.index)
        );
      }

      if (i === slices.length - 1) {
        newPieces.push(initial.slice(slice.index + slice.length));
      }
    }
    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      newPieces.splice(2 * i + 1, 0, slice.replaceWith);
    }
    return newPieces.join("");
  }

  function flushAppJSX() {
    const appJSXTemplateText = fs.readFileSync(appJSXTemplatePath).toString();
    // add import statements
    const importStatements = pageImports
      .map((pageImport) => {
        return `import ${getPageComponentName(pageImport.name)} from "${
          pageImport.source
        }";`;
      })
      .join("\n");
    // add routes
    const routeStatements = pageImports
      .map((pageImport) => {
        return `<Route path="${pageImport.route}">\n<${getPageComponentName(
          pageImport.name
        )} />\n</Route>`;
      })
      .join("\n");
    const importCursorMatch = appJSXTemplateText.match(
      /\/\/\sIMPORT\sCURSOR\n/
    );
    const routeCursorMatch = appJSXTemplateText.match(
      /\{\/\*\sROUTE\sCURSOR.*\n/
    );
    if (!importCursorMatch || !routeCursorMatch) {
      console.log(
        `Failed to find import cursor or route cursor in template App.jsx file. Please report this error to Atri Labs.`
      );
      return;
    }
    const newText = replaceText(appJSXTemplateText, [
      {
        index: importCursorMatch.index!,
        length: importCursorMatch[0].length,
        replaceWith: importStatements + "\n",
      },
      {
        index: routeCursorMatch.index!,
        length: routeCursorMatch[0].length,
        replaceWith: routeStatements + "\n",
      },
    ]);
    fs.writeFileSync(appJSXDestPath, newText);
  }

  function getDependencies() {
    const reactAppPackageJSONPath = path.resolve(
      paths.reactAppTemplate,
      "package.json"
    );
    const reactAppPackageJSON = require(reactAppPackageJSONPath);
    const reactAppDependencies = reactAppPackageJSON["dependencies"] || {};
    return reactAppDependencies;
  }

  function getDevDependencies() {
    const reactAppPackageJSONPath = path.resolve(
      paths.reactAppTemplate,
      "package.json"
    );
    const reactAppPackageJSON = require(reactAppPackageJSONPath);
    const reactAppDevDependencies =
      reactAppPackageJSON["devDependencies"] || {};
    return reactAppDevDependencies;
  }

  function addComponents(
    page: { name: string },
    components: ComponentGeneratorOutput
  ) {
    const compIds = Object.keys(components);
    if (pageImportMap[page.name] === undefined) {
      pageImportMap[page.name] = {};
    }
    if (componentMap[page.name] === undefined) {
      componentMap[page.name] = {};
    }
    compIds.forEach((compId) => {
      const { exportedVarName, modulePath, alias, parent } = components[compId];
      // If a component is already added for import, do nothing
      const mapped = pageImportMap[page.name][modulePath]?.find(
        (curr) => curr.identifier === exportedVarName
      );
      let localIdentifier = "";
      if (
        pageImportMap[page.name] &&
        pageImportMap[page.name][modulePath] &&
        mapped
      ) {
        localIdentifier = mapped.localIdentifier;
      } else {
        if (identiferRegistry[exportedVarName] === undefined) {
          localIdentifier = exportedVarName;
          identiferRegistry[exportedVarName] = 1;
          const entry = {
            identifier: exportedVarName,
            localIdentifier,
          };
          if (pageImportMap[page.name][modulePath])
            pageImportMap[page.name][modulePath].push(entry);
          else pageImportMap[page.name][modulePath] = [entry];
        } else {
          localIdentifier =
            exportedVarName + identiferRegistry[exportedVarName];
          identiferRegistry[exportedVarName] += 1;
          const entry = {
            identifier: exportedVarName,
            localIdentifier,
          };
          if (pageImportMap[page.name][modulePath])
            pageImportMap[page.name][modulePath].push(entry);
          else pageImportMap[page.name][modulePath] = [entry];
        }
      }
      componentMap[page.name][compId] = {
        alias,
        localIdentifier,
        parent,
      };
    });
  }

  function flushPage(name: string) {
    /**
     * import { localIdentifier } from "source";
     *
     * export default function PageName(){
     *  const Flex1Key = "Flex1";
     *  const Flex1Ref = useRef(null);
     *  const Flex1Props = useStore((state)=>state["Flex1"]);
     *
     *  const Button1Key = "Button1";
     *  const Button1Ref = useRef(null);
     *  const Button1Props = useStore((state)=>state["Button1"]);
     *
     *  return (<>
     *    <Flex props={} ref={} key={flex1Key} >
     *      <Button props={} ref={Button1Ref} key={} />
     *    <Flex />
     *  </>)
     * }
     */
    // re-create page as it might have been polluted by previous run
    createPage(name);
    const pagePath = getPageDestPath(name);
    const pageText = fs.readFileSync(pagePath).toString();
    const jsxCursorMatch = pageText.match(/\{\/\*\sJSX\sCURSOR.*\n/);
    // create jsx
    function createJSX(
      compId: string,
      pageComponentMap: typeof componentMap["0"],
      reverseMap: {
        [parentId: string]: { compId: string; index: number }[];
      }
    ): string {
      const isParent = reverseMap[compId] !== undefined;
      const localIdentifier = pageComponentMap[compId].localIdentifier;
      if (isParent) {
        const start = `<${localIdentifier}>\n`;
        const mid = reverseMap[compId]
          .map((child) => {
            return createJSX(child.compId, pageComponentMap, reverseMap);
          })
          .join("");
        const end = `</${localIdentifier}>\n`;
        return start + mid + end;
      } else {
        const start = `<${localIdentifier}/>\n`;
        return start;
      }
    }
    if (jsxCursorMatch) {
      const reverseMap: {
        [parentId: string]: { compId: string; index: number }[];
      } = {};
      const compIds = Object.keys(componentMap[name]);
      for (let i = 0; i < compIds.length; i++) {
        const compId = compIds[i];
        const parentCompId = componentMap[name][compId].parent.id;
        const index = componentMap[name][compId].parent.index;
        if (reverseMap[parentCompId]) {
          reverseMap[parentCompId].push({ compId, index });
        } else {
          reverseMap[parentCompId] = [{ compId, index }];
        }
      }
      // sort in-place
      const parentIds = Object.keys(reverseMap);
      parentIds.forEach((parentId) => {
        reverseMap[parentId].sort((a, b) => a.index - b.index);
      });

      const rootChildren = reverseMap[rootComponentId];
      // it might happen that the page is empty
      if (rootChildren) {
        const jsx = rootChildren
          .map((rootChild) => {
            return createJSX(rootChild.compId, componentMap[name], reverseMap);
          })
          .join("");
        const newText = replaceText(pageText, [
          {
            index: jsxCursorMatch.index!,
            length: jsxCursorMatch[0].length,
            replaceWith: jsx,
          },
        ]);
        fs.writeFileSync(pagePath, newText);
      }
    } else {
      console.log("jsx cursor not found");
    }
  }

  function flushPages() {
    pageImports.forEach((page) => {
      flushPage(page.name);
    });
  }

  function addProps(page: { name: string }, props: PropsGeneratorOutput) {
    if (propsMap[page.name]) {
      propsMap[page.name] = { ...propsMap[page.name], ...props };
    } else {
      propsMap[page.name] = { ...props };
    }
  }

  // This function requires addComponents and addProps to already have been run
  function flushStore() {
    const pageNames = Object.keys(componentMap);
    const propsForAllPages = pageNames.map((pageName) => {
      const components = componentMap[pageName]!;
      const componentIds = Object.keys(components);
      const propsForPage = componentIds.map((compId) => {
        const alias = components[compId].alias;
        const props =
          propsMap[pageName] &&
          propsMap[pageName][compId] &&
          propsMap[pageName][compId].props
            ? propsMap[pageName][compId].props
            : {};
        return { alias, props };
      });
      return { propsForPage, pageName };
    });
    // create data to put in useStore
    const useStoreData: { [pageName: string]: { [alias: string]: any } } = {};
    propsForAllPages.forEach((propsForPage) => {
      const aliasPropsMap: { [alias: string]: any } = {};
      propsForPage.propsForPage.forEach((aliasProps) => {
        aliasPropsMap[aliasProps.alias] = aliasProps.props;
      });
      useStoreData[propsForPage.pageName] = aliasPropsMap;
    });
    // although we expect copyTemplate to have been run already
    if (!fs.existsSync(path.dirname(useStoreDestPath))) {
      fs.mkdirSync(path.dirname(useStoreDestPath), { recursive: true });
    }
    // copy useStore again (in case it's polluted)
    const useStoreTemplateText = fs
      .readFileSync(useStoreTemplatePath)
      .toString();
    const dataCursorMatch = useStoreTemplateText.match(/\/\/\sDATA\sCURSOR\n/);
    if (dataCursorMatch) {
      const newText = replaceText(useStoreTemplateText, [
        {
          index: dataCursorMatch.index!,
          length: dataCursorMatch[0].length,
          replaceWith: `return ${JSON.stringify(useStoreData, null, 2)}`,
        },
      ]);
      fs.writeFileSync(useStoreDestPath, newText);
    } else {
      console.log("useStore data cursor match is null");
    }
  }

  // add dependencies to destination package.json
  function patchDependencies() {}

  return {
    copyTemplate,
    createPage,
    addPageToApp,
    flushAppJSX,
    getDependencies,
    getDevDependencies,
    patchDependencies,
    addComponents,
    flushPages,
    addProps,
    flushStore,
  };
}
