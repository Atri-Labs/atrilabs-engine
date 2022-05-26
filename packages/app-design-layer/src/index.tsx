import { BaseContainer } from "./BaseContainer";
import { useEffect } from "react";
import { BrowserForestManager } from "@atrilabs/core";
import { Container, Menu } from "@atrilabs/core";
import { ReactComponent as DesignIcon } from "./assets/design-icon.svg";
import { gray800, IconMenu } from "@atrilabs/design-system";
import AppDesginForestId from "@atrilabs/app-design-forest?id";

export default function () {
  console.log("app-design-layer loaded");
  useEffect(() => {
    BrowserForestManager.currentForest.on("reset", () => {
      console.log("current foreset reset");
    });
  }, []);
  useEffect(() => {
    BrowserForestManager.setCurrentForest(AppDesginForestId, "home").then(
      (forest) => {
        console.log(forest);
      }
    );
  }, []);
  return (
    <>
      <Menu name="BaseHeaderMenu">
        <div style={{ height: "2.5rem", borderBottom: `1px solid ${gray800}` }}>
          <IconMenu onClick={() => {}}>
            <DesignIcon />
          </IconMenu>
        </div>
      </Menu>
      <Container name="BaseContainer">
        <BaseContainer />
      </Container>
    </>
  );
}
