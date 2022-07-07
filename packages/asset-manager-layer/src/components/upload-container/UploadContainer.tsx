import { api } from "@atrilabs/core";
import React, { useCallback } from "react";
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

export const styles: { [key: string]: React.CSSProperties } = {};

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
                if (props.onUploadMultipleSuccess)
                  props.onUploadMultipleSuccess(urls);
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
  return (
    <div style={styles.dropContainerItem}>
      <header style={styles.dropContainerItemHeader}>
        <h4 style={styles.dropContainerItemHeaderH4}>Manage Component</h4>
        <div style={styles.icons}>
          <span style={styles.iconsSpan} onClick={onCrossClickCb}>
            <Cross />
          </span>
        </div>
      </header>
      <div>
        <input
          type={"file"}
          multiple={props.modes && props.modes.includes("upload_multiple")}
          onChange={onFileBrowsedCb}
        />
      </div>
    </div>
  );
};
