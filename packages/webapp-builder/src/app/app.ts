import path from "path";

console.log("App is running...");

process.env["TOOL_ROOT_PATH"] = path.resolve(__dirname, "..", "..");

try {
  console.log("[__dirname]", __dirname);
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
