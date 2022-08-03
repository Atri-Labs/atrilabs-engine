import fs from "fs";
import path from "path";

console.log("App is running...");

process.env["TOOL_ROOT_PATH"] = path.resolve(__dirname, "..", "..");

function getFiles(dir: string): string[] {
  const files: string[] = [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      files.push(...getFiles(path.resolve(dir, dirent.name)));
    } else {
      files.push(path.resolve(dir, dirent.name));
    }
  });
  return files;
}

try {
  console.log("[__dirname]", __dirname);
  const filelist = getFiles(
    path.resolve(__dirname, "..", "..", "node_modules")
  );
  fs.writeFileSync("filelist.txt", filelist.join("\n"));
  console.log(JSON.stringify(module.paths, null, 2));
  const resolvedPath = require.resolve("@atrilabs/scripts");
  console.log("[Resolved path 1]", resolvedPath);
  const resolvedPath2 = require.resolve(
    "@atrilabs/scripts/build/tasks/bootstrap-services/bootstrap-services.js"
  );
  console.log("[Resolved path 2]", resolvedPath2);
  require(resolvedPath2);
} catch (err) {
  console.log("[Error in running app]\n", err);
}
