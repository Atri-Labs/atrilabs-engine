import { Tab } from "@atrilabs/core";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";
import { useShowTab } from "./hooks/useShowTab";
import { useManageCSS } from "./hooks/useManageCSS";
import { useCallback } from "react";
import { CssProprtyComponentType } from "./types";

/*
This serves as the Data Manager component for this layer.
*/
export default function () {
  // show tab and set alias
  const { showTab, alias, setAliasCb, id } = useShowTab();
  const { patchCb, styles, treeOptions } = useManageCSS(id);
  const openAssetManager = useCallback<
    CssProprtyComponentType["openAssetManager"]
  >((mode, styleItem) => {}, []);
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
    </>
  );
}
