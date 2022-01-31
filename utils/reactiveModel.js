import { computed, isReactive, reactive, shallowRef, triggerRef } from "vue"

export default function reactiveModel(model, options = {}) {
  // If model is already reactive, simply return it
  if (isReactive(model)) return model

  // Default options
  options = {
    overwrites: {},
    events: ['change'],
    ...options
  }

  // Create reactive object to reflect a backbone model
  const modelRef = shallowRef(model)

  const proxy = reactive({
    _modelRef: modelRef
  })

  // Assign all functions of the input model to the proxy
  for (const key in model) {
    if (typeof model[key] === "function" && key !== "constructor") {
      const bndFunc = model[key].bind(model)
      Object.defineProperty(proxy, key, { value: bndFunc });
    }
  }

  // Attach getter/setters for the model attributes.
  Object.keys(model.attributes).forEach(attr => {
    if (typeof options.overwrites[attr] !== 'function') {
      proxy[attr] = computed({
        get: () => modelRef.value.get(attr),
        set: val => modelRef.value.set(attr, val)
      })
    }
  })

  // Add attribute overwrites
  Object.keys(options.overwrites).forEach(attr => {
    proxy[attr] = options.overwrites[attr](modelRef)
  })


  if (!proxy.cid) {
    // sometimes ID is a field in the model (in which case it'll be proxied already)
    Object.defineProperty(proxy, "cid", {
      get: function () {
        return model.cid;
      }
    })
  }

  const triggerModel = triggerRef.bind(triggerRef, modelRef)

  // Ensure proxy reactivity is triggered when model is updated
  options.events.forEach(evt => model.on(evt, triggerModel))

  proxy._decouple = () => {
    if (options.onDecouple) options.onDecouple(proxy)
    options.events.forEach(evt => model.off(evt, triggerModel))
  }

  return proxy
}