import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import alias from 'rollup-plugin-alias'
import vue from 'rollup-plugin-vue'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/plugin.js',
    format: 'cjs',
  },
  plugins: [
    alias({
      vue$: 'vue/dist/vue.common.js',
      '@': path.resolve('./src/'),
      resolve: ['.js', '.vue'],
    }),
    vue(),
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    uglify(),
  ],
}
