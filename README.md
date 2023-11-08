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
