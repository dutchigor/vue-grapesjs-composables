import { reactive } from "vue"
import reactiveCollection from "../utils/reactiveCollection"

/**
 * The Block Manager provides a reactive representation of the blocks available in GrapesJS,
 * along with functions needed to handle them.
 * @typedef BlockManager
 * @memberof module:useBlockManager
 * @inner
 * @property {Object[]} blocks A reactive list of all
 * [Blocks]{@link https://grapesjs.com/docs/api/block.html#block} as defined in GrapesJS.
 * @property {String} renderedBlocks A reactive list of all rendered blocks as provided by
 * [getAllVisible]{@link https://grapesjs.com/docs/api/block_manager.html#getallvisible}.
 * @property {Function} dragStart A callback to [trigger the start of block dragging]{@link https://grapesjs.com/docs/modules/Blocks.html#customization}
 * in GrapesJS (called on e.g. the dragstart event on the rendered block).
 * @property {Function} dragStop A callback to [trigger the drop of a block]{@link https://grapesjs.com/docs/modules/Blocks.html#customization}
 * in GrapesJS (called on e.g. the dragend event on the rendered block).
 */

/**
 * Fetch and, if necessary, initiate the Block Manager.
 * @exports useBlockManager
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {module:useBlockManager~BlockManager}
 */
export default function useBlockManager(grapes) {
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
      renderedBlocks: [],
      dragStart() { },
      dragStop() { },
    })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      // Provide first load for the block manager
      bm.blocks = reactiveCollection(editor.Blocks.getAll())
      bm.renderedBlocks = reactiveCollection(editor.Blocks.getAllVisible())
      bm.dragStart = editor.Blocks.startDrag.bind(editor.Blocks)
      bm.dragStop = editor.Blocks.endDrag.bind(editor.Blocks)
    })
  }

  return grapes._cache.blockManager
}
