import { setApp } from "@atrilabs/core";

export default function () {
  console.log("base-layer loaded");
  if (currentLayer === "root") {
    console.log(setApp);
  }
}
