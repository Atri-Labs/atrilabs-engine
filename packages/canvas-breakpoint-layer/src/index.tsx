import { Menu } from "@atrilabs/core";
import { CanvasController } from "@atrilabs/canvas-runtime";
import React, { useCallback, useState } from "react";
import { gray800, IconMenu } from "@atrilabs/design-system";
import { Breakpoint } from "@atrilabs/canvas-runtime/lib/types";
import { ReactComponent as Desktop } from "./assets/desktop.svg";
import { ReactComponent as Tab } from "./assets/tab.svg";
import { ReactComponent as Landscape } from "./assets/landscape.svg";
import { ReactComponent as Portrait } from "./assets/portrait.svg";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderLeft: `1px solid ${gray800}`,
  },
};

export default function () {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>();
  const setDesktop = useCallback(() => {
    setBreakpoint({ min: 900, max: 1100 });
  }, []);
  const setTab = useCallback(() => {
    setBreakpoint({ min: 600, max: 800 });
  }, []);
  const setLandscape = useCallback(() => {
    setBreakpoint({ min: 900, max: 1100 });
  }, []);
  const setProtrait = useCallback(() => {
    setBreakpoint({ min: 600, max: 800 });
  }, []);
  return (
    <>
      {breakpoint ? <CanvasController breakpoint={breakpoint} /> : null}
      <Menu name="CanvasMenu">
        <div style={styles.iconContainer}>
          <IconMenu onClick={setDesktop}>
            <Desktop />
          </IconMenu>
        </div>
        <div style={styles.iconContainer}>
          <IconMenu onClick={setTab}>
            <Tab />
          </IconMenu>
        </div>
        <div style={styles.iconContainer}>
          <IconMenu onClick={setLandscape}>
            <Landscape />
          </IconMenu>
        </div>
        <div
          style={{
            ...styles.iconContainer,
            borderRight: `1px solid ${gray800}`,
          }}
        >
          <IconMenu onClick={setProtrait}>
            <Portrait />
          </IconMenu>
        </div>
      </Menu>
    </>
  );
}
