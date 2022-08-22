import { gray400, gray800, smallText } from "@atrilabs/design-system";
import React, { useMemo } from "react";
import { TemplateComponents } from "../types";
import { formatTemplatename } from "../utils";
import { ReactComponent as Trash } from "../assets/trash.svg";

function getNode(templateComponents: TemplateComponents, parentId: string) {
  const nodes: React.ReactNode[] = [];
  templateComponents[parentId].children
    ?.sort((a, b) => {
      return a.index - b.index;
    })
    .forEach(({ id }) => {
      const FC = templateComponents[id].FC;
      const props = templateComponents[id].props;
      const acceptsChildren = templateComponents[id].acceptsChildren;
      const children = acceptsChildren
        ? getNode(templateComponents, id)
        : undefined;
      nodes.push(<FC {...props} key={id} children={children} />);
    });
  return nodes;
}

export const TemplateRenderer: React.FC<{
  templateName: string;
  templateComponents: TemplateComponents;
  styles?: React.CSSProperties;
  onDeleteClicked: (templateName: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}> = ({
  templateComponents,
  styles,
  templateName,
  onDeleteClicked,
  onMouseDown,
}) => {
  const nodes = useMemo(() => {
    if (templateComponents["templateRoot"] === undefined) {
      return null;
    }
    return getNode(templateComponents, "templateRoot");
  }, [templateComponents]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        rowGap: "10px",
        paddingBottom: "10px",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        borderBottom: `1px solid ${gray800}`,
      }}
    >
      <div
        style={{
          width: "13rem",
          height: "8rem",
          ...styles,
        }}
        onMouseDown={onMouseDown}
      >
        {nodes}
      </div>
      <div
        style={{
          ...smallText,
          color: gray400,
          fontSize: "12px",
          justifyContent: "space-between",
          display: "flex",
        }}
      >
        <div>{formatTemplatename(templateName)}</div>
        <div
          onClick={() => {
            onDeleteClicked(templateName);
          }}
        >
          <Trash />
        </div>
      </div>
    </div>
  );
};
