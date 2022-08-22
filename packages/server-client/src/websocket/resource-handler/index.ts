import { ImportedResource } from "@atrilabs/core";
import * as csstree from "css-tree";
import http from "http";

type FontImports = Required<ImportedResource["imports"]>["fonts"];

function extractFontDetails(cssContent: string) {
  return new Promise<FontImports>((res) => {
    const fontImports: FontImports = [];
    const ast = csstree.parse(cssContent);
    let currentFontImport: Partial<FontImports[0]> = {};
    csstree.walk(ast, {
      enter: (node: csstree.CssNode) => {
        if (node.type === "Atrule" && node.name === "font-face") {
          currentFontImport = {};
        }
        if (node.type === "Declaration" && node.property === "font-family") {
          csstree.walk(node.value, {
            visit: "Identifier",
            enter: (identifierNode) => {
              currentFontImport.fontFamily = identifierNode.name;
            },
          });
        }
        if (node.type === "Declaration" && node.property === "font-weight") {
          csstree.walk(node.value, {
            visit: "Identifier",
            enter: (identifierNode) => {
              currentFontImport.fontWeight = identifierNode.name;
            },
          });
        }
        if (node.type === "Declaration" && node.property === "font-style") {
          csstree.walk(node.value, {
            visit: "Identifier",
            enter: (identifierNode) => {
              currentFontImport.fontFamily = identifierNode.name;
            },
          });
        }
      },
      leave: (node: csstree.CssNode) => {
        if (node.type === "Atrule" && node.name === "font-face") {
          fontImports.push(currentFontImport as FontImports[0]);
        }
      },
    });
    res(fontImports);
  });
}

function fetchExternalCSS(url: string) {
  return new Promise<string>((resolve, reject) => {
    const request = http.request(url);
    request.on("response", (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("end", () => {
        resolve(data);
      });
      resp.on("error", (err) => {
        console.log("Unable to get response", url);
        console.log("Error\n", err);
        reject();
      });
    });
    request.on("error", (err) => {
      console.log("Unable to send request:", url);
      console.log("Error\n", err);
      reject();
    });
    request.end();
  });
}

export function fetchCSSResource(resourceStr: string) {
  // true if found a valid resource
  return new Promise<ImportedResource>((res, rej) => {
    const ast = csstree.parse(resourceStr);
    let validResource = false;
    csstree.walk(ast, {
      visit: "Atrule",
      enter: (node: csstree.CssNode) => {
        if (node.type === "Atrule") {
          if (
            node.prelude &&
            "children" in node.prelude &&
            "head" in node.prelude.children &&
            "data" in (node.prelude.children as any).head &&
            "type" in (node.prelude.children as any).head.data &&
            "value" in (node.prelude.children as any).head.data
          ) {
            const type = (node.prelude.children as any).head.data.type;
            const value = (node.prelude.children as any).head.data
              .value as string;
            if (type === "Url" && value) {
              if (value.startsWith("https://") && value.endsWith(".css")) {
                // found a valid css url
                validResource = true;
                fetchExternalCSS(value)
                  .then((cssContent) => {
                    extractFontDetails(cssContent).then((fontImports) =>
                      res({
                        str: resourceStr,
                        method: "css",
                        imports: {
                          fonts: fontImports,
                        },
                      })
                    );
                  })
                  .catch(() => {
                    rej();
                  });
              }
            }
          }
        }
      },
    });
    if (!validResource) {
      rej();
    }
  });
}
