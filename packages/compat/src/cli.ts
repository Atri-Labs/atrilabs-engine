import yargs from "yargs";
import { fixEvents } from "./fixEvents";
import { compress } from "./compress";

const args = yargs
  .option("f", {
    alias: "filename",
    description: "name of the events file",
    demandOption: true,
  })
  .boolean("fixEvents")
  .boolean("compress").argv as {
  fixEvents: boolean;
  compress: boolean;
  f: string;
};

if (args.fixEvents && args.compress) {
  console.log(`Cannot accept fixEvents and compress at once`);
  process.exit();
}

if (args.fixEvents) {
  fixEvents({ eventsFilepath: args.f });
} else if (args.compress) {
  compress({ eventsFilepath: args.f });
}
