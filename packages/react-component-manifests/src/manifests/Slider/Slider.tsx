import React, { forwardRef, useCallback, useState, useEffect } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import "./Slider.css";

export const Slider = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      value: number;
      startValue: number;
      endValue: number;
      width: number;
    };
    onChange: (value: string) => void;
  }
>((props, ref) => {
  const [startPosition, setStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [finishPosition, setFinishPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [thumbPosition, setThumbPosition] = useState("0%");
  const [value, setValue] = useState(0);

  const onChange = useCallback(() => {
    props.onChange(String(value));
  }, [props, value]);

  const getPosition = (e: any) => {
    const obj = e;
    return { pageX: obj.pageX, pageY: obj.pageY };
  };
  const handleMouseMove = (e: MouseEvent) => {
    const { pageX, pageY } = getPosition(e);
    setCurrentPosition({ ...currentPosition, x: pageX, y: pageY });
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    const { pageX, pageY } = getPosition(e);
    setStartPosition((prev) => {
      return { ...prev, x: pageX, y: pageY };
    });
    document.addEventListener("mousemove", (e) => handleMouseMove(e), true);
    document.addEventListener("mouseup", (e) => handleThumbMouseUp(e), true);
  };

  const handleThumbMouseUp = (e: MouseEvent) => {
    const { pageX, pageY } = getPosition(e);
    setFinishPosition((prev) => {
      return { ...prev, x: pageX, y: pageY };
    });
    setFinalvalue();
    document.removeEventListener("mousemove", handleMouseMove, true);
  };

  const setFinalvalue = () => {
    let difference = props.custom.value + (finishPosition.x - startPosition.x);
  };

  useEffect(() => {
    const updateThumbPosition = (diff: number) => {
      let offset = props.custom.width / 100;
      let moveValue = diff / offset;
      if (moveValue + props.custom.value > 100) {
        moveValue = 100 - props.custom.value;
      }
      if (moveValue + props.custom.value < 0) {
        moveValue = 0 - props.custom.value;
      }
      setThumbPosition(`${moveValue + props.custom.value}%`);
      return moveValue;
    };

    const calculateValue = (diff: number) => {
      let moveValue =
        (diff / props.custom.width) *
        (props.custom.endValue - props.custom.startValue);
      moveValue = Math.floor(moveValue);
      moveValue = moveValue + props.custom.value;
      if (moveValue > props.custom.endValue) {
        moveValue = props.custom.endValue;
      }
      if (moveValue < props.custom.startValue) {
        moveValue = props.custom.startValue;
      }
      setValue(moveValue);
    };
    let currDiff = currentPosition.x - startPosition.x;
    updateThumbPosition(currDiff);
    calculateValue(currDiff);
  }, [
    currentPosition,
    startPosition.x,
    finishPosition.x,
    props.custom.endValue,
    props.custom.startValue,
    props.custom.width,
    props.custom.value,
  ]);

  return (
    <div ref={ref} style={props.styles} onChange={onChange}>
      <div
        className="slider-parent"
        style={{ width: `${props.custom.width}px` }}
      >
        <div className="slider-rail"></div>
        <div className="slider-progress" style={{ width: thumbPosition }}></div>
        <div
          className="slider-thumb"
          style={{ left: thumbPosition }}
          onMouseDown={(e) => handleThumbMouseDown(e)}
        ></div>
      </div>
    </div>
  );
});

const cssTreeOptions: CSSTreeOptions = {
  flexContainerOptions: false,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  backgroundOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    startValue: "number",
    endValue: "number",
    value: "number",
    width: "number",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Slider", category: "Basics" },
  render: {
    comp: Slider,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {},
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          startValue: 0,
          endValue: 100,
          value: 50,
          width: 400,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
      onFinish: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Slider" } },
  drag: {
    comp: CommonIcon,
    props: { name: "Slider", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
