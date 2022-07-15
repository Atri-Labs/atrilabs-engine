import { gray200, smallText } from "@atrilabs/design-system";
import React from "react";
import { ReactComponent as VidIp } from "../assets/video-icon.svg";

export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    borderBottom: "1px solid rgba(31, 41, 55, 0.5)",
    padding: "0 0.5rem",
    alignItems: "center",
  },
  videoIcon: {
    padding: "0.5rem",
  },
  videoText: {
    ...smallText,
    color: gray200,
  },
};

function InputVideo(props: { url: string; videoText: string }) {
  return (
    <div style={styles.container}>
      <div style={styles.videoIcon}>
        <VidIp />
      </div>
      <span style={styles.videoText}>{props.videoText}</span>
    </div>
  );
}

export default InputVideo;
