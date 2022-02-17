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

    // Provide node content as string, with html escaped in case of a text node
    function getHtml(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const el = document.createElement('div')
        el.innerText = node.wholeText
        return el.innerHTML
      } else {
        return node.outerHTML
      }
    }

    grapes.onInit((editor) => {
      // Update modal handler when modal is triggered
      editor.on('modal', props => {
        console.log({
          props,
          titleType: props.title.nodeType,
          contentType: props.content.nodeType,
        })
        modal.open = props.open
        modal.title = getHtml(props.title)
        modal.content = getHtml(props.content)
        modal.attributes = props.attributes
      })

      modal.close = editor.Modal.close.bind(editor.Modal)
    })
  }

  return grapes._cache.modal
}
