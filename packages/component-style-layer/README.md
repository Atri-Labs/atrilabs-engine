# `@atrilabs/component-style-layer`

This layer knows about @atrilabs/react-component-manifest-schema and @atrilabs/canvas-runtime. Like all other layers, it uses BrowserForestManager to access current forest details. Like any other layers, it uses api from @atrilabs/core to actually make changes to a forest and sync those changes with actual database in the backend.

Core responsibilities of this layer:

- Read manifest schema of a component when user selects a component.
- Use information from manifest schema to show the UI.
- Use information from css tree to show current values for the css properties.
- Combine informartion from manifest and event, to actually
