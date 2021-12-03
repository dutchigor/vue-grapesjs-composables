import { reactive } from "vue"

export default function (grapes) {
  // Ensure GrapesJs is not yet initialised
  if (grapes.initialized) throw new Error('useBlocks must be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

  // Take block manager from cache if it already exists
  if (!grapes._cache.blockManager) {

    // Use custom block manager
    if (!grapes.config.blockManager) grapes.config.blockManager = {}
    grapes.config.blockManager.custom = true

    // Create variable to hold information on currently selected component.
    const bm = grapes._cache.blockManager = reactive({
      blocks: [],
      dragStart() { },
      dragStop() { },
    })

    // Function to update the block manager with all available blocks and dragging functionality.
    function updateBM(props) {
      bm.blocks = props.blocks;
      bm.dragStart = props.dragStart;
      bm.dragStop = props.dragStop;
    }

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Provide first load for the block manager
      bm.blocks = editor.Blocks.getAll().models
      bm.dragStart = (block) => editor.Blocks.startDrag(block)
      bm.dragStop = () => editor.Blocks.endDrag()

      // Listen to all changes to the block list
      editor.on('block:custom', updateBM)
    })
  }

  return grapes._cache.blockManager
}
