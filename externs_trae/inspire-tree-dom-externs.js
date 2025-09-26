/**
 * @fileoverview Externs for Inspire Tree DOM library.
 * @externs
 */

/**
 * @typedef {function(TreeNode, TreeNode): boolean}
 */
var DropTargetValidator;

/**
 * @typedef {{
 *   autoLoadMore: (boolean|undefined),
 *   deferredRendering: (boolean|undefined),
 *   dragAndDrop: ({
 *     enabled: (boolean|undefined),
 *     validateOn: (string|undefined),
 *     validate: DropTargetValidator
 *   }|undefined),
 *   nodeHeight: (number|undefined),
 *   showCheckboxes: (boolean|undefined),
 *   dragTargets: (Array<string>|undefined),
 *   tabindex: (number|undefined),
 *   target: HTMLElement
 * }}
 */
var InspireTreeDOMConfig;

/**
 * @constructor
 * @param {InspireTree} tree
 * @param {InspireTreeDOMConfig} opts
 */
function InspireTreeDOM(tree, opts) {}

/**
 * @type {InspireTreeDOM}
 */
var InspireTreeDOMDefault;