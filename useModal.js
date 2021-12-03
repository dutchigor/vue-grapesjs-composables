import { reactive, readonly } from "vue"

export default function (grapes) {
  // Ensure GrapesJs is not yet initialised
  if (grapes.initialized) throw new Error('useModalmust be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

  // Take asset manager from cache if it already exists
  if (!grapes._cache.modal) {

    // Use custom asset manager
    if (!grapes.config.modal) grapes.config.modal = {}
    grapes.config.modal.custom = true

    // Create variable to hold information on asset manager status
    // and available assets.
    const modal = grapes._cache.modal = reactive({
      open: false,
      title: '',
      content: '',
      attributes: {},
      close() { },
    })

    grapes.onInit((editor) => editor.on('modal', props => {
      for (prop in props) {
        modal[prop] = props[prop]
      }
    }))
  }

  return readonly(grapes._cache.modal)
}
