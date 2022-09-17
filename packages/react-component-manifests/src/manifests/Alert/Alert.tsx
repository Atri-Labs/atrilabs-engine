import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema/lib/types";
import { Alert as AlertInternalImplementation, AlertTitle } from "@mui/material";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import React, { useCallback } from "react";
import { CommonIcon } from "../CommonIcon";

export const Alert = React.forwardRef<HTMLDivElement, {
	styles: React.CSSProperties,
	custom: {
		title: string,
		description?: string,
		statusIcon?: string
	},
}>((props, ref) => {
  return <div 
		ref={ref}
		style={props.styles}
		>
		  <AlertInternalImplementation icon={props.custom.statusIcon}>
				<AlertTitle>{props.custom.title}</AlertTitle>
				{props.custom.description}
			</AlertInternalImplementation>
		</div>
})

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
	  title: "text",
	  description: "text",
	  statusIcon: "static_asset",
	},
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Alert", category: "Basics" },
  render: {
    comp: Alert,
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
          text: "Hello World",
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {},
    defaultCallbackHandlers: {},
  },
};


const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "Alert"} },
  drag: {
    comp: CommonIcon,
    props: { name: "Alert", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
