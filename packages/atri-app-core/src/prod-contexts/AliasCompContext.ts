import {
  Callback,
  CallbackHandler,
} from "@atrilabs/react-component-manifest-schema";
import React from "react";

export const AliasCompMapContext = React.createContext<{
  [alias: string]: {
    Comp: React.FC<any>;
    ref: React.RefObject<HTMLElement>;
    actions: { [callbackName: string]: Callback[] };
    handlers: { [callbackName: string]: CallbackHandler };
  };
}>({});
