import { Menu, Container, api } from "@atrilabs/core";
import { gray800 } from "@atrilabs/design-system";
import { useCallback, useState } from "react";
import { Cross } from "./assets/Cross";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderRight: `1px solid ${gray800}`,
  },
};

export default function () {
  const [showAssetPanel, setShowAssetPanel] = useState(false);
  const showAssetPanelCb = useCallback(() => {
    setShowAssetPanel(true);
  }, []);
  const closeContainer = useCallback(() => {
    setShowAssetPanel(false);
  }, []);
  const onFileBrowsedCb: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(async (e) => {
      const files = e.target.files;
      if (files) {
        const assets: {
          name: string;
          data: string;
          size: number;
          mime: string;
        }[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const data = await file.text();
          const name = file.name;
          const size = file.size;
          const mime = file.type;
          assets.push({ name, data, size, mime });
        }
        api.uploadAssets(assets, (success, url) => {
          if (!success) {
            console.log("failed");
          } else {
            console.log(url);
          }
        });
      }
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
          <div style={styles.dropContainerItem}>
            <header style={styles.dropContainerItemHeader}>
              <h4 style={styles.dropContainerItemHeaderH4}>Insert Component</h4>
              <div style={styles.icons}>
                <span style={styles.iconsSpan} onClick={closeContainer}>
                  <Cross />
                </span>
              </div>
            </header>
            <div>
              <input type={"file"} multiple={true} onChange={onFileBrowsedCb} />
            </div>
          </div>
        </Container>
      ) : null}
    </>
  );
}
