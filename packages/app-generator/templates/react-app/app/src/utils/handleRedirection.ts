import { navigateExternally } from "./navigate";

export function handleRedirection(res: Response) {
  if (res.headers.get("location") || res.headers.get("Location")) {
    const location = res.headers.get("location") || res.headers.get("Location");
    if (location) {
      // TODO: internal navigation if relative url
      // handle page request will have query parameters attached to it
      navigateExternally(location, "_self");
    }
  }
  return res;
}
