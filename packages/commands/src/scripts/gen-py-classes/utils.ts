const imports = `from typing import Any, Union
from atri_core.AtriComponent import AtriComponent`;

function createCustomClass(compKey: string, props: string[]) {
  return `class ${compKey}CustomClass:
	def __init__(self, state: Union[Any, None]):
		self._setter_access_tracker = {}
		${props.map((prop) => {
      return `self.${prop}: Union[str, None] = state["${prop}"] if state != None and "${prop}" in state else None`;
    })}
		self._setter_access_tracker = {}
		self._getter_access_tracker = {}

	${props.map((prop) => {
    return `@property
	def ${prop}(self):
		self._getter_access_tracker["${prop}"] = {}
		return self._${prop}
	@text.setter
	def text(self, state):
		self._setter_access_tracker["${prop}"] = {}
		self._${prop} = state`;
  })}

	def _to_json_fields(self):
		return {\n${props
      .map((prop) => {
        return `\t\t\t"${prop}": self._${prop}`;
      })
      .join(",")}\n\t\t\t}`;
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
		${callbacks.map((callback) => {
      return `self.${callback} = False`;
    })}
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
}) {
  return `${imports}\n\n${createCustomClass(
    options.compKey,
    options.customProps
  )}\n\n${createComponentClass(
    options.compKey,
    options.nodePkg,
    options.callbacks
  )}`;
}
