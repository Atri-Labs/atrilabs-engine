import { gray200, smallText } from "@atrilabs/design-system";
import React from "react";

export const styles: { [key: string]: React.CSSProperties } = {
  imageBox: {
    textAlign: "left",
    marginBottom: "10px",
  },
  imageContainer: {
    border: "1px solid rgba(31, 41, 55, 0.5)",
    borderRadius: "2px",
    width: "auto",
    height: "3rem",
  },
  imageText: {
    ...smallText,
    color: gray200,
  },
};

function InputImage(props: any) {
  return (
    <div style={styles.imageBox}>
      <div style={styles.imageContainer}></div>
      <p style={styles.imageText}>Image-{props.id}.png</p>
    </div>
  );
}

export default InputImage;
