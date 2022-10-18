import { api } from "@atrilabs/core";
import { useEffect, useState } from "react";

export const useGetServiceStatus = () => {
  const [status, setStatus] = useState<{
    isEventServerConnected: boolean;
    isIPCServerConnected: boolean;
    atriCLIConnected: boolean;
    publishServerConnected: boolean;
  }>({
    isEventServerConnected: false,
    isIPCServerConnected: false,
    atriCLIConnected: false,
    publishServerConnected: false,
  });
  useEffect(() => {
    const socket = api.getSocket();
    const onEventServerConnected = () => {
      setStatus((old) => {
        return { ...old, isEventServerConnected: true };
      });
    };
    const onEventServerDisconnected = () => {
      setStatus((old) => {
        return { ...old, isEventServerConnected: false };
      });
    };

    if (socket.connected) {
      onEventServerConnected();
    }
    socket.on("connect", onEventServerConnected);

    if (socket.disconnected) {
      onEventServerDisconnected();
    }
    socket.on("disconnect", onEventServerDisconnected);

    const ipcSocket = api.getIPCSocket();
    const onIPCSocketConnected = () => {
      setStatus((old) => {
        return { ...old, isIPCServerConnected: true };
      });
    };
    const onIPCSocketDisconnected = () => {
      setStatus((old) => {
        return { ...old, isIPCServerConnected: false };
      });
    };

    if (ipcSocket.connected) {
      onIPCSocketConnected();
    }
    ipcSocket.on("connect", onIPCSocketConnected);

    if (ipcSocket.disconnected) {
      onIPCSocketDisconnected();
    }
    ipcSocket.on("disconnect", onIPCSocketDisconnected);

    return () => {
      socket.off("connect", onEventServerConnected);
      socket.off("disconnect", onEventServerDisconnected);

      ipcSocket.off("connect", onIPCSocketConnected);
      ipcSocket.off("disconnect", onIPCSocketDisconnected);
    };
  }, []);

  useEffect(() => {
    const ipcSocket = api.getIPCSocket();
    let unsub: () => void;

    const onIPCSocketConnection = () => {
      api.getAttachedServicesStatus((newStatus) => {
        setStatus((status) => {
          return {
            ...status,
            atriCLIConnected: newStatus["atri-cli"] ? true : false,
            publishServerConnected: newStatus["publish-server"] ? true : false,
          };
        });
      });
      unsub = api.subscribeServiceStatus((newStatus) => {
        setStatus((status) => {
          return {
            ...status,
            atriCLIConnected: newStatus["atri-cli"] ? true : false,
            publishServerConnected: newStatus["publish-server"] ? true : false,
          };
        });
      });
    };

    if (ipcSocket.connected) {
      onIPCSocketConnection();
    }
    ipcSocket.on("connect", () => {
      onIPCSocketConnection();
    });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, []);
  return { status };
};
