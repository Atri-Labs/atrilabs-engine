import { Socket } from "net";

export function sendIPCMsg(msg: string) {
  return new Promise<void>((res, rej) => {
    const ATRI_IPC_PATH = process.env["ATRI_IPC_PATH"];
    if (typeof ATRI_IPC_PATH !== "string") {
      rej("ATRI_IPC_PATH environment variable is required.");
      return;
    }
    const socket = new Socket();
    socket.connect(ATRI_IPC_PATH, () => {
      socket.write(msg, (err) => {
        if (err) {
          rej(err);
        } else {
          res();
          socket.destroy();
        }
      });
    });
  });
}
