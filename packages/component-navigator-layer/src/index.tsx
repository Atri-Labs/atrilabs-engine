import { Container, Menu, useTree } from "@atrilabs/core";
import {
  gray300,
  gray700,
  gray800,
  h1Heading,
  IconMenu,
} from "@atrilabs/design-system";
import React, { useCallback, useState, useEffect } from "react";
import { ReactComponent as CompNavIcon } from "./assets/comp-nav-icon.svg";
import { Cross } from "./assets/Cross";
import { ComponentNavigatorWrapper } from "./ComponentNavigatorWrapper";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { transformTreeToNavigatorNode } from "./utils";
import { subscribeEditorMachine } from "@atrilabs/pwa-builder-manager";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderRight: `1px solid ${gray800}`,
  },
  dropContainerItem: {
    width: "15rem",
    height: `100%`,
    backgroundColor: gray700,
    boxSizing: "border-box",
    userSelect: "none",
    overflow: "auto",
    fontFamily: "Inter sans-serif",
  },
  dropContainerItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
  },
  dropContainerItemHeaderH4: {
    ...h1Heading,
    color: gray300,
    margin: "0px",
  },
  icons: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  iconsSpan: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    width: "1.3rem",
  },
};

export default function () {
  const [showDropPanel, setShowDropContianer] = useState<boolean>(false);
  const openDropContainer = useCallback(() => {
    setShowDropContianer(true);
  }, []);
  const closeContainer = useCallback(() => {
    setShowDropContianer(false);
  }, []);
  const tree = useTree(ComponentTreeId);
  useEffect(() => {
    subscribeEditorMachine("after_app_load", () => {
      console.log(transformTreeToNavigatorNode(tree, {}, {}));
    });
  }, [tree]);

  return (
    <>
      <Menu name="PageMenu" order={4}>
        <div
          style={styles.iconContainer}
          data-tooltip="Navigation Manager"
          className="tool-tip"
        >
          <IconMenu onClick={openDropContainer} active={false}>
            <CompNavIcon />
          </IconMenu>
        </div>
      </Menu>

      {showDropPanel ? (
        <Container name="Drop" onClose={closeContainer}>
          <div style={styles.dropContainerItem}>
            <header style={styles.dropContainerItemHeader}>
              <h4 style={styles.dropContainerItemHeaderH4}>Navigator</h4>
              <div style={styles.icons}>
                <span style={styles.iconsSpan} onClick={closeContainer}>
                  <Cross />
                </span>
              </div>
            </header>
            <ComponentNavigatorWrapper />
          </div>
        </Container>
      ) : null}
    </>
  );
}
