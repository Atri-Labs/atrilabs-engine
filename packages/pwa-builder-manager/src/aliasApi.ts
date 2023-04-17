import { BrowserForestManager } from "@atrilabs/core";
import ComponentTreeId from "@atrilabs/app-design-forest/src/componentTree?id";
import { subscribeEditorMachine } from "./init";

const TrieSearch = require("trie-search");
import { api } from "./api";

const trie = new TrieSearch();

function createAliasFromPrefix(prefix: string) {
  const results = trie.search(prefix);
  let largestNumber = 1;
  if (Array.isArray(results) && results.length > 0) {
    results.forEach((result: { value: { alias: string } }) => {
      const matches = result.value.alias.match(/((\d+)$)/);
      if (matches) {
        const num = parseInt(matches[0]);
        if (num >= largestNumber) {
          largestNumber = num + 1;
        }
      }
    });
  }
  const alias = prefix + largestNumber;
  /**
   * Bug:
   *
   * Steps to replicate:
   *
   * 1. Select a flexbox with multiple buttons.
   * 2. Do ctrl + c & ctrl + v
   *
   * All the buttons in the new flexbox have same alias.
   *
   * Fix:
   *
   * Put the alias generated using this function in the trie.
   */
  createOrUndangle(alias, "created_for_fixing_copy_paste");
  return alias;
}

async function assingAliasFromPrefix(options: {
  prefix: string;
  id: string;
  postData: Parameters<typeof api.postNewEvents>[2];
}) {
  const { prefix, id, postData } = options;
  const alias = createAliasFromPrefix(prefix);
  const { forestPkgId, forestId } = BrowserForestManager.currentForest;
  postData.events.push({
    type: `PATCH$$${ComponentTreeId}`,
    id,
    slice: { alias },
  });
  api.postNewEvents(forestPkgId, forestId, postData);
}

async function maybeAssignAlias(options: {
  alias: string;
  id: string;
  postData: Parameters<typeof api.postNewEvents>[2];
}) {
  const { alias, id, postData } = options;
  const compId = await getCompIdForAlias(alias);
  if (compId !== undefined && compId !== id) {
    const err = Error();
    err.name = "DUPLICATE";
    err.message = `The alias ${alias} is already taken.`;
    throw err;
  } else if (compId === id) {
    // do nothing
  } else {
    const { forestPkgId, forestId } = BrowserForestManager.currentForest;
    postData.events.push({
      type: `PATCH$$${ComponentTreeId}`,
      id,
      slice: { alias },
    });
    api.postNewEvents(forestPkgId, forestId, postData);
  }
}

async function getCompIdForAlias(alias: string) {
  const result = trie.search(alias);
  if (
    Array.isArray(result) &&
    result[0] &&
    result[0].alias &&
    result[0].alias === alias &&
    result[0].deleted === false
  ) {
    return result[0].compId as string;
  }
}

function createOrUndangle(alias: string, id: string) {
  const result = trie.search(alias);
  if (
    Array.isArray(result) &&
    result[0] &&
    result[0].value.alias &&
    result[0].value.alias === alias
  ) {
    result[0].deleted = false;
    result[0].id = id;
  } else {
    trie.addFromObject({ [alias]: { id, alias, deleted: false } });
  }
}

function dangleAlias(alias: string) {
  const result = trie.search(alias);
  if (
    Array.isArray(result) &&
    result[0] &&
    result[0].alias &&
    result[0].alias === alias
  ) {
    result[0].deleted = true;
  }
}

subscribeEditorMachine("before_app_load", () => {
  trie.reset();
});

BrowserForestManager.currentForest.subscribeForest((update) => {
  if (update.type === "wire" && update.treeId === ComponentTreeId) {
    const compId = update.id;
    const compNode =
      BrowserForestManager.currentForest.tree(ComponentTreeId)!.nodes[compId]!;
    const alias = compNode.state.alias;
    if (alias) {
      createOrUndangle(alias, compId);
    }
  }
  if (update.type === "dewire" && update.treeId === ComponentTreeId) {
    const alias = update.deletedNode.state.alias;
    dangleAlias(alias);
  }
  if (update.type === "change" && update.treeId === ComponentTreeId) {
    const compId = update.id;
    const compNode =
      BrowserForestManager.currentForest.tree(ComponentTreeId)!.nodes[compId]!;
    const alias = compNode.state.alias;
    const oldAlias = update.oldState.alias;
    if (oldAlias) dangleAlias(oldAlias);
    createOrUndangle(alias, compId);
  }
});

export const aliasApi = {
  assingAliasFromPrefix,
  getCompIdForAlias,
  maybeAssignAlias,
  createAliasFromPrefix,
};
