import { Menu } from "@atrilabs/core";
import {
  gray200,
  gray300,
  gray800,
  smallText,
  blue600,
  gray500,
} from "@atrilabs/design-system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Cross } from "./components/Cross";
import {
  DeployCompletedInfo,
  GenericErrorInfo,
  MayTakeTimeInfo,
} from "./components/Info";
import { StepProgressBar } from "./components/StepProgressBar";
import { useRunTask } from "./hooks/useRunTask";

const styles: { [key: string]: React.CSSProperties } = {
  outerDiv: {
    ...smallText,
    color: gray300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
  },
  popupDiv: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "100%",
    backgroundColor: "black",
    width: "10rem",
    zIndex: 1,
    right: 0,
  },
};

export default function () {
  const { callRunTaskApi, status, inProgress } = useRunTask();
  const [showPopup, setShowPopup] = useState(false);
  const onCrossClickCb = useCallback(() => {
    setShowPopup(false);
  }, []);
  // open http://localhost:4005
  const devWindow = useRef<Window | null>(null);
  useEffect(() => {
    if (status.deploy) {
      if (devWindow.current == null || devWindow.current.closed)
        devWindow.current = window.open("http://localhost:4005", "_blank");
      window.focus();
    }
  }, [status]);

  const publishBtn = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      const key = e.key;

      // detecting ctrl and cmd
      const ctrl = e.ctrlKey ? e.ctrlKey : key === "Control" ? true : false;
      //*****************************  // don't have a mac to test this line of code *******************************************//
      const cmd = e.keyCode === 120 ? true : false;

      // If key pressed is b and if ctrl/cmd is true.
      if (key === "b" && (ctrl || cmd)) {
        console.log("publish started");
        publishBtn.current?.click();
      }
    });
  });

  return (
    <>
      <Menu name="PublishMenu" order={1}>
        <div style={styles.outerDiv}>
          <span
            ref={publishBtn}
            onClick={() => {
              setShowPopup(!showPopup);
              callRunTaskApi();
            }}
          >
            {"Build & Run"}
          </span>
          {showPopup ? (
            <div
              style={{
                position: "absolute",
                top: "2.5rem",
                right: 0,
                zIndex: 1,
                background: gray800,
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                rowGap: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Publish Status</span>
                <span onClickCapture={onCrossClickCb}>
                  <Cross />
                </span>
              </div>
              <StepProgressBar
                steps={[
                  {
                    name: "Generate",
                    color: status.generate ? blue600 : gray500,
                  },
                  { name: "Build", color: status.build ? blue600 : gray500 },
                  { name: "Run", color: status.deploy ? blue600 : gray500 },
                ]}
              />
              {status.generate && status.build === false ? (
                <div
                  style={{
                    background: gray200,
                    color: gray800,
                    padding: "12px",
                  }}
                >
                  <MayTakeTimeInfo />
                </div>
              ) : null}
              {status.deploy ? (
                <div
                  style={{
                    background: gray200,
                    color: gray800,
                    padding: "12px",
                  }}
                >
                  <DeployCompletedInfo />
                </div>
              ) : null}
              {inProgress === false &&
              !(status.build && status.generate && status.deploy) ? (
                <div
                  style={{
                    background: gray200,
                    color: gray800,
                    padding: "12px",
                  }}
                >
                  <GenericErrorInfo />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Menu>
    </>
  );
}
