import {
  createIfNotExistLocalCache,
  createWebSocketServer,
  isDevelopment,
  getIndexHtmlContent,
  getPageFromCache,
  getServerInfo,
  sendReloadMessage,
  storePageInCache,
  findNearestNodeModulesDirectory,
} from "./utils";
import express from "express";
import path from "path";
import http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { watch } from "chokidar";
import { forwardGetPageRequest } from "./forwarder";

// constants needed externally
const serverInfo = getServerInfo(__dirname);
const nodeModulesPath = findNearestNodeModulesDirectory(__dirname, null);
const watcher = watch([
  path.resolve(nodeModulesPath, "..", "atri-server-info.json"),
]);

watcher.on("change", () => {
  const { pages } = getServerInfo(__dirname);
  serverInfo.pages = pages;
});

const appDistHtml = path.resolve(serverInfo.publicDir, "index.html");

const [controllerHostnameRaw, controllerPortRaw] = (
  serverInfo.controllerHost || ""
).split(":");
const controllerHostname = controllerHostnameRaw || "0.0.0.0";
const controllerPort = controllerPortRaw
  ? parseInt(controllerPortRaw)
  : serverInfo.pythonPort;

createIfNotExistLocalCache();

const app = express();
const server = http.createServer(app);
createWebSocketServer(server);

app.use((req, res, next) => {
  console.log("request received", req.originalUrl, req.path);
  if (req.method === "GET" && serverInfo.pages[req.path]) {
    if (!isDevelopment) {
      const finalTextFromCache = getPageFromCache(req.path);
      if (finalTextFromCache) {
        res.send(finalTextFromCache);
        return;
      }
    }
    // read again App.jsx for dev server
    const getAppTextPath = path.resolve(
      __dirname,
      "..",
      "app-node",
      "static",
      "js",
      "app.bundle.js"
    );
    delete require.cache[getAppTextPath];
    const getAppText = require(getAppTextPath)["getAppText"]["getAppText"];
    const appHtmlContent = getIndexHtmlContent(appDistHtml);
    const finalText = getAppText(req.path, appHtmlContent);
    res.send(finalText);
    storePageInCache(req.path, finalText);
  } else {
    next();
  }
});

app.post("/event-handler", express.json({ limit: "50mb" }), (req, res) => {
  const pageRoute = req.body["pageRoute"];
  const pageState = req.body["pageState"];
  const alias = req.body["alias"];
  const callbackName = req.body["callbackName"];
  const eventData = req.body["eventData"];
  if (
    typeof pageRoute !== "string" ||
    typeof pageState !== "object" ||
    typeof alias !== "string" ||
    typeof callbackName !== "string"
  ) {
    res.status(400).send();
    return;
  }
  // TODO: update pageState if success python call otherwise 501
  const payload = JSON.stringify({
    route: pageRoute,
    state: pageState,
    alias,
    callbackName,
    eventData,
  });
  const forward_req = http.request(
    {
      hostname: controllerHostname,
      port: controllerPort,
      path: "/event",
      method: "POST",
      headers: {
        ...req.headers,
        "Content-Type": "application/json",
        "Content-Length": payload.length,
        "Transfer-Encoding": "chunked",
      },
    },
    (forward_res) => {
      forward_res.setEncoding("utf8");
      let data = "";
      forward_res.on("data", (chunk) => {
        data = data + chunk;
      });
      forward_res.on("end", () => {
        try {
          // copy headers
          Object.keys(forward_res.headers).forEach((key) => {
            res.setHeader(key, forward_res.headers[key]!);
          });
          const newPageState = JSON.parse(data);
          // copy status code
          const statusCode = forward_res.statusCode || 200;
          res.status(statusCode).send({ pageState: newPageState });
        } catch (err) {
          console.log("Unexpected Forward Response\n", err);
          res.status(501).send();
        }
      });
    }
  );
  forward_req.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
    res.status(501).send();
  });
  forward_req.write(payload);
  forward_req.end();
});

app.post(
  "/handle-page-request",
  express.json({ limit: "50mb" }),
  (req, res) => {
    const pageRoute = req.body["pageRoute"];
    const query = req.body["query"];
    const useStorePath = path.resolve(
      __dirname,
      "..",
      "app-node",
      "static",
      "js",
      "serverSide.bundle.js"
    );
    delete require.cache[useStorePath];
    const pageState =
      require(useStorePath)["getAppText"]["default"]["getState"]()[
        serverInfo.pages[pageRoute].name
      ];
    forwardGetPageRequest({
      pageRoute: pageRoute,
      query,
      pageState: pageState,
      controllerHostname,
      controllerPort,
      req,
    })
      .then((val) => {
        // copy headers
        Object.keys(val.headers).forEach((key) => {
          res.setHeader(key, val.headers[key]);
        });
        // copy status code
        res
          .status(val.statusCode)
          .send({ ...val, pageName: serverInfo.pages[pageRoute].name });
      })
      .catch((err) => {
        console.log("Forward failed", err);
        res.status(err).send();
      });
  }
);

app.use(
  "/event-in-form-handler",
  createProxyMiddleware({
    target: `http://${controllerHostname}:${controllerPort}`,
  })
);

app.post("/reload-all-dev-sockets", (_req, res) => {
  console.log("received request to reload all sockets");
  sendReloadMessage();
  res.send();
});

Object.keys(serverInfo.publicUrlAssetMap).forEach((url) => {
  app.use(url, express.static(serverInfo.publicUrlAssetMap[url]!));
});

app.use(express.static(serverInfo.publicDir));

server.listen(serverInfo.port, () => {
  const address = server.address();
  if (typeof address === "object" && address !== null) {
    let port = address.port;
    let ip = address.address;
    console.log(`[ATRI_SERVER] listening on http://${ip}:${port}`);
  } else if (typeof address === "string") {
    console.log(`[ATRI_SERVER] listening on http://${address}`);
  } else {
    console.log(`[ATRI_SERVER] cannot listen on ${serverInfo.port}`);
  }
});
