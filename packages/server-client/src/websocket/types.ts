import { PagesDbSchema } from "@atrilabs/forest/lib/implementations/lowdb/types";

export type Folder = {
  id: string;
  name: string;
  parentId: string;
};

export type Page = {
  id: string;
  name: string;
  folderId: string;
};

export interface ServerToClientEvents {}

export interface ClientToServerEvents {
  getMeta: (forestName: string, callback: (meta: any) => void) => void;
  createFolder: (
    forestName: string,
    folder: Folder,
    callback: (success: boolean) => void
  ) => void;
  updateFolder: (
    forestName: string,
    id: Folder["id"],
    update: Partial<Omit<Folder, "id">>,
    callback: (success: boolean) => void
  ) => void;
  deleteFolder: (
    forestName: string,
    id: Folder["id"],
    callback: (success: boolean) => void
  ) => void;
  getPages: (
    forestname: string,
    callback: (page: PagesDbSchema) => void
  ) => void;
  createPage: (
    forestName: string,
    page: Page,
    callback: (success: boolean) => void
  ) => void;
  updatePage: (
    forestName: string,
    pageId: Page["id"],
    update: Partial<Omit<Page, "id">>,
    callback: (success: boolean) => void
  ) => void;
  deletePage: (
    forestName: string,
    id: Page["id"],
    callback: (success: boolean) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
