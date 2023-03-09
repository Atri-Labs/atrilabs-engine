import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import chalk from "chalk";
import {
  LiveapiClientToServerEvents,
  LiveApiServerToClientEvents,
  routeObjectPathToIR,
  IRToUnixFilePath,
} from "@atrilabs/atri-app-core";
import path from "path";
import fs from "fs";

export function liveApiServer(server: Server) {
  const io = new SocketServer<
    LiveapiClientToServerEvents,
    LiveApiServerToClientEvents
  >(server, { path: "/_atri/socket.io" });
  io.on("connection", (socket) => {
    console.log(chalk.green("socket connected", socket.id));

    socket.on("sendEvents", (urlPath, cb) => {
      const ir = routeObjectPathToIR(urlPath);
      const unixFilePath = IRToUnixFilePath(ir);
      const eventsJSONFilepath = path.resolve(
        "pages",
        `${unixFilePath.replace(/^(\/)/, "")}.events.json`
      );
      if (fs.existsSync(eventsJSONFilepath)) {
        try {
          const events = JSON.parse(
            fs.readFileSync(eventsJSONFilepath).toString()
          );
          cb(events);
        } catch (err: any) {
          console.log(err);
          cb([]);
        }
      } else {
        cb([]);
      }
    });
  });
}
