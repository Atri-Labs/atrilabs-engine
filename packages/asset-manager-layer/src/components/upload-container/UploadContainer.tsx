import { api } from "@atrilabs/core";
import {
  amber300,
  gray300,
  gray700,
  gray900,
  h1Heading,
  h4Heading,
} from "@atrilabs/design-system";
import React, { useCallback, useRef, useState } from "react";
import InputAudio from "../InputAudio";
import InputImage from "../InputImage";
import InputVideo from "../InputVideo";
import { Cross } from "../../assets/Cross";
import { useGetAssetsInfo } from "./hooks/useGetAssetList";

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
    minHeight: "100%",
    userSelect: "none",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  dropContainerItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
  },
  dropContainerItemHeaderH4: {
    ...h1Heading,
    color: gray300,
    margin: "0px",
  },
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
  },
  uploadBox: {
    display: "none",
  },
  selectMediaTypeBtn: {
    ...h4Heading,
    border: "none",
    outline: "none",
    background: amber300,
    borderRadius: "4px",
    color: gray900,
    padding: "6px 0",
    textAlign: "center",
    width: "13rem",
    margin: "11px 0",
  },
  selectMediaTypeDiv: {
    background: gray900,
    width: "100%",
    marginBottom: "11px",
  },
  selectMediaTypeSelect: {
    background: gray900,
    color: gray300,
    margin: "0 1rem",
    border: "none",
    outline: "none",
    padding: "0.5rem 0",
    width: "35%",
  },
  dropDownItems: {
    outline: "none",
  },
  container: {
    display: "grid",
    padding: "0 1rem",
    gridTemplateColumns: "auto auto",
    columnGap: "15px",
  },
};

export const UploadContainer: React.FC<UploadContainerProps> = (props) => {
  const [mediaType, setMediaType] = useState("images");
  const { assetsInfo, getAssetsInfo } = useGetAssetsInfo();

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
                getAssetsInfo();
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
                getAssetsInfo();
                if (props.onUploadSuccess) {
                  props.onUploadSuccess(urls[0]);
                }
              }
            });
          }
        }
      },
      [props, getAssetsInfo]
    );

  const refEle = useRef<HTMLInputElement>(null);

  const handleInputClick = useCallback(() => {
    refEle.current?.click();
  }, []);

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMediaType(e.target.value);
    },
    []
  );

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          ref={refEle}
          accept="image/*,audio/*,video/*"
          type={"file"}
          style={styles.uploadBox}
          multiple={props.modes && props.modes.includes("upload_multiple")}
          onChange={onFileBrowsedCb}
        />
        <button style={styles.selectMediaTypeBtn} onClick={handleInputClick}>
          Upload Media
        </button>

        <div style={styles.selectMediaTypeDiv}>
          <select
            style={styles.selectMediaTypeSelect}
            onChange={(e) => {
              handleTypeChange(e);
            }}
            value={mediaType}
          >
            <option value="images" style={styles.dropDownItems}>
              Images
            </option>
            <option value="audio" style={styles.dropDownItems}>
              Audio
            </option>
            <option value="video" style={styles.dropDownItems}>
              Video
            </option>
          </select>
        </div>
        <div style={{ width: "100%" }}>
          {mediaType === "images" ? (
            <div style={styles.container}>
              {assetsInfo["images"].map((i) => (
                <InputImage key={i.name} url={i.url} imageText={i.name} />
              ))}
            </div>
          ) : mediaType === "audio" ? (
            assetsInfo["audio"].map((i) => (
              <InputAudio key={i.name} url={i.url} audioText={i.name} />
            ))
          ) : (
            assetsInfo["video"].map((i) => (
              <InputVideo key={i.name} url={i.url} videoText={i.name} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
