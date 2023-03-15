import React, { forwardRef } from "react";
import { Carousel as AntdCarousel } from "antd";

export type CarouselEffect = "scrollx" | "fade";
export type DotPosition = "top" | "bottom" | "left" | "right";

const Carousel = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: { text: string; image?: string }[];
      effect?: CarouselEffect;
      dotPosition?: DotPosition;
      dots?:
        | boolean
        | {
            className?: string;
          };
      beforeChange?(currentSlide: number, nextSlide: number): void;
      afterChange?(currentSlide: number): void;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const { custom } = props;
  return (
    <div ref={ref}>
      <AntdCarousel
        className={props.className}
        {...custom}
      >
        {props.custom.items.map((item, index) => (
          <div key={index}>
            <h3
              style={
                item.image !== undefined || ""
                  ? {
                      ...props.styles, // Spread the existing styles
                      backgroundImage: `url(${item.image})`, // Add the image as the background
                      backgroundSize: "cover", // Set the background size to cover
                      backgroundPosition: "center", // Set the background position to center
                    }
                  : props.styles
              }
            >
              {item.text}
            </h3>
          </div>
        ))}
      </AntdCarousel>
    </div>
  );
});

export default Carousel;
