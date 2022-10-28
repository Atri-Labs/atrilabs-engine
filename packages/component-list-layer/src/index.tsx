import React, { useCallback, useState } from "react";
import { Container, Menu } from "@atrilabs/core";
import {
  gray300,
  gray700,
  gray800,
  h1Heading,
  IconMenu,
} from "@atrilabs/design-system";
import { ReactComponent as Insert } from "./assets/insert.svg";
import { Cross } from "./assets/Cross";
import { useManifestRegistry } from "./hooks/useManifestRegistry";
import "./utils/manifests";
import { CategoryList } from "./components/CategoryList";
import "./index.css";

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
  },
  // ===========header======================
  dropContainerItemHeader: {
    padding: `0.5rem 1rem`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
  },
  dropContainerItemHeaderH4: {
    ...h1Heading,
    color: gray300,
    margin: 0,
  },
  // =============header icons====================
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
    height: "100% !important",
  },
  // ===============main layout=====================
};

export default function () {
  const [showInsertPanel, setShowInsertPanel] = useState<boolean>(false);
  const onClick = useCallback(() => {
    setShowInsertPanel(true);
  }, []);
  const closeContainer = useCallback(() => {
    setShowInsertPanel(false);
  }, []);

  const { categorizedComponents } = useManifestRegistry();

  return (
    <>
      <Menu name="PageMenu" order={0}>
        <div style={styles.iconContainer} data-tooltip="Component Manager" className="tool-tip">
          <IconMenu onClick={onClick} active={false}>
            <Insert />
          </IconMenu>
        </div>
      </Menu>
      {showInsertPanel ? (
        <Container name="Drop" onClose={closeContainer}>
          <div className="tb-scroll" style={styles.dropContainerItem}>
            <header style={styles.dropContainerItemHeader}>
              <h4 style={styles.dropContainerItemHeaderH4}>Insert Component</h4>
              <div style={styles.icons}>
                <span style={styles.iconsSpan} onClick={closeContainer}>
                  <Cross />
                </span>
              </div>
            </header>
            {categorizedComponents["Layout"] ? (
              <CategoryList
                categorizedComponents={categorizedComponents}
                categoryName={"Layout"}
              />
            ) : null}
            {categorizedComponents["Basics"] ? (
              <CategoryList
                categorizedComponents={categorizedComponents}
                categoryName={"Basics"}
              />
            ) : null}
            {categorizedComponents["Data"] ? (
              <CategoryList
                categorizedComponents={categorizedComponents}
                categoryName={"Data"}
              />
            ) : null}
            {
              /**Display other categories */
              Object.keys(categorizedComponents)
                .filter(
                  (value) =>
                    value !== "Layout" && value !== "Basics" && value !== "Data"
                )
                .sort((a, b) => {
                  return a < b ? -1 : 0;
                })
                .map((categoryName) => {
                  return (
                    <CategoryList
                      categorizedComponents={categorizedComponents}
                      categoryName={categoryName}
                    />
                  );
                })
            }
          </div>
        </Container>
      ) : null}
    </>
  );
}
