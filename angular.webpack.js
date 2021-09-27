const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "electron-renderer",
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@PixelPai/game-core": path.resolve(
        __dirname,
        "node_modules/@PixelPai/game-core/release/js"
      ),
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(
            __dirname,
            `node_modules/@PixelPai/game-core/release/resources`
          ),
          to: `./resources`,
          toType: "dir",
        },
      ],
    }),
  ],
};
