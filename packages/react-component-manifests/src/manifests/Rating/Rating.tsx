import React, { forwardRef, ReactNode, useState } from "react";
import { Rate } from "antd";
import Test from "./Test";
const Rating = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      allowHalf?: boolean;
      defaultValue?: number;
      disabled?: boolean;
      allowClear?: boolean;
      character?: ReactNode;
      toolTipInfo?: string[];
      count?: number;
    };
    className?: string;
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  const [value, setValue] = useState(props.custom.defaultValue);
  return (
    <div ref={ref}>
      <Rate
        className={props.className}
        style={props.styles}
        {...custom}
        //character={<Test />}
        character={props.custom.character}
        tooltips={props.custom.toolTipInfo}
        onChange={setValue}
        value={value}
      />
      {props.custom?.toolTipInfo && value
        ? props.custom?.toolTipInfo[value - 1]
        : ""}
    </div>
  );
});

export default Rating;
