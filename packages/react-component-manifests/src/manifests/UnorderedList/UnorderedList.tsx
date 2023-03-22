import React, { forwardRef, useMemo } from "react";
import { List } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Item = {
  title: string;
  description?: string;
  icon?: string;
};

const UnorderedList = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    children: React.ReactNode[];
    custom: {
      items: Item[];
      bordered?: boolean;
      size?: "default" | "large" | "small";
      itemLayout?: "horizontal" | "vertical";
      pagination?: boolean | object;
      header?: React.ReactNode;
      footer?: React.ReactNode;
      split?: boolean;
      paginationPosition?: "top" | "bottom" | "both";
      paginationAlign?: "start" | "center" | "end";
      handleAdd?: (index: number) => void;
      handleUpdate?: (index: number) => void;
      handleDelete?: (index: number) => void;
      actionAdd?: boolean;
      actionUpdate?: boolean;
      actionDelete?: boolean;
      grid?: boolean | object;
      gutter?: number;
      column?: number;
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      xxl?: number;
    };
    onClick: (event: { item: Item; index: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const actions = useMemo(
    () => (index: number) => {
      const actions = [];
      if (props.custom.actionAdd) {
        actions.push(
          <PlusOutlined
            key="add"
            onClick={() =>
              props.custom?.handleAdd && props.custom?.handleAdd(index)
            }
          />
        );
      }
      if (props.custom.actionUpdate) {
        actions.push(
          <EditOutlined
            key="edit"
            onClick={() =>
              props.custom?.handleUpdate && props.custom?.handleUpdate(index)
            }
          />
        );
      }
      if (props.custom.actionDelete) {
        actions.push(
          <DeleteOutlined
            key="delete"
            onClick={() =>
              props.custom?.handleDelete && props.custom?.handleDelete(index)
            }
          />
        );
      }

      return actions;
    },
    [props.custom]
  );

  return (
    <div ref={ref}>
      <List
        className={props.className}
        style={{ ...props.styles }}
        itemLayout={props.custom.itemLayout}
        size={props.custom.size}
        bordered={props.custom.bordered}
        dataSource={props.custom.items}
        header={<div>Header {props.children}</div>}
        footer={<div>Footer {props.children}</div>}
        split={props.custom.split}
        pagination={
          props.custom.pagination === true && {
            position: props.custom.paginationPosition,
            align: props.custom.paginationAlign,
          }
        }
        grid={
          props.custom.grid === true
            ? {
                gutter: props.custom.gutter,
                column: props.custom.column,
                xs: props.custom.xs,
                sm: props.custom.sm,
                md: props.custom.md,
                lg: props.custom.lg,
                xl: props.custom.xl,
                xxl: props.custom.xxl,
              }
            : undefined
        }
        renderItem={(item, index) => (
          <List.Item
            key={item.title}
            actions={actions(index)}
            extra={<div>extra {props.children}</div>}
          >
            <List.Item.Meta
              avatar={<img src={item.icon} alt={item.icon} />}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
});

export default UnorderedList;
