import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  amber300,
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
import { ConfirmDelete } from "./ConfirmDelete";
import { PageTableData } from "../types";
import { useSocketApi } from "../hooks/useUpdateFolder";
import { useSocketApi as useDeleteFolderApi } from "../hooks/useDeleteFolder";
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

export type UpdateFolderProps = {
  close: () => void;
  data: PageTableData;
  folderIndex: number;
};

export const UpdateFolder: React.FC<UpdateFolderProps> = React.memo((props) => {
  const deleteFolder = useDeleteFolderApi();
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const onCancel = useCallback(() => {
    setShowDeleteDialog(false);
    props.close();
  }, [props]);
  const onDelete = useCallback(() => {
    deleteFolder(
      props.data[props.folderIndex].folder.id,
      () => {},
      () => {}
    );
    setShowDeleteDialog(false);
    props.close();
  }, [props, deleteFolder]);
  const openConfirmDelete = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  // Internal State for UI pattern
  const [foldername, setFoldername] = useState<string | null>(null);
  useEffect(() => {
    setFoldername(props.data[props.folderIndex].folder.name);
  }, [props]);

  const isDuplicateFoldername = useMemo(() => {
    if (foldername) {
      const allFoldernames = props.data.map((folder) => {
        return folder.folder.name;
      });
      if (
        allFoldernames.includes(foldername) &&
        foldername !== props.data[props.folderIndex].folder.name
      ) {
        return true;
      }
    }
    return false;
  }, [props.data, foldername, props.folderIndex]);

  const onChange = useCallback(
    (value: string) => {
      setFoldername(value);
    },
    [setFoldername]
  );

  const updateFolder = useSocketApi();
  const onUpdateClick = useCallback(() => {
    if (
      isDuplicateFoldername ||
      foldername === null ||
      foldername?.trim() === ""
    ) {
      return;
    }
    updateFolder(
      props.data[props.folderIndex].folder.id,
      { name: foldername },
      () => {},
      () => {}
    );
    props.close();
  }, [props, foldername, updateFolder, isDuplicateFoldername]);
  return (
    <div style={styles.createPage}>
      {showDeleteDialog ? (
        <Container name="OverlayContainer" onClose={onCancel}>
          <ConfirmDelete
            onCancel={onCancel}
            onDelete={onDelete}
            onCross={onCancel}
          />
        </Container>
      ) : null}
      <div style={styles.createPageHeader}>
        <h4 style={styles.pageContHeaderH4}>Folder settings</h4>
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
        {foldername !== null ? (
          <Input value={foldername} onChange={onChange} />
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
          {foldername ? <div>{`/${foldername.replace("/", "")}`}</div> : null}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          padding: "1rem",
          ...smallText,
          color: gray300,
        }}
      >
        {isDuplicateFoldername
          ? `A folder with name "${foldername}" already exists`
          : null}
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
