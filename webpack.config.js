import path from "path";
import { fileURLToPath } from "url";
import HTMLWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const disableExtensions = (...extensions) => {
  if (extensions) {
    return [...extensions]
  }
}

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all"
    }
  }

  if (isProd) {
    config.minimizer = [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
    ]
  }

  return config;
}

const fileName = ext => isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`;

const cssLoader = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    "css-loader"
  ]

  if (extra) {
    loaders.push(extra);
  }
  
  return loaders;
}

const babelOptions = (option) => {
  const options = {
    presets: ["@babel/preset-env"]
  }

  if (option) {
    options["presets"].push("@babel/preset-typescript");
  }

  return options;
}

const buildNameOption = () => (isDev) ? "dist" : "build";

const WEBPACK_CONFIG = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: "./index.js",
  },
  output: {
    filename: fileName("js"),
    path: path.resolve(__dirname, buildNameOption())
  },
  resolve: {
    extensions: disableExtensions(".js", ".ts"),
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  optimization: optimization(),
  devtool: isDev ? "source-map" : false,
  devServer: {
    port: 5128
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: "./index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "assets/images", to: "assets/images" },
        { from: "assets/fonts", to: "assets/fonts" },
        { from: "templates", to: "templates" }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: fileName("css")
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: cssLoader()
      },
      {
        test: /\.(sass|scss)$/i,
        use: cssLoader("sass-loader")
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(js|mjs)$/i,
        exclude: "/node_modules",
        use: {
          loader: "babel-loader",
          options: babelOptions()
        }
      },
      {
        test: /\.ts$/i,
        exclude: "/node_modules",
        use: {
          loader: "babel-loader",
          options: babelOptions("ts")
        }
      }
    ]
  }
}

export default WEBPACK_CONFIG;
