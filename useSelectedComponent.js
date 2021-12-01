import { reactive } from "vue"

export default function (grapes) {
  // Create variable to hold information on currently selected component.
  const selected = reactive({
    component: {},
    style: {},
    attributes: {},
    setAttributes(attr) { this.component.setAttributes(attr) },
  })

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

  // Track the selected component
  grapes.onInit(() => {
    grapes.editor.on('component:selected', updateComp)
    grapes.editor.on('component:update:attributes', updateAttr)
  })

  return selected
}
