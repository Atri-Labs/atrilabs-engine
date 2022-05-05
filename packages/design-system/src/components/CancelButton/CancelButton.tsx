import React from "react";
import styles from "../../stylesheets/button.module.css";

export type CancelButtonProps = {
  text: string;
  onClick: () => void;
};

export const CancelButton: React.FC<CancelButtonProps> = React.memo((props) => {
  return (
    <button className={styles["cancel"]} onClick={props.onClick}>
      {props.text}
    </button>
  );
});
