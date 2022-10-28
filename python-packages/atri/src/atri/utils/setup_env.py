import json
from pathlib import Path
from .. import app_config_file
import os

def setup_env():
    """
    Setups environment variables for all child processes like ATRI_PROJECT_ID.
    """
    config_filepath = Path.cwd() / app_config_file
    with open(config_filepath, "r") as f:
        content = json.load(f)
        project_id = content["projectId"]
        os.environ["ATRI_PROJECT_ID"] = project_id