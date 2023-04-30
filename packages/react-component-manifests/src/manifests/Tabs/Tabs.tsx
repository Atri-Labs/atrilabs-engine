import React, {forwardRef, useMemo} from "react";
import {Tabs as AntdTabs, TabsProps} from "antd";

const Tabs = forwardRef<HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    children: React.ReactNode[];
    id?: string;
    className?: string;
    custom: {
      items: {
        key: string;
        label: React.ReactNode;
        children?: string; // update when accept child is added
        icon?: string;
        disabled?: boolean;
      }[];
      inActiveTabColor?: string;
      activeTabColor?: string;
    };
    onChange: (activeKey: string) => void;
    onTabClick?: (
      activeKey: string,
      e: React.KeyboardEvent | React.MouseEvent
    ) => void;
  } & TabsProps>((props, ref) => {
  const {custom, ...restProps} = props;
  const {items} = custom;

  const tabItems = useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      label: (
        <span style={{display: "flex", gap: "5px"}}>
          {item.icon && <img style={{width: "18px"}} src={item?.icon} alt={item?.icon}/>}
          {item.label}
        </span>
      ),
    }));
  }, [items]);

  return (
    <div ref={ref} style={props.styles} id={props.id}>
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
        {...restProps}
        {...custom}
        className={props.className}
        items={tabItems}
        onChange={props.onChange}
        tabBarStyle={{
          ...props.styles,
          color: `${props.custom.inActiveTabColor}`,
        }}

      />
    </div>
  );
});
export default Tabs;
