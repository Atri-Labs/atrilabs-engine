import { Tab, Container } from "@atrilabs/core";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";
import { useShowTab } from "./hooks/useShowTab";
import { useManageCSS } from "./hooks/useManageCSS";
import { useCallback, useState } from "react";
import { CssProprtyComponentType } from "./types";
import { UploadContainer, UploadMode } from "@atrilabs/shared-layer-lib";

/*
This serves as the Data Manager component for this layer.
*/
export default function () {
  // show tab and set alias
  const { showTab, alias, setAliasCb, id } = useShowTab();
  const { patchCb, styles, treeOptions } = useManageCSS(id);
  const [showAssetPanel, setShowAssetPanel] = useState<boolean>(false);
  const [modes, setModes] = useState<UploadMode[]>([]);
  const onCrossClicked = useCallback(() => {
    setModes([]);
    setShowAssetPanel(false);
  }, []);
  const openAssetManager = useCallback<
    CssProprtyComponentType["openAssetManager"]
  >((modes, styleItem) => {
    setShowAssetPanel(true);
    setModes(modes);
  }, []);
  return (
    <>
      {showTab ? (
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
            />
          }
          header={<TabHeader />}
          itemName={"styles"}
        />
      ) : null}
      {showAssetPanel ? (
        <Container name="Drop">
          <UploadContainer modes={modes} onCrossClicked={onCrossClicked} />
        </Container>
      ) : null}
    </>
  );
}
