import fs from "fs";
import path from "path";

function copyToControllers(dest: string, filename: string) {
  const outputFilename = path.resolve(dest, "controllers", filename);
  const inputFilename = path.resolve(
    __dirname,
    "..",
    "src",
    "scripts",
    "create-atri-app",
    "templates",
    "controllers",
    filename
  );
  if (!fs.existsSync(path.dirname(outputFilename))) {
    fs.mkdirSync(path.dirname(outputFilename), { recursive: true });
  }
  if (!fs.existsSync(outputFilename)) {
    fs.writeFileSync(outputFilename, fs.readFileSync(inputFilename));
  }
}

export function generateControllers(options: { dest: string }) {
  const { dest } = options;
  copyToControllers(dest, "__init__.py");
  copyToControllers(dest, "main.py");
  copyToControllers(dest, "requirements.txt");
  copyToControllers(dest, "utils.py");
}
