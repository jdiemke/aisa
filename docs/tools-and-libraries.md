# Tools and Libraries Used

## Runtime and Demo Features

- [Matter.js](https://brm.io/matter-js/) - 2D physics for the physics example.
- [stats.js](https://github.com/mrdoob/stats.js) - Performance monitoring.
- [canvas-record](https://github.com/dmnsgn/canvas-record) - Canvas recording support.

## Music and Synchronization

- [Cowbell](https://github.com/demozoo/cowbell) - Music playback infrastructure.
- [libopenmpt](https://lib.openmpt.org/libopenmpt/) - Tracker music playback through Cowbell's JavaScript/WebAssembly backend.
- [Rocket / JSRocket](https://github.com/rocket/rocket) - Synchronization of demo effects with music.

## Build and Development

- [Node.js](https://nodejs.org/) and [npm](https://docs.npmjs.com/) - Development runtime, dependency management, and project scripts.
- [TypeScript](https://www.typescriptlang.org/) - Engine and example implementation language.
- [Webpack](https://webpack.js.org/) and [webpack-cli](https://webpack.js.org/api/cli/) - Bundling examples and their assets.
- [ts-loader](https://github.com/TypeStrong/ts-loader) - TypeScript compilation within Webpack.
- [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) - Generation of example HTML pages and the example index.
- [copy-webpack-plugin](https://webpack.js.org/plugins/copy-webpack-plugin/) - Copying static resources into the build output.
- [css-loader](https://webpack.js.org/loaders/css-loader/) and [style-loader](https://webpack.js.org/loaders/style-loader/) - Loading CSS and injecting styles into example pages.
- [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) - Local development server with live reload.
- [http-server](https://github.com/http-party/http-server) - Serving the compiled output locally.
- [ts-node](https://typestrong.org/ts-node/) - Running TypeScript helper scripts.
- [cross-env](https://github.com/kentcdodds/cross-env) - Setting environment variables consistently across platforms.

## Code Quality and Testing

- [ESLint](https://eslint.org/) and [@eslint/js](https://www.npmjs.com/package/@eslint/js) - JavaScript linting and recommended rules.
- [typescript-eslint](https://typescript-eslint.io/) - TypeScript linting support.
- [Playwright](https://playwright.dev/) - Browser smoke tests and example screenshot generation.
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) type packages - Type definitions for Node.js, Matter.js, and stats.js.

## Deployment

- [GitHub Actions](https://docs.github.com/en/actions) - Automated build and deployment on pushes to `master`.
- [actions/checkout](https://github.com/actions/checkout) and [actions/setup-node](https://github.com/actions/setup-node) - Repository checkout and Node.js setup with npm caching.
- [GitHub Pages deploy action](https://github.com/JamesIves/github-pages-deploy-action) - Publishing fresh build output to `gh-pages` and removing stale deployed files.
- [GitHub Pages](https://docs.github.com/en/pages) - Hosting the compiled examples.
