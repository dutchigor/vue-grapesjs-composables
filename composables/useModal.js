import { reactive } from "vue"

/**
 * Reactive representation of the [modal properties]{@link https://grapesjs.com/docs/modules/Modal.html#custom-modal}.
 * @typedef ModalProps
 * @memberof module:useModal
 * @inner
 * @property {Boolean} open Indicates if the modal should be open
 * @property {Node} title Modal title
 * @property {Node} content Modal content
 * @property {Object} attributes Modal custom attributes
 * @property {Function} close A callback to use when you want to close the modal
 */

/**
 * Get object to handle the GrapesJS modal.
 * @exports useModal
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {module:useModal~ModalProps}
 */
export default function useModal(grapes) {
  // Ensure GrapesJs is not yet initialised
  if (grapes.initialized) throw new Error('useModal must be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

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

    grapes.onInit((editor) => {
      // Update modal handler when modal is triggered
      editor.on('modal', props => {
        for (const prop in props) {
          if (prop !== 'close') modal[prop] = props[prop]
        }
      })

      // Handle modal closure
      modal.close = function () {
        this.open = false
        editor.Modal.close()
      }
    })
  }

  return grapes._cache.modal
}
