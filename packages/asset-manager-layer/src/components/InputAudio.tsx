import { gray200, smallText } from "@atrilabs/design-system";
import React from "react";
import { ReactComponent as AudIp } from "../assets/audio-icon.svg";

export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    borderBottom: "1px solid rgba(31, 41, 55, 0.5)",
    padding: "0 0.5rem",
    alignItems: "center",
  },
  audioIcon: {
    padding: "0.5rem",
  },
  audioText: {
    ...smallText,
    color: gray200,
  },
};

function InputAudio(props: { url: string; audioText: string }) {
  return (
    <div style={styles.container}>
      <div style={styles.audioIcon}>
        <AudIp />
      </div>
      <span style={styles.audioText}>{props.audioText}</span>
    </div>
  );
}

export default InputAudio;
