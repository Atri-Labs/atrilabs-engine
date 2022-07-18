"""This script is the entrypoint for command line utilities provided in Atri Framework."""
import sys
import click
import asyncio
from .commands.open_editor import run as exe_open_editor, open_editor as open_editor_fn
from .commands.connect_local import run as exe_connect_local, start_ipc_connection
from .utils.globals import globals
from .commands.check_requisite import check_requisite
import webbrowser
from asyncio.exceptions import CancelledError
from .utils.printd import printd
import signal
from .find_app_root import find_and_set_app_directory, get_virtualenv_type, is_virtualenv_set, set_virtualenv_type
from . import supported_virt_types
import questionary

find_and_set_app_directory()

class QuestionaryOption(click.Option):

    def __init__(self, param_decls=None, **attrs):
        click.Option.__init__(self, param_decls, **attrs)
        if not isinstance(self.type, click.Choice):
            raise Exception('ChoiceOption type arg must be click.Choice')

    def prompt_for_value(self, ctx):
        if is_virtualenv_set():
            return None
        val = questionary.select(self.prompt, choices=self.type.choices).unsafe_ask()
        return val

@click.group()
@click.option("--virt-type", type=click.Choice(supported_virt_types, case_sensitive=False), prompt="Select virtual environment type. Use arrow keys.", cls=QuestionaryOption)
def main(virt_type: str):
    """Open up the visual editor:

        $ atri open editor

    Click publish in the editor once you are done.

    Write your python controllers in controller directory.

    Run dev server during development for automatic refresh whenever you make changes to your code or hit publish in your editor.

        $ atri run dev-server
    
    """
    if not is_virtualenv_set():
        set_virtualenv_type(virt_type)

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
@click.option('--d-port', default="4005", help='port on which generate app server will be attached')
@click.option('--u-port', default="4006", help='port on which ipc server will be attached')
@click.option('--c-port', default="4007", help='port on which generated python server will be attached')
@click.option('--app-dir', default='.', help='directory that contains events/')
@click.option('--no-debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def open_editor(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir, no_debug):
    """Open up editor in browser using command -

        $ atri open editor --e-port 4001 --w-port 4002 --app-dir atri
    """
    globals["in_debug_mode"] = not no_debug
    exe_open_editor(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir)

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
@click.option('--d-port', default="4005", help='port on which generate app server will be attached')
@click.option('--u-port', default="4006", help='port on which ipc server will be attached')
@click.option('--c-port', default="4007", help='port on which generated python server will be attached')
@click.option('--app-dir', default='.', help='directory that contains events/')
@click.option('--debug', is_flag = True, default=False, show_default=True, help='run the command in debug mode')
def start(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir, debug):
    globals["in_debug_mode"] = debug
    async def check_req_wrapper():
        ok = await check_requisite()
        return ok
    async def open_editor_wrapper():
        child_proc = await open_editor_fn(e_port, w_port, m_port, p_port, d_port, u_port, c_port, app_dir)
        # terminate docker process if SIGINT, SIGTERM is received
        def handle_signal(a, b):
            child_proc.terminate()
        signal.signal(signal.SIGINT, handle_signal)
        signal.signal(signal.SIGTERM, handle_signal)
        print("Success! Visit http://localhost:4002 to access the editor.")
        await asyncio.sleep(2)
        webbrowser.open("http://localhost:4002", new=0, autoraise=True)
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
            try:
                await asyncio.wait([open_editor_task, connect_local_task])
            except CancelledError:
                # socket.io AsyncClient throws CancelledError
                # closing stderr to prevent showing error
                sys.stdout.close()
                sys.stderr.close()
            except:
                print("Some error occured while closing atri cli.")
                printd(sys.exc_info())
                exit(1)
            exit(0)
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