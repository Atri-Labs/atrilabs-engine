import {
  atriAppBuildInfoFilename,
  atriAppBuildInfoTemplateFilepath,
  atriAppInfoFilename,
  atriAppInfoTemplateFilepath,
  atriAppServerInfoFilename,
  atriAppServerInfoTemplateFilepath,
  getFiles,
  reactAppPackageJSON,
} from "../utils";
import path from "path";
import fs from "fs";
import { camelCase } from "lodash";
import {
  CallbackGeneratorOutput,
  ComponentGeneratorOutput,
  Infos,
  PropsGeneratorOutput,
  ResourceGeneraterOutput,
} from "../types";
import { ToolConfig } from "@atrilabs/core";
import { jssToCss } from "./jssToCss";

export function createReactAppTemplateManager(
  paths: {
    reactAppTemplate: string;
    reactAppServerTemplate: string;
    reactAppDest: string;
    reactAppServerDest: string;
    toCopy: { path: string; outputFilename?: string }[];
    reactAppRootDest: string;
    reactAppRootTemplate: string;
    reactAppPackageJSON: string;
    reactAppPackageJSONDest: string;
    reactAppNodeTemplatePath: string;
    reactAppNodeDestPath: string;
    reactAppIndexHtmlTemplate: string;
    reactAppIndexHtmlDest: string;
  },
  rootComponentId: string,
  assetManager: ToolConfig["assetManager"],
  infos: Infos
) {
  const pagesTemplateDirectory = path.resolve(
    paths.reactAppTemplate,
    "src",
    "pages"
  );
  const pagesDestDirectory = path.resolve(paths.reactAppDest, "src", "pages");
  const examplePageFile = path.resolve(pagesTemplateDirectory, "Example.jsx");
  const examplePageFileText = fs.readFileSync(examplePageFile).toString();
  const indexJSXTemplatePath = path.resolve(
    paths.reactAppTemplate,
    "src",
    "index.jsx"
  );
  const indexJSXDestPath = path.resolve(paths.reactAppDest, "src", "index.jsx");
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
  const useIoStoreDestPath = path.resolve(
    paths.reactAppDest,
    "src",
    "hooks",
    "useIoStore.js"
  );
  const useIoStoreTemplatePath = path.resolve(
    paths.reactAppTemplate,
    "src",
    "hooks",
    "useIoStore.js"
  );
  const pageCbsDestDirectory = path.resolve(
    paths.reactAppDest,
    "src",
    "page-cbs"
  );
  const pageCSSDestDirectory = path.resolve(
    paths.reactAppDest,
    "src",
    "page-css"
  );
  const customCodeDestDirectory = path.resolve(
    paths.reactAppDest,
    "src",
    "custom"
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
  const callbacksMap: { [pageName: string]: CallbackGeneratorOutput } = {};

  function copyAppTemplate() {
    const files = getFiles(paths.reactAppTemplate);
    files.forEach((file) => {
      // file from pages directory should not be copied
      if (file.includes(pagesTemplateDirectory)) {
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

  function copyServerTemplate() {
    const files = getFiles(paths.reactAppServerTemplate);
    files.forEach((file) => {
      const dirname = path.dirname(file);
      const relativeDirname = path.relative(
        paths.reactAppServerTemplate,
        dirname
      );
      const destDirname = path.resolve(
        paths.reactAppServerDest,
        relativeDirname
      );
      const relativeFilename = path.relative(
        paths.reactAppServerTemplate,
        file
      );
      const destFilename = path.resolve(
        paths.reactAppServerDest,
        relativeFilename
      );
      if (!fs.existsSync(destDirname)) {
        fs.mkdirSync(destDirname, { recursive: true });
      }
      fs.writeFileSync(destFilename, fs.readFileSync(file));
    });
  }

  function copyAppNodeTemplate() {
    const files = getFiles(paths.reactAppNodeTemplatePath);
    files.forEach((file) => {
      const dirname = path.dirname(file);
      const relativeDirname = path.relative(
        paths.reactAppNodeTemplatePath,
        dirname
      );
      const destDirname = path.resolve(
        paths.reactAppNodeDestPath,
        relativeDirname
      );
      const relativeFilename = path.relative(
        paths.reactAppNodeTemplatePath,
        file
      );
      const destFilename = path.resolve(
        paths.reactAppNodeDestPath,
        relativeFilename
      );
      if (!fs.existsSync(destDirname)) {
        fs.mkdirSync(destDirname, { recursive: true });
      }
      fs.writeFileSync(destFilename, fs.readFileSync(file));
    });
  }

  function copyOthersToRoot() {
    paths.toCopy.forEach((file) => {
      const dirname = path.dirname(file.path);
      // .gitignore .eslintrc does not get copied to npm, hence, their names are renamed
      const outputFilename = file.outputFilename || path.basename(file.path);
      const relativeDirname = path.relative(
        paths.reactAppRootTemplate,
        dirname
      );
      const destDirname = path.resolve(paths.reactAppRootDest, relativeDirname);
      const destFilename = path.resolve(
        paths.reactAppRootDest,
        relativeDirname,
        outputFilename
      );
      if (!fs.existsSync(destDirname)) {
        fs.mkdirSync(destDirname, { recursive: true });
      }
      fs.writeFileSync(destFilename, fs.readFileSync(file.path));
    });
  }

  function copyTemplate() {
    copyAppTemplate();
    copyServerTemplate();
    copyOthersToRoot();
    copyAppNodeTemplate();
  }

  function getFilenameForPage(name: string) {
    const filenameWithExt = name[0].toUpperCase() + name.slice(1) + ".jsx";
    return filenameWithExt;
  }

  function getFilenameForPageCb(name: string) {
    return getFilenameForPage(name);
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
      source: `./pages/${getFilenameForPage(page.name)}`,
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

  function flushIndexJSX() {
    const indexJSXTemplateText = fs
      .readFileSync(indexJSXTemplatePath)
      .toString();
    const assetUrlCursorMatch = indexJSXTemplateText.match(/ASSET_URL_PREFIX/);
    if (!assetUrlCursorMatch) {
      console.log(
        `Failed to find asset_url cursor in template index.jsx file. Please report this error to Atri Labs.`
      );
      return;
    }
    const newText = replaceText(indexJSXTemplateText, [
      {
        index: assetUrlCursorMatch.index!,
        length: assetUrlCursorMatch[0].length,
        replaceWith: infos.build.assetUrlPrefix,
      },
    ]);
    fs.writeFileSync(indexJSXDestPath, newText);
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
        return `<Route path="${
          pageImport.route
        }" element={<${getPageComponentName(pageImport.name)} />} />`;
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
        `Failed to find import or route cursor in template App.jsx file. Please report this error to Atri Labs.`
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

  function getDependencies(): { [pkg: string]: string } {
    const reactAppPackageJSONObj = require(reactAppPackageJSON);
    const reactAppDependencies = reactAppPackageJSONObj["dependencies"] || {};
    return reactAppDependencies;
  }

  function getDevDependencies(): { [pkg: string]: string } {
    const reactAppPackageJSONObj = require(reactAppPackageJSON);
    const reactAppDevDependencies =
      reactAppPackageJSONObj["devDependencies"] || {};
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
    const slices: {
      index: number;
      length: number;
      replaceWith: string;
    }[] = [];
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
      const alias = pageComponentMap[compId].alias;
      const className = `className="p-${name} ${alias} bpt"`;
      if (isParent) {
        const start = `<${localIdentifier} ${className} {...${alias}Props} {...${alias}Cb} {...${alias}IoProps}>\n`;
        const mid = reverseMap[compId]
          .map((child) => {
            return createJSX(child.compId, pageComponentMap, reverseMap);
          })
          .join("");
        const end = `</${localIdentifier}>\n`;
        return start + mid + end;
      } else {
        const start = `<${localIdentifier} ${className} {...${alias}Props} {...${alias}Cb} {...${alias}IoProps}/>\n`;
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
        slices.push({
          index: jsxCursorMatch.index!,
          length: jsxCursorMatch[0].length,
          replaceWith: jsx,
        });
      }
    } else {
      console.log("jsx cursor not found");
    }
    // define component props, callbacks, refs etc.
    const componentCursorMatch = pageText.match(/\/\/\sCOMPONENT\sCURSOR.*\n/);
    if (componentCursorMatch) {
      const compIds = Object.keys(componentMap[name]);
      const def = compIds
        .map((compId) => {
          const comp = componentMap[name][compId];
          const alias = comp.alias;
          // component definition
          const propsDef = `const ${alias}Props = useStore((state)=>state["${name}"]["${alias}"]);`;
          const ioPropsDef = `const ${alias}IoProps = useIoStore((state)=>state["${name}"]["${alias}"]);`;
          const callbackDef = `const ${alias}Cb = use${alias}Cb()`;
          const def = `${propsDef}\n${ioPropsDef}\n${callbackDef}\n`;
          return def;
        })
        .join("");
      slices.push({
        index: componentCursorMatch.index!,
        length: componentCursorMatch[0].length,
        replaceWith: def,
      });
    } else {
      console.log("component cursor not found");
    }
    // create imports for the page
    const importCursorMatch = pageText.match(/\/\/\sIMPORT\sCURSOR.*\n/);
    if (importCursorMatch) {
      const currPageImports = pageImportMap[name];
      const sources = Object.keys(currPageImports);
      const compImports = sources
        .map((source) => {
          const importVars = currPageImports[source]
            .map((val) => {
              if (val.identifier === val.localIdentifier)
                return `${val.identifier}`;
              return `${val.identifier} as ${val.localIdentifier}`;
            })
            .join(", ");
          return `import { ${importVars} } from "${source}";`;
        })
        .join("\n");
      const importCbs =
        "import { " +
        Object.keys(componentMap[name])
          .map((compId) => {
            const alias = componentMap[name][compId].alias;
            return `use${alias}Cb`;
          })
          .join(", ") +
        ` } from "../page-cbs/${name}";`;
      const importPageCss = `import "../page-css/${name}.css";`;
      const importCustomIndex = `import "../custom/${name}";`;
      const newImportText = `${compImports}\n${importCbs}\n${importPageCss}\n${importCustomIndex}\n`;
      slices.push({
        index: importCursorMatch.index!,
        length: importCursorMatch[0].length,
        replaceWith: newImportText,
      });
    } else {
      console.log("import cursor not found");
    }
    const newText = replaceText(pageText, slices);
    fs.writeFileSync(pagePath, newText);
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
    // read template
    // although we expect copyTemplate to have been run already
    if (!fs.existsSync(path.dirname(useStoreDestPath))) {
      fs.mkdirSync(path.dirname(useStoreDestPath), { recursive: true });
    }
    // copy useStore again (in case it's polluted)
    const useStoreTemplateText = fs
      .readFileSync(useStoreTemplatePath)
      .toString();

    // create slices
    const slices: { index: number; length: number; replaceWith: string }[] = [];
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
        const breakpointProps =
          propsMap[pageName] &&
          propsMap[pageName][compId] &&
          propsMap[pageName][compId].breakpointProps
            ? propsMap[pageName][compId].breakpointProps!
            : {};
        return { alias, props, breakpointProps };
      });
      return { propsForPage, pageName };
    });
    // create desktop mode props to put in useStore
    const desktopPropsData: { [pageName: string]: { [alias: string]: any } } =
      {};
    propsForAllPages.forEach((propsForPage) => {
      const aliasPropsMap: { [alias: string]: any } = {};
      propsForPage.propsForPage.forEach((aliasProps) => {
        aliasPropsMap[aliasProps.alias] = aliasProps.props;
      });
      desktopPropsData[propsForPage.pageName] = aliasPropsMap;
    });
    const dataCursor1Match = useStoreTemplateText.match(
      /\/\*\sDATA\s1\sCURSOR.*\n/
    );
    if (dataCursor1Match) {
      slices.push({
        index: dataCursor1Match.index!,
        length: dataCursor1Match[0].length,
        replaceWith: `...${JSON.stringify(desktopPropsData, null, 2)}`,
      });
    } else {
      console.log("useStore data cursor match is null");
    }

    // write slices
    const newText = replaceText(useStoreTemplateText, slices);
    fs.writeFileSync(useStoreDestPath, newText);
  }

  async function _flushPageCSS(pageImport: {
    name: string;
    route: string;
    source: string;
  }) {
    const pageName = pageImport.name;
    const pagePropsGeneartorOutput = propsMap[pageName];
    const components = componentMap[pageName]!;
    const componentIds = Object.keys(components);
    const promises = componentIds.map(async (compId) => {
      const alias = components[compId].alias;
      const cssSelector = `.p-${pageName}.${alias}`;
      const cssProps = pagePropsGeneartorOutput[compId].cssProps;
      if (cssProps) {
        const allCSSPropNames = Object.keys(cssProps);
        let jsxStyle: React.CSSProperties = {};
        allCSSPropNames.forEach((propName) => {
          jsxStyle = { ...cssProps[propName].props, ...jsxStyle };
        });
        const cssStr = await jssToCss(jsxStyle);
        return `${cssSelector} {\n${cssStr}\n}`;
      }
    });
    const cssStrs = await Promise.all(promises);
    // breakpoints
    const breakpointData: {
      [maxWidth: string]: { [cssSelector: string]: string };
    } = {};
    const breakpointPromises = componentIds.map(async (compId) => {
      const alias = components[compId].alias;
      const cssSelector = `.p-${pageName}.${alias}.bpt`;
      const cssProps = pagePropsGeneartorOutput[compId].cssProps;
      if (cssProps) {
        const allCSSPropNames = Object.keys(cssProps);
        for (let i = 0; i < allCSSPropNames.length; i++) {
          const propName = allCSSPropNames[i];
          if (cssProps[propName].breakpoints) {
            const allWidths = Object.keys(cssProps[propName].breakpoints);
            for (let j = 0; j < allWidths.length; j++) {
              const width = allWidths[j];
              if (breakpointData[width] === undefined) {
                breakpointData[width] = {};
              }
              breakpointData[width][cssSelector] = await jssToCss(
                cssProps[propName].breakpoints[width]!
              );
            }
          }
        }
      }
    });
    await Promise.all(breakpointPromises);
    const breakpointStrs = Object.keys(breakpointData)
      // Sorting breakpoints in reverse order to fix issue #449
      .sort((a, b) => {
        return parseInt(b) - parseInt(a);
      })
      .map((maxWidth) => {
        const allSelectors = Object.keys(breakpointData[maxWidth]);
        const allSelectorStrs = allSelectors
          .map((selector) => {
            return `\t${selector} {\n${breakpointData[maxWidth][selector]}\n\t}`;
          })
          .join("\n");
        return `@media screen and (max-width: ${maxWidth}px) {\n${allSelectorStrs}\n}`;
      })
      .join("\n");
    const pageCSSContent =
      cssStrs
        .filter((cssStr) => {
          return cssStr !== undefined;
        })
        .join("\n") +
      "\n" +
      breakpointStrs;
    const destPath = path.resolve(pageCSSDestDirectory, `${pageName}.css`);
    if (!fs.existsSync(path.dirname(destPath))) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
    }
    fs.writeFileSync(destPath, pageCSSContent);
  }

  async function flushPageCSS() {
    for (let i = 0; i < pageImports.length; i++) {
      const pageImport = pageImports[i];
      await _flushPageCSS(pageImport);
    }
  }

  // This function requires addComponents and addProps to already have been run
  function flushIoStore() {
    const pageNames = Object.keys(componentMap);
    const propsForAllPages = pageNames.map((pageName) => {
      const components = componentMap[pageName]!;
      const componentIds = Object.keys(components);
      const propsForPage = componentIds.map((compId) => {
        const alias = components[compId].alias;
        const props =
          propsMap[pageName] &&
          propsMap[pageName][compId] &&
          propsMap[pageName][compId].ioProps
            ? propsMap[pageName][compId].ioProps
            : undefined;
        return { alias, props };
      });
      return { propsForPage, pageName };
    });
    // create data to put in useStore
    const useIoStoreData: { [pageName: string]: { [alias: string]: any } } = {};
    propsForAllPages.forEach((propsForPage) => {
      const aliasPropsMap: { [alias: string]: any } = {};
      propsForPage.propsForPage.forEach((aliasProps) => {
        // add props only if component has ioProps field
        if (aliasProps.props)
          aliasPropsMap[aliasProps.alias] = aliasProps.props;
      });
      useIoStoreData[propsForPage.pageName] = aliasPropsMap;
    });
    // although we expect copyTemplate to have been run already
    if (!fs.existsSync(path.dirname(useIoStoreDestPath))) {
      fs.mkdirSync(path.dirname(useIoStoreDestPath), { recursive: true });
    }
    // copy useStore again (in case it's polluted)
    const useIoStoreTemplateText = fs
      .readFileSync(useIoStoreTemplatePath)
      .toString();
    const dataCursorMatch =
      useIoStoreTemplateText.match(/\/\/\sDATA\sCURSOR\n/);
    if (dataCursorMatch) {
      const newText = replaceText(useIoStoreTemplateText, [
        {
          index: dataCursorMatch.index!,
          length: dataCursorMatch[0].length,
          replaceWith: `return ${JSON.stringify(useIoStoreData, null, 2)}`,
        },
      ]);
      fs.writeFileSync(useIoStoreDestPath, newText);
    } else {
      console.log("useIoStore data cursor match is null");
    }
  }

  // add dependencies to destination package.json
  let dependencies: { [pkg: string]: string } = {};
  let devDependencies: { [pkg: string]: string } = {};
  function patchDependencies(deps: { [pkg: string]: string }) {
    dependencies = { ...dependencies, ...deps };
  }

  function patchDevDependencies(deps: { [pkg: string]: string }) {
    devDependencies = { ...devDependencies, ...deps };
  }

  function flushPatchedPackageJSON() {
    // Do not write package.json if already exists
    if (fs.existsSync(paths.reactAppPackageJSONDest)) {
      return;
    }
    const reactAppPackageJSONObj = require(reactAppPackageJSON);
    reactAppPackageJSONObj["dependencies"] = {
      ...reactAppPackageJSONObj["dependencies"],
      ...dependencies,
    };
    reactAppPackageJSONObj["devDependencies"] = {
      ...reactAppPackageJSONObj["devDependencies"],
      ...devDependencies,
    };
    fs.writeFileSync(
      paths.reactAppPackageJSONDest,
      JSON.stringify(reactAppPackageJSONObj, null, 2)
    );
  }

  // flush atri-build-info.json
  function flushAtriBuildInfo(manifestDirs: ToolConfig["manifestDirs"]) {
    const dest = path.resolve(paths.reactAppRootDest, atriAppBuildInfoFilename);
    if (fs.existsSync(dest)) {
      return;
    }

    const buildInfoTemplate = JSON.parse(
      fs.readFileSync(atriAppBuildInfoTemplateFilepath).toString()
    );
    buildInfoTemplate["manifestDirs"] = manifestDirs;
    if (!fs.existsSync(paths.reactAppRootDest)) {
      fs.mkdirSync(paths.reactAppRootDest);
    }
    fs.writeFileSync(dest, JSON.stringify(buildInfoTemplate, null, 2));
  }

  // flush atri-server-info.json
  function flushAtriServerInfo() {
    const serverInfoTemplate = JSON.parse(
      fs.readFileSync(atriAppServerInfoTemplateFilepath).toString()
    );
    serverInfoTemplate["pages"] = {};
    pageImports.forEach((pageImport) => {
      serverInfoTemplate["pages"][pageImport.route] = { name: pageImport.name };
    });
    const dest = path.resolve(
      paths.reactAppRootDest,
      atriAppServerInfoFilename
    );
    // add asset url and directory
    serverInfoTemplate["publicUrlAssetMap"] = {
      [assetManager.urlPath]: path.relative(
        paths.reactAppRootDest,
        path.resolve(assetManager.assetsDir)
      ),
    };
    if (!fs.existsSync(paths.reactAppRootDest)) {
      fs.mkdirSync(paths.reactAppRootDest);
    }
    // merge it with previously generated atri-server-info.json file if it exists
    let finalServerInfo: any = { ...serverInfoTemplate };
    if (fs.existsSync(dest)) {
      const oldServerInfo = JSON.parse(fs.readFileSync(dest).toString());
      finalServerInfo = {
        ...oldServerInfo,
        pages: serverInfoTemplate["pages"],
        publicUrlAssetMap: serverInfoTemplate["publicUrlAssetMap"],
      };
    }
    fs.writeFileSync(dest, JSON.stringify(finalServerInfo, null, 2));
  }

  // flush atri-server-info.json
  function flushAtriAppInfo() {
    const dest = path.resolve(paths.reactAppRootDest, atriAppInfoFilename);
    // do nothing if already exists
    if (fs.existsSync(dest)) {
      return;
    }
    if (!fs.existsSync(paths.reactAppRootDest)) {
      fs.mkdirSync(paths.reactAppRootDest);
    }
    const appInfoTemplate = fs
      .readFileSync(atriAppInfoTemplateFilepath)
      .toString();
    fs.writeFileSync(dest, appInfoTemplate);
  }

  function addCallbacks(
    page: { name: string },
    callbacks: CallbackGeneratorOutput
  ) {
    if (callbacksMap[page.name]) {
      callbacksMap[page.name] = { ...callbacksMap[page.name], ...callbacks };
    } else {
      callbacksMap[page.name] = callbacks;
    }
  }

  function _flushPageCbs(pageImport: {
    name: string;
    route: string;
    source: string;
  }) {
    /**
     * function usealias1Cbs(){
     *  const onClick = useCallback(()=>{
     *      callbackFactory("${alias}", "${pageName}",
     *        JSON.parse(JSON.stringify(callbackMap[alias]["onClick"], null, 2)))
     *  }, [])
     *  return { onClick }
     * }
     *
     * function usealias2Cbs(){
     *  const onClick = useCallback(()=>{
     *      callbackFactory("${alias}", "${pageName}", JSON.parse(JSON.stringify(callbackMap[alias]["onClick"], null, 2)))
     *  }, [])
     *  return { onClick }
     * }
     */
    const pageName = pageImport.name;
    const pageRoute = pageImport.route;
    const pageCallbackMap = callbacksMap[pageName];
    const compIds = Object.keys(pageCallbackMap);
    const importStatements = [
      `import { useCallback } from "react";`,
      `import { callbackFactory } from "../utils/callbackFactory";`,
    ].join("\n");
    const useHookFns = compIds
      .map((compId) => {
        if (componentMap[pageName][compId] === undefined) {
          return "";
        }
        const alias = componentMap[pageName][compId].alias;
        const callbackNames = Object.keys(pageCallbackMap[compId].callbacks);
        const hookBody = callbackNames
          .map((callbackName) => {
            return `\tconst ${callbackName} = useCallback(callbackFactory("${alias}", "${pageName}", "${pageRoute}", "${callbackName}", \n\t\t\t${JSON.stringify(
              pageCallbackMap[compId].callbacks[callbackName],
              null,
              2
            )}), [])`;
          })
          .join("\n");
        const returnStatement = `\treturn { ${callbackNames.map(
          (name) => name
        )} }`;
        return `export function use${alias}Cb() {\n${hookBody}\n${returnStatement}\n}`;
      })
      .join("\n");
    const pageCbContent = `${importStatements}\n${useHookFns}`;
    const destPath = path.resolve(pageCbsDestDirectory, `${pageName}.js`);
    if (!fs.existsSync(path.dirname(destPath))) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
    }
    fs.writeFileSync(destPath, pageCbContent);
  }

  function flushPageCbs() {
    pageImports.forEach((pageImport) => {
      _flushPageCbs(pageImport);
    });
  }

  const resources: ResourceGeneraterOutput = [];

  function addResources(output: ResourceGeneraterOutput) {
    resources.push(...output);
  }

  function flushIndexHtml() {
    const styleTags: string[] = [];

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      if (resource.method === "css") {
        const styleTag = `<style>${resource.str}</style>`;
        styleTags.push(styleTag);
      }
    }

    const styleTagStrs = styleTags.join("\n\t\t");
    const indexHtmlContent = fs
      .readFileSync(paths.reactAppIndexHtmlTemplate)
      .toString();
    const resourceCursorMatch = indexHtmlContent.match(
      /<!-- RESOURCE CURSOR -->/
    );
    if (resourceCursorMatch) {
      const newText = replaceText(indexHtmlContent, [
        {
          index: resourceCursorMatch.index!,
          length: resourceCursorMatch[0].length,
          replaceWith: styleTagStrs,
        },
      ]);
      fs.writeFileSync(paths.reactAppIndexHtmlDest, newText);
    } else {
      console.log("Resource Cursor not found in index.html");
    }
  }

  function createCustomCodeDirectories() {
    pageImports.forEach((pageImport) => {
      const dirName = path.resolve(customCodeDestDirectory, pageImport.name);
      const indexFilePath = path.resolve(dirName, "index.ts");
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }
      if (!fs.existsSync(indexFilePath)) {
        fs.writeFileSync(indexFilePath, "");
      }
    });
  }

  return {
    copyTemplate,
    createPage,
    addPageToApp,
    flushAppJSX,
    getDependencies,
    getDevDependencies,
    patchDependencies,
    patchDevDependencies,
    addComponents,
    flushPages,
    addProps,
    flushStore,
    flushAtriBuildInfo,
    flushPatchedPackageJSON,
    flushAtriServerInfo,
    addCallbacks,
    flushPageCbs,
    flushIoStore,
    addResources,
    flushIndexHtml,
    flushAtriAppInfo,
    flushIndexJSX,
    flushPageCSS,
    createCustomCodeDirectories,
  };
}
