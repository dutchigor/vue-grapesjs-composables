import { reactive } from "vue"

export default function (grapes) {
  // Take selected component from cache if it already exists
  if (!grapes._cache.selectedComp) {

    // Create variable to hold information on currently selected component.
    const selected = grapes._cache.selectedComp = reactive({
      component: {},
      style: {},
      attributes: {},
      setAttributes(attr) { this.component.setAttributes(attr) },
    })

    // Track the selected component
    grapes.onInit((editor) => {
      // Update the reactive set of attribute
      function updateAttr(comp) {
        selected.attributes = comp.getAttributes()
      }

      // Update the reference to the selected component and its values.
      function updateComp(comp) {
        selected.component = comp
        selected.style = comp.getStyle()
        updateAttr(comp)
      }

      editor.on('component:selected', updateComp)
      editor.on('component:update:attributes', updateAttr)
    })
  }

  return grapes._cache.selectedComp
}
