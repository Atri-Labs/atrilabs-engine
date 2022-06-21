import React from "react";
import App from "../../app/src/App";
import { renderRoute } from "./utils";

const app = renderRoute(App, "/blog");

console.log(app);
