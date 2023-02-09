import { Container } from "@atrilabs/core";
import {
  gray300,
  gray400,
  gray700,
  gray800,
  h4Heading,
} from "@atrilabs/design-system";
import React, { useCallback, useState } from "react";
import { ArrowDown } from "./icons/ArrowDown";
import "./stylesheets/formfield.module.css";
import { useGetPageInfo } from "./hooks/useGetPageInfo";
import { PageTree } from "./PageTree";
interface PageSelectorProps {}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    ...h4Heading,
    display: "flex",
    color: gray400,
    alignItems: "center",
    alignSelf: "center",
    paddingLeft: "1rem",
    borderRight: `1px solid ${gray800}`,
    height: "100%",
  },
  span: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  p: {
    color: gray300,
    display: "inline-block",
    margin: "0 0.3rem",
    width: "8ch",
    maxWidth: "8ch",
    overflow: "hidden",
  },
};

export const PageSelector: React.FC<PageSelectorProps> = () => {
  const [showPageEditor, setShowPageEditor] = useState<boolean>(false);
  const closePageEditor = useCallback(() => {
    setShowPageEditor(false);
  }, []);

  const { pagesInfo, selectedPageRouteObjectPath } = useGetPageInfo();

  return (
    <div
      style={styles.page}
      onClick={() => {
        setShowPageEditor(true);
      }}
      data-tooltip="Page Manager"
      className="tool-tip"
    >
      <div>Page:</div>
      <div style={styles.p}>{selectedPageRouteObjectPath}</div>
      <span style={styles.span}>
        <ArrowDown />
      </span>
      {showPageEditor && pagesInfo ? (
        <Container name="Drop" onClose={closePageEditor}>
          <div
            style={{
              backgroundColor: gray700,
              height: "100%",
              paddingRight: "1em",
            }}
          >
            <PageTree
              onCloseClicked={() => {
                setShowPageEditor(false);
              }}
              pagesInfo={pagesInfo}
              selectedPageRouteObjectPath={selectedPageRouteObjectPath}
            />
          </div>
        </Container>
      ) : null}
    </div>
  );
};
