export function fetchPageProps(pageRoute: string, query: string) {
  const payload = JSON.stringify({ pageRoute, query });
  const options: RequestInit = {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": payload.length.toString(),
    },
  };
  return fetch("/handle-page-request", options).then((res) => res.json());
}
