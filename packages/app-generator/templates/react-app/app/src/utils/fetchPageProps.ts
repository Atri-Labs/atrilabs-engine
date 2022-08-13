export function fetchPageProps(pageRoute: string) {
  const payload = JSON.stringify({ pageRoute });
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
