import { forwardRef, useCallback, useMemo } from "react";
import { CarouselItem, CarouselWrapper } from "./Carousel";

export const DevCarousel = forwardRef<
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
  const items = useMemo(() => {
    if (props.custom.items.length === 0)
      return [{ text: "Sample Text", image: "" }];
    return props.custom.items;
  }, [props.custom.items]);

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
      >
        {items.map((item, index) => (
          <CarouselItem
            width="100%"
            height="100%"
            key={index}
            backgroundImage={item.image || ""}
          >
            {item.text ? item.text : "Sample Text"}
          </CarouselItem>
        ))}
      </CarouselWrapper>
    </div>
  );
});

export default DevCarousel;
