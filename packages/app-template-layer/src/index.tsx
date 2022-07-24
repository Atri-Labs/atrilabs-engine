import { useCallback, useState } from "react";
import { Container, Menu } from "@atrilabs/core";
import {
  gray300,
  gray700,
  gray800,
  h1Heading,
  IconMenu,
  smallText,
} from "@atrilabs/design-system";
import { ReactComponent as OpenTemplateIcon } from "./assets/open-template.svg";
import { Cross } from "./assets/Cross";
import { useComponentSelected } from "./hooks/useComponentSelected";

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
  outerDiv: {
    ...smallText,
    color: gray300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    borderLeft: `1px solid ${gray800}`,
    borderRight: `1px solid ${gray800}`,
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    userSelect: "none",
  },
  popupDiv: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "100%",
    backgroundColor: "black",
    width: "10rem",
    zIndex: 1,
    right: 0,
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

  const { selected } = useComponentSelected();

  return (
    <>
      <Menu name="PageMenu">
        <div style={styles.iconContainer}>
          <IconMenu onClick={openDropContainer} active={false}>
            <OpenTemplateIcon />
          </IconMenu>
        </div>
      </Menu>

      {showDropPanel ? (
        <Container name="Drop">
          <div style={styles.dropContainerItem}>
            <header style={styles.dropContainerItemHeader}>
              <h4 style={styles.dropContainerItemHeaderH4}>Select Template</h4>
              <div style={styles.icons}>
                <span style={styles.iconsSpan} onClick={closeContainer}>
                  <Cross />
                </span>
              </div>
            </header>
          </div>
        </Container>
      ) : null}

      {selected ? (
        <Menu name="PublishMenu">
          <div style={styles.outerDiv} onClick={() => {}}>
            Create Template
          </div>
        </Menu>
      ) : null}
    </>
  );
}
