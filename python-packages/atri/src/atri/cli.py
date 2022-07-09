"""This script is the entrypoint for command line utilities provided in Atri Framework."""
from email.policy import default
import click
from commands.open_editor import run as exe_open_editor
from commands.connect_locally import run as exe_connect_locally

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

@main.group('open')
def open():
    """Open up editor in browser using command:

        $ atri open editor
    """
    pass

@open.command('editor')
@click.option('--e-port', default="4001", help='port on which event server will be attached')
@click.option('--w-port', default="4002", help='port on which file server will be attached to serve static files')
@click.option('--m-port', default="4003", help='port on which manifest server will be attached')
@click.option('--p-port', default="4004", help='port on which publish server will be attached')
@click.option('--u-port', default="4006", help='port on which publish server will be attached')
@click.option('--app-dir', default='.', help='directory that contains events/')
def open_editor(e_port, w_port, m_port, p_port, u_port, app_dir):
    """Open up editor in browser using command -

        $ atri open editor --e-port 4001 --w-port 4002 --app-dir atri
    """
    exe_open_editor(e_port, w_port, m_port, p_port, u_port, app_dir)

@main.group('connect')
def connect():
    """This command is intended to connect with ipc server when running locally (not inside docker)

        $ atri connect_local
    """
    pass

@connect.command("local")
@click.option('--u-port', default="4006", help='port on which publish server will be attached')
@click.option('--app-dir', default='.', help='directory that contains events/')
def connect_local(u_port, app_dir):
    exe_connect_locally(u_port, app_dir)

if __name__ == '__main__':
    main()