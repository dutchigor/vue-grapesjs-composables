import { reactive } from "vue"

export default function (grapes) {
  // Take block manager from cache if it already exists
  if (!grapes._cache.styles) {

    const cssRules = []

    const selected = {
      rule: {},
      styles: {},
      selector: '',
      updateStyle(style, value) {
        this.styles[style] = value
        this.rule.setStyle(this.styles)
      }
    }

    // Create variable to hold all up to date selector properties.
    const sm = grapes._cache.styles = reactive({ cssRules, selected })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Add new rule to GrapesJs
      cssRules.add = function (rule) {
        if (typeof rule === 'object') {
          editor.Css.setRule(rule.selectors, rule.style, rule.opts)
        } else {
          editor.Css.addRules(rule)
        }
      }

      // Remove rule from GrapesJs
      cssRules.remove = function (rule) {
        editor.Css.remove(rule)
      }

      // Remove all rules from GrapesJs
      cssRules.clear = function () {
        editor.Css.clear()
      }

      // Update the reactive state based on the active selector in GrapesJs
      function updateSM() {
        // Fetch the latest rules from GrapesJs
        sm.cssRules.length = 0
        sm.cssRules.push(...editor.Css.getRules())

        // Fetch the selected rule from GrapesJs
        sm.selected.rule = editor.getSelectedToStyle()
        sm.selected.styles = sm.selected.rule ? sm.selected.rule.getStyle() : {}
        sm.selected.selector = sm.selected.rule ? sm.selected.rule.getSelectorsString() : ''
      }

      // Fetch the latest selectors from GrapesJs
      updateSM()

      // Track the changes in GrapesJs for selector updates
      editor.on('selector:custom', updateSM)
    })
  }

  return grapes._cache.styles
}
