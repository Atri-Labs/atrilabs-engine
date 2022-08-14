import { smallText } from "@atrilabs/design-system";
import { ReactComponent as AddIcon } from "../../assets/add.svg";

export const ArrayLabel: React.FC<{ name: string; onAddClick: () => void }> = (
  props
) => {
  return (
    <div
      style={{
        ...smallText,
        color: "white",
        fontSize: "14px",
        lineHeight: "16px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ overflow: "hidden" }}>{props.name}</div>
      <div onClick={props.onAddClick}>
        <AddIcon style={{ position: "relative", right: "-2.5px" }} />
      </div>
    </div>
  );
};
