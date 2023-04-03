import type { FC } from "react";

const fcStore: { [route: string]: FC } = {};
const subscribers: { [route: string]: ((fc: FC) => void)[] } = {};

export const AtriFCStore: {
  push: (route: string, fc: FC) => void;
  subscribe: (route: string, cb: (fc: FC) => void) => () => void;
} = {
  push(route, fc) {
    fcStore[route] = fc;
    subscribers[route].forEach((subscriber) => {
      try {
        subscriber(fc);
      } catch {}
    });
  },
  subscribe(route, cb) {
    if (subscribers[route] === undefined) {
      subscribers[route] = [];
    }
    subscribers[route].push(cb);
    return () => {
      const foundIndex = subscribers[route].findIndex((curr) => curr === cb);
      if (foundIndex >= 0) {
        subscribers[route].splice(foundIndex, 1);
      }
    };
  },
};
