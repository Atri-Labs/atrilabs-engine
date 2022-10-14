import { api } from "@atrilabs/core";
import { useEffect, useState } from "react";

export const useGetServiceStatus = () => {
  const [status, setStatus] = useState<{ isEventServerConnected: boolean }>({
    isEventServerConnected: false,
  });
  useEffect(() => {
    const socket = api.getSocket();
    const onEventServerConntected = () => {
      setStatus({ isEventServerConnected: true });
    };
    const onEventServerDisconnected = () => {
      setStatus({ isEventServerConnected: false });
    };
    if (socket.connected) {
      onEventServerConntected();
    } else {
      socket.on("connect", onEventServerConntected);
    }

    if (socket.disconnected) {
      onEventServerDisconnected();
    } else {
      socket.on("disconnect", onEventServerDisconnected);
    }
    return () => {
      socket.off("connect", onEventServerConntected);
      socket.off("disconnect", onEventServerDisconnected);
    };
  }, []);
  return { status };
};
