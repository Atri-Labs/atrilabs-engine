# `@atrilabs/manifest-registry-reader-node`

This package is a utility package for other Node packages and provides them with the same Manifest Registry as available in the editor.

Currently this package needs the manifest server to be running at http://localhost:4003 but the plan is to remove this dependency on a running server.

To test this repository:

1. Go to `packages/webapp-builder` and run `yarn run server`. This will start the manifest server at http://localhost:4003.
2. From inside this package, run `yarn run test`.
