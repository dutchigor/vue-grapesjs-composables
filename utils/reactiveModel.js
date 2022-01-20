import { computed, reactive, shallowRef, triggerRef } from "vue"

export default function reactiveModel(model) {
  // Create reactive object to reflect a backbone model
  const modelRef = shallowRef(model)

  const proxy = reactive({
    _modelRef: modelRef
  })

  // Assign all functions of the input model to the proxy
  for (const key in model) {
    if (typeof model[key] === "function" && key !== "constructor") {
      const bndFunc = model[key].bind(model);
      Object.defineProperty(proxy, key, { value: bndFunc });
    }
  }

  // Attach getter/setters for the model attributes.
  Object.keys(model.attributes).forEach(attr => {
    const compAttr = computed({
      get: () => modelRef.value.get(attr),
      set: val => modelRef.value.set(attr, val)
    })

    proxy[attr] = compAttr
  })

  if (!proxy.id) {
    // sometimes ID is a field in the model (in which case it'll be proxied already)
    Object.defineProperty(proxy, "id", {
      get: function () {
        return model.id;
      }
    })
  }

  const triggerModel = () => {
    triggerRef(modelRef)
  }

  // Ensure proxy reactivity is triggered when model is updated
  // model.on('change', triggerRef.bind(triggerRef, proxy._modelRef))
  model.on('change', triggerModel)

  // proxy._destroy = () => model.off('change', triggerModel)
  proxy._destroy = () => model.off('change', triggerRef)

  return proxy
}