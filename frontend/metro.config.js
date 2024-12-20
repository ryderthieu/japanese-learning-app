const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind({
  ...config,
  transformer: {
    ...config.transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"), // Thêm hỗ trợ SVG
  },
  resolver: {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"), // Loại bỏ SVG khỏi danh sách assetExts
    sourceExts: [...config.resolver.sourceExts, "svg"], // Thêm SVG vào danh sách sourceExts
  },
}, { input: './global.css' });
