import { Menu } from "@atrilabs/core";
import { gray300, smallText } from "@atrilabs/design-system";
import React, { useState } from "react";
import { useRunTask } from "./hooks/useRunTask";

const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    ...smallText,
    color: gray300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
  },
  popupDiv: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "100%",
    backgroundColor: "black",
    width: "10rem",
    zIndex: 1,
    right: 0,
  },
};

export default function () {
  const { callRunTaskApi } = useRunTask();
  const [showPopup, setShowPopup] = useState(false);
  return (
    <>
      <Menu name="PublishMenu">
        <div
          style={styles.outerDiv}
          onClick={() => {
            setShowPopup(!showPopup);
            callRunTaskApi();
          }}
        >
          Publish
          {showPopup ? <div style={styles.popupDiv}>Some Status</div> : null}
        </div>
      </Menu>
    </>
  );
}
