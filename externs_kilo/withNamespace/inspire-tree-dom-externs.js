/** @externs */

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
 * @param {!InspireTree.InspireTree} tree
 * @param {!InspireTreeDOM.Config} opts
 */
InspireTreeDOM.InspireTreeDOM.prototype.constructor = function(tree, opts) {};