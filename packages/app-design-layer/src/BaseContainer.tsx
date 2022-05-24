import React from "react";
import { gray700, gray800 } from "@atrilabs/design-system";
import { useAppMenu } from "./hooks/useAppMenu";
import { useCanvasMenu } from "./hooks/useCanvasMenu";
import { usePageMenu } from "./hooks/usePageMenu";
import { usePublishMenu } from "./hooks/usePublishMenu";
import { useDropContainer } from "./hooks/useDropContainer";
import { useCanvasContainer } from "./hooks/useCanvasContainer";

const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    height: "100%",
    width: "100%",
    display: "flex",
  },

  // children of outerDiv
  leftPart: {
    height: "100%",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  rightPart: { height: "100%", width: "15rem", display: "flex" },

  // children of leftPart
  header: {
    height: "2.5rem",
    background: gray700,
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "border-box",
    borderBottom: `1px solid ${gray800}`,
  },
  body: { display: "flex", flexGrow: 1 },

  // children of body
  dropContainer: {},
  canvasContainer: {
    position: "relative",
    flexGrow: 1,
    flexShrink: 1,
  },

  // chilren of header
  leftHeader: { display: "flex" },
  middleHeader: { display: "flex" },
  rightHeader: { display: "flex" },

  // chilren of leftHeader
  appMenu: { display: "flex" },
  pageMenu: { display: "flex" },

  // children of  middleHeader
  canvasMenu: { display: "flex" },

  // children of rightHeader
  publishMenu: { display: "flex" },
};

export const BaseContainer: React.FC = () => {
  const appMenuItems = useAppMenu();
  const pageMenuItems = usePageMenu();
  const canvasMenuItems = useCanvasMenu();
  const publishMenuItems = usePublishMenu();
  const dropContainerItem = useDropContainer();
  const canvasContainerItem = useCanvasContainer();
  return (
    <div style={styles.outerDiv}>
      <div style={styles.leftPart}>
        <div style={styles.header}>
          <div style={styles.leftHeader}>
            <div style={styles.appMenu}>
              {appMenuItems.flat().map((Item, index) => {
                return <React.Fragment key={index}>{Item}</React.Fragment>;
              })}
            </div>
            <div style={styles.pageMenu}>
              {pageMenuItems.flat().map((Item, index) => {
                return <React.Fragment key={index}>{Item}</React.Fragment>;
              })}
            </div>
          </div>
          <div style={styles.middleHeader}>
            <div style={styles.canvasMenu}>
              {canvasMenuItems.flat().map((Item, index) => {
                return <React.Fragment key={index}>{Item}</React.Fragment>;
              })}
            </div>
          </div>
          <div style={styles.rightHeader}>
            <div style={styles.publishMenu}>
              {publishMenuItems.flat().map((Item, index) => {
                return <React.Fragment key={index}>{Item}</React.Fragment>;
              })}
            </div>
          </div>
        </div>
        <div style={styles.body}>
          <div style={styles.dropContainer}>
            {dropContainerItem ? dropContainerItem : null}
          </div>
          <div style={styles.canvasContainer}>
            {canvasContainerItem ? canvasContainerItem : null}
          </div>
        </div>
      </div>
      <div style={styles.rightPart}></div>
    </div>
  );
};
