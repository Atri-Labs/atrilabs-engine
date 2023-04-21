import { Tab } from "@atrilabs/core";
import { useManageCustomProps } from "./hooks/useManageCustomProps";
import { useShowTab } from "./hooks/useShowTab";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";
import { useUploadAssetManager } from "@atrilabs/shared-layer-lib";
import { useColorPicker } from "./hooks/useColorPicker";

export default function () {
  const { showTab, id, treeOptions } = useShowTab();
  const { patchCb, customProps } = useManageCustomProps(id);
  const { openAssetManager } = useUploadAssetManager({
    patchCb,
    wrapInUrl: false,
  });
  const { openColorPicker } = useColorPicker();

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
            </>
          }
          header={<TabHeader />}
          itemName={"custom"}
        />
      ) : null}
    </>
  );
}
