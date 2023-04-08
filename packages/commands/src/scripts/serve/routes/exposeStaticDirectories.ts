import express, { Router } from "express";
import path from "path";

export function exposeStaticDirectories(router: Router) {
  router.use(express.static(path.resolve("dist", "app-build", "client")));
  router.use(express.static(path.resolve("public")));
}
