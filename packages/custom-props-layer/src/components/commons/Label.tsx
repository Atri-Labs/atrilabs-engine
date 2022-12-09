import { smallText } from "@atrilabs/design-system";

export const Label: React.FC<{ name: string }> = (props) => {
  return (
    <div
      style={{
        ...smallText,
        color: "white",
        minWidth: "4rem",
        // maxWidth: "4rem",
        overflow: "hidden",
        boxSizing: "border-box",
        marginRight: "0.5rem",
        fontSize: "14px",
        lineHeight: "16px",
      }}
    >
      {props.name}
    </div>
  );
};
