import gjs from 'grapesjs'
import { onMounted, onBeforeUnmount, reactive, nextTick } from 'vue'

export default function (config) {
  const beforeInit = []
  const afterInit = []

  // Prepare object to export.
  const grapes = {
    // Cache to store reactive objects for composables
    _cache: {},
    // GrapesJs initialization Configuration.
    // This is made reactive to make use of template refs to append to.
    // Some default values provided to be more inline with integrating in to Vue.
    config: reactive({
      panels: { defaults: [] },
      height: '100%',
      ...config,
    }),
    // Will contain the editor after initialization.
    initialized: false,
    // Lifecycle function to be executed after DOM is loaded but before GrapesJs is initialized.
    onBeforeInit(fn) { beforeInit.push(fn) },
    // Lifecycle function to be executed right after GrapesJs is loaded.
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
    editor = gjs.init(grapes.config)
    grapes.initialized = true
    for (const fn of afterInit) { fn(editor) }
  })

  // Tidy up
  onBeforeUnmount(() => editor.destroy())

  return grapes
}
