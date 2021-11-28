import { reactive } from "vue"
import { CssRules, CssState, SelectorArray } from './SelectorClasses'

export default function (grapes, config = {}) {

  // Configure GrapesJs Selector Manager
  grapes.config.selectorManager = { ...config, custom: true }

  // Create variable to hold all up to date selector properties.
  const sm = reactive({
    state: {},
    classes: [],
    cssRules: [],
    selectedRule: '',
  })

  // Update the reactive state based on the tree in GrapesJs
  const updateSM = () => {
    sm.state.update()
    sm.classes.update()
    sm.cssRules.update()

    const rule = grapes.editor.getSelectedToStyle()
    sm.selectedRule = rule ? rule.selectorsToString() : ''
  }

  // After GrapesJs is loaded.
  grapes.onInit(() => {
    // Set initial state
    sm.state = new CssState(grapes.editor.Selectors)
    sm.classes = new SelectorArray(grapes.editor.Selectors)
    sm.cssRules = new CssRules(grapes.editor.Css)

    updateSM()

    // Track the changes in GrapesJs for selector updates
    grapes.editor.on('selector:custom', updateSM)
  })

  return sm
}
