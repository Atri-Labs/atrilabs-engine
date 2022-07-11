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
    width: "5.5rem",
    height: "3rem",
  },
  image: {
    width: "5.5rem",
    height: "3rem",
    objectFit: "fill",
  },
  imageText: {
    ...smallText,
    color: gray200,
  },
};

function InputImage(props: any) {
  return (
    <div style={styles.imageBox}>
      <div style={styles.imageContainer}>
        <img style={styles.image} src={props.url} alt="" />
      </div>
      <p style={styles.imageText}>Image-1.png</p>
    </div>
  );
}

export default InputImage;
