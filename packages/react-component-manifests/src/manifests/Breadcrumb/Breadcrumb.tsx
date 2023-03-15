import React, { forwardRef } from "react";
import { Breadcrumb as AntdBreadcrumb } from "antd";

const Breadcrumb = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      separator?: string;
      items: {
        title?: string;
        href?: string;
        icon: string;
      }[];
    };
    className?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
  }
>((props, ref) => {
  return (
    <div ref={ref}>
      <AntdBreadcrumb
        className={props.className}
        style={props.styles}
        separator={props.custom.separator}
      >
        {props.custom.items.map((item, index: number) => (
          <AntdBreadcrumb.Item
            key={index}
            href={item.href}
            onClick={props.onClick}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {item.icon ? <img src={item.icon} alt={item.icon} /> : undefined}
              <span>{item.title}</span>
            </div>
          </AntdBreadcrumb.Item>
        ))}
      </AntdBreadcrumb>
    </div>
  );
});
export default Breadcrumb;
