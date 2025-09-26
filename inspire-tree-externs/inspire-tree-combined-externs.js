/** @externs */

/**
 * @typedef {Array<!InspireTree.NodeConfig>}
 */
InspireTree.NodeConfigs;

/**
 * @typedef {Promise<!InspireTree.NodeConfigs|undefined>}
 */
InspireTree.NodeConfigsPromise;

/**
 * @typedef {function(!InspireTree.TreeNode|null): !InspireTree.NodeConfigs|!InspireTree.NodeConfigsPromise}
 */
InspireTree.NodeConfigsFunctionResolver;

/**
 * @typedef {function(!InspireTree.TreeNode|null, function(!Array<!InspireTree.NodeConfig>): void, function(!Error): void): void}
 */
InspireTree.NodeConfigsResolver;

/**
 * @typedef {!InspireTree.NodeConfigs|!InspireTree.NodeConfigsPromise|!InspireTree.NodeConfigsFunctionResolver|!InspireTree.NodeConfigsResolver}
 */
InspireTree.NodeConfigsProvider;

/**
 * @typedef {function(!InspireTree.TreeNode): *}
 */
InspireTree.NodeIteratee;

/**
 * @typedef {function(!InspireTree.TreeNodes): *}
 */
InspireTree.MatchProcessor;

/**
 * @typedef {function(string, *, *): *}
 */
InspireTree.SearchMatcher;

/**
 * @typedef {{
 *   allowLoadEvents: (Array<string>|undefined),
 *   cancelEditOnBlur: (boolean|undefined),
 *   contextMenu: (boolean|undefined),
 *   data: !InspireTree.NodeConfigsProvider,
 *   deferredLoading: (boolean|undefined),
 *   editable: (boolean|undefined),
 *   editing: ({add: (boolean|undefined), edit: (boolean|undefined), remove: (boolean|undefined)}|undefined),
 *   nodes: ({resetStateOnRestore: (boolean|undefined)}|undefined),
 *   pagination: ({limit: (number|undefined)}|undefined),
 *   renderer: (*|undefined),
 *   search: ({matcher: !InspireTree.SearchMatcher, matchProcess: !InspireTree.MatchProcessor}|undefined),
 *   selection: ({allow: (!InspireTree.NodeIteratee|undefined), autoDeselect: (boolean|undefined), autoSelectChildren: (boolean|undefined), disableDirectDeselection: (boolean|undefined), mode: (string|undefined), multiple: (boolean|undefined), require: (boolean|undefined)}|undefined),
 *   sort: (string|undefined)
 * }}
 */
InspireTree.Config;

/**
 * @typedef {{
 *   children: (Array<!InspireTree.NodeConfig>|boolean|undefined),
 *   id: (string|undefined),
 *   text: string,
 *   itree: ({a: ({attributes: (*|undefined)}|undefined), icon: (string|undefined), li: ({attributes: (*|undefined)}|undefined), state: ({checked: (boolean|undefined), collapsed: (boolean|undefined), draggable: (boolean|undefined), 'drop-target': (boolean|undefined), editable: (boolean|undefined), focused: (boolean|undefined), hidden: (boolean|undefined), indeterminate: (boolean|undefined), loading: (boolean|undefined), matched: (boolean|undefined), removed: (boolean|undefined), rendered: (boolean|undefined), selectable: (boolean|undefined), selected: (boolean|undefined), [x: string]: (boolean|undefined)}|undefined)}|undefined)
 * }}
 */
InspireTree.NodeConfig;

/**
 * @typedef {{limit: number, total: number}}
 */
InspireTree.Pagination;

/**
 * @typedef {{
 *   'changes.applied': (function(!InspireTree|!InspireTree.TreeNode): void|undefined),
 *   'children.loaded': (function(!InspireTree.TreeNode): void|undefined),
 *   'data.loaded': (function(Array<*>): void|undefined),
 *   'data.loaderror': (function(!Error): void|undefined),
 *   'model.loaded': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.added': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.click': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.contextmenu': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.blurred': (function(!InspireTree.TreeNode, boolean): void|undefined),
 *   'node.checked': (function(!InspireTree.TreeNode, boolean): void|undefined),
 *   'node.collapsed': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.deselected': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.edited': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.expanded': (function(!InspireTree.TreeNode, boolean): void|undefined),
 *   'node.focused': (function(!InspireTree.TreeNode, boolean): void|undefined),
 *   'node.hidden': (function(!InspireTree.TreeNode, boolean): void|undefined),
 *   'node.moved': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.paginated': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.property.changed': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.removed': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.restored': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.selected': (function(!InspireTree.TreeNode, boolean): void|undefined),
 *   'node.state.changed': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.shown': (function(!InspireTree.TreeNode): void|undefined),
 *   'node.softremoved': (function(!InspireTree.TreeNode, boolean): void|undefined),
 *   'node.unchecked': (function(!InspireTree.TreeNode): void|undefined)
 * }}
 */
InspireTree.TreeEvents;

/**
 * @constructor
 */
InspireTree = function() {};

/**
 * @param {!InspireTree.NodeConfig} node
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.addNode = function(node) {};

/**
 * @param {Array<!InspireTree.NodeConfig>} node
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.addNodes = function(node) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.available = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.blur = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.blurDeep = function() {};

/**
 * @param {!InspireTree.TreeNode} first
 * @param {!InspireTree.TreeNode} second
 * @return {Array<!InspireTree.TreeNode>}
 */
InspireTree.prototype.boundingNodes = function(first, second) {};

/**
 * @return {boolean}
 */
InspireTree.prototype.canAutoDeselect = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.checked = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.clean = function() {};

/**
 * @return {!InspireTree}
 */
InspireTree.prototype.clearSearch = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.clone = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.collapse = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.collapsed = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.collapseDeep = function() {};

/**
 * @param {!InspireTree.Config} opts
 */
InspireTree.prototype.constructor = function(opts) {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.context = function() {};

/**
 * @param {!InspireTree} dest
 * @param {boolean=} hierarchy
 * @param {boolean=} includeState
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.copy = function(dest, hierarchy, includeState) {};

/**
 * @param {*} obj
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.createNode = function(obj) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.deepest = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.deselect = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.deselectDeep = function() {};

/**
 * @return {!InspireTree}
 */
InspireTree.prototype.disableDeselection = function() {};

/**
 * @param {!InspireTree.NodeIteratee} iteratee
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.each = function(iteratee) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.editable = function(full) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.editing = function(full) {};

/**
 * @return {!InspireTree}
 */
InspireTree.prototype.enableDeselection = function() {};

/**
 * @return {Promise<!InspireTree.TreeNodes>}
 */
InspireTree.prototype.expand = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.expandDeep = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.expanded = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.expandParents = function() {};

/**
 * @param {string|!InspireTree.NodeIteratee} predicate
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.extract = function(predicate) {};

/**
 * @param {string|!InspireTree.NodeIteratee} predicate
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.filterBy = function(predicate) {};

/**
 * @param {function(!InspireTree.TreeNode, number=, Array<!InspireTree.TreeNode>=): boolean} predicate
 * @param {*=} thisArg
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.find = function(predicate, thisArg) {};

/**
 * @param {function(!InspireTree.TreeNode): boolean} predicate
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.first = function(predicate) {};

/**
 * @param {string|!InspireTree.NodeIteratee} predicate
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.flatten = function(predicate) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.focused = function(full) {};

/**
 * @param {number} index
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.get = function(index) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.hidden = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.hide = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.hideDeep = function() {};

/**
 * @type {string|number}
 */
InspireTree.prototype.id;

/**
 * @type {!InspireTree.Config}
 */
InspireTree.prototype.config;

/**
 * @type {boolean}
 */
InspireTree.prototype.preventDeselection;

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.indeterminate = function(full) {};

/**
 * @param {number} index
 * @param {*} object
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.insertAt = function(index, object) {};

/**
 * @param {string|Array<string>} methods
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.invoke = function(methods) {};

/**
 * @param {string|Array<string>} methods
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.invokeDeep = function(methods) {};

/**
 * @param {string} eventName
 * @return {boolean}
 */
InspireTree.prototype.isEventMuted = function(eventName) {};

/**
 * @param {*} value
 * @return {boolean}
 */
InspireTree.isTreeNode = function(value) {};

/**
 * @param {*} value
 * @return {boolean}
 */
InspireTree.isTreeNodes = function(value) {};

/**
 * @param {function(!InspireTree.TreeNode): boolean} predicate
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.last = function(predicate) {};

/**
 * @return {!InspireTree.TreeNode|undefined}
 */
InspireTree.prototype.lastSelectedNode = function() {};

/**
 * @param {Promise<!InspireTree.TreeNodes>} loader
 * @return {Promise<!InspireTree.TreeNodes>}
 */
InspireTree.prototype.load = function(loader) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.loading = function(full) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.matched = function(full) {};

/**
 * @param {number} index
 * @param {number} newIndex
 * @param {!InspireTree.TreeNodes} target
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.move = function(index, newIndex, target) {};

/**
 * @param {Array<string>} events
 * @return {!InspireTree}
 */
InspireTree.prototype.mute = function(events) {};

/**
 * @return {boolean}
 */
InspireTree.prototype.muted = function() {};

/**
 * @param {string|number} id
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.node = function(id) {};

/**
 * @param {Array<string>|Array<number>=} ids
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.nodes = function(ids) {};

/**
 * @return {!InspireTree.Pagination}
 */
InspireTree.prototype.pagination = function() {};

/**
 * @param {!InspireTree.NodeIteratee} iteratee
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.recurseDown = function(iteratee) {};

/**
 * @return {Promise<!InspireTree.TreeNodes>}
 */
InspireTree.prototype.reload = function() {};

/**
 * @return {!InspireTree}
 */
InspireTree.prototype.removeAll = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.removed = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.restore = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.restoreDeep = function() {};

/**
 * @param {string|RegExp|!InspireTree.NodeIteratee} query
 * @return {Promise<!InspireTree.TreeNodes>}
 */
InspireTree.prototype.search = function(query) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.select = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.selectable = function(full) {};

/**
 * @param {!InspireTree.TreeNode} start
 * @param {!InspireTree.TreeNode} end
 * @return {!InspireTree}
 */
InspireTree.prototype.selectBetween = function(start, end) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.selectDeep = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.selected = function(full) {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.prototype.selectFirstAvailableNode = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.show = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.showDeep = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.softRemove = function() {};

/**
 * @param {string|!InspireTree.NodeIteratee} sorter
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.sortBy = function(sorter) {};

/**
 * @param {string} key
 * @param {boolean} val
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.state = function(key, val) {};

/**
 * @param {string} key
 * @param {boolean} val
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.stateDeep = function(key, val) {};

/**
 * @param {!InspireTree.TreeNode} node1
 * @param {!InspireTree.TreeNode} node2
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.swap = function(node1, node2) {};

/**
 * @return {Array<*>}
 */
InspireTree.prototype.toArray = function() {};

/**
 * @return {!InspireTree}
 */
InspireTree.prototype.tree = function() {};

/**
 * @param {Array<string>} events
 * @return {!InspireTree}
 */
InspireTree.prototype.unmute = function(events) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.prototype.visible = function(full) {};

/**
 * @constructor
 * @extends {Array<!InspireTree.TreeNode>}
 */
InspireTree.TreeNodes = function() {};

/**
 * @param {!InspireTree.NodeConfig} node
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNodes.prototype.addNode = function(node) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.available = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.blur = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.blurDeep = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.checked = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.clean = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.clone = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.collapse = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.collapsed = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.collapseDeep = function() {};

/**
 * @param {!InspireTree} tree
 * @param {Array<*>|!InspireTree.TreeNodes} array
 */
InspireTree.TreeNodes.prototype.constructor = function(tree, array) {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNodes.prototype.context = function() {};

/**
 * @param {!InspireTree} dest
 * @param {boolean=} hierarchy
 * @param {boolean=} includeState
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.copy = function(dest, hierarchy, includeState) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.deepest = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.deselect = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.deselectDeep = function() {};

/**
 * @param {!InspireTree.NodeIteratee} iteratee
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.each = function(iteratee) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.editable = function(full) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.editing = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.expand = function() {};

/**
 * @return {Promise<!InspireTree.TreeNodes>}
 */
InspireTree.TreeNodes.prototype.expandDeep = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.expanded = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.expandParents = function() {};

/**
 * @param {string|!InspireTree.NodeIteratee} predicate
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.extract = function(predicate) {};

/**
 * @param {string|!InspireTree.NodeIteratee} predicate
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.filterBy = function(predicate) {};

/**
 * @param {function(!InspireTree.TreeNode, number, Array<!InspireTree.TreeNode>): boolean} predicate
 * @param {*=} thisArg
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNodes.prototype.find = function(predicate, thisArg) {};

/**
 * @param {string|!InspireTree.NodeIteratee} predicate
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.flatten = function(predicate) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.focused = function(full) {};

/**
 * @param {number} index
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNodes.prototype.get = function(index) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.hidden = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.hide = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.hideDeep = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.indeterminate = function(full) {};

/**
 * @param {number} index
 * @param {*} object
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNodes.prototype.insertAt = function(index, object) {};

/**
 * @param {string|Array<string>} methods
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.invoke = function(methods) {};

/**
 * @param {string|Array<string>} methods
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.invokeDeep = function(methods) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.loading = function(full) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.matched = function(full) {};

/**
 * @param {number} index
 * @param {number} newIndex
 * @param {!InspireTree.TreeNodes} target
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNodes.prototype.move = function(index, newIndex, target) {};

/**
 * @param {string|number} id
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNodes.prototype.node = function(id) {};

/**
 * @param {Array<string>|Array<number>=} ids
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.nodes = function(ids) {};

/**
 * @return {!InspireTree.Pagination}
 */
InspireTree.TreeNodes.prototype.pagination = function() {};

/**
 * @param {!InspireTree.NodeIteratee} iteratee
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.recurseDown = function(iteratee) {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.removed = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.restore = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.restoreDeep = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.select = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.selectable = function(full) {};

/**
 * @param {!InspireTree.TreeNode} start
 * @param {!InspireTree.TreeNode} end
 * @return {!InspireTree}
 */
InspireTree.TreeNodes.prototype.selectBetween = function(start, end) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.selectDeep = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.selected = function(full) {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.show = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.showDeep = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.softRemove = function() {};

/**
 * @param {string|!InspireTree.NodeIteratee} sorter
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.sortBy = function(sorter) {};

/**
 * @param {string} key
 * @param {boolean} val
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.state = function(key, val) {};

/**
 * @param {string} key
 * @param {boolean} val
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.stateDeep = function(key, val) {};

/**
 * @param {!InspireTree.TreeNode} node1
 * @param {!InspireTree.TreeNode} node2
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.swap = function(node1, node2) {};

/**
 * @return {Array<*>}
 */
InspireTree.TreeNodes.prototype.toArray = function() {};

/**
 * @return {!InspireTree}
 */
InspireTree.TreeNodes.prototype.tree = function() {};

/**
 * @param {boolean=} full
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNodes.prototype.visible = function(full) {};

/**
 * @constructor
 */
InspireTree.TreeNode = function() {};

/**
 * @param {!InspireTree.NodeConfig} node
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.addChild = function(node) {};

/**
 * @param {Array<!InspireTree.NodeConfig>} nodes
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNode.prototype.addChildren = function(nodes) {};

/**
 * @param {...*} sources
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.assign = function(sources) {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.available = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.blur = function() {};

/**
 * @param {boolean=} shallow
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.check = function(shallow) {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.checked = function() {};

/**
 * @type {boolean|!InspireTree.TreeNodes}
 */
InspireTree.TreeNode.prototype.children;

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.clean = function() {};

/**
 * @param {Array<string>=} excludeKeys
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.clone = function(excludeKeys) {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.collapse = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.collapsed = function() {};

/**
 * @param {!InspireTree} tree
 * @param {*} source
 * @param {Array<string>} excludeKeys
 */
InspireTree.TreeNode.prototype.constructor = function(tree, source, excludeKeys) {};

/**
 * @type {string}
 */
InspireTree.TreeNode.prototype.text;

/**
 * @type {string}
 */
InspireTree.TreeNode.prototype.id;

/**
 * @type {!InspireTree.NodeConfig['itree']|undefined}
 */
InspireTree.TreeNode.prototype.itree;

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNode.prototype.context = function() {};

/**
 * @param {!InspireTree} dest
 * @param {boolean=} hierarchy
 * @param {boolean=} includeState
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.copy = function(dest, hierarchy, includeState) {};

/**
 * @param {boolean=} excludeNode
 * @param {boolean=} includeState
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.copyHierarchy = function(excludeNode, includeState) {};

/**
 * @param {boolean=} shallow
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.deselect = function(shallow) {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.editable = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.editing = function() {};

/**
 * @return {Promise<!InspireTree.TreeNode>}
 */
InspireTree.TreeNode.prototype.expand = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.expanded = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.expandParents = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.focus = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.focused = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNode.prototype.getChildren = function() {};

/**
 * @return {!InspireTree.TreeNode|undefined}
 */
InspireTree.TreeNode.prototype.getParent = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNode.prototype.getParents = function() {};

/**
 * @return {Array<string>}
 */
InspireTree.TreeNode.prototype.getTextualHierarchy = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.hasAncestor = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.hasChildren = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.hasLoadedChildren = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.hasOrWillHaveChildren = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.hasParent = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.hasVisibleChildren = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.hidden = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.hide = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.indeterminate = function() {};

/**
 * @return {Array<number>}
 */
InspireTree.TreeNode.prototype.indexList = function() {};

/**
 * @return {string}
 */
InspireTree.TreeNode.prototype.indexPath = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.isFirstRenderable = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.isLastRenderable = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.isOnlyRenderable = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.lastDeepestVisibleChild = function() {};

/**
 * @return {Promise<!InspireTree.TreeNodes>}
 */
InspireTree.TreeNode.prototype.loadChildren = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.loading = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.markDirty = function() {};

/**
 * @return {!InspireTree.TreeNodes}
 */
InspireTree.TreeNode.prototype.matched = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.nextVisibleAncestralSiblingNode = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.nextVisibleChildNode = function() {};

/**
 * @return {!InspireTree.TreeNode|undefined}
 */
InspireTree.TreeNode.prototype.nextVisibleNode = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.nextVisibleSiblingNode = function() {};

/**
 * @return {!InspireTree.Pagination}
 */
InspireTree.TreeNode.prototype.pagination = function() {};

/**
 * @return {!InspireTree.TreeNode|undefined}
 */
InspireTree.TreeNode.prototype.previousVisibleNode = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.previousVisibleSiblingNode = function() {};

/**
 * @param {!InspireTree.NodeIteratee} iteratee
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.recurseDown = function(iteratee) {};

/**
 * @param {!InspireTree.NodeIteratee} iteratee
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.recurseUp = function(iteratee) {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.refreshIndeterminateState = function() {};

/**
 * @return {Promise<!InspireTree.TreeNodes>}
 */
InspireTree.TreeNode.prototype.reload = function() {};

/**
 * @param {boolean=} includeState
 * @return {*}
 */
InspireTree.TreeNode.prototype.remove = function(includeState) {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.removed = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.renderable = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.rendered = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.restore = function() {};

/**
 * @param {boolean=} shallow
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.select = function(shallow) {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.selectable = function() {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.selected = function() {};

/**
 * @param {number|string} key
 * @param {*} val
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.set = function(key, val) {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.show = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.softRemove = function() {};

/**
 * @param {object|string} key
 * @param {boolean=} val
 * @return {boolean|object}
 */
InspireTree.TreeNode.prototype.state = function(key, val) {};

/**
 * @param {Array<string>} keys
 * @param {boolean} val
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.states = function(keys, val) {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.toggleCheck = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.toggleCollapse = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.toggleEditing = function() {};

/**
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.toggleSelect = function() {};

/**
 * @param {boolean=} excludeChildren
 * @param {boolean=} includeState
 * @return {*}
 */
InspireTree.TreeNode.prototype.toObject = function(excludeChildren, includeState) {};

/**
 * @return {string}
 */
InspireTree.TreeNode.prototype.toString = function() {};

/**
 * @return {!InspireTree}
 */
InspireTree.TreeNode.prototype.tree = function() {};

/**
 * @param {boolean=} shallow
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.uncheck = function(shallow) {};

/**
 * @param {!InspireTree.NodeConfig} node
 * @return {!InspireTree.TreeNode}
 */
InspireTree.TreeNode.prototype.unshiftChild = function(node) {};

/**
 * @return {boolean}
 */
InspireTree.TreeNode.prototype.visible = function() {};
/**
 * @typedef {function(!InspireTree.TreeNode, !InspireTree.TreeNode): boolean}
 */
InspireTreeDOM.DropTargetValidator;

/**
 * @typedef {{
 *   autoLoadMore: (boolean|undefined),
 *   deferredRendering: (boolean|undefined),
 *   dragAndDrop: ({enabled: (boolean|undefined), validateOn: (string|undefined), validate: !InspireTreeDOM.DropTargetValidator}|undefined),
 *   nodeHeight: (number|undefined),
 *   showCheckboxes: (boolean|undefined),
 *   dragTargets: (Array<string>|undefined),
 *   tabindex: (number|undefined),
 *   target: !HTMLElement
 * }}
 */
InspireTreeDOM.Config;

/**
 * @constructor
 */
InspireTreeDOM.InspireTreeDOM = function() {};

/**
 * @param {!InspireTree} tree
 * @param {!InspireTreeDOM.Config} opts
 */
InspireTreeDOM.InspireTreeDOM.prototype.constructor = function(tree, opts) {};