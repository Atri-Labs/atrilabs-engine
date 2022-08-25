import React, { useEffect, useState } from "react";
import { subscribeStylesheetUpdates } from "../resources/stylesheet";

export const useSubscribeStylesheetUpdates = () => {
  const [stylesheets, setStylesheets] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    subscribeStylesheetUpdates((info) => {
      if (info.content) {
        setStylesheets((old) => {
          const styleNode = <style key={old.length}>{info.content}</style>;
          return [...old, styleNode];
        });
      }
    });
  }, []);

  return { stylesheets };
};
