import reactSchemaId from "@atrilabs/react-component-manifest-schema?id";
import iconSchemaId from "@atrilabs/component-icon-manifest-schema?id";
import { CommonIcon } from "../CommonIcon";

export const Button: React.FC = () => {
  return <button>Click Me!</button>;
};

const compManifest = {
  meta: { key: "Button" },
  render: {
    comp: Button,
    props: {},
  },
  dev: {
    decorators: [],
    attachProps: {},
    attachCallbacks: {},
    acceptsChild: false,
  },
};

const iconManifest = {
  panel: { icon: CommonIcon, props: { name: "Button" } },
  drag: { icon: CommonIcon, props: { name: "Button" } },
  renderSchema: compManifest,
};

export default {
  manifests: {
    [reactSchemaId]: [compManifest],
    [iconSchemaId]: [iconManifest],
  },
};
