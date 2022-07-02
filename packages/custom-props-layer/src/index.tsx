import { Tab } from "@atrilabs/core";
import { useManageCustomProps } from "./hooks/useManageCustomProps";
import { useShowTab } from "./hooks/useShowTab";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";

export default function () {
  const { showTab, id, treeOptions } = useShowTab();
  const { patchCb, customProps } = useManageCustomProps(id);
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
            />
          }
          header={<TabHeader />}
          itemName={"custom"}
        />
      ) : null}
    </>
  );
}
