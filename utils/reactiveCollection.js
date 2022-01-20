import { reactive, toRaw } from "vue";
import proxyModel from "./reactiveModel";

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
function getCachedProxy(collection, model) {
  return collection.find(cache => cache.cid === model.cid)
    ?? proxyModel(model)
}

// If input function returns a model or array of models, return a proxy mapped to the model instead
function mapReturnModels(fn, key, cache) {
  if (returnsModels.indexOf(key) === -1) return fn
  return function () {
    const res = fn.apply(this, arguments)
    if (Array.isArray(res)) return res.map(getCachedProxy.bind(null, cache))
    return getCachedProxy(cache, res)
  }
}

// Provide an array with all functions of the input collection assigned to it
function bindCollectionFunctions(collection) {
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
      const bndFunc = mapReturnModels(func, key, res)
      Object.defineProperty(res, key, { value: bndFunc })
    }
  }

  return res
}

// Update list of proxied models with models in collection
function updateCollection(proxy, collection) {
  const cache = [...proxy]

  // Create updated list of proxied models
  proxy.length = 0
  for (const model of collection.models) {
    proxy.push(getCachedProxy(cache, model))
  }

  // Clean up any proxied models removed from the collection.
  // Includes is not available on a reactive object so the raw array is needed
  const rawProxy = toRaw(proxy)
  for (const model of cache) {
    if (rawProxy.includes(model)) model._destroy()
  }
}

/**
 * Create a reactive object that reflects a backbone collection,
 * containing a reactive proxy to each model in the collection.
* @param {Array} collection The collection to make reactive
 * @returns A reactive reflection of the input collection
 */
export default function reactiveCollection(collection) {
  if (typeof collection !== 'object' || !(Array.isArray(collection) || collection.modelId)) {
    throw 'proxyCollection can only be set to a valid Backbone collection or array of models'
  }

  // Create a reactive array with all functions of the input collection assigned to it
  const proxy = reactive(
    (collection.modelId) ? bindCollectionFunctions(collection) : []
  )

  // Add a proxy to each model in the collection to the reactive array
  for (const model of collection.models ?? collection) {
    proxy.push(proxyModel(model))
  }

  // Ensure reactive array is updated when collection is updated
  if (collection.on) collection.on('update', updateCollection.bind(collection, proxy))

  // Add a function to the reactive array to clean up event handler
  // To be executed before deleting the array
  if (collection.off) proxy._destroy = () => collection.off('update', updateCollection)

  return proxy
}

