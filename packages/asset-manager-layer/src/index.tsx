import { Menu, Container } from "@atrilabs/core";
import { gray700, gray800 } from "@atrilabs/design-system";
import { useCallback, useState } from "react";
import {
  UploadContainer,
  UploadContainerProps,
} from "./components/upload-container/UploadContainer";
import { ReactComponent as AssetIcon } from "./assets/asset-icon.svg";
import "./styles.css";
const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderRight: `1px solid ${gray800}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2.5rem",
  },
  assetIcon: {
    width: "34.5%",
    cursor: "pointer",
  },
  container: {
    display: "grid",
    padding: "0 1rem",
    gridTemplateColumns: "auto auto",
    columnGap: "15px",
  },
};

const modes: UploadContainerProps["modes"] = ["upload_multiple", "draggable"];

export default function () {
  const [showAssetPanel, setShowAssetPanel] = useState(false);

  const showAssetPanelCb = useCallback(() => {
    setShowAssetPanel(true);
  }, []);

  const onCrossClicked = useCallback(() => {
    setShowAssetPanel(false);
  }, []);

  return (
    <>
      <Menu name="PageMenu" order={2}>
        <div
          style={styles.iconContainer}
          onClick={showAssetPanelCb}
          data-tooltip="Asset Manager"
          className="tool-tip"
        >
          <AssetIcon style={styles.assetIcon} />
        </div>
      </Menu>
      {showAssetPanel ? (
        <Container name="Drop" onClose={onCrossClicked}>
          <div
            style={{
              width: "15rem",
              height: `100%`,
              backgroundColor: gray700,
              boxSizing: "border-box",
              userSelect: "none",
              overflow: "auto",
            }}
          >
            <UploadContainer modes={modes} onCrossClicked={onCrossClicked} />
          </div>
        </Container>
      ) : null}
    </>
  );
}
