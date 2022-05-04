import {
  agastyaLine,
  amber300,
  gray200,
  gray300,
  gray500,
  gray700,
  gray800,
  gray900,
  h1Heading,
  h4Heading,
  smallText,
} from "@atrilabs/design-system";
import { useState } from "react";
import { Cross } from "./icons/Cross";
import { DownArrow } from "./icons/DownArrow";
import { Folder } from "./icons/Folder";
import { LinkIcon } from "./icons/LinkIcon";
import { Maginfier } from "./icons/Magnifier";
import { PageIcon } from "./icons/PageIcon";
import { Setting } from "./icons/Setting";
import styleModule from "./styles.module.css";
import { ReactComponent as Park } from "./park.svg";

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
  folderHeaderSpan: {
    display: "flex",
    marginRight: "0.5rem",
    cursor: "pointer",
  },
  folderHeaderP: {
    ...h4Heading,
    color: gray300,
    margin: 0,
  },
  // ================page===============
  page: {
    display: "flex",
    padding: "0.5rem 1rem",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${agastyaLine}`,
  },
  // ================create page dialog box=====
  createPage: {
    position: "absolute",
    left: "100%",
    top: 0,
    width: "15rem",
    background: gray700,
    borderLeft: `1px solid ${gray800}`,
    display: "flex",
    flexDirection: "column",
  },
  createPageHeader: {
    display: "flex",
    padding: `0.5rem 1rem`,
    justifyContent: "space-between",
    borderBottom: `1px solid ${gray800}`,
    paddingBottom: "0.5rem",
  },
  createPageFormField: {
    display: "flex",
    justifyContent: "space-between",
    ...smallText,
    color: gray300,
    alignItems: "center",
    padding: `1rem 1rem 0 1rem`,
  },
  slugContainer: {
    padding: `1rem 1rem 0 1rem`,
  },
  slugContent: {
    display: "flex",
    background: gray500,
    alignItems: "center",
    ...smallText,
    color: gray300,
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

export const PageEditor = () => {
  const [showPages, setShowPages] = useState<boolean>(true);
  return (
    <div style={styles.pageCont}>
      <header style={styles.pageContHeader}>
        <h4 style={styles.pageContHeaderH4}>Pages</h4>
        <div style={styles.icons}>
          <span style={styles.iconsSpan}>
            <Folder />
          </span>
          <span style={styles.iconsSpan}>
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
              style={styles.folderHeaderSpan}
              onClick={() => setShowPages((prev) => !prev)}
            >
              <DownArrow />
            </span>
            <p style={styles.folderHeaderP}>Folder-1</p>
          </header>
          {showPages && (
            <div>
              <main style={styles.page} className="__page">
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
                <div className="__end">
                  <span className="__hoverIcon">
                    <Setting />
                  </span>
                </div>
              </main>
            </div>
          )}
        </main>
      </section>

      <div style={styles.createPage}>
        <div style={styles.createPageHeader}>
          <h4 style={styles.pageContHeaderH4}>Create new page</h4>
          <span style={styles.iconsSpan}>
            <Cross />
          </span>
        </div>
        <div style={styles.createPageFormField}>
          <span>Folder</span>
          <select
            style={{
              width: "10rem",
              height: "1.4rem",
              background: `${gray800}`,
              color: gray300,
              borderRadius: "4px",
              padding: "0.2rem",
            }}
            className={styleModule["form-field"]}
          >
            <option>Folder 1</option>
            <option>Folder 2</option>
          </select>
        </div>
        <div style={styles.createPageFormField}>
          <span>Page</span>
          <input
            style={{
              width: "10rem",
              boxSizing: "border-box",
              height: "1.4rem",
              background: `${gray800}`,
              color: gray300,
              borderRadius: "4px",
              padding: "0.2rem",
            }}
            className={styleModule["form-field"]}
          />
        </div>
        <div style={styles.slugContainer}>
          <div style={styles.slugContent}>
            <div
              style={{
                padding: "0.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LinkIcon />
            </div>
            <div>/folder1/page1</div>
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
        >
          <button
            style={{
              borderRadius: "4px",
              backgroundColor: amber300,
              color: gray900,
              border: "none",
              padding: "0.2rem 0.6rem 0.2rem 0.6rem",
            }}
          >
            Create
          </button>
          <Park />
        </div>
      </div>

      {/* <div style={styles.createFolder}></div> */}
    </div>
  );
};
