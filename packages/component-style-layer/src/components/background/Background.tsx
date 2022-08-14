import {
  gray100,
  gray200,
  gray400,
  gray800,
  h5Heading,
  smallText,
} from "@atrilabs/design-system";
import { useCallback, useState } from "react";
import { CssProprtyComponentType } from "../../types";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { BorderInput } from "../commons/BorderInput";
import { AssetInputButton } from "@atrilabs/shared-layer-lib";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    borderBottom: "1px solid #111827",
  },
  header: {
    ...h5Heading,
    color: gray200,
    display: "flex",
    marginTop: "10px",
    paddingBottom: "0.5rem",
    height: "25px",
    paddingLeft: "0.5rem",
    userSelect: "none",
  },
  inputBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    backgroundColor: gray800,
    width: "57px",
    height: "25px",
    border: "none",
    borderRadius: "2px",
  },
  drop: {
    display: "flex",
    alignItems: "baseline",
  },
  optionName: {
    ...smallText,
    width: "4rem",
    color: "white",
    lineHeight: "25px",
  },
  select: {
    textAlign: "left",
  },
  gridContainer: {
    ...smallText,
    color: gray400,
    display: "grid",
    gridTemplateColumns: "15px 60px 15px 60px",
    rowGap: "20px",
    textAlign: "center",
    columnGap: "15px",
    marginBottom: "25px",
  },
};

export const Background: React.FC<CssProprtyComponentType> = (props) => {
  const [showProperties, setShowProperties] = useState(true);
  const onBackgroundImgeClickCb = useCallback(() => {
    props.openAssetManager(["select", "upload"], "backgroundImage");
  }, [props]);
  const onBackgroundImageClearClickCb = useCallback(() => {
    props.patchCb({
      property: {
        styles: { backgroundImage: "" },
      },
    });
  }, [props]);
  return (
    <div style={styles.container}>
      <div style={styles.drop}>
        <DropDownArrow
          onClick={() => setShowProperties(!showProperties)}
          style={
            !showProperties
              ? { transform: "rotate(-90deg)" }
              : { transform: "rotate(0deg)" }
          }
        />
        <div style={styles.header}>Background</div>
      </div>
      <div
        style={
          showProperties
            ? { display: "flex", rowGap: "20px", flexDirection: "column" }
            : { display: "none" }
        }
      >
        {/**Background Image */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={styles.optionName}>Image</span>
          <AssetInputButton
            onClick={onBackgroundImgeClickCb}
            assetName={props.styles.backgroundImage || "Select Image"}
            onClearClick={onBackgroundImageClearClickCb}
          />
        </div>
        {/**Background Color */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={styles.optionName}>Color</span>
          <div
            onClick={() => {
              props.openPalette("backgroundColor", "Background Color");
            }}
            style={{ width: "55px", marginRight: "10px" }}
          >
            <BorderInput
              styleItem="color"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
