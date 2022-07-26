import fs from "fs";
import path from "path";

console.log("App is running...");
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
  const allFiles = getFiles(path.resolve(__dirname, "..", "..", "..", ".."));
  fs.writeFileSync("filelist.txt", allFiles.join("\n"));
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
