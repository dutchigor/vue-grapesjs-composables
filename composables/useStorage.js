import { reactive, readonly } from "vue"

export default function (grapes) {
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
      // Add storage manager that:
      editor.StorageManager.add('vue-reactive-storage', {
        /**
     * Load the data
     * @param  {Array} keys Array containing values to load, eg, ['gjs-components', 'gjs-styles', ...]
     * @param  {Function} clb Callback function to call when the load is ended
     * @param  {Function} clbErr Callback function to call in case of errors
     */
        load(keys, clb, clbErr) {
          const result = {};

          keys.forEach(key => {
            const value = storage.content[key];
            if (value) result[key] = value;
          });

          clb(result);
        },

        /**
         * Store the data
         * @param  {Object} data Data object to store
         * @param  {Function} clb Callback function to call when the load is ended
         * @param  {Function} clbErr Callback function to call in case of errors
         */
        store(data, clb, clbErr) {
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

      //  - A function to load new content and triggers GrapesJs load
      storage.load = function (newContent) {
        this.content = newContent
        editor.load()
      }
    })
  }

  return readonly(grapes._cache.content)
}
