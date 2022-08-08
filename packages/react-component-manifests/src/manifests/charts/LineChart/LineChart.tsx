import React, { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { LineChart as ToastLineChart, LineChartOptions } from "@toast-ui/chart";

export const LineChart = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: { animation?: boolean; spline?: boolean };
  }
>((props, ref) => {
  const chart = useRef<ToastLineChart | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const data = {
        series: [
          {
            name: "SiteA",
            data: [
              { x: 1, y: 202 },
              { x: 7, y: 350 },
              { x: 8, y: 213 },
              { x: 9, y: 230 },
              { x: 12, y: 230 },
            ],
          },
          {
            name: "SiteB",
            data: [
              { x: 1, y: 312 },
              { x: 3, y: 320 },
              { x: 7, y: 300 },
              { x: 9, y: 320 },
              { x: 13, y: 20 },
            ],
          },
        ],
      };
      const options: LineChartOptions = {
        series: {
          spline: props.custom.spline || false,
        },
        chart: {
          animation: props.custom.animation || false,
        },
      };
      if (chart.current) {
        chart.current.destroy();
      }
      const newchart = new ToastLineChart({
        el: containerRef.current,
        data,
        options,
      });
      chart.current = newchart;
    }
  }, [props.custom]);

  return (
    <div ref={ref} style={props.styles}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
});

export const DevLineChart: typeof LineChart = forwardRef((props, ref) => {
  props.custom.animation = false;
  const key = useMemo(() => {
    return `w${props.styles.width}h${props.styles.height}minW${props.styles.minWidth}minH${props.styles.minHeight}maxW${props.styles.maxWidth}maxH${props.styles.maxHeight}`;
  }, [
    props.styles.width,
    props.styles.height,
    props.styles.minWidth,
    props.styles.minHeight,
    props.styles.maxWidth,
    props.styles.maxHeight,
  ]);
  return <LineChart {...props} ref={ref} key={key} />;
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
    animation: "boolean",
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "LineChart", category: "Data" },
  render: {
    comp: LineChart,
  },
  dev: {
    comp: DevLineChart,
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          height: "400px",
          width: "400px",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {},
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {},
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "LineChart" } },
  drag: {
    comp: CommonIcon,
    props: { name: "LineChart", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
