# Client Auth Support Planning

> vuestrap-client-auth-support

<br />

## Recently Added Features

<br />

## Upcoming Features

* Add section to README to outline the auth schemes supported, and describe the flows, etc.

<br />

## Backlog

* Add functional testing (of logic, flow, and components) !!!

* Package Authenticators with plugin:

  - MockAuthenticator
  - GoogleOAuth2Authenticator
  - WeChatOAuth2Authenticator
  - GitLabOAuth2Authenticator
  - GitHubOAuth2Authenticator

* Include login (and related) components as part of plugin.

  - Add router logic.
  - Add error message display to login component (from authentication failure).
  - Add AppMessage model.
  - Follow similar pattern as EditorFeedback (from Storytold), to manage errors in a queue in the store.

* Add persistence logic for user info (using `shvl`).

* Understand and resolve the sourcemap build issue.

* Resolve issue with simulator app on browser refresh.

* Add action response on "enter" keypress for LocalAccountLogin component "login" button.

* Add support for 'cookie' and 'session' persistence methods.

* Add support for setting the `directUnAuthedTo` option by its uri path (currently only route name is supported).

* Enhance support, documentation, and architecture for the "Authenticator" dependency.

* Extend architecture to support authorization rules, that can be configured (via config file/options), similar to joint-kit.

<br />

## To Consider

* Consider supporting `endpoints` and `httpClient` options, as alternative to the encapsulated `authenticator` option (where `httpClient` accepts any supported client library instance e.g. axios).
