import React, { forwardRef, useState } from "react";
import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import type {
  AcceptsChildFunction,
  ReactComponentManifestSchema,
} from "@atrilabs/react-component-manifest-schema";
import { flexColSort } from "@atrilabs/react-component-manifest-schema";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";
import CSSTreeId from "@atrilabs/app-design-forest/lib/cssTree?id";
import CustomTreeId from "@atrilabs/app-design-forest/lib/customPropsTree?id";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest/lib/customPropsTree";
import { ArrowDown, ArrowUp, MenuItemsMap } from "./components";
import { ReactComponent as Icon } from "./icon.svg";

export const VerticalMenu = forwardRef<
  HTMLDivElement,
  {
    styles: React.CSSProperties;
    custom: {
      title: string;
      menuItems: {
        name: string;
        subMenuItems?: {
          subMenuItemsName: string;
          subMenu?: {
            itemsName: string;
          }[];
        }[];
      }[];
    };
    className?: string;
    onClick: (menuItem: { name: string }) => void;
  }
>((props, ref) => {
  const { title, menuItems } = props.custom;
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };
  return (
    <div
      ref={ref}
      style={{ ...props.styles, position: "relative" }}
      className={props.className}
    >
      <span
        style={{
          display: "flex",
          // justifyContent: "space-between",
          alignItems: "center",
          columnGap: ".25rem",
        }}
      >
        <p>{title}</p>
        <span onClick={toggleMenu}>
          {!showMenu ? <ArrowDown /> : <ArrowUp />}
        </span>
      </span>
      {/* render menu items */}
      {showMenu && (
        <main
          style={{
            marginLeft: "1.2rem",
          }}
        >
          <MenuItemsMap menuAray={menuItems} onClick={props.onClick} />
        </main>
      )}
    </div>
  );
});

const acceptsChild: AcceptsChildFunction = (info: any) => {
  if (info.childCoordinates.length === 0) {
    return 0;
  }
  return flexColSort(info.loc, info.childCoordinates) || 0;
};

const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
  flexContainerOptions: true,
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
    menuItems: {
      type: "array_map",
      singleObjectName: "item",
      attributes: [
        {
          fieldName: "name",
          type: "text",
        },
      ],
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "VerticalMenu", category: "Basics" },
  render: {
    comp: VerticalMenu,
  },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { display: "inline-block", position: "relative" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          title: "Navigation",
          menuItems: [
            {
              name: "Submenu One",
            },
            {
              name: "Submenu Two",
            },
            {
              name: "Submenu Three",
              subMenuItems: [
                {
                  subMenuItemsName: "submenu three item #1",
                },
                {
                  subMenuItemsName: "submenu three item #2",
                },
                {
                  subMenuItemsName: "submenu three item #3",
                },
              ],
            },
          ],
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onClick: [{ type: "controlled", selector: ["custom", "open"] }],
    },
    defaultCallbackHandlers: {},
    acceptsChild,
  },
};

const iconManifest = {
  panel: { comp: CommonIcon, props: { name: "VerticalMenu", svg: Icon } },
  drag: {
    comp: CommonIcon,
    props: {
      name: "VerticalMenu",
      containerStyle: { padding: "1rem" },
      svg: Icon,
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
