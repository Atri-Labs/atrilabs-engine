<a name="pull-requests"></a>

## Pull Requests

A pull request should remain focused in scope and avoid containing unrelated commits. You will need `npm >= 8.11.0 `, `node >= v16.16.0` and `yarn >= 1.22.18`.

**Ask before submitting a pull request** by creating an issue. The feature/refactored code etc. might not be aligned with current goals of the project.

Please adhere to the coding conventions used throughout a project (indentation, accurate comments, etc.) and any other requirements (such as test coverage).

Adhereing to the following process is the best way to get your work included in the project:

1. [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone your fork, and configure the remotes:

   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<your-username>/atrilabs-engine.git
   # Navigate to the newly cloned directory
   cd atrilabs-engine
   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/Atri-Labs/atrilabs-engine.git
   ```

2. The initial installation of `node_modules` and building all packages is a bit tricky and will be simplied once we migrate from `lerna` to `turborepo` in future.

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

4. Start the development server

   Run the following in a shell:

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

5. If you cloned a while ago, get the latest changes from upstream:

   ```bash
   git checkout main
   git pull upstream main
   ```

6. Create a new topic branch (off the main project development branch) to contain your feature, change or fix:

   ```bash
   git checkout -b <topic-branch-name>
   ```

7. Commit your changes in logical chunks. Please adhere to these [git commit
   message guidelines](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)
   or your code is unlikely be merged into the main project. Use Git's
   [interactive rebase](https://help.github.com/articles/about-git-rebase/)
   feature to tidy up your commits before making them public.

8. Locally merge (or rebase) the upstream development branch into your topic branch:

   ```bash
   git pull [--rebase] upstream main
   ```

9. Push your topic branch up to your fork:

   ```bash
   git push origin <topic-branch-name>
   ```

10. [Open a Pull Request](https://help.github.com/articles/using-pull-requests/)
    with a clear title and description.

<a name="release"></a>

## Cutting a release

1. Tag all merged pull requests that go into the release with the relevant milestone. Each merged PR should also be labeled with one of the labels name `tag: ...` to indicate what kind of change it is. Make sure all the breaking changes are correctly labelled with `tag: breaking change`.
2. Close the milestone and create a new one for the next release.

**IMPORTANT**: By submitting a patch, you agree to allow the project
owners to license your work under the terms of the [GPL v2.0 License](COPYING).

<a name="references"></a>
References:

- This CONTRIBUTING.md file is inspired/copied from [h5bp](https://github.com/h5bp/html5-boilerplate/blob/main/.github/CONTRIBUTING.md#pull-requests)
