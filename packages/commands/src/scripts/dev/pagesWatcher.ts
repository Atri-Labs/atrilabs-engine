import chokidar from "chokidar";
import { PAGE_DIR } from "../../consts";

export const pagesWatcher = chokidar.watch(PAGE_DIR);
