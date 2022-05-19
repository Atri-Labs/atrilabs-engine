import { ToolConfig } from "@atrilabs/core";

export type ManifestServerOptions = {
  port?: number;
};

export default function (
  toolConfig: ToolConfig,
  options: ManifestServerOptions
) {
  const manifestDirs = toolConfig.manifestDirs;
}
