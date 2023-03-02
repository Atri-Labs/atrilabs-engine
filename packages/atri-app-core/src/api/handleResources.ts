import { ImportedResource } from "..";

export function handleResources(resources: ImportedResource[]) {
  resources.forEach((resource) => {
    if (resource.method === "css") {
      const styleTag = document.createElement("style");
      styleTag.innerHTML = resource.str;
      document.head.appendChild(styleTag);
    }
  });
}
