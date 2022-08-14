export function formatTemplateName(fullName: string) {
  return fullName.split(/(\/|\\|\\\\)/).slice(-1)[0];
}
