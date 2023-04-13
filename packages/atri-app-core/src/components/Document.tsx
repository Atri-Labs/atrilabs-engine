import { AtriScripts } from "@atrilabs/atri-app-core";
import { Main } from "@atrilabs/atri-app-core";

// used only server side
export default function Document() {
  return (
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
        <AtriScripts />
      </head>
      <body>
        <Main />
      </body>
    </html>
  );
}
