import { AnyEvent, PageId } from "../../types";

export type PagesDbSchema = { [id: PageId]: { name: string; route: string } };

export type AliasDbSchema = { [alias: string]: number };

export type EvensDbSchema = AnyEvent[];
