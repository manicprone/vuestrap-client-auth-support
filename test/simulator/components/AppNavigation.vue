<template>
  <div class="app-navigation">

    <router-link v-bind:to="{ name: 'home' }">
      <div v-bind:class="generateNavItemClasses('home')">
        <span>Home Page</span>
      </div>
    </router-link>

    <router-link v-bind:to="{ name: 'public' }">
      <div v-bind:class="generateNavItemClasses('public')">
        <span>Public Page</span>
      </div>
    </router-link>

    <router-link v-bind:to="{ name: 'private' }">
      <div flat v-bind:class="generateNavItemClasses('private')">
        <span>Private Page</span>
      </div>
    </router-link>

  </div>
</template>

<script>
export default {
  name: 'AppNavigation',

  methods: {
    generateNavItemClasses(routeName) {
      return (this.$route.name === routeName)
        ? 'nav-item selected-nav-item'
        : 'nav-item';
    },
  },
};
</script>

<style scoped>

  .app-navigation {
    border-top: 1px solid #c9c9c9;
    border-bottom: 1px solid #c9c9c9;
    background-color: #e9e9e9;
  }

  .nav-item {
    display: inline-block;
    font-weight: 500;
    text-transform: none;
    padding: 6px 15px;
  }
  .selected-nav-item {
    color: #111111;
    background-color: #cfcfcf;
  }

</style>
