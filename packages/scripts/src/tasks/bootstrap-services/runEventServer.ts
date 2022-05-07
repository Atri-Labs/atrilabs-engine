import { getToolPkgInfo, importToolConfig } from "../../shared/utils";

const toolPkgInfo = getToolPkgInfo();

importToolConfig(toolPkgInfo.configFile)
  .then((toolConfig) => {
    const eventServerConfig = toolConfig.services.eventServer;
    if (eventServerConfig) {
      // toolConfig is passed as first arg, options as second
      const eventServer = require(eventServerConfig.path)["default"];
      eventServer(toolConfig, eventServerConfig.options);
    }
  })
  .catch((err) => console.log(err));
