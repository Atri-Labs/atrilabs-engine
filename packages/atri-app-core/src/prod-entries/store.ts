import { ProdAppEntryOptions } from "../types";
import { mergeState } from "../utils/mergeState";

export const Store: {
  [urlPath: string]: {
    [alias: string]: { custom: any; styles?: React.CSSProperties };
  };
} = {};

export function addPageToStore(
  urlPath: string,
  store: ProdAppEntryOptions["entryRouteStore"]
) {
  Store[urlPath] = store;
}

const AliasPropsUpdateSubscribers: {
  [urlPath: string]: { [alias: string]: (() => void)[] };
} = {};
export function subscribePropsUpdated(
  urlPath: string,
  alias: string,
  cb: () => void
) {
  if (AliasPropsUpdateSubscribers[urlPath]?.[alias]) {
    AliasPropsUpdateSubscribers[urlPath][alias] = [];
  }
  AliasPropsUpdateSubscribers[urlPath][alias].push(cb);
  return () => {
    const foundIndex = AliasPropsUpdateSubscribers[urlPath][alias].findIndex(
      (curr) => curr === cb
    );
    if (foundIndex >= 0) {
      AliasPropsUpdateSubscribers[urlPath][alias].splice(foundIndex, 1);
    }
  };
}

export function updatePageStore(
  urlPath: string,
  delta: { [alias: string]: any }
) {
  if (Store[urlPath]) {
    mergeState(Store[urlPath], delta);
    const aliases = Object.keys(delta);
    aliases.forEach((alias) => {
      AliasPropsUpdateSubscribers[urlPath][alias]?.forEach((cb) => {
        try {
          cb();
        } catch {}
      });
    });
  }
}

export function getStoreForAlias(urlPath: string, alias: string) {
  return Store[urlPath]?.[alias] || { custom: {}, styles: {} };
}
