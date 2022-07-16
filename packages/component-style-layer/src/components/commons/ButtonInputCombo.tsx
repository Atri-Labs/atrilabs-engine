import { gray500, smallText } from "@atrilabs/design-system";
import { useMemo } from "react";

export type ButtonInputComboProps = {
  assetName: string;
  onClick: () => void;
};

export const AssetInputButton: React.FC<ButtonInputComboProps> = (props) => {
  // strip url(" from start and ") from end
  const assetName = useMemo(() => {
    return props.assetName.replaceAll(/(^(url\(("|')?))|((("|')?\))$)/g, "");
  }, [props.assetName]);
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
      onClick={props.onClick}
    >
      <span style={{ ...smallText, color: "white" }}>{assetName}</span>
    </div>
  );
};
