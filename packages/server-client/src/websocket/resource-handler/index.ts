import { ImportedResource } from "@atrilabs/core";
import * as csstree from "css-tree";
import https from "https";
import http from "http";

type FontImports = Required<ImportedResource["imports"]>["fonts"];

function extractFontDetails(cssContent: string) {
  return new Promise<FontImports>((res) => {
    const fontImports: FontImports = [];
    const ast = csstree.parse(cssContent);
    csstree.walk(ast, {
      enter: (node: csstree.CssNode) => {
        if (node.type === "Atrule" && node.name === "font-face") {
          const currentFontImport: Partial<FontImports[0]> = {};
          csstree.walk(node, {
            enter: () => {
              csstree.walk(node, {
                enter: (node: csstree.CssNode) => {
                  if (
                    node.type === "Declaration" &&
                    node.property === "font-family"
                  ) {
                    const nodeValue = node.value as any;
                    if (
                      nodeValue &&
                      nodeValue.children &&
                      nodeValue.children.head &&
                      nodeValue.children.head.data &&
                      nodeValue.children.head.data.value
                    ) {
                      currentFontImport.fontFamily =
                        nodeValue.children.head.data.value;
                    } else {
                      csstree.walk(node, {
                        visit: "Identifier",
                        enter: (identifierNode) => {
                          currentFontImport.fontFamily = identifierNode.name;
                        },
                      });
                    }
                  }

                  if (
                    node.type === "Declaration" &&
                    node.property === "font-weight"
                  ) {
                    const nodeValue = node.value as any;
                    if (
                      nodeValue &&
                      nodeValue.children &&
                      nodeValue.children.head &&
                      nodeValue.children.head.data &&
                      nodeValue.children.head.data.value
                    ) {
                      if (nodeValue.children.head.data.type === "String")
                        currentFontImport.fontWeight =
                          nodeValue.children.head.data.value;
                      else if (nodeValue.children.head.data.type === "Number") {
                        currentFontImport.fontWeight = parseInt(
                          nodeValue.children.head.data.value
                        );
                      }
                    } else {
                      csstree.walk(node, {
                        visit: "Identifier",
                        enter: (identifierNode) => {
                          currentFontImport.fontWeight = identifierNode.name;
                        },
                      });
                    }
                  }

                  if (
                    node.type === "Declaration" &&
                    node.property === "font-style"
                  ) {
                    csstree.walk(node, {
                      visit: "Identifier",
                      enter: (identifierNode) => {
                        currentFontImport.fontStyle = identifierNode.name;
                      },
                    });
                  }
                },
              });
            },
          });
          fontImports.push(currentFontImport as FontImports[0]);
        }
      },
    });
    res(fontImports);
  });
}

function fetchExternalCSS(url: string) {
  return new Promise<string>((resolve, reject) => {
    const parsedUrl = new URL(url);
    let request: http.ClientRequest;
    if (parsedUrl.protocol.startsWith("https")) {
      request = https.request(parsedUrl);
    } else {
      request = http.request(url);
    }
    if (request === undefined) {
      reject("unknown protocol");
      return;
    }
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
        if (node.type === "Atrule" && node.name === "import") {
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
              if (value.startsWith("https://") && value.match(".css")) {
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
                    console.log("Fetching CSS failed");
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
