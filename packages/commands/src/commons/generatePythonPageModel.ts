export function generatePythonPageModel(
  compAlias: { alias: string; compKey: string; pythonPkg: string }[]
) {
  const importSets = new Set<string>();
  compAlias.forEach(({ compKey, pythonPkg }) => {
    importSets.add(`from ${pythonPkg} import ${compKey}`);
  });

  return `from typing import Union, Any
  ${Array.from(importSets).join("\n")}
  
  class Page:
	  def __init__(self, state: Union[Any, None]):
		  self.event_data = None
		  self.event_alias = None
		  self._setter_access_tracker = {}
		  ${compAlias
        .map(({ alias }) => {
          return `self.${alias} = state["${alias}"]`;
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
  
	  ${compAlias
      .map(({ alias, compKey }) => {
        return `@property
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
			  ${compAlias
          .map(({ alias }) => {
            return `"${alias}": self._${alias}`;
          })
          .join(",\n")}
			  }
  `;
}
