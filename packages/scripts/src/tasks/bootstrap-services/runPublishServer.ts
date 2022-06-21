import { getToolPkgInfo, importToolConfig } from "../../shared/utils";

const toolPkgInfo = getToolPkgInfo();

importToolConfig(toolPkgInfo.configFile)
  .then((toolConfig) => {
    const publishServerConfig = toolConfig.services.publishServer;
    if (publishServerConfig) {
      // toolConfig is passed as first arg, options as second
      const publishServer = require(publishServerConfig.path)["default"];
      publishServer(toolConfig, publishServerConfig.options);
    }
  })
  .catch((err) => console.log(err));
