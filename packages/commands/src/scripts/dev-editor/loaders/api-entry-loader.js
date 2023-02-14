/**
 *
 * @param {string} source
 * @returns
 */
function apiEntryLoader(source) {
  const { eventClientModulePath } = this.getOptions();
  return source.replace(
    "declare var client: BrowserClient;",
    `import client from "${eventClientModulePath}";`
  );
}

module.exports = apiEntryLoader;
