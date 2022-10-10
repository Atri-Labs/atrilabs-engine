import { useState, useEffect, useCallback } from "react";
import { BrowserForestManager, manifestRegistryController, api } from "@atrilabs/core";
import { PatchEvent, Tree } from "@atrilabs/forest";
import ComponentTreeId from "@atrilabs/app-design-forest/lib/componentTree?id";
import { ComponentNode } from '../types';


export const useComponentNodes = () => {
    const { items: newTree, oldItems } = transformTreeToComponentNodes(BrowserForestManager.currentForest.tree(ComponentTreeId)!, {});
    const [oldItemsMap, setOldItemsMap] = useState<{ [id: string]: ComponentNode }>(oldItems);

    const [items, setItems] = useState<ComponentNode[]>(newTree);
    useEffect(() => {
        const unsubscribe = BrowserForestManager.currentForest.subscribeForest((_) => {
            const newTree = BrowserForestManager.currentForest.tree(ComponentTreeId)!;
            const { items, oldItems } = transformTreeToComponentNodes(newTree, oldItemsMap);
            setItems(items);
            setOldItemsMap(oldItems);

            return () => {
                unsubscribe();
            };
        });
    }, []);
    const patchCb = useCallback(
        (nodeId: string, parentId: any) => {
            const forestPkgId = BrowserForestManager.currentForest.forestPkgId;
            const forestId = BrowserForestManager.currentForest.forestId;
            const newParent = recursionFind(parentId, items);
            if (newParent?.type !== 'acceptsChild') {
                return;
            }
            const node = recursionFind(nodeId, items);
            if (!node) {
                return;
            }
            newParent.children = newParent.children!.concat(node);
            newParent.children?.forEach((curr, index) => {
                const patchEvent: PatchEvent = {
                    type: `PATCH$$${ComponentTreeId}`,
                    slice: {
                        parent: {
                            id: newParent?.id,
                            index: index + 1,
                        }
                    },
                    id: curr.id,
                };
                api.postNewEvent(forestPkgId, forestId, patchEvent, () => { });
            });
        },
        [items]
    );
    const toggleNode = useCallback(
        (nodeId: string) => {
            const newItems = items;
            const itemsMap = oldItemsMap;
            const node = recursionFind(nodeId, newItems);
            if (!node) {
                return;
            }
            const nodeMapItem = itemsMap[nodeId];
            if (!nodeMapItem) {
                return;
            }
            nodeMapItem.open = !nodeMapItem.open;
            node.open = nodeMapItem.open;
            itemsMap[nodeId] = nodeMapItem;
            setOldItemsMap(itemsMap);
            setItems([...newItems]);
        },
        [items]
    );
    return { items, patchCb, toggleNode };
};

function recursionFind(nodeId: string, items: ComponentNode[]): ComponentNode | undefined {
    for (let i = 0; i < items.length; i++) {
        if (items[i].id === nodeId) {
            return items[i];
        }
        if (items[i].children) {
            const found = recursionFind(nodeId, items[i].children!);
            if (found) {
                return found;
            }
        }
    }
}

function transformTreeToComponentNodes(tree: Tree, oldItemsMap: { [id: string]: ComponentNode }): { items: ComponentNode[], oldItems: { [id: string]: ComponentNode } } {
    const oldBody = oldItemsMap['body'];
    const itemsMap: { [id: string]: ComponentNode } = {
        'body': { type: 'acceptsChild', id: 'body', name: 'Root', open: oldBody ? oldBody.open : true, children: [], index: 1 },
    };
    const manifestRegistry = manifestRegistryController.readManifestRegistry();

    Object.keys(tree.nodes).forEach((id) => {
        const node = tree.nodes[id];
        const manifest = manifestRegistry[node.meta.manifestSchemaId].components.find(
            (curr) => {
                return curr.pkg === node.meta.pkg && curr.component.meta.key === node.meta.key;
            }
        );
        const acceptsChild = manifest?.component?.dev?.acceptsChild ? 'acceptsChild' : 'normal';
        const oldBody = oldItemsMap[node.id];
        itemsMap[node.id] = { type: acceptsChild, id: node.id, name: node.state.alias, open: oldBody ? oldBody.open : true, children: [], index: node.state.parent.index };
    });
    const items: ComponentNode[] = [itemsMap['body']];
    Object.keys(itemsMap).forEach((id) => {
        const node = tree.nodes[id];
        if (!node) {
            return;
        }
        const parent = itemsMap[node.state.parent.id];
        if (parent && parent.type === 'acceptsChild') {
            parent.children?.push(itemsMap[id]);
            parent.children = parent.children?.sort((a, b) => a.index - b.index);
        }
    });
    return { items: items.sort((a, b) => a.name.localeCompare(b.name)), oldItems: itemsMap };
}