import React, { forwardRef, useMemo } from "react";
import { Breadcrumb as AntdBreadcrumb } from "antd";

interface item {
  title: string;
  href?: string;
  icon: string;
  menu?: {
    items: item[];
  };
}

const Breadcrumb = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    }
    custom: {
      separator?: string;
      items: item[];
    };
    id?: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
  }
>((props, ref) => {
  const breadcrumbItems = useMemo(() => {
    return props.custom.items.map((item) => {
      if (item.menu) {
        return {
          title: <a href={item.title}>{item.title}</a>,
          menu: {
            items: item.menu.items.map((subItem: item) => ({
              title: subItem.title,
            })),
          },
        };
      }
      if (item.href) {
        return {
          title: <a href={item.href}> {item.title}</a>,
        };
      }
      return item;
    });
  }, [props.custom.items]);
  return (
    <div ref={ref} style={{display: "inline-block"}} id={props.id}
    >
      <AntdBreadcrumb
        className={props.className}
        style={props.styles}
        separator={props.custom.separator}
        items={breadcrumbItems}
      />
    </div>
  );
});
export default Breadcrumb;
