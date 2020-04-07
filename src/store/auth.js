
export function generateStore(options) {
  const debug = options.debug
  const pluginName = options.pluginName
  const AuthAPI = options.authenticator
  const tokenName = options.tokenName
  const includeUserInfo = options.includeUserInfo
  const valueDelimiter = '__'

  const store = { namespaced: true }

  // ---------------------------------------------------------------------------
  // Store state
  // ---------------------------------------------------------------------------
  store.state = {
    pluginName,

    isAuthenticating: false,
    isValidatingSession: false,
    isFetchingUserInfo: false,
    isExpiringSession: false,

    isAuthenticated: false,
    authToken: null,
    userInfo: null,
  }

  // ---------------------------------------------------------------------------
  // Store getters
  // ---------------------------------------------------------------------------
  store.getters = {
    pluginName(state) {
      return state.pluginName
    },
    isAuthenticating(state) {
      return state.isAuthenticating
    },
    isValidatingSession(state) {
      return state.isValidatingSession
    },
    isFetchingUserInfo(state) {
      return state.isFetchingUserInfo
    },
    isExpiringSession(state) {
      return state.isExpiringSession
    },
    isAuthenticated(state) {
      return state.isAuthenticated
    },
    authToken(state) {
      return state.authToken
    },
    userInfo(state) {
      return state.userInfo
    },
  }

  // ---------------------------------------------------------------------------
  // Store actions
  // ---------------------------------------------------------------------------
  store.actions = {
    // This action will always resolve !!!
    validateSession(context) {
      const { state, commit, dispatch, getters } = context

      commit('setIsValidatingSession', true)
      if (debug) console.log(`[${pluginName}] Validating auth session...`)

      return new Promise((resolve) => {
        // Look for user token in local storage...
        const tokenInfo = localStorage.getItem(tokenName)
        const token = parseTokenInfo(tokenInfo)

        // If no token found, enable anonymous session...
        if (!token.value) {
          if (debug) console.log(`[${pluginName}] No user token found. Enabling anonymous session.`)
          commit('setIsValidatingSession', false)
          if (state.isAuthenticated) commit('clearSession') // clear out session (storage is explicitly purged)
          return resolve({ is_authenticated: false, token: null, user_info: null })
        }

        // If token expired, force logout...
        if (isPast(token.expires_at)) {
          if (debug && token.value) console.log(`[${pluginName}] User token has expired.`)
          commit('setIsValidatingSession', false)
          return dispatch('logoutUser')
            .then(() => resolve({ is_authenticated: false, token: null, user_info: null }))
        }

        // Otherwise, establish authenticated session...
        commit('setIsAuthenticated', true) // set authenticated state
        commit('setAuthToken', token.value) // save token to store
        if (debug) console.log(`[${pluginName}] A valid user session has been established.`)

        // Check if existing user info is already loaded (or if hook not enabled)...
        const activeUserInfo = getters.userInfo
        if (activeUserInfo || !includeUserInfo) {
          // Return user info and auth token...
          if (debug && includeUserInfo) console.log(`[${pluginName}] Active user info already loaded:`, activeUserInfo)
          return resolve({ is_authenticated: true, token: token.value, user_info: activeUserInfo })
        }

        // Otherwise, fetch user info from endpoint...
        return dispatch('fetchUserInfo')
          .then((userInfo) => {
            // If no user info obtained, just return token...
            if (!userInfo) return resolve({ is_authenticated: true, token: token.value, user_info: null })

            // Build user info and save to store...
            if (debug) console.log(`[${pluginName}] Active user info to load:`, userInfo)
            dispatch('setUserInfo', userInfo)

            // Return user info and auth token...
            return resolve({ is_authenticated: true, token: token.value, user_info: userInfo })
          })
          .catch((error) => {
            // If error on user info hook, force logout...
            return dispatch('logoutUser')
              .then(() => resolve({ error, is_authenticated: false, token: null, user_info: null }))
          })
          .finally(() => {
            commit('setIsValidatingSession', false)
          })
      })
    },

    loginUser(context, creds) {
      const { commit, dispatch } = context
      if (!creds) return Promise.reject(false)

      commit('setIsAuthenticating', true)
      if (debug) console.log(`[${pluginName}] Authenticating user...`)

      return AuthAPI.authenticateUser(creds)
        .then((authInfo) => {
          if (debug) console.log(`[${pluginName}] Retrieved auth info:`, authInfo)

          // Persist authentication token details...
          const tokenInfo = (authInfo.expires_at)
            ? `${authInfo.token}${valueDelimiter}${authInfo.expires_at}`
            : `${authInfo.token}`
          localStorage.setItem(tokenName, tokenInfo)

          // Establish authenticated session, authorize against app...
          commit('setIsAuthenticating', false)
          return dispatch('validateSession')
            .then((sessionInfo) => {
              if (!sessionInfo.is_authenticated) return Promise.reject(sessionInfo.error) // reject on failed login
              return sessionInfo // return session info on successful login
            })
        })
        .catch((error) => {
          commit('setIsAuthenticating', false)
          if (debug) console.log(`[${pluginName}] Excountered provider error when authenticating user:`, error)
          return Promise.reject(error)
        })
    },

    logoutUser(context) {
      const { commit, getters } = context

      commit('setIsExpiringSession', true)
      const authToken = getters.authToken

      return AuthAPI.expireUser(authToken)
        .catch((error) => {
          if (debug) console.log(`[${pluginName}] Encountered provider error when expiring user:`, error)
        })
        .finally(() => {
          // Clear authenticated session and stored token...
          if (debug) console.log(`[${pluginName}] Logging out user session`)
          localStorage.removeItem(tokenName)
          commit('clearSession')
          commit('setIsExpiringSession', false)
          return Promise.resolve(true)
        })
    },

    fetchUserInfo(context) {
      const { commit, getters } = context

      // Fetch user info from endpoint...
      commit('setIsFetchingUserInfo', true)
      const authToken = getters.authToken
      if (debug) console.log(`[${pluginName}] Fetching user info from endpoint...`)

      return AuthAPI.fetchUserInfo(authToken)
        .then((userInfo) => {
          commit('setIsFetchingUserInfo', false)
          return { ...userInfo }
        })
        .catch((error) => {
          if (debug) console.log(`[${pluginName}] Encountered provider error when fetching user info:`, error)
          commit('setIsFetchingUserInfo', false)
          return Promise.reject(error)
        })
    },

    setUserInfo(context, userInfo) {
      context.commit('setUserInfo', userInfo)
    },
  } // END - actions

  // ---------------------------------------------------------------------------
  // Store mutations
  // ---------------------------------------------------------------------------
  store.mutations = {
    setIsAuthenticated(state, value) {
      state.isAuthenticated = value
    },

    setAuthToken(state, token) {
      state.authToken = token
    },

    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },

    clearSession(state) {
      // Clear user info, token, and session state...
      state.isAuthenticated = false
      state.authToken = null
      state.userInfo = null
    },

    setIsAuthenticating(state, value) {
      state.isAuthenticating = value
    },

    setIsValidatingSession(state, value) {
      state.isValidatingSession = value
    },

    setIsFetchingUserInfo(state, value) {
      state.isFetchingUserInfo = value
    },

    setIsExpiringSession(state, value) {
      state.isExpiringSession = value
    },
  }

  // ---------------------------------------------------------------------------
  // Utility functions
  // ---------------------------------------------------------------------------
  function parseTokenInfo(tokenInfo) {
    if (!tokenInfo) return { value: null, expires_at: null }

    const parsed = tokenInfo.split(valueDelimiter)
    if (debug) console.log(`[${pluginName}] Parsed token info from: ${tokenInfo} to:`, parsed)
    const expiresAt = (parsed.length > 1) ? Number(parsed[1]) : null
    return { value: parsed[0], expires_at: expiresAt }
  }

  function normalizeTimestampToMillis(timestamp = 0) {
    if (timestamp > 0 && timestamp.toString().length === 10) return timestamp * 1000 // seconds to millis
    return timestamp
  }

  function isPast(timestamp = 0) {
    if (debug) console.log(`[${pluginName}] Checking timestamp:`, timestamp)
    const normalized = normalizeTimestampToMillis(timestamp)
    return (normalized > 0) ? Date.now() >= normalized : false
  }

  return store
} // END - generateStore()
