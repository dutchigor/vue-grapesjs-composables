// Custom array type to store a list of GrapesJs selectors
export class SelectorArray extends Array {
  constructor(selectors, ...items) {
    super(...items)
    this.selectors = selectors;
  }

  // Fetch the latest selectors from GrapesJs
  update() {
    this.length = 0
    this.push(...this.selectors.getSelected())
  }

  // Add a new selector to GrapesJs
  add(sel) {
    this.selectors.addSelected(sel)
  }

  // Remove a seletor from GrapesJs
  remove(sel) {
    this.selectors.removeSelected(sel)
  }
}

// Class to store css state selectors
export class CssState {
  constructor(selectors) {
    this.selectors = selectors
  }

  // Fetch the latest selectors from GrapesJs
  update() {
    this.options = this.selectors.getStates().map(state => state.attributes)
    this.selected = this.selectors.getState()
  }

  // Change the selected selector in GrapesJs
  select(val) {
    this.selectors.setState(val)
  }
}

// Custom array type to store a list of CSS rules
export class CssRules extends Array {
  constructor(cssMgr, ...items) {
    super(...items)
    this.cssMgr = cssMgr;
  }

  // Fetch the latest rules from GrapesJs
  update() {
    this.length = 0
    this.push(...this.cssMgr.getRules())
  }

  // Add new rule to GrapesJs
  add(rule) {
    if (typeof rule === 'object') {
      this.cssMgr.setRule(rule.selectors, rule.style, rule.opts)
    } else {
      this.cssMgr.addRules(rule)
    }
  }

  // Remove rule from GrapesJs
  remove(rule) {
    this.cssMgr.remove(rule)
  }

  // Remove all rules from GrapesJs
  clear() {
    this.cssMgr.clear()
  }
}
