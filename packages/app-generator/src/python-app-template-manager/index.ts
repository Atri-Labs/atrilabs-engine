import { PythonStubGeneratorOutput } from "../types";
import path from "path";
import fs from "fs";
import { getFiles } from "@atrilabs/scripts";

export function createPythonAppTemplateManager(
  paths: { controllers: string; pythonAppTemplate: string },
  pages: { name: string; route: string }[]
) {
  const routeMainPyTemplatePath = path.resolve(
    paths.pythonAppTemplate,
    "routes",
    "main.py"
  );
  const variableMap: {
    [pageName: string]: { output: PythonStubGeneratorOutput };
  } = {};
  function addVariables(pageName: string, output: PythonStubGeneratorOutput) {
    variableMap[pageName] = { output };
  }
  function flushAtriPyFile(page: { name: string; route: string }) {
    const classTasks: {
      className: string;
      attrs: { name: string; type: string }[];
    }[] = [];
    const varClassMap: { [varName: string]: string } = {};
    function addClassTask(className: string, value: any) {
      const attrs: { name: string; type: string }[] = [];
      const attrNames = Object.keys(value);
      attrNames.forEach((attrName) => {
        switch (typeof value[attrName]) {
          case "string":
            attrs.push({ name: attrName, type: "str" });
            break;
          case "boolean":
            attrs.push({ name: attrName, type: "bool" });
            break;
          case "number":
            attrs.push({ name: attrName, type: "int" });
            break;
          case "object":
            if (value[attrName] === null) {
              console.log("null values are not accepted");
            }
            if (Array.isArray(value[attrName])) {
              attrs.push({ name: attrName, type: "List[Any]" });
            } else {
              const childClassName = `${className}${attrName}Class`;
              attrs.push({ name: attrName, type: childClassName });
              addClassTask(childClassName, value[attrName]);
            }
            break;
        }
      });
      classTasks.push({ className, attrs });
    }
    const { output } = variableMap[page.name];
    const outputRoutePath = path.resolve(
      paths.controllers,
      "routes",
      page.route.replace(/^([\/]*)/, ""),
      "atri.py"
    );
    const variableNames = Object.keys(output.vars);
    variableNames.forEach((variableName) => {
      const variable = output.vars[variableName];
      const className = `${variableName}Class`;
      addClassTask(className, variable.value);
      varClassMap[variableName] = className;
    });
    const importStatements = [
      "import json",
      "from typing import List, Any",
    ].join("\n");
    const classStatements = classTasks
      .map((classTask) => {
        const { className, attrs } = classTask;
        const attrStatements = attrs
          .map((attr) => {
            return `\t\tself.${attr.name}: ${attr.type} = state["${attr.name}"]`;
          })
          .join("\n");
        const initBody = attrs.length === 0 ? "\t\tpass" : attrStatements;
        return `class ${className}:\n\tdef __init__(self, state):\n${initBody}`;
      })
      .join("\n");
    const createStateDefBody = Object.keys(varClassMap)
      .map((varName) => {
        return `\tglobal ${varName}\n\t${varName} = ${varClassMap[varName]}(state)`;
      })
      .join("\n");
    const createStateDef = `def create_state(state):\n${createStateDefBody}`;
    const jsonifyBodyPart1 = Object.keys(varClassMap)
      .map((varName) => {
        return `\tglobal ${varName}`;
      })
      .join("\n");
    const jsonifyBodyPart2 = Object.keys(varClassMap)
      .map((varName) => {
        return `"${varName}": ${varName}.__dict__`;
      })
      .join(", ");
    const jsonifyDef = `def jsonify(state):\n${jsonifyBodyPart1}\n\treturn json.dumps({${jsonifyBodyPart2}})`;
    const newText =
      importStatements +
      "\n" +
      classStatements +
      "\n" +
      createStateDef +
      "\n" +
      jsonifyDef;
    if (!fs.existsSync(path.dirname(outputRoutePath))) {
      fs.mkdirSync(path.dirname(outputRoutePath), { recursive: true });
    }
    fs.writeFileSync(outputRoutePath, newText);
  }
  function flushAtriPyFiles() {
    pages.forEach((page) => {
      flushAtriPyFile(page);
    });
  }
  function copyTemplate() {
    const files = getFiles(paths.pythonAppTemplate);
    files.forEach((file) => {
      const dirname = path.dirname(file);
      const relativeDirname = path.relative(paths.pythonAppTemplate, dirname);
      const destDirname = path.resolve(paths.controllers, relativeDirname);
      const relativeFilename = path.relative(paths.pythonAppTemplate, file);
      const destFilename = path.resolve(paths.controllers, relativeFilename);
      if (!fs.existsSync(destDirname)) {
        fs.mkdirSync(destDirname, { recursive: true });
      }
      fs.writeFileSync(destFilename, fs.readFileSync(file));
    });
  }
  // CAUTION: This will overridde existing main.py file
  function createMainPyFile(page: { name: string; route: string }) {
    const outputRouteMainPyPath = path.resolve(
      paths.controllers,
      "routes",
      page.route.replace(/^([\/]*)/, ""),
      "main.py"
    );
    if (!fs.existsSync(path.dirname(outputRouteMainPyPath))) {
      fs.mkdirSync(path.dirname(outputRouteMainPyPath));
    }
    fs.writeFileSync(
      outputRouteMainPyPath,
      fs.readFileSync(routeMainPyTemplatePath)
    );
  }
  function mainPyFileExists(page: { name: string; route: string }) {
    const outputRouteMainPyPath = path.resolve(
      paths.controllers,
      "routes",
      page.route.replace(/^([\/]*)/, ""),
      "main.py"
    );
    if (fs.existsSync(outputRouteMainPyPath)) {
      return true;
    }
    return false;
  }
  // CAUTION: This will overridde existing main.py file
  function createInitPyFile(page: { name: string; route: string }) {
    const outputRouteMainPyPath = path.resolve(
      paths.controllers,
      "routes",
      page.route.replace(/^([\/]*)/, ""),
      "__init__.py"
    );
    if (!fs.existsSync(path.dirname(outputRouteMainPyPath))) {
      fs.mkdirSync(path.dirname(outputRouteMainPyPath));
    }
    fs.writeFileSync(
      outputRouteMainPyPath,
      fs.readFileSync(routeMainPyTemplatePath)
    );
  }
  function initPyFileExists(page: { name: string; route: string }) {
    const outputRouteMainPyPath = path.resolve(
      paths.controllers,
      "routes",
      page.route.replace(/^([\/]*)/, ""),
      "__init__.py"
    );
    if (fs.existsSync(outputRouteMainPyPath)) {
      return true;
    }
    return false;
  }
  return {
    addVariables,
    flushAtriPyFiles,
    copyTemplate,
    createMainPyFile,
    mainPyFileExists,
    createInitPyFile,
    initPyFileExists,
  };
}
