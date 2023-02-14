# How to use this package?

This package can be used at multiple levels, from low to high:

## High Level API

- The scripts from `src/scripts` can be directly used as an npm script field.

## Mid Level API

- The Webpack config files can be used to quickly setup some build/dev scripts by importing `createConfig` or `createDevConfig` from `src/configs`.
- Some useful utility functions include `createEnvironmentHash` that can be used in other packages in different scenarios.

## Low Level API

- If you want to write a custom Webpack config:
  - To handle different file types while using Webpack you can look in `src/configs/loaders/*`.
  - Some modules provide utilties that can be used in packages for build or non-build related purposes:
    1. `choosePort` - This helps you find a free port given a default port.
    2. `src/utils/consoleHelpers.ts` - Provides helper functions such as `clearConsole`.

## Scripts

- The `dev-atri-app` is used to start Atri's development server.

- The `create-atri-app` is used to create a new Atri project.

## Add environment variables to client side code

All the environment variables that needs to be embedded in the application (client side) must start with `ATRI_APP_`. Some environment variables are available to client side by default such as `NODE_ENV`.

You can also use `.env` file or `.env.${MODE}.local` files to specify environment variables (again, variables that start with `ATRI_APP_` will only be available on client side).

# Working details

The `src/utils/extractParams.ts` has a function with the same name that helps extract the required information for a build process from different sources such as environment variables, command line arguments and `build.config.js`. All the scripts from `src/bin` call `extractParams()` to extract these necessary information.

# Generate `index.html`

Geneartes `index.html` when `generateIndexHtml` is set to `true`.

# Features

- Supports react refresh.
- Add middlewares to webpack dev server.
- Proxy requests to your server (both HTTP/S & ws).
- A webpack dev server behind a proxy can also be used.
- Supports typescript and many other file types.

# Notes

- The `_document` is used only in server side to generate HTML.
