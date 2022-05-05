import {
  agastyaLine,
  gray200,
  gray300,
  gray500,
  gray700,
  gray900,
  h1Heading,
  h4Heading,
  smallText,
} from "@atrilabs/design-system";
import React, { useCallback, useEffect, useState } from "react";
import { ConfirmDelete } from "./components/ConfirmDelete";
import { CreateFolder } from "./components/CreateFolder";
import { CreatePage } from "./components/CreatePage";
import { UpdateFolder } from "./components/UpdateFolder";
import { UpdatePage } from "./components/UpdatePage";
import { Cross } from "./icons/Cross";
import { DownArrow } from "./icons/DownArrow";
import { Folder } from "./icons/Folder";
import { Maginfier } from "./icons/Magnifier";
import { PageIcon } from "./icons/PageIcon";
import { Setting } from "./icons/Setting";
import { overlayContainer } from "./required";

const styles: { [key: string]: React.CSSProperties } = {
  // ============pageCont================
  pageCont: {
    width: "15rem",
    height: `100%`,
    backgroundColor: gray700,
    // position is set to relative to display dialog box next to it
    position: "relative",
    boxSizing: "border-box",
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
    color: gray300,
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
  // ==================folder======================
  folder: {
    width: "100%",
  },
  folderHeader: {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: gray900,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    boxSizing: "border-box",
  },
  folderArrowSpan: {
    display: "flex",
    marginRight: "0.5rem",
    cursor: "pointer",
  },
  folderNameDiv: {
    ...h4Heading,
    color: gray300,
    margin: 0,
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  // ================page===============
  page: {
    display: "flex",
    padding: "0.5rem 1rem",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${agastyaLine}`,
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

export const PageEditor = () => {
  const [showPages, setShowPages] = useState<boolean>(true);
  const [SideDialog, setSideDialog] = useState<React.FC<any> | null>(null);
  const openCreateFolder = useCallback(() => {
    setSideDialog(CreateFolder);
  }, []);
  const openCreatePage = useCallback(() => {
    setSideDialog(CreatePage);
  }, []);
  const openUpdateFolder = useCallback(() => {
    setSideDialog(UpdateFolder);
  }, []);
  const openUpdatePage = useCallback(() => {
    setSideDialog(UpdatePage);
  }, []);
  useEffect(() => {
    overlayContainer.register({ comp: ConfirmDelete, props: {} });
  }, []);
  return (
    <div style={styles.pageCont}>
      <header style={styles.pageContHeader}>
        <h4 style={styles.pageContHeaderH4}>Pages</h4>
        <div style={styles.icons}>
          <span style={styles.iconsSpan} onClick={openCreateFolder}>
            <Folder />
          </span>
          <span style={styles.iconsSpan} onClick={openCreatePage}>
            <PageIcon />
          </span>
          <span style={styles.iconsSpan}>
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
          className="search-box"
          style={styles.searchBox}
          placeholder="Search Pages"
        />
      </div>
      <section
        style={{
          display: "flex",
        }}
      >
        <main style={styles.folder}>
          <header style={styles.folderHeader}>
            <span
              style={styles.folderArrowSpan}
              onClick={() => setShowPages((prev) => !prev)}
            >
              <DownArrow />
            </span>
            <div style={styles.folderNameDiv}>
              Folder-1
              <span onClick={openUpdateFolder}>
                <Setting />
              </span>
            </div>
          </header>
          {showPages && (
            <div>
              <main style={styles.page}>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      marginRight: `0.5rem`,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <PageIcon />
                  </span>
                  <p
                    style={{
                      ...smallText,
                      color: gray200,
                      margin: 0,
                    }}
                  >
                    Page Name
                  </p>
                </div>
                <div>
                  <span onClick={openUpdatePage}>
                    <Setting />
                  </span>
                </div>
              </main>
            </div>
          )}
        </main>
      </section>
      {SideDialog ? <SideDialog /> : null}
    </div>
  );
};
