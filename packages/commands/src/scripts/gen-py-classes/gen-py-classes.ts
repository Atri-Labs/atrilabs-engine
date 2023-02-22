#!/usr/bin/env node

import { extractParams } from "@atrilabs/commands-builder";
import { buildManifests } from "./buildManifests";
/**
 * This script has to be run in a package that
 * exports manifests or an Atri app with manifests directory.
 *
 * Generate python classes from manifests.
 */
async function main() {
  const params = extractParams();
  buildManifests({ params })
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
}

main().catch((err) => console.log(err));
