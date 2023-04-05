import { ComponentTypes } from "../../commons/types";

function createImports(componentType: ComponentTypes) {
  const importsFromTyping = new Set(["Any", "Union"]);
  if (componentType === "repeating") {
    importsFromTyping.add("TypeVar");
    importsFromTyping.add("Generic");
    importsFromTyping.add("List");
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
	def __init__(self, state: Union[Any, None]${
    componentType === "repeating" ? `, WrapperClass: T` : ""
  }):
		self._setter_access_tracker = {}
		${componentType === "repeating" ? "self._WrapperClass = WrapperClass" : ""}
		${props
      .map((prop) => {
        if (componentType === "repeating" && prop === "data") {
          return `self.${prop}: Union[List[T], None] = state["${prop}"] if state != None and "${prop}" in state else []`;
        }
        return `self.${prop}: Union[Any, None] = state["${prop}"] if state != None and "${prop}" in state else None`;
      })
      .join("\n\t\t")}
		self._setter_access_tracker = {}
		self._getter_access_tracker = {}

	${props
    .map((prop) => {
      if (componentType === "repeating" && prop === "data") {
        return `@property
\tdef data(self):
\t\tself._getter_access_tracker["data"] = {}
\t\treturn self._data
\t@data.setter
\tdef data(self, state):
\t\tself._setter_access_tracker["data"] = {}
\t\tif type(state) == list:
\t\t\tself._data = [self._WrapperClass(state[i]) for i in range(len(state))]
\t\telse:
\t\t\tself._data = []`;
      }
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
    all_fields = {\n${props
      .map((prop) => {
        return `\t\t\t"${prop}": self._${prop}`;
      })
      .join(",\n")}\n\t\t\t}
    return {k: v for k, v in all_fields.items() if v is not None}`;
}

function createComponentClass(
  compKey: string,
  nodePkg: string,
  callbacks: string[],
  componentType: ComponentTypes
) {
  return `
class ${compKey}(AtriComponent${
    componentType === "repeating" ? ", Generic[T]" : ""
  }):
	def __init__(self, state: Union[Any, None]${
    componentType === "repeating" ? ", WrapperClass: T" : ""
  }):
		super().__init__(state)
		self._setter_access_tracker = {}
		${componentType === "repeating" ? "self._WrapperClass = WrapperClass" : ""}
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
		self._custom = ${compKey}CustomClass${
    componentType === "repeating" ? "[T]" : ""
  }(state${componentType === "repeating" ? ", self._WrapperClass" : ""})

	def _to_json_fields(self):
    all_fields = {
			"styles": self._styles,
			"custom": self._custom,
			}
    return {k: v for k, v in all_fields.items() if v is not None}`;
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
    options.callbacks,
    options.componentType
  )}`;
}

export function createInitPyFile(compKeys: string[]) {
  return compKeys
    .map((compKey) => `from .${compKey} import ${compKey}`)
    .join("\n");
}
