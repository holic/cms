(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


//
// Generated on Tue Dec 16 2014 12:13:47 GMT+0100 (CET) by Charlie Robbins, Paolo Fragomeni & the Contributors (Using Codesurgeon).
// Version 1.2.6
//

(function (exports) {

/*
 * browser.js: Browser specific functionality for director.
 *
 * (C) 2011, Charlie Robbins, Paolo Fragomeni, & the Contributors.
 * MIT LICENSE
 *
 */

var dloc = document.location;

function dlocHashEmpty() {
  // Non-IE browsers return '' when the address bar shows '#'; Director's logic
  // assumes both mean empty.
  return dloc.hash === '' || dloc.hash === '#';
}

var listener = {
  mode: 'modern',
  hash: dloc.hash,
  history: false,

  check: function () {
    var h = dloc.hash;
    if (h != this.hash) {
      this.hash = h;
      this.onHashChanged();
    }
  },

  fire: function () {
    if (this.mode === 'modern') {
      this.history === true ? window.onpopstate() : window.onhashchange();
    }
    else {
      this.onHashChanged();
    }
  },

  init: function (fn, history) {
    var self = this;
    this.history = history;

    if (!Router.listeners) {
      Router.listeners = [];
    }

    function onchange(onChangeEvent) {
      for (var i = 0, l = Router.listeners.length; i < l; i++) {
        Router.listeners[i](onChangeEvent);
      }
    }

    //note IE8 is being counted as 'modern' because it has the hashchange event
    if ('onhashchange' in window && (document.documentMode === undefined
      || document.documentMode > 7)) {
      // At least for now HTML5 history is available for 'modern' browsers only
      if (this.history === true) {
        // There is an old bug in Chrome that causes onpopstate to fire even
        // upon initial page load. Since the handler is run manually in init(),
        // this would cause Chrome to run it twise. Currently the only
        // workaround seems to be to set the handler after the initial page load
        // http://code.google.com/p/chromium/issues/detail?id=63040
        setTimeout(function() {
          window.onpopstate = onchange;
        }, 500);
      }
      else {
        window.onhashchange = onchange;
      }
      this.mode = 'modern';
    }
    else {
      //
      // IE support, based on a concept by Erik Arvidson ...
      //
      var frame = document.createElement('iframe');
      frame.id = 'state-frame';
      frame.style.display = 'none';
      document.body.appendChild(frame);
      this.writeFrame('');

      if ('onpropertychange' in document && 'attachEvent' in document) {
        document.attachEvent('onpropertychange', function () {
          if (event.propertyName === 'location') {
            self.check();
          }
        });
      }

      window.setInterval(function () { self.check(); }, 50);

      this.onHashChanged = onchange;
      this.mode = 'legacy';
    }

    Router.listeners.push(fn);

    return this.mode;
  },

  destroy: function (fn) {
    if (!Router || !Router.listeners) {
      return;
    }

    var listeners = Router.listeners;

    for (var i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i] === fn) {
        listeners.splice(i, 1);
      }
    }
  },

  setHash: function (s) {
    // Mozilla always adds an entry to the history
    if (this.mode === 'legacy') {
      this.writeFrame(s);
    }

    if (this.history === true) {
      window.history.pushState({}, document.title, s);
      // Fire an onpopstate event manually since pushing does not obviously
      // trigger the pop event.
      this.fire();
    } else {
      dloc.hash = (s[0] === '/') ? s : '/' + s;
    }
    return this;
  },

  writeFrame: function (s) {
    // IE support...
    var f = document.getElementById('state-frame');
    var d = f.contentDocument || f.contentWindow.document;
    d.open();
    d.write("<script>_hash = '" + s + "'; onload = parent.listener.syncHash;<script>");
    d.close();
  },

  syncHash: function () {
    // IE support...
    var s = this._hash;
    if (s != dloc.hash) {
      dloc.hash = s;
    }
    return this;
  },

  onHashChanged: function () {}
};

var Router = exports.Router = function (routes) {
  if (!(this instanceof Router)) return new Router(routes);

  this.params   = {};
  this.routes   = {};
  this.methods  = ['on', 'once', 'after', 'before'];
  this.scope    = [];
  this._methods = {};

  this._insert = this.insert;
  this.insert = this.insertEx;

  this.historySupport = (window.history != null ? window.history.pushState : null) != null

  this.configure();
  this.mount(routes || {});
};

Router.prototype.init = function (r) {
  var self = this
    , routeTo;
  this.handler = function(onChangeEvent) {
    var newURL = onChangeEvent && onChangeEvent.newURL || window.location.hash;
    var url = self.history === true ? self.getPath() : newURL.replace(/.*#/, '');
    self.dispatch('on', url.charAt(0) === '/' ? url : '/' + url);
  };

  listener.init(this.handler, this.history);

  if (this.history === false) {
    if (dlocHashEmpty() && r) {
      dloc.hash = r;
    } else if (!dlocHashEmpty()) {
      self.dispatch('on', '/' + dloc.hash.replace(/^(#\/|#|\/)/, ''));
    }
  }
  else {
    if (this.convert_hash_in_init) {
      // Use hash as route
      routeTo = dlocHashEmpty() && r ? r : !dlocHashEmpty() ? dloc.hash.replace(/^#/, '') : null;
      if (routeTo) {
        window.history.replaceState({}, document.title, routeTo);
      }
    }
    else {
      // Use canonical url
      routeTo = this.getPath();
    }

    // Router has been initialized, but due to the chrome bug it will not
    // yet actually route HTML5 history state changes. Thus, decide if should route.
    if (routeTo || this.run_in_init === true) {
      this.handler();
    }
  }

  return this;
};

Router.prototype.explode = function () {
  var v = this.history === true ? this.getPath() : dloc.hash;
  if (v.charAt(1) === '/') { v=v.slice(1) }
  return v.slice(1, v.length).split("/");
};

Router.prototype.setRoute = function (i, v, val) {
  var url = this.explode();

  if (typeof i === 'number' && typeof v === 'string') {
    url[i] = v;
  }
  else if (typeof val === 'string') {
    url.splice(i, v, s);
  }
  else {
    url = [i];
  }

  listener.setHash(url.join('/'));
  return url;
};

//
// ### function insertEx(method, path, route, parent)
// #### @method {string} Method to insert the specific `route`.
// #### @path {Array} Parsed path to insert the `route` at.
// #### @route {Array|function} Route handlers to insert.
// #### @parent {Object} **Optional** Parent "routes" to insert into.
// insert a callback that will only occur once per the matched route.
//
Router.prototype.insertEx = function(method, path, route, parent) {
  if (method === "once") {
    method = "on";
    route = function(route) {
      var once = false;
      return function() {
        if (once) return;
        once = true;
        return route.apply(this, arguments);
      };
    }(route);
  }
  return this._insert(method, path, route, parent);
};

Router.prototype.getRoute = function (v) {
  var ret = v;

  if (typeof v === "number") {
    ret = this.explode()[v];
  }
  else if (typeof v === "string"){
    var h = this.explode();
    ret = h.indexOf(v);
  }
  else {
    ret = this.explode();
  }

  return ret;
};

Router.prototype.destroy = function () {
  listener.destroy(this.handler);
  return this;
};

Router.prototype.getPath = function () {
  var path = window.location.pathname;
  if (path.substr(0, 1) !== '/') {
    path = '/' + path;
  }
  return path;
};
function _every(arr, iterator) {
  for (var i = 0; i < arr.length; i += 1) {
    if (iterator(arr[i], i, arr) === false) {
      return;
    }
  }
}

function _flatten(arr) {
  var flat = [];
  for (var i = 0, n = arr.length; i < n; i++) {
    flat = flat.concat(arr[i]);
  }
  return flat;
}

function _asyncEverySeries(arr, iterator, callback) {
  if (!arr.length) {
    return callback();
  }
  var completed = 0;
  (function iterate() {
    iterator(arr[completed], function(err) {
      if (err || err === false) {
        callback(err);
        callback = function() {};
      } else {
        completed += 1;
        if (completed === arr.length) {
          callback();
        } else {
          iterate();
        }
      }
    });
  })();
}

function paramifyString(str, params, mod) {
  mod = str;
  for (var param in params) {
    if (params.hasOwnProperty(param)) {
      mod = params[param](str);
      if (mod !== str) {
        break;
      }
    }
  }
  return mod === str ? "([._a-zA-Z0-9-%()]+)" : mod;
}

function regifyString(str, params) {
  var matches, last = 0, out = "";
  while (matches = str.substr(last).match(/[^\w\d\- %@&]*\*[^\w\d\- %@&]*/)) {
    last = matches.index + matches[0].length;
    matches[0] = matches[0].replace(/^\*/, "([_.()!\\ %@&a-zA-Z0-9-]+)");
    out += str.substr(0, matches.index) + matches[0];
  }
  str = out += str.substr(last);
  var captures = str.match(/:([^\/]+)/ig), capture, length;
  if (captures) {
    length = captures.length;
    for (var i = 0; i < length; i++) {
      capture = captures[i];
      if (capture.slice(0, 2) === "::") {
        str = capture.slice(1);
      } else {
        str = str.replace(capture, paramifyString(capture, params));
      }
    }
  }
  return str;
}

function terminator(routes, delimiter, start, stop) {
  var last = 0, left = 0, right = 0, start = (start || "(").toString(), stop = (stop || ")").toString(), i;
  for (i = 0; i < routes.length; i++) {
    var chunk = routes[i];
    if (chunk.indexOf(start, last) > chunk.indexOf(stop, last) || ~chunk.indexOf(start, last) && !~chunk.indexOf(stop, last) || !~chunk.indexOf(start, last) && ~chunk.indexOf(stop, last)) {
      left = chunk.indexOf(start, last);
      right = chunk.indexOf(stop, last);
      if (~left && !~right || !~left && ~right) {
        var tmp = routes.slice(0, (i || 1) + 1).join(delimiter);
        routes = [ tmp ].concat(routes.slice((i || 1) + 1));
      }
      last = (right > left ? right : left) + 1;
      i = 0;
    } else {
      last = 0;
    }
  }
  return routes;
}

var QUERY_SEPARATOR = /\?.*/;

Router.prototype.configure = function(options) {
  options = options || {};
  for (var i = 0; i < this.methods.length; i++) {
    this._methods[this.methods[i]] = true;
  }
  this.recurse = options.recurse || this.recurse || false;
  this.async = options.async || false;
  this.delimiter = options.delimiter || "/";
  this.strict = typeof options.strict === "undefined" ? true : options.strict;
  this.notfound = options.notfound;
  this.resource = options.resource;
  this.history = options.html5history && this.historySupport || false;
  this.run_in_init = this.history === true && options.run_handler_in_init !== false;
  this.convert_hash_in_init = this.history === true && options.convert_hash_in_init !== false;
  this.every = {
    after: options.after || null,
    before: options.before || null,
    on: options.on || null
  };
  return this;
};

Router.prototype.param = function(token, matcher) {
  if (token[0] !== ":") {
    token = ":" + token;
  }
  var compiled = new RegExp(token, "g");
  this.params[token] = function(str) {
    return str.replace(compiled, matcher.source || matcher);
  };
  return this;
};

Router.prototype.on = Router.prototype.route = function(method, path, route) {
  var self = this;
  if (!route && typeof path == "function") {
    route = path;
    path = method;
    method = "on";
  }
  if (Array.isArray(path)) {
    return path.forEach(function(p) {
      self.on(method, p, route);
    });
  }
  if (path.source) {
    path = path.source.replace(/\\\//ig, "/");
  }
  if (Array.isArray(method)) {
    return method.forEach(function(m) {
      self.on(m.toLowerCase(), path, route);
    });
  }
  path = path.split(new RegExp(this.delimiter));
  path = terminator(path, this.delimiter);
  this.insert(method, this.scope.concat(path), route);
};

Router.prototype.path = function(path, routesFn) {
  var self = this, length = this.scope.length;
  if (path.source) {
    path = path.source.replace(/\\\//ig, "/");
  }
  path = path.split(new RegExp(this.delimiter));
  path = terminator(path, this.delimiter);
  this.scope = this.scope.concat(path);
  routesFn.call(this, this);
  this.scope.splice(length, path.length);
};

Router.prototype.dispatch = function(method, path, callback) {
  var self = this, fns = this.traverse(method, path.replace(QUERY_SEPARATOR, ""), this.routes, ""), invoked = this._invoked, after;
  this._invoked = true;
  if (!fns || fns.length === 0) {
    this.last = [];
    if (typeof this.notfound === "function") {
      this.invoke([ this.notfound ], {
        method: method,
        path: path
      }, callback);
    }
    return false;
  }
  if (this.recurse === "forward") {
    fns = fns.reverse();
  }
  function updateAndInvoke() {
    self.last = fns.after;
    self.invoke(self.runlist(fns), self, callback);
  }
  after = this.every && this.every.after ? [ this.every.after ].concat(this.last) : [ this.last ];
  if (after && after.length > 0 && invoked) {
    if (this.async) {
      this.invoke(after, this, updateAndInvoke);
    } else {
      this.invoke(after, this);
      updateAndInvoke();
    }
    return true;
  }
  updateAndInvoke();
  return true;
};

Router.prototype.invoke = function(fns, thisArg, callback) {
  var self = this;
  var apply;
  if (this.async) {
    apply = function(fn, next) {
      if (Array.isArray(fn)) {
        return _asyncEverySeries(fn, apply, next);
      } else if (typeof fn == "function") {
        fn.apply(thisArg, (fns.captures || []).concat(next));
      }
    };
    _asyncEverySeries(fns, apply, function() {
      if (callback) {
        callback.apply(thisArg, arguments);
      }
    });
  } else {
    apply = function(fn) {
      if (Array.isArray(fn)) {
        return _every(fn, apply);
      } else if (typeof fn === "function") {
        return fn.apply(thisArg, fns.captures || []);
      } else if (typeof fn === "string" && self.resource) {
        self.resource[fn].apply(thisArg, fns.captures || []);
      }
    };
    _every(fns, apply);
  }
};

Router.prototype.traverse = function(method, path, routes, regexp, filter) {
  var fns = [], current, exact, match, next, that;
  function filterRoutes(routes) {
    if (!filter) {
      return routes;
    }
    function deepCopy(source) {
      var result = [];
      for (var i = 0; i < source.length; i++) {
        result[i] = Array.isArray(source[i]) ? deepCopy(source[i]) : source[i];
      }
      return result;
    }
    function applyFilter(fns) {
      for (var i = fns.length - 1; i >= 0; i--) {
        if (Array.isArray(fns[i])) {
          applyFilter(fns[i]);
          if (fns[i].length === 0) {
            fns.splice(i, 1);
          }
        } else {
          if (!filter(fns[i])) {
            fns.splice(i, 1);
          }
        }
      }
    }
    var newRoutes = deepCopy(routes);
    newRoutes.matched = routes.matched;
    newRoutes.captures = routes.captures;
    newRoutes.after = routes.after.filter(filter);
    applyFilter(newRoutes);
    return newRoutes;
  }
  if (path === this.delimiter && routes[method]) {
    next = [ [ routes.before, routes[method] ].filter(Boolean) ];
    next.after = [ routes.after ].filter(Boolean);
    next.matched = true;
    next.captures = [];
    return filterRoutes(next);
  }
  for (var r in routes) {
    if (routes.hasOwnProperty(r) && (!this._methods[r] || this._methods[r] && typeof routes[r] === "object" && !Array.isArray(routes[r]))) {
      current = exact = regexp + this.delimiter + r;
      if (!this.strict) {
        exact += "[" + this.delimiter + "]?";
      }
      match = path.match(new RegExp("^" + exact));
      if (!match) {
        continue;
      }
      if (match[0] && match[0] == path && routes[r][method]) {
        next = [ [ routes[r].before, routes[r][method] ].filter(Boolean) ];
        next.after = [ routes[r].after ].filter(Boolean);
        next.matched = true;
        next.captures = match.slice(1);
        if (this.recurse && routes === this.routes) {
          next.push([ routes.before, routes.on ].filter(Boolean));
          next.after = next.after.concat([ routes.after ].filter(Boolean));
        }
        return filterRoutes(next);
      }
      next = this.traverse(method, path, routes[r], current);
      if (next.matched) {
        if (next.length > 0) {
          fns = fns.concat(next);
        }
        if (this.recurse) {
          fns.push([ routes[r].before, routes[r].on ].filter(Boolean));
          next.after = next.after.concat([ routes[r].after ].filter(Boolean));
          if (routes === this.routes) {
            fns.push([ routes["before"], routes["on"] ].filter(Boolean));
            next.after = next.after.concat([ routes["after"] ].filter(Boolean));
          }
        }
        fns.matched = true;
        fns.captures = next.captures;
        fns.after = next.after;
        return filterRoutes(fns);
      }
    }
  }
  return false;
};

Router.prototype.insert = function(method, path, route, parent) {
  var methodType, parentType, isArray, nested, part;
  path = path.filter(function(p) {
    return p && p.length > 0;
  });
  parent = parent || this.routes;
  part = path.shift();
  if (/\:|\*/.test(part) && !/\\d|\\w/.test(part)) {
    part = regifyString(part, this.params);
  }
  if (path.length > 0) {
    parent[part] = parent[part] || {};
    return this.insert(method, path, route, parent[part]);
  }
  if (!part && !path.length && parent === this.routes) {
    methodType = typeof parent[method];
    switch (methodType) {
     case "function":
      parent[method] = [ parent[method], route ];
      return;
     case "object":
      parent[method].push(route);
      return;
     case "undefined":
      parent[method] = route;
      return;
    }
    return;
  }
  parentType = typeof parent[part];
  isArray = Array.isArray(parent[part]);
  if (parent[part] && !isArray && parentType == "object") {
    methodType = typeof parent[part][method];
    switch (methodType) {
     case "function":
      parent[part][method] = [ parent[part][method], route ];
      return;
     case "object":
      parent[part][method].push(route);
      return;
     case "undefined":
      parent[part][method] = route;
      return;
    }
  } else if (parentType == "undefined") {
    nested = {};
    nested[method] = route;
    parent[part] = nested;
    return;
  }
  throw new Error("Invalid route context: " + parentType);
};



Router.prototype.extend = function(methods) {
  var self = this, len = methods.length, i;
  function extend(method) {
    self._methods[method] = true;
    self[method] = function() {
      var extra = arguments.length === 1 ? [ method, "" ] : [ method ];
      self.on.apply(self, extra.concat(Array.prototype.slice.call(arguments)));
    };
  }
  for (i = 0; i < len; i++) {
    extend(methods[i]);
  }
};

Router.prototype.runlist = function(fns) {
  var runlist = this.every && this.every.before ? [ this.every.before ].concat(_flatten(fns)) : _flatten(fns);
  if (this.every && this.every.on) {
    runlist.push(this.every.on);
  }
  runlist.captures = fns.captures;
  runlist.source = fns.source;
  return runlist;
};

Router.prototype.mount = function(routes, path) {
  if (!routes || typeof routes !== "object" || Array.isArray(routes)) {
    return;
  }
  var self = this;
  path = path || [];
  if (!Array.isArray(path)) {
    path = path.split(self.delimiter);
  }
  function insertOrMount(route, local) {
    var rename = route, parts = route.split(self.delimiter), routeType = typeof routes[route], isRoute = parts[0] === "" || !self._methods[parts[0]], event = isRoute ? "on" : rename;
    if (isRoute) {
      rename = rename.slice((rename.match(new RegExp("^" + self.delimiter)) || [ "" ])[0].length);
      parts.shift();
    }
    if (isRoute && routeType === "object" && !Array.isArray(routes[route])) {
      local = local.concat(parts);
      self.mount(routes[route], local);
      return;
    }
    if (isRoute) {
      local = local.concat(rename.split(self.delimiter));
      local = terminator(local, self.delimiter);
    }
    self.insert(event, local, routes[route]);
  }
  for (var route in routes) {
    if (routes.hasOwnProperty(route)) {
      insertOrMount(route, path.slice(0));
    }
  }
};



}(typeof exports === "object" ? exports : window));
},{}],2:[function(require,module,exports){
/*! @license Firebase v2.2.4
    License: https://www.firebase.com/terms/terms-of-service.html */
(function() {var h,aa=this;function n(a){return void 0!==a}function ba(){}function ca(a){a.ub=function(){return a.tf?a.tf:a.tf=new a}}
function da(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ea(a){return"array"==da(a)}function fa(a){var b=da(a);return"array"==b||"object"==b&&"number"==typeof a.length}function p(a){return"string"==typeof a}function ga(a){return"number"==typeof a}function ha(a){return"function"==da(a)}function ia(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ja(a,b,c){return a.call.apply(a.bind,arguments)}
function ka(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function q(a,b,c){q=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ja:ka;return q.apply(null,arguments)}var la=Date.now||function(){return+new Date};
function ma(a,b){function c(){}c.prototype=b.prototype;a.Zg=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Vg=function(a,c,f){for(var g=Array(arguments.length-2),k=2;k<arguments.length;k++)g[k-2]=arguments[k];return b.prototype[c].apply(a,g)}};function r(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function na(a,b){var c={},d;for(d in a)c[d]=b.call(void 0,a[d],d,a);return c}function oa(a,b){for(var c in a)if(!b.call(void 0,a[c],c,a))return!1;return!0}function pa(a){var b=0,c;for(c in a)b++;return b}function qa(a){for(var b in a)return b}function ra(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function sa(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function ta(a,b){for(var c in a)if(a[c]==b)return!0;return!1}
function ua(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d}function va(a,b){var c=ua(a,b,void 0);return c&&a[c]}function wa(a){for(var b in a)return!1;return!0}function xa(a){var b={},c;for(c in a)b[c]=a[c];return b}var ya="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function za(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<ya.length;f++)c=ya[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};function Aa(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function Ba(){this.Pd=void 0}
function Ca(a,b,c){switch(typeof b){case "string":Da(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(ea(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],Ca(a,a.Pd?a.Pd.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),Da(f,c),
c.push(":"),Ca(a,a.Pd?a.Pd.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var Ea={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Fa=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function Da(a,b){b.push('"',a.replace(Fa,function(a){if(a in Ea)return Ea[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return Ea[a]=e+b.toString(16)}),'"')};function Ga(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^la()).toString(36)};var Ha;a:{var Ia=aa.navigator;if(Ia){var Ja=Ia.userAgent;if(Ja){Ha=Ja;break a}}Ha=""};function Ka(){this.Wa=-1};function La(){this.Wa=-1;this.Wa=64;this.R=[];this.le=[];this.Tf=[];this.Id=[];this.Id[0]=128;for(var a=1;a<this.Wa;++a)this.Id[a]=0;this.be=this.$b=0;this.reset()}ma(La,Ka);La.prototype.reset=function(){this.R[0]=1732584193;this.R[1]=4023233417;this.R[2]=2562383102;this.R[3]=271733878;this.R[4]=3285377520;this.be=this.$b=0};
function Ma(a,b,c){c||(c=0);var d=a.Tf;if(p(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.R[0];c=a.R[1];for(var g=a.R[2],k=a.R[3],l=a.R[4],m,e=0;80>e;e++)40>e?20>e?(f=k^c&(g^k),m=1518500249):(f=c^g^k,m=1859775393):60>e?(f=c&g|k&(c|g),m=2400959708):(f=c^g^k,m=3395469782),f=(b<<
5|b>>>27)+f+l+m+d[e]&4294967295,l=k,k=g,g=(c<<30|c>>>2)&4294967295,c=b,b=f;a.R[0]=a.R[0]+b&4294967295;a.R[1]=a.R[1]+c&4294967295;a.R[2]=a.R[2]+g&4294967295;a.R[3]=a.R[3]+k&4294967295;a.R[4]=a.R[4]+l&4294967295}
La.prototype.update=function(a,b){if(null!=a){n(b)||(b=a.length);for(var c=b-this.Wa,d=0,e=this.le,f=this.$b;d<b;){if(0==f)for(;d<=c;)Ma(this,a,d),d+=this.Wa;if(p(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.Wa){Ma(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.Wa){Ma(this,e);f=0;break}}this.$b=f;this.be+=b}};var t=Array.prototype,Na=t.indexOf?function(a,b,c){return t.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(p(a))return p(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Oa=t.forEach?function(a,b,c){t.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Pa=t.filter?function(a,b,c){return t.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=p(a)?
a.split(""):a,k=0;k<d;k++)if(k in g){var l=g[k];b.call(c,l,k,a)&&(e[f++]=l)}return e},Qa=t.map?function(a,b,c){return t.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=p(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Ra=t.reduce?function(a,b,c,d){for(var e=[],f=1,g=arguments.length;f<g;f++)e.push(arguments[f]);d&&(e[0]=q(b,d));return t.reduce.apply(a,e)}:function(a,b,c,d){var e=c;Oa(a,function(c,g){e=b.call(d,e,c,g,a)});return e},Sa=t.every?function(a,b,
c){return t.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function Ta(a,b){var c=Ua(a,b,void 0);return 0>c?null:p(a)?a.charAt(c):a[c]}function Ua(a,b,c){for(var d=a.length,e=p(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1}function Va(a,b){var c=Na(a,b);0<=c&&t.splice.call(a,c,1)}function Wa(a,b,c){return 2>=arguments.length?t.slice.call(a,b):t.slice.call(a,b,c)}
function Xa(a,b){a.sort(b||Ya)}function Ya(a,b){return a>b?1:a<b?-1:0};var Za=-1!=Ha.indexOf("Opera")||-1!=Ha.indexOf("OPR"),$a=-1!=Ha.indexOf("Trident")||-1!=Ha.indexOf("MSIE"),ab=-1!=Ha.indexOf("Gecko")&&-1==Ha.toLowerCase().indexOf("webkit")&&!(-1!=Ha.indexOf("Trident")||-1!=Ha.indexOf("MSIE")),bb=-1!=Ha.toLowerCase().indexOf("webkit");
(function(){var a="",b;if(Za&&aa.opera)return a=aa.opera.version,ha(a)?a():a;ab?b=/rv\:([^\);]+)(\)|;)/:$a?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:bb&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(Ha))?a[1]:"");return $a&&(b=(b=aa.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var cb=null,db=null,eb=null;function fb(a,b){if(!fa(a))throw Error("encodeByteArray takes an array as a parameter");gb();for(var c=b?db:cb,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,k=g?a[e+1]:0,l=e+2<a.length,m=l?a[e+2]:0,v=f>>2,f=(f&3)<<4|k>>4,k=(k&15)<<2|m>>6,m=m&63;l||(m=64,g||(k=64));d.push(c[v],c[f],c[k],c[m])}return d.join("")}
function gb(){if(!cb){cb={};db={};eb={};for(var a=0;65>a;a++)cb[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),db[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a),eb[db[a]]=a,62<=a&&(eb["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)]=a)}};function u(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function w(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]}function hb(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])}function ib(a){var b={};hb(a,function(a,d){b[a]=d});return b};function jb(a){var b=[];hb(a,function(a,d){ea(d)?Oa(d,function(d){b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))}):b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))});return b.length?"&"+b.join("&"):""}function kb(a){var b={};a=a.replace(/^\?/,"").split("&");Oa(a,function(a){a&&(a=a.split("="),b[a[0]]=a[1])});return b};function x(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}function z(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:throw Error("errorPrefix called with argumentNumber > 4.  Need to update it?");}return a=a+" failed: "+(d+" argument ")}
function A(a,b,c,d){if((!d||n(c))&&!ha(c))throw Error(z(a,b,d)+"must be a valid function.");}function lb(a,b,c){if(n(c)&&(!ia(c)||null===c))throw Error(z(a,b,!0)+"must be a valid context object.");};function mb(a){return"undefined"!==typeof JSON&&n(JSON.parse)?JSON.parse(a):Aa(a)}function B(a){if("undefined"!==typeof JSON&&n(JSON.stringify))a=JSON.stringify(a);else{var b=[];Ca(new Ba,a,b);a=b.join("")}return a};function nb(){this.Sd=C}nb.prototype.j=function(a){return this.Sd.oa(a)};nb.prototype.toString=function(){return this.Sd.toString()};function ob(){}ob.prototype.pf=function(){return null};ob.prototype.xe=function(){return null};var pb=new ob;function qb(a,b,c){this.Qf=a;this.Ka=b;this.Hd=c}qb.prototype.pf=function(a){var b=this.Ka.D;if(rb(b,a))return b.j().M(a);b=null!=this.Hd?new sb(this.Hd,!0,!1):this.Ka.u();return this.Qf.Xa(a,b)};qb.prototype.xe=function(a,b,c){var d=null!=this.Hd?this.Hd:tb(this.Ka);a=this.Qf.me(d,b,1,c,a);return 0===a.length?null:a[0]};function ub(){this.tb=[]}function vb(a,b){for(var c=null,d=0;d<b.length;d++){var e=b[d],f=e.Yb();null===c||f.Z(c.Yb())||(a.tb.push(c),c=null);null===c&&(c=new wb(f));c.add(e)}c&&a.tb.push(c)}function xb(a,b,c){vb(a,c);yb(a,function(a){return a.Z(b)})}function zb(a,b,c){vb(a,c);yb(a,function(a){return a.contains(b)||b.contains(a)})}
function yb(a,b){for(var c=!0,d=0;d<a.tb.length;d++){var e=a.tb[d];if(e)if(e=e.Yb(),b(e)){for(var e=a.tb[d],f=0;f<e.sd.length;f++){var g=e.sd[f];if(null!==g){e.sd[f]=null;var k=g.Ub();Ab&&Bb("event: "+g.toString());Cb(k)}}a.tb[d]=null}else c=!1}c&&(a.tb=[])}function wb(a){this.qa=a;this.sd=[]}wb.prototype.add=function(a){this.sd.push(a)};wb.prototype.Yb=function(){return this.qa};function D(a,b,c,d){this.type=a;this.Ja=b;this.Ya=c;this.Je=d;this.Nd=void 0}function Db(a){return new D(Eb,a)}var Eb="value";function Fb(a,b,c,d){this.te=b;this.Wd=c;this.Nd=d;this.rd=a}Fb.prototype.Yb=function(){var a=this.Wd.lc();return"value"===this.rd?a.path:a.parent().path};Fb.prototype.ye=function(){return this.rd};Fb.prototype.Ub=function(){return this.te.Ub(this)};Fb.prototype.toString=function(){return this.Yb().toString()+":"+this.rd+":"+B(this.Wd.lf())};function Gb(a,b,c){this.te=a;this.error=b;this.path=c}Gb.prototype.Yb=function(){return this.path};Gb.prototype.ye=function(){return"cancel"};
Gb.prototype.Ub=function(){return this.te.Ub(this)};Gb.prototype.toString=function(){return this.path.toString()+":cancel"};function sb(a,b,c){this.B=a;this.$=b;this.Tb=c}function Hb(a){return a.$}function rb(a,b){return a.$&&!a.Tb||a.B.Ha(b)}sb.prototype.j=function(){return this.B};function Ib(a){this.dg=a;this.Ad=null}Ib.prototype.get=function(){var a=this.dg.get(),b=xa(a);if(this.Ad)for(var c in this.Ad)b[c]-=this.Ad[c];this.Ad=a;return b};function Jb(a,b){this.Mf={};this.Yd=new Ib(a);this.ca=b;var c=1E4+2E4*Math.random();setTimeout(q(this.Hf,this),Math.floor(c))}Jb.prototype.Hf=function(){var a=this.Yd.get(),b={},c=!1,d;for(d in a)0<a[d]&&u(this.Mf,d)&&(b[d]=a[d],c=!0);c&&this.ca.Te(b);setTimeout(q(this.Hf,this),Math.floor(6E5*Math.random()))};function Kb(){this.Dc={}}function Lb(a,b,c){n(c)||(c=1);u(a.Dc,b)||(a.Dc[b]=0);a.Dc[b]+=c}Kb.prototype.get=function(){return xa(this.Dc)};var Mb={},Nb={};function Ob(a){a=a.toString();Mb[a]||(Mb[a]=new Kb);return Mb[a]}function Pb(a,b){var c=a.toString();Nb[c]||(Nb[c]=b());return Nb[c]};function E(a,b){this.name=a;this.S=b}function Qb(a,b){return new E(a,b)};function Rb(a,b){return Sb(a.name,b.name)}function Tb(a,b){return Sb(a,b)};function Ub(a,b,c){this.type=Vb;this.source=a;this.path=b;this.Ia=c}Ub.prototype.Wc=function(a){return this.path.e()?new Ub(this.source,F,this.Ia.M(a)):new Ub(this.source,G(this.path),this.Ia)};Ub.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" overwrite: "+this.Ia.toString()+")"};function Wb(a,b){this.type=Xb;this.source=Yb;this.path=a;this.Ve=b}Wb.prototype.Wc=function(){return this.path.e()?this:new Wb(G(this.path),this.Ve)};Wb.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" ack write revert="+this.Ve+")"};function Zb(a,b){this.type=$b;this.source=a;this.path=b}Zb.prototype.Wc=function(){return this.path.e()?new Zb(this.source,F):new Zb(this.source,G(this.path))};Zb.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" listen_complete)"};function ac(a,b){this.La=a;this.xa=b?b:bc}h=ac.prototype;h.Na=function(a,b){return new ac(this.La,this.xa.Na(a,b,this.La).X(null,null,!1,null,null))};h.remove=function(a){return new ac(this.La,this.xa.remove(a,this.La).X(null,null,!1,null,null))};h.get=function(a){for(var b,c=this.xa;!c.e();){b=this.La(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
function cc(a,b){for(var c,d=a.xa,e=null;!d.e();){c=a.La(b,d.key);if(0===c){if(d.left.e())return e?e.key:null;for(d=d.left;!d.right.e();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}h.e=function(){return this.xa.e()};h.count=function(){return this.xa.count()};h.Rc=function(){return this.xa.Rc()};h.ec=function(){return this.xa.ec()};h.ha=function(a){return this.xa.ha(a)};
h.Wb=function(a){return new dc(this.xa,null,this.La,!1,a)};h.Xb=function(a,b){return new dc(this.xa,a,this.La,!1,b)};h.Zb=function(a,b){return new dc(this.xa,a,this.La,!0,b)};h.rf=function(a){return new dc(this.xa,null,this.La,!0,a)};function dc(a,b,c,d,e){this.Rd=e||null;this.Ee=d;this.Pa=[];for(e=1;!a.e();)if(e=b?c(a.key,b):1,d&&(e*=-1),0>e)a=this.Ee?a.left:a.right;else if(0===e){this.Pa.push(a);break}else this.Pa.push(a),a=this.Ee?a.right:a.left}
function H(a){if(0===a.Pa.length)return null;var b=a.Pa.pop(),c;c=a.Rd?a.Rd(b.key,b.value):{key:b.key,value:b.value};if(a.Ee)for(b=b.left;!b.e();)a.Pa.push(b),b=b.right;else for(b=b.right;!b.e();)a.Pa.push(b),b=b.left;return c}function ec(a){if(0===a.Pa.length)return null;var b;b=a.Pa;b=b[b.length-1];return a.Rd?a.Rd(b.key,b.value):{key:b.key,value:b.value}}function fc(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:bc;this.right=null!=e?e:bc}h=fc.prototype;
h.X=function(a,b,c,d,e){return new fc(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};h.count=function(){return this.left.count()+1+this.right.count()};h.e=function(){return!1};h.ha=function(a){return this.left.ha(a)||a(this.key,this.value)||this.right.ha(a)};function gc(a){return a.left.e()?a:gc(a.left)}h.Rc=function(){return gc(this).key};h.ec=function(){return this.right.e()?this.key:this.right.ec()};
h.Na=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.X(null,null,null,e.left.Na(a,b,c),null):0===d?e.X(null,b,null,null,null):e.X(null,null,null,null,e.right.Na(a,b,c));return hc(e)};function ic(a){if(a.left.e())return bc;a.left.fa()||a.left.left.fa()||(a=jc(a));a=a.X(null,null,null,ic(a.left),null);return hc(a)}
h.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.e()||c.left.fa()||c.left.left.fa()||(c=jc(c)),c=c.X(null,null,null,c.left.remove(a,b),null);else{c.left.fa()&&(c=kc(c));c.right.e()||c.right.fa()||c.right.left.fa()||(c=lc(c),c.left.left.fa()&&(c=kc(c),c=lc(c)));if(0===b(a,c.key)){if(c.right.e())return bc;d=gc(c.right);c=c.X(d.key,d.value,null,null,ic(c.right))}c=c.X(null,null,null,null,c.right.remove(a,b))}return hc(c)};h.fa=function(){return this.color};
function hc(a){a.right.fa()&&!a.left.fa()&&(a=mc(a));a.left.fa()&&a.left.left.fa()&&(a=kc(a));a.left.fa()&&a.right.fa()&&(a=lc(a));return a}function jc(a){a=lc(a);a.right.left.fa()&&(a=a.X(null,null,null,null,kc(a.right)),a=mc(a),a=lc(a));return a}function mc(a){return a.right.X(null,null,a.color,a.X(null,null,!0,null,a.right.left),null)}function kc(a){return a.left.X(null,null,a.color,null,a.X(null,null,!0,a.left.right,null))}
function lc(a){return a.X(null,null,!a.color,a.left.X(null,null,!a.left.color,null,null),a.right.X(null,null,!a.right.color,null,null))}function nc(){}h=nc.prototype;h.X=function(){return this};h.Na=function(a,b){return new fc(a,b,null)};h.remove=function(){return this};h.count=function(){return 0};h.e=function(){return!0};h.ha=function(){return!1};h.Rc=function(){return null};h.ec=function(){return null};h.fa=function(){return!1};var bc=new nc;function oc(a,b){return a&&"object"===typeof a?(J(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function pc(a,b){var c=new qc;rc(a,new K(""),function(a,e){c.mc(a,sc(e,b))});return c}function sc(a,b){var c=a.A().K(),c=oc(c,b),d;if(a.N()){var e=oc(a.Ba(),b);return e!==a.Ba()||c!==a.A().K()?new tc(e,L(c)):a}d=a;c!==a.A().K()&&(d=d.da(new tc(c)));a.U(M,function(a,c){var e=sc(c,b);e!==c&&(d=d.Q(a,e))});return d};function K(a,b){if(1==arguments.length){this.o=a.split("/");for(var c=0,d=0;d<this.o.length;d++)0<this.o[d].length&&(this.o[c]=this.o[d],c++);this.o.length=c;this.Y=0}else this.o=a,this.Y=b}function N(a,b){var c=O(a);if(null===c)return b;if(c===O(b))return N(G(a),G(b));throw Error("INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")");}function O(a){return a.Y>=a.o.length?null:a.o[a.Y]}function uc(a){return a.o.length-a.Y}
function G(a){var b=a.Y;b<a.o.length&&b++;return new K(a.o,b)}function vc(a){return a.Y<a.o.length?a.o[a.o.length-1]:null}h=K.prototype;h.toString=function(){for(var a="",b=this.Y;b<this.o.length;b++)""!==this.o[b]&&(a+="/"+this.o[b]);return a||"/"};h.slice=function(a){return this.o.slice(this.Y+(a||0))};h.parent=function(){if(this.Y>=this.o.length)return null;for(var a=[],b=this.Y;b<this.o.length-1;b++)a.push(this.o[b]);return new K(a,0)};
h.w=function(a){for(var b=[],c=this.Y;c<this.o.length;c++)b.push(this.o[c]);if(a instanceof K)for(c=a.Y;c<a.o.length;c++)b.push(a.o[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new K(b,0)};h.e=function(){return this.Y>=this.o.length};h.Z=function(a){if(uc(this)!==uc(a))return!1;for(var b=this.Y,c=a.Y;b<=this.o.length;b++,c++)if(this.o[b]!==a.o[c])return!1;return!0};
h.contains=function(a){var b=this.Y,c=a.Y;if(uc(this)>uc(a))return!1;for(;b<this.o.length;){if(this.o[b]!==a.o[c])return!1;++b;++c}return!0};var F=new K("");function wc(a,b){this.Qa=a.slice();this.Ea=Math.max(1,this.Qa.length);this.kf=b;for(var c=0;c<this.Qa.length;c++)this.Ea+=xc(this.Qa[c]);yc(this)}wc.prototype.push=function(a){0<this.Qa.length&&(this.Ea+=1);this.Qa.push(a);this.Ea+=xc(a);yc(this)};wc.prototype.pop=function(){var a=this.Qa.pop();this.Ea-=xc(a);0<this.Qa.length&&--this.Ea};
function yc(a){if(768<a.Ea)throw Error(a.kf+"has a key path longer than 768 bytes ("+a.Ea+").");if(32<a.Qa.length)throw Error(a.kf+"path specified exceeds the maximum depth that can be written (32) or object contains a cycle "+zc(a));}function zc(a){return 0==a.Qa.length?"":"in property '"+a.Qa.join(".")+"'"};function Ac(){this.wc={}}Ac.prototype.set=function(a,b){null==b?delete this.wc[a]:this.wc[a]=b};Ac.prototype.get=function(a){return u(this.wc,a)?this.wc[a]:null};Ac.prototype.remove=function(a){delete this.wc[a]};Ac.prototype.uf=!0;function Bc(a){this.Ec=a;this.Md="firebase:"}h=Bc.prototype;h.set=function(a,b){null==b?this.Ec.removeItem(this.Md+a):this.Ec.setItem(this.Md+a,B(b))};h.get=function(a){a=this.Ec.getItem(this.Md+a);return null==a?null:mb(a)};h.remove=function(a){this.Ec.removeItem(this.Md+a)};h.uf=!1;h.toString=function(){return this.Ec.toString()};function Cc(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new Bc(b)}}catch(c){}return new Ac}var Dc=Cc("localStorage"),P=Cc("sessionStorage");function Ec(a,b,c,d,e){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.lb=b;this.Cb=c;this.Tg=d;this.Ld=e||"";this.Oa=Dc.get("host:"+a)||this.host}function Fc(a,b){b!==a.Oa&&(a.Oa=b,"s-"===a.Oa.substr(0,2)&&Dc.set("host:"+a.host,a.Oa))}Ec.prototype.toString=function(){var a=(this.lb?"https://":"http://")+this.host;this.Ld&&(a+="<"+this.Ld+">");return a};var Gc=function(){var a=1;return function(){return a++}}();function J(a,b){if(!a)throw Hc(b);}function Hc(a){return Error("Firebase (2.2.4) INTERNAL ASSERT FAILED: "+a)}
function Ic(a){try{var b;if("undefined"!==typeof atob)b=atob(a);else{gb();for(var c=eb,d=[],e=0;e<a.length;){var f=c[a.charAt(e++)],g=e<a.length?c[a.charAt(e)]:0;++e;var k=e<a.length?c[a.charAt(e)]:64;++e;var l=e<a.length?c[a.charAt(e)]:64;++e;if(null==f||null==g||null==k||null==l)throw Error();d.push(f<<2|g>>4);64!=k&&(d.push(g<<4&240|k>>2),64!=l&&d.push(k<<6&192|l))}if(8192>d.length)b=String.fromCharCode.apply(null,d);else{a="";for(c=0;c<d.length;c+=8192)a+=String.fromCharCode.apply(null,Wa(d,c,
c+8192));b=a}}return b}catch(m){Bb("base64Decode failed: ",m)}return null}function Jc(a){var b=Kc(a);a=new La;a.update(b);var b=[],c=8*a.be;56>a.$b?a.update(a.Id,56-a.$b):a.update(a.Id,a.Wa-(a.$b-56));for(var d=a.Wa-1;56<=d;d--)a.le[d]=c&255,c/=256;Ma(a,a.le);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.R[d]>>e&255,++c;return fb(b)}
function Lc(a){for(var b="",c=0;c<arguments.length;c++)b=fa(arguments[c])?b+Lc.apply(null,arguments[c]):"object"===typeof arguments[c]?b+B(arguments[c]):b+arguments[c],b+=" ";return b}var Ab=null,Mc=!0;function Bb(a){!0===Mc&&(Mc=!1,null===Ab&&!0===P.get("logging_enabled")&&Nc(!0));if(Ab){var b=Lc.apply(null,arguments);Ab(b)}}function Oc(a){return function(){Bb(a,arguments)}}
function Pc(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+Lc.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function Qc(a){var b=Lc.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}function Q(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+Lc.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
function Rc(a){var b="",c="",d="",e="",f=!0,g="https",k=443;if(p(a)){var l=a.indexOf("//");0<=l&&(g=a.substring(0,l-1),a=a.substring(l+2));l=a.indexOf("/");-1===l&&(l=a.length);b=a.substring(0,l);e="";a=a.substring(l).split("/");for(l=0;l<a.length;l++)if(0<a[l].length){var m=a[l];try{m=decodeURIComponent(m.replace(/\+/g," "))}catch(v){}e+="/"+m}a=b.split(".");3===a.length?(c=a[1],d=a[0].toLowerCase()):2===a.length&&(c=a[0]);l=b.indexOf(":");0<=l&&(f="https"===g||"wss"===g,k=b.substring(l+1),isFinite(k)&&
(k=String(k)),k=p(k)?/^\s*-?0x/i.test(k)?parseInt(k,16):parseInt(k,10):NaN)}return{host:b,port:k,domain:c,Qg:d,lb:f,scheme:g,Zc:e}}function Sc(a){return ga(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}
function Tc(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
function Sb(a,b){if(a===b)return 0;if("[MIN_NAME]"===a||"[MAX_NAME]"===b)return-1;if("[MIN_NAME]"===b||"[MAX_NAME]"===a)return 1;var c=Uc(a),d=Uc(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function Vc(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+B(b));}
function Wc(a){if("object"!==typeof a||null===a)return B(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=B(b[d]),c+=":",c+=Wc(a[b[d]]);return c+"}"}function Xc(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function Yc(a,b){if(ea(a))for(var c=0;c<a.length;++c)b(c,a[c]);else r(a,b)}
function Zc(a){J(!Sc(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;--a)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;--a)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
(d="0"+d),c+=d;return c.toLowerCase()}var $c=/^-?\d{1,10}$/;function Uc(a){return $c.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}function Cb(a){try{a()}catch(b){setTimeout(function(){Q("Exception was thrown by user callback.",b.stack||"");throw b;},Math.floor(0))}}function R(a,b){if(ha(a)){var c=Array.prototype.slice.call(arguments,1).slice();Cb(function(){a.apply(null,c)})}};function Kc(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,J(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b}function xc(a){for(var b=0,c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b++:2048>d?b+=2:55296<=d&&56319>=d?(b+=4,c++):b+=3}return b};function ad(a){var b={},c={},d={},e="";try{var f=a.split("."),b=mb(Ic(f[0])||""),c=mb(Ic(f[1])||""),e=f[2],d=c.d||{};delete c.d}catch(g){}return{Wg:b,Ac:c,data:d,Ng:e}}function bd(a){a=ad(a).Ac;return"object"===typeof a&&a.hasOwnProperty("iat")?w(a,"iat"):null}function cd(a){a=ad(a);var b=a.Ac;return!!a.Ng&&!!b&&"object"===typeof b&&b.hasOwnProperty("iat")};function dd(a){this.V=a;this.g=a.n.g}function ed(a,b,c,d){var e=[],f=[];Oa(b,function(b){"child_changed"===b.type&&a.g.xd(b.Je,b.Ja)&&f.push(new D("child_moved",b.Ja,b.Ya))});fd(a,e,"child_removed",b,d,c);fd(a,e,"child_added",b,d,c);fd(a,e,"child_moved",f,d,c);fd(a,e,"child_changed",b,d,c);fd(a,e,Eb,b,d,c);return e}function fd(a,b,c,d,e,f){d=Pa(d,function(a){return a.type===c});Xa(d,q(a.eg,a));Oa(d,function(c){var d=gd(a,c,f);Oa(e,function(e){e.Jf(c.type)&&b.push(e.createEvent(d,a.V))})})}
function gd(a,b,c){"value"!==b.type&&"child_removed"!==b.type&&(b.Nd=c.qf(b.Ya,b.Ja,a.g));return b}dd.prototype.eg=function(a,b){if(null==a.Ya||null==b.Ya)throw Hc("Should only compare child_ events.");return this.g.compare(new E(a.Ya,a.Ja),new E(b.Ya,b.Ja))};function hd(){this.eb={}}
function id(a,b){var c=b.type,d=b.Ya;J("child_added"==c||"child_changed"==c||"child_removed"==c,"Only child changes supported for tracking");J(".priority"!==d,"Only non-priority child changes can be tracked.");var e=w(a.eb,d);if(e){var f=e.type;if("child_added"==c&&"child_removed"==f)a.eb[d]=new D("child_changed",b.Ja,d,e.Ja);else if("child_removed"==c&&"child_added"==f)delete a.eb[d];else if("child_removed"==c&&"child_changed"==f)a.eb[d]=new D("child_removed",e.Je,d);else if("child_changed"==c&&
"child_added"==f)a.eb[d]=new D("child_added",b.Ja,d);else if("child_changed"==c&&"child_changed"==f)a.eb[d]=new D("child_changed",b.Ja,d,e.Je);else throw Hc("Illegal combination of changes: "+b+" occurred after "+e);}else a.eb[d]=b};function jd(a,b,c){this.Pb=a;this.qb=b;this.sb=c||null}h=jd.prototype;h.Jf=function(a){return"value"===a};h.createEvent=function(a,b){var c=b.n.g;return new Fb("value",this,new S(a.Ja,b.lc(),c))};h.Ub=function(a){var b=this.sb;if("cancel"===a.ye()){J(this.qb,"Raising a cancel event on a listener with no cancel callback");var c=this.qb;return function(){c.call(b,a.error)}}var d=this.Pb;return function(){d.call(b,a.Wd)}};h.ff=function(a,b){return this.qb?new Gb(this,a,b):null};
h.matches=function(a){return a instanceof jd?a.Pb&&this.Pb?a.Pb===this.Pb&&a.sb===this.sb:!0:!1};h.sf=function(){return null!==this.Pb};function kd(a,b,c){this.ga=a;this.qb=b;this.sb=c}h=kd.prototype;h.Jf=function(a){a="children_added"===a?"child_added":a;return("children_removed"===a?"child_removed":a)in this.ga};h.ff=function(a,b){return this.qb?new Gb(this,a,b):null};
h.createEvent=function(a,b){J(null!=a.Ya,"Child events should have a childName.");var c=b.lc().w(a.Ya);return new Fb(a.type,this,new S(a.Ja,c,b.n.g),a.Nd)};h.Ub=function(a){var b=this.sb;if("cancel"===a.ye()){J(this.qb,"Raising a cancel event on a listener with no cancel callback");var c=this.qb;return function(){c.call(b,a.error)}}var d=this.ga[a.rd];return function(){d.call(b,a.Wd,a.Nd)}};
h.matches=function(a){if(a instanceof kd){if(!this.ga||!a.ga)return!0;if(this.sb===a.sb){var b=pa(a.ga);if(b===pa(this.ga)){if(1===b){var b=qa(a.ga),c=qa(this.ga);return c===b&&(!a.ga[b]||!this.ga[c]||a.ga[b]===this.ga[c])}return oa(this.ga,function(b,c){return a.ga[c]===b})}}}return!1};h.sf=function(){return null!==this.ga};function ld(a){this.g=a}h=ld.prototype;h.G=function(a,b,c,d,e){J(a.Ic(this.g),"A node must be indexed if only a child is updated");d=a.M(b);if(d.Z(c))return a;null!=e&&(c.e()?a.Ha(b)?id(e,new D("child_removed",d,b)):J(a.N(),"A child remove without an old child only makes sense on a leaf node"):d.e()?id(e,new D("child_added",c,b)):id(e,new D("child_changed",c,b,d)));return a.N()&&c.e()?a:a.Q(b,c).mb(this.g)};
h.ta=function(a,b,c){null!=c&&(a.N()||a.U(M,function(a,e){b.Ha(a)||id(c,new D("child_removed",e,a))}),b.N()||b.U(M,function(b,e){if(a.Ha(b)){var f=a.M(b);f.Z(e)||id(c,new D("child_changed",e,b,f))}else id(c,new D("child_added",e,b))}));return b.mb(this.g)};h.da=function(a,b){return a.e()?C:a.da(b)};h.Ga=function(){return!1};h.Vb=function(){return this};function md(a){this.Ae=new ld(a.g);this.g=a.g;var b;a.la?(b=nd(a),b=a.g.Oc(od(a),b)):b=a.g.Sc();this.dd=b;a.na?(b=pd(a),a=a.g.Oc(qd(a),b)):a=a.g.Pc();this.Fc=a}h=md.prototype;h.matches=function(a){return 0>=this.g.compare(this.dd,a)&&0>=this.g.compare(a,this.Fc)};h.G=function(a,b,c,d,e){this.matches(new E(b,c))||(c=C);return this.Ae.G(a,b,c,d,e)};h.ta=function(a,b,c){b.N()&&(b=C);var d=b.mb(this.g),d=d.da(C),e=this;b.U(M,function(a,b){e.matches(new E(a,b))||(d=d.Q(a,C))});return this.Ae.ta(a,d,c)};
h.da=function(a){return a};h.Ga=function(){return!0};h.Vb=function(){return this.Ae};function rd(a){this.ra=new md(a);this.g=a.g;J(a.ia,"Only valid if limit has been set");this.ja=a.ja;this.Jb=!sd(a)}h=rd.prototype;h.G=function(a,b,c,d,e){this.ra.matches(new E(b,c))||(c=C);return a.M(b).Z(c)?a:a.Db()<this.ja?this.ra.Vb().G(a,b,c,d,e):td(this,a,b,c,d,e)};
h.ta=function(a,b,c){var d;if(b.N()||b.e())d=C.mb(this.g);else if(2*this.ja<b.Db()&&b.Ic(this.g)){d=C.mb(this.g);b=this.Jb?b.Zb(this.ra.Fc,this.g):b.Xb(this.ra.dd,this.g);for(var e=0;0<b.Pa.length&&e<this.ja;){var f=H(b),g;if(g=this.Jb?0>=this.g.compare(this.ra.dd,f):0>=this.g.compare(f,this.ra.Fc))d=d.Q(f.name,f.S),e++;else break}}else{d=b.mb(this.g);d=d.da(C);var k,l,m;if(this.Jb){b=d.rf(this.g);k=this.ra.Fc;l=this.ra.dd;var v=ud(this.g);m=function(a,b){return v(b,a)}}else b=d.Wb(this.g),k=this.ra.dd,
l=this.ra.Fc,m=ud(this.g);for(var e=0,y=!1;0<b.Pa.length;)f=H(b),!y&&0>=m(k,f)&&(y=!0),(g=y&&e<this.ja&&0>=m(f,l))?e++:d=d.Q(f.name,C)}return this.ra.Vb().ta(a,d,c)};h.da=function(a){return a};h.Ga=function(){return!0};h.Vb=function(){return this.ra.Vb()};
function td(a,b,c,d,e,f){var g;if(a.Jb){var k=ud(a.g);g=function(a,b){return k(b,a)}}else g=ud(a.g);J(b.Db()==a.ja,"");var l=new E(c,d),m=a.Jb?wd(b,a.g):xd(b,a.g),v=a.ra.matches(l);if(b.Ha(c)){var y=b.M(c),m=e.xe(a.g,m,a.Jb);null!=m&&m.name==c&&(m=e.xe(a.g,m,a.Jb));e=null==m?1:g(m,l);if(v&&!d.e()&&0<=e)return null!=f&&id(f,new D("child_changed",d,c,y)),b.Q(c,d);null!=f&&id(f,new D("child_removed",y,c));b=b.Q(c,C);return null!=m&&a.ra.matches(m)?(null!=f&&id(f,new D("child_added",m.S,m.name)),b.Q(m.name,
m.S)):b}return d.e()?b:v&&0<=g(m,l)?(null!=f&&(id(f,new D("child_removed",m.S,m.name)),id(f,new D("child_added",d,c))),b.Q(c,d).Q(m.name,C)):b};function yd(a,b){this.he=a;this.cg=b}function zd(a){this.I=a}
zd.prototype.bb=function(a,b,c,d){var e=new hd,f;if(b.type===Vb)b.source.ve?c=Ad(this,a,b.path,b.Ia,c,d,e):(J(b.source.of,"Unknown source."),f=b.source.af,c=Bd(this,a,b.path,b.Ia,c,d,f,e));else if(b.type===Cd)b.source.ve?c=Dd(this,a,b.path,b.children,c,d,e):(J(b.source.of,"Unknown source."),f=b.source.af,c=Ed(this,a,b.path,b.children,c,d,f,e));else if(b.type===Xb)if(b.Ve)if(f=b.path,null!=c.sc(f))c=a;else{b=new qb(c,a,d);d=a.D.j();if(f.e()||".priority"===O(f))Hb(a.u())?b=c.ua(tb(a)):(b=a.u().j(),
J(b instanceof T,"serverChildren would be complete if leaf node"),b=c.xc(b)),b=this.I.ta(d,b,e);else{f=O(f);var g=c.Xa(f,a.u());null==g&&rb(a.u(),f)&&(g=d.M(f));b=null!=g?this.I.G(d,f,g,b,e):a.D.j().Ha(f)?this.I.G(d,f,C,b,e):d;b.e()&&Hb(a.u())&&(d=c.ua(tb(a)),d.N()&&(b=this.I.ta(b,d,e)))}d=Hb(a.u())||null!=c.sc(F);c=Fd(a,b,d,this.I.Ga())}else c=Gd(this,a,b.path,c,d,e);else if(b.type===$b)d=b.path,b=a.u(),f=b.j(),g=b.$||d.e(),c=Hd(this,new Id(a.D,new sb(f,g,b.Tb)),d,c,pb,e);else throw Hc("Unknown operation type: "+
b.type);e=ra(e.eb);d=c;b=d.D;b.$&&(f=b.j().N()||b.j().e(),g=Jd(a),(0<e.length||!a.D.$||f&&!b.j().Z(g)||!b.j().A().Z(g.A()))&&e.push(Db(Jd(d))));return new yd(c,e)};
function Hd(a,b,c,d,e,f){var g=b.D;if(null!=d.sc(c))return b;var k;if(c.e())J(Hb(b.u()),"If change path is empty, we must have complete server data"),b.u().Tb?(e=tb(b),d=d.xc(e instanceof T?e:C)):d=d.ua(tb(b)),f=a.I.ta(b.D.j(),d,f);else{var l=O(c);if(".priority"==l)J(1==uc(c),"Can't have a priority with additional path components"),f=g.j(),k=b.u().j(),d=d.hd(c,f,k),f=null!=d?a.I.da(f,d):g.j();else{var m=G(c);rb(g,l)?(k=b.u().j(),d=d.hd(c,g.j(),k),d=null!=d?g.j().M(l).G(m,d):g.j().M(l)):d=d.Xa(l,b.u());
f=null!=d?a.I.G(g.j(),l,d,e,f):g.j()}}return Fd(b,f,g.$||c.e(),a.I.Ga())}function Bd(a,b,c,d,e,f,g,k){var l=b.u();g=g?a.I:a.I.Vb();if(c.e())d=g.ta(l.j(),d,null);else if(g.Ga()&&!l.Tb)d=l.j().G(c,d),d=g.ta(l.j(),d,null);else{var m=O(c);if((c.e()?!l.$||l.Tb:!rb(l,O(c)))&&1<uc(c))return b;d=l.j().M(m).G(G(c),d);d=".priority"==m?g.da(l.j(),d):g.G(l.j(),m,d,pb,null)}l=l.$||c.e();b=new Id(b.D,new sb(d,l,g.Ga()));return Hd(a,b,c,e,new qb(e,b,f),k)}
function Ad(a,b,c,d,e,f,g){var k=b.D;e=new qb(e,b,f);if(c.e())g=a.I.ta(b.D.j(),d,g),a=Fd(b,g,!0,a.I.Ga());else if(f=O(c),".priority"===f)g=a.I.da(b.D.j(),d),a=Fd(b,g,k.$,k.Tb);else{var l=G(c);c=k.j().M(f);if(!l.e()){var m=e.pf(f);d=null!=m?".priority"===vc(l)&&m.oa(l.parent()).e()?m:m.G(l,d):C}c.Z(d)?a=b:(g=a.I.G(k.j(),f,d,e,g),a=Fd(b,g,k.$,a.I.Ga()))}return a}
function Dd(a,b,c,d,e,f,g){var k=b;Kd(d,function(d,m){var v=c.w(d);rb(b.D,O(v))&&(k=Ad(a,k,v,m,e,f,g))});Kd(d,function(d,m){var v=c.w(d);rb(b.D,O(v))||(k=Ad(a,k,v,m,e,f,g))});return k}function Ld(a,b){Kd(b,function(b,d){a=a.G(b,d)});return a}
function Ed(a,b,c,d,e,f,g,k){if(b.u().j().e()&&!Hb(b.u()))return b;var l=b;c=c.e()?d:Md(Nd,c,d);var m=b.u().j();c.children.ha(function(c,d){if(m.Ha(c)){var I=b.u().j().M(c),I=Ld(I,d);l=Bd(a,l,new K(c),I,e,f,g,k)}});c.children.ha(function(c,d){var I=!Hb(b.u())&&null==d.value;m.Ha(c)||I||(I=b.u().j().M(c),I=Ld(I,d),l=Bd(a,l,new K(c),I,e,f,g,k))});return l}
function Gd(a,b,c,d,e,f){if(null!=d.sc(c))return b;var g=new qb(d,b,e),k=e=b.D.j();if(Hb(b.u())){if(c.e())e=d.ua(tb(b)),k=a.I.ta(b.D.j(),e,f);else if(".priority"===O(c)){var l=d.Xa(O(c),b.u());null==l||e.e()||e.A().Z(l)||(k=a.I.da(e,l))}else l=O(c),e=d.Xa(l,b.u()),null!=e&&(k=a.I.G(b.D.j(),l,e,g,f));e=!0}else if(b.D.$||c.e())k=e,e=b.D.j(),e.N()||e.U(M,function(c){var e=d.Xa(c,b.u());null!=e&&(k=a.I.G(k,c,e,g,f))}),e=b.D.$;else{l=O(c);if(1==uc(c)||rb(b.D,l))c=d.Xa(l,b.u()),null!=c&&(k=a.I.G(e,l,c,
g,f));e=!1}return Fd(b,k,e,a.I.Ga())};function Od(){}var Pd={};function ud(a){return q(a.compare,a)}Od.prototype.xd=function(a,b){return 0!==this.compare(new E("[MIN_NAME]",a),new E("[MIN_NAME]",b))};Od.prototype.Sc=function(){return Qd};function Rd(a){this.bc=a}ma(Rd,Od);h=Rd.prototype;h.Hc=function(a){return!a.M(this.bc).e()};h.compare=function(a,b){var c=a.S.M(this.bc),d=b.S.M(this.bc),c=c.Cc(d);return 0===c?Sb(a.name,b.name):c};h.Oc=function(a,b){var c=L(a),c=C.Q(this.bc,c);return new E(b,c)};
h.Pc=function(){var a=C.Q(this.bc,Sd);return new E("[MAX_NAME]",a)};h.toString=function(){return this.bc};function Td(){}ma(Td,Od);h=Td.prototype;h.compare=function(a,b){var c=a.S.A(),d=b.S.A(),c=c.Cc(d);return 0===c?Sb(a.name,b.name):c};h.Hc=function(a){return!a.A().e()};h.xd=function(a,b){return!a.A().Z(b.A())};h.Sc=function(){return Qd};h.Pc=function(){return new E("[MAX_NAME]",new tc("[PRIORITY-POST]",Sd))};h.Oc=function(a,b){var c=L(a);return new E(b,new tc("[PRIORITY-POST]",c))};
h.toString=function(){return".priority"};var M=new Td;function Ud(){}ma(Ud,Od);h=Ud.prototype;h.compare=function(a,b){return Sb(a.name,b.name)};h.Hc=function(){throw Hc("KeyIndex.isDefinedOn not expected to be called.");};h.xd=function(){return!1};h.Sc=function(){return Qd};h.Pc=function(){return new E("[MAX_NAME]",C)};h.Oc=function(a){J(p(a),"KeyIndex indexValue must always be a string.");return new E(a,C)};h.toString=function(){return".key"};var Vd=new Ud;function Wd(){}ma(Wd,Od);h=Wd.prototype;
h.compare=function(a,b){var c=a.S.Cc(b.S);return 0===c?Sb(a.name,b.name):c};h.Hc=function(){return!0};h.xd=function(a,b){return!a.Z(b)};h.Sc=function(){return Qd};h.Pc=function(){return Xd};h.Oc=function(a,b){var c=L(a);return new E(b,c)};h.toString=function(){return".value"};var Yd=new Wd;function Zd(){this.Rb=this.na=this.Lb=this.la=this.ia=!1;this.ja=0;this.Nb="";this.dc=null;this.xb="";this.ac=null;this.vb="";this.g=M}var $d=new Zd;function sd(a){return""===a.Nb?a.la:"l"===a.Nb}function od(a){J(a.la,"Only valid if start has been set");return a.dc}function nd(a){J(a.la,"Only valid if start has been set");return a.Lb?a.xb:"[MIN_NAME]"}function qd(a){J(a.na,"Only valid if end has been set");return a.ac}
function pd(a){J(a.na,"Only valid if end has been set");return a.Rb?a.vb:"[MAX_NAME]"}function ae(a){var b=new Zd;b.ia=a.ia;b.ja=a.ja;b.la=a.la;b.dc=a.dc;b.Lb=a.Lb;b.xb=a.xb;b.na=a.na;b.ac=a.ac;b.Rb=a.Rb;b.vb=a.vb;b.g=a.g;return b}h=Zd.prototype;h.Ge=function(a){var b=ae(this);b.ia=!0;b.ja=a;b.Nb="";return b};h.He=function(a){var b=ae(this);b.ia=!0;b.ja=a;b.Nb="l";return b};h.Ie=function(a){var b=ae(this);b.ia=!0;b.ja=a;b.Nb="r";return b};
h.Xd=function(a,b){var c=ae(this);c.la=!0;n(a)||(a=null);c.dc=a;null!=b?(c.Lb=!0,c.xb=b):(c.Lb=!1,c.xb="");return c};h.qd=function(a,b){var c=ae(this);c.na=!0;n(a)||(a=null);c.ac=a;n(b)?(c.Rb=!0,c.vb=b):(c.Yg=!1,c.vb="");return c};function be(a,b){var c=ae(a);c.g=b;return c}function ce(a){var b={};a.la&&(b.sp=a.dc,a.Lb&&(b.sn=a.xb));a.na&&(b.ep=a.ac,a.Rb&&(b.en=a.vb));if(a.ia){b.l=a.ja;var c=a.Nb;""===c&&(c=sd(a)?"l":"r");b.vf=c}a.g!==M&&(b.i=a.g.toString());return b}
function de(a){return!(a.la||a.na||a.ia)}function ee(a){var b={};if(de(a)&&a.g==M)return b;var c;a.g===M?c="$priority":a.g===Yd?c="$value":(J(a.g instanceof Rd,"Unrecognized index type!"),c=a.g.toString());b.orderBy=B(c);a.la&&(b.startAt=B(a.dc),a.Lb&&(b.startAt+=","+B(a.xb)));a.na&&(b.endAt=B(a.ac),a.Rb&&(b.endAt+=","+B(a.vb)));a.ia&&(sd(a)?b.limitToFirst=a.ja:b.limitToLast=a.ja);return b}h.toString=function(){return B(ce(this))};function fe(a,b){this.yd=a;this.cc=b}fe.prototype.get=function(a){var b=w(this.yd,a);if(!b)throw Error("No index defined for "+a);return b===Pd?null:b};function ge(a,b,c){var d=na(a.yd,function(d,f){var g=w(a.cc,f);J(g,"Missing index implementation for "+f);if(d===Pd){if(g.Hc(b.S)){for(var k=[],l=c.Wb(Qb),m=H(l);m;)m.name!=b.name&&k.push(m),m=H(l);k.push(b);return he(k,ud(g))}return Pd}g=c.get(b.name);k=d;g&&(k=k.remove(new E(b.name,g)));return k.Na(b,b.S)});return new fe(d,a.cc)}
function ie(a,b,c){var d=na(a.yd,function(a){if(a===Pd)return a;var d=c.get(b.name);return d?a.remove(new E(b.name,d)):a});return new fe(d,a.cc)}var je=new fe({".priority":Pd},{".priority":M});function tc(a,b){this.C=a;J(n(this.C)&&null!==this.C,"LeafNode shouldn't be created with null/undefined value.");this.ba=b||C;ke(this.ba);this.Bb=null}h=tc.prototype;h.N=function(){return!0};h.A=function(){return this.ba};h.da=function(a){return new tc(this.C,a)};h.M=function(a){return".priority"===a?this.ba:C};h.oa=function(a){return a.e()?this:".priority"===O(a)?this.ba:C};h.Ha=function(){return!1};h.qf=function(){return null};
h.Q=function(a,b){return".priority"===a?this.da(b):b.e()&&".priority"!==a?this:C.Q(a,b).da(this.ba)};h.G=function(a,b){var c=O(a);if(null===c)return b;if(b.e()&&".priority"!==c)return this;J(".priority"!==c||1===uc(a),".priority must be the last token in a path");return this.Q(c,C.G(G(a),b))};h.e=function(){return!1};h.Db=function(){return 0};h.K=function(a){return a&&!this.A().e()?{".value":this.Ba(),".priority":this.A().K()}:this.Ba()};
h.hash=function(){if(null===this.Bb){var a="";this.ba.e()||(a+="priority:"+le(this.ba.K())+":");var b=typeof this.C,a=a+(b+":"),a="number"===b?a+Zc(this.C):a+this.C;this.Bb=Jc(a)}return this.Bb};h.Ba=function(){return this.C};h.Cc=function(a){if(a===C)return 1;if(a instanceof T)return-1;J(a.N(),"Unknown node type");var b=typeof a.C,c=typeof this.C,d=Na(me,b),e=Na(me,c);J(0<=d,"Unknown leaf type: "+b);J(0<=e,"Unknown leaf type: "+c);return d===e?"object"===c?0:this.C<a.C?-1:this.C===a.C?0:1:e-d};
var me=["object","boolean","number","string"];tc.prototype.mb=function(){return this};tc.prototype.Ic=function(){return!0};tc.prototype.Z=function(a){return a===this?!0:a.N()?this.C===a.C&&this.ba.Z(a.ba):!1};tc.prototype.toString=function(){return B(this.K(!0))};function T(a,b,c){this.m=a;(this.ba=b)&&ke(this.ba);a.e()&&J(!this.ba||this.ba.e(),"An empty node cannot have a priority");this.wb=c;this.Bb=null}h=T.prototype;h.N=function(){return!1};h.A=function(){return this.ba||C};h.da=function(a){return this.m.e()?this:new T(this.m,a,this.wb)};h.M=function(a){if(".priority"===a)return this.A();a=this.m.get(a);return null===a?C:a};h.oa=function(a){var b=O(a);return null===b?this:this.M(b).oa(G(a))};h.Ha=function(a){return null!==this.m.get(a)};
h.Q=function(a,b){J(b,"We should always be passing snapshot nodes");if(".priority"===a)return this.da(b);var c=new E(a,b),d,e;b.e()?(d=this.m.remove(a),c=ie(this.wb,c,this.m)):(d=this.m.Na(a,b),c=ge(this.wb,c,this.m));e=d.e()?C:this.ba;return new T(d,e,c)};h.G=function(a,b){var c=O(a);if(null===c)return b;J(".priority"!==O(a)||1===uc(a),".priority must be the last token in a path");var d=this.M(c).G(G(a),b);return this.Q(c,d)};h.e=function(){return this.m.e()};h.Db=function(){return this.m.count()};
var ne=/^(0|[1-9]\d*)$/;h=T.prototype;h.K=function(a){if(this.e())return null;var b={},c=0,d=0,e=!0;this.U(M,function(f,g){b[f]=g.K(a);c++;e&&ne.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],g;for(g in b)f[g]=b[g];return f}a&&!this.A().e()&&(b[".priority"]=this.A().K());return b};h.hash=function(){if(null===this.Bb){var a="";this.A().e()||(a+="priority:"+le(this.A().K())+":");this.U(M,function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});this.Bb=""===a?"":Jc(a)}return this.Bb};
h.qf=function(a,b,c){return(c=oe(this,c))?(a=cc(c,new E(a,b)))?a.name:null:cc(this.m,a)};function wd(a,b){var c;c=(c=oe(a,b))?(c=c.Rc())&&c.name:a.m.Rc();return c?new E(c,a.m.get(c)):null}function xd(a,b){var c;c=(c=oe(a,b))?(c=c.ec())&&c.name:a.m.ec();return c?new E(c,a.m.get(c)):null}h.U=function(a,b){var c=oe(this,a);return c?c.ha(function(a){return b(a.name,a.S)}):this.m.ha(b)};h.Wb=function(a){return this.Xb(a.Sc(),a)};
h.Xb=function(a,b){var c=oe(this,b);if(c)return c.Xb(a,function(a){return a});for(var c=this.m.Xb(a.name,Qb),d=ec(c);null!=d&&0>b.compare(d,a);)H(c),d=ec(c);return c};h.rf=function(a){return this.Zb(a.Pc(),a)};h.Zb=function(a,b){var c=oe(this,b);if(c)return c.Zb(a,function(a){return a});for(var c=this.m.Zb(a.name,Qb),d=ec(c);null!=d&&0<b.compare(d,a);)H(c),d=ec(c);return c};h.Cc=function(a){return this.e()?a.e()?0:-1:a.N()||a.e()?1:a===Sd?-1:0};
h.mb=function(a){if(a===Vd||ta(this.wb.cc,a.toString()))return this;var b=this.wb,c=this.m;J(a!==Vd,"KeyIndex always exists and isn't meant to be added to the IndexMap.");for(var d=[],e=!1,c=c.Wb(Qb),f=H(c);f;)e=e||a.Hc(f.S),d.push(f),f=H(c);d=e?he(d,ud(a)):Pd;e=a.toString();c=xa(b.cc);c[e]=a;a=xa(b.yd);a[e]=d;return new T(this.m,this.ba,new fe(a,c))};h.Ic=function(a){return a===Vd||ta(this.wb.cc,a.toString())};
h.Z=function(a){if(a===this)return!0;if(a.N())return!1;if(this.A().Z(a.A())&&this.m.count()===a.m.count()){var b=this.Wb(M);a=a.Wb(M);for(var c=H(b),d=H(a);c&&d;){if(c.name!==d.name||!c.S.Z(d.S))return!1;c=H(b);d=H(a)}return null===c&&null===d}return!1};function oe(a,b){return b===Vd?null:a.wb.get(b.toString())}h.toString=function(){return B(this.K(!0))};function L(a,b){if(null===a)return C;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);J(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new tc(a,L(c));if(a instanceof Array){var d=C,e=a;r(e,function(a,b){if(u(e,b)&&"."!==b.substring(0,1)){var c=L(a);if(c.N()||!c.e())d=
d.Q(b,c)}});return d.da(L(c))}var f=[],g=!1,k=a;hb(k,function(a){if("string"!==typeof a||"."!==a.substring(0,1)){var b=L(k[a]);b.e()||(g=g||!b.A().e(),f.push(new E(a,b)))}});if(0==f.length)return C;var l=he(f,Rb,function(a){return a.name},Tb);if(g){var m=he(f,ud(M));return new T(l,L(c),new fe({".priority":m},{".priority":M}))}return new T(l,L(c),je)}var pe=Math.log(2);
function qe(a){this.count=parseInt(Math.log(a+1)/pe,10);this.hf=this.count-1;this.bg=a+1&parseInt(Array(this.count+1).join("1"),2)}function re(a){var b=!(a.bg&1<<a.hf);a.hf--;return b}
function he(a,b,c,d){function e(b,d){var f=d-b;if(0==f)return null;if(1==f){var m=a[b],v=c?c(m):m;return new fc(v,m.S,!1,null,null)}var m=parseInt(f/2,10)+b,f=e(b,m),y=e(m+1,d),m=a[m],v=c?c(m):m;return new fc(v,m.S,!1,f,y)}a.sort(b);var f=function(b){function d(b,g){var k=v-b,y=v;v-=b;var y=e(k+1,y),k=a[k],I=c?c(k):k,y=new fc(I,k.S,g,null,y);f?f.left=y:m=y;f=y}for(var f=null,m=null,v=a.length,y=0;y<b.count;++y){var I=re(b),vd=Math.pow(2,b.count-(y+1));I?d(vd,!1):(d(vd,!1),d(vd,!0))}return m}(new qe(a.length));
return null!==f?new ac(d||b,f):new ac(d||b)}function le(a){return"number"===typeof a?"number:"+Zc(a):"string:"+a}function ke(a){if(a.N()){var b=a.K();J("string"===typeof b||"number"===typeof b||"object"===typeof b&&u(b,".sv"),"Priority must be a string or number.")}else J(a===Sd||a.e(),"priority of unexpected type.");J(a===Sd||a.A().e(),"Priority nodes can't have a priority of their own.")}var C=new T(new ac(Tb),null,je);function se(){T.call(this,new ac(Tb),C,je)}ma(se,T);h=se.prototype;
h.Cc=function(a){return a===this?0:1};h.Z=function(a){return a===this};h.A=function(){return this};h.M=function(){return C};h.e=function(){return!1};var Sd=new se,Qd=new E("[MIN_NAME]",C),Xd=new E("[MAX_NAME]",Sd);function Id(a,b){this.D=a;this.Ud=b}function Fd(a,b,c,d){return new Id(new sb(b,c,d),a.Ud)}function Jd(a){return a.D.$?a.D.j():null}Id.prototype.u=function(){return this.Ud};function tb(a){return a.Ud.$?a.Ud.j():null};function te(a,b){this.V=a;var c=a.n,d=new ld(c.g),c=de(c)?new ld(c.g):c.ia?new rd(c):new md(c);this.Gf=new zd(c);var e=b.u(),f=b.D,g=d.ta(C,e.j(),null),k=c.ta(C,f.j(),null);this.Ka=new Id(new sb(k,f.$,c.Ga()),new sb(g,e.$,d.Ga()));this.Za=[];this.ig=new dd(a)}function ue(a){return a.V}h=te.prototype;h.u=function(){return this.Ka.u().j()};h.hb=function(a){var b=tb(this.Ka);return b&&(de(this.V.n)||!a.e()&&!b.M(O(a)).e())?b.oa(a):null};h.e=function(){return 0===this.Za.length};h.Ob=function(a){this.Za.push(a)};
h.kb=function(a,b){var c=[];if(b){J(null==a,"A cancel should cancel all event registrations.");var d=this.V.path;Oa(this.Za,function(a){(a=a.ff(b,d))&&c.push(a)})}if(a){for(var e=[],f=0;f<this.Za.length;++f){var g=this.Za[f];if(!g.matches(a))e.push(g);else if(a.sf()){e=e.concat(this.Za.slice(f+1));break}}this.Za=e}else this.Za=[];return c};
h.bb=function(a,b,c){a.type===Cd&&null!==a.source.Ib&&(J(tb(this.Ka),"We should always have a full cache before handling merges"),J(Jd(this.Ka),"Missing event cache, even though we have a server cache"));var d=this.Ka;a=this.Gf.bb(d,a,b,c);b=this.Gf;c=a.he;J(c.D.j().Ic(b.I.g),"Event snap not indexed");J(c.u().j().Ic(b.I.g),"Server snap not indexed");J(Hb(a.he.u())||!Hb(d.u()),"Once a server snap is complete, it should never go back");this.Ka=a.he;return ve(this,a.cg,a.he.D.j(),null)};
function we(a,b){var c=a.Ka.D,d=[];c.j().N()||c.j().U(M,function(a,b){d.push(new D("child_added",b,a))});c.$&&d.push(Db(c.j()));return ve(a,d,c.j(),b)}function ve(a,b,c,d){return ed(a.ig,b,c,d?[d]:a.Za)};function xe(a,b,c){this.type=Cd;this.source=a;this.path=b;this.children=c}xe.prototype.Wc=function(a){if(this.path.e())return a=this.children.subtree(new K(a)),a.e()?null:a.value?new Ub(this.source,F,a.value):new xe(this.source,F,a);J(O(this.path)===a,"Can't get a merge for a child not on the path of the operation");return new xe(this.source,G(this.path),this.children)};xe.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"};var Vb=0,Cd=1,Xb=2,$b=3;function ye(a,b,c,d){this.ve=a;this.of=b;this.Ib=c;this.af=d;J(!d||b,"Tagged queries must be from server.")}var Yb=new ye(!0,!1,null,!1),ze=new ye(!1,!0,null,!1);ye.prototype.toString=function(){return this.ve?"user":this.af?"server(queryID="+this.Ib+")":"server"};function Ae(a,b){this.f=Oc("p:rest:");this.H=a;this.Gb=b;this.Fa=null;this.aa={}}function Be(a,b){if(n(b))return"tag$"+b;var c=a.n;J(de(c)&&c.g==M,"should have a tag if it's not a default query.");return a.path.toString()}h=Ae.prototype;
h.xf=function(a,b,c,d){var e=a.path.toString();this.f("Listen called for "+e+" "+a.wa());var f=Be(a,c),g={};this.aa[f]=g;a=ee(a.n);var k=this;Ce(this,e+".json",a,function(a,b){var v=b;404===a&&(a=v=null);null===a&&k.Gb(e,v,!1,c);w(k.aa,f)===g&&d(a?401==a?"permission_denied":"rest_error:"+a:"ok",null)})};h.Of=function(a,b){var c=Be(a,b);delete this.aa[c]};h.P=function(a,b){this.Fa=a;var c=ad(a),d=c.data,c=c.Ac&&c.Ac.exp;b&&b("ok",{auth:d,expires:c})};h.ee=function(a){this.Fa=null;a("ok",null)};
h.Le=function(){};h.Bf=function(){};h.Gd=function(){};h.put=function(){};h.yf=function(){};h.Te=function(){};
function Ce(a,b,c,d){c=c||{};c.format="export";a.Fa&&(c.auth=a.Fa);var e=(a.H.lb?"https://":"http://")+a.H.host+b+"?"+jb(c);a.f("Sending REST request for "+e);var f=new XMLHttpRequest;f.onreadystatechange=function(){if(d&&4===f.readyState){a.f("REST Response for "+e+" received. status:",f.status,"response:",f.responseText);var b=null;if(200<=f.status&&300>f.status){try{b=mb(f.responseText)}catch(c){Q("Failed to parse JSON response for "+e+": "+f.responseText)}d(null,b)}else 401!==f.status&&404!==
f.status&&Q("Got unsuccessful REST response for "+e+" Status: "+f.status),d(f.status);d=null}};f.open("GET",e,!0);f.send()};function De(a,b){this.value=a;this.children=b||Ee}var Ee=new ac(function(a,b){return a===b?0:a<b?-1:1});function Fe(a){var b=Nd;r(a,function(a,d){b=b.set(new K(d),a)});return b}h=De.prototype;h.e=function(){return null===this.value&&this.children.e()};function Ge(a,b,c){if(null!=a.value&&c(a.value))return{path:F,value:a.value};if(b.e())return null;var d=O(b);a=a.children.get(d);return null!==a?(b=Ge(a,G(b),c),null!=b?{path:(new K(d)).w(b.path),value:b.value}:null):null}
function He(a,b){return Ge(a,b,function(){return!0})}h.subtree=function(a){if(a.e())return this;var b=this.children.get(O(a));return null!==b?b.subtree(G(a)):Nd};h.set=function(a,b){if(a.e())return new De(b,this.children);var c=O(a),d=(this.children.get(c)||Nd).set(G(a),b),c=this.children.Na(c,d);return new De(this.value,c)};
h.remove=function(a){if(a.e())return this.children.e()?Nd:new De(null,this.children);var b=O(a),c=this.children.get(b);return c?(a=c.remove(G(a)),b=a.e()?this.children.remove(b):this.children.Na(b,a),null===this.value&&b.e()?Nd:new De(this.value,b)):this};h.get=function(a){if(a.e())return this.value;var b=this.children.get(O(a));return b?b.get(G(a)):null};
function Md(a,b,c){if(b.e())return c;var d=O(b);b=Md(a.children.get(d)||Nd,G(b),c);d=b.e()?a.children.remove(d):a.children.Na(d,b);return new De(a.value,d)}function Ie(a,b){return Je(a,F,b)}function Je(a,b,c){var d={};a.children.ha(function(a,f){d[a]=Je(f,b.w(a),c)});return c(b,a.value,d)}function Ke(a,b,c){return Le(a,b,F,c)}function Le(a,b,c,d){var e=a.value?d(c,a.value):!1;if(e)return e;if(b.e())return null;e=O(b);return(a=a.children.get(e))?Le(a,G(b),c.w(e),d):null}
function Me(a,b,c){var d=F;if(!b.e()){var e=!0;a.value&&(e=c(d,a.value));!0===e&&(e=O(b),(a=a.children.get(e))&&Ne(a,G(b),d.w(e),c))}}function Ne(a,b,c,d){if(b.e())return a;a.value&&d(c,a.value);var e=O(b);return(a=a.children.get(e))?Ne(a,G(b),c.w(e),d):Nd}function Kd(a,b){Oe(a,F,b)}function Oe(a,b,c){a.children.ha(function(a,e){Oe(e,b.w(a),c)});a.value&&c(b,a.value)}function Pe(a,b){a.children.ha(function(a,d){d.value&&b(a,d.value)})}var Nd=new De(null);
De.prototype.toString=function(){var a={};Kd(this,function(b,c){a[b.toString()]=c.toString()});return B(a)};function Qe(a){this.W=a}var Re=new Qe(new De(null));function Se(a,b,c){if(b.e())return new Qe(new De(c));var d=He(a.W,b);if(null!=d){var e=d.path,d=d.value;b=N(e,b);d=d.G(b,c);return new Qe(a.W.set(e,d))}a=Md(a.W,b,new De(c));return new Qe(a)}function Te(a,b,c){var d=a;hb(c,function(a,c){d=Se(d,b.w(a),c)});return d}Qe.prototype.Od=function(a){if(a.e())return Re;a=Md(this.W,a,Nd);return new Qe(a)};function Ue(a,b){var c=He(a.W,b);return null!=c?a.W.get(c.path).oa(N(c.path,b)):null}
function Ve(a){var b=[],c=a.W.value;null!=c?c.N()||c.U(M,function(a,c){b.push(new E(a,c))}):a.W.children.ha(function(a,c){null!=c.value&&b.push(new E(a,c.value))});return b}function We(a,b){if(b.e())return a;var c=Ue(a,b);return null!=c?new Qe(new De(c)):new Qe(a.W.subtree(b))}Qe.prototype.e=function(){return this.W.e()};Qe.prototype.apply=function(a){return Xe(F,this.W,a)};
function Xe(a,b,c){if(null!=b.value)return c.G(a,b.value);var d=null;b.children.ha(function(b,f){".priority"===b?(J(null!==f.value,"Priority writes must always be leaf nodes"),d=f.value):c=Xe(a.w(b),f,c)});c.oa(a).e()||null===d||(c=c.G(a.w(".priority"),d));return c};function Ye(){this.T=Re;this.za=[];this.Lc=-1}h=Ye.prototype;
h.Od=function(a){var b=Ua(this.za,function(b){return b.ie===a});J(0<=b,"removeWrite called with nonexistent writeId.");var c=this.za[b];this.za.splice(b,1);for(var d=c.visible,e=!1,f=this.za.length-1;d&&0<=f;){var g=this.za[f];g.visible&&(f>=b&&Ze(g,c.path)?d=!1:c.path.contains(g.path)&&(e=!0));f--}if(d){if(e)this.T=$e(this.za,af,F),this.Lc=0<this.za.length?this.za[this.za.length-1].ie:-1;else if(c.Ia)this.T=this.T.Od(c.path);else{var k=this;r(c.children,function(a,b){k.T=k.T.Od(c.path.w(b))})}return c.path}return null};
h.ua=function(a,b,c,d){if(c||d){var e=We(this.T,a);return!d&&e.e()?b:d||null!=b||null!=Ue(e,F)?(e=$e(this.za,function(b){return(b.visible||d)&&(!c||!(0<=Na(c,b.ie)))&&(b.path.contains(a)||a.contains(b.path))},a),b=b||C,e.apply(b)):null}e=Ue(this.T,a);if(null!=e)return e;e=We(this.T,a);return e.e()?b:null!=b||null!=Ue(e,F)?(b=b||C,e.apply(b)):null};
h.xc=function(a,b){var c=C,d=Ue(this.T,a);if(d)d.N()||d.U(M,function(a,b){c=c.Q(a,b)});else if(b){var e=We(this.T,a);b.U(M,function(a,b){var d=We(e,new K(a)).apply(b);c=c.Q(a,d)});Oa(Ve(e),function(a){c=c.Q(a.name,a.S)})}else e=We(this.T,a),Oa(Ve(e),function(a){c=c.Q(a.name,a.S)});return c};h.hd=function(a,b,c,d){J(c||d,"Either existingEventSnap or existingServerSnap must exist");a=a.w(b);if(null!=Ue(this.T,a))return null;a=We(this.T,a);return a.e()?d.oa(b):a.apply(d.oa(b))};
h.Xa=function(a,b,c){a=a.w(b);var d=Ue(this.T,a);return null!=d?d:rb(c,b)?We(this.T,a).apply(c.j().M(b)):null};h.sc=function(a){return Ue(this.T,a)};h.me=function(a,b,c,d,e,f){var g;a=We(this.T,a);g=Ue(a,F);if(null==g)if(null!=b)g=a.apply(b);else return[];g=g.mb(f);if(g.e()||g.N())return[];b=[];a=ud(f);e=e?g.Zb(c,f):g.Xb(c,f);for(f=H(e);f&&b.length<d;)0!==a(f,c)&&b.push(f),f=H(e);return b};
function Ze(a,b){return a.Ia?a.path.contains(b):!!ua(a.children,function(c,d){return a.path.w(d).contains(b)})}function af(a){return a.visible}
function $e(a,b,c){for(var d=Re,e=0;e<a.length;++e){var f=a[e];if(b(f)){var g=f.path;if(f.Ia)c.contains(g)?(g=N(c,g),d=Se(d,g,f.Ia)):g.contains(c)&&(g=N(g,c),d=Se(d,F,f.Ia.oa(g)));else if(f.children)if(c.contains(g))g=N(c,g),d=Te(d,g,f.children);else{if(g.contains(c))if(g=N(g,c),g.e())d=Te(d,F,f.children);else if(f=w(f.children,O(g)))f=f.oa(G(g)),d=Se(d,F,f)}else throw Hc("WriteRecord should have .snap or .children");}}return d}function bf(a,b){this.Mb=a;this.W=b}h=bf.prototype;
h.ua=function(a,b,c){return this.W.ua(this.Mb,a,b,c)};h.xc=function(a){return this.W.xc(this.Mb,a)};h.hd=function(a,b,c){return this.W.hd(this.Mb,a,b,c)};h.sc=function(a){return this.W.sc(this.Mb.w(a))};h.me=function(a,b,c,d,e){return this.W.me(this.Mb,a,b,c,d,e)};h.Xa=function(a,b){return this.W.Xa(this.Mb,a,b)};h.w=function(a){return new bf(this.Mb.w(a),this.W)};function cf(){this.ya={}}h=cf.prototype;h.e=function(){return wa(this.ya)};h.bb=function(a,b,c){var d=a.source.Ib;if(null!==d)return d=w(this.ya,d),J(null!=d,"SyncTree gave us an op for an invalid query."),d.bb(a,b,c);var e=[];r(this.ya,function(d){e=e.concat(d.bb(a,b,c))});return e};h.Ob=function(a,b,c,d,e){var f=a.wa(),g=w(this.ya,f);if(!g){var g=c.ua(e?d:null),k=!1;g?k=!0:(g=d instanceof T?c.xc(d):C,k=!1);g=new te(a,new Id(new sb(g,k,!1),new sb(d,e,!1)));this.ya[f]=g}g.Ob(b);return we(g,b)};
h.kb=function(a,b,c){var d=a.wa(),e=[],f=[],g=null!=df(this);if("default"===d){var k=this;r(this.ya,function(a,d){f=f.concat(a.kb(b,c));a.e()&&(delete k.ya[d],de(a.V.n)||e.push(a.V))})}else{var l=w(this.ya,d);l&&(f=f.concat(l.kb(b,c)),l.e()&&(delete this.ya[d],de(l.V.n)||e.push(l.V)))}g&&null==df(this)&&e.push(new U(a.k,a.path));return{Hg:e,jg:f}};function ef(a){return Pa(ra(a.ya),function(a){return!de(a.V.n)})}h.hb=function(a){var b=null;r(this.ya,function(c){b=b||c.hb(a)});return b};
function ff(a,b){if(de(b.n))return df(a);var c=b.wa();return w(a.ya,c)}function df(a){return va(a.ya,function(a){return de(a.V.n)})||null};function gf(a){this.sa=Nd;this.Hb=new Ye;this.$e={};this.kc={};this.Mc=a}function hf(a,b,c,d,e){var f=a.Hb,g=e;J(d>f.Lc,"Stacking an older write on top of newer ones");n(g)||(g=!0);f.za.push({path:b,Ia:c,ie:d,visible:g});g&&(f.T=Se(f.T,b,c));f.Lc=d;return e?jf(a,new Ub(Yb,b,c)):[]}function kf(a,b,c,d){var e=a.Hb;J(d>e.Lc,"Stacking an older merge on top of newer ones");e.za.push({path:b,children:c,ie:d,visible:!0});e.T=Te(e.T,b,c);e.Lc=d;c=Fe(c);return jf(a,new xe(Yb,b,c))}
function lf(a,b,c){c=c||!1;b=a.Hb.Od(b);return null==b?[]:jf(a,new Wb(b,c))}function mf(a,b,c){c=Fe(c);return jf(a,new xe(ze,b,c))}function nf(a,b,c,d){d=of(a,d);if(null!=d){var e=pf(d);d=e.path;e=e.Ib;b=N(d,b);c=new Ub(new ye(!1,!0,e,!0),b,c);return qf(a,d,c)}return[]}function rf(a,b,c,d){if(d=of(a,d)){var e=pf(d);d=e.path;e=e.Ib;b=N(d,b);c=Fe(c);c=new xe(new ye(!1,!0,e,!0),b,c);return qf(a,d,c)}return[]}
gf.prototype.Ob=function(a,b){var c=a.path,d=null,e=!1;Me(this.sa,c,function(a,b){var f=N(a,c);d=b.hb(f);e=e||null!=df(b);return!d});var f=this.sa.get(c);f?(e=e||null!=df(f),d=d||f.hb(F)):(f=new cf,this.sa=this.sa.set(c,f));var g;null!=d?g=!0:(g=!1,d=C,Pe(this.sa.subtree(c),function(a,b){var c=b.hb(F);c&&(d=d.Q(a,c))}));var k=null!=ff(f,a);if(!k&&!de(a.n)){var l=sf(a);J(!(l in this.kc),"View does not exist, but we have a tag");var m=tf++;this.kc[l]=m;this.$e["_"+m]=l}g=f.Ob(a,b,new bf(c,this.Hb),
d,g);k||e||(f=ff(f,a),g=g.concat(uf(this,a,f)));return g};
gf.prototype.kb=function(a,b,c){var d=a.path,e=this.sa.get(d),f=[];if(e&&("default"===a.wa()||null!=ff(e,a))){f=e.kb(a,b,c);e.e()&&(this.sa=this.sa.remove(d));e=f.Hg;f=f.jg;b=-1!==Ua(e,function(a){return de(a.n)});var g=Ke(this.sa,d,function(a,b){return null!=df(b)});if(b&&!g&&(d=this.sa.subtree(d),!d.e()))for(var d=vf(d),k=0;k<d.length;++k){var l=d[k],m=l.V,l=wf(this,l);this.Mc.Xe(m,xf(this,m),l.ud,l.J)}if(!g&&0<e.length&&!c)if(b)this.Mc.Zd(a,null);else{var v=this;Oa(e,function(a){a.wa();var b=v.kc[sf(a)];
v.Mc.Zd(a,b)})}yf(this,e)}return f};gf.prototype.ua=function(a,b){var c=this.Hb,d=Ke(this.sa,a,function(b,c){var d=N(b,a);if(d=c.hb(d))return d});return c.ua(a,d,b,!0)};function vf(a){return Ie(a,function(a,c,d){if(c&&null!=df(c))return[df(c)];var e=[];c&&(e=ef(c));r(d,function(a){e=e.concat(a)});return e})}function yf(a,b){for(var c=0;c<b.length;++c){var d=b[c];if(!de(d.n)){var d=sf(d),e=a.kc[d];delete a.kc[d];delete a.$e["_"+e]}}}
function uf(a,b,c){var d=b.path,e=xf(a,b);c=wf(a,c);b=a.Mc.Xe(b,e,c.ud,c.J);d=a.sa.subtree(d);if(e)J(null==df(d.value),"If we're adding a query, it shouldn't be shadowed");else for(e=Ie(d,function(a,b,c){if(!a.e()&&b&&null!=df(b))return[ue(df(b))];var d=[];b&&(d=d.concat(Qa(ef(b),function(a){return a.V})));r(c,function(a){d=d.concat(a)});return d}),d=0;d<e.length;++d)c=e[d],a.Mc.Zd(c,xf(a,c));return b}
function wf(a,b){var c=b.V,d=xf(a,c);return{ud:function(){return(b.u()||C).hash()},J:function(b){if("ok"===b){if(d){var f=c.path;if(b=of(a,d)){var g=pf(b);b=g.path;g=g.Ib;f=N(b,f);f=new Zb(new ye(!1,!0,g,!0),f);b=qf(a,b,f)}else b=[]}else b=jf(a,new Zb(ze,c.path));return b}f="Unknown Error";"too_big"===b?f="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==b?f="Client doesn't have permission to access the desired data.":"unavailable"==b&&
(f="The service is unavailable");f=Error(b+": "+f);f.code=b.toUpperCase();return a.kb(c,null,f)}}}function sf(a){return a.path.toString()+"$"+a.wa()}function pf(a){var b=a.indexOf("$");J(-1!==b&&b<a.length-1,"Bad queryKey.");return{Ib:a.substr(b+1),path:new K(a.substr(0,b))}}function of(a,b){var c=a.$e,d="_"+b;return d in c?c[d]:void 0}function xf(a,b){var c=sf(b);return w(a.kc,c)}var tf=1;
function qf(a,b,c){var d=a.sa.get(b);J(d,"Missing sync point for query tag that we're tracking");return d.bb(c,new bf(b,a.Hb),null)}function jf(a,b){return zf(a,b,a.sa,null,new bf(F,a.Hb))}function zf(a,b,c,d,e){if(b.path.e())return Af(a,b,c,d,e);var f=c.get(F);null==d&&null!=f&&(d=f.hb(F));var g=[],k=O(b.path),l=b.Wc(k);if((c=c.children.get(k))&&l)var m=d?d.M(k):null,k=e.w(k),g=g.concat(zf(a,l,c,m,k));f&&(g=g.concat(f.bb(b,e,d)));return g}
function Af(a,b,c,d,e){var f=c.get(F);null==d&&null!=f&&(d=f.hb(F));var g=[];c.children.ha(function(c,f){var m=d?d.M(c):null,v=e.w(c),y=b.Wc(c);y&&(g=g.concat(Af(a,y,f,m,v)))});f&&(g=g.concat(f.bb(b,e,d)));return g};function Bf(){this.children={};this.kd=0;this.value=null}function Cf(a,b,c){this.Dd=a?a:"";this.Yc=b?b:null;this.B=c?c:new Bf}function Df(a,b){for(var c=b instanceof K?b:new K(b),d=a,e;null!==(e=O(c));)d=new Cf(e,d,w(d.B.children,e)||new Bf),c=G(c);return d}h=Cf.prototype;h.Ba=function(){return this.B.value};function Ef(a,b){J("undefined"!==typeof b,"Cannot set value to undefined");a.B.value=b;Ff(a)}h.clear=function(){this.B.value=null;this.B.children={};this.B.kd=0;Ff(this)};
h.td=function(){return 0<this.B.kd};h.e=function(){return null===this.Ba()&&!this.td()};h.U=function(a){var b=this;r(this.B.children,function(c,d){a(new Cf(d,b,c))})};function Gf(a,b,c,d){c&&!d&&b(a);a.U(function(a){Gf(a,b,!0,d)});c&&d&&b(a)}function Hf(a,b){for(var c=a.parent();null!==c&&!b(c);)c=c.parent()}h.path=function(){return new K(null===this.Yc?this.Dd:this.Yc.path()+"/"+this.Dd)};h.name=function(){return this.Dd};h.parent=function(){return this.Yc};
function Ff(a){if(null!==a.Yc){var b=a.Yc,c=a.Dd,d=a.e(),e=u(b.B.children,c);d&&e?(delete b.B.children[c],b.B.kd--,Ff(b)):d||e||(b.B.children[c]=a.B,b.B.kd++,Ff(b))}};function If(a){J(ea(a)&&0<a.length,"Requires a non-empty array");this.Uf=a;this.Nc={}}If.prototype.de=function(a,b){for(var c=this.Nc[a]||[],d=0;d<c.length;d++)c[d].yc.apply(c[d].Ma,Array.prototype.slice.call(arguments,1))};If.prototype.Eb=function(a,b,c){Jf(this,a);this.Nc[a]=this.Nc[a]||[];this.Nc[a].push({yc:b,Ma:c});(a=this.ze(a))&&b.apply(c,a)};If.prototype.gc=function(a,b,c){Jf(this,a);a=this.Nc[a]||[];for(var d=0;d<a.length;d++)if(a[d].yc===b&&(!c||c===a[d].Ma)){a.splice(d,1);break}};
function Jf(a,b){J(Ta(a.Uf,function(a){return a===b}),"Unknown event: "+b)};var Kf=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);J(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);J(20===c.length,"nextPushId: Length should be 20.");
return c}}();function Lf(){If.call(this,["online"]);this.ic=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener){var a=this;window.addEventListener("online",function(){a.ic||(a.ic=!0,a.de("online",!0))},!1);window.addEventListener("offline",function(){a.ic&&(a.ic=!1,a.de("online",!1))},!1)}}ma(Lf,If);Lf.prototype.ze=function(a){J("online"===a,"Unknown event type: "+a);return[this.ic]};ca(Lf);function Mf(){If.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.uc=!0;if(b){var c=this;document.addEventListener(b,
function(){var b=!document[a];b!==c.uc&&(c.uc=b,c.de("visible",b))},!1)}}ma(Mf,If);Mf.prototype.ze=function(a){J("visible"===a,"Unknown event type: "+a);return[this.uc]};ca(Mf);var Nf=/[\[\].#$\/\u0000-\u001F\u007F]/,Of=/[\[\].#$\u0000-\u001F\u007F]/;function Pf(a){return p(a)&&0!==a.length&&!Nf.test(a)}function Qf(a){return null===a||p(a)||ga(a)&&!Sc(a)||ia(a)&&u(a,".sv")}function Rf(a,b,c,d){d&&!n(b)||Sf(z(a,1,d),b,c)}
function Sf(a,b,c){c instanceof K&&(c=new wc(c,a));if(!n(b))throw Error(a+"contains undefined "+zc(c));if(ha(b))throw Error(a+"contains a function "+zc(c)+" with contents: "+b.toString());if(Sc(b))throw Error(a+"contains "+b.toString()+" "+zc(c));if(p(b)&&b.length>10485760/3&&10485760<xc(b))throw Error(a+"contains a string greater than 10485760 utf8 bytes "+zc(c)+" ('"+b.substring(0,50)+"...')");if(ia(b)){var d=!1,e=!1;hb(b,function(b,g){if(".value"===b)d=!0;else if(".priority"!==b&&".sv"!==b&&(e=
!0,!Pf(b)))throw Error(a+" contains an invalid key ("+b+") "+zc(c)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');c.push(b);Sf(a,g,c);c.pop()});if(d&&e)throw Error(a+' contains ".value" child '+zc(c)+" in addition to actual children.");}}
function Tf(a,b,c){if(!ia(b)||ea(b))throw Error(z(a,1,!1)+" must be an Object containing the children to replace.");if(u(b,".value"))throw Error(z(a,1,!1)+' must not contain ".value".  To overwrite with a leaf value, just use .set() instead.');Rf(a,b,c,!1)}
function Uf(a,b,c){if(Sc(c))throw Error(z(a,b,!1)+"is "+c.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!Qf(c))throw Error(z(a,b,!1)+"must be a valid Firebase priority (a string, finite number, server value, or null).");}
function Vf(a,b,c){if(!c||n(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(z(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}function Wf(a,b,c,d){if((!d||n(c))&&!Pf(c))throw Error(z(a,b,d)+'was an invalid key: "'+c+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}
function Xf(a,b){if(!p(b)||0===b.length||Of.test(b))throw Error(z(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function Yf(a,b){if(".info"===O(b))throw Error(a+" failed: Can't modify data under /.info/");}function Zf(a,b){if(!p(b))throw Error(z(a,1,!1)+"must be a valid credential (a string).");}function $f(a,b,c){if(!p(c))throw Error(z(a,b,!1)+"must be a valid string.");}
function ag(a,b,c,d){if(!d||n(c))if(!ia(c)||null===c)throw Error(z(a,b,d)+"must be a valid object.");}function bg(a,b,c){if(!ia(b)||null===b||!u(b,c))throw Error(z(a,1,!1)+'must contain the key "'+c+'"');if(!p(w(b,c)))throw Error(z(a,1,!1)+'must contain the key "'+c+'" with type "string"');};function cg(){this.set={}}h=cg.prototype;h.add=function(a,b){this.set[a]=null!==b?b:!0};h.contains=function(a){return u(this.set,a)};h.get=function(a){return this.contains(a)?this.set[a]:void 0};h.remove=function(a){delete this.set[a]};h.clear=function(){this.set={}};h.e=function(){return wa(this.set)};h.count=function(){return pa(this.set)};function dg(a,b){r(a.set,function(a,d){b(d,a)})}h.keys=function(){var a=[];r(this.set,function(b,c){a.push(c)});return a};function qc(){this.m=this.C=null}qc.prototype.find=function(a){if(null!=this.C)return this.C.oa(a);if(a.e()||null==this.m)return null;var b=O(a);a=G(a);return this.m.contains(b)?this.m.get(b).find(a):null};qc.prototype.mc=function(a,b){if(a.e())this.C=b,this.m=null;else if(null!==this.C)this.C=this.C.G(a,b);else{null==this.m&&(this.m=new cg);var c=O(a);this.m.contains(c)||this.m.add(c,new qc);c=this.m.get(c);a=G(a);c.mc(a,b)}};
function eg(a,b){if(b.e())return a.C=null,a.m=null,!0;if(null!==a.C){if(a.C.N())return!1;var c=a.C;a.C=null;c.U(M,function(b,c){a.mc(new K(b),c)});return eg(a,b)}return null!==a.m?(c=O(b),b=G(b),a.m.contains(c)&&eg(a.m.get(c),b)&&a.m.remove(c),a.m.e()?(a.m=null,!0):!1):!0}function rc(a,b,c){null!==a.C?c(b,a.C):a.U(function(a,e){var f=new K(b.toString()+"/"+a);rc(e,f,c)})}qc.prototype.U=function(a){null!==this.m&&dg(this.m,function(b,c){a(b,c)})};var fg="auth.firebase.com";function gg(a,b,c){this.ld=a||{};this.ce=b||{};this.ab=c||{};this.ld.remember||(this.ld.remember="default")}var hg=["remember","redirectTo"];function ig(a){var b={},c={};hb(a||{},function(a,e){0<=Na(hg,a)?b[a]=e:c[a]=e});return new gg(b,{},c)};function jg(a,b){this.Pe=["session",a.Ld,a.Cb].join(":");this.$d=b}jg.prototype.set=function(a,b){if(!b)if(this.$d.length)b=this.$d[0];else throw Error("fb.login.SessionManager : No storage options available!");b.set(this.Pe,a)};jg.prototype.get=function(){var a=Qa(this.$d,q(this.ng,this)),a=Pa(a,function(a){return null!==a});Xa(a,function(a,c){return bd(c.token)-bd(a.token)});return 0<a.length?a.shift():null};jg.prototype.ng=function(a){try{var b=a.get(this.Pe);if(b&&b.token)return b}catch(c){}return null};
jg.prototype.clear=function(){var a=this;Oa(this.$d,function(b){b.remove(a.Pe)})};function kg(){return"undefined"!==typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(navigator.userAgent)}function lg(){return"undefined"!==typeof location&&/^file:\//.test(location.href)}
function mg(){if("undefined"===typeof navigator)return!1;var a=navigator.userAgent;if("Microsoft Internet Explorer"===navigator.appName){if((a=a.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1])}else if(-1<a.indexOf("Trident")&&(a=a.match(/rv:([0-9]{2,2}[\.0-9]{0,})/))&&1<a.length)return 8<=parseFloat(a[1]);return!1};function ng(){var a=window.opener.frames,b;for(b=a.length-1;0<=b;b--)try{if(a[b].location.protocol===window.location.protocol&&a[b].location.host===window.location.host&&"__winchan_relay_frame"===a[b].name)return a[b]}catch(c){}return null}function og(a,b,c){a.attachEvent?a.attachEvent("on"+b,c):a.addEventListener&&a.addEventListener(b,c,!1)}function pg(a,b,c){a.detachEvent?a.detachEvent("on"+b,c):a.removeEventListener&&a.removeEventListener(b,c,!1)}
function qg(a){/^https?:\/\//.test(a)||(a=window.location.href);var b=/^(https?:\/\/[\-_a-zA-Z\.0-9:]+)/.exec(a);return b?b[1]:a}function rg(a){var b="";try{a=a.replace("#","");var c=kb(a);c&&u(c,"__firebase_request_key")&&(b=w(c,"__firebase_request_key"))}catch(d){}return b}function sg(){var a=Rc(fg);return a.scheme+"://"+a.host+"/v2"}function tg(a){return sg()+"/"+a+"/auth/channel"};function ug(a){var b=this;this.zc=a;this.ae="*";mg()?this.Qc=this.wd=ng():(this.Qc=window.opener,this.wd=window);if(!b.Qc)throw"Unable to find relay frame";og(this.wd,"message",q(this.hc,this));og(this.wd,"message",q(this.Af,this));try{vg(this,{a:"ready"})}catch(c){og(this.Qc,"load",function(){vg(b,{a:"ready"})})}og(window,"unload",q(this.yg,this))}function vg(a,b){b=B(b);mg()?a.Qc.doPost(b,a.ae):a.Qc.postMessage(b,a.ae)}
ug.prototype.hc=function(a){var b=this,c;try{c=mb(a.data)}catch(d){}c&&"request"===c.a&&(pg(window,"message",this.hc),this.ae=a.origin,this.zc&&setTimeout(function(){b.zc(b.ae,c.d,function(a,c){b.ag=!c;b.zc=void 0;vg(b,{a:"response",d:a,forceKeepWindowOpen:c})})},0))};ug.prototype.yg=function(){try{pg(this.wd,"message",this.Af)}catch(a){}this.zc&&(vg(this,{a:"error",d:"unknown closed window"}),this.zc=void 0);try{window.close()}catch(b){}};ug.prototype.Af=function(a){if(this.ag&&"die"===a.data)try{window.close()}catch(b){}};function wg(a){this.oc=Ga()+Ga()+Ga();this.Df=a}wg.prototype.open=function(a,b){P.set("redirect_request_id",this.oc);P.set("redirect_request_id",this.oc);b.requestId=this.oc;b.redirectTo=b.redirectTo||window.location.href;a+=(/\?/.test(a)?"":"?")+jb(b);window.location=a};wg.isAvailable=function(){return!lg()&&!kg()};wg.prototype.Bc=function(){return"redirect"};var xg={NETWORK_ERROR:"Unable to contact the Firebase server.",SERVER_ERROR:"An unknown server error occurred.",TRANSPORT_UNAVAILABLE:"There are no login transports available for the requested method.",REQUEST_INTERRUPTED:"The browser redirected the page before the login request could complete.",USER_CANCELLED:"The user cancelled authentication."};function yg(a){var b=Error(w(xg,a),a);b.code=a;return b};function zg(a){if(!a.window_features||"undefined"!==typeof navigator&&(-1!==navigator.userAgent.indexOf("Fennec/")||-1!==navigator.userAgent.indexOf("Firefox/")&&-1!==navigator.userAgent.indexOf("Android")))a.window_features=void 0;a.window_name||(a.window_name="_blank");this.options=a}
zg.prototype.open=function(a,b,c){function d(a){g&&(document.body.removeChild(g),g=void 0);v&&(v=clearInterval(v));pg(window,"message",e);pg(window,"unload",d);if(m&&!a)try{m.close()}catch(b){k.postMessage("die",l)}m=k=void 0}function e(a){if(a.origin===l)try{var b=mb(a.data);"ready"===b.a?k.postMessage(y,l):"error"===b.a?(d(!1),c&&(c(b.d),c=null)):"response"===b.a&&(d(b.forceKeepWindowOpen),c&&(c(null,b.d),c=null))}catch(e){}}var f=mg(),g,k;if(!this.options.relay_url)return c(Error("invalid arguments: origin of url and relay_url must match"));
var l=qg(a);if(l!==qg(this.options.relay_url))c&&setTimeout(function(){c(Error("invalid arguments: origin of url and relay_url must match"))},0);else{f&&(g=document.createElement("iframe"),g.setAttribute("src",this.options.relay_url),g.style.display="none",g.setAttribute("name","__winchan_relay_frame"),document.body.appendChild(g),k=g.contentWindow);a+=(/\?/.test(a)?"":"?")+jb(b);var m=window.open(a,this.options.window_name,this.options.window_features);k||(k=m);var v=setInterval(function(){m&&m.closed&&
(d(!1),c&&(c(yg("USER_CANCELLED")),c=null))},500),y=B({a:"request",d:b});og(window,"unload",d);og(window,"message",e)}};
zg.isAvailable=function(){return"postMessage"in window&&!lg()&&!(kg()||"undefined"!==typeof navigator&&(navigator.userAgent.match(/Windows Phone/)||window.Windows&&/^ms-appx:/.test(location.href))||"undefined"!==typeof navigator&&"undefined"!==typeof window&&(navigator.userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i)||navigator.userAgent.match(/CriOS/)||navigator.userAgent.match(/Twitter for iPhone/)||navigator.userAgent.match(/FBAN\/FBIOS/)||window.navigator.standalone))&&!("undefined"!==
typeof navigator&&navigator.userAgent.match(/PhantomJS/))};zg.prototype.Bc=function(){return"popup"};function Ag(a){a.method||(a.method="GET");a.headers||(a.headers={});a.headers.content_type||(a.headers.content_type="application/json");a.headers.content_type=a.headers.content_type.toLowerCase();this.options=a}
Ag.prototype.open=function(a,b,c){function d(){c&&(c(yg("REQUEST_INTERRUPTED")),c=null)}var e=new XMLHttpRequest,f=this.options.method.toUpperCase(),g;og(window,"beforeunload",d);e.onreadystatechange=function(){if(c&&4===e.readyState){var a;if(200<=e.status&&300>e.status){try{a=mb(e.responseText)}catch(b){}c(null,a)}else 500<=e.status&&600>e.status?c(yg("SERVER_ERROR")):c(yg("NETWORK_ERROR"));c=null;pg(window,"beforeunload",d)}};if("GET"===f)a+=(/\?/.test(a)?"":"?")+jb(b),g=null;else{var k=this.options.headers.content_type;
"application/json"===k&&(g=B(b));"application/x-www-form-urlencoded"===k&&(g=jb(b))}e.open(f,a,!0);a={"X-Requested-With":"XMLHttpRequest",Accept:"application/json;text/plain"};za(a,this.options.headers);for(var l in a)e.setRequestHeader(l,a[l]);e.send(g)};Ag.isAvailable=function(){return!!window.XMLHttpRequest&&"string"===typeof(new XMLHttpRequest).responseType&&(!("undefined"!==typeof navigator&&(navigator.userAgent.match(/MSIE/)||navigator.userAgent.match(/Trident/)))||mg())};Ag.prototype.Bc=function(){return"json"};function Bg(a){this.oc=Ga()+Ga()+Ga();this.Df=a}
Bg.prototype.open=function(a,b,c){function d(){c&&(c(yg("USER_CANCELLED")),c=null)}var e=this,f=Rc(fg),g;b.requestId=this.oc;b.redirectTo=f.scheme+"://"+f.host+"/blank/page.html";a+=/\?/.test(a)?"":"?";a+=jb(b);(g=window.open(a,"_blank","location=no"))&&ha(g.addEventListener)?(g.addEventListener("loadstart",function(a){var b;if(b=a&&a.url)a:{try{var m=document.createElement("a");m.href=a.url;b=m.host===f.host&&"/blank/page.html"===m.pathname;break a}catch(v){}b=!1}b&&(a=rg(a.url),g.removeEventListener("exit",
d),g.close(),a=new gg(null,null,{requestId:e.oc,requestKey:a}),e.Df.requestWithCredential("/auth/session",a,c),c=null)}),g.addEventListener("exit",d)):c(yg("TRANSPORT_UNAVAILABLE"))};Bg.isAvailable=function(){return kg()};Bg.prototype.Bc=function(){return"redirect"};function Cg(a){a.callback_parameter||(a.callback_parameter="callback");this.options=a;window.__firebase_auth_jsonp=window.__firebase_auth_jsonp||{}}
Cg.prototype.open=function(a,b,c){function d(){c&&(c(yg("REQUEST_INTERRUPTED")),c=null)}function e(){setTimeout(function(){window.__firebase_auth_jsonp[f]=void 0;wa(window.__firebase_auth_jsonp)&&(window.__firebase_auth_jsonp=void 0);try{var a=document.getElementById(f);a&&a.parentNode.removeChild(a)}catch(b){}},1);pg(window,"beforeunload",d)}var f="fn"+(new Date).getTime()+Math.floor(99999*Math.random());b[this.options.callback_parameter]="__firebase_auth_jsonp."+f;a+=(/\?/.test(a)?"":"?")+jb(b);
og(window,"beforeunload",d);window.__firebase_auth_jsonp[f]=function(a){c&&(c(null,a),c=null);e()};Dg(f,a,c)};
function Dg(a,b,c){setTimeout(function(){try{var d=document.createElement("script");d.type="text/javascript";d.id=a;d.async=!0;d.src=b;d.onerror=function(){var b=document.getElementById(a);null!==b&&b.parentNode.removeChild(b);c&&c(yg("NETWORK_ERROR"))};var e=document.getElementsByTagName("head");(e&&0!=e.length?e[0]:document.documentElement).appendChild(d)}catch(f){c&&c(yg("NETWORK_ERROR"))}},0)}Cg.isAvailable=function(){return!0};Cg.prototype.Bc=function(){return"json"};function Eg(a,b,c,d){If.call(this,["auth_status"]);this.H=a;this.df=b;this.Sg=c;this.Ke=d;this.rc=new jg(a,[Dc,P]);this.nb=null;this.Re=!1;Fg(this)}ma(Eg,If);h=Eg.prototype;h.we=function(){return this.nb||null};function Fg(a){P.get("redirect_request_id")&&Gg(a);var b=a.rc.get();b&&b.token?(Hg(a,b),a.df(b.token,function(c,d){Ig(a,c,d,!1,b.token,b)},function(b,d){Jg(a,"resumeSession()",b,d)})):Hg(a,null)}
function Kg(a,b,c,d,e,f){"firebaseio-demo.com"===a.H.domain&&Q("Firebase authentication is not supported on demo Firebases (*.firebaseio-demo.com). To secure your Firebase, create a production Firebase at https://www.firebase.com.");a.df(b,function(f,k){Ig(a,f,k,!0,b,c,d||{},e)},function(b,c){Jg(a,"auth()",b,c,f)})}function Lg(a,b){a.rc.clear();Hg(a,null);a.Sg(function(a,d){if("ok"===a)R(b,null);else{var e=(a||"error").toUpperCase(),f=e;d&&(f+=": "+d);f=Error(f);f.code=e;R(b,f)}})}
function Ig(a,b,c,d,e,f,g,k){"ok"===b?(d&&(b=c.auth,f.auth=b,f.expires=c.expires,f.token=cd(e)?e:"",c=null,b&&u(b,"uid")?c=w(b,"uid"):u(f,"uid")&&(c=w(f,"uid")),f.uid=c,c="custom",b&&u(b,"provider")?c=w(b,"provider"):u(f,"provider")&&(c=w(f,"provider")),f.provider=c,a.rc.clear(),cd(e)&&(g=g||{},c=Dc,"sessionOnly"===g.remember&&(c=P),"none"!==g.remember&&a.rc.set(f,c)),Hg(a,f)),R(k,null,f)):(a.rc.clear(),Hg(a,null),f=a=(b||"error").toUpperCase(),c&&(f+=": "+c),f=Error(f),f.code=a,R(k,f))}
function Jg(a,b,c,d,e){Q(b+" was canceled: "+d);a.rc.clear();Hg(a,null);a=Error(d);a.code=c.toUpperCase();R(e,a)}function Mg(a,b,c,d,e){Ng(a);c=new gg(d||{},{},c||{});Og(a,[Ag,Cg],"/auth/"+b,c,e)}
function Pg(a,b,c,d){Ng(a);var e=[zg,Bg];c=ig(c);"anonymous"===b||"password"===b?setTimeout(function(){R(d,yg("TRANSPORT_UNAVAILABLE"))},0):(c.ce.window_features="menubar=yes,modal=yes,alwaysRaised=yeslocation=yes,resizable=yes,scrollbars=yes,status=yes,height=625,width=625,top="+("object"===typeof screen?.5*(screen.height-625):0)+",left="+("object"===typeof screen?.5*(screen.width-625):0),c.ce.relay_url=tg(a.H.Cb),c.ce.requestWithCredential=q(a.pc,a),Og(a,e,"/auth/"+b,c,d))}
function Gg(a){var b=P.get("redirect_request_id");if(b){var c=P.get("redirect_client_options");P.remove("redirect_request_id");P.remove("redirect_client_options");var d=[Ag,Cg],b={requestId:b,requestKey:rg(document.location.hash)},c=new gg(c,{},b);a.Re=!0;try{document.location.hash=document.location.hash.replace(/&__firebase_request_key=([a-zA-z0-9]*)/,"")}catch(e){}Og(a,d,"/auth/session",c,function(){this.Re=!1}.bind(a))}}
h.re=function(a,b){Ng(this);var c=ig(a);c.ab._method="POST";this.pc("/users",c,function(a,c){a?R(b,a):R(b,a,c)})};h.Se=function(a,b){var c=this;Ng(this);var d="/users/"+encodeURIComponent(a.email),e=ig(a);e.ab._method="DELETE";this.pc(d,e,function(a,d){!a&&d&&d.uid&&c.nb&&c.nb.uid&&c.nb.uid===d.uid&&Lg(c);R(b,a)})};h.oe=function(a,b){Ng(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=ig(a);d.ab._method="PUT";d.ab.password=a.newPassword;this.pc(c,d,function(a){R(b,a)})};
h.ne=function(a,b){Ng(this);var c="/users/"+encodeURIComponent(a.oldEmail)+"/email",d=ig(a);d.ab._method="PUT";d.ab.email=a.newEmail;d.ab.password=a.password;this.pc(c,d,function(a){R(b,a)})};h.Ue=function(a,b){Ng(this);var c="/users/"+encodeURIComponent(a.email)+"/password",d=ig(a);d.ab._method="POST";this.pc(c,d,function(a){R(b,a)})};h.pc=function(a,b,c){Qg(this,[Ag,Cg],a,b,c)};
function Og(a,b,c,d,e){Qg(a,b,c,d,function(b,c){!b&&c&&c.token&&c.uid?Kg(a,c.token,c,d.ld,function(a,b){a?R(e,a):R(e,null,b)}):R(e,b||yg("UNKNOWN_ERROR"))})}
function Qg(a,b,c,d,e){b=Pa(b,function(a){return"function"===typeof a.isAvailable&&a.isAvailable()});0===b.length?setTimeout(function(){R(e,yg("TRANSPORT_UNAVAILABLE"))},0):(b=new (b.shift())(d.ce),d=ib(d.ab),d.v="js-2.2.4",d.transport=b.Bc(),d.suppress_status_codes=!0,a=sg()+"/"+a.H.Cb+c,b.open(a,d,function(a,b){if(a)R(e,a);else if(b&&b.error){var c=Error(b.error.message);c.code=b.error.code;c.details=b.error.details;R(e,c)}else R(e,null,b)}))}
function Hg(a,b){var c=null!==a.nb||null!==b;a.nb=b;c&&a.de("auth_status",b);a.Ke(null!==b)}h.ze=function(a){J("auth_status"===a,'initial event must be of type "auth_status"');return this.Re?null:[this.nb]};function Ng(a){var b=a.H;if("firebaseio.com"!==b.domain&&"firebaseio-demo.com"!==b.domain&&"auth.firebase.com"===fg)throw Error("This custom Firebase server ('"+a.H.domain+"') does not support delegated login.");};function Rg(a){this.hc=a;this.Kd=[];this.Qb=0;this.pe=-1;this.Fb=null}function Sg(a,b,c){a.pe=b;a.Fb=c;a.pe<a.Qb&&(a.Fb(),a.Fb=null)}function Tg(a,b,c){for(a.Kd[b]=c;a.Kd[a.Qb];){var d=a.Kd[a.Qb];delete a.Kd[a.Qb];for(var e=0;e<d.length;++e)if(d[e]){var f=a;Cb(function(){f.hc(d[e])})}if(a.Qb===a.pe){a.Fb&&(clearTimeout(a.Fb),a.Fb(),a.Fb=null);break}a.Qb++}};function Ug(a,b,c){this.qe=a;this.f=Oc(a);this.ob=this.pb=0;this.Va=Ob(b);this.Vd=c;this.Gc=!1;this.gd=function(a){b.host!==b.Oa&&(a.ns=b.Cb);var c=[],f;for(f in a)a.hasOwnProperty(f)&&c.push(f+"="+a[f]);return(b.lb?"https://":"http://")+b.Oa+"/.lp?"+c.join("&")}}var Vg,Wg;
Ug.prototype.open=function(a,b){this.gf=0;this.ka=b;this.zf=new Rg(a);this.zb=!1;var c=this;this.rb=setTimeout(function(){c.f("Timed out trying to connect.");c.ib();c.rb=null},Math.floor(3E4));Tc(function(){if(!c.zb){c.Ta=new Xg(function(a,b,d,k,l){Yg(c,arguments);if(c.Ta)if(c.rb&&(clearTimeout(c.rb),c.rb=null),c.Gc=!0,"start"==a)c.id=b,c.Ff=d;else if("close"===a)b?(c.Ta.Td=!1,Sg(c.zf,b,function(){c.ib()})):c.ib();else throw Error("Unrecognized command received: "+a);},function(a,b){Yg(c,arguments);
Tg(c.zf,a,b)},function(){c.ib()},c.gd);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.Ta.fe&&(a.cb=c.Ta.fe);a.v="5";c.Vd&&(a.s=c.Vd);"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");a=c.gd(a);c.f("Connecting via long-poll to "+a);Zg(c.Ta,a,function(){})}})};
Ug.prototype.start=function(){var a=this.Ta,b=this.Ff;a.rg=this.id;a.sg=b;for(a.ke=!0;$g(a););a=this.id;b=this.Ff;this.fc=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.fc.src=this.gd(c);this.fc.style.display="none";document.body.appendChild(this.fc)};Ug.isAvailable=function(){return!Wg&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.Ug)&&(Vg||!0)};h=Ug.prototype;
h.Bd=function(){};h.cd=function(){this.zb=!0;this.Ta&&(this.Ta.close(),this.Ta=null);this.fc&&(document.body.removeChild(this.fc),this.fc=null);this.rb&&(clearTimeout(this.rb),this.rb=null)};h.ib=function(){this.zb||(this.f("Longpoll is closing itself"),this.cd(),this.ka&&(this.ka(this.Gc),this.ka=null))};h.close=function(){this.zb||(this.f("Longpoll is being closed."),this.cd())};
h.send=function(a){a=B(a);this.pb+=a.length;Lb(this.Va,"bytes_sent",a.length);a=Kc(a);a=fb(a,!0);a=Xc(a,1840);for(var b=0;b<a.length;b++){var c=this.Ta;c.$c.push({Jg:this.gf,Rg:a.length,jf:a[b]});c.ke&&$g(c);this.gf++}};function Yg(a,b){var c=B(b).length;a.ob+=c;Lb(a.Va,"bytes_received",c)}
function Xg(a,b,c,d){this.gd=d;this.jb=c;this.Oe=new cg;this.$c=[];this.se=Math.floor(1E8*Math.random());this.Td=!0;this.fe=Gc();window["pLPCommand"+this.fe]=a;window["pRTLPCB"+this.fe]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||Bb("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
a.contentDocument?a.gb=a.contentDocument:a.contentWindow?a.gb=a.contentWindow.document:a.document&&(a.gb=a.document);this.Ca=a;a="";this.Ca.src&&"javascript:"===this.Ca.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.Ca.gb.open(),this.Ca.gb.write(a),this.Ca.gb.close()}catch(f){Bb("frame writing exception"),f.stack&&Bb(f.stack),Bb(f)}}
Xg.prototype.close=function(){this.ke=!1;if(this.Ca){this.Ca.gb.body.innerHTML="";var a=this;setTimeout(function(){null!==a.Ca&&(document.body.removeChild(a.Ca),a.Ca=null)},Math.floor(0))}var b=this.jb;b&&(this.jb=null,b())};
function $g(a){if(a.ke&&a.Td&&a.Oe.count()<(0<a.$c.length?2:1)){a.se++;var b={};b.id=a.rg;b.pw=a.sg;b.ser=a.se;for(var b=a.gd(b),c="",d=0;0<a.$c.length;)if(1870>=a.$c[0].jf.length+30+c.length){var e=a.$c.shift(),c=c+"&seg"+d+"="+e.Jg+"&ts"+d+"="+e.Rg+"&d"+d+"="+e.jf;d++}else break;ah(a,b+c,a.se);return!0}return!1}function ah(a,b,c){function d(){a.Oe.remove(c);$g(a)}a.Oe.add(c,1);var e=setTimeout(d,Math.floor(25E3));Zg(a,b,function(){clearTimeout(e);d()})}
function Zg(a,b,c){setTimeout(function(){try{if(a.Td){var d=a.Ca.gb.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){Bb("Long-poll script failed to load: "+b);a.Td=!1;a.close()};a.Ca.gb.body.appendChild(d)}}catch(e){}},Math.floor(1))};var bh=null;"undefined"!==typeof MozWebSocket?bh=MozWebSocket:"undefined"!==typeof WebSocket&&(bh=WebSocket);function ch(a,b,c){this.qe=a;this.f=Oc(this.qe);this.frames=this.Jc=null;this.ob=this.pb=this.bf=0;this.Va=Ob(b);this.fb=(b.lb?"wss://":"ws://")+b.Oa+"/.ws?v=5";"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(this.fb+="&r=f");b.host!==b.Oa&&(this.fb=this.fb+"&ns="+b.Cb);c&&(this.fb=this.fb+"&s="+c)}var dh;
ch.prototype.open=function(a,b){this.jb=b;this.wg=a;this.f("Websocket connecting to "+this.fb);this.Gc=!1;Dc.set("previous_websocket_failure",!0);try{this.va=new bh(this.fb)}catch(c){this.f("Error instantiating WebSocket.");var d=c.message||c.data;d&&this.f(d);this.ib();return}var e=this;this.va.onopen=function(){e.f("Websocket connected.");e.Gc=!0};this.va.onclose=function(){e.f("Websocket connection was disconnected.");e.va=null;e.ib()};this.va.onmessage=function(a){if(null!==e.va)if(a=a.data,e.ob+=
a.length,Lb(e.Va,"bytes_received",a.length),eh(e),null!==e.frames)fh(e,a);else{a:{J(null===e.frames,"We already have a frame buffer");if(6>=a.length){var b=Number(a);if(!isNaN(b)){e.bf=b;e.frames=[];a=null;break a}}e.bf=1;e.frames=[]}null!==a&&fh(e,a)}};this.va.onerror=function(a){e.f("WebSocket error.  Closing connection.");(a=a.message||a.data)&&e.f(a);e.ib()}};ch.prototype.start=function(){};
ch.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==bh&&!dh};ch.responsesRequiredToBeHealthy=2;ch.healthyTimeout=3E4;h=ch.prototype;h.Bd=function(){Dc.remove("previous_websocket_failure")};function fh(a,b){a.frames.push(b);if(a.frames.length==a.bf){var c=a.frames.join("");a.frames=null;c=mb(c);a.wg(c)}}
h.send=function(a){eh(this);a=B(a);this.pb+=a.length;Lb(this.Va,"bytes_sent",a.length);a=Xc(a,16384);1<a.length&&this.va.send(String(a.length));for(var b=0;b<a.length;b++)this.va.send(a[b])};h.cd=function(){this.zb=!0;this.Jc&&(clearInterval(this.Jc),this.Jc=null);this.va&&(this.va.close(),this.va=null)};h.ib=function(){this.zb||(this.f("WebSocket is closing itself"),this.cd(),this.jb&&(this.jb(this.Gc),this.jb=null))};h.close=function(){this.zb||(this.f("WebSocket is being closed"),this.cd())};
function eh(a){clearInterval(a.Jc);a.Jc=setInterval(function(){a.va&&a.va.send("0");eh(a)},Math.floor(45E3))};function gh(a){hh(this,a)}var ih=[Ug,ch];function hh(a,b){var c=ch&&ch.isAvailable(),d=c&&!(Dc.uf||!0===Dc.get("previous_websocket_failure"));b.Tg&&(c||Q("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.ed=[ch];else{var e=a.ed=[];Yc(ih,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function jh(a){if(0<a.ed.length)return a.ed[0];throw Error("No transports available");};function kh(a,b,c,d,e,f){this.id=a;this.f=Oc("c:"+this.id+":");this.hc=c;this.Vc=d;this.ka=e;this.Me=f;this.H=b;this.Jd=[];this.ef=0;this.Nf=new gh(b);this.Ua=0;this.f("Connection created");lh(this)}
function lh(a){var b=jh(a.Nf);a.L=new b("c:"+a.id+":"+a.ef++,a.H);a.Qe=b.responsesRequiredToBeHealthy||0;var c=mh(a,a.L),d=nh(a,a.L);a.fd=a.L;a.bd=a.L;a.F=null;a.Ab=!1;setTimeout(function(){a.L&&a.L.open(c,d)},Math.floor(0));b=b.healthyTimeout||0;0<b&&(a.vd=setTimeout(function(){a.vd=null;a.Ab||(a.L&&102400<a.L.ob?(a.f("Connection exceeded healthy timeout but has received "+a.L.ob+" bytes.  Marking connection healthy."),a.Ab=!0,a.L.Bd()):a.L&&10240<a.L.pb?a.f("Connection exceeded healthy timeout but has sent "+
a.L.pb+" bytes.  Leaving connection alive."):(a.f("Closing unhealthy connection after timeout."),a.close()))},Math.floor(b)))}function nh(a,b){return function(c){b===a.L?(a.L=null,c||0!==a.Ua?1===a.Ua&&a.f("Realtime connection lost."):(a.f("Realtime connection failed."),"s-"===a.H.Oa.substr(0,2)&&(Dc.remove("host:"+a.H.host),a.H.Oa=a.H.host)),a.close()):b===a.F?(a.f("Secondary connection lost."),c=a.F,a.F=null,a.fd!==c&&a.bd!==c||a.close()):a.f("closing an old connection")}}
function mh(a,b){return function(c){if(2!=a.Ua)if(b===a.bd){var d=Vc("t",c);c=Vc("d",c);if("c"==d){if(d=Vc("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.Vd=c.s;Fc(a.H,f);0==a.Ua&&(a.L.start(),oh(a,a.L,d),"5"!==e&&Q("Protocol version mismatch detected"),c=a.Nf,(c=1<c.ed.length?c.ed[1]:null)&&ph(a,c))}else if("n"===d){a.f("recvd end transmission on primary");a.bd=a.F;for(c=0;c<a.Jd.length;++c)a.Fd(a.Jd[c]);a.Jd=[];qh(a)}else"s"===d?(a.f("Connection shutdown command received. Shutting down..."),
a.Me&&(a.Me(c),a.Me=null),a.ka=null,a.close()):"r"===d?(a.f("Reset packet received.  New host: "+c),Fc(a.H,c),1===a.Ua?a.close():(rh(a),lh(a))):"e"===d?Pc("Server Error: "+c):"o"===d?(a.f("got pong on primary."),sh(a),th(a)):Pc("Unknown control packet command: "+d)}else"d"==d&&a.Fd(c)}else if(b===a.F)if(d=Vc("t",c),c=Vc("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?uh(a):"r"===c?(a.f("Got a reset on secondary, closing it"),a.F.close(),a.fd!==a.F&&a.bd!==a.F||a.close()):"o"===c&&(a.f("got pong on secondary."),
a.Lf--,uh(a)));else if("d"==d)a.Jd.push(c);else throw Error("Unknown protocol layer: "+d);else a.f("message on old connection")}}kh.prototype.Da=function(a){vh(this,{t:"d",d:a})};function qh(a){a.fd===a.F&&a.bd===a.F&&(a.f("cleaning up and promoting a connection: "+a.F.qe),a.L=a.F,a.F=null)}
function uh(a){0>=a.Lf?(a.f("Secondary connection is healthy."),a.Ab=!0,a.F.Bd(),a.F.start(),a.f("sending client ack on secondary"),a.F.send({t:"c",d:{t:"a",d:{}}}),a.f("Ending transmission on primary"),a.L.send({t:"c",d:{t:"n",d:{}}}),a.fd=a.F,qh(a)):(a.f("sending ping on secondary."),a.F.send({t:"c",d:{t:"p",d:{}}}))}kh.prototype.Fd=function(a){sh(this);this.hc(a)};function sh(a){a.Ab||(a.Qe--,0>=a.Qe&&(a.f("Primary connection is healthy."),a.Ab=!0,a.L.Bd()))}
function ph(a,b){a.F=new b("c:"+a.id+":"+a.ef++,a.H,a.Vd);a.Lf=b.responsesRequiredToBeHealthy||0;a.F.open(mh(a,a.F),nh(a,a.F));setTimeout(function(){a.F&&(a.f("Timed out trying to upgrade."),a.F.close())},Math.floor(6E4))}function oh(a,b,c){a.f("Realtime connection established.");a.L=b;a.Ua=1;a.Vc&&(a.Vc(c),a.Vc=null);0===a.Qe?(a.f("Primary connection is healthy."),a.Ab=!0):setTimeout(function(){th(a)},Math.floor(5E3))}
function th(a){a.Ab||1!==a.Ua||(a.f("sending ping on primary."),vh(a,{t:"c",d:{t:"p",d:{}}}))}function vh(a,b){if(1!==a.Ua)throw"Connection is not connected";a.fd.send(b)}kh.prototype.close=function(){2!==this.Ua&&(this.f("Closing realtime connection."),this.Ua=2,rh(this),this.ka&&(this.ka(),this.ka=null))};function rh(a){a.f("Shutting down all connections");a.L&&(a.L.close(),a.L=null);a.F&&(a.F.close(),a.F=null);a.vd&&(clearTimeout(a.vd),a.vd=null)};function wh(a,b,c,d){this.id=xh++;this.f=Oc("p:"+this.id+":");this.wf=this.De=!1;this.aa={};this.pa=[];this.Xc=0;this.Uc=[];this.ma=!1;this.$a=1E3;this.Cd=3E5;this.Gb=b;this.Tc=c;this.Ne=d;this.H=a;this.We=null;this.Qd={};this.Ig=0;this.mf=!0;this.Kc=this.Fe=null;yh(this,0);Mf.ub().Eb("visible",this.zg,this);-1===a.host.indexOf("fblocal")&&Lf.ub().Eb("online",this.xg,this)}var xh=0,zh=0;h=wh.prototype;
h.Da=function(a,b,c){var d=++this.Ig;a={r:d,a:a,b:b};this.f(B(a));J(this.ma,"sendRequest call when we're not connected not allowed.");this.Sa.Da(a);c&&(this.Qd[d]=c)};h.xf=function(a,b,c,d){var e=a.wa(),f=a.path.toString();this.f("Listen called for "+f+" "+e);this.aa[f]=this.aa[f]||{};J(!this.aa[f][e],"listen() called twice for same path/queryId.");a={J:d,ud:b,Fg:a,tag:c};this.aa[f][e]=a;this.ma&&Ah(this,a)};
function Ah(a,b){var c=b.Fg,d=c.path.toString(),e=c.wa();a.f("Listen on "+d+" for "+e);var f={p:d};b.tag&&(f.q=ce(c.n),f.t=b.tag);f.h=b.ud();a.Da("q",f,function(f){var k=f.d,l=f.s;if(k&&"object"===typeof k&&u(k,"w")){var m=w(k,"w");ea(m)&&0<=Na(m,"no_index")&&Q("Using an unspecified index. Consider adding "+('".indexOn": "'+c.n.g.toString()+'"')+" at "+c.path.toString()+" to your security rules for better performance")}(a.aa[d]&&a.aa[d][e])===b&&(a.f("listen response",f),"ok"!==l&&Bh(a,d,e),b.J&&
b.J(l,k))})}h.P=function(a,b,c){this.Fa={fg:a,nf:!1,yc:b,jd:c};this.f("Authenticating using credential: "+a);Ch(this);(b=40==a.length)||(a=ad(a).Ac,b="object"===typeof a&&!0===w(a,"admin"));b&&(this.f("Admin auth credential detected.  Reducing max reconnect time."),this.Cd=3E4)};h.ee=function(a){delete this.Fa;this.ma&&this.Da("unauth",{},function(b){a(b.s,b.d)})};
function Ch(a){var b=a.Fa;a.ma&&b&&a.Da("auth",{cred:b.fg},function(c){var d=c.s;c=c.d||"error";"ok"!==d&&a.Fa===b&&delete a.Fa;b.nf?"ok"!==d&&b.jd&&b.jd(d,c):(b.nf=!0,b.yc&&b.yc(d,c))})}h.Of=function(a,b){var c=a.path.toString(),d=a.wa();this.f("Unlisten called for "+c+" "+d);if(Bh(this,c,d)&&this.ma){var e=ce(a.n);this.f("Unlisten on "+c+" for "+d);c={p:c};b&&(c.q=e,c.t=b);this.Da("n",c)}};h.Le=function(a,b,c){this.ma?Dh(this,"o",a,b,c):this.Uc.push({Zc:a,action:"o",data:b,J:c})};
h.Bf=function(a,b,c){this.ma?Dh(this,"om",a,b,c):this.Uc.push({Zc:a,action:"om",data:b,J:c})};h.Gd=function(a,b){this.ma?Dh(this,"oc",a,null,b):this.Uc.push({Zc:a,action:"oc",data:null,J:b})};function Dh(a,b,c,d,e){c={p:c,d:d};a.f("onDisconnect "+b,c);a.Da(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},Math.floor(0))})}h.put=function(a,b,c,d){Eh(this,"p",a,b,c,d)};h.yf=function(a,b,c,d){Eh(this,"m",a,b,c,d)};
function Eh(a,b,c,d,e,f){d={p:c,d:d};n(f)&&(d.h=f);a.pa.push({action:b,If:d,J:e});a.Xc++;b=a.pa.length-1;a.ma?Fh(a,b):a.f("Buffering put: "+c)}function Fh(a,b){var c=a.pa[b].action,d=a.pa[b].If,e=a.pa[b].J;a.pa[b].Gg=a.ma;a.Da(c,d,function(d){a.f(c+" response",d);delete a.pa[b];a.Xc--;0===a.Xc&&(a.pa=[]);e&&e(d.s,d.d)})}h.Te=function(a){this.ma&&(a={c:a},this.f("reportStats",a),this.Da("s",a,function(a){"ok"!==a.s&&this.f("reportStats","Error sending stats: "+a.d)}))};
h.Fd=function(a){if("r"in a){this.f("from server: "+B(a));var b=a.r,c=this.Qd[b];c&&(delete this.Qd[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,c=a.b,this.f("handleServerMessage",b,c),"d"===b?this.Gb(c.p,c.d,!1,c.t):"m"===b?this.Gb(c.p,c.d,!0,c.t):"c"===b?Gh(this,c.p,c.q):"ac"===b?(a=c.s,b=c.d,c=this.Fa,delete this.Fa,c&&c.jd&&c.jd(a,b)):"sd"===b?this.We?this.We(c):"msg"in c&&"undefined"!==typeof console&&console.log("FIREBASE: "+c.msg.replace("\n",
"\nFIREBASE: ")):Pc("Unrecognized action received from server: "+B(b)+"\nAre you using the latest client?"))}};h.Vc=function(a){this.f("connection ready");this.ma=!0;this.Kc=(new Date).getTime();this.Ne({serverTimeOffset:a-(new Date).getTime()});this.mf&&(a={},a["sdk.js."+"2.2.4".replace(/\./g,"-")]=1,kg()&&(a["framework.cordova"]=1),this.Te(a));Hh(this);this.mf=!1;this.Tc(!0)};
function yh(a,b){J(!a.Sa,"Scheduling a connect when we're already connected/ing?");a.Sb&&clearTimeout(a.Sb);a.Sb=setTimeout(function(){a.Sb=null;Ih(a)},Math.floor(b))}h.zg=function(a){a&&!this.uc&&this.$a===this.Cd&&(this.f("Window became visible.  Reducing delay."),this.$a=1E3,this.Sa||yh(this,0));this.uc=a};h.xg=function(a){a?(this.f("Browser went online."),this.$a=1E3,this.Sa||yh(this,0)):(this.f("Browser went offline.  Killing connection."),this.Sa&&this.Sa.close())};
h.Cf=function(){this.f("data client disconnected");this.ma=!1;this.Sa=null;for(var a=0;a<this.pa.length;a++){var b=this.pa[a];b&&"h"in b.If&&b.Gg&&(b.J&&b.J("disconnect"),delete this.pa[a],this.Xc--)}0===this.Xc&&(this.pa=[]);this.Qd={};Jh(this)&&(this.uc?this.Kc&&(3E4<(new Date).getTime()-this.Kc&&(this.$a=1E3),this.Kc=null):(this.f("Window isn't visible.  Delaying reconnect."),this.$a=this.Cd,this.Fe=(new Date).getTime()),a=Math.max(0,this.$a-((new Date).getTime()-this.Fe)),a*=Math.random(),this.f("Trying to reconnect in "+
a+"ms"),yh(this,a),this.$a=Math.min(this.Cd,1.3*this.$a));this.Tc(!1)};function Ih(a){if(Jh(a)){a.f("Making a connection attempt");a.Fe=(new Date).getTime();a.Kc=null;var b=q(a.Fd,a),c=q(a.Vc,a),d=q(a.Cf,a),e=a.id+":"+zh++;a.Sa=new kh(e,a.H,b,c,d,function(b){Q(b+" ("+a.H.toString()+")");a.wf=!0})}}h.yb=function(){this.De=!0;this.Sa?this.Sa.close():(this.Sb&&(clearTimeout(this.Sb),this.Sb=null),this.ma&&this.Cf())};h.qc=function(){this.De=!1;this.$a=1E3;this.Sa||yh(this,0)};
function Gh(a,b,c){c=c?Qa(c,function(a){return Wc(a)}).join("$"):"default";(a=Bh(a,b,c))&&a.J&&a.J("permission_denied")}function Bh(a,b,c){b=(new K(b)).toString();var d;n(a.aa[b])?(d=a.aa[b][c],delete a.aa[b][c],0===pa(a.aa[b])&&delete a.aa[b]):d=void 0;return d}function Hh(a){Ch(a);r(a.aa,function(b){r(b,function(b){Ah(a,b)})});for(var b=0;b<a.pa.length;b++)a.pa[b]&&Fh(a,b);for(;a.Uc.length;)b=a.Uc.shift(),Dh(a,b.action,b.Zc,b.data,b.J)}function Jh(a){var b;b=Lf.ub().ic;return!a.wf&&!a.De&&b};var V={lg:function(){Vg=dh=!0}};V.forceLongPolling=V.lg;V.mg=function(){Wg=!0};V.forceWebSockets=V.mg;V.Mg=function(a,b){a.k.Ra.We=b};V.setSecurityDebugCallback=V.Mg;V.Ye=function(a,b){a.k.Ye(b)};V.stats=V.Ye;V.Ze=function(a,b){a.k.Ze(b)};V.statsIncrementCounter=V.Ze;V.pd=function(a){return a.k.pd};V.dataUpdateCount=V.pd;V.pg=function(a,b){a.k.Ce=b};V.interceptServerData=V.pg;V.vg=function(a){new ug(a)};V.onPopupOpen=V.vg;V.Kg=function(a){fg=a};V.setAuthenticationServer=V.Kg;function S(a,b,c){this.B=a;this.V=b;this.g=c}S.prototype.K=function(){x("Firebase.DataSnapshot.val",0,0,arguments.length);return this.B.K()};S.prototype.val=S.prototype.K;S.prototype.lf=function(){x("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.B.K(!0)};S.prototype.exportVal=S.prototype.lf;S.prototype.kg=function(){x("Firebase.DataSnapshot.exists",0,0,arguments.length);return!this.B.e()};S.prototype.exists=S.prototype.kg;
S.prototype.w=function(a){x("Firebase.DataSnapshot.child",0,1,arguments.length);ga(a)&&(a=String(a));Xf("Firebase.DataSnapshot.child",a);var b=new K(a),c=this.V.w(b);return new S(this.B.oa(b),c,M)};S.prototype.child=S.prototype.w;S.prototype.Ha=function(a){x("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Xf("Firebase.DataSnapshot.hasChild",a);var b=new K(a);return!this.B.oa(b).e()};S.prototype.hasChild=S.prototype.Ha;
S.prototype.A=function(){x("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.B.A().K()};S.prototype.getPriority=S.prototype.A;S.prototype.forEach=function(a){x("Firebase.DataSnapshot.forEach",1,1,arguments.length);A("Firebase.DataSnapshot.forEach",1,a,!1);if(this.B.N())return!1;var b=this;return!!this.B.U(this.g,function(c,d){return a(new S(d,b.V.w(c),M))})};S.prototype.forEach=S.prototype.forEach;
S.prototype.td=function(){x("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.B.N()?!1:!this.B.e()};S.prototype.hasChildren=S.prototype.td;S.prototype.name=function(){Q("Firebase.DataSnapshot.name() being deprecated. Please use Firebase.DataSnapshot.key() instead.");x("Firebase.DataSnapshot.name",0,0,arguments.length);return this.key()};S.prototype.name=S.prototype.name;S.prototype.key=function(){x("Firebase.DataSnapshot.key",0,0,arguments.length);return this.V.key()};
S.prototype.key=S.prototype.key;S.prototype.Db=function(){x("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.B.Db()};S.prototype.numChildren=S.prototype.Db;S.prototype.lc=function(){x("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.V};S.prototype.ref=S.prototype.lc;function Kh(a,b){this.H=a;this.Va=Ob(a);this.ea=new ub;this.Ed=1;this.Ra=null;b||0<=("object"===typeof window&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)?(this.ca=new Ae(this.H,q(this.Gb,this)),setTimeout(q(this.Tc,this,!0),0)):this.ca=this.Ra=new wh(this.H,q(this.Gb,this),q(this.Tc,this),q(this.Ne,this));this.Pg=Pb(a,q(function(){return new Jb(this.Va,this.ca)},this));this.tc=new Cf;this.Be=
new nb;var c=this;this.zd=new gf({Xe:function(a,b,f,g){b=[];f=c.Be.j(a.path);f.e()||(b=jf(c.zd,new Ub(ze,a.path,f)),setTimeout(function(){g("ok")},0));return b},Zd:ba});Lh(this,"connected",!1);this.ka=new qc;this.P=new Eg(a,q(this.ca.P,this.ca),q(this.ca.ee,this.ca),q(this.Ke,this));this.pd=0;this.Ce=null;this.O=new gf({Xe:function(a,b,f,g){c.ca.xf(a,f,b,function(b,e){var f=g(b,e);zb(c.ea,a.path,f)});return[]},Zd:function(a,b){c.ca.Of(a,b)}})}h=Kh.prototype;
h.toString=function(){return(this.H.lb?"https://":"http://")+this.H.host};h.name=function(){return this.H.Cb};function Mh(a){a=a.Be.j(new K(".info/serverTimeOffset")).K()||0;return(new Date).getTime()+a}function Nh(a){a=a={timestamp:Mh(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
h.Gb=function(a,b,c,d){this.pd++;var e=new K(a);b=this.Ce?this.Ce(a,b):b;a=[];d?c?(b=na(b,function(a){return L(a)}),a=rf(this.O,e,b,d)):(b=L(b),a=nf(this.O,e,b,d)):c?(d=na(b,function(a){return L(a)}),a=mf(this.O,e,d)):(d=L(b),a=jf(this.O,new Ub(ze,e,d)));d=e;0<a.length&&(d=Oh(this,e));zb(this.ea,d,a)};h.Tc=function(a){Lh(this,"connected",a);!1===a&&Ph(this)};h.Ne=function(a){var b=this;Yc(a,function(a,d){Lh(b,d,a)})};h.Ke=function(a){Lh(this,"authenticated",a)};
function Lh(a,b,c){b=new K("/.info/"+b);c=L(c);var d=a.Be;d.Sd=d.Sd.G(b,c);c=jf(a.zd,new Ub(ze,b,c));zb(a.ea,b,c)}h.Kb=function(a,b,c,d){this.f("set",{path:a.toString(),value:b,Xg:c});var e=Nh(this);b=L(b,c);var e=sc(b,e),f=this.Ed++,e=hf(this.O,a,e,f,!0);vb(this.ea,e);var g=this;this.ca.put(a.toString(),b.K(!0),function(b,c){var e="ok"===b;e||Q("set at "+a+" failed: "+b);e=lf(g.O,f,!e);zb(g.ea,a,e);Qh(d,b,c)});e=Rh(this,a);Oh(this,e);zb(this.ea,e,[])};
h.update=function(a,b,c){this.f("update",{path:a.toString(),value:b});var d=!0,e=Nh(this),f={};r(b,function(a,b){d=!1;var c=L(a);f[b]=sc(c,e)});if(d)Bb("update() called with empty data.  Don't do anything."),Qh(c,"ok");else{var g=this.Ed++,k=kf(this.O,a,f,g);vb(this.ea,k);var l=this;this.ca.yf(a.toString(),b,function(b,d){var e="ok"===b;e||Q("update at "+a+" failed: "+b);var e=lf(l.O,g,!e),f=a;0<e.length&&(f=Oh(l,a));zb(l.ea,f,e);Qh(c,b,d)});b=Rh(this,a);Oh(this,b);zb(this.ea,a,[])}};
function Ph(a){a.f("onDisconnectEvents");var b=Nh(a),c=[];rc(pc(a.ka,b),F,function(b,e){c=c.concat(jf(a.O,new Ub(ze,b,e)));var f=Rh(a,b);Oh(a,f)});a.ka=new qc;zb(a.ea,F,c)}h.Gd=function(a,b){var c=this;this.ca.Gd(a.toString(),function(d,e){"ok"===d&&eg(c.ka,a);Qh(b,d,e)})};function Sh(a,b,c,d){var e=L(c);a.ca.Le(b.toString(),e.K(!0),function(c,g){"ok"===c&&a.ka.mc(b,e);Qh(d,c,g)})}function Th(a,b,c,d,e){var f=L(c,d);a.ca.Le(b.toString(),f.K(!0),function(c,d){"ok"===c&&a.ka.mc(b,f);Qh(e,c,d)})}
function Uh(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(Bb("onDisconnect().update() called with empty data.  Don't do anything."),Qh(d,"ok")):a.ca.Bf(b.toString(),c,function(e,f){if("ok"===e)for(var l in c){var m=L(c[l]);a.ka.mc(b.w(l),m)}Qh(d,e,f)})}function Vh(a,b,c){c=".info"===O(b.path)?a.zd.Ob(b,c):a.O.Ob(b,c);xb(a.ea,b.path,c)}h.yb=function(){this.Ra&&this.Ra.yb()};h.qc=function(){this.Ra&&this.Ra.qc()};
h.Ye=function(a){if("undefined"!==typeof console){a?(this.Yd||(this.Yd=new Ib(this.Va)),a=this.Yd.get()):a=this.Va.get();var b=Ra(sa(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};h.Ze=function(a){Lb(this.Va,a);this.Pg.Mf[a]=!0};h.f=function(a){var b="";this.Ra&&(b=this.Ra.id+":");Bb(b,arguments)};
function Qh(a,b,c){a&&Cb(function(){if("ok"==b)a(null);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function Wh(a,b,c,d,e){function f(){}a.f("transaction on "+b);var g=new U(a,b);g.Eb("value",f);c={path:b,update:c,J:d,status:null,Ef:Gc(),cf:e,Kf:0,ge:function(){g.gc("value",f)},je:null,Aa:null,md:null,nd:null,od:null};d=a.O.ua(b,void 0)||C;c.md=d;d=c.update(d.K());if(n(d)){Sf("transaction failed: Data returned ",d,c.path);c.status=1;e=Df(a.tc,b);var k=e.Ba()||[];k.push(c);Ef(e,k);"object"===typeof d&&null!==d&&u(d,".priority")?(k=w(d,".priority"),J(Qf(k),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):
k=(a.O.ua(b)||C).A().K();e=Nh(a);d=L(d,k);e=sc(d,e);c.nd=d;c.od=e;c.Aa=a.Ed++;c=hf(a.O,b,e,c.Aa,c.cf);zb(a.ea,b,c);Xh(a)}else c.ge(),c.nd=null,c.od=null,c.J&&(a=new S(c.md,new U(a,c.path),M),c.J(null,!1,a))}function Xh(a,b){var c=b||a.tc;b||Yh(a,c);if(null!==c.Ba()){var d=Zh(a,c);J(0<d.length,"Sending zero length transaction queue");Sa(d,function(a){return 1===a.status})&&$h(a,c.path(),d)}else c.td()&&c.U(function(b){Xh(a,b)})}
function $h(a,b,c){for(var d=Qa(c,function(a){return a.Aa}),e=a.O.ua(b,d)||C,d=e,e=e.hash(),f=0;f<c.length;f++){var g=c[f];J(1===g.status,"tryToSendTransactionQueue_: items in queue should all be run.");g.status=2;g.Kf++;var k=N(b,g.path),d=d.G(k,g.nd)}d=d.K(!0);a.ca.put(b.toString(),d,function(d){a.f("transaction put response",{path:b.toString(),status:d});var e=[];if("ok"===d){d=[];for(f=0;f<c.length;f++){c[f].status=3;e=e.concat(lf(a.O,c[f].Aa));if(c[f].J){var g=c[f].od,k=new U(a,c[f].path);d.push(q(c[f].J,
null,null,!0,new S(g,k,M)))}c[f].ge()}Yh(a,Df(a.tc,b));Xh(a);zb(a.ea,b,e);for(f=0;f<d.length;f++)Cb(d[f])}else{if("datastale"===d)for(f=0;f<c.length;f++)c[f].status=4===c[f].status?5:1;else for(Q("transaction at "+b.toString()+" failed: "+d),f=0;f<c.length;f++)c[f].status=5,c[f].je=d;Oh(a,b)}},e)}function Oh(a,b){var c=ai(a,b),d=c.path(),c=Zh(a,c);bi(a,c,d);return d}
function bi(a,b,c){if(0!==b.length){for(var d=[],e=[],f=Qa(b,function(a){return a.Aa}),g=0;g<b.length;g++){var k=b[g],l=N(c,k.path),m=!1,v;J(null!==l,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===k.status)m=!0,v=k.je,e=e.concat(lf(a.O,k.Aa,!0));else if(1===k.status)if(25<=k.Kf)m=!0,v="maxretry",e=e.concat(lf(a.O,k.Aa,!0));else{var y=a.O.ua(k.path,f)||C;k.md=y;var I=b[g].update(y.K());n(I)?(Sf("transaction failed: Data returned ",I,k.path),l=L(I),"object"===typeof I&&null!=
I&&u(I,".priority")||(l=l.da(y.A())),y=k.Aa,I=Nh(a),I=sc(l,I),k.nd=l,k.od=I,k.Aa=a.Ed++,Va(f,y),e=e.concat(hf(a.O,k.path,I,k.Aa,k.cf)),e=e.concat(lf(a.O,y,!0))):(m=!0,v="nodata",e=e.concat(lf(a.O,k.Aa,!0)))}zb(a.ea,c,e);e=[];m&&(b[g].status=3,setTimeout(b[g].ge,Math.floor(0)),b[g].J&&("nodata"===v?(k=new U(a,b[g].path),d.push(q(b[g].J,null,null,!1,new S(b[g].md,k,M)))):d.push(q(b[g].J,null,Error(v),!1,null))))}Yh(a,a.tc);for(g=0;g<d.length;g++)Cb(d[g]);Xh(a)}}
function ai(a,b){for(var c,d=a.tc;null!==(c=O(b))&&null===d.Ba();)d=Df(d,c),b=G(b);return d}function Zh(a,b){var c=[];ci(a,b,c);c.sort(function(a,b){return a.Ef-b.Ef});return c}function ci(a,b,c){var d=b.Ba();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.U(function(b){ci(a,b,c)})}function Yh(a,b){var c=b.Ba();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;Ef(b,0<c.length?c:null)}b.U(function(b){Yh(a,b)})}
function Rh(a,b){var c=ai(a,b).path(),d=Df(a.tc,b);Hf(d,function(b){di(a,b)});di(a,d);Gf(d,function(b){di(a,b)});return c}
function di(a,b){var c=b.Ba();if(null!==c){for(var d=[],e=[],f=-1,g=0;g<c.length;g++)4!==c[g].status&&(2===c[g].status?(J(f===g-1,"All SENT items should be at beginning of queue."),f=g,c[g].status=4,c[g].je="set"):(J(1===c[g].status,"Unexpected transaction status in abort"),c[g].ge(),e=e.concat(lf(a.O,c[g].Aa,!0)),c[g].J&&d.push(q(c[g].J,null,Error("set"),!1,null))));-1===f?Ef(b,null):c.length=f+1;zb(a.ea,b.path(),e);for(g=0;g<d.length;g++)Cb(d[g])}};function W(){this.nc={};this.Pf=!1}ca(W);W.prototype.yb=function(){for(var a in this.nc)this.nc[a].yb()};W.prototype.interrupt=W.prototype.yb;W.prototype.qc=function(){for(var a in this.nc)this.nc[a].qc()};W.prototype.resume=W.prototype.qc;W.prototype.ue=function(){this.Pf=!0};function X(a,b){this.ad=a;this.qa=b}X.prototype.cancel=function(a){x("Firebase.onDisconnect().cancel",0,1,arguments.length);A("Firebase.onDisconnect().cancel",1,a,!0);this.ad.Gd(this.qa,a||null)};X.prototype.cancel=X.prototype.cancel;X.prototype.remove=function(a){x("Firebase.onDisconnect().remove",0,1,arguments.length);Yf("Firebase.onDisconnect().remove",this.qa);A("Firebase.onDisconnect().remove",1,a,!0);Sh(this.ad,this.qa,null,a)};X.prototype.remove=X.prototype.remove;
X.prototype.set=function(a,b){x("Firebase.onDisconnect().set",1,2,arguments.length);Yf("Firebase.onDisconnect().set",this.qa);Rf("Firebase.onDisconnect().set",a,this.qa,!1);A("Firebase.onDisconnect().set",2,b,!0);Sh(this.ad,this.qa,a,b)};X.prototype.set=X.prototype.set;
X.prototype.Kb=function(a,b,c){x("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);Yf("Firebase.onDisconnect().setWithPriority",this.qa);Rf("Firebase.onDisconnect().setWithPriority",a,this.qa,!1);Uf("Firebase.onDisconnect().setWithPriority",2,b);A("Firebase.onDisconnect().setWithPriority",3,c,!0);Th(this.ad,this.qa,a,b,c)};X.prototype.setWithPriority=X.prototype.Kb;
X.prototype.update=function(a,b){x("Firebase.onDisconnect().update",1,2,arguments.length);Yf("Firebase.onDisconnect().update",this.qa);if(ea(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;Q("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Tf("Firebase.onDisconnect().update",a,this.qa);A("Firebase.onDisconnect().update",2,b,!0);
Uh(this.ad,this.qa,a,b)};X.prototype.update=X.prototype.update;function Y(a,b,c,d){this.k=a;this.path=b;this.n=c;this.jc=d}
function ei(a){var b=null,c=null;a.la&&(b=od(a));a.na&&(c=qd(a));if(a.g===Vd){if(a.la){if("[MIN_NAME]"!=nd(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==typeof b)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}if(a.na){if("[MAX_NAME]"!=pd(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==
typeof c)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}}else if(a.g===M){if(null!=b&&!Qf(b)||null!=c&&!Qf(c))throw Error("Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string).");}else if(J(a.g instanceof Rd||a.g===Yd,"unknown index type."),null!=b&&"object"===typeof b||null!=c&&"object"===typeof c)throw Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object.");
}function fi(a){if(a.la&&a.na&&a.ia&&(!a.ia||""===a.Nb))throw Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");}function gi(a,b){if(!0===a.jc)throw Error(b+": You can't combine multiple orderBy calls.");}Y.prototype.lc=function(){x("Query.ref",0,0,arguments.length);return new U(this.k,this.path)};Y.prototype.ref=Y.prototype.lc;
Y.prototype.Eb=function(a,b,c,d){x("Query.on",2,4,arguments.length);Vf("Query.on",a,!1);A("Query.on",2,b,!1);var e=hi("Query.on",c,d);if("value"===a)Vh(this.k,this,new jd(b,e.cancel||null,e.Ma||null));else{var f={};f[a]=b;Vh(this.k,this,new kd(f,e.cancel,e.Ma))}return b};Y.prototype.on=Y.prototype.Eb;
Y.prototype.gc=function(a,b,c){x("Query.off",0,3,arguments.length);Vf("Query.off",a,!0);A("Query.off",2,b,!0);lb("Query.off",3,c);var d=null,e=null;"value"===a?d=new jd(b||null,null,c||null):a&&(b&&(e={},e[a]=b),d=new kd(e,null,c||null));e=this.k;d=".info"===O(this.path)?e.zd.kb(this,d):e.O.kb(this,d);xb(e.ea,this.path,d)};Y.prototype.off=Y.prototype.gc;
Y.prototype.Ag=function(a,b){function c(g){f&&(f=!1,e.gc(a,c),b.call(d.Ma,g))}x("Query.once",2,4,arguments.length);Vf("Query.once",a,!1);A("Query.once",2,b,!1);var d=hi("Query.once",arguments[2],arguments[3]),e=this,f=!0;this.Eb(a,c,function(b){e.gc(a,c);d.cancel&&d.cancel.call(d.Ma,b)})};Y.prototype.once=Y.prototype.Ag;
Y.prototype.Ge=function(a){Q("Query.limit() being deprecated. Please use Query.limitToFirst() or Query.limitToLast() instead.");x("Query.limit",1,1,arguments.length);if(!ga(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limit: First argument must be a positive integer.");if(this.n.ia)throw Error("Query.limit: Limit was already set (by another call to limit, limitToFirst, orlimitToLast.");var b=this.n.Ge(a);fi(b);return new Y(this.k,this.path,b,this.jc)};Y.prototype.limit=Y.prototype.Ge;
Y.prototype.He=function(a){x("Query.limitToFirst",1,1,arguments.length);if(!ga(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToFirst: First argument must be a positive integer.");if(this.n.ia)throw Error("Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new Y(this.k,this.path,this.n.He(a),this.jc)};Y.prototype.limitToFirst=Y.prototype.He;
Y.prototype.Ie=function(a){x("Query.limitToLast",1,1,arguments.length);if(!ga(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToLast: First argument must be a positive integer.");if(this.n.ia)throw Error("Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new Y(this.k,this.path,this.n.Ie(a),this.jc)};Y.prototype.limitToLast=Y.prototype.Ie;
Y.prototype.Bg=function(a){x("Query.orderByChild",1,1,arguments.length);if("$key"===a)throw Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');if("$priority"===a)throw Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');if("$value"===a)throw Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');Wf("Query.orderByChild",1,a,!1);gi(this,"Query.orderByChild");var b=be(this.n,new Rd(a));ei(b);return new Y(this.k,
this.path,b,!0)};Y.prototype.orderByChild=Y.prototype.Bg;Y.prototype.Cg=function(){x("Query.orderByKey",0,0,arguments.length);gi(this,"Query.orderByKey");var a=be(this.n,Vd);ei(a);return new Y(this.k,this.path,a,!0)};Y.prototype.orderByKey=Y.prototype.Cg;Y.prototype.Dg=function(){x("Query.orderByPriority",0,0,arguments.length);gi(this,"Query.orderByPriority");var a=be(this.n,M);ei(a);return new Y(this.k,this.path,a,!0)};Y.prototype.orderByPriority=Y.prototype.Dg;
Y.prototype.Eg=function(){x("Query.orderByValue",0,0,arguments.length);gi(this,"Query.orderByValue");var a=be(this.n,Yd);ei(a);return new Y(this.k,this.path,a,!0)};Y.prototype.orderByValue=Y.prototype.Eg;
Y.prototype.Xd=function(a,b){x("Query.startAt",0,2,arguments.length);Rf("Query.startAt",a,this.path,!0);Wf("Query.startAt",2,b,!0);var c=this.n.Xd(a,b);fi(c);ei(c);if(this.n.la)throw Error("Query.startAt: Starting point was already set (by another call to startAt or equalTo).");n(a)||(b=a=null);return new Y(this.k,this.path,c,this.jc)};Y.prototype.startAt=Y.prototype.Xd;
Y.prototype.qd=function(a,b){x("Query.endAt",0,2,arguments.length);Rf("Query.endAt",a,this.path,!0);Wf("Query.endAt",2,b,!0);var c=this.n.qd(a,b);fi(c);ei(c);if(this.n.na)throw Error("Query.endAt: Ending point was already set (by another call to endAt or equalTo).");return new Y(this.k,this.path,c,this.jc)};Y.prototype.endAt=Y.prototype.qd;
Y.prototype.hg=function(a,b){x("Query.equalTo",1,2,arguments.length);Rf("Query.equalTo",a,this.path,!1);Wf("Query.equalTo",2,b,!0);if(this.n.la)throw Error("Query.equalTo: Starting point was already set (by another call to endAt or equalTo).");if(this.n.na)throw Error("Query.equalTo: Ending point was already set (by another call to endAt or equalTo).");return this.Xd(a,b).qd(a,b)};Y.prototype.equalTo=Y.prototype.hg;
Y.prototype.toString=function(){x("Query.toString",0,0,arguments.length);for(var a=this.path,b="",c=a.Y;c<a.o.length;c++)""!==a.o[c]&&(b+="/"+encodeURIComponent(String(a.o[c])));a=this.k.toString()+(b||"/");b=jb(ee(this.n));return a+=b.replace(/^&/,"")};Y.prototype.toString=Y.prototype.toString;Y.prototype.wa=function(){var a=Wc(ce(this.n));return"{}"===a?"default":a};
function hi(a,b,c){var d={cancel:null,Ma:null};if(b&&c)d.cancel=b,A(a,3,d.cancel,!0),d.Ma=c,lb(a,4,d.Ma);else if(b)if("object"===typeof b&&null!==b)d.Ma=b;else if("function"===typeof b)d.cancel=b;else throw Error(z(a,3,!0)+" must either be a cancel callback or a context object.");return d};var Z={};Z.vc=wh;Z.DataConnection=Z.vc;wh.prototype.Og=function(a,b){this.Da("q",{p:a},b)};Z.vc.prototype.simpleListen=Z.vc.prototype.Og;wh.prototype.gg=function(a,b){this.Da("echo",{d:a},b)};Z.vc.prototype.echo=Z.vc.prototype.gg;wh.prototype.interrupt=wh.prototype.yb;Z.Sf=kh;Z.RealTimeConnection=Z.Sf;kh.prototype.sendRequest=kh.prototype.Da;kh.prototype.close=kh.prototype.close;
Z.og=function(a){var b=wh.prototype.put;wh.prototype.put=function(c,d,e,f){n(f)&&(f=a());b.call(this,c,d,e,f)};return function(){wh.prototype.put=b}};Z.hijackHash=Z.og;Z.Rf=Ec;Z.ConnectionTarget=Z.Rf;Z.wa=function(a){return a.wa()};Z.queryIdentifier=Z.wa;Z.qg=function(a){return a.k.Ra.aa};Z.listens=Z.qg;Z.ue=function(a){a.ue()};Z.forceRestClient=Z.ue;function U(a,b){var c,d,e;if(a instanceof Kh)c=a,d=b;else{x("new Firebase",1,2,arguments.length);d=Rc(arguments[0]);c=d.Qg;"firebase"===d.domain&&Qc(d.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");c||Qc("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d.lb||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&Q("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
c=new Ec(d.host,d.lb,c,"ws"===d.scheme||"wss"===d.scheme);d=new K(d.Zc);e=d.toString();var f;!(f=!p(c.host)||0===c.host.length||!Pf(c.Cb))&&(f=0!==e.length)&&(e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),f=!(p(e)&&0!==e.length&&!Of.test(e)));if(f)throw Error(z("new Firebase",1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');if(b)if(b instanceof W)e=b;else if(p(b))e=W.ub(),c.Ld=b;else throw Error("Expected a valid Firebase.Context for second argument to new Firebase()");
else e=W.ub();f=c.toString();var g=w(e.nc,f);g||(g=new Kh(c,e.Pf),e.nc[f]=g);c=g}Y.call(this,c,d,$d,!1)}ma(U,Y);var ii=U,ji=["Firebase"],ki=aa;ji[0]in ki||!ki.execScript||ki.execScript("var "+ji[0]);for(var li;ji.length&&(li=ji.shift());)!ji.length&&n(ii)?ki[li]=ii:ki=ki[li]?ki[li]:ki[li]={};U.prototype.name=function(){Q("Firebase.name() being deprecated. Please use Firebase.key() instead.");x("Firebase.name",0,0,arguments.length);return this.key()};U.prototype.name=U.prototype.name;
U.prototype.key=function(){x("Firebase.key",0,0,arguments.length);return this.path.e()?null:vc(this.path)};U.prototype.key=U.prototype.key;U.prototype.w=function(a){x("Firebase.child",1,1,arguments.length);if(ga(a))a=String(a);else if(!(a instanceof K))if(null===O(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Xf("Firebase.child",b)}else Xf("Firebase.child",a);return new U(this.k,this.path.w(a))};U.prototype.child=U.prototype.w;
U.prototype.parent=function(){x("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new U(this.k,a)};U.prototype.parent=U.prototype.parent;U.prototype.root=function(){x("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.parent();)a=a.parent();return a};U.prototype.root=U.prototype.root;
U.prototype.set=function(a,b){x("Firebase.set",1,2,arguments.length);Yf("Firebase.set",this.path);Rf("Firebase.set",a,this.path,!1);A("Firebase.set",2,b,!0);this.k.Kb(this.path,a,null,b||null)};U.prototype.set=U.prototype.set;
U.prototype.update=function(a,b){x("Firebase.update",1,2,arguments.length);Yf("Firebase.update",this.path);if(ea(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;Q("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Tf("Firebase.update",a,this.path);A("Firebase.update",2,b,!0);this.k.update(this.path,a,b||null)};U.prototype.update=U.prototype.update;
U.prototype.Kb=function(a,b,c){x("Firebase.setWithPriority",2,3,arguments.length);Yf("Firebase.setWithPriority",this.path);Rf("Firebase.setWithPriority",a,this.path,!1);Uf("Firebase.setWithPriority",2,b);A("Firebase.setWithPriority",3,c,!0);if(".length"===this.key()||".keys"===this.key())throw"Firebase.setWithPriority failed: "+this.key()+" is a read-only object.";this.k.Kb(this.path,a,b,c||null)};U.prototype.setWithPriority=U.prototype.Kb;
U.prototype.remove=function(a){x("Firebase.remove",0,1,arguments.length);Yf("Firebase.remove",this.path);A("Firebase.remove",1,a,!0);this.set(null,a)};U.prototype.remove=U.prototype.remove;
U.prototype.transaction=function(a,b,c){x("Firebase.transaction",1,3,arguments.length);Yf("Firebase.transaction",this.path);A("Firebase.transaction",1,a,!1);A("Firebase.transaction",2,b,!0);if(n(c)&&"boolean"!=typeof c)throw Error(z("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.key()||".keys"===this.key())throw"Firebase.transaction failed: "+this.key()+" is a read-only object.";"undefined"===typeof c&&(c=!0);Wh(this.k,this.path,a,b||null,c)};U.prototype.transaction=U.prototype.transaction;
U.prototype.Lg=function(a,b){x("Firebase.setPriority",1,2,arguments.length);Yf("Firebase.setPriority",this.path);Uf("Firebase.setPriority",1,a);A("Firebase.setPriority",2,b,!0);this.k.Kb(this.path.w(".priority"),a,null,b)};U.prototype.setPriority=U.prototype.Lg;
U.prototype.push=function(a,b){x("Firebase.push",0,2,arguments.length);Yf("Firebase.push",this.path);Rf("Firebase.push",a,this.path,!0);A("Firebase.push",2,b,!0);var c=Mh(this.k),c=Kf(c),c=this.w(c);"undefined"!==typeof a&&null!==a&&c.set(a,b);return c};U.prototype.push=U.prototype.push;U.prototype.jb=function(){Yf("Firebase.onDisconnect",this.path);return new X(this.k,this.path)};U.prototype.onDisconnect=U.prototype.jb;
U.prototype.P=function(a,b,c){Q("FirebaseRef.auth() being deprecated. Please use FirebaseRef.authWithCustomToken() instead.");x("Firebase.auth",1,3,arguments.length);Zf("Firebase.auth",a);A("Firebase.auth",2,b,!0);A("Firebase.auth",3,b,!0);Kg(this.k.P,a,{},{remember:"none"},b,c)};U.prototype.auth=U.prototype.P;U.prototype.ee=function(a){x("Firebase.unauth",0,1,arguments.length);A("Firebase.unauth",1,a,!0);Lg(this.k.P,a)};U.prototype.unauth=U.prototype.ee;
U.prototype.we=function(){x("Firebase.getAuth",0,0,arguments.length);return this.k.P.we()};U.prototype.getAuth=U.prototype.we;U.prototype.ug=function(a,b){x("Firebase.onAuth",1,2,arguments.length);A("Firebase.onAuth",1,a,!1);lb("Firebase.onAuth",2,b);this.k.P.Eb("auth_status",a,b)};U.prototype.onAuth=U.prototype.ug;U.prototype.tg=function(a,b){x("Firebase.offAuth",1,2,arguments.length);A("Firebase.offAuth",1,a,!1);lb("Firebase.offAuth",2,b);this.k.P.gc("auth_status",a,b)};U.prototype.offAuth=U.prototype.tg;
U.prototype.Wf=function(a,b,c){x("Firebase.authWithCustomToken",2,3,arguments.length);Zf("Firebase.authWithCustomToken",a);A("Firebase.authWithCustomToken",2,b,!1);ag("Firebase.authWithCustomToken",3,c,!0);Kg(this.k.P,a,{},c||{},b)};U.prototype.authWithCustomToken=U.prototype.Wf;U.prototype.Xf=function(a,b,c){x("Firebase.authWithOAuthPopup",2,3,arguments.length);$f("Firebase.authWithOAuthPopup",1,a);A("Firebase.authWithOAuthPopup",2,b,!1);ag("Firebase.authWithOAuthPopup",3,c,!0);Pg(this.k.P,a,c,b)};
U.prototype.authWithOAuthPopup=U.prototype.Xf;U.prototype.Yf=function(a,b,c){x("Firebase.authWithOAuthRedirect",2,3,arguments.length);$f("Firebase.authWithOAuthRedirect",1,a);A("Firebase.authWithOAuthRedirect",2,b,!1);ag("Firebase.authWithOAuthRedirect",3,c,!0);var d=this.k.P;Ng(d);var e=[wg],f=ig(c);"anonymous"===a||"firebase"===a?R(b,yg("TRANSPORT_UNAVAILABLE")):(P.set("redirect_client_options",f.ld),Og(d,e,"/auth/"+a,f,b))};U.prototype.authWithOAuthRedirect=U.prototype.Yf;
U.prototype.Zf=function(a,b,c,d){x("Firebase.authWithOAuthToken",3,4,arguments.length);$f("Firebase.authWithOAuthToken",1,a);A("Firebase.authWithOAuthToken",3,c,!1);ag("Firebase.authWithOAuthToken",4,d,!0);p(b)?($f("Firebase.authWithOAuthToken",2,b),Mg(this.k.P,a+"/token",{access_token:b},d,c)):(ag("Firebase.authWithOAuthToken",2,b,!1),Mg(this.k.P,a+"/token",b,d,c))};U.prototype.authWithOAuthToken=U.prototype.Zf;
U.prototype.Vf=function(a,b){x("Firebase.authAnonymously",1,2,arguments.length);A("Firebase.authAnonymously",1,a,!1);ag("Firebase.authAnonymously",2,b,!0);Mg(this.k.P,"anonymous",{},b,a)};U.prototype.authAnonymously=U.prototype.Vf;
U.prototype.$f=function(a,b,c){x("Firebase.authWithPassword",2,3,arguments.length);ag("Firebase.authWithPassword",1,a,!1);bg("Firebase.authWithPassword",a,"email");bg("Firebase.authWithPassword",a,"password");A("Firebase.authAnonymously",2,b,!1);ag("Firebase.authAnonymously",3,c,!0);Mg(this.k.P,"password",a,c,b)};U.prototype.authWithPassword=U.prototype.$f;
U.prototype.re=function(a,b){x("Firebase.createUser",2,2,arguments.length);ag("Firebase.createUser",1,a,!1);bg("Firebase.createUser",a,"email");bg("Firebase.createUser",a,"password");A("Firebase.createUser",2,b,!1);this.k.P.re(a,b)};U.prototype.createUser=U.prototype.re;U.prototype.Se=function(a,b){x("Firebase.removeUser",2,2,arguments.length);ag("Firebase.removeUser",1,a,!1);bg("Firebase.removeUser",a,"email");bg("Firebase.removeUser",a,"password");A("Firebase.removeUser",2,b,!1);this.k.P.Se(a,b)};
U.prototype.removeUser=U.prototype.Se;U.prototype.oe=function(a,b){x("Firebase.changePassword",2,2,arguments.length);ag("Firebase.changePassword",1,a,!1);bg("Firebase.changePassword",a,"email");bg("Firebase.changePassword",a,"oldPassword");bg("Firebase.changePassword",a,"newPassword");A("Firebase.changePassword",2,b,!1);this.k.P.oe(a,b)};U.prototype.changePassword=U.prototype.oe;
U.prototype.ne=function(a,b){x("Firebase.changeEmail",2,2,arguments.length);ag("Firebase.changeEmail",1,a,!1);bg("Firebase.changeEmail",a,"oldEmail");bg("Firebase.changeEmail",a,"newEmail");bg("Firebase.changeEmail",a,"password");A("Firebase.changeEmail",2,b,!1);this.k.P.ne(a,b)};U.prototype.changeEmail=U.prototype.ne;
U.prototype.Ue=function(a,b){x("Firebase.resetPassword",2,2,arguments.length);ag("Firebase.resetPassword",1,a,!1);bg("Firebase.resetPassword",a,"email");A("Firebase.resetPassword",2,b,!1);this.k.P.Ue(a,b)};U.prototype.resetPassword=U.prototype.Ue;U.goOffline=function(){x("Firebase.goOffline",0,0,arguments.length);W.ub().yb()};U.goOnline=function(){x("Firebase.goOnline",0,0,arguments.length);W.ub().qc()};
function Nc(a,b){J(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?Ab=q(console.log,console):"object"===typeof console.log&&(Ab=function(a){console.log(a)})),b&&P.set("logging_enabled",!0)):a?Ab=a:(Ab=null,P.remove("logging_enabled"))}U.enableLogging=Nc;U.ServerValue={TIMESTAMP:{".sv":"timestamp"}};U.SDK_VERSION="2.2.4";U.INTERNAL=V;U.Context=W;U.TEST_ACCESS=Z;})();

module.exports = Firebase;

},{}],3:[function(require,module,exports){
(function (root, pluralize) {
  /* istanbul ignore else */
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
    // Node.
    module.exports = pluralize();
  } else if (typeof define === 'function' && define.amd) {
    // AMD, registers as an anonymous module.
    define(function () {
      return pluralize();
    });
  } else {
    // Browser global.
    root.pluralize = pluralize();
  }
})(this, function () {
  // Rule storage - pluralize and singularize need to be run sequentially,
  // while other rules can be optimized using an object for instant lookups.
  var pluralRules      = [];
  var singularRules    = [];
  var uncountables     = {};
  var irregularPlurals = {};
  var irregularSingles = {};

  /**
   * Title case a string.
   *
   * @param  {string} str
   * @return {string}
   */
  function toTitleCase (str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  }

  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */
  function sanitizeRule (rule) {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }

  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */
  function restoreCase (word, token) {
    // Upper cased words. E.g. "HELLO".
    if (word === word.toUpperCase()) {
      return token.toUpperCase();
    }

    // Title cased words. E.g. "Title".
    if (word[0] === word[0].toUpperCase()) {
      return toTitleCase(token);
    }

    // Lower cased words. E.g. "test".
    return token.toLowerCase();
  }

  /**
   * Interpolate a regexp string.
   *
   * @param  {[type]} str  [description]
   * @param  {[type]} args [description]
   * @return {[type]}      [description]
   */
  function interpolate (str, args) {
    return str.replace(/\$(\d{1,2})/g, function (match, index) {
      return args[index] || '';
    });
  }

  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {String}   word
   * @param  {Array}    collection
   * @return {String}
   */
  function sanitizeWord (word, collection) {
    // Empty string or doesn't need fixing.
    if (!word.length || uncountables.hasOwnProperty(word)) {
      return word;
    }

    var len = collection.length;

    // Iterate over the sanitization rules and use the first one to match.
    while (len--) {
      var rule = collection[len];

      // If the rule passes, return the replacement.
      if (rule[0].test(word)) {
        return word.replace(rule[0], function (match, index, word) {
          var result = interpolate(rule[1], arguments);

          if (match === '') {
            return restoreCase(word[index - 1], result);
          }

          return restoreCase(match, result);
        });
      }
    }

    return word;
  }

  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */
  function replaceWord (replaceMap, keepMap, rules) {
    return function (word) {
      // Get the correct token and case restoration functions.
      var token = word.toLowerCase();

      // Check against the keep object map.
      if (keepMap.hasOwnProperty(token)) {
        return restoreCase(word, token);
      }

      // Check against the replacement map for a direct word replacement.
      if (replaceMap.hasOwnProperty(token)) {
        return restoreCase(word, replaceMap[token]);
      }

      // Run all the rules against the word.
      return sanitizeWord(word, rules);
    };
  }

  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {String}  word
   * @param  {Number}  count
   * @param  {Boolean} inclusive
   * @return {String}
   */
  function pluralize (word, count, inclusive) {
    var pluralized = count === 1 ?
      pluralize.singular(word) : pluralize.plural(word);

    return (inclusive ? count + ' ' : '') + pluralized;
  }

  /**
   * Pluralize a word.
   *
   * @type {Function}
   */
  pluralize.plural = replaceWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Singularize a word.
   *
   * @type {Function}
   */
  pluralize.singular = replaceWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addPluralRule = function (rule, replacement) {
    pluralRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addSingularRule = function (rule, replacement) {
    singularRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add an uncountable word rule.
   *
   * @param {(string|RegExp)} word
   */
  pluralize.addUncountableRule = function (word) {
    if (typeof word === 'string') {
      return uncountables[word.toLowerCase()] = true;
    }

    // Set singular and plural references for the word.
    pluralize.addPluralRule(word, '$0');
    pluralize.addSingularRule(word, '$0');
  };

  /**
   * Add an irregular word definition.
   *
   * @param {String} single
   * @param {String} plural
   */
  pluralize.addIrregularRule = function (single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();

    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
  };

  /**
   * Irregular rules.
   */
  [
    // Pronouns.
    ['I',        'we'],
    ['me',       'us'],
    ['he',       'they'],
    ['she',      'they'],
    ['them',     'them'],
    ['myself',   'ourselves'],
    ['yourself', 'yourselves'],
    ['itself',   'themselves'],
    ['herself',  'themselves'],
    ['himself',  'themselves'],
    ['themself', 'themselves'],
    ['this',     'these'],
    ['that',     'those'],
    // Words ending in with a consonant and `o`.
    ['echo', 'echoes'],
    ['dingo', 'dingoes'],
    ['volcano', 'volcanoes'],
    ['tornado', 'tornadoes'],
    ['torpedo', 'torpedoes'],
    // Ends with `us`.
    ['genus',  'genera'],
    ['viscus', 'viscera'],
    // Ends with `ma`.
    ['stigma',   'stigmata'],
    ['stoma',    'stomata'],
    ['dogma',    'dogmata'],
    ['lemma',    'lemmata'],
    ['schema',   'schemata'],
    ['anathema', 'anathemata'],
    // Other irregular rules.
    ['ox',      'oxen'],
    ['axe',     'axes'],
    ['die',     'dice'],
    ['yes',     'yeses'],
    ['foot',    'feet'],
    ['eave',    'eaves'],
    ['goose',   'geese'],
    ['tooth',   'teeth'],
    ['quiz',    'quizzes'],
    ['human',   'humans'],
    ['proof',   'proofs'],
    ['carve',   'carves'],
    ['valve',   'valves'],
    ['thief',   'thieves'],
    ['genie',   'genies'],
    ['groove',  'grooves'],
    ['pickaxe', 'pickaxes'],
    ['whiskey', 'whiskies']
  ].forEach(function (rule) {
    return pluralize.addIrregularRule(rule[0], rule[1]);
  });

  /**
   * Pluralization rules.
   */
  [
    [/s?$/i, 's'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|tlas|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(i)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/(m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men']
  ].forEach(function (rule) {
    return pluralize.addPluralRule(rule[0], rule[1]);
  });

  /**
   * Singularization rules.
   */
  [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(?:sis|ses)$/i, '$1sis'],
    [/(^analy)(?:sis|ses)$/i, '$1sis'],
    [/([^aeflor])ves$/i, '$1fe'],
    [/(hive|tive|dr?ive)s$/i, '$1'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/([^aeiouy]|qu)ies$/i, '$1y'],
    [/(^[pl]|zomb|^(?:neck)?t|[aeo][lt]|cut)ies$/i, '$1ie'],
    [/([^c][eor]n|smil)ies$/i, '$1ey'],
    [/(m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|tlas|gas|(?:her|at|gr)o|ris)(?:es)?$/i, '$1'],
    [/(e[mn]u)s?$/i, '$1'],
    [/(movie|twelve)s$/i, '$1'],
    [/(cris|test|diagnos)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
  ].forEach(function (rule) {
    return pluralize.addSingularRule(rule[0], rule[1]);
  });

  /**
   * Uncountable rules.
   */
  [
    // Singular words with no plurals.
    'advice',
    'agenda',
    'bison',
    'bream',
    'buffalo',
    'carp',
    'chassis',
    'cod',
    'cooperation',
    'corps',
    'digestion',
    'debris',
    'diabetes',
    'energy',
    'equipment',
    'elk',
    'excretion',
    'expertise',
    'flounder',
    'gallows',
    'graffiti',
    'headquarters',
    'health',
    'herpes',
    'highjinks',
    'homework',
    'information',
    'jeans',
    'justice',
    'kudos',
    'labour',
    'machinery',
    'mackerel',
    'media',
    'mews',
    'moose',
    'news',
    'pike',
    'plankton',
    'pliers',
    'pollution',
    'premises',
    'rain',
    'rice',
    'salmon',
    'scissors',
    'series',
    'sewage',
    'shambles',
    'shrimp',
    'species',
    'staff',
    'swine',
    'trout',
    'tuna',
    'whiting',
    'wildebeest',
    'wildlife',
    // Regexes.
    /pox$/i, // "chickpox", "smallpox"
    /ois$/i,
    /deer$/i, // "deer", "reindeer"
    /fish$/i, // "fish", "blowfish", "angelfish"
    /sheep$/i,
    /measles$/i,
    /[^aeiou]ese$/i // "chinese", "japanese"
  ].forEach(pluralize.addUncountableRule);

  return pluralize;
});

},{}],4:[function(require,module,exports){
var _ = require('../util')

/**
 * Create a child instance that prototypally inehrits
 * data on parent. To achieve that we create an intermediate
 * constructor with its prototype pointing to parent.
 *
 * @param {Object} opts
 * @param {Function} [BaseCtor]
 * @return {Vue}
 * @public
 */

exports.$addChild = function (opts, BaseCtor) {
  BaseCtor = BaseCtor || _.Vue
  opts = opts || {}
  var parent = this
  var ChildVue
  var inherit = opts.inherit !== undefined
    ? opts.inherit
    : BaseCtor.options.inherit
  if (inherit) {
    var ctors = parent._childCtors
    ChildVue = ctors[BaseCtor.cid]
    if (!ChildVue) {
      var optionName = BaseCtor.options.name
      var className = optionName
        ? _.classify(optionName)
        : 'VueComponent'
      ChildVue = new Function(
        'return function ' + className + ' (options) {' +
        'this.constructor = ' + className + ';' +
        'this._init(options) }'
      )()
      ChildVue.options = BaseCtor.options
      ChildVue.prototype = this
      ctors[BaseCtor.cid] = ChildVue
    }
  } else {
    ChildVue = BaseCtor
  }
  opts._parent = parent
  opts._root = parent.$root
  var child = new ChildVue(opts)
  this._children.push(child)
  return child
}
},{"../util":61}],5:[function(require,module,exports){
var _ = require('../util')
var Watcher = require('../watcher')
var Path = require('../parsers/path')
var textParser = require('../parsers/text')
var dirParser = require('../parsers/directive')
var expParser = require('../parsers/expression')
var filterRE = /[^|]\|[^|]/

/**
 * Get the value from an expression on this vm.
 *
 * @param {String} exp
 * @return {*}
 */

exports.$get = function (exp) {
  var res = expParser.parse(exp)
  if (res) {
    try {
      return res.get.call(this, this)
    } catch (e) {}
  }
}

/**
 * Set the value from an expression on this vm.
 * The expression must be a valid left-hand
 * expression in an assignment.
 *
 * @param {String} exp
 * @param {*} val
 */

exports.$set = function (exp, val) {
  var res = expParser.parse(exp, true)
  if (res && res.set) {
    res.set.call(this, this, val)
  }
}

/**
 * Add a property on the VM
 *
 * @param {String} key
 * @param {*} val
 */

exports.$add = function (key, val) {
  this._data.$add(key, val)
}

/**
 * Delete a property on the VM
 *
 * @param {String} key
 */

exports.$delete = function (key) {
  this._data.$delete(key)
}

/**
 * Watch an expression, trigger callback when its
 * value changes.
 *
 * @param {String} exp
 * @param {Function} cb
 * @param {Boolean} [deep]
 * @param {Boolean} [immediate]
 * @return {Function} - unwatchFn
 */

exports.$watch = function (exp, cb, deep, immediate) {
  var vm = this
  var key = deep ? exp + '**deep**' : exp
  var watcher = vm._userWatchers[key]
  var wrappedCb = function (val, oldVal) {
    cb.call(vm, val, oldVal)
  }
  if (!watcher) {
    watcher = vm._userWatchers[key] =
      new Watcher(vm, exp, wrappedCb, {
        deep: deep,
        user: true
      })
  } else {
    watcher.addCb(wrappedCb)
  }
  if (immediate) {
    wrappedCb(watcher.value)
  }
  return function unwatchFn () {
    watcher.removeCb(wrappedCb)
    if (!watcher.active) {
      vm._userWatchers[key] = null
    }
  }
}

/**
 * Evaluate a text directive, including filters.
 *
 * @param {String} text
 * @return {String}
 */

exports.$eval = function (text) {
  // check for filters.
  if (filterRE.test(text)) {
    var dir = dirParser.parse(text)[0]
    // the filter regex check might give false positive
    // for pipes inside strings, so it's possible that
    // we don't get any filters here
    return dir.filters
      ? _.applyFilters(
          this.$get(dir.expression),
          _.resolveFilters(this, dir.filters).read,
          this
        )
      : this.$get(dir.expression)
  } else {
    // no filter
    return this.$get(text)
  }
}

/**
 * Interpolate a piece of template text.
 *
 * @param {String} text
 * @return {String}
 */

exports.$interpolate = function (text) {
  var tokens = textParser.parse(text)
  var vm = this
  if (tokens) {
    return tokens.length === 1
      ? vm.$eval(tokens[0].value)
      : tokens.map(function (token) {
          return token.tag
            ? vm.$eval(token.value)
            : token.value
        }).join('')
  } else {
    return text
  }
}

/**
 * Log instance data as a plain JS object
 * so that it is easier to inspect in console.
 * This method assumes console is available.
 *
 * @param {String} [path]
 */

exports.$log = function (path) {
  var data = path
    ? Path.get(this._data, path)
    : this._data
  if (data) {
    data = JSON.parse(JSON.stringify(data))
  }
  console.log(data)
}
},{"../parsers/directive":49,"../parsers/expression":50,"../parsers/path":51,"../parsers/text":53,"../util":61,"../watcher":65}],6:[function(require,module,exports){
var _ = require('../util')
var transition = require('../transition')

/**
 * Append instance to target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$appendTo = function (target, cb, withTransition) {
  return insert(
    this, target, cb, withTransition,
    append, transition.append
  )
}

/**
 * Prepend instance to target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$prependTo = function (target, cb, withTransition) {
  target = query(target)
  if (target.hasChildNodes()) {
    this.$before(target.firstChild, cb, withTransition)
  } else {
    this.$appendTo(target, cb, withTransition)
  }
  return this
}

/**
 * Insert instance before target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$before = function (target, cb, withTransition) {
  return insert(
    this, target, cb, withTransition,
    before, transition.before
  )
}

/**
 * Insert instance after target
 *
 * @param {Node} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$after = function (target, cb, withTransition) {
  target = query(target)
  if (target.nextSibling) {
    this.$before(target.nextSibling, cb, withTransition)
  } else {
    this.$appendTo(target.parentNode, cb, withTransition)
  }
  return this
}

/**
 * Remove instance from DOM
 *
 * @param {Function} [cb]
 * @param {Boolean} [withTransition] - defaults to true
 */

exports.$remove = function (cb, withTransition) {
  var inDoc = this._isAttached && _.inDoc(this.$el)
  // if we are not in document, no need to check
  // for transitions
  if (!inDoc) withTransition = false
  var op
  var self = this
  var realCb = function () {
    if (inDoc) self._callHook('detached')
    if (cb) cb()
  }
  if (
    this._isBlock &&
    !this._blockFragment.hasChildNodes()
  ) {
    op = withTransition === false
      ? append
      : transition.removeThenAppend
    blockOp(this, this._blockFragment, op, realCb)
  } else {
    op = withTransition === false
      ? remove
      : transition.remove
    op(this.$el, this, realCb)
  }
  return this
}

/**
 * Shared DOM insertion function.
 *
 * @param {Vue} vm
 * @param {Element} target
 * @param {Function} [cb]
 * @param {Boolean} [withTransition]
 * @param {Function} op1 - op for non-transition insert
 * @param {Function} op2 - op for transition insert
 * @return vm
 */

function insert (vm, target, cb, withTransition, op1, op2) {
  target = query(target)
  var targetIsDetached = !_.inDoc(target)
  var op = withTransition === false || targetIsDetached
    ? op1
    : op2
  var shouldCallHook =
    !targetIsDetached &&
    !vm._isAttached &&
    !_.inDoc(vm.$el)
  if (vm._isBlock) {
    blockOp(vm, target, op, cb)
  } else {
    op(vm.$el, target, vm, cb)
  }
  if (shouldCallHook) {
    vm._callHook('attached')
  }
  return vm
}

/**
 * Execute a transition operation on a block instance,
 * iterating through all its block nodes.
 *
 * @param {Vue} vm
 * @param {Node} target
 * @param {Function} op
 * @param {Function} cb
 */

function blockOp (vm, target, op, cb) {
  var current = vm._blockStart
  var end = vm._blockEnd
  var next
  while (next !== end) {
    next = current.nextSibling
    op(current, target, vm)
    current = next
  }
  op(end, target, vm, cb)
}

/**
 * Check for selectors
 *
 * @param {String|Element} el
 */

function query (el) {
  return typeof el === 'string'
    ? document.querySelector(el)
    : el
}

/**
 * Append operation that takes a callback.
 *
 * @param {Node} el
 * @param {Node} target
 * @param {Vue} vm - unused
 * @param {Function} [cb]
 */

function append (el, target, vm, cb) {
  target.appendChild(el)
  if (cb) cb()
}

/**
 * InsertBefore operation that takes a callback.
 *
 * @param {Node} el
 * @param {Node} target
 * @param {Vue} vm - unused
 * @param {Function} [cb]
 */

function before (el, target, vm, cb) {
  _.before(el, target)
  if (cb) cb()
}

/**
 * Remove operation that takes a callback.
 *
 * @param {Node} el
 * @param {Vue} vm - unused
 * @param {Function} [cb]
 */

function remove (el, vm, cb) {
  _.remove(el)
  if (cb) cb()
}
},{"../transition":55,"../util":61}],7:[function(require,module,exports){
var _ = require('../util')

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 */

exports.$on = function (event, fn) {
  (this._events[event] || (this._events[event] = []))
    .push(fn)
  modifyListenerCount(this, event, 1)
  return this
}

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 */

exports.$once = function (event, fn) {
  var self = this
  function on () {
    self.$off(event, on)
    fn.apply(this, arguments)
  }
  on.fn = fn
  this.$on(event, on)
  return this
}

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 */

exports.$off = function (event, fn) {
  var cbs
  // all
  if (!arguments.length) {
    if (this.$parent) {
      for (event in this._events) {
        cbs = this._events[event]
        if (cbs) {
          modifyListenerCount(this, event, -cbs.length)
        }
      }
    }
    this._events = {}
    return this
  }
  // specific event
  cbs = this._events[event]
  if (!cbs) {
    return this
  }
  if (arguments.length === 1) {
    modifyListenerCount(this, event, -cbs.length)
    this._events[event] = null
    return this
  }
  // specific handler
  var cb
  var i = cbs.length
  while (i--) {
    cb = cbs[i]
    if (cb === fn || cb.fn === fn) {
      modifyListenerCount(this, event, -1)
      cbs.splice(i, 1)
      break
    }
  }
  return this
}

/**
 * Trigger an event on self.
 *
 * @param {String} event
 */

exports.$emit = function (event) {
  this._eventCancelled = false
  var cbs = this._events[event]
  if (cbs) {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length - 1
    var args = new Array(i)
    while (i--) {
      args[i] = arguments[i + 1]
    }
    i = 0
    cbs = cbs.length > 1
      ? _.toArray(cbs)
      : cbs
    for (var l = cbs.length; i < l; i++) {
      if (cbs[i].apply(this, args) === false) {
        this._eventCancelled = true
      }
    }
  }
  return this
}

/**
 * Recursively broadcast an event to all children instances.
 *
 * @param {String} event
 * @param {...*} additional arguments
 */

exports.$broadcast = function (event) {
  // if no child has registered for this event,
  // then there's no need to broadcast.
  if (!this._eventsCount[event]) return
  var children = this._children
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i]
    child.$emit.apply(child, arguments)
    if (!child._eventCancelled) {
      child.$broadcast.apply(child, arguments)
    }
  }
  return this
}

/**
 * Recursively propagate an event up the parent chain.
 *
 * @param {String} event
 * @param {...*} additional arguments
 */

exports.$dispatch = function () {
  var parent = this.$parent
  while (parent) {
    parent.$emit.apply(parent, arguments)
    parent = parent._eventCancelled
      ? null
      : parent.$parent
  }
  return this
}

/**
 * Modify the listener counts on all parents.
 * This bookkeeping allows $broadcast to return early when
 * no child has listened to a certain event.
 *
 * @param {Vue} vm
 * @param {String} event
 * @param {Number} count
 */

var hookRE = /^hook:/
function modifyListenerCount (vm, event, count) {
  var parent = vm.$parent
  // hooks do not get broadcasted so no need
  // to do bookkeeping for them
  if (!parent || !count || hookRE.test(event)) return
  while (parent) {
    parent._eventsCount[event] =
      (parent._eventsCount[event] || 0) + count
    parent = parent.$parent
  }
}
},{"../util":61}],8:[function(require,module,exports){
var _ = require('../util')
var mergeOptions = require('../util/merge-option')

/**
 * Expose useful internals
 */

exports.util = _
exports.nextTick = _.nextTick
exports.config = require('../config')

exports.compiler = {
  compile: require('../compiler/compile'),
  transclude: require('../compiler/transclude')
}

exports.parsers = {
  path: require('../parsers/path'),
  text: require('../parsers/text'),
  template: require('../parsers/template'),
  directive: require('../parsers/directive'),
  expression: require('../parsers/expression')
}

/**
 * Each instance constructor, including Vue, has a unique
 * cid. This enables us to create wrapped "child
 * constructors" for prototypal inheritance and cache them.
 */

exports.cid = 0
var cid = 1

/**
 * Class inehritance
 *
 * @param {Object} extendOptions
 */

exports.extend = function (extendOptions) {
  extendOptions = extendOptions || {}
  var Super = this
  var Sub = createClass(
    extendOptions.name ||
    Super.options.name ||
    'VueComponent'
  )
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super
  // allow further extension
  Sub.extend = Super.extend
  // create asset registers, so extended classes
  // can have their private assets too.
  createAssetRegisters(Sub)
  return Sub
}

/**
 * A function that returns a sub-class constructor with the
 * given name. This gives us much nicer output when
 * logging instances in the console.
 *
 * @param {String} name
 * @return {Function}
 */

function createClass (name) {
  return new Function(
    'return function ' + _.classify(name) +
    ' (options) { this._init(options) }'
  )()
}

/**
 * Plugin system
 *
 * @param {Object} plugin
 */

exports.use = function (plugin) {
  // additional parameters
  var args = _.toArray(arguments, 1)
  args.unshift(this)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else {
    plugin.apply(null, args)
  }
  return this
}

/**
 * Define asset registration methods on a constructor.
 *
 * @param {Function} Constructor
 */

var assetTypes = [
  'directive',
  'filter',
  'partial',
  'transition'
]

function createAssetRegisters (Constructor) {

  /* Asset registration methods share the same signature:
   *
   * @param {String} id
   * @param {*} definition
   */

  assetTypes.forEach(function (type) {
    Constructor[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        this.options[type + 's'][id] = definition
      }
    }
  })

  /**
   * Component registration needs to automatically invoke
   * Vue.extend on object values.
   *
   * @param {String} id
   * @param {Object|Function} definition
   */

  Constructor.component = function (id, definition) {
    if (!definition) {
      return this.options.components[id]
    } else {
      if (_.isPlainObject(definition)) {
        definition.name = id
        definition = _.Vue.extend(definition)
      }
      this.options.components[id] = definition
    }
  }
}

createAssetRegisters(exports)
},{"../compiler/compile":12,"../compiler/transclude":13,"../config":14,"../parsers/directive":49,"../parsers/expression":50,"../parsers/path":51,"../parsers/template":52,"../parsers/text":53,"../util":61,"../util/merge-option":63}],9:[function(require,module,exports){
var _ = require('../util')
var compile = require('../compiler/compile')

/**
 * Set instance target element and kick off the compilation
 * process. The passed in `el` can be a selector string, an
 * existing Element, or a DocumentFragment (for block
 * instances).
 *
 * @param {Element|DocumentFragment|string} el
 * @public
 */

exports.$mount = function (el) {
  if (this._isCompiled) {
    _.warn('$mount() should be called only once.')
    return
  }
  if (!el) {
    el = document.createElement('div')
  } else if (typeof el === 'string') {
    var selector = el
    el = document.querySelector(el)
    if (!el) {
      _.warn('Cannot find element: ' + selector)
      return
    }
  }
  this._compile(el)
  this._isCompiled = true
  this._callHook('compiled')
  if (_.inDoc(this.$el)) {
    this._callHook('attached')
    this._initDOMHooks()
    ready.call(this)
  } else {
    this._initDOMHooks()
    this.$once('hook:attached', ready)
  }
  return this
}

/**
 * Mark an instance as ready.
 */

function ready () {
  this._isAttached = true
  this._isReady = true
  this._callHook('ready')
}

/**
 * Teardown the instance, simply delegate to the internal
 * _destroy.
 */

exports.$destroy = function (remove, deferCleanup) {
  this._destroy(remove, deferCleanup)
}

/**
 * Partially compile a piece of DOM and return a
 * decompile function.
 *
 * @param {Element|DocumentFragment} el
 * @return {Function}
 */

exports.$compile = function (el) {
  return compile(el, this.$options, true)(this, el)
}
},{"../compiler/compile":12,"../util":61}],10:[function(require,module,exports){
var _ = require('./util')
var MAX_UPDATE_COUNT = 10

// we have two separate queues: one for directive updates
// and one for user watcher registered via $watch().
// we want to guarantee directive updates to be called
// before user watchers so that when user watchers are
// triggered, the DOM would have already been in updated
// state.
var queue = []
var userQueue = []
var has = {}
var waiting = false
var flushing = false

/**
 * Reset the batcher's state.
 */

function reset () {
  queue = []
  userQueue = []
  has = {}
  waiting = false
  flushing = false
}

/**
 * Flush both queues and run the jobs.
 */

function flush () {
  flushing = true
  run(queue)
  run(userQueue)
  reset()
}

/**
 * Run the jobs in a single queue.
 *
 * @param {Array} queue
 */

function run (queue) {
  // do not cache length because more jobs might be pushed
  // as we run existing jobs
  for (var i = 0; i < queue.length; i++) {
    queue[i].run()
  }
}

/**
 * Push a job into the job queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 *
 * @param {Object} job
 *   properties:
 *   - {String|Number} id
 *   - {Function}      run
 */

exports.push = function (job) {
  var id = job.id
  if (!id || !has[id] || flushing) {
    if (!has[id]) {
      has[id] = 1
    } else {
      has[id]++
      // detect possible infinite update loops
      if (has[id] > MAX_UPDATE_COUNT) {
        _.warn(
          'You may have an infinite update loop for the ' +
          'watcher with expression: "' + job.expression + '".'
        )
        return
      }
    }
    // A user watcher callback could trigger another
    // directive update during the flushing; at that time
    // the directive queue would already have been run, so
    // we call that update immediately as it is pushed.
    if (flushing && !job.user) {
      job.run()
      return
    }
    ;(job.user ? userQueue : queue).push(job)
    if (!waiting) {
      waiting = true
      _.nextTick(flush)
    }
  }
}
},{"./util":61}],11:[function(require,module,exports){
/**
 * A doubly linked list-based Least Recently Used (LRU)
 * cache. Will keep most recently used items while
 * discarding least recently used items when its limit is
 * reached. This is a bare-bone version of
 * Rasmus Andersson's js-lru:
 *
 *   https://github.com/rsms/js-lru
 *
 * @param {Number} limit
 * @constructor
 */

function Cache (limit) {
  this.size = 0
  this.limit = limit
  this.head = this.tail = undefined
  this._keymap = {}
}

var p = Cache.prototype

/**
 * Put <value> into the cache associated with <key>.
 * Returns the entry which was removed to make room for
 * the new entry. Otherwise undefined is returned.
 * (i.e. if there was enough room already).
 *
 * @param {String} key
 * @param {*} value
 * @return {Entry|undefined}
 */

p.put = function (key, value) {
  var entry = {
    key:key,
    value:value
  }
  this._keymap[key] = entry
  if (this.tail) {
    this.tail.newer = entry
    entry.older = this.tail
  } else {
    this.head = entry
  }
  this.tail = entry
  if (this.size === this.limit) {
    return this.shift()
  } else {
    this.size++
  }
}

/**
 * Purge the least recently used (oldest) entry from the
 * cache. Returns the removed entry or undefined if the
 * cache was empty.
 */

p.shift = function () {
  var entry = this.head
  if (entry) {
    this.head = this.head.newer
    this.head.older = undefined
    entry.newer = entry.older = undefined
    this._keymap[entry.key] = undefined
  }
  return entry
}

/**
 * Get and register recent use of <key>. Returns the value
 * associated with <key> or undefined if not in cache.
 *
 * @param {String} key
 * @param {Boolean} returnEntry
 * @return {Entry|*}
 */

p.get = function (key, returnEntry) {
  var entry = this._keymap[key]
  if (entry === undefined) return
  if (entry === this.tail) {
    return returnEntry
      ? entry
      : entry.value
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry.newer) {
    if (entry === this.head) {
      this.head = entry.newer
    }
    entry.newer.older = entry.older // C <-- E.
  }
  if (entry.older) {
    entry.older.newer = entry.newer // C. --> E
  }
  entry.newer = undefined // D --x
  entry.older = this.tail // D. --> E
  if (this.tail) {
    this.tail.newer = entry // E. <-- D
  }
  this.tail = entry
  return returnEntry
    ? entry
    : entry.value
}

module.exports = Cache
},{}],12:[function(require,module,exports){
var _ = require('../util')
var config = require('../config')
var textParser = require('../parsers/text')
var dirParser = require('../parsers/directive')
var templateParser = require('../parsers/template')

/**
 * Compile a template and return a reusable composite link
 * function, which recursively contains more link functions
 * inside. This top level compile function should only be
 * called on instance root nodes.
 *
 * When the `asParent` flag is true, this means we are doing
 * a partial compile for a component's parent scope markup
 * (See #502). This could **only** be triggered during
 * compilation of `v-component`, and we need to skip v-with,
 * v-ref & v-component in this situation.
 *
 * @param {Element|DocumentFragment} el
 * @param {Object} options
 * @param {Boolean} partial
 * @param {Boolean} asParent - compiling a component
 *                             container as its parent.
 * @return {Function}
 */

module.exports = function compile (el, options, partial, asParent) {
  var isBlock = el.nodeType === 11
  var params = !partial && options.paramAttributes
  // if el is a fragment, this is a block instance
  // and paramAttributes will be stored on the first
  // element in the template. (excluding the _blockStart
  // comment node)
  var paramsEl = isBlock ? el.childNodes[1] : el
  var paramsLinkFn = params
    ? compileParamAttributes(paramsEl, params, options)
    : null
  var nodeLinkFn = isBlock
    ? null
    : compileNode(el, options, asParent)
  var childLinkFn =
    !(nodeLinkFn && nodeLinkFn.terminal) &&
    el.tagName !== 'SCRIPT' &&
    el.hasChildNodes()
      ? compileNodeList(el.childNodes, options)
      : null

  /**
   * A linker function to be called on a already compiled
   * piece of DOM, which instantiates all directive
   * instances.
   *
   * @param {Vue} vm
   * @param {Element|DocumentFragment} el
   * @return {Function|undefined}
   */

  return function link (vm, el) {
    var originalDirCount = vm._directives.length
    if (paramsLinkFn) {
      var paramsEl = isBlock ? el.childNodes[1] : el
      paramsLinkFn(vm, paramsEl)
    }
    // cache childNodes before linking parent, fix #657
    var childNodes = _.toArray(el.childNodes)
    if (nodeLinkFn) nodeLinkFn(vm, el)
    if (childLinkFn) childLinkFn(vm, childNodes)

    /**
     * If this is a partial compile, the linker function
     * returns an unlink function that tearsdown all
     * directives instances generated during the partial
     * linking.
     */

    if (partial) {
      var dirs = vm._directives.slice(originalDirCount)
      return function unlink () {
        var i = dirs.length
        while (i--) {
          dirs[i]._teardown()
        }
        i = vm._directives.indexOf(dirs[0])
        vm._directives.splice(i, dirs.length)
      }
    }
  }
}

/**
 * Compile a node and return a nodeLinkFn based on the
 * node type.
 *
 * @param {Node} node
 * @param {Object} options
 * @param {Boolean} asParent
 * @return {Function|undefined}
 */

function compileNode (node, options, asParent) {
  var type = node.nodeType
  if (type === 1 && node.tagName !== 'SCRIPT') {
    return compileElement(node, options, asParent)
  } else if (type === 3 && config.interpolate) {
    return compileTextNode(node, options)
  }
}

/**
 * Compile an element and return a nodeLinkFn.
 *
 * @param {Element} el
 * @param {Object} options
 * @param {Boolean} asParent
 * @return {Function|null}
 */

function compileElement (el, options, asParent) {
  var linkFn, tag, component
  // check custom element component, but only on non-root
  if (!asParent && !el.__vue__) {
    tag = el.tagName.toLowerCase()
    component =
      tag.indexOf('-') > 0 &&
      options.components[tag]
    if (component) {
      el.setAttribute(config.prefix + 'component', tag)
    }
  }
  if (component || el.hasAttributes()) {
    // check terminal direcitves
    if (!asParent) {
      linkFn = checkTerminalDirectives(el, options)
    }
    // if not terminal, build normal link function
    if (!linkFn) {
      var dirs = collectDirectives(el, options, asParent)
      linkFn = dirs.length
        ? makeDirectivesLinkFn(dirs)
        : null
    }
  }
  // if the element is a textarea, we need to interpolate
  // its content on initial render.
  if (el.tagName === 'TEXTAREA') {
    var realLinkFn = linkFn
    linkFn = function (vm, el) {
      el.value = vm.$interpolate(el.value)
      if (realLinkFn) realLinkFn(vm, el)
    }
    linkFn.terminal = true
  }
  return linkFn
}

/**
 * Build a multi-directive link function.
 *
 * @param {Array} directives
 * @return {Function} directivesLinkFn
 */

function makeDirectivesLinkFn (directives) {
  return function directivesLinkFn (vm, el) {
    // reverse apply because it's sorted low to high
    var i = directives.length
    var dir, j, k
    while (i--) {
      dir = directives[i]
      if (dir._link) {
        // custom link fn
        dir._link(vm, el)
      } else {
        k = dir.descriptors.length
        for (j = 0; j < k; j++) {
          vm._bindDir(dir.name, el,
                      dir.descriptors[j], dir.def)
        }
      }
    }
  }
}

/**
 * Compile a textNode and return a nodeLinkFn.
 *
 * @param {TextNode} node
 * @param {Object} options
 * @return {Function|null} textNodeLinkFn
 */

function compileTextNode (node, options) {
  var tokens = textParser.parse(node.nodeValue)
  if (!tokens) {
    return null
  }
  var frag = document.createDocumentFragment()
  var el, token
  for (var i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i]
    el = token.tag
      ? processTextToken(token, options)
      : document.createTextNode(token.value)
    frag.appendChild(el)
  }
  return makeTextNodeLinkFn(tokens, frag, options)
}

/**
 * Process a single text token.
 *
 * @param {Object} token
 * @param {Object} options
 * @return {Node}
 */

function processTextToken (token, options) {
  var el
  if (token.oneTime) {
    el = document.createTextNode(token.value)
  } else {
    if (token.html) {
      el = document.createComment('v-html')
      setTokenType('html')
    } else if (token.partial) {
      el = document.createComment('v-partial')
      setTokenType('partial')
    } else {
      // IE will clean up empty textNodes during
      // frag.cloneNode(true), so we have to give it
      // something here...
      el = document.createTextNode(' ')
      setTokenType('text')
    }
  }
  function setTokenType (type) {
    token.type = type
    token.def = options.directives[type]
    token.descriptor = dirParser.parse(token.value)[0]
  }
  return el
}

/**
 * Build a function that processes a textNode.
 *
 * @param {Array<Object>} tokens
 * @param {DocumentFragment} frag
 */

function makeTextNodeLinkFn (tokens, frag) {
  return function textNodeLinkFn (vm, el) {
    var fragClone = frag.cloneNode(true)
    var childNodes = _.toArray(fragClone.childNodes)
    var token, value, node
    for (var i = 0, l = tokens.length; i < l; i++) {
      token = tokens[i]
      value = token.value
      if (token.tag) {
        node = childNodes[i]
        if (token.oneTime) {
          value = vm.$eval(value)
          if (token.html) {
            _.replace(node, templateParser.parse(value, true))
          } else {
            node.nodeValue = value
          }
        } else {
          vm._bindDir(token.type, node,
                      token.descriptor, token.def)
        }
      }
    }
    _.replace(el, fragClone)
  }
}

/**
 * Compile a node list and return a childLinkFn.
 *
 * @param {NodeList} nodeList
 * @param {Object} options
 * @return {Function|undefined}
 */

function compileNodeList (nodeList, options) {
  var linkFns = []
  var nodeLinkFn, childLinkFn, node
  for (var i = 0, l = nodeList.length; i < l; i++) {
    node = nodeList[i]
    nodeLinkFn = compileNode(node, options)
    childLinkFn =
      !(nodeLinkFn && nodeLinkFn.terminal) &&
      node.tagName !== 'SCRIPT' &&
      node.hasChildNodes()
        ? compileNodeList(node.childNodes, options)
        : null
    linkFns.push(nodeLinkFn, childLinkFn)
  }
  return linkFns.length
    ? makeChildLinkFn(linkFns)
    : null
}

/**
 * Make a child link function for a node's childNodes.
 *
 * @param {Array<Function>} linkFns
 * @return {Function} childLinkFn
 */

function makeChildLinkFn (linkFns) {
  return function childLinkFn (vm, nodes) {
    var node, nodeLinkFn, childrenLinkFn
    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
      node = nodes[n]
      nodeLinkFn = linkFns[i++]
      childrenLinkFn = linkFns[i++]
      // cache childNodes before linking parent, fix #657
      var childNodes = _.toArray(node.childNodes)
      if (nodeLinkFn) {
        nodeLinkFn(vm, node)
      }
      if (childrenLinkFn) {
        childrenLinkFn(vm, childNodes)
      }
    }
  }
}

/**
 * Compile param attributes on a root element and return
 * a paramAttributes link function.
 *
 * @param {Element} el
 * @param {Array} attrs
 * @param {Object} options
 * @return {Function} paramsLinkFn
 */

function compileParamAttributes (el, attrs, options) {
  var params = []
  var i = attrs.length
  var name, value, param
  while (i--) {
    name = attrs[i]
    if (/[A-Z]/.test(name)) {
      _.warn(
        'You seem to be using camelCase for a paramAttribute, ' +
        'but HTML doesn\'t differentiate between upper and ' +
        'lower case. You should use hyphen-delimited ' +
        'attribute names. For more info see ' +
        'http://vuejs.org/api/options.html#paramAttributes'
      )
    }
    value = el.getAttribute(name)
    if (value !== null) {
      param = {
        name: name,
        value: value
      }
      var tokens = textParser.parse(value)
      if (tokens) {
        el.removeAttribute(name)
        if (tokens.length > 1) {
          _.warn(
            'Invalid param attribute binding: "' +
            name + '="' + value + '"' +
            '\nDon\'t mix binding tags with plain text ' +
            'in param attribute bindings.'
          )
          continue
        } else {
          param.dynamic = true
          param.value = tokens[0].value
        }
      }
      params.push(param)
    }
  }
  return makeParamsLinkFn(params, options)
}

/**
 * Build a function that applies param attributes to a vm.
 *
 * @param {Array} params
 * @param {Object} options
 * @return {Function} paramsLinkFn
 */

var dataAttrRE = /^data-/

function makeParamsLinkFn (params, options) {
  var def = options.directives['with']
  return function paramsLinkFn (vm, el) {
    var i = params.length
    var param, path
    while (i--) {
      param = params[i]
      // params could contain dashes, which will be
      // interpreted as minus calculations by the parser
      // so we need to wrap the path here
      path = _.camelize(param.name.replace(dataAttrRE, ''))
      if (param.dynamic) {
        // dynamic param attribtues are bound as v-with.
        // we can directly duck the descriptor here beacuse
        // param attributes cannot use expressions or
        // filters.
        vm._bindDir('with', el, {
          arg: path,
          expression: param.value
        }, def)
      } else {
        // just set once
        vm.$set(path, param.value)
      }
    }
  }
}

/**
 * Check an element for terminal directives in fixed order.
 * If it finds one, return a terminal link function.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function} terminalLinkFn
 */

var terminalDirectives = [
  'repeat',
  'if',
  'component'
]

function skip () {}
skip.terminal = true

function checkTerminalDirectives (el, options) {
  if (_.attr(el, 'pre') !== null) {
    return skip
  }
  var value, dirName
  /* jshint boss: true */
  for (var i = 0; i < 3; i++) {
    dirName = terminalDirectives[i]
    if (value = _.attr(el, dirName)) {
      return makeTeriminalLinkFn(el, dirName, value, options)
    }
  }
}

/**
 * Build a link function for a terminal directive.
 *
 * @param {Element} el
 * @param {String} dirName
 * @param {String} value
 * @param {Object} options
 * @return {Function} terminalLinkFn
 */

function makeTeriminalLinkFn (el, dirName, value, options) {
  var descriptor = dirParser.parse(value)[0]
  var def = options.directives[dirName]
  var terminalLinkFn = function (vm, el) {
    vm._bindDir(dirName, el, descriptor, def)
  }
  terminalLinkFn.terminal = true
  return terminalLinkFn
}

/**
 * Collect the directives on an element.
 *
 * @param {Element} el
 * @param {Object} options
 * @param {Boolean} asParent
 * @return {Array}
 */

function collectDirectives (el, options, asParent) {
  var attrs = _.toArray(el.attributes)
  var i = attrs.length
  var dirs = []
  var attr, attrName, dir, dirName, dirDef
  while (i--) {
    attr = attrs[i]
    attrName = attr.name
    if (attrName.indexOf(config.prefix) === 0) {
      dirName = attrName.slice(config.prefix.length)
      if (asParent &&
          (dirName === 'with' ||
           dirName === 'component')) {
        continue
      }
      dirDef = options.directives[dirName]
      _.assertAsset(dirDef, 'directive', dirName)
      if (dirDef) {
        dirs.push({
          name: dirName,
          descriptors: dirParser.parse(attr.value),
          def: dirDef
        })
      }
    } else if (config.interpolate) {
      dir = collectAttrDirective(el, attrName, attr.value,
                                 options)
      if (dir) {
        dirs.push(dir)
      }
    }
  }
  // sort by priority, LOW to HIGH
  dirs.sort(directiveComparator)
  return dirs
}

/**
 * Check an attribute for potential dynamic bindings,
 * and return a directive object.
 *
 * @param {Element} el
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @return {Object}
 */

function collectAttrDirective (el, name, value, options) {
  if (options._skipAttrs &&
      options._skipAttrs.indexOf(name) > -1) {
    return
  }
  var tokens = textParser.parse(value)
  if (tokens) {
    var def = options.directives.attr
    var i = tokens.length
    var allOneTime = true
    while (i--) {
      var token = tokens[i]
      if (token.tag && !token.oneTime) {
        allOneTime = false
      }
    }
    return {
      def: def,
      _link: allOneTime
        ? function (vm, el) {
            el.setAttribute(name, vm.$interpolate(value))
          }
        : function (vm, el) {
            var value = textParser.tokensToExp(tokens, vm)
            var desc = dirParser.parse(name + ':' + value)[0]
            vm._bindDir('attr', el, desc, def)
          }
    }
  }
}

/**
 * Directive priority sort comparator
 *
 * @param {Object} a
 * @param {Object} b
 */

function directiveComparator (a, b) {
  a = a.def.priority || 0
  b = b.def.priority || 0
  return a > b ? 1 : -1
}
},{"../config":14,"../parsers/directive":49,"../parsers/template":52,"../parsers/text":53,"../util":61}],13:[function(require,module,exports){
var _ = require('../util')
var templateParser = require('../parsers/template')

/**
 * Process an element or a DocumentFragment based on a
 * instance option object. This allows us to transclude
 * a template node/fragment before the instance is created,
 * so the processed fragment can then be cloned and reused
 * in v-repeat.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

module.exports = function transclude (el, options) {
  // for template tags, what we want is its content as
  // a documentFragment (for block instances)
  if (el.tagName === 'TEMPLATE') {
    el = templateParser.parse(el)
  }
  if (options && options.template) {
    el = transcludeTemplate(el, options)
  }
  if (el instanceof DocumentFragment) {
    _.prepend(document.createComment('v-start'), el)
    el.appendChild(document.createComment('v-end'))
  }
  return el
}

/**
 * Process the template option.
 * If the replace option is true this will swap the $el.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Element|DocumentFragment}
 */

function transcludeTemplate (el, options) {
  var template = options.template
  var frag = templateParser.parse(template, true)
  if (!frag) {
    _.warn('Invalid template option: ' + template)
  } else {
    var rawContent = options._content || _.extractContent(el)
    if (options.replace) {
      if (frag.childNodes.length > 1) {
        transcludeContent(frag, rawContent)
        _.copyAttributes(el, frag.firstChild)
        return frag
      } else {
        var replacer = frag.firstChild
        _.copyAttributes(el, replacer)
        transcludeContent(replacer, rawContent)
        return replacer
      }
    } else {
      el.appendChild(frag)
      transcludeContent(el, rawContent)
      return el
    }
  }
}

/**
 * Resolve <content> insertion points mimicking the behavior
 * of the Shadow DOM spec:
 *
 *   http://w3c.github.io/webcomponents/spec/shadow/#insertion-points
 *
 * @param {Element|DocumentFragment} el
 * @param {Element} raw
 */

function transcludeContent (el, raw) {
  var outlets = getOutlets(el)
  var i = outlets.length
  if (!i) return
  var outlet, select, selected, j, main

  function isDirectChild (node) {
    return node.parentNode === raw
  }

  // first pass, collect corresponding content
  // for each outlet.
  while (i--) {
    outlet = outlets[i]
    if (raw) {
      select = outlet.getAttribute('select')
      if (select) {  // select content
        selected = raw.querySelectorAll(select)
        if (selected.length) {
          // according to Shadow DOM spec, `select` can
          // only select direct children of the host node.
          // enforcing this also fixes #786.
          selected = [].filter.call(selected, isDirectChild)
        }
        outlet.content = selected.length
          ? selected
          : _.toArray(outlet.childNodes)
      } else { // default content
        main = outlet
      }
    } else { // fallback content
      outlet.content = _.toArray(outlet.childNodes)
    }
  }
  // second pass, actually insert the contents
  for (i = 0, j = outlets.length; i < j; i++) {
    outlet = outlets[i]
    if (outlet !== main) {
      insertContentAt(outlet, outlet.content)
    }
  }
  // finally insert the main content
  if (main) {
    insertContentAt(main, _.toArray(raw.childNodes))
  }
}

/**
 * Get <content> outlets from the element/list
 *
 * @param {Element|Array} el
 * @return {Array}
 */

var concat = [].concat
function getOutlets (el) {
  return _.isArray(el)
    ? concat.apply([], el.map(getOutlets))
    : el.querySelectorAll
      ? _.toArray(el.querySelectorAll('content'))
      : []
}

/**
 * Insert an array of nodes at outlet,
 * then remove the outlet.
 *
 * @param {Element} outlet
 * @param {Array} contents
 */

function insertContentAt (outlet, contents) {
  // not using util DOM methods here because
  // parentNode can be cached
  var parent = outlet.parentNode
  for (var i = 0, j = contents.length; i < j; i++) {
    parent.insertBefore(contents[i], outlet)
  }
  parent.removeChild(outlet)
}
},{"../parsers/template":52,"../util":61}],14:[function(require,module,exports){
module.exports = {

  /**
   * The prefix to look for when parsing directives.
   *
   * @type {String}
   */

  prefix: 'v-',

  /**
   * Whether to print debug messages.
   * Also enables stack trace for warnings.
   *
   * @type {Boolean}
   */

  debug: false,

  /**
   * Whether to suppress warnings.
   *
   * @type {Boolean}
   */

  silent: false,

  /**
   * Whether allow observer to alter data objects'
   * __proto__.
   *
   * @type {Boolean}
   */

  proto: true,

  /**
   * Whether to parse mustache tags in templates.
   *
   * @type {Boolean}
   */

  interpolate: true,

  /**
   * Whether to use async rendering.
   */

  async: true,

  /**
   * Whether to warn against errors caught when evaluating
   * expressions.
   */

  warnExpressionErrors: true,

  /**
   * Internal flag to indicate the delimiters have been
   * changed.
   *
   * @type {Boolean}
   */

  _delimitersChanged: true

}

/**
 * Interpolation delimiters.
 * We need to mark the changed flag so that the text parser
 * knows it needs to recompile the regex.
 *
 * @type {Array<String>}
 */

var delimiters = ['{{', '}}']
Object.defineProperty(module.exports, 'delimiters', {
  get: function () {
    return delimiters
  },
  set: function (val) {
    delimiters = val
    this._delimitersChanged = true
  }
})
},{}],15:[function(require,module,exports){
var _ = require('./util')
var config = require('./config')
var Watcher = require('./watcher')
var textParser = require('./parsers/text')
var expParser = require('./parsers/expression')

/**
 * A directive links a DOM element with a piece of data,
 * which is the result of evaluating an expression.
 * It registers a watcher with the expression and calls
 * the DOM update function when a change is triggered.
 *
 * @param {String} name
 * @param {Node} el
 * @param {Vue} vm
 * @param {Object} descriptor
 *                 - {String} expression
 *                 - {String} [arg]
 *                 - {Array<Object>} [filters]
 * @param {Object} def - directive definition object
 * @constructor
 */

function Directive (name, el, vm, descriptor, def) {
  // public
  this.name = name
  this.el = el
  this.vm = vm
  // copy descriptor props
  this.raw = descriptor.raw
  this.expression = descriptor.expression
  this.arg = descriptor.arg
  this.filters = _.resolveFilters(vm, descriptor.filters)
  // private
  this._locked = false
  this._bound = false
  // init
  this._bind(def)
}

var p = Directive.prototype

/**
 * Initialize the directive, mixin definition properties,
 * setup the watcher, call definition bind() and update()
 * if present.
 *
 * @param {Object} def
 */

p._bind = function (def) {
  if (this.name !== 'cloak' && this.el.removeAttribute) {
    this.el.removeAttribute(config.prefix + this.name)
  }
  if (typeof def === 'function') {
    this.update = def
  } else {
    _.extend(this, def)
  }
  this._watcherExp = this.expression
  this._checkDynamicLiteral()
  if (this.bind) {
    this.bind()
  }
  if (this._watcherExp &&
      (this.update || this.twoWay) &&
      (!this.isLiteral || this._isDynamicLiteral) &&
      !this._checkStatement()) {
    // wrapped updater for context
    var dir = this
    var update = this._update = this.update
      ? function (val, oldVal) {
          if (!dir._locked) {
            dir.update(val, oldVal)
          }
        }
      : function () {} // noop if no update is provided
    // use raw expression as identifier because filters
    // make them different watchers
    var watcher = this.vm._watchers[this.raw]
    // v-repeat always creates a new watcher because it has
    // a special filter that's bound to its directive
    // instance.
    if (!watcher || this.name === 'repeat') {
      watcher = this.vm._watchers[this.raw] = new Watcher(
        this.vm,
        this._watcherExp,
        update, // callback
        {
          filters: this.filters,
          twoWay: this.twoWay,
          deep: this.deep
        }
      )
    } else {
      watcher.addCb(update)
    }
    this._watcher = watcher
    if (this._initValue != null) {
      watcher.set(this._initValue)
    } else if (this.update) {
      this.update(watcher.value)
    }
  }
  this._bound = true
}

/**
 * check if this is a dynamic literal binding.
 *
 * e.g. v-component="{{currentView}}"
 */

p._checkDynamicLiteral = function () {
  var expression = this.expression
  if (expression && this.isLiteral) {
    var tokens = textParser.parse(expression)
    if (tokens) {
      var exp = textParser.tokensToExp(tokens)
      this.expression = this.vm.$get(exp)
      this._watcherExp = exp
      this._isDynamicLiteral = true
    }
  }
}

/**
 * Check if the directive is a function caller
 * and if the expression is a callable one. If both true,
 * we wrap up the expression and use it as the event
 * handler.
 *
 * e.g. v-on="click: a++"
 *
 * @return {Boolean}
 */

p._checkStatement = function () {
  var expression = this.expression
  if (
    expression && this.acceptStatement &&
    !expParser.pathTestRE.test(expression)
  ) {
    var fn = expParser.parse(expression).get
    var vm = this.vm
    var handler = function () {
      fn.call(vm, vm)
    }
    if (this.filters) {
      handler = _.applyFilters(
        handler,
        this.filters.read,
        vm
      )
    }
    this.update(handler)
    return true
  }
}

/**
 * Check for an attribute directive param, e.g. lazy
 *
 * @param {String} name
 * @return {String}
 */

p._checkParam = function (name) {
  var param = this.el.getAttribute(name)
  if (param !== null) {
    this.el.removeAttribute(name)
  }
  return param
}

/**
 * Teardown the watcher and call unbind.
 */

p._teardown = function () {
  if (this._bound) {
    if (this.unbind) {
      this.unbind()
    }
    var watcher = this._watcher
    if (watcher && watcher.active) {
      watcher.removeCb(this._update)
      if (!watcher.active) {
        this.vm._watchers[this.raw] = null
      }
    }
    this._bound = false
    this.vm = this.el = this._watcher = null
  }
}

/**
 * Set the corresponding value with the setter.
 * This should only be used in two-way directives
 * e.g. v-model.
 *
 * @param {*} value
 * @param {Boolean} lock - prevent wrtie triggering update.
 * @public
 */

p.set = function (value, lock) {
  if (this.twoWay) {
    if (lock) {
      this._locked = true
    }
    this._watcher.set(value)
    if (lock) {
      var self = this
      _.nextTick(function () {
        self._locked = false
      })
    }
  }
}

module.exports = Directive
},{"./config":14,"./parsers/expression":50,"./parsers/text":53,"./util":61,"./watcher":65}],16:[function(require,module,exports){
// xlink
var xlinkNS = 'http://www.w3.org/1999/xlink'
var xlinkRE = /^xlink:/

module.exports = {

  priority: 850,

  bind: function () {
    var name = this.arg
    this.update = xlinkRE.test(name)
      ? xlinkHandler
      : defaultHandler
  }

}

function defaultHandler (value) {
  if (value || value === 0) {
    this.el.setAttribute(this.arg, value)
  } else {
    this.el.removeAttribute(this.arg)
  }
}

function xlinkHandler (value) {
  if (value != null) {
    this.el.setAttributeNS(xlinkNS, this.arg, value)
  } else {
    this.el.removeAttributeNS(xlinkNS, 'href')
  }
}
},{}],17:[function(require,module,exports){
var _ = require('../util')
var addClass = _.addClass
var removeClass = _.removeClass

module.exports = function (value) {
  if (this.arg) {
    var method = value ? addClass : removeClass
    method(this.el, this.arg)
  } else {
    if (this.lastVal) {
      removeClass(this.el, this.lastVal)
    }
    if (value) {
      addClass(this.el, value)
      this.lastVal = value
    }
  }
}
},{"../util":61}],18:[function(require,module,exports){
var config = require('../config')

module.exports = {

  bind: function () {
    var el = this.el
    this.vm.$once('hook:compiled', function () {
      el.removeAttribute(config.prefix + 'cloak')
    })
  }

}
},{"../config":14}],19:[function(require,module,exports){
var _ = require('../util')
var templateParser = require('../parsers/template')

module.exports = {

  isLiteral: true,

  /**
   * Setup. Two possible usages:
   *
   * - static:
   *   v-component="comp"
   *
   * - dynamic:
   *   v-component="{{currentView}}"
   */

  bind: function () {
    if (!this.el.__vue__) {
      // create a ref anchor
      this.ref = document.createComment('v-component')
      _.replace(this.el, this.ref)
      // check keep-alive options.
      // If yes, instead of destroying the active vm when
      // hiding (v-if) or switching (dynamic literal) it,
      // we simply remove it from the DOM and save it in a
      // cache object, with its constructor id as the key.
      this.keepAlive = this._checkParam('keep-alive') != null
      // check ref
      this.refID = _.attr(this.el, 'ref')
      if (this.keepAlive) {
        this.cache = {}
      }
      // check inline-template
      if (this._checkParam('inline-template') !== null) {
        // extract inline template as a DocumentFragment
        this.template = _.extractContent(this.el, true)
      }
      // if static, build right now.
      if (!this._isDynamicLiteral) {
        this.resolveCtor(this.expression)
        var child = this.build()
        child.$before(this.ref)
        this.setCurrent(child)
      } else {
        // check dynamic component params
        this.readyEvent = this._checkParam('wait-for')
        this.transMode = this._checkParam('transition-mode')
      }
    } else {
      _.warn(
        'v-component="' + this.expression + '" cannot be ' +
        'used on an already mounted instance.'
      )
    }
  },

  /**
   * Resolve the component constructor to use when creating
   * the child vm.
   */

  resolveCtor: function (id) {
    this.ctorId = id
    this.Ctor = this.vm.$options.components[id]
    _.assertAsset(this.Ctor, 'component', id)
  },

  /**
   * Instantiate/insert a new child vm.
   * If keep alive and has cached instance, insert that
   * instance; otherwise build a new one and cache it.
   *
   * @return {Vue} - the created instance
   */

  build: function () {
    if (this.keepAlive) {
      var cached = this.cache[this.ctorId]
      if (cached) {
        return cached
      }
    }
    var vm = this.vm
    var el = templateParser.clone(this.el)
    if (this.Ctor) {
      var child = vm.$addChild({
        el: el,
        template: this.template,
        _asComponent: true
      }, this.Ctor)
      if (this.keepAlive) {
        this.cache[this.ctorId] = child
      }
      return child
    }
  },

  /**
   * Teardown the current child, but defers cleanup so
   * that we can separate the destroy and removal steps.
   */

  unbuild: function () {
    var child = this.childVM
    if (!child || this.keepAlive) {
      return
    }
    // the sole purpose of `deferCleanup` is so that we can
    // "deactivate" the vm right now and perform DOM removal
    // later.
    child.$destroy(false, true)
  },

  /**
   * Remove current destroyed child and manually do
   * the cleanup after removal.
   *
   * @param {Function} cb
   */

  remove: function (child, cb) {
    var keepAlive = this.keepAlive
    if (child) {
      child.$remove(function () {
        if (!keepAlive) child._cleanup()
        if (cb) cb()
      })
    } else if (cb) {
      cb()
    }
  },

  /**
   * Update callback for the dynamic literal scenario,
   * e.g. v-component="{{view}}"
   */

  update: function (value) {
    if (!value) {
      // just destroy and remove current
      this.unbuild()
      this.remove(this.childVM)
      this.unsetCurrent()
    } else {
      this.resolveCtor(value)
      this.unbuild()
      var newComponent = this.build()
      var self = this
      if (this.readyEvent) {
        newComponent.$once(this.readyEvent, function () {
          self.swapTo(newComponent)
        })
      } else {
        this.swapTo(newComponent)
      }
    }
  },

  /**
   * Actually swap the components, depending on the
   * transition mode. Defaults to simultaneous.
   *
   * @param {Vue} target
   */

  swapTo: function (target) {
    var self = this
    var current = this.childVM
    this.unsetCurrent()
    this.setCurrent(target)
    switch (self.transMode) {
      case 'in-out':
        target.$before(self.ref, function () {
          self.remove(current)
        })
        break
      case 'out-in':
        self.remove(current, function () {
          target.$before(self.ref)
        })
        break
      default:
        self.remove(current)
        target.$before(self.ref)
    }
  },

  /**
   * Set childVM and parent ref
   */
  
  setCurrent: function (child) {
    this.childVM = child
    var refID = child._refID || this.refID
    if (refID) {
      this.vm.$[refID] = child
    }
  },

  /**
   * Unset childVM and parent ref
   */

  unsetCurrent: function () {
    var child = this.childVM
    this.childVM = null
    var refID = (child && child._refID) || this.refID
    if (refID) {
      this.vm.$[refID] = null
    }
  },

  /**
   * Unbind.
   */

  unbind: function () {
    this.unbuild()
    // destroy all keep-alive cached instances
    if (this.cache) {
      for (var key in this.cache) {
        this.cache[key].$destroy()
      }
      this.cache = null
    }
  }

}
},{"../parsers/template":52,"../util":61}],20:[function(require,module,exports){
module.exports = {

  isLiteral: true,

  bind: function () {
    this.vm.$$[this.expression] = this.el
  },

  unbind: function () {
    delete this.vm.$$[this.expression]
  }
  
}
},{}],21:[function(require,module,exports){
var _ = require('../util')

module.exports = { 

  bind: function () {
    var child = this.el.__vue__
    if (!child || this.vm !== child.$parent) {
      _.warn(
        '`v-events` should only be used on a child component ' +
        'from the parent template.'
      )
      return
    }
    var method = this.vm[this.expression]
    if (!method) {
      _.warn(
        '`v-events` cannot find method "' + this.expression +
        '" on the parent instance.'
      )
    }
    child.$on(this.arg, method)
  }

  // when child is destroyed, all events are turned off,
  // so no need for unbind here.

}
},{"../util":61}],22:[function(require,module,exports){
var _ = require('../util')
var templateParser = require('../parsers/template')

module.exports = {

  bind: function () {
    // a comment node means this is a binding for
    // {{{ inline unescaped html }}}
    if (this.el.nodeType === 8) {
      // hold nodes
      this.nodes = []
    }
  },

  update: function (value) {
    value = _.toString(value)
    if (this.nodes) {
      this.swap(value)
    } else {
      this.el.innerHTML = value
    }
  },

  swap: function (value) {
    // remove old nodes
    var i = this.nodes.length
    while (i--) {
      _.remove(this.nodes[i])
    }
    // convert new value to a fragment
    // do not attempt to retrieve from id selector
    var frag = templateParser.parse(value, true, true)
    // save a reference to these nodes so we can remove later
    this.nodes = _.toArray(frag.childNodes)
    _.before(frag, this.el)
  }

}
},{"../parsers/template":52,"../util":61}],23:[function(require,module,exports){
var _ = require('../util')
var compile = require('../compiler/compile')
var templateParser = require('../parsers/template')
var transition = require('../transition')

module.exports = {

  bind: function () {
    var el = this.el
    if (!el.__vue__) {
      this.start = document.createComment('v-if-start')
      this.end = document.createComment('v-if-end')
      _.replace(el, this.end)
      _.before(this.start, this.end)

      // Note: content transclusion is not available for
      // <template> blocks
      if (el.tagName === 'TEMPLATE') {
        this.template = templateParser.parse(el, true)
      } else {
        this.template = document.createDocumentFragment()
        this.template.appendChild(templateParser.clone(el))
        this.checkContent()
      }
      // compile the nested partial
      this.linker = compile(
        this.template,
        this.vm.$options,
        true
      )
    } else {
      this.invalid = true
      _.warn(
        'v-if="' + this.expression + '" cannot be ' +
        'used on an already mounted instance.'
      )
    }
  },

  // check if there are any content nodes from parent.
  // these nodes are compiled by the parent and should
  // not be cloned during a re-compilation - otherwise the
  // parent directives bound to them will no longer work.
  // (see #736)
  checkContent: function () {
    var el = this.el
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i]
      // _isContent is a flag set in instance/compile
      // after the raw content has been compiled by parent
      if (node._isContent) {
        ;(this.contentNodes = this.contentNodes || []).push(node)
        ;(this.contentPositions = this.contentPositions || []).push(i)
      }
    }
    // keep track of any transcluded components contained within
    // the conditional block. we need to call attach/detach hooks
    // for them.
    this.transCpnts =
      this.vm._transCpnts &&
      this.vm._transCpnts.filter(function (c) {
        return el.contains(c.$el)
      })
  },

  update: function (value) {
    if (this.invalid) return
    if (value) {
      // avoid duplicate compiles, since update() can be
      // called with different truthy values
      if (!this.unlink) {
        var frag = templateParser.clone(this.template)
        // persist content nodes from parent.
        if (this.contentNodes) {
          var el = frag.childNodes[0]
          for (var i = 0, l = this.contentNodes.length; i < l; i++) {
            var node = this.contentNodes[i]
            var j = this.contentPositions[i]
            el.replaceChild(node, el.childNodes[j])
          }
        }
        this.compile(frag)
      }
    } else {
      this.teardown()
    }
  },

  // NOTE: this function is shared in v-partial
  compile: function (frag) {
    var vm = this.vm
    var originalChildLength = vm._children.length
    this.unlink = this.linker
      ? this.linker(vm, frag)
      : vm.$compile(frag)
    transition.blockAppend(frag, this.end, vm)
    this.children = vm._children.slice(originalChildLength)
    if (this.transCpnts) {
      this.children = this.children.concat(this.transCpnts)
    }
    if (this.children.length && _.inDoc(vm.$el)) {
      this.children.forEach(function (child) {
        child._callHook('attached')
      })
    }
  },

  // NOTE: this function is shared in v-partial
  teardown: function () {
    if (!this.unlink) return
    transition.blockRemove(this.start, this.end, this.vm)
    if (this.children && _.inDoc(this.vm.$el)) {
      this.children.forEach(function (child) {
        if (!child._isDestroyed) {
          child._callHook('detached')
        }
      })
    }
    this.unlink()
    this.unlink = null
  },

  // NOTE: this function is shared in v-partial
  unbind: function () {
    if (this.unlink) this.unlink()
  }

}
},{"../compiler/compile":12,"../parsers/template":52,"../transition":55,"../util":61}],24:[function(require,module,exports){
// manipulation directives
exports.text       = require('./text')
exports.html       = require('./html')
exports.attr       = require('./attr')
exports.show       = require('./show')
exports['class']   = require('./class')
exports.el         = require('./el')
exports.ref        = require('./ref')
exports.cloak      = require('./cloak')
exports.style      = require('./style')
exports.partial    = require('./partial')
exports.transition = require('./transition')

// event listener directives
exports.on         = require('./on')
exports.model      = require('./model')

// child vm directives
exports.component  = require('./component')
exports.repeat     = require('./repeat')
exports['if']      = require('./if')

// child vm communication directives
exports['with']    = require('./with')
exports.events     = require('./events')
},{"./attr":16,"./class":17,"./cloak":18,"./component":19,"./el":20,"./events":21,"./html":22,"./if":23,"./model":27,"./on":30,"./partial":31,"./ref":32,"./repeat":33,"./show":34,"./style":35,"./text":36,"./transition":37,"./with":38}],25:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    this.listener = function () {
      self.set(el.checked, true)
    }
    _.on(el, 'change', this.listener)
    if (el.checked) {
      this._initValue = el.checked
    }
  },

  update: function (value) {
    this.el.checked = !!value
  },

  unbind: function () {
    _.off(this.el, 'change', this.listener)
  }

}
},{"../../util":61}],26:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el

    // check params
    // - lazy: update model on "change" instead of "input"
    var lazy = this._checkParam('lazy') != null
    // - number: cast value into number when updating model.
    var number = this._checkParam('number') != null
    // - debounce: debounce the input listener
    var debounce = parseInt(this._checkParam('debounce'), 10)

    // handle composition events.
    // http://blog.evanyou.me/2014/01/03/composition-event/
    var cpLocked = false
    this.cpLock = function () {
      cpLocked = true
    }
    this.cpUnlock = function () {
      cpLocked = false
      // in IE11 the "compositionend" event fires AFTER
      // the "input" event, so the input handler is blocked
      // at the end... have to call it here.
      set()
    }
    _.on(el,'compositionstart', this.cpLock)
    _.on(el,'compositionend', this.cpUnlock)

    // shared setter
    function set () {
      self.set(
        number ? _.toNumber(el.value) : el.value,
        true
      )
    }

    // if the directive has filters, we need to
    // record cursor position and restore it after updating
    // the input with the filtered value.
    // also force update for type="range" inputs to enable
    // "lock in range" (see #506)
    var hasReadFilter = this.filters && this.filters.read
    this.listener = hasReadFilter || el.type === 'range'
      ? function textInputListener () {
          if (cpLocked) return
          var charsOffset
          // some HTML5 input types throw error here
          try {
            // record how many chars from the end of input
            // the cursor was at
            charsOffset = el.value.length - el.selectionStart
          } catch (e) {}
          // Fix IE10/11 infinite update cycle
          // https://github.com/yyx990803/vue/issues/592
          /* istanbul ignore if */
          if (charsOffset < 0) {
            return
          }
          set()
          _.nextTick(function () {
            // force a value update, because in
            // certain cases the write filters output the
            // same result for different input values, and
            // the Observer set events won't be triggered.
            var newVal = self._watcher.value
            self.update(newVal)
            if (charsOffset != null) {
              var cursorPos =
                _.toString(newVal).length - charsOffset
              el.setSelectionRange(cursorPos, cursorPos)
            }
          })
        }
      : function textInputListener () {
          if (cpLocked) return
          set()
        }

    if (debounce) {
      this.listener = _.debounce(this.listener, debounce)
    }
    this.event = lazy ? 'change' : 'input'
    // Support jQuery events, since jQuery.trigger() doesn't
    // trigger native events in some cases and some plugins
    // rely on $.trigger()
    // 
    // We want to make sure if a listener is attached using
    // jQuery, it is also removed with jQuery, that's why
    // we do the check for each directive instance and
    // store that check result on itself. This also allows
    // easier test coverage control by unsetting the global
    // jQuery variable in tests.
    this.hasjQuery = typeof jQuery === 'function'
    if (this.hasjQuery) {
      jQuery(el).on(this.event, this.listener)
    } else {
      _.on(el, this.event, this.listener)
    }

    // IE9 doesn't fire input event on backspace/del/cut
    if (!lazy && _.isIE9) {
      this.onCut = function () {
        _.nextTick(self.listener)
      }
      this.onDel = function (e) {
        if (e.keyCode === 46 || e.keyCode === 8) {
          self.listener()
        }
      }
      _.on(el, 'cut', this.onCut)
      _.on(el, 'keyup', this.onDel)
    }

    // set initial value if present
    if (
      el.hasAttribute('value') ||
      (el.tagName === 'TEXTAREA' && el.value.trim())
    ) {
      this._initValue = number
        ? _.toNumber(el.value)
        : el.value
    }
  },

  update: function (value) {
    this.el.value = _.toString(value)
  },

  unbind: function () {
    var el = this.el
    if (this.hasjQuery) {
      jQuery(el).off(this.event, this.listener)
    } else {
      _.off(el, this.event, this.listener)
    }
    _.off(el,'compositionstart', this.cpLock)
    _.off(el,'compositionend', this.cpUnlock)
    if (this.onCut) {
      _.off(el,'cut', this.onCut)
      _.off(el,'keyup', this.onDel)
    }
  }

}
},{"../../util":61}],27:[function(require,module,exports){
var _ = require('../../util')

var handlers = {
  _default: require('./default'),
  radio: require('./radio'),
  select: require('./select'),
  checkbox: require('./checkbox')
}

module.exports = {

  priority: 800,
  twoWay: true,
  handlers: handlers,

  /**
   * Possible elements:
   *   <select>
   *   <textarea>
   *   <input type="*">
   *     - text
   *     - checkbox
   *     - radio
   *     - number
   *     - TODO: more types may be supplied as a plugin
   */

  bind: function () {
    // friendly warning...
    var filters = this.filters
    if (filters && filters.read && !filters.write) {
      _.warn(
        'It seems you are using a read-only filter with ' +
        'v-model. You might want to use a two-way filter ' +
        'to ensure correct behavior.'
      )
    }
    var el = this.el
    var tag = el.tagName
    var handler
    if (tag === 'INPUT') {
      handler = handlers[el.type] || handlers._default
    } else if (tag === 'SELECT') {
      handler = handlers.select
    } else if (tag === 'TEXTAREA') {
      handler = handlers._default
    } else {
      _.warn("v-model doesn't support element type: " + tag)
      return
    }
    handler.bind.call(this)
    this.update = handler.update
    this.unbind = handler.unbind
  }

}
},{"../../util":61,"./checkbox":25,"./default":26,"./radio":28,"./select":29}],28:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    this.listener = function () {
      self.set(el.value, true)
    }
    _.on(el, 'change', this.listener)
    if (el.checked) {
      this._initValue = el.value
    }
  },

  update: function (value) {
    /* jshint eqeqeq: false */
    this.el.checked = value == this.el.value
  },

  unbind: function () {
    _.off(this.el, 'change', this.listener)
  }

}
},{"../../util":61}],29:[function(require,module,exports){
var _ = require('../../util')
var Watcher = require('../../watcher')
var dirParser = require('../../parsers/directive')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    // check options param
    var optionsParam = this._checkParam('options')
    if (optionsParam) {
      initOptions.call(this, optionsParam)
    }
    this.number = this._checkParam('number') != null
    this.multiple = el.hasAttribute('multiple')
    this.listener = function () {
      var value = self.multiple
        ? getMultiValue(el)
        : el.value
      value = self.number
        ? _.isArray(value)
          ? value.map(_.toNumber)
          : _.toNumber(value)
        : value
      self.set(value, true)
    }
    _.on(el, 'change', this.listener)
    checkInitialValue.call(this)
  },

  update: function (value) {
    /* jshint eqeqeq: false */
    var el = this.el
    el.selectedIndex = -1
    var multi = this.multiple && _.isArray(value)
    var options = el.options
    var i = options.length
    var option
    while (i--) {
      option = options[i]
      option.selected = multi
        ? indexOf(value, option.value) > -1
        : value == option.value
    }
  },

  unbind: function () {
    _.off(this.el, 'change', this.listener)
    if (this.optionWatcher) {
      this.optionWatcher.teardown()
    }
  }

}

/**
 * Initialize the option list from the param.
 *
 * @param {String} expression
 */

function initOptions (expression) {
  var self = this
  var descriptor = dirParser.parse(expression)[0]
  function optionUpdateWatcher (value) {
    if (_.isArray(value)) {
      self.el.innerHTML = ''
      buildOptions(self.el, value)
      if (self._watcher) {
        self.update(self._watcher.value)
      }
    } else {
      _.warn('Invalid options value for v-model: ' + value)
    }
  }
  this.optionWatcher = new Watcher(
    this.vm,
    descriptor.expression,
    optionUpdateWatcher,
    {
      deep: true,
      filters: _.resolveFilters(this.vm, descriptor.filters)
    }
  )
  // update with initial value
  optionUpdateWatcher(this.optionWatcher.value)
}

/**
 * Build up option elements. IE9 doesn't create options
 * when setting innerHTML on <select> elements, so we have
 * to use DOM API here.
 *
 * @param {Element} parent - a <select> or an <optgroup>
 * @param {Array} options
 */

function buildOptions (parent, options) {
  var op, el
  for (var i = 0, l = options.length; i < l; i++) {
    op = options[i]
    if (!op.options) {
      el = document.createElement('option')
      if (typeof op === 'string') {
        el.text = el.value = op
      } else {
        el.text = op.text
        el.value = op.value
      }
    } else {
      el = document.createElement('optgroup')
      el.label = op.label
      buildOptions(el, op.options)
    }
    parent.appendChild(el)
  }
}

/**
 * Check the initial value for selected options.
 */

function checkInitialValue () {
  var initValue
  var options = this.el.options
  for (var i = 0, l = options.length; i < l; i++) {
    if (options[i].hasAttribute('selected')) {
      if (this.multiple) {
        (initValue || (initValue = []))
          .push(options[i].value)
      } else {
        initValue = options[i].value
      }
    }
  }
  if (typeof initValue !== 'undefined') {
    this._initValue = this.number
      ? _.toNumber(initValue)
      : initValue
  }
}

/**
 * Helper to extract a value array for select[multiple]
 *
 * @param {SelectElement} el
 * @return {Array}
 */

function getMultiValue (el) {
  return Array.prototype.filter
    .call(el.options, filterSelected)
    .map(getOptionValue)
}

function filterSelected (op) {
  return op.selected
}

function getOptionValue (op) {
  return op.value || op.text
}

/**
 * Native Array.indexOf uses strict equal, but in this
 * case we need to match string/numbers with soft equal.
 *
 * @param {Array} arr
 * @param {*} val
 */

function indexOf (arr, val) {
  /* jshint eqeqeq: false */
  var i = arr.length
  while (i--) {
    if (arr[i] == val) return i
  }
  return -1
}
},{"../../parsers/directive":49,"../../util":61,"../../watcher":65}],30:[function(require,module,exports){
var _ = require('../util')

module.exports = {

  acceptStatement: true,
  priority: 700,

  bind: function () {
    // deal with iframes
    if (
      this.el.tagName === 'IFRAME' &&
      this.arg !== 'load'
    ) {
      var self = this
      this.iframeBind = function () {
        _.on(self.el.contentWindow, self.arg, self.handler)
      }
      _.on(this.el, 'load', this.iframeBind)
    }
  },

  update: function (handler) {
    if (typeof handler !== 'function') {
      _.warn(
        'Directive "v-on:' + this.expression + '" ' +
        'expects a function value.'
      )
      return
    }
    this.reset()
    var vm = this.vm
    this.handler = function (e) {
      e.targetVM = vm
      vm.$event = e
      var res = handler(e)
      vm.$event = null
      return res
    }
    if (this.iframeBind) {
      this.iframeBind()
    } else {
      _.on(this.el, this.arg, this.handler)
    }
  },

  reset: function () {
    var el = this.iframeBind
      ? this.el.contentWindow
      : this.el
    if (this.handler) {
      _.off(el, this.arg, this.handler)
    }
  },

  unbind: function () {
    this.reset()
    _.off(this.el, 'load', this.iframeBind)
  }
}
},{"../util":61}],31:[function(require,module,exports){
var _ = require('../util')
var templateParser = require('../parsers/template')
var vIf = require('./if')

module.exports = {

  isLiteral: true,

  // same logic reuse from v-if
  compile: vIf.compile,
  teardown: vIf.teardown,
  unbind: vIf.unbind,

  bind: function () {
    var el = this.el
    this.start = document.createComment('v-partial-start')
    this.end = document.createComment('v-partial-end')
    if (el.nodeType !== 8) {
      el.innerHTML = ''
    }
    if (el.tagName === 'TEMPLATE' || el.nodeType === 8) {
      _.replace(el, this.end)
    } else {
      el.appendChild(this.end)
    }
    _.before(this.start, this.end)
    if (!this._isDynamicLiteral) {
      this.insert(this.expression)
    }
  },

  update: function (id) {
    this.teardown()
    this.insert(id)
  },

  insert: function (id) {
    var partial = this.vm.$options.partials[id]
    _.assertAsset(partial, 'partial', id)
    if (partial) {
      this.compile(templateParser.parse(partial, true))
    }
  }

}
},{"../parsers/template":52,"../util":61,"./if":23}],32:[function(require,module,exports){
var _ = require('../util')

module.exports = {

  isLiteral: true,

  bind: function () {
    var vm = this.el.__vue__
    if (!vm) {
      _.warn(
        'v-ref should only be used on a component root element.'
      )
      return
    }
    // If we get here, it means this is a `v-ref` on a
    // child, because parent scope `v-ref` is stripped in
    // `v-component` already. So we just record our own ref
    // here - it will overwrite parent ref in `v-component`,
    // if any.
    vm._refID = this.expression
  }
  
}
},{"../util":61}],33:[function(require,module,exports){
var _ = require('../util')
var isObject = _.isObject
var isPlainObject = _.isPlainObject
var textParser = require('../parsers/text')
var expParser = require('../parsers/expression')
var templateParser = require('../parsers/template')
var compile = require('../compiler/compile')
var transclude = require('../compiler/transclude')
var mergeOptions = require('../util/merge-option')
var uid = 0

module.exports = {

  /**
   * Setup.
   */

  bind: function () {
    // uid as a cache identifier
    this.id = '__v_repeat_' + (++uid)
    // we need to insert the objToArray converter
    // as the first read filter, because it has to be invoked
    // before any user filters. (can't do it in `update`)
    if (!this.filters) {
      this.filters = {}
    }
    // add the object -> array convert filter
    var objectConverter = _.bind(objToArray, this)
    if (!this.filters.read) {
      this.filters.read = [objectConverter]
    } else {
      this.filters.read.unshift(objectConverter)
    }
    // setup ref node
    this.ref = document.createComment('v-repeat')
    _.replace(this.el, this.ref)
    // check if this is a block repeat
    this.template = this.el.tagName === 'TEMPLATE'
      ? templateParser.parse(this.el, true)
      : this.el
    // check other directives that need to be handled
    // at v-repeat level
    this.checkIf()
    this.checkRef()
    this.checkComponent()
    // check for trackby param
    this.idKey =
      this._checkParam('track-by') ||
      this._checkParam('trackby') // 0.11.0 compat
    this.cache = Object.create(null)
  },

  /**
   * Warn against v-if usage.
   */

  checkIf: function () {
    if (_.attr(this.el, 'if') !== null) {
      _.warn(
        'Don\'t use v-if with v-repeat. ' +
        'Use v-show or the "filterBy" filter instead.'
      )
    }
  },

  /**
   * Check if v-ref/ v-el is also present.
   */

  checkRef: function () {
    var refID = _.attr(this.el, 'ref')
    this.refID = refID
      ? this.vm.$interpolate(refID)
      : null
    var elId = _.attr(this.el, 'el')
    this.elId = elId
      ? this.vm.$interpolate(elId)
      : null
  },

  /**
   * Check the component constructor to use for repeated
   * instances. If static we resolve it now, otherwise it
   * needs to be resolved at build time with actual data.
   */

  checkComponent: function () {
    var id = _.attr(this.el, 'component')
    var options = this.vm.$options
    if (!id) {
      // default constructor
      this.Ctor = _.Vue
      // inline repeats should inherit
      this.inherit = true
      // important: transclude with no options, just
      // to ensure block start and block end
      this.template = transclude(this.template)
      this._linkFn = compile(this.template, options)
    } else {
      this.asComponent = true
      // check inline-template
      if (this._checkParam('inline-template') !== null) {
        // extract inline template as a DocumentFragment
        this.inlineTempalte = _.extractContent(this.el, true)
      }
      var tokens = textParser.parse(id)
      if (!tokens) { // static component
        var Ctor = this.Ctor = options.components[id]
        _.assertAsset(Ctor, 'component', id)
        // If there's no parent scope directives and no
        // content to be transcluded, we can optimize the
        // rendering by pre-transcluding + compiling here
        // and provide a link function to every instance.
        if (!this.el.hasChildNodes() &&
            !this.el.hasAttributes()) {
          // merge an empty object with owner vm as parent
          // so child vms can access parent assets.
          var merged = mergeOptions(Ctor.options, {}, {
            $parent: this.vm
          })
          merged.template = this.inlineTempalte || merged.template
          this.template = transclude(this.template, merged)
          this._linkFn = compile(this.template, merged, false, true)
        }
      } else {
        // to be resolved later
        var ctorExp = textParser.tokensToExp(tokens)
        this.ctorGetter = expParser.parse(ctorExp).get
      }
    }
  },

  /**
   * Update.
   * This is called whenever the Array mutates.
   *
   * @param {Array|Number|String} data
   */

  update: function (data) {
    data = data || []
    var type = typeof data
    if (type === 'number') {
      data = range(data)
    } else if (type === 'string') {
      data = _.toArray(data)
    }
    this.vms = this.diff(data, this.vms)
    // update v-ref
    if (this.refID) {
      this.vm.$[this.refID] = this.vms
    }
    if (this.elId) {
      this.vm.$$[this.elId] = this.vms.map(function (vm) {
        return vm.$el
      })
    }
  },

  /**
   * Diff, based on new data and old data, determine the
   * minimum amount of DOM manipulations needed to make the
   * DOM reflect the new data Array.
   *
   * The algorithm diffs the new data Array by storing a
   * hidden reference to an owner vm instance on previously
   * seen data. This allows us to achieve O(n) which is
   * better than a levenshtein distance based algorithm,
   * which is O(m * n).
   *
   * @param {Array} data
   * @param {Array} oldVms
   * @return {Array}
   */

  diff: function (data, oldVms) {
    var idKey = this.idKey
    var converted = this.converted
    var ref = this.ref
    var alias = this.arg
    var init = !oldVms
    var vms = new Array(data.length)
    var obj, raw, vm, i, l
    // First pass, go through the new Array and fill up
    // the new vms array. If a piece of data has a cached
    // instance for it, we reuse it. Otherwise build a new
    // instance.
    for (i = 0, l = data.length; i < l; i++) {
      obj = data[i]
      raw = converted ? obj.$value : obj
      vm = !init && this.getVm(raw)
      if (vm) { // reusable instance
        vm._reused = true
        vm.$index = i // update $index
        if (converted) {
          vm.$key = obj.$key // update $key
        }
        if (idKey) { // swap track by id data
          if (alias) {
            vm[alias] = raw
          } else {
            vm._setData(raw)
          }
        }
      } else { // new instance
        vm = this.build(obj, i, true)
        vm._new = true
        vm._reused = false
      }
      vms[i] = vm
      // insert if this is first run
      if (init) {
        vm.$before(ref)
      }
    }
    // if this is the first run, we're done.
    if (init) {
      return vms
    }
    // Second pass, go through the old vm instances and
    // destroy those who are not reused (and remove them
    // from cache)
    for (i = 0, l = oldVms.length; i < l; i++) {
      vm = oldVms[i]
      if (!vm._reused) {
        this.uncacheVm(vm)
        vm.$destroy(true)
      }
    }
    // final pass, move/insert new instances into the
    // right place. We're going in reverse here because
    // insertBefore relies on the next sibling to be
    // resolved.
    var targetNext, currentNext
    i = vms.length
    while (i--) {
      vm = vms[i]
      // this is the vm that we should be in front of
      targetNext = vms[i + 1]
      if (!targetNext) {
        // This is the last item. If it's reused then
        // everything else will eventually be in the right
        // place, so no need to touch it. Otherwise, insert
        // it.
        if (!vm._reused) {
          vm.$before(ref)
        }
      } else {
        // make sure to insert before the comment node if
        // the vms are block instances
        var nextEl = targetNext._blockStart || targetNext.$el
        if (vm._reused) {
          // this is the vm we are actually in front of
          currentNext = findNextVm(vm, ref)
          // we only need to move if we are not in the right
          // place already.
          if (currentNext !== targetNext) {
            vm.$before(nextEl, null, false)
          }
        } else {
          // new instance, insert to existing next
          vm.$before(nextEl)
        }
      }
      vm._new = false
      vm._reused = false
    }
    return vms
  },

  /**
   * Build a new instance and cache it.
   *
   * @param {Object} data
   * @param {Number} index
   * @param {Boolean} needCache
   */

  build: function (data, index, needCache) {
    var original = data
    var meta = { $index: index }
    if (this.converted) {
      meta.$key = original.$key
    }
    var raw = this.converted ? data.$value : data
    var alias = this.arg
    var hasAlias = !isObject(raw) || !isPlainObject(data) || alias
    // wrap the raw data with alias
    data = hasAlias ? {} : raw
    if (alias) {
      data[alias] = raw
    } else if (hasAlias) {
      meta.$value = raw
    }
    // resolve constructor
    var Ctor = this.Ctor || this.resolveCtor(data, meta)
    var vm = this.vm.$addChild({
      el: templateParser.clone(this.template),
      _asComponent: this.asComponent,
      _linkFn: this._linkFn,
      _meta: meta,
      data: data,
      inherit: this.inherit,
      template: this.inlineTempalte
    }, Ctor)
    // flag this instance as a repeat instance
    // so that we can skip it in vm._digest
    vm._repeat = true
    // cache instance
    if (needCache) {
      this.cacheVm(raw, vm)
    }
    // sync back changes for $value, particularly for
    // two-way bindings of primitive values
    var self = this
    vm.$watch('$value', function (val) {
      if (self.converted) {
        self.rawValue[vm.$key] = val
      } else {
        self.rawValue.$set(vm.$index, val)
      }
    })
    return vm
  },

  /**
   * Resolve a contructor to use for an instance.
   * The tricky part here is that there could be dynamic
   * components depending on instance data.
   *
   * @param {Object} data
   * @param {Object} meta
   * @return {Function}
   */

  resolveCtor: function (data, meta) {
    // create a temporary context object and copy data
    // and meta properties onto it.
    // use _.define to avoid accidentally overwriting scope
    // properties.
    var context = Object.create(this.vm)
    var key
    for (key in data) {
      _.define(context, key, data[key])
    }
    for (key in meta) {
      _.define(context, key, meta[key])
    }
    var id = this.ctorGetter.call(context, context)
    var Ctor = this.vm.$options.components[id]
    _.assertAsset(Ctor, 'component', id)
    return Ctor
  },

  /**
   * Unbind, teardown everything
   */

  unbind: function () {
    if (this.refID) {
      this.vm.$[this.refID] = null
    }
    if (this.vms) {
      var i = this.vms.length
      var vm
      while (i--) {
        vm = this.vms[i]
        this.uncacheVm(vm)
        vm.$destroy()
      }
    }
  },

  /**
   * Cache a vm instance based on its data.
   *
   * If the data is an object, we save the vm's reference on
   * the data object as a hidden property. Otherwise we
   * cache them in an object and for each primitive value
   * there is an array in case there are duplicates.
   *
   * @param {Object} data
   * @param {Vue} vm
   */

  cacheVm: function (data, vm) {
    var idKey = this.idKey
    var cache = this.cache
    var id
    if (idKey) {
      id = data[idKey]
      if (!cache[id]) {
        cache[id] = vm
      } else {
        _.warn('Duplicate track-by key in v-repeat: ' + id)
      }
    } else if (isObject(data)) {
      id = this.id
      if (data.hasOwnProperty(id)) {
        if (data[id] === null) {
          data[id] = vm
        } else {
          _.warn(
            'Duplicate objects are not supported in v-repeat ' +
            'when using components or transitions.'
          )
        }
      } else {
        _.define(data, this.id, vm)
      }
    } else {
      if (!cache[data]) {
        cache[data] = [vm]
      } else {
        cache[data].push(vm)
      }
    }
    vm._raw = data
  },

  /**
   * Try to get a cached instance from a piece of data.
   *
   * @param {Object} data
   * @return {Vue|undefined}
   */

  getVm: function (data) {
    if (this.idKey) {
      return this.cache[data[this.idKey]]
    } else if (isObject(data)) {
      return data[this.id]
    } else {
      var cached = this.cache[data]
      if (cached) {
        var i = 0
        var vm = cached[i]
        // since duplicated vm instances might be a reused
        // one OR a newly created one, we need to return the
        // first instance that is neither of these.
        while (vm && (vm._reused || vm._new)) {
          vm = cached[++i]
        }
        return vm
      }
    }
  },

  /**
   * Delete a cached vm instance.
   *
   * @param {Vue} vm
   */

  uncacheVm: function (vm) {
    var data = vm._raw
    if (this.idKey) {
      this.cache[data[this.idKey]] = null
    } else if (isObject(data)) {
      data[this.id] = null
      vm._raw = null
    } else {
      this.cache[data].pop()
    }
  }

}

/**
 * Helper to find the next element that is an instance
 * root node. This is necessary because a destroyed vm's
 * element could still be lingering in the DOM before its
 * leaving transition finishes, but its __vue__ reference
 * should have been removed so we can skip them.
 *
 * @param {Vue} vm
 * @param {CommentNode} ref
 * @return {Vue}
 */

function findNextVm (vm, ref) {
  var el = (vm._blockEnd || vm.$el).nextSibling
  while (!el.__vue__ && el !== ref) {
    el = el.nextSibling
  }
  return el.__vue__
}

/**
 * Attempt to convert non-Array objects to array.
 * This is the default filter installed to every v-repeat
 * directive.
 *
 * It will be called with **the directive** as `this`
 * context so that we can mark the repeat array as converted
 * from an object.
 *
 * @param {*} obj
 * @return {Array}
 * @private
 */

function objToArray (obj) {
  // regardless of type, store the un-filtered raw value.
  this.rawValue = obj
  if (!isPlainObject(obj)) {
    return obj
  }
  var keys = Object.keys(obj)
  var i = keys.length
  var res = new Array(i)
  var key
  while (i--) {
    key = keys[i]
    res[i] = {
      $key: key,
      $value: obj[key]
    }
  }
  // `this` points to the repeat directive instance
  this.converted = true
  return res
}

/**
 * Create a range array from given number.
 *
 * @param {Number} n
 * @return {Array}
 */

function range (n) {
  var i = -1
  var ret = new Array(n)
  while (++i < n) {
    ret[i] = i
  }
  return ret
}
},{"../compiler/compile":12,"../compiler/transclude":13,"../parsers/expression":50,"../parsers/template":52,"../parsers/text":53,"../util":61,"../util/merge-option":63}],34:[function(require,module,exports){
var transition = require('../transition')

module.exports = function (value) {
  var el = this.el
  transition.apply(el, value ? 1 : -1, function () {
    el.style.display = value ? '' : 'none'
  }, this.vm)
}
},{"../transition":55}],35:[function(require,module,exports){
var _ = require('../util')
var prefixes = ['-webkit-', '-moz-', '-ms-']
var camelPrefixes = ['Webkit', 'Moz', 'ms']
var importantRE = /!important;?$/
var camelRE = /([a-z])([A-Z])/g
var testEl = null
var propCache = {}

module.exports = {

  deep: true,

  update: function (value) {
    if (this.arg) {
      this.setProp(this.arg, value)
    } else {
      if (typeof value === 'object') {
        // cache object styles so that only changed props
        // are actually updated.
        if (!this.cache) this.cache = {}
        for (var prop in value) {
          this.setProp(prop, value[prop])
          /* jshint eqeqeq: false */
          if (value[prop] != this.cache[prop]) {
            this.cache[prop] = value[prop]
            this.setProp(prop, value[prop])
          }
        }
      } else {
        this.el.style.cssText = value
      }
    }
  },

  setProp: function (prop, value) {
    prop = normalize(prop)
    if (!prop) return // unsupported prop
    // cast possible numbers/booleans into strings
    if (value != null) value += ''
    if (value) {
      var isImportant = importantRE.test(value)
        ? 'important'
        : ''
      if (isImportant) {
        value = value.replace(importantRE, '').trim()
      }
      this.el.style.setProperty(prop, value, isImportant)
    } else {
      this.el.style.removeProperty(prop)
    }
  }

}

/**
 * Normalize a CSS property name.
 * - cache result
 * - auto prefix
 * - camelCase -> dash-case
 *
 * @param {String} prop
 * @return {String}
 */

function normalize (prop) {
  if (propCache[prop]) {
    return propCache[prop]
  }
  var res = prefix(prop)
  propCache[prop] = propCache[res] = res
  return res
}

/**
 * Auto detect the appropriate prefix for a CSS property.
 * https://gist.github.com/paulirish/523692
 *
 * @param {String} prop
 * @return {String}
 */

function prefix (prop) {
  prop = prop.replace(camelRE, '$1-$2').toLowerCase()
  var camel = _.camelize(prop)
  var upper = camel.charAt(0).toUpperCase() + camel.slice(1)
  if (!testEl) {
    testEl = document.createElement('div')
  }
  if (camel in testEl.style) {
    return prop
  }
  var i = prefixes.length
  var prefixed
  while (i--) {
    prefixed = camelPrefixes[i] + upper
    if (prefixed in testEl.style) {
      return prefixes[i] + prop
    }
  }
}
},{"../util":61}],36:[function(require,module,exports){
var _ = require('../util')

module.exports = {

  bind: function () {
    this.attr = this.el.nodeType === 3
      ? 'nodeValue'
      : 'textContent'
  },

  update: function (value) {
    this.el[this.attr] = _.toString(value)
  }
  
}
},{"../util":61}],37:[function(require,module,exports){
module.exports = {

  priority: 1000,
  isLiteral: true,

  bind: function () {
    this.el.__v_trans = {
      id: this.expression,
      // resolve the custom transition functions now
      fns: this.vm.$options.transitions[this.expression]
    }
  }

}
},{}],38:[function(require,module,exports){
var _ = require('../util')
var Watcher = require('../watcher')

module.exports = {

  priority: 900,

  bind: function () {

    var child = this.vm
    var parent = child.$parent
    var childKey = this.arg || '$data'
    var parentKey = this.expression

    if (this.el !== child.$el) {
      _.warn(
        'v-with can only be used on instance root elements.'
      )
    } else if (!parent) {
      _.warn(
        'v-with must be used on an instance with a parent.'
      )
    } else {

      // simple lock to avoid circular updates.
      // without this it would stabilize too, but this makes
      // sure it doesn't cause other watchers to re-evaluate.
      var locked = false
      var lock = function () {
        locked = true
        _.nextTick(unlock)
      }
      var unlock = function () {
        locked = false
      }

      this.parentWatcher = new Watcher(
        parent,
        parentKey,
        function (val) {
          if (!locked) {
            lock()
            child.$set(childKey, val)
          }
        }
      )
      
      // set the child initial value first, before setting
      // up the child watcher to avoid triggering it
      // immediately.
      child.$set(childKey, this.parentWatcher.value)

      this.childWatcher = new Watcher(
        child,
        childKey,
        function (val) {
          if (!locked) {
            lock()
            parent.$set(parentKey, val)
          }
        }
      )
    }
  },

  unbind: function () {
    if (this.parentWatcher) {
      this.parentWatcher.teardown()
      this.childWatcher.teardown()
    }
  }

}
},{"../util":61,"../watcher":65}],39:[function(require,module,exports){
var _ = require('../util')
var Path = require('../parsers/path')

/**
 * Filter filter for v-repeat
 *
 * @param {String} searchKey
 * @param {String} [delimiter]
 * @param {String} dataKey
 */

exports.filterBy = function (arr, searchKey, delimiter, dataKey) {
  // allow optional `in` delimiter
  // because why not
  if (delimiter && delimiter !== 'in') {
    dataKey = delimiter
  }
  // get the search string
  var search =
    _.stripQuotes(searchKey) ||
    this.$get(searchKey)
  if (!search) {
    return arr
  }
  search = ('' + search).toLowerCase()
  // get the optional dataKey
  dataKey =
    dataKey &&
    (_.stripQuotes(dataKey) || this.$get(dataKey))
  return arr.filter(function (item) {
    return dataKey
      ? contains(Path.get(item, dataKey), search)
      : contains(item, search)
  })
}

/**
 * Filter filter for v-repeat
 *
 * @param {String} sortKey
 * @param {String} reverseKey
 */

exports.orderBy = function (arr, sortKey, reverseKey) {
  var key =
    _.stripQuotes(sortKey) ||
    this.$get(sortKey)
  if (!key) {
    return arr
  }
  var order = 1
  if (reverseKey) {
    if (reverseKey === '-1') {
      order = -1
    } else if (reverseKey.charCodeAt(0) === 0x21) { // !
      reverseKey = reverseKey.slice(1)
      order = this.$get(reverseKey) ? 1 : -1
    } else {
      order = this.$get(reverseKey) ? -1 : 1
    }
  }
  // sort on a copy to avoid mutating original array
  return arr.slice().sort(function (a, b) {
    a = _.isObject(a) ? Path.get(a, key) : a
    b = _.isObject(b) ? Path.get(b, key) : b
    return a === b ? 0 : a > b ? order : -order
  })
}

/**
 * String contain helper
 *
 * @param {*} val
 * @param {String} search
 */

function contains (val, search) {
  if (_.isObject(val)) {
    for (var key in val) {
      if (contains(val[key], search)) {
        return true
      }
    }
  } else if (val != null) {
    return val.toString().toLowerCase().indexOf(search) > -1
  }
}
},{"../parsers/path":51,"../util":61}],40:[function(require,module,exports){
var _ = require('../util')

/**
 * Stringify value.
 *
 * @param {Number} indent
 */

exports.json = {
  read: function (value, indent) {
    return typeof value === 'string'
      ? value
      : JSON.stringify(value, null, Number(indent) || 2)
  },
  write: function (value) {
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }
}

/**
 * 'abc' => 'Abc'
 */

exports.capitalize = function (value) {
  if (!value && value !== 0) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * 'abc' => 'ABC'
 */

exports.uppercase = function (value) {
  return (value || value === 0)
    ? value.toString().toUpperCase()
    : ''
}

/**
 * 'AbC' => 'abc'
 */

exports.lowercase = function (value) {
  return (value || value === 0)
    ? value.toString().toLowerCase()
    : ''
}

/**
 * 12345 => $12,345.00
 *
 * @param {String} sign
 */

var digitsRE = /(\d{3})(?=\d)/g

exports.currency = function (value, sign) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  sign = sign || '$'
  var s = Math.floor(Math.abs(value)).toString(),
    i = s.length % 3,
    h = i > 0
      ? (s.slice(0, i) + (s.length > 3 ? ',' : ''))
      : '',
    v = Math.abs(parseInt((value * 100) % 100, 10)),
    f = '.' + (v < 10 ? ('0' + v) : v)
  return (value < 0 ? '-' : '') +
    sign + h + s.slice(i).replace(digitsRE, '$1,') + f
}

/**
 * 'item' => 'items'
 *
 * @params
 *  an array of strings corresponding to
 *  the single, double, triple ... forms of the word to
 *  be pluralized. When the number to be pluralized
 *  exceeds the length of the args, it will use the last
 *  entry in the array.
 *
 *  e.g. ['single', 'double', 'triple', 'multiple']
 */

exports.pluralize = function (value) {
  var args = _.toArray(arguments, 1)
  return args.length > 1
    ? (args[value % 10 - 1] || args[args.length - 1])
    : (args[0] + (value === 1 ? '' : 's'))
}

/**
 * A special filter that takes a handler function,
 * wraps it so it only gets triggered on specific
 * keypresses. v-on only.
 *
 * @param {String} key
 */

var keyCodes = {
  enter    : 13,
  tab      : 9,
  'delete' : 46,
  up       : 38,
  left     : 37,
  right    : 39,
  down     : 40,
  esc      : 27
}

exports.key = function (handler, key) {
  if (!handler) return
  var code = keyCodes[key]
  if (!code) {
    code = parseInt(key, 10)
  }
  return function (e) {
    if (e.keyCode === code) {
      return handler.call(this, e)
    }
  }
}

// expose keycode hash
exports.key.keyCodes = keyCodes

/**
 * Install special array filters
 */

_.extend(exports, require('./array-filters'))

},{"../util":61,"./array-filters":39}],41:[function(require,module,exports){
var _ = require('../util')
var Directive = require('../directive')
var compile = require('../compiler/compile')
var transclude = require('../compiler/transclude')

/**
 * Transclude, compile and link element.
 *
 * If a pre-compiled linker is available, that means the
 * passed in element will be pre-transcluded and compiled
 * as well - all we need to do is to call the linker.
 *
 * Otherwise we need to call transclude/compile/link here.
 *
 * @param {Element} el
 * @return {Element}
 */

exports._compile = function (el) {
  var options = this.$options
  var parent = options._parent
  if (options._linkFn) {
    this._initElement(el)
    options._linkFn(this, el)
  } else {
    var raw = el
    if (options._asComponent) {
      // separate container element and content
      var content = options._content = _.extractContent(raw)
      // create two separate linekrs for container and content
      var parentOptions = parent.$options
      
      // hack: we need to skip the paramAttributes for this
      // child instance when compiling its parent container
      // linker. there could be a better way to do this.
      parentOptions._skipAttrs = options.paramAttributes
      var containerLinkFn =
        compile(raw, parentOptions, true, true)
      parentOptions._skipAttrs = null

      if (content) {
        var ol = parent._children.length
        var contentLinkFn =
          compile(content, parentOptions, true)
        // call content linker now, before transclusion
        this._contentUnlinkFn = contentLinkFn(parent, content)
        // mark all compiled nodes as transcluded, so that
        // directives that do partial compilation, e.g. v-if
        // and v-partial can detect them and persist them
        // through re-compilations.
        for (var i = 0; i < content.childNodes.length; i++) {
          content.childNodes[i]._isContent = true
        }
        this._transCpnts = parent._children.slice(ol)
      }
      // tranclude, this possibly replaces original
      el = transclude(el, options)
      this._initElement(el)
      // now call the container linker on the resolved el
      this._containerUnlinkFn = containerLinkFn(parent, el)
    } else {
      // simply transclude
      el = transclude(el, options)
      this._initElement(el)
    }
    var linkFn = compile(el, options)
    linkFn(this, el)
    if (options.replace) {
      _.replace(raw, el)
    }
  }
  return el
}

/**
 * Initialize instance element. Called in the public
 * $mount() method.
 *
 * @param {Element} el
 */

exports._initElement = function (el) {
  if (el instanceof DocumentFragment) {
    this._isBlock = true
    this._blockStart = el.firstChild
    this.$el = el.childNodes[1]
    this._blockEnd = el.lastChild
    this._blockFragment = el
  } else {
    this.$el = el
  }
  this.$el.__vue__ = this
  this._callHook('beforeCompile')
}

/**
 * Create and bind a directive to an element.
 *
 * @param {String} name - directive name
 * @param {Node} node   - target node
 * @param {Object} desc - parsed directive descriptor
 * @param {Object} def  - directive definition object
 */

exports._bindDir = function (name, node, desc, def) {
  this._directives.push(
    new Directive(name, node, this, desc, def)
  )
}

/**
 * Teardown an instance, unobserves the data, unbind all the
 * directives, turn off all the event listeners, etc.
 *
 * @param {Boolean} remove - whether to remove the DOM node.
 * @param {Boolean} deferCleanup - if true, defer cleanup to
 *                                 be called later
 */

exports._destroy = function (remove, deferCleanup) {
  if (this._isBeingDestroyed) {
    return
  }
  this._callHook('beforeDestroy')
  this._isBeingDestroyed = true
  var i
  // remove self from parent. only necessary
  // if parent is not being destroyed as well.
  var parent = this.$parent
  if (parent && !parent._isBeingDestroyed) {
    i = parent._children.indexOf(this)
    parent._children.splice(i, 1)
  }
  // destroy all children.
  i = this._children.length
  while (i--) {
    this._children[i].$destroy()
  }
  // teardown parent linkers
  if (this._containerUnlinkFn) {
    this._containerUnlinkFn()
  }
  if (this._contentUnlinkFn) {
    this._contentUnlinkFn()
  }
  // teardown all directives. this also tearsdown all
  // directive-owned watchers. intentionally check for
  // directives array length on every loop since directives
  // that manages partial compilation can splice ones out
  for (i = 0; i < this._directives.length; i++) {
    this._directives[i]._teardown()
  }
  // teardown all user watchers.
  var watcher
  for (i in this._userWatchers) {
    watcher = this._userWatchers[i]
    if (watcher) {
      watcher.teardown()
    }
  }
  // remove reference to self on $el
  if (this.$el) {
    this.$el.__vue__ = null
  }
  // remove DOM element
  var self = this
  if (remove && this.$el) {
    this.$remove(function () {
      self._cleanup()
    })
  } else if (!deferCleanup) {
    this._cleanup()
  }
}

/**
 * Clean up to ensure garbage collection.
 * This is called after the leave transition if there
 * is any.
 */

exports._cleanup = function () {
  // remove reference from data ob
  this._data.__ob__.removeVm(this)
  this._data =
  this._watchers =
  this._userWatchers =
  this._watcherList =
  this.$el =
  this.$parent =
  this.$root =
  this._children =
  this._transCpnts =
  this._directives = null
  // call the last hook...
  this._isDestroyed = true
  this._callHook('destroyed')
  // turn off all instance listeners.
  this.$off()
}
},{"../compiler/compile":12,"../compiler/transclude":13,"../directive":15,"../util":61}],42:[function(require,module,exports){
var _ = require('../util')
var inDoc = _.inDoc

/**
 * Setup the instance's option events & watchers.
 * If the value is a string, we pull it from the
 * instance's methods by name.
 */

exports._initEvents = function () {
  var options = this.$options
  registerCallbacks(this, '$on', options.events)
  registerCallbacks(this, '$watch', options.watch)
}

/**
 * Register callbacks for option events and watchers.
 *
 * @param {Vue} vm
 * @param {String} action
 * @param {Object} hash
 */

function registerCallbacks (vm, action, hash) {
  if (!hash) return
  var handlers, key, i, j
  for (key in hash) {
    handlers = hash[key]
    if (_.isArray(handlers)) {
      for (i = 0, j = handlers.length; i < j; i++) {
        register(vm, action, key, handlers[i])
      }
    } else {
      register(vm, action, key, handlers)
    }
  }
}

/**
 * Helper to register an event/watch callback.
 *
 * @param {Vue} vm
 * @param {String} action
 * @param {String} key
 * @param {*} handler
 */

function register (vm, action, key, handler) {
  var type = typeof handler
  if (type === 'function') {
    vm[action](key, handler)
  } else if (type === 'string') {
    var methods = vm.$options.methods
    var method = methods && methods[handler]
    if (method) {
      vm[action](key, method)
    } else {
      _.warn(
        'Unknown method: "' + handler + '" when ' +
        'registering callback for ' + action +
        ': "' + key + '".'
      )
    }
  }
}

/**
 * Setup recursive attached/detached calls
 */

exports._initDOMHooks = function () {
  this.$on('hook:attached', onAttached)
  this.$on('hook:detached', onDetached)
}

/**
 * Callback to recursively call attached hook on children
 */

function onAttached () {
  this._isAttached = true
  this._children.forEach(callAttach)
  if (this._transCpnts) {
    this._transCpnts.forEach(callAttach)
  }
}

/**
 * Iterator to call attached hook
 * 
 * @param {Vue} child
 */

function callAttach (child) {
  if (!child._isAttached && inDoc(child.$el)) {
    child._callHook('attached')
  }
}

/**
 * Callback to recursively call detached hook on children
 */

function onDetached () {
  this._isAttached = false
  this._children.forEach(callDetach)
  if (this._transCpnts) {
    this._transCpnts.forEach(callDetach)
  }
}

/**
 * Iterator to call detached hook
 * 
 * @param {Vue} child
 */

function callDetach (child) {
  if (child._isAttached && !inDoc(child.$el)) {
    child._callHook('detached')
  }
}

/**
 * Trigger all handlers for a hook
 *
 * @param {String} hook
 */

exports._callHook = function (hook) {
  var handlers = this.$options[hook]
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      handlers[i].call(this)
    }
  }
  this.$emit('hook:' + hook)
}
},{"../util":61}],43:[function(require,module,exports){
var mergeOptions = require('../util/merge-option')

/**
 * The main init sequence. This is called for every
 * instance, including ones that are created from extended
 * constructors.
 *
 * @param {Object} options - this options object should be
 *                           the result of merging class
 *                           options and the options passed
 *                           in to the constructor.
 */

exports._init = function (options) {

  options = options || {}

  this.$el           = null
  this.$parent       = options._parent
  this.$root         = options._root || this
  this.$             = {} // child vm references
  this.$$            = {} // element references
  this._watcherList  = [] // all watchers as an array
  this._watchers     = {} // internal watchers as a hash
  this._userWatchers = {} // user watchers as a hash
  this._directives   = [] // all directives

  // a flag to avoid this being observed
  this._isVue = true

  // events bookkeeping
  this._events         = {}    // registered callbacks
  this._eventsCount    = {}    // for $broadcast optimization
  this._eventCancelled = false // for event cancellation

  // block instance properties
  this._isBlock     = false
  this._blockStart  =          // @type {CommentNode}
  this._blockEnd    = null     // @type {CommentNode}

  // lifecycle state
  this._isCompiled  =
  this._isDestroyed =
  this._isReady     =
  this._isAttached  =
  this._isBeingDestroyed = false

  // children
  this._children = []
  this._childCtors = {}

  // transclusion unlink functions
  this._containerUnlinkFn =
  this._contentUnlinkFn = null

  // transcluded components that belong to the parent.
  // need to keep track of them so that we can call
  // attached/detached hooks on them.
  this._transCpnts = null

  // props used in v-repeat diffing
  this._new = true
  this._reused = false

  // merge options.
  options = this.$options = mergeOptions(
    this.constructor.options,
    options,
    this
  )

  // set data after merge.
  this._data = options.data || {}

  // initialize data observation and scope inheritance.
  this._initScope()

  // setup event system and option events.
  this._initEvents()

  // call created hook
  this._callHook('created')

  // if `el` option is passed, start compilation.
  if (options.el) {
    this.$mount(options.el)
  }
}
},{"../util/merge-option":63}],44:[function(require,module,exports){
var _ = require('../util')
var Observer = require('../observer')
var Dep = require('../observer/dep')

/**
 * Setup the scope of an instance, which contains:
 * - observed data
 * - computed properties
 * - user methods
 * - meta properties
 */

exports._initScope = function () {
  this._initData()
  this._initComputed()
  this._initMethods()
  this._initMeta()
}

/**
 * Initialize the data. 
 */

exports._initData = function () {
  // proxy data on instance
  var data = this._data
  var keys = Object.keys(data)
  var i = keys.length
  var key
  while (i--) {
    key = keys[i]
    if (!_.isReserved(key)) {
      this._proxy(key)
    }
  }
  // observe data
  Observer.create(data).addVm(this)
}

/**
 * Swap the isntance's $data. Called in $data's setter.
 *
 * @param {Object} newData
 */

exports._setData = function (newData) {
  newData = newData || {}
  var oldData = this._data
  this._data = newData
  var keys, key, i
  // unproxy keys not present in new data
  keys = Object.keys(oldData)
  i = keys.length
  while (i--) {
    key = keys[i]
    if (!_.isReserved(key) && !(key in newData)) {
      this._unproxy(key)
    }
  }
  // proxy keys not already proxied,
  // and trigger change for changed values
  keys = Object.keys(newData)
  i = keys.length
  while (i--) {
    key = keys[i]
    if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
      // new property
      this._proxy(key)
    }
  }
  oldData.__ob__.removeVm(this)
  Observer.create(newData).addVm(this)
  this._digest()
}

/**
 * Proxy a property, so that
 * vm.prop === vm._data.prop
 *
 * @param {String} key
 */

exports._proxy = function (key) {
  // need to store ref to self here
  // because these getter/setters might
  // be called by child instances!
  var self = this
  Object.defineProperty(self, key, {
    configurable: true,
    enumerable: true,
    get: function proxyGetter () {
      return self._data[key]
    },
    set: function proxySetter (val) {
      self._data[key] = val
    }
  })
}

/**
 * Unproxy a property.
 *
 * @param {String} key
 */

exports._unproxy = function (key) {
  delete this[key]
}

/**
 * Force update on every watcher in scope.
 */

exports._digest = function () {
  var i = this._watcherList.length
  while (i--) {
    this._watcherList[i].update()
  }
  var children = this._children
  i = children.length
  while (i--) {
    var child = children[i]
    if (!child._repeat && child.$options.inherit) {
      child._digest()
    }
  }
}

/**
 * Setup computed properties. They are essentially
 * special getter/setters
 */

function noop () {}
exports._initComputed = function () {
  var computed = this.$options.computed
  if (computed) {
    for (var key in computed) {
      var userDef = computed[key]
      var def = {
        enumerable: true,
        configurable: true
      }
      if (typeof userDef === 'function') {
        def.get = _.bind(userDef, this)
        def.set = noop
      } else {
        def.get = userDef.get
          ? _.bind(userDef.get, this)
          : noop
        def.set = userDef.set
          ? _.bind(userDef.set, this)
          : noop
      }
      Object.defineProperty(this, key, def)
    }
  }
}

/**
 * Setup instance methods. Methods must be bound to the
 * instance since they might be called by children
 * inheriting them.
 */

exports._initMethods = function () {
  var methods = this.$options.methods
  if (methods) {
    for (var key in methods) {
      this[key] = _.bind(methods[key], this)
    }
  }
}

/**
 * Initialize meta information like $index, $key & $value.
 */

exports._initMeta = function () {
  var metas = this.$options._meta
  if (metas) {
    for (var key in metas) {
      this._defineMeta(key, metas[key])
    }
  }
}

/**
 * Define a meta property, e.g $index, $key, $value
 * which only exists on the vm instance but not in $data.
 *
 * @param {String} key
 * @param {*} value
 */

exports._defineMeta = function (key, value) {
  var dep = new Dep()
  Object.defineProperty(this, key, {
    enumerable: true,
    configurable: true,
    get: function metaGetter () {
      if (Observer.target) {
        Observer.target.addDep(dep)
      }
      return value
    },
    set: function metaSetter (val) {
      if (val !== value) {
        value = val
        dep.notify()
      }
    }
  })
}
},{"../observer":47,"../observer/dep":46,"../util":61}],45:[function(require,module,exports){
var _ = require('../util')
var arrayProto = Array.prototype
var arrayMethods = Object.create(arrayProto)

/**
 * Intercept mutating methods and emit events
 */

;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method]
  _.define(arrayMethods, method, function mutator () {
    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length
    var args = new Array(i)
    while (i--) {
      args[i] = arguments[i]
    }
    var result = original.apply(this, args)
    var ob = this.__ob__
    var inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.notify()
    return result
  })
})

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

_.define(
  arrayProto,
  '$set',
  function $set (index, val) {
    if (index >= this.length) {
      this.length = index + 1
    }
    return this.splice(index, 1, val)[0]
  }
)

/**
 * Convenience method to remove the element at given index.
 *
 * @param {Number} index
 * @param {*} val
 */

_.define(
  arrayProto,
  '$remove',
  function $remove (index) {
    if (typeof index !== 'number') {
      index = this.indexOf(index)
    }
    if (index > -1) {
      return this.splice(index, 1)[0]
    }
  }
)

module.exports = arrayMethods
},{"../util":61}],46:[function(require,module,exports){
var uid = 0
var _ = require('../util')

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 *
 * @constructor
 */

function Dep () {
  this.id = ++uid
  this.subs = []
}

var p = Dep.prototype

/**
 * Add a directive subscriber.
 *
 * @param {Directive} sub
 */

p.addSub = function (sub) {
  this.subs.push(sub)
}

/**
 * Remove a directive subscriber.
 *
 * @param {Directive} sub
 */

p.removeSub = function (sub) {
  if (this.subs.length) {
    var i = this.subs.indexOf(sub)
    if (i > -1) this.subs.splice(i, 1)
  }
}

/**
 * Notify all subscribers of a new value.
 */

p.notify = function () {
  // stablize the subscriber list first
  var subs = _.toArray(this.subs)
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}

module.exports = Dep
},{"../util":61}],47:[function(require,module,exports){
var _ = require('../util')
var config = require('../config')
var Dep = require('./dep')
var arrayMethods = require('./array')
var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
require('./object')

var uid = 0

/**
 * Type enums
 */

var ARRAY  = 0
var OBJECT = 1

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function protoAugment (target, src) {
  target.__proto__ = src
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function copyAugment (target, src, keys) {
  var i = keys.length
  var key
  while (i--) {
    key = keys[i]
    _.define(target, key, src[key])
  }
}

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 *
 * @param {Array|Object} value
 * @param {Number} type
 * @constructor
 */

function Observer (value, type) {
  this.id = ++uid
  this.value = value
  this.active = true
  this.deps = []
  _.define(value, '__ob__', this)
  if (type === ARRAY) {
    var augment = config.proto && _.hasProto
      ? protoAugment
      : copyAugment
    augment(value, arrayMethods, arrayKeys)
    this.observeArray(value)
  } else if (type === OBJECT) {
    this.walk(value)
  }
}

Observer.target = null

var p = Observer.prototype

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 *
 * @param {*} value
 * @return {Observer|undefined}
 * @static
 */

Observer.create = function (value) {
  if (
    value &&
    value.hasOwnProperty('__ob__') &&
    value.__ob__ instanceof Observer
  ) {
    return value.__ob__
  } else if (_.isArray(value)) {
    return new Observer(value, ARRAY)
  } else if (
    _.isPlainObject(value) &&
    !value._isVue // avoid Vue instance
  ) {
    return new Observer(value, OBJECT)
  }
}

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object. Properties prefixed with `$` or `_`
 * and accessor properties are ignored.
 *
 * @param {Object} obj
 */

p.walk = function (obj) {
  var keys = Object.keys(obj)
  var i = keys.length
  var key, prefix
  while (i--) {
    key = keys[i]
    prefix = key.charCodeAt(0)
    if (prefix !== 0x24 && prefix !== 0x5F) { // skip $ or _
      this.convert(key, obj[key])
    }
  }
}

/**
 * Try to carete an observer for a child value,
 * and if value is array, link dep to the array.
 *
 * @param {*} val
 * @return {Dep|undefined}
 */

p.observe = function (val) {
  return Observer.create(val)
}

/**
 * Observe a list of Array items.
 *
 * @param {Array} items
 */

p.observeArray = function (items) {
  var i = items.length
  while (i--) {
    this.observe(items[i])
  }
}

/**
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} val
 */

p.convert = function (key, val) {
  var ob = this
  var childOb = ob.observe(val)
  var dep = new Dep()
  if (childOb) {
    childOb.deps.push(dep)
  }
  Object.defineProperty(ob.value, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      // Observer.target is a watcher whose getter is
      // currently being evaluated.
      if (ob.active && Observer.target) {
        Observer.target.addDep(dep)
      }
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      // remove dep from old value
      var oldChildOb = val && val.__ob__
      if (oldChildOb) {
        var oldDeps = oldChildOb.deps
        oldDeps.splice(oldDeps.indexOf(dep), 1)
      }
      val = newVal
      // add dep to new value
      var newChildOb = ob.observe(newVal)
      if (newChildOb) {
        newChildOb.deps.push(dep)
      }
      dep.notify()
    }
  })
}

/**
 * Notify change on all self deps on an observer.
 * This is called when a mutable value mutates. e.g.
 * when an Array's mutating methods are called, or an
 * Object's $add/$delete are called.
 */

p.notify = function () {
  var deps = this.deps
  for (var i = 0, l = deps.length; i < l; i++) {
    deps[i].notify()
  }
}

/**
 * Add an owner vm, so that when $add/$delete mutations
 * happen we can notify owner vms to proxy the keys and
 * digest the watchers. This is only called when the object
 * is observed as an instance's root $data.
 *
 * @param {Vue} vm
 */

p.addVm = function (vm) {
  (this.vms = this.vms || []).push(vm)
}

/**
 * Remove an owner vm. This is called when the object is
 * swapped out as an instance's $data object.
 *
 * @param {Vue} vm
 */

p.removeVm = function (vm) {
  this.vms.splice(this.vms.indexOf(vm), 1)
}

module.exports = Observer

},{"../config":14,"../util":61,"./array":45,"./dep":46,"./object":48}],48:[function(require,module,exports){
var _ = require('../util')
var objProto = Object.prototype

/**
 * Add a new property to an observed object
 * and emits corresponding event
 *
 * @param {String} key
 * @param {*} val
 * @public
 */

_.define(
  objProto,
  '$add',
  function $add (key, val) {
    if (this.hasOwnProperty(key)) return
    var ob = this.__ob__
    if (!ob || _.isReserved(key)) {
      this[key] = val
      return
    }
    ob.convert(key, val)
    if (ob.vms) {
      var i = ob.vms.length
      while (i--) {
        var vm = ob.vms[i]
        vm._proxy(key)
        vm._digest()
      }
    } else {
      ob.notify()
    }
  }
)

/**
 * Deletes a property from an observed object
 * and emits corresponding event
 *
 * @param {String} key
 * @public
 */

_.define(
  objProto,
  '$delete',
  function $delete (key) {
    if (!this.hasOwnProperty(key)) return
    delete this[key]
    var ob = this.__ob__
    if (!ob || _.isReserved(key)) {
      return
    }
    if (ob.vms) {
      var i = ob.vms.length
      while (i--) {
        var vm = ob.vms[i]
        vm._unproxy(key)
        vm._digest()
      }
    } else {
      ob.notify()
    }
  }
)
},{"../util":61}],49:[function(require,module,exports){
var _ = require('../util')
var Cache = require('../cache')
var cache = new Cache(1000)
var argRE = /^[^\{\?]+$|^'[^']*'$|^"[^"]*"$/
var filterTokenRE = /[^\s'"]+|'[^']+'|"[^"]+"/g

/**
 * Parser state
 */

var str
var c, i, l
var inSingle
var inDouble
var curly
var square
var paren
var begin
var argIndex
var dirs
var dir
var lastFilterIndex
var arg

/**
 * Push a directive object into the result Array
 */

function pushDir () {
  dir.raw = str.slice(begin, i).trim()
  if (dir.expression === undefined) {
    dir.expression = str.slice(argIndex, i).trim()
  } else if (lastFilterIndex !== begin) {
    pushFilter()
  }
  if (i === 0 || dir.expression) {
    dirs.push(dir)
  }
}

/**
 * Push a filter to the current directive object
 */

function pushFilter () {
  var exp = str.slice(lastFilterIndex, i).trim()
  var filter
  if (exp) {
    filter = {}
    var tokens = exp.match(filterTokenRE)
    filter.name = tokens[0]
    filter.args = tokens.length > 1 ? tokens.slice(1) : null
  }
  if (filter) {
    (dir.filters = dir.filters || []).push(filter)
  }
  lastFilterIndex = i + 1
}

/**
 * Parse a directive string into an Array of AST-like
 * objects representing directives.
 *
 * Example:
 *
 * "click: a = a + 1 | uppercase" will yield:
 * {
 *   arg: 'click',
 *   expression: 'a = a + 1',
 *   filters: [
 *     { name: 'uppercase', args: null }
 *   ]
 * }
 *
 * @param {String} str
 * @return {Array<Object>}
 */

exports.parse = function (s) {

  var hit = cache.get(s)
  if (hit) {
    return hit
  }

  // reset parser state
  str = s
  inSingle = inDouble = false
  curly = square = paren = begin = argIndex = 0
  lastFilterIndex = 0
  dirs = []
  dir = {}
  arg = null

  for (i = 0, l = str.length; i < l; i++) {
    c = str.charCodeAt(i)
    if (inSingle) {
      // check single quote
      if (c === 0x27) inSingle = !inSingle
    } else if (inDouble) {
      // check double quote
      if (c === 0x22) inDouble = !inDouble
    } else if (
      c === 0x2C && // comma
      !paren && !curly && !square
    ) {
      // reached the end of a directive
      pushDir()
      // reset & skip the comma
      dir = {}
      begin = argIndex = lastFilterIndex = i + 1
    } else if (
      c === 0x3A && // colon
      !dir.expression &&
      !dir.arg
    ) {
      // argument
      arg = str.slice(begin, i).trim()
      // test for valid argument here
      // since we may have caught stuff like first half of
      // an object literal or a ternary expression.
      if (argRE.test(arg)) {
        argIndex = i + 1
        dir.arg = _.stripQuotes(arg) || arg
      }
    } else if (
      c === 0x7C && // pipe
      str.charCodeAt(i + 1) !== 0x7C &&
      str.charCodeAt(i - 1) !== 0x7C
    ) {
      if (dir.expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1
        dir.expression = str.slice(argIndex, i).trim()
      } else {
        // already has filter
        pushFilter()
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break // "
        case 0x27: inSingle = true; break // '
        case 0x28: paren++; break         // (
        case 0x29: paren--; break         // )
        case 0x5B: square++; break        // [
        case 0x5D: square--; break        // ]
        case 0x7B: curly++; break         // {
        case 0x7D: curly--; break         // }
      }
    }
  }

  if (i === 0 || begin !== i) {
    pushDir()
  }

  cache.put(s, dirs)
  return dirs
}
},{"../cache":11,"../util":61}],50:[function(require,module,exports){
var _ = require('../util')
var Path = require('./path')
var Cache = require('../cache')
var expressionCache = new Cache(1000)

var keywords =
  'Math,Date,break,case,catch,continue,debugger,default,' +
  'delete,do,else,false,finally,for,function,if,in,' +
  'instanceof,new,null,return,switch,this,throw,true,try,' +
  'typeof,var,void,while,with,undefined,abstract,boolean,' +
  'byte,char,class,const,double,enum,export,extends,' +
  'final,float,goto,implements,import,int,interface,long,' +
  'native,package,private,protected,public,short,static,' +
  'super,synchronized,throws,transient,volatile,' +
  'arguments,let,yield'

var wsRE = /\s/g
var newlineRE = /\n/g
var saveRE = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|new /g
var restoreRE = /"(\d+)"/g
var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\])*$/
var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g
var keywordsRE = new RegExp('^(' + keywords.replace(/,/g, '\\b|') + '\\b)')
var booleanLiteralRE = /^(true|false)$/

/**
 * Save / Rewrite / Restore
 *
 * When rewriting paths found in an expression, it is
 * possible for the same letter sequences to be found in
 * strings and Object literal property keys. Therefore we
 * remove and store these parts in a temporary array, and
 * restore them after the path rewrite.
 */

var saved = []

/**
 * Save replacer
 *
 * The save regex can match two possible cases:
 * 1. An opening object literal
 * 2. A string
 * If matched as a plain string, we need to escape its
 * newlines, since the string needs to be preserved when
 * generating the function body.
 *
 * @param {String} str
 * @param {String} isString - str if matched as a string
 * @return {String} - placeholder with index
 */

function save (str, isString) {
  var i = saved.length
  saved[i] = isString
    ? str.replace(newlineRE, '\\n')
    : str
  return '"' + i + '"'
}

/**
 * Path rewrite replacer
 *
 * @param {String} raw
 * @return {String}
 */

function rewrite (raw) {
  var c = raw.charAt(0)
  var path = raw.slice(1)
  if (keywordsRE.test(path)) {
    return raw
  } else {
    path = path.indexOf('"') > -1
      ? path.replace(restoreRE, restore)
      : path
    return c + 'scope.' + path
  }
}

/**
 * Restore replacer
 *
 * @param {String} str
 * @param {String} i - matched save index
 * @return {String}
 */

function restore (str, i) {
  return saved[i]
}

/**
 * Rewrite an expression, prefixing all path accessors with
 * `scope.` and generate getter/setter functions.
 *
 * @param {String} exp
 * @param {Boolean} needSet
 * @return {Function}
 */

function compileExpFns (exp, needSet) {
  // reset state
  saved.length = 0
  // save strings and object literal keys
  var body = exp
    .replace(saveRE, save)
    .replace(wsRE, '')
  // rewrite all paths
  // pad 1 space here becaue the regex matches 1 extra char
  body = (' ' + body)
    .replace(pathReplaceRE, rewrite)
    .replace(restoreRE, restore)
  var getter = makeGetter(body)
  if (getter) {
    return {
      get: getter,
      body: body,
      set: needSet
        ? makeSetter(body)
        : null
    }
  }
}

/**
 * Compile getter setters for a simple path.
 *
 * @param {String} exp
 * @return {Function}
 */

function compilePathFns (exp) {
  var getter, path
  if (exp.indexOf('[') < 0) {
    // really simple path
    path = exp.split('.')
    getter = Path.compileGetter(path)
  } else {
    // do the real parsing
    path = Path.parse(exp)
    getter = path.get
  }
  return {
    get: getter,
    // always generate setter for simple paths
    set: function (obj, val) {
      Path.set(obj, path, val)
    }
  }
}

/**
 * Build a getter function. Requires eval.
 *
 * We isolate the try/catch so it doesn't affect the
 * optimization of the parse function when it is not called.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeGetter (body) {
  try {
    return new Function('scope', 'return ' + body + ';')
  } catch (e) {
    _.warn(
      'Invalid expression. ' +
      'Generated function body: ' + body
    )
  }
}

/**
 * Build a setter function.
 *
 * This is only needed in rare situations like "a[b]" where
 * a settable path requires dynamic evaluation.
 *
 * This setter function may throw error when called if the
 * expression body is not a valid left-hand expression in
 * assignment.
 *
 * @param {String} body
 * @return {Function|undefined}
 */

function makeSetter (body) {
  try {
    return new Function('scope', 'value', body + '=value;')
  } catch (e) {
    _.warn('Invalid setter function body: ' + body)
  }
}

/**
 * Check for setter existence on a cache hit.
 *
 * @param {Function} hit
 */

function checkSetter (hit) {
  if (!hit.set) {
    hit.set = makeSetter(hit.body)
  }
}

/**
 * Parse an expression into re-written getter/setters.
 *
 * @param {String} exp
 * @param {Boolean} needSet
 * @return {Function}
 */

exports.parse = function (exp, needSet) {
  exp = exp.trim()
  // try cache
  var hit = expressionCache.get(exp)
  if (hit) {
    if (needSet) {
      checkSetter(hit)
    }
    return hit
  }
  // we do a simple path check to optimize for them.
  // the check fails valid paths with unusal whitespaces,
  // but that's too rare and we don't care.
  // also skip boolean literals and paths that start with
  // global "Math"
  var res =
    pathTestRE.test(exp) &&
    !booleanLiteralRE.test(exp) &&
    exp.slice(0, 5) !== 'Math.'
      ? compilePathFns(exp)
      : compileExpFns(exp, needSet)
  expressionCache.put(exp, res)
  return res
}

// Export the pathRegex for external use
exports.pathTestRE = pathTestRE
},{"../cache":11,"../util":61,"./path":51}],51:[function(require,module,exports){
var _ = require('../util')
var Cache = require('../cache')
var pathCache = new Cache(1000)
var identRE = /^[$_a-zA-Z]+[\w$]*$/

/**
 * Path-parsing algorithm scooped from Polymer/observe-js
 */

var pathStateMachine = {
  'beforePath': {
    'ws': ['beforePath'],
    'ident': ['inIdent', 'append'],
    '[': ['beforeElement'],
    'eof': ['afterPath']
  },

  'inPath': {
    'ws': ['inPath'],
    '.': ['beforeIdent'],
    '[': ['beforeElement'],
    'eof': ['afterPath']
  },

  'beforeIdent': {
    'ws': ['beforeIdent'],
    'ident': ['inIdent', 'append']
  },

  'inIdent': {
    'ident': ['inIdent', 'append'],
    '0': ['inIdent', 'append'],
    'number': ['inIdent', 'append'],
    'ws': ['inPath', 'push'],
    '.': ['beforeIdent', 'push'],
    '[': ['beforeElement', 'push'],
    'eof': ['afterPath', 'push']
  },

  'beforeElement': {
    'ws': ['beforeElement'],
    '0': ['afterZero', 'append'],
    'number': ['inIndex', 'append'],
    "'": ['inSingleQuote', 'append', ''],
    '"': ['inDoubleQuote', 'append', '']
  },

  'afterZero': {
    'ws': ['afterElement', 'push'],
    ']': ['inPath', 'push']
  },

  'inIndex': {
    '0': ['inIndex', 'append'],
    'number': ['inIndex', 'append'],
    'ws': ['afterElement'],
    ']': ['inPath', 'push']
  },

  'inSingleQuote': {
    "'": ['afterElement'],
    'eof': 'error',
    'else': ['inSingleQuote', 'append']
  },

  'inDoubleQuote': {
    '"': ['afterElement'],
    'eof': 'error',
    'else': ['inDoubleQuote', 'append']
  },

  'afterElement': {
    'ws': ['afterElement'],
    ']': ['inPath', 'push']
  }
}

function noop () {}

/**
 * Determine the type of a character in a keypath.
 *
 * @param {Char} char
 * @return {String} type
 */

function getPathCharType (char) {
  if (char === undefined) {
    return 'eof'
  }

  var code = char.charCodeAt(0)

  switch(code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
    case 0x30: // 0
      return char

    case 0x5F: // _
    case 0x24: // $
      return 'ident'

    case 0x20: // Space
    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0:  // No-break space
    case 0xFEFF:  // Byte Order Mark
    case 0x2028:  // Line Separator
    case 0x2029:  // Paragraph Separator
      return 'ws'
  }

  // a-z, A-Z
  if ((0x61 <= code && code <= 0x7A) ||
      (0x41 <= code && code <= 0x5A)) {
    return 'ident'
  }

  // 1-9
  if (0x31 <= code && code <= 0x39) {
    return 'number'
  }

  return 'else'
}

/**
 * Parse a string path into an array of segments
 * Todo implement cache
 *
 * @param {String} path
 * @return {Array|undefined}
 */

function parsePath (path) {
  var keys = []
  var index = -1
  var mode = 'beforePath'
  var c, newChar, key, type, transition, action, typeMap

  var actions = {
    push: function() {
      if (key === undefined) {
        return
      }
      keys.push(key)
      key = undefined
    },
    append: function() {
      if (key === undefined) {
        key = newChar
      } else {
        key += newChar
      }
    }
  }

  function maybeUnescapeQuote () {
    var nextChar = path[index + 1]
    if ((mode === 'inSingleQuote' && nextChar === "'") ||
        (mode === 'inDoubleQuote' && nextChar === '"')) {
      index++
      newChar = nextChar
      actions.append()
      return true
    }
  }

  while (mode) {
    index++
    c = path[index]

    if (c === '\\' && maybeUnescapeQuote()) {
      continue
    }

    type = getPathCharType(c)
    typeMap = pathStateMachine[mode]
    transition = typeMap[type] || typeMap['else'] || 'error'

    if (transition === 'error') {
      return // parse error
    }

    mode = transition[0]
    action = actions[transition[1]] || noop
    newChar = transition[2] === undefined
      ? c
      : transition[2]
    action()

    if (mode === 'afterPath') {
      return keys
    }
  }
}

/**
 * Format a accessor segment based on its type.
 *
 * @param {String} key
 * @return {Boolean}
 */

function formatAccessor(key) {
  if (identRE.test(key)) { // identifier
    return '.' + key
  } else if (+key === key >>> 0) { // bracket index
    return '[' + key + ']'
  } else { // bracket string
    return '["' + key.replace(/"/g, '\\"') + '"]'
  }
}

/**
 * Compiles a getter function with a fixed path.
 *
 * @param {Array} path
 * @return {Function}
 */

exports.compileGetter = function (path) {
  var body = 'return o' + path.map(formatAccessor).join('')
  return new Function('o', body)
}

/**
 * External parse that check for a cache hit first
 *
 * @param {String} path
 * @return {Array|undefined}
 */

exports.parse = function (path) {
  var hit = pathCache.get(path)
  if (!hit) {
    hit = parsePath(path)
    if (hit) {
      hit.get = exports.compileGetter(hit)
      pathCache.put(path, hit)
    }
  }
  return hit
}

/**
 * Get from an object from a path string
 *
 * @param {Object} obj
 * @param {String} path
 */

exports.get = function (obj, path) {
  path = exports.parse(path)
  if (path) {
    return path.get(obj)
  }
}

/**
 * Set on an object from a path
 *
 * @param {Object} obj
 * @param {String | Array} path
 * @param {*} val
 */

exports.set = function (obj, path, val) {
  if (typeof path === 'string') {
    path = exports.parse(path)
  }
  if (!path || !_.isObject(obj)) {
    return false
  }
  var last, key
  for (var i = 0, l = path.length - 1; i < l; i++) {
    last = obj
    key = path[i]
    obj = obj[key]
    if (!_.isObject(obj)) {
      obj = {}
      last.$add(key, obj)
    }
  }
  key = path[i]
  if (key in obj) {
    obj[key] = val
  } else {
    obj.$add(key, val)
  }
  return true
}
},{"../cache":11,"../util":61}],52:[function(require,module,exports){
var _ = require('../util')
var Cache = require('../cache')
var templateCache = new Cache(1000)
var idSelectorCache = new Cache(1000)

var map = {
  _default : [0, '', ''],
  legend   : [1, '<fieldset>', '</fieldset>'],
  tr       : [2, '<table><tbody>', '</tbody></table>'],
  col      : [
    2,
    '<table><tbody></tbody><colgroup>',
    '</colgroup></table>'
  ]
}

map.td =
map.th = [
  3,
  '<table><tbody><tr>',
  '</tr></tbody></table>'
]

map.option =
map.optgroup = [
  1,
  '<select multiple="multiple">',
  '</select>'
]

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>']

map.g =
map.defs =
map.symbol =
map.use =
map.image =
map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [
  1,
  '<svg ' +
    'xmlns="http://www.w3.org/2000/svg" ' +
    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'xmlns:ev="http://www.w3.org/2001/xml-events"' +
    'version="1.1">',
  '</svg>'
]

var tagRE = /<([\w:]+)/
var entityRE = /&\w+;/

/**
 * Convert a string template to a DocumentFragment.
 * Determines correct wrapping by tag types. Wrapping
 * strategy found in jQuery & component/domify.
 *
 * @param {String} templateString
 * @return {DocumentFragment}
 */

function stringToFragment (templateString) {
  // try a cache hit first
  var hit = templateCache.get(templateString)
  if (hit) {
    return hit
  }

  var frag = document.createDocumentFragment()
  var tagMatch = templateString.match(tagRE)
  var entityMatch = entityRE.test(templateString)

  if (!tagMatch && !entityMatch) {
    // text only, return a single text node.
    frag.appendChild(
      document.createTextNode(templateString)
    )
  } else {

    var tag    = tagMatch && tagMatch[1]
    var wrap   = map[tag] || map._default
    var depth  = wrap[0]
    var prefix = wrap[1]
    var suffix = wrap[2]
    var node   = document.createElement('div')

    node.innerHTML = prefix + templateString.trim() + suffix
    while (depth--) {
      node = node.lastChild
    }

    var child
    /* jshint boss:true */
    while (child = node.firstChild) {
      frag.appendChild(child)
    }
  }

  templateCache.put(templateString, frag)
  return frag
}

/**
 * Convert a template node to a DocumentFragment.
 *
 * @param {Node} node
 * @return {DocumentFragment}
 */

function nodeToFragment (node) {
  var tag = node.tagName
  // if its a template tag and the browser supports it,
  // its content is already a document fragment.
  if (
    tag === 'TEMPLATE' &&
    node.content instanceof DocumentFragment
  ) {
    return node.content
  }
  // script template
  if (tag === 'SCRIPT') {
    return stringToFragment(node.textContent)
  }
  // normal node, clone it to avoid mutating the original
  var clone = exports.clone(node)
  var frag = document.createDocumentFragment()
  var child
  /* jshint boss:true */
  while (child = clone.firstChild) {
    frag.appendChild(child)
  }
  return frag
}

// Test for the presence of the Safari template cloning bug
// https://bugs.webkit.org/show_bug.cgi?id=137755
var hasBrokenTemplate = _.inBrowser
  ? (function () {
      var a = document.createElement('div')
      a.innerHTML = '<template>1</template>'
      return !a.cloneNode(true).firstChild.innerHTML
    })()
  : false

// Test for IE10/11 textarea placeholder clone bug
var hasTextareaCloneBug = _.inBrowser
  ? (function () {
      var t = document.createElement('textarea')
      t.placeholder = 't'
      return t.cloneNode(true).value === 't'
    })()
  : false

/**
 * 1. Deal with Safari cloning nested <template> bug by
 *    manually cloning all template instances.
 * 2. Deal with IE10/11 textarea placeholder bug by setting
 *    the correct value after cloning.
 *
 * @param {Element|DocumentFragment} node
 * @return {Element|DocumentFragment}
 */

exports.clone = function (node) {
  var res = node.cloneNode(true)
  var i, original, cloned
  /* istanbul ignore if */
  if (hasBrokenTemplate) {
    original = node.querySelectorAll('template')
    if (original.length) {
      cloned = res.querySelectorAll('template')
      i = cloned.length
      while (i--) {
        cloned[i].parentNode.replaceChild(
          original[i].cloneNode(true),
          cloned[i]
        )
      }
    }
  }
  /* istanbul ignore if */
  if (hasTextareaCloneBug) {
    if (node.tagName === 'TEXTAREA') {
      res.value = node.value
    } else {
      original = node.querySelectorAll('textarea')
      if (original.length) {
        cloned = res.querySelectorAll('textarea')
        i = cloned.length
        while (i--) {
          cloned[i].value = original[i].value
        }
      }
    }
  }
  return res
}

/**
 * Process the template option and normalizes it into a
 * a DocumentFragment that can be used as a partial or a
 * instance template.
 *
 * @param {*} template
 *    Possible values include:
 *    - DocumentFragment object
 *    - Node object of type Template
 *    - id selector: '#some-template-id'
 *    - template string: '<div><span>{{msg}}</span></div>'
 * @param {Boolean} clone
 * @param {Boolean} noSelector
 * @return {DocumentFragment|undefined}
 */

exports.parse = function (template, clone, noSelector) {
  var node, frag

  // if the template is already a document fragment,
  // do nothing
  if (template instanceof DocumentFragment) {
    return clone
      ? template.cloneNode(true)
      : template
  }

  if (typeof template === 'string') {
    // id selector
    if (!noSelector && template.charAt(0) === '#') {
      // id selector can be cached too
      frag = idSelectorCache.get(template)
      if (!frag) {
        node = document.getElementById(template.slice(1))
        if (node) {
          frag = nodeToFragment(node)
          // save selector to cache
          idSelectorCache.put(template, frag)
        }
      }
    } else {
      // normal string template
      frag = stringToFragment(template)
    }
  } else if (template.nodeType) {
    // a direct node
    frag = nodeToFragment(template)
  }

  return frag && clone
    ? exports.clone(frag)
    : frag
}
},{"../cache":11,"../util":61}],53:[function(require,module,exports){
var Cache = require('../cache')
var config = require('../config')
var dirParser = require('./directive')
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
var cache, tagRE, htmlRE, firstChar, lastChar

/**
 * Escape a string so it can be used in a RegExp
 * constructor.
 *
 * @param {String} str
 */

function escapeRegex (str) {
  return str.replace(regexEscapeRE, '\\$&')
}

/**
 * Compile the interpolation tag regex.
 *
 * @return {RegExp}
 */

function compileRegex () {
  config._delimitersChanged = false
  var open = config.delimiters[0]
  var close = config.delimiters[1]
  firstChar = open.charAt(0)
  lastChar = close.charAt(close.length - 1)
  var firstCharRE = escapeRegex(firstChar)
  var lastCharRE = escapeRegex(lastChar)
  var openRE = escapeRegex(open)
  var closeRE = escapeRegex(close)
  tagRE = new RegExp(
    firstCharRE + '?' + openRE +
    '(.+?)' +
    closeRE + lastCharRE + '?',
    'g'
  )
  htmlRE = new RegExp(
    '^' + firstCharRE + openRE +
    '.*' +
    closeRE + lastCharRE + '$'
  )
  // reset cache
  cache = new Cache(1000)
}

/**
 * Parse a template text string into an array of tokens.
 *
 * @param {String} text
 * @return {Array<Object> | null}
 *               - {String} type
 *               - {String} value
 *               - {Boolean} [html]
 *               - {Boolean} [oneTime]
 */

exports.parse = function (text) {
  if (config._delimitersChanged) {
    compileRegex()
  }
  var hit = cache.get(text)
  if (hit) {
    return hit
  }
  if (!tagRE.test(text)) {
    return null
  }
  var tokens = []
  var lastIndex = tagRE.lastIndex = 0
  var match, index, value, first, oneTime, partial
  /* jshint boss:true */
  while (match = tagRE.exec(text)) {
    index = match.index
    // push text token
    if (index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, index)
      })
    }
    // tag token
    first = match[1].charCodeAt(0)
    oneTime = first === 0x2A // *
    partial = first === 0x3E // >
    value = (oneTime || partial)
      ? match[1].slice(1)
      : match[1]
    tokens.push({
      tag: true,
      value: value.trim(),
      html: htmlRE.test(match[0]),
      oneTime: oneTime,
      partial: partial
    })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push({
      value: text.slice(lastIndex)
    })
  }
  cache.put(text, tokens)
  return tokens
}

/**
 * Format a list of tokens into an expression.
 * e.g. tokens parsed from 'a {{b}} c' can be serialized
 * into one single expression as '"a " + b + " c"'.
 *
 * @param {Array} tokens
 * @param {Vue} [vm]
 * @return {String}
 */

exports.tokensToExp = function (tokens, vm) {
  return tokens.length > 1
    ? tokens.map(function (token) {
        return formatToken(token, vm)
      }).join('+')
    : formatToken(tokens[0], vm, true)
}

/**
 * Format a single token.
 *
 * @param {Object} token
 * @param {Vue} [vm]
 * @param {Boolean} single
 * @return {String}
 */

function formatToken (token, vm, single) {
  return token.tag
    ? vm && token.oneTime
      ? '"' + vm.$eval(token.value) + '"'
      : single
        ? token.value
        : inlineFilters(token.value)
    : '"' + token.value + '"'
}

/**
 * For an attribute with multiple interpolation tags,
 * e.g. attr="some-{{thing | filter}}", in order to combine
 * the whole thing into a single watchable expression, we
 * have to inline those filters. This function does exactly
 * that. This is a bit hacky but it avoids heavy changes
 * to directive parser and watcher mechanism.
 *
 * @param {String} exp
 * @return {String}
 */

var filterRE = /[^|]\|[^|]/
function inlineFilters (exp) {
  if (!filterRE.test(exp)) {
    return '(' + exp + ')'
  } else {
    var dir = dirParser.parse(exp)[0]
    if (!dir.filters) {
      return '(' + exp + ')'
    } else {
      exp = dir.expression
      for (var i = 0, l = dir.filters.length; i < l; i++) {
        var filter = dir.filters[i]
        var args = filter.args
          ? ',"' + filter.args.join('","') + '"'
          : ''
        filter = 'this.$options.filters["' + filter.name + '"]'
        exp = '(' + filter + '.read||' + filter + ')' +
          '.apply(this,[' + exp + args + '])'
      }
      return exp
    }
  }
}
},{"../cache":11,"../config":14,"./directive":49}],54:[function(require,module,exports){
var _ = require('../util')
var addClass = _.addClass
var removeClass = _.removeClass
var transDurationProp = _.transitionProp + 'Duration'
var animDurationProp = _.animationProp + 'Duration'

var queue = []
var queued = false

/**
 * Push a job into the transition queue, which is to be
 * executed on next frame.
 *
 * @param {Element} el    - target element
 * @param {Number} dir    - 1: enter, -1: leave
 * @param {Function} op   - the actual dom operation
 * @param {String} cls    - the className to remove when the
 *                          transition is done.
 * @param {Function} [cb] - user supplied callback.
 */

function push (el, dir, op, cls, cb) {
  queue.push({
    el  : el,
    dir : dir,
    cb  : cb,
    cls : cls,
    op  : op
  })
  if (!queued) {
    queued = true
    _.nextTick(flush)
  }
}

/**
 * Flush the queue, and do one forced reflow before
 * triggering transitions.
 */

function flush () {
  /* jshint unused: false */
  var f = document.documentElement.offsetHeight
  queue.forEach(run)
  queue = []
  queued = false
}

/**
 * Run a transition job.
 *
 * @param {Object} job
 */

function run (job) {

  var el = job.el
  var data = el.__v_trans
  var cls = job.cls
  var cb = job.cb
  var op = job.op
  var transitionType = getTransitionType(el, data, cls)

  if (job.dir > 0) { // ENTER
    if (transitionType === 1) {
      // trigger transition by removing enter class
      removeClass(el, cls)
      // only need to listen for transitionend if there's
      // a user callback
      if (cb) setupTransitionCb(_.transitionEndEvent)
    } else if (transitionType === 2) {
      // animations are triggered when class is added
      // so we just listen for animationend to remove it.
      setupTransitionCb(_.animationEndEvent, function () {
        removeClass(el, cls)
      })
    } else {
      // no transition applicable
      removeClass(el, cls)
      if (cb) cb()
    }
  } else { // LEAVE
    if (transitionType) {
      // leave transitions/animations are both triggered
      // by adding the class, just remove it on end event.
      var event = transitionType === 1
        ? _.transitionEndEvent
        : _.animationEndEvent
      setupTransitionCb(event, function () {
        op()
        removeClass(el, cls)
      })
    } else {
      op()
      removeClass(el, cls)
      if (cb) cb()
    }
  }

  /**
   * Set up a transition end callback, store the callback
   * on the element's __v_trans data object, so we can
   * clean it up if another transition is triggered before
   * the callback is fired.
   *
   * @param {String} event
   * @param {Function} [cleanupFn]
   */

  function setupTransitionCb (event, cleanupFn) {
    data.event = event
    var onEnd = data.callback = function transitionCb (e) {
      if (e.target === el) {
        _.off(el, event, onEnd)
        data.event = data.callback = null
        if (cleanupFn) cleanupFn()
        if (cb) cb()
      }
    }
    _.on(el, event, onEnd)
  }
}

/**
 * Get an element's transition type based on the
 * calculated styles
 *
 * @param {Element} el
 * @param {Object} data
 * @param {String} className
 * @return {Number}
 *         1 - transition
 *         2 - animation
 */

function getTransitionType (el, data, className) {
  var type = data.cache && data.cache[className]
  if (type) return type
  var inlineStyles = el.style
  var computedStyles = window.getComputedStyle(el)
  var transDuration =
    inlineStyles[transDurationProp] ||
    computedStyles[transDurationProp]
  if (transDuration && transDuration !== '0s') {
    type = 1
  } else {
    var animDuration =
      inlineStyles[animDurationProp] ||
      computedStyles[animDurationProp]
    if (animDuration && animDuration !== '0s') {
      type = 2
    }
  }
  if (type) {
    if (!data.cache) data.cache = {}
    data.cache[className] = type
  }
  return type
}

/**
 * Apply CSS transition to an element.
 *
 * @param {Element} el
 * @param {Number} direction - 1: enter, -1: leave
 * @param {Function} op - the actual DOM operation
 * @param {Object} data - target element's transition data
 */

module.exports = function (el, direction, op, data, cb) {
  var prefix = data.id || 'v'
  var enterClass = prefix + '-enter'
  var leaveClass = prefix + '-leave'
  // clean up potential previous unfinished transition
  if (data.callback) {
    _.off(el, data.event, data.callback)
    removeClass(el, enterClass)
    removeClass(el, leaveClass)
    data.event = data.callback = null
  }
  if (direction > 0) { // enter
    addClass(el, enterClass)
    op()
    push(el, direction, null, enterClass, cb)
  } else { // leave
    addClass(el, leaveClass)
    push(el, direction, op, leaveClass, cb)
  }
}
},{"../util":61}],55:[function(require,module,exports){
var _ = require('../util')
var applyCSSTransition = require('./css')
var applyJSTransition = require('./js')

/**
 * Append with transition.
 *
 * @oaram {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.append = function (el, target, vm, cb) {
  apply(el, 1, function () {
    target.appendChild(el)
  }, vm, cb)
}

/**
 * InsertBefore with transition.
 *
 * @oaram {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.before = function (el, target, vm, cb) {
  apply(el, 1, function () {
    _.before(el, target)
  }, vm, cb)
}

/**
 * Remove with transition.
 *
 * @oaram {Element} el
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.remove = function (el, vm, cb) {
  apply(el, -1, function () {
    _.remove(el)
  }, vm, cb)
}

/**
 * Remove by appending to another parent with transition.
 * This is only used in block operations.
 *
 * @oaram {Element} el
 * @param {Element} target
 * @param {Vue} vm
 * @param {Function} [cb]
 */

exports.removeThenAppend = function (el, target, vm, cb) {
  apply(el, -1, function () {
    target.appendChild(el)
  }, vm, cb)
}

/**
 * Append the childNodes of a fragment to target.
 *
 * @param {DocumentFragment} block
 * @param {Node} target
 * @param {Vue} vm
 */

exports.blockAppend = function (block, target, vm) {
  var nodes = _.toArray(block.childNodes)
  for (var i = 0, l = nodes.length; i < l; i++) {
    exports.before(nodes[i], target, vm)
  }
}

/**
 * Remove a block of nodes between two edge nodes.
 *
 * @param {Node} start
 * @param {Node} end
 * @param {Vue} vm
 */

exports.blockRemove = function (start, end, vm) {
  var node = start.nextSibling
  var next
  while (node !== end) {
    next = node.nextSibling
    exports.remove(node, vm)
    node = next
  }
}

/**
 * Apply transitions with an operation callback.
 *
 * @oaram {Element} el
 * @param {Number} direction
 *                  1: enter
 *                 -1: leave
 * @param {Function} op - the actual DOM operation
 * @param {Vue} vm
 * @param {Function} [cb]
 */

var apply = exports.apply = function (el, direction, op, vm, cb) {
  var transData = el.__v_trans
  if (
    !transData ||
    !vm._isCompiled ||
    // if the vm is being manipulated by a parent directive
    // during the parent's compilation phase, skip the
    // animation.
    (vm.$parent && !vm.$parent._isCompiled)
  ) {
    op()
    if (cb) cb()
    return
  }
  // determine the transition type on the element
  var jsTransition = transData.fns
  if (jsTransition) {
    // js
    applyJSTransition(
      el,
      direction,
      op,
      transData,
      jsTransition,
      vm,
      cb
    )
  } else if (_.transitionEndEvent) {
    // css
    applyCSSTransition(
      el,
      direction,
      op,
      transData,
      cb
    )
  } else {
    // not applicable
    op()
    if (cb) cb()
  }
}
},{"../util":61,"./css":54,"./js":56}],56:[function(require,module,exports){
/**
 * Apply JavaScript enter/leave functions.
 *
 * @param {Element} el
 * @param {Number} direction - 1: enter, -1: leave
 * @param {Function} op - the actual DOM operation
 * @param {Object} data - target element's transition data
 * @param {Object} def - transition definition object
 * @param {Vue} vm - the owner vm of the element
 * @param {Function} [cb]
 */

module.exports = function (el, direction, op, data, def, vm, cb) {
  // if the element is the root of an instance,
  // use that instance as the transition function context
  vm = el.__vue__ || vm
  if (data.cancel) {
    data.cancel()
    data.cancel = null
  }
  if (direction > 0) { // enter
    if (def.beforeEnter) {
      def.beforeEnter.call(vm, el)
    }
    op()
    if (def.enter) {
      data.cancel = def.enter.call(vm, el, function () {
        data.cancel = null
        if (cb) cb()
      })
    } else if (cb) {
      cb()
    }
  } else { // leave
    if (def.leave) {
      data.cancel = def.leave.call(vm, el, function () {
        data.cancel = null
        op()
        if (cb) cb()
      })
    } else {
      op()
      if (cb) cb()
    }
  }
}
},{}],57:[function(require,module,exports){
var config = require('../config')

/**
 * Enable debug utilities. The enableDebug() function and
 * all _.log() & _.warn() calls will be dropped in the
 * minified production build.
 */

enableDebug()

function enableDebug () {

  var hasConsole = typeof console !== 'undefined'
  
  /**
   * Log a message.
   *
   * @param {String} msg
   */

  exports.log = function (msg) {
    if (hasConsole && config.debug) {
      console.log('[Vue info]: ' + msg)
    }
  }

  /**
   * We've got a problem here.
   *
   * @param {String} msg
   */

  var warned = false
  exports.warn = function (msg) {
    if (hasConsole && (!config.silent || config.debug)) {
      if (!config.debug && !warned) {
        warned = true
        console.log(
          'Set `Vue.config.debug = true` to enable debug mode.'
        )
      }
      console.warn('[Vue warn]: ' + msg)
      /* istanbul ignore if */
      if (config.debug) {
        /* jshint debug: true */
        debugger
      }
    }
  }

  /**
   * Assert asset exists
   */

  exports.assertAsset = function (val, type, id) {
    if (!val) {
      exports.warn('Failed to resolve ' + type + ': ' + id)
    }
  }
}
},{"../config":14}],58:[function(require,module,exports){
var config = require('../config')

/**
 * Check if a node is in the document.
 * Note: document.documentElement.contains should work here
 * but always returns false for comment nodes in phantomjs,
 * making unit tests difficult. This is fixed byy doing the
 * contains() check on the node's parentNode instead of
 * the node itself.
 *
 * @param {Node} node
 * @return {Boolean}
 */

var doc =
  typeof document !== 'undefined' &&
  document.documentElement

exports.inDoc = function (node) {
  var parent = node && node.parentNode
  return doc === node ||
    doc === parent ||
    !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
}

/**
 * Extract an attribute from a node.
 *
 * @param {Node} node
 * @param {String} attr
 */

exports.attr = function (node, attr) {
  attr = config.prefix + attr
  var val = node.getAttribute(attr)
  if (val !== null) {
    node.removeAttribute(attr)
  }
  return val
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

exports.before = function (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Insert el after target
 *
 * @param {Element} el
 * @param {Element} target
 */

exports.after = function (el, target) {
  if (target.nextSibling) {
    exports.before(el, target.nextSibling)
  } else {
    target.parentNode.appendChild(el)
  }
}

/**
 * Remove el from DOM
 *
 * @param {Element} el
 */

exports.remove = function (el) {
  el.parentNode.removeChild(el)
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

exports.prepend = function (el, target) {
  if (target.firstChild) {
    exports.before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

/**
 * Replace target with el
 *
 * @param {Element} target
 * @param {Element} el
 */

exports.replace = function (target, el) {
  var parent = target.parentNode
  if (parent) {
    parent.replaceChild(el, target)
  }
}

/**
 * Copy attributes from one element to another.
 *
 * @param {Element} from
 * @param {Element} to
 */

exports.copyAttributes = function (from, to) {
  if (from.hasAttributes()) {
    var attrs = from.attributes
    for (var i = 0, l = attrs.length; i < l; i++) {
      var attr = attrs[i]
      to.setAttribute(attr.name, attr.value)
    }
  }
}

/**
 * Add event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

exports.on = function (el, event, cb) {
  el.addEventListener(event, cb)
}

/**
 * Remove event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

exports.off = function (el, event, cb) {
  el.removeEventListener(event, cb)
}

/**
 * Add class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {Strong} cls
 */

exports.addClass = function (el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  } else {
    var cur = ' ' + (el.getAttribute('class') || '') + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim())
    }
  }
}

/**
 * Remove class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {Strong} cls
 */

exports.removeClass = function (el, cls) {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    var cur = ' ' + (el.getAttribute('class') || '') + ' '
    var tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    el.setAttribute('class', cur.trim())
  }
}

/**
 * Extract raw content inside an element into a temporary
 * container div
 *
 * @param {Element} el
 * @param {Boolean} asFragment
 * @return {Element}
 */

exports.extractContent = function (el, asFragment) {
  var child
  var rawContent
  if (el.hasChildNodes()) {
    rawContent = asFragment
      ? document.createDocumentFragment()
      : document.createElement('div')
    /* jshint boss:true */
    while (child = el.firstChild) {
      rawContent.appendChild(child)
    }
  }
  return rawContent
}

},{"../config":14}],59:[function(require,module,exports){
/**
 * Can we use __proto__?
 *
 * @type {Boolean}
 */

exports.hasProto = '__proto__' in {}

/**
 * Indicates we have a window
 *
 * @type {Boolean}
 */

var toString = Object.prototype.toString
var inBrowser = exports.inBrowser =
  typeof window !== 'undefined' &&
  toString.call(window) !== '[object Object]'

/**
 * Defer a task to execute it asynchronously. Ideally this
 * should be executed as a microtask, so we leverage
 * MutationObserver if it's available, and fallback to
 * setTimeout(0).
 *
 * @param {Function} cb
 * @param {Object} ctx
 */

exports.nextTick = (function () {
  var callbacks = []
  var pending = false
  var timerFunc
  function handle () {
    pending = false
    var copies = callbacks.slice(0)
    callbacks = []
    for (var i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
  /* istanbul ignore if */
  if (typeof MutationObserver !== 'undefined') {
    var counter = 1
    var observer = new MutationObserver(handle)
    var textNode = document.createTextNode(counter)
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = function () {
      counter = (counter + 1) % 2
      textNode.data = counter
    }
  } else {
    timerFunc = setTimeout
  }
  return function (cb, ctx) {
    var func = ctx
      ? function () { cb.call(ctx) }
      : cb
    callbacks.push(func)
    if (pending) return
    pending = true
    timerFunc(handle, 0)
  }
})()

/**
 * Detect if we are in IE9...
 *
 * @type {Boolean}
 */

exports.isIE9 =
  inBrowser &&
  navigator.userAgent.indexOf('MSIE 9.0') > 0

/**
 * Sniff transition/animation events
 */

if (inBrowser && !exports.isIE9) {
  var isWebkitTrans =
    window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  var isWebkitAnim =
    window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  exports.transitionProp = isWebkitTrans
    ? 'WebkitTransition'
    : 'transition'
  exports.transitionEndEvent = isWebkitTrans
    ? 'webkitTransitionEnd'
    : 'transitionend'
  exports.animationProp = isWebkitAnim
    ? 'WebkitAnimation'
    : 'animation'
  exports.animationEndEvent = isWebkitAnim
    ? 'webkitAnimationEnd'
    : 'animationend'
}
},{}],60:[function(require,module,exports){
var _ = require('./debug')

/**
 * Resolve read & write filters for a vm instance. The
 * filters descriptor Array comes from the directive parser.
 *
 * This is extracted into its own utility so it can
 * be used in multiple scenarios.
 *
 * @param {Vue} vm
 * @param {Array<Object>} filters
 * @param {Object} [target]
 * @return {Object}
 */

exports.resolveFilters = function (vm, filters, target) {
  if (!filters) {
    return
  }
  var res = target || {}
  // var registry = vm.$options.filters
  filters.forEach(function (f) {
    var def = vm.$options.filters[f.name]
    _.assertAsset(def, 'filter', f.name)
    if (!def) return
    var args = f.args
    var reader, writer
    if (typeof def === 'function') {
      reader = def
    } else {
      reader = def.read
      writer = def.write
    }
    if (reader) {
      if (!res.read) res.read = []
      res.read.push(function (value) {
        return args
          ? reader.apply(vm, [value].concat(args))
          : reader.call(vm, value)
      })
    }
    if (writer) {
      if (!res.write) res.write = []
      res.write.push(function (value, oldVal) {
        return args
          ? writer.apply(vm, [value, oldVal].concat(args))
          : writer.call(vm, value, oldVal)
      })
    }
  })
  return res
}

/**
 * Apply filters to a value
 *
 * @param {*} value
 * @param {Array} filters
 * @param {Vue} vm
 * @param {*} oldVal
 * @return {*}
 */

exports.applyFilters = function (value, filters, vm, oldVal) {
  if (!filters) {
    return value
  }
  for (var i = 0, l = filters.length; i < l; i++) {
    value = filters[i].call(vm, value, oldVal)
  }
  return value
}
},{"./debug":57}],61:[function(require,module,exports){
var lang   = require('./lang')
var extend = lang.extend

extend(exports, lang)
extend(exports, require('./env'))
extend(exports, require('./dom'))
extend(exports, require('./filter'))
extend(exports, require('./debug'))
},{"./debug":57,"./dom":58,"./env":59,"./filter":60,"./lang":62}],62:[function(require,module,exports){
/**
 * Check is a string starts with $ or _
 *
 * @param {String} str
 * @return {Boolean}
 */

exports.isReserved = function (str) {
  var c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Guard text output, make sure undefined outputs
 * empty string
 *
 * @param {*} value
 * @return {String}
 */

exports.toString = function (value) {
  return value == null
    ? ''
    : value.toString()
}

/**
 * Check and convert possible numeric numbers before
 * setting back to data
 *
 * @param {*} value
 * @return {*|Number}
 */

exports.toNumber = function (value) {
  return (
    isNaN(value) ||
    value === null ||
    typeof value === 'boolean'
  ) ? value
    : Number(value)
}

/**
 * Strip quotes from a string
 *
 * @param {String} str
 * @return {String | false}
 */

exports.stripQuotes = function (str) {
  var a = str.charCodeAt(0)
  var b = str.charCodeAt(str.length - 1)
  return a === b && (a === 0x22 || a === 0x27)
    ? str.slice(1, -1)
    : false
}

/**
 * Replace helper
 *
 * @param {String} _ - matched delimiter
 * @param {String} c - matched char
 * @return {String}
 */
function toUpper (_, c) {
  return c ? c.toUpperCase () : ''
}

/**
 * Camelize a hyphen-delmited string.
 *
 * @param {String} str
 * @return {String}
 */

var camelRE = /-(\w)/g
exports.camelize = function (str) {
  return str.replace(camelRE, toUpper)
}

/**
 * Converts hyphen/underscore/slash delimitered names into
 * camelized classNames.
 *
 * e.g. my-component => MyComponent
 *      some_else    => SomeElse
 *      some/comp    => SomeComp
 *
 * @param {String} str
 * @return {String}
 */

var classifyRE = /(?:^|[-_\/])(\w)/g
exports.classify = function (str) {
  return str.replace(classifyRE, toUpper)
}

/**
 * Simple bind, faster than native
 *
 * @param {Function} fn
 * @param {Object} ctx
 * @return {Function}
 */

exports.bind = function (fn, ctx) {
  return function () {
    return fn.apply(ctx, arguments)
  }
}

/**
 * Convert an Array-like object to a real Array.
 *
 * @param {Array-like} list
 * @param {Number} [start] - start index
 * @return {Array}
 */

exports.toArray = function (list, start) {
  start = start || 0
  var i = list.length - start
  var ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * Mix properties into target object.
 *
 * @param {Object} to
 * @param {Object} from
 */

exports.extend = function (to, from) {
  for (var key in from) {
    to[key] = from[key]
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isObject = function (obj) {
  return obj && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 *
 * @param {*} obj
 * @return {Boolean}
 */

var toString = Object.prototype.toString
exports.isPlainObject = function (obj) {
  return toString.call(obj) === '[object Object]'
}

/**
 * Array type check.
 *
 * @param {*} obj
 * @return {Boolean}
 */

exports.isArray = function (obj) {
  return Array.isArray(obj)
}

/**
 * Define a non-enumerable property
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 * @param {Boolean} [enumerable]
 */

exports.define = function (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value        : val,
    enumerable   : !!enumerable,
    writable     : true,
    configurable : true
  })
}

/**
 * Debounce a function so it only gets called after the
 * input stops arriving after the given wait period.
 *
 * @param {Function} func
 * @param {Number} wait
 * @return {Function} - the debounced function
 */

exports.debounce = function(func, wait) {
  var timeout, args, context, timestamp, result
  var later = function() {
    var last = Date.now() - timestamp
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      result = func.apply(context, args)
      if (!timeout) context = args = null
    }
  }
  return function() {
    context = this
    args = arguments
    timestamp = Date.now()
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    return result
  }
}
},{}],63:[function(require,module,exports){
var _ = require('./index')
var extend = _.extend

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 *
 * All strategy functions follow the same signature:
 *
 * @param {*} parentVal
 * @param {*} childVal
 * @param {Vue} [vm]
 */

var strats = Object.create(null)

/**
 * Helper that recursively merges two data objects together.
 */

function mergeData (to, from) {
  var key, toVal, fromVal
  for (key in from) {
    toVal = to[key]
    fromVal = from[key]
    if (!to.hasOwnProperty(key)) {
      to.$add(key, fromVal)
    } else if (_.isObject(toVal) && _.isObject(fromVal)) {
      mergeData(toVal, fromVal)
    }
  }
  return to
}

/**
 * Data
 */

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      _.warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.'
      )
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else {
    // instance merge, return raw object
    var instanceData = typeof childVal === 'function'
      ? childVal.call(vm)
      : childVal
    var defaultData = typeof parentVal === 'function'
      ? parentVal.call(vm)
      : undefined
    if (instanceData) {
      return mergeData(instanceData, defaultData)
    } else {
      return defaultData
    }
  }
}

/**
 * El
 */

strats.el = function (parentVal, childVal, vm) {
  if (!vm && childVal && typeof childVal !== 'function') {
    _.warn(
      'The "el" option should be a function ' +
      'that returns a per-instance value in component ' +
      'definitions.'
    )
    return
  }
  var ret = childVal || parentVal
  // invoke the element factory if this is instance merge
  return vm && typeof ret === 'function'
    ? ret.call(vm)
    : ret
}

/**
 * Hooks and param attributes are merged as arrays.
 */

strats.created =
strats.ready =
strats.attached =
strats.detached =
strats.beforeCompile =
strats.compiled =
strats.beforeDestroy =
strats.destroyed =
strats.paramAttributes = function (parentVal, childVal) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : _.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */

strats.directives =
strats.filters =
strats.partials =
strats.transitions =
strats.components = function (parentVal, childVal, vm, key) {
  var ret = Object.create(
    vm && vm.$parent
      ? vm.$parent.$options[key]
      : _.Vue.options[key]
  )
  if (parentVal) {
    var keys = Object.keys(parentVal)
    var i = keys.length
    var field
    while (i--) {
      field = keys[i]
      ret[field] = parentVal[field]
    }
  }
  if (childVal) extend(ret, childVal)
  return ret
}

/**
 * Events & Watchers.
 *
 * Events & watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */

strats.watch =
strats.events = function (parentVal, childVal) {
  if (!childVal) return parentVal
  if (!parentVal) return childVal
  var ret = {}
  extend(ret, parentVal)
  for (var key in childVal) {
    var parent = ret[key]
    var child = childVal[key]
    if (parent && !_.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child]
  }
  return ret
}

/**
 * Other object hashes.
 */

strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) return parentVal
  if (!parentVal) return childVal
  var ret = Object.create(parentVal)
  extend(ret, childVal)
  return ret
}

/**
 * Default strategy.
 */

var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
}

/**
 * Make sure component options get converted to actual
 * constructors.
 *
 * @param {Object} components
 */

function guardComponents (components) {
  if (components) {
    var def
    for (var key in components) {
      def = components[key]
      if (_.isPlainObject(def)) {
        def.name = key
        components[key] = _.Vue.extend(def)
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 *
 * @param {Object} parent
 * @param {Object} child
 * @param {Vue} [vm] - if vm is present, indicates this is
 *                     an instantiation merge.
 */

module.exports = function mergeOptions (parent, child, vm) {
  guardComponents(child.components)
  var options = {}
  var key
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm)
    }
  }
  for (key in parent) {
    merge(key)
  }
  for (key in child) {
    if (!(parent.hasOwnProperty(key))) {
      merge(key)
    }
  }
  function merge (key) {
    var strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  return options
}
},{"./index":61}],64:[function(require,module,exports){
var _ = require('./util')
var extend = _.extend

/**
 * The exposed Vue constructor.
 *
 * API conventions:
 * - public API methods/properties are prefiexed with `$`
 * - internal methods/properties are prefixed with `_`
 * - non-prefixed properties are assumed to be proxied user
 *   data.
 *
 * @constructor
 * @param {Object} [options]
 * @public
 */

function Vue (options) {
  this._init(options)
}

/**
 * Mixin global API
 */

extend(Vue, require('./api/global'))

/**
 * Vue and every constructor that extends Vue has an
 * associated options object, which can be accessed during
 * compilation steps as `this.constructor.options`.
 *
 * These can be seen as the default options of every
 * Vue instance.
 */

Vue.options = {
  directives  : require('./directives'),
  filters     : require('./filters'),
  partials    : {},
  transitions : {},
  components  : {}
}

/**
 * Build up the prototype
 */

var p = Vue.prototype

/**
 * $data has a setter which does a bunch of
 * teardown/setup work
 */

Object.defineProperty(p, '$data', {
  get: function () {
    return this._data
  },
  set: function (newData) {
    this._setData(newData)
  }
})

/**
 * Mixin internal instance methods
 */

extend(p, require('./instance/init'))
extend(p, require('./instance/events'))
extend(p, require('./instance/scope'))
extend(p, require('./instance/compile'))

/**
 * Mixin public API methods
 */

extend(p, require('./api/data'))
extend(p, require('./api/dom'))
extend(p, require('./api/events'))
extend(p, require('./api/child'))
extend(p, require('./api/lifecycle'))

module.exports = _.Vue = Vue
},{"./api/child":4,"./api/data":5,"./api/dom":6,"./api/events":7,"./api/global":8,"./api/lifecycle":9,"./directives":24,"./filters":40,"./instance/compile":41,"./instance/events":42,"./instance/init":43,"./instance/scope":44,"./util":61}],65:[function(require,module,exports){
var _ = require('./util')
var config = require('./config')
var Observer = require('./observer')
var expParser = require('./parsers/expression')
var batcher = require('./batcher')
var uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 *
 * @param {Vue} vm
 * @param {String} expression
 * @param {Function} cb
 * @param {Object} options
 *                 - {Array} filters
 *                 - {Boolean} twoWay
 *                 - {Boolean} deep
 *                 - {Boolean} user
 * @constructor
 */

function Watcher (vm, expression, cb, options) {
  this.vm = vm
  vm._watcherList.push(this)
  this.expression = expression
  this.cbs = [cb]
  this.id = ++uid // uid for batching
  this.active = true
  options = options || {}
  this.deep = !!options.deep
  this.user = !!options.user
  this.deps = Object.create(null)
  // setup filters if any.
  // We delegate directive filters here to the watcher
  // because they need to be included in the dependency
  // collection process.
  if (options.filters) {
    this.readFilters = options.filters.read
    this.writeFilters = options.filters.write
  }
  // parse expression for getter/setter
  var res = expParser.parse(expression, options.twoWay)
  this.getter = res.get
  this.setter = res.set
  this.value = this.get()
}

var p = Watcher.prototype

/**
 * Add a dependency to this directive.
 *
 * @param {Dep} dep
 */

p.addDep = function (dep) {
  var id = dep.id
  if (!this.newDeps[id]) {
    this.newDeps[id] = dep
    if (!this.deps[id]) {
      this.deps[id] = dep
      dep.addSub(this)
    }
  }
}

/**
 * Evaluate the getter, and re-collect dependencies.
 */

p.get = function () {
  this.beforeGet()
  var vm = this.vm
  var value
  try {
    value = this.getter.call(vm, vm)
  } catch (e) {
    if (config.warnExpressionErrors) {
      _.warn(
        'Error when evaluating expression "' +
        this.expression + '":\n   ' + e
      )
    }
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value)
  }
  value = _.applyFilters(value, this.readFilters, vm)
  this.afterGet()
  return value
}

/**
 * Set the corresponding value with the setter.
 *
 * @param {*} value
 */

p.set = function (value) {
  var vm = this.vm
  value = _.applyFilters(
    value, this.writeFilters, vm, this.value
  )
  try {
    this.setter.call(vm, vm, value)
  } catch (e) {
    if (config.warnExpressionErrors) {
      _.warn(
        'Error when evaluating setter "' +
        this.expression + '":\n   ' + e
      )
    }
  }
}

/**
 * Prepare for dependency collection.
 */

p.beforeGet = function () {
  Observer.target = this
  this.newDeps = {}
}

/**
 * Clean up for dependency collection.
 */

p.afterGet = function () {
  Observer.target = null
  for (var id in this.deps) {
    if (!this.newDeps[id]) {
      this.deps[id].removeSub(this)
    }
  }
  this.deps = this.newDeps
}

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */

p.update = function () {
  if (!config.async || config.debug) {
    this.run()
  } else {
    batcher.push(this)
  }
}

/**
 * Batcher job interface.
 * Will be called by the batcher.
 */

p.run = function () {
  if (this.active) {
    var value = this.get()
    if (
      value !== this.value ||
      Array.isArray(value) ||
      this.deep
    ) {
      var oldValue = this.value
      this.value = value
      var cbs = this.cbs
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i](value, oldValue)
        // if a callback also removed other callbacks,
        // we need to adjust the loop accordingly.
        var removed = l - cbs.length
        if (removed) {
          i -= removed
          l -= removed
        }
      }
    }
  }
}

/**
 * Add a callback.
 *
 * @param {Function} cb
 */

p.addCb = function (cb) {
  this.cbs.push(cb)
}

/**
 * Remove a callback.
 *
 * @param {Function} cb
 */

p.removeCb = function (cb) {
  var cbs = this.cbs
  if (cbs.length > 1) {
    var i = cbs.indexOf(cb)
    if (i > -1) {
      cbs.splice(i, 1)
    }
  } else if (cb === cbs[0]) {
    this.teardown()
  }
}

/**
 * Remove self from all dependencies' subcriber list.
 */

p.teardown = function () {
  if (this.active) {
    // remove self from vm's watcher list
    // we can skip this if the vm if being destroyed
    // which can improve teardown performance.
    if (!this.vm._isBeingDestroyed) {
      var list = this.vm._watcherList
      list.splice(list.indexOf(this))
    }
    for (var id in this.deps) {
      this.deps[id].removeSub(this)
    }
    this.active = false
    this.vm = this.cbs = this.value = null
  }
}


/**
 * Recrusively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 *
 * @param {Object} obj
 */

function traverse (obj) {
  var key, val, i
  for (key in obj) {
    val = obj[key]
    if (_.isArray(val)) {
      i = val.length
      while (i--) traverse(val[i])
    } else if (_.isObject(val)) {
      traverse(val)
    }
  }
}

module.exports = Watcher
},{"./batcher":10,"./config":14,"./observer":47,"./parsers/expression":50,"./util":61}],66:[function(require,module,exports){
module.exports = '<template v-if="model">\n	<a href="#/{{ model.property }}/new" class="btn btn-success pull-right">Add new {{ model.label | lowercase }}</a>\n	<table class="table table-hover">\n		<thead>\n			<tr>\n				<th v-repeat="model.fields">{{ label }}</th>\n				<th colspan="2"></th>\n			</tr>\n		</thead>\n		<tbody v-if="entries">\n			<tr v-repeat="entry : entries" v-on="click: edit($event, $key)" data-id="{{ $key }}" class="clickable">\n				<td v-repeat="model.fields">{{ entry[property] }}</td>\n				<td></td>\n				<td></td>\n			</tr>\n		</tbody>\n		<tbody v-if="!entries">\n			<tr>\n				<td colspan="{{ model.fields.length + 2 }}">\n					<em class="text-muted">Loading {{ model.label | lowercase | plural }}&hellip;</em>\n				</td>\n			</tr>\n		</tbody>\n	</table>\n</template>\n';
},{}],67:[function(require,module,exports){
var Firebase = require('firebase')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	inherit: true,
	template: require('./entries.html'),
	methods: {
		activateModel: function (model) {
			this.entries = null
			dataRef.child(model).once('value', function (snapshot) {
				this.entries = snapshot.val()
			}.bind(this))
		},
		edit: function (event, id) {
			event.preventDefault()
			if (id) {
				location.assign('#/' + this.activeModel + '/' + id)
			}
		}
	},
	data: function () {
		return {
			entries: null
		}
	},
	created: function () {
		if (this.activeModel) {
			this.activateModel(this.activeModel)
		}
	},
	watch: {
		activeModel: function (model) {
			this.activateModel(model)
		}
	}
}

},{"./entries.html":66,"firebase":2}],68:[function(require,module,exports){
module.exports = '<form v-if="isReady" v-on="submit: save($event)" class="form-horizontal">\n	<fieldset>\n		<legend v-if="isNew">\n			New {{ model.label | lowercase }}\n		</legend>\n		<legend v-if="!isNew">\n			Edit {{ model.label | lowercase }}\n			<small class="text-muted pull-right">{{ activeEntry }}</small>\n		</legend>\n\n		<div v-repeat="model.fields" v-component="{{ componentFor(type) }}"></div>\n		<div class="form-group">\n			<div class="col-sm-offset-2 col-sm-2">\n				<button class="btn btn-success btn-lg" type="submit">Save</button>\n			</div>\n		</div>\n	</fieldset>\n</form>\n<em v-if="!isReady" class="text-muted">Loading {{ model.label | lowercase }}&hellip;</em>\n';
},{}],69:[function(require,module,exports){
var Firebase = require('firebase')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	inherit: true,
	template: require('./entry.html'),
	components: {
		textField: require('../fields/text'),
		markdownField: require('../fields/markdown')
	},
	methods: {
		componentFor: function (type) {
			switch (type) {
				case 'markdown':
					return 'markdownField'
				default:
					return 'textField'
			}
		},
		loadEntry: function (id) {
			this.entry = null
			if (id === 'new') return

			dataRef.child(this.activeModel).child(id).once('value', function (snapshot) {
				this.entry = snapshot.val()
			}.bind(this))
		}
	},
	data: function () {
		return {
			entry: null
		}
	},
	computed: {
		isNew: function () {
			return this.activeEntry === 'new'
		},
		isReady: function () {
			return this.entry || this.isNew
		}
	},
	created: function () {
		if (this.activeEntry) {
			this.loadEntry(this.activeEntry)
		}
	},
	watch: {
		activeEntry: function (id) {
			this.loadEntry(id)
		}
	}
}

},{"../fields/markdown":70,"../fields/text":72,"./entry.html":68,"firebase":2}],70:[function(require,module,exports){
module.exports = {
	inherit: true,
	replace: true,
	template: require('./markdown.html'),
	computed: {
		// TODO: setter
		value: function () {
			return this.entry
				? this.entry[this.property]
				: null
		}
	}
}

},{"./markdown.html":71}],71:[function(require,module,exports){
module.exports = '<div class="form-group">\n	<label class="control-label col-sm-2">{{ label }}</label>\n	<div class="col-sm-6">\n		<textarea rows="12" class="form-control" v-model="value" v-attr="required: required"></textarea>\n	</div>\n</div>\n';
},{}],72:[function(require,module,exports){
module.exports = {
	inherit: true,
	replace: true,
	template: require('./text.html'),
	computed: {
		// TODO: setter
		value: function () {
			return this.entry
				? this.entry[this.property]
				: null
		}
	}
}

},{"./text.html":73}],73:[function(require,module,exports){
module.exports = '<div class="form-group">\n	<label class="control-label col-sm-2">{{ label }}</label>\n	<div class="col-sm-6">\n		<input class="form-control" v-model="value" v-attr="type: type, required: required">\n	</div>\n</div>\n';
},{}],74:[function(require,module,exports){
module.exports = {
	inherit: true,
	template: require('./nav.html')
}

},{"./nav.html":75}],75:[function(require,module,exports){
module.exports = '<div class="list-group">\n	<a v-repeat="models" href="#/{{ property }}" class="list-group-item {{ activeModel === property ? \'active\' : \'\' }}">{{ label | plural }}</a>\n</div>\n';
},{}],76:[function(require,module,exports){
module.exports = '<div class="container">\n	<div class="row">\n		<div class="col-sm-2">\n			<input type="text" class="form-control" placeholder="Find content&hellip;">\n			<hr>\n			<div v-component="nav"></div>\n		</div>\n		<div class="col-sm-10">\n			<div v-component="{{ view }}"></div>\n		</div>\n	</div>\n</div>\n';
},{}],77:[function(require,module,exports){
var Vue = require('vue')
var director = require('director')
var pluralize = require('pluralize')

var app = new Vue({
	el: document.body,
	template: require('./container.html'),
	components: {
		nav: require('./components/nav'),
		entries: require('./components/entries'),
		entry: require('./components/entry')
	},
	filters: {
		plural: function (value) {
			return pluralize(value)
		}
	},
	data: function () {
		var models = require('./models')

		return {
			view: null,
			models: models,
			activeModel: null,
			model: null,
			activeEntry: null,
			entry: null
		}
	}
})


var router = new director.Router()

router.on('/', function () {
	location.replace('#/' + app.models[0].property)
})

router.on('/:type', function (type) {
	app.view = 'entries'
	app.activeModel = null
	app.model = null

	app.models.forEach(function (model) {
		if (type === model.property) {
			app.activeModel = type
			app.model = model
		}
	})
})

router.on('/:type/:id', function (type, id) {
	app.view = 'entry'
	app.activeModel = null
	app.model = null
	app.activeEntry = id

	app.models.forEach(function (model) {
		if (type === model.property) {
			app.activeModel = type
			app.model = model
		}
	})
})

router.configure({
	notfound: function () {
		console.log('No route found for path:', this.path)
	}
})

router.init('/')

},{"./components/entries":67,"./components/entry":69,"./components/nav":74,"./container.html":76,"./models":79,"director":1,"pluralize":3,"vue":64}],78:[function(require,module,exports){
module.exports = {
	label: 'Author',
	property: 'authors',
	type: 'collection',
	fields: [
		{
			label: 'Name',
			property: 'name',
			type: 'text',
			required: true,
			listed: true
		},
		{
			label: 'Twitter',
			property: 'twitter',
			type: 'text',
			required: true,
			listed: true
		}
	]
}

},{}],79:[function(require,module,exports){
module.exports = [
	require('./post'),
	require('./author')
]

},{"./author":78,"./post":80}],80:[function(require,module,exports){
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

},{}]},{},[77])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGlyZWN0b3IvYnVpbGQvZGlyZWN0b3IuanMiLCJub2RlX21vZHVsZXMvZmlyZWJhc2UvbGliL2ZpcmViYXNlLXdlYi5qcyIsIm5vZGVfbW9kdWxlcy9wbHVyYWxpemUvcGx1cmFsaXplLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2NoaWxkLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2RhdGEuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvZG9tLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2FwaS9nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvbGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmF0Y2hlci5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NhY2hlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY29tcGlsZXIvY29tcGlsZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NvbXBpbGVyL3RyYW5zY2x1ZGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9jb25maWcuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2F0dHIuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2NsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9jbG9hay5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9lbC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9odG1sLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9pZi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL2NoZWNrYm94LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9kZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvbW9kZWwvcmFkaW8uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL3NlbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvb24uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3BhcnRpYWwuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3JlZi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9zaG93LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9zdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvdGV4dC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvdHJhbnNpdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvd2l0aC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2ZpbHRlcnMvYXJyYXktZmlsdGVycy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2ZpbHRlcnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9jb21waWxlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2UvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2UvaW5pdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2luc3RhbmNlL3Njb3BlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvb2JzZXJ2ZXIvYXJyYXkuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9vYnNlcnZlci9kZXAuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9vYnNlcnZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyL29iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy9leHByZXNzaW9uLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy9wYXRoLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy90ZW1wbGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvdGV4dC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3RyYW5zaXRpb24vY3NzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdHJhbnNpdGlvbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3RyYW5zaXRpb24vanMuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2RlYnVnLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9kb20uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2Vudi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvZmlsdGVyLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvbGFuZy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvbWVyZ2Utb3B0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdnVlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvd2F0Y2hlci5qcyIsInNyYy9jb21wb25lbnRzL2VudHJpZXMvZW50cmllcy5odG1sIiwic3JjL2NvbXBvbmVudHMvZW50cmllcy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2VudHJ5L2VudHJ5Lmh0bWwiLCJzcmMvY29tcG9uZW50cy9lbnRyeS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy9tYXJrZG93bi9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy9tYXJrZG93bi9tYXJrZG93bi5odG1sIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL3RleHQvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9maWVsZHMvdGV4dC90ZXh0Lmh0bWwiLCJzcmMvY29tcG9uZW50cy9uYXYvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9uYXYvbmF2Lmh0bWwiLCJzcmMvY29udGFpbmVyLmh0bWwiLCJzcmMvaW5kZXguanMiLCJzcmMvbW9kZWxzL2F1dGhvci5qcyIsInNyYy9tb2RlbHMvaW5kZXguanMiLCJzcmMvbW9kZWxzL3Bvc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hRQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcblxuLy9cbi8vIEdlbmVyYXRlZCBvbiBUdWUgRGVjIDE2IDIwMTQgMTI6MTM6NDcgR01UKzAxMDAgKENFVCkgYnkgQ2hhcmxpZSBSb2JiaW5zLCBQYW9sbyBGcmFnb21lbmkgJiB0aGUgQ29udHJpYnV0b3JzIChVc2luZyBDb2Rlc3VyZ2VvbikuXG4vLyBWZXJzaW9uIDEuMi42XG4vL1xuXG4oZnVuY3Rpb24gKGV4cG9ydHMpIHtcblxuLypcbiAqIGJyb3dzZXIuanM6IEJyb3dzZXIgc3BlY2lmaWMgZnVuY3Rpb25hbGl0eSBmb3IgZGlyZWN0b3IuXG4gKlxuICogKEMpIDIwMTEsIENoYXJsaWUgUm9iYmlucywgUGFvbG8gRnJhZ29tZW5pLCAmIHRoZSBDb250cmlidXRvcnMuXG4gKiBNSVQgTElDRU5TRVxuICpcbiAqL1xuXG52YXIgZGxvYyA9IGRvY3VtZW50LmxvY2F0aW9uO1xuXG5mdW5jdGlvbiBkbG9jSGFzaEVtcHR5KCkge1xuICAvLyBOb24tSUUgYnJvd3NlcnMgcmV0dXJuICcnIHdoZW4gdGhlIGFkZHJlc3MgYmFyIHNob3dzICcjJzsgRGlyZWN0b3IncyBsb2dpY1xuICAvLyBhc3N1bWVzIGJvdGggbWVhbiBlbXB0eS5cbiAgcmV0dXJuIGRsb2MuaGFzaCA9PT0gJycgfHwgZGxvYy5oYXNoID09PSAnIyc7XG59XG5cbnZhciBsaXN0ZW5lciA9IHtcbiAgbW9kZTogJ21vZGVybicsXG4gIGhhc2g6IGRsb2MuaGFzaCxcbiAgaGlzdG9yeTogZmFsc2UsXG5cbiAgY2hlY2s6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaCA9IGRsb2MuaGFzaDtcbiAgICBpZiAoaCAhPSB0aGlzLmhhc2gpIHtcbiAgICAgIHRoaXMuaGFzaCA9IGg7XG4gICAgICB0aGlzLm9uSGFzaENoYW5nZWQoKTtcbiAgICB9XG4gIH0sXG5cbiAgZmlyZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdtb2Rlcm4nKSB7XG4gICAgICB0aGlzLmhpc3RvcnkgPT09IHRydWUgPyB3aW5kb3cub25wb3BzdGF0ZSgpIDogd2luZG93Lm9uaGFzaGNoYW5nZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMub25IYXNoQ2hhbmdlZCgpO1xuICAgIH1cbiAgfSxcblxuICBpbml0OiBmdW5jdGlvbiAoZm4sIGhpc3RvcnkpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5oaXN0b3J5ID0gaGlzdG9yeTtcblxuICAgIGlmICghUm91dGVyLmxpc3RlbmVycykge1xuICAgICAgUm91dGVyLmxpc3RlbmVycyA9IFtdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9uY2hhbmdlKG9uQ2hhbmdlRXZlbnQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gUm91dGVyLmxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgUm91dGVyLmxpc3RlbmVyc1tpXShvbkNoYW5nZUV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL25vdGUgSUU4IGlzIGJlaW5nIGNvdW50ZWQgYXMgJ21vZGVybicgYmVjYXVzZSBpdCBoYXMgdGhlIGhhc2hjaGFuZ2UgZXZlbnRcbiAgICBpZiAoJ29uaGFzaGNoYW5nZScgaW4gd2luZG93ICYmIChkb2N1bWVudC5kb2N1bWVudE1vZGUgPT09IHVuZGVmaW5lZFxuICAgICAgfHwgZG9jdW1lbnQuZG9jdW1lbnRNb2RlID4gNykpIHtcbiAgICAgIC8vIEF0IGxlYXN0IGZvciBub3cgSFRNTDUgaGlzdG9yeSBpcyBhdmFpbGFibGUgZm9yICdtb2Rlcm4nIGJyb3dzZXJzIG9ubHlcbiAgICAgIGlmICh0aGlzLmhpc3RvcnkgPT09IHRydWUpIHtcbiAgICAgICAgLy8gVGhlcmUgaXMgYW4gb2xkIGJ1ZyBpbiBDaHJvbWUgdGhhdCBjYXVzZXMgb25wb3BzdGF0ZSB0byBmaXJlIGV2ZW5cbiAgICAgICAgLy8gdXBvbiBpbml0aWFsIHBhZ2UgbG9hZC4gU2luY2UgdGhlIGhhbmRsZXIgaXMgcnVuIG1hbnVhbGx5IGluIGluaXQoKSxcbiAgICAgICAgLy8gdGhpcyB3b3VsZCBjYXVzZSBDaHJvbWUgdG8gcnVuIGl0IHR3aXNlLiBDdXJyZW50bHkgdGhlIG9ubHlcbiAgICAgICAgLy8gd29ya2Fyb3VuZCBzZWVtcyB0byBiZSB0byBzZXQgdGhlIGhhbmRsZXIgYWZ0ZXIgdGhlIGluaXRpYWwgcGFnZSBsb2FkXG4gICAgICAgIC8vIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTYzMDQwXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2luZG93Lm9ucG9wc3RhdGUgPSBvbmNoYW5nZTtcbiAgICAgICAgfSwgNTAwKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cub25oYXNoY2hhbmdlID0gb25jaGFuZ2U7XG4gICAgICB9XG4gICAgICB0aGlzLm1vZGUgPSAnbW9kZXJuJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvL1xuICAgICAgLy8gSUUgc3VwcG9ydCwgYmFzZWQgb24gYSBjb25jZXB0IGJ5IEVyaWsgQXJ2aWRzb24gLi4uXG4gICAgICAvL1xuICAgICAgdmFyIGZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gICAgICBmcmFtZS5pZCA9ICdzdGF0ZS1mcmFtZSc7XG4gICAgICBmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmcmFtZSk7XG4gICAgICB0aGlzLndyaXRlRnJhbWUoJycpO1xuXG4gICAgICBpZiAoJ29ucHJvcGVydHljaGFuZ2UnIGluIGRvY3VtZW50ICYmICdhdHRhY2hFdmVudCcgaW4gZG9jdW1lbnQpIHtcbiAgICAgICAgZG9jdW1lbnQuYXR0YWNoRXZlbnQoJ29ucHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGV2ZW50LnByb3BlcnR5TmFtZSA9PT0gJ2xvY2F0aW9uJykge1xuICAgICAgICAgICAgc2VsZi5jaGVjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7IHNlbGYuY2hlY2soKTsgfSwgNTApO1xuXG4gICAgICB0aGlzLm9uSGFzaENoYW5nZWQgPSBvbmNoYW5nZTtcbiAgICAgIHRoaXMubW9kZSA9ICdsZWdhY3knO1xuICAgIH1cblxuICAgIFJvdXRlci5saXN0ZW5lcnMucHVzaChmbik7XG5cbiAgICByZXR1cm4gdGhpcy5tb2RlO1xuICB9LFxuXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIChmbikge1xuICAgIGlmICghUm91dGVyIHx8ICFSb3V0ZXIubGlzdGVuZXJzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGxpc3RlbmVycyA9IFJvdXRlci5saXN0ZW5lcnM7XG5cbiAgICBmb3IgKHZhciBpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAobGlzdGVuZXJzW2ldID09PSBmbikge1xuICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzZXRIYXNoOiBmdW5jdGlvbiAocykge1xuICAgIC8vIE1vemlsbGEgYWx3YXlzIGFkZHMgYW4gZW50cnkgdG8gdGhlIGhpc3RvcnlcbiAgICBpZiAodGhpcy5tb2RlID09PSAnbGVnYWN5Jykge1xuICAgICAgdGhpcy53cml0ZUZyYW1lKHMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhpc3RvcnkgPT09IHRydWUpIHtcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgZG9jdW1lbnQudGl0bGUsIHMpO1xuICAgICAgLy8gRmlyZSBhbiBvbnBvcHN0YXRlIGV2ZW50IG1hbnVhbGx5IHNpbmNlIHB1c2hpbmcgZG9lcyBub3Qgb2J2aW91c2x5XG4gICAgICAvLyB0cmlnZ2VyIHRoZSBwb3AgZXZlbnQuXG4gICAgICB0aGlzLmZpcmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGxvYy5oYXNoID0gKHNbMF0gPT09ICcvJykgPyBzIDogJy8nICsgcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgd3JpdGVGcmFtZTogZnVuY3Rpb24gKHMpIHtcbiAgICAvLyBJRSBzdXBwb3J0Li4uXG4gICAgdmFyIGYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhdGUtZnJhbWUnKTtcbiAgICB2YXIgZCA9IGYuY29udGVudERvY3VtZW50IHx8IGYuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgICBkLm9wZW4oKTtcbiAgICBkLndyaXRlKFwiPHNjcmlwdD5faGFzaCA9ICdcIiArIHMgKyBcIic7IG9ubG9hZCA9IHBhcmVudC5saXN0ZW5lci5zeW5jSGFzaDs8c2NyaXB0PlwiKTtcbiAgICBkLmNsb3NlKCk7XG4gIH0sXG5cbiAgc3luY0hhc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBJRSBzdXBwb3J0Li4uXG4gICAgdmFyIHMgPSB0aGlzLl9oYXNoO1xuICAgIGlmIChzICE9IGRsb2MuaGFzaCkge1xuICAgICAgZGxvYy5oYXNoID0gcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25IYXNoQ2hhbmdlZDogZnVuY3Rpb24gKCkge31cbn07XG5cbnZhciBSb3V0ZXIgPSBleHBvcnRzLlJvdXRlciA9IGZ1bmN0aW9uIChyb3V0ZXMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJvdXRlcikpIHJldHVybiBuZXcgUm91dGVyKHJvdXRlcyk7XG5cbiAgdGhpcy5wYXJhbXMgICA9IHt9O1xuICB0aGlzLnJvdXRlcyAgID0ge307XG4gIHRoaXMubWV0aG9kcyAgPSBbJ29uJywgJ29uY2UnLCAnYWZ0ZXInLCAnYmVmb3JlJ107XG4gIHRoaXMuc2NvcGUgICAgPSBbXTtcbiAgdGhpcy5fbWV0aG9kcyA9IHt9O1xuXG4gIHRoaXMuX2luc2VydCA9IHRoaXMuaW5zZXJ0O1xuICB0aGlzLmluc2VydCA9IHRoaXMuaW5zZXJ0RXg7XG5cbiAgdGhpcy5oaXN0b3J5U3VwcG9ydCA9ICh3aW5kb3cuaGlzdG9yeSAhPSBudWxsID8gd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlIDogbnVsbCkgIT0gbnVsbFxuXG4gIHRoaXMuY29uZmlndXJlKCk7XG4gIHRoaXMubW91bnQocm91dGVzIHx8IHt9KTtcbn07XG5cblJvdXRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChyKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICAgICwgcm91dGVUbztcbiAgdGhpcy5oYW5kbGVyID0gZnVuY3Rpb24ob25DaGFuZ2VFdmVudCkge1xuICAgIHZhciBuZXdVUkwgPSBvbkNoYW5nZUV2ZW50ICYmIG9uQ2hhbmdlRXZlbnQubmV3VVJMIHx8IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIHZhciB1cmwgPSBzZWxmLmhpc3RvcnkgPT09IHRydWUgPyBzZWxmLmdldFBhdGgoKSA6IG5ld1VSTC5yZXBsYWNlKC8uKiMvLCAnJyk7XG4gICAgc2VsZi5kaXNwYXRjaCgnb24nLCB1cmwuY2hhckF0KDApID09PSAnLycgPyB1cmwgOiAnLycgKyB1cmwpO1xuICB9O1xuXG4gIGxpc3RlbmVyLmluaXQodGhpcy5oYW5kbGVyLCB0aGlzLmhpc3RvcnkpO1xuXG4gIGlmICh0aGlzLmhpc3RvcnkgPT09IGZhbHNlKSB7XG4gICAgaWYgKGRsb2NIYXNoRW1wdHkoKSAmJiByKSB7XG4gICAgICBkbG9jLmhhc2ggPSByO1xuICAgIH0gZWxzZSBpZiAoIWRsb2NIYXNoRW1wdHkoKSkge1xuICAgICAgc2VsZi5kaXNwYXRjaCgnb24nLCAnLycgKyBkbG9jLmhhc2gucmVwbGFjZSgvXigjXFwvfCN8XFwvKS8sICcnKSk7XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGlmICh0aGlzLmNvbnZlcnRfaGFzaF9pbl9pbml0KSB7XG4gICAgICAvLyBVc2UgaGFzaCBhcyByb3V0ZVxuICAgICAgcm91dGVUbyA9IGRsb2NIYXNoRW1wdHkoKSAmJiByID8gciA6ICFkbG9jSGFzaEVtcHR5KCkgPyBkbG9jLmhhc2gucmVwbGFjZSgvXiMvLCAnJykgOiBudWxsO1xuICAgICAgaWYgKHJvdXRlVG8pIHtcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCBkb2N1bWVudC50aXRsZSwgcm91dGVUbyk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gVXNlIGNhbm9uaWNhbCB1cmxcbiAgICAgIHJvdXRlVG8gPSB0aGlzLmdldFBhdGgoKTtcbiAgICB9XG5cbiAgICAvLyBSb3V0ZXIgaGFzIGJlZW4gaW5pdGlhbGl6ZWQsIGJ1dCBkdWUgdG8gdGhlIGNocm9tZSBidWcgaXQgd2lsbCBub3RcbiAgICAvLyB5ZXQgYWN0dWFsbHkgcm91dGUgSFRNTDUgaGlzdG9yeSBzdGF0ZSBjaGFuZ2VzLiBUaHVzLCBkZWNpZGUgaWYgc2hvdWxkIHJvdXRlLlxuICAgIGlmIChyb3V0ZVRvIHx8IHRoaXMucnVuX2luX2luaXQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuaGFuZGxlcigpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuUm91dGVyLnByb3RvdHlwZS5leHBsb2RlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdiA9IHRoaXMuaGlzdG9yeSA9PT0gdHJ1ZSA/IHRoaXMuZ2V0UGF0aCgpIDogZGxvYy5oYXNoO1xuICBpZiAodi5jaGFyQXQoMSkgPT09ICcvJykgeyB2PXYuc2xpY2UoMSkgfVxuICByZXR1cm4gdi5zbGljZSgxLCB2Lmxlbmd0aCkuc3BsaXQoXCIvXCIpO1xufTtcblxuUm91dGVyLnByb3RvdHlwZS5zZXRSb3V0ZSA9IGZ1bmN0aW9uIChpLCB2LCB2YWwpIHtcbiAgdmFyIHVybCA9IHRoaXMuZXhwbG9kZSgpO1xuXG4gIGlmICh0eXBlb2YgaSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XG4gICAgdXJsW2ldID0gdjtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIHVybC5zcGxpY2UoaSwgdiwgcyk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdXJsID0gW2ldO1xuICB9XG5cbiAgbGlzdGVuZXIuc2V0SGFzaCh1cmwuam9pbignLycpKTtcbiAgcmV0dXJuIHVybDtcbn07XG5cbi8vXG4vLyAjIyMgZnVuY3Rpb24gaW5zZXJ0RXgobWV0aG9kLCBwYXRoLCByb3V0ZSwgcGFyZW50KVxuLy8gIyMjIyBAbWV0aG9kIHtzdHJpbmd9IE1ldGhvZCB0byBpbnNlcnQgdGhlIHNwZWNpZmljIGByb3V0ZWAuXG4vLyAjIyMjIEBwYXRoIHtBcnJheX0gUGFyc2VkIHBhdGggdG8gaW5zZXJ0IHRoZSBgcm91dGVgIGF0LlxuLy8gIyMjIyBAcm91dGUge0FycmF5fGZ1bmN0aW9ufSBSb3V0ZSBoYW5kbGVycyB0byBpbnNlcnQuXG4vLyAjIyMjIEBwYXJlbnQge09iamVjdH0gKipPcHRpb25hbCoqIFBhcmVudCBcInJvdXRlc1wiIHRvIGluc2VydCBpbnRvLlxuLy8gaW5zZXJ0IGEgY2FsbGJhY2sgdGhhdCB3aWxsIG9ubHkgb2NjdXIgb25jZSBwZXIgdGhlIG1hdGNoZWQgcm91dGUuXG4vL1xuUm91dGVyLnByb3RvdHlwZS5pbnNlcnRFeCA9IGZ1bmN0aW9uKG1ldGhvZCwgcGF0aCwgcm91dGUsIHBhcmVudCkge1xuICBpZiAobWV0aG9kID09PSBcIm9uY2VcIikge1xuICAgIG1ldGhvZCA9IFwib25cIjtcbiAgICByb3V0ZSA9IGZ1bmN0aW9uKHJvdXRlKSB7XG4gICAgICB2YXIgb25jZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAob25jZSkgcmV0dXJuO1xuICAgICAgICBvbmNlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHJvdXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0ocm91dGUpO1xuICB9XG4gIHJldHVybiB0aGlzLl9pbnNlcnQobWV0aG9kLCBwYXRoLCByb3V0ZSwgcGFyZW50KTtcbn07XG5cblJvdXRlci5wcm90b3R5cGUuZ2V0Um91dGUgPSBmdW5jdGlvbiAodikge1xuICB2YXIgcmV0ID0gdjtcblxuICBpZiAodHlwZW9mIHYgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXQgPSB0aGlzLmV4cGxvZGUoKVt2XTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgdiA9PT0gXCJzdHJpbmdcIil7XG4gICAgdmFyIGggPSB0aGlzLmV4cGxvZGUoKTtcbiAgICByZXQgPSBoLmluZGV4T2Yodik7XG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0ID0gdGhpcy5leHBsb2RlKCk7XG4gIH1cblxuICByZXR1cm4gcmV0O1xufTtcblxuUm91dGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICBsaXN0ZW5lci5kZXN0cm95KHRoaXMuaGFuZGxlcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUm91dGVyLnByb3RvdHlwZS5nZXRQYXRoID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgaWYgKHBhdGguc3Vic3RyKDAsIDEpICE9PSAnLycpIHtcbiAgICBwYXRoID0gJy8nICsgcGF0aDtcbiAgfVxuICByZXR1cm4gcGF0aDtcbn07XG5mdW5jdGlvbiBfZXZlcnkoYXJyLCBpdGVyYXRvcikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChpdGVyYXRvcihhcnJbaV0sIGksIGFycikgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9mbGF0dGVuKGFycikge1xuICB2YXIgZmxhdCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbiA9IGFyci5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICBmbGF0ID0gZmxhdC5jb25jYXQoYXJyW2ldKTtcbiAgfVxuICByZXR1cm4gZmxhdDtcbn1cblxuZnVuY3Rpb24gX2FzeW5jRXZlcnlTZXJpZXMoYXJyLCBpdGVyYXRvciwgY2FsbGJhY2spIHtcbiAgaWYgKCFhcnIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cbiAgdmFyIGNvbXBsZXRlZCA9IDA7XG4gIChmdW5jdGlvbiBpdGVyYXRlKCkge1xuICAgIGl0ZXJhdG9yKGFycltjb21wbGV0ZWRdLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGlmIChlcnIgfHwgZXJyID09PSBmYWxzZSkge1xuICAgICAgICBjYWxsYmFjayhlcnIpO1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wbGV0ZWQgKz0gMTtcbiAgICAgICAgaWYgKGNvbXBsZXRlZCA9PT0gYXJyLmxlbmd0aCkge1xuICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlcmF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pKCk7XG59XG5cbmZ1bmN0aW9uIHBhcmFtaWZ5U3RyaW5nKHN0ciwgcGFyYW1zLCBtb2QpIHtcbiAgbW9kID0gc3RyO1xuICBmb3IgKHZhciBwYXJhbSBpbiBwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KHBhcmFtKSkge1xuICAgICAgbW9kID0gcGFyYW1zW3BhcmFtXShzdHIpO1xuICAgICAgaWYgKG1vZCAhPT0gc3RyKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gbW9kID09PSBzdHIgPyBcIihbLl9hLXpBLVowLTktJSgpXSspXCIgOiBtb2Q7XG59XG5cbmZ1bmN0aW9uIHJlZ2lmeVN0cmluZyhzdHIsIHBhcmFtcykge1xuICB2YXIgbWF0Y2hlcywgbGFzdCA9IDAsIG91dCA9IFwiXCI7XG4gIHdoaWxlIChtYXRjaGVzID0gc3RyLnN1YnN0cihsYXN0KS5tYXRjaCgvW15cXHdcXGRcXC0gJUAmXSpcXCpbXlxcd1xcZFxcLSAlQCZdKi8pKSB7XG4gICAgbGFzdCA9IG1hdGNoZXMuaW5kZXggKyBtYXRjaGVzWzBdLmxlbmd0aDtcbiAgICBtYXRjaGVzWzBdID0gbWF0Y2hlc1swXS5yZXBsYWNlKC9eXFwqLywgXCIoW18uKCkhXFxcXCAlQCZhLXpBLVowLTktXSspXCIpO1xuICAgIG91dCArPSBzdHIuc3Vic3RyKDAsIG1hdGNoZXMuaW5kZXgpICsgbWF0Y2hlc1swXTtcbiAgfVxuICBzdHIgPSBvdXQgKz0gc3RyLnN1YnN0cihsYXN0KTtcbiAgdmFyIGNhcHR1cmVzID0gc3RyLm1hdGNoKC86KFteXFwvXSspL2lnKSwgY2FwdHVyZSwgbGVuZ3RoO1xuICBpZiAoY2FwdHVyZXMpIHtcbiAgICBsZW5ndGggPSBjYXB0dXJlcy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY2FwdHVyZSA9IGNhcHR1cmVzW2ldO1xuICAgICAgaWYgKGNhcHR1cmUuc2xpY2UoMCwgMikgPT09IFwiOjpcIikge1xuICAgICAgICBzdHIgPSBjYXB0dXJlLnNsaWNlKDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoY2FwdHVyZSwgcGFyYW1pZnlTdHJpbmcoY2FwdHVyZSwgcGFyYW1zKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59XG5cbmZ1bmN0aW9uIHRlcm1pbmF0b3Iocm91dGVzLCBkZWxpbWl0ZXIsIHN0YXJ0LCBzdG9wKSB7XG4gIHZhciBsYXN0ID0gMCwgbGVmdCA9IDAsIHJpZ2h0ID0gMCwgc3RhcnQgPSAoc3RhcnQgfHwgXCIoXCIpLnRvU3RyaW5nKCksIHN0b3AgPSAoc3RvcCB8fCBcIilcIikudG9TdHJpbmcoKSwgaTtcbiAgZm9yIChpID0gMDsgaSA8IHJvdXRlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBjaHVuayA9IHJvdXRlc1tpXTtcbiAgICBpZiAoY2h1bmsuaW5kZXhPZihzdGFydCwgbGFzdCkgPiBjaHVuay5pbmRleE9mKHN0b3AsIGxhc3QpIHx8IH5jaHVuay5pbmRleE9mKHN0YXJ0LCBsYXN0KSAmJiAhfmNodW5rLmluZGV4T2Yoc3RvcCwgbGFzdCkgfHwgIX5jaHVuay5pbmRleE9mKHN0YXJ0LCBsYXN0KSAmJiB+Y2h1bmsuaW5kZXhPZihzdG9wLCBsYXN0KSkge1xuICAgICAgbGVmdCA9IGNodW5rLmluZGV4T2Yoc3RhcnQsIGxhc3QpO1xuICAgICAgcmlnaHQgPSBjaHVuay5pbmRleE9mKHN0b3AsIGxhc3QpO1xuICAgICAgaWYgKH5sZWZ0ICYmICF+cmlnaHQgfHwgIX5sZWZ0ICYmIH5yaWdodCkge1xuICAgICAgICB2YXIgdG1wID0gcm91dGVzLnNsaWNlKDAsIChpIHx8IDEpICsgMSkuam9pbihkZWxpbWl0ZXIpO1xuICAgICAgICByb3V0ZXMgPSBbIHRtcCBdLmNvbmNhdChyb3V0ZXMuc2xpY2UoKGkgfHwgMSkgKyAxKSk7XG4gICAgICB9XG4gICAgICBsYXN0ID0gKHJpZ2h0ID4gbGVmdCA/IHJpZ2h0IDogbGVmdCkgKyAxO1xuICAgICAgaSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhc3QgPSAwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcm91dGVzO1xufVxuXG52YXIgUVVFUllfU0VQQVJBVE9SID0gL1xcPy4qLztcblxuUm91dGVyLnByb3RvdHlwZS5jb25maWd1cmUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuX21ldGhvZHNbdGhpcy5tZXRob2RzW2ldXSA9IHRydWU7XG4gIH1cbiAgdGhpcy5yZWN1cnNlID0gb3B0aW9ucy5yZWN1cnNlIHx8IHRoaXMucmVjdXJzZSB8fCBmYWxzZTtcbiAgdGhpcy5hc3luYyA9IG9wdGlvbnMuYXN5bmMgfHwgZmFsc2U7XG4gIHRoaXMuZGVsaW1pdGVyID0gb3B0aW9ucy5kZWxpbWl0ZXIgfHwgXCIvXCI7XG4gIHRoaXMuc3RyaWN0ID0gdHlwZW9mIG9wdGlvbnMuc3RyaWN0ID09PSBcInVuZGVmaW5lZFwiID8gdHJ1ZSA6IG9wdGlvbnMuc3RyaWN0O1xuICB0aGlzLm5vdGZvdW5kID0gb3B0aW9ucy5ub3Rmb3VuZDtcbiAgdGhpcy5yZXNvdXJjZSA9IG9wdGlvbnMucmVzb3VyY2U7XG4gIHRoaXMuaGlzdG9yeSA9IG9wdGlvbnMuaHRtbDVoaXN0b3J5ICYmIHRoaXMuaGlzdG9yeVN1cHBvcnQgfHwgZmFsc2U7XG4gIHRoaXMucnVuX2luX2luaXQgPSB0aGlzLmhpc3RvcnkgPT09IHRydWUgJiYgb3B0aW9ucy5ydW5faGFuZGxlcl9pbl9pbml0ICE9PSBmYWxzZTtcbiAgdGhpcy5jb252ZXJ0X2hhc2hfaW5faW5pdCA9IHRoaXMuaGlzdG9yeSA9PT0gdHJ1ZSAmJiBvcHRpb25zLmNvbnZlcnRfaGFzaF9pbl9pbml0ICE9PSBmYWxzZTtcbiAgdGhpcy5ldmVyeSA9IHtcbiAgICBhZnRlcjogb3B0aW9ucy5hZnRlciB8fCBudWxsLFxuICAgIGJlZm9yZTogb3B0aW9ucy5iZWZvcmUgfHwgbnVsbCxcbiAgICBvbjogb3B0aW9ucy5vbiB8fCBudWxsXG4gIH07XG4gIHJldHVybiB0aGlzO1xufTtcblxuUm91dGVyLnByb3RvdHlwZS5wYXJhbSA9IGZ1bmN0aW9uKHRva2VuLCBtYXRjaGVyKSB7XG4gIGlmICh0b2tlblswXSAhPT0gXCI6XCIpIHtcbiAgICB0b2tlbiA9IFwiOlwiICsgdG9rZW47XG4gIH1cbiAgdmFyIGNvbXBpbGVkID0gbmV3IFJlZ0V4cCh0b2tlbiwgXCJnXCIpO1xuICB0aGlzLnBhcmFtc1t0b2tlbl0gPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoY29tcGlsZWQsIG1hdGNoZXIuc291cmNlIHx8IG1hdGNoZXIpO1xuICB9O1xuICByZXR1cm4gdGhpcztcbn07XG5cblJvdXRlci5wcm90b3R5cGUub24gPSBSb3V0ZXIucHJvdG90eXBlLnJvdXRlID0gZnVuY3Rpb24obWV0aG9kLCBwYXRoLCByb3V0ZSkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIGlmICghcm91dGUgJiYgdHlwZW9mIHBhdGggPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcm91dGUgPSBwYXRoO1xuICAgIHBhdGggPSBtZXRob2Q7XG4gICAgbWV0aG9kID0gXCJvblwiO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHBhdGgpKSB7XG4gICAgcmV0dXJuIHBhdGguZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgICBzZWxmLm9uKG1ldGhvZCwgcCwgcm91dGUpO1xuICAgIH0pO1xuICB9XG4gIGlmIChwYXRoLnNvdXJjZSkge1xuICAgIHBhdGggPSBwYXRoLnNvdXJjZS5yZXBsYWNlKC9cXFxcXFwvL2lnLCBcIi9cIik7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkobWV0aG9kKSkge1xuICAgIHJldHVybiBtZXRob2QuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgICBzZWxmLm9uKG0udG9Mb3dlckNhc2UoKSwgcGF0aCwgcm91dGUpO1xuICAgIH0pO1xuICB9XG4gIHBhdGggPSBwYXRoLnNwbGl0KG5ldyBSZWdFeHAodGhpcy5kZWxpbWl0ZXIpKTtcbiAgcGF0aCA9IHRlcm1pbmF0b3IocGF0aCwgdGhpcy5kZWxpbWl0ZXIpO1xuICB0aGlzLmluc2VydChtZXRob2QsIHRoaXMuc2NvcGUuY29uY2F0KHBhdGgpLCByb3V0ZSk7XG59O1xuXG5Sb3V0ZXIucHJvdG90eXBlLnBhdGggPSBmdW5jdGlvbihwYXRoLCByb3V0ZXNGbikge1xuICB2YXIgc2VsZiA9IHRoaXMsIGxlbmd0aCA9IHRoaXMuc2NvcGUubGVuZ3RoO1xuICBpZiAocGF0aC5zb3VyY2UpIHtcbiAgICBwYXRoID0gcGF0aC5zb3VyY2UucmVwbGFjZSgvXFxcXFxcLy9pZywgXCIvXCIpO1xuICB9XG4gIHBhdGggPSBwYXRoLnNwbGl0KG5ldyBSZWdFeHAodGhpcy5kZWxpbWl0ZXIpKTtcbiAgcGF0aCA9IHRlcm1pbmF0b3IocGF0aCwgdGhpcy5kZWxpbWl0ZXIpO1xuICB0aGlzLnNjb3BlID0gdGhpcy5zY29wZS5jb25jYXQocGF0aCk7XG4gIHJvdXRlc0ZuLmNhbGwodGhpcywgdGhpcyk7XG4gIHRoaXMuc2NvcGUuc3BsaWNlKGxlbmd0aCwgcGF0aC5sZW5ndGgpO1xufTtcblxuUm91dGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uKG1ldGhvZCwgcGF0aCwgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzLCBmbnMgPSB0aGlzLnRyYXZlcnNlKG1ldGhvZCwgcGF0aC5yZXBsYWNlKFFVRVJZX1NFUEFSQVRPUiwgXCJcIiksIHRoaXMucm91dGVzLCBcIlwiKSwgaW52b2tlZCA9IHRoaXMuX2ludm9rZWQsIGFmdGVyO1xuICB0aGlzLl9pbnZva2VkID0gdHJ1ZTtcbiAgaWYgKCFmbnMgfHwgZm5zLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMubGFzdCA9IFtdO1xuICAgIGlmICh0eXBlb2YgdGhpcy5ub3Rmb3VuZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aGlzLmludm9rZShbIHRoaXMubm90Zm91bmQgXSwge1xuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgcGF0aDogcGF0aFxuICAgICAgfSwgY2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHRoaXMucmVjdXJzZSA9PT0gXCJmb3J3YXJkXCIpIHtcbiAgICBmbnMgPSBmbnMucmV2ZXJzZSgpO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZUFuZEludm9rZSgpIHtcbiAgICBzZWxmLmxhc3QgPSBmbnMuYWZ0ZXI7XG4gICAgc2VsZi5pbnZva2Uoc2VsZi5ydW5saXN0KGZucyksIHNlbGYsIGNhbGxiYWNrKTtcbiAgfVxuICBhZnRlciA9IHRoaXMuZXZlcnkgJiYgdGhpcy5ldmVyeS5hZnRlciA/IFsgdGhpcy5ldmVyeS5hZnRlciBdLmNvbmNhdCh0aGlzLmxhc3QpIDogWyB0aGlzLmxhc3QgXTtcbiAgaWYgKGFmdGVyICYmIGFmdGVyLmxlbmd0aCA+IDAgJiYgaW52b2tlZCkge1xuICAgIGlmICh0aGlzLmFzeW5jKSB7XG4gICAgICB0aGlzLmludm9rZShhZnRlciwgdGhpcywgdXBkYXRlQW5kSW52b2tlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnZva2UoYWZ0ZXIsIHRoaXMpO1xuICAgICAgdXBkYXRlQW5kSW52b2tlKCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHVwZGF0ZUFuZEludm9rZSgpO1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cblJvdXRlci5wcm90b3R5cGUuaW52b2tlID0gZnVuY3Rpb24oZm5zLCB0aGlzQXJnLCBjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBhcHBseTtcbiAgaWYgKHRoaXMuYXN5bmMpIHtcbiAgICBhcHBseSA9IGZ1bmN0aW9uKGZuLCBuZXh0KSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShmbikpIHtcbiAgICAgICAgcmV0dXJuIF9hc3luY0V2ZXJ5U2VyaWVzKGZuLCBhcHBseSwgbmV4dCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmbiA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZm4uYXBwbHkodGhpc0FyZywgKGZucy5jYXB0dXJlcyB8fCBbXSkuY29uY2F0KG5leHQpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIF9hc3luY0V2ZXJ5U2VyaWVzKGZucywgYXBwbHksIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgYXBwbHkgPSBmdW5jdGlvbihmbikge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZm4pKSB7XG4gICAgICAgIHJldHVybiBfZXZlcnkoZm4sIGFwcGx5KTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNBcmcsIGZucy5jYXB0dXJlcyB8fCBbXSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmbiA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLnJlc291cmNlKSB7XG4gICAgICAgIHNlbGYucmVzb3VyY2VbZm5dLmFwcGx5KHRoaXNBcmcsIGZucy5jYXB0dXJlcyB8fCBbXSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBfZXZlcnkoZm5zLCBhcHBseSk7XG4gIH1cbn07XG5cblJvdXRlci5wcm90b3R5cGUudHJhdmVyc2UgPSBmdW5jdGlvbihtZXRob2QsIHBhdGgsIHJvdXRlcywgcmVnZXhwLCBmaWx0ZXIpIHtcbiAgdmFyIGZucyA9IFtdLCBjdXJyZW50LCBleGFjdCwgbWF0Y2gsIG5leHQsIHRoYXQ7XG4gIGZ1bmN0aW9uIGZpbHRlclJvdXRlcyhyb3V0ZXMpIHtcbiAgICBpZiAoIWZpbHRlcikge1xuICAgICAgcmV0dXJuIHJvdXRlcztcbiAgICB9XG4gICAgZnVuY3Rpb24gZGVlcENvcHkoc291cmNlKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHRbaV0gPSBBcnJheS5pc0FycmF5KHNvdXJjZVtpXSkgPyBkZWVwQ29weShzb3VyY2VbaV0pIDogc291cmNlW2ldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gYXBwbHlGaWx0ZXIoZm5zKSB7XG4gICAgICBmb3IgKHZhciBpID0gZm5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGZuc1tpXSkpIHtcbiAgICAgICAgICBhcHBseUZpbHRlcihmbnNbaV0pO1xuICAgICAgICAgIGlmIChmbnNbaV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBmbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIWZpbHRlcihmbnNbaV0pKSB7XG4gICAgICAgICAgICBmbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgbmV3Um91dGVzID0gZGVlcENvcHkocm91dGVzKTtcbiAgICBuZXdSb3V0ZXMubWF0Y2hlZCA9IHJvdXRlcy5tYXRjaGVkO1xuICAgIG5ld1JvdXRlcy5jYXB0dXJlcyA9IHJvdXRlcy5jYXB0dXJlcztcbiAgICBuZXdSb3V0ZXMuYWZ0ZXIgPSByb3V0ZXMuYWZ0ZXIuZmlsdGVyKGZpbHRlcik7XG4gICAgYXBwbHlGaWx0ZXIobmV3Um91dGVzKTtcbiAgICByZXR1cm4gbmV3Um91dGVzO1xuICB9XG4gIGlmIChwYXRoID09PSB0aGlzLmRlbGltaXRlciAmJiByb3V0ZXNbbWV0aG9kXSkge1xuICAgIG5leHQgPSBbIFsgcm91dGVzLmJlZm9yZSwgcm91dGVzW21ldGhvZF0gXS5maWx0ZXIoQm9vbGVhbikgXTtcbiAgICBuZXh0LmFmdGVyID0gWyByb3V0ZXMuYWZ0ZXIgXS5maWx0ZXIoQm9vbGVhbik7XG4gICAgbmV4dC5tYXRjaGVkID0gdHJ1ZTtcbiAgICBuZXh0LmNhcHR1cmVzID0gW107XG4gICAgcmV0dXJuIGZpbHRlclJvdXRlcyhuZXh0KTtcbiAgfVxuICBmb3IgKHZhciByIGluIHJvdXRlcykge1xuICAgIGlmIChyb3V0ZXMuaGFzT3duUHJvcGVydHkocikgJiYgKCF0aGlzLl9tZXRob2RzW3JdIHx8IHRoaXMuX21ldGhvZHNbcl0gJiYgdHlwZW9mIHJvdXRlc1tyXSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShyb3V0ZXNbcl0pKSkge1xuICAgICAgY3VycmVudCA9IGV4YWN0ID0gcmVnZXhwICsgdGhpcy5kZWxpbWl0ZXIgKyByO1xuICAgICAgaWYgKCF0aGlzLnN0cmljdCkge1xuICAgICAgICBleGFjdCArPSBcIltcIiArIHRoaXMuZGVsaW1pdGVyICsgXCJdP1wiO1xuICAgICAgfVxuICAgICAgbWF0Y2ggPSBwYXRoLm1hdGNoKG5ldyBSZWdFeHAoXCJeXCIgKyBleGFjdCkpO1xuICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaFswXSAmJiBtYXRjaFswXSA9PSBwYXRoICYmIHJvdXRlc1tyXVttZXRob2RdKSB7XG4gICAgICAgIG5leHQgPSBbIFsgcm91dGVzW3JdLmJlZm9yZSwgcm91dGVzW3JdW21ldGhvZF0gXS5maWx0ZXIoQm9vbGVhbikgXTtcbiAgICAgICAgbmV4dC5hZnRlciA9IFsgcm91dGVzW3JdLmFmdGVyIF0uZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICBuZXh0Lm1hdGNoZWQgPSB0cnVlO1xuICAgICAgICBuZXh0LmNhcHR1cmVzID0gbWF0Y2guc2xpY2UoMSk7XG4gICAgICAgIGlmICh0aGlzLnJlY3Vyc2UgJiYgcm91dGVzID09PSB0aGlzLnJvdXRlcykge1xuICAgICAgICAgIG5leHQucHVzaChbIHJvdXRlcy5iZWZvcmUsIHJvdXRlcy5vbiBdLmZpbHRlcihCb29sZWFuKSk7XG4gICAgICAgICAgbmV4dC5hZnRlciA9IG5leHQuYWZ0ZXIuY29uY2F0KFsgcm91dGVzLmFmdGVyIF0uZmlsdGVyKEJvb2xlYW4pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmlsdGVyUm91dGVzKG5leHQpO1xuICAgICAgfVxuICAgICAgbmV4dCA9IHRoaXMudHJhdmVyc2UobWV0aG9kLCBwYXRoLCByb3V0ZXNbcl0sIGN1cnJlbnQpO1xuICAgICAgaWYgKG5leHQubWF0Y2hlZCkge1xuICAgICAgICBpZiAobmV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZm5zID0gZm5zLmNvbmNhdChuZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZWN1cnNlKSB7XG4gICAgICAgICAgZm5zLnB1c2goWyByb3V0ZXNbcl0uYmVmb3JlLCByb3V0ZXNbcl0ub24gXS5maWx0ZXIoQm9vbGVhbikpO1xuICAgICAgICAgIG5leHQuYWZ0ZXIgPSBuZXh0LmFmdGVyLmNvbmNhdChbIHJvdXRlc1tyXS5hZnRlciBdLmZpbHRlcihCb29sZWFuKSk7XG4gICAgICAgICAgaWYgKHJvdXRlcyA9PT0gdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgICAgIGZucy5wdXNoKFsgcm91dGVzW1wiYmVmb3JlXCJdLCByb3V0ZXNbXCJvblwiXSBdLmZpbHRlcihCb29sZWFuKSk7XG4gICAgICAgICAgICBuZXh0LmFmdGVyID0gbmV4dC5hZnRlci5jb25jYXQoWyByb3V0ZXNbXCJhZnRlclwiXSBdLmZpbHRlcihCb29sZWFuKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZucy5tYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgZm5zLmNhcHR1cmVzID0gbmV4dC5jYXB0dXJlcztcbiAgICAgICAgZm5zLmFmdGVyID0gbmV4dC5hZnRlcjtcbiAgICAgICAgcmV0dXJuIGZpbHRlclJvdXRlcyhmbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5Sb3V0ZXIucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKG1ldGhvZCwgcGF0aCwgcm91dGUsIHBhcmVudCkge1xuICB2YXIgbWV0aG9kVHlwZSwgcGFyZW50VHlwZSwgaXNBcnJheSwgbmVzdGVkLCBwYXJ0O1xuICBwYXRoID0gcGF0aC5maWx0ZXIoZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiBwICYmIHAubGVuZ3RoID4gMDtcbiAgfSk7XG4gIHBhcmVudCA9IHBhcmVudCB8fCB0aGlzLnJvdXRlcztcbiAgcGFydCA9IHBhdGguc2hpZnQoKTtcbiAgaWYgKC9cXDp8XFwqLy50ZXN0KHBhcnQpICYmICEvXFxcXGR8XFxcXHcvLnRlc3QocGFydCkpIHtcbiAgICBwYXJ0ID0gcmVnaWZ5U3RyaW5nKHBhcnQsIHRoaXMucGFyYW1zKTtcbiAgfVxuICBpZiAocGF0aC5sZW5ndGggPiAwKSB7XG4gICAgcGFyZW50W3BhcnRdID0gcGFyZW50W3BhcnRdIHx8IHt9O1xuICAgIHJldHVybiB0aGlzLmluc2VydChtZXRob2QsIHBhdGgsIHJvdXRlLCBwYXJlbnRbcGFydF0pO1xuICB9XG4gIGlmICghcGFydCAmJiAhcGF0aC5sZW5ndGggJiYgcGFyZW50ID09PSB0aGlzLnJvdXRlcykge1xuICAgIG1ldGhvZFR5cGUgPSB0eXBlb2YgcGFyZW50W21ldGhvZF07XG4gICAgc3dpdGNoIChtZXRob2RUeXBlKSB7XG4gICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgcGFyZW50W21ldGhvZF0gPSBbIHBhcmVudFttZXRob2RdLCByb3V0ZSBdO1xuICAgICAgcmV0dXJuO1xuICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBwYXJlbnRbbWV0aG9kXS5wdXNoKHJvdXRlKTtcbiAgICAgIHJldHVybjtcbiAgICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgcGFyZW50W21ldGhvZF0gPSByb3V0ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIHBhcmVudFR5cGUgPSB0eXBlb2YgcGFyZW50W3BhcnRdO1xuICBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShwYXJlbnRbcGFydF0pO1xuICBpZiAocGFyZW50W3BhcnRdICYmICFpc0FycmF5ICYmIHBhcmVudFR5cGUgPT0gXCJvYmplY3RcIikge1xuICAgIG1ldGhvZFR5cGUgPSB0eXBlb2YgcGFyZW50W3BhcnRdW21ldGhvZF07XG4gICAgc3dpdGNoIChtZXRob2RUeXBlKSB7XG4gICAgIGNhc2UgXCJmdW5jdGlvblwiOlxuICAgICAgcGFyZW50W3BhcnRdW21ldGhvZF0gPSBbIHBhcmVudFtwYXJ0XVttZXRob2RdLCByb3V0ZSBdO1xuICAgICAgcmV0dXJuO1xuICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICBwYXJlbnRbcGFydF1bbWV0aG9kXS5wdXNoKHJvdXRlKTtcbiAgICAgIHJldHVybjtcbiAgICAgY2FzZSBcInVuZGVmaW5lZFwiOlxuICAgICAgcGFyZW50W3BhcnRdW21ldGhvZF0gPSByb3V0ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSBpZiAocGFyZW50VHlwZSA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbmVzdGVkID0ge307XG4gICAgbmVzdGVkW21ldGhvZF0gPSByb3V0ZTtcbiAgICBwYXJlbnRbcGFydF0gPSBuZXN0ZWQ7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcm91dGUgY29udGV4dDogXCIgKyBwYXJlbnRUeXBlKTtcbn07XG5cblxuXG5Sb3V0ZXIucHJvdG90eXBlLmV4dGVuZCA9IGZ1bmN0aW9uKG1ldGhvZHMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzLCBsZW4gPSBtZXRob2RzLmxlbmd0aCwgaTtcbiAgZnVuY3Rpb24gZXh0ZW5kKG1ldGhvZCkge1xuICAgIHNlbGYuX21ldGhvZHNbbWV0aG9kXSA9IHRydWU7XG4gICAgc2VsZlttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXh0cmEgPSBhcmd1bWVudHMubGVuZ3RoID09PSAxID8gWyBtZXRob2QsIFwiXCIgXSA6IFsgbWV0aG9kIF07XG4gICAgICBzZWxmLm9uLmFwcGx5KHNlbGYsIGV4dHJhLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgfVxuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBleHRlbmQobWV0aG9kc1tpXSk7XG4gIH1cbn07XG5cblJvdXRlci5wcm90b3R5cGUucnVubGlzdCA9IGZ1bmN0aW9uKGZucykge1xuICB2YXIgcnVubGlzdCA9IHRoaXMuZXZlcnkgJiYgdGhpcy5ldmVyeS5iZWZvcmUgPyBbIHRoaXMuZXZlcnkuYmVmb3JlIF0uY29uY2F0KF9mbGF0dGVuKGZucykpIDogX2ZsYXR0ZW4oZm5zKTtcbiAgaWYgKHRoaXMuZXZlcnkgJiYgdGhpcy5ldmVyeS5vbikge1xuICAgIHJ1bmxpc3QucHVzaCh0aGlzLmV2ZXJ5Lm9uKTtcbiAgfVxuICBydW5saXN0LmNhcHR1cmVzID0gZm5zLmNhcHR1cmVzO1xuICBydW5saXN0LnNvdXJjZSA9IGZucy5zb3VyY2U7XG4gIHJldHVybiBydW5saXN0O1xufTtcblxuUm91dGVyLnByb3RvdHlwZS5tb3VudCA9IGZ1bmN0aW9uKHJvdXRlcywgcGF0aCkge1xuICBpZiAoIXJvdXRlcyB8fCB0eXBlb2Ygcm91dGVzICE9PSBcIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkocm91dGVzKSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHBhdGggPSBwYXRoIHx8IFtdO1xuICBpZiAoIUFycmF5LmlzQXJyYXkocGF0aCkpIHtcbiAgICBwYXRoID0gcGF0aC5zcGxpdChzZWxmLmRlbGltaXRlcik7XG4gIH1cbiAgZnVuY3Rpb24gaW5zZXJ0T3JNb3VudChyb3V0ZSwgbG9jYWwpIHtcbiAgICB2YXIgcmVuYW1lID0gcm91dGUsIHBhcnRzID0gcm91dGUuc3BsaXQoc2VsZi5kZWxpbWl0ZXIpLCByb3V0ZVR5cGUgPSB0eXBlb2Ygcm91dGVzW3JvdXRlXSwgaXNSb3V0ZSA9IHBhcnRzWzBdID09PSBcIlwiIHx8ICFzZWxmLl9tZXRob2RzW3BhcnRzWzBdXSwgZXZlbnQgPSBpc1JvdXRlID8gXCJvblwiIDogcmVuYW1lO1xuICAgIGlmIChpc1JvdXRlKSB7XG4gICAgICByZW5hbWUgPSByZW5hbWUuc2xpY2UoKHJlbmFtZS5tYXRjaChuZXcgUmVnRXhwKFwiXlwiICsgc2VsZi5kZWxpbWl0ZXIpKSB8fCBbIFwiXCIgXSlbMF0ubGVuZ3RoKTtcbiAgICAgIHBhcnRzLnNoaWZ0KCk7XG4gICAgfVxuICAgIGlmIChpc1JvdXRlICYmIHJvdXRlVHlwZSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShyb3V0ZXNbcm91dGVdKSkge1xuICAgICAgbG9jYWwgPSBsb2NhbC5jb25jYXQocGFydHMpO1xuICAgICAgc2VsZi5tb3VudChyb3V0ZXNbcm91dGVdLCBsb2NhbCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChpc1JvdXRlKSB7XG4gICAgICBsb2NhbCA9IGxvY2FsLmNvbmNhdChyZW5hbWUuc3BsaXQoc2VsZi5kZWxpbWl0ZXIpKTtcbiAgICAgIGxvY2FsID0gdGVybWluYXRvcihsb2NhbCwgc2VsZi5kZWxpbWl0ZXIpO1xuICAgIH1cbiAgICBzZWxmLmluc2VydChldmVudCwgbG9jYWwsIHJvdXRlc1tyb3V0ZV0pO1xuICB9XG4gIGZvciAodmFyIHJvdXRlIGluIHJvdXRlcykge1xuICAgIGlmIChyb3V0ZXMuaGFzT3duUHJvcGVydHkocm91dGUpKSB7XG4gICAgICBpbnNlcnRPck1vdW50KHJvdXRlLCBwYXRoLnNsaWNlKDApKTtcbiAgICB9XG4gIH1cbn07XG5cblxuXG59KHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiID8gZXhwb3J0cyA6IHdpbmRvdykpOyIsIi8qISBAbGljZW5zZSBGaXJlYmFzZSB2Mi4yLjRcbiAgICBMaWNlbnNlOiBodHRwczovL3d3dy5maXJlYmFzZS5jb20vdGVybXMvdGVybXMtb2Ytc2VydmljZS5odG1sICovXG4oZnVuY3Rpb24oKSB7dmFyIGgsYWE9dGhpcztmdW5jdGlvbiBuKGEpe3JldHVybiB2b2lkIDAhPT1hfWZ1bmN0aW9uIGJhKCl7fWZ1bmN0aW9uIGNhKGEpe2EudWI9ZnVuY3Rpb24oKXtyZXR1cm4gYS50Zj9hLnRmOmEudGY9bmV3IGF9fVxuZnVuY3Rpb24gZGEoYSl7dmFyIGI9dHlwZW9mIGE7aWYoXCJvYmplY3RcIj09YilpZihhKXtpZihhIGluc3RhbmNlb2YgQXJyYXkpcmV0dXJuXCJhcnJheVwiO2lmKGEgaW5zdGFuY2VvZiBPYmplY3QpcmV0dXJuIGI7dmFyIGM9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpO2lmKFwiW29iamVjdCBXaW5kb3ddXCI9PWMpcmV0dXJuXCJvYmplY3RcIjtpZihcIltvYmplY3QgQXJyYXldXCI9PWN8fFwibnVtYmVyXCI9PXR5cGVvZiBhLmxlbmd0aCYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuc3BsaWNlJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5wcm9wZXJ0eUlzRW51bWVyYWJsZSYmIWEucHJvcGVydHlJc0VudW1lcmFibGUoXCJzcGxpY2VcIikpcmV0dXJuXCJhcnJheVwiO2lmKFwiW29iamVjdCBGdW5jdGlvbl1cIj09Y3x8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuY2FsbCYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEucHJvcGVydHlJc0VudW1lcmFibGUmJiFhLnByb3BlcnR5SXNFbnVtZXJhYmxlKFwiY2FsbFwiKSlyZXR1cm5cImZ1bmN0aW9uXCJ9ZWxzZSByZXR1cm5cIm51bGxcIjtcbmVsc2UgaWYoXCJmdW5jdGlvblwiPT1iJiZcInVuZGVmaW5lZFwiPT10eXBlb2YgYS5jYWxsKXJldHVyblwib2JqZWN0XCI7cmV0dXJuIGJ9ZnVuY3Rpb24gZWEoYSl7cmV0dXJuXCJhcnJheVwiPT1kYShhKX1mdW5jdGlvbiBmYShhKXt2YXIgYj1kYShhKTtyZXR1cm5cImFycmF5XCI9PWJ8fFwib2JqZWN0XCI9PWImJlwibnVtYmVyXCI9PXR5cGVvZiBhLmxlbmd0aH1mdW5jdGlvbiBwKGEpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhfWZ1bmN0aW9uIGdhKGEpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBhfWZ1bmN0aW9uIGhhKGEpe3JldHVyblwiZnVuY3Rpb25cIj09ZGEoYSl9ZnVuY3Rpb24gaWEoYSl7dmFyIGI9dHlwZW9mIGE7cmV0dXJuXCJvYmplY3RcIj09YiYmbnVsbCE9YXx8XCJmdW5jdGlvblwiPT1ifWZ1bmN0aW9uIGphKGEsYixjKXtyZXR1cm4gYS5jYWxsLmFwcGx5KGEuYmluZCxhcmd1bWVudHMpfVxuZnVuY3Rpb24ga2EoYSxiLGMpe2lmKCFhKXRocm93IEVycm9yKCk7aWYoMjxhcmd1bWVudHMubGVuZ3RoKXt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMik7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShjLGQpO3JldHVybiBhLmFwcGx5KGIsYyl9fXJldHVybiBmdW5jdGlvbigpe3JldHVybiBhLmFwcGx5KGIsYXJndW1lbnRzKX19ZnVuY3Rpb24gcShhLGIsYyl7cT1GdW5jdGlvbi5wcm90b3R5cGUuYmluZCYmLTEhPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLnRvU3RyaW5nKCkuaW5kZXhPZihcIm5hdGl2ZSBjb2RlXCIpP2phOmthO3JldHVybiBxLmFwcGx5KG51bGwsYXJndW1lbnRzKX12YXIgbGE9RGF0ZS5ub3d8fGZ1bmN0aW9uKCl7cmV0dXJuK25ldyBEYXRlfTtcbmZ1bmN0aW9uIG1hKGEsYil7ZnVuY3Rpb24gYygpe31jLnByb3RvdHlwZT1iLnByb3RvdHlwZTthLlpnPWIucHJvdG90eXBlO2EucHJvdG90eXBlPW5ldyBjO2EucHJvdG90eXBlLmNvbnN0cnVjdG9yPWE7YS5WZz1mdW5jdGlvbihhLGMsZil7Zm9yKHZhciBnPUFycmF5KGFyZ3VtZW50cy5sZW5ndGgtMiksaz0yO2s8YXJndW1lbnRzLmxlbmd0aDtrKyspZ1trLTJdPWFyZ3VtZW50c1trXTtyZXR1cm4gYi5wcm90b3R5cGVbY10uYXBwbHkoYSxnKX19O2Z1bmN0aW9uIHIoYSxiKXtmb3IodmFyIGMgaW4gYSliLmNhbGwodm9pZCAwLGFbY10sYyxhKX1mdW5jdGlvbiBuYShhLGIpe3ZhciBjPXt9LGQ7Zm9yKGQgaW4gYSljW2RdPWIuY2FsbCh2b2lkIDAsYVtkXSxkLGEpO3JldHVybiBjfWZ1bmN0aW9uIG9hKGEsYil7Zm9yKHZhciBjIGluIGEpaWYoIWIuY2FsbCh2b2lkIDAsYVtjXSxjLGEpKXJldHVybiExO3JldHVybiEwfWZ1bmN0aW9uIHBhKGEpe3ZhciBiPTAsYztmb3IoYyBpbiBhKWIrKztyZXR1cm4gYn1mdW5jdGlvbiBxYShhKXtmb3IodmFyIGIgaW4gYSlyZXR1cm4gYn1mdW5jdGlvbiByYShhKXt2YXIgYj1bXSxjPTAsZDtmb3IoZCBpbiBhKWJbYysrXT1hW2RdO3JldHVybiBifWZ1bmN0aW9uIHNhKGEpe3ZhciBiPVtdLGM9MCxkO2ZvcihkIGluIGEpYltjKytdPWQ7cmV0dXJuIGJ9ZnVuY3Rpb24gdGEoYSxiKXtmb3IodmFyIGMgaW4gYSlpZihhW2NdPT1iKXJldHVybiEwO3JldHVybiExfVxuZnVuY3Rpb24gdWEoYSxiLGMpe2Zvcih2YXIgZCBpbiBhKWlmKGIuY2FsbChjLGFbZF0sZCxhKSlyZXR1cm4gZH1mdW5jdGlvbiB2YShhLGIpe3ZhciBjPXVhKGEsYix2b2lkIDApO3JldHVybiBjJiZhW2NdfWZ1bmN0aW9uIHdhKGEpe2Zvcih2YXIgYiBpbiBhKXJldHVybiExO3JldHVybiEwfWZ1bmN0aW9uIHhhKGEpe3ZhciBiPXt9LGM7Zm9yKGMgaW4gYSliW2NdPWFbY107cmV0dXJuIGJ9dmFyIHlhPVwiY29uc3RydWN0b3IgaGFzT3duUHJvcGVydHkgaXNQcm90b3R5cGVPZiBwcm9wZXJ0eUlzRW51bWVyYWJsZSB0b0xvY2FsZVN0cmluZyB0b1N0cmluZyB2YWx1ZU9mXCIuc3BsaXQoXCIgXCIpO1xuZnVuY3Rpb24gemEoYSxiKXtmb3IodmFyIGMsZCxlPTE7ZTxhcmd1bWVudHMubGVuZ3RoO2UrKyl7ZD1hcmd1bWVudHNbZV07Zm9yKGMgaW4gZClhW2NdPWRbY107Zm9yKHZhciBmPTA7Zjx5YS5sZW5ndGg7ZisrKWM9eWFbZl0sT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGQsYykmJihhW2NdPWRbY10pfX07ZnVuY3Rpb24gQWEoYSl7YT1TdHJpbmcoYSk7aWYoL15cXHMqJC8udGVzdChhKT8wOi9eW1xcXSw6e31cXHNcXHUyMDI4XFx1MjAyOV0qJC8udGVzdChhLnJlcGxhY2UoL1xcXFxbXCJcXFxcXFwvYmZucnR1XS9nLFwiQFwiKS5yZXBsYWNlKC9cIlteXCJcXFxcXFxuXFxyXFx1MjAyOFxcdTIwMjlcXHgwMC1cXHgwOFxceDBhLVxceDFmXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZyxcIl1cIikucmVwbGFjZSgvKD86Xnw6fCwpKD86W1xcc1xcdTIwMjhcXHUyMDI5XSpcXFspKy9nLFwiXCIpKSl0cnl7cmV0dXJuIGV2YWwoXCIoXCIrYStcIilcIil9Y2F0Y2goYil7fXRocm93IEVycm9yKFwiSW52YWxpZCBKU09OIHN0cmluZzogXCIrYSk7fWZ1bmN0aW9uIEJhKCl7dGhpcy5QZD12b2lkIDB9XG5mdW5jdGlvbiBDYShhLGIsYyl7c3dpdGNoKHR5cGVvZiBiKXtjYXNlIFwic3RyaW5nXCI6RGEoYixjKTticmVhaztjYXNlIFwibnVtYmVyXCI6Yy5wdXNoKGlzRmluaXRlKGIpJiYhaXNOYU4oYik/YjpcIm51bGxcIik7YnJlYWs7Y2FzZSBcImJvb2xlYW5cIjpjLnB1c2goYik7YnJlYWs7Y2FzZSBcInVuZGVmaW5lZFwiOmMucHVzaChcIm51bGxcIik7YnJlYWs7Y2FzZSBcIm9iamVjdFwiOmlmKG51bGw9PWIpe2MucHVzaChcIm51bGxcIik7YnJlYWt9aWYoZWEoYikpe3ZhciBkPWIubGVuZ3RoO2MucHVzaChcIltcIik7Zm9yKHZhciBlPVwiXCIsZj0wO2Y8ZDtmKyspYy5wdXNoKGUpLGU9YltmXSxDYShhLGEuUGQ/YS5QZC5jYWxsKGIsU3RyaW5nKGYpLGUpOmUsYyksZT1cIixcIjtjLnB1c2goXCJdXCIpO2JyZWFrfWMucHVzaChcIntcIik7ZD1cIlwiO2ZvcihmIGluIGIpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsZikmJihlPWJbZl0sXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmKGMucHVzaChkKSxEYShmLGMpLFxuYy5wdXNoKFwiOlwiKSxDYShhLGEuUGQ/YS5QZC5jYWxsKGIsZixlKTplLGMpLGQ9XCIsXCIpKTtjLnB1c2goXCJ9XCIpO2JyZWFrO2Nhc2UgXCJmdW5jdGlvblwiOmJyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IoXCJVbmtub3duIHR5cGU6IFwiK3R5cGVvZiBiKTt9fXZhciBFYT17J1wiJzonXFxcXFwiJyxcIlxcXFxcIjpcIlxcXFxcXFxcXCIsXCIvXCI6XCJcXFxcL1wiLFwiXFxiXCI6XCJcXFxcYlwiLFwiXFxmXCI6XCJcXFxcZlwiLFwiXFxuXCI6XCJcXFxcblwiLFwiXFxyXCI6XCJcXFxcclwiLFwiXFx0XCI6XCJcXFxcdFwiLFwiXFx4MEJcIjpcIlxcXFx1MDAwYlwifSxGYT0vXFx1ZmZmZi8udGVzdChcIlxcdWZmZmZcIik/L1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx1ZmZmZl0vZzovW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHhmZl0vZztcbmZ1bmN0aW9uIERhKGEsYil7Yi5wdXNoKCdcIicsYS5yZXBsYWNlKEZhLGZ1bmN0aW9uKGEpe2lmKGEgaW4gRWEpcmV0dXJuIEVhW2FdO3ZhciBiPWEuY2hhckNvZGVBdCgwKSxlPVwiXFxcXHVcIjsxNj5iP2UrPVwiMDAwXCI6MjU2PmI/ZSs9XCIwMFwiOjQwOTY+YiYmKGUrPVwiMFwiKTtyZXR1cm4gRWFbYV09ZStiLnRvU3RyaW5nKDE2KX0pLCdcIicpfTtmdW5jdGlvbiBHYSgpe3JldHVybiBNYXRoLmZsb29yKDIxNDc0ODM2NDgqTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpK01hdGguYWJzKE1hdGguZmxvb3IoMjE0NzQ4MzY0OCpNYXRoLnJhbmRvbSgpKV5sYSgpKS50b1N0cmluZygzNil9O3ZhciBIYTthOnt2YXIgSWE9YWEubmF2aWdhdG9yO2lmKElhKXt2YXIgSmE9SWEudXNlckFnZW50O2lmKEphKXtIYT1KYTticmVhayBhfX1IYT1cIlwifTtmdW5jdGlvbiBLYSgpe3RoaXMuV2E9LTF9O2Z1bmN0aW9uIExhKCl7dGhpcy5XYT0tMTt0aGlzLldhPTY0O3RoaXMuUj1bXTt0aGlzLmxlPVtdO3RoaXMuVGY9W107dGhpcy5JZD1bXTt0aGlzLklkWzBdPTEyODtmb3IodmFyIGE9MTthPHRoaXMuV2E7KythKXRoaXMuSWRbYV09MDt0aGlzLmJlPXRoaXMuJGI9MDt0aGlzLnJlc2V0KCl9bWEoTGEsS2EpO0xhLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuUlswXT0xNzMyNTg0MTkzO3RoaXMuUlsxXT00MDIzMjMzNDE3O3RoaXMuUlsyXT0yNTYyMzgzMTAyO3RoaXMuUlszXT0yNzE3MzM4Nzg7dGhpcy5SWzRdPTMyODUzNzc1MjA7dGhpcy5iZT10aGlzLiRiPTB9O1xuZnVuY3Rpb24gTWEoYSxiLGMpe2N8fChjPTApO3ZhciBkPWEuVGY7aWYocChiKSlmb3IodmFyIGU9MDsxNj5lO2UrKylkW2VdPWIuY2hhckNvZGVBdChjKTw8MjR8Yi5jaGFyQ29kZUF0KGMrMSk8PDE2fGIuY2hhckNvZGVBdChjKzIpPDw4fGIuY2hhckNvZGVBdChjKzMpLGMrPTQ7ZWxzZSBmb3IoZT0wOzE2PmU7ZSsrKWRbZV09YltjXTw8MjR8YltjKzFdPDwxNnxiW2MrMl08PDh8YltjKzNdLGMrPTQ7Zm9yKGU9MTY7ODA+ZTtlKyspe3ZhciBmPWRbZS0zXV5kW2UtOF1eZFtlLTE0XV5kW2UtMTZdO2RbZV09KGY8PDF8Zj4+PjMxKSY0Mjk0OTY3Mjk1fWI9YS5SWzBdO2M9YS5SWzFdO2Zvcih2YXIgZz1hLlJbMl0saz1hLlJbM10sbD1hLlJbNF0sbSxlPTA7ODA+ZTtlKyspNDA+ZT8yMD5lPyhmPWteYyYoZ15rKSxtPTE1MTg1MDAyNDkpOihmPWNeZ15rLG09MTg1OTc3NTM5Myk6NjA+ZT8oZj1jJmd8ayYoY3xnKSxtPTI0MDA5NTk3MDgpOihmPWNeZ15rLG09MzM5NTQ2OTc4MiksZj0oYjw8XG41fGI+Pj4yNykrZitsK20rZFtlXSY0Mjk0OTY3Mjk1LGw9ayxrPWcsZz0oYzw8MzB8Yz4+PjIpJjQyOTQ5NjcyOTUsYz1iLGI9ZjthLlJbMF09YS5SWzBdK2ImNDI5NDk2NzI5NTthLlJbMV09YS5SWzFdK2MmNDI5NDk2NzI5NTthLlJbMl09YS5SWzJdK2cmNDI5NDk2NzI5NTthLlJbM109YS5SWzNdK2smNDI5NDk2NzI5NTthLlJbNF09YS5SWzRdK2wmNDI5NDk2NzI5NX1cbkxhLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oYSxiKXtpZihudWxsIT1hKXtuKGIpfHwoYj1hLmxlbmd0aCk7Zm9yKHZhciBjPWItdGhpcy5XYSxkPTAsZT10aGlzLmxlLGY9dGhpcy4kYjtkPGI7KXtpZigwPT1mKWZvcig7ZDw9YzspTWEodGhpcyxhLGQpLGQrPXRoaXMuV2E7aWYocChhKSlmb3IoO2Q8Yjspe2lmKGVbZl09YS5jaGFyQ29kZUF0KGQpLCsrZiwrK2QsZj09dGhpcy5XYSl7TWEodGhpcyxlKTtmPTA7YnJlYWt9fWVsc2UgZm9yKDtkPGI7KWlmKGVbZl09YVtkXSwrK2YsKytkLGY9PXRoaXMuV2Epe01hKHRoaXMsZSk7Zj0wO2JyZWFrfX10aGlzLiRiPWY7dGhpcy5iZSs9Yn19O3ZhciB0PUFycmF5LnByb3RvdHlwZSxOYT10LmluZGV4T2Y/ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0LmluZGV4T2YuY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtjPW51bGw9PWM/MDowPmM/TWF0aC5tYXgoMCxhLmxlbmd0aCtjKTpjO2lmKHAoYSkpcmV0dXJuIHAoYikmJjE9PWIubGVuZ3RoP2EuaW5kZXhPZihiLGMpOi0xO2Zvcig7YzxhLmxlbmd0aDtjKyspaWYoYyBpbiBhJiZhW2NdPT09YilyZXR1cm4gYztyZXR1cm4tMX0sT2E9dC5mb3JFYWNoP2Z1bmN0aW9uKGEsYixjKXt0LmZvckVhY2guY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1wKGEpP2Euc3BsaXQoXCJcIik6YSxmPTA7ZjxkO2YrKylmIGluIGUmJmIuY2FsbChjLGVbZl0sZixhKX0sUGE9dC5maWx0ZXI/ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0LmZpbHRlci5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPVtdLGY9MCxnPXAoYSk/XG5hLnNwbGl0KFwiXCIpOmEsaz0wO2s8ZDtrKyspaWYoayBpbiBnKXt2YXIgbD1nW2tdO2IuY2FsbChjLGwsayxhKSYmKGVbZisrXT1sKX1yZXR1cm4gZX0sUWE9dC5tYXA/ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0Lm1hcC5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPUFycmF5KGQpLGY9cChhKT9hLnNwbGl0KFwiXCIpOmEsZz0wO2c8ZDtnKyspZyBpbiBmJiYoZVtnXT1iLmNhbGwoYyxmW2ddLGcsYSkpO3JldHVybiBlfSxSYT10LnJlZHVjZT9mdW5jdGlvbihhLGIsYyxkKXtmb3IodmFyIGU9W10sZj0xLGc9YXJndW1lbnRzLmxlbmd0aDtmPGc7ZisrKWUucHVzaChhcmd1bWVudHNbZl0pO2QmJihlWzBdPXEoYixkKSk7cmV0dXJuIHQucmVkdWNlLmFwcGx5KGEsZSl9OmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWM7T2EoYSxmdW5jdGlvbihjLGcpe2U9Yi5jYWxsKGQsZSxjLGcsYSl9KTtyZXR1cm4gZX0sU2E9dC5ldmVyeT9mdW5jdGlvbihhLGIsXG5jKXtyZXR1cm4gdC5ldmVyeS5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPXAoYSk/YS5zcGxpdChcIlwiKTphLGY9MDtmPGQ7ZisrKWlmKGYgaW4gZSYmIWIuY2FsbChjLGVbZl0sZixhKSlyZXR1cm4hMTtyZXR1cm4hMH07ZnVuY3Rpb24gVGEoYSxiKXt2YXIgYz1VYShhLGIsdm9pZCAwKTtyZXR1cm4gMD5jP251bGw6cChhKT9hLmNoYXJBdChjKTphW2NdfWZ1bmN0aW9uIFVhKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1wKGEpP2Euc3BsaXQoXCJcIik6YSxmPTA7ZjxkO2YrKylpZihmIGluIGUmJmIuY2FsbChjLGVbZl0sZixhKSlyZXR1cm4gZjtyZXR1cm4tMX1mdW5jdGlvbiBWYShhLGIpe3ZhciBjPU5hKGEsYik7MDw9YyYmdC5zcGxpY2UuY2FsbChhLGMsMSl9ZnVuY3Rpb24gV2EoYSxiLGMpe3JldHVybiAyPj1hcmd1bWVudHMubGVuZ3RoP3Quc2xpY2UuY2FsbChhLGIpOnQuc2xpY2UuY2FsbChhLGIsYyl9XG5mdW5jdGlvbiBYYShhLGIpe2Euc29ydChifHxZYSl9ZnVuY3Rpb24gWWEoYSxiKXtyZXR1cm4gYT5iPzE6YTxiPy0xOjB9O3ZhciBaYT0tMSE9SGEuaW5kZXhPZihcIk9wZXJhXCIpfHwtMSE9SGEuaW5kZXhPZihcIk9QUlwiKSwkYT0tMSE9SGEuaW5kZXhPZihcIlRyaWRlbnRcIil8fC0xIT1IYS5pbmRleE9mKFwiTVNJRVwiKSxhYj0tMSE9SGEuaW5kZXhPZihcIkdlY2tvXCIpJiYtMT09SGEudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwid2Via2l0XCIpJiYhKC0xIT1IYS5pbmRleE9mKFwiVHJpZGVudFwiKXx8LTEhPUhhLmluZGV4T2YoXCJNU0lFXCIpKSxiYj0tMSE9SGEudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwid2Via2l0XCIpO1xuKGZ1bmN0aW9uKCl7dmFyIGE9XCJcIixiO2lmKFphJiZhYS5vcGVyYSlyZXR1cm4gYT1hYS5vcGVyYS52ZXJzaW9uLGhhKGEpP2EoKTphO2FiP2I9L3J2XFw6KFteXFwpO10rKShcXCl8OykvOiRhP2I9L1xcYig/Ok1TSUV8cnYpWzogXShbXlxcKTtdKykoXFwpfDspLzpiYiYmKGI9L1dlYktpdFxcLyhcXFMrKS8pO2ImJihhPShhPWIuZXhlYyhIYSkpP2FbMV06XCJcIik7cmV0dXJuICRhJiYoYj0oYj1hYS5kb2N1bWVudCk/Yi5kb2N1bWVudE1vZGU6dm9pZCAwLGI+cGFyc2VGbG9hdChhKSk/U3RyaW5nKGIpOmF9KSgpO3ZhciBjYj1udWxsLGRiPW51bGwsZWI9bnVsbDtmdW5jdGlvbiBmYihhLGIpe2lmKCFmYShhKSl0aHJvdyBFcnJvcihcImVuY29kZUJ5dGVBcnJheSB0YWtlcyBhbiBhcnJheSBhcyBhIHBhcmFtZXRlclwiKTtnYigpO2Zvcih2YXIgYz1iP2RiOmNiLGQ9W10sZT0wO2U8YS5sZW5ndGg7ZSs9Myl7dmFyIGY9YVtlXSxnPWUrMTxhLmxlbmd0aCxrPWc/YVtlKzFdOjAsbD1lKzI8YS5sZW5ndGgsbT1sP2FbZSsyXTowLHY9Zj4+MixmPShmJjMpPDw0fGs+PjQsaz0oayYxNSk8PDJ8bT4+NixtPW0mNjM7bHx8KG09NjQsZ3x8KGs9NjQpKTtkLnB1c2goY1t2XSxjW2ZdLGNba10sY1ttXSl9cmV0dXJuIGQuam9pbihcIlwiKX1cbmZ1bmN0aW9uIGdiKCl7aWYoIWNiKXtjYj17fTtkYj17fTtlYj17fTtmb3IodmFyIGE9MDs2NT5hO2ErKyljYlthXT1cIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCIuY2hhckF0KGEpLGRiW2FdPVwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODktXy5cIi5jaGFyQXQoYSksZWJbZGJbYV1dPWEsNjI8PWEmJihlYltcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCIuY2hhckF0KGEpXT1hKX19O2Z1bmN0aW9uIHUoYSxiKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsYil9ZnVuY3Rpb24gdyhhLGIpe2lmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLGIpKXJldHVybiBhW2JdfWZ1bmN0aW9uIGhiKGEsYil7Zm9yKHZhciBjIGluIGEpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsYykmJmIoYyxhW2NdKX1mdW5jdGlvbiBpYihhKXt2YXIgYj17fTtoYihhLGZ1bmN0aW9uKGEsZCl7YlthXT1kfSk7cmV0dXJuIGJ9O2Z1bmN0aW9uIGpiKGEpe3ZhciBiPVtdO2hiKGEsZnVuY3Rpb24oYSxkKXtlYShkKT9PYShkLGZ1bmN0aW9uKGQpe2IucHVzaChlbmNvZGVVUklDb21wb25lbnQoYSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGQpKX0pOmIucHVzaChlbmNvZGVVUklDb21wb25lbnQoYSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGQpKX0pO3JldHVybiBiLmxlbmd0aD9cIiZcIitiLmpvaW4oXCImXCIpOlwiXCJ9ZnVuY3Rpb24ga2IoYSl7dmFyIGI9e307YT1hLnJlcGxhY2UoL15cXD8vLFwiXCIpLnNwbGl0KFwiJlwiKTtPYShhLGZ1bmN0aW9uKGEpe2EmJihhPWEuc3BsaXQoXCI9XCIpLGJbYVswXV09YVsxXSl9KTtyZXR1cm4gYn07ZnVuY3Rpb24geChhLGIsYyxkKXt2YXIgZTtkPGI/ZT1cImF0IGxlYXN0IFwiK2I6ZD5jJiYoZT0wPT09Yz9cIm5vbmVcIjpcIm5vIG1vcmUgdGhhbiBcIitjKTtpZihlKXRocm93IEVycm9yKGErXCIgZmFpbGVkOiBXYXMgY2FsbGVkIHdpdGggXCIrZCsoMT09PWQ/XCIgYXJndW1lbnQuXCI6XCIgYXJndW1lbnRzLlwiKStcIiBFeHBlY3RzIFwiK2UrXCIuXCIpO31mdW5jdGlvbiB6KGEsYixjKXt2YXIgZD1cIlwiO3N3aXRjaChiKXtjYXNlIDE6ZD1jP1wiZmlyc3RcIjpcIkZpcnN0XCI7YnJlYWs7Y2FzZSAyOmQ9Yz9cInNlY29uZFwiOlwiU2Vjb25kXCI7YnJlYWs7Y2FzZSAzOmQ9Yz9cInRoaXJkXCI6XCJUaGlyZFwiO2JyZWFrO2Nhc2UgNDpkPWM/XCJmb3VydGhcIjpcIkZvdXJ0aFwiO2JyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IoXCJlcnJvclByZWZpeCBjYWxsZWQgd2l0aCBhcmd1bWVudE51bWJlciA+IDQuICBOZWVkIHRvIHVwZGF0ZSBpdD9cIik7fXJldHVybiBhPWErXCIgZmFpbGVkOiBcIisoZCtcIiBhcmd1bWVudCBcIil9XG5mdW5jdGlvbiBBKGEsYixjLGQpe2lmKCghZHx8bihjKSkmJiFoYShjKSl0aHJvdyBFcnJvcih6KGEsYixkKStcIm11c3QgYmUgYSB2YWxpZCBmdW5jdGlvbi5cIik7fWZ1bmN0aW9uIGxiKGEsYixjKXtpZihuKGMpJiYoIWlhKGMpfHxudWxsPT09YykpdGhyb3cgRXJyb3IoeihhLGIsITApK1wibXVzdCBiZSBhIHZhbGlkIGNvbnRleHQgb2JqZWN0LlwiKTt9O2Z1bmN0aW9uIG1iKGEpe3JldHVyblwidW5kZWZpbmVkXCIhPT10eXBlb2YgSlNPTiYmbihKU09OLnBhcnNlKT9KU09OLnBhcnNlKGEpOkFhKGEpfWZ1bmN0aW9uIEIoYSl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBKU09OJiZuKEpTT04uc3RyaW5naWZ5KSlhPUpTT04uc3RyaW5naWZ5KGEpO2Vsc2V7dmFyIGI9W107Q2EobmV3IEJhLGEsYik7YT1iLmpvaW4oXCJcIil9cmV0dXJuIGF9O2Z1bmN0aW9uIG5iKCl7dGhpcy5TZD1DfW5iLnByb3RvdHlwZS5qPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlNkLm9hKGEpfTtuYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5TZC50b1N0cmluZygpfTtmdW5jdGlvbiBvYigpe31vYi5wcm90b3R5cGUucGY9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07b2IucHJvdG90eXBlLnhlPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O3ZhciBwYj1uZXcgb2I7ZnVuY3Rpb24gcWIoYSxiLGMpe3RoaXMuUWY9YTt0aGlzLkthPWI7dGhpcy5IZD1jfXFiLnByb3RvdHlwZS5wZj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLkthLkQ7aWYocmIoYixhKSlyZXR1cm4gYi5qKCkuTShhKTtiPW51bGwhPXRoaXMuSGQ/bmV3IHNiKHRoaXMuSGQsITAsITEpOnRoaXMuS2EudSgpO3JldHVybiB0aGlzLlFmLlhhKGEsYil9O3FiLnByb3RvdHlwZS54ZT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9bnVsbCE9dGhpcy5IZD90aGlzLkhkOnRiKHRoaXMuS2EpO2E9dGhpcy5RZi5tZShkLGIsMSxjLGEpO3JldHVybiAwPT09YS5sZW5ndGg/bnVsbDphWzBdfTtmdW5jdGlvbiB1Yigpe3RoaXMudGI9W119ZnVuY3Rpb24gdmIoYSxiKXtmb3IodmFyIGM9bnVsbCxkPTA7ZDxiLmxlbmd0aDtkKyspe3ZhciBlPWJbZF0sZj1lLlliKCk7bnVsbD09PWN8fGYuWihjLlliKCkpfHwoYS50Yi5wdXNoKGMpLGM9bnVsbCk7bnVsbD09PWMmJihjPW5ldyB3YihmKSk7Yy5hZGQoZSl9YyYmYS50Yi5wdXNoKGMpfWZ1bmN0aW9uIHhiKGEsYixjKXt2YihhLGMpO3liKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGEuWihiKX0pfWZ1bmN0aW9uIHpiKGEsYixjKXt2YihhLGMpO3liKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGEuY29udGFpbnMoYil8fGIuY29udGFpbnMoYSl9KX1cbmZ1bmN0aW9uIHliKGEsYil7Zm9yKHZhciBjPSEwLGQ9MDtkPGEudGIubGVuZ3RoO2QrKyl7dmFyIGU9YS50YltkXTtpZihlKWlmKGU9ZS5ZYigpLGIoZSkpe2Zvcih2YXIgZT1hLnRiW2RdLGY9MDtmPGUuc2QubGVuZ3RoO2YrKyl7dmFyIGc9ZS5zZFtmXTtpZihudWxsIT09Zyl7ZS5zZFtmXT1udWxsO3ZhciBrPWcuVWIoKTtBYiYmQmIoXCJldmVudDogXCIrZy50b1N0cmluZygpKTtDYihrKX19YS50YltkXT1udWxsfWVsc2UgYz0hMX1jJiYoYS50Yj1bXSl9ZnVuY3Rpb24gd2IoYSl7dGhpcy5xYT1hO3RoaXMuc2Q9W119d2IucHJvdG90eXBlLmFkZD1mdW5jdGlvbihhKXt0aGlzLnNkLnB1c2goYSl9O3diLnByb3RvdHlwZS5ZYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnFhfTtmdW5jdGlvbiBEKGEsYixjLGQpe3RoaXMudHlwZT1hO3RoaXMuSmE9Yjt0aGlzLllhPWM7dGhpcy5KZT1kO3RoaXMuTmQ9dm9pZCAwfWZ1bmN0aW9uIERiKGEpe3JldHVybiBuZXcgRChFYixhKX12YXIgRWI9XCJ2YWx1ZVwiO2Z1bmN0aW9uIEZiKGEsYixjLGQpe3RoaXMudGU9Yjt0aGlzLldkPWM7dGhpcy5OZD1kO3RoaXMucmQ9YX1GYi5wcm90b3R5cGUuWWI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLldkLmxjKCk7cmV0dXJuXCJ2YWx1ZVwiPT09dGhpcy5yZD9hLnBhdGg6YS5wYXJlbnQoKS5wYXRofTtGYi5wcm90b3R5cGUueWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZH07RmIucHJvdG90eXBlLlViPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGUuVWIodGhpcyl9O0ZiLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLlliKCkudG9TdHJpbmcoKStcIjpcIit0aGlzLnJkK1wiOlwiK0IodGhpcy5XZC5sZigpKX07ZnVuY3Rpb24gR2IoYSxiLGMpe3RoaXMudGU9YTt0aGlzLmVycm9yPWI7dGhpcy5wYXRoPWN9R2IucHJvdG90eXBlLlliPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF0aH07R2IucHJvdG90eXBlLnllPWZ1bmN0aW9uKCl7cmV0dXJuXCJjYW5jZWxcIn07XG5HYi5wcm90b3R5cGUuVWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50ZS5VYih0aGlzKX07R2IucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF0aC50b1N0cmluZygpK1wiOmNhbmNlbFwifTtmdW5jdGlvbiBzYihhLGIsYyl7dGhpcy5CPWE7dGhpcy4kPWI7dGhpcy5UYj1jfWZ1bmN0aW9uIEhiKGEpe3JldHVybiBhLiR9ZnVuY3Rpb24gcmIoYSxiKXtyZXR1cm4gYS4kJiYhYS5UYnx8YS5CLkhhKGIpfXNiLnByb3RvdHlwZS5qPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuQn07ZnVuY3Rpb24gSWIoYSl7dGhpcy5kZz1hO3RoaXMuQWQ9bnVsbH1JYi5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5kZy5nZXQoKSxiPXhhKGEpO2lmKHRoaXMuQWQpZm9yKHZhciBjIGluIHRoaXMuQWQpYltjXS09dGhpcy5BZFtjXTt0aGlzLkFkPWE7cmV0dXJuIGJ9O2Z1bmN0aW9uIEpiKGEsYil7dGhpcy5NZj17fTt0aGlzLllkPW5ldyBJYihhKTt0aGlzLmNhPWI7dmFyIGM9MUU0KzJFNCpNYXRoLnJhbmRvbSgpO3NldFRpbWVvdXQocSh0aGlzLkhmLHRoaXMpLE1hdGguZmxvb3IoYykpfUpiLnByb3RvdHlwZS5IZj1mdW5jdGlvbigpe3ZhciBhPXRoaXMuWWQuZ2V0KCksYj17fSxjPSExLGQ7Zm9yKGQgaW4gYSkwPGFbZF0mJnUodGhpcy5NZixkKSYmKGJbZF09YVtkXSxjPSEwKTtjJiZ0aGlzLmNhLlRlKGIpO3NldFRpbWVvdXQocSh0aGlzLkhmLHRoaXMpLE1hdGguZmxvb3IoNkU1Kk1hdGgucmFuZG9tKCkpKX07ZnVuY3Rpb24gS2IoKXt0aGlzLkRjPXt9fWZ1bmN0aW9uIExiKGEsYixjKXtuKGMpfHwoYz0xKTt1KGEuRGMsYil8fChhLkRjW2JdPTApO2EuRGNbYl0rPWN9S2IucHJvdG90eXBlLmdldD1mdW5jdGlvbigpe3JldHVybiB4YSh0aGlzLkRjKX07dmFyIE1iPXt9LE5iPXt9O2Z1bmN0aW9uIE9iKGEpe2E9YS50b1N0cmluZygpO01iW2FdfHwoTWJbYV09bmV3IEtiKTtyZXR1cm4gTWJbYV19ZnVuY3Rpb24gUGIoYSxiKXt2YXIgYz1hLnRvU3RyaW5nKCk7TmJbY118fChOYltjXT1iKCkpO3JldHVybiBOYltjXX07ZnVuY3Rpb24gRShhLGIpe3RoaXMubmFtZT1hO3RoaXMuUz1ifWZ1bmN0aW9uIFFiKGEsYil7cmV0dXJuIG5ldyBFKGEsYil9O2Z1bmN0aW9uIFJiKGEsYil7cmV0dXJuIFNiKGEubmFtZSxiLm5hbWUpfWZ1bmN0aW9uIFRiKGEsYil7cmV0dXJuIFNiKGEsYil9O2Z1bmN0aW9uIFViKGEsYixjKXt0aGlzLnR5cGU9VmI7dGhpcy5zb3VyY2U9YTt0aGlzLnBhdGg9Yjt0aGlzLklhPWN9VWIucHJvdG90eXBlLldjPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnBhdGguZSgpP25ldyBVYih0aGlzLnNvdXJjZSxGLHRoaXMuSWEuTShhKSk6bmV3IFViKHRoaXMuc291cmNlLEcodGhpcy5wYXRoKSx0aGlzLklhKX07VWIucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJPcGVyYXRpb24oXCIrdGhpcy5wYXRoK1wiOiBcIit0aGlzLnNvdXJjZS50b1N0cmluZygpK1wiIG92ZXJ3cml0ZTogXCIrdGhpcy5JYS50b1N0cmluZygpK1wiKVwifTtmdW5jdGlvbiBXYihhLGIpe3RoaXMudHlwZT1YYjt0aGlzLnNvdXJjZT1ZYjt0aGlzLnBhdGg9YTt0aGlzLlZlPWJ9V2IucHJvdG90eXBlLldjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF0aC5lKCk/dGhpczpuZXcgV2IoRyh0aGlzLnBhdGgpLHRoaXMuVmUpfTtXYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIk9wZXJhdGlvbihcIit0aGlzLnBhdGgrXCI6IFwiK3RoaXMuc291cmNlLnRvU3RyaW5nKCkrXCIgYWNrIHdyaXRlIHJldmVydD1cIit0aGlzLlZlK1wiKVwifTtmdW5jdGlvbiBaYihhLGIpe3RoaXMudHlwZT0kYjt0aGlzLnNvdXJjZT1hO3RoaXMucGF0aD1ifVpiLnByb3RvdHlwZS5XYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdGguZSgpP25ldyBaYih0aGlzLnNvdXJjZSxGKTpuZXcgWmIodGhpcy5zb3VyY2UsRyh0aGlzLnBhdGgpKX07WmIucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJPcGVyYXRpb24oXCIrdGhpcy5wYXRoK1wiOiBcIit0aGlzLnNvdXJjZS50b1N0cmluZygpK1wiIGxpc3Rlbl9jb21wbGV0ZSlcIn07ZnVuY3Rpb24gYWMoYSxiKXt0aGlzLkxhPWE7dGhpcy54YT1iP2I6YmN9aD1hYy5wcm90b3R5cGU7aC5OYT1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgYWModGhpcy5MYSx0aGlzLnhhLk5hKGEsYix0aGlzLkxhKS5YKG51bGwsbnVsbCwhMSxudWxsLG51bGwpKX07aC5yZW1vdmU9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBhYyh0aGlzLkxhLHRoaXMueGEucmVtb3ZlKGEsdGhpcy5MYSkuWChudWxsLG51bGwsITEsbnVsbCxudWxsKSl9O2guZ2V0PWZ1bmN0aW9uKGEpe2Zvcih2YXIgYixjPXRoaXMueGE7IWMuZSgpOyl7Yj10aGlzLkxhKGEsYy5rZXkpO2lmKDA9PT1iKXJldHVybiBjLnZhbHVlOzA+Yj9jPWMubGVmdDowPGImJihjPWMucmlnaHQpfXJldHVybiBudWxsfTtcbmZ1bmN0aW9uIGNjKGEsYil7Zm9yKHZhciBjLGQ9YS54YSxlPW51bGw7IWQuZSgpOyl7Yz1hLkxhKGIsZC5rZXkpO2lmKDA9PT1jKXtpZihkLmxlZnQuZSgpKXJldHVybiBlP2Uua2V5Om51bGw7Zm9yKGQ9ZC5sZWZ0OyFkLnJpZ2h0LmUoKTspZD1kLnJpZ2h0O3JldHVybiBkLmtleX0wPmM/ZD1kLmxlZnQ6MDxjJiYoZT1kLGQ9ZC5yaWdodCl9dGhyb3cgRXJyb3IoXCJBdHRlbXB0ZWQgdG8gZmluZCBwcmVkZWNlc3NvciBrZXkgZm9yIGEgbm9uZXhpc3RlbnQga2V5LiAgV2hhdCBnaXZlcz9cIik7fWguZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnhhLmUoKX07aC5jb3VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnhhLmNvdW50KCl9O2guUmM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54YS5SYygpfTtoLmVjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueGEuZWMoKX07aC5oYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy54YS5oYShhKX07XG5oLldiPWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgZGModGhpcy54YSxudWxsLHRoaXMuTGEsITEsYSl9O2guWGI9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGRjKHRoaXMueGEsYSx0aGlzLkxhLCExLGIpfTtoLlpiPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBkYyh0aGlzLnhhLGEsdGhpcy5MYSwhMCxiKX07aC5yZj1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IGRjKHRoaXMueGEsbnVsbCx0aGlzLkxhLCEwLGEpfTtmdW5jdGlvbiBkYyhhLGIsYyxkLGUpe3RoaXMuUmQ9ZXx8bnVsbDt0aGlzLkVlPWQ7dGhpcy5QYT1bXTtmb3IoZT0xOyFhLmUoKTspaWYoZT1iP2MoYS5rZXksYik6MSxkJiYoZSo9LTEpLDA+ZSlhPXRoaXMuRWU/YS5sZWZ0OmEucmlnaHQ7ZWxzZSBpZigwPT09ZSl7dGhpcy5QYS5wdXNoKGEpO2JyZWFrfWVsc2UgdGhpcy5QYS5wdXNoKGEpLGE9dGhpcy5FZT9hLnJpZ2h0OmEubGVmdH1cbmZ1bmN0aW9uIEgoYSl7aWYoMD09PWEuUGEubGVuZ3RoKXJldHVybiBudWxsO3ZhciBiPWEuUGEucG9wKCksYztjPWEuUmQ/YS5SZChiLmtleSxiLnZhbHVlKTp7a2V5OmIua2V5LHZhbHVlOmIudmFsdWV9O2lmKGEuRWUpZm9yKGI9Yi5sZWZ0OyFiLmUoKTspYS5QYS5wdXNoKGIpLGI9Yi5yaWdodDtlbHNlIGZvcihiPWIucmlnaHQ7IWIuZSgpOylhLlBhLnB1c2goYiksYj1iLmxlZnQ7cmV0dXJuIGN9ZnVuY3Rpb24gZWMoYSl7aWYoMD09PWEuUGEubGVuZ3RoKXJldHVybiBudWxsO3ZhciBiO2I9YS5QYTtiPWJbYi5sZW5ndGgtMV07cmV0dXJuIGEuUmQ/YS5SZChiLmtleSxiLnZhbHVlKTp7a2V5OmIua2V5LHZhbHVlOmIudmFsdWV9fWZ1bmN0aW9uIGZjKGEsYixjLGQsZSl7dGhpcy5rZXk9YTt0aGlzLnZhbHVlPWI7dGhpcy5jb2xvcj1udWxsIT1jP2M6ITA7dGhpcy5sZWZ0PW51bGwhPWQ/ZDpiYzt0aGlzLnJpZ2h0PW51bGwhPWU/ZTpiY31oPWZjLnByb3RvdHlwZTtcbmguWD1mdW5jdGlvbihhLGIsYyxkLGUpe3JldHVybiBuZXcgZmMobnVsbCE9YT9hOnRoaXMua2V5LG51bGwhPWI/Yjp0aGlzLnZhbHVlLG51bGwhPWM/Yzp0aGlzLmNvbG9yLG51bGwhPWQ/ZDp0aGlzLmxlZnQsbnVsbCE9ZT9lOnRoaXMucmlnaHQpfTtoLmNvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubGVmdC5jb3VudCgpKzErdGhpcy5yaWdodC5jb3VudCgpfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5oYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5sZWZ0LmhhKGEpfHxhKHRoaXMua2V5LHRoaXMudmFsdWUpfHx0aGlzLnJpZ2h0LmhhKGEpfTtmdW5jdGlvbiBnYyhhKXtyZXR1cm4gYS5sZWZ0LmUoKT9hOmdjKGEubGVmdCl9aC5SYz1mdW5jdGlvbigpe3JldHVybiBnYyh0aGlzKS5rZXl9O2guZWM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yaWdodC5lKCk/dGhpcy5rZXk6dGhpcy5yaWdodC5lYygpfTtcbmguTmE9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGU7ZT10aGlzO2Q9YyhhLGUua2V5KTtlPTA+ZD9lLlgobnVsbCxudWxsLG51bGwsZS5sZWZ0Lk5hKGEsYixjKSxudWxsKTowPT09ZD9lLlgobnVsbCxiLG51bGwsbnVsbCxudWxsKTplLlgobnVsbCxudWxsLG51bGwsbnVsbCxlLnJpZ2h0Lk5hKGEsYixjKSk7cmV0dXJuIGhjKGUpfTtmdW5jdGlvbiBpYyhhKXtpZihhLmxlZnQuZSgpKXJldHVybiBiYzthLmxlZnQuZmEoKXx8YS5sZWZ0LmxlZnQuZmEoKXx8KGE9amMoYSkpO2E9YS5YKG51bGwsbnVsbCxudWxsLGljKGEubGVmdCksbnVsbCk7cmV0dXJuIGhjKGEpfVxuaC5yZW1vdmU9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkO2M9dGhpcztpZigwPmIoYSxjLmtleSkpYy5sZWZ0LmUoKXx8Yy5sZWZ0LmZhKCl8fGMubGVmdC5sZWZ0LmZhKCl8fChjPWpjKGMpKSxjPWMuWChudWxsLG51bGwsbnVsbCxjLmxlZnQucmVtb3ZlKGEsYiksbnVsbCk7ZWxzZXtjLmxlZnQuZmEoKSYmKGM9a2MoYykpO2MucmlnaHQuZSgpfHxjLnJpZ2h0LmZhKCl8fGMucmlnaHQubGVmdC5mYSgpfHwoYz1sYyhjKSxjLmxlZnQubGVmdC5mYSgpJiYoYz1rYyhjKSxjPWxjKGMpKSk7aWYoMD09PWIoYSxjLmtleSkpe2lmKGMucmlnaHQuZSgpKXJldHVybiBiYztkPWdjKGMucmlnaHQpO2M9Yy5YKGQua2V5LGQudmFsdWUsbnVsbCxudWxsLGljKGMucmlnaHQpKX1jPWMuWChudWxsLG51bGwsbnVsbCxudWxsLGMucmlnaHQucmVtb3ZlKGEsYikpfXJldHVybiBoYyhjKX07aC5mYT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbG9yfTtcbmZ1bmN0aW9uIGhjKGEpe2EucmlnaHQuZmEoKSYmIWEubGVmdC5mYSgpJiYoYT1tYyhhKSk7YS5sZWZ0LmZhKCkmJmEubGVmdC5sZWZ0LmZhKCkmJihhPWtjKGEpKTthLmxlZnQuZmEoKSYmYS5yaWdodC5mYSgpJiYoYT1sYyhhKSk7cmV0dXJuIGF9ZnVuY3Rpb24gamMoYSl7YT1sYyhhKTthLnJpZ2h0LmxlZnQuZmEoKSYmKGE9YS5YKG51bGwsbnVsbCxudWxsLG51bGwsa2MoYS5yaWdodCkpLGE9bWMoYSksYT1sYyhhKSk7cmV0dXJuIGF9ZnVuY3Rpb24gbWMoYSl7cmV0dXJuIGEucmlnaHQuWChudWxsLG51bGwsYS5jb2xvcixhLlgobnVsbCxudWxsLCEwLG51bGwsYS5yaWdodC5sZWZ0KSxudWxsKX1mdW5jdGlvbiBrYyhhKXtyZXR1cm4gYS5sZWZ0LlgobnVsbCxudWxsLGEuY29sb3IsbnVsbCxhLlgobnVsbCxudWxsLCEwLGEubGVmdC5yaWdodCxudWxsKSl9XG5mdW5jdGlvbiBsYyhhKXtyZXR1cm4gYS5YKG51bGwsbnVsbCwhYS5jb2xvcixhLmxlZnQuWChudWxsLG51bGwsIWEubGVmdC5jb2xvcixudWxsLG51bGwpLGEucmlnaHQuWChudWxsLG51bGwsIWEucmlnaHQuY29sb3IsbnVsbCxudWxsKSl9ZnVuY3Rpb24gbmMoKXt9aD1uYy5wcm90b3R5cGU7aC5YPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O2guTmE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGZjKGEsYixudWxsKX07aC5yZW1vdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307aC5jb3VudD1mdW5jdGlvbigpe3JldHVybiAwfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC5oYT1mdW5jdGlvbigpe3JldHVybiExfTtoLlJjPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O2guZWM9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07aC5mYT1mdW5jdGlvbigpe3JldHVybiExfTt2YXIgYmM9bmV3IG5jO2Z1bmN0aW9uIG9jKGEsYil7cmV0dXJuIGEmJlwib2JqZWN0XCI9PT10eXBlb2YgYT8oSihcIi5zdlwiaW4gYSxcIlVuZXhwZWN0ZWQgbGVhZiBub2RlIG9yIHByaW9yaXR5IGNvbnRlbnRzXCIpLGJbYVtcIi5zdlwiXV0pOmF9ZnVuY3Rpb24gcGMoYSxiKXt2YXIgYz1uZXcgcWM7cmMoYSxuZXcgSyhcIlwiKSxmdW5jdGlvbihhLGUpe2MubWMoYSxzYyhlLGIpKX0pO3JldHVybiBjfWZ1bmN0aW9uIHNjKGEsYil7dmFyIGM9YS5BKCkuSygpLGM9b2MoYyxiKSxkO2lmKGEuTigpKXt2YXIgZT1vYyhhLkJhKCksYik7cmV0dXJuIGUhPT1hLkJhKCl8fGMhPT1hLkEoKS5LKCk/bmV3IHRjKGUsTChjKSk6YX1kPWE7YyE9PWEuQSgpLksoKSYmKGQ9ZC5kYShuZXcgdGMoYykpKTthLlUoTSxmdW5jdGlvbihhLGMpe3ZhciBlPXNjKGMsYik7ZSE9PWMmJihkPWQuUShhLGUpKX0pO3JldHVybiBkfTtmdW5jdGlvbiBLKGEsYil7aWYoMT09YXJndW1lbnRzLmxlbmd0aCl7dGhpcy5vPWEuc3BsaXQoXCIvXCIpO2Zvcih2YXIgYz0wLGQ9MDtkPHRoaXMuby5sZW5ndGg7ZCsrKTA8dGhpcy5vW2RdLmxlbmd0aCYmKHRoaXMub1tjXT10aGlzLm9bZF0sYysrKTt0aGlzLm8ubGVuZ3RoPWM7dGhpcy5ZPTB9ZWxzZSB0aGlzLm89YSx0aGlzLlk9Yn1mdW5jdGlvbiBOKGEsYil7dmFyIGM9TyhhKTtpZihudWxsPT09YylyZXR1cm4gYjtpZihjPT09TyhiKSlyZXR1cm4gTihHKGEpLEcoYikpO3Rocm93IEVycm9yKFwiSU5URVJOQUwgRVJST1I6IGlubmVyUGF0aCAoXCIrYitcIikgaXMgbm90IHdpdGhpbiBvdXRlclBhdGggKFwiK2ErXCIpXCIpO31mdW5jdGlvbiBPKGEpe3JldHVybiBhLlk+PWEuby5sZW5ndGg/bnVsbDphLm9bYS5ZXX1mdW5jdGlvbiB1YyhhKXtyZXR1cm4gYS5vLmxlbmd0aC1hLll9XG5mdW5jdGlvbiBHKGEpe3ZhciBiPWEuWTtiPGEuby5sZW5ndGgmJmIrKztyZXR1cm4gbmV3IEsoYS5vLGIpfWZ1bmN0aW9uIHZjKGEpe3JldHVybiBhLlk8YS5vLmxlbmd0aD9hLm9bYS5vLmxlbmd0aC0xXTpudWxsfWg9Sy5wcm90b3R5cGU7aC50b1N0cmluZz1mdW5jdGlvbigpe2Zvcih2YXIgYT1cIlwiLGI9dGhpcy5ZO2I8dGhpcy5vLmxlbmd0aDtiKyspXCJcIiE9PXRoaXMub1tiXSYmKGErPVwiL1wiK3RoaXMub1tiXSk7cmV0dXJuIGF8fFwiL1wifTtoLnNsaWNlPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLm8uc2xpY2UodGhpcy5ZKyhhfHwwKSl9O2gucGFyZW50PWZ1bmN0aW9uKCl7aWYodGhpcy5ZPj10aGlzLm8ubGVuZ3RoKXJldHVybiBudWxsO2Zvcih2YXIgYT1bXSxiPXRoaXMuWTtiPHRoaXMuby5sZW5ndGgtMTtiKyspYS5wdXNoKHRoaXMub1tiXSk7cmV0dXJuIG5ldyBLKGEsMCl9O1xuaC53PWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1bXSxjPXRoaXMuWTtjPHRoaXMuby5sZW5ndGg7YysrKWIucHVzaCh0aGlzLm9bY10pO2lmKGEgaW5zdGFuY2VvZiBLKWZvcihjPWEuWTtjPGEuby5sZW5ndGg7YysrKWIucHVzaChhLm9bY10pO2Vsc2UgZm9yKGE9YS5zcGxpdChcIi9cIiksYz0wO2M8YS5sZW5ndGg7YysrKTA8YVtjXS5sZW5ndGgmJmIucHVzaChhW2NdKTtyZXR1cm4gbmV3IEsoYiwwKX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuWT49dGhpcy5vLmxlbmd0aH07aC5aPWZ1bmN0aW9uKGEpe2lmKHVjKHRoaXMpIT09dWMoYSkpcmV0dXJuITE7Zm9yKHZhciBiPXRoaXMuWSxjPWEuWTtiPD10aGlzLm8ubGVuZ3RoO2IrKyxjKyspaWYodGhpcy5vW2JdIT09YS5vW2NdKXJldHVybiExO3JldHVybiEwfTtcbmguY29udGFpbnM9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5ZLGM9YS5ZO2lmKHVjKHRoaXMpPnVjKGEpKXJldHVybiExO2Zvcig7Yjx0aGlzLm8ubGVuZ3RoOyl7aWYodGhpcy5vW2JdIT09YS5vW2NdKXJldHVybiExOysrYjsrK2N9cmV0dXJuITB9O3ZhciBGPW5ldyBLKFwiXCIpO2Z1bmN0aW9uIHdjKGEsYil7dGhpcy5RYT1hLnNsaWNlKCk7dGhpcy5FYT1NYXRoLm1heCgxLHRoaXMuUWEubGVuZ3RoKTt0aGlzLmtmPWI7Zm9yKHZhciBjPTA7Yzx0aGlzLlFhLmxlbmd0aDtjKyspdGhpcy5FYSs9eGModGhpcy5RYVtjXSk7eWModGhpcyl9d2MucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oYSl7MDx0aGlzLlFhLmxlbmd0aCYmKHRoaXMuRWErPTEpO3RoaXMuUWEucHVzaChhKTt0aGlzLkVhKz14YyhhKTt5Yyh0aGlzKX07d2MucHJvdG90eXBlLnBvcD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuUWEucG9wKCk7dGhpcy5FYS09eGMoYSk7MDx0aGlzLlFhLmxlbmd0aCYmLS10aGlzLkVhfTtcbmZ1bmN0aW9uIHljKGEpe2lmKDc2ODxhLkVhKXRocm93IEVycm9yKGEua2YrXCJoYXMgYSBrZXkgcGF0aCBsb25nZXIgdGhhbiA3NjggYnl0ZXMgKFwiK2EuRWErXCIpLlwiKTtpZigzMjxhLlFhLmxlbmd0aCl0aHJvdyBFcnJvcihhLmtmK1wicGF0aCBzcGVjaWZpZWQgZXhjZWVkcyB0aGUgbWF4aW11bSBkZXB0aCB0aGF0IGNhbiBiZSB3cml0dGVuICgzMikgb3Igb2JqZWN0IGNvbnRhaW5zIGEgY3ljbGUgXCIremMoYSkpO31mdW5jdGlvbiB6YyhhKXtyZXR1cm4gMD09YS5RYS5sZW5ndGg/XCJcIjpcImluIHByb3BlcnR5ICdcIithLlFhLmpvaW4oXCIuXCIpK1wiJ1wifTtmdW5jdGlvbiBBYygpe3RoaXMud2M9e319QWMucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe251bGw9PWI/ZGVsZXRlIHRoaXMud2NbYV06dGhpcy53Y1thXT1ifTtBYy5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGEpe3JldHVybiB1KHRoaXMud2MsYSk/dGhpcy53Y1thXTpudWxsfTtBYy5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGEpe2RlbGV0ZSB0aGlzLndjW2FdfTtBYy5wcm90b3R5cGUudWY9ITA7ZnVuY3Rpb24gQmMoYSl7dGhpcy5FYz1hO3RoaXMuTWQ9XCJmaXJlYmFzZTpcIn1oPUJjLnByb3RvdHlwZTtoLnNldD1mdW5jdGlvbihhLGIpe251bGw9PWI/dGhpcy5FYy5yZW1vdmVJdGVtKHRoaXMuTWQrYSk6dGhpcy5FYy5zZXRJdGVtKHRoaXMuTWQrYSxCKGIpKX07aC5nZXQ9ZnVuY3Rpb24oYSl7YT10aGlzLkVjLmdldEl0ZW0odGhpcy5NZCthKTtyZXR1cm4gbnVsbD09YT9udWxsOm1iKGEpfTtoLnJlbW92ZT1mdW5jdGlvbihhKXt0aGlzLkVjLnJlbW92ZUl0ZW0odGhpcy5NZCthKX07aC51Zj0hMTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuRWMudG9TdHJpbmcoKX07ZnVuY3Rpb24gQ2MoYSl7dHJ5e2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvd1thXSl7dmFyIGI9d2luZG93W2FdO2Iuc2V0SXRlbShcImZpcmViYXNlOnNlbnRpbmVsXCIsXCJjYWNoZVwiKTtiLnJlbW92ZUl0ZW0oXCJmaXJlYmFzZTpzZW50aW5lbFwiKTtyZXR1cm4gbmV3IEJjKGIpfX1jYXRjaChjKXt9cmV0dXJuIG5ldyBBY312YXIgRGM9Q2MoXCJsb2NhbFN0b3JhZ2VcIiksUD1DYyhcInNlc3Npb25TdG9yYWdlXCIpO2Z1bmN0aW9uIEVjKGEsYixjLGQsZSl7dGhpcy5ob3N0PWEudG9Mb3dlckNhc2UoKTt0aGlzLmRvbWFpbj10aGlzLmhvc3Quc3Vic3RyKHRoaXMuaG9zdC5pbmRleE9mKFwiLlwiKSsxKTt0aGlzLmxiPWI7dGhpcy5DYj1jO3RoaXMuVGc9ZDt0aGlzLkxkPWV8fFwiXCI7dGhpcy5PYT1EYy5nZXQoXCJob3N0OlwiK2EpfHx0aGlzLmhvc3R9ZnVuY3Rpb24gRmMoYSxiKXtiIT09YS5PYSYmKGEuT2E9YixcInMtXCI9PT1hLk9hLnN1YnN0cigwLDIpJiZEYy5zZXQoXCJob3N0OlwiK2EuaG9zdCxhLk9hKSl9RWMucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7dmFyIGE9KHRoaXMubGI/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKSt0aGlzLmhvc3Q7dGhpcy5MZCYmKGErPVwiPFwiK3RoaXMuTGQrXCI+XCIpO3JldHVybiBhfTt2YXIgR2M9ZnVuY3Rpb24oKXt2YXIgYT0xO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBhKyt9fSgpO2Z1bmN0aW9uIEooYSxiKXtpZighYSl0aHJvdyBIYyhiKTt9ZnVuY3Rpb24gSGMoYSl7cmV0dXJuIEVycm9yKFwiRmlyZWJhc2UgKDIuMi40KSBJTlRFUk5BTCBBU1NFUlQgRkFJTEVEOiBcIithKX1cbmZ1bmN0aW9uIEljKGEpe3RyeXt2YXIgYjtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGF0b2IpYj1hdG9iKGEpO2Vsc2V7Z2IoKTtmb3IodmFyIGM9ZWIsZD1bXSxlPTA7ZTxhLmxlbmd0aDspe3ZhciBmPWNbYS5jaGFyQXQoZSsrKV0sZz1lPGEubGVuZ3RoP2NbYS5jaGFyQXQoZSldOjA7KytlO3ZhciBrPWU8YS5sZW5ndGg/Y1thLmNoYXJBdChlKV06NjQ7KytlO3ZhciBsPWU8YS5sZW5ndGg/Y1thLmNoYXJBdChlKV06NjQ7KytlO2lmKG51bGw9PWZ8fG51bGw9PWd8fG51bGw9PWt8fG51bGw9PWwpdGhyb3cgRXJyb3IoKTtkLnB1c2goZjw8MnxnPj40KTs2NCE9ayYmKGQucHVzaChnPDw0JjI0MHxrPj4yKSw2NCE9bCYmZC5wdXNoKGs8PDYmMTkyfGwpKX1pZig4MTkyPmQubGVuZ3RoKWI9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGQpO2Vsc2V7YT1cIlwiO2ZvcihjPTA7YzxkLmxlbmd0aDtjKz04MTkyKWErPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxXYShkLGMsXG5jKzgxOTIpKTtiPWF9fXJldHVybiBifWNhdGNoKG0pe0JiKFwiYmFzZTY0RGVjb2RlIGZhaWxlZDogXCIsbSl9cmV0dXJuIG51bGx9ZnVuY3Rpb24gSmMoYSl7dmFyIGI9S2MoYSk7YT1uZXcgTGE7YS51cGRhdGUoYik7dmFyIGI9W10sYz04KmEuYmU7NTY+YS4kYj9hLnVwZGF0ZShhLklkLDU2LWEuJGIpOmEudXBkYXRlKGEuSWQsYS5XYS0oYS4kYi01NikpO2Zvcih2YXIgZD1hLldhLTE7NTY8PWQ7ZC0tKWEubGVbZF09YyYyNTUsYy89MjU2O01hKGEsYS5sZSk7Zm9yKGQ9Yz0wOzU+ZDtkKyspZm9yKHZhciBlPTI0OzA8PWU7ZS09OCliW2NdPWEuUltkXT4+ZSYyNTUsKytjO3JldHVybiBmYihiKX1cbmZ1bmN0aW9uIExjKGEpe2Zvcih2YXIgYj1cIlwiLGM9MDtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKWI9ZmEoYXJndW1lbnRzW2NdKT9iK0xjLmFwcGx5KG51bGwsYXJndW1lbnRzW2NdKTpcIm9iamVjdFwiPT09dHlwZW9mIGFyZ3VtZW50c1tjXT9iK0IoYXJndW1lbnRzW2NdKTpiK2FyZ3VtZW50c1tjXSxiKz1cIiBcIjtyZXR1cm4gYn12YXIgQWI9bnVsbCxNYz0hMDtmdW5jdGlvbiBCYihhKXshMD09PU1jJiYoTWM9ITEsbnVsbD09PUFiJiYhMD09PVAuZ2V0KFwibG9nZ2luZ19lbmFibGVkXCIpJiZOYyghMCkpO2lmKEFiKXt2YXIgYj1MYy5hcHBseShudWxsLGFyZ3VtZW50cyk7QWIoYil9fWZ1bmN0aW9uIE9jKGEpe3JldHVybiBmdW5jdGlvbigpe0JiKGEsYXJndW1lbnRzKX19XG5mdW5jdGlvbiBQYyhhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUpe3ZhciBiPVwiRklSRUJBU0UgSU5URVJOQUwgRVJST1I6IFwiK0xjLmFwcGx5KG51bGwsYXJndW1lbnRzKTtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUuZXJyb3I/Y29uc29sZS5lcnJvcihiKTpjb25zb2xlLmxvZyhiKX19ZnVuY3Rpb24gUWMoYSl7dmFyIGI9TGMuYXBwbHkobnVsbCxhcmd1bWVudHMpO3Rocm93IEVycm9yKFwiRklSRUJBU0UgRkFUQUwgRVJST1I6IFwiK2IpO31mdW5jdGlvbiBRKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7dmFyIGI9XCJGSVJFQkFTRSBXQVJOSU5HOiBcIitMYy5hcHBseShudWxsLGFyZ3VtZW50cyk7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlLndhcm4/Y29uc29sZS53YXJuKGIpOmNvbnNvbGUubG9nKGIpfX1cbmZ1bmN0aW9uIFJjKGEpe3ZhciBiPVwiXCIsYz1cIlwiLGQ9XCJcIixlPVwiXCIsZj0hMCxnPVwiaHR0cHNcIixrPTQ0MztpZihwKGEpKXt2YXIgbD1hLmluZGV4T2YoXCIvL1wiKTswPD1sJiYoZz1hLnN1YnN0cmluZygwLGwtMSksYT1hLnN1YnN0cmluZyhsKzIpKTtsPWEuaW5kZXhPZihcIi9cIik7LTE9PT1sJiYobD1hLmxlbmd0aCk7Yj1hLnN1YnN0cmluZygwLGwpO2U9XCJcIjthPWEuc3Vic3RyaW5nKGwpLnNwbGl0KFwiL1wiKTtmb3IobD0wO2w8YS5sZW5ndGg7bCsrKWlmKDA8YVtsXS5sZW5ndGgpe3ZhciBtPWFbbF07dHJ5e209ZGVjb2RlVVJJQ29tcG9uZW50KG0ucmVwbGFjZSgvXFwrL2csXCIgXCIpKX1jYXRjaCh2KXt9ZSs9XCIvXCIrbX1hPWIuc3BsaXQoXCIuXCIpOzM9PT1hLmxlbmd0aD8oYz1hWzFdLGQ9YVswXS50b0xvd2VyQ2FzZSgpKToyPT09YS5sZW5ndGgmJihjPWFbMF0pO2w9Yi5pbmRleE9mKFwiOlwiKTswPD1sJiYoZj1cImh0dHBzXCI9PT1nfHxcIndzc1wiPT09ZyxrPWIuc3Vic3RyaW5nKGwrMSksaXNGaW5pdGUoaykmJlxuKGs9U3RyaW5nKGspKSxrPXAoayk/L15cXHMqLT8weC9pLnRlc3Qoayk/cGFyc2VJbnQoaywxNik6cGFyc2VJbnQoaywxMCk6TmFOKX1yZXR1cm57aG9zdDpiLHBvcnQ6ayxkb21haW46YyxRZzpkLGxiOmYsc2NoZW1lOmcsWmM6ZX19ZnVuY3Rpb24gU2MoYSl7cmV0dXJuIGdhKGEpJiYoYSE9YXx8YT09TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfHxhPT1OdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFkpfVxuZnVuY3Rpb24gVGMoYSl7aWYoXCJjb21wbGV0ZVwiPT09ZG9jdW1lbnQucmVhZHlTdGF0ZSlhKCk7ZWxzZXt2YXIgYj0hMSxjPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keT9ifHwoYj0hMCxhKCkpOnNldFRpbWVvdXQoYyxNYXRoLmZsb29yKDEwKSl9O2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/KGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYywhMSksd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsYywhMSkpOmRvY3VtZW50LmF0dGFjaEV2ZW50JiYoZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbigpe1wiY29tcGxldGVcIj09PWRvY3VtZW50LnJlYWR5U3RhdGUmJmMoKX0pLHdpbmRvdy5hdHRhY2hFdmVudChcIm9ubG9hZFwiLGMpKX19XG5mdW5jdGlvbiBTYihhLGIpe2lmKGE9PT1iKXJldHVybiAwO2lmKFwiW01JTl9OQU1FXVwiPT09YXx8XCJbTUFYX05BTUVdXCI9PT1iKXJldHVybi0xO2lmKFwiW01JTl9OQU1FXVwiPT09Ynx8XCJbTUFYX05BTUVdXCI9PT1hKXJldHVybiAxO3ZhciBjPVVjKGEpLGQ9VWMoYik7cmV0dXJuIG51bGwhPT1jP251bGwhPT1kPzA9PWMtZD9hLmxlbmd0aC1iLmxlbmd0aDpjLWQ6LTE6bnVsbCE9PWQ/MTphPGI/LTE6MX1mdW5jdGlvbiBWYyhhLGIpe2lmKGImJmEgaW4gYilyZXR1cm4gYlthXTt0aHJvdyBFcnJvcihcIk1pc3NpbmcgcmVxdWlyZWQga2V5IChcIithK1wiKSBpbiBvYmplY3Q6IFwiK0IoYikpO31cbmZ1bmN0aW9uIFdjKGEpe2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYXx8bnVsbD09PWEpcmV0dXJuIEIoYSk7dmFyIGI9W10sYztmb3IoYyBpbiBhKWIucHVzaChjKTtiLnNvcnQoKTtjPVwie1wiO2Zvcih2YXIgZD0wO2Q8Yi5sZW5ndGg7ZCsrKTAhPT1kJiYoYys9XCIsXCIpLGMrPUIoYltkXSksYys9XCI6XCIsYys9V2MoYVtiW2RdXSk7cmV0dXJuIGMrXCJ9XCJ9ZnVuY3Rpb24gWGMoYSxiKXtpZihhLmxlbmd0aDw9YilyZXR1cm5bYV07Zm9yKHZhciBjPVtdLGQ9MDtkPGEubGVuZ3RoO2QrPWIpZCtiPmE/Yy5wdXNoKGEuc3Vic3RyaW5nKGQsYS5sZW5ndGgpKTpjLnB1c2goYS5zdWJzdHJpbmcoZCxkK2IpKTtyZXR1cm4gY31mdW5jdGlvbiBZYyhhLGIpe2lmKGVhKGEpKWZvcih2YXIgYz0wO2M8YS5sZW5ndGg7KytjKWIoYyxhW2NdKTtlbHNlIHIoYSxiKX1cbmZ1bmN0aW9uIFpjKGEpe0ooIVNjKGEpLFwiSW52YWxpZCBKU09OIG51bWJlclwiKTt2YXIgYixjLGQsZTswPT09YT8oZD1jPTAsYj0tSW5maW5pdHk9PT0xL2E/MTowKTooYj0wPmEsYT1NYXRoLmFicyhhKSxhPj1NYXRoLnBvdygyLC0xMDIyKT8oZD1NYXRoLm1pbihNYXRoLmZsb29yKE1hdGgubG9nKGEpL01hdGguTE4yKSwxMDIzKSxjPWQrMTAyMyxkPU1hdGgucm91bmQoYSpNYXRoLnBvdygyLDUyLWQpLU1hdGgucG93KDIsNTIpKSk6KGM9MCxkPU1hdGgucm91bmQoYS9NYXRoLnBvdygyLC0xMDc0KSkpKTtlPVtdO2ZvcihhPTUyO2E7LS1hKWUucHVzaChkJTI/MTowKSxkPU1hdGguZmxvb3IoZC8yKTtmb3IoYT0xMTthOy0tYSllLnB1c2goYyUyPzE6MCksYz1NYXRoLmZsb29yKGMvMik7ZS5wdXNoKGI/MTowKTtlLnJldmVyc2UoKTtiPWUuam9pbihcIlwiKTtjPVwiXCI7Zm9yKGE9MDs2ND5hO2ErPTgpZD1wYXJzZUludChiLnN1YnN0cihhLDgpLDIpLnRvU3RyaW5nKDE2KSwxPT09ZC5sZW5ndGgmJlxuKGQ9XCIwXCIrZCksYys9ZDtyZXR1cm4gYy50b0xvd2VyQ2FzZSgpfXZhciAkYz0vXi0/XFxkezEsMTB9JC87ZnVuY3Rpb24gVWMoYSl7cmV0dXJuICRjLnRlc3QoYSkmJihhPU51bWJlcihhKSwtMjE0NzQ4MzY0ODw9YSYmMjE0NzQ4MzY0Nz49YSk/YTpudWxsfWZ1bmN0aW9uIENiKGEpe3RyeXthKCl9Y2F0Y2goYil7c2V0VGltZW91dChmdW5jdGlvbigpe1EoXCJFeGNlcHRpb24gd2FzIHRocm93biBieSB1c2VyIGNhbGxiYWNrLlwiLGIuc3RhY2t8fFwiXCIpO3Rocm93IGI7fSxNYXRoLmZsb29yKDApKX19ZnVuY3Rpb24gUihhLGIpe2lmKGhhKGEpKXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkuc2xpY2UoKTtDYihmdW5jdGlvbigpe2EuYXBwbHkobnVsbCxjKX0pfX07ZnVuY3Rpb24gS2MoYSl7Zm9yKHZhciBiPVtdLGM9MCxkPTA7ZDxhLmxlbmd0aDtkKyspe3ZhciBlPWEuY2hhckNvZGVBdChkKTs1NTI5Njw9ZSYmNTYzMTk+PWUmJihlLT01NTI5NixkKyssSihkPGEubGVuZ3RoLFwiU3Vycm9nYXRlIHBhaXIgbWlzc2luZyB0cmFpbCBzdXJyb2dhdGUuXCIpLGU9NjU1MzYrKGU8PDEwKSsoYS5jaGFyQ29kZUF0KGQpLTU2MzIwKSk7MTI4PmU/YltjKytdPWU6KDIwNDg+ZT9iW2MrK109ZT4+NnwxOTI6KDY1NTM2PmU/YltjKytdPWU+PjEyfDIyNDooYltjKytdPWU+PjE4fDI0MCxiW2MrK109ZT4+MTImNjN8MTI4KSxiW2MrK109ZT4+NiY2M3wxMjgpLGJbYysrXT1lJjYzfDEyOCl9cmV0dXJuIGJ9ZnVuY3Rpb24geGMoYSl7Zm9yKHZhciBiPTAsYz0wO2M8YS5sZW5ndGg7YysrKXt2YXIgZD1hLmNoYXJDb2RlQXQoYyk7MTI4PmQ/YisrOjIwNDg+ZD9iKz0yOjU1Mjk2PD1kJiY1NjMxOT49ZD8oYis9NCxjKyspOmIrPTN9cmV0dXJuIGJ9O2Z1bmN0aW9uIGFkKGEpe3ZhciBiPXt9LGM9e30sZD17fSxlPVwiXCI7dHJ5e3ZhciBmPWEuc3BsaXQoXCIuXCIpLGI9bWIoSWMoZlswXSl8fFwiXCIpLGM9bWIoSWMoZlsxXSl8fFwiXCIpLGU9ZlsyXSxkPWMuZHx8e307ZGVsZXRlIGMuZH1jYXRjaChnKXt9cmV0dXJue1dnOmIsQWM6YyxkYXRhOmQsTmc6ZX19ZnVuY3Rpb24gYmQoYSl7YT1hZChhKS5BYztyZXR1cm5cIm9iamVjdFwiPT09dHlwZW9mIGEmJmEuaGFzT3duUHJvcGVydHkoXCJpYXRcIik/dyhhLFwiaWF0XCIpOm51bGx9ZnVuY3Rpb24gY2QoYSl7YT1hZChhKTt2YXIgYj1hLkFjO3JldHVybiEhYS5OZyYmISFiJiZcIm9iamVjdFwiPT09dHlwZW9mIGImJmIuaGFzT3duUHJvcGVydHkoXCJpYXRcIil9O2Z1bmN0aW9uIGRkKGEpe3RoaXMuVj1hO3RoaXMuZz1hLm4uZ31mdW5jdGlvbiBlZChhLGIsYyxkKXt2YXIgZT1bXSxmPVtdO09hKGIsZnVuY3Rpb24oYil7XCJjaGlsZF9jaGFuZ2VkXCI9PT1iLnR5cGUmJmEuZy54ZChiLkplLGIuSmEpJiZmLnB1c2gobmV3IEQoXCJjaGlsZF9tb3ZlZFwiLGIuSmEsYi5ZYSkpfSk7ZmQoYSxlLFwiY2hpbGRfcmVtb3ZlZFwiLGIsZCxjKTtmZChhLGUsXCJjaGlsZF9hZGRlZFwiLGIsZCxjKTtmZChhLGUsXCJjaGlsZF9tb3ZlZFwiLGYsZCxjKTtmZChhLGUsXCJjaGlsZF9jaGFuZ2VkXCIsYixkLGMpO2ZkKGEsZSxFYixiLGQsYyk7cmV0dXJuIGV9ZnVuY3Rpb24gZmQoYSxiLGMsZCxlLGYpe2Q9UGEoZCxmdW5jdGlvbihhKXtyZXR1cm4gYS50eXBlPT09Y30pO1hhKGQscShhLmVnLGEpKTtPYShkLGZ1bmN0aW9uKGMpe3ZhciBkPWdkKGEsYyxmKTtPYShlLGZ1bmN0aW9uKGUpe2UuSmYoYy50eXBlKSYmYi5wdXNoKGUuY3JlYXRlRXZlbnQoZCxhLlYpKX0pfSl9XG5mdW5jdGlvbiBnZChhLGIsYyl7XCJ2YWx1ZVwiIT09Yi50eXBlJiZcImNoaWxkX3JlbW92ZWRcIiE9PWIudHlwZSYmKGIuTmQ9Yy5xZihiLllhLGIuSmEsYS5nKSk7cmV0dXJuIGJ9ZGQucHJvdG90eXBlLmVnPWZ1bmN0aW9uKGEsYil7aWYobnVsbD09YS5ZYXx8bnVsbD09Yi5ZYSl0aHJvdyBIYyhcIlNob3VsZCBvbmx5IGNvbXBhcmUgY2hpbGRfIGV2ZW50cy5cIik7cmV0dXJuIHRoaXMuZy5jb21wYXJlKG5ldyBFKGEuWWEsYS5KYSksbmV3IEUoYi5ZYSxiLkphKSl9O2Z1bmN0aW9uIGhkKCl7dGhpcy5lYj17fX1cbmZ1bmN0aW9uIGlkKGEsYil7dmFyIGM9Yi50eXBlLGQ9Yi5ZYTtKKFwiY2hpbGRfYWRkZWRcIj09Y3x8XCJjaGlsZF9jaGFuZ2VkXCI9PWN8fFwiY2hpbGRfcmVtb3ZlZFwiPT1jLFwiT25seSBjaGlsZCBjaGFuZ2VzIHN1cHBvcnRlZCBmb3IgdHJhY2tpbmdcIik7SihcIi5wcmlvcml0eVwiIT09ZCxcIk9ubHkgbm9uLXByaW9yaXR5IGNoaWxkIGNoYW5nZXMgY2FuIGJlIHRyYWNrZWQuXCIpO3ZhciBlPXcoYS5lYixkKTtpZihlKXt2YXIgZj1lLnR5cGU7aWYoXCJjaGlsZF9hZGRlZFwiPT1jJiZcImNoaWxkX3JlbW92ZWRcIj09ZilhLmViW2RdPW5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGIuSmEsZCxlLkphKTtlbHNlIGlmKFwiY2hpbGRfcmVtb3ZlZFwiPT1jJiZcImNoaWxkX2FkZGVkXCI9PWYpZGVsZXRlIGEuZWJbZF07ZWxzZSBpZihcImNoaWxkX3JlbW92ZWRcIj09YyYmXCJjaGlsZF9jaGFuZ2VkXCI9PWYpYS5lYltkXT1uZXcgRChcImNoaWxkX3JlbW92ZWRcIixlLkplLGQpO2Vsc2UgaWYoXCJjaGlsZF9jaGFuZ2VkXCI9PWMmJlxuXCJjaGlsZF9hZGRlZFwiPT1mKWEuZWJbZF09bmV3IEQoXCJjaGlsZF9hZGRlZFwiLGIuSmEsZCk7ZWxzZSBpZihcImNoaWxkX2NoYW5nZWRcIj09YyYmXCJjaGlsZF9jaGFuZ2VkXCI9PWYpYS5lYltkXT1uZXcgRChcImNoaWxkX2NoYW5nZWRcIixiLkphLGQsZS5KZSk7ZWxzZSB0aHJvdyBIYyhcIklsbGVnYWwgY29tYmluYXRpb24gb2YgY2hhbmdlczogXCIrYitcIiBvY2N1cnJlZCBhZnRlciBcIitlKTt9ZWxzZSBhLmViW2RdPWJ9O2Z1bmN0aW9uIGpkKGEsYixjKXt0aGlzLlBiPWE7dGhpcy5xYj1iO3RoaXMuc2I9Y3x8bnVsbH1oPWpkLnByb3RvdHlwZTtoLkpmPWZ1bmN0aW9uKGEpe3JldHVyblwidmFsdWVcIj09PWF9O2guY3JlYXRlRXZlbnQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1iLm4uZztyZXR1cm4gbmV3IEZiKFwidmFsdWVcIix0aGlzLG5ldyBTKGEuSmEsYi5sYygpLGMpKX07aC5VYj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnNiO2lmKFwiY2FuY2VsXCI9PT1hLnllKCkpe0oodGhpcy5xYixcIlJhaXNpbmcgYSBjYW5jZWwgZXZlbnQgb24gYSBsaXN0ZW5lciB3aXRoIG5vIGNhbmNlbCBjYWxsYmFja1wiKTt2YXIgYz10aGlzLnFiO3JldHVybiBmdW5jdGlvbigpe2MuY2FsbChiLGEuZXJyb3IpfX12YXIgZD10aGlzLlBiO3JldHVybiBmdW5jdGlvbigpe2QuY2FsbChiLGEuV2QpfX07aC5mZj1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnFiP25ldyBHYih0aGlzLGEsYik6bnVsbH07XG5oLm1hdGNoZXM9ZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBqZD9hLlBiJiZ0aGlzLlBiP2EuUGI9PT10aGlzLlBiJiZhLnNiPT09dGhpcy5zYjohMDohMX07aC5zZj1mdW5jdGlvbigpe3JldHVybiBudWxsIT09dGhpcy5QYn07ZnVuY3Rpb24ga2QoYSxiLGMpe3RoaXMuZ2E9YTt0aGlzLnFiPWI7dGhpcy5zYj1jfWg9a2QucHJvdG90eXBlO2guSmY9ZnVuY3Rpb24oYSl7YT1cImNoaWxkcmVuX2FkZGVkXCI9PT1hP1wiY2hpbGRfYWRkZWRcIjphO3JldHVybihcImNoaWxkcmVuX3JlbW92ZWRcIj09PWE/XCJjaGlsZF9yZW1vdmVkXCI6YSlpbiB0aGlzLmdhfTtoLmZmPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMucWI/bmV3IEdiKHRoaXMsYSxiKTpudWxsfTtcbmguY3JlYXRlRXZlbnQ9ZnVuY3Rpb24oYSxiKXtKKG51bGwhPWEuWWEsXCJDaGlsZCBldmVudHMgc2hvdWxkIGhhdmUgYSBjaGlsZE5hbWUuXCIpO3ZhciBjPWIubGMoKS53KGEuWWEpO3JldHVybiBuZXcgRmIoYS50eXBlLHRoaXMsbmV3IFMoYS5KYSxjLGIubi5nKSxhLk5kKX07aC5VYj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnNiO2lmKFwiY2FuY2VsXCI9PT1hLnllKCkpe0oodGhpcy5xYixcIlJhaXNpbmcgYSBjYW5jZWwgZXZlbnQgb24gYSBsaXN0ZW5lciB3aXRoIG5vIGNhbmNlbCBjYWxsYmFja1wiKTt2YXIgYz10aGlzLnFiO3JldHVybiBmdW5jdGlvbigpe2MuY2FsbChiLGEuZXJyb3IpfX12YXIgZD10aGlzLmdhW2EucmRdO3JldHVybiBmdW5jdGlvbigpe2QuY2FsbChiLGEuV2QsYS5OZCl9fTtcbmgubWF0Y2hlcz1mdW5jdGlvbihhKXtpZihhIGluc3RhbmNlb2Yga2Qpe2lmKCF0aGlzLmdhfHwhYS5nYSlyZXR1cm4hMDtpZih0aGlzLnNiPT09YS5zYil7dmFyIGI9cGEoYS5nYSk7aWYoYj09PXBhKHRoaXMuZ2EpKXtpZigxPT09Yil7dmFyIGI9cWEoYS5nYSksYz1xYSh0aGlzLmdhKTtyZXR1cm4gYz09PWImJighYS5nYVtiXXx8IXRoaXMuZ2FbY118fGEuZ2FbYl09PT10aGlzLmdhW2NdKX1yZXR1cm4gb2EodGhpcy5nYSxmdW5jdGlvbihiLGMpe3JldHVybiBhLmdhW2NdPT09Yn0pfX19cmV0dXJuITF9O2guc2Y9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PXRoaXMuZ2F9O2Z1bmN0aW9uIGxkKGEpe3RoaXMuZz1hfWg9bGQucHJvdG90eXBlO2guRz1mdW5jdGlvbihhLGIsYyxkLGUpe0ooYS5JYyh0aGlzLmcpLFwiQSBub2RlIG11c3QgYmUgaW5kZXhlZCBpZiBvbmx5IGEgY2hpbGQgaXMgdXBkYXRlZFwiKTtkPWEuTShiKTtpZihkLlooYykpcmV0dXJuIGE7bnVsbCE9ZSYmKGMuZSgpP2EuSGEoYik/aWQoZSxuZXcgRChcImNoaWxkX3JlbW92ZWRcIixkLGIpKTpKKGEuTigpLFwiQSBjaGlsZCByZW1vdmUgd2l0aG91dCBhbiBvbGQgY2hpbGQgb25seSBtYWtlcyBzZW5zZSBvbiBhIGxlYWYgbm9kZVwiKTpkLmUoKT9pZChlLG5ldyBEKFwiY2hpbGRfYWRkZWRcIixjLGIpKTppZChlLG5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGMsYixkKSkpO3JldHVybiBhLk4oKSYmYy5lKCk/YTphLlEoYixjKS5tYih0aGlzLmcpfTtcbmgudGE9ZnVuY3Rpb24oYSxiLGMpe251bGwhPWMmJihhLk4oKXx8YS5VKE0sZnVuY3Rpb24oYSxlKXtiLkhhKGEpfHxpZChjLG5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLGUsYSkpfSksYi5OKCl8fGIuVShNLGZ1bmN0aW9uKGIsZSl7aWYoYS5IYShiKSl7dmFyIGY9YS5NKGIpO2YuWihlKXx8aWQoYyxuZXcgRChcImNoaWxkX2NoYW5nZWRcIixlLGIsZikpfWVsc2UgaWQoYyxuZXcgRChcImNoaWxkX2FkZGVkXCIsZSxiKSl9KSk7cmV0dXJuIGIubWIodGhpcy5nKX07aC5kYT1mdW5jdGlvbihhLGIpe3JldHVybiBhLmUoKT9DOmEuZGEoYil9O2guR2E9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5WYj1mdW5jdGlvbigpe3JldHVybiB0aGlzfTtmdW5jdGlvbiBtZChhKXt0aGlzLkFlPW5ldyBsZChhLmcpO3RoaXMuZz1hLmc7dmFyIGI7YS5sYT8oYj1uZChhKSxiPWEuZy5PYyhvZChhKSxiKSk6Yj1hLmcuU2MoKTt0aGlzLmRkPWI7YS5uYT8oYj1wZChhKSxhPWEuZy5PYyhxZChhKSxiKSk6YT1hLmcuUGMoKTt0aGlzLkZjPWF9aD1tZC5wcm90b3R5cGU7aC5tYXRjaGVzPWZ1bmN0aW9uKGEpe3JldHVybiAwPj10aGlzLmcuY29tcGFyZSh0aGlzLmRkLGEpJiYwPj10aGlzLmcuY29tcGFyZShhLHRoaXMuRmMpfTtoLkc9ZnVuY3Rpb24oYSxiLGMsZCxlKXt0aGlzLm1hdGNoZXMobmV3IEUoYixjKSl8fChjPUMpO3JldHVybiB0aGlzLkFlLkcoYSxiLGMsZCxlKX07aC50YT1mdW5jdGlvbihhLGIsYyl7Yi5OKCkmJihiPUMpO3ZhciBkPWIubWIodGhpcy5nKSxkPWQuZGEoQyksZT10aGlzO2IuVShNLGZ1bmN0aW9uKGEsYil7ZS5tYXRjaGVzKG5ldyBFKGEsYikpfHwoZD1kLlEoYSxDKSl9KTtyZXR1cm4gdGhpcy5BZS50YShhLGQsYyl9O1xuaC5kYT1mdW5jdGlvbihhKXtyZXR1cm4gYX07aC5HYT1mdW5jdGlvbigpe3JldHVybiEwfTtoLlZiPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuQWV9O2Z1bmN0aW9uIHJkKGEpe3RoaXMucmE9bmV3IG1kKGEpO3RoaXMuZz1hLmc7SihhLmlhLFwiT25seSB2YWxpZCBpZiBsaW1pdCBoYXMgYmVlbiBzZXRcIik7dGhpcy5qYT1hLmphO3RoaXMuSmI9IXNkKGEpfWg9cmQucHJvdG90eXBlO2guRz1mdW5jdGlvbihhLGIsYyxkLGUpe3RoaXMucmEubWF0Y2hlcyhuZXcgRShiLGMpKXx8KGM9Qyk7cmV0dXJuIGEuTShiKS5aKGMpP2E6YS5EYigpPHRoaXMuamE/dGhpcy5yYS5WYigpLkcoYSxiLGMsZCxlKTp0ZCh0aGlzLGEsYixjLGQsZSl9O1xuaC50YT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ7aWYoYi5OKCl8fGIuZSgpKWQ9Qy5tYih0aGlzLmcpO2Vsc2UgaWYoMip0aGlzLmphPGIuRGIoKSYmYi5JYyh0aGlzLmcpKXtkPUMubWIodGhpcy5nKTtiPXRoaXMuSmI/Yi5aYih0aGlzLnJhLkZjLHRoaXMuZyk6Yi5YYih0aGlzLnJhLmRkLHRoaXMuZyk7Zm9yKHZhciBlPTA7MDxiLlBhLmxlbmd0aCYmZTx0aGlzLmphOyl7dmFyIGY9SChiKSxnO2lmKGc9dGhpcy5KYj8wPj10aGlzLmcuY29tcGFyZSh0aGlzLnJhLmRkLGYpOjA+PXRoaXMuZy5jb21wYXJlKGYsdGhpcy5yYS5GYykpZD1kLlEoZi5uYW1lLGYuUyksZSsrO2Vsc2UgYnJlYWt9fWVsc2V7ZD1iLm1iKHRoaXMuZyk7ZD1kLmRhKEMpO3ZhciBrLGwsbTtpZih0aGlzLkpiKXtiPWQucmYodGhpcy5nKTtrPXRoaXMucmEuRmM7bD10aGlzLnJhLmRkO3ZhciB2PXVkKHRoaXMuZyk7bT1mdW5jdGlvbihhLGIpe3JldHVybiB2KGIsYSl9fWVsc2UgYj1kLldiKHRoaXMuZyksaz10aGlzLnJhLmRkLFxubD10aGlzLnJhLkZjLG09dWQodGhpcy5nKTtmb3IodmFyIGU9MCx5PSExOzA8Yi5QYS5sZW5ndGg7KWY9SChiKSwheSYmMD49bShrLGYpJiYoeT0hMCksKGc9eSYmZTx0aGlzLmphJiYwPj1tKGYsbCkpP2UrKzpkPWQuUShmLm5hbWUsQyl9cmV0dXJuIHRoaXMucmEuVmIoKS50YShhLGQsYyl9O2guZGE9ZnVuY3Rpb24oYSl7cmV0dXJuIGF9O2guR2E9ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC5WYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJhLlZiKCl9O1xuZnVuY3Rpb24gdGQoYSxiLGMsZCxlLGYpe3ZhciBnO2lmKGEuSmIpe3ZhciBrPXVkKGEuZyk7Zz1mdW5jdGlvbihhLGIpe3JldHVybiBrKGIsYSl9fWVsc2UgZz11ZChhLmcpO0ooYi5EYigpPT1hLmphLFwiXCIpO3ZhciBsPW5ldyBFKGMsZCksbT1hLkpiP3dkKGIsYS5nKTp4ZChiLGEuZyksdj1hLnJhLm1hdGNoZXMobCk7aWYoYi5IYShjKSl7dmFyIHk9Yi5NKGMpLG09ZS54ZShhLmcsbSxhLkpiKTtudWxsIT1tJiZtLm5hbWU9PWMmJihtPWUueGUoYS5nLG0sYS5KYikpO2U9bnVsbD09bT8xOmcobSxsKTtpZih2JiYhZC5lKCkmJjA8PWUpcmV0dXJuIG51bGwhPWYmJmlkKGYsbmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsZCxjLHkpKSxiLlEoYyxkKTtudWxsIT1mJiZpZChmLG5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLHksYykpO2I9Yi5RKGMsQyk7cmV0dXJuIG51bGwhPW0mJmEucmEubWF0Y2hlcyhtKT8obnVsbCE9ZiYmaWQoZixuZXcgRChcImNoaWxkX2FkZGVkXCIsbS5TLG0ubmFtZSkpLGIuUShtLm5hbWUsXG5tLlMpKTpifXJldHVybiBkLmUoKT9iOnYmJjA8PWcobSxsKT8obnVsbCE9ZiYmKGlkKGYsbmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIsbS5TLG0ubmFtZSkpLGlkKGYsbmV3IEQoXCJjaGlsZF9hZGRlZFwiLGQsYykpKSxiLlEoYyxkKS5RKG0ubmFtZSxDKSk6Yn07ZnVuY3Rpb24geWQoYSxiKXt0aGlzLmhlPWE7dGhpcy5jZz1ifWZ1bmN0aW9uIHpkKGEpe3RoaXMuST1hfVxuemQucHJvdG90eXBlLmJiPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPW5ldyBoZCxmO2lmKGIudHlwZT09PVZiKWIuc291cmNlLnZlP2M9QWQodGhpcyxhLGIucGF0aCxiLklhLGMsZCxlKTooSihiLnNvdXJjZS5vZixcIlVua25vd24gc291cmNlLlwiKSxmPWIuc291cmNlLmFmLGM9QmQodGhpcyxhLGIucGF0aCxiLklhLGMsZCxmLGUpKTtlbHNlIGlmKGIudHlwZT09PUNkKWIuc291cmNlLnZlP2M9RGQodGhpcyxhLGIucGF0aCxiLmNoaWxkcmVuLGMsZCxlKTooSihiLnNvdXJjZS5vZixcIlVua25vd24gc291cmNlLlwiKSxmPWIuc291cmNlLmFmLGM9RWQodGhpcyxhLGIucGF0aCxiLmNoaWxkcmVuLGMsZCxmLGUpKTtlbHNlIGlmKGIudHlwZT09PVhiKWlmKGIuVmUpaWYoZj1iLnBhdGgsbnVsbCE9Yy5zYyhmKSljPWE7ZWxzZXtiPW5ldyBxYihjLGEsZCk7ZD1hLkQuaigpO2lmKGYuZSgpfHxcIi5wcmlvcml0eVwiPT09TyhmKSlIYihhLnUoKSk/Yj1jLnVhKHRiKGEpKTooYj1hLnUoKS5qKCksXG5KKGIgaW5zdGFuY2VvZiBULFwic2VydmVyQ2hpbGRyZW4gd291bGQgYmUgY29tcGxldGUgaWYgbGVhZiBub2RlXCIpLGI9Yy54YyhiKSksYj10aGlzLkkudGEoZCxiLGUpO2Vsc2V7Zj1PKGYpO3ZhciBnPWMuWGEoZixhLnUoKSk7bnVsbD09ZyYmcmIoYS51KCksZikmJihnPWQuTShmKSk7Yj1udWxsIT1nP3RoaXMuSS5HKGQsZixnLGIsZSk6YS5ELmooKS5IYShmKT90aGlzLkkuRyhkLGYsQyxiLGUpOmQ7Yi5lKCkmJkhiKGEudSgpKSYmKGQ9Yy51YSh0YihhKSksZC5OKCkmJihiPXRoaXMuSS50YShiLGQsZSkpKX1kPUhiKGEudSgpKXx8bnVsbCE9Yy5zYyhGKTtjPUZkKGEsYixkLHRoaXMuSS5HYSgpKX1lbHNlIGM9R2QodGhpcyxhLGIucGF0aCxjLGQsZSk7ZWxzZSBpZihiLnR5cGU9PT0kYilkPWIucGF0aCxiPWEudSgpLGY9Yi5qKCksZz1iLiR8fGQuZSgpLGM9SGQodGhpcyxuZXcgSWQoYS5ELG5ldyBzYihmLGcsYi5UYikpLGQsYyxwYixlKTtlbHNlIHRocm93IEhjKFwiVW5rbm93biBvcGVyYXRpb24gdHlwZTogXCIrXG5iLnR5cGUpO2U9cmEoZS5lYik7ZD1jO2I9ZC5EO2IuJCYmKGY9Yi5qKCkuTigpfHxiLmooKS5lKCksZz1KZChhKSwoMDxlLmxlbmd0aHx8IWEuRC4kfHxmJiYhYi5qKCkuWihnKXx8IWIuaigpLkEoKS5aKGcuQSgpKSkmJmUucHVzaChEYihKZChkKSkpKTtyZXR1cm4gbmV3IHlkKGMsZSl9O1xuZnVuY3Rpb24gSGQoYSxiLGMsZCxlLGYpe3ZhciBnPWIuRDtpZihudWxsIT1kLnNjKGMpKXJldHVybiBiO3ZhciBrO2lmKGMuZSgpKUooSGIoYi51KCkpLFwiSWYgY2hhbmdlIHBhdGggaXMgZW1wdHksIHdlIG11c3QgaGF2ZSBjb21wbGV0ZSBzZXJ2ZXIgZGF0YVwiKSxiLnUoKS5UYj8oZT10YihiKSxkPWQueGMoZSBpbnN0YW5jZW9mIFQ/ZTpDKSk6ZD1kLnVhKHRiKGIpKSxmPWEuSS50YShiLkQuaigpLGQsZik7ZWxzZXt2YXIgbD1PKGMpO2lmKFwiLnByaW9yaXR5XCI9PWwpSigxPT11YyhjKSxcIkNhbid0IGhhdmUgYSBwcmlvcml0eSB3aXRoIGFkZGl0aW9uYWwgcGF0aCBjb21wb25lbnRzXCIpLGY9Zy5qKCksaz1iLnUoKS5qKCksZD1kLmhkKGMsZixrKSxmPW51bGwhPWQ/YS5JLmRhKGYsZCk6Zy5qKCk7ZWxzZXt2YXIgbT1HKGMpO3JiKGcsbCk/KGs9Yi51KCkuaigpLGQ9ZC5oZChjLGcuaigpLGspLGQ9bnVsbCE9ZD9nLmooKS5NKGwpLkcobSxkKTpnLmooKS5NKGwpKTpkPWQuWGEobCxiLnUoKSk7XG5mPW51bGwhPWQ/YS5JLkcoZy5qKCksbCxkLGUsZik6Zy5qKCl9fXJldHVybiBGZChiLGYsZy4kfHxjLmUoKSxhLkkuR2EoKSl9ZnVuY3Rpb24gQmQoYSxiLGMsZCxlLGYsZyxrKXt2YXIgbD1iLnUoKTtnPWc/YS5JOmEuSS5WYigpO2lmKGMuZSgpKWQ9Zy50YShsLmooKSxkLG51bGwpO2Vsc2UgaWYoZy5HYSgpJiYhbC5UYilkPWwuaigpLkcoYyxkKSxkPWcudGEobC5qKCksZCxudWxsKTtlbHNle3ZhciBtPU8oYyk7aWYoKGMuZSgpPyFsLiR8fGwuVGI6IXJiKGwsTyhjKSkpJiYxPHVjKGMpKXJldHVybiBiO2Q9bC5qKCkuTShtKS5HKEcoYyksZCk7ZD1cIi5wcmlvcml0eVwiPT1tP2cuZGEobC5qKCksZCk6Zy5HKGwuaigpLG0sZCxwYixudWxsKX1sPWwuJHx8Yy5lKCk7Yj1uZXcgSWQoYi5ELG5ldyBzYihkLGwsZy5HYSgpKSk7cmV0dXJuIEhkKGEsYixjLGUsbmV3IHFiKGUsYixmKSxrKX1cbmZ1bmN0aW9uIEFkKGEsYixjLGQsZSxmLGcpe3ZhciBrPWIuRDtlPW5ldyBxYihlLGIsZik7aWYoYy5lKCkpZz1hLkkudGEoYi5ELmooKSxkLGcpLGE9RmQoYixnLCEwLGEuSS5HYSgpKTtlbHNlIGlmKGY9TyhjKSxcIi5wcmlvcml0eVwiPT09ZilnPWEuSS5kYShiLkQuaigpLGQpLGE9RmQoYixnLGsuJCxrLlRiKTtlbHNle3ZhciBsPUcoYyk7Yz1rLmooKS5NKGYpO2lmKCFsLmUoKSl7dmFyIG09ZS5wZihmKTtkPW51bGwhPW0/XCIucHJpb3JpdHlcIj09PXZjKGwpJiZtLm9hKGwucGFyZW50KCkpLmUoKT9tOm0uRyhsLGQpOkN9Yy5aKGQpP2E9YjooZz1hLkkuRyhrLmooKSxmLGQsZSxnKSxhPUZkKGIsZyxrLiQsYS5JLkdhKCkpKX1yZXR1cm4gYX1cbmZ1bmN0aW9uIERkKGEsYixjLGQsZSxmLGcpe3ZhciBrPWI7S2QoZCxmdW5jdGlvbihkLG0pe3ZhciB2PWMudyhkKTtyYihiLkQsTyh2KSkmJihrPUFkKGEsayx2LG0sZSxmLGcpKX0pO0tkKGQsZnVuY3Rpb24oZCxtKXt2YXIgdj1jLncoZCk7cmIoYi5ELE8odikpfHwoaz1BZChhLGssdixtLGUsZixnKSl9KTtyZXR1cm4ga31mdW5jdGlvbiBMZChhLGIpe0tkKGIsZnVuY3Rpb24oYixkKXthPWEuRyhiLGQpfSk7cmV0dXJuIGF9XG5mdW5jdGlvbiBFZChhLGIsYyxkLGUsZixnLGspe2lmKGIudSgpLmooKS5lKCkmJiFIYihiLnUoKSkpcmV0dXJuIGI7dmFyIGw9YjtjPWMuZSgpP2Q6TWQoTmQsYyxkKTt2YXIgbT1iLnUoKS5qKCk7Yy5jaGlsZHJlbi5oYShmdW5jdGlvbihjLGQpe2lmKG0uSGEoYykpe3ZhciBJPWIudSgpLmooKS5NKGMpLEk9TGQoSSxkKTtsPUJkKGEsbCxuZXcgSyhjKSxJLGUsZixnLGspfX0pO2MuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYyxkKXt2YXIgST0hSGIoYi51KCkpJiZudWxsPT1kLnZhbHVlO20uSGEoYyl8fEl8fChJPWIudSgpLmooKS5NKGMpLEk9TGQoSSxkKSxsPUJkKGEsbCxuZXcgSyhjKSxJLGUsZixnLGspKX0pO3JldHVybiBsfVxuZnVuY3Rpb24gR2QoYSxiLGMsZCxlLGYpe2lmKG51bGwhPWQuc2MoYykpcmV0dXJuIGI7dmFyIGc9bmV3IHFiKGQsYixlKSxrPWU9Yi5ELmooKTtpZihIYihiLnUoKSkpe2lmKGMuZSgpKWU9ZC51YSh0YihiKSksaz1hLkkudGEoYi5ELmooKSxlLGYpO2Vsc2UgaWYoXCIucHJpb3JpdHlcIj09PU8oYykpe3ZhciBsPWQuWGEoTyhjKSxiLnUoKSk7bnVsbD09bHx8ZS5lKCl8fGUuQSgpLloobCl8fChrPWEuSS5kYShlLGwpKX1lbHNlIGw9TyhjKSxlPWQuWGEobCxiLnUoKSksbnVsbCE9ZSYmKGs9YS5JLkcoYi5ELmooKSxsLGUsZyxmKSk7ZT0hMH1lbHNlIGlmKGIuRC4kfHxjLmUoKSlrPWUsZT1iLkQuaigpLGUuTigpfHxlLlUoTSxmdW5jdGlvbihjKXt2YXIgZT1kLlhhKGMsYi51KCkpO251bGwhPWUmJihrPWEuSS5HKGssYyxlLGcsZikpfSksZT1iLkQuJDtlbHNle2w9TyhjKTtpZigxPT11YyhjKXx8cmIoYi5ELGwpKWM9ZC5YYShsLGIudSgpKSxudWxsIT1jJiYoaz1hLkkuRyhlLGwsYyxcbmcsZikpO2U9ITF9cmV0dXJuIEZkKGIsayxlLGEuSS5HYSgpKX07ZnVuY3Rpb24gT2QoKXt9dmFyIFBkPXt9O2Z1bmN0aW9uIHVkKGEpe3JldHVybiBxKGEuY29tcGFyZSxhKX1PZC5wcm90b3R5cGUueGQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gMCE9PXRoaXMuY29tcGFyZShuZXcgRShcIltNSU5fTkFNRV1cIixhKSxuZXcgRShcIltNSU5fTkFNRV1cIixiKSl9O09kLnByb3RvdHlwZS5TYz1mdW5jdGlvbigpe3JldHVybiBRZH07ZnVuY3Rpb24gUmQoYSl7dGhpcy5iYz1hfW1hKFJkLE9kKTtoPVJkLnByb3RvdHlwZTtoLkhjPWZ1bmN0aW9uKGEpe3JldHVybiFhLk0odGhpcy5iYykuZSgpfTtoLmNvbXBhcmU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLlMuTSh0aGlzLmJjKSxkPWIuUy5NKHRoaXMuYmMpLGM9Yy5DYyhkKTtyZXR1cm4gMD09PWM/U2IoYS5uYW1lLGIubmFtZSk6Y307aC5PYz1mdW5jdGlvbihhLGIpe3ZhciBjPUwoYSksYz1DLlEodGhpcy5iYyxjKTtyZXR1cm4gbmV3IEUoYixjKX07XG5oLlBjPWZ1bmN0aW9uKCl7dmFyIGE9Qy5RKHRoaXMuYmMsU2QpO3JldHVybiBuZXcgRShcIltNQVhfTkFNRV1cIixhKX07aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJjfTtmdW5jdGlvbiBUZCgpe31tYShUZCxPZCk7aD1UZC5wcm90b3R5cGU7aC5jb21wYXJlPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5TLkEoKSxkPWIuUy5BKCksYz1jLkNjKGQpO3JldHVybiAwPT09Yz9TYihhLm5hbWUsYi5uYW1lKTpjfTtoLkhjPWZ1bmN0aW9uKGEpe3JldHVybiFhLkEoKS5lKCl9O2gueGQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4hYS5BKCkuWihiLkEoKSl9O2guU2M9ZnVuY3Rpb24oKXtyZXR1cm4gUWR9O2guUGM9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEUoXCJbTUFYX05BTUVdXCIsbmV3IHRjKFwiW1BSSU9SSVRZLVBPU1RdXCIsU2QpKX07aC5PYz1mdW5jdGlvbihhLGIpe3ZhciBjPUwoYSk7cmV0dXJuIG5ldyBFKGIsbmV3IHRjKFwiW1BSSU9SSVRZLVBPU1RdXCIsYykpfTtcbmgudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIi5wcmlvcml0eVwifTt2YXIgTT1uZXcgVGQ7ZnVuY3Rpb24gVWQoKXt9bWEoVWQsT2QpO2g9VWQucHJvdG90eXBlO2guY29tcGFyZT1mdW5jdGlvbihhLGIpe3JldHVybiBTYihhLm5hbWUsYi5uYW1lKX07aC5IYz1mdW5jdGlvbigpe3Rocm93IEhjKFwiS2V5SW5kZXguaXNEZWZpbmVkT24gbm90IGV4cGVjdGVkIHRvIGJlIGNhbGxlZC5cIik7fTtoLnhkPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guU2M9ZnVuY3Rpb24oKXtyZXR1cm4gUWR9O2guUGM9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEUoXCJbTUFYX05BTUVdXCIsQyl9O2guT2M9ZnVuY3Rpb24oYSl7SihwKGEpLFwiS2V5SW5kZXggaW5kZXhWYWx1ZSBtdXN0IGFsd2F5cyBiZSBhIHN0cmluZy5cIik7cmV0dXJuIG5ldyBFKGEsQyl9O2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIi5rZXlcIn07dmFyIFZkPW5ldyBVZDtmdW5jdGlvbiBXZCgpe31tYShXZCxPZCk7aD1XZC5wcm90b3R5cGU7XG5oLmNvbXBhcmU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLlMuQ2MoYi5TKTtyZXR1cm4gMD09PWM/U2IoYS5uYW1lLGIubmFtZSk6Y307aC5IYz1mdW5jdGlvbigpe3JldHVybiEwfTtoLnhkPWZ1bmN0aW9uKGEsYil7cmV0dXJuIWEuWihiKX07aC5TYz1mdW5jdGlvbigpe3JldHVybiBRZH07aC5QYz1mdW5jdGlvbigpe3JldHVybiBYZH07aC5PYz1mdW5jdGlvbihhLGIpe3ZhciBjPUwoYSk7cmV0dXJuIG5ldyBFKGIsYyl9O2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIi52YWx1ZVwifTt2YXIgWWQ9bmV3IFdkO2Z1bmN0aW9uIFpkKCl7dGhpcy5SYj10aGlzLm5hPXRoaXMuTGI9dGhpcy5sYT10aGlzLmlhPSExO3RoaXMuamE9MDt0aGlzLk5iPVwiXCI7dGhpcy5kYz1udWxsO3RoaXMueGI9XCJcIjt0aGlzLmFjPW51bGw7dGhpcy52Yj1cIlwiO3RoaXMuZz1NfXZhciAkZD1uZXcgWmQ7ZnVuY3Rpb24gc2QoYSl7cmV0dXJuXCJcIj09PWEuTmI/YS5sYTpcImxcIj09PWEuTmJ9ZnVuY3Rpb24gb2QoYSl7SihhLmxhLFwiT25seSB2YWxpZCBpZiBzdGFydCBoYXMgYmVlbiBzZXRcIik7cmV0dXJuIGEuZGN9ZnVuY3Rpb24gbmQoYSl7SihhLmxhLFwiT25seSB2YWxpZCBpZiBzdGFydCBoYXMgYmVlbiBzZXRcIik7cmV0dXJuIGEuTGI/YS54YjpcIltNSU5fTkFNRV1cIn1mdW5jdGlvbiBxZChhKXtKKGEubmEsXCJPbmx5IHZhbGlkIGlmIGVuZCBoYXMgYmVlbiBzZXRcIik7cmV0dXJuIGEuYWN9XG5mdW5jdGlvbiBwZChhKXtKKGEubmEsXCJPbmx5IHZhbGlkIGlmIGVuZCBoYXMgYmVlbiBzZXRcIik7cmV0dXJuIGEuUmI/YS52YjpcIltNQVhfTkFNRV1cIn1mdW5jdGlvbiBhZShhKXt2YXIgYj1uZXcgWmQ7Yi5pYT1hLmlhO2IuamE9YS5qYTtiLmxhPWEubGE7Yi5kYz1hLmRjO2IuTGI9YS5MYjtiLnhiPWEueGI7Yi5uYT1hLm5hO2IuYWM9YS5hYztiLlJiPWEuUmI7Yi52Yj1hLnZiO2IuZz1hLmc7cmV0dXJuIGJ9aD1aZC5wcm90b3R5cGU7aC5HZT1mdW5jdGlvbihhKXt2YXIgYj1hZSh0aGlzKTtiLmlhPSEwO2IuamE9YTtiLk5iPVwiXCI7cmV0dXJuIGJ9O2guSGU9ZnVuY3Rpb24oYSl7dmFyIGI9YWUodGhpcyk7Yi5pYT0hMDtiLmphPWE7Yi5OYj1cImxcIjtyZXR1cm4gYn07aC5JZT1mdW5jdGlvbihhKXt2YXIgYj1hZSh0aGlzKTtiLmlhPSEwO2IuamE9YTtiLk5iPVwiclwiO3JldHVybiBifTtcbmguWGQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hZSh0aGlzKTtjLmxhPSEwO24oYSl8fChhPW51bGwpO2MuZGM9YTtudWxsIT1iPyhjLkxiPSEwLGMueGI9Yik6KGMuTGI9ITEsYy54Yj1cIlwiKTtyZXR1cm4gY307aC5xZD1mdW5jdGlvbihhLGIpe3ZhciBjPWFlKHRoaXMpO2MubmE9ITA7bihhKXx8KGE9bnVsbCk7Yy5hYz1hO24oYik/KGMuUmI9ITAsYy52Yj1iKTooYy5ZZz0hMSxjLnZiPVwiXCIpO3JldHVybiBjfTtmdW5jdGlvbiBiZShhLGIpe3ZhciBjPWFlKGEpO2MuZz1iO3JldHVybiBjfWZ1bmN0aW9uIGNlKGEpe3ZhciBiPXt9O2EubGEmJihiLnNwPWEuZGMsYS5MYiYmKGIuc249YS54YikpO2EubmEmJihiLmVwPWEuYWMsYS5SYiYmKGIuZW49YS52YikpO2lmKGEuaWEpe2IubD1hLmphO3ZhciBjPWEuTmI7XCJcIj09PWMmJihjPXNkKGEpP1wibFwiOlwiclwiKTtiLnZmPWN9YS5nIT09TSYmKGIuaT1hLmcudG9TdHJpbmcoKSk7cmV0dXJuIGJ9XG5mdW5jdGlvbiBkZShhKXtyZXR1cm4hKGEubGF8fGEubmF8fGEuaWEpfWZ1bmN0aW9uIGVlKGEpe3ZhciBiPXt9O2lmKGRlKGEpJiZhLmc9PU0pcmV0dXJuIGI7dmFyIGM7YS5nPT09TT9jPVwiJHByaW9yaXR5XCI6YS5nPT09WWQ/Yz1cIiR2YWx1ZVwiOihKKGEuZyBpbnN0YW5jZW9mIFJkLFwiVW5yZWNvZ25pemVkIGluZGV4IHR5cGUhXCIpLGM9YS5nLnRvU3RyaW5nKCkpO2Iub3JkZXJCeT1CKGMpO2EubGEmJihiLnN0YXJ0QXQ9QihhLmRjKSxhLkxiJiYoYi5zdGFydEF0Kz1cIixcIitCKGEueGIpKSk7YS5uYSYmKGIuZW5kQXQ9QihhLmFjKSxhLlJiJiYoYi5lbmRBdCs9XCIsXCIrQihhLnZiKSkpO2EuaWEmJihzZChhKT9iLmxpbWl0VG9GaXJzdD1hLmphOmIubGltaXRUb0xhc3Q9YS5qYSk7cmV0dXJuIGJ9aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBCKGNlKHRoaXMpKX07ZnVuY3Rpb24gZmUoYSxiKXt0aGlzLnlkPWE7dGhpcy5jYz1ifWZlLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oYSl7dmFyIGI9dyh0aGlzLnlkLGEpO2lmKCFiKXRocm93IEVycm9yKFwiTm8gaW5kZXggZGVmaW5lZCBmb3IgXCIrYSk7cmV0dXJuIGI9PT1QZD9udWxsOmJ9O2Z1bmN0aW9uIGdlKGEsYixjKXt2YXIgZD1uYShhLnlkLGZ1bmN0aW9uKGQsZil7dmFyIGc9dyhhLmNjLGYpO0ooZyxcIk1pc3NpbmcgaW5kZXggaW1wbGVtZW50YXRpb24gZm9yIFwiK2YpO2lmKGQ9PT1QZCl7aWYoZy5IYyhiLlMpKXtmb3IodmFyIGs9W10sbD1jLldiKFFiKSxtPUgobCk7bTspbS5uYW1lIT1iLm5hbWUmJmsucHVzaChtKSxtPUgobCk7ay5wdXNoKGIpO3JldHVybiBoZShrLHVkKGcpKX1yZXR1cm4gUGR9Zz1jLmdldChiLm5hbWUpO2s9ZDtnJiYoaz1rLnJlbW92ZShuZXcgRShiLm5hbWUsZykpKTtyZXR1cm4gay5OYShiLGIuUyl9KTtyZXR1cm4gbmV3IGZlKGQsYS5jYyl9XG5mdW5jdGlvbiBpZShhLGIsYyl7dmFyIGQ9bmEoYS55ZCxmdW5jdGlvbihhKXtpZihhPT09UGQpcmV0dXJuIGE7dmFyIGQ9Yy5nZXQoYi5uYW1lKTtyZXR1cm4gZD9hLnJlbW92ZShuZXcgRShiLm5hbWUsZCkpOmF9KTtyZXR1cm4gbmV3IGZlKGQsYS5jYyl9dmFyIGplPW5ldyBmZSh7XCIucHJpb3JpdHlcIjpQZH0se1wiLnByaW9yaXR5XCI6TX0pO2Z1bmN0aW9uIHRjKGEsYil7dGhpcy5DPWE7SihuKHRoaXMuQykmJm51bGwhPT10aGlzLkMsXCJMZWFmTm9kZSBzaG91bGRuJ3QgYmUgY3JlYXRlZCB3aXRoIG51bGwvdW5kZWZpbmVkIHZhbHVlLlwiKTt0aGlzLmJhPWJ8fEM7a2UodGhpcy5iYSk7dGhpcy5CYj1udWxsfWg9dGMucHJvdG90eXBlO2guTj1mdW5jdGlvbigpe3JldHVybiEwfTtoLkE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iYX07aC5kYT1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IHRjKHRoaXMuQyxhKX07aC5NPWZ1bmN0aW9uKGEpe3JldHVyblwiLnByaW9yaXR5XCI9PT1hP3RoaXMuYmE6Q307aC5vYT1mdW5jdGlvbihhKXtyZXR1cm4gYS5lKCk/dGhpczpcIi5wcmlvcml0eVwiPT09TyhhKT90aGlzLmJhOkN9O2guSGE9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5xZj1mdW5jdGlvbigpe3JldHVybiBudWxsfTtcbmguUT1mdW5jdGlvbihhLGIpe3JldHVyblwiLnByaW9yaXR5XCI9PT1hP3RoaXMuZGEoYik6Yi5lKCkmJlwiLnByaW9yaXR5XCIhPT1hP3RoaXM6Qy5RKGEsYikuZGEodGhpcy5iYSl9O2guRz1mdW5jdGlvbihhLGIpe3ZhciBjPU8oYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7aWYoYi5lKCkmJlwiLnByaW9yaXR5XCIhPT1jKXJldHVybiB0aGlzO0ooXCIucHJpb3JpdHlcIiE9PWN8fDE9PT11YyhhKSxcIi5wcmlvcml0eSBtdXN0IGJlIHRoZSBsYXN0IHRva2VuIGluIGEgcGF0aFwiKTtyZXR1cm4gdGhpcy5RKGMsQy5HKEcoYSksYikpfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5EYj1mdW5jdGlvbigpe3JldHVybiAwfTtoLks9ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJiF0aGlzLkEoKS5lKCk/e1wiLnZhbHVlXCI6dGhpcy5CYSgpLFwiLnByaW9yaXR5XCI6dGhpcy5BKCkuSygpfTp0aGlzLkJhKCl9O1xuaC5oYXNoPWZ1bmN0aW9uKCl7aWYobnVsbD09PXRoaXMuQmIpe3ZhciBhPVwiXCI7dGhpcy5iYS5lKCl8fChhKz1cInByaW9yaXR5OlwiK2xlKHRoaXMuYmEuSygpKStcIjpcIik7dmFyIGI9dHlwZW9mIHRoaXMuQyxhPWErKGIrXCI6XCIpLGE9XCJudW1iZXJcIj09PWI/YStaYyh0aGlzLkMpOmErdGhpcy5DO3RoaXMuQmI9SmMoYSl9cmV0dXJuIHRoaXMuQmJ9O2guQmE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5DfTtoLkNjPWZ1bmN0aW9uKGEpe2lmKGE9PT1DKXJldHVybiAxO2lmKGEgaW5zdGFuY2VvZiBUKXJldHVybi0xO0ooYS5OKCksXCJVbmtub3duIG5vZGUgdHlwZVwiKTt2YXIgYj10eXBlb2YgYS5DLGM9dHlwZW9mIHRoaXMuQyxkPU5hKG1lLGIpLGU9TmEobWUsYyk7SigwPD1kLFwiVW5rbm93biBsZWFmIHR5cGU6IFwiK2IpO0ooMDw9ZSxcIlVua25vd24gbGVhZiB0eXBlOiBcIitjKTtyZXR1cm4gZD09PWU/XCJvYmplY3RcIj09PWM/MDp0aGlzLkM8YS5DPy0xOnRoaXMuQz09PWEuQz8wOjE6ZS1kfTtcbnZhciBtZT1bXCJvYmplY3RcIixcImJvb2xlYW5cIixcIm51bWJlclwiLFwic3RyaW5nXCJdO3RjLnByb3RvdHlwZS5tYj1mdW5jdGlvbigpe3JldHVybiB0aGlzfTt0Yy5wcm90b3R5cGUuSWM9ZnVuY3Rpb24oKXtyZXR1cm4hMH07dGMucHJvdG90eXBlLlo9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT10aGlzPyEwOmEuTigpP3RoaXMuQz09PWEuQyYmdGhpcy5iYS5aKGEuYmEpOiExfTt0Yy5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gQih0aGlzLksoITApKX07ZnVuY3Rpb24gVChhLGIsYyl7dGhpcy5tPWE7KHRoaXMuYmE9YikmJmtlKHRoaXMuYmEpO2EuZSgpJiZKKCF0aGlzLmJhfHx0aGlzLmJhLmUoKSxcIkFuIGVtcHR5IG5vZGUgY2Fubm90IGhhdmUgYSBwcmlvcml0eVwiKTt0aGlzLndiPWM7dGhpcy5CYj1udWxsfWg9VC5wcm90b3R5cGU7aC5OPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guQT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJhfHxDfTtoLmRhPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLm0uZSgpP3RoaXM6bmV3IFQodGhpcy5tLGEsdGhpcy53Yil9O2guTT1mdW5jdGlvbihhKXtpZihcIi5wcmlvcml0eVwiPT09YSlyZXR1cm4gdGhpcy5BKCk7YT10aGlzLm0uZ2V0KGEpO3JldHVybiBudWxsPT09YT9DOmF9O2gub2E9ZnVuY3Rpb24oYSl7dmFyIGI9TyhhKTtyZXR1cm4gbnVsbD09PWI/dGhpczp0aGlzLk0oYikub2EoRyhhKSl9O2guSGE9ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGwhPT10aGlzLm0uZ2V0KGEpfTtcbmguUT1mdW5jdGlvbihhLGIpe0ooYixcIldlIHNob3VsZCBhbHdheXMgYmUgcGFzc2luZyBzbmFwc2hvdCBub2Rlc1wiKTtpZihcIi5wcmlvcml0eVwiPT09YSlyZXR1cm4gdGhpcy5kYShiKTt2YXIgYz1uZXcgRShhLGIpLGQsZTtiLmUoKT8oZD10aGlzLm0ucmVtb3ZlKGEpLGM9aWUodGhpcy53YixjLHRoaXMubSkpOihkPXRoaXMubS5OYShhLGIpLGM9Z2UodGhpcy53YixjLHRoaXMubSkpO2U9ZC5lKCk/Qzp0aGlzLmJhO3JldHVybiBuZXcgVChkLGUsYyl9O2guRz1mdW5jdGlvbihhLGIpe3ZhciBjPU8oYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7SihcIi5wcmlvcml0eVwiIT09TyhhKXx8MT09PXVjKGEpLFwiLnByaW9yaXR5IG11c3QgYmUgdGhlIGxhc3QgdG9rZW4gaW4gYSBwYXRoXCIpO3ZhciBkPXRoaXMuTShjKS5HKEcoYSksYik7cmV0dXJuIHRoaXMuUShjLGQpfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tLmUoKX07aC5EYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLm0uY291bnQoKX07XG52YXIgbmU9L14oMHxbMS05XVxcZCopJC87aD1ULnByb3RvdHlwZTtoLks9ZnVuY3Rpb24oYSl7aWYodGhpcy5lKCkpcmV0dXJuIG51bGw7dmFyIGI9e30sYz0wLGQ9MCxlPSEwO3RoaXMuVShNLGZ1bmN0aW9uKGYsZyl7YltmXT1nLksoYSk7YysrO2UmJm5lLnRlc3QoZik/ZD1NYXRoLm1heChkLE51bWJlcihmKSk6ZT0hMX0pO2lmKCFhJiZlJiZkPDIqYyl7dmFyIGY9W10sZztmb3IoZyBpbiBiKWZbZ109YltnXTtyZXR1cm4gZn1hJiYhdGhpcy5BKCkuZSgpJiYoYltcIi5wcmlvcml0eVwiXT10aGlzLkEoKS5LKCkpO3JldHVybiBifTtoLmhhc2g9ZnVuY3Rpb24oKXtpZihudWxsPT09dGhpcy5CYil7dmFyIGE9XCJcIjt0aGlzLkEoKS5lKCl8fChhKz1cInByaW9yaXR5OlwiK2xlKHRoaXMuQSgpLksoKSkrXCI6XCIpO3RoaXMuVShNLGZ1bmN0aW9uKGIsYyl7dmFyIGQ9Yy5oYXNoKCk7XCJcIiE9PWQmJihhKz1cIjpcIitiK1wiOlwiK2QpfSk7dGhpcy5CYj1cIlwiPT09YT9cIlwiOkpjKGEpfXJldHVybiB0aGlzLkJifTtcbmgucWY9ZnVuY3Rpb24oYSxiLGMpe3JldHVybihjPW9lKHRoaXMsYykpPyhhPWNjKGMsbmV3IEUoYSxiKSkpP2EubmFtZTpudWxsOmNjKHRoaXMubSxhKX07ZnVuY3Rpb24gd2QoYSxiKXt2YXIgYztjPShjPW9lKGEsYikpPyhjPWMuUmMoKSkmJmMubmFtZTphLm0uUmMoKTtyZXR1cm4gYz9uZXcgRShjLGEubS5nZXQoYykpOm51bGx9ZnVuY3Rpb24geGQoYSxiKXt2YXIgYztjPShjPW9lKGEsYikpPyhjPWMuZWMoKSkmJmMubmFtZTphLm0uZWMoKTtyZXR1cm4gYz9uZXcgRShjLGEubS5nZXQoYykpOm51bGx9aC5VPWZ1bmN0aW9uKGEsYil7dmFyIGM9b2UodGhpcyxhKTtyZXR1cm4gYz9jLmhhKGZ1bmN0aW9uKGEpe3JldHVybiBiKGEubmFtZSxhLlMpfSk6dGhpcy5tLmhhKGIpfTtoLldiPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlhiKGEuU2MoKSxhKX07XG5oLlhiPWZ1bmN0aW9uKGEsYil7dmFyIGM9b2UodGhpcyxiKTtpZihjKXJldHVybiBjLlhiKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGF9KTtmb3IodmFyIGM9dGhpcy5tLlhiKGEubmFtZSxRYiksZD1lYyhjKTtudWxsIT1kJiYwPmIuY29tcGFyZShkLGEpOylIKGMpLGQ9ZWMoYyk7cmV0dXJuIGN9O2gucmY9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuWmIoYS5QYygpLGEpfTtoLlpiPWZ1bmN0aW9uKGEsYil7dmFyIGM9b2UodGhpcyxiKTtpZihjKXJldHVybiBjLlpiKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGF9KTtmb3IodmFyIGM9dGhpcy5tLlpiKGEubmFtZSxRYiksZD1lYyhjKTtudWxsIT1kJiYwPGIuY29tcGFyZShkLGEpOylIKGMpLGQ9ZWMoYyk7cmV0dXJuIGN9O2guQ2M9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZSgpP2EuZSgpPzA6LTE6YS5OKCl8fGEuZSgpPzE6YT09PVNkPy0xOjB9O1xuaC5tYj1mdW5jdGlvbihhKXtpZihhPT09VmR8fHRhKHRoaXMud2IuY2MsYS50b1N0cmluZygpKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLndiLGM9dGhpcy5tO0ooYSE9PVZkLFwiS2V5SW5kZXggYWx3YXlzIGV4aXN0cyBhbmQgaXNuJ3QgbWVhbnQgdG8gYmUgYWRkZWQgdG8gdGhlIEluZGV4TWFwLlwiKTtmb3IodmFyIGQ9W10sZT0hMSxjPWMuV2IoUWIpLGY9SChjKTtmOyllPWV8fGEuSGMoZi5TKSxkLnB1c2goZiksZj1IKGMpO2Q9ZT9oZShkLHVkKGEpKTpQZDtlPWEudG9TdHJpbmcoKTtjPXhhKGIuY2MpO2NbZV09YTthPXhhKGIueWQpO2FbZV09ZDtyZXR1cm4gbmV3IFQodGhpcy5tLHRoaXMuYmEsbmV3IGZlKGEsYykpfTtoLkljPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09VmR8fHRhKHRoaXMud2IuY2MsYS50b1N0cmluZygpKX07XG5oLlo9ZnVuY3Rpb24oYSl7aWYoYT09PXRoaXMpcmV0dXJuITA7aWYoYS5OKCkpcmV0dXJuITE7aWYodGhpcy5BKCkuWihhLkEoKSkmJnRoaXMubS5jb3VudCgpPT09YS5tLmNvdW50KCkpe3ZhciBiPXRoaXMuV2IoTSk7YT1hLldiKE0pO2Zvcih2YXIgYz1IKGIpLGQ9SChhKTtjJiZkOyl7aWYoYy5uYW1lIT09ZC5uYW1lfHwhYy5TLlooZC5TKSlyZXR1cm4hMTtjPUgoYik7ZD1IKGEpfXJldHVybiBudWxsPT09YyYmbnVsbD09PWR9cmV0dXJuITF9O2Z1bmN0aW9uIG9lKGEsYil7cmV0dXJuIGI9PT1WZD9udWxsOmEud2IuZ2V0KGIudG9TdHJpbmcoKSl9aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBCKHRoaXMuSyghMCkpfTtmdW5jdGlvbiBMKGEsYil7aWYobnVsbD09PWEpcmV0dXJuIEM7dmFyIGM9bnVsbDtcIm9iamVjdFwiPT09dHlwZW9mIGEmJlwiLnByaW9yaXR5XCJpbiBhP2M9YVtcIi5wcmlvcml0eVwiXTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGImJihjPWIpO0oobnVsbD09PWN8fFwic3RyaW5nXCI9PT10eXBlb2YgY3x8XCJudW1iZXJcIj09PXR5cGVvZiBjfHxcIm9iamVjdFwiPT09dHlwZW9mIGMmJlwiLnN2XCJpbiBjLFwiSW52YWxpZCBwcmlvcml0eSB0eXBlIGZvdW5kOiBcIit0eXBlb2YgYyk7XCJvYmplY3RcIj09PXR5cGVvZiBhJiZcIi52YWx1ZVwiaW4gYSYmbnVsbCE9PWFbXCIudmFsdWVcIl0mJihhPWFbXCIudmFsdWVcIl0pO2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYXx8XCIuc3ZcImluIGEpcmV0dXJuIG5ldyB0YyhhLEwoYykpO2lmKGEgaW5zdGFuY2VvZiBBcnJheSl7dmFyIGQ9QyxlPWE7cihlLGZ1bmN0aW9uKGEsYil7aWYodShlLGIpJiZcIi5cIiE9PWIuc3Vic3RyaW5nKDAsMSkpe3ZhciBjPUwoYSk7aWYoYy5OKCl8fCFjLmUoKSlkPVxuZC5RKGIsYyl9fSk7cmV0dXJuIGQuZGEoTChjKSl9dmFyIGY9W10sZz0hMSxrPWE7aGIoayxmdW5jdGlvbihhKXtpZihcInN0cmluZ1wiIT09dHlwZW9mIGF8fFwiLlwiIT09YS5zdWJzdHJpbmcoMCwxKSl7dmFyIGI9TChrW2FdKTtiLmUoKXx8KGc9Z3x8IWIuQSgpLmUoKSxmLnB1c2gobmV3IEUoYSxiKSkpfX0pO2lmKDA9PWYubGVuZ3RoKXJldHVybiBDO3ZhciBsPWhlKGYsUmIsZnVuY3Rpb24oYSl7cmV0dXJuIGEubmFtZX0sVGIpO2lmKGcpe3ZhciBtPWhlKGYsdWQoTSkpO3JldHVybiBuZXcgVChsLEwoYyksbmV3IGZlKHtcIi5wcmlvcml0eVwiOm19LHtcIi5wcmlvcml0eVwiOk19KSl9cmV0dXJuIG5ldyBUKGwsTChjKSxqZSl9dmFyIHBlPU1hdGgubG9nKDIpO1xuZnVuY3Rpb24gcWUoYSl7dGhpcy5jb3VudD1wYXJzZUludChNYXRoLmxvZyhhKzEpL3BlLDEwKTt0aGlzLmhmPXRoaXMuY291bnQtMTt0aGlzLmJnPWErMSZwYXJzZUludChBcnJheSh0aGlzLmNvdW50KzEpLmpvaW4oXCIxXCIpLDIpfWZ1bmN0aW9uIHJlKGEpe3ZhciBiPSEoYS5iZyYxPDxhLmhmKTthLmhmLS07cmV0dXJuIGJ9XG5mdW5jdGlvbiBoZShhLGIsYyxkKXtmdW5jdGlvbiBlKGIsZCl7dmFyIGY9ZC1iO2lmKDA9PWYpcmV0dXJuIG51bGw7aWYoMT09Zil7dmFyIG09YVtiXSx2PWM/YyhtKTptO3JldHVybiBuZXcgZmModixtLlMsITEsbnVsbCxudWxsKX12YXIgbT1wYXJzZUludChmLzIsMTApK2IsZj1lKGIsbSkseT1lKG0rMSxkKSxtPWFbbV0sdj1jP2MobSk6bTtyZXR1cm4gbmV3IGZjKHYsbS5TLCExLGYseSl9YS5zb3J0KGIpO3ZhciBmPWZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoYixnKXt2YXIgaz12LWIseT12O3YtPWI7dmFyIHk9ZShrKzEseSksaz1hW2tdLEk9Yz9jKGspOmsseT1uZXcgZmMoSSxrLlMsZyxudWxsLHkpO2Y/Zi5sZWZ0PXk6bT15O2Y9eX1mb3IodmFyIGY9bnVsbCxtPW51bGwsdj1hLmxlbmd0aCx5PTA7eTxiLmNvdW50OysreSl7dmFyIEk9cmUoYiksdmQ9TWF0aC5wb3coMixiLmNvdW50LSh5KzEpKTtJP2QodmQsITEpOihkKHZkLCExKSxkKHZkLCEwKSl9cmV0dXJuIG19KG5ldyBxZShhLmxlbmd0aCkpO1xucmV0dXJuIG51bGwhPT1mP25ldyBhYyhkfHxiLGYpOm5ldyBhYyhkfHxiKX1mdW5jdGlvbiBsZShhKXtyZXR1cm5cIm51bWJlclwiPT09dHlwZW9mIGE/XCJudW1iZXI6XCIrWmMoYSk6XCJzdHJpbmc6XCIrYX1mdW5jdGlvbiBrZShhKXtpZihhLk4oKSl7dmFyIGI9YS5LKCk7SihcInN0cmluZ1wiPT09dHlwZW9mIGJ8fFwibnVtYmVyXCI9PT10eXBlb2YgYnx8XCJvYmplY3RcIj09PXR5cGVvZiBiJiZ1KGIsXCIuc3ZcIiksXCJQcmlvcml0eSBtdXN0IGJlIGEgc3RyaW5nIG9yIG51bWJlci5cIil9ZWxzZSBKKGE9PT1TZHx8YS5lKCksXCJwcmlvcml0eSBvZiB1bmV4cGVjdGVkIHR5cGUuXCIpO0ooYT09PVNkfHxhLkEoKS5lKCksXCJQcmlvcml0eSBub2RlcyBjYW4ndCBoYXZlIGEgcHJpb3JpdHkgb2YgdGhlaXIgb3duLlwiKX12YXIgQz1uZXcgVChuZXcgYWMoVGIpLG51bGwsamUpO2Z1bmN0aW9uIHNlKCl7VC5jYWxsKHRoaXMsbmV3IGFjKFRiKSxDLGplKX1tYShzZSxUKTtoPXNlLnByb3RvdHlwZTtcbmguQ2M9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT10aGlzPzA6MX07aC5aPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09dGhpc307aC5BPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O2guTT1mdW5jdGlvbigpe3JldHVybiBDfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMX07dmFyIFNkPW5ldyBzZSxRZD1uZXcgRShcIltNSU5fTkFNRV1cIixDKSxYZD1uZXcgRShcIltNQVhfTkFNRV1cIixTZCk7ZnVuY3Rpb24gSWQoYSxiKXt0aGlzLkQ9YTt0aGlzLlVkPWJ9ZnVuY3Rpb24gRmQoYSxiLGMsZCl7cmV0dXJuIG5ldyBJZChuZXcgc2IoYixjLGQpLGEuVWQpfWZ1bmN0aW9uIEpkKGEpe3JldHVybiBhLkQuJD9hLkQuaigpOm51bGx9SWQucHJvdG90eXBlLnU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5VZH07ZnVuY3Rpb24gdGIoYSl7cmV0dXJuIGEuVWQuJD9hLlVkLmooKTpudWxsfTtmdW5jdGlvbiB0ZShhLGIpe3RoaXMuVj1hO3ZhciBjPWEubixkPW5ldyBsZChjLmcpLGM9ZGUoYyk/bmV3IGxkKGMuZyk6Yy5pYT9uZXcgcmQoYyk6bmV3IG1kKGMpO3RoaXMuR2Y9bmV3IHpkKGMpO3ZhciBlPWIudSgpLGY9Yi5ELGc9ZC50YShDLGUuaigpLG51bGwpLGs9Yy50YShDLGYuaigpLG51bGwpO3RoaXMuS2E9bmV3IElkKG5ldyBzYihrLGYuJCxjLkdhKCkpLG5ldyBzYihnLGUuJCxkLkdhKCkpKTt0aGlzLlphPVtdO3RoaXMuaWc9bmV3IGRkKGEpfWZ1bmN0aW9uIHVlKGEpe3JldHVybiBhLlZ9aD10ZS5wcm90b3R5cGU7aC51PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuS2EudSgpLmooKX07aC5oYj1mdW5jdGlvbihhKXt2YXIgYj10Yih0aGlzLkthKTtyZXR1cm4gYiYmKGRlKHRoaXMuVi5uKXx8IWEuZSgpJiYhYi5NKE8oYSkpLmUoKSk/Yi5vYShhKTpudWxsfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gMD09PXRoaXMuWmEubGVuZ3RofTtoLk9iPWZ1bmN0aW9uKGEpe3RoaXMuWmEucHVzaChhKX07XG5oLmtiPWZ1bmN0aW9uKGEsYil7dmFyIGM9W107aWYoYil7SihudWxsPT1hLFwiQSBjYW5jZWwgc2hvdWxkIGNhbmNlbCBhbGwgZXZlbnQgcmVnaXN0cmF0aW9ucy5cIik7dmFyIGQ9dGhpcy5WLnBhdGg7T2EodGhpcy5aYSxmdW5jdGlvbihhKXsoYT1hLmZmKGIsZCkpJiZjLnB1c2goYSl9KX1pZihhKXtmb3IodmFyIGU9W10sZj0wO2Y8dGhpcy5aYS5sZW5ndGg7KytmKXt2YXIgZz10aGlzLlphW2ZdO2lmKCFnLm1hdGNoZXMoYSkpZS5wdXNoKGcpO2Vsc2UgaWYoYS5zZigpKXtlPWUuY29uY2F0KHRoaXMuWmEuc2xpY2UoZisxKSk7YnJlYWt9fXRoaXMuWmE9ZX1lbHNlIHRoaXMuWmE9W107cmV0dXJuIGN9O1xuaC5iYj1mdW5jdGlvbihhLGIsYyl7YS50eXBlPT09Q2QmJm51bGwhPT1hLnNvdXJjZS5JYiYmKEoodGIodGhpcy5LYSksXCJXZSBzaG91bGQgYWx3YXlzIGhhdmUgYSBmdWxsIGNhY2hlIGJlZm9yZSBoYW5kbGluZyBtZXJnZXNcIiksSihKZCh0aGlzLkthKSxcIk1pc3NpbmcgZXZlbnQgY2FjaGUsIGV2ZW4gdGhvdWdoIHdlIGhhdmUgYSBzZXJ2ZXIgY2FjaGVcIikpO3ZhciBkPXRoaXMuS2E7YT10aGlzLkdmLmJiKGQsYSxiLGMpO2I9dGhpcy5HZjtjPWEuaGU7SihjLkQuaigpLkljKGIuSS5nKSxcIkV2ZW50IHNuYXAgbm90IGluZGV4ZWRcIik7SihjLnUoKS5qKCkuSWMoYi5JLmcpLFwiU2VydmVyIHNuYXAgbm90IGluZGV4ZWRcIik7SihIYihhLmhlLnUoKSl8fCFIYihkLnUoKSksXCJPbmNlIGEgc2VydmVyIHNuYXAgaXMgY29tcGxldGUsIGl0IHNob3VsZCBuZXZlciBnbyBiYWNrXCIpO3RoaXMuS2E9YS5oZTtyZXR1cm4gdmUodGhpcyxhLmNnLGEuaGUuRC5qKCksbnVsbCl9O1xuZnVuY3Rpb24gd2UoYSxiKXt2YXIgYz1hLkthLkQsZD1bXTtjLmooKS5OKCl8fGMuaigpLlUoTSxmdW5jdGlvbihhLGIpe2QucHVzaChuZXcgRChcImNoaWxkX2FkZGVkXCIsYixhKSl9KTtjLiQmJmQucHVzaChEYihjLmooKSkpO3JldHVybiB2ZShhLGQsYy5qKCksYil9ZnVuY3Rpb24gdmUoYSxiLGMsZCl7cmV0dXJuIGVkKGEuaWcsYixjLGQ/W2RdOmEuWmEpfTtmdW5jdGlvbiB4ZShhLGIsYyl7dGhpcy50eXBlPUNkO3RoaXMuc291cmNlPWE7dGhpcy5wYXRoPWI7dGhpcy5jaGlsZHJlbj1jfXhlLnByb3RvdHlwZS5XYz1mdW5jdGlvbihhKXtpZih0aGlzLnBhdGguZSgpKXJldHVybiBhPXRoaXMuY2hpbGRyZW4uc3VidHJlZShuZXcgSyhhKSksYS5lKCk/bnVsbDphLnZhbHVlP25ldyBVYih0aGlzLnNvdXJjZSxGLGEudmFsdWUpOm5ldyB4ZSh0aGlzLnNvdXJjZSxGLGEpO0ooTyh0aGlzLnBhdGgpPT09YSxcIkNhbid0IGdldCBhIG1lcmdlIGZvciBhIGNoaWxkIG5vdCBvbiB0aGUgcGF0aCBvZiB0aGUgb3BlcmF0aW9uXCIpO3JldHVybiBuZXcgeGUodGhpcy5zb3VyY2UsRyh0aGlzLnBhdGgpLHRoaXMuY2hpbGRyZW4pfTt4ZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIk9wZXJhdGlvbihcIit0aGlzLnBhdGgrXCI6IFwiK3RoaXMuc291cmNlLnRvU3RyaW5nKCkrXCIgbWVyZ2U6IFwiK3RoaXMuY2hpbGRyZW4udG9TdHJpbmcoKStcIilcIn07dmFyIFZiPTAsQ2Q9MSxYYj0yLCRiPTM7ZnVuY3Rpb24geWUoYSxiLGMsZCl7dGhpcy52ZT1hO3RoaXMub2Y9Yjt0aGlzLkliPWM7dGhpcy5hZj1kO0ooIWR8fGIsXCJUYWdnZWQgcXVlcmllcyBtdXN0IGJlIGZyb20gc2VydmVyLlwiKX12YXIgWWI9bmV3IHllKCEwLCExLG51bGwsITEpLHplPW5ldyB5ZSghMSwhMCxudWxsLCExKTt5ZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52ZT9cInVzZXJcIjp0aGlzLmFmP1wic2VydmVyKHF1ZXJ5SUQ9XCIrdGhpcy5JYitcIilcIjpcInNlcnZlclwifTtmdW5jdGlvbiBBZShhLGIpe3RoaXMuZj1PYyhcInA6cmVzdDpcIik7dGhpcy5IPWE7dGhpcy5HYj1iO3RoaXMuRmE9bnVsbDt0aGlzLmFhPXt9fWZ1bmN0aW9uIEJlKGEsYil7aWYobihiKSlyZXR1cm5cInRhZyRcIitiO3ZhciBjPWEubjtKKGRlKGMpJiZjLmc9PU0sXCJzaG91bGQgaGF2ZSBhIHRhZyBpZiBpdCdzIG5vdCBhIGRlZmF1bHQgcXVlcnkuXCIpO3JldHVybiBhLnBhdGgudG9TdHJpbmcoKX1oPUFlLnByb3RvdHlwZTtcbmgueGY9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5wYXRoLnRvU3RyaW5nKCk7dGhpcy5mKFwiTGlzdGVuIGNhbGxlZCBmb3IgXCIrZStcIiBcIithLndhKCkpO3ZhciBmPUJlKGEsYyksZz17fTt0aGlzLmFhW2ZdPWc7YT1lZShhLm4pO3ZhciBrPXRoaXM7Q2UodGhpcyxlK1wiLmpzb25cIixhLGZ1bmN0aW9uKGEsYil7dmFyIHY9Yjs0MDQ9PT1hJiYoYT12PW51bGwpO251bGw9PT1hJiZrLkdiKGUsdiwhMSxjKTt3KGsuYWEsZik9PT1nJiZkKGE/NDAxPT1hP1wicGVybWlzc2lvbl9kZW5pZWRcIjpcInJlc3RfZXJyb3I6XCIrYTpcIm9rXCIsbnVsbCl9KX07aC5PZj1mdW5jdGlvbihhLGIpe3ZhciBjPUJlKGEsYik7ZGVsZXRlIHRoaXMuYWFbY119O2guUD1mdW5jdGlvbihhLGIpe3RoaXMuRmE9YTt2YXIgYz1hZChhKSxkPWMuZGF0YSxjPWMuQWMmJmMuQWMuZXhwO2ImJmIoXCJva1wiLHthdXRoOmQsZXhwaXJlczpjfSl9O2guZWU9ZnVuY3Rpb24oYSl7dGhpcy5GYT1udWxsO2EoXCJva1wiLG51bGwpfTtcbmguTGU9ZnVuY3Rpb24oKXt9O2guQmY9ZnVuY3Rpb24oKXt9O2guR2Q9ZnVuY3Rpb24oKXt9O2gucHV0PWZ1bmN0aW9uKCl7fTtoLnlmPWZ1bmN0aW9uKCl7fTtoLlRlPWZ1bmN0aW9uKCl7fTtcbmZ1bmN0aW9uIENlKGEsYixjLGQpe2M9Y3x8e307Yy5mb3JtYXQ9XCJleHBvcnRcIjthLkZhJiYoYy5hdXRoPWEuRmEpO3ZhciBlPShhLkgubGI/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKSthLkguaG9zdCtiK1wiP1wiK2piKGMpO2EuZihcIlNlbmRpbmcgUkVTVCByZXF1ZXN0IGZvciBcIitlKTt2YXIgZj1uZXcgWE1MSHR0cFJlcXVlc3Q7Zi5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtpZihkJiY0PT09Zi5yZWFkeVN0YXRlKXthLmYoXCJSRVNUIFJlc3BvbnNlIGZvciBcIitlK1wiIHJlY2VpdmVkLiBzdGF0dXM6XCIsZi5zdGF0dXMsXCJyZXNwb25zZTpcIixmLnJlc3BvbnNlVGV4dCk7dmFyIGI9bnVsbDtpZigyMDA8PWYuc3RhdHVzJiYzMDA+Zi5zdGF0dXMpe3RyeXtiPW1iKGYucmVzcG9uc2VUZXh0KX1jYXRjaChjKXtRKFwiRmFpbGVkIHRvIHBhcnNlIEpTT04gcmVzcG9uc2UgZm9yIFwiK2UrXCI6IFwiK2YucmVzcG9uc2VUZXh0KX1kKG51bGwsYil9ZWxzZSA0MDEhPT1mLnN0YXR1cyYmNDA0IT09XG5mLnN0YXR1cyYmUShcIkdvdCB1bnN1Y2Nlc3NmdWwgUkVTVCByZXNwb25zZSBmb3IgXCIrZStcIiBTdGF0dXM6IFwiK2Yuc3RhdHVzKSxkKGYuc3RhdHVzKTtkPW51bGx9fTtmLm9wZW4oXCJHRVRcIixlLCEwKTtmLnNlbmQoKX07ZnVuY3Rpb24gRGUoYSxiKXt0aGlzLnZhbHVlPWE7dGhpcy5jaGlsZHJlbj1ifHxFZX12YXIgRWU9bmV3IGFjKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9PT1iPzA6YTxiPy0xOjF9KTtmdW5jdGlvbiBGZShhKXt2YXIgYj1OZDtyKGEsZnVuY3Rpb24oYSxkKXtiPWIuc2V0KG5ldyBLKGQpLGEpfSk7cmV0dXJuIGJ9aD1EZS5wcm90b3R5cGU7aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGw9PT10aGlzLnZhbHVlJiZ0aGlzLmNoaWxkcmVuLmUoKX07ZnVuY3Rpb24gR2UoYSxiLGMpe2lmKG51bGwhPWEudmFsdWUmJmMoYS52YWx1ZSkpcmV0dXJue3BhdGg6Rix2YWx1ZTphLnZhbHVlfTtpZihiLmUoKSlyZXR1cm4gbnVsbDt2YXIgZD1PKGIpO2E9YS5jaGlsZHJlbi5nZXQoZCk7cmV0dXJuIG51bGwhPT1hPyhiPUdlKGEsRyhiKSxjKSxudWxsIT1iP3twYXRoOihuZXcgSyhkKSkudyhiLnBhdGgpLHZhbHVlOmIudmFsdWV9Om51bGwpOm51bGx9XG5mdW5jdGlvbiBIZShhLGIpe3JldHVybiBHZShhLGIsZnVuY3Rpb24oKXtyZXR1cm4hMH0pfWguc3VidHJlZT1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLmNoaWxkcmVuLmdldChPKGEpKTtyZXR1cm4gbnVsbCE9PWI/Yi5zdWJ0cmVlKEcoYSkpOk5kfTtoLnNldD1mdW5jdGlvbihhLGIpe2lmKGEuZSgpKXJldHVybiBuZXcgRGUoYix0aGlzLmNoaWxkcmVuKTt2YXIgYz1PKGEpLGQ9KHRoaXMuY2hpbGRyZW4uZ2V0KGMpfHxOZCkuc2V0KEcoYSksYiksYz10aGlzLmNoaWxkcmVuLk5hKGMsZCk7cmV0dXJuIG5ldyBEZSh0aGlzLnZhbHVlLGMpfTtcbmgucmVtb3ZlPWZ1bmN0aW9uKGEpe2lmKGEuZSgpKXJldHVybiB0aGlzLmNoaWxkcmVuLmUoKT9OZDpuZXcgRGUobnVsbCx0aGlzLmNoaWxkcmVuKTt2YXIgYj1PKGEpLGM9dGhpcy5jaGlsZHJlbi5nZXQoYik7cmV0dXJuIGM/KGE9Yy5yZW1vdmUoRyhhKSksYj1hLmUoKT90aGlzLmNoaWxkcmVuLnJlbW92ZShiKTp0aGlzLmNoaWxkcmVuLk5hKGIsYSksbnVsbD09PXRoaXMudmFsdWUmJmIuZSgpP05kOm5ldyBEZSh0aGlzLnZhbHVlLGIpKTp0aGlzfTtoLmdldD1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gdGhpcy52YWx1ZTt2YXIgYj10aGlzLmNoaWxkcmVuLmdldChPKGEpKTtyZXR1cm4gYj9iLmdldChHKGEpKTpudWxsfTtcbmZ1bmN0aW9uIE1kKGEsYixjKXtpZihiLmUoKSlyZXR1cm4gYzt2YXIgZD1PKGIpO2I9TWQoYS5jaGlsZHJlbi5nZXQoZCl8fE5kLEcoYiksYyk7ZD1iLmUoKT9hLmNoaWxkcmVuLnJlbW92ZShkKTphLmNoaWxkcmVuLk5hKGQsYik7cmV0dXJuIG5ldyBEZShhLnZhbHVlLGQpfWZ1bmN0aW9uIEllKGEsYil7cmV0dXJuIEplKGEsRixiKX1mdW5jdGlvbiBKZShhLGIsYyl7dmFyIGQ9e307YS5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGYpe2RbYV09SmUoZixiLncoYSksYyl9KTtyZXR1cm4gYyhiLGEudmFsdWUsZCl9ZnVuY3Rpb24gS2UoYSxiLGMpe3JldHVybiBMZShhLGIsRixjKX1mdW5jdGlvbiBMZShhLGIsYyxkKXt2YXIgZT1hLnZhbHVlP2QoYyxhLnZhbHVlKTohMTtpZihlKXJldHVybiBlO2lmKGIuZSgpKXJldHVybiBudWxsO2U9TyhiKTtyZXR1cm4oYT1hLmNoaWxkcmVuLmdldChlKSk/TGUoYSxHKGIpLGMudyhlKSxkKTpudWxsfVxuZnVuY3Rpb24gTWUoYSxiLGMpe3ZhciBkPUY7aWYoIWIuZSgpKXt2YXIgZT0hMDthLnZhbHVlJiYoZT1jKGQsYS52YWx1ZSkpOyEwPT09ZSYmKGU9TyhiKSwoYT1hLmNoaWxkcmVuLmdldChlKSkmJk5lKGEsRyhiKSxkLncoZSksYykpfX1mdW5jdGlvbiBOZShhLGIsYyxkKXtpZihiLmUoKSlyZXR1cm4gYTthLnZhbHVlJiZkKGMsYS52YWx1ZSk7dmFyIGU9TyhiKTtyZXR1cm4oYT1hLmNoaWxkcmVuLmdldChlKSk/TmUoYSxHKGIpLGMudyhlKSxkKTpOZH1mdW5jdGlvbiBLZChhLGIpe09lKGEsRixiKX1mdW5jdGlvbiBPZShhLGIsYyl7YS5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGUpe09lKGUsYi53KGEpLGMpfSk7YS52YWx1ZSYmYyhiLGEudmFsdWUpfWZ1bmN0aW9uIFBlKGEsYil7YS5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGQpe2QudmFsdWUmJmIoYSxkLnZhbHVlKX0pfXZhciBOZD1uZXcgRGUobnVsbCk7XG5EZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt2YXIgYT17fTtLZCh0aGlzLGZ1bmN0aW9uKGIsYyl7YVtiLnRvU3RyaW5nKCldPWMudG9TdHJpbmcoKX0pO3JldHVybiBCKGEpfTtmdW5jdGlvbiBRZShhKXt0aGlzLlc9YX12YXIgUmU9bmV3IFFlKG5ldyBEZShudWxsKSk7ZnVuY3Rpb24gU2UoYSxiLGMpe2lmKGIuZSgpKXJldHVybiBuZXcgUWUobmV3IERlKGMpKTt2YXIgZD1IZShhLlcsYik7aWYobnVsbCE9ZCl7dmFyIGU9ZC5wYXRoLGQ9ZC52YWx1ZTtiPU4oZSxiKTtkPWQuRyhiLGMpO3JldHVybiBuZXcgUWUoYS5XLnNldChlLGQpKX1hPU1kKGEuVyxiLG5ldyBEZShjKSk7cmV0dXJuIG5ldyBRZShhKX1mdW5jdGlvbiBUZShhLGIsYyl7dmFyIGQ9YTtoYihjLGZ1bmN0aW9uKGEsYyl7ZD1TZShkLGIudyhhKSxjKX0pO3JldHVybiBkfVFlLnByb3RvdHlwZS5PZD1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gUmU7YT1NZCh0aGlzLlcsYSxOZCk7cmV0dXJuIG5ldyBRZShhKX07ZnVuY3Rpb24gVWUoYSxiKXt2YXIgYz1IZShhLlcsYik7cmV0dXJuIG51bGwhPWM/YS5XLmdldChjLnBhdGgpLm9hKE4oYy5wYXRoLGIpKTpudWxsfVxuZnVuY3Rpb24gVmUoYSl7dmFyIGI9W10sYz1hLlcudmFsdWU7bnVsbCE9Yz9jLk4oKXx8Yy5VKE0sZnVuY3Rpb24oYSxjKXtiLnB1c2gobmV3IEUoYSxjKSl9KTphLlcuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYSxjKXtudWxsIT1jLnZhbHVlJiZiLnB1c2gobmV3IEUoYSxjLnZhbHVlKSl9KTtyZXR1cm4gYn1mdW5jdGlvbiBXZShhLGIpe2lmKGIuZSgpKXJldHVybiBhO3ZhciBjPVVlKGEsYik7cmV0dXJuIG51bGwhPWM/bmV3IFFlKG5ldyBEZShjKSk6bmV3IFFlKGEuVy5zdWJ0cmVlKGIpKX1RZS5wcm90b3R5cGUuZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLlcuZSgpfTtRZS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oYSl7cmV0dXJuIFhlKEYsdGhpcy5XLGEpfTtcbmZ1bmN0aW9uIFhlKGEsYixjKXtpZihudWxsIT1iLnZhbHVlKXJldHVybiBjLkcoYSxiLnZhbHVlKTt2YXIgZD1udWxsO2IuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYixmKXtcIi5wcmlvcml0eVwiPT09Yj8oSihudWxsIT09Zi52YWx1ZSxcIlByaW9yaXR5IHdyaXRlcyBtdXN0IGFsd2F5cyBiZSBsZWFmIG5vZGVzXCIpLGQ9Zi52YWx1ZSk6Yz1YZShhLncoYiksZixjKX0pO2Mub2EoYSkuZSgpfHxudWxsPT09ZHx8KGM9Yy5HKGEudyhcIi5wcmlvcml0eVwiKSxkKSk7cmV0dXJuIGN9O2Z1bmN0aW9uIFllKCl7dGhpcy5UPVJlO3RoaXMuemE9W107dGhpcy5MYz0tMX1oPVllLnByb3RvdHlwZTtcbmguT2Q9ZnVuY3Rpb24oYSl7dmFyIGI9VWEodGhpcy56YSxmdW5jdGlvbihiKXtyZXR1cm4gYi5pZT09PWF9KTtKKDA8PWIsXCJyZW1vdmVXcml0ZSBjYWxsZWQgd2l0aCBub25leGlzdGVudCB3cml0ZUlkLlwiKTt2YXIgYz10aGlzLnphW2JdO3RoaXMuemEuc3BsaWNlKGIsMSk7Zm9yKHZhciBkPWMudmlzaWJsZSxlPSExLGY9dGhpcy56YS5sZW5ndGgtMTtkJiYwPD1mOyl7dmFyIGc9dGhpcy56YVtmXTtnLnZpc2libGUmJihmPj1iJiZaZShnLGMucGF0aCk/ZD0hMTpjLnBhdGguY29udGFpbnMoZy5wYXRoKSYmKGU9ITApKTtmLS19aWYoZCl7aWYoZSl0aGlzLlQ9JGUodGhpcy56YSxhZixGKSx0aGlzLkxjPTA8dGhpcy56YS5sZW5ndGg/dGhpcy56YVt0aGlzLnphLmxlbmd0aC0xXS5pZTotMTtlbHNlIGlmKGMuSWEpdGhpcy5UPXRoaXMuVC5PZChjLnBhdGgpO2Vsc2V7dmFyIGs9dGhpcztyKGMuY2hpbGRyZW4sZnVuY3Rpb24oYSxiKXtrLlQ9ay5ULk9kKGMucGF0aC53KGIpKX0pfXJldHVybiBjLnBhdGh9cmV0dXJuIG51bGx9O1xuaC51YT1mdW5jdGlvbihhLGIsYyxkKXtpZihjfHxkKXt2YXIgZT1XZSh0aGlzLlQsYSk7cmV0dXJuIWQmJmUuZSgpP2I6ZHx8bnVsbCE9Ynx8bnVsbCE9VWUoZSxGKT8oZT0kZSh0aGlzLnphLGZ1bmN0aW9uKGIpe3JldHVybihiLnZpc2libGV8fGQpJiYoIWN8fCEoMDw9TmEoYyxiLmllKSkpJiYoYi5wYXRoLmNvbnRhaW5zKGEpfHxhLmNvbnRhaW5zKGIucGF0aCkpfSxhKSxiPWJ8fEMsZS5hcHBseShiKSk6bnVsbH1lPVVlKHRoaXMuVCxhKTtpZihudWxsIT1lKXJldHVybiBlO2U9V2UodGhpcy5ULGEpO3JldHVybiBlLmUoKT9iOm51bGwhPWJ8fG51bGwhPVVlKGUsRik/KGI9Ynx8QyxlLmFwcGx5KGIpKTpudWxsfTtcbmgueGM9ZnVuY3Rpb24oYSxiKXt2YXIgYz1DLGQ9VWUodGhpcy5ULGEpO2lmKGQpZC5OKCl8fGQuVShNLGZ1bmN0aW9uKGEsYil7Yz1jLlEoYSxiKX0pO2Vsc2UgaWYoYil7dmFyIGU9V2UodGhpcy5ULGEpO2IuVShNLGZ1bmN0aW9uKGEsYil7dmFyIGQ9V2UoZSxuZXcgSyhhKSkuYXBwbHkoYik7Yz1jLlEoYSxkKX0pO09hKFZlKGUpLGZ1bmN0aW9uKGEpe2M9Yy5RKGEubmFtZSxhLlMpfSl9ZWxzZSBlPVdlKHRoaXMuVCxhKSxPYShWZShlKSxmdW5jdGlvbihhKXtjPWMuUShhLm5hbWUsYS5TKX0pO3JldHVybiBjfTtoLmhkPWZ1bmN0aW9uKGEsYixjLGQpe0ooY3x8ZCxcIkVpdGhlciBleGlzdGluZ0V2ZW50U25hcCBvciBleGlzdGluZ1NlcnZlclNuYXAgbXVzdCBleGlzdFwiKTthPWEudyhiKTtpZihudWxsIT1VZSh0aGlzLlQsYSkpcmV0dXJuIG51bGw7YT1XZSh0aGlzLlQsYSk7cmV0dXJuIGEuZSgpP2Qub2EoYik6YS5hcHBseShkLm9hKGIpKX07XG5oLlhhPWZ1bmN0aW9uKGEsYixjKXthPWEudyhiKTt2YXIgZD1VZSh0aGlzLlQsYSk7cmV0dXJuIG51bGwhPWQ/ZDpyYihjLGIpP1dlKHRoaXMuVCxhKS5hcHBseShjLmooKS5NKGIpKTpudWxsfTtoLnNjPWZ1bmN0aW9uKGEpe3JldHVybiBVZSh0aGlzLlQsYSl9O2gubWU9ZnVuY3Rpb24oYSxiLGMsZCxlLGYpe3ZhciBnO2E9V2UodGhpcy5ULGEpO2c9VWUoYSxGKTtpZihudWxsPT1nKWlmKG51bGwhPWIpZz1hLmFwcGx5KGIpO2Vsc2UgcmV0dXJuW107Zz1nLm1iKGYpO2lmKGcuZSgpfHxnLk4oKSlyZXR1cm5bXTtiPVtdO2E9dWQoZik7ZT1lP2cuWmIoYyxmKTpnLlhiKGMsZik7Zm9yKGY9SChlKTtmJiZiLmxlbmd0aDxkOykwIT09YShmLGMpJiZiLnB1c2goZiksZj1IKGUpO3JldHVybiBifTtcbmZ1bmN0aW9uIFplKGEsYil7cmV0dXJuIGEuSWE/YS5wYXRoLmNvbnRhaW5zKGIpOiEhdWEoYS5jaGlsZHJlbixmdW5jdGlvbihjLGQpe3JldHVybiBhLnBhdGgudyhkKS5jb250YWlucyhiKX0pfWZ1bmN0aW9uIGFmKGEpe3JldHVybiBhLnZpc2libGV9XG5mdW5jdGlvbiAkZShhLGIsYyl7Zm9yKHZhciBkPVJlLGU9MDtlPGEubGVuZ3RoOysrZSl7dmFyIGY9YVtlXTtpZihiKGYpKXt2YXIgZz1mLnBhdGg7aWYoZi5JYSljLmNvbnRhaW5zKGcpPyhnPU4oYyxnKSxkPVNlKGQsZyxmLklhKSk6Zy5jb250YWlucyhjKSYmKGc9TihnLGMpLGQ9U2UoZCxGLGYuSWEub2EoZykpKTtlbHNlIGlmKGYuY2hpbGRyZW4paWYoYy5jb250YWlucyhnKSlnPU4oYyxnKSxkPVRlKGQsZyxmLmNoaWxkcmVuKTtlbHNle2lmKGcuY29udGFpbnMoYykpaWYoZz1OKGcsYyksZy5lKCkpZD1UZShkLEYsZi5jaGlsZHJlbik7ZWxzZSBpZihmPXcoZi5jaGlsZHJlbixPKGcpKSlmPWYub2EoRyhnKSksZD1TZShkLEYsZil9ZWxzZSB0aHJvdyBIYyhcIldyaXRlUmVjb3JkIHNob3VsZCBoYXZlIC5zbmFwIG9yIC5jaGlsZHJlblwiKTt9fXJldHVybiBkfWZ1bmN0aW9uIGJmKGEsYil7dGhpcy5NYj1hO3RoaXMuVz1ifWg9YmYucHJvdG90eXBlO1xuaC51YT1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHRoaXMuVy51YSh0aGlzLk1iLGEsYixjKX07aC54Yz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5XLnhjKHRoaXMuTWIsYSl9O2guaGQ9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0aGlzLlcuaGQodGhpcy5NYixhLGIsYyl9O2guc2M9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuVy5zYyh0aGlzLk1iLncoYSkpfTtoLm1lPWZ1bmN0aW9uKGEsYixjLGQsZSl7cmV0dXJuIHRoaXMuVy5tZSh0aGlzLk1iLGEsYixjLGQsZSl9O2guWGE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5XLlhhKHRoaXMuTWIsYSxiKX07aC53PWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYmYodGhpcy5NYi53KGEpLHRoaXMuVyl9O2Z1bmN0aW9uIGNmKCl7dGhpcy55YT17fX1oPWNmLnByb3RvdHlwZTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gd2EodGhpcy55YSl9O2guYmI9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEuc291cmNlLkliO2lmKG51bGwhPT1kKXJldHVybiBkPXcodGhpcy55YSxkKSxKKG51bGwhPWQsXCJTeW5jVHJlZSBnYXZlIHVzIGFuIG9wIGZvciBhbiBpbnZhbGlkIHF1ZXJ5LlwiKSxkLmJiKGEsYixjKTt2YXIgZT1bXTtyKHRoaXMueWEsZnVuY3Rpb24oZCl7ZT1lLmNvbmNhdChkLmJiKGEsYixjKSl9KTtyZXR1cm4gZX07aC5PYj1mdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmPWEud2EoKSxnPXcodGhpcy55YSxmKTtpZighZyl7dmFyIGc9Yy51YShlP2Q6bnVsbCksaz0hMTtnP2s9ITA6KGc9ZCBpbnN0YW5jZW9mIFQ/Yy54YyhkKTpDLGs9ITEpO2c9bmV3IHRlKGEsbmV3IElkKG5ldyBzYihnLGssITEpLG5ldyBzYihkLGUsITEpKSk7dGhpcy55YVtmXT1nfWcuT2IoYik7cmV0dXJuIHdlKGcsYil9O1xuaC5rYj1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9YS53YSgpLGU9W10sZj1bXSxnPW51bGwhPWRmKHRoaXMpO2lmKFwiZGVmYXVsdFwiPT09ZCl7dmFyIGs9dGhpcztyKHRoaXMueWEsZnVuY3Rpb24oYSxkKXtmPWYuY29uY2F0KGEua2IoYixjKSk7YS5lKCkmJihkZWxldGUgay55YVtkXSxkZShhLlYubil8fGUucHVzaChhLlYpKX0pfWVsc2V7dmFyIGw9dyh0aGlzLnlhLGQpO2wmJihmPWYuY29uY2F0KGwua2IoYixjKSksbC5lKCkmJihkZWxldGUgdGhpcy55YVtkXSxkZShsLlYubil8fGUucHVzaChsLlYpKSl9ZyYmbnVsbD09ZGYodGhpcykmJmUucHVzaChuZXcgVShhLmssYS5wYXRoKSk7cmV0dXJue0hnOmUsamc6Zn19O2Z1bmN0aW9uIGVmKGEpe3JldHVybiBQYShyYShhLnlhKSxmdW5jdGlvbihhKXtyZXR1cm4hZGUoYS5WLm4pfSl9aC5oYj1mdW5jdGlvbihhKXt2YXIgYj1udWxsO3IodGhpcy55YSxmdW5jdGlvbihjKXtiPWJ8fGMuaGIoYSl9KTtyZXR1cm4gYn07XG5mdW5jdGlvbiBmZihhLGIpe2lmKGRlKGIubikpcmV0dXJuIGRmKGEpO3ZhciBjPWIud2EoKTtyZXR1cm4gdyhhLnlhLGMpfWZ1bmN0aW9uIGRmKGEpe3JldHVybiB2YShhLnlhLGZ1bmN0aW9uKGEpe3JldHVybiBkZShhLlYubil9KXx8bnVsbH07ZnVuY3Rpb24gZ2YoYSl7dGhpcy5zYT1OZDt0aGlzLkhiPW5ldyBZZTt0aGlzLiRlPXt9O3RoaXMua2M9e307dGhpcy5NYz1hfWZ1bmN0aW9uIGhmKGEsYixjLGQsZSl7dmFyIGY9YS5IYixnPWU7SihkPmYuTGMsXCJTdGFja2luZyBhbiBvbGRlciB3cml0ZSBvbiB0b3Agb2YgbmV3ZXIgb25lc1wiKTtuKGcpfHwoZz0hMCk7Zi56YS5wdXNoKHtwYXRoOmIsSWE6YyxpZTpkLHZpc2libGU6Z30pO2cmJihmLlQ9U2UoZi5ULGIsYykpO2YuTGM9ZDtyZXR1cm4gZT9qZihhLG5ldyBVYihZYixiLGMpKTpbXX1mdW5jdGlvbiBrZihhLGIsYyxkKXt2YXIgZT1hLkhiO0ooZD5lLkxjLFwiU3RhY2tpbmcgYW4gb2xkZXIgbWVyZ2Ugb24gdG9wIG9mIG5ld2VyIG9uZXNcIik7ZS56YS5wdXNoKHtwYXRoOmIsY2hpbGRyZW46YyxpZTpkLHZpc2libGU6ITB9KTtlLlQ9VGUoZS5ULGIsYyk7ZS5MYz1kO2M9RmUoYyk7cmV0dXJuIGpmKGEsbmV3IHhlKFliLGIsYykpfVxuZnVuY3Rpb24gbGYoYSxiLGMpe2M9Y3x8ITE7Yj1hLkhiLk9kKGIpO3JldHVybiBudWxsPT1iP1tdOmpmKGEsbmV3IFdiKGIsYykpfWZ1bmN0aW9uIG1mKGEsYixjKXtjPUZlKGMpO3JldHVybiBqZihhLG5ldyB4ZSh6ZSxiLGMpKX1mdW5jdGlvbiBuZihhLGIsYyxkKXtkPW9mKGEsZCk7aWYobnVsbCE9ZCl7dmFyIGU9cGYoZCk7ZD1lLnBhdGg7ZT1lLkliO2I9TihkLGIpO2M9bmV3IFViKG5ldyB5ZSghMSwhMCxlLCEwKSxiLGMpO3JldHVybiBxZihhLGQsYyl9cmV0dXJuW119ZnVuY3Rpb24gcmYoYSxiLGMsZCl7aWYoZD1vZihhLGQpKXt2YXIgZT1wZihkKTtkPWUucGF0aDtlPWUuSWI7Yj1OKGQsYik7Yz1GZShjKTtjPW5ldyB4ZShuZXcgeWUoITEsITAsZSwhMCksYixjKTtyZXR1cm4gcWYoYSxkLGMpfXJldHVybltdfVxuZ2YucHJvdG90eXBlLk9iPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5wYXRoLGQ9bnVsbCxlPSExO01lKHRoaXMuc2EsYyxmdW5jdGlvbihhLGIpe3ZhciBmPU4oYSxjKTtkPWIuaGIoZik7ZT1lfHxudWxsIT1kZihiKTtyZXR1cm4hZH0pO3ZhciBmPXRoaXMuc2EuZ2V0KGMpO2Y/KGU9ZXx8bnVsbCE9ZGYoZiksZD1kfHxmLmhiKEYpKTooZj1uZXcgY2YsdGhpcy5zYT10aGlzLnNhLnNldChjLGYpKTt2YXIgZztudWxsIT1kP2c9ITA6KGc9ITEsZD1DLFBlKHRoaXMuc2Euc3VidHJlZShjKSxmdW5jdGlvbihhLGIpe3ZhciBjPWIuaGIoRik7YyYmKGQ9ZC5RKGEsYykpfSkpO3ZhciBrPW51bGwhPWZmKGYsYSk7aWYoIWsmJiFkZShhLm4pKXt2YXIgbD1zZihhKTtKKCEobCBpbiB0aGlzLmtjKSxcIlZpZXcgZG9lcyBub3QgZXhpc3QsIGJ1dCB3ZSBoYXZlIGEgdGFnXCIpO3ZhciBtPXRmKys7dGhpcy5rY1tsXT1tO3RoaXMuJGVbXCJfXCIrbV09bH1nPWYuT2IoYSxiLG5ldyBiZihjLHRoaXMuSGIpLFxuZCxnKTtrfHxlfHwoZj1mZihmLGEpLGc9Zy5jb25jYXQodWYodGhpcyxhLGYpKSk7cmV0dXJuIGd9O1xuZ2YucHJvdG90eXBlLmtiPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLnBhdGgsZT10aGlzLnNhLmdldChkKSxmPVtdO2lmKGUmJihcImRlZmF1bHRcIj09PWEud2EoKXx8bnVsbCE9ZmYoZSxhKSkpe2Y9ZS5rYihhLGIsYyk7ZS5lKCkmJih0aGlzLnNhPXRoaXMuc2EucmVtb3ZlKGQpKTtlPWYuSGc7Zj1mLmpnO2I9LTEhPT1VYShlLGZ1bmN0aW9uKGEpe3JldHVybiBkZShhLm4pfSk7dmFyIGc9S2UodGhpcy5zYSxkLGZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGwhPWRmKGIpfSk7aWYoYiYmIWcmJihkPXRoaXMuc2Euc3VidHJlZShkKSwhZC5lKCkpKWZvcih2YXIgZD12ZihkKSxrPTA7azxkLmxlbmd0aDsrK2spe3ZhciBsPWRba10sbT1sLlYsbD13Zih0aGlzLGwpO3RoaXMuTWMuWGUobSx4Zih0aGlzLG0pLGwudWQsbC5KKX1pZighZyYmMDxlLmxlbmd0aCYmIWMpaWYoYil0aGlzLk1jLlpkKGEsbnVsbCk7ZWxzZXt2YXIgdj10aGlzO09hKGUsZnVuY3Rpb24oYSl7YS53YSgpO3ZhciBiPXYua2Nbc2YoYSldO1xudi5NYy5aZChhLGIpfSl9eWYodGhpcyxlKX1yZXR1cm4gZn07Z2YucHJvdG90eXBlLnVhPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5IYixkPUtlKHRoaXMuc2EsYSxmdW5jdGlvbihiLGMpe3ZhciBkPU4oYixhKTtpZihkPWMuaGIoZCkpcmV0dXJuIGR9KTtyZXR1cm4gYy51YShhLGQsYiwhMCl9O2Z1bmN0aW9uIHZmKGEpe3JldHVybiBJZShhLGZ1bmN0aW9uKGEsYyxkKXtpZihjJiZudWxsIT1kZihjKSlyZXR1cm5bZGYoYyldO3ZhciBlPVtdO2MmJihlPWVmKGMpKTtyKGQsZnVuY3Rpb24oYSl7ZT1lLmNvbmNhdChhKX0pO3JldHVybiBlfSl9ZnVuY3Rpb24geWYoYSxiKXtmb3IodmFyIGM9MDtjPGIubGVuZ3RoOysrYyl7dmFyIGQ9YltjXTtpZighZGUoZC5uKSl7dmFyIGQ9c2YoZCksZT1hLmtjW2RdO2RlbGV0ZSBhLmtjW2RdO2RlbGV0ZSBhLiRlW1wiX1wiK2VdfX19XG5mdW5jdGlvbiB1ZihhLGIsYyl7dmFyIGQ9Yi5wYXRoLGU9eGYoYSxiKTtjPXdmKGEsYyk7Yj1hLk1jLlhlKGIsZSxjLnVkLGMuSik7ZD1hLnNhLnN1YnRyZWUoZCk7aWYoZSlKKG51bGw9PWRmKGQudmFsdWUpLFwiSWYgd2UncmUgYWRkaW5nIGEgcXVlcnksIGl0IHNob3VsZG4ndCBiZSBzaGFkb3dlZFwiKTtlbHNlIGZvcihlPUllKGQsZnVuY3Rpb24oYSxiLGMpe2lmKCFhLmUoKSYmYiYmbnVsbCE9ZGYoYikpcmV0dXJuW3VlKGRmKGIpKV07dmFyIGQ9W107YiYmKGQ9ZC5jb25jYXQoUWEoZWYoYiksZnVuY3Rpb24oYSl7cmV0dXJuIGEuVn0pKSk7cihjLGZ1bmN0aW9uKGEpe2Q9ZC5jb25jYXQoYSl9KTtyZXR1cm4gZH0pLGQ9MDtkPGUubGVuZ3RoOysrZCljPWVbZF0sYS5NYy5aZChjLHhmKGEsYykpO3JldHVybiBifVxuZnVuY3Rpb24gd2YoYSxiKXt2YXIgYz1iLlYsZD14ZihhLGMpO3JldHVybnt1ZDpmdW5jdGlvbigpe3JldHVybihiLnUoKXx8QykuaGFzaCgpfSxKOmZ1bmN0aW9uKGIpe2lmKFwib2tcIj09PWIpe2lmKGQpe3ZhciBmPWMucGF0aDtpZihiPW9mKGEsZCkpe3ZhciBnPXBmKGIpO2I9Zy5wYXRoO2c9Zy5JYjtmPU4oYixmKTtmPW5ldyBaYihuZXcgeWUoITEsITAsZywhMCksZik7Yj1xZihhLGIsZil9ZWxzZSBiPVtdfWVsc2UgYj1qZihhLG5ldyBaYih6ZSxjLnBhdGgpKTtyZXR1cm4gYn1mPVwiVW5rbm93biBFcnJvclwiO1widG9vX2JpZ1wiPT09Yj9mPVwiVGhlIGRhdGEgcmVxdWVzdGVkIGV4Y2VlZHMgdGhlIG1heGltdW0gc2l6ZSB0aGF0IGNhbiBiZSBhY2Nlc3NlZCB3aXRoIGEgc2luZ2xlIHJlcXVlc3QuXCI6XCJwZXJtaXNzaW9uX2RlbmllZFwiPT1iP2Y9XCJDbGllbnQgZG9lc24ndCBoYXZlIHBlcm1pc3Npb24gdG8gYWNjZXNzIHRoZSBkZXNpcmVkIGRhdGEuXCI6XCJ1bmF2YWlsYWJsZVwiPT1iJiZcbihmPVwiVGhlIHNlcnZpY2UgaXMgdW5hdmFpbGFibGVcIik7Zj1FcnJvcihiK1wiOiBcIitmKTtmLmNvZGU9Yi50b1VwcGVyQ2FzZSgpO3JldHVybiBhLmtiKGMsbnVsbCxmKX19fWZ1bmN0aW9uIHNmKGEpe3JldHVybiBhLnBhdGgudG9TdHJpbmcoKStcIiRcIithLndhKCl9ZnVuY3Rpb24gcGYoYSl7dmFyIGI9YS5pbmRleE9mKFwiJFwiKTtKKC0xIT09YiYmYjxhLmxlbmd0aC0xLFwiQmFkIHF1ZXJ5S2V5LlwiKTtyZXR1cm57SWI6YS5zdWJzdHIoYisxKSxwYXRoOm5ldyBLKGEuc3Vic3RyKDAsYikpfX1mdW5jdGlvbiBvZihhLGIpe3ZhciBjPWEuJGUsZD1cIl9cIitiO3JldHVybiBkIGluIGM/Y1tkXTp2b2lkIDB9ZnVuY3Rpb24geGYoYSxiKXt2YXIgYz1zZihiKTtyZXR1cm4gdyhhLmtjLGMpfXZhciB0Zj0xO1xuZnVuY3Rpb24gcWYoYSxiLGMpe3ZhciBkPWEuc2EuZ2V0KGIpO0ooZCxcIk1pc3Npbmcgc3luYyBwb2ludCBmb3IgcXVlcnkgdGFnIHRoYXQgd2UncmUgdHJhY2tpbmdcIik7cmV0dXJuIGQuYmIoYyxuZXcgYmYoYixhLkhiKSxudWxsKX1mdW5jdGlvbiBqZihhLGIpe3JldHVybiB6ZihhLGIsYS5zYSxudWxsLG5ldyBiZihGLGEuSGIpKX1mdW5jdGlvbiB6ZihhLGIsYyxkLGUpe2lmKGIucGF0aC5lKCkpcmV0dXJuIEFmKGEsYixjLGQsZSk7dmFyIGY9Yy5nZXQoRik7bnVsbD09ZCYmbnVsbCE9ZiYmKGQ9Zi5oYihGKSk7dmFyIGc9W10saz1PKGIucGF0aCksbD1iLldjKGspO2lmKChjPWMuY2hpbGRyZW4uZ2V0KGspKSYmbCl2YXIgbT1kP2QuTShrKTpudWxsLGs9ZS53KGspLGc9Zy5jb25jYXQoemYoYSxsLGMsbSxrKSk7ZiYmKGc9Zy5jb25jYXQoZi5iYihiLGUsZCkpKTtyZXR1cm4gZ31cbmZ1bmN0aW9uIEFmKGEsYixjLGQsZSl7dmFyIGY9Yy5nZXQoRik7bnVsbD09ZCYmbnVsbCE9ZiYmKGQ9Zi5oYihGKSk7dmFyIGc9W107Yy5jaGlsZHJlbi5oYShmdW5jdGlvbihjLGYpe3ZhciBtPWQ/ZC5NKGMpOm51bGwsdj1lLncoYykseT1iLldjKGMpO3kmJihnPWcuY29uY2F0KEFmKGEseSxmLG0sdikpKX0pO2YmJihnPWcuY29uY2F0KGYuYmIoYixlLGQpKSk7cmV0dXJuIGd9O2Z1bmN0aW9uIEJmKCl7dGhpcy5jaGlsZHJlbj17fTt0aGlzLmtkPTA7dGhpcy52YWx1ZT1udWxsfWZ1bmN0aW9uIENmKGEsYixjKXt0aGlzLkRkPWE/YTpcIlwiO3RoaXMuWWM9Yj9iOm51bGw7dGhpcy5CPWM/YzpuZXcgQmZ9ZnVuY3Rpb24gRGYoYSxiKXtmb3IodmFyIGM9YiBpbnN0YW5jZW9mIEs/YjpuZXcgSyhiKSxkPWEsZTtudWxsIT09KGU9TyhjKSk7KWQ9bmV3IENmKGUsZCx3KGQuQi5jaGlsZHJlbixlKXx8bmV3IEJmKSxjPUcoYyk7cmV0dXJuIGR9aD1DZi5wcm90b3R5cGU7aC5CYT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkIudmFsdWV9O2Z1bmN0aW9uIEVmKGEsYil7SihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGIsXCJDYW5ub3Qgc2V0IHZhbHVlIHRvIHVuZGVmaW5lZFwiKTthLkIudmFsdWU9YjtGZihhKX1oLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5CLnZhbHVlPW51bGw7dGhpcy5CLmNoaWxkcmVuPXt9O3RoaXMuQi5rZD0wO0ZmKHRoaXMpfTtcbmgudGQ9ZnVuY3Rpb24oKXtyZXR1cm4gMDx0aGlzLkIua2R9O2guZT1mdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy5CYSgpJiYhdGhpcy50ZCgpfTtoLlU9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztyKHRoaXMuQi5jaGlsZHJlbixmdW5jdGlvbihjLGQpe2EobmV3IENmKGQsYixjKSl9KX07ZnVuY3Rpb24gR2YoYSxiLGMsZCl7YyYmIWQmJmIoYSk7YS5VKGZ1bmN0aW9uKGEpe0dmKGEsYiwhMCxkKX0pO2MmJmQmJmIoYSl9ZnVuY3Rpb24gSGYoYSxiKXtmb3IodmFyIGM9YS5wYXJlbnQoKTtudWxsIT09YyYmIWIoYyk7KWM9Yy5wYXJlbnQoKX1oLnBhdGg9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEsobnVsbD09PXRoaXMuWWM/dGhpcy5EZDp0aGlzLlljLnBhdGgoKStcIi9cIit0aGlzLkRkKX07aC5uYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuRGR9O2gucGFyZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuWWN9O1xuZnVuY3Rpb24gRmYoYSl7aWYobnVsbCE9PWEuWWMpe3ZhciBiPWEuWWMsYz1hLkRkLGQ9YS5lKCksZT11KGIuQi5jaGlsZHJlbixjKTtkJiZlPyhkZWxldGUgYi5CLmNoaWxkcmVuW2NdLGIuQi5rZC0tLEZmKGIpKTpkfHxlfHwoYi5CLmNoaWxkcmVuW2NdPWEuQixiLkIua2QrKyxGZihiKSl9fTtmdW5jdGlvbiBJZihhKXtKKGVhKGEpJiYwPGEubGVuZ3RoLFwiUmVxdWlyZXMgYSBub24tZW1wdHkgYXJyYXlcIik7dGhpcy5VZj1hO3RoaXMuTmM9e319SWYucHJvdG90eXBlLmRlPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPXRoaXMuTmNbYV18fFtdLGQ9MDtkPGMubGVuZ3RoO2QrKyljW2RdLnljLmFwcGx5KGNbZF0uTWEsQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpKX07SWYucHJvdG90eXBlLkViPWZ1bmN0aW9uKGEsYixjKXtKZih0aGlzLGEpO3RoaXMuTmNbYV09dGhpcy5OY1thXXx8W107dGhpcy5OY1thXS5wdXNoKHt5YzpiLE1hOmN9KTsoYT10aGlzLnplKGEpKSYmYi5hcHBseShjLGEpfTtJZi5wcm90b3R5cGUuZ2M9ZnVuY3Rpb24oYSxiLGMpe0pmKHRoaXMsYSk7YT10aGlzLk5jW2FdfHxbXTtmb3IodmFyIGQ9MDtkPGEubGVuZ3RoO2QrKylpZihhW2RdLnljPT09YiYmKCFjfHxjPT09YVtkXS5NYSkpe2Euc3BsaWNlKGQsMSk7YnJlYWt9fTtcbmZ1bmN0aW9uIEpmKGEsYil7SihUYShhLlVmLGZ1bmN0aW9uKGEpe3JldHVybiBhPT09Yn0pLFwiVW5rbm93biBldmVudDogXCIrYil9O3ZhciBLZj1mdW5jdGlvbigpe3ZhciBhPTAsYj1bXTtyZXR1cm4gZnVuY3Rpb24oYyl7dmFyIGQ9Yz09PWE7YT1jO2Zvcih2YXIgZT1BcnJheSg4KSxmPTc7MDw9ZjtmLS0pZVtmXT1cIi0wMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpfYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIi5jaGFyQXQoYyU2NCksYz1NYXRoLmZsb29yKGMvNjQpO0ooMD09PWMsXCJDYW5ub3QgcHVzaCBhdCB0aW1lID09IDBcIik7Yz1lLmpvaW4oXCJcIik7aWYoZCl7Zm9yKGY9MTE7MDw9ZiYmNjM9PT1iW2ZdO2YtLSliW2ZdPTA7YltmXSsrfWVsc2UgZm9yKGY9MDsxMj5mO2YrKyliW2ZdPU1hdGguZmxvb3IoNjQqTWF0aC5yYW5kb20oKSk7Zm9yKGY9MDsxMj5mO2YrKyljKz1cIi0wMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpfYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIi5jaGFyQXQoYltmXSk7SigyMD09PWMubGVuZ3RoLFwibmV4dFB1c2hJZDogTGVuZ3RoIHNob3VsZCBiZSAyMC5cIik7XG5yZXR1cm4gY319KCk7ZnVuY3Rpb24gTGYoKXtJZi5jYWxsKHRoaXMsW1wib25saW5lXCJdKTt0aGlzLmljPSEwO2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXt2YXIgYT10aGlzO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib25saW5lXCIsZnVuY3Rpb24oKXthLmljfHwoYS5pYz0hMCxhLmRlKFwib25saW5lXCIsITApKX0sITEpO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib2ZmbGluZVwiLGZ1bmN0aW9uKCl7YS5pYyYmKGEuaWM9ITEsYS5kZShcIm9ubGluZVwiLCExKSl9LCExKX19bWEoTGYsSWYpO0xmLnByb3RvdHlwZS56ZT1mdW5jdGlvbihhKXtKKFwib25saW5lXCI9PT1hLFwiVW5rbm93biBldmVudCB0eXBlOiBcIithKTtyZXR1cm5bdGhpcy5pY119O2NhKExmKTtmdW5jdGlvbiBNZigpe0lmLmNhbGwodGhpcyxbXCJ2aXNpYmxlXCJdKTt2YXIgYSxiO1widW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciYmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQuaGlkZGVuPyhiPVwidmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJoaWRkZW5cIik6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4/KGI9XCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cIm1vekhpZGRlblwiKTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuPyhiPVwibXN2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cIm1zSGlkZGVuXCIpOlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuJiYoYj1cIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIixhPVwid2Via2l0SGlkZGVuXCIpKTt0aGlzLnVjPSEwO2lmKGIpe3ZhciBjPXRoaXM7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihiLFxuZnVuY3Rpb24oKXt2YXIgYj0hZG9jdW1lbnRbYV07YiE9PWMudWMmJihjLnVjPWIsYy5kZShcInZpc2libGVcIixiKSl9LCExKX19bWEoTWYsSWYpO01mLnByb3RvdHlwZS56ZT1mdW5jdGlvbihhKXtKKFwidmlzaWJsZVwiPT09YSxcIlVua25vd24gZXZlbnQgdHlwZTogXCIrYSk7cmV0dXJuW3RoaXMudWNdfTtjYShNZik7dmFyIE5mPS9bXFxbXFxdLiMkXFwvXFx1MDAwMC1cXHUwMDFGXFx1MDA3Rl0vLE9mPS9bXFxbXFxdLiMkXFx1MDAwMC1cXHUwMDFGXFx1MDA3Rl0vO2Z1bmN0aW9uIFBmKGEpe3JldHVybiBwKGEpJiYwIT09YS5sZW5ndGgmJiFOZi50ZXN0KGEpfWZ1bmN0aW9uIFFmKGEpe3JldHVybiBudWxsPT09YXx8cChhKXx8Z2EoYSkmJiFTYyhhKXx8aWEoYSkmJnUoYSxcIi5zdlwiKX1mdW5jdGlvbiBSZihhLGIsYyxkKXtkJiYhbihiKXx8U2YoeihhLDEsZCksYixjKX1cbmZ1bmN0aW9uIFNmKGEsYixjKXtjIGluc3RhbmNlb2YgSyYmKGM9bmV3IHdjKGMsYSkpO2lmKCFuKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyB1bmRlZmluZWQgXCIremMoYykpO2lmKGhhKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyBhIGZ1bmN0aW9uIFwiK3pjKGMpK1wiIHdpdGggY29udGVudHM6IFwiK2IudG9TdHJpbmcoKSk7aWYoU2MoYikpdGhyb3cgRXJyb3IoYStcImNvbnRhaW5zIFwiK2IudG9TdHJpbmcoKStcIiBcIit6YyhjKSk7aWYocChiKSYmYi5sZW5ndGg+MTA0ODU3NjAvMyYmMTA0ODU3NjA8eGMoYikpdGhyb3cgRXJyb3IoYStcImNvbnRhaW5zIGEgc3RyaW5nIGdyZWF0ZXIgdGhhbiAxMDQ4NTc2MCB1dGY4IGJ5dGVzIFwiK3pjKGMpK1wiICgnXCIrYi5zdWJzdHJpbmcoMCw1MCkrXCIuLi4nKVwiKTtpZihpYShiKSl7dmFyIGQ9ITEsZT0hMTtoYihiLGZ1bmN0aW9uKGIsZyl7aWYoXCIudmFsdWVcIj09PWIpZD0hMDtlbHNlIGlmKFwiLnByaW9yaXR5XCIhPT1iJiZcIi5zdlwiIT09YiYmKGU9XG4hMCwhUGYoYikpKXRocm93IEVycm9yKGErXCIgY29udGFpbnMgYW4gaW52YWxpZCBrZXkgKFwiK2IrXCIpIFwiK3pjKGMpKycuICBLZXlzIG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ3MgYW5kIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIi9cIiwgXCJbXCIsIG9yIFwiXVwiJyk7Yy5wdXNoKGIpO1NmKGEsZyxjKTtjLnBvcCgpfSk7aWYoZCYmZSl0aHJvdyBFcnJvcihhKycgY29udGFpbnMgXCIudmFsdWVcIiBjaGlsZCAnK3pjKGMpK1wiIGluIGFkZGl0aW9uIHRvIGFjdHVhbCBjaGlsZHJlbi5cIik7fX1cbmZ1bmN0aW9uIFRmKGEsYixjKXtpZighaWEoYil8fGVhKGIpKXRocm93IEVycm9yKHooYSwxLCExKStcIiBtdXN0IGJlIGFuIE9iamVjdCBjb250YWluaW5nIHRoZSBjaGlsZHJlbiB0byByZXBsYWNlLlwiKTtpZih1KGIsXCIudmFsdWVcIikpdGhyb3cgRXJyb3IoeihhLDEsITEpKycgbXVzdCBub3QgY29udGFpbiBcIi52YWx1ZVwiLiAgVG8gb3ZlcndyaXRlIHdpdGggYSBsZWFmIHZhbHVlLCBqdXN0IHVzZSAuc2V0KCkgaW5zdGVhZC4nKTtSZihhLGIsYywhMSl9XG5mdW5jdGlvbiBVZihhLGIsYyl7aWYoU2MoYykpdGhyb3cgRXJyb3IoeihhLGIsITEpK1wiaXMgXCIrYy50b1N0cmluZygpK1wiLCBidXQgbXVzdCBiZSBhIHZhbGlkIEZpcmViYXNlIHByaW9yaXR5IChhIHN0cmluZywgZmluaXRlIG51bWJlciwgc2VydmVyIHZhbHVlLCBvciBudWxsKS5cIik7aWYoIVFmKGMpKXRocm93IEVycm9yKHooYSxiLCExKStcIm11c3QgYmUgYSB2YWxpZCBGaXJlYmFzZSBwcmlvcml0eSAoYSBzdHJpbmcsIGZpbml0ZSBudW1iZXIsIHNlcnZlciB2YWx1ZSwgb3IgbnVsbCkuXCIpO31cbmZ1bmN0aW9uIFZmKGEsYixjKXtpZighY3x8bihiKSlzd2l0Y2goYil7Y2FzZSBcInZhbHVlXCI6Y2FzZSBcImNoaWxkX2FkZGVkXCI6Y2FzZSBcImNoaWxkX3JlbW92ZWRcIjpjYXNlIFwiY2hpbGRfY2hhbmdlZFwiOmNhc2UgXCJjaGlsZF9tb3ZlZFwiOmJyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IoeihhLDEsYykrJ211c3QgYmUgYSB2YWxpZCBldmVudCB0eXBlOiBcInZhbHVlXCIsIFwiY2hpbGRfYWRkZWRcIiwgXCJjaGlsZF9yZW1vdmVkXCIsIFwiY2hpbGRfY2hhbmdlZFwiLCBvciBcImNoaWxkX21vdmVkXCIuJyk7fX1mdW5jdGlvbiBXZihhLGIsYyxkKXtpZigoIWR8fG4oYykpJiYhUGYoYykpdGhyb3cgRXJyb3IoeihhLGIsZCkrJ3dhcyBhbiBpbnZhbGlkIGtleTogXCInK2MrJ1wiLiAgRmlyZWJhc2Uga2V5cyBtdXN0IGJlIG5vbi1lbXB0eSBzdHJpbmdzIGFuZCBjYW5cXCd0IGNvbnRhaW4gXCIuXCIsIFwiI1wiLCBcIiRcIiwgXCIvXCIsIFwiW1wiLCBvciBcIl1cIikuJyk7fVxuZnVuY3Rpb24gWGYoYSxiKXtpZighcChiKXx8MD09PWIubGVuZ3RofHxPZi50ZXN0KGIpKXRocm93IEVycm9yKHooYSwxLCExKSsnd2FzIGFuIGludmFsaWQgcGF0aDogXCInK2IrJ1wiLiBQYXRocyBtdXN0IGJlIG5vbi1lbXB0eSBzdHJpbmdzIGFuZCBjYW5cXCd0IGNvbnRhaW4gXCIuXCIsIFwiI1wiLCBcIiRcIiwgXCJbXCIsIG9yIFwiXVwiJyk7fWZ1bmN0aW9uIFlmKGEsYil7aWYoXCIuaW5mb1wiPT09TyhiKSl0aHJvdyBFcnJvcihhK1wiIGZhaWxlZDogQ2FuJ3QgbW9kaWZ5IGRhdGEgdW5kZXIgLy5pbmZvL1wiKTt9ZnVuY3Rpb24gWmYoYSxiKXtpZighcChiKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrXCJtdXN0IGJlIGEgdmFsaWQgY3JlZGVudGlhbCAoYSBzdHJpbmcpLlwiKTt9ZnVuY3Rpb24gJGYoYSxiLGMpe2lmKCFwKGMpKXRocm93IEVycm9yKHooYSxiLCExKStcIm11c3QgYmUgYSB2YWxpZCBzdHJpbmcuXCIpO31cbmZ1bmN0aW9uIGFnKGEsYixjLGQpe2lmKCFkfHxuKGMpKWlmKCFpYShjKXx8bnVsbD09PWMpdGhyb3cgRXJyb3IoeihhLGIsZCkrXCJtdXN0IGJlIGEgdmFsaWQgb2JqZWN0LlwiKTt9ZnVuY3Rpb24gYmcoYSxiLGMpe2lmKCFpYShiKXx8bnVsbD09PWJ8fCF1KGIsYykpdGhyb3cgRXJyb3IoeihhLDEsITEpKydtdXN0IGNvbnRhaW4gdGhlIGtleSBcIicrYysnXCInKTtpZighcCh3KGIsYykpKXRocm93IEVycm9yKHooYSwxLCExKSsnbXVzdCBjb250YWluIHRoZSBrZXkgXCInK2MrJ1wiIHdpdGggdHlwZSBcInN0cmluZ1wiJyk7fTtmdW5jdGlvbiBjZygpe3RoaXMuc2V0PXt9fWg9Y2cucHJvdG90eXBlO2guYWRkPWZ1bmN0aW9uKGEsYil7dGhpcy5zZXRbYV09bnVsbCE9PWI/YjohMH07aC5jb250YWlucz1mdW5jdGlvbihhKXtyZXR1cm4gdSh0aGlzLnNldCxhKX07aC5nZXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY29udGFpbnMoYSk/dGhpcy5zZXRbYV06dm9pZCAwfTtoLnJlbW92ZT1mdW5jdGlvbihhKXtkZWxldGUgdGhpcy5zZXRbYV19O2guY2xlYXI9ZnVuY3Rpb24oKXt0aGlzLnNldD17fX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHdhKHRoaXMuc2V0KX07aC5jb3VudD1mdW5jdGlvbigpe3JldHVybiBwYSh0aGlzLnNldCl9O2Z1bmN0aW9uIGRnKGEsYil7cihhLnNldCxmdW5jdGlvbihhLGQpe2IoZCxhKX0pfWgua2V5cz1mdW5jdGlvbigpe3ZhciBhPVtdO3IodGhpcy5zZXQsZnVuY3Rpb24oYixjKXthLnB1c2goYyl9KTtyZXR1cm4gYX07ZnVuY3Rpb24gcWMoKXt0aGlzLm09dGhpcy5DPW51bGx9cWMucHJvdG90eXBlLmZpbmQ9ZnVuY3Rpb24oYSl7aWYobnVsbCE9dGhpcy5DKXJldHVybiB0aGlzLkMub2EoYSk7aWYoYS5lKCl8fG51bGw9PXRoaXMubSlyZXR1cm4gbnVsbDt2YXIgYj1PKGEpO2E9RyhhKTtyZXR1cm4gdGhpcy5tLmNvbnRhaW5zKGIpP3RoaXMubS5nZXQoYikuZmluZChhKTpudWxsfTtxYy5wcm90b3R5cGUubWM9ZnVuY3Rpb24oYSxiKXtpZihhLmUoKSl0aGlzLkM9Yix0aGlzLm09bnVsbDtlbHNlIGlmKG51bGwhPT10aGlzLkMpdGhpcy5DPXRoaXMuQy5HKGEsYik7ZWxzZXtudWxsPT10aGlzLm0mJih0aGlzLm09bmV3IGNnKTt2YXIgYz1PKGEpO3RoaXMubS5jb250YWlucyhjKXx8dGhpcy5tLmFkZChjLG5ldyBxYyk7Yz10aGlzLm0uZ2V0KGMpO2E9RyhhKTtjLm1jKGEsYil9fTtcbmZ1bmN0aW9uIGVnKGEsYil7aWYoYi5lKCkpcmV0dXJuIGEuQz1udWxsLGEubT1udWxsLCEwO2lmKG51bGwhPT1hLkMpe2lmKGEuQy5OKCkpcmV0dXJuITE7dmFyIGM9YS5DO2EuQz1udWxsO2MuVShNLGZ1bmN0aW9uKGIsYyl7YS5tYyhuZXcgSyhiKSxjKX0pO3JldHVybiBlZyhhLGIpfXJldHVybiBudWxsIT09YS5tPyhjPU8oYiksYj1HKGIpLGEubS5jb250YWlucyhjKSYmZWcoYS5tLmdldChjKSxiKSYmYS5tLnJlbW92ZShjKSxhLm0uZSgpPyhhLm09bnVsbCwhMCk6ITEpOiEwfWZ1bmN0aW9uIHJjKGEsYixjKXtudWxsIT09YS5DP2MoYixhLkMpOmEuVShmdW5jdGlvbihhLGUpe3ZhciBmPW5ldyBLKGIudG9TdHJpbmcoKStcIi9cIithKTtyYyhlLGYsYyl9KX1xYy5wcm90b3R5cGUuVT1mdW5jdGlvbihhKXtudWxsIT09dGhpcy5tJiZkZyh0aGlzLm0sZnVuY3Rpb24oYixjKXthKGIsYyl9KX07dmFyIGZnPVwiYXV0aC5maXJlYmFzZS5jb21cIjtmdW5jdGlvbiBnZyhhLGIsYyl7dGhpcy5sZD1hfHx7fTt0aGlzLmNlPWJ8fHt9O3RoaXMuYWI9Y3x8e307dGhpcy5sZC5yZW1lbWJlcnx8KHRoaXMubGQucmVtZW1iZXI9XCJkZWZhdWx0XCIpfXZhciBoZz1bXCJyZW1lbWJlclwiLFwicmVkaXJlY3RUb1wiXTtmdW5jdGlvbiBpZyhhKXt2YXIgYj17fSxjPXt9O2hiKGF8fHt9LGZ1bmN0aW9uKGEsZSl7MDw9TmEoaGcsYSk/YlthXT1lOmNbYV09ZX0pO3JldHVybiBuZXcgZ2coYix7fSxjKX07ZnVuY3Rpb24gamcoYSxiKXt0aGlzLlBlPVtcInNlc3Npb25cIixhLkxkLGEuQ2JdLmpvaW4oXCI6XCIpO3RoaXMuJGQ9Yn1qZy5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGEsYil7aWYoIWIpaWYodGhpcy4kZC5sZW5ndGgpYj10aGlzLiRkWzBdO2Vsc2UgdGhyb3cgRXJyb3IoXCJmYi5sb2dpbi5TZXNzaW9uTWFuYWdlciA6IE5vIHN0b3JhZ2Ugb3B0aW9ucyBhdmFpbGFibGUhXCIpO2Iuc2V0KHRoaXMuUGUsYSl9O2pnLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKXt2YXIgYT1RYSh0aGlzLiRkLHEodGhpcy5uZyx0aGlzKSksYT1QYShhLGZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT09YX0pO1hhKGEsZnVuY3Rpb24oYSxjKXtyZXR1cm4gYmQoYy50b2tlbiktYmQoYS50b2tlbil9KTtyZXR1cm4gMDxhLmxlbmd0aD9hLnNoaWZ0KCk6bnVsbH07amcucHJvdG90eXBlLm5nPWZ1bmN0aW9uKGEpe3RyeXt2YXIgYj1hLmdldCh0aGlzLlBlKTtpZihiJiZiLnRva2VuKXJldHVybiBifWNhdGNoKGMpe31yZXR1cm4gbnVsbH07XG5qZy5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO09hKHRoaXMuJGQsZnVuY3Rpb24oYil7Yi5yZW1vdmUoYS5QZSl9KX07ZnVuY3Rpb24ga2coKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmISEod2luZG93LmNvcmRvdmF8fHdpbmRvdy5waG9uZWdhcHx8d2luZG93LlBob25lR2FwKSYmL2lvc3xpcGhvbmV8aXBvZHxpcGFkfGFuZHJvaWR8YmxhY2tiZXJyeXxpZW1vYmlsZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCl9ZnVuY3Rpb24gbGcoKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIGxvY2F0aW9uJiYvXmZpbGU6XFwvLy50ZXN0KGxvY2F0aW9uLmhyZWYpfVxuZnVuY3Rpb24gbWcoKXtpZihcInVuZGVmaW5lZFwiPT09dHlwZW9mIG5hdmlnYXRvcilyZXR1cm4hMTt2YXIgYT1uYXZpZ2F0b3IudXNlckFnZW50O2lmKFwiTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyXCI9PT1uYXZpZ2F0b3IuYXBwTmFtZSl7aWYoKGE9YS5tYXRjaCgvTVNJRSAoWzAtOV17MSx9W1xcLjAtOV17MCx9KS8pKSYmMTxhLmxlbmd0aClyZXR1cm4gODw9cGFyc2VGbG9hdChhWzFdKX1lbHNlIGlmKC0xPGEuaW5kZXhPZihcIlRyaWRlbnRcIikmJihhPWEubWF0Y2goL3J2OihbMC05XXsyLDJ9W1xcLjAtOV17MCx9KS8pKSYmMTxhLmxlbmd0aClyZXR1cm4gODw9cGFyc2VGbG9hdChhWzFdKTtyZXR1cm4hMX07ZnVuY3Rpb24gbmcoKXt2YXIgYT13aW5kb3cub3BlbmVyLmZyYW1lcyxiO2ZvcihiPWEubGVuZ3RoLTE7MDw9YjtiLS0pdHJ5e2lmKGFbYl0ubG9jYXRpb24ucHJvdG9jb2w9PT13aW5kb3cubG9jYXRpb24ucHJvdG9jb2wmJmFbYl0ubG9jYXRpb24uaG9zdD09PXdpbmRvdy5sb2NhdGlvbi5ob3N0JiZcIl9fd2luY2hhbl9yZWxheV9mcmFtZVwiPT09YVtiXS5uYW1lKXJldHVybiBhW2JdfWNhdGNoKGMpe31yZXR1cm4gbnVsbH1mdW5jdGlvbiBvZyhhLGIsYyl7YS5hdHRhY2hFdmVudD9hLmF0dGFjaEV2ZW50KFwib25cIitiLGMpOmEuYWRkRXZlbnRMaXN0ZW5lciYmYS5hZGRFdmVudExpc3RlbmVyKGIsYywhMSl9ZnVuY3Rpb24gcGcoYSxiLGMpe2EuZGV0YWNoRXZlbnQ/YS5kZXRhY2hFdmVudChcIm9uXCIrYixjKTphLnJlbW92ZUV2ZW50TGlzdGVuZXImJmEucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLGMsITEpfVxuZnVuY3Rpb24gcWcoYSl7L15odHRwcz86XFwvXFwvLy50ZXN0KGEpfHwoYT13aW5kb3cubG9jYXRpb24uaHJlZik7dmFyIGI9L14oaHR0cHM/OlxcL1xcL1tcXC1fYS16QS1aXFwuMC05Ol0rKS8uZXhlYyhhKTtyZXR1cm4gYj9iWzFdOmF9ZnVuY3Rpb24gcmcoYSl7dmFyIGI9XCJcIjt0cnl7YT1hLnJlcGxhY2UoXCIjXCIsXCJcIik7dmFyIGM9a2IoYSk7YyYmdShjLFwiX19maXJlYmFzZV9yZXF1ZXN0X2tleVwiKSYmKGI9dyhjLFwiX19maXJlYmFzZV9yZXF1ZXN0X2tleVwiKSl9Y2F0Y2goZCl7fXJldHVybiBifWZ1bmN0aW9uIHNnKCl7dmFyIGE9UmMoZmcpO3JldHVybiBhLnNjaGVtZStcIjovL1wiK2EuaG9zdCtcIi92MlwifWZ1bmN0aW9uIHRnKGEpe3JldHVybiBzZygpK1wiL1wiK2ErXCIvYXV0aC9jaGFubmVsXCJ9O2Z1bmN0aW9uIHVnKGEpe3ZhciBiPXRoaXM7dGhpcy56Yz1hO3RoaXMuYWU9XCIqXCI7bWcoKT90aGlzLlFjPXRoaXMud2Q9bmcoKToodGhpcy5RYz13aW5kb3cub3BlbmVyLHRoaXMud2Q9d2luZG93KTtpZighYi5RYyl0aHJvd1wiVW5hYmxlIHRvIGZpbmQgcmVsYXkgZnJhbWVcIjtvZyh0aGlzLndkLFwibWVzc2FnZVwiLHEodGhpcy5oYyx0aGlzKSk7b2codGhpcy53ZCxcIm1lc3NhZ2VcIixxKHRoaXMuQWYsdGhpcykpO3RyeXt2Zyh0aGlzLHthOlwicmVhZHlcIn0pfWNhdGNoKGMpe29nKHRoaXMuUWMsXCJsb2FkXCIsZnVuY3Rpb24oKXt2ZyhiLHthOlwicmVhZHlcIn0pfSl9b2cod2luZG93LFwidW5sb2FkXCIscSh0aGlzLnlnLHRoaXMpKX1mdW5jdGlvbiB2ZyhhLGIpe2I9QihiKTttZygpP2EuUWMuZG9Qb3N0KGIsYS5hZSk6YS5RYy5wb3N0TWVzc2FnZShiLGEuYWUpfVxudWcucHJvdG90eXBlLmhjPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMsYzt0cnl7Yz1tYihhLmRhdGEpfWNhdGNoKGQpe31jJiZcInJlcXVlc3RcIj09PWMuYSYmKHBnKHdpbmRvdyxcIm1lc3NhZ2VcIix0aGlzLmhjKSx0aGlzLmFlPWEub3JpZ2luLHRoaXMuemMmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiLnpjKGIuYWUsYy5kLGZ1bmN0aW9uKGEsYyl7Yi5hZz0hYztiLnpjPXZvaWQgMDt2ZyhiLHthOlwicmVzcG9uc2VcIixkOmEsZm9yY2VLZWVwV2luZG93T3BlbjpjfSl9KX0sMCkpfTt1Zy5wcm90b3R5cGUueWc9ZnVuY3Rpb24oKXt0cnl7cGcodGhpcy53ZCxcIm1lc3NhZ2VcIix0aGlzLkFmKX1jYXRjaChhKXt9dGhpcy56YyYmKHZnKHRoaXMse2E6XCJlcnJvclwiLGQ6XCJ1bmtub3duIGNsb3NlZCB3aW5kb3dcIn0pLHRoaXMuemM9dm9pZCAwKTt0cnl7d2luZG93LmNsb3NlKCl9Y2F0Y2goYil7fX07dWcucHJvdG90eXBlLkFmPWZ1bmN0aW9uKGEpe2lmKHRoaXMuYWcmJlwiZGllXCI9PT1hLmRhdGEpdHJ5e3dpbmRvdy5jbG9zZSgpfWNhdGNoKGIpe319O2Z1bmN0aW9uIHdnKGEpe3RoaXMub2M9R2EoKStHYSgpK0dhKCk7dGhpcy5EZj1hfXdnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYil7UC5zZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIsdGhpcy5vYyk7UC5zZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIsdGhpcy5vYyk7Yi5yZXF1ZXN0SWQ9dGhpcy5vYztiLnJlZGlyZWN0VG89Yi5yZWRpcmVjdFRvfHx3aW5kb3cubG9jYXRpb24uaHJlZjthKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKStqYihiKTt3aW5kb3cubG9jYXRpb249YX07d2cuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hbGcoKSYmIWtnKCl9O3dnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwicmVkaXJlY3RcIn07dmFyIHhnPXtORVRXT1JLX0VSUk9SOlwiVW5hYmxlIHRvIGNvbnRhY3QgdGhlIEZpcmViYXNlIHNlcnZlci5cIixTRVJWRVJfRVJST1I6XCJBbiB1bmtub3duIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIixUUkFOU1BPUlRfVU5BVkFJTEFCTEU6XCJUaGVyZSBhcmUgbm8gbG9naW4gdHJhbnNwb3J0cyBhdmFpbGFibGUgZm9yIHRoZSByZXF1ZXN0ZWQgbWV0aG9kLlwiLFJFUVVFU1RfSU5URVJSVVBURUQ6XCJUaGUgYnJvd3NlciByZWRpcmVjdGVkIHRoZSBwYWdlIGJlZm9yZSB0aGUgbG9naW4gcmVxdWVzdCBjb3VsZCBjb21wbGV0ZS5cIixVU0VSX0NBTkNFTExFRDpcIlRoZSB1c2VyIGNhbmNlbGxlZCBhdXRoZW50aWNhdGlvbi5cIn07ZnVuY3Rpb24geWcoYSl7dmFyIGI9RXJyb3Iodyh4ZyxhKSxhKTtiLmNvZGU9YTtyZXR1cm4gYn07ZnVuY3Rpb24gemcoYSl7aWYoIWEud2luZG93X2ZlYXR1cmVzfHxcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmKC0xIT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiRmVubmVjL1wiKXx8LTEhPT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJGaXJlZm94L1wiKSYmLTEhPT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJBbmRyb2lkXCIpKSlhLndpbmRvd19mZWF0dXJlcz12b2lkIDA7YS53aW5kb3dfbmFtZXx8KGEud2luZG93X25hbWU9XCJfYmxhbmtcIik7dGhpcy5vcHRpb25zPWF9XG56Zy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZChhKXtnJiYoZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChnKSxnPXZvaWQgMCk7diYmKHY9Y2xlYXJJbnRlcnZhbCh2KSk7cGcod2luZG93LFwibWVzc2FnZVwiLGUpO3BnKHdpbmRvdyxcInVubG9hZFwiLGQpO2lmKG0mJiFhKXRyeXttLmNsb3NlKCl9Y2F0Y2goYil7ay5wb3N0TWVzc2FnZShcImRpZVwiLGwpfW09az12b2lkIDB9ZnVuY3Rpb24gZShhKXtpZihhLm9yaWdpbj09PWwpdHJ5e3ZhciBiPW1iKGEuZGF0YSk7XCJyZWFkeVwiPT09Yi5hP2sucG9zdE1lc3NhZ2UoeSxsKTpcImVycm9yXCI9PT1iLmE/KGQoITEpLGMmJihjKGIuZCksYz1udWxsKSk6XCJyZXNwb25zZVwiPT09Yi5hJiYoZChiLmZvcmNlS2VlcFdpbmRvd09wZW4pLGMmJihjKG51bGwsYi5kKSxjPW51bGwpKX1jYXRjaChlKXt9fXZhciBmPW1nKCksZyxrO2lmKCF0aGlzLm9wdGlvbnMucmVsYXlfdXJsKXJldHVybiBjKEVycm9yKFwiaW52YWxpZCBhcmd1bWVudHM6IG9yaWdpbiBvZiB1cmwgYW5kIHJlbGF5X3VybCBtdXN0IG1hdGNoXCIpKTtcbnZhciBsPXFnKGEpO2lmKGwhPT1xZyh0aGlzLm9wdGlvbnMucmVsYXlfdXJsKSljJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YyhFcnJvcihcImludmFsaWQgYXJndW1lbnRzOiBvcmlnaW4gb2YgdXJsIGFuZCByZWxheV91cmwgbXVzdCBtYXRjaFwiKSl9LDApO2Vsc2V7ZiYmKGc9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKSxnLnNldEF0dHJpYnV0ZShcInNyY1wiLHRoaXMub3B0aW9ucy5yZWxheV91cmwpLGcuc3R5bGUuZGlzcGxheT1cIm5vbmVcIixnLnNldEF0dHJpYnV0ZShcIm5hbWVcIixcIl9fd2luY2hhbl9yZWxheV9mcmFtZVwiKSxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGcpLGs9Zy5jb250ZW50V2luZG93KTthKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKStqYihiKTt2YXIgbT13aW5kb3cub3BlbihhLHRoaXMub3B0aW9ucy53aW5kb3dfbmFtZSx0aGlzLm9wdGlvbnMud2luZG93X2ZlYXR1cmVzKTtrfHwoaz1tKTt2YXIgdj1zZXRJbnRlcnZhbChmdW5jdGlvbigpe20mJm0uY2xvc2VkJiZcbihkKCExKSxjJiYoYyh5ZyhcIlVTRVJfQ0FOQ0VMTEVEXCIpKSxjPW51bGwpKX0sNTAwKSx5PUIoe2E6XCJyZXF1ZXN0XCIsZDpifSk7b2cod2luZG93LFwidW5sb2FkXCIsZCk7b2cod2luZG93LFwibWVzc2FnZVwiLGUpfX07XG56Zy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVyblwicG9zdE1lc3NhZ2VcImluIHdpbmRvdyYmIWxnKCkmJiEoa2coKXx8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJihuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lLyl8fHdpbmRvdy5XaW5kb3dzJiYvXm1zLWFwcHg6Ly50ZXN0KGxvY2F0aW9uLmhyZWYpKXx8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJlwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiYobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKGlQaG9uZXxpUG9kfGlQYWQpLipBcHBsZVdlYktpdCg/IS4qU2FmYXJpKS9pKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQ3JpT1MvKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHdpdHRlciBmb3IgaVBob25lLyl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0ZCQU5cXC9GQklPUy8pfHx3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSYmIShcInVuZGVmaW5lZFwiIT09XG50eXBlb2YgbmF2aWdhdG9yJiZuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9QaGFudG9tSlMvKSl9O3pnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwicG9wdXBcIn07ZnVuY3Rpb24gQWcoYSl7YS5tZXRob2R8fChhLm1ldGhvZD1cIkdFVFwiKTthLmhlYWRlcnN8fChhLmhlYWRlcnM9e30pO2EuaGVhZGVycy5jb250ZW50X3R5cGV8fChhLmhlYWRlcnMuY29udGVudF90eXBlPVwiYXBwbGljYXRpb24vanNvblwiKTthLmhlYWRlcnMuY29udGVudF90eXBlPWEuaGVhZGVycy5jb250ZW50X3R5cGUudG9Mb3dlckNhc2UoKTt0aGlzLm9wdGlvbnM9YX1cbkFnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKCl7YyYmKGMoeWcoXCJSRVFVRVNUX0lOVEVSUlVQVEVEXCIpKSxjPW51bGwpfXZhciBlPW5ldyBYTUxIdHRwUmVxdWVzdCxmPXRoaXMub3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKSxnO29nKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpO2Uub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7aWYoYyYmND09PWUucmVhZHlTdGF0ZSl7dmFyIGE7aWYoMjAwPD1lLnN0YXR1cyYmMzAwPmUuc3RhdHVzKXt0cnl7YT1tYihlLnJlc3BvbnNlVGV4dCl9Y2F0Y2goYil7fWMobnVsbCxhKX1lbHNlIDUwMDw9ZS5zdGF0dXMmJjYwMD5lLnN0YXR1cz9jKHlnKFwiU0VSVkVSX0VSUk9SXCIpKTpjKHlnKFwiTkVUV09SS19FUlJPUlwiKSk7Yz1udWxsO3BnKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpfX07aWYoXCJHRVRcIj09PWYpYSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikramIoYiksZz1udWxsO2Vsc2V7dmFyIGs9dGhpcy5vcHRpb25zLmhlYWRlcnMuY29udGVudF90eXBlO1xuXCJhcHBsaWNhdGlvbi9qc29uXCI9PT1rJiYoZz1CKGIpKTtcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiPT09ayYmKGc9amIoYikpfWUub3BlbihmLGEsITApO2E9e1wiWC1SZXF1ZXN0ZWQtV2l0aFwiOlwiWE1MSHR0cFJlcXVlc3RcIixBY2NlcHQ6XCJhcHBsaWNhdGlvbi9qc29uO3RleHQvcGxhaW5cIn07emEoYSx0aGlzLm9wdGlvbnMuaGVhZGVycyk7Zm9yKHZhciBsIGluIGEpZS5zZXRSZXF1ZXN0SGVhZGVyKGwsYVtsXSk7ZS5zZW5kKGcpfTtBZy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiEhd2luZG93LlhNTEh0dHBSZXF1ZXN0JiZcInN0cmluZ1wiPT09dHlwZW9mKG5ldyBYTUxIdHRwUmVxdWVzdCkucmVzcG9uc2VUeXBlJiYoIShcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUvKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC8pKSl8fG1nKCkpfTtBZy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cImpzb25cIn07ZnVuY3Rpb24gQmcoYSl7dGhpcy5vYz1HYSgpK0dhKCkrR2EoKTt0aGlzLkRmPWF9XG5CZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKHlnKFwiVVNFUl9DQU5DRUxMRURcIikpLGM9bnVsbCl9dmFyIGU9dGhpcyxmPVJjKGZnKSxnO2IucmVxdWVzdElkPXRoaXMub2M7Yi5yZWRpcmVjdFRvPWYuc2NoZW1lK1wiOi8vXCIrZi5ob3N0K1wiL2JsYW5rL3BhZ2UuaHRtbFwiO2ErPS9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIjthKz1qYihiKTsoZz13aW5kb3cub3BlbihhLFwiX2JsYW5rXCIsXCJsb2NhdGlvbj1ub1wiKSkmJmhhKGcuYWRkRXZlbnRMaXN0ZW5lcik/KGcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRzdGFydFwiLGZ1bmN0aW9uKGEpe3ZhciBiO2lmKGI9YSYmYS51cmwpYTp7dHJ5e3ZhciBtPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO20uaHJlZj1hLnVybDtiPW0uaG9zdD09PWYuaG9zdCYmXCIvYmxhbmsvcGFnZS5odG1sXCI9PT1tLnBhdGhuYW1lO2JyZWFrIGF9Y2F0Y2godil7fWI9ITF9YiYmKGE9cmcoYS51cmwpLGcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImV4aXRcIixcbmQpLGcuY2xvc2UoKSxhPW5ldyBnZyhudWxsLG51bGwse3JlcXVlc3RJZDplLm9jLHJlcXVlc3RLZXk6YX0pLGUuRGYucmVxdWVzdFdpdGhDcmVkZW50aWFsKFwiL2F1dGgvc2Vzc2lvblwiLGEsYyksYz1udWxsKX0pLGcuYWRkRXZlbnRMaXN0ZW5lcihcImV4aXRcIixkKSk6Yyh5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9O0JnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuIGtnKCl9O0JnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwicmVkaXJlY3RcIn07ZnVuY3Rpb24gQ2coYSl7YS5jYWxsYmFja19wYXJhbWV0ZXJ8fChhLmNhbGxiYWNrX3BhcmFtZXRlcj1cImNhbGxiYWNrXCIpO3RoaXMub3B0aW9ucz1hO3dpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnA9d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucHx8e319XG5DZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKHlnKFwiUkVRVUVTVF9JTlRFUlJVUFRFRFwiKSksYz1udWxsKX1mdW5jdGlvbiBlKCl7c2V0VGltZW91dChmdW5jdGlvbigpe3dpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnBbZl09dm9pZCAwO3dhKHdpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnApJiYod2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucD12b2lkIDApO3RyeXt2YXIgYT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChmKTthJiZhLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYSl9Y2F0Y2goYil7fX0sMSk7cGcod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCl9dmFyIGY9XCJmblwiKyhuZXcgRGF0ZSkuZ2V0VGltZSgpK01hdGguZmxvb3IoOTk5OTkqTWF0aC5yYW5kb20oKSk7Ylt0aGlzLm9wdGlvbnMuY2FsbGJhY2tfcGFyYW1ldGVyXT1cIl9fZmlyZWJhc2VfYXV0aF9qc29ucC5cIitmO2ErPSgvXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCIpK2piKGIpO1xub2cod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCk7d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucFtmXT1mdW5jdGlvbihhKXtjJiYoYyhudWxsLGEpLGM9bnVsbCk7ZSgpfTtEZyhmLGEsYyl9O1xuZnVuY3Rpb24gRGcoYSxiLGMpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0cnl7dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtkLnR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIjtkLmlkPWE7ZC5hc3luYz0hMDtkLnNyYz1iO2Qub25lcnJvcj1mdW5jdGlvbigpe3ZhciBiPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGEpO251bGwhPT1iJiZiLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYik7YyYmYyh5ZyhcIk5FVFdPUktfRVJST1JcIikpfTt2YXIgZT1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIik7KGUmJjAhPWUubGVuZ3RoP2VbMF06ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZChkKX1jYXRjaChmKXtjJiZjKHlnKFwiTkVUV09SS19FUlJPUlwiKSl9fSwwKX1DZy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiEwfTtDZy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cImpzb25cIn07ZnVuY3Rpb24gRWcoYSxiLGMsZCl7SWYuY2FsbCh0aGlzLFtcImF1dGhfc3RhdHVzXCJdKTt0aGlzLkg9YTt0aGlzLmRmPWI7dGhpcy5TZz1jO3RoaXMuS2U9ZDt0aGlzLnJjPW5ldyBqZyhhLFtEYyxQXSk7dGhpcy5uYj1udWxsO3RoaXMuUmU9ITE7RmcodGhpcyl9bWEoRWcsSWYpO2g9RWcucHJvdG90eXBlO2gud2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uYnx8bnVsbH07ZnVuY3Rpb24gRmcoYSl7UC5nZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIpJiZHZyhhKTt2YXIgYj1hLnJjLmdldCgpO2ImJmIudG9rZW4/KEhnKGEsYiksYS5kZihiLnRva2VuLGZ1bmN0aW9uKGMsZCl7SWcoYSxjLGQsITEsYi50b2tlbixiKX0sZnVuY3Rpb24oYixkKXtKZyhhLFwicmVzdW1lU2Vzc2lvbigpXCIsYixkKX0pKTpIZyhhLG51bGwpfVxuZnVuY3Rpb24gS2coYSxiLGMsZCxlLGYpe1wiZmlyZWJhc2Vpby1kZW1vLmNvbVwiPT09YS5ILmRvbWFpbiYmUShcIkZpcmViYXNlIGF1dGhlbnRpY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgb24gZGVtbyBGaXJlYmFzZXMgKCouZmlyZWJhc2Vpby1kZW1vLmNvbSkuIFRvIHNlY3VyZSB5b3VyIEZpcmViYXNlLCBjcmVhdGUgYSBwcm9kdWN0aW9uIEZpcmViYXNlIGF0IGh0dHBzOi8vd3d3LmZpcmViYXNlLmNvbS5cIik7YS5kZihiLGZ1bmN0aW9uKGYsayl7SWcoYSxmLGssITAsYixjLGR8fHt9LGUpfSxmdW5jdGlvbihiLGMpe0pnKGEsXCJhdXRoKClcIixiLGMsZil9KX1mdW5jdGlvbiBMZyhhLGIpe2EucmMuY2xlYXIoKTtIZyhhLG51bGwpO2EuU2coZnVuY3Rpb24oYSxkKXtpZihcIm9rXCI9PT1hKVIoYixudWxsKTtlbHNle3ZhciBlPShhfHxcImVycm9yXCIpLnRvVXBwZXJDYXNlKCksZj1lO2QmJihmKz1cIjogXCIrZCk7Zj1FcnJvcihmKTtmLmNvZGU9ZTtSKGIsZil9fSl9XG5mdW5jdGlvbiBJZyhhLGIsYyxkLGUsZixnLGspe1wib2tcIj09PWI/KGQmJihiPWMuYXV0aCxmLmF1dGg9YixmLmV4cGlyZXM9Yy5leHBpcmVzLGYudG9rZW49Y2QoZSk/ZTpcIlwiLGM9bnVsbCxiJiZ1KGIsXCJ1aWRcIik/Yz13KGIsXCJ1aWRcIik6dShmLFwidWlkXCIpJiYoYz13KGYsXCJ1aWRcIikpLGYudWlkPWMsYz1cImN1c3RvbVwiLGImJnUoYixcInByb3ZpZGVyXCIpP2M9dyhiLFwicHJvdmlkZXJcIik6dShmLFwicHJvdmlkZXJcIikmJihjPXcoZixcInByb3ZpZGVyXCIpKSxmLnByb3ZpZGVyPWMsYS5yYy5jbGVhcigpLGNkKGUpJiYoZz1nfHx7fSxjPURjLFwic2Vzc2lvbk9ubHlcIj09PWcucmVtZW1iZXImJihjPVApLFwibm9uZVwiIT09Zy5yZW1lbWJlciYmYS5yYy5zZXQoZixjKSksSGcoYSxmKSksUihrLG51bGwsZikpOihhLnJjLmNsZWFyKCksSGcoYSxudWxsKSxmPWE9KGJ8fFwiZXJyb3JcIikudG9VcHBlckNhc2UoKSxjJiYoZis9XCI6IFwiK2MpLGY9RXJyb3IoZiksZi5jb2RlPWEsUihrLGYpKX1cbmZ1bmN0aW9uIEpnKGEsYixjLGQsZSl7UShiK1wiIHdhcyBjYW5jZWxlZDogXCIrZCk7YS5yYy5jbGVhcigpO0hnKGEsbnVsbCk7YT1FcnJvcihkKTthLmNvZGU9Yy50b1VwcGVyQ2FzZSgpO1IoZSxhKX1mdW5jdGlvbiBNZyhhLGIsYyxkLGUpe05nKGEpO2M9bmV3IGdnKGR8fHt9LHt9LGN8fHt9KTtPZyhhLFtBZyxDZ10sXCIvYXV0aC9cIitiLGMsZSl9XG5mdW5jdGlvbiBQZyhhLGIsYyxkKXtOZyhhKTt2YXIgZT1bemcsQmddO2M9aWcoYyk7XCJhbm9ueW1vdXNcIj09PWJ8fFwicGFzc3dvcmRcIj09PWI/c2V0VGltZW91dChmdW5jdGlvbigpe1IoZCx5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9LDApOihjLmNlLndpbmRvd19mZWF0dXJlcz1cIm1lbnViYXI9eWVzLG1vZGFsPXllcyxhbHdheXNSYWlzZWQ9eWVzbG9jYXRpb249eWVzLHJlc2l6YWJsZT15ZXMsc2Nyb2xsYmFycz15ZXMsc3RhdHVzPXllcyxoZWlnaHQ9NjI1LHdpZHRoPTYyNSx0b3A9XCIrKFwib2JqZWN0XCI9PT10eXBlb2Ygc2NyZWVuPy41KihzY3JlZW4uaGVpZ2h0LTYyNSk6MCkrXCIsbGVmdD1cIisoXCJvYmplY3RcIj09PXR5cGVvZiBzY3JlZW4/LjUqKHNjcmVlbi53aWR0aC02MjUpOjApLGMuY2UucmVsYXlfdXJsPXRnKGEuSC5DYiksYy5jZS5yZXF1ZXN0V2l0aENyZWRlbnRpYWw9cShhLnBjLGEpLE9nKGEsZSxcIi9hdXRoL1wiK2IsYyxkKSl9XG5mdW5jdGlvbiBHZyhhKXt2YXIgYj1QLmdldChcInJlZGlyZWN0X3JlcXVlc3RfaWRcIik7aWYoYil7dmFyIGM9UC5nZXQoXCJyZWRpcmVjdF9jbGllbnRfb3B0aW9uc1wiKTtQLnJlbW92ZShcInJlZGlyZWN0X3JlcXVlc3RfaWRcIik7UC5yZW1vdmUoXCJyZWRpcmVjdF9jbGllbnRfb3B0aW9uc1wiKTt2YXIgZD1bQWcsQ2ddLGI9e3JlcXVlc3RJZDpiLHJlcXVlc3RLZXk6cmcoZG9jdW1lbnQubG9jYXRpb24uaGFzaCl9LGM9bmV3IGdnKGMse30sYik7YS5SZT0hMDt0cnl7ZG9jdW1lbnQubG9jYXRpb24uaGFzaD1kb2N1bWVudC5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoLyZfX2ZpcmViYXNlX3JlcXVlc3Rfa2V5PShbYS16QS16MC05XSopLyxcIlwiKX1jYXRjaChlKXt9T2coYSxkLFwiL2F1dGgvc2Vzc2lvblwiLGMsZnVuY3Rpb24oKXt0aGlzLlJlPSExfS5iaW5kKGEpKX19XG5oLnJlPWZ1bmN0aW9uKGEsYil7TmcodGhpcyk7dmFyIGM9aWcoYSk7Yy5hYi5fbWV0aG9kPVwiUE9TVFwiO3RoaXMucGMoXCIvdXNlcnNcIixjLGZ1bmN0aW9uKGEsYyl7YT9SKGIsYSk6UihiLGEsYyl9KX07aC5TZT1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7TmcodGhpcyk7dmFyIGQ9XCIvdXNlcnMvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGEuZW1haWwpLGU9aWcoYSk7ZS5hYi5fbWV0aG9kPVwiREVMRVRFXCI7dGhpcy5wYyhkLGUsZnVuY3Rpb24oYSxkKXshYSYmZCYmZC51aWQmJmMubmImJmMubmIudWlkJiZjLm5iLnVpZD09PWQudWlkJiZMZyhjKTtSKGIsYSl9KX07aC5vZT1mdW5jdGlvbihhLGIpe05nKHRoaXMpO3ZhciBjPVwiL3VzZXJzL1wiK2VuY29kZVVSSUNvbXBvbmVudChhLmVtYWlsKStcIi9wYXNzd29yZFwiLGQ9aWcoYSk7ZC5hYi5fbWV0aG9kPVwiUFVUXCI7ZC5hYi5wYXNzd29yZD1hLm5ld1Bhc3N3b3JkO3RoaXMucGMoYyxkLGZ1bmN0aW9uKGEpe1IoYixhKX0pfTtcbmgubmU9ZnVuY3Rpb24oYSxiKXtOZyh0aGlzKTt2YXIgYz1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5vbGRFbWFpbCkrXCIvZW1haWxcIixkPWlnKGEpO2QuYWIuX21ldGhvZD1cIlBVVFwiO2QuYWIuZW1haWw9YS5uZXdFbWFpbDtkLmFiLnBhc3N3b3JkPWEucGFzc3dvcmQ7dGhpcy5wYyhjLGQsZnVuY3Rpb24oYSl7UihiLGEpfSl9O2guVWU9ZnVuY3Rpb24oYSxiKXtOZyh0aGlzKTt2YXIgYz1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5lbWFpbCkrXCIvcGFzc3dvcmRcIixkPWlnKGEpO2QuYWIuX21ldGhvZD1cIlBPU1RcIjt0aGlzLnBjKGMsZCxmdW5jdGlvbihhKXtSKGIsYSl9KX07aC5wYz1mdW5jdGlvbihhLGIsYyl7UWcodGhpcyxbQWcsQ2ddLGEsYixjKX07XG5mdW5jdGlvbiBPZyhhLGIsYyxkLGUpe1FnKGEsYixjLGQsZnVuY3Rpb24oYixjKXshYiYmYyYmYy50b2tlbiYmYy51aWQ/S2coYSxjLnRva2VuLGMsZC5sZCxmdW5jdGlvbihhLGIpe2E/UihlLGEpOlIoZSxudWxsLGIpfSk6UihlLGJ8fHlnKFwiVU5LTk9XTl9FUlJPUlwiKSl9KX1cbmZ1bmN0aW9uIFFnKGEsYixjLGQsZSl7Yj1QYShiLGZ1bmN0aW9uKGEpe3JldHVyblwiZnVuY3Rpb25cIj09PXR5cGVvZiBhLmlzQXZhaWxhYmxlJiZhLmlzQXZhaWxhYmxlKCl9KTswPT09Yi5sZW5ndGg/c2V0VGltZW91dChmdW5jdGlvbigpe1IoZSx5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9LDApOihiPW5ldyAoYi5zaGlmdCgpKShkLmNlKSxkPWliKGQuYWIpLGQudj1cImpzLTIuMi40XCIsZC50cmFuc3BvcnQ9Yi5CYygpLGQuc3VwcHJlc3Nfc3RhdHVzX2NvZGVzPSEwLGE9c2coKStcIi9cIithLkguQ2IrYyxiLm9wZW4oYSxkLGZ1bmN0aW9uKGEsYil7aWYoYSlSKGUsYSk7ZWxzZSBpZihiJiZiLmVycm9yKXt2YXIgYz1FcnJvcihiLmVycm9yLm1lc3NhZ2UpO2MuY29kZT1iLmVycm9yLmNvZGU7Yy5kZXRhaWxzPWIuZXJyb3IuZGV0YWlscztSKGUsYyl9ZWxzZSBSKGUsbnVsbCxiKX0pKX1cbmZ1bmN0aW9uIEhnKGEsYil7dmFyIGM9bnVsbCE9PWEubmJ8fG51bGwhPT1iO2EubmI9YjtjJiZhLmRlKFwiYXV0aF9zdGF0dXNcIixiKTthLktlKG51bGwhPT1iKX1oLnplPWZ1bmN0aW9uKGEpe0ooXCJhdXRoX3N0YXR1c1wiPT09YSwnaW5pdGlhbCBldmVudCBtdXN0IGJlIG9mIHR5cGUgXCJhdXRoX3N0YXR1c1wiJyk7cmV0dXJuIHRoaXMuUmU/bnVsbDpbdGhpcy5uYl19O2Z1bmN0aW9uIE5nKGEpe3ZhciBiPWEuSDtpZihcImZpcmViYXNlaW8uY29tXCIhPT1iLmRvbWFpbiYmXCJmaXJlYmFzZWlvLWRlbW8uY29tXCIhPT1iLmRvbWFpbiYmXCJhdXRoLmZpcmViYXNlLmNvbVwiPT09ZmcpdGhyb3cgRXJyb3IoXCJUaGlzIGN1c3RvbSBGaXJlYmFzZSBzZXJ2ZXIgKCdcIithLkguZG9tYWluK1wiJykgZG9lcyBub3Qgc3VwcG9ydCBkZWxlZ2F0ZWQgbG9naW4uXCIpO307ZnVuY3Rpb24gUmcoYSl7dGhpcy5oYz1hO3RoaXMuS2Q9W107dGhpcy5RYj0wO3RoaXMucGU9LTE7dGhpcy5GYj1udWxsfWZ1bmN0aW9uIFNnKGEsYixjKXthLnBlPWI7YS5GYj1jO2EucGU8YS5RYiYmKGEuRmIoKSxhLkZiPW51bGwpfWZ1bmN0aW9uIFRnKGEsYixjKXtmb3IoYS5LZFtiXT1jO2EuS2RbYS5RYl07KXt2YXIgZD1hLktkW2EuUWJdO2RlbGV0ZSBhLktkW2EuUWJdO2Zvcih2YXIgZT0wO2U8ZC5sZW5ndGg7KytlKWlmKGRbZV0pe3ZhciBmPWE7Q2IoZnVuY3Rpb24oKXtmLmhjKGRbZV0pfSl9aWYoYS5RYj09PWEucGUpe2EuRmImJihjbGVhclRpbWVvdXQoYS5GYiksYS5GYigpLGEuRmI9bnVsbCk7YnJlYWt9YS5RYisrfX07ZnVuY3Rpb24gVWcoYSxiLGMpe3RoaXMucWU9YTt0aGlzLmY9T2MoYSk7dGhpcy5vYj10aGlzLnBiPTA7dGhpcy5WYT1PYihiKTt0aGlzLlZkPWM7dGhpcy5HYz0hMTt0aGlzLmdkPWZ1bmN0aW9uKGEpe2IuaG9zdCE9PWIuT2EmJihhLm5zPWIuQ2IpO3ZhciBjPVtdLGY7Zm9yKGYgaW4gYSlhLmhhc093blByb3BlcnR5KGYpJiZjLnB1c2goZitcIj1cIithW2ZdKTtyZXR1cm4oYi5sYj9cImh0dHBzOi8vXCI6XCJodHRwOi8vXCIpK2IuT2ErXCIvLmxwP1wiK2Muam9pbihcIiZcIil9fXZhciBWZyxXZztcblVnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYil7dGhpcy5nZj0wO3RoaXMua2E9Yjt0aGlzLnpmPW5ldyBSZyhhKTt0aGlzLnpiPSExO3ZhciBjPXRoaXM7dGhpcy5yYj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yy5mKFwiVGltZWQgb3V0IHRyeWluZyB0byBjb25uZWN0LlwiKTtjLmliKCk7Yy5yYj1udWxsfSxNYXRoLmZsb29yKDNFNCkpO1RjKGZ1bmN0aW9uKCl7aWYoIWMuemIpe2MuVGE9bmV3IFhnKGZ1bmN0aW9uKGEsYixkLGssbCl7WWcoYyxhcmd1bWVudHMpO2lmKGMuVGEpaWYoYy5yYiYmKGNsZWFyVGltZW91dChjLnJiKSxjLnJiPW51bGwpLGMuR2M9ITAsXCJzdGFydFwiPT1hKWMuaWQ9YixjLkZmPWQ7ZWxzZSBpZihcImNsb3NlXCI9PT1hKWI/KGMuVGEuVGQ9ITEsU2coYy56ZixiLGZ1bmN0aW9uKCl7Yy5pYigpfSkpOmMuaWIoKTtlbHNlIHRocm93IEVycm9yKFwiVW5yZWNvZ25pemVkIGNvbW1hbmQgcmVjZWl2ZWQ6IFwiK2EpO30sZnVuY3Rpb24oYSxiKXtZZyhjLGFyZ3VtZW50cyk7XG5UZyhjLnpmLGEsYil9LGZ1bmN0aW9uKCl7Yy5pYigpfSxjLmdkKTt2YXIgYT17c3RhcnQ6XCJ0XCJ9O2Euc2VyPU1hdGguZmxvb3IoMUU4Kk1hdGgucmFuZG9tKCkpO2MuVGEuZmUmJihhLmNiPWMuVGEuZmUpO2Eudj1cIjVcIjtjLlZkJiYoYS5zPWMuVmQpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgbG9jYXRpb24mJmxvY2F0aW9uLmhyZWYmJi0xIT09bG9jYXRpb24uaHJlZi5pbmRleE9mKFwiZmlyZWJhc2Vpby5jb21cIikmJihhLnI9XCJmXCIpO2E9Yy5nZChhKTtjLmYoXCJDb25uZWN0aW5nIHZpYSBsb25nLXBvbGwgdG8gXCIrYSk7WmcoYy5UYSxhLGZ1bmN0aW9uKCl7fSl9fSl9O1xuVWcucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5UYSxiPXRoaXMuRmY7YS5yZz10aGlzLmlkO2Euc2c9Yjtmb3IoYS5rZT0hMDskZyhhKTspO2E9dGhpcy5pZDtiPXRoaXMuRmY7dGhpcy5mYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO3ZhciBjPXtkZnJhbWU6XCJ0XCJ9O2MuaWQ9YTtjLnB3PWI7dGhpcy5mYy5zcmM9dGhpcy5nZChjKTt0aGlzLmZjLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmZjKX07VWcuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hV2cmJiEoXCJvYmplY3RcIj09PXR5cGVvZiB3aW5kb3cmJndpbmRvdy5jaHJvbWUmJndpbmRvdy5jaHJvbWUuZXh0ZW5zaW9uJiYhL15jaHJvbWUvLnRlc3Qod2luZG93LmxvY2F0aW9uLmhyZWYpKSYmIShcIm9iamVjdFwiPT09dHlwZW9mIFdpbmRvd3MmJlwib2JqZWN0XCI9PT10eXBlb2YgV2luZG93cy5VZykmJihWZ3x8ITApfTtoPVVnLnByb3RvdHlwZTtcbmguQmQ9ZnVuY3Rpb24oKXt9O2guY2Q9ZnVuY3Rpb24oKXt0aGlzLnpiPSEwO3RoaXMuVGEmJih0aGlzLlRhLmNsb3NlKCksdGhpcy5UYT1udWxsKTt0aGlzLmZjJiYoZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmZjKSx0aGlzLmZjPW51bGwpO3RoaXMucmImJihjbGVhclRpbWVvdXQodGhpcy5yYiksdGhpcy5yYj1udWxsKX07aC5pYj1mdW5jdGlvbigpe3RoaXMuemJ8fCh0aGlzLmYoXCJMb25ncG9sbCBpcyBjbG9zaW5nIGl0c2VsZlwiKSx0aGlzLmNkKCksdGhpcy5rYSYmKHRoaXMua2EodGhpcy5HYyksdGhpcy5rYT1udWxsKSl9O2guY2xvc2U9ZnVuY3Rpb24oKXt0aGlzLnpifHwodGhpcy5mKFwiTG9uZ3BvbGwgaXMgYmVpbmcgY2xvc2VkLlwiKSx0aGlzLmNkKCkpfTtcbmguc2VuZD1mdW5jdGlvbihhKXthPUIoYSk7dGhpcy5wYis9YS5sZW5ndGg7TGIodGhpcy5WYSxcImJ5dGVzX3NlbnRcIixhLmxlbmd0aCk7YT1LYyhhKTthPWZiKGEsITApO2E9WGMoYSwxODQwKTtmb3IodmFyIGI9MDtiPGEubGVuZ3RoO2IrKyl7dmFyIGM9dGhpcy5UYTtjLiRjLnB1c2goe0pnOnRoaXMuZ2YsUmc6YS5sZW5ndGgsamY6YVtiXX0pO2Mua2UmJiRnKGMpO3RoaXMuZ2YrK319O2Z1bmN0aW9uIFlnKGEsYil7dmFyIGM9QihiKS5sZW5ndGg7YS5vYis9YztMYihhLlZhLFwiYnl0ZXNfcmVjZWl2ZWRcIixjKX1cbmZ1bmN0aW9uIFhnKGEsYixjLGQpe3RoaXMuZ2Q9ZDt0aGlzLmpiPWM7dGhpcy5PZT1uZXcgY2c7dGhpcy4kYz1bXTt0aGlzLnNlPU1hdGguZmxvb3IoMUU4Kk1hdGgucmFuZG9tKCkpO3RoaXMuVGQ9ITA7dGhpcy5mZT1HYygpO3dpbmRvd1tcInBMUENvbW1hbmRcIit0aGlzLmZlXT1hO3dpbmRvd1tcInBSVExQQ0JcIit0aGlzLmZlXT1iO2E9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTthLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7aWYoZG9jdW1lbnQuYm9keSl7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTt0cnl7YS5jb250ZW50V2luZG93LmRvY3VtZW50fHxCYihcIk5vIElFIGRvbWFpbiBzZXR0aW5nIHJlcXVpcmVkXCIpfWNhdGNoKGUpe2Euc3JjPVwiamF2YXNjcmlwdDp2b2lkKChmdW5jdGlvbigpe2RvY3VtZW50Lm9wZW4oKTtkb2N1bWVudC5kb21haW49J1wiK2RvY3VtZW50LmRvbWFpbitcIic7ZG9jdW1lbnQuY2xvc2UoKTt9KSgpKVwifX1lbHNlIHRocm93XCJEb2N1bWVudCBib2R5IGhhcyBub3QgaW5pdGlhbGl6ZWQuIFdhaXQgdG8gaW5pdGlhbGl6ZSBGaXJlYmFzZSB1bnRpbCBhZnRlciB0aGUgZG9jdW1lbnQgaXMgcmVhZHkuXCI7XG5hLmNvbnRlbnREb2N1bWVudD9hLmdiPWEuY29udGVudERvY3VtZW50OmEuY29udGVudFdpbmRvdz9hLmdiPWEuY29udGVudFdpbmRvdy5kb2N1bWVudDphLmRvY3VtZW50JiYoYS5nYj1hLmRvY3VtZW50KTt0aGlzLkNhPWE7YT1cIlwiO3RoaXMuQ2Euc3JjJiZcImphdmFzY3JpcHQ6XCI9PT10aGlzLkNhLnNyYy5zdWJzdHIoMCwxMSkmJihhPSc8c2NyaXB0PmRvY3VtZW50LmRvbWFpbj1cIicrZG9jdW1lbnQuZG9tYWluKydcIjtcXHgzYy9zY3JpcHQ+Jyk7YT1cIjxodG1sPjxib2R5PlwiK2ErXCI8L2JvZHk+PC9odG1sPlwiO3RyeXt0aGlzLkNhLmdiLm9wZW4oKSx0aGlzLkNhLmdiLndyaXRlKGEpLHRoaXMuQ2EuZ2IuY2xvc2UoKX1jYXRjaChmKXtCYihcImZyYW1lIHdyaXRpbmcgZXhjZXB0aW9uXCIpLGYuc3RhY2smJkJiKGYuc3RhY2spLEJiKGYpfX1cblhnLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3RoaXMua2U9ITE7aWYodGhpcy5DYSl7dGhpcy5DYS5nYi5ib2R5LmlubmVySFRNTD1cIlwiO3ZhciBhPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe251bGwhPT1hLkNhJiYoZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhLkNhKSxhLkNhPW51bGwpfSxNYXRoLmZsb29yKDApKX12YXIgYj10aGlzLmpiO2ImJih0aGlzLmpiPW51bGwsYigpKX07XG5mdW5jdGlvbiAkZyhhKXtpZihhLmtlJiZhLlRkJiZhLk9lLmNvdW50KCk8KDA8YS4kYy5sZW5ndGg/MjoxKSl7YS5zZSsrO3ZhciBiPXt9O2IuaWQ9YS5yZztiLnB3PWEuc2c7Yi5zZXI9YS5zZTtmb3IodmFyIGI9YS5nZChiKSxjPVwiXCIsZD0wOzA8YS4kYy5sZW5ndGg7KWlmKDE4NzA+PWEuJGNbMF0uamYubGVuZ3RoKzMwK2MubGVuZ3RoKXt2YXIgZT1hLiRjLnNoaWZ0KCksYz1jK1wiJnNlZ1wiK2QrXCI9XCIrZS5KZytcIiZ0c1wiK2QrXCI9XCIrZS5SZytcIiZkXCIrZCtcIj1cIitlLmpmO2QrK31lbHNlIGJyZWFrO2FoKGEsYitjLGEuc2UpO3JldHVybiEwfXJldHVybiExfWZ1bmN0aW9uIGFoKGEsYixjKXtmdW5jdGlvbiBkKCl7YS5PZS5yZW1vdmUoYyk7JGcoYSl9YS5PZS5hZGQoYywxKTt2YXIgZT1zZXRUaW1lb3V0KGQsTWF0aC5mbG9vcigyNUUzKSk7WmcoYSxiLGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGUpO2QoKX0pfVxuZnVuY3Rpb24gWmcoYSxiLGMpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0cnl7aWYoYS5UZCl7dmFyIGQ9YS5DYS5nYi5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO2QudHlwZT1cInRleHQvamF2YXNjcmlwdFwiO2QuYXN5bmM9ITA7ZC5zcmM9YjtkLm9ubG9hZD1kLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe3ZhciBhPWQucmVhZHlTdGF0ZTthJiZcImxvYWRlZFwiIT09YSYmXCJjb21wbGV0ZVwiIT09YXx8KGQub25sb2FkPWQub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYygpKX07ZC5vbmVycm9yPWZ1bmN0aW9uKCl7QmIoXCJMb25nLXBvbGwgc2NyaXB0IGZhaWxlZCB0byBsb2FkOiBcIitiKTthLlRkPSExO2EuY2xvc2UoKX07YS5DYS5nYi5ib2R5LmFwcGVuZENoaWxkKGQpfX1jYXRjaChlKXt9fSxNYXRoLmZsb29yKDEpKX07dmFyIGJoPW51bGw7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBNb3pXZWJTb2NrZXQ/Ymg9TW96V2ViU29ja2V0OlwidW5kZWZpbmVkXCIhPT10eXBlb2YgV2ViU29ja2V0JiYoYmg9V2ViU29ja2V0KTtmdW5jdGlvbiBjaChhLGIsYyl7dGhpcy5xZT1hO3RoaXMuZj1PYyh0aGlzLnFlKTt0aGlzLmZyYW1lcz10aGlzLkpjPW51bGw7dGhpcy5vYj10aGlzLnBiPXRoaXMuYmY9MDt0aGlzLlZhPU9iKGIpO3RoaXMuZmI9KGIubGI/XCJ3c3M6Ly9cIjpcIndzOi8vXCIpK2IuT2ErXCIvLndzP3Y9NVwiO1widW5kZWZpbmVkXCIhPT10eXBlb2YgbG9jYXRpb24mJmxvY2F0aW9uLmhyZWYmJi0xIT09bG9jYXRpb24uaHJlZi5pbmRleE9mKFwiZmlyZWJhc2Vpby5jb21cIikmJih0aGlzLmZiKz1cIiZyPWZcIik7Yi5ob3N0IT09Yi5PYSYmKHRoaXMuZmI9dGhpcy5mYitcIiZucz1cIitiLkNiKTtjJiYodGhpcy5mYj10aGlzLmZiK1wiJnM9XCIrYyl9dmFyIGRoO1xuY2gucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiKXt0aGlzLmpiPWI7dGhpcy53Zz1hO3RoaXMuZihcIldlYnNvY2tldCBjb25uZWN0aW5nIHRvIFwiK3RoaXMuZmIpO3RoaXMuR2M9ITE7RGMuc2V0KFwicHJldmlvdXNfd2Vic29ja2V0X2ZhaWx1cmVcIiwhMCk7dHJ5e3RoaXMudmE9bmV3IGJoKHRoaXMuZmIpfWNhdGNoKGMpe3RoaXMuZihcIkVycm9yIGluc3RhbnRpYXRpbmcgV2ViU29ja2V0LlwiKTt2YXIgZD1jLm1lc3NhZ2V8fGMuZGF0YTtkJiZ0aGlzLmYoZCk7dGhpcy5pYigpO3JldHVybn12YXIgZT10aGlzO3RoaXMudmEub25vcGVuPWZ1bmN0aW9uKCl7ZS5mKFwiV2Vic29ja2V0IGNvbm5lY3RlZC5cIik7ZS5HYz0hMH07dGhpcy52YS5vbmNsb3NlPWZ1bmN0aW9uKCl7ZS5mKFwiV2Vic29ja2V0IGNvbm5lY3Rpb24gd2FzIGRpc2Nvbm5lY3RlZC5cIik7ZS52YT1udWxsO2UuaWIoKX07dGhpcy52YS5vbm1lc3NhZ2U9ZnVuY3Rpb24oYSl7aWYobnVsbCE9PWUudmEpaWYoYT1hLmRhdGEsZS5vYis9XG5hLmxlbmd0aCxMYihlLlZhLFwiYnl0ZXNfcmVjZWl2ZWRcIixhLmxlbmd0aCksZWgoZSksbnVsbCE9PWUuZnJhbWVzKWZoKGUsYSk7ZWxzZXthOntKKG51bGw9PT1lLmZyYW1lcyxcIldlIGFscmVhZHkgaGF2ZSBhIGZyYW1lIGJ1ZmZlclwiKTtpZig2Pj1hLmxlbmd0aCl7dmFyIGI9TnVtYmVyKGEpO2lmKCFpc05hTihiKSl7ZS5iZj1iO2UuZnJhbWVzPVtdO2E9bnVsbDticmVhayBhfX1lLmJmPTE7ZS5mcmFtZXM9W119bnVsbCE9PWEmJmZoKGUsYSl9fTt0aGlzLnZhLm9uZXJyb3I9ZnVuY3Rpb24oYSl7ZS5mKFwiV2ViU29ja2V0IGVycm9yLiAgQ2xvc2luZyBjb25uZWN0aW9uLlwiKTsoYT1hLm1lc3NhZ2V8fGEuZGF0YSkmJmUuZihhKTtlLmliKCl9fTtjaC5wcm90b3R5cGUuc3RhcnQ9ZnVuY3Rpb24oKXt9O1xuY2guaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXt2YXIgYT0hMTtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmbmF2aWdhdG9yLnVzZXJBZ2VudCl7dmFyIGI9bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZCAoWzAtOV17MCx9XFwuWzAtOV17MCx9KS8pO2ImJjE8Yi5sZW5ndGgmJjQuND5wYXJzZUZsb2F0KGJbMV0pJiYoYT0hMCl9cmV0dXJuIWEmJm51bGwhPT1iaCYmIWRofTtjaC5yZXNwb25zZXNSZXF1aXJlZFRvQmVIZWFsdGh5PTI7Y2guaGVhbHRoeVRpbWVvdXQ9M0U0O2g9Y2gucHJvdG90eXBlO2guQmQ9ZnVuY3Rpb24oKXtEYy5yZW1vdmUoXCJwcmV2aW91c193ZWJzb2NrZXRfZmFpbHVyZVwiKX07ZnVuY3Rpb24gZmgoYSxiKXthLmZyYW1lcy5wdXNoKGIpO2lmKGEuZnJhbWVzLmxlbmd0aD09YS5iZil7dmFyIGM9YS5mcmFtZXMuam9pbihcIlwiKTthLmZyYW1lcz1udWxsO2M9bWIoYyk7YS53ZyhjKX19XG5oLnNlbmQ9ZnVuY3Rpb24oYSl7ZWgodGhpcyk7YT1CKGEpO3RoaXMucGIrPWEubGVuZ3RoO0xiKHRoaXMuVmEsXCJieXRlc19zZW50XCIsYS5sZW5ndGgpO2E9WGMoYSwxNjM4NCk7MTxhLmxlbmd0aCYmdGhpcy52YS5zZW5kKFN0cmluZyhhLmxlbmd0aCkpO2Zvcih2YXIgYj0wO2I8YS5sZW5ndGg7YisrKXRoaXMudmEuc2VuZChhW2JdKX07aC5jZD1mdW5jdGlvbigpe3RoaXMuemI9ITA7dGhpcy5KYyYmKGNsZWFySW50ZXJ2YWwodGhpcy5KYyksdGhpcy5KYz1udWxsKTt0aGlzLnZhJiYodGhpcy52YS5jbG9zZSgpLHRoaXMudmE9bnVsbCl9O2guaWI9ZnVuY3Rpb24oKXt0aGlzLnpifHwodGhpcy5mKFwiV2ViU29ja2V0IGlzIGNsb3NpbmcgaXRzZWxmXCIpLHRoaXMuY2QoKSx0aGlzLmpiJiYodGhpcy5qYih0aGlzLkdjKSx0aGlzLmpiPW51bGwpKX07aC5jbG9zZT1mdW5jdGlvbigpe3RoaXMuemJ8fCh0aGlzLmYoXCJXZWJTb2NrZXQgaXMgYmVpbmcgY2xvc2VkXCIpLHRoaXMuY2QoKSl9O1xuZnVuY3Rpb24gZWgoYSl7Y2xlYXJJbnRlcnZhbChhLkpjKTthLkpjPXNldEludGVydmFsKGZ1bmN0aW9uKCl7YS52YSYmYS52YS5zZW5kKFwiMFwiKTtlaChhKX0sTWF0aC5mbG9vcig0NUUzKSl9O2Z1bmN0aW9uIGdoKGEpe2hoKHRoaXMsYSl9dmFyIGloPVtVZyxjaF07ZnVuY3Rpb24gaGgoYSxiKXt2YXIgYz1jaCYmY2guaXNBdmFpbGFibGUoKSxkPWMmJiEoRGMudWZ8fCEwPT09RGMuZ2V0KFwicHJldmlvdXNfd2Vic29ja2V0X2ZhaWx1cmVcIikpO2IuVGcmJihjfHxRKFwid3NzOi8vIFVSTCB1c2VkLCBidXQgYnJvd3NlciBpc24ndCBrbm93biB0byBzdXBwb3J0IHdlYnNvY2tldHMuICBUcnlpbmcgYW55d2F5LlwiKSxkPSEwKTtpZihkKWEuZWQ9W2NoXTtlbHNle3ZhciBlPWEuZWQ9W107WWMoaWgsZnVuY3Rpb24oYSxiKXtiJiZiLmlzQXZhaWxhYmxlKCkmJmUucHVzaChiKX0pfX1mdW5jdGlvbiBqaChhKXtpZigwPGEuZWQubGVuZ3RoKXJldHVybiBhLmVkWzBdO3Rocm93IEVycm9yKFwiTm8gdHJhbnNwb3J0cyBhdmFpbGFibGVcIik7fTtmdW5jdGlvbiBraChhLGIsYyxkLGUsZil7dGhpcy5pZD1hO3RoaXMuZj1PYyhcImM6XCIrdGhpcy5pZCtcIjpcIik7dGhpcy5oYz1jO3RoaXMuVmM9ZDt0aGlzLmthPWU7dGhpcy5NZT1mO3RoaXMuSD1iO3RoaXMuSmQ9W107dGhpcy5lZj0wO3RoaXMuTmY9bmV3IGdoKGIpO3RoaXMuVWE9MDt0aGlzLmYoXCJDb25uZWN0aW9uIGNyZWF0ZWRcIik7bGgodGhpcyl9XG5mdW5jdGlvbiBsaChhKXt2YXIgYj1qaChhLk5mKTthLkw9bmV3IGIoXCJjOlwiK2EuaWQrXCI6XCIrYS5lZisrLGEuSCk7YS5RZT1iLnJlc3BvbnNlc1JlcXVpcmVkVG9CZUhlYWx0aHl8fDA7dmFyIGM9bWgoYSxhLkwpLGQ9bmgoYSxhLkwpO2EuZmQ9YS5MO2EuYmQ9YS5MO2EuRj1udWxsO2EuQWI9ITE7c2V0VGltZW91dChmdW5jdGlvbigpe2EuTCYmYS5MLm9wZW4oYyxkKX0sTWF0aC5mbG9vcigwKSk7Yj1iLmhlYWx0aHlUaW1lb3V0fHwwOzA8YiYmKGEudmQ9c2V0VGltZW91dChmdW5jdGlvbigpe2EudmQ9bnVsbDthLkFifHwoYS5MJiYxMDI0MDA8YS5MLm9iPyhhLmYoXCJDb25uZWN0aW9uIGV4Y2VlZGVkIGhlYWx0aHkgdGltZW91dCBidXQgaGFzIHJlY2VpdmVkIFwiK2EuTC5vYitcIiBieXRlcy4gIE1hcmtpbmcgY29ubmVjdGlvbiBoZWFsdGh5LlwiKSxhLkFiPSEwLGEuTC5CZCgpKTphLkwmJjEwMjQwPGEuTC5wYj9hLmYoXCJDb25uZWN0aW9uIGV4Y2VlZGVkIGhlYWx0aHkgdGltZW91dCBidXQgaGFzIHNlbnQgXCIrXG5hLkwucGIrXCIgYnl0ZXMuICBMZWF2aW5nIGNvbm5lY3Rpb24gYWxpdmUuXCIpOihhLmYoXCJDbG9zaW5nIHVuaGVhbHRoeSBjb25uZWN0aW9uIGFmdGVyIHRpbWVvdXQuXCIpLGEuY2xvc2UoKSkpfSxNYXRoLmZsb29yKGIpKSl9ZnVuY3Rpb24gbmgoYSxiKXtyZXR1cm4gZnVuY3Rpb24oYyl7Yj09PWEuTD8oYS5MPW51bGwsY3x8MCE9PWEuVWE/MT09PWEuVWEmJmEuZihcIlJlYWx0aW1lIGNvbm5lY3Rpb24gbG9zdC5cIik6KGEuZihcIlJlYWx0aW1lIGNvbm5lY3Rpb24gZmFpbGVkLlwiKSxcInMtXCI9PT1hLkguT2Euc3Vic3RyKDAsMikmJihEYy5yZW1vdmUoXCJob3N0OlwiK2EuSC5ob3N0KSxhLkguT2E9YS5ILmhvc3QpKSxhLmNsb3NlKCkpOmI9PT1hLkY/KGEuZihcIlNlY29uZGFyeSBjb25uZWN0aW9uIGxvc3QuXCIpLGM9YS5GLGEuRj1udWxsLGEuZmQhPT1jJiZhLmJkIT09Y3x8YS5jbG9zZSgpKTphLmYoXCJjbG9zaW5nIGFuIG9sZCBjb25uZWN0aW9uXCIpfX1cbmZ1bmN0aW9uIG1oKGEsYil7cmV0dXJuIGZ1bmN0aW9uKGMpe2lmKDIhPWEuVWEpaWYoYj09PWEuYmQpe3ZhciBkPVZjKFwidFwiLGMpO2M9VmMoXCJkXCIsYyk7aWYoXCJjXCI9PWQpe2lmKGQ9VmMoXCJ0XCIsYyksXCJkXCJpbiBjKWlmKGM9Yy5kLFwiaFwiPT09ZCl7dmFyIGQ9Yy50cyxlPWMudixmPWMuaDthLlZkPWMucztGYyhhLkgsZik7MD09YS5VYSYmKGEuTC5zdGFydCgpLG9oKGEsYS5MLGQpLFwiNVwiIT09ZSYmUShcIlByb3RvY29sIHZlcnNpb24gbWlzbWF0Y2ggZGV0ZWN0ZWRcIiksYz1hLk5mLChjPTE8Yy5lZC5sZW5ndGg/Yy5lZFsxXTpudWxsKSYmcGgoYSxjKSl9ZWxzZSBpZihcIm5cIj09PWQpe2EuZihcInJlY3ZkIGVuZCB0cmFuc21pc3Npb24gb24gcHJpbWFyeVwiKTthLmJkPWEuRjtmb3IoYz0wO2M8YS5KZC5sZW5ndGg7KytjKWEuRmQoYS5KZFtjXSk7YS5KZD1bXTtxaChhKX1lbHNlXCJzXCI9PT1kPyhhLmYoXCJDb25uZWN0aW9uIHNodXRkb3duIGNvbW1hbmQgcmVjZWl2ZWQuIFNodXR0aW5nIGRvd24uLi5cIiksXG5hLk1lJiYoYS5NZShjKSxhLk1lPW51bGwpLGEua2E9bnVsbCxhLmNsb3NlKCkpOlwiclwiPT09ZD8oYS5mKFwiUmVzZXQgcGFja2V0IHJlY2VpdmVkLiAgTmV3IGhvc3Q6IFwiK2MpLEZjKGEuSCxjKSwxPT09YS5VYT9hLmNsb3NlKCk6KHJoKGEpLGxoKGEpKSk6XCJlXCI9PT1kP1BjKFwiU2VydmVyIEVycm9yOiBcIitjKTpcIm9cIj09PWQ/KGEuZihcImdvdCBwb25nIG9uIHByaW1hcnkuXCIpLHNoKGEpLHRoKGEpKTpQYyhcIlVua25vd24gY29udHJvbCBwYWNrZXQgY29tbWFuZDogXCIrZCl9ZWxzZVwiZFwiPT1kJiZhLkZkKGMpfWVsc2UgaWYoYj09PWEuRilpZihkPVZjKFwidFwiLGMpLGM9VmMoXCJkXCIsYyksXCJjXCI9PWQpXCJ0XCJpbiBjJiYoYz1jLnQsXCJhXCI9PT1jP3VoKGEpOlwiclwiPT09Yz8oYS5mKFwiR290IGEgcmVzZXQgb24gc2Vjb25kYXJ5LCBjbG9zaW5nIGl0XCIpLGEuRi5jbG9zZSgpLGEuZmQhPT1hLkYmJmEuYmQhPT1hLkZ8fGEuY2xvc2UoKSk6XCJvXCI9PT1jJiYoYS5mKFwiZ290IHBvbmcgb24gc2Vjb25kYXJ5LlwiKSxcbmEuTGYtLSx1aChhKSkpO2Vsc2UgaWYoXCJkXCI9PWQpYS5KZC5wdXNoKGMpO2Vsc2UgdGhyb3cgRXJyb3IoXCJVbmtub3duIHByb3RvY29sIGxheWVyOiBcIitkKTtlbHNlIGEuZihcIm1lc3NhZ2Ugb24gb2xkIGNvbm5lY3Rpb25cIil9fWtoLnByb3RvdHlwZS5EYT1mdW5jdGlvbihhKXt2aCh0aGlzLHt0OlwiZFwiLGQ6YX0pfTtmdW5jdGlvbiBxaChhKXthLmZkPT09YS5GJiZhLmJkPT09YS5GJiYoYS5mKFwiY2xlYW5pbmcgdXAgYW5kIHByb21vdGluZyBhIGNvbm5lY3Rpb246IFwiK2EuRi5xZSksYS5MPWEuRixhLkY9bnVsbCl9XG5mdW5jdGlvbiB1aChhKXswPj1hLkxmPyhhLmYoXCJTZWNvbmRhcnkgY29ubmVjdGlvbiBpcyBoZWFsdGh5LlwiKSxhLkFiPSEwLGEuRi5CZCgpLGEuRi5zdGFydCgpLGEuZihcInNlbmRpbmcgY2xpZW50IGFjayBvbiBzZWNvbmRhcnlcIiksYS5GLnNlbmQoe3Q6XCJjXCIsZDp7dDpcImFcIixkOnt9fX0pLGEuZihcIkVuZGluZyB0cmFuc21pc3Npb24gb24gcHJpbWFyeVwiKSxhLkwuc2VuZCh7dDpcImNcIixkOnt0OlwiblwiLGQ6e319fSksYS5mZD1hLkYscWgoYSkpOihhLmYoXCJzZW5kaW5nIHBpbmcgb24gc2Vjb25kYXJ5LlwiKSxhLkYuc2VuZCh7dDpcImNcIixkOnt0OlwicFwiLGQ6e319fSkpfWtoLnByb3RvdHlwZS5GZD1mdW5jdGlvbihhKXtzaCh0aGlzKTt0aGlzLmhjKGEpfTtmdW5jdGlvbiBzaChhKXthLkFifHwoYS5RZS0tLDA+PWEuUWUmJihhLmYoXCJQcmltYXJ5IGNvbm5lY3Rpb24gaXMgaGVhbHRoeS5cIiksYS5BYj0hMCxhLkwuQmQoKSkpfVxuZnVuY3Rpb24gcGgoYSxiKXthLkY9bmV3IGIoXCJjOlwiK2EuaWQrXCI6XCIrYS5lZisrLGEuSCxhLlZkKTthLkxmPWIucmVzcG9uc2VzUmVxdWlyZWRUb0JlSGVhbHRoeXx8MDthLkYub3BlbihtaChhLGEuRiksbmgoYSxhLkYpKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS5GJiYoYS5mKFwiVGltZWQgb3V0IHRyeWluZyB0byB1cGdyYWRlLlwiKSxhLkYuY2xvc2UoKSl9LE1hdGguZmxvb3IoNkU0KSl9ZnVuY3Rpb24gb2goYSxiLGMpe2EuZihcIlJlYWx0aW1lIGNvbm5lY3Rpb24gZXN0YWJsaXNoZWQuXCIpO2EuTD1iO2EuVWE9MTthLlZjJiYoYS5WYyhjKSxhLlZjPW51bGwpOzA9PT1hLlFlPyhhLmYoXCJQcmltYXJ5IGNvbm5lY3Rpb24gaXMgaGVhbHRoeS5cIiksYS5BYj0hMCk6c2V0VGltZW91dChmdW5jdGlvbigpe3RoKGEpfSxNYXRoLmZsb29yKDVFMykpfVxuZnVuY3Rpb24gdGgoYSl7YS5BYnx8MSE9PWEuVWF8fChhLmYoXCJzZW5kaW5nIHBpbmcgb24gcHJpbWFyeS5cIiksdmgoYSx7dDpcImNcIixkOnt0OlwicFwiLGQ6e319fSkpfWZ1bmN0aW9uIHZoKGEsYil7aWYoMSE9PWEuVWEpdGhyb3dcIkNvbm5lY3Rpb24gaXMgbm90IGNvbm5lY3RlZFwiO2EuZmQuc2VuZChiKX1raC5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXsyIT09dGhpcy5VYSYmKHRoaXMuZihcIkNsb3NpbmcgcmVhbHRpbWUgY29ubmVjdGlvbi5cIiksdGhpcy5VYT0yLHJoKHRoaXMpLHRoaXMua2EmJih0aGlzLmthKCksdGhpcy5rYT1udWxsKSl9O2Z1bmN0aW9uIHJoKGEpe2EuZihcIlNodXR0aW5nIGRvd24gYWxsIGNvbm5lY3Rpb25zXCIpO2EuTCYmKGEuTC5jbG9zZSgpLGEuTD1udWxsKTthLkYmJihhLkYuY2xvc2UoKSxhLkY9bnVsbCk7YS52ZCYmKGNsZWFyVGltZW91dChhLnZkKSxhLnZkPW51bGwpfTtmdW5jdGlvbiB3aChhLGIsYyxkKXt0aGlzLmlkPXhoKys7dGhpcy5mPU9jKFwicDpcIit0aGlzLmlkK1wiOlwiKTt0aGlzLndmPXRoaXMuRGU9ITE7dGhpcy5hYT17fTt0aGlzLnBhPVtdO3RoaXMuWGM9MDt0aGlzLlVjPVtdO3RoaXMubWE9ITE7dGhpcy4kYT0xRTM7dGhpcy5DZD0zRTU7dGhpcy5HYj1iO3RoaXMuVGM9Yzt0aGlzLk5lPWQ7dGhpcy5IPWE7dGhpcy5XZT1udWxsO3RoaXMuUWQ9e307dGhpcy5JZz0wO3RoaXMubWY9ITA7dGhpcy5LYz10aGlzLkZlPW51bGw7eWgodGhpcywwKTtNZi51YigpLkViKFwidmlzaWJsZVwiLHRoaXMuemcsdGhpcyk7LTE9PT1hLmhvc3QuaW5kZXhPZihcImZibG9jYWxcIikmJkxmLnViKCkuRWIoXCJvbmxpbmVcIix0aGlzLnhnLHRoaXMpfXZhciB4aD0wLHpoPTA7aD13aC5wcm90b3R5cGU7XG5oLkRhPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD0rK3RoaXMuSWc7YT17cjpkLGE6YSxiOmJ9O3RoaXMuZihCKGEpKTtKKHRoaXMubWEsXCJzZW5kUmVxdWVzdCBjYWxsIHdoZW4gd2UncmUgbm90IGNvbm5lY3RlZCBub3QgYWxsb3dlZC5cIik7dGhpcy5TYS5EYShhKTtjJiYodGhpcy5RZFtkXT1jKX07aC54Zj1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1hLndhKCksZj1hLnBhdGgudG9TdHJpbmcoKTt0aGlzLmYoXCJMaXN0ZW4gY2FsbGVkIGZvciBcIitmK1wiIFwiK2UpO3RoaXMuYWFbZl09dGhpcy5hYVtmXXx8e307SighdGhpcy5hYVtmXVtlXSxcImxpc3RlbigpIGNhbGxlZCB0d2ljZSBmb3Igc2FtZSBwYXRoL3F1ZXJ5SWQuXCIpO2E9e0o6ZCx1ZDpiLEZnOmEsdGFnOmN9O3RoaXMuYWFbZl1bZV09YTt0aGlzLm1hJiZBaCh0aGlzLGEpfTtcbmZ1bmN0aW9uIEFoKGEsYil7dmFyIGM9Yi5GZyxkPWMucGF0aC50b1N0cmluZygpLGU9Yy53YSgpO2EuZihcIkxpc3RlbiBvbiBcIitkK1wiIGZvciBcIitlKTt2YXIgZj17cDpkfTtiLnRhZyYmKGYucT1jZShjLm4pLGYudD1iLnRhZyk7Zi5oPWIudWQoKTthLkRhKFwicVwiLGYsZnVuY3Rpb24oZil7dmFyIGs9Zi5kLGw9Zi5zO2lmKGsmJlwib2JqZWN0XCI9PT10eXBlb2YgayYmdShrLFwid1wiKSl7dmFyIG09dyhrLFwid1wiKTtlYShtKSYmMDw9TmEobSxcIm5vX2luZGV4XCIpJiZRKFwiVXNpbmcgYW4gdW5zcGVjaWZpZWQgaW5kZXguIENvbnNpZGVyIGFkZGluZyBcIisoJ1wiLmluZGV4T25cIjogXCInK2Mubi5nLnRvU3RyaW5nKCkrJ1wiJykrXCIgYXQgXCIrYy5wYXRoLnRvU3RyaW5nKCkrXCIgdG8geW91ciBzZWN1cml0eSBydWxlcyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXCIpfShhLmFhW2RdJiZhLmFhW2RdW2VdKT09PWImJihhLmYoXCJsaXN0ZW4gcmVzcG9uc2VcIixmKSxcIm9rXCIhPT1sJiZCaChhLGQsZSksYi5KJiZcbmIuSihsLGspKX0pfWguUD1mdW5jdGlvbihhLGIsYyl7dGhpcy5GYT17Zmc6YSxuZjohMSx5YzpiLGpkOmN9O3RoaXMuZihcIkF1dGhlbnRpY2F0aW5nIHVzaW5nIGNyZWRlbnRpYWw6IFwiK2EpO0NoKHRoaXMpOyhiPTQwPT1hLmxlbmd0aCl8fChhPWFkKGEpLkFjLGI9XCJvYmplY3RcIj09PXR5cGVvZiBhJiYhMD09PXcoYSxcImFkbWluXCIpKTtiJiYodGhpcy5mKFwiQWRtaW4gYXV0aCBjcmVkZW50aWFsIGRldGVjdGVkLiAgUmVkdWNpbmcgbWF4IHJlY29ubmVjdCB0aW1lLlwiKSx0aGlzLkNkPTNFNCl9O2guZWU9ZnVuY3Rpb24oYSl7ZGVsZXRlIHRoaXMuRmE7dGhpcy5tYSYmdGhpcy5EYShcInVuYXV0aFwiLHt9LGZ1bmN0aW9uKGIpe2EoYi5zLGIuZCl9KX07XG5mdW5jdGlvbiBDaChhKXt2YXIgYj1hLkZhO2EubWEmJmImJmEuRGEoXCJhdXRoXCIse2NyZWQ6Yi5mZ30sZnVuY3Rpb24oYyl7dmFyIGQ9Yy5zO2M9Yy5kfHxcImVycm9yXCI7XCJva1wiIT09ZCYmYS5GYT09PWImJmRlbGV0ZSBhLkZhO2IubmY/XCJva1wiIT09ZCYmYi5qZCYmYi5qZChkLGMpOihiLm5mPSEwLGIueWMmJmIueWMoZCxjKSl9KX1oLk9mPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5wYXRoLnRvU3RyaW5nKCksZD1hLndhKCk7dGhpcy5mKFwiVW5saXN0ZW4gY2FsbGVkIGZvciBcIitjK1wiIFwiK2QpO2lmKEJoKHRoaXMsYyxkKSYmdGhpcy5tYSl7dmFyIGU9Y2UoYS5uKTt0aGlzLmYoXCJVbmxpc3RlbiBvbiBcIitjK1wiIGZvciBcIitkKTtjPXtwOmN9O2ImJihjLnE9ZSxjLnQ9Yik7dGhpcy5EYShcIm5cIixjKX19O2guTGU9ZnVuY3Rpb24oYSxiLGMpe3RoaXMubWE/RGgodGhpcyxcIm9cIixhLGIsYyk6dGhpcy5VYy5wdXNoKHtaYzphLGFjdGlvbjpcIm9cIixkYXRhOmIsSjpjfSl9O1xuaC5CZj1mdW5jdGlvbihhLGIsYyl7dGhpcy5tYT9EaCh0aGlzLFwib21cIixhLGIsYyk6dGhpcy5VYy5wdXNoKHtaYzphLGFjdGlvbjpcIm9tXCIsZGF0YTpiLEo6Y30pfTtoLkdkPWZ1bmN0aW9uKGEsYil7dGhpcy5tYT9EaCh0aGlzLFwib2NcIixhLG51bGwsYik6dGhpcy5VYy5wdXNoKHtaYzphLGFjdGlvbjpcIm9jXCIsZGF0YTpudWxsLEo6Yn0pfTtmdW5jdGlvbiBEaChhLGIsYyxkLGUpe2M9e3A6YyxkOmR9O2EuZihcIm9uRGlzY29ubmVjdCBcIitiLGMpO2EuRGEoYixjLGZ1bmN0aW9uKGEpe2UmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKGEucyxhLmQpfSxNYXRoLmZsb29yKDApKX0pfWgucHV0PWZ1bmN0aW9uKGEsYixjLGQpe0VoKHRoaXMsXCJwXCIsYSxiLGMsZCl9O2gueWY9ZnVuY3Rpb24oYSxiLGMsZCl7RWgodGhpcyxcIm1cIixhLGIsYyxkKX07XG5mdW5jdGlvbiBFaChhLGIsYyxkLGUsZil7ZD17cDpjLGQ6ZH07bihmKSYmKGQuaD1mKTthLnBhLnB1c2goe2FjdGlvbjpiLElmOmQsSjplfSk7YS5YYysrO2I9YS5wYS5sZW5ndGgtMTthLm1hP0ZoKGEsYik6YS5mKFwiQnVmZmVyaW5nIHB1dDogXCIrYyl9ZnVuY3Rpb24gRmgoYSxiKXt2YXIgYz1hLnBhW2JdLmFjdGlvbixkPWEucGFbYl0uSWYsZT1hLnBhW2JdLko7YS5wYVtiXS5HZz1hLm1hO2EuRGEoYyxkLGZ1bmN0aW9uKGQpe2EuZihjK1wiIHJlc3BvbnNlXCIsZCk7ZGVsZXRlIGEucGFbYl07YS5YYy0tOzA9PT1hLlhjJiYoYS5wYT1bXSk7ZSYmZShkLnMsZC5kKX0pfWguVGU9ZnVuY3Rpb24oYSl7dGhpcy5tYSYmKGE9e2M6YX0sdGhpcy5mKFwicmVwb3J0U3RhdHNcIixhKSx0aGlzLkRhKFwic1wiLGEsZnVuY3Rpb24oYSl7XCJva1wiIT09YS5zJiZ0aGlzLmYoXCJyZXBvcnRTdGF0c1wiLFwiRXJyb3Igc2VuZGluZyBzdGF0czogXCIrYS5kKX0pKX07XG5oLkZkPWZ1bmN0aW9uKGEpe2lmKFwiclwiaW4gYSl7dGhpcy5mKFwiZnJvbSBzZXJ2ZXI6IFwiK0IoYSkpO3ZhciBiPWEucixjPXRoaXMuUWRbYl07YyYmKGRlbGV0ZSB0aGlzLlFkW2JdLGMoYS5iKSl9ZWxzZXtpZihcImVycm9yXCJpbiBhKXRocm93XCJBIHNlcnZlci1zaWRlIGVycm9yIGhhcyBvY2N1cnJlZDogXCIrYS5lcnJvcjtcImFcImluIGEmJihiPWEuYSxjPWEuYix0aGlzLmYoXCJoYW5kbGVTZXJ2ZXJNZXNzYWdlXCIsYixjKSxcImRcIj09PWI/dGhpcy5HYihjLnAsYy5kLCExLGMudCk6XCJtXCI9PT1iP3RoaXMuR2IoYy5wLGMuZCwhMCxjLnQpOlwiY1wiPT09Yj9HaCh0aGlzLGMucCxjLnEpOlwiYWNcIj09PWI/KGE9Yy5zLGI9Yy5kLGM9dGhpcy5GYSxkZWxldGUgdGhpcy5GYSxjJiZjLmpkJiZjLmpkKGEsYikpOlwic2RcIj09PWI/dGhpcy5XZT90aGlzLldlKGMpOlwibXNnXCJpbiBjJiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUmJmNvbnNvbGUubG9nKFwiRklSRUJBU0U6IFwiK2MubXNnLnJlcGxhY2UoXCJcXG5cIixcblwiXFxuRklSRUJBU0U6IFwiKSk6UGMoXCJVbnJlY29nbml6ZWQgYWN0aW9uIHJlY2VpdmVkIGZyb20gc2VydmVyOiBcIitCKGIpK1wiXFxuQXJlIHlvdSB1c2luZyB0aGUgbGF0ZXN0IGNsaWVudD9cIikpfX07aC5WYz1mdW5jdGlvbihhKXt0aGlzLmYoXCJjb25uZWN0aW9uIHJlYWR5XCIpO3RoaXMubWE9ITA7dGhpcy5LYz0obmV3IERhdGUpLmdldFRpbWUoKTt0aGlzLk5lKHtzZXJ2ZXJUaW1lT2Zmc2V0OmEtKG5ldyBEYXRlKS5nZXRUaW1lKCl9KTt0aGlzLm1mJiYoYT17fSxhW1wic2RrLmpzLlwiK1wiMi4yLjRcIi5yZXBsYWNlKC9cXC4vZyxcIi1cIildPTEsa2coKSYmKGFbXCJmcmFtZXdvcmsuY29yZG92YVwiXT0xKSx0aGlzLlRlKGEpKTtIaCh0aGlzKTt0aGlzLm1mPSExO3RoaXMuVGMoITApfTtcbmZ1bmN0aW9uIHloKGEsYil7SighYS5TYSxcIlNjaGVkdWxpbmcgYSBjb25uZWN0IHdoZW4gd2UncmUgYWxyZWFkeSBjb25uZWN0ZWQvaW5nP1wiKTthLlNiJiZjbGVhclRpbWVvdXQoYS5TYik7YS5TYj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS5TYj1udWxsO0loKGEpfSxNYXRoLmZsb29yKGIpKX1oLnpnPWZ1bmN0aW9uKGEpe2EmJiF0aGlzLnVjJiZ0aGlzLiRhPT09dGhpcy5DZCYmKHRoaXMuZihcIldpbmRvdyBiZWNhbWUgdmlzaWJsZS4gIFJlZHVjaW5nIGRlbGF5LlwiKSx0aGlzLiRhPTFFMyx0aGlzLlNhfHx5aCh0aGlzLDApKTt0aGlzLnVjPWF9O2gueGc9ZnVuY3Rpb24oYSl7YT8odGhpcy5mKFwiQnJvd3NlciB3ZW50IG9ubGluZS5cIiksdGhpcy4kYT0xRTMsdGhpcy5TYXx8eWgodGhpcywwKSk6KHRoaXMuZihcIkJyb3dzZXIgd2VudCBvZmZsaW5lLiAgS2lsbGluZyBjb25uZWN0aW9uLlwiKSx0aGlzLlNhJiZ0aGlzLlNhLmNsb3NlKCkpfTtcbmguQ2Y9ZnVuY3Rpb24oKXt0aGlzLmYoXCJkYXRhIGNsaWVudCBkaXNjb25uZWN0ZWRcIik7dGhpcy5tYT0hMTt0aGlzLlNhPW51bGw7Zm9yKHZhciBhPTA7YTx0aGlzLnBhLmxlbmd0aDthKyspe3ZhciBiPXRoaXMucGFbYV07YiYmXCJoXCJpbiBiLklmJiZiLkdnJiYoYi5KJiZiLkooXCJkaXNjb25uZWN0XCIpLGRlbGV0ZSB0aGlzLnBhW2FdLHRoaXMuWGMtLSl9MD09PXRoaXMuWGMmJih0aGlzLnBhPVtdKTt0aGlzLlFkPXt9O0poKHRoaXMpJiYodGhpcy51Yz90aGlzLktjJiYoM0U0PChuZXcgRGF0ZSkuZ2V0VGltZSgpLXRoaXMuS2MmJih0aGlzLiRhPTFFMyksdGhpcy5LYz1udWxsKToodGhpcy5mKFwiV2luZG93IGlzbid0IHZpc2libGUuICBEZWxheWluZyByZWNvbm5lY3QuXCIpLHRoaXMuJGE9dGhpcy5DZCx0aGlzLkZlPShuZXcgRGF0ZSkuZ2V0VGltZSgpKSxhPU1hdGgubWF4KDAsdGhpcy4kYS0oKG5ldyBEYXRlKS5nZXRUaW1lKCktdGhpcy5GZSkpLGEqPU1hdGgucmFuZG9tKCksdGhpcy5mKFwiVHJ5aW5nIHRvIHJlY29ubmVjdCBpbiBcIitcbmErXCJtc1wiKSx5aCh0aGlzLGEpLHRoaXMuJGE9TWF0aC5taW4odGhpcy5DZCwxLjMqdGhpcy4kYSkpO3RoaXMuVGMoITEpfTtmdW5jdGlvbiBJaChhKXtpZihKaChhKSl7YS5mKFwiTWFraW5nIGEgY29ubmVjdGlvbiBhdHRlbXB0XCIpO2EuRmU9KG5ldyBEYXRlKS5nZXRUaW1lKCk7YS5LYz1udWxsO3ZhciBiPXEoYS5GZCxhKSxjPXEoYS5WYyxhKSxkPXEoYS5DZixhKSxlPWEuaWQrXCI6XCIremgrKzthLlNhPW5ldyBraChlLGEuSCxiLGMsZCxmdW5jdGlvbihiKXtRKGIrXCIgKFwiK2EuSC50b1N0cmluZygpK1wiKVwiKTthLndmPSEwfSl9fWgueWI9ZnVuY3Rpb24oKXt0aGlzLkRlPSEwO3RoaXMuU2E/dGhpcy5TYS5jbG9zZSgpOih0aGlzLlNiJiYoY2xlYXJUaW1lb3V0KHRoaXMuU2IpLHRoaXMuU2I9bnVsbCksdGhpcy5tYSYmdGhpcy5DZigpKX07aC5xYz1mdW5jdGlvbigpe3RoaXMuRGU9ITE7dGhpcy4kYT0xRTM7dGhpcy5TYXx8eWgodGhpcywwKX07XG5mdW5jdGlvbiBHaChhLGIsYyl7Yz1jP1FhKGMsZnVuY3Rpb24oYSl7cmV0dXJuIFdjKGEpfSkuam9pbihcIiRcIik6XCJkZWZhdWx0XCI7KGE9QmgoYSxiLGMpKSYmYS5KJiZhLkooXCJwZXJtaXNzaW9uX2RlbmllZFwiKX1mdW5jdGlvbiBCaChhLGIsYyl7Yj0obmV3IEsoYikpLnRvU3RyaW5nKCk7dmFyIGQ7bihhLmFhW2JdKT8oZD1hLmFhW2JdW2NdLGRlbGV0ZSBhLmFhW2JdW2NdLDA9PT1wYShhLmFhW2JdKSYmZGVsZXRlIGEuYWFbYl0pOmQ9dm9pZCAwO3JldHVybiBkfWZ1bmN0aW9uIEhoKGEpe0NoKGEpO3IoYS5hYSxmdW5jdGlvbihiKXtyKGIsZnVuY3Rpb24oYil7QWgoYSxiKX0pfSk7Zm9yKHZhciBiPTA7YjxhLnBhLmxlbmd0aDtiKyspYS5wYVtiXSYmRmgoYSxiKTtmb3IoO2EuVWMubGVuZ3RoOyliPWEuVWMuc2hpZnQoKSxEaChhLGIuYWN0aW9uLGIuWmMsYi5kYXRhLGIuSil9ZnVuY3Rpb24gSmgoYSl7dmFyIGI7Yj1MZi51YigpLmljO3JldHVybiFhLndmJiYhYS5EZSYmYn07dmFyIFY9e2xnOmZ1bmN0aW9uKCl7Vmc9ZGg9ITB9fTtWLmZvcmNlTG9uZ1BvbGxpbmc9Vi5sZztWLm1nPWZ1bmN0aW9uKCl7V2c9ITB9O1YuZm9yY2VXZWJTb2NrZXRzPVYubWc7Vi5NZz1mdW5jdGlvbihhLGIpe2Euay5SYS5XZT1ifTtWLnNldFNlY3VyaXR5RGVidWdDYWxsYmFjaz1WLk1nO1YuWWU9ZnVuY3Rpb24oYSxiKXthLmsuWWUoYil9O1Yuc3RhdHM9Vi5ZZTtWLlplPWZ1bmN0aW9uKGEsYil7YS5rLlplKGIpfTtWLnN0YXRzSW5jcmVtZW50Q291bnRlcj1WLlplO1YucGQ9ZnVuY3Rpb24oYSl7cmV0dXJuIGEuay5wZH07Vi5kYXRhVXBkYXRlQ291bnQ9Vi5wZDtWLnBnPWZ1bmN0aW9uKGEsYil7YS5rLkNlPWJ9O1YuaW50ZXJjZXB0U2VydmVyRGF0YT1WLnBnO1Yudmc9ZnVuY3Rpb24oYSl7bmV3IHVnKGEpfTtWLm9uUG9wdXBPcGVuPVYudmc7Vi5LZz1mdW5jdGlvbihhKXtmZz1hfTtWLnNldEF1dGhlbnRpY2F0aW9uU2VydmVyPVYuS2c7ZnVuY3Rpb24gUyhhLGIsYyl7dGhpcy5CPWE7dGhpcy5WPWI7dGhpcy5nPWN9Uy5wcm90b3R5cGUuSz1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QudmFsXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuSygpfTtTLnByb3RvdHlwZS52YWw9Uy5wcm90b3R5cGUuSztTLnByb3RvdHlwZS5sZj1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZXhwb3J0VmFsXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuSyghMCl9O1MucHJvdG90eXBlLmV4cG9ydFZhbD1TLnByb3RvdHlwZS5sZjtTLnByb3RvdHlwZS5rZz1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZXhpc3RzXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiF0aGlzLkIuZSgpfTtTLnByb3RvdHlwZS5leGlzdHM9Uy5wcm90b3R5cGUua2c7XG5TLnByb3RvdHlwZS53PWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuY2hpbGRcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7Z2EoYSkmJihhPVN0cmluZyhhKSk7WGYoXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuY2hpbGRcIixhKTt2YXIgYj1uZXcgSyhhKSxjPXRoaXMuVi53KGIpO3JldHVybiBuZXcgUyh0aGlzLkIub2EoYiksYyxNKX07Uy5wcm90b3R5cGUuY2hpbGQ9Uy5wcm90b3R5cGUudztTLnByb3RvdHlwZS5IYT1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lmhhc0NoaWxkXCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO1hmKFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lmhhc0NoaWxkXCIsYSk7dmFyIGI9bmV3IEsoYSk7cmV0dXJuIXRoaXMuQi5vYShiKS5lKCl9O1MucHJvdG90eXBlLmhhc0NoaWxkPVMucHJvdG90eXBlLkhhO1xuUy5wcm90b3R5cGUuQT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZ2V0UHJpb3JpdHlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5BKCkuSygpfTtTLnByb3RvdHlwZS5nZXRQcmlvcml0eT1TLnByb3RvdHlwZS5BO1MucHJvdG90eXBlLmZvckVhY2g9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5mb3JFYWNoXCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZm9yRWFjaFwiLDEsYSwhMSk7aWYodGhpcy5CLk4oKSlyZXR1cm4hMTt2YXIgYj10aGlzO3JldHVybiEhdGhpcy5CLlUodGhpcy5nLGZ1bmN0aW9uKGMsZCl7cmV0dXJuIGEobmV3IFMoZCxiLlYudyhjKSxNKSl9KX07Uy5wcm90b3R5cGUuZm9yRWFjaD1TLnByb3RvdHlwZS5mb3JFYWNoO1xuUy5wcm90b3R5cGUudGQ9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lmhhc0NoaWxkcmVuXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuTigpPyExOiF0aGlzLkIuZSgpfTtTLnByb3RvdHlwZS5oYXNDaGlsZHJlbj1TLnByb3RvdHlwZS50ZDtTLnByb3RvdHlwZS5uYW1lPWZ1bmN0aW9uKCl7UShcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5uYW1lKCkgYmVpbmcgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBGaXJlYmFzZS5EYXRhU25hcHNob3Qua2V5KCkgaW5zdGVhZC5cIik7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5uYW1lXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLmtleSgpfTtTLnByb3RvdHlwZS5uYW1lPVMucHJvdG90eXBlLm5hbWU7Uy5wcm90b3R5cGUua2V5PWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5rZXlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuVi5rZXkoKX07XG5TLnByb3RvdHlwZS5rZXk9Uy5wcm90b3R5cGUua2V5O1MucHJvdG90eXBlLkRiPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5udW1DaGlsZHJlblwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLkRiKCl9O1MucHJvdG90eXBlLm51bUNoaWxkcmVuPVMucHJvdG90eXBlLkRiO1MucHJvdG90eXBlLmxjPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5yZWZcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuVn07Uy5wcm90b3R5cGUucmVmPVMucHJvdG90eXBlLmxjO2Z1bmN0aW9uIEtoKGEsYil7dGhpcy5IPWE7dGhpcy5WYT1PYihhKTt0aGlzLmVhPW5ldyB1Yjt0aGlzLkVkPTE7dGhpcy5SYT1udWxsO2J8fDA8PShcIm9iamVjdFwiPT09dHlwZW9mIHdpbmRvdyYmd2luZG93Lm5hdmlnYXRvciYmd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnR8fFwiXCIpLnNlYXJjaCgvZ29vZ2xlYm90fGdvb2dsZSB3ZWJtYXN0ZXIgdG9vbHN8YmluZ2JvdHx5YWhvbyEgc2x1cnB8YmFpZHVzcGlkZXJ8eWFuZGV4Ym90fGR1Y2tkdWNrYm90L2kpPyh0aGlzLmNhPW5ldyBBZSh0aGlzLkgscSh0aGlzLkdiLHRoaXMpKSxzZXRUaW1lb3V0KHEodGhpcy5UYyx0aGlzLCEwKSwwKSk6dGhpcy5jYT10aGlzLlJhPW5ldyB3aCh0aGlzLkgscSh0aGlzLkdiLHRoaXMpLHEodGhpcy5UYyx0aGlzKSxxKHRoaXMuTmUsdGhpcykpO3RoaXMuUGc9UGIoYSxxKGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBKYih0aGlzLlZhLHRoaXMuY2EpfSx0aGlzKSk7dGhpcy50Yz1uZXcgQ2Y7dGhpcy5CZT1cbm5ldyBuYjt2YXIgYz10aGlzO3RoaXMuemQ9bmV3IGdmKHtYZTpmdW5jdGlvbihhLGIsZixnKXtiPVtdO2Y9Yy5CZS5qKGEucGF0aCk7Zi5lKCl8fChiPWpmKGMuemQsbmV3IFViKHplLGEucGF0aCxmKSksc2V0VGltZW91dChmdW5jdGlvbigpe2coXCJva1wiKX0sMCkpO3JldHVybiBifSxaZDpiYX0pO0xoKHRoaXMsXCJjb25uZWN0ZWRcIiwhMSk7dGhpcy5rYT1uZXcgcWM7dGhpcy5QPW5ldyBFZyhhLHEodGhpcy5jYS5QLHRoaXMuY2EpLHEodGhpcy5jYS5lZSx0aGlzLmNhKSxxKHRoaXMuS2UsdGhpcykpO3RoaXMucGQ9MDt0aGlzLkNlPW51bGw7dGhpcy5PPW5ldyBnZih7WGU6ZnVuY3Rpb24oYSxiLGYsZyl7Yy5jYS54ZihhLGYsYixmdW5jdGlvbihiLGUpe3ZhciBmPWcoYixlKTt6YihjLmVhLGEucGF0aCxmKX0pO3JldHVybltdfSxaZDpmdW5jdGlvbihhLGIpe2MuY2EuT2YoYSxiKX19KX1oPUtoLnByb3RvdHlwZTtcbmgudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4odGhpcy5ILmxiP1wiaHR0cHM6Ly9cIjpcImh0dHA6Ly9cIikrdGhpcy5ILmhvc3R9O2gubmFtZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkguQ2J9O2Z1bmN0aW9uIE1oKGEpe2E9YS5CZS5qKG5ldyBLKFwiLmluZm8vc2VydmVyVGltZU9mZnNldFwiKSkuSygpfHwwO3JldHVybihuZXcgRGF0ZSkuZ2V0VGltZSgpK2F9ZnVuY3Rpb24gTmgoYSl7YT1hPXt0aW1lc3RhbXA6TWgoYSl9O2EudGltZXN0YW1wPWEudGltZXN0YW1wfHwobmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gYX1cbmguR2I9ZnVuY3Rpb24oYSxiLGMsZCl7dGhpcy5wZCsrO3ZhciBlPW5ldyBLKGEpO2I9dGhpcy5DZT90aGlzLkNlKGEsYik6YjthPVtdO2Q/Yz8oYj1uYShiLGZ1bmN0aW9uKGEpe3JldHVybiBMKGEpfSksYT1yZih0aGlzLk8sZSxiLGQpKTooYj1MKGIpLGE9bmYodGhpcy5PLGUsYixkKSk6Yz8oZD1uYShiLGZ1bmN0aW9uKGEpe3JldHVybiBMKGEpfSksYT1tZih0aGlzLk8sZSxkKSk6KGQ9TChiKSxhPWpmKHRoaXMuTyxuZXcgVWIoemUsZSxkKSkpO2Q9ZTswPGEubGVuZ3RoJiYoZD1PaCh0aGlzLGUpKTt6Yih0aGlzLmVhLGQsYSl9O2guVGM9ZnVuY3Rpb24oYSl7TGgodGhpcyxcImNvbm5lY3RlZFwiLGEpOyExPT09YSYmUGgodGhpcyl9O2guTmU9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztZYyhhLGZ1bmN0aW9uKGEsZCl7TGgoYixkLGEpfSl9O2guS2U9ZnVuY3Rpb24oYSl7TGgodGhpcyxcImF1dGhlbnRpY2F0ZWRcIixhKX07XG5mdW5jdGlvbiBMaChhLGIsYyl7Yj1uZXcgSyhcIi8uaW5mby9cIitiKTtjPUwoYyk7dmFyIGQ9YS5CZTtkLlNkPWQuU2QuRyhiLGMpO2M9amYoYS56ZCxuZXcgVWIoemUsYixjKSk7emIoYS5lYSxiLGMpfWguS2I9ZnVuY3Rpb24oYSxiLGMsZCl7dGhpcy5mKFwic2V0XCIse3BhdGg6YS50b1N0cmluZygpLHZhbHVlOmIsWGc6Y30pO3ZhciBlPU5oKHRoaXMpO2I9TChiLGMpO3ZhciBlPXNjKGIsZSksZj10aGlzLkVkKyssZT1oZih0aGlzLk8sYSxlLGYsITApO3ZiKHRoaXMuZWEsZSk7dmFyIGc9dGhpczt0aGlzLmNhLnB1dChhLnRvU3RyaW5nKCksYi5LKCEwKSxmdW5jdGlvbihiLGMpe3ZhciBlPVwib2tcIj09PWI7ZXx8UShcInNldCBhdCBcIithK1wiIGZhaWxlZDogXCIrYik7ZT1sZihnLk8sZiwhZSk7emIoZy5lYSxhLGUpO1FoKGQsYixjKX0pO2U9UmgodGhpcyxhKTtPaCh0aGlzLGUpO3piKHRoaXMuZWEsZSxbXSl9O1xuaC51cGRhdGU9ZnVuY3Rpb24oYSxiLGMpe3RoaXMuZihcInVwZGF0ZVwiLHtwYXRoOmEudG9TdHJpbmcoKSx2YWx1ZTpifSk7dmFyIGQ9ITAsZT1OaCh0aGlzKSxmPXt9O3IoYixmdW5jdGlvbihhLGIpe2Q9ITE7dmFyIGM9TChhKTtmW2JdPXNjKGMsZSl9KTtpZihkKUJiKFwidXBkYXRlKCkgY2FsbGVkIHdpdGggZW1wdHkgZGF0YS4gIERvbid0IGRvIGFueXRoaW5nLlwiKSxRaChjLFwib2tcIik7ZWxzZXt2YXIgZz10aGlzLkVkKyssaz1rZih0aGlzLk8sYSxmLGcpO3ZiKHRoaXMuZWEsayk7dmFyIGw9dGhpczt0aGlzLmNhLnlmKGEudG9TdHJpbmcoKSxiLGZ1bmN0aW9uKGIsZCl7dmFyIGU9XCJva1wiPT09YjtlfHxRKFwidXBkYXRlIGF0IFwiK2ErXCIgZmFpbGVkOiBcIitiKTt2YXIgZT1sZihsLk8sZywhZSksZj1hOzA8ZS5sZW5ndGgmJihmPU9oKGwsYSkpO3piKGwuZWEsZixlKTtRaChjLGIsZCl9KTtiPVJoKHRoaXMsYSk7T2godGhpcyxiKTt6Yih0aGlzLmVhLGEsW10pfX07XG5mdW5jdGlvbiBQaChhKXthLmYoXCJvbkRpc2Nvbm5lY3RFdmVudHNcIik7dmFyIGI9TmgoYSksYz1bXTtyYyhwYyhhLmthLGIpLEYsZnVuY3Rpb24oYixlKXtjPWMuY29uY2F0KGpmKGEuTyxuZXcgVWIoemUsYixlKSkpO3ZhciBmPVJoKGEsYik7T2goYSxmKX0pO2Eua2E9bmV3IHFjO3piKGEuZWEsRixjKX1oLkdkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpczt0aGlzLmNhLkdkKGEudG9TdHJpbmcoKSxmdW5jdGlvbihkLGUpe1wib2tcIj09PWQmJmVnKGMua2EsYSk7UWgoYixkLGUpfSl9O2Z1bmN0aW9uIFNoKGEsYixjLGQpe3ZhciBlPUwoYyk7YS5jYS5MZShiLnRvU3RyaW5nKCksZS5LKCEwKSxmdW5jdGlvbihjLGcpe1wib2tcIj09PWMmJmEua2EubWMoYixlKTtRaChkLGMsZyl9KX1mdW5jdGlvbiBUaChhLGIsYyxkLGUpe3ZhciBmPUwoYyxkKTthLmNhLkxlKGIudG9TdHJpbmcoKSxmLksoITApLGZ1bmN0aW9uKGMsZCl7XCJva1wiPT09YyYmYS5rYS5tYyhiLGYpO1FoKGUsYyxkKX0pfVxuZnVuY3Rpb24gVWgoYSxiLGMsZCl7dmFyIGU9ITAsZjtmb3IoZiBpbiBjKWU9ITE7ZT8oQmIoXCJvbkRpc2Nvbm5lY3QoKS51cGRhdGUoKSBjYWxsZWQgd2l0aCBlbXB0eSBkYXRhLiAgRG9uJ3QgZG8gYW55dGhpbmcuXCIpLFFoKGQsXCJva1wiKSk6YS5jYS5CZihiLnRvU3RyaW5nKCksYyxmdW5jdGlvbihlLGYpe2lmKFwib2tcIj09PWUpZm9yKHZhciBsIGluIGMpe3ZhciBtPUwoY1tsXSk7YS5rYS5tYyhiLncobCksbSl9UWgoZCxlLGYpfSl9ZnVuY3Rpb24gVmgoYSxiLGMpe2M9XCIuaW5mb1wiPT09TyhiLnBhdGgpP2EuemQuT2IoYixjKTphLk8uT2IoYixjKTt4YihhLmVhLGIucGF0aCxjKX1oLnliPWZ1bmN0aW9uKCl7dGhpcy5SYSYmdGhpcy5SYS55YigpfTtoLnFjPWZ1bmN0aW9uKCl7dGhpcy5SYSYmdGhpcy5SYS5xYygpfTtcbmguWWU9ZnVuY3Rpb24oYSl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlKXthPyh0aGlzLllkfHwodGhpcy5ZZD1uZXcgSWIodGhpcy5WYSkpLGE9dGhpcy5ZZC5nZXQoKSk6YT10aGlzLlZhLmdldCgpO3ZhciBiPVJhKHNhKGEpLGZ1bmN0aW9uKGEsYil7cmV0dXJuIE1hdGgubWF4KGIubGVuZ3RoLGEpfSwwKSxjO2ZvcihjIGluIGEpe2Zvcih2YXIgZD1hW2NdLGU9Yy5sZW5ndGg7ZTxiKzI7ZSsrKWMrPVwiIFwiO2NvbnNvbGUubG9nKGMrZCl9fX07aC5aZT1mdW5jdGlvbihhKXtMYih0aGlzLlZhLGEpO3RoaXMuUGcuTWZbYV09ITB9O2guZj1mdW5jdGlvbihhKXt2YXIgYj1cIlwiO3RoaXMuUmEmJihiPXRoaXMuUmEuaWQrXCI6XCIpO0JiKGIsYXJndW1lbnRzKX07XG5mdW5jdGlvbiBRaChhLGIsYyl7YSYmQ2IoZnVuY3Rpb24oKXtpZihcIm9rXCI9PWIpYShudWxsKTtlbHNle3ZhciBkPShifHxcImVycm9yXCIpLnRvVXBwZXJDYXNlKCksZT1kO2MmJihlKz1cIjogXCIrYyk7ZT1FcnJvcihlKTtlLmNvZGU9ZDthKGUpfX0pfTtmdW5jdGlvbiBXaChhLGIsYyxkLGUpe2Z1bmN0aW9uIGYoKXt9YS5mKFwidHJhbnNhY3Rpb24gb24gXCIrYik7dmFyIGc9bmV3IFUoYSxiKTtnLkViKFwidmFsdWVcIixmKTtjPXtwYXRoOmIsdXBkYXRlOmMsSjpkLHN0YXR1czpudWxsLEVmOkdjKCksY2Y6ZSxLZjowLGdlOmZ1bmN0aW9uKCl7Zy5nYyhcInZhbHVlXCIsZil9LGplOm51bGwsQWE6bnVsbCxtZDpudWxsLG5kOm51bGwsb2Q6bnVsbH07ZD1hLk8udWEoYix2b2lkIDApfHxDO2MubWQ9ZDtkPWMudXBkYXRlKGQuSygpKTtpZihuKGQpKXtTZihcInRyYW5zYWN0aW9uIGZhaWxlZDogRGF0YSByZXR1cm5lZCBcIixkLGMucGF0aCk7Yy5zdGF0dXM9MTtlPURmKGEudGMsYik7dmFyIGs9ZS5CYSgpfHxbXTtrLnB1c2goYyk7RWYoZSxrKTtcIm9iamVjdFwiPT09dHlwZW9mIGQmJm51bGwhPT1kJiZ1KGQsXCIucHJpb3JpdHlcIik/KGs9dyhkLFwiLnByaW9yaXR5XCIpLEooUWYoayksXCJJbnZhbGlkIHByaW9yaXR5IHJldHVybmVkIGJ5IHRyYW5zYWN0aW9uLiBQcmlvcml0eSBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nLCBmaW5pdGUgbnVtYmVyLCBzZXJ2ZXIgdmFsdWUsIG9yIG51bGwuXCIpKTpcbms9KGEuTy51YShiKXx8QykuQSgpLksoKTtlPU5oKGEpO2Q9TChkLGspO2U9c2MoZCxlKTtjLm5kPWQ7Yy5vZD1lO2MuQWE9YS5FZCsrO2M9aGYoYS5PLGIsZSxjLkFhLGMuY2YpO3piKGEuZWEsYixjKTtYaChhKX1lbHNlIGMuZ2UoKSxjLm5kPW51bGwsYy5vZD1udWxsLGMuSiYmKGE9bmV3IFMoYy5tZCxuZXcgVShhLGMucGF0aCksTSksYy5KKG51bGwsITEsYSkpfWZ1bmN0aW9uIFhoKGEsYil7dmFyIGM9Ynx8YS50YztifHxZaChhLGMpO2lmKG51bGwhPT1jLkJhKCkpe3ZhciBkPVpoKGEsYyk7SigwPGQubGVuZ3RoLFwiU2VuZGluZyB6ZXJvIGxlbmd0aCB0cmFuc2FjdGlvbiBxdWV1ZVwiKTtTYShkLGZ1bmN0aW9uKGEpe3JldHVybiAxPT09YS5zdGF0dXN9KSYmJGgoYSxjLnBhdGgoKSxkKX1lbHNlIGMudGQoKSYmYy5VKGZ1bmN0aW9uKGIpe1hoKGEsYil9KX1cbmZ1bmN0aW9uICRoKGEsYixjKXtmb3IodmFyIGQ9UWEoYyxmdW5jdGlvbihhKXtyZXR1cm4gYS5BYX0pLGU9YS5PLnVhKGIsZCl8fEMsZD1lLGU9ZS5oYXNoKCksZj0wO2Y8Yy5sZW5ndGg7ZisrKXt2YXIgZz1jW2ZdO0ooMT09PWcuc3RhdHVzLFwidHJ5VG9TZW5kVHJhbnNhY3Rpb25RdWV1ZV86IGl0ZW1zIGluIHF1ZXVlIHNob3VsZCBhbGwgYmUgcnVuLlwiKTtnLnN0YXR1cz0yO2cuS2YrKzt2YXIgaz1OKGIsZy5wYXRoKSxkPWQuRyhrLGcubmQpfWQ9ZC5LKCEwKTthLmNhLnB1dChiLnRvU3RyaW5nKCksZCxmdW5jdGlvbihkKXthLmYoXCJ0cmFuc2FjdGlvbiBwdXQgcmVzcG9uc2VcIix7cGF0aDpiLnRvU3RyaW5nKCksc3RhdHVzOmR9KTt2YXIgZT1bXTtpZihcIm9rXCI9PT1kKXtkPVtdO2ZvcihmPTA7ZjxjLmxlbmd0aDtmKyspe2NbZl0uc3RhdHVzPTM7ZT1lLmNvbmNhdChsZihhLk8sY1tmXS5BYSkpO2lmKGNbZl0uSil7dmFyIGc9Y1tmXS5vZCxrPW5ldyBVKGEsY1tmXS5wYXRoKTtkLnB1c2gocShjW2ZdLkosXG5udWxsLG51bGwsITAsbmV3IFMoZyxrLE0pKSl9Y1tmXS5nZSgpfVloKGEsRGYoYS50YyxiKSk7WGgoYSk7emIoYS5lYSxiLGUpO2ZvcihmPTA7ZjxkLmxlbmd0aDtmKyspQ2IoZFtmXSl9ZWxzZXtpZihcImRhdGFzdGFsZVwiPT09ZClmb3IoZj0wO2Y8Yy5sZW5ndGg7ZisrKWNbZl0uc3RhdHVzPTQ9PT1jW2ZdLnN0YXR1cz81OjE7ZWxzZSBmb3IoUShcInRyYW5zYWN0aW9uIGF0IFwiK2IudG9TdHJpbmcoKStcIiBmYWlsZWQ6IFwiK2QpLGY9MDtmPGMubGVuZ3RoO2YrKyljW2ZdLnN0YXR1cz01LGNbZl0uamU9ZDtPaChhLGIpfX0sZSl9ZnVuY3Rpb24gT2goYSxiKXt2YXIgYz1haShhLGIpLGQ9Yy5wYXRoKCksYz1aaChhLGMpO2JpKGEsYyxkKTtyZXR1cm4gZH1cbmZ1bmN0aW9uIGJpKGEsYixjKXtpZigwIT09Yi5sZW5ndGgpe2Zvcih2YXIgZD1bXSxlPVtdLGY9UWEoYixmdW5jdGlvbihhKXtyZXR1cm4gYS5BYX0pLGc9MDtnPGIubGVuZ3RoO2crKyl7dmFyIGs9YltnXSxsPU4oYyxrLnBhdGgpLG09ITEsdjtKKG51bGwhPT1sLFwicmVydW5UcmFuc2FjdGlvbnNVbmRlck5vZGVfOiByZWxhdGl2ZVBhdGggc2hvdWxkIG5vdCBiZSBudWxsLlwiKTtpZig1PT09ay5zdGF0dXMpbT0hMCx2PWsuamUsZT1lLmNvbmNhdChsZihhLk8say5BYSwhMCkpO2Vsc2UgaWYoMT09PWsuc3RhdHVzKWlmKDI1PD1rLktmKW09ITAsdj1cIm1heHJldHJ5XCIsZT1lLmNvbmNhdChsZihhLk8say5BYSwhMCkpO2Vsc2V7dmFyIHk9YS5PLnVhKGsucGF0aCxmKXx8QztrLm1kPXk7dmFyIEk9YltnXS51cGRhdGUoeS5LKCkpO24oSSk/KFNmKFwidHJhbnNhY3Rpb24gZmFpbGVkOiBEYXRhIHJldHVybmVkIFwiLEksay5wYXRoKSxsPUwoSSksXCJvYmplY3RcIj09PXR5cGVvZiBJJiZudWxsIT1cbkkmJnUoSSxcIi5wcmlvcml0eVwiKXx8KGw9bC5kYSh5LkEoKSkpLHk9ay5BYSxJPU5oKGEpLEk9c2MobCxJKSxrLm5kPWwsay5vZD1JLGsuQWE9YS5FZCsrLFZhKGYseSksZT1lLmNvbmNhdChoZihhLk8say5wYXRoLEksay5BYSxrLmNmKSksZT1lLmNvbmNhdChsZihhLk8seSwhMCkpKToobT0hMCx2PVwibm9kYXRhXCIsZT1lLmNvbmNhdChsZihhLk8say5BYSwhMCkpKX16YihhLmVhLGMsZSk7ZT1bXTttJiYoYltnXS5zdGF0dXM9MyxzZXRUaW1lb3V0KGJbZ10uZ2UsTWF0aC5mbG9vcigwKSksYltnXS5KJiYoXCJub2RhdGFcIj09PXY/KGs9bmV3IFUoYSxiW2ddLnBhdGgpLGQucHVzaChxKGJbZ10uSixudWxsLG51bGwsITEsbmV3IFMoYltnXS5tZCxrLE0pKSkpOmQucHVzaChxKGJbZ10uSixudWxsLEVycm9yKHYpLCExLG51bGwpKSkpfVloKGEsYS50Yyk7Zm9yKGc9MDtnPGQubGVuZ3RoO2crKylDYihkW2ddKTtYaChhKX19XG5mdW5jdGlvbiBhaShhLGIpe2Zvcih2YXIgYyxkPWEudGM7bnVsbCE9PShjPU8oYikpJiZudWxsPT09ZC5CYSgpOylkPURmKGQsYyksYj1HKGIpO3JldHVybiBkfWZ1bmN0aW9uIFpoKGEsYil7dmFyIGM9W107Y2koYSxiLGMpO2Muc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhLkVmLWIuRWZ9KTtyZXR1cm4gY31mdW5jdGlvbiBjaShhLGIsYyl7dmFyIGQ9Yi5CYSgpO2lmKG51bGwhPT1kKWZvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKWMucHVzaChkW2VdKTtiLlUoZnVuY3Rpb24oYil7Y2koYSxiLGMpfSl9ZnVuY3Rpb24gWWgoYSxiKXt2YXIgYz1iLkJhKCk7aWYoYyl7Zm9yKHZhciBkPTAsZT0wO2U8Yy5sZW5ndGg7ZSsrKTMhPT1jW2VdLnN0YXR1cyYmKGNbZF09Y1tlXSxkKyspO2MubGVuZ3RoPWQ7RWYoYiwwPGMubGVuZ3RoP2M6bnVsbCl9Yi5VKGZ1bmN0aW9uKGIpe1loKGEsYil9KX1cbmZ1bmN0aW9uIFJoKGEsYil7dmFyIGM9YWkoYSxiKS5wYXRoKCksZD1EZihhLnRjLGIpO0hmKGQsZnVuY3Rpb24oYil7ZGkoYSxiKX0pO2RpKGEsZCk7R2YoZCxmdW5jdGlvbihiKXtkaShhLGIpfSk7cmV0dXJuIGN9XG5mdW5jdGlvbiBkaShhLGIpe3ZhciBjPWIuQmEoKTtpZihudWxsIT09Yyl7Zm9yKHZhciBkPVtdLGU9W10sZj0tMSxnPTA7ZzxjLmxlbmd0aDtnKyspNCE9PWNbZ10uc3RhdHVzJiYoMj09PWNbZ10uc3RhdHVzPyhKKGY9PT1nLTEsXCJBbGwgU0VOVCBpdGVtcyBzaG91bGQgYmUgYXQgYmVnaW5uaW5nIG9mIHF1ZXVlLlwiKSxmPWcsY1tnXS5zdGF0dXM9NCxjW2ddLmplPVwic2V0XCIpOihKKDE9PT1jW2ddLnN0YXR1cyxcIlVuZXhwZWN0ZWQgdHJhbnNhY3Rpb24gc3RhdHVzIGluIGFib3J0XCIpLGNbZ10uZ2UoKSxlPWUuY29uY2F0KGxmKGEuTyxjW2ddLkFhLCEwKSksY1tnXS5KJiZkLnB1c2gocShjW2ddLkosbnVsbCxFcnJvcihcInNldFwiKSwhMSxudWxsKSkpKTstMT09PWY/RWYoYixudWxsKTpjLmxlbmd0aD1mKzE7emIoYS5lYSxiLnBhdGgoKSxlKTtmb3IoZz0wO2c8ZC5sZW5ndGg7ZysrKUNiKGRbZ10pfX07ZnVuY3Rpb24gVygpe3RoaXMubmM9e307dGhpcy5QZj0hMX1jYShXKTtXLnByb3RvdHlwZS55Yj1mdW5jdGlvbigpe2Zvcih2YXIgYSBpbiB0aGlzLm5jKXRoaXMubmNbYV0ueWIoKX07Vy5wcm90b3R5cGUuaW50ZXJydXB0PVcucHJvdG90eXBlLnliO1cucHJvdG90eXBlLnFjPWZ1bmN0aW9uKCl7Zm9yKHZhciBhIGluIHRoaXMubmMpdGhpcy5uY1thXS5xYygpfTtXLnByb3RvdHlwZS5yZXN1bWU9Vy5wcm90b3R5cGUucWM7Vy5wcm90b3R5cGUudWU9ZnVuY3Rpb24oKXt0aGlzLlBmPSEwfTtmdW5jdGlvbiBYKGEsYil7dGhpcy5hZD1hO3RoaXMucWE9Yn1YLnByb3RvdHlwZS5jYW5jZWw9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLmNhbmNlbFwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuY2FuY2VsXCIsMSxhLCEwKTt0aGlzLmFkLkdkKHRoaXMucWEsYXx8bnVsbCl9O1gucHJvdG90eXBlLmNhbmNlbD1YLnByb3RvdHlwZS5jYW5jZWw7WC5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5yZW1vdmVcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5yZW1vdmVcIix0aGlzLnFhKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkucmVtb3ZlXCIsMSxhLCEwKTtTaCh0aGlzLmFkLHRoaXMucWEsbnVsbCxhKX07WC5wcm90b3R5cGUucmVtb3ZlPVgucHJvdG90eXBlLnJlbW92ZTtcblgucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRcIix0aGlzLnFhKTtSZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFwiLGEsdGhpcy5xYSwhMSk7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFwiLDIsYiwhMCk7U2godGhpcy5hZCx0aGlzLnFhLGEsYil9O1gucHJvdG90eXBlLnNldD1YLnByb3RvdHlwZS5zZXQ7XG5YLnByb3RvdHlwZS5LYj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLHRoaXMucWEpO1JmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsYSx0aGlzLnFhLCExKTtVZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLDIsYik7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLDMsYywhMCk7VGgodGhpcy5hZCx0aGlzLnFhLGEsYixjKX07WC5wcm90b3R5cGUuc2V0V2l0aFByaW9yaXR5PVgucHJvdG90eXBlLktiO1xuWC5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZVwiLHRoaXMucWEpO2lmKGVhKGEpKXtmb3IodmFyIGM9e30sZD0wO2Q8YS5sZW5ndGg7KytkKWNbXCJcIitkXT1hW2RdO2E9YztRKFwiUGFzc2luZyBhbiBBcnJheSB0byBGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGUoKSBpcyBkZXByZWNhdGVkLiBVc2Ugc2V0KCkgaWYgeW91IHdhbnQgdG8gb3ZlcndyaXRlIHRoZSBleGlzdGluZyBkYXRhLCBvciBhbiBPYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXMgaWYgeW91IHJlYWxseSBkbyB3YW50IHRvIG9ubHkgdXBkYXRlIHNvbWUgb2YgdGhlIGNoaWxkcmVuLlwiKX1UZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZVwiLGEsdGhpcy5xYSk7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZVwiLDIsYiwhMCk7XG5VaCh0aGlzLmFkLHRoaXMucWEsYSxiKX07WC5wcm90b3R5cGUudXBkYXRlPVgucHJvdG90eXBlLnVwZGF0ZTtmdW5jdGlvbiBZKGEsYixjLGQpe3RoaXMuaz1hO3RoaXMucGF0aD1iO3RoaXMubj1jO3RoaXMuamM9ZH1cbmZ1bmN0aW9uIGVpKGEpe3ZhciBiPW51bGwsYz1udWxsO2EubGEmJihiPW9kKGEpKTthLm5hJiYoYz1xZChhKSk7aWYoYS5nPT09VmQpe2lmKGEubGEpe2lmKFwiW01JTl9OQU1FXVwiIT1uZChhKSl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IGtleSwgeW91IG1heSBvbmx5IHBhc3Mgb25lIGFyZ3VtZW50IHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSwgb3IgZXF1YWxUbygpLlwiKTtpZihcInN0cmluZ1wiIT09dHlwZW9mIGIpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBrZXksIHRoZSBhcmd1bWVudCBwYXNzZWQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLG9yIGVxdWFsVG8oKSBtdXN0IGJlIGEgc3RyaW5nLlwiKTt9aWYoYS5uYSl7aWYoXCJbTUFYX05BTUVdXCIhPXBkKGEpKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkga2V5LCB5b3UgbWF5IG9ubHkgcGFzcyBvbmUgYXJndW1lbnQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLCBvciBlcXVhbFRvKCkuXCIpO2lmKFwic3RyaW5nXCIhPT1cbnR5cGVvZiBjKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkga2V5LCB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSxvciBlcXVhbFRvKCkgbXVzdCBiZSBhIHN0cmluZy5cIik7fX1lbHNlIGlmKGEuZz09PU0pe2lmKG51bGwhPWImJiFRZihiKXx8bnVsbCE9YyYmIVFmKGMpKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkgcHJpb3JpdHksIHRoZSBmaXJzdCBhcmd1bWVudCBwYXNzZWQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLCBvciBlcXVhbFRvKCkgbXVzdCBiZSBhIHZhbGlkIHByaW9yaXR5IHZhbHVlIChudWxsLCBhIG51bWJlciwgb3IgYSBzdHJpbmcpLlwiKTt9ZWxzZSBpZihKKGEuZyBpbnN0YW5jZW9mIFJkfHxhLmc9PT1ZZCxcInVua25vd24gaW5kZXggdHlwZS5cIiksbnVsbCE9YiYmXCJvYmplY3RcIj09PXR5cGVvZiBifHxudWxsIT1jJiZcIm9iamVjdFwiPT09dHlwZW9mIGMpdGhyb3cgRXJyb3IoXCJRdWVyeTogRmlyc3QgYXJndW1lbnQgcGFzc2VkIHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSwgb3IgZXF1YWxUbygpIGNhbm5vdCBiZSBhbiBvYmplY3QuXCIpO1xufWZ1bmN0aW9uIGZpKGEpe2lmKGEubGEmJmEubmEmJmEuaWEmJighYS5pYXx8XCJcIj09PWEuTmIpKXRocm93IEVycm9yKFwiUXVlcnk6IENhbid0IGNvbWJpbmUgc3RhcnRBdCgpLCBlbmRBdCgpLCBhbmQgbGltaXQoKS4gVXNlIGxpbWl0VG9GaXJzdCgpIG9yIGxpbWl0VG9MYXN0KCkgaW5zdGVhZC5cIik7fWZ1bmN0aW9uIGdpKGEsYil7aWYoITA9PT1hLmpjKXRocm93IEVycm9yKGIrXCI6IFlvdSBjYW4ndCBjb21iaW5lIG11bHRpcGxlIG9yZGVyQnkgY2FsbHMuXCIpO31ZLnByb3RvdHlwZS5sYz1mdW5jdGlvbigpe3goXCJRdWVyeS5yZWZcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIG5ldyBVKHRoaXMuayx0aGlzLnBhdGgpfTtZLnByb3RvdHlwZS5yZWY9WS5wcm90b3R5cGUubGM7XG5ZLnByb3RvdHlwZS5FYj1mdW5jdGlvbihhLGIsYyxkKXt4KFwiUXVlcnkub25cIiwyLDQsYXJndW1lbnRzLmxlbmd0aCk7VmYoXCJRdWVyeS5vblwiLGEsITEpO0EoXCJRdWVyeS5vblwiLDIsYiwhMSk7dmFyIGU9aGkoXCJRdWVyeS5vblwiLGMsZCk7aWYoXCJ2YWx1ZVwiPT09YSlWaCh0aGlzLmssdGhpcyxuZXcgamQoYixlLmNhbmNlbHx8bnVsbCxlLk1hfHxudWxsKSk7ZWxzZXt2YXIgZj17fTtmW2FdPWI7VmgodGhpcy5rLHRoaXMsbmV3IGtkKGYsZS5jYW5jZWwsZS5NYSkpfXJldHVybiBifTtZLnByb3RvdHlwZS5vbj1ZLnByb3RvdHlwZS5FYjtcblkucHJvdG90eXBlLmdjPWZ1bmN0aW9uKGEsYixjKXt4KFwiUXVlcnkub2ZmXCIsMCwzLGFyZ3VtZW50cy5sZW5ndGgpO1ZmKFwiUXVlcnkub2ZmXCIsYSwhMCk7QShcIlF1ZXJ5Lm9mZlwiLDIsYiwhMCk7bGIoXCJRdWVyeS5vZmZcIiwzLGMpO3ZhciBkPW51bGwsZT1udWxsO1widmFsdWVcIj09PWE/ZD1uZXcgamQoYnx8bnVsbCxudWxsLGN8fG51bGwpOmEmJihiJiYoZT17fSxlW2FdPWIpLGQ9bmV3IGtkKGUsbnVsbCxjfHxudWxsKSk7ZT10aGlzLms7ZD1cIi5pbmZvXCI9PT1PKHRoaXMucGF0aCk/ZS56ZC5rYih0aGlzLGQpOmUuTy5rYih0aGlzLGQpO3hiKGUuZWEsdGhpcy5wYXRoLGQpfTtZLnByb3RvdHlwZS5vZmY9WS5wcm90b3R5cGUuZ2M7XG5ZLnByb3RvdHlwZS5BZz1mdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGMoZyl7ZiYmKGY9ITEsZS5nYyhhLGMpLGIuY2FsbChkLk1hLGcpKX14KFwiUXVlcnkub25jZVwiLDIsNCxhcmd1bWVudHMubGVuZ3RoKTtWZihcIlF1ZXJ5Lm9uY2VcIixhLCExKTtBKFwiUXVlcnkub25jZVwiLDIsYiwhMSk7dmFyIGQ9aGkoXCJRdWVyeS5vbmNlXCIsYXJndW1lbnRzWzJdLGFyZ3VtZW50c1szXSksZT10aGlzLGY9ITA7dGhpcy5FYihhLGMsZnVuY3Rpb24oYil7ZS5nYyhhLGMpO2QuY2FuY2VsJiZkLmNhbmNlbC5jYWxsKGQuTWEsYil9KX07WS5wcm90b3R5cGUub25jZT1ZLnByb3RvdHlwZS5BZztcblkucHJvdG90eXBlLkdlPWZ1bmN0aW9uKGEpe1EoXCJRdWVyeS5saW1pdCgpIGJlaW5nIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgUXVlcnkubGltaXRUb0ZpcnN0KCkgb3IgUXVlcnkubGltaXRUb0xhc3QoKSBpbnN0ZWFkLlwiKTt4KFwiUXVlcnkubGltaXRcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7aWYoIWdhKGEpfHxNYXRoLmZsb29yKGEpIT09YXx8MD49YSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0OiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci5cIik7aWYodGhpcy5uLmlhKXRocm93IEVycm9yKFwiUXVlcnkubGltaXQ6IExpbWl0IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGxpbWl0LCBsaW1pdFRvRmlyc3QsIG9ybGltaXRUb0xhc3QuXCIpO3ZhciBiPXRoaXMubi5HZShhKTtmaShiKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxiLHRoaXMuamMpfTtZLnByb3RvdHlwZS5saW1pdD1ZLnByb3RvdHlwZS5HZTtcblkucHJvdG90eXBlLkhlPWZ1bmN0aW9uKGEpe3goXCJRdWVyeS5saW1pdFRvRmlyc3RcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7aWYoIWdhKGEpfHxNYXRoLmZsb29yKGEpIT09YXx8MD49YSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0VG9GaXJzdDogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCIpO2lmKHRoaXMubi5pYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0VG9GaXJzdDogTGltaXQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gbGltaXQsIGxpbWl0VG9GaXJzdCwgb3IgbGltaXRUb0xhc3QpLlwiKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCx0aGlzLm4uSGUoYSksdGhpcy5qYyl9O1kucHJvdG90eXBlLmxpbWl0VG9GaXJzdD1ZLnByb3RvdHlwZS5IZTtcblkucHJvdG90eXBlLkllPWZ1bmN0aW9uKGEpe3goXCJRdWVyeS5saW1pdFRvTGFzdFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZighZ2EoYSl8fE1hdGguZmxvb3IoYSkhPT1hfHwwPj1hKXRocm93IEVycm9yKFwiUXVlcnkubGltaXRUb0xhc3Q6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLlwiKTtpZih0aGlzLm4uaWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdFRvTGFzdDogTGltaXQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gbGltaXQsIGxpbWl0VG9GaXJzdCwgb3IgbGltaXRUb0xhc3QpLlwiKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCx0aGlzLm4uSWUoYSksdGhpcy5qYyl9O1kucHJvdG90eXBlLmxpbWl0VG9MYXN0PVkucHJvdG90eXBlLkllO1xuWS5wcm90b3R5cGUuQmc9ZnVuY3Rpb24oYSl7eChcIlF1ZXJ5Lm9yZGVyQnlDaGlsZFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZihcIiRrZXlcIj09PWEpdGhyb3cgRXJyb3IoJ1F1ZXJ5Lm9yZGVyQnlDaGlsZDogXCIka2V5XCIgaXMgaW52YWxpZC4gIFVzZSBRdWVyeS5vcmRlckJ5S2V5KCkgaW5zdGVhZC4nKTtpZihcIiRwcmlvcml0eVwiPT09YSl0aHJvdyBFcnJvcignUXVlcnkub3JkZXJCeUNoaWxkOiBcIiRwcmlvcml0eVwiIGlzIGludmFsaWQuICBVc2UgUXVlcnkub3JkZXJCeVByaW9yaXR5KCkgaW5zdGVhZC4nKTtpZihcIiR2YWx1ZVwiPT09YSl0aHJvdyBFcnJvcignUXVlcnkub3JkZXJCeUNoaWxkOiBcIiR2YWx1ZVwiIGlzIGludmFsaWQuICBVc2UgUXVlcnkub3JkZXJCeVZhbHVlKCkgaW5zdGVhZC4nKTtXZihcIlF1ZXJ5Lm9yZGVyQnlDaGlsZFwiLDEsYSwhMSk7Z2kodGhpcyxcIlF1ZXJ5Lm9yZGVyQnlDaGlsZFwiKTt2YXIgYj1iZSh0aGlzLm4sbmV3IFJkKGEpKTtlaShiKTtyZXR1cm4gbmV3IFkodGhpcy5rLFxudGhpcy5wYXRoLGIsITApfTtZLnByb3RvdHlwZS5vcmRlckJ5Q2hpbGQ9WS5wcm90b3R5cGUuQmc7WS5wcm90b3R5cGUuQ2c9ZnVuY3Rpb24oKXt4KFwiUXVlcnkub3JkZXJCeUtleVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtnaSh0aGlzLFwiUXVlcnkub3JkZXJCeUtleVwiKTt2YXIgYT1iZSh0aGlzLm4sVmQpO2VpKGEpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGEsITApfTtZLnByb3RvdHlwZS5vcmRlckJ5S2V5PVkucHJvdG90eXBlLkNnO1kucHJvdG90eXBlLkRnPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5Lm9yZGVyQnlQcmlvcml0eVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtnaSh0aGlzLFwiUXVlcnkub3JkZXJCeVByaW9yaXR5XCIpO3ZhciBhPWJlKHRoaXMubixNKTtlaShhKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxhLCEwKX07WS5wcm90b3R5cGUub3JkZXJCeVByaW9yaXR5PVkucHJvdG90eXBlLkRnO1xuWS5wcm90b3R5cGUuRWc9ZnVuY3Rpb24oKXt4KFwiUXVlcnkub3JkZXJCeVZhbHVlXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2dpKHRoaXMsXCJRdWVyeS5vcmRlckJ5VmFsdWVcIik7dmFyIGE9YmUodGhpcy5uLFlkKTtlaShhKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxhLCEwKX07WS5wcm90b3R5cGUub3JkZXJCeVZhbHVlPVkucHJvdG90eXBlLkVnO1xuWS5wcm90b3R5cGUuWGQ9ZnVuY3Rpb24oYSxiKXt4KFwiUXVlcnkuc3RhcnRBdFwiLDAsMixhcmd1bWVudHMubGVuZ3RoKTtSZihcIlF1ZXJ5LnN0YXJ0QXRcIixhLHRoaXMucGF0aCwhMCk7V2YoXCJRdWVyeS5zdGFydEF0XCIsMixiLCEwKTt2YXIgYz10aGlzLm4uWGQoYSxiKTtmaShjKTtlaShjKTtpZih0aGlzLm4ubGEpdGhyb3cgRXJyb3IoXCJRdWVyeS5zdGFydEF0OiBTdGFydGluZyBwb2ludCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBzdGFydEF0IG9yIGVxdWFsVG8pLlwiKTtuKGEpfHwoYj1hPW51bGwpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGMsdGhpcy5qYyl9O1kucHJvdG90eXBlLnN0YXJ0QXQ9WS5wcm90b3R5cGUuWGQ7XG5ZLnByb3RvdHlwZS5xZD1mdW5jdGlvbihhLGIpe3goXCJRdWVyeS5lbmRBdFwiLDAsMixhcmd1bWVudHMubGVuZ3RoKTtSZihcIlF1ZXJ5LmVuZEF0XCIsYSx0aGlzLnBhdGgsITApO1dmKFwiUXVlcnkuZW5kQXRcIiwyLGIsITApO3ZhciBjPXRoaXMubi5xZChhLGIpO2ZpKGMpO2VpKGMpO2lmKHRoaXMubi5uYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmVuZEF0OiBFbmRpbmcgcG9pbnQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gZW5kQXQgb3IgZXF1YWxUbykuXCIpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGMsdGhpcy5qYyl9O1kucHJvdG90eXBlLmVuZEF0PVkucHJvdG90eXBlLnFkO1xuWS5wcm90b3R5cGUuaGc9ZnVuY3Rpb24oYSxiKXt4KFwiUXVlcnkuZXF1YWxUb1wiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtSZihcIlF1ZXJ5LmVxdWFsVG9cIixhLHRoaXMucGF0aCwhMSk7V2YoXCJRdWVyeS5lcXVhbFRvXCIsMixiLCEwKTtpZih0aGlzLm4ubGEpdGhyb3cgRXJyb3IoXCJRdWVyeS5lcXVhbFRvOiBTdGFydGluZyBwb2ludCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBlbmRBdCBvciBlcXVhbFRvKS5cIik7aWYodGhpcy5uLm5hKXRocm93IEVycm9yKFwiUXVlcnkuZXF1YWxUbzogRW5kaW5nIHBvaW50IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGVuZEF0IG9yIGVxdWFsVG8pLlwiKTtyZXR1cm4gdGhpcy5YZChhLGIpLnFkKGEsYil9O1kucHJvdG90eXBlLmVxdWFsVG89WS5wcm90b3R5cGUuaGc7XG5ZLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3goXCJRdWVyeS50b1N0cmluZ1wiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtmb3IodmFyIGE9dGhpcy5wYXRoLGI9XCJcIixjPWEuWTtjPGEuby5sZW5ndGg7YysrKVwiXCIhPT1hLm9bY10mJihiKz1cIi9cIitlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGEub1tjXSkpKTthPXRoaXMuay50b1N0cmluZygpKyhifHxcIi9cIik7Yj1qYihlZSh0aGlzLm4pKTtyZXR1cm4gYSs9Yi5yZXBsYWNlKC9eJi8sXCJcIil9O1kucHJvdG90eXBlLnRvU3RyaW5nPVkucHJvdG90eXBlLnRvU3RyaW5nO1kucHJvdG90eXBlLndhPWZ1bmN0aW9uKCl7dmFyIGE9V2MoY2UodGhpcy5uKSk7cmV0dXJuXCJ7fVwiPT09YT9cImRlZmF1bHRcIjphfTtcbmZ1bmN0aW9uIGhpKGEsYixjKXt2YXIgZD17Y2FuY2VsOm51bGwsTWE6bnVsbH07aWYoYiYmYylkLmNhbmNlbD1iLEEoYSwzLGQuY2FuY2VsLCEwKSxkLk1hPWMsbGIoYSw0LGQuTWEpO2Vsc2UgaWYoYilpZihcIm9iamVjdFwiPT09dHlwZW9mIGImJm51bGwhPT1iKWQuTWE9YjtlbHNlIGlmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBiKWQuY2FuY2VsPWI7ZWxzZSB0aHJvdyBFcnJvcih6KGEsMywhMCkrXCIgbXVzdCBlaXRoZXIgYmUgYSBjYW5jZWwgY2FsbGJhY2sgb3IgYSBjb250ZXh0IG9iamVjdC5cIik7cmV0dXJuIGR9O3ZhciBaPXt9O1oudmM9d2g7Wi5EYXRhQ29ubmVjdGlvbj1aLnZjO3doLnByb3RvdHlwZS5PZz1mdW5jdGlvbihhLGIpe3RoaXMuRGEoXCJxXCIse3A6YX0sYil9O1oudmMucHJvdG90eXBlLnNpbXBsZUxpc3Rlbj1aLnZjLnByb3RvdHlwZS5PZzt3aC5wcm90b3R5cGUuZ2c9ZnVuY3Rpb24oYSxiKXt0aGlzLkRhKFwiZWNob1wiLHtkOmF9LGIpfTtaLnZjLnByb3RvdHlwZS5lY2hvPVoudmMucHJvdG90eXBlLmdnO3doLnByb3RvdHlwZS5pbnRlcnJ1cHQ9d2gucHJvdG90eXBlLnliO1ouU2Y9a2g7Wi5SZWFsVGltZUNvbm5lY3Rpb249Wi5TZjtraC5wcm90b3R5cGUuc2VuZFJlcXVlc3Q9a2gucHJvdG90eXBlLkRhO2toLnByb3RvdHlwZS5jbG9zZT1raC5wcm90b3R5cGUuY2xvc2U7XG5aLm9nPWZ1bmN0aW9uKGEpe3ZhciBiPXdoLnByb3RvdHlwZS5wdXQ7d2gucHJvdG90eXBlLnB1dD1mdW5jdGlvbihjLGQsZSxmKXtuKGYpJiYoZj1hKCkpO2IuY2FsbCh0aGlzLGMsZCxlLGYpfTtyZXR1cm4gZnVuY3Rpb24oKXt3aC5wcm90b3R5cGUucHV0PWJ9fTtaLmhpamFja0hhc2g9Wi5vZztaLlJmPUVjO1ouQ29ubmVjdGlvblRhcmdldD1aLlJmO1oud2E9ZnVuY3Rpb24oYSl7cmV0dXJuIGEud2EoKX07Wi5xdWVyeUlkZW50aWZpZXI9Wi53YTtaLnFnPWZ1bmN0aW9uKGEpe3JldHVybiBhLmsuUmEuYWF9O1oubGlzdGVucz1aLnFnO1oudWU9ZnVuY3Rpb24oYSl7YS51ZSgpfTtaLmZvcmNlUmVzdENsaWVudD1aLnVlO2Z1bmN0aW9uIFUoYSxiKXt2YXIgYyxkLGU7aWYoYSBpbnN0YW5jZW9mIEtoKWM9YSxkPWI7ZWxzZXt4KFwibmV3IEZpcmViYXNlXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO2Q9UmMoYXJndW1lbnRzWzBdKTtjPWQuUWc7XCJmaXJlYmFzZVwiPT09ZC5kb21haW4mJlFjKGQuaG9zdCtcIiBpcyBubyBsb25nZXIgc3VwcG9ydGVkLiBQbGVhc2UgdXNlIDxZT1VSIEZJUkVCQVNFPi5maXJlYmFzZWlvLmNvbSBpbnN0ZWFkXCIpO2N8fFFjKFwiQ2Fubm90IHBhcnNlIEZpcmViYXNlIHVybC4gUGxlYXNlIHVzZSBodHRwczovLzxZT1VSIEZJUkVCQVNFPi5maXJlYmFzZWlvLmNvbVwiKTtkLmxifHxcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmd2luZG93LmxvY2F0aW9uJiZ3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wmJi0xIT09d2luZG93LmxvY2F0aW9uLnByb3RvY29sLmluZGV4T2YoXCJodHRwczpcIikmJlEoXCJJbnNlY3VyZSBGaXJlYmFzZSBhY2Nlc3MgZnJvbSBhIHNlY3VyZSBwYWdlLiBQbGVhc2UgdXNlIGh0dHBzIGluIGNhbGxzIHRvIG5ldyBGaXJlYmFzZSgpLlwiKTtcbmM9bmV3IEVjKGQuaG9zdCxkLmxiLGMsXCJ3c1wiPT09ZC5zY2hlbWV8fFwid3NzXCI9PT1kLnNjaGVtZSk7ZD1uZXcgSyhkLlpjKTtlPWQudG9TdHJpbmcoKTt2YXIgZjshKGY9IXAoYy5ob3N0KXx8MD09PWMuaG9zdC5sZW5ndGh8fCFQZihjLkNiKSkmJihmPTAhPT1lLmxlbmd0aCkmJihlJiYoZT1lLnJlcGxhY2UoL15cXC8qXFwuaW5mbyhcXC98JCkvLFwiL1wiKSksZj0hKHAoZSkmJjAhPT1lLmxlbmd0aCYmIU9mLnRlc3QoZSkpKTtpZihmKXRocm93IEVycm9yKHooXCJuZXcgRmlyZWJhc2VcIiwxLCExKSsnbXVzdCBiZSBhIHZhbGlkIGZpcmViYXNlIFVSTCBhbmQgdGhlIHBhdGggY2FuXFwndCBjb250YWluIFwiLlwiLCBcIiNcIiwgXCIkXCIsIFwiW1wiLCBvciBcIl1cIi4nKTtpZihiKWlmKGIgaW5zdGFuY2VvZiBXKWU9YjtlbHNlIGlmKHAoYikpZT1XLnViKCksYy5MZD1iO2Vsc2UgdGhyb3cgRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIEZpcmViYXNlLkNvbnRleHQgZm9yIHNlY29uZCBhcmd1bWVudCB0byBuZXcgRmlyZWJhc2UoKVwiKTtcbmVsc2UgZT1XLnViKCk7Zj1jLnRvU3RyaW5nKCk7dmFyIGc9dyhlLm5jLGYpO2d8fChnPW5ldyBLaChjLGUuUGYpLGUubmNbZl09Zyk7Yz1nfVkuY2FsbCh0aGlzLGMsZCwkZCwhMSl9bWEoVSxZKTt2YXIgaWk9VSxqaT1bXCJGaXJlYmFzZVwiXSxraT1hYTtqaVswXWluIGtpfHwha2kuZXhlY1NjcmlwdHx8a2kuZXhlY1NjcmlwdChcInZhciBcIitqaVswXSk7Zm9yKHZhciBsaTtqaS5sZW5ndGgmJihsaT1qaS5zaGlmdCgpKTspIWppLmxlbmd0aCYmbihpaSk/a2lbbGldPWlpOmtpPWtpW2xpXT9raVtsaV06a2lbbGldPXt9O1UucHJvdG90eXBlLm5hbWU9ZnVuY3Rpb24oKXtRKFwiRmlyZWJhc2UubmFtZSgpIGJlaW5nIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgRmlyZWJhc2Uua2V5KCkgaW5zdGVhZC5cIik7eChcIkZpcmViYXNlLm5hbWVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMua2V5KCl9O1UucHJvdG90eXBlLm5hbWU9VS5wcm90b3R5cGUubmFtZTtcblUucHJvdG90eXBlLmtleT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5rZXlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMucGF0aC5lKCk/bnVsbDp2Yyh0aGlzLnBhdGgpfTtVLnByb3RvdHlwZS5rZXk9VS5wcm90b3R5cGUua2V5O1UucHJvdG90eXBlLnc9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLmNoaWxkXCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKGdhKGEpKWE9U3RyaW5nKGEpO2Vsc2UgaWYoIShhIGluc3RhbmNlb2YgSykpaWYobnVsbD09PU8odGhpcy5wYXRoKSl7dmFyIGI9YTtiJiYoYj1iLnJlcGxhY2UoL15cXC8qXFwuaW5mbyhcXC98JCkvLFwiL1wiKSk7WGYoXCJGaXJlYmFzZS5jaGlsZFwiLGIpfWVsc2UgWGYoXCJGaXJlYmFzZS5jaGlsZFwiLGEpO3JldHVybiBuZXcgVSh0aGlzLmssdGhpcy5wYXRoLncoYSkpfTtVLnByb3RvdHlwZS5jaGlsZD1VLnByb3RvdHlwZS53O1xuVS5wcm90b3R5cGUucGFyZW50PWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLnBhcmVudFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTt2YXIgYT10aGlzLnBhdGgucGFyZW50KCk7cmV0dXJuIG51bGw9PT1hP251bGw6bmV3IFUodGhpcy5rLGEpfTtVLnByb3RvdHlwZS5wYXJlbnQ9VS5wcm90b3R5cGUucGFyZW50O1UucHJvdG90eXBlLnJvb3Q9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UucmVmXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2Zvcih2YXIgYT10aGlzO251bGwhPT1hLnBhcmVudCgpOylhPWEucGFyZW50KCk7cmV0dXJuIGF9O1UucHJvdG90eXBlLnJvb3Q9VS5wcm90b3R5cGUucm9vdDtcblUucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5zZXRcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5zZXRcIix0aGlzLnBhdGgpO1JmKFwiRmlyZWJhc2Uuc2V0XCIsYSx0aGlzLnBhdGgsITEpO0EoXCJGaXJlYmFzZS5zZXRcIiwyLGIsITApO3RoaXMuay5LYih0aGlzLnBhdGgsYSxudWxsLGJ8fG51bGwpfTtVLnByb3RvdHlwZS5zZXQ9VS5wcm90b3R5cGUuc2V0O1xuVS5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnVwZGF0ZVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnVwZGF0ZVwiLHRoaXMucGF0aCk7aWYoZWEoYSkpe2Zvcih2YXIgYz17fSxkPTA7ZDxhLmxlbmd0aDsrK2QpY1tcIlwiK2RdPWFbZF07YT1jO1EoXCJQYXNzaW5nIGFuIEFycmF5IHRvIEZpcmViYXNlLnVwZGF0ZSgpIGlzIGRlcHJlY2F0ZWQuIFVzZSBzZXQoKSBpZiB5b3Ugd2FudCB0byBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGRhdGEsIG9yIGFuIE9iamVjdCB3aXRoIGludGVnZXIga2V5cyBpZiB5b3UgcmVhbGx5IGRvIHdhbnQgdG8gb25seSB1cGRhdGUgc29tZSBvZiB0aGUgY2hpbGRyZW4uXCIpfVRmKFwiRmlyZWJhc2UudXBkYXRlXCIsYSx0aGlzLnBhdGgpO0EoXCJGaXJlYmFzZS51cGRhdGVcIiwyLGIsITApO3RoaXMuay51cGRhdGUodGhpcy5wYXRoLGEsYnx8bnVsbCl9O1UucHJvdG90eXBlLnVwZGF0ZT1VLnByb3RvdHlwZS51cGRhdGU7XG5VLnByb3RvdHlwZS5LYj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLHRoaXMucGF0aCk7UmYoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIixhLHRoaXMucGF0aCwhMSk7VWYoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIiwyLGIpO0EoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIiwzLGMsITApO2lmKFwiLmxlbmd0aFwiPT09dGhpcy5rZXkoKXx8XCIua2V5c1wiPT09dGhpcy5rZXkoKSl0aHJvd1wiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5IGZhaWxlZDogXCIrdGhpcy5rZXkoKStcIiBpcyBhIHJlYWQtb25seSBvYmplY3QuXCI7dGhpcy5rLktiKHRoaXMucGF0aCxhLGIsY3x8bnVsbCl9O1UucHJvdG90eXBlLnNldFdpdGhQcmlvcml0eT1VLnByb3RvdHlwZS5LYjtcblUucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UucmVtb3ZlXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2UucmVtb3ZlXCIsdGhpcy5wYXRoKTtBKFwiRmlyZWJhc2UucmVtb3ZlXCIsMSxhLCEwKTt0aGlzLnNldChudWxsLGEpfTtVLnByb3RvdHlwZS5yZW1vdmU9VS5wcm90b3R5cGUucmVtb3ZlO1xuVS5wcm90b3R5cGUudHJhbnNhY3Rpb249ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDEsMyxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnRyYW5zYWN0aW9uXCIsdGhpcy5wYXRoKTtBKFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwxLGEsITEpO0EoXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDIsYiwhMCk7aWYobihjKSYmXCJib29sZWFuXCIhPXR5cGVvZiBjKXRocm93IEVycm9yKHooXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDMsITApK1wibXVzdCBiZSBhIGJvb2xlYW4uXCIpO2lmKFwiLmxlbmd0aFwiPT09dGhpcy5rZXkoKXx8XCIua2V5c1wiPT09dGhpcy5rZXkoKSl0aHJvd1wiRmlyZWJhc2UudHJhbnNhY3Rpb24gZmFpbGVkOiBcIit0aGlzLmtleSgpK1wiIGlzIGEgcmVhZC1vbmx5IG9iamVjdC5cIjtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGMmJihjPSEwKTtXaCh0aGlzLmssdGhpcy5wYXRoLGEsYnx8bnVsbCxjKX07VS5wcm90b3R5cGUudHJhbnNhY3Rpb249VS5wcm90b3R5cGUudHJhbnNhY3Rpb247XG5VLnByb3RvdHlwZS5MZz1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnNldFByaW9yaXR5XCIsdGhpcy5wYXRoKTtVZihcIkZpcmViYXNlLnNldFByaW9yaXR5XCIsMSxhKTtBKFwiRmlyZWJhc2Uuc2V0UHJpb3JpdHlcIiwyLGIsITApO3RoaXMuay5LYih0aGlzLnBhdGgudyhcIi5wcmlvcml0eVwiKSxhLG51bGwsYil9O1UucHJvdG90eXBlLnNldFByaW9yaXR5PVUucHJvdG90eXBlLkxnO1xuVS5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5wdXNoXCIsMCwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2UucHVzaFwiLHRoaXMucGF0aCk7UmYoXCJGaXJlYmFzZS5wdXNoXCIsYSx0aGlzLnBhdGgsITApO0EoXCJGaXJlYmFzZS5wdXNoXCIsMixiLCEwKTt2YXIgYz1NaCh0aGlzLmspLGM9S2YoYyksYz10aGlzLncoYyk7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBhJiZudWxsIT09YSYmYy5zZXQoYSxiKTtyZXR1cm4gY307VS5wcm90b3R5cGUucHVzaD1VLnByb3RvdHlwZS5wdXNoO1UucHJvdG90eXBlLmpiPWZ1bmN0aW9uKCl7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3RcIix0aGlzLnBhdGgpO3JldHVybiBuZXcgWCh0aGlzLmssdGhpcy5wYXRoKX07VS5wcm90b3R5cGUub25EaXNjb25uZWN0PVUucHJvdG90eXBlLmpiO1xuVS5wcm90b3R5cGUuUD1mdW5jdGlvbihhLGIsYyl7UShcIkZpcmViYXNlUmVmLmF1dGgoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlUmVmLmF1dGhXaXRoQ3VzdG9tVG9rZW4oKSBpbnN0ZWFkLlwiKTt4KFwiRmlyZWJhc2UuYXV0aFwiLDEsMyxhcmd1bWVudHMubGVuZ3RoKTtaZihcIkZpcmViYXNlLmF1dGhcIixhKTtBKFwiRmlyZWJhc2UuYXV0aFwiLDIsYiwhMCk7QShcIkZpcmViYXNlLmF1dGhcIiwzLGIsITApO0tnKHRoaXMuay5QLGEse30se3JlbWVtYmVyOlwibm9uZVwifSxiLGMpfTtVLnByb3RvdHlwZS5hdXRoPVUucHJvdG90eXBlLlA7VS5wcm90b3R5cGUuZWU9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLnVuYXV0aFwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2UudW5hdXRoXCIsMSxhLCEwKTtMZyh0aGlzLmsuUCxhKX07VS5wcm90b3R5cGUudW5hdXRoPVUucHJvdG90eXBlLmVlO1xuVS5wcm90b3R5cGUud2U9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuZ2V0QXV0aFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5rLlAud2UoKX07VS5wcm90b3R5cGUuZ2V0QXV0aD1VLnByb3RvdHlwZS53ZTtVLnByb3RvdHlwZS51Zz1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vbkF1dGhcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLm9uQXV0aFwiLDEsYSwhMSk7bGIoXCJGaXJlYmFzZS5vbkF1dGhcIiwyLGIpO3RoaXMuay5QLkViKFwiYXV0aF9zdGF0dXNcIixhLGIpfTtVLnByb3RvdHlwZS5vbkF1dGg9VS5wcm90b3R5cGUudWc7VS5wcm90b3R5cGUudGc9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub2ZmQXV0aFwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2Uub2ZmQXV0aFwiLDEsYSwhMSk7bGIoXCJGaXJlYmFzZS5vZmZBdXRoXCIsMixiKTt0aGlzLmsuUC5nYyhcImF1dGhfc3RhdHVzXCIsYSxiKX07VS5wcm90b3R5cGUub2ZmQXV0aD1VLnByb3RvdHlwZS50ZztcblUucHJvdG90eXBlLldmPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtaZihcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIixhKTtBKFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aEN1c3RvbVRva2VuXCIsMyxjLCEwKTtLZyh0aGlzLmsuUCxhLHt9LGN8fHt9LGIpfTtVLnByb3RvdHlwZS5hdXRoV2l0aEN1c3RvbVRva2VuPVUucHJvdG90eXBlLldmO1UucHJvdG90eXBlLlhmPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpOyRmKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMSxhKTtBKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMixiLCExKTthZyhcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDMsYywhMCk7UGcodGhpcy5rLlAsYSxjLGIpfTtcblUucHJvdG90eXBlLmF1dGhXaXRoT0F1dGhQb3B1cD1VLnByb3RvdHlwZS5YZjtVLnByb3RvdHlwZS5ZZj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTskZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDEsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3RcIiwzLGMsITApO3ZhciBkPXRoaXMuay5QO05nKGQpO3ZhciBlPVt3Z10sZj1pZyhjKTtcImFub255bW91c1wiPT09YXx8XCJmaXJlYmFzZVwiPT09YT9SKGIseWcoXCJUUkFOU1BPUlRfVU5BVkFJTEFCTEVcIikpOihQLnNldChcInJlZGlyZWN0X2NsaWVudF9vcHRpb25zXCIsZi5sZCksT2coZCxlLFwiL2F1dGgvXCIrYSxmLGIpKX07VS5wcm90b3R5cGUuYXV0aFdpdGhPQXV0aFJlZGlyZWN0PVUucHJvdG90eXBlLllmO1xuVS5wcm90b3R5cGUuWmY9ZnVuY3Rpb24oYSxiLGMsZCl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDMsNCxhcmd1bWVudHMubGVuZ3RoKTskZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDEsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDMsYywhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiw0LGQsITApO3AoYik/KCRmKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsMixiKSxNZyh0aGlzLmsuUCxhK1wiL3Rva2VuXCIse2FjY2Vzc190b2tlbjpifSxkLGMpKTooYWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwyLGIsITEpLE1nKHRoaXMuay5QLGErXCIvdG9rZW5cIixiLGQsYykpfTtVLnByb3RvdHlwZS5hdXRoV2l0aE9BdXRoVG9rZW49VS5wcm90b3R5cGUuWmY7XG5VLnByb3RvdHlwZS5WZj1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDEsYSwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwyLGIsITApO01nKHRoaXMuay5QLFwiYW5vbnltb3VzXCIse30sYixhKX07VS5wcm90b3R5cGUuYXV0aEFub255bW91c2x5PVUucHJvdG90eXBlLlZmO1xuVS5wcm90b3R5cGUuJGY9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5hdXRoV2l0aFBhc3N3b3JkXCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5hdXRoV2l0aFBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO2JnKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLGEsXCJwYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMixiLCExKTthZyhcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDMsYywhMCk7TWcodGhpcy5rLlAsXCJwYXNzd29yZFwiLGEsYyxiKX07VS5wcm90b3R5cGUuYXV0aFdpdGhQYXNzd29yZD1VLnByb3RvdHlwZS4kZjtcblUucHJvdG90eXBlLnJlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmNyZWF0ZVVzZXJcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLmNyZWF0ZVVzZXJcIixhLFwiZW1haWxcIik7YmcoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsMixiLCExKTt0aGlzLmsuUC5yZShhLGIpfTtVLnByb3RvdHlwZS5jcmVhdGVVc2VyPVUucHJvdG90eXBlLnJlO1UucHJvdG90eXBlLlNlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnJlbW92ZVVzZXJcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLnJlbW92ZVVzZXJcIixhLFwiZW1haWxcIik7YmcoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMixiLCExKTt0aGlzLmsuUC5TZShhLGIpfTtcblUucHJvdG90eXBlLnJlbW92ZVVzZXI9VS5wcm90b3R5cGUuU2U7VS5wcm90b3R5cGUub2U9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLGEsXCJlbWFpbFwiKTtiZyhcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsYSxcIm9sZFBhc3N3b3JkXCIpO2JnKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIixhLFwibmV3UGFzc3dvcmRcIik7QShcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsMixiLCExKTt0aGlzLmsuUC5vZShhLGIpfTtVLnByb3RvdHlwZS5jaGFuZ2VQYXNzd29yZD1VLnByb3RvdHlwZS5vZTtcblUucHJvdG90eXBlLm5lPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIixhLFwib2xkRW1haWxcIik7YmcoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLGEsXCJuZXdFbWFpbFwiKTtiZyhcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLDIsYiwhMSk7dGhpcy5rLlAubmUoYSxiKX07VS5wcm90b3R5cGUuY2hhbmdlRW1haWw9VS5wcm90b3R5cGUubmU7XG5VLnByb3RvdHlwZS5VZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO0EoXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsMixiLCExKTt0aGlzLmsuUC5VZShhLGIpfTtVLnByb3RvdHlwZS5yZXNldFBhc3N3b3JkPVUucHJvdG90eXBlLlVlO1UuZ29PZmZsaW5lPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLmdvT2ZmbGluZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtXLnViKCkueWIoKX07VS5nb09ubGluZT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5nb09ubGluZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtXLnViKCkucWMoKX07XG5mdW5jdGlvbiBOYyhhLGIpe0ooIWJ8fCEwPT09YXx8ITE9PT1hLFwiQ2FuJ3QgdHVybiBvbiBjdXN0b20gbG9nZ2VycyBwZXJzaXN0ZW50bHkuXCIpOyEwPT09YT8oXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlJiYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGNvbnNvbGUubG9nP0FiPXEoY29uc29sZS5sb2csY29uc29sZSk6XCJvYmplY3RcIj09PXR5cGVvZiBjb25zb2xlLmxvZyYmKEFiPWZ1bmN0aW9uKGEpe2NvbnNvbGUubG9nKGEpfSkpLGImJlAuc2V0KFwibG9nZ2luZ19lbmFibGVkXCIsITApKTphP0FiPWE6KEFiPW51bGwsUC5yZW1vdmUoXCJsb2dnaW5nX2VuYWJsZWRcIikpfVUuZW5hYmxlTG9nZ2luZz1OYztVLlNlcnZlclZhbHVlPXtUSU1FU1RBTVA6e1wiLnN2XCI6XCJ0aW1lc3RhbXBcIn19O1UuU0RLX1ZFUlNJT049XCIyLjIuNFwiO1UuSU5URVJOQUw9VjtVLkNvbnRleHQ9VztVLlRFU1RfQUNDRVNTPVo7fSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJlYmFzZTtcbiIsIihmdW5jdGlvbiAocm9vdCwgcGx1cmFsaXplKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gcGx1cmFsaXplKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELCByZWdpc3RlcnMgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHBsdXJhbGl6ZSgpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsLlxuICAgIHJvb3QucGx1cmFsaXplID0gcGx1cmFsaXplKCk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgLy8gUnVsZSBzdG9yYWdlIC0gcGx1cmFsaXplIGFuZCBzaW5ndWxhcml6ZSBuZWVkIHRvIGJlIHJ1biBzZXF1ZW50aWFsbHksXG4gIC8vIHdoaWxlIG90aGVyIHJ1bGVzIGNhbiBiZSBvcHRpbWl6ZWQgdXNpbmcgYW4gb2JqZWN0IGZvciBpbnN0YW50IGxvb2t1cHMuXG4gIHZhciBwbHVyYWxSdWxlcyAgICAgID0gW107XG4gIHZhciBzaW5ndWxhclJ1bGVzICAgID0gW107XG4gIHZhciB1bmNvdW50YWJsZXMgICAgID0ge307XG4gIHZhciBpcnJlZ3VsYXJQbHVyYWxzID0ge307XG4gIHZhciBpcnJlZ3VsYXJTaW5nbGVzID0ge307XG5cbiAgLyoqXG4gICAqIFRpdGxlIGNhc2UgYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHRvVGl0bGVDYXNlIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhbml0aXplIGEgcGx1cmFsaXphdGlvbiBydWxlIHRvIGEgdXNhYmxlIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtICB7KFJlZ0V4cHxzdHJpbmcpfSBydWxlXG4gICAqIEByZXR1cm4ge1JlZ0V4cH1cbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplUnVsZSAocnVsZSkge1xuICAgIGlmICh0eXBlb2YgcnVsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHJ1bGUgKyAnJCcsICdpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogUGFzcyBpbiBhIHdvcmQgdG9rZW4gdG8gcHJvZHVjZSBhIGZ1bmN0aW9uIHRoYXQgY2FuIHJlcGxpY2F0ZSB0aGUgY2FzZSBvblxuICAgKiBhbm90aGVyIHdvcmQuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB0b2tlblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIHJlc3RvcmVDYXNlICh3b3JkLCB0b2tlbikge1xuICAgIC8vIFVwcGVyIGNhc2VkIHdvcmRzLiBFLmcuIFwiSEVMTE9cIi5cbiAgICBpZiAod29yZCA9PT0gd29yZC50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICByZXR1cm4gdG9rZW4udG9VcHBlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvLyBUaXRsZSBjYXNlZCB3b3Jkcy4gRS5nLiBcIlRpdGxlXCIuXG4gICAgaWYgKHdvcmRbMF0gPT09IHdvcmRbMF0udG9VcHBlckNhc2UoKSkge1xuICAgICAgcmV0dXJuIHRvVGl0bGVDYXNlKHRva2VuKTtcbiAgICB9XG5cbiAgICAvLyBMb3dlciBjYXNlZCB3b3Jkcy4gRS5nLiBcInRlc3RcIi5cbiAgICByZXR1cm4gdG9rZW4udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcnBvbGF0ZSBhIHJlZ2V4cCBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gc3RyICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gYXJncyBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZSAoc3RyLCBhcmdzKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXCQoXFxkezEsMn0pL2csIGZ1bmN0aW9uIChtYXRjaCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBhcmdzW2luZGV4XSB8fCAnJztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYW5pdGl6ZSBhIHdvcmQgYnkgcGFzc2luZyBpbiB0aGUgd29yZCBhbmQgc2FuaXRpemF0aW9uIHJ1bGVzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgd29yZFxuICAgKiBAcGFyYW0gIHtBcnJheX0gICAgY29sbGVjdGlvblxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZVdvcmQgKHdvcmQsIGNvbGxlY3Rpb24pIHtcbiAgICAvLyBFbXB0eSBzdHJpbmcgb3IgZG9lc24ndCBuZWVkIGZpeGluZy5cbiAgICBpZiAoIXdvcmQubGVuZ3RoIHx8IHVuY291bnRhYmxlcy5oYXNPd25Qcm9wZXJ0eSh3b3JkKSkge1xuICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgfVxuXG4gICAgdmFyIGxlbiA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBzYW5pdGl6YXRpb24gcnVsZXMgYW5kIHVzZSB0aGUgZmlyc3Qgb25lIHRvIG1hdGNoLlxuICAgIHdoaWxlIChsZW4tLSkge1xuICAgICAgdmFyIHJ1bGUgPSBjb2xsZWN0aW9uW2xlbl07XG5cbiAgICAgIC8vIElmIHRoZSBydWxlIHBhc3NlcywgcmV0dXJuIHRoZSByZXBsYWNlbWVudC5cbiAgICAgIGlmIChydWxlWzBdLnRlc3Qod29yZCkpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQucmVwbGFjZShydWxlWzBdLCBmdW5jdGlvbiAobWF0Y2gsIGluZGV4LCB3b3JkKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IGludGVycG9sYXRlKHJ1bGVbMV0sIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICBpZiAobWF0Y2ggPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdG9yZUNhc2Uod29yZFtpbmRleCAtIDFdLCByZXN1bHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByZXN0b3JlQ2FzZShtYXRjaCwgcmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHdvcmQ7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhIHdvcmQgd2l0aCB0aGUgdXBkYXRlZCB3b3JkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgcmVwbGFjZU1hcFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAga2VlcE1hcFxuICAgKiBAcGFyYW0gIHtBcnJheX0gICAgcnVsZXNcbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiByZXBsYWNlV29yZCAocmVwbGFjZU1hcCwga2VlcE1hcCwgcnVsZXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHdvcmQpIHtcbiAgICAgIC8vIEdldCB0aGUgY29ycmVjdCB0b2tlbiBhbmQgY2FzZSByZXN0b3JhdGlvbiBmdW5jdGlvbnMuXG4gICAgICB2YXIgdG9rZW4gPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIC8vIENoZWNrIGFnYWluc3QgdGhlIGtlZXAgb2JqZWN0IG1hcC5cbiAgICAgIGlmIChrZWVwTWFwLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgICByZXR1cm4gcmVzdG9yZUNhc2Uod29yZCwgdG9rZW4pO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBhZ2FpbnN0IHRoZSByZXBsYWNlbWVudCBtYXAgZm9yIGEgZGlyZWN0IHdvcmQgcmVwbGFjZW1lbnQuXG4gICAgICBpZiAocmVwbGFjZU1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuIHJlc3RvcmVDYXNlKHdvcmQsIHJlcGxhY2VNYXBbdG9rZW5dKTtcbiAgICAgIH1cblxuICAgICAgLy8gUnVuIGFsbCB0aGUgcnVsZXMgYWdhaW5zdCB0aGUgd29yZC5cbiAgICAgIHJldHVybiBzYW5pdGl6ZVdvcmQod29yZCwgcnVsZXMpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUGx1cmFsaXplIG9yIHNpbmd1bGFyaXplIGEgd29yZCBiYXNlZCBvbiB0aGUgcGFzc2VkIGluIGNvdW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICB3b3JkXG4gICAqIEBwYXJhbSAge051bWJlcn0gIGNvdW50XG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IGluY2x1c2l2ZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBwbHVyYWxpemUgKHdvcmQsIGNvdW50LCBpbmNsdXNpdmUpIHtcbiAgICB2YXIgcGx1cmFsaXplZCA9IGNvdW50ID09PSAxID9cbiAgICAgIHBsdXJhbGl6ZS5zaW5ndWxhcih3b3JkKSA6IHBsdXJhbGl6ZS5wbHVyYWwod29yZCk7XG5cbiAgICByZXR1cm4gKGluY2x1c2l2ZSA/IGNvdW50ICsgJyAnIDogJycpICsgcGx1cmFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgYSB3b3JkLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwbHVyYWxpemUucGx1cmFsID0gcmVwbGFjZVdvcmQoXG4gICAgaXJyZWd1bGFyU2luZ2xlcywgaXJyZWd1bGFyUGx1cmFscywgcGx1cmFsUnVsZXNcbiAgKTtcblxuICAvKipcbiAgICogU2luZ3VsYXJpemUgYSB3b3JkLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwbHVyYWxpemUuc2luZ3VsYXIgPSByZXBsYWNlV29yZChcbiAgICBpcnJlZ3VsYXJQbHVyYWxzLCBpcnJlZ3VsYXJTaW5nbGVzLCBzaW5ndWxhclJ1bGVzXG4gICk7XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBsdXJhbGl6YXRpb24gcnVsZSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHJ1bGVcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgIHJlcGxhY2VtZW50XG4gICAqL1xuICBwbHVyYWxpemUuYWRkUGx1cmFsUnVsZSA9IGZ1bmN0aW9uIChydWxlLCByZXBsYWNlbWVudCkge1xuICAgIHBsdXJhbFJ1bGVzLnB1c2goW3Nhbml0aXplUnVsZShydWxlKSwgcmVwbGFjZW1lbnRdKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGEgc2luZ3VsYXJpemF0aW9uIHJ1bGUgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApfSBydWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICByZXBsYWNlbWVudFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZFNpbmd1bGFyUnVsZSA9IGZ1bmN0aW9uIChydWxlLCByZXBsYWNlbWVudCkge1xuICAgIHNpbmd1bGFyUnVsZXMucHVzaChbc2FuaXRpemVSdWxlKHJ1bGUpLCByZXBsYWNlbWVudF0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gdW5jb3VudGFibGUgd29yZCBydWxlLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKX0gd29yZFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZFVuY291bnRhYmxlUnVsZSA9IGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgaWYgKHR5cGVvZiB3b3JkID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHVuY291bnRhYmxlc1t3b3JkLnRvTG93ZXJDYXNlKCldID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBTZXQgc2luZ3VsYXIgYW5kIHBsdXJhbCByZWZlcmVuY2VzIGZvciB0aGUgd29yZC5cbiAgICBwbHVyYWxpemUuYWRkUGx1cmFsUnVsZSh3b3JkLCAnJDAnKTtcbiAgICBwbHVyYWxpemUuYWRkU2luZ3VsYXJSdWxlKHdvcmQsICckMCcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gaXJyZWd1bGFyIHdvcmQgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpbmdsZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGx1cmFsXG4gICAqL1xuICBwbHVyYWxpemUuYWRkSXJyZWd1bGFyUnVsZSA9IGZ1bmN0aW9uIChzaW5nbGUsIHBsdXJhbCkge1xuICAgIHBsdXJhbCA9IHBsdXJhbC50b0xvd2VyQ2FzZSgpO1xuICAgIHNpbmdsZSA9IHNpbmdsZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaXJyZWd1bGFyU2luZ2xlc1tzaW5nbGVdID0gcGx1cmFsO1xuICAgIGlycmVndWxhclBsdXJhbHNbcGx1cmFsXSA9IHNpbmdsZTtcbiAgfTtcblxuICAvKipcbiAgICogSXJyZWd1bGFyIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIC8vIFByb25vdW5zLlxuICAgIFsnSScsICAgICAgICAnd2UnXSxcbiAgICBbJ21lJywgICAgICAgJ3VzJ10sXG4gICAgWydoZScsICAgICAgICd0aGV5J10sXG4gICAgWydzaGUnLCAgICAgICd0aGV5J10sXG4gICAgWyd0aGVtJywgICAgICd0aGVtJ10sXG4gICAgWydteXNlbGYnLCAgICdvdXJzZWx2ZXMnXSxcbiAgICBbJ3lvdXJzZWxmJywgJ3lvdXJzZWx2ZXMnXSxcbiAgICBbJ2l0c2VsZicsICAgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ2hlcnNlbGYnLCAgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ2hpbXNlbGYnLCAgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ3RoZW1zZWxmJywgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ3RoaXMnLCAgICAgJ3RoZXNlJ10sXG4gICAgWyd0aGF0JywgICAgICd0aG9zZSddLFxuICAgIC8vIFdvcmRzIGVuZGluZyBpbiB3aXRoIGEgY29uc29uYW50IGFuZCBgb2AuXG4gICAgWydlY2hvJywgJ2VjaG9lcyddLFxuICAgIFsnZGluZ28nLCAnZGluZ29lcyddLFxuICAgIFsndm9sY2FubycsICd2b2xjYW5vZXMnXSxcbiAgICBbJ3Rvcm5hZG8nLCAndG9ybmFkb2VzJ10sXG4gICAgWyd0b3JwZWRvJywgJ3RvcnBlZG9lcyddLFxuICAgIC8vIEVuZHMgd2l0aCBgdXNgLlxuICAgIFsnZ2VudXMnLCAgJ2dlbmVyYSddLFxuICAgIFsndmlzY3VzJywgJ3Zpc2NlcmEnXSxcbiAgICAvLyBFbmRzIHdpdGggYG1hYC5cbiAgICBbJ3N0aWdtYScsICAgJ3N0aWdtYXRhJ10sXG4gICAgWydzdG9tYScsICAgICdzdG9tYXRhJ10sXG4gICAgWydkb2dtYScsICAgICdkb2dtYXRhJ10sXG4gICAgWydsZW1tYScsICAgICdsZW1tYXRhJ10sXG4gICAgWydzY2hlbWEnLCAgICdzY2hlbWF0YSddLFxuICAgIFsnYW5hdGhlbWEnLCAnYW5hdGhlbWF0YSddLFxuICAgIC8vIE90aGVyIGlycmVndWxhciBydWxlcy5cbiAgICBbJ294JywgICAgICAnb3hlbiddLFxuICAgIFsnYXhlJywgICAgICdheGVzJ10sXG4gICAgWydkaWUnLCAgICAgJ2RpY2UnXSxcbiAgICBbJ3llcycsICAgICAneWVzZXMnXSxcbiAgICBbJ2Zvb3QnLCAgICAnZmVldCddLFxuICAgIFsnZWF2ZScsICAgICdlYXZlcyddLFxuICAgIFsnZ29vc2UnLCAgICdnZWVzZSddLFxuICAgIFsndG9vdGgnLCAgICd0ZWV0aCddLFxuICAgIFsncXVpeicsICAgICdxdWl6emVzJ10sXG4gICAgWydodW1hbicsICAgJ2h1bWFucyddLFxuICAgIFsncHJvb2YnLCAgICdwcm9vZnMnXSxcbiAgICBbJ2NhcnZlJywgICAnY2FydmVzJ10sXG4gICAgWyd2YWx2ZScsICAgJ3ZhbHZlcyddLFxuICAgIFsndGhpZWYnLCAgICd0aGlldmVzJ10sXG4gICAgWydnZW5pZScsICAgJ2dlbmllcyddLFxuICAgIFsnZ3Jvb3ZlJywgICdncm9vdmVzJ10sXG4gICAgWydwaWNrYXhlJywgJ3BpY2theGVzJ10sXG4gICAgWyd3aGlza2V5JywgJ3doaXNraWVzJ11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRJcnJlZ3VsYXJSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogUGx1cmFsaXphdGlvbiBydWxlcy5cbiAgICovXG4gIFtcbiAgICBbL3M/JC9pLCAncyddLFxuICAgIFsvKFteYWVpb3VdZXNlKSQvaSwgJyQxJ10sXG4gICAgWy8oYXh8dGVzdClpcyQvaSwgJyQxZXMnXSxcbiAgICBbLyhhbGlhc3xbXmFvdV11c3x0bGFzfGdhc3xyaXMpJC9pLCAnJDFlcyddLFxuICAgIFsvKGVbbW5ddSlzPyQvaSwgJyQxcyddLFxuICAgIFsvKFtebF1pYXN8W2FlaW91XWxhc3xbZW1qenJdYXN8W2l1XWFtKSQvaSwgJyQxJ10sXG4gICAgWy8oYWx1bW58c3lsbGFifG9jdG9wfHZpcnxyYWRpfG51Y2xlfGZ1bmd8Y2FjdHxzdGltdWx8dGVybWlufGJhY2lsbHxmb2N8dXRlcnxsb2N8c3RyYXQpKD86dXN8aSkkL2ksICckMWknXSxcbiAgICBbLyhhbHVtbnxhbGd8dmVydGVicikoPzphfGFlKSQvaSwgJyQxYWUnXSxcbiAgICBbLyhzZXJhcGh8Y2hlcnViKSg/OmltKT8kL2ksICckMWltJ10sXG4gICAgWy8oaGVyfGF0fGdyKW8kL2ksICckMW9lcyddLFxuICAgIFsvKGFnZW5kfGFkZGVuZHxtaWxsZW5uaXxkYXR8ZXh0cmVtfGJhY3Rlcml8ZGVzaWRlcmF0fHN0cmF0fGNhbmRlbGFicnxlcnJhdHxvdnxzeW1wb3NpfGN1cnJpY3VsfGF1dG9tYXR8cXVvcikoPzphfHVtKSQvaSwgJyQxYSddLFxuICAgIFsvKGFwaGVsaXxoeXBlcmJhdHxwZXJpaGVsaXxhc3luZGV0fG5vdW1lbnxwaGVub21lbnxjcml0ZXJpfG9yZ2FufHByb2xlZ29tZW58XFx3K2hlZHIpKD86YXxvbikkL2ksICckMWEnXSxcbiAgICBbL3NpcyQvaSwgJ3NlcyddLFxuICAgIFsvKD86KGkpZmV8KGFyfGx8ZWF8ZW98b2F8aG9vKWYpJC9pLCAnJDEkMnZlcyddLFxuICAgIFsvKFteYWVpb3V5XXxxdSl5JC9pLCAnJDFpZXMnXSxcbiAgICBbLyhbXmNoXVtpZW9dW2xuXSlleSQvaSwgJyQxaWVzJ10sXG4gICAgWy8oeHxjaHxzc3xzaHx6eikkL2ksICckMWVzJ10sXG4gICAgWy8obWF0cnxjb2R8bXVyfHNpbHx2ZXJ0fGluZHxhcHBlbmQpKD86aXh8ZXgpJC9pLCAnJDFpY2VzJ10sXG4gICAgWy8obXxsKSg/OmljZXxvdXNlKSQvaSwgJyQxaWNlJ10sXG4gICAgWy8ocGUpKD86cnNvbnxvcGxlKSQvaSwgJyQxb3BsZSddLFxuICAgIFsvKGNoaWxkKSg/OnJlbik/JC9pLCAnJDFyZW4nXSxcbiAgICBbL2VhdXgkL2ksICckMCddLFxuICAgIFsvbVthZV1uJC9pLCAnbWVuJ11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRQbHVyYWxSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogU2luZ3VsYXJpemF0aW9uIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIFsvcyQvaSwgJyddLFxuICAgIFsvKHNzKSQvaSwgJyQxJ10sXG4gICAgWy8oKGEpbmFseXwoYilhfChkKWlhZ25vfChwKWFyZW50aGV8KHApcm9nbm98KHMpeW5vcHwodCloZSkoPzpzaXN8c2VzKSQvaSwgJyQxc2lzJ10sXG4gICAgWy8oXmFuYWx5KSg/OnNpc3xzZXMpJC9pLCAnJDFzaXMnXSxcbiAgICBbLyhbXmFlZmxvcl0pdmVzJC9pLCAnJDFmZSddLFxuICAgIFsvKGhpdmV8dGl2ZXxkcj9pdmUpcyQvaSwgJyQxJ10sXG4gICAgWy8oYXJ8KD86d298W2FlXSlsfFtlb11bYW9dKXZlcyQvaSwgJyQxZiddLFxuICAgIFsvKFteYWVpb3V5XXxxdSlpZXMkL2ksICckMXknXSxcbiAgICBbLyheW3BsXXx6b21ifF4oPzpuZWNrKT90fFthZW9dW2x0XXxjdXQpaWVzJC9pLCAnJDFpZSddLFxuICAgIFsvKFteY11bZW9yXW58c21pbClpZXMkL2ksICckMWV5J10sXG4gICAgWy8obXxsKWljZSQvaSwgJyQxb3VzZSddLFxuICAgIFsvKHNlcmFwaHxjaGVydWIpaW0kL2ksICckMSddLFxuICAgIFsvKHh8Y2h8c3N8c2h8enp8dHRvfGdvfGNob3xhbGlhc3xbXmFvdV11c3x0bGFzfGdhc3woPzpoZXJ8YXR8Z3Ipb3xyaXMpKD86ZXMpPyQvaSwgJyQxJ10sXG4gICAgWy8oZVttbl11KXM/JC9pLCAnJDEnXSxcbiAgICBbLyhtb3ZpZXx0d2VsdmUpcyQvaSwgJyQxJ10sXG4gICAgWy8oY3Jpc3x0ZXN0fGRpYWdub3MpKD86aXN8ZXMpJC9pLCAnJDFpcyddLFxuICAgIFsvKGFsdW1ufHN5bGxhYnxvY3RvcHx2aXJ8cmFkaXxudWNsZXxmdW5nfGNhY3R8c3RpbXVsfHRlcm1pbnxiYWNpbGx8Zm9jfHV0ZXJ8bG9jfHN0cmF0KSg/OnVzfGkpJC9pLCAnJDF1cyddLFxuICAgIFsvKGFnZW5kfGFkZGVuZHxtaWxsZW5uaXxkYXR8ZXh0cmVtfGJhY3Rlcml8ZGVzaWRlcmF0fHN0cmF0fGNhbmRlbGFicnxlcnJhdHxvdnxzeW1wb3NpfGN1cnJpY3VsfGF1dG9tYXR8cXVvcilhJC9pLCAnJDF1bSddLFxuICAgIFsvKGFwaGVsaXxoeXBlcmJhdHxwZXJpaGVsaXxhc3luZGV0fG5vdW1lbnxwaGVub21lbnxjcml0ZXJpfG9yZ2FufHByb2xlZ29tZW58XFx3K2hlZHIpYSQvaSwgJyQxb24nXSxcbiAgICBbLyhhbHVtbnxhbGd8dmVydGVicilhZSQvaSwgJyQxYSddLFxuICAgIFsvKGNvZHxtdXJ8c2lsfHZlcnR8aW5kKWljZXMkL2ksICckMWV4J10sXG4gICAgWy8obWF0cnxhcHBlbmQpaWNlcyQvaSwgJyQxaXgnXSxcbiAgICBbLyhwZSkocnNvbnxvcGxlKSQvaSwgJyQxcnNvbiddLFxuICAgIFsvKGNoaWxkKXJlbiQvaSwgJyQxJ10sXG4gICAgWy8oZWF1KXg/JC9pLCAnJDEnXSxcbiAgICBbL21lbiQvaSwgJ21hbiddXG4gIF0uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgIHJldHVybiBwbHVyYWxpemUuYWRkU2luZ3VsYXJSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogVW5jb3VudGFibGUgcnVsZXMuXG4gICAqL1xuICBbXG4gICAgLy8gU2luZ3VsYXIgd29yZHMgd2l0aCBubyBwbHVyYWxzLlxuICAgICdhZHZpY2UnLFxuICAgICdhZ2VuZGEnLFxuICAgICdiaXNvbicsXG4gICAgJ2JyZWFtJyxcbiAgICAnYnVmZmFsbycsXG4gICAgJ2NhcnAnLFxuICAgICdjaGFzc2lzJyxcbiAgICAnY29kJyxcbiAgICAnY29vcGVyYXRpb24nLFxuICAgICdjb3JwcycsXG4gICAgJ2RpZ2VzdGlvbicsXG4gICAgJ2RlYnJpcycsXG4gICAgJ2RpYWJldGVzJyxcbiAgICAnZW5lcmd5JyxcbiAgICAnZXF1aXBtZW50JyxcbiAgICAnZWxrJyxcbiAgICAnZXhjcmV0aW9uJyxcbiAgICAnZXhwZXJ0aXNlJyxcbiAgICAnZmxvdW5kZXInLFxuICAgICdnYWxsb3dzJyxcbiAgICAnZ3JhZmZpdGknLFxuICAgICdoZWFkcXVhcnRlcnMnLFxuICAgICdoZWFsdGgnLFxuICAgICdoZXJwZXMnLFxuICAgICdoaWdoamlua3MnLFxuICAgICdob21ld29yaycsXG4gICAgJ2luZm9ybWF0aW9uJyxcbiAgICAnamVhbnMnLFxuICAgICdqdXN0aWNlJyxcbiAgICAna3Vkb3MnLFxuICAgICdsYWJvdXInLFxuICAgICdtYWNoaW5lcnknLFxuICAgICdtYWNrZXJlbCcsXG4gICAgJ21lZGlhJyxcbiAgICAnbWV3cycsXG4gICAgJ21vb3NlJyxcbiAgICAnbmV3cycsXG4gICAgJ3Bpa2UnLFxuICAgICdwbGFua3RvbicsXG4gICAgJ3BsaWVycycsXG4gICAgJ3BvbGx1dGlvbicsXG4gICAgJ3ByZW1pc2VzJyxcbiAgICAncmFpbicsXG4gICAgJ3JpY2UnLFxuICAgICdzYWxtb24nLFxuICAgICdzY2lzc29ycycsXG4gICAgJ3NlcmllcycsXG4gICAgJ3Nld2FnZScsXG4gICAgJ3NoYW1ibGVzJyxcbiAgICAnc2hyaW1wJyxcbiAgICAnc3BlY2llcycsXG4gICAgJ3N0YWZmJyxcbiAgICAnc3dpbmUnLFxuICAgICd0cm91dCcsXG4gICAgJ3R1bmEnLFxuICAgICd3aGl0aW5nJyxcbiAgICAnd2lsZGViZWVzdCcsXG4gICAgJ3dpbGRsaWZlJyxcbiAgICAvLyBSZWdleGVzLlxuICAgIC9wb3gkL2ksIC8vIFwiY2hpY2twb3hcIiwgXCJzbWFsbHBveFwiXG4gICAgL29pcyQvaSxcbiAgICAvZGVlciQvaSwgLy8gXCJkZWVyXCIsIFwicmVpbmRlZXJcIlxuICAgIC9maXNoJC9pLCAvLyBcImZpc2hcIiwgXCJibG93ZmlzaFwiLCBcImFuZ2VsZmlzaFwiXG4gICAgL3NoZWVwJC9pLFxuICAgIC9tZWFzbGVzJC9pLFxuICAgIC9bXmFlaW91XWVzZSQvaSAvLyBcImNoaW5lc2VcIiwgXCJqYXBhbmVzZVwiXG4gIF0uZm9yRWFjaChwbHVyYWxpemUuYWRkVW5jb3VudGFibGVSdWxlKTtcblxuICByZXR1cm4gcGx1cmFsaXplO1xufSk7XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIENyZWF0ZSBhIGNoaWxkIGluc3RhbmNlIHRoYXQgcHJvdG90eXBhbGx5IGluZWhyaXRzXG4gKiBkYXRhIG9uIHBhcmVudC4gVG8gYWNoaWV2ZSB0aGF0IHdlIGNyZWF0ZSBhbiBpbnRlcm1lZGlhdGVcbiAqIGNvbnN0cnVjdG9yIHdpdGggaXRzIHByb3RvdHlwZSBwb2ludGluZyB0byBwYXJlbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtCYXNlQ3Rvcl1cbiAqIEByZXR1cm4ge1Z1ZX1cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLiRhZGRDaGlsZCA9IGZ1bmN0aW9uIChvcHRzLCBCYXNlQ3Rvcikge1xuICBCYXNlQ3RvciA9IEJhc2VDdG9yIHx8IF8uVnVlXG4gIG9wdHMgPSBvcHRzIHx8IHt9XG4gIHZhciBwYXJlbnQgPSB0aGlzXG4gIHZhciBDaGlsZFZ1ZVxuICB2YXIgaW5oZXJpdCA9IG9wdHMuaW5oZXJpdCAhPT0gdW5kZWZpbmVkXG4gICAgPyBvcHRzLmluaGVyaXRcbiAgICA6IEJhc2VDdG9yLm9wdGlvbnMuaW5oZXJpdFxuICBpZiAoaW5oZXJpdCkge1xuICAgIHZhciBjdG9ycyA9IHBhcmVudC5fY2hpbGRDdG9yc1xuICAgIENoaWxkVnVlID0gY3RvcnNbQmFzZUN0b3IuY2lkXVxuICAgIGlmICghQ2hpbGRWdWUpIHtcbiAgICAgIHZhciBvcHRpb25OYW1lID0gQmFzZUN0b3Iub3B0aW9ucy5uYW1lXG4gICAgICB2YXIgY2xhc3NOYW1lID0gb3B0aW9uTmFtZVxuICAgICAgICA/IF8uY2xhc3NpZnkob3B0aW9uTmFtZSlcbiAgICAgICAgOiAnVnVlQ29tcG9uZW50J1xuICAgICAgQ2hpbGRWdWUgPSBuZXcgRnVuY3Rpb24oXG4gICAgICAgICdyZXR1cm4gZnVuY3Rpb24gJyArIGNsYXNzTmFtZSArICcgKG9wdGlvbnMpIHsnICtcbiAgICAgICAgJ3RoaXMuY29uc3RydWN0b3IgPSAnICsgY2xhc3NOYW1lICsgJzsnICtcbiAgICAgICAgJ3RoaXMuX2luaXQob3B0aW9ucykgfSdcbiAgICAgICkoKVxuICAgICAgQ2hpbGRWdWUub3B0aW9ucyA9IEJhc2VDdG9yLm9wdGlvbnNcbiAgICAgIENoaWxkVnVlLnByb3RvdHlwZSA9IHRoaXNcbiAgICAgIGN0b3JzW0Jhc2VDdG9yLmNpZF0gPSBDaGlsZFZ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBDaGlsZFZ1ZSA9IEJhc2VDdG9yXG4gIH1cbiAgb3B0cy5fcGFyZW50ID0gcGFyZW50XG4gIG9wdHMuX3Jvb3QgPSBwYXJlbnQuJHJvb3RcbiAgdmFyIGNoaWxkID0gbmV3IENoaWxkVnVlKG9wdHMpXG4gIHRoaXMuX2NoaWxkcmVuLnB1c2goY2hpbGQpXG4gIHJldHVybiBjaGlsZFxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4uL3dhdGNoZXInKVxudmFyIFBhdGggPSByZXF1aXJlKCcuLi9wYXJzZXJzL3BhdGgnKVxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKVxudmFyIGRpclBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZGlyZWN0aXZlJylcbnZhciBleHBQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxudmFyIGZpbHRlclJFID0gL1tefF1cXHxbXnxdL1xuXG4vKipcbiAqIEdldCB0aGUgdmFsdWUgZnJvbSBhbiBleHByZXNzaW9uIG9uIHRoaXMgdm0uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHJldHVybiB7Kn1cbiAqL1xuXG5leHBvcnRzLiRnZXQgPSBmdW5jdGlvbiAoZXhwKSB7XG4gIHZhciByZXMgPSBleHBQYXJzZXIucGFyc2UoZXhwKVxuICBpZiAocmVzKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiByZXMuZ2V0LmNhbGwodGhpcywgdGhpcylcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG59XG5cbi8qKlxuICogU2V0IHRoZSB2YWx1ZSBmcm9tIGFuIGV4cHJlc3Npb24gb24gdGhpcyB2bS5cbiAqIFRoZSBleHByZXNzaW9uIG11c3QgYmUgYSB2YWxpZCBsZWZ0LWhhbmRcbiAqIGV4cHJlc3Npb24gaW4gYW4gYXNzaWdubWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbmV4cG9ydHMuJHNldCA9IGZ1bmN0aW9uIChleHAsIHZhbCkge1xuICB2YXIgcmVzID0gZXhwUGFyc2VyLnBhcnNlKGV4cCwgdHJ1ZSlcbiAgaWYgKHJlcyAmJiByZXMuc2V0KSB7XG4gICAgcmVzLnNldC5jYWxsKHRoaXMsIHRoaXMsIHZhbClcbiAgfVxufVxuXG4vKipcbiAqIEFkZCBhIHByb3BlcnR5IG9uIHRoZSBWTVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZXhwb3J0cy4kYWRkID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gIHRoaXMuX2RhdGEuJGFkZChrZXksIHZhbClcbn1cblxuLyoqXG4gKiBEZWxldGUgYSBwcm9wZXJ0eSBvbiB0aGUgVk1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKi9cblxuZXhwb3J0cy4kZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICB0aGlzLl9kYXRhLiRkZWxldGUoa2V5KVxufVxuXG4vKipcbiAqIFdhdGNoIGFuIGV4cHJlc3Npb24sIHRyaWdnZXIgY2FsbGJhY2sgd2hlbiBpdHNcbiAqIHZhbHVlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2RlZXBdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpbW1lZGlhdGVdXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSB1bndhdGNoRm5cbiAqL1xuXG5leHBvcnRzLiR3YXRjaCA9IGZ1bmN0aW9uIChleHAsIGNiLCBkZWVwLCBpbW1lZGlhdGUpIHtcbiAgdmFyIHZtID0gdGhpc1xuICB2YXIga2V5ID0gZGVlcCA/IGV4cCArICcqKmRlZXAqKicgOiBleHBcbiAgdmFyIHdhdGNoZXIgPSB2bS5fdXNlcldhdGNoZXJzW2tleV1cbiAgdmFyIHdyYXBwZWRDYiA9IGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xuICAgIGNiLmNhbGwodm0sIHZhbCwgb2xkVmFsKVxuICB9XG4gIGlmICghd2F0Y2hlcikge1xuICAgIHdhdGNoZXIgPSB2bS5fdXNlcldhdGNoZXJzW2tleV0gPVxuICAgICAgbmV3IFdhdGNoZXIodm0sIGV4cCwgd3JhcHBlZENiLCB7XG4gICAgICAgIGRlZXA6IGRlZXAsXG4gICAgICAgIHVzZXI6IHRydWVcbiAgICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgd2F0Y2hlci5hZGRDYih3cmFwcGVkQ2IpXG4gIH1cbiAgaWYgKGltbWVkaWF0ZSkge1xuICAgIHdyYXBwZWRDYih3YXRjaGVyLnZhbHVlKVxuICB9XG4gIHJldHVybiBmdW5jdGlvbiB1bndhdGNoRm4gKCkge1xuICAgIHdhdGNoZXIucmVtb3ZlQ2Iod3JhcHBlZENiKVxuICAgIGlmICghd2F0Y2hlci5hY3RpdmUpIHtcbiAgICAgIHZtLl91c2VyV2F0Y2hlcnNba2V5XSA9IG51bGxcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSBhIHRleHQgZGlyZWN0aXZlLCBpbmNsdWRpbmcgZmlsdGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMuJGV2YWwgPSBmdW5jdGlvbiAodGV4dCkge1xuICAvLyBjaGVjayBmb3IgZmlsdGVycy5cbiAgaWYgKGZpbHRlclJFLnRlc3QodGV4dCkpIHtcbiAgICB2YXIgZGlyID0gZGlyUGFyc2VyLnBhcnNlKHRleHQpWzBdXG4gICAgLy8gdGhlIGZpbHRlciByZWdleCBjaGVjayBtaWdodCBnaXZlIGZhbHNlIHBvc2l0aXZlXG4gICAgLy8gZm9yIHBpcGVzIGluc2lkZSBzdHJpbmdzLCBzbyBpdCdzIHBvc3NpYmxlIHRoYXRcbiAgICAvLyB3ZSBkb24ndCBnZXQgYW55IGZpbHRlcnMgaGVyZVxuICAgIHJldHVybiBkaXIuZmlsdGVyc1xuICAgICAgPyBfLmFwcGx5RmlsdGVycyhcbiAgICAgICAgICB0aGlzLiRnZXQoZGlyLmV4cHJlc3Npb24pLFxuICAgICAgICAgIF8ucmVzb2x2ZUZpbHRlcnModGhpcywgZGlyLmZpbHRlcnMpLnJlYWQsXG4gICAgICAgICAgdGhpc1xuICAgICAgICApXG4gICAgICA6IHRoaXMuJGdldChkaXIuZXhwcmVzc2lvbilcbiAgfSBlbHNlIHtcbiAgICAvLyBubyBmaWx0ZXJcbiAgICByZXR1cm4gdGhpcy4kZ2V0KHRleHQpXG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcnBvbGF0ZSBhIHBpZWNlIG9mIHRlbXBsYXRlIHRleHQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLiRpbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKHRleHQpXG4gIHZhciB2bSA9IHRoaXNcbiAgaWYgKHRva2Vucykge1xuICAgIHJldHVybiB0b2tlbnMubGVuZ3RoID09PSAxXG4gICAgICA/IHZtLiRldmFsKHRva2Vuc1swXS52YWx1ZSlcbiAgICAgIDogdG9rZW5zLm1hcChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICByZXR1cm4gdG9rZW4udGFnXG4gICAgICAgICAgICA/IHZtLiRldmFsKHRva2VuLnZhbHVlKVxuICAgICAgICAgICAgOiB0b2tlbi52YWx1ZVxuICAgICAgICB9KS5qb2luKCcnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB0ZXh0XG4gIH1cbn1cblxuLyoqXG4gKiBMb2cgaW5zdGFuY2UgZGF0YSBhcyBhIHBsYWluIEpTIG9iamVjdFxuICogc28gdGhhdCBpdCBpcyBlYXNpZXIgdG8gaW5zcGVjdCBpbiBjb25zb2xlLlxuICogVGhpcyBtZXRob2QgYXNzdW1lcyBjb25zb2xlIGlzIGF2YWlsYWJsZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gW3BhdGhdXG4gKi9cblxuZXhwb3J0cy4kbG9nID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIGRhdGEgPSBwYXRoXG4gICAgPyBQYXRoLmdldCh0aGlzLl9kYXRhLCBwYXRoKVxuICAgIDogdGhpcy5fZGF0YVxuICBpZiAoZGF0YSkge1xuICAgIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICB9XG4gIGNvbnNvbGUubG9nKGRhdGEpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpXG5cbi8qKlxuICogQXBwZW5kIGluc3RhbmNlIHRvIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gKi9cblxuZXhwb3J0cy4kYXBwZW5kVG8gPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgcmV0dXJuIGluc2VydChcbiAgICB0aGlzLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbixcbiAgICBhcHBlbmQsIHRyYW5zaXRpb24uYXBwZW5kXG4gIClcbn1cblxuLyoqXG4gKiBQcmVwZW5kIGluc3RhbmNlIHRvIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gKi9cblxuZXhwb3J0cy4kcHJlcGVuZFRvID0gZnVuY3Rpb24gKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgaWYgKHRhcmdldC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICB0aGlzLiRiZWZvcmUodGFyZ2V0LmZpcnN0Q2hpbGQsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfSBlbHNlIHtcbiAgICB0aGlzLiRhcHBlbmRUbyh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIEluc2VydCBpbnN0YW5jZSBiZWZvcmUgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRiZWZvcmUgPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgcmV0dXJuIGluc2VydChcbiAgICB0aGlzLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbixcbiAgICBiZWZvcmUsIHRyYW5zaXRpb24uYmVmb3JlXG4gIClcbn1cblxuLyoqXG4gKiBJbnNlcnQgaW5zdGFuY2UgYWZ0ZXIgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRhZnRlciA9IGZ1bmN0aW9uICh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbikge1xuICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpXG4gIGlmICh0YXJnZXQubmV4dFNpYmxpbmcpIHtcbiAgICB0aGlzLiRiZWZvcmUodGFyZ2V0Lm5leHRTaWJsaW5nLCBjYiwgd2l0aFRyYW5zaXRpb24pXG4gIH0gZWxzZSB7XG4gICAgdGhpcy4kYXBwZW5kVG8odGFyZ2V0LnBhcmVudE5vZGUsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlbW92ZSBpbnN0YW5jZSBmcm9tIERPTVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRyZW1vdmUgPSBmdW5jdGlvbiAoY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHZhciBpbkRvYyA9IHRoaXMuX2lzQXR0YWNoZWQgJiYgXy5pbkRvYyh0aGlzLiRlbClcbiAgLy8gaWYgd2UgYXJlIG5vdCBpbiBkb2N1bWVudCwgbm8gbmVlZCB0byBjaGVja1xuICAvLyBmb3IgdHJhbnNpdGlvbnNcbiAgaWYgKCFpbkRvYykgd2l0aFRyYW5zaXRpb24gPSBmYWxzZVxuICB2YXIgb3BcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciByZWFsQ2IgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGluRG9jKSBzZWxmLl9jYWxsSG9vaygnZGV0YWNoZWQnKVxuICAgIGlmIChjYikgY2IoKVxuICB9XG4gIGlmIChcbiAgICB0aGlzLl9pc0Jsb2NrICYmXG4gICAgIXRoaXMuX2Jsb2NrRnJhZ21lbnQuaGFzQ2hpbGROb2RlcygpXG4gICkge1xuICAgIG9wID0gd2l0aFRyYW5zaXRpb24gPT09IGZhbHNlXG4gICAgICA/IGFwcGVuZFxuICAgICAgOiB0cmFuc2l0aW9uLnJlbW92ZVRoZW5BcHBlbmRcbiAgICBibG9ja09wKHRoaXMsIHRoaXMuX2Jsb2NrRnJhZ21lbnQsIG9wLCByZWFsQ2IpXG4gIH0gZWxzZSB7XG4gICAgb3AgPSB3aXRoVHJhbnNpdGlvbiA9PT0gZmFsc2VcbiAgICAgID8gcmVtb3ZlXG4gICAgICA6IHRyYW5zaXRpb24ucmVtb3ZlXG4gICAgb3AodGhpcy4kZWwsIHRoaXMsIHJlYWxDYilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFNoYXJlZCBET00gaW5zZXJ0aW9uIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AxIC0gb3AgZm9yIG5vbi10cmFuc2l0aW9uIGluc2VydFxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AyIC0gb3AgZm9yIHRyYW5zaXRpb24gaW5zZXJ0XG4gKiBAcmV0dXJuIHZtXG4gKi9cblxuZnVuY3Rpb24gaW5zZXJ0ICh2bSwgdGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24sIG9wMSwgb3AyKSB7XG4gIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgdmFyIHRhcmdldElzRGV0YWNoZWQgPSAhXy5pbkRvYyh0YXJnZXQpXG4gIHZhciBvcCA9IHdpdGhUcmFuc2l0aW9uID09PSBmYWxzZSB8fCB0YXJnZXRJc0RldGFjaGVkXG4gICAgPyBvcDFcbiAgICA6IG9wMlxuICB2YXIgc2hvdWxkQ2FsbEhvb2sgPVxuICAgICF0YXJnZXRJc0RldGFjaGVkICYmXG4gICAgIXZtLl9pc0F0dGFjaGVkICYmXG4gICAgIV8uaW5Eb2Modm0uJGVsKVxuICBpZiAodm0uX2lzQmxvY2spIHtcbiAgICBibG9ja09wKHZtLCB0YXJnZXQsIG9wLCBjYilcbiAgfSBlbHNlIHtcbiAgICBvcCh2bS4kZWwsIHRhcmdldCwgdm0sIGNiKVxuICB9XG4gIGlmIChzaG91bGRDYWxsSG9vaykge1xuICAgIHZtLl9jYWxsSG9vaygnYXR0YWNoZWQnKVxuICB9XG4gIHJldHVybiB2bVxufVxuXG4vKipcbiAqIEV4ZWN1dGUgYSB0cmFuc2l0aW9uIG9wZXJhdGlvbiBvbiBhIGJsb2NrIGluc3RhbmNlLFxuICogaXRlcmF0aW5nIHRocm91Z2ggYWxsIGl0cyBibG9jayBub2Rlcy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5mdW5jdGlvbiBibG9ja09wICh2bSwgdGFyZ2V0LCBvcCwgY2IpIHtcbiAgdmFyIGN1cnJlbnQgPSB2bS5fYmxvY2tTdGFydFxuICB2YXIgZW5kID0gdm0uX2Jsb2NrRW5kXG4gIHZhciBuZXh0XG4gIHdoaWxlIChuZXh0ICE9PSBlbmQpIHtcbiAgICBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZ1xuICAgIG9wKGN1cnJlbnQsIHRhcmdldCwgdm0pXG4gICAgY3VycmVudCA9IG5leHRcbiAgfVxuICBvcChlbmQsIHRhcmdldCwgdm0sIGNiKVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBzZWxlY3RvcnNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbFxuICovXG5cbmZ1bmN0aW9uIHF1ZXJ5IChlbCkge1xuICByZXR1cm4gdHlwZW9mIGVsID09PSAnc3RyaW5nJ1xuICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbClcbiAgICA6IGVsXG59XG5cbi8qKlxuICogQXBwZW5kIG9wZXJhdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmZ1bmN0aW9uIGFwcGVuZCAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgaWYgKGNiKSBjYigpXG59XG5cbi8qKlxuICogSW5zZXJ0QmVmb3JlIG9wZXJhdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmZ1bmN0aW9uIGJlZm9yZSAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIF8uYmVmb3JlKGVsLCB0YXJnZXQpXG4gIGlmIChjYikgY2IoKVxufVxuXG4vKipcbiAqIFJlbW92ZSBvcGVyYXRpb24gdGhhdCB0YWtlcyBhIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmZ1bmN0aW9uIHJlbW92ZSAoZWwsIHZtLCBjYikge1xuICBfLnJlbW92ZShlbClcbiAgaWYgKGNiKSBjYigpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuXG5leHBvcnRzLiRvbiA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgKHRoaXMuX2V2ZW50c1tldmVudF0gfHwgKHRoaXMuX2V2ZW50c1tldmVudF0gPSBbXSkpXG4gICAgLnB1c2goZm4pXG4gIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIDEpXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuXG5leHBvcnRzLiRvbmNlID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgZnVuY3Rpb24gb24gKCkge1xuICAgIHNlbGYuJG9mZihldmVudCwgb24pXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG4gIG9uLmZuID0gZm5cbiAgdGhpcy4kb24oZXZlbnQsIG9uKVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cblxuZXhwb3J0cy4kb2ZmID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICB2YXIgY2JzXG4gIC8vIGFsbFxuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBpZiAodGhpcy4kcGFyZW50KSB7XG4gICAgICBmb3IgKGV2ZW50IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgICBjYnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdXG4gICAgICAgIGlmIChjYnMpIHtcbiAgICAgICAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtY2JzLmxlbmd0aClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9ldmVudHMgPSB7fVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgY2JzID0gdGhpcy5fZXZlbnRzW2V2ZW50XVxuICBpZiAoIWNicykge1xuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtY2JzLmxlbmd0aClcbiAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gbnVsbFxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgLy8gc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2JcbiAgdmFyIGkgPSBjYnMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBjYiA9IGNic1tpXVxuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtMSlcbiAgICAgIGNicy5zcGxpY2UoaSwgMSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogVHJpZ2dlciBhbiBldmVudCBvbiBzZWxmLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICovXG5cbmV4cG9ydHMuJGVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgdGhpcy5fZXZlbnRDYW5jZWxsZWQgPSBmYWxzZVxuICB2YXIgY2JzID0gdGhpcy5fZXZlbnRzW2V2ZW50XVxuICBpZiAoY2JzKSB7XG4gICAgLy8gYXZvaWQgbGVha2luZyBhcmd1bWVudHM6XG4gICAgLy8gaHR0cDovL2pzcGVyZi5jb20vY2xvc3VyZS13aXRoLWFyZ3VtZW50c1xuICAgIHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDFcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShpKVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdXG4gICAgfVxuICAgIGkgPSAwXG4gICAgY2JzID0gY2JzLmxlbmd0aCA+IDFcbiAgICAgID8gXy50b0FycmF5KGNicylcbiAgICAgIDogY2JzXG4gICAgZm9yICh2YXIgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChjYnNbaV0uYXBwbHkodGhpcywgYXJncykgPT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50Q2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGJyb2FkY2FzdCBhbiBldmVudCB0byBhbGwgY2hpbGRyZW4gaW5zdGFuY2VzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHsuLi4qfSBhZGRpdGlvbmFsIGFyZ3VtZW50c1xuICovXG5cbmV4cG9ydHMuJGJyb2FkY2FzdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAvLyBpZiBubyBjaGlsZCBoYXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyBldmVudCxcbiAgLy8gdGhlbiB0aGVyZSdzIG5vIG5lZWQgdG8gYnJvYWRjYXN0LlxuICBpZiAoIXRoaXMuX2V2ZW50c0NvdW50W2V2ZW50XSkgcmV0dXJuXG4gIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICBjaGlsZC4kZW1pdC5hcHBseShjaGlsZCwgYXJndW1lbnRzKVxuICAgIGlmICghY2hpbGQuX2V2ZW50Q2FuY2VsbGVkKSB7XG4gICAgICBjaGlsZC4kYnJvYWRjYXN0LmFwcGx5KGNoaWxkLCBhcmd1bWVudHMpXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgcHJvcGFnYXRlIGFuIGV2ZW50IHVwIHRoZSBwYXJlbnQgY2hhaW4uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0gey4uLip9IGFkZGl0aW9uYWwgYXJndW1lbnRzXG4gKi9cblxuZXhwb3J0cy4kZGlzcGF0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwYXJlbnQgPSB0aGlzLiRwYXJlbnRcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC4kZW1pdC5hcHBseShwYXJlbnQsIGFyZ3VtZW50cylcbiAgICBwYXJlbnQgPSBwYXJlbnQuX2V2ZW50Q2FuY2VsbGVkXG4gICAgICA/IG51bGxcbiAgICAgIDogcGFyZW50LiRwYXJlbnRcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIE1vZGlmeSB0aGUgbGlzdGVuZXIgY291bnRzIG9uIGFsbCBwYXJlbnRzLlxuICogVGhpcyBib29ra2VlcGluZyBhbGxvd3MgJGJyb2FkY2FzdCB0byByZXR1cm4gZWFybHkgd2hlblxuICogbm8gY2hpbGQgaGFzIGxpc3RlbmVkIHRvIGEgY2VydGFpbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gKi9cblxudmFyIGhvb2tSRSA9IC9eaG9vazovXG5mdW5jdGlvbiBtb2RpZnlMaXN0ZW5lckNvdW50ICh2bSwgZXZlbnQsIGNvdW50KSB7XG4gIHZhciBwYXJlbnQgPSB2bS4kcGFyZW50XG4gIC8vIGhvb2tzIGRvIG5vdCBnZXQgYnJvYWRjYXN0ZWQgc28gbm8gbmVlZFxuICAvLyB0byBkbyBib29ra2VlcGluZyBmb3IgdGhlbVxuICBpZiAoIXBhcmVudCB8fCAhY291bnQgfHwgaG9va1JFLnRlc3QoZXZlbnQpKSByZXR1cm5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC5fZXZlbnRzQ291bnRbZXZlbnRdID1cbiAgICAgIChwYXJlbnQuX2V2ZW50c0NvdW50W2V2ZW50XSB8fCAwKSArIGNvdW50XG4gICAgcGFyZW50ID0gcGFyZW50LiRwYXJlbnRcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgbWVyZ2VPcHRpb25zID0gcmVxdWlyZSgnLi4vdXRpbC9tZXJnZS1vcHRpb24nKVxuXG4vKipcbiAqIEV4cG9zZSB1c2VmdWwgaW50ZXJuYWxzXG4gKi9cblxuZXhwb3J0cy51dGlsID0gX1xuZXhwb3J0cy5uZXh0VGljayA9IF8ubmV4dFRpY2tcbmV4cG9ydHMuY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxuZXhwb3J0cy5jb21waWxlciA9IHtcbiAgY29tcGlsZTogcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpLFxuICB0cmFuc2NsdWRlOiByZXF1aXJlKCcuLi9jb21waWxlci90cmFuc2NsdWRlJylcbn1cblxuZXhwb3J0cy5wYXJzZXJzID0ge1xuICBwYXRoOiByZXF1aXJlKCcuLi9wYXJzZXJzL3BhdGgnKSxcbiAgdGV4dDogcmVxdWlyZSgnLi4vcGFyc2Vycy90ZXh0JyksXG4gIHRlbXBsYXRlOiByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJyksXG4gIGRpcmVjdGl2ZTogcmVxdWlyZSgnLi4vcGFyc2Vycy9kaXJlY3RpdmUnKSxcbiAgZXhwcmVzc2lvbjogcmVxdWlyZSgnLi4vcGFyc2Vycy9leHByZXNzaW9uJylcbn1cblxuLyoqXG4gKiBFYWNoIGluc3RhbmNlIGNvbnN0cnVjdG9yLCBpbmNsdWRpbmcgVnVlLCBoYXMgYSB1bmlxdWVcbiAqIGNpZC4gVGhpcyBlbmFibGVzIHVzIHRvIGNyZWF0ZSB3cmFwcGVkIFwiY2hpbGRcbiAqIGNvbnN0cnVjdG9yc1wiIGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlIGFuZCBjYWNoZSB0aGVtLlxuICovXG5cbmV4cG9ydHMuY2lkID0gMFxudmFyIGNpZCA9IDFcblxuLyoqXG4gKiBDbGFzcyBpbmVocml0YW5jZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBleHRlbmRPcHRpb25zXG4gKi9cblxuZXhwb3J0cy5leHRlbmQgPSBmdW5jdGlvbiAoZXh0ZW5kT3B0aW9ucykge1xuICBleHRlbmRPcHRpb25zID0gZXh0ZW5kT3B0aW9ucyB8fCB7fVxuICB2YXIgU3VwZXIgPSB0aGlzXG4gIHZhciBTdWIgPSBjcmVhdGVDbGFzcyhcbiAgICBleHRlbmRPcHRpb25zLm5hbWUgfHxcbiAgICBTdXBlci5vcHRpb25zLm5hbWUgfHxcbiAgICAnVnVlQ29tcG9uZW50J1xuICApXG4gIFN1Yi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFN1cGVyLnByb3RvdHlwZSlcbiAgU3ViLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1YlxuICBTdWIuY2lkID0gY2lkKytcbiAgU3ViLm9wdGlvbnMgPSBtZXJnZU9wdGlvbnMoXG4gICAgU3VwZXIub3B0aW9ucyxcbiAgICBleHRlbmRPcHRpb25zXG4gIClcbiAgU3ViWydzdXBlciddID0gU3VwZXJcbiAgLy8gYWxsb3cgZnVydGhlciBleHRlbnNpb25cbiAgU3ViLmV4dGVuZCA9IFN1cGVyLmV4dGVuZFxuICAvLyBjcmVhdGUgYXNzZXQgcmVnaXN0ZXJzLCBzbyBleHRlbmRlZCBjbGFzc2VzXG4gIC8vIGNhbiBoYXZlIHRoZWlyIHByaXZhdGUgYXNzZXRzIHRvby5cbiAgY3JlYXRlQXNzZXRSZWdpc3RlcnMoU3ViKVxuICByZXR1cm4gU3ViXG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdWItY2xhc3MgY29uc3RydWN0b3Igd2l0aCB0aGVcbiAqIGdpdmVuIG5hbWUuIFRoaXMgZ2l2ZXMgdXMgbXVjaCBuaWNlciBvdXRwdXQgd2hlblxuICogbG9nZ2luZyBpbnN0YW5jZXMgaW4gdGhlIGNvbnNvbGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUNsYXNzIChuYW1lKSB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb24oXG4gICAgJ3JldHVybiBmdW5jdGlvbiAnICsgXy5jbGFzc2lmeShuYW1lKSArXG4gICAgJyAob3B0aW9ucykgeyB0aGlzLl9pbml0KG9wdGlvbnMpIH0nXG4gICkoKVxufVxuXG4vKipcbiAqIFBsdWdpbiBzeXN0ZW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGx1Z2luXG4gKi9cblxuZXhwb3J0cy51c2UgPSBmdW5jdGlvbiAocGx1Z2luKSB7XG4gIC8vIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICB2YXIgYXJncyA9IF8udG9BcnJheShhcmd1bWVudHMsIDEpXG4gIGFyZ3MudW5zaGlmdCh0aGlzKVxuICBpZiAodHlwZW9mIHBsdWdpbi5pbnN0YWxsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcGx1Z2luLmluc3RhbGwuYXBwbHkocGx1Z2luLCBhcmdzKVxuICB9IGVsc2Uge1xuICAgIHBsdWdpbi5hcHBseShudWxsLCBhcmdzKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogRGVmaW5lIGFzc2V0IHJlZ2lzdHJhdGlvbiBtZXRob2RzIG9uIGEgY29uc3RydWN0b3IuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ29uc3RydWN0b3JcbiAqL1xuXG52YXIgYXNzZXRUeXBlcyA9IFtcbiAgJ2RpcmVjdGl2ZScsXG4gICdmaWx0ZXInLFxuICAncGFydGlhbCcsXG4gICd0cmFuc2l0aW9uJ1xuXVxuXG5mdW5jdGlvbiBjcmVhdGVBc3NldFJlZ2lzdGVycyAoQ29uc3RydWN0b3IpIHtcblxuICAvKiBBc3NldCByZWdpc3RyYXRpb24gbWV0aG9kcyBzaGFyZSB0aGUgc2FtZSBzaWduYXR1cmU6XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZFxuICAgKiBAcGFyYW0geyp9IGRlZmluaXRpb25cbiAgICovXG5cbiAgYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgQ29uc3RydWN0b3JbdHlwZV0gPSBmdW5jdGlvbiAoaWQsIGRlZmluaXRpb24pIHtcbiAgICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXSA9IGRlZmluaXRpb25cbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgLyoqXG4gICAqIENvbXBvbmVudCByZWdpc3RyYXRpb24gbmVlZHMgdG8gYXV0b21hdGljYWxseSBpbnZva2VcbiAgICogVnVlLmV4dGVuZCBvbiBvYmplY3QgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWRcbiAgICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb259IGRlZmluaXRpb25cbiAgICovXG5cbiAgQ29uc3RydWN0b3IuY29tcG9uZW50ID0gZnVuY3Rpb24gKGlkLCBkZWZpbml0aW9uKSB7XG4gICAgaWYgKCFkZWZpbml0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbXBvbmVudHNbaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChfLmlzUGxhaW5PYmplY3QoZGVmaW5pdGlvbikpIHtcbiAgICAgICAgZGVmaW5pdGlvbi5uYW1lID0gaWRcbiAgICAgICAgZGVmaW5pdGlvbiA9IF8uVnVlLmV4dGVuZChkZWZpbml0aW9uKVxuICAgICAgfVxuICAgICAgdGhpcy5vcHRpb25zLmNvbXBvbmVudHNbaWRdID0gZGVmaW5pdGlvblxuICAgIH1cbiAgfVxufVxuXG5jcmVhdGVBc3NldFJlZ2lzdGVycyhleHBvcnRzKSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgY29tcGlsZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL2NvbXBpbGUnKVxuXG4vKipcbiAqIFNldCBpbnN0YW5jZSB0YXJnZXQgZWxlbWVudCBhbmQga2ljayBvZmYgdGhlIGNvbXBpbGF0aW9uXG4gKiBwcm9jZXNzLiBUaGUgcGFzc2VkIGluIGBlbGAgY2FuIGJlIGEgc2VsZWN0b3Igc3RyaW5nLCBhblxuICogZXhpc3RpbmcgRWxlbWVudCwgb3IgYSBEb2N1bWVudEZyYWdtZW50IChmb3IgYmxvY2tcbiAqIGluc3RhbmNlcykuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8c3RyaW5nfSBlbFxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuJG1vdW50ID0gZnVuY3Rpb24gKGVsKSB7XG4gIGlmICh0aGlzLl9pc0NvbXBpbGVkKSB7XG4gICAgXy53YXJuKCckbW91bnQoKSBzaG91bGQgYmUgY2FsbGVkIG9ubHkgb25jZS4nKVxuICAgIHJldHVyblxuICB9XG4gIGlmICghZWwpIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIH0gZWxzZSBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzZWxlY3RvciA9IGVsXG4gICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKVxuICAgIGlmICghZWwpIHtcbiAgICAgIF8ud2FybignQ2Fubm90IGZpbmQgZWxlbWVudDogJyArIHNlbGVjdG9yKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICB9XG4gIHRoaXMuX2NvbXBpbGUoZWwpXG4gIHRoaXMuX2lzQ29tcGlsZWQgPSB0cnVlXG4gIHRoaXMuX2NhbGxIb29rKCdjb21waWxlZCcpXG4gIGlmIChfLmluRG9jKHRoaXMuJGVsKSkge1xuICAgIHRoaXMuX2NhbGxIb29rKCdhdHRhY2hlZCcpXG4gICAgdGhpcy5faW5pdERPTUhvb2tzKClcbiAgICByZWFkeS5jYWxsKHRoaXMpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5faW5pdERPTUhvb2tzKClcbiAgICB0aGlzLiRvbmNlKCdob29rOmF0dGFjaGVkJywgcmVhZHkpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBNYXJrIGFuIGluc3RhbmNlIGFzIHJlYWR5LlxuICovXG5cbmZ1bmN0aW9uIHJlYWR5ICgpIHtcbiAgdGhpcy5faXNBdHRhY2hlZCA9IHRydWVcbiAgdGhpcy5faXNSZWFkeSA9IHRydWVcbiAgdGhpcy5fY2FsbEhvb2soJ3JlYWR5Jylcbn1cblxuLyoqXG4gKiBUZWFyZG93biB0aGUgaW5zdGFuY2UsIHNpbXBseSBkZWxlZ2F0ZSB0byB0aGUgaW50ZXJuYWxcbiAqIF9kZXN0cm95LlxuICovXG5cbmV4cG9ydHMuJGRlc3Ryb3kgPSBmdW5jdGlvbiAocmVtb3ZlLCBkZWZlckNsZWFudXApIHtcbiAgdGhpcy5fZGVzdHJveShyZW1vdmUsIGRlZmVyQ2xlYW51cClcbn1cblxuLyoqXG4gKiBQYXJ0aWFsbHkgY29tcGlsZSBhIHBpZWNlIG9mIERPTSBhbmQgcmV0dXJuIGFcbiAqIGRlY29tcGlsZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMuJGNvbXBpbGUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgcmV0dXJuIGNvbXBpbGUoZWwsIHRoaXMuJG9wdGlvbnMsIHRydWUpKHRoaXMsIGVsKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBNQVhfVVBEQVRFX0NPVU5UID0gMTBcblxuLy8gd2UgaGF2ZSB0d28gc2VwYXJhdGUgcXVldWVzOiBvbmUgZm9yIGRpcmVjdGl2ZSB1cGRhdGVzXG4vLyBhbmQgb25lIGZvciB1c2VyIHdhdGNoZXIgcmVnaXN0ZXJlZCB2aWEgJHdhdGNoKCkuXG4vLyB3ZSB3YW50IHRvIGd1YXJhbnRlZSBkaXJlY3RpdmUgdXBkYXRlcyB0byBiZSBjYWxsZWRcbi8vIGJlZm9yZSB1c2VyIHdhdGNoZXJzIHNvIHRoYXQgd2hlbiB1c2VyIHdhdGNoZXJzIGFyZVxuLy8gdHJpZ2dlcmVkLCB0aGUgRE9NIHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIGluIHVwZGF0ZWRcbi8vIHN0YXRlLlxudmFyIHF1ZXVlID0gW11cbnZhciB1c2VyUXVldWUgPSBbXVxudmFyIGhhcyA9IHt9XG52YXIgd2FpdGluZyA9IGZhbHNlXG52YXIgZmx1c2hpbmcgPSBmYWxzZVxuXG4vKipcbiAqIFJlc2V0IHRoZSBiYXRjaGVyJ3Mgc3RhdGUuXG4gKi9cblxuZnVuY3Rpb24gcmVzZXQgKCkge1xuICBxdWV1ZSA9IFtdXG4gIHVzZXJRdWV1ZSA9IFtdXG4gIGhhcyA9IHt9XG4gIHdhaXRpbmcgPSBmYWxzZVxuICBmbHVzaGluZyA9IGZhbHNlXG59XG5cbi8qKlxuICogRmx1c2ggYm90aCBxdWV1ZXMgYW5kIHJ1biB0aGUgam9icy5cbiAqL1xuXG5mdW5jdGlvbiBmbHVzaCAoKSB7XG4gIGZsdXNoaW5nID0gdHJ1ZVxuICBydW4ocXVldWUpXG4gIHJ1bih1c2VyUXVldWUpXG4gIHJlc2V0KClcbn1cblxuLyoqXG4gKiBSdW4gdGhlIGpvYnMgaW4gYSBzaW5nbGUgcXVldWUuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcXVldWVcbiAqL1xuXG5mdW5jdGlvbiBydW4gKHF1ZXVlKSB7XG4gIC8vIGRvIG5vdCBjYWNoZSBsZW5ndGggYmVjYXVzZSBtb3JlIGpvYnMgbWlnaHQgYmUgcHVzaGVkXG4gIC8vIGFzIHdlIHJ1biBleGlzdGluZyBqb2JzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICBxdWV1ZVtpXS5ydW4oKVxuICB9XG59XG5cbi8qKlxuICogUHVzaCBhIGpvYiBpbnRvIHRoZSBqb2IgcXVldWUuXG4gKiBKb2JzIHdpdGggZHVwbGljYXRlIElEcyB3aWxsIGJlIHNraXBwZWQgdW5sZXNzIGl0J3NcbiAqIHB1c2hlZCB3aGVuIHRoZSBxdWV1ZSBpcyBiZWluZyBmbHVzaGVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBqb2JcbiAqICAgcHJvcGVydGllczpcbiAqICAgLSB7U3RyaW5nfE51bWJlcn0gaWRcbiAqICAgLSB7RnVuY3Rpb259ICAgICAgcnVuXG4gKi9cblxuZXhwb3J0cy5wdXNoID0gZnVuY3Rpb24gKGpvYikge1xuICB2YXIgaWQgPSBqb2IuaWRcbiAgaWYgKCFpZCB8fCAhaGFzW2lkXSB8fCBmbHVzaGluZykge1xuICAgIGlmICghaGFzW2lkXSkge1xuICAgICAgaGFzW2lkXSA9IDFcbiAgICB9IGVsc2Uge1xuICAgICAgaGFzW2lkXSsrXG4gICAgICAvLyBkZXRlY3QgcG9zc2libGUgaW5maW5pdGUgdXBkYXRlIGxvb3BzXG4gICAgICBpZiAoaGFzW2lkXSA+IE1BWF9VUERBVEVfQ09VTlQpIHtcbiAgICAgICAgXy53YXJuKFxuICAgICAgICAgICdZb3UgbWF5IGhhdmUgYW4gaW5maW5pdGUgdXBkYXRlIGxvb3AgZm9yIHRoZSAnICtcbiAgICAgICAgICAnd2F0Y2hlciB3aXRoIGV4cHJlc3Npb246IFwiJyArIGpvYi5leHByZXNzaW9uICsgJ1wiLidcbiAgICAgICAgKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQSB1c2VyIHdhdGNoZXIgY2FsbGJhY2sgY291bGQgdHJpZ2dlciBhbm90aGVyXG4gICAgLy8gZGlyZWN0aXZlIHVwZGF0ZSBkdXJpbmcgdGhlIGZsdXNoaW5nOyBhdCB0aGF0IHRpbWVcbiAgICAvLyB0aGUgZGlyZWN0aXZlIHF1ZXVlIHdvdWxkIGFscmVhZHkgaGF2ZSBiZWVuIHJ1biwgc29cbiAgICAvLyB3ZSBjYWxsIHRoYXQgdXBkYXRlIGltbWVkaWF0ZWx5IGFzIGl0IGlzIHB1c2hlZC5cbiAgICBpZiAoZmx1c2hpbmcgJiYgIWpvYi51c2VyKSB7XG4gICAgICBqb2IucnVuKClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICA7KGpvYi51c2VyID8gdXNlclF1ZXVlIDogcXVldWUpLnB1c2goam9iKVxuICAgIGlmICghd2FpdGluZykge1xuICAgICAgd2FpdGluZyA9IHRydWVcbiAgICAgIF8ubmV4dFRpY2soZmx1c2gpXG4gICAgfVxuICB9XG59IiwiLyoqXG4gKiBBIGRvdWJseSBsaW5rZWQgbGlzdC1iYXNlZCBMZWFzdCBSZWNlbnRseSBVc2VkIChMUlUpXG4gKiBjYWNoZS4gV2lsbCBrZWVwIG1vc3QgcmVjZW50bHkgdXNlZCBpdGVtcyB3aGlsZVxuICogZGlzY2FyZGluZyBsZWFzdCByZWNlbnRseSB1c2VkIGl0ZW1zIHdoZW4gaXRzIGxpbWl0IGlzXG4gKiByZWFjaGVkLiBUaGlzIGlzIGEgYmFyZS1ib25lIHZlcnNpb24gb2ZcbiAqIFJhc211cyBBbmRlcnNzb24ncyBqcy1scnU6XG4gKlxuICogICBodHRwczovL2dpdGh1Yi5jb20vcnNtcy9qcy1scnVcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbGltaXRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIENhY2hlIChsaW1pdCkge1xuICB0aGlzLnNpemUgPSAwXG4gIHRoaXMubGltaXQgPSBsaW1pdFxuICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSB1bmRlZmluZWRcbiAgdGhpcy5fa2V5bWFwID0ge31cbn1cblxudmFyIHAgPSBDYWNoZS5wcm90b3R5cGVcblxuLyoqXG4gKiBQdXQgPHZhbHVlPiBpbnRvIHRoZSBjYWNoZSBhc3NvY2lhdGVkIHdpdGggPGtleT4uXG4gKiBSZXR1cm5zIHRoZSBlbnRyeSB3aGljaCB3YXMgcmVtb3ZlZCB0byBtYWtlIHJvb20gZm9yXG4gKiB0aGUgbmV3IGVudHJ5LiBPdGhlcndpc2UgdW5kZWZpbmVkIGlzIHJldHVybmVkLlxuICogKGkuZS4gaWYgdGhlcmUgd2FzIGVub3VnaCByb29tIGFscmVhZHkpLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge0VudHJ5fHVuZGVmaW5lZH1cbiAqL1xuXG5wLnB1dCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciBlbnRyeSA9IHtcbiAgICBrZXk6a2V5LFxuICAgIHZhbHVlOnZhbHVlXG4gIH1cbiAgdGhpcy5fa2V5bWFwW2tleV0gPSBlbnRyeVxuICBpZiAodGhpcy50YWlsKSB7XG4gICAgdGhpcy50YWlsLm5ld2VyID0gZW50cnlcbiAgICBlbnRyeS5vbGRlciA9IHRoaXMudGFpbFxuICB9IGVsc2Uge1xuICAgIHRoaXMuaGVhZCA9IGVudHJ5XG4gIH1cbiAgdGhpcy50YWlsID0gZW50cnlcbiAgaWYgKHRoaXMuc2l6ZSA9PT0gdGhpcy5saW1pdCkge1xuICAgIHJldHVybiB0aGlzLnNoaWZ0KClcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNpemUrK1xuICB9XG59XG5cbi8qKlxuICogUHVyZ2UgdGhlIGxlYXN0IHJlY2VudGx5IHVzZWQgKG9sZGVzdCkgZW50cnkgZnJvbSB0aGVcbiAqIGNhY2hlLiBSZXR1cm5zIHRoZSByZW1vdmVkIGVudHJ5IG9yIHVuZGVmaW5lZCBpZiB0aGVcbiAqIGNhY2hlIHdhcyBlbXB0eS5cbiAqL1xuXG5wLnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZW50cnkgPSB0aGlzLmhlYWRcbiAgaWYgKGVudHJ5KSB7XG4gICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5ld2VyXG4gICAgdGhpcy5oZWFkLm9sZGVyID0gdW5kZWZpbmVkXG4gICAgZW50cnkubmV3ZXIgPSBlbnRyeS5vbGRlciA9IHVuZGVmaW5lZFxuICAgIHRoaXMuX2tleW1hcFtlbnRyeS5rZXldID0gdW5kZWZpbmVkXG4gIH1cbiAgcmV0dXJuIGVudHJ5XG59XG5cbi8qKlxuICogR2V0IGFuZCByZWdpc3RlciByZWNlbnQgdXNlIG9mIDxrZXk+LiBSZXR1cm5zIHRoZSB2YWx1ZVxuICogYXNzb2NpYXRlZCB3aXRoIDxrZXk+IG9yIHVuZGVmaW5lZCBpZiBub3QgaW4gY2FjaGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtCb29sZWFufSByZXR1cm5FbnRyeVxuICogQHJldHVybiB7RW50cnl8Kn1cbiAqL1xuXG5wLmdldCA9IGZ1bmN0aW9uIChrZXksIHJldHVybkVudHJ5KSB7XG4gIHZhciBlbnRyeSA9IHRoaXMuX2tleW1hcFtrZXldXG4gIGlmIChlbnRyeSA9PT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgaWYgKGVudHJ5ID09PSB0aGlzLnRhaWwpIHtcbiAgICByZXR1cm4gcmV0dXJuRW50cnlcbiAgICAgID8gZW50cnlcbiAgICAgIDogZW50cnkudmFsdWVcbiAgfVxuICAvLyBIRUFELS0tLS0tLS0tLS0tLS1UQUlMXG4gIC8vICAgPC5vbGRlciAgIC5uZXdlcj5cbiAgLy8gIDwtLS0gYWRkIGRpcmVjdGlvbiAtLVxuICAvLyAgIEEgIEIgIEMgIDxEPiAgRVxuICBpZiAoZW50cnkubmV3ZXIpIHtcbiAgICBpZiAoZW50cnkgPT09IHRoaXMuaGVhZCkge1xuICAgICAgdGhpcy5oZWFkID0gZW50cnkubmV3ZXJcbiAgICB9XG4gICAgZW50cnkubmV3ZXIub2xkZXIgPSBlbnRyeS5vbGRlciAvLyBDIDwtLSBFLlxuICB9XG4gIGlmIChlbnRyeS5vbGRlcikge1xuICAgIGVudHJ5Lm9sZGVyLm5ld2VyID0gZW50cnkubmV3ZXIgLy8gQy4gLS0+IEVcbiAgfVxuICBlbnRyeS5uZXdlciA9IHVuZGVmaW5lZCAvLyBEIC0teFxuICBlbnRyeS5vbGRlciA9IHRoaXMudGFpbCAvLyBELiAtLT4gRVxuICBpZiAodGhpcy50YWlsKSB7XG4gICAgdGhpcy50YWlsLm5ld2VyID0gZW50cnkgLy8gRS4gPC0tIERcbiAgfVxuICB0aGlzLnRhaWwgPSBlbnRyeVxuICByZXR1cm4gcmV0dXJuRW50cnlcbiAgICA/IGVudHJ5XG4gICAgOiBlbnRyeS52YWx1ZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhY2hlIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKVxudmFyIGRpclBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZGlyZWN0aXZlJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxuXG4vKipcbiAqIENvbXBpbGUgYSB0ZW1wbGF0ZSBhbmQgcmV0dXJuIGEgcmV1c2FibGUgY29tcG9zaXRlIGxpbmtcbiAqIGZ1bmN0aW9uLCB3aGljaCByZWN1cnNpdmVseSBjb250YWlucyBtb3JlIGxpbmsgZnVuY3Rpb25zXG4gKiBpbnNpZGUuIFRoaXMgdG9wIGxldmVsIGNvbXBpbGUgZnVuY3Rpb24gc2hvdWxkIG9ubHkgYmVcbiAqIGNhbGxlZCBvbiBpbnN0YW5jZSByb290IG5vZGVzLlxuICpcbiAqIFdoZW4gdGhlIGBhc1BhcmVudGAgZmxhZyBpcyB0cnVlLCB0aGlzIG1lYW5zIHdlIGFyZSBkb2luZ1xuICogYSBwYXJ0aWFsIGNvbXBpbGUgZm9yIGEgY29tcG9uZW50J3MgcGFyZW50IHNjb3BlIG1hcmt1cFxuICogKFNlZSAjNTAyKS4gVGhpcyBjb3VsZCAqKm9ubHkqKiBiZSB0cmlnZ2VyZWQgZHVyaW5nXG4gKiBjb21waWxhdGlvbiBvZiBgdi1jb21wb25lbnRgLCBhbmQgd2UgbmVlZCB0byBza2lwIHYtd2l0aCxcbiAqIHYtcmVmICYgdi1jb21wb25lbnQgaW4gdGhpcyBzaXR1YXRpb24uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSBwYXJ0aWFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFzUGFyZW50IC0gY29tcGlsaW5nIGEgY29tcG9uZW50XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyIGFzIGl0cyBwYXJlbnQuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBpbGUgKGVsLCBvcHRpb25zLCBwYXJ0aWFsLCBhc1BhcmVudCkge1xuICB2YXIgaXNCbG9jayA9IGVsLm5vZGVUeXBlID09PSAxMVxuICB2YXIgcGFyYW1zID0gIXBhcnRpYWwgJiYgb3B0aW9ucy5wYXJhbUF0dHJpYnV0ZXNcbiAgLy8gaWYgZWwgaXMgYSBmcmFnbWVudCwgdGhpcyBpcyBhIGJsb2NrIGluc3RhbmNlXG4gIC8vIGFuZCBwYXJhbUF0dHJpYnV0ZXMgd2lsbCBiZSBzdG9yZWQgb24gdGhlIGZpcnN0XG4gIC8vIGVsZW1lbnQgaW4gdGhlIHRlbXBsYXRlLiAoZXhjbHVkaW5nIHRoZSBfYmxvY2tTdGFydFxuICAvLyBjb21tZW50IG5vZGUpXG4gIHZhciBwYXJhbXNFbCA9IGlzQmxvY2sgPyBlbC5jaGlsZE5vZGVzWzFdIDogZWxcbiAgdmFyIHBhcmFtc0xpbmtGbiA9IHBhcmFtc1xuICAgID8gY29tcGlsZVBhcmFtQXR0cmlidXRlcyhwYXJhbXNFbCwgcGFyYW1zLCBvcHRpb25zKVxuICAgIDogbnVsbFxuICB2YXIgbm9kZUxpbmtGbiA9IGlzQmxvY2tcbiAgICA/IG51bGxcbiAgICA6IGNvbXBpbGVOb2RlKGVsLCBvcHRpb25zLCBhc1BhcmVudClcbiAgdmFyIGNoaWxkTGlua0ZuID1cbiAgICAhKG5vZGVMaW5rRm4gJiYgbm9kZUxpbmtGbi50ZXJtaW5hbCkgJiZcbiAgICBlbC50YWdOYW1lICE9PSAnU0NSSVBUJyAmJlxuICAgIGVsLmhhc0NoaWxkTm9kZXMoKVxuICAgICAgPyBjb21waWxlTm9kZUxpc3QoZWwuY2hpbGROb2Rlcywgb3B0aW9ucylcbiAgICAgIDogbnVsbFxuXG4gIC8qKlxuICAgKiBBIGxpbmtlciBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gYSBhbHJlYWR5IGNvbXBpbGVkXG4gICAqIHBpZWNlIG9mIERPTSwgd2hpY2ggaW5zdGFudGlhdGVzIGFsbCBkaXJlY3RpdmVcbiAgICogaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge1Z1ZX0gdm1cbiAgICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9IGVsXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAgICovXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGxpbmsgKHZtLCBlbCkge1xuICAgIHZhciBvcmlnaW5hbERpckNvdW50ID0gdm0uX2RpcmVjdGl2ZXMubGVuZ3RoXG4gICAgaWYgKHBhcmFtc0xpbmtGbikge1xuICAgICAgdmFyIHBhcmFtc0VsID0gaXNCbG9jayA/IGVsLmNoaWxkTm9kZXNbMV0gOiBlbFxuICAgICAgcGFyYW1zTGlua0ZuKHZtLCBwYXJhbXNFbClcbiAgICB9XG4gICAgLy8gY2FjaGUgY2hpbGROb2RlcyBiZWZvcmUgbGlua2luZyBwYXJlbnQsIGZpeCAjNjU3XG4gICAgdmFyIGNoaWxkTm9kZXMgPSBfLnRvQXJyYXkoZWwuY2hpbGROb2RlcylcbiAgICBpZiAobm9kZUxpbmtGbikgbm9kZUxpbmtGbih2bSwgZWwpXG4gICAgaWYgKGNoaWxkTGlua0ZuKSBjaGlsZExpbmtGbih2bSwgY2hpbGROb2RlcylcblxuICAgIC8qKlxuICAgICAqIElmIHRoaXMgaXMgYSBwYXJ0aWFsIGNvbXBpbGUsIHRoZSBsaW5rZXIgZnVuY3Rpb25cbiAgICAgKiByZXR1cm5zIGFuIHVubGluayBmdW5jdGlvbiB0aGF0IHRlYXJzZG93biBhbGxcbiAgICAgKiBkaXJlY3RpdmVzIGluc3RhbmNlcyBnZW5lcmF0ZWQgZHVyaW5nIHRoZSBwYXJ0aWFsXG4gICAgICogbGlua2luZy5cbiAgICAgKi9cblxuICAgIGlmIChwYXJ0aWFsKSB7XG4gICAgICB2YXIgZGlycyA9IHZtLl9kaXJlY3RpdmVzLnNsaWNlKG9yaWdpbmFsRGlyQ291bnQpXG4gICAgICByZXR1cm4gZnVuY3Rpb24gdW5saW5rICgpIHtcbiAgICAgICAgdmFyIGkgPSBkaXJzLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgZGlyc1tpXS5fdGVhcmRvd24oKVxuICAgICAgICB9XG4gICAgICAgIGkgPSB2bS5fZGlyZWN0aXZlcy5pbmRleE9mKGRpcnNbMF0pXG4gICAgICAgIHZtLl9kaXJlY3RpdmVzLnNwbGljZShpLCBkaXJzLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIGEgbm9kZSBhbmQgcmV0dXJuIGEgbm9kZUxpbmtGbiBiYXNlZCBvbiB0aGVcbiAqIG5vZGUgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFzUGFyZW50XG4gKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZU5vZGUgKG5vZGUsIG9wdGlvbnMsIGFzUGFyZW50KSB7XG4gIHZhciB0eXBlID0gbm9kZS5ub2RlVHlwZVxuICBpZiAodHlwZSA9PT0gMSAmJiBub2RlLnRhZ05hbWUgIT09ICdTQ1JJUFQnKSB7XG4gICAgcmV0dXJuIGNvbXBpbGVFbGVtZW50KG5vZGUsIG9wdGlvbnMsIGFzUGFyZW50KVxuICB9IGVsc2UgaWYgKHR5cGUgPT09IDMgJiYgY29uZmlnLmludGVycG9sYXRlKSB7XG4gICAgcmV0dXJuIGNvbXBpbGVUZXh0Tm9kZShub2RlLCBvcHRpb25zKVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhbiBlbGVtZW50IGFuZCByZXR1cm4gYSBub2RlTGlua0ZuLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFzUGFyZW50XG4gKiBAcmV0dXJuIHtGdW5jdGlvbnxudWxsfVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVFbGVtZW50IChlbCwgb3B0aW9ucywgYXNQYXJlbnQpIHtcbiAgdmFyIGxpbmtGbiwgdGFnLCBjb21wb25lbnRcbiAgLy8gY2hlY2sgY3VzdG9tIGVsZW1lbnQgY29tcG9uZW50LCBidXQgb25seSBvbiBub24tcm9vdFxuICBpZiAoIWFzUGFyZW50ICYmICFlbC5fX3Z1ZV9fKSB7XG4gICAgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgY29tcG9uZW50ID1cbiAgICAgIHRhZy5pbmRleE9mKCctJykgPiAwICYmXG4gICAgICBvcHRpb25zLmNvbXBvbmVudHNbdGFnXVxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShjb25maWcucHJlZml4ICsgJ2NvbXBvbmVudCcsIHRhZylcbiAgICB9XG4gIH1cbiAgaWYgKGNvbXBvbmVudCB8fCBlbC5oYXNBdHRyaWJ1dGVzKCkpIHtcbiAgICAvLyBjaGVjayB0ZXJtaW5hbCBkaXJlY2l0dmVzXG4gICAgaWYgKCFhc1BhcmVudCkge1xuICAgICAgbGlua0ZuID0gY2hlY2tUZXJtaW5hbERpcmVjdGl2ZXMoZWwsIG9wdGlvbnMpXG4gICAgfVxuICAgIC8vIGlmIG5vdCB0ZXJtaW5hbCwgYnVpbGQgbm9ybWFsIGxpbmsgZnVuY3Rpb25cbiAgICBpZiAoIWxpbmtGbikge1xuICAgICAgdmFyIGRpcnMgPSBjb2xsZWN0RGlyZWN0aXZlcyhlbCwgb3B0aW9ucywgYXNQYXJlbnQpXG4gICAgICBsaW5rRm4gPSBkaXJzLmxlbmd0aFxuICAgICAgICA/IG1ha2VEaXJlY3RpdmVzTGlua0ZuKGRpcnMpXG4gICAgICAgIDogbnVsbFxuICAgIH1cbiAgfVxuICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhIHRleHRhcmVhLCB3ZSBuZWVkIHRvIGludGVycG9sYXRlXG4gIC8vIGl0cyBjb250ZW50IG9uIGluaXRpYWwgcmVuZGVyLlxuICBpZiAoZWwudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgIHZhciByZWFsTGlua0ZuID0gbGlua0ZuXG4gICAgbGlua0ZuID0gZnVuY3Rpb24gKHZtLCBlbCkge1xuICAgICAgZWwudmFsdWUgPSB2bS4kaW50ZXJwb2xhdGUoZWwudmFsdWUpXG4gICAgICBpZiAocmVhbExpbmtGbikgcmVhbExpbmtGbih2bSwgZWwpXG4gICAgfVxuICAgIGxpbmtGbi50ZXJtaW5hbCA9IHRydWVcbiAgfVxuICByZXR1cm4gbGlua0ZuXG59XG5cbi8qKlxuICogQnVpbGQgYSBtdWx0aS1kaXJlY3RpdmUgbGluayBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBkaXJlY3RpdmVzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gZGlyZWN0aXZlc0xpbmtGblxuICovXG5cbmZ1bmN0aW9uIG1ha2VEaXJlY3RpdmVzTGlua0ZuIChkaXJlY3RpdmVzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBkaXJlY3RpdmVzTGlua0ZuICh2bSwgZWwpIHtcbiAgICAvLyByZXZlcnNlIGFwcGx5IGJlY2F1c2UgaXQncyBzb3J0ZWQgbG93IHRvIGhpZ2hcbiAgICB2YXIgaSA9IGRpcmVjdGl2ZXMubGVuZ3RoXG4gICAgdmFyIGRpciwgaiwga1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGRpciA9IGRpcmVjdGl2ZXNbaV1cbiAgICAgIGlmIChkaXIuX2xpbmspIHtcbiAgICAgICAgLy8gY3VzdG9tIGxpbmsgZm5cbiAgICAgICAgZGlyLl9saW5rKHZtLCBlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGsgPSBkaXIuZGVzY3JpcHRvcnMubGVuZ3RoXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICB2bS5fYmluZERpcihkaXIubmFtZSwgZWwsXG4gICAgICAgICAgICAgICAgICAgICAgZGlyLmRlc2NyaXB0b3JzW2pdLCBkaXIuZGVmKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIHRleHROb2RlIGFuZCByZXR1cm4gYSBub2RlTGlua0ZuLlxuICpcbiAqIEBwYXJhbSB7VGV4dE5vZGV9IG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbnxudWxsfSB0ZXh0Tm9kZUxpbmtGblxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVUZXh0Tm9kZSAobm9kZSwgb3B0aW9ucykge1xuICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZShub2RlLm5vZGVWYWx1ZSlcbiAgaWYgKCF0b2tlbnMpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gIHZhciBlbCwgdG9rZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICBlbCA9IHRva2VuLnRhZ1xuICAgICAgPyBwcm9jZXNzVGV4dFRva2VuKHRva2VuLCBvcHRpb25zKVxuICAgICAgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b2tlbi52YWx1ZSlcbiAgICBmcmFnLmFwcGVuZENoaWxkKGVsKVxuICB9XG4gIHJldHVybiBtYWtlVGV4dE5vZGVMaW5rRm4odG9rZW5zLCBmcmFnLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIFByb2Nlc3MgYSBzaW5nbGUgdGV4dCB0b2tlbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdG9rZW5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5cbmZ1bmN0aW9uIHByb2Nlc3NUZXh0VG9rZW4gKHRva2VuLCBvcHRpb25zKSB7XG4gIHZhciBlbFxuICBpZiAodG9rZW4ub25lVGltZSkge1xuICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9rZW4udmFsdWUpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHRva2VuLmh0bWwpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1odG1sJylcbiAgICAgIHNldFRva2VuVHlwZSgnaHRtbCcpXG4gICAgfSBlbHNlIGlmICh0b2tlbi5wYXJ0aWFsKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtcGFydGlhbCcpXG4gICAgICBzZXRUb2tlblR5cGUoJ3BhcnRpYWwnKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJRSB3aWxsIGNsZWFuIHVwIGVtcHR5IHRleHROb2RlcyBkdXJpbmdcbiAgICAgIC8vIGZyYWcuY2xvbmVOb2RlKHRydWUpLCBzbyB3ZSBoYXZlIHRvIGdpdmUgaXRcbiAgICAgIC8vIHNvbWV0aGluZyBoZXJlLi4uXG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgJylcbiAgICAgIHNldFRva2VuVHlwZSgndGV4dCcpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHNldFRva2VuVHlwZSAodHlwZSkge1xuICAgIHRva2VuLnR5cGUgPSB0eXBlXG4gICAgdG9rZW4uZGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzW3R5cGVdXG4gICAgdG9rZW4uZGVzY3JpcHRvciA9IGRpclBhcnNlci5wYXJzZSh0b2tlbi52YWx1ZSlbMF1cbiAgfVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBCdWlsZCBhIGZ1bmN0aW9uIHRoYXQgcHJvY2Vzc2VzIGEgdGV4dE5vZGUuXG4gKlxuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSB0b2tlbnNcbiAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gZnJhZ1xuICovXG5cbmZ1bmN0aW9uIG1ha2VUZXh0Tm9kZUxpbmtGbiAodG9rZW5zLCBmcmFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB0ZXh0Tm9kZUxpbmtGbiAodm0sIGVsKSB7XG4gICAgdmFyIGZyYWdDbG9uZSA9IGZyYWcuY2xvbmVOb2RlKHRydWUpXG4gICAgdmFyIGNoaWxkTm9kZXMgPSBfLnRvQXJyYXkoZnJhZ0Nsb25lLmNoaWxkTm9kZXMpXG4gICAgdmFyIHRva2VuLCB2YWx1ZSwgbm9kZVxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICAgIHZhbHVlID0gdG9rZW4udmFsdWVcbiAgICAgIGlmICh0b2tlbi50YWcpIHtcbiAgICAgICAgbm9kZSA9IGNoaWxkTm9kZXNbaV1cbiAgICAgICAgaWYgKHRva2VuLm9uZVRpbWUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZtLiRldmFsKHZhbHVlKVxuICAgICAgICAgIGlmICh0b2tlbi5odG1sKSB7XG4gICAgICAgICAgICBfLnJlcGxhY2Uobm9kZSwgdGVtcGxhdGVQYXJzZXIucGFyc2UodmFsdWUsIHRydWUpKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZtLl9iaW5kRGlyKHRva2VuLnR5cGUsIG5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgdG9rZW4uZGVzY3JpcHRvciwgdG9rZW4uZGVmKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIF8ucmVwbGFjZShlbCwgZnJhZ0Nsb25lKVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIG5vZGUgbGlzdCBhbmQgcmV0dXJuIGEgY2hpbGRMaW5rRm4uXG4gKlxuICogQHBhcmFtIHtOb2RlTGlzdH0gbm9kZUxpc3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZU5vZGVMaXN0IChub2RlTGlzdCwgb3B0aW9ucykge1xuICB2YXIgbGlua0ZucyA9IFtdXG4gIHZhciBub2RlTGlua0ZuLCBjaGlsZExpbmtGbiwgbm9kZVxuICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGVMaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIG5vZGUgPSBub2RlTGlzdFtpXVxuICAgIG5vZGVMaW5rRm4gPSBjb21waWxlTm9kZShub2RlLCBvcHRpb25zKVxuICAgIGNoaWxkTGlua0ZuID1cbiAgICAgICEobm9kZUxpbmtGbiAmJiBub2RlTGlua0ZuLnRlcm1pbmFsKSAmJlxuICAgICAgbm9kZS50YWdOYW1lICE9PSAnU0NSSVBUJyAmJlxuICAgICAgbm9kZS5oYXNDaGlsZE5vZGVzKClcbiAgICAgICAgPyBjb21waWxlTm9kZUxpc3Qobm9kZS5jaGlsZE5vZGVzLCBvcHRpb25zKVxuICAgICAgICA6IG51bGxcbiAgICBsaW5rRm5zLnB1c2gobm9kZUxpbmtGbiwgY2hpbGRMaW5rRm4pXG4gIH1cbiAgcmV0dXJuIGxpbmtGbnMubGVuZ3RoXG4gICAgPyBtYWtlQ2hpbGRMaW5rRm4obGlua0ZucylcbiAgICA6IG51bGxcbn1cblxuLyoqXG4gKiBNYWtlIGEgY2hpbGQgbGluayBmdW5jdGlvbiBmb3IgYSBub2RlJ3MgY2hpbGROb2Rlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PEZ1bmN0aW9uPn0gbGlua0Zuc1xuICogQHJldHVybiB7RnVuY3Rpb259IGNoaWxkTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gbWFrZUNoaWxkTGlua0ZuIChsaW5rRm5zKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjaGlsZExpbmtGbiAodm0sIG5vZGVzKSB7XG4gICAgdmFyIG5vZGUsIG5vZGVMaW5rRm4sIGNoaWxkcmVuTGlua0ZuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSAwLCBsID0gbGlua0Zucy5sZW5ndGg7IGkgPCBsOyBuKyspIHtcbiAgICAgIG5vZGUgPSBub2Rlc1tuXVxuICAgICAgbm9kZUxpbmtGbiA9IGxpbmtGbnNbaSsrXVxuICAgICAgY2hpbGRyZW5MaW5rRm4gPSBsaW5rRm5zW2krK11cbiAgICAgIC8vIGNhY2hlIGNoaWxkTm9kZXMgYmVmb3JlIGxpbmtpbmcgcGFyZW50LCBmaXggIzY1N1xuICAgICAgdmFyIGNoaWxkTm9kZXMgPSBfLnRvQXJyYXkobm9kZS5jaGlsZE5vZGVzKVxuICAgICAgaWYgKG5vZGVMaW5rRm4pIHtcbiAgICAgICAgbm9kZUxpbmtGbih2bSwgbm9kZSlcbiAgICAgIH1cbiAgICAgIGlmIChjaGlsZHJlbkxpbmtGbikge1xuICAgICAgICBjaGlsZHJlbkxpbmtGbih2bSwgY2hpbGROb2RlcylcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIHBhcmFtIGF0dHJpYnV0ZXMgb24gYSByb290IGVsZW1lbnQgYW5kIHJldHVyblxuICogYSBwYXJhbUF0dHJpYnV0ZXMgbGluayBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0FycmF5fSBhdHRyc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBwYXJhbXNMaW5rRm5cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlUGFyYW1BdHRyaWJ1dGVzIChlbCwgYXR0cnMsIG9wdGlvbnMpIHtcbiAgdmFyIHBhcmFtcyA9IFtdXG4gIHZhciBpID0gYXR0cnMubGVuZ3RoXG4gIHZhciBuYW1lLCB2YWx1ZSwgcGFyYW1cbiAgd2hpbGUgKGktLSkge1xuICAgIG5hbWUgPSBhdHRyc1tpXVxuICAgIGlmICgvW0EtWl0vLnRlc3QobmFtZSkpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ1lvdSBzZWVtIHRvIGJlIHVzaW5nIGNhbWVsQ2FzZSBmb3IgYSBwYXJhbUF0dHJpYnV0ZSwgJyArXG4gICAgICAgICdidXQgSFRNTCBkb2VzblxcJ3QgZGlmZmVyZW50aWF0ZSBiZXR3ZWVuIHVwcGVyIGFuZCAnICtcbiAgICAgICAgJ2xvd2VyIGNhc2UuIFlvdSBzaG91bGQgdXNlIGh5cGhlbi1kZWxpbWl0ZWQgJyArXG4gICAgICAgICdhdHRyaWJ1dGUgbmFtZXMuIEZvciBtb3JlIGluZm8gc2VlICcgK1xuICAgICAgICAnaHR0cDovL3Z1ZWpzLm9yZy9hcGkvb3B0aW9ucy5odG1sI3BhcmFtQXR0cmlidXRlcydcbiAgICAgIClcbiAgICB9XG4gICAgdmFsdWUgPSBlbC5nZXRBdHRyaWJ1dGUobmFtZSlcbiAgICBpZiAodmFsdWUgIT09IG51bGwpIHtcbiAgICAgIHBhcmFtID0ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH1cbiAgICAgIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKHZhbHVlKVxuICAgICAgaWYgKHRva2Vucykge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgICAgICAgaWYgKHRva2Vucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgXy53YXJuKFxuICAgICAgICAgICAgJ0ludmFsaWQgcGFyYW0gYXR0cmlidXRlIGJpbmRpbmc6IFwiJyArXG4gICAgICAgICAgICBuYW1lICsgJz1cIicgKyB2YWx1ZSArICdcIicgK1xuICAgICAgICAgICAgJ1xcbkRvblxcJ3QgbWl4IGJpbmRpbmcgdGFncyB3aXRoIHBsYWluIHRleHQgJyArXG4gICAgICAgICAgICAnaW4gcGFyYW0gYXR0cmlidXRlIGJpbmRpbmdzLidcbiAgICAgICAgICApXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJhbS5keW5hbWljID0gdHJ1ZVxuICAgICAgICAgIHBhcmFtLnZhbHVlID0gdG9rZW5zWzBdLnZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBhcmFtcy5wdXNoKHBhcmFtKVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWFrZVBhcmFtc0xpbmtGbihwYXJhbXMsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogQnVpbGQgYSBmdW5jdGlvbiB0aGF0IGFwcGxpZXMgcGFyYW0gYXR0cmlidXRlcyB0byBhIHZtLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBhcmFtc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBwYXJhbXNMaW5rRm5cbiAqL1xuXG52YXIgZGF0YUF0dHJSRSA9IC9eZGF0YS0vXG5cbmZ1bmN0aW9uIG1ha2VQYXJhbXNMaW5rRm4gKHBhcmFtcywgb3B0aW9ucykge1xuICB2YXIgZGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzWyd3aXRoJ11cbiAgcmV0dXJuIGZ1bmN0aW9uIHBhcmFtc0xpbmtGbiAodm0sIGVsKSB7XG4gICAgdmFyIGkgPSBwYXJhbXMubGVuZ3RoXG4gICAgdmFyIHBhcmFtLCBwYXRoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgcGFyYW0gPSBwYXJhbXNbaV1cbiAgICAgIC8vIHBhcmFtcyBjb3VsZCBjb250YWluIGRhc2hlcywgd2hpY2ggd2lsbCBiZVxuICAgICAgLy8gaW50ZXJwcmV0ZWQgYXMgbWludXMgY2FsY3VsYXRpb25zIGJ5IHRoZSBwYXJzZXJcbiAgICAgIC8vIHNvIHdlIG5lZWQgdG8gd3JhcCB0aGUgcGF0aCBoZXJlXG4gICAgICBwYXRoID0gXy5jYW1lbGl6ZShwYXJhbS5uYW1lLnJlcGxhY2UoZGF0YUF0dHJSRSwgJycpKVxuICAgICAgaWYgKHBhcmFtLmR5bmFtaWMpIHtcbiAgICAgICAgLy8gZHluYW1pYyBwYXJhbSBhdHRyaWJ0dWVzIGFyZSBib3VuZCBhcyB2LXdpdGguXG4gICAgICAgIC8vIHdlIGNhbiBkaXJlY3RseSBkdWNrIHRoZSBkZXNjcmlwdG9yIGhlcmUgYmVhY3VzZVxuICAgICAgICAvLyBwYXJhbSBhdHRyaWJ1dGVzIGNhbm5vdCB1c2UgZXhwcmVzc2lvbnMgb3JcbiAgICAgICAgLy8gZmlsdGVycy5cbiAgICAgICAgdm0uX2JpbmREaXIoJ3dpdGgnLCBlbCwge1xuICAgICAgICAgIGFyZzogcGF0aCxcbiAgICAgICAgICBleHByZXNzaW9uOiBwYXJhbS52YWx1ZVxuICAgICAgICB9LCBkZWYpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBqdXN0IHNldCBvbmNlXG4gICAgICAgIHZtLiRzZXQocGF0aCwgcGFyYW0udmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgYW4gZWxlbWVudCBmb3IgdGVybWluYWwgZGlyZWN0aXZlcyBpbiBmaXhlZCBvcmRlci5cbiAqIElmIGl0IGZpbmRzIG9uZSwgcmV0dXJuIGEgdGVybWluYWwgbGluayBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259IHRlcm1pbmFsTGlua0ZuXG4gKi9cblxudmFyIHRlcm1pbmFsRGlyZWN0aXZlcyA9IFtcbiAgJ3JlcGVhdCcsXG4gICdpZicsXG4gICdjb21wb25lbnQnXG5dXG5cbmZ1bmN0aW9uIHNraXAgKCkge31cbnNraXAudGVybWluYWwgPSB0cnVlXG5cbmZ1bmN0aW9uIGNoZWNrVGVybWluYWxEaXJlY3RpdmVzIChlbCwgb3B0aW9ucykge1xuICBpZiAoXy5hdHRyKGVsLCAncHJlJykgIT09IG51bGwpIHtcbiAgICByZXR1cm4gc2tpcFxuICB9XG4gIHZhciB2YWx1ZSwgZGlyTmFtZVxuICAvKiBqc2hpbnQgYm9zczogdHJ1ZSAqL1xuICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgIGRpck5hbWUgPSB0ZXJtaW5hbERpcmVjdGl2ZXNbaV1cbiAgICBpZiAodmFsdWUgPSBfLmF0dHIoZWwsIGRpck5hbWUpKSB7XG4gICAgICByZXR1cm4gbWFrZVRlcmltaW5hbExpbmtGbihlbCwgZGlyTmFtZSwgdmFsdWUsIG9wdGlvbnMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQnVpbGQgYSBsaW5rIGZ1bmN0aW9uIGZvciBhIHRlcm1pbmFsIGRpcmVjdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gZGlyTmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259IHRlcm1pbmFsTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gbWFrZVRlcmltaW5hbExpbmtGbiAoZWwsIGRpck5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZGlyUGFyc2VyLnBhcnNlKHZhbHVlKVswXVxuICB2YXIgZGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzW2Rpck5hbWVdXG4gIHZhciB0ZXJtaW5hbExpbmtGbiA9IGZ1bmN0aW9uICh2bSwgZWwpIHtcbiAgICB2bS5fYmluZERpcihkaXJOYW1lLCBlbCwgZGVzY3JpcHRvciwgZGVmKVxuICB9XG4gIHRlcm1pbmFsTGlua0ZuLnRlcm1pbmFsID0gdHJ1ZVxuICByZXR1cm4gdGVybWluYWxMaW5rRm5cbn1cblxuLyoqXG4gKiBDb2xsZWN0IHRoZSBkaXJlY3RpdmVzIG9uIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYXNQYXJlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIGNvbGxlY3REaXJlY3RpdmVzIChlbCwgb3B0aW9ucywgYXNQYXJlbnQpIHtcbiAgdmFyIGF0dHJzID0gXy50b0FycmF5KGVsLmF0dHJpYnV0ZXMpXG4gIHZhciBpID0gYXR0cnMubGVuZ3RoXG4gIHZhciBkaXJzID0gW11cbiAgdmFyIGF0dHIsIGF0dHJOYW1lLCBkaXIsIGRpck5hbWUsIGRpckRlZlxuICB3aGlsZSAoaS0tKSB7XG4gICAgYXR0ciA9IGF0dHJzW2ldXG4gICAgYXR0ck5hbWUgPSBhdHRyLm5hbWVcbiAgICBpZiAoYXR0ck5hbWUuaW5kZXhPZihjb25maWcucHJlZml4KSA9PT0gMCkge1xuICAgICAgZGlyTmFtZSA9IGF0dHJOYW1lLnNsaWNlKGNvbmZpZy5wcmVmaXgubGVuZ3RoKVxuICAgICAgaWYgKGFzUGFyZW50ICYmXG4gICAgICAgICAgKGRpck5hbWUgPT09ICd3aXRoJyB8fFxuICAgICAgICAgICBkaXJOYW1lID09PSAnY29tcG9uZW50JykpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGRpckRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1tkaXJOYW1lXVxuICAgICAgXy5hc3NlcnRBc3NldChkaXJEZWYsICdkaXJlY3RpdmUnLCBkaXJOYW1lKVxuICAgICAgaWYgKGRpckRlZikge1xuICAgICAgICBkaXJzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGRpck5hbWUsXG4gICAgICAgICAgZGVzY3JpcHRvcnM6IGRpclBhcnNlci5wYXJzZShhdHRyLnZhbHVlKSxcbiAgICAgICAgICBkZWY6IGRpckRlZlxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY29uZmlnLmludGVycG9sYXRlKSB7XG4gICAgICBkaXIgPSBjb2xsZWN0QXR0ckRpcmVjdGl2ZShlbCwgYXR0ck5hbWUsIGF0dHIudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zKVxuICAgICAgaWYgKGRpcikge1xuICAgICAgICBkaXJzLnB1c2goZGlyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBzb3J0IGJ5IHByaW9yaXR5LCBMT1cgdG8gSElHSFxuICBkaXJzLnNvcnQoZGlyZWN0aXZlQ29tcGFyYXRvcilcbiAgcmV0dXJuIGRpcnNcbn1cblxuLyoqXG4gKiBDaGVjayBhbiBhdHRyaWJ1dGUgZm9yIHBvdGVudGlhbCBkeW5hbWljIGJpbmRpbmdzLFxuICogYW5kIHJldHVybiBhIGRpcmVjdGl2ZSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBjb2xsZWN0QXR0ckRpcmVjdGl2ZSAoZWwsIG5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLl9za2lwQXR0cnMgJiZcbiAgICAgIG9wdGlvbnMuX3NraXBBdHRycy5pbmRleE9mKG5hbWUpID4gLTEpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZSh2YWx1ZSlcbiAgaWYgKHRva2Vucykge1xuICAgIHZhciBkZWYgPSBvcHRpb25zLmRpcmVjdGl2ZXMuYXR0clxuICAgIHZhciBpID0gdG9rZW5zLmxlbmd0aFxuICAgIHZhciBhbGxPbmVUaW1lID0gdHJ1ZVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXVxuICAgICAgaWYgKHRva2VuLnRhZyAmJiAhdG9rZW4ub25lVGltZSkge1xuICAgICAgICBhbGxPbmVUaW1lID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlZjogZGVmLFxuICAgICAgX2xpbms6IGFsbE9uZVRpbWVcbiAgICAgICAgPyBmdW5jdGlvbiAodm0sIGVsKSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUobmFtZSwgdm0uJGludGVycG9sYXRlKHZhbHVlKSlcbiAgICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKHZtLCBlbCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGV4dFBhcnNlci50b2tlbnNUb0V4cCh0b2tlbnMsIHZtKVxuICAgICAgICAgICAgdmFyIGRlc2MgPSBkaXJQYXJzZXIucGFyc2UobmFtZSArICc6JyArIHZhbHVlKVswXVxuICAgICAgICAgICAgdm0uX2JpbmREaXIoJ2F0dHInLCBlbCwgZGVzYywgZGVmKVxuICAgICAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgcHJpb3JpdHkgc29ydCBjb21wYXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKi9cblxuZnVuY3Rpb24gZGlyZWN0aXZlQ29tcGFyYXRvciAoYSwgYikge1xuICBhID0gYS5kZWYucHJpb3JpdHkgfHwgMFxuICBiID0gYi5kZWYucHJpb3JpdHkgfHwgMFxuICByZXR1cm4gYSA+IGIgPyAxIDogLTFcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG5cbi8qKlxuICogUHJvY2VzcyBhbiBlbGVtZW50IG9yIGEgRG9jdW1lbnRGcmFnbWVudCBiYXNlZCBvbiBhXG4gKiBpbnN0YW5jZSBvcHRpb24gb2JqZWN0LiBUaGlzIGFsbG93cyB1cyB0byB0cmFuc2NsdWRlXG4gKiBhIHRlbXBsYXRlIG5vZGUvZnJhZ21lbnQgYmVmb3JlIHRoZSBpbnN0YW5jZSBpcyBjcmVhdGVkLFxuICogc28gdGhlIHByb2Nlc3NlZCBmcmFnbWVudCBjYW4gdGhlbiBiZSBjbG9uZWQgYW5kIHJldXNlZFxuICogaW4gdi1yZXBlYXQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH1cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRyYW5zY2x1ZGUgKGVsLCBvcHRpb25zKSB7XG4gIC8vIGZvciB0ZW1wbGF0ZSB0YWdzLCB3aGF0IHdlIHdhbnQgaXMgaXRzIGNvbnRlbnQgYXNcbiAgLy8gYSBkb2N1bWVudEZyYWdtZW50IChmb3IgYmxvY2sgaW5zdGFuY2VzKVxuICBpZiAoZWwudGFnTmFtZSA9PT0gJ1RFTVBMQVRFJykge1xuICAgIGVsID0gdGVtcGxhdGVQYXJzZXIucGFyc2UoZWwpXG4gIH1cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy50ZW1wbGF0ZSkge1xuICAgIGVsID0gdHJhbnNjbHVkZVRlbXBsYXRlKGVsLCBvcHRpb25zKVxuICB9XG4gIGlmIChlbCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICBfLnByZXBlbmQoZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1zdGFydCcpLCBlbClcbiAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LWVuZCcpKVxuICB9XG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIFByb2Nlc3MgdGhlIHRlbXBsYXRlIG9wdGlvbi5cbiAqIElmIHRoZSByZXBsYWNlIG9wdGlvbiBpcyB0cnVlIHRoaXMgd2lsbCBzd2FwIHRoZSAkZWwuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH1cbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2NsdWRlVGVtcGxhdGUgKGVsLCBvcHRpb25zKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IG9wdGlvbnMudGVtcGxhdGVcbiAgdmFyIGZyYWcgPSB0ZW1wbGF0ZVBhcnNlci5wYXJzZSh0ZW1wbGF0ZSwgdHJ1ZSlcbiAgaWYgKCFmcmFnKSB7XG4gICAgXy53YXJuKCdJbnZhbGlkIHRlbXBsYXRlIG9wdGlvbjogJyArIHRlbXBsYXRlKVxuICB9IGVsc2Uge1xuICAgIHZhciByYXdDb250ZW50ID0gb3B0aW9ucy5fY29udGVudCB8fCBfLmV4dHJhY3RDb250ZW50KGVsKVxuICAgIGlmIChvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgIGlmIChmcmFnLmNoaWxkTm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgICB0cmFuc2NsdWRlQ29udGVudChmcmFnLCByYXdDb250ZW50KVxuICAgICAgICBfLmNvcHlBdHRyaWJ1dGVzKGVsLCBmcmFnLmZpcnN0Q2hpbGQpXG4gICAgICAgIHJldHVybiBmcmFnXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVwbGFjZXIgPSBmcmFnLmZpcnN0Q2hpbGRcbiAgICAgICAgXy5jb3B5QXR0cmlidXRlcyhlbCwgcmVwbGFjZXIpXG4gICAgICAgIHRyYW5zY2x1ZGVDb250ZW50KHJlcGxhY2VyLCByYXdDb250ZW50KVxuICAgICAgICByZXR1cm4gcmVwbGFjZXJcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWwuYXBwZW5kQ2hpbGQoZnJhZylcbiAgICAgIHRyYW5zY2x1ZGVDb250ZW50KGVsLCByYXdDb250ZW50KVxuICAgICAgcmV0dXJuIGVsXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVzb2x2ZSA8Y29udGVudD4gaW5zZXJ0aW9uIHBvaW50cyBtaW1pY2tpbmcgdGhlIGJlaGF2aW9yXG4gKiBvZiB0aGUgU2hhZG93IERPTSBzcGVjOlxuICpcbiAqICAgaHR0cDovL3czYy5naXRodWIuaW8vd2ViY29tcG9uZW50cy9zcGVjL3NoYWRvdy8jaW5zZXJ0aW9uLXBvaW50c1xuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSByYXdcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2NsdWRlQ29udGVudCAoZWwsIHJhdykge1xuICB2YXIgb3V0bGV0cyA9IGdldE91dGxldHMoZWwpXG4gIHZhciBpID0gb3V0bGV0cy5sZW5ndGhcbiAgaWYgKCFpKSByZXR1cm5cbiAgdmFyIG91dGxldCwgc2VsZWN0LCBzZWxlY3RlZCwgaiwgbWFpblxuXG4gIGZ1bmN0aW9uIGlzRGlyZWN0Q2hpbGQgKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5wYXJlbnROb2RlID09PSByYXdcbiAgfVxuXG4gIC8vIGZpcnN0IHBhc3MsIGNvbGxlY3QgY29ycmVzcG9uZGluZyBjb250ZW50XG4gIC8vIGZvciBlYWNoIG91dGxldC5cbiAgd2hpbGUgKGktLSkge1xuICAgIG91dGxldCA9IG91dGxldHNbaV1cbiAgICBpZiAocmF3KSB7XG4gICAgICBzZWxlY3QgPSBvdXRsZXQuZ2V0QXR0cmlidXRlKCdzZWxlY3QnKVxuICAgICAgaWYgKHNlbGVjdCkgeyAgLy8gc2VsZWN0IGNvbnRlbnRcbiAgICAgICAgc2VsZWN0ZWQgPSByYXcucXVlcnlTZWxlY3RvckFsbChzZWxlY3QpXG4gICAgICAgIGlmIChzZWxlY3RlZC5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBhY2NvcmRpbmcgdG8gU2hhZG93IERPTSBzcGVjLCBgc2VsZWN0YCBjYW5cbiAgICAgICAgICAvLyBvbmx5IHNlbGVjdCBkaXJlY3QgY2hpbGRyZW4gb2YgdGhlIGhvc3Qgbm9kZS5cbiAgICAgICAgICAvLyBlbmZvcmNpbmcgdGhpcyBhbHNvIGZpeGVzICM3ODYuXG4gICAgICAgICAgc2VsZWN0ZWQgPSBbXS5maWx0ZXIuY2FsbChzZWxlY3RlZCwgaXNEaXJlY3RDaGlsZClcbiAgICAgICAgfVxuICAgICAgICBvdXRsZXQuY29udGVudCA9IHNlbGVjdGVkLmxlbmd0aFxuICAgICAgICAgID8gc2VsZWN0ZWRcbiAgICAgICAgICA6IF8udG9BcnJheShvdXRsZXQuY2hpbGROb2RlcylcbiAgICAgIH0gZWxzZSB7IC8vIGRlZmF1bHQgY29udGVudFxuICAgICAgICBtYWluID0gb3V0bGV0XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gZmFsbGJhY2sgY29udGVudFxuICAgICAgb3V0bGV0LmNvbnRlbnQgPSBfLnRvQXJyYXkob3V0bGV0LmNoaWxkTm9kZXMpXG4gICAgfVxuICB9XG4gIC8vIHNlY29uZCBwYXNzLCBhY3R1YWxseSBpbnNlcnQgdGhlIGNvbnRlbnRzXG4gIGZvciAoaSA9IDAsIGogPSBvdXRsZXRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgIG91dGxldCA9IG91dGxldHNbaV1cbiAgICBpZiAob3V0bGV0ICE9PSBtYWluKSB7XG4gICAgICBpbnNlcnRDb250ZW50QXQob3V0bGV0LCBvdXRsZXQuY29udGVudClcbiAgICB9XG4gIH1cbiAgLy8gZmluYWxseSBpbnNlcnQgdGhlIG1haW4gY29udGVudFxuICBpZiAobWFpbikge1xuICAgIGluc2VydENvbnRlbnRBdChtYWluLCBfLnRvQXJyYXkocmF3LmNoaWxkTm9kZXMpKVxuICB9XG59XG5cbi8qKlxuICogR2V0IDxjb250ZW50PiBvdXRsZXRzIGZyb20gdGhlIGVsZW1lbnQvbGlzdFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxBcnJheX0gZWxcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbnZhciBjb25jYXQgPSBbXS5jb25jYXRcbmZ1bmN0aW9uIGdldE91dGxldHMgKGVsKSB7XG4gIHJldHVybiBfLmlzQXJyYXkoZWwpXG4gICAgPyBjb25jYXQuYXBwbHkoW10sIGVsLm1hcChnZXRPdXRsZXRzKSlcbiAgICA6IGVsLnF1ZXJ5U2VsZWN0b3JBbGxcbiAgICAgID8gXy50b0FycmF5KGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2NvbnRlbnQnKSlcbiAgICAgIDogW11cbn1cblxuLyoqXG4gKiBJbnNlcnQgYW4gYXJyYXkgb2Ygbm9kZXMgYXQgb3V0bGV0LFxuICogdGhlbiByZW1vdmUgdGhlIG91dGxldC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IG91dGxldFxuICogQHBhcmFtIHtBcnJheX0gY29udGVudHNcbiAqL1xuXG5mdW5jdGlvbiBpbnNlcnRDb250ZW50QXQgKG91dGxldCwgY29udGVudHMpIHtcbiAgLy8gbm90IHVzaW5nIHV0aWwgRE9NIG1ldGhvZHMgaGVyZSBiZWNhdXNlXG4gIC8vIHBhcmVudE5vZGUgY2FuIGJlIGNhY2hlZFxuICB2YXIgcGFyZW50ID0gb3V0bGV0LnBhcmVudE5vZGVcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBjb250ZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNvbnRlbnRzW2ldLCBvdXRsZXQpXG4gIH1cbiAgcGFyZW50LnJlbW92ZUNoaWxkKG91dGxldClcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgICogVGhlIHByZWZpeCB0byBsb29rIGZvciB3aGVuIHBhcnNpbmcgZGlyZWN0aXZlcy5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG5cbiAgcHJlZml4OiAndi0nLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHByaW50IGRlYnVnIG1lc3NhZ2VzLlxuICAgKiBBbHNvIGVuYWJsZXMgc3RhY2sgdHJhY2UgZm9yIHdhcm5pbmdzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgZGVidWc6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHN1cHByZXNzIHdhcm5pbmdzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc2lsZW50OiBmYWxzZSxcblxuICAvKipcbiAgICogV2hldGhlciBhbGxvdyBvYnNlcnZlciB0byBhbHRlciBkYXRhIG9iamVjdHMnXG4gICAqIF9fcHJvdG9fXy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIHByb3RvOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHBhcnNlIG11c3RhY2hlIHRhZ3MgaW4gdGVtcGxhdGVzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgaW50ZXJwb2xhdGU6IHRydWUsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gdXNlIGFzeW5jIHJlbmRlcmluZy5cbiAgICovXG5cbiAgYXN5bmM6IHRydWUsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gd2FybiBhZ2FpbnN0IGVycm9ycyBjYXVnaHQgd2hlbiBldmFsdWF0aW5nXG4gICAqIGV4cHJlc3Npb25zLlxuICAgKi9cblxuICB3YXJuRXhwcmVzc2lvbkVycm9yczogdHJ1ZSxcblxuICAvKipcbiAgICogSW50ZXJuYWwgZmxhZyB0byBpbmRpY2F0ZSB0aGUgZGVsaW1pdGVycyBoYXZlIGJlZW5cbiAgICogY2hhbmdlZC5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIF9kZWxpbWl0ZXJzQ2hhbmdlZDogdHJ1ZVxuXG59XG5cbi8qKlxuICogSW50ZXJwb2xhdGlvbiBkZWxpbWl0ZXJzLlxuICogV2UgbmVlZCB0byBtYXJrIHRoZSBjaGFuZ2VkIGZsYWcgc28gdGhhdCB0aGUgdGV4dCBwYXJzZXJcbiAqIGtub3dzIGl0IG5lZWRzIHRvIHJlY29tcGlsZSB0aGUgcmVnZXguXG4gKlxuICogQHR5cGUge0FycmF5PFN0cmluZz59XG4gKi9cblxudmFyIGRlbGltaXRlcnMgPSBbJ3t7JywgJ319J11cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUuZXhwb3J0cywgJ2RlbGltaXRlcnMnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBkZWxpbWl0ZXJzXG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgIGRlbGltaXRlcnMgPSB2YWxcbiAgICB0aGlzLl9kZWxpbWl0ZXJzQ2hhbmdlZCA9IHRydWVcbiAgfVxufSkiLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxudmFyIFdhdGNoZXIgPSByZXF1aXJlKCcuL3dhdGNoZXInKVxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcnMvdGV4dCcpXG52YXIgZXhwUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIGxpbmtzIGEgRE9NIGVsZW1lbnQgd2l0aCBhIHBpZWNlIG9mIGRhdGEsXG4gKiB3aGljaCBpcyB0aGUgcmVzdWx0IG9mIGV2YWx1YXRpbmcgYW4gZXhwcmVzc2lvbi5cbiAqIEl0IHJlZ2lzdGVycyBhIHdhdGNoZXIgd2l0aCB0aGUgZXhwcmVzc2lvbiBhbmQgY2FsbHNcbiAqIHRoZSBET00gdXBkYXRlIGZ1bmN0aW9uIHdoZW4gYSBjaGFuZ2UgaXMgdHJpZ2dlcmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge05vZGV9IGVsXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yXG4gKiAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfSBleHByZXNzaW9uXG4gKiAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfSBbYXJnXVxuICogICAgICAgICAgICAgICAgIC0ge0FycmF5PE9iamVjdD59IFtmaWx0ZXJzXVxuICogQHBhcmFtIHtPYmplY3R9IGRlZiAtIGRpcmVjdGl2ZSBkZWZpbml0aW9uIG9iamVjdFxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gRGlyZWN0aXZlIChuYW1lLCBlbCwgdm0sIGRlc2NyaXB0b3IsIGRlZikge1xuICAvLyBwdWJsaWNcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmVsID0gZWxcbiAgdGhpcy52bSA9IHZtXG4gIC8vIGNvcHkgZGVzY3JpcHRvciBwcm9wc1xuICB0aGlzLnJhdyA9IGRlc2NyaXB0b3IucmF3XG4gIHRoaXMuZXhwcmVzc2lvbiA9IGRlc2NyaXB0b3IuZXhwcmVzc2lvblxuICB0aGlzLmFyZyA9IGRlc2NyaXB0b3IuYXJnXG4gIHRoaXMuZmlsdGVycyA9IF8ucmVzb2x2ZUZpbHRlcnModm0sIGRlc2NyaXB0b3IuZmlsdGVycylcbiAgLy8gcHJpdmF0ZVxuICB0aGlzLl9sb2NrZWQgPSBmYWxzZVxuICB0aGlzLl9ib3VuZCA9IGZhbHNlXG4gIC8vIGluaXRcbiAgdGhpcy5fYmluZChkZWYpXG59XG5cbnZhciBwID0gRGlyZWN0aXZlLnByb3RvdHlwZVxuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIGRpcmVjdGl2ZSwgbWl4aW4gZGVmaW5pdGlvbiBwcm9wZXJ0aWVzLFxuICogc2V0dXAgdGhlIHdhdGNoZXIsIGNhbGwgZGVmaW5pdGlvbiBiaW5kKCkgYW5kIHVwZGF0ZSgpXG4gKiBpZiBwcmVzZW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZcbiAqL1xuXG5wLl9iaW5kID0gZnVuY3Rpb24gKGRlZikge1xuICBpZiAodGhpcy5uYW1lICE9PSAnY2xvYWsnICYmIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKSB7XG4gICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoY29uZmlnLnByZWZpeCArIHRoaXMubmFtZSlcbiAgfVxuICBpZiAodHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMudXBkYXRlID0gZGVmXG4gIH0gZWxzZSB7XG4gICAgXy5leHRlbmQodGhpcywgZGVmKVxuICB9XG4gIHRoaXMuX3dhdGNoZXJFeHAgPSB0aGlzLmV4cHJlc3Npb25cbiAgdGhpcy5fY2hlY2tEeW5hbWljTGl0ZXJhbCgpXG4gIGlmICh0aGlzLmJpbmQpIHtcbiAgICB0aGlzLmJpbmQoKVxuICB9XG4gIGlmICh0aGlzLl93YXRjaGVyRXhwICYmXG4gICAgICAodGhpcy51cGRhdGUgfHwgdGhpcy50d29XYXkpICYmXG4gICAgICAoIXRoaXMuaXNMaXRlcmFsIHx8IHRoaXMuX2lzRHluYW1pY0xpdGVyYWwpICYmXG4gICAgICAhdGhpcy5fY2hlY2tTdGF0ZW1lbnQoKSkge1xuICAgIC8vIHdyYXBwZWQgdXBkYXRlciBmb3IgY29udGV4dFxuICAgIHZhciBkaXIgPSB0aGlzXG4gICAgdmFyIHVwZGF0ZSA9IHRoaXMuX3VwZGF0ZSA9IHRoaXMudXBkYXRlXG4gICAgICA/IGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xuICAgICAgICAgIGlmICghZGlyLl9sb2NrZWQpIHtcbiAgICAgICAgICAgIGRpci51cGRhdGUodmFsLCBvbGRWYWwpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uICgpIHt9IC8vIG5vb3AgaWYgbm8gdXBkYXRlIGlzIHByb3ZpZGVkXG4gICAgLy8gdXNlIHJhdyBleHByZXNzaW9uIGFzIGlkZW50aWZpZXIgYmVjYXVzZSBmaWx0ZXJzXG4gICAgLy8gbWFrZSB0aGVtIGRpZmZlcmVudCB3YXRjaGVyc1xuICAgIHZhciB3YXRjaGVyID0gdGhpcy52bS5fd2F0Y2hlcnNbdGhpcy5yYXddXG4gICAgLy8gdi1yZXBlYXQgYWx3YXlzIGNyZWF0ZXMgYSBuZXcgd2F0Y2hlciBiZWNhdXNlIGl0IGhhc1xuICAgIC8vIGEgc3BlY2lhbCBmaWx0ZXIgdGhhdCdzIGJvdW5kIHRvIGl0cyBkaXJlY3RpdmVcbiAgICAvLyBpbnN0YW5jZS5cbiAgICBpZiAoIXdhdGNoZXIgfHwgdGhpcy5uYW1lID09PSAncmVwZWF0Jykge1xuICAgICAgd2F0Y2hlciA9IHRoaXMudm0uX3dhdGNoZXJzW3RoaXMucmF3XSA9IG5ldyBXYXRjaGVyKFxuICAgICAgICB0aGlzLnZtLFxuICAgICAgICB0aGlzLl93YXRjaGVyRXhwLFxuICAgICAgICB1cGRhdGUsIC8vIGNhbGxiYWNrXG4gICAgICAgIHtcbiAgICAgICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgdHdvV2F5OiB0aGlzLnR3b1dheSxcbiAgICAgICAgICBkZWVwOiB0aGlzLmRlZXBcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB3YXRjaGVyLmFkZENiKHVwZGF0ZSlcbiAgICB9XG4gICAgdGhpcy5fd2F0Y2hlciA9IHdhdGNoZXJcbiAgICBpZiAodGhpcy5faW5pdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHdhdGNoZXIuc2V0KHRoaXMuX2luaXRWYWx1ZSlcbiAgICB9IGVsc2UgaWYgKHRoaXMudXBkYXRlKSB7XG4gICAgICB0aGlzLnVwZGF0ZSh3YXRjaGVyLnZhbHVlKVxuICAgIH1cbiAgfVxuICB0aGlzLl9ib3VuZCA9IHRydWVcbn1cblxuLyoqXG4gKiBjaGVjayBpZiB0aGlzIGlzIGEgZHluYW1pYyBsaXRlcmFsIGJpbmRpbmcuXG4gKlxuICogZS5nLiB2LWNvbXBvbmVudD1cInt7Y3VycmVudFZpZXd9fVwiXG4gKi9cblxucC5fY2hlY2tEeW5hbWljTGl0ZXJhbCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV4cHJlc3Npb24gPSB0aGlzLmV4cHJlc3Npb25cbiAgaWYgKGV4cHJlc3Npb24gJiYgdGhpcy5pc0xpdGVyYWwpIHtcbiAgICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZShleHByZXNzaW9uKVxuICAgIGlmICh0b2tlbnMpIHtcbiAgICAgIHZhciBleHAgPSB0ZXh0UGFyc2VyLnRva2Vuc1RvRXhwKHRva2VucylcbiAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IHRoaXMudm0uJGdldChleHApXG4gICAgICB0aGlzLl93YXRjaGVyRXhwID0gZXhwXG4gICAgICB0aGlzLl9pc0R5bmFtaWNMaXRlcmFsID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkaXJlY3RpdmUgaXMgYSBmdW5jdGlvbiBjYWxsZXJcbiAqIGFuZCBpZiB0aGUgZXhwcmVzc2lvbiBpcyBhIGNhbGxhYmxlIG9uZS4gSWYgYm90aCB0cnVlLFxuICogd2Ugd3JhcCB1cCB0aGUgZXhwcmVzc2lvbiBhbmQgdXNlIGl0IGFzIHRoZSBldmVudFxuICogaGFuZGxlci5cbiAqXG4gKiBlLmcuIHYtb249XCJjbGljazogYSsrXCJcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnAuX2NoZWNrU3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcmVzc2lvblxuICBpZiAoXG4gICAgZXhwcmVzc2lvbiAmJiB0aGlzLmFjY2VwdFN0YXRlbWVudCAmJlxuICAgICFleHBQYXJzZXIucGF0aFRlc3RSRS50ZXN0KGV4cHJlc3Npb24pXG4gICkge1xuICAgIHZhciBmbiA9IGV4cFBhcnNlci5wYXJzZShleHByZXNzaW9uKS5nZXRcbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5jYWxsKHZtLCB2bSlcbiAgICB9XG4gICAgaWYgKHRoaXMuZmlsdGVycykge1xuICAgICAgaGFuZGxlciA9IF8uYXBwbHlGaWx0ZXJzKFxuICAgICAgICBoYW5kbGVyLFxuICAgICAgICB0aGlzLmZpbHRlcnMucmVhZCxcbiAgICAgICAgdm1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy51cGRhdGUoaGFuZGxlcilcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgZm9yIGFuIGF0dHJpYnV0ZSBkaXJlY3RpdmUgcGFyYW0sIGUuZy4gbGF6eVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxucC5fY2hlY2tQYXJhbSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBwYXJhbSA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKG5hbWUpXG4gIGlmIChwYXJhbSAhPT0gbnVsbCkge1xuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gIH1cbiAgcmV0dXJuIHBhcmFtXG59XG5cbi8qKlxuICogVGVhcmRvd24gdGhlIHdhdGNoZXIgYW5kIGNhbGwgdW5iaW5kLlxuICovXG5cbnAuX3RlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fYm91bmQpIHtcbiAgICBpZiAodGhpcy51bmJpbmQpIHtcbiAgICAgIHRoaXMudW5iaW5kKClcbiAgICB9XG4gICAgdmFyIHdhdGNoZXIgPSB0aGlzLl93YXRjaGVyXG4gICAgaWYgKHdhdGNoZXIgJiYgd2F0Y2hlci5hY3RpdmUpIHtcbiAgICAgIHdhdGNoZXIucmVtb3ZlQ2IodGhpcy5fdXBkYXRlKVxuICAgICAgaWYgKCF3YXRjaGVyLmFjdGl2ZSkge1xuICAgICAgICB0aGlzLnZtLl93YXRjaGVyc1t0aGlzLnJhd10gPSBudWxsXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2JvdW5kID0gZmFsc2VcbiAgICB0aGlzLnZtID0gdGhpcy5lbCA9IHRoaXMuX3dhdGNoZXIgPSBudWxsXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgd2l0aCB0aGUgc2V0dGVyLlxuICogVGhpcyBzaG91bGQgb25seSBiZSB1c2VkIGluIHR3by13YXkgZGlyZWN0aXZlc1xuICogZS5nLiB2LW1vZGVsLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbG9jayAtIHByZXZlbnQgd3J0aWUgdHJpZ2dlcmluZyB1cGRhdGUuXG4gKiBAcHVibGljXG4gKi9cblxucC5zZXQgPSBmdW5jdGlvbiAodmFsdWUsIGxvY2spIHtcbiAgaWYgKHRoaXMudHdvV2F5KSB7XG4gICAgaWYgKGxvY2spIHtcbiAgICAgIHRoaXMuX2xvY2tlZCA9IHRydWVcbiAgICB9XG4gICAgdGhpcy5fd2F0Y2hlci5zZXQodmFsdWUpXG4gICAgaWYgKGxvY2spIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgXy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYuX2xvY2tlZCA9IGZhbHNlXG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZSIsIi8vIHhsaW5rXG52YXIgeGxpbmtOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJ1xudmFyIHhsaW5rUkUgPSAvXnhsaW5rOi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgcHJpb3JpdHk6IDg1MCxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5hbWUgPSB0aGlzLmFyZ1xuICAgIHRoaXMudXBkYXRlID0geGxpbmtSRS50ZXN0KG5hbWUpXG4gICAgICA/IHhsaW5rSGFuZGxlclxuICAgICAgOiBkZWZhdWx0SGFuZGxlclxuICB9XG5cbn1cblxuZnVuY3Rpb24gZGVmYXVsdEhhbmRsZXIgKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMCkge1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKHRoaXMuYXJnLCB2YWx1ZSlcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmFyZylcbiAgfVxufVxuXG5mdW5jdGlvbiB4bGlua0hhbmRsZXIgKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCB0aGlzLmFyZywgdmFsdWUpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua05TLCAnaHJlZicpXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGFkZENsYXNzID0gXy5hZGRDbGFzc1xudmFyIHJlbW92ZUNsYXNzID0gXy5yZW1vdmVDbGFzc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAodGhpcy5hcmcpIHtcbiAgICB2YXIgbWV0aG9kID0gdmFsdWUgPyBhZGRDbGFzcyA6IHJlbW92ZUNsYXNzXG4gICAgbWV0aG9kKHRoaXMuZWwsIHRoaXMuYXJnKVxuICB9IGVsc2Uge1xuICAgIGlmICh0aGlzLmxhc3RWYWwpIHtcbiAgICAgIHJlbW92ZUNsYXNzKHRoaXMuZWwsIHRoaXMubGFzdFZhbClcbiAgICB9XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBhZGRDbGFzcyh0aGlzLmVsLCB2YWx1ZSlcbiAgICAgIHRoaXMubGFzdFZhbCA9IHZhbHVlXG4gICAgfVxuICB9XG59IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy52bS4kb25jZSgnaG9vazpjb21waWxlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShjb25maWcucHJlZml4ICsgJ2Nsb2FrJylcbiAgICB9KVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICAvKipcbiAgICogU2V0dXAuIFR3byBwb3NzaWJsZSB1c2FnZXM6XG4gICAqXG4gICAqIC0gc3RhdGljOlxuICAgKiAgIHYtY29tcG9uZW50PVwiY29tcFwiXG4gICAqXG4gICAqIC0gZHluYW1pYzpcbiAgICogICB2LWNvbXBvbmVudD1cInt7Y3VycmVudFZpZXd9fVwiXG4gICAqL1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwuX192dWVfXykge1xuICAgICAgLy8gY3JlYXRlIGEgcmVmIGFuY2hvclxuICAgICAgdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LWNvbXBvbmVudCcpXG4gICAgICBfLnJlcGxhY2UodGhpcy5lbCwgdGhpcy5yZWYpXG4gICAgICAvLyBjaGVjayBrZWVwLWFsaXZlIG9wdGlvbnMuXG4gICAgICAvLyBJZiB5ZXMsIGluc3RlYWQgb2YgZGVzdHJveWluZyB0aGUgYWN0aXZlIHZtIHdoZW5cbiAgICAgIC8vIGhpZGluZyAodi1pZikgb3Igc3dpdGNoaW5nIChkeW5hbWljIGxpdGVyYWwpIGl0LFxuICAgICAgLy8gd2Ugc2ltcGx5IHJlbW92ZSBpdCBmcm9tIHRoZSBET00gYW5kIHNhdmUgaXQgaW4gYVxuICAgICAgLy8gY2FjaGUgb2JqZWN0LCB3aXRoIGl0cyBjb25zdHJ1Y3RvciBpZCBhcyB0aGUga2V5LlxuICAgICAgdGhpcy5rZWVwQWxpdmUgPSB0aGlzLl9jaGVja1BhcmFtKCdrZWVwLWFsaXZlJykgIT0gbnVsbFxuICAgICAgLy8gY2hlY2sgcmVmXG4gICAgICB0aGlzLnJlZklEID0gXy5hdHRyKHRoaXMuZWwsICdyZWYnKVxuICAgICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgIHRoaXMuY2FjaGUgPSB7fVxuICAgICAgfVxuICAgICAgLy8gY2hlY2sgaW5saW5lLXRlbXBsYXRlXG4gICAgICBpZiAodGhpcy5fY2hlY2tQYXJhbSgnaW5saW5lLXRlbXBsYXRlJykgIT09IG51bGwpIHtcbiAgICAgICAgLy8gZXh0cmFjdCBpbmxpbmUgdGVtcGxhdGUgYXMgYSBEb2N1bWVudEZyYWdtZW50XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBfLmV4dHJhY3RDb250ZW50KHRoaXMuZWwsIHRydWUpXG4gICAgICB9XG4gICAgICAvLyBpZiBzdGF0aWMsIGJ1aWxkIHJpZ2h0IG5vdy5cbiAgICAgIGlmICghdGhpcy5faXNEeW5hbWljTGl0ZXJhbCkge1xuICAgICAgICB0aGlzLnJlc29sdmVDdG9yKHRoaXMuZXhwcmVzc2lvbilcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5idWlsZCgpXG4gICAgICAgIGNoaWxkLiRiZWZvcmUodGhpcy5yZWYpXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudChjaGlsZClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNoZWNrIGR5bmFtaWMgY29tcG9uZW50IHBhcmFtc1xuICAgICAgICB0aGlzLnJlYWR5RXZlbnQgPSB0aGlzLl9jaGVja1BhcmFtKCd3YWl0LWZvcicpXG4gICAgICAgIHRoaXMudHJhbnNNb2RlID0gdGhpcy5fY2hlY2tQYXJhbSgndHJhbnNpdGlvbi1tb2RlJylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgXy53YXJuKFxuICAgICAgICAndi1jb21wb25lbnQ9XCInICsgdGhpcy5leHByZXNzaW9uICsgJ1wiIGNhbm5vdCBiZSAnICtcbiAgICAgICAgJ3VzZWQgb24gYW4gYWxyZWFkeSBtb3VudGVkIGluc3RhbmNlLidcbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc29sdmUgdGhlIGNvbXBvbmVudCBjb25zdHJ1Y3RvciB0byB1c2Ugd2hlbiBjcmVhdGluZ1xuICAgKiB0aGUgY2hpbGQgdm0uXG4gICAqL1xuXG4gIHJlc29sdmVDdG9yOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB0aGlzLmN0b3JJZCA9IGlkXG4gICAgdGhpcy5DdG9yID0gdGhpcy52bS4kb3B0aW9ucy5jb21wb25lbnRzW2lkXVxuICAgIF8uYXNzZXJ0QXNzZXQodGhpcy5DdG9yLCAnY29tcG9uZW50JywgaWQpXG4gIH0sXG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlL2luc2VydCBhIG5ldyBjaGlsZCB2bS5cbiAgICogSWYga2VlcCBhbGl2ZSBhbmQgaGFzIGNhY2hlZCBpbnN0YW5jZSwgaW5zZXJ0IHRoYXRcbiAgICogaW5zdGFuY2U7IG90aGVyd2lzZSBidWlsZCBhIG5ldyBvbmUgYW5kIGNhY2hlIGl0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtWdWV9IC0gdGhlIGNyZWF0ZWQgaW5zdGFuY2VcbiAgICovXG5cbiAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5rZWVwQWxpdmUpIHtcbiAgICAgIHZhciBjYWNoZWQgPSB0aGlzLmNhY2hlW3RoaXMuY3RvcklkXVxuICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICByZXR1cm4gY2FjaGVkXG4gICAgICB9XG4gICAgfVxuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICB2YXIgZWwgPSB0ZW1wbGF0ZVBhcnNlci5jbG9uZSh0aGlzLmVsKVxuICAgIGlmICh0aGlzLkN0b3IpIHtcbiAgICAgIHZhciBjaGlsZCA9IHZtLiRhZGRDaGlsZCh7XG4gICAgICAgIGVsOiBlbCxcbiAgICAgICAgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUsXG4gICAgICAgIF9hc0NvbXBvbmVudDogdHJ1ZVxuICAgICAgfSwgdGhpcy5DdG9yKVxuICAgICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgIHRoaXMuY2FjaGVbdGhpcy5jdG9ySWRdID0gY2hpbGRcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGlsZFxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVGVhcmRvd24gdGhlIGN1cnJlbnQgY2hpbGQsIGJ1dCBkZWZlcnMgY2xlYW51cCBzb1xuICAgKiB0aGF0IHdlIGNhbiBzZXBhcmF0ZSB0aGUgZGVzdHJveSBhbmQgcmVtb3ZhbCBzdGVwcy5cbiAgICovXG5cbiAgdW5idWlsZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRWTVxuICAgIGlmICghY2hpbGQgfHwgdGhpcy5rZWVwQWxpdmUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyB0aGUgc29sZSBwdXJwb3NlIG9mIGBkZWZlckNsZWFudXBgIGlzIHNvIHRoYXQgd2UgY2FuXG4gICAgLy8gXCJkZWFjdGl2YXRlXCIgdGhlIHZtIHJpZ2h0IG5vdyBhbmQgcGVyZm9ybSBET00gcmVtb3ZhbFxuICAgIC8vIGxhdGVyLlxuICAgIGNoaWxkLiRkZXN0cm95KGZhbHNlLCB0cnVlKVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgY3VycmVudCBkZXN0cm95ZWQgY2hpbGQgYW5kIG1hbnVhbGx5IGRvXG4gICAqIHRoZSBjbGVhbnVwIGFmdGVyIHJlbW92YWwuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gICAqL1xuXG4gIHJlbW92ZTogZnVuY3Rpb24gKGNoaWxkLCBjYikge1xuICAgIHZhciBrZWVwQWxpdmUgPSB0aGlzLmtlZXBBbGl2ZVxuICAgIGlmIChjaGlsZCkge1xuICAgICAgY2hpbGQuJHJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgha2VlcEFsaXZlKSBjaGlsZC5fY2xlYW51cCgpXG4gICAgICAgIGlmIChjYikgY2IoKVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGNiKSB7XG4gICAgICBjYigpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVcGRhdGUgY2FsbGJhY2sgZm9yIHRoZSBkeW5hbWljIGxpdGVyYWwgc2NlbmFyaW8sXG4gICAqIGUuZy4gdi1jb21wb25lbnQ9XCJ7e3ZpZXd9fVwiXG4gICAqL1xuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgLy8ganVzdCBkZXN0cm95IGFuZCByZW1vdmUgY3VycmVudFxuICAgICAgdGhpcy51bmJ1aWxkKClcbiAgICAgIHRoaXMucmVtb3ZlKHRoaXMuY2hpbGRWTSlcbiAgICAgIHRoaXMudW5zZXRDdXJyZW50KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXNvbHZlQ3Rvcih2YWx1ZSlcbiAgICAgIHRoaXMudW5idWlsZCgpXG4gICAgICB2YXIgbmV3Q29tcG9uZW50ID0gdGhpcy5idWlsZCgpXG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIGlmICh0aGlzLnJlYWR5RXZlbnQpIHtcbiAgICAgICAgbmV3Q29tcG9uZW50LiRvbmNlKHRoaXMucmVhZHlFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYuc3dhcFRvKG5ld0NvbXBvbmVudClcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3dhcFRvKG5ld0NvbXBvbmVudClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFjdHVhbGx5IHN3YXAgdGhlIGNvbXBvbmVudHMsIGRlcGVuZGluZyBvbiB0aGVcbiAgICogdHJhbnNpdGlvbiBtb2RlLiBEZWZhdWx0cyB0byBzaW11bHRhbmVvdXMuXG4gICAqXG4gICAqIEBwYXJhbSB7VnVlfSB0YXJnZXRcbiAgICovXG5cbiAgc3dhcFRvOiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLmNoaWxkVk1cbiAgICB0aGlzLnVuc2V0Q3VycmVudCgpXG4gICAgdGhpcy5zZXRDdXJyZW50KHRhcmdldClcbiAgICBzd2l0Y2ggKHNlbGYudHJhbnNNb2RlKSB7XG4gICAgICBjYXNlICdpbi1vdXQnOlxuICAgICAgICB0YXJnZXQuJGJlZm9yZShzZWxmLnJlZiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYucmVtb3ZlKGN1cnJlbnQpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdvdXQtaW4nOlxuICAgICAgICBzZWxmLnJlbW92ZShjdXJyZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5yZWYpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBzZWxmLnJlbW92ZShjdXJyZW50KVxuICAgICAgICB0YXJnZXQuJGJlZm9yZShzZWxmLnJlZilcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldCBjaGlsZFZNIGFuZCBwYXJlbnQgcmVmXG4gICAqL1xuICBcbiAgc2V0Q3VycmVudDogZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgdGhpcy5jaGlsZFZNID0gY2hpbGRcbiAgICB2YXIgcmVmSUQgPSBjaGlsZC5fcmVmSUQgfHwgdGhpcy5yZWZJRFxuICAgIGlmIChyZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3JlZklEXSA9IGNoaWxkXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVbnNldCBjaGlsZFZNIGFuZCBwYXJlbnQgcmVmXG4gICAqL1xuXG4gIHVuc2V0Q3VycmVudDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRWTVxuICAgIHRoaXMuY2hpbGRWTSA9IG51bGxcbiAgICB2YXIgcmVmSUQgPSAoY2hpbGQgJiYgY2hpbGQuX3JlZklEKSB8fCB0aGlzLnJlZklEXG4gICAgaWYgKHJlZklEKSB7XG4gICAgICB0aGlzLnZtLiRbcmVmSURdID0gbnVsbFxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVW5iaW5kLlxuICAgKi9cblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnVuYnVpbGQoKVxuICAgIC8vIGRlc3Ryb3kgYWxsIGtlZXAtYWxpdmUgY2FjaGVkIGluc3RhbmNlc1xuICAgIGlmICh0aGlzLmNhY2hlKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5jYWNoZSkge1xuICAgICAgICB0aGlzLmNhY2hlW2tleV0uJGRlc3Ryb3koKVxuICAgICAgfVxuICAgICAgdGhpcy5jYWNoZSA9IG51bGxcbiAgICB9XG4gIH1cblxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy52bS4kJFt0aGlzLmV4cHJlc3Npb25dID0gdGhpcy5lbFxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGRlbGV0ZSB0aGlzLnZtLiQkW3RoaXMuZXhwcmVzc2lvbl1cbiAgfVxuICBcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuZWwuX192dWVfX1xuICAgIGlmICghY2hpbGQgfHwgdGhpcy52bSAhPT0gY2hpbGQuJHBhcmVudCkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnYHYtZXZlbnRzYCBzaG91bGQgb25seSBiZSB1c2VkIG9uIGEgY2hpbGQgY29tcG9uZW50ICcgK1xuICAgICAgICAnZnJvbSB0aGUgcGFyZW50IHRlbXBsYXRlLidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgbWV0aG9kID0gdGhpcy52bVt0aGlzLmV4cHJlc3Npb25dXG4gICAgaWYgKCFtZXRob2QpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ2B2LWV2ZW50c2AgY2Fubm90IGZpbmQgbWV0aG9kIFwiJyArIHRoaXMuZXhwcmVzc2lvbiArXG4gICAgICAgICdcIiBvbiB0aGUgcGFyZW50IGluc3RhbmNlLidcbiAgICAgIClcbiAgICB9XG4gICAgY2hpbGQuJG9uKHRoaXMuYXJnLCBtZXRob2QpXG4gIH1cblxuICAvLyB3aGVuIGNoaWxkIGlzIGRlc3Ryb3llZCwgYWxsIGV2ZW50cyBhcmUgdHVybmVkIG9mZixcbiAgLy8gc28gbm8gbmVlZCBmb3IgdW5iaW5kIGhlcmUuXG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBhIGNvbW1lbnQgbm9kZSBtZWFucyB0aGlzIGlzIGEgYmluZGluZyBmb3JcbiAgICAvLyB7e3sgaW5saW5lIHVuZXNjYXBlZCBodG1sIH19fVxuICAgIGlmICh0aGlzLmVsLm5vZGVUeXBlID09PSA4KSB7XG4gICAgICAvLyBob2xkIG5vZGVzXG4gICAgICB0aGlzLm5vZGVzID0gW11cbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YWx1ZSA9IF8udG9TdHJpbmcodmFsdWUpXG4gICAgaWYgKHRoaXMubm9kZXMpIHtcbiAgICAgIHRoaXMuc3dhcCh2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB2YWx1ZVxuICAgIH1cbiAgfSxcblxuICBzd2FwOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvLyByZW1vdmUgb2xkIG5vZGVzXG4gICAgdmFyIGkgPSB0aGlzLm5vZGVzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIF8ucmVtb3ZlKHRoaXMubm9kZXNbaV0pXG4gICAgfVxuICAgIC8vIGNvbnZlcnQgbmV3IHZhbHVlIHRvIGEgZnJhZ21lbnRcbiAgICAvLyBkbyBub3QgYXR0ZW1wdCB0byByZXRyaWV2ZSBmcm9tIGlkIHNlbGVjdG9yXG4gICAgdmFyIGZyYWcgPSB0ZW1wbGF0ZVBhcnNlci5wYXJzZSh2YWx1ZSwgdHJ1ZSwgdHJ1ZSlcbiAgICAvLyBzYXZlIGEgcmVmZXJlbmNlIHRvIHRoZXNlIG5vZGVzIHNvIHdlIGNhbiByZW1vdmUgbGF0ZXJcbiAgICB0aGlzLm5vZGVzID0gXy50b0FycmF5KGZyYWcuY2hpbGROb2RlcylcbiAgICBfLmJlZm9yZShmcmFnLCB0aGlzLmVsKVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGNvbXBpbGUgPSByZXF1aXJlKCcuLi9jb21waWxlci9jb21waWxlJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxudmFyIHRyYW5zaXRpb24gPSByZXF1aXJlKCcuLi90cmFuc2l0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICBpZiAoIWVsLl9fdnVlX18pIHtcbiAgICAgIHRoaXMuc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LWlmLXN0YXJ0JylcbiAgICAgIHRoaXMuZW5kID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1pZi1lbmQnKVxuICAgICAgXy5yZXBsYWNlKGVsLCB0aGlzLmVuZClcbiAgICAgIF8uYmVmb3JlKHRoaXMuc3RhcnQsIHRoaXMuZW5kKVxuXG4gICAgICAvLyBOb3RlOiBjb250ZW50IHRyYW5zY2x1c2lvbiBpcyBub3QgYXZhaWxhYmxlIGZvclxuICAgICAgLy8gPHRlbXBsYXRlPiBibG9ja3NcbiAgICAgIGlmIChlbC50YWdOYW1lID09PSAnVEVNUExBVEUnKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVBhcnNlci5wYXJzZShlbCwgdHJ1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZVBhcnNlci5jbG9uZShlbCkpXG4gICAgICAgIHRoaXMuY2hlY2tDb250ZW50KClcbiAgICAgIH1cbiAgICAgIC8vIGNvbXBpbGUgdGhlIG5lc3RlZCBwYXJ0aWFsXG4gICAgICB0aGlzLmxpbmtlciA9IGNvbXBpbGUoXG4gICAgICAgIHRoaXMudGVtcGxhdGUsXG4gICAgICAgIHRoaXMudm0uJG9wdGlvbnMsXG4gICAgICAgIHRydWVcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnZhbGlkID0gdHJ1ZVxuICAgICAgXy53YXJuKFxuICAgICAgICAndi1pZj1cIicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIgY2Fubm90IGJlICcgK1xuICAgICAgICAndXNlZCBvbiBhbiBhbHJlYWR5IG1vdW50ZWQgaW5zdGFuY2UuJ1xuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICAvLyBjaGVjayBpZiB0aGVyZSBhcmUgYW55IGNvbnRlbnQgbm9kZXMgZnJvbSBwYXJlbnQuXG4gIC8vIHRoZXNlIG5vZGVzIGFyZSBjb21waWxlZCBieSB0aGUgcGFyZW50IGFuZCBzaG91bGRcbiAgLy8gbm90IGJlIGNsb25lZCBkdXJpbmcgYSByZS1jb21waWxhdGlvbiAtIG90aGVyd2lzZSB0aGVcbiAgLy8gcGFyZW50IGRpcmVjdGl2ZXMgYm91bmQgdG8gdGhlbSB3aWxsIG5vIGxvbmdlciB3b3JrLlxuICAvLyAoc2VlICM3MzYpXG4gIGNoZWNrQ29udGVudDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBub2RlID0gZWwuY2hpbGROb2Rlc1tpXVxuICAgICAgLy8gX2lzQ29udGVudCBpcyBhIGZsYWcgc2V0IGluIGluc3RhbmNlL2NvbXBpbGVcbiAgICAgIC8vIGFmdGVyIHRoZSByYXcgY29udGVudCBoYXMgYmVlbiBjb21waWxlZCBieSBwYXJlbnRcbiAgICAgIGlmIChub2RlLl9pc0NvbnRlbnQpIHtcbiAgICAgICAgOyh0aGlzLmNvbnRlbnROb2RlcyA9IHRoaXMuY29udGVudE5vZGVzIHx8IFtdKS5wdXNoKG5vZGUpXG4gICAgICAgIDsodGhpcy5jb250ZW50UG9zaXRpb25zID0gdGhpcy5jb250ZW50UG9zaXRpb25zIHx8IFtdKS5wdXNoKGkpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIGtlZXAgdHJhY2sgb2YgYW55IHRyYW5zY2x1ZGVkIGNvbXBvbmVudHMgY29udGFpbmVkIHdpdGhpblxuICAgIC8vIHRoZSBjb25kaXRpb25hbCBibG9jay4gd2UgbmVlZCB0byBjYWxsIGF0dGFjaC9kZXRhY2ggaG9va3NcbiAgICAvLyBmb3IgdGhlbS5cbiAgICB0aGlzLnRyYW5zQ3BudHMgPVxuICAgICAgdGhpcy52bS5fdHJhbnNDcG50cyAmJlxuICAgICAgdGhpcy52bS5fdHJhbnNDcG50cy5maWx0ZXIoZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgcmV0dXJuIGVsLmNvbnRhaW5zKGMuJGVsKVxuICAgICAgfSlcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmludmFsaWQpIHJldHVyblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgLy8gYXZvaWQgZHVwbGljYXRlIGNvbXBpbGVzLCBzaW5jZSB1cGRhdGUoKSBjYW4gYmVcbiAgICAgIC8vIGNhbGxlZCB3aXRoIGRpZmZlcmVudCB0cnV0aHkgdmFsdWVzXG4gICAgICBpZiAoIXRoaXMudW5saW5rKSB7XG4gICAgICAgIHZhciBmcmFnID0gdGVtcGxhdGVQYXJzZXIuY2xvbmUodGhpcy50ZW1wbGF0ZSlcbiAgICAgICAgLy8gcGVyc2lzdCBjb250ZW50IG5vZGVzIGZyb20gcGFyZW50LlxuICAgICAgICBpZiAodGhpcy5jb250ZW50Tm9kZXMpIHtcbiAgICAgICAgICB2YXIgZWwgPSBmcmFnLmNoaWxkTm9kZXNbMF1cbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRoaXMuY29udGVudE5vZGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmNvbnRlbnROb2Rlc1tpXVxuICAgICAgICAgICAgdmFyIGogPSB0aGlzLmNvbnRlbnRQb3NpdGlvbnNbaV1cbiAgICAgICAgICAgIGVsLnJlcGxhY2VDaGlsZChub2RlLCBlbC5jaGlsZE5vZGVzW2pdKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbXBpbGUoZnJhZylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZWFyZG93bigpXG4gICAgfVxuICB9LFxuXG4gIC8vIE5PVEU6IHRoaXMgZnVuY3Rpb24gaXMgc2hhcmVkIGluIHYtcGFydGlhbFxuICBjb21waWxlOiBmdW5jdGlvbiAoZnJhZykge1xuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICB2YXIgb3JpZ2luYWxDaGlsZExlbmd0aCA9IHZtLl9jaGlsZHJlbi5sZW5ndGhcbiAgICB0aGlzLnVubGluayA9IHRoaXMubGlua2VyXG4gICAgICA/IHRoaXMubGlua2VyKHZtLCBmcmFnKVxuICAgICAgOiB2bS4kY29tcGlsZShmcmFnKVxuICAgIHRyYW5zaXRpb24uYmxvY2tBcHBlbmQoZnJhZywgdGhpcy5lbmQsIHZtKVxuICAgIHRoaXMuY2hpbGRyZW4gPSB2bS5fY2hpbGRyZW4uc2xpY2Uob3JpZ2luYWxDaGlsZExlbmd0aClcbiAgICBpZiAodGhpcy50cmFuc0NwbnRzKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5jb25jYXQodGhpcy50cmFuc0NwbnRzKVxuICAgIH1cbiAgICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggJiYgXy5pbkRvYyh2bS4kZWwpKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLl9jYWxsSG9vaygnYXR0YWNoZWQnKVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgLy8gTk9URTogdGhpcyBmdW5jdGlvbiBpcyBzaGFyZWQgaW4gdi1wYXJ0aWFsXG4gIHRlYXJkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnVubGluaykgcmV0dXJuXG4gICAgdHJhbnNpdGlvbi5ibG9ja1JlbW92ZSh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgdGhpcy52bSlcbiAgICBpZiAodGhpcy5jaGlsZHJlbiAmJiBfLmluRG9jKHRoaXMudm0uJGVsKSkge1xuICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBpZiAoIWNoaWxkLl9pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIGNoaWxkLl9jYWxsSG9vaygnZGV0YWNoZWQnKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLnVubGluaygpXG4gICAgdGhpcy51bmxpbmsgPSBudWxsXG4gIH0sXG5cbiAgLy8gTk9URTogdGhpcyBmdW5jdGlvbiBpcyBzaGFyZWQgaW4gdi1wYXJ0aWFsXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnVubGluaykgdGhpcy51bmxpbmsoKVxuICB9XG5cbn0iLCIvLyBtYW5pcHVsYXRpb24gZGlyZWN0aXZlc1xuZXhwb3J0cy50ZXh0ICAgICAgID0gcmVxdWlyZSgnLi90ZXh0JylcbmV4cG9ydHMuaHRtbCAgICAgICA9IHJlcXVpcmUoJy4vaHRtbCcpXG5leHBvcnRzLmF0dHIgICAgICAgPSByZXF1aXJlKCcuL2F0dHInKVxuZXhwb3J0cy5zaG93ICAgICAgID0gcmVxdWlyZSgnLi9zaG93JylcbmV4cG9ydHNbJ2NsYXNzJ10gICA9IHJlcXVpcmUoJy4vY2xhc3MnKVxuZXhwb3J0cy5lbCAgICAgICAgID0gcmVxdWlyZSgnLi9lbCcpXG5leHBvcnRzLnJlZiAgICAgICAgPSByZXF1aXJlKCcuL3JlZicpXG5leHBvcnRzLmNsb2FrICAgICAgPSByZXF1aXJlKCcuL2Nsb2FrJylcbmV4cG9ydHMuc3R5bGUgICAgICA9IHJlcXVpcmUoJy4vc3R5bGUnKVxuZXhwb3J0cy5wYXJ0aWFsICAgID0gcmVxdWlyZSgnLi9wYXJ0aWFsJylcbmV4cG9ydHMudHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbicpXG5cbi8vIGV2ZW50IGxpc3RlbmVyIGRpcmVjdGl2ZXNcbmV4cG9ydHMub24gICAgICAgICA9IHJlcXVpcmUoJy4vb24nKVxuZXhwb3J0cy5tb2RlbCAgICAgID0gcmVxdWlyZSgnLi9tb2RlbCcpXG5cbi8vIGNoaWxkIHZtIGRpcmVjdGl2ZXNcbmV4cG9ydHMuY29tcG9uZW50ICA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcbmV4cG9ydHMucmVwZWF0ICAgICA9IHJlcXVpcmUoJy4vcmVwZWF0JylcbmV4cG9ydHNbJ2lmJ10gICAgICA9IHJlcXVpcmUoJy4vaWYnKVxuXG4vLyBjaGlsZCB2bSBjb21tdW5pY2F0aW9uIGRpcmVjdGl2ZXNcbmV4cG9ydHNbJ3dpdGgnXSAgICA9IHJlcXVpcmUoJy4vd2l0aCcpXG5leHBvcnRzLmV2ZW50cyAgICAgPSByZXF1aXJlKCcuL2V2ZW50cycpIiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5zZXQoZWwuY2hlY2tlZCwgdHJ1ZSlcbiAgICB9XG4gICAgXy5vbihlbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gICAgaWYgKGVsLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2luaXRWYWx1ZSA9IGVsLmNoZWNrZWRcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmVsLmNoZWNrZWQgPSAhIXZhbHVlXG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgXy5vZmYodGhpcy5lbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG5cbiAgICAvLyBjaGVjayBwYXJhbXNcbiAgICAvLyAtIGxhenk6IHVwZGF0ZSBtb2RlbCBvbiBcImNoYW5nZVwiIGluc3RlYWQgb2YgXCJpbnB1dFwiXG4gICAgdmFyIGxhenkgPSB0aGlzLl9jaGVja1BhcmFtKCdsYXp5JykgIT0gbnVsbFxuICAgIC8vIC0gbnVtYmVyOiBjYXN0IHZhbHVlIGludG8gbnVtYmVyIHdoZW4gdXBkYXRpbmcgbW9kZWwuXG4gICAgdmFyIG51bWJlciA9IHRoaXMuX2NoZWNrUGFyYW0oJ251bWJlcicpICE9IG51bGxcbiAgICAvLyAtIGRlYm91bmNlOiBkZWJvdW5jZSB0aGUgaW5wdXQgbGlzdGVuZXJcbiAgICB2YXIgZGVib3VuY2UgPSBwYXJzZUludCh0aGlzLl9jaGVja1BhcmFtKCdkZWJvdW5jZScpLCAxMClcblxuICAgIC8vIGhhbmRsZSBjb21wb3NpdGlvbiBldmVudHMuXG4gICAgLy8gaHR0cDovL2Jsb2cuZXZhbnlvdS5tZS8yMDE0LzAxLzAzL2NvbXBvc2l0aW9uLWV2ZW50L1xuICAgIHZhciBjcExvY2tlZCA9IGZhbHNlXG4gICAgdGhpcy5jcExvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjcExvY2tlZCA9IHRydWVcbiAgICB9XG4gICAgdGhpcy5jcFVubG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNwTG9ja2VkID0gZmFsc2VcbiAgICAgIC8vIGluIElFMTEgdGhlIFwiY29tcG9zaXRpb25lbmRcIiBldmVudCBmaXJlcyBBRlRFUlxuICAgICAgLy8gdGhlIFwiaW5wdXRcIiBldmVudCwgc28gdGhlIGlucHV0IGhhbmRsZXIgaXMgYmxvY2tlZFxuICAgICAgLy8gYXQgdGhlIGVuZC4uLiBoYXZlIHRvIGNhbGwgaXQgaGVyZS5cbiAgICAgIHNldCgpXG4gICAgfVxuICAgIF8ub24oZWwsJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNwTG9jaylcbiAgICBfLm9uKGVsLCdjb21wb3NpdGlvbmVuZCcsIHRoaXMuY3BVbmxvY2spXG5cbiAgICAvLyBzaGFyZWQgc2V0dGVyXG4gICAgZnVuY3Rpb24gc2V0ICgpIHtcbiAgICAgIHNlbGYuc2V0KFxuICAgICAgICBudW1iZXIgPyBfLnRvTnVtYmVyKGVsLnZhbHVlKSA6IGVsLnZhbHVlLFxuICAgICAgICB0cnVlXG4gICAgICApXG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGRpcmVjdGl2ZSBoYXMgZmlsdGVycywgd2UgbmVlZCB0b1xuICAgIC8vIHJlY29yZCBjdXJzb3IgcG9zaXRpb24gYW5kIHJlc3RvcmUgaXQgYWZ0ZXIgdXBkYXRpbmdcbiAgICAvLyB0aGUgaW5wdXQgd2l0aCB0aGUgZmlsdGVyZWQgdmFsdWUuXG4gICAgLy8gYWxzbyBmb3JjZSB1cGRhdGUgZm9yIHR5cGU9XCJyYW5nZVwiIGlucHV0cyB0byBlbmFibGVcbiAgICAvLyBcImxvY2sgaW4gcmFuZ2VcIiAoc2VlICM1MDYpXG4gICAgdmFyIGhhc1JlYWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnMgJiYgdGhpcy5maWx0ZXJzLnJlYWRcbiAgICB0aGlzLmxpc3RlbmVyID0gaGFzUmVhZEZpbHRlciB8fCBlbC50eXBlID09PSAncmFuZ2UnXG4gICAgICA/IGZ1bmN0aW9uIHRleHRJbnB1dExpc3RlbmVyICgpIHtcbiAgICAgICAgICBpZiAoY3BMb2NrZWQpIHJldHVyblxuICAgICAgICAgIHZhciBjaGFyc09mZnNldFxuICAgICAgICAgIC8vIHNvbWUgSFRNTDUgaW5wdXQgdHlwZXMgdGhyb3cgZXJyb3IgaGVyZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyByZWNvcmQgaG93IG1hbnkgY2hhcnMgZnJvbSB0aGUgZW5kIG9mIGlucHV0XG4gICAgICAgICAgICAvLyB0aGUgY3Vyc29yIHdhcyBhdFxuICAgICAgICAgICAgY2hhcnNPZmZzZXQgPSBlbC52YWx1ZS5sZW5ndGggLSBlbC5zZWxlY3Rpb25TdGFydFxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgLy8gRml4IElFMTAvMTEgaW5maW5pdGUgdXBkYXRlIGN5Y2xlXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3l5eDk5MDgwMy92dWUvaXNzdWVzLzU5MlxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChjaGFyc09mZnNldCA8IDApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXQoKVxuICAgICAgICAgIF8ubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gZm9yY2UgYSB2YWx1ZSB1cGRhdGUsIGJlY2F1c2UgaW5cbiAgICAgICAgICAgIC8vIGNlcnRhaW4gY2FzZXMgdGhlIHdyaXRlIGZpbHRlcnMgb3V0cHV0IHRoZVxuICAgICAgICAgICAgLy8gc2FtZSByZXN1bHQgZm9yIGRpZmZlcmVudCBpbnB1dCB2YWx1ZXMsIGFuZFxuICAgICAgICAgICAgLy8gdGhlIE9ic2VydmVyIHNldCBldmVudHMgd29uJ3QgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IHNlbGYuX3dhdGNoZXIudmFsdWVcbiAgICAgICAgICAgIHNlbGYudXBkYXRlKG5ld1ZhbClcbiAgICAgICAgICAgIGlmIChjaGFyc09mZnNldCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHZhciBjdXJzb3JQb3MgPVxuICAgICAgICAgICAgICAgIF8udG9TdHJpbmcobmV3VmFsKS5sZW5ndGggLSBjaGFyc09mZnNldFxuICAgICAgICAgICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZShjdXJzb3JQb3MsIGN1cnNvclBvcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uIHRleHRJbnB1dExpc3RlbmVyICgpIHtcbiAgICAgICAgICBpZiAoY3BMb2NrZWQpIHJldHVyblxuICAgICAgICAgIHNldCgpXG4gICAgICAgIH1cblxuICAgIGlmIChkZWJvdW5jZSkge1xuICAgICAgdGhpcy5saXN0ZW5lciA9IF8uZGVib3VuY2UodGhpcy5saXN0ZW5lciwgZGVib3VuY2UpXG4gICAgfVxuICAgIHRoaXMuZXZlbnQgPSBsYXp5ID8gJ2NoYW5nZScgOiAnaW5wdXQnXG4gICAgLy8gU3VwcG9ydCBqUXVlcnkgZXZlbnRzLCBzaW5jZSBqUXVlcnkudHJpZ2dlcigpIGRvZXNuJ3RcbiAgICAvLyB0cmlnZ2VyIG5hdGl2ZSBldmVudHMgaW4gc29tZSBjYXNlcyBhbmQgc29tZSBwbHVnaW5zXG4gICAgLy8gcmVseSBvbiAkLnRyaWdnZXIoKVxuICAgIC8vIFxuICAgIC8vIFdlIHdhbnQgdG8gbWFrZSBzdXJlIGlmIGEgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdXNpbmdcbiAgICAvLyBqUXVlcnksIGl0IGlzIGFsc28gcmVtb3ZlZCB3aXRoIGpRdWVyeSwgdGhhdCdzIHdoeVxuICAgIC8vIHdlIGRvIHRoZSBjaGVjayBmb3IgZWFjaCBkaXJlY3RpdmUgaW5zdGFuY2UgYW5kXG4gICAgLy8gc3RvcmUgdGhhdCBjaGVjayByZXN1bHQgb24gaXRzZWxmLiBUaGlzIGFsc28gYWxsb3dzXG4gICAgLy8gZWFzaWVyIHRlc3QgY292ZXJhZ2UgY29udHJvbCBieSB1bnNldHRpbmcgdGhlIGdsb2JhbFxuICAgIC8vIGpRdWVyeSB2YXJpYWJsZSBpbiB0ZXN0cy5cbiAgICB0aGlzLmhhc2pRdWVyeSA9IHR5cGVvZiBqUXVlcnkgPT09ICdmdW5jdGlvbidcbiAgICBpZiAodGhpcy5oYXNqUXVlcnkpIHtcbiAgICAgIGpRdWVyeShlbCkub24odGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9IGVsc2Uge1xuICAgICAgXy5vbihlbCwgdGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9XG5cbiAgICAvLyBJRTkgZG9lc24ndCBmaXJlIGlucHV0IGV2ZW50IG9uIGJhY2tzcGFjZS9kZWwvY3V0XG4gICAgaWYgKCFsYXp5ICYmIF8uaXNJRTkpIHtcbiAgICAgIHRoaXMub25DdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF8ubmV4dFRpY2soc2VsZi5saXN0ZW5lcilcbiAgICAgIH1cbiAgICAgIHRoaXMub25EZWwgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA0NiB8fCBlLmtleUNvZGUgPT09IDgpIHtcbiAgICAgICAgICBzZWxmLmxpc3RlbmVyKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXy5vbihlbCwgJ2N1dCcsIHRoaXMub25DdXQpXG4gICAgICBfLm9uKGVsLCAna2V5dXAnLCB0aGlzLm9uRGVsKVxuICAgIH1cblxuICAgIC8vIHNldCBpbml0aWFsIHZhbHVlIGlmIHByZXNlbnRcbiAgICBpZiAoXG4gICAgICBlbC5oYXNBdHRyaWJ1dGUoJ3ZhbHVlJykgfHxcbiAgICAgIChlbC50YWdOYW1lID09PSAnVEVYVEFSRUEnICYmIGVsLnZhbHVlLnRyaW0oKSlcbiAgICApIHtcbiAgICAgIHRoaXMuX2luaXRWYWx1ZSA9IG51bWJlclxuICAgICAgICA/IF8udG9OdW1iZXIoZWwudmFsdWUpXG4gICAgICAgIDogZWwudmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmVsLnZhbHVlID0gXy50b1N0cmluZyh2YWx1ZSlcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgaWYgKHRoaXMuaGFzalF1ZXJ5KSB7XG4gICAgICBqUXVlcnkoZWwpLm9mZih0aGlzLmV2ZW50LCB0aGlzLmxpc3RlbmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBfLm9mZihlbCwgdGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9XG4gICAgXy5vZmYoZWwsJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNwTG9jaylcbiAgICBfLm9mZihlbCwnY29tcG9zaXRpb25lbmQnLCB0aGlzLmNwVW5sb2NrKVxuICAgIGlmICh0aGlzLm9uQ3V0KSB7XG4gICAgICBfLm9mZihlbCwnY3V0JywgdGhpcy5vbkN1dClcbiAgICAgIF8ub2ZmKGVsLCdrZXl1cCcsIHRoaXMub25EZWwpXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxuXG52YXIgaGFuZGxlcnMgPSB7XG4gIF9kZWZhdWx0OiByZXF1aXJlKCcuL2RlZmF1bHQnKSxcbiAgcmFkaW86IHJlcXVpcmUoJy4vcmFkaW8nKSxcbiAgc2VsZWN0OiByZXF1aXJlKCcuL3NlbGVjdCcpLFxuICBjaGVja2JveDogcmVxdWlyZSgnLi9jaGVja2JveCcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHByaW9yaXR5OiA4MDAsXG4gIHR3b1dheTogdHJ1ZSxcbiAgaGFuZGxlcnM6IGhhbmRsZXJzLFxuXG4gIC8qKlxuICAgKiBQb3NzaWJsZSBlbGVtZW50czpcbiAgICogICA8c2VsZWN0PlxuICAgKiAgIDx0ZXh0YXJlYT5cbiAgICogICA8aW5wdXQgdHlwZT1cIipcIj5cbiAgICogICAgIC0gdGV4dFxuICAgKiAgICAgLSBjaGVja2JveFxuICAgKiAgICAgLSByYWRpb1xuICAgKiAgICAgLSBudW1iZXJcbiAgICogICAgIC0gVE9ETzogbW9yZSB0eXBlcyBtYXkgYmUgc3VwcGxpZWQgYXMgYSBwbHVnaW5cbiAgICovXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGZyaWVuZGx5IHdhcm5pbmcuLi5cbiAgICB2YXIgZmlsdGVycyA9IHRoaXMuZmlsdGVyc1xuICAgIGlmIChmaWx0ZXJzICYmIGZpbHRlcnMucmVhZCAmJiAhZmlsdGVycy53cml0ZSkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnSXQgc2VlbXMgeW91IGFyZSB1c2luZyBhIHJlYWQtb25seSBmaWx0ZXIgd2l0aCAnICtcbiAgICAgICAgJ3YtbW9kZWwuIFlvdSBtaWdodCB3YW50IHRvIHVzZSBhIHR3by13YXkgZmlsdGVyICcgK1xuICAgICAgICAndG8gZW5zdXJlIGNvcnJlY3QgYmVoYXZpb3IuJ1xuICAgICAgKVxuICAgIH1cbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdmFyIHRhZyA9IGVsLnRhZ05hbWVcbiAgICB2YXIgaGFuZGxlclxuICAgIGlmICh0YWcgPT09ICdJTlBVVCcpIHtcbiAgICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tlbC50eXBlXSB8fCBoYW5kbGVycy5fZGVmYXVsdFxuICAgIH0gZWxzZSBpZiAodGFnID09PSAnU0VMRUNUJykge1xuICAgICAgaGFuZGxlciA9IGhhbmRsZXJzLnNlbGVjdFxuICAgIH0gZWxzZSBpZiAodGFnID09PSAnVEVYVEFSRUEnKSB7XG4gICAgICBoYW5kbGVyID0gaGFuZGxlcnMuX2RlZmF1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgXy53YXJuKFwidi1tb2RlbCBkb2Vzbid0IHN1cHBvcnQgZWxlbWVudCB0eXBlOiBcIiArIHRhZylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBoYW5kbGVyLmJpbmQuY2FsbCh0aGlzKVxuICAgIHRoaXMudXBkYXRlID0gaGFuZGxlci51cGRhdGVcbiAgICB0aGlzLnVuYmluZCA9IGhhbmRsZXIudW5iaW5kXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy5saXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuc2V0KGVsLnZhbHVlLCB0cnVlKVxuICAgIH1cbiAgICBfLm9uKGVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgICBpZiAoZWwuY2hlY2tlZCkge1xuICAgICAgdGhpcy5faW5pdFZhbHVlID0gZWwudmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgIHRoaXMuZWwuY2hlY2tlZCA9IHZhbHVlID09IHRoaXMuZWwudmFsdWVcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBfLm9mZih0aGlzLmVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcbnZhciBXYXRjaGVyID0gcmVxdWlyZSgnLi4vLi4vd2F0Y2hlcicpXG52YXIgZGlyUGFyc2VyID0gcmVxdWlyZSgnLi4vLi4vcGFyc2Vycy9kaXJlY3RpdmUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIC8vIGNoZWNrIG9wdGlvbnMgcGFyYW1cbiAgICB2YXIgb3B0aW9uc1BhcmFtID0gdGhpcy5fY2hlY2tQYXJhbSgnb3B0aW9ucycpXG4gICAgaWYgKG9wdGlvbnNQYXJhbSkge1xuICAgICAgaW5pdE9wdGlvbnMuY2FsbCh0aGlzLCBvcHRpb25zUGFyYW0pXG4gICAgfVxuICAgIHRoaXMubnVtYmVyID0gdGhpcy5fY2hlY2tQYXJhbSgnbnVtYmVyJykgIT0gbnVsbFxuICAgIHRoaXMubXVsdGlwbGUgPSBlbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJylcbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlID0gc2VsZi5tdWx0aXBsZVxuICAgICAgICA/IGdldE11bHRpVmFsdWUoZWwpXG4gICAgICAgIDogZWwudmFsdWVcbiAgICAgIHZhbHVlID0gc2VsZi5udW1iZXJcbiAgICAgICAgPyBfLmlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgPyB2YWx1ZS5tYXAoXy50b051bWJlcilcbiAgICAgICAgICA6IF8udG9OdW1iZXIodmFsdWUpXG4gICAgICAgIDogdmFsdWVcbiAgICAgIHNlbGYuc2V0KHZhbHVlLCB0cnVlKVxuICAgIH1cbiAgICBfLm9uKGVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgICBjaGVja0luaXRpYWxWYWx1ZS5jYWxsKHRoaXMpXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICBlbC5zZWxlY3RlZEluZGV4ID0gLTFcbiAgICB2YXIgbXVsdGkgPSB0aGlzLm11bHRpcGxlICYmIF8uaXNBcnJheSh2YWx1ZSlcbiAgICB2YXIgb3B0aW9ucyA9IGVsLm9wdGlvbnNcbiAgICB2YXIgaSA9IG9wdGlvbnMubGVuZ3RoXG4gICAgdmFyIG9wdGlvblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV1cbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IG11bHRpXG4gICAgICAgID8gaW5kZXhPZih2YWx1ZSwgb3B0aW9uLnZhbHVlKSA+IC0xXG4gICAgICAgIDogdmFsdWUgPT0gb3B0aW9uLnZhbHVlXG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIF8ub2ZmKHRoaXMuZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICAgIGlmICh0aGlzLm9wdGlvbldhdGNoZXIpIHtcbiAgICAgIHRoaXMub3B0aW9uV2F0Y2hlci50ZWFyZG93bigpXG4gICAgfVxuICB9XG5cbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBvcHRpb24gbGlzdCBmcm9tIHRoZSBwYXJhbS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvblxuICovXG5cbmZ1bmN0aW9uIGluaXRPcHRpb25zIChleHByZXNzaW9uKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgZGVzY3JpcHRvciA9IGRpclBhcnNlci5wYXJzZShleHByZXNzaW9uKVswXVxuICBmdW5jdGlvbiBvcHRpb25VcGRhdGVXYXRjaGVyICh2YWx1ZSkge1xuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnXG4gICAgICBidWlsZE9wdGlvbnMoc2VsZi5lbCwgdmFsdWUpXG4gICAgICBpZiAoc2VsZi5fd2F0Y2hlcikge1xuICAgICAgICBzZWxmLnVwZGF0ZShzZWxmLl93YXRjaGVyLnZhbHVlKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBfLndhcm4oJ0ludmFsaWQgb3B0aW9ucyB2YWx1ZSBmb3Igdi1tb2RlbDogJyArIHZhbHVlKVxuICAgIH1cbiAgfVxuICB0aGlzLm9wdGlvbldhdGNoZXIgPSBuZXcgV2F0Y2hlcihcbiAgICB0aGlzLnZtLFxuICAgIGRlc2NyaXB0b3IuZXhwcmVzc2lvbixcbiAgICBvcHRpb25VcGRhdGVXYXRjaGVyLFxuICAgIHtcbiAgICAgIGRlZXA6IHRydWUsXG4gICAgICBmaWx0ZXJzOiBfLnJlc29sdmVGaWx0ZXJzKHRoaXMudm0sIGRlc2NyaXB0b3IuZmlsdGVycylcbiAgICB9XG4gIClcbiAgLy8gdXBkYXRlIHdpdGggaW5pdGlhbCB2YWx1ZVxuICBvcHRpb25VcGRhdGVXYXRjaGVyKHRoaXMub3B0aW9uV2F0Y2hlci52YWx1ZSlcbn1cblxuLyoqXG4gKiBCdWlsZCB1cCBvcHRpb24gZWxlbWVudHMuIElFOSBkb2Vzbid0IGNyZWF0ZSBvcHRpb25zXG4gKiB3aGVuIHNldHRpbmcgaW5uZXJIVE1MIG9uIDxzZWxlY3Q+IGVsZW1lbnRzLCBzbyB3ZSBoYXZlXG4gKiB0byB1c2UgRE9NIEFQSSBoZXJlLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gcGFyZW50IC0gYSA8c2VsZWN0PiBvciBhbiA8b3B0Z3JvdXA+XG4gKiBAcGFyYW0ge0FycmF5fSBvcHRpb25zXG4gKi9cblxuZnVuY3Rpb24gYnVpbGRPcHRpb25zIChwYXJlbnQsIG9wdGlvbnMpIHtcbiAgdmFyIG9wLCBlbFxuICBmb3IgKHZhciBpID0gMCwgbCA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgb3AgPSBvcHRpb25zW2ldXG4gICAgaWYgKCFvcC5vcHRpb25zKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpXG4gICAgICBpZiAodHlwZW9mIG9wID09PSAnc3RyaW5nJykge1xuICAgICAgICBlbC50ZXh0ID0gZWwudmFsdWUgPSBvcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwudGV4dCA9IG9wLnRleHRcbiAgICAgICAgZWwudmFsdWUgPSBvcC52YWx1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGdyb3VwJylcbiAgICAgIGVsLmxhYmVsID0gb3AubGFiZWxcbiAgICAgIGJ1aWxkT3B0aW9ucyhlbCwgb3Aub3B0aW9ucylcbiAgICB9XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGVsKVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgdGhlIGluaXRpYWwgdmFsdWUgZm9yIHNlbGVjdGVkIG9wdGlvbnMuXG4gKi9cblxuZnVuY3Rpb24gY2hlY2tJbml0aWFsVmFsdWUgKCkge1xuICB2YXIgaW5pdFZhbHVlXG4gIHZhciBvcHRpb25zID0gdGhpcy5lbC5vcHRpb25zXG4gIGZvciAodmFyIGkgPSAwLCBsID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAob3B0aW9uc1tpXS5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIChpbml0VmFsdWUgfHwgKGluaXRWYWx1ZSA9IFtdKSlcbiAgICAgICAgICAucHVzaChvcHRpb25zW2ldLnZhbHVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdFZhbHVlID0gb3B0aW9uc1tpXS52YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIGluaXRWYWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLl9pbml0VmFsdWUgPSB0aGlzLm51bWJlclxuICAgICAgPyBfLnRvTnVtYmVyKGluaXRWYWx1ZSlcbiAgICAgIDogaW5pdFZhbHVlXG4gIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgdG8gZXh0cmFjdCBhIHZhbHVlIGFycmF5IGZvciBzZWxlY3RbbXVsdGlwbGVdXG4gKlxuICogQHBhcmFtIHtTZWxlY3RFbGVtZW50fSBlbFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gZ2V0TXVsdGlWYWx1ZSAoZWwpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXJcbiAgICAuY2FsbChlbC5vcHRpb25zLCBmaWx0ZXJTZWxlY3RlZClcbiAgICAubWFwKGdldE9wdGlvblZhbHVlKVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJTZWxlY3RlZCAob3ApIHtcbiAgcmV0dXJuIG9wLnNlbGVjdGVkXG59XG5cbmZ1bmN0aW9uIGdldE9wdGlvblZhbHVlIChvcCkge1xuICByZXR1cm4gb3AudmFsdWUgfHwgb3AudGV4dFxufVxuXG4vKipcbiAqIE5hdGl2ZSBBcnJheS5pbmRleE9mIHVzZXMgc3RyaWN0IGVxdWFsLCBidXQgaW4gdGhpc1xuICogY2FzZSB3ZSBuZWVkIHRvIG1hdGNoIHN0cmluZy9udW1iZXJzIHdpdGggc29mdCBlcXVhbC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZnVuY3Rpb24gaW5kZXhPZiAoYXJyLCB2YWwpIHtcbiAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgdmFyIGkgPSBhcnIubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAoYXJyW2ldID09IHZhbCkgcmV0dXJuIGlcbiAgfVxuICByZXR1cm4gLTFcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBhY2NlcHRTdGF0ZW1lbnQ6IHRydWUsXG4gIHByaW9yaXR5OiA3MDAsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGRlYWwgd2l0aCBpZnJhbWVzXG4gICAgaWYgKFxuICAgICAgdGhpcy5lbC50YWdOYW1lID09PSAnSUZSQU1FJyAmJlxuICAgICAgdGhpcy5hcmcgIT09ICdsb2FkJ1xuICAgICkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICB0aGlzLmlmcmFtZUJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF8ub24oc2VsZi5lbC5jb250ZW50V2luZG93LCBzZWxmLmFyZywgc2VsZi5oYW5kbGVyKVxuICAgICAgfVxuICAgICAgXy5vbih0aGlzLmVsLCAnbG9hZCcsIHRoaXMuaWZyYW1lQmluZClcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRGlyZWN0aXZlIFwidi1vbjonICsgdGhpcy5leHByZXNzaW9uICsgJ1wiICcgK1xuICAgICAgICAnZXhwZWN0cyBhIGZ1bmN0aW9uIHZhbHVlLidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnJlc2V0KClcbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdGhpcy5oYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUudGFyZ2V0Vk0gPSB2bVxuICAgICAgdm0uJGV2ZW50ID0gZVxuICAgICAgdmFyIHJlcyA9IGhhbmRsZXIoZSlcbiAgICAgIHZtLiRldmVudCA9IG51bGxcbiAgICAgIHJldHVybiByZXNcbiAgICB9XG4gICAgaWYgKHRoaXMuaWZyYW1lQmluZCkge1xuICAgICAgdGhpcy5pZnJhbWVCaW5kKClcbiAgICB9IGVsc2Uge1xuICAgICAgXy5vbih0aGlzLmVsLCB0aGlzLmFyZywgdGhpcy5oYW5kbGVyKVxuICAgIH1cbiAgfSxcblxuICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuaWZyYW1lQmluZFxuICAgICAgPyB0aGlzLmVsLmNvbnRlbnRXaW5kb3dcbiAgICAgIDogdGhpcy5lbFxuICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgIF8ub2ZmKGVsLCB0aGlzLmFyZywgdGhpcy5oYW5kbGVyKVxuICAgIH1cbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlc2V0KClcbiAgICBfLm9mZih0aGlzLmVsLCAnbG9hZCcsIHRoaXMuaWZyYW1lQmluZClcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcbnZhciB2SWYgPSByZXF1aXJlKCcuL2lmJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgaXNMaXRlcmFsOiB0cnVlLFxuXG4gIC8vIHNhbWUgbG9naWMgcmV1c2UgZnJvbSB2LWlmXG4gIGNvbXBpbGU6IHZJZi5jb21waWxlLFxuICB0ZWFyZG93bjogdklmLnRlYXJkb3duLFxuICB1bmJpbmQ6IHZJZi51bmJpbmQsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1wYXJ0aWFsLXN0YXJ0JylcbiAgICB0aGlzLmVuZCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtcGFydGlhbC1lbmQnKVxuICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gOCkge1xuICAgICAgZWwuaW5uZXJIVE1MID0gJydcbiAgICB9XG4gICAgaWYgKGVsLnRhZ05hbWUgPT09ICdURU1QTEFURScgfHwgZWwubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgIF8ucmVwbGFjZShlbCwgdGhpcy5lbmQpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKHRoaXMuZW5kKVxuICAgIH1cbiAgICBfLmJlZm9yZSh0aGlzLnN0YXJ0LCB0aGlzLmVuZClcbiAgICBpZiAoIXRoaXMuX2lzRHluYW1pY0xpdGVyYWwpIHtcbiAgICAgIHRoaXMuaW5zZXJ0KHRoaXMuZXhwcmVzc2lvbilcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB0aGlzLnRlYXJkb3duKClcbiAgICB0aGlzLmluc2VydChpZClcbiAgfSxcblxuICBpbnNlcnQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBwYXJ0aWFsID0gdGhpcy52bS4kb3B0aW9ucy5wYXJ0aWFsc1tpZF1cbiAgICBfLmFzc2VydEFzc2V0KHBhcnRpYWwsICdwYXJ0aWFsJywgaWQpXG4gICAgaWYgKHBhcnRpYWwpIHtcbiAgICAgIHRoaXMuY29tcGlsZSh0ZW1wbGF0ZVBhcnNlci5wYXJzZShwYXJ0aWFsLCB0cnVlKSlcbiAgICB9XG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZtID0gdGhpcy5lbC5fX3Z1ZV9fXG4gICAgaWYgKCF2bSkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAndi1yZWYgc2hvdWxkIG9ubHkgYmUgdXNlZCBvbiBhIGNvbXBvbmVudCByb290IGVsZW1lbnQuJ1xuICAgICAgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIElmIHdlIGdldCBoZXJlLCBpdCBtZWFucyB0aGlzIGlzIGEgYHYtcmVmYCBvbiBhXG4gICAgLy8gY2hpbGQsIGJlY2F1c2UgcGFyZW50IHNjb3BlIGB2LXJlZmAgaXMgc3RyaXBwZWQgaW5cbiAgICAvLyBgdi1jb21wb25lbnRgIGFscmVhZHkuIFNvIHdlIGp1c3QgcmVjb3JkIG91ciBvd24gcmVmXG4gICAgLy8gaGVyZSAtIGl0IHdpbGwgb3ZlcndyaXRlIHBhcmVudCByZWYgaW4gYHYtY29tcG9uZW50YCxcbiAgICAvLyBpZiBhbnkuXG4gICAgdm0uX3JlZklEID0gdGhpcy5leHByZXNzaW9uXG4gIH1cbiAgXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBpc09iamVjdCA9IF8uaXNPYmplY3RcbnZhciBpc1BsYWluT2JqZWN0ID0gXy5pc1BsYWluT2JqZWN0XG52YXIgdGV4dFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGV4dCcpXG52YXIgZXhwUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9leHByZXNzaW9uJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxudmFyIGNvbXBpbGUgPSByZXF1aXJlKCcuLi9jb21waWxlci9jb21waWxlJylcbnZhciB0cmFuc2NsdWRlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvdHJhbnNjbHVkZScpXG52YXIgbWVyZ2VPcHRpb25zID0gcmVxdWlyZSgnLi4vdXRpbC9tZXJnZS1vcHRpb24nKVxudmFyIHVpZCA9IDBcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIFNldHVwLlxuICAgKi9cblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdWlkIGFzIGEgY2FjaGUgaWRlbnRpZmllclxuICAgIHRoaXMuaWQgPSAnX192X3JlcGVhdF8nICsgKCsrdWlkKVxuICAgIC8vIHdlIG5lZWQgdG8gaW5zZXJ0IHRoZSBvYmpUb0FycmF5IGNvbnZlcnRlclxuICAgIC8vIGFzIHRoZSBmaXJzdCByZWFkIGZpbHRlciwgYmVjYXVzZSBpdCBoYXMgdG8gYmUgaW52b2tlZFxuICAgIC8vIGJlZm9yZSBhbnkgdXNlciBmaWx0ZXJzLiAoY2FuJ3QgZG8gaXQgaW4gYHVwZGF0ZWApXG4gICAgaWYgKCF0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuZmlsdGVycyA9IHt9XG4gICAgfVxuICAgIC8vIGFkZCB0aGUgb2JqZWN0IC0+IGFycmF5IGNvbnZlcnQgZmlsdGVyXG4gICAgdmFyIG9iamVjdENvbnZlcnRlciA9IF8uYmluZChvYmpUb0FycmF5LCB0aGlzKVxuICAgIGlmICghdGhpcy5maWx0ZXJzLnJlYWQpIHtcbiAgICAgIHRoaXMuZmlsdGVycy5yZWFkID0gW29iamVjdENvbnZlcnRlcl1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maWx0ZXJzLnJlYWQudW5zaGlmdChvYmplY3RDb252ZXJ0ZXIpXG4gICAgfVxuICAgIC8vIHNldHVwIHJlZiBub2RlXG4gICAgdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXJlcGVhdCcpXG4gICAgXy5yZXBsYWNlKHRoaXMuZWwsIHRoaXMucmVmKVxuICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBibG9jayByZXBlYXRcbiAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5lbC50YWdOYW1lID09PSAnVEVNUExBVEUnXG4gICAgICA/IHRlbXBsYXRlUGFyc2VyLnBhcnNlKHRoaXMuZWwsIHRydWUpXG4gICAgICA6IHRoaXMuZWxcbiAgICAvLyBjaGVjayBvdGhlciBkaXJlY3RpdmVzIHRoYXQgbmVlZCB0byBiZSBoYW5kbGVkXG4gICAgLy8gYXQgdi1yZXBlYXQgbGV2ZWxcbiAgICB0aGlzLmNoZWNrSWYoKVxuICAgIHRoaXMuY2hlY2tSZWYoKVxuICAgIHRoaXMuY2hlY2tDb21wb25lbnQoKVxuICAgIC8vIGNoZWNrIGZvciB0cmFja2J5IHBhcmFtXG4gICAgdGhpcy5pZEtleSA9XG4gICAgICB0aGlzLl9jaGVja1BhcmFtKCd0cmFjay1ieScpIHx8XG4gICAgICB0aGlzLl9jaGVja1BhcmFtKCd0cmFja2J5JykgLy8gMC4xMS4wIGNvbXBhdFxuICAgIHRoaXMuY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIH0sXG5cbiAgLyoqXG4gICAqIFdhcm4gYWdhaW5zdCB2LWlmIHVzYWdlLlxuICAgKi9cblxuICBjaGVja0lmOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKF8uYXR0cih0aGlzLmVsLCAnaWYnKSAhPT0gbnVsbCkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRG9uXFwndCB1c2Ugdi1pZiB3aXRoIHYtcmVwZWF0LiAnICtcbiAgICAgICAgJ1VzZSB2LXNob3cgb3IgdGhlIFwiZmlsdGVyQnlcIiBmaWx0ZXIgaW5zdGVhZC4nXG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB2LXJlZi8gdi1lbCBpcyBhbHNvIHByZXNlbnQuXG4gICAqL1xuXG4gIGNoZWNrUmVmOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlZklEID0gXy5hdHRyKHRoaXMuZWwsICdyZWYnKVxuICAgIHRoaXMucmVmSUQgPSByZWZJRFxuICAgICAgPyB0aGlzLnZtLiRpbnRlcnBvbGF0ZShyZWZJRClcbiAgICAgIDogbnVsbFxuICAgIHZhciBlbElkID0gXy5hdHRyKHRoaXMuZWwsICdlbCcpXG4gICAgdGhpcy5lbElkID0gZWxJZFxuICAgICAgPyB0aGlzLnZtLiRpbnRlcnBvbGF0ZShlbElkKVxuICAgICAgOiBudWxsXG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb21wb25lbnQgY29uc3RydWN0b3IgdG8gdXNlIGZvciByZXBlYXRlZFxuICAgKiBpbnN0YW5jZXMuIElmIHN0YXRpYyB3ZSByZXNvbHZlIGl0IG5vdywgb3RoZXJ3aXNlIGl0XG4gICAqIG5lZWRzIHRvIGJlIHJlc29sdmVkIGF0IGJ1aWxkIHRpbWUgd2l0aCBhY3R1YWwgZGF0YS5cbiAgICovXG5cbiAgY2hlY2tDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaWQgPSBfLmF0dHIodGhpcy5lbCwgJ2NvbXBvbmVudCcpXG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLnZtLiRvcHRpb25zXG4gICAgaWYgKCFpZCkge1xuICAgICAgLy8gZGVmYXVsdCBjb25zdHJ1Y3RvclxuICAgICAgdGhpcy5DdG9yID0gXy5WdWVcbiAgICAgIC8vIGlubGluZSByZXBlYXRzIHNob3VsZCBpbmhlcml0XG4gICAgICB0aGlzLmluaGVyaXQgPSB0cnVlXG4gICAgICAvLyBpbXBvcnRhbnQ6IHRyYW5zY2x1ZGUgd2l0aCBubyBvcHRpb25zLCBqdXN0XG4gICAgICAvLyB0byBlbnN1cmUgYmxvY2sgc3RhcnQgYW5kIGJsb2NrIGVuZFxuICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRyYW5zY2x1ZGUodGhpcy50ZW1wbGF0ZSlcbiAgICAgIHRoaXMuX2xpbmtGbiA9IGNvbXBpbGUodGhpcy50ZW1wbGF0ZSwgb3B0aW9ucylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hc0NvbXBvbmVudCA9IHRydWVcbiAgICAgIC8vIGNoZWNrIGlubGluZS10ZW1wbGF0ZVxuICAgICAgaWYgKHRoaXMuX2NoZWNrUGFyYW0oJ2lubGluZS10ZW1wbGF0ZScpICE9PSBudWxsKSB7XG4gICAgICAgIC8vIGV4dHJhY3QgaW5saW5lIHRlbXBsYXRlIGFzIGEgRG9jdW1lbnRGcmFnbWVudFxuICAgICAgICB0aGlzLmlubGluZVRlbXBhbHRlID0gXy5leHRyYWN0Q29udGVudCh0aGlzLmVsLCB0cnVlKVxuICAgICAgfVxuICAgICAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UoaWQpXG4gICAgICBpZiAoIXRva2VucykgeyAvLyBzdGF0aWMgY29tcG9uZW50XG4gICAgICAgIHZhciBDdG9yID0gdGhpcy5DdG9yID0gb3B0aW9ucy5jb21wb25lbnRzW2lkXVxuICAgICAgICBfLmFzc2VydEFzc2V0KEN0b3IsICdjb21wb25lbnQnLCBpZClcbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyBwYXJlbnQgc2NvcGUgZGlyZWN0aXZlcyBhbmQgbm9cbiAgICAgICAgLy8gY29udGVudCB0byBiZSB0cmFuc2NsdWRlZCwgd2UgY2FuIG9wdGltaXplIHRoZVxuICAgICAgICAvLyByZW5kZXJpbmcgYnkgcHJlLXRyYW5zY2x1ZGluZyArIGNvbXBpbGluZyBoZXJlXG4gICAgICAgIC8vIGFuZCBwcm92aWRlIGEgbGluayBmdW5jdGlvbiB0byBldmVyeSBpbnN0YW5jZS5cbiAgICAgICAgaWYgKCF0aGlzLmVsLmhhc0NoaWxkTm9kZXMoKSAmJlxuICAgICAgICAgICAgIXRoaXMuZWwuaGFzQXR0cmlidXRlcygpKSB7XG4gICAgICAgICAgLy8gbWVyZ2UgYW4gZW1wdHkgb2JqZWN0IHdpdGggb3duZXIgdm0gYXMgcGFyZW50XG4gICAgICAgICAgLy8gc28gY2hpbGQgdm1zIGNhbiBhY2Nlc3MgcGFyZW50IGFzc2V0cy5cbiAgICAgICAgICB2YXIgbWVyZ2VkID0gbWVyZ2VPcHRpb25zKEN0b3Iub3B0aW9ucywge30sIHtcbiAgICAgICAgICAgICRwYXJlbnQ6IHRoaXMudm1cbiAgICAgICAgICB9KVxuICAgICAgICAgIG1lcmdlZC50ZW1wbGF0ZSA9IHRoaXMuaW5saW5lVGVtcGFsdGUgfHwgbWVyZ2VkLnRlbXBsYXRlXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRyYW5zY2x1ZGUodGhpcy50ZW1wbGF0ZSwgbWVyZ2VkKVxuICAgICAgICAgIHRoaXMuX2xpbmtGbiA9IGNvbXBpbGUodGhpcy50ZW1wbGF0ZSwgbWVyZ2VkLCBmYWxzZSwgdHJ1ZSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdG8gYmUgcmVzb2x2ZWQgbGF0ZXJcbiAgICAgICAgdmFyIGN0b3JFeHAgPSB0ZXh0UGFyc2VyLnRva2Vuc1RvRXhwKHRva2VucylcbiAgICAgICAgdGhpcy5jdG9yR2V0dGVyID0gZXhwUGFyc2VyLnBhcnNlKGN0b3JFeHApLmdldFxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlLlxuICAgKiBUaGlzIGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgQXJyYXkgbXV0YXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheXxOdW1iZXJ8U3RyaW5nfSBkYXRhXG4gICAqL1xuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCBbXVxuICAgIHZhciB0eXBlID0gdHlwZW9mIGRhdGFcbiAgICBpZiAodHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGRhdGEgPSByYW5nZShkYXRhKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRhdGEgPSBfLnRvQXJyYXkoZGF0YSlcbiAgICB9XG4gICAgdGhpcy52bXMgPSB0aGlzLmRpZmYoZGF0YSwgdGhpcy52bXMpXG4gICAgLy8gdXBkYXRlIHYtcmVmXG4gICAgaWYgKHRoaXMucmVmSUQpIHtcbiAgICAgIHRoaXMudm0uJFt0aGlzLnJlZklEXSA9IHRoaXMudm1zXG4gICAgfVxuICAgIGlmICh0aGlzLmVsSWQpIHtcbiAgICAgIHRoaXMudm0uJCRbdGhpcy5lbElkXSA9IHRoaXMudm1zLm1hcChmdW5jdGlvbiAodm0pIHtcbiAgICAgICAgcmV0dXJuIHZtLiRlbFxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIERpZmYsIGJhc2VkIG9uIG5ldyBkYXRhIGFuZCBvbGQgZGF0YSwgZGV0ZXJtaW5lIHRoZVxuICAgKiBtaW5pbXVtIGFtb3VudCBvZiBET00gbWFuaXB1bGF0aW9ucyBuZWVkZWQgdG8gbWFrZSB0aGVcbiAgICogRE9NIHJlZmxlY3QgdGhlIG5ldyBkYXRhIEFycmF5LlxuICAgKlxuICAgKiBUaGUgYWxnb3JpdGhtIGRpZmZzIHRoZSBuZXcgZGF0YSBBcnJheSBieSBzdG9yaW5nIGFcbiAgICogaGlkZGVuIHJlZmVyZW5jZSB0byBhbiBvd25lciB2bSBpbnN0YW5jZSBvbiBwcmV2aW91c2x5XG4gICAqIHNlZW4gZGF0YS4gVGhpcyBhbGxvd3MgdXMgdG8gYWNoaWV2ZSBPKG4pIHdoaWNoIGlzXG4gICAqIGJldHRlciB0aGFuIGEgbGV2ZW5zaHRlaW4gZGlzdGFuY2UgYmFzZWQgYWxnb3JpdGhtLFxuICAgKiB3aGljaCBpcyBPKG0gKiBuKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YVxuICAgKiBAcGFyYW0ge0FycmF5fSBvbGRWbXNcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuXG4gIGRpZmY6IGZ1bmN0aW9uIChkYXRhLCBvbGRWbXMpIHtcbiAgICB2YXIgaWRLZXkgPSB0aGlzLmlkS2V5XG4gICAgdmFyIGNvbnZlcnRlZCA9IHRoaXMuY29udmVydGVkXG4gICAgdmFyIHJlZiA9IHRoaXMucmVmXG4gICAgdmFyIGFsaWFzID0gdGhpcy5hcmdcbiAgICB2YXIgaW5pdCA9ICFvbGRWbXNcbiAgICB2YXIgdm1zID0gbmV3IEFycmF5KGRhdGEubGVuZ3RoKVxuICAgIHZhciBvYmosIHJhdywgdm0sIGksIGxcbiAgICAvLyBGaXJzdCBwYXNzLCBnbyB0aHJvdWdoIHRoZSBuZXcgQXJyYXkgYW5kIGZpbGwgdXBcbiAgICAvLyB0aGUgbmV3IHZtcyBhcnJheS4gSWYgYSBwaWVjZSBvZiBkYXRhIGhhcyBhIGNhY2hlZFxuICAgIC8vIGluc3RhbmNlIGZvciBpdCwgd2UgcmV1c2UgaXQuIE90aGVyd2lzZSBidWlsZCBhIG5ld1xuICAgIC8vIGluc3RhbmNlLlxuICAgIGZvciAoaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgb2JqID0gZGF0YVtpXVxuICAgICAgcmF3ID0gY29udmVydGVkID8gb2JqLiR2YWx1ZSA6IG9ialxuICAgICAgdm0gPSAhaW5pdCAmJiB0aGlzLmdldFZtKHJhdylcbiAgICAgIGlmICh2bSkgeyAvLyByZXVzYWJsZSBpbnN0YW5jZVxuICAgICAgICB2bS5fcmV1c2VkID0gdHJ1ZVxuICAgICAgICB2bS4kaW5kZXggPSBpIC8vIHVwZGF0ZSAkaW5kZXhcbiAgICAgICAgaWYgKGNvbnZlcnRlZCkge1xuICAgICAgICAgIHZtLiRrZXkgPSBvYmouJGtleSAvLyB1cGRhdGUgJGtleVxuICAgICAgICB9XG4gICAgICAgIGlmIChpZEtleSkgeyAvLyBzd2FwIHRyYWNrIGJ5IGlkIGRhdGFcbiAgICAgICAgICBpZiAoYWxpYXMpIHtcbiAgICAgICAgICAgIHZtW2FsaWFzXSA9IHJhd1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5fc2V0RGF0YShyYXcpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBuZXcgaW5zdGFuY2VcbiAgICAgICAgdm0gPSB0aGlzLmJ1aWxkKG9iaiwgaSwgdHJ1ZSlcbiAgICAgICAgdm0uX25ldyA9IHRydWVcbiAgICAgICAgdm0uX3JldXNlZCA9IGZhbHNlXG4gICAgICB9XG4gICAgICB2bXNbaV0gPSB2bVxuICAgICAgLy8gaW5zZXJ0IGlmIHRoaXMgaXMgZmlyc3QgcnVuXG4gICAgICBpZiAoaW5pdCkge1xuICAgICAgICB2bS4kYmVmb3JlKHJlZilcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gaWYgdGhpcyBpcyB0aGUgZmlyc3QgcnVuLCB3ZSdyZSBkb25lLlxuICAgIGlmIChpbml0KSB7XG4gICAgICByZXR1cm4gdm1zXG4gICAgfVxuICAgIC8vIFNlY29uZCBwYXNzLCBnbyB0aHJvdWdoIHRoZSBvbGQgdm0gaW5zdGFuY2VzIGFuZFxuICAgIC8vIGRlc3Ryb3kgdGhvc2Ugd2hvIGFyZSBub3QgcmV1c2VkIChhbmQgcmVtb3ZlIHRoZW1cbiAgICAvLyBmcm9tIGNhY2hlKVxuICAgIGZvciAoaSA9IDAsIGwgPSBvbGRWbXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2bSA9IG9sZFZtc1tpXVxuICAgICAgaWYgKCF2bS5fcmV1c2VkKSB7XG4gICAgICAgIHRoaXMudW5jYWNoZVZtKHZtKVxuICAgICAgICB2bS4kZGVzdHJveSh0cnVlKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBmaW5hbCBwYXNzLCBtb3ZlL2luc2VydCBuZXcgaW5zdGFuY2VzIGludG8gdGhlXG4gICAgLy8gcmlnaHQgcGxhY2UuIFdlJ3JlIGdvaW5nIGluIHJldmVyc2UgaGVyZSBiZWNhdXNlXG4gICAgLy8gaW5zZXJ0QmVmb3JlIHJlbGllcyBvbiB0aGUgbmV4dCBzaWJsaW5nIHRvIGJlXG4gICAgLy8gcmVzb2x2ZWQuXG4gICAgdmFyIHRhcmdldE5leHQsIGN1cnJlbnROZXh0XG4gICAgaSA9IHZtcy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB2bSA9IHZtc1tpXVxuICAgICAgLy8gdGhpcyBpcyB0aGUgdm0gdGhhdCB3ZSBzaG91bGQgYmUgaW4gZnJvbnQgb2ZcbiAgICAgIHRhcmdldE5leHQgPSB2bXNbaSArIDFdXG4gICAgICBpZiAoIXRhcmdldE5leHQpIHtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgbGFzdCBpdGVtLiBJZiBpdCdzIHJldXNlZCB0aGVuXG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgZWxzZSB3aWxsIGV2ZW50dWFsbHkgYmUgaW4gdGhlIHJpZ2h0XG4gICAgICAgIC8vIHBsYWNlLCBzbyBubyBuZWVkIHRvIHRvdWNoIGl0LiBPdGhlcndpc2UsIGluc2VydFxuICAgICAgICAvLyBpdC5cbiAgICAgICAgaWYgKCF2bS5fcmV1c2VkKSB7XG4gICAgICAgICAgdm0uJGJlZm9yZShyZWYpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0byBpbnNlcnQgYmVmb3JlIHRoZSBjb21tZW50IG5vZGUgaWZcbiAgICAgICAgLy8gdGhlIHZtcyBhcmUgYmxvY2sgaW5zdGFuY2VzXG4gICAgICAgIHZhciBuZXh0RWwgPSB0YXJnZXROZXh0Ll9ibG9ja1N0YXJ0IHx8IHRhcmdldE5leHQuJGVsXG4gICAgICAgIGlmICh2bS5fcmV1c2VkKSB7XG4gICAgICAgICAgLy8gdGhpcyBpcyB0aGUgdm0gd2UgYXJlIGFjdHVhbGx5IGluIGZyb250IG9mXG4gICAgICAgICAgY3VycmVudE5leHQgPSBmaW5kTmV4dFZtKHZtLCByZWYpXG4gICAgICAgICAgLy8gd2Ugb25seSBuZWVkIHRvIG1vdmUgaWYgd2UgYXJlIG5vdCBpbiB0aGUgcmlnaHRcbiAgICAgICAgICAvLyBwbGFjZSBhbHJlYWR5LlxuICAgICAgICAgIGlmIChjdXJyZW50TmV4dCAhPT0gdGFyZ2V0TmV4dCkge1xuICAgICAgICAgICAgdm0uJGJlZm9yZShuZXh0RWwsIG51bGwsIGZhbHNlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBuZXcgaW5zdGFuY2UsIGluc2VydCB0byBleGlzdGluZyBuZXh0XG4gICAgICAgICAgdm0uJGJlZm9yZShuZXh0RWwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZtLl9uZXcgPSBmYWxzZVxuICAgICAgdm0uX3JldXNlZCA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB2bXNcbiAgfSxcblxuICAvKipcbiAgICogQnVpbGQgYSBuZXcgaW5zdGFuY2UgYW5kIGNhY2hlIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAgICogQHBhcmFtIHtCb29sZWFufSBuZWVkQ2FjaGVcbiAgICovXG5cbiAgYnVpbGQ6IGZ1bmN0aW9uIChkYXRhLCBpbmRleCwgbmVlZENhY2hlKSB7XG4gICAgdmFyIG9yaWdpbmFsID0gZGF0YVxuICAgIHZhciBtZXRhID0geyAkaW5kZXg6IGluZGV4IH1cbiAgICBpZiAodGhpcy5jb252ZXJ0ZWQpIHtcbiAgICAgIG1ldGEuJGtleSA9IG9yaWdpbmFsLiRrZXlcbiAgICB9XG4gICAgdmFyIHJhdyA9IHRoaXMuY29udmVydGVkID8gZGF0YS4kdmFsdWUgOiBkYXRhXG4gICAgdmFyIGFsaWFzID0gdGhpcy5hcmdcbiAgICB2YXIgaGFzQWxpYXMgPSAhaXNPYmplY3QocmF3KSB8fCAhaXNQbGFpbk9iamVjdChkYXRhKSB8fCBhbGlhc1xuICAgIC8vIHdyYXAgdGhlIHJhdyBkYXRhIHdpdGggYWxpYXNcbiAgICBkYXRhID0gaGFzQWxpYXMgPyB7fSA6IHJhd1xuICAgIGlmIChhbGlhcykge1xuICAgICAgZGF0YVthbGlhc10gPSByYXdcbiAgICB9IGVsc2UgaWYgKGhhc0FsaWFzKSB7XG4gICAgICBtZXRhLiR2YWx1ZSA9IHJhd1xuICAgIH1cbiAgICAvLyByZXNvbHZlIGNvbnN0cnVjdG9yXG4gICAgdmFyIEN0b3IgPSB0aGlzLkN0b3IgfHwgdGhpcy5yZXNvbHZlQ3RvcihkYXRhLCBtZXRhKVxuICAgIHZhciB2bSA9IHRoaXMudm0uJGFkZENoaWxkKHtcbiAgICAgIGVsOiB0ZW1wbGF0ZVBhcnNlci5jbG9uZSh0aGlzLnRlbXBsYXRlKSxcbiAgICAgIF9hc0NvbXBvbmVudDogdGhpcy5hc0NvbXBvbmVudCxcbiAgICAgIF9saW5rRm46IHRoaXMuX2xpbmtGbixcbiAgICAgIF9tZXRhOiBtZXRhLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIGluaGVyaXQ6IHRoaXMuaW5oZXJpdCxcbiAgICAgIHRlbXBsYXRlOiB0aGlzLmlubGluZVRlbXBhbHRlXG4gICAgfSwgQ3RvcilcbiAgICAvLyBmbGFnIHRoaXMgaW5zdGFuY2UgYXMgYSByZXBlYXQgaW5zdGFuY2VcbiAgICAvLyBzbyB0aGF0IHdlIGNhbiBza2lwIGl0IGluIHZtLl9kaWdlc3RcbiAgICB2bS5fcmVwZWF0ID0gdHJ1ZVxuICAgIC8vIGNhY2hlIGluc3RhbmNlXG4gICAgaWYgKG5lZWRDYWNoZSkge1xuICAgICAgdGhpcy5jYWNoZVZtKHJhdywgdm0pXG4gICAgfVxuICAgIC8vIHN5bmMgYmFjayBjaGFuZ2VzIGZvciAkdmFsdWUsIHBhcnRpY3VsYXJseSBmb3JcbiAgICAvLyB0d28td2F5IGJpbmRpbmdzIG9mIHByaW1pdGl2ZSB2YWx1ZXNcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2bS4kd2F0Y2goJyR2YWx1ZScsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIGlmIChzZWxmLmNvbnZlcnRlZCkge1xuICAgICAgICBzZWxmLnJhd1ZhbHVlW3ZtLiRrZXldID0gdmFsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnJhd1ZhbHVlLiRzZXQodm0uJGluZGV4LCB2YWwpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdm1cbiAgfSxcblxuICAvKipcbiAgICogUmVzb2x2ZSBhIGNvbnRydWN0b3IgdG8gdXNlIGZvciBhbiBpbnN0YW5jZS5cbiAgICogVGhlIHRyaWNreSBwYXJ0IGhlcmUgaXMgdGhhdCB0aGVyZSBjb3VsZCBiZSBkeW5hbWljXG4gICAqIGNvbXBvbmVudHMgZGVwZW5kaW5nIG9uIGluc3RhbmNlIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cblxuICByZXNvbHZlQ3RvcjogZnVuY3Rpb24gKGRhdGEsIG1ldGEpIHtcbiAgICAvLyBjcmVhdGUgYSB0ZW1wb3JhcnkgY29udGV4dCBvYmplY3QgYW5kIGNvcHkgZGF0YVxuICAgIC8vIGFuZCBtZXRhIHByb3BlcnRpZXMgb250byBpdC5cbiAgICAvLyB1c2UgXy5kZWZpbmUgdG8gYXZvaWQgYWNjaWRlbnRhbGx5IG92ZXJ3cml0aW5nIHNjb3BlXG4gICAgLy8gcHJvcGVydGllcy5cbiAgICB2YXIgY29udGV4dCA9IE9iamVjdC5jcmVhdGUodGhpcy52bSlcbiAgICB2YXIga2V5XG4gICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgXy5kZWZpbmUoY29udGV4dCwga2V5LCBkYXRhW2tleV0pXG4gICAgfVxuICAgIGZvciAoa2V5IGluIG1ldGEpIHtcbiAgICAgIF8uZGVmaW5lKGNvbnRleHQsIGtleSwgbWV0YVtrZXldKVxuICAgIH1cbiAgICB2YXIgaWQgPSB0aGlzLmN0b3JHZXR0ZXIuY2FsbChjb250ZXh0LCBjb250ZXh0KVxuICAgIHZhciBDdG9yID0gdGhpcy52bS4kb3B0aW9ucy5jb21wb25lbnRzW2lkXVxuICAgIF8uYXNzZXJ0QXNzZXQoQ3RvciwgJ2NvbXBvbmVudCcsIGlkKVxuICAgIHJldHVybiBDdG9yXG4gIH0sXG5cbiAgLyoqXG4gICAqIFVuYmluZCwgdGVhcmRvd24gZXZlcnl0aGluZ1xuICAgKi9cblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5yZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3RoaXMucmVmSURdID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy52bXMpIHtcbiAgICAgIHZhciBpID0gdGhpcy52bXMubGVuZ3RoXG4gICAgICB2YXIgdm1cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdm0gPSB0aGlzLnZtc1tpXVxuICAgICAgICB0aGlzLnVuY2FjaGVWbSh2bSlcbiAgICAgICAgdm0uJGRlc3Ryb3koKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2FjaGUgYSB2bSBpbnN0YW5jZSBiYXNlZCBvbiBpdHMgZGF0YS5cbiAgICpcbiAgICogSWYgdGhlIGRhdGEgaXMgYW4gb2JqZWN0LCB3ZSBzYXZlIHRoZSB2bSdzIHJlZmVyZW5jZSBvblxuICAgKiB0aGUgZGF0YSBvYmplY3QgYXMgYSBoaWRkZW4gcHJvcGVydHkuIE90aGVyd2lzZSB3ZVxuICAgKiBjYWNoZSB0aGVtIGluIGFuIG9iamVjdCBhbmQgZm9yIGVhY2ggcHJpbWl0aXZlIHZhbHVlXG4gICAqIHRoZXJlIGlzIGFuIGFycmF5IGluIGNhc2UgdGhlcmUgYXJlIGR1cGxpY2F0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7VnVlfSB2bVxuICAgKi9cblxuICBjYWNoZVZtOiBmdW5jdGlvbiAoZGF0YSwgdm0pIHtcbiAgICB2YXIgaWRLZXkgPSB0aGlzLmlkS2V5XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZVxuICAgIHZhciBpZFxuICAgIGlmIChpZEtleSkge1xuICAgICAgaWQgPSBkYXRhW2lkS2V5XVxuICAgICAgaWYgKCFjYWNoZVtpZF0pIHtcbiAgICAgICAgY2FjaGVbaWRdID0gdm1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8ud2FybignRHVwbGljYXRlIHRyYWNrLWJ5IGtleSBpbiB2LXJlcGVhdDogJyArIGlkKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIGlkID0gdGhpcy5pZFxuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgIGlmIChkYXRhW2lkXSA9PT0gbnVsbCkge1xuICAgICAgICAgIGRhdGFbaWRdID0gdm1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfLndhcm4oXG4gICAgICAgICAgICAnRHVwbGljYXRlIG9iamVjdHMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdi1yZXBlYXQgJyArXG4gICAgICAgICAgICAnd2hlbiB1c2luZyBjb21wb25lbnRzIG9yIHRyYW5zaXRpb25zLidcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8uZGVmaW5lKGRhdGEsIHRoaXMuaWQsIHZtKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNhY2hlW2RhdGFdKSB7XG4gICAgICAgIGNhY2hlW2RhdGFdID0gW3ZtXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FjaGVbZGF0YV0ucHVzaCh2bSlcbiAgICAgIH1cbiAgICB9XG4gICAgdm0uX3JhdyA9IGRhdGFcbiAgfSxcblxuICAvKipcbiAgICogVHJ5IHRvIGdldCBhIGNhY2hlZCBpbnN0YW5jZSBmcm9tIGEgcGllY2Ugb2YgZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHJldHVybiB7VnVlfHVuZGVmaW5lZH1cbiAgICovXG5cbiAgZ2V0Vm06IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKHRoaXMuaWRLZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlW2RhdGFbdGhpcy5pZEtleV1dXG4gICAgfSBlbHNlIGlmIChpc09iamVjdChkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGFbdGhpcy5pZF1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNhY2hlZCA9IHRoaXMuY2FjaGVbZGF0YV1cbiAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgdmFyIGkgPSAwXG4gICAgICAgIHZhciB2bSA9IGNhY2hlZFtpXVxuICAgICAgICAvLyBzaW5jZSBkdXBsaWNhdGVkIHZtIGluc3RhbmNlcyBtaWdodCBiZSBhIHJldXNlZFxuICAgICAgICAvLyBvbmUgT1IgYSBuZXdseSBjcmVhdGVkIG9uZSwgd2UgbmVlZCB0byByZXR1cm4gdGhlXG4gICAgICAgIC8vIGZpcnN0IGluc3RhbmNlIHRoYXQgaXMgbmVpdGhlciBvZiB0aGVzZS5cbiAgICAgICAgd2hpbGUgKHZtICYmICh2bS5fcmV1c2VkIHx8IHZtLl9uZXcpKSB7XG4gICAgICAgICAgdm0gPSBjYWNoZWRbKytpXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2bVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIGEgY2FjaGVkIHZtIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge1Z1ZX0gdm1cbiAgICovXG5cbiAgdW5jYWNoZVZtOiBmdW5jdGlvbiAodm0pIHtcbiAgICB2YXIgZGF0YSA9IHZtLl9yYXdcbiAgICBpZiAodGhpcy5pZEtleSkge1xuICAgICAgdGhpcy5jYWNoZVtkYXRhW3RoaXMuaWRLZXldXSA9IG51bGxcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBkYXRhW3RoaXMuaWRdID0gbnVsbFxuICAgICAgdm0uX3JhdyA9IG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYWNoZVtkYXRhXS5wb3AoKVxuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogSGVscGVyIHRvIGZpbmQgdGhlIG5leHQgZWxlbWVudCB0aGF0IGlzIGFuIGluc3RhbmNlXG4gKiByb290IG5vZGUuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYSBkZXN0cm95ZWQgdm0nc1xuICogZWxlbWVudCBjb3VsZCBzdGlsbCBiZSBsaW5nZXJpbmcgaW4gdGhlIERPTSBiZWZvcmUgaXRzXG4gKiBsZWF2aW5nIHRyYW5zaXRpb24gZmluaXNoZXMsIGJ1dCBpdHMgX192dWVfXyByZWZlcmVuY2VcbiAqIHNob3VsZCBoYXZlIGJlZW4gcmVtb3ZlZCBzbyB3ZSBjYW4gc2tpcCB0aGVtLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtDb21tZW50Tm9kZX0gcmVmXG4gKiBAcmV0dXJuIHtWdWV9XG4gKi9cblxuZnVuY3Rpb24gZmluZE5leHRWbSAodm0sIHJlZikge1xuICB2YXIgZWwgPSAodm0uX2Jsb2NrRW5kIHx8IHZtLiRlbCkubmV4dFNpYmxpbmdcbiAgd2hpbGUgKCFlbC5fX3Z1ZV9fICYmIGVsICE9PSByZWYpIHtcbiAgICBlbCA9IGVsLm5leHRTaWJsaW5nXG4gIH1cbiAgcmV0dXJuIGVsLl9fdnVlX19cbn1cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGNvbnZlcnQgbm9uLUFycmF5IG9iamVjdHMgdG8gYXJyYXkuXG4gKiBUaGlzIGlzIHRoZSBkZWZhdWx0IGZpbHRlciBpbnN0YWxsZWQgdG8gZXZlcnkgdi1yZXBlYXRcbiAqIGRpcmVjdGl2ZS5cbiAqXG4gKiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoICoqdGhlIGRpcmVjdGl2ZSoqIGFzIGB0aGlzYFxuICogY29udGV4dCBzbyB0aGF0IHdlIGNhbiBtYXJrIHRoZSByZXBlYXQgYXJyYXkgYXMgY29udmVydGVkXG4gKiBmcm9tIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG9ialRvQXJyYXkgKG9iaikge1xuICAvLyByZWdhcmRsZXNzIG9mIHR5cGUsIHN0b3JlIHRoZSB1bi1maWx0ZXJlZCByYXcgdmFsdWUuXG4gIHRoaXMucmF3VmFsdWUgPSBvYmpcbiAgaWYgKCFpc1BsYWluT2JqZWN0KG9iaikpIHtcbiAgICByZXR1cm4gb2JqXG4gIH1cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG4gIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgdmFyIHJlcyA9IG5ldyBBcnJheShpKVxuICB2YXIga2V5XG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgcmVzW2ldID0ge1xuICAgICAgJGtleToga2V5LFxuICAgICAgJHZhbHVlOiBvYmpba2V5XVxuICAgIH1cbiAgfVxuICAvLyBgdGhpc2AgcG9pbnRzIHRvIHRoZSByZXBlYXQgZGlyZWN0aXZlIGluc3RhbmNlXG4gIHRoaXMuY29udmVydGVkID0gdHJ1ZVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcmFuZ2UgYXJyYXkgZnJvbSBnaXZlbiBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIHJhbmdlIChuKSB7XG4gIHZhciBpID0gLTFcbiAgdmFyIHJldCA9IG5ldyBBcnJheShuKVxuICB3aGlsZSAoKytpIDwgbikge1xuICAgIHJldFtpXSA9IGlcbiAgfVxuICByZXR1cm4gcmV0XG59IiwidmFyIHRyYW5zaXRpb24gPSByZXF1aXJlKCcuLi90cmFuc2l0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIGVsID0gdGhpcy5lbFxuICB0cmFuc2l0aW9uLmFwcGx5KGVsLCB2YWx1ZSA/IDEgOiAtMSwgZnVuY3Rpb24gKCkge1xuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICcnIDogJ25vbmUnXG4gIH0sIHRoaXMudm0pXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnLW1vei0nLCAnLW1zLSddXG52YXIgY2FtZWxQcmVmaXhlcyA9IFsnV2Via2l0JywgJ01veicsICdtcyddXG52YXIgaW1wb3J0YW50UkUgPSAvIWltcG9ydGFudDs/JC9cbnZhciBjYW1lbFJFID0gLyhbYS16XSkoW0EtWl0pL2dcbnZhciB0ZXN0RWwgPSBudWxsXG52YXIgcHJvcENhY2hlID0ge31cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgZGVlcDogdHJ1ZSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmFyZykge1xuICAgICAgdGhpcy5zZXRQcm9wKHRoaXMuYXJnLCB2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gY2FjaGUgb2JqZWN0IHN0eWxlcyBzbyB0aGF0IG9ubHkgY2hhbmdlZCBwcm9wc1xuICAgICAgICAvLyBhcmUgYWN0dWFsbHkgdXBkYXRlZC5cbiAgICAgICAgaWYgKCF0aGlzLmNhY2hlKSB0aGlzLmNhY2hlID0ge31cbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiB2YWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0UHJvcChwcm9wLCB2YWx1ZVtwcm9wXSlcbiAgICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgICAgICAgIGlmICh2YWx1ZVtwcm9wXSAhPSB0aGlzLmNhY2hlW3Byb3BdKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlW3Byb3BdID0gdmFsdWVbcHJvcF1cbiAgICAgICAgICAgIHRoaXMuc2V0UHJvcChwcm9wLCB2YWx1ZVtwcm9wXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUuY3NzVGV4dCA9IHZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHNldFByb3A6IGZ1bmN0aW9uIChwcm9wLCB2YWx1ZSkge1xuICAgIHByb3AgPSBub3JtYWxpemUocHJvcClcbiAgICBpZiAoIXByb3ApIHJldHVybiAvLyB1bnN1cHBvcnRlZCBwcm9wXG4gICAgLy8gY2FzdCBwb3NzaWJsZSBudW1iZXJzL2Jvb2xlYW5zIGludG8gc3RyaW5nc1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB2YWx1ZSArPSAnJ1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdmFyIGlzSW1wb3J0YW50ID0gaW1wb3J0YW50UkUudGVzdCh2YWx1ZSlcbiAgICAgICAgPyAnaW1wb3J0YW50J1xuICAgICAgICA6ICcnXG4gICAgICBpZiAoaXNJbXBvcnRhbnQpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKGltcG9ydGFudFJFLCAnJykudHJpbSgpXG4gICAgICB9XG4gICAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KHByb3AsIHZhbHVlLCBpc0ltcG9ydGFudClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShwcm9wKVxuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogTm9ybWFsaXplIGEgQ1NTIHByb3BlcnR5IG5hbWUuXG4gKiAtIGNhY2hlIHJlc3VsdFxuICogLSBhdXRvIHByZWZpeFxuICogLSBjYW1lbENhc2UgLT4gZGFzaC1jYXNlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemUgKHByb3ApIHtcbiAgaWYgKHByb3BDYWNoZVtwcm9wXSkge1xuICAgIHJldHVybiBwcm9wQ2FjaGVbcHJvcF1cbiAgfVxuICB2YXIgcmVzID0gcHJlZml4KHByb3ApXG4gIHByb3BDYWNoZVtwcm9wXSA9IHByb3BDYWNoZVtyZXNdID0gcmVzXG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBBdXRvIGRldGVjdCB0aGUgYXBwcm9wcmlhdGUgcHJlZml4IGZvciBhIENTUyBwcm9wZXJ0eS5cbiAqIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC81MjM2OTJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHByZWZpeCAocHJvcCkge1xuICBwcm9wID0gcHJvcC5yZXBsYWNlKGNhbWVsUkUsICckMS0kMicpLnRvTG93ZXJDYXNlKClcbiAgdmFyIGNhbWVsID0gXy5jYW1lbGl6ZShwcm9wKVxuICB2YXIgdXBwZXIgPSBjYW1lbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNhbWVsLnNsaWNlKDEpXG4gIGlmICghdGVzdEVsKSB7XG4gICAgdGVzdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgfVxuICBpZiAoY2FtZWwgaW4gdGVzdEVsLnN0eWxlKSB7XG4gICAgcmV0dXJuIHByb3BcbiAgfVxuICB2YXIgaSA9IHByZWZpeGVzLmxlbmd0aFxuICB2YXIgcHJlZml4ZWRcbiAgd2hpbGUgKGktLSkge1xuICAgIHByZWZpeGVkID0gY2FtZWxQcmVmaXhlc1tpXSArIHVwcGVyXG4gICAgaWYgKHByZWZpeGVkIGluIHRlc3RFbC5zdHlsZSkge1xuICAgICAgcmV0dXJuIHByZWZpeGVzW2ldICsgcHJvcFxuICAgIH1cbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmF0dHIgPSB0aGlzLmVsLm5vZGVUeXBlID09PSAzXG4gICAgICA/ICdub2RlVmFsdWUnXG4gICAgICA6ICd0ZXh0Q29udGVudCdcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuZWxbdGhpcy5hdHRyXSA9IF8udG9TdHJpbmcodmFsdWUpXG4gIH1cbiAgXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgcHJpb3JpdHk6IDEwMDAsXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5lbC5fX3ZfdHJhbnMgPSB7XG4gICAgICBpZDogdGhpcy5leHByZXNzaW9uLFxuICAgICAgLy8gcmVzb2x2ZSB0aGUgY3VzdG9tIHRyYW5zaXRpb24gZnVuY3Rpb25zIG5vd1xuICAgICAgZm5zOiB0aGlzLnZtLiRvcHRpb25zLnRyYW5zaXRpb25zW3RoaXMuZXhwcmVzc2lvbl1cbiAgICB9XG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4uL3dhdGNoZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBwcmlvcml0eTogOTAwLFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjaGlsZCA9IHRoaXMudm1cbiAgICB2YXIgcGFyZW50ID0gY2hpbGQuJHBhcmVudFxuICAgIHZhciBjaGlsZEtleSA9IHRoaXMuYXJnIHx8ICckZGF0YSdcbiAgICB2YXIgcGFyZW50S2V5ID0gdGhpcy5leHByZXNzaW9uXG5cbiAgICBpZiAodGhpcy5lbCAhPT0gY2hpbGQuJGVsKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICd2LXdpdGggY2FuIG9ubHkgYmUgdXNlZCBvbiBpbnN0YW5jZSByb290IGVsZW1lbnRzLidcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKCFwYXJlbnQpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3Ytd2l0aCBtdXN0IGJlIHVzZWQgb24gYW4gaW5zdGFuY2Ugd2l0aCBhIHBhcmVudC4nXG4gICAgICApXG4gICAgfSBlbHNlIHtcblxuICAgICAgLy8gc2ltcGxlIGxvY2sgdG8gYXZvaWQgY2lyY3VsYXIgdXBkYXRlcy5cbiAgICAgIC8vIHdpdGhvdXQgdGhpcyBpdCB3b3VsZCBzdGFiaWxpemUgdG9vLCBidXQgdGhpcyBtYWtlc1xuICAgICAgLy8gc3VyZSBpdCBkb2Vzbid0IGNhdXNlIG90aGVyIHdhdGNoZXJzIHRvIHJlLWV2YWx1YXRlLlxuICAgICAgdmFyIGxvY2tlZCA9IGZhbHNlXG4gICAgICB2YXIgbG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9ja2VkID0gdHJ1ZVxuICAgICAgICBfLm5leHRUaWNrKHVubG9jaylcbiAgICAgIH1cbiAgICAgIHZhciB1bmxvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvY2tlZCA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFyZW50V2F0Y2hlciA9IG5ldyBXYXRjaGVyKFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIHBhcmVudEtleSxcbiAgICAgICAgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgIGlmICghbG9ja2VkKSB7XG4gICAgICAgICAgICBsb2NrKClcbiAgICAgICAgICAgIGNoaWxkLiRzZXQoY2hpbGRLZXksIHZhbClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICAgIFxuICAgICAgLy8gc2V0IHRoZSBjaGlsZCBpbml0aWFsIHZhbHVlIGZpcnN0LCBiZWZvcmUgc2V0dGluZ1xuICAgICAgLy8gdXAgdGhlIGNoaWxkIHdhdGNoZXIgdG8gYXZvaWQgdHJpZ2dlcmluZyBpdFxuICAgICAgLy8gaW1tZWRpYXRlbHkuXG4gICAgICBjaGlsZC4kc2V0KGNoaWxkS2V5LCB0aGlzLnBhcmVudFdhdGNoZXIudmFsdWUpXG5cbiAgICAgIHRoaXMuY2hpbGRXYXRjaGVyID0gbmV3IFdhdGNoZXIoXG4gICAgICAgIGNoaWxkLFxuICAgICAgICBjaGlsZEtleSxcbiAgICAgICAgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgIGlmICghbG9ja2VkKSB7XG4gICAgICAgICAgICBsb2NrKClcbiAgICAgICAgICAgIHBhcmVudC4kc2V0KHBhcmVudEtleSwgdmFsKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnRXYXRjaGVyKSB7XG4gICAgICB0aGlzLnBhcmVudFdhdGNoZXIudGVhcmRvd24oKVxuICAgICAgdGhpcy5jaGlsZFdhdGNoZXIudGVhcmRvd24oKVxuICAgIH1cbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBQYXRoID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9wYXRoJylcblxuLyoqXG4gKiBGaWx0ZXIgZmlsdGVyIGZvciB2LXJlcGVhdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWFyY2hLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGVsaW1pdGVyXVxuICogQHBhcmFtIHtTdHJpbmd9IGRhdGFLZXlcbiAqL1xuXG5leHBvcnRzLmZpbHRlckJ5ID0gZnVuY3Rpb24gKGFyciwgc2VhcmNoS2V5LCBkZWxpbWl0ZXIsIGRhdGFLZXkpIHtcbiAgLy8gYWxsb3cgb3B0aW9uYWwgYGluYCBkZWxpbWl0ZXJcbiAgLy8gYmVjYXVzZSB3aHkgbm90XG4gIGlmIChkZWxpbWl0ZXIgJiYgZGVsaW1pdGVyICE9PSAnaW4nKSB7XG4gICAgZGF0YUtleSA9IGRlbGltaXRlclxuICB9XG4gIC8vIGdldCB0aGUgc2VhcmNoIHN0cmluZ1xuICB2YXIgc2VhcmNoID1cbiAgICBfLnN0cmlwUXVvdGVzKHNlYXJjaEtleSkgfHxcbiAgICB0aGlzLiRnZXQoc2VhcmNoS2V5KVxuICBpZiAoIXNlYXJjaCkge1xuICAgIHJldHVybiBhcnJcbiAgfVxuICBzZWFyY2ggPSAoJycgKyBzZWFyY2gpLnRvTG93ZXJDYXNlKClcbiAgLy8gZ2V0IHRoZSBvcHRpb25hbCBkYXRhS2V5XG4gIGRhdGFLZXkgPVxuICAgIGRhdGFLZXkgJiZcbiAgICAoXy5zdHJpcFF1b3RlcyhkYXRhS2V5KSB8fCB0aGlzLiRnZXQoZGF0YUtleSkpXG4gIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIGRhdGFLZXlcbiAgICAgID8gY29udGFpbnMoUGF0aC5nZXQoaXRlbSwgZGF0YUtleSksIHNlYXJjaClcbiAgICAgIDogY29udGFpbnMoaXRlbSwgc2VhcmNoKVxuICB9KVxufVxuXG4vKipcbiAqIEZpbHRlciBmaWx0ZXIgZm9yIHYtcmVwZWF0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNvcnRLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSByZXZlcnNlS2V5XG4gKi9cblxuZXhwb3J0cy5vcmRlckJ5ID0gZnVuY3Rpb24gKGFyciwgc29ydEtleSwgcmV2ZXJzZUtleSkge1xuICB2YXIga2V5ID1cbiAgICBfLnN0cmlwUXVvdGVzKHNvcnRLZXkpIHx8XG4gICAgdGhpcy4kZ2V0KHNvcnRLZXkpXG4gIGlmICgha2V5KSB7XG4gICAgcmV0dXJuIGFyclxuICB9XG4gIHZhciBvcmRlciA9IDFcbiAgaWYgKHJldmVyc2VLZXkpIHtcbiAgICBpZiAocmV2ZXJzZUtleSA9PT0gJy0xJykge1xuICAgICAgb3JkZXIgPSAtMVxuICAgIH0gZWxzZSBpZiAocmV2ZXJzZUtleS5jaGFyQ29kZUF0KDApID09PSAweDIxKSB7IC8vICFcbiAgICAgIHJldmVyc2VLZXkgPSByZXZlcnNlS2V5LnNsaWNlKDEpXG4gICAgICBvcmRlciA9IHRoaXMuJGdldChyZXZlcnNlS2V5KSA/IDEgOiAtMVxuICAgIH0gZWxzZSB7XG4gICAgICBvcmRlciA9IHRoaXMuJGdldChyZXZlcnNlS2V5KSA/IC0xIDogMVxuICAgIH1cbiAgfVxuICAvLyBzb3J0IG9uIGEgY29weSB0byBhdm9pZCBtdXRhdGluZyBvcmlnaW5hbCBhcnJheVxuICByZXR1cm4gYXJyLnNsaWNlKCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIGEgPSBfLmlzT2JqZWN0KGEpID8gUGF0aC5nZXQoYSwga2V5KSA6IGFcbiAgICBiID0gXy5pc09iamVjdChiKSA/IFBhdGguZ2V0KGIsIGtleSkgOiBiXG4gICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA+IGIgPyBvcmRlciA6IC1vcmRlclxuICB9KVxufVxuXG4vKipcbiAqIFN0cmluZyBjb250YWluIGhlbHBlclxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoXG4gKi9cblxuZnVuY3Rpb24gY29udGFpbnMgKHZhbCwgc2VhcmNoKSB7XG4gIGlmIChfLmlzT2JqZWN0KHZhbCkpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gdmFsKSB7XG4gICAgICBpZiAoY29udGFpbnModmFsW2tleV0sIHNlYXJjaCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodmFsICE9IG51bGwpIHtcbiAgICByZXR1cm4gdmFsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgPiAtMVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxuLyoqXG4gKiBTdHJpbmdpZnkgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGVudFxuICovXG5cbmV4cG9ydHMuanNvbiA9IHtcbiAgcmVhZDogZnVuY3Rpb24gKHZhbHVlLCBpbmRlbnQpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJ1xuICAgICAgPyB2YWx1ZVxuICAgICAgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgTnVtYmVyKGluZGVudCkgfHwgMilcbiAgfSxcbiAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiAnYWJjJyA9PiAnQWJjJ1xuICovXG5cbmV4cG9ydHMuY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSByZXR1cm4gJydcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXG4gIHJldHVybiB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnNsaWNlKDEpXG59XG5cbi8qKlxuICogJ2FiYycgPT4gJ0FCQydcbiAqL1xuXG5leHBvcnRzLnVwcGVyY2FzZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlIHx8IHZhbHVlID09PSAwKVxuICAgID8gdmFsdWUudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpXG4gICAgOiAnJ1xufVxuXG4vKipcbiAqICdBYkMnID0+ICdhYmMnXG4gKi9cblxuZXhwb3J0cy5sb3dlcmNhc2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMClcbiAgICA/IHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgIDogJydcbn1cblxuLyoqXG4gKiAxMjM0NSA9PiAkMTIsMzQ1LjAwXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNpZ25cbiAqL1xuXG52YXIgZGlnaXRzUkUgPSAvKFxcZHszfSkoPz1cXGQpL2dcblxuZXhwb3J0cy5jdXJyZW5jeSA9IGZ1bmN0aW9uICh2YWx1ZSwgc2lnbikge1xuICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpXG4gIGlmICghaXNGaW5pdGUodmFsdWUpIHx8ICghdmFsdWUgJiYgdmFsdWUgIT09IDApKSByZXR1cm4gJydcbiAgc2lnbiA9IHNpZ24gfHwgJyQnXG4gIHZhciBzID0gTWF0aC5mbG9vcihNYXRoLmFicyh2YWx1ZSkpLnRvU3RyaW5nKCksXG4gICAgaSA9IHMubGVuZ3RoICUgMyxcbiAgICBoID0gaSA+IDBcbiAgICAgID8gKHMuc2xpY2UoMCwgaSkgKyAocy5sZW5ndGggPiAzID8gJywnIDogJycpKVxuICAgICAgOiAnJyxcbiAgICB2ID0gTWF0aC5hYnMocGFyc2VJbnQoKHZhbHVlICogMTAwKSAlIDEwMCwgMTApKSxcbiAgICBmID0gJy4nICsgKHYgPCAxMCA/ICgnMCcgKyB2KSA6IHYpXG4gIHJldHVybiAodmFsdWUgPCAwID8gJy0nIDogJycpICtcbiAgICBzaWduICsgaCArIHMuc2xpY2UoaSkucmVwbGFjZShkaWdpdHNSRSwgJyQxLCcpICsgZlxufVxuXG4vKipcbiAqICdpdGVtJyA9PiAnaXRlbXMnXG4gKlxuICogQHBhcmFtc1xuICogIGFuIGFycmF5IG9mIHN0cmluZ3MgY29ycmVzcG9uZGluZyB0b1xuICogIHRoZSBzaW5nbGUsIGRvdWJsZSwgdHJpcGxlIC4uLiBmb3JtcyBvZiB0aGUgd29yZCB0b1xuICogIGJlIHBsdXJhbGl6ZWQuIFdoZW4gdGhlIG51bWJlciB0byBiZSBwbHVyYWxpemVkXG4gKiAgZXhjZWVkcyB0aGUgbGVuZ3RoIG9mIHRoZSBhcmdzLCBpdCB3aWxsIHVzZSB0aGUgbGFzdFxuICogIGVudHJ5IGluIHRoZSBhcnJheS5cbiAqXG4gKiAgZS5nLiBbJ3NpbmdsZScsICdkb3VibGUnLCAndHJpcGxlJywgJ211bHRpcGxlJ11cbiAqL1xuXG5leHBvcnRzLnBsdXJhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgYXJncyA9IF8udG9BcnJheShhcmd1bWVudHMsIDEpXG4gIHJldHVybiBhcmdzLmxlbmd0aCA+IDFcbiAgICA/IChhcmdzW3ZhbHVlICUgMTAgLSAxXSB8fCBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0pXG4gICAgOiAoYXJnc1swXSArICh2YWx1ZSA9PT0gMSA/ICcnIDogJ3MnKSlcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWwgZmlsdGVyIHRoYXQgdGFrZXMgYSBoYW5kbGVyIGZ1bmN0aW9uLFxuICogd3JhcHMgaXQgc28gaXQgb25seSBnZXRzIHRyaWdnZXJlZCBvbiBzcGVjaWZpY1xuICoga2V5cHJlc3Nlcy4gdi1vbiBvbmx5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG52YXIga2V5Q29kZXMgPSB7XG4gIGVudGVyICAgIDogMTMsXG4gIHRhYiAgICAgIDogOSxcbiAgJ2RlbGV0ZScgOiA0NixcbiAgdXAgICAgICAgOiAzOCxcbiAgbGVmdCAgICAgOiAzNyxcbiAgcmlnaHQgICAgOiAzOSxcbiAgZG93biAgICAgOiA0MCxcbiAgZXNjICAgICAgOiAyN1xufVxuXG5leHBvcnRzLmtleSA9IGZ1bmN0aW9uIChoYW5kbGVyLCBrZXkpIHtcbiAgaWYgKCFoYW5kbGVyKSByZXR1cm5cbiAgdmFyIGNvZGUgPSBrZXlDb2Rlc1trZXldXG4gIGlmICghY29kZSkge1xuICAgIGNvZGUgPSBwYXJzZUludChrZXksIDEwKVxuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT09IGNvZGUpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwodGhpcywgZSlcbiAgICB9XG4gIH1cbn1cblxuLy8gZXhwb3NlIGtleWNvZGUgaGFzaFxuZXhwb3J0cy5rZXkua2V5Q29kZXMgPSBrZXlDb2Rlc1xuXG4vKipcbiAqIEluc3RhbGwgc3BlY2lhbCBhcnJheSBmaWx0ZXJzXG4gKi9cblxuXy5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9hcnJheS1maWx0ZXJzJykpXG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIERpcmVjdGl2ZSA9IHJlcXVpcmUoJy4uL2RpcmVjdGl2ZScpXG52YXIgY29tcGlsZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL2NvbXBpbGUnKVxudmFyIHRyYW5zY2x1ZGUgPSByZXF1aXJlKCcuLi9jb21waWxlci90cmFuc2NsdWRlJylcblxuLyoqXG4gKiBUcmFuc2NsdWRlLCBjb21waWxlIGFuZCBsaW5rIGVsZW1lbnQuXG4gKlxuICogSWYgYSBwcmUtY29tcGlsZWQgbGlua2VyIGlzIGF2YWlsYWJsZSwgdGhhdCBtZWFucyB0aGVcbiAqIHBhc3NlZCBpbiBlbGVtZW50IHdpbGwgYmUgcHJlLXRyYW5zY2x1ZGVkIGFuZCBjb21waWxlZFxuICogYXMgd2VsbCAtIGFsbCB3ZSBuZWVkIHRvIGRvIGlzIHRvIGNhbGwgdGhlIGxpbmtlci5cbiAqXG4gKiBPdGhlcndpc2Ugd2UgbmVlZCB0byBjYWxsIHRyYW5zY2x1ZGUvY29tcGlsZS9saW5rIGhlcmUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5leHBvcnRzLl9jb21waWxlID0gZnVuY3Rpb24gKGVsKSB7XG4gIHZhciBvcHRpb25zID0gdGhpcy4kb3B0aW9uc1xuICB2YXIgcGFyZW50ID0gb3B0aW9ucy5fcGFyZW50XG4gIGlmIChvcHRpb25zLl9saW5rRm4pIHtcbiAgICB0aGlzLl9pbml0RWxlbWVudChlbClcbiAgICBvcHRpb25zLl9saW5rRm4odGhpcywgZWwpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHJhdyA9IGVsXG4gICAgaWYgKG9wdGlvbnMuX2FzQ29tcG9uZW50KSB7XG4gICAgICAvLyBzZXBhcmF0ZSBjb250YWluZXIgZWxlbWVudCBhbmQgY29udGVudFxuICAgICAgdmFyIGNvbnRlbnQgPSBvcHRpb25zLl9jb250ZW50ID0gXy5leHRyYWN0Q29udGVudChyYXcpXG4gICAgICAvLyBjcmVhdGUgdHdvIHNlcGFyYXRlIGxpbmVrcnMgZm9yIGNvbnRhaW5lciBhbmQgY29udGVudFxuICAgICAgdmFyIHBhcmVudE9wdGlvbnMgPSBwYXJlbnQuJG9wdGlvbnNcbiAgICAgIFxuICAgICAgLy8gaGFjazogd2UgbmVlZCB0byBza2lwIHRoZSBwYXJhbUF0dHJpYnV0ZXMgZm9yIHRoaXNcbiAgICAgIC8vIGNoaWxkIGluc3RhbmNlIHdoZW4gY29tcGlsaW5nIGl0cyBwYXJlbnQgY29udGFpbmVyXG4gICAgICAvLyBsaW5rZXIuIHRoZXJlIGNvdWxkIGJlIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzLlxuICAgICAgcGFyZW50T3B0aW9ucy5fc2tpcEF0dHJzID0gb3B0aW9ucy5wYXJhbUF0dHJpYnV0ZXNcbiAgICAgIHZhciBjb250YWluZXJMaW5rRm4gPVxuICAgICAgICBjb21waWxlKHJhdywgcGFyZW50T3B0aW9ucywgdHJ1ZSwgdHJ1ZSlcbiAgICAgIHBhcmVudE9wdGlvbnMuX3NraXBBdHRycyA9IG51bGxcblxuICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgdmFyIG9sID0gcGFyZW50Ll9jaGlsZHJlbi5sZW5ndGhcbiAgICAgICAgdmFyIGNvbnRlbnRMaW5rRm4gPVxuICAgICAgICAgIGNvbXBpbGUoY29udGVudCwgcGFyZW50T3B0aW9ucywgdHJ1ZSlcbiAgICAgICAgLy8gY2FsbCBjb250ZW50IGxpbmtlciBub3csIGJlZm9yZSB0cmFuc2NsdXNpb25cbiAgICAgICAgdGhpcy5fY29udGVudFVubGlua0ZuID0gY29udGVudExpbmtGbihwYXJlbnQsIGNvbnRlbnQpXG4gICAgICAgIC8vIG1hcmsgYWxsIGNvbXBpbGVkIG5vZGVzIGFzIHRyYW5zY2x1ZGVkLCBzbyB0aGF0XG4gICAgICAgIC8vIGRpcmVjdGl2ZXMgdGhhdCBkbyBwYXJ0aWFsIGNvbXBpbGF0aW9uLCBlLmcuIHYtaWZcbiAgICAgICAgLy8gYW5kIHYtcGFydGlhbCBjYW4gZGV0ZWN0IHRoZW0gYW5kIHBlcnNpc3QgdGhlbVxuICAgICAgICAvLyB0aHJvdWdoIHJlLWNvbXBpbGF0aW9ucy5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb250ZW50LmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb250ZW50LmNoaWxkTm9kZXNbaV0uX2lzQ29udGVudCA9IHRydWVcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl90cmFuc0NwbnRzID0gcGFyZW50Ll9jaGlsZHJlbi5zbGljZShvbClcbiAgICAgIH1cbiAgICAgIC8vIHRyYW5jbHVkZSwgdGhpcyBwb3NzaWJseSByZXBsYWNlcyBvcmlnaW5hbFxuICAgICAgZWwgPSB0cmFuc2NsdWRlKGVsLCBvcHRpb25zKVxuICAgICAgdGhpcy5faW5pdEVsZW1lbnQoZWwpXG4gICAgICAvLyBub3cgY2FsbCB0aGUgY29udGFpbmVyIGxpbmtlciBvbiB0aGUgcmVzb2x2ZWQgZWxcbiAgICAgIHRoaXMuX2NvbnRhaW5lclVubGlua0ZuID0gY29udGFpbmVyTGlua0ZuKHBhcmVudCwgZWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHNpbXBseSB0cmFuc2NsdWRlXG4gICAgICBlbCA9IHRyYW5zY2x1ZGUoZWwsIG9wdGlvbnMpXG4gICAgICB0aGlzLl9pbml0RWxlbWVudChlbClcbiAgICB9XG4gICAgdmFyIGxpbmtGbiA9IGNvbXBpbGUoZWwsIG9wdGlvbnMpXG4gICAgbGlua0ZuKHRoaXMsIGVsKVxuICAgIGlmIChvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgIF8ucmVwbGFjZShyYXcsIGVsKVxuICAgIH1cbiAgfVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGluc3RhbmNlIGVsZW1lbnQuIENhbGxlZCBpbiB0aGUgcHVibGljXG4gKiAkbW91bnQoKSBtZXRob2QuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5cbmV4cG9ydHMuX2luaXRFbGVtZW50ID0gZnVuY3Rpb24gKGVsKSB7XG4gIGlmIChlbCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICB0aGlzLl9pc0Jsb2NrID0gdHJ1ZVxuICAgIHRoaXMuX2Jsb2NrU3RhcnQgPSBlbC5maXJzdENoaWxkXG4gICAgdGhpcy4kZWwgPSBlbC5jaGlsZE5vZGVzWzFdXG4gICAgdGhpcy5fYmxvY2tFbmQgPSBlbC5sYXN0Q2hpbGRcbiAgICB0aGlzLl9ibG9ja0ZyYWdtZW50ID0gZWxcbiAgfSBlbHNlIHtcbiAgICB0aGlzLiRlbCA9IGVsXG4gIH1cbiAgdGhpcy4kZWwuX192dWVfXyA9IHRoaXNcbiAgdGhpcy5fY2FsbEhvb2soJ2JlZm9yZUNvbXBpbGUnKVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbmQgYmluZCBhIGRpcmVjdGl2ZSB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gZGlyZWN0aXZlIG5hbWVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAgIC0gdGFyZ2V0IG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjIC0gcGFyc2VkIGRpcmVjdGl2ZSBkZXNjcmlwdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmICAtIGRpcmVjdGl2ZSBkZWZpbml0aW9uIG9iamVjdFxuICovXG5cbmV4cG9ydHMuX2JpbmREaXIgPSBmdW5jdGlvbiAobmFtZSwgbm9kZSwgZGVzYywgZGVmKSB7XG4gIHRoaXMuX2RpcmVjdGl2ZXMucHVzaChcbiAgICBuZXcgRGlyZWN0aXZlKG5hbWUsIG5vZGUsIHRoaXMsIGRlc2MsIGRlZilcbiAgKVxufVxuXG4vKipcbiAqIFRlYXJkb3duIGFuIGluc3RhbmNlLCB1bm9ic2VydmVzIHRoZSBkYXRhLCB1bmJpbmQgYWxsIHRoZVxuICogZGlyZWN0aXZlcywgdHVybiBvZmYgYWxsIHRoZSBldmVudCBsaXN0ZW5lcnMsIGV0Yy5cbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHJlbW92ZSAtIHdoZXRoZXIgdG8gcmVtb3ZlIHRoZSBET00gbm9kZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVmZXJDbGVhbnVwIC0gaWYgdHJ1ZSwgZGVmZXIgY2xlYW51cCB0b1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZSBjYWxsZWQgbGF0ZXJcbiAqL1xuXG5leHBvcnRzLl9kZXN0cm95ID0gZnVuY3Rpb24gKHJlbW92ZSwgZGVmZXJDbGVhbnVwKSB7XG4gIGlmICh0aGlzLl9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdGhpcy5fY2FsbEhvb2soJ2JlZm9yZURlc3Ryb3knKVxuICB0aGlzLl9pc0JlaW5nRGVzdHJveWVkID0gdHJ1ZVxuICB2YXIgaVxuICAvLyByZW1vdmUgc2VsZiBmcm9tIHBhcmVudC4gb25seSBuZWNlc3NhcnlcbiAgLy8gaWYgcGFyZW50IGlzIG5vdCBiZWluZyBkZXN0cm95ZWQgYXMgd2VsbC5cbiAgdmFyIHBhcmVudCA9IHRoaXMuJHBhcmVudFxuICBpZiAocGFyZW50ICYmICFwYXJlbnQuX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICBpID0gcGFyZW50Ll9jaGlsZHJlbi5pbmRleE9mKHRoaXMpXG4gICAgcGFyZW50Ll9jaGlsZHJlbi5zcGxpY2UoaSwgMSlcbiAgfVxuICAvLyBkZXN0cm95IGFsbCBjaGlsZHJlbi5cbiAgaSA9IHRoaXMuX2NoaWxkcmVuLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdGhpcy5fY2hpbGRyZW5baV0uJGRlc3Ryb3koKVxuICB9XG4gIC8vIHRlYXJkb3duIHBhcmVudCBsaW5rZXJzXG4gIGlmICh0aGlzLl9jb250YWluZXJVbmxpbmtGbikge1xuICAgIHRoaXMuX2NvbnRhaW5lclVubGlua0ZuKClcbiAgfVxuICBpZiAodGhpcy5fY29udGVudFVubGlua0ZuKSB7XG4gICAgdGhpcy5fY29udGVudFVubGlua0ZuKClcbiAgfVxuICAvLyB0ZWFyZG93biBhbGwgZGlyZWN0aXZlcy4gdGhpcyBhbHNvIHRlYXJzZG93biBhbGxcbiAgLy8gZGlyZWN0aXZlLW93bmVkIHdhdGNoZXJzLiBpbnRlbnRpb25hbGx5IGNoZWNrIGZvclxuICAvLyBkaXJlY3RpdmVzIGFycmF5IGxlbmd0aCBvbiBldmVyeSBsb29wIHNpbmNlIGRpcmVjdGl2ZXNcbiAgLy8gdGhhdCBtYW5hZ2VzIHBhcnRpYWwgY29tcGlsYXRpb24gY2FuIHNwbGljZSBvbmVzIG91dFxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5fZGlyZWN0aXZlcy5sZW5ndGg7IGkrKykge1xuICAgIHRoaXMuX2RpcmVjdGl2ZXNbaV0uX3RlYXJkb3duKClcbiAgfVxuICAvLyB0ZWFyZG93biBhbGwgdXNlciB3YXRjaGVycy5cbiAgdmFyIHdhdGNoZXJcbiAgZm9yIChpIGluIHRoaXMuX3VzZXJXYXRjaGVycykge1xuICAgIHdhdGNoZXIgPSB0aGlzLl91c2VyV2F0Y2hlcnNbaV1cbiAgICBpZiAod2F0Y2hlcikge1xuICAgICAgd2F0Y2hlci50ZWFyZG93bigpXG4gICAgfVxuICB9XG4gIC8vIHJlbW92ZSByZWZlcmVuY2UgdG8gc2VsZiBvbiAkZWxcbiAgaWYgKHRoaXMuJGVsKSB7XG4gICAgdGhpcy4kZWwuX192dWVfXyA9IG51bGxcbiAgfVxuICAvLyByZW1vdmUgRE9NIGVsZW1lbnRcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGlmIChyZW1vdmUgJiYgdGhpcy4kZWwpIHtcbiAgICB0aGlzLiRyZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5fY2xlYW51cCgpXG4gICAgfSlcbiAgfSBlbHNlIGlmICghZGVmZXJDbGVhbnVwKSB7XG4gICAgdGhpcy5fY2xlYW51cCgpXG4gIH1cbn1cblxuLyoqXG4gKiBDbGVhbiB1cCB0byBlbnN1cmUgZ2FyYmFnZSBjb2xsZWN0aW9uLlxuICogVGhpcyBpcyBjYWxsZWQgYWZ0ZXIgdGhlIGxlYXZlIHRyYW5zaXRpb24gaWYgdGhlcmVcbiAqIGlzIGFueS5cbiAqL1xuXG5leHBvcnRzLl9jbGVhbnVwID0gZnVuY3Rpb24gKCkge1xuICAvLyByZW1vdmUgcmVmZXJlbmNlIGZyb20gZGF0YSBvYlxuICB0aGlzLl9kYXRhLl9fb2JfXy5yZW1vdmVWbSh0aGlzKVxuICB0aGlzLl9kYXRhID1cbiAgdGhpcy5fd2F0Y2hlcnMgPVxuICB0aGlzLl91c2VyV2F0Y2hlcnMgPVxuICB0aGlzLl93YXRjaGVyTGlzdCA9XG4gIHRoaXMuJGVsID1cbiAgdGhpcy4kcGFyZW50ID1cbiAgdGhpcy4kcm9vdCA9XG4gIHRoaXMuX2NoaWxkcmVuID1cbiAgdGhpcy5fdHJhbnNDcG50cyA9XG4gIHRoaXMuX2RpcmVjdGl2ZXMgPSBudWxsXG4gIC8vIGNhbGwgdGhlIGxhc3QgaG9vay4uLlxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9IHRydWVcbiAgdGhpcy5fY2FsbEhvb2soJ2Rlc3Ryb3llZCcpXG4gIC8vIHR1cm4gb2ZmIGFsbCBpbnN0YW5jZSBsaXN0ZW5lcnMuXG4gIHRoaXMuJG9mZigpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBpbkRvYyA9IF8uaW5Eb2NcblxuLyoqXG4gKiBTZXR1cCB0aGUgaW5zdGFuY2UncyBvcHRpb24gZXZlbnRzICYgd2F0Y2hlcnMuXG4gKiBJZiB0aGUgdmFsdWUgaXMgYSBzdHJpbmcsIHdlIHB1bGwgaXQgZnJvbSB0aGVcbiAqIGluc3RhbmNlJ3MgbWV0aG9kcyBieSBuYW1lLlxuICovXG5cbmV4cG9ydHMuX2luaXRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvcHRpb25zID0gdGhpcy4kb3B0aW9uc1xuICByZWdpc3RlckNhbGxiYWNrcyh0aGlzLCAnJG9uJywgb3B0aW9ucy5ldmVudHMpXG4gIHJlZ2lzdGVyQ2FsbGJhY2tzKHRoaXMsICckd2F0Y2gnLCBvcHRpb25zLndhdGNoKVxufVxuXG4vKipcbiAqIFJlZ2lzdGVyIGNhbGxiYWNrcyBmb3Igb3B0aW9uIGV2ZW50cyBhbmQgd2F0Y2hlcnMuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaFxuICovXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQ2FsbGJhY2tzICh2bSwgYWN0aW9uLCBoYXNoKSB7XG4gIGlmICghaGFzaCkgcmV0dXJuXG4gIHZhciBoYW5kbGVycywga2V5LCBpLCBqXG4gIGZvciAoa2V5IGluIGhhc2gpIHtcbiAgICBoYW5kbGVycyA9IGhhc2hba2V5XVxuICAgIGlmIChfLmlzQXJyYXkoaGFuZGxlcnMpKSB7XG4gICAgICBmb3IgKGkgPSAwLCBqID0gaGFuZGxlcnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgIHJlZ2lzdGVyKHZtLCBhY3Rpb24sIGtleSwgaGFuZGxlcnNbaV0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZ2lzdGVyKHZtLCBhY3Rpb24sIGtleSwgaGFuZGxlcnMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogSGVscGVyIHRvIHJlZ2lzdGVyIGFuIGV2ZW50L3dhdGNoIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSBoYW5kbGVyXG4gKi9cblxuZnVuY3Rpb24gcmVnaXN0ZXIgKHZtLCBhY3Rpb24sIGtleSwgaGFuZGxlcikge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBoYW5kbGVyXG4gIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdm1bYWN0aW9uXShrZXksIGhhbmRsZXIpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgbWV0aG9kcyA9IHZtLiRvcHRpb25zLm1ldGhvZHNcbiAgICB2YXIgbWV0aG9kID0gbWV0aG9kcyAmJiBtZXRob2RzW2hhbmRsZXJdXG4gICAgaWYgKG1ldGhvZCkge1xuICAgICAgdm1bYWN0aW9uXShrZXksIG1ldGhvZClcbiAgICB9IGVsc2Uge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnVW5rbm93biBtZXRob2Q6IFwiJyArIGhhbmRsZXIgKyAnXCIgd2hlbiAnICtcbiAgICAgICAgJ3JlZ2lzdGVyaW5nIGNhbGxiYWNrIGZvciAnICsgYWN0aW9uICtcbiAgICAgICAgJzogXCInICsga2V5ICsgJ1wiLidcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXR1cCByZWN1cnNpdmUgYXR0YWNoZWQvZGV0YWNoZWQgY2FsbHNcbiAqL1xuXG5leHBvcnRzLl9pbml0RE9NSG9va3MgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuJG9uKCdob29rOmF0dGFjaGVkJywgb25BdHRhY2hlZClcbiAgdGhpcy4kb24oJ2hvb2s6ZGV0YWNoZWQnLCBvbkRldGFjaGVkKVxufVxuXG4vKipcbiAqIENhbGxiYWNrIHRvIHJlY3Vyc2l2ZWx5IGNhbGwgYXR0YWNoZWQgaG9vayBvbiBjaGlsZHJlblxuICovXG5cbmZ1bmN0aW9uIG9uQXR0YWNoZWQgKCkge1xuICB0aGlzLl9pc0F0dGFjaGVkID0gdHJ1ZVxuICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGNhbGxBdHRhY2gpXG4gIGlmICh0aGlzLl90cmFuc0NwbnRzKSB7XG4gICAgdGhpcy5fdHJhbnNDcG50cy5mb3JFYWNoKGNhbGxBdHRhY2gpXG4gIH1cbn1cblxuLyoqXG4gKiBJdGVyYXRvciB0byBjYWxsIGF0dGFjaGVkIGhvb2tcbiAqIFxuICogQHBhcmFtIHtWdWV9IGNoaWxkXG4gKi9cblxuZnVuY3Rpb24gY2FsbEF0dGFjaCAoY2hpbGQpIHtcbiAgaWYgKCFjaGlsZC5faXNBdHRhY2hlZCAmJiBpbkRvYyhjaGlsZC4kZWwpKSB7XG4gICAgY2hpbGQuX2NhbGxIb29rKCdhdHRhY2hlZCcpXG4gIH1cbn1cblxuLyoqXG4gKiBDYWxsYmFjayB0byByZWN1cnNpdmVseSBjYWxsIGRldGFjaGVkIGhvb2sgb24gY2hpbGRyZW5cbiAqL1xuXG5mdW5jdGlvbiBvbkRldGFjaGVkICgpIHtcbiAgdGhpcy5faXNBdHRhY2hlZCA9IGZhbHNlXG4gIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goY2FsbERldGFjaClcbiAgaWYgKHRoaXMuX3RyYW5zQ3BudHMpIHtcbiAgICB0aGlzLl90cmFuc0NwbnRzLmZvckVhY2goY2FsbERldGFjaClcbiAgfVxufVxuXG4vKipcbiAqIEl0ZXJhdG9yIHRvIGNhbGwgZGV0YWNoZWQgaG9va1xuICogXG4gKiBAcGFyYW0ge1Z1ZX0gY2hpbGRcbiAqL1xuXG5mdW5jdGlvbiBjYWxsRGV0YWNoIChjaGlsZCkge1xuICBpZiAoY2hpbGQuX2lzQXR0YWNoZWQgJiYgIWluRG9jKGNoaWxkLiRlbCkpIHtcbiAgICBjaGlsZC5fY2FsbEhvb2soJ2RldGFjaGVkJylcbiAgfVxufVxuXG4vKipcbiAqIFRyaWdnZXIgYWxsIGhhbmRsZXJzIGZvciBhIGhvb2tcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaG9va1xuICovXG5cbmV4cG9ydHMuX2NhbGxIb29rID0gZnVuY3Rpb24gKGhvb2spIHtcbiAgdmFyIGhhbmRsZXJzID0gdGhpcy4kb3B0aW9uc1tob29rXVxuICBpZiAoaGFuZGxlcnMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgaGFuZGxlcnNbaV0uY2FsbCh0aGlzKVxuICAgIH1cbiAgfVxuICB0aGlzLiRlbWl0KCdob29rOicgKyBob29rKVxufSIsInZhciBtZXJnZU9wdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsL21lcmdlLW9wdGlvbicpXG5cbi8qKlxuICogVGhlIG1haW4gaW5pdCBzZXF1ZW5jZS4gVGhpcyBpcyBjYWxsZWQgZm9yIGV2ZXJ5XG4gKiBpbnN0YW5jZSwgaW5jbHVkaW5nIG9uZXMgdGhhdCBhcmUgY3JlYXRlZCBmcm9tIGV4dGVuZGVkXG4gKiBjb25zdHJ1Y3RvcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGlzIG9wdGlvbnMgb2JqZWN0IHNob3VsZCBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcmVzdWx0IG9mIG1lcmdpbmcgY2xhc3NcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyBhbmQgdGhlIG9wdGlvbnMgcGFzc2VkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAqL1xuXG5leHBvcnRzLl9pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIHRoaXMuJGVsICAgICAgICAgICA9IG51bGxcbiAgdGhpcy4kcGFyZW50ICAgICAgID0gb3B0aW9ucy5fcGFyZW50XG4gIHRoaXMuJHJvb3QgICAgICAgICA9IG9wdGlvbnMuX3Jvb3QgfHwgdGhpc1xuICB0aGlzLiQgICAgICAgICAgICAgPSB7fSAvLyBjaGlsZCB2bSByZWZlcmVuY2VzXG4gIHRoaXMuJCQgICAgICAgICAgICA9IHt9IC8vIGVsZW1lbnQgcmVmZXJlbmNlc1xuICB0aGlzLl93YXRjaGVyTGlzdCAgPSBbXSAvLyBhbGwgd2F0Y2hlcnMgYXMgYW4gYXJyYXlcbiAgdGhpcy5fd2F0Y2hlcnMgICAgID0ge30gLy8gaW50ZXJuYWwgd2F0Y2hlcnMgYXMgYSBoYXNoXG4gIHRoaXMuX3VzZXJXYXRjaGVycyA9IHt9IC8vIHVzZXIgd2F0Y2hlcnMgYXMgYSBoYXNoXG4gIHRoaXMuX2RpcmVjdGl2ZXMgICA9IFtdIC8vIGFsbCBkaXJlY3RpdmVzXG5cbiAgLy8gYSBmbGFnIHRvIGF2b2lkIHRoaXMgYmVpbmcgb2JzZXJ2ZWRcbiAgdGhpcy5faXNWdWUgPSB0cnVlXG5cbiAgLy8gZXZlbnRzIGJvb2trZWVwaW5nXG4gIHRoaXMuX2V2ZW50cyAgICAgICAgID0ge30gICAgLy8gcmVnaXN0ZXJlZCBjYWxsYmFja3NcbiAgdGhpcy5fZXZlbnRzQ291bnQgICAgPSB7fSAgICAvLyBmb3IgJGJyb2FkY2FzdCBvcHRpbWl6YXRpb25cbiAgdGhpcy5fZXZlbnRDYW5jZWxsZWQgPSBmYWxzZSAvLyBmb3IgZXZlbnQgY2FuY2VsbGF0aW9uXG5cbiAgLy8gYmxvY2sgaW5zdGFuY2UgcHJvcGVydGllc1xuICB0aGlzLl9pc0Jsb2NrICAgICA9IGZhbHNlXG4gIHRoaXMuX2Jsb2NrU3RhcnQgID0gICAgICAgICAgLy8gQHR5cGUge0NvbW1lbnROb2RlfVxuICB0aGlzLl9ibG9ja0VuZCAgICA9IG51bGwgICAgIC8vIEB0eXBlIHtDb21tZW50Tm9kZX1cblxuICAvLyBsaWZlY3ljbGUgc3RhdGVcbiAgdGhpcy5faXNDb21waWxlZCAgPVxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9XG4gIHRoaXMuX2lzUmVhZHkgICAgID1cbiAgdGhpcy5faXNBdHRhY2hlZCAgPVxuICB0aGlzLl9pc0JlaW5nRGVzdHJveWVkID0gZmFsc2VcblxuICAvLyBjaGlsZHJlblxuICB0aGlzLl9jaGlsZHJlbiA9IFtdXG4gIHRoaXMuX2NoaWxkQ3RvcnMgPSB7fVxuXG4gIC8vIHRyYW5zY2x1c2lvbiB1bmxpbmsgZnVuY3Rpb25zXG4gIHRoaXMuX2NvbnRhaW5lclVubGlua0ZuID1cbiAgdGhpcy5fY29udGVudFVubGlua0ZuID0gbnVsbFxuXG4gIC8vIHRyYW5zY2x1ZGVkIGNvbXBvbmVudHMgdGhhdCBiZWxvbmcgdG8gdGhlIHBhcmVudC5cbiAgLy8gbmVlZCB0byBrZWVwIHRyYWNrIG9mIHRoZW0gc28gdGhhdCB3ZSBjYW4gY2FsbFxuICAvLyBhdHRhY2hlZC9kZXRhY2hlZCBob29rcyBvbiB0aGVtLlxuICB0aGlzLl90cmFuc0NwbnRzID0gbnVsbFxuXG4gIC8vIHByb3BzIHVzZWQgaW4gdi1yZXBlYXQgZGlmZmluZ1xuICB0aGlzLl9uZXcgPSB0cnVlXG4gIHRoaXMuX3JldXNlZCA9IGZhbHNlXG5cbiAgLy8gbWVyZ2Ugb3B0aW9ucy5cbiAgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnMgPSBtZXJnZU9wdGlvbnMoXG4gICAgdGhpcy5jb25zdHJ1Y3Rvci5vcHRpb25zLFxuICAgIG9wdGlvbnMsXG4gICAgdGhpc1xuICApXG5cbiAgLy8gc2V0IGRhdGEgYWZ0ZXIgbWVyZ2UuXG4gIHRoaXMuX2RhdGEgPSBvcHRpb25zLmRhdGEgfHwge31cblxuICAvLyBpbml0aWFsaXplIGRhdGEgb2JzZXJ2YXRpb24gYW5kIHNjb3BlIGluaGVyaXRhbmNlLlxuICB0aGlzLl9pbml0U2NvcGUoKVxuXG4gIC8vIHNldHVwIGV2ZW50IHN5c3RlbSBhbmQgb3B0aW9uIGV2ZW50cy5cbiAgdGhpcy5faW5pdEV2ZW50cygpXG5cbiAgLy8gY2FsbCBjcmVhdGVkIGhvb2tcbiAgdGhpcy5fY2FsbEhvb2soJ2NyZWF0ZWQnKVxuXG4gIC8vIGlmIGBlbGAgb3B0aW9uIGlzIHBhc3NlZCwgc3RhcnQgY29tcGlsYXRpb24uXG4gIGlmIChvcHRpb25zLmVsKSB7XG4gICAgdGhpcy4kbW91bnQob3B0aW9ucy5lbClcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgT2JzZXJ2ZXIgPSByZXF1aXJlKCcuLi9vYnNlcnZlcicpXG52YXIgRGVwID0gcmVxdWlyZSgnLi4vb2JzZXJ2ZXIvZGVwJylcblxuLyoqXG4gKiBTZXR1cCB0aGUgc2NvcGUgb2YgYW4gaW5zdGFuY2UsIHdoaWNoIGNvbnRhaW5zOlxuICogLSBvYnNlcnZlZCBkYXRhXG4gKiAtIGNvbXB1dGVkIHByb3BlcnRpZXNcbiAqIC0gdXNlciBtZXRob2RzXG4gKiAtIG1ldGEgcHJvcGVydGllc1xuICovXG5cbmV4cG9ydHMuX2luaXRTY29wZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5faW5pdERhdGEoKVxuICB0aGlzLl9pbml0Q29tcHV0ZWQoKVxuICB0aGlzLl9pbml0TWV0aG9kcygpXG4gIHRoaXMuX2luaXRNZXRhKClcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBkYXRhLiBcbiAqL1xuXG5leHBvcnRzLl9pbml0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gcHJveHkgZGF0YSBvbiBpbnN0YW5jZVxuICB2YXIgZGF0YSA9IHRoaXMuX2RhdGFcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKVxuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHZhciBrZXlcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBpZiAoIV8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICB0aGlzLl9wcm94eShrZXkpXG4gICAgfVxuICB9XG4gIC8vIG9ic2VydmUgZGF0YVxuICBPYnNlcnZlci5jcmVhdGUoZGF0YSkuYWRkVm0odGhpcylcbn1cblxuLyoqXG4gKiBTd2FwIHRoZSBpc250YW5jZSdzICRkYXRhLiBDYWxsZWQgaW4gJGRhdGEncyBzZXR0ZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG5ld0RhdGFcbiAqL1xuXG5leHBvcnRzLl9zZXREYXRhID0gZnVuY3Rpb24gKG5ld0RhdGEpIHtcbiAgbmV3RGF0YSA9IG5ld0RhdGEgfHwge31cbiAgdmFyIG9sZERhdGEgPSB0aGlzLl9kYXRhXG4gIHRoaXMuX2RhdGEgPSBuZXdEYXRhXG4gIHZhciBrZXlzLCBrZXksIGlcbiAgLy8gdW5wcm94eSBrZXlzIG5vdCBwcmVzZW50IGluIG5ldyBkYXRhXG4gIGtleXMgPSBPYmplY3Qua2V5cyhvbGREYXRhKVxuICBpID0ga2V5cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBpZiAoIV8uaXNSZXNlcnZlZChrZXkpICYmICEoa2V5IGluIG5ld0RhdGEpKSB7XG4gICAgICB0aGlzLl91bnByb3h5KGtleSlcbiAgICB9XG4gIH1cbiAgLy8gcHJveHkga2V5cyBub3QgYWxyZWFkeSBwcm94aWVkLFxuICAvLyBhbmQgdHJpZ2dlciBjaGFuZ2UgZm9yIGNoYW5nZWQgdmFsdWVzXG4gIGtleXMgPSBPYmplY3Qua2V5cyhuZXdEYXRhKVxuICBpID0ga2V5cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhXy5pc1Jlc2VydmVkKGtleSkpIHtcbiAgICAgIC8vIG5ldyBwcm9wZXJ0eVxuICAgICAgdGhpcy5fcHJveHkoa2V5KVxuICAgIH1cbiAgfVxuICBvbGREYXRhLl9fb2JfXy5yZW1vdmVWbSh0aGlzKVxuICBPYnNlcnZlci5jcmVhdGUobmV3RGF0YSkuYWRkVm0odGhpcylcbiAgdGhpcy5fZGlnZXN0KClcbn1cblxuLyoqXG4gKiBQcm94eSBhIHByb3BlcnR5LCBzbyB0aGF0XG4gKiB2bS5wcm9wID09PSB2bS5fZGF0YS5wcm9wXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICovXG5cbmV4cG9ydHMuX3Byb3h5ID0gZnVuY3Rpb24gKGtleSkge1xuICAvLyBuZWVkIHRvIHN0b3JlIHJlZiB0byBzZWxmIGhlcmVcbiAgLy8gYmVjYXVzZSB0aGVzZSBnZXR0ZXIvc2V0dGVycyBtaWdodFxuICAvLyBiZSBjYWxsZWQgYnkgY2hpbGQgaW5zdGFuY2VzIVxuICB2YXIgc2VsZiA9IHRoaXNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYsIGtleSwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gcHJveHlHZXR0ZXIgKCkge1xuICAgICAgcmV0dXJuIHNlbGYuX2RhdGFba2V5XVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBwcm94eVNldHRlciAodmFsKSB7XG4gICAgICBzZWxmLl9kYXRhW2tleV0gPSB2YWxcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogVW5wcm94eSBhIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG5leHBvcnRzLl91bnByb3h5ID0gZnVuY3Rpb24gKGtleSkge1xuICBkZWxldGUgdGhpc1trZXldXG59XG5cbi8qKlxuICogRm9yY2UgdXBkYXRlIG9uIGV2ZXJ5IHdhdGNoZXIgaW4gc2NvcGUuXG4gKi9cblxuZXhwb3J0cy5fZGlnZXN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaSA9IHRoaXMuX3dhdGNoZXJMaXN0Lmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdGhpcy5fd2F0Y2hlckxpc3RbaV0udXBkYXRlKClcbiAgfVxuICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlblxuICBpID0gY2hpbGRyZW4ubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGlmICghY2hpbGQuX3JlcGVhdCAmJiBjaGlsZC4kb3B0aW9ucy5pbmhlcml0KSB7XG4gICAgICBjaGlsZC5fZGlnZXN0KClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXR1cCBjb21wdXRlZCBwcm9wZXJ0aWVzLiBUaGV5IGFyZSBlc3NlbnRpYWxseVxuICogc3BlY2lhbCBnZXR0ZXIvc2V0dGVyc1xuICovXG5cbmZ1bmN0aW9uIG5vb3AgKCkge31cbmV4cG9ydHMuX2luaXRDb21wdXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbXB1dGVkID0gdGhpcy4kb3B0aW9ucy5jb21wdXRlZFxuICBpZiAoY29tcHV0ZWQpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gY29tcHV0ZWQpIHtcbiAgICAgIHZhciB1c2VyRGVmID0gY29tcHV0ZWRba2V5XVxuICAgICAgdmFyIGRlZiA9IHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHVzZXJEZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGVmLmdldCA9IF8uYmluZCh1c2VyRGVmLCB0aGlzKVxuICAgICAgICBkZWYuc2V0ID0gbm9vcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVmLmdldCA9IHVzZXJEZWYuZ2V0XG4gICAgICAgICAgPyBfLmJpbmQodXNlckRlZi5nZXQsIHRoaXMpXG4gICAgICAgICAgOiBub29wXG4gICAgICAgIGRlZi5zZXQgPSB1c2VyRGVmLnNldFxuICAgICAgICAgID8gXy5iaW5kKHVzZXJEZWYuc2V0LCB0aGlzKVxuICAgICAgICAgIDogbm9vcFxuICAgICAgfVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgZGVmKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNldHVwIGluc3RhbmNlIG1ldGhvZHMuIE1ldGhvZHMgbXVzdCBiZSBib3VuZCB0byB0aGVcbiAqIGluc3RhbmNlIHNpbmNlIHRoZXkgbWlnaHQgYmUgY2FsbGVkIGJ5IGNoaWxkcmVuXG4gKiBpbmhlcml0aW5nIHRoZW0uXG4gKi9cblxuZXhwb3J0cy5faW5pdE1ldGhvZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtZXRob2RzID0gdGhpcy4kb3B0aW9ucy5tZXRob2RzXG4gIGlmIChtZXRob2RzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIHRoaXNba2V5XSA9IF8uYmluZChtZXRob2RzW2tleV0sIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBtZXRhIGluZm9ybWF0aW9uIGxpa2UgJGluZGV4LCAka2V5ICYgJHZhbHVlLlxuICovXG5cbmV4cG9ydHMuX2luaXRNZXRhID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbWV0YXMgPSB0aGlzLiRvcHRpb25zLl9tZXRhXG4gIGlmIChtZXRhcykge1xuICAgIGZvciAodmFyIGtleSBpbiBtZXRhcykge1xuICAgICAgdGhpcy5fZGVmaW5lTWV0YShrZXksIG1ldGFzW2tleV0pXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGVmaW5lIGEgbWV0YSBwcm9wZXJ0eSwgZS5nICRpbmRleCwgJGtleSwgJHZhbHVlXG4gKiB3aGljaCBvbmx5IGV4aXN0cyBvbiB0aGUgdm0gaW5zdGFuY2UgYnV0IG5vdCBpbiAkZGF0YS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cblxuZXhwb3J0cy5fZGVmaW5lTWV0YSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciBkZXAgPSBuZXcgRGVwKClcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gbWV0YUdldHRlciAoKSB7XG4gICAgICBpZiAoT2JzZXJ2ZXIudGFyZ2V0KSB7XG4gICAgICAgIE9ic2VydmVyLnRhcmdldC5hZGREZXAoZGVwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIG1ldGFTZXR0ZXIgKHZhbCkge1xuICAgICAgaWYgKHZhbCAhPT0gdmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSB2YWxcbiAgICAgICAgZGVwLm5vdGlmeSgpXG4gICAgICB9XG4gICAgfVxuICB9KVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZVxudmFyIGFycmF5TWV0aG9kcyA9IE9iamVjdC5jcmVhdGUoYXJyYXlQcm90bylcblxuLyoqXG4gKiBJbnRlcmNlcHQgbXV0YXRpbmcgbWV0aG9kcyBhbmQgZW1pdCBldmVudHNcbiAqL1xuXG47W1xuICAncHVzaCcsXG4gICdwb3AnLFxuICAnc2hpZnQnLFxuICAndW5zaGlmdCcsXG4gICdzcGxpY2UnLFxuICAnc29ydCcsXG4gICdyZXZlcnNlJ1xuXVxuLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyBjYWNoZSBvcmlnaW5hbCBtZXRob2RcbiAgdmFyIG9yaWdpbmFsID0gYXJyYXlQcm90b1ttZXRob2RdXG4gIF8uZGVmaW5lKGFycmF5TWV0aG9kcywgbWV0aG9kLCBmdW5jdGlvbiBtdXRhdG9yICgpIHtcbiAgICAvLyBhdm9pZCBsZWFraW5nIGFyZ3VtZW50czpcbiAgICAvLyBodHRwOi8vanNwZXJmLmNvbS9jbG9zdXJlLXdpdGgtYXJndW1lbnRzXG4gICAgdmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoaSlcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKVxuICAgIHZhciBvYiA9IHRoaXMuX19vYl9fXG4gICAgdmFyIGluc2VydGVkXG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2UgJ3B1c2gnOlxuICAgICAgICBpbnNlcnRlZCA9IGFyZ3NcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3Vuc2hpZnQnOlxuICAgICAgICBpbnNlcnRlZCA9IGFyZ3NcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3NwbGljZSc6XG4gICAgICAgIGluc2VydGVkID0gYXJncy5zbGljZSgyKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICBpZiAoaW5zZXJ0ZWQpIG9iLm9ic2VydmVBcnJheShpbnNlcnRlZClcbiAgICAvLyBub3RpZnkgY2hhbmdlXG4gICAgb2Iubm90aWZ5KClcbiAgICByZXR1cm4gcmVzdWx0XG4gIH0pXG59KVxuXG4vKipcbiAqIFN3YXAgdGhlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4IHdpdGggYSBuZXcgdmFsdWVcbiAqIGFuZCBlbWl0cyBjb3JyZXNwb25kaW5nIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4geyp9IC0gcmVwbGFjZWQgZWxlbWVudFxuICovXG5cbl8uZGVmaW5lKFxuICBhcnJheVByb3RvLFxuICAnJHNldCcsXG4gIGZ1bmN0aW9uICRzZXQgKGluZGV4LCB2YWwpIHtcbiAgICBpZiAoaW5kZXggPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gaW5kZXggKyAxXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMSwgdmFsKVswXVxuICB9XG4pXG5cbi8qKlxuICogQ29udmVuaWVuY2UgbWV0aG9kIHRvIHJlbW92ZSB0aGUgZWxlbWVudCBhdCBnaXZlbiBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuXy5kZWZpbmUoXG4gIGFycmF5UHJvdG8sXG4gICckcmVtb3ZlJyxcbiAgZnVuY3Rpb24gJHJlbW92ZSAoaW5kZXgpIHtcbiAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgaW5kZXggPSB0aGlzLmluZGV4T2YoaW5kZXgpXG4gICAgfVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDEpWzBdXG4gICAgfVxuICB9XG4pXG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNZXRob2RzIiwidmFyIHVpZCA9IDBcbnZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbi8qKlxuICogQSBkZXAgaXMgYW4gb2JzZXJ2YWJsZSB0aGF0IGNhbiBoYXZlIG11bHRpcGxlXG4gKiBkaXJlY3RpdmVzIHN1YnNjcmliaW5nIHRvIGl0LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIERlcCAoKSB7XG4gIHRoaXMuaWQgPSArK3VpZFxuICB0aGlzLnN1YnMgPSBbXVxufVxuXG52YXIgcCA9IERlcC5wcm90b3R5cGVcblxuLyoqXG4gKiBBZGQgYSBkaXJlY3RpdmUgc3Vic2NyaWJlci5cbiAqXG4gKiBAcGFyYW0ge0RpcmVjdGl2ZX0gc3ViXG4gKi9cblxucC5hZGRTdWIgPSBmdW5jdGlvbiAoc3ViKSB7XG4gIHRoaXMuc3Vicy5wdXNoKHN1Yilcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBkaXJlY3RpdmUgc3Vic2NyaWJlci5cbiAqXG4gKiBAcGFyYW0ge0RpcmVjdGl2ZX0gc3ViXG4gKi9cblxucC5yZW1vdmVTdWIgPSBmdW5jdGlvbiAoc3ViKSB7XG4gIGlmICh0aGlzLnN1YnMubGVuZ3RoKSB7XG4gICAgdmFyIGkgPSB0aGlzLnN1YnMuaW5kZXhPZihzdWIpXG4gICAgaWYgKGkgPiAtMSkgdGhpcy5zdWJzLnNwbGljZShpLCAxKVxuICB9XG59XG5cbi8qKlxuICogTm90aWZ5IGFsbCBzdWJzY3JpYmVycyBvZiBhIG5ldyB2YWx1ZS5cbiAqL1xuXG5wLm5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gc3RhYmxpemUgdGhlIHN1YnNjcmliZXIgbGlzdCBmaXJzdFxuICB2YXIgc3VicyA9IF8udG9BcnJheSh0aGlzLnN1YnMpXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc3Vicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBzdWJzW2ldLnVwZGF0ZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEZXAiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG52YXIgRGVwID0gcmVxdWlyZSgnLi9kZXAnKVxudmFyIGFycmF5TWV0aG9kcyA9IHJlcXVpcmUoJy4vYXJyYXknKVxudmFyIGFycmF5S2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGFycmF5TWV0aG9kcylcbnJlcXVpcmUoJy4vb2JqZWN0JylcblxudmFyIHVpZCA9IDBcblxuLyoqXG4gKiBUeXBlIGVudW1zXG4gKi9cblxudmFyIEFSUkFZICA9IDBcbnZhciBPQkpFQ1QgPSAxXG5cbi8qKlxuICogQXVnbWVudCBhbiB0YXJnZXQgT2JqZWN0IG9yIEFycmF5IGJ5IGludGVyY2VwdGluZ1xuICogdGhlIHByb3RvdHlwZSBjaGFpbiB1c2luZyBfX3Byb3RvX19cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gdGFyZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG9cbiAqL1xuXG5mdW5jdGlvbiBwcm90b0F1Z21lbnQgKHRhcmdldCwgc3JjKSB7XG4gIHRhcmdldC5fX3Byb3RvX18gPSBzcmNcbn1cblxuLyoqXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgZGVmaW5pbmdcbiAqIGhpZGRlbiBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSB0YXJnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b1xuICovXG5cbmZ1bmN0aW9uIGNvcHlBdWdtZW50ICh0YXJnZXQsIHNyYywga2V5cykge1xuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHZhciBrZXlcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBfLmRlZmluZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pXG4gIH1cbn1cblxuLyoqXG4gKiBPYnNlcnZlciBjbGFzcyB0aGF0IGFyZSBhdHRhY2hlZCB0byBlYWNoIG9ic2VydmVkXG4gKiBvYmplY3QuIE9uY2UgYXR0YWNoZWQsIHRoZSBvYnNlcnZlciBjb252ZXJ0cyB0YXJnZXRcbiAqIG9iamVjdCdzIHByb3BlcnR5IGtleXMgaW50byBnZXR0ZXIvc2V0dGVycyB0aGF0XG4gKiBjb2xsZWN0IGRlcGVuZGVuY2llcyBhbmQgZGlzcGF0Y2hlcyB1cGRhdGVzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSB2YWx1ZVxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGVcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIE9ic2VydmVyICh2YWx1ZSwgdHlwZSkge1xuICB0aGlzLmlkID0gKyt1aWRcbiAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICB0aGlzLmRlcHMgPSBbXVxuICBfLmRlZmluZSh2YWx1ZSwgJ19fb2JfXycsIHRoaXMpXG4gIGlmICh0eXBlID09PSBBUlJBWSkge1xuICAgIHZhciBhdWdtZW50ID0gY29uZmlnLnByb3RvICYmIF8uaGFzUHJvdG9cbiAgICAgID8gcHJvdG9BdWdtZW50XG4gICAgICA6IGNvcHlBdWdtZW50XG4gICAgYXVnbWVudCh2YWx1ZSwgYXJyYXlNZXRob2RzLCBhcnJheUtleXMpXG4gICAgdGhpcy5vYnNlcnZlQXJyYXkodmFsdWUpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gT0JKRUNUKSB7XG4gICAgdGhpcy53YWxrKHZhbHVlKVxuICB9XG59XG5cbk9ic2VydmVyLnRhcmdldCA9IG51bGxcblxudmFyIHAgPSBPYnNlcnZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdHRlbXB0IHRvIGNyZWF0ZSBhbiBvYnNlcnZlciBpbnN0YW5jZSBmb3IgYSB2YWx1ZSxcbiAqIHJldHVybnMgdGhlIG5ldyBvYnNlcnZlciBpZiBzdWNjZXNzZnVsbHkgb2JzZXJ2ZWQsXG4gKiBvciB0aGUgZXhpc3Rpbmcgb2JzZXJ2ZXIgaWYgdGhlIHZhbHVlIGFscmVhZHkgaGFzIG9uZS5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtPYnNlcnZlcnx1bmRlZmluZWR9XG4gKiBAc3RhdGljXG4gKi9cblxuT2JzZXJ2ZXIuY3JlYXRlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmIChcbiAgICB2YWx1ZSAmJlxuICAgIHZhbHVlLmhhc093blByb3BlcnR5KCdfX29iX18nKSAmJlxuICAgIHZhbHVlLl9fb2JfXyBpbnN0YW5jZW9mIE9ic2VydmVyXG4gICkge1xuICAgIHJldHVybiB2YWx1ZS5fX29iX19cbiAgfSBlbHNlIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZlcih2YWx1ZSwgQVJSQVkpXG4gIH0gZWxzZSBpZiAoXG4gICAgXy5pc1BsYWluT2JqZWN0KHZhbHVlKSAmJlxuICAgICF2YWx1ZS5faXNWdWUgLy8gYXZvaWQgVnVlIGluc3RhbmNlXG4gICkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2ZXIodmFsdWUsIE9CSkVDVClcbiAgfVxufVxuXG4vKipcbiAqIFdhbGsgdGhyb3VnaCBlYWNoIHByb3BlcnR5IGFuZCBjb252ZXJ0IHRoZW0gaW50b1xuICogZ2V0dGVyL3NldHRlcnMuIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIGNhbGxlZCB3aGVuXG4gKiB2YWx1ZSB0eXBlIGlzIE9iamVjdC4gUHJvcGVydGllcyBwcmVmaXhlZCB3aXRoIGAkYCBvciBgX2BcbiAqIGFuZCBhY2Nlc3NvciBwcm9wZXJ0aWVzIGFyZSBpZ25vcmVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqL1xuXG5wLndhbGsgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHZhciBrZXksIHByZWZpeFxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIHByZWZpeCA9IGtleS5jaGFyQ29kZUF0KDApXG4gICAgaWYgKHByZWZpeCAhPT0gMHgyNCAmJiBwcmVmaXggIT09IDB4NUYpIHsgLy8gc2tpcCAkIG9yIF9cbiAgICAgIHRoaXMuY29udmVydChrZXksIG9ialtrZXldKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRyeSB0byBjYXJldGUgYW4gb2JzZXJ2ZXIgZm9yIGEgY2hpbGQgdmFsdWUsXG4gKiBhbmQgaWYgdmFsdWUgaXMgYXJyYXksIGxpbmsgZGVwIHRvIHRoZSBhcnJheS5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7RGVwfHVuZGVmaW5lZH1cbiAqL1xuXG5wLm9ic2VydmUgPSBmdW5jdGlvbiAodmFsKSB7XG4gIHJldHVybiBPYnNlcnZlci5jcmVhdGUodmFsKVxufVxuXG4vKipcbiAqIE9ic2VydmUgYSBsaXN0IG9mIEFycmF5IGl0ZW1zLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGl0ZW1zXG4gKi9cblxucC5vYnNlcnZlQXJyYXkgPSBmdW5jdGlvbiAoaXRlbXMpIHtcbiAgdmFyIGkgPSBpdGVtcy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIHRoaXMub2JzZXJ2ZShpdGVtc1tpXSlcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBwcm9wZXJ0eSBpbnRvIGdldHRlci9zZXR0ZXIgc28gd2UgY2FuIGVtaXRcbiAqIHRoZSBldmVudHMgd2hlbiB0aGUgcHJvcGVydHkgaXMgYWNjZXNzZWQvY2hhbmdlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbnAuY29udmVydCA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICB2YXIgb2IgPSB0aGlzXG4gIHZhciBjaGlsZE9iID0gb2Iub2JzZXJ2ZSh2YWwpXG4gIHZhciBkZXAgPSBuZXcgRGVwKClcbiAgaWYgKGNoaWxkT2IpIHtcbiAgICBjaGlsZE9iLmRlcHMucHVzaChkZXApXG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iLnZhbHVlLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIE9ic2VydmVyLnRhcmdldCBpcyBhIHdhdGNoZXIgd2hvc2UgZ2V0dGVyIGlzXG4gICAgICAvLyBjdXJyZW50bHkgYmVpbmcgZXZhbHVhdGVkLlxuICAgICAgaWYgKG9iLmFjdGl2ZSAmJiBPYnNlcnZlci50YXJnZXQpIHtcbiAgICAgICAgT2JzZXJ2ZXIudGFyZ2V0LmFkZERlcChkZXApXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgIGlmIChuZXdWYWwgPT09IHZhbCkgcmV0dXJuXG4gICAgICAvLyByZW1vdmUgZGVwIGZyb20gb2xkIHZhbHVlXG4gICAgICB2YXIgb2xkQ2hpbGRPYiA9IHZhbCAmJiB2YWwuX19vYl9fXG4gICAgICBpZiAob2xkQ2hpbGRPYikge1xuICAgICAgICB2YXIgb2xkRGVwcyA9IG9sZENoaWxkT2IuZGVwc1xuICAgICAgICBvbGREZXBzLnNwbGljZShvbGREZXBzLmluZGV4T2YoZGVwKSwgMSlcbiAgICAgIH1cbiAgICAgIHZhbCA9IG5ld1ZhbFxuICAgICAgLy8gYWRkIGRlcCB0byBuZXcgdmFsdWVcbiAgICAgIHZhciBuZXdDaGlsZE9iID0gb2Iub2JzZXJ2ZShuZXdWYWwpXG4gICAgICBpZiAobmV3Q2hpbGRPYikge1xuICAgICAgICBuZXdDaGlsZE9iLmRlcHMucHVzaChkZXApXG4gICAgICB9XG4gICAgICBkZXAubm90aWZ5KClcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogTm90aWZ5IGNoYW5nZSBvbiBhbGwgc2VsZiBkZXBzIG9uIGFuIG9ic2VydmVyLlxuICogVGhpcyBpcyBjYWxsZWQgd2hlbiBhIG11dGFibGUgdmFsdWUgbXV0YXRlcy4gZS5nLlxuICogd2hlbiBhbiBBcnJheSdzIG11dGF0aW5nIG1ldGhvZHMgYXJlIGNhbGxlZCwgb3IgYW5cbiAqIE9iamVjdCdzICRhZGQvJGRlbGV0ZSBhcmUgY2FsbGVkLlxuICovXG5cbnAubm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZGVwcyA9IHRoaXMuZGVwc1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGRlcHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZGVwc1tpXS5ub3RpZnkoKVxuICB9XG59XG5cbi8qKlxuICogQWRkIGFuIG93bmVyIHZtLCBzbyB0aGF0IHdoZW4gJGFkZC8kZGVsZXRlIG11dGF0aW9uc1xuICogaGFwcGVuIHdlIGNhbiBub3RpZnkgb3duZXIgdm1zIHRvIHByb3h5IHRoZSBrZXlzIGFuZFxuICogZGlnZXN0IHRoZSB3YXRjaGVycy4gVGhpcyBpcyBvbmx5IGNhbGxlZCB3aGVuIHRoZSBvYmplY3RcbiAqIGlzIG9ic2VydmVkIGFzIGFuIGluc3RhbmNlJ3Mgcm9vdCAkZGF0YS5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5wLmFkZFZtID0gZnVuY3Rpb24gKHZtKSB7XG4gICh0aGlzLnZtcyA9IHRoaXMudm1zIHx8IFtdKS5wdXNoKHZtKVxufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBvd25lciB2bS4gVGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgb2JqZWN0IGlzXG4gKiBzd2FwcGVkIG91dCBhcyBhbiBpbnN0YW5jZSdzICRkYXRhIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5wLnJlbW92ZVZtID0gZnVuY3Rpb24gKHZtKSB7XG4gIHRoaXMudm1zLnNwbGljZSh0aGlzLnZtcy5pbmRleE9mKHZtKSwgMSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlcnZlclxuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBvYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGVcblxuLyoqXG4gKiBBZGQgYSBuZXcgcHJvcGVydHkgdG8gYW4gb2JzZXJ2ZWQgb2JqZWN0XG4gKiBhbmQgZW1pdHMgY29ycmVzcG9uZGluZyBldmVudFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcHVibGljXG4gKi9cblxuXy5kZWZpbmUoXG4gIG9ialByb3RvLFxuICAnJGFkZCcsXG4gIGZ1bmN0aW9uICRhZGQgKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICBpZiAoIW9iIHx8IF8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBvYi5jb252ZXJ0KGtleSwgdmFsKVxuICAgIGlmIChvYi52bXMpIHtcbiAgICAgIHZhciBpID0gb2Iudm1zLmxlbmd0aFxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICB2YXIgdm0gPSBvYi52bXNbaV1cbiAgICAgICAgdm0uX3Byb3h5KGtleSlcbiAgICAgICAgdm0uX2RpZ2VzdCgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iLm5vdGlmeSgpXG4gICAgfVxuICB9XG4pXG5cbi8qKlxuICogRGVsZXRlcyBhIHByb3BlcnR5IGZyb20gYW4gb2JzZXJ2ZWQgb2JqZWN0XG4gKiBhbmQgZW1pdHMgY29ycmVzcG9uZGluZyBldmVudFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwdWJsaWNcbiAqL1xuXG5fLmRlZmluZShcbiAgb2JqUHJvdG8sXG4gICckZGVsZXRlJyxcbiAgZnVuY3Rpb24gJGRlbGV0ZSAoa2V5KSB7XG4gICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHJldHVyblxuICAgIGRlbGV0ZSB0aGlzW2tleV1cbiAgICB2YXIgb2IgPSB0aGlzLl9fb2JfX1xuICAgIGlmICghb2IgfHwgXy5pc1Jlc2VydmVkKGtleSkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAob2Iudm1zKSB7XG4gICAgICB2YXIgaSA9IG9iLnZtcy5sZW5ndGhcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdmFyIHZtID0gb2Iudm1zW2ldXG4gICAgICAgIHZtLl91bnByb3h5KGtleSlcbiAgICAgICAgdm0uX2RpZ2VzdCgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iLm5vdGlmeSgpXG4gICAgfVxuICB9XG4pIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciBjYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxudmFyIGFyZ1JFID0gL15bXlxce1xcP10rJHxeJ1teJ10qJyR8XlwiW15cIl0qXCIkL1xudmFyIGZpbHRlclRva2VuUkUgPSAvW15cXHMnXCJdK3wnW14nXSsnfFwiW15cIl0rXCIvZ1xuXG4vKipcbiAqIFBhcnNlciBzdGF0ZVxuICovXG5cbnZhciBzdHJcbnZhciBjLCBpLCBsXG52YXIgaW5TaW5nbGVcbnZhciBpbkRvdWJsZVxudmFyIGN1cmx5XG52YXIgc3F1YXJlXG52YXIgcGFyZW5cbnZhciBiZWdpblxudmFyIGFyZ0luZGV4XG52YXIgZGlyc1xudmFyIGRpclxudmFyIGxhc3RGaWx0ZXJJbmRleFxudmFyIGFyZ1xuXG4vKipcbiAqIFB1c2ggYSBkaXJlY3RpdmUgb2JqZWN0IGludG8gdGhlIHJlc3VsdCBBcnJheVxuICovXG5cbmZ1bmN0aW9uIHB1c2hEaXIgKCkge1xuICBkaXIucmF3ID0gc3RyLnNsaWNlKGJlZ2luLCBpKS50cmltKClcbiAgaWYgKGRpci5leHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICBkaXIuZXhwcmVzc2lvbiA9IHN0ci5zbGljZShhcmdJbmRleCwgaSkudHJpbSgpXG4gIH0gZWxzZSBpZiAobGFzdEZpbHRlckluZGV4ICE9PSBiZWdpbikge1xuICAgIHB1c2hGaWx0ZXIoKVxuICB9XG4gIGlmIChpID09PSAwIHx8IGRpci5leHByZXNzaW9uKSB7XG4gICAgZGlycy5wdXNoKGRpcilcbiAgfVxufVxuXG4vKipcbiAqIFB1c2ggYSBmaWx0ZXIgdG8gdGhlIGN1cnJlbnQgZGlyZWN0aXZlIG9iamVjdFxuICovXG5cbmZ1bmN0aW9uIHB1c2hGaWx0ZXIgKCkge1xuICB2YXIgZXhwID0gc3RyLnNsaWNlKGxhc3RGaWx0ZXJJbmRleCwgaSkudHJpbSgpXG4gIHZhciBmaWx0ZXJcbiAgaWYgKGV4cCkge1xuICAgIGZpbHRlciA9IHt9XG4gICAgdmFyIHRva2VucyA9IGV4cC5tYXRjaChmaWx0ZXJUb2tlblJFKVxuICAgIGZpbHRlci5uYW1lID0gdG9rZW5zWzBdXG4gICAgZmlsdGVyLmFyZ3MgPSB0b2tlbnMubGVuZ3RoID4gMSA/IHRva2Vucy5zbGljZSgxKSA6IG51bGxcbiAgfVxuICBpZiAoZmlsdGVyKSB7XG4gICAgKGRpci5maWx0ZXJzID0gZGlyLmZpbHRlcnMgfHwgW10pLnB1c2goZmlsdGVyKVxuICB9XG4gIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG59XG5cbi8qKlxuICogUGFyc2UgYSBkaXJlY3RpdmUgc3RyaW5nIGludG8gYW4gQXJyYXkgb2YgQVNULWxpa2VcbiAqIG9iamVjdHMgcmVwcmVzZW50aW5nIGRpcmVjdGl2ZXMuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBcImNsaWNrOiBhID0gYSArIDEgfCB1cHBlcmNhc2VcIiB3aWxsIHlpZWxkOlxuICoge1xuICogICBhcmc6ICdjbGljaycsXG4gKiAgIGV4cHJlc3Npb246ICdhID0gYSArIDEnLFxuICogICBmaWx0ZXJzOiBbXG4gKiAgICAgeyBuYW1lOiAndXBwZXJjYXNlJywgYXJnczogbnVsbCB9XG4gKiAgIF1cbiAqIH1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAocykge1xuXG4gIHZhciBoaXQgPSBjYWNoZS5nZXQocylcbiAgaWYgKGhpdCkge1xuICAgIHJldHVybiBoaXRcbiAgfVxuXG4gIC8vIHJlc2V0IHBhcnNlciBzdGF0ZVxuICBzdHIgPSBzXG4gIGluU2luZ2xlID0gaW5Eb3VibGUgPSBmYWxzZVxuICBjdXJseSA9IHNxdWFyZSA9IHBhcmVuID0gYmVnaW4gPSBhcmdJbmRleCA9IDBcbiAgbGFzdEZpbHRlckluZGV4ID0gMFxuICBkaXJzID0gW11cbiAgZGlyID0ge31cbiAgYXJnID0gbnVsbFxuXG4gIGZvciAoaSA9IDAsIGwgPSBzdHIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGluU2luZ2xlKSB7XG4gICAgICAvLyBjaGVjayBzaW5nbGUgcXVvdGVcbiAgICAgIGlmIChjID09PSAweDI3KSBpblNpbmdsZSA9ICFpblNpbmdsZVxuICAgIH0gZWxzZSBpZiAoaW5Eb3VibGUpIHtcbiAgICAgIC8vIGNoZWNrIGRvdWJsZSBxdW90ZVxuICAgICAgaWYgKGMgPT09IDB4MjIpIGluRG91YmxlID0gIWluRG91YmxlXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGMgPT09IDB4MkMgJiYgLy8gY29tbWFcbiAgICAgICFwYXJlbiAmJiAhY3VybHkgJiYgIXNxdWFyZVxuICAgICkge1xuICAgICAgLy8gcmVhY2hlZCB0aGUgZW5kIG9mIGEgZGlyZWN0aXZlXG4gICAgICBwdXNoRGlyKClcbiAgICAgIC8vIHJlc2V0ICYgc2tpcCB0aGUgY29tbWFcbiAgICAgIGRpciA9IHt9XG4gICAgICBiZWdpbiA9IGFyZ0luZGV4ID0gbGFzdEZpbHRlckluZGV4ID0gaSArIDFcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgYyA9PT0gMHgzQSAmJiAvLyBjb2xvblxuICAgICAgIWRpci5leHByZXNzaW9uICYmXG4gICAgICAhZGlyLmFyZ1xuICAgICkge1xuICAgICAgLy8gYXJndW1lbnRcbiAgICAgIGFyZyA9IHN0ci5zbGljZShiZWdpbiwgaSkudHJpbSgpXG4gICAgICAvLyB0ZXN0IGZvciB2YWxpZCBhcmd1bWVudCBoZXJlXG4gICAgICAvLyBzaW5jZSB3ZSBtYXkgaGF2ZSBjYXVnaHQgc3R1ZmYgbGlrZSBmaXJzdCBoYWxmIG9mXG4gICAgICAvLyBhbiBvYmplY3QgbGl0ZXJhbCBvciBhIHRlcm5hcnkgZXhwcmVzc2lvbi5cbiAgICAgIGlmIChhcmdSRS50ZXN0KGFyZykpIHtcbiAgICAgICAgYXJnSW5kZXggPSBpICsgMVxuICAgICAgICBkaXIuYXJnID0gXy5zdHJpcFF1b3RlcyhhcmcpIHx8IGFyZ1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjID09PSAweDdDICYmIC8vIHBpcGVcbiAgICAgIHN0ci5jaGFyQ29kZUF0KGkgKyAxKSAhPT0gMHg3QyAmJlxuICAgICAgc3RyLmNoYXJDb2RlQXQoaSAtIDEpICE9PSAweDdDXG4gICAgKSB7XG4gICAgICBpZiAoZGlyLmV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBmaXJzdCBmaWx0ZXIsIGVuZCBvZiBleHByZXNzaW9uXG4gICAgICAgIGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG4gICAgICAgIGRpci5leHByZXNzaW9uID0gc3RyLnNsaWNlKGFyZ0luZGV4LCBpKS50cmltKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGFscmVhZHkgaGFzIGZpbHRlclxuICAgICAgICBwdXNoRmlsdGVyKClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgIGNhc2UgMHgyMjogaW5Eb3VibGUgPSB0cnVlOyBicmVhayAvLyBcIlxuICAgICAgICBjYXNlIDB4Mjc6IGluU2luZ2xlID0gdHJ1ZTsgYnJlYWsgLy8gJ1xuICAgICAgICBjYXNlIDB4Mjg6IHBhcmVuKys7IGJyZWFrICAgICAgICAgLy8gKFxuICAgICAgICBjYXNlIDB4Mjk6IHBhcmVuLS07IGJyZWFrICAgICAgICAgLy8gKVxuICAgICAgICBjYXNlIDB4NUI6IHNxdWFyZSsrOyBicmVhayAgICAgICAgLy8gW1xuICAgICAgICBjYXNlIDB4NUQ6IHNxdWFyZS0tOyBicmVhayAgICAgICAgLy8gXVxuICAgICAgICBjYXNlIDB4N0I6IGN1cmx5Kys7IGJyZWFrICAgICAgICAgLy8ge1xuICAgICAgICBjYXNlIDB4N0Q6IGN1cmx5LS07IGJyZWFrICAgICAgICAgLy8gfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChpID09PSAwIHx8IGJlZ2luICE9PSBpKSB7XG4gICAgcHVzaERpcigpXG4gIH1cblxuICBjYWNoZS5wdXQocywgZGlycylcbiAgcmV0dXJuIGRpcnNcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIFBhdGggPSByZXF1aXJlKCcuL3BhdGgnKVxudmFyIENhY2hlID0gcmVxdWlyZSgnLi4vY2FjaGUnKVxudmFyIGV4cHJlc3Npb25DYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxuXG52YXIga2V5d29yZHMgPVxuICAnTWF0aCxEYXRlLGJyZWFrLGNhc2UsY2F0Y2gsY29udGludWUsZGVidWdnZXIsZGVmYXVsdCwnICtcbiAgJ2RlbGV0ZSxkbyxlbHNlLGZhbHNlLGZpbmFsbHksZm9yLGZ1bmN0aW9uLGlmLGluLCcgK1xuICAnaW5zdGFuY2VvZixuZXcsbnVsbCxyZXR1cm4sc3dpdGNoLHRoaXMsdGhyb3csdHJ1ZSx0cnksJyArXG4gICd0eXBlb2YsdmFyLHZvaWQsd2hpbGUsd2l0aCx1bmRlZmluZWQsYWJzdHJhY3QsYm9vbGVhbiwnICtcbiAgJ2J5dGUsY2hhcixjbGFzcyxjb25zdCxkb3VibGUsZW51bSxleHBvcnQsZXh0ZW5kcywnICtcbiAgJ2ZpbmFsLGZsb2F0LGdvdG8saW1wbGVtZW50cyxpbXBvcnQsaW50LGludGVyZmFjZSxsb25nLCcgK1xuICAnbmF0aXZlLHBhY2thZ2UscHJpdmF0ZSxwcm90ZWN0ZWQscHVibGljLHNob3J0LHN0YXRpYywnICtcbiAgJ3N1cGVyLHN5bmNocm9uaXplZCx0aHJvd3MsdHJhbnNpZW50LHZvbGF0aWxlLCcgK1xuICAnYXJndW1lbnRzLGxldCx5aWVsZCdcblxudmFyIHdzUkUgPSAvXFxzL2dcbnZhciBuZXdsaW5lUkUgPSAvXFxuL2dcbnZhciBzYXZlUkUgPSAvW1xceyxdXFxzKltcXHdcXCRfXStcXHMqOnwoJ1teJ10qJ3xcIlteXCJdKlwiKXxuZXcgL2dcbnZhciByZXN0b3JlUkUgPSAvXCIoXFxkKylcIi9nXG52YXIgcGF0aFRlc3RSRSA9IC9eW0EtWmEtel8kXVtcXHckXSooXFwuW0EtWmEtel8kXVtcXHckXSp8XFxbJy4qPydcXF18XFxbXCIuKj9cIlxcXXxcXFtcXGQrXFxdKSokL1xudmFyIHBhdGhSZXBsYWNlUkUgPSAvW15cXHckXFwuXShbQS1aYS16XyRdW1xcdyRdKihcXC5bQS1aYS16XyRdW1xcdyRdKnxcXFsnLio/J1xcXXxcXFtcIi4qP1wiXFxdKSopL2dcbnZhciBrZXl3b3Jkc1JFID0gbmV3IFJlZ0V4cCgnXignICsga2V5d29yZHMucmVwbGFjZSgvLC9nLCAnXFxcXGJ8JykgKyAnXFxcXGIpJylcbnZhciBib29sZWFuTGl0ZXJhbFJFID0gL14odHJ1ZXxmYWxzZSkkL1xuXG4vKipcbiAqIFNhdmUgLyBSZXdyaXRlIC8gUmVzdG9yZVxuICpcbiAqIFdoZW4gcmV3cml0aW5nIHBhdGhzIGZvdW5kIGluIGFuIGV4cHJlc3Npb24sIGl0IGlzXG4gKiBwb3NzaWJsZSBmb3IgdGhlIHNhbWUgbGV0dGVyIHNlcXVlbmNlcyB0byBiZSBmb3VuZCBpblxuICogc3RyaW5ncyBhbmQgT2JqZWN0IGxpdGVyYWwgcHJvcGVydHkga2V5cy4gVGhlcmVmb3JlIHdlXG4gKiByZW1vdmUgYW5kIHN0b3JlIHRoZXNlIHBhcnRzIGluIGEgdGVtcG9yYXJ5IGFycmF5LCBhbmRcbiAqIHJlc3RvcmUgdGhlbSBhZnRlciB0aGUgcGF0aCByZXdyaXRlLlxuICovXG5cbnZhciBzYXZlZCA9IFtdXG5cbi8qKlxuICogU2F2ZSByZXBsYWNlclxuICpcbiAqIFRoZSBzYXZlIHJlZ2V4IGNhbiBtYXRjaCB0d28gcG9zc2libGUgY2FzZXM6XG4gKiAxLiBBbiBvcGVuaW5nIG9iamVjdCBsaXRlcmFsXG4gKiAyLiBBIHN0cmluZ1xuICogSWYgbWF0Y2hlZCBhcyBhIHBsYWluIHN0cmluZywgd2UgbmVlZCB0byBlc2NhcGUgaXRzXG4gKiBuZXdsaW5lcywgc2luY2UgdGhlIHN0cmluZyBuZWVkcyB0byBiZSBwcmVzZXJ2ZWQgd2hlblxuICogZ2VuZXJhdGluZyB0aGUgZnVuY3Rpb24gYm9keS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gaXNTdHJpbmcgLSBzdHIgaWYgbWF0Y2hlZCBhcyBhIHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSAtIHBsYWNlaG9sZGVyIHdpdGggaW5kZXhcbiAqL1xuXG5mdW5jdGlvbiBzYXZlIChzdHIsIGlzU3RyaW5nKSB7XG4gIHZhciBpID0gc2F2ZWQubGVuZ3RoXG4gIHNhdmVkW2ldID0gaXNTdHJpbmdcbiAgICA/IHN0ci5yZXBsYWNlKG5ld2xpbmVSRSwgJ1xcXFxuJylcbiAgICA6IHN0clxuICByZXR1cm4gJ1wiJyArIGkgKyAnXCInXG59XG5cbi8qKlxuICogUGF0aCByZXdyaXRlIHJlcGxhY2VyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJhd1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHJld3JpdGUgKHJhdykge1xuICB2YXIgYyA9IHJhdy5jaGFyQXQoMClcbiAgdmFyIHBhdGggPSByYXcuc2xpY2UoMSlcbiAgaWYgKGtleXdvcmRzUkUudGVzdChwYXRoKSkge1xuICAgIHJldHVybiByYXdcbiAgfSBlbHNlIHtcbiAgICBwYXRoID0gcGF0aC5pbmRleE9mKCdcIicpID4gLTFcbiAgICAgID8gcGF0aC5yZXBsYWNlKHJlc3RvcmVSRSwgcmVzdG9yZSlcbiAgICAgIDogcGF0aFxuICAgIHJldHVybiBjICsgJ3Njb3BlLicgKyBwYXRoXG4gIH1cbn1cblxuLyoqXG4gKiBSZXN0b3JlIHJlcGxhY2VyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGkgLSBtYXRjaGVkIHNhdmUgaW5kZXhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiByZXN0b3JlIChzdHIsIGkpIHtcbiAgcmV0dXJuIHNhdmVkW2ldXG59XG5cbi8qKlxuICogUmV3cml0ZSBhbiBleHByZXNzaW9uLCBwcmVmaXhpbmcgYWxsIHBhdGggYWNjZXNzb3JzIHdpdGhcbiAqIGBzY29wZS5gIGFuZCBnZW5lcmF0ZSBnZXR0ZXIvc2V0dGVyIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG5lZWRTZXRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVFeHBGbnMgKGV4cCwgbmVlZFNldCkge1xuICAvLyByZXNldCBzdGF0ZVxuICBzYXZlZC5sZW5ndGggPSAwXG4gIC8vIHNhdmUgc3RyaW5ncyBhbmQgb2JqZWN0IGxpdGVyYWwga2V5c1xuICB2YXIgYm9keSA9IGV4cFxuICAgIC5yZXBsYWNlKHNhdmVSRSwgc2F2ZSlcbiAgICAucmVwbGFjZSh3c1JFLCAnJylcbiAgLy8gcmV3cml0ZSBhbGwgcGF0aHNcbiAgLy8gcGFkIDEgc3BhY2UgaGVyZSBiZWNhdWUgdGhlIHJlZ2V4IG1hdGNoZXMgMSBleHRyYSBjaGFyXG4gIGJvZHkgPSAoJyAnICsgYm9keSlcbiAgICAucmVwbGFjZShwYXRoUmVwbGFjZVJFLCByZXdyaXRlKVxuICAgIC5yZXBsYWNlKHJlc3RvcmVSRSwgcmVzdG9yZSlcbiAgdmFyIGdldHRlciA9IG1ha2VHZXR0ZXIoYm9keSlcbiAgaWYgKGdldHRlcikge1xuICAgIHJldHVybiB7XG4gICAgICBnZXQ6IGdldHRlcixcbiAgICAgIGJvZHk6IGJvZHksXG4gICAgICBzZXQ6IG5lZWRTZXRcbiAgICAgICAgPyBtYWtlU2V0dGVyKGJvZHkpXG4gICAgICAgIDogbnVsbFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgZ2V0dGVyIHNldHRlcnMgZm9yIGEgc2ltcGxlIHBhdGguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZVBhdGhGbnMgKGV4cCkge1xuICB2YXIgZ2V0dGVyLCBwYXRoXG4gIGlmIChleHAuaW5kZXhPZignWycpIDwgMCkge1xuICAgIC8vIHJlYWxseSBzaW1wbGUgcGF0aFxuICAgIHBhdGggPSBleHAuc3BsaXQoJy4nKVxuICAgIGdldHRlciA9IFBhdGguY29tcGlsZUdldHRlcihwYXRoKVxuICB9IGVsc2Uge1xuICAgIC8vIGRvIHRoZSByZWFsIHBhcnNpbmdcbiAgICBwYXRoID0gUGF0aC5wYXJzZShleHApXG4gICAgZ2V0dGVyID0gcGF0aC5nZXRcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldDogZ2V0dGVyLFxuICAgIC8vIGFsd2F5cyBnZW5lcmF0ZSBzZXR0ZXIgZm9yIHNpbXBsZSBwYXRoc1xuICAgIHNldDogZnVuY3Rpb24gKG9iaiwgdmFsKSB7XG4gICAgICBQYXRoLnNldChvYmosIHBhdGgsIHZhbClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBCdWlsZCBhIGdldHRlciBmdW5jdGlvbi4gUmVxdWlyZXMgZXZhbC5cbiAqXG4gKiBXZSBpc29sYXRlIHRoZSB0cnkvY2F0Y2ggc28gaXQgZG9lc24ndCBhZmZlY3QgdGhlXG4gKiBvcHRpbWl6YXRpb24gb2YgdGhlIHBhcnNlIGZ1bmN0aW9uIHdoZW4gaXQgaXMgbm90IGNhbGxlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYm9keVxuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIG1ha2VHZXR0ZXIgKGJvZHkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdzY29wZScsICdyZXR1cm4gJyArIGJvZHkgKyAnOycpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfLndhcm4oXG4gICAgICAnSW52YWxpZCBleHByZXNzaW9uLiAnICtcbiAgICAgICdHZW5lcmF0ZWQgZnVuY3Rpb24gYm9keTogJyArIGJvZHlcbiAgICApXG4gIH1cbn1cblxuLyoqXG4gKiBCdWlsZCBhIHNldHRlciBmdW5jdGlvbi5cbiAqXG4gKiBUaGlzIGlzIG9ubHkgbmVlZGVkIGluIHJhcmUgc2l0dWF0aW9ucyBsaWtlIFwiYVtiXVwiIHdoZXJlXG4gKiBhIHNldHRhYmxlIHBhdGggcmVxdWlyZXMgZHluYW1pYyBldmFsdWF0aW9uLlxuICpcbiAqIFRoaXMgc2V0dGVyIGZ1bmN0aW9uIG1heSB0aHJvdyBlcnJvciB3aGVuIGNhbGxlZCBpZiB0aGVcbiAqIGV4cHJlc3Npb24gYm9keSBpcyBub3QgYSB2YWxpZCBsZWZ0LWhhbmQgZXhwcmVzc2lvbiBpblxuICogYXNzaWdubWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYm9keVxuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIG1ha2VTZXR0ZXIgKGJvZHkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdzY29wZScsICd2YWx1ZScsIGJvZHkgKyAnPXZhbHVlOycpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBfLndhcm4oJ0ludmFsaWQgc2V0dGVyIGZ1bmN0aW9uIGJvZHk6ICcgKyBib2R5KVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgZm9yIHNldHRlciBleGlzdGVuY2Ugb24gYSBjYWNoZSBoaXQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGl0XG4gKi9cblxuZnVuY3Rpb24gY2hlY2tTZXR0ZXIgKGhpdCkge1xuICBpZiAoIWhpdC5zZXQpIHtcbiAgICBoaXQuc2V0ID0gbWFrZVNldHRlcihoaXQuYm9keSlcbiAgfVxufVxuXG4vKipcbiAqIFBhcnNlIGFuIGV4cHJlc3Npb24gaW50byByZS13cml0dGVuIGdldHRlci9zZXR0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbmVlZFNldFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChleHAsIG5lZWRTZXQpIHtcbiAgZXhwID0gZXhwLnRyaW0oKVxuICAvLyB0cnkgY2FjaGVcbiAgdmFyIGhpdCA9IGV4cHJlc3Npb25DYWNoZS5nZXQoZXhwKVxuICBpZiAoaGl0KSB7XG4gICAgaWYgKG5lZWRTZXQpIHtcbiAgICAgIGNoZWNrU2V0dGVyKGhpdClcbiAgICB9XG4gICAgcmV0dXJuIGhpdFxuICB9XG4gIC8vIHdlIGRvIGEgc2ltcGxlIHBhdGggY2hlY2sgdG8gb3B0aW1pemUgZm9yIHRoZW0uXG4gIC8vIHRoZSBjaGVjayBmYWlscyB2YWxpZCBwYXRocyB3aXRoIHVudXNhbCB3aGl0ZXNwYWNlcyxcbiAgLy8gYnV0IHRoYXQncyB0b28gcmFyZSBhbmQgd2UgZG9uJ3QgY2FyZS5cbiAgLy8gYWxzbyBza2lwIGJvb2xlYW4gbGl0ZXJhbHMgYW5kIHBhdGhzIHRoYXQgc3RhcnQgd2l0aFxuICAvLyBnbG9iYWwgXCJNYXRoXCJcbiAgdmFyIHJlcyA9XG4gICAgcGF0aFRlc3RSRS50ZXN0KGV4cCkgJiZcbiAgICAhYm9vbGVhbkxpdGVyYWxSRS50ZXN0KGV4cCkgJiZcbiAgICBleHAuc2xpY2UoMCwgNSkgIT09ICdNYXRoLidcbiAgICAgID8gY29tcGlsZVBhdGhGbnMoZXhwKVxuICAgICAgOiBjb21waWxlRXhwRm5zKGV4cCwgbmVlZFNldClcbiAgZXhwcmVzc2lvbkNhY2hlLnB1dChleHAsIHJlcylcbiAgcmV0dXJuIHJlc1xufVxuXG4vLyBFeHBvcnQgdGhlIHBhdGhSZWdleCBmb3IgZXh0ZXJuYWwgdXNlXG5leHBvcnRzLnBhdGhUZXN0UkUgPSBwYXRoVGVzdFJFIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciBwYXRoQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbnZhciBpZGVudFJFID0gL15bJF9hLXpBLVpdK1tcXHckXSokL1xuXG4vKipcbiAqIFBhdGgtcGFyc2luZyBhbGdvcml0aG0gc2Nvb3BlZCBmcm9tIFBvbHltZXIvb2JzZXJ2ZS1qc1xuICovXG5cbnZhciBwYXRoU3RhdGVNYWNoaW5lID0ge1xuICAnYmVmb3JlUGF0aCc6IHtcbiAgICAnd3MnOiBbJ2JlZm9yZVBhdGgnXSxcbiAgICAnaWRlbnQnOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ10sXG4gICAgJ1snOiBbJ2JlZm9yZUVsZW1lbnQnXSxcbiAgICAnZW9mJzogWydhZnRlclBhdGgnXVxuICB9LFxuXG4gICdpblBhdGgnOiB7XG4gICAgJ3dzJzogWydpblBhdGgnXSxcbiAgICAnLic6IFsnYmVmb3JlSWRlbnQnXSxcbiAgICAnWyc6IFsnYmVmb3JlRWxlbWVudCddLFxuICAgICdlb2YnOiBbJ2FmdGVyUGF0aCddXG4gIH0sXG5cbiAgJ2JlZm9yZUlkZW50Jzoge1xuICAgICd3cyc6IFsnYmVmb3JlSWRlbnQnXSxcbiAgICAnaWRlbnQnOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ11cbiAgfSxcblxuICAnaW5JZGVudCc6IHtcbiAgICAnaWRlbnQnOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ10sXG4gICAgJzAnOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ10sXG4gICAgJ251bWJlcic6IFsnaW5JZGVudCcsICdhcHBlbmQnXSxcbiAgICAnd3MnOiBbJ2luUGF0aCcsICdwdXNoJ10sXG4gICAgJy4nOiBbJ2JlZm9yZUlkZW50JywgJ3B1c2gnXSxcbiAgICAnWyc6IFsnYmVmb3JlRWxlbWVudCcsICdwdXNoJ10sXG4gICAgJ2VvZic6IFsnYWZ0ZXJQYXRoJywgJ3B1c2gnXVxuICB9LFxuXG4gICdiZWZvcmVFbGVtZW50Jzoge1xuICAgICd3cyc6IFsnYmVmb3JlRWxlbWVudCddLFxuICAgICcwJzogWydhZnRlclplcm8nLCAnYXBwZW5kJ10sXG4gICAgJ251bWJlcic6IFsnaW5JbmRleCcsICdhcHBlbmQnXSxcbiAgICBcIidcIjogWydpblNpbmdsZVF1b3RlJywgJ2FwcGVuZCcsICcnXSxcbiAgICAnXCInOiBbJ2luRG91YmxlUXVvdGUnLCAnYXBwZW5kJywgJyddXG4gIH0sXG5cbiAgJ2FmdGVyWmVybyc6IHtcbiAgICAnd3MnOiBbJ2FmdGVyRWxlbWVudCcsICdwdXNoJ10sXG4gICAgJ10nOiBbJ2luUGF0aCcsICdwdXNoJ11cbiAgfSxcblxuICAnaW5JbmRleCc6IHtcbiAgICAnMCc6IFsnaW5JbmRleCcsICdhcHBlbmQnXSxcbiAgICAnbnVtYmVyJzogWydpbkluZGV4JywgJ2FwcGVuZCddLFxuICAgICd3cyc6IFsnYWZ0ZXJFbGVtZW50J10sXG4gICAgJ10nOiBbJ2luUGF0aCcsICdwdXNoJ11cbiAgfSxcblxuICAnaW5TaW5nbGVRdW90ZSc6IHtcbiAgICBcIidcIjogWydhZnRlckVsZW1lbnQnXSxcbiAgICAnZW9mJzogJ2Vycm9yJyxcbiAgICAnZWxzZSc6IFsnaW5TaW5nbGVRdW90ZScsICdhcHBlbmQnXVxuICB9LFxuXG4gICdpbkRvdWJsZVF1b3RlJzoge1xuICAgICdcIic6IFsnYWZ0ZXJFbGVtZW50J10sXG4gICAgJ2VvZic6ICdlcnJvcicsXG4gICAgJ2Vsc2UnOiBbJ2luRG91YmxlUXVvdGUnLCAnYXBwZW5kJ11cbiAgfSxcblxuICAnYWZ0ZXJFbGVtZW50Jzoge1xuICAgICd3cyc6IFsnYWZ0ZXJFbGVtZW50J10sXG4gICAgJ10nOiBbJ2luUGF0aCcsICdwdXNoJ11cbiAgfVxufVxuXG5mdW5jdGlvbiBub29wICgpIHt9XG5cbi8qKlxuICogRGV0ZXJtaW5lIHRoZSB0eXBlIG9mIGEgY2hhcmFjdGVyIGluIGEga2V5cGF0aC5cbiAqXG4gKiBAcGFyYW0ge0NoYXJ9IGNoYXJcbiAqIEByZXR1cm4ge1N0cmluZ30gdHlwZVxuICovXG5cbmZ1bmN0aW9uIGdldFBhdGhDaGFyVHlwZSAoY2hhcikge1xuICBpZiAoY2hhciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuICdlb2YnXG4gIH1cblxuICB2YXIgY29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKVxuXG4gIHN3aXRjaChjb2RlKSB7XG4gICAgY2FzZSAweDVCOiAvLyBbXG4gICAgY2FzZSAweDVEOiAvLyBdXG4gICAgY2FzZSAweDJFOiAvLyAuXG4gICAgY2FzZSAweDIyOiAvLyBcIlxuICAgIGNhc2UgMHgyNzogLy8gJ1xuICAgIGNhc2UgMHgzMDogLy8gMFxuICAgICAgcmV0dXJuIGNoYXJcblxuICAgIGNhc2UgMHg1RjogLy8gX1xuICAgIGNhc2UgMHgyNDogLy8gJFxuICAgICAgcmV0dXJuICdpZGVudCdcblxuICAgIGNhc2UgMHgyMDogLy8gU3BhY2VcbiAgICBjYXNlIDB4MDk6IC8vIFRhYlxuICAgIGNhc2UgMHgwQTogLy8gTmV3bGluZVxuICAgIGNhc2UgMHgwRDogLy8gUmV0dXJuXG4gICAgY2FzZSAweEEwOiAgLy8gTm8tYnJlYWsgc3BhY2VcbiAgICBjYXNlIDB4RkVGRjogIC8vIEJ5dGUgT3JkZXIgTWFya1xuICAgIGNhc2UgMHgyMDI4OiAgLy8gTGluZSBTZXBhcmF0b3JcbiAgICBjYXNlIDB4MjAyOTogIC8vIFBhcmFncmFwaCBTZXBhcmF0b3JcbiAgICAgIHJldHVybiAnd3MnXG4gIH1cblxuICAvLyBhLXosIEEtWlxuICBpZiAoKDB4NjEgPD0gY29kZSAmJiBjb2RlIDw9IDB4N0EpIHx8XG4gICAgICAoMHg0MSA8PSBjb2RlICYmIGNvZGUgPD0gMHg1QSkpIHtcbiAgICByZXR1cm4gJ2lkZW50J1xuICB9XG5cbiAgLy8gMS05XG4gIGlmICgweDMxIDw9IGNvZGUgJiYgY29kZSA8PSAweDM5KSB7XG4gICAgcmV0dXJuICdudW1iZXInXG4gIH1cblxuICByZXR1cm4gJ2Vsc2UnXG59XG5cbi8qKlxuICogUGFyc2UgYSBzdHJpbmcgcGF0aCBpbnRvIGFuIGFycmF5IG9mIHNlZ21lbnRzXG4gKiBUb2RvIGltcGxlbWVudCBjYWNoZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcmV0dXJuIHtBcnJheXx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gcGFyc2VQYXRoIChwYXRoKSB7XG4gIHZhciBrZXlzID0gW11cbiAgdmFyIGluZGV4ID0gLTFcbiAgdmFyIG1vZGUgPSAnYmVmb3JlUGF0aCdcbiAgdmFyIGMsIG5ld0NoYXIsIGtleSwgdHlwZSwgdHJhbnNpdGlvbiwgYWN0aW9uLCB0eXBlTWFwXG5cbiAgdmFyIGFjdGlvbnMgPSB7XG4gICAgcHVzaDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBrZXlzLnB1c2goa2V5KVxuICAgICAga2V5ID0gdW5kZWZpbmVkXG4gICAgfSxcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGtleSA9IG5ld0NoYXJcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGtleSArPSBuZXdDaGFyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWF5YmVVbmVzY2FwZVF1b3RlICgpIHtcbiAgICB2YXIgbmV4dENoYXIgPSBwYXRoW2luZGV4ICsgMV1cbiAgICBpZiAoKG1vZGUgPT09ICdpblNpbmdsZVF1b3RlJyAmJiBuZXh0Q2hhciA9PT0gXCInXCIpIHx8XG4gICAgICAgIChtb2RlID09PSAnaW5Eb3VibGVRdW90ZScgJiYgbmV4dENoYXIgPT09ICdcIicpKSB7XG4gICAgICBpbmRleCsrXG4gICAgICBuZXdDaGFyID0gbmV4dENoYXJcbiAgICAgIGFjdGlvbnMuYXBwZW5kKClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKG1vZGUpIHtcbiAgICBpbmRleCsrXG4gICAgYyA9IHBhdGhbaW5kZXhdXG5cbiAgICBpZiAoYyA9PT0gJ1xcXFwnICYmIG1heWJlVW5lc2NhcGVRdW90ZSgpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHR5cGUgPSBnZXRQYXRoQ2hhclR5cGUoYylcbiAgICB0eXBlTWFwID0gcGF0aFN0YXRlTWFjaGluZVttb2RlXVxuICAgIHRyYW5zaXRpb24gPSB0eXBlTWFwW3R5cGVdIHx8IHR5cGVNYXBbJ2Vsc2UnXSB8fCAnZXJyb3InXG5cbiAgICBpZiAodHJhbnNpdGlvbiA9PT0gJ2Vycm9yJykge1xuICAgICAgcmV0dXJuIC8vIHBhcnNlIGVycm9yXG4gICAgfVxuXG4gICAgbW9kZSA9IHRyYW5zaXRpb25bMF1cbiAgICBhY3Rpb24gPSBhY3Rpb25zW3RyYW5zaXRpb25bMV1dIHx8IG5vb3BcbiAgICBuZXdDaGFyID0gdHJhbnNpdGlvblsyXSA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGNcbiAgICAgIDogdHJhbnNpdGlvblsyXVxuICAgIGFjdGlvbigpXG5cbiAgICBpZiAobW9kZSA9PT0gJ2FmdGVyUGF0aCcpIHtcbiAgICAgIHJldHVybiBrZXlzXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRm9ybWF0IGEgYWNjZXNzb3Igc2VnbWVudCBiYXNlZCBvbiBpdHMgdHlwZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFjY2Vzc29yKGtleSkge1xuICBpZiAoaWRlbnRSRS50ZXN0KGtleSkpIHsgLy8gaWRlbnRpZmllclxuICAgIHJldHVybiAnLicgKyBrZXlcbiAgfSBlbHNlIGlmICgra2V5ID09PSBrZXkgPj4+IDApIHsgLy8gYnJhY2tldCBpbmRleFxuICAgIHJldHVybiAnWycgKyBrZXkgKyAnXSdcbiAgfSBlbHNlIHsgLy8gYnJhY2tldCBzdHJpbmdcbiAgICByZXR1cm4gJ1tcIicgKyBrZXkucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpICsgJ1wiXSdcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGVzIGEgZ2V0dGVyIGZ1bmN0aW9uIHdpdGggYSBmaXhlZCBwYXRoLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBhdGhcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMuY29tcGlsZUdldHRlciA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBib2R5ID0gJ3JldHVybiBvJyArIHBhdGgubWFwKGZvcm1hdEFjY2Vzc29yKS5qb2luKCcnKVxuICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdvJywgYm9keSlcbn1cblxuLyoqXG4gKiBFeHRlcm5hbCBwYXJzZSB0aGF0IGNoZWNrIGZvciBhIGNhY2hlIGhpdCBmaXJzdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcmV0dXJuIHtBcnJheXx1bmRlZmluZWR9XG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBoaXQgPSBwYXRoQ2FjaGUuZ2V0KHBhdGgpXG4gIGlmICghaGl0KSB7XG4gICAgaGl0ID0gcGFyc2VQYXRoKHBhdGgpXG4gICAgaWYgKGhpdCkge1xuICAgICAgaGl0LmdldCA9IGV4cG9ydHMuY29tcGlsZUdldHRlcihoaXQpXG4gICAgICBwYXRoQ2FjaGUucHV0KHBhdGgsIGhpdClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhpdFxufVxuXG4vKipcbiAqIEdldCBmcm9tIGFuIG9iamVjdCBmcm9tIGEgcGF0aCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICovXG5cbmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCkge1xuICBwYXRoID0gZXhwb3J0cy5wYXJzZShwYXRoKVxuICBpZiAocGF0aCkge1xuICAgIHJldHVybiBwYXRoLmdldChvYmopXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgb24gYW4gb2JqZWN0IGZyb20gYSBwYXRoXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmcgfCBBcnJheX0gcGF0aFxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5leHBvcnRzLnNldCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbCkge1xuICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgcGF0aCA9IGV4cG9ydHMucGFyc2UocGF0aClcbiAgfVxuICBpZiAoIXBhdGggfHwgIV8uaXNPYmplY3Qob2JqKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHZhciBsYXN0LCBrZXlcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPCBsOyBpKyspIHtcbiAgICBsYXN0ID0gb2JqXG4gICAga2V5ID0gcGF0aFtpXVxuICAgIG9iaiA9IG9ialtrZXldXG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgIG9iaiA9IHt9XG4gICAgICBsYXN0LiRhZGQoa2V5LCBvYmopXG4gICAgfVxuICB9XG4gIGtleSA9IHBhdGhbaV1cbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBvYmpba2V5XSA9IHZhbFxuICB9IGVsc2Uge1xuICAgIG9iai4kYWRkKGtleSwgdmFsKVxuICB9XG4gIHJldHVybiB0cnVlXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciB0ZW1wbGF0ZUNhY2hlID0gbmV3IENhY2hlKDEwMDApXG52YXIgaWRTZWxlY3RvckNhY2hlID0gbmV3IENhY2hlKDEwMDApXG5cbnZhciBtYXAgPSB7XG4gIF9kZWZhdWx0IDogWzAsICcnLCAnJ10sXG4gIGxlZ2VuZCAgIDogWzEsICc8ZmllbGRzZXQ+JywgJzwvZmllbGRzZXQ+J10sXG4gIHRyICAgICAgIDogWzIsICc8dGFibGU+PHRib2R5PicsICc8L3Rib2R5PjwvdGFibGU+J10sXG4gIGNvbCAgICAgIDogW1xuICAgIDIsXG4gICAgJzx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+JyxcbiAgICAnPC9jb2xncm91cD48L3RhYmxlPidcbiAgXVxufVxuXG5tYXAudGQgPVxubWFwLnRoID0gW1xuICAzLFxuICAnPHRhYmxlPjx0Ym9keT48dHI+JyxcbiAgJzwvdHI+PC90Ym9keT48L3RhYmxlPidcbl1cblxubWFwLm9wdGlvbiA9XG5tYXAub3B0Z3JvdXAgPSBbXG4gIDEsXG4gICc8c2VsZWN0IG11bHRpcGxlPVwibXVsdGlwbGVcIj4nLFxuICAnPC9zZWxlY3Q+J1xuXVxuXG5tYXAudGhlYWQgPVxubWFwLnRib2R5ID1cbm1hcC5jb2xncm91cCA9XG5tYXAuY2FwdGlvbiA9XG5tYXAudGZvb3QgPSBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXVxuXG5tYXAuZyA9XG5tYXAuZGVmcyA9XG5tYXAuc3ltYm9sID1cbm1hcC51c2UgPVxubWFwLmltYWdlID1cbm1hcC50ZXh0ID1cbm1hcC5jaXJjbGUgPVxubWFwLmVsbGlwc2UgPVxubWFwLmxpbmUgPVxubWFwLnBhdGggPVxubWFwLnBvbHlnb24gPVxubWFwLnBvbHlsaW5lID1cbm1hcC5yZWN0ID0gW1xuICAxLFxuICAnPHN2ZyAnICtcbiAgICAneG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiICcgK1xuICAgICd4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiAnICtcbiAgICAneG1sbnM6ZXY9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL3htbC1ldmVudHNcIicgK1xuICAgICd2ZXJzaW9uPVwiMS4xXCI+JyxcbiAgJzwvc3ZnPidcbl1cblxudmFyIHRhZ1JFID0gLzwoW1xcdzpdKykvXG52YXIgZW50aXR5UkUgPSAvJlxcdys7L1xuXG4vKipcbiAqIENvbnZlcnQgYSBzdHJpbmcgdGVtcGxhdGUgdG8gYSBEb2N1bWVudEZyYWdtZW50LlxuICogRGV0ZXJtaW5lcyBjb3JyZWN0IHdyYXBwaW5nIGJ5IHRhZyB0eXBlcy4gV3JhcHBpbmdcbiAqIHN0cmF0ZWd5IGZvdW5kIGluIGpRdWVyeSAmIGNvbXBvbmVudC9kb21pZnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlU3RyaW5nXG4gKiBAcmV0dXJuIHtEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ1RvRnJhZ21lbnQgKHRlbXBsYXRlU3RyaW5nKSB7XG4gIC8vIHRyeSBhIGNhY2hlIGhpdCBmaXJzdFxuICB2YXIgaGl0ID0gdGVtcGxhdGVDYWNoZS5nZXQodGVtcGxhdGVTdHJpbmcpXG4gIGlmIChoaXQpIHtcbiAgICByZXR1cm4gaGl0XG4gIH1cblxuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICB2YXIgdGFnTWF0Y2ggPSB0ZW1wbGF0ZVN0cmluZy5tYXRjaCh0YWdSRSlcbiAgdmFyIGVudGl0eU1hdGNoID0gZW50aXR5UkUudGVzdCh0ZW1wbGF0ZVN0cmluZylcblxuICBpZiAoIXRhZ01hdGNoICYmICFlbnRpdHlNYXRjaCkge1xuICAgIC8vIHRleHQgb25seSwgcmV0dXJuIGEgc2luZ2xlIHRleHQgbm9kZS5cbiAgICBmcmFnLmFwcGVuZENoaWxkKFxuICAgICAgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGVtcGxhdGVTdHJpbmcpXG4gICAgKVxuICB9IGVsc2Uge1xuXG4gICAgdmFyIHRhZyAgICA9IHRhZ01hdGNoICYmIHRhZ01hdGNoWzFdXG4gICAgdmFyIHdyYXAgICA9IG1hcFt0YWddIHx8IG1hcC5fZGVmYXVsdFxuICAgIHZhciBkZXB0aCAgPSB3cmFwWzBdXG4gICAgdmFyIHByZWZpeCA9IHdyYXBbMV1cbiAgICB2YXIgc3VmZml4ID0gd3JhcFsyXVxuICAgIHZhciBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgbm9kZS5pbm5lckhUTUwgPSBwcmVmaXggKyB0ZW1wbGF0ZVN0cmluZy50cmltKCkgKyBzdWZmaXhcbiAgICB3aGlsZSAoZGVwdGgtLSkge1xuICAgICAgbm9kZSA9IG5vZGUubGFzdENoaWxkXG4gICAgfVxuXG4gICAgdmFyIGNoaWxkXG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIHdoaWxlIChjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZClcbiAgICB9XG4gIH1cblxuICB0ZW1wbGF0ZUNhY2hlLnB1dCh0ZW1wbGF0ZVN0cmluZywgZnJhZylcbiAgcmV0dXJuIGZyYWdcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgdGVtcGxhdGUgbm9kZSB0byBhIERvY3VtZW50RnJhZ21lbnQuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIG5vZGVUb0ZyYWdtZW50IChub2RlKSB7XG4gIHZhciB0YWcgPSBub2RlLnRhZ05hbWVcbiAgLy8gaWYgaXRzIGEgdGVtcGxhdGUgdGFnIGFuZCB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdCxcbiAgLy8gaXRzIGNvbnRlbnQgaXMgYWxyZWFkeSBhIGRvY3VtZW50IGZyYWdtZW50LlxuICBpZiAoXG4gICAgdGFnID09PSAnVEVNUExBVEUnICYmXG4gICAgbm9kZS5jb250ZW50IGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudFxuICApIHtcbiAgICByZXR1cm4gbm9kZS5jb250ZW50XG4gIH1cbiAgLy8gc2NyaXB0IHRlbXBsYXRlXG4gIGlmICh0YWcgPT09ICdTQ1JJUFQnKSB7XG4gICAgcmV0dXJuIHN0cmluZ1RvRnJhZ21lbnQobm9kZS50ZXh0Q29udGVudClcbiAgfVxuICAvLyBub3JtYWwgbm9kZSwgY2xvbmUgaXQgdG8gYXZvaWQgbXV0YXRpbmcgdGhlIG9yaWdpbmFsXG4gIHZhciBjbG9uZSA9IGV4cG9ydHMuY2xvbmUobm9kZSlcbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgdmFyIGNoaWxkXG4gIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgd2hpbGUgKGNoaWxkID0gY2xvbmUuZmlyc3RDaGlsZCkge1xuICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gIH1cbiAgcmV0dXJuIGZyYWdcbn1cblxuLy8gVGVzdCBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSBTYWZhcmkgdGVtcGxhdGUgY2xvbmluZyBidWdcbi8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMzc3NTVcbnZhciBoYXNCcm9rZW5UZW1wbGF0ZSA9IF8uaW5Ccm93c2VyXG4gID8gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGEuaW5uZXJIVE1MID0gJzx0ZW1wbGF0ZT4xPC90ZW1wbGF0ZT4nXG4gICAgICByZXR1cm4gIWEuY2xvbmVOb2RlKHRydWUpLmZpcnN0Q2hpbGQuaW5uZXJIVE1MXG4gICAgfSkoKVxuICA6IGZhbHNlXG5cbi8vIFRlc3QgZm9yIElFMTAvMTEgdGV4dGFyZWEgcGxhY2Vob2xkZXIgY2xvbmUgYnVnXG52YXIgaGFzVGV4dGFyZWFDbG9uZUJ1ZyA9IF8uaW5Ccm93c2VyXG4gID8gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgICAgdC5wbGFjZWhvbGRlciA9ICd0J1xuICAgICAgcmV0dXJuIHQuY2xvbmVOb2RlKHRydWUpLnZhbHVlID09PSAndCdcbiAgICB9KSgpXG4gIDogZmFsc2VcblxuLyoqXG4gKiAxLiBEZWFsIHdpdGggU2FmYXJpIGNsb25pbmcgbmVzdGVkIDx0ZW1wbGF0ZT4gYnVnIGJ5XG4gKiAgICBtYW51YWxseSBjbG9uaW5nIGFsbCB0ZW1wbGF0ZSBpbnN0YW5jZXMuXG4gKiAyLiBEZWFsIHdpdGggSUUxMC8xMSB0ZXh0YXJlYSBwbGFjZWhvbGRlciBidWcgYnkgc2V0dGluZ1xuICogICAgdGhlIGNvcnJlY3QgdmFsdWUgYWZ0ZXIgY2xvbmluZy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gbm9kZVxuICogQHJldHVybiB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmV4cG9ydHMuY2xvbmUgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgcmVzID0gbm9kZS5jbG9uZU5vZGUodHJ1ZSlcbiAgdmFyIGksIG9yaWdpbmFsLCBjbG9uZWRcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChoYXNCcm9rZW5UZW1wbGF0ZSkge1xuICAgIG9yaWdpbmFsID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpXG4gICAgaWYgKG9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgY2xvbmVkID0gcmVzLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylcbiAgICAgIGkgPSBjbG9uZWQubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNsb25lZFtpXS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChcbiAgICAgICAgICBvcmlnaW5hbFtpXS5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgY2xvbmVkW2ldXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChoYXNUZXh0YXJlYUNsb25lQnVnKSB7XG4gICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgcmVzLnZhbHVlID0gbm9kZS52YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBvcmlnaW5hbCA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKVxuICAgICAgaWYgKG9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgICBjbG9uZWQgPSByZXMucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKVxuICAgICAgICBpID0gY2xvbmVkLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgY2xvbmVkW2ldLnZhbHVlID0gb3JpZ2luYWxbaV0udmFsdWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogUHJvY2VzcyB0aGUgdGVtcGxhdGUgb3B0aW9uIGFuZCBub3JtYWxpemVzIGl0IGludG8gYVxuICogYSBEb2N1bWVudEZyYWdtZW50IHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBwYXJ0aWFsIG9yIGFcbiAqIGluc3RhbmNlIHRlbXBsYXRlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdGVtcGxhdGVcbiAqICAgIFBvc3NpYmxlIHZhbHVlcyBpbmNsdWRlOlxuICogICAgLSBEb2N1bWVudEZyYWdtZW50IG9iamVjdFxuICogICAgLSBOb2RlIG9iamVjdCBvZiB0eXBlIFRlbXBsYXRlXG4gKiAgICAtIGlkIHNlbGVjdG9yOiAnI3NvbWUtdGVtcGxhdGUtaWQnXG4gKiAgICAtIHRlbXBsYXRlIHN0cmluZzogJzxkaXY+PHNwYW4+e3ttc2d9fTwvc3Bhbj48L2Rpdj4nXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNsb25lXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG5vU2VsZWN0b3JcbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR8dW5kZWZpbmVkfVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAodGVtcGxhdGUsIGNsb25lLCBub1NlbGVjdG9yKSB7XG4gIHZhciBub2RlLCBmcmFnXG5cbiAgLy8gaWYgdGhlIHRlbXBsYXRlIGlzIGFscmVhZHkgYSBkb2N1bWVudCBmcmFnbWVudCxcbiAgLy8gZG8gbm90aGluZ1xuICBpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgcmV0dXJuIGNsb25lXG4gICAgICA/IHRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKVxuICAgICAgOiB0ZW1wbGF0ZVxuICB9XG5cbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBpZCBzZWxlY3RvclxuICAgIGlmICghbm9TZWxlY3RvciAmJiB0ZW1wbGF0ZS5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgLy8gaWQgc2VsZWN0b3IgY2FuIGJlIGNhY2hlZCB0b29cbiAgICAgIGZyYWcgPSBpZFNlbGVjdG9yQ2FjaGUuZ2V0KHRlbXBsYXRlKVxuICAgICAgaWYgKCFmcmFnKSB7XG4gICAgICAgIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZS5zbGljZSgxKSlcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICBmcmFnID0gbm9kZVRvRnJhZ21lbnQobm9kZSlcbiAgICAgICAgICAvLyBzYXZlIHNlbGVjdG9yIHRvIGNhY2hlXG4gICAgICAgICAgaWRTZWxlY3RvckNhY2hlLnB1dCh0ZW1wbGF0ZSwgZnJhZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub3JtYWwgc3RyaW5nIHRlbXBsYXRlXG4gICAgICBmcmFnID0gc3RyaW5nVG9GcmFnbWVudCh0ZW1wbGF0ZSlcbiAgICB9XG4gIH0gZWxzZSBpZiAodGVtcGxhdGUubm9kZVR5cGUpIHtcbiAgICAvLyBhIGRpcmVjdCBub2RlXG4gICAgZnJhZyA9IG5vZGVUb0ZyYWdtZW50KHRlbXBsYXRlKVxuICB9XG5cbiAgcmV0dXJuIGZyYWcgJiYgY2xvbmVcbiAgICA/IGV4cG9ydHMuY2xvbmUoZnJhZylcbiAgICA6IGZyYWdcbn0iLCJ2YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbnZhciBkaXJQYXJzZXIgPSByZXF1aXJlKCcuL2RpcmVjdGl2ZScpXG52YXIgcmVnZXhFc2NhcGVSRSA9IC9bLS4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2dcbnZhciBjYWNoZSwgdGFnUkUsIGh0bWxSRSwgZmlyc3RDaGFyLCBsYXN0Q2hhclxuXG4vKipcbiAqIEVzY2FwZSBhIHN0cmluZyBzbyBpdCBjYW4gYmUgdXNlZCBpbiBhIFJlZ0V4cFxuICogY29uc3RydWN0b3IuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICovXG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4IChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4RXNjYXBlUkUsICdcXFxcJCYnKVxufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIGludGVycG9sYXRpb24gdGFnIHJlZ2V4LlxuICpcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlUmVnZXggKCkge1xuICBjb25maWcuX2RlbGltaXRlcnNDaGFuZ2VkID0gZmFsc2VcbiAgdmFyIG9wZW4gPSBjb25maWcuZGVsaW1pdGVyc1swXVxuICB2YXIgY2xvc2UgPSBjb25maWcuZGVsaW1pdGVyc1sxXVxuICBmaXJzdENoYXIgPSBvcGVuLmNoYXJBdCgwKVxuICBsYXN0Q2hhciA9IGNsb3NlLmNoYXJBdChjbG9zZS5sZW5ndGggLSAxKVxuICB2YXIgZmlyc3RDaGFyUkUgPSBlc2NhcGVSZWdleChmaXJzdENoYXIpXG4gIHZhciBsYXN0Q2hhclJFID0gZXNjYXBlUmVnZXgobGFzdENoYXIpXG4gIHZhciBvcGVuUkUgPSBlc2NhcGVSZWdleChvcGVuKVxuICB2YXIgY2xvc2VSRSA9IGVzY2FwZVJlZ2V4KGNsb3NlKVxuICB0YWdSRSA9IG5ldyBSZWdFeHAoXG4gICAgZmlyc3RDaGFyUkUgKyAnPycgKyBvcGVuUkUgK1xuICAgICcoLis/KScgK1xuICAgIGNsb3NlUkUgKyBsYXN0Q2hhclJFICsgJz8nLFxuICAgICdnJ1xuICApXG4gIGh0bWxSRSA9IG5ldyBSZWdFeHAoXG4gICAgJ14nICsgZmlyc3RDaGFyUkUgKyBvcGVuUkUgK1xuICAgICcuKicgK1xuICAgIGNsb3NlUkUgKyBsYXN0Q2hhclJFICsgJyQnXG4gIClcbiAgLy8gcmVzZXQgY2FjaGVcbiAgY2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbn1cblxuLyoqXG4gKiBQYXJzZSBhIHRlbXBsYXRlIHRleHQgc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgdG9rZW5zLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+IHwgbnVsbH1cbiAqICAgICAgICAgICAgICAgLSB7U3RyaW5nfSB0eXBlXG4gKiAgICAgICAgICAgICAgIC0ge1N0cmluZ30gdmFsdWVcbiAqICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gW2h0bWxdXG4gKiAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IFtvbmVUaW1lXVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAodGV4dCkge1xuICBpZiAoY29uZmlnLl9kZWxpbWl0ZXJzQ2hhbmdlZCkge1xuICAgIGNvbXBpbGVSZWdleCgpXG4gIH1cbiAgdmFyIGhpdCA9IGNhY2hlLmdldCh0ZXh0KVxuICBpZiAoaGl0KSB7XG4gICAgcmV0dXJuIGhpdFxuICB9XG4gIGlmICghdGFnUkUudGVzdCh0ZXh0KSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgdmFyIHRva2VucyA9IFtdXG4gIHZhciBsYXN0SW5kZXggPSB0YWdSRS5sYXN0SW5kZXggPSAwXG4gIHZhciBtYXRjaCwgaW5kZXgsIHZhbHVlLCBmaXJzdCwgb25lVGltZSwgcGFydGlhbFxuICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gIHdoaWxlIChtYXRjaCA9IHRhZ1JFLmV4ZWModGV4dCkpIHtcbiAgICBpbmRleCA9IG1hdGNoLmluZGV4XG4gICAgLy8gcHVzaCB0ZXh0IHRva2VuXG4gICAgaWYgKGluZGV4ID4gbGFzdEluZGV4KSB7XG4gICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgIHZhbHVlOiB0ZXh0LnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyB0YWcgdG9rZW5cbiAgICBmaXJzdCA9IG1hdGNoWzFdLmNoYXJDb2RlQXQoMClcbiAgICBvbmVUaW1lID0gZmlyc3QgPT09IDB4MkEgLy8gKlxuICAgIHBhcnRpYWwgPSBmaXJzdCA9PT0gMHgzRSAvLyA+XG4gICAgdmFsdWUgPSAob25lVGltZSB8fCBwYXJ0aWFsKVxuICAgICAgPyBtYXRjaFsxXS5zbGljZSgxKVxuICAgICAgOiBtYXRjaFsxXVxuICAgIHRva2Vucy5wdXNoKHtcbiAgICAgIHRhZzogdHJ1ZSxcbiAgICAgIHZhbHVlOiB2YWx1ZS50cmltKCksXG4gICAgICBodG1sOiBodG1sUkUudGVzdChtYXRjaFswXSksXG4gICAgICBvbmVUaW1lOiBvbmVUaW1lLFxuICAgICAgcGFydGlhbDogcGFydGlhbFxuICAgIH0pXG4gICAgbGFzdEluZGV4ID0gaW5kZXggKyBtYXRjaFswXS5sZW5ndGhcbiAgfVxuICBpZiAobGFzdEluZGV4IDwgdGV4dC5sZW5ndGgpIHtcbiAgICB0b2tlbnMucHVzaCh7XG4gICAgICB2YWx1ZTogdGV4dC5zbGljZShsYXN0SW5kZXgpXG4gICAgfSlcbiAgfVxuICBjYWNoZS5wdXQodGV4dCwgdG9rZW5zKVxuICByZXR1cm4gdG9rZW5zXG59XG5cbi8qKlxuICogRm9ybWF0IGEgbGlzdCBvZiB0b2tlbnMgaW50byBhbiBleHByZXNzaW9uLlxuICogZS5nLiB0b2tlbnMgcGFyc2VkIGZyb20gJ2Ege3tifX0gYycgY2FuIGJlIHNlcmlhbGl6ZWRcbiAqIGludG8gb25lIHNpbmdsZSBleHByZXNzaW9uIGFzICdcImEgXCIgKyBiICsgXCIgY1wiJy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnNcbiAqIEBwYXJhbSB7VnVlfSBbdm1dXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy50b2tlbnNUb0V4cCA9IGZ1bmN0aW9uICh0b2tlbnMsIHZtKSB7XG4gIHJldHVybiB0b2tlbnMubGVuZ3RoID4gMVxuICAgID8gdG9rZW5zLm1hcChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRva2VuKHRva2VuLCB2bSlcbiAgICAgIH0pLmpvaW4oJysnKVxuICAgIDogZm9ybWF0VG9rZW4odG9rZW5zWzBdLCB2bSwgdHJ1ZSlcbn1cblxuLyoqXG4gKiBGb3JtYXQgYSBzaW5nbGUgdG9rZW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRva2VuXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXVxuICogQHBhcmFtIHtCb29sZWFufSBzaW5nbGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRUb2tlbiAodG9rZW4sIHZtLCBzaW5nbGUpIHtcbiAgcmV0dXJuIHRva2VuLnRhZ1xuICAgID8gdm0gJiYgdG9rZW4ub25lVGltZVxuICAgICAgPyAnXCInICsgdm0uJGV2YWwodG9rZW4udmFsdWUpICsgJ1wiJ1xuICAgICAgOiBzaW5nbGVcbiAgICAgICAgPyB0b2tlbi52YWx1ZVxuICAgICAgICA6IGlubGluZUZpbHRlcnModG9rZW4udmFsdWUpXG4gICAgOiAnXCInICsgdG9rZW4udmFsdWUgKyAnXCInXG59XG5cbi8qKlxuICogRm9yIGFuIGF0dHJpYnV0ZSB3aXRoIG11bHRpcGxlIGludGVycG9sYXRpb24gdGFncyxcbiAqIGUuZy4gYXR0cj1cInNvbWUte3t0aGluZyB8IGZpbHRlcn19XCIsIGluIG9yZGVyIHRvIGNvbWJpbmVcbiAqIHRoZSB3aG9sZSB0aGluZyBpbnRvIGEgc2luZ2xlIHdhdGNoYWJsZSBleHByZXNzaW9uLCB3ZVxuICogaGF2ZSB0byBpbmxpbmUgdGhvc2UgZmlsdGVycy4gVGhpcyBmdW5jdGlvbiBkb2VzIGV4YWN0bHlcbiAqIHRoYXQuIFRoaXMgaXMgYSBiaXQgaGFja3kgYnV0IGl0IGF2b2lkcyBoZWF2eSBjaGFuZ2VzXG4gKiB0byBkaXJlY3RpdmUgcGFyc2VyIGFuZCB3YXRjaGVyIG1lY2hhbmlzbS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGZpbHRlclJFID0gL1tefF1cXHxbXnxdL1xuZnVuY3Rpb24gaW5saW5lRmlsdGVycyAoZXhwKSB7XG4gIGlmICghZmlsdGVyUkUudGVzdChleHApKSB7XG4gICAgcmV0dXJuICcoJyArIGV4cCArICcpJ1xuICB9IGVsc2Uge1xuICAgIHZhciBkaXIgPSBkaXJQYXJzZXIucGFyc2UoZXhwKVswXVxuICAgIGlmICghZGlyLmZpbHRlcnMpIHtcbiAgICAgIHJldHVybiAnKCcgKyBleHAgKyAnKSdcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwID0gZGlyLmV4cHJlc3Npb25cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZGlyLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBmaWx0ZXIgPSBkaXIuZmlsdGVyc1tpXVxuICAgICAgICB2YXIgYXJncyA9IGZpbHRlci5hcmdzXG4gICAgICAgICAgPyAnLFwiJyArIGZpbHRlci5hcmdzLmpvaW4oJ1wiLFwiJykgKyAnXCInXG4gICAgICAgICAgOiAnJ1xuICAgICAgICBmaWx0ZXIgPSAndGhpcy4kb3B0aW9ucy5maWx0ZXJzW1wiJyArIGZpbHRlci5uYW1lICsgJ1wiXSdcbiAgICAgICAgZXhwID0gJygnICsgZmlsdGVyICsgJy5yZWFkfHwnICsgZmlsdGVyICsgJyknICtcbiAgICAgICAgICAnLmFwcGx5KHRoaXMsWycgKyBleHAgKyBhcmdzICsgJ10pJ1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV4cFxuICAgIH1cbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgYWRkQ2xhc3MgPSBfLmFkZENsYXNzXG52YXIgcmVtb3ZlQ2xhc3MgPSBfLnJlbW92ZUNsYXNzXG52YXIgdHJhbnNEdXJhdGlvblByb3AgPSBfLnRyYW5zaXRpb25Qcm9wICsgJ0R1cmF0aW9uJ1xudmFyIGFuaW1EdXJhdGlvblByb3AgPSBfLmFuaW1hdGlvblByb3AgKyAnRHVyYXRpb24nXG5cbnZhciBxdWV1ZSA9IFtdXG52YXIgcXVldWVkID0gZmFsc2VcblxuLyoqXG4gKiBQdXNoIGEgam9iIGludG8gdGhlIHRyYW5zaXRpb24gcXVldWUsIHdoaWNoIGlzIHRvIGJlXG4gKiBleGVjdXRlZCBvbiBuZXh0IGZyYW1lLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWwgICAgLSB0YXJnZXQgZWxlbWVudFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpciAgICAtIDE6IGVudGVyLCAtMTogbGVhdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wICAgLSB0aGUgYWN0dWFsIGRvbSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBjbHMgICAgLSB0aGUgY2xhc3NOYW1lIHRvIHJlbW92ZSB3aGVuIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24gaXMgZG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl0gLSB1c2VyIHN1cHBsaWVkIGNhbGxiYWNrLlxuICovXG5cbmZ1bmN0aW9uIHB1c2ggKGVsLCBkaXIsIG9wLCBjbHMsIGNiKSB7XG4gIHF1ZXVlLnB1c2goe1xuICAgIGVsICA6IGVsLFxuICAgIGRpciA6IGRpcixcbiAgICBjYiAgOiBjYixcbiAgICBjbHMgOiBjbHMsXG4gICAgb3AgIDogb3BcbiAgfSlcbiAgaWYgKCFxdWV1ZWQpIHtcbiAgICBxdWV1ZWQgPSB0cnVlXG4gICAgXy5uZXh0VGljayhmbHVzaClcbiAgfVxufVxuXG4vKipcbiAqIEZsdXNoIHRoZSBxdWV1ZSwgYW5kIGRvIG9uZSBmb3JjZWQgcmVmbG93IGJlZm9yZVxuICogdHJpZ2dlcmluZyB0cmFuc2l0aW9ucy5cbiAqL1xuXG5mdW5jdGlvbiBmbHVzaCAoKSB7XG4gIC8qIGpzaGludCB1bnVzZWQ6IGZhbHNlICovXG4gIHZhciBmID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodFxuICBxdWV1ZS5mb3JFYWNoKHJ1bilcbiAgcXVldWUgPSBbXVxuICBxdWV1ZWQgPSBmYWxzZVxufVxuXG4vKipcbiAqIFJ1biBhIHRyYW5zaXRpb24gam9iLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBqb2JcbiAqL1xuXG5mdW5jdGlvbiBydW4gKGpvYikge1xuXG4gIHZhciBlbCA9IGpvYi5lbFxuICB2YXIgZGF0YSA9IGVsLl9fdl90cmFuc1xuICB2YXIgY2xzID0gam9iLmNsc1xuICB2YXIgY2IgPSBqb2IuY2JcbiAgdmFyIG9wID0gam9iLm9wXG4gIHZhciB0cmFuc2l0aW9uVHlwZSA9IGdldFRyYW5zaXRpb25UeXBlKGVsLCBkYXRhLCBjbHMpXG5cbiAgaWYgKGpvYi5kaXIgPiAwKSB7IC8vIEVOVEVSXG4gICAgaWYgKHRyYW5zaXRpb25UeXBlID09PSAxKSB7XG4gICAgICAvLyB0cmlnZ2VyIHRyYW5zaXRpb24gYnkgcmVtb3ZpbmcgZW50ZXIgY2xhc3NcbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICAvLyBvbmx5IG5lZWQgdG8gbGlzdGVuIGZvciB0cmFuc2l0aW9uZW5kIGlmIHRoZXJlJ3NcbiAgICAgIC8vIGEgdXNlciBjYWxsYmFja1xuICAgICAgaWYgKGNiKSBzZXR1cFRyYW5zaXRpb25DYihfLnRyYW5zaXRpb25FbmRFdmVudClcbiAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb25UeXBlID09PSAyKSB7XG4gICAgICAvLyBhbmltYXRpb25zIGFyZSB0cmlnZ2VyZWQgd2hlbiBjbGFzcyBpcyBhZGRlZFxuICAgICAgLy8gc28gd2UganVzdCBsaXN0ZW4gZm9yIGFuaW1hdGlvbmVuZCB0byByZW1vdmUgaXQuXG4gICAgICBzZXR1cFRyYW5zaXRpb25DYihfLmFuaW1hdGlvbkVuZEV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBubyB0cmFuc2l0aW9uIGFwcGxpY2FibGVcbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICBpZiAoY2IpIGNiKClcbiAgICB9XG4gIH0gZWxzZSB7IC8vIExFQVZFXG4gICAgaWYgKHRyYW5zaXRpb25UeXBlKSB7XG4gICAgICAvLyBsZWF2ZSB0cmFuc2l0aW9ucy9hbmltYXRpb25zIGFyZSBib3RoIHRyaWdnZXJlZFxuICAgICAgLy8gYnkgYWRkaW5nIHRoZSBjbGFzcywganVzdCByZW1vdmUgaXQgb24gZW5kIGV2ZW50LlxuICAgICAgdmFyIGV2ZW50ID0gdHJhbnNpdGlvblR5cGUgPT09IDFcbiAgICAgICAgPyBfLnRyYW5zaXRpb25FbmRFdmVudFxuICAgICAgICA6IF8uYW5pbWF0aW9uRW5kRXZlbnRcbiAgICAgIHNldHVwVHJhbnNpdGlvbkNiKGV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG9wKClcbiAgICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIG9wKClcbiAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICBpZiAoY2IpIGNiKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IHVwIGEgdHJhbnNpdGlvbiBlbmQgY2FsbGJhY2ssIHN0b3JlIHRoZSBjYWxsYmFja1xuICAgKiBvbiB0aGUgZWxlbWVudCdzIF9fdl90cmFucyBkYXRhIG9iamVjdCwgc28gd2UgY2FuXG4gICAqIGNsZWFuIGl0IHVwIGlmIGFub3RoZXIgdHJhbnNpdGlvbiBpcyB0cmlnZ2VyZWQgYmVmb3JlXG4gICAqIHRoZSBjYWxsYmFjayBpcyBmaXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjbGVhbnVwRm5dXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHNldHVwVHJhbnNpdGlvbkNiIChldmVudCwgY2xlYW51cEZuKSB7XG4gICAgZGF0YS5ldmVudCA9IGV2ZW50XG4gICAgdmFyIG9uRW5kID0gZGF0YS5jYWxsYmFjayA9IGZ1bmN0aW9uIHRyYW5zaXRpb25DYiAoZSkge1xuICAgICAgaWYgKGUudGFyZ2V0ID09PSBlbCkge1xuICAgICAgICBfLm9mZihlbCwgZXZlbnQsIG9uRW5kKVxuICAgICAgICBkYXRhLmV2ZW50ID0gZGF0YS5jYWxsYmFjayA9IG51bGxcbiAgICAgICAgaWYgKGNsZWFudXBGbikgY2xlYW51cEZuKClcbiAgICAgICAgaWYgKGNiKSBjYigpXG4gICAgICB9XG4gICAgfVxuICAgIF8ub24oZWwsIGV2ZW50LCBvbkVuZClcbiAgfVxufVxuXG4vKipcbiAqIEdldCBhbiBlbGVtZW50J3MgdHJhbnNpdGlvbiB0eXBlIGJhc2VkIG9uIHRoZVxuICogY2FsY3VsYXRlZCBzdHlsZXNcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICogQHJldHVybiB7TnVtYmVyfVxuICogICAgICAgICAxIC0gdHJhbnNpdGlvblxuICogICAgICAgICAyIC0gYW5pbWF0aW9uXG4gKi9cblxuZnVuY3Rpb24gZ2V0VHJhbnNpdGlvblR5cGUgKGVsLCBkYXRhLCBjbGFzc05hbWUpIHtcbiAgdmFyIHR5cGUgPSBkYXRhLmNhY2hlICYmIGRhdGEuY2FjaGVbY2xhc3NOYW1lXVxuICBpZiAodHlwZSkgcmV0dXJuIHR5cGVcbiAgdmFyIGlubGluZVN0eWxlcyA9IGVsLnN0eWxlXG4gIHZhciBjb21wdXRlZFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKVxuICB2YXIgdHJhbnNEdXJhdGlvbiA9XG4gICAgaW5saW5lU3R5bGVzW3RyYW5zRHVyYXRpb25Qcm9wXSB8fFxuICAgIGNvbXB1dGVkU3R5bGVzW3RyYW5zRHVyYXRpb25Qcm9wXVxuICBpZiAodHJhbnNEdXJhdGlvbiAmJiB0cmFuc0R1cmF0aW9uICE9PSAnMHMnKSB7XG4gICAgdHlwZSA9IDFcbiAgfSBlbHNlIHtcbiAgICB2YXIgYW5pbUR1cmF0aW9uID1cbiAgICAgIGlubGluZVN0eWxlc1thbmltRHVyYXRpb25Qcm9wXSB8fFxuICAgICAgY29tcHV0ZWRTdHlsZXNbYW5pbUR1cmF0aW9uUHJvcF1cbiAgICBpZiAoYW5pbUR1cmF0aW9uICYmIGFuaW1EdXJhdGlvbiAhPT0gJzBzJykge1xuICAgICAgdHlwZSA9IDJcbiAgICB9XG4gIH1cbiAgaWYgKHR5cGUpIHtcbiAgICBpZiAoIWRhdGEuY2FjaGUpIGRhdGEuY2FjaGUgPSB7fVxuICAgIGRhdGEuY2FjaGVbY2xhc3NOYW1lXSA9IHR5cGVcbiAgfVxuICByZXR1cm4gdHlwZVxufVxuXG4vKipcbiAqIEFwcGx5IENTUyB0cmFuc2l0aW9uIHRvIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpcmVjdGlvbiAtIDE6IGVudGVyLCAtMTogbGVhdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wIC0gdGhlIGFjdHVhbCBET00gb3BlcmF0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIHRhcmdldCBlbGVtZW50J3MgdHJhbnNpdGlvbiBkYXRhXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWwsIGRpcmVjdGlvbiwgb3AsIGRhdGEsIGNiKSB7XG4gIHZhciBwcmVmaXggPSBkYXRhLmlkIHx8ICd2J1xuICB2YXIgZW50ZXJDbGFzcyA9IHByZWZpeCArICctZW50ZXInXG4gIHZhciBsZWF2ZUNsYXNzID0gcHJlZml4ICsgJy1sZWF2ZSdcbiAgLy8gY2xlYW4gdXAgcG90ZW50aWFsIHByZXZpb3VzIHVuZmluaXNoZWQgdHJhbnNpdGlvblxuICBpZiAoZGF0YS5jYWxsYmFjaykge1xuICAgIF8ub2ZmKGVsLCBkYXRhLmV2ZW50LCBkYXRhLmNhbGxiYWNrKVxuICAgIHJlbW92ZUNsYXNzKGVsLCBlbnRlckNsYXNzKVxuICAgIHJlbW92ZUNsYXNzKGVsLCBsZWF2ZUNsYXNzKVxuICAgIGRhdGEuZXZlbnQgPSBkYXRhLmNhbGxiYWNrID0gbnVsbFxuICB9XG4gIGlmIChkaXJlY3Rpb24gPiAwKSB7IC8vIGVudGVyXG4gICAgYWRkQ2xhc3MoZWwsIGVudGVyQ2xhc3MpXG4gICAgb3AoKVxuICAgIHB1c2goZWwsIGRpcmVjdGlvbiwgbnVsbCwgZW50ZXJDbGFzcywgY2IpXG4gIH0gZWxzZSB7IC8vIGxlYXZlXG4gICAgYWRkQ2xhc3MoZWwsIGxlYXZlQ2xhc3MpXG4gICAgcHVzaChlbCwgZGlyZWN0aW9uLCBvcCwgbGVhdmVDbGFzcywgY2IpXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGFwcGx5Q1NTVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vY3NzJylcbnZhciBhcHBseUpTVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vanMnKVxuXG4vKipcbiAqIEFwcGVuZCB3aXRoIHRyYW5zaXRpb24uXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmV4cG9ydHMuYXBwZW5kID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQsIHZtLCBjYikge1xuICBhcHBseShlbCwgMSwgZnVuY3Rpb24gKCkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgfSwgdm0sIGNiKVxufVxuXG4vKipcbiAqIEluc2VydEJlZm9yZSB3aXRoIHRyYW5zaXRpb24uXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmV4cG9ydHMuYmVmb3JlID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQsIHZtLCBjYikge1xuICBhcHBseShlbCwgMSwgZnVuY3Rpb24gKCkge1xuICAgIF8uYmVmb3JlKGVsLCB0YXJnZXQpXG4gIH0sIHZtLCBjYilcbn1cblxuLyoqXG4gKiBSZW1vdmUgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmV4cG9ydHMucmVtb3ZlID0gZnVuY3Rpb24gKGVsLCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIC0xLCBmdW5jdGlvbiAoKSB7XG4gICAgXy5yZW1vdmUoZWwpXG4gIH0sIHZtLCBjYilcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnkgYXBwZW5kaW5nIHRvIGFub3RoZXIgcGFyZW50IHdpdGggdHJhbnNpdGlvbi5cbiAqIFRoaXMgaXMgb25seSB1c2VkIGluIGJsb2NrIG9wZXJhdGlvbnMuXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmV4cG9ydHMucmVtb3ZlVGhlbkFwcGVuZCA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIC0xLCBmdW5jdGlvbiAoKSB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsKVxuICB9LCB2bSwgY2IpXG59XG5cbi8qKlxuICogQXBwZW5kIHRoZSBjaGlsZE5vZGVzIG9mIGEgZnJhZ21lbnQgdG8gdGFyZ2V0LlxuICpcbiAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gYmxvY2tcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5leHBvcnRzLmJsb2NrQXBwZW5kID0gZnVuY3Rpb24gKGJsb2NrLCB0YXJnZXQsIHZtKSB7XG4gIHZhciBub2RlcyA9IF8udG9BcnJheShibG9jay5jaGlsZE5vZGVzKVxuICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGV4cG9ydHMuYmVmb3JlKG5vZGVzW2ldLCB0YXJnZXQsIHZtKVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgYmxvY2sgb2Ygbm9kZXMgYmV0d2VlbiB0d28gZWRnZSBub2Rlcy5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IHN0YXJ0XG4gKiBAcGFyYW0ge05vZGV9IGVuZFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKi9cblxuZXhwb3J0cy5ibG9ja1JlbW92ZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kLCB2bSkge1xuICB2YXIgbm9kZSA9IHN0YXJ0Lm5leHRTaWJsaW5nXG4gIHZhciBuZXh0XG4gIHdoaWxlIChub2RlICE9PSBlbmQpIHtcbiAgICBuZXh0ID0gbm9kZS5uZXh0U2libGluZ1xuICAgIGV4cG9ydHMucmVtb3ZlKG5vZGUsIHZtKVxuICAgIG5vZGUgPSBuZXh0XG4gIH1cbn1cblxuLyoqXG4gKiBBcHBseSB0cmFuc2l0aW9ucyB3aXRoIGFuIG9wZXJhdGlvbiBjYWxsYmFjay5cbiAqXG4gKiBAb2FyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge051bWJlcn0gZGlyZWN0aW9uXG4gKiAgICAgICAgICAgICAgICAgIDE6IGVudGVyXG4gKiAgICAgICAgICAgICAgICAgLTE6IGxlYXZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcCAtIHRoZSBhY3R1YWwgRE9NIG9wZXJhdGlvblxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxudmFyIGFwcGx5ID0gZXhwb3J0cy5hcHBseSA9IGZ1bmN0aW9uIChlbCwgZGlyZWN0aW9uLCBvcCwgdm0sIGNiKSB7XG4gIHZhciB0cmFuc0RhdGEgPSBlbC5fX3ZfdHJhbnNcbiAgaWYgKFxuICAgICF0cmFuc0RhdGEgfHxcbiAgICAhdm0uX2lzQ29tcGlsZWQgfHxcbiAgICAvLyBpZiB0aGUgdm0gaXMgYmVpbmcgbWFuaXB1bGF0ZWQgYnkgYSBwYXJlbnQgZGlyZWN0aXZlXG4gICAgLy8gZHVyaW5nIHRoZSBwYXJlbnQncyBjb21waWxhdGlvbiBwaGFzZSwgc2tpcCB0aGVcbiAgICAvLyBhbmltYXRpb24uXG4gICAgKHZtLiRwYXJlbnQgJiYgIXZtLiRwYXJlbnQuX2lzQ29tcGlsZWQpXG4gICkge1xuICAgIG9wKClcbiAgICBpZiAoY2IpIGNiKClcbiAgICByZXR1cm5cbiAgfVxuICAvLyBkZXRlcm1pbmUgdGhlIHRyYW5zaXRpb24gdHlwZSBvbiB0aGUgZWxlbWVudFxuICB2YXIganNUcmFuc2l0aW9uID0gdHJhbnNEYXRhLmZuc1xuICBpZiAoanNUcmFuc2l0aW9uKSB7XG4gICAgLy8ganNcbiAgICBhcHBseUpTVHJhbnNpdGlvbihcbiAgICAgIGVsLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgb3AsXG4gICAgICB0cmFuc0RhdGEsXG4gICAgICBqc1RyYW5zaXRpb24sXG4gICAgICB2bSxcbiAgICAgIGNiXG4gICAgKVxuICB9IGVsc2UgaWYgKF8udHJhbnNpdGlvbkVuZEV2ZW50KSB7XG4gICAgLy8gY3NzXG4gICAgYXBwbHlDU1NUcmFuc2l0aW9uKFxuICAgICAgZWwsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBvcCxcbiAgICAgIHRyYW5zRGF0YSxcbiAgICAgIGNiXG4gICAgKVxuICB9IGVsc2Uge1xuICAgIC8vIG5vdCBhcHBsaWNhYmxlXG4gICAgb3AoKVxuICAgIGlmIChjYikgY2IoKVxuICB9XG59IiwiLyoqXG4gKiBBcHBseSBKYXZhU2NyaXB0IGVudGVyL2xlYXZlIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge051bWJlcn0gZGlyZWN0aW9uIC0gMTogZW50ZXIsIC0xOiBsZWF2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AgLSB0aGUgYWN0dWFsIERPTSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gdGFyZ2V0IGVsZW1lbnQncyB0cmFuc2l0aW9uIGRhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWYgLSB0cmFuc2l0aW9uIGRlZmluaXRpb24gb2JqZWN0XG4gKiBAcGFyYW0ge1Z1ZX0gdm0gLSB0aGUgb3duZXIgdm0gb2YgdGhlIGVsZW1lbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbCwgZGlyZWN0aW9uLCBvcCwgZGF0YSwgZGVmLCB2bSwgY2IpIHtcbiAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgdGhlIHJvb3Qgb2YgYW4gaW5zdGFuY2UsXG4gIC8vIHVzZSB0aGF0IGluc3RhbmNlIGFzIHRoZSB0cmFuc2l0aW9uIGZ1bmN0aW9uIGNvbnRleHRcbiAgdm0gPSBlbC5fX3Z1ZV9fIHx8IHZtXG4gIGlmIChkYXRhLmNhbmNlbCkge1xuICAgIGRhdGEuY2FuY2VsKClcbiAgICBkYXRhLmNhbmNlbCA9IG51bGxcbiAgfVxuICBpZiAoZGlyZWN0aW9uID4gMCkgeyAvLyBlbnRlclxuICAgIGlmIChkZWYuYmVmb3JlRW50ZXIpIHtcbiAgICAgIGRlZi5iZWZvcmVFbnRlci5jYWxsKHZtLCBlbClcbiAgICB9XG4gICAgb3AoKVxuICAgIGlmIChkZWYuZW50ZXIpIHtcbiAgICAgIGRhdGEuY2FuY2VsID0gZGVmLmVudGVyLmNhbGwodm0sIGVsLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRhdGEuY2FuY2VsID0gbnVsbFxuICAgICAgICBpZiAoY2IpIGNiKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChjYikge1xuICAgICAgY2IoKVxuICAgIH1cbiAgfSBlbHNlIHsgLy8gbGVhdmVcbiAgICBpZiAoZGVmLmxlYXZlKSB7XG4gICAgICBkYXRhLmNhbmNlbCA9IGRlZi5sZWF2ZS5jYWxsKHZtLCBlbCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXRhLmNhbmNlbCA9IG51bGxcbiAgICAgICAgb3AoKVxuICAgICAgICBpZiAoY2IpIGNiKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIG9wKClcbiAgICAgIGlmIChjYikgY2IoKVxuICAgIH1cbiAgfVxufSIsInZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuXG4vKipcbiAqIEVuYWJsZSBkZWJ1ZyB1dGlsaXRpZXMuIFRoZSBlbmFibGVEZWJ1ZygpIGZ1bmN0aW9uIGFuZFxuICogYWxsIF8ubG9nKCkgJiBfLndhcm4oKSBjYWxscyB3aWxsIGJlIGRyb3BwZWQgaW4gdGhlXG4gKiBtaW5pZmllZCBwcm9kdWN0aW9uIGJ1aWxkLlxuICovXG5cbmVuYWJsZURlYnVnKClcblxuZnVuY3Rpb24gZW5hYmxlRGVidWcgKCkge1xuXG4gIHZhciBoYXNDb25zb2xlID0gdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnXG4gIFxuICAvKipcbiAgICogTG9nIGEgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZ1xuICAgKi9cblxuICBleHBvcnRzLmxvZyA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBpZiAoaGFzQ29uc29sZSAmJiBjb25maWcuZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdbVnVlIGluZm9dOiAnICsgbXNnKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXZSd2ZSBnb3QgYSBwcm9ibGVtIGhlcmUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2dcbiAgICovXG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlXG4gIGV4cG9ydHMud2FybiA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBpZiAoaGFzQ29uc29sZSAmJiAoIWNvbmZpZy5zaWxlbnQgfHwgY29uZmlnLmRlYnVnKSkge1xuICAgICAgaWYgKCFjb25maWcuZGVidWcgJiYgIXdhcm5lZCkge1xuICAgICAgICB3YXJuZWQgPSB0cnVlXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICdTZXQgYFZ1ZS5jb25maWcuZGVidWcgPSB0cnVlYCB0byBlbmFibGUgZGVidWcgbW9kZS4nXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUud2FybignW1Z1ZSB3YXJuXTogJyArIG1zZylcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGNvbmZpZy5kZWJ1Zykge1xuICAgICAgICAvKiBqc2hpbnQgZGVidWc6IHRydWUgKi9cbiAgICAgICAgZGVidWdnZXJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IGFzc2V0IGV4aXN0c1xuICAgKi9cblxuICBleHBvcnRzLmFzc2VydEFzc2V0ID0gZnVuY3Rpb24gKHZhbCwgdHlwZSwgaWQpIHtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgZXhwb3J0cy53YXJuKCdGYWlsZWQgdG8gcmVzb2x2ZSAnICsgdHlwZSArICc6ICcgKyBpZClcbiAgICB9XG4gIH1cbn0iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxuLyoqXG4gKiBDaGVjayBpZiBhIG5vZGUgaXMgaW4gdGhlIGRvY3VtZW50LlxuICogTm90ZTogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbnRhaW5zIHNob3VsZCB3b3JrIGhlcmVcbiAqIGJ1dCBhbHdheXMgcmV0dXJucyBmYWxzZSBmb3IgY29tbWVudCBub2RlcyBpbiBwaGFudG9tanMsXG4gKiBtYWtpbmcgdW5pdCB0ZXN0cyBkaWZmaWN1bHQuIFRoaXMgaXMgZml4ZWQgYnl5IGRvaW5nIHRoZVxuICogY29udGFpbnMoKSBjaGVjayBvbiB0aGUgbm9kZSdzIHBhcmVudE5vZGUgaW5zdGVhZCBvZlxuICogdGhlIG5vZGUgaXRzZWxmLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG52YXIgZG9jID1cbiAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcblxuZXhwb3J0cy5pbkRvYyA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIHZhciBwYXJlbnQgPSBub2RlICYmIG5vZGUucGFyZW50Tm9kZVxuICByZXR1cm4gZG9jID09PSBub2RlIHx8XG4gICAgZG9jID09PSBwYXJlbnQgfHxcbiAgICAhIShwYXJlbnQgJiYgcGFyZW50Lm5vZGVUeXBlID09PSAxICYmIChkb2MuY29udGFpbnMocGFyZW50KSkpXG59XG5cbi8qKlxuICogRXh0cmFjdCBhbiBhdHRyaWJ1dGUgZnJvbSBhIG5vZGUuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gYXR0clxuICovXG5cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIChub2RlLCBhdHRyKSB7XG4gIGF0dHIgPSBjb25maWcucHJlZml4ICsgYXR0clxuICB2YXIgdmFsID0gbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cilcbiAgaWYgKHZhbCAhPT0gbnVsbCkge1xuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIpXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG4vKipcbiAqIEluc2VydCBlbCBiZWZvcmUgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqL1xuXG5leHBvcnRzLmJlZm9yZSA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0KSB7XG4gIHRhcmdldC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgdGFyZ2V0KVxufVxuXG4vKipcbiAqIEluc2VydCBlbCBhZnRlciB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICovXG5cbmV4cG9ydHMuYWZ0ZXIgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCkge1xuICBpZiAodGFyZ2V0Lm5leHRTaWJsaW5nKSB7XG4gICAgZXhwb3J0cy5iZWZvcmUoZWwsIHRhcmdldC5uZXh0U2libGluZylcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChlbClcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBlbCBmcm9tIERPTVxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqL1xuXG5leHBvcnRzLnJlbW92ZSA9IGZ1bmN0aW9uIChlbCkge1xuICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxufVxuXG4vKipcbiAqIFByZXBlbmQgZWwgdG8gdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqL1xuXG5leHBvcnRzLnByZXBlbmQgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCkge1xuICBpZiAodGFyZ2V0LmZpcnN0Q2hpbGQpIHtcbiAgICBleHBvcnRzLmJlZm9yZShlbCwgdGFyZ2V0LmZpcnN0Q2hpbGQpXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsKVxuICB9XG59XG5cbi8qKlxuICogUmVwbGFjZSB0YXJnZXQgd2l0aCBlbFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKi9cblxuZXhwb3J0cy5yZXBsYWNlID0gZnVuY3Rpb24gKHRhcmdldCwgZWwpIHtcbiAgdmFyIHBhcmVudCA9IHRhcmdldC5wYXJlbnROb2RlXG4gIGlmIChwYXJlbnQpIHtcbiAgICBwYXJlbnQucmVwbGFjZUNoaWxkKGVsLCB0YXJnZXQpXG4gIH1cbn1cblxuLyoqXG4gKiBDb3B5IGF0dHJpYnV0ZXMgZnJvbSBvbmUgZWxlbWVudCB0byBhbm90aGVyLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZnJvbVxuICogQHBhcmFtIHtFbGVtZW50fSB0b1xuICovXG5cbmV4cG9ydHMuY29weUF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgaWYgKGZyb20uaGFzQXR0cmlidXRlcygpKSB7XG4gICAgdmFyIGF0dHJzID0gZnJvbS5hdHRyaWJ1dGVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBhdHRyID0gYXR0cnNbaV1cbiAgICAgIHRvLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHIudmFsdWUpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWRkIGV2ZW50IGxpc3RlbmVyIHNob3J0aGFuZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxuZXhwb3J0cy5vbiA9IGZ1bmN0aW9uIChlbCwgZXZlbnQsIGNiKSB7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNiKVxufVxuXG4vKipcbiAqIFJlbW92ZSBldmVudCBsaXN0ZW5lciBzaG9ydGhhbmQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbmV4cG9ydHMub2ZmID0gZnVuY3Rpb24gKGVsLCBldmVudCwgY2IpIHtcbiAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2IpXG59XG5cbi8qKlxuICogQWRkIGNsYXNzIHdpdGggY29tcGF0aWJpbGl0eSBmb3IgSUUgJiBTVkdcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cm9uZ30gY2xzXG4gKi9cblxuZXhwb3J0cy5hZGRDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKGNscylcbiAgfSBlbHNlIHtcbiAgICB2YXIgY3VyID0gJyAnICsgKGVsLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJykgKyAnICdcbiAgICBpZiAoY3VyLmluZGV4T2YoJyAnICsgY2xzICsgJyAnKSA8IDApIHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAoY3VyICsgY2xzKS50cmltKCkpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIGNsYXNzIHdpdGggY29tcGF0aWJpbGl0eSBmb3IgSUUgJiBTVkdcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cm9uZ30gY2xzXG4gKi9cblxuZXhwb3J0cy5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNscylcbiAgfSBlbHNlIHtcbiAgICB2YXIgY3VyID0gJyAnICsgKGVsLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJykgKyAnICdcbiAgICB2YXIgdGFyID0gJyAnICsgY2xzICsgJyAnXG4gICAgd2hpbGUgKGN1ci5pbmRleE9mKHRhcikgPj0gMCkge1xuICAgICAgY3VyID0gY3VyLnJlcGxhY2UodGFyLCAnICcpXG4gICAgfVxuICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBjdXIudHJpbSgpKVxuICB9XG59XG5cbi8qKlxuICogRXh0cmFjdCByYXcgY29udGVudCBpbnNpZGUgYW4gZWxlbWVudCBpbnRvIGEgdGVtcG9yYXJ5XG4gKiBjb250YWluZXIgZGl2XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtCb29sZWFufSBhc0ZyYWdtZW50XG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5cbmV4cG9ydHMuZXh0cmFjdENvbnRlbnQgPSBmdW5jdGlvbiAoZWwsIGFzRnJhZ21lbnQpIHtcbiAgdmFyIGNoaWxkXG4gIHZhciByYXdDb250ZW50XG4gIGlmIChlbC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICByYXdDb250ZW50ID0gYXNGcmFnbWVudFxuICAgICAgPyBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICAgIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gICAgd2hpbGUgKGNoaWxkID0gZWwuZmlyc3RDaGlsZCkge1xuICAgICAgcmF3Q29udGVudC5hcHBlbmRDaGlsZChjaGlsZClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJhd0NvbnRlbnRcbn1cbiIsIi8qKlxuICogQ2FuIHdlIHVzZSBfX3Byb3RvX18/XG4gKlxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cblxuZXhwb3J0cy5oYXNQcm90byA9ICdfX3Byb3RvX18nIGluIHt9XG5cbi8qKlxuICogSW5kaWNhdGVzIHdlIGhhdmUgYSB3aW5kb3dcbiAqXG4gKiBAdHlwZSB7Qm9vbGVhbn1cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG52YXIgaW5Ccm93c2VyID0gZXhwb3J0cy5pbkJyb3dzZXIgPVxuICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxuICB0b1N0cmluZy5jYWxsKHdpbmRvdykgIT09ICdbb2JqZWN0IE9iamVjdF0nXG5cbi8qKlxuICogRGVmZXIgYSB0YXNrIHRvIGV4ZWN1dGUgaXQgYXN5bmNocm9ub3VzbHkuIElkZWFsbHkgdGhpc1xuICogc2hvdWxkIGJlIGV4ZWN1dGVkIGFzIGEgbWljcm90YXNrLCBzbyB3ZSBsZXZlcmFnZVxuICogTXV0YXRpb25PYnNlcnZlciBpZiBpdCdzIGF2YWlsYWJsZSwgYW5kIGZhbGxiYWNrIHRvXG4gKiBzZXRUaW1lb3V0KDApLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4XG4gKi9cblxuZXhwb3J0cy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBjYWxsYmFja3MgPSBbXVxuICB2YXIgcGVuZGluZyA9IGZhbHNlXG4gIHZhciB0aW1lckZ1bmNcbiAgZnVuY3Rpb24gaGFuZGxlICgpIHtcbiAgICBwZW5kaW5nID0gZmFsc2VcbiAgICB2YXIgY29waWVzID0gY2FsbGJhY2tzLnNsaWNlKDApXG4gICAgY2FsbGJhY2tzID0gW11cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvcGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29waWVzW2ldKClcbiAgICB9XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmICh0eXBlb2YgTXV0YXRpb25PYnNlcnZlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgY291bnRlciA9IDFcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihoYW5kbGUpXG4gICAgdmFyIHRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY291bnRlcilcbiAgICBvYnNlcnZlci5vYnNlcnZlKHRleHROb2RlLCB7XG4gICAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlXG4gICAgfSlcbiAgICB0aW1lckZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjb3VudGVyID0gKGNvdW50ZXIgKyAxKSAlIDJcbiAgICAgIHRleHROb2RlLmRhdGEgPSBjb3VudGVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRpbWVyRnVuYyA9IHNldFRpbWVvdXRcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGNiLCBjdHgpIHtcbiAgICB2YXIgZnVuYyA9IGN0eFxuICAgICAgPyBmdW5jdGlvbiAoKSB7IGNiLmNhbGwoY3R4KSB9XG4gICAgICA6IGNiXG4gICAgY2FsbGJhY2tzLnB1c2goZnVuYylcbiAgICBpZiAocGVuZGluZykgcmV0dXJuXG4gICAgcGVuZGluZyA9IHRydWVcbiAgICB0aW1lckZ1bmMoaGFuZGxlLCAwKVxuICB9XG59KSgpXG5cbi8qKlxuICogRGV0ZWN0IGlmIHdlIGFyZSBpbiBJRTkuLi5cbiAqXG4gKiBAdHlwZSB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmlzSUU5ID1cbiAgaW5Ccm93c2VyICYmXG4gIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignTVNJRSA5LjAnKSA+IDBcblxuLyoqXG4gKiBTbmlmZiB0cmFuc2l0aW9uL2FuaW1hdGlvbiBldmVudHNcbiAqL1xuXG5pZiAoaW5Ccm93c2VyICYmICFleHBvcnRzLmlzSUU5KSB7XG4gIHZhciBpc1dlYmtpdFRyYW5zID1cbiAgICB3aW5kb3cub250cmFuc2l0aW9uZW5kID09PSB1bmRlZmluZWQgJiZcbiAgICB3aW5kb3cub253ZWJraXR0cmFuc2l0aW9uZW5kICE9PSB1bmRlZmluZWRcbiAgdmFyIGlzV2Via2l0QW5pbSA9XG4gICAgd2luZG93Lm9uYW5pbWF0aW9uZW5kID09PSB1bmRlZmluZWQgJiZcbiAgICB3aW5kb3cub253ZWJraXRhbmltYXRpb25lbmQgIT09IHVuZGVmaW5lZFxuICBleHBvcnRzLnRyYW5zaXRpb25Qcm9wID0gaXNXZWJraXRUcmFuc1xuICAgID8gJ1dlYmtpdFRyYW5zaXRpb24nXG4gICAgOiAndHJhbnNpdGlvbidcbiAgZXhwb3J0cy50cmFuc2l0aW9uRW5kRXZlbnQgPSBpc1dlYmtpdFRyYW5zXG4gICAgPyAnd2Via2l0VHJhbnNpdGlvbkVuZCdcbiAgICA6ICd0cmFuc2l0aW9uZW5kJ1xuICBleHBvcnRzLmFuaW1hdGlvblByb3AgPSBpc1dlYmtpdEFuaW1cbiAgICA/ICdXZWJraXRBbmltYXRpb24nXG4gICAgOiAnYW5pbWF0aW9uJ1xuICBleHBvcnRzLmFuaW1hdGlvbkVuZEV2ZW50ID0gaXNXZWJraXRBbmltXG4gICAgPyAnd2Via2l0QW5pbWF0aW9uRW5kJ1xuICAgIDogJ2FuaW1hdGlvbmVuZCdcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vZGVidWcnKVxuXG4vKipcbiAqIFJlc29sdmUgcmVhZCAmIHdyaXRlIGZpbHRlcnMgZm9yIGEgdm0gaW5zdGFuY2UuIFRoZVxuICogZmlsdGVycyBkZXNjcmlwdG9yIEFycmF5IGNvbWVzIGZyb20gdGhlIGRpcmVjdGl2ZSBwYXJzZXIuXG4gKlxuICogVGhpcyBpcyBleHRyYWN0ZWQgaW50byBpdHMgb3duIHV0aWxpdHkgc28gaXQgY2FuXG4gKiBiZSB1c2VkIGluIG11bHRpcGxlIHNjZW5hcmlvcy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gZmlsdGVyc1xuICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZXhwb3J0cy5yZXNvbHZlRmlsdGVycyA9IGZ1bmN0aW9uICh2bSwgZmlsdGVycywgdGFyZ2V0KSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIHJldHVyblxuICB9XG4gIHZhciByZXMgPSB0YXJnZXQgfHwge31cbiAgLy8gdmFyIHJlZ2lzdHJ5ID0gdm0uJG9wdGlvbnMuZmlsdGVyc1xuICBmaWx0ZXJzLmZvckVhY2goZnVuY3Rpb24gKGYpIHtcbiAgICB2YXIgZGVmID0gdm0uJG9wdGlvbnMuZmlsdGVyc1tmLm5hbWVdXG4gICAgXy5hc3NlcnRBc3NldChkZWYsICdmaWx0ZXInLCBmLm5hbWUpXG4gICAgaWYgKCFkZWYpIHJldHVyblxuICAgIHZhciBhcmdzID0gZi5hcmdzXG4gICAgdmFyIHJlYWRlciwgd3JpdGVyXG4gICAgaWYgKHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlYWRlciA9IGRlZlxuICAgIH0gZWxzZSB7XG4gICAgICByZWFkZXIgPSBkZWYucmVhZFxuICAgICAgd3JpdGVyID0gZGVmLndyaXRlXG4gICAgfVxuICAgIGlmIChyZWFkZXIpIHtcbiAgICAgIGlmICghcmVzLnJlYWQpIHJlcy5yZWFkID0gW11cbiAgICAgIHJlcy5yZWFkLnB1c2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBhcmdzXG4gICAgICAgICAgPyByZWFkZXIuYXBwbHkodm0sIFt2YWx1ZV0uY29uY2F0KGFyZ3MpKVxuICAgICAgICAgIDogcmVhZGVyLmNhbGwodm0sIHZhbHVlKVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYgKHdyaXRlcikge1xuICAgICAgaWYgKCFyZXMud3JpdGUpIHJlcy53cml0ZSA9IFtdXG4gICAgICByZXMud3JpdGUucHVzaChmdW5jdGlvbiAodmFsdWUsIG9sZFZhbCkge1xuICAgICAgICByZXR1cm4gYXJnc1xuICAgICAgICAgID8gd3JpdGVyLmFwcGx5KHZtLCBbdmFsdWUsIG9sZFZhbF0uY29uY2F0KGFyZ3MpKVxuICAgICAgICAgIDogd3JpdGVyLmNhbGwodm0sIHZhbHVlLCBvbGRWYWwpXG4gICAgICB9KVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHJlc1xufVxuXG4vKipcbiAqIEFwcGx5IGZpbHRlcnMgdG8gYSB2YWx1ZVxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7QXJyYXl9IGZpbHRlcnNcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHsqfSBvbGRWYWxcbiAqIEByZXR1cm4geyp9XG4gKi9cblxuZXhwb3J0cy5hcHBseUZpbHRlcnMgPSBmdW5jdGlvbiAodmFsdWUsIGZpbHRlcnMsIHZtLCBvbGRWYWwpIHtcbiAgaWYgKCFmaWx0ZXJzKSB7XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhbHVlID0gZmlsdGVyc1tpXS5jYWxsKHZtLCB2YWx1ZSwgb2xkVmFsKVxuICB9XG4gIHJldHVybiB2YWx1ZVxufSIsInZhciBsYW5nICAgPSByZXF1aXJlKCcuL2xhbmcnKVxudmFyIGV4dGVuZCA9IGxhbmcuZXh0ZW5kXG5cbmV4dGVuZChleHBvcnRzLCBsYW5nKVxuZXh0ZW5kKGV4cG9ydHMsIHJlcXVpcmUoJy4vZW52JykpXG5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9kb20nKSlcbmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2ZpbHRlcicpKVxuZXh0ZW5kKGV4cG9ydHMsIHJlcXVpcmUoJy4vZGVidWcnKSkiLCIvKipcbiAqIENoZWNrIGlzIGEgc3RyaW5nIHN0YXJ0cyB3aXRoICQgb3IgX1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZXhwb3J0cy5pc1Jlc2VydmVkID0gZnVuY3Rpb24gKHN0cikge1xuICB2YXIgYyA9IChzdHIgKyAnJykuY2hhckNvZGVBdCgwKVxuICByZXR1cm4gYyA9PT0gMHgyNCB8fCBjID09PSAweDVGXG59XG5cbi8qKlxuICogR3VhcmQgdGV4dCBvdXRwdXQsIG1ha2Ugc3VyZSB1bmRlZmluZWQgb3V0cHV0c1xuICogZW1wdHkgc3RyaW5nXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMudG9TdHJpbmcgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICA/ICcnXG4gICAgOiB2YWx1ZS50b1N0cmluZygpXG59XG5cbi8qKlxuICogQ2hlY2sgYW5kIGNvbnZlcnQgcG9zc2libGUgbnVtZXJpYyBudW1iZXJzIGJlZm9yZVxuICogc2V0dGluZyBiYWNrIHRvIGRhdGFcbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHsqfE51bWJlcn1cbiAqL1xuXG5leHBvcnRzLnRvTnVtYmVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAoXG4gICAgaXNOYU4odmFsdWUpIHx8XG4gICAgdmFsdWUgPT09IG51bGwgfHxcbiAgICB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJ1xuICApID8gdmFsdWVcbiAgICA6IE51bWJlcih2YWx1ZSlcbn1cblxuLyoqXG4gKiBTdHJpcCBxdW90ZXMgZnJvbSBhIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZyB8IGZhbHNlfVxuICovXG5cbmV4cG9ydHMuc3RyaXBRdW90ZXMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHZhciBhID0gc3RyLmNoYXJDb2RlQXQoMClcbiAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChzdHIubGVuZ3RoIC0gMSlcbiAgcmV0dXJuIGEgPT09IGIgJiYgKGEgPT09IDB4MjIgfHwgYSA9PT0gMHgyNylcbiAgICA/IHN0ci5zbGljZSgxLCAtMSlcbiAgICA6IGZhbHNlXG59XG5cbi8qKlxuICogUmVwbGFjZSBoZWxwZXJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gXyAtIG1hdGNoZWQgZGVsaW1pdGVyXG4gKiBAcGFyYW0ge1N0cmluZ30gYyAtIG1hdGNoZWQgY2hhclxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiB0b1VwcGVyIChfLCBjKSB7XG4gIHJldHVybiBjID8gYy50b1VwcGVyQ2FzZSAoKSA6ICcnXG59XG5cbi8qKlxuICogQ2FtZWxpemUgYSBoeXBoZW4tZGVsbWl0ZWQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG52YXIgY2FtZWxSRSA9IC8tKFxcdykvZ1xuZXhwb3J0cy5jYW1lbGl6ZSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGNhbWVsUkUsIHRvVXBwZXIpXG59XG5cbi8qKlxuICogQ29udmVydHMgaHlwaGVuL3VuZGVyc2NvcmUvc2xhc2ggZGVsaW1pdGVyZWQgbmFtZXMgaW50b1xuICogY2FtZWxpemVkIGNsYXNzTmFtZXMuXG4gKlxuICogZS5nLiBteS1jb21wb25lbnQgPT4gTXlDb21wb25lbnRcbiAqICAgICAgc29tZV9lbHNlICAgID0+IFNvbWVFbHNlXG4gKiAgICAgIHNvbWUvY29tcCAgICA9PiBTb21lQ29tcFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG52YXIgY2xhc3NpZnlSRSA9IC8oPzpefFstX1xcL10pKFxcdykvZ1xuZXhwb3J0cy5jbGFzc2lmeSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGNsYXNzaWZ5UkUsIHRvVXBwZXIpXG59XG5cbi8qKlxuICogU2ltcGxlIGJpbmQsIGZhc3RlciB0aGFuIG5hdGl2ZVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdH0gY3R4XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5leHBvcnRzLmJpbmQgPSBmdW5jdGlvbiAoZm4sIGN0eCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmbi5hcHBseShjdHgsIGFyZ3VtZW50cylcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnQgYW4gQXJyYXktbGlrZSBvYmplY3QgdG8gYSByZWFsIEFycmF5LlxuICpcbiAqIEBwYXJhbSB7QXJyYXktbGlrZX0gbGlzdFxuICogQHBhcmFtIHtOdW1iZXJ9IFtzdGFydF0gLSBzdGFydCBpbmRleFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZXhwb3J0cy50b0FycmF5ID0gZnVuY3Rpb24gKGxpc3QsIHN0YXJ0KSB7XG4gIHN0YXJ0ID0gc3RhcnQgfHwgMFxuICB2YXIgaSA9IGxpc3QubGVuZ3RoIC0gc3RhcnRcbiAgdmFyIHJldCA9IG5ldyBBcnJheShpKVxuICB3aGlsZSAoaS0tKSB7XG4gICAgcmV0W2ldID0gbGlzdFtpICsgc3RhcnRdXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIE1peCBwcm9wZXJ0aWVzIGludG8gdGFyZ2V0IG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdG9cbiAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tXG4gKi9cblxuZXhwb3J0cy5leHRlbmQgPSBmdW5jdGlvbiAodG8sIGZyb20pIHtcbiAgZm9yICh2YXIga2V5IGluIGZyb20pIHtcbiAgICB0b1trZXldID0gZnJvbVtrZXldXG4gIH1cbiAgcmV0dXJuIHRvXG59XG5cbi8qKlxuICogUXVpY2sgb2JqZWN0IGNoZWNrIC0gdGhpcyBpcyBwcmltYXJpbHkgdXNlZCB0byB0ZWxsXG4gKiBPYmplY3RzIGZyb20gcHJpbWl0aXZlIHZhbHVlcyB3aGVuIHdlIGtub3cgdGhlIHZhbHVlXG4gKiBpcyBhIEpTT04tY29tcGxpYW50IHR5cGUuXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZXhwb3J0cy5pc09iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0J1xufVxuXG4vKipcbiAqIFN0cmljdCBvYmplY3QgdHlwZSBjaGVjay4gT25seSByZXR1cm5zIHRydWVcbiAqIGZvciBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdHMuXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xuZXhwb3J0cy5pc1BsYWluT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBPYmplY3RdJ1xufVxuXG4vKipcbiAqIEFycmF5IHR5cGUgY2hlY2suXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZXhwb3J0cy5pc0FycmF5ID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopXG59XG5cbi8qKlxuICogRGVmaW5lIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHBhcmFtIHtCb29sZWFufSBbZW51bWVyYWJsZV1cbiAqL1xuXG5leHBvcnRzLmRlZmluZSA9IGZ1bmN0aW9uIChvYmosIGtleSwgdmFsLCBlbnVtZXJhYmxlKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgIHZhbHVlICAgICAgICA6IHZhbCxcbiAgICBlbnVtZXJhYmxlICAgOiAhIWVudW1lcmFibGUsXG4gICAgd3JpdGFibGUgICAgIDogdHJ1ZSxcbiAgICBjb25maWd1cmFibGUgOiB0cnVlXG4gIH0pXG59XG5cbi8qKlxuICogRGVib3VuY2UgYSBmdW5jdGlvbiBzbyBpdCBvbmx5IGdldHMgY2FsbGVkIGFmdGVyIHRoZVxuICogaW5wdXQgc3RvcHMgYXJyaXZpbmcgYWZ0ZXIgdGhlIGdpdmVuIHdhaXQgcGVyaW9kLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmNcbiAqIEBwYXJhbSB7TnVtYmVyfSB3YWl0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKi9cblxuZXhwb3J0cy5kZWJvdW5jZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0XG4gIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXN0ID0gRGF0ZS5ub3coKSAtIHRpbWVzdGFtcFxuICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID49IDApIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdClcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZW91dCA9IG51bGxcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncylcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsXG4gICAgfVxuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBjb250ZXh0ID0gdGhpc1xuICAgIGFyZ3MgPSBhcmd1bWVudHNcbiAgICB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdClcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuL2luZGV4JylcbnZhciBleHRlbmQgPSBfLmV4dGVuZFxuXG4vKipcbiAqIE9wdGlvbiBvdmVyd3JpdGluZyBzdHJhdGVnaWVzIGFyZSBmdW5jdGlvbnMgdGhhdCBoYW5kbGVcbiAqIGhvdyB0byBtZXJnZSBhIHBhcmVudCBvcHRpb24gdmFsdWUgYW5kIGEgY2hpbGQgb3B0aW9uXG4gKiB2YWx1ZSBpbnRvIHRoZSBmaW5hbCB2YWx1ZS5cbiAqXG4gKiBBbGwgc3RyYXRlZ3kgZnVuY3Rpb25zIGZvbGxvdyB0aGUgc2FtZSBzaWduYXR1cmU6XG4gKlxuICogQHBhcmFtIHsqfSBwYXJlbnRWYWxcbiAqIEBwYXJhbSB7Kn0gY2hpbGRWYWxcbiAqIEBwYXJhbSB7VnVlfSBbdm1dXG4gKi9cblxudmFyIHN0cmF0cyA9IE9iamVjdC5jcmVhdGUobnVsbClcblxuLyoqXG4gKiBIZWxwZXIgdGhhdCByZWN1cnNpdmVseSBtZXJnZXMgdHdvIGRhdGEgb2JqZWN0cyB0b2dldGhlci5cbiAqL1xuXG5mdW5jdGlvbiBtZXJnZURhdGEgKHRvLCBmcm9tKSB7XG4gIHZhciBrZXksIHRvVmFsLCBmcm9tVmFsXG4gIGZvciAoa2V5IGluIGZyb20pIHtcbiAgICB0b1ZhbCA9IHRvW2tleV1cbiAgICBmcm9tVmFsID0gZnJvbVtrZXldXG4gICAgaWYgKCF0by5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB0by4kYWRkKGtleSwgZnJvbVZhbClcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QodG9WYWwpICYmIF8uaXNPYmplY3QoZnJvbVZhbCkpIHtcbiAgICAgIG1lcmdlRGF0YSh0b1ZhbCwgZnJvbVZhbClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvXG59XG5cbi8qKlxuICogRGF0YVxuICovXG5cbnN0cmF0cy5kYXRhID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwsIHZtKSB7XG4gIGlmICghdm0pIHtcbiAgICAvLyBpbiBhIFZ1ZS5leHRlbmQgbWVyZ2UsIGJvdGggc2hvdWxkIGJlIGZ1bmN0aW9uc1xuICAgIGlmICghY2hpbGRWYWwpIHtcbiAgICAgIHJldHVybiBwYXJlbnRWYWxcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjaGlsZFZhbCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnVGhlIFwiZGF0YVwiIG9wdGlvbiBzaG91bGQgYmUgYSBmdW5jdGlvbiAnICtcbiAgICAgICAgJ3RoYXQgcmV0dXJucyBhIHBlci1pbnN0YW5jZSB2YWx1ZSBpbiBjb21wb25lbnQgJyArXG4gICAgICAgICdkZWZpbml0aW9ucy4nXG4gICAgICApXG4gICAgICByZXR1cm4gcGFyZW50VmFsXG4gICAgfVxuICAgIGlmICghcGFyZW50VmFsKSB7XG4gICAgICByZXR1cm4gY2hpbGRWYWxcbiAgICB9XG4gICAgLy8gd2hlbiBwYXJlbnRWYWwgJiBjaGlsZFZhbCBhcmUgYm90aCBwcmVzZW50LFxuICAgIC8vIHdlIG5lZWQgdG8gcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAgIC8vIG1lcmdlZCByZXN1bHQgb2YgYm90aCBmdW5jdGlvbnMuLi4gbm8gbmVlZCB0b1xuICAgIC8vIGNoZWNrIGlmIHBhcmVudFZhbCBpcyBhIGZ1bmN0aW9uIGhlcmUgYmVjYXVzZVxuICAgIC8vIGl0IGhhcyB0byBiZSBhIGZ1bmN0aW9uIHRvIHBhc3MgcHJldmlvdXMgbWVyZ2VzLlxuICAgIHJldHVybiBmdW5jdGlvbiBtZXJnZWREYXRhRm4gKCkge1xuICAgICAgcmV0dXJuIG1lcmdlRGF0YShcbiAgICAgICAgY2hpbGRWYWwuY2FsbCh0aGlzKSxcbiAgICAgICAgcGFyZW50VmFsLmNhbGwodGhpcylcbiAgICAgIClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gaW5zdGFuY2UgbWVyZ2UsIHJldHVybiByYXcgb2JqZWN0XG4gICAgdmFyIGluc3RhbmNlRGF0YSA9IHR5cGVvZiBjaGlsZFZhbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBjaGlsZFZhbC5jYWxsKHZtKVxuICAgICAgOiBjaGlsZFZhbFxuICAgIHZhciBkZWZhdWx0RGF0YSA9IHR5cGVvZiBwYXJlbnRWYWwgPT09ICdmdW5jdGlvbidcbiAgICAgID8gcGFyZW50VmFsLmNhbGwodm0pXG4gICAgICA6IHVuZGVmaW5lZFxuICAgIGlmIChpbnN0YW5jZURhdGEpIHtcbiAgICAgIHJldHVybiBtZXJnZURhdGEoaW5zdGFuY2VEYXRhLCBkZWZhdWx0RGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRlZmF1bHREYXRhXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRWxcbiAqL1xuXG5zdHJhdHMuZWwgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCwgdm0pIHtcbiAgaWYgKCF2bSAmJiBjaGlsZFZhbCAmJiB0eXBlb2YgY2hpbGRWYWwgIT09ICdmdW5jdGlvbicpIHtcbiAgICBfLndhcm4oXG4gICAgICAnVGhlIFwiZWxcIiBvcHRpb24gc2hvdWxkIGJlIGEgZnVuY3Rpb24gJyArXG4gICAgICAndGhhdCByZXR1cm5zIGEgcGVyLWluc3RhbmNlIHZhbHVlIGluIGNvbXBvbmVudCAnICtcbiAgICAgICdkZWZpbml0aW9ucy4nXG4gICAgKVxuICAgIHJldHVyblxuICB9XG4gIHZhciByZXQgPSBjaGlsZFZhbCB8fCBwYXJlbnRWYWxcbiAgLy8gaW52b2tlIHRoZSBlbGVtZW50IGZhY3RvcnkgaWYgdGhpcyBpcyBpbnN0YW5jZSBtZXJnZVxuICByZXR1cm4gdm0gJiYgdHlwZW9mIHJldCA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gcmV0LmNhbGwodm0pXG4gICAgOiByZXRcbn1cblxuLyoqXG4gKiBIb29rcyBhbmQgcGFyYW0gYXR0cmlidXRlcyBhcmUgbWVyZ2VkIGFzIGFycmF5cy5cbiAqL1xuXG5zdHJhdHMuY3JlYXRlZCA9XG5zdHJhdHMucmVhZHkgPVxuc3RyYXRzLmF0dGFjaGVkID1cbnN0cmF0cy5kZXRhY2hlZCA9XG5zdHJhdHMuYmVmb3JlQ29tcGlsZSA9XG5zdHJhdHMuY29tcGlsZWQgPVxuc3RyYXRzLmJlZm9yZURlc3Ryb3kgPVxuc3RyYXRzLmRlc3Ryb3llZCA9XG5zdHJhdHMucGFyYW1BdHRyaWJ1dGVzID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgcmV0dXJuIGNoaWxkVmFsXG4gICAgPyBwYXJlbnRWYWxcbiAgICAgID8gcGFyZW50VmFsLmNvbmNhdChjaGlsZFZhbClcbiAgICAgIDogXy5pc0FycmF5KGNoaWxkVmFsKVxuICAgICAgICA/IGNoaWxkVmFsXG4gICAgICAgIDogW2NoaWxkVmFsXVxuICAgIDogcGFyZW50VmFsXG59XG5cbi8qKlxuICogQXNzZXRzXG4gKlxuICogV2hlbiBhIHZtIGlzIHByZXNlbnQgKGluc3RhbmNlIGNyZWF0aW9uKSwgd2UgbmVlZCB0byBkb1xuICogYSB0aHJlZS13YXkgbWVyZ2UgYmV0d2VlbiBjb25zdHJ1Y3RvciBvcHRpb25zLCBpbnN0YW5jZVxuICogb3B0aW9ucyBhbmQgcGFyZW50IG9wdGlvbnMuXG4gKi9cblxuc3RyYXRzLmRpcmVjdGl2ZXMgPVxuc3RyYXRzLmZpbHRlcnMgPVxuc3RyYXRzLnBhcnRpYWxzID1cbnN0cmF0cy50cmFuc2l0aW9ucyA9XG5zdHJhdHMuY29tcG9uZW50cyA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsLCB2bSwga2V5KSB7XG4gIHZhciByZXQgPSBPYmplY3QuY3JlYXRlKFxuICAgIHZtICYmIHZtLiRwYXJlbnRcbiAgICAgID8gdm0uJHBhcmVudC4kb3B0aW9uc1trZXldXG4gICAgICA6IF8uVnVlLm9wdGlvbnNba2V5XVxuICApXG4gIGlmIChwYXJlbnRWYWwpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHBhcmVudFZhbClcbiAgICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gICAgdmFyIGZpZWxkXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgZmllbGQgPSBrZXlzW2ldXG4gICAgICByZXRbZmllbGRdID0gcGFyZW50VmFsW2ZpZWxkXVxuICAgIH1cbiAgfVxuICBpZiAoY2hpbGRWYWwpIGV4dGVuZChyZXQsIGNoaWxkVmFsKVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogRXZlbnRzICYgV2F0Y2hlcnMuXG4gKlxuICogRXZlbnRzICYgd2F0Y2hlcnMgaGFzaGVzIHNob3VsZCBub3Qgb3ZlcndyaXRlIG9uZVxuICogYW5vdGhlciwgc28gd2UgbWVyZ2UgdGhlbSBhcyBhcnJheXMuXG4gKi9cblxuc3RyYXRzLndhdGNoID1cbnN0cmF0cy5ldmVudHMgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICBpZiAoIWNoaWxkVmFsKSByZXR1cm4gcGFyZW50VmFsXG4gIGlmICghcGFyZW50VmFsKSByZXR1cm4gY2hpbGRWYWxcbiAgdmFyIHJldCA9IHt9XG4gIGV4dGVuZChyZXQsIHBhcmVudFZhbClcbiAgZm9yICh2YXIga2V5IGluIGNoaWxkVmFsKSB7XG4gICAgdmFyIHBhcmVudCA9IHJldFtrZXldXG4gICAgdmFyIGNoaWxkID0gY2hpbGRWYWxba2V5XVxuICAgIGlmIChwYXJlbnQgJiYgIV8uaXNBcnJheShwYXJlbnQpKSB7XG4gICAgICBwYXJlbnQgPSBbcGFyZW50XVxuICAgIH1cbiAgICByZXRba2V5XSA9IHBhcmVudFxuICAgICAgPyBwYXJlbnQuY29uY2F0KGNoaWxkKVxuICAgICAgOiBbY2hpbGRdXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIE90aGVyIG9iamVjdCBoYXNoZXMuXG4gKi9cblxuc3RyYXRzLm1ldGhvZHMgPVxuc3RyYXRzLmNvbXB1dGVkID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgaWYgKCFjaGlsZFZhbCkgcmV0dXJuIHBhcmVudFZhbFxuICBpZiAoIXBhcmVudFZhbCkgcmV0dXJuIGNoaWxkVmFsXG4gIHZhciByZXQgPSBPYmplY3QuY3JlYXRlKHBhcmVudFZhbClcbiAgZXh0ZW5kKHJldCwgY2hpbGRWYWwpXG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHN0cmF0ZWd5LlxuICovXG5cbnZhciBkZWZhdWx0U3RyYXQgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICByZXR1cm4gY2hpbGRWYWwgPT09IHVuZGVmaW5lZFxuICAgID8gcGFyZW50VmFsXG4gICAgOiBjaGlsZFZhbFxufVxuXG4vKipcbiAqIE1ha2Ugc3VyZSBjb21wb25lbnQgb3B0aW9ucyBnZXQgY29udmVydGVkIHRvIGFjdHVhbFxuICogY29uc3RydWN0b3JzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzXG4gKi9cblxuZnVuY3Rpb24gZ3VhcmRDb21wb25lbnRzIChjb21wb25lbnRzKSB7XG4gIGlmIChjb21wb25lbnRzKSB7XG4gICAgdmFyIGRlZlxuICAgIGZvciAodmFyIGtleSBpbiBjb21wb25lbnRzKSB7XG4gICAgICBkZWYgPSBjb21wb25lbnRzW2tleV1cbiAgICAgIGlmIChfLmlzUGxhaW5PYmplY3QoZGVmKSkge1xuICAgICAgICBkZWYubmFtZSA9IGtleVxuICAgICAgICBjb21wb25lbnRzW2tleV0gPSBfLlZ1ZS5leHRlbmQoZGVmKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlIHR3byBvcHRpb24gb2JqZWN0cyBpbnRvIGEgbmV3IG9uZS5cbiAqIENvcmUgdXRpbGl0eSB1c2VkIGluIGJvdGggaW5zdGFudGlhdGlvbiBhbmQgaW5oZXJpdGFuY2UuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhcmVudFxuICogQHBhcmFtIHtPYmplY3R9IGNoaWxkXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXSAtIGlmIHZtIGlzIHByZXNlbnQsIGluZGljYXRlcyB0aGlzIGlzXG4gKiAgICAgICAgICAgICAgICAgICAgIGFuIGluc3RhbnRpYXRpb24gbWVyZ2UuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZU9wdGlvbnMgKHBhcmVudCwgY2hpbGQsIHZtKSB7XG4gIGd1YXJkQ29tcG9uZW50cyhjaGlsZC5jb21wb25lbnRzKVxuICB2YXIgb3B0aW9ucyA9IHt9XG4gIHZhciBrZXlcbiAgaWYgKGNoaWxkLm1peGlucykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGQubWl4aW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcGFyZW50ID0gbWVyZ2VPcHRpb25zKHBhcmVudCwgY2hpbGQubWl4aW5zW2ldLCB2bSlcbiAgICB9XG4gIH1cbiAgZm9yIChrZXkgaW4gcGFyZW50KSB7XG4gICAgbWVyZ2Uoa2V5KVxuICB9XG4gIGZvciAoa2V5IGluIGNoaWxkKSB7XG4gICAgaWYgKCEocGFyZW50Lmhhc093blByb3BlcnR5KGtleSkpKSB7XG4gICAgICBtZXJnZShrZXkpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1lcmdlIChrZXkpIHtcbiAgICB2YXIgc3RyYXQgPSBzdHJhdHNba2V5XSB8fCBkZWZhdWx0U3RyYXRcbiAgICBvcHRpb25zW2tleV0gPSBzdHJhdChwYXJlbnRba2V5XSwgY2hpbGRba2V5XSwgdm0sIGtleSlcbiAgfVxuICByZXR1cm4gb3B0aW9uc1xufSIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBleHRlbmQgPSBfLmV4dGVuZFxuXG4vKipcbiAqIFRoZSBleHBvc2VkIFZ1ZSBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBBUEkgY29udmVudGlvbnM6XG4gKiAtIHB1YmxpYyBBUEkgbWV0aG9kcy9wcm9wZXJ0aWVzIGFyZSBwcmVmaWV4ZWQgd2l0aCBgJGBcbiAqIC0gaW50ZXJuYWwgbWV0aG9kcy9wcm9wZXJ0aWVzIGFyZSBwcmVmaXhlZCB3aXRoIGBfYFxuICogLSBub24tcHJlZml4ZWQgcHJvcGVydGllcyBhcmUgYXNzdW1lZCB0byBiZSBwcm94aWVkIHVzZXJcbiAqICAgZGF0YS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBWdWUgKG9wdGlvbnMpIHtcbiAgdGhpcy5faW5pdChvcHRpb25zKVxufVxuXG4vKipcbiAqIE1peGluIGdsb2JhbCBBUElcbiAqL1xuXG5leHRlbmQoVnVlLCByZXF1aXJlKCcuL2FwaS9nbG9iYWwnKSlcblxuLyoqXG4gKiBWdWUgYW5kIGV2ZXJ5IGNvbnN0cnVjdG9yIHRoYXQgZXh0ZW5kcyBWdWUgaGFzIGFuXG4gKiBhc3NvY2lhdGVkIG9wdGlvbnMgb2JqZWN0LCB3aGljaCBjYW4gYmUgYWNjZXNzZWQgZHVyaW5nXG4gKiBjb21waWxhdGlvbiBzdGVwcyBhcyBgdGhpcy5jb25zdHJ1Y3Rvci5vcHRpb25zYC5cbiAqXG4gKiBUaGVzZSBjYW4gYmUgc2VlbiBhcyB0aGUgZGVmYXVsdCBvcHRpb25zIG9mIGV2ZXJ5XG4gKiBWdWUgaW5zdGFuY2UuXG4gKi9cblxuVnVlLm9wdGlvbnMgPSB7XG4gIGRpcmVjdGl2ZXMgIDogcmVxdWlyZSgnLi9kaXJlY3RpdmVzJyksXG4gIGZpbHRlcnMgICAgIDogcmVxdWlyZSgnLi9maWx0ZXJzJyksXG4gIHBhcnRpYWxzICAgIDoge30sXG4gIHRyYW5zaXRpb25zIDoge30sXG4gIGNvbXBvbmVudHMgIDoge31cbn1cblxuLyoqXG4gKiBCdWlsZCB1cCB0aGUgcHJvdG90eXBlXG4gKi9cblxudmFyIHAgPSBWdWUucHJvdG90eXBlXG5cbi8qKlxuICogJGRhdGEgaGFzIGEgc2V0dGVyIHdoaWNoIGRvZXMgYSBidW5jaCBvZlxuICogdGVhcmRvd24vc2V0dXAgd29ya1xuICovXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShwLCAnJGRhdGEnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhXG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKG5ld0RhdGEpIHtcbiAgICB0aGlzLl9zZXREYXRhKG5ld0RhdGEpXG4gIH1cbn0pXG5cbi8qKlxuICogTWl4aW4gaW50ZXJuYWwgaW5zdGFuY2UgbWV0aG9kc1xuICovXG5cbmV4dGVuZChwLCByZXF1aXJlKCcuL2luc3RhbmNlL2luaXQnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2luc3RhbmNlL2V2ZW50cycpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vaW5zdGFuY2Uvc2NvcGUnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2luc3RhbmNlL2NvbXBpbGUnKSlcblxuLyoqXG4gKiBNaXhpbiBwdWJsaWMgQVBJIG1ldGhvZHNcbiAqL1xuXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvZGF0YScpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2RvbScpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2V2ZW50cycpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2NoaWxkJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvbGlmZWN5Y2xlJykpXG5cbm1vZHVsZS5leHBvcnRzID0gXy5WdWUgPSBWdWUiLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxudmFyIE9ic2VydmVyID0gcmVxdWlyZSgnLi9vYnNlcnZlcicpXG52YXIgZXhwUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxudmFyIGJhdGNoZXIgPSByZXF1aXJlKCcuL2JhdGNoZXInKVxudmFyIHVpZCA9IDBcblxuLyoqXG4gKiBBIHdhdGNoZXIgcGFyc2VzIGFuIGV4cHJlc3Npb24sIGNvbGxlY3RzIGRlcGVuZGVuY2llcyxcbiAqIGFuZCBmaXJlcyBjYWxsYmFjayB3aGVuIHRoZSBleHByZXNzaW9uIHZhbHVlIGNoYW5nZXMuXG4gKiBUaGlzIGlzIHVzZWQgZm9yIGJvdGggdGhlICR3YXRjaCgpIGFwaSBhbmQgZGlyZWN0aXZlcy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBleHByZXNzaW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgICAgICAgICAgICAgICAtIHtBcnJheX0gZmlsdGVyc1xuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IHR3b1dheVxuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IGRlZXBcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSB1c2VyXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBXYXRjaGVyICh2bSwgZXhwcmVzc2lvbiwgY2IsIG9wdGlvbnMpIHtcbiAgdGhpcy52bSA9IHZtXG4gIHZtLl93YXRjaGVyTGlzdC5wdXNoKHRoaXMpXG4gIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25cbiAgdGhpcy5jYnMgPSBbY2JdXG4gIHRoaXMuaWQgPSArK3VpZCAvLyB1aWQgZm9yIGJhdGNoaW5nXG4gIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB0aGlzLmRlZXAgPSAhIW9wdGlvbnMuZGVlcFxuICB0aGlzLnVzZXIgPSAhIW9wdGlvbnMudXNlclxuICB0aGlzLmRlcHMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIC8vIHNldHVwIGZpbHRlcnMgaWYgYW55LlxuICAvLyBXZSBkZWxlZ2F0ZSBkaXJlY3RpdmUgZmlsdGVycyBoZXJlIHRvIHRoZSB3YXRjaGVyXG4gIC8vIGJlY2F1c2UgdGhleSBuZWVkIHRvIGJlIGluY2x1ZGVkIGluIHRoZSBkZXBlbmRlbmN5XG4gIC8vIGNvbGxlY3Rpb24gcHJvY2Vzcy5cbiAgaWYgKG9wdGlvbnMuZmlsdGVycykge1xuICAgIHRoaXMucmVhZEZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnMucmVhZFxuICAgIHRoaXMud3JpdGVGaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzLndyaXRlXG4gIH1cbiAgLy8gcGFyc2UgZXhwcmVzc2lvbiBmb3IgZ2V0dGVyL3NldHRlclxuICB2YXIgcmVzID0gZXhwUGFyc2VyLnBhcnNlKGV4cHJlc3Npb24sIG9wdGlvbnMudHdvV2F5KVxuICB0aGlzLmdldHRlciA9IHJlcy5nZXRcbiAgdGhpcy5zZXR0ZXIgPSByZXMuc2V0XG4gIHRoaXMudmFsdWUgPSB0aGlzLmdldCgpXG59XG5cbnZhciBwID0gV2F0Y2hlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBZGQgYSBkZXBlbmRlbmN5IHRvIHRoaXMgZGlyZWN0aXZlLlxuICpcbiAqIEBwYXJhbSB7RGVwfSBkZXBcbiAqL1xuXG5wLmFkZERlcCA9IGZ1bmN0aW9uIChkZXApIHtcbiAgdmFyIGlkID0gZGVwLmlkXG4gIGlmICghdGhpcy5uZXdEZXBzW2lkXSkge1xuICAgIHRoaXMubmV3RGVwc1tpZF0gPSBkZXBcbiAgICBpZiAoIXRoaXMuZGVwc1tpZF0pIHtcbiAgICAgIHRoaXMuZGVwc1tpZF0gPSBkZXBcbiAgICAgIGRlcC5hZGRTdWIodGhpcylcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSB0aGUgZ2V0dGVyLCBhbmQgcmUtY29sbGVjdCBkZXBlbmRlbmNpZXMuXG4gKi9cblxucC5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuYmVmb3JlR2V0KClcbiAgdmFyIHZtID0gdGhpcy52bVxuICB2YXIgdmFsdWVcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IHRoaXMuZ2V0dGVyLmNhbGwodm0sIHZtKVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGNvbmZpZy53YXJuRXhwcmVzc2lvbkVycm9ycykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRXJyb3Igd2hlbiBldmFsdWF0aW5nIGV4cHJlc3Npb24gXCInICtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uICsgJ1wiOlxcbiAgICcgKyBlXG4gICAgICApXG4gICAgfVxuICB9XG4gIC8vIFwidG91Y2hcIiBldmVyeSBwcm9wZXJ0eSBzbyB0aGV5IGFyZSBhbGwgdHJhY2tlZCBhc1xuICAvLyBkZXBlbmRlbmNpZXMgZm9yIGRlZXAgd2F0Y2hpbmdcbiAgaWYgKHRoaXMuZGVlcCkge1xuICAgIHRyYXZlcnNlKHZhbHVlKVxuICB9XG4gIHZhbHVlID0gXy5hcHBseUZpbHRlcnModmFsdWUsIHRoaXMucmVhZEZpbHRlcnMsIHZtKVxuICB0aGlzLmFmdGVyR2V0KClcbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8qKlxuICogU2V0IHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIHdpdGggdGhlIHNldHRlci5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cblxucC5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHZtID0gdGhpcy52bVxuICB2YWx1ZSA9IF8uYXBwbHlGaWx0ZXJzKFxuICAgIHZhbHVlLCB0aGlzLndyaXRlRmlsdGVycywgdm0sIHRoaXMudmFsdWVcbiAgKVxuICB0cnkge1xuICAgIHRoaXMuc2V0dGVyLmNhbGwodm0sIHZtLCB2YWx1ZSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChjb25maWcud2FybkV4cHJlc3Npb25FcnJvcnMpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0Vycm9yIHdoZW4gZXZhbHVhdGluZyBzZXR0ZXIgXCInICtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uICsgJ1wiOlxcbiAgICcgKyBlXG4gICAgICApXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJlcGFyZSBmb3IgZGVwZW5kZW5jeSBjb2xsZWN0aW9uLlxuICovXG5cbnAuYmVmb3JlR2V0ID0gZnVuY3Rpb24gKCkge1xuICBPYnNlcnZlci50YXJnZXQgPSB0aGlzXG4gIHRoaXMubmV3RGVwcyA9IHt9XG59XG5cbi8qKlxuICogQ2xlYW4gdXAgZm9yIGRlcGVuZGVuY3kgY29sbGVjdGlvbi5cbiAqL1xuXG5wLmFmdGVyR2V0ID0gZnVuY3Rpb24gKCkge1xuICBPYnNlcnZlci50YXJnZXQgPSBudWxsXG4gIGZvciAodmFyIGlkIGluIHRoaXMuZGVwcykge1xuICAgIGlmICghdGhpcy5uZXdEZXBzW2lkXSkge1xuICAgICAgdGhpcy5kZXBzW2lkXS5yZW1vdmVTdWIodGhpcylcbiAgICB9XG4gIH1cbiAgdGhpcy5kZXBzID0gdGhpcy5uZXdEZXBzXG59XG5cbi8qKlxuICogU3Vic2NyaWJlciBpbnRlcmZhY2UuXG4gKiBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgZGVwZW5kZW5jeSBjaGFuZ2VzLlxuICovXG5cbnAudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIWNvbmZpZy5hc3luYyB8fCBjb25maWcuZGVidWcpIHtcbiAgICB0aGlzLnJ1bigpXG4gIH0gZWxzZSB7XG4gICAgYmF0Y2hlci5wdXNoKHRoaXMpXG4gIH1cbn1cblxuLyoqXG4gKiBCYXRjaGVyIGpvYiBpbnRlcmZhY2UuXG4gKiBXaWxsIGJlIGNhbGxlZCBieSB0aGUgYmF0Y2hlci5cbiAqL1xuXG5wLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoKVxuICAgIGlmIChcbiAgICAgIHZhbHVlICE9PSB0aGlzLnZhbHVlIHx8XG4gICAgICBBcnJheS5pc0FycmF5KHZhbHVlKSB8fFxuICAgICAgdGhpcy5kZWVwXG4gICAgKSB7XG4gICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgICAgIHZhciBjYnMgPSB0aGlzLmNic1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNic1tpXSh2YWx1ZSwgb2xkVmFsdWUpXG4gICAgICAgIC8vIGlmIGEgY2FsbGJhY2sgYWxzbyByZW1vdmVkIG90aGVyIGNhbGxiYWNrcyxcbiAgICAgICAgLy8gd2UgbmVlZCB0byBhZGp1c3QgdGhlIGxvb3AgYWNjb3JkaW5nbHkuXG4gICAgICAgIHZhciByZW1vdmVkID0gbCAtIGNicy5sZW5ndGhcbiAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICBpIC09IHJlbW92ZWRcbiAgICAgICAgICBsIC09IHJlbW92ZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxucC5hZGRDYiA9IGZ1bmN0aW9uIChjYikge1xuICB0aGlzLmNicy5wdXNoKGNiKVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxucC5yZW1vdmVDYiA9IGZ1bmN0aW9uIChjYikge1xuICB2YXIgY2JzID0gdGhpcy5jYnNcbiAgaWYgKGNicy5sZW5ndGggPiAxKSB7XG4gICAgdmFyIGkgPSBjYnMuaW5kZXhPZihjYilcbiAgICBpZiAoaSA+IC0xKSB7XG4gICAgICBjYnMuc3BsaWNlKGksIDEpXG4gICAgfVxuICB9IGVsc2UgaWYgKGNiID09PSBjYnNbMF0pIHtcbiAgICB0aGlzLnRlYXJkb3duKClcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBzZWxmIGZyb20gYWxsIGRlcGVuZGVuY2llcycgc3ViY3JpYmVyIGxpc3QuXG4gKi9cblxucC50ZWFyZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgLy8gcmVtb3ZlIHNlbGYgZnJvbSB2bSdzIHdhdGNoZXIgbGlzdFxuICAgIC8vIHdlIGNhbiBza2lwIHRoaXMgaWYgdGhlIHZtIGlmIGJlaW5nIGRlc3Ryb3llZFxuICAgIC8vIHdoaWNoIGNhbiBpbXByb3ZlIHRlYXJkb3duIHBlcmZvcm1hbmNlLlxuICAgIGlmICghdGhpcy52bS5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgICAgdmFyIGxpc3QgPSB0aGlzLnZtLl93YXRjaGVyTGlzdFxuICAgICAgbGlzdC5zcGxpY2UobGlzdC5pbmRleE9mKHRoaXMpKVxuICAgIH1cbiAgICBmb3IgKHZhciBpZCBpbiB0aGlzLmRlcHMpIHtcbiAgICAgIHRoaXMuZGVwc1tpZF0ucmVtb3ZlU3ViKHRoaXMpXG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnZtID0gdGhpcy5jYnMgPSB0aGlzLnZhbHVlID0gbnVsbFxuICB9XG59XG5cblxuLyoqXG4gKiBSZWNydXNpdmVseSB0cmF2ZXJzZSBhbiBvYmplY3QgdG8gZXZva2UgYWxsIGNvbnZlcnRlZFxuICogZ2V0dGVycywgc28gdGhhdCBldmVyeSBuZXN0ZWQgcHJvcGVydHkgaW5zaWRlIHRoZSBvYmplY3RcbiAqIGlzIGNvbGxlY3RlZCBhcyBhIFwiZGVlcFwiIGRlcGVuZGVuY3kuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cbmZ1bmN0aW9uIHRyYXZlcnNlIChvYmopIHtcbiAgdmFyIGtleSwgdmFsLCBpXG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIHZhbCA9IG9ialtrZXldXG4gICAgaWYgKF8uaXNBcnJheSh2YWwpKSB7XG4gICAgICBpID0gdmFsLmxlbmd0aFxuICAgICAgd2hpbGUgKGktLSkgdHJhdmVyc2UodmFsW2ldKVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdCh2YWwpKSB7XG4gICAgICB0cmF2ZXJzZSh2YWwpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2F0Y2hlciIsIm1vZHVsZS5leHBvcnRzID0gJzx0ZW1wbGF0ZSB2LWlmPVwibW9kZWxcIj5cXG5cdDxhIGhyZWY9XCIjL3t7IG1vZGVsLnByb3BlcnR5IH19L25ld1wiIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzIHB1bGwtcmlnaHRcIj5BZGQgbmV3IHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIH19PC9hPlxcblx0PHRhYmxlIGNsYXNzPVwidGFibGUgdGFibGUtaG92ZXJcIj5cXG5cdFx0PHRoZWFkPlxcblx0XHRcdDx0cj5cXG5cdFx0XHRcdDx0aCB2LXJlcGVhdD1cIm1vZGVsLmZpZWxkc1wiPnt7IGxhYmVsIH19PC90aD5cXG5cdFx0XHRcdDx0aCBjb2xzcGFuPVwiMlwiPjwvdGg+XFxuXHRcdFx0PC90cj5cXG5cdFx0PC90aGVhZD5cXG5cdFx0PHRib2R5IHYtaWY9XCJlbnRyaWVzXCI+XFxuXHRcdFx0PHRyIHYtcmVwZWF0PVwiZW50cnkgOiBlbnRyaWVzXCIgdi1vbj1cImNsaWNrOiBlZGl0KCRldmVudCwgJGtleSlcIiBkYXRhLWlkPVwie3sgJGtleSB9fVwiIGNsYXNzPVwiY2xpY2thYmxlXCI+XFxuXHRcdFx0XHQ8dGQgdi1yZXBlYXQ9XCJtb2RlbC5maWVsZHNcIj57eyBlbnRyeVtwcm9wZXJ0eV0gfX08L3RkPlxcblx0XHRcdFx0PHRkPjwvdGQ+XFxuXHRcdFx0XHQ8dGQ+PC90ZD5cXG5cdFx0XHQ8L3RyPlxcblx0XHQ8L3Rib2R5Plxcblx0XHQ8dGJvZHkgdi1pZj1cIiFlbnRyaWVzXCI+XFxuXHRcdFx0PHRyPlxcblx0XHRcdFx0PHRkIGNvbHNwYW49XCJ7eyBtb2RlbC5maWVsZHMubGVuZ3RoICsgMiB9fVwiPlxcblx0XHRcdFx0XHQ8ZW0gY2xhc3M9XCJ0ZXh0LW11dGVkXCI+TG9hZGluZyB7eyBtb2RlbC5sYWJlbCB8IGxvd2VyY2FzZSB8IHBsdXJhbCB9fSZoZWxsaXA7PC9lbT5cXG5cdFx0XHRcdDwvdGQ+XFxuXHRcdFx0PC90cj5cXG5cdFx0PC90Ym9keT5cXG5cdDwvdGFibGU+XFxuPC90ZW1wbGF0ZT5cXG4nOyIsInZhciBGaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJylcblxudmFyIGRhdGFSZWYgPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vZW50cmllcy5maXJlYmFzZUlPLmNvbS9kYXRhLycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbmhlcml0OiB0cnVlLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi9lbnRyaWVzLmh0bWwnKSxcblx0bWV0aG9kczoge1xuXHRcdGFjdGl2YXRlTW9kZWw6IGZ1bmN0aW9uIChtb2RlbCkge1xuXHRcdFx0dGhpcy5lbnRyaWVzID0gbnVsbFxuXHRcdFx0ZGF0YVJlZi5jaGlsZChtb2RlbCkub25jZSgndmFsdWUnLCBmdW5jdGlvbiAoc25hcHNob3QpIHtcblx0XHRcdFx0dGhpcy5lbnRyaWVzID0gc25hcHNob3QudmFsKClcblx0XHRcdH0uYmluZCh0aGlzKSlcblx0XHR9LFxuXHRcdGVkaXQ6IGZ1bmN0aW9uIChldmVudCwgaWQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdGlmIChpZCkge1xuXHRcdFx0XHRsb2NhdGlvbi5hc3NpZ24oJyMvJyArIHRoaXMuYWN0aXZlTW9kZWwgKyAnLycgKyBpZClcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGRhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZW50cmllczogbnVsbFxuXHRcdH1cblx0fSxcblx0Y3JlYXRlZDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLmFjdGl2ZU1vZGVsKSB7XG5cdFx0XHR0aGlzLmFjdGl2YXRlTW9kZWwodGhpcy5hY3RpdmVNb2RlbClcblx0XHR9XG5cdH0sXG5cdHdhdGNoOiB7XG5cdFx0YWN0aXZlTW9kZWw6IGZ1bmN0aW9uIChtb2RlbCkge1xuXHRcdFx0dGhpcy5hY3RpdmF0ZU1vZGVsKG1vZGVsKVxuXHRcdH1cblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGZvcm0gdi1pZj1cImlzUmVhZHlcIiB2LW9uPVwic3VibWl0OiBzYXZlKCRldmVudClcIiBjbGFzcz1cImZvcm0taG9yaXpvbnRhbFwiPlxcblx0PGZpZWxkc2V0Plxcblx0XHQ8bGVnZW5kIHYtaWY9XCJpc05ld1wiPlxcblx0XHRcdE5ldyB7eyBtb2RlbC5sYWJlbCB8IGxvd2VyY2FzZSB9fVxcblx0XHQ8L2xlZ2VuZD5cXG5cdFx0PGxlZ2VuZCB2LWlmPVwiIWlzTmV3XCI+XFxuXHRcdFx0RWRpdCB7eyBtb2RlbC5sYWJlbCB8IGxvd2VyY2FzZSB9fVxcblx0XHRcdDxzbWFsbCBjbGFzcz1cInRleHQtbXV0ZWQgcHVsbC1yaWdodFwiPnt7IGFjdGl2ZUVudHJ5IH19PC9zbWFsbD5cXG5cdFx0PC9sZWdlbmQ+XFxuXFxuXHRcdDxkaXYgdi1yZXBlYXQ9XCJtb2RlbC5maWVsZHNcIiB2LWNvbXBvbmVudD1cInt7IGNvbXBvbmVudEZvcih0eXBlKSB9fVwiPjwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcblx0XHRcdDxkaXYgY2xhc3M9XCJjb2wtc20tb2Zmc2V0LTIgY29sLXNtLTJcIj5cXG5cdFx0XHRcdDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3MgYnRuLWxnXCIgdHlwZT1cInN1Ym1pdFwiPlNhdmU8L2J1dHRvbj5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2ZpZWxkc2V0PlxcbjwvZm9ybT5cXG48ZW0gdi1pZj1cIiFpc1JlYWR5XCIgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+TG9hZGluZyB7eyBtb2RlbC5sYWJlbCB8IGxvd2VyY2FzZSB9fSZoZWxsaXA7PC9lbT5cXG4nOyIsInZhciBGaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJylcblxudmFyIGRhdGFSZWYgPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vZW50cmllcy5maXJlYmFzZUlPLmNvbS9kYXRhLycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbmhlcml0OiB0cnVlLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi9lbnRyeS5odG1sJyksXG5cdGNvbXBvbmVudHM6IHtcblx0XHR0ZXh0RmllbGQ6IHJlcXVpcmUoJy4uL2ZpZWxkcy90ZXh0JyksXG5cdFx0bWFya2Rvd25GaWVsZDogcmVxdWlyZSgnLi4vZmllbGRzL21hcmtkb3duJylcblx0fSxcblx0bWV0aG9kczoge1xuXHRcdGNvbXBvbmVudEZvcjogZnVuY3Rpb24gKHR5cGUpIHtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICdtYXJrZG93bic6XG5cdFx0XHRcdFx0cmV0dXJuICdtYXJrZG93bkZpZWxkJ1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHJldHVybiAndGV4dEZpZWxkJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bG9hZEVudHJ5OiBmdW5jdGlvbiAoaWQpIHtcblx0XHRcdHRoaXMuZW50cnkgPSBudWxsXG5cdFx0XHRpZiAoaWQgPT09ICduZXcnKSByZXR1cm5cblxuXHRcdFx0ZGF0YVJlZi5jaGlsZCh0aGlzLmFjdGl2ZU1vZGVsKS5jaGlsZChpZCkub25jZSgndmFsdWUnLCBmdW5jdGlvbiAoc25hcHNob3QpIHtcblx0XHRcdFx0dGhpcy5lbnRyeSA9IHNuYXBzaG90LnZhbCgpXG5cdFx0XHR9LmJpbmQodGhpcykpXG5cdFx0fVxuXHR9LFxuXHRkYXRhOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGVudHJ5OiBudWxsXG5cdFx0fVxuXHR9LFxuXHRjb21wdXRlZDoge1xuXHRcdGlzTmV3OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hY3RpdmVFbnRyeSA9PT0gJ25ldydcblx0XHR9LFxuXHRcdGlzUmVhZHk6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLmVudHJ5IHx8IHRoaXMuaXNOZXdcblx0XHR9XG5cdH0sXG5cdGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5hY3RpdmVFbnRyeSkge1xuXHRcdFx0dGhpcy5sb2FkRW50cnkodGhpcy5hY3RpdmVFbnRyeSlcblx0XHR9XG5cdH0sXG5cdHdhdGNoOiB7XG5cdFx0YWN0aXZlRW50cnk6IGZ1bmN0aW9uIChpZCkge1xuXHRcdFx0dGhpcy5sb2FkRW50cnkoaWQpXG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5oZXJpdDogdHJ1ZSxcblx0cmVwbGFjZTogdHJ1ZSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vbWFya2Rvd24uaHRtbCcpLFxuXHRjb21wdXRlZDoge1xuXHRcdC8vIFRPRE86IHNldHRlclxuXHRcdHZhbHVlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbnRyeVxuXHRcdFx0XHQ/IHRoaXMuZW50cnlbdGhpcy5wcm9wZXJ0eV1cblx0XHRcdFx0OiBudWxsXG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcblx0PGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBjb2wtc20tMlwiPnt7IGxhYmVsIH19PC9sYWJlbD5cXG5cdDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPlxcblx0XHQ8dGV4dGFyZWEgcm93cz1cIjEyXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB2LW1vZGVsPVwidmFsdWVcIiB2LWF0dHI9XCJyZXF1aXJlZDogcmVxdWlyZWRcIj48L3RleHRhcmVhPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5oZXJpdDogdHJ1ZSxcblx0cmVwbGFjZTogdHJ1ZSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdGV4dC5odG1sJyksXG5cdGNvbXB1dGVkOiB7XG5cdFx0Ly8gVE9ETzogc2V0dGVyXG5cdFx0dmFsdWU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLmVudHJ5XG5cdFx0XHRcdD8gdGhpcy5lbnRyeVt0aGlzLnByb3BlcnR5XVxuXHRcdFx0XHQ6IG51bGxcblx0XHR9XG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XFxuXHQ8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGNvbC1zbS0yXCI+e3sgbGFiZWwgfX08L2xhYmVsPlxcblx0PGRpdiBjbGFzcz1cImNvbC1zbS02XCI+XFxuXHRcdDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHYtbW9kZWw9XCJ2YWx1ZVwiIHYtYXR0cj1cInR5cGU6IHR5cGUsIHJlcXVpcmVkOiByZXF1aXJlZFwiPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5oZXJpdDogdHJ1ZSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vbmF2Lmh0bWwnKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cXG5cdDxhIHYtcmVwZWF0PVwibW9kZWxzXCIgaHJlZj1cIiMve3sgcHJvcGVydHkgfX1cIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSB7eyBhY3RpdmVNb2RlbCA9PT0gcHJvcGVydHkgPyBcXCdhY3RpdmVcXCcgOiBcXCdcXCcgfX1cIj57eyBsYWJlbCB8IHBsdXJhbCB9fTwvYT5cXG48L2Rpdj5cXG4nOyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cXG5cdDxkaXYgY2xhc3M9XCJyb3dcIj5cXG5cdFx0PGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cIkZpbmQgY29udGVudCZoZWxsaXA7XCI+XFxuXHRcdFx0PGhyPlxcblx0XHRcdDxkaXYgdi1jb21wb25lbnQ9XCJuYXZcIj48L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJjb2wtc20tMTBcIj5cXG5cdFx0XHQ8ZGl2IHYtY29tcG9uZW50PVwie3sgdmlldyB9fVwiPjwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwidmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpXG52YXIgZGlyZWN0b3IgPSByZXF1aXJlKCdkaXJlY3RvcicpXG52YXIgcGx1cmFsaXplID0gcmVxdWlyZSgncGx1cmFsaXplJylcblxudmFyIGFwcCA9IG5ldyBWdWUoe1xuXHRlbDogZG9jdW1lbnQuYm9keSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vY29udGFpbmVyLmh0bWwnKSxcblx0Y29tcG9uZW50czoge1xuXHRcdG5hdjogcmVxdWlyZSgnLi9jb21wb25lbnRzL25hdicpLFxuXHRcdGVudHJpZXM6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9lbnRyaWVzJyksXG5cdFx0ZW50cnk6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9lbnRyeScpXG5cdH0sXG5cdGZpbHRlcnM6IHtcblx0XHRwbHVyYWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHBsdXJhbGl6ZSh2YWx1ZSlcblx0XHR9XG5cdH0sXG5cdGRhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbW9kZWxzID0gcmVxdWlyZSgnLi9tb2RlbHMnKVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHZpZXc6IG51bGwsXG5cdFx0XHRtb2RlbHM6IG1vZGVscyxcblx0XHRcdGFjdGl2ZU1vZGVsOiBudWxsLFxuXHRcdFx0bW9kZWw6IG51bGwsXG5cdFx0XHRhY3RpdmVFbnRyeTogbnVsbCxcblx0XHRcdGVudHJ5OiBudWxsXG5cdFx0fVxuXHR9XG59KVxuXG5cbnZhciByb3V0ZXIgPSBuZXcgZGlyZWN0b3IuUm91dGVyKClcblxucm91dGVyLm9uKCcvJywgZnVuY3Rpb24gKCkge1xuXHRsb2NhdGlvbi5yZXBsYWNlKCcjLycgKyBhcHAubW9kZWxzWzBdLnByb3BlcnR5KVxufSlcblxucm91dGVyLm9uKCcvOnR5cGUnLCBmdW5jdGlvbiAodHlwZSkge1xuXHRhcHAudmlldyA9ICdlbnRyaWVzJ1xuXHRhcHAuYWN0aXZlTW9kZWwgPSBudWxsXG5cdGFwcC5tb2RlbCA9IG51bGxcblxuXHRhcHAubW9kZWxzLmZvckVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XG5cdFx0aWYgKHR5cGUgPT09IG1vZGVsLnByb3BlcnR5KSB7XG5cdFx0XHRhcHAuYWN0aXZlTW9kZWwgPSB0eXBlXG5cdFx0XHRhcHAubW9kZWwgPSBtb2RlbFxuXHRcdH1cblx0fSlcbn0pXG5cbnJvdXRlci5vbignLzp0eXBlLzppZCcsIGZ1bmN0aW9uICh0eXBlLCBpZCkge1xuXHRhcHAudmlldyA9ICdlbnRyeSdcblx0YXBwLmFjdGl2ZU1vZGVsID0gbnVsbFxuXHRhcHAubW9kZWwgPSBudWxsXG5cdGFwcC5hY3RpdmVFbnRyeSA9IGlkXG5cblx0YXBwLm1vZGVscy5mb3JFYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuXHRcdGlmICh0eXBlID09PSBtb2RlbC5wcm9wZXJ0eSkge1xuXHRcdFx0YXBwLmFjdGl2ZU1vZGVsID0gdHlwZVxuXHRcdFx0YXBwLm1vZGVsID0gbW9kZWxcblx0XHR9XG5cdH0pXG59KVxuXG5yb3V0ZXIuY29uZmlndXJlKHtcblx0bm90Zm91bmQ6IGZ1bmN0aW9uICgpIHtcblx0XHRjb25zb2xlLmxvZygnTm8gcm91dGUgZm91bmQgZm9yIHBhdGg6JywgdGhpcy5wYXRoKVxuXHR9XG59KVxuXG5yb3V0ZXIuaW5pdCgnLycpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0bGFiZWw6ICdBdXRob3InLFxuXHRwcm9wZXJ0eTogJ2F1dGhvcnMnLFxuXHR0eXBlOiAnY29sbGVjdGlvbicsXG5cdGZpZWxkczogW1xuXHRcdHtcblx0XHRcdGxhYmVsOiAnTmFtZScsXG5cdFx0XHRwcm9wZXJ0eTogJ25hbWUnLFxuXHRcdFx0dHlwZTogJ3RleHQnLFxuXHRcdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRsaXN0ZWQ6IHRydWVcblx0XHR9LFxuXHRcdHtcblx0XHRcdGxhYmVsOiAnVHdpdHRlcicsXG5cdFx0XHRwcm9wZXJ0eTogJ3R3aXR0ZXInLFxuXHRcdFx0dHlwZTogJ3RleHQnLFxuXHRcdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRsaXN0ZWQ6IHRydWVcblx0XHR9XG5cdF1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gW1xuXHRyZXF1aXJlKCcuL3Bvc3QnKSxcblx0cmVxdWlyZSgnLi9hdXRob3InKVxuXVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGxhYmVsOiAnQmxvZyBwb3N0Jyxcblx0cHJvcGVydHk6ICdwb3N0cycsXG5cdHR5cGU6ICdjb2xsZWN0aW9uJyxcblx0ZmllbGRzOiBbXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdUaXRsZScsXG5cdFx0XHRwcm9wZXJ0eTogJ3RpdGxlJyxcblx0XHRcdHR5cGU6ICd0ZXh0Jyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlLFxuXHRcdFx0bGlzdGVkOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ1N1bW1hcnknLFxuXHRcdFx0cHJvcGVydHk6ICdzdW1tYXJ5Jyxcblx0XHRcdHR5cGU6ICd0ZXh0Jyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlLFxuXHRcdFx0bGlzdGVkOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ1Bvc3QgYm9keScsXG5cdFx0XHRwcm9wZXJ0eTogJ2JvZHknLFxuXHRcdFx0dHlwZTogJ21hcmtkb3duJyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0fVxuXHRdXG59XG4iXX0=
