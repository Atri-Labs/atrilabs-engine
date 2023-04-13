import { useState, useEffect } from "react";
import { createCSSString } from "../../utils/createCSSString";

export function useStyleString(props: {
  alias: string | undefined;
  compProps: any;
}) {
  const [styleStr, setStyleStr] = useState("");
  useEffect(() => {
    if (props.alias) {
      createCSSString(
        `.${props.alias}`,
        props.compProps.styles.styles || {},
        props.compProps.styles.breakpoints || {}
      ).then((strs) => {
        setStyleStr(strs.join("\n"));
      });
    }
  }, [props.compProps, props.alias]);
  return styleStr;
}
