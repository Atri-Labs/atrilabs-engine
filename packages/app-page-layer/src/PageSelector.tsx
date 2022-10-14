import { Container } from "@atrilabs/core";
import { gray300, gray400, gray800, h4Heading } from "@atrilabs/design-system";
import React, { useCallback, useState } from "react";
import { useGetPageTableData } from "./hooks/useGetPageTableData";
import { ArrowDown } from "./icons/ArrowDown";
import { PageEditor } from "./PageEditor";
import "./stylesheets/formfield.module.css";
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

  const { selectedPage, pageTableData, loadData, changePageCb } =
    useGetPageTableData();

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
      <div style={styles.p}>{selectedPage ? selectedPage.name : null}</div>
      <span style={styles.span}>
        <ArrowDown />
      </span>
      {showPageEditor && selectedPage ? (
        <Container name="Drop" onClose={closePageEditor}>
          <PageEditor
            close={closePageEditor}
            pageTableData={pageTableData}
            loadData={loadData}
            selectedPage={selectedPage}
            changePageCb={changePageCb}
          />
        </Container>
      ) : null}
    </div>
  );
};
