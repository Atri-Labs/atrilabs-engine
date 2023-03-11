import { liveApi } from "../../api";

const API_ENDPOINT = process.env["ATRI_APP_API_ENDPOINT"];

function handleRedirection(res: Response) {
  return res;
}

function updatePropsFromDelta(delta: { [alias: string]: any }) {
  const aliases = Object.keys(delta);
  aliases.forEach((alias) => {
    const compId = liveApi.getComponentIdFromAlias(alias);
    if (compId) liveApi.mergeProps(compId, delta[alias]);
  });
}

export function sendEventDataFn(
  // alias of component on which event was fired
  alias: string,
  // name of the page in which the event was fired
  pageState: any,
  // route of the page in which the event was fired
  pageRoute: string,
  // name of the callback that fired this event
  callbackName: string,
  // data passed in the callback
  eventData: any
) {
  return fetch(`${API_ENDPOINT}/_atri/api/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      alias,
      route: pageRoute,
      callbackName,
      eventData,
      state: pageState,
    }),
  })
    .then((res) => handleRedirection(res))
    .then((res) => res.json())
    .then((res) => {
      if (res) {
        updatePropsFromDelta(res);
      }
    });
}
