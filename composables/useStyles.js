import { reactive } from "vue"
import reactiveCollection from "../utils/reactiveCollection"
import reactiveModel from "../utils/reactiveModel"

export default function useStyles(grapes) {
  // Take block manager from cache if it already exists
  if (!grapes._cache.styles) {
    // Create manager to hold all up to date selector properties.
    const sm = grapes._cache.styles = reactive({
      cssRules: [],
      selected: { style: new Proxy({}, { get: () => null }) }
    })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Map GrapesJS CSS Composer functions to manager
      Object.keys(editor.Css).forEach(attr => {
        if (typeof editor.Css[attr] === "function" && attr !== "constructor") {
          sm[attr] = editor.Css[attr].bind(editor.Css)
        }
      })

      // Load CSS rules with all rules in GrapesJS
      sm.cssRules = reactiveCollection(editor.Css.getRules())

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
        if (selected !== sm.selected._modelRef) {
          if (sm.selected._destroy) sm.selected._destroy()
          sm.selected = reactiveModel(selected, { style: proxyStyle })
        }
      }

      // Make sure selected style is updated on 1st load and relevant changes in GrapesJS
      updateSelected()

      editor.on('component:selected', updateSelected)
      editor.on('selector:add', updateSelected)
      editor.on('selector:remove', updateSelected)
      editor.on('device:select', updateSelected)
    })
  }

  return grapes._cache.styles
}
