import { reactive } from "vue"

export default function (grapes, config = {}) {

  // Configure GrapesJs Block Manager
  grapes.config.blockManager = { ...config, custom: true }

  const bm = reactive({
    blocks: [],
    dragStart() { },
    dragStop() { },
  })

  const updateBM = (props) => {
    bm.blocks = props.blocks;
    bm.dragStart = props.dragStart;
    bm.dragStop = props.dragStop;
  }

  grapes.onInit(() => {
    bm.blocks = grapes.editor.Blocks.getAll().models
    bm.dragStart = (block) => grapes.editor.Blocks.startDrag(block)
    bm.dragStop = () => grapes.editor.Blocks.endDrag()

    grapes.editor.on('block:custom', updateBM)
  })

  return bm
}
