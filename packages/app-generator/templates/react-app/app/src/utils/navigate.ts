const internalNavigationSubscribers: ((url: string) => void)[] = [];

export function subscribeInternalNavigation(cb: (url: string) => void) {
  internalNavigationSubscribers.push(cb);
  return () => {
    const index = internalNavigationSubscribers.findIndex((curr) => {
      return curr === cb;
    });
    if (index >= 0) {
      internalNavigationSubscribers.splice(index, 1);
    }
  };
}

export function navigateInternally(url: string) {
  internalNavigationSubscribers.forEach((cb) => cb(url));
}

/**
 *
 * Navigating externally implies page reload in browser, hence,
 * we don't need to do it from inside react context.
 */
export function navigateExternally(url: string, target?: "_blank" | "_self") {
  if (url.startsWith("/")) {
    const newUrl = window.location.protocol + "//" + window.location.host + url;
    window.open(newUrl, target);
  } else {
    try {
      window.open(url, target);
    } catch (err) {
      console.log(err);
    }
  }
}
