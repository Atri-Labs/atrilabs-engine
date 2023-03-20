import { spawn } from "child_process";

export function executeChildProcess(
  options: {
    cmd: string;
    args?: string[];
    env?: typeof process.env;
    abortController?: AbortController;
  },
  callbacks: {
    onStdOut?: (data: string) => void;
    onStdError?: (data: string) => void;
  }
) {
  return new Promise<number | null>((res) => {
    const { cmd, args, env } = options;
    const { onStdError, onStdOut } = callbacks;
    const abortController = options.abortController ?? new AbortController();
    const childProcess = spawn(cmd, args, {
      env,
      signal: abortController.signal,
    });
    childProcess.stdout.on("data", (data) => {
      onStdOut?.(data);
    });

    childProcess.stderr.on("data", (data) => {
      onStdError?.(data);
    });

    childProcess.on("close", (code) => {
      res(code);
    });
  });
}
