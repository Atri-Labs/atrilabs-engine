#!/usr/bin/node
import path from "path";
import { buildApp, getMode, setNodeAndBabelEnv } from "../shared/utils";

const mode = getMode();
setNodeAndBabelEnv(mode);

const appEntry = path.resolve("app/src/index.jsx");
const appHtml = path.resolve("app/public/index.html");
const appOutput = path.resolve("dist/app");
const includes = ["app/src"].map((str) => path.resolve(str));

buildApp({ appEntry, appHtml, appOutput, includes, mode });
