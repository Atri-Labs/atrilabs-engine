import React, { forwardRef, useEffect, useMemo, useState } from "react";
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
    }[]
  };
    onChange: (activeKey: string) => void;
    onTitleClick?: (
      activeKey: string,
      e: React.KeyboardEvent | React.MouseEvent
    ) => void;
  } & TabsProps
>((props, ref) => {
  const { custom, children, ...restProps } = props;
  const {items} = custom;

  const tabItems = useMemo(() => {
    if (children?.length) {
      return items.map((item, index) => ({...item, children: children[index] || ''}))
    } else {
      return items;
    }
  }, [items, children])

  return (
    <div ref={ref} style={props.styles}>
      <AntdTabs
        className={props.className}
        {...custom}
        {...restProps}
        items={tabItems}
        onChange={props.onChange}
        onTabClick={props.onTitleClick}
      />
      
    </div>
  );
});
export default Tabs;

