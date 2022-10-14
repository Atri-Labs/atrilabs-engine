import { api } from "@atrilabs/core";
import { useEffect, useState } from "react";

export const useGetServiceStatus = () => {
  const [status, setStatus] = useState<{
    isEventServerConnected: boolean;
    isIPCServerConnected: boolean;
  }>({
    isEventServerConnected: false,
    isIPCServerConnected: false,
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
    } else {
      socket.on("connect", onEventServerConnected);
    }

    if (socket.disconnected) {
      onEventServerDisconnected();
    } else {
      socket.on("disconnect", onEventServerDisconnected);
    }

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
    } else {
      ipcSocket.on("connect", onIPCSocketConnected);
    }

    if (ipcSocket.disconnected) {
      onIPCSocketDisconnected();
    } else {
      ipcSocket.on("disconnect", onIPCSocketDisconnected);
    }

    return () => {
      socket.off("connect", onEventServerConnected);
      socket.off("disconnect", onEventServerDisconnected);

      ipcSocket.off("connect", onIPCSocketConnected);
      ipcSocket.off("disconnect", onIPCSocketDisconnected);
    };
  }, []);
  return { status };
};
