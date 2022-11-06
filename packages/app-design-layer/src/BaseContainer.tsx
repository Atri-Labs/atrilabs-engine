import React, { useRef, useState, useEffect } from "react";
import { gray700, gray800, gray900 } from "@atrilabs/design-system";
import { useAppMenu } from "./hooks/useAppMenu";
import { useCanvasMenu } from "./hooks/useCanvasMenu";
import { usePageMenu } from "./hooks/usePageMenu";
import { usePublishMenu } from "./hooks/usePublishMenu";
import { useDropContainer } from "./hooks/useDropContainer";
import { useCanvasContainer } from "./hooks/useCanvasContainer";
import { usePropertiesTab } from "./hooks/usePropertiesTab";
import { attachRef } from "@atrilabs/core";
import { usePlaygroundContainer } from "./hooks/usePlaygroundOverlayContainer";

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
  rightPart: {
    position: "relative",
    minHeight: "100%",
    width: "15rem",
    display: "flex",
    background: gray700,
    flexDirection: "column",
  },

  // children of leftPart
  header: {
    height: "2.5rem",
    background: gray700,
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "border-box",
    borderBottom: `1px solid ${gray800}`,
  },
  body: {
    display: "flex",
    flexGrow: 1,
    position: "relative",
    height: "calc(100% - 2.5rem)",
  },

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

  // children of rightPart
  propertyTabHeader: {
    display: "flex",
    height: "2.5rem",
    boxSizing: "border-box",
    border: `1px solid ${gray800}`,
    cursor: "pointer",
  },
  propertyTabHeaderItem: {
    width: "2.5rem",
    height: "100%",
  },
  propertyTabBody: {
    width: "100%",
    height: `calc(100% - 2.5rem)`,
  },
};

export const BaseContainer: React.FC = () => {
  const appMenuItems = useAppMenu();
  const pageMenuItems = usePageMenu();
  const canvasMenuItems = useCanvasMenu();
  const publishMenuItems = usePublishMenu();
  const dropContainerItem = useDropContainer();
  const canvasContainerItem = useCanvasContainer();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const propertyTabItems = usePropertiesTab();
  const dragZoneRef = useRef<HTMLDivElement>(null);
  attachRef("Dragzone", dragZoneRef);
  const playgroundContainerItem = usePlaygroundContainer();
  useEffect(() => {
    if (propertyTabItems.length < selectedTab) {
      setSelectedTab(0);
    }
  }, [propertyTabItems, selectedTab]);
  return (
    <div style={styles.outerDiv}>
      <div style={styles.leftPart}>
        <div style={styles.header}>
          <div style={styles.leftHeader}>
            <div style={styles.appMenu}>
              {appMenuItems.flat().map((Item, index) => {
                return (
                  <React.Fragment key={index}>{Item.nodes}</React.Fragment>
                );
              })}
            </div>
            <div style={styles.pageMenu}>
              {pageMenuItems.flat().map((Item, index) => {
                return (
                  <React.Fragment key={index}>{Item.nodes}</React.Fragment>
                );
              })}
            </div>
          </div>
          <div style={styles.middleHeader}>
            <div style={styles.canvasMenu}>
              {canvasMenuItems.flat().map((Item, index) => {
                return (
                  <React.Fragment key={index}>{Item.nodes}</React.Fragment>
                );
              })}
            </div>
          </div>
          <div style={styles.rightHeader}>
            <div style={styles.publishMenu}>
              {publishMenuItems.flat().map((Item, index) => {
                return (
                  <React.Fragment key={index}>{Item.nodes}</React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
        <div style={styles.body} ref={dragZoneRef}>
          <div style={styles.dropContainer}>
            {dropContainerItem ? dropContainerItem.node : null}
          </div>
          <div style={styles.canvasContainer}>
            {canvasContainerItem ? canvasContainerItem.node : null}
          </div>
          {playgroundContainerItem ? playgroundContainerItem.node : null}
        </div>
      </div>
      <div style={styles.rightPart}>
        <div style={styles.propertyTabHeader}>
          {propertyTabItems
            .sort((a, b) => {
              return b.itemName < a.itemName ? -1 : 0;
            })
            .map((item, index) => {
              const style = { ...styles.propertyTabHeaderItem };
              if (index === selectedTab) {
                style.background = gray900;
              }
              return (
                <div
                  style={style}
                  onClick={() => {
                    setSelectedTab(index);
                  }}
                  key={index}
                >
                  {item.header}
                </div>
              );
            })}
        </div>
        <div style={styles.propertyTabBody}>
          {propertyTabItems[selectedTab]
            ? propertyTabItems[selectedTab].body
            : null}
        </div>
      </div>
    </div>
  );
};
