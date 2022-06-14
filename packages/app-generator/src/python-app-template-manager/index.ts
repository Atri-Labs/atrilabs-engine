import { PythonStubGeneratorOutput } from "../types";
import path from "path";
import fs from "fs";

export function createPythonAppTemplateManager(
  paths: { controllers: string },
  pages: { name: string; route: string }[]
) {
  const variableMap: {
    [pageName: string]: { output: PythonStubGeneratorOutput };
  } = {};
  function addVariables(pageName: string, output: PythonStubGeneratorOutput) {
    variableMap[pageName] = { output };
  }
  function flushAtriPyFile(page: { name: string; route: string }) {
    /**
     * file://route/atri.py
     * import json
     *
     * Flex1 = {
     *    style: {
     *        display: "flex"
     *    }
     * }
     *
     * def updateState(state):
     *    global Flex1
     *    Flex1 = state["Flex1"]
     *
     * def getState():
     *    global Flex1
     *    return json.dumps({"Flex1": Flex1})
     */
    function createPrimitive(value: any): string {
      switch (typeof value) {
        case "string":
          return `"${value}"`;
        case "boolean":
          return value === true ? "True" : "False";
        case "number":
          return `${value}`;
      }
      return "0";
    }
    function createArray(values: any[]): string {
      /**
       * [value1, value2]
       */
      const arrStr =
        "[" +
        values
          .map((value) => {
            return createValue(value);
          })
          .join("") +
        "]";
      return arrStr;
    }
    function createDict(obj: { [key: string]: any }): string {
      /**
       * {"key1": value1, "key2": value2}
       */
      const keys = Object.keys(obj);
      const dictStr =
        "{" +
        keys
          .map((key, index) => {
            if (index === keys.length - 1) {
              return `"${key}": ${createValue(obj[key])}`;
            }
            return `"${key}": ${createValue(obj[key])}, `;
          })
          .join("") +
        "}";
      return dictStr;
    }
    function createValue(
      variableValue: PythonStubGeneratorOutput["vars"]["0"]["value"]
    ): string {
      let valStr = "";
      switch (typeof variableValue) {
        case "object":
          if (variableValue === null) {
            console.log("null values are not accepted");
          }
          if (Array.isArray(variableValue)) {
            valStr = createArray(variableValue);
          } else {
            valStr = createDict(variableValue);
          }
          break;
        case "number":
        case "boolean":
        case "string":
          valStr = createPrimitive(variableValue);
          break;
      }
      return valStr;
    }
    function createVariable(
      variableName: string,
      variable: PythonStubGeneratorOutput["vars"]["0"]
    ) {
      const variableValue = variable.value;
      return `${variableName} = ${createValue(variableValue)}`;
    }
    const { output } = variableMap[page.name];
    const outputPath = path.resolve(paths.controllers, page.route);
    const variableNames = Object.keys(output.vars);
    const variableDefStatements = variableNames
      .map((variableName) => {
        const variableValue = output.vars[variableName];
        return createVariable(variableName, variableValue) + "\n";
      })
      .join("");
    const importStatements = ["import json\n"].join("");
    const newText = importStatements + "\n" + variableDefStatements;
    fs.writeFileSync(outputPath, newText);
  }
  function flushAtriPyFiles() {
    pages.forEach((page) => {
      flushAtriPyFile(page);
    });
  }
  return { addVariables, flushAtriPyFiles };
}
