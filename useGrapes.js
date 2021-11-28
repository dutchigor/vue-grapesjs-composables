import gjs from 'grapesjs'
import { onMounted, onBeforeUnmount, reactive, nextTick } from 'vue'

export default function (config) {
  // Prepare object to export.
  const grapes = {
    // GrapesJs initialization Configuration.
    // This is made reactive to make use of template refs to append to.
    // Some default values provided to be more inline with integrating in to Vue.
    config: reactive({
      panels: { defaults: [] },
      height: '100%',
      ...config,
    }),
    // Will contain the editor after initialization.
    editor: {},
    _afterInit: [],
    _beforeInit: [],
    // Lifecycle function to be executed after DOM is loaded but before GrapesJs is initialized.
    onBeforeInit(fn) {
      this._beforeInit.push(fn)
    },
    // Lifecycle function to be executed right after GRapesJs is loaded.
    onInit(fn) {
      this._afterInit.push(fn)
    },
  }

  // Initialize GrapesJs after Vue component has been mounted.
  onMounted(async () => {
    // Wait for all child components to mount
    await nextTick()

    for (const fn of grapes._beforeInit) { fn() }
    grapes.editor = gjs.init(grapes.config)
    for (const fn of grapes._afterInit) { fn() }
  })

  // Tidy up
  onBeforeUnmount(() => grapes.editor.destroy())

  return grapes
}
