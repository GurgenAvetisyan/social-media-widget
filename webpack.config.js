const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const fs = require("fs");

module.exports = (env = {}) => {
  // Determine the environment (default to 'development')
  const currentEnvironment = env.NODE_ENV || "development";

  // Load environment variables from .env files
  const envPath = path.resolve(__dirname, `.env.${currentEnvironment}`);
  const fallbackEnvPath = path.resolve(__dirname, ".env");

  const fileEnv = fs.existsSync(envPath)
    ? dotenv.config({ path: envPath }).parsed
    : dotenv.config({ path: fallbackEnvPath }).parsed;

  const envKeys = Object.keys(fileEnv || {}).reduce((prev, key) => {
    prev[`process.env.${key}`] = JSON.stringify(fileEnv[key]);
    return prev;
  }, {});

  // Define output paths dynamically based on the environment
  const outputPaths = {
    development: path.resolve(__dirname, "dist/dev"),
    qa: path.resolve(__dirname, "dist/qa"),
    production: path.resolve(__dirname, "dist/prod"),
  };

  return {
    mode: currentEnvironment,
    entry: "./src/sdk.js",
    output: {
      path: outputPaths[currentEnvironment] || outputPaths.development,
      filename: "sdk.js",
      library: "SDK",
      libraryTarget: "umd",
    },
    plugins: [new webpack.DefinePlugin(envKeys)],
    resolve: {
      fallback: {
        process: require.resolve("process/browser"),
      },
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                icon: true,
              },
            },
            "url-loader",
          ],
        },
        {
          test: /\.module\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  namedExport: false,
                  localIdentName: "widget-[local]___[hash:base64:5]",
                },
              },
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
      ],
    },
  };
};
