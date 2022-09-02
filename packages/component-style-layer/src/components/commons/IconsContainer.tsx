import { agastyaLine, gray500, gray800 } from "@atrilabs/design-system";
import React from "react";
import "./IconsContainer.css";

export type IconsContainerProps = {
  children: React.ReactNode[];
  selectedIndex: number;
  setSelectedIndexCb: (index: number) => void;
  styleArray: (string | number)[];
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "grid",
    height: "100%",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
};

function repeatStringWithSpace(str: string, num: number) {
  if (num === 0) {
    return "";
  }
  let result = str;
  for (let i = 0; i < num - 1; i++) {
    result += ` ${str}`;
  }
  return result;
}

export const IconsContainer: React.FC<IconsContainerProps> = (props) => {
  return (
    <div
      style={{
        ...styles.container,
        gridTemplateColumns: repeatStringWithSpace(
          "1fr",
          props.children.length
        ),
      }}
    >
      {props.children.map((child, index) => {
        const borderRight =
          index !== props.children.length - 1 ? `1px solid ${agastyaLine}` : "";
        const background = props.selectedIndex === index ? gray800 : gray500;
        return (
          <div
            style={{ ...styles.iconContainer, borderRight, background }}
            key={index}
            onClick={() => {
              props.setSelectedIndexCb(index);
            }}
            data-tooltip={props.styleArray[index]}
            className="icon-container"
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
