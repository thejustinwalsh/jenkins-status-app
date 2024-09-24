/**
 * Metro configuration for React Native
 * https://reactnative.dev/docs/metro
 *
 * @format
 */
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const fs = require('fs');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const rnwPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-windows/package.json'), '..'),
);

function shimResolver(resolver) {
  return (context, moduleName, platform) => {
    if (moduleName.startsWith('@dev-plugins')) {
      return context.expoDevToolsHost === true
        ? undefined
        : {
            filePath: path.resolve(
              __dirname,
              'src',
              'shims',
              moduleName,
              'index.js',
            ),
            type: 'sourceFile',
          };
    }

    return (
      resolver?.(context, moduleName, platform) ??
      context.resolveRequest(context, moduleName, platform)
    );
  };
}

module.exports = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
    resolveRequest: shimResolver(),
    blockList: exclusionList([
      // This stops "react-native run-windows" from causing the metro server to crash if its already running
      new RegExp(
        `${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`,
      ),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      /.*\.ProjectImports\.zip/,
    ]),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    // This fixes the 'missing-asset-registry-path` error (see https://github.com/microsoft/react-native-windows/issues/11437)
    assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
  },
});
