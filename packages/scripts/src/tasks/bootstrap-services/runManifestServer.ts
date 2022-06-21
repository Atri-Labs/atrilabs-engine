import { getToolPkgInfo, importToolConfig } from "../../shared/utils";

const toolPkgInfo = getToolPkgInfo();

importToolConfig(toolPkgInfo.configFile)
  .then((toolConfig) => {
    const manifestServerConfig = toolConfig.services.manifestServer;
    if (manifestServerConfig) {
      // toolConfig is passed as first arg, options as second
      const manifestServer = require(manifestServerConfig.path)["default"];
      manifestServer(toolConfig, manifestServerConfig.options);
    }
  })
  .catch((err) => console.log(err));
