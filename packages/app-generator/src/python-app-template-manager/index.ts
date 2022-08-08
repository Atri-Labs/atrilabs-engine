import { PythonStubGeneratorOutput } from "../types";
import path from "path";
import fs from "fs";
import { getFiles } from "@atrilabs/scripts";

const setEventDef =
  `\tdef set_event(self, event):\n` +
  `\t\tself.event_data = event["event_data"]\n` +
  `\t\talias = event["alias"]\n` +
  `\t\tcallback_name = event["callback_name"]\n` +
  `\t\tcomp = getattr(self, alias)\n` +
  `\t\tsetattr(comp, callback_name, True)`;

const UploadFileType = "Optional[List[UploadFile]]";

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
      callbackNames: string[];
      attrs: { name: string; type: string; isIoPropInstance: boolean }[];
      isIoPropClass: boolean;
    }[] = [];
    const varClassMap: { [varName: string]: string } = {};
    function addClassTask(
      className: string,
      value: any,
      callbackNames: string[],
      ioProps?: PythonStubGeneratorOutput["vars"]["0"]["ioProps"]
    ) {
      const attrs: { name: string; type: string; isIoPropInstance: boolean }[] =
        [];
      const attrNames = Object.keys(value);
      attrNames.forEach((attrName) => {
        switch (typeof value[attrName]) {
          case "string":
            attrs.push({
              name: attrName,
              type: "str",
              isIoPropInstance: false,
            });
            break;
          case "boolean":
            attrs.push({
              name: attrName,
              type: "bool",
              isIoPropInstance: false,
            });
            break;
          case "number":
            attrs.push({
              name: attrName,
              type: "int",
              isIoPropInstance: false,
            });
            break;
          case "object":
            if (value[attrName] === null) {
              console.log("null values are not accepted");
            }
            if (Array.isArray(value[attrName])) {
              attrs.push({
                name: attrName,
                type: "List[Any]",
                isIoPropInstance: false,
              });
            } else {
              const childClassName = `${className}${attrName}Class`;
              attrs.push({
                name: attrName,
                type: childClassName,
                isIoPropInstance: false,
              });
              // sub-classes don't have callbacks, hence, empty array [] is passed
              addClassTask(childClassName, value[attrName], []);
            }
            break;
        }
      });
      // add attributes from ioProps
      // it will be a double loop
      if (ioProps) {
        const attrNames = Object.keys(ioProps);
        attrNames.forEach((attrName) => {
          // add attribute to parent class
          const childClassName = `${className}${attrName}Class`;
          attrs.push({
            name: attrName,
            type: childClassName,
            isIoPropInstance: true,
          });
          const subAttrNames = Object.keys(ioProps[attrName]);
          const childAttrs: { name: string; type: string }[] = [];
          subAttrNames.forEach((subAttrName) => {
            const subAttr = ioProps[attrName][subAttrName];
            if (subAttr.type === "files" && subAttr.mode === "upload") {
              childAttrs.push({
                type: UploadFileType,
                name: subAttrName,
              });
            }
          });
          // add a class task for each attribute of ioProps
          classTasks.push({
            className: childClassName,
            attrs: childAttrs.map((attr) => {
              return { ...attr, isIoPropInstance: false };
            }),
            callbackNames: [],
            isIoPropClass: true,
          });
        });
      }
      classTasks.push({
        className,
        attrs,
        callbackNames,
        isIoPropClass: false,
      });
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
      // TODO: pass variable.ioProp as well
      addClassTask(
        className,
        variable.value,
        Object.keys(variable.callbacks),
        variable.ioProps
      );
      varClassMap[variableName] = className;
    });
    const importStatements = [
      "import json",
      "from typing import List, Any, Optional",
      "from fastapi import UploadFile",
    ].join("\n");
    const defaultValueMap: any = {};
    Object.keys(output.vars).forEach((currVar) => {
      defaultValueMap[currVar] = output.vars[currVar].value;
    });
    const defaultStateStatement = `default_state = json.loads('${JSON.stringify(
      defaultValueMap
    )}')`;
    const getDefinedValueDefStatement = `def get_defined_value(state, def_state, key):\n\treturn state[key] if key in state else def_state[key]`;
    const classStatements = classTasks
      .map((classTask) => {
        const { className, attrs, callbackNames } = classTask;
        const callbackStatements = callbackNames
          .map((callbackName) => {
            return `\t\t\tself.${callbackName} = False`;
          })
          .join("\n");
        const attrStatements = attrs
          .map((attr) => {
            // if type is not str | int | bool | UploadFileType then it's a class
            // decide type prefix
            const typePrefix =
              attr.type === "str" ||
              attr.type === "int" ||
              attr.type === "bool" ||
              attr.type === UploadFileType ||
              attr.type === "List[Any]"
                ? ""
                : "Atri.__";
            // decide rhs
            let rhs = `get_defined_value(state, def_state, "${attr.name}")`;
            if (attr.type === UploadFileType) {
              rhs = `None`;
            } else if (typePrefix === "Atri.__") {
              // python adds _Atri for all inner classes
              if (attr.isIoPropInstance) {
                rhs = `Atri._Atri__${attr.type}()`;
              } else {
                rhs = `Atri._Atri__${attr.type}(${rhs}, def_state["${attr.name}"])`;
              }
            }
            return `\t\t\tself.${attr.name}: ${typePrefix}${attr.type} = ${rhs}`;
          })
          .join("\n");
        const initBody =
          attrs.length === 0 && callbackNames.length === 0
            ? "\t\t\tpass"
            : `${callbackStatements}\n${attrStatements}`;
        // decide init definition
        const initDef = classTask.isIoPropClass
          ? `__init__(self)`
          : `__init__(self, state, def_state)`;
        return `\tclass __${className}:\n\t\tdef ${initDef}:\n${initBody}`;
      })
      .join("\n");
    const AtriClassInitBody =
      `\t\tself.event_data = None\n` +
      `\t\tglobal default_state\n` +
      (Object.keys(varClassMap)
        .map((varName) => {
          const className = varClassMap[varName];
          return `\t\tself.${varName} = self.__${className}(state["${varName}"], default_state["${varName}"])`;
        })
        .join("\n") || "\t\tpass");
    const AtriClassInitDef = `\tdef __init__(self, state: Any):\n${AtriClassInitBody}`;
    const AtriClassDef = `class Atri:\n${AtriClassInitDef}\n${setEventDef}\n${classStatements}`;
    const newText =
      importStatements +
      "\n" +
      defaultStateStatement +
      "\n" +
      getDefinedValueDefStatement +
      "\n" +
      AtriClassDef;
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
  function copyTemplate(overwrite: boolean) {
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
      if (
        (fs.existsSync(destFilename) && overwrite) ||
        !fs.existsSync(destFilename)
      ) {
        fs.writeFileSync(destFilename, fs.readFileSync(file));
      }
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
      fs.mkdirSync(path.dirname(outputRouteMainPyPath), { recursive: true });
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
    return fs.existsSync(outputRouteMainPyPath);
  }
  function createMainPyRecursively(page: { name: string; route: string }) {
    // routesSplits for /a/b/c will be ["", "a", "b", "c"], notice the first empty string
    const routeSplits = page.route.split("/");
    for (let i = routeSplits.length; i > 0; i--) {
      const currRoute = "/" + routeSplits.slice(1, i).join("/");
      if (!mainPyFileExists({ name: page.name, route: currRoute })) {
        createMainPyFile({ name: page.name, route: currRoute });
      }
    }
  }
  // CAUTION: This will overridde existing main.py file
  function createInitPyFile(page: { name: string; route: string }) {
    const outputRouteInitPyPath = path.resolve(
      paths.controllers,
      "routes",
      page.route.replace(/^([\/]*)/, ""),
      "__init__.py"
    );
    if (!fs.existsSync(path.dirname(outputRouteInitPyPath))) {
      fs.mkdirSync(path.dirname(outputRouteInitPyPath), { recursive: true });
    }
    fs.writeFileSync(outputRouteInitPyPath, "");
  }
  function initPyFileExists(page: { name: string; route: string }) {
    const outputRouteInitPyPath = path.resolve(
      paths.controllers,
      "routes",
      page.route.replace(/^([\/]*)/, ""),
      "__init__.py"
    );
    return fs.existsSync(outputRouteInitPyPath);
  }
  function createInitPyRecursively(page: { name: string; route: string }) {
    // routesSplits for /a/b/c will be ["", "a", "b", "c"], notice the first empty string
    const routeSplits = page.route.split("/");
    for (let i = routeSplits.length; i > 0; i--) {
      const currRoute = "/" + routeSplits.slice(1, i).join("/");
      if (!initPyFileExists({ name: page.name, route: currRoute })) {
        createInitPyFile({ name: page.name, route: currRoute });
      }
    }
  }
  function controllersDirExists() {
    return fs.existsSync(path.resolve(paths.controllers));
  }
  function serverPyExists() {
    return fs.existsSync(path.resolve(paths.controllers, "server.py"));
  }
  return {
    addVariables,
    flushAtriPyFiles,
    copyTemplate,
    createMainPyFile,
    mainPyFileExists,
    createMainPyRecursively,
    createInitPyFile,
    initPyFileExists,
    createInitPyRecursively,
    controllersDirExists,
    serverPyExists,
  };
}
