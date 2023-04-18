import fs from "fs";
import path from "path";

export function generateTSConfig(options: { dest: string }) {
  const tsConfigFile = path.resolve(options.dest, "tsconfig.json");
  if (!fs.existsSync(tsConfigFile)) {
    fs.writeFileSync(
      tsConfigFile,
      JSON.stringify({
        compilerOptions: {
          target: "es5",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          noFallthroughCasesInSwitch: true,
          module: "es2020",
          moduleResolution: "node",
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          declaration: true,
          declarationMap: true,
          sourceMap: true,
        },
        include: ["pages", "manifests", "atri-app-env.d.ts"],
      })
    );
  }
}

export function generateTypeFile(options: { dest: string }) {
  const typeFile = path.resolve(options.dest, "atri-app-env.d.ts");
  if (!fs.existsSync(typeFile)) {
    fs.writeFileSync(
      typeFile,
      `/// <reference types="@atrilabs/layer-types" />`
    );
  }
}
