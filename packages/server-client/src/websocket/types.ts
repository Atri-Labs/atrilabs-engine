import { PagesDbSchema } from "@atrilabs/forest/lib/implementations/lowdb/types";

export type Folder = {
  id: string;
  name: string;
  parentId: string;
};

// A Page is an actual instance of forest
// Page["id"] === forestId
export type Page = {
  id: string;
  name: string;
  folderId: string;
};

export interface ServerToClientEvents {}

export interface ClientToServerEvents {
  getMeta: (forestPkgId: string, callback: (meta: any) => void) => void;
  createFolder: (
    forestPkgId: string,
    folder: Folder,
    callback: (success: boolean) => void
  ) => void;
  updateFolder: (
    forestPkgId: string,
    id: Folder["id"],
    update: Partial<Omit<Folder, "id">>,
    callback: (success: boolean) => void
  ) => void;
  deleteFolder: (
    forestPkgId: string,
    id: Folder["id"],
    callback: (success: boolean) => void
  ) => void;
  getPages: (
    forestPkgId: string,
    callback: (page: PagesDbSchema) => void
  ) => void;
  createPage: (
    forestPkgId: string,
    page: Page,
    callback: (success: boolean) => void
  ) => void;
  updatePage: (
    forestPkgId: string,
    pageId: Page["id"],
    update: Partial<Omit<Page, "id">>,
    callback: (success: boolean) => void
  ) => void;
  deletePage: (
    forestPkgId: string,
    pageId: Page["id"],
    callback: (success: boolean) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
