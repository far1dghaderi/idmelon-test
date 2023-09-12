# AngularExample

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.8.


## Using PcProxApi-WebSDK package

1. create local link for npm registry by below command
###  `npm link `
the above command need to be run in websdk folder

2. create an angular application and link PcProxApi-WebSDK by below command
###  `npm link PcProxApi-WebSDK `
the above command need to be run in angular example folder, make sure in the node module you will get PcProxApi-WebSDK package with arrow symbol

3. copy dist folder files(pcproxapi.js & pcproxapi.wasm) of PcProxApi-WebSDK nodemodule package in the src folder

4. update the script and assets of build configuration in angular.json with below changes

"assets": [
              "src/favicon.ico",
              "src/assets",
              "src/pcProxAPI.wasm"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": ["./src/pcProxAPI.js","./node_modules/PcProxApi-WebSDK/build/bundle.js"]
          
5. ng serve


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

