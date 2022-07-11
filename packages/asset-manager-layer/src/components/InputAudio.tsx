import { gray200, smallText } from "@atrilabs/design-system";
import React from "react";
import { ReactComponent as AudIp } from "./upload-container/assets/audio-icon.svg";

export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    borderBottom: "1px solid rgba(31, 41, 55, 0.5)",
    alignItems: "baseline",
    padding: "0 1rem",
  },
  audioIcon: {
    marginRight: "10px",
  },
  audioText: {
    ...smallText,
    color: gray200,
  },
};

function InputAudio(props: any) {
  return (
    <div style={styles.container}>
      <AudIp style={styles.audioIcon} />
      <p style={styles.audioText}>Audio-sample-1.mp3</p>
    </div>
  );
}

export default InputAudio;
