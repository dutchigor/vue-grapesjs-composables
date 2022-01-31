import { reactive } from 'vue'
import reactiveModel from '../utils/reactiveModel'
import reactiveCollection from '../utils/reactiveCollection'

// Backbone collection events that trigger component updates
const events = [
  'change:attributes',
  'change:tagName',
  'change:styles',
  'change:traits',
  'change:name'
]

// get reactive list of child components from a component
function getCompTree(compRef) {
  const options = {
    modelOpts: {
      overwrites: { components: getCompTree },
      events,
      onDecouple: cmp => cmp.components._decouple()
    },
    alter: {
      method: 'filter',
      callback: cmp => cmp.get('type') !== 'textnode'
    }
  }

  return reactiveCollection(compRef.value.get('components'), options)
}

// Get manager object containing:
// - The wrapper component with reactive child components
// - Functions to manage the selection of 

/**
 * Object to manage the component tree.
 * @typedef ComponentTree
 * @property {Object} wrapper A reactive representation of the component tree, with 
 * [GrapesJS components]{@link https://grapesjs.com/docs/api/component.html#component}
 * @property {Function} select [Select a component]{@link https://grapesjs.com/docs/api/editor.html#select}
 * @property {Function} selectAdd [Add component to selection]{@link https://grapesjs.com/docs/api/editor.html#selectadd}
 * @property {Function} selectRemove [Remove component from selection]{@link https://grapesjs.com/docs/api/editor.html#selectremove}
 * @property {Function} selectToggle [Toggle component selection]{@link https://grapesjs.com/docs/api/editor.html#selecttoggle}
 */

/**
 * Get object to manage the component tree.
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {ComponentTree}
 */
export default function useComponentTree(grapes) {
  // Take component tree from cache if it already exists
  if (!grapes._cache.compTree) {

    const components = grapes._cache.compTree = reactive({
      wrapper: {},
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
      components.wrapper = reactiveModel(editor.getWrapper(), {
        overwrites: { components: getCompTree }, events,
      })
    })
  }

  return grapes._cache.compTree
}
