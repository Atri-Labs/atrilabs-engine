import React, { forwardRef } from "react";
import "./Countup.css";
import CountUpAnimation from "./CountUpAnimation";
export type DateTimeDisplayComponentTypes = {
  value: number;
  type: string;
};
export type ShowCounterComponentTypes = {
  className?: string;
};
export const ShowCounter: React.FC<ShowCounterComponentTypes> = ({
  className,
}) => {
  return (
    <div
      className={className}
      style={{ display: "inline-flex", padding: "1rem" }}
    ></div>
  );
};
export type CountupProps = {
  styles: React.CSSProperties;
  custom: {
    itemCount: number;
    duration: number;
    items: {
      coutUpTo: string;
      itemTitle: string;
    }[];
  };
  className?: string;
};
export const Countup = forwardRef<HTMLDivElement, CountupProps>(
  (props, ref) => {
    return (
      <div ref={ref} style={{ display: "inline-flex", ...props.styles }}>
        <CountUpAnimation
          value={props.custom.itemCount}
          duration={props.custom.duration}
        />
      </div>
    );
  }
);

export default Countup;
