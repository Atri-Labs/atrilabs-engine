from pathlib import Path
from ..utils.printd import printd
from ..utils.pipenv_utils import pipenv_where
from typing import List
from .. import atri_app_dir, controllers_dir, assets_dir, app_config_file

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

    docker_commands: List[str] = []
    output_path = Path(pipenv_root_dir) / out_file

    if Path.exists(output_path):
        printd("Dockerfile already exists. This command will overwrite the older version.")

    pipfile_lock_path = Path(pipenv_root_dir) / "Pipfile.lock"
    if Path.exists(pipfile_lock_path):
        docker_commands.append("COPY Pipfile.lock /code")
    
    pipfile_path = Path(pipenv_root_dir) / "Pipfile"
    if Path.exists(pipfile_path):
        docker_commands.append("COPY Pipfile /code")

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

    docker_commands.append("COPY {} /code/{}".format(assets_rel_path, assets_rel_path))
    docker_commands.append("COPY {} /code/{}".format(controllers_rel_path, controllers_rel_path))
    docker_commands.append("COPY {} /code/{}".format(atri_app_rel_path, atri_app_rel_path))
    docker_commands.append("COPY {} /code/{}".format(app_config_file_rel_path, app_config_file_rel_path))

    # install npm packages
    docker_commands.append("WORKDIR /code/{}".format(atri_app_rel_path))
    docker_commands.append("RUN yarn install && yarn run build && yarn run buildServer")

    # install python packages
    docker_commands.append("WORKDIR /code")
    docker_commands.append("RUN pipenv install")

    # TODO: add command to execute python controller server & node server
