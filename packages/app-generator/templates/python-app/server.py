#!/usr/bin/python
from fastapi import FastAPI, Request
from importlib import import_module
import click
import json
import uvicorn
from typing import TypedDict


class RouteDetails(TypedDict):
    atriPy: str
    mainPy: str

def compute_initial_state(route: RouteDetails, incoming_state):
    main_py = route["mainPy"]
    main_mod = import_module(main_py)
    init_state = getattr(main_mod, "init_state")
    init_state(incoming_state)
    return incoming_state

@click.group()
@click.option("--dir", default="routes", help="relative path for directory containing controller for each route")
@click.pass_context
def main(ctx, dir):
    ctx.obj = {"dir": dir}

@main.command("serve")
@click.option("--port", default="4005")
@click.option("--host", default="0.0.0.0")
@click.pass_obj
def serve(obj, port, host):
    app = FastAPI()

    @app.post("/init")
    async def get_init_state(req: Request):
        req_dict = await req.json()
        route = req.url._url
        incoming_state = req_dict["state"]
        return compute_initial_state(route, incoming_state)

    @app.post("/event")
    async def handle_event(req: Request):
        pass

    uvicorn.run(app, host=host, port=int(port))

@main.command("compute")
@click.option("--route", required=True)
@click.option("--state", required=True)
@click.pass_obj
def compute(obj, route, state):
    incoming_state = json.loads(state)
    atriPy = obj["dir"] + route[1:].replace("/", ".") + ".atri"
    mainPy = obj["dir"] + route[1:].replace("/", ".") + ".main"
    routeDetails: RouteDetails = {"atriPy": atriPy, "mainPy": mainPy}
    updated_state = compute_initial_state(routeDetails, incoming_state)
    print(json.dumps({"statusCode": 200, "state": updated_state}))

if __name__ == '__main__':
    main()