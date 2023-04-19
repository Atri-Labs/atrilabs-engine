import express, { Router } from "express";
import path from "path";

export function exposeStaticDirectories(
  router: Router,
  clientDirectoryFiles: Set<string>
) {
  router.use((req, res, next) => {
    if (req.originalUrl.match(/(\.js(\.map)?)$/)) {
      const compressExtension = ["gzip", "deflate", "br"];
      for (let i = 0; i < compressExtension.length; i++) {
        if (
          clientDirectoryFiles.has(`${req.originalUrl}.${compressExtension[i]}`)
        ) {
          res.set("Content-Type", "text/javascript");
          res.set("Content-Encoding", compressExtension[i]);
          res.sendFile(
            path.resolve(
              "dist",
              "app-build",
              "client",
              `${req.originalUrl.replace(/^\//, "")}.${compressExtension[i]}`
            )
          );
          return;
        }
      }
      next();
    }
    next();
  });
  router.use(express.static(path.resolve("dist", "app-build", "client")));
  router.use(express.static(path.resolve("public")));
}
