import React from "react";
import App from "../../app/src/App";
import {
  createIfNotExistLocalCache,
  getIndexHtmlContent,
  getPageFromCache,
  getServerInfo,
  renderRoute,
  storePageInCache,
} from "./utils";
import express from "express";
import path from "path";

// constants needed externally
const { port, publicDir, pages } = getServerInfo(__dirname);
const appDistHtml = path.resolve(publicDir, "index.html");

createIfNotExistLocalCache();

const app = express();

app.use((req, res, next) => {
  if (req.method === "GET" && pages[req.originalUrl]) {
    const finalTextFromCache = getPageFromCache(req.originalUrl);
    if (finalTextFromCache) {
      res.send(finalTextFromCache);
      return;
    }
    const appText = renderRoute(App, req.originalUrl);
    const appHtmlContent = getIndexHtmlContent(appDistHtml);
    const finalText = appHtmlContent.replace(
      '<div id="root"></div>',
      `<div id="root">${appText}</div>`
    );
    res.send(finalText);
    storePageInCache(req.originalUrl, finalText);
    return;
  }
  next();
});

app.post("/event-handler", express.json(), (req, res) => {
  console.log("event handler recieved");
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
  console.log(pageRoute, pageState, alias, callbackName, eventData);
  // TODO: update pageState if success python call otherwise 501
  res.status(200).send({ pageState });
});

app.use(express.static(publicDir));

const server = app.listen(port, () => {
  const address = server.address();
  if (typeof address === "object" && address !== null) {
    let port = address.port;
    let ip = address.address;
    console.log(`[ATRI_SERVER] listening on http://${ip}:${port}`);
  } else if (typeof address === "string") {
    console.log(`[ATRI_SERVER] listening on http://${address}`);
  } else {
    console.log(`[ATRI_SERVER] cannot listen on ${port}`);
  }
});
