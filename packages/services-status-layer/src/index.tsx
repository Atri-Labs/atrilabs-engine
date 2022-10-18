import { Menu } from "@atrilabs/core";
import { useGetServiceStatus } from "./hooks/useGetServiceStatus";
import { ReactComponent as RedDot } from "./assets/red_dot.svg";
import { ReactComponent as GreenDot } from "./assets/green_dot.svg";
import { gray200, gray800, smallText } from "@atrilabs/design-system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Cross } from "./assets/Cross";

export default function () {
  const { status } = useGetServiceStatus();
  const isHealthy = useMemo(() => {
    return (
      status.isEventServerConnected &&
      status.isIPCServerConnected &&
      status.publishServerConnected &&
      status.atriCLIConnected
    );
  }, [status]);

  const [showStatus, setShowStatus] = useState<boolean>(!isHealthy);
  useEffect(() => {
    setShowStatus(!isHealthy);
  }, [isHealthy]);
  const closeStatusMessage = useCallback(() => {
    setShowStatus(false);
  }, []);
  const reopenStatusMessage = useCallback(() => {
    if (!isHealthy) {
      setShowStatus(true);
    }
  }, [isHealthy]);
  return (
    <>
      <Menu name="BaseFooterMenu" order={0}>
        <div
          style={{
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {isHealthy ? <GreenDot /> : <RedDot onClick={reopenStatusMessage} />}
          {showStatus ? (
            <div
              style={{
                width: "35rem",
                height: "40px",
                ...smallText,
                fontSize: "0.8rem",
                color: gray200,
                position: "absolute",
                right: "-36rem",
                top: "0",
                zIndex: "1",
                display: "flex",
                alignItems: "center",
                backgroundColor: gray800,
                paddingLeft: "1rem",
                paddingRight: "1rem",
                boxSizing: "border-box",
                justifyContent: "space-between",
              }}
            >
              <span>
                {" "}
                Please stop current atri process and run <code>
                  atri start
                </code>{" "}
                in your shell again.
              </span>
              <div
                style={{ display: "flex", alignItems: "center" }}
                onClick={closeStatusMessage}
              >
                <Cross />
              </div>
            </div>
          ) : null}
        </div>
      </Menu>
    </>
  );
}
