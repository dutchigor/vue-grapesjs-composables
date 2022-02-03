import { reactive, toRaw, isReactive } from "vue";
import reactiveModel from "./reactiveModel";

// List of array functions that should not be overwritten
const arrayPriority = [
  "slice",
  "forEach",
  "map",
  "reduce",
  "reduceRight",
  "find",
  "filter",
  "every",
  "some",
  "indexOf",
  "lastIndexOf",
  "findIndex",
  "pop",
  "push",
  "shift",
  "unshift"
]

//  List of functions that return a Backbone Model
const returnsModels = [
  "get",
  "at",
  "remove",
  "where",
  "findWhere",
  "detect",
  "first",
  "head",
  "take",
  "rest",
  "tail",
  "drop",
  "initial",
  "last",
  "without",
  "reject",
  "sortBy",
  "shuffle",
  "toArray",
  "select",
]

// Get proxied model from previous collection if it exists, otherwise create it
function getCachedProxy(collection, options, model) {
  return collection.find(cache => cache._model.cid === model.cid)
    ?? reactiveModel(model, options.modelOpts ?? {})
}

// If input function returns a model or array of models, return a proxy mapped to the model instead
function mapReturnModels(fn, key, cache, options) {
  if (returnsModels.indexOf(key) === -1) return fn
  return function () {
    const res = fn.apply(this, arguments)
    if (Array.isArray(res)) return res.map(getCachedProxy.bind(null, cache, options))
    return getCachedProxy(cache, options, res)
  }
}

// Provide an array with all functions of the input collection assigned to it
function bindCollectionFunctions(collection, options) {
  const res = []
  for (const key in collection) {
    // Make sure that property is a function
    if (
      typeof collection[key] === "function" &&
      key !== "constructor" &&
      arrayPriority.indexOf(key) === -1
    ) {
      // Bind function to original collection and assign to output array
      const func = collection[key].bind(collection)
      const bndFunc = mapReturnModels(func, key, res, options)
      Object.defineProperty(res, key, { value: bndFunc })
    }
  }

  return res
}

// Update list of proxied models with models in collection
function updateCollection(proxy, options, collection) {
  const cache = [...proxy]

  // Create updated list of proxied models
  proxy.length = 0
  for (const model of collection.models) {
    proxy.push(getCachedProxy(cache, options, model))
  }

  // Clean up any proxied models removed from the collection.
  // Includes is not available on a reactive object so the raw array is needed
  const rawProxy = toRaw(proxy)
  for (const model of cache) {
    if (!rawProxy.includes(model)) model._decouple()
  }
}

/**
 * Create a reactive object that reflects a backbone collection,
 * containing a reactive proxy to each model in the collection.
 * @param {Array} collection The collection to make reactive
 * @returns {Array} A reactive reflection of the input collection
 */
export default function reactiveCollection(collection, options = {}) {
  // If model is already reactive, simply return it
  if (isReactive(collection)) return collection

  // Create a reactive array with all functions of the input collection assigned to it
  const proxy = reactive(
    (collection.modelId) ? bindCollectionFunctions(collection, options) : []
  )

  // Change list of models as defined in the options
  const models = collection.models ?? collection
  const alteredModels = options.alter ?
    models[options.alter.method](options.alter.callback) :
    models

  // Add a proxy to each model in the altered collection to the reactive array
  for (const model of alteredModels) {
    proxy.push(
      reactiveModel(model, options.modelOpts ?? {})
    )
  }

  // Ensure reactive array is updated when collection is updated
  // const updColl = updateCollection.bind(collection, proxy, options)
  function updColl(components) {
    console.log(arguments)
    updateCollection(proxy, options, components)
  }

  if (collection.on) {
    collection.on('update', updColl)
  }


  // Add a function to the reactive array to clean up event handler
  // To be executed before deleting the array
  if (collection.off) {
    const decouple = collection.off.bind(collection.off, 'update', updColl)
    Object.defineProperty(proxy, '_decouple', { value: decouple })
  }

  return proxy
}

