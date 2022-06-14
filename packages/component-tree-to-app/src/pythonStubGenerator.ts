import {
  PythonStubGeneratorFunction,
  PythonStubGeneratorOutput,
} from "@atrilabs/app-generator";

const pythonStubGenerator: PythonStubGeneratorFunction = (_options) => {
  const stub: PythonStubGeneratorOutput = { vars: {} };
  // TODO: get value and type from tree definition
  stub.vars = {
    Flex1: {
      type: {},
      value: { styles: { display: "flex" }, custom: {} },
      gettable: true,
      updateable: true,
    },
    Button1: {
      type: {},
      value: {
        styles: { background: "pink", color: "black", opacity: 0.5 },
        custom: { text: "Click Me" },
      },
      gettable: true,
      updateable: true,
    },
  };
  return stub;
};

export default pythonStubGenerator;
