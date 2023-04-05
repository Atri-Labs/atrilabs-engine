import { RepeatingContextData } from "../../types";
import { componentStoreApi, liveApi } from "../../api";

export function getPropsForRepeatingChild(
  compId: string,
  repeatingContextData: RepeatingContextData
) {
  if (repeatingContextData.compIds.length > 0) {
    const topMostRepeatingAncestorId = repeatingContextData.compIds[0];
    const { data } = componentStoreApi.getComponentProps(
      topMostRepeatingAncestorId
    )["custom"];
    if (data) {
      let currData: any = data;
      const aliasArray = repeatingContextData.compIds
        .slice(1)
        .map((currCompId) => {
          return liveApi.getComponentAlias(currCompId);
        });
      for (let i = 0; i < aliasArray.length; i++) {
        currData =
          currData[repeatingContextData.indices[i]][aliasArray[i]]["custom"][
            "data"
          ];
      }
      const compAlias = liveApi.getComponentAlias(compId);
      // TODO: merge with the default data from componentStoreApi
      return currData[
        repeatingContextData.indices[repeatingContextData.indices.length - 1]
      ][compAlias];
    } else {
      console.log(`data not found at ${repeatingContextData}`);
    }
  }
}
