import { gray300, gray900, smallText } from "@atrilabs/design-system";
import { useMemo } from "react";
import { ReactComponent as Clear } from "../../assets/minus.svg";
import { ReactComponent as FileUploadIcon } from "../../assets/file-upload.svg";
export type ButtonInputComboProps = {
  assetName: string;
  onClick: () => void;
  onClearClick: () => void;
  hideClear?: boolean;
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
        columnGap: "0.25rem",
        justifyContent: "space-between",
        flexGrow: "1",
      }}
    >
      <div
        style={{
          backgroundColor: gray900,
          height: "1.5rem",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          flexGrow: 1,
          borderRadius: "4px",
          cursor: "pointer",
          userSelect: "none",
          padding: "0 0.5rem",
        }}
        onClick={props.onClick}
      >
        <FileUploadIcon />
        <span style={{ ...smallText, color: "white" }}>
          {assetName.split(/(\\+)|(\/+)/).at(-1)}
        </span>
      </div>
      {props.hideClear ? null : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "1.5rem",
            padding: "0 4px",
            color: gray300,
            fontSize: "12px",
          }}
          onClick={props.onClearClick}
        >
          <Clear />
        </div>
      )}
    </div>
  );
};
