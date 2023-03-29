import click
import uvicorn
import os
import json
if __package__ == "":
    from utils import get_route_details, compute_new_state, AtriEncoder, compute_page_request, compute_init_state
else:
    from .utils import get_route_details, compute_new_state, AtriEncoder, compute_page_request, compute_init_state
import os
from atri_core.send_ipc_msg import send_ipc_msg

@click.group()
def main():
    pass

@main.command("serve")
@click.option("--port", default="4007")
@click.option("--host", default="0.0.0.0")
@click.option("--prod", is_flag=True, default=False, show_default=True)
def serve(port, host, prod):
    if not prod:
        os.environ["MODE"] = "development"
        print(os.path.dirname(os.path.realpath(__file__)))
        uvicorn.run("app:app", host=host, port=int(port), reload=True, app_dir=os.path.dirname(os.path.realpath(__file__)))
    else:
        os.environ["MODE"] = "production"
        uvicorn.run("app:app", host=host, port=int(port), app_dir=os.path.dirname(os.path.realpath(__file__)))

@main.command("compute")
@click.option("--route", required=True)
@click.option("--state", required=True)
def compute(route: str, state: str):
    state_json = json.loads(state)
    routeDetails = get_route_details(route, "routes")
    new_state = compute_init_state(routeDetails, state_json)
    new_state_str = json.dumps(new_state)
    send_ipc_msg(bytes(new_state_str, encoding="utf8"))

if __name__ == '__main__':
    main()