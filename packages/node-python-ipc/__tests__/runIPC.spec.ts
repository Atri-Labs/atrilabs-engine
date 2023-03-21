import { runIPC } from "../src";
import { EXAMPLE_MSG } from "./examples/consts";

test("NodeJS to NodeJS IPC", () => {
  return new Promise((res) => {
    runIPC(
      { cmd: "ts-node", args: ["./__tests__/examples/callSendIPCMsg.ts"] },
      {
        onClientSocketEnd(data) {
          res(data);
        },
      }
    );
  }).then((data) => {
    expect(data).toBe(EXAMPLE_MSG);
  });
});
