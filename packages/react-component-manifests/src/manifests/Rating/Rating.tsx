import React, { forwardRef, ReactNode, useState } from "react";
import { Rate } from "antd";

const Rating = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    custom: {
      allowHalf?: boolean;
      defaultValue?: number;
      disabled?: boolean;
      allowClear?: boolean;
      character?: ReactNode;
      toolTipInfo?: string[];
      count?: number;
    };
    id?: string;
    className?: string;
  }
>((props, ref) => {
  const { custom } = props;
  const [value, setValue] = useState(props.custom.defaultValue);
  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      <Rate
        className={`${props.className} ${props.attrs?.class}`}
        style={props.styles}
        {...custom}
        character={props.custom.character || undefined}
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
