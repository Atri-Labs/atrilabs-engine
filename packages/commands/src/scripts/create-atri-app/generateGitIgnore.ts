import fs from "fs";
import path from "path";

export function generateGitIgnoe(options: {
  dest: string;
  useTypescript: boolean;
}) {
  const tsIgnorePath = path.resolve(options.dest, ".gitignore");
  if (!fs.existsSync(tsIgnorePath)) {
    fs.writeFileSync(
      tsIgnorePath,
      `node_modules/
dist/
${options.useTypescript ? `tsconfig.tsbuildinfo` : ``}`
    );
  }
}
