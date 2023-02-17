import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

function isStringANumber(value: string) {
  return value.match(/^[0-9]+$/) === null ? false : true;
}

export enum ThumbVariant {
  FILLED = "filled",
  OUTLINED = "outlined", 
}

const Slider = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      value?: number;
      maxValue?: number;
      minValue?: number;
      thickness?: string;
      radius?: string;
      trackColor?: string;
      thumbColor?: string;
      selectColor?: string;
      thumbVariant?: ThumbVariant;
    };
    onChange?: (value: number) => void;
    onFinish?: (value: number) => void;
    className?: string;
  }
>((props, ref) => {
  const {
    maxValue = 100,
    minValue = 0,
    thickness = "4px",
    radius = "5px",
    trackColor = "#CCC",
    thumbColor = "#91d5ff",
    selectColor = "#91d5ff",
    thumbVariant = ThumbVariant.FILLED,
   } = props.custom;

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(props.custom.value || 100);

  const valueRange = useMemo(() => {
    return maxValue - minValue;
  }, [minValue, maxValue]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (trackRef.current) {
        const scale =
          valueRange / trackRef.current.getBoundingClientRect().width;
        const upperLimit =
          trackRef.current.getBoundingClientRect().left +
          trackRef.current.getBoundingClientRect().width;
        const lowerLimit = trackRef.current.getBoundingClientRect().left;
        const initialValue = value;
        const startPostion = { x: e.pageX, y: e.pageY };
        const onMouseMove = (e: MouseEvent) => {
          if (startPostion) {
            if (e.pageX >= upperLimit) {
              setValue(maxValue);
              props.onChange?.(maxValue);
            } else if (e.pageX <= lowerLimit) {
              setValue(minValue);
              props.onChange?.(minValue);
            } else {
              const delta = e.pageX - startPostion.x;
              const finalValue = initialValue + delta * scale;
              if (finalValue <= maxValue && finalValue >= minValue) {
                setValue(finalValue);
                props.onChange?.(finalValue);
              }
            }
          }
        };
        const onMouseUp = () => {
          // unsubscribe
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
          const delta = e.pageX - startPostion.x;
          const finalValue = initialValue + delta * scale;
          props.onFinish?.(finalValue);
        };
        // subscribe
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }
    },
    [value, props, maxValue, minValue, valueRange]
  );

  const onTrackClicked = useCallback(
    (e: React.MouseEvent) => {
      console.log("onTrack");
      const scale =
        valueRange / (trackRef.current?.getBoundingClientRect().width || 1);
      const lowerLimit = trackRef.current?.getBoundingClientRect().left || 0;
      const finalValue = minValue + (e.pageX - lowerLimit) * scale;
      props.onChange?.(finalValue);
      props.onFinish?.(finalValue);
    },
    [valueRange, props, minValue]
  );

  return (
    <>
      <style>
        {`
          .slide-thumb .thumb-value {
            opacity: 0;
            position: absolute;
            top: -32px;
            left: 50%;
            transform: translate(-50%, 0);
            background: white;
            border: 1px solid #91d5ff;
            padding: 3px;
            border-radius: 5px;
            user-select: none;
            transition: all 0.3s;
          }
          .slide-thumb:hover .thumb-value, 
          .slide-thumb:active .thumb-value {
            opacity: 1;
          }
          `}
      </style>
      <div
        className={props.className}
        ref={ref}
        style={{
          ...props.styles,
          position: "relative",
          display: "inline-block",
          height: `calc(2 * ${radius})`,
          marginLeft: "20px",
        }}
      >
        {/** track */}
        <div
          style={{
            height: thickness,
            backgroundColor: trackColor,
            position: "relative",
            top: "50%",
            transform: "translate(0px, -50%)",
            // center of thumb should match the starting point of track
            width: `calc(100% - 2 * ${radius})`,
            left: 0,
          }}
          ref={trackRef}
          onClick={onTrackClicked}
        ></div>
        {/** selected track */}
        <div
          style={{
            height: thickness,
            backgroundColor: selectColor,
            position: "absolute",
            top: "50%",
            transform: "translate(0px, -50%)",
            // center of thumb should match the starting point of track
            width: `calc(${((value - minValue) / valueRange) * 100}% - 2 * ${radius})`,
            left: 0,
          }}
          onClick={onTrackClicked}
        ></div>
        {/** thumb */}
        <div
          className="slide-thumb outline"
          ref={thumbRef}
          style={{
            position: "absolute",
            left: `calc(${((value - minValue) / valueRange) * 100}% - 2 * ${radius})`,
            height: `calc(2 * ${radius})`,
            width: `calc(2 * ${radius})`,
            backgroundColor:((thumbVariant === ThumbVariant.OUTLINED) ? '#fff' : thumbColor),
            top: "50%",
            transform: `translate(0px, -50%)`,
            borderRadius: "50%",
            // Outline :
            border: `3px solid ${thumbColor}`,
          }}
          onMouseDown={onMouseDown}
        >
          <span className="thumb-value">{Math.round(value)}</span>
        </div>
      </div>
    </>
  );
});

export default Slider;


// Slider.defaultProps = {
//   custom: {
//     value: 50,
//     maxValue: 100,
//     minValue: 0,
//     thickness: "4px",
//     radius: "8px",
//     trackColor: "#CCC",
//     thumbColor: "#91d5ff",
//     selectColor: "#91d5ff",
//   },
// };
