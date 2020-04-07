<template>
  <div id="app">
    <div class="app-header">
      <div class="title">
        Vuestrap Testing
      </div>
      <div class="plugin-name">
        {{ pluginName }}
      </div>
      <div class="controls">
        <template v-if="isAuthenticatedSession">
          <div class="btn-logout" v-on:click="performLogout">Logout</div>
        </template>
      </div>
      <div class="clear" />
    </div>

    <app-navigation />

    <transition name="fade-fast" mode="out-in">
      <router-view class="page"></router-view>
    </transition>
  </div>
</template>

<script>
import AppNavigation from '../components/AppNavigation.vue';

export default {
  name: 'App',

  components: {
    AppNavigation,
  },

  computed: {
    pluginName() {
      return this.$store.getters['auth/pluginName'];
    },
    isAuthenticatedSession() {
      return this.$store.getters['auth/isAuthenticated'];
    },
  },

  methods: {
    performLogout() {
      this.$store.dispatch('auth/logoutUser')
        .then(() => this.$router.push('/'));
    },
  },
}
</script>

<style>

  body {
    font-size: 14px;
    color: #252525;
    background-color: #f9f9f9;
    margin: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  a {
    color: #676767;
    cursor: pointer;
    text-decoration: none;
  }
  a:hover {
    color: #111111;
  }

  .clear {
    clear: both;
  }

  .app-header {
    text-align: left;
    padding: 10px 30px;
  }
  .app-header > div {
    display: inline-block;
  }
  .app-header .title {
    font-size: 20px;
    font-weight: 500;
    border-right: 1px solid #dedede;
    padding-right: 30px;
  }
  .app-header .plugin-name {
    margin-left: 20px;
    font-size: 17px;
  }
  .app-header .controls {
    float: right;
  }

  .btn-logout {
    font-size: 15px;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    padding: 2px 9px;
    cursor: pointer;
  }
  .btn-logout:hover {
    background-color: #d9d9d9;
    border: 1px solid #d9d9d9;
  }

  .page {
    margin-top: 20px;
    padding: 40px;
  }
  .page-message {
    font-size: 18px;
  }

/* -----------------------------------------------------------------------------
 * Component Transitions
 * -------------------------------------------------------------------------- */

  /* -----------------------------------------------------  fade-slow (2 sec) */
  .fade-slow-enter-active,
  .fade-slow-leave-active {
    transition: opacity 2s;
  }
  .fade-slow-enter,
  .fade-slow-leave-to {
    opacity: 0;
  }

  /* ----------------------------------------------------------  fade (1 sec) */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  /* ---------------------------------------------------  fade-fast (0.5 sec) */
  .fade-fast-enter-active,
  .fade-fast-leave-active {
    transition: opacity 0.5s;
  }
  .fade-fast-enter,
  .fade-fast-leave-to {
    opacity: 0;
  }

  /* -------------------------------------------------  fade-flash (0.25 sec) */
  .fade-flash-enter-active,
  .fade-flash-leave-active {
    transition: opacity 0.25s;
  }
  .fade-flash-enter,
  .fade-flash-leave-to {
    opacity: 0;
  }

</style>
