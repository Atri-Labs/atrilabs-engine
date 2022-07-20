#!/usr/bin/python
import sys
from fastapi import FastAPI, Request
import importlib
import click
import json
import uvicorn
from typing import TypedDict
from jsonpickle import encode

in_prod = False

def import_module(mod_name: str):
    # always import un-imported module
    mod_name_with_pkg_prefix = __package__ + mod_name
    if mod_name_with_pkg_prefix not in sys.modules:
        return importlib.import_module(mod_name, package=__package__)
    # handle already imported module
    if in_prod:
        return sys.modules[mod_name_with_pkg_prefix]
    else:
        return importlib.reload(sys.modules[mod_name_with_pkg_prefix])

class RouteDetails(TypedDict):
    atriPy: str
    mainPy: str

def getRouteDetails(route: str, routes_dir: str) -> RouteDetails:
    if route == "/":
        replaceWith = ""
    else:
        replaceWith = route.replace("/", ".")
    atriPy = "." + routes_dir + replaceWith + ".atri"
    mainPy = "." + routes_dir + replaceWith + ".main"
    routeDetails: RouteDetails = {"atriPy": atriPy, "mainPy": mainPy}
    return routeDetails

def compute_initial_state(route: RouteDetails, incoming_state):
    atri_py = route["atriPy"]
    atri_mod = import_module(atri_py)
    Atri = getattr(atri_mod, "Atri")
    atri_obj = Atri(incoming_state)
    main_py = route["mainPy"]
    main_mod = import_module(main_py)
    init_state = getattr(main_mod, "init_state")
    init_state(atri_obj)
    return atri_obj

def compute_new_state(route: RouteDetails, incoming_state, event):
    atri_py = route["atriPy"]
    atri_mod = import_module(atri_py)
    Atri = getattr(atri_mod, "Atri")
    atri_obj = Atri(incoming_state)
    getattr(atri_obj, "set_event")(event)
    main_py = route["mainPy"]
    main_mod = import_module(main_py)
    handle_event = getattr(main_mod, "handle_event")
    handle_event(atri_obj)
    delattr(atri_obj, "event_data")
    return atri_obj

@click.group()
@click.option("--dir", default="routes", help="relative path for directory containing controller for each route")
@click.pass_context
def main(ctx, dir):
    ctx.obj = {"dir": dir}

@main.command("serve")
@click.option("--port", default="4007")
@click.option("--host", default="0.0.0.0")
@click.option("--prod", is_flag=True, default=False, show_default=True)
@click.pass_obj
def serve(obj, port, host, prod):
    global in_prod
    in_prod = prod

    app = FastAPI()

    @app.post("/init")
    async def get_init_state(req: Request):
        req_dict = await req.json()
        route = req_dict["route"]
        incoming_state = req_dict["state"]
        return compute_initial_state(route, incoming_state)

    @app.post("/event")
    async def handle_event(req: Request):
        req_dict = await req.json()
        route = req_dict["route"]
        state = req_dict["state"]
        event_data = req_dict["eventData"]
        callback_name = req_dict["callbackName"]
        alias = req_dict["alias"]
        event = {"event_data": event_data, "callback_name": callback_name, "alias": alias}
        routeDetails = getRouteDetails(route, obj["dir"])
        return compute_new_state(routeDetails, state, event)

    uvicorn.run(app, host=host, port=int(port))

@main.command("compute")
@click.option("--route", required=True)
@click.option("--state", required=True)
@click.pass_obj
def compute(obj, route, state):
    incoming_state = json.loads(state)
    routeDetails = getRouteDetails(route, obj["dir"])
    updated_state = compute_initial_state(routeDetails, incoming_state)
    print(encode({"statusCode": 200, "state": updated_state}, unpicklable=False))

if __name__ == '__main__':
    main()