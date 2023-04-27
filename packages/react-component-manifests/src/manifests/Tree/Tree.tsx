import React, { forwardRef } from "react";
import { Tree as AntdTree } from "antd";
import type { DataNode } from "antd/es/tree";

const Tree = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      id: string;
      class: string;
    }
    className?: string;
    custom: {
      treeData?: DataNode[];
      checkable?: boolean;
      showLine?: boolean;
      multiple?: boolean;
      defaultExpandAll?: boolean;
      defaultExpandParent?: boolean;
      onCheck?: (
        checked:
          | {
              checked: (string | number)[];
              halfChecked: (string | number)[];
            }
          | (string | number)[]
      ) => void;
      onExpand?: (
        expandedKeys: (string | number)[],
        info: {
          expanded: boolean;
          nativeEvent: MouseEvent;
        }
      ) => void;
      onRightClick?: (info: { event: React.MouseEvent }) => void;
      onSelect?: (
        selectedKeys: (string | number)[],
        info: {
          event: "select";
          selected: boolean;
          nativeEvent: MouseEvent;
        }
      ) => void;
    };
  }
>((props, ref) => {
  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.attrs.id}>
      <AntdTree
        style={props.styles}
        className={`${props.className} ${props.attrs.class}`}
        checkable={props.custom.checkable}
        showLine={props.custom.showLine}
        multiple={props.custom.multiple}
        treeData={props.custom.treeData}
        defaultExpandAll={props.custom.defaultExpandAll}
        defaultExpandParent={props.custom.defaultExpandParent}
        onCheck={props.custom.onCheck}
        onExpand={props.custom.onExpand}
        onRightClick={props.custom.onRightClick}
        onSelect={props.custom.onSelect}
      />
    </div>
  );
});
export default Tree;
