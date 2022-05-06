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
  createFolder: (folder: Folder, callback: (success: boolean) => void) => void;
  updateFolder: (
    id: Folder["id"],
    update: Partial<Omit<Folder, "id">>,
    callback: (success: boolean) => void
  ) => void;
  createPage: (page: Page, callback: (success: boolean) => void) => void;
  updatePage: (
    pageId: Page["id"],
    update: Partial<Omit<Page, "id">>,
    callback: (success: boolean) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
