import { api, Container, Menu } from "@atrilabs/core";
import {
  amber300,
  gray200,
  gray300,
  gray500,
  gray700,
  gray800,
  gray900,
  h1Heading,
  h4Heading,
  IconMenu,
  smallText,
} from "@atrilabs/design-system";
import { ReactComponent as DownloadCloud } from "./assets/download-cloud.svg";
import { useState, useCallback, useRef } from "react";
import { Cross } from "./assets/Cross";
import { useFetchResources } from "./hooks/useFetchResources";
import "./styles.css";
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
  importBtn: {
    ...h4Heading,
    border: "none",
    outline: "none",
    background: amber300,
    borderRadius: "4px",
    color: gray900,
    padding: "6px 0",
    textAlign: "center",
    width: "13rem",
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

  // import new resources
  const importResourceTextareaRef = useRef<HTMLTextAreaElement>(null);
  const onImportBtnClick = useCallback(() => {
    if (importResourceTextareaRef.current) {
      const importSrc = importResourceTextareaRef.current.value;
      api.importResource({ str: importSrc }, (success) => {
        if (success && importResourceTextareaRef.current) {
          importResourceTextareaRef.current.value = "";
        }
      });
    }
  }, []);

  // fetch resources
  const { resources } = useFetchResources();

  return (
    <>
      <Menu name="PageMenu" order={3}>
        <div
          style={styles.iconContainer}
          data-tooltip="Resource Manager"
          className="tool-tip"
        >
          <IconMenu onClick={openDropContainer} active={false}>
            <DownloadCloud />
          </IconMenu>
        </div>
      </Menu>
      {showDropPanel ? (
        <Container name="Drop" onClose={closeContainer}>
          <div style={styles.dropContainerItem}>
            <header style={styles.dropContainerItemHeader}>
              <h4 style={styles.dropContainerItemHeaderH4}>Resources</h4>
              <div style={styles.icons}>
                <span style={styles.iconsSpan} onClick={closeContainer}>
                  <Cross />
                </span>
              </div>
            </header>

            <div
              style={{
                background: gray900,
                ...smallText,
                color: gray200,
                padding: "0.5rem 1rem",
                marginBottom: "0.5rem",
              }}
            >
              Import New Resources
            </div>
            <div
              style={{
                padding: "0 1rem",
                rowGap: "0.5rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  background: gray500,
                  ...smallText,
                  fontSize: "12px",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  color: gray200,
                }}
              >
                You can paste a code that may look like one of the following:
                <ul style={{ listStyle: "none", padding: "0px" }}>
                  <li>
                    <code>@import url("abc.css");</code>
                  </li>
                </ul>
              </div>

              {/** import area */}
              <div>
                <textarea
                  style={{
                    width: "calc(100%)",
                    borderRadius: "4px",
                    outline: "none",
                    boxSizing: "border-box",
                    padding: "0.5rem",
                    background: gray900,
                    ...smallText,
                    color: "white",
                    fontSize: "12px",
                  }}
                  rows={5}
                  ref={importResourceTextareaRef}
                />
                <button style={styles.importBtn} onClick={onImportBtnClick}>
                  Import
                </button>
              </div>
            </div>

            {/** imported resources list */}
            <div>
              <div
                style={{
                  background: gray900,
                  ...smallText,
                  color: gray200,
                  padding: "0.5rem 1rem",
                  marginTop: "1rem",
                }}
              >
                Imported Resources
              </div>
              <div
                style={{
                  padding: "0.5rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "10px",
                }}
              >
                {resources && Array.isArray(resources)
                  ? resources.map((resource, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            background: gray500,
                            ...smallText,
                            fontSize: "12px",
                            padding: "0.5rem",
                            borderRadius: "4px",
                            color: gray200,
                            userSelect: "all",
                          }}
                        >
                          <code style={{ overflowWrap: "anywhere" }}>
                            {resource.str}
                          </code>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          </div>
        </Container>
      ) : null}
    </>
  );
}
