def is_pipenv_installed():
    try:
        import pipenv
        return True
    except ImportError as e:
        return False