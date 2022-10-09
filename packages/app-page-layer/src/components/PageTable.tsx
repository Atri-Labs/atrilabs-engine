import {
  agastyaLine,
  gray200,
  gray300,
  gray900,
  h4Heading,
  smallText,
} from "@atrilabs/design-system";
import React, { useCallback, useState } from "react";
import { PageTableData } from "../types";
import { DownArrow } from "../icons/DownArrow";
import { PageIcon } from "../icons/PageIcon";
import { Setting } from "../icons/Setting";
import { UpdateFolder } from "./UpdateFolder";
import { UpdatePage } from "./UpdatePage";

const styles: { [key: string]: React.CSSProperties } = {
  folder: {
    width: "100%",
    zIndex: 1,
  },
  folderHeader: {
    width: "100%",
    padding: "0 1rem",
    height: "2rem",
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
    alignItems: "center",
  },
  page: {
    display: "flex",
    padding: "0 1rem",
    height: "2rem",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${agastyaLine}`,
  },
};

export type PageTableProps = {
  setSideDialog: React.Dispatch<
    React.SetStateAction<{
      comp: React.FC<any>;
      props: any;
    } | null>
  >;
  closeSubContainer: () => void;
  data: PageTableData;
  index: number;
  changePageCb: (pageId: string) => void;
};

export const PageTable: React.FC<PageTableProps> = React.memo((props) => {
  const [showPages, setShowPages] = useState<boolean>(true);
  const openUpdateFolder = useCallback(() => {
    props.setSideDialog({
      comp: UpdateFolder,
      props: {
        close: props.closeSubContainer,
        data: props.data,
        folderIndex: props.index,
      },
    });
  }, [props]);
  const openUpdatePage = useCallback(
    (pageIndex: number) => {
      props.setSideDialog({
        comp: UpdatePage,
        props: {
          close: props.closeSubContainer,
          data: props.data,
          folderIndex: props.index,
          pageIndex: pageIndex,
        },
      });
    },
    [props]
  );

  return (
    <div style={styles.folder}>
      {/**Show folder name only if it's not root */}
      {props.data[props.index].folder.id !== "root" ? (
        <header style={styles.folderHeader}>
          <span
            style={styles.folderArrowSpan}
            onClick={() => setShowPages((prev) => !prev)}
          >
            <DownArrow />
          </span>
          <div style={styles.folderNameDiv}>
            <p>{props.data[props.index].folder.name}</p>
            <div onClick={openUpdateFolder}>
              <span>
                <Setting />
              </span>
            </div>
          </div>
        </header>
      ) : null}

      {showPages
        ? props.data[props.index].pages.map((page, index) => {
            return (
              <div key={index}>
                <main style={styles.page}>
                  <div
                    style={{
                      display: "flex",
                      flexGrow: 1,
                      height: "100%",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      props.changePageCb(page.id);
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
                      {page.name}
                    </p>
                  </div>
                  <div>
                    <span
                      onClick={() => {
                        openUpdatePage(index);
                      }}
                    >
                      <Setting />
                    </span>
                  </div>
                </main>
              </div>
            );
          })
        : null}
    </div>
  );
});
