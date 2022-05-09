import { ToolConfig } from "@atrilabs/core";
import { exec } from "child_process";
import path from "path";

export type FileServerOptions = {
  dir: string;
  port?: number;
};

export default function (_toolConfig: ToolConfig, options: FileServerOptions) {
  if (!options || !options.dir) {
    throw Error("Required option dir");
  }
  if (!path.isAbsolute(options.dir)) {
    throw Error("The provided option dir must be an absolute path");
  }
  const port = (options && options.port) || 4002;
  const exe = path.resolve(
    path.dirname(require.resolve("http-server/package.json")),
    "..",
    ".bin",
    "http-server"
  );
  exec(`${exe} ${options.dir} -p ${port} --cors`, (err, stdout, stderr) => {
    if (err) {
      console.log(`err:\n${err}`);
    }
    if (stderr) {
      console.log(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  });
}
