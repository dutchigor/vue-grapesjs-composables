import { reactive } from "vue"
import reactiveCollection from "../utils/reactiveCollection"

/**
 * Object to manage the style properties of the selected component.
 * @typedef PropManager
 * @memberof module:useStyleProps
 * @inner
 * @property {Object[]} sectors A reactive representation of all
 * [GrapesJS sectors]{@link https://grapesjs.com/docs/api/sector.html#sector}
 * @property {Function} getBuiltIn [Return built-in property definition]{@link https://grapesjs.com/docs/api/style_manager.html#getbuiltin}
 * @property {Function} getBuiltInAll [Get all the available built-in property definitions]{@link https://grapesjs.com/docs/api/style_manager.html#getbuiltinall}
 * @property {Function} addType [Add new property type]{@link https://grapesjs.com/docs/api/style_manager.html#addtype}
 * @property {Function} getType [Get type]{@link https://grapesjs.com/docs/api/style_manager.html#gettype}
 * @property {Function} getTypes [Get all types]{@link https://grapesjs.com/docs/api/style_manager.html#gettypes}
 */

/**
 * Get object to manage the style properties of the selected component.
 * @exports useStyleProps
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {module:useStyleProps~PropManager}
 */
export default function useStyleProps(grapes) {
  // Ensure GrapesJs is not yet initialised
  if (grapes.initialized) throw new Error('useStyleProps must be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

  // Take style manager from cache if it already exists
  if (!grapes._cache.styleManager) {

    // Use custom style manager
    if (!grapes.config.styleManager) grapes.config.styleManager = {}
    grapes.config.styleManager.custom = true

    // Create variable to hold all style properties for the selected component
    const styles = grapes._cache.styleManager = reactive({
      sectors: [],
      getBuiltIn: () => { },
      getBuiltInAll: () => { },
      addType: () => { },
      getType: () => { },
      getTypes: () => { },
    })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Create reactive representation of each sector and its properties 
      styles.sectors = reactiveCollection(editor.StyleManager.getSectors(), {
        modelOpts: {
          overwrites: {
            properties: cmp => reactiveCollection(cmp.value.get('properties'))
          }
        }
      })

      // Bind property type management functions to the style manager
      styles.getBuiltIn = editor.StyleManager.getBuiltIn.bind(editor.StyleManager)
      styles.getBuiltInAll = editor.StyleManager.getBuiltInAll.bind(editor.StyleManager)
      styles.addType = editor.StyleManager.addType.bind(editor.StyleManager)
      styles.getType = editor.StyleManager.getType.bind(editor.StyleManager)
      styles.getTypes = editor.StyleManager.getTypes.bind(editor.StyleManager)
    })
  }

  return grapes._cache.styleManager
}
