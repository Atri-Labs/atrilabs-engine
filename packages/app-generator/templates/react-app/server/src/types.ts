export type ServerInfo = {
  port: number;
  pythonPort: number;
  publicDir: string;
  pages: { [key: string]: any };
};
