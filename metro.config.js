const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
};

const nativewindConfig = withNativewind(config);
const nativewindResolveRequest = nativewindConfig.resolver.resolveRequest;
const baseResolveRequest = resolver.resolveRequest;
const rnCssShimPath = require.resolve('./metro.rn-css-shim');

const normalizePath = filePath =>
  process.platform === 'win32'
    ? filePath.replaceAll('\\', '/').toLowerCase()
    : filePath.replaceAll('\\', '/');

const normalizedShimPath = normalizePath(rnCssShimPath);

nativewindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    context.originModulePath &&
    normalizePath(context.originModulePath) === normalizedShimPath
  ) {
    const resolve = baseResolveRequest ?? context.resolveRequest;
    return resolve(context, moduleName, platform);
  }

  const resolved = nativewindResolveRequest(context, moduleName, platform);

  if (
    platform !== 'web' &&
    moduleName === 'react-native' &&
    resolved.type === 'sourceFile' &&
    /[\\/]react-native-css[\\/]/.test(resolved.filePath)
  ) {
    return {
      type: 'sourceFile',
      filePath: rnCssShimPath,
    };
  }

  return resolved;
};

module.exports = nativewindConfig;
