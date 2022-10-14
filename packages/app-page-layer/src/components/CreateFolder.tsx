import React, { useCallback, useMemo, useState } from "react";
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
import { useSocketApi } from "../hooks/useCreateFolder";
import { PageTableData } from "../types";

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

export type CreateFolderProps = {
  close: () => void;
  data: PageTableData;
};

export const CreateFolder: React.FC<CreateFolderProps> = React.memo((props) => {
  const createFolder = useSocketApi();
  const [foldername, setFoldername] = useState<string>("");
  const onFolderNameChange = useCallback(
    (value: string) => {
      setFoldername(value);
    },
    [setFoldername]
  );
  const isDuplicateFoldername = useMemo(() => {
    if (foldername) {
      const allFoldernames = props.data.map((folder) => {
        return folder.folder.name;
      });
      if (
        allFoldernames.includes(foldername) ||
        foldername === "root" ||
        foldername === "/"
      ) {
        return true;
      }
    }
    return false;
  }, [props.data, foldername]);
  const onCreateClick = useCallback(() => {
    if (isDuplicateFoldername || foldername.trim() === "") {
      return;
    }
    createFolder(
      foldername,
      () => {},
      () => {}
    );
    props.close();
  }, [createFolder, foldername, props, isDuplicateFoldername]);
  return (
    <div style={styles.createPage}>
      <div style={styles.createPageHeader}>
        <h4 style={styles.pageContHeaderH4}>Create new folder</h4>
        <span style={styles.iconsSpan} onClick={props.close}>
          <Cross />
        </span>
      </div>
      <div style={styles.createPageFormField}>
        <span>Folder</span>
        <Input onChange={onFolderNameChange} value={foldername} />
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
          <div>{`/${foldername}`}</div>
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
          onClick={onCreateClick}
        >
          Create
        </button>
      </div>
    </div>
  );
});
