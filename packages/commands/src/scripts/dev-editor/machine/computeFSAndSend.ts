import { computeManifestIRsForDirs } from "../../../commons/computeManifestIRs";
import {
  createServerMachineInterpreter,
  FS_CHANGED,
  MANIFEST_OBJECTS_UPDATED,
} from "./editorServerMachine";

export async function computeFSAndSend(
  editorServerMachineInterpreter: ReturnType<
    typeof createServerMachineInterpreter
  >,
  dirs: string[]
) {
  editorServerMachineInterpreter.send({ type: FS_CHANGED });
  const irs = await computeManifestIRsForDirs(dirs);
  editorServerMachineInterpreter.send({
    type: MANIFEST_OBJECTS_UPDATED,
    manifests: irs,
  });
}
