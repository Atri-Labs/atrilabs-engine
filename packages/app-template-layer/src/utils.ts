export function formatPathname(fullName: string) {
  return fullName.split(/(\/|\\|\\\\)/).slice(-1)[0];
}

export function formatTemplatename(templateName: string) {
  return templateName.replace(".json", "");
}
