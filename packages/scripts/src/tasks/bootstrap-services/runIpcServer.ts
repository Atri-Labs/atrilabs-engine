import { getToolPkgInfo, importToolConfig } from "../../shared/utils";

const toolPkgInfo = getToolPkgInfo();

importToolConfig(toolPkgInfo.configFile)
  .then((toolConfig) => {
    const runIpcServerConfig = toolConfig.services.ipcServer;
    if (runIpcServerConfig) {
      // toolConfig is passed as first arg, options as second
      const ipcServer = require(runIpcServerConfig.path)["default"];
      ipcServer(toolConfig, runIpcServerConfig.options);
    }
  })
  .catch((err) => console.log(err));
