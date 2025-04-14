/* eslint-disable array-bracket-newline */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const development = process.env.NODE_ENV !== 'production';
export default {
  server: {
    port: process.env.APPLICATION_SERVER_PORT,
    host: 'localhost',
    timing: process.env.APPLICATION_SERVER_TIMING,
  },
  messages: {
    loading: 'Loading...',
    error_404: 'This page could not be found',
    server_error: 'Server error',
    nuxtjs: 'Nuxt.js',
    back_to_home: 'Back to the home page',
    server_error_details:
      'An error occurred in the application and your page could not be served. If you are the application owner, check your logs for details.',
    client_error: 'Error',
    client_error_details:
      'An error occurred while rendering the page. Check developer tools console for details.',
  },
  env: {

  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.APPLICATION_TITLE || '',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        'http-equiv': 'cache-control',
        content: 'no-cache',
      },
      {
        'http-equiv': 'expires',
        content: '0',
      },
      {
        'http-equiv': 'pragma',
        content: 'no-cache',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/dashboard/epa_logo.png',
      },
    ],
    script: [
      {
        hid: 'ga',
        src: '/dashboard/ga.js',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/LoadingBar.vue',
  /*
   ** Global CSS
   */
  css: [
    '~node_modules/ag-grid-community/styles/ag-grid.css',
    '~node_modules/ag-grid-community/styles/ag-theme-balham.css',
    '~assets/styles/global-styles/agGrid.scss',
    // '~node_modules/bootstrap-css-only/css/bootstrap.min.css',
    '~assets/styles/global-styles.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/repository',
    {
      src: '~/plugins/ag-grid.js',
      ssr: false,
    },
    '@/plugins/vue-carousel-card',
    '~/plugins/utils.js',
    '~/plugins/axios.js',
    '~/plugins/errorMsgs.js',
    '~/plugins/helpPlugin.js',
    '~/plugins/copyText.js',
    '~/plugins/renderers.js',
    '~/plugins/downloader.js',
    '~/plugins/excelExport.js',
    {
      src: '~/plugins/stickyfill.js',
      ssr: false,
    },
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/font-awesome',
    '@nuxtjs/dotenv',
    'mdbvue/nuxt',
    'nuxt-vue-select',
    'bootstrap-vue/nuxt',
    '@nuxtjs/sentry',
  ],
  sentry: {
    dsn: process.env.SENTRY_DSN, // Enter your project's DSN.
    injectMock: true,
    injectLoadHook: true,
    tracing: {
      tracesSampleRate: 1.0,
      vueOptions: {
        tracing: true,
        tracingOptions: {
          hooks: ['mount', 'update'],
          timeout: 2000,
          trackComponents: true,
        },
      },
      browserOptions: {},
    },
    replay: {
      replay: true,
    },
    config: {
      // Setting to null is hack so environment will be ignored by Sentry.
      // Instead it will use the 'environment' tag set by 'plugins/sentry.js'
      environment: process.env.SENTRY_ENV,
    },
    clientIntegrations: {
      Replay: {},
    },
    clientConfig: {
      // This sets the sample rate to be 10%. You may want this to be 100% while
      // in development and sample at a lower rate in production
      replaysSessionSampleRate: 1.0,
      // If the entire session is not sampled, use the below sample rate to sample
      // sessions when an error occurs.
      replaysOnErrorSampleRate: 1.0,
      tracesSampleRate: 1.0,
    },
  },
  bootstrapVue: {
    icons: true,
    css: false,
    bvCSS: false,
  },
  axios: {
    progress: true,
    debug: false,
    retry: {retries: 2},
    // See https://github.com/nuxt-community/axios-module#options
  },
  serverMiddleware: ['~/middleware/headers'],
  router: {
    base: process.env.APPLICATION_ROUTER_BASE,
  },
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', {disableVuex: false}],
  ],
  typescript: {
    configFile: '~~/tsconfig.json',
    extensions: {
      vue: true,
    },
    typeCheck: false,
  },
  /*
   ** Build configuration
   */
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', {loose: true}],
      ],
    },
    extractCSS: true,
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        name: 'true',
        cacheGroups: {},
      },
    },
    transpile: ['vuex', 'ag-grid-vue', 'd3'],
    extend(config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common';
    },
  },
};
