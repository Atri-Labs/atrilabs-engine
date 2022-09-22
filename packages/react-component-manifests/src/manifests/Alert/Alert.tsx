import { CSSTreeOptions } from '@atrilabs/app-design-forest/lib/cssTree';
import React from 'react'
import forwardRef from 'react';
import { CustomPropsTreeOptions } from '@atrilabs/app-design-forest/lib/customPropsTree';
import { ReactComponentManifestSchema } from '@atrilabs/react-component-manifest-schema/lib/types';
import CSSTreeId from '@atrilabs/app-design-forest/lib/cssTree?id';
import CustomTreeId from '@atrilabs/app-design-forest/lib/customPropsTree?id';
import { CommonIcon } from '../CommonIcon';
import iconSchemaId from '@atrilabs/component-icon-manifest-schema?id';
import reactSchemaId from '@atrilabs/react-component-manifest-schema?id';
import "./Alert.css"

export type AlertProps = {
    styles: React.CSSProperties;
    custom: {
      title: string;
      description?: string;
      statusIcon?: string;
    };
  };

  export const Alert: React.FC<AlertProps> = React.forwardRef((props, ref) => {
    return <div ref={ref} className="alert" style={props.styles}>
        {props.custom.statusIcon && <img src={props.custom.statusIcon} alt="" className='alert__statusIcon'/>}
        <div className="alert-content">
            <div className="alert-title">{props.custom.title}</div>
            {props.custom.description}
        </div>
    </div>;
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
                initialValue: {
                    backgroundColor: "rgb(230,247,255)",
                    border: "2px solid rgb(156,217,255)",
                },
                treeOptions: cssTreeOptions,
                canvasOptions: { groupByBreakpoint: true },
            },
            custom: {
                treeId: CustomTreeId,
                initialValue: {
                    title: 'Title ',
                    description: "Description",
                    value: "",
                    placeholder: "Placeholder Text",
                },
                treeOptions: customTreeOptions,
                canvasOptions: { groupByBreakpoint: false },
            },
        },
        attachCallbacks: {
            onChange: [{ type: "controlled", selector: ["custom", "value"] }],
            onPressEnter: [{ type: "do_nothing" }],
        },
        defaultCallbackHandlers: {},
    },
};

const iconManifest = {
    panel: { comp: CommonIcon, props: { name: "Alert" } },
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
