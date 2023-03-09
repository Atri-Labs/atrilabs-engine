import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import chalk from "chalk";
import {
  LiveapiClientToServerEvents,
  LiveApiServerToClientEvents,
  routeObjectPathToIR,
  IRToUnixFilePath,
  dirStructureToIR,
  pathIRToRouteObjectPath,
} from "@atrilabs/atri-app-core";
import path from "path";
import fs from "fs";
import { watch } from "chokidar";
import { PAGE_DIR } from "../../../consts";
import { AnyEvent } from "@atrilabs/forest";

function readEventsFromFile(urlPath: string) {
  const ir = routeObjectPathToIR(urlPath);
  const unixFilePath = IRToUnixFilePath(ir);
  const eventsJSONFilepath = path.resolve(
    "pages",
    `${unixFilePath.replace(/^(\/)/, "")}.events.json`
  );
  if (fs.existsSync(eventsJSONFilepath)) {
    const events = JSON.parse(fs.readFileSync(eventsJSONFilepath).toString());
    return events as AnyEvent[];
  }
  return [];
}

export function liveApiServer(server: Server) {
  const io = new SocketServer<
    LiveapiClientToServerEvents,
    LiveApiServerToClientEvents
  >(server, { path: "/_atri/socket.io" });
  io.on("connection", (socket) => {
    console.log(chalk.green("socket connected", socket.id));

    socket.on("sendEvents", (urlPath, cb) => {
      try {
        const events = readEventsFromFile(urlPath);
        cb(events);
      } catch (err: any) {
        console.log(err);
        cb([]);
      }
    });
  });

  const watcher = watch(PAGE_DIR, { ignoreInitial: true, alwaysStat: true });
  watcher.on("change", (filepath, stats) => {
    if (stats?.isDirectory() === false && filepath.endsWith(".events.json")) {
      // WARN: adding .jsx without confirming that the actual
      // extension is .jsx.
      const unixfilepath = `/${path
        .relative(PAGE_DIR, filepath)
        .replace(/(\.events\.json)$/, "")}.jsx`;
      const ir = dirStructureToIR([unixfilepath])[0]!;
      const urlPath = pathIRToRouteObjectPath(ir);
      try {
        const events = readEventsFromFile(urlPath);
        io.emit("newEvents", urlPath, events);
      } catch (err: any) {
        console.log(err);
      }
    }
  });
}
