import { useState, useEffect, useMemo } from "react";
import { createCSSString } from "../../utils/createCSSString";

export function useStyleString(props: {
  alias: string | undefined;
  compProps: any;
}) {
  const [styleStr, setStyleStr] = useState("");
  useEffect(() => {
    function replaceEmptyStringWithUnset(styles: { [key: string]: string }) {
      const updatedStyles: { [key: string]: string } = {};
      Object.entries(styles).forEach(([key, value]) => {
        if (value === "") {
          updatedStyles[key] = "unset";
        } else {
          updatedStyles[key] = value;
        }
      });
      return updatedStyles;
    }
    if (props.alias) {
      createCSSString(
        `.${props.alias}`,
        replaceEmptyStringWithUnset(props.compProps.styles.styles) || {},
        props.compProps.styles.breakpoints || {}
      ).then((strs) => {
        setStyleStr(strs.join("\n"));
      });
    }
  }, [props.compProps, props.alias]);
  const styles = useMemo(() => {
    const newStyles = { ...props.compProps.styles };
    delete newStyles["styles"];
    delete newStyles["breakpoints"];
    return newStyles;
  }, [props.compProps.styles]);
  return { styleStr, styles };
}
