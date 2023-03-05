import { ComponentNavigator } from "./components/ComponentNavigator";
import { useGetFlattenedNodes } from "./hooks/useGetFlattenedNodes";

export function ComponentNavigatorWrapper() {
  const { flattenedNodes } = useGetFlattenedNodes();
  return <ComponentNavigator flattenedNodes={flattenedNodes} />;
}
