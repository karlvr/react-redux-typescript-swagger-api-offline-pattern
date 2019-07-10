# React + Redux + TypeScript + OAuth2 + Swagger Codegen API Client + Offline pattern

This is a pattern for using React with Redux to build an Offline app using a Swagger Codegen API Client in TypeScript. This is based upon my pattern
for building [React + Redux + Typescript + OAuth2 + Swagger Codegen API Client](https://github.com/karlvr/react-redux-typescript-swagger-api-pattern), which is based upon [React + Redux + Typescript](https://github.com/karlvr/react-redux-typescript-pattern). Please refer to those patterns first for an introduction to the approach.

For the API example we use the [Swagger Petstore](http://petstore.swagger.io/) API, which includes a Swagger API definition that we use to generate the API client, using [swagger-codegen](https://github.com/swagger-api/swagger-codegen).

We also include an OAuth 2 authentication example. Note that this is independent of the API example!

### Layout

We add an `auth` module and an `api` module:

* `src/modules/auth` the auth module
* `src/modules/petstore` an example module that displays a list of pets, and interacts with the API.
* `src/modules/api` the root file for the API module

Within each of these modules we follow the sample template layout as in the original pattern, with the addition
of:

* `functions.ts` module functions
* `sagas.ts` async redux-saga code
* `selectors.ts` Redux state selectors
* `types.ts` module type definitions

## Dependencies

In addition to the base [React + Redux + Typescript + OAuth2 + Swagger Codegen API Client](https://github.com/karlvr/react-redux-typescript-swagger-api-pattern) we add the following dependencies:

* [redux-offline](https://github.com/redux-offline/redux-offline) (a complete offline pattern and framework)

## Running

You can run this project by cloning the git repo, then cd into the project folder.

First install the required node modules:

```
npm install
```

You'll then need to also install dependencies for the API module:

```
pushd gen/api && npm install && popd
```

Then run it using:

```
npm start
```

## Setup

Start with [React + Redux + Typescript](https://github.com/karlvr/react-redux-typescript-pattern) then [React + Redux + Typescript + OAuth2 + Swagger Codegen API Client](https://github.com/karlvr/react-redux-typescript-swagger-api-pattern).

Install additional dependencies:

```
npm install --save @redux-offline/redux-offline
```

### API

Refer to [React + Redux + Typescript + OAuth2 + Swagger Codegen API Client](https://github.com/karlvr/react-redux-typescript-swagger-api-pattern#api) for how the API client is generated.
