import { reactive, readonly } from "vue"

export default function (grapes) {
  // Ensure GrapesJs is not yet initalised
  if (grapes.initialized) throw new Error('useAssetManager must be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

  // Take asset manager from cache if it already exists
  if (!grapes._cache.assetManager) {

    // Create variable to hold information on asset manager status
    // and available assets.
    const am = grapes._cache.assetManager = reactive({
      show: false,
      assets: [],
      types: [],
      options: {},
      close() { },
      select() { },
      remove() { },
    })

    // Use custom asset manager
    if (!grapes.config.assetManager) grapes.config.assetManager = {}
    grapes.config.assetManager.custom = {
      // Update reference to asset manager and set show to true when it is opened
      open(props) {
        am.assets = props.assets
        am.types = props.types
        am.options = props.options
        am.close = props.close
        am.select = props.select
        am.remove = props.remove
        am.show = true
      },
      // Set show to false when asset manager is closed
      close() {
        am.show = false
      }
    }
  }

  return readonly(grapes._cache.assetManager)
}
