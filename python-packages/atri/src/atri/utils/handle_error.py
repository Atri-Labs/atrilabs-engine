from ..errors import PIP_NOT_INSTALLED, PYTHON_NOT_INSTALLED, SELECTED_VIRTENV_NOT_INSTALLED, DOCKER_NOT_INSTALLED

def error_to_message(error_code: int):
    if error_code == DOCKER_NOT_INSTALLED:
        print("Error: docker not installed. Please install docker.")
    if error_code == SELECTED_VIRTENV_NOT_INSTALLED:
        print("Error: The selected virtual environment is not installed. \
        Please check atri.app.json file to find your selected virtual env type.")
    if error_code == PYTHON_NOT_INSTALLED:
        print("Please install python in your conda environment.")
        print("Run conda install python")
    if error_code == PIP_NOT_INSTALLED:
        print("Please install pip in your conda environment.")
        print("Run conda install pip")   