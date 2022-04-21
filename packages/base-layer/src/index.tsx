import { setApp, menu } from "@atrilabs/core";
import { App } from "./App";

export default function () {
  console.log("base-layer loaded");
  if (currentLayer === "root") {
    setApp(<App />);
    console.log(menu("BaseHeaderMenu"));
  }
}
