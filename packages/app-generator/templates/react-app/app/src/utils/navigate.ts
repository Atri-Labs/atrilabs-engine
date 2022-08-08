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
