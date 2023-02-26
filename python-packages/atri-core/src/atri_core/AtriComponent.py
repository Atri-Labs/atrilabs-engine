from typing import Any, Union
from .AtriStyles import AtriStyles

class AtriComponent:
	def __init__(self, state: Union[Any, None]):
		self._setter_access_tracker = {}
		self.styles: AtriStyles = state["styles"] if state != None and "styles" in state else None
		self._setter_access_tracker = {}
		self._getter_access_tracker = {}

	@property
	def styles(self):
		self._getter_access_tracker["styles"] = {}
		return self._styles
	@styles.setter
	def styles(self, value):
		self._setter_access_tracker["styles"] = {}
		self._styles = AtriStyles(value)

	def _to_json_fields(self):
		return {
			"styles": self._styles,
			}