// @ts-nocheck
import { Compiler } from "webpack";
import { RawSource } from "webpack-sources";

export type AssetListPluginOptions = {
  name: string;
  format: "array" | "object";
  key: "filename" | "name" | "type" | "fingerprint";
};

export class AssetListPlugin {
  private options: AssetListPluginOptions;

  constructor(options: Partial<AssetListPluginOptions>) {
    if (options.format === undefined) {
      options.format = "array";
    }
    if (options.key === undefined) {
      options.key = "filename";
    }
    if (options.name === undefined) {
      options.name = "assets";
    }
    this.options = options as AssetListPluginOptions;
  }

  apply(compiler: Compiler) {
    const logPrefix = "asset-list-webpack-plugin: ";
    const outputName = this.options.name;

    const format = this.options.format;
    if (format !== "array" && format !== "object") {
      throw new Error(
        logPrefix + '"' + this.options.format + '" format is not supported.'
      );
    }

    const key = this.options.key;
    if (key && format === "array") {
      console.warn(
        logPrefix + "Ignoring key option since format is set to array."
      );
    }

    compiler.hooks.emit.tapAsync(
      "Asset List Plugin",
      function (compilation, cb) {
        const assets: { [key: string]: any } | any[] =
          format === "object" ? {} : [];

        for (var filename in compilation.assets) {
          const splitFilename = filename.split(".");

          if (
            splitFilename.length > 2 &&
            splitFilename[splitFilename.length - 1] === "map"
          ) {
            splitFilename[splitFilename.length - 2] =
              splitFilename[splitFilename.length - 2] +
              "." +
              splitFilename.pop();
          }

          const value = {
            filename: filename,
            name: splitFilename[0],
            type:
              splitFilename.length > 1
                ? splitFilename[splitFilename.length - 1]
                : undefined,
            fingerprint:
              splitFilename.length > 2
                ? splitFilename[splitFilename.length - 2]
                : undefined,
          };

          if (typeof assets === "object") {
            if (value[key] === undefined)
              throw new Error(
                logPrefix + "Specified key does not exist on an asset!"
              );

            if (value[key]! in assets) {
              if (Array.isArray(assets[value[key]])) {
                assets[value[key]!].push(value);
              } else {
                assets[value[key]] = [assets[value[key]], value];
              }
            } else {
              assets[value[key]] = value;
            }
          } else {
            assets.push(value);
          }
        }

        compilation.assets[outputName + ".json"] = new RawSource(
          JSON.stringify(assets)
        );

        cb();
      }
    );
  }
}

module.exports = AssetListPlugin;
