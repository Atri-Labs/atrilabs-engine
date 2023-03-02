import React, { forwardRef} from "react";
import { Tabs as AntdTabs , TabsProps } from "antd";

export type TabsType = 'line' | 'card' | 'editable-card';
export type TabPosition = 'left' | 'right' | 'top' | 'bottom';
export type SizeType = 'large' | 'middle' | 'small';

const Tabs = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    className?: string;
    custom?: { items?: any } ;
    onChange: (activeKey: string) => void;
    onTitleClick?: (
      activeKey: string,
      e: React.KeyboardEvent | React.MouseEvent
    ) => void;
  }& TabsProps
>((props, ref) => {
  const { custom, ...restProps } = props; 
  return (
      <div ref={ref}  style={props.styles}>
        <AntdTabs
          className={props.className}
          items={props?.custom?.items}
          {...custom}
          {...restProps}
          onChange= {props.onChange}
          onTabClick={props.onTitleClick}               
        />
      </div>
  );
});
export default Tabs;

