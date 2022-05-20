/**
 *
 * @param {babel.NodePath.Specifiers} specifiers
 * @param {babel.types} types
 * @returns {{imported: string | undefined, local: string}[]}
 */
function generateImportList(specifiers, types) {
  const importList = [];
  for (let i = 0; i < specifiers.length; i++) {
    const spec = specifiers[i];
    if (types.isImportDefaultSpecifier(spec)) {
      importList.push({ local: spec.get("local").node.name });
    } else {
      importList.push({
        local: spec.get("local").node.name,
        imported: spec.get("imported").node.name,
      });
    }
  }
  return importList;
}

/**
 *
 * @param {"Shim.React" | "Shim.ReactRuntime"} shimPrefix
 * @param {{imported: string | undefined, local: string}[]} importList
 * @returns
 */
function replaceWithShim(shimPrefix, importList) {
  const strs = [];
  for (let i = 0; i < importList.length; i++) {
    const imported = importList[i].imported;
    const local = importList[i].local;
    let str = `const ${local} = ${shimPrefix}`;
    if (imported) str = `${str}.${imported};`;
    else str = `${str};`;
    strs.push(str);
  }
  return strs;
}

function importShimStr() {
  return `import { Shim } from "./shims";`;
}

/**
 * This plugin converts the following:
 * Source - import {useState} from "react";
 * Output - import {Shim} from "./shims";
 *          const useState = Shim.React.useState;
 *
 * Source - import {jsx as _jsx} from "react/jsx-runtime";
 * Output - import {Shim} from "./shims";
 *          const _jsx = Shim.ReactRuntime.jsx;
 * @param {babel} babel
 * @returns
 */
module.exports = function (babel) {
  return {
    visitor: {
      Program: (path) => {
        const ast = babel.template.statement.ast(importShimStr());
        path.unshiftContainer("body", ast);
      },
      ImportDeclaration: (path) => {
        if (path.get("source").node.value === "react") {
          const specifiers = path.get("specifiers");
          const importList = generateImportList(specifiers, babel.types);
          // add new nodes
          replaceWithShim("Shim.React", importList).forEach((curr) => {
            const newNode = babel.template.statement.ast(curr);
            path.insertAfter(newNode);
          });
          // remove import ... "react";
          path.remove();
        } else if (path.get("source").node.value === "react/jsx-runtime") {
          const specifiers = path.get("specifiers");
          const importList = generateImportList(specifiers, babel.types);
          // add new nodes
          replaceWithShim("Shim.ReactRuntime", importList).forEach((curr) => {
            const newNode = babel.template.statement.ast(curr);
            path.insertAfter(newNode);
          });
          // remove import ... "react/runtime";
          path.remove();
        }
      },
    },
  };
};
