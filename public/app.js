(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/kevin/Dropbox/projects/cms/node_modules/mithril/mithril.js":[function(require,module,exports){
var m = (function app(window, undefined) {
	var OBJECT = "[object Object]", ARRAY = "[object Array]", STRING = "[object String]", FUNCTION = "function";
	var type = {}.toString;
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
	var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame;

	// self invoking function needed because of the way mocks work
	function initialize(window){
		$document = window.document;
		$location = window.location;
		$cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;
		$requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
	}

	initialize(window);


	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array, or splat (optional)
	 *
	 */
	function m() {
		var args = [].slice.call(arguments);
		var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !("tag" in args[1]) && !("subtree" in args[1]);
		var attrs = hasAttrs ? args[1] : {};
		var classAttrName = "class" in attrs ? "class" : "className";
		var cell = {tag: "div", attrs: {}};
		var match, classes = [];
		if (type.call(args[0]) != STRING) throw new Error("selector in m(selector, attrs, children) should be a string")
		while (match = parser.exec(args[0])) {
			if (match[1] === "" && match[2]) cell.tag = match[2];
			else if (match[1] === "#") cell.attrs.id = match[2];
			else if (match[1] === ".") classes.push(match[2]);
			else if (match[3][0] === "[") {
				var pair = attrParser.exec(match[3]);
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
			}
		}
		if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ");


		var children = hasAttrs ? args[2] : args[1];
		if (type.call(children) === ARRAY) {
			cell.children = children
		}
		else {
			cell.children = hasAttrs ? args.slice(2) : args.slice(1)
		}

		for (var attrName in attrs) {
			if (attrName === classAttrName) {
				if (attrs[attrName] !== "") cell.attrs[attrName] = (cell.attrs[attrName] || "") + " " + attrs[attrName];
			}
			else cell.attrs[attrName] = attrs[attrName]
		}
		return cell
	}
	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
		//3 - recursively apply this algorithm for every array and for the children of every virtual element

		//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being diffed
		//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
		//`configs` is a list of config functions to run after the topmost `build` call finishes running

		//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
		//- it simplifies diffing code
		//data.toString() is null if data is the return value of Console.log in Firefox
		if (data == null || data.toString() == null) data = "";
		if (data.subtree === "retain") return cached;
		var cachedType = type.call(cached), dataType = type.call(data);
		if (cached == null || cachedType !== dataType) {
			if (cached != null) {
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex;
					var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
				}
				else if (cached.nodes) clear(cached.nodes, cached)
			}
			cached = new data.constructor;
			if (cached.tag) cached = {}; //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
			cached.nodes = []
		}

		if (dataType === ARRAY) {
			//recursively flatten array
			for (var i = 0, len = data.length; i < len; i++) {
				if (type.call(data[i]) === ARRAY) {
					data = data.concat.apply([], data);
					i-- //check current index again and flatten until there are no more nested arrays at that index
				}
			}
			
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0;

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			//5) copy unkeyed items into their respective gaps
			var DELETION = 1, INSERTION = 2 , MOVE = 3;
			var existing = {}, unkeyed = [], shouldMaintainIdentities = false;
			for (var i = 0; i < cached.length; i++) {
				if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
					shouldMaintainIdentities = true;
					existing[cached[i].attrs.key] = {action: DELETION, index: i}
				}
			}
			if (shouldMaintainIdentities) {
				if (data.indexOf(null) > -1) data = data.filter(function(x) {return x != null})
				
				var keysDiffer = false
				if (data.length != cached.length) keysDiffer = true
				else for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
					if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
						keysDiffer = true
						break
					}
				}
				
				if (keysDiffer) {
					for (var i = 0, len = data.length; i < len; i++) {
						if (data[i] && data[i].attrs) {
							if (data[i].attrs.key != null) {
								var key = data[i].attrs.key;
								if (!existing[key]) existing[key] = {action: INSERTION, index: i};
								else existing[key] = {
									action: MOVE,
									index: i,
									from: existing[key].index,
									element: cached.nodes[existing[key].index] || $document.createElement("div")
								}
							}
							else unkeyed.push({index: i, element: parentElement.childNodes[i] || $document.createElement("div")})
						}
					}
					var actions = []
					for (var prop in existing) actions.push(existing[prop])
					var changes = actions.sort(sortChanges);
					var newCached = new Array(cached.length)

					for (var i = 0, change; change = changes[i]; i++) {
						if (change.action === DELETION) {
							clear(cached[change.index].nodes, cached[change.index]);
							newCached.splice(change.index, 1)
						}
						if (change.action === INSERTION) {
							var dummy = $document.createElement("div");
							dummy.key = data[change.index].attrs.key;
							parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
							newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
						}

						if (change.action === MOVE) {
							if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
								parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null)
							}
							newCached[change.index] = cached[change.from]
						}
					}
					for (var i = 0, len = unkeyed.length; i < len; i++) {
						var change = unkeyed[i];
						parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null);
						newCached[change.index] = cached[change.index]
					}
					cached = newCached;
					cached.nodes = new Array(parentElement.childNodes.length);
					for (var i = 0, child; child = parentElement.childNodes[i]; i++) cached.nodes[i] = child
				}
			}
			//end key algorithm

			for (var i = 0, cacheCount = 0, len = data.length; i < len; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
				if (item === undefined) continue;
				if (!item.nodes.intact) intact = false;
				if (item.$trusted) {
					//fix offset of next element if item was a trusted string w/ more than one html element
					//the first clause in the regexp matches elements
					//the second clause (after the pipe) matches text nodes
					subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || []).length
				}
				else subArrayCount += type.call(item) === ARRAY ? item.length : 1;
				cached[cacheCount++] = item
			}
			if (!intact) {
				//diff the array itself
				
				//update the list of DOM nodes by collecting the nodes from each item
				for (var i = 0, len = data.length; i < len; i++) {
					if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
				}
				//remove items from the end of the array if the new array is shorter than the old one
				//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
				for (var i = 0, node; node = cached.nodes[i]; i++) {
					if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
				}
				if (data.length < cached.length) cached.length = data.length;
				cached.nodes = nodes
			}
		}
		else if (data != null && dataType === OBJECT) {
			if (!data.attrs) data.attrs = {};
			if (!cached.attrs) cached.attrs = {};

			var dataAttrKeys = Object.keys(data.attrs)
			var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)
			//if an element is different enough from the one in cache, recreate it
			if (data.tag != cached.tag || dataAttrKeys.join() != Object.keys(cached.attrs).join() || data.attrs.id != cached.attrs.id) {
				if (cached.nodes.length) clear(cached.nodes);
				if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload()
			}
			if (type.call(data.tag) != STRING) return;

			var node, isNew = cached.nodes.length === 0;
			if (data.attrs.xmlns) namespace = data.attrs.xmlns;
			else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg";
			else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML";
			if (isNew) {
				if (data.attrs.is) node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
				else node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
				cached = {
					tag: data.tag,
					//set attributes first, then create children
					attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
					children: data.children != null && data.children.length > 0 ?
						build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) :
						data.children,
					nodes: [node]
				};
				if (cached.children && !cached.children.nodes) cached.children.nodes = [];
				//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
				if (data.tag === "select" && data.attrs.value) setAttributes(node, data.tag, {value: data.attrs.value}, {}, namespace);
				parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			else {
				node = cached.nodes[0];
				if (hasKeys) setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
				cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
				cached.nodes.intact = true;
				if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			//schedule configs to be called. They are called after `build` finishes running
			if (typeof data.attrs["config"] === FUNCTION) {
				var context = cached.configContext = cached.configContext || {};

				// bind
				var callback = function(data, args) {
					return function() {
						return data.attrs["config"].apply(data, args)
					}
				};
				configs.push(callback(data, [node, !isNew, context, cached]))
			}
		}
		else if (typeof dataType != FUNCTION) {
			//handle text nodes
			var nodes;
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					nodes = injectHTML(parentElement, index, data)
				}
				else {
					nodes = [$document.createTextNode(data)];
					if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data;
				cached.nodes = nodes
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
				nodes = cached.nodes;
				if (!editable || editable !== $document.activeElement) {
					if (data.$trusted) {
						clear(nodes, cached);
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
						//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
						if (parentTag === "textarea") parentElement.value = data;
						else if (editable) editable.innerHTML = data;
						else {
							if (nodes[0].nodeType === 1 || nodes.length > 1) { //was a trusted string
								clear(cached.nodes, cached);
								nodes = [$document.createTextNode(data)]
							}
							parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
							nodes[0].nodeValue = data
						}
					}
				}
				cached = new data.constructor(data);
				cached.nodes = nodes
			}
			else cached.nodes.intact = true
		}

		return cached
	}
	function sortChanges(a, b) {return a.action - b.action || a.index - b.index}
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName];
			var cachedAttr = cachedAttrs[attrName];
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr)) {
				cachedAttrs[attrName] = dataAttr;
				try {
					//`config` isn't a real attributes, so ignore it
					if (attrName === "config" || attrName == "key") continue;
					//hook event handlers to the auto-redrawing system
					else if (typeof dataAttr === FUNCTION && attrName.indexOf("on") === 0) {
						node[attrName] = autoredraw(dataAttr, node)
					}
					//handle `style: {...}`
					else if (attrName === "style" && dataAttr != null && type.call(dataAttr) === OBJECT) {
						for (var rule in dataAttr) {
							if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
						}
						for (var rule in cachedAttr) {
							if (!(rule in dataAttr)) node.style[rule] = ""
						}
					}
					//handle SVG
					else if (namespace != null) {
						if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr);
						else if (attrName === "className") node.setAttribute("class", dataAttr);
						else node.setAttribute(attrName, dataAttr)
					}
					//handle cases that are properties (but ignore cases where we should use setAttribute instead)
					//- list and form are typically used as strings, but are DOM element references in js
					//- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
					else if (attrName in node && !(attrName === "list" || attrName === "style" || attrName === "form" || attrName === "type")) {
						//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
						if (tag !== "input" || node[attrName] !== dataAttr) node[attrName] = dataAttr
					}
					else node.setAttribute(attrName, dataAttr)
				}
				catch (e) {
					//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
					if (e.message.indexOf("Invalid argument") < 0) throw e
				}
			}
			//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
			else if (attrName === "value" && tag === "input" && node.value != dataAttr) {
				node.value = dataAttr
			}
		}
		return cachedAttrs
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {nodes[i].parentNode.removeChild(nodes[i])}
				catch (e) {} //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
				cached = [].concat(cached);
				if (cached[i]) unload(cached[i])
			}
		}
		if (nodes.length != 0) nodes.length = 0
	}
	function unload(cached) {
		if (cached.configContext && typeof cached.configContext.onunload === FUNCTION) cached.configContext.onunload();
		if (cached.children) {
			if (type.call(cached.children) === ARRAY) {
				for (var i = 0, child; child = cached.children[i]; i++) unload(child)
			}
			else if (cached.children.tag) unload(cached.children)
		}
	}
	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index];
		if (nextSibling) {
			var isElement = nextSibling.nodeType != 1;
			var placeholder = $document.createElement("span");
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null);
				placeholder.insertAdjacentHTML("beforebegin", data);
				parentElement.removeChild(placeholder)
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data)
		}
		else parentElement.insertAdjacentHTML("beforeend", data);
		var nodes = [];
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index]);
			index++
		}
		return nodes
	}
	function autoredraw(callback, object) {
		return function(e) {
			e = e || event;
			m.redraw.strategy("diff");
			m.startComputation();
			try {return callback.call(object, e)}
			finally {
				endFirstComputation()
			}
		}
	}

	var html;
	var documentNode = {
		appendChild: function(node) {
			if (html === undefined) html = $document.createElement("html");
			if ($document.documentElement && $document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			}
			else $document.appendChild(node);
			this.childNodes = $document.childNodes
		},
		insertBefore: function(node) {
			this.appendChild(node)
		},
		childNodes: []
	};
	var nodeCache = [], cellCache = {};
	m.render = function(root, cell, forceRecreation) {
		var configs = [];
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var id = getCellCacheKey(root);
		var isDocumentRoot = root === $document;
		var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
		if (isDocumentRoot && cell.tag != "html") cell = {tag: "html", attrs: {}, children: cell};
		if (cellCache[id] === undefined) clear(node.childNodes);
		if (forceRecreation === true) reset(root);
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
		for (var i = 0, len = configs.length; i < len; i++) configs[i]()
	};
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element);
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function(value) {
		value = new String(value);
		value.$trusted = true;
		return value
	};

	function gettersetter(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0];
			return store
		};

		prop.toJSON = function() {
			return store
		};

		return prop
	}

	m.prop = function (store) {
		//note: using non-strict equality check here because we're checking if store is null OR undefined
		if (((store != null && type.call(store) === OBJECT) || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
			return propify(store)
		}

		return gettersetter(store)
	};

	var roots = [], modules = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePostRedrawHook = null, prevented = false, topModule;
	var FRAME_BUDGET = 16; //60 frames per second = 1 call per 16 ms
	m.module = function(root, module) {
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.");
		var index = roots.indexOf(root);
		if (index < 0) index = roots.length;
		var isPrevented = false;
		if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
			var event = {
				preventDefault: function() {isPrevented = true}
			};
			controllers[index].onunload(event)
		}
		if (!isPrevented) {
			m.redraw.strategy("all");
			m.startComputation();
			roots[index] = root;
			var currentModule = topModule = module = module || {};
			var controller = new (module.controller || function() {});
			//controllers may call m.module recursively (via m.route redirects, for example)
			//this conditional ensures only the last recursive m.module call is applied
			if (currentModule === topModule) {
				controllers[index] = controller;
				modules[index] = module
			}
			endFirstComputation();
			return controllers[index]
		}
	};
	m.redraw = function(force) {
		//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
		//lastRedrawID is null if it's the first redraw and not an event handler
		if (lastRedrawId && force !== true) {
			//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
			//when rAF: always reschedule redraw
			if (new Date - lastRedrawCallTime > FRAME_BUDGET || $requestAnimationFrame === window.requestAnimationFrame) {
				if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId);
				lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
			}
		}
		else {
			redraw();
			lastRedrawId = $requestAnimationFrame(function() {lastRedrawId = null}, FRAME_BUDGET)
		}
	};
	m.redraw.strategy = m.prop();
	var blank = function() {return ""}
	function redraw() {
		var forceRedraw = m.redraw.strategy() === "all";
		for (var i = 0, root; root = roots[i]; i++) {
			if (controllers[i]) {
				m.render(root, modules[i].view ? modules[i].view(controllers[i]) : blank(), forceRedraw)
			}
		}
		//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook();
			computePostRedrawHook = null
		}
		lastRedrawId = null;
		lastRedrawCallTime = new Date;
		m.redraw.strategy("diff")
	}

	var pendingRequests = 0;
	m.startComputation = function() {pendingRequests++};
	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0);
		if (pendingRequests === 0) m.redraw()
	};
	var endFirstComputation = function() {
		if (m.redraw.strategy() == "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		}
		else m.endComputation();
	}

	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {
			e = e || event;
			var currentTarget = e.currentTarget || this;
			withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
		}
	};

	//routing
	var modes = {pathname: "", hash: "#", search: "?"};
	var redirect = function() {}, routeParams, currentRoute;
	m.route = function() {
		//m.route()
		if (arguments.length === 0) return currentRoute;
		//m.route(el, defaultRoute, routes)
		else if (arguments.length === 3 && type.call(arguments[1]) === STRING) {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source);
				if (!routeByValue(root, router, path)) {
					m.route(defaultRoute, true)
				}
			};
			var listener = m.route.mode === "hash" ? "onhashchange" : "onpopstate";
			window[listener] = function() {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute != normalizeRoute(path)) {
					redirect(path)
				}
			};
			computePostRedrawHook = setScroll;
			window[listener]()
		}
		//config: m.route
		else if (arguments[0].addEventListener) {
			var element = arguments[0];
			var isInitialized = arguments[1];
			var context = arguments[2];
			element.href = (m.route.mode !== 'pathname' ? $location.pathname : '') + modes[m.route.mode] + this.attrs.href;
			element.removeEventListener("click", routeUnobtrusive);
			element.addEventListener("click", routeUnobtrusive)
		}
		//m.route(route, params)
		else if (type.call(arguments[0]) === STRING) {
			var oldRoute = currentRoute;
			currentRoute = arguments[0];
			var args = arguments[1] || {}
			var queryIndex = currentRoute.indexOf("?")
			var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {}
			for (var i in args) params[i] = args[i]
			var querystring = buildQueryString(params)
			var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute
			if (querystring) currentRoute = currentPath + (currentPath.indexOf("?") === -1 ? "?" : "&") + querystring;

			var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];

			if (window.history.pushState) {
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, $document.title, modes[m.route.mode] + currentRoute);
					setScroll()
				};
				redirect(modes[m.route.mode] + currentRoute)
			}
			else $location[m.route.mode] = currentRoute
		}
	};
	m.route.param = function(key) {
		if (!routeParams) throw new Error("You must call m.route(element, defaultRoute, routes) before calling m.route.param()")
		return routeParams[key]
	};
	m.route.mode = "search";
	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}
	function routeByValue(root, router, path) {
		routeParams = {};

		var queryStart = path.indexOf("?");
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
			path = path.substr(0, queryStart)
		}

		for (var route in router) {
			if (route === path) {
				m.module(root, router[route]);
				return true
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$");

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || [];
					var values = [].slice.call(arguments, 1, -2);
					for (var i = 0, len = keys.length; i < len; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
					m.module(root, router[route])
				});
				return true
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || event;
		if (e.ctrlKey || e.metaKey || e.which === 2) return;
		if (e.preventDefault) e.preventDefault();
		else e.returnValue = false;
		var currentTarget = e.currentTarget || this;
		var args = m.route.mode === "pathname" && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
		m.route(currentTarget[m.route.mode].slice(modes[m.route.mode].length), args)
	}
	function setScroll() {
		if (m.route.mode != "hash" && $location.hash) $location.hash = $location.hash;
		else window.scrollTo(0, 0)
	}
	function buildQueryString(object, prefix) {
		var str = [];
		for(var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop, value = object[prop];
			var valueType = type.call(value)
			var pair = value != null && (valueType === OBJECT) ?
				buildQueryString(value, key) :
				valueType === ARRAY ?
					value.map(function(item) {return encodeURIComponent(key + "[]") + "=" + encodeURIComponent(item)}).join("&") :
					encodeURIComponent(key) + "=" + encodeURIComponent(value)
			str.push(pair)
		}
		return str.join("&")
	}
	
	function parseQueryString(str) {
		var pairs = str.split("&"), params = {};
		for (var i = 0, len = pairs.length; i < len; i++) {
			var pair = pairs[i].split("=");
			params[decodeURIComponent(pair[0])] = pair[1] ? decodeURIComponent(pair[1]) : ""
		}
		return params
	}
	function reset(root) {
		var cacheKey = getCellCacheKey(root);
		clear(root.childNodes, cellCache[cacheKey]);
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred();
		deferred.promise = propify(deferred.promise);
		return deferred
	};
	function propify(promise) {
		var prop = m.prop();
		promise.then(prop);
		prop.then = function(resolve, reject) {
			return propify(promise.then(resolve, reject))
		};
		return prop
	}
	//Promiz.mithril.js | Zolmeister | MIT
	//a modified version of Promiz.js, which does not conform to Promises/A+ for two reasons:
	//1) `then` callbacks are called synchronously (because setTimeout is too slow, and the setImmediate polyfill is too big
	//2) throwing subclasses of Error cause the error to be bubbled up instead of triggering rejection (because the spec does not account for the important use case of default browser error handling, i.e. message w/ line number)
	function Deferred(successCallback, failureCallback) {
		var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
		var self = this, state = 0, promiseValue = 0, next = [];

		self["promise"] = {};

		self["resolve"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = RESOLVING;

				fire()
			}
			return this
		};

		self["reject"] = function(value) {
			if (!state) {
				promiseValue = value;
				state = REJECTING;

				fire()
			}
			return this
		};

		self.promise["then"] = function(successCallback, failureCallback) {
			var deferred = new Deferred(successCallback, failureCallback);
			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			}
			else if (state === REJECTED) {
				deferred.reject(promiseValue)
			}
			else {
				next.push(deferred)
			}
			return deferred.promise
		};

		function finish(type) {
			state = type || REJECTED;
			next.map(function(deferred) {
				state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue)
			})
		}

		function thennable(then, successCallback, failureCallback, notThennableCallback) {
			if (((promiseValue != null && type.call(promiseValue) === OBJECT) || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0;
					then.call(promiseValue, function(value) {
						if (count++) return;
						promiseValue = value;
						successCallback()
					}, function (value) {
						if (count++) return;
						promiseValue = value;
						failureCallback()
					})
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					failureCallback()
				}
			} else {
				notThennableCallback()
			}
		}

		function fire() {
			// check if it's a thenable
			var then;
			try {
				then = promiseValue && promiseValue.then
			}
			catch (e) {
				m.deferred.onerror(e);
				promiseValue = e;
				state = REJECTING;
				return fire()
			}
			thennable(then, function() {
				state = RESOLVING;
				fire()
			}, function() {
				state = REJECTING;
				fire()
			}, function() {
				try {
					if (state === RESOLVING && typeof successCallback === FUNCTION) {
						promiseValue = successCallback(promiseValue)
					}
					else if (state === REJECTING && typeof failureCallback === "function") {
						promiseValue = failureCallback(promiseValue);
						state = RESOLVING
					}
				}
				catch (e) {
					m.deferred.onerror(e);
					promiseValue = e;
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError();
					finish()
				}
				else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}
	m.deferred.onerror = function(e) {
		if (type.call(e) === "[object Error]" && !e.constructor.toString().match(/ Error/)) throw e
	};

	m.sync = function(args) {
		var method = "resolve";
		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value;
				if (!resolved) method = "reject";
				if (--outstanding === 0) {
					deferred.promise(results);
					deferred[method](results)
				}
				return value
			}
		}

		var deferred = m.deferred();
		var outstanding = args.length;
		var results = new Array(outstanding);
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				args[i].then(synchronizer(i, true), synchronizer(i, false))
			}
		}
		else deferred.resolve([]);

		return deferred.promise
	};
	function identity(value) {return value}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			var callbackKey = "mithril_callback_" + new Date().getTime() + "_" + (Math.round(Math.random() * 1e16)).toString(36);
			var script = $document.createElement("script");

			window[callbackKey] = function(resp) {
				script.parentNode.removeChild(script);
				options.onload({
					type: "load",
					target: {
						responseText: resp
					}
				});
				window[callbackKey] = undefined
			};

			script.onerror = function(e) {
				script.parentNode.removeChild(script);

				options.onerror({
					type: "error",
					target: {
						status: 500,
						responseText: JSON.stringify({error: "Error making jsonp request"})
					}
				});
				window[callbackKey] = undefined;

				return false
			};

			script.onload = function(e) {
				return false
			};

			script.src = options.url
				+ (options.url.indexOf("?") > 0 ? "&" : "?")
				+ (options.callbackKey ? options.callbackKey : "callback")
				+ "=" + callbackKey
				+ "&" + buildQueryString(options.data || {});
			$document.body.appendChild(script)
		}
		else {
			var xhr = new window.XMLHttpRequest;
			xhr.open(options.method, options.url, true, options.user, options.password);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr});
					else options.onerror({type: "error", target: xhr})
				}
			};
			if (options.serialize === JSON.stringify && options.data && options.method !== "GET") {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (options.deserialize === JSON.parse) {
				xhr.setRequestHeader("Accept", "application/json, text/*");
			}
			if (typeof options.config === FUNCTION) {
				var maybeXhr = options.config(xhr, options);
				if (maybeXhr != null) xhr = maybeXhr
			}

			var data = options.method === "GET" || !options.data ? "" : options.data
			if (data && (type.call(data) != STRING && data.constructor != window.FormData)) {
				throw "Request data should be either be a string or FormData. Check the `serialize` option in `m.request`";
			}
			xhr.send(data);
			return xhr
		}
	}
	function bindData(xhrOptions, data, serialize) {
		if (xhrOptions.method === "GET" && xhrOptions.dataType != "jsonp") {
			var prefix = xhrOptions.url.indexOf("?") < 0 ? "?" : "&";
			var querystring = buildQueryString(data);
			xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : "")
		}
		else xhrOptions.data = serialize(data);
		return xhrOptions
	}
	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi);
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1);
				url = url.replace(tokens[i], data[key]);
				delete data[key]
			}
		}
		return url
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation();
		var deferred = m.deferred();
		var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === "jsonp";
		var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
		var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
		var extract = xhrOptions.extract || function(xhr) {
			return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
		};
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || event;
				var unwrap = (e.type === "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
				var response = unwrap(deserialize(extract(e.target, xhrOptions)));
				if (e.type === "load") {
					if (type.call(response) === ARRAY && xhrOptions.type) {
						for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
					}
					else if (xhrOptions.type) response = new xhrOptions.type(response)
				}
				deferred[e.type === "load" ? "resolve" : "reject"](response)
			}
			catch (e) {
				m.deferred.onerror(e);
				deferred.reject(e)
			}
			if (xhrOptions.background !== true) m.endComputation()
		};
		ajax(xhrOptions);
		deferred.promise(xhrOptions.initialValue);
		return deferred.promise
	};

	//testing API
	m.deps = function(mock) {
		initialize(window = mock || window);
		return window;
	};
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app;

	return m
})(typeof window != "undefined" ? window : {});

if (typeof module != "undefined" && module !== null && module.exports) module.exports = m;
else if (typeof define === "function" && define.amd) define(function() {return m});

},{}],"/Users/kevin/Dropbox/projects/cms/src/fields/markdown.js":[function(require,module,exports){
var m = require('mithril')

module.exports = function (config) {
	var vm = {
		value: m.prop(''),
		clear: function () {
			vm.value('')
		},
		toJSON: function () {
			return vm.value()
		},
		populate: function (data) {
			vm.value(data)
		}
	}
	var view = function () {
		return [
			m('div.form-group', [
				m('label.control-label.col-sm-2', config.label),
				m('div.col-sm-8', [
					m('textarea.form-control[rows=12]', { oninput: m.withAttr('value', vm.value), required: config.required }, vm.value())
				])
			])
		]
	}
	return { vm: vm, view: view, config: config, toJSON: vm.toJSON }
}

},{"mithril":"/Users/kevin/Dropbox/projects/cms/node_modules/mithril/mithril.js"}],"/Users/kevin/Dropbox/projects/cms/src/fields/text.js":[function(require,module,exports){
var m = require('mithril')

module.exports = function (config) {
	var vm = {
		value: m.prop(''),
		clear: function () {
			vm.value('')
		},
		toJSON: function () {
			return vm.value()
		},
		populate: function (data) {
			vm.value(data)
		}
	}
	var view = function () {
		return [
			m('div.form-group', [
				m('label.control-label.col-sm-2', config.label),
				m('div.col-sm-6', [
					m('input.form-control', { type: config.type, value: vm.value(), oninput: m.withAttr('value', vm.value), required: config.required })
				])
			])
		]
	}
	return { vm: vm, view: view, config: config, toJSON: vm.toJSON }
}

},{"mithril":"/Users/kevin/Dropbox/projects/cms/node_modules/mithril/mithril.js"}],"/Users/kevin/Dropbox/projects/cms/src/fixtures/posts.json":[function(require,module,exports){
module.exports=[{
  "id": "70ef0853-bdbe-421b-a3ad-cb6b87f100b0",
  "title": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
  "summary": "Nunc rhoncus dui vel sem.",
  "body": "Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.\n\nVestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
  "created_at": "2015-04-03T22:25:50Z",
  "updated_at": "2015-04-04T16:40:10Z"
}, {
  "id": "8c8b1ac5-fc41-47e3-be70-30090f124495",
  "title": "Maecenas rhoncus aliquam lacus.",
  "summary": "Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo.",
  "body": "Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.",
  "created_at": "2015-04-03T08:21:29Z",
  "updated_at": "2015-04-04T08:47:17Z"
}, {
  "id": "cf56bc19-2afa-4871-a2ff-0cd92c361a50",
  "title": "Morbi ut odio.",
  "summary": "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue.",
  "body": "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius.\n\nInteger ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.\n\nNam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus.",
  "created_at": "2015-04-03T01:06:56Z",
  "updated_at": "2015-04-04T08:51:37Z"
}, {
  "id": "69693539-0a68-4782-9058-ce30e29006df",
  "title": "Duis aliquam convallis nunc.",
  "summary": "Phasellus in felis. Donec semper sapien a libero. Nam dui.",
  "body": "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.\n\nFusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
  "created_at": "2015-04-03T22:50:23Z"
}, {
  "id": "fe889683-d4fb-4f9c-a4e6-408c5f71f7a4",
  "title": "Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci.",
  "summary": "Proin risus. Praesent lectus. Vestibulum quam sapien, varius ut, blandit non, interdum in, ante.",
  "body": "Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.\n\nFusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
  "created_at": "2015-04-03T03:42:01Z",
  "updated_at": "2015-04-04T23:42:14Z"
}]

},{}],"/Users/kevin/Dropbox/projects/cms/src/index.js":[function(require,module,exports){
var m = require('mithril')


var app = {}
app.controller = function () {
	app.vm.init()
}

app.vm = {
	entries: m.prop([]),
	active: m.prop(),
	save: function (event) {
		event.preventDefault()

		var active = app.vm.active()
		var data = app.vm.toJSON()

		if (active == null) {
			// new entry
			data.created_at = (new Date()).toISOString()
			app.vm.entries().push(data)
		}
		else {
			// update existing entry
			var entry = app.vm.entries()[active]
			Object.keys(data).forEach(function (key) {
				if (entry[key] !== data[key]) {
					entry[key] = data[key]
					entry.updated_at = (new Date()).toISOString()
				}
			})
		}

		app.vm.clear()
	},
	edit: function (i, event) {
		event.preventDefault()
		var data = app.vm.entries()[i]
		app.vm.fields.forEach(function (field) {
			field.vm.populate(data[field.config.property])
		})
		app.vm.active(i)
		m.redraw()
	},
	remove: function (i, event) {
		event.preventDefault()
		app.vm.entries().splice(i, 1)
	},
	clear: function () {
		app.vm.fields.forEach(function (field) {
			field.vm.clear()
		})
		app.vm.active(null)
	},
	toJSON: function () {
		var data = {}
		app.vm.fields.forEach(function (field) {
			data[field.config.property] = field.toJSON()
		})
		return data
	},
	init: function () {
		var Post = require('./models/post')

		var TextField = require('./fields/text')
		var MarkdownField = require('./fields/markdown')

		this.label = Post.label
		this.fields = Post.fields.map(function (field) {
			switch (field.type) {
				case 'text':
				case 'email':
					return new TextField(field)
				case 'markdown':
					return new MarkdownField(field)
			}
		})

		this.entries(require('./fixtures/posts'))
	}
}

app.view = function () {
	var vm = app.vm

	var listedFields = vm.fields.filter(function (field) {
		return field.config.listed
	})

	return m('.container', [
		m('div.page-header', [
			m('h1', vm.label + 's')
		]),
		(vm.entries().length ? m('table.table.table-striped.table-hover', [
			m('thead', [
				m('tr', [
					listedFields.map(function (field) {
						return m('th', field.config.label)
					}),
					m('th[colspan="2"]')
				])
			]),
			m('tbody', [
				vm.entries().map(function (post, i) {
					return m('tr', { class: vm.active() === i ? 'warning' : null }, [
						listedFields.map(function (field) {
							return m('td', post[field.config.property])
						}),
						m('td', [
							m('a[href="#"]', { onclick: vm.edit.bind(this, i) }, [
								m('i.glyphicon.glyphicon-edit')
							])
						]),
						m('td', [
							m('a[href="#"]', { onclick: vm.remove.bind(this, i) }, [
								m('i.glyphicon.glyphicon-trash')
							])
						])
					])
				})
			])
		]) : null),
		m('div.well', [
			m('form.form-horizontal', { onsubmit: vm.save }, [
				m('fieldset', [
					m('legend', [
						vm.active() != null
							? m('button.btn.btn-xs.btn-danger.pull-right', { type: 'button', onclick: vm.clear }, 'Cancel')
							: null,
						vm.active() != null
							? ('Editing ' + vm.label.toLowerCase() + ' #' + (vm.active() + 1))
							: ('New ' + vm.label.toLowerCase())
					]),
					vm.fields.map(function (field) {
						return field && field.view && field.view()
					}),
					m('div.form-group', [
						m('div.col-sm-offset-2.col-sm-2', [
							m('button.btn.btn-success.btn-lg', { type: 'submit' }, 'Save')
						])
					])
				])
			])
		]),
		m('pre', JSON.stringify(vm.entries(), null, '  '))
	])
}


m.module(document.body, app)

},{"./fields/markdown":"/Users/kevin/Dropbox/projects/cms/src/fields/markdown.js","./fields/text":"/Users/kevin/Dropbox/projects/cms/src/fields/text.js","./fixtures/posts":"/Users/kevin/Dropbox/projects/cms/src/fixtures/posts.json","./models/post":"/Users/kevin/Dropbox/projects/cms/src/models/post.js","mithril":"/Users/kevin/Dropbox/projects/cms/node_modules/mithril/mithril.js"}],"/Users/kevin/Dropbox/projects/cms/src/models/post.js":[function(require,module,exports){
module.exports = {
	label: 'Blog post',
	property: 'posts',
	type: 'collection',
	fields: [
		{
			label: 'Title',
			property: 'title',
			type: 'text',
			required: true,
			listed: true
		},
		{
			label: 'Summary',
			property: 'summary',
			type: 'text',
			required: true,
			listed: true
		},
		{
			label: 'Post body',
			property: 'body',
			type: 'markdown',
			required: true
		}
	]
}

},{}]},{},["/Users/kevin/Dropbox/projects/cms/src/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbWl0aHJpbC9taXRocmlsLmpzIiwic3JjL2ZpZWxkcy9tYXJrZG93bi5qcyIsInNyYy9maWVsZHMvdGV4dC5qcyIsInNyYy9maXh0dXJlcy9wb3N0cy5qc29uIiwic3JjL2luZGV4LmpzIiwic3JjL21vZGVscy9wb3N0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoZ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG0gPSAoZnVuY3Rpb24gYXBwKHdpbmRvdywgdW5kZWZpbmVkKSB7XHJcblx0dmFyIE9CSkVDVCA9IFwiW29iamVjdCBPYmplY3RdXCIsIEFSUkFZID0gXCJbb2JqZWN0IEFycmF5XVwiLCBTVFJJTkcgPSBcIltvYmplY3QgU3RyaW5nXVwiLCBGVU5DVElPTiA9IFwiZnVuY3Rpb25cIjtcclxuXHR2YXIgdHlwZSA9IHt9LnRvU3RyaW5nO1xyXG5cdHZhciBwYXJzZXIgPSAvKD86KF58I3xcXC4pKFteI1xcLlxcW1xcXV0rKSl8KFxcWy4rP1xcXSkvZywgYXR0clBhcnNlciA9IC9cXFsoLis/KSg/Oj0oXCJ8J3wpKC4qPylcXDIpP1xcXS87XHJcblx0dmFyIHZvaWRFbGVtZW50cyA9IC9eKEFSRUF8QkFTRXxCUnxDT0x8Q09NTUFORHxFTUJFRHxIUnxJTUd8SU5QVVR8S0VZR0VOfExJTkt8TUVUQXxQQVJBTXxTT1VSQ0V8VFJBQ0t8V0JSKSQvO1xyXG5cclxuXHQvLyBjYWNoaW5nIGNvbW1vbmx5IHVzZWQgdmFyaWFibGVzXHJcblx0dmFyICRkb2N1bWVudCwgJGxvY2F0aW9uLCAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAkY2FuY2VsQW5pbWF0aW9uRnJhbWU7XHJcblxyXG5cdC8vIHNlbGYgaW52b2tpbmcgZnVuY3Rpb24gbmVlZGVkIGJlY2F1c2Ugb2YgdGhlIHdheSBtb2NrcyB3b3JrXHJcblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZSh3aW5kb3cpe1xyXG5cdFx0JGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xyXG5cdFx0JGxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xyXG5cdFx0JGNhbmNlbEFuaW1hdGlvbkZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5jbGVhclRpbWVvdXQ7XHJcblx0XHQkcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cuc2V0VGltZW91dDtcclxuXHR9XHJcblxyXG5cdGluaXRpYWxpemUod2luZG93KTtcclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEB0eXBlZGVmIHtTdHJpbmd9IFRhZ1xyXG5cdCAqIEEgc3RyaW5nIHRoYXQgbG9va3MgbGlrZSAtPiBkaXYuY2xhc3NuYW1lI2lkW3BhcmFtPW9uZV1bcGFyYW0yPXR3b11cclxuXHQgKiBXaGljaCBkZXNjcmliZXMgYSBET00gbm9kZVxyXG5cdCAqL1xyXG5cclxuXHQvKipcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7VGFnfSBUaGUgRE9NIG5vZGUgdGFnXHJcblx0ICogQHBhcmFtIHtPYmplY3Q9W119IG9wdGlvbmFsIGtleS12YWx1ZSBwYWlycyB0byBiZSBtYXBwZWQgdG8gRE9NIGF0dHJzXHJcblx0ICogQHBhcmFtIHsuLi5tTm9kZT1bXX0gWmVybyBvciBtb3JlIE1pdGhyaWwgY2hpbGQgbm9kZXMuIENhbiBiZSBhbiBhcnJheSwgb3Igc3BsYXQgKG9wdGlvbmFsKVxyXG5cdCAqXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gbSgpIHtcclxuXHRcdHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpO1xyXG5cdFx0dmFyIGhhc0F0dHJzID0gYXJnc1sxXSAhPSBudWxsICYmIHR5cGUuY2FsbChhcmdzWzFdKSA9PT0gT0JKRUNUICYmICEoXCJ0YWdcIiBpbiBhcmdzWzFdKSAmJiAhKFwic3VidHJlZVwiIGluIGFyZ3NbMV0pO1xyXG5cdFx0dmFyIGF0dHJzID0gaGFzQXR0cnMgPyBhcmdzWzFdIDoge307XHJcblx0XHR2YXIgY2xhc3NBdHRyTmFtZSA9IFwiY2xhc3NcIiBpbiBhdHRycyA/IFwiY2xhc3NcIiA6IFwiY2xhc3NOYW1lXCI7XHJcblx0XHR2YXIgY2VsbCA9IHt0YWc6IFwiZGl2XCIsIGF0dHJzOiB7fX07XHJcblx0XHR2YXIgbWF0Y2gsIGNsYXNzZXMgPSBbXTtcclxuXHRcdGlmICh0eXBlLmNhbGwoYXJnc1swXSkgIT0gU1RSSU5HKSB0aHJvdyBuZXcgRXJyb3IoXCJzZWxlY3RvciBpbiBtKHNlbGVjdG9yLCBhdHRycywgY2hpbGRyZW4pIHNob3VsZCBiZSBhIHN0cmluZ1wiKVxyXG5cdFx0d2hpbGUgKG1hdGNoID0gcGFyc2VyLmV4ZWMoYXJnc1swXSkpIHtcclxuXHRcdFx0aWYgKG1hdGNoWzFdID09PSBcIlwiICYmIG1hdGNoWzJdKSBjZWxsLnRhZyA9IG1hdGNoWzJdO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIjXCIpIGNlbGwuYXR0cnMuaWQgPSBtYXRjaFsyXTtcclxuXHRcdFx0ZWxzZSBpZiAobWF0Y2hbMV0gPT09IFwiLlwiKSBjbGFzc2VzLnB1c2gobWF0Y2hbMl0pO1xyXG5cdFx0XHRlbHNlIGlmIChtYXRjaFszXVswXSA9PT0gXCJbXCIpIHtcclxuXHRcdFx0XHR2YXIgcGFpciA9IGF0dHJQYXJzZXIuZXhlYyhtYXRjaFszXSk7XHJcblx0XHRcdFx0Y2VsbC5hdHRyc1twYWlyWzFdXSA9IHBhaXJbM10gfHwgKHBhaXJbMl0gPyBcIlwiIDp0cnVlKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoY2xhc3Nlcy5sZW5ndGggPiAwKSBjZWxsLmF0dHJzW2NsYXNzQXR0ck5hbWVdID0gY2xhc3Nlcy5qb2luKFwiIFwiKTtcclxuXHJcblxyXG5cdFx0dmFyIGNoaWxkcmVuID0gaGFzQXR0cnMgPyBhcmdzWzJdIDogYXJnc1sxXTtcclxuXHRcdGlmICh0eXBlLmNhbGwoY2hpbGRyZW4pID09PSBBUlJBWSkge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gY2hpbGRyZW5cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRjZWxsLmNoaWxkcmVuID0gaGFzQXR0cnMgPyBhcmdzLnNsaWNlKDIpIDogYXJncy5zbGljZSgxKVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGF0dHJzKSB7XHJcblx0XHRcdGlmIChhdHRyTmFtZSA9PT0gY2xhc3NBdHRyTmFtZSkge1xyXG5cdFx0XHRcdGlmIChhdHRyc1thdHRyTmFtZV0gIT09IFwiXCIpIGNlbGwuYXR0cnNbYXR0ck5hbWVdID0gKGNlbGwuYXR0cnNbYXR0ck5hbWVdIHx8IFwiXCIpICsgXCIgXCIgKyBhdHRyc1thdHRyTmFtZV07XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBjZWxsLmF0dHJzW2F0dHJOYW1lXSA9IGF0dHJzW2F0dHJOYW1lXVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNlbGxcclxuXHR9XHJcblx0ZnVuY3Rpb24gYnVpbGQocGFyZW50RWxlbWVudCwgcGFyZW50VGFnLCBwYXJlbnRDYWNoZSwgcGFyZW50SW5kZXgsIGRhdGEsIGNhY2hlZCwgc2hvdWxkUmVhdHRhY2gsIGluZGV4LCBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKSB7XHJcblx0XHQvL2BidWlsZGAgaXMgYSByZWN1cnNpdmUgZnVuY3Rpb24gdGhhdCBtYW5hZ2VzIGNyZWF0aW9uL2RpZmZpbmcvcmVtb3ZhbCBvZiBET00gZWxlbWVudHMgYmFzZWQgb24gY29tcGFyaXNvbiBiZXR3ZWVuIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vdGhlIGRpZmYgYWxnb3JpdGhtIGNhbiBiZSBzdW1tYXJpemVkIGFzIHRoaXM6XHJcblx0XHQvLzEgLSBjb21wYXJlIGBkYXRhYCBhbmQgYGNhY2hlZGBcclxuXHRcdC8vMiAtIGlmIHRoZXkgYXJlIGRpZmZlcmVudCwgY29weSBgZGF0YWAgdG8gYGNhY2hlZGAgYW5kIHVwZGF0ZSB0aGUgRE9NIGJhc2VkIG9uIHdoYXQgdGhlIGRpZmZlcmVuY2UgaXNcclxuXHRcdC8vMyAtIHJlY3Vyc2l2ZWx5IGFwcGx5IHRoaXMgYWxnb3JpdGhtIGZvciBldmVyeSBhcnJheSBhbmQgZm9yIHRoZSBjaGlsZHJlbiBvZiBldmVyeSB2aXJ0dWFsIGVsZW1lbnRcclxuXHJcblx0XHQvL3RoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZSBpcyBlc3NlbnRpYWxseSB0aGUgc2FtZSBhcyB0aGUgcHJldmlvdXMgcmVkcmF3J3MgYGRhdGFgIGRhdGEgc3RydWN0dXJlLCB3aXRoIGEgZmV3IGFkZGl0aW9uczpcclxuXHRcdC8vLSBgY2FjaGVkYCBhbHdheXMgaGFzIGEgcHJvcGVydHkgY2FsbGVkIGBub2Rlc2AsIHdoaWNoIGlzIGEgbGlzdCBvZiBET00gZWxlbWVudHMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBkYXRhIHJlcHJlc2VudGVkIGJ5IHRoZSByZXNwZWN0aXZlIHZpcnR1YWwgZWxlbWVudFxyXG5cdFx0Ly8tIGluIG9yZGVyIHRvIHN1cHBvcnQgYXR0YWNoaW5nIGBub2Rlc2AgYXMgYSBwcm9wZXJ0eSBvZiBgY2FjaGVkYCwgYGNhY2hlZGAgaXMgKmFsd2F5cyogYSBub24tcHJpbWl0aXZlIG9iamVjdCwgaS5lLiBpZiB0aGUgZGF0YSB3YXMgYSBzdHJpbmcsIHRoZW4gY2FjaGVkIGlzIGEgU3RyaW5nIGluc3RhbmNlLiBJZiBkYXRhIHdhcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAsIGNhY2hlZCBpcyBgbmV3IFN0cmluZyhcIlwiKWBcclxuXHRcdC8vLSBgY2FjaGVkIGFsc28gaGFzIGEgYGNvbmZpZ0NvbnRleHRgIHByb3BlcnR5LCB3aGljaCBpcyB0aGUgc3RhdGUgc3RvcmFnZSBvYmplY3QgZXhwb3NlZCBieSBjb25maWcoZWxlbWVudCwgaXNJbml0aWFsaXplZCwgY29udGV4dClcclxuXHRcdC8vLSB3aGVuIGBjYWNoZWRgIGlzIGFuIE9iamVjdCwgaXQgcmVwcmVzZW50cyBhIHZpcnR1YWwgZWxlbWVudDsgd2hlbiBpdCdzIGFuIEFycmF5LCBpdCByZXByZXNlbnRzIGEgbGlzdCBvZiBlbGVtZW50czsgd2hlbiBpdCdzIGEgU3RyaW5nLCBOdW1iZXIgb3IgQm9vbGVhbiwgaXQgcmVwcmVzZW50cyBhIHRleHQgbm9kZVxyXG5cclxuXHRcdC8vYHBhcmVudEVsZW1lbnRgIGlzIGEgRE9NIGVsZW1lbnQgdXNlZCBmb3IgVzNDIERPTSBBUEkgY2FsbHNcclxuXHRcdC8vYHBhcmVudFRhZ2AgaXMgb25seSB1c2VkIGZvciBoYW5kbGluZyBhIGNvcm5lciBjYXNlIGZvciB0ZXh0YXJlYSB2YWx1ZXNcclxuXHRcdC8vYHBhcmVudENhY2hlYCBpcyB1c2VkIHRvIHJlbW92ZSBub2RlcyBpbiBzb21lIG11bHRpLW5vZGUgY2FzZXNcclxuXHRcdC8vYHBhcmVudEluZGV4YCBhbmQgYGluZGV4YCBhcmUgdXNlZCB0byBmaWd1cmUgb3V0IHRoZSBvZmZzZXQgb2Ygbm9kZXMuIFRoZXkncmUgYXJ0aWZhY3RzIGZyb20gYmVmb3JlIGFycmF5cyBzdGFydGVkIGJlaW5nIGZsYXR0ZW5lZCBhbmQgYXJlIGxpa2VseSByZWZhY3RvcmFibGVcclxuXHRcdC8vYGRhdGFgIGFuZCBgY2FjaGVkYCBhcmUsIHJlc3BlY3RpdmVseSwgdGhlIG5ldyBhbmQgb2xkIG5vZGVzIGJlaW5nIGRpZmZlZFxyXG5cdFx0Ly9gc2hvdWxkUmVhdHRhY2hgIGlzIGEgZmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgYSBwYXJlbnQgbm9kZSB3YXMgcmVjcmVhdGVkIChpZiBzbywgYW5kIGlmIHRoaXMgbm9kZSBpcyByZXVzZWQsIHRoZW4gdGhpcyBub2RlIG11c3QgcmVhdHRhY2ggaXRzZWxmIHRvIHRoZSBuZXcgcGFyZW50KVxyXG5cdFx0Ly9gZWRpdGFibGVgIGlzIGEgZmxhZyB0aGF0IGluZGljYXRlcyB3aGV0aGVyIGFuIGFuY2VzdG9yIGlzIGNvbnRlbnRlZGl0YWJsZVxyXG5cdFx0Ly9gbmFtZXNwYWNlYCBpbmRpY2F0ZXMgdGhlIGNsb3Nlc3QgSFRNTCBuYW1lc3BhY2UgYXMgaXQgY2FzY2FkZXMgZG93biBmcm9tIGFuIGFuY2VzdG9yXHJcblx0XHQvL2Bjb25maWdzYCBpcyBhIGxpc3Qgb2YgY29uZmlnIGZ1bmN0aW9ucyB0byBydW4gYWZ0ZXIgdGhlIHRvcG1vc3QgYGJ1aWxkYCBjYWxsIGZpbmlzaGVzIHJ1bm5pbmdcclxuXHJcblx0XHQvL3RoZXJlJ3MgbG9naWMgdGhhdCByZWxpZXMgb24gdGhlIGFzc3VtcHRpb24gdGhhdCBudWxsIGFuZCB1bmRlZmluZWQgZGF0YSBhcmUgZXF1aXZhbGVudCB0byBlbXB0eSBzdHJpbmdzXHJcblx0XHQvLy0gdGhpcyBwcmV2ZW50cyBsaWZlY3ljbGUgc3VycHJpc2VzIGZyb20gcHJvY2VkdXJhbCBoZWxwZXJzIHRoYXQgbWl4IGltcGxpY2l0IGFuZCBleHBsaWNpdCByZXR1cm4gc3RhdGVtZW50cyAoZS5nLiBmdW5jdGlvbiBmb28oKSB7aWYgKGNvbmQpIHJldHVybiBtKFwiZGl2XCIpfVxyXG5cdFx0Ly8tIGl0IHNpbXBsaWZpZXMgZGlmZmluZyBjb2RlXHJcblx0XHQvL2RhdGEudG9TdHJpbmcoKSBpcyBudWxsIGlmIGRhdGEgaXMgdGhlIHJldHVybiB2YWx1ZSBvZiBDb25zb2xlLmxvZyBpbiBGaXJlZm94XHJcblx0XHRpZiAoZGF0YSA9PSBudWxsIHx8IGRhdGEudG9TdHJpbmcoKSA9PSBudWxsKSBkYXRhID0gXCJcIjtcclxuXHRcdGlmIChkYXRhLnN1YnRyZWUgPT09IFwicmV0YWluXCIpIHJldHVybiBjYWNoZWQ7XHJcblx0XHR2YXIgY2FjaGVkVHlwZSA9IHR5cGUuY2FsbChjYWNoZWQpLCBkYXRhVHlwZSA9IHR5cGUuY2FsbChkYXRhKTtcclxuXHRcdGlmIChjYWNoZWQgPT0gbnVsbCB8fCBjYWNoZWRUeXBlICE9PSBkYXRhVHlwZSkge1xyXG5cdFx0XHRpZiAoY2FjaGVkICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAocGFyZW50Q2FjaGUgJiYgcGFyZW50Q2FjaGUubm9kZXMpIHtcclxuXHRcdFx0XHRcdHZhciBvZmZzZXQgPSBpbmRleCAtIHBhcmVudEluZGV4O1xyXG5cdFx0XHRcdFx0dmFyIGVuZCA9IG9mZnNldCArIChkYXRhVHlwZSA9PT0gQVJSQVkgPyBkYXRhIDogY2FjaGVkLm5vZGVzKS5sZW5ndGg7XHJcblx0XHRcdFx0XHRjbGVhcihwYXJlbnRDYWNoZS5ub2Rlcy5zbGljZShvZmZzZXQsIGVuZCksIHBhcmVudENhY2hlLnNsaWNlKG9mZnNldCwgZW5kKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoY2FjaGVkLm5vZGVzKSBjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZClcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWNoZWQgPSBuZXcgZGF0YS5jb25zdHJ1Y3RvcjtcclxuXHRcdFx0aWYgKGNhY2hlZC50YWcpIGNhY2hlZCA9IHt9OyAvL2lmIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYSB2aXJ0dWFsIGRvbSBlbGVtZW50LCB1c2UgYSBibGFuayBvYmplY3QgYXMgdGhlIGJhc2UgY2FjaGVkIG5vZGUgaW5zdGVhZCBvZiBjb3B5aW5nIHRoZSB2aXJ0dWFsIGVsICgjMjc3KVxyXG5cdFx0XHRjYWNoZWQubm9kZXMgPSBbXVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkYXRhVHlwZSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0Ly9yZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5XHJcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKHR5cGUuY2FsbChkYXRhW2ldKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0XHRcdGRhdGEgPSBkYXRhLmNvbmNhdC5hcHBseShbXSwgZGF0YSk7XHJcblx0XHRcdFx0XHRpLS0gLy9jaGVjayBjdXJyZW50IGluZGV4IGFnYWluIGFuZCBmbGF0dGVuIHVudGlsIHRoZXJlIGFyZSBubyBtb3JlIG5lc3RlZCBhcnJheXMgYXQgdGhhdCBpbmRleFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dmFyIG5vZGVzID0gW10sIGludGFjdCA9IGNhY2hlZC5sZW5ndGggPT09IGRhdGEubGVuZ3RoLCBzdWJBcnJheUNvdW50ID0gMDtcclxuXHJcblx0XHRcdC8va2V5cyBhbGdvcml0aG06IHNvcnQgZWxlbWVudHMgd2l0aG91dCByZWNyZWF0aW5nIHRoZW0gaWYga2V5cyBhcmUgcHJlc2VudFxyXG5cdFx0XHQvLzEpIGNyZWF0ZSBhIG1hcCBvZiBhbGwgZXhpc3Rpbmcga2V5cywgYW5kIG1hcmsgYWxsIGZvciBkZWxldGlvblxyXG5cdFx0XHQvLzIpIGFkZCBuZXcga2V5cyB0byBtYXAgYW5kIG1hcmsgdGhlbSBmb3IgYWRkaXRpb25cclxuXHRcdFx0Ly8zKSBpZiBrZXkgZXhpc3RzIGluIG5ldyBsaXN0LCBjaGFuZ2UgYWN0aW9uIGZyb20gZGVsZXRpb24gdG8gYSBtb3ZlXHJcblx0XHRcdC8vNCkgZm9yIGVhY2gga2V5LCBoYW5kbGUgaXRzIGNvcnJlc3BvbmRpbmcgYWN0aW9uIGFzIG1hcmtlZCBpbiBwcmV2aW91cyBzdGVwc1xyXG5cdFx0XHQvLzUpIGNvcHkgdW5rZXllZCBpdGVtcyBpbnRvIHRoZWlyIHJlc3BlY3RpdmUgZ2Fwc1xyXG5cdFx0XHR2YXIgREVMRVRJT04gPSAxLCBJTlNFUlRJT04gPSAyICwgTU9WRSA9IDM7XHJcblx0XHRcdHZhciBleGlzdGluZyA9IHt9LCB1bmtleWVkID0gW10sIHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNhY2hlZC5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChjYWNoZWRbaV0gJiYgY2FjaGVkW2ldLmF0dHJzICYmIGNhY2hlZFtpXS5hdHRycy5rZXkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0c2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGV4aXN0aW5nW2NhY2hlZFtpXS5hdHRycy5rZXldID0ge2FjdGlvbjogREVMRVRJT04sIGluZGV4OiBpfVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2hvdWxkTWFpbnRhaW5JZGVudGl0aWVzKSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuaW5kZXhPZihudWxsKSA+IC0xKSBkYXRhID0gZGF0YS5maWx0ZXIoZnVuY3Rpb24oeCkge3JldHVybiB4ICE9IG51bGx9KVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBrZXlzRGlmZmVyID0gZmFsc2VcclxuXHRcdFx0XHRpZiAoZGF0YS5sZW5ndGggIT0gY2FjaGVkLmxlbmd0aCkga2V5c0RpZmZlciA9IHRydWVcclxuXHRcdFx0XHRlbHNlIGZvciAodmFyIGkgPSAwLCBjYWNoZWRDZWxsLCBkYXRhQ2VsbDsgY2FjaGVkQ2VsbCA9IGNhY2hlZFtpXSwgZGF0YUNlbGwgPSBkYXRhW2ldOyBpKyspIHtcclxuXHRcdFx0XHRcdGlmIChjYWNoZWRDZWxsLmF0dHJzICYmIGRhdGFDZWxsLmF0dHJzICYmIGNhY2hlZENlbGwuYXR0cnMua2V5ICE9IGRhdGFDZWxsLmF0dHJzLmtleSkge1xyXG5cdFx0XHRcdFx0XHRrZXlzRGlmZmVyID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoa2V5c0RpZmZlcikge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKGRhdGFbaV0gJiYgZGF0YVtpXS5hdHRycykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChkYXRhW2ldLmF0dHJzLmtleSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIga2V5ID0gZGF0YVtpXS5hdHRycy5rZXk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWV4aXN0aW5nW2tleV0pIGV4aXN0aW5nW2tleV0gPSB7YWN0aW9uOiBJTlNFUlRJT04sIGluZGV4OiBpfTtcclxuXHRcdFx0XHRcdFx0XHRcdGVsc2UgZXhpc3Rpbmdba2V5XSA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0YWN0aW9uOiBNT1ZFLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpbmRleDogaSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZnJvbTogZXhpc3Rpbmdba2V5XS5pbmRleCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudDogY2FjaGVkLm5vZGVzW2V4aXN0aW5nW2tleV0uaW5kZXhdIHx8ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGVsc2UgdW5rZXllZC5wdXNoKHtpbmRleDogaSwgZWxlbWVudDogcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2ldIHx8ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpfSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIGFjdGlvbnMgPSBbXVxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgcHJvcCBpbiBleGlzdGluZykgYWN0aW9ucy5wdXNoKGV4aXN0aW5nW3Byb3BdKVxyXG5cdFx0XHRcdFx0dmFyIGNoYW5nZXMgPSBhY3Rpb25zLnNvcnQoc29ydENoYW5nZXMpO1xyXG5cdFx0XHRcdFx0dmFyIG5ld0NhY2hlZCA9IG5ldyBBcnJheShjYWNoZWQubGVuZ3RoKVxyXG5cclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBjaGFuZ2U7IGNoYW5nZSA9IGNoYW5nZXNbaV07IGkrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gREVMRVRJT04pIHtcclxuXHRcdFx0XHRcdFx0XHRjbGVhcihjYWNoZWRbY2hhbmdlLmluZGV4XS5ub2RlcywgY2FjaGVkW2NoYW5nZS5pbmRleF0pO1xyXG5cdFx0XHRcdFx0XHRcdG5ld0NhY2hlZC5zcGxpY2UoY2hhbmdlLmluZGV4LCAxKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBJTlNFUlRJT04pIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgZHVtbXkgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHRcdFx0XHRcdFx0XHRkdW1teS5rZXkgPSBkYXRhW2NoYW5nZS5pbmRleF0uYXR0cnMua2V5O1xyXG5cdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGR1bW15LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKTtcclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWQuc3BsaWNlKGNoYW5nZS5pbmRleCwgMCwge2F0dHJzOiB7a2V5OiBkYXRhW2NoYW5nZS5pbmRleF0uYXR0cnMua2V5fSwgbm9kZXM6IFtkdW1teV19KVxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gTU9WRSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSAhPT0gY2hhbmdlLmVsZW1lbnQgJiYgY2hhbmdlLmVsZW1lbnQgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNoYW5nZS5lbGVtZW50LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRuZXdDYWNoZWRbY2hhbmdlLmluZGV4XSA9IGNhY2hlZFtjaGFuZ2UuZnJvbV1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHVua2V5ZWQubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGNoYW5nZSA9IHVua2V5ZWRbaV07XHJcblx0XHRcdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNoYW5nZS5lbGVtZW50LCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbY2hhbmdlLmluZGV4XSB8fCBudWxsKTtcclxuXHRcdFx0XHRcdFx0bmV3Q2FjaGVkW2NoYW5nZS5pbmRleF0gPSBjYWNoZWRbY2hhbmdlLmluZGV4XVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2FjaGVkID0gbmV3Q2FjaGVkO1xyXG5cdFx0XHRcdFx0Y2FjaGVkLm5vZGVzID0gbmV3IEFycmF5KHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGNoaWxkOyBjaGlsZCA9IHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpXTsgaSsrKSBjYWNoZWQubm9kZXNbaV0gPSBjaGlsZFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQvL2VuZCBrZXkgYWxnb3JpdGhtXHJcblxyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgY2FjaGVDb3VudCA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHQvL2RpZmYgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxyXG5cdFx0XHRcdHZhciBpdGVtID0gYnVpbGQocGFyZW50RWxlbWVudCwgcGFyZW50VGFnLCBjYWNoZWQsIGluZGV4LCBkYXRhW2ldLCBjYWNoZWRbY2FjaGVDb3VudF0sIHNob3VsZFJlYXR0YWNoLCBpbmRleCArIHN1YkFycmF5Q291bnQgfHwgc3ViQXJyYXlDb3VudCwgZWRpdGFibGUsIG5hbWVzcGFjZSwgY29uZmlncyk7XHJcblx0XHRcdFx0aWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblx0XHRcdFx0aWYgKCFpdGVtLm5vZGVzLmludGFjdCkgaW50YWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKGl0ZW0uJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdC8vZml4IG9mZnNldCBvZiBuZXh0IGVsZW1lbnQgaWYgaXRlbSB3YXMgYSB0cnVzdGVkIHN0cmluZyB3LyBtb3JlIHRoYW4gb25lIGh0bWwgZWxlbWVudFxyXG5cdFx0XHRcdFx0Ly90aGUgZmlyc3QgY2xhdXNlIGluIHRoZSByZWdleHAgbWF0Y2hlcyBlbGVtZW50c1xyXG5cdFx0XHRcdFx0Ly90aGUgc2Vjb25kIGNsYXVzZSAoYWZ0ZXIgdGhlIHBpcGUpIG1hdGNoZXMgdGV4dCBub2Rlc1xyXG5cdFx0XHRcdFx0c3ViQXJyYXlDb3VudCArPSAoaXRlbS5tYXRjaCgvPFteXFwvXXxcXD5cXHMqW148XS9nKSB8fCBbXSkubGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Ugc3ViQXJyYXlDb3VudCArPSB0eXBlLmNhbGwoaXRlbSkgPT09IEFSUkFZID8gaXRlbS5sZW5ndGggOiAxO1xyXG5cdFx0XHRcdGNhY2hlZFtjYWNoZUNvdW50KytdID0gaXRlbVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghaW50YWN0KSB7XHJcblx0XHRcdFx0Ly9kaWZmIHRoZSBhcnJheSBpdHNlbGZcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvL3VwZGF0ZSB0aGUgbGlzdCBvZiBET00gbm9kZXMgYnkgY29sbGVjdGluZyB0aGUgbm9kZXMgZnJvbSBlYWNoIGl0ZW1cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKGNhY2hlZFtpXSAhPSBudWxsKSBub2Rlcy5wdXNoLmFwcGx5KG5vZGVzLCBjYWNoZWRbaV0ubm9kZXMpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIGVuZCBvZiB0aGUgYXJyYXkgaWYgdGhlIG5ldyBhcnJheSBpcyBzaG9ydGVyIHRoYW4gdGhlIG9sZCBvbmVcclxuXHRcdFx0XHQvL2lmIGVycm9ycyBldmVyIGhhcHBlbiBoZXJlLCB0aGUgaXNzdWUgaXMgbW9zdCBsaWtlbHkgYSBidWcgaW4gdGhlIGNvbnN0cnVjdGlvbiBvZiB0aGUgYGNhY2hlZGAgZGF0YSBzdHJ1Y3R1cmUgc29tZXdoZXJlIGVhcmxpZXIgaW4gdGhlIHByb2dyYW1cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbm9kZTsgbm9kZSA9IGNhY2hlZC5ub2Rlc1tpXTsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAobm9kZS5wYXJlbnROb2RlICE9IG51bGwgJiYgbm9kZXMuaW5kZXhPZihub2RlKSA8IDApIGNsZWFyKFtub2RlXSwgW2NhY2hlZFtpXV0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChkYXRhLmxlbmd0aCA8IGNhY2hlZC5sZW5ndGgpIGNhY2hlZC5sZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChkYXRhICE9IG51bGwgJiYgZGF0YVR5cGUgPT09IE9CSkVDVCkge1xyXG5cdFx0XHRpZiAoIWRhdGEuYXR0cnMpIGRhdGEuYXR0cnMgPSB7fTtcclxuXHRcdFx0aWYgKCFjYWNoZWQuYXR0cnMpIGNhY2hlZC5hdHRycyA9IHt9O1xyXG5cclxuXHRcdFx0dmFyIGRhdGFBdHRyS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuYXR0cnMpXHJcblx0XHRcdHZhciBoYXNLZXlzID0gZGF0YUF0dHJLZXlzLmxlbmd0aCA+IChcImtleVwiIGluIGRhdGEuYXR0cnMgPyAxIDogMClcclxuXHRcdFx0Ly9pZiBhbiBlbGVtZW50IGlzIGRpZmZlcmVudCBlbm91Z2ggZnJvbSB0aGUgb25lIGluIGNhY2hlLCByZWNyZWF0ZSBpdFxyXG5cdFx0XHRpZiAoZGF0YS50YWcgIT0gY2FjaGVkLnRhZyB8fCBkYXRhQXR0cktleXMuam9pbigpICE9IE9iamVjdC5rZXlzKGNhY2hlZC5hdHRycykuam9pbigpIHx8IGRhdGEuYXR0cnMuaWQgIT0gY2FjaGVkLmF0dHJzLmlkKSB7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5ub2Rlcy5sZW5ndGgpIGNsZWFyKGNhY2hlZC5ub2Rlcyk7XHJcblx0XHRcdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIHR5cGVvZiBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKClcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGRhdGEudGFnKSAhPSBTVFJJTkcpIHJldHVybjtcclxuXHJcblx0XHRcdHZhciBub2RlLCBpc05ldyA9IGNhY2hlZC5ub2Rlcy5sZW5ndGggPT09IDA7XHJcblx0XHRcdGlmIChkYXRhLmF0dHJzLnhtbG5zKSBuYW1lc3BhY2UgPSBkYXRhLmF0dHJzLnhtbG5zO1xyXG5cdFx0XHRlbHNlIGlmIChkYXRhLnRhZyA9PT0gXCJzdmdcIikgbmFtZXNwYWNlID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xyXG5cdFx0XHRlbHNlIGlmIChkYXRhLnRhZyA9PT0gXCJtYXRoXCIpIG5hbWVzcGFjZSA9IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiO1xyXG5cdFx0XHRpZiAoaXNOZXcpIHtcclxuXHRcdFx0XHRpZiAoZGF0YS5hdHRycy5pcykgbm9kZSA9IG5hbWVzcGFjZSA9PT0gdW5kZWZpbmVkID8gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpIDogJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2UsIGRhdGEudGFnLCBkYXRhLmF0dHJzLmlzKTtcclxuXHRcdFx0XHRlbHNlIG5vZGUgPSBuYW1lc3BhY2UgPT09IHVuZGVmaW5lZCA/ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnKSA6ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZyk7XHJcblx0XHRcdFx0Y2FjaGVkID0ge1xyXG5cdFx0XHRcdFx0dGFnOiBkYXRhLnRhZyxcclxuXHRcdFx0XHRcdC8vc2V0IGF0dHJpYnV0ZXMgZmlyc3QsIHRoZW4gY3JlYXRlIGNoaWxkcmVuXHJcblx0XHRcdFx0XHRhdHRyczogaGFzS2V5cyA/IHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMsIHt9LCBuYW1lc3BhY2UpIDogZGF0YS5hdHRycyxcclxuXHRcdFx0XHRcdGNoaWxkcmVuOiBkYXRhLmNoaWxkcmVuICE9IG51bGwgJiYgZGF0YS5jaGlsZHJlbi5sZW5ndGggPiAwID9cclxuXHRcdFx0XHRcdFx0YnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIHRydWUsIDAsIGRhdGEuYXR0cnMuY29udGVudGVkaXRhYmxlID8gbm9kZSA6IGVkaXRhYmxlLCBuYW1lc3BhY2UsIGNvbmZpZ3MpIDpcclxuXHRcdFx0XHRcdFx0ZGF0YS5jaGlsZHJlbixcclxuXHRcdFx0XHRcdG5vZGVzOiBbbm9kZV1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmIChjYWNoZWQuY2hpbGRyZW4gJiYgIWNhY2hlZC5jaGlsZHJlbi5ub2RlcykgY2FjaGVkLmNoaWxkcmVuLm5vZGVzID0gW107XHJcblx0XHRcdFx0Ly9lZGdlIGNhc2U6IHNldHRpbmcgdmFsdWUgb24gPHNlbGVjdD4gZG9lc24ndCB3b3JrIGJlZm9yZSBjaGlsZHJlbiBleGlzdCwgc28gc2V0IGl0IGFnYWluIGFmdGVyIGNoaWxkcmVuIGhhdmUgYmVlbiBjcmVhdGVkXHJcblx0XHRcdFx0aWYgKGRhdGEudGFnID09PSBcInNlbGVjdFwiICYmIGRhdGEuYXR0cnMudmFsdWUpIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIHt2YWx1ZTogZGF0YS5hdHRycy52YWx1ZX0sIHt9LCBuYW1lc3BhY2UpO1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRub2RlID0gY2FjaGVkLm5vZGVzWzBdO1xyXG5cdFx0XHRcdGlmIChoYXNLZXlzKSBzZXRBdHRyaWJ1dGVzKG5vZGUsIGRhdGEudGFnLCBkYXRhLmF0dHJzLCBjYWNoZWQuYXR0cnMsIG5hbWVzcGFjZSk7XHJcblx0XHRcdFx0Y2FjaGVkLmNoaWxkcmVuID0gYnVpbGQobm9kZSwgZGF0YS50YWcsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBkYXRhLmNoaWxkcmVuLCBjYWNoZWQuY2hpbGRyZW4sIGZhbHNlLCAwLCBkYXRhLmF0dHJzLmNvbnRlbnRlZGl0YWJsZSA/IG5vZGUgOiBlZGl0YWJsZSwgbmFtZXNwYWNlLCBjb25maWdzKTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAoc2hvdWxkUmVhdHRhY2ggPT09IHRydWUgJiYgbm9kZSAhPSBudWxsKSBwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShub2RlLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdH1cclxuXHRcdFx0Ly9zY2hlZHVsZSBjb25maWdzIHRvIGJlIGNhbGxlZC4gVGhleSBhcmUgY2FsbGVkIGFmdGVyIGBidWlsZGAgZmluaXNoZXMgcnVubmluZ1xyXG5cdFx0XHRpZiAodHlwZW9mIGRhdGEuYXR0cnNbXCJjb25maWdcIl0gPT09IEZVTkNUSU9OKSB7XHJcblx0XHRcdFx0dmFyIGNvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCA9IGNhY2hlZC5jb25maWdDb250ZXh0IHx8IHt9O1xyXG5cclxuXHRcdFx0XHQvLyBiaW5kXHJcblx0XHRcdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24oZGF0YSwgYXJncykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YS5hdHRyc1tcImNvbmZpZ1wiXS5hcHBseShkYXRhLCBhcmdzKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0Y29uZmlncy5wdXNoKGNhbGxiYWNrKGRhdGEsIFtub2RlLCAhaXNOZXcsIGNvbnRleHQsIGNhY2hlZF0pKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0eXBlb2YgZGF0YVR5cGUgIT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0Ly9oYW5kbGUgdGV4dCBub2Rlc1xyXG5cdFx0XHR2YXIgbm9kZXM7XHJcblx0XHRcdGlmIChjYWNoZWQubm9kZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0aWYgKGRhdGEuJHRydXN0ZWQpIHtcclxuXHRcdFx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldO1xyXG5cdFx0XHRcdFx0aWYgKCFwYXJlbnRFbGVtZW50Lm5vZGVOYW1lLm1hdGNoKHZvaWRFbGVtZW50cykpIHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKG5vZGVzWzBdLCBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdIHx8IG51bGwpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IFwic3RyaW5nIG51bWJlciBib29sZWFuXCIuaW5kZXhPZih0eXBlb2YgZGF0YSkgPiAtMSA/IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpIDogZGF0YTtcclxuXHRcdFx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC52YWx1ZU9mKCkgIT09IGRhdGEudmFsdWVPZigpIHx8IHNob3VsZFJlYXR0YWNoID09PSB0cnVlKSB7XHJcblx0XHRcdFx0bm9kZXMgPSBjYWNoZWQubm9kZXM7XHJcblx0XHRcdFx0aWYgKCFlZGl0YWJsZSB8fCBlZGl0YWJsZSAhPT0gJGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdFx0XHRcdGNsZWFyKG5vZGVzLCBjYWNoZWQpO1xyXG5cdFx0XHRcdFx0XHRub2RlcyA9IGluamVjdEhUTUwocGFyZW50RWxlbWVudCwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0Ly9jb3JuZXIgY2FzZTogcmVwbGFjaW5nIHRoZSBub2RlVmFsdWUgb2YgYSB0ZXh0IG5vZGUgdGhhdCBpcyBhIGNoaWxkIG9mIGEgdGV4dGFyZWEvY29udGVudGVkaXRhYmxlIGRvZXNuJ3Qgd29ya1xyXG5cdFx0XHRcdFx0XHQvL3dlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRleHRhcmVhIG9yIHRoZSBpbm5lckhUTUwgb2YgdGhlIGNvbnRlbnRlZGl0YWJsZSBlbGVtZW50IGluc3RlYWRcclxuXHRcdFx0XHRcdFx0aWYgKHBhcmVudFRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSBwYXJlbnRFbGVtZW50LnZhbHVlID0gZGF0YTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoZWRpdGFibGUpIGVkaXRhYmxlLmlubmVySFRNTCA9IGRhdGE7XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChub2Rlc1swXS5ub2RlVHlwZSA9PT0gMSB8fCBub2Rlcy5sZW5ndGggPiAxKSB7IC8vd2FzIGEgdHJ1c3RlZCBzdHJpbmdcclxuXHRcdFx0XHRcdFx0XHRcdGNsZWFyKGNhY2hlZC5ub2RlcywgY2FjaGVkKTtcclxuXHRcdFx0XHRcdFx0XHRcdG5vZGVzID0gWyRkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKV1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZXNbMF0sIHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0gfHwgbnVsbCk7XHJcblx0XHRcdFx0XHRcdFx0bm9kZXNbMF0ubm9kZVZhbHVlID0gZGF0YVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpO1xyXG5cdFx0XHRcdGNhY2hlZC5ub2RlcyA9IG5vZGVzXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBjYWNoZWQubm9kZXMuaW50YWN0ID0gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblx0ZnVuY3Rpb24gc29ydENoYW5nZXMoYSwgYikge3JldHVybiBhLmFjdGlvbiAtIGIuYWN0aW9uIHx8IGEuaW5kZXggLSBiLmluZGV4fVxyXG5cdGZ1bmN0aW9uIHNldEF0dHJpYnV0ZXMobm9kZSwgdGFnLCBkYXRhQXR0cnMsIGNhY2hlZEF0dHJzLCBuYW1lc3BhY2UpIHtcclxuXHRcdGZvciAodmFyIGF0dHJOYW1lIGluIGRhdGFBdHRycykge1xyXG5cdFx0XHR2YXIgZGF0YUF0dHIgPSBkYXRhQXR0cnNbYXR0ck5hbWVdO1xyXG5cdFx0XHR2YXIgY2FjaGVkQXR0ciA9IGNhY2hlZEF0dHJzW2F0dHJOYW1lXTtcclxuXHRcdFx0aWYgKCEoYXR0ck5hbWUgaW4gY2FjaGVkQXR0cnMpIHx8IChjYWNoZWRBdHRyICE9PSBkYXRhQXR0cikpIHtcclxuXHRcdFx0XHRjYWNoZWRBdHRyc1thdHRyTmFtZV0gPSBkYXRhQXR0cjtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly9gY29uZmlnYCBpc24ndCBhIHJlYWwgYXR0cmlidXRlcywgc28gaWdub3JlIGl0XHJcblx0XHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IFwiY29uZmlnXCIgfHwgYXR0ck5hbWUgPT0gXCJrZXlcIikgY29udGludWU7XHJcblx0XHRcdFx0XHQvL2hvb2sgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGF1dG8tcmVkcmF3aW5nIHN5c3RlbVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRhdGFBdHRyID09PSBGVU5DVElPTiAmJiBhdHRyTmFtZS5pbmRleE9mKFwib25cIikgPT09IDApIHtcclxuXHRcdFx0XHRcdFx0bm9kZVthdHRyTmFtZV0gPSBhdXRvcmVkcmF3KGRhdGFBdHRyLCBub2RlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9oYW5kbGUgYHN0eWxlOiB7Li4ufWBcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInN0eWxlXCIgJiYgZGF0YUF0dHIgIT0gbnVsbCAmJiB0eXBlLmNhbGwoZGF0YUF0dHIpID09PSBPQkpFQ1QpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcnVsZSBpbiBkYXRhQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChjYWNoZWRBdHRyID09IG51bGwgfHwgY2FjaGVkQXR0cltydWxlXSAhPT0gZGF0YUF0dHJbcnVsZV0pIG5vZGUuc3R5bGVbcnVsZV0gPSBkYXRhQXR0cltydWxlXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIHJ1bGUgaW4gY2FjaGVkQXR0cikge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghKHJ1bGUgaW4gZGF0YUF0dHIpKSBub2RlLnN0eWxlW3J1bGVdID0gXCJcIlxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBTVkdcclxuXHRcdFx0XHRcdGVsc2UgaWYgKG5hbWVzcGFjZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGlmIChhdHRyTmFtZSA9PT0gXCJocmVmXCIpIG5vZGUuc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsIFwiaHJlZlwiLCBkYXRhQXR0cik7XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lID09PSBcImNsYXNzTmFtZVwiKSBub2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGRhdGFBdHRyKTtcclxuXHRcdFx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2hhbmRsZSBjYXNlcyB0aGF0IGFyZSBwcm9wZXJ0aWVzIChidXQgaWdub3JlIGNhc2VzIHdoZXJlIHdlIHNob3VsZCB1c2Ugc2V0QXR0cmlidXRlIGluc3RlYWQpXHJcblx0XHRcdFx0XHQvLy0gbGlzdCBhbmQgZm9ybSBhcmUgdHlwaWNhbGx5IHVzZWQgYXMgc3RyaW5ncywgYnV0IGFyZSBET00gZWxlbWVudCByZWZlcmVuY2VzIGluIGpzXHJcblx0XHRcdFx0XHQvLy0gd2hlbiB1c2luZyBDU1Mgc2VsZWN0b3JzIChlLmcuIGBtKFwiW3N0eWxlPScnXVwiKWApLCBzdHlsZSBpcyB1c2VkIGFzIGEgc3RyaW5nLCBidXQgaXQncyBhbiBvYmplY3QgaW4ganNcclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJOYW1lIGluIG5vZGUgJiYgIShhdHRyTmFtZSA9PT0gXCJsaXN0XCIgfHwgYXR0ck5hbWUgPT09IFwic3R5bGVcIiB8fCBhdHRyTmFtZSA9PT0gXCJmb3JtXCIgfHwgYXR0ck5hbWUgPT09IFwidHlwZVwiKSkge1xyXG5cdFx0XHRcdFx0XHQvLyMzNDggZG9uJ3Qgc2V0IHRoZSB2YWx1ZSBpZiBub3QgbmVlZGVkIG90aGVyd2lzZSBjdXJzb3IgcGxhY2VtZW50IGJyZWFrcyBpbiBDaHJvbWVcclxuXHRcdFx0XHRcdFx0aWYgKHRhZyAhPT0gXCJpbnB1dFwiIHx8IG5vZGVbYXR0ck5hbWVdICE9PSBkYXRhQXR0cikgbm9kZVthdHRyTmFtZV0gPSBkYXRhQXR0clxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHQvL3N3YWxsb3cgSUUncyBpbnZhbGlkIGFyZ3VtZW50IGVycm9ycyB0byBtaW1pYyBIVE1MJ3MgZmFsbGJhY2stdG8tZG9pbmctbm90aGluZy1vbi1pbnZhbGlkLWF0dHJpYnV0ZXMgYmVoYXZpb3JcclxuXHRcdFx0XHRcdGlmIChlLm1lc3NhZ2UuaW5kZXhPZihcIkludmFsaWQgYXJndW1lbnRcIikgPCAwKSB0aHJvdyBlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIzM0OCBkYXRhQXR0ciBtYXkgbm90IGJlIGEgc3RyaW5nLCBzbyB1c2UgbG9vc2UgY29tcGFyaXNvbiAoZG91YmxlIGVxdWFsKSBpbnN0ZWFkIG9mIHN0cmljdCAodHJpcGxlIGVxdWFsKVxyXG5cdFx0XHRlbHNlIGlmIChhdHRyTmFtZSA9PT0gXCJ2YWx1ZVwiICYmIHRhZyA9PT0gXCJpbnB1dFwiICYmIG5vZGUudmFsdWUgIT0gZGF0YUF0dHIpIHtcclxuXHRcdFx0XHRub2RlLnZhbHVlID0gZGF0YUF0dHJcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNhY2hlZEF0dHJzXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGNsZWFyKG5vZGVzLCBjYWNoZWQpIHtcclxuXHRcdGZvciAodmFyIGkgPSBub2Rlcy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xyXG5cdFx0XHRpZiAobm9kZXNbaV0gJiYgbm9kZXNbaV0ucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRcdHRyeSB7bm9kZXNbaV0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2Rlc1tpXSl9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHt9IC8vaWdub3JlIGlmIHRoaXMgZmFpbHMgZHVlIHRvIG9yZGVyIG9mIGV2ZW50cyAoc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjE5MjYwODMvZmFpbGVkLXRvLWV4ZWN1dGUtcmVtb3ZlY2hpbGQtb24tbm9kZSlcclxuXHRcdFx0XHRjYWNoZWQgPSBbXS5jb25jYXQoY2FjaGVkKTtcclxuXHRcdFx0XHRpZiAoY2FjaGVkW2ldKSB1bmxvYWQoY2FjaGVkW2ldKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAobm9kZXMubGVuZ3RoICE9IDApIG5vZGVzLmxlbmd0aCA9IDBcclxuXHR9XHJcblx0ZnVuY3Rpb24gdW5sb2FkKGNhY2hlZCkge1xyXG5cdFx0aWYgKGNhY2hlZC5jb25maWdDb250ZXh0ICYmIHR5cGVvZiBjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIGNhY2hlZC5jb25maWdDb250ZXh0Lm9udW5sb2FkKCk7XHJcblx0XHRpZiAoY2FjaGVkLmNoaWxkcmVuKSB7XHJcblx0XHRcdGlmICh0eXBlLmNhbGwoY2FjaGVkLmNoaWxkcmVuKSA9PT0gQVJSQVkpIHtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgY2hpbGQ7IGNoaWxkID0gY2FjaGVkLmNoaWxkcmVuW2ldOyBpKyspIHVubG9hZChjaGlsZClcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChjYWNoZWQuY2hpbGRyZW4udGFnKSB1bmxvYWQoY2FjaGVkLmNoaWxkcmVuKVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKSB7XHJcblx0XHR2YXIgbmV4dFNpYmxpbmcgPSBwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdO1xyXG5cdFx0aWYgKG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdHZhciBpc0VsZW1lbnQgPSBuZXh0U2libGluZy5ub2RlVHlwZSAhPSAxO1xyXG5cdFx0XHR2YXIgcGxhY2Vob2xkZXIgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblx0XHRcdGlmIChpc0VsZW1lbnQpIHtcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShwbGFjZWhvbGRlciwgbmV4dFNpYmxpbmcgfHwgbnVsbCk7XHJcblx0XHRcdFx0cGxhY2Vob2xkZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlYmVnaW5cIiwgZGF0YSk7XHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChwbGFjZWhvbGRlcilcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIG5leHRTaWJsaW5nLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpXHJcblx0XHR9XHJcblx0XHRlbHNlIHBhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGRhdGEpO1xyXG5cdFx0dmFyIG5vZGVzID0gW107XHJcblx0XHR3aGlsZSAocGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSAhPT0gbmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0bm9kZXMucHVzaChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdFx0aW5kZXgrK1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vZGVzXHJcblx0fVxyXG5cdGZ1bmN0aW9uIGF1dG9yZWRyYXcoY2FsbGJhY2ssIG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKTtcclxuXHRcdFx0bS5zdGFydENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHRyeSB7cmV0dXJuIGNhbGxiYWNrLmNhbGwob2JqZWN0LCBlKX1cclxuXHRcdFx0ZmluYWxseSB7XHJcblx0XHRcdFx0ZW5kRmlyc3RDb21wdXRhdGlvbigpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBodG1sO1xyXG5cdHZhciBkb2N1bWVudE5vZGUgPSB7XHJcblx0XHRhcHBlbmRDaGlsZDogZnVuY3Rpb24obm9kZSkge1xyXG5cdFx0XHRpZiAoaHRtbCA9PT0gdW5kZWZpbmVkKSBodG1sID0gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJodG1sXCIpO1xyXG5cdFx0XHRpZiAoJGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICE9PSBub2RlKSB7XHJcblx0XHRcdFx0JGRvY3VtZW50LnJlcGxhY2VDaGlsZChub2RlLCAkZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgJGRvY3VtZW50LmFwcGVuZENoaWxkKG5vZGUpO1xyXG5cdFx0XHR0aGlzLmNoaWxkTm9kZXMgPSAkZG9jdW1lbnQuY2hpbGROb2Rlc1xyXG5cdFx0fSxcclxuXHRcdGluc2VydEJlZm9yZTogZnVuY3Rpb24obm9kZSkge1xyXG5cdFx0XHR0aGlzLmFwcGVuZENoaWxkKG5vZGUpXHJcblx0XHR9LFxyXG5cdFx0Y2hpbGROb2RlczogW11cclxuXHR9O1xyXG5cdHZhciBub2RlQ2FjaGUgPSBbXSwgY2VsbENhY2hlID0ge307XHJcblx0bS5yZW5kZXIgPSBmdW5jdGlvbihyb290LCBjZWxsLCBmb3JjZVJlY3JlYXRpb24pIHtcclxuXHRcdHZhciBjb25maWdzID0gW107XHJcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBlbnN1cmUgdGhlIERPTSBlbGVtZW50IGV4aXN0cyBiZWZvcmUgcmVuZGVyaW5nIGEgdGVtcGxhdGUgaW50byBpdC5cIik7XHJcblx0XHR2YXIgaWQgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdCk7XHJcblx0XHR2YXIgaXNEb2N1bWVudFJvb3QgPSByb290ID09PSAkZG9jdW1lbnQ7XHJcblx0XHR2YXIgbm9kZSA9IGlzRG9jdW1lbnRSb290IHx8IHJvb3QgPT09ICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgPyBkb2N1bWVudE5vZGUgOiByb290O1xyXG5cdFx0aWYgKGlzRG9jdW1lbnRSb290ICYmIGNlbGwudGFnICE9IFwiaHRtbFwiKSBjZWxsID0ge3RhZzogXCJodG1sXCIsIGF0dHJzOiB7fSwgY2hpbGRyZW46IGNlbGx9O1xyXG5cdFx0aWYgKGNlbGxDYWNoZVtpZF0gPT09IHVuZGVmaW5lZCkgY2xlYXIobm9kZS5jaGlsZE5vZGVzKTtcclxuXHRcdGlmIChmb3JjZVJlY3JlYXRpb24gPT09IHRydWUpIHJlc2V0KHJvb3QpO1xyXG5cdFx0Y2VsbENhY2hlW2lkXSA9IGJ1aWxkKG5vZGUsIG51bGwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjZWxsLCBjZWxsQ2FjaGVbaWRdLCBmYWxzZSwgMCwgbnVsbCwgdW5kZWZpbmVkLCBjb25maWdzKTtcclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb25maWdzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSBjb25maWdzW2ldKClcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIGdldENlbGxDYWNoZUtleShlbGVtZW50KSB7XHJcblx0XHR2YXIgaW5kZXggPSBub2RlQ2FjaGUuaW5kZXhPZihlbGVtZW50KTtcclxuXHRcdHJldHVybiBpbmRleCA8IDAgPyBub2RlQ2FjaGUucHVzaChlbGVtZW50KSAtIDEgOiBpbmRleFxyXG5cdH1cclxuXHJcblx0bS50cnVzdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YWx1ZSA9IG5ldyBTdHJpbmcodmFsdWUpO1xyXG5cdFx0dmFsdWUuJHRydXN0ZWQgPSB0cnVlO1xyXG5cdFx0cmV0dXJuIHZhbHVlXHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0dGVyc2V0dGVyKHN0b3JlKSB7XHJcblx0XHR2YXIgcHJvcCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkgc3RvcmUgPSBhcmd1bWVudHNbMF07XHJcblx0XHRcdHJldHVybiBzdG9yZVxyXG5cdFx0fTtcclxuXHJcblx0XHRwcm9wLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gc3RvcmVcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIHByb3BcclxuXHR9XHJcblxyXG5cdG0ucHJvcCA9IGZ1bmN0aW9uIChzdG9yZSkge1xyXG5cdFx0Ly9ub3RlOiB1c2luZyBub24tc3RyaWN0IGVxdWFsaXR5IGNoZWNrIGhlcmUgYmVjYXVzZSB3ZSdyZSBjaGVja2luZyBpZiBzdG9yZSBpcyBudWxsIE9SIHVuZGVmaW5lZFxyXG5cdFx0aWYgKCgoc3RvcmUgIT0gbnVsbCAmJiB0eXBlLmNhbGwoc3RvcmUpID09PSBPQkpFQ1QpIHx8IHR5cGVvZiBzdG9yZSA9PT0gRlVOQ1RJT04pICYmIHR5cGVvZiBzdG9yZS50aGVuID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGlmeShzdG9yZSlcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZ2V0dGVyc2V0dGVyKHN0b3JlKVxyXG5cdH07XHJcblxyXG5cdHZhciByb290cyA9IFtdLCBtb2R1bGVzID0gW10sIGNvbnRyb2xsZXJzID0gW10sIGxhc3RSZWRyYXdJZCA9IG51bGwsIGxhc3RSZWRyYXdDYWxsVGltZSA9IDAsIGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGwsIHByZXZlbnRlZCA9IGZhbHNlLCB0b3BNb2R1bGU7XHJcblx0dmFyIEZSQU1FX0JVREdFVCA9IDE2OyAvLzYwIGZyYW1lcyBwZXIgc2Vjb25kID0gMSBjYWxsIHBlciAxNiBtc1xyXG5cdG0ubW9kdWxlID0gZnVuY3Rpb24ocm9vdCwgbW9kdWxlKSB7XHJcblx0XHRpZiAoIXJvb3QpIHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBlbnN1cmUgdGhlIERPTSBlbGVtZW50IGV4aXN0cyBiZWZvcmUgcmVuZGVyaW5nIGEgdGVtcGxhdGUgaW50byBpdC5cIik7XHJcblx0XHR2YXIgaW5kZXggPSByb290cy5pbmRleE9mKHJvb3QpO1xyXG5cdFx0aWYgKGluZGV4IDwgMCkgaW5kZXggPSByb290cy5sZW5ndGg7XHJcblx0XHR2YXIgaXNQcmV2ZW50ZWQgPSBmYWxzZTtcclxuXHRcdGlmIChjb250cm9sbGVyc1tpbmRleF0gJiYgdHlwZW9mIGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZCA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0dmFyIGV2ZW50ID0ge1xyXG5cdFx0XHRcdHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtpc1ByZXZlbnRlZCA9IHRydWV9XHJcblx0XHRcdH07XHJcblx0XHRcdGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZChldmVudClcclxuXHRcdH1cclxuXHRcdGlmICghaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJhbGxcIik7XHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0XHRyb290c1tpbmRleF0gPSByb290O1xyXG5cdFx0XHR2YXIgY3VycmVudE1vZHVsZSA9IHRvcE1vZHVsZSA9IG1vZHVsZSA9IG1vZHVsZSB8fCB7fTtcclxuXHRcdFx0dmFyIGNvbnRyb2xsZXIgPSBuZXcgKG1vZHVsZS5jb250cm9sbGVyIHx8IGZ1bmN0aW9uKCkge30pO1xyXG5cdFx0XHQvL2NvbnRyb2xsZXJzIG1heSBjYWxsIG0ubW9kdWxlIHJlY3Vyc2l2ZWx5ICh2aWEgbS5yb3V0ZSByZWRpcmVjdHMsIGZvciBleGFtcGxlKVxyXG5cdFx0XHQvL3RoaXMgY29uZGl0aW9uYWwgZW5zdXJlcyBvbmx5IHRoZSBsYXN0IHJlY3Vyc2l2ZSBtLm1vZHVsZSBjYWxsIGlzIGFwcGxpZWRcclxuXHRcdFx0aWYgKGN1cnJlbnRNb2R1bGUgPT09IHRvcE1vZHVsZSkge1xyXG5cdFx0XHRcdGNvbnRyb2xsZXJzW2luZGV4XSA9IGNvbnRyb2xsZXI7XHJcblx0XHRcdFx0bW9kdWxlc1tpbmRleF0gPSBtb2R1bGVcclxuXHRcdFx0fVxyXG5cdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKCk7XHJcblx0XHRcdHJldHVybiBjb250cm9sbGVyc1tpbmRleF1cclxuXHRcdH1cclxuXHR9O1xyXG5cdG0ucmVkcmF3ID0gZnVuY3Rpb24oZm9yY2UpIHtcclxuXHRcdC8vbGFzdFJlZHJhd0lkIGlzIGEgcG9zaXRpdmUgbnVtYmVyIGlmIGEgc2Vjb25kIHJlZHJhdyBpcyByZXF1ZXN0ZWQgYmVmb3JlIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZVxyXG5cdFx0Ly9sYXN0UmVkcmF3SUQgaXMgbnVsbCBpZiBpdCdzIHRoZSBmaXJzdCByZWRyYXcgYW5kIG5vdCBhbiBldmVudCBoYW5kbGVyXHJcblx0XHRpZiAobGFzdFJlZHJhd0lkICYmIGZvcmNlICE9PSB0cnVlKSB7XHJcblx0XHRcdC8vd2hlbiBzZXRUaW1lb3V0OiBvbmx5IHJlc2NoZWR1bGUgcmVkcmF3IGlmIHRpbWUgYmV0d2VlbiBub3cgYW5kIHByZXZpb3VzIHJlZHJhdyBpcyBiaWdnZXIgdGhhbiBhIGZyYW1lLCBvdGhlcndpc2Uga2VlcCBjdXJyZW50bHkgc2NoZWR1bGVkIHRpbWVvdXRcclxuXHRcdFx0Ly93aGVuIHJBRjogYWx3YXlzIHJlc2NoZWR1bGUgcmVkcmF3XHJcblx0XHRcdGlmIChuZXcgRGF0ZSAtIGxhc3RSZWRyYXdDYWxsVGltZSA+IEZSQU1FX0JVREdFVCB8fCAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcblx0XHRcdFx0aWYgKGxhc3RSZWRyYXdJZCA+IDApICRjYW5jZWxBbmltYXRpb25GcmFtZShsYXN0UmVkcmF3SWQpO1xyXG5cdFx0XHRcdGxhc3RSZWRyYXdJZCA9ICRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVkcmF3LCBGUkFNRV9CVURHRVQpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZWRyYXcoKTtcclxuXHRcdFx0bGFzdFJlZHJhd0lkID0gJHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtsYXN0UmVkcmF3SWQgPSBudWxsfSwgRlJBTUVfQlVER0VUKVxyXG5cdFx0fVxyXG5cdH07XHJcblx0bS5yZWRyYXcuc3RyYXRlZ3kgPSBtLnByb3AoKTtcclxuXHR2YXIgYmxhbmsgPSBmdW5jdGlvbigpIHtyZXR1cm4gXCJcIn1cclxuXHRmdW5jdGlvbiByZWRyYXcoKSB7XHJcblx0XHR2YXIgZm9yY2VSZWRyYXcgPSBtLnJlZHJhdy5zdHJhdGVneSgpID09PSBcImFsbFwiO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIHJvb3Q7IHJvb3QgPSByb290c1tpXTsgaSsrKSB7XHJcblx0XHRcdGlmIChjb250cm9sbGVyc1tpXSkge1xyXG5cdFx0XHRcdG0ucmVuZGVyKHJvb3QsIG1vZHVsZXNbaV0udmlldyA/IG1vZHVsZXNbaV0udmlldyhjb250cm9sbGVyc1tpXSkgOiBibGFuaygpLCBmb3JjZVJlZHJhdylcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly9hZnRlciByZW5kZXJpbmcgd2l0aGluIGEgcm91dGVkIGNvbnRleHQsIHdlIG5lZWQgdG8gc2Nyb2xsIGJhY2sgdG8gdGhlIHRvcCwgYW5kIGZldGNoIHRoZSBkb2N1bWVudCB0aXRsZSBmb3IgaGlzdG9yeS5wdXNoU3RhdGVcclxuXHRcdGlmIChjb21wdXRlUG9zdFJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rKCk7XHJcblx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGxcclxuXHRcdH1cclxuXHRcdGxhc3RSZWRyYXdJZCA9IG51bGw7XHJcblx0XHRsYXN0UmVkcmF3Q2FsbFRpbWUgPSBuZXcgRGF0ZTtcclxuXHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdH1cclxuXHJcblx0dmFyIHBlbmRpbmdSZXF1ZXN0cyA9IDA7XHJcblx0bS5zdGFydENvbXB1dGF0aW9uID0gZnVuY3Rpb24oKSB7cGVuZGluZ1JlcXVlc3RzKyt9O1xyXG5cdG0uZW5kQ29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdHBlbmRpbmdSZXF1ZXN0cyA9IE1hdGgubWF4KHBlbmRpbmdSZXF1ZXN0cyAtIDEsIDApO1xyXG5cdFx0aWYgKHBlbmRpbmdSZXF1ZXN0cyA9PT0gMCkgbS5yZWRyYXcoKVxyXG5cdH07XHJcblx0dmFyIGVuZEZpcnN0Q29tcHV0YXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmIChtLnJlZHJhdy5zdHJhdGVneSgpID09IFwibm9uZVwiKSB7XHJcblx0XHRcdHBlbmRpbmdSZXF1ZXN0cy0tXHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBtLmVuZENvbXB1dGF0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRtLndpdGhBdHRyID0gZnVuY3Rpb24ocHJvcCwgd2l0aEF0dHJDYWxsYmFjaykge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdHZhciBjdXJyZW50VGFyZ2V0ID0gZS5jdXJyZW50VGFyZ2V0IHx8IHRoaXM7XHJcblx0XHRcdHdpdGhBdHRyQ2FsbGJhY2socHJvcCBpbiBjdXJyZW50VGFyZ2V0ID8gY3VycmVudFRhcmdldFtwcm9wXSA6IGN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApKVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vcm91dGluZ1xyXG5cdHZhciBtb2RlcyA9IHtwYXRobmFtZTogXCJcIiwgaGFzaDogXCIjXCIsIHNlYXJjaDogXCI/XCJ9O1xyXG5cdHZhciByZWRpcmVjdCA9IGZ1bmN0aW9uKCkge30sIHJvdXRlUGFyYW1zLCBjdXJyZW50Um91dGU7XHJcblx0bS5yb3V0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly9tLnJvdXRlKClcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gY3VycmVudFJvdXRlO1xyXG5cdFx0Ly9tLnJvdXRlKGVsLCBkZWZhdWx0Um91dGUsIHJvdXRlcylcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgdHlwZS5jYWxsKGFyZ3VtZW50c1sxXSkgPT09IFNUUklORykge1xyXG5cdFx0XHR2YXIgcm9vdCA9IGFyZ3VtZW50c1swXSwgZGVmYXVsdFJvdXRlID0gYXJndW1lbnRzWzFdLCByb3V0ZXIgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdHJlZGlyZWN0ID0gZnVuY3Rpb24oc291cmNlKSB7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBjdXJyZW50Um91dGUgPSBub3JtYWxpemVSb3V0ZShzb3VyY2UpO1xyXG5cdFx0XHRcdGlmICghcm91dGVCeVZhbHVlKHJvb3QsIHJvdXRlciwgcGF0aCkpIHtcclxuXHRcdFx0XHRcdG0ucm91dGUoZGVmYXVsdFJvdXRlLCB0cnVlKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIGxpc3RlbmVyID0gbS5yb3V0ZS5tb2RlID09PSBcImhhc2hcIiA/IFwib25oYXNoY2hhbmdlXCIgOiBcIm9ucG9wc3RhdGVcIjtcclxuXHRcdFx0d2luZG93W2xpc3RlbmVyXSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gJGxvY2F0aW9uW20ucm91dGUubW9kZV1cclxuXHRcdFx0XHRpZiAobS5yb3V0ZS5tb2RlID09PSBcInBhdGhuYW1lXCIpIHBhdGggKz0gJGxvY2F0aW9uLnNlYXJjaFxyXG5cdFx0XHRcdGlmIChjdXJyZW50Um91dGUgIT0gbm9ybWFsaXplUm91dGUocGF0aCkpIHtcclxuXHRcdFx0XHRcdHJlZGlyZWN0KHBhdGgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBzZXRTY3JvbGw7XHJcblx0XHRcdHdpbmRvd1tsaXN0ZW5lcl0oKVxyXG5cdFx0fVxyXG5cdFx0Ly9jb25maWc6IG0ucm91dGVcclxuXHRcdGVsc2UgaWYgKGFyZ3VtZW50c1swXS5hZGRFdmVudExpc3RlbmVyKSB7XHJcblx0XHRcdHZhciBlbGVtZW50ID0gYXJndW1lbnRzWzBdO1xyXG5cdFx0XHR2YXIgaXNJbml0aWFsaXplZCA9IGFyZ3VtZW50c1sxXTtcclxuXHRcdFx0dmFyIGNvbnRleHQgPSBhcmd1bWVudHNbMl07XHJcblx0XHRcdGVsZW1lbnQuaHJlZiA9IChtLnJvdXRlLm1vZGUgIT09ICdwYXRobmFtZScgPyAkbG9jYXRpb24ucGF0aG5hbWUgOiAnJykgKyBtb2Rlc1ttLnJvdXRlLm1vZGVdICsgdGhpcy5hdHRycy5ocmVmO1xyXG5cdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKTtcclxuXHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdH1cclxuXHRcdC8vbS5yb3V0ZShyb3V0ZSwgcGFyYW1zKVxyXG5cdFx0ZWxzZSBpZiAodHlwZS5jYWxsKGFyZ3VtZW50c1swXSkgPT09IFNUUklORykge1xyXG5cdFx0XHR2YXIgb2xkUm91dGUgPSBjdXJyZW50Um91dGU7XHJcblx0XHRcdGN1cnJlbnRSb3V0ZSA9IGFyZ3VtZW50c1swXTtcclxuXHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHNbMV0gfHwge31cclxuXHRcdFx0dmFyIHF1ZXJ5SW5kZXggPSBjdXJyZW50Um91dGUuaW5kZXhPZihcIj9cIilcclxuXHRcdFx0dmFyIHBhcmFtcyA9IHF1ZXJ5SW5kZXggPiAtMSA/IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFJvdXRlLnNsaWNlKHF1ZXJ5SW5kZXggKyAxKSkgOiB7fVxyXG5cdFx0XHRmb3IgKHZhciBpIGluIGFyZ3MpIHBhcmFtc1tpXSA9IGFyZ3NbaV1cclxuXHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhwYXJhbXMpXHJcblx0XHRcdHZhciBjdXJyZW50UGF0aCA9IHF1ZXJ5SW5kZXggPiAtMSA/IGN1cnJlbnRSb3V0ZS5zbGljZSgwLCBxdWVyeUluZGV4KSA6IGN1cnJlbnRSb3V0ZVxyXG5cdFx0XHRpZiAocXVlcnlzdHJpbmcpIGN1cnJlbnRSb3V0ZSA9IGN1cnJlbnRQYXRoICsgKGN1cnJlbnRQYXRoLmluZGV4T2YoXCI/XCIpID09PSAtMSA/IFwiP1wiIDogXCImXCIpICsgcXVlcnlzdHJpbmc7XHJcblxyXG5cdFx0XHR2YXIgc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA9IChhcmd1bWVudHMubGVuZ3RoID09PSAzID8gYXJndW1lbnRzWzJdIDogYXJndW1lbnRzWzFdKSA9PT0gdHJ1ZSB8fCBvbGRSb3V0ZSA9PT0gYXJndW1lbnRzWzBdO1xyXG5cclxuXHRcdFx0aWYgKHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xyXG5cdFx0XHRcdGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0d2luZG93Lmhpc3Rvcnlbc2hvdWxkUmVwbGFjZUhpc3RvcnlFbnRyeSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiXShudWxsLCAkZG9jdW1lbnQudGl0bGUsIG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpO1xyXG5cdFx0XHRcdFx0c2V0U2Nyb2xsKClcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHJlZGlyZWN0KG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSAkbG9jYXRpb25bbS5yb3V0ZS5tb2RlXSA9IGN1cnJlbnRSb3V0ZVxyXG5cdFx0fVxyXG5cdH07XHJcblx0bS5yb3V0ZS5wYXJhbSA9IGZ1bmN0aW9uKGtleSkge1xyXG5cdFx0aWYgKCFyb3V0ZVBhcmFtcykgdGhyb3cgbmV3IEVycm9yKFwiWW91IG11c3QgY2FsbCBtLnJvdXRlKGVsZW1lbnQsIGRlZmF1bHRSb3V0ZSwgcm91dGVzKSBiZWZvcmUgY2FsbGluZyBtLnJvdXRlLnBhcmFtKClcIilcclxuXHRcdHJldHVybiByb3V0ZVBhcmFtc1trZXldXHJcblx0fTtcclxuXHRtLnJvdXRlLm1vZGUgPSBcInNlYXJjaFwiO1xyXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZVJvdXRlKHJvdXRlKSB7XHJcblx0XHRyZXR1cm4gcm91dGUuc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHJvdXRlQnlWYWx1ZShyb290LCByb3V0ZXIsIHBhdGgpIHtcclxuXHRcdHJvdXRlUGFyYW1zID0ge307XHJcblxyXG5cdFx0dmFyIHF1ZXJ5U3RhcnQgPSBwYXRoLmluZGV4T2YoXCI/XCIpO1xyXG5cdFx0aWYgKHF1ZXJ5U3RhcnQgIT09IC0xKSB7XHJcblx0XHRcdHJvdXRlUGFyYW1zID0gcGFyc2VRdWVyeVN0cmluZyhwYXRoLnN1YnN0cihxdWVyeVN0YXJ0ICsgMSwgcGF0aC5sZW5ndGgpKTtcclxuXHRcdFx0cGF0aCA9IHBhdGguc3Vic3RyKDAsIHF1ZXJ5U3RhcnQpXHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yICh2YXIgcm91dGUgaW4gcm91dGVyKSB7XHJcblx0XHRcdGlmIChyb3V0ZSA9PT0gcGF0aCkge1xyXG5cdFx0XHRcdG0ubW9kdWxlKHJvb3QsIHJvdXRlcltyb3V0ZV0pO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChcIl5cIiArIHJvdXRlLnJlcGxhY2UoLzpbXlxcL10rP1xcLnszfS9nLCBcIiguKj8pXCIpLnJlcGxhY2UoLzpbXlxcL10rL2csIFwiKFteXFxcXC9dKylcIikgKyBcIlxcLz8kXCIpO1xyXG5cclxuXHRcdFx0aWYgKG1hdGNoZXIudGVzdChwYXRoKSkge1xyXG5cdFx0XHRcdHBhdGgucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHZhciBrZXlzID0gcm91dGUubWF0Y2goLzpbXlxcL10rL2cpIHx8IFtdO1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlcyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxLCAtMik7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykgcm91dGVQYXJhbXNba2V5c1tpXS5yZXBsYWNlKC86fFxcLi9nLCBcIlwiKV0gPSBkZWNvZGVVUklDb21wb25lbnQodmFsdWVzW2ldKVxyXG5cdFx0XHRcdFx0bS5tb2R1bGUocm9vdCwgcm91dGVyW3JvdXRlXSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIHJvdXRlVW5vYnRydXNpdmUoZSkge1xyXG5cdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRpZiAoZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLndoaWNoID09PSAyKSByZXR1cm47XHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0ZWxzZSBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0XHR2YXIgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldCB8fCB0aGlzO1xyXG5cdFx0dmFyIGFyZ3MgPSBtLnJvdXRlLm1vZGUgPT09IFwicGF0aG5hbWVcIiAmJiBjdXJyZW50VGFyZ2V0LnNlYXJjaCA/IHBhcnNlUXVlcnlTdHJpbmcoY3VycmVudFRhcmdldC5zZWFyY2guc2xpY2UoMSkpIDoge307XHJcblx0XHRtLnJvdXRlKGN1cnJlbnRUYXJnZXRbbS5yb3V0ZS5tb2RlXS5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aCksIGFyZ3MpXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHNldFNjcm9sbCgpIHtcclxuXHRcdGlmIChtLnJvdXRlLm1vZGUgIT0gXCJoYXNoXCIgJiYgJGxvY2F0aW9uLmhhc2gpICRsb2NhdGlvbi5oYXNoID0gJGxvY2F0aW9uLmhhc2g7XHJcblx0XHRlbHNlIHdpbmRvdy5zY3JvbGxUbygwLCAwKVxyXG5cdH1cclxuXHRmdW5jdGlvbiBidWlsZFF1ZXJ5U3RyaW5nKG9iamVjdCwgcHJlZml4KSB7XHJcblx0XHR2YXIgc3RyID0gW107XHJcblx0XHRmb3IodmFyIHByb3AgaW4gb2JqZWN0KSB7XHJcblx0XHRcdHZhciBrZXkgPSBwcmVmaXggPyBwcmVmaXggKyBcIltcIiArIHByb3AgKyBcIl1cIiA6IHByb3AsIHZhbHVlID0gb2JqZWN0W3Byb3BdO1xyXG5cdFx0XHR2YXIgdmFsdWVUeXBlID0gdHlwZS5jYWxsKHZhbHVlKVxyXG5cdFx0XHR2YXIgcGFpciA9IHZhbHVlICE9IG51bGwgJiYgKHZhbHVlVHlwZSA9PT0gT0JKRUNUKSA/XHJcblx0XHRcdFx0YnVpbGRRdWVyeVN0cmluZyh2YWx1ZSwga2V5KSA6XHJcblx0XHRcdFx0dmFsdWVUeXBlID09PSBBUlJBWSA/XHJcblx0XHRcdFx0XHR2YWx1ZS5tYXAoZnVuY3Rpb24oaXRlbSkge3JldHVybiBlbmNvZGVVUklDb21wb25lbnQoa2V5ICsgXCJbXVwiKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGl0ZW0pfSkuam9pbihcIiZcIikgOlxyXG5cdFx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSlcclxuXHRcdFx0c3RyLnB1c2gocGFpcilcclxuXHRcdH1cclxuXHRcdHJldHVybiBzdHIuam9pbihcIiZcIilcclxuXHR9XHJcblx0XHJcblx0ZnVuY3Rpb24gcGFyc2VRdWVyeVN0cmluZyhzdHIpIHtcclxuXHRcdHZhciBwYWlycyA9IHN0ci5zcGxpdChcIiZcIiksIHBhcmFtcyA9IHt9O1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdHZhciBwYWlyID0gcGFpcnNbaV0uc3BsaXQoXCI9XCIpO1xyXG5cdFx0XHRwYXJhbXNbZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0pXSA9IHBhaXJbMV0gPyBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXSkgOiBcIlwiXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGFyYW1zXHJcblx0fVxyXG5cdGZ1bmN0aW9uIHJlc2V0KHJvb3QpIHtcclxuXHRcdHZhciBjYWNoZUtleSA9IGdldENlbGxDYWNoZUtleShyb290KTtcclxuXHRcdGNsZWFyKHJvb3QuY2hpbGROb2RlcywgY2VsbENhY2hlW2NhY2hlS2V5XSk7XHJcblx0XHRjZWxsQ2FjaGVbY2FjaGVLZXldID0gdW5kZWZpbmVkXHJcblx0fVxyXG5cclxuXHRtLmRlZmVycmVkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcblx0XHRkZWZlcnJlZC5wcm9taXNlID0gcHJvcGlmeShkZWZlcnJlZC5wcm9taXNlKTtcclxuXHRcdHJldHVybiBkZWZlcnJlZFxyXG5cdH07XHJcblx0ZnVuY3Rpb24gcHJvcGlmeShwcm9taXNlKSB7XHJcblx0XHR2YXIgcHJvcCA9IG0ucHJvcCgpO1xyXG5cdFx0cHJvbWlzZS50aGVuKHByb3ApO1xyXG5cdFx0cHJvcC50aGVuID0gZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcblx0XHRcdHJldHVybiBwcm9waWZ5KHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpKVxyXG5cdFx0fTtcclxuXHRcdHJldHVybiBwcm9wXHJcblx0fVxyXG5cdC8vUHJvbWl6Lm1pdGhyaWwuanMgfCBab2xtZWlzdGVyIHwgTUlUXHJcblx0Ly9hIG1vZGlmaWVkIHZlcnNpb24gb2YgUHJvbWl6LmpzLCB3aGljaCBkb2VzIG5vdCBjb25mb3JtIHRvIFByb21pc2VzL0ErIGZvciB0d28gcmVhc29uczpcclxuXHQvLzEpIGB0aGVuYCBjYWxsYmFja3MgYXJlIGNhbGxlZCBzeW5jaHJvbm91c2x5IChiZWNhdXNlIHNldFRpbWVvdXQgaXMgdG9vIHNsb3csIGFuZCB0aGUgc2V0SW1tZWRpYXRlIHBvbHlmaWxsIGlzIHRvbyBiaWdcclxuXHQvLzIpIHRocm93aW5nIHN1YmNsYXNzZXMgb2YgRXJyb3IgY2F1c2UgdGhlIGVycm9yIHRvIGJlIGJ1YmJsZWQgdXAgaW5zdGVhZCBvZiB0cmlnZ2VyaW5nIHJlamVjdGlvbiAoYmVjYXVzZSB0aGUgc3BlYyBkb2VzIG5vdCBhY2NvdW50IGZvciB0aGUgaW1wb3J0YW50IHVzZSBjYXNlIG9mIGRlZmF1bHQgYnJvd3NlciBlcnJvciBoYW5kbGluZywgaS5lLiBtZXNzYWdlIHcvIGxpbmUgbnVtYmVyKVxyXG5cdGZ1bmN0aW9uIERlZmVycmVkKHN1Y2Nlc3NDYWxsYmFjaywgZmFpbHVyZUNhbGxiYWNrKSB7XHJcblx0XHR2YXIgUkVTT0xWSU5HID0gMSwgUkVKRUNUSU5HID0gMiwgUkVTT0xWRUQgPSAzLCBSRUpFQ1RFRCA9IDQ7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXMsIHN0YXRlID0gMCwgcHJvbWlzZVZhbHVlID0gMCwgbmV4dCA9IFtdO1xyXG5cclxuXHRcdHNlbGZbXCJwcm9taXNlXCJdID0ge307XHJcblxyXG5cdFx0c2VsZltcInJlc29sdmVcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGZbXCJyZWplY3RcIl0gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAoIXN0YXRlKSB7XHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gdmFsdWU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYucHJvbWlzZVtcInRoZW5cIl0gPSBmdW5jdGlvbihzdWNjZXNzQ2FsbGJhY2ssIGZhaWx1cmVDYWxsYmFjaykge1xyXG5cdFx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2spO1xyXG5cdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVEVEKSB7XHJcblx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRuZXh0LnB1c2goZGVmZXJyZWQpXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmluaXNoKHR5cGUpIHtcclxuXHRcdFx0c3RhdGUgPSB0eXBlIHx8IFJFSkVDVEVEO1xyXG5cdFx0XHRuZXh0Lm1hcChmdW5jdGlvbihkZWZlcnJlZCkge1xyXG5cdFx0XHRcdHN0YXRlID09PSBSRVNPTFZFRCAmJiBkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSkgfHwgZGVmZXJyZWQucmVqZWN0KHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiB0aGVubmFibGUodGhlbiwgc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2ssIG5vdFRoZW5uYWJsZUNhbGxiYWNrKSB7XHJcblx0XHRcdGlmICgoKHByb21pc2VWYWx1ZSAhPSBudWxsICYmIHR5cGUuY2FsbChwcm9taXNlVmFsdWUpID09PSBPQkpFQ1QpIHx8IHR5cGVvZiBwcm9taXNlVmFsdWUgPT09IEZVTkNUSU9OKSAmJiB0eXBlb2YgdGhlbiA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0Ly8gY291bnQgcHJvdGVjdHMgYWdhaW5zdCBhYnVzZSBjYWxscyBmcm9tIHNwZWMgY2hlY2tlclxyXG5cdFx0XHRcdFx0dmFyIGNvdW50ID0gMDtcclxuXHRcdFx0XHRcdHRoZW4uY2FsbChwcm9taXNlVmFsdWUsIGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRzdWNjZXNzQ2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0fSwgZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb3VudCsrKSByZXR1cm47XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRmYWlsdXJlQ2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihlKTtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0XHRmYWlsdXJlQ2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRub3RUaGVubmFibGVDYWxsYmFjaygpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmaXJlKCkge1xyXG5cdFx0XHQvLyBjaGVjayBpZiBpdCdzIGEgdGhlbmFibGVcclxuXHRcdFx0dmFyIHRoZW47XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dGhlbiA9IHByb21pc2VWYWx1ZSAmJiBwcm9taXNlVmFsdWUudGhlblxyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdHByb21pc2VWYWx1ZSA9IGU7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblx0XHRcdFx0cmV0dXJuIGZpcmUoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzdGF0ZSA9IFJFU09MVklORztcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c3RhdGUgPSBSRUpFQ1RJTkc7XHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRpZiAoc3RhdGUgPT09IFJFU09MVklORyAmJiB0eXBlb2Ygc3VjY2Vzc0NhbGxiYWNrID09PSBGVU5DVElPTikge1xyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBzdWNjZXNzQ2FsbGJhY2socHJvbWlzZVZhbHVlKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoc3RhdGUgPT09IFJFSkVDVElORyAmJiB0eXBlb2YgZmFpbHVyZUNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZmFpbHVyZUNhbGxiYWNrKHByb21pc2VWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSk7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZpbmlzaCgpXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAocHJvbWlzZVZhbHVlID09PSBzZWxmKSB7XHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBUeXBlRXJyb3IoKTtcclxuXHRcdFx0XHRcdGZpbmlzaCgpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhlbm5hYmxlKHRoZW4sIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0ZmluaXNoKFJFU09MVkVEKVxyXG5cdFx0XHRcdFx0fSwgZmluaXNoLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdGZpbmlzaChzdGF0ZSA9PT0gUkVTT0xWSU5HICYmIFJFU09MVkVEKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cdG0uZGVmZXJyZWQub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmICh0eXBlLmNhbGwoZSkgPT09IFwiW29iamVjdCBFcnJvcl1cIiAmJiAhZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLm1hdGNoKC8gRXJyb3IvKSkgdGhyb3cgZVxyXG5cdH07XHJcblxyXG5cdG0uc3luYyA9IGZ1bmN0aW9uKGFyZ3MpIHtcclxuXHRcdHZhciBtZXRob2QgPSBcInJlc29sdmVcIjtcclxuXHRcdGZ1bmN0aW9uIHN5bmNocm9uaXplcihwb3MsIHJlc29sdmVkKSB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRcdHJlc3VsdHNbcG9zXSA9IHZhbHVlO1xyXG5cdFx0XHRcdGlmICghcmVzb2x2ZWQpIG1ldGhvZCA9IFwicmVqZWN0XCI7XHJcblx0XHRcdFx0aWYgKC0tb3V0c3RhbmRpbmcgPT09IDApIHtcclxuXHRcdFx0XHRcdGRlZmVycmVkLnByb21pc2UocmVzdWx0cyk7XHJcblx0XHRcdFx0XHRkZWZlcnJlZFttZXRob2RdKHJlc3VsdHMpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGRlZmVycmVkID0gbS5kZWZlcnJlZCgpO1xyXG5cdFx0dmFyIG91dHN0YW5kaW5nID0gYXJncy5sZW5ndGg7XHJcblx0XHR2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShvdXRzdGFuZGluZyk7XHJcblx0XHRpZiAoYXJncy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGFyZ3NbaV0udGhlbihzeW5jaHJvbml6ZXIoaSwgdHJ1ZSksIHN5bmNocm9uaXplcihpLCBmYWxzZSkpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2UgZGVmZXJyZWQucmVzb2x2ZShbXSk7XHJcblxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7cmV0dXJuIHZhbHVlfVxyXG5cclxuXHRmdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcclxuXHRcdGlmIChvcHRpb25zLmRhdGFUeXBlICYmIG9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiKSB7XHJcblx0XHRcdHZhciBjYWxsYmFja0tleSA9IFwibWl0aHJpbF9jYWxsYmFja19cIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgXCJfXCIgKyAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMWUxNikpLnRvU3RyaW5nKDM2KTtcclxuXHRcdFx0dmFyIHNjcmlwdCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG5cclxuXHRcdFx0d2luZG93W2NhbGxiYWNrS2V5XSA9IGZ1bmN0aW9uKHJlc3ApIHtcclxuXHRcdFx0XHRzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xyXG5cdFx0XHRcdG9wdGlvbnMub25sb2FkKHtcclxuXHRcdFx0XHRcdHR5cGU6IFwibG9hZFwiLFxyXG5cdFx0XHRcdFx0dGFyZ2V0OiB7XHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogcmVzcFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWRcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMub25lcnJvcih7XHJcblx0XHRcdFx0XHR0eXBlOiBcImVycm9yXCIsXHJcblx0XHRcdFx0XHR0YXJnZXQ6IHtcclxuXHRcdFx0XHRcdFx0c3RhdHVzOiA1MDAsXHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlVGV4dDogSlNPTi5zdHJpbmdpZnkoe2Vycm9yOiBcIkVycm9yIG1ha2luZyBqc29ucCByZXF1ZXN0XCJ9KVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHdpbmRvd1tjYWxsYmFja0tleV0gPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0c2NyaXB0Lm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNjcmlwdC5zcmMgPSBvcHRpb25zLnVybFxyXG5cdFx0XHRcdCsgKG9wdGlvbnMudXJsLmluZGV4T2YoXCI/XCIpID4gMCA/IFwiJlwiIDogXCI/XCIpXHJcblx0XHRcdFx0KyAob3B0aW9ucy5jYWxsYmFja0tleSA/IG9wdGlvbnMuY2FsbGJhY2tLZXkgOiBcImNhbGxiYWNrXCIpXHJcblx0XHRcdFx0KyBcIj1cIiArIGNhbGxiYWNrS2V5XHJcblx0XHRcdFx0KyBcIiZcIiArIGJ1aWxkUXVlcnlTdHJpbmcob3B0aW9ucy5kYXRhIHx8IHt9KTtcclxuXHRcdFx0JGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0O1xyXG5cdFx0XHR4aHIub3BlbihvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy51cmwsIHRydWUsIG9wdGlvbnMudXNlciwgb3B0aW9ucy5wYXNzd29yZCk7XHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuXHRcdFx0XHRcdGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSBvcHRpb25zLm9ubG9hZCh7dHlwZTogXCJsb2FkXCIsIHRhcmdldDogeGhyfSk7XHJcblx0XHRcdFx0XHRlbHNlIG9wdGlvbnMub25lcnJvcih7dHlwZTogXCJlcnJvclwiLCB0YXJnZXQ6IHhocn0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRpZiAob3B0aW9ucy5zZXJpYWxpemUgPT09IEpTT04uc3RyaW5naWZ5ICYmIG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLm1ldGhvZCAhPT0gXCJHRVRcIikge1xyXG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChvcHRpb25zLmRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0LypcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGVvZiBvcHRpb25zLmNvbmZpZyA9PT0gRlVOQ1RJT04pIHtcclxuXHRcdFx0XHR2YXIgbWF5YmVYaHIgPSBvcHRpb25zLmNvbmZpZyh4aHIsIG9wdGlvbnMpO1xyXG5cdFx0XHRcdGlmIChtYXliZVhociAhPSBudWxsKSB4aHIgPSBtYXliZVhoclxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgZGF0YSA9IG9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiIHx8ICFvcHRpb25zLmRhdGEgPyBcIlwiIDogb3B0aW9ucy5kYXRhXHJcblx0XHRcdGlmIChkYXRhICYmICh0eXBlLmNhbGwoZGF0YSkgIT0gU1RSSU5HICYmIGRhdGEuY29uc3RydWN0b3IgIT0gd2luZG93LkZvcm1EYXRhKSkge1xyXG5cdFx0XHRcdHRocm93IFwiUmVxdWVzdCBkYXRhIHNob3VsZCBiZSBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgRm9ybURhdGEuIENoZWNrIHRoZSBgc2VyaWFsaXplYCBvcHRpb24gaW4gYG0ucmVxdWVzdGBcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHR4aHIuc2VuZChkYXRhKTtcclxuXHRcdFx0cmV0dXJuIHhoclxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBiaW5kRGF0YSh4aHJPcHRpb25zLCBkYXRhLCBzZXJpYWxpemUpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLm1ldGhvZCA9PT0gXCJHRVRcIiAmJiB4aHJPcHRpb25zLmRhdGFUeXBlICE9IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgcHJlZml4ID0geGhyT3B0aW9ucy51cmwuaW5kZXhPZihcIj9cIikgPCAwID8gXCI/XCIgOiBcIiZcIjtcclxuXHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhkYXRhKTtcclxuXHRcdFx0eGhyT3B0aW9ucy51cmwgPSB4aHJPcHRpb25zLnVybCArIChxdWVyeXN0cmluZyA/IHByZWZpeCArIHF1ZXJ5c3RyaW5nIDogXCJcIilcclxuXHRcdH1cclxuXHRcdGVsc2UgeGhyT3B0aW9ucy5kYXRhID0gc2VyaWFsaXplKGRhdGEpO1xyXG5cdFx0cmV0dXJuIHhock9wdGlvbnNcclxuXHR9XHJcblx0ZnVuY3Rpb24gcGFyYW1ldGVyaXplVXJsKHVybCwgZGF0YSkge1xyXG5cdFx0dmFyIHRva2VucyA9IHVybC5tYXRjaCgvOlthLXpdXFx3Ky9naSk7XHJcblx0XHRpZiAodG9rZW5zICYmIGRhdGEpIHtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIga2V5ID0gdG9rZW5zW2ldLnNsaWNlKDEpO1xyXG5cdFx0XHRcdHVybCA9IHVybC5yZXBsYWNlKHRva2Vuc1tpXSwgZGF0YVtrZXldKTtcclxuXHRcdFx0XHRkZWxldGUgZGF0YVtrZXldXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB1cmxcclxuXHR9XHJcblxyXG5cdG0ucmVxdWVzdCA9IGZ1bmN0aW9uKHhock9wdGlvbnMpIHtcclxuXHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uc3RhcnRDb21wdXRhdGlvbigpO1xyXG5cdFx0dmFyIGRlZmVycmVkID0gbS5kZWZlcnJlZCgpO1xyXG5cdFx0dmFyIGlzSlNPTlAgPSB4aHJPcHRpb25zLmRhdGFUeXBlICYmIHhock9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiO1xyXG5cdFx0dmFyIHNlcmlhbGl6ZSA9IHhock9wdGlvbnMuc2VyaWFsaXplID0gaXNKU09OUCA/IGlkZW50aXR5IDogeGhyT3B0aW9ucy5zZXJpYWxpemUgfHwgSlNPTi5zdHJpbmdpZnk7XHJcblx0XHR2YXIgZGVzZXJpYWxpemUgPSB4aHJPcHRpb25zLmRlc2VyaWFsaXplID0gaXNKU09OUCA/IGlkZW50aXR5IDogeGhyT3B0aW9ucy5kZXNlcmlhbGl6ZSB8fCBKU09OLnBhcnNlO1xyXG5cdFx0dmFyIGV4dHJhY3QgPSB4aHJPcHRpb25zLmV4dHJhY3QgfHwgZnVuY3Rpb24oeGhyKSB7XHJcblx0XHRcdHJldHVybiB4aHIucmVzcG9uc2VUZXh0Lmxlbmd0aCA9PT0gMCAmJiBkZXNlcmlhbGl6ZSA9PT0gSlNPTi5wYXJzZSA/IG51bGwgOiB4aHIucmVzcG9uc2VUZXh0XHJcblx0XHR9O1xyXG5cdFx0eGhyT3B0aW9ucy51cmwgPSBwYXJhbWV0ZXJpemVVcmwoeGhyT3B0aW9ucy51cmwsIHhock9wdGlvbnMuZGF0YSk7XHJcblx0XHR4aHJPcHRpb25zID0gYmluZERhdGEoeGhyT3B0aW9ucywgeGhyT3B0aW9ucy5kYXRhLCBzZXJpYWxpemUpO1xyXG5cdFx0eGhyT3B0aW9ucy5vbmxvYWQgPSB4aHJPcHRpb25zLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZSA9IGUgfHwgZXZlbnQ7XHJcblx0XHRcdFx0dmFyIHVud3JhcCA9IChlLnR5cGUgPT09IFwibG9hZFwiID8geGhyT3B0aW9ucy51bndyYXBTdWNjZXNzIDogeGhyT3B0aW9ucy51bndyYXBFcnJvcikgfHwgaWRlbnRpdHk7XHJcblx0XHRcdFx0dmFyIHJlc3BvbnNlID0gdW53cmFwKGRlc2VyaWFsaXplKGV4dHJhY3QoZS50YXJnZXQsIHhock9wdGlvbnMpKSk7XHJcblx0XHRcdFx0aWYgKGUudHlwZSA9PT0gXCJsb2FkXCIpIHtcclxuXHRcdFx0XHRcdGlmICh0eXBlLmNhbGwocmVzcG9uc2UpID09PSBBUlJBWSAmJiB4aHJPcHRpb25zLnR5cGUpIHtcclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5sZW5ndGg7IGkrKykgcmVzcG9uc2VbaV0gPSBuZXcgeGhyT3B0aW9ucy50eXBlKHJlc3BvbnNlW2ldKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoeGhyT3B0aW9ucy50eXBlKSByZXNwb25zZSA9IG5ldyB4aHJPcHRpb25zLnR5cGUocmVzcG9uc2UpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRlZmVycmVkW2UudHlwZSA9PT0gXCJsb2FkXCIgPyBcInJlc29sdmVcIiA6IFwicmVqZWN0XCJdKHJlc3BvbnNlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhdGNoIChlKSB7XHJcblx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpO1xyXG5cdFx0XHRcdGRlZmVycmVkLnJlamVjdChlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh4aHJPcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uZW5kQ29tcHV0YXRpb24oKVxyXG5cdFx0fTtcclxuXHRcdGFqYXgoeGhyT3B0aW9ucyk7XHJcblx0XHRkZWZlcnJlZC5wcm9taXNlKHhock9wdGlvbnMuaW5pdGlhbFZhbHVlKTtcclxuXHRcdHJldHVybiBkZWZlcnJlZC5wcm9taXNlXHJcblx0fTtcclxuXHJcblx0Ly90ZXN0aW5nIEFQSVxyXG5cdG0uZGVwcyA9IGZ1bmN0aW9uKG1vY2spIHtcclxuXHRcdGluaXRpYWxpemUod2luZG93ID0gbW9jayB8fCB3aW5kb3cpO1xyXG5cdFx0cmV0dXJuIHdpbmRvdztcclxuXHR9O1xyXG5cdC8vZm9yIGludGVybmFsIHRlc3Rpbmcgb25seSwgZG8gbm90IHVzZSBgbS5kZXBzLmZhY3RvcnlgXHJcblx0bS5kZXBzLmZhY3RvcnkgPSBhcHA7XHJcblxyXG5cdHJldHVybiBtXHJcbn0pKHR5cGVvZiB3aW5kb3cgIT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KTtcclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IG07XHJcbmVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIG19KTtcclxuIiwidmFyIG0gPSByZXF1aXJlKCdtaXRocmlsJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG5cdHZhciB2bSA9IHtcblx0XHR2YWx1ZTogbS5wcm9wKCcnKSxcblx0XHRjbGVhcjogZnVuY3Rpb24gKCkge1xuXHRcdFx0dm0udmFsdWUoJycpXG5cdFx0fSxcblx0XHR0b0pTT046IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB2bS52YWx1ZSgpXG5cdFx0fSxcblx0XHRwb3B1bGF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdHZtLnZhbHVlKGRhdGEpXG5cdFx0fVxuXHR9XG5cdHZhciB2aWV3ID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBbXG5cdFx0XHRtKCdkaXYuZm9ybS1ncm91cCcsIFtcblx0XHRcdFx0bSgnbGFiZWwuY29udHJvbC1sYWJlbC5jb2wtc20tMicsIGNvbmZpZy5sYWJlbCksXG5cdFx0XHRcdG0oJ2Rpdi5jb2wtc20tOCcsIFtcblx0XHRcdFx0XHRtKCd0ZXh0YXJlYS5mb3JtLWNvbnRyb2xbcm93cz0xMl0nLCB7IG9uaW5wdXQ6IG0ud2l0aEF0dHIoJ3ZhbHVlJywgdm0udmFsdWUpLCByZXF1aXJlZDogY29uZmlnLnJlcXVpcmVkIH0sIHZtLnZhbHVlKCkpXG5cdFx0XHRcdF0pXG5cdFx0XHRdKVxuXHRcdF1cblx0fVxuXHRyZXR1cm4geyB2bTogdm0sIHZpZXc6IHZpZXcsIGNvbmZpZzogY29uZmlnLCB0b0pTT046IHZtLnRvSlNPTiB9XG59XG4iLCJ2YXIgbSA9IHJlcXVpcmUoJ21pdGhyaWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25maWcpIHtcblx0dmFyIHZtID0ge1xuXHRcdHZhbHVlOiBtLnByb3AoJycpLFxuXHRcdGNsZWFyOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2bS52YWx1ZSgnJylcblx0XHR9LFxuXHRcdHRvSlNPTjogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHZtLnZhbHVlKClcblx0XHR9LFxuXHRcdHBvcHVsYXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0dm0udmFsdWUoZGF0YSlcblx0XHR9XG5cdH1cblx0dmFyIHZpZXcgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIFtcblx0XHRcdG0oJ2Rpdi5mb3JtLWdyb3VwJywgW1xuXHRcdFx0XHRtKCdsYWJlbC5jb250cm9sLWxhYmVsLmNvbC1zbS0yJywgY29uZmlnLmxhYmVsKSxcblx0XHRcdFx0bSgnZGl2LmNvbC1zbS02JywgW1xuXHRcdFx0XHRcdG0oJ2lucHV0LmZvcm0tY29udHJvbCcsIHsgdHlwZTogY29uZmlnLnR5cGUsIHZhbHVlOiB2bS52YWx1ZSgpLCBvbmlucHV0OiBtLndpdGhBdHRyKCd2YWx1ZScsIHZtLnZhbHVlKSwgcmVxdWlyZWQ6IGNvbmZpZy5yZXF1aXJlZCB9KVxuXHRcdFx0XHRdKVxuXHRcdFx0XSlcblx0XHRdXG5cdH1cblx0cmV0dXJuIHsgdm06IHZtLCB2aWV3OiB2aWV3LCBjb25maWc6IGNvbmZpZywgdG9KU09OOiB2bS50b0pTT04gfVxufVxuIiwibW9kdWxlLmV4cG9ydHM9W3tcbiAgXCJpZFwiOiBcIjcwZWYwODUzLWJkYmUtNDIxYi1hM2FkLWNiNmI4N2YxMDBiMFwiLFxuICBcInRpdGxlXCI6IFwiTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQuXCIsXG4gIFwic3VtbWFyeVwiOiBcIk51bmMgcmhvbmN1cyBkdWkgdmVsIHNlbS5cIixcbiAgXCJib2R5XCI6IFwiUXVpc3F1ZSBpZCBqdXN0byBzaXQgYW1ldCBzYXBpZW4gZGlnbmlzc2ltIHZlc3RpYnVsdW0uIFZlc3RpYnVsdW0gYW50ZSBpcHN1bSBwcmltaXMgaW4gZmF1Y2lidXMgb3JjaSBsdWN0dXMgZXQgdWx0cmljZXMgcG9zdWVyZSBjdWJpbGlhIEN1cmFlOyBOdWxsYSBkYXBpYnVzIGRvbG9yIHZlbCBlc3QuIERvbmVjIG9kaW8ganVzdG8sIHNvbGxpY2l0dWRpbiB1dCwgc3VzY2lwaXQgYSwgZmV1Z2lhdCBldCwgZXJvcy5cXG5cXG5WZXN0aWJ1bHVtIGFjIGVzdCBsYWNpbmlhIG5pc2kgdmVuZW5hdGlzIHRyaXN0aXF1ZS4gRnVzY2UgY29uZ3VlLCBkaWFtIGlkIG9ybmFyZSBpbXBlcmRpZXQsIHNhcGllbiB1cm5hIHByZXRpdW0gbmlzbCwgdXQgdm9sdXRwYXQgc2FwaWVuIGFyY3Ugc2VkIGF1Z3VlLiBBbGlxdWFtIGVyYXQgdm9sdXRwYXQuXCIsXG4gIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTUtMDQtMDNUMjI6MjU6NTBaXCIsXG4gIFwidXBkYXRlZF9hdFwiOiBcIjIwMTUtMDQtMDRUMTY6NDA6MTBaXCJcbn0sIHtcbiAgXCJpZFwiOiBcIjhjOGIxYWM1LWZjNDEtNDdlMy1iZTcwLTMwMDkwZjEyNDQ5NVwiLFxuICBcInRpdGxlXCI6IFwiTWFlY2VuYXMgcmhvbmN1cyBhbGlxdWFtIGxhY3VzLlwiLFxuICBcInN1bW1hcnlcIjogXCJQcmFlc2VudCBpZCBtYXNzYSBpZCBuaXNsIHZlbmVuYXRpcyBsYWNpbmlhLiBBZW5lYW4gc2l0IGFtZXQganVzdG8uXCIsXG4gIFwiYm9keVwiOiBcIlBoYXNlbGx1cyBzaXQgYW1ldCBlcmF0LiBOdWxsYSB0ZW1wdXMuIFZpdmFtdXMgaW4gZmVsaXMgZXUgc2FwaWVuIGN1cnN1cyB2ZXN0aWJ1bHVtLlxcblxcblByb2luIGV1IG1pLiBOdWxsYSBhYyBlbmltLiBJbiB0ZW1wb3IsIHR1cnBpcyBuZWMgZXVpc21vZCBzY2VsZXJpc3F1ZSwgcXVhbSB0dXJwaXMgYWRpcGlzY2luZyBsb3JlbSwgdml0YWUgbWF0dGlzIG5pYmggbGlndWxhIG5lYyBzZW0uXFxuXFxuRHVpcyBhbGlxdWFtIGNvbnZhbGxpcyBudW5jLiBQcm9pbiBhdCB0dXJwaXMgYSBwZWRlIHBvc3VlcmUgbm9udW1teS4gSW50ZWdlciBub24gdmVsaXQuXCIsXG4gIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTUtMDQtMDNUMDg6MjE6MjlaXCIsXG4gIFwidXBkYXRlZF9hdFwiOiBcIjIwMTUtMDQtMDRUMDg6NDc6MTdaXCJcbn0sIHtcbiAgXCJpZFwiOiBcImNmNTZiYzE5LTJhZmEtNDg3MS1hMmZmLTBjZDkyYzM2MWE1MFwiLFxuICBcInRpdGxlXCI6IFwiTW9yYmkgdXQgb2Rpby5cIixcbiAgXCJzdW1tYXJ5XCI6IFwiQ3VtIHNvY2lpcyBuYXRvcXVlIHBlbmF0aWJ1cyBldCBtYWduaXMgZGlzIHBhcnR1cmllbnQgbW9udGVzLCBuYXNjZXR1ciByaWRpY3VsdXMgbXVzLiBFdGlhbSB2ZWwgYXVndWUuXCIsXG4gIFwiYm9keVwiOiBcIlByb2luIGxlbyBvZGlvLCBwb3J0dGl0b3IgaWQsIGNvbnNlcXVhdCBpbiwgY29uc2VxdWF0IHV0LCBudWxsYS4gU2VkIGFjY3Vtc2FuIGZlbGlzLiBVdCBhdCBkb2xvciBxdWlzIG9kaW8gY29uc2VxdWF0IHZhcml1cy5cXG5cXG5JbnRlZ2VyIGFjIGxlby4gUGVsbGVudGVzcXVlIHVsdHJpY2VzIG1hdHRpcyBvZGlvLiBEb25lYyB2aXRhZSBuaXNpLlxcblxcbk5hbSB1bHRyaWNlcywgbGliZXJvIG5vbiBtYXR0aXMgcHVsdmluYXIsIG51bGxhIHBlZGUgdWxsYW1jb3JwZXIgYXVndWUsIGEgc3VzY2lwaXQgbnVsbGEgZWxpdCBhYyBudWxsYS4gU2VkIHZlbCBlbmltIHNpdCBhbWV0IG51bmMgdml2ZXJyYSBkYXBpYnVzLiBOdWxsYSBzdXNjaXBpdCBsaWd1bGEgaW4gbGFjdXMuXCIsXG4gIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTUtMDQtMDNUMDE6MDY6NTZaXCIsXG4gIFwidXBkYXRlZF9hdFwiOiBcIjIwMTUtMDQtMDRUMDg6NTE6MzdaXCJcbn0sIHtcbiAgXCJpZFwiOiBcIjY5NjkzNTM5LTBhNjgtNDc4Mi05MDU4LWNlMzBlMjkwMDZkZlwiLFxuICBcInRpdGxlXCI6IFwiRHVpcyBhbGlxdWFtIGNvbnZhbGxpcyBudW5jLlwiLFxuICBcInN1bW1hcnlcIjogXCJQaGFzZWxsdXMgaW4gZmVsaXMuIERvbmVjIHNlbXBlciBzYXBpZW4gYSBsaWJlcm8uIE5hbSBkdWkuXCIsXG4gIFwiYm9keVwiOiBcIk51bGxhbSBwb3J0dGl0b3IgbGFjdXMgYXQgdHVycGlzLiBEb25lYyBwb3N1ZXJlIG1ldHVzIHZpdGFlIGlwc3VtLiBBbGlxdWFtIG5vbiBtYXVyaXMuXFxuXFxuTW9yYmkgbm9uIGxlY3R1cy4gQWxpcXVhbSBzaXQgYW1ldCBkaWFtIGluIG1hZ25hIGJpYmVuZHVtIGltcGVyZGlldC4gTnVsbGFtIG9yY2kgcGVkZSwgdmVuZW5hdGlzIG5vbiwgc29kYWxlcyBzZWQsIHRpbmNpZHVudCBldSwgZmVsaXMuXFxuXFxuRnVzY2UgcG9zdWVyZSBmZWxpcyBzZWQgbGFjdXMuIE1vcmJpIHNlbSBtYXVyaXMsIGxhb3JlZXQgdXQsIHJob25jdXMgYWxpcXVldCwgcHVsdmluYXIgc2VkLCBuaXNsLiBOdW5jIHJob25jdXMgZHVpIHZlbCBzZW0uXCIsXG4gIFwiY3JlYXRlZF9hdFwiOiBcIjIwMTUtMDQtMDNUMjI6NTA6MjNaXCJcbn0sIHtcbiAgXCJpZFwiOiBcImZlODg5NjgzLWQ0ZmItNGY5Yy1hNGU2LTQwOGM1ZjcxZjdhNFwiLFxuICBcInRpdGxlXCI6IFwiTmFtIGNvbmd1ZSwgcmlzdXMgc2VtcGVyIHBvcnRhIHZvbHV0cGF0LCBxdWFtIHBlZGUgbG9ib3J0aXMgbGlndWxhLCBzaXQgYW1ldCBlbGVpZmVuZCBwZWRlIGxpYmVybyBxdWlzIG9yY2kuXCIsXG4gIFwic3VtbWFyeVwiOiBcIlByb2luIHJpc3VzLiBQcmFlc2VudCBsZWN0dXMuIFZlc3RpYnVsdW0gcXVhbSBzYXBpZW4sIHZhcml1cyB1dCwgYmxhbmRpdCBub24sIGludGVyZHVtIGluLCBhbnRlLlwiLFxuICBcImJvZHlcIjogXCJNb3JiaSBub24gbGVjdHVzLiBBbGlxdWFtIHNpdCBhbWV0IGRpYW0gaW4gbWFnbmEgYmliZW5kdW0gaW1wZXJkaWV0LiBOdWxsYW0gb3JjaSBwZWRlLCB2ZW5lbmF0aXMgbm9uLCBzb2RhbGVzIHNlZCwgdGluY2lkdW50IGV1LCBmZWxpcy5cXG5cXG5GdXNjZSBwb3N1ZXJlIGZlbGlzIHNlZCBsYWN1cy4gTW9yYmkgc2VtIG1hdXJpcywgbGFvcmVldCB1dCwgcmhvbmN1cyBhbGlxdWV0LCBwdWx2aW5hciBzZWQsIG5pc2wuIE51bmMgcmhvbmN1cyBkdWkgdmVsIHNlbS5cIixcbiAgXCJjcmVhdGVkX2F0XCI6IFwiMjAxNS0wNC0wM1QwMzo0MjowMVpcIixcbiAgXCJ1cGRhdGVkX2F0XCI6IFwiMjAxNS0wNC0wNFQyMzo0MjoxNFpcIlxufV1cbiIsInZhciBtID0gcmVxdWlyZSgnbWl0aHJpbCcpXG5cblxudmFyIGFwcCA9IHt9XG5hcHAuY29udHJvbGxlciA9IGZ1bmN0aW9uICgpIHtcblx0YXBwLnZtLmluaXQoKVxufVxuXG5hcHAudm0gPSB7XG5cdGVudHJpZXM6IG0ucHJvcChbXSksXG5cdGFjdGl2ZTogbS5wcm9wKCksXG5cdHNhdmU6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXHRcdHZhciBhY3RpdmUgPSBhcHAudm0uYWN0aXZlKClcblx0XHR2YXIgZGF0YSA9IGFwcC52bS50b0pTT04oKVxuXG5cdFx0aWYgKGFjdGl2ZSA9PSBudWxsKSB7XG5cdFx0XHQvLyBuZXcgZW50cnlcblx0XHRcdGRhdGEuY3JlYXRlZF9hdCA9IChuZXcgRGF0ZSgpKS50b0lTT1N0cmluZygpXG5cdFx0XHRhcHAudm0uZW50cmllcygpLnB1c2goZGF0YSlcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyB1cGRhdGUgZXhpc3RpbmcgZW50cnlcblx0XHRcdHZhciBlbnRyeSA9IGFwcC52bS5lbnRyaWVzKClbYWN0aXZlXVxuXHRcdFx0T2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdGlmIChlbnRyeVtrZXldICE9PSBkYXRhW2tleV0pIHtcblx0XHRcdFx0XHRlbnRyeVtrZXldID0gZGF0YVtrZXldXG5cdFx0XHRcdFx0ZW50cnkudXBkYXRlZF9hdCA9IChuZXcgRGF0ZSgpKS50b0lTT1N0cmluZygpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0YXBwLnZtLmNsZWFyKClcblx0fSxcblx0ZWRpdDogZnVuY3Rpb24gKGksIGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdHZhciBkYXRhID0gYXBwLnZtLmVudHJpZXMoKVtpXVxuXHRcdGFwcC52bS5maWVsZHMuZm9yRWFjaChmdW5jdGlvbiAoZmllbGQpIHtcblx0XHRcdGZpZWxkLnZtLnBvcHVsYXRlKGRhdGFbZmllbGQuY29uZmlnLnByb3BlcnR5XSlcblx0XHR9KVxuXHRcdGFwcC52bS5hY3RpdmUoaSlcblx0XHRtLnJlZHJhdygpXG5cdH0sXG5cdHJlbW92ZTogZnVuY3Rpb24gKGksIGV2ZW50KSB7XG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdGFwcC52bS5lbnRyaWVzKCkuc3BsaWNlKGksIDEpXG5cdH0sXG5cdGNsZWFyOiBmdW5jdGlvbiAoKSB7XG5cdFx0YXBwLnZtLmZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuXHRcdFx0ZmllbGQudm0uY2xlYXIoKVxuXHRcdH0pXG5cdFx0YXBwLnZtLmFjdGl2ZShudWxsKVxuXHR9LFxuXHR0b0pTT046IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGF0YSA9IHt9XG5cdFx0YXBwLnZtLmZpZWxkcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZCkge1xuXHRcdFx0ZGF0YVtmaWVsZC5jb25maWcucHJvcGVydHldID0gZmllbGQudG9KU09OKClcblx0XHR9KVxuXHRcdHJldHVybiBkYXRhXG5cdH0sXG5cdGluaXQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgUG9zdCA9IHJlcXVpcmUoJy4vbW9kZWxzL3Bvc3QnKVxuXG5cdFx0dmFyIFRleHRGaWVsZCA9IHJlcXVpcmUoJy4vZmllbGRzL3RleHQnKVxuXHRcdHZhciBNYXJrZG93bkZpZWxkID0gcmVxdWlyZSgnLi9maWVsZHMvbWFya2Rvd24nKVxuXG5cdFx0dGhpcy5sYWJlbCA9IFBvc3QubGFiZWxcblx0XHR0aGlzLmZpZWxkcyA9IFBvc3QuZmllbGRzLm1hcChmdW5jdGlvbiAoZmllbGQpIHtcblx0XHRcdHN3aXRjaCAoZmllbGQudHlwZSkge1xuXHRcdFx0XHRjYXNlICd0ZXh0Jzpcblx0XHRcdFx0Y2FzZSAnZW1haWwnOlxuXHRcdFx0XHRcdHJldHVybiBuZXcgVGV4dEZpZWxkKGZpZWxkKVxuXHRcdFx0XHRjYXNlICdtYXJrZG93bic6XG5cdFx0XHRcdFx0cmV0dXJuIG5ldyBNYXJrZG93bkZpZWxkKGZpZWxkKVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHR0aGlzLmVudHJpZXMocmVxdWlyZSgnLi9maXh0dXJlcy9wb3N0cycpKVxuXHR9XG59XG5cbmFwcC52aWV3ID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgdm0gPSBhcHAudm1cblxuXHR2YXIgbGlzdGVkRmllbGRzID0gdm0uZmllbGRzLmZpbHRlcihmdW5jdGlvbiAoZmllbGQpIHtcblx0XHRyZXR1cm4gZmllbGQuY29uZmlnLmxpc3RlZFxuXHR9KVxuXG5cdHJldHVybiBtKCcuY29udGFpbmVyJywgW1xuXHRcdG0oJ2Rpdi5wYWdlLWhlYWRlcicsIFtcblx0XHRcdG0oJ2gxJywgdm0ubGFiZWwgKyAncycpXG5cdFx0XSksXG5cdFx0KHZtLmVudHJpZXMoKS5sZW5ndGggPyBtKCd0YWJsZS50YWJsZS50YWJsZS1zdHJpcGVkLnRhYmxlLWhvdmVyJywgW1xuXHRcdFx0bSgndGhlYWQnLCBbXG5cdFx0XHRcdG0oJ3RyJywgW1xuXHRcdFx0XHRcdGxpc3RlZEZpZWxkcy5tYXAoZnVuY3Rpb24gKGZpZWxkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbSgndGgnLCBmaWVsZC5jb25maWcubGFiZWwpXG5cdFx0XHRcdFx0fSksXG5cdFx0XHRcdFx0bSgndGhbY29sc3Bhbj1cIjJcIl0nKVxuXHRcdFx0XHRdKVxuXHRcdFx0XSksXG5cdFx0XHRtKCd0Ym9keScsIFtcblx0XHRcdFx0dm0uZW50cmllcygpLm1hcChmdW5jdGlvbiAocG9zdCwgaSkge1xuXHRcdFx0XHRcdHJldHVybiBtKCd0cicsIHsgY2xhc3M6IHZtLmFjdGl2ZSgpID09PSBpID8gJ3dhcm5pbmcnIDogbnVsbCB9LCBbXG5cdFx0XHRcdFx0XHRsaXN0ZWRGaWVsZHMubWFwKGZ1bmN0aW9uIChmaWVsZCkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbSgndGQnLCBwb3N0W2ZpZWxkLmNvbmZpZy5wcm9wZXJ0eV0pXG5cdFx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRcdG0oJ3RkJywgW1xuXHRcdFx0XHRcdFx0XHRtKCdhW2hyZWY9XCIjXCJdJywgeyBvbmNsaWNrOiB2bS5lZGl0LmJpbmQodGhpcywgaSkgfSwgW1xuXHRcdFx0XHRcdFx0XHRcdG0oJ2kuZ2x5cGhpY29uLmdseXBoaWNvbi1lZGl0Jylcblx0XHRcdFx0XHRcdFx0XSlcblx0XHRcdFx0XHRcdF0pLFxuXHRcdFx0XHRcdFx0bSgndGQnLCBbXG5cdFx0XHRcdFx0XHRcdG0oJ2FbaHJlZj1cIiNcIl0nLCB7IG9uY2xpY2s6IHZtLnJlbW92ZS5iaW5kKHRoaXMsIGkpIH0sIFtcblx0XHRcdFx0XHRcdFx0XHRtKCdpLmdseXBoaWNvbi5nbHlwaGljb24tdHJhc2gnKVxuXHRcdFx0XHRcdFx0XHRdKVxuXHRcdFx0XHRcdFx0XSlcblx0XHRcdFx0XHRdKVxuXHRcdFx0XHR9KVxuXHRcdFx0XSlcblx0XHRdKSA6IG51bGwpLFxuXHRcdG0oJ2Rpdi53ZWxsJywgW1xuXHRcdFx0bSgnZm9ybS5mb3JtLWhvcml6b250YWwnLCB7IG9uc3VibWl0OiB2bS5zYXZlIH0sIFtcblx0XHRcdFx0bSgnZmllbGRzZXQnLCBbXG5cdFx0XHRcdFx0bSgnbGVnZW5kJywgW1xuXHRcdFx0XHRcdFx0dm0uYWN0aXZlKCkgIT0gbnVsbFxuXHRcdFx0XHRcdFx0XHQ/IG0oJ2J1dHRvbi5idG4uYnRuLXhzLmJ0bi1kYW5nZXIucHVsbC1yaWdodCcsIHsgdHlwZTogJ2J1dHRvbicsIG9uY2xpY2s6IHZtLmNsZWFyIH0sICdDYW5jZWwnKVxuXHRcdFx0XHRcdFx0XHQ6IG51bGwsXG5cdFx0XHRcdFx0XHR2bS5hY3RpdmUoKSAhPSBudWxsXG5cdFx0XHRcdFx0XHRcdD8gKCdFZGl0aW5nICcgKyB2bS5sYWJlbC50b0xvd2VyQ2FzZSgpICsgJyAjJyArICh2bS5hY3RpdmUoKSArIDEpKVxuXHRcdFx0XHRcdFx0XHQ6ICgnTmV3ICcgKyB2bS5sYWJlbC50b0xvd2VyQ2FzZSgpKVxuXHRcdFx0XHRcdF0pLFxuXHRcdFx0XHRcdHZtLmZpZWxkcy5tYXAoZnVuY3Rpb24gKGZpZWxkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZmllbGQgJiYgZmllbGQudmlldyAmJiBmaWVsZC52aWV3KClcblx0XHRcdFx0XHR9KSxcblx0XHRcdFx0XHRtKCdkaXYuZm9ybS1ncm91cCcsIFtcblx0XHRcdFx0XHRcdG0oJ2Rpdi5jb2wtc20tb2Zmc2V0LTIuY29sLXNtLTInLCBbXG5cdFx0XHRcdFx0XHRcdG0oJ2J1dHRvbi5idG4uYnRuLXN1Y2Nlc3MuYnRuLWxnJywgeyB0eXBlOiAnc3VibWl0JyB9LCAnU2F2ZScpXG5cdFx0XHRcdFx0XHRdKVxuXHRcdFx0XHRcdF0pXG5cdFx0XHRcdF0pXG5cdFx0XHRdKVxuXHRcdF0pLFxuXHRcdG0oJ3ByZScsIEpTT04uc3RyaW5naWZ5KHZtLmVudHJpZXMoKSwgbnVsbCwgJyAgJykpXG5cdF0pXG59XG5cblxubS5tb2R1bGUoZG9jdW1lbnQuYm9keSwgYXBwKVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGxhYmVsOiAnQmxvZyBwb3N0Jyxcblx0cHJvcGVydHk6ICdwb3N0cycsXG5cdHR5cGU6ICdjb2xsZWN0aW9uJyxcblx0ZmllbGRzOiBbXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdUaXRsZScsXG5cdFx0XHRwcm9wZXJ0eTogJ3RpdGxlJyxcblx0XHRcdHR5cGU6ICd0ZXh0Jyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlLFxuXHRcdFx0bGlzdGVkOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ1N1bW1hcnknLFxuXHRcdFx0cHJvcGVydHk6ICdzdW1tYXJ5Jyxcblx0XHRcdHR5cGU6ICd0ZXh0Jyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlLFxuXHRcdFx0bGlzdGVkOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ1Bvc3QgYm9keScsXG5cdFx0XHRwcm9wZXJ0eTogJ2JvZHknLFxuXHRcdFx0dHlwZTogJ21hcmtkb3duJyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0fVxuXHRdXG59XG4iXX0=
