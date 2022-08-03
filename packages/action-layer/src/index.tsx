import { Tab } from "@atrilabs/core";
import { useManageActionLayer } from "./hooks/useManageActionLayer";
import { useShowTab } from "./hooks/useShowTab";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";

export default function () {
  const { showTab, id } = useShowTab();
  const { patchCb, callbacks, callbackNames } = useManageActionLayer(id);

  return (
    <>
      {showTab && id ? (
        <Tab
          name="PropertiesTab"
          body={
            <TabBody
              patchCb={patchCb}
              compId={id}
              callbacks={callbacks}
              callbackNames={callbackNames}
            />
          }
          header={<TabHeader />}
          itemName={"Actions"}
        />
      ) : null}
    </>
  );
}
