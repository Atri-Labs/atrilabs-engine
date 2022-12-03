import React, { forwardRef, useCallback } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import logo from "./logo.png";

export const Testimonial = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      isPaginated: boolean;
      testimonials: {
        name: string;
        designation: string;
        review: string;
        profile_pic: string;
      }[];
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
      className={props.className}
      style={props.styles}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.1em 0.1em 0",
          columnGap: "0.5em",
        }}
      >
        <div>
          <img src={logo} alt="Profile of reviewer" width="32em" />
        </div>
        <div>
          <h3 style={{ color: "#000000d9", fontSize: "1em" }}>Anonymous</h3>
          <p style={{ color: "#00000073", fontSize: "1em" }}>
            Chief Technology Officer, Anon
          </p>
        </div>
      </div>
      <div
        style={{
          padding: "0.1em 0.1em 0",
          color: "#000000d9",
          fontSize: "1em",
        }}
      >
        Fewer lines of code. Better code quality. Minimal learning curve.
      </div>
      <div
        style={{
          padding: "0.1em 0.1em 0",
          color: "#00000073",
          fontSize: "1em",
        }}
      >
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat
        repellat minus labore consequatur illum veritatis numquam iste placeat
        consequuntur soluta quidem ducimus, fugiat voluptates ab. Exercitationem
        velit soluta eum voluptas.
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
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    isPaginated: { type: "boolean" },
    testimonials: {
      type: "array_map",
      singleObjectName: "testimonial",
      attributes: [
        { type: "text", fieldName: "name" },
        { type: "text", fieldName: "designation" },
        { type: "text", fieldName: "review" },
        { type: "static_asset", fieldName: "profile_pic" },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Testimonial", category: "Basics" },
  render: {
    comp: Testimonial,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: {
          display: "inline-flex",
          flexDirection: "column",
          rowGap: "0.5em",
        },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          isPaginated: true,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {
      onClick: [{ sendEventData: true }],
    },
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Testimonial" } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "Testimonial",
      containerStyle: { padding: "1rem" },
    },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
