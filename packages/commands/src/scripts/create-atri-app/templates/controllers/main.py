import click
import uvicorn
import os

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
        uvicorn.run("app:app", host=host, port=int(port), reload=True)
    else:
        os.environ["MODE"] = "production"
        uvicorn.run("app:app", host=host, port=int(port))

if __name__ == '__main__':
    main()