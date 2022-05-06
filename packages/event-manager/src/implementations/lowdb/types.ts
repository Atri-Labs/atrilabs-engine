import { AnyEvent } from "@atrilabs/forest";
import { PageId } from "../../types";

export type PagesDbSchema = { [id: PageId]: { name: string; route: string } };

export type AliasDbSchema = { [alias: string]: number };

export type EvensDbSchema = AnyEvent[];

export enum LayoutErrorType {
  missing,
  empty,
  invalidData,
}

export type LayoutErrorReport = Partial<{
  meta: LayoutErrorType;
  pages: LayoutErrorType;
  alias: LayoutErrorType;
  events: { [pageId: PageId]: LayoutErrorType };
}>;
