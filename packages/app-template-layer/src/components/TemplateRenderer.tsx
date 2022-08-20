import { useMemo } from "react";
import { TemplateComponents } from "../types";

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
      console.log(children);
      nodes.push(<FC {...props} key={id} children={children} />);
    });
  return nodes;
}

export const TemplateRenderer: React.FC<{
  templateComponents: TemplateComponents;
}> = ({ templateComponents }) => {
  const nodes = useMemo(() => {
    if (templateComponents["templateRoot"] === undefined) {
      return null;
    }
    return getNode(templateComponents, "templateRoot");
  }, [templateComponents]);
  return (
    <div
      style={{
        width: "12rem",
        height: "8rem",
        margin: "0 auto",
      }}
    >
      {nodes}
    </div>
  );
};
