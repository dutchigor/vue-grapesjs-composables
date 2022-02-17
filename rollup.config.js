import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/vue-grapesjs-composables.js',
      format: 'es',
      exports: "named",
      plugins: [terser()],
      sourcemap: true
    }
  ],
  plugins: [resolve(), commonjs()],
  external: ['vue']
}
