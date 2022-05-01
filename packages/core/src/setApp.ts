type App = React.ReactChild | Iterable<React.ReactNode>;

const setAppSubscribers: ((app: App) => void)[] = [];
let setAppCalledFlag = false;

// setApp can be called only once!
export function setApp(app: App) {
  if (setAppCalledFlag) return;
  setAppCalledFlag = true;
  setAppSubscribers.forEach((subscriber) => {
    subscriber(app);
  });
}

// This function is only for internal use. Please don't use it outside this package.
export function subscribeSetApp(cb: (app: App) => void) {
  setAppSubscribers.push(cb);
}
