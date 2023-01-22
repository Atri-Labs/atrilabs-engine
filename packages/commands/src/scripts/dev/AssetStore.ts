import { Compiler, Asset } from "webpack";
import fs from "fs";

export function createAssetStore() {
  const store: {
    assets: Asset[];
  } = {
    assets: [],
  };

  function attachHooks(compiler: Compiler) {
    compiler.hooks.emit.tap("AssetStoreDoneHook", (compilation) => {
      store.assets = compilation.getAssets();
      fs.writeFileSync(
        "name.json",
        JSON.stringify(
          store.assets.map((asset) => {
            return asset.name;
          })
        )
      );
      const indexAsset = compilation.getAsset("static/js/index.bundle.js");
      fs.writeFileSync("content.json", indexAsset?.source.source().toString()!);
      fs.writeFileSync("info.json", JSON.stringify(indexAsset?.info));
    });

    compiler.hooks;
  }

  return { attachHooks, store };
}
