import { reactive } from "vue"

export default function (grapes, config = {}) {

  // Configure GrapesJs Selector Manager
  grapes.config.selectorManager = { ...config, custom: true }

  const state = {
    // Change the selected selector in GrapesJs
    select(val) {
      grapes.editor.Selectors.setState(val)
    }
  }

  const classes = []
  // Add a new selector to GrapesJs
  classes.add = function (sel) {
    grapes.editor.Selectors.addSelected(sel)
  }

  // Remove a selector from GrapesJs
  classes.remove = function (sel) {
    grapes.editor.Selectors.removeSelected(sel)
  }

  // Create variable to hold all up to date selector properties.
  const sm = reactive({ state, classes, activeSelector: '' })

  // Update the reactive state based on the active selector in GrapesJs
  function updateSM() {
    // Fetch the latest selector state from GrapesJs
    sm.state.options = grapes.editor.Selectors.getStates().map(state => state.attributes)
    sm.state.selected = grapes.editor.Selectors.getState()

    // Fetch the latest selectors from GrapesJs
    sm.classes.length = 0
    sm.classes.push(...grapes.editor.Selectors.getSelected())

    // Fetch the selected rule from GrapesJs
    const activeStyle = grapes.editor.getSelectedToStyle()
    sm.activeSelector = activeStyle && activeStyle.getSelectorsString()
  }


  // After GrapesJs is loaded.
  grapes.onInit(() => {
    // Fetch the latest selectors from GrapesJs
    updateSM()

    // Track the changes in GrapesJs for selector updates
    grapes.editor.on('selector:custom', updateSM)
  })

  return sm
}
