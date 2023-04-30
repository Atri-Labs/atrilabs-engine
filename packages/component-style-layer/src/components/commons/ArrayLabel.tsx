import {gray100, smallText} from "@atrilabs/design-system";
import {ReactComponent as AddIcon} from "../../assets/add.svg";

export const ArrayLabel: React.FC<{ name: string; onAddClick: () => void }> = (
  props
) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "1em",
        paddingRight: "1em",
      }}
    >
      <div style={{
        ...smallText,
        color: gray100,
        backgroundColor: "transparent",
      }}>{props.name}</div>
      <div onClick={props.onAddClick}>
        <AddIcon style={{position: "relative", right: "-2.5px"}}/>
      </div>
    </div>
  );
};
