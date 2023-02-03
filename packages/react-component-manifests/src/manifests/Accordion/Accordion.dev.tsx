import { forwardRef, useMemo } from "react";
import Accordion from "./Accordion";

const DevAccordian = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: { title: string; description?: string; open: boolean }[];
    };
    onTitleClick: (open: boolean) => void;
    className?: string;
  }
>((props, ref) => {
  const items = useMemo(() => {
    if (props.custom.items.length === 0)
      return [
        {
          title: "Title",
          description: "Description will appear here.",
          open: false,
        },
      ];
    return props.custom.items;
  }, [props.custom.items]);

  return (
    <Accordion
      {...props}
      custom={{
        items: items,
      }}
      ref={ref}
    />
  );
});

export default DevAccordian;
