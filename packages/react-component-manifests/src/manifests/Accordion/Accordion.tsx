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

const Accordion = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    custom: {
      items: {
        title: string;
        description?: string;
        collapsible?: CollapsibleTypes;
        showArrow?: boolean;
        key: string | number;
      }[];
      bordered?: boolean;
      collapse?: boolean;
      defaultActiveKey: string[] | string | number[] | number;
      expandIcon?: string;
      expandIconPosition?: ExpandIconPosition;
      ghost?: boolean;
      size?: Size;
    };
    id?: string;
    className?: string;
    onChange?: (key: string | string[]) => void;
  }
>((props, ref) => {
  const customExpandIcon = useCallback(
    () => <img src={props.custom?.expandIcon} alt={props.custom?.expandIcon} />,
    [props.custom]
  );
  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      <Collapse
        style={props.styles}
        className={`${props.className} ${props.attrs.class}`}
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
            key={
              item.key !== (undefined || "")
                ? item.key
                : Math.floor(Math.random() * 1000 + 1)
            }
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
