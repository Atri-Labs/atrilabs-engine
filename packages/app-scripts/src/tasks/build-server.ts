#!/usr/bin/node
import path from "path";
import { buildServer, getMode, setNodeAndBabelEnv } from "../shared/utils";

const mode = getMode();
setNodeAndBabelEnv(mode);

const serverEntry = path.resolve("server/src/index.tsx");
const serverOutput = path.resolve("dist/server");
const includes = ["server/src", "app/src"].map((str) => path.resolve(str));

buildServer({ serverEntry, serverOutput, includes, mode });
