import React, { useCallback } from "react";
import {
  body,
  gray300,
  gray700,
  gray800,
  h1Heading,
  DangerButton,
  CancelButton,
} from "@atrilabs/design-system";
import { Cross } from "../icons/Cross";
import { ReactComponent as AlertIcon } from "../icons/alert-triangle.svg";
import { overlayContainer } from "../required";
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

export const ConfirmDelete: React.FC = React.memo(() => {
  const closeDialog = useCallback(() => {
    overlayContainer.pop();
  }, []);
  return (
    <div style={styles.outerDiv}>
      <div style={styles.dialogBox}>
        <div style={styles.headerContainer}>
          <h4 style={styles.headerH4}>Confirm</h4>
          <span style={styles.iconsSpan} onClick={closeDialog}>
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
              Are you sure you want to delete this page?
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <CancelButton text={"Cancel"} onClick={() => {}} />
              <DangerButton text={"Delete"} onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
