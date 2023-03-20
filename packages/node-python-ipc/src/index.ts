import { generateSocketFilename } from "./generateSocketFilename";
import { generatePipePath } from "./generatePipePath";
import { createIPCServer } from "./createIPCServer";
import { executeChildProcess } from "./executeChildProcess";

/**
 * The child process will be provided ATRI_IPC_PATH
 * with the path to socket file or pipe path.
 *
 * The process.env is ignored if custom env is provided.
 */
export function runIPC(
  options: {
    // default is atri
    prefix?: string;
    // default is empty string
    suffix?: string;
    // default is os.tmpdir()
    tmpdir?: string;
    cmd: string;
    args?: string[];
    env?: typeof process.env;
    abortController?: AbortController;
  },
  callbacks: {
    onClientSocketEnd?: (data: string) => void;
    onStdOut?: (data: string) => void;
    onStdError?: (data: string) => void;
    onChildProcessClose?: (code: number | null) => void;
  }
) {
  const server = createIPCServer({
    onClientSocketEnd: callbacks.onClientSocketEnd,
  });
  const ATRI_IPC_PATH =
    process.platform === "win32"
      ? generatePipePath(options)
      : generateSocketFilename(options);
  const extraEnv = { ATRI_IPC_PATH };

  server.listen(ATRI_IPC_PATH, () => {
    executeChildProcess(
      {
        cmd: options.cmd,
        args: options.args,
        env: {
          ...(options.env !== undefined ? options.env : process.env),
          ...extraEnv,
        },
        abortController: options.abortController,
      },
      { onStdError: callbacks.onStdError, onStdOut: callbacks.onStdOut }
    ).then(callbacks.onChildProcessClose);
  });

  return server;
}
