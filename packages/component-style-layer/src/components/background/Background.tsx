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
  inputContainer: {
    display: "flex",
  },
  inputContainerBox: {
    ...smallText,
    outline: "none",
    color: gray100,
    padding: "3px",
    backgroundColor: gray800,
    width: "30px",
    border: "none",
    borderRadius: "2px 0 0 2px",
    lineHeight: "20px",
  },
  inputSpan: {
    ...smallText,
    color: gray400,
    backgroundColor: gray800,
    borderRadius: "0 2px 2px 0",
    display: "flex",
    alignItems: "center",
    paddingRight: "4px",
  },
};
const backgroundSizeValues = ["auto", "contain", "cover"];
const backgroundRepeatValues = [
  "repeat",
  "repeat-x",
  "repeat-y",
  "space",
  "round",
  "no-repeat",
];
const backgroundAttachmentValues = ["scroll", "fixed", "local"];
const backgroundOriginValues = ["padding-box", "content-box", "border-box"];
const backgroundClipValues = [
  "content-box",
  "border-box",
  "padding-box",
  "text",
];
export type Color = {
  hex: string;
  rgb: ColorRGB;
  hsv: ColorHSV;
};

export type ColorRGB = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type ColorHSV = {
  h: number;
  s: number;
  v: number;
  a?: number;
};

export const hex2rgb = (hex: Color["hex"]) => {
  hex = hex.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  let a = parseInt(hex.slice(6, 8), 16) || undefined;
  if (a) {
    a = a / 255;
  }
  return { r, g, b, a };
};

export const rgb2hex = ({ r, g, b, a }: Color["rgb"]) => {
  const hex = [r, g, b, a]
    .map((v, i) =>
      v !== undefined
        ? (i < 3 ? v : Math.round(v * 255)).toString(16).padStart(2, "0")
        : ""
    )
    .join("");
  return `#${hex}`;
};

export const Background: React.FC<CssProprtyComponentType> = (props) => {
  const getOpacityValue = (hex: Color["hex"]) => {
    let convertedRgbValue = hex2rgb(hex);
    if (convertedRgbValue.a) {
      return String(convertedRgbValue.a * 100);
    } else {
      return "100";
    }
  };
  const [showProperties, setShowProperties] = useState(true);
  const [opacityValue, setOpacityValue] = useState<string>(
    props.styles.backgroundColor
      ? getOpacityValue(props.styles.backgroundColor)
      : "100"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    parseInt(e.target.value) > 100
      ? setOpacityValue("100")
      : setOpacityValue(e.target.value);

    props.patchCb({
      property: {
        styles: {
          backgroundColor: handleOpacityChange(
            String(Number(e.target.value) / 100),
            String(props.styles.backgroundColor)
          ),
        },
      },
    });
  };

  const opacityHelper = (opacityValue: string) => {
    let opacityHelperValue;
    opacityValue === ""
      ? (opacityHelperValue = 100)
      : (opacityHelperValue = Number(opacityValue));
    return opacityHelperValue;
  };

  const handleOpacityChange = useCallback(
    (opacityValue: string, hex: Color["hex"]) => {
      let convertedRgbValue = hex2rgb(hex);
      if (opacityHelper(opacityValue) > 0) {
        convertedRgbValue.a = opacityHelper(opacityValue);
      } else if (opacityHelper(opacityValue) < 0) {
        convertedRgbValue.a = 0;
      } else {
        convertedRgbValue.a = 1;
      }
      return rgb2hex(convertedRgbValue);
    },
    []
  );

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
        {/* <PropertyRender
          styleItem="backgroundSize"
          styleText="Size"
          styleArray={backgroundSizeValues}
          patchCb={props.patchCb}
          styles={props.styles}
        >
          <p style={{ fontSize: " 9px", color: gray200 }}>Custom</p>
          <OFS />
          <OFH />
        </PropertyRender> */}
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
          <div style={{ width: "45px", marginRight: "10px" }}>
            <div style={styles.inputContainer}>
              <input
                type="text"
                value={opacityValue}
                onChange={handleChange}
                style={styles.inputContainerBox}
                placeholder="100"
              />
              <div style={styles.inputSpan}>%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
