import { Tab, Container } from "@atrilabs/core";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";
import { useShowTab } from "./hooks/useShowTab";
import { useManageCSS } from "./hooks/useManageCSS";
import { UploadContainer } from "@atrilabs/shared-layer-lib";
import { useUploadAssetManager } from "./hooks/useUploadAssetManager";

/*
This serves as the Data Manager component for this layer.
*/
export default function () {
  // show tab and set alias
  const { showTab, alias, setAliasCb, id } = useShowTab();
  const { patchCb, styles, treeOptions } = useManageCSS(id);
  const {
    openAssetManager,
    modes,
    onCrossClicked,
    onSelect,
    onUploadSuccess,
    showAssetPanel,
  } = useUploadAssetManager(patchCb);
  return (
    <>
      {showTab && id ? (
        <Tab
          name="PropertiesTab"
          body={
            <TabBody
              alias={alias}
              setAliasCb={setAliasCb}
              patchCb={patchCb}
              styles={styles}
              treeOptions={treeOptions}
              openAssetManager={openAssetManager}
              compId={id}
            />
          }
          header={<TabHeader />}
          itemName={"styles"}
        />
      ) : null}
      {showAssetPanel ? (
        <Container name="Drop" onClose={onCrossClicked}>
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
