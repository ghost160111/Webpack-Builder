# Webpack-Builder

This is Webpack builder, ready to use configuration code with all needed to use directories and assets for your project to just copy and paste all the code, use it and definitely configure it for want.

## Get started with Webpack builder

This project contains basic configuration for web development using Webpack 5.

- First you need to init your project:

```sh
npm init
# or
npm init -y
```

Remember, `npm init -y` autogenerates package.json with default configurations, `npm init` ask you to type values for basic keys like name of package, version of package, git repository link and so on.

In addition, remember to add type of module in your package.json, because it is really important to set which style of js you want to use either commonjs or moduled style.

- Secondly, you need to install all the needed packages and tools for effectively using Webpack.

In this particular example I am using Webpack 5 as default, as it is recommended and easier to use rather than the previous versions of Webpack.

Command to install all packages that is needed for solid configuration

```sh
npm install --save-dev @babel/core @babel/preset-env @babel/preset-typescript babel-eslint babel-loader clean-webpack-plugin copy-webpack-plugin cross-env css-loader css-minimizer-webpack-plugin eslint file-loader html-webpack-plugin mini-css-extract-plugin node-sass raw-loader sass-loader style-loader terser-webpack-plugin webpack webpack-cli webpack-dev-server
```

If you are working with xml or csv, you need to download loaders for them as well, see the following commands:

```sh
npm install --save-dev xml-loader csv-loader
```

In order to enable development mode, use `NODE_ENV=development` in your terminal, if your operating system is windows!

```bat
NODE_ENV=development
```

Adding font awesome package, which is a great package with tons of png, svg icons of almost anything.

1. Adding SVG core

```sh
npm install --save-dev @fortawesome/fontawesome-svg-core
```

2. Add Icon packages

```sh
npm install --save-dev @fortawesome/free-solid-svg-icons
npm install --save-dev @fortawesome/free-regular-svg-icons
npm install --save-dev @fortawesome/free-brands-svg-icons
```

- Adding .gitignore file.

Adding gitignore is one of mandatory parts in your project configuration because .gitignore lets ignore directories and files in project.

- Scripts of your package:

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development webpack --mode development",
  "build": "cross-env NODE_ENV=production webpack --mode production",
  "watch": "cross-env NODE_ENV=development webpack --mode development --watch",
  "start": "cross-env NODE_ENV=development webpack-dev-server --mode development --open"
},
```

- Lastly, TypeScript configuration

There is a tsconfig.json file that simply configures how your typescript files should be compiled and bundled through Webpack.

- Documentation

There is a \docs directory which is optional to add to your project, because basically all basic project documentation are pretty small and are written traditionally to top level project dir README.md file.

- Eslint

As you can there is no `.eslintrc` file in the project, you can create one and configure yourself for your needs and your style of coding in JavaScript.

- Additionally

Template syntax, if you want more extended functiolity like template class, here is the example with slightly extended functionality:

```js
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
    vue: "./VueApp.js"
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
```
