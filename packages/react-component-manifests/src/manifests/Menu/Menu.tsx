import React, { forwardRef, ReactNode, useCallback } from "react";
import type { MenuProps } from "antd";
import { Menu as AntdMenu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const Menu = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    children: React.ReactNode[];
    custom: {
      items?: any;
      mode: "vertical" | "horizontal" | "inline";
      theme: "light" | "dark";
      multiple?: boolean;
      defaultOpenKeys?: string[];
      defaultSelectedKeys?: string[];
      expandIcon?: ReactNode;
      openKeys?: string[];
      selectable?: boolean;
      selectedKeys: string[];
    };
    onClick: any;
    onOpenChange: any;
    onSelect: any;
    className?: string;
  } & MenuProps
>((props, ref) => {
  const onClick = useCallback(() => {
    //props.onClick(!props.custom.open);
  }, [props]);

  return (
    <div
      ref={ref}
      style={{ ...props.styles, position: "relative" }}
      className={props.className}
    >
      <AntdMenu
        mode={props.custom.mode}
        items={props?.custom?.items}
        multiple={props.custom.multiple}
        defaultOpenKeys={props.custom.defaultOpenKeys}
        defaultSelectedKeys={props.custom.defaultSelectedKeys}
        expandIcon={props.custom.expandIcon}
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
