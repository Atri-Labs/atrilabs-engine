import { Id as reactSchemaId } from "@atrilabs/react-component-manifest-schema";
import type { ReactComponentManifestSchema } from "@atrilabs/react-component-manifest-schema";
import { Id as iconSchemaId } from "@atrilabs/component-icon-manifest-schema";
import { Id as CSSTreeId } from "@atrilabs/app-design-forest/src/cssTree";
import { CSSTreeOptions } from "@atrilabs/app-design-forest";
import { CustomPropsTreeOptions } from "@atrilabs/app-design-forest";
import { Id as CustomTreeId } from "@atrilabs/app-design-forest/src/customPropsTree";
import Joi from "joi";
import {
  Id as AttributesTreeId,
  AttributesTreeOptionsBoolean,
} from "@atrilabs/app-design-forest/src/attributesTree";

const attributesTreeOptions: AttributesTreeOptionsBoolean = {
  basics: true,
  ariaLabelledBy: false,
};

const cssTreeOptions: CSSTreeOptions = {
  boxShadowOptions: true,
  flexContainerOptions: false,
  flexChildOptions: true,
  positionOptions: true,
  typographyOptions: true,
  spacingOptions: true,
  sizeOptions: true,
  borderOptions: true,
  outlineOptions: true,
  backgroundOptions: true,
  miscellaneousOptions: true,
};

const customTreeOptions: CustomPropsTreeOptions = {
  dataTypes: {
    playing: { type: "boolean" },
    url: { type: "text" },
    light: { type: "text" },
    loop: { type: "boolean" },
    controls: { type: "boolean" },
    volume: { type: "number" },
    muted: { type: "boolean" },
    playbackRate: { type: "number" },
    progressInterval: { type: "number" },
    playsinline: { type: "boolean" },
    playIcon: { type: "static_asset" },
    previewTabIndex: { type: "number" },
    pip: { type: "boolean" },
    stopOnUnmount: { type: "boolean" },
    fallback: { type: "static_asset" },
    config: {
      type: "json",
      schema: Joi.object({
        youtube: Joi.object({
          playerVars: Joi.object({
            showinfo: Joi.number().optional(),
            autoplay: Joi.number().optional(),
            controls: Joi.number().optional(),
            modestbranding: Joi.number(),
          }).optional(),
          embedOptions: Joi.object({
            host: Joi.string().uri().optional(),
          }).optional(),
          onUnstarted: Joi.func().optional(),
        }).optional(),
        facebook: Joi.object({
          appId: Joi.string().optional(),
          version: Joi.string().optional(),
          playerId: Joi.string().optional(),
          attributes: Joi.object({
            "data-show-text": Joi.boolean().optional(),
            "data-allowfullscreen": Joi.boolean().optional(),
          }).optional(),
        }).optional(),
        dailymotion: Joi.object({
          params: Joi.object({
            autoplay: Joi.boolean().optional(),
            mute: Joi.boolean().optional(),
          }).optional(),
          attributes: Joi.object({
            "data-volume": Joi.number().optional(),
            "data-quality": Joi.string().optional(),
          }).optional(),
        }).optional(),
        file: Joi.object({
          attributes: Joi.object({
            preload: Joi.string().valid("none", "metadata", "auto").optional(),
          }).optional(),
          forceVideo: Joi.boolean().optional(),
          forceAudio: Joi.boolean().optional(),
          forceHLS: Joi.boolean().optional(),
          forceSafariHLS: Joi.boolean().optional(),
          forceDASH: Joi.boolean().optional(),
          forceFLV: Joi.boolean().optional(),
          hlsOptions: Joi.object({
            startPosition: Joi.number().optional(),
          }).optional(),
          hlsVersion: Joi.string().optional(),
          dashVersion: Joi.string().optional(),
          flvVersion: Joi.string().optional(),
        }).optional(),
      }),
    },
  },
};

const compManifest: ReactComponentManifestSchema = {
  meta: { key: "Video", category: "Basics" },
  dev: {
    decorators: [],
    attachProps: {
      styles: {
        treeId: CSSTreeId,
        initialValue: { width: "350px", height: "350px" },
        treeOptions: cssTreeOptions,
        canvasOptions: { groupByBreakpoint: true },
      },
      custom: {
        treeId: CustomTreeId,
        initialValue: {
          stopOnUnmount: true,
          playbackRate: 1,
          progressInterval: 1000,
        },
        treeOptions: customTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
      attrs: {
        treeId: AttributesTreeId,
        initialValue: {},
        treeOptions: attributesTreeOptions,
        canvasOptions: { groupByBreakpoint: false },
      },
    },
    attachCallbacks: {
      onChange: [{ type: "controlled", selector: ["custom", "value"] }],
      onPressEnter: [{ type: "do_nothing" }],
      onReady: [{ type: "do_nothing" }],
      onStart: [{ type: "do_nothing" }],
      onPlay: [{ type: "do_nothing" }],
      onPause: [{ type: "do_nothing" }],
      onBuffer: [{ type: "do_nothing" }],
      onBufferEnd: [{ type: "do_nothing" }],
      onEnded: [{ type: "do_nothing" }],
      onClickPreview: [{ type: "do_nothing" }],
      onEnablePIP: [{ type: "do_nothing" }],
      onDisablePIP: [{ type: "do_nothing" }],
      onError: [{ type: "do_nothing" }],
      onDuration: [{ type: "do_nothing" }],
      onSeek: [{ type: "do_nothing" }],
      onProgress: [{ type: "do_nothing" }],
      getCurrentTime: [{ type: "do_nothing" }],
      getSecondsLoaded: [{ type: "do_nothing" }],
      getDuration: [{ type: "do_nothing" }],
      getInternalPlayer: [{ type: "do_nothing" }],
      showPreview: [{ type: "do_nothing" }],
    },
    defaultCallbackHandlers: {},
  },
};

const iconManifest = {
  panel: { comp: "CommonIcon", props: { name: "Video" } },
  drag: {
    comp: "CommonIcon",
    props: { name: "Video", containerStyle: { padding: "1rem" } },
  },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: compManifest,
    [iconSchemaId]: iconManifest,
  },
};
