# `@atrilabs/component-style-layer`

This layer knows about @atrilabs/react-component-manifest-schema and @atrilabs/canvas-runtime. Like all other layers, it uses BrowserForestManager to access current forest details. Like any other layers, it uses api from @atrilabs/core to actually make changes to a forest and sync those changes with actual database in the backend.

Core responsibilities of this layer:

- Read manifest schema of a component when user selects a component.
- Use information from manifest schema to show the UI.
- Use information from css tree to show current values for the css properties.
- Combine informartion from manifest and event, to actually

NOTE:
This layer assumes that CSS styles of a component are passed via `styles` key in the `ReactComponentManifestSchema.attachProps`. You can note this assumption in the file `src/hook/useManageCSS.ts` from this package. In future, we will make it generic, by idenitfying all the properties that uses `cssTree` in `ReactComponentManifestSchema.attachProps` of a manifest. Each of these properties will have a separate Tab in the PropertiesTab panel.
