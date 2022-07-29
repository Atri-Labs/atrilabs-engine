import { gray700, gray800 } from "@atrilabs/design-system";
import React from "react";
import { useBaseContainer } from "./hooks/useBaseContainer";
import { useFooterMenu } from "./hooks/useFooterMenu";
import { useHeaderMenu } from "./hooks/useHeaderMenu";
import { useLogo } from "./hooks/useLogo";
import { useOverlayContainer } from "./hooks/useOverlayContainer";
import "./styles.css";
const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    height: "100vh",
    width: "100%",
    display: "flex",
    position: "relative",
  },

  // outerDiv children
  overlayContainer: {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },

  leftPanel: {
    width: "2.5rem",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  containerPanel: { flexGrow: 1 },

  // leftPanel children
  logo: { width: "2.5rem", height: "2.5rem", backgroundColor: gray700 },
  menuContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: gray700,
    borderRight: `1px solid ${gray800}`,
    boxSizing: "border-box",
  },

  // menuContainer children
  headerMenu: {},
  footerMenu: {},
};

export const App: React.FC = () => {
  const logoItem = useLogo();
  const headerMenuItems = useHeaderMenu();
  const footerMenuItems = useFooterMenu();
  const baseContainer = useBaseContainer();
  const overlayContainer = useOverlayContainer();
  return (
    <div style={styles.outerDiv}>
      {overlayContainer ? (
        <div style={styles.overlayContainer}>{overlayContainer.node}</div>
      ) : null}
      <div style={styles.leftPanel}>
        <div style={styles.logo}>{logoItem ? logoItem : null}</div>
        <div style={styles.menuContainer}>
          <div style={styles.headerMenu}>
            {headerMenuItems.flat().map((Item, index) => {
              return <React.Fragment key={index}>{Item.nodes}</React.Fragment>;
            })}
          </div>
          <div style={styles.footerMenu}>
            {footerMenuItems.flat().map((Item, index) => {
              return <React.Fragment key={index}>{Item.nodes}</React.Fragment>;
            })}
          </div>
        </div>
      </div>
      <div style={styles.containerPanel}>
        {baseContainer ? baseContainer : null}
      </div>
    </div>
  );
};
