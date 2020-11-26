export default ({ router, store, Vue }) => {
  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

    const authenticated = store.getters["auth/authenticated"]
    const user = store.getters["auth/user"]

    if (requiresAdmin && user.role !== 'admin') {
      router.push({path: '/'})
    }

    if (requiresAuth && !authenticated) {
      next('/login-register')
    } else if (to.path === '/login-register' && authenticated) {
      next('/')
    } else {
      next()
    }
  })
}




