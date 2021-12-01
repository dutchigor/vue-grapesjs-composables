import { reactive, readonly } from "vue"

export default function (grapes, config = {}) {
  // Create variable to hold information on asset manager status
  // and available assets.
  const am = reactive({
    show: false,
    assets: [],
    types: [],
    options: {},
    close() { },
    select() { },
    remove() { },
  })

  // Configure GrapesJs Asset Manager
  grapes.config.assetManager = {
    ...config,
    custom: {
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
    },
  }

  return readonly(am)
}
