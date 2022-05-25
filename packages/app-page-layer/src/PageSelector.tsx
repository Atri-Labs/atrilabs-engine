import { Container, currentForest, setCurrentForest } from "@atrilabs/core";
import { gray300, gray400, gray800, h4Heading } from "@atrilabs/design-system";
import { PagesDbSchema } from "@atrilabs/forest/lib/implementations/lowdb/types";
import { getMeta, getPages } from "@atrilabs/server-client/lib/websocket";
import React, { useCallback, useEffect, useState } from "react";
import { ArrowDown } from "./icons/ArrowDown";
import { PageEditor } from "./PageEditor";
import { PageTableData } from "./types";

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

  // get details on currently selected page
  const [selectedPage, setSelectedPage] = useState<PagesDbSchema["0"] | null>(
    null
  );
  useEffect(() => {
    function pageDetailSetter() {
      if (currentForest) {
        getPages(currentForest.forestPkgId, (data) => {
          const pageDetails = data[currentForest.forestId];
          if (pageDetails) {
            setSelectedPage(pageDetails);
          }
        });
      }
    }
    // set page details if current forest is already set
    pageDetailSetter();
    // subscribe to change page details when currentForest changes
    const unsub = currentForest.on("reset", () => {
      pageDetailSetter();
    });
    return unsub;
  }, []);

  // a callback to set current forest
  const changePageCb = useCallback((pageId: string) => {
    setCurrentForest(currentForest.forestPkgId, pageId);
  }, []);
  return { pageTableData: data, loadData, changePageCb, selectedPage };
};

export const PageSelector: React.FC<PageSelectorProps> = () => {
  const [showPageEditor, setShowPageEditor] = useState<boolean>(false);
  const closePageEditor = useCallback(() => {
    setShowPageEditor(false);
  }, []);

  const { selectedPage, pageTableData, loadData, changePageCb } =
    useSocketApi();

  return (
    <div
      style={styles.page}
      onClick={() => {
        setShowPageEditor(true);
      }}
    >
      <div>Page:</div>
      <div style={styles.p}>{selectedPage ? selectedPage.name : null}</div>
      <span style={styles.span}>
        <ArrowDown />
      </span>
      {showPageEditor ? (
        <Container name="Drop">
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
