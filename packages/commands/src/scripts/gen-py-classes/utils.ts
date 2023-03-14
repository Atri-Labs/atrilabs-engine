import { ComponentTypes } from "../../commons/types";

function createImports(componentType: ComponentTypes) {
  const importsFromTyping = new Set(["Any", "Union"]);
  if (componentType === "repeating") {
    importsFromTyping.add("TypeVar");
    importsFromTyping.add("Generic");
  }
  const imports = `from typing import ${Array.from(importsFromTyping).join(
    ", "
  )}
from atri_core import AtriComponent`;
  return imports;
}

function createCustomClass(
  compKey: string,
  props: string[],
  componentType: ComponentTypes
) {
  return `${componentType === "repeating" ? `T = TypeVar("T")` : ""}

class ${compKey}CustomClass(${
    componentType === "repeating" ? "Generic[T]" : ""
  }):
	def __init__(self, state: Union[Any, None]):
		self._setter_access_tracker = {}
		${props
      .map((prop) => {
        if (componentType === "repeating" && prop === "data") {
          return `self.${prop}: Union[T, None] = state["${prop}"] if state != None and "${prop}" in state else []`;
        }
        return `self.${prop}: Union[Any, None] = state["${prop}"] if state != None and "${prop}" in state else None`;
      })
      .join("\n\t\t")}
		self._setter_access_tracker = {}
		self._getter_access_tracker = {}

	${props
    .map((prop) => {
      return `@property
	def ${prop}(self):
		self._getter_access_tracker["${prop}"] = {}
		return self._${prop}
	@${prop}.setter
	def ${prop}(self, state):
		self._setter_access_tracker["${prop}"] = {}
		self._${prop} = state`;
    })
    .join("\n\t")}

	def _to_json_fields(self):
		return {\n${props
      .map((prop) => {
        return `\t\t\t"${prop}": self._${prop}`;
      })
      .join(",\n")}\n\t\t\t}`;
}

function createComponentClass(
  compKey: string,
  nodePkg: string,
  callbacks: string[]
) {
  return `
class ${compKey}(AtriComponent):
	def __init__(self, state: Union[Any, None]):
		super().__init__(state)
		self._setter_access_tracker = {}
		self.compKey = "${compKey}"
		self.nodePkg = "${nodePkg}"
		${callbacks
      .map((callback) => {
        return `self.${callback} = False`;
      })
      .join("\n\t\t")}
		self.custom = state["custom"] if state != None and "custom" in state else None
		self._setter_access_tracker = {}
		self._getter_access_tracker = {}

	@property
	def custom(self):
		self._getter_access_tracker["custom"] = {}
		return self._custom
	@custom.setter
	def custom(self, state):
		self._setter_access_tracker["custom"] = {}
		self._custom = ${compKey}CustomClass(state)

	def _to_json_fields(self):
		return {
			"styles": self._styles,
			"custom": self._custom,
			}`;
}

export function createComponentClassFile(options: {
  compKey: string;
  nodePkg: string;
  callbacks: string[];
  customProps: string[];
  componentType: ComponentTypes;
}) {
  return `${createImports(options.componentType)}\n\n${createCustomClass(
    options.compKey,
    options.customProps,
    options.componentType
  )}\n\n${createComponentClass(
    options.compKey,
    options.nodePkg,
    options.callbacks
  )}`;
}

export function createInitPyFile(compKeys: string[]) {
  return compKeys
    .map((compKey) => `from .${compKey} import ${compKey}`)
    .join("\n");
}
