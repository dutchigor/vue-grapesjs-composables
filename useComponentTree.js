import { reactive } from 'vue'

export default function (grapes) {
  // Take component tree from cache if it already exists
  if (!grapes._cache.compTree) {

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

    const components = grapes._cache.compTree = reactive({
      tree: [],
      select() { },
      selectAdd() { },
      selectRemove() { },
      selectToggle() { }
    })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Provide function to select a component from the tree
      components.select = editor.select
      components.selectAdd = editor.selectAdd
      components.selectRemove = editor.selectRemove
      components.selectToggle = editor.selectToggle

      // Update the reactive tree based on the tree in GrapesJs
      function updateTree() {
        components.tree.length = 0
        const flatComps = flattenComponents(editor.getComponents().models)
        components.tree.push(...flatComps)
      }

      updateTree()

      // Track the changes in GrapesJs for component tree updates
      editor.on('component:mount', updateTree)
      editor.on('component:remove', updateTree)
      editor.on('component:selected', updateTree)
    })
  }

  return grapes._cache.compTree
}