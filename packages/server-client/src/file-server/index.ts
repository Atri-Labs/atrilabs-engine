import { ToolConfig } from "@atrilabs/core";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { exit } from "process";

export type FileServerOptions = {
  dir: string;
  port?: number;
};

export default function (_toolConfig: ToolConfig, options: FileServerOptions) {
  if (!options || !options.dir) {
    console.log("Required option dir is missing");
    exit();
  }
  if (!path.isAbsolute(options.dir)) {
    console.log("The provided option dir must be an absolute path");
    exit();
  }
  if (!fs.existsSync(options.dir)) {
    console.log(`[file-server] Directory Not Found: ${options.dir}`);
    exit();
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
  // The default address used by http-server is 0.0.0.0
  console.log(`[file-server] listening on http://0.0.0.0:${port}`);
}
