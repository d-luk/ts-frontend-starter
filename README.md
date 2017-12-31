# TypeScript front-end starter
[![Build Status](https://travis-ci.org/d-luk/ts-frontend-starter.svg?branch=master)](https://travis-ci.org/d-luk/ts-frontend-starter) [![dependencies Status](https://david-dm.org/d-luk/ts-frontend-starter/status.svg)](https://david-dm.org/d-luk/ts-frontend-starter)

A basic template to quickly get started with a client-only web application using TypeScript.

## Features
No configuration needed. All works out of the box!

- Automatic transpiling:
    - [TypeScript](https://www.typescriptlang.org/) to optimized JavaScript
    - [PugJS](https://pugjs.org) to minified HTML
    - [Sass](http://sass-lang.com/) to optimized CSS
    - Including source maps!
- Live reloading using [BrowserSync](https://www.browsersync.io/)
- Continuous Integration using [TravisCI](https://travis-ci.org/)
- TypeScript linting with [TSLint](https://palantir.github.io/tslint/)

## Getting started
1. Run [`yarn`](https://yarnpkg.com/) to install the dependencies
2. Run `yarn run dev` to start developing
3. Make changes to the `src` files and watch the page update automagically

## Ready to deploy
Run `yarn run build` and a production ready version of your code will be available in the `dist` folder.
