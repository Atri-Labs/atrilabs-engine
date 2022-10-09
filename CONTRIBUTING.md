# Contribute to Atri framework

Thanks for your interest in contributing to the Atri framework. ✨

This page will give you a quick overview of how to get involved.

## Table of contents

- [Contribute to Atri framework](#contribute-to-atri-framework)
  - [Table of contents](#table-of-contents)
  - [Issues and bug reports](#issues-and-bug-reports)
    - [How to submit an issue?](#how-to-submit-an-issue)
  - [Creating an Atri app](#creating-an-atri-app)
  - [Contributing to the code base](#contributing-to-the-code-base)
    - [How to submit a Pull Request (PR)?](#how-to-submit-a-pull-request-pr)
    - [Cutting a release](#cutting-a-release)

## Issues and bug reports

First, [do a quick search](https://github.com/Atri-Labs/atrilabs-engine/issues)
to see if the issue has already been reported. If so, it's often better to just
leave a comment on an existing issue, rather than creating a new one. Old issues
also often include helpful tips and solutions to common problems.

If you're looking for help with your code, consider posting a question on the
[GitHub Discussions board](https://github.com/Atri-Labs/atrilabs-engine/discussions).

### How to submit an issue?

When submitting an issue, please include the following:

- descriptive title
- your **environment** (operating system, Python version, Atri version)
- issue label (refer [labels](https://github.com/Atri-Labs/atrilabs-engine/labels) for an overview of how we tag our issues and pull requests.)
- Video or GIF to further explain the issue (optional)

## Creating an Atri app

1. Installation

Follow the [installation guide](https://docs.atrilabs.com/category/installation) to satisfy prerequisites and install Atri engine. 

2. Create your first Atri app

Follow the instructions [here](https://docs.atrilabs.com/getting-started/create-app) to create a simple app to get a quick introduction to the framework.

3. Create your app

Now you are set to create powerful multi-page, responsive apps. You can review the [apps](https://github.com/Atri-Apps) built by our team to get inspiration. 

4. Deploy your app using Atri CLI or manually

Once your app is ready, you can deploy it either using Atri CLI or manually. You can follow the instructions provided in our [Docs](https://docs.atrilabs.com/category/deploy-app). Deployment using GitHub pages is preferred since it won't incur any cost. 

5. Submit Pull Request (PR)

[Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title, description, demo GIF, deployed link and GitHub link. 

Congratulations! You have successfully created an Atri app. Your Pull Request will now be reviewed by the maintainers and once merged, your app will be added to the [made-with-atri folder](made-with-atri/README.md). 

## Contributing to the code base

Please review the [existing issues](<(https://github.com/Atri-Labs/atrilabs-engine/issues)>), pick the one that you are interested in working on and ask the admins to assign that issue to you.

If you are a newcomer, you can consider getting started with ["good first issues"](https://github.com/Atri-Labs/atrilabs-engine/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

### How to submit a Pull Request (PR)?

A pull request should remain focused in scope and avoid containing unrelated commits. You will need `npm >= 8.11.0 `, `node >= v16.16.0` and `yarn >= 1.22.18`.

**Ask before submitting a pull request** by creating an issue. The feature/refactored code etc. might not be aligned with current goals of the project.

Please adhere to the coding conventions used throughout a project (indentation, accurate comments, etc.) and any other requirements (such as test coverage).

Adhering to the following process is the best way to get your work included in the project:

1. [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone your fork, and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/atrilabs-engine.git
   # Navigate to the newly cloned directory
   cd atrilabs-engine
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/Atri-Labs/atrilabs-engine.git
   ```

2. The initial installation of `node_modules` and building all packages is a bit tricky and will be simplified once we migrate from `lerna` to `turborepo` soon. You might have to install lerna by running `npm i -g lerna` in a shell. Similarly, you might have to install yarn by running `npm i -g yarn` in a shell.

   ```
   # install node_modules
   yarn install

   # store project root directory to make installation easy
   export PROJECT_ROOT=$(pwd)

   # build some pre-requisite package
   cd $PROJECT_ROOT/packages/forest && yarn run build
   cd $PROJECT_ROOT/packages/core && yarn run build
   cd $PROJECT_ROOT/packages/scripts && yarn run build

   # delete the node_modules folder in project root directory
   rm -rf $PROJECT_ROOT/node_modules

   # bootstrap the project
   lerna bootstrap

   # build all packages
   lerna run build

   # run again (because of known issue with lerna)
   lerna run build
   ```

3. Start the development server

   Run the following commands in a shell:

   ```
   cd $PROJECT_ROOT/packages/webapp-builder
   yarn run server
   ```

   Open another shell and run the following:

   ```
   cd $PROJECT_ROOT/packages/webapp-builder
   yarn run start
   ```

   This will launch the visual editor in `http://localhost:4000`.

4. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout main
   git pull upstream main
   ```

5. Create a new topic branch (off the main project development branch) to contain your feature, change or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

6. Commit your changes in logical chunks. Please adhere to these [git commit
   message guidelines](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
   or your code is unlikely be merged into the main project. Use Git's
   [interactive rebase](https://help.github.com/articles/about-git-rebase/)
   feature to tidy up your commits before making them public.

7. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream main
   ```

8. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

9. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
   with a clear title and description.

### Cutting a release

1. Tag all merged pull requests that go into the release with the relevant milestone. Each merged PR should also be labeled with one of the labels name `tag: ...` to indicate what kind of change it is. Make sure all the breaking changes are correctly labelled with `tag: breaking change`.

2. Close the milestone and create a new one for the next release.

**IMPORTANT**: By submitting a patch, you agree to allow the project
owners to license your work under the terms of the [GPL v3.0 License](https://github.com/Atri-Labs/atrilabs-engine/blob/main/LICENSE).
