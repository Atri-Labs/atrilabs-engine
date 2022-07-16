export type ServerInfo = {
  port: number;
  pythonPort: number;
  publicDir: string;
  pages: { [key: string]: any };
  // assets like images might be delivered from some other targets
  publicUrlAssetMap: {
    [url: string]: string;
  };
  // host can be host.internal.docker:4005 etc. If host is provided,
  // pythonPort will be ignored.
  controllerHost?: string;
};
