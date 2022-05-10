"""This script is the entrypoint for command line utilities provided in Atri Framework."""
import click

@click.group()
def main():
    """Open up the visual editor:

        $ atri open editor

    Click publish in the editor once you are done.

    Write your python controllers in controller directory.

    Run dev server during development for automatic refresh whenever you make changes to your code or hit publish in your editor.

        $ atri run dev-server
    
    """
    pass

@main.group("open")
def open():
    """Open up editor in browser using command -

        $ atri open editor
    """
    pass

@open.command("editor")
def open_editor():
    """Open up editor in browser using command -

        $ atri open editor --port 4000
    """
    pass

@main.group("run")
def run():
    """Run dev server during development for automatic refresh whenever you make changes to your code or hit publish in your editor.

        $ atri run dev-server
    """
    pass

@run.command("dev-server")
def dev_server():
    """Run dev server during development for automatic refresh whenever you make changes to your code or hit publish in your editor.

        $ atri run dev-server
    """
    pass