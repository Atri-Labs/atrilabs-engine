import { getToolPkgInfo, importToolConfig } from "../../shared/utils";

const toolPkgInfo = getToolPkgInfo();

importToolConfig(toolPkgInfo.configFile)
  .then((toolConfig) => {
    const eventServer = toolConfig.services.eventServer;
    if (eventServer) {
      // toolConfig is passed as first arg, options as second
      require(eventServer.path)(toolConfig, eventServer.options);
    }
  })
  .catch((err) => console.log(err));
