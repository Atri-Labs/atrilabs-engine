import {
  gray200,
  gray300,
  gray500,
  gray700,
  h1Heading,
  smallText,
} from "@atrilabs/design-system";
import React, { useCallback, useState, useEffect } from "react";
import { currentForest } from "@atrilabs/core";
import { getMeta, getPages } from "@atrilabs/server-client/lib/websocket";
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

type RawFolders = {
  [folderId: string]: { id: string; name: string; parentId: string };
};

type RawPageMap = { [pageId: string]: string };

function reverseMap(raw: RawFolders) {
  const keys = Object.keys(raw);
  const reverseMap: { [parentId: string]: string[] } = {};
  keys.forEach((key) => {
    if (reverseMap[raw[key]!.parentId]) {
      reverseMap[raw[key]!.parentId].push(key);
    } else {
      reverseMap[raw[key]!.parentId] = [key];
    }
  });
  return reverseMap;
}

function reversePageMap(raw: RawPageMap) {
  const keys = Object.keys(raw);
  const reverseMap: { [folderId: string]: string[] } = {};
  keys.forEach((key) => {
    if (reverseMap[raw[key]]) {
      reverseMap[raw[key]].push(key);
    } else {
      reverseMap[raw[key]] = [key];
    }
  });
  return reverseMap;
}

const useSocketApi = () => {
  const [data, setData] = useState<PageTableData>([]);
  const loadData = useCallback(() => {
    getMeta(currentForest.forestPkgId, (meta) => {
      const folders: RawFolders = meta.folders;
      const pageMap: RawPageMap = meta.pages;
      getPages(currentForest.forestPkgId, (pages) => {
        const data: PageTableData = [];
        const pageMapRev = reversePageMap(pageMap);
        // root folder might not have any child folder, hence, []
        const childFolderIds = reverseMap(folders)["root"] || [];
        childFolderIds.forEach((childId) => {
          const pageData =
            pageMapRev[childId]?.map((pageId) => {
              return { ...pages[pageId]!, id: pageId };
            }) || [];
          data.push({ folder: folders[childId]!, pages: pageData });
        });
        // sort folders alphabetically
        data.sort((a, b) => {
          return a.folder.name < b.folder.name ? -1 : 0;
        });
        data.forEach((subdata) => {
          subdata.pages.sort((a, b) => {
            // sort pages alphabetically
            return a.name < b.name ? -1 : 0;
          });
        });
        // handle pages directly inside home
        const rootData: PageTableData["0"] = {
          folder: folders["root"],
          pages: [],
        };
        pageMapRev["root"]!.forEach((pageId) => {
          rootData.pages.push({ ...pages[pageId]!, id: pageId });
        });
        // prepend root folder as it should be displayed at top
        setData([rootData, ...data]);
      });
    });
  }, [setData]);
  useEffect(() => {
    loadData();
  }, [loadData]);
  return { pageTableData: data, loadData };
};

export type PageEditorProps = {
  close: () => void;
};

export const PageEditor: React.FC<PageEditorProps> = (props) => {
  const { pageTableData, loadData } = useSocketApi();
  const closeContainer = useCallback(() => {
    props.close();
  }, [props]);
  const [sideDialog, setSideDialog] = useState<{
    comp: React.FC<any>;
    props: any;
  } | null>(null);
  const closeSubContainer = useCallback(() => {
    setSideDialog(null);
    loadData();
  }, [setSideDialog, loadData]);
  const openCreateFolder = useCallback(() => {
    setSideDialog({ comp: CreateFolder, props: { close: closeSubContainer } });
  }, [setSideDialog, closeSubContainer]);
  const openCreatePage = useCallback(() => {
    setSideDialog({
      comp: CreatePage,
      props: { close: closeSubContainer, data: pageTableData },
    });
  }, [setSideDialog, closeSubContainer, pageTableData]);
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
        {pageTableData.map((_data, index) => {
          return (
            <PageTable
              setSideDialog={setSideDialog}
              closeSubContainer={closeSubContainer}
              data={pageTableData}
              key={index}
              index={index}
            />
          );
        })}
      </section>
      {sideDialog ? <sideDialog.comp {...sideDialog.props} /> : null}
    </div>
  );
};
