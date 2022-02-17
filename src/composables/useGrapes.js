import grapesjs from 'grapesjs'
import { onMounted, onBeforeUnmount, reactive, nextTick } from 'vue'

/**
 * Reactive base state and functions to manage Vue GrapesJS Composables.
 * @typedef VGCconfig
 * @property {Object} config Reactive version of the provided GrapesJS configuration object
 * @property {boolean} initialized Whether GrapesJS has been initialized
 * @property {VGCconfig~onBeforeInit} onBeforeInit Register function to be executed
 * right before GrapesJS is initialized
 * @property {VGCconfig~onInit} onInit Register function to be executed
 * right after GrapesJS is initialized
 */

/**
 * Initialize GrapesJS and make it available to the other composables
 * @exports useGrapes
 * @param {Object} config Configuration options as defined by
 * [GrapesJS]{@link https://github.com/artf/grapesjs/blob/master/src/editor/config/config.js}
 * @returns {VGCconfig}
 */
export default function useGrapes(config) {
  const beforeInit = []
  const afterInit = []

  // Prepare object to export.
  const grapes = {
    // Cache to store reactive objects for composables
    _cache: {},

    // Make the configuration reactive to make use of template refs to append to.
    // Some default values provided to be more inline with integrating in to Vue.
    config: reactive({
      panels: { defaults: [] },
      height: '100%',
      ...config,
    }),

    initialized: false,

    /**
     * @method onBeforeInit
     * @memberof VGCconfig
     * @inner
     * @param {Function} fn Function to register. Does not receive any parameters.
     */
    onBeforeInit(fn) { beforeInit.push(fn) },

    /**
     * @method onInit
     * @memberof VGCconfig
     * @inner
     * @param {Callback} fn Function to register. Receives the GrapesJS editor as a parameter.
     */
    onInit(fn) {
      if (this.initialized) fn(editor)
      afterInit.push(fn)
    },
  }

  let editor
  // Initialize GrapesJs after Vue component has been mounted.
  onMounted(async () => {
    // Wait for all child components to mount
    await nextTick()

    for (const fn of beforeInit) { fn() }
    editor = grapesjs.init(grapes.config)
    grapes.initialized = true
    for (const fn of afterInit) { fn(editor) }
  })

  // Tidy up
  onBeforeUnmount(() => editor.destroy())

  return grapes
}
