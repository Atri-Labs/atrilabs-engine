import { Menu, Container } from "@atrilabs/core";
import { gray800 } from "@atrilabs/design-system";
import { useCallback, useState } from "react";
import {
  UploadContainer,
  UploadContainerProps,
} from "./components/upload-container/UploadContainer";
import { ReactComponent as AI } from "./assets/asset-icon.svg";

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
      <Menu name="AppMenu">
        <div style={styles.iconContainer} onClick={showAssetPanelCb}>
          <AI style={styles.assetIcon} />
        </div>
      </Menu>
      {showAssetPanel ? (
        <Container name="Drop">
          <UploadContainer modes={modes} onCrossClicked={onCrossClicked} />
        </Container>
      ) : null}
    </>
  );
}
