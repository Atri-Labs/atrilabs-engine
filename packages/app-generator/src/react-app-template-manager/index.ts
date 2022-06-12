import { getFiles } from "../utils";
import path from "path";
import fs from "fs";

export function createReactAppTemplateManager(paths: {
  reactAppTemplate: string;
  reactAppDest: string;
}) {
  const pagesDirectory = path.resolve(paths.reactAppDest, "src", "pages");
  const examplePageFile = path.resolve(pagesDirectory, "Example.jsx");
  const examplePageFileText = fs.readFileSync(examplePageFile).toString();
  const appJSXTemplatePath = path.resolve(
    paths.reactAppTemplate,
    "src",
    "App.jsx"
  );

  // variables to manage writes in App.jsx
  const pageImports: { name: string; route: string; source: string }[] = [];

  function copyTemplate() {
    const files = getFiles(paths.reactAppTemplate);
    files.forEach((file) => {
      // file from pages directory should not be copied
      if (file.match(pagesDirectory)) {
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
    if (!fs.existsSync(pagesDirectory)) {
      fs.mkdirSync(pagesDirectory);
    }
  }

  function getFilenameForPage(name: string) {
    const filenameWithExt = name[0].toUpperCase() + name.slice(1) + ".jsx";
    return filenameWithExt;
  }

  function getPageComponentName(name: string) {
    return name[0].toUpperCase() + name.slice(1);
  }

  function createPage(name: string) {
    const filenameWithExt = getFilenameForPage(name);
    fs.writeFileSync(
      path.resolve(pagesDirectory, filenameWithExt),
      examplePageFileText.replace("Example", getPageComponentName(name))
    );
  }

  function addPageToApp(page: { name: string; route: string }) {
    pageImports.push({
      name: page.name,
      route: page.route,
      source: path.resolve(pagesDirectory, getFilenameForPage(page.name)),
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
      else if (i === slice.length - 1) {
        const prevSlice = slices[i - 1];
        newPieces.push(
          initial.slice(prevSlice.index + prevSlice.length, slice.index)
        );
        newPieces.push(initial.slice(slice.index + slice.length));
      } else {
        const prevSlice = slices[i - 1];
        newPieces.push(
          initial.slice(prevSlice.index + prevSlice.length, slice.index)
        );
      }
    }
    for (let i = 0; i < slices.length; i++) {
      const slice = slices[i];
      newPieces.splice(i + 1, 0, slice.replaceWith);
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
    const importCursorMatch = appJSXTemplateText.match(/\/\/\sIMPORT CURSOR\n/);
    const routeCursorMatch = appJSXTemplatePath.match(
      /\{\/\*\sROUTE CURSOR.*\n/
    );
    if (!importCursorMatch || !routeCursorMatch) {
      console.log(
        `Failed to find import cursor or route cursor in template App.jsx file. Please report this error to Atri Labs.`
      );
      return;
    }
    replaceText(appJSXTemplateText, [
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
  };
}
