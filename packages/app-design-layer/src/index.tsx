import { BaseContainer } from "./BaseContainer";
import { useEffect, useMemo, useCallback } from "react";
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
  // We need to use a hook that will run once everytime this layer is created.
  // Also this hook need to run before JSX is processed.
  useMemo(() => {
    const forest = BrowserForestManager.setCurrentForest(
      AppDesginForestId,
      "home"
    );
    if (!forest) {
      console.error(
        `Unable to load forest home from forest type ${AppDesginForestId}`
      );
    }
  }, []);
  const onBaseContainerClose = useCallback(() => {}, []);
  return (
    <>
      <Menu name="BaseHeaderMenu" order={0}>
        <div style={{ height: "2.5rem", borderBottom: `1px solid ${gray800}` }}>
          <IconMenu onClick={() => {}}>
            <DesignIcon />
          </IconMenu>
        </div>
      </Menu>
      <Container name="BaseContainer" onClose={onBaseContainerClose}>
        <BaseContainer />
      </Container>
    </>
  );
}
