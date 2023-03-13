import React, { forwardRef } from "react";
import { Statistic as AntdStatistic } from "antd";

const { Countdown } = AntdStatistic;

const Statistic = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
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
      countdown?: boolean;
      format?: "DD:HH:mm:ss" | "HH:mm:ss" | "mm:ss" | "ss";
      countdownValue?: number;
      inputType?: "minute" | "hour" | "second";
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
  }
>((props, ref) => {
  const { custom, ...restProps } = props;
  // moved ref to div, as the Antd Statistic doesnt provide ref for Statistic
  return (
    <div ref={ref}>
      {props.custom?.countdown === true ? (
        <Countdown
          className={props.className}
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
          format={props.custom.format}
          value={
            props.custom?.countdownValue &&
            (props.custom.inputType === "second"
              ? Date.now() + props.custom?.countdownValue * 1000
              : props.custom.inputType === "hour"
              ? Date.now() + props.custom?.countdownValue * 3600000
              : props.custom.inputType === "minute"
              ? Date.now() + props.custom?.countdownValue * 60000
              : "")
          }
        />
      ) : (
        <AntdStatistic
          className={props.className}
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
      )}
    </div>
  );
});

export default Statistic;
