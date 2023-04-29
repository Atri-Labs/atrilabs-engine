import { CreateEvent } from "@atrilabs/forest";

export type ComponentTreeCreateEvent = CreateEvent & {
  meta: { pkg: string; id: string; manifestSchemaId: string };
};

export default function () {
  const validateCreate = () => {
    return true;
  };
  const validatePatch = () => {
    return true;
  };
  const onCreate = () => {
    return true;
  };
  return { validateCreate, validatePatch, onCreate };
}
