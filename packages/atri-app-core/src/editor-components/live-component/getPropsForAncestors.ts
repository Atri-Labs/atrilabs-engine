import { componentStoreApi } from "../../api";
import { RepeatingContextData } from "../../types";

export function getPropsForAncestors(
  repeatingContextData: RepeatingContextData
) {
  const repeatingContextDataCopy = JSON.parse(
    JSON.stringify(repeatingContextData)
  ) as RepeatingContextData;
  const data: any[] = [];
  for (let i = 0; i < repeatingContextDataCopy.compIds.length; i++) {
    const currData = componentStoreApi.getComponentProps(
      repeatingContextDataCopy.compIds[i]
    )["custom"]["data"][repeatingContextDataCopy.indices[i]];
    data.push(currData);
  }
  return data;
}
