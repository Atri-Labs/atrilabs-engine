import React, { useCallback, useState } from "react";
import { CssProprtyComponentType } from "../../types";

export default function TypoRender(props: {
  fontValue: any;
  styleItem: keyof React.CSSProperties;
  patchCb: CssProprtyComponentType["patchCb"];
  styles: CssProprtyComponentType["styles"];
}) {
    const [url, setUrl] = useState(`https://fonts.googleapis.com/css2?family='Inter'@&display=swap`);
    useCallback(
        (fontFam = 'Inter', fontWei = 400) => {
          // Calling patchCb informs the browser forest manager(editor's state manager)
          // to update the state and inform all subscribers about the state update.
          console.log(url);
          setUrl(`https://fonts.googleapis.com/css2?family=${fontFam}wght=@${fontWei}&display=swap`)
          props.patchCb({
            property: {
              styles: { [props.styleItem] : props.fontValue },
            },
          });
        },
        [props, url]
      );

  return (
    <div>
      </div>
  );
}
