<div id="top"></div>

# Vue GrapesJS Composables
<!-- PROJECT SHIELDS -->

<!-- PROJECT LOGO -->

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="#api-specification">API specification</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
Vue GrapesJS Composables aims to provide a Vue composition friendly interface into GrapesJS by providing reactive objects for the relevant GrapesJS modules. It allows the developer to utilise the GrapesJS canvas, along with all of its functionality, inside a Vue project, and use the reactive objects to easily create a custom interface to manage the editor.

It does this by providing composables for GrapesJS modules that requires a UI. The composable returns a reactive object that provides realtime access to the objects managed by the module, along with any module functions that are also needed. See the [API specification](#api-specification) for more details on this.

Since there is an overlap between the functionality that GrapesJS and Vue provide, this project only includes modules that can not easily be replaced by pure Vue functionality, like panels. Likewise, only modules that provide access to dynamic state are included, excluding modules like commands. The core GrapesJS modules that are not included can still be accessed directly from the editor.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started
Please follow the instructions below to set your project up with Vue GrapesJS Composables.

### Prerequisites
Vue GrapesJS Composables includes GrapesJS. It is designed to be used as Vue composables and as such, can only be used in a Vue 3 project.

The [Usage](#usage) section in this Readme expects that you are have at least a basic understanding of all the modules in GrapesJS. 

### Installation
This package is simply installed as a dependency to a Vue 3 project. As such the steps are:
1. Install Vue 3 using you preferred method/template.
1. Install Vue GrapesJS Composables:
    * `npm install vue-grapesjs-composables`
    * or `yarn add vue-grapesjs-composables`

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage
All of Vue GrapesJS Composables is accessible as composables in Vue components.

### Initiate GrapesJS
To initialise GrapesJS, create a div with a ref in a component which will contain the canvas. From that component, call useGrapes in the setup function of that component. To Configure GrapesJS, provide the configuration object as defined in the [GrapesJS API Reference](https://grapesjs.com/docs/api/editor.html#editor). As with normal GrapesJS, the starting content can either be added in the canvas div or in the configuration object.

```vue
<template>
  <div ref="canvas">
    <h1>Hello world!</h1>
  </div>
</template>

<script setup>
import { useGrapes } from 'vue-grapesjs-composables'

// Use ref to determine container for the canvas 
const canvas = ref(null)

// Pass GrapesJS configuration object to useGrapes
const grapes = useGrapes({
  container: canvas,
  fromElement: true
})
</script>
```

Note that Vue GrapesJS Composables by default removes all panels from the GrapesJS configuration and sets the height of the canvas to 100%. This aligns better with the notion that the management UI will be provided with Vue. This can however be overwritten if desired simply by providing the panels or height properties to the configuration object.

With GrapesJS initiated, the rest of the UI can be built with your own UI components utilising the rest of the composables as required. This means that the API specifications from GrapesJS still apply to each object. However, instead of listening to, and acting on events, and using getter functions, up-to-date [Model](https://backbonejs.org/#Model) attributes and [Collection](https://backbonejs.org/#Collection) arrays are accessible directly from the reactive object. All other functions on the Model/Collection can still be used as normal.

Lets go through each of the sections in the [GrapesJS documentation](https://grapesjs.com/docs/getting-started.html#getting-started) and see how we can implement them in Vue.

### Blocks
Configure the blocks as you would normally in the config object provided to useGrapes. The use useBlock to access a reactive list of blocks and the functions to handle the drag and drop. Simply render the list in a component and use the drag and drop functions on the dragstart and dragend events on each block.

#### Example

```vue
<script setup>
import { useBlocks } from 'vue-grapesjs-composables'

// Provide the response from useGrapes as prop
const { grapes } = defineProps(['grapes'])
const blocksMgr = useBlocks(grapes)
</script>

<template>
  <div class="block-list">
    <div
      v-for="block in blocksMgr.blocks"
      :key="block.getId()"
      @dragstart="blocksMgr.dragStart(block._model)"
      @dragend="blocksMgr.dragStop()"
      v-html="block.getLabel()"
      draggable="true"
    ></div>
  </div>
</template>
```

### Components
Components and component types are defined in the [usual GrapesJS way](https://grapesjs.com/docs/modules/Components.html).

#### Selected
The component that you mostly access and manipulate is the selected component. As such, access to a reactive representation of this component (meaning this will always be the up to date selected component) is available from the useSelectedComponent composable. From here you can do things like manage the component classes, traits, child components, etc. See the sections below for examples.

#### Traits
The selected component includes a list of traits. Traits are defined in the component definition [as usual](https://grapesjs.com/docs/modules/Traits.html#add-traits-to-components). However, instead of defining trait types through a plugin, define a Vue component for each trait type. Then when rendering the traits of a component, render the relevant Vue component for each trait based on the type field.

#### Example
Canvas.vue
```vue
<script setup>
import { useGrapes } from 'vue-grapesjs-composables'
import Traits from './Traits.vue'

const canvas = ref(null)

// Content is provided as part of the configuration to include Traits
const grapes = useGrapes({
  container: canvas,
  fromElement: true,
  components: {
    tagName: 'p',
    content: 'Hello world!',
    attributes: { 'data-counter': 1 },
    traits: [{
      type: 'Counter',
      name: 'data-counter',
      label: 'Counter',
      step: 2
    }]
  },
})
</script>

<template>
  <div class="row">
    <div class="col-9">
      <div ref="canvas"></div>
    </div>
    <div class="col-3">
      <Traits :grapes="grapes" />
    </div>
  </div>
</template>      
```

Traits.vue
```vue
<script setup>
import { useSelectedComponent } from 'vue-grapesjs-composables'
import Counter from './Counter.vue'

const components = { Counter }
const { grapes } = defineProps(['grapes'])
const selected = useSelectedComponent(grapes)
</script>

<template>
  <div v-for="trait in selected.component.traits">
    {{ trait.label }}:
    <component :is="components[trait.type]" :trait="trait" />
  </div>
</template>
```

Counter.vue
```vue
<script setup>
const { trait } = defineProps(['trait'])
</script>

<template>
  <span>
    <button @click="trait.value = trait.value - trait.step">-</button>
    {{ trait.value }}
    <button @click="trait.value = trait.value + trait.step">+</button>
  </span>
</template>
```

### Styling
In GrapesJS the style of a component is managed by determining the relevant CSS rule to edit, and then setting the style properties. The selected rule is dependent on the selected component, the activated classes and the selected state. As such, these are all available as reactive objects in Vue GrapesJS Composables.

As an alternative, a reactive list of all available CSS rules, with direct access to the css styling, is available.

#### Classes
A reactive array of the classes on the selected component are available by accessing the classes property on the selected component through the useSelectedComponent composable. This array provides methods for adding and removing classes and the active status can be set on each class.

#### State
The available and selected states can be accessed with the useState composable. This provides a reactive object that includes an up-to-date list of all the states, the name of the selected state and a method to change the selected state.

#### Style Properties
A reactive list of the properties on the selected Component or Rule is available through the useStyleProps composable. This provides a list of selectors, each containing a list of properties, along with methods to manage the property types.

To render the properties, create a component for each property type. This can include custom types. You can then dynamically render the relevant type for each component base on its type attribute.

#### CSS Rules
If a more customised experience for selecting or updating the CSS rules is required, a reactive list of CSS rules can be accessed through the useStyles composable. This returns a list of all CSS rules, the selected rule, and methods to manage the list of rules.

#### Examples
Styling.vue
```vue
<script setup>
import { useSelectedComponent, useState, useStyleProps } from 'vue-grapesjs-composables'

// To dynamically select the property component, provide them in an object
// Only adding an example for number properties here
import NumberProp from './NumberProp.vue'
const props = {number: NumberProp}

// Get reactive GrapesJS objects
const { grapes } = defineProps(['grapes'])

const selected = useSelectedComponent(grapes)
const state = useState(grapes)
const styles = useStyleProps(grapes)

// Add class to selected component
function addClass(e) {
  selected.component.addClass(e.target.newClass.value)
  e.target.newClass.value = ''
}
</script>

<template>
  <div>
    <!-- Manage state -->
    <label for="state">State:</label>
    <select @change="state.select($event.target.value)" :value="props.state.selected">
      <option value>- State -</option>
      <option v-for="option in props.state.all" :key="option.name">
        {{ option.name || 'No label' }}
      </option>
    </select>
  </div>

  <!-- Add class to selected component -->
  <form @submit.prevent="addClass">
    <label for="newClass">Add class:</label>
    <input type="text" name="newClass" />
    <button>+</button>
  </form>

  <!-- Manage classes on selected component -->
  <div>
    <span v-for="cls in component.classes">
      <input type="checkbox" v-model="cls.active" />
      {{ cls.label }}
      <button @click="component.removeClass(cls.name)">-</button>, 
    </span>
  </div>

  <!-- Dynamically render relevant component for each property on selected component -->
  <div v-for="sector in styles.sectors">
    <h4>{{ sector.name }}</h4>
    <component v-for="prop in sector.properties" :is="props[prop.type]" :prop="prop">
  </div>
</template>
```

NumberProp.vue
```vue
<script setup>
const { prop } = defineProps(['prop'])
</script>

<template>
  <div>
    <label for="pixels">{{ prop.name }}</label>
    <div>
      <input name="pixels" placeholder="auto" v-model.lazy="prop.value" />
      <select v-model="prop.unit">
        <option value>Select</option>
        <option v-for="unit in prop.units">{{ unit }}</option>
      </select>
    </div>
  </div>
</template>
```
### Layers
A hierarchical reactive representation of the component layers in the canvas is available through useLayers. This provides access to the wrapper component and all child components can be access through the components property on each component.

#### Example
ComponentTree.vue
```vue
<script setup>
import { useLayers } from 'vue-grapesjs-composables'

const { grapes } = defineProps(['grapes'])
const layers = useLayers(grapes)
</script>

<template>
  <ul>
    <li v-for="comp in layers.components" @click.stop="layers.select(comp._model)">
      <strong>{{ comp.tagName }}</strong>
      <span>&nbsp;- {{ comp.name }}</span>
      <component-tree v-if="comp.components.length" :grapes="grapes" />
    </li>
  </ul>
</template>
```

### Devices
Resizing the canvas to model a specific device setting is still done by managing the devices in GrapesJS. A reactive interface in to these devices is provided by the useDevices composable. This includes a list of all devices with methods to manage the list, and the selected device with a method to select another device.

#### Example
```vue
<script>
import { useDevices } from 'vue-grapesjs-composables'

// Provide the response from useGrapes as prop
const { grapes } = defineProps(['grapes'])
const deviceMgr = useDevices(grapes)
</script>

<template>
  <div>
    <button
      v-for="device in deviceMgr.devices"
      :class="{ selected: device.id === deviceMgr.selected.id }"
      @click="deviceMgr.select(device.id)"
    >{{ device.name }}</button>
  </div>
</template>
```

### Asset Manager
Vue GrapesJS Composables allows you to replace the default asset manager with a custom one. To do this, call the useAssetManager composable. This provides a reactive object containing all the details on the state of the asset modal, along with methods to manage the assets.

After useAssetManager is called, GrapesJS will update the reactive object instead of opening the asset manager modal when an asset is requested. It is then up to you to build a modal using that object. Use the isOpen attribute of the modal to show it when needed.

#### Example
```vue
<script setup>
import { useAssetManager } from 'vue-grapesjs-composables'

// Provide the response from useGrapes as prop
const { grapes } = defineProps(['grapes'])
const assetMgr = useAssetManager(grapes)

// Select asset and close modal
function select(asset) {
  assetMgr.modal.select(asset)
  assetMgr.modal.close()
}
</script>

<template>
  <!-- Only show modal if GrapesJS requires input from the asset manager -->
  <div class="overlay" v-if="assetMgr.modal.isOpen">
    <div class="modal">
        <img
          v-for="asset in assetMgr.assets"
          :src="asset.src"
          :alt="asset.name"
          @click="select(asset)"
        />
      <button @click="assetMgr.modal.close()">Close</button>
    </div>
  </div>
</template>
```
### Modal
Much like with the Asset Manager, you can replace the GrapesJS modal with a custom one. To do this, call the useModal composable which returns a reactive object containing all the modal details. Use this reactive object to create your own modal component and display this when the open attribute on the modal object is true. Make sure to use the close function to close the modal so that GrapesJS knows that the modal has been closed.

#### Example
```vue
<script setup>
import { useModal } from 'vue-grapesjs-composables'

// Provide the response from useGrapes as prop
const { grapes } = defineProps(['grapes'])
const modal = useModal(grapes)
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <h1 v-html="modal.title"></h1>
      <div v-html="modal.content"></div>
      <button @click="modal.close()">Close</button>
    </div>
  </div>
</template>
```
### Syncing content with Vue project
To access the content (html and css) created with GrapesJS, Vue GrapesJS Composables provides a reactive object through the useStorage composable. This object includes read only access to the entire content, along with a function to load new content. It is then up to you to sync the content with your data provider.

Note that loading new content replaces the existing content so for updates, make sure to pass the whole content and not just the changes. However, if you are making updates, consider if it might not be better to use the component or style interface.

### Accessing the GrapesJS editor
Above are all the GrapesJS modules, models, and functions that Vue GrapesJS Composables provides. This leaves multiple modules and parts of modules not available. The decision to only provide the above functionality is based on an estimate of where reactivity of GrapesJS collections and models makes most sense.

For instance, Pages have not been included because the assumption is that the page is managed by Vue which provides the relevant content through useStorage. Similarly, Commands have not been included because there is no state to be kept in sync with Vue.

However, There will undoubtedly be exceptions and needs for some users that have not been included. In this case, the core grapesJS API is also accessible. Since GrapesJS can only be initialized once the Vue components have been rendered, the GrapesJS API is accessible through the onInit callback provided by useGrapes. This callback receives the editor as a parameter and is called right after GrapesJS is initialized.

#### Example
```vue
<script setup>
import { useGrapes } from 'vue-grapesjs-composables'

const canvas = ref(null)

const grapes = useGrapes({
  container: canvas,
  fromElement: true
})

// Add a bold button to the Rich Text Editor
grapes.onInit(editor => editor.RichTextEditor.add('bold', {
  icon: '<b>B</b>',
  attributes: {title: 'Bold'},
  result: rte => rte.exec('bold')
}))
</script>

<template>
  <div ref="canvas">
    <h1>Hello world!</h1>
  </div>
</template>
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Please post any questions you might have in the Github discussions or create an issue if you believe you have found a bug. Project Link: https://github.com/dutchigor/vue-grapesjs-composables.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* This project has been inspired heavily by [vue-backbone](https://github.com/mikeapr4/vue-backbone)
* Adn of course this would not be possible without the projects that it is bridging:
    * [GrapesJS](https://grapesjs.com/)
    * [Vue.js](https://v3.vuejs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

## API specification
<!-- api -->

### Modules

<dl>
<dt><a href="#module_useGrapes">useGrapes</a> ⇒ <code><a href="#VGCconfig">VGCconfig</a></code></dt>
<dd><p>Initialize GrapesJS and make it available to the other composables</p>
</dd>
<dt><a href="#module_useAssetManager">useAssetManager</a> ⇒ <code><a href="#module_useAssetManager..AssetManager">AssetManager</a></code></dt>
<dd><p>Get object to manage the assets.</p>
</dd>
<dt><a href="#module_useBlockManager">useBlockManager</a> ⇒ <code><a href="#module_useBlockManager..BlockManager">BlockManager</a></code></dt>
<dd><p>Fetch and, if necessary, initiate the Block Manager.</p>
</dd>
<dt><a href="#module_useComponentTree">useComponentTree</a> ⇒ <code><a href="#module_useComponentTree..ComponentTree">ComponentTree</a></code></dt>
<dd><p>Get object to manage the component tree.</p>
</dd>
<dt><a href="#module_useDevices">useDevices</a> ⇒ <code><a href="#module_useDevices..ReactiveDevices">ReactiveDevices</a></code></dt>
<dd><p>Provide reactive object that contains the state of the GrapesJs devices.</p>
</dd>
<dt><a href="#module_useModal">useModal</a> ⇒ <code><a href="#module_useModal..ModalProps">ModalProps</a></code></dt>
<dd><p>Get object to handle the GrapesJS modal.</p>
</dd>
<dt><a href="#module_useSelectedComponent">useSelectedComponent</a> ⇒ <code><a href="#module_useSelectedComponent..Selected">Selected</a></code></dt>
<dd><p>Get object to manage the selected component.</p>
</dd>
<dt><a href="#module_useState">useState</a> ⇒ <code><a href="#module_useState..StateManager">StateManager</a></code></dt>
<dd><p>Fetch and, if necessary, initiate the State Manager.</p>
</dd>
<dt><a href="#module_useStorage">useStorage</a> ⇒ <code><a href="#module_useStorage..StorageManager">StorageManager</a></code></dt>
<dd><p>Get reactive store of the GrapesJS content.</p>
</dd>
<dt><a href="#module_useStyleProps">useStyleProps</a> ⇒ <code><a href="#module_useStyleProps..PropManager">PropManager</a></code></dt>
<dd><p>Get object to manage the style properties of the selected component.</p>
</dd>
<dt><a href="#module_useStyles">useStyles</a> ⇒ <code><a href="#module_useStyles..CssManager">CssManager</a></code></dt>
<dd><p>Fetch and, if necessary, initiate the CSS manager.</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#VGCconfig">VGCconfig</a></dt>
<dd><p>Reactive base state and functions to manage Vue GrapesJS Composables.</p>
</dd>
</dl>

<a name="module_useGrapes"></a>

### useGrapes ⇒ [<code>VGCconfig</code>](#VGCconfig)
Initialize GrapesJS and make it available to the other composables


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Configuration options as defined by [GrapesJS](https://github.com/artf/grapesjs/blob/master/src/editor/config/config.js) |

<a name="module_useAssetManager"></a>

### useAssetManager ⇒ [<code>AssetManager</code>](#module_useAssetManager..AssetManager)
Get object to manage the assets.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | As provided by useGrapes |


* [useAssetManager](#module_useAssetManager) ⇒ [<code>AssetManager</code>](#module_useAssetManager..AssetManager)
    * [~AssetManager](#module_useAssetManager..AssetManager)
        * [.selectAsset](#module_useAssetManager..AssetManager.selectAsset) ⇒ <code>Void</code>

<a name="module_useAssetManager..AssetManager"></a>

#### useAssetManager~AssetManager
Object to manage the assets.

**Kind**: inner typedef of [<code>useAssetManager</code>](#module_useAssetManager)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| assets | <code>Object</code> | A reactive representation of the collection of all  [assets](https://grapesjs.com/docs/api/asset.html#asset) |
| add | <code>function</code> | [Add a new asset](https://grapesjs.com/docs/api/assets.html#add) |
| remove | <code>function</code> | [Remove an asset](https://grapesjs.com/docs/api/assets.html#remove) |
| modal | <code>Object</code> | Object to handle the modal of the asset manager |
| modal.isOpen | <code>Boolean</code> | Whether the modal should be displayed |
| modal.types | <code>Array.&lt;String&gt;</code> | Array of asset types requested, eg. ['image'] |
| modal.select | [<code>AssetManager</code>](#module_useAssetManager..AssetManager) | A callback to select an asset. |
| modal.open | <code>function</code> | [Open the asset modal](https://grapesjs.com/docs/api/assets.html#open) |
| modal.close | <code>function</code> | [Close the asset manager](https://grapesjs.com/docs/api/assets.html#close) |

<a name="module_useAssetManager..AssetManager.selectAsset"></a>

##### AssetManager.selectAsset ⇒ <code>Void</code>
**Kind**: static typedef of [<code>AssetManager</code>](#module_useAssetManager..AssetManager)  

| Param | Type | Description |
| --- | --- | --- |
| asset | <code>Object</code> | The [asset](https://grapesjs.com/docs/api/asset.html#asset) to select |

<a name="module_useBlockManager"></a>

### useBlockManager ⇒ [<code>BlockManager</code>](#module_useBlockManager..BlockManager)
Fetch and, if necessary, initiate the Block Manager.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | As provided by useGrapes |

<a name="module_useBlockManager..BlockManager"></a>

#### useBlockManager~BlockManager
The Block Manager provides a reactive representation of the blocks available in GrapesJS,
along with functions needed to handle them.

**Kind**: inner typedef of [<code>useBlockManager</code>](#module_useBlockManager)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| blocks | <code>Array.&lt;Object&gt;</code> | A reactive list of all [Blocks](https://grapesjs.com/docs/api/block.html#block) as defined in GrapesJS. |
| renderedBlocks | <code>String</code> | A reactive list of all rendered blocks as provided by [getAllVisible](https://grapesjs.com/docs/api/block_manager.html#getallvisible). |
| dragStart | <code>function</code> | A callback to [trigger the start of block dragging](https://grapesjs.com/docs/modules/Blocks.html#customization) in GrapesJS (called on e.g. the dragstart event on the rendered block). |
| dragStop | <code>function</code> | A callback to [trigger the drop of a block](https://grapesjs.com/docs/modules/Blocks.html#customization) in GrapesJS (called on e.g. the dragend event on the rendered block). |

<a name="module_useComponentTree"></a>

### useComponentTree ⇒ [<code>ComponentTree</code>](#module_useComponentTree..ComponentTree)
Get object to manage the component tree.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | As provided by useGrapes |

<a name="module_useComponentTree..ComponentTree"></a>

#### useComponentTree~ComponentTree
Object to manage the component tree.

**Kind**: inner typedef of [<code>useComponentTree</code>](#module_useComponentTree)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tree | <code>Object</code> | A reactive representation of the component tree, with  [GrapesJS components](https://grapesjs.com/docs/api/component.html#component) |
| select | <code>function</code> | [Select a component](https://grapesjs.com/docs/api/editor.html#select) |
| selectAdd | <code>function</code> | [Add component to selection](https://grapesjs.com/docs/api/editor.html#selectadd) |
| selectRemove | <code>function</code> | [Remove component from selection](https://grapesjs.com/docs/api/editor.html#selectremove) |
| selectToggle | <code>function</code> | [Toggle component selection](https://grapesjs.com/docs/api/editor.html#selecttoggle) |

<a name="module_useDevices"></a>

### useDevices ⇒ [<code>ReactiveDevices</code>](#module_useDevices..ReactiveDevices)
Provide reactive object that contains the state of the GrapesJs devices.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | Response of useGrapes |

<a name="module_useDevices..ReactiveDevices"></a>

#### useDevices~ReactiveDevices
Reactive representation of the GrapesJS device state

**Kind**: inner typedef of [<code>useDevices</code>](#module_useDevices)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| devices | <code>Array.&lt;Object&gt;</code> | A reactive list of [all Devices](https://grapesjs.com/docs/api/device.html#device) |
| selected | <code>Object</code> | A reactive representation of the [currently selected Device](https://grapesjs.com/docs/api/device.html#device) |
| select | <code>function</code> | [Select](https://grapesjs.com/docs/api/device_manager.html#select) device |

<a name="module_useModal"></a>

### useModal ⇒ [<code>ModalProps</code>](#module_useModal..ModalProps)
Get object to handle the GrapesJS modal.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | As provided by useGrapes |

<a name="module_useModal..ModalProps"></a>

#### useModal~ModalProps
Reactive representation of the [modal properties](https://grapesjs.com/docs/modules/Modal.html#custom-modal).

**Kind**: inner typedef of [<code>useModal</code>](#module_useModal)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| open | <code>Boolean</code> | Indicates if the modal should be open |
| title | <code>Node</code> | Modal title |
| content | <code>Node</code> | Modal content |
| attributes | <code>Object</code> | Modal custom attributes |
| close | <code>function</code> | A callback to use when you want to close the modal |

<a name="module_useSelectedComponent"></a>

### useSelectedComponent ⇒ [<code>Selected</code>](#module_useSelectedComponent..Selected)
Get object to manage the selected component.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | As provided by useGrapes |

<a name="module_useSelectedComponent..Selected"></a>

#### useSelectedComponent~Selected
Object to manage the component tree.

**Kind**: inner typedef of [<code>useSelectedComponent</code>](#module_useSelectedComponent)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| component | <code>Object</code> | A reactive representation of the [selected component](https://grapesjs.com/docs/api/component.html#component), Where the child components, attributes and classes have also been made reactive. |

<a name="module_useState"></a>

### useState ⇒ [<code>StateManager</code>](#module_useState..StateManager)
Fetch and, if necessary, initiate the State Manager.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | As provided by useGrapes |

<a name="module_useState..StateManager"></a>

#### useState~StateManager
The State Manager provides a reactive representation of the states available in GrapesJS.

**Kind**: inner typedef of [<code>useState</code>](#module_useState)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| all | <code>Array.&lt;Object&gt;</code> | A reactive list of [all States](https://grapesjs.com/docs/api/state.html#state) as defined in GrapesJS. |
| selected | <code>String</code> | The active state on the current selector. |
| select | <code>function</code> | [Change the state](https://grapesjs.com/docs/api/selector_manager.html#setstate) of the current selector. |

<a name="module_useStorage"></a>

### useStorage ⇒ [<code>StorageManager</code>](#module_useStorage..StorageManager)
Get reactive store of the GrapesJS content.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | As provided by useGrapes |


* [useStorage](#module_useStorage) ⇒ [<code>StorageManager</code>](#module_useStorage..StorageManager)
    * [~StorageManager](#module_useStorage..StorageManager)
        * [.load(newContent)](#module_useStorage..StorageManager.load) ⇒ <code>Void</code>

<a name="module_useStorage..StorageManager"></a>

#### useStorage~StorageManager
Reactive object store containing the content created with GrapesJS.

**Kind**: inner typedef of [<code>useStorage</code>](#module_useStorage)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| content | <code>Object</code> | the [content of GrapesJS](https://grapesjs.com/docs/modules/Storage.html#store-and-load-templates) with storageManager.id disabled |
| load | [<code>load</code>](#module_useStorage..StorageManager.load) | load new content to this object and trigger [GrapesJS load](https://grapesjs.com/docs/api/storage_manager.html#load) |

<a name="module_useStorage..StorageManager.load"></a>

##### StorageManager.load(newContent) ⇒ <code>Void</code>
**Kind**: static method of [<code>StorageManager</code>](#module_useStorage..StorageManager)  

| Param | Type | Description |
| --- | --- | --- |
| newContent | <code>Object</code> | An object containing the new content as defined in [StorageManager](StorageManager) |

<a name="module_useStyleProps"></a>

### useStyleProps ⇒ [<code>PropManager</code>](#module_useStyleProps..PropManager)
Get object to manage the style properties of the selected component.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | As provided by useGrapes |

<a name="module_useStyleProps..PropManager"></a>

#### useStyleProps~PropManager
Object to manage the style properties of the selected component.

**Kind**: inner typedef of [<code>useStyleProps</code>](#module_useStyleProps)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| sectors | <code>Array.&lt;Object&gt;</code> | A reactive representation of all [GrapesJS sectors](https://grapesjs.com/docs/api/sector.html#sector) |
| getBuiltIn | <code>function</code> | [Return built-in property definition](https://grapesjs.com/docs/api/style_manager.html#getbuiltin) |
| getBuiltInAll | <code>function</code> | [Get all the available built-in property definitions](https://grapesjs.com/docs/api/style_manager.html#getbuiltinall) |
| addType | <code>function</code> | [Add new property type](https://grapesjs.com/docs/api/style_manager.html#addtype) |
| getType | <code>function</code> | [Get type](https://grapesjs.com/docs/api/style_manager.html#gettype) |
| getTypes | <code>function</code> | [Get all types](https://grapesjs.com/docs/api/style_manager.html#gettypes) |

<a name="module_useStyles"></a>

### useStyles ⇒ [<code>CssManager</code>](#module_useStyles..CssManager)
Fetch and, if necessary, initiate the CSS manager.


| Param | Type | Description |
| --- | --- | --- |
| grapes | [<code>VGCconfig</code>](#VGCconfig) | As provided by useGrapes |

<a name="module_useStyles..CssManager"></a>

#### useStyles~CssManager
The CSS Manager contains the lifecycle functions and reactive representations of the CSS Rules.

**Kind**: inner typedef of [<code>useStyles</code>](#module_useStyles)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| cssRules | <code>Array.&lt;Object&gt;</code> | A reactive list of all the [CSS rules](https://grapesjs.com/docs/api/css_rule.html#cssrule) as defined in GrapesJS. |
| selected.rule | <code>Object</code> | A reactive representation of the selected [CSS rule](https://grapesjs.com/docs/api/css_rule.html#cssrule). |
| selected.selector | <code>String</code> | The css selector that identifies the selected rule. |
| addRules | <code>function</code> | [Add a CSS rule](https://grapesjs.com/docs/api/css_composer.html#addrules) via CSS string |
| setRule | <code>function</code> | [Add/update the CssRule](https://grapesjs.com/docs/api/css_composer.html#setrule) |
| remove | <code>function</code> | [Remove rule](https://grapesjs.com/docs/api/css_composer.html#remove), by CssRule or matching selector |
| clear | <code>function</code> | [Remove all rules](https://grapesjs.com/docs/api/css_composer.html#clear) |

<a name="VGCconfig"></a>

### VGCconfig
Reactive base state and functions to manage Vue GrapesJS Composables.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Reactive version of the provided GrapesJS configuration object |
| initialized | <code>boolean</code> | Whether GrapesJS has been initialized |
| onBeforeInit | [<code>onBeforeInit</code>](#VGCconfig..onBeforeInit) | Register function to be executed right before GrapesJS is initialized |
| onInit | [<code>onInit</code>](#VGCconfig..onInit) | Register function to be executed right after GrapesJS is initialized |


* [VGCconfig](#VGCconfig)
    * [~onBeforeInit(fn)](#VGCconfig..onBeforeInit)
    * [~onInit(fn)](#VGCconfig..onInit)

<a name="VGCconfig..onBeforeInit"></a>

#### VGCconfig~onBeforeInit(fn)
**Kind**: inner method of [<code>VGCconfig</code>](#VGCconfig)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to register. Does not receive any parameters. |

<a name="VGCconfig..onInit"></a>

#### VGCconfig~onInit(fn)
**Kind**: inner method of [<code>VGCconfig</code>](#VGCconfig)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>Callback</code> | Function to register. Receives the GrapesJS editor as a parameter. |


<!-- apistop -->

<p align="right">(<a href="#top">back to top</a>)</p>
