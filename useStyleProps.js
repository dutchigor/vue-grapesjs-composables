import { reactive } from "vue"

export default function (grapes, options) {
  // Create placeholder element to contain the Style Manager.
  // This is only needed because the style events in GrapesJs require the style manager to be appended somewhere.
  // Note that the element is not attached to the DOM.
  const SMplaceholder = document.createElement('div')

  // Configure GrapesJs Style Manager.
  grapes.config.styleManager = {
    appendTo: SMplaceholder,
    sectors: [{
      ...options,
      id: 'toVue',
    }]
  }

  // Create variable to hold all up to date style properties.
  const styles = reactive({})

  // Function to update all style properties to the currently active CSS rule.
  function updateStyles() {
    for (const style in styles) {
      styles[style].updateStyle()
    }
  }

  // After GrapesJs is loaded.
  grapes.onInit(() => {
    // Populate styles with all relevant style properties.
    const models = grapes.editor.StyleManager.getProperties('toVue').models
    for (const mdl of models) {
      styles[mdl.id] = new StyleProp(mdl)
      styles[mdl.id].updateStyle()
    }

    // Track selection of or updates to CSS rules.
    grapes.editor.on('selector:custom', updateStyles)
  })

  return styles
}

// Manage style property lifecycle using the style model from GrapesJs.
class StyleProp {
  constructor(model) {
    this.model = model
  }
  // Make attributes and changed values reactive.
  updateStyle() {
    this.attributes = { ...this.model.attributes }
    this.changed = { ...this.model.changed }
  }
  // Update the style property in GrapesJs.
  setValue(val) {
    this.model.setValue(val)
    this.updateStyle()
  }
}
