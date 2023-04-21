import recursiveReadDir from "recursive-readdir";
import path from "path";
import upath from "upath";

export async function readClientDirectory() {
  const files = (
    await recursiveReadDir(path.resolve("dist", "app-build", "client"))
  ).map((fileName) =>
    upath.toUnix(
      fileName.replace(path.resolve("dist", "app-build", "client"), "")
    )
  );

  return new Set(files);
}

export async function readStaticCSSFiles() {
  const files = (
    await recursiveReadDir(
      path.resolve("dist", "app-build", "client", "static", "css")
    )
  ).map((fileName) =>
    upath.toUnix(
      fileName.replace(
        path.resolve("dist", "app-build", "client", "static", "css"),
        ""
      )
    )
  );
  return new Set(files);
}
