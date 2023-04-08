import fs from "fs";
import path from "path";

export function runChecks() {
  const serverDir = path.resolve("dist", "app-build", "server");
  const clientDir = path.resolve("dist", "app-build", "client");
  if (!fs.existsSync(serverDir)) {
    console.log(`Not Found: ${serverDir}`);
    console.log(
      "Please run npm run build or yarn build before you start the server."
    );
    process.exit(0);
  }
  if (!fs.existsSync(clientDir)) {
    console.log(`Not Found: ${clientDir}`);
    console.log(
      "Please run npm run build or yarn build before you start the server."
    );
    process.exit(0);
  }
}
