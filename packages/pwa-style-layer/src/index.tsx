import { useListenSelect } from "./hooks/useListenSelect";
import { Tab } from "@atrilabs/core";

export default function () {
  useListenSelect();
  return (
    <>
      <Tab></Tab>
    </>
  );
}
