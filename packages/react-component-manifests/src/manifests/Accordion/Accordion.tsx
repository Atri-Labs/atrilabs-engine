import React, { forwardRef, useCallback } from "react";
import { Collapse } from "antd";
const { Panel } = Collapse;

export enum CollapsibleTypes {
  HEADER = "header",
  ICON = "icon",
  DISABLED = "disabled",
}
export type ExpandIconPosition = "start" | "end";

export type Size = "large" | "middle" | "small";

export type AccordionItem = {
  title: string;
  description?: string;
  key: string | number;
  collapsible?: CollapsibleTypes;
  showArrow?: boolean;
};

const Accordion = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: AccordionItem[];
      bordered?: boolean;
      collapse?: boolean;
      defaultActiveKey?: string[] | string | number[] | number;
      expandIcon?: string;
      expandIconPosition?: ExpandIconPosition;
      ghost?: boolean;
      size?: Size;
    };
    className?: string;
    onChange?: (key: string | string[]) => void;
  }
>((props, ref) => {
  const customExpandIcon = useCallback(
    () => <img src={props.custom?.expandIcon} alt={props.custom?.expandIcon} />,
    [props.custom]
  );
  console.log("items", props.custom.items);
  return (
    <div ref={ref}>
      <Collapse
        style={props.styles}
        className={props.className}
        size={props.custom?.size}
        bordered={props.custom.bordered}
        defaultActiveKey={props.custom.defaultActiveKey}
        expandIcon={
          props.custom.expandIcon !== undefined
            ? customExpandIcon
            : props.custom.expandIcon
        }
        expandIconPosition={props.custom.expandIconPosition}
        ghost={props.custom.ghost}
        accordion={!props.custom.collapse}
        onChange={props.onChange}
      >
        {props.custom?.items?.map((item, index) => (
          <Panel
            header={item.title}
            key={index}
            collapsible={item.collapsible}
            showArrow={item.showArrow}
          >
            <p>{item.description}</p>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
});
export default Accordion;
