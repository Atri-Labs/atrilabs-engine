import {
  gray100,
  gray200,
  gray400,
  gray500,
  gray800,
  agastyaLine,
  h5Heading,
  smallText,
} from "@atrilabs/design-system";
import { useCallback, useState, useEffect } from "react";
import { CssProprtyComponentType } from "../../types";
import { ReactComponent as DropDownArrow } from "../../assets/layout-parent/dropdown-icon.svg";
import { Input } from "../commons/Input";
import { AssetInputButton } from "@atrilabs/shared-layer-lib";
import { SizeInputWithUnits } from "../commons/SizeInputWithUnits";
import { ReactComponent as BRN } from "../../assets/background/none-icon.svg";
import { ReactComponent as BRR } from "../../assets/background/repeat-icon.svg";
import { ReactComponent as BRX } from "../../assets/background/repeat-x-icon.svg";
import { ReactComponent as BRY } from "../../assets/background/repeat-y-icon.svg";
import { ReactComponent as BRO } from "../../assets/background/round-icon.svg";
import { ReactComponent as BRS } from "../../assets/background/space-icon.svg";
import { ReactComponent as BAX } from "../../assets/background/fixed-icon.svg";
import { ReactComponent as BAY } from "../../assets/background/local-icon.svg";
import { ReactComponent as BAO } from "../../assets/background/scroll-icon.svg";
import { ReactComponent as BOX } from "../../assets/background/padding-box.svg";
import { ReactComponent as BOY } from "../../assets/background/content-box.svg";
import { ReactComponent as BOO } from "../../assets/background/border-box.svg";
import { ReactComponent as BCX } from "../../assets/background/padding-box-icon.svg";
import { ReactComponent as BCY } from "../../assets/background/content-box-icon.svg";
import { ReactComponent as BCO } from "../../assets/background/border-box-icon.svg";
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
    gridTemplateColumns: "4rem auto auto",
    textAlign: "left",
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
  typesContainer: {
    display: "grid",
    height: "100%",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingRight: "0.4rem",
    paddingLeft: "0.4rem",
    cursor: "pointer",
  },
};
export type backgroundTypeOptions = {
  image: boolean;
  position: boolean;
  repeat: boolean;
  attach: boolean;
  origin: boolean;
  clip: boolean;
  color: boolean;
};
export const solidBackgroundOptions: backgroundTypeOptions = {
  image: false,
  position: true,
  repeat: false,
  attach: true,
  origin: true,
  clip: true,
  color: true,
};
export const imageBackgroundOptions: backgroundTypeOptions = {
  image: true,
  position: true,
  repeat: true,
  attach: true,
  origin: true,
  clip: true,
  color: false,
};
const backgroundTypes = [solidBackgroundOptions, imageBackgroundOptions];
const backgroundRepeatValues = [
  "repeat",
  "repeat-x",
  "repeat-y",
  "space",
  "round",
  "no-repeat",
];
const backgroundAttachmentValues = ["local", "fixed", "scroll"];
const backgroundOriginValues = ["content-box", "padding-box", "border-box"];
const backgroundClipValues = [
  "content-box",
  "padding-box",
  "border-box",
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
      Math.ceil(convertedRgbValue.a * 100) - convertedRgbValue.a * 100 < 0.5
        ? (convertedRgbValue.a = Math.ceil(convertedRgbValue.a * 100))
        : (convertedRgbValue.a = Math.floor(convertedRgbValue.a * 100));

      return String(convertedRgbValue.a);
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
          backgroundColor:
            e.target.value !== ""
              ? handleOpacityChange(
                  String(Number(e.target.value) / 100),
                  String(props.styles.backgroundColor)
                )
              : handleOpacityChange(
                  String(e.target.value),
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
      if (opacityHelper(opacityValue) >= 1) {
        convertedRgbValue.a = 1;
      } else if (opacityHelper(opacityValue) < 0) {
        convertedRgbValue.a = 0;
      } else {
        convertedRgbValue.a = opacityHelper(opacityValue);
      }
      return rgb2hex(convertedRgbValue);
    },
    []
  );

  const opacityDisabledHandler = (bgColor: string) => {
    let bgFlag;
    bgColor === "undefined" ? (bgFlag = true) : (bgFlag = false);
    return bgFlag;
  };

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
  useEffect(() => {
    setIsOpacityDisabled(
      opacityDisabledHandler(String(props.styles.backgroundColor))
    );
  }, [props]);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number>(0);
  const [isOpacityDisabled, setIsOpacityDisabled] = useState<boolean>(
    opacityDisabledHandler(String(props.styles.backgroundColor))
  );

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
            ? { display: "flex", rowGap: "1rem", flexDirection: "column" }
            : { display: "none" }
        }
      >
        {/**Background Type */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={styles.optionName}>Type</span>
          <div
            style={{
              ...styles.typesContainer,
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div
              style={
                selectedTypeIndex === 0
                  ? {
                      ...styles.iconContainer,
                      borderRight: `1px solid ${agastyaLine}`,
                      background: gray800,
                    }
                  : {
                      ...styles.iconContainer,
                      borderRight: `1px solid ${agastyaLine}`,
                      background: gray500,
                    }
              }
              onClick={() => {
                setSelectedTypeIndex(0);
              }}
            >
              <BOX />
            </div>
            <div
              style={
                selectedTypeIndex === 1
                  ? {
                      ...styles.iconContainer,
                      background: gray800,
                    }
                  : {
                      ...styles.iconContainer,
                      background: gray500,
                    }
              }
              onClick={() => {
                setSelectedTypeIndex(1);
              }}
            >
              <BOY />
            </div>
          </div>
        </div>
        {/**Background Image */}
        {backgroundTypes[selectedTypeIndex].image && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={styles.optionName}>Image</span>
            <AssetInputButton
              onClick={onBackgroundImgeClickCb}
              assetName={props.styles.backgroundImage || "Select Image"}
              onClearClick={onBackgroundImageClearClickCb}
            />
          </div>
        )}
        {/**Background Color */}
        {backgroundTypes[selectedTypeIndex].color && (
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
                  disabled={isOpacityDisabled}
                  onChange={handleChange}
                  style={styles.inputContainerBox}
                  placeholder="100"
                />
                <div style={styles.inputSpan}>%</div>
              </div>
            </div>
          </div>
        )}
        {/**Background Position */}
        {backgroundTypes[selectedTypeIndex].position && (
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
        )}
        {/**Background Repeat */}
        {backgroundTypes[selectedTypeIndex].repeat && (
          <PropertyRender
            styleItem="backgroundRepeat"
            styleText="Repeat"
            styleArray={backgroundRepeatValues}
            patchCb={props.patchCb}
            styles={props.styles}
          >
            <BRR />
            <BRX />
            <BRY />
            <BRO />
            <BRS />
            <BRN />
          </PropertyRender>
        )}
        {/**Background Attach */}
        {backgroundTypes[selectedTypeIndex].attach && (
          <PropertyRender
            styleItem="backgroundAttachment"
            styleText="Attach"
            styleArray={backgroundAttachmentValues}
            patchCb={props.patchCb}
            styles={props.styles}
            defaultCSSIndex={2}
          >
            <BAY />
            <BAX />
            <BAO />
          </PropertyRender>
        )}
        {/**Background Origin */}
        {backgroundTypes[selectedTypeIndex].origin && (
          <PropertyRender
            styleItem="backgroundOrigin"
            styleText="Origin"
            styleArray={backgroundOriginValues}
            patchCb={props.patchCb}
            styles={props.styles}
            defaultCSSIndex={1}
          >
            <BOX />
            <BOY />
            <BOO />
          </PropertyRender>
        )}
        {/**Background Clip */}
        {backgroundTypes[selectedTypeIndex].clip && (
          <PropertyRender
            styleItem="backgroundClip"
            styleText="Cip"
            styleArray={backgroundClipValues}
            patchCb={props.patchCb}
            styles={props.styles}
            defaultCSSIndex={2}
          >
            <BCY />
            <BCX />
            <BCO />
            <div style={{ ...smallText, color: "white" }}>Text</div>
          </PropertyRender>
        )}
      </div>
    </div>
  );
};
