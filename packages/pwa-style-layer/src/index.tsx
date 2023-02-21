import { useListenSelect } from "./hooks/useListenSelect";
import { BrowserForestManager, Tab } from "@atrilabs/core";
import { TabHeader } from "./TabHeader";
import { api } from "@atrilabs/pwa-builder-manager";
import { PatchEvent } from "@atrilabs/forest";
import CssTreeId from "@atrilabs/app-design-forest/src/cssTree?id";

export default function () {
  const { selectedId } = useListenSelect();
  console.log(selectedId);
  return (
    <>
      <Tab
        name="PropertiesTab"
        body={
          <>
            <input
              onChange={(ev) => {
                const { forestId, forestPkgId } =
                  BrowserForestManager.currentForest;
                const cssNodeId =
                  BrowserForestManager.currentForest.tree(CssTreeId)?.links[
                    selectedId!
                  ].childId!;
                const height = ev.target.value + "px";
                const patchEvent: PatchEvent = {
                  type: `PATCH$$${CssTreeId}`,
                  id: cssNodeId,
                  slice: {
                    styles: {
                      height,
                    },
                  },
                };
                api.postNewEvents(forestPkgId, forestId, {
                  name: "",
                  events: [patchEvent],
                  meta: { agent: "browser" },
                });
              }}
            ></input>
          </>
        }
        header={<TabHeader />}
        itemName={"styles"}
      ></Tab>
    </>
  );
}
