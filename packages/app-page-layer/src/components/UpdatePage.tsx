import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  amber300,
  Dropdown,
  gray300,
  gray500,
  gray700,
  gray800,
  gray900,
  h1Heading,
  h4Heading,
  Input,
  smallText,
} from "@atrilabs/design-system";
import { LinkIcon } from "../icons/LinkIcon";
import { Cross } from "../icons/Cross";
import { ReactComponent as Trash } from "../icons/trash.svg";
import { PageTableData } from "../types";
import { useSocketApi } from "../hooks/useUpdatePage";
import { useSocketApi as useDeletePageApi } from "../hooks/useDeletePage";
import { ConfirmDelete } from "./ConfirmDelete";
import { Container } from "@atrilabs/core";

const styles: { [key: string]: React.CSSProperties } = {
  createPage: {
    position: "absolute",
    left: "100%",
    top: 0,
    width: "15rem",
    background: gray700,
    borderLeft: `1px solid ${gray800}`,
    display: "flex",
    flexDirection: "column",
    zIndex: 1,
  },
  createPageHeader: {
    display: "flex",
    padding: `0.5rem 1rem`,
    justifyContent: "space-between",
    borderBottom: `1px solid ${gray800}`,
    paddingBottom: "0.5rem",
  },
  pageContHeaderH4: {
    ...h1Heading,
    color: gray300,
    margin: 0,
  },
  iconsSpan: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    width: "1.3rem",
    height: "100% !important",
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
};

export type UpdatePageProps = {
  close: () => void;
  data: PageTableData;
  folderIndex: number;
  pageIndex: number;
};

export const UpdatePage: React.FC<UpdatePageProps> = React.memo((props) => {
  const deletePage = useDeletePageApi();
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const onCancel = useCallback(() => {
    setShowDeleteDialog(false);
    props.close();
  }, [props]);
  const onDelete = useCallback(() => {
    deletePage(
      props.data[props.folderIndex].pages[props.pageIndex].id,
      () => {},
      () => {}
    );
    setShowDeleteDialog(false);
    props.close();
  }, [props, deletePage]);
  const openConfirmDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  // Props and useMeme
  const folders = useMemo<string[]>(() => {
    return props.data.map((d) => {
      return d.folder.name;
    });
  }, [props]);

  // Internal State for UI pattern
  const [selectedFolder, setSelectedFolder] = useState<{
    folder: PageTableData["0"]["folder"];
    index: number;
  } | null>(null);
  useEffect(() => {
    setSelectedFolder({
      folder: props.data[props.folderIndex].folder,
      index: props.folderIndex,
    });
  }, [props]);

  const onSelect = useCallback(
    (_option: string, index: number) => {
      setSelectedFolder({ folder: props.data[index].folder, index });
    },
    [props]
  );

  // Internal State for UI pattern
  const [pageName, setPageName] = useState<string | null>(null);
  useEffect(() => {
    setPageName(props.data[props.folderIndex].pages[props.pageIndex].name);
  }, [props]);

  const onPageNameChange = useCallback((value: string) => {
    setPageName(value);
  }, []);

  const updatePage = useSocketApi();
  const onUpdateClick = useCallback(() => {
    if (selectedFolder && pageName)
      updatePage(
        props.data[props.folderIndex].pages[props.pageIndex].id,
        { folderId: selectedFolder.folder.id, name: pageName },
        () => {},
        () => {}
      );
    props.close();
  }, [props, selectedFolder, pageName, updatePage]);

  return (
    <div style={styles.createPage}>
      {showDeleteDialog ? (
        <Container name="OverlayContainer">
          <ConfirmDelete
            onCancel={onCancel}
            onDelete={onDelete}
            onCross={onCancel}
          />
        </Container>
      ) : null}
      <div style={styles.createPageHeader}>
        <h4 style={styles.pageContHeaderH4}>Page settings</h4>
        <div style={{ display: "flex" }}>
          <span style={styles.iconsSpan} onClick={openConfirmDelete}>
            <Trash />
          </span>
          <span style={styles.iconsSpan} onClick={props.close}>
            <Cross />
          </span>
        </div>
      </div>
      <div style={styles.createPageFormField}>
        <span>Folder</span>
        {selectedFolder ? (
          <Dropdown
            options={folders}
            onSelect={onSelect}
            selectedIndex={selectedFolder.index}
          />
        ) : null}
      </div>
      <div style={styles.createPageFormField}>
        <span>Page</span>
        {pageName ? (
          <Input onChange={onPageNameChange} value={pageName} />
        ) : null}
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
          <div>
            {selectedFolder
              ? (
                  `/${selectedFolder.folder.name.replace("/", "")}` +
                  (pageName ? `/${pageName}` : "")
                ).replace("//", "/")
              : `/`}
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
      >
        <button
          style={{
            borderRadius: "4px",
            backgroundColor: amber300,
            ...h4Heading,
            color: gray900,
            border: "none",
            padding: "0.2rem 0.6rem 0.2rem 0.6rem",
          }}
          onClick={onUpdateClick}
        >
          Update
        </button>
      </div>
    </div>
  );
});
