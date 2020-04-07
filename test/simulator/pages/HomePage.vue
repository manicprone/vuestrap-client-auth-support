<template>
  <div>

    <div class="welcome-message" v-if="isAuthenticatedSession">
      <div>{{ welcomeMessageText }}</div>
      <div class="smiley">:)</div>
    </div>

    <div v-else>
      <div class="login-message">
        <span>{{ loginText }}</span>
      </div>
      <local-account-login class="login-link" v-on:login="performLogin" />
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomePage',

  computed: {
    isAuthenticatedSession() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    user() {
      return this.$store.getters['auth/userInfo'];
    },
    loginText() {
      return 'Login with your account';
    },
    welcomeMessageText() {
      return (this.user) ? `Welcome, ${this.user.display_name} !` : 'Welcome !';
    },
  },

  methods: {
    performLogin(creds) {
      return this.$store.dispatch('auth/loginUser', creds)
        .then((sessionInfo) => {
          console.log('Logged-in with session info:', sessionInfo);
          return this.$router.push({ name: 'private' });
        })
        .catch((error) => {
          console.log('Error logging in =>', error);
        });
    },
  },
};
</script>

<style scoped>

  .login-message {
    font-size: 18px;
    text-align: center;
    margin: 30px auto 30px auto;
    width: 240px;
  }

  .welcome-message {
    font-size: 28px;
    text-align: center;
    margin: 30px auto 30px auto;
  }
  .welcome-message .smiley {
    margin-top: 20px;
  }


</style>
