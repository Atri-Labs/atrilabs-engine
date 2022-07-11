import { gray200, smallText } from "@atrilabs/design-system";
import React from "react";
import { ReactComponent as VidIp } from "./upload-container/assets/video-icon.svg";

export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    borderBottom: "1px solid rgba(31, 41, 55, 0.5)",
    alignItems: "baseline",
    padding: "0 1rem",
  },
  videoIcon: {
    marginRight: "10px",
  },
  videoText: {
    ...smallText,
    color: gray200,
  },
};

function InputVideo(props: any) {
  return (
    <div style={styles.container}>
      <VidIp style={styles.videoIcon} />
      <p style={styles.videoText}>Video-sample-1.mp3</p>
    </div>
  );
}

export default InputVideo;
