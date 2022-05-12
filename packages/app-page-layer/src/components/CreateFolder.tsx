import React, { useCallback, useState } from "react";
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
import { useCreateFolder } from "../hooks/useCreateFolder";

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

export type CreateFolderProps = {
  close: () => void;
};

export const CreateFolder: React.FC<CreateFolderProps> = React.memo((props) => {
  const createFolder = useCreateFolder();
  const [foldername, setFoldername] = useState<string>("");
  const onFolderNameChange = useCallback(
    (value: string) => {
      setFoldername(value);
    },
    [setFoldername]
  );
  const onCreateClick = useCallback(() => {
    createFolder(
      foldername,
      () => {},
      () => {}
    );
    props.close();
  }, [createFolder, foldername, props]);
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
        <Input onChange={onFolderNameChange} initialValue={foldername} />
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
