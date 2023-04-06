import React from "react";
import {
  body,
  gray300,
  gray700,
  gray800,
  h1Heading,
  DangerButton,
  CancelButton,
} from "@atrilabs/design-system";
import { Cross } from "../assets/Cross";
import { ReactComponent as AlertIcon } from "../assets/alert-triangle.svg";
import { formatTemplatename } from "../utils";

const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(243, 244, 246, 0.25)",
  },
  dialogBox: {
    background: gray700,
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
    borderBottom: `1px solid ${gray800}`,
    alignItems: "center",
  },
  headerH4: {
    ...h1Heading,
    color: gray300,
    margin: 0,
  },
  contentContainer: {
    display: "flex",
    padding: "1rem 1rem 1.5rem 1rem",
  },
  leftContent: {
    paddingRight: "1rem",
  },
  rightContent: {
    ...body,
    color: gray300,
  },
};

export type ConfirmDeleteProps = {
  templateName: string;
  onCross: () => void;
  onDelete: () => void;
  onCancel: () => void;
};

// Controlled Component
export const ConfirmDelete: React.FC<ConfirmDeleteProps> = React.memo(
  (props) => {
    return (
      <div style={styles.outerDiv}>
        <div style={styles.dialogBox}>
          <div style={styles.headerContainer}>
            <h4 style={styles.headerH4}>Confirm</h4>
            <span style={styles.iconsSpan} onClick={props.onCross}>
              <Cross />
            </span>
          </div>

          <div style={styles.contentContainer}>
            <div style={styles.leftContent}>
              <AlertIcon />
            </div>
            <div style={styles.rightContent}>
              <div style={{ paddingBottom: "1rem" }}>
                {" "}
                Are you sure you want to delete this template?
                <p>{formatTemplatename(props.templateName)}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <CancelButton text={"Cancel"} onClick={props.onCancel} />
                <DangerButton text={"Delete"} onClick={props.onDelete} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
