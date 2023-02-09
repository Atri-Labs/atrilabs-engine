import { computeManifestIRsForDirs } from "../../../commons/computeManifestIRs";
import {
  createServerMachineInterpreter,
  MANIFESTS_FS_CHANGED,
  MANIFEST_OBJECTS_UPDATED,
} from "../serverMachine";

export async function computeFSAndSend(
  interpreter: ReturnType<typeof createServerMachineInterpreter>,
  dirs: string[]
) {
  interpreter.send({ type: MANIFESTS_FS_CHANGED });
  const irs = await computeManifestIRsForDirs(dirs);
  interpreter.send({
    type: MANIFEST_OBJECTS_UPDATED,
    manifests: irs,
  });
}
