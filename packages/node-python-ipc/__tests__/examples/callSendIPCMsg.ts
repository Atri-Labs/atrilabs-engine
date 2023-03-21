import { sendIPCMsg } from "../../src/node-client";
import { EXAMPLE_MSG } from "./consts";

console.log("ran callSendIPCMsg", process.env["ATRI_IPC_PATH"]);

sendIPCMsg(EXAMPLE_MSG)
  .then(() => {
    console.log("message sent");
  })
  .catch(console.log);
