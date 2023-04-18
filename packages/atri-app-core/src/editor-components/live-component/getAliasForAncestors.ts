import { liveApi } from "../../api";
import { RepeatingContextData } from "../../types";

export function getAliasForAncestors(
  repeatingContextData: RepeatingContextData
) {
  const repeatingContextDataCopy = JSON.parse(
    JSON.stringify(repeatingContextData)
  ) as RepeatingContextData;
  return repeatingContextDataCopy.compIds.map((compId) => {
    return liveApi.getComponentAlias(compId);
  });
}
