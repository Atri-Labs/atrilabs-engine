import { Container, Tab } from "@atrilabs/core";
import { useManageCustomProps } from "./hooks/useManageCustomProps";
import { useShowTab } from "./hooks/useShowTab";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";
import {
  ColorPickerDialog,
  UploadContainer,
  useUploadAssetManager,
} from "@atrilabs/shared-layer-lib";
import { useColorPicker } from "./hooks/useColorPicker";
import { gray700 } from "@atrilabs/design-system";

export default function () {
  const { showTab, id, treeOptions } = useShowTab();
  const { patchCb, customProps } = useManageCustomProps(id);
  const {
    openAssetManager,
    modes,
    onCrossClicked,
    onSelect,
    onUploadSuccess,
    showAssetPanel,
  } = useUploadAssetManager({ patchCb, wrapInUrl: false });
  const { showColorPicker, openColorPicker, colorPickerProps } =
    useColorPicker();

  return (
    <>
      {showTab ? (
        <Tab
          name="PropertiesTab"
          body={
            <>
              <TabBody
                patchCb={patchCb}
                customProps={customProps}
                treeOptions={treeOptions}
                openAssetManager={openAssetManager}
                openColorPicker={openColorPicker}
              />
              {showColorPicker && colorPickerProps ? (
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.2rem",
                    left: "-17rem",
                  }}
                >
                  <ColorPickerDialog {...colorPickerProps} />
                </div>
              ) : null}
            </>
          }
          header={<TabHeader />}
          itemName={"custom"}
        />
      ) : null}
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
            <UploadContainer
              modes={modes}
              onCrossClicked={onCrossClicked}
              onUploadSuccess={onUploadSuccess}
              onSelect={onSelect}
            />
          </div>
        </Container>
      ) : null}
    </>
  );
}
