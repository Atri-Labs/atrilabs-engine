import React, { forwardRef, ReactNode } from "react";
import { Tree as AntdTree } from "antd";
import type { DataNode, TreeProps } from 'antd/es/tree';

export type CollapsibleTypes = "header" | "icon" | "disabled";
export type ExpandIconPosition = "start" | "end";

export type Size = "large" | "middle" | "small";
export type Position = "left" | "right";

const Tree = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    className?: string;
    custom: {
      treeData?:any;
      checkable?: boolean;
      showLine?:boolean;
      multiple?:boolean;
      defaultExpandAll?:boolean;
      defaultExpandParent?:boolean;
      onCheck?:any;
      onExpand?:any;
      onRightClick?:any;
      onSelect?:any;
    };
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  const treeData: DataNode[] = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
          ],
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
          ],
        },
        {
          title: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
      ],
    },
    {
      title: '0-2',
      key: '0-2',
    },
  ];
  
  return (
    <div ref={ref}>
      <AntdTree
        style={props.styles}
        className={props.className}
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
