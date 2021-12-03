import { reactive, readonly } from "vue"

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
      // Add function to select device
      dm.select = function (device) {
        editor.Devices.select(device)
      }

      // Update the reactive state based on the device selected in GrapesJs
      function updateSelected(device) {
        dm.selected = {
          ...device.attributes,
          model: device,
        }
      }

      updateSelected(editor.Devices.getSelected())

      // Update the reactive state based on the devices in GrapesJs
      function updateDevices() {
        dm.devices = editor.Devices.getDevices().map(device => ({
          ...device.attributes,
          model: device,
        }))
      }

      updateDevices()

      // Track the changes in GrapesJs for selector updates
      editor.on('device:add', updateDevices)
      editor.on('device:remove', updateDevices)
      editor.on('device:update', updateDevices)
      editor.on('device:select ', updateSelected)
    })
  }

  return readonly(grapes._cache.devices)
}
