#!/usr/bin/env node

import { buildRuntime } from "../../shared/build-packages";

// NOTE: assuming this script is run from inside a layer
buildRuntime(process.cwd())
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });
