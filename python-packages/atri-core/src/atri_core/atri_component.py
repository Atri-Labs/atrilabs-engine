from typing import Any, Optional

from .atri_styles import AtriStyles


class AtriComponent:
    """
    AtriComponent is the base class for all Atri components.
    """
    def __init__(self, state: Optional[Any]):
        self.styles: Optional[AtriStyles] = state["styles"] if state != None and "styles" in state else None
        self._styles = None

        self._setter_access_tracker = {}
        self._getter_access_tracker = {}

    @property
    def styles(self) -> Optional[AtriStyles]:
        """
        The styles of the component.
        
        Returns:
            Optional[AtriStyles]: The styles of the component.
        """
        self._getter_access_tracker["styles"] = {}
        return self._styles

    @styles.setter
    def styles(self, value: Optional[Any]):
        """
        The styles of the component.
        
        Args:
            value (Optional[Any]): The styles of the component.
        """
        self._setter_access_tracker["styles"] = {}
        self._styles = AtriStyles(value)

    def _to_json_fields(self) -> dict:
        return {"styles": self._styles}

__all__ = ["AtriComponent"]
