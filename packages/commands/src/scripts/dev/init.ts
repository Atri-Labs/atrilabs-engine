import chokidar from "chokidar";
import { PAGE_DIR } from "../../consts";
import { createServerMachineInterpreter } from "./serverMachine";

export const pagesWatcher = chokidar.watch(PAGE_DIR);

export const interpreter = createServerMachineInterpreter("serverMachine");
