import { reactive } from "vue"
import reactiveCollection from "../utils/reactiveCollection"
import reactiveModel from "../utils/reactiveModel"

/**
 * The CSS Manager contains all the functions that GrapesJS provides in the
 * [CSS Composer]{@link https://grapesjs.com/docs/api/css_composer.html},
 * along with reactive representations of the CSS Rules.
 * @typedef {Object} CssManager
 * @property {Object[]} cssRules A reactive list of all the
 * [CSS rules]{@link https://grapesjs.com/docs/api/css_rule.html#cssrule} as defined in GrapesJS.
 * @property {Object} selected.rule A reactive representation of the selected
 * [CSS rule]{@link https://grapesjs.com/docs/api/css_rule.html#cssrule}.
 * @property {String} selected.selector The css selector that identifies the selected rule.
 */

/**
 * Fetch and, if necessary, initiate the CSS manager.
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {CssManager}
 */
export default function useStyles(grapes) {
  // Take block manager from cache if it already exists
  if (!grapes._cache.styles) {
    // Use custom selector manager
    if (!grapes.config.selectorManager) grapes.config.selectorManager = {}
    grapes.config.selectorManager.custom = true

    // Create manager to hold all up to date selector properties.
    const cm = grapes._cache.styles = reactive({
      cssRules: [],
      selected: {
        rule: {},
        selector: '',
      },
    })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Map GrapesJS CSS Composer functions to manager
      Object.keys(editor.Css).forEach(attr => {
        if (typeof editor.Css[attr] === "function" && attr !== "constructor") {
          cm[attr] = editor.Css[attr].bind(editor.Css)
        }
      })

      // Load CSS rules with all rules in GrapesJS
      cm.cssRules = reactiveCollection(editor.Css.getRules())

      // Manage Rule styles using dedicated GrapesJS functions
      function proxyStyle(modelRef) {
        return new Proxy(modelRef, {
          // Get a style from Rule model
          get: (model, style) => model.value.getStyle(style),
          // Add new style to styles object and set new styles on Rule
          set: (model, style, val) => {
            const styles = model.value.getStyle()
            model.value.setStyle({ ...styles, [style]: val })
            return styles
          }
        })
      }

      // Update selected style in manager
      function updateSelected() {
        const selected = editor.getSelectedToStyle()
        if (selected !== cm.selected.rule._model) {
          if (cm.selected.rule._decouple) cm.selected.rule._decouple()
          if (selected) {
            cm.selected.rule = reactiveModel(selected, { overwrites: { style: proxyStyle } })
            cm.selected.selector = selected.selectorsToString()
          } else {
            cm.selected.rule = {}
            cm.selected.selector = ''
          }

        }
      }

      // Make sure selected style is updated on 1st load and relevant changes in GrapesJS
      updateSelected()

      editor.on('selector:custom', updateSelected)
    })
  }

  return grapes._cache.styles
}
