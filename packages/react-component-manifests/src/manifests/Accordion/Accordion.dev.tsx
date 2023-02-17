import { forwardRef, useMemo } from "react";
import Accordion from "./Accordion";
import { ExpandIconPosition } from "./Accordion";
const CustomArrowIcon: string = require("./CustomArrowIcon.svg").default;


const DevAccordian = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: { title: string; description?: string; open: boolean }[];
      collapse?: boolean;
      arrowIcon?: string;
      expandIconPosition?:ExpandIconPosition
    };
    onTitleClick: (open: boolean, index: number) => void;
    className?: string;
  }
>((props, ref) => {
  const items = useMemo(() => {
    if (props.custom.items.length === 0)
      return [
        {
          title: "Title",
          description: "Description will appear here.",
          //disabled :true
         // open: true
        },
        {
          title: "Title2",
          description: "Description will appear here.",
          showIcon: true,
        },
        {
          title: "Title3",
          description: "Description will appear here.",
          showIcon: false,
         // open: true
        },
      ];
    return props.custom.items;
  }, [props.custom.items]);

  return (
    <>
    <Accordion
      {...props}
      custom={{
        items: items,
        collapse: props.custom.collapse,
        arrowIcon: props.custom.arrowIcon,
        expandIconPosition : props.custom.expandIconPosition,
      }}
      ref={ref}
    />
    </>
  );
});

export default DevAccordian;
