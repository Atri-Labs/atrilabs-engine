import type { ComponentTypes } from "./types";

export function generatePythonPageModel(
  compDefs: {
    alias: string;
    compKey: string;
    pythonPkg: string;
    componentType: ComponentTypes;
    childrenAlias: string[];
  }[]
) {
  const importSets = new Set<string>();
  compDefs.forEach(({ compKey, pythonPkg }) => {
    importSets.add(`from ${pythonPkg} import ${compKey}`);
  });

  const repeatingComponentDefs = compDefs.filter((def) => {
    return def.componentType === "repeating";
  });

  const repeatingChildrenAliasSet = new Set<string>();
  compDefs.forEach((compDef) => {
    compDef.childrenAlias.forEach((childAlias) => {
      if (compDef.componentType === "repeating")
        repeatingChildrenAliasSet.add(childAlias);
    });
  });

  const aliasMap: { [alias: string]: typeof compDefs["0"] } = {};
  compDefs.forEach((compDef) => {
    if (repeatingChildrenAliasSet.has(compDef.alias)) {
      aliasMap[compDef.alias] = compDef;
    }
  });

  const notARepeatingChildren = compDefs.filter((def) => {
    return !repeatingChildrenAliasSet.has(def.alias);
  });

  return `from typing import Union, Any
${Array.from(importSets).join("\n")}

${repeatingComponentDefs.map(({ alias, childrenAlias }) => {
  return `class AtriRepeatingChildren${alias}:
	def __init__(self, state: Union[Any, None]):
${
  childrenAlias.length === 0
    ? "\t\tpass"
    : "\t\t# children of repeating component"
}
${childrenAlias
  .map((alias) => {
    return `\t\tself.${alias} = state["${alias}"] if "${alias}" in state else None`;
  })
  .join("\n")}

	${childrenAlias
    .map((alias) => {
      const compKey = aliasMap[alias]!.compKey;
      return `
	@property
	def ${alias}(self):
		return self._${alias}
	@${alias}.setter
	def ${alias}(self, new_state):
		self._${alias} = ${compKey}(new_state)`;
    })
    .join("\n")}

\tdef _to_json_fields(self):
\t\treturn {
${childrenAlias
  .map((alias) => {
    return `\t\t\t"${alias}": self._${alias}`;
  })
  .join(",\n")}
\t\t\t}
    `;
})}
  
class Page:
	def __init__(self, state: Union[Any, None]):
		self.event_data = None
		self.event_alias = None
		self._setter_access_tracker = {}
${notARepeatingChildren
  .map(({ alias, componentType }) => {
    if (componentType === "repeating")
      return `\t\tself.${alias} = state["${alias}"] if "${alias}" in state else []`;
    return `\t\tself.${alias} = state["${alias}"] if "${alias}" in state else None`;
  })
  .join("\n")}
		self._setter_access_tracker = {}
		self._getter_access_tracker = {}
  
	def set_event(self, event):
		self.event_data = event["event_data"]
		self.event_alias = event["alias"]
		callback_name = event["callback_name"]
		comp = getattr(self, self.event_alias)
		setattr(comp, callback_name, True)
  
	${notARepeatingChildren
    .map(({ alias, compKey, componentType }) => {
      return `
	@property
	def ${alias}(self):
		self._getter_access_tracker["${alias}"] = {}
		return self._${alias}
	@${alias}.setter
	def ${alias}(self, new_state):
		self._setter_access_tracker["${alias}"] = {}
		self._${alias} = ${compKey}${
        componentType === "repeating" ? `[AtriRepeatingChildren${alias}]` : ""
      }(new_state${
        componentType === "repeating" ? `, AtriRepeatingChildren${alias}` : ""
      })`;
    })
    .join("\n")}
  
	def _to_json_fields(self):
		return {
${notARepeatingChildren
  .map(({ alias }) => {
    return `\t\t\t"${alias}": self._${alias}`;
  })
  .join(",\n")}
			}
  `;
}
