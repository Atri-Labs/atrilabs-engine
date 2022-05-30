import { Menu } from "@atrilabs/core";
import { PageSelector } from "./PageSelector";

export default function () {
  console.log("app-page-layer loaded");
  return (
    <Menu name="AppMenu">
      <PageSelector />
    </Menu>
  );
}
