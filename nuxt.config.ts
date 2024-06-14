export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'projects-id',
        path: '/projects/:id',
        component: resolve(__dirname, 'pages/projects/[id].vue')
      })
    }
  }
})
