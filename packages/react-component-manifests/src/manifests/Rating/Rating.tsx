import React, { forwardRef } from "react";
import { RatingContainer } from "./RatingContainer";

const Rating = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      total: number;
      rating: number;
      unratedColor: string;
      ratedColor: string;
    };
    className?: string;
  }
>((props, ref) => {
  return (
    <div ref={ref} className={props.className} style={props.styles}>
      <RatingContainer {...props.custom} />
    </div>
  );
});

export default Rating;
