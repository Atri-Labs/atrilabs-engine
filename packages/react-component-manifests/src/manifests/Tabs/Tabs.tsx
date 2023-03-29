import React, { forwardRef, useMemo } from "react";
import { Tabs as AntdTabs, TabsProps } from "antd";

export type TabsType = "line" | "card" | "editable-card";
export type TabPosition = "left" | "right" | "top" | "bottom";
export type SizeType = "large" | "middle" | "small";

const Tabs = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    children: React.ReactNode[];
    className?: string;
    custom: {
      items: {
        key: string;
        label: React.ReactNode;
      }[];
      activeTabColor?: string;
    };
    onChange: (activeKey: string) => void;
    onTabClick?: (
      activeKey: string,
      e: React.KeyboardEvent | React.MouseEvent
    ) => void;
  } & TabsProps
>((props, ref) => {
  const { custom, children, ...restProps } = props;
  const { items } = custom;

  const tabItems = useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      children: props.children,
    }));
  }, [items, props.children]);

  return (
    <div ref={ref} style={props.styles}>
      {(props.custom.activeTabColor !== "" || undefined) && (
        <style>
          {`.ant-tabs-tab-active .ant-tabs-tab-btn {
            color:${props.custom.activeTabColor} !important;
          }
          .ant-tabs-ink-bar {
            background:${props.custom.activeTabColor} !important;
          }
          .ant-tabs-tab:hover{
            color:${props.custom.activeTabColor} !important;
          }
        `}
        </style>
      )}
      <AntdTabs
        className={props.className}
        {...custom}
        {...restProps}
        items={tabItems}
        onChange={props.onChange}
        tabBarStyle={props.styles}
      />
    </div>
  );
});
export default Tabs;
