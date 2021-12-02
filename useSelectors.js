import { reactive } from "vue"

export default function (grapes) {
  // Ensure GrapesJs is not yet initialised
  if (grapes.initialized) throw new Error('useSelectors must be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

  // Take block manager from cache if it already exists
  if (!grapes._cache.selectorManager) {

    // Use custom selector manager
    if (!grapes.config.selectorManager) grapes.config.selectorManager = {}
    grapes.config.selectorManager.custom = true

    const state = {
      options: [],
      selected: '',
    }

    const classes = []

    // Create variable to hold all up to date selector properties.
    const sm = grapes._cache.selectorManager = reactive({ state, classes, activeSelector: '' })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Change the selected selector in GrapesJs
      sm.state.select = function (val) {
        editor.Selectors.setState(val)
      }

      // Add a new selector to GrapesJs
      sm.classes.add = function (sel) {
        editor.Selectors.addSelected(sel)
      }

      // Remove a selector from GrapesJs
      sm.classes.remove = function (sel) {
        editor.Selectors.removeSelected(sel)
      }

      // Update the reactive state based on the active selector in GrapesJs
      function updateSM() {
        // Fetch the latest selector state from GrapesJs
        sm.state.options = editor.Selectors.getStates().map(state => state.attributes)
        sm.state.selected = editor.Selectors.getState()

        // Fetch the latest selectors from GrapesJs
        sm.classes.length = 0
        sm.classes.push(...editor.Selectors.getSelected())

        // Fetch the selected rule from GrapesJs
        const activeStyle = editor.getSelectedToStyle()
        sm.activeSelector = activeStyle && activeStyle.getSelectorsString()
      }

      // Fetch the latest selectors from GrapesJs
      updateSM()

      // Track the changes in GrapesJs for selector updates
      editor.on('selector:custom', updateSM)
    })
  }

  return grapes._cache.selectorManager
}
