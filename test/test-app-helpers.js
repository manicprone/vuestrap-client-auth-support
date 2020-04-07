import Vue from 'vue'
import Vuex from 'vuex'
// import { sync } from 'vuex-router-sync';
// import cheerio from 'cheerio';
import MockAuthenticator from 'authenticator-client-mock-js'
import ClientAuthSupport from '../dist/plugin'
// import { createRouter } from './simulator/routers/simple-public-private';

Vue.use(Vuex)

// const renderer = require('vue-server-renderer').createRenderer();

// export function generateDOM(template, data = {}) {
//   return new Promise((resolve) => {
//     const app = createApp(template, data);
//
//     renderer.renderToString(app, (error, html) => {
//       const dom = cheerio.load(html);
//       resolve(dom, app);
//     });
//   });
// }

export function createApp(template, data = {}) {
  // Create store and router instances, sync router with the store...
  const store = createStore()
  const router = createRouter()
  // sync(store, router);

  // Bootstrap with client auth support...
  Vue.use(ClientAuthSupport, {
    // logInit: true,
    // debug: true,
    store,
    // router,
    authenticator: new MockAuthenticator({ ttl: 10 * 60 * 1000 }),
    tokenName: 'user-auth-token',
    persistType: 'local',
    directUnAuthedTo: 'home',
  })

  // Create root Vue instance...
  const app = new Vue({
    template,
    router,
    store,
    ...data,
  })

  return app
}

export function createStore() {
  return new Vuex.Store({
    modules: {},
  })
}

export function createRouter() {
  return {}
}
