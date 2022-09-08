import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  buildSSG,
  deployGithubPages,
  startBootstrapServices,
} from "./commands";

console.log("App is running...");

process.env["TOOL_ROOT_PATH"] = path.resolve(__dirname, "..", "..");

yargs(hideBin(process.argv))
  .command("build <build-type>", "build the app", (yargs) => {
    return yargs.command(
      "ssg",
      "build server side generated",
      () => {},
      () => {
        buildSSG();
      }
    );
  })
  .command(
    "deploy <build-type>",
    "deploy a build",
    (yargs) => {
      return yargs.command(
        "ssg [--gh-pages]",
        "deploy ssg build",
        (yargs) => {
          return yargs.boolean("gh-pages");
        },
        (argv) => {
          if (argv["gh-pages"]) {
            deployGithubPages();
          }
        }
      );
    },
    () => {}
  )
  .command(
    "start",
    "start the development servers",
    () => {},
    () => {
      startBootstrapServices();
    }
  )
  .parse();
