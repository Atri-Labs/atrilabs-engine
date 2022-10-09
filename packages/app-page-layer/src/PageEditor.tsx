import {
  gray200,
  gray300,
  gray500,
  gray700,
  h1Heading,
  smallText,
} from "@atrilabs/design-system";
import { PageDetails } from "@atrilabs/forest";
import React, { useCallback, useState } from "react";
import { CreateFolder } from "./components/CreateFolder";
import { CreatePage } from "./components/CreatePage";
import { PageTable } from "./components/PageTable";
import { Cross } from "./icons/Cross";
import { Folder } from "./icons/Folder";
import { Maginfier } from "./icons/Magnifier";
import { PageIcon } from "./icons/PageIcon";
import formStyle from "./stylesheets/formfield.module.css";
import { PageTableData } from "./types";

const styles: { [key: string]: React.CSSProperties } = {
  // ============pageCont================
  pageCont: {
    width: "15rem",
    height: `100%`,
    // position is set to relative to display dialog box next to it
    position: "relative",
    boxSizing: "border-box",
  },
  pageContMain: {
    backgroundColor: gray700,
    height: "100%",
    boxSizing: "border-box",
    overflow: "auto",
  },
  pageContHeader: {
    padding: `0.5rem 1rem`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `space-between`,
  },
  pageContHeaderH4: {
    ...h1Heading,
    color: gray300,
    margin: 0,
  },
  searchBox: {
    ...smallText,
    width: "100%",
    border: "none",
    backgroundColor: "transparent",
    color: gray200,
    outline: "none",
  },
  // =============icons====================
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
  // ==============.search-container===================
  searchContainer: {
    backgroundColor: gray500,
    margin: "0.8rem 1rem",
    padding: "0.2rem 0.5rem",
    display: "flex",
    borderRadius: "2px",
  },
  // ================create folder dialog box===
  createFolder: {
    position: "absolute",
    padding: `0.5rem 1rem`,
    left: "100%",
    top: 0,
    width: "15rem",
    background: gray700,
  },
};

export type PageEditorProps = {
  close: () => void;
  pageTableData: PageTableData;
  loadData: () => void;
  changePageCb: (pageId: string) => void;
  selectedPage: PageDetails;
};

export const PageEditor: React.FC<PageEditorProps> = (props) => {
  const closeContainer = useCallback(() => {
    props.close();
  }, [props]);
  const [sideDialog, setSideDialog] = useState<{
    comp: React.FC<any>;
    props: any;
  } | null>(null);
  const closeSubContainer = useCallback(() => {
    setSideDialog(null);
    props.loadData();
  }, [setSideDialog, props]);
  const openCreateFolder = useCallback(() => {
    setSideDialog({
      comp: CreateFolder,
      props: { close: closeSubContainer, data: props.pageTableData },
    });
  }, [setSideDialog, closeSubContainer, props]);
  const openCreatePage = useCallback(() => {
    setSideDialog({
      comp: CreatePage,
      props: { close: closeSubContainer, data: props.pageTableData },
    });
  }, [setSideDialog, closeSubContainer, props]);
  return (
    <div style={styles.pageCont}>
      <div style={styles.pageContMain}>
        <header style={styles.pageContHeader}>
          <h4 style={styles.pageContHeaderH4}>Pages</h4>
          <div style={styles.icons}>
            <span style={styles.iconsSpan} onClick={openCreateFolder}>
              <Folder />
            </span>
            <span style={styles.iconsSpan} onClick={openCreatePage}>
              <PageIcon />
            </span>
            <span style={styles.iconsSpan} onClick={closeContainer}>
              <Cross />
            </span>
          </div>
        </header>
        <div style={styles.searchContainer}>
          <div
            style={{
              border: `1px solid transparent`,
            }}
          >
            <Maginfier />
          </div>
          <input
            type="text"
            className={formStyle["forminput"]}
            style={styles.searchBox}
            placeholder="Search Pages"
          />
        </div>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {props.pageTableData.map((_data, index) => {
            return (
              <PageTable
                setSideDialog={setSideDialog}
                closeSubContainer={closeSubContainer}
                data={props.pageTableData}
                key={index}
                index={index}
                changePageCb={props.changePageCb}
              />
            );
          })}
        </section>
      </div>

      {sideDialog ? <sideDialog.comp {...sideDialog.props} /> : null}
    </div>
  );
};
