import { useEffect } from "react";
import { gray700, gray800 } from "@atrilabs/design-system";
import { useAppMenu } from "./hooks/useAppMenu";
import { useCanvasMenu } from "./hooks/useCanvasMenu";
import { usePageMenu } from "./hooks/usePageMenu";
import { usePublishMenu } from "./hooks/usePublishMenu";
import { currentForest, setCurrentForest } from "@atrilabs/core";
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
  canvasContainer: {},

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
  useEffect(() => {
    currentForest.on("reset", () => {
      console.log("current foreset reset");
    });
  }, []);
  useEffect(() => {
    setCurrentForest("page", "1").then((forest) => {
      console.log(forest);
    });
  }, []);
  return (
    <div style={styles.outerDiv}>
      <div style={styles.leftPart}>
        <div style={styles.header}>
          <div style={styles.leftHeader}>
            <div style={styles.appMenu}>
              {appMenuItems.map((item, index) => (
                <item.comp {...item.props} key={index} />
              ))}
            </div>
            <div style={styles.pageMenu}>
              {pageMenuItems.map((item, index) => (
                <item.comp {...item.props} key={index} />
              ))}
            </div>
          </div>
          <div style={styles.middleHeader}>
            <div style={styles.canvasMenu}>
              {canvasMenuItems.map((item, index) => (
                <item.comp {...item.props} key={index} />
              ))}
            </div>
          </div>
          <div style={styles.rightHeader}>
            <div style={styles.publishMenu}>
              {publishMenuItems.map((item, index) => (
                <item.comp {...item.props} key={index} />
              ))}
            </div>
          </div>
        </div>
        <div style={styles.body}>
          <div style={styles.dropContainer}>
            {dropContainerItem ? (
              <dropContainerItem.comp {...dropContainerItem.props} />
            ) : null}
          </div>
          <div style={styles.canvasContainer}>
            {canvasContainerItem ? (
              <canvasContainerItem.comp {...canvasContainerItem.props} />
            ) : null}
          </div>
        </div>
      </div>
      <div style={styles.rightPart}></div>
    </div>
  );
};
