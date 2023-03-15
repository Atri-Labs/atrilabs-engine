import { forwardRef, useMemo } from "react";
import Accordion, { CollapsibleTypes } from "./Accordion";

const DevAccordion: typeof Accordion = forwardRef((props, ref) => {
  const items = useMemo(() => {
    return props.custom?.items?.map((item) => {
      return {
        ...item,
        collapsible: CollapsibleTypes.DISABLED,
      };
    });
  }, [props.custom?.items]);

  return <Accordion {...props} custom={{ ...props.custom, items }} ref={ref} />;
});

export default DevAccordion;
