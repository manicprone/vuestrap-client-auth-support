import { generateStore } from './store/auth'
import LocalAccountLogin from './components/LocalAccountLogin.vue'

const pluginName = 'client-auth-support'
const defaultNamespace = 'auth'
const defaultTokenName = 'user-auth-token'
const defaultUnAuthedTo = 'login'
const componentNameLocalAccountLogin = 'local-account-login'

export default function install(Vue, options = {}) {
  // Parse options...
  const logInit = options.logInit && options.logInit === true
  const debug = options.debug && options.debug === true
  const namespace = options.namespace || defaultNamespace
  const tokenName = options.tokenName || defaultTokenName
  const authenticator = options.authenticator
  const includeUserInfo = options.includeUserInfo && options.includeUserInfo === true
  const directUnAuthedTo = options.directUnAuthedTo || defaultUnAuthedTo

  if (logInit) console.log(`Vue is being bootstrapped with "${pluginName}"`)

  // Bootstrap vuex with auth session management...
  if (options.store) {
    const authSessionStore = generateStore({
      debug,
      pluginName,
      authenticator,
      tokenName,
      includeUserInfo,
    })
    options.store.registerModule(namespace, authSessionStore)

    // Bootstrap vue-router with validate hook...
    if (options.router) {
      options.router.beforeEach((to, from, next) => {
        options.store.dispatch(`${namespace}/validateSession`)
          .then((sessionInfo) => {
            if (to.matched.some(record => record.meta.requiresAuth)) {
              if (!sessionInfo.is_authenticated && to.name !== directUnAuthedTo) {
                next({ name: directUnAuthedTo })
              } else {
                next()
              }
            } else {
              next()
            }
          })
      })
    } // end-if (options.router)
  } // end-if (options.store)

  // Register LocalAccountLogin component...
  Vue.component(componentNameLocalAccountLogin, LocalAccountLogin)
}
