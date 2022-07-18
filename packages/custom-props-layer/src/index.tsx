import { Container, Tab } from "@atrilabs/core";
import { useManageCustomProps } from "./hooks/useManageCustomProps";
import { useShowTab } from "./hooks/useShowTab";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";
import {
  UploadContainer,
  useUploadAssetManager,
} from "@atrilabs/shared-layer-lib";

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
  return (
    <>
      {showTab ? (
        <Tab
          name="PropertiesTab"
          body={
            <TabBody
              patchCb={patchCb}
              customProps={customProps}
              treeOptions={treeOptions}
              openAssetManager={openAssetManager}
            />
          }
          header={<TabHeader />}
          itemName={"custom"}
        />
      ) : null}
      {showAssetPanel ? (
        <Container name="Drop">
          <UploadContainer
            modes={modes}
            onCrossClicked={onCrossClicked}
            onUploadSuccess={onUploadSuccess}
            onSelect={onSelect}
          />
        </Container>
      ) : null}
    </>
  );
}
