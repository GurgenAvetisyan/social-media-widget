# SDK Webpack Configuration

This document explains how to build and configure your SDK using Webpack. The setup dynamically adapts to different environments (development, QA, and production) and allows seamless integration with S3 for deployment.

---

## Features

- **Dynamic Environment Handling**: Load environment-specific configurations for `development`, `qa`, and `production` using `.env` files.
- **Modular CSS Support**: Uses `css-loader` for modular CSS with custom class naming conventions.
- **SVG Support**: Inline SVGs can be imported as React components using `@svgr/webpack`.
- **Environment Variable Injection**: Use `webpack.DefinePlugin` to pass environment variables into the build process.
- **S3 Upload Script**: Upload the final SDK file to an S3 bucket with the provided script.

---

## Requirements

- Node.js >= 14
- npm or Yarn
- Webpack >= 5
- Babel for React support

---

## Installation

Install the necessary dependencies using npm or Yarn:

```bash
npm install
```

or

```bash
yarn install
```

---

## Scripts

Add the following scripts to your `package.json` for easier usage:

```json
"scripts": {
  "build:dev": "webpack --config webpack.config.js --env NODE_ENV=development",
  "build:qa": "webpack --config webpack.config.js --env NODE_ENV=qa",
  "build:prod": "webpack --config webpack.config.js --env NODE_ENV=production",
  "upload:dev": "sh s3_upload.sh --env dev --file dist/dev/sdk.js",
  "upload:qa": "sh s3_upload.sh --env qa --file dist/qa/sdk.js",
  "upload:prod": "sh s3_upload.sh --env prod --file dist/prod/sdk.js"
}
```

Use these commands to build and upload your SDK with a single step.

---

## Build Instructions

To build the SDK, use the following commands based on the target environment:

### Development Build

```bash
npm run build:dev
```

### QA Build

```bash
npm run build:qa
```

### Production Build

```bash
npm run build:prod
```

By default, the output file is placed in the respective directory:

- `dist/dev` for development
- `dist/qa` for QA
- `dist/prod` for production

---

## Environment Variables

Define your environment-specific variables in `.env` files:

### Example `.env` Files

#### `.env.development`

```plaintext
REACT_APP_API_HOSTNAME=http://localhost:3000
REACT_APP_SOCIAL_PROVIDER_FACEBOOK_APP_ID=dev-facebook-app-id
REACT_APP_SOCIAL_PROVIDER_LINKEDIN_CLIENT_ID=dev-linkedin-client-id
REACT_APP_SOCIAL_PROVIDER_REDIRECT_URL=https://example.com/linkedin/callback
```

#### `.env.qa`

```plaintext
REACT_APP_API_HOSTNAME=https://api.example.com
REACT_APP_SOCIAL_PROVIDER_FACEBOOK_APP_ID=prod-facebook-app-id
REACT_APP_SOCIAL_PROVIDER_LINKEDIN_CLIENT_ID=prod-linkedin-client-id
REACT_APP_SOCIAL_PROVIDER_REDIRECT_URL=https://example.com/linkedin/callback
```

#### `.env.production`

```plaintext
REACT_APP_API_HOSTNAME=https://api.example.com
REACT_APP_SOCIAL_PROVIDER_FACEBOOK_APP_ID=prod-facebook-app-id
REACT_APP_SOCIAL_PROVIDER_LINKEDIN_CLIENT_ID=prod-linkedin-client-id
REACT_APP_SOCIAL_PROVIDER_REDIRECT_URL=https://example.com/linkedin/callback
```

Add the `.env` files to `.gitignore` to avoid committing sensitive information.

---

## Upload to S3

After building the SDK, you can upload it to an S3 bucket using the `s3_upload.sh` script.

### Example Command

```bash
npm run upload:dev
```

### Script Arguments

- `--env`: Specifies the environment (`dev`, `qa`, `prod`).
- `--file`: Path to the SDK file to upload.

---

## Project Structure

```plaintext
.
├── src/
│   └── sdk.js              # Main entry point
├── dist/
│   ├── dev/                # Development build output
│   ├── qa/                 # QA build output
│   └── prod/               # Production build output
├── .env                    # Default environment variables (fallback)
├── webpack.config.js       # Webpack configuration
├── s3_upload.sh            # Script to upload files to S3
└── README.md               # Project documentation
```

---

## Webpack Configuration

The `webpack.config.js` dynamically adapts to different environments:

### Key Features

- **Dynamic Output Paths**:

  ```javascript
  const outputPaths = {
    development: path.resolve(__dirname, "dist/dev"),
    qa: path.resolve(__dirname, "dist/qa"),
    production: path.resolve(__dirname, "dist/prod"),
  };
  output: {
    path: outputPaths[env.NODE_ENV] || outputPaths.development,
    filename: "sdk.js",
    library: "SDK",
    libraryTarget: "umd",
  },
  ```

- **Environment Variable Injection**:
  Injects variables using `webpack.DefinePlugin`:

  ```javascript
  new webpack.DefinePlugin({
    "process.env.REACT_APP_API_HOSTNAME": JSON.stringify(process.env.REACT_APP_API_HOSTNAME),
    "process.env.REACT_APP_SOCIAL_PROVIDER_FACEBOOK_APP_ID": JSON.stringify(process.env.REACT_APP_SOCIAL_PROVIDER_FACEBOOK_APP_ID),
    ...
  });
  ```

- **CSS and SVG Support**:
  ```javascript
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "url-loader"],
      },
      {
        test: /\.module\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  ```
