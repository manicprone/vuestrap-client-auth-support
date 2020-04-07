import path from 'path'
import alias from 'rollup-plugin-alias'
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import nodeGlobals from 'rollup-plugin-node-globals'
import uglify from 'rollup-plugin-uglify'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace'
import devConfig from './config'

const devServePort = devConfig.simulator.port
const devHotReload = devConfig.simulator.hotReload
const autoOpenBrowser = devConfig.simulator.autoOpenBrowser

const plugins = [
  alias({
    vue$: 'vue/dist/vue.common.js',
    '@': path.resolve('./src/'),
    resolve: ['.js', '.vue'],
  }),
  vue({
    // css: 'test/simulator/serve/assets/css/app.css',
  }),
  buble({
    objectAssign: 'Object.assign',
  }),
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true,
  }),
  commonjs(),
  nodeGlobals(),
]

const config = {
  input: 'test/simulator/app.js',
  output: {
    file: 'test/simulator/serve/assets/js/app.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins,
}

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

/* eslint-disable comma-dangle */
if (isProduction) {
  config.output.sourcemap = false
  config.plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    })
  )
  config.plugins.push(uglify())
}

if (isDevelopment) {
  if (devHotReload) config.plugins.push(livereload())
  config.plugins.push(
    serve({
      contentBase: 'test/simulator/serve/',
      port: devServePort,
      open: autoOpenBrowser,
    })
  )
}
/* eslint-enable comma-dangle */

export default config
