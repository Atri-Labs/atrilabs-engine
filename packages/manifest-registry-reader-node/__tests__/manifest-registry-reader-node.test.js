"use strict";

const path = require("path");

const manifestRegistryReaderNode = require("../lib/index");

const bundlePath = path.resolve(
  __dirname,
  "..",
  "..",
  "webapp-builder/node_modules/.cache/@atrilabs/build/manifests/@atrilabs/react-component-manifests/final-build/bundle.js"
);

manifestRegistryReaderNode.default(bundlePath);
