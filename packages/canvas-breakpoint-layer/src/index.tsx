import { Menu } from "@atrilabs/core";
import { CanvasController } from "@atrilabs/canvas-runtime";
import React, { useCallback, useEffect, useState } from "react";
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

const breakpoints = {
  desktop: null,
  tablet: { min: 800, max: 991 },
  landscape: { min: 550, max: 767 },
  portrait: { min: 300, max: 478 },
};

export default function () {
  console.log("canvas-breakpoint-layer loaded");

  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  // set initial breakpoint at Desktop
  useEffect(() => {
    setBreakpoint(breakpoints.desktop);
  }, []);

  const setDesktop = useCallback(() => {
    setBreakpoint(breakpoints.desktop);
  }, []);
  const setTab = useCallback(() => {
    setBreakpoint(breakpoints.tablet);
  }, []);
  const setLandscape = useCallback(() => {
    setBreakpoint(breakpoints.landscape);
  }, []);
  const setProtrait = useCallback(() => {
    setBreakpoint(breakpoints.portrait);
  }, []);
  return (
    <>
      <CanvasController breakpoint={breakpoint} />
      <Menu name="CanvasMenu" order={0}>
        <div style={styles.iconContainer}>
          <IconMenu
            onClick={setDesktop}
            active={breakpoint === breakpoints.desktop}
          >
            <Desktop />
          </IconMenu>
        </div>
        <div style={styles.iconContainer}>
          <IconMenu onClick={setTab} active={breakpoint === breakpoints.tablet}>
            <Tab />
          </IconMenu>
        </div>
        <div style={styles.iconContainer}>
          <IconMenu
            onClick={setLandscape}
            active={breakpoint === breakpoints.landscape}
          >
            <Landscape />
          </IconMenu>
        </div>
        <div
          style={{
            ...styles.iconContainer,
            borderRight: `1px solid ${gray800}`,
          }}
        >
          <IconMenu
            onClick={setProtrait}
            active={breakpoint === breakpoints.portrait}
          >
            <Portrait />
          </IconMenu>
        </div>
      </Menu>
    </>
  );
}
