import sys
if sys.version_info >= (3, 8):
    from typing import TypedDict
else:
    from typing_extensions import TypedDict
import json
import importlib
from fastapi import Request, Response

class RouteDetails(TypedDict):
    atriPy: str
    mainPy: str

def get_route_details(route: str, routes_dir: str):
    """
    Converts the route such as shown below:

    /               routes.index
    /country        routes.country
    /country/usa    routes.country.usa
    
    If this module (controllers/server.py) is not the root package,
    then the conversions look like following:

    /               .routes.index
    /country        .routes.country
    /country/usa    .routes.country.usa
    """
    if route == "/":
        replaceWith = ".index"
    else:
        replaceWith = route.replace("/", ".")
    modelPy = ("." if __package__ != "" else "") + routes_dir + replaceWith + "_model"
    entryPy = ("." if __package__ != "" else "") + routes_dir + replaceWith
    routeDetails = {"modelPy": modelPy, "entryPy": entryPy}
    return routeDetails

def record_changes(at, root):
    has_set_in_path = False
    set_keys = {}
    if hasattr(at, "_setter_access_tracker"):
        # check if _setter_access_tracker has any keys
        set_fields = getattr(at, "_setter_access_tracker")

        for k in list(set_fields.keys()):
            root[k] = getattr(at, k)
            set_keys[k] = True

        if len(set_fields.keys()) > 0:
            has_set_in_path = True

    if hasattr(at, "_getter_access_tracker"):
        accessed_props = getattr(at, "_getter_access_tracker")

        get_keys = [k for k in list(accessed_props.keys()) if k not in set_keys]

        for k in get_keys:
            root[k] = {}
            has_aleast_a_set_property = record_changes(getattr(at, k), root[k])
            if has_aleast_a_set_property == True:
                has_set_in_path = True
            else:
                root.pop(k)
        
    return has_set_in_path

class AtriEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, "_to_json_fields"):
            return getattr(obj, "_to_json_fields")()
        return super(AtriEncoder, self).default(obj)
    
def compute_new_state(route: RouteDetails, incoming_state, event, req: Request, res: Response):
    # Create page object with event info inserted
    model_mod = importlib.import_module(route["modelPy"], __package__)
    Page = getattr(model_mod, "Page")
    page_obj = Page(incoming_state)
    getattr(page_obj, "set_event")(event)
    # Pass the page object through the handle_event function
    entry_mod = importlib.import_module(route["entryPy"], __package__)
    if hasattr(entry_mod, "handle_event"):
        handle_event = getattr(entry_mod, "handle_event")
        handle_event(page_obj, req, res)
    # remove event_data from page_obj to make the response smaller
    delattr(page_obj, "event_data")
    # figure out which parts of the page_obj has been modified
    recorder = {}
    record_changes(page_obj, recorder)
    return recorder

def compute_page_request(route: RouteDetails, incoming_state, req: Request, res: Response, query: str):
    # Create page object with event info inserted
    model_mod = importlib.import_module(route["modelPy"], __package__)
    Page = getattr(model_mod, "Page")
    page_obj = Page(incoming_state)
    # Pass the page object through the handle_event function
    entry_mod = importlib.import_module(route["entryPy"], __package__)
    if hasattr(entry_mod, "handle_page_request"):
        handle_page_request = getattr(entry_mod, "handle_page_request")
        handle_page_request(page_obj, req, res, query)
    # figure out which parts of the page_obj has been modified
    recorder = {}
    record_changes(page_obj, recorder)
    return recorder

def compute_init_state(route: RouteDetails, incoming_state):
    # Create page object with event info inserted
    model_mod = importlib.import_module(route["modelPy"], __package__)
    Page = getattr(model_mod, "Page")
    page_obj = Page(incoming_state)
    # Pass the page object through the handle_event function
    entry_mod = importlib.import_module(route["entryPy"], __package__)
    if hasattr(entry_mod, "handle_init_state"):
        handle_init_state = getattr(entry_mod, "handle_init_state")
        handle_init_state(page_obj)
    # figure out which parts of the page_obj has been modified
    recorder = {}
    record_changes(page_obj, recorder)
    return recorder