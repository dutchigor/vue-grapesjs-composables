import { computed, isReactive, markRaw, shallowReactive, shallowRef, triggerRef } from "vue"

function getMethods(model) {
  // const objChain = []
  const properties = new Set()

  for (
    let currentMdl = model;
    Object.getPrototypeOf(currentMdl);
    currentMdl = Object.getPrototypeOf(currentMdl)
  ) {
    // objChain.unshift(currentMdl)
    Object.getOwnPropertyNames(currentMdl).forEach(prop => {
      if (typeof model[prop] === 'function') properties.add(prop)
    })
  }

  return properties
}

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

  const proxy = shallowReactive({
    _model: markRaw(model)
  })


  // Attach getter/setters for the model attributes.
  Object.keys(model.attributes).forEach(attr => {
    if (typeof options.overwrites[attr] !== 'function') {

      const value = computed({
        get: () => modelRef.value.get(attr),
        set: val => modelRef.value.set(attr, val)
      })
      proxy[attr] = value
    }
  })

  // Add attribute overwrites
  Object.keys(options.overwrites).forEach(attr => {
    const customVal = options.overwrites[attr](modelRef)
    proxy[attr] = customVal
  })

  // Assign all functions of the input model to the proxy
  getMethods(model).forEach(key => {
    if (!proxy[key]) {
      const bndFunc = model[key].bind(model)
      Object.defineProperty(proxy, key, { value: bndFunc })
    }
  })

  if (!proxy.cid) {
    // sometimes ID is a field in the model (in which case it'll be proxied already)
    proxy.cid = model.cid
    // Object.defineProperty(proxy, "cid", {
    //   get: function () {
    //     return model.cid;
    //   }
    // })
  }

  proxy._triggerModel = triggerRef.bind(triggerRef, modelRef)

  // function triggerModel() {
  //   console.log({ updated: modelRef })
  //   triggerRef(modelRef)
  // }

  // Ensure proxy reactivity is triggered when model is updated
  options.events.forEach(evt => model.on(evt, proxy._triggerModel))


  // Add method to proxy to remove triggers from model
  function decouple() {
    if (options.onDecouple) options.onDecouple(proxy)
    options.events.forEach(evt => model.off(evt, proxy._triggerModel))
  }

  Object.defineProperty(proxy, '_decouple', { value: decouple })

  return proxy
}