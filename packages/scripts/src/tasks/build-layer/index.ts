#!/usr/bin/env node

import { buildLayer } from "../../shared/build-layer";

// NOTE: assuming this script is run from inside a layer
buildLayer(process.cwd())
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });
