import { gray500, smallText } from "@atrilabs/design-system";
import { useMemo } from "react";
import { ReactComponent as Clear } from "../../assets/minus.svg";
export type ButtonInputComboProps = {
  assetName: string;
  onClick: () => void;
  onClearClick: () => void;
};

export const AssetInputButton: React.FC<ButtonInputComboProps> = (props) => {
  // strip url(" from start and ") from end
  const assetName = useMemo(() => {
    return props.assetName.replaceAll(/(^(url\(("|')?))|((("|')?\))$)/g, "");
  }, [props.assetName]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        columnGap: "0.5rem",
        justifyContent: "space-between",
        flexGrow: "1",
      }}
    >
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
          padding: "0 0.5rem",
        }}
        onClick={props.onClick}
      >
        <span style={{ ...smallText, color: "white" }}>{assetName}</span>
      </div>
      <div
        style={{
          backgroundColor: gray500,
          display: "flex",
          alignItems: "center",
          height: "1.5rem",
          padding: "0 4px",
        }}
        onClick={props.onClearClick}
      >
        <Clear />
      </div>
    </div>
  );
};
