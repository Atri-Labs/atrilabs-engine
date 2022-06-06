import { Tab } from "@atrilabs/core";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";
import { useShowTab } from "./hooks/useShowTab";

export default function () {
  // show tab and set alias
  const { showTab, alias, setAliasCb } = useShowTab();
  return (
    <>
      {showTab ? (
        <Tab
          name="PropertiesTab"
          body={<TabBody alias={alias} setAliasCb={setAliasCb} />}
          header={<TabHeader />}
        />
      ) : null}
    </>
  );
}
