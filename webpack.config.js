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

class WebpackTemplate {
  context = path.resolve(__dirname, "src");

  mode = "development";

  entry = {
    main: "./index.js",
  }

  output = {
    filename: this.fileName("js"),
    path: path.resolve(__dirname, this.buildNameOption()),
    assetModuleFilename: this.assetFileName()
  }

  resolve = {
    extensions: this.disableExtensions(".js", ".ts", ".jsx"),
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }

  optimization = this.optimizations();

  devtool = isDev ? "source-map" : false;

  devServer = {
    static: {
      directory: path.join(__dirname, "public")
    },
    compress: true,
    port: 5128,
    client: {
      overlay: true,
      progress: true,
      reconnect: true
    },
    historyApiFallback: true,
    hot: true
  };

  plugins = [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: "./index.html",
      favicon: "./assets/images/tree-icon.svg"
    }),
    new MiniCssExtractPlugin({
      filename: this.fileName("css")
    })
  ];

  module = {
    rules: [
      {
        test: /\.css$/i,
        use: this.cssLoader()
      },
      {
        test: /\.(sass|scss)$/i,
        use: this.cssLoader("sass-loader")
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
          options: this.babelOptions()
        }
      },
      {
        test: /\.ts$/i,
        exclude: "/node_modules",
        use: {
          loader: "babel-loader",
          options: this.babelOptions("@babel/preset-typescript")
        }
      },
      {
        test: /\.jsx$/i,
        exclude: "/node-modules",
        use: {
          loader: "babel-loader",
          options: this.babelOptions("@babel/preset-react")
        }
      }
    ]
  };

  disableExtensions(...extensions) {
    if (extensions) {
      return [...extensions];
    }
  }

  optimizations() {
    const config = {
      splitChunks: {
        chunks: "all"
      }
    }

    if (isProd) {
      config.minimizer = [
        new CssMinimizerWebpackPlugin(),
        new TerserWebpackPlugin()
      ];
    }

    return config;
  }

  addPlugin(plugin) {
    this.plugins.push(plugin);
  }

  addCopyWebpackPlugin(patterns) {
    this.plugins.push(
      new CopyWebpackPlugin({
        patterns: [...patterns]
      })
    );
  }

  assetFileName() {
    return isDev ? 'assets/[name].[ext]' : 'assets/[name].[hash].[ext]';
  }

  fileName(ext) {
    switch (ext) {
      case "css": return isDev ? `css/[name].${ext}` : `css/[name].[fullhash].${ext}`;
      case "js": return isDev ? `js/[name].${ext}` : `js/[name].[fullhash].${ext}`;
      default: return isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`;
    }
  }

  cssLoader(extra) {
    const loaders = [
      {
        loader: MiniCssExtractPlugin.loader
      },
      "css-loader"
    ];

    if (extra) {
      loaders.push(extra);
    }

    return loaders;
  }

  babelOptions(option) {
    const options = {
      presets: ["@babel/preset-env"]
    }

    if (option) {
      options["presets"].push(option);
    }
  
    return options;
  }

  buildNameOption() {
    return (isDev) ? "dist" : "build";
  }
}

const TEMPLATE_EXAMPLE_WEBPACK_CONFIG = new WebpackTemplate();

export default TEMPLATE_EXAMPLE_WEBPACK_CONFIG;
