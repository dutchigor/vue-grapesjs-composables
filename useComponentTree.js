import { reactive } from 'vue'

export default function (grapes) {
  // Create a simplified component tree that is easier to model.
  const flattenComponents = (comps) => {
    return comps.reduce((compList, comp) => {
      // We're only interested in the component's props
      const props = comp.props()
      // Text nodes should not be managed independently of their parents
      if (props.type !== 'textnode') {
        const flatProps = { ...props }
        // Recursively flatten all child components
        flatProps.components = flattenComponents(comp.components().models)
        flatProps.component = comp
        compList.push(flatProps)
      }
      return compList
    }, [])
  }

  const tree = reactive([])

  // Update the reactive tree based on the tree in GrapesJs
  const updateTree = () => {
    tree.length = 0
    const flatComps = flattenComponents(grapes.editor.getComponents().models)
    tree.push(...flatComps)
  }

  // After GrapesJs is loaded.
  grapes.onInit(() => {
    updateTree()

    // Track the changes in GrapesJs for component tree updates
    grapes.editor.on('component:mount', updateTree)
    grapes.editor.on('component:remove', updateTree)
    grapes.editor.on('component:selected', updateTree)
  })

  return tree
}