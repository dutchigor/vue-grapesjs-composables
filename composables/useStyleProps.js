import { reactive } from "vue"

export default function (grapes, sector) {
  // Ensure GrapesJs is not yet initialised
  if (grapes.initialized) throw new Error('useStyleProps must be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

  if (!grapes._cache.styleManager) grapes._cache.styleManager = {}

  // Take block manager from cache if it already exists
  if (!grapes._cache.styleManager[sector]) {

    // Create placeholder element to contain the Style Manager.
    // This is only needed because the style events in GrapesJs require the style manager to be appended somewhere.
    // Note that the element is not attached to the DOM.
    const SMplaceholder = document.createElement('div')

    // Use custom selector manager
    if (!grapes.config.styleManager) grapes.config.styleManager = {}
    grapes.config.styleManager.appendTo = SMplaceholder

    // Create variable to hold all up to date style properties.
    const styles = grapes._cache.styleManager[sector] = reactive({})

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Function to update all style properties to the currently active CSS rule.
      function updateStyles() {
        for (const style in styles) {
          styles[style]._updateStyle()
        }
      }


      // Populate styvles with all relevant style properties.
      const models = editor.StyleManager.getProperties(sector).models
      for (const mdl of models) {
        styles[mdl.id] = new StyleProp(mdl)
        styles[mdl.id]._updateStyle()
      }

      // Track selection of or updates to CSS rules.
      editor.on('selector:custom', updateStyles)
    })
  }

  return grapes._cache.styleManager[sector]
}

// Manage style property lifecycle using the style model from GrapesJs.
class StyleProp {
  constructor(model) {
    this.model = model
  }
  // Make attributes and changed values reactive.
  _updateStyle() {
    this.attributes = { ...this.model.attributes }
  }
  // Update the style property in GrapesJs.
  setValue(val) {
    this.model.setValue(val)
    this._updateStyle()
  }
}
