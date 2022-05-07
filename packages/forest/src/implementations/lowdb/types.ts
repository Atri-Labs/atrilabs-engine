import { LowdbSync } from "lowdb";
import { AnyEvent, PageId } from "../../types";

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

export type OpenDbs = Partial<{
  meta: LowdbSync<any>;
  pages: LowdbSync<PagesDbSchema>;
  alias: LowdbSync<AliasDbSchema>;
  events: { [pageId: PageId]: LowdbSync<EvensDbSchema> };
}>;
