import { Tab } from "@atrilabs/core";
import { TabBody } from "./TabBody";
import { TabHeader } from "./TabHeader";

export default function () {
  return (
    <>
      <Tab name="PropertiesTab" body={<TabBody />} header={<TabHeader />} />
    </>
  );
}
