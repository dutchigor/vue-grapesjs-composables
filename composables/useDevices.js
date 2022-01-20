import { reactive } from "vue"
import reactiveCollection from "../utils/reactiveCollection"
import reactiveModel from "../utils/reactiveModel"

/**
 * Reactive representation of the GrapesJS device state
 * @typedef ReactiveDevices
 * @property {Device[]} devices Proxy to a [collection of all Devices]{https://grapesjs.com/docs/api/device_manager.html#devices}
 * @property {Device} selected The currently selected Device
 * @property {Function} select [Select]{@link https://grapesjs.com/docs/api/device_manager.html#select} device
 */

/**
 * Provide reactive object that contains the state of the GrapesJs devices.
 * @param {VGCconfig} grapes Response of useGrapes
 * @returns {ReactiveDevices}
 */
export default function (grapes) {
  // Take block manager from cache if it already exists
  if (!grapes._cache.devices) {

    // Create variable to hold all up to date selector properties.
    const dm = grapes._cache.devices = reactive({
      devices: [],
      selected: {}
    })

    // After GrapesJs is loaded.
    grapes.onInit((editor) => {
      dm.select = editor.Devices.select.bind(editor.Devices)

      // Update the reactive state based on the device selected in GrapesJs
      function updateSelected(device) {
        if (dm.selected._destroy) dm.selected._destroy()
        dm.selected = reactiveModel(device)
      }

      updateSelected(editor.Devices.getSelected())

      // Update the reactive state based on the devices in GrapesJs
      dm.devices = reactiveCollection(editor.DeviceManager.getAll())

      // Track the changes in GrapesJs for selector updates
      editor.on('device:select ', updateSelected)
    })
  }

  return grapes._cache.devices
}
