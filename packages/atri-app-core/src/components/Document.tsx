import { AtriScripts } from "@atrilabs/atri-app-core";
import { Main } from "@atrilabs/atri-app-core";

// used only server side
export default function Document() {
  return (
    <html>
      <head>
        <AtriScripts />
      </head>
      <body>
        <Main />
      </body>
    </html>
  );
}
