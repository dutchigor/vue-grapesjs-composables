import { reactive } from "vue"
import { getAttributes, getClasses, getChildren, cmpEvents } from '../utils/componentHelpers'
import reactiveModel from '../utils/reactiveModel'

/**
 * Object to manage the component tree.
 * @typedef Selected
 * @memberof module:useSelectedComponent
 * @inner
 * @property {Object} component A reactive representation of the
 * [selected component]{@link https://grapesjs.com/docs/api/component.html#component},
 * Where the child components, attributes and classes have also been made reactive.
 */

/**
 * Get object to manage the selected component.
 * @exports useSelectedComponent
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {module:useSelectedComponent~Selected}
 */
export default function useSelectedComponent(grapes) {
  // Take selected component from cache if it already exists
  if (!grapes._cache.selectedComp) {

    // Create variable to hold information on currently selected component
    const selected = grapes._cache.selectedComp = reactive({
      component: {}
    })

    // When GrapesJS is set up
    grapes.onInit((editor) => {
      // Update the reference to the selected component and its values
      function updateComp(comp) {
        selected.component = reactiveModel(comp, {
          overwrites: {
            components: getChildren,
            attributes: getAttributes,
            classes: getClasses,
          },
          events: cmpEvents,
        })
      }

      // Perform the above update whenever a component is selected
      editor.on('component:selected', updateComp)
    })
  }


  return grapes._cache.selectedComp
}
