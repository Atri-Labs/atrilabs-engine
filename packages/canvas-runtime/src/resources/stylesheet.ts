export type StylesheetInfo = {
  content?: string;
};

export type StylesheetSubscriberCallback = (info: StylesheetInfo) => void;

const styleSheetsubscribers: StylesheetSubscriberCallback[] = [];

export function subscribeStylesheetUpdates(cb: StylesheetSubscriberCallback) {
  styleSheetsubscribers.push(cb);
}

export function addStylesheet(info: StylesheetInfo) {
  if (info && info.content) {
    styleSheetsubscribers.forEach((cb) => cb(info));
  }
}
