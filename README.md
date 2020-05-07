# Vuestrap | Client Auth Support

Instant implementation of user authentication for Vuestack client apps (Vue + Vue-Router + Vuex).

<br />

## Table of Contents

* [Introduction][section-introduction]
* [Prerequisites][section-prerequisites]
* [How to Use][section-how-to-use]
* [Namespace][section-namespace]
* [Options][section-options]
* [Models][section-models]
* [Store][section-store]
* [Router][section-router]
* [Components][section-components]
* [Authenticators][section-authenticators]
* [Lifecycle][section-lifecycle]
* [For Developers][section-for-developers]


## Introduction

### What is a Vuestrap?

A Vuestrap is a Vue plugin designed to bootstrap Vue apps with robust, fully-operational application layers.

The plugins strap themselves across the full horizontal stack of the Vue anatomy:
adding router logic, state management handling, application logic, data models, and components,
allowing you to rapidly compose powerful Vue application boilerplates.

### Client Auth Support

The *Client Auth Support* Vuestrap provides persisent user authentication sessions within a Vue client application.


## Prerequisites

The *Client Auth Support* plugin requires:

* Vue2 ([github.com/vuejs/vue][link-vue-github])
* Vuex ([github.com/vuejs/vuex][link-vuex-github])
* A compatible Authenticator (see [Authenticators][section-authenticators])


To harness the instant implementation of auth support, vue-router is needed:

* Vue-Router ([github.com/vuejs/vue-router][link-vue-router-github])

> If a vue-router instance is not provided when bootstrapping, or vue-router is not being utilized in your application stack, you can leverage the store API and data models to programmatically implement auth support.


## How to Use

### Install

#### with yarn:

``` sh
$ yarn add vuestrap-client-auth-support
```

#### with npm:

``` sh
$ npm install vuestrap-client-auth-support --save
```

### Bootstrap Your Vue App

``` javascript
import Vue from 'vue'
import store from './store' // your vuex store instance
import router from './router' // your vue-router instance
import ClientAuthSupport from 'vuestrap-client-auth-support'

Vue.use(ClientAuthSupport, {
  store,
  router,
  authenticator: <my_authenticator>,
  persistType: 'local',
  tokenName: 'user-auth-token',
})
```

## Namespace

The default namespace for the Client Auth Support store API is: `auth`.

However, you can set your preferred namespace when bootstrapping, using the `namespace` option.


## Options

The following options are available when bootstrapping the app.

| Name             | Required? | Description |
| ---------------- | --------- | ----------- |
| store            | Yes       | The Vuex instance. |
| router           | No        | The Vue-Router instance. If provided, full auth support logic will be automatically configured. If a router instance is not provided, the store actions must be leveraged to implement auth support in your app. |
| authenticator    | Yes       | Compatible authentication logic (see [Authenticators][section-authenticators]). |
| persistType      | No        | A string identifier, specifying the method of persistence to use for the token. Available values: `'local'` (default), `'session'`, `'cookie'`. |
| tokenName        | No        | The name to use for the persisted auth token. If not specified, the default token name used is `user-auth-token`. |
| directUnAuthedTo | No        | The route name to direct un-authenticated traffic, when a route is guarded using the `requiresAuth` meta property. Default value: `'login'`. |
| includeUserInfo  | No        | Set to `true` to invoke the `fetchUserInfo` hook, subsequent to the `authenticateUser` request. |
| namespace        | No        | The namespace to use with the store API. By default, the namespace is `auth`. |
| logInit          | No        | Set to `true` to log messages on bootstrapping. Defaults to `false`. |
| debug            | No        | Set to `true` to log debug messages during utilization. Defaults to `false`. |


## Models

| Model    | Description |
| -------- | ----------- |
| UserInfo | Holds the authenticated user's info, retrieved from the provider's `fetchUserInfo` endpoint (if configured). |


### UserInfo

The `UserInfo` data model encapsulates the user information returned by the authentication provider. The `fetchUserInfo` hook must be implemented on the authenticator for this action to be executed. The Vuestrap creates and manages this model internally, whenever authentication occurs.

#### Properties

| Name             | Type    | Description |
| ---------------- | ------- | ----------- |
| model            | String  | The name of the model type (i.e. `UserInfo`). |
| id               | Number or String | The ID of the user. |
| username         | String | The username of the user. |
| email            | String | The email of the user. |
| first_name       | String | The first name of the user. |
| last_name        | String | The last name of the user. |
| display_name     | String | The display name of the user. |
| preferred_locale | String | The preferred locale of the user. |
| avatar_url       | String | The avatar URL for the user. |
| avatar_thumb_url | String | A thumbnail version of the avatar URL for the user. |
| roles            | Array  | An array of role names granted to the user. |

#### Functions

| Name         | Parameters | Returns | Description |
| ------------ | ---------- | ------- | ----------- |
| hasRole      | roleName   | Boolean | A convenience method for checking if the user has a specified role. |
| getInfo      | (none)     | Object  | Generates a light-weight info object describing the user. |
| toSession    | (none)     | String  | Generates a stringified version of the info object describing the user. |
| serialize    | (none)     | String  | Serializes the full set of user properties into a String, that is safe for HTTP transport. |


## Store

### Getters

| Getter          | Returns | Description | Example |
| --------------- | --------| ----------- | ------- |
| pluginName      | String | The plugin name/identifier. This value cannot be changed. | `this.$store.getters['auth/pluginName']` |
| isAuthenticated | Boolean | Returns `true` when an authenticated session exists. | `this.$store.getters['auth/isAuthenticated']` |
| authToken       | String | The active user auth token, obtained when a user has successfully authenticated. Returns `null` if an auth session has not been successfully established. | `this.$store.getters['auth/authToken']` |
| userInfo        | `UserInfo` | The user information returned by the authentication provider. This will only be set if the `fetchUserInfo` hook is implemented by the authenticator. | `this.$store.getters['auth/userInfo']` |
| isAuthenticating    | Boolean | Returns `true` when the app is performing authentication (on `loginUser`). | `this.$store.getters['auth/isAuthenticating']` |
| isValidatingSession | Boolean | Returns `true` when the app is performing session validation (on `validateSession`).  | `this.$store.getters['auth/isValidatingSession']` |
| isFetchingUserInfo  | Boolean | Returns `true` when the app is fetching user information via the authenticator hook (on `fetchUserInfo`). | `this.$store.getters['auth/isFetchingUserInfo']` |
| isExpiringSession   | Boolean | Returns `true` when the app is performing session expiration (on `logoutUser`). | `this.$store.getters['auth/isExpiringSession']` |

### Actions

All actions are Promises, but not all actions are asynchronous.

| Name             | Parameters | Returns   | Description | Example |
| ---------------- | ---------- | --------- | ----------- | ------- |
| validateSession  | (none)     | `{ is_authenticated: <true_or_false>, token: <the_auth_token>, user_info: <the_user_info_model> }` | TBC | `this.$store.dispatch('auth/validateSession')` |
| loginUser        | creds = `{ username: <username>, password: <password> }` | `{ is_authenticated: <true_or_false>, token: <the_auth_token>, user: <the_user_info_model> }` | TBC | `this.$store.dispatch('auth/loginUser', creds)` |
| logoutUser       | (none)     | (none) | TBC | `this.$store.dispatch('auth/logoutUser')` |


#### Internal Actions

The following actions are available in the store, but are primarily utilized internally by the Vuestrap logic. Unless you are performing customized logic with the Client Auth Support store, you will not likely use these actions.

| Name             | Parameters | Returns   | Description | Example |
| ---------------- | ---------- | --------- | ----------- | ------- |
| fetchUserInfo    | (none)     | `{ <the_user_info> }` | TBC | `this.$store.dispatch('auth/fetchUserInfo')` |
| setUserInfo      | `UserInfo` | (void) | TBC | `this.$store.dispatch('auth/setUserInfo', userInfo)` |


## Router

If a Vue router instance is provided to the Vuestrap when bootstrapping (i.e. with `Vue.use`),
a `beforeEach` hook is registered that calls the `validateSession` store action
on every route transition. This enables the app to maintain its active auth session, so a refresh of the app
will maintain the active authenticated session.

If you want to enforce that a user must be authenticated (logged-in) in order to enter/view a particular route, you can use the `requiresAuth` meta property to enforce this policy.

For any routes with the `requiresAuth` guard attached, the `validateSession` hook will check if the active user is logged-in (authenticated) before entering the route. If not, the router will forward the un-authenticated user to the route specified with the `directUnAuthedTo` option (by default the route is `'login'`).

**Example**
``` javascript
new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/account',
      name: 'account',
      component: MyAccountPage,
      meta: { requiresAuth: true }, // the user must be logged-in to view
    },
  ],
})
```


## Components

### LocalAccountLogin (local-account-login)

> Provides a simple username/password login box.

### Props

| Prop              | Type    | Description |
| ----------------- | ------- | ----------- |
| `username`        | String  | Set to pre-fill the username input. |
| `password`        | String  | Set to pre-fill the password input. |


### Events

| Name          | Returns | Description | Example |
| ------------- | ------- | ----------- | ------- |
| login         | ``` creds = { ...} ``` | Emitted when login submit is clicked. | `<local-account-login v-on:login="doLogin" />` |


### Example

``` javascript
<local-account-login />
```


## Authenticators

[TBC]


## Lifecycle

The operations responsible for establishing and managing authenticated states are described below.

### loginUser

![loginUser](src/assets/loginUser.svg)

### validateSession

![validateSession](src/assets/validateSession.svg)


## For Developers

### Dev Run

To provide a fully working Vue app environment to test and develop the plugin, a simple Vue application will build (the plugin & the app bundle) and serve when running:

``` sh
$ yarn dev
```

By default, the development app environment will hot-reload changes and will run on `localhost:3301`.

> You can change the configuration for the development environment via `test/simulator/config.js`.

### Dev Lint

The plugin uses [ESLint][link-eslint-site] for source code linting. The linting will run automatically on `git commit`.

``` sh
$ yarn lint
```
> You can run with flag `--fix`, or shortcut command *flint*, to trigger auto fixing (e.g. `yarn flint`).

### Dev Test

The plugin uses [Mocha][link-mocha-site] for the testing framework,
and [Chai][link-chai-site] and [Chai-HTTP][link-chai-http-site] for its assertions.

``` sh
$ yarn test
```

### Dev Build

The plugin is automatically built on `yarn publish`. But, you can manually build the plugin using:

``` sh
$ yarn build-plugin
```


[section-introduction]: #introduction
[section-prerequisites]: #prerequisites
[section-how-to-use]: #how-to-use
[section-namespace]: #namespace
[section-options]: #options
[section-models]: #models
[section-store]: #store
[section-router]: #router
[section-components]: #components
[section-authenticators]: #authenticators
[section-lifecycle]: #lifecycle
[section-for-developers]: #for-developers

[link-vue-github]: https://github.com/vuejs/vue
[link-vuex-github]: https://github.com/vuejs/vuex
[link-vue-router-github]: https://github.com/vuejs/vue-router
[link-rollup-plugin-vue-github]: https://github.com/vuejs/rollup-plugin-vue
[link-vue-rollup-boilerplate-github]: https://github.com/dangvanthanh/vue-rollup-boilerplate

[link-eslint-site]: https://eslint.org
[link-mocha-site]: https://mochajs.org
[link-chai-site]: http://chaijs.com
[link-chai-http-site]: http://chaijs.com/plugins/chai-http
