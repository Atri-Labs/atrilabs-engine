import http from "http";
import { Request } from "express";

export function forwardGetPageRequest(params: {
  pageState: any;
  pageRoute: string;
  query: string;
  controllerHostname: string;
  controllerPort: number;
  req: Request;
}) {
  return new Promise<{ pageState: any; headers: any; statusCode: number }>(
    (res, rej) => {
      const {
        pageState,
        pageRoute,
        controllerHostname,
        controllerPort,
        req,
        query,
      } = params;
      const payload = JSON.stringify({
        route: pageRoute,
        state: pageState,
        query,
      });
      const forward_req = http.request(
        {
          hostname: controllerHostname,
          port: controllerPort,
          path: "/handle-page-request",
          method: "POST",
          headers: {
            ...req.headers,
            "Content-Type": "application/json",
            "Content-Length": payload.length,
            "Transfer-Encoding": "chunked",
          },
        },
        (forward_res) => {
          forward_res.setEncoding("utf8");
          let data = "";
          forward_res.on("data", (chunk) => {
            data = data + chunk;
          });
          forward_res.on("end", () => {
            try {
              const newPageState = JSON.parse(data);
              res({
                pageState: newPageState,
                headers: forward_res.headers,
                statusCode: forward_res.statusCode || 200,
              });
            } catch (err) {
              console.log("Unexpected Forward Response\n", err);
              rej(501);
            }
          });
        }
      );
      forward_req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
        rej(501);
      });
      forward_req.write(payload);
      forward_req.end();
    }
  );
}
