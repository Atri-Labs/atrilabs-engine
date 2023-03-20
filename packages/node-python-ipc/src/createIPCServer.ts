import net from "net";

export function createIPCServer(callbacks: {
  onClientSocketEnd?: (data: string) => void;
}) {
  const { onClientSocketEnd } = callbacks;

  const server = net.createServer((socket) => {
    let chunk = "";
    socket.on("data", (data) => {
      chunk = chunk + data.toString();
    });
    socket.on("end", function () {
      onClientSocketEnd?.(chunk);
      server.close();
    });
  });

  return server;
}
