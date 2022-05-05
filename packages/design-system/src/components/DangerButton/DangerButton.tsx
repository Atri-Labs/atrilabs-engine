import React from "react";
import styles from "../../stylesheets/button.module.css";

export type DangerButtonProps = {
  text: string;
  onClick: () => void;
};

export const DangerButton: React.FC<DangerButtonProps> = React.memo((props) => {
  return (
    <button className={styles["danger"]} onClick={props.onClick}>
      {props.text}
    </button>
  );
});
