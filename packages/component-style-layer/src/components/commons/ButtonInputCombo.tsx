import { gray500, smallText } from "@atrilabs/design-system";

export type ButtonInputComboProps = {
  assetName: string;
  onClick: () => void;
};

export const AssetInputButton: React.FC<ButtonInputComboProps> = (props) => {
  return (
    <div
      style={{
        backgroundColor: gray500,
        height: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
        borderRadius: "4px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span style={{ ...smallText, color: "white" }} onClick={props.onClick}>
        {props.assetName}
      </span>
    </div>
  );
};
