import { reactive } from "vue"

// Crate variable to hold information on currently selected component.
export default function (grapes) {
  const selected = reactive({
    component: {},
    style: {},
    attributes: {},
    setAttributes(attr) { this.component.setAttributes(attr) },
  })

  // Update the reactive set of attribute
  const updateAttr = (comp) => selected.attributes = comp.getAttributes()

  // Update the reference to the selected component and its values.
  const updateComp = (comp) => {
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
