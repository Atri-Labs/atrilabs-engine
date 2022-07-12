"""This script is the entrypoint for command line utilities provided in Atri Framework."""
import click
import asyncio
from .commands.open_editor import run as exe_open_editor, open_editor as open_editor_fn
from .commands.connect_local import run as exe_connect_local, start_ipc_connection
from .utils.globals import globals
from .commands.check_requisite import check_requisite

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
@click.option('--u-port', default="4006", help='port on which ipc server will be attached')
@click.option('--app-dir', default='.', help='directory that contains events/')
@click.option('--no-debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def open_editor(e_port, w_port, m_port, p_port, u_port, app_dir, no_debug):
    """Open up editor in browser using command -

        $ atri open editor --e-port 4001 --w-port 4002 --app-dir atri
    """
    globals["in_debug_mode"] = not no_debug
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
@click.option('--no-debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def connect_local(u_port, app_dir, no_debug):
    globals["in_debug_mode"] = not no_debug
    exe_connect_local(u_port, app_dir)

@main.command()
@click.option('--e-port', default="4001", help='port on which event server will be attached')
@click.option('--w-port', default="4002", help='port on which file server will be attached to serve static files')
@click.option('--m-port', default="4003", help='port on which manifest server will be attached')
@click.option('--p-port', default="4004", help='port on which publish server will be attached')
@click.option('--u-port', default="4006", help='port on which ipc server will be attached')
@click.option('--app-dir', default='.', help='directory that contains events/')
@click.option('--debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def start(e_port, w_port, m_port, p_port, u_port, app_dir, debug):
    globals["in_debug_mode"] = debug
    async def check_req_wrapper():
        ok = await check_requisite()
        return ok
    async def open_editor_wrapper():
        child_proc = await open_editor_fn(e_port, w_port, m_port, p_port, u_port, app_dir)
        await child_proc.wait()
    async def connect_local_wrapper():
        sio = await start_ipc_connection(u_port, app_dir)
        await sio.wait()
    async def main_wrapper():
        ok = await check_req_wrapper()
        if ok:
            open_editor_task = asyncio.create_task(
                open_editor_wrapper()
                )
            connect_local_task = asyncio.create_task(
                connect_local_wrapper()
            )
            await asyncio.wait([open_editor_task, connect_local_task])
    # Now run the tasks(in the event loop) 
    asyncio.run(main_wrapper())

@main.group()
def check():
    pass

@check.command()
@click.option('--no-debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def req(no_debug):
    globals["in_debug_mode"] = not no_debug
    ok = asyncio.run(check_requisite())
    if not ok:
        print("If you want to report this issue,",
        "please use our discussion forum https://discuss.atrilabs.com")

if __name__ == '__main__':
    main()