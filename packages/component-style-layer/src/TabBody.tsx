import {
  gray300,
  gray800,
  h1Heading,
  smallText,
} from "@atrilabs/design-system";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Size } from "./components/size/Size";
import { Border } from "./components/border/Border";
import { Layout } from "./components/layout/Layout";
import { FlexChild } from "./components/flexchild/FlexChild";
import { CSSTreeOptions } from "@atrilabs/app-design-forest/lib/cssTree";
import SpacingProperty from "./components/spacing/SpacingProperty";
import { Typography } from "./components/typography/Typography";
import Position from "./components/position/Position";
import { Background } from "./components/background/Background";
import { CssProprtyComponentType } from "./types";
import { Breakpoint } from "@atrilabs/canvas-runtime";
import { Miscellaneous } from "./components/miscellaneous/Miscellaneous";
import { Outline } from "./components/outline/Outline";
import { Css2Display } from "./components/css2display/Css2Display";
import "./TabBody.css";
import { getAliasList } from "./utils";
import { CssSummary } from "./components/cssSummary/CssSummary";
import { Tree } from "@atrilabs/forest";

export type TabBodyProps = {
  alias: string;
  setAliasCb: (event: React.ChangeEvent<HTMLInputElement>) => void;
  patchCb: (slice: any) => void;
  styles: React.CSSProperties;
  treeOptions: CSSTreeOptions;
  openAssetManager: CssProprtyComponentType["openAssetManager"];
  openPalette: CssProprtyComponentType["openPalette"];
  openPaletteWithoutEffect: CssProprtyComponentType["openPaletteWithoutEffect"];
  compId: string;
  breakpoint: Breakpoint | null;
  colorValue: [string];
  setColorValue: (color: string, index: number) => void;
  colorValueArraySetter: (colorValues: [string]) => void;
  initialAlias: string;
  cssTree: Tree;
  compTree: Tree;
};

const styles: { [key: string]: React.CSSProperties } = {
  // top level container
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    userSelect: "none",
  },

  // alias container
  aliasContainer: {
    ...h1Heading,
    color: gray300,
    padding: "0.5rem",
    borderBottom: `1px solid ${gray800}`,
    background: "transparent",
  },
};

// This serves as a Higher Order Component to arrange different sections
// such as Spacing, Layout, Typography etc. of styles panel.
export const TabBody: React.FC<TabBodyProps> = (props) => {
  const [alias, setAlias] = useState(props.initialAlias);
  useEffect(() => {
    setAlias(props.alias);
  }, [props.alias]);

  const [showDuplicateAliasMessage, setShowDuplicateAliasMessage] =
    useState<boolean>(false);
  const aliasListPromise = useRef<Promise<{ [alias: string]: boolean }> | null>(
    null
  );
  const setAliasCb = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAlias(event.target.value);

      // run this promise only once, after that reuse the result
      if (aliasListPromise.current === null) {
        aliasListPromise.current = new Promise<{ [alias: string]: boolean }>(
          (res) => {
            res(getAliasList());
          }
        );
      }

      aliasListPromise.current?.then((aliasDict) => {
        if (
          aliasDict[event.target.value] === undefined ||
          event.target.value === props.initialAlias
        ) {
          props.setAliasCb(event);
          setShowDuplicateAliasMessage(false);
        } else {
          setShowDuplicateAliasMessage(true);
        }
      });
    },
    [props]
  );
  return (
    <div style={styles.container} className="tb-scroll">
      <input
        style={styles.aliasContainer}
        onChange={setAliasCb}
        value={alias}
      />
      <div style={{ ...smallText, color: gray300, padding: "0.5rem" }}>
        {showDuplicateAliasMessage ? "Error: This alias/name is taken." : ""}
      </div>
      <CssSummary
        compId={props.compId}
        cssTree={props.cssTree}
        compTree={props.compTree}
      />
      {props.treeOptions && props.treeOptions.css2DisplayOptions ? (
        <Css2Display
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.flexContainerOptions ? (
        <Layout
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.flexChildOptions ? (
        <FlexChild
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.sizeOptions ? (
        <Size
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.spacingOptions ? (
        <SpacingProperty
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.borderOptions ? (
        <Border
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.outlineOptions ? (
        <Outline
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.typographyOptions ? (
        <Typography
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.backgroundOptions ? (
        <Background
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.positionOptions ? (
        <Position
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
      {props.treeOptions && props.treeOptions.miscellaneousOptions ? (
        <Miscellaneous
          styles={props.styles}
          patchCb={props.patchCb}
          openAssetManager={props.openAssetManager}
          openPalette={props.openPalette}
          openPaletteWithoutEffect={props.openPaletteWithoutEffect}
          compId={props.compId}
          colorValue={props.colorValue}
          setColorValue={props.setColorValue}
          colorValueArraySetter={props.colorValueArraySetter}
        />
      ) : null}
    </div>
  );
};
