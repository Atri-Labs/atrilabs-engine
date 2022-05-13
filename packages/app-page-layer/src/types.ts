export type PageTableData = {
  // only root's direct children are included as of now
  folder: { id: string; name: string; parentId: string };
  pages: { id: string; name: string; route: string }[];
}[];
