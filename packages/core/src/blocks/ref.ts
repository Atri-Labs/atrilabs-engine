const refRegistry: {
  [name: string]: React.RefObject<any>;
} = {};

export function attachRef(name: string, ref: React.RefObject<any>) {
  refRegistry[name] = ref;
}

/**
 *
 * detachRef deletes a ref from registry only if the provided ref matches the existing ref.
 * If it doesn't matches, then it does nothing.
 */
export function detachRef(name: string, ref: React.RefObject<any>) {
  if (refRegistry[name] && refRegistry[name] === ref) {
    delete refRegistry[name];
  }
}

export function getRef(name: string) {
  return refRegistry[name];
}
