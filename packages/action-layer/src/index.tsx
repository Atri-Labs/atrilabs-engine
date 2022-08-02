import { Tab } from "@atrilabs/core";
import { useManageActionLayer } from "./hooks/useManageActionLayer";
import { useShowTab } from "./hooks/useShowTab";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";

export default function () {
  const { showTab, id } = useShowTab();
  const { patchCb, callbacks } = useManageActionLayer(id);

  return (
    <>
      {showTab && id ? (
        <Tab
          name="PropertiesTab"
          body={<TabBody patchCb={patchCb} compId={id} callbacks={callbacks} />}
          header={<TabHeader />}
          itemName={"Actions"}
        />
      ) : null}
    </>
  );
}
