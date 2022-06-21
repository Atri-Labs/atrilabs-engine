export * from "./shared/utils";
export * from "./shared/types";
export * from "./shared/build-manifest-package";
import generateModuleIdFunc from "./babel/generateModuleId";
export const generateModuleId = generateModuleIdFunc;
