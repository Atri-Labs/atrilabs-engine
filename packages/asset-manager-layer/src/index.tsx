import { Menu, Container } from "@atrilabs/core";
import { gray800 } from "@atrilabs/design-system";
import { useCallback, useState } from "react";
import {
  UploadContainer,
  UploadContainerProps,
} from "./components/upload-container/UploadContainer";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderRight: `1px solid ${gray800}`,
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
          Asset Manager
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
