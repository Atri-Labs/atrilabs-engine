import React from "react";
import { useState, useEffect, forwardRef, useCallback } from "react";

export enum TransitionEffect {
  SCROLLX = "scrollx",
  FADE = "fade",
}

export enum ScrollingOption {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
}

export type CarouselItemTypes = {
  children: string;
  width?: string;
  opacity?: string;
  height?: string;
  effect?: TransitionEffect;
  backgroundImage?: string;
};

export type CarouseWrapperTypes = {
  children: any;
  startTile?: number;
  isCircle?: boolean;
  indicatorPosition?: string;
  scrollingOption?: ScrollingOption;
};

export const CarouselItem: React.FC<CarouselItemTypes> = ({
  children,
  width,
  height,
  effect,
  opacity,
  backgroundImage,
}) => {
  return (
    <div
      style={{
        width: width,
        opacity: effect === TransitionEffect.FADE ? opacity : "",
        backgroundImage: `url(
          ${backgroundImage}
          )`,
        backgroundSize: "cover",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: height,
        backgroundColor: "#364d79",
        color: "#fff",
        transition:
          effect === TransitionEffect.FADE ? "opacity 0.3s ease-in" : "none",
      }}
    >
      {children}
    </div>
  );
};

export const CarouselWrapper: React.FC<CarouseWrapperTypes> = ({
  children,
  startTile,
  isCircle,
  indicatorPosition,
  scrollingOption,
}) => {
  const [activeIndex, setActiveIndex] = useState(
    (startTile && startTile > 0) ? startTile - 1 : 0
  );
  const [paused, setPaused] = useState(false);

  const updateIndex = (newIndex: number) => {
    if (newIndex < 0) {
      newIndex = React.Children.count(children) - 1;
    } else if (newIndex >= React.Children.count(children)) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  };
console.log("activeIndex",activeIndex)
  useEffect(() => {
    if (scrollingOption === ScrollingOption.MANUAL) return;
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1);
      }
    }, 3000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  });

  return (
    <div
      style={{ overflow: "hidden", height: "100%" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
          whiteSpace: "nowrap",
          height: "100%",
        }}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            width: "100%",
            height: "100%",
            opacity: `${activeIndex === index ? 1 : 0}`,
            className: `${
              activeIndex === index ? "carousel-active-slide" : ""
            }`,
          });
        })}
      </div>
      {!isCircle && (
        <div
          style={
            indicatorPosition === "Top"
              ? {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                  bottom: "95%",
                }
              : indicatorPosition === "Left"
              ? {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                  bottom: "50%",
                  left: "-45%",
                  transform: "rotate(90deg)",
                }
              : indicatorPosition === "Right"
              ? {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                  bottom: "50%",
                  left: "45%",
                  transform: "rotate(270deg)",
                }
              : {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                  bottom: "10%",
                }
          }
        >
          {React.Children.map(children, (child, index) => {
            return (
              <button
                style={
                  index === activeIndex
                    ? {
                        margin: "5px",
                        border: "none",
                        width: "40px",
                        position: "relative",
                        zIndex: "1",
                        height: "3px",
                        transition: "width 0.3s ease-in",
                        cursor: "pointer",
                        borderRadius: "1px",
                      }
                    : {
                        margin: "5px",
                        border: "none",
                        width: "20px",
                        position: "relative",
                        zIndex: "1",
                        height: "3px",
                        transition: "width 0.3s ease-in",
                        backgroundColor: "#687FAB",
                        cursor: "pointer",
                        borderRadius: "1px",
                      }
                }
                onClick={() => updateIndex(index)}
              ></button>
            );
          })}
        </div>
      )}
      {isCircle && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {React.Children.map(children, (child, index) => {
            return (
              <button
                style={
                  index === activeIndex
                    ? {
                        margin: "5px",
                        border: "none",
                        width: "12px",
                        marginTop: "-20px",
                        position: "relative",
                        zIndex: "1",
                        height: "12px",
                        transition: "width 0.3s ease-in",
                        borderRadius: "50%",
                        backgroundColor: "#222",
                        cursor: "pointer",
                      }
                    : {
                        margin: "5px",
                        border: "none",
                        width: "12px",
                        marginTop: "-20px",
                        position: "relative",
                        zIndex: "1",
                        height: "12px",
                        transition: "width 0.3s ease-in",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }
                }
                onClick={() => {
                  updateIndex(index);
                }}
              ></button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Carousel = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      items: { text: string; image?: string }[];
      startTile: number;
      isIndicatorCircle: boolean;
      indicatorPosition: string;
    };
    onClick: (event: { pageX: number; pageY: number }) => void;
    className?: string;
  }
>((props, ref) => {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      props.onClick({ pageX: e.pageX, pageY: e.pageY });
    },
    [props]
  );
  return (
    <div
      ref={ref}
      style={props.styles}
      onClick={onClick}
      className={props.className}
    >
      <CarouselWrapper
        startTile={props.custom.startTile}
        isCircle={props.custom.isIndicatorCircle}
        indicatorPosition={props.custom.indicatorPosition}
      //  scrollingOption={ScrollingOption.MANUAL}
      >
        {props.custom.items.map((item, index) => (
          <CarouselItem
            width="100%"
            height="100%"
            key={index}
            backgroundImage={item.image || ""}
            effect={TransitionEffect.FADE}
          >
            {item.text ? item.text : "Sample Text"}
          </CarouselItem>
        ))}
      </CarouselWrapper>
    </div>
  );
});
export default Carousel;
