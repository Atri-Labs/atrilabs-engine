import { ComponentNavigator } from "./components/ComponentNavigator";
import { useGetFlattenedNodes } from "./hooks/useGetFlattenedNodes";
import { useOpenClose } from "./hooks/useOpenClose";

export function ComponentNavigatorWrapper(props: {
  openClose: {
    openOrCloseMap: { [compId: string]: boolean };
    canvasOpenOrCloseMap: { [canvasZoneId: string]: boolean };
  };
}) {
  const { flattenedNodes, toggleNode } = useGetFlattenedNodes(props.openClose);
  return (
    <ComponentNavigator
      flattenedNodes={flattenedNodes}
      onToggleOpen={toggleNode}
    />
  );
}
