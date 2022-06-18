import { ReactNode } from "react";
import { AnyEvent, Folder, Page, PageDetails } from "@atrilabs/forest";

/**
 * NOTE: A layer entry function must return Container, Menu, Tab
 * or a React.Fragment with Container, Menu, Tab.
 *
 * A runtime entry function must take layers as children.
 * The runtime entry function must manage the layers as deemed fit.
 */

export type MenuItem = ReactNode | ReactNode[];

export type ContainerItem = ReactNode | ReactNode[];

export type TabItem = { header: ReactNode; body: ReactNode };

/**
 * map of a name local to a layer with it's global name
 */
export type NameMap = { [localName: string]: string };

export type LayerConfig = {
  modulePath: string;
  requires: Partial<{ menu: NameMap; containers: NameMap; tabs: NameMap }>;
  exposes: Partial<{ menu: NameMap; containers: NameMap; tabs: NameMap }>;
  runtime?: { pkg: string };
  manifestSchema?: { pkg: string }[];
};

export type RuntimeConfig = {
  modulePath: string;
  requires: Partial<{ menu: NameMap; containers: NameMap; tabs: NameMap }>;
  exposes: Partial<{ menu: NameMap; containers: NameMap; tabs: NameMap }>;
  manifestSchema?: { pkg: string }[];
};

export type ForestsConfig = {
  [forestPkg: string]: { modulePath: string }[];
};

export type ToolConfig = {
  pkgManager: "npm" | "yarn";
  forests: ForestsConfig;
  forestManager: {
    // path to module implementing forest manager for backend
    path: string;
    // options will be passed on to the forest manager ctr fn as argument
    options: any;
  };
  layers: {
    pkg: string;
    remap?: Partial<{
      requires: LayerConfig["requires"];
      exposes: LayerConfig["exposes"];
    }>;
  }[];
  /**
   * directory where editor code will be emitted.
   * web    - contains ui of editor
   * server - contains backend of editor
   */
  output: string;
  /**
   * All the services must export a default function
   * The args for the function will be -
   * 1. ToolConfig - default export from tool.config.json file
   * 2. options - custom options
   */
  services: {
    fileServer: { path: string; options: any };
    eventServer: { path: string; options: any };
    manifestServer: { path: string; options: any };
    publishServer: { path: string; options: any };
  };
  targets: {
    targetName: string;
    hint: string;
    description: string;
    tasks: {
      generate: { path: string; options: any };
      build: { path: string; options: any };
      deploy: { path: string; options: any };
    };
  }[];
  /**
   * All the clients must default export their API.
   */
  clients: {
    /**
     * The eventClient is counterpart of eventServer that gets bundled in the core package.
     * Please use env field to pass on options to the client like host & port.
     * modulePath must resolve to the client module when used with require.resolve.
     */
    eventClient: { modulePath: string };
  };
  /**
   * env is generally used to supply port to clients for their
   * respective servers.
   */
  env: {
    [key: string]: number | string | boolean;
  };
  runtimes: {
    pkg: string;
    remap?: Partial<{
      requires: RuntimeConfig["requires"];
      exposes: RuntimeConfig["exposes"];
    }>;
  }[];
  /**
   * This client will be embedded into the codebase.
   * This client will be responsible to manage manifestRegistry
   * by communicating with manifestServer
   */
  manifestClient: { path: string };
  manifestSchema: { pkg: string }[];
  manifestDirs: { pkg: string }[];
};

// type for manifest.schema.config.js
export type ManifestSchemaConfig = {
  modulePath: string;
  // libs indicates the libraries that's needed to build injectables
  // for ex: react implies running tsc, babel and webpack to create injectable
  libs: "react"[];
};

export type ManifestSchema = {
  validate: (manifest: any) => boolean;
};

// type for manifest.config.js
export type ManifestConfig = {
  // all the modules will be searched in dir
  // files with .js, .jsx, .ts, .tsx will be selected
  dir: string;
  // a package can contain manifest for more than one manifest schema
  // hence array of manifestSchema
  manifestSchema: { pkg: string }[];
  componentMap: {
    [key: string]: { modulePath: string; exportedVarName: string };
  };
};

export type ManifestRegistry = {
  // manifestId of the package containing manifest schema
  // mapped to array of manifests (added after validation)
  [manifestId: string]: {
    schema: ManifestSchema;
    components: { pkg: string; component: any }[];
  };
};

export type EventSubscriber = (
  forestPkgId: string,
  pageId: string,
  event: AnyEvent
) => void;

export type BrowserClient = {
  getMeta(forestPkgId: string, onData: (meta: any) => void): void;
  getPages(
    forestPkgId: string,
    onData: (pages: { [pageId: string]: PageDetails }) => void
  ): void;
  createFolder(
    forestPkgId: string,
    folder: Folder,
    callback: (success: boolean) => void
  ): void;
  updateFolder(
    forestPkgId: string,
    id: string,
    update: Partial<Omit<Folder, "id">>,
    callback: (success: boolean) => void
  ): void;
  createPage(
    forestPkgId: string,
    page: Page,
    callback: (success: boolean) => void
  ): void;
  updatePage(
    forestPkgId: string,
    id: string,
    update: Partial<Omit<Page, "id">>,
    callback: (success: boolean) => void
  ): void;
  deletePage(
    forestPkgId: string,
    id: string,
    callback: (success: boolean) => void
  ): void;
  deleteFolder(
    forestPkgId: string,
    id: string,
    callback: (success: boolean) => void
  ): void;
  fetchEvents(forestPkgId: string, pageId: string): Promise<AnyEvent[]>;
  postNewEvent(
    forestPkgId: string,
    pageId: string,
    event: AnyEvent,
    callback: (success: boolean) => void
  ): void;
  getNewAlias(
    forestPkgId: string,
    prefix: string,
    callback: (alias: string) => void
  ): void;
  subscribeEvents(cb: EventSubscriber): () => void;
  subscribeExternalEvents(cb: EventSubscriber): () => void;
  subscribeOwnEvents(cb: EventSubscriber): () => void;
};

export type Script = {
  src: string;
  scriptName: string;
};

export type ManifestPkg = {
  pkg: string;
};

export type ManifestPkgBundle = ManifestPkg & Script;

export type Cache = {
  [pkg: string]: {
    // filepath is relative to manifest directory in pkg
    [filepath: string]: { timestamp: Date };
  };
};
