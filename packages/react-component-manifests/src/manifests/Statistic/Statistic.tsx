import React, { forwardRef } from "react";
import { Statistic as AntdStatistic } from "antd";

const Statistic = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    attrs: {
      class: string;
    };
    id?: string;
    className?: string;
    custom?: {
      title?: string;
      decimalSeparator?: string;
      groupSeparator?: string;
      value?: string | number;
      loading?: boolean;
      precision?: number;
      prefix?: string;
      prefixIcon?: string;
      suffix?: string;
      suffixIcon?: string;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
  }
>((props, ref) => {
  const { custom } = props;
  // moved ref to div, as the Antd Statistic doesnt provide ref for Statistic
  return (
    <div ref={ref} style={{ display: "inline-block" }} id={props.id}>
      <AntdStatistic
        className={`${props.className} ${props.attrs?.class}`}
        style={props.styles}
        {...custom}
        valueStyle={props.styles}
        prefix={
          props.custom?.prefixIcon !== undefined ? (
            <img
              src={props.custom?.prefixIcon}
              alt={props.custom?.prefixIcon}
            />
          ) : (
            props.custom?.prefix
          )
        }
        suffix={
          props.custom?.suffixIcon !== undefined ? (
            <img
              src={props.custom?.suffixIcon}
              alt={props.custom?.suffixIcon}
            />
          ) : (
            props.custom?.suffix
          )
        }
      />
    </div>
  );
});

export default Statistic;
