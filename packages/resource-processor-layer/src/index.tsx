import { Container, Menu } from "@atrilabs/core";
import { gray500, gray800, IconMenu, smallText } from "@atrilabs/design-system";
import { ReactComponent as DownloadCloud } from "./assets/download-cloud.svg";
import { useState, useCallback } from "react";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderRight: `1px solid ${gray800}`,
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

  return (
    <>
      <Menu name="PageMenu" order={2}>
        <div style={styles.iconContainer}>
          <IconMenu onClick={openDropContainer} active={false}>
            <DownloadCloud />
          </IconMenu>
        </div>
      </Menu>
      {showDropPanel ? (
        <Container name="Drop" onClose={closeContainer}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                background: gray500,
                ...smallText,
                fontSize: "12px",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              You can paste a code that may look like one of the following:
              <ul>
                <li>
                  <code>@import url("navigation.css");</code>
                </li>
              </ul>
            </p>
            {/** import area */}
            <div>
              <textarea />
              <button>Import</button>
            </div>
            {/** imported resources list */}
            <div>
              <div>Imported Resources</div>
              <ul>
                <li>
                  <code></code>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      ) : null}
    </>
  );
}
