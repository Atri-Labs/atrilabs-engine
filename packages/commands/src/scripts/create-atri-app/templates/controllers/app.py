#!/usr/bin/python
from fastapi import FastAPI, Request, Response
import json
if __package__ == "":
    from utils import get_route_details, compute_new_state, AtriEncoder, compute_page_request, compute_init_state
else:
    from .utils import get_route_details, compute_new_state, AtriEncoder, compute_page_request, compute_init_state
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

if os.environ["MODE"] == "development":
    origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["x-location"]
    )

@app.post("/_atri/api/event")
async def handle_event(req: Request, res: Response):
    req_dict = await req.json()
    route = req_dict["route"]
    state = req_dict["state"]
    event_data = req_dict["eventData"] if "eventData" in req_dict else None
    callback_name = req_dict["callbackName"]
    alias = req_dict["alias"]
    repeating = req_dict["repeating"] if "repeating" in req_dict else None
    event = {"event_data": event_data, "callback_name": callback_name, "alias": alias, "repeating": repeating}
    routeDetails = get_route_details(route, "routes")
    delta = compute_new_state(routeDetails, state, event, req, res)
    res.body = bytes(json.dumps(delta, cls=AtriEncoder), encoding="utf-8")
    res.media_type = "application/json"
    res.status_code = 200
    return res

@app.post("/_atri/api/page")
async def handle_page_request(req: Request, res: Response):
    req_dict = await req.json()
    route = req_dict["route"]
    state = req_dict["state"]
    query = req_dict["query"] if "query" in req_dict else ""
    routeDetails = get_route_details(route, "routes")
    delta = compute_page_request(routeDetails, state, req, res, query)
    res.body = bytes(json.dumps(delta, cls=AtriEncoder), encoding="utf-8")
    res.media_type = "application/json"
    res.status_code = 200
    return res

@app.post("/_atri/api/init")
async def get_init_state(req: Request, res: Response):
    req_dict = await req.json()
    route = req_dict["route"]
    incoming_state = req_dict["state"]
    routeDetails = get_route_details(route, "routes")
    delta = compute_init_state(routeDetails, incoming_state)
    res.body = bytes(json.dumps(delta, cls=AtriEncoder), encoding="utf-8")
    res.media_type = "application/json"
    res.status_code = 200
    return res