import { gray200, smallText } from "@atrilabs/design-system";
import React, { useCallback, useState } from "react";
import { IconsContainer } from "../../IconsContainer";
import { ReactComponent as RightArrow } from "../../assets/right-arrow.svg";
import { ReactComponent as DownArrow } from "../../assets/down-arrow.svg";
import { ReactComponent as LeftArrow } from "../../assets/left-arrow.svg";
import { ReactComponent as UpArrow } from "../../assets/up-arrow.svg";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
  },
  header: {
    ...smallText,
    color: gray200,
    paddingBottom: "0.5rem",
  },
  option: {
    display: "flex",
    height: "1.5rem",
  },
  optionName: {
    ...smallText,
    width: "4rem",
    color: "white",
    display: "flex",
    alignItems: "center",
  },
  optionsIcons: {
    flexGrow: 1,
  },
};

export const Layout: React.FC = () => {
  const [directionIndex, setDirectionIndex] = useState<number>(0);
  const setDirectionSelectedIndexCb = useCallback((index: number) => {
    setDirectionIndex(index);
  }, []);
  return (
    <div style={styles.container}>
      <div style={styles.header}>Layout</div>
      <div style={styles.option}>
        <div style={styles.optionName}>Direction</div>
        <div style={styles.optionsIcons}>
          <IconsContainer
            selectedIndex={directionIndex}
            setSelectedIndexCb={setDirectionSelectedIndexCb}
          >
            <RightArrow />
            <DownArrow />
            <LeftArrow />
            <UpArrow />
          </IconsContainer>
        </div>
      </div>
      <div style={styles.option}>
        <div style={styles.optionName}>Align</div>
      </div>
      <div style={styles.option}>
        <div style={styles.optionName}>Justify</div>
      </div>
    </div>
  );
};
