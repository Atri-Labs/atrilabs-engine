import { gray200, smallText } from "@atrilabs/design-system";
import React, { useCallback } from "react";
import { ReactComponent as AudIp } from "../../assets/audio-icon.svg";

export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    borderBottom: "1px solid rgba(31, 41, 55, 0.5)",
    padding: "0 0.5rem",
    alignItems: "center",
    cursor: "pointer",
  },
  audioIcon: {
    padding: "0.5rem",
  },
  audioText: {
    ...smallText,
    color: gray200,
  },
};

function InputAudio(props: {
  url: string;
  audioText: string;
  onSelect: (url: string) => void;
}) {
  const onSelectCb = useCallback(() => {
    props.onSelect(props.url);
  }, [props]);
  return (
    <div style={styles.container} onClick={onSelectCb}>
      <div style={styles.audioIcon}>
        <AudIp />
      </div>
      <span style={styles.audioText}>{props.audioText}</span>
    </div>
  );
}

export default InputAudio;
