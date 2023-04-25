import {Tab} from "@atrilabs/core";
import {useManageAttrs} from "./hooks/useManageAttrs";
import {useShowTab} from "./hooks/useShowTab";
import {TabBody} from "./TabBody";
import {TabHeader} from "./TabHeader";

export default function () {
  const {showTab, id} = useShowTab();
  const {patchCb, attrs} = useManageAttrs(id);


  return (
    <>
      {showTab ? (
        <Tab
          name="PropertiesTab"
          body={
            <>
              <TabBody
                patchCb={patchCb}
                attrs={attrs}
              />
            </>
          }
          header={<TabHeader/>}
          itemName={"attrs"}
        />
      ) : null}
    </>
  );
}
