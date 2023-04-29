import path from "path";
import { RuleSetRule } from "webpack";

export function babelPresetReactApp(
  _api: any,
  options: {
    isEnvProduction: boolean;
    isEnvDevelopment: boolean;
    isEnvTest: boolean;
    runtime: "automatic" | "classic";
    areHelpersEnabled: boolean;
  }
) {
  const {
    isEnvProduction,
    isEnvDevelopment,
    isEnvTest,
    runtime,
    areHelpersEnabled,
  } = options;
  return {
    presets: [
      isEnvTest && [
        // ES features necessary for user's Node version
        require("@babel/preset-env").default,
        {
          targets: {
            node: "current",
          },
        },
      ],
      (isEnvProduction || isEnvDevelopment) && [
        // Latest stable ECMAScript features
        require("@babel/preset-env").default,
        {
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: "entry",
          // Set the corejs version we are using to avoid warnings in console
          corejs: 3,
          // Exclude transforms that make all code slower
          exclude: ["transform-typeof-symbol"],
        },
      ],
      [
        require("@babel/preset-react").default,
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isEnvDevelopment || isEnvTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          ...(runtime !== "automatic" ? { useBuiltIns: true } : {}),
          runtime: runtime,
        },
      ],
      [require("@babel/preset-typescript").default],
    ].filter(Boolean),
    plugins: [
      require("babel-plugin-macros"),
      [require("@babel/plugin-proposal-decorators").default, false],
      [
        require("@babel/plugin-proposal-class-properties").default,
        {
          loose: true,
        },
      ],
      [
        require("@babel/plugin-proposal-private-methods").default,
        {
          loose: true,
        },
      ],
      [
        require("@babel/plugin-proposal-private-property-in-object").default,
        {
          loose: true,
        },
      ],
      require("@babel/plugin-proposal-numeric-separator").default,
      isEnvProduction && [
        require("babel-plugin-transform-react-remove-prop-types").default,
        {
          removeImport: true,
        },
      ],
      require("@babel/plugin-proposal-optional-chaining").default,
      require("@babel/plugin-proposal-nullish-coalescing-operator").default,
      [
        require("@babel/plugin-transform-runtime").default,
        {
          corejs: false,
          helpers: areHelpersEnabled,
          // By default, babel assumes babel/runtime version 7.0.0-beta.0,
          // explicitly resolving to match the provided helper functions.
          // https://github.com/babel/babel/issues/10261
          version: require("@babel/runtime/package.json").version,
          regenerator: true,
          // Undocumented option that lets us encapsulate our runtime, ensuring
          // the correct version is used
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          absoluteRuntime: path.dirname(
            require.resolve("@babel/runtime/package.json")
          ),
        },
      ],
    ].filter(Boolean),
  };
}

export default function setJsxTsxLoaders(options: {
  appSrc: string;
  isEnvProduction: boolean;
  isEnvDevelopment: boolean;
  isEnvTest: boolean;
  hasJsxRuntime: boolean;
  removeReactRefresh?: boolean;
  additionalInclude: string[];
  exclude: RuleSetRule["exclude"];
  babel?: {
    plugins?: [string, any][];
  };
}): RuleSetRule[] {
  const { appSrc, additionalInclude, exclude, removeReactRefresh } = options;
  return [
    {
      test: /\.(js|mjs)$/,
      include: [appSrc, ...additionalInclude],
      exclude,
      loader: require.resolve("swc-loader"),
      options: {
        sync: true,
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
              refresh: removeReactRefresh ? false : true,
            },
          },
        },
      },
    },
    {
      test: /\.js(x?)$/,
      include: [appSrc, ...additionalInclude],
      exclude,
      loader: require.resolve("swc-loader"),
      options: {
        sync: true,
        jsc: {
          parser: {
            jsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
              refresh: removeReactRefresh ? false : true,
            },
          },
        },
      },
    },
    {
      test: /\.ts(x?)$/,
      include: [appSrc, ...additionalInclude],
      exclude,
      loader: require.resolve("swc-loader"),
      options: {
        sync: true,
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
              refresh: removeReactRefresh ? false : true,
            },
          },
        },
      },
    },
  ];
}
