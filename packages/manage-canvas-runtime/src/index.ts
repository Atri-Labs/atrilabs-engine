import { manifestRegistryController } from "@atrilabs/core";
import ComponentManifestId from "@atrilabs/react-component-manifest-schema?id";
const findComponentInRegistry = (args: StartDragArgs) => {
  const registry = manifestRegistryController.readManifestRegistry();
  const entry = registry[ComponentManifestId].components.find((curr) => {
    if (args.dragData.type === "component")
      return (
        curr.pkg === args.dragData.data.pkg &&
        curr.component.meta.key === args.dragData.data.key
      );
    return false;
  });
  if (entry) {
    const manifest = entry.component;
    console.log("manifest", manifest);
  }
};
