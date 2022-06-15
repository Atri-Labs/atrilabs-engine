#!/usr/bin/python
from fastapi import FastAPI, Request
from importlib import import_module
import click
import json
import uvicorn

controller_dir = ""

def compute_initial_state(route: str, incoming_state):
    # atri & main script location (use something like path)
    atri_py = controller_dir + route + "atri.py"
    atri_mod = import_module(atri_py)
    update_state = getattr(atri_mod, "update_state")
    update_state(incoming_state)
    main_py = controller_dir + route + "main.py"
    main_mod = import_module(main_py)
    init_state = getattr(main_mod, "init_state")
    init_state()
    get_state = getattr(atri_mod, "get_state")
    return get_state()

@click.group()
@click.option("--dir", default="controllers")
def main(dir):
    global controller_dir
    controller_dir = dir
    pass

@main.command("serve")
@click.option("--port", default="4005")
@click.option("--host", default="0.0.0.0")
def serve(port, host):
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
@click.option("--route")
@click.option("--incoming_state")
def compute(route, incoming_state):
    incoming_state = json.load(incoming_state)
    updated_state = compute_initial_state(route, incoming_state)
    print(json.dumps({"statusCode": 200, "state": updated_state}))