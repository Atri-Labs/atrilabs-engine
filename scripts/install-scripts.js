#!/usr/bin/env node
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { merge } = require("lodash");

const packagesRegex = /(-layer)|(design-system)|(webapp-builder)/;
const packagesDir = path.resolve("packages");
const scriptsPackage = "@atrilabs/scripts";

function packageDetails(pkg) {
  const pkgJSON = JSON.parse(
    fs.readFileSync(path.resolve(pkg, "package.json")).toString()
  );
  const name = pkgJSON["name"];
  const deps = merge(pkgJSON["dependencies"], pkgJSON["devDependencies"]);
  const keys = Object.keys(deps);
  let isScriptInstalled = false;
  keys.every((key) => {
    if (key.includes(scriptsPackage)) {
      isScriptInstalled = true;
      // stop
      return false;
    }
    // keep looping
    return true;
  });
  return { name, deps, isScriptInstalled };
}

function findPackages(regex) {
  const dirents = fs.readdirSync(packagesDir, {
    withFileTypes: true,
  });
  const result = dirents.filter((dirent) => {
    if (dirent.isDirectory()) {
      if (dirent.name.match(regex)) {
        return true;
      }
    }
    return false;
  });
  return result.map((value) => {
    const dirname = path.resolve(packagesDir, value.name);
    return {
      dirname,
      details: packageDetails(dirname),
    };
  });
}

// uninstall @atrilabs/scripts
const pkgs = findPackages(packagesRegex);
const uninstallPromises = [];
pkgs.forEach((pkg) => {
  const dirname = pkg.dirname;
  const details = pkg.details;
  if (details.isScriptInstalled) {
    uninstallPromises.push(
      new Promise((res) => {
        exec(`yarn remove ${scriptsPackage}`, { cwd: dirname }, (err) => {
          if (err) {
            console.log(err);
          }
          console.log("removed from", dirname);
          res();
        });
      })
    );
  }
});

// wait for all uninstallations to happen
Promise.all(uninstallPromises).then(() => {
  // install @atrilabs/scripts
  pkgs.forEach((pkg) => {
    const details = pkg.details;
    if (details.isScriptInstalled) {
      exec(`lerna add ${scriptsPackage} --scope=${details.name}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
});
