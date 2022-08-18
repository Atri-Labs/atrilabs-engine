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
import { Input } from "../commons/Input";
import { AssetInputButton } from "@atrilabs/shared-layer-lib";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";
import { ReactComponent as OFA } from "../../assets/size/Auto.svg";
import { ReactComponent as OFH } from "../../assets/size/overflow-hidden.svg";
import { ReactComponent as OFS } from "../../assets/size/overflow-scroll.svg";
import { ReactComponent as OFV } from "../../assets/size/overflow-visible.svg";
import PropertyRender from "../commons/PropertyRender";

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
    gridTemplateColumns: "60px 60px 60px",
    textAlign: "left",
    columnGap: "15px",
    marginBottom: "25px",
  },
};
const backgroundSizeValues = ["custom", "cover", "contain"];
const backgroundRepeatValues = [
  "repeat",
  "repeat-x",
  "repeat-y",
  "space",
  "round",
  "no-repeat",
];
const backgroundAttachmentValues = ["fixed", "scroll", "local"];
const backgroundOriginValues = ["content-box", "padding-box", "border-box"];
const backgroundClipValues = [
  "content-box",
  "padding-box",
  "border-box",
  "text",
];

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
            ? { display: "flex", rowGap: "10px", flexDirection: "column" }
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
        <div style={styles.gridContainer}>
          <div>&nbsp;</div>
          <div>Top</div>
          <div>Right</div>
          <div style={styles.optionName}>Position</div>
          <div>
            <SizeInputWithUnits
              styleItem="backgroundPositionY"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
          </div>
          <div>
            <SizeInputWithUnits
              styleItem="backgroundPositionX"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
            />
          </div>
        </div>
        <PropertyRender
          styleItem="backgroundSize"
          styleText="Size"
          styleArray={backgroundSizeValues}
          patchCb={props.patchCb}
          styles={props.styles}
        >
          <OFV />
          <OFS />
          <OFH />
        </PropertyRender>
        <PropertyRender
          styleItem="backgroundRepeat"
          styleText="Repeat"
          styleArray={backgroundRepeatValues}
          patchCb={props.patchCb}
          styles={props.styles}
        >
          <OFV />
          <OFS />
          <OFH />
          <OFV />
          <OFS />
          <OFH />
        </PropertyRender>
        <PropertyRender
          styleItem="backgroundAttachment"
          styleText="Attach"
          styleArray={backgroundAttachmentValues}
          patchCb={props.patchCb}
          styles={props.styles}
        >
          <OFV />
          <OFS />
          <OFH />
        </PropertyRender>
        <PropertyRender
          styleItem="backgroundOrigin"
          styleText="Origin"
          styleArray={backgroundOriginValues}
          patchCb={props.patchCb}
          styles={props.styles}
        >
          <OFV />
          <OFS />
          <OFH />
        </PropertyRender>
        <PropertyRender
          styleItem="backgroundClip"
          styleText="Cip"
          styleArray={backgroundClipValues}
          patchCb={props.patchCb}
          styles={props.styles}
        >
          <OFV />
          <OFS />
          <OFH />
          <OFS />
        </PropertyRender>

        {/**Background Color */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={styles.optionName}>Color</span>
          <div
            onClick={() => {
              props.openPalette("backgroundColor", "Background Color");
            }}
            style={{ width: "55px", marginRight: "10px" }}
          >
            <Input
              styleItem="backgroundColor"
              styles={props.styles}
              patchCb={props.patchCb}
              defaultValue=""
              parseToInt={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
