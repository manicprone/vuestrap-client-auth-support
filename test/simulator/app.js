import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import MockAuthenticator from 'authenticator-client-mock-js'
import ClientAuthSupport from '../../dist/plugin'
import { createStore } from '../test-app-helpers'
import { createRouter } from './routers/simple-public-private'
import App from './pages/App.vue'

Vue.config.productionTip = false

// Create store and router instances, sync router with the store...
const store = createStore()
const router = createRouter()
sync(store, router)

// TODO: Consider supporting 'endpoints' + 'httpClient' options,
//       as alternative to the encapsulated 'authenticator' option !!!

// Bootstrap with client auth support...
Vue.use(ClientAuthSupport, {
  logInit: true,
  debug: true,
  store,
  router,
  authenticator: new MockAuthenticator({ ttl: 10 * 60 * 1000 }),
  // endpoints: {
  //   authenticateUser: '',
  //   fetchUserInfo: '',
  //   expireUser: '',
  // },
  // httpClient: <axios>,
  // authScheme: 'oauth2-bearer',
  // grantType: 'password',
  // modelUserInfo: <the_model>, --> Maybe we don't do this !!! Just support data being passed/persisted.
  tokenName: 'user-auth-token',
  persistType: 'local',
  directUnAuthedTo: 'home',
  includeUserInfo: true,
})

// Instantiate root Vue instance...
const app = new Vue({
  router,
  store,
  render: h => h(App),
})

// Mount to DOM...
app.$mount('#app')
