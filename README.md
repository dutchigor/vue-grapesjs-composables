# Introduction
Write readme!

# API specification
<!-- api -->

### Modules

<dl>
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

### Functions

<dl>
<dt><a href="#useGrapes">useGrapes(config)</a> ⇒ <code><a href="#VGCconfig">VGCconfig</a></code></dt>
<dd><p>Initialize GrapesJS and make it available to the other composables</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#VGCconfig">VGCconfig</a></dt>
<dd><p>Reactive base state and functions to manage Vue GrapesJS Composables.</p>
</dd>
</dl>

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
The Block Manager provides a reactive representation of the blocks available in GrapesJS,along with functions needed to handle them.

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

<a name="useGrapes"></a>

### useGrapes(config) ⇒ [<code>VGCconfig</code>](#VGCconfig)
Initialize GrapesJS and make it available to the other composables

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Configuration options as defined by [GrapesJS](https://github.com/artf/grapesjs/blob/master/src/editor/config/config.js) |

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
| fn | <code>function</code> | Function to register |

<a name="VGCconfig..onInit"></a>

#### VGCconfig~onInit(fn)
**Kind**: inner method of [<code>VGCconfig</code>](#VGCconfig)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to register |


<!-- apistop -->
