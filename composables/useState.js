import { reactive } from "vue"
import reactiveCollection from "../utils/reactiveCollection"

/**
 * The State Manager provides a reactive representation of the states available in GrapesJS.
 * @typedef StateManager
 * @memberof module:useState
 * @inner
 * @property {Object[]} all A reactive list of
 * [all States]{@link https://grapesjs.com/docs/api/state.html#state} as defined in GrapesJS.
 * @property {String} selected The active state on the current selector.
 * @property {Function} select [Change the state]{@link https://grapesjs.com/docs/api/selector_manager.html#setstate}
 * of the current selector.
 */

/**
 * Fetch and, if necessary, initiate the State Manager.
 * @exports useState
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {module:useState~StateManager}
 */
export default function useState(grapes) {
  // Ensure GrapesJs is not yet initialised
  if (grapes.initialized) throw new Error('useSelectors must be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

  // Take block manager from cache if it already exists
  if (!grapes._cache.stateManager) {
    // Create variable to hold all up to date states.
    const state = grapes._cache.stateManager = reactive({
      all: [],
      selected: '',
      select: () => { },
    })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Change the selected state in GrapesJs
      state.select = function (val) {
        editor.Selectors.setState(val)
      }

      // Update the reactive state based on the active selector in GrapesJs
      state.all = reactiveCollection(editor.Selectors.getStates())

      // Fetch the latest state from GrapesJs
      function updateState() {
        state.selected = editor.Selectors.getState()
      }

      updateState()

      // Track the changes in GrapesJs for state updates
      editor.on('selector:state', updateState)
    })
  }

  return grapes._cache.stateManager
}
