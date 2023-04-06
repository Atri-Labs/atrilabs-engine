import { gray700, gray900, smallText } from "@atrilabs/design-system";

export type DragTemplateCompType = {
  text: string;
};

export const DragTemplateComp: React.FC<DragTemplateCompType> = (props) => {
  return (
    <div
      style={{
        border: `1px solid ${gray900}`,
        padding: "0.5rem",
        background: `${gray700}`,
        ...smallText,
        fontSize: "12px",
        color: "white",
      }}
    >
      {props.text}
    </div>
  );
};
