from pathlib import Path
from ..utils.printd import printd
from ..utils.pipenv_utils import pipenv_where
from typing import List
from .. import atri_app_dir, controllers_dir, assets_dir, app_config_file
from ..utils.call_serve import get_common_command

def create_dockerfile_with_pipenv(out_file: str = "Dockerfile"):
    """
    Creates Dockerfile at the root of the project.
    """
    pipenv_root_dir = pipenv_where()
    if pipenv_root_dir == None:
        print("Cannot find pipenv root directory.",
            "Please make sure that you are trying to create Dockerfile",
            "from inside a pipenv project")
        return

    user_dir = "/home/python_user"
    code_dir = user_dir + "/code"
    start_script_path = user_dir + "/start.sh"

    docker_commands: List[str] = []
    docker_commands.append("FROM atrilabs/node16brew")
    docker_commands.append("USER python_user")
    docker_commands.append("RUN mkdir {}".format(code_dir))

    output_path = Path(pipenv_root_dir) / out_file

    if Path.exists(output_path):
        printd("Dockerfile already exists. This command will overwrite the existing file.")

    pipfile_lock_path = Path(pipenv_root_dir) / "Pipfile.lock"
    if Path.exists(pipfile_lock_path):
        docker_commands.append("COPY Pipfile.lock /home/python_user/code")
    
    pipfile_path = Path(pipenv_root_dir) / "Pipfile"
    if Path.exists(pipfile_path):
        docker_commands.append("COPY Pipfile /home/python_user/code")

    # Assuming atri app root is already set as cwd.
    # The atri app root may not be same as pipenv project root.
    assets_path = Path.cwd() / assets_dir
    controllers_path = Path.cwd() / controllers_dir
    atri_app_path = Path.cwd() / atri_app_dir
    app_config_file_path = Path.cwd() / app_config_file

    assets_rel_path = assets_path.relative_to(pipenv_root_dir).as_posix()
    controllers_rel_path = controllers_path.relative_to(pipenv_root_dir).as_posix()
    atri_app_rel_path = atri_app_path.relative_to(pipenv_root_dir).as_posix()
    app_config_file_rel_path = app_config_file_path.relative_to(pipenv_root_dir).as_posix()

    docker_commands.append("COPY {} {}/{}".format(assets_rel_path, code_dir, assets_rel_path))
    docker_commands.append("COPY {} {}/{}".format(controllers_rel_path, code_dir, controllers_rel_path))
    docker_commands.append("COPY {} {}/{}".format(atri_app_rel_path, code_dir, atri_app_rel_path))
    docker_commands.append("COPY {} {}/{}".format(app_config_file_rel_path, code_dir, app_config_file_rel_path))

    # TODO: add command to execute python controller server & node server
    start_script_commands: List[str] = []
    start_script_commands.append("cd {}".format(code_dir))
    start_script_commands.append("pipenv run {} &".format(get_common_command()))
    start_script_commands.append("cd {}/{}".format(code_dir, atri_app_rel_path))
    start_script_commands.append("yarn run server".format(get_common_command()))  

    docker_commands.append('RUN echo "{}" > {}'.format("\\n".join(start_script_commands), start_script_path))

    # change ownership of /home/python_user
    docker_commands.append("USER root")
    docker_commands.append("RUN chown -R python_user {}".format(user_dir))

    # install npm packages
    docker_commands.append("WORKDIR {}/{}".format(code_dir, atri_app_rel_path))
    docker_commands.append("RUN yarn install && yarn run build && yarn run buildServer")

    # install python packages
    docker_commands.append("RUN python3 -m pip install pipenv")
    docker_commands.append("WORKDIR {}".format(code_dir))
    docker_commands.extend([
        "ENV LANG C.UTF-8",
        "ENV LC_ALL C.UTF-8",
        "ENV PYTHONDONTWRITEBYTECODE 1",
        "ENV PYTHONFAULTHANDLER 1"
        ])
    docker_commands.append("RUN PIPENV_VENV_IN_PROJECT=1 pipenv install")

    docker_commands.append("RUN chown -R python_user {}".format(user_dir))
    docker_commands.append("USER python_user")
    docker_commands.append('CMD ["{}"]'.format(start_script_path))

    with open(output_path, "w") as f:
        f.write("\n".join(docker_commands))
