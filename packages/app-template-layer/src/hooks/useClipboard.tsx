import { useCallback } from "react";

export const useClipboard = () => {
  const putInClipboard = useCallback((text: string) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      console.log("Copy/Paste needs navigator && navigator.clipboard");
    }
  }, []);
  const getFromClipboard = useCallback(() => {
    if (navigator && navigator.clipboard) {
      return navigator.clipboard.readText();
    } else {
      console.log("Copy/Paste needs navigator && navigator.clipboard");
    }
  }, []);

  return { putInClipboard, getFromClipboard };
};
