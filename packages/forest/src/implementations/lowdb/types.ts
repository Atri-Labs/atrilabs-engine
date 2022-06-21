import { LowdbSync } from "lowdb";
import { AnyEvent, Page } from "../../types";

export type PagesDbSchema = {
  [id: Page["id"]]: { name: string; route: string };
};

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
  events: { [pageId: Page["id"]]: LayoutErrorType };
}>;

export type OpenDbs = Partial<{
  meta: LowdbSync<any>;
  pages: LowdbSync<PagesDbSchema>;
  alias: LowdbSync<AliasDbSchema>;
  events: { [pageId: Page["id"]]: LowdbSync<EvensDbSchema> };
}>;
