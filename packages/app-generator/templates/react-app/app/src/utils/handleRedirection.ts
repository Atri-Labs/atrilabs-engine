import { navigateExternally } from "./navigate";

export function handleRedirection(res: Response) {
  if (res.status > 300 && res.status < 310) {
    const location = res.headers["location"] || res.headers["Location"];
    if (location) {
      // TODO: internal navigation if relative url
      // handle page request will have query parameters attached to it
      navigateExternally(location, "_self");
    }
  }
}
