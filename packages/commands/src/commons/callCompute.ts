import { runIPC } from "@atrilabs/node-python-ipc";

export function callCompute(route: string, state: any) {
  try {
    runIPC(
      {
        cmd: "python3",
        args: [
          "-m",
          "controllers.main",
          "compute",
          "--route",
          route,
          "--state",
          JSON.stringify(state),
        ],
      },
      {
        onClientSocketEnd: (data) => {
          console.log("clientSocketEnd:", data);
        },
        onStdError(data) {
          console.log("stderr:", data.toString());
        },
        onStdOut(data) {
          console.log("stdout:", data.toString());
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
}
