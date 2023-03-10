import React, { forwardRef, ReactNode, useCallback, useMemo } from "react";
import type { MenuProps, MenuItemProps } from "antd";
import { Menu as AntdMenu } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";

interface Item {
  key?: number;
  label: string;
  icon?: string;
  disabled?: boolean;
  children?: ItemType[];
}

const Menu = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    children: React.ReactNode[];
    custom: {
      items: ItemType[];
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
    className?: string;
  } & MenuProps
>((props, ref) => {
  const { custom, ...restProps } = props;
  const { items } = custom;

  const menuItems = useMemo(() => {
    return items.map((item: ItemType) => {
      if (typeof item?.icon === "string") {
        return {
          ...item,
          icon: (
            <div
              style={{
                width: "14px",
                height: "14px",
              }}
            >
              <img src={item?.icon} width="100%" />
            </div>
          ),
        };
      }
      return item;
    });
  }, [items]);

  return (
    <div
      ref={ref}
      style={{ ...props.styles, position: "relative" }}
      className={props.className}
    >
      <AntdMenu
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
