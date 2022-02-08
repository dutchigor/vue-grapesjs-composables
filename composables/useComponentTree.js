import { reactive } from 'vue'
import { getChildren, cmpEvents } from '../utils/componentHelpers'
import reactiveModel from '../utils/reactiveModel'

/**
 * Object to manage the component tree.
 * @typedef ComponentTree
 * @memberof module:useComponentTree
 * @inner
 * @property {Object} tree A reactive representation of the component tree, with 
 * [GrapesJS components]{@link https://grapesjs.com/docs/api/component.html#component}
 * @property {Function} select [Select a component]{@link https://grapesjs.com/docs/api/editor.html#select}
 * @property {Function} selectAdd [Add component to selection]{@link https://grapesjs.com/docs/api/editor.html#selectadd}
 * @property {Function} selectRemove [Remove component from selection]{@link https://grapesjs.com/docs/api/editor.html#selectremove}
 * @property {Function} selectToggle [Toggle component selection]{@link https://grapesjs.com/docs/api/editor.html#selecttoggle}
 */

/**
 * Get object to manage the component tree.
 * @exports useComponentTree
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {module:useComponentTree~ComponentTree}
 */
export default function useComponentTree(grapes) {
  // Take component tree from cache if it already exists
  if (!grapes._cache.compTree) {

    const components = grapes._cache.compTree = reactive({
      tree: {},
      select() { },
      selectAdd() { },
      selectRemove() { },
      selectToggle() { }
    })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Set selection functions
      components.select = editor.select
      components.selectAdd = editor.selectAdd
      components.selectRemove = editor.selectRemove
      components.selectToggle = editor.selectToggle

      // Set top level component
      components.tree = reactiveModel(editor.getWrapper(), {
        overwrites: {
          components: getChildren,
        },
        events: cmpEvents,
      })
    })
  }

  return grapes._cache.compTree
}
