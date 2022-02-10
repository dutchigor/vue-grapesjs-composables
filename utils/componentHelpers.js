import reactiveCollection from './reactiveCollection'

// Backbone collection events that trigger component updates
export const cmpEvents = [
  'change:attributes',
  'change:tagName',
  'change:styles',
  'change:traits',
  'change:name'
]

// Get a reactive list of child components from a component
export function getChildren(compRef, events = cmpEvents) {
  // Configuration for creating the reactive list of children
  const options = {
    modelOpts: {
      // Overwriting components ensures a recursive list
      overwrites: { components: recurse },
      events,
      // Decouple child components when parent is decoupled
      onDecouple: cmp => cmp.components._decouple()
    },
    // Do not include components of type textnode in the tree
    alter: {
      method: 'filter',
      callback: cmp => cmp.get('type') !== 'textnode'
    }
  }

  // Get recursive list of child components
  function recurse(component) {
    const children = component.value.get('components')
    return reactiveCollection(children, options)
  }

  return recurse(compRef)
}

// Get a reactive list of the html attributes on the component
export function getAttributes(compRef) {
  return new Proxy(compRef, {
    get: (cmp, prop) => cmp.value.getAttributes()[prop],
    set: (cmp, prop, value) => cmp.value.addAttributes({ [prop]: value }),
  })
}

// Get a reactive list of the classes on the component
export function getClasses(compRef) {
  const classes = compRef.value.get('classes')
  return reactiveCollection(classes)
}

// Get a reactive list of traits for the component type
export function getTraits(compRef) {
  const traits = compRef.value.get('traits')
  return reactiveCollection(traits)
}