function insideAdditionalInclude(
  additionalInclude: string[],
  moduleName: string
) {
  for (let i = 0; i < additionalInclude.length; i++) {
    if (moduleName.startsWith(additionalInclude[i]!)) {
      return true;
    }
  }
  return false;
}

function insideExclude(excludeDirs: string[], moduleName: string) {
  for (let i = 0; i < excludeDirs.length; i++) {
    if (moduleName.startsWith(excludeDirs[i]!)) {
      return true;
    }
  }
  return false;
}

/**
 * Assumption is that all the paths in additionalInclude, excludeDirs and moduleName
 * are absolute path.
 * @param additionalInclude
 * @param excludeDirs
 * @returns
 */
export function excludeWithAdditionalModules(
  additionalInclude: string[],
  excludeDirs: string[]
) {
  return (moduleName: string) => {
    if (insideAdditionalInclude(additionalInclude, moduleName)) {
      return false;
    }
    if (insideExclude(excludeDirs, moduleName)) {
      return true;
    }
    return false;
  };
}
