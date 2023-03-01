export function generatePythonPageModel(
  compDefs: { alias: string; compKey: string; pythonPkg: string }[]
) {
  const importSets = new Set<string>();
  compDefs.forEach(({ compKey, pythonPkg }) => {
    importSets.add(`from ${pythonPkg} import ${compKey}`);
  });

  return `from typing import Union, Any
${Array.from(importSets).join("\n")}
  
class Page:
	def __init__(self, state: Union[Any, None]):
		self.event_data = None
		self.event_alias = None
		self._setter_access_tracker = {}
${compDefs
  .map(({ alias }) => {
    return `\t\tself.${alias} = state["${alias}"]`;
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
  
	${compDefs
    .map(({ alias, compKey }) => {
      return `
	@property
	def ${alias}(self):
		self._getter_access_tracker["${alias}"] = {}
		return self._${alias}
	@${alias}.setter
	def ${alias}(self, new_state):
		self._setter_access_tracker["${alias}"] = {}
		self._${alias} = ${compKey}(new_state)`;
    })
    .join("\n")}
  
	def _to_json_fields(self):
		return {
${compDefs
  .map(({ alias }) => {
    return `\t\t\t"${alias}": self._${alias}`;
  })
  .join(",\n")}
			}
  `;
}
