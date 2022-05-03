import { Pages } from "./Pages";
import { appMenu } from "./required";

export default function () {
  console.log("app-page-layer working");
  appMenu.register({ comp: Pages, props: {} });
}
