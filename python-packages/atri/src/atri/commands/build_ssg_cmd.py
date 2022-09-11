from .load_exe import get_exe
from ..utils.run_shell_cmd import run_shell_cmd
from ..utils.globals import globals
from pathlib import Path
import tempfile
import json
import traceback
import shlex

async def run_gen_cmd():
    generate_proc = await run_shell_cmd(
        " ".join([str(get_exe()), "gen"]),
        str(Path.cwd()),
        not globals["in_debug_mode"]
    )
    await generate_proc.wait()
    return generate_proc

async def write_info_cmd(app_info_filename: str):
    writeinfo_proc = await run_shell_cmd(
        " ".join([str(get_exe()), "writeinfo", app_info_filename]),
        str(Path.cwd()),
        not globals["in_debug_mode"]
    )
    await writeinfo_proc.wait()
    return writeinfo_proc

async def build_react_cmd(app_info_filename: str):
    with open(app_info_filename) as f:
        app_info = json.load(f)
        dumped_app_info = json.dumps(app_info)
        # TODO: add data by invoking controllers' init_state
        dumped_props = json.dumps({})
        build_react_proc = await run_shell_cmd(
            " ".join([
                str(get_exe()),
                "build-react",
                shlex.quote(dumped_app_info),
                shlex.quote(dumped_props)
            ]),
            str(Path.cwd()),
            not globals["in_debug_mode"]
        )
        await build_react_proc.wait()
        return build_react_proc

async def build_ssg_cmd():
    generate_proc = await run_gen_cmd()
    if generate_proc.returncode == 0:
        print("Generated initial code")
        fd, app_info_filename = tempfile.mkstemp(".json")
        try:        
            writeinfo_proc = await write_info_cmd(app_info_filename)
            if writeinfo_proc.returncode == 0:
                print("Created temporary app info")
                build_react_proc = await build_react_cmd(app_info_filename)
                if build_react_proc.returncode == 0:
                    print("Init state added to app")
                else:
                    print("build react code", build_react_proc.returncode)
        except:
            print(traceback.print_exc())

        Path.unlink(Path(app_info_filename))

    child_proc = await run_shell_cmd(
        " ".join([str(get_exe()), "build", "ssg"]),
        str(Path.cwd() / "atri_app"),
        not globals["in_debug_mode"]
        )
    return child_proc

async def build_ssg_cmd_wrapper():
    child_proc = await build_ssg_cmd()
    await child_proc.wait()
    if child_proc.returncode == 0:
        print("SSG build successfull!")