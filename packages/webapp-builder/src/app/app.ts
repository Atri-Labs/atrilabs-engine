import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  buildReactApp,
  buildSSG,
  deployGithubPages,
  generateApp,
  startBootstrapServices,
  writeAppInfo,
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
  .command(
    "gen",
    "generate app",
    () => {},
    () => {
      generateApp();
    }
  )
  .command(
    "writeinfo [out]",
    "write info to a file",
    (yargs) => {
      return yargs.positional("out", {
        type: "string",
        description: "full path of file",
        demandOption: true,
      });
    },
    (argv) => {
      writeAppInfo(argv.out);
    }
  )
  .command(
    "build-react [app-info] [props]",
    "build react app with props from controller",
    (yargs) => {
      return yargs
        .positional("app-info", { demandOption: true, type: "string" })
        .positional("props", { demandOption: true, type: "string" });
    },
    (argv) => {
      const appInfo = JSON.parse(argv.appInfo);
      const props = JSON.parse(argv.props);
      buildReactApp(appInfo.appInfo, props);
    }
  )
  .parse();
