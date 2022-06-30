import { Tab } from "@atrilabs/core";
import { useManageCustomProps } from "./hooks/useManageCustomProps";
import { useShowTab } from "./hooks/useShowTab";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";

export default function () {
  const { showTab, alias, setAliasCb, id } = useShowTab();
  const { patchCb, customProps, treeOptions } = useManageCustomProps(id);
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
              customProps={customProps}
              treeOptions={treeOptions}
            />
          }
          header={<TabHeader />}
        />
      ) : null}
    </>
  );
}
