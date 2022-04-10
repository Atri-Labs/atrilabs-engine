/**
 *
 * @param {string} webpackEnv
 * @param {{
 *  publicUrlOrPath: string;
 *  toolDir: string;
 * }} paths
 */
export default function (webpackEnv, paths) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes("--profile");
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  const shouldUseReactRefresh = env.raw.FAST_REFRESH;
}
