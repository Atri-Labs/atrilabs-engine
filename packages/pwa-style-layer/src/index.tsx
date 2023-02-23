import { useListenSelect } from "./hooks/useListenSelect";
import { Tab } from "@atrilabs/core";
import { TabHeader } from "./TabHeader";
import { patchCb } from "./utils";

export default function () {
  const { selectedId } = useListenSelect();
  return (
    <>
      <Tab
        name="PropertiesTab"
        body={
          <>
            {selectedId ? (
              <input
                onChange={(ev) => {
                  patchCb({
                    selectedId,
                    propName: "height",
                    value: ev.target.value + "px",
                  });
                }}
              ></input>
            ) : null}
          </>
        }
        header={<TabHeader />}
        itemName={"styles"}
      ></Tab>
    </>
  );
}
