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
      value: {},
      gettable: true,
      updateable: true,
    },
  };
  return stub;
};

export default pythonStubGenerator;
