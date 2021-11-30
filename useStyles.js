import { reactive } from "vue"

export default function (grapes) {
  const cssRules = []
  // Add new rule to GrapesJs
  cssRules.add = function (rule) {
    if (typeof rule === 'object') {
      grapes.editor.Css.setRule(rule.selectors, rule.style, rule.opts)
    } else {
      grapes.editor.Css.addRules(rule)
    }
  }

  // Remove rule from GrapesJs
  cssRules.remove = function (rule) {
    grapes.editor.Css.remove(rule)
  }

  // Remove all rules from GrapesJs
  cssRules.clear = function () {
    this.cssMgr.clear()
  }

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
  const sm = reactive({ cssRules, selected })

  // Update the reactive state based on the active selector in GrapesJs
  const updateSM = () => {
    // Fetch the latest rules from GrapesJs
    sm.cssRules.length = 0
    sm.cssRules.push(...grapes.editor.Css.getRules())

    // Fetch the selected rule from GrapesJs
    sm.selected.rule = grapes.editor.getSelectedToStyle()
    sm.selected.styles = sm.selected.rule ? sm.selected.rule.getStyle() : {}
    sm.selected.selector = sm.selected.rule ? sm.selected.rule.getSelectorsString() : ''
  }


  // After GrapesJs is loaded.
  grapes.onInit(() => {
    // Fetch the latest selectors from GrapesJs
    updateSM()

    // Track the changes in GrapesJs for selector updates
    grapes.editor.on('selector:custom', updateSM)
  })

  return sm
}
