import jsdom from "jsdom";
import { importReactDependencies, readIndexHtml } from "./utils";

const { JSDOM } = jsdom;

export default function readManifestRegistry(bundlePath: string) {
  importReactDependencies().then(([React, ReactRuntime]) => {
    const dom = new JSDOM(readIndexHtml(bundlePath), {
      runScripts: "dangerously",
      resources: "usable",
    });
    // window.onload event listener gets called twice.
    // To prevent calling setup again, we use setupCalled flag.
    let setupCalled = false;
    dom.window.addEventListener(
      "load",
      () => {
        if (
          dom.window["manifestscript"] &&
          dom.window["manifestscript"]["setup"] &&
          !setupCalled
        ) {
          setupCalled = true;
          dom.window["manifestscript"]["setup"](
            (reg: any) => console.log(reg),
            React,
            ReactRuntime
          );
        }
      },
      false
    );
  });
}
