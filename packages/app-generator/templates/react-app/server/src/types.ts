export type ServerInfo = {
  port: number;
  pythonPort: number;
  publicDir: string;
  pages: { [key: string]: any };
  // assets like images might be delivered from some other targets
  publicUrlAssetMap: {
    [url: string]: string;
  };
};
