import { RepeatingContextData } from "../../types";
import { componentStoreApi, liveApi } from "../../api";
import { mergeState } from "../../utils/mergeState";

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
      const props = JSON.parse(
        JSON.stringify(componentStoreApi.getComponentProps(compId))
      );
      mergeState(
        props,
        currData[
          repeatingContextData.indices[repeatingContextData.indices.length - 1]
        ][compAlias]
      );
      return props;
    } else {
      console.log(`data not found at ${repeatingContextData}`);
    }
  }
}
