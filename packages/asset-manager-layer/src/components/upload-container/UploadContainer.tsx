import { api } from "@atrilabs/core";
import {
  amber300,
  gray300,
  gray700,
  gray900,
  h1Heading,
  h4Heading,
} from "@atrilabs/design-system";
import React, { useCallback } from "react";
import InputImage from "../InputImage";
// import InputAudio from "../InputAudio";
// import InputVideo from "../InputVideo";
import { Cross } from "./assets/Cross";

export type UploadContainerProps = {
  onCrossClicked?: () => void;
  onUploadSuccess?: (url: string) => void;
  onUploadFailed?: () => void;
  onUploadMultipleSuccess?: (urls: string[]) => void;
  onSelect?: (url: string) => void;
  // upload mode for allowing upload of new files
  modes?: ("upload" | "upload_multiple" | "draggable" | "select")[];
};

export const styles: { [key: string]: React.CSSProperties } = {
  dropContainerItem: {
    backgroundColor: gray700,
    border: "1px solid rgba(31, 41, 55, 0.5)",
    width: "15rem",
    height: "100%",
    boxSizing: "border-box",
    userSelect: "none",
    display: "flex",
    flexDirection: "column",
  },
  dropContainerItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 1rem 0 1rem",
  },
  dropContainerItemHeaderH4: {
    ...h1Heading,
    color: gray300,
    marginTop: "0px",
  },
  icons: {},
  iconsSpan: {},
  uploadBox: {
    ...h4Heading,
    background: amber300,
    boxShadow: "0px 4px 4px rgba(55, 65, 81, 0.5)",
    borderRadius: "4px",
    color: gray900,
    padding: "5px 10px",
    textAlign: "center",
    justifyContent: "center",
    width: "11.75rem",
    margin: "0 1rem",
  },
  selectMediaTypeDiv: {
    background: gray900,
    marginTop: "30px",
    marginBottom: "10px",
  },
  selectMediaType: {
    background: gray900,
    color: gray300,
    margin: "0 1rem",
    border: "none",
    outline: "none",
    padding: "0.5rem 0",
    width: "30%",
  },
  container: {
    display: "grid",
    padding: "0 1rem",
    gridTemplateColumns: "auto auto",
    columnGap: "15px",
  },
};

export const UploadContainer: React.FC<UploadContainerProps> = (props) => {
  const onCrossClickCb = useCallback(() => {
    if (props.onCrossClicked) props.onCrossClicked();
  }, [props]);
  const onFileBrowsedCb: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      async (e) => {
        // don't allow upload if upload mode is not set
        if (props.modes && props.modes.includes("upload_multiple")) {
          const files = e.target.files;
          if (files) {
            const assets: {
              name: string;
              data: ArrayBuffer;
              size: number;
              mime: string;
            }[] = [];
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const data = await file.arrayBuffer();
              const name = file.name;
              const size = file.size;
              const mime = file.type;
              assets.push({ name, data, size, mime });
            }
            api.uploadAssets(assets, (success, urls) => {
              if (!success) {
                if (props.onUploadFailed) props.onUploadFailed();
              } else {
                if (props.onUploadMultipleSuccess) {
                  props.onUploadMultipleSuccess(urls);
                }
              }
            });
          }
        }
        if (props.modes && props.modes.includes("upload")) {
          const files = e.target.files;
          if (files && files.length === 1) {
            const assets: {
              name: string;
              data: ArrayBuffer;
              size: number;
              mime: string;
            }[] = [];
            const file = files[0];
            const data = await file.arrayBuffer();
            const name = file.name;
            const size = file.size;
            const mime = file.type;
            assets.push({ name, data, size, mime });
            api.uploadAssets(assets, (success, urls) => {
              if (!success) {
                if (props.onUploadFailed) props.onUploadFailed();
              } else {
                if (props.onUploadSuccess) props.onUploadSuccess(urls[0]);
              }
            });
          }
        }
      },
      [props]
    );

  // const handleChange = useCallback(
  //   (e: React.ChangeEvent<HTMLSelectElement>, n: number) => {
  //     if (e.target.value === "audio") {
  //       for (let i = 0; i < n; i++) {
  //         <InputAudio />;
  //       }
  //     }
  //     else if (e.target.value === "video") {
  //       for (let i = 0; i < n; i++) {
  //         <InputVideo />;
  //       }
  //     }
  //   },
  //   []
  // );

  return (
    <div style={styles.dropContainerItem}>
      <header style={styles.dropContainerItemHeader}>
        <h4 style={styles.dropContainerItemHeaderH4}>Assets</h4>
        <div style={styles.icons}>
          <span style={styles.iconsSpan} onClick={onCrossClickCb}>
            <Cross />
          </span>
        </div>
      </header>
      <div>
        <input
          type={"file"}
          style={styles.uploadBox}
          multiple={props.modes && props.modes.includes("upload_multiple")}
          onChange={onFileBrowsedCb}
        />
        <div style={styles.selectMediaTypeDiv}>
          <select
            style={styles.selectMediaType}
            onChange={(e) => console.log(e)}
          >
            <option value="images">Images</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div style={styles.container}>
          <InputImage id="1" />
          <InputImage id="2" />
          <InputImage id="3" />
          <InputImage id="4" />
        </div>
      </div>
    </div>
  );
};
