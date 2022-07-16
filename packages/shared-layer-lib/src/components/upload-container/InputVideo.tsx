import { gray200, smallText } from "@atrilabs/design-system";
import React, { useCallback } from "react";
import { ReactComponent as VidIp } from "../../assets/video-icon.svg";

export const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    borderBottom: "1px solid rgba(31, 41, 55, 0.5)",
    padding: "0 0.5rem",
    alignItems: "center",
    cursor: "pointer",
  },
  videoIcon: {
    padding: "0.5rem",
  },
  videoText: {
    ...smallText,
    color: gray200,
  },
};

function InputVideo(props: {
  url: string;
  videoText: string;
  onSelect: (url: string) => void;
}) {
  const onSelectCb = useCallback(() => {
    props.onSelect(props.url);
  }, [props]);
  return (
    <div style={styles.container} onClick={onSelectCb}>
      <div style={styles.videoIcon}>
        <VidIp />
      </div>
      <span style={styles.videoText}>{props.videoText}</span>
    </div>
  );
}

export default InputVideo;
