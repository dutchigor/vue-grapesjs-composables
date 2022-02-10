import { reactive } from "vue"
import reactiveCollection from "../utils/reactiveCollection"

/**
 * Object to manage the component types.
 * @typedef TypeManager
 * @memberof module:useComponentTypes
 * @inner
 * @property {Object[]} types A reactive list of all
 * [component types]{@link https://grapesjs.com/docs/modules/Blocks.html#block-content-types}
 * @property {Function} addType [Add new component type]{@link https://grapesjs.com/docs/api/components.html#addtype}
 * @property {Function} removeType [Remove component type]{@link https://grapesjs.com/docs/api/components.html#removetype}
 */

/**
 * Get object to manage the component types.
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {module:useComponentTypes~TypeManager}
 */
export default function useComponentTypes(grapes) {
  // Take component types from cache if it already exists
  if (!grapes._cache.compTypes) {
    const typeMgr = grapes._cache.compTypes = reactive({
      types: [],
      addType: () => { },
      removeType: () => { },
    })

    // After GrapesJs is loaded
    grapes.onInit((editor) => {
      // Connect Type Manager to GrapesJS
      typeMgr.types = reactiveCollection(editor.Components.getTypes())
      typeMgr.addType = editor.Components.addType.bind(editor.Components)
      typeMgr.removeType = editor.Components.removeType.bind(editor.Components)
    })
  }

  return grapes._cache.compTypes
}
