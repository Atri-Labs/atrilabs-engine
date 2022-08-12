FROM node:16

RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

RUN apt update && apt install -y python3-pip

RUN useradd -m python_user

RUN chown -R python_user /home/linuxbrew/.linuxbrew/Homebrew /home/linuxbrew/.linuxbrew/Homebrew/bin

ENV PATH /home/linuxbrew/.linuxbrew/Homebrew/bin:$PATH

WORKDIR /home/python_user

USER python_user

RUN brew install pyenv

ENTRYPOINT [ "/bin/bash" ]