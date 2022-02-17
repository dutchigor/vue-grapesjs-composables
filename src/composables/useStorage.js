import { reactive, readonly } from "vue"
/**
 * Reactive object store containing the content created with GrapesJS.
 * @typedef StorageManager
 * @memberof module:useStorage
 * @inner
 * @property {Object} content the [content of GrapesJS]{@link https://grapesjs.com/docs/modules/Storage.html#store-and-load-templates}
 * with storageManager.id disabled
 * @property {module:useStorage~StorageManager.load} load load new content to this object and trigger
 * [GrapesJS load]{@link https://grapesjs.com/docs/api/storage_manager.html#load}
 */

/**
 * @method load
 * @memberof module:useStorage~StorageManager
 * @param {Object} newContent An object containing the new content as defined in {@link StorageManager}
 * @returns {Void}
 */

/**
 * Get reactive store of the GrapesJS content.
 * @exports useStorage
 * @param {VGCconfig} grapes As provided by useGrapes
 * @returns {module:useStorage~StorageManager}
 */
export default function useStorage(grapes) {
  // Ensure GrapesJs is not yet initialised
  if (grapes.initialized) throw new Error('useModal must be executed before GrapesJs is initialised (onMount where useGrapes is executed)')

  // Take storage manager from cache if it already exists
  if (!grapes._cache.content) {
    // Set storage type in config
    grapes.config.storageManager = {
      type: 'vue-reactive-storage',
      id: '',
      autosave: true,
      autoload: false,
      stepsBeforeSave: 1
    }

    // Create variable to hold up to date information on the editor content
    const storage = grapes._cache.content = reactive({
      //  - the current content
      content: {},
      load() { }
    })

    grapes.onInit((editor) => {
      // Add storage manager
      editor.StorageManager.add('vue-reactive-storage', {
        // Load from reactive storage
        load(keys, clb) {
          const result = {};

          keys.forEach(key => {
            const value = storage.content[key];
            if (value) result[key] = value;
          });

          clb(result);
        },

        // Store to reactive storage
        store(data, clb) {
          for (let key in data) {
            switch (key) {
              case 'components':
              case 'styles':
              case 'assets':
                storage.content[key] = JSON.parse(data[key])
                break

              default:
                storage.content[key] = data[key]
                break
            }
          }
          clb();
        }
      })

      editor.store()

      // A function to load new content and trigger GrapesJS load
      storage.load = function (newContent) {
        this.content = newContent
        editor.load()
      }
    })
  }

  return readonly(grapes._cache.content)
}
