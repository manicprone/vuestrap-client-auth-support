<template>
  <div class="local-account-login">

    <form method="post">
      <div class="input-creds-area">
        <div>
          <label>u</label> <input type="text" required v-model="activeUsername" />
        </div>
        <div>
          <label>p</label> <input type="password" required v-model="activePassword" />
        </div>
      </div>

      <div class="btn-login-area">
        <div class="btn-login" v-on:click="login">Login</div>
      </div>
    </form>

  </div>
</template>

<script>
export default {
  name: 'LocalAccountLogin',

  data() {
    return {
      activeUsername: this.username,
      activePassword: this.password,
    };
  },

  props: {
    username: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
  },

  methods: {
    login() {
      this.$emit('login', { username: this.activeUsername, password: this.activePassword });
    },
  },
};
</script>

<style scoped>

  .input-creds-area label {
    font-size: 14px;
    display: inline-block;
    line-height: 0.7em;
    border-right: 1px solid #d9d9d9;
    width: 2.7em;
  }
  .input-creds-area input {
    font-size: 15px;
    margin-bottom: 7px;
    margin-left: 12px;
  }

  .btn-login-area {
    margin-left: 15px;
  }
  .btn-login {
    font-size: 16px;
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    margin: 10px auto 0 auto;
    padding: 6px 0;
    width: 90px;
    cursor: pointer;
  }
  .btn-login:hover {
    background-color: #d9d9d9;
    border: 1px solid #d9d9d9;
  }

</style>
