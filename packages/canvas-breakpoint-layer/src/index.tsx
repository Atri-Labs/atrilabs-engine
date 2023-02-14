import { Breakpoint, Menu } from "@atrilabs/core";
import React, {
  useCallback,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import { gray800, IconMenu } from "@atrilabs/design-system";
import { ReactComponent as Desktop } from "./assets/desktop.svg";
import { ReactComponent as Tab } from "./assets/tab.svg";
import { ReactComponent as Landscape } from "./assets/landscape.svg";
import { ReactComponent as Portrait } from "./assets/portrait.svg";
import "./styles.css";
import { breakpointApi } from "@atrilabs/pwa-builder-manager";

const styles: { [key: string]: React.CSSProperties } = {
  iconContainer: {
    borderLeft: `1px solid ${gray800}`,
  },
};

const breakpoints = {
  desktop: { min: 900, max: 1200 },
  tablet: { min: 800, max: 991 },
  landscape: { min: 550, max: 767 },
  portrait: { min: 300, max: 478 },
};

export default function () {
  console.log("canvas-breakpoint-layer loaded");

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(breakpoints.desktop);

  useLayoutEffect(() => {
    breakpointApi.addBreakpoints([
      breakpoints.desktop,
      breakpoints.tablet,
      breakpoints.landscape,
      breakpoints.portrait,
    ]);
    breakpointApi.setReferenceBreakpoint(0);
    breakpointApi.activateBreakpoint(0);
  }, []);

  useEffect(() => {
    return breakpointApi.subscribeBreakpointChange(() => {
      setBreakpoint(breakpointApi.getActiveBreakpoint());
    });
  }, []);

  const setDesktop = useCallback(() => {
    breakpointApi.activateBreakpoint(0);
  }, []);
  const setTab = useCallback(() => {
    breakpointApi.activateBreakpoint(1);
  }, []);
  const setLandscape = useCallback(() => {
    breakpointApi.activateBreakpoint(2);
  }, []);
  const setProtrait = useCallback(() => {
    breakpointApi.activateBreakpoint(3);
  }, []);
  return (
    <>
      <Menu name="CanvasMenu" order={0}>
        <div
          style={styles.iconContainer}
          data-tooltip="Desktop"
          className="tool-tip"
        >
          <IconMenu
            onClick={setDesktop}
            active={breakpoint === breakpoints.desktop}
          >
            <Desktop />
          </IconMenu>
        </div>
        <div
          style={styles.iconContainer}
          data-tooltip="Tablet"
          className="tool-tip"
        >
          <IconMenu onClick={setTab} active={breakpoint === breakpoints.tablet}>
            <Tab />
          </IconMenu>
        </div>
        <div
          style={styles.iconContainer}
          data-tooltip="Mobile Landscape"
          className="tool-tip"
        >
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
          data-tooltip="Mobile"
          className="tool-tip"
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
