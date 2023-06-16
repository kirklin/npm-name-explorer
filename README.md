# npm-name-explorer

[![CI][ci-image]][ci-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript_code style][code-style-image]][code-style-url]

[ci-image]: https://github.com/kirklin/npm-name-explorer/actions/workflows/release.yml/badge.svg?branch=main
[ci-url]: https://github.com/kirklin/npm-name-explorer/actions/workflows/release.yml
[npm-image]: https://img.shields.io/npm/v/npm-name-explorer.svg
[npm-url]: https://npmjs.org/package/npm-name-explorer
[downloads-image]: https://img.shields.io/npm/dm/npm-name-explorer.svg
[downloads-url]: https://npmjs.org/package/npm-name-explorer
[code-style-image]: https://img.shields.io/badge/code__style-%40kirklin%2Feslint--config-brightgreen
[code-style-url]: https://github.com/kirklin/eslint-config/


This is a Node.js module that allows you to check whether a package or organization name is available on npm.
          
#### Features:
- ⚡️ Supports checking both package names and organization names.
- 🌐 Handles custom registry URLs for checking.
- 💪 Provides error handling for invalid package names.
- 💡 Uses async/await for asynchronous operations.
- 🚀 Lightweight and easy to use.
- 🔒 Secure and reliable data fetching using axios.
- 🔄 Supports checking package availability in real time.
- 📦 Works with both scoped and unscoped package names.
- 🔧 Configurable options for advanced usage.
- 📝 Fully typed with TypeScript.
- 🎉 Actively maintained and regularly updated.

### Installation

You can install this module using npm:

```
npm install npm-name-explorer
```

### Usage

Here's an example of how you can use this module:

```javascript
import checkNpmNameExists, { InvalidNameError } from "npm-name-explorer";

async function checkPackageExists() {
  try {
    const packageName = "your-package-name";
    const exists = await checkNpmNameExists(packageName);
    
    if (exists) {
      console.log(`The package '${packageName}' exists on npm.`);
    } else {
      console.log(`The package '${packageName}' does not exist on npm.`);
    }
  } catch (error) {
    if (error instanceof InvalidNameError) {
      console.error("Invalid package name:", error.message);
    } else {
      console.error("An error occurred:", error.message);
    }
  }
}

checkPackageExists();
```

### API

The `checkNpmNameExists` function accepts two parameters:

- `name` (required): The name of the npm package or organization to check.
- `options` (optional): Additional options for the function. The only supported option is `registryUrl`, which allows you to specify a custom npm registry URL. If not provided, the default registry URL will be used.

The function returns a promise that resolves to a boolean value indicating whether the package or organization exists on npm.

If the package name is invalid, an `InvalidNameError` will be thrown with additional information about the validation errors and warnings.

### License

[MIT](./LICENSE) License &copy; 2023-PRESENT [Kirk Lin](https://github.com/kirklin)
