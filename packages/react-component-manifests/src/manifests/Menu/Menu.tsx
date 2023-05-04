import React, { forwardRef, useMemo } from "react";
import type { MenuProps } from "antd";
import { Menu as AntdMenu } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";

interface Item {
  key?: number;
  label: string;
  icon?: string;
  disabled?: boolean;
  children?: ItemType[];
  type?: string;
}

const Menu = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    children: React.ReactNode[];
    custom: {
      items: Item[];
      mode: "vertical" | "horizontal" | "inline";
      theme: "light" | "dark";
      multiple?: boolean;
      defaultOpenKeys?: string[];
      defaultSelectedKeys?: string[];
      expandIcon?: string;
      openKeys?: string[];
      selectable?: boolean;
      selectedKeys: string[];
    };
    onClick: Function;
    onOpenChange: Function;
    onSelect: Function;
    id?: string;
    className?: string;
  } & MenuProps
>((props, ref) => {
  const { custom } = props;
  const { items } = custom;

  const menuItems = useMemo(() => {
    return items.map((item: Item) => {
      return {
        ...item,
        icon: <img src={item?.icon} alt={item?.icon} />,
      } as ItemType;
    });
  }, [items]);

  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      <AntdMenu
        style={props.styles}
        className={`${props.className} ${props.attrs?.class}`}
        mode={props.custom.mode}
        items={menuItems}
        multiple={props.custom.multiple}
        defaultOpenKeys={props.custom.defaultOpenKeys}
        defaultSelectedKeys={props.custom.defaultSelectedKeys}
        expandIcon={
          props.custom.expandIcon && (
            <img src={props.custom.expandIcon} alt={props.custom.expandIcon} />
          )
        }
        openKeys={props.custom.openKeys}
        selectable={props.custom.selectable}
        selectedKeys={props.custom.selectedKeys}
        onClick={props.onClick}
        onOpenChange={props.onOpenChange}
        onSelect={props.onSelect}
        theme={props.custom.theme}
      />
    </div>
  );
});

export default Menu;
