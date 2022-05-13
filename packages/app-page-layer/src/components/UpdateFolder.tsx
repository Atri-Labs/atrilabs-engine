import React, { useCallback, useEffect, useState } from "react";
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
import { overlayContainer } from "../required";
import { ConfirmDelete } from "./ConfirmDelete";
import { PageTableData } from "../types";
import { useSocketApi } from "../hooks/useUpdateFolder";

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
  data: PageTableData["0"]["folder"];
};

export const UpdateFolder: React.FC<UpdateFolderProps> = React.memo((props) => {
  const openConfirmDelete = useCallback(() => {
    overlayContainer.register({ comp: ConfirmDelete, props: {} });
  }, []);
  const [foldername, setFoldername] = useState<string>(props.data.name);
  useEffect(() => {
    setFoldername(props.data.name);
  }, [props]);
  const onChange = useCallback(
    (value: string) => {
      setFoldername(value);
    },
    [setFoldername]
  );
  const updateFolder = useSocketApi();
  const onUpdateClick = useCallback(() => {
    updateFolder(
      props.data.id,
      { name: foldername },
      () => {},
      () => {}
    );
    props.close();
  }, [props, foldername, updateFolder]);
  return (
    <div style={styles.createPage}>
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
        <Input initialValue={foldername} onChange={onChange} />
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
          <div>{`/${foldername.replace("/", "")}`}</div>
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
