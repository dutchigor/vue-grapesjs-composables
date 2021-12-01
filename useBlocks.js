import { reactive } from "vue"

export default function (grapes, config = {}) {

  // Configure GrapesJs Block Manager
  grapes.config.blockManager = { ...config, custom: true }

  // Create variable to hold information on currently selected component.
  const bm = reactive({
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
  grapes.onInit(() => {
    // Provide first load for the block manager
    bm.blocks = grapes.editor.Blocks.getAll().models
    bm.dragStart = (block) => grapes.editor.Blocks.startDrag(block)
    bm.dragStop = () => grapes.editor.Blocks.endDrag()

    // Listen to all changes to the block list
    grapes.editor.on('block:custom', updateBM)
  })

  return bm
}
