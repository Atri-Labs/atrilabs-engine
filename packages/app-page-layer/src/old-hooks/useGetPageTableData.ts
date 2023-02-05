import { api, BrowserForestManager } from "@atrilabs/core";
import { PagesDbSchema } from "@atrilabs/forest/lib/implementations/lowdb/types";
import { useCallback, useEffect, useState } from "react";
import { PageTableData } from "../types";

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

export const useGetPageTableData = () => {
  const [data, setData] = useState<PageTableData>([]);
  const loadData = useCallback(() => {
    api.getMeta(BrowserForestManager.currentForest.forestPkgId, (meta) => {
      const folders: RawFolders = meta.folders;
      const pageMap: RawPageMap = meta.pages;
      api.getPages(BrowserForestManager.currentForest.forestPkgId, (pages) => {
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
      if (BrowserForestManager.currentForest) {
        api.getPages(BrowserForestManager.currentForest.forestPkgId, (data) => {
          const pageDetails = data[BrowserForestManager.currentForest.forestId];
          if (pageDetails) {
            setSelectedPage(pageDetails);
          }
        });
      }
    }
    // set page details if current forest is already set
    pageDetailSetter();
    // subscribe to change page details when currentForest changes
    const unsub = BrowserForestManager.currentForest.on("reset", () => {
      pageDetailSetter();
    });
    return unsub;
  }, []);

  // a callback to set current forest
  const changePageCb = useCallback((pageId: string) => {
    BrowserForestManager.setCurrentForest(
      BrowserForestManager.currentForest.forestPkgId,
      pageId
    );
  }, []);
  return { pageTableData: data, loadData, changePageCb, selectedPage };
};
