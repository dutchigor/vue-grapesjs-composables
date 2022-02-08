import { computed, reactive, readonly, ref } from "vue"
import reactiveCollection from "../utils/reactiveCollection"

/**
 * Object to manage the assets.
 * @typedef AssetManager
 * @memberof module:useAssetManager
 * @inner
 * @property {Object} assets A reactive representation of the collection of all 
 * [assets]{@link https://grapesjs.com/docs/api/asset.html#asset}
 * @property {Function} add [Add a new asset]{@link https://grapesjs.com/docs/api/assets.html#add}
 * @property {Function} remove [Remove an asset]{@link https://grapesjs.com/docs/api/assets.html#remove}
 * @property {Object} modal Object to handle the modal of the asset manager
 * @property {Boolean} modal.isOpen Whether the modal should be displayed
 * @property {String[]} modal.types Array of asset types requested, eg. ['image']
 * @property {module:useAssetManager~AssetManager} modal.select A callback to select an asset.
 * @property {Function} modal.open [Open the asset modal]{@link https://grapesjs.com/docs/api/assets.html#open}
 * @property {Function} modal.close [Close the asset manager]{@link https://grapesjs.com/docs/api/assets.html#close}
 */

/**
 * @callback selectAsset
 * @memberof module:useAssetManager~AssetManager
 * @param {Object} asset The [asset]{@link https://grapesjs.com/docs/api/asset.html#asset} to select
 * @returns {Void}
 */

/**
 * Get object to manage the assets.
 * @exports useAssetManager
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {module:useAssetManager~AssetManager}
 */
export default function useAssetManager(grapes) {
  // Ensure GrapesJs is not yet initialised
  if (grapes.initialized) throw new Error('useAssetManager must be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

  // Take asset manager from cache if it already exists
  if (!grapes._cache.assetManager) {
    // Create object to manage assets and the Asset Manager modal
    const am = grapes._cache.assetManager = {
      assets: [],
      modal: reactive({
        isOpen: false
      })
    }

    // Use custom asset manager
    if (!grapes.config.assetManager) grapes.config.assetManager = {}
    grapes.config.assetManager.custom = {
      // Store reactive reference to props on modal and indicate that is should be opened
      open(props) {
        am.modal.types = props.types
        am.modal.options = props.options
        am.modal.select = asset => props.select(asset._model ?? asset)
        am.modal.isOpen = true
        console.log(am);
      },
      // clear prop refrences and indicate that modal should be closed
      close() {
        am.modal.isOpen = false
        am.modal.types = []
        am.modal.options = {}
        am.modal.select = null
      }
    }

    // After GrapesJs is loaded.
    grapes.onInit(editor => {
      // Create reactive reference to the collection of all assets
      am.assets = reactiveCollection(editor.AssetManager.getAll(), {
        modelOpts: {
          overwrites: {
            filename: asset => computed(() => asset.value.getFilename),
            extension: asset => computed(() => asset.value.getExtension),
          }
        }
      })

      // Add asset lifecycle functions to asset manager
      am.add = editor.AssetManager.add.bind(editor.AssetManager)
      am.remove = editor.AssetManager.remove.bind(editor.AssetManager)

      // Add modal management functions to modal
      am.modal.open = editor.AssetManager.open.bind(editor.AssetManager)
      am.modal.close = editor.AssetManager.close.bind(editor.AssetManager)
    })
  }

  return readonly(grapes._cache.assetManager)
}
