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
module.exports = '<template v-if="model">\n	<a href="#/{{ model.property }}/new" class="btn btn-success pull-right">Add new {{ model.label | lowercase }}</a>\n	<table class="table table-hover">\n		<thead>\n			<tr>\n				<th v-repeat="fields">{{ label }}</th>\n			</tr>\n		</thead>\n		<tbody v-if="entries">\n			<tr v-repeat="entry : entries" v-on="click: edit($event, $key)" data-id="{{ $key }}" class="clickable">\n				<td v-repeat="fields">{{ entry[property] }}</td>\n			</tr>\n		</tbody>\n		<tbody v-if="!entries">\n			<tr>\n				<td colspan="{{ model.fields.length }}">\n					<em class="text-muted">Loading {{ model.label | lowercase | plural }}&hellip;</em>\n				</td>\n			</tr>\n		</tbody>\n	</table>\n</template>\n';
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
	computed: {
		fields: function () {
			return this.model.fields.filter(function (filter) {
				return filter.listed
			})
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
module.exports = '<template v-if="isReady">\n	<form v-on="submit: save($event)" class="form-horizontal">\n		<fieldset>\n			<legend v-if="isNew">\n				New {{ model.label | lowercase }}\n			</legend>\n			<legend v-if="!isNew">\n				Edit {{ model.label | lowercase }}\n				<small class="text-muted pull-right">{{ activeEntry }}</small>\n			</legend>\n\n			<div v-repeat="model.fields" v-component="{{ componentFor(type) }}"></div>\n			<div class="form-group">\n				<div class="col-sm-offset-2 col-sm-2">\n					<button class="btn btn-success btn-lg" type="submit">Save</button>\n				</div>\n			</div>\n		</fieldset>\n	</form>\n	<p class="text-right" v-if="!isNew">\n		<button v-on="click: remove($event)" type="button" class="btn btn-link">\n			Delete this {{ model.label | lowercase }}?\n		</button>\n	</p>\n</template>\n\n<em v-if="!isReady" class="text-muted">Loading {{ model.label | lowercase }}&hellip;</em>\n';
},{}],69:[function(require,module,exports){
var Firebase = require('firebase')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

function isEmpty (o) {
	for (var p in o) {
		if (o.hasOwnProperty(p)) {
			return false
		}
	}
	return true
}

module.exports = {
	inherit: true,
	template: require('./entry.html'),
	components: {
		textField: require('../fields/text'),
		markdownField: require('../fields/markdown'),
		entryField: require('../fields/entry')
	},
	methods: {
		componentFor: function (type) {
			switch (type) {
				case 'text':
					return 'textField'
				case 'markdown':
					return 'markdownField'
				case 'entry':
					return 'entryField'
				default:
					return 'textField'
			}
		},
		loadEntry: function (id) {
			this.entry = {}
			if (id === 'new') return

			dataRef.child(this.activeModel).child(id).once('value', function (snapshot) {
				this.entry = snapshot.val()
			}.bind(this))
		},
		save: function (event) {
			event.preventDefault()

			var done = (function (err) {
				if (err) {
					console.error('Could not save:', err)
				}
				else {
					location.assign('#/' + this.activeModel)
				}
			}).bind(this)

			var ref = dataRef.child(this.activeModel)
			if (this.isNew) {
				ref.push(this.entry, done)
			}
			else {
				ref.child(this.activeEntry).update(this.entry, done)
			}
		},
		remove: function (event) {
			event.preventDefault()

			// TODO: add undo
			if (!window.confirm('This cannot be undone. Continue?')) {
				return
			}

			dataRef.child(this.activeModel).child(this.activeEntry).remove(function (err) {
				if (err) {
					console.error('Could not remove:', err)
				}
				else {
					location.assign('#/' + this.activeModel)
				}
			}.bind(this))
		}
	},
	data: function () {
		return {
			entry: {}
		}
	},
	computed: {
		isNew: function () {
			return this.activeEntry === 'new'
		},
		isReady: function () {
			return !isEmpty(this.entry) || this.isNew
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

},{"../fields/entry":71,"../fields/markdown":72,"../fields/text":74,"./entry.html":68,"firebase":2}],70:[function(require,module,exports){
module.exports = '<div class="form-group">\n	<label class="control-label col-sm-2">{{ label }}</label>\n	<div class="col-sm-6">\n		<select class="form-control" v-if="isReady" v-model="value" options="options" v-attr="required: required"></select>\n	</div>\n</div>\n';
},{}],71:[function(require,module,exports){
var Firebase = require('firebase')

var models = require('../../../models')
var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	inherit: true,
	replace: true,
	template: require('./entry.html'),
	data: function () {
		return {
			options: null
		}
	},
	computed: {
		value: {
			get: function () {
				if (this.entry) {
					return this.entry[this.property]
				}
			},
			set: function (value) {
				if (this.entry) {
					this.entry[this.property] = value
				}
			}
		},
		isReady: function () {
			return (this.options != null)
		}
	},
	created: function () {
		var model = models[this.model]
		dataRef.child(model.property).once('value', function (snapshot) {
			// TODO: figure out better "unselected" option
			//       ideally allow the disabled attribute in here
			var options = [{ text: '', value: null }]
			snapshot.forEach(function (child) {
				options.push({
					value: child.ref().toString(),
					// TODO: make this property configurable
					text: child.val().name
				})
			})
			this.options = options
		}.bind(this))
	}
}

},{"../../../models":81,"./entry.html":70,"firebase":2}],72:[function(require,module,exports){
module.exports = {
	inherit: true,
	replace: true,
	template: require('./markdown.html'),
	computed: {
		value: {
			get: function () {
				if (this.entry) {
					return this.entry[this.property]
				}
			},
			set: function (value) {
				if (this.entry) {
					this.entry[this.property] = value
				}
			}
		}
	}
}

},{"./markdown.html":73}],73:[function(require,module,exports){
module.exports = '<div class="form-group">\n	<label class="control-label col-sm-2">{{ label }}</label>\n	<div class="col-sm-6">\n		<textarea rows="12" class="form-control" v-model="value" v-attr="required: required"></textarea>\n	</div>\n</div>\n';
},{}],74:[function(require,module,exports){
module.exports = {
	inherit: true,
	replace: true,
	template: require('./text.html'),
	computed: {
		value: {
			get: function () {
				if (this.entry) {
					return this.entry[this.property]
				}
			},
			set: function (value) {
				if (this.entry) {
					this.entry[this.property] = value
				}
			}
		}
	}
}

},{"./text.html":75}],75:[function(require,module,exports){
module.exports = '<div class="form-group">\n	<label class="control-label col-sm-2">{{ label }}</label>\n	<div class="col-sm-6">\n		<input class="form-control" v-model="value" v-attr="type: type, required: required">\n	</div>\n</div>\n';
},{}],76:[function(require,module,exports){
module.exports = {
	inherit: true,
	template: require('./nav.html')
}

},{"./nav.html":77}],77:[function(require,module,exports){
module.exports = '<div class="list-group">\n	<a v-repeat="models" href="#/{{ property }}" class="list-group-item {{ activeModel === property ? \'active\' : \'\' }}">{{ label | plural }}</a>\n</div>\n';
},{}],78:[function(require,module,exports){
module.exports = '<div class="container">\n	<div class="row">\n		<div class="col-sm-2">\n			<input type="text" class="form-control" placeholder="Find content&hellip;">\n			<hr>\n			<div v-component="nav"></div>\n		</div>\n		<div class="col-sm-10">\n			<div v-component="{{ view }}"></div>\n		</div>\n	</div>\n</div>\n';
},{}],79:[function(require,module,exports){
var Vue = require('vue')
var director = require('director')
var pluralize = require('pluralize')

var models = require('./models')


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
	app.model = models[type]
	app.activeModel = app.model ? type : null
})

router.on('/:type/:id', function (type, id) {
	app.view = 'entry'
	app.model = models[type]
	app.activeModel = app.model ? type : null
	app.activeEntry = id
})

router.configure({
	notfound: function () {
		console.log('No route found for path:', this.path)
	}
})

router.init('/')

},{"./components/entries":67,"./components/entry":69,"./components/nav":76,"./container.html":78,"./models":81,"director":1,"pluralize":3,"vue":64}],80:[function(require,module,exports){
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

},{}],81:[function(require,module,exports){
module.exports = {
	posts: require('./post'),
	authors: require('./author')
}

},{"./author":80,"./post":82}],82:[function(require,module,exports){
module.exports = {
	label: 'Blog post',
	property: 'posts',
	type: 'collection',
	fields: [
		{
			label: 'Author',
			property: 'author',
			type: 'entry',
			model: 'authors',
			required: true
		},
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

},{}]},{},[79])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGlyZWN0b3IvYnVpbGQvZGlyZWN0b3IuanMiLCJub2RlX21vZHVsZXMvZmlyZWJhc2UvbGliL2ZpcmViYXNlLXdlYi5qcyIsIm5vZGVfbW9kdWxlcy9wbHVyYWxpemUvcGx1cmFsaXplLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2NoaWxkLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2RhdGEuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvZG9tLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2FwaS9nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvbGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmF0Y2hlci5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NhY2hlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY29tcGlsZXIvY29tcGlsZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NvbXBpbGVyL3RyYW5zY2x1ZGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9jb25maWcuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2F0dHIuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2NsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9jbG9hay5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9lbC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9odG1sLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9pZi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL2NoZWNrYm94LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9kZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvbW9kZWwvcmFkaW8uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL3NlbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvb24uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3BhcnRpYWwuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3JlZi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9zaG93LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9zdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvdGV4dC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvdHJhbnNpdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvd2l0aC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2ZpbHRlcnMvYXJyYXktZmlsdGVycy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2ZpbHRlcnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9jb21waWxlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2UvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2UvaW5pdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2luc3RhbmNlL3Njb3BlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvb2JzZXJ2ZXIvYXJyYXkuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9vYnNlcnZlci9kZXAuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9vYnNlcnZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyL29iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvZGlyZWN0aXZlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy9leHByZXNzaW9uLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy9wYXRoLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvcGFyc2Vycy90ZW1wbGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvdGV4dC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3RyYW5zaXRpb24vY3NzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdHJhbnNpdGlvbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3RyYW5zaXRpb24vanMuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2RlYnVnLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9kb20uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2Vudi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvZmlsdGVyLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvbGFuZy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvbWVyZ2Utb3B0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdnVlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvd2F0Y2hlci5qcyIsInNyYy9jb21wb25lbnRzL2VudHJpZXMvZW50cmllcy5odG1sIiwic3JjL2NvbXBvbmVudHMvZW50cmllcy9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2VudHJ5L2VudHJ5Lmh0bWwiLCJzcmMvY29tcG9uZW50cy9lbnRyeS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy9lbnRyeS9lbnRyeS5odG1sIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL2VudHJ5L2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL21hcmtkb3duL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL21hcmtkb3duL21hcmtkb3duLmh0bWwiLCJzcmMvY29tcG9uZW50cy9maWVsZHMvdGV4dC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy90ZXh0L3RleHQuaHRtbCIsInNyYy9jb21wb25lbnRzL25hdi9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL25hdi9uYXYuaHRtbCIsInNyYy9jb250YWluZXIuaHRtbCIsInNyYy9pbmRleC5qcyIsInNyYy9tb2RlbHMvYXV0aG9yLmpzIiwic3JjL21vZGVscy9pbmRleC5qcyIsInNyYy9tb2RlbHMvcG9zdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcHRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNWpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cbi8vXG4vLyBHZW5lcmF0ZWQgb24gVHVlIERlYyAxNiAyMDE0IDEyOjEzOjQ3IEdNVCswMTAwIChDRVQpIGJ5IENoYXJsaWUgUm9iYmlucywgUGFvbG8gRnJhZ29tZW5pICYgdGhlIENvbnRyaWJ1dG9ycyAoVXNpbmcgQ29kZXN1cmdlb24pLlxuLy8gVmVyc2lvbiAxLjIuNlxuLy9cblxuKGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cbi8qXG4gKiBicm93c2VyLmpzOiBCcm93c2VyIHNwZWNpZmljIGZ1bmN0aW9uYWxpdHkgZm9yIGRpcmVjdG9yLlxuICpcbiAqIChDKSAyMDExLCBDaGFybGllIFJvYmJpbnMsIFBhb2xvIEZyYWdvbWVuaSwgJiB0aGUgQ29udHJpYnV0b3JzLlxuICogTUlUIExJQ0VOU0VcbiAqXG4gKi9cblxudmFyIGRsb2MgPSBkb2N1bWVudC5sb2NhdGlvbjtcblxuZnVuY3Rpb24gZGxvY0hhc2hFbXB0eSgpIHtcbiAgLy8gTm9uLUlFIGJyb3dzZXJzIHJldHVybiAnJyB3aGVuIHRoZSBhZGRyZXNzIGJhciBzaG93cyAnIyc7IERpcmVjdG9yJ3MgbG9naWNcbiAgLy8gYXNzdW1lcyBib3RoIG1lYW4gZW1wdHkuXG4gIHJldHVybiBkbG9jLmhhc2ggPT09ICcnIHx8IGRsb2MuaGFzaCA9PT0gJyMnO1xufVxuXG52YXIgbGlzdGVuZXIgPSB7XG4gIG1vZGU6ICdtb2Rlcm4nLFxuICBoYXNoOiBkbG9jLmhhc2gsXG4gIGhpc3Rvcnk6IGZhbHNlLFxuXG4gIGNoZWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGggPSBkbG9jLmhhc2g7XG4gICAgaWYgKGggIT0gdGhpcy5oYXNoKSB7XG4gICAgICB0aGlzLmhhc2ggPSBoO1xuICAgICAgdGhpcy5vbkhhc2hDaGFuZ2VkKCk7XG4gICAgfVxuICB9LFxuXG4gIGZpcmU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnbW9kZXJuJykge1xuICAgICAgdGhpcy5oaXN0b3J5ID09PSB0cnVlID8gd2luZG93Lm9ucG9wc3RhdGUoKSA6IHdpbmRvdy5vbmhhc2hjaGFuZ2UoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLm9uSGFzaENoYW5nZWQoKTtcbiAgICB9XG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gKGZuLCBoaXN0b3J5KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuaGlzdG9yeSA9IGhpc3Rvcnk7XG5cbiAgICBpZiAoIVJvdXRlci5saXN0ZW5lcnMpIHtcbiAgICAgIFJvdXRlci5saXN0ZW5lcnMgPSBbXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbmNoYW5nZShvbkNoYW5nZUV2ZW50KSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IFJvdXRlci5saXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIFJvdXRlci5saXN0ZW5lcnNbaV0ob25DaGFuZ2VFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9ub3RlIElFOCBpcyBiZWluZyBjb3VudGVkIGFzICdtb2Rlcm4nIGJlY2F1c2UgaXQgaGFzIHRoZSBoYXNoY2hhbmdlIGV2ZW50XG4gICAgaWYgKCdvbmhhc2hjaGFuZ2UnIGluIHdpbmRvdyAmJiAoZG9jdW1lbnQuZG9jdW1lbnRNb2RlID09PSB1bmRlZmluZWRcbiAgICAgIHx8IGRvY3VtZW50LmRvY3VtZW50TW9kZSA+IDcpKSB7XG4gICAgICAvLyBBdCBsZWFzdCBmb3Igbm93IEhUTUw1IGhpc3RvcnkgaXMgYXZhaWxhYmxlIGZvciAnbW9kZXJuJyBicm93c2VycyBvbmx5XG4gICAgICBpZiAodGhpcy5oaXN0b3J5ID09PSB0cnVlKSB7XG4gICAgICAgIC8vIFRoZXJlIGlzIGFuIG9sZCBidWcgaW4gQ2hyb21lIHRoYXQgY2F1c2VzIG9ucG9wc3RhdGUgdG8gZmlyZSBldmVuXG4gICAgICAgIC8vIHVwb24gaW5pdGlhbCBwYWdlIGxvYWQuIFNpbmNlIHRoZSBoYW5kbGVyIGlzIHJ1biBtYW51YWxseSBpbiBpbml0KCksXG4gICAgICAgIC8vIHRoaXMgd291bGQgY2F1c2UgQ2hyb21lIHRvIHJ1biBpdCB0d2lzZS4gQ3VycmVudGx5IHRoZSBvbmx5XG4gICAgICAgIC8vIHdvcmthcm91bmQgc2VlbXMgdG8gYmUgdG8gc2V0IHRoZSBoYW5kbGVyIGFmdGVyIHRoZSBpbml0aWFsIHBhZ2UgbG9hZFxuICAgICAgICAvLyBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD02MzA0MFxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gb25jaGFuZ2U7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgd2luZG93Lm9uaGFzaGNoYW5nZSA9IG9uY2hhbmdlO1xuICAgICAgfVxuICAgICAgdGhpcy5tb2RlID0gJ21vZGVybic7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy9cbiAgICAgIC8vIElFIHN1cHBvcnQsIGJhc2VkIG9uIGEgY29uY2VwdCBieSBFcmlrIEFydmlkc29uIC4uLlxuICAgICAgLy9cbiAgICAgIHZhciBmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuICAgICAgZnJhbWUuaWQgPSAnc3RhdGUtZnJhbWUnO1xuICAgICAgZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZnJhbWUpO1xuICAgICAgdGhpcy53cml0ZUZyYW1lKCcnKTtcblxuICAgICAgaWYgKCdvbnByb3BlcnR5Y2hhbmdlJyBpbiBkb2N1bWVudCAmJiAnYXR0YWNoRXZlbnQnIGluIGRvY3VtZW50KSB7XG4gICAgICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50KCdvbnByb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChldmVudC5wcm9wZXJ0eU5hbWUgPT09ICdsb2NhdGlvbicpIHtcbiAgICAgICAgICAgIHNlbGYuY2hlY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkgeyBzZWxmLmNoZWNrKCk7IH0sIDUwKTtcblxuICAgICAgdGhpcy5vbkhhc2hDaGFuZ2VkID0gb25jaGFuZ2U7XG4gICAgICB0aGlzLm1vZGUgPSAnbGVnYWN5JztcbiAgICB9XG5cbiAgICBSb3V0ZXIubGlzdGVuZXJzLnB1c2goZm4pO1xuXG4gICAgcmV0dXJuIHRoaXMubW9kZTtcbiAgfSxcblxuICBkZXN0cm95OiBmdW5jdGlvbiAoZm4pIHtcbiAgICBpZiAoIVJvdXRlciB8fCAhUm91dGVyLmxpc3RlbmVycykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBsaXN0ZW5lcnMgPSBSb3V0ZXIubGlzdGVuZXJzO1xuXG4gICAgZm9yICh2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXSA9PT0gZm4pIHtcbiAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgc2V0SGFzaDogZnVuY3Rpb24gKHMpIHtcbiAgICAvLyBNb3ppbGxhIGFsd2F5cyBhZGRzIGFuIGVudHJ5IHRvIHRoZSBoaXN0b3J5XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ2xlZ2FjeScpIHtcbiAgICAgIHRoaXMud3JpdGVGcmFtZShzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oaXN0b3J5ID09PSB0cnVlKSB7XG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCBzKTtcbiAgICAgIC8vIEZpcmUgYW4gb25wb3BzdGF0ZSBldmVudCBtYW51YWxseSBzaW5jZSBwdXNoaW5nIGRvZXMgbm90IG9idmlvdXNseVxuICAgICAgLy8gdHJpZ2dlciB0aGUgcG9wIGV2ZW50LlxuICAgICAgdGhpcy5maXJlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRsb2MuaGFzaCA9IChzWzBdID09PSAnLycpID8gcyA6ICcvJyArIHM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHdyaXRlRnJhbWU6IGZ1bmN0aW9uIChzKSB7XG4gICAgLy8gSUUgc3VwcG9ydC4uLlxuICAgIHZhciBmID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXRlLWZyYW1lJyk7XG4gICAgdmFyIGQgPSBmLmNvbnRlbnREb2N1bWVudCB8fCBmLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gICAgZC5vcGVuKCk7XG4gICAgZC53cml0ZShcIjxzY3JpcHQ+X2hhc2ggPSAnXCIgKyBzICsgXCInOyBvbmxvYWQgPSBwYXJlbnQubGlzdGVuZXIuc3luY0hhc2g7PHNjcmlwdD5cIik7XG4gICAgZC5jbG9zZSgpO1xuICB9LFxuXG4gIHN5bmNIYXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gSUUgc3VwcG9ydC4uLlxuICAgIHZhciBzID0gdGhpcy5faGFzaDtcbiAgICBpZiAocyAhPSBkbG9jLmhhc2gpIHtcbiAgICAgIGRsb2MuaGFzaCA9IHM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uSGFzaENoYW5nZWQ6IGZ1bmN0aW9uICgpIHt9XG59O1xuXG52YXIgUm91dGVyID0gZXhwb3J0cy5Sb3V0ZXIgPSBmdW5jdGlvbiAocm91dGVzKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSb3V0ZXIpKSByZXR1cm4gbmV3IFJvdXRlcihyb3V0ZXMpO1xuXG4gIHRoaXMucGFyYW1zICAgPSB7fTtcbiAgdGhpcy5yb3V0ZXMgICA9IHt9O1xuICB0aGlzLm1ldGhvZHMgID0gWydvbicsICdvbmNlJywgJ2FmdGVyJywgJ2JlZm9yZSddO1xuICB0aGlzLnNjb3BlICAgID0gW107XG4gIHRoaXMuX21ldGhvZHMgPSB7fTtcblxuICB0aGlzLl9pbnNlcnQgPSB0aGlzLmluc2VydDtcbiAgdGhpcy5pbnNlcnQgPSB0aGlzLmluc2VydEV4O1xuXG4gIHRoaXMuaGlzdG9yeVN1cHBvcnQgPSAod2luZG93Lmhpc3RvcnkgIT0gbnVsbCA/IHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSA6IG51bGwpICE9IG51bGxcblxuICB0aGlzLmNvbmZpZ3VyZSgpO1xuICB0aGlzLm1vdW50KHJvdXRlcyB8fCB7fSk7XG59O1xuXG5Sb3V0ZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAocikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIHJvdXRlVG87XG4gIHRoaXMuaGFuZGxlciA9IGZ1bmN0aW9uKG9uQ2hhbmdlRXZlbnQpIHtcbiAgICB2YXIgbmV3VVJMID0gb25DaGFuZ2VFdmVudCAmJiBvbkNoYW5nZUV2ZW50Lm5ld1VSTCB8fCB3aW5kb3cubG9jYXRpb24uaGFzaDtcbiAgICB2YXIgdXJsID0gc2VsZi5oaXN0b3J5ID09PSB0cnVlID8gc2VsZi5nZXRQYXRoKCkgOiBuZXdVUkwucmVwbGFjZSgvLiojLywgJycpO1xuICAgIHNlbGYuZGlzcGF0Y2goJ29uJywgdXJsLmNoYXJBdCgwKSA9PT0gJy8nID8gdXJsIDogJy8nICsgdXJsKTtcbiAgfTtcblxuICBsaXN0ZW5lci5pbml0KHRoaXMuaGFuZGxlciwgdGhpcy5oaXN0b3J5KTtcblxuICBpZiAodGhpcy5oaXN0b3J5ID09PSBmYWxzZSkge1xuICAgIGlmIChkbG9jSGFzaEVtcHR5KCkgJiYgcikge1xuICAgICAgZGxvYy5oYXNoID0gcjtcbiAgICB9IGVsc2UgaWYgKCFkbG9jSGFzaEVtcHR5KCkpIHtcbiAgICAgIHNlbGYuZGlzcGF0Y2goJ29uJywgJy8nICsgZGxvYy5oYXNoLnJlcGxhY2UoL14oI1xcL3wjfFxcLykvLCAnJykpO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodGhpcy5jb252ZXJ0X2hhc2hfaW5faW5pdCkge1xuICAgICAgLy8gVXNlIGhhc2ggYXMgcm91dGVcbiAgICAgIHJvdXRlVG8gPSBkbG9jSGFzaEVtcHR5KCkgJiYgciA/IHIgOiAhZGxvY0hhc2hFbXB0eSgpID8gZGxvYy5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogbnVsbDtcbiAgICAgIGlmIChyb3V0ZVRvKSB7XG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgZG9jdW1lbnQudGl0bGUsIHJvdXRlVG8pO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFVzZSBjYW5vbmljYWwgdXJsXG4gICAgICByb3V0ZVRvID0gdGhpcy5nZXRQYXRoKCk7XG4gICAgfVxuXG4gICAgLy8gUm91dGVyIGhhcyBiZWVuIGluaXRpYWxpemVkLCBidXQgZHVlIHRvIHRoZSBjaHJvbWUgYnVnIGl0IHdpbGwgbm90XG4gICAgLy8geWV0IGFjdHVhbGx5IHJvdXRlIEhUTUw1IGhpc3Rvcnkgc3RhdGUgY2hhbmdlcy4gVGh1cywgZGVjaWRlIGlmIHNob3VsZCByb3V0ZS5cbiAgICBpZiAocm91dGVUbyB8fCB0aGlzLnJ1bl9pbl9pbml0ID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmhhbmRsZXIoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cblJvdXRlci5wcm90b3R5cGUuZXhwbG9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHYgPSB0aGlzLmhpc3RvcnkgPT09IHRydWUgPyB0aGlzLmdldFBhdGgoKSA6IGRsb2MuaGFzaDtcbiAgaWYgKHYuY2hhckF0KDEpID09PSAnLycpIHsgdj12LnNsaWNlKDEpIH1cbiAgcmV0dXJuIHYuc2xpY2UoMSwgdi5sZW5ndGgpLnNwbGl0KFwiL1wiKTtcbn07XG5cblJvdXRlci5wcm90b3R5cGUuc2V0Um91dGUgPSBmdW5jdGlvbiAoaSwgdiwgdmFsKSB7XG4gIHZhciB1cmwgPSB0aGlzLmV4cGxvZGUoKTtcblxuICBpZiAodHlwZW9mIGkgPT09ICdudW1iZXInICYmIHR5cGVvZiB2ID09PSAnc3RyaW5nJykge1xuICAgIHVybFtpXSA9IHY7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB1cmwuc3BsaWNlKGksIHYsIHMpO1xuICB9XG4gIGVsc2Uge1xuICAgIHVybCA9IFtpXTtcbiAgfVxuXG4gIGxpc3RlbmVyLnNldEhhc2godXJsLmpvaW4oJy8nKSk7XG4gIHJldHVybiB1cmw7XG59O1xuXG4vL1xuLy8gIyMjIGZ1bmN0aW9uIGluc2VydEV4KG1ldGhvZCwgcGF0aCwgcm91dGUsIHBhcmVudClcbi8vICMjIyMgQG1ldGhvZCB7c3RyaW5nfSBNZXRob2QgdG8gaW5zZXJ0IHRoZSBzcGVjaWZpYyBgcm91dGVgLlxuLy8gIyMjIyBAcGF0aCB7QXJyYXl9IFBhcnNlZCBwYXRoIHRvIGluc2VydCB0aGUgYHJvdXRlYCBhdC5cbi8vICMjIyMgQHJvdXRlIHtBcnJheXxmdW5jdGlvbn0gUm91dGUgaGFuZGxlcnMgdG8gaW5zZXJ0LlxuLy8gIyMjIyBAcGFyZW50IHtPYmplY3R9ICoqT3B0aW9uYWwqKiBQYXJlbnQgXCJyb3V0ZXNcIiB0byBpbnNlcnQgaW50by5cbi8vIGluc2VydCBhIGNhbGxiYWNrIHRoYXQgd2lsbCBvbmx5IG9jY3VyIG9uY2UgcGVyIHRoZSBtYXRjaGVkIHJvdXRlLlxuLy9cblJvdXRlci5wcm90b3R5cGUuaW5zZXJ0RXggPSBmdW5jdGlvbihtZXRob2QsIHBhdGgsIHJvdXRlLCBwYXJlbnQpIHtcbiAgaWYgKG1ldGhvZCA9PT0gXCJvbmNlXCIpIHtcbiAgICBtZXRob2QgPSBcIm9uXCI7XG4gICAgcm91dGUgPSBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgdmFyIG9uY2UgPSBmYWxzZTtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG9uY2UpIHJldHVybjtcbiAgICAgICAgb25jZSA9IHRydWU7XG4gICAgICAgIHJldHVybiByb3V0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KHJvdXRlKTtcbiAgfVxuICByZXR1cm4gdGhpcy5faW5zZXJ0KG1ldGhvZCwgcGF0aCwgcm91dGUsIHBhcmVudCk7XG59O1xuXG5Sb3V0ZXIucHJvdG90eXBlLmdldFJvdXRlID0gZnVuY3Rpb24gKHYpIHtcbiAgdmFyIHJldCA9IHY7XG5cbiAgaWYgKHR5cGVvZiB2ID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0ID0gdGhpcy5leHBsb2RlKClbdl07XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIHYgPT09IFwic3RyaW5nXCIpe1xuICAgIHZhciBoID0gdGhpcy5leHBsb2RlKCk7XG4gICAgcmV0ID0gaC5pbmRleE9mKHYpO1xuICB9XG4gIGVsc2Uge1xuICAgIHJldCA9IHRoaXMuZXhwbG9kZSgpO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cblJvdXRlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgbGlzdGVuZXIuZGVzdHJveSh0aGlzLmhhbmRsZXIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJvdXRlci5wcm90b3R5cGUuZ2V0UGF0aCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gIGlmIChwYXRoLnN1YnN0cigwLCAxKSAhPT0gJy8nKSB7XG4gICAgcGF0aCA9ICcvJyArIHBhdGg7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59O1xuZnVuY3Rpb24gX2V2ZXJ5KGFyciwgaXRlcmF0b3IpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAoaXRlcmF0b3IoYXJyW2ldLCBpLCBhcnIpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfZmxhdHRlbihhcnIpIHtcbiAgdmFyIGZsYXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIG4gPSBhcnIubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgZmxhdCA9IGZsYXQuY29uY2F0KGFycltpXSk7XG4gIH1cbiAgcmV0dXJuIGZsYXQ7XG59XG5cbmZ1bmN0aW9uIF9hc3luY0V2ZXJ5U2VyaWVzKGFyciwgaXRlcmF0b3IsIGNhbGxiYWNrKSB7XG4gIGlmICghYXJyLmxlbmd0aCkge1xuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICB9XG4gIHZhciBjb21wbGV0ZWQgPSAwO1xuICAoZnVuY3Rpb24gaXRlcmF0ZSgpIHtcbiAgICBpdGVyYXRvcihhcnJbY29tcGxldGVkXSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBpZiAoZXJyIHx8IGVyciA9PT0gZmFsc2UpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcGxldGVkICs9IDE7XG4gICAgICAgIGlmIChjb21wbGV0ZWQgPT09IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZXJhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KSgpO1xufVxuXG5mdW5jdGlvbiBwYXJhbWlmeVN0cmluZyhzdHIsIHBhcmFtcywgbW9kKSB7XG4gIG1vZCA9IHN0cjtcbiAgZm9yICh2YXIgcGFyYW0gaW4gcGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShwYXJhbSkpIHtcbiAgICAgIG1vZCA9IHBhcmFtc1twYXJhbV0oc3RyKTtcbiAgICAgIGlmIChtb2QgIT09IHN0cikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1vZCA9PT0gc3RyID8gXCIoWy5fYS16QS1aMC05LSUoKV0rKVwiIDogbW9kO1xufVxuXG5mdW5jdGlvbiByZWdpZnlTdHJpbmcoc3RyLCBwYXJhbXMpIHtcbiAgdmFyIG1hdGNoZXMsIGxhc3QgPSAwLCBvdXQgPSBcIlwiO1xuICB3aGlsZSAobWF0Y2hlcyA9IHN0ci5zdWJzdHIobGFzdCkubWF0Y2goL1teXFx3XFxkXFwtICVAJl0qXFwqW15cXHdcXGRcXC0gJUAmXSovKSkge1xuICAgIGxhc3QgPSBtYXRjaGVzLmluZGV4ICsgbWF0Y2hlc1swXS5sZW5ndGg7XG4gICAgbWF0Y2hlc1swXSA9IG1hdGNoZXNbMF0ucmVwbGFjZSgvXlxcKi8sIFwiKFtfLigpIVxcXFwgJUAmYS16QS1aMC05LV0rKVwiKTtcbiAgICBvdXQgKz0gc3RyLnN1YnN0cigwLCBtYXRjaGVzLmluZGV4KSArIG1hdGNoZXNbMF07XG4gIH1cbiAgc3RyID0gb3V0ICs9IHN0ci5zdWJzdHIobGFzdCk7XG4gIHZhciBjYXB0dXJlcyA9IHN0ci5tYXRjaCgvOihbXlxcL10rKS9pZyksIGNhcHR1cmUsIGxlbmd0aDtcbiAgaWYgKGNhcHR1cmVzKSB7XG4gICAgbGVuZ3RoID0gY2FwdHVyZXMubGVuZ3RoO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhcHR1cmUgPSBjYXB0dXJlc1tpXTtcbiAgICAgIGlmIChjYXB0dXJlLnNsaWNlKDAsIDIpID09PSBcIjo6XCIpIHtcbiAgICAgICAgc3RyID0gY2FwdHVyZS5zbGljZSgxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKGNhcHR1cmUsIHBhcmFtaWZ5U3RyaW5nKGNhcHR1cmUsIHBhcmFtcykpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufVxuXG5mdW5jdGlvbiB0ZXJtaW5hdG9yKHJvdXRlcywgZGVsaW1pdGVyLCBzdGFydCwgc3RvcCkge1xuICB2YXIgbGFzdCA9IDAsIGxlZnQgPSAwLCByaWdodCA9IDAsIHN0YXJ0ID0gKHN0YXJ0IHx8IFwiKFwiKS50b1N0cmluZygpLCBzdG9wID0gKHN0b3AgfHwgXCIpXCIpLnRvU3RyaW5nKCksIGk7XG4gIGZvciAoaSA9IDA7IGkgPCByb3V0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY2h1bmsgPSByb3V0ZXNbaV07XG4gICAgaWYgKGNodW5rLmluZGV4T2Yoc3RhcnQsIGxhc3QpID4gY2h1bmsuaW5kZXhPZihzdG9wLCBsYXN0KSB8fCB+Y2h1bmsuaW5kZXhPZihzdGFydCwgbGFzdCkgJiYgIX5jaHVuay5pbmRleE9mKHN0b3AsIGxhc3QpIHx8ICF+Y2h1bmsuaW5kZXhPZihzdGFydCwgbGFzdCkgJiYgfmNodW5rLmluZGV4T2Yoc3RvcCwgbGFzdCkpIHtcbiAgICAgIGxlZnQgPSBjaHVuay5pbmRleE9mKHN0YXJ0LCBsYXN0KTtcbiAgICAgIHJpZ2h0ID0gY2h1bmsuaW5kZXhPZihzdG9wLCBsYXN0KTtcbiAgICAgIGlmICh+bGVmdCAmJiAhfnJpZ2h0IHx8ICF+bGVmdCAmJiB+cmlnaHQpIHtcbiAgICAgICAgdmFyIHRtcCA9IHJvdXRlcy5zbGljZSgwLCAoaSB8fCAxKSArIDEpLmpvaW4oZGVsaW1pdGVyKTtcbiAgICAgICAgcm91dGVzID0gWyB0bXAgXS5jb25jYXQocm91dGVzLnNsaWNlKChpIHx8IDEpICsgMSkpO1xuICAgICAgfVxuICAgICAgbGFzdCA9IChyaWdodCA+IGxlZnQgPyByaWdodCA6IGxlZnQpICsgMTtcbiAgICAgIGkgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0ID0gMDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJvdXRlcztcbn1cblxudmFyIFFVRVJZX1NFUEFSQVRPUiA9IC9cXD8uKi87XG5cblJvdXRlci5wcm90b3R5cGUuY29uZmlndXJlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm1ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9tZXRob2RzW3RoaXMubWV0aG9kc1tpXV0gPSB0cnVlO1xuICB9XG4gIHRoaXMucmVjdXJzZSA9IG9wdGlvbnMucmVjdXJzZSB8fCB0aGlzLnJlY3Vyc2UgfHwgZmFsc2U7XG4gIHRoaXMuYXN5bmMgPSBvcHRpb25zLmFzeW5jIHx8IGZhbHNlO1xuICB0aGlzLmRlbGltaXRlciA9IG9wdGlvbnMuZGVsaW1pdGVyIHx8IFwiL1wiO1xuICB0aGlzLnN0cmljdCA9IHR5cGVvZiBvcHRpb25zLnN0cmljdCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRydWUgOiBvcHRpb25zLnN0cmljdDtcbiAgdGhpcy5ub3Rmb3VuZCA9IG9wdGlvbnMubm90Zm91bmQ7XG4gIHRoaXMucmVzb3VyY2UgPSBvcHRpb25zLnJlc291cmNlO1xuICB0aGlzLmhpc3RvcnkgPSBvcHRpb25zLmh0bWw1aGlzdG9yeSAmJiB0aGlzLmhpc3RvcnlTdXBwb3J0IHx8IGZhbHNlO1xuICB0aGlzLnJ1bl9pbl9pbml0ID0gdGhpcy5oaXN0b3J5ID09PSB0cnVlICYmIG9wdGlvbnMucnVuX2hhbmRsZXJfaW5faW5pdCAhPT0gZmFsc2U7XG4gIHRoaXMuY29udmVydF9oYXNoX2luX2luaXQgPSB0aGlzLmhpc3RvcnkgPT09IHRydWUgJiYgb3B0aW9ucy5jb252ZXJ0X2hhc2hfaW5faW5pdCAhPT0gZmFsc2U7XG4gIHRoaXMuZXZlcnkgPSB7XG4gICAgYWZ0ZXI6IG9wdGlvbnMuYWZ0ZXIgfHwgbnVsbCxcbiAgICBiZWZvcmU6IG9wdGlvbnMuYmVmb3JlIHx8IG51bGwsXG4gICAgb246IG9wdGlvbnMub24gfHwgbnVsbFxuICB9O1xuICByZXR1cm4gdGhpcztcbn07XG5cblJvdXRlci5wcm90b3R5cGUucGFyYW0gPSBmdW5jdGlvbih0b2tlbiwgbWF0Y2hlcikge1xuICBpZiAodG9rZW5bMF0gIT09IFwiOlwiKSB7XG4gICAgdG9rZW4gPSBcIjpcIiArIHRva2VuO1xuICB9XG4gIHZhciBjb21waWxlZCA9IG5ldyBSZWdFeHAodG9rZW4sIFwiZ1wiKTtcbiAgdGhpcy5wYXJhbXNbdG9rZW5dID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKGNvbXBpbGVkLCBtYXRjaGVyLnNvdXJjZSB8fCBtYXRjaGVyKTtcbiAgfTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Sb3V0ZXIucHJvdG90eXBlLm9uID0gUm91dGVyLnByb3RvdHlwZS5yb3V0ZSA9IGZ1bmN0aW9uKG1ldGhvZCwgcGF0aCwgcm91dGUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBpZiAoIXJvdXRlICYmIHR5cGVvZiBwYXRoID09IFwiZnVuY3Rpb25cIikge1xuICAgIHJvdXRlID0gcGF0aDtcbiAgICBwYXRoID0gbWV0aG9kO1xuICAgIG1ldGhvZCA9IFwib25cIjtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShwYXRoKSkge1xuICAgIHJldHVybiBwYXRoLmZvckVhY2goZnVuY3Rpb24ocCkge1xuICAgICAgc2VsZi5vbihtZXRob2QsIHAsIHJvdXRlKTtcbiAgICB9KTtcbiAgfVxuICBpZiAocGF0aC5zb3VyY2UpIHtcbiAgICBwYXRoID0gcGF0aC5zb3VyY2UucmVwbGFjZSgvXFxcXFxcLy9pZywgXCIvXCIpO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG1ldGhvZCkpIHtcbiAgICByZXR1cm4gbWV0aG9kLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgICAgc2VsZi5vbihtLnRvTG93ZXJDYXNlKCksIHBhdGgsIHJvdXRlKTtcbiAgICB9KTtcbiAgfVxuICBwYXRoID0gcGF0aC5zcGxpdChuZXcgUmVnRXhwKHRoaXMuZGVsaW1pdGVyKSk7XG4gIHBhdGggPSB0ZXJtaW5hdG9yKHBhdGgsIHRoaXMuZGVsaW1pdGVyKTtcbiAgdGhpcy5pbnNlcnQobWV0aG9kLCB0aGlzLnNjb3BlLmNvbmNhdChwYXRoKSwgcm91dGUpO1xufTtcblxuUm91dGVyLnByb3RvdHlwZS5wYXRoID0gZnVuY3Rpb24ocGF0aCwgcm91dGVzRm4pIHtcbiAgdmFyIHNlbGYgPSB0aGlzLCBsZW5ndGggPSB0aGlzLnNjb3BlLmxlbmd0aDtcbiAgaWYgKHBhdGguc291cmNlKSB7XG4gICAgcGF0aCA9IHBhdGguc291cmNlLnJlcGxhY2UoL1xcXFxcXC8vaWcsIFwiL1wiKTtcbiAgfVxuICBwYXRoID0gcGF0aC5zcGxpdChuZXcgUmVnRXhwKHRoaXMuZGVsaW1pdGVyKSk7XG4gIHBhdGggPSB0ZXJtaW5hdG9yKHBhdGgsIHRoaXMuZGVsaW1pdGVyKTtcbiAgdGhpcy5zY29wZSA9IHRoaXMuc2NvcGUuY29uY2F0KHBhdGgpO1xuICByb3V0ZXNGbi5jYWxsKHRoaXMsIHRoaXMpO1xuICB0aGlzLnNjb3BlLnNwbGljZShsZW5ndGgsIHBhdGgubGVuZ3RoKTtcbn07XG5cblJvdXRlci5wcm90b3R5cGUuZGlzcGF0Y2ggPSBmdW5jdGlvbihtZXRob2QsIHBhdGgsIGNhbGxiYWNrKSB7XG4gIHZhciBzZWxmID0gdGhpcywgZm5zID0gdGhpcy50cmF2ZXJzZShtZXRob2QsIHBhdGgucmVwbGFjZShRVUVSWV9TRVBBUkFUT1IsIFwiXCIpLCB0aGlzLnJvdXRlcywgXCJcIiksIGludm9rZWQgPSB0aGlzLl9pbnZva2VkLCBhZnRlcjtcbiAgdGhpcy5faW52b2tlZCA9IHRydWU7XG4gIGlmICghZm5zIHx8IGZucy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLmxhc3QgPSBbXTtcbiAgICBpZiAodHlwZW9mIHRoaXMubm90Zm91bmQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5pbnZva2UoWyB0aGlzLm5vdGZvdW5kIF0sIHtcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIHBhdGg6IHBhdGhcbiAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0aGlzLnJlY3Vyc2UgPT09IFwiZm9yd2FyZFwiKSB7XG4gICAgZm5zID0gZm5zLnJldmVyc2UoKTtcbiAgfVxuICBmdW5jdGlvbiB1cGRhdGVBbmRJbnZva2UoKSB7XG4gICAgc2VsZi5sYXN0ID0gZm5zLmFmdGVyO1xuICAgIHNlbGYuaW52b2tlKHNlbGYucnVubGlzdChmbnMpLCBzZWxmLCBjYWxsYmFjayk7XG4gIH1cbiAgYWZ0ZXIgPSB0aGlzLmV2ZXJ5ICYmIHRoaXMuZXZlcnkuYWZ0ZXIgPyBbIHRoaXMuZXZlcnkuYWZ0ZXIgXS5jb25jYXQodGhpcy5sYXN0KSA6IFsgdGhpcy5sYXN0IF07XG4gIGlmIChhZnRlciAmJiBhZnRlci5sZW5ndGggPiAwICYmIGludm9rZWQpIHtcbiAgICBpZiAodGhpcy5hc3luYykge1xuICAgICAgdGhpcy5pbnZva2UoYWZ0ZXIsIHRoaXMsIHVwZGF0ZUFuZEludm9rZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW52b2tlKGFmdGVyLCB0aGlzKTtcbiAgICAgIHVwZGF0ZUFuZEludm9rZSgpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICB1cGRhdGVBbmRJbnZva2UoKTtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5Sb3V0ZXIucHJvdG90eXBlLmludm9rZSA9IGZ1bmN0aW9uKGZucywgdGhpc0FyZywgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgYXBwbHk7XG4gIGlmICh0aGlzLmFzeW5jKSB7XG4gICAgYXBwbHkgPSBmdW5jdGlvbihmbiwgbmV4dCkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZm4pKSB7XG4gICAgICAgIHJldHVybiBfYXN5bmNFdmVyeVNlcmllcyhmbiwgYXBwbHksIG5leHQpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZm4gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGZuLmFwcGx5KHRoaXNBcmcsIChmbnMuY2FwdHVyZXMgfHwgW10pLmNvbmNhdChuZXh0KSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBfYXN5bmNFdmVyeVNlcmllcyhmbnMsIGFwcGx5LCBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGFwcGx5ID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGZuKSkge1xuICAgICAgICByZXR1cm4gX2V2ZXJ5KGZuLCBhcHBseSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzQXJnLCBmbnMuY2FwdHVyZXMgfHwgW10pO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZm4gPT09IFwic3RyaW5nXCIgJiYgc2VsZi5yZXNvdXJjZSkge1xuICAgICAgICBzZWxmLnJlc291cmNlW2ZuXS5hcHBseSh0aGlzQXJnLCBmbnMuY2FwdHVyZXMgfHwgW10pO1xuICAgICAgfVxuICAgIH07XG4gICAgX2V2ZXJ5KGZucywgYXBwbHkpO1xuICB9XG59O1xuXG5Sb3V0ZXIucHJvdG90eXBlLnRyYXZlcnNlID0gZnVuY3Rpb24obWV0aG9kLCBwYXRoLCByb3V0ZXMsIHJlZ2V4cCwgZmlsdGVyKSB7XG4gIHZhciBmbnMgPSBbXSwgY3VycmVudCwgZXhhY3QsIG1hdGNoLCBuZXh0LCB0aGF0O1xuICBmdW5jdGlvbiBmaWx0ZXJSb3V0ZXMocm91dGVzKSB7XG4gICAgaWYgKCFmaWx0ZXIpIHtcbiAgICAgIHJldHVybiByb3V0ZXM7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlZXBDb3B5KHNvdXJjZSkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0W2ldID0gQXJyYXkuaXNBcnJheShzb3VyY2VbaV0pID8gZGVlcENvcHkoc291cmNlW2ldKSA6IHNvdXJjZVtpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFwcGx5RmlsdGVyKGZucykge1xuICAgICAgZm9yICh2YXIgaSA9IGZucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShmbnNbaV0pKSB7XG4gICAgICAgICAgYXBwbHlGaWx0ZXIoZm5zW2ldKTtcbiAgICAgICAgICBpZiAoZm5zW2ldLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZm5zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFmaWx0ZXIoZm5zW2ldKSkge1xuICAgICAgICAgICAgZm5zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIG5ld1JvdXRlcyA9IGRlZXBDb3B5KHJvdXRlcyk7XG4gICAgbmV3Um91dGVzLm1hdGNoZWQgPSByb3V0ZXMubWF0Y2hlZDtcbiAgICBuZXdSb3V0ZXMuY2FwdHVyZXMgPSByb3V0ZXMuY2FwdHVyZXM7XG4gICAgbmV3Um91dGVzLmFmdGVyID0gcm91dGVzLmFmdGVyLmZpbHRlcihmaWx0ZXIpO1xuICAgIGFwcGx5RmlsdGVyKG5ld1JvdXRlcyk7XG4gICAgcmV0dXJuIG5ld1JvdXRlcztcbiAgfVxuICBpZiAocGF0aCA9PT0gdGhpcy5kZWxpbWl0ZXIgJiYgcm91dGVzW21ldGhvZF0pIHtcbiAgICBuZXh0ID0gWyBbIHJvdXRlcy5iZWZvcmUsIHJvdXRlc1ttZXRob2RdIF0uZmlsdGVyKEJvb2xlYW4pIF07XG4gICAgbmV4dC5hZnRlciA9IFsgcm91dGVzLmFmdGVyIF0uZmlsdGVyKEJvb2xlYW4pO1xuICAgIG5leHQubWF0Y2hlZCA9IHRydWU7XG4gICAgbmV4dC5jYXB0dXJlcyA9IFtdO1xuICAgIHJldHVybiBmaWx0ZXJSb3V0ZXMobmV4dCk7XG4gIH1cbiAgZm9yICh2YXIgciBpbiByb3V0ZXMpIHtcbiAgICBpZiAocm91dGVzLmhhc093blByb3BlcnR5KHIpICYmICghdGhpcy5fbWV0aG9kc1tyXSB8fCB0aGlzLl9tZXRob2RzW3JdICYmIHR5cGVvZiByb3V0ZXNbcl0gPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocm91dGVzW3JdKSkpIHtcbiAgICAgIGN1cnJlbnQgPSBleGFjdCA9IHJlZ2V4cCArIHRoaXMuZGVsaW1pdGVyICsgcjtcbiAgICAgIGlmICghdGhpcy5zdHJpY3QpIHtcbiAgICAgICAgZXhhY3QgKz0gXCJbXCIgKyB0aGlzLmRlbGltaXRlciArIFwiXT9cIjtcbiAgICAgIH1cbiAgICAgIG1hdGNoID0gcGF0aC5tYXRjaChuZXcgUmVnRXhwKFwiXlwiICsgZXhhY3QpKTtcbiAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAobWF0Y2hbMF0gJiYgbWF0Y2hbMF0gPT0gcGF0aCAmJiByb3V0ZXNbcl1bbWV0aG9kXSkge1xuICAgICAgICBuZXh0ID0gWyBbIHJvdXRlc1tyXS5iZWZvcmUsIHJvdXRlc1tyXVttZXRob2RdIF0uZmlsdGVyKEJvb2xlYW4pIF07XG4gICAgICAgIG5leHQuYWZ0ZXIgPSBbIHJvdXRlc1tyXS5hZnRlciBdLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgbmV4dC5tYXRjaGVkID0gdHJ1ZTtcbiAgICAgICAgbmV4dC5jYXB0dXJlcyA9IG1hdGNoLnNsaWNlKDEpO1xuICAgICAgICBpZiAodGhpcy5yZWN1cnNlICYmIHJvdXRlcyA9PT0gdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgICBuZXh0LnB1c2goWyByb3V0ZXMuYmVmb3JlLCByb3V0ZXMub24gXS5maWx0ZXIoQm9vbGVhbikpO1xuICAgICAgICAgIG5leHQuYWZ0ZXIgPSBuZXh0LmFmdGVyLmNvbmNhdChbIHJvdXRlcy5hZnRlciBdLmZpbHRlcihCb29sZWFuKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpbHRlclJvdXRlcyhuZXh0KTtcbiAgICAgIH1cbiAgICAgIG5leHQgPSB0aGlzLnRyYXZlcnNlKG1ldGhvZCwgcGF0aCwgcm91dGVzW3JdLCBjdXJyZW50KTtcbiAgICAgIGlmIChuZXh0Lm1hdGNoZWQpIHtcbiAgICAgICAgaWYgKG5leHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGZucyA9IGZucy5jb25jYXQobmV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVjdXJzZSkge1xuICAgICAgICAgIGZucy5wdXNoKFsgcm91dGVzW3JdLmJlZm9yZSwgcm91dGVzW3JdLm9uIF0uZmlsdGVyKEJvb2xlYW4pKTtcbiAgICAgICAgICBuZXh0LmFmdGVyID0gbmV4dC5hZnRlci5jb25jYXQoWyByb3V0ZXNbcl0uYWZ0ZXIgXS5maWx0ZXIoQm9vbGVhbikpO1xuICAgICAgICAgIGlmIChyb3V0ZXMgPT09IHRoaXMucm91dGVzKSB7XG4gICAgICAgICAgICBmbnMucHVzaChbIHJvdXRlc1tcImJlZm9yZVwiXSwgcm91dGVzW1wib25cIl0gXS5maWx0ZXIoQm9vbGVhbikpO1xuICAgICAgICAgICAgbmV4dC5hZnRlciA9IG5leHQuYWZ0ZXIuY29uY2F0KFsgcm91dGVzW1wiYWZ0ZXJcIl0gXS5maWx0ZXIoQm9vbGVhbikpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmbnMubWF0Y2hlZCA9IHRydWU7XG4gICAgICAgIGZucy5jYXB0dXJlcyA9IG5leHQuY2FwdHVyZXM7XG4gICAgICAgIGZucy5hZnRlciA9IG5leHQuYWZ0ZXI7XG4gICAgICAgIHJldHVybiBmaWx0ZXJSb3V0ZXMoZm5zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuUm91dGVyLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihtZXRob2QsIHBhdGgsIHJvdXRlLCBwYXJlbnQpIHtcbiAgdmFyIG1ldGhvZFR5cGUsIHBhcmVudFR5cGUsIGlzQXJyYXksIG5lc3RlZCwgcGFydDtcbiAgcGF0aCA9IHBhdGguZmlsdGVyKGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gcCAmJiBwLmxlbmd0aCA+IDA7XG4gIH0pO1xuICBwYXJlbnQgPSBwYXJlbnQgfHwgdGhpcy5yb3V0ZXM7XG4gIHBhcnQgPSBwYXRoLnNoaWZ0KCk7XG4gIGlmICgvXFw6fFxcKi8udGVzdChwYXJ0KSAmJiAhL1xcXFxkfFxcXFx3Ly50ZXN0KHBhcnQpKSB7XG4gICAgcGFydCA9IHJlZ2lmeVN0cmluZyhwYXJ0LCB0aGlzLnBhcmFtcyk7XG4gIH1cbiAgaWYgKHBhdGgubGVuZ3RoID4gMCkge1xuICAgIHBhcmVudFtwYXJ0XSA9IHBhcmVudFtwYXJ0XSB8fCB7fTtcbiAgICByZXR1cm4gdGhpcy5pbnNlcnQobWV0aG9kLCBwYXRoLCByb3V0ZSwgcGFyZW50W3BhcnRdKTtcbiAgfVxuICBpZiAoIXBhcnQgJiYgIXBhdGgubGVuZ3RoICYmIHBhcmVudCA9PT0gdGhpcy5yb3V0ZXMpIHtcbiAgICBtZXRob2RUeXBlID0gdHlwZW9mIHBhcmVudFttZXRob2RdO1xuICAgIHN3aXRjaCAobWV0aG9kVHlwZSkge1xuICAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIHBhcmVudFttZXRob2RdID0gWyBwYXJlbnRbbWV0aG9kXSwgcm91dGUgXTtcbiAgICAgIHJldHVybjtcbiAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgcGFyZW50W21ldGhvZF0ucHVzaChyb3V0ZSk7XG4gICAgICByZXR1cm47XG4gICAgIGNhc2UgXCJ1bmRlZmluZWRcIjpcbiAgICAgIHBhcmVudFttZXRob2RdID0gcm91dGU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBwYXJlbnRUeXBlID0gdHlwZW9mIHBhcmVudFtwYXJ0XTtcbiAgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkocGFyZW50W3BhcnRdKTtcbiAgaWYgKHBhcmVudFtwYXJ0XSAmJiAhaXNBcnJheSAmJiBwYXJlbnRUeXBlID09IFwib2JqZWN0XCIpIHtcbiAgICBtZXRob2RUeXBlID0gdHlwZW9mIHBhcmVudFtwYXJ0XVttZXRob2RdO1xuICAgIHN3aXRjaCAobWV0aG9kVHlwZSkge1xuICAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIHBhcmVudFtwYXJ0XVttZXRob2RdID0gWyBwYXJlbnRbcGFydF1bbWV0aG9kXSwgcm91dGUgXTtcbiAgICAgIHJldHVybjtcbiAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgcGFyZW50W3BhcnRdW21ldGhvZF0ucHVzaChyb3V0ZSk7XG4gICAgICByZXR1cm47XG4gICAgIGNhc2UgXCJ1bmRlZmluZWRcIjpcbiAgICAgIHBhcmVudFtwYXJ0XVttZXRob2RdID0gcm91dGU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2UgaWYgKHBhcmVudFR5cGUgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG5lc3RlZCA9IHt9O1xuICAgIG5lc3RlZFttZXRob2RdID0gcm91dGU7XG4gICAgcGFyZW50W3BhcnRdID0gbmVzdGVkO1xuICAgIHJldHVybjtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHJvdXRlIGNvbnRleHQ6IFwiICsgcGFyZW50VHlwZSk7XG59O1xuXG5cblxuUm91dGVyLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbihtZXRob2RzKSB7XG4gIHZhciBzZWxmID0gdGhpcywgbGVuID0gbWV0aG9kcy5sZW5ndGgsIGk7XG4gIGZ1bmN0aW9uIGV4dGVuZChtZXRob2QpIHtcbiAgICBzZWxmLl9tZXRob2RzW21ldGhvZF0gPSB0cnVlO1xuICAgIHNlbGZbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGV4dHJhID0gYXJndW1lbnRzLmxlbmd0aCA9PT0gMSA/IFsgbWV0aG9kLCBcIlwiIF0gOiBbIG1ldGhvZCBdO1xuICAgICAgc2VsZi5vbi5hcHBseShzZWxmLCBleHRyYS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gIH1cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZXh0ZW5kKG1ldGhvZHNbaV0pO1xuICB9XG59O1xuXG5Sb3V0ZXIucHJvdG90eXBlLnJ1bmxpc3QgPSBmdW5jdGlvbihmbnMpIHtcbiAgdmFyIHJ1bmxpc3QgPSB0aGlzLmV2ZXJ5ICYmIHRoaXMuZXZlcnkuYmVmb3JlID8gWyB0aGlzLmV2ZXJ5LmJlZm9yZSBdLmNvbmNhdChfZmxhdHRlbihmbnMpKSA6IF9mbGF0dGVuKGZucyk7XG4gIGlmICh0aGlzLmV2ZXJ5ICYmIHRoaXMuZXZlcnkub24pIHtcbiAgICBydW5saXN0LnB1c2godGhpcy5ldmVyeS5vbik7XG4gIH1cbiAgcnVubGlzdC5jYXB0dXJlcyA9IGZucy5jYXB0dXJlcztcbiAgcnVubGlzdC5zb3VyY2UgPSBmbnMuc291cmNlO1xuICByZXR1cm4gcnVubGlzdDtcbn07XG5cblJvdXRlci5wcm90b3R5cGUubW91bnQgPSBmdW5jdGlvbihyb3V0ZXMsIHBhdGgpIHtcbiAgaWYgKCFyb3V0ZXMgfHwgdHlwZW9mIHJvdXRlcyAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KHJvdXRlcykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBwYXRoID0gcGF0aCB8fCBbXTtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHBhdGgpKSB7XG4gICAgcGF0aCA9IHBhdGguc3BsaXQoc2VsZi5kZWxpbWl0ZXIpO1xuICB9XG4gIGZ1bmN0aW9uIGluc2VydE9yTW91bnQocm91dGUsIGxvY2FsKSB7XG4gICAgdmFyIHJlbmFtZSA9IHJvdXRlLCBwYXJ0cyA9IHJvdXRlLnNwbGl0KHNlbGYuZGVsaW1pdGVyKSwgcm91dGVUeXBlID0gdHlwZW9mIHJvdXRlc1tyb3V0ZV0sIGlzUm91dGUgPSBwYXJ0c1swXSA9PT0gXCJcIiB8fCAhc2VsZi5fbWV0aG9kc1twYXJ0c1swXV0sIGV2ZW50ID0gaXNSb3V0ZSA/IFwib25cIiA6IHJlbmFtZTtcbiAgICBpZiAoaXNSb3V0ZSkge1xuICAgICAgcmVuYW1lID0gcmVuYW1lLnNsaWNlKChyZW5hbWUubWF0Y2gobmV3IFJlZ0V4cChcIl5cIiArIHNlbGYuZGVsaW1pdGVyKSkgfHwgWyBcIlwiIF0pWzBdLmxlbmd0aCk7XG4gICAgICBwYXJ0cy5zaGlmdCgpO1xuICAgIH1cbiAgICBpZiAoaXNSb3V0ZSAmJiByb3V0ZVR5cGUgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocm91dGVzW3JvdXRlXSkpIHtcbiAgICAgIGxvY2FsID0gbG9jYWwuY29uY2F0KHBhcnRzKTtcbiAgICAgIHNlbGYubW91bnQocm91dGVzW3JvdXRlXSwgbG9jYWwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoaXNSb3V0ZSkge1xuICAgICAgbG9jYWwgPSBsb2NhbC5jb25jYXQocmVuYW1lLnNwbGl0KHNlbGYuZGVsaW1pdGVyKSk7XG4gICAgICBsb2NhbCA9IHRlcm1pbmF0b3IobG9jYWwsIHNlbGYuZGVsaW1pdGVyKTtcbiAgICB9XG4gICAgc2VsZi5pbnNlcnQoZXZlbnQsIGxvY2FsLCByb3V0ZXNbcm91dGVdKTtcbiAgfVxuICBmb3IgKHZhciByb3V0ZSBpbiByb3V0ZXMpIHtcbiAgICBpZiAocm91dGVzLmhhc093blByb3BlcnR5KHJvdXRlKSkge1xuICAgICAgaW5zZXJ0T3JNb3VudChyb3V0ZSwgcGF0aC5zbGljZSgwKSk7XG4gICAgfVxuICB9XG59O1xuXG5cblxufSh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIiA/IGV4cG9ydHMgOiB3aW5kb3cpKTsiLCIvKiEgQGxpY2Vuc2UgRmlyZWJhc2UgdjIuMi40XG4gICAgTGljZW5zZTogaHR0cHM6Ly93d3cuZmlyZWJhc2UuY29tL3Rlcm1zL3Rlcm1zLW9mLXNlcnZpY2UuaHRtbCAqL1xuKGZ1bmN0aW9uKCkge3ZhciBoLGFhPXRoaXM7ZnVuY3Rpb24gbihhKXtyZXR1cm4gdm9pZCAwIT09YX1mdW5jdGlvbiBiYSgpe31mdW5jdGlvbiBjYShhKXthLnViPWZ1bmN0aW9uKCl7cmV0dXJuIGEudGY/YS50ZjphLnRmPW5ldyBhfX1cbmZ1bmN0aW9uIGRhKGEpe3ZhciBiPXR5cGVvZiBhO2lmKFwib2JqZWN0XCI9PWIpaWYoYSl7aWYoYSBpbnN0YW5jZW9mIEFycmF5KXJldHVyblwiYXJyYXlcIjtpZihhIGluc3RhbmNlb2YgT2JqZWN0KXJldHVybiBiO3ZhciBjPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKTtpZihcIltvYmplY3QgV2luZG93XVwiPT1jKXJldHVyblwib2JqZWN0XCI7aWYoXCJbb2JqZWN0IEFycmF5XVwiPT1jfHxcIm51bWJlclwiPT10eXBlb2YgYS5sZW5ndGgmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLnNwbGljZSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEucHJvcGVydHlJc0VudW1lcmFibGUmJiFhLnByb3BlcnR5SXNFbnVtZXJhYmxlKFwic3BsaWNlXCIpKXJldHVyblwiYXJyYXlcIjtpZihcIltvYmplY3QgRnVuY3Rpb25dXCI9PWN8fFwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLmNhbGwmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLnByb3BlcnR5SXNFbnVtZXJhYmxlJiYhYS5wcm9wZXJ0eUlzRW51bWVyYWJsZShcImNhbGxcIikpcmV0dXJuXCJmdW5jdGlvblwifWVsc2UgcmV0dXJuXCJudWxsXCI7XG5lbHNlIGlmKFwiZnVuY3Rpb25cIj09YiYmXCJ1bmRlZmluZWRcIj09dHlwZW9mIGEuY2FsbClyZXR1cm5cIm9iamVjdFwiO3JldHVybiBifWZ1bmN0aW9uIGVhKGEpe3JldHVyblwiYXJyYXlcIj09ZGEoYSl9ZnVuY3Rpb24gZmEoYSl7dmFyIGI9ZGEoYSk7cmV0dXJuXCJhcnJheVwiPT1ifHxcIm9iamVjdFwiPT1iJiZcIm51bWJlclwiPT10eXBlb2YgYS5sZW5ndGh9ZnVuY3Rpb24gcChhKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYX1mdW5jdGlvbiBnYShhKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgYX1mdW5jdGlvbiBoYShhKXtyZXR1cm5cImZ1bmN0aW9uXCI9PWRhKGEpfWZ1bmN0aW9uIGlhKGEpe3ZhciBiPXR5cGVvZiBhO3JldHVyblwib2JqZWN0XCI9PWImJm51bGwhPWF8fFwiZnVuY3Rpb25cIj09Yn1mdW5jdGlvbiBqYShhLGIsYyl7cmV0dXJuIGEuY2FsbC5hcHBseShhLmJpbmQsYXJndW1lbnRzKX1cbmZ1bmN0aW9uIGthKGEsYixjKXtpZighYSl0aHJvdyBFcnJvcigpO2lmKDI8YXJndW1lbnRzLmxlbmd0aCl7dmFyIGQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDIpO3JldHVybiBmdW5jdGlvbigpe3ZhciBjPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7QXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoYyxkKTtyZXR1cm4gYS5hcHBseShiLGMpfX1yZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYS5hcHBseShiLGFyZ3VtZW50cyl9fWZ1bmN0aW9uIHEoYSxiLGMpe3E9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQmJi0xIT1GdW5jdGlvbi5wcm90b3R5cGUuYmluZC50b1N0cmluZygpLmluZGV4T2YoXCJuYXRpdmUgY29kZVwiKT9qYTprYTtyZXR1cm4gcS5hcHBseShudWxsLGFyZ3VtZW50cyl9dmFyIGxhPURhdGUubm93fHxmdW5jdGlvbigpe3JldHVybituZXcgRGF0ZX07XG5mdW5jdGlvbiBtYShhLGIpe2Z1bmN0aW9uIGMoKXt9Yy5wcm90b3R5cGU9Yi5wcm90b3R5cGU7YS5aZz1iLnByb3RvdHlwZTthLnByb3RvdHlwZT1uZXcgYzthLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1hO2EuVmc9ZnVuY3Rpb24oYSxjLGYpe2Zvcih2YXIgZz1BcnJheShhcmd1bWVudHMubGVuZ3RoLTIpLGs9MjtrPGFyZ3VtZW50cy5sZW5ndGg7aysrKWdbay0yXT1hcmd1bWVudHNba107cmV0dXJuIGIucHJvdG90eXBlW2NdLmFwcGx5KGEsZyl9fTtmdW5jdGlvbiByKGEsYil7Zm9yKHZhciBjIGluIGEpYi5jYWxsKHZvaWQgMCxhW2NdLGMsYSl9ZnVuY3Rpb24gbmEoYSxiKXt2YXIgYz17fSxkO2ZvcihkIGluIGEpY1tkXT1iLmNhbGwodm9pZCAwLGFbZF0sZCxhKTtyZXR1cm4gY31mdW5jdGlvbiBvYShhLGIpe2Zvcih2YXIgYyBpbiBhKWlmKCFiLmNhbGwodm9pZCAwLGFbY10sYyxhKSlyZXR1cm4hMTtyZXR1cm4hMH1mdW5jdGlvbiBwYShhKXt2YXIgYj0wLGM7Zm9yKGMgaW4gYSliKys7cmV0dXJuIGJ9ZnVuY3Rpb24gcWEoYSl7Zm9yKHZhciBiIGluIGEpcmV0dXJuIGJ9ZnVuY3Rpb24gcmEoYSl7dmFyIGI9W10sYz0wLGQ7Zm9yKGQgaW4gYSliW2MrK109YVtkXTtyZXR1cm4gYn1mdW5jdGlvbiBzYShhKXt2YXIgYj1bXSxjPTAsZDtmb3IoZCBpbiBhKWJbYysrXT1kO3JldHVybiBifWZ1bmN0aW9uIHRhKGEsYil7Zm9yKHZhciBjIGluIGEpaWYoYVtjXT09YilyZXR1cm4hMDtyZXR1cm4hMX1cbmZ1bmN0aW9uIHVhKGEsYixjKXtmb3IodmFyIGQgaW4gYSlpZihiLmNhbGwoYyxhW2RdLGQsYSkpcmV0dXJuIGR9ZnVuY3Rpb24gdmEoYSxiKXt2YXIgYz11YShhLGIsdm9pZCAwKTtyZXR1cm4gYyYmYVtjXX1mdW5jdGlvbiB3YShhKXtmb3IodmFyIGIgaW4gYSlyZXR1cm4hMTtyZXR1cm4hMH1mdW5jdGlvbiB4YShhKXt2YXIgYj17fSxjO2ZvcihjIGluIGEpYltjXT1hW2NdO3JldHVybiBifXZhciB5YT1cImNvbnN0cnVjdG9yIGhhc093blByb3BlcnR5IGlzUHJvdG90eXBlT2YgcHJvcGVydHlJc0VudW1lcmFibGUgdG9Mb2NhbGVTdHJpbmcgdG9TdHJpbmcgdmFsdWVPZlwiLnNwbGl0KFwiIFwiKTtcbmZ1bmN0aW9uIHphKGEsYil7Zm9yKHZhciBjLGQsZT0xO2U8YXJndW1lbnRzLmxlbmd0aDtlKyspe2Q9YXJndW1lbnRzW2VdO2ZvcihjIGluIGQpYVtjXT1kW2NdO2Zvcih2YXIgZj0wO2Y8eWEubGVuZ3RoO2YrKyljPXlhW2ZdLE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkLGMpJiYoYVtjXT1kW2NdKX19O2Z1bmN0aW9uIEFhKGEpe2E9U3RyaW5nKGEpO2lmKC9eXFxzKiQvLnRlc3QoYSk/MDovXltcXF0sOnt9XFxzXFx1MjAyOFxcdTIwMjldKiQvLnRlc3QoYS5yZXBsYWNlKC9cXFxcW1wiXFxcXFxcL2JmbnJ0dV0vZyxcIkBcIikucmVwbGFjZSgvXCJbXlwiXFxcXFxcblxcclxcdTIwMjhcXHUyMDI5XFx4MDAtXFx4MDhcXHgwYS1cXHgxZl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2csXCJdXCIpLnJlcGxhY2UoLyg/Ol58OnwsKSg/OltcXHNcXHUyMDI4XFx1MjAyOV0qXFxbKSsvZyxcIlwiKSkpdHJ5e3JldHVybiBldmFsKFwiKFwiK2ErXCIpXCIpfWNhdGNoKGIpe310aHJvdyBFcnJvcihcIkludmFsaWQgSlNPTiBzdHJpbmc6IFwiK2EpO31mdW5jdGlvbiBCYSgpe3RoaXMuUGQ9dm9pZCAwfVxuZnVuY3Rpb24gQ2EoYSxiLGMpe3N3aXRjaCh0eXBlb2YgYil7Y2FzZSBcInN0cmluZ1wiOkRhKGIsYyk7YnJlYWs7Y2FzZSBcIm51bWJlclwiOmMucHVzaChpc0Zpbml0ZShiKSYmIWlzTmFOKGIpP2I6XCJudWxsXCIpO2JyZWFrO2Nhc2UgXCJib29sZWFuXCI6Yy5wdXNoKGIpO2JyZWFrO2Nhc2UgXCJ1bmRlZmluZWRcIjpjLnB1c2goXCJudWxsXCIpO2JyZWFrO2Nhc2UgXCJvYmplY3RcIjppZihudWxsPT1iKXtjLnB1c2goXCJudWxsXCIpO2JyZWFrfWlmKGVhKGIpKXt2YXIgZD1iLmxlbmd0aDtjLnB1c2goXCJbXCIpO2Zvcih2YXIgZT1cIlwiLGY9MDtmPGQ7ZisrKWMucHVzaChlKSxlPWJbZl0sQ2EoYSxhLlBkP2EuUGQuY2FsbChiLFN0cmluZyhmKSxlKTplLGMpLGU9XCIsXCI7Yy5wdXNoKFwiXVwiKTticmVha31jLnB1c2goXCJ7XCIpO2Q9XCJcIjtmb3IoZiBpbiBiKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLGYpJiYoZT1iW2ZdLFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJihjLnB1c2goZCksRGEoZixjKSxcbmMucHVzaChcIjpcIiksQ2EoYSxhLlBkP2EuUGQuY2FsbChiLGYsZSk6ZSxjKSxkPVwiLFwiKSk7Yy5wdXNoKFwifVwiKTticmVhaztjYXNlIFwiZnVuY3Rpb25cIjpicmVhaztkZWZhdWx0OnRocm93IEVycm9yKFwiVW5rbm93biB0eXBlOiBcIit0eXBlb2YgYik7fX12YXIgRWE9eydcIic6J1xcXFxcIicsXCJcXFxcXCI6XCJcXFxcXFxcXFwiLFwiL1wiOlwiXFxcXC9cIixcIlxcYlwiOlwiXFxcXGJcIixcIlxcZlwiOlwiXFxcXGZcIixcIlxcblwiOlwiXFxcXG5cIixcIlxcclwiOlwiXFxcXHJcIixcIlxcdFwiOlwiXFxcXHRcIixcIlxceDBCXCI6XCJcXFxcdTAwMGJcIn0sRmE9L1xcdWZmZmYvLnRlc3QoXCJcXHVmZmZmXCIpPy9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxcdWZmZmZdL2c6L1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx4ZmZdL2c7XG5mdW5jdGlvbiBEYShhLGIpe2IucHVzaCgnXCInLGEucmVwbGFjZShGYSxmdW5jdGlvbihhKXtpZihhIGluIEVhKXJldHVybiBFYVthXTt2YXIgYj1hLmNoYXJDb2RlQXQoMCksZT1cIlxcXFx1XCI7MTY+Yj9lKz1cIjAwMFwiOjI1Nj5iP2UrPVwiMDBcIjo0MDk2PmImJihlKz1cIjBcIik7cmV0dXJuIEVhW2FdPWUrYi50b1N0cmluZygxNil9KSwnXCInKX07ZnVuY3Rpb24gR2EoKXtyZXR1cm4gTWF0aC5mbG9vcigyMTQ3NDgzNjQ4Kk1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKDM2KStNYXRoLmFicyhNYXRoLmZsb29yKDIxNDc0ODM2NDgqTWF0aC5yYW5kb20oKSlebGEoKSkudG9TdHJpbmcoMzYpfTt2YXIgSGE7YTp7dmFyIElhPWFhLm5hdmlnYXRvcjtpZihJYSl7dmFyIEphPUlhLnVzZXJBZ2VudDtpZihKYSl7SGE9SmE7YnJlYWsgYX19SGE9XCJcIn07ZnVuY3Rpb24gS2EoKXt0aGlzLldhPS0xfTtmdW5jdGlvbiBMYSgpe3RoaXMuV2E9LTE7dGhpcy5XYT02NDt0aGlzLlI9W107dGhpcy5sZT1bXTt0aGlzLlRmPVtdO3RoaXMuSWQ9W107dGhpcy5JZFswXT0xMjg7Zm9yKHZhciBhPTE7YTx0aGlzLldhOysrYSl0aGlzLklkW2FdPTA7dGhpcy5iZT10aGlzLiRiPTA7dGhpcy5yZXNldCgpfW1hKExhLEthKTtMYS5wcm90b3R5cGUucmVzZXQ9ZnVuY3Rpb24oKXt0aGlzLlJbMF09MTczMjU4NDE5Mzt0aGlzLlJbMV09NDAyMzIzMzQxNzt0aGlzLlJbMl09MjU2MjM4MzEwMjt0aGlzLlJbM109MjcxNzMzODc4O3RoaXMuUls0XT0zMjg1Mzc3NTIwO3RoaXMuYmU9dGhpcy4kYj0wfTtcbmZ1bmN0aW9uIE1hKGEsYixjKXtjfHwoYz0wKTt2YXIgZD1hLlRmO2lmKHAoYikpZm9yKHZhciBlPTA7MTY+ZTtlKyspZFtlXT1iLmNoYXJDb2RlQXQoYyk8PDI0fGIuY2hhckNvZGVBdChjKzEpPDwxNnxiLmNoYXJDb2RlQXQoYysyKTw8OHxiLmNoYXJDb2RlQXQoYyszKSxjKz00O2Vsc2UgZm9yKGU9MDsxNj5lO2UrKylkW2VdPWJbY108PDI0fGJbYysxXTw8MTZ8YltjKzJdPDw4fGJbYyszXSxjKz00O2ZvcihlPTE2OzgwPmU7ZSsrKXt2YXIgZj1kW2UtM11eZFtlLThdXmRbZS0xNF1eZFtlLTE2XTtkW2VdPShmPDwxfGY+Pj4zMSkmNDI5NDk2NzI5NX1iPWEuUlswXTtjPWEuUlsxXTtmb3IodmFyIGc9YS5SWzJdLGs9YS5SWzNdLGw9YS5SWzRdLG0sZT0wOzgwPmU7ZSsrKTQwPmU/MjA+ZT8oZj1rXmMmKGdeayksbT0xNTE4NTAwMjQ5KTooZj1jXmdeayxtPTE4NTk3NzUzOTMpOjYwPmU/KGY9YyZnfGsmKGN8ZyksbT0yNDAwOTU5NzA4KTooZj1jXmdeayxtPTMzOTU0Njk3ODIpLGY9KGI8PFxuNXxiPj4+MjcpK2YrbCttK2RbZV0mNDI5NDk2NzI5NSxsPWssaz1nLGc9KGM8PDMwfGM+Pj4yKSY0Mjk0OTY3Mjk1LGM9YixiPWY7YS5SWzBdPWEuUlswXStiJjQyOTQ5NjcyOTU7YS5SWzFdPWEuUlsxXStjJjQyOTQ5NjcyOTU7YS5SWzJdPWEuUlsyXStnJjQyOTQ5NjcyOTU7YS5SWzNdPWEuUlszXStrJjQyOTQ5NjcyOTU7YS5SWzRdPWEuUls0XStsJjQyOTQ5NjcyOTV9XG5MYS5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKGEsYil7aWYobnVsbCE9YSl7bihiKXx8KGI9YS5sZW5ndGgpO2Zvcih2YXIgYz1iLXRoaXMuV2EsZD0wLGU9dGhpcy5sZSxmPXRoaXMuJGI7ZDxiOyl7aWYoMD09Zilmb3IoO2Q8PWM7KU1hKHRoaXMsYSxkKSxkKz10aGlzLldhO2lmKHAoYSkpZm9yKDtkPGI7KXtpZihlW2ZdPWEuY2hhckNvZGVBdChkKSwrK2YsKytkLGY9PXRoaXMuV2Epe01hKHRoaXMsZSk7Zj0wO2JyZWFrfX1lbHNlIGZvcig7ZDxiOylpZihlW2ZdPWFbZF0sKytmLCsrZCxmPT10aGlzLldhKXtNYSh0aGlzLGUpO2Y9MDticmVha319dGhpcy4kYj1mO3RoaXMuYmUrPWJ9fTt2YXIgdD1BcnJheS5wcm90b3R5cGUsTmE9dC5pbmRleE9mP2Z1bmN0aW9uKGEsYixjKXtyZXR1cm4gdC5pbmRleE9mLmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Yz1udWxsPT1jPzA6MD5jP01hdGgubWF4KDAsYS5sZW5ndGgrYyk6YztpZihwKGEpKXJldHVybiBwKGIpJiYxPT1iLmxlbmd0aD9hLmluZGV4T2YoYixjKTotMTtmb3IoO2M8YS5sZW5ndGg7YysrKWlmKGMgaW4gYSYmYVtjXT09PWIpcmV0dXJuIGM7cmV0dXJuLTF9LE9hPXQuZm9yRWFjaD9mdW5jdGlvbihhLGIsYyl7dC5mb3JFYWNoLmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9cChhKT9hLnNwbGl0KFwiXCIpOmEsZj0wO2Y8ZDtmKyspZiBpbiBlJiZiLmNhbGwoYyxlW2ZdLGYsYSl9LFBhPXQuZmlsdGVyP2Z1bmN0aW9uKGEsYixjKXtyZXR1cm4gdC5maWx0ZXIuY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1bXSxmPTAsZz1wKGEpP1xuYS5zcGxpdChcIlwiKTphLGs9MDtrPGQ7aysrKWlmKGsgaW4gZyl7dmFyIGw9Z1trXTtiLmNhbGwoYyxsLGssYSkmJihlW2YrK109bCl9cmV0dXJuIGV9LFFhPXQubWFwP2Z1bmN0aW9uKGEsYixjKXtyZXR1cm4gdC5tYXAuY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1BcnJheShkKSxmPXAoYSk/YS5zcGxpdChcIlwiKTphLGc9MDtnPGQ7ZysrKWcgaW4gZiYmKGVbZ109Yi5jYWxsKGMsZltnXSxnLGEpKTtyZXR1cm4gZX0sUmE9dC5yZWR1Y2U/ZnVuY3Rpb24oYSxiLGMsZCl7Zm9yKHZhciBlPVtdLGY9MSxnPWFyZ3VtZW50cy5sZW5ndGg7ZjxnO2YrKyllLnB1c2goYXJndW1lbnRzW2ZdKTtkJiYoZVswXT1xKGIsZCkpO3JldHVybiB0LnJlZHVjZS5hcHBseShhLGUpfTpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1jO09hKGEsZnVuY3Rpb24oYyxnKXtlPWIuY2FsbChkLGUsYyxnLGEpfSk7cmV0dXJuIGV9LFNhPXQuZXZlcnk/ZnVuY3Rpb24oYSxiLFxuYyl7cmV0dXJuIHQuZXZlcnkuY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1wKGEpP2Euc3BsaXQoXCJcIik6YSxmPTA7ZjxkO2YrKylpZihmIGluIGUmJiFiLmNhbGwoYyxlW2ZdLGYsYSkpcmV0dXJuITE7cmV0dXJuITB9O2Z1bmN0aW9uIFRhKGEsYil7dmFyIGM9VWEoYSxiLHZvaWQgMCk7cmV0dXJuIDA+Yz9udWxsOnAoYSk/YS5jaGFyQXQoYyk6YVtjXX1mdW5jdGlvbiBVYShhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9cChhKT9hLnNwbGl0KFwiXCIpOmEsZj0wO2Y8ZDtmKyspaWYoZiBpbiBlJiZiLmNhbGwoYyxlW2ZdLGYsYSkpcmV0dXJuIGY7cmV0dXJuLTF9ZnVuY3Rpb24gVmEoYSxiKXt2YXIgYz1OYShhLGIpOzA8PWMmJnQuc3BsaWNlLmNhbGwoYSxjLDEpfWZ1bmN0aW9uIFdhKGEsYixjKXtyZXR1cm4gMj49YXJndW1lbnRzLmxlbmd0aD90LnNsaWNlLmNhbGwoYSxiKTp0LnNsaWNlLmNhbGwoYSxiLGMpfVxuZnVuY3Rpb24gWGEoYSxiKXthLnNvcnQoYnx8WWEpfWZ1bmN0aW9uIFlhKGEsYil7cmV0dXJuIGE+Yj8xOmE8Yj8tMTowfTt2YXIgWmE9LTEhPUhhLmluZGV4T2YoXCJPcGVyYVwiKXx8LTEhPUhhLmluZGV4T2YoXCJPUFJcIiksJGE9LTEhPUhhLmluZGV4T2YoXCJUcmlkZW50XCIpfHwtMSE9SGEuaW5kZXhPZihcIk1TSUVcIiksYWI9LTEhPUhhLmluZGV4T2YoXCJHZWNrb1wiKSYmLTE9PUhhLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIndlYmtpdFwiKSYmISgtMSE9SGEuaW5kZXhPZihcIlRyaWRlbnRcIil8fC0xIT1IYS5pbmRleE9mKFwiTVNJRVwiKSksYmI9LTEhPUhhLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcIndlYmtpdFwiKTtcbihmdW5jdGlvbigpe3ZhciBhPVwiXCIsYjtpZihaYSYmYWEub3BlcmEpcmV0dXJuIGE9YWEub3BlcmEudmVyc2lvbixoYShhKT9hKCk6YTthYj9iPS9ydlxcOihbXlxcKTtdKykoXFwpfDspLzokYT9iPS9cXGIoPzpNU0lFfHJ2KVs6IF0oW15cXCk7XSspKFxcKXw7KS86YmImJihiPS9XZWJLaXRcXC8oXFxTKykvKTtiJiYoYT0oYT1iLmV4ZWMoSGEpKT9hWzFdOlwiXCIpO3JldHVybiAkYSYmKGI9KGI9YWEuZG9jdW1lbnQpP2IuZG9jdW1lbnRNb2RlOnZvaWQgMCxiPnBhcnNlRmxvYXQoYSkpP1N0cmluZyhiKTphfSkoKTt2YXIgY2I9bnVsbCxkYj1udWxsLGViPW51bGw7ZnVuY3Rpb24gZmIoYSxiKXtpZighZmEoYSkpdGhyb3cgRXJyb3IoXCJlbmNvZGVCeXRlQXJyYXkgdGFrZXMgYW4gYXJyYXkgYXMgYSBwYXJhbWV0ZXJcIik7Z2IoKTtmb3IodmFyIGM9Yj9kYjpjYixkPVtdLGU9MDtlPGEubGVuZ3RoO2UrPTMpe3ZhciBmPWFbZV0sZz1lKzE8YS5sZW5ndGgsaz1nP2FbZSsxXTowLGw9ZSsyPGEubGVuZ3RoLG09bD9hW2UrMl06MCx2PWY+PjIsZj0oZiYzKTw8NHxrPj40LGs9KGsmMTUpPDwyfG0+PjYsbT1tJjYzO2x8fChtPTY0LGd8fChrPTY0KSk7ZC5wdXNoKGNbdl0sY1tmXSxjW2tdLGNbbV0pfXJldHVybiBkLmpvaW4oXCJcIil9XG5mdW5jdGlvbiBnYigpe2lmKCFjYil7Y2I9e307ZGI9e307ZWI9e307Zm9yKHZhciBhPTA7NjU+YTthKyspY2JbYV09XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiLmNoYXJBdChhKSxkYlthXT1cIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5LV8uXCIuY2hhckF0KGEpLGViW2RiW2FdXT1hLDYyPD1hJiYoZWJbXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiLmNoYXJBdChhKV09YSl9fTtmdW5jdGlvbiB1KGEsYil7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLGIpfWZ1bmN0aW9uIHcoYSxiKXtpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSxiKSlyZXR1cm4gYVtiXX1mdW5jdGlvbiBoYihhLGIpe2Zvcih2YXIgYyBpbiBhKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLGMpJiZiKGMsYVtjXSl9ZnVuY3Rpb24gaWIoYSl7dmFyIGI9e307aGIoYSxmdW5jdGlvbihhLGQpe2JbYV09ZH0pO3JldHVybiBifTtmdW5jdGlvbiBqYihhKXt2YXIgYj1bXTtoYihhLGZ1bmN0aW9uKGEsZCl7ZWEoZCk/T2EoZCxmdW5jdGlvbihkKXtiLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGEpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudChkKSl9KTpiLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGEpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudChkKSl9KTtyZXR1cm4gYi5sZW5ndGg/XCImXCIrYi5qb2luKFwiJlwiKTpcIlwifWZ1bmN0aW9uIGtiKGEpe3ZhciBiPXt9O2E9YS5yZXBsYWNlKC9eXFw/LyxcIlwiKS5zcGxpdChcIiZcIik7T2EoYSxmdW5jdGlvbihhKXthJiYoYT1hLnNwbGl0KFwiPVwiKSxiW2FbMF1dPWFbMV0pfSk7cmV0dXJuIGJ9O2Z1bmN0aW9uIHgoYSxiLGMsZCl7dmFyIGU7ZDxiP2U9XCJhdCBsZWFzdCBcIitiOmQ+YyYmKGU9MD09PWM/XCJub25lXCI6XCJubyBtb3JlIHRoYW4gXCIrYyk7aWYoZSl0aHJvdyBFcnJvcihhK1wiIGZhaWxlZDogV2FzIGNhbGxlZCB3aXRoIFwiK2QrKDE9PT1kP1wiIGFyZ3VtZW50LlwiOlwiIGFyZ3VtZW50cy5cIikrXCIgRXhwZWN0cyBcIitlK1wiLlwiKTt9ZnVuY3Rpb24geihhLGIsYyl7dmFyIGQ9XCJcIjtzd2l0Y2goYil7Y2FzZSAxOmQ9Yz9cImZpcnN0XCI6XCJGaXJzdFwiO2JyZWFrO2Nhc2UgMjpkPWM/XCJzZWNvbmRcIjpcIlNlY29uZFwiO2JyZWFrO2Nhc2UgMzpkPWM/XCJ0aGlyZFwiOlwiVGhpcmRcIjticmVhaztjYXNlIDQ6ZD1jP1wiZm91cnRoXCI6XCJGb3VydGhcIjticmVhaztkZWZhdWx0OnRocm93IEVycm9yKFwiZXJyb3JQcmVmaXggY2FsbGVkIHdpdGggYXJndW1lbnROdW1iZXIgPiA0LiAgTmVlZCB0byB1cGRhdGUgaXQ/XCIpO31yZXR1cm4gYT1hK1wiIGZhaWxlZDogXCIrKGQrXCIgYXJndW1lbnQgXCIpfVxuZnVuY3Rpb24gQShhLGIsYyxkKXtpZigoIWR8fG4oYykpJiYhaGEoYykpdGhyb3cgRXJyb3IoeihhLGIsZCkrXCJtdXN0IGJlIGEgdmFsaWQgZnVuY3Rpb24uXCIpO31mdW5jdGlvbiBsYihhLGIsYyl7aWYobihjKSYmKCFpYShjKXx8bnVsbD09PWMpKXRocm93IEVycm9yKHooYSxiLCEwKStcIm11c3QgYmUgYSB2YWxpZCBjb250ZXh0IG9iamVjdC5cIik7fTtmdW5jdGlvbiBtYihhKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIEpTT04mJm4oSlNPTi5wYXJzZSk/SlNPTi5wYXJzZShhKTpBYShhKX1mdW5jdGlvbiBCKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgSlNPTiYmbihKU09OLnN0cmluZ2lmeSkpYT1KU09OLnN0cmluZ2lmeShhKTtlbHNle3ZhciBiPVtdO0NhKG5ldyBCYSxhLGIpO2E9Yi5qb2luKFwiXCIpfXJldHVybiBhfTtmdW5jdGlvbiBuYigpe3RoaXMuU2Q9Q31uYi5wcm90b3R5cGUuaj1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5TZC5vYShhKX07bmIucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuU2QudG9TdHJpbmcoKX07ZnVuY3Rpb24gb2IoKXt9b2IucHJvdG90eXBlLnBmPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O29iLnByb3RvdHlwZS54ZT1mdW5jdGlvbigpe3JldHVybiBudWxsfTt2YXIgcGI9bmV3IG9iO2Z1bmN0aW9uIHFiKGEsYixjKXt0aGlzLlFmPWE7dGhpcy5LYT1iO3RoaXMuSGQ9Y31xYi5wcm90b3R5cGUucGY9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5LYS5EO2lmKHJiKGIsYSkpcmV0dXJuIGIuaigpLk0oYSk7Yj1udWxsIT10aGlzLkhkP25ldyBzYih0aGlzLkhkLCEwLCExKTp0aGlzLkthLnUoKTtyZXR1cm4gdGhpcy5RZi5YYShhLGIpfTtxYi5wcm90b3R5cGUueGU9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPW51bGwhPXRoaXMuSGQ/dGhpcy5IZDp0Yih0aGlzLkthKTthPXRoaXMuUWYubWUoZCxiLDEsYyxhKTtyZXR1cm4gMD09PWEubGVuZ3RoP251bGw6YVswXX07ZnVuY3Rpb24gdWIoKXt0aGlzLnRiPVtdfWZ1bmN0aW9uIHZiKGEsYil7Zm9yKHZhciBjPW51bGwsZD0wO2Q8Yi5sZW5ndGg7ZCsrKXt2YXIgZT1iW2RdLGY9ZS5ZYigpO251bGw9PT1jfHxmLlooYy5ZYigpKXx8KGEudGIucHVzaChjKSxjPW51bGwpO251bGw9PT1jJiYoYz1uZXcgd2IoZikpO2MuYWRkKGUpfWMmJmEudGIucHVzaChjKX1mdW5jdGlvbiB4YihhLGIsYyl7dmIoYSxjKTt5YihhLGZ1bmN0aW9uKGEpe3JldHVybiBhLlooYil9KX1mdW5jdGlvbiB6YihhLGIsYyl7dmIoYSxjKTt5YihhLGZ1bmN0aW9uKGEpe3JldHVybiBhLmNvbnRhaW5zKGIpfHxiLmNvbnRhaW5zKGEpfSl9XG5mdW5jdGlvbiB5YihhLGIpe2Zvcih2YXIgYz0hMCxkPTA7ZDxhLnRiLmxlbmd0aDtkKyspe3ZhciBlPWEudGJbZF07aWYoZSlpZihlPWUuWWIoKSxiKGUpKXtmb3IodmFyIGU9YS50YltkXSxmPTA7ZjxlLnNkLmxlbmd0aDtmKyspe3ZhciBnPWUuc2RbZl07aWYobnVsbCE9PWcpe2Uuc2RbZl09bnVsbDt2YXIgaz1nLlViKCk7QWImJkJiKFwiZXZlbnQ6IFwiK2cudG9TdHJpbmcoKSk7Q2Ioayl9fWEudGJbZF09bnVsbH1lbHNlIGM9ITF9YyYmKGEudGI9W10pfWZ1bmN0aW9uIHdiKGEpe3RoaXMucWE9YTt0aGlzLnNkPVtdfXdiLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24oYSl7dGhpcy5zZC5wdXNoKGEpfTt3Yi5wcm90b3R5cGUuWWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5xYX07ZnVuY3Rpb24gRChhLGIsYyxkKXt0aGlzLnR5cGU9YTt0aGlzLkphPWI7dGhpcy5ZYT1jO3RoaXMuSmU9ZDt0aGlzLk5kPXZvaWQgMH1mdW5jdGlvbiBEYihhKXtyZXR1cm4gbmV3IEQoRWIsYSl9dmFyIEViPVwidmFsdWVcIjtmdW5jdGlvbiBGYihhLGIsYyxkKXt0aGlzLnRlPWI7dGhpcy5XZD1jO3RoaXMuTmQ9ZDt0aGlzLnJkPWF9RmIucHJvdG90eXBlLlliPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5XZC5sYygpO3JldHVyblwidmFsdWVcIj09PXRoaXMucmQ/YS5wYXRoOmEucGFyZW50KCkucGF0aH07RmIucHJvdG90eXBlLnllPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmR9O0ZiLnByb3RvdHlwZS5VYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRlLlViKHRoaXMpfTtGYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ZYigpLnRvU3RyaW5nKCkrXCI6XCIrdGhpcy5yZCtcIjpcIitCKHRoaXMuV2QubGYoKSl9O2Z1bmN0aW9uIEdiKGEsYixjKXt0aGlzLnRlPWE7dGhpcy5lcnJvcj1iO3RoaXMucGF0aD1jfUdiLnByb3RvdHlwZS5ZYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdGh9O0diLnByb3RvdHlwZS55ZT1mdW5jdGlvbigpe3JldHVyblwiY2FuY2VsXCJ9O1xuR2IucHJvdG90eXBlLlViPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGUuVWIodGhpcyl9O0diLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdGgudG9TdHJpbmcoKStcIjpjYW5jZWxcIn07ZnVuY3Rpb24gc2IoYSxiLGMpe3RoaXMuQj1hO3RoaXMuJD1iO3RoaXMuVGI9Y31mdW5jdGlvbiBIYihhKXtyZXR1cm4gYS4kfWZ1bmN0aW9uIHJiKGEsYil7cmV0dXJuIGEuJCYmIWEuVGJ8fGEuQi5IYShiKX1zYi5wcm90b3R5cGUuaj1mdW5jdGlvbigpe3JldHVybiB0aGlzLkJ9O2Z1bmN0aW9uIEliKGEpe3RoaXMuZGc9YTt0aGlzLkFkPW51bGx9SWIucHJvdG90eXBlLmdldD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuZGcuZ2V0KCksYj14YShhKTtpZih0aGlzLkFkKWZvcih2YXIgYyBpbiB0aGlzLkFkKWJbY10tPXRoaXMuQWRbY107dGhpcy5BZD1hO3JldHVybiBifTtmdW5jdGlvbiBKYihhLGIpe3RoaXMuTWY9e307dGhpcy5ZZD1uZXcgSWIoYSk7dGhpcy5jYT1iO3ZhciBjPTFFNCsyRTQqTWF0aC5yYW5kb20oKTtzZXRUaW1lb3V0KHEodGhpcy5IZix0aGlzKSxNYXRoLmZsb29yKGMpKX1KYi5wcm90b3R5cGUuSGY9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLllkLmdldCgpLGI9e30sYz0hMSxkO2ZvcihkIGluIGEpMDxhW2RdJiZ1KHRoaXMuTWYsZCkmJihiW2RdPWFbZF0sYz0hMCk7YyYmdGhpcy5jYS5UZShiKTtzZXRUaW1lb3V0KHEodGhpcy5IZix0aGlzKSxNYXRoLmZsb29yKDZFNSpNYXRoLnJhbmRvbSgpKSl9O2Z1bmN0aW9uIEtiKCl7dGhpcy5EYz17fX1mdW5jdGlvbiBMYihhLGIsYyl7bihjKXx8KGM9MSk7dShhLkRjLGIpfHwoYS5EY1tiXT0wKTthLkRjW2JdKz1jfUtiLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKXtyZXR1cm4geGEodGhpcy5EYyl9O3ZhciBNYj17fSxOYj17fTtmdW5jdGlvbiBPYihhKXthPWEudG9TdHJpbmcoKTtNYlthXXx8KE1iW2FdPW5ldyBLYik7cmV0dXJuIE1iW2FdfWZ1bmN0aW9uIFBiKGEsYil7dmFyIGM9YS50b1N0cmluZygpO05iW2NdfHwoTmJbY109YigpKTtyZXR1cm4gTmJbY119O2Z1bmN0aW9uIEUoYSxiKXt0aGlzLm5hbWU9YTt0aGlzLlM9Yn1mdW5jdGlvbiBRYihhLGIpe3JldHVybiBuZXcgRShhLGIpfTtmdW5jdGlvbiBSYihhLGIpe3JldHVybiBTYihhLm5hbWUsYi5uYW1lKX1mdW5jdGlvbiBUYihhLGIpe3JldHVybiBTYihhLGIpfTtmdW5jdGlvbiBVYihhLGIsYyl7dGhpcy50eXBlPVZiO3RoaXMuc291cmNlPWE7dGhpcy5wYXRoPWI7dGhpcy5JYT1jfVViLnByb3RvdHlwZS5XYz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5wYXRoLmUoKT9uZXcgVWIodGhpcy5zb3VyY2UsRix0aGlzLklhLk0oYSkpOm5ldyBVYih0aGlzLnNvdXJjZSxHKHRoaXMucGF0aCksdGhpcy5JYSl9O1ViLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiT3BlcmF0aW9uKFwiK3RoaXMucGF0aCtcIjogXCIrdGhpcy5zb3VyY2UudG9TdHJpbmcoKStcIiBvdmVyd3JpdGU6IFwiK3RoaXMuSWEudG9TdHJpbmcoKStcIilcIn07ZnVuY3Rpb24gV2IoYSxiKXt0aGlzLnR5cGU9WGI7dGhpcy5zb3VyY2U9WWI7dGhpcy5wYXRoPWE7dGhpcy5WZT1ifVdiLnByb3RvdHlwZS5XYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdGguZSgpP3RoaXM6bmV3IFdiKEcodGhpcy5wYXRoKSx0aGlzLlZlKX07V2IucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJPcGVyYXRpb24oXCIrdGhpcy5wYXRoK1wiOiBcIit0aGlzLnNvdXJjZS50b1N0cmluZygpK1wiIGFjayB3cml0ZSByZXZlcnQ9XCIrdGhpcy5WZStcIilcIn07ZnVuY3Rpb24gWmIoYSxiKXt0aGlzLnR5cGU9JGI7dGhpcy5zb3VyY2U9YTt0aGlzLnBhdGg9Yn1aYi5wcm90b3R5cGUuV2M9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXRoLmUoKT9uZXcgWmIodGhpcy5zb3VyY2UsRik6bmV3IFpiKHRoaXMuc291cmNlLEcodGhpcy5wYXRoKSl9O1piLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiT3BlcmF0aW9uKFwiK3RoaXMucGF0aCtcIjogXCIrdGhpcy5zb3VyY2UudG9TdHJpbmcoKStcIiBsaXN0ZW5fY29tcGxldGUpXCJ9O2Z1bmN0aW9uIGFjKGEsYil7dGhpcy5MYT1hO3RoaXMueGE9Yj9iOmJjfWg9YWMucHJvdG90eXBlO2guTmE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGFjKHRoaXMuTGEsdGhpcy54YS5OYShhLGIsdGhpcy5MYSkuWChudWxsLG51bGwsITEsbnVsbCxudWxsKSl9O2gucmVtb3ZlPWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYWModGhpcy5MYSx0aGlzLnhhLnJlbW92ZShhLHRoaXMuTGEpLlgobnVsbCxudWxsLCExLG51bGwsbnVsbCkpfTtoLmdldD1mdW5jdGlvbihhKXtmb3IodmFyIGIsYz10aGlzLnhhOyFjLmUoKTspe2I9dGhpcy5MYShhLGMua2V5KTtpZigwPT09YilyZXR1cm4gYy52YWx1ZTswPmI/Yz1jLmxlZnQ6MDxiJiYoYz1jLnJpZ2h0KX1yZXR1cm4gbnVsbH07XG5mdW5jdGlvbiBjYyhhLGIpe2Zvcih2YXIgYyxkPWEueGEsZT1udWxsOyFkLmUoKTspe2M9YS5MYShiLGQua2V5KTtpZigwPT09Yyl7aWYoZC5sZWZ0LmUoKSlyZXR1cm4gZT9lLmtleTpudWxsO2ZvcihkPWQubGVmdDshZC5yaWdodC5lKCk7KWQ9ZC5yaWdodDtyZXR1cm4gZC5rZXl9MD5jP2Q9ZC5sZWZ0OjA8YyYmKGU9ZCxkPWQucmlnaHQpfXRocm93IEVycm9yKFwiQXR0ZW1wdGVkIHRvIGZpbmQgcHJlZGVjZXNzb3Iga2V5IGZvciBhIG5vbmV4aXN0ZW50IGtleS4gIFdoYXQgZ2l2ZXM/XCIpO31oLmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54YS5lKCl9O2guY291bnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54YS5jb3VudCgpfTtoLlJjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueGEuUmMoKX07aC5lYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnhhLmVjKCl9O2guaGE9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMueGEuaGEoYSl9O1xuaC5XYj1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IGRjKHRoaXMueGEsbnVsbCx0aGlzLkxhLCExLGEpfTtoLlhiPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBkYyh0aGlzLnhhLGEsdGhpcy5MYSwhMSxiKX07aC5aYj1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgZGModGhpcy54YSxhLHRoaXMuTGEsITAsYil9O2gucmY9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBkYyh0aGlzLnhhLG51bGwsdGhpcy5MYSwhMCxhKX07ZnVuY3Rpb24gZGMoYSxiLGMsZCxlKXt0aGlzLlJkPWV8fG51bGw7dGhpcy5FZT1kO3RoaXMuUGE9W107Zm9yKGU9MTshYS5lKCk7KWlmKGU9Yj9jKGEua2V5LGIpOjEsZCYmKGUqPS0xKSwwPmUpYT10aGlzLkVlP2EubGVmdDphLnJpZ2h0O2Vsc2UgaWYoMD09PWUpe3RoaXMuUGEucHVzaChhKTticmVha31lbHNlIHRoaXMuUGEucHVzaChhKSxhPXRoaXMuRWU/YS5yaWdodDphLmxlZnR9XG5mdW5jdGlvbiBIKGEpe2lmKDA9PT1hLlBhLmxlbmd0aClyZXR1cm4gbnVsbDt2YXIgYj1hLlBhLnBvcCgpLGM7Yz1hLlJkP2EuUmQoYi5rZXksYi52YWx1ZSk6e2tleTpiLmtleSx2YWx1ZTpiLnZhbHVlfTtpZihhLkVlKWZvcihiPWIubGVmdDshYi5lKCk7KWEuUGEucHVzaChiKSxiPWIucmlnaHQ7ZWxzZSBmb3IoYj1iLnJpZ2h0OyFiLmUoKTspYS5QYS5wdXNoKGIpLGI9Yi5sZWZ0O3JldHVybiBjfWZ1bmN0aW9uIGVjKGEpe2lmKDA9PT1hLlBhLmxlbmd0aClyZXR1cm4gbnVsbDt2YXIgYjtiPWEuUGE7Yj1iW2IubGVuZ3RoLTFdO3JldHVybiBhLlJkP2EuUmQoYi5rZXksYi52YWx1ZSk6e2tleTpiLmtleSx2YWx1ZTpiLnZhbHVlfX1mdW5jdGlvbiBmYyhhLGIsYyxkLGUpe3RoaXMua2V5PWE7dGhpcy52YWx1ZT1iO3RoaXMuY29sb3I9bnVsbCE9Yz9jOiEwO3RoaXMubGVmdD1udWxsIT1kP2Q6YmM7dGhpcy5yaWdodD1udWxsIT1lP2U6YmN9aD1mYy5wcm90b3R5cGU7XG5oLlg9ZnVuY3Rpb24oYSxiLGMsZCxlKXtyZXR1cm4gbmV3IGZjKG51bGwhPWE/YTp0aGlzLmtleSxudWxsIT1iP2I6dGhpcy52YWx1ZSxudWxsIT1jP2M6dGhpcy5jb2xvcixudWxsIT1kP2Q6dGhpcy5sZWZ0LG51bGwhPWU/ZTp0aGlzLnJpZ2h0KX07aC5jb3VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmxlZnQuY291bnQoKSsxK3RoaXMucmlnaHQuY291bnQoKX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guaGE9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMubGVmdC5oYShhKXx8YSh0aGlzLmtleSx0aGlzLnZhbHVlKXx8dGhpcy5yaWdodC5oYShhKX07ZnVuY3Rpb24gZ2MoYSl7cmV0dXJuIGEubGVmdC5lKCk/YTpnYyhhLmxlZnQpfWguUmM9ZnVuY3Rpb24oKXtyZXR1cm4gZ2ModGhpcykua2V5fTtoLmVjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmlnaHQuZSgpP3RoaXMua2V5OnRoaXMucmlnaHQuZWMoKX07XG5oLk5hPWZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlO2U9dGhpcztkPWMoYSxlLmtleSk7ZT0wPmQ/ZS5YKG51bGwsbnVsbCxudWxsLGUubGVmdC5OYShhLGIsYyksbnVsbCk6MD09PWQ/ZS5YKG51bGwsYixudWxsLG51bGwsbnVsbCk6ZS5YKG51bGwsbnVsbCxudWxsLG51bGwsZS5yaWdodC5OYShhLGIsYykpO3JldHVybiBoYyhlKX07ZnVuY3Rpb24gaWMoYSl7aWYoYS5sZWZ0LmUoKSlyZXR1cm4gYmM7YS5sZWZ0LmZhKCl8fGEubGVmdC5sZWZ0LmZhKCl8fChhPWpjKGEpKTthPWEuWChudWxsLG51bGwsbnVsbCxpYyhhLmxlZnQpLG51bGwpO3JldHVybiBoYyhhKX1cbmgucmVtb3ZlPWZ1bmN0aW9uKGEsYil7dmFyIGMsZDtjPXRoaXM7aWYoMD5iKGEsYy5rZXkpKWMubGVmdC5lKCl8fGMubGVmdC5mYSgpfHxjLmxlZnQubGVmdC5mYSgpfHwoYz1qYyhjKSksYz1jLlgobnVsbCxudWxsLG51bGwsYy5sZWZ0LnJlbW92ZShhLGIpLG51bGwpO2Vsc2V7Yy5sZWZ0LmZhKCkmJihjPWtjKGMpKTtjLnJpZ2h0LmUoKXx8Yy5yaWdodC5mYSgpfHxjLnJpZ2h0LmxlZnQuZmEoKXx8KGM9bGMoYyksYy5sZWZ0LmxlZnQuZmEoKSYmKGM9a2MoYyksYz1sYyhjKSkpO2lmKDA9PT1iKGEsYy5rZXkpKXtpZihjLnJpZ2h0LmUoKSlyZXR1cm4gYmM7ZD1nYyhjLnJpZ2h0KTtjPWMuWChkLmtleSxkLnZhbHVlLG51bGwsbnVsbCxpYyhjLnJpZ2h0KSl9Yz1jLlgobnVsbCxudWxsLG51bGwsbnVsbCxjLnJpZ2h0LnJlbW92ZShhLGIpKX1yZXR1cm4gaGMoYyl9O2guZmE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb2xvcn07XG5mdW5jdGlvbiBoYyhhKXthLnJpZ2h0LmZhKCkmJiFhLmxlZnQuZmEoKSYmKGE9bWMoYSkpO2EubGVmdC5mYSgpJiZhLmxlZnQubGVmdC5mYSgpJiYoYT1rYyhhKSk7YS5sZWZ0LmZhKCkmJmEucmlnaHQuZmEoKSYmKGE9bGMoYSkpO3JldHVybiBhfWZ1bmN0aW9uIGpjKGEpe2E9bGMoYSk7YS5yaWdodC5sZWZ0LmZhKCkmJihhPWEuWChudWxsLG51bGwsbnVsbCxudWxsLGtjKGEucmlnaHQpKSxhPW1jKGEpLGE9bGMoYSkpO3JldHVybiBhfWZ1bmN0aW9uIG1jKGEpe3JldHVybiBhLnJpZ2h0LlgobnVsbCxudWxsLGEuY29sb3IsYS5YKG51bGwsbnVsbCwhMCxudWxsLGEucmlnaHQubGVmdCksbnVsbCl9ZnVuY3Rpb24ga2MoYSl7cmV0dXJuIGEubGVmdC5YKG51bGwsbnVsbCxhLmNvbG9yLG51bGwsYS5YKG51bGwsbnVsbCwhMCxhLmxlZnQucmlnaHQsbnVsbCkpfVxuZnVuY3Rpb24gbGMoYSl7cmV0dXJuIGEuWChudWxsLG51bGwsIWEuY29sb3IsYS5sZWZ0LlgobnVsbCxudWxsLCFhLmxlZnQuY29sb3IsbnVsbCxudWxsKSxhLnJpZ2h0LlgobnVsbCxudWxsLCFhLnJpZ2h0LmNvbG9yLG51bGwsbnVsbCkpfWZ1bmN0aW9uIG5jKCl7fWg9bmMucHJvdG90eXBlO2guWD1mdW5jdGlvbigpe3JldHVybiB0aGlzfTtoLk5hPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBmYyhhLGIsbnVsbCl9O2gucmVtb3ZlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O2guY291bnQ9ZnVuY3Rpb24oKXtyZXR1cm4gMH07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuITB9O2guaGE9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5SYz1mdW5jdGlvbigpe3JldHVybiBudWxsfTtoLmVjPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O2guZmE9ZnVuY3Rpb24oKXtyZXR1cm4hMX07dmFyIGJjPW5ldyBuYztmdW5jdGlvbiBvYyhhLGIpe3JldHVybiBhJiZcIm9iamVjdFwiPT09dHlwZW9mIGE/KEooXCIuc3ZcImluIGEsXCJVbmV4cGVjdGVkIGxlYWYgbm9kZSBvciBwcmlvcml0eSBjb250ZW50c1wiKSxiW2FbXCIuc3ZcIl1dKTphfWZ1bmN0aW9uIHBjKGEsYil7dmFyIGM9bmV3IHFjO3JjKGEsbmV3IEsoXCJcIiksZnVuY3Rpb24oYSxlKXtjLm1jKGEsc2MoZSxiKSl9KTtyZXR1cm4gY31mdW5jdGlvbiBzYyhhLGIpe3ZhciBjPWEuQSgpLksoKSxjPW9jKGMsYiksZDtpZihhLk4oKSl7dmFyIGU9b2MoYS5CYSgpLGIpO3JldHVybiBlIT09YS5CYSgpfHxjIT09YS5BKCkuSygpP25ldyB0YyhlLEwoYykpOmF9ZD1hO2MhPT1hLkEoKS5LKCkmJihkPWQuZGEobmV3IHRjKGMpKSk7YS5VKE0sZnVuY3Rpb24oYSxjKXt2YXIgZT1zYyhjLGIpO2UhPT1jJiYoZD1kLlEoYSxlKSl9KTtyZXR1cm4gZH07ZnVuY3Rpb24gSyhhLGIpe2lmKDE9PWFyZ3VtZW50cy5sZW5ndGgpe3RoaXMubz1hLnNwbGl0KFwiL1wiKTtmb3IodmFyIGM9MCxkPTA7ZDx0aGlzLm8ubGVuZ3RoO2QrKykwPHRoaXMub1tkXS5sZW5ndGgmJih0aGlzLm9bY109dGhpcy5vW2RdLGMrKyk7dGhpcy5vLmxlbmd0aD1jO3RoaXMuWT0wfWVsc2UgdGhpcy5vPWEsdGhpcy5ZPWJ9ZnVuY3Rpb24gTihhLGIpe3ZhciBjPU8oYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7aWYoYz09PU8oYikpcmV0dXJuIE4oRyhhKSxHKGIpKTt0aHJvdyBFcnJvcihcIklOVEVSTkFMIEVSUk9SOiBpbm5lclBhdGggKFwiK2IrXCIpIGlzIG5vdCB3aXRoaW4gb3V0ZXJQYXRoIChcIithK1wiKVwiKTt9ZnVuY3Rpb24gTyhhKXtyZXR1cm4gYS5ZPj1hLm8ubGVuZ3RoP251bGw6YS5vW2EuWV19ZnVuY3Rpb24gdWMoYSl7cmV0dXJuIGEuby5sZW5ndGgtYS5ZfVxuZnVuY3Rpb24gRyhhKXt2YXIgYj1hLlk7YjxhLm8ubGVuZ3RoJiZiKys7cmV0dXJuIG5ldyBLKGEubyxiKX1mdW5jdGlvbiB2YyhhKXtyZXR1cm4gYS5ZPGEuby5sZW5ndGg/YS5vW2Euby5sZW5ndGgtMV06bnVsbH1oPUsucHJvdG90eXBlO2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtmb3IodmFyIGE9XCJcIixiPXRoaXMuWTtiPHRoaXMuby5sZW5ndGg7YisrKVwiXCIhPT10aGlzLm9bYl0mJihhKz1cIi9cIit0aGlzLm9bYl0pO3JldHVybiBhfHxcIi9cIn07aC5zbGljZT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5vLnNsaWNlKHRoaXMuWSsoYXx8MCkpfTtoLnBhcmVudD1mdW5jdGlvbigpe2lmKHRoaXMuWT49dGhpcy5vLmxlbmd0aClyZXR1cm4gbnVsbDtmb3IodmFyIGE9W10sYj10aGlzLlk7Yjx0aGlzLm8ubGVuZ3RoLTE7YisrKWEucHVzaCh0aGlzLm9bYl0pO3JldHVybiBuZXcgSyhhLDApfTtcbmgudz1mdW5jdGlvbihhKXtmb3IodmFyIGI9W10sYz10aGlzLlk7Yzx0aGlzLm8ubGVuZ3RoO2MrKyliLnB1c2godGhpcy5vW2NdKTtpZihhIGluc3RhbmNlb2YgSylmb3IoYz1hLlk7YzxhLm8ubGVuZ3RoO2MrKyliLnB1c2goYS5vW2NdKTtlbHNlIGZvcihhPWEuc3BsaXQoXCIvXCIpLGM9MDtjPGEubGVuZ3RoO2MrKykwPGFbY10ubGVuZ3RoJiZiLnB1c2goYVtjXSk7cmV0dXJuIG5ldyBLKGIsMCl9O2guZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLlk+PXRoaXMuby5sZW5ndGh9O2guWj1mdW5jdGlvbihhKXtpZih1Yyh0aGlzKSE9PXVjKGEpKXJldHVybiExO2Zvcih2YXIgYj10aGlzLlksYz1hLlk7Yjw9dGhpcy5vLmxlbmd0aDtiKyssYysrKWlmKHRoaXMub1tiXSE9PWEub1tjXSlyZXR1cm4hMTtyZXR1cm4hMH07XG5oLmNvbnRhaW5zPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuWSxjPWEuWTtpZih1Yyh0aGlzKT51YyhhKSlyZXR1cm4hMTtmb3IoO2I8dGhpcy5vLmxlbmd0aDspe2lmKHRoaXMub1tiXSE9PWEub1tjXSlyZXR1cm4hMTsrK2I7KytjfXJldHVybiEwfTt2YXIgRj1uZXcgSyhcIlwiKTtmdW5jdGlvbiB3YyhhLGIpe3RoaXMuUWE9YS5zbGljZSgpO3RoaXMuRWE9TWF0aC5tYXgoMSx0aGlzLlFhLmxlbmd0aCk7dGhpcy5rZj1iO2Zvcih2YXIgYz0wO2M8dGhpcy5RYS5sZW5ndGg7YysrKXRoaXMuRWErPXhjKHRoaXMuUWFbY10pO3ljKHRoaXMpfXdjLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGEpezA8dGhpcy5RYS5sZW5ndGgmJih0aGlzLkVhKz0xKTt0aGlzLlFhLnB1c2goYSk7dGhpcy5FYSs9eGMoYSk7eWModGhpcyl9O3djLnByb3RvdHlwZS5wb3A9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLlFhLnBvcCgpO3RoaXMuRWEtPXhjKGEpOzA8dGhpcy5RYS5sZW5ndGgmJi0tdGhpcy5FYX07XG5mdW5jdGlvbiB5YyhhKXtpZig3Njg8YS5FYSl0aHJvdyBFcnJvcihhLmtmK1wiaGFzIGEga2V5IHBhdGggbG9uZ2VyIHRoYW4gNzY4IGJ5dGVzIChcIithLkVhK1wiKS5cIik7aWYoMzI8YS5RYS5sZW5ndGgpdGhyb3cgRXJyb3IoYS5rZitcInBhdGggc3BlY2lmaWVkIGV4Y2VlZHMgdGhlIG1heGltdW0gZGVwdGggdGhhdCBjYW4gYmUgd3JpdHRlbiAoMzIpIG9yIG9iamVjdCBjb250YWlucyBhIGN5Y2xlIFwiK3pjKGEpKTt9ZnVuY3Rpb24gemMoYSl7cmV0dXJuIDA9PWEuUWEubGVuZ3RoP1wiXCI6XCJpbiBwcm9wZXJ0eSAnXCIrYS5RYS5qb2luKFwiLlwiKStcIidcIn07ZnVuY3Rpb24gQWMoKXt0aGlzLndjPXt9fUFjLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXtudWxsPT1iP2RlbGV0ZSB0aGlzLndjW2FdOnRoaXMud2NbYV09Yn07QWMucHJvdG90eXBlLmdldD1mdW5jdGlvbihhKXtyZXR1cm4gdSh0aGlzLndjLGEpP3RoaXMud2NbYV06bnVsbH07QWMucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihhKXtkZWxldGUgdGhpcy53Y1thXX07QWMucHJvdG90eXBlLnVmPSEwO2Z1bmN0aW9uIEJjKGEpe3RoaXMuRWM9YTt0aGlzLk1kPVwiZmlyZWJhc2U6XCJ9aD1CYy5wcm90b3R5cGU7aC5zZXQ9ZnVuY3Rpb24oYSxiKXtudWxsPT1iP3RoaXMuRWMucmVtb3ZlSXRlbSh0aGlzLk1kK2EpOnRoaXMuRWMuc2V0SXRlbSh0aGlzLk1kK2EsQihiKSl9O2guZ2V0PWZ1bmN0aW9uKGEpe2E9dGhpcy5FYy5nZXRJdGVtKHRoaXMuTWQrYSk7cmV0dXJuIG51bGw9PWE/bnVsbDptYihhKX07aC5yZW1vdmU9ZnVuY3Rpb24oYSl7dGhpcy5FYy5yZW1vdmVJdGVtKHRoaXMuTWQrYSl9O2gudWY9ITE7aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLkVjLnRvU3RyaW5nKCl9O2Z1bmN0aW9uIENjKGEpe3RyeXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3dbYV0pe3ZhciBiPXdpbmRvd1thXTtiLnNldEl0ZW0oXCJmaXJlYmFzZTpzZW50aW5lbFwiLFwiY2FjaGVcIik7Yi5yZW1vdmVJdGVtKFwiZmlyZWJhc2U6c2VudGluZWxcIik7cmV0dXJuIG5ldyBCYyhiKX19Y2F0Y2goYyl7fXJldHVybiBuZXcgQWN9dmFyIERjPUNjKFwibG9jYWxTdG9yYWdlXCIpLFA9Q2MoXCJzZXNzaW9uU3RvcmFnZVwiKTtmdW5jdGlvbiBFYyhhLGIsYyxkLGUpe3RoaXMuaG9zdD1hLnRvTG93ZXJDYXNlKCk7dGhpcy5kb21haW49dGhpcy5ob3N0LnN1YnN0cih0aGlzLmhvc3QuaW5kZXhPZihcIi5cIikrMSk7dGhpcy5sYj1iO3RoaXMuQ2I9Yzt0aGlzLlRnPWQ7dGhpcy5MZD1lfHxcIlwiO3RoaXMuT2E9RGMuZ2V0KFwiaG9zdDpcIithKXx8dGhpcy5ob3N0fWZ1bmN0aW9uIEZjKGEsYil7YiE9PWEuT2EmJihhLk9hPWIsXCJzLVwiPT09YS5PYS5zdWJzdHIoMCwyKSYmRGMuc2V0KFwiaG9zdDpcIithLmhvc3QsYS5PYSkpfUVjLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3ZhciBhPSh0aGlzLmxiP1wiaHR0cHM6Ly9cIjpcImh0dHA6Ly9cIikrdGhpcy5ob3N0O3RoaXMuTGQmJihhKz1cIjxcIit0aGlzLkxkK1wiPlwiKTtyZXR1cm4gYX07dmFyIEdjPWZ1bmN0aW9uKCl7dmFyIGE9MTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYSsrfX0oKTtmdW5jdGlvbiBKKGEsYil7aWYoIWEpdGhyb3cgSGMoYik7fWZ1bmN0aW9uIEhjKGEpe3JldHVybiBFcnJvcihcIkZpcmViYXNlICgyLjIuNCkgSU5URVJOQUwgQVNTRVJUIEZBSUxFRDogXCIrYSl9XG5mdW5jdGlvbiBJYyhhKXt0cnl7dmFyIGI7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBhdG9iKWI9YXRvYihhKTtlbHNle2diKCk7Zm9yKHZhciBjPWViLGQ9W10sZT0wO2U8YS5sZW5ndGg7KXt2YXIgZj1jW2EuY2hhckF0KGUrKyldLGc9ZTxhLmxlbmd0aD9jW2EuY2hhckF0KGUpXTowOysrZTt2YXIgaz1lPGEubGVuZ3RoP2NbYS5jaGFyQXQoZSldOjY0OysrZTt2YXIgbD1lPGEubGVuZ3RoP2NbYS5jaGFyQXQoZSldOjY0OysrZTtpZihudWxsPT1mfHxudWxsPT1nfHxudWxsPT1rfHxudWxsPT1sKXRocm93IEVycm9yKCk7ZC5wdXNoKGY8PDJ8Zz4+NCk7NjQhPWsmJihkLnB1c2goZzw8NCYyNDB8az4+MiksNjQhPWwmJmQucHVzaChrPDw2JjE5MnxsKSl9aWYoODE5Mj5kLmxlbmd0aCliPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxkKTtlbHNle2E9XCJcIjtmb3IoYz0wO2M8ZC5sZW5ndGg7Yys9ODE5MilhKz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsV2EoZCxjLFxuYys4MTkyKSk7Yj1hfX1yZXR1cm4gYn1jYXRjaChtKXtCYihcImJhc2U2NERlY29kZSBmYWlsZWQ6IFwiLG0pfXJldHVybiBudWxsfWZ1bmN0aW9uIEpjKGEpe3ZhciBiPUtjKGEpO2E9bmV3IExhO2EudXBkYXRlKGIpO3ZhciBiPVtdLGM9OCphLmJlOzU2PmEuJGI/YS51cGRhdGUoYS5JZCw1Ni1hLiRiKTphLnVwZGF0ZShhLklkLGEuV2EtKGEuJGItNTYpKTtmb3IodmFyIGQ9YS5XYS0xOzU2PD1kO2QtLSlhLmxlW2RdPWMmMjU1LGMvPTI1NjtNYShhLGEubGUpO2ZvcihkPWM9MDs1PmQ7ZCsrKWZvcih2YXIgZT0yNDswPD1lO2UtPTgpYltjXT1hLlJbZF0+PmUmMjU1LCsrYztyZXR1cm4gZmIoYil9XG5mdW5jdGlvbiBMYyhhKXtmb3IodmFyIGI9XCJcIixjPTA7Yzxhcmd1bWVudHMubGVuZ3RoO2MrKyliPWZhKGFyZ3VtZW50c1tjXSk/YitMYy5hcHBseShudWxsLGFyZ3VtZW50c1tjXSk6XCJvYmplY3RcIj09PXR5cGVvZiBhcmd1bWVudHNbY10/YitCKGFyZ3VtZW50c1tjXSk6Yithcmd1bWVudHNbY10sYis9XCIgXCI7cmV0dXJuIGJ9dmFyIEFiPW51bGwsTWM9ITA7ZnVuY3Rpb24gQmIoYSl7ITA9PT1NYyYmKE1jPSExLG51bGw9PT1BYiYmITA9PT1QLmdldChcImxvZ2dpbmdfZW5hYmxlZFwiKSYmTmMoITApKTtpZihBYil7dmFyIGI9TGMuYXBwbHkobnVsbCxhcmd1bWVudHMpO0FiKGIpfX1mdW5jdGlvbiBPYyhhKXtyZXR1cm4gZnVuY3Rpb24oKXtCYihhLGFyZ3VtZW50cyl9fVxuZnVuY3Rpb24gUGMoYSl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlKXt2YXIgYj1cIkZJUkVCQVNFIElOVEVSTkFMIEVSUk9SOiBcIitMYy5hcHBseShudWxsLGFyZ3VtZW50cyk7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlLmVycm9yP2NvbnNvbGUuZXJyb3IoYik6Y29uc29sZS5sb2coYil9fWZ1bmN0aW9uIFFjKGEpe3ZhciBiPUxjLmFwcGx5KG51bGwsYXJndW1lbnRzKTt0aHJvdyBFcnJvcihcIkZJUkVCQVNFIEZBVEFMIEVSUk9SOiBcIitiKTt9ZnVuY3Rpb24gUShhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUpe3ZhciBiPVwiRklSRUJBU0UgV0FSTklORzogXCIrTGMuYXBwbHkobnVsbCxhcmd1bWVudHMpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZS53YXJuP2NvbnNvbGUud2FybihiKTpjb25zb2xlLmxvZyhiKX19XG5mdW5jdGlvbiBSYyhhKXt2YXIgYj1cIlwiLGM9XCJcIixkPVwiXCIsZT1cIlwiLGY9ITAsZz1cImh0dHBzXCIsaz00NDM7aWYocChhKSl7dmFyIGw9YS5pbmRleE9mKFwiLy9cIik7MDw9bCYmKGc9YS5zdWJzdHJpbmcoMCxsLTEpLGE9YS5zdWJzdHJpbmcobCsyKSk7bD1hLmluZGV4T2YoXCIvXCIpOy0xPT09bCYmKGw9YS5sZW5ndGgpO2I9YS5zdWJzdHJpbmcoMCxsKTtlPVwiXCI7YT1hLnN1YnN0cmluZyhsKS5zcGxpdChcIi9cIik7Zm9yKGw9MDtsPGEubGVuZ3RoO2wrKylpZigwPGFbbF0ubGVuZ3RoKXt2YXIgbT1hW2xdO3RyeXttPWRlY29kZVVSSUNvbXBvbmVudChtLnJlcGxhY2UoL1xcKy9nLFwiIFwiKSl9Y2F0Y2godil7fWUrPVwiL1wiK219YT1iLnNwbGl0KFwiLlwiKTszPT09YS5sZW5ndGg/KGM9YVsxXSxkPWFbMF0udG9Mb3dlckNhc2UoKSk6Mj09PWEubGVuZ3RoJiYoYz1hWzBdKTtsPWIuaW5kZXhPZihcIjpcIik7MDw9bCYmKGY9XCJodHRwc1wiPT09Z3x8XCJ3c3NcIj09PWcsaz1iLnN1YnN0cmluZyhsKzEpLGlzRmluaXRlKGspJiZcbihrPVN0cmluZyhrKSksaz1wKGspPy9eXFxzKi0/MHgvaS50ZXN0KGspP3BhcnNlSW50KGssMTYpOnBhcnNlSW50KGssMTApOk5hTil9cmV0dXJue2hvc3Q6Yixwb3J0OmssZG9tYWluOmMsUWc6ZCxsYjpmLHNjaGVtZTpnLFpjOmV9fWZ1bmN0aW9uIFNjKGEpe3JldHVybiBnYShhKSYmKGEhPWF8fGE9PU51bWJlci5QT1NJVElWRV9JTkZJTklUWXx8YT09TnVtYmVyLk5FR0FUSVZFX0lORklOSVRZKX1cbmZ1bmN0aW9uIFRjKGEpe2lmKFwiY29tcGxldGVcIj09PWRvY3VtZW50LnJlYWR5U3RhdGUpYSgpO2Vsc2V7dmFyIGI9ITEsYz1mdW5jdGlvbigpe2RvY3VtZW50LmJvZHk/Ynx8KGI9ITAsYSgpKTpzZXRUaW1lb3V0KGMsTWF0aC5mbG9vcigxMCkpfTtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyPyhkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGMsITEpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLGMsITEpKTpkb2N1bWVudC5hdHRhY2hFdmVudCYmKGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsZnVuY3Rpb24oKXtcImNvbXBsZXRlXCI9PT1kb2N1bWVudC5yZWFkeVN0YXRlJiZjKCl9KSx3aW5kb3cuYXR0YWNoRXZlbnQoXCJvbmxvYWRcIixjKSl9fVxuZnVuY3Rpb24gU2IoYSxiKXtpZihhPT09YilyZXR1cm4gMDtpZihcIltNSU5fTkFNRV1cIj09PWF8fFwiW01BWF9OQU1FXVwiPT09YilyZXR1cm4tMTtpZihcIltNSU5fTkFNRV1cIj09PWJ8fFwiW01BWF9OQU1FXVwiPT09YSlyZXR1cm4gMTt2YXIgYz1VYyhhKSxkPVVjKGIpO3JldHVybiBudWxsIT09Yz9udWxsIT09ZD8wPT1jLWQ/YS5sZW5ndGgtYi5sZW5ndGg6Yy1kOi0xOm51bGwhPT1kPzE6YTxiPy0xOjF9ZnVuY3Rpb24gVmMoYSxiKXtpZihiJiZhIGluIGIpcmV0dXJuIGJbYV07dGhyb3cgRXJyb3IoXCJNaXNzaW5nIHJlcXVpcmVkIGtleSAoXCIrYStcIikgaW4gb2JqZWN0OiBcIitCKGIpKTt9XG5mdW5jdGlvbiBXYyhhKXtpZihcIm9iamVjdFwiIT09dHlwZW9mIGF8fG51bGw9PT1hKXJldHVybiBCKGEpO3ZhciBiPVtdLGM7Zm9yKGMgaW4gYSliLnB1c2goYyk7Yi5zb3J0KCk7Yz1cIntcIjtmb3IodmFyIGQ9MDtkPGIubGVuZ3RoO2QrKykwIT09ZCYmKGMrPVwiLFwiKSxjKz1CKGJbZF0pLGMrPVwiOlwiLGMrPVdjKGFbYltkXV0pO3JldHVybiBjK1wifVwifWZ1bmN0aW9uIFhjKGEsYil7aWYoYS5sZW5ndGg8PWIpcmV0dXJuW2FdO2Zvcih2YXIgYz1bXSxkPTA7ZDxhLmxlbmd0aDtkKz1iKWQrYj5hP2MucHVzaChhLnN1YnN0cmluZyhkLGEubGVuZ3RoKSk6Yy5wdXNoKGEuc3Vic3RyaW5nKGQsZCtiKSk7cmV0dXJuIGN9ZnVuY3Rpb24gWWMoYSxiKXtpZihlYShhKSlmb3IodmFyIGM9MDtjPGEubGVuZ3RoOysrYyliKGMsYVtjXSk7ZWxzZSByKGEsYil9XG5mdW5jdGlvbiBaYyhhKXtKKCFTYyhhKSxcIkludmFsaWQgSlNPTiBudW1iZXJcIik7dmFyIGIsYyxkLGU7MD09PWE/KGQ9Yz0wLGI9LUluZmluaXR5PT09MS9hPzE6MCk6KGI9MD5hLGE9TWF0aC5hYnMoYSksYT49TWF0aC5wb3coMiwtMTAyMik/KGQ9TWF0aC5taW4oTWF0aC5mbG9vcihNYXRoLmxvZyhhKS9NYXRoLkxOMiksMTAyMyksYz1kKzEwMjMsZD1NYXRoLnJvdW5kKGEqTWF0aC5wb3coMiw1Mi1kKS1NYXRoLnBvdygyLDUyKSkpOihjPTAsZD1NYXRoLnJvdW5kKGEvTWF0aC5wb3coMiwtMTA3NCkpKSk7ZT1bXTtmb3IoYT01MjthOy0tYSllLnB1c2goZCUyPzE6MCksZD1NYXRoLmZsb29yKGQvMik7Zm9yKGE9MTE7YTstLWEpZS5wdXNoKGMlMj8xOjApLGM9TWF0aC5mbG9vcihjLzIpO2UucHVzaChiPzE6MCk7ZS5yZXZlcnNlKCk7Yj1lLmpvaW4oXCJcIik7Yz1cIlwiO2ZvcihhPTA7NjQ+YTthKz04KWQ9cGFyc2VJbnQoYi5zdWJzdHIoYSw4KSwyKS50b1N0cmluZygxNiksMT09PWQubGVuZ3RoJiZcbihkPVwiMFwiK2QpLGMrPWQ7cmV0dXJuIGMudG9Mb3dlckNhc2UoKX12YXIgJGM9L14tP1xcZHsxLDEwfSQvO2Z1bmN0aW9uIFVjKGEpe3JldHVybiAkYy50ZXN0KGEpJiYoYT1OdW1iZXIoYSksLTIxNDc0ODM2NDg8PWEmJjIxNDc0ODM2NDc+PWEpP2E6bnVsbH1mdW5jdGlvbiBDYihhKXt0cnl7YSgpfWNhdGNoKGIpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXtRKFwiRXhjZXB0aW9uIHdhcyB0aHJvd24gYnkgdXNlciBjYWxsYmFjay5cIixiLnN0YWNrfHxcIlwiKTt0aHJvdyBiO30sTWF0aC5mbG9vcigwKSl9fWZ1bmN0aW9uIFIoYSxiKXtpZihoYShhKSl7dmFyIGM9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpLnNsaWNlKCk7Q2IoZnVuY3Rpb24oKXthLmFwcGx5KG51bGwsYyl9KX19O2Z1bmN0aW9uIEtjKGEpe2Zvcih2YXIgYj1bXSxjPTAsZD0wO2Q8YS5sZW5ndGg7ZCsrKXt2YXIgZT1hLmNoYXJDb2RlQXQoZCk7NTUyOTY8PWUmJjU2MzE5Pj1lJiYoZS09NTUyOTYsZCsrLEooZDxhLmxlbmd0aCxcIlN1cnJvZ2F0ZSBwYWlyIG1pc3NpbmcgdHJhaWwgc3Vycm9nYXRlLlwiKSxlPTY1NTM2KyhlPDwxMCkrKGEuY2hhckNvZGVBdChkKS01NjMyMCkpOzEyOD5lP2JbYysrXT1lOigyMDQ4PmU/YltjKytdPWU+PjZ8MTkyOig2NTUzNj5lP2JbYysrXT1lPj4xMnwyMjQ6KGJbYysrXT1lPj4xOHwyNDAsYltjKytdPWU+PjEyJjYzfDEyOCksYltjKytdPWU+PjYmNjN8MTI4KSxiW2MrK109ZSY2M3wxMjgpfXJldHVybiBifWZ1bmN0aW9uIHhjKGEpe2Zvcih2YXIgYj0wLGM9MDtjPGEubGVuZ3RoO2MrKyl7dmFyIGQ9YS5jaGFyQ29kZUF0KGMpOzEyOD5kP2IrKzoyMDQ4PmQ/Yis9Mjo1NTI5Njw9ZCYmNTYzMTk+PWQ/KGIrPTQsYysrKTpiKz0zfXJldHVybiBifTtmdW5jdGlvbiBhZChhKXt2YXIgYj17fSxjPXt9LGQ9e30sZT1cIlwiO3RyeXt2YXIgZj1hLnNwbGl0KFwiLlwiKSxiPW1iKEljKGZbMF0pfHxcIlwiKSxjPW1iKEljKGZbMV0pfHxcIlwiKSxlPWZbMl0sZD1jLmR8fHt9O2RlbGV0ZSBjLmR9Y2F0Y2goZyl7fXJldHVybntXZzpiLEFjOmMsZGF0YTpkLE5nOmV9fWZ1bmN0aW9uIGJkKGEpe2E9YWQoYSkuQWM7cmV0dXJuXCJvYmplY3RcIj09PXR5cGVvZiBhJiZhLmhhc093blByb3BlcnR5KFwiaWF0XCIpP3coYSxcImlhdFwiKTpudWxsfWZ1bmN0aW9uIGNkKGEpe2E9YWQoYSk7dmFyIGI9YS5BYztyZXR1cm4hIWEuTmcmJiEhYiYmXCJvYmplY3RcIj09PXR5cGVvZiBiJiZiLmhhc093blByb3BlcnR5KFwiaWF0XCIpfTtmdW5jdGlvbiBkZChhKXt0aGlzLlY9YTt0aGlzLmc9YS5uLmd9ZnVuY3Rpb24gZWQoYSxiLGMsZCl7dmFyIGU9W10sZj1bXTtPYShiLGZ1bmN0aW9uKGIpe1wiY2hpbGRfY2hhbmdlZFwiPT09Yi50eXBlJiZhLmcueGQoYi5KZSxiLkphKSYmZi5wdXNoKG5ldyBEKFwiY2hpbGRfbW92ZWRcIixiLkphLGIuWWEpKX0pO2ZkKGEsZSxcImNoaWxkX3JlbW92ZWRcIixiLGQsYyk7ZmQoYSxlLFwiY2hpbGRfYWRkZWRcIixiLGQsYyk7ZmQoYSxlLFwiY2hpbGRfbW92ZWRcIixmLGQsYyk7ZmQoYSxlLFwiY2hpbGRfY2hhbmdlZFwiLGIsZCxjKTtmZChhLGUsRWIsYixkLGMpO3JldHVybiBlfWZ1bmN0aW9uIGZkKGEsYixjLGQsZSxmKXtkPVBhKGQsZnVuY3Rpb24oYSl7cmV0dXJuIGEudHlwZT09PWN9KTtYYShkLHEoYS5lZyxhKSk7T2EoZCxmdW5jdGlvbihjKXt2YXIgZD1nZChhLGMsZik7T2EoZSxmdW5jdGlvbihlKXtlLkpmKGMudHlwZSkmJmIucHVzaChlLmNyZWF0ZUV2ZW50KGQsYS5WKSl9KX0pfVxuZnVuY3Rpb24gZ2QoYSxiLGMpe1widmFsdWVcIiE9PWIudHlwZSYmXCJjaGlsZF9yZW1vdmVkXCIhPT1iLnR5cGUmJihiLk5kPWMucWYoYi5ZYSxiLkphLGEuZykpO3JldHVybiBifWRkLnByb3RvdHlwZS5lZz1mdW5jdGlvbihhLGIpe2lmKG51bGw9PWEuWWF8fG51bGw9PWIuWWEpdGhyb3cgSGMoXCJTaG91bGQgb25seSBjb21wYXJlIGNoaWxkXyBldmVudHMuXCIpO3JldHVybiB0aGlzLmcuY29tcGFyZShuZXcgRShhLllhLGEuSmEpLG5ldyBFKGIuWWEsYi5KYSkpfTtmdW5jdGlvbiBoZCgpe3RoaXMuZWI9e319XG5mdW5jdGlvbiBpZChhLGIpe3ZhciBjPWIudHlwZSxkPWIuWWE7SihcImNoaWxkX2FkZGVkXCI9PWN8fFwiY2hpbGRfY2hhbmdlZFwiPT1jfHxcImNoaWxkX3JlbW92ZWRcIj09YyxcIk9ubHkgY2hpbGQgY2hhbmdlcyBzdXBwb3J0ZWQgZm9yIHRyYWNraW5nXCIpO0ooXCIucHJpb3JpdHlcIiE9PWQsXCJPbmx5IG5vbi1wcmlvcml0eSBjaGlsZCBjaGFuZ2VzIGNhbiBiZSB0cmFja2VkLlwiKTt2YXIgZT13KGEuZWIsZCk7aWYoZSl7dmFyIGY9ZS50eXBlO2lmKFwiY2hpbGRfYWRkZWRcIj09YyYmXCJjaGlsZF9yZW1vdmVkXCI9PWYpYS5lYltkXT1uZXcgRChcImNoaWxkX2NoYW5nZWRcIixiLkphLGQsZS5KYSk7ZWxzZSBpZihcImNoaWxkX3JlbW92ZWRcIj09YyYmXCJjaGlsZF9hZGRlZFwiPT1mKWRlbGV0ZSBhLmViW2RdO2Vsc2UgaWYoXCJjaGlsZF9yZW1vdmVkXCI9PWMmJlwiY2hpbGRfY2hhbmdlZFwiPT1mKWEuZWJbZF09bmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIsZS5KZSxkKTtlbHNlIGlmKFwiY2hpbGRfY2hhbmdlZFwiPT1jJiZcblwiY2hpbGRfYWRkZWRcIj09ZilhLmViW2RdPW5ldyBEKFwiY2hpbGRfYWRkZWRcIixiLkphLGQpO2Vsc2UgaWYoXCJjaGlsZF9jaGFuZ2VkXCI9PWMmJlwiY2hpbGRfY2hhbmdlZFwiPT1mKWEuZWJbZF09bmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsYi5KYSxkLGUuSmUpO2Vsc2UgdGhyb3cgSGMoXCJJbGxlZ2FsIGNvbWJpbmF0aW9uIG9mIGNoYW5nZXM6IFwiK2IrXCIgb2NjdXJyZWQgYWZ0ZXIgXCIrZSk7fWVsc2UgYS5lYltkXT1ifTtmdW5jdGlvbiBqZChhLGIsYyl7dGhpcy5QYj1hO3RoaXMucWI9Yjt0aGlzLnNiPWN8fG51bGx9aD1qZC5wcm90b3R5cGU7aC5KZj1mdW5jdGlvbihhKXtyZXR1cm5cInZhbHVlXCI9PT1hfTtoLmNyZWF0ZUV2ZW50PWZ1bmN0aW9uKGEsYil7dmFyIGM9Yi5uLmc7cmV0dXJuIG5ldyBGYihcInZhbHVlXCIsdGhpcyxuZXcgUyhhLkphLGIubGMoKSxjKSl9O2guVWI9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zYjtpZihcImNhbmNlbFwiPT09YS55ZSgpKXtKKHRoaXMucWIsXCJSYWlzaW5nIGEgY2FuY2VsIGV2ZW50IG9uIGEgbGlzdGVuZXIgd2l0aCBubyBjYW5jZWwgY2FsbGJhY2tcIik7dmFyIGM9dGhpcy5xYjtyZXR1cm4gZnVuY3Rpb24oKXtjLmNhbGwoYixhLmVycm9yKX19dmFyIGQ9dGhpcy5QYjtyZXR1cm4gZnVuY3Rpb24oKXtkLmNhbGwoYixhLldkKX19O2guZmY9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5xYj9uZXcgR2IodGhpcyxhLGIpOm51bGx9O1xuaC5tYXRjaGVzPWZ1bmN0aW9uKGEpe3JldHVybiBhIGluc3RhbmNlb2YgamQ/YS5QYiYmdGhpcy5QYj9hLlBiPT09dGhpcy5QYiYmYS5zYj09PXRoaXMuc2I6ITA6ITF9O2guc2Y9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PXRoaXMuUGJ9O2Z1bmN0aW9uIGtkKGEsYixjKXt0aGlzLmdhPWE7dGhpcy5xYj1iO3RoaXMuc2I9Y31oPWtkLnByb3RvdHlwZTtoLkpmPWZ1bmN0aW9uKGEpe2E9XCJjaGlsZHJlbl9hZGRlZFwiPT09YT9cImNoaWxkX2FkZGVkXCI6YTtyZXR1cm4oXCJjaGlsZHJlbl9yZW1vdmVkXCI9PT1hP1wiY2hpbGRfcmVtb3ZlZFwiOmEpaW4gdGhpcy5nYX07aC5mZj1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnFiP25ldyBHYih0aGlzLGEsYik6bnVsbH07XG5oLmNyZWF0ZUV2ZW50PWZ1bmN0aW9uKGEsYil7SihudWxsIT1hLllhLFwiQ2hpbGQgZXZlbnRzIHNob3VsZCBoYXZlIGEgY2hpbGROYW1lLlwiKTt2YXIgYz1iLmxjKCkudyhhLllhKTtyZXR1cm4gbmV3IEZiKGEudHlwZSx0aGlzLG5ldyBTKGEuSmEsYyxiLm4uZyksYS5OZCl9O2guVWI9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zYjtpZihcImNhbmNlbFwiPT09YS55ZSgpKXtKKHRoaXMucWIsXCJSYWlzaW5nIGEgY2FuY2VsIGV2ZW50IG9uIGEgbGlzdGVuZXIgd2l0aCBubyBjYW5jZWwgY2FsbGJhY2tcIik7dmFyIGM9dGhpcy5xYjtyZXR1cm4gZnVuY3Rpb24oKXtjLmNhbGwoYixhLmVycm9yKX19dmFyIGQ9dGhpcy5nYVthLnJkXTtyZXR1cm4gZnVuY3Rpb24oKXtkLmNhbGwoYixhLldkLGEuTmQpfX07XG5oLm1hdGNoZXM9ZnVuY3Rpb24oYSl7aWYoYSBpbnN0YW5jZW9mIGtkKXtpZighdGhpcy5nYXx8IWEuZ2EpcmV0dXJuITA7aWYodGhpcy5zYj09PWEuc2Ipe3ZhciBiPXBhKGEuZ2EpO2lmKGI9PT1wYSh0aGlzLmdhKSl7aWYoMT09PWIpe3ZhciBiPXFhKGEuZ2EpLGM9cWEodGhpcy5nYSk7cmV0dXJuIGM9PT1iJiYoIWEuZ2FbYl18fCF0aGlzLmdhW2NdfHxhLmdhW2JdPT09dGhpcy5nYVtjXSl9cmV0dXJuIG9hKHRoaXMuZ2EsZnVuY3Rpb24oYixjKXtyZXR1cm4gYS5nYVtjXT09PWJ9KX19fXJldHVybiExfTtoLnNmPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPT10aGlzLmdhfTtmdW5jdGlvbiBsZChhKXt0aGlzLmc9YX1oPWxkLnByb3RvdHlwZTtoLkc9ZnVuY3Rpb24oYSxiLGMsZCxlKXtKKGEuSWModGhpcy5nKSxcIkEgbm9kZSBtdXN0IGJlIGluZGV4ZWQgaWYgb25seSBhIGNoaWxkIGlzIHVwZGF0ZWRcIik7ZD1hLk0oYik7aWYoZC5aKGMpKXJldHVybiBhO251bGwhPWUmJihjLmUoKT9hLkhhKGIpP2lkKGUsbmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIsZCxiKSk6SihhLk4oKSxcIkEgY2hpbGQgcmVtb3ZlIHdpdGhvdXQgYW4gb2xkIGNoaWxkIG9ubHkgbWFrZXMgc2Vuc2Ugb24gYSBsZWFmIG5vZGVcIik6ZC5lKCk/aWQoZSxuZXcgRChcImNoaWxkX2FkZGVkXCIsYyxiKSk6aWQoZSxuZXcgRChcImNoaWxkX2NoYW5nZWRcIixjLGIsZCkpKTtyZXR1cm4gYS5OKCkmJmMuZSgpP2E6YS5RKGIsYykubWIodGhpcy5nKX07XG5oLnRhPWZ1bmN0aW9uKGEsYixjKXtudWxsIT1jJiYoYS5OKCl8fGEuVShNLGZ1bmN0aW9uKGEsZSl7Yi5IYShhKXx8aWQoYyxuZXcgRChcImNoaWxkX3JlbW92ZWRcIixlLGEpKX0pLGIuTigpfHxiLlUoTSxmdW5jdGlvbihiLGUpe2lmKGEuSGEoYikpe3ZhciBmPWEuTShiKTtmLlooZSl8fGlkKGMsbmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsZSxiLGYpKX1lbHNlIGlkKGMsbmV3IEQoXCJjaGlsZF9hZGRlZFwiLGUsYikpfSkpO3JldHVybiBiLm1iKHRoaXMuZyl9O2guZGE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5lKCk/QzphLmRhKGIpfTtoLkdhPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guVmI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307ZnVuY3Rpb24gbWQoYSl7dGhpcy5BZT1uZXcgbGQoYS5nKTt0aGlzLmc9YS5nO3ZhciBiO2EubGE/KGI9bmQoYSksYj1hLmcuT2Mob2QoYSksYikpOmI9YS5nLlNjKCk7dGhpcy5kZD1iO2EubmE/KGI9cGQoYSksYT1hLmcuT2MocWQoYSksYikpOmE9YS5nLlBjKCk7dGhpcy5GYz1hfWg9bWQucHJvdG90eXBlO2gubWF0Y2hlcz1mdW5jdGlvbihhKXtyZXR1cm4gMD49dGhpcy5nLmNvbXBhcmUodGhpcy5kZCxhKSYmMD49dGhpcy5nLmNvbXBhcmUoYSx0aGlzLkZjKX07aC5HPWZ1bmN0aW9uKGEsYixjLGQsZSl7dGhpcy5tYXRjaGVzKG5ldyBFKGIsYykpfHwoYz1DKTtyZXR1cm4gdGhpcy5BZS5HKGEsYixjLGQsZSl9O2gudGE9ZnVuY3Rpb24oYSxiLGMpe2IuTigpJiYoYj1DKTt2YXIgZD1iLm1iKHRoaXMuZyksZD1kLmRhKEMpLGU9dGhpcztiLlUoTSxmdW5jdGlvbihhLGIpe2UubWF0Y2hlcyhuZXcgRShhLGIpKXx8KGQ9ZC5RKGEsQykpfSk7cmV0dXJuIHRoaXMuQWUudGEoYSxkLGMpfTtcbmguZGE9ZnVuY3Rpb24oYSl7cmV0dXJuIGF9O2guR2E9ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC5WYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLkFlfTtmdW5jdGlvbiByZChhKXt0aGlzLnJhPW5ldyBtZChhKTt0aGlzLmc9YS5nO0ooYS5pYSxcIk9ubHkgdmFsaWQgaWYgbGltaXQgaGFzIGJlZW4gc2V0XCIpO3RoaXMuamE9YS5qYTt0aGlzLkpiPSFzZChhKX1oPXJkLnByb3RvdHlwZTtoLkc9ZnVuY3Rpb24oYSxiLGMsZCxlKXt0aGlzLnJhLm1hdGNoZXMobmV3IEUoYixjKSl8fChjPUMpO3JldHVybiBhLk0oYikuWihjKT9hOmEuRGIoKTx0aGlzLmphP3RoaXMucmEuVmIoKS5HKGEsYixjLGQsZSk6dGQodGhpcyxhLGIsYyxkLGUpfTtcbmgudGE9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkO2lmKGIuTigpfHxiLmUoKSlkPUMubWIodGhpcy5nKTtlbHNlIGlmKDIqdGhpcy5qYTxiLkRiKCkmJmIuSWModGhpcy5nKSl7ZD1DLm1iKHRoaXMuZyk7Yj10aGlzLkpiP2IuWmIodGhpcy5yYS5GYyx0aGlzLmcpOmIuWGIodGhpcy5yYS5kZCx0aGlzLmcpO2Zvcih2YXIgZT0wOzA8Yi5QYS5sZW5ndGgmJmU8dGhpcy5qYTspe3ZhciBmPUgoYiksZztpZihnPXRoaXMuSmI/MD49dGhpcy5nLmNvbXBhcmUodGhpcy5yYS5kZCxmKTowPj10aGlzLmcuY29tcGFyZShmLHRoaXMucmEuRmMpKWQ9ZC5RKGYubmFtZSxmLlMpLGUrKztlbHNlIGJyZWFrfX1lbHNle2Q9Yi5tYih0aGlzLmcpO2Q9ZC5kYShDKTt2YXIgayxsLG07aWYodGhpcy5KYil7Yj1kLnJmKHRoaXMuZyk7az10aGlzLnJhLkZjO2w9dGhpcy5yYS5kZDt2YXIgdj11ZCh0aGlzLmcpO209ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdihiLGEpfX1lbHNlIGI9ZC5XYih0aGlzLmcpLGs9dGhpcy5yYS5kZCxcbmw9dGhpcy5yYS5GYyxtPXVkKHRoaXMuZyk7Zm9yKHZhciBlPTAseT0hMTswPGIuUGEubGVuZ3RoOylmPUgoYiksIXkmJjA+PW0oayxmKSYmKHk9ITApLChnPXkmJmU8dGhpcy5qYSYmMD49bShmLGwpKT9lKys6ZD1kLlEoZi5uYW1lLEMpfXJldHVybiB0aGlzLnJhLlZiKCkudGEoYSxkLGMpfTtoLmRhPWZ1bmN0aW9uKGEpe3JldHVybiBhfTtoLkdhPWZ1bmN0aW9uKCl7cmV0dXJuITB9O2guVmI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yYS5WYigpfTtcbmZ1bmN0aW9uIHRkKGEsYixjLGQsZSxmKXt2YXIgZztpZihhLkpiKXt2YXIgaz11ZChhLmcpO2c9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gayhiLGEpfX1lbHNlIGc9dWQoYS5nKTtKKGIuRGIoKT09YS5qYSxcIlwiKTt2YXIgbD1uZXcgRShjLGQpLG09YS5KYj93ZChiLGEuZyk6eGQoYixhLmcpLHY9YS5yYS5tYXRjaGVzKGwpO2lmKGIuSGEoYykpe3ZhciB5PWIuTShjKSxtPWUueGUoYS5nLG0sYS5KYik7bnVsbCE9bSYmbS5uYW1lPT1jJiYobT1lLnhlKGEuZyxtLGEuSmIpKTtlPW51bGw9PW0/MTpnKG0sbCk7aWYodiYmIWQuZSgpJiYwPD1lKXJldHVybiBudWxsIT1mJiZpZChmLG5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGQsYyx5KSksYi5RKGMsZCk7bnVsbCE9ZiYmaWQoZixuZXcgRChcImNoaWxkX3JlbW92ZWRcIix5LGMpKTtiPWIuUShjLEMpO3JldHVybiBudWxsIT1tJiZhLnJhLm1hdGNoZXMobSk/KG51bGwhPWYmJmlkKGYsbmV3IEQoXCJjaGlsZF9hZGRlZFwiLG0uUyxtLm5hbWUpKSxiLlEobS5uYW1lLFxubS5TKSk6Yn1yZXR1cm4gZC5lKCk/Yjp2JiYwPD1nKG0sbCk/KG51bGwhPWYmJihpZChmLG5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLG0uUyxtLm5hbWUpKSxpZChmLG5ldyBEKFwiY2hpbGRfYWRkZWRcIixkLGMpKSksYi5RKGMsZCkuUShtLm5hbWUsQykpOmJ9O2Z1bmN0aW9uIHlkKGEsYil7dGhpcy5oZT1hO3RoaXMuY2c9Yn1mdW5jdGlvbiB6ZChhKXt0aGlzLkk9YX1cbnpkLnByb3RvdHlwZS5iYj1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1uZXcgaGQsZjtpZihiLnR5cGU9PT1WYiliLnNvdXJjZS52ZT9jPUFkKHRoaXMsYSxiLnBhdGgsYi5JYSxjLGQsZSk6KEooYi5zb3VyY2Uub2YsXCJVbmtub3duIHNvdXJjZS5cIiksZj1iLnNvdXJjZS5hZixjPUJkKHRoaXMsYSxiLnBhdGgsYi5JYSxjLGQsZixlKSk7ZWxzZSBpZihiLnR5cGU9PT1DZCliLnNvdXJjZS52ZT9jPURkKHRoaXMsYSxiLnBhdGgsYi5jaGlsZHJlbixjLGQsZSk6KEooYi5zb3VyY2Uub2YsXCJVbmtub3duIHNvdXJjZS5cIiksZj1iLnNvdXJjZS5hZixjPUVkKHRoaXMsYSxiLnBhdGgsYi5jaGlsZHJlbixjLGQsZixlKSk7ZWxzZSBpZihiLnR5cGU9PT1YYilpZihiLlZlKWlmKGY9Yi5wYXRoLG51bGwhPWMuc2MoZikpYz1hO2Vsc2V7Yj1uZXcgcWIoYyxhLGQpO2Q9YS5ELmooKTtpZihmLmUoKXx8XCIucHJpb3JpdHlcIj09PU8oZikpSGIoYS51KCkpP2I9Yy51YSh0YihhKSk6KGI9YS51KCkuaigpLFxuSihiIGluc3RhbmNlb2YgVCxcInNlcnZlckNoaWxkcmVuIHdvdWxkIGJlIGNvbXBsZXRlIGlmIGxlYWYgbm9kZVwiKSxiPWMueGMoYikpLGI9dGhpcy5JLnRhKGQsYixlKTtlbHNle2Y9TyhmKTt2YXIgZz1jLlhhKGYsYS51KCkpO251bGw9PWcmJnJiKGEudSgpLGYpJiYoZz1kLk0oZikpO2I9bnVsbCE9Zz90aGlzLkkuRyhkLGYsZyxiLGUpOmEuRC5qKCkuSGEoZik/dGhpcy5JLkcoZCxmLEMsYixlKTpkO2IuZSgpJiZIYihhLnUoKSkmJihkPWMudWEodGIoYSkpLGQuTigpJiYoYj10aGlzLkkudGEoYixkLGUpKSl9ZD1IYihhLnUoKSl8fG51bGwhPWMuc2MoRik7Yz1GZChhLGIsZCx0aGlzLkkuR2EoKSl9ZWxzZSBjPUdkKHRoaXMsYSxiLnBhdGgsYyxkLGUpO2Vsc2UgaWYoYi50eXBlPT09JGIpZD1iLnBhdGgsYj1hLnUoKSxmPWIuaigpLGc9Yi4kfHxkLmUoKSxjPUhkKHRoaXMsbmV3IElkKGEuRCxuZXcgc2IoZixnLGIuVGIpKSxkLGMscGIsZSk7ZWxzZSB0aHJvdyBIYyhcIlVua25vd24gb3BlcmF0aW9uIHR5cGU6IFwiK1xuYi50eXBlKTtlPXJhKGUuZWIpO2Q9YztiPWQuRDtiLiQmJihmPWIuaigpLk4oKXx8Yi5qKCkuZSgpLGc9SmQoYSksKDA8ZS5sZW5ndGh8fCFhLkQuJHx8ZiYmIWIuaigpLlooZyl8fCFiLmooKS5BKCkuWihnLkEoKSkpJiZlLnB1c2goRGIoSmQoZCkpKSk7cmV0dXJuIG5ldyB5ZChjLGUpfTtcbmZ1bmN0aW9uIEhkKGEsYixjLGQsZSxmKXt2YXIgZz1iLkQ7aWYobnVsbCE9ZC5zYyhjKSlyZXR1cm4gYjt2YXIgaztpZihjLmUoKSlKKEhiKGIudSgpKSxcIklmIGNoYW5nZSBwYXRoIGlzIGVtcHR5LCB3ZSBtdXN0IGhhdmUgY29tcGxldGUgc2VydmVyIGRhdGFcIiksYi51KCkuVGI/KGU9dGIoYiksZD1kLnhjKGUgaW5zdGFuY2VvZiBUP2U6QykpOmQ9ZC51YSh0YihiKSksZj1hLkkudGEoYi5ELmooKSxkLGYpO2Vsc2V7dmFyIGw9TyhjKTtpZihcIi5wcmlvcml0eVwiPT1sKUooMT09dWMoYyksXCJDYW4ndCBoYXZlIGEgcHJpb3JpdHkgd2l0aCBhZGRpdGlvbmFsIHBhdGggY29tcG9uZW50c1wiKSxmPWcuaigpLGs9Yi51KCkuaigpLGQ9ZC5oZChjLGYsayksZj1udWxsIT1kP2EuSS5kYShmLGQpOmcuaigpO2Vsc2V7dmFyIG09RyhjKTtyYihnLGwpPyhrPWIudSgpLmooKSxkPWQuaGQoYyxnLmooKSxrKSxkPW51bGwhPWQ/Zy5qKCkuTShsKS5HKG0sZCk6Zy5qKCkuTShsKSk6ZD1kLlhhKGwsYi51KCkpO1xuZj1udWxsIT1kP2EuSS5HKGcuaigpLGwsZCxlLGYpOmcuaigpfX1yZXR1cm4gRmQoYixmLGcuJHx8Yy5lKCksYS5JLkdhKCkpfWZ1bmN0aW9uIEJkKGEsYixjLGQsZSxmLGcsayl7dmFyIGw9Yi51KCk7Zz1nP2EuSTphLkkuVmIoKTtpZihjLmUoKSlkPWcudGEobC5qKCksZCxudWxsKTtlbHNlIGlmKGcuR2EoKSYmIWwuVGIpZD1sLmooKS5HKGMsZCksZD1nLnRhKGwuaigpLGQsbnVsbCk7ZWxzZXt2YXIgbT1PKGMpO2lmKChjLmUoKT8hbC4kfHxsLlRiOiFyYihsLE8oYykpKSYmMTx1YyhjKSlyZXR1cm4gYjtkPWwuaigpLk0obSkuRyhHKGMpLGQpO2Q9XCIucHJpb3JpdHlcIj09bT9nLmRhKGwuaigpLGQpOmcuRyhsLmooKSxtLGQscGIsbnVsbCl9bD1sLiR8fGMuZSgpO2I9bmV3IElkKGIuRCxuZXcgc2IoZCxsLGcuR2EoKSkpO3JldHVybiBIZChhLGIsYyxlLG5ldyBxYihlLGIsZiksayl9XG5mdW5jdGlvbiBBZChhLGIsYyxkLGUsZixnKXt2YXIgaz1iLkQ7ZT1uZXcgcWIoZSxiLGYpO2lmKGMuZSgpKWc9YS5JLnRhKGIuRC5qKCksZCxnKSxhPUZkKGIsZywhMCxhLkkuR2EoKSk7ZWxzZSBpZihmPU8oYyksXCIucHJpb3JpdHlcIj09PWYpZz1hLkkuZGEoYi5ELmooKSxkKSxhPUZkKGIsZyxrLiQsay5UYik7ZWxzZXt2YXIgbD1HKGMpO2M9ay5qKCkuTShmKTtpZighbC5lKCkpe3ZhciBtPWUucGYoZik7ZD1udWxsIT1tP1wiLnByaW9yaXR5XCI9PT12YyhsKSYmbS5vYShsLnBhcmVudCgpKS5lKCk/bTptLkcobCxkKTpDfWMuWihkKT9hPWI6KGc9YS5JLkcoay5qKCksZixkLGUsZyksYT1GZChiLGcsay4kLGEuSS5HYSgpKSl9cmV0dXJuIGF9XG5mdW5jdGlvbiBEZChhLGIsYyxkLGUsZixnKXt2YXIgaz1iO0tkKGQsZnVuY3Rpb24oZCxtKXt2YXIgdj1jLncoZCk7cmIoYi5ELE8odikpJiYoaz1BZChhLGssdixtLGUsZixnKSl9KTtLZChkLGZ1bmN0aW9uKGQsbSl7dmFyIHY9Yy53KGQpO3JiKGIuRCxPKHYpKXx8KGs9QWQoYSxrLHYsbSxlLGYsZykpfSk7cmV0dXJuIGt9ZnVuY3Rpb24gTGQoYSxiKXtLZChiLGZ1bmN0aW9uKGIsZCl7YT1hLkcoYixkKX0pO3JldHVybiBhfVxuZnVuY3Rpb24gRWQoYSxiLGMsZCxlLGYsZyxrKXtpZihiLnUoKS5qKCkuZSgpJiYhSGIoYi51KCkpKXJldHVybiBiO3ZhciBsPWI7Yz1jLmUoKT9kOk1kKE5kLGMsZCk7dmFyIG09Yi51KCkuaigpO2MuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYyxkKXtpZihtLkhhKGMpKXt2YXIgST1iLnUoKS5qKCkuTShjKSxJPUxkKEksZCk7bD1CZChhLGwsbmV3IEsoYyksSSxlLGYsZyxrKX19KTtjLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGMsZCl7dmFyIEk9IUhiKGIudSgpKSYmbnVsbD09ZC52YWx1ZTttLkhhKGMpfHxJfHwoST1iLnUoKS5qKCkuTShjKSxJPUxkKEksZCksbD1CZChhLGwsbmV3IEsoYyksSSxlLGYsZyxrKSl9KTtyZXR1cm4gbH1cbmZ1bmN0aW9uIEdkKGEsYixjLGQsZSxmKXtpZihudWxsIT1kLnNjKGMpKXJldHVybiBiO3ZhciBnPW5ldyBxYihkLGIsZSksaz1lPWIuRC5qKCk7aWYoSGIoYi51KCkpKXtpZihjLmUoKSllPWQudWEodGIoYikpLGs9YS5JLnRhKGIuRC5qKCksZSxmKTtlbHNlIGlmKFwiLnByaW9yaXR5XCI9PT1PKGMpKXt2YXIgbD1kLlhhKE8oYyksYi51KCkpO251bGw9PWx8fGUuZSgpfHxlLkEoKS5aKGwpfHwoaz1hLkkuZGEoZSxsKSl9ZWxzZSBsPU8oYyksZT1kLlhhKGwsYi51KCkpLG51bGwhPWUmJihrPWEuSS5HKGIuRC5qKCksbCxlLGcsZikpO2U9ITB9ZWxzZSBpZihiLkQuJHx8Yy5lKCkpaz1lLGU9Yi5ELmooKSxlLk4oKXx8ZS5VKE0sZnVuY3Rpb24oYyl7dmFyIGU9ZC5YYShjLGIudSgpKTtudWxsIT1lJiYoaz1hLkkuRyhrLGMsZSxnLGYpKX0pLGU9Yi5ELiQ7ZWxzZXtsPU8oYyk7aWYoMT09dWMoYyl8fHJiKGIuRCxsKSljPWQuWGEobCxiLnUoKSksbnVsbCE9YyYmKGs9YS5JLkcoZSxsLGMsXG5nLGYpKTtlPSExfXJldHVybiBGZChiLGssZSxhLkkuR2EoKSl9O2Z1bmN0aW9uIE9kKCl7fXZhciBQZD17fTtmdW5jdGlvbiB1ZChhKXtyZXR1cm4gcShhLmNvbXBhcmUsYSl9T2QucHJvdG90eXBlLnhkPWZ1bmN0aW9uKGEsYil7cmV0dXJuIDAhPT10aGlzLmNvbXBhcmUobmV3IEUoXCJbTUlOX05BTUVdXCIsYSksbmV3IEUoXCJbTUlOX05BTUVdXCIsYikpfTtPZC5wcm90b3R5cGUuU2M9ZnVuY3Rpb24oKXtyZXR1cm4gUWR9O2Z1bmN0aW9uIFJkKGEpe3RoaXMuYmM9YX1tYShSZCxPZCk7aD1SZC5wcm90b3R5cGU7aC5IYz1mdW5jdGlvbihhKXtyZXR1cm4hYS5NKHRoaXMuYmMpLmUoKX07aC5jb21wYXJlPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5TLk0odGhpcy5iYyksZD1iLlMuTSh0aGlzLmJjKSxjPWMuQ2MoZCk7cmV0dXJuIDA9PT1jP1NiKGEubmFtZSxiLm5hbWUpOmN9O2guT2M9ZnVuY3Rpb24oYSxiKXt2YXIgYz1MKGEpLGM9Qy5RKHRoaXMuYmMsYyk7cmV0dXJuIG5ldyBFKGIsYyl9O1xuaC5QYz1mdW5jdGlvbigpe3ZhciBhPUMuUSh0aGlzLmJjLFNkKTtyZXR1cm4gbmV3IEUoXCJbTUFYX05BTUVdXCIsYSl9O2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iY307ZnVuY3Rpb24gVGQoKXt9bWEoVGQsT2QpO2g9VGQucHJvdG90eXBlO2guY29tcGFyZT1mdW5jdGlvbihhLGIpe3ZhciBjPWEuUy5BKCksZD1iLlMuQSgpLGM9Yy5DYyhkKTtyZXR1cm4gMD09PWM/U2IoYS5uYW1lLGIubmFtZSk6Y307aC5IYz1mdW5jdGlvbihhKXtyZXR1cm4hYS5BKCkuZSgpfTtoLnhkPWZ1bmN0aW9uKGEsYil7cmV0dXJuIWEuQSgpLlooYi5BKCkpfTtoLlNjPWZ1bmN0aW9uKCl7cmV0dXJuIFFkfTtoLlBjPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBFKFwiW01BWF9OQU1FXVwiLG5ldyB0YyhcIltQUklPUklUWS1QT1NUXVwiLFNkKSl9O2guT2M9ZnVuY3Rpb24oYSxiKXt2YXIgYz1MKGEpO3JldHVybiBuZXcgRShiLG5ldyB0YyhcIltQUklPUklUWS1QT1NUXVwiLGMpKX07XG5oLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCIucHJpb3JpdHlcIn07dmFyIE09bmV3IFRkO2Z1bmN0aW9uIFVkKCl7fW1hKFVkLE9kKTtoPVVkLnByb3RvdHlwZTtoLmNvbXBhcmU9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gU2IoYS5uYW1lLGIubmFtZSl9O2guSGM9ZnVuY3Rpb24oKXt0aHJvdyBIYyhcIktleUluZGV4LmlzRGVmaW5lZE9uIG5vdCBleHBlY3RlZCB0byBiZSBjYWxsZWQuXCIpO307aC54ZD1mdW5jdGlvbigpe3JldHVybiExfTtoLlNjPWZ1bmN0aW9uKCl7cmV0dXJuIFFkfTtoLlBjPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBFKFwiW01BWF9OQU1FXVwiLEMpfTtoLk9jPWZ1bmN0aW9uKGEpe0oocChhKSxcIktleUluZGV4IGluZGV4VmFsdWUgbXVzdCBhbHdheXMgYmUgYSBzdHJpbmcuXCIpO3JldHVybiBuZXcgRShhLEMpfTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCIua2V5XCJ9O3ZhciBWZD1uZXcgVWQ7ZnVuY3Rpb24gV2QoKXt9bWEoV2QsT2QpO2g9V2QucHJvdG90eXBlO1xuaC5jb21wYXJlPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5TLkNjKGIuUyk7cmV0dXJuIDA9PT1jP1NiKGEubmFtZSxiLm5hbWUpOmN9O2guSGM9ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC54ZD1mdW5jdGlvbihhLGIpe3JldHVybiFhLlooYil9O2guU2M9ZnVuY3Rpb24oKXtyZXR1cm4gUWR9O2guUGM9ZnVuY3Rpb24oKXtyZXR1cm4gWGR9O2guT2M9ZnVuY3Rpb24oYSxiKXt2YXIgYz1MKGEpO3JldHVybiBuZXcgRShiLGMpfTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCIudmFsdWVcIn07dmFyIFlkPW5ldyBXZDtmdW5jdGlvbiBaZCgpe3RoaXMuUmI9dGhpcy5uYT10aGlzLkxiPXRoaXMubGE9dGhpcy5pYT0hMTt0aGlzLmphPTA7dGhpcy5OYj1cIlwiO3RoaXMuZGM9bnVsbDt0aGlzLnhiPVwiXCI7dGhpcy5hYz1udWxsO3RoaXMudmI9XCJcIjt0aGlzLmc9TX12YXIgJGQ9bmV3IFpkO2Z1bmN0aW9uIHNkKGEpe3JldHVyblwiXCI9PT1hLk5iP2EubGE6XCJsXCI9PT1hLk5ifWZ1bmN0aW9uIG9kKGEpe0ooYS5sYSxcIk9ubHkgdmFsaWQgaWYgc3RhcnQgaGFzIGJlZW4gc2V0XCIpO3JldHVybiBhLmRjfWZ1bmN0aW9uIG5kKGEpe0ooYS5sYSxcIk9ubHkgdmFsaWQgaWYgc3RhcnQgaGFzIGJlZW4gc2V0XCIpO3JldHVybiBhLkxiP2EueGI6XCJbTUlOX05BTUVdXCJ9ZnVuY3Rpb24gcWQoYSl7SihhLm5hLFwiT25seSB2YWxpZCBpZiBlbmQgaGFzIGJlZW4gc2V0XCIpO3JldHVybiBhLmFjfVxuZnVuY3Rpb24gcGQoYSl7SihhLm5hLFwiT25seSB2YWxpZCBpZiBlbmQgaGFzIGJlZW4gc2V0XCIpO3JldHVybiBhLlJiP2EudmI6XCJbTUFYX05BTUVdXCJ9ZnVuY3Rpb24gYWUoYSl7dmFyIGI9bmV3IFpkO2IuaWE9YS5pYTtiLmphPWEuamE7Yi5sYT1hLmxhO2IuZGM9YS5kYztiLkxiPWEuTGI7Yi54Yj1hLnhiO2IubmE9YS5uYTtiLmFjPWEuYWM7Yi5SYj1hLlJiO2IudmI9YS52YjtiLmc9YS5nO3JldHVybiBifWg9WmQucHJvdG90eXBlO2guR2U9ZnVuY3Rpb24oYSl7dmFyIGI9YWUodGhpcyk7Yi5pYT0hMDtiLmphPWE7Yi5OYj1cIlwiO3JldHVybiBifTtoLkhlPWZ1bmN0aW9uKGEpe3ZhciBiPWFlKHRoaXMpO2IuaWE9ITA7Yi5qYT1hO2IuTmI9XCJsXCI7cmV0dXJuIGJ9O2guSWU9ZnVuY3Rpb24oYSl7dmFyIGI9YWUodGhpcyk7Yi5pYT0hMDtiLmphPWE7Yi5OYj1cInJcIjtyZXR1cm4gYn07XG5oLlhkPWZ1bmN0aW9uKGEsYil7dmFyIGM9YWUodGhpcyk7Yy5sYT0hMDtuKGEpfHwoYT1udWxsKTtjLmRjPWE7bnVsbCE9Yj8oYy5MYj0hMCxjLnhiPWIpOihjLkxiPSExLGMueGI9XCJcIik7cmV0dXJuIGN9O2gucWQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hZSh0aGlzKTtjLm5hPSEwO24oYSl8fChhPW51bGwpO2MuYWM9YTtuKGIpPyhjLlJiPSEwLGMudmI9Yik6KGMuWWc9ITEsYy52Yj1cIlwiKTtyZXR1cm4gY307ZnVuY3Rpb24gYmUoYSxiKXt2YXIgYz1hZShhKTtjLmc9YjtyZXR1cm4gY31mdW5jdGlvbiBjZShhKXt2YXIgYj17fTthLmxhJiYoYi5zcD1hLmRjLGEuTGImJihiLnNuPWEueGIpKTthLm5hJiYoYi5lcD1hLmFjLGEuUmImJihiLmVuPWEudmIpKTtpZihhLmlhKXtiLmw9YS5qYTt2YXIgYz1hLk5iO1wiXCI9PT1jJiYoYz1zZChhKT9cImxcIjpcInJcIik7Yi52Zj1jfWEuZyE9PU0mJihiLmk9YS5nLnRvU3RyaW5nKCkpO3JldHVybiBifVxuZnVuY3Rpb24gZGUoYSl7cmV0dXJuIShhLmxhfHxhLm5hfHxhLmlhKX1mdW5jdGlvbiBlZShhKXt2YXIgYj17fTtpZihkZShhKSYmYS5nPT1NKXJldHVybiBiO3ZhciBjO2EuZz09PU0/Yz1cIiRwcmlvcml0eVwiOmEuZz09PVlkP2M9XCIkdmFsdWVcIjooSihhLmcgaW5zdGFuY2VvZiBSZCxcIlVucmVjb2duaXplZCBpbmRleCB0eXBlIVwiKSxjPWEuZy50b1N0cmluZygpKTtiLm9yZGVyQnk9QihjKTthLmxhJiYoYi5zdGFydEF0PUIoYS5kYyksYS5MYiYmKGIuc3RhcnRBdCs9XCIsXCIrQihhLnhiKSkpO2EubmEmJihiLmVuZEF0PUIoYS5hYyksYS5SYiYmKGIuZW5kQXQrPVwiLFwiK0IoYS52YikpKTthLmlhJiYoc2QoYSk/Yi5saW1pdFRvRmlyc3Q9YS5qYTpiLmxpbWl0VG9MYXN0PWEuamEpO3JldHVybiBifWgudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gQihjZSh0aGlzKSl9O2Z1bmN0aW9uIGZlKGEsYil7dGhpcy55ZD1hO3RoaXMuY2M9Yn1mZS5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGEpe3ZhciBiPXcodGhpcy55ZCxhKTtpZighYil0aHJvdyBFcnJvcihcIk5vIGluZGV4IGRlZmluZWQgZm9yIFwiK2EpO3JldHVybiBiPT09UGQ/bnVsbDpifTtmdW5jdGlvbiBnZShhLGIsYyl7dmFyIGQ9bmEoYS55ZCxmdW5jdGlvbihkLGYpe3ZhciBnPXcoYS5jYyxmKTtKKGcsXCJNaXNzaW5nIGluZGV4IGltcGxlbWVudGF0aW9uIGZvciBcIitmKTtpZihkPT09UGQpe2lmKGcuSGMoYi5TKSl7Zm9yKHZhciBrPVtdLGw9Yy5XYihRYiksbT1IKGwpO207KW0ubmFtZSE9Yi5uYW1lJiZrLnB1c2gobSksbT1IKGwpO2sucHVzaChiKTtyZXR1cm4gaGUoayx1ZChnKSl9cmV0dXJuIFBkfWc9Yy5nZXQoYi5uYW1lKTtrPWQ7ZyYmKGs9ay5yZW1vdmUobmV3IEUoYi5uYW1lLGcpKSk7cmV0dXJuIGsuTmEoYixiLlMpfSk7cmV0dXJuIG5ldyBmZShkLGEuY2MpfVxuZnVuY3Rpb24gaWUoYSxiLGMpe3ZhciBkPW5hKGEueWQsZnVuY3Rpb24oYSl7aWYoYT09PVBkKXJldHVybiBhO3ZhciBkPWMuZ2V0KGIubmFtZSk7cmV0dXJuIGQ/YS5yZW1vdmUobmV3IEUoYi5uYW1lLGQpKTphfSk7cmV0dXJuIG5ldyBmZShkLGEuY2MpfXZhciBqZT1uZXcgZmUoe1wiLnByaW9yaXR5XCI6UGR9LHtcIi5wcmlvcml0eVwiOk19KTtmdW5jdGlvbiB0YyhhLGIpe3RoaXMuQz1hO0oobih0aGlzLkMpJiZudWxsIT09dGhpcy5DLFwiTGVhZk5vZGUgc2hvdWxkbid0IGJlIGNyZWF0ZWQgd2l0aCBudWxsL3VuZGVmaW5lZCB2YWx1ZS5cIik7dGhpcy5iYT1ifHxDO2tlKHRoaXMuYmEpO3RoaXMuQmI9bnVsbH1oPXRjLnByb3RvdHlwZTtoLk49ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC5BPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmF9O2guZGE9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyB0Yyh0aGlzLkMsYSl9O2guTT1mdW5jdGlvbihhKXtyZXR1cm5cIi5wcmlvcml0eVwiPT09YT90aGlzLmJhOkN9O2gub2E9ZnVuY3Rpb24oYSl7cmV0dXJuIGEuZSgpP3RoaXM6XCIucHJpb3JpdHlcIj09PU8oYSk/dGhpcy5iYTpDfTtoLkhhPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2gucWY9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07XG5oLlE9ZnVuY3Rpb24oYSxiKXtyZXR1cm5cIi5wcmlvcml0eVwiPT09YT90aGlzLmRhKGIpOmIuZSgpJiZcIi5wcmlvcml0eVwiIT09YT90aGlzOkMuUShhLGIpLmRhKHRoaXMuYmEpfTtoLkc9ZnVuY3Rpb24oYSxiKXt2YXIgYz1PKGEpO2lmKG51bGw9PT1jKXJldHVybiBiO2lmKGIuZSgpJiZcIi5wcmlvcml0eVwiIT09YylyZXR1cm4gdGhpcztKKFwiLnByaW9yaXR5XCIhPT1jfHwxPT09dWMoYSksXCIucHJpb3JpdHkgbXVzdCBiZSB0aGUgbGFzdCB0b2tlbiBpbiBhIHBhdGhcIik7cmV0dXJuIHRoaXMuUShjLEMuRyhHKGEpLGIpKX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guRGI9ZnVuY3Rpb24oKXtyZXR1cm4gMH07aC5LPWZ1bmN0aW9uKGEpe3JldHVybiBhJiYhdGhpcy5BKCkuZSgpP3tcIi52YWx1ZVwiOnRoaXMuQmEoKSxcIi5wcmlvcml0eVwiOnRoaXMuQSgpLksoKX06dGhpcy5CYSgpfTtcbmguaGFzaD1mdW5jdGlvbigpe2lmKG51bGw9PT10aGlzLkJiKXt2YXIgYT1cIlwiO3RoaXMuYmEuZSgpfHwoYSs9XCJwcmlvcml0eTpcIitsZSh0aGlzLmJhLksoKSkrXCI6XCIpO3ZhciBiPXR5cGVvZiB0aGlzLkMsYT1hKyhiK1wiOlwiKSxhPVwibnVtYmVyXCI9PT1iP2ErWmModGhpcy5DKTphK3RoaXMuQzt0aGlzLkJiPUpjKGEpfXJldHVybiB0aGlzLkJifTtoLkJhPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuQ307aC5DYz1mdW5jdGlvbihhKXtpZihhPT09QylyZXR1cm4gMTtpZihhIGluc3RhbmNlb2YgVClyZXR1cm4tMTtKKGEuTigpLFwiVW5rbm93biBub2RlIHR5cGVcIik7dmFyIGI9dHlwZW9mIGEuQyxjPXR5cGVvZiB0aGlzLkMsZD1OYShtZSxiKSxlPU5hKG1lLGMpO0ooMDw9ZCxcIlVua25vd24gbGVhZiB0eXBlOiBcIitiKTtKKDA8PWUsXCJVbmtub3duIGxlYWYgdHlwZTogXCIrYyk7cmV0dXJuIGQ9PT1lP1wib2JqZWN0XCI9PT1jPzA6dGhpcy5DPGEuQz8tMTp0aGlzLkM9PT1hLkM/MDoxOmUtZH07XG52YXIgbWU9W1wib2JqZWN0XCIsXCJib29sZWFuXCIsXCJudW1iZXJcIixcInN0cmluZ1wiXTt0Yy5wcm90b3R5cGUubWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307dGMucHJvdG90eXBlLkljPWZ1bmN0aW9uKCl7cmV0dXJuITB9O3RjLnByb3RvdHlwZS5aPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09dGhpcz8hMDphLk4oKT90aGlzLkM9PT1hLkMmJnRoaXMuYmEuWihhLmJhKTohMX07dGMucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIEIodGhpcy5LKCEwKSl9O2Z1bmN0aW9uIFQoYSxiLGMpe3RoaXMubT1hOyh0aGlzLmJhPWIpJiZrZSh0aGlzLmJhKTthLmUoKSYmSighdGhpcy5iYXx8dGhpcy5iYS5lKCksXCJBbiBlbXB0eSBub2RlIGNhbm5vdCBoYXZlIGEgcHJpb3JpdHlcIik7dGhpcy53Yj1jO3RoaXMuQmI9bnVsbH1oPVQucHJvdG90eXBlO2guTj1mdW5jdGlvbigpe3JldHVybiExfTtoLkE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iYXx8Q307aC5kYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5tLmUoKT90aGlzOm5ldyBUKHRoaXMubSxhLHRoaXMud2IpfTtoLk09ZnVuY3Rpb24oYSl7aWYoXCIucHJpb3JpdHlcIj09PWEpcmV0dXJuIHRoaXMuQSgpO2E9dGhpcy5tLmdldChhKTtyZXR1cm4gbnVsbD09PWE/QzphfTtoLm9hPWZ1bmN0aW9uKGEpe3ZhciBiPU8oYSk7cmV0dXJuIG51bGw9PT1iP3RoaXM6dGhpcy5NKGIpLm9hKEcoYSkpfTtoLkhhPWZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT09dGhpcy5tLmdldChhKX07XG5oLlE9ZnVuY3Rpb24oYSxiKXtKKGIsXCJXZSBzaG91bGQgYWx3YXlzIGJlIHBhc3Npbmcgc25hcHNob3Qgbm9kZXNcIik7aWYoXCIucHJpb3JpdHlcIj09PWEpcmV0dXJuIHRoaXMuZGEoYik7dmFyIGM9bmV3IEUoYSxiKSxkLGU7Yi5lKCk/KGQ9dGhpcy5tLnJlbW92ZShhKSxjPWllKHRoaXMud2IsYyx0aGlzLm0pKTooZD10aGlzLm0uTmEoYSxiKSxjPWdlKHRoaXMud2IsYyx0aGlzLm0pKTtlPWQuZSgpP0M6dGhpcy5iYTtyZXR1cm4gbmV3IFQoZCxlLGMpfTtoLkc9ZnVuY3Rpb24oYSxiKXt2YXIgYz1PKGEpO2lmKG51bGw9PT1jKXJldHVybiBiO0ooXCIucHJpb3JpdHlcIiE9PU8oYSl8fDE9PT11YyhhKSxcIi5wcmlvcml0eSBtdXN0IGJlIHRoZSBsYXN0IHRva2VuIGluIGEgcGF0aFwiKTt2YXIgZD10aGlzLk0oYykuRyhHKGEpLGIpO3JldHVybiB0aGlzLlEoYyxkKX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubS5lKCl9O2guRGI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tLmNvdW50KCl9O1xudmFyIG5lPS9eKDB8WzEtOV1cXGQqKSQvO2g9VC5wcm90b3R5cGU7aC5LPWZ1bmN0aW9uKGEpe2lmKHRoaXMuZSgpKXJldHVybiBudWxsO3ZhciBiPXt9LGM9MCxkPTAsZT0hMDt0aGlzLlUoTSxmdW5jdGlvbihmLGcpe2JbZl09Zy5LKGEpO2MrKztlJiZuZS50ZXN0KGYpP2Q9TWF0aC5tYXgoZCxOdW1iZXIoZikpOmU9ITF9KTtpZighYSYmZSYmZDwyKmMpe3ZhciBmPVtdLGc7Zm9yKGcgaW4gYilmW2ddPWJbZ107cmV0dXJuIGZ9YSYmIXRoaXMuQSgpLmUoKSYmKGJbXCIucHJpb3JpdHlcIl09dGhpcy5BKCkuSygpKTtyZXR1cm4gYn07aC5oYXNoPWZ1bmN0aW9uKCl7aWYobnVsbD09PXRoaXMuQmIpe3ZhciBhPVwiXCI7dGhpcy5BKCkuZSgpfHwoYSs9XCJwcmlvcml0eTpcIitsZSh0aGlzLkEoKS5LKCkpK1wiOlwiKTt0aGlzLlUoTSxmdW5jdGlvbihiLGMpe3ZhciBkPWMuaGFzaCgpO1wiXCIhPT1kJiYoYSs9XCI6XCIrYitcIjpcIitkKX0pO3RoaXMuQmI9XCJcIj09PWE/XCJcIjpKYyhhKX1yZXR1cm4gdGhpcy5CYn07XG5oLnFmPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4oYz1vZSh0aGlzLGMpKT8oYT1jYyhjLG5ldyBFKGEsYikpKT9hLm5hbWU6bnVsbDpjYyh0aGlzLm0sYSl9O2Z1bmN0aW9uIHdkKGEsYil7dmFyIGM7Yz0oYz1vZShhLGIpKT8oYz1jLlJjKCkpJiZjLm5hbWU6YS5tLlJjKCk7cmV0dXJuIGM/bmV3IEUoYyxhLm0uZ2V0KGMpKTpudWxsfWZ1bmN0aW9uIHhkKGEsYil7dmFyIGM7Yz0oYz1vZShhLGIpKT8oYz1jLmVjKCkpJiZjLm5hbWU6YS5tLmVjKCk7cmV0dXJuIGM/bmV3IEUoYyxhLm0uZ2V0KGMpKTpudWxsfWguVT1mdW5jdGlvbihhLGIpe3ZhciBjPW9lKHRoaXMsYSk7cmV0dXJuIGM/Yy5oYShmdW5jdGlvbihhKXtyZXR1cm4gYihhLm5hbWUsYS5TKX0pOnRoaXMubS5oYShiKX07aC5XYj1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5YYihhLlNjKCksYSl9O1xuaC5YYj1mdW5jdGlvbihhLGIpe3ZhciBjPW9lKHRoaXMsYik7aWYoYylyZXR1cm4gYy5YYihhLGZ1bmN0aW9uKGEpe3JldHVybiBhfSk7Zm9yKHZhciBjPXRoaXMubS5YYihhLm5hbWUsUWIpLGQ9ZWMoYyk7bnVsbCE9ZCYmMD5iLmNvbXBhcmUoZCxhKTspSChjKSxkPWVjKGMpO3JldHVybiBjfTtoLnJmPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlpiKGEuUGMoKSxhKX07aC5aYj1mdW5jdGlvbihhLGIpe3ZhciBjPW9lKHRoaXMsYik7aWYoYylyZXR1cm4gYy5aYihhLGZ1bmN0aW9uKGEpe3JldHVybiBhfSk7Zm9yKHZhciBjPXRoaXMubS5aYihhLm5hbWUsUWIpLGQ9ZWMoYyk7bnVsbCE9ZCYmMDxiLmNvbXBhcmUoZCxhKTspSChjKSxkPWVjKGMpO3JldHVybiBjfTtoLkNjPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmUoKT9hLmUoKT8wOi0xOmEuTigpfHxhLmUoKT8xOmE9PT1TZD8tMTowfTtcbmgubWI9ZnVuY3Rpb24oYSl7aWYoYT09PVZkfHx0YSh0aGlzLndiLmNjLGEudG9TdHJpbmcoKSkpcmV0dXJuIHRoaXM7dmFyIGI9dGhpcy53YixjPXRoaXMubTtKKGEhPT1WZCxcIktleUluZGV4IGFsd2F5cyBleGlzdHMgYW5kIGlzbid0IG1lYW50IHRvIGJlIGFkZGVkIHRvIHRoZSBJbmRleE1hcC5cIik7Zm9yKHZhciBkPVtdLGU9ITEsYz1jLldiKFFiKSxmPUgoYyk7ZjspZT1lfHxhLkhjKGYuUyksZC5wdXNoKGYpLGY9SChjKTtkPWU/aGUoZCx1ZChhKSk6UGQ7ZT1hLnRvU3RyaW5nKCk7Yz14YShiLmNjKTtjW2VdPWE7YT14YShiLnlkKTthW2VdPWQ7cmV0dXJuIG5ldyBUKHRoaXMubSx0aGlzLmJhLG5ldyBmZShhLGMpKX07aC5JYz1mdW5jdGlvbihhKXtyZXR1cm4gYT09PVZkfHx0YSh0aGlzLndiLmNjLGEudG9TdHJpbmcoKSl9O1xuaC5aPWZ1bmN0aW9uKGEpe2lmKGE9PT10aGlzKXJldHVybiEwO2lmKGEuTigpKXJldHVybiExO2lmKHRoaXMuQSgpLlooYS5BKCkpJiZ0aGlzLm0uY291bnQoKT09PWEubS5jb3VudCgpKXt2YXIgYj10aGlzLldiKE0pO2E9YS5XYihNKTtmb3IodmFyIGM9SChiKSxkPUgoYSk7YyYmZDspe2lmKGMubmFtZSE9PWQubmFtZXx8IWMuUy5aKGQuUykpcmV0dXJuITE7Yz1IKGIpO2Q9SChhKX1yZXR1cm4gbnVsbD09PWMmJm51bGw9PT1kfXJldHVybiExfTtmdW5jdGlvbiBvZShhLGIpe3JldHVybiBiPT09VmQ/bnVsbDphLndiLmdldChiLnRvU3RyaW5nKCkpfWgudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gQih0aGlzLksoITApKX07ZnVuY3Rpb24gTChhLGIpe2lmKG51bGw9PT1hKXJldHVybiBDO3ZhciBjPW51bGw7XCJvYmplY3RcIj09PXR5cGVvZiBhJiZcIi5wcmlvcml0eVwiaW4gYT9jPWFbXCIucHJpb3JpdHlcIl06XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBiJiYoYz1iKTtKKG51bGw9PT1jfHxcInN0cmluZ1wiPT09dHlwZW9mIGN8fFwibnVtYmVyXCI9PT10eXBlb2YgY3x8XCJvYmplY3RcIj09PXR5cGVvZiBjJiZcIi5zdlwiaW4gYyxcIkludmFsaWQgcHJpb3JpdHkgdHlwZSBmb3VuZDogXCIrdHlwZW9mIGMpO1wib2JqZWN0XCI9PT10eXBlb2YgYSYmXCIudmFsdWVcImluIGEmJm51bGwhPT1hW1wiLnZhbHVlXCJdJiYoYT1hW1wiLnZhbHVlXCJdKTtpZihcIm9iamVjdFwiIT09dHlwZW9mIGF8fFwiLnN2XCJpbiBhKXJldHVybiBuZXcgdGMoYSxMKGMpKTtpZihhIGluc3RhbmNlb2YgQXJyYXkpe3ZhciBkPUMsZT1hO3IoZSxmdW5jdGlvbihhLGIpe2lmKHUoZSxiKSYmXCIuXCIhPT1iLnN1YnN0cmluZygwLDEpKXt2YXIgYz1MKGEpO2lmKGMuTigpfHwhYy5lKCkpZD1cbmQuUShiLGMpfX0pO3JldHVybiBkLmRhKEwoYykpfXZhciBmPVtdLGc9ITEsaz1hO2hiKGssZnVuY3Rpb24oYSl7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBhfHxcIi5cIiE9PWEuc3Vic3RyaW5nKDAsMSkpe3ZhciBiPUwoa1thXSk7Yi5lKCl8fChnPWd8fCFiLkEoKS5lKCksZi5wdXNoKG5ldyBFKGEsYikpKX19KTtpZigwPT1mLmxlbmd0aClyZXR1cm4gQzt2YXIgbD1oZShmLFJiLGZ1bmN0aW9uKGEpe3JldHVybiBhLm5hbWV9LFRiKTtpZihnKXt2YXIgbT1oZShmLHVkKE0pKTtyZXR1cm4gbmV3IFQobCxMKGMpLG5ldyBmZSh7XCIucHJpb3JpdHlcIjptfSx7XCIucHJpb3JpdHlcIjpNfSkpfXJldHVybiBuZXcgVChsLEwoYyksamUpfXZhciBwZT1NYXRoLmxvZygyKTtcbmZ1bmN0aW9uIHFlKGEpe3RoaXMuY291bnQ9cGFyc2VJbnQoTWF0aC5sb2coYSsxKS9wZSwxMCk7dGhpcy5oZj10aGlzLmNvdW50LTE7dGhpcy5iZz1hKzEmcGFyc2VJbnQoQXJyYXkodGhpcy5jb3VudCsxKS5qb2luKFwiMVwiKSwyKX1mdW5jdGlvbiByZShhKXt2YXIgYj0hKGEuYmcmMTw8YS5oZik7YS5oZi0tO3JldHVybiBifVxuZnVuY3Rpb24gaGUoYSxiLGMsZCl7ZnVuY3Rpb24gZShiLGQpe3ZhciBmPWQtYjtpZigwPT1mKXJldHVybiBudWxsO2lmKDE9PWYpe3ZhciBtPWFbYl0sdj1jP2MobSk6bTtyZXR1cm4gbmV3IGZjKHYsbS5TLCExLG51bGwsbnVsbCl9dmFyIG09cGFyc2VJbnQoZi8yLDEwKStiLGY9ZShiLG0pLHk9ZShtKzEsZCksbT1hW21dLHY9Yz9jKG0pOm07cmV0dXJuIG5ldyBmYyh2LG0uUywhMSxmLHkpfWEuc29ydChiKTt2YXIgZj1mdW5jdGlvbihiKXtmdW5jdGlvbiBkKGIsZyl7dmFyIGs9di1iLHk9djt2LT1iO3ZhciB5PWUoaysxLHkpLGs9YVtrXSxJPWM/YyhrKTprLHk9bmV3IGZjKEksay5TLGcsbnVsbCx5KTtmP2YubGVmdD15Om09eTtmPXl9Zm9yKHZhciBmPW51bGwsbT1udWxsLHY9YS5sZW5ndGgseT0wO3k8Yi5jb3VudDsrK3kpe3ZhciBJPXJlKGIpLHZkPU1hdGgucG93KDIsYi5jb3VudC0oeSsxKSk7ST9kKHZkLCExKTooZCh2ZCwhMSksZCh2ZCwhMCkpfXJldHVybiBtfShuZXcgcWUoYS5sZW5ndGgpKTtcbnJldHVybiBudWxsIT09Zj9uZXcgYWMoZHx8YixmKTpuZXcgYWMoZHx8Yil9ZnVuY3Rpb24gbGUoYSl7cmV0dXJuXCJudW1iZXJcIj09PXR5cGVvZiBhP1wibnVtYmVyOlwiK1pjKGEpOlwic3RyaW5nOlwiK2F9ZnVuY3Rpb24ga2UoYSl7aWYoYS5OKCkpe3ZhciBiPWEuSygpO0ooXCJzdHJpbmdcIj09PXR5cGVvZiBifHxcIm51bWJlclwiPT09dHlwZW9mIGJ8fFwib2JqZWN0XCI9PT10eXBlb2YgYiYmdShiLFwiLnN2XCIpLFwiUHJpb3JpdHkgbXVzdCBiZSBhIHN0cmluZyBvciBudW1iZXIuXCIpfWVsc2UgSihhPT09U2R8fGEuZSgpLFwicHJpb3JpdHkgb2YgdW5leHBlY3RlZCB0eXBlLlwiKTtKKGE9PT1TZHx8YS5BKCkuZSgpLFwiUHJpb3JpdHkgbm9kZXMgY2FuJ3QgaGF2ZSBhIHByaW9yaXR5IG9mIHRoZWlyIG93bi5cIil9dmFyIEM9bmV3IFQobmV3IGFjKFRiKSxudWxsLGplKTtmdW5jdGlvbiBzZSgpe1QuY2FsbCh0aGlzLG5ldyBhYyhUYiksQyxqZSl9bWEoc2UsVCk7aD1zZS5wcm90b3R5cGU7XG5oLkNjPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09dGhpcz8wOjF9O2guWj1mdW5jdGlvbihhKXtyZXR1cm4gYT09PXRoaXN9O2guQT1mdW5jdGlvbigpe3JldHVybiB0aGlzfTtoLk09ZnVuY3Rpb24oKXtyZXR1cm4gQ307aC5lPWZ1bmN0aW9uKCl7cmV0dXJuITF9O3ZhciBTZD1uZXcgc2UsUWQ9bmV3IEUoXCJbTUlOX05BTUVdXCIsQyksWGQ9bmV3IEUoXCJbTUFYX05BTUVdXCIsU2QpO2Z1bmN0aW9uIElkKGEsYil7dGhpcy5EPWE7dGhpcy5VZD1ifWZ1bmN0aW9uIEZkKGEsYixjLGQpe3JldHVybiBuZXcgSWQobmV3IHNiKGIsYyxkKSxhLlVkKX1mdW5jdGlvbiBKZChhKXtyZXR1cm4gYS5ELiQ/YS5ELmooKTpudWxsfUlkLnByb3RvdHlwZS51PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuVWR9O2Z1bmN0aW9uIHRiKGEpe3JldHVybiBhLlVkLiQ/YS5VZC5qKCk6bnVsbH07ZnVuY3Rpb24gdGUoYSxiKXt0aGlzLlY9YTt2YXIgYz1hLm4sZD1uZXcgbGQoYy5nKSxjPWRlKGMpP25ldyBsZChjLmcpOmMuaWE/bmV3IHJkKGMpOm5ldyBtZChjKTt0aGlzLkdmPW5ldyB6ZChjKTt2YXIgZT1iLnUoKSxmPWIuRCxnPWQudGEoQyxlLmooKSxudWxsKSxrPWMudGEoQyxmLmooKSxudWxsKTt0aGlzLkthPW5ldyBJZChuZXcgc2IoayxmLiQsYy5HYSgpKSxuZXcgc2IoZyxlLiQsZC5HYSgpKSk7dGhpcy5aYT1bXTt0aGlzLmlnPW5ldyBkZChhKX1mdW5jdGlvbiB1ZShhKXtyZXR1cm4gYS5WfWg9dGUucHJvdG90eXBlO2gudT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkthLnUoKS5qKCl9O2guaGI9ZnVuY3Rpb24oYSl7dmFyIGI9dGIodGhpcy5LYSk7cmV0dXJuIGImJihkZSh0aGlzLlYubil8fCFhLmUoKSYmIWIuTShPKGEpKS5lKCkpP2Iub2EoYSk6bnVsbH07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIDA9PT10aGlzLlphLmxlbmd0aH07aC5PYj1mdW5jdGlvbihhKXt0aGlzLlphLnB1c2goYSl9O1xuaC5rYj1mdW5jdGlvbihhLGIpe3ZhciBjPVtdO2lmKGIpe0oobnVsbD09YSxcIkEgY2FuY2VsIHNob3VsZCBjYW5jZWwgYWxsIGV2ZW50IHJlZ2lzdHJhdGlvbnMuXCIpO3ZhciBkPXRoaXMuVi5wYXRoO09hKHRoaXMuWmEsZnVuY3Rpb24oYSl7KGE9YS5mZihiLGQpKSYmYy5wdXNoKGEpfSl9aWYoYSl7Zm9yKHZhciBlPVtdLGY9MDtmPHRoaXMuWmEubGVuZ3RoOysrZil7dmFyIGc9dGhpcy5aYVtmXTtpZighZy5tYXRjaGVzKGEpKWUucHVzaChnKTtlbHNlIGlmKGEuc2YoKSl7ZT1lLmNvbmNhdCh0aGlzLlphLnNsaWNlKGYrMSkpO2JyZWFrfX10aGlzLlphPWV9ZWxzZSB0aGlzLlphPVtdO3JldHVybiBjfTtcbmguYmI9ZnVuY3Rpb24oYSxiLGMpe2EudHlwZT09PUNkJiZudWxsIT09YS5zb3VyY2UuSWImJihKKHRiKHRoaXMuS2EpLFwiV2Ugc2hvdWxkIGFsd2F5cyBoYXZlIGEgZnVsbCBjYWNoZSBiZWZvcmUgaGFuZGxpbmcgbWVyZ2VzXCIpLEooSmQodGhpcy5LYSksXCJNaXNzaW5nIGV2ZW50IGNhY2hlLCBldmVuIHRob3VnaCB3ZSBoYXZlIGEgc2VydmVyIGNhY2hlXCIpKTt2YXIgZD10aGlzLkthO2E9dGhpcy5HZi5iYihkLGEsYixjKTtiPXRoaXMuR2Y7Yz1hLmhlO0ooYy5ELmooKS5JYyhiLkkuZyksXCJFdmVudCBzbmFwIG5vdCBpbmRleGVkXCIpO0ooYy51KCkuaigpLkljKGIuSS5nKSxcIlNlcnZlciBzbmFwIG5vdCBpbmRleGVkXCIpO0ooSGIoYS5oZS51KCkpfHwhSGIoZC51KCkpLFwiT25jZSBhIHNlcnZlciBzbmFwIGlzIGNvbXBsZXRlLCBpdCBzaG91bGQgbmV2ZXIgZ28gYmFja1wiKTt0aGlzLkthPWEuaGU7cmV0dXJuIHZlKHRoaXMsYS5jZyxhLmhlLkQuaigpLG51bGwpfTtcbmZ1bmN0aW9uIHdlKGEsYil7dmFyIGM9YS5LYS5ELGQ9W107Yy5qKCkuTigpfHxjLmooKS5VKE0sZnVuY3Rpb24oYSxiKXtkLnB1c2gobmV3IEQoXCJjaGlsZF9hZGRlZFwiLGIsYSkpfSk7Yy4kJiZkLnB1c2goRGIoYy5qKCkpKTtyZXR1cm4gdmUoYSxkLGMuaigpLGIpfWZ1bmN0aW9uIHZlKGEsYixjLGQpe3JldHVybiBlZChhLmlnLGIsYyxkP1tkXTphLlphKX07ZnVuY3Rpb24geGUoYSxiLGMpe3RoaXMudHlwZT1DZDt0aGlzLnNvdXJjZT1hO3RoaXMucGF0aD1iO3RoaXMuY2hpbGRyZW49Y314ZS5wcm90b3R5cGUuV2M9ZnVuY3Rpb24oYSl7aWYodGhpcy5wYXRoLmUoKSlyZXR1cm4gYT10aGlzLmNoaWxkcmVuLnN1YnRyZWUobmV3IEsoYSkpLGEuZSgpP251bGw6YS52YWx1ZT9uZXcgVWIodGhpcy5zb3VyY2UsRixhLnZhbHVlKTpuZXcgeGUodGhpcy5zb3VyY2UsRixhKTtKKE8odGhpcy5wYXRoKT09PWEsXCJDYW4ndCBnZXQgYSBtZXJnZSBmb3IgYSBjaGlsZCBub3Qgb24gdGhlIHBhdGggb2YgdGhlIG9wZXJhdGlvblwiKTtyZXR1cm4gbmV3IHhlKHRoaXMuc291cmNlLEcodGhpcy5wYXRoKSx0aGlzLmNoaWxkcmVuKX07eGUucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJPcGVyYXRpb24oXCIrdGhpcy5wYXRoK1wiOiBcIit0aGlzLnNvdXJjZS50b1N0cmluZygpK1wiIG1lcmdlOiBcIit0aGlzLmNoaWxkcmVuLnRvU3RyaW5nKCkrXCIpXCJ9O3ZhciBWYj0wLENkPTEsWGI9MiwkYj0zO2Z1bmN0aW9uIHllKGEsYixjLGQpe3RoaXMudmU9YTt0aGlzLm9mPWI7dGhpcy5JYj1jO3RoaXMuYWY9ZDtKKCFkfHxiLFwiVGFnZ2VkIHF1ZXJpZXMgbXVzdCBiZSBmcm9tIHNlcnZlci5cIil9dmFyIFliPW5ldyB5ZSghMCwhMSxudWxsLCExKSx6ZT1uZXcgeWUoITEsITAsbnVsbCwhMSk7eWUucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmU/XCJ1c2VyXCI6dGhpcy5hZj9cInNlcnZlcihxdWVyeUlEPVwiK3RoaXMuSWIrXCIpXCI6XCJzZXJ2ZXJcIn07ZnVuY3Rpb24gQWUoYSxiKXt0aGlzLmY9T2MoXCJwOnJlc3Q6XCIpO3RoaXMuSD1hO3RoaXMuR2I9Yjt0aGlzLkZhPW51bGw7dGhpcy5hYT17fX1mdW5jdGlvbiBCZShhLGIpe2lmKG4oYikpcmV0dXJuXCJ0YWckXCIrYjt2YXIgYz1hLm47SihkZShjKSYmYy5nPT1NLFwic2hvdWxkIGhhdmUgYSB0YWcgaWYgaXQncyBub3QgYSBkZWZhdWx0IHF1ZXJ5LlwiKTtyZXR1cm4gYS5wYXRoLnRvU3RyaW5nKCl9aD1BZS5wcm90b3R5cGU7XG5oLnhmPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWEucGF0aC50b1N0cmluZygpO3RoaXMuZihcIkxpc3RlbiBjYWxsZWQgZm9yIFwiK2UrXCIgXCIrYS53YSgpKTt2YXIgZj1CZShhLGMpLGc9e307dGhpcy5hYVtmXT1nO2E9ZWUoYS5uKTt2YXIgaz10aGlzO0NlKHRoaXMsZStcIi5qc29uXCIsYSxmdW5jdGlvbihhLGIpe3ZhciB2PWI7NDA0PT09YSYmKGE9dj1udWxsKTtudWxsPT09YSYmay5HYihlLHYsITEsYyk7dyhrLmFhLGYpPT09ZyYmZChhPzQwMT09YT9cInBlcm1pc3Npb25fZGVuaWVkXCI6XCJyZXN0X2Vycm9yOlwiK2E6XCJva1wiLG51bGwpfSl9O2guT2Y9ZnVuY3Rpb24oYSxiKXt2YXIgYz1CZShhLGIpO2RlbGV0ZSB0aGlzLmFhW2NdfTtoLlA9ZnVuY3Rpb24oYSxiKXt0aGlzLkZhPWE7dmFyIGM9YWQoYSksZD1jLmRhdGEsYz1jLkFjJiZjLkFjLmV4cDtiJiZiKFwib2tcIix7YXV0aDpkLGV4cGlyZXM6Y30pfTtoLmVlPWZ1bmN0aW9uKGEpe3RoaXMuRmE9bnVsbDthKFwib2tcIixudWxsKX07XG5oLkxlPWZ1bmN0aW9uKCl7fTtoLkJmPWZ1bmN0aW9uKCl7fTtoLkdkPWZ1bmN0aW9uKCl7fTtoLnB1dD1mdW5jdGlvbigpe307aC55Zj1mdW5jdGlvbigpe307aC5UZT1mdW5jdGlvbigpe307XG5mdW5jdGlvbiBDZShhLGIsYyxkKXtjPWN8fHt9O2MuZm9ybWF0PVwiZXhwb3J0XCI7YS5GYSYmKGMuYXV0aD1hLkZhKTt2YXIgZT0oYS5ILmxiP1wiaHR0cHM6Ly9cIjpcImh0dHA6Ly9cIikrYS5ILmhvc3QrYitcIj9cIitqYihjKTthLmYoXCJTZW5kaW5nIFJFU1QgcmVxdWVzdCBmb3IgXCIrZSk7dmFyIGY9bmV3IFhNTEh0dHBSZXF1ZXN0O2Yub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7aWYoZCYmND09PWYucmVhZHlTdGF0ZSl7YS5mKFwiUkVTVCBSZXNwb25zZSBmb3IgXCIrZStcIiByZWNlaXZlZC4gc3RhdHVzOlwiLGYuc3RhdHVzLFwicmVzcG9uc2U6XCIsZi5yZXNwb25zZVRleHQpO3ZhciBiPW51bGw7aWYoMjAwPD1mLnN0YXR1cyYmMzAwPmYuc3RhdHVzKXt0cnl7Yj1tYihmLnJlc3BvbnNlVGV4dCl9Y2F0Y2goYyl7UShcIkZhaWxlZCB0byBwYXJzZSBKU09OIHJlc3BvbnNlIGZvciBcIitlK1wiOiBcIitmLnJlc3BvbnNlVGV4dCl9ZChudWxsLGIpfWVsc2UgNDAxIT09Zi5zdGF0dXMmJjQwNCE9PVxuZi5zdGF0dXMmJlEoXCJHb3QgdW5zdWNjZXNzZnVsIFJFU1QgcmVzcG9uc2UgZm9yIFwiK2UrXCIgU3RhdHVzOiBcIitmLnN0YXR1cyksZChmLnN0YXR1cyk7ZD1udWxsfX07Zi5vcGVuKFwiR0VUXCIsZSwhMCk7Zi5zZW5kKCl9O2Z1bmN0aW9uIERlKGEsYil7dGhpcy52YWx1ZT1hO3RoaXMuY2hpbGRyZW49Ynx8RWV9dmFyIEVlPW5ldyBhYyhmdW5jdGlvbihhLGIpe3JldHVybiBhPT09Yj8wOmE8Yj8tMToxfSk7ZnVuY3Rpb24gRmUoYSl7dmFyIGI9TmQ7cihhLGZ1bmN0aW9uKGEsZCl7Yj1iLnNldChuZXcgSyhkKSxhKX0pO3JldHVybiBifWg9RGUucHJvdG90eXBlO2guZT1mdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy52YWx1ZSYmdGhpcy5jaGlsZHJlbi5lKCl9O2Z1bmN0aW9uIEdlKGEsYixjKXtpZihudWxsIT1hLnZhbHVlJiZjKGEudmFsdWUpKXJldHVybntwYXRoOkYsdmFsdWU6YS52YWx1ZX07aWYoYi5lKCkpcmV0dXJuIG51bGw7dmFyIGQ9TyhiKTthPWEuY2hpbGRyZW4uZ2V0KGQpO3JldHVybiBudWxsIT09YT8oYj1HZShhLEcoYiksYyksbnVsbCE9Yj97cGF0aDoobmV3IEsoZCkpLncoYi5wYXRoKSx2YWx1ZTpiLnZhbHVlfTpudWxsKTpudWxsfVxuZnVuY3Rpb24gSGUoYSxiKXtyZXR1cm4gR2UoYSxiLGZ1bmN0aW9uKCl7cmV0dXJuITB9KX1oLnN1YnRyZWU9ZnVuY3Rpb24oYSl7aWYoYS5lKCkpcmV0dXJuIHRoaXM7dmFyIGI9dGhpcy5jaGlsZHJlbi5nZXQoTyhhKSk7cmV0dXJuIG51bGwhPT1iP2Iuc3VidHJlZShHKGEpKTpOZH07aC5zZXQ9ZnVuY3Rpb24oYSxiKXtpZihhLmUoKSlyZXR1cm4gbmV3IERlKGIsdGhpcy5jaGlsZHJlbik7dmFyIGM9TyhhKSxkPSh0aGlzLmNoaWxkcmVuLmdldChjKXx8TmQpLnNldChHKGEpLGIpLGM9dGhpcy5jaGlsZHJlbi5OYShjLGQpO3JldHVybiBuZXcgRGUodGhpcy52YWx1ZSxjKX07XG5oLnJlbW92ZT1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gdGhpcy5jaGlsZHJlbi5lKCk/TmQ6bmV3IERlKG51bGwsdGhpcy5jaGlsZHJlbik7dmFyIGI9TyhhKSxjPXRoaXMuY2hpbGRyZW4uZ2V0KGIpO3JldHVybiBjPyhhPWMucmVtb3ZlKEcoYSkpLGI9YS5lKCk/dGhpcy5jaGlsZHJlbi5yZW1vdmUoYik6dGhpcy5jaGlsZHJlbi5OYShiLGEpLG51bGw9PT10aGlzLnZhbHVlJiZiLmUoKT9OZDpuZXcgRGUodGhpcy52YWx1ZSxiKSk6dGhpc307aC5nZXQ9ZnVuY3Rpb24oYSl7aWYoYS5lKCkpcmV0dXJuIHRoaXMudmFsdWU7dmFyIGI9dGhpcy5jaGlsZHJlbi5nZXQoTyhhKSk7cmV0dXJuIGI/Yi5nZXQoRyhhKSk6bnVsbH07XG5mdW5jdGlvbiBNZChhLGIsYyl7aWYoYi5lKCkpcmV0dXJuIGM7dmFyIGQ9TyhiKTtiPU1kKGEuY2hpbGRyZW4uZ2V0KGQpfHxOZCxHKGIpLGMpO2Q9Yi5lKCk/YS5jaGlsZHJlbi5yZW1vdmUoZCk6YS5jaGlsZHJlbi5OYShkLGIpO3JldHVybiBuZXcgRGUoYS52YWx1ZSxkKX1mdW5jdGlvbiBJZShhLGIpe3JldHVybiBKZShhLEYsYil9ZnVuY3Rpb24gSmUoYSxiLGMpe3ZhciBkPXt9O2EuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYSxmKXtkW2FdPUplKGYsYi53KGEpLGMpfSk7cmV0dXJuIGMoYixhLnZhbHVlLGQpfWZ1bmN0aW9uIEtlKGEsYixjKXtyZXR1cm4gTGUoYSxiLEYsYyl9ZnVuY3Rpb24gTGUoYSxiLGMsZCl7dmFyIGU9YS52YWx1ZT9kKGMsYS52YWx1ZSk6ITE7aWYoZSlyZXR1cm4gZTtpZihiLmUoKSlyZXR1cm4gbnVsbDtlPU8oYik7cmV0dXJuKGE9YS5jaGlsZHJlbi5nZXQoZSkpP0xlKGEsRyhiKSxjLncoZSksZCk6bnVsbH1cbmZ1bmN0aW9uIE1lKGEsYixjKXt2YXIgZD1GO2lmKCFiLmUoKSl7dmFyIGU9ITA7YS52YWx1ZSYmKGU9YyhkLGEudmFsdWUpKTshMD09PWUmJihlPU8oYiksKGE9YS5jaGlsZHJlbi5nZXQoZSkpJiZOZShhLEcoYiksZC53KGUpLGMpKX19ZnVuY3Rpb24gTmUoYSxiLGMsZCl7aWYoYi5lKCkpcmV0dXJuIGE7YS52YWx1ZSYmZChjLGEudmFsdWUpO3ZhciBlPU8oYik7cmV0dXJuKGE9YS5jaGlsZHJlbi5nZXQoZSkpP05lKGEsRyhiKSxjLncoZSksZCk6TmR9ZnVuY3Rpb24gS2QoYSxiKXtPZShhLEYsYil9ZnVuY3Rpb24gT2UoYSxiLGMpe2EuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYSxlKXtPZShlLGIudyhhKSxjKX0pO2EudmFsdWUmJmMoYixhLnZhbHVlKX1mdW5jdGlvbiBQZShhLGIpe2EuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYSxkKXtkLnZhbHVlJiZiKGEsZC52YWx1ZSl9KX12YXIgTmQ9bmV3IERlKG51bGwpO1xuRGUucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7dmFyIGE9e307S2QodGhpcyxmdW5jdGlvbihiLGMpe2FbYi50b1N0cmluZygpXT1jLnRvU3RyaW5nKCl9KTtyZXR1cm4gQihhKX07ZnVuY3Rpb24gUWUoYSl7dGhpcy5XPWF9dmFyIFJlPW5ldyBRZShuZXcgRGUobnVsbCkpO2Z1bmN0aW9uIFNlKGEsYixjKXtpZihiLmUoKSlyZXR1cm4gbmV3IFFlKG5ldyBEZShjKSk7dmFyIGQ9SGUoYS5XLGIpO2lmKG51bGwhPWQpe3ZhciBlPWQucGF0aCxkPWQudmFsdWU7Yj1OKGUsYik7ZD1kLkcoYixjKTtyZXR1cm4gbmV3IFFlKGEuVy5zZXQoZSxkKSl9YT1NZChhLlcsYixuZXcgRGUoYykpO3JldHVybiBuZXcgUWUoYSl9ZnVuY3Rpb24gVGUoYSxiLGMpe3ZhciBkPWE7aGIoYyxmdW5jdGlvbihhLGMpe2Q9U2UoZCxiLncoYSksYyl9KTtyZXR1cm4gZH1RZS5wcm90b3R5cGUuT2Q9ZnVuY3Rpb24oYSl7aWYoYS5lKCkpcmV0dXJuIFJlO2E9TWQodGhpcy5XLGEsTmQpO3JldHVybiBuZXcgUWUoYSl9O2Z1bmN0aW9uIFVlKGEsYil7dmFyIGM9SGUoYS5XLGIpO3JldHVybiBudWxsIT1jP2EuVy5nZXQoYy5wYXRoKS5vYShOKGMucGF0aCxiKSk6bnVsbH1cbmZ1bmN0aW9uIFZlKGEpe3ZhciBiPVtdLGM9YS5XLnZhbHVlO251bGwhPWM/Yy5OKCl8fGMuVShNLGZ1bmN0aW9uKGEsYyl7Yi5wdXNoKG5ldyBFKGEsYykpfSk6YS5XLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGEsYyl7bnVsbCE9Yy52YWx1ZSYmYi5wdXNoKG5ldyBFKGEsYy52YWx1ZSkpfSk7cmV0dXJuIGJ9ZnVuY3Rpb24gV2UoYSxiKXtpZihiLmUoKSlyZXR1cm4gYTt2YXIgYz1VZShhLGIpO3JldHVybiBudWxsIT1jP25ldyBRZShuZXcgRGUoYykpOm5ldyBRZShhLlcuc3VidHJlZShiKSl9UWUucHJvdG90eXBlLmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5XLmUoKX07UWUucHJvdG90eXBlLmFwcGx5PWZ1bmN0aW9uKGEpe3JldHVybiBYZShGLHRoaXMuVyxhKX07XG5mdW5jdGlvbiBYZShhLGIsYyl7aWYobnVsbCE9Yi52YWx1ZSlyZXR1cm4gYy5HKGEsYi52YWx1ZSk7dmFyIGQ9bnVsbDtiLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGIsZil7XCIucHJpb3JpdHlcIj09PWI/KEoobnVsbCE9PWYudmFsdWUsXCJQcmlvcml0eSB3cml0ZXMgbXVzdCBhbHdheXMgYmUgbGVhZiBub2Rlc1wiKSxkPWYudmFsdWUpOmM9WGUoYS53KGIpLGYsYyl9KTtjLm9hKGEpLmUoKXx8bnVsbD09PWR8fChjPWMuRyhhLncoXCIucHJpb3JpdHlcIiksZCkpO3JldHVybiBjfTtmdW5jdGlvbiBZZSgpe3RoaXMuVD1SZTt0aGlzLnphPVtdO3RoaXMuTGM9LTF9aD1ZZS5wcm90b3R5cGU7XG5oLk9kPWZ1bmN0aW9uKGEpe3ZhciBiPVVhKHRoaXMuemEsZnVuY3Rpb24oYil7cmV0dXJuIGIuaWU9PT1hfSk7SigwPD1iLFwicmVtb3ZlV3JpdGUgY2FsbGVkIHdpdGggbm9uZXhpc3RlbnQgd3JpdGVJZC5cIik7dmFyIGM9dGhpcy56YVtiXTt0aGlzLnphLnNwbGljZShiLDEpO2Zvcih2YXIgZD1jLnZpc2libGUsZT0hMSxmPXRoaXMuemEubGVuZ3RoLTE7ZCYmMDw9Zjspe3ZhciBnPXRoaXMuemFbZl07Zy52aXNpYmxlJiYoZj49YiYmWmUoZyxjLnBhdGgpP2Q9ITE6Yy5wYXRoLmNvbnRhaW5zKGcucGF0aCkmJihlPSEwKSk7Zi0tfWlmKGQpe2lmKGUpdGhpcy5UPSRlKHRoaXMuemEsYWYsRiksdGhpcy5MYz0wPHRoaXMuemEubGVuZ3RoP3RoaXMuemFbdGhpcy56YS5sZW5ndGgtMV0uaWU6LTE7ZWxzZSBpZihjLklhKXRoaXMuVD10aGlzLlQuT2QoYy5wYXRoKTtlbHNle3ZhciBrPXRoaXM7cihjLmNoaWxkcmVuLGZ1bmN0aW9uKGEsYil7ay5UPWsuVC5PZChjLnBhdGgudyhiKSl9KX1yZXR1cm4gYy5wYXRofXJldHVybiBudWxsfTtcbmgudWE9ZnVuY3Rpb24oYSxiLGMsZCl7aWYoY3x8ZCl7dmFyIGU9V2UodGhpcy5ULGEpO3JldHVybiFkJiZlLmUoKT9iOmR8fG51bGwhPWJ8fG51bGwhPVVlKGUsRik/KGU9JGUodGhpcy56YSxmdW5jdGlvbihiKXtyZXR1cm4oYi52aXNpYmxlfHxkKSYmKCFjfHwhKDA8PU5hKGMsYi5pZSkpKSYmKGIucGF0aC5jb250YWlucyhhKXx8YS5jb250YWlucyhiLnBhdGgpKX0sYSksYj1ifHxDLGUuYXBwbHkoYikpOm51bGx9ZT1VZSh0aGlzLlQsYSk7aWYobnVsbCE9ZSlyZXR1cm4gZTtlPVdlKHRoaXMuVCxhKTtyZXR1cm4gZS5lKCk/YjpudWxsIT1ifHxudWxsIT1VZShlLEYpPyhiPWJ8fEMsZS5hcHBseShiKSk6bnVsbH07XG5oLnhjPWZ1bmN0aW9uKGEsYil7dmFyIGM9QyxkPVVlKHRoaXMuVCxhKTtpZihkKWQuTigpfHxkLlUoTSxmdW5jdGlvbihhLGIpe2M9Yy5RKGEsYil9KTtlbHNlIGlmKGIpe3ZhciBlPVdlKHRoaXMuVCxhKTtiLlUoTSxmdW5jdGlvbihhLGIpe3ZhciBkPVdlKGUsbmV3IEsoYSkpLmFwcGx5KGIpO2M9Yy5RKGEsZCl9KTtPYShWZShlKSxmdW5jdGlvbihhKXtjPWMuUShhLm5hbWUsYS5TKX0pfWVsc2UgZT1XZSh0aGlzLlQsYSksT2EoVmUoZSksZnVuY3Rpb24oYSl7Yz1jLlEoYS5uYW1lLGEuUyl9KTtyZXR1cm4gY307aC5oZD1mdW5jdGlvbihhLGIsYyxkKXtKKGN8fGQsXCJFaXRoZXIgZXhpc3RpbmdFdmVudFNuYXAgb3IgZXhpc3RpbmdTZXJ2ZXJTbmFwIG11c3QgZXhpc3RcIik7YT1hLncoYik7aWYobnVsbCE9VWUodGhpcy5ULGEpKXJldHVybiBudWxsO2E9V2UodGhpcy5ULGEpO3JldHVybiBhLmUoKT9kLm9hKGIpOmEuYXBwbHkoZC5vYShiKSl9O1xuaC5YYT1mdW5jdGlvbihhLGIsYyl7YT1hLncoYik7dmFyIGQ9VWUodGhpcy5ULGEpO3JldHVybiBudWxsIT1kP2Q6cmIoYyxiKT9XZSh0aGlzLlQsYSkuYXBwbHkoYy5qKCkuTShiKSk6bnVsbH07aC5zYz1mdW5jdGlvbihhKXtyZXR1cm4gVWUodGhpcy5ULGEpfTtoLm1lPWZ1bmN0aW9uKGEsYixjLGQsZSxmKXt2YXIgZzthPVdlKHRoaXMuVCxhKTtnPVVlKGEsRik7aWYobnVsbD09ZylpZihudWxsIT1iKWc9YS5hcHBseShiKTtlbHNlIHJldHVybltdO2c9Zy5tYihmKTtpZihnLmUoKXx8Zy5OKCkpcmV0dXJuW107Yj1bXTthPXVkKGYpO2U9ZT9nLlpiKGMsZik6Zy5YYihjLGYpO2ZvcihmPUgoZSk7ZiYmYi5sZW5ndGg8ZDspMCE9PWEoZixjKSYmYi5wdXNoKGYpLGY9SChlKTtyZXR1cm4gYn07XG5mdW5jdGlvbiBaZShhLGIpe3JldHVybiBhLklhP2EucGF0aC5jb250YWlucyhiKTohIXVhKGEuY2hpbGRyZW4sZnVuY3Rpb24oYyxkKXtyZXR1cm4gYS5wYXRoLncoZCkuY29udGFpbnMoYil9KX1mdW5jdGlvbiBhZihhKXtyZXR1cm4gYS52aXNpYmxlfVxuZnVuY3Rpb24gJGUoYSxiLGMpe2Zvcih2YXIgZD1SZSxlPTA7ZTxhLmxlbmd0aDsrK2Upe3ZhciBmPWFbZV07aWYoYihmKSl7dmFyIGc9Zi5wYXRoO2lmKGYuSWEpYy5jb250YWlucyhnKT8oZz1OKGMsZyksZD1TZShkLGcsZi5JYSkpOmcuY29udGFpbnMoYykmJihnPU4oZyxjKSxkPVNlKGQsRixmLklhLm9hKGcpKSk7ZWxzZSBpZihmLmNoaWxkcmVuKWlmKGMuY29udGFpbnMoZykpZz1OKGMsZyksZD1UZShkLGcsZi5jaGlsZHJlbik7ZWxzZXtpZihnLmNvbnRhaW5zKGMpKWlmKGc9TihnLGMpLGcuZSgpKWQ9VGUoZCxGLGYuY2hpbGRyZW4pO2Vsc2UgaWYoZj13KGYuY2hpbGRyZW4sTyhnKSkpZj1mLm9hKEcoZykpLGQ9U2UoZCxGLGYpfWVsc2UgdGhyb3cgSGMoXCJXcml0ZVJlY29yZCBzaG91bGQgaGF2ZSAuc25hcCBvciAuY2hpbGRyZW5cIik7fX1yZXR1cm4gZH1mdW5jdGlvbiBiZihhLGIpe3RoaXMuTWI9YTt0aGlzLlc9Yn1oPWJmLnByb3RvdHlwZTtcbmgudWE9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0aGlzLlcudWEodGhpcy5NYixhLGIsYyl9O2gueGM9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuVy54Yyh0aGlzLk1iLGEpfTtoLmhkPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gdGhpcy5XLmhkKHRoaXMuTWIsYSxiLGMpfTtoLnNjPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlcuc2ModGhpcy5NYi53KGEpKX07aC5tZT1mdW5jdGlvbihhLGIsYyxkLGUpe3JldHVybiB0aGlzLlcubWUodGhpcy5NYixhLGIsYyxkLGUpfTtoLlhhPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMuVy5YYSh0aGlzLk1iLGEsYil9O2gudz1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IGJmKHRoaXMuTWIudyhhKSx0aGlzLlcpfTtmdW5jdGlvbiBjZigpe3RoaXMueWE9e319aD1jZi5wcm90b3R5cGU7aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHdhKHRoaXMueWEpfTtoLmJiPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLnNvdXJjZS5JYjtpZihudWxsIT09ZClyZXR1cm4gZD13KHRoaXMueWEsZCksSihudWxsIT1kLFwiU3luY1RyZWUgZ2F2ZSB1cyBhbiBvcCBmb3IgYW4gaW52YWxpZCBxdWVyeS5cIiksZC5iYihhLGIsYyk7dmFyIGU9W107cih0aGlzLnlhLGZ1bmN0aW9uKGQpe2U9ZS5jb25jYXQoZC5iYihhLGIsYykpfSk7cmV0dXJuIGV9O2guT2I9ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZj1hLndhKCksZz13KHRoaXMueWEsZik7aWYoIWcpe3ZhciBnPWMudWEoZT9kOm51bGwpLGs9ITE7Zz9rPSEwOihnPWQgaW5zdGFuY2VvZiBUP2MueGMoZCk6QyxrPSExKTtnPW5ldyB0ZShhLG5ldyBJZChuZXcgc2IoZyxrLCExKSxuZXcgc2IoZCxlLCExKSkpO3RoaXMueWFbZl09Z31nLk9iKGIpO3JldHVybiB3ZShnLGIpfTtcbmgua2I9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEud2EoKSxlPVtdLGY9W10sZz1udWxsIT1kZih0aGlzKTtpZihcImRlZmF1bHRcIj09PWQpe3ZhciBrPXRoaXM7cih0aGlzLnlhLGZ1bmN0aW9uKGEsZCl7Zj1mLmNvbmNhdChhLmtiKGIsYykpO2EuZSgpJiYoZGVsZXRlIGsueWFbZF0sZGUoYS5WLm4pfHxlLnB1c2goYS5WKSl9KX1lbHNle3ZhciBsPXcodGhpcy55YSxkKTtsJiYoZj1mLmNvbmNhdChsLmtiKGIsYykpLGwuZSgpJiYoZGVsZXRlIHRoaXMueWFbZF0sZGUobC5WLm4pfHxlLnB1c2gobC5WKSkpfWcmJm51bGw9PWRmKHRoaXMpJiZlLnB1c2gobmV3IFUoYS5rLGEucGF0aCkpO3JldHVybntIZzplLGpnOmZ9fTtmdW5jdGlvbiBlZihhKXtyZXR1cm4gUGEocmEoYS55YSksZnVuY3Rpb24oYSl7cmV0dXJuIWRlKGEuVi5uKX0pfWguaGI9ZnVuY3Rpb24oYSl7dmFyIGI9bnVsbDtyKHRoaXMueWEsZnVuY3Rpb24oYyl7Yj1ifHxjLmhiKGEpfSk7cmV0dXJuIGJ9O1xuZnVuY3Rpb24gZmYoYSxiKXtpZihkZShiLm4pKXJldHVybiBkZihhKTt2YXIgYz1iLndhKCk7cmV0dXJuIHcoYS55YSxjKX1mdW5jdGlvbiBkZihhKXtyZXR1cm4gdmEoYS55YSxmdW5jdGlvbihhKXtyZXR1cm4gZGUoYS5WLm4pfSl8fG51bGx9O2Z1bmN0aW9uIGdmKGEpe3RoaXMuc2E9TmQ7dGhpcy5IYj1uZXcgWWU7dGhpcy4kZT17fTt0aGlzLmtjPXt9O3RoaXMuTWM9YX1mdW5jdGlvbiBoZihhLGIsYyxkLGUpe3ZhciBmPWEuSGIsZz1lO0ooZD5mLkxjLFwiU3RhY2tpbmcgYW4gb2xkZXIgd3JpdGUgb24gdG9wIG9mIG5ld2VyIG9uZXNcIik7bihnKXx8KGc9ITApO2YuemEucHVzaCh7cGF0aDpiLElhOmMsaWU6ZCx2aXNpYmxlOmd9KTtnJiYoZi5UPVNlKGYuVCxiLGMpKTtmLkxjPWQ7cmV0dXJuIGU/amYoYSxuZXcgVWIoWWIsYixjKSk6W119ZnVuY3Rpb24ga2YoYSxiLGMsZCl7dmFyIGU9YS5IYjtKKGQ+ZS5MYyxcIlN0YWNraW5nIGFuIG9sZGVyIG1lcmdlIG9uIHRvcCBvZiBuZXdlciBvbmVzXCIpO2UuemEucHVzaCh7cGF0aDpiLGNoaWxkcmVuOmMsaWU6ZCx2aXNpYmxlOiEwfSk7ZS5UPVRlKGUuVCxiLGMpO2UuTGM9ZDtjPUZlKGMpO3JldHVybiBqZihhLG5ldyB4ZShZYixiLGMpKX1cbmZ1bmN0aW9uIGxmKGEsYixjKXtjPWN8fCExO2I9YS5IYi5PZChiKTtyZXR1cm4gbnVsbD09Yj9bXTpqZihhLG5ldyBXYihiLGMpKX1mdW5jdGlvbiBtZihhLGIsYyl7Yz1GZShjKTtyZXR1cm4gamYoYSxuZXcgeGUoemUsYixjKSl9ZnVuY3Rpb24gbmYoYSxiLGMsZCl7ZD1vZihhLGQpO2lmKG51bGwhPWQpe3ZhciBlPXBmKGQpO2Q9ZS5wYXRoO2U9ZS5JYjtiPU4oZCxiKTtjPW5ldyBVYihuZXcgeWUoITEsITAsZSwhMCksYixjKTtyZXR1cm4gcWYoYSxkLGMpfXJldHVybltdfWZ1bmN0aW9uIHJmKGEsYixjLGQpe2lmKGQ9b2YoYSxkKSl7dmFyIGU9cGYoZCk7ZD1lLnBhdGg7ZT1lLkliO2I9TihkLGIpO2M9RmUoYyk7Yz1uZXcgeGUobmV3IHllKCExLCEwLGUsITApLGIsYyk7cmV0dXJuIHFmKGEsZCxjKX1yZXR1cm5bXX1cbmdmLnByb3RvdHlwZS5PYj1mdW5jdGlvbihhLGIpe3ZhciBjPWEucGF0aCxkPW51bGwsZT0hMTtNZSh0aGlzLnNhLGMsZnVuY3Rpb24oYSxiKXt2YXIgZj1OKGEsYyk7ZD1iLmhiKGYpO2U9ZXx8bnVsbCE9ZGYoYik7cmV0dXJuIWR9KTt2YXIgZj10aGlzLnNhLmdldChjKTtmPyhlPWV8fG51bGwhPWRmKGYpLGQ9ZHx8Zi5oYihGKSk6KGY9bmV3IGNmLHRoaXMuc2E9dGhpcy5zYS5zZXQoYyxmKSk7dmFyIGc7bnVsbCE9ZD9nPSEwOihnPSExLGQ9QyxQZSh0aGlzLnNhLnN1YnRyZWUoYyksZnVuY3Rpb24oYSxiKXt2YXIgYz1iLmhiKEYpO2MmJihkPWQuUShhLGMpKX0pKTt2YXIgaz1udWxsIT1mZihmLGEpO2lmKCFrJiYhZGUoYS5uKSl7dmFyIGw9c2YoYSk7SighKGwgaW4gdGhpcy5rYyksXCJWaWV3IGRvZXMgbm90IGV4aXN0LCBidXQgd2UgaGF2ZSBhIHRhZ1wiKTt2YXIgbT10ZisrO3RoaXMua2NbbF09bTt0aGlzLiRlW1wiX1wiK21dPWx9Zz1mLk9iKGEsYixuZXcgYmYoYyx0aGlzLkhiKSxcbmQsZyk7a3x8ZXx8KGY9ZmYoZixhKSxnPWcuY29uY2F0KHVmKHRoaXMsYSxmKSkpO3JldHVybiBnfTtcbmdmLnByb3RvdHlwZS5rYj1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9YS5wYXRoLGU9dGhpcy5zYS5nZXQoZCksZj1bXTtpZihlJiYoXCJkZWZhdWx0XCI9PT1hLndhKCl8fG51bGwhPWZmKGUsYSkpKXtmPWUua2IoYSxiLGMpO2UuZSgpJiYodGhpcy5zYT10aGlzLnNhLnJlbW92ZShkKSk7ZT1mLkhnO2Y9Zi5qZztiPS0xIT09VWEoZSxmdW5jdGlvbihhKXtyZXR1cm4gZGUoYS5uKX0pO3ZhciBnPUtlKHRoaXMuc2EsZCxmdW5jdGlvbihhLGIpe3JldHVybiBudWxsIT1kZihiKX0pO2lmKGImJiFnJiYoZD10aGlzLnNhLnN1YnRyZWUoZCksIWQuZSgpKSlmb3IodmFyIGQ9dmYoZCksaz0wO2s8ZC5sZW5ndGg7KytrKXt2YXIgbD1kW2tdLG09bC5WLGw9d2YodGhpcyxsKTt0aGlzLk1jLlhlKG0seGYodGhpcyxtKSxsLnVkLGwuSil9aWYoIWcmJjA8ZS5sZW5ndGgmJiFjKWlmKGIpdGhpcy5NYy5aZChhLG51bGwpO2Vsc2V7dmFyIHY9dGhpcztPYShlLGZ1bmN0aW9uKGEpe2Eud2EoKTt2YXIgYj12LmtjW3NmKGEpXTtcbnYuTWMuWmQoYSxiKX0pfXlmKHRoaXMsZSl9cmV0dXJuIGZ9O2dmLnByb3RvdHlwZS51YT1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuSGIsZD1LZSh0aGlzLnNhLGEsZnVuY3Rpb24oYixjKXt2YXIgZD1OKGIsYSk7aWYoZD1jLmhiKGQpKXJldHVybiBkfSk7cmV0dXJuIGMudWEoYSxkLGIsITApfTtmdW5jdGlvbiB2ZihhKXtyZXR1cm4gSWUoYSxmdW5jdGlvbihhLGMsZCl7aWYoYyYmbnVsbCE9ZGYoYykpcmV0dXJuW2RmKGMpXTt2YXIgZT1bXTtjJiYoZT1lZihjKSk7cihkLGZ1bmN0aW9uKGEpe2U9ZS5jb25jYXQoYSl9KTtyZXR1cm4gZX0pfWZ1bmN0aW9uIHlmKGEsYil7Zm9yKHZhciBjPTA7YzxiLmxlbmd0aDsrK2Mpe3ZhciBkPWJbY107aWYoIWRlKGQubikpe3ZhciBkPXNmKGQpLGU9YS5rY1tkXTtkZWxldGUgYS5rY1tkXTtkZWxldGUgYS4kZVtcIl9cIitlXX19fVxuZnVuY3Rpb24gdWYoYSxiLGMpe3ZhciBkPWIucGF0aCxlPXhmKGEsYik7Yz13ZihhLGMpO2I9YS5NYy5YZShiLGUsYy51ZCxjLkopO2Q9YS5zYS5zdWJ0cmVlKGQpO2lmKGUpSihudWxsPT1kZihkLnZhbHVlKSxcIklmIHdlJ3JlIGFkZGluZyBhIHF1ZXJ5LCBpdCBzaG91bGRuJ3QgYmUgc2hhZG93ZWRcIik7ZWxzZSBmb3IoZT1JZShkLGZ1bmN0aW9uKGEsYixjKXtpZighYS5lKCkmJmImJm51bGwhPWRmKGIpKXJldHVyblt1ZShkZihiKSldO3ZhciBkPVtdO2ImJihkPWQuY29uY2F0KFFhKGVmKGIpLGZ1bmN0aW9uKGEpe3JldHVybiBhLlZ9KSkpO3IoYyxmdW5jdGlvbihhKXtkPWQuY29uY2F0KGEpfSk7cmV0dXJuIGR9KSxkPTA7ZDxlLmxlbmd0aDsrK2QpYz1lW2RdLGEuTWMuWmQoYyx4ZihhLGMpKTtyZXR1cm4gYn1cbmZ1bmN0aW9uIHdmKGEsYil7dmFyIGM9Yi5WLGQ9eGYoYSxjKTtyZXR1cm57dWQ6ZnVuY3Rpb24oKXtyZXR1cm4oYi51KCl8fEMpLmhhc2goKX0sSjpmdW5jdGlvbihiKXtpZihcIm9rXCI9PT1iKXtpZihkKXt2YXIgZj1jLnBhdGg7aWYoYj1vZihhLGQpKXt2YXIgZz1wZihiKTtiPWcucGF0aDtnPWcuSWI7Zj1OKGIsZik7Zj1uZXcgWmIobmV3IHllKCExLCEwLGcsITApLGYpO2I9cWYoYSxiLGYpfWVsc2UgYj1bXX1lbHNlIGI9amYoYSxuZXcgWmIoemUsYy5wYXRoKSk7cmV0dXJuIGJ9Zj1cIlVua25vd24gRXJyb3JcIjtcInRvb19iaWdcIj09PWI/Zj1cIlRoZSBkYXRhIHJlcXVlc3RlZCBleGNlZWRzIHRoZSBtYXhpbXVtIHNpemUgdGhhdCBjYW4gYmUgYWNjZXNzZWQgd2l0aCBhIHNpbmdsZSByZXF1ZXN0LlwiOlwicGVybWlzc2lvbl9kZW5pZWRcIj09Yj9mPVwiQ2xpZW50IGRvZXNuJ3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGFjY2VzcyB0aGUgZGVzaXJlZCBkYXRhLlwiOlwidW5hdmFpbGFibGVcIj09YiYmXG4oZj1cIlRoZSBzZXJ2aWNlIGlzIHVuYXZhaWxhYmxlXCIpO2Y9RXJyb3IoYitcIjogXCIrZik7Zi5jb2RlPWIudG9VcHBlckNhc2UoKTtyZXR1cm4gYS5rYihjLG51bGwsZil9fX1mdW5jdGlvbiBzZihhKXtyZXR1cm4gYS5wYXRoLnRvU3RyaW5nKCkrXCIkXCIrYS53YSgpfWZ1bmN0aW9uIHBmKGEpe3ZhciBiPWEuaW5kZXhPZihcIiRcIik7SigtMSE9PWImJmI8YS5sZW5ndGgtMSxcIkJhZCBxdWVyeUtleS5cIik7cmV0dXJue0liOmEuc3Vic3RyKGIrMSkscGF0aDpuZXcgSyhhLnN1YnN0cigwLGIpKX19ZnVuY3Rpb24gb2YoYSxiKXt2YXIgYz1hLiRlLGQ9XCJfXCIrYjtyZXR1cm4gZCBpbiBjP2NbZF06dm9pZCAwfWZ1bmN0aW9uIHhmKGEsYil7dmFyIGM9c2YoYik7cmV0dXJuIHcoYS5rYyxjKX12YXIgdGY9MTtcbmZ1bmN0aW9uIHFmKGEsYixjKXt2YXIgZD1hLnNhLmdldChiKTtKKGQsXCJNaXNzaW5nIHN5bmMgcG9pbnQgZm9yIHF1ZXJ5IHRhZyB0aGF0IHdlJ3JlIHRyYWNraW5nXCIpO3JldHVybiBkLmJiKGMsbmV3IGJmKGIsYS5IYiksbnVsbCl9ZnVuY3Rpb24gamYoYSxiKXtyZXR1cm4gemYoYSxiLGEuc2EsbnVsbCxuZXcgYmYoRixhLkhiKSl9ZnVuY3Rpb24gemYoYSxiLGMsZCxlKXtpZihiLnBhdGguZSgpKXJldHVybiBBZihhLGIsYyxkLGUpO3ZhciBmPWMuZ2V0KEYpO251bGw9PWQmJm51bGwhPWYmJihkPWYuaGIoRikpO3ZhciBnPVtdLGs9TyhiLnBhdGgpLGw9Yi5XYyhrKTtpZigoYz1jLmNoaWxkcmVuLmdldChrKSkmJmwpdmFyIG09ZD9kLk0oayk6bnVsbCxrPWUudyhrKSxnPWcuY29uY2F0KHpmKGEsbCxjLG0saykpO2YmJihnPWcuY29uY2F0KGYuYmIoYixlLGQpKSk7cmV0dXJuIGd9XG5mdW5jdGlvbiBBZihhLGIsYyxkLGUpe3ZhciBmPWMuZ2V0KEYpO251bGw9PWQmJm51bGwhPWYmJihkPWYuaGIoRikpO3ZhciBnPVtdO2MuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYyxmKXt2YXIgbT1kP2QuTShjKTpudWxsLHY9ZS53KGMpLHk9Yi5XYyhjKTt5JiYoZz1nLmNvbmNhdChBZihhLHksZixtLHYpKSl9KTtmJiYoZz1nLmNvbmNhdChmLmJiKGIsZSxkKSkpO3JldHVybiBnfTtmdW5jdGlvbiBCZigpe3RoaXMuY2hpbGRyZW49e307dGhpcy5rZD0wO3RoaXMudmFsdWU9bnVsbH1mdW5jdGlvbiBDZihhLGIsYyl7dGhpcy5EZD1hP2E6XCJcIjt0aGlzLlljPWI/YjpudWxsO3RoaXMuQj1jP2M6bmV3IEJmfWZ1bmN0aW9uIERmKGEsYil7Zm9yKHZhciBjPWIgaW5zdGFuY2VvZiBLP2I6bmV3IEsoYiksZD1hLGU7bnVsbCE9PShlPU8oYykpOylkPW5ldyBDZihlLGQsdyhkLkIuY2hpbGRyZW4sZSl8fG5ldyBCZiksYz1HKGMpO3JldHVybiBkfWg9Q2YucHJvdG90eXBlO2guQmE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5CLnZhbHVlfTtmdW5jdGlvbiBFZihhLGIpe0ooXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBiLFwiQ2Fubm90IHNldCB2YWx1ZSB0byB1bmRlZmluZWRcIik7YS5CLnZhbHVlPWI7RmYoYSl9aC5jbGVhcj1mdW5jdGlvbigpe3RoaXMuQi52YWx1ZT1udWxsO3RoaXMuQi5jaGlsZHJlbj17fTt0aGlzLkIua2Q9MDtGZih0aGlzKX07XG5oLnRkPWZ1bmN0aW9uKCl7cmV0dXJuIDA8dGhpcy5CLmtkfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbD09PXRoaXMuQmEoKSYmIXRoaXMudGQoKX07aC5VPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7cih0aGlzLkIuY2hpbGRyZW4sZnVuY3Rpb24oYyxkKXthKG5ldyBDZihkLGIsYykpfSl9O2Z1bmN0aW9uIEdmKGEsYixjLGQpe2MmJiFkJiZiKGEpO2EuVShmdW5jdGlvbihhKXtHZihhLGIsITAsZCl9KTtjJiZkJiZiKGEpfWZ1bmN0aW9uIEhmKGEsYil7Zm9yKHZhciBjPWEucGFyZW50KCk7bnVsbCE9PWMmJiFiKGMpOyljPWMucGFyZW50KCl9aC5wYXRoPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBLKG51bGw9PT10aGlzLlljP3RoaXMuRGQ6dGhpcy5ZYy5wYXRoKCkrXCIvXCIrdGhpcy5EZCl9O2gubmFtZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkRkfTtoLnBhcmVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLlljfTtcbmZ1bmN0aW9uIEZmKGEpe2lmKG51bGwhPT1hLlljKXt2YXIgYj1hLlljLGM9YS5EZCxkPWEuZSgpLGU9dShiLkIuY2hpbGRyZW4sYyk7ZCYmZT8oZGVsZXRlIGIuQi5jaGlsZHJlbltjXSxiLkIua2QtLSxGZihiKSk6ZHx8ZXx8KGIuQi5jaGlsZHJlbltjXT1hLkIsYi5CLmtkKyssRmYoYikpfX07ZnVuY3Rpb24gSWYoYSl7SihlYShhKSYmMDxhLmxlbmd0aCxcIlJlcXVpcmVzIGEgbm9uLWVtcHR5IGFycmF5XCIpO3RoaXMuVWY9YTt0aGlzLk5jPXt9fUlmLnByb3RvdHlwZS5kZT1mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz10aGlzLk5jW2FdfHxbXSxkPTA7ZDxjLmxlbmd0aDtkKyspY1tkXS55Yy5hcHBseShjW2RdLk1hLEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSl9O0lmLnByb3RvdHlwZS5FYj1mdW5jdGlvbihhLGIsYyl7SmYodGhpcyxhKTt0aGlzLk5jW2FdPXRoaXMuTmNbYV18fFtdO3RoaXMuTmNbYV0ucHVzaCh7eWM6YixNYTpjfSk7KGE9dGhpcy56ZShhKSkmJmIuYXBwbHkoYyxhKX07SWYucHJvdG90eXBlLmdjPWZ1bmN0aW9uKGEsYixjKXtKZih0aGlzLGEpO2E9dGhpcy5OY1thXXx8W107Zm9yKHZhciBkPTA7ZDxhLmxlbmd0aDtkKyspaWYoYVtkXS55Yz09PWImJighY3x8Yz09PWFbZF0uTWEpKXthLnNwbGljZShkLDEpO2JyZWFrfX07XG5mdW5jdGlvbiBKZihhLGIpe0ooVGEoYS5VZixmdW5jdGlvbihhKXtyZXR1cm4gYT09PWJ9KSxcIlVua25vd24gZXZlbnQ6IFwiK2IpfTt2YXIgS2Y9ZnVuY3Rpb24oKXt2YXIgYT0wLGI9W107cmV0dXJuIGZ1bmN0aW9uKGMpe3ZhciBkPWM9PT1hO2E9Yztmb3IodmFyIGU9QXJyYXkoOCksZj03OzA8PWY7Zi0tKWVbZl09XCItMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaX2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGMlNjQpLGM9TWF0aC5mbG9vcihjLzY0KTtKKDA9PT1jLFwiQ2Fubm90IHB1c2ggYXQgdGltZSA9PSAwXCIpO2M9ZS5qb2luKFwiXCIpO2lmKGQpe2ZvcihmPTExOzA8PWYmJjYzPT09YltmXTtmLS0pYltmXT0wO2JbZl0rK31lbHNlIGZvcihmPTA7MTI+ZjtmKyspYltmXT1NYXRoLmZsb29yKDY0Kk1hdGgucmFuZG9tKCkpO2ZvcihmPTA7MTI+ZjtmKyspYys9XCItMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaX2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIuY2hhckF0KGJbZl0pO0ooMjA9PT1jLmxlbmd0aCxcIm5leHRQdXNoSWQ6IExlbmd0aCBzaG91bGQgYmUgMjAuXCIpO1xucmV0dXJuIGN9fSgpO2Z1bmN0aW9uIExmKCl7SWYuY2FsbCh0aGlzLFtcIm9ubGluZVwiXSk7dGhpcy5pYz0hMDtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcil7dmFyIGE9dGhpczt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9ubGluZVwiLGZ1bmN0aW9uKCl7YS5pY3x8KGEuaWM9ITAsYS5kZShcIm9ubGluZVwiLCEwKSl9LCExKTt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm9mZmxpbmVcIixmdW5jdGlvbigpe2EuaWMmJihhLmljPSExLGEuZGUoXCJvbmxpbmVcIiwhMSkpfSwhMSl9fW1hKExmLElmKTtMZi5wcm90b3R5cGUuemU9ZnVuY3Rpb24oYSl7SihcIm9ubGluZVwiPT09YSxcIlVua25vd24gZXZlbnQgdHlwZTogXCIrYSk7cmV0dXJuW3RoaXMuaWNdfTtjYShMZik7ZnVuY3Rpb24gTWYoKXtJZi5jYWxsKHRoaXMsW1widmlzaWJsZVwiXSk7dmFyIGEsYjtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50JiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXImJihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50LmhpZGRlbj8oYj1cInZpc2liaWxpdHljaGFuZ2VcIixhPVwiaGlkZGVuXCIpOlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuPyhiPVwibW96dmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJtb3pIaWRkZW5cIik6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbj8oYj1cIm1zdmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJtc0hpZGRlblwiKTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiYmKGI9XCJ3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cIndlYmtpdEhpZGRlblwiKSk7dGhpcy51Yz0hMDtpZihiKXt2YXIgYz10aGlzO2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoYixcbmZ1bmN0aW9uKCl7dmFyIGI9IWRvY3VtZW50W2FdO2IhPT1jLnVjJiYoYy51Yz1iLGMuZGUoXCJ2aXNpYmxlXCIsYikpfSwhMSl9fW1hKE1mLElmKTtNZi5wcm90b3R5cGUuemU9ZnVuY3Rpb24oYSl7SihcInZpc2libGVcIj09PWEsXCJVbmtub3duIGV2ZW50IHR5cGU6IFwiK2EpO3JldHVyblt0aGlzLnVjXX07Y2EoTWYpO3ZhciBOZj0vW1xcW1xcXS4jJFxcL1xcdTAwMDAtXFx1MDAxRlxcdTAwN0ZdLyxPZj0vW1xcW1xcXS4jJFxcdTAwMDAtXFx1MDAxRlxcdTAwN0ZdLztmdW5jdGlvbiBQZihhKXtyZXR1cm4gcChhKSYmMCE9PWEubGVuZ3RoJiYhTmYudGVzdChhKX1mdW5jdGlvbiBRZihhKXtyZXR1cm4gbnVsbD09PWF8fHAoYSl8fGdhKGEpJiYhU2MoYSl8fGlhKGEpJiZ1KGEsXCIuc3ZcIil9ZnVuY3Rpb24gUmYoYSxiLGMsZCl7ZCYmIW4oYil8fFNmKHooYSwxLGQpLGIsYyl9XG5mdW5jdGlvbiBTZihhLGIsYyl7YyBpbnN0YW5jZW9mIEsmJihjPW5ldyB3YyhjLGEpKTtpZighbihiKSl0aHJvdyBFcnJvcihhK1wiY29udGFpbnMgdW5kZWZpbmVkIFwiK3pjKGMpKTtpZihoYShiKSl0aHJvdyBFcnJvcihhK1wiY29udGFpbnMgYSBmdW5jdGlvbiBcIit6YyhjKStcIiB3aXRoIGNvbnRlbnRzOiBcIitiLnRvU3RyaW5nKCkpO2lmKFNjKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyBcIitiLnRvU3RyaW5nKCkrXCIgXCIremMoYykpO2lmKHAoYikmJmIubGVuZ3RoPjEwNDg1NzYwLzMmJjEwNDg1NzYwPHhjKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyBhIHN0cmluZyBncmVhdGVyIHRoYW4gMTA0ODU3NjAgdXRmOCBieXRlcyBcIit6YyhjKStcIiAoJ1wiK2Iuc3Vic3RyaW5nKDAsNTApK1wiLi4uJylcIik7aWYoaWEoYikpe3ZhciBkPSExLGU9ITE7aGIoYixmdW5jdGlvbihiLGcpe2lmKFwiLnZhbHVlXCI9PT1iKWQ9ITA7ZWxzZSBpZihcIi5wcmlvcml0eVwiIT09YiYmXCIuc3ZcIiE9PWImJihlPVxuITAsIVBmKGIpKSl0aHJvdyBFcnJvcihhK1wiIGNvbnRhaW5zIGFuIGludmFsaWQga2V5IChcIitiK1wiKSBcIit6YyhjKSsnLiAgS2V5cyBtdXN0IGJlIG5vbi1lbXB0eSBzdHJpbmdzIGFuZCBjYW5cXCd0IGNvbnRhaW4gXCIuXCIsIFwiI1wiLCBcIiRcIiwgXCIvXCIsIFwiW1wiLCBvciBcIl1cIicpO2MucHVzaChiKTtTZihhLGcsYyk7Yy5wb3AoKX0pO2lmKGQmJmUpdGhyb3cgRXJyb3IoYSsnIGNvbnRhaW5zIFwiLnZhbHVlXCIgY2hpbGQgJyt6YyhjKStcIiBpbiBhZGRpdGlvbiB0byBhY3R1YWwgY2hpbGRyZW4uXCIpO319XG5mdW5jdGlvbiBUZihhLGIsYyl7aWYoIWlhKGIpfHxlYShiKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrXCIgbXVzdCBiZSBhbiBPYmplY3QgY29udGFpbmluZyB0aGUgY2hpbGRyZW4gdG8gcmVwbGFjZS5cIik7aWYodShiLFwiLnZhbHVlXCIpKXRocm93IEVycm9yKHooYSwxLCExKSsnIG11c3Qgbm90IGNvbnRhaW4gXCIudmFsdWVcIi4gIFRvIG92ZXJ3cml0ZSB3aXRoIGEgbGVhZiB2YWx1ZSwganVzdCB1c2UgLnNldCgpIGluc3RlYWQuJyk7UmYoYSxiLGMsITEpfVxuZnVuY3Rpb24gVWYoYSxiLGMpe2lmKFNjKGMpKXRocm93IEVycm9yKHooYSxiLCExKStcImlzIFwiK2MudG9TdHJpbmcoKStcIiwgYnV0IG11c3QgYmUgYSB2YWxpZCBGaXJlYmFzZSBwcmlvcml0eSAoYSBzdHJpbmcsIGZpbml0ZSBudW1iZXIsIHNlcnZlciB2YWx1ZSwgb3IgbnVsbCkuXCIpO2lmKCFRZihjKSl0aHJvdyBFcnJvcih6KGEsYiwhMSkrXCJtdXN0IGJlIGEgdmFsaWQgRmlyZWJhc2UgcHJpb3JpdHkgKGEgc3RyaW5nLCBmaW5pdGUgbnVtYmVyLCBzZXJ2ZXIgdmFsdWUsIG9yIG51bGwpLlwiKTt9XG5mdW5jdGlvbiBWZihhLGIsYyl7aWYoIWN8fG4oYikpc3dpdGNoKGIpe2Nhc2UgXCJ2YWx1ZVwiOmNhc2UgXCJjaGlsZF9hZGRlZFwiOmNhc2UgXCJjaGlsZF9yZW1vdmVkXCI6Y2FzZSBcImNoaWxkX2NoYW5nZWRcIjpjYXNlIFwiY2hpbGRfbW92ZWRcIjpicmVhaztkZWZhdWx0OnRocm93IEVycm9yKHooYSwxLGMpKydtdXN0IGJlIGEgdmFsaWQgZXZlbnQgdHlwZTogXCJ2YWx1ZVwiLCBcImNoaWxkX2FkZGVkXCIsIFwiY2hpbGRfcmVtb3ZlZFwiLCBcImNoaWxkX2NoYW5nZWRcIiwgb3IgXCJjaGlsZF9tb3ZlZFwiLicpO319ZnVuY3Rpb24gV2YoYSxiLGMsZCl7aWYoKCFkfHxuKGMpKSYmIVBmKGMpKXRocm93IEVycm9yKHooYSxiLGQpKyd3YXMgYW4gaW52YWxpZCBrZXk6IFwiJytjKydcIi4gIEZpcmViYXNlIGtleXMgbXVzdCBiZSBub24tZW1wdHkgc3RyaW5ncyBhbmQgY2FuXFwndCBjb250YWluIFwiLlwiLCBcIiNcIiwgXCIkXCIsIFwiL1wiLCBcIltcIiwgb3IgXCJdXCIpLicpO31cbmZ1bmN0aW9uIFhmKGEsYil7aWYoIXAoYil8fDA9PT1iLmxlbmd0aHx8T2YudGVzdChiKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrJ3dhcyBhbiBpbnZhbGlkIHBhdGg6IFwiJytiKydcIi4gUGF0aHMgbXVzdCBiZSBub24tZW1wdHkgc3RyaW5ncyBhbmQgY2FuXFwndCBjb250YWluIFwiLlwiLCBcIiNcIiwgXCIkXCIsIFwiW1wiLCBvciBcIl1cIicpO31mdW5jdGlvbiBZZihhLGIpe2lmKFwiLmluZm9cIj09PU8oYikpdGhyb3cgRXJyb3IoYStcIiBmYWlsZWQ6IENhbid0IG1vZGlmeSBkYXRhIHVuZGVyIC8uaW5mby9cIik7fWZ1bmN0aW9uIFpmKGEsYil7aWYoIXAoYikpdGhyb3cgRXJyb3IoeihhLDEsITEpK1wibXVzdCBiZSBhIHZhbGlkIGNyZWRlbnRpYWwgKGEgc3RyaW5nKS5cIik7fWZ1bmN0aW9uICRmKGEsYixjKXtpZighcChjKSl0aHJvdyBFcnJvcih6KGEsYiwhMSkrXCJtdXN0IGJlIGEgdmFsaWQgc3RyaW5nLlwiKTt9XG5mdW5jdGlvbiBhZyhhLGIsYyxkKXtpZighZHx8bihjKSlpZighaWEoYyl8fG51bGw9PT1jKXRocm93IEVycm9yKHooYSxiLGQpK1wibXVzdCBiZSBhIHZhbGlkIG9iamVjdC5cIik7fWZ1bmN0aW9uIGJnKGEsYixjKXtpZighaWEoYil8fG51bGw9PT1ifHwhdShiLGMpKXRocm93IEVycm9yKHooYSwxLCExKSsnbXVzdCBjb250YWluIHRoZSBrZXkgXCInK2MrJ1wiJyk7aWYoIXAodyhiLGMpKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrJ211c3QgY29udGFpbiB0aGUga2V5IFwiJytjKydcIiB3aXRoIHR5cGUgXCJzdHJpbmdcIicpO307ZnVuY3Rpb24gY2coKXt0aGlzLnNldD17fX1oPWNnLnByb3RvdHlwZTtoLmFkZD1mdW5jdGlvbihhLGIpe3RoaXMuc2V0W2FdPW51bGwhPT1iP2I6ITB9O2guY29udGFpbnM9ZnVuY3Rpb24oYSl7cmV0dXJuIHUodGhpcy5zZXQsYSl9O2guZ2V0PWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmNvbnRhaW5zKGEpP3RoaXMuc2V0W2FdOnZvaWQgMH07aC5yZW1vdmU9ZnVuY3Rpb24oYSl7ZGVsZXRlIHRoaXMuc2V0W2FdfTtoLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5zZXQ9e319O2guZT1mdW5jdGlvbigpe3JldHVybiB3YSh0aGlzLnNldCl9O2guY291bnQ9ZnVuY3Rpb24oKXtyZXR1cm4gcGEodGhpcy5zZXQpfTtmdW5jdGlvbiBkZyhhLGIpe3IoYS5zZXQsZnVuY3Rpb24oYSxkKXtiKGQsYSl9KX1oLmtleXM9ZnVuY3Rpb24oKXt2YXIgYT1bXTtyKHRoaXMuc2V0LGZ1bmN0aW9uKGIsYyl7YS5wdXNoKGMpfSk7cmV0dXJuIGF9O2Z1bmN0aW9uIHFjKCl7dGhpcy5tPXRoaXMuQz1udWxsfXFjLnByb3RvdHlwZS5maW5kPWZ1bmN0aW9uKGEpe2lmKG51bGwhPXRoaXMuQylyZXR1cm4gdGhpcy5DLm9hKGEpO2lmKGEuZSgpfHxudWxsPT10aGlzLm0pcmV0dXJuIG51bGw7dmFyIGI9TyhhKTthPUcoYSk7cmV0dXJuIHRoaXMubS5jb250YWlucyhiKT90aGlzLm0uZ2V0KGIpLmZpbmQoYSk6bnVsbH07cWMucHJvdG90eXBlLm1jPWZ1bmN0aW9uKGEsYil7aWYoYS5lKCkpdGhpcy5DPWIsdGhpcy5tPW51bGw7ZWxzZSBpZihudWxsIT09dGhpcy5DKXRoaXMuQz10aGlzLkMuRyhhLGIpO2Vsc2V7bnVsbD09dGhpcy5tJiYodGhpcy5tPW5ldyBjZyk7dmFyIGM9TyhhKTt0aGlzLm0uY29udGFpbnMoYyl8fHRoaXMubS5hZGQoYyxuZXcgcWMpO2M9dGhpcy5tLmdldChjKTthPUcoYSk7Yy5tYyhhLGIpfX07XG5mdW5jdGlvbiBlZyhhLGIpe2lmKGIuZSgpKXJldHVybiBhLkM9bnVsbCxhLm09bnVsbCwhMDtpZihudWxsIT09YS5DKXtpZihhLkMuTigpKXJldHVybiExO3ZhciBjPWEuQzthLkM9bnVsbDtjLlUoTSxmdW5jdGlvbihiLGMpe2EubWMobmV3IEsoYiksYyl9KTtyZXR1cm4gZWcoYSxiKX1yZXR1cm4gbnVsbCE9PWEubT8oYz1PKGIpLGI9RyhiKSxhLm0uY29udGFpbnMoYykmJmVnKGEubS5nZXQoYyksYikmJmEubS5yZW1vdmUoYyksYS5tLmUoKT8oYS5tPW51bGwsITApOiExKTohMH1mdW5jdGlvbiByYyhhLGIsYyl7bnVsbCE9PWEuQz9jKGIsYS5DKTphLlUoZnVuY3Rpb24oYSxlKXt2YXIgZj1uZXcgSyhiLnRvU3RyaW5nKCkrXCIvXCIrYSk7cmMoZSxmLGMpfSl9cWMucHJvdG90eXBlLlU9ZnVuY3Rpb24oYSl7bnVsbCE9PXRoaXMubSYmZGcodGhpcy5tLGZ1bmN0aW9uKGIsYyl7YShiLGMpfSl9O3ZhciBmZz1cImF1dGguZmlyZWJhc2UuY29tXCI7ZnVuY3Rpb24gZ2coYSxiLGMpe3RoaXMubGQ9YXx8e307dGhpcy5jZT1ifHx7fTt0aGlzLmFiPWN8fHt9O3RoaXMubGQucmVtZW1iZXJ8fCh0aGlzLmxkLnJlbWVtYmVyPVwiZGVmYXVsdFwiKX12YXIgaGc9W1wicmVtZW1iZXJcIixcInJlZGlyZWN0VG9cIl07ZnVuY3Rpb24gaWcoYSl7dmFyIGI9e30sYz17fTtoYihhfHx7fSxmdW5jdGlvbihhLGUpezA8PU5hKGhnLGEpP2JbYV09ZTpjW2FdPWV9KTtyZXR1cm4gbmV3IGdnKGIse30sYyl9O2Z1bmN0aW9uIGpnKGEsYil7dGhpcy5QZT1bXCJzZXNzaW9uXCIsYS5MZCxhLkNiXS5qb2luKFwiOlwiKTt0aGlzLiRkPWJ9amcucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe2lmKCFiKWlmKHRoaXMuJGQubGVuZ3RoKWI9dGhpcy4kZFswXTtlbHNlIHRocm93IEVycm9yKFwiZmIubG9naW4uU2Vzc2lvbk1hbmFnZXIgOiBObyBzdG9yYWdlIG9wdGlvbnMgYXZhaWxhYmxlIVwiKTtiLnNldCh0aGlzLlBlLGEpfTtqZy5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKCl7dmFyIGE9UWEodGhpcy4kZCxxKHRoaXMubmcsdGhpcykpLGE9UGEoYSxmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9PWF9KTtYYShhLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGJkKGMudG9rZW4pLWJkKGEudG9rZW4pfSk7cmV0dXJuIDA8YS5sZW5ndGg/YS5zaGlmdCgpOm51bGx9O2pnLnByb3RvdHlwZS5uZz1mdW5jdGlvbihhKXt0cnl7dmFyIGI9YS5nZXQodGhpcy5QZSk7aWYoYiYmYi50b2tlbilyZXR1cm4gYn1jYXRjaChjKXt9cmV0dXJuIG51bGx9O1xuamcucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcztPYSh0aGlzLiRkLGZ1bmN0aW9uKGIpe2IucmVtb3ZlKGEuUGUpfSl9O2Z1bmN0aW9uIGtnKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cmJiEhKHdpbmRvdy5jb3Jkb3ZhfHx3aW5kb3cucGhvbmVnYXB8fHdpbmRvdy5QaG9uZUdhcCkmJi9pb3N8aXBob25lfGlwb2R8aXBhZHxhbmRyb2lkfGJsYWNrYmVycnl8aWVtb2JpbGUvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpfWZ1bmN0aW9uIGxnKCl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBsb2NhdGlvbiYmL15maWxlOlxcLy8udGVzdChsb2NhdGlvbi5ocmVmKX1cbmZ1bmN0aW9uIG1nKCl7aWYoXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBuYXZpZ2F0b3IpcmV0dXJuITE7dmFyIGE9bmF2aWdhdG9yLnVzZXJBZ2VudDtpZihcIk1pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlclwiPT09bmF2aWdhdG9yLmFwcE5hbWUpe2lmKChhPWEubWF0Y2goL01TSUUgKFswLTldezEsfVtcXC4wLTldezAsfSkvKSkmJjE8YS5sZW5ndGgpcmV0dXJuIDg8PXBhcnNlRmxvYXQoYVsxXSl9ZWxzZSBpZigtMTxhLmluZGV4T2YoXCJUcmlkZW50XCIpJiYoYT1hLm1hdGNoKC9ydjooWzAtOV17MiwyfVtcXC4wLTldezAsfSkvKSkmJjE8YS5sZW5ndGgpcmV0dXJuIDg8PXBhcnNlRmxvYXQoYVsxXSk7cmV0dXJuITF9O2Z1bmN0aW9uIG5nKCl7dmFyIGE9d2luZG93Lm9wZW5lci5mcmFtZXMsYjtmb3IoYj1hLmxlbmd0aC0xOzA8PWI7Yi0tKXRyeXtpZihhW2JdLmxvY2F0aW9uLnByb3RvY29sPT09d2luZG93LmxvY2F0aW9uLnByb3RvY29sJiZhW2JdLmxvY2F0aW9uLmhvc3Q9PT13aW5kb3cubG9jYXRpb24uaG9zdCYmXCJfX3dpbmNoYW5fcmVsYXlfZnJhbWVcIj09PWFbYl0ubmFtZSlyZXR1cm4gYVtiXX1jYXRjaChjKXt9cmV0dXJuIG51bGx9ZnVuY3Rpb24gb2coYSxiLGMpe2EuYXR0YWNoRXZlbnQ/YS5hdHRhY2hFdmVudChcIm9uXCIrYixjKTphLmFkZEV2ZW50TGlzdGVuZXImJmEuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITEpfWZ1bmN0aW9uIHBnKGEsYixjKXthLmRldGFjaEV2ZW50P2EuZGV0YWNoRXZlbnQoXCJvblwiK2IsYyk6YS5yZW1vdmVFdmVudExpc3RlbmVyJiZhLnJlbW92ZUV2ZW50TGlzdGVuZXIoYixjLCExKX1cbmZ1bmN0aW9uIHFnKGEpey9eaHR0cHM/OlxcL1xcLy8udGVzdChhKXx8KGE9d2luZG93LmxvY2F0aW9uLmhyZWYpO3ZhciBiPS9eKGh0dHBzPzpcXC9cXC9bXFwtX2EtekEtWlxcLjAtOTpdKykvLmV4ZWMoYSk7cmV0dXJuIGI/YlsxXTphfWZ1bmN0aW9uIHJnKGEpe3ZhciBiPVwiXCI7dHJ5e2E9YS5yZXBsYWNlKFwiI1wiLFwiXCIpO3ZhciBjPWtiKGEpO2MmJnUoYyxcIl9fZmlyZWJhc2VfcmVxdWVzdF9rZXlcIikmJihiPXcoYyxcIl9fZmlyZWJhc2VfcmVxdWVzdF9rZXlcIikpfWNhdGNoKGQpe31yZXR1cm4gYn1mdW5jdGlvbiBzZygpe3ZhciBhPVJjKGZnKTtyZXR1cm4gYS5zY2hlbWUrXCI6Ly9cIithLmhvc3QrXCIvdjJcIn1mdW5jdGlvbiB0ZyhhKXtyZXR1cm4gc2coKStcIi9cIithK1wiL2F1dGgvY2hhbm5lbFwifTtmdW5jdGlvbiB1ZyhhKXt2YXIgYj10aGlzO3RoaXMuemM9YTt0aGlzLmFlPVwiKlwiO21nKCk/dGhpcy5RYz10aGlzLndkPW5nKCk6KHRoaXMuUWM9d2luZG93Lm9wZW5lcix0aGlzLndkPXdpbmRvdyk7aWYoIWIuUWMpdGhyb3dcIlVuYWJsZSB0byBmaW5kIHJlbGF5IGZyYW1lXCI7b2codGhpcy53ZCxcIm1lc3NhZ2VcIixxKHRoaXMuaGMsdGhpcykpO29nKHRoaXMud2QsXCJtZXNzYWdlXCIscSh0aGlzLkFmLHRoaXMpKTt0cnl7dmcodGhpcyx7YTpcInJlYWR5XCJ9KX1jYXRjaChjKXtvZyh0aGlzLlFjLFwibG9hZFwiLGZ1bmN0aW9uKCl7dmcoYix7YTpcInJlYWR5XCJ9KX0pfW9nKHdpbmRvdyxcInVubG9hZFwiLHEodGhpcy55Zyx0aGlzKSl9ZnVuY3Rpb24gdmcoYSxiKXtiPUIoYik7bWcoKT9hLlFjLmRvUG9zdChiLGEuYWUpOmEuUWMucG9zdE1lc3NhZ2UoYixhLmFlKX1cbnVnLnByb3RvdHlwZS5oYz1mdW5jdGlvbihhKXt2YXIgYj10aGlzLGM7dHJ5e2M9bWIoYS5kYXRhKX1jYXRjaChkKXt9YyYmXCJyZXF1ZXN0XCI9PT1jLmEmJihwZyh3aW5kb3csXCJtZXNzYWdlXCIsdGhpcy5oYyksdGhpcy5hZT1hLm9yaWdpbix0aGlzLnpjJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yi56YyhiLmFlLGMuZCxmdW5jdGlvbihhLGMpe2IuYWc9IWM7Yi56Yz12b2lkIDA7dmcoYix7YTpcInJlc3BvbnNlXCIsZDphLGZvcmNlS2VlcFdpbmRvd09wZW46Y30pfSl9LDApKX07dWcucHJvdG90eXBlLnlnPWZ1bmN0aW9uKCl7dHJ5e3BnKHRoaXMud2QsXCJtZXNzYWdlXCIsdGhpcy5BZil9Y2F0Y2goYSl7fXRoaXMuemMmJih2Zyh0aGlzLHthOlwiZXJyb3JcIixkOlwidW5rbm93biBjbG9zZWQgd2luZG93XCJ9KSx0aGlzLnpjPXZvaWQgMCk7dHJ5e3dpbmRvdy5jbG9zZSgpfWNhdGNoKGIpe319O3VnLnByb3RvdHlwZS5BZj1mdW5jdGlvbihhKXtpZih0aGlzLmFnJiZcImRpZVwiPT09YS5kYXRhKXRyeXt3aW5kb3cuY2xvc2UoKX1jYXRjaChiKXt9fTtmdW5jdGlvbiB3ZyhhKXt0aGlzLm9jPUdhKCkrR2EoKStHYSgpO3RoaXMuRGY9YX13Zy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIpe1Auc2V0KFwicmVkaXJlY3RfcmVxdWVzdF9pZFwiLHRoaXMub2MpO1Auc2V0KFwicmVkaXJlY3RfcmVxdWVzdF9pZFwiLHRoaXMub2MpO2IucmVxdWVzdElkPXRoaXMub2M7Yi5yZWRpcmVjdFRvPWIucmVkaXJlY3RUb3x8d2luZG93LmxvY2F0aW9uLmhyZWY7YSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikramIoYik7d2luZG93LmxvY2F0aW9uPWF9O3dnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuIWxnKCkmJiFrZygpfTt3Zy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cInJlZGlyZWN0XCJ9O3ZhciB4Zz17TkVUV09SS19FUlJPUjpcIlVuYWJsZSB0byBjb250YWN0IHRoZSBGaXJlYmFzZSBzZXJ2ZXIuXCIsU0VSVkVSX0VSUk9SOlwiQW4gdW5rbm93biBzZXJ2ZXIgZXJyb3Igb2NjdXJyZWQuXCIsVFJBTlNQT1JUX1VOQVZBSUxBQkxFOlwiVGhlcmUgYXJlIG5vIGxvZ2luIHRyYW5zcG9ydHMgYXZhaWxhYmxlIGZvciB0aGUgcmVxdWVzdGVkIG1ldGhvZC5cIixSRVFVRVNUX0lOVEVSUlVQVEVEOlwiVGhlIGJyb3dzZXIgcmVkaXJlY3RlZCB0aGUgcGFnZSBiZWZvcmUgdGhlIGxvZ2luIHJlcXVlc3QgY291bGQgY29tcGxldGUuXCIsVVNFUl9DQU5DRUxMRUQ6XCJUaGUgdXNlciBjYW5jZWxsZWQgYXV0aGVudGljYXRpb24uXCJ9O2Z1bmN0aW9uIHlnKGEpe3ZhciBiPUVycm9yKHcoeGcsYSksYSk7Yi5jb2RlPWE7cmV0dXJuIGJ9O2Z1bmN0aW9uIHpnKGEpe2lmKCFhLndpbmRvd19mZWF0dXJlc3x8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJigtMSE9PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZlbm5lYy9cIil8fC0xIT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiRmlyZWZveC9cIikmJi0xIT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiQW5kcm9pZFwiKSkpYS53aW5kb3dfZmVhdHVyZXM9dm9pZCAwO2Eud2luZG93X25hbWV8fChhLndpbmRvd19uYW1lPVwiX2JsYW5rXCIpO3RoaXMub3B0aW9ucz1hfVxuemcucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7ZyYmKGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZyksZz12b2lkIDApO3YmJih2PWNsZWFySW50ZXJ2YWwodikpO3BnKHdpbmRvdyxcIm1lc3NhZ2VcIixlKTtwZyh3aW5kb3csXCJ1bmxvYWRcIixkKTtpZihtJiYhYSl0cnl7bS5jbG9zZSgpfWNhdGNoKGIpe2sucG9zdE1lc3NhZ2UoXCJkaWVcIixsKX1tPWs9dm9pZCAwfWZ1bmN0aW9uIGUoYSl7aWYoYS5vcmlnaW49PT1sKXRyeXt2YXIgYj1tYihhLmRhdGEpO1wicmVhZHlcIj09PWIuYT9rLnBvc3RNZXNzYWdlKHksbCk6XCJlcnJvclwiPT09Yi5hPyhkKCExKSxjJiYoYyhiLmQpLGM9bnVsbCkpOlwicmVzcG9uc2VcIj09PWIuYSYmKGQoYi5mb3JjZUtlZXBXaW5kb3dPcGVuKSxjJiYoYyhudWxsLGIuZCksYz1udWxsKSl9Y2F0Y2goZSl7fX12YXIgZj1tZygpLGcsaztpZighdGhpcy5vcHRpb25zLnJlbGF5X3VybClyZXR1cm4gYyhFcnJvcihcImludmFsaWQgYXJndW1lbnRzOiBvcmlnaW4gb2YgdXJsIGFuZCByZWxheV91cmwgbXVzdCBtYXRjaFwiKSk7XG52YXIgbD1xZyhhKTtpZihsIT09cWcodGhpcy5vcHRpb25zLnJlbGF5X3VybCkpYyYmc2V0VGltZW91dChmdW5jdGlvbigpe2MoRXJyb3IoXCJpbnZhbGlkIGFyZ3VtZW50czogb3JpZ2luIG9mIHVybCBhbmQgcmVsYXlfdXJsIG11c3QgbWF0Y2hcIikpfSwwKTtlbHNle2YmJihnPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIiksZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIix0aGlzLm9wdGlvbnMucmVsYXlfdXJsKSxnLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsZy5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsXCJfX3dpbmNoYW5fcmVsYXlfZnJhbWVcIiksZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChnKSxrPWcuY29udGVudFdpbmRvdyk7YSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikramIoYik7dmFyIG09d2luZG93Lm9wZW4oYSx0aGlzLm9wdGlvbnMud2luZG93X25hbWUsdGhpcy5vcHRpb25zLndpbmRvd19mZWF0dXJlcyk7a3x8KGs9bSk7dmFyIHY9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXttJiZtLmNsb3NlZCYmXG4oZCghMSksYyYmKGMoeWcoXCJVU0VSX0NBTkNFTExFRFwiKSksYz1udWxsKSl9LDUwMCkseT1CKHthOlwicmVxdWVzdFwiLGQ6Yn0pO29nKHdpbmRvdyxcInVubG9hZFwiLGQpO29nKHdpbmRvdyxcIm1lc3NhZ2VcIixlKX19O1xuemcuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm5cInBvc3RNZXNzYWdlXCJpbiB3aW5kb3cmJiFsZygpJiYhKGtnKCl8fFwidW5kZWZpbmVkXCIhPT10eXBlb2YgbmF2aWdhdG9yJiYobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvV2luZG93cyBQaG9uZS8pfHx3aW5kb3cuV2luZG93cyYmL15tcy1hcHB4Oi8udGVzdChsb2NhdGlvbi5ocmVmKSl8fFwidW5kZWZpbmVkXCIhPT10eXBlb2YgbmF2aWdhdG9yJiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhpUGhvbmV8aVBvZHxpUGFkKS4qQXBwbGVXZWJLaXQoPyEuKlNhZmFyaSkvaSl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0NyaU9TLyl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1R3aXR0ZXIgZm9yIGlQaG9uZS8pfHxuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9GQkFOXFwvRkJJT1MvKXx8d2luZG93Lm5hdmlnYXRvci5zdGFuZGFsb25lKSkmJiEoXCJ1bmRlZmluZWRcIiE9PVxudHlwZW9mIG5hdmlnYXRvciYmbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvUGhhbnRvbUpTLykpfTt6Zy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cInBvcHVwXCJ9O2Z1bmN0aW9uIEFnKGEpe2EubWV0aG9kfHwoYS5tZXRob2Q9XCJHRVRcIik7YS5oZWFkZXJzfHwoYS5oZWFkZXJzPXt9KTthLmhlYWRlcnMuY29udGVudF90eXBlfHwoYS5oZWFkZXJzLmNvbnRlbnRfdHlwZT1cImFwcGxpY2F0aW9uL2pzb25cIik7YS5oZWFkZXJzLmNvbnRlbnRfdHlwZT1hLmhlYWRlcnMuY29udGVudF90eXBlLnRvTG93ZXJDYXNlKCk7dGhpcy5vcHRpb25zPWF9XG5BZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKHlnKFwiUkVRVUVTVF9JTlRFUlJVUFRFRFwiKSksYz1udWxsKX12YXIgZT1uZXcgWE1MSHR0cFJlcXVlc3QsZj10aGlzLm9wdGlvbnMubWV0aG9kLnRvVXBwZXJDYXNlKCksZztvZyh3aW5kb3csXCJiZWZvcmV1bmxvYWRcIixkKTtlLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2lmKGMmJjQ9PT1lLnJlYWR5U3RhdGUpe3ZhciBhO2lmKDIwMDw9ZS5zdGF0dXMmJjMwMD5lLnN0YXR1cyl7dHJ5e2E9bWIoZS5yZXNwb25zZVRleHQpfWNhdGNoKGIpe31jKG51bGwsYSl9ZWxzZSA1MDA8PWUuc3RhdHVzJiY2MDA+ZS5zdGF0dXM/Yyh5ZyhcIlNFUlZFUl9FUlJPUlwiKSk6Yyh5ZyhcIk5FVFdPUktfRVJST1JcIikpO2M9bnVsbDtwZyh3aW5kb3csXCJiZWZvcmV1bmxvYWRcIixkKX19O2lmKFwiR0VUXCI9PT1mKWErPSgvXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCIpK2piKGIpLGc9bnVsbDtlbHNle3ZhciBrPXRoaXMub3B0aW9ucy5oZWFkZXJzLmNvbnRlbnRfdHlwZTtcblwiYXBwbGljYXRpb24vanNvblwiPT09ayYmKGc9QihiKSk7XCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIj09PWsmJihnPWpiKGIpKX1lLm9wZW4oZixhLCEwKTthPXtcIlgtUmVxdWVzdGVkLVdpdGhcIjpcIlhNTEh0dHBSZXF1ZXN0XCIsQWNjZXB0OlwiYXBwbGljYXRpb24vanNvbjt0ZXh0L3BsYWluXCJ9O3phKGEsdGhpcy5vcHRpb25zLmhlYWRlcnMpO2Zvcih2YXIgbCBpbiBhKWUuc2V0UmVxdWVzdEhlYWRlcihsLGFbbF0pO2Uuc2VuZChnKX07QWcuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hIXdpbmRvdy5YTUxIdHRwUmVxdWVzdCYmXCJzdHJpbmdcIj09PXR5cGVvZihuZXcgWE1MSHR0cFJlcXVlc3QpLnJlc3BvbnNlVHlwZSYmKCEoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJihuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9NU0lFLyl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1RyaWRlbnQvKSkpfHxtZygpKX07QWcucHJvdG90eXBlLkJjPWZ1bmN0aW9uKCl7cmV0dXJuXCJqc29uXCJ9O2Z1bmN0aW9uIEJnKGEpe3RoaXMub2M9R2EoKStHYSgpK0dhKCk7dGhpcy5EZj1hfVxuQmcucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoKXtjJiYoYyh5ZyhcIlVTRVJfQ0FOQ0VMTEVEXCIpKSxjPW51bGwpfXZhciBlPXRoaXMsZj1SYyhmZyksZztiLnJlcXVlc3RJZD10aGlzLm9jO2IucmVkaXJlY3RUbz1mLnNjaGVtZStcIjovL1wiK2YuaG9zdCtcIi9ibGFuay9wYWdlLmh0bWxcIjthKz0vXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCI7YSs9amIoYik7KGc9d2luZG93Lm9wZW4oYSxcIl9ibGFua1wiLFwibG9jYXRpb249bm9cIikpJiZoYShnLmFkZEV2ZW50TGlzdGVuZXIpPyhnLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2Fkc3RhcnRcIixmdW5jdGlvbihhKXt2YXIgYjtpZihiPWEmJmEudXJsKWE6e3RyeXt2YXIgbT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTttLmhyZWY9YS51cmw7Yj1tLmhvc3Q9PT1mLmhvc3QmJlwiL2JsYW5rL3BhZ2UuaHRtbFwiPT09bS5wYXRobmFtZTticmVhayBhfWNhdGNoKHYpe31iPSExfWImJihhPXJnKGEudXJsKSxnLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJleGl0XCIsXG5kKSxnLmNsb3NlKCksYT1uZXcgZ2cobnVsbCxudWxsLHtyZXF1ZXN0SWQ6ZS5vYyxyZXF1ZXN0S2V5OmF9KSxlLkRmLnJlcXVlc3RXaXRoQ3JlZGVudGlhbChcIi9hdXRoL3Nlc3Npb25cIixhLGMpLGM9bnVsbCl9KSxnLmFkZEV2ZW50TGlzdGVuZXIoXCJleGl0XCIsZCkpOmMoeWcoXCJUUkFOU1BPUlRfVU5BVkFJTEFCTEVcIikpfTtCZy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiBrZygpfTtCZy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cInJlZGlyZWN0XCJ9O2Z1bmN0aW9uIENnKGEpe2EuY2FsbGJhY2tfcGFyYW1ldGVyfHwoYS5jYWxsYmFja19wYXJhbWV0ZXI9XCJjYWxsYmFja1wiKTt0aGlzLm9wdGlvbnM9YTt3aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wPXdpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnB8fHt9fVxuQ2cucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoKXtjJiYoYyh5ZyhcIlJFUVVFU1RfSU5URVJSVVBURURcIikpLGM9bnVsbCl9ZnVuY3Rpb24gZSgpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt3aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wW2ZdPXZvaWQgMDt3YSh3aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wKSYmKHdpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnA9dm9pZCAwKTt0cnl7dmFyIGE9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZik7YSYmYS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGEpfWNhdGNoKGIpe319LDEpO3BnKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpfXZhciBmPVwiZm5cIisobmV3IERhdGUpLmdldFRpbWUoKStNYXRoLmZsb29yKDk5OTk5Kk1hdGgucmFuZG9tKCkpO2JbdGhpcy5vcHRpb25zLmNhbGxiYWNrX3BhcmFtZXRlcl09XCJfX2ZpcmViYXNlX2F1dGhfanNvbnAuXCIrZjthKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKStqYihiKTtcbm9nKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpO3dpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnBbZl09ZnVuY3Rpb24oYSl7YyYmKGMobnVsbCxhKSxjPW51bGwpO2UoKX07RGcoZixhLGMpfTtcbmZ1bmN0aW9uIERnKGEsYixjKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dHJ5e3ZhciBkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7ZC50eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI7ZC5pZD1hO2QuYXN5bmM9ITA7ZC5zcmM9YjtkLm9uZXJyb3I9ZnVuY3Rpb24oKXt2YXIgYj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChhKTtudWxsIT09YiYmYi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGIpO2MmJmMoeWcoXCJORVRXT1JLX0VSUk9SXCIpKX07dmFyIGU9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpOyhlJiYwIT1lLmxlbmd0aD9lWzBdOmRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoZCl9Y2F0Y2goZil7YyYmYyh5ZyhcIk5FVFdPUktfRVJST1JcIikpfX0sMCl9Q2cuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hMH07Q2cucHJvdG90eXBlLkJjPWZ1bmN0aW9uKCl7cmV0dXJuXCJqc29uXCJ9O2Z1bmN0aW9uIEVnKGEsYixjLGQpe0lmLmNhbGwodGhpcyxbXCJhdXRoX3N0YXR1c1wiXSk7dGhpcy5IPWE7dGhpcy5kZj1iO3RoaXMuU2c9Yzt0aGlzLktlPWQ7dGhpcy5yYz1uZXcgamcoYSxbRGMsUF0pO3RoaXMubmI9bnVsbDt0aGlzLlJlPSExO0ZnKHRoaXMpfW1hKEVnLElmKTtoPUVnLnByb3RvdHlwZTtoLndlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubmJ8fG51bGx9O2Z1bmN0aW9uIEZnKGEpe1AuZ2V0KFwicmVkaXJlY3RfcmVxdWVzdF9pZFwiKSYmR2coYSk7dmFyIGI9YS5yYy5nZXQoKTtiJiZiLnRva2VuPyhIZyhhLGIpLGEuZGYoYi50b2tlbixmdW5jdGlvbihjLGQpe0lnKGEsYyxkLCExLGIudG9rZW4sYil9LGZ1bmN0aW9uKGIsZCl7SmcoYSxcInJlc3VtZVNlc3Npb24oKVwiLGIsZCl9KSk6SGcoYSxudWxsKX1cbmZ1bmN0aW9uIEtnKGEsYixjLGQsZSxmKXtcImZpcmViYXNlaW8tZGVtby5jb21cIj09PWEuSC5kb21haW4mJlEoXCJGaXJlYmFzZSBhdXRoZW50aWNhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIG9uIGRlbW8gRmlyZWJhc2VzICgqLmZpcmViYXNlaW8tZGVtby5jb20pLiBUbyBzZWN1cmUgeW91ciBGaXJlYmFzZSwgY3JlYXRlIGEgcHJvZHVjdGlvbiBGaXJlYmFzZSBhdCBodHRwczovL3d3dy5maXJlYmFzZS5jb20uXCIpO2EuZGYoYixmdW5jdGlvbihmLGspe0lnKGEsZixrLCEwLGIsYyxkfHx7fSxlKX0sZnVuY3Rpb24oYixjKXtKZyhhLFwiYXV0aCgpXCIsYixjLGYpfSl9ZnVuY3Rpb24gTGcoYSxiKXthLnJjLmNsZWFyKCk7SGcoYSxudWxsKTthLlNnKGZ1bmN0aW9uKGEsZCl7aWYoXCJva1wiPT09YSlSKGIsbnVsbCk7ZWxzZXt2YXIgZT0oYXx8XCJlcnJvclwiKS50b1VwcGVyQ2FzZSgpLGY9ZTtkJiYoZis9XCI6IFwiK2QpO2Y9RXJyb3IoZik7Zi5jb2RlPWU7UihiLGYpfX0pfVxuZnVuY3Rpb24gSWcoYSxiLGMsZCxlLGYsZyxrKXtcIm9rXCI9PT1iPyhkJiYoYj1jLmF1dGgsZi5hdXRoPWIsZi5leHBpcmVzPWMuZXhwaXJlcyxmLnRva2VuPWNkKGUpP2U6XCJcIixjPW51bGwsYiYmdShiLFwidWlkXCIpP2M9dyhiLFwidWlkXCIpOnUoZixcInVpZFwiKSYmKGM9dyhmLFwidWlkXCIpKSxmLnVpZD1jLGM9XCJjdXN0b21cIixiJiZ1KGIsXCJwcm92aWRlclwiKT9jPXcoYixcInByb3ZpZGVyXCIpOnUoZixcInByb3ZpZGVyXCIpJiYoYz13KGYsXCJwcm92aWRlclwiKSksZi5wcm92aWRlcj1jLGEucmMuY2xlYXIoKSxjZChlKSYmKGc9Z3x8e30sYz1EYyxcInNlc3Npb25Pbmx5XCI9PT1nLnJlbWVtYmVyJiYoYz1QKSxcIm5vbmVcIiE9PWcucmVtZW1iZXImJmEucmMuc2V0KGYsYykpLEhnKGEsZikpLFIoayxudWxsLGYpKTooYS5yYy5jbGVhcigpLEhnKGEsbnVsbCksZj1hPShifHxcImVycm9yXCIpLnRvVXBwZXJDYXNlKCksYyYmKGYrPVwiOiBcIitjKSxmPUVycm9yKGYpLGYuY29kZT1hLFIoayxmKSl9XG5mdW5jdGlvbiBKZyhhLGIsYyxkLGUpe1EoYitcIiB3YXMgY2FuY2VsZWQ6IFwiK2QpO2EucmMuY2xlYXIoKTtIZyhhLG51bGwpO2E9RXJyb3IoZCk7YS5jb2RlPWMudG9VcHBlckNhc2UoKTtSKGUsYSl9ZnVuY3Rpb24gTWcoYSxiLGMsZCxlKXtOZyhhKTtjPW5ldyBnZyhkfHx7fSx7fSxjfHx7fSk7T2coYSxbQWcsQ2ddLFwiL2F1dGgvXCIrYixjLGUpfVxuZnVuY3Rpb24gUGcoYSxiLGMsZCl7TmcoYSk7dmFyIGU9W3pnLEJnXTtjPWlnKGMpO1wiYW5vbnltb3VzXCI9PT1ifHxcInBhc3N3b3JkXCI9PT1iP3NldFRpbWVvdXQoZnVuY3Rpb24oKXtSKGQseWcoXCJUUkFOU1BPUlRfVU5BVkFJTEFCTEVcIikpfSwwKTooYy5jZS53aW5kb3dfZmVhdHVyZXM9XCJtZW51YmFyPXllcyxtb2RhbD15ZXMsYWx3YXlzUmFpc2VkPXllc2xvY2F0aW9uPXllcyxyZXNpemFibGU9eWVzLHNjcm9sbGJhcnM9eWVzLHN0YXR1cz15ZXMsaGVpZ2h0PTYyNSx3aWR0aD02MjUsdG9wPVwiKyhcIm9iamVjdFwiPT09dHlwZW9mIHNjcmVlbj8uNSooc2NyZWVuLmhlaWdodC02MjUpOjApK1wiLGxlZnQ9XCIrKFwib2JqZWN0XCI9PT10eXBlb2Ygc2NyZWVuPy41KihzY3JlZW4ud2lkdGgtNjI1KTowKSxjLmNlLnJlbGF5X3VybD10ZyhhLkguQ2IpLGMuY2UucmVxdWVzdFdpdGhDcmVkZW50aWFsPXEoYS5wYyxhKSxPZyhhLGUsXCIvYXV0aC9cIitiLGMsZCkpfVxuZnVuY3Rpb24gR2coYSl7dmFyIGI9UC5nZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIpO2lmKGIpe3ZhciBjPVAuZ2V0KFwicmVkaXJlY3RfY2xpZW50X29wdGlvbnNcIik7UC5yZW1vdmUoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIpO1AucmVtb3ZlKFwicmVkaXJlY3RfY2xpZW50X29wdGlvbnNcIik7dmFyIGQ9W0FnLENnXSxiPXtyZXF1ZXN0SWQ6YixyZXF1ZXN0S2V5OnJnKGRvY3VtZW50LmxvY2F0aW9uLmhhc2gpfSxjPW5ldyBnZyhjLHt9LGIpO2EuUmU9ITA7dHJ5e2RvY3VtZW50LmxvY2F0aW9uLmhhc2g9ZG9jdW1lbnQubG9jYXRpb24uaGFzaC5yZXBsYWNlKC8mX19maXJlYmFzZV9yZXF1ZXN0X2tleT0oW2EtekEtejAtOV0qKS8sXCJcIil9Y2F0Y2goZSl7fU9nKGEsZCxcIi9hdXRoL3Nlc3Npb25cIixjLGZ1bmN0aW9uKCl7dGhpcy5SZT0hMX0uYmluZChhKSl9fVxuaC5yZT1mdW5jdGlvbihhLGIpe05nKHRoaXMpO3ZhciBjPWlnKGEpO2MuYWIuX21ldGhvZD1cIlBPU1RcIjt0aGlzLnBjKFwiL3VzZXJzXCIsYyxmdW5jdGlvbihhLGMpe2E/UihiLGEpOlIoYixhLGMpfSl9O2guU2U9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzO05nKHRoaXMpO3ZhciBkPVwiL3VzZXJzL1wiK2VuY29kZVVSSUNvbXBvbmVudChhLmVtYWlsKSxlPWlnKGEpO2UuYWIuX21ldGhvZD1cIkRFTEVURVwiO3RoaXMucGMoZCxlLGZ1bmN0aW9uKGEsZCl7IWEmJmQmJmQudWlkJiZjLm5iJiZjLm5iLnVpZCYmYy5uYi51aWQ9PT1kLnVpZCYmTGcoYyk7UihiLGEpfSl9O2gub2U9ZnVuY3Rpb24oYSxiKXtOZyh0aGlzKTt2YXIgYz1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5lbWFpbCkrXCIvcGFzc3dvcmRcIixkPWlnKGEpO2QuYWIuX21ldGhvZD1cIlBVVFwiO2QuYWIucGFzc3dvcmQ9YS5uZXdQYXNzd29yZDt0aGlzLnBjKGMsZCxmdW5jdGlvbihhKXtSKGIsYSl9KX07XG5oLm5lPWZ1bmN0aW9uKGEsYil7TmcodGhpcyk7dmFyIGM9XCIvdXNlcnMvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGEub2xkRW1haWwpK1wiL2VtYWlsXCIsZD1pZyhhKTtkLmFiLl9tZXRob2Q9XCJQVVRcIjtkLmFiLmVtYWlsPWEubmV3RW1haWw7ZC5hYi5wYXNzd29yZD1hLnBhc3N3b3JkO3RoaXMucGMoYyxkLGZ1bmN0aW9uKGEpe1IoYixhKX0pfTtoLlVlPWZ1bmN0aW9uKGEsYil7TmcodGhpcyk7dmFyIGM9XCIvdXNlcnMvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGEuZW1haWwpK1wiL3Bhc3N3b3JkXCIsZD1pZyhhKTtkLmFiLl9tZXRob2Q9XCJQT1NUXCI7dGhpcy5wYyhjLGQsZnVuY3Rpb24oYSl7UihiLGEpfSl9O2gucGM9ZnVuY3Rpb24oYSxiLGMpe1FnKHRoaXMsW0FnLENnXSxhLGIsYyl9O1xuZnVuY3Rpb24gT2coYSxiLGMsZCxlKXtRZyhhLGIsYyxkLGZ1bmN0aW9uKGIsYyl7IWImJmMmJmMudG9rZW4mJmMudWlkP0tnKGEsYy50b2tlbixjLGQubGQsZnVuY3Rpb24oYSxiKXthP1IoZSxhKTpSKGUsbnVsbCxiKX0pOlIoZSxifHx5ZyhcIlVOS05PV05fRVJST1JcIikpfSl9XG5mdW5jdGlvbiBRZyhhLGIsYyxkLGUpe2I9UGEoYixmdW5jdGlvbihhKXtyZXR1cm5cImZ1bmN0aW9uXCI9PT10eXBlb2YgYS5pc0F2YWlsYWJsZSYmYS5pc0F2YWlsYWJsZSgpfSk7MD09PWIubGVuZ3RoP3NldFRpbWVvdXQoZnVuY3Rpb24oKXtSKGUseWcoXCJUUkFOU1BPUlRfVU5BVkFJTEFCTEVcIikpfSwwKTooYj1uZXcgKGIuc2hpZnQoKSkoZC5jZSksZD1pYihkLmFiKSxkLnY9XCJqcy0yLjIuNFwiLGQudHJhbnNwb3J0PWIuQmMoKSxkLnN1cHByZXNzX3N0YXR1c19jb2Rlcz0hMCxhPXNnKCkrXCIvXCIrYS5ILkNiK2MsYi5vcGVuKGEsZCxmdW5jdGlvbihhLGIpe2lmKGEpUihlLGEpO2Vsc2UgaWYoYiYmYi5lcnJvcil7dmFyIGM9RXJyb3IoYi5lcnJvci5tZXNzYWdlKTtjLmNvZGU9Yi5lcnJvci5jb2RlO2MuZGV0YWlscz1iLmVycm9yLmRldGFpbHM7UihlLGMpfWVsc2UgUihlLG51bGwsYil9KSl9XG5mdW5jdGlvbiBIZyhhLGIpe3ZhciBjPW51bGwhPT1hLm5ifHxudWxsIT09YjthLm5iPWI7YyYmYS5kZShcImF1dGhfc3RhdHVzXCIsYik7YS5LZShudWxsIT09Yil9aC56ZT1mdW5jdGlvbihhKXtKKFwiYXV0aF9zdGF0dXNcIj09PWEsJ2luaXRpYWwgZXZlbnQgbXVzdCBiZSBvZiB0eXBlIFwiYXV0aF9zdGF0dXNcIicpO3JldHVybiB0aGlzLlJlP251bGw6W3RoaXMubmJdfTtmdW5jdGlvbiBOZyhhKXt2YXIgYj1hLkg7aWYoXCJmaXJlYmFzZWlvLmNvbVwiIT09Yi5kb21haW4mJlwiZmlyZWJhc2Vpby1kZW1vLmNvbVwiIT09Yi5kb21haW4mJlwiYXV0aC5maXJlYmFzZS5jb21cIj09PWZnKXRocm93IEVycm9yKFwiVGhpcyBjdXN0b20gRmlyZWJhc2Ugc2VydmVyICgnXCIrYS5ILmRvbWFpbitcIicpIGRvZXMgbm90IHN1cHBvcnQgZGVsZWdhdGVkIGxvZ2luLlwiKTt9O2Z1bmN0aW9uIFJnKGEpe3RoaXMuaGM9YTt0aGlzLktkPVtdO3RoaXMuUWI9MDt0aGlzLnBlPS0xO3RoaXMuRmI9bnVsbH1mdW5jdGlvbiBTZyhhLGIsYyl7YS5wZT1iO2EuRmI9YzthLnBlPGEuUWImJihhLkZiKCksYS5GYj1udWxsKX1mdW5jdGlvbiBUZyhhLGIsYyl7Zm9yKGEuS2RbYl09YzthLktkW2EuUWJdOyl7dmFyIGQ9YS5LZFthLlFiXTtkZWxldGUgYS5LZFthLlFiXTtmb3IodmFyIGU9MDtlPGQubGVuZ3RoOysrZSlpZihkW2VdKXt2YXIgZj1hO0NiKGZ1bmN0aW9uKCl7Zi5oYyhkW2VdKX0pfWlmKGEuUWI9PT1hLnBlKXthLkZiJiYoY2xlYXJUaW1lb3V0KGEuRmIpLGEuRmIoKSxhLkZiPW51bGwpO2JyZWFrfWEuUWIrK319O2Z1bmN0aW9uIFVnKGEsYixjKXt0aGlzLnFlPWE7dGhpcy5mPU9jKGEpO3RoaXMub2I9dGhpcy5wYj0wO3RoaXMuVmE9T2IoYik7dGhpcy5WZD1jO3RoaXMuR2M9ITE7dGhpcy5nZD1mdW5jdGlvbihhKXtiLmhvc3QhPT1iLk9hJiYoYS5ucz1iLkNiKTt2YXIgYz1bXSxmO2ZvcihmIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShmKSYmYy5wdXNoKGYrXCI9XCIrYVtmXSk7cmV0dXJuKGIubGI/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKStiLk9hK1wiLy5scD9cIitjLmpvaW4oXCImXCIpfX12YXIgVmcsV2c7XG5VZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIpe3RoaXMuZ2Y9MDt0aGlzLmthPWI7dGhpcy56Zj1uZXcgUmcoYSk7dGhpcy56Yj0hMTt2YXIgYz10aGlzO3RoaXMucmI9c2V0VGltZW91dChmdW5jdGlvbigpe2MuZihcIlRpbWVkIG91dCB0cnlpbmcgdG8gY29ubmVjdC5cIik7Yy5pYigpO2MucmI9bnVsbH0sTWF0aC5mbG9vcigzRTQpKTtUYyhmdW5jdGlvbigpe2lmKCFjLnpiKXtjLlRhPW5ldyBYZyhmdW5jdGlvbihhLGIsZCxrLGwpe1lnKGMsYXJndW1lbnRzKTtpZihjLlRhKWlmKGMucmImJihjbGVhclRpbWVvdXQoYy5yYiksYy5yYj1udWxsKSxjLkdjPSEwLFwic3RhcnRcIj09YSljLmlkPWIsYy5GZj1kO2Vsc2UgaWYoXCJjbG9zZVwiPT09YSliPyhjLlRhLlRkPSExLFNnKGMuemYsYixmdW5jdGlvbigpe2MuaWIoKX0pKTpjLmliKCk7ZWxzZSB0aHJvdyBFcnJvcihcIlVucmVjb2duaXplZCBjb21tYW5kIHJlY2VpdmVkOiBcIithKTt9LGZ1bmN0aW9uKGEsYil7WWcoYyxhcmd1bWVudHMpO1xuVGcoYy56ZixhLGIpfSxmdW5jdGlvbigpe2MuaWIoKX0sYy5nZCk7dmFyIGE9e3N0YXJ0OlwidFwifTthLnNlcj1NYXRoLmZsb29yKDFFOCpNYXRoLnJhbmRvbSgpKTtjLlRhLmZlJiYoYS5jYj1jLlRhLmZlKTthLnY9XCI1XCI7Yy5WZCYmKGEucz1jLlZkKTtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGxvY2F0aW9uJiZsb2NhdGlvbi5ocmVmJiYtMSE9PWxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImZpcmViYXNlaW8uY29tXCIpJiYoYS5yPVwiZlwiKTthPWMuZ2QoYSk7Yy5mKFwiQ29ubmVjdGluZyB2aWEgbG9uZy1wb2xsIHRvIFwiK2EpO1pnKGMuVGEsYSxmdW5jdGlvbigpe30pfX0pfTtcblVnLnByb3RvdHlwZS5zdGFydD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuVGEsYj10aGlzLkZmO2Eucmc9dGhpcy5pZDthLnNnPWI7Zm9yKGEua2U9ITA7JGcoYSk7KTthPXRoaXMuaWQ7Yj10aGlzLkZmO3RoaXMuZmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTt2YXIgYz17ZGZyYW1lOlwidFwifTtjLmlkPWE7Yy5wdz1iO3RoaXMuZmMuc3JjPXRoaXMuZ2QoYyk7dGhpcy5mYy5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5mYyl9O1VnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuIVdnJiYhKFwib2JqZWN0XCI9PT10eXBlb2Ygd2luZG93JiZ3aW5kb3cuY2hyb21lJiZ3aW5kb3cuY2hyb21lLmV4dGVuc2lvbiYmIS9eY2hyb21lLy50ZXN0KHdpbmRvdy5sb2NhdGlvbi5ocmVmKSkmJiEoXCJvYmplY3RcIj09PXR5cGVvZiBXaW5kb3dzJiZcIm9iamVjdFwiPT09dHlwZW9mIFdpbmRvd3MuVWcpJiYoVmd8fCEwKX07aD1VZy5wcm90b3R5cGU7XG5oLkJkPWZ1bmN0aW9uKCl7fTtoLmNkPWZ1bmN0aW9uKCl7dGhpcy56Yj0hMDt0aGlzLlRhJiYodGhpcy5UYS5jbG9zZSgpLHRoaXMuVGE9bnVsbCk7dGhpcy5mYyYmKGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5mYyksdGhpcy5mYz1udWxsKTt0aGlzLnJiJiYoY2xlYXJUaW1lb3V0KHRoaXMucmIpLHRoaXMucmI9bnVsbCl9O2guaWI9ZnVuY3Rpb24oKXt0aGlzLnpifHwodGhpcy5mKFwiTG9uZ3BvbGwgaXMgY2xvc2luZyBpdHNlbGZcIiksdGhpcy5jZCgpLHRoaXMua2EmJih0aGlzLmthKHRoaXMuR2MpLHRoaXMua2E9bnVsbCkpfTtoLmNsb3NlPWZ1bmN0aW9uKCl7dGhpcy56Ynx8KHRoaXMuZihcIkxvbmdwb2xsIGlzIGJlaW5nIGNsb3NlZC5cIiksdGhpcy5jZCgpKX07XG5oLnNlbmQ9ZnVuY3Rpb24oYSl7YT1CKGEpO3RoaXMucGIrPWEubGVuZ3RoO0xiKHRoaXMuVmEsXCJieXRlc19zZW50XCIsYS5sZW5ndGgpO2E9S2MoYSk7YT1mYihhLCEwKTthPVhjKGEsMTg0MCk7Zm9yKHZhciBiPTA7YjxhLmxlbmd0aDtiKyspe3ZhciBjPXRoaXMuVGE7Yy4kYy5wdXNoKHtKZzp0aGlzLmdmLFJnOmEubGVuZ3RoLGpmOmFbYl19KTtjLmtlJiYkZyhjKTt0aGlzLmdmKyt9fTtmdW5jdGlvbiBZZyhhLGIpe3ZhciBjPUIoYikubGVuZ3RoO2Eub2IrPWM7TGIoYS5WYSxcImJ5dGVzX3JlY2VpdmVkXCIsYyl9XG5mdW5jdGlvbiBYZyhhLGIsYyxkKXt0aGlzLmdkPWQ7dGhpcy5qYj1jO3RoaXMuT2U9bmV3IGNnO3RoaXMuJGM9W107dGhpcy5zZT1NYXRoLmZsb29yKDFFOCpNYXRoLnJhbmRvbSgpKTt0aGlzLlRkPSEwO3RoaXMuZmU9R2MoKTt3aW5kb3dbXCJwTFBDb21tYW5kXCIrdGhpcy5mZV09YTt3aW5kb3dbXCJwUlRMUENCXCIrdGhpcy5mZV09YjthPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7YS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO2lmKGRvY3VtZW50LmJvZHkpe2RvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7dHJ5e2EuY29udGVudFdpbmRvdy5kb2N1bWVudHx8QmIoXCJObyBJRSBkb21haW4gc2V0dGluZyByZXF1aXJlZFwiKX1jYXRjaChlKXthLnNyYz1cImphdmFzY3JpcHQ6dm9pZCgoZnVuY3Rpb24oKXtkb2N1bWVudC5vcGVuKCk7ZG9jdW1lbnQuZG9tYWluPSdcIitkb2N1bWVudC5kb21haW4rXCInO2RvY3VtZW50LmNsb3NlKCk7fSkoKSlcIn19ZWxzZSB0aHJvd1wiRG9jdW1lbnQgYm9keSBoYXMgbm90IGluaXRpYWxpemVkLiBXYWl0IHRvIGluaXRpYWxpemUgRmlyZWJhc2UgdW50aWwgYWZ0ZXIgdGhlIGRvY3VtZW50IGlzIHJlYWR5LlwiO1xuYS5jb250ZW50RG9jdW1lbnQ/YS5nYj1hLmNvbnRlbnREb2N1bWVudDphLmNvbnRlbnRXaW5kb3c/YS5nYj1hLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ6YS5kb2N1bWVudCYmKGEuZ2I9YS5kb2N1bWVudCk7dGhpcy5DYT1hO2E9XCJcIjt0aGlzLkNhLnNyYyYmXCJqYXZhc2NyaXB0OlwiPT09dGhpcy5DYS5zcmMuc3Vic3RyKDAsMTEpJiYoYT0nPHNjcmlwdD5kb2N1bWVudC5kb21haW49XCInK2RvY3VtZW50LmRvbWFpbisnXCI7XFx4M2Mvc2NyaXB0PicpO2E9XCI8aHRtbD48Ym9keT5cIithK1wiPC9ib2R5PjwvaHRtbD5cIjt0cnl7dGhpcy5DYS5nYi5vcGVuKCksdGhpcy5DYS5nYi53cml0ZShhKSx0aGlzLkNhLmdiLmNsb3NlKCl9Y2F0Y2goZil7QmIoXCJmcmFtZSB3cml0aW5nIGV4Y2VwdGlvblwiKSxmLnN0YWNrJiZCYihmLnN0YWNrKSxCYihmKX19XG5YZy5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXt0aGlzLmtlPSExO2lmKHRoaXMuQ2Epe3RoaXMuQ2EuZ2IuYm9keS5pbm5lckhUTUw9XCJcIjt2YXIgYT10aGlzO3NldFRpbWVvdXQoZnVuY3Rpb24oKXtudWxsIT09YS5DYSYmKGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYS5DYSksYS5DYT1udWxsKX0sTWF0aC5mbG9vcigwKSl9dmFyIGI9dGhpcy5qYjtiJiYodGhpcy5qYj1udWxsLGIoKSl9O1xuZnVuY3Rpb24gJGcoYSl7aWYoYS5rZSYmYS5UZCYmYS5PZS5jb3VudCgpPCgwPGEuJGMubGVuZ3RoPzI6MSkpe2Euc2UrKzt2YXIgYj17fTtiLmlkPWEucmc7Yi5wdz1hLnNnO2Iuc2VyPWEuc2U7Zm9yKHZhciBiPWEuZ2QoYiksYz1cIlwiLGQ9MDswPGEuJGMubGVuZ3RoOylpZigxODcwPj1hLiRjWzBdLmpmLmxlbmd0aCszMCtjLmxlbmd0aCl7dmFyIGU9YS4kYy5zaGlmdCgpLGM9YytcIiZzZWdcIitkK1wiPVwiK2UuSmcrXCImdHNcIitkK1wiPVwiK2UuUmcrXCImZFwiK2QrXCI9XCIrZS5qZjtkKyt9ZWxzZSBicmVhazthaChhLGIrYyxhLnNlKTtyZXR1cm4hMH1yZXR1cm4hMX1mdW5jdGlvbiBhaChhLGIsYyl7ZnVuY3Rpb24gZCgpe2EuT2UucmVtb3ZlKGMpOyRnKGEpfWEuT2UuYWRkKGMsMSk7dmFyIGU9c2V0VGltZW91dChkLE1hdGguZmxvb3IoMjVFMykpO1pnKGEsYixmdW5jdGlvbigpe2NsZWFyVGltZW91dChlKTtkKCl9KX1cbmZ1bmN0aW9uIFpnKGEsYixjKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dHJ5e2lmKGEuVGQpe3ZhciBkPWEuQ2EuZ2IuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtkLnR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIjtkLmFzeW5jPSEwO2Quc3JjPWI7ZC5vbmxvYWQ9ZC5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXt2YXIgYT1kLnJlYWR5U3RhdGU7YSYmXCJsb2FkZWRcIiE9PWEmJlwiY29tcGxldGVcIiE9PWF8fChkLm9ubG9hZD1kLm9ucmVhZHlzdGF0ZWNoYW5nZT1udWxsLGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGMoKSl9O2Qub25lcnJvcj1mdW5jdGlvbigpe0JiKFwiTG9uZy1wb2xsIHNjcmlwdCBmYWlsZWQgdG8gbG9hZDogXCIrYik7YS5UZD0hMTthLmNsb3NlKCl9O2EuQ2EuZ2IuYm9keS5hcHBlbmRDaGlsZChkKX19Y2F0Y2goZSl7fX0sTWF0aC5mbG9vcigxKSl9O3ZhciBiaD1udWxsO1widW5kZWZpbmVkXCIhPT10eXBlb2YgTW96V2ViU29ja2V0P2JoPU1veldlYlNvY2tldDpcInVuZGVmaW5lZFwiIT09dHlwZW9mIFdlYlNvY2tldCYmKGJoPVdlYlNvY2tldCk7ZnVuY3Rpb24gY2goYSxiLGMpe3RoaXMucWU9YTt0aGlzLmY9T2ModGhpcy5xZSk7dGhpcy5mcmFtZXM9dGhpcy5KYz1udWxsO3RoaXMub2I9dGhpcy5wYj10aGlzLmJmPTA7dGhpcy5WYT1PYihiKTt0aGlzLmZiPShiLmxiP1wid3NzOi8vXCI6XCJ3czovL1wiKStiLk9hK1wiLy53cz92PTVcIjtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGxvY2F0aW9uJiZsb2NhdGlvbi5ocmVmJiYtMSE9PWxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImZpcmViYXNlaW8uY29tXCIpJiYodGhpcy5mYis9XCImcj1mXCIpO2IuaG9zdCE9PWIuT2EmJih0aGlzLmZiPXRoaXMuZmIrXCImbnM9XCIrYi5DYik7YyYmKHRoaXMuZmI9dGhpcy5mYitcIiZzPVwiK2MpfXZhciBkaDtcbmNoLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYil7dGhpcy5qYj1iO3RoaXMud2c9YTt0aGlzLmYoXCJXZWJzb2NrZXQgY29ubmVjdGluZyB0byBcIit0aGlzLmZiKTt0aGlzLkdjPSExO0RjLnNldChcInByZXZpb3VzX3dlYnNvY2tldF9mYWlsdXJlXCIsITApO3RyeXt0aGlzLnZhPW5ldyBiaCh0aGlzLmZiKX1jYXRjaChjKXt0aGlzLmYoXCJFcnJvciBpbnN0YW50aWF0aW5nIFdlYlNvY2tldC5cIik7dmFyIGQ9Yy5tZXNzYWdlfHxjLmRhdGE7ZCYmdGhpcy5mKGQpO3RoaXMuaWIoKTtyZXR1cm59dmFyIGU9dGhpczt0aGlzLnZhLm9ub3Blbj1mdW5jdGlvbigpe2UuZihcIldlYnNvY2tldCBjb25uZWN0ZWQuXCIpO2UuR2M9ITB9O3RoaXMudmEub25jbG9zZT1mdW5jdGlvbigpe2UuZihcIldlYnNvY2tldCBjb25uZWN0aW9uIHdhcyBkaXNjb25uZWN0ZWQuXCIpO2UudmE9bnVsbDtlLmliKCl9O3RoaXMudmEub25tZXNzYWdlPWZ1bmN0aW9uKGEpe2lmKG51bGwhPT1lLnZhKWlmKGE9YS5kYXRhLGUub2IrPVxuYS5sZW5ndGgsTGIoZS5WYSxcImJ5dGVzX3JlY2VpdmVkXCIsYS5sZW5ndGgpLGVoKGUpLG51bGwhPT1lLmZyYW1lcylmaChlLGEpO2Vsc2V7YTp7SihudWxsPT09ZS5mcmFtZXMsXCJXZSBhbHJlYWR5IGhhdmUgYSBmcmFtZSBidWZmZXJcIik7aWYoNj49YS5sZW5ndGgpe3ZhciBiPU51bWJlcihhKTtpZighaXNOYU4oYikpe2UuYmY9YjtlLmZyYW1lcz1bXTthPW51bGw7YnJlYWsgYX19ZS5iZj0xO2UuZnJhbWVzPVtdfW51bGwhPT1hJiZmaChlLGEpfX07dGhpcy52YS5vbmVycm9yPWZ1bmN0aW9uKGEpe2UuZihcIldlYlNvY2tldCBlcnJvci4gIENsb3NpbmcgY29ubmVjdGlvbi5cIik7KGE9YS5tZXNzYWdlfHxhLmRhdGEpJiZlLmYoYSk7ZS5pYigpfX07Y2gucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7fTtcbmNoLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7dmFyIGE9ITE7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJm5hdmlnYXRvci51c2VyQWdlbnQpe3ZhciBiPW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQgKFswLTldezAsfVxcLlswLTldezAsfSkvKTtiJiYxPGIubGVuZ3RoJiY0LjQ+cGFyc2VGbG9hdChiWzFdKSYmKGE9ITApfXJldHVybiFhJiZudWxsIT09YmgmJiFkaH07Y2gucmVzcG9uc2VzUmVxdWlyZWRUb0JlSGVhbHRoeT0yO2NoLmhlYWx0aHlUaW1lb3V0PTNFNDtoPWNoLnByb3RvdHlwZTtoLkJkPWZ1bmN0aW9uKCl7RGMucmVtb3ZlKFwicHJldmlvdXNfd2Vic29ja2V0X2ZhaWx1cmVcIil9O2Z1bmN0aW9uIGZoKGEsYil7YS5mcmFtZXMucHVzaChiKTtpZihhLmZyYW1lcy5sZW5ndGg9PWEuYmYpe3ZhciBjPWEuZnJhbWVzLmpvaW4oXCJcIik7YS5mcmFtZXM9bnVsbDtjPW1iKGMpO2Eud2coYyl9fVxuaC5zZW5kPWZ1bmN0aW9uKGEpe2VoKHRoaXMpO2E9QihhKTt0aGlzLnBiKz1hLmxlbmd0aDtMYih0aGlzLlZhLFwiYnl0ZXNfc2VudFwiLGEubGVuZ3RoKTthPVhjKGEsMTYzODQpOzE8YS5sZW5ndGgmJnRoaXMudmEuc2VuZChTdHJpbmcoYS5sZW5ndGgpKTtmb3IodmFyIGI9MDtiPGEubGVuZ3RoO2IrKyl0aGlzLnZhLnNlbmQoYVtiXSl9O2guY2Q9ZnVuY3Rpb24oKXt0aGlzLnpiPSEwO3RoaXMuSmMmJihjbGVhckludGVydmFsKHRoaXMuSmMpLHRoaXMuSmM9bnVsbCk7dGhpcy52YSYmKHRoaXMudmEuY2xvc2UoKSx0aGlzLnZhPW51bGwpfTtoLmliPWZ1bmN0aW9uKCl7dGhpcy56Ynx8KHRoaXMuZihcIldlYlNvY2tldCBpcyBjbG9zaW5nIGl0c2VsZlwiKSx0aGlzLmNkKCksdGhpcy5qYiYmKHRoaXMuamIodGhpcy5HYyksdGhpcy5qYj1udWxsKSl9O2guY2xvc2U9ZnVuY3Rpb24oKXt0aGlzLnpifHwodGhpcy5mKFwiV2ViU29ja2V0IGlzIGJlaW5nIGNsb3NlZFwiKSx0aGlzLmNkKCkpfTtcbmZ1bmN0aW9uIGVoKGEpe2NsZWFySW50ZXJ2YWwoYS5KYyk7YS5KYz1zZXRJbnRlcnZhbChmdW5jdGlvbigpe2EudmEmJmEudmEuc2VuZChcIjBcIik7ZWgoYSl9LE1hdGguZmxvb3IoNDVFMykpfTtmdW5jdGlvbiBnaChhKXtoaCh0aGlzLGEpfXZhciBpaD1bVWcsY2hdO2Z1bmN0aW9uIGhoKGEsYil7dmFyIGM9Y2gmJmNoLmlzQXZhaWxhYmxlKCksZD1jJiYhKERjLnVmfHwhMD09PURjLmdldChcInByZXZpb3VzX3dlYnNvY2tldF9mYWlsdXJlXCIpKTtiLlRnJiYoY3x8UShcIndzczovLyBVUkwgdXNlZCwgYnV0IGJyb3dzZXIgaXNuJ3Qga25vd24gdG8gc3VwcG9ydCB3ZWJzb2NrZXRzLiAgVHJ5aW5nIGFueXdheS5cIiksZD0hMCk7aWYoZClhLmVkPVtjaF07ZWxzZXt2YXIgZT1hLmVkPVtdO1ljKGloLGZ1bmN0aW9uKGEsYil7YiYmYi5pc0F2YWlsYWJsZSgpJiZlLnB1c2goYil9KX19ZnVuY3Rpb24gamgoYSl7aWYoMDxhLmVkLmxlbmd0aClyZXR1cm4gYS5lZFswXTt0aHJvdyBFcnJvcihcIk5vIHRyYW5zcG9ydHMgYXZhaWxhYmxlXCIpO307ZnVuY3Rpb24ga2goYSxiLGMsZCxlLGYpe3RoaXMuaWQ9YTt0aGlzLmY9T2MoXCJjOlwiK3RoaXMuaWQrXCI6XCIpO3RoaXMuaGM9Yzt0aGlzLlZjPWQ7dGhpcy5rYT1lO3RoaXMuTWU9Zjt0aGlzLkg9Yjt0aGlzLkpkPVtdO3RoaXMuZWY9MDt0aGlzLk5mPW5ldyBnaChiKTt0aGlzLlVhPTA7dGhpcy5mKFwiQ29ubmVjdGlvbiBjcmVhdGVkXCIpO2xoKHRoaXMpfVxuZnVuY3Rpb24gbGgoYSl7dmFyIGI9amgoYS5OZik7YS5MPW5ldyBiKFwiYzpcIithLmlkK1wiOlwiK2EuZWYrKyxhLkgpO2EuUWU9Yi5yZXNwb25zZXNSZXF1aXJlZFRvQmVIZWFsdGh5fHwwO3ZhciBjPW1oKGEsYS5MKSxkPW5oKGEsYS5MKTthLmZkPWEuTDthLmJkPWEuTDthLkY9bnVsbDthLkFiPSExO3NldFRpbWVvdXQoZnVuY3Rpb24oKXthLkwmJmEuTC5vcGVuKGMsZCl9LE1hdGguZmxvb3IoMCkpO2I9Yi5oZWFsdGh5VGltZW91dHx8MDswPGImJihhLnZkPXNldFRpbWVvdXQoZnVuY3Rpb24oKXthLnZkPW51bGw7YS5BYnx8KGEuTCYmMTAyNDAwPGEuTC5vYj8oYS5mKFwiQ29ubmVjdGlvbiBleGNlZWRlZCBoZWFsdGh5IHRpbWVvdXQgYnV0IGhhcyByZWNlaXZlZCBcIithLkwub2IrXCIgYnl0ZXMuICBNYXJraW5nIGNvbm5lY3Rpb24gaGVhbHRoeS5cIiksYS5BYj0hMCxhLkwuQmQoKSk6YS5MJiYxMDI0MDxhLkwucGI/YS5mKFwiQ29ubmVjdGlvbiBleGNlZWRlZCBoZWFsdGh5IHRpbWVvdXQgYnV0IGhhcyBzZW50IFwiK1xuYS5MLnBiK1wiIGJ5dGVzLiAgTGVhdmluZyBjb25uZWN0aW9uIGFsaXZlLlwiKTooYS5mKFwiQ2xvc2luZyB1bmhlYWx0aHkgY29ubmVjdGlvbiBhZnRlciB0aW1lb3V0LlwiKSxhLmNsb3NlKCkpKX0sTWF0aC5mbG9vcihiKSkpfWZ1bmN0aW9uIG5oKGEsYil7cmV0dXJuIGZ1bmN0aW9uKGMpe2I9PT1hLkw/KGEuTD1udWxsLGN8fDAhPT1hLlVhPzE9PT1hLlVhJiZhLmYoXCJSZWFsdGltZSBjb25uZWN0aW9uIGxvc3QuXCIpOihhLmYoXCJSZWFsdGltZSBjb25uZWN0aW9uIGZhaWxlZC5cIiksXCJzLVwiPT09YS5ILk9hLnN1YnN0cigwLDIpJiYoRGMucmVtb3ZlKFwiaG9zdDpcIithLkguaG9zdCksYS5ILk9hPWEuSC5ob3N0KSksYS5jbG9zZSgpKTpiPT09YS5GPyhhLmYoXCJTZWNvbmRhcnkgY29ubmVjdGlvbiBsb3N0LlwiKSxjPWEuRixhLkY9bnVsbCxhLmZkIT09YyYmYS5iZCE9PWN8fGEuY2xvc2UoKSk6YS5mKFwiY2xvc2luZyBhbiBvbGQgY29ubmVjdGlvblwiKX19XG5mdW5jdGlvbiBtaChhLGIpe3JldHVybiBmdW5jdGlvbihjKXtpZigyIT1hLlVhKWlmKGI9PT1hLmJkKXt2YXIgZD1WYyhcInRcIixjKTtjPVZjKFwiZFwiLGMpO2lmKFwiY1wiPT1kKXtpZihkPVZjKFwidFwiLGMpLFwiZFwiaW4gYylpZihjPWMuZCxcImhcIj09PWQpe3ZhciBkPWMudHMsZT1jLnYsZj1jLmg7YS5WZD1jLnM7RmMoYS5ILGYpOzA9PWEuVWEmJihhLkwuc3RhcnQoKSxvaChhLGEuTCxkKSxcIjVcIiE9PWUmJlEoXCJQcm90b2NvbCB2ZXJzaW9uIG1pc21hdGNoIGRldGVjdGVkXCIpLGM9YS5OZiwoYz0xPGMuZWQubGVuZ3RoP2MuZWRbMV06bnVsbCkmJnBoKGEsYykpfWVsc2UgaWYoXCJuXCI9PT1kKXthLmYoXCJyZWN2ZCBlbmQgdHJhbnNtaXNzaW9uIG9uIHByaW1hcnlcIik7YS5iZD1hLkY7Zm9yKGM9MDtjPGEuSmQubGVuZ3RoOysrYylhLkZkKGEuSmRbY10pO2EuSmQ9W107cWgoYSl9ZWxzZVwic1wiPT09ZD8oYS5mKFwiQ29ubmVjdGlvbiBzaHV0ZG93biBjb21tYW5kIHJlY2VpdmVkLiBTaHV0dGluZyBkb3duLi4uXCIpLFxuYS5NZSYmKGEuTWUoYyksYS5NZT1udWxsKSxhLmthPW51bGwsYS5jbG9zZSgpKTpcInJcIj09PWQ/KGEuZihcIlJlc2V0IHBhY2tldCByZWNlaXZlZC4gIE5ldyBob3N0OiBcIitjKSxGYyhhLkgsYyksMT09PWEuVWE/YS5jbG9zZSgpOihyaChhKSxsaChhKSkpOlwiZVwiPT09ZD9QYyhcIlNlcnZlciBFcnJvcjogXCIrYyk6XCJvXCI9PT1kPyhhLmYoXCJnb3QgcG9uZyBvbiBwcmltYXJ5LlwiKSxzaChhKSx0aChhKSk6UGMoXCJVbmtub3duIGNvbnRyb2wgcGFja2V0IGNvbW1hbmQ6IFwiK2QpfWVsc2VcImRcIj09ZCYmYS5GZChjKX1lbHNlIGlmKGI9PT1hLkYpaWYoZD1WYyhcInRcIixjKSxjPVZjKFwiZFwiLGMpLFwiY1wiPT1kKVwidFwiaW4gYyYmKGM9Yy50LFwiYVwiPT09Yz91aChhKTpcInJcIj09PWM/KGEuZihcIkdvdCBhIHJlc2V0IG9uIHNlY29uZGFyeSwgY2xvc2luZyBpdFwiKSxhLkYuY2xvc2UoKSxhLmZkIT09YS5GJiZhLmJkIT09YS5GfHxhLmNsb3NlKCkpOlwib1wiPT09YyYmKGEuZihcImdvdCBwb25nIG9uIHNlY29uZGFyeS5cIiksXG5hLkxmLS0sdWgoYSkpKTtlbHNlIGlmKFwiZFwiPT1kKWEuSmQucHVzaChjKTtlbHNlIHRocm93IEVycm9yKFwiVW5rbm93biBwcm90b2NvbCBsYXllcjogXCIrZCk7ZWxzZSBhLmYoXCJtZXNzYWdlIG9uIG9sZCBjb25uZWN0aW9uXCIpfX1raC5wcm90b3R5cGUuRGE9ZnVuY3Rpb24oYSl7dmgodGhpcyx7dDpcImRcIixkOmF9KX07ZnVuY3Rpb24gcWgoYSl7YS5mZD09PWEuRiYmYS5iZD09PWEuRiYmKGEuZihcImNsZWFuaW5nIHVwIGFuZCBwcm9tb3RpbmcgYSBjb25uZWN0aW9uOiBcIithLkYucWUpLGEuTD1hLkYsYS5GPW51bGwpfVxuZnVuY3Rpb24gdWgoYSl7MD49YS5MZj8oYS5mKFwiU2Vjb25kYXJ5IGNvbm5lY3Rpb24gaXMgaGVhbHRoeS5cIiksYS5BYj0hMCxhLkYuQmQoKSxhLkYuc3RhcnQoKSxhLmYoXCJzZW5kaW5nIGNsaWVudCBhY2sgb24gc2Vjb25kYXJ5XCIpLGEuRi5zZW5kKHt0OlwiY1wiLGQ6e3Q6XCJhXCIsZDp7fX19KSxhLmYoXCJFbmRpbmcgdHJhbnNtaXNzaW9uIG9uIHByaW1hcnlcIiksYS5MLnNlbmQoe3Q6XCJjXCIsZDp7dDpcIm5cIixkOnt9fX0pLGEuZmQ9YS5GLHFoKGEpKTooYS5mKFwic2VuZGluZyBwaW5nIG9uIHNlY29uZGFyeS5cIiksYS5GLnNlbmQoe3Q6XCJjXCIsZDp7dDpcInBcIixkOnt9fX0pKX1raC5wcm90b3R5cGUuRmQ9ZnVuY3Rpb24oYSl7c2godGhpcyk7dGhpcy5oYyhhKX07ZnVuY3Rpb24gc2goYSl7YS5BYnx8KGEuUWUtLSwwPj1hLlFlJiYoYS5mKFwiUHJpbWFyeSBjb25uZWN0aW9uIGlzIGhlYWx0aHkuXCIpLGEuQWI9ITAsYS5MLkJkKCkpKX1cbmZ1bmN0aW9uIHBoKGEsYil7YS5GPW5ldyBiKFwiYzpcIithLmlkK1wiOlwiK2EuZWYrKyxhLkgsYS5WZCk7YS5MZj1iLnJlc3BvbnNlc1JlcXVpcmVkVG9CZUhlYWx0aHl8fDA7YS5GLm9wZW4obWgoYSxhLkYpLG5oKGEsYS5GKSk7c2V0VGltZW91dChmdW5jdGlvbigpe2EuRiYmKGEuZihcIlRpbWVkIG91dCB0cnlpbmcgdG8gdXBncmFkZS5cIiksYS5GLmNsb3NlKCkpfSxNYXRoLmZsb29yKDZFNCkpfWZ1bmN0aW9uIG9oKGEsYixjKXthLmYoXCJSZWFsdGltZSBjb25uZWN0aW9uIGVzdGFibGlzaGVkLlwiKTthLkw9YjthLlVhPTE7YS5WYyYmKGEuVmMoYyksYS5WYz1udWxsKTswPT09YS5RZT8oYS5mKFwiUHJpbWFyeSBjb25uZWN0aW9uIGlzIGhlYWx0aHkuXCIpLGEuQWI9ITApOnNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aChhKX0sTWF0aC5mbG9vcig1RTMpKX1cbmZ1bmN0aW9uIHRoKGEpe2EuQWJ8fDEhPT1hLlVhfHwoYS5mKFwic2VuZGluZyBwaW5nIG9uIHByaW1hcnkuXCIpLHZoKGEse3Q6XCJjXCIsZDp7dDpcInBcIixkOnt9fX0pKX1mdW5jdGlvbiB2aChhLGIpe2lmKDEhPT1hLlVhKXRocm93XCJDb25uZWN0aW9uIGlzIG5vdCBjb25uZWN0ZWRcIjthLmZkLnNlbmQoYil9a2gucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7MiE9PXRoaXMuVWEmJih0aGlzLmYoXCJDbG9zaW5nIHJlYWx0aW1lIGNvbm5lY3Rpb24uXCIpLHRoaXMuVWE9MixyaCh0aGlzKSx0aGlzLmthJiYodGhpcy5rYSgpLHRoaXMua2E9bnVsbCkpfTtmdW5jdGlvbiByaChhKXthLmYoXCJTaHV0dGluZyBkb3duIGFsbCBjb25uZWN0aW9uc1wiKTthLkwmJihhLkwuY2xvc2UoKSxhLkw9bnVsbCk7YS5GJiYoYS5GLmNsb3NlKCksYS5GPW51bGwpO2EudmQmJihjbGVhclRpbWVvdXQoYS52ZCksYS52ZD1udWxsKX07ZnVuY3Rpb24gd2goYSxiLGMsZCl7dGhpcy5pZD14aCsrO3RoaXMuZj1PYyhcInA6XCIrdGhpcy5pZCtcIjpcIik7dGhpcy53Zj10aGlzLkRlPSExO3RoaXMuYWE9e307dGhpcy5wYT1bXTt0aGlzLlhjPTA7dGhpcy5VYz1bXTt0aGlzLm1hPSExO3RoaXMuJGE9MUUzO3RoaXMuQ2Q9M0U1O3RoaXMuR2I9Yjt0aGlzLlRjPWM7dGhpcy5OZT1kO3RoaXMuSD1hO3RoaXMuV2U9bnVsbDt0aGlzLlFkPXt9O3RoaXMuSWc9MDt0aGlzLm1mPSEwO3RoaXMuS2M9dGhpcy5GZT1udWxsO3loKHRoaXMsMCk7TWYudWIoKS5FYihcInZpc2libGVcIix0aGlzLnpnLHRoaXMpOy0xPT09YS5ob3N0LmluZGV4T2YoXCJmYmxvY2FsXCIpJiZMZi51YigpLkViKFwib25saW5lXCIsdGhpcy54Zyx0aGlzKX12YXIgeGg9MCx6aD0wO2g9d2gucHJvdG90eXBlO1xuaC5EYT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9Kyt0aGlzLklnO2E9e3I6ZCxhOmEsYjpifTt0aGlzLmYoQihhKSk7Sih0aGlzLm1hLFwic2VuZFJlcXVlc3QgY2FsbCB3aGVuIHdlJ3JlIG5vdCBjb25uZWN0ZWQgbm90IGFsbG93ZWQuXCIpO3RoaXMuU2EuRGEoYSk7YyYmKHRoaXMuUWRbZF09Yyl9O2gueGY9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS53YSgpLGY9YS5wYXRoLnRvU3RyaW5nKCk7dGhpcy5mKFwiTGlzdGVuIGNhbGxlZCBmb3IgXCIrZitcIiBcIitlKTt0aGlzLmFhW2ZdPXRoaXMuYWFbZl18fHt9O0ooIXRoaXMuYWFbZl1bZV0sXCJsaXN0ZW4oKSBjYWxsZWQgdHdpY2UgZm9yIHNhbWUgcGF0aC9xdWVyeUlkLlwiKTthPXtKOmQsdWQ6YixGZzphLHRhZzpjfTt0aGlzLmFhW2ZdW2VdPWE7dGhpcy5tYSYmQWgodGhpcyxhKX07XG5mdW5jdGlvbiBBaChhLGIpe3ZhciBjPWIuRmcsZD1jLnBhdGgudG9TdHJpbmcoKSxlPWMud2EoKTthLmYoXCJMaXN0ZW4gb24gXCIrZCtcIiBmb3IgXCIrZSk7dmFyIGY9e3A6ZH07Yi50YWcmJihmLnE9Y2UoYy5uKSxmLnQ9Yi50YWcpO2YuaD1iLnVkKCk7YS5EYShcInFcIixmLGZ1bmN0aW9uKGYpe3ZhciBrPWYuZCxsPWYucztpZihrJiZcIm9iamVjdFwiPT09dHlwZW9mIGsmJnUoayxcIndcIikpe3ZhciBtPXcoayxcIndcIik7ZWEobSkmJjA8PU5hKG0sXCJub19pbmRleFwiKSYmUShcIlVzaW5nIGFuIHVuc3BlY2lmaWVkIGluZGV4LiBDb25zaWRlciBhZGRpbmcgXCIrKCdcIi5pbmRleE9uXCI6IFwiJytjLm4uZy50b1N0cmluZygpKydcIicpK1wiIGF0IFwiK2MucGF0aC50b1N0cmluZygpK1wiIHRvIHlvdXIgc2VjdXJpdHkgcnVsZXMgZm9yIGJldHRlciBwZXJmb3JtYW5jZVwiKX0oYS5hYVtkXSYmYS5hYVtkXVtlXSk9PT1iJiYoYS5mKFwibGlzdGVuIHJlc3BvbnNlXCIsZiksXCJva1wiIT09bCYmQmgoYSxkLGUpLGIuSiYmXG5iLkoobCxrKSl9KX1oLlA9ZnVuY3Rpb24oYSxiLGMpe3RoaXMuRmE9e2ZnOmEsbmY6ITEseWM6YixqZDpjfTt0aGlzLmYoXCJBdXRoZW50aWNhdGluZyB1c2luZyBjcmVkZW50aWFsOiBcIithKTtDaCh0aGlzKTsoYj00MD09YS5sZW5ndGgpfHwoYT1hZChhKS5BYyxiPVwib2JqZWN0XCI9PT10eXBlb2YgYSYmITA9PT13KGEsXCJhZG1pblwiKSk7YiYmKHRoaXMuZihcIkFkbWluIGF1dGggY3JlZGVudGlhbCBkZXRlY3RlZC4gIFJlZHVjaW5nIG1heCByZWNvbm5lY3QgdGltZS5cIiksdGhpcy5DZD0zRTQpfTtoLmVlPWZ1bmN0aW9uKGEpe2RlbGV0ZSB0aGlzLkZhO3RoaXMubWEmJnRoaXMuRGEoXCJ1bmF1dGhcIix7fSxmdW5jdGlvbihiKXthKGIucyxiLmQpfSl9O1xuZnVuY3Rpb24gQ2goYSl7dmFyIGI9YS5GYTthLm1hJiZiJiZhLkRhKFwiYXV0aFwiLHtjcmVkOmIuZmd9LGZ1bmN0aW9uKGMpe3ZhciBkPWMucztjPWMuZHx8XCJlcnJvclwiO1wib2tcIiE9PWQmJmEuRmE9PT1iJiZkZWxldGUgYS5GYTtiLm5mP1wib2tcIiE9PWQmJmIuamQmJmIuamQoZCxjKTooYi5uZj0hMCxiLnljJiZiLnljKGQsYykpfSl9aC5PZj1mdW5jdGlvbihhLGIpe3ZhciBjPWEucGF0aC50b1N0cmluZygpLGQ9YS53YSgpO3RoaXMuZihcIlVubGlzdGVuIGNhbGxlZCBmb3IgXCIrYytcIiBcIitkKTtpZihCaCh0aGlzLGMsZCkmJnRoaXMubWEpe3ZhciBlPWNlKGEubik7dGhpcy5mKFwiVW5saXN0ZW4gb24gXCIrYytcIiBmb3IgXCIrZCk7Yz17cDpjfTtiJiYoYy5xPWUsYy50PWIpO3RoaXMuRGEoXCJuXCIsYyl9fTtoLkxlPWZ1bmN0aW9uKGEsYixjKXt0aGlzLm1hP0RoKHRoaXMsXCJvXCIsYSxiLGMpOnRoaXMuVWMucHVzaCh7WmM6YSxhY3Rpb246XCJvXCIsZGF0YTpiLEo6Y30pfTtcbmguQmY9ZnVuY3Rpb24oYSxiLGMpe3RoaXMubWE/RGgodGhpcyxcIm9tXCIsYSxiLGMpOnRoaXMuVWMucHVzaCh7WmM6YSxhY3Rpb246XCJvbVwiLGRhdGE6YixKOmN9KX07aC5HZD1mdW5jdGlvbihhLGIpe3RoaXMubWE/RGgodGhpcyxcIm9jXCIsYSxudWxsLGIpOnRoaXMuVWMucHVzaCh7WmM6YSxhY3Rpb246XCJvY1wiLGRhdGE6bnVsbCxKOmJ9KX07ZnVuY3Rpb24gRGgoYSxiLGMsZCxlKXtjPXtwOmMsZDpkfTthLmYoXCJvbkRpc2Nvbm5lY3QgXCIrYixjKTthLkRhKGIsYyxmdW5jdGlvbihhKXtlJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZShhLnMsYS5kKX0sTWF0aC5mbG9vcigwKSl9KX1oLnB1dD1mdW5jdGlvbihhLGIsYyxkKXtFaCh0aGlzLFwicFwiLGEsYixjLGQpfTtoLnlmPWZ1bmN0aW9uKGEsYixjLGQpe0VoKHRoaXMsXCJtXCIsYSxiLGMsZCl9O1xuZnVuY3Rpb24gRWgoYSxiLGMsZCxlLGYpe2Q9e3A6YyxkOmR9O24oZikmJihkLmg9Zik7YS5wYS5wdXNoKHthY3Rpb246YixJZjpkLEo6ZX0pO2EuWGMrKztiPWEucGEubGVuZ3RoLTE7YS5tYT9GaChhLGIpOmEuZihcIkJ1ZmZlcmluZyBwdXQ6IFwiK2MpfWZ1bmN0aW9uIEZoKGEsYil7dmFyIGM9YS5wYVtiXS5hY3Rpb24sZD1hLnBhW2JdLklmLGU9YS5wYVtiXS5KO2EucGFbYl0uR2c9YS5tYTthLkRhKGMsZCxmdW5jdGlvbihkKXthLmYoYytcIiByZXNwb25zZVwiLGQpO2RlbGV0ZSBhLnBhW2JdO2EuWGMtLTswPT09YS5YYyYmKGEucGE9W10pO2UmJmUoZC5zLGQuZCl9KX1oLlRlPWZ1bmN0aW9uKGEpe3RoaXMubWEmJihhPXtjOmF9LHRoaXMuZihcInJlcG9ydFN0YXRzXCIsYSksdGhpcy5EYShcInNcIixhLGZ1bmN0aW9uKGEpe1wib2tcIiE9PWEucyYmdGhpcy5mKFwicmVwb3J0U3RhdHNcIixcIkVycm9yIHNlbmRpbmcgc3RhdHM6IFwiK2EuZCl9KSl9O1xuaC5GZD1mdW5jdGlvbihhKXtpZihcInJcImluIGEpe3RoaXMuZihcImZyb20gc2VydmVyOiBcIitCKGEpKTt2YXIgYj1hLnIsYz10aGlzLlFkW2JdO2MmJihkZWxldGUgdGhpcy5RZFtiXSxjKGEuYikpfWVsc2V7aWYoXCJlcnJvclwiaW4gYSl0aHJvd1wiQSBzZXJ2ZXItc2lkZSBlcnJvciBoYXMgb2NjdXJyZWQ6IFwiK2EuZXJyb3I7XCJhXCJpbiBhJiYoYj1hLmEsYz1hLmIsdGhpcy5mKFwiaGFuZGxlU2VydmVyTWVzc2FnZVwiLGIsYyksXCJkXCI9PT1iP3RoaXMuR2IoYy5wLGMuZCwhMSxjLnQpOlwibVwiPT09Yj90aGlzLkdiKGMucCxjLmQsITAsYy50KTpcImNcIj09PWI/R2godGhpcyxjLnAsYy5xKTpcImFjXCI9PT1iPyhhPWMucyxiPWMuZCxjPXRoaXMuRmEsZGVsZXRlIHRoaXMuRmEsYyYmYy5qZCYmYy5qZChhLGIpKTpcInNkXCI9PT1iP3RoaXMuV2U/dGhpcy5XZShjKTpcIm1zZ1wiaW4gYyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlJiZjb25zb2xlLmxvZyhcIkZJUkVCQVNFOiBcIitjLm1zZy5yZXBsYWNlKFwiXFxuXCIsXG5cIlxcbkZJUkVCQVNFOiBcIikpOlBjKFwiVW5yZWNvZ25pemVkIGFjdGlvbiByZWNlaXZlZCBmcm9tIHNlcnZlcjogXCIrQihiKStcIlxcbkFyZSB5b3UgdXNpbmcgdGhlIGxhdGVzdCBjbGllbnQ/XCIpKX19O2guVmM9ZnVuY3Rpb24oYSl7dGhpcy5mKFwiY29ubmVjdGlvbiByZWFkeVwiKTt0aGlzLm1hPSEwO3RoaXMuS2M9KG5ldyBEYXRlKS5nZXRUaW1lKCk7dGhpcy5OZSh7c2VydmVyVGltZU9mZnNldDphLShuZXcgRGF0ZSkuZ2V0VGltZSgpfSk7dGhpcy5tZiYmKGE9e30sYVtcInNkay5qcy5cIitcIjIuMi40XCIucmVwbGFjZSgvXFwuL2csXCItXCIpXT0xLGtnKCkmJihhW1wiZnJhbWV3b3JrLmNvcmRvdmFcIl09MSksdGhpcy5UZShhKSk7SGgodGhpcyk7dGhpcy5tZj0hMTt0aGlzLlRjKCEwKX07XG5mdW5jdGlvbiB5aChhLGIpe0ooIWEuU2EsXCJTY2hlZHVsaW5nIGEgY29ubmVjdCB3aGVuIHdlJ3JlIGFscmVhZHkgY29ubmVjdGVkL2luZz9cIik7YS5TYiYmY2xlYXJUaW1lb3V0KGEuU2IpO2EuU2I9c2V0VGltZW91dChmdW5jdGlvbigpe2EuU2I9bnVsbDtJaChhKX0sTWF0aC5mbG9vcihiKSl9aC56Zz1mdW5jdGlvbihhKXthJiYhdGhpcy51YyYmdGhpcy4kYT09PXRoaXMuQ2QmJih0aGlzLmYoXCJXaW5kb3cgYmVjYW1lIHZpc2libGUuICBSZWR1Y2luZyBkZWxheS5cIiksdGhpcy4kYT0xRTMsdGhpcy5TYXx8eWgodGhpcywwKSk7dGhpcy51Yz1hfTtoLnhnPWZ1bmN0aW9uKGEpe2E/KHRoaXMuZihcIkJyb3dzZXIgd2VudCBvbmxpbmUuXCIpLHRoaXMuJGE9MUUzLHRoaXMuU2F8fHloKHRoaXMsMCkpOih0aGlzLmYoXCJCcm93c2VyIHdlbnQgb2ZmbGluZS4gIEtpbGxpbmcgY29ubmVjdGlvbi5cIiksdGhpcy5TYSYmdGhpcy5TYS5jbG9zZSgpKX07XG5oLkNmPWZ1bmN0aW9uKCl7dGhpcy5mKFwiZGF0YSBjbGllbnQgZGlzY29ubmVjdGVkXCIpO3RoaXMubWE9ITE7dGhpcy5TYT1udWxsO2Zvcih2YXIgYT0wO2E8dGhpcy5wYS5sZW5ndGg7YSsrKXt2YXIgYj10aGlzLnBhW2FdO2ImJlwiaFwiaW4gYi5JZiYmYi5HZyYmKGIuSiYmYi5KKFwiZGlzY29ubmVjdFwiKSxkZWxldGUgdGhpcy5wYVthXSx0aGlzLlhjLS0pfTA9PT10aGlzLlhjJiYodGhpcy5wYT1bXSk7dGhpcy5RZD17fTtKaCh0aGlzKSYmKHRoaXMudWM/dGhpcy5LYyYmKDNFNDwobmV3IERhdGUpLmdldFRpbWUoKS10aGlzLktjJiYodGhpcy4kYT0xRTMpLHRoaXMuS2M9bnVsbCk6KHRoaXMuZihcIldpbmRvdyBpc24ndCB2aXNpYmxlLiAgRGVsYXlpbmcgcmVjb25uZWN0LlwiKSx0aGlzLiRhPXRoaXMuQ2QsdGhpcy5GZT0obmV3IERhdGUpLmdldFRpbWUoKSksYT1NYXRoLm1heCgwLHRoaXMuJGEtKChuZXcgRGF0ZSkuZ2V0VGltZSgpLXRoaXMuRmUpKSxhKj1NYXRoLnJhbmRvbSgpLHRoaXMuZihcIlRyeWluZyB0byByZWNvbm5lY3QgaW4gXCIrXG5hK1wibXNcIikseWgodGhpcyxhKSx0aGlzLiRhPU1hdGgubWluKHRoaXMuQ2QsMS4zKnRoaXMuJGEpKTt0aGlzLlRjKCExKX07ZnVuY3Rpb24gSWgoYSl7aWYoSmgoYSkpe2EuZihcIk1ha2luZyBhIGNvbm5lY3Rpb24gYXR0ZW1wdFwiKTthLkZlPShuZXcgRGF0ZSkuZ2V0VGltZSgpO2EuS2M9bnVsbDt2YXIgYj1xKGEuRmQsYSksYz1xKGEuVmMsYSksZD1xKGEuQ2YsYSksZT1hLmlkK1wiOlwiK3poKys7YS5TYT1uZXcga2goZSxhLkgsYixjLGQsZnVuY3Rpb24oYil7UShiK1wiIChcIithLkgudG9TdHJpbmcoKStcIilcIik7YS53Zj0hMH0pfX1oLnliPWZ1bmN0aW9uKCl7dGhpcy5EZT0hMDt0aGlzLlNhP3RoaXMuU2EuY2xvc2UoKToodGhpcy5TYiYmKGNsZWFyVGltZW91dCh0aGlzLlNiKSx0aGlzLlNiPW51bGwpLHRoaXMubWEmJnRoaXMuQ2YoKSl9O2gucWM9ZnVuY3Rpb24oKXt0aGlzLkRlPSExO3RoaXMuJGE9MUUzO3RoaXMuU2F8fHloKHRoaXMsMCl9O1xuZnVuY3Rpb24gR2goYSxiLGMpe2M9Yz9RYShjLGZ1bmN0aW9uKGEpe3JldHVybiBXYyhhKX0pLmpvaW4oXCIkXCIpOlwiZGVmYXVsdFwiOyhhPUJoKGEsYixjKSkmJmEuSiYmYS5KKFwicGVybWlzc2lvbl9kZW5pZWRcIil9ZnVuY3Rpb24gQmgoYSxiLGMpe2I9KG5ldyBLKGIpKS50b1N0cmluZygpO3ZhciBkO24oYS5hYVtiXSk/KGQ9YS5hYVtiXVtjXSxkZWxldGUgYS5hYVtiXVtjXSwwPT09cGEoYS5hYVtiXSkmJmRlbGV0ZSBhLmFhW2JdKTpkPXZvaWQgMDtyZXR1cm4gZH1mdW5jdGlvbiBIaChhKXtDaChhKTtyKGEuYWEsZnVuY3Rpb24oYil7cihiLGZ1bmN0aW9uKGIpe0FoKGEsYil9KX0pO2Zvcih2YXIgYj0wO2I8YS5wYS5sZW5ndGg7YisrKWEucGFbYl0mJkZoKGEsYik7Zm9yKDthLlVjLmxlbmd0aDspYj1hLlVjLnNoaWZ0KCksRGgoYSxiLmFjdGlvbixiLlpjLGIuZGF0YSxiLkopfWZ1bmN0aW9uIEpoKGEpe3ZhciBiO2I9TGYudWIoKS5pYztyZXR1cm4hYS53ZiYmIWEuRGUmJmJ9O3ZhciBWPXtsZzpmdW5jdGlvbigpe1ZnPWRoPSEwfX07Vi5mb3JjZUxvbmdQb2xsaW5nPVYubGc7Vi5tZz1mdW5jdGlvbigpe1dnPSEwfTtWLmZvcmNlV2ViU29ja2V0cz1WLm1nO1YuTWc9ZnVuY3Rpb24oYSxiKXthLmsuUmEuV2U9Yn07Vi5zZXRTZWN1cml0eURlYnVnQ2FsbGJhY2s9Vi5NZztWLlllPWZ1bmN0aW9uKGEsYil7YS5rLlllKGIpfTtWLnN0YXRzPVYuWWU7Vi5aZT1mdW5jdGlvbihhLGIpe2Euay5aZShiKX07Vi5zdGF0c0luY3JlbWVudENvdW50ZXI9Vi5aZTtWLnBkPWZ1bmN0aW9uKGEpe3JldHVybiBhLmsucGR9O1YuZGF0YVVwZGF0ZUNvdW50PVYucGQ7Vi5wZz1mdW5jdGlvbihhLGIpe2Euay5DZT1ifTtWLmludGVyY2VwdFNlcnZlckRhdGE9Vi5wZztWLnZnPWZ1bmN0aW9uKGEpe25ldyB1ZyhhKX07Vi5vblBvcHVwT3Blbj1WLnZnO1YuS2c9ZnVuY3Rpb24oYSl7Zmc9YX07Vi5zZXRBdXRoZW50aWNhdGlvblNlcnZlcj1WLktnO2Z1bmN0aW9uIFMoYSxiLGMpe3RoaXMuQj1hO3RoaXMuVj1iO3RoaXMuZz1jfVMucHJvdG90eXBlLks9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LnZhbFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLksoKX07Uy5wcm90b3R5cGUudmFsPVMucHJvdG90eXBlLks7Uy5wcm90b3R5cGUubGY9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmV4cG9ydFZhbFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLksoITApfTtTLnByb3RvdHlwZS5leHBvcnRWYWw9Uy5wcm90b3R5cGUubGY7Uy5wcm90b3R5cGUua2c9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmV4aXN0c1wiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4hdGhpcy5CLmUoKX07Uy5wcm90b3R5cGUuZXhpc3RzPVMucHJvdG90eXBlLmtnO1xuUy5wcm90b3R5cGUudz1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmNoaWxkXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO2dhKGEpJiYoYT1TdHJpbmcoYSkpO1hmKFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmNoaWxkXCIsYSk7dmFyIGI9bmV3IEsoYSksYz10aGlzLlYudyhiKTtyZXR1cm4gbmV3IFModGhpcy5CLm9hKGIpLGMsTSl9O1MucHJvdG90eXBlLmNoaWxkPVMucHJvdG90eXBlLnc7Uy5wcm90b3R5cGUuSGE9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5oYXNDaGlsZFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtYZihcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5oYXNDaGlsZFwiLGEpO3ZhciBiPW5ldyBLKGEpO3JldHVybiF0aGlzLkIub2EoYikuZSgpfTtTLnByb3RvdHlwZS5oYXNDaGlsZD1TLnByb3RvdHlwZS5IYTtcblMucHJvdG90eXBlLkE9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmdldFByaW9yaXR5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuQSgpLksoKX07Uy5wcm90b3R5cGUuZ2V0UHJpb3JpdHk9Uy5wcm90b3R5cGUuQTtTLnByb3RvdHlwZS5mb3JFYWNoPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZm9yRWFjaFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmZvckVhY2hcIiwxLGEsITEpO2lmKHRoaXMuQi5OKCkpcmV0dXJuITE7dmFyIGI9dGhpcztyZXR1cm4hIXRoaXMuQi5VKHRoaXMuZyxmdW5jdGlvbihjLGQpe3JldHVybiBhKG5ldyBTKGQsYi5WLncoYyksTSkpfSl9O1MucHJvdG90eXBlLmZvckVhY2g9Uy5wcm90b3R5cGUuZm9yRWFjaDtcblMucHJvdG90eXBlLnRkPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5oYXNDaGlsZHJlblwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLk4oKT8hMTohdGhpcy5CLmUoKX07Uy5wcm90b3R5cGUuaGFzQ2hpbGRyZW49Uy5wcm90b3R5cGUudGQ7Uy5wcm90b3R5cGUubmFtZT1mdW5jdGlvbigpe1EoXCJGaXJlYmFzZS5EYXRhU25hcHNob3QubmFtZSgpIGJlaW5nIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgRmlyZWJhc2UuRGF0YVNuYXBzaG90LmtleSgpIGluc3RlYWQuXCIpO3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QubmFtZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5rZXkoKX07Uy5wcm90b3R5cGUubmFtZT1TLnByb3RvdHlwZS5uYW1lO1MucHJvdG90eXBlLmtleT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3Qua2V5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLlYua2V5KCl9O1xuUy5wcm90b3R5cGUua2V5PVMucHJvdG90eXBlLmtleTtTLnByb3RvdHlwZS5EYj1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QubnVtQ2hpbGRyZW5cIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5EYigpfTtTLnByb3RvdHlwZS5udW1DaGlsZHJlbj1TLnByb3RvdHlwZS5EYjtTLnByb3RvdHlwZS5sYz1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QucmVmXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLlZ9O1MucHJvdG90eXBlLnJlZj1TLnByb3RvdHlwZS5sYztmdW5jdGlvbiBLaChhLGIpe3RoaXMuSD1hO3RoaXMuVmE9T2IoYSk7dGhpcy5lYT1uZXcgdWI7dGhpcy5FZD0xO3RoaXMuUmE9bnVsbDtifHwwPD0oXCJvYmplY3RcIj09PXR5cGVvZiB3aW5kb3cmJndpbmRvdy5uYXZpZ2F0b3ImJndpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50fHxcIlwiKS5zZWFyY2goL2dvb2dsZWJvdHxnb29nbGUgd2VibWFzdGVyIHRvb2xzfGJpbmdib3R8eWFob28hIHNsdXJwfGJhaWR1c3BpZGVyfHlhbmRleGJvdHxkdWNrZHVja2JvdC9pKT8odGhpcy5jYT1uZXcgQWUodGhpcy5ILHEodGhpcy5HYix0aGlzKSksc2V0VGltZW91dChxKHRoaXMuVGMsdGhpcywhMCksMCkpOnRoaXMuY2E9dGhpcy5SYT1uZXcgd2godGhpcy5ILHEodGhpcy5HYix0aGlzKSxxKHRoaXMuVGMsdGhpcykscSh0aGlzLk5lLHRoaXMpKTt0aGlzLlBnPVBiKGEscShmdW5jdGlvbigpe3JldHVybiBuZXcgSmIodGhpcy5WYSx0aGlzLmNhKX0sdGhpcykpO3RoaXMudGM9bmV3IENmO3RoaXMuQmU9XG5uZXcgbmI7dmFyIGM9dGhpczt0aGlzLnpkPW5ldyBnZih7WGU6ZnVuY3Rpb24oYSxiLGYsZyl7Yj1bXTtmPWMuQmUuaihhLnBhdGgpO2YuZSgpfHwoYj1qZihjLnpkLG5ldyBVYih6ZSxhLnBhdGgsZikpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtnKFwib2tcIil9LDApKTtyZXR1cm4gYn0sWmQ6YmF9KTtMaCh0aGlzLFwiY29ubmVjdGVkXCIsITEpO3RoaXMua2E9bmV3IHFjO3RoaXMuUD1uZXcgRWcoYSxxKHRoaXMuY2EuUCx0aGlzLmNhKSxxKHRoaXMuY2EuZWUsdGhpcy5jYSkscSh0aGlzLktlLHRoaXMpKTt0aGlzLnBkPTA7dGhpcy5DZT1udWxsO3RoaXMuTz1uZXcgZ2Yoe1hlOmZ1bmN0aW9uKGEsYixmLGcpe2MuY2EueGYoYSxmLGIsZnVuY3Rpb24oYixlKXt2YXIgZj1nKGIsZSk7emIoYy5lYSxhLnBhdGgsZil9KTtyZXR1cm5bXX0sWmQ6ZnVuY3Rpb24oYSxiKXtjLmNhLk9mKGEsYil9fSl9aD1LaC5wcm90b3R5cGU7XG5oLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuKHRoaXMuSC5sYj9cImh0dHBzOi8vXCI6XCJodHRwOi8vXCIpK3RoaXMuSC5ob3N0fTtoLm5hbWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ILkNifTtmdW5jdGlvbiBNaChhKXthPWEuQmUuaihuZXcgSyhcIi5pbmZvL3NlcnZlclRpbWVPZmZzZXRcIikpLksoKXx8MDtyZXR1cm4obmV3IERhdGUpLmdldFRpbWUoKSthfWZ1bmN0aW9uIE5oKGEpe2E9YT17dGltZXN0YW1wOk1oKGEpfTthLnRpbWVzdGFtcD1hLnRpbWVzdGFtcHx8KG5ldyBEYXRlKS5nZXRUaW1lKCk7cmV0dXJuIGF9XG5oLkdiPWZ1bmN0aW9uKGEsYixjLGQpe3RoaXMucGQrKzt2YXIgZT1uZXcgSyhhKTtiPXRoaXMuQ2U/dGhpcy5DZShhLGIpOmI7YT1bXTtkP2M/KGI9bmEoYixmdW5jdGlvbihhKXtyZXR1cm4gTChhKX0pLGE9cmYodGhpcy5PLGUsYixkKSk6KGI9TChiKSxhPW5mKHRoaXMuTyxlLGIsZCkpOmM/KGQ9bmEoYixmdW5jdGlvbihhKXtyZXR1cm4gTChhKX0pLGE9bWYodGhpcy5PLGUsZCkpOihkPUwoYiksYT1qZih0aGlzLk8sbmV3IFViKHplLGUsZCkpKTtkPWU7MDxhLmxlbmd0aCYmKGQ9T2godGhpcyxlKSk7emIodGhpcy5lYSxkLGEpfTtoLlRjPWZ1bmN0aW9uKGEpe0xoKHRoaXMsXCJjb25uZWN0ZWRcIixhKTshMT09PWEmJlBoKHRoaXMpfTtoLk5lPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXM7WWMoYSxmdW5jdGlvbihhLGQpe0xoKGIsZCxhKX0pfTtoLktlPWZ1bmN0aW9uKGEpe0xoKHRoaXMsXCJhdXRoZW50aWNhdGVkXCIsYSl9O1xuZnVuY3Rpb24gTGgoYSxiLGMpe2I9bmV3IEsoXCIvLmluZm8vXCIrYik7Yz1MKGMpO3ZhciBkPWEuQmU7ZC5TZD1kLlNkLkcoYixjKTtjPWpmKGEuemQsbmV3IFViKHplLGIsYykpO3piKGEuZWEsYixjKX1oLktiPWZ1bmN0aW9uKGEsYixjLGQpe3RoaXMuZihcInNldFwiLHtwYXRoOmEudG9TdHJpbmcoKSx2YWx1ZTpiLFhnOmN9KTt2YXIgZT1OaCh0aGlzKTtiPUwoYixjKTt2YXIgZT1zYyhiLGUpLGY9dGhpcy5FZCsrLGU9aGYodGhpcy5PLGEsZSxmLCEwKTt2Yih0aGlzLmVhLGUpO3ZhciBnPXRoaXM7dGhpcy5jYS5wdXQoYS50b1N0cmluZygpLGIuSyghMCksZnVuY3Rpb24oYixjKXt2YXIgZT1cIm9rXCI9PT1iO2V8fFEoXCJzZXQgYXQgXCIrYStcIiBmYWlsZWQ6IFwiK2IpO2U9bGYoZy5PLGYsIWUpO3piKGcuZWEsYSxlKTtRaChkLGIsYyl9KTtlPVJoKHRoaXMsYSk7T2godGhpcyxlKTt6Yih0aGlzLmVhLGUsW10pfTtcbmgudXBkYXRlPWZ1bmN0aW9uKGEsYixjKXt0aGlzLmYoXCJ1cGRhdGVcIix7cGF0aDphLnRvU3RyaW5nKCksdmFsdWU6Yn0pO3ZhciBkPSEwLGU9TmgodGhpcyksZj17fTtyKGIsZnVuY3Rpb24oYSxiKXtkPSExO3ZhciBjPUwoYSk7ZltiXT1zYyhjLGUpfSk7aWYoZClCYihcInVwZGF0ZSgpIGNhbGxlZCB3aXRoIGVtcHR5IGRhdGEuICBEb24ndCBkbyBhbnl0aGluZy5cIiksUWgoYyxcIm9rXCIpO2Vsc2V7dmFyIGc9dGhpcy5FZCsrLGs9a2YodGhpcy5PLGEsZixnKTt2Yih0aGlzLmVhLGspO3ZhciBsPXRoaXM7dGhpcy5jYS55ZihhLnRvU3RyaW5nKCksYixmdW5jdGlvbihiLGQpe3ZhciBlPVwib2tcIj09PWI7ZXx8UShcInVwZGF0ZSBhdCBcIithK1wiIGZhaWxlZDogXCIrYik7dmFyIGU9bGYobC5PLGcsIWUpLGY9YTswPGUubGVuZ3RoJiYoZj1PaChsLGEpKTt6YihsLmVhLGYsZSk7UWgoYyxiLGQpfSk7Yj1SaCh0aGlzLGEpO09oKHRoaXMsYik7emIodGhpcy5lYSxhLFtdKX19O1xuZnVuY3Rpb24gUGgoYSl7YS5mKFwib25EaXNjb25uZWN0RXZlbnRzXCIpO3ZhciBiPU5oKGEpLGM9W107cmMocGMoYS5rYSxiKSxGLGZ1bmN0aW9uKGIsZSl7Yz1jLmNvbmNhdChqZihhLk8sbmV3IFViKHplLGIsZSkpKTt2YXIgZj1SaChhLGIpO09oKGEsZil9KTthLmthPW5ldyBxYzt6YihhLmVhLEYsYyl9aC5HZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7dGhpcy5jYS5HZChhLnRvU3RyaW5nKCksZnVuY3Rpb24oZCxlKXtcIm9rXCI9PT1kJiZlZyhjLmthLGEpO1FoKGIsZCxlKX0pfTtmdW5jdGlvbiBTaChhLGIsYyxkKXt2YXIgZT1MKGMpO2EuY2EuTGUoYi50b1N0cmluZygpLGUuSyghMCksZnVuY3Rpb24oYyxnKXtcIm9rXCI9PT1jJiZhLmthLm1jKGIsZSk7UWgoZCxjLGcpfSl9ZnVuY3Rpb24gVGgoYSxiLGMsZCxlKXt2YXIgZj1MKGMsZCk7YS5jYS5MZShiLnRvU3RyaW5nKCksZi5LKCEwKSxmdW5jdGlvbihjLGQpe1wib2tcIj09PWMmJmEua2EubWMoYixmKTtRaChlLGMsZCl9KX1cbmZ1bmN0aW9uIFVoKGEsYixjLGQpe3ZhciBlPSEwLGY7Zm9yKGYgaW4gYyllPSExO2U/KEJiKFwib25EaXNjb25uZWN0KCkudXBkYXRlKCkgY2FsbGVkIHdpdGggZW1wdHkgZGF0YS4gIERvbid0IGRvIGFueXRoaW5nLlwiKSxRaChkLFwib2tcIikpOmEuY2EuQmYoYi50b1N0cmluZygpLGMsZnVuY3Rpb24oZSxmKXtpZihcIm9rXCI9PT1lKWZvcih2YXIgbCBpbiBjKXt2YXIgbT1MKGNbbF0pO2Eua2EubWMoYi53KGwpLG0pfVFoKGQsZSxmKX0pfWZ1bmN0aW9uIFZoKGEsYixjKXtjPVwiLmluZm9cIj09PU8oYi5wYXRoKT9hLnpkLk9iKGIsYyk6YS5PLk9iKGIsYyk7eGIoYS5lYSxiLnBhdGgsYyl9aC55Yj1mdW5jdGlvbigpe3RoaXMuUmEmJnRoaXMuUmEueWIoKX07aC5xYz1mdW5jdGlvbigpe3RoaXMuUmEmJnRoaXMuUmEucWMoKX07XG5oLlllPWZ1bmN0aW9uKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7YT8odGhpcy5ZZHx8KHRoaXMuWWQ9bmV3IEliKHRoaXMuVmEpKSxhPXRoaXMuWWQuZ2V0KCkpOmE9dGhpcy5WYS5nZXQoKTt2YXIgYj1SYShzYShhKSxmdW5jdGlvbihhLGIpe3JldHVybiBNYXRoLm1heChiLmxlbmd0aCxhKX0sMCksYztmb3IoYyBpbiBhKXtmb3IodmFyIGQ9YVtjXSxlPWMubGVuZ3RoO2U8YisyO2UrKyljKz1cIiBcIjtjb25zb2xlLmxvZyhjK2QpfX19O2guWmU9ZnVuY3Rpb24oYSl7TGIodGhpcy5WYSxhKTt0aGlzLlBnLk1mW2FdPSEwfTtoLmY9ZnVuY3Rpb24oYSl7dmFyIGI9XCJcIjt0aGlzLlJhJiYoYj10aGlzLlJhLmlkK1wiOlwiKTtCYihiLGFyZ3VtZW50cyl9O1xuZnVuY3Rpb24gUWgoYSxiLGMpe2EmJkNiKGZ1bmN0aW9uKCl7aWYoXCJva1wiPT1iKWEobnVsbCk7ZWxzZXt2YXIgZD0oYnx8XCJlcnJvclwiKS50b1VwcGVyQ2FzZSgpLGU9ZDtjJiYoZSs9XCI6IFwiK2MpO2U9RXJyb3IoZSk7ZS5jb2RlPWQ7YShlKX19KX07ZnVuY3Rpb24gV2goYSxiLGMsZCxlKXtmdW5jdGlvbiBmKCl7fWEuZihcInRyYW5zYWN0aW9uIG9uIFwiK2IpO3ZhciBnPW5ldyBVKGEsYik7Zy5FYihcInZhbHVlXCIsZik7Yz17cGF0aDpiLHVwZGF0ZTpjLEo6ZCxzdGF0dXM6bnVsbCxFZjpHYygpLGNmOmUsS2Y6MCxnZTpmdW5jdGlvbigpe2cuZ2MoXCJ2YWx1ZVwiLGYpfSxqZTpudWxsLEFhOm51bGwsbWQ6bnVsbCxuZDpudWxsLG9kOm51bGx9O2Q9YS5PLnVhKGIsdm9pZCAwKXx8QztjLm1kPWQ7ZD1jLnVwZGF0ZShkLksoKSk7aWYobihkKSl7U2YoXCJ0cmFuc2FjdGlvbiBmYWlsZWQ6IERhdGEgcmV0dXJuZWQgXCIsZCxjLnBhdGgpO2Muc3RhdHVzPTE7ZT1EZihhLnRjLGIpO3ZhciBrPWUuQmEoKXx8W107ay5wdXNoKGMpO0VmKGUsayk7XCJvYmplY3RcIj09PXR5cGVvZiBkJiZudWxsIT09ZCYmdShkLFwiLnByaW9yaXR5XCIpPyhrPXcoZCxcIi5wcmlvcml0eVwiKSxKKFFmKGspLFwiSW52YWxpZCBwcmlvcml0eSByZXR1cm5lZCBieSB0cmFuc2FjdGlvbi4gUHJpb3JpdHkgbXVzdCBiZSBhIHZhbGlkIHN0cmluZywgZmluaXRlIG51bWJlciwgc2VydmVyIHZhbHVlLCBvciBudWxsLlwiKSk6XG5rPShhLk8udWEoYil8fEMpLkEoKS5LKCk7ZT1OaChhKTtkPUwoZCxrKTtlPXNjKGQsZSk7Yy5uZD1kO2Mub2Q9ZTtjLkFhPWEuRWQrKztjPWhmKGEuTyxiLGUsYy5BYSxjLmNmKTt6YihhLmVhLGIsYyk7WGgoYSl9ZWxzZSBjLmdlKCksYy5uZD1udWxsLGMub2Q9bnVsbCxjLkomJihhPW5ldyBTKGMubWQsbmV3IFUoYSxjLnBhdGgpLE0pLGMuSihudWxsLCExLGEpKX1mdW5jdGlvbiBYaChhLGIpe3ZhciBjPWJ8fGEudGM7Ynx8WWgoYSxjKTtpZihudWxsIT09Yy5CYSgpKXt2YXIgZD1aaChhLGMpO0ooMDxkLmxlbmd0aCxcIlNlbmRpbmcgemVybyBsZW5ndGggdHJhbnNhY3Rpb24gcXVldWVcIik7U2EoZCxmdW5jdGlvbihhKXtyZXR1cm4gMT09PWEuc3RhdHVzfSkmJiRoKGEsYy5wYXRoKCksZCl9ZWxzZSBjLnRkKCkmJmMuVShmdW5jdGlvbihiKXtYaChhLGIpfSl9XG5mdW5jdGlvbiAkaChhLGIsYyl7Zm9yKHZhciBkPVFhKGMsZnVuY3Rpb24oYSl7cmV0dXJuIGEuQWF9KSxlPWEuTy51YShiLGQpfHxDLGQ9ZSxlPWUuaGFzaCgpLGY9MDtmPGMubGVuZ3RoO2YrKyl7dmFyIGc9Y1tmXTtKKDE9PT1nLnN0YXR1cyxcInRyeVRvU2VuZFRyYW5zYWN0aW9uUXVldWVfOiBpdGVtcyBpbiBxdWV1ZSBzaG91bGQgYWxsIGJlIHJ1bi5cIik7Zy5zdGF0dXM9MjtnLktmKys7dmFyIGs9TihiLGcucGF0aCksZD1kLkcoayxnLm5kKX1kPWQuSyghMCk7YS5jYS5wdXQoYi50b1N0cmluZygpLGQsZnVuY3Rpb24oZCl7YS5mKFwidHJhbnNhY3Rpb24gcHV0IHJlc3BvbnNlXCIse3BhdGg6Yi50b1N0cmluZygpLHN0YXR1czpkfSk7dmFyIGU9W107aWYoXCJva1wiPT09ZCl7ZD1bXTtmb3IoZj0wO2Y8Yy5sZW5ndGg7ZisrKXtjW2ZdLnN0YXR1cz0zO2U9ZS5jb25jYXQobGYoYS5PLGNbZl0uQWEpKTtpZihjW2ZdLkope3ZhciBnPWNbZl0ub2Qsaz1uZXcgVShhLGNbZl0ucGF0aCk7ZC5wdXNoKHEoY1tmXS5KLFxubnVsbCxudWxsLCEwLG5ldyBTKGcsayxNKSkpfWNbZl0uZ2UoKX1ZaChhLERmKGEudGMsYikpO1hoKGEpO3piKGEuZWEsYixlKTtmb3IoZj0wO2Y8ZC5sZW5ndGg7ZisrKUNiKGRbZl0pfWVsc2V7aWYoXCJkYXRhc3RhbGVcIj09PWQpZm9yKGY9MDtmPGMubGVuZ3RoO2YrKyljW2ZdLnN0YXR1cz00PT09Y1tmXS5zdGF0dXM/NToxO2Vsc2UgZm9yKFEoXCJ0cmFuc2FjdGlvbiBhdCBcIitiLnRvU3RyaW5nKCkrXCIgZmFpbGVkOiBcIitkKSxmPTA7ZjxjLmxlbmd0aDtmKyspY1tmXS5zdGF0dXM9NSxjW2ZdLmplPWQ7T2goYSxiKX19LGUpfWZ1bmN0aW9uIE9oKGEsYil7dmFyIGM9YWkoYSxiKSxkPWMucGF0aCgpLGM9WmgoYSxjKTtiaShhLGMsZCk7cmV0dXJuIGR9XG5mdW5jdGlvbiBiaShhLGIsYyl7aWYoMCE9PWIubGVuZ3RoKXtmb3IodmFyIGQ9W10sZT1bXSxmPVFhKGIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuQWF9KSxnPTA7ZzxiLmxlbmd0aDtnKyspe3ZhciBrPWJbZ10sbD1OKGMsay5wYXRoKSxtPSExLHY7SihudWxsIT09bCxcInJlcnVuVHJhbnNhY3Rpb25zVW5kZXJOb2RlXzogcmVsYXRpdmVQYXRoIHNob3VsZCBub3QgYmUgbnVsbC5cIik7aWYoNT09PWsuc3RhdHVzKW09ITAsdj1rLmplLGU9ZS5jb25jYXQobGYoYS5PLGsuQWEsITApKTtlbHNlIGlmKDE9PT1rLnN0YXR1cylpZigyNTw9ay5LZiltPSEwLHY9XCJtYXhyZXRyeVwiLGU9ZS5jb25jYXQobGYoYS5PLGsuQWEsITApKTtlbHNle3ZhciB5PWEuTy51YShrLnBhdGgsZil8fEM7ay5tZD15O3ZhciBJPWJbZ10udXBkYXRlKHkuSygpKTtuKEkpPyhTZihcInRyYW5zYWN0aW9uIGZhaWxlZDogRGF0YSByZXR1cm5lZCBcIixJLGsucGF0aCksbD1MKEkpLFwib2JqZWN0XCI9PT10eXBlb2YgSSYmbnVsbCE9XG5JJiZ1KEksXCIucHJpb3JpdHlcIil8fChsPWwuZGEoeS5BKCkpKSx5PWsuQWEsST1OaChhKSxJPXNjKGwsSSksay5uZD1sLGsub2Q9SSxrLkFhPWEuRWQrKyxWYShmLHkpLGU9ZS5jb25jYXQoaGYoYS5PLGsucGF0aCxJLGsuQWEsay5jZikpLGU9ZS5jb25jYXQobGYoYS5PLHksITApKSk6KG09ITAsdj1cIm5vZGF0YVwiLGU9ZS5jb25jYXQobGYoYS5PLGsuQWEsITApKSl9emIoYS5lYSxjLGUpO2U9W107bSYmKGJbZ10uc3RhdHVzPTMsc2V0VGltZW91dChiW2ddLmdlLE1hdGguZmxvb3IoMCkpLGJbZ10uSiYmKFwibm9kYXRhXCI9PT12PyhrPW5ldyBVKGEsYltnXS5wYXRoKSxkLnB1c2gocShiW2ddLkosbnVsbCxudWxsLCExLG5ldyBTKGJbZ10ubWQsayxNKSkpKTpkLnB1c2gocShiW2ddLkosbnVsbCxFcnJvcih2KSwhMSxudWxsKSkpKX1ZaChhLGEudGMpO2ZvcihnPTA7ZzxkLmxlbmd0aDtnKyspQ2IoZFtnXSk7WGgoYSl9fVxuZnVuY3Rpb24gYWkoYSxiKXtmb3IodmFyIGMsZD1hLnRjO251bGwhPT0oYz1PKGIpKSYmbnVsbD09PWQuQmEoKTspZD1EZihkLGMpLGI9RyhiKTtyZXR1cm4gZH1mdW5jdGlvbiBaaChhLGIpe3ZhciBjPVtdO2NpKGEsYixjKTtjLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS5FZi1iLkVmfSk7cmV0dXJuIGN9ZnVuY3Rpb24gY2koYSxiLGMpe3ZhciBkPWIuQmEoKTtpZihudWxsIT09ZClmb3IodmFyIGU9MDtlPGQubGVuZ3RoO2UrKyljLnB1c2goZFtlXSk7Yi5VKGZ1bmN0aW9uKGIpe2NpKGEsYixjKX0pfWZ1bmN0aW9uIFloKGEsYil7dmFyIGM9Yi5CYSgpO2lmKGMpe2Zvcih2YXIgZD0wLGU9MDtlPGMubGVuZ3RoO2UrKykzIT09Y1tlXS5zdGF0dXMmJihjW2RdPWNbZV0sZCsrKTtjLmxlbmd0aD1kO0VmKGIsMDxjLmxlbmd0aD9jOm51bGwpfWIuVShmdW5jdGlvbihiKXtZaChhLGIpfSl9XG5mdW5jdGlvbiBSaChhLGIpe3ZhciBjPWFpKGEsYikucGF0aCgpLGQ9RGYoYS50YyxiKTtIZihkLGZ1bmN0aW9uKGIpe2RpKGEsYil9KTtkaShhLGQpO0dmKGQsZnVuY3Rpb24oYil7ZGkoYSxiKX0pO3JldHVybiBjfVxuZnVuY3Rpb24gZGkoYSxiKXt2YXIgYz1iLkJhKCk7aWYobnVsbCE9PWMpe2Zvcih2YXIgZD1bXSxlPVtdLGY9LTEsZz0wO2c8Yy5sZW5ndGg7ZysrKTQhPT1jW2ddLnN0YXR1cyYmKDI9PT1jW2ddLnN0YXR1cz8oSihmPT09Zy0xLFwiQWxsIFNFTlQgaXRlbXMgc2hvdWxkIGJlIGF0IGJlZ2lubmluZyBvZiBxdWV1ZS5cIiksZj1nLGNbZ10uc3RhdHVzPTQsY1tnXS5qZT1cInNldFwiKTooSigxPT09Y1tnXS5zdGF0dXMsXCJVbmV4cGVjdGVkIHRyYW5zYWN0aW9uIHN0YXR1cyBpbiBhYm9ydFwiKSxjW2ddLmdlKCksZT1lLmNvbmNhdChsZihhLk8sY1tnXS5BYSwhMCkpLGNbZ10uSiYmZC5wdXNoKHEoY1tnXS5KLG51bGwsRXJyb3IoXCJzZXRcIiksITEsbnVsbCkpKSk7LTE9PT1mP0VmKGIsbnVsbCk6Yy5sZW5ndGg9ZisxO3piKGEuZWEsYi5wYXRoKCksZSk7Zm9yKGc9MDtnPGQubGVuZ3RoO2crKylDYihkW2ddKX19O2Z1bmN0aW9uIFcoKXt0aGlzLm5jPXt9O3RoaXMuUGY9ITF9Y2EoVyk7Vy5wcm90b3R5cGUueWI9ZnVuY3Rpb24oKXtmb3IodmFyIGEgaW4gdGhpcy5uYyl0aGlzLm5jW2FdLnliKCl9O1cucHJvdG90eXBlLmludGVycnVwdD1XLnByb3RvdHlwZS55YjtXLnByb3RvdHlwZS5xYz1mdW5jdGlvbigpe2Zvcih2YXIgYSBpbiB0aGlzLm5jKXRoaXMubmNbYV0ucWMoKX07Vy5wcm90b3R5cGUucmVzdW1lPVcucHJvdG90eXBlLnFjO1cucHJvdG90eXBlLnVlPWZ1bmN0aW9uKCl7dGhpcy5QZj0hMH07ZnVuY3Rpb24gWChhLGIpe3RoaXMuYWQ9YTt0aGlzLnFhPWJ9WC5wcm90b3R5cGUuY2FuY2VsPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5jYW5jZWxcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLmNhbmNlbFwiLDEsYSwhMCk7dGhpcy5hZC5HZCh0aGlzLnFhLGF8fG51bGwpfTtYLnByb3RvdHlwZS5jYW5jZWw9WC5wcm90b3R5cGUuY2FuY2VsO1gucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkucmVtb3ZlXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkucmVtb3ZlXCIsdGhpcy5xYSk7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnJlbW92ZVwiLDEsYSwhMCk7U2godGhpcy5hZCx0aGlzLnFhLG51bGwsYSl9O1gucHJvdG90eXBlLnJlbW92ZT1YLnByb3RvdHlwZS5yZW1vdmU7XG5YLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsdGhpcy5xYSk7UmYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRcIixhLHRoaXMucWEsITEpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRcIiwyLGIsITApO1NoKHRoaXMuYWQsdGhpcy5xYSxhLGIpfTtYLnByb3RvdHlwZS5zZXQ9WC5wcm90b3R5cGUuc2V0O1xuWC5wcm90b3R5cGUuS2I9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIix0aGlzLnFhKTtSZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLGEsdGhpcy5xYSwhMSk7VWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIiwyLGIpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIiwzLGMsITApO1RoKHRoaXMuYWQsdGhpcy5xYSxhLGIsYyl9O1gucHJvdG90eXBlLnNldFdpdGhQcmlvcml0eT1YLnByb3RvdHlwZS5LYjtcblgucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIix0aGlzLnFhKTtpZihlYShhKSl7Zm9yKHZhciBjPXt9LGQ9MDtkPGEubGVuZ3RoOysrZCljW1wiXCIrZF09YVtkXTthPWM7UShcIlBhc3NpbmcgYW4gQXJyYXkgdG8gRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlKCkgaXMgZGVwcmVjYXRlZC4gVXNlIHNldCgpIGlmIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSB0aGUgZXhpc3RpbmcgZGF0YSwgb3IgYW4gT2JqZWN0IHdpdGggaW50ZWdlciBrZXlzIGlmIHlvdSByZWFsbHkgZG8gd2FudCB0byBvbmx5IHVwZGF0ZSBzb21lIG9mIHRoZSBjaGlsZHJlbi5cIil9VGYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIixhLHRoaXMucWEpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGVcIiwyLGIsITApO1xuVWgodGhpcy5hZCx0aGlzLnFhLGEsYil9O1gucHJvdG90eXBlLnVwZGF0ZT1YLnByb3RvdHlwZS51cGRhdGU7ZnVuY3Rpb24gWShhLGIsYyxkKXt0aGlzLms9YTt0aGlzLnBhdGg9Yjt0aGlzLm49Yzt0aGlzLmpjPWR9XG5mdW5jdGlvbiBlaShhKXt2YXIgYj1udWxsLGM9bnVsbDthLmxhJiYoYj1vZChhKSk7YS5uYSYmKGM9cWQoYSkpO2lmKGEuZz09PVZkKXtpZihhLmxhKXtpZihcIltNSU5fTkFNRV1cIiE9bmQoYSkpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBrZXksIHlvdSBtYXkgb25seSBwYXNzIG9uZSBhcmd1bWVudCB0byBzdGFydEF0KCksIGVuZEF0KCksIG9yIGVxdWFsVG8oKS5cIik7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBiKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkga2V5LCB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSxvciBlcXVhbFRvKCkgbXVzdCBiZSBhIHN0cmluZy5cIik7fWlmKGEubmEpe2lmKFwiW01BWF9OQU1FXVwiIT1wZChhKSl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IGtleSwgeW91IG1heSBvbmx5IHBhc3Mgb25lIGFyZ3VtZW50IHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSwgb3IgZXF1YWxUbygpLlwiKTtpZihcInN0cmluZ1wiIT09XG50eXBlb2YgYyl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IGtleSwgdGhlIGFyZ3VtZW50IHBhc3NlZCB0byBzdGFydEF0KCksIGVuZEF0KCksb3IgZXF1YWxUbygpIG11c3QgYmUgYSBzdHJpbmcuXCIpO319ZWxzZSBpZihhLmc9PT1NKXtpZihudWxsIT1iJiYhUWYoYil8fG51bGwhPWMmJiFRZihjKSl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IHByaW9yaXR5LCB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSwgb3IgZXF1YWxUbygpIG11c3QgYmUgYSB2YWxpZCBwcmlvcml0eSB2YWx1ZSAobnVsbCwgYSBudW1iZXIsIG9yIGEgc3RyaW5nKS5cIik7fWVsc2UgaWYoSihhLmcgaW5zdGFuY2VvZiBSZHx8YS5nPT09WWQsXCJ1bmtub3duIGluZGV4IHR5cGUuXCIpLG51bGwhPWImJlwib2JqZWN0XCI9PT10eXBlb2YgYnx8bnVsbCE9YyYmXCJvYmplY3RcIj09PXR5cGVvZiBjKXRocm93IEVycm9yKFwiUXVlcnk6IEZpcnN0IGFyZ3VtZW50IHBhc3NlZCB0byBzdGFydEF0KCksIGVuZEF0KCksIG9yIGVxdWFsVG8oKSBjYW5ub3QgYmUgYW4gb2JqZWN0LlwiKTtcbn1mdW5jdGlvbiBmaShhKXtpZihhLmxhJiZhLm5hJiZhLmlhJiYoIWEuaWF8fFwiXCI9PT1hLk5iKSl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBDYW4ndCBjb21iaW5lIHN0YXJ0QXQoKSwgZW5kQXQoKSwgYW5kIGxpbWl0KCkuIFVzZSBsaW1pdFRvRmlyc3QoKSBvciBsaW1pdFRvTGFzdCgpIGluc3RlYWQuXCIpO31mdW5jdGlvbiBnaShhLGIpe2lmKCEwPT09YS5qYyl0aHJvdyBFcnJvcihiK1wiOiBZb3UgY2FuJ3QgY29tYmluZSBtdWx0aXBsZSBvcmRlckJ5IGNhbGxzLlwiKTt9WS5wcm90b3R5cGUubGM9ZnVuY3Rpb24oKXt4KFwiUXVlcnkucmVmXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiBuZXcgVSh0aGlzLmssdGhpcy5wYXRoKX07WS5wcm90b3R5cGUucmVmPVkucHJvdG90eXBlLmxjO1xuWS5wcm90b3R5cGUuRWI9ZnVuY3Rpb24oYSxiLGMsZCl7eChcIlF1ZXJ5Lm9uXCIsMiw0LGFyZ3VtZW50cy5sZW5ndGgpO1ZmKFwiUXVlcnkub25cIixhLCExKTtBKFwiUXVlcnkub25cIiwyLGIsITEpO3ZhciBlPWhpKFwiUXVlcnkub25cIixjLGQpO2lmKFwidmFsdWVcIj09PWEpVmgodGhpcy5rLHRoaXMsbmV3IGpkKGIsZS5jYW5jZWx8fG51bGwsZS5NYXx8bnVsbCkpO2Vsc2V7dmFyIGY9e307ZlthXT1iO1ZoKHRoaXMuayx0aGlzLG5ldyBrZChmLGUuY2FuY2VsLGUuTWEpKX1yZXR1cm4gYn07WS5wcm90b3R5cGUub249WS5wcm90b3R5cGUuRWI7XG5ZLnByb3RvdHlwZS5nYz1mdW5jdGlvbihhLGIsYyl7eChcIlF1ZXJ5Lm9mZlwiLDAsMyxhcmd1bWVudHMubGVuZ3RoKTtWZihcIlF1ZXJ5Lm9mZlwiLGEsITApO0EoXCJRdWVyeS5vZmZcIiwyLGIsITApO2xiKFwiUXVlcnkub2ZmXCIsMyxjKTt2YXIgZD1udWxsLGU9bnVsbDtcInZhbHVlXCI9PT1hP2Q9bmV3IGpkKGJ8fG51bGwsbnVsbCxjfHxudWxsKTphJiYoYiYmKGU9e30sZVthXT1iKSxkPW5ldyBrZChlLG51bGwsY3x8bnVsbCkpO2U9dGhpcy5rO2Q9XCIuaW5mb1wiPT09Tyh0aGlzLnBhdGgpP2UuemQua2IodGhpcyxkKTplLk8ua2IodGhpcyxkKTt4YihlLmVhLHRoaXMucGF0aCxkKX07WS5wcm90b3R5cGUub2ZmPVkucHJvdG90eXBlLmdjO1xuWS5wcm90b3R5cGUuQWc9ZnVuY3Rpb24oYSxiKXtmdW5jdGlvbiBjKGcpe2YmJihmPSExLGUuZ2MoYSxjKSxiLmNhbGwoZC5NYSxnKSl9eChcIlF1ZXJ5Lm9uY2VcIiwyLDQsYXJndW1lbnRzLmxlbmd0aCk7VmYoXCJRdWVyeS5vbmNlXCIsYSwhMSk7QShcIlF1ZXJ5Lm9uY2VcIiwyLGIsITEpO3ZhciBkPWhpKFwiUXVlcnkub25jZVwiLGFyZ3VtZW50c1syXSxhcmd1bWVudHNbM10pLGU9dGhpcyxmPSEwO3RoaXMuRWIoYSxjLGZ1bmN0aW9uKGIpe2UuZ2MoYSxjKTtkLmNhbmNlbCYmZC5jYW5jZWwuY2FsbChkLk1hLGIpfSl9O1kucHJvdG90eXBlLm9uY2U9WS5wcm90b3R5cGUuQWc7XG5ZLnByb3RvdHlwZS5HZT1mdW5jdGlvbihhKXtRKFwiUXVlcnkubGltaXQoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIFF1ZXJ5LmxpbWl0VG9GaXJzdCgpIG9yIFF1ZXJ5LmxpbWl0VG9MYXN0KCkgaW5zdGVhZC5cIik7eChcIlF1ZXJ5LmxpbWl0XCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKCFnYShhKXx8TWF0aC5mbG9vcihhKSE9PWF8fDA+PWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdDogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCIpO2lmKHRoaXMubi5pYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0OiBMaW1pdCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBsaW1pdCwgbGltaXRUb0ZpcnN0LCBvcmxpbWl0VG9MYXN0LlwiKTt2YXIgYj10aGlzLm4uR2UoYSk7ZmkoYik7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYix0aGlzLmpjKX07WS5wcm90b3R5cGUubGltaXQ9WS5wcm90b3R5cGUuR2U7XG5ZLnByb3RvdHlwZS5IZT1mdW5jdGlvbihhKXt4KFwiUXVlcnkubGltaXRUb0ZpcnN0XCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKCFnYShhKXx8TWF0aC5mbG9vcihhKSE9PWF8fDA+PWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdFRvRmlyc3Q6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLlwiKTtpZih0aGlzLm4uaWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdFRvRmlyc3Q6IExpbWl0IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGxpbWl0LCBsaW1pdFRvRmlyc3QsIG9yIGxpbWl0VG9MYXN0KS5cIik7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsdGhpcy5uLkhlKGEpLHRoaXMuamMpfTtZLnByb3RvdHlwZS5saW1pdFRvRmlyc3Q9WS5wcm90b3R5cGUuSGU7XG5ZLnByb3RvdHlwZS5JZT1mdW5jdGlvbihhKXt4KFwiUXVlcnkubGltaXRUb0xhc3RcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7aWYoIWdhKGEpfHxNYXRoLmZsb29yKGEpIT09YXx8MD49YSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0VG9MYXN0OiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci5cIik7aWYodGhpcy5uLmlhKXRocm93IEVycm9yKFwiUXVlcnkubGltaXRUb0xhc3Q6IExpbWl0IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGxpbWl0LCBsaW1pdFRvRmlyc3QsIG9yIGxpbWl0VG9MYXN0KS5cIik7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsdGhpcy5uLkllKGEpLHRoaXMuamMpfTtZLnByb3RvdHlwZS5saW1pdFRvTGFzdD1ZLnByb3RvdHlwZS5JZTtcblkucHJvdG90eXBlLkJnPWZ1bmN0aW9uKGEpe3goXCJRdWVyeS5vcmRlckJ5Q2hpbGRcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7aWYoXCIka2V5XCI9PT1hKXRocm93IEVycm9yKCdRdWVyeS5vcmRlckJ5Q2hpbGQ6IFwiJGtleVwiIGlzIGludmFsaWQuICBVc2UgUXVlcnkub3JkZXJCeUtleSgpIGluc3RlYWQuJyk7aWYoXCIkcHJpb3JpdHlcIj09PWEpdGhyb3cgRXJyb3IoJ1F1ZXJ5Lm9yZGVyQnlDaGlsZDogXCIkcHJpb3JpdHlcIiBpcyBpbnZhbGlkLiAgVXNlIFF1ZXJ5Lm9yZGVyQnlQcmlvcml0eSgpIGluc3RlYWQuJyk7aWYoXCIkdmFsdWVcIj09PWEpdGhyb3cgRXJyb3IoJ1F1ZXJ5Lm9yZGVyQnlDaGlsZDogXCIkdmFsdWVcIiBpcyBpbnZhbGlkLiAgVXNlIFF1ZXJ5Lm9yZGVyQnlWYWx1ZSgpIGluc3RlYWQuJyk7V2YoXCJRdWVyeS5vcmRlckJ5Q2hpbGRcIiwxLGEsITEpO2dpKHRoaXMsXCJRdWVyeS5vcmRlckJ5Q2hpbGRcIik7dmFyIGI9YmUodGhpcy5uLG5ldyBSZChhKSk7ZWkoYik7cmV0dXJuIG5ldyBZKHRoaXMuayxcbnRoaXMucGF0aCxiLCEwKX07WS5wcm90b3R5cGUub3JkZXJCeUNoaWxkPVkucHJvdG90eXBlLkJnO1kucHJvdG90eXBlLkNnPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5Lm9yZGVyQnlLZXlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Z2kodGhpcyxcIlF1ZXJ5Lm9yZGVyQnlLZXlcIik7dmFyIGE9YmUodGhpcy5uLFZkKTtlaShhKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxhLCEwKX07WS5wcm90b3R5cGUub3JkZXJCeUtleT1ZLnByb3RvdHlwZS5DZztZLnByb3RvdHlwZS5EZz1mdW5jdGlvbigpe3goXCJRdWVyeS5vcmRlckJ5UHJpb3JpdHlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Z2kodGhpcyxcIlF1ZXJ5Lm9yZGVyQnlQcmlvcml0eVwiKTt2YXIgYT1iZSh0aGlzLm4sTSk7ZWkoYSk7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYSwhMCl9O1kucHJvdG90eXBlLm9yZGVyQnlQcmlvcml0eT1ZLnByb3RvdHlwZS5EZztcblkucHJvdG90eXBlLkVnPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5Lm9yZGVyQnlWYWx1ZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtnaSh0aGlzLFwiUXVlcnkub3JkZXJCeVZhbHVlXCIpO3ZhciBhPWJlKHRoaXMubixZZCk7ZWkoYSk7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYSwhMCl9O1kucHJvdG90eXBlLm9yZGVyQnlWYWx1ZT1ZLnByb3RvdHlwZS5FZztcblkucHJvdG90eXBlLlhkPWZ1bmN0aW9uKGEsYil7eChcIlF1ZXJ5LnN0YXJ0QXRcIiwwLDIsYXJndW1lbnRzLmxlbmd0aCk7UmYoXCJRdWVyeS5zdGFydEF0XCIsYSx0aGlzLnBhdGgsITApO1dmKFwiUXVlcnkuc3RhcnRBdFwiLDIsYiwhMCk7dmFyIGM9dGhpcy5uLlhkKGEsYik7ZmkoYyk7ZWkoYyk7aWYodGhpcy5uLmxhKXRocm93IEVycm9yKFwiUXVlcnkuc3RhcnRBdDogU3RhcnRpbmcgcG9pbnQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gc3RhcnRBdCBvciBlcXVhbFRvKS5cIik7bihhKXx8KGI9YT1udWxsKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxjLHRoaXMuamMpfTtZLnByb3RvdHlwZS5zdGFydEF0PVkucHJvdG90eXBlLlhkO1xuWS5wcm90b3R5cGUucWQ9ZnVuY3Rpb24oYSxiKXt4KFwiUXVlcnkuZW5kQXRcIiwwLDIsYXJndW1lbnRzLmxlbmd0aCk7UmYoXCJRdWVyeS5lbmRBdFwiLGEsdGhpcy5wYXRoLCEwKTtXZihcIlF1ZXJ5LmVuZEF0XCIsMixiLCEwKTt2YXIgYz10aGlzLm4ucWQoYSxiKTtmaShjKTtlaShjKTtpZih0aGlzLm4ubmEpdGhyb3cgRXJyb3IoXCJRdWVyeS5lbmRBdDogRW5kaW5nIHBvaW50IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGVuZEF0IG9yIGVxdWFsVG8pLlwiKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxjLHRoaXMuamMpfTtZLnByb3RvdHlwZS5lbmRBdD1ZLnByb3RvdHlwZS5xZDtcblkucHJvdG90eXBlLmhnPWZ1bmN0aW9uKGEsYil7eChcIlF1ZXJ5LmVxdWFsVG9cIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7UmYoXCJRdWVyeS5lcXVhbFRvXCIsYSx0aGlzLnBhdGgsITEpO1dmKFwiUXVlcnkuZXF1YWxUb1wiLDIsYiwhMCk7aWYodGhpcy5uLmxhKXRocm93IEVycm9yKFwiUXVlcnkuZXF1YWxUbzogU3RhcnRpbmcgcG9pbnQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gZW5kQXQgb3IgZXF1YWxUbykuXCIpO2lmKHRoaXMubi5uYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmVxdWFsVG86IEVuZGluZyBwb2ludCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBlbmRBdCBvciBlcXVhbFRvKS5cIik7cmV0dXJuIHRoaXMuWGQoYSxiKS5xZChhLGIpfTtZLnByb3RvdHlwZS5lcXVhbFRvPVkucHJvdG90eXBlLmhnO1xuWS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt4KFwiUXVlcnkudG9TdHJpbmdcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Zm9yKHZhciBhPXRoaXMucGF0aCxiPVwiXCIsYz1hLlk7YzxhLm8ubGVuZ3RoO2MrKylcIlwiIT09YS5vW2NdJiYoYis9XCIvXCIrZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhhLm9bY10pKSk7YT10aGlzLmsudG9TdHJpbmcoKSsoYnx8XCIvXCIpO2I9amIoZWUodGhpcy5uKSk7cmV0dXJuIGErPWIucmVwbGFjZSgvXiYvLFwiXCIpfTtZLnByb3RvdHlwZS50b1N0cmluZz1ZLnByb3RvdHlwZS50b1N0cmluZztZLnByb3RvdHlwZS53YT1mdW5jdGlvbigpe3ZhciBhPVdjKGNlKHRoaXMubikpO3JldHVyblwie31cIj09PWE/XCJkZWZhdWx0XCI6YX07XG5mdW5jdGlvbiBoaShhLGIsYyl7dmFyIGQ9e2NhbmNlbDpudWxsLE1hOm51bGx9O2lmKGImJmMpZC5jYW5jZWw9YixBKGEsMyxkLmNhbmNlbCwhMCksZC5NYT1jLGxiKGEsNCxkLk1hKTtlbHNlIGlmKGIpaWYoXCJvYmplY3RcIj09PXR5cGVvZiBiJiZudWxsIT09YilkLk1hPWI7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PT10eXBlb2YgYilkLmNhbmNlbD1iO2Vsc2UgdGhyb3cgRXJyb3IoeihhLDMsITApK1wiIG11c3QgZWl0aGVyIGJlIGEgY2FuY2VsIGNhbGxiYWNrIG9yIGEgY29udGV4dCBvYmplY3QuXCIpO3JldHVybiBkfTt2YXIgWj17fTtaLnZjPXdoO1ouRGF0YUNvbm5lY3Rpb249Wi52Yzt3aC5wcm90b3R5cGUuT2c9ZnVuY3Rpb24oYSxiKXt0aGlzLkRhKFwicVwiLHtwOmF9LGIpfTtaLnZjLnByb3RvdHlwZS5zaW1wbGVMaXN0ZW49Wi52Yy5wcm90b3R5cGUuT2c7d2gucHJvdG90eXBlLmdnPWZ1bmN0aW9uKGEsYil7dGhpcy5EYShcImVjaG9cIix7ZDphfSxiKX07Wi52Yy5wcm90b3R5cGUuZWNobz1aLnZjLnByb3RvdHlwZS5nZzt3aC5wcm90b3R5cGUuaW50ZXJydXB0PXdoLnByb3RvdHlwZS55YjtaLlNmPWtoO1ouUmVhbFRpbWVDb25uZWN0aW9uPVouU2Y7a2gucHJvdG90eXBlLnNlbmRSZXF1ZXN0PWtoLnByb3RvdHlwZS5EYTtraC5wcm90b3R5cGUuY2xvc2U9a2gucHJvdG90eXBlLmNsb3NlO1xuWi5vZz1mdW5jdGlvbihhKXt2YXIgYj13aC5wcm90b3R5cGUucHV0O3doLnByb3RvdHlwZS5wdXQ9ZnVuY3Rpb24oYyxkLGUsZil7bihmKSYmKGY9YSgpKTtiLmNhbGwodGhpcyxjLGQsZSxmKX07cmV0dXJuIGZ1bmN0aW9uKCl7d2gucHJvdG90eXBlLnB1dD1ifX07Wi5oaWphY2tIYXNoPVoub2c7Wi5SZj1FYztaLkNvbm5lY3Rpb25UYXJnZXQ9Wi5SZjtaLndhPWZ1bmN0aW9uKGEpe3JldHVybiBhLndhKCl9O1oucXVlcnlJZGVudGlmaWVyPVoud2E7Wi5xZz1mdW5jdGlvbihhKXtyZXR1cm4gYS5rLlJhLmFhfTtaLmxpc3RlbnM9Wi5xZztaLnVlPWZ1bmN0aW9uKGEpe2EudWUoKX07Wi5mb3JjZVJlc3RDbGllbnQ9Wi51ZTtmdW5jdGlvbiBVKGEsYil7dmFyIGMsZCxlO2lmKGEgaW5zdGFuY2VvZiBLaCljPWEsZD1iO2Vsc2V7eChcIm5ldyBGaXJlYmFzZVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtkPVJjKGFyZ3VtZW50c1swXSk7Yz1kLlFnO1wiZmlyZWJhc2VcIj09PWQuZG9tYWluJiZRYyhkLmhvc3QrXCIgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZC4gUGxlYXNlIHVzZSA8WU9VUiBGSVJFQkFTRT4uZmlyZWJhc2Vpby5jb20gaW5zdGVhZFwiKTtjfHxRYyhcIkNhbm5vdCBwYXJzZSBGaXJlYmFzZSB1cmwuIFBsZWFzZSB1c2UgaHR0cHM6Ly88WU9VUiBGSVJFQkFTRT4uZmlyZWJhc2Vpby5jb21cIik7ZC5sYnx8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cmJndpbmRvdy5sb2NhdGlvbiYmd2luZG93LmxvY2F0aW9uLnByb3RvY29sJiYtMSE9PXdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbC5pbmRleE9mKFwiaHR0cHM6XCIpJiZRKFwiSW5zZWN1cmUgRmlyZWJhc2UgYWNjZXNzIGZyb20gYSBzZWN1cmUgcGFnZS4gUGxlYXNlIHVzZSBodHRwcyBpbiBjYWxscyB0byBuZXcgRmlyZWJhc2UoKS5cIik7XG5jPW5ldyBFYyhkLmhvc3QsZC5sYixjLFwid3NcIj09PWQuc2NoZW1lfHxcIndzc1wiPT09ZC5zY2hlbWUpO2Q9bmV3IEsoZC5aYyk7ZT1kLnRvU3RyaW5nKCk7dmFyIGY7IShmPSFwKGMuaG9zdCl8fDA9PT1jLmhvc3QubGVuZ3RofHwhUGYoYy5DYikpJiYoZj0wIT09ZS5sZW5ndGgpJiYoZSYmKGU9ZS5yZXBsYWNlKC9eXFwvKlxcLmluZm8oXFwvfCQpLyxcIi9cIikpLGY9IShwKGUpJiYwIT09ZS5sZW5ndGgmJiFPZi50ZXN0KGUpKSk7aWYoZil0aHJvdyBFcnJvcih6KFwibmV3IEZpcmViYXNlXCIsMSwhMSkrJ211c3QgYmUgYSB2YWxpZCBmaXJlYmFzZSBVUkwgYW5kIHRoZSBwYXRoIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIltcIiwgb3IgXCJdXCIuJyk7aWYoYilpZihiIGluc3RhbmNlb2YgVyllPWI7ZWxzZSBpZihwKGIpKWU9Vy51YigpLGMuTGQ9YjtlbHNlIHRocm93IEVycm9yKFwiRXhwZWN0ZWQgYSB2YWxpZCBGaXJlYmFzZS5Db250ZXh0IGZvciBzZWNvbmQgYXJndW1lbnQgdG8gbmV3IEZpcmViYXNlKClcIik7XG5lbHNlIGU9Vy51YigpO2Y9Yy50b1N0cmluZygpO3ZhciBnPXcoZS5uYyxmKTtnfHwoZz1uZXcgS2goYyxlLlBmKSxlLm5jW2ZdPWcpO2M9Z31ZLmNhbGwodGhpcyxjLGQsJGQsITEpfW1hKFUsWSk7dmFyIGlpPVUsamk9W1wiRmlyZWJhc2VcIl0sa2k9YWE7amlbMF1pbiBraXx8IWtpLmV4ZWNTY3JpcHR8fGtpLmV4ZWNTY3JpcHQoXCJ2YXIgXCIramlbMF0pO2Zvcih2YXIgbGk7amkubGVuZ3RoJiYobGk9amkuc2hpZnQoKSk7KSFqaS5sZW5ndGgmJm4oaWkpP2tpW2xpXT1paTpraT1raVtsaV0/a2lbbGldOmtpW2xpXT17fTtVLnByb3RvdHlwZS5uYW1lPWZ1bmN0aW9uKCl7UShcIkZpcmViYXNlLm5hbWUoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlLmtleSgpIGluc3RlYWQuXCIpO3goXCJGaXJlYmFzZS5uYW1lXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLmtleSgpfTtVLnByb3RvdHlwZS5uYW1lPVUucHJvdG90eXBlLm5hbWU7XG5VLnByb3RvdHlwZS5rZXk9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2Uua2V5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLnBhdGguZSgpP251bGw6dmModGhpcy5wYXRoKX07VS5wcm90b3R5cGUua2V5PVUucHJvdG90eXBlLmtleTtVLnByb3RvdHlwZS53PWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5jaGlsZFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZihnYShhKSlhPVN0cmluZyhhKTtlbHNlIGlmKCEoYSBpbnN0YW5jZW9mIEspKWlmKG51bGw9PT1PKHRoaXMucGF0aCkpe3ZhciBiPWE7YiYmKGI9Yi5yZXBsYWNlKC9eXFwvKlxcLmluZm8oXFwvfCQpLyxcIi9cIikpO1hmKFwiRmlyZWJhc2UuY2hpbGRcIixiKX1lbHNlIFhmKFwiRmlyZWJhc2UuY2hpbGRcIixhKTtyZXR1cm4gbmV3IFUodGhpcy5rLHRoaXMucGF0aC53KGEpKX07VS5wcm90b3R5cGUuY2hpbGQ9VS5wcm90b3R5cGUudztcblUucHJvdG90eXBlLnBhcmVudD1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5wYXJlbnRcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7dmFyIGE9dGhpcy5wYXRoLnBhcmVudCgpO3JldHVybiBudWxsPT09YT9udWxsOm5ldyBVKHRoaXMuayxhKX07VS5wcm90b3R5cGUucGFyZW50PVUucHJvdG90eXBlLnBhcmVudDtVLnByb3RvdHlwZS5yb290PWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLnJlZlwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtmb3IodmFyIGE9dGhpcztudWxsIT09YS5wYXJlbnQoKTspYT1hLnBhcmVudCgpO3JldHVybiBhfTtVLnByb3RvdHlwZS5yb290PVUucHJvdG90eXBlLnJvb3Q7XG5VLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uuc2V0XCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uuc2V0XCIsdGhpcy5wYXRoKTtSZihcIkZpcmViYXNlLnNldFwiLGEsdGhpcy5wYXRoLCExKTtBKFwiRmlyZWJhc2Uuc2V0XCIsMixiLCEwKTt0aGlzLmsuS2IodGhpcy5wYXRoLGEsbnVsbCxifHxudWxsKX07VS5wcm90b3R5cGUuc2V0PVUucHJvdG90eXBlLnNldDtcblUucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS51cGRhdGVcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS51cGRhdGVcIix0aGlzLnBhdGgpO2lmKGVhKGEpKXtmb3IodmFyIGM9e30sZD0wO2Q8YS5sZW5ndGg7KytkKWNbXCJcIitkXT1hW2RdO2E9YztRKFwiUGFzc2luZyBhbiBBcnJheSB0byBGaXJlYmFzZS51cGRhdGUoKSBpcyBkZXByZWNhdGVkLiBVc2Ugc2V0KCkgaWYgeW91IHdhbnQgdG8gb3ZlcndyaXRlIHRoZSBleGlzdGluZyBkYXRhLCBvciBhbiBPYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXMgaWYgeW91IHJlYWxseSBkbyB3YW50IHRvIG9ubHkgdXBkYXRlIHNvbWUgb2YgdGhlIGNoaWxkcmVuLlwiKX1UZihcIkZpcmViYXNlLnVwZGF0ZVwiLGEsdGhpcy5wYXRoKTtBKFwiRmlyZWJhc2UudXBkYXRlXCIsMixiLCEwKTt0aGlzLmsudXBkYXRlKHRoaXMucGF0aCxhLGJ8fG51bGwpfTtVLnByb3RvdHlwZS51cGRhdGU9VS5wcm90b3R5cGUudXBkYXRlO1xuVS5wcm90b3R5cGUuS2I9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIix0aGlzLnBhdGgpO1JmKFwiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5XCIsYSx0aGlzLnBhdGgsITEpO1VmKFwiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5XCIsMixiKTtBKFwiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5XCIsMyxjLCEwKTtpZihcIi5sZW5ndGhcIj09PXRoaXMua2V5KCl8fFwiLmtleXNcIj09PXRoaXMua2V5KCkpdGhyb3dcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eSBmYWlsZWQ6IFwiK3RoaXMua2V5KCkrXCIgaXMgYSByZWFkLW9ubHkgb2JqZWN0LlwiO3RoaXMuay5LYih0aGlzLnBhdGgsYSxiLGN8fG51bGwpfTtVLnByb3RvdHlwZS5zZXRXaXRoUHJpb3JpdHk9VS5wcm90b3R5cGUuS2I7XG5VLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLnJlbW92ZVwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnJlbW92ZVwiLHRoaXMucGF0aCk7QShcIkZpcmViYXNlLnJlbW92ZVwiLDEsYSwhMCk7dGhpcy5zZXQobnVsbCxhKX07VS5wcm90b3R5cGUucmVtb3ZlPVUucHJvdG90eXBlLnJlbW92ZTtcblUucHJvdG90eXBlLnRyYW5zYWN0aW9uPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwxLDMsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLHRoaXMucGF0aCk7QShcIkZpcmViYXNlLnRyYW5zYWN0aW9uXCIsMSxhLCExKTtBKFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwyLGIsITApO2lmKG4oYykmJlwiYm9vbGVhblwiIT10eXBlb2YgYyl0aHJvdyBFcnJvcih6KFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwzLCEwKStcIm11c3QgYmUgYSBib29sZWFuLlwiKTtpZihcIi5sZW5ndGhcIj09PXRoaXMua2V5KCl8fFwiLmtleXNcIj09PXRoaXMua2V5KCkpdGhyb3dcIkZpcmViYXNlLnRyYW5zYWN0aW9uIGZhaWxlZDogXCIrdGhpcy5rZXkoKStcIiBpcyBhIHJlYWQtb25seSBvYmplY3QuXCI7XCJ1bmRlZmluZWRcIj09PXR5cGVvZiBjJiYoYz0hMCk7V2godGhpcy5rLHRoaXMucGF0aCxhLGJ8fG51bGwsYyl9O1UucHJvdG90eXBlLnRyYW5zYWN0aW9uPVUucHJvdG90eXBlLnRyYW5zYWN0aW9uO1xuVS5wcm90b3R5cGUuTGc9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uuc2V0UHJpb3JpdHlcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLHRoaXMucGF0aCk7VWYoXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLDEsYSk7QShcIkZpcmViYXNlLnNldFByaW9yaXR5XCIsMixiLCEwKTt0aGlzLmsuS2IodGhpcy5wYXRoLncoXCIucHJpb3JpdHlcIiksYSxudWxsLGIpfTtVLnByb3RvdHlwZS5zZXRQcmlvcml0eT1VLnByb3RvdHlwZS5MZztcblUucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UucHVzaFwiLDAsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnB1c2hcIix0aGlzLnBhdGgpO1JmKFwiRmlyZWJhc2UucHVzaFwiLGEsdGhpcy5wYXRoLCEwKTtBKFwiRmlyZWJhc2UucHVzaFwiLDIsYiwhMCk7dmFyIGM9TWgodGhpcy5rKSxjPUtmKGMpLGM9dGhpcy53KGMpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgYSYmbnVsbCE9PWEmJmMuc2V0KGEsYik7cmV0dXJuIGN9O1UucHJvdG90eXBlLnB1c2g9VS5wcm90b3R5cGUucHVzaDtVLnByb3RvdHlwZS5qYj1mdW5jdGlvbigpe1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0XCIsdGhpcy5wYXRoKTtyZXR1cm4gbmV3IFgodGhpcy5rLHRoaXMucGF0aCl9O1UucHJvdG90eXBlLm9uRGlzY29ubmVjdD1VLnByb3RvdHlwZS5qYjtcblUucHJvdG90eXBlLlA9ZnVuY3Rpb24oYSxiLGMpe1EoXCJGaXJlYmFzZVJlZi5hdXRoKCkgYmVpbmcgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBGaXJlYmFzZVJlZi5hdXRoV2l0aEN1c3RvbVRva2VuKCkgaW5zdGVhZC5cIik7eChcIkZpcmViYXNlLmF1dGhcIiwxLDMsYXJndW1lbnRzLmxlbmd0aCk7WmYoXCJGaXJlYmFzZS5hdXRoXCIsYSk7QShcIkZpcmViYXNlLmF1dGhcIiwyLGIsITApO0EoXCJGaXJlYmFzZS5hdXRoXCIsMyxiLCEwKTtLZyh0aGlzLmsuUCxhLHt9LHtyZW1lbWJlcjpcIm5vbmVcIn0sYixjKX07VS5wcm90b3R5cGUuYXV0aD1VLnByb3RvdHlwZS5QO1UucHJvdG90eXBlLmVlPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS51bmF1dGhcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLnVuYXV0aFwiLDEsYSwhMCk7TGcodGhpcy5rLlAsYSl9O1UucHJvdG90eXBlLnVuYXV0aD1VLnByb3RvdHlwZS5lZTtcblUucHJvdG90eXBlLndlPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLmdldEF1dGhcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuay5QLndlKCl9O1UucHJvdG90eXBlLmdldEF1dGg9VS5wcm90b3R5cGUud2U7VS5wcm90b3R5cGUudWc9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub25BdXRoXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS5vbkF1dGhcIiwxLGEsITEpO2xiKFwiRmlyZWJhc2Uub25BdXRoXCIsMixiKTt0aGlzLmsuUC5FYihcImF1dGhfc3RhdHVzXCIsYSxiKX07VS5wcm90b3R5cGUub25BdXRoPVUucHJvdG90eXBlLnVnO1UucHJvdG90eXBlLnRnPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLm9mZkF1dGhcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLm9mZkF1dGhcIiwxLGEsITEpO2xiKFwiRmlyZWJhc2Uub2ZmQXV0aFwiLDIsYik7dGhpcy5rLlAuZ2MoXCJhdXRoX3N0YXR1c1wiLGEsYil9O1UucHJvdG90eXBlLm9mZkF1dGg9VS5wcm90b3R5cGUudGc7XG5VLnByb3RvdHlwZS5XZj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7WmYoXCJGaXJlYmFzZS5hdXRoV2l0aEN1c3RvbVRva2VuXCIsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIiwyLGIsITEpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDMsYywhMCk7S2codGhpcy5rLlAsYSx7fSxjfHx7fSxiKX07VS5wcm90b3R5cGUuYXV0aFdpdGhDdXN0b21Ub2tlbj1VLnByb3RvdHlwZS5XZjtVLnByb3RvdHlwZS5YZj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTskZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDEsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUG9wdXBcIiwzLGMsITApO1BnKHRoaXMuay5QLGEsYyxiKX07XG5VLnByb3RvdHlwZS5hdXRoV2l0aE9BdXRoUG9wdXA9VS5wcm90b3R5cGUuWGY7VS5wcm90b3R5cGUuWWY9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3RcIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7JGYoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3RcIiwxLGEpO0EoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3RcIiwyLGIsITEpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFJlZGlyZWN0XCIsMyxjLCEwKTt2YXIgZD10aGlzLmsuUDtOZyhkKTt2YXIgZT1bd2ddLGY9aWcoYyk7XCJhbm9ueW1vdXNcIj09PWF8fFwiZmlyZWJhc2VcIj09PWE/UihiLHlnKFwiVFJBTlNQT1JUX1VOQVZBSUxBQkxFXCIpKTooUC5zZXQoXCJyZWRpcmVjdF9jbGllbnRfb3B0aW9uc1wiLGYubGQpLE9nKGQsZSxcIi9hdXRoL1wiK2EsZixiKSl9O1UucHJvdG90eXBlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdD1VLnByb3RvdHlwZS5ZZjtcblUucHJvdG90eXBlLlpmPWZ1bmN0aW9uKGEsYixjLGQpe3goXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwzLDQsYXJndW1lbnRzLmxlbmd0aCk7JGYoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwxLGEpO0EoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwzLGMsITEpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsNCxkLCEwKTtwKGIpPygkZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDIsYiksTWcodGhpcy5rLlAsYStcIi90b2tlblwiLHthY2Nlc3NfdG9rZW46Yn0sZCxjKSk6KGFnKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsMixiLCExKSxNZyh0aGlzLmsuUCxhK1wiL3Rva2VuXCIsYixkLGMpKX07VS5wcm90b3R5cGUuYXV0aFdpdGhPQXV0aFRva2VuPVUucHJvdG90eXBlLlpmO1xuVS5wcm90b3R5cGUuVmY9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwxLGEsITEpO2FnKFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMixiLCEwKTtNZyh0aGlzLmsuUCxcImFub255bW91c1wiLHt9LGIsYSl9O1UucHJvdG90eXBlLmF1dGhBbm9ueW1vdXNseT1VLnByb3RvdHlwZS5WZjtcblUucHJvdG90eXBlLiRmPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTthZyhcIkZpcmViYXNlLmF1dGhXaXRoUGFzc3dvcmRcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLGEsXCJlbWFpbFwiKTtiZyhcIkZpcmViYXNlLmF1dGhXaXRoUGFzc3dvcmRcIixhLFwicGFzc3dvcmRcIik7QShcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwzLGMsITApO01nKHRoaXMuay5QLFwicGFzc3dvcmRcIixhLGMsYil9O1UucHJvdG90eXBlLmF1dGhXaXRoUGFzc3dvcmQ9VS5wcm90b3R5cGUuJGY7XG5VLnByb3RvdHlwZS5yZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsYSxcImVtYWlsXCIpO2JnKFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLGEsXCJwYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLDIsYiwhMSk7dGhpcy5rLlAucmUoYSxiKX07VS5wcm90b3R5cGUuY3JlYXRlVXNlcj1VLnByb3RvdHlwZS5yZTtVLnByb3RvdHlwZS5TZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UucmVtb3ZlVXNlclwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsYSxcImVtYWlsXCIpO2JnKFwiRmlyZWJhc2UucmVtb3ZlVXNlclwiLGEsXCJwYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UucmVtb3ZlVXNlclwiLDIsYiwhMSk7dGhpcy5rLlAuU2UoYSxiKX07XG5VLnByb3RvdHlwZS5yZW1vdmVVc2VyPVUucHJvdG90eXBlLlNlO1UucHJvdG90eXBlLm9lPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIixhLFwiZW1haWxcIik7YmcoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLGEsXCJvbGRQYXNzd29yZFwiKTtiZyhcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsYSxcIm5ld1Bhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLDIsYiwhMSk7dGhpcy5rLlAub2UoYSxiKX07VS5wcm90b3R5cGUuY2hhbmdlUGFzc3dvcmQ9VS5wcm90b3R5cGUub2U7XG5VLnByb3RvdHlwZS5uZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLDIsMixhcmd1bWVudHMubGVuZ3RoKTthZyhcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsYSxcIm9sZEVtYWlsXCIpO2JnKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIixhLFwibmV3RW1haWxcIik7YmcoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLGEsXCJwYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIiwyLGIsITEpO3RoaXMuay5QLm5lKGEsYil9O1UucHJvdG90eXBlLmNoYW5nZUVtYWlsPVUucHJvdG90eXBlLm5lO1xuVS5wcm90b3R5cGUuVWU9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLDIsMixhcmd1bWVudHMubGVuZ3RoKTthZyhcIkZpcmViYXNlLnJlc2V0UGFzc3dvcmRcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLGEsXCJlbWFpbFwiKTtBKFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLDIsYiwhMSk7dGhpcy5rLlAuVWUoYSxiKX07VS5wcm90b3R5cGUucmVzZXRQYXNzd29yZD1VLnByb3RvdHlwZS5VZTtVLmdvT2ZmbGluZT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5nb09mZmxpbmVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Vy51YigpLnliKCl9O1UuZ29PbmxpbmU9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuZ29PbmxpbmVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Vy51YigpLnFjKCl9O1xuZnVuY3Rpb24gTmMoYSxiKXtKKCFifHwhMD09PWF8fCExPT09YSxcIkNhbid0IHR1cm4gb24gY3VzdG9tIGxvZ2dlcnMgcGVyc2lzdGVudGx5LlwiKTshMD09PWE/KFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSYmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBjb25zb2xlLmxvZz9BYj1xKGNvbnNvbGUubG9nLGNvbnNvbGUpOlwib2JqZWN0XCI9PT10eXBlb2YgY29uc29sZS5sb2cmJihBYj1mdW5jdGlvbihhKXtjb25zb2xlLmxvZyhhKX0pKSxiJiZQLnNldChcImxvZ2dpbmdfZW5hYmxlZFwiLCEwKSk6YT9BYj1hOihBYj1udWxsLFAucmVtb3ZlKFwibG9nZ2luZ19lbmFibGVkXCIpKX1VLmVuYWJsZUxvZ2dpbmc9TmM7VS5TZXJ2ZXJWYWx1ZT17VElNRVNUQU1QOntcIi5zdlwiOlwidGltZXN0YW1wXCJ9fTtVLlNES19WRVJTSU9OPVwiMi4yLjRcIjtVLklOVEVSTkFMPVY7VS5Db250ZXh0PVc7VS5URVNUX0FDQ0VTUz1aO30pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZWJhc2U7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIHBsdXJhbGl6ZSkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAodHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHBsdXJhbGl6ZSgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRCwgcmVnaXN0ZXJzIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBwbHVyYWxpemUoKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbC5cbiAgICByb290LnBsdXJhbGl6ZSA9IHBsdXJhbGl6ZSgpO1xuICB9XG59KSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gIC8vIFJ1bGUgc3RvcmFnZSAtIHBsdXJhbGl6ZSBhbmQgc2luZ3VsYXJpemUgbmVlZCB0byBiZSBydW4gc2VxdWVudGlhbGx5LFxuICAvLyB3aGlsZSBvdGhlciBydWxlcyBjYW4gYmUgb3B0aW1pemVkIHVzaW5nIGFuIG9iamVjdCBmb3IgaW5zdGFudCBsb29rdXBzLlxuICB2YXIgcGx1cmFsUnVsZXMgICAgICA9IFtdO1xuICB2YXIgc2luZ3VsYXJSdWxlcyAgICA9IFtdO1xuICB2YXIgdW5jb3VudGFibGVzICAgICA9IHt9O1xuICB2YXIgaXJyZWd1bGFyUGx1cmFscyA9IHt9O1xuICB2YXIgaXJyZWd1bGFyU2luZ2xlcyA9IHt9O1xuXG4gIC8qKlxuICAgKiBUaXRsZSBjYXNlIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiB0b1RpdGxlQ2FzZSAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYW5pdGl6ZSBhIHBsdXJhbGl6YXRpb24gcnVsZSB0byBhIHVzYWJsZSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAqXG4gICAqIEBwYXJhbSAgeyhSZWdFeHB8c3RyaW5nKX0gcnVsZVxuICAgKiBAcmV0dXJuIHtSZWdFeHB9XG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZVJ1bGUgKHJ1bGUpIHtcbiAgICBpZiAodHlwZW9mIHJ1bGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicgKyBydWxlICsgJyQnLCAnaScpO1xuICAgIH1cblxuICAgIHJldHVybiBydWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhc3MgaW4gYSB3b3JkIHRva2VuIHRvIHByb2R1Y2UgYSBmdW5jdGlvbiB0aGF0IGNhbiByZXBsaWNhdGUgdGhlIGNhc2Ugb25cbiAgICogYW5vdGhlciB3b3JkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgd29yZFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgdG9rZW5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiByZXN0b3JlQ2FzZSAod29yZCwgdG9rZW4pIHtcbiAgICAvLyBVcHBlciBjYXNlZCB3b3Jkcy4gRS5nLiBcIkhFTExPXCIuXG4gICAgaWYgKHdvcmQgPT09IHdvcmQudG9VcHBlckNhc2UoKSkge1xuICAgICAgcmV0dXJuIHRva2VuLnRvVXBwZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgLy8gVGl0bGUgY2FzZWQgd29yZHMuIEUuZy4gXCJUaXRsZVwiLlxuICAgIGlmICh3b3JkWzBdID09PSB3b3JkWzBdLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIHJldHVybiB0b1RpdGxlQ2FzZSh0b2tlbik7XG4gICAgfVxuXG4gICAgLy8gTG93ZXIgY2FzZWQgd29yZHMuIEUuZy4gXCJ0ZXN0XCIuXG4gICAgcmV0dXJuIHRva2VuLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJwb2xhdGUgYSByZWdleHAgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHN0ciAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGFyZ3MgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGUgKHN0ciwgYXJncykge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFwkKFxcZHsxLDJ9KS9nLCBmdW5jdGlvbiAobWF0Y2gsIGluZGV4KSB7XG4gICAgICByZXR1cm4gYXJnc1tpbmRleF0gfHwgJyc7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemUgYSB3b3JkIGJ5IHBhc3NpbmcgaW4gdGhlIHdvcmQgYW5kIHNhbml0aXphdGlvbiBydWxlcy5cbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgIHdvcmRcbiAgICogQHBhcmFtICB7QXJyYXl9ICAgIGNvbGxlY3Rpb25cbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gc2FuaXRpemVXb3JkICh3b3JkLCBjb2xsZWN0aW9uKSB7XG4gICAgLy8gRW1wdHkgc3RyaW5nIG9yIGRvZXNuJ3QgbmVlZCBmaXhpbmcuXG4gICAgaWYgKCF3b3JkLmxlbmd0aCB8fCB1bmNvdW50YWJsZXMuaGFzT3duUHJvcGVydHkod29yZCkpIHtcbiAgICAgIHJldHVybiB3b3JkO1xuICAgIH1cblxuICAgIHZhciBsZW4gPSBjb2xsZWN0aW9uLmxlbmd0aDtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgc2FuaXRpemF0aW9uIHJ1bGVzIGFuZCB1c2UgdGhlIGZpcnN0IG9uZSB0byBtYXRjaC5cbiAgICB3aGlsZSAobGVuLS0pIHtcbiAgICAgIHZhciBydWxlID0gY29sbGVjdGlvbltsZW5dO1xuXG4gICAgICAvLyBJZiB0aGUgcnVsZSBwYXNzZXMsIHJldHVybiB0aGUgcmVwbGFjZW1lbnQuXG4gICAgICBpZiAocnVsZVswXS50ZXN0KHdvcmQpKSB7XG4gICAgICAgIHJldHVybiB3b3JkLnJlcGxhY2UocnVsZVswXSwgZnVuY3Rpb24gKG1hdGNoLCBpbmRleCwgd29yZCkge1xuICAgICAgICAgIHZhciByZXN1bHQgPSBpbnRlcnBvbGF0ZShydWxlWzFdLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgaWYgKG1hdGNoID09PSAnJykge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3RvcmVDYXNlKHdvcmRbaW5kZXggLSAxXSwgcmVzdWx0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmVzdG9yZUNhc2UobWF0Y2gsIHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB3b3JkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYSB3b3JkIHdpdGggdGhlIHVwZGF0ZWQgd29yZC5cbiAgICpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgIHJlcGxhY2VNYXBcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgIGtlZXBNYXBcbiAgICogQHBhcmFtICB7QXJyYXl9ICAgIHJ1bGVzXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gcmVwbGFjZVdvcmQgKHJlcGxhY2VNYXAsIGtlZXBNYXAsIHJ1bGVzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgICAvLyBHZXQgdGhlIGNvcnJlY3QgdG9rZW4gYW5kIGNhc2UgcmVzdG9yYXRpb24gZnVuY3Rpb25zLlxuICAgICAgdmFyIHRva2VuID0gd29yZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAvLyBDaGVjayBhZ2FpbnN0IHRoZSBrZWVwIG9iamVjdCBtYXAuXG4gICAgICBpZiAoa2VlcE1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuIHJlc3RvcmVDYXNlKHdvcmQsIHRva2VuKTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgYWdhaW5zdCB0aGUgcmVwbGFjZW1lbnQgbWFwIGZvciBhIGRpcmVjdCB3b3JkIHJlcGxhY2VtZW50LlxuICAgICAgaWYgKHJlcGxhY2VNYXAuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG4gICAgICAgIHJldHVybiByZXN0b3JlQ2FzZSh3b3JkLCByZXBsYWNlTWFwW3Rva2VuXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJ1biBhbGwgdGhlIHJ1bGVzIGFnYWluc3QgdGhlIHdvcmQuXG4gICAgICByZXR1cm4gc2FuaXRpemVXb3JkKHdvcmQsIHJ1bGVzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFBsdXJhbGl6ZSBvciBzaW5ndWxhcml6ZSBhIHdvcmQgYmFzZWQgb24gdGhlIHBhc3NlZCBpbiBjb3VudC5cbiAgICpcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgd29yZFxuICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICBjb3VudFxuICAgKiBAcGFyYW0gIHtCb29sZWFufSBpbmNsdXNpdmVcbiAgICogQHJldHVybiB7U3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gcGx1cmFsaXplICh3b3JkLCBjb3VudCwgaW5jbHVzaXZlKSB7XG4gICAgdmFyIHBsdXJhbGl6ZWQgPSBjb3VudCA9PT0gMSA/XG4gICAgICBwbHVyYWxpemUuc2luZ3VsYXIod29yZCkgOiBwbHVyYWxpemUucGx1cmFsKHdvcmQpO1xuXG4gICAgcmV0dXJuIChpbmNsdXNpdmUgPyBjb3VudCArICcgJyA6ICcnKSArIHBsdXJhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogUGx1cmFsaXplIGEgd29yZC5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgcGx1cmFsaXplLnBsdXJhbCA9IHJlcGxhY2VXb3JkKFxuICAgIGlycmVndWxhclNpbmdsZXMsIGlycmVndWxhclBsdXJhbHMsIHBsdXJhbFJ1bGVzXG4gICk7XG5cbiAgLyoqXG4gICAqIFNpbmd1bGFyaXplIGEgd29yZC5cbiAgICpcbiAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgKi9cbiAgcGx1cmFsaXplLnNpbmd1bGFyID0gcmVwbGFjZVdvcmQoXG4gICAgaXJyZWd1bGFyUGx1cmFscywgaXJyZWd1bGFyU2luZ2xlcywgc2luZ3VsYXJSdWxlc1xuICApO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBwbHVyYWxpemF0aW9uIHJ1bGUgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApfSBydWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICByZXBsYWNlbWVudFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZFBsdXJhbFJ1bGUgPSBmdW5jdGlvbiAocnVsZSwgcmVwbGFjZW1lbnQpIHtcbiAgICBwbHVyYWxSdWxlcy5wdXNoKFtzYW5pdGl6ZVJ1bGUocnVsZSksIHJlcGxhY2VtZW50XSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNpbmd1bGFyaXphdGlvbiBydWxlIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKX0gcnVsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgcmVwbGFjZW1lbnRcbiAgICovXG4gIHBsdXJhbGl6ZS5hZGRTaW5ndWxhclJ1bGUgPSBmdW5jdGlvbiAocnVsZSwgcmVwbGFjZW1lbnQpIHtcbiAgICBzaW5ndWxhclJ1bGVzLnB1c2goW3Nhbml0aXplUnVsZShydWxlKSwgcmVwbGFjZW1lbnRdKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGFuIHVuY291bnRhYmxlIHdvcmQgcnVsZS5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHdvcmRcbiAgICovXG4gIHBsdXJhbGl6ZS5hZGRVbmNvdW50YWJsZVJ1bGUgPSBmdW5jdGlvbiAod29yZCkge1xuICAgIGlmICh0eXBlb2Ygd29yZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB1bmNvdW50YWJsZXNbd29yZC50b0xvd2VyQ2FzZSgpXSA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gU2V0IHNpbmd1bGFyIGFuZCBwbHVyYWwgcmVmZXJlbmNlcyBmb3IgdGhlIHdvcmQuXG4gICAgcGx1cmFsaXplLmFkZFBsdXJhbFJ1bGUod29yZCwgJyQwJyk7XG4gICAgcGx1cmFsaXplLmFkZFNpbmd1bGFyUnVsZSh3b3JkLCAnJDAnKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGFuIGlycmVndWxhciB3b3JkIGRlZmluaXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzaW5nbGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBsdXJhbFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZElycmVndWxhclJ1bGUgPSBmdW5jdGlvbiAoc2luZ2xlLCBwbHVyYWwpIHtcbiAgICBwbHVyYWwgPSBwbHVyYWwudG9Mb3dlckNhc2UoKTtcbiAgICBzaW5nbGUgPSBzaW5nbGUudG9Mb3dlckNhc2UoKTtcblxuICAgIGlycmVndWxhclNpbmdsZXNbc2luZ2xlXSA9IHBsdXJhbDtcbiAgICBpcnJlZ3VsYXJQbHVyYWxzW3BsdXJhbF0gPSBzaW5nbGU7XG4gIH07XG5cbiAgLyoqXG4gICAqIElycmVndWxhciBydWxlcy5cbiAgICovXG4gIFtcbiAgICAvLyBQcm9ub3Vucy5cbiAgICBbJ0knLCAgICAgICAgJ3dlJ10sXG4gICAgWydtZScsICAgICAgICd1cyddLFxuICAgIFsnaGUnLCAgICAgICAndGhleSddLFxuICAgIFsnc2hlJywgICAgICAndGhleSddLFxuICAgIFsndGhlbScsICAgICAndGhlbSddLFxuICAgIFsnbXlzZWxmJywgICAnb3Vyc2VsdmVzJ10sXG4gICAgWyd5b3Vyc2VsZicsICd5b3Vyc2VsdmVzJ10sXG4gICAgWydpdHNlbGYnLCAgICd0aGVtc2VsdmVzJ10sXG4gICAgWydoZXJzZWxmJywgICd0aGVtc2VsdmVzJ10sXG4gICAgWydoaW1zZWxmJywgICd0aGVtc2VsdmVzJ10sXG4gICAgWyd0aGVtc2VsZicsICd0aGVtc2VsdmVzJ10sXG4gICAgWyd0aGlzJywgICAgICd0aGVzZSddLFxuICAgIFsndGhhdCcsICAgICAndGhvc2UnXSxcbiAgICAvLyBXb3JkcyBlbmRpbmcgaW4gd2l0aCBhIGNvbnNvbmFudCBhbmQgYG9gLlxuICAgIFsnZWNobycsICdlY2hvZXMnXSxcbiAgICBbJ2RpbmdvJywgJ2RpbmdvZXMnXSxcbiAgICBbJ3ZvbGNhbm8nLCAndm9sY2Fub2VzJ10sXG4gICAgWyd0b3JuYWRvJywgJ3Rvcm5hZG9lcyddLFxuICAgIFsndG9ycGVkbycsICd0b3JwZWRvZXMnXSxcbiAgICAvLyBFbmRzIHdpdGggYHVzYC5cbiAgICBbJ2dlbnVzJywgICdnZW5lcmEnXSxcbiAgICBbJ3Zpc2N1cycsICd2aXNjZXJhJ10sXG4gICAgLy8gRW5kcyB3aXRoIGBtYWAuXG4gICAgWydzdGlnbWEnLCAgICdzdGlnbWF0YSddLFxuICAgIFsnc3RvbWEnLCAgICAnc3RvbWF0YSddLFxuICAgIFsnZG9nbWEnLCAgICAnZG9nbWF0YSddLFxuICAgIFsnbGVtbWEnLCAgICAnbGVtbWF0YSddLFxuICAgIFsnc2NoZW1hJywgICAnc2NoZW1hdGEnXSxcbiAgICBbJ2FuYXRoZW1hJywgJ2FuYXRoZW1hdGEnXSxcbiAgICAvLyBPdGhlciBpcnJlZ3VsYXIgcnVsZXMuXG4gICAgWydveCcsICAgICAgJ294ZW4nXSxcbiAgICBbJ2F4ZScsICAgICAnYXhlcyddLFxuICAgIFsnZGllJywgICAgICdkaWNlJ10sXG4gICAgWyd5ZXMnLCAgICAgJ3llc2VzJ10sXG4gICAgWydmb290JywgICAgJ2ZlZXQnXSxcbiAgICBbJ2VhdmUnLCAgICAnZWF2ZXMnXSxcbiAgICBbJ2dvb3NlJywgICAnZ2Vlc2UnXSxcbiAgICBbJ3Rvb3RoJywgICAndGVldGgnXSxcbiAgICBbJ3F1aXonLCAgICAncXVpenplcyddLFxuICAgIFsnaHVtYW4nLCAgICdodW1hbnMnXSxcbiAgICBbJ3Byb29mJywgICAncHJvb2ZzJ10sXG4gICAgWydjYXJ2ZScsICAgJ2NhcnZlcyddLFxuICAgIFsndmFsdmUnLCAgICd2YWx2ZXMnXSxcbiAgICBbJ3RoaWVmJywgICAndGhpZXZlcyddLFxuICAgIFsnZ2VuaWUnLCAgICdnZW5pZXMnXSxcbiAgICBbJ2dyb292ZScsICAnZ3Jvb3ZlcyddLFxuICAgIFsncGlja2F4ZScsICdwaWNrYXhlcyddLFxuICAgIFsnd2hpc2tleScsICd3aGlza2llcyddXG4gIF0uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgIHJldHVybiBwbHVyYWxpemUuYWRkSXJyZWd1bGFyUnVsZShydWxlWzBdLCBydWxlWzFdKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFBsdXJhbGl6YXRpb24gcnVsZXMuXG4gICAqL1xuICBbXG4gICAgWy9zPyQvaSwgJ3MnXSxcbiAgICBbLyhbXmFlaW91XWVzZSkkL2ksICckMSddLFxuICAgIFsvKGF4fHRlc3QpaXMkL2ksICckMWVzJ10sXG4gICAgWy8oYWxpYXN8W15hb3VddXN8dGxhc3xnYXN8cmlzKSQvaSwgJyQxZXMnXSxcbiAgICBbLyhlW21uXXUpcz8kL2ksICckMXMnXSxcbiAgICBbLyhbXmxdaWFzfFthZWlvdV1sYXN8W2VtanpyXWFzfFtpdV1hbSkkL2ksICckMSddLFxuICAgIFsvKGFsdW1ufHN5bGxhYnxvY3RvcHx2aXJ8cmFkaXxudWNsZXxmdW5nfGNhY3R8c3RpbXVsfHRlcm1pbnxiYWNpbGx8Zm9jfHV0ZXJ8bG9jfHN0cmF0KSg/OnVzfGkpJC9pLCAnJDFpJ10sXG4gICAgWy8oYWx1bW58YWxnfHZlcnRlYnIpKD86YXxhZSkkL2ksICckMWFlJ10sXG4gICAgWy8oc2VyYXBofGNoZXJ1YikoPzppbSk/JC9pLCAnJDFpbSddLFxuICAgIFsvKGhlcnxhdHxncilvJC9pLCAnJDFvZXMnXSxcbiAgICBbLyhhZ2VuZHxhZGRlbmR8bWlsbGVubml8ZGF0fGV4dHJlbXxiYWN0ZXJpfGRlc2lkZXJhdHxzdHJhdHxjYW5kZWxhYnJ8ZXJyYXR8b3Z8c3ltcG9zaXxjdXJyaWN1bHxhdXRvbWF0fHF1b3IpKD86YXx1bSkkL2ksICckMWEnXSxcbiAgICBbLyhhcGhlbGl8aHlwZXJiYXR8cGVyaWhlbGl8YXN5bmRldHxub3VtZW58cGhlbm9tZW58Y3JpdGVyaXxvcmdhbnxwcm9sZWdvbWVufFxcdytoZWRyKSg/OmF8b24pJC9pLCAnJDFhJ10sXG4gICAgWy9zaXMkL2ksICdzZXMnXSxcbiAgICBbLyg/OihpKWZlfChhcnxsfGVhfGVvfG9hfGhvbylmKSQvaSwgJyQxJDJ2ZXMnXSxcbiAgICBbLyhbXmFlaW91eV18cXUpeSQvaSwgJyQxaWVzJ10sXG4gICAgWy8oW15jaF1baWVvXVtsbl0pZXkkL2ksICckMWllcyddLFxuICAgIFsvKHh8Y2h8c3N8c2h8enopJC9pLCAnJDFlcyddLFxuICAgIFsvKG1hdHJ8Y29kfG11cnxzaWx8dmVydHxpbmR8YXBwZW5kKSg/Oml4fGV4KSQvaSwgJyQxaWNlcyddLFxuICAgIFsvKG18bCkoPzppY2V8b3VzZSkkL2ksICckMWljZSddLFxuICAgIFsvKHBlKSg/OnJzb258b3BsZSkkL2ksICckMW9wbGUnXSxcbiAgICBbLyhjaGlsZCkoPzpyZW4pPyQvaSwgJyQxcmVuJ10sXG4gICAgWy9lYXV4JC9pLCAnJDAnXSxcbiAgICBbL21bYWVdbiQvaSwgJ21lbiddXG4gIF0uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgIHJldHVybiBwbHVyYWxpemUuYWRkUGx1cmFsUnVsZShydWxlWzBdLCBydWxlWzFdKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFNpbmd1bGFyaXphdGlvbiBydWxlcy5cbiAgICovXG4gIFtcbiAgICBbL3MkL2ksICcnXSxcbiAgICBbLyhzcykkL2ksICckMSddLFxuICAgIFsvKChhKW5hbHl8KGIpYXwoZClpYWdub3wocClhcmVudGhlfChwKXJvZ25vfChzKXlub3B8KHQpaGUpKD86c2lzfHNlcykkL2ksICckMXNpcyddLFxuICAgIFsvKF5hbmFseSkoPzpzaXN8c2VzKSQvaSwgJyQxc2lzJ10sXG4gICAgWy8oW15hZWZsb3JdKXZlcyQvaSwgJyQxZmUnXSxcbiAgICBbLyhoaXZlfHRpdmV8ZHI/aXZlKXMkL2ksICckMSddLFxuICAgIFsvKGFyfCg/OndvfFthZV0pbHxbZW9dW2FvXSl2ZXMkL2ksICckMWYnXSxcbiAgICBbLyhbXmFlaW91eV18cXUpaWVzJC9pLCAnJDF5J10sXG4gICAgWy8oXltwbF18em9tYnxeKD86bmVjayk/dHxbYWVvXVtsdF18Y3V0KWllcyQvaSwgJyQxaWUnXSxcbiAgICBbLyhbXmNdW2Vvcl1ufHNtaWwpaWVzJC9pLCAnJDFleSddLFxuICAgIFsvKG18bClpY2UkL2ksICckMW91c2UnXSxcbiAgICBbLyhzZXJhcGh8Y2hlcnViKWltJC9pLCAnJDEnXSxcbiAgICBbLyh4fGNofHNzfHNofHp6fHR0b3xnb3xjaG98YWxpYXN8W15hb3VddXN8dGxhc3xnYXN8KD86aGVyfGF0fGdyKW98cmlzKSg/OmVzKT8kL2ksICckMSddLFxuICAgIFsvKGVbbW5ddSlzPyQvaSwgJyQxJ10sXG4gICAgWy8obW92aWV8dHdlbHZlKXMkL2ksICckMSddLFxuICAgIFsvKGNyaXN8dGVzdHxkaWFnbm9zKSg/OmlzfGVzKSQvaSwgJyQxaXMnXSxcbiAgICBbLyhhbHVtbnxzeWxsYWJ8b2N0b3B8dmlyfHJhZGl8bnVjbGV8ZnVuZ3xjYWN0fHN0aW11bHx0ZXJtaW58YmFjaWxsfGZvY3x1dGVyfGxvY3xzdHJhdCkoPzp1c3xpKSQvaSwgJyQxdXMnXSxcbiAgICBbLyhhZ2VuZHxhZGRlbmR8bWlsbGVubml8ZGF0fGV4dHJlbXxiYWN0ZXJpfGRlc2lkZXJhdHxzdHJhdHxjYW5kZWxhYnJ8ZXJyYXR8b3Z8c3ltcG9zaXxjdXJyaWN1bHxhdXRvbWF0fHF1b3IpYSQvaSwgJyQxdW0nXSxcbiAgICBbLyhhcGhlbGl8aHlwZXJiYXR8cGVyaWhlbGl8YXN5bmRldHxub3VtZW58cGhlbm9tZW58Y3JpdGVyaXxvcmdhbnxwcm9sZWdvbWVufFxcdytoZWRyKWEkL2ksICckMW9uJ10sXG4gICAgWy8oYWx1bW58YWxnfHZlcnRlYnIpYWUkL2ksICckMWEnXSxcbiAgICBbLyhjb2R8bXVyfHNpbHx2ZXJ0fGluZClpY2VzJC9pLCAnJDFleCddLFxuICAgIFsvKG1hdHJ8YXBwZW5kKWljZXMkL2ksICckMWl4J10sXG4gICAgWy8ocGUpKHJzb258b3BsZSkkL2ksICckMXJzb24nXSxcbiAgICBbLyhjaGlsZClyZW4kL2ksICckMSddLFxuICAgIFsvKGVhdSl4PyQvaSwgJyQxJ10sXG4gICAgWy9tZW4kL2ksICdtYW4nXVxuICBdLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICByZXR1cm4gcGx1cmFsaXplLmFkZFNpbmd1bGFyUnVsZShydWxlWzBdLCBydWxlWzFdKTtcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFVuY291bnRhYmxlIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIC8vIFNpbmd1bGFyIHdvcmRzIHdpdGggbm8gcGx1cmFscy5cbiAgICAnYWR2aWNlJyxcbiAgICAnYWdlbmRhJyxcbiAgICAnYmlzb24nLFxuICAgICdicmVhbScsXG4gICAgJ2J1ZmZhbG8nLFxuICAgICdjYXJwJyxcbiAgICAnY2hhc3NpcycsXG4gICAgJ2NvZCcsXG4gICAgJ2Nvb3BlcmF0aW9uJyxcbiAgICAnY29ycHMnLFxuICAgICdkaWdlc3Rpb24nLFxuICAgICdkZWJyaXMnLFxuICAgICdkaWFiZXRlcycsXG4gICAgJ2VuZXJneScsXG4gICAgJ2VxdWlwbWVudCcsXG4gICAgJ2VsaycsXG4gICAgJ2V4Y3JldGlvbicsXG4gICAgJ2V4cGVydGlzZScsXG4gICAgJ2Zsb3VuZGVyJyxcbiAgICAnZ2FsbG93cycsXG4gICAgJ2dyYWZmaXRpJyxcbiAgICAnaGVhZHF1YXJ0ZXJzJyxcbiAgICAnaGVhbHRoJyxcbiAgICAnaGVycGVzJyxcbiAgICAnaGlnaGppbmtzJyxcbiAgICAnaG9tZXdvcmsnLFxuICAgICdpbmZvcm1hdGlvbicsXG4gICAgJ2plYW5zJyxcbiAgICAnanVzdGljZScsXG4gICAgJ2t1ZG9zJyxcbiAgICAnbGFib3VyJyxcbiAgICAnbWFjaGluZXJ5JyxcbiAgICAnbWFja2VyZWwnLFxuICAgICdtZWRpYScsXG4gICAgJ21ld3MnLFxuICAgICdtb29zZScsXG4gICAgJ25ld3MnLFxuICAgICdwaWtlJyxcbiAgICAncGxhbmt0b24nLFxuICAgICdwbGllcnMnLFxuICAgICdwb2xsdXRpb24nLFxuICAgICdwcmVtaXNlcycsXG4gICAgJ3JhaW4nLFxuICAgICdyaWNlJyxcbiAgICAnc2FsbW9uJyxcbiAgICAnc2Npc3NvcnMnLFxuICAgICdzZXJpZXMnLFxuICAgICdzZXdhZ2UnLFxuICAgICdzaGFtYmxlcycsXG4gICAgJ3NocmltcCcsXG4gICAgJ3NwZWNpZXMnLFxuICAgICdzdGFmZicsXG4gICAgJ3N3aW5lJyxcbiAgICAndHJvdXQnLFxuICAgICd0dW5hJyxcbiAgICAnd2hpdGluZycsXG4gICAgJ3dpbGRlYmVlc3QnLFxuICAgICd3aWxkbGlmZScsXG4gICAgLy8gUmVnZXhlcy5cbiAgICAvcG94JC9pLCAvLyBcImNoaWNrcG94XCIsIFwic21hbGxwb3hcIlxuICAgIC9vaXMkL2ksXG4gICAgL2RlZXIkL2ksIC8vIFwiZGVlclwiLCBcInJlaW5kZWVyXCJcbiAgICAvZmlzaCQvaSwgLy8gXCJmaXNoXCIsIFwiYmxvd2Zpc2hcIiwgXCJhbmdlbGZpc2hcIlxuICAgIC9zaGVlcCQvaSxcbiAgICAvbWVhc2xlcyQvaSxcbiAgICAvW15hZWlvdV1lc2UkL2kgLy8gXCJjaGluZXNlXCIsIFwiamFwYW5lc2VcIlxuICBdLmZvckVhY2gocGx1cmFsaXplLmFkZFVuY291bnRhYmxlUnVsZSk7XG5cbiAgcmV0dXJuIHBsdXJhbGl6ZTtcbn0pO1xuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxuLyoqXG4gKiBDcmVhdGUgYSBjaGlsZCBpbnN0YW5jZSB0aGF0IHByb3RvdHlwYWxseSBpbmVocml0c1xuICogZGF0YSBvbiBwYXJlbnQuIFRvIGFjaGlldmUgdGhhdCB3ZSBjcmVhdGUgYW4gaW50ZXJtZWRpYXRlXG4gKiBjb25zdHJ1Y3RvciB3aXRoIGl0cyBwcm90b3R5cGUgcG9pbnRpbmcgdG8gcGFyZW50LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbQmFzZUN0b3JdXG4gKiBAcmV0dXJuIHtWdWV9XG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy4kYWRkQ2hpbGQgPSBmdW5jdGlvbiAob3B0cywgQmFzZUN0b3IpIHtcbiAgQmFzZUN0b3IgPSBCYXNlQ3RvciB8fCBfLlZ1ZVxuICBvcHRzID0gb3B0cyB8fCB7fVxuICB2YXIgcGFyZW50ID0gdGhpc1xuICB2YXIgQ2hpbGRWdWVcbiAgdmFyIGluaGVyaXQgPSBvcHRzLmluaGVyaXQgIT09IHVuZGVmaW5lZFxuICAgID8gb3B0cy5pbmhlcml0XG4gICAgOiBCYXNlQ3Rvci5vcHRpb25zLmluaGVyaXRcbiAgaWYgKGluaGVyaXQpIHtcbiAgICB2YXIgY3RvcnMgPSBwYXJlbnQuX2NoaWxkQ3RvcnNcbiAgICBDaGlsZFZ1ZSA9IGN0b3JzW0Jhc2VDdG9yLmNpZF1cbiAgICBpZiAoIUNoaWxkVnVlKSB7XG4gICAgICB2YXIgb3B0aW9uTmFtZSA9IEJhc2VDdG9yLm9wdGlvbnMubmFtZVxuICAgICAgdmFyIGNsYXNzTmFtZSA9IG9wdGlvbk5hbWVcbiAgICAgICAgPyBfLmNsYXNzaWZ5KG9wdGlvbk5hbWUpXG4gICAgICAgIDogJ1Z1ZUNvbXBvbmVudCdcbiAgICAgIENoaWxkVnVlID0gbmV3IEZ1bmN0aW9uKFxuICAgICAgICAncmV0dXJuIGZ1bmN0aW9uICcgKyBjbGFzc05hbWUgKyAnIChvcHRpb25zKSB7JyArXG4gICAgICAgICd0aGlzLmNvbnN0cnVjdG9yID0gJyArIGNsYXNzTmFtZSArICc7JyArXG4gICAgICAgICd0aGlzLl9pbml0KG9wdGlvbnMpIH0nXG4gICAgICApKClcbiAgICAgIENoaWxkVnVlLm9wdGlvbnMgPSBCYXNlQ3Rvci5vcHRpb25zXG4gICAgICBDaGlsZFZ1ZS5wcm90b3R5cGUgPSB0aGlzXG4gICAgICBjdG9yc1tCYXNlQ3Rvci5jaWRdID0gQ2hpbGRWdWVcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgQ2hpbGRWdWUgPSBCYXNlQ3RvclxuICB9XG4gIG9wdHMuX3BhcmVudCA9IHBhcmVudFxuICBvcHRzLl9yb290ID0gcGFyZW50LiRyb290XG4gIHZhciBjaGlsZCA9IG5ldyBDaGlsZFZ1ZShvcHRzKVxuICB0aGlzLl9jaGlsZHJlbi5wdXNoKGNoaWxkKVxuICByZXR1cm4gY2hpbGRcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIFdhdGNoZXIgPSByZXF1aXJlKCcuLi93YXRjaGVyJylcbnZhciBQYXRoID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9wYXRoJylcbnZhciB0ZXh0UGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZXh0JylcbnZhciBkaXJQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL2RpcmVjdGl2ZScpXG52YXIgZXhwUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9leHByZXNzaW9uJylcbnZhciBmaWx0ZXJSRSA9IC9bXnxdXFx8W158XS9cblxuLyoqXG4gKiBHZXQgdGhlIHZhbHVlIGZyb20gYW4gZXhwcmVzc2lvbiBvbiB0aGlzIHZtLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEByZXR1cm4geyp9XG4gKi9cblxuZXhwb3J0cy4kZ2V0ID0gZnVuY3Rpb24gKGV4cCkge1xuICB2YXIgcmVzID0gZXhwUGFyc2VyLnBhcnNlKGV4cClcbiAgaWYgKHJlcykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gcmVzLmdldC5jYWxsKHRoaXMsIHRoaXMpXG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxufVxuXG4vKipcbiAqIFNldCB0aGUgdmFsdWUgZnJvbSBhbiBleHByZXNzaW9uIG9uIHRoaXMgdm0uXG4gKiBUaGUgZXhwcmVzc2lvbiBtdXN0IGJlIGEgdmFsaWQgbGVmdC1oYW5kXG4gKiBleHByZXNzaW9uIGluIGFuIGFzc2lnbm1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5leHBvcnRzLiRzZXQgPSBmdW5jdGlvbiAoZXhwLCB2YWwpIHtcbiAgdmFyIHJlcyA9IGV4cFBhcnNlci5wYXJzZShleHAsIHRydWUpXG4gIGlmIChyZXMgJiYgcmVzLnNldCkge1xuICAgIHJlcy5zZXQuY2FsbCh0aGlzLCB0aGlzLCB2YWwpXG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgYSBwcm9wZXJ0eSBvbiB0aGUgVk1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbmV4cG9ydHMuJGFkZCA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICB0aGlzLl9kYXRhLiRhZGQoa2V5LCB2YWwpXG59XG5cbi8qKlxuICogRGVsZXRlIGEgcHJvcGVydHkgb24gdGhlIFZNXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICovXG5cbmV4cG9ydHMuJGRlbGV0ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdGhpcy5fZGF0YS4kZGVsZXRlKGtleSlcbn1cblxuLyoqXG4gKiBXYXRjaCBhbiBleHByZXNzaW9uLCB0cmlnZ2VyIGNhbGxiYWNrIHdoZW4gaXRzXG4gKiB2YWx1ZSBjaGFuZ2VzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtkZWVwXVxuICogQHBhcmFtIHtCb29sZWFufSBbaW1tZWRpYXRlXVxuICogQHJldHVybiB7RnVuY3Rpb259IC0gdW53YXRjaEZuXG4gKi9cblxuZXhwb3J0cy4kd2F0Y2ggPSBmdW5jdGlvbiAoZXhwLCBjYiwgZGVlcCwgaW1tZWRpYXRlKSB7XG4gIHZhciB2bSA9IHRoaXNcbiAgdmFyIGtleSA9IGRlZXAgPyBleHAgKyAnKipkZWVwKionIDogZXhwXG4gIHZhciB3YXRjaGVyID0gdm0uX3VzZXJXYXRjaGVyc1trZXldXG4gIHZhciB3cmFwcGVkQ2IgPSBmdW5jdGlvbiAodmFsLCBvbGRWYWwpIHtcbiAgICBjYi5jYWxsKHZtLCB2YWwsIG9sZFZhbClcbiAgfVxuICBpZiAoIXdhdGNoZXIpIHtcbiAgICB3YXRjaGVyID0gdm0uX3VzZXJXYXRjaGVyc1trZXldID1cbiAgICAgIG5ldyBXYXRjaGVyKHZtLCBleHAsIHdyYXBwZWRDYiwge1xuICAgICAgICBkZWVwOiBkZWVwLFxuICAgICAgICB1c2VyOiB0cnVlXG4gICAgICB9KVxuICB9IGVsc2Uge1xuICAgIHdhdGNoZXIuYWRkQ2Iod3JhcHBlZENiKVxuICB9XG4gIGlmIChpbW1lZGlhdGUpIHtcbiAgICB3cmFwcGVkQ2Iod2F0Y2hlci52YWx1ZSlcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gdW53YXRjaEZuICgpIHtcbiAgICB3YXRjaGVyLnJlbW92ZUNiKHdyYXBwZWRDYilcbiAgICBpZiAoIXdhdGNoZXIuYWN0aXZlKSB7XG4gICAgICB2bS5fdXNlcldhdGNoZXJzW2tleV0gPSBudWxsXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRXZhbHVhdGUgYSB0ZXh0IGRpcmVjdGl2ZSwgaW5jbHVkaW5nIGZpbHRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLiRldmFsID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgLy8gY2hlY2sgZm9yIGZpbHRlcnMuXG4gIGlmIChmaWx0ZXJSRS50ZXN0KHRleHQpKSB7XG4gICAgdmFyIGRpciA9IGRpclBhcnNlci5wYXJzZSh0ZXh0KVswXVxuICAgIC8vIHRoZSBmaWx0ZXIgcmVnZXggY2hlY2sgbWlnaHQgZ2l2ZSBmYWxzZSBwb3NpdGl2ZVxuICAgIC8vIGZvciBwaXBlcyBpbnNpZGUgc3RyaW5ncywgc28gaXQncyBwb3NzaWJsZSB0aGF0XG4gICAgLy8gd2UgZG9uJ3QgZ2V0IGFueSBmaWx0ZXJzIGhlcmVcbiAgICByZXR1cm4gZGlyLmZpbHRlcnNcbiAgICAgID8gXy5hcHBseUZpbHRlcnMoXG4gICAgICAgICAgdGhpcy4kZ2V0KGRpci5leHByZXNzaW9uKSxcbiAgICAgICAgICBfLnJlc29sdmVGaWx0ZXJzKHRoaXMsIGRpci5maWx0ZXJzKS5yZWFkLFxuICAgICAgICAgIHRoaXNcbiAgICAgICAgKVxuICAgICAgOiB0aGlzLiRnZXQoZGlyLmV4cHJlc3Npb24pXG4gIH0gZWxzZSB7XG4gICAgLy8gbm8gZmlsdGVyXG4gICAgcmV0dXJuIHRoaXMuJGdldCh0ZXh0KVxuICB9XG59XG5cbi8qKlxuICogSW50ZXJwb2xhdGUgYSBwaWVjZSBvZiB0ZW1wbGF0ZSB0ZXh0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy4kaW50ZXJwb2xhdGUgPSBmdW5jdGlvbiAodGV4dCkge1xuICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZSh0ZXh0KVxuICB2YXIgdm0gPSB0aGlzXG4gIGlmICh0b2tlbnMpIHtcbiAgICByZXR1cm4gdG9rZW5zLmxlbmd0aCA9PT0gMVxuICAgICAgPyB2bS4kZXZhbCh0b2tlbnNbMF0udmFsdWUpXG4gICAgICA6IHRva2Vucy5tYXAoZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgcmV0dXJuIHRva2VuLnRhZ1xuICAgICAgICAgICAgPyB2bS4kZXZhbCh0b2tlbi52YWx1ZSlcbiAgICAgICAgICAgIDogdG9rZW4udmFsdWVcbiAgICAgICAgfSkuam9pbignJylcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGV4dFxuICB9XG59XG5cbi8qKlxuICogTG9nIGluc3RhbmNlIGRhdGEgYXMgYSBwbGFpbiBKUyBvYmplY3RcbiAqIHNvIHRoYXQgaXQgaXMgZWFzaWVyIHRvIGluc3BlY3QgaW4gY29uc29sZS5cbiAqIFRoaXMgbWV0aG9kIGFzc3VtZXMgY29uc29sZSBpcyBhdmFpbGFibGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFtwYXRoXVxuICovXG5cbmV4cG9ydHMuJGxvZyA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBkYXRhID0gcGF0aFxuICAgID8gUGF0aC5nZXQodGhpcy5fZGF0YSwgcGF0aClcbiAgICA6IHRoaXMuX2RhdGFcbiAgaWYgKGRhdGEpIHtcbiAgICBkYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgfVxuICBjb25zb2xlLmxvZyhkYXRhKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgdHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4uL3RyYW5zaXRpb24nKVxuXG4vKipcbiAqIEFwcGVuZCBpbnN0YW5jZSB0byB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICovXG5cbmV4cG9ydHMuJGFwcGVuZFRvID0gZnVuY3Rpb24gKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHJldHVybiBpbnNlcnQoXG4gICAgdGhpcywgdGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24sXG4gICAgYXBwZW5kLCB0cmFuc2l0aW9uLmFwcGVuZFxuICApXG59XG5cbi8qKlxuICogUHJlcGVuZCBpbnN0YW5jZSB0byB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICovXG5cbmV4cG9ydHMuJHByZXBlbmRUbyA9IGZ1bmN0aW9uICh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbikge1xuICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpXG4gIGlmICh0YXJnZXQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgdGhpcy4kYmVmb3JlKHRhcmdldC5maXJzdENoaWxkLCBjYiwgd2l0aFRyYW5zaXRpb24pXG4gIH0gZWxzZSB7XG4gICAgdGhpcy4kYXBwZW5kVG8odGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBJbnNlcnQgaW5zdGFuY2UgYmVmb3JlIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gKi9cblxuZXhwb3J0cy4kYmVmb3JlID0gZnVuY3Rpb24gKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHJldHVybiBpbnNlcnQoXG4gICAgdGhpcywgdGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24sXG4gICAgYmVmb3JlLCB0cmFuc2l0aW9uLmJlZm9yZVxuICApXG59XG5cbi8qKlxuICogSW5zZXJ0IGluc3RhbmNlIGFmdGVyIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gKi9cblxuZXhwb3J0cy4kYWZ0ZXIgPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICBpZiAodGFyZ2V0Lm5leHRTaWJsaW5nKSB7XG4gICAgdGhpcy4kYmVmb3JlKHRhcmdldC5uZXh0U2libGluZywgY2IsIHdpdGhUcmFuc2l0aW9uKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuJGFwcGVuZFRvKHRhcmdldC5wYXJlbnROb2RlLCBjYiwgd2l0aFRyYW5zaXRpb24pXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBSZW1vdmUgaW5zdGFuY2UgZnJvbSBET01cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gKi9cblxuZXhwb3J0cy4kcmVtb3ZlID0gZnVuY3Rpb24gKGNiLCB3aXRoVHJhbnNpdGlvbikge1xuICB2YXIgaW5Eb2MgPSB0aGlzLl9pc0F0dGFjaGVkICYmIF8uaW5Eb2ModGhpcy4kZWwpXG4gIC8vIGlmIHdlIGFyZSBub3QgaW4gZG9jdW1lbnQsIG5vIG5lZWQgdG8gY2hlY2tcbiAgLy8gZm9yIHRyYW5zaXRpb25zXG4gIGlmICghaW5Eb2MpIHdpdGhUcmFuc2l0aW9uID0gZmFsc2VcbiAgdmFyIG9wXG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgcmVhbENiID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChpbkRvYykgc2VsZi5fY2FsbEhvb2soJ2RldGFjaGVkJylcbiAgICBpZiAoY2IpIGNiKClcbiAgfVxuICBpZiAoXG4gICAgdGhpcy5faXNCbG9jayAmJlxuICAgICF0aGlzLl9ibG9ja0ZyYWdtZW50Lmhhc0NoaWxkTm9kZXMoKVxuICApIHtcbiAgICBvcCA9IHdpdGhUcmFuc2l0aW9uID09PSBmYWxzZVxuICAgICAgPyBhcHBlbmRcbiAgICAgIDogdHJhbnNpdGlvbi5yZW1vdmVUaGVuQXBwZW5kXG4gICAgYmxvY2tPcCh0aGlzLCB0aGlzLl9ibG9ja0ZyYWdtZW50LCBvcCwgcmVhbENiKVxuICB9IGVsc2Uge1xuICAgIG9wID0gd2l0aFRyYW5zaXRpb24gPT09IGZhbHNlXG4gICAgICA/IHJlbW92ZVxuICAgICAgOiB0cmFuc2l0aW9uLnJlbW92ZVxuICAgIG9wKHRoaXMuJGVsLCB0aGlzLCByZWFsQ2IpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBTaGFyZWQgRE9NIGluc2VydGlvbiBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wMSAtIG9wIGZvciBub24tdHJhbnNpdGlvbiBpbnNlcnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wMiAtIG9wIGZvciB0cmFuc2l0aW9uIGluc2VydFxuICogQHJldHVybiB2bVxuICovXG5cbmZ1bmN0aW9uIGluc2VydCAodm0sIHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uLCBvcDEsIG9wMikge1xuICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpXG4gIHZhciB0YXJnZXRJc0RldGFjaGVkID0gIV8uaW5Eb2ModGFyZ2V0KVxuICB2YXIgb3AgPSB3aXRoVHJhbnNpdGlvbiA9PT0gZmFsc2UgfHwgdGFyZ2V0SXNEZXRhY2hlZFxuICAgID8gb3AxXG4gICAgOiBvcDJcbiAgdmFyIHNob3VsZENhbGxIb29rID1cbiAgICAhdGFyZ2V0SXNEZXRhY2hlZCAmJlxuICAgICF2bS5faXNBdHRhY2hlZCAmJlxuICAgICFfLmluRG9jKHZtLiRlbClcbiAgaWYgKHZtLl9pc0Jsb2NrKSB7XG4gICAgYmxvY2tPcCh2bSwgdGFyZ2V0LCBvcCwgY2IpXG4gIH0gZWxzZSB7XG4gICAgb3Aodm0uJGVsLCB0YXJnZXQsIHZtLCBjYilcbiAgfVxuICBpZiAoc2hvdWxkQ2FsbEhvb2spIHtcbiAgICB2bS5fY2FsbEhvb2soJ2F0dGFjaGVkJylcbiAgfVxuICByZXR1cm4gdm1cbn1cblxuLyoqXG4gKiBFeGVjdXRlIGEgdHJhbnNpdGlvbiBvcGVyYXRpb24gb24gYSBibG9jayBpbnN0YW5jZSxcbiAqIGl0ZXJhdGluZyB0aHJvdWdoIGFsbCBpdHMgYmxvY2sgbm9kZXMuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3BcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxuZnVuY3Rpb24gYmxvY2tPcCAodm0sIHRhcmdldCwgb3AsIGNiKSB7XG4gIHZhciBjdXJyZW50ID0gdm0uX2Jsb2NrU3RhcnRcbiAgdmFyIGVuZCA9IHZtLl9ibG9ja0VuZFxuICB2YXIgbmV4dFxuICB3aGlsZSAobmV4dCAhPT0gZW5kKSB7XG4gICAgbmV4dCA9IGN1cnJlbnQubmV4dFNpYmxpbmdcbiAgICBvcChjdXJyZW50LCB0YXJnZXQsIHZtKVxuICAgIGN1cnJlbnQgPSBuZXh0XG4gIH1cbiAgb3AoZW5kLCB0YXJnZXQsIHZtLCBjYilcbn1cblxuLyoqXG4gKiBDaGVjayBmb3Igc2VsZWN0b3JzXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gZWxcbiAqL1xuXG5mdW5jdGlvbiBxdWVyeSAoZWwpIHtcbiAgcmV0dXJuIHR5cGVvZiBlbCA9PT0gJ3N0cmluZydcbiAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpXG4gICAgOiBlbFxufVxuXG4vKipcbiAqIEFwcGVuZCBvcGVyYXRpb24gdGhhdCB0YWtlcyBhIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm0gLSB1bnVzZWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5mdW5jdGlvbiBhcHBlbmQgKGVsLCB0YXJnZXQsIHZtLCBjYikge1xuICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpXG4gIGlmIChjYikgY2IoKVxufVxuXG4vKipcbiAqIEluc2VydEJlZm9yZSBvcGVyYXRpb24gdGhhdCB0YWtlcyBhIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm0gLSB1bnVzZWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5mdW5jdGlvbiBiZWZvcmUgKGVsLCB0YXJnZXQsIHZtLCBjYikge1xuICBfLmJlZm9yZShlbCwgdGFyZ2V0KVxuICBpZiAoY2IpIGNiKClcbn1cblxuLyoqXG4gKiBSZW1vdmUgb3BlcmF0aW9uIHRoYXQgdGFrZXMgYSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGVsXG4gKiBAcGFyYW0ge1Z1ZX0gdm0gLSB1bnVzZWRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5mdW5jdGlvbiByZW1vdmUgKGVsLCB2bSwgY2IpIHtcbiAgXy5yZW1vdmUoZWwpXG4gIGlmIChjYikgY2IoKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cblxuZXhwb3J0cy4kb24gPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICh0aGlzLl9ldmVudHNbZXZlbnRdIHx8ICh0aGlzLl9ldmVudHNbZXZlbnRdID0gW10pKVxuICAgIC5wdXNoKGZuKVxuICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAxKVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cblxuZXhwb3J0cy4kb25jZSA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGZ1bmN0aW9uIG9uICgpIHtcbiAgICBzZWxmLiRvZmYoZXZlbnQsIG9uKVxuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfVxuICBvbi5mbiA9IGZuXG4gIHRoaXMuJG9uKGV2ZW50LCBvbilcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5cbmV4cG9ydHMuJG9mZiA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgdmFyIGNic1xuICAvLyBhbGxcbiAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgaWYgKHRoaXMuJHBhcmVudCkge1xuICAgICAgZm9yIChldmVudCBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgICAgY2JzID0gdGhpcy5fZXZlbnRzW2V2ZW50XVxuICAgICAgICBpZiAoY2JzKSB7XG4gICAgICAgICAgbW9kaWZ5TGlzdGVuZXJDb3VudCh0aGlzLCBldmVudCwgLWNicy5sZW5ndGgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fZXZlbnRzID0ge31cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIC8vIHNwZWNpZmljIGV2ZW50XG4gIGNicyA9IHRoaXMuX2V2ZW50c1tldmVudF1cbiAgaWYgKCFjYnMpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgbW9kaWZ5TGlzdGVuZXJDb3VudCh0aGlzLCBldmVudCwgLWNicy5sZW5ndGgpXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50XSA9IG51bGxcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIC8vIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiXG4gIHZhciBpID0gY2JzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgY2IgPSBjYnNbaV1cbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgbW9kaWZ5TGlzdGVuZXJDb3VudCh0aGlzLCBldmVudCwgLTEpXG4gICAgICBjYnMuc3BsaWNlKGksIDEpXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFRyaWdnZXIgYW4gZXZlbnQgb24gc2VsZi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqL1xuXG5leHBvcnRzLiRlbWl0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHRoaXMuX2V2ZW50Q2FuY2VsbGVkID0gZmFsc2VcbiAgdmFyIGNicyA9IHRoaXMuX2V2ZW50c1tldmVudF1cbiAgaWYgKGNicykge1xuICAgIC8vIGF2b2lkIGxlYWtpbmcgYXJndW1lbnRzOlxuICAgIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2Nsb3N1cmUtd2l0aC1hcmd1bWVudHNcbiAgICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxXG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoaSlcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXVxuICAgIH1cbiAgICBpID0gMFxuICAgIGNicyA9IGNicy5sZW5ndGggPiAxXG4gICAgICA/IF8udG9BcnJheShjYnMpXG4gICAgICA6IGNic1xuICAgIGZvciAodmFyIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoY2JzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLl9ldmVudENhbmNlbGxlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBSZWN1cnNpdmVseSBicm9hZGNhc3QgYW4gZXZlbnQgdG8gYWxsIGNoaWxkcmVuIGluc3RhbmNlcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7Li4uKn0gYWRkaXRpb25hbCBhcmd1bWVudHNcbiAqL1xuXG5leHBvcnRzLiRicm9hZGNhc3QgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgLy8gaWYgbm8gY2hpbGQgaGFzIHJlZ2lzdGVyZWQgZm9yIHRoaXMgZXZlbnQsXG4gIC8vIHRoZW4gdGhlcmUncyBubyBuZWVkIHRvIGJyb2FkY2FzdC5cbiAgaWYgKCF0aGlzLl9ldmVudHNDb3VudFtldmVudF0pIHJldHVyblxuICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgY2hpbGQuJGVtaXQuYXBwbHkoY2hpbGQsIGFyZ3VtZW50cylcbiAgICBpZiAoIWNoaWxkLl9ldmVudENhbmNlbGxlZCkge1xuICAgICAgY2hpbGQuJGJyb2FkY2FzdC5hcHBseShjaGlsZCwgYXJndW1lbnRzKVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHByb3BhZ2F0ZSBhbiBldmVudCB1cCB0aGUgcGFyZW50IGNoYWluLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHsuLi4qfSBhZGRpdGlvbmFsIGFyZ3VtZW50c1xuICovXG5cbmV4cG9ydHMuJGRpc3BhdGNoID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcGFyZW50ID0gdGhpcy4kcGFyZW50XG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBwYXJlbnQuJGVtaXQuYXBwbHkocGFyZW50LCBhcmd1bWVudHMpXG4gICAgcGFyZW50ID0gcGFyZW50Ll9ldmVudENhbmNlbGxlZFxuICAgICAgPyBudWxsXG4gICAgICA6IHBhcmVudC4kcGFyZW50XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBNb2RpZnkgdGhlIGxpc3RlbmVyIGNvdW50cyBvbiBhbGwgcGFyZW50cy5cbiAqIFRoaXMgYm9va2tlZXBpbmcgYWxsb3dzICRicm9hZGNhc3QgdG8gcmV0dXJuIGVhcmx5IHdoZW5cbiAqIG5vIGNoaWxkIGhhcyBsaXN0ZW5lZCB0byBhIGNlcnRhaW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudFxuICovXG5cbnZhciBob29rUkUgPSAvXmhvb2s6L1xuZnVuY3Rpb24gbW9kaWZ5TGlzdGVuZXJDb3VudCAodm0sIGV2ZW50LCBjb3VudCkge1xuICB2YXIgcGFyZW50ID0gdm0uJHBhcmVudFxuICAvLyBob29rcyBkbyBub3QgZ2V0IGJyb2FkY2FzdGVkIHNvIG5vIG5lZWRcbiAgLy8gdG8gZG8gYm9va2tlZXBpbmcgZm9yIHRoZW1cbiAgaWYgKCFwYXJlbnQgfHwgIWNvdW50IHx8IGhvb2tSRS50ZXN0KGV2ZW50KSkgcmV0dXJuXG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBwYXJlbnQuX2V2ZW50c0NvdW50W2V2ZW50XSA9XG4gICAgICAocGFyZW50Ll9ldmVudHNDb3VudFtldmVudF0gfHwgMCkgKyBjb3VudFxuICAgIHBhcmVudCA9IHBhcmVudC4kcGFyZW50XG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIG1lcmdlT3B0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWwvbWVyZ2Utb3B0aW9uJylcblxuLyoqXG4gKiBFeHBvc2UgdXNlZnVsIGludGVybmFsc1xuICovXG5cbmV4cG9ydHMudXRpbCA9IF9cbmV4cG9ydHMubmV4dFRpY2sgPSBfLm5leHRUaWNrXG5leHBvcnRzLmNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG5cbmV4cG9ydHMuY29tcGlsZXIgPSB7XG4gIGNvbXBpbGU6IHJlcXVpcmUoJy4uL2NvbXBpbGVyL2NvbXBpbGUnKSxcbiAgdHJhbnNjbHVkZTogcmVxdWlyZSgnLi4vY29tcGlsZXIvdHJhbnNjbHVkZScpXG59XG5cbmV4cG9ydHMucGFyc2VycyA9IHtcbiAgcGF0aDogcmVxdWlyZSgnLi4vcGFyc2Vycy9wYXRoJyksXG4gIHRleHQ6IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGV4dCcpLFxuICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpLFxuICBkaXJlY3RpdmU6IHJlcXVpcmUoJy4uL3BhcnNlcnMvZGlyZWN0aXZlJyksXG4gIGV4cHJlc3Npb246IHJlcXVpcmUoJy4uL3BhcnNlcnMvZXhwcmVzc2lvbicpXG59XG5cbi8qKlxuICogRWFjaCBpbnN0YW5jZSBjb25zdHJ1Y3RvciwgaW5jbHVkaW5nIFZ1ZSwgaGFzIGEgdW5pcXVlXG4gKiBjaWQuIFRoaXMgZW5hYmxlcyB1cyB0byBjcmVhdGUgd3JhcHBlZCBcImNoaWxkXG4gKiBjb25zdHJ1Y3RvcnNcIiBmb3IgcHJvdG90eXBhbCBpbmhlcml0YW5jZSBhbmQgY2FjaGUgdGhlbS5cbiAqL1xuXG5leHBvcnRzLmNpZCA9IDBcbnZhciBjaWQgPSAxXG5cbi8qKlxuICogQ2xhc3MgaW5laHJpdGFuY2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZXh0ZW5kT3B0aW9uc1xuICovXG5cbmV4cG9ydHMuZXh0ZW5kID0gZnVuY3Rpb24gKGV4dGVuZE9wdGlvbnMpIHtcbiAgZXh0ZW5kT3B0aW9ucyA9IGV4dGVuZE9wdGlvbnMgfHwge31cbiAgdmFyIFN1cGVyID0gdGhpc1xuICB2YXIgU3ViID0gY3JlYXRlQ2xhc3MoXG4gICAgZXh0ZW5kT3B0aW9ucy5uYW1lIHx8XG4gICAgU3VwZXIub3B0aW9ucy5uYW1lIHx8XG4gICAgJ1Z1ZUNvbXBvbmVudCdcbiAgKVxuICBTdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdXBlci5wcm90b3R5cGUpXG4gIFN1Yi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTdWJcbiAgU3ViLmNpZCA9IGNpZCsrXG4gIFN1Yi5vcHRpb25zID0gbWVyZ2VPcHRpb25zKFxuICAgIFN1cGVyLm9wdGlvbnMsXG4gICAgZXh0ZW5kT3B0aW9uc1xuICApXG4gIFN1Ylsnc3VwZXInXSA9IFN1cGVyXG4gIC8vIGFsbG93IGZ1cnRoZXIgZXh0ZW5zaW9uXG4gIFN1Yi5leHRlbmQgPSBTdXBlci5leHRlbmRcbiAgLy8gY3JlYXRlIGFzc2V0IHJlZ2lzdGVycywgc28gZXh0ZW5kZWQgY2xhc3Nlc1xuICAvLyBjYW4gaGF2ZSB0aGVpciBwcml2YXRlIGFzc2V0cyB0b28uXG4gIGNyZWF0ZUFzc2V0UmVnaXN0ZXJzKFN1YilcbiAgcmV0dXJuIFN1YlxufVxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgc3ViLWNsYXNzIGNvbnN0cnVjdG9yIHdpdGggdGhlXG4gKiBnaXZlbiBuYW1lLiBUaGlzIGdpdmVzIHVzIG11Y2ggbmljZXIgb3V0cHV0IHdoZW5cbiAqIGxvZ2dpbmcgaW5zdGFuY2VzIGluIHRoZSBjb25zb2xlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVDbGFzcyAobmFtZSkge1xuICByZXR1cm4gbmV3IEZ1bmN0aW9uKFxuICAgICdyZXR1cm4gZnVuY3Rpb24gJyArIF8uY2xhc3NpZnkobmFtZSkgK1xuICAgICcgKG9wdGlvbnMpIHsgdGhpcy5faW5pdChvcHRpb25zKSB9J1xuICApKClcbn1cblxuLyoqXG4gKiBQbHVnaW4gc3lzdGVtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBsdWdpblxuICovXG5cbmV4cG9ydHMudXNlID0gZnVuY3Rpb24gKHBsdWdpbikge1xuICAvLyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcbiAgdmFyIGFyZ3MgPSBfLnRvQXJyYXkoYXJndW1lbnRzLCAxKVxuICBhcmdzLnVuc2hpZnQodGhpcylcbiAgaWYgKHR5cGVvZiBwbHVnaW4uaW5zdGFsbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHBsdWdpbi5pbnN0YWxsLmFwcGx5KHBsdWdpbiwgYXJncylcbiAgfSBlbHNlIHtcbiAgICBwbHVnaW4uYXBwbHkobnVsbCwgYXJncylcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIERlZmluZSBhc3NldCByZWdpc3RyYXRpb24gbWV0aG9kcyBvbiBhIGNvbnN0cnVjdG9yLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IENvbnN0cnVjdG9yXG4gKi9cblxudmFyIGFzc2V0VHlwZXMgPSBbXG4gICdkaXJlY3RpdmUnLFxuICAnZmlsdGVyJyxcbiAgJ3BhcnRpYWwnLFxuICAndHJhbnNpdGlvbidcbl1cblxuZnVuY3Rpb24gY3JlYXRlQXNzZXRSZWdpc3RlcnMgKENvbnN0cnVjdG9yKSB7XG5cbiAgLyogQXNzZXQgcmVnaXN0cmF0aW9uIG1ldGhvZHMgc2hhcmUgdGhlIHNhbWUgc2lnbmF0dXJlOlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWRcbiAgICogQHBhcmFtIHsqfSBkZWZpbml0aW9uXG4gICAqL1xuXG4gIGFzc2V0VHlwZXMuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgIENvbnN0cnVjdG9yW3R5cGVdID0gZnVuY3Rpb24gKGlkLCBkZWZpbml0aW9uKSB7XG4gICAgICBpZiAoIWRlZmluaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc1t0eXBlICsgJ3MnXVtpZF1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9uc1t0eXBlICsgJ3MnXVtpZF0gPSBkZWZpbml0aW9uXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIC8qKlxuICAgKiBDb21wb25lbnQgcmVnaXN0cmF0aW9uIG5lZWRzIHRvIGF1dG9tYXRpY2FsbHkgaW52b2tlXG4gICAqIFZ1ZS5leHRlbmQgb24gb2JqZWN0IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkXG4gICAqIEBwYXJhbSB7T2JqZWN0fEZ1bmN0aW9ufSBkZWZpbml0aW9uXG4gICAqL1xuXG4gIENvbnN0cnVjdG9yLmNvbXBvbmVudCA9IGZ1bmN0aW9uIChpZCwgZGVmaW5pdGlvbikge1xuICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wb25lbnRzW2lkXVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KGRlZmluaXRpb24pKSB7XG4gICAgICAgIGRlZmluaXRpb24ubmFtZSA9IGlkXG4gICAgICAgIGRlZmluaXRpb24gPSBfLlZ1ZS5leHRlbmQoZGVmaW5pdGlvbilcbiAgICAgIH1cbiAgICAgIHRoaXMub3B0aW9ucy5jb21wb25lbnRzW2lkXSA9IGRlZmluaXRpb25cbiAgICB9XG4gIH1cbn1cblxuY3JlYXRlQXNzZXRSZWdpc3RlcnMoZXhwb3J0cykiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGNvbXBpbGUgPSByZXF1aXJlKCcuLi9jb21waWxlci9jb21waWxlJylcblxuLyoqXG4gKiBTZXQgaW5zdGFuY2UgdGFyZ2V0IGVsZW1lbnQgYW5kIGtpY2sgb2ZmIHRoZSBjb21waWxhdGlvblxuICogcHJvY2Vzcy4gVGhlIHBhc3NlZCBpbiBgZWxgIGNhbiBiZSBhIHNlbGVjdG9yIHN0cmluZywgYW5cbiAqIGV4aXN0aW5nIEVsZW1lbnQsIG9yIGEgRG9jdW1lbnRGcmFnbWVudCAoZm9yIGJsb2NrXG4gKiBpbnN0YW5jZXMpLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fHN0cmluZ30gZWxcbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLiRtb3VudCA9IGZ1bmN0aW9uIChlbCkge1xuICBpZiAodGhpcy5faXNDb21waWxlZCkge1xuICAgIF8ud2FybignJG1vdW50KCkgc2hvdWxkIGJlIGNhbGxlZCBvbmx5IG9uY2UuJylcbiAgICByZXR1cm5cbiAgfVxuICBpZiAoIWVsKSB7XG4gICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSBlbFxuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbClcbiAgICBpZiAoIWVsKSB7XG4gICAgICBfLndhcm4oJ0Nhbm5vdCBmaW5kIGVsZW1lbnQ6ICcgKyBzZWxlY3RvcilcbiAgICAgIHJldHVyblxuICAgIH1cbiAgfVxuICB0aGlzLl9jb21waWxlKGVsKVxuICB0aGlzLl9pc0NvbXBpbGVkID0gdHJ1ZVxuICB0aGlzLl9jYWxsSG9vaygnY29tcGlsZWQnKVxuICBpZiAoXy5pbkRvYyh0aGlzLiRlbCkpIHtcbiAgICB0aGlzLl9jYWxsSG9vaygnYXR0YWNoZWQnKVxuICAgIHRoaXMuX2luaXRET01Ib29rcygpXG4gICAgcmVhZHkuY2FsbCh0aGlzKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2luaXRET01Ib29rcygpXG4gICAgdGhpcy4kb25jZSgnaG9vazphdHRhY2hlZCcsIHJlYWR5KVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogTWFyayBhbiBpbnN0YW5jZSBhcyByZWFkeS5cbiAqL1xuXG5mdW5jdGlvbiByZWFkeSAoKSB7XG4gIHRoaXMuX2lzQXR0YWNoZWQgPSB0cnVlXG4gIHRoaXMuX2lzUmVhZHkgPSB0cnVlXG4gIHRoaXMuX2NhbGxIb29rKCdyZWFkeScpXG59XG5cbi8qKlxuICogVGVhcmRvd24gdGhlIGluc3RhbmNlLCBzaW1wbHkgZGVsZWdhdGUgdG8gdGhlIGludGVybmFsXG4gKiBfZGVzdHJveS5cbiAqL1xuXG5leHBvcnRzLiRkZXN0cm95ID0gZnVuY3Rpb24gKHJlbW92ZSwgZGVmZXJDbGVhbnVwKSB7XG4gIHRoaXMuX2Rlc3Ryb3kocmVtb3ZlLCBkZWZlckNsZWFudXApXG59XG5cbi8qKlxuICogUGFydGlhbGx5IGNvbXBpbGUgYSBwaWVjZSBvZiBET00gYW5kIHJldHVybiBhXG4gKiBkZWNvbXBpbGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9IGVsXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5leHBvcnRzLiRjb21waWxlID0gZnVuY3Rpb24gKGVsKSB7XG4gIHJldHVybiBjb21waWxlKGVsLCB0aGlzLiRvcHRpb25zLCB0cnVlKSh0aGlzLCBlbClcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgTUFYX1VQREFURV9DT1VOVCA9IDEwXG5cbi8vIHdlIGhhdmUgdHdvIHNlcGFyYXRlIHF1ZXVlczogb25lIGZvciBkaXJlY3RpdmUgdXBkYXRlc1xuLy8gYW5kIG9uZSBmb3IgdXNlciB3YXRjaGVyIHJlZ2lzdGVyZWQgdmlhICR3YXRjaCgpLlxuLy8gd2Ugd2FudCB0byBndWFyYW50ZWUgZGlyZWN0aXZlIHVwZGF0ZXMgdG8gYmUgY2FsbGVkXG4vLyBiZWZvcmUgdXNlciB3YXRjaGVycyBzbyB0aGF0IHdoZW4gdXNlciB3YXRjaGVycyBhcmVcbi8vIHRyaWdnZXJlZCwgdGhlIERPTSB3b3VsZCBoYXZlIGFscmVhZHkgYmVlbiBpbiB1cGRhdGVkXG4vLyBzdGF0ZS5cbnZhciBxdWV1ZSA9IFtdXG52YXIgdXNlclF1ZXVlID0gW11cbnZhciBoYXMgPSB7fVxudmFyIHdhaXRpbmcgPSBmYWxzZVxudmFyIGZsdXNoaW5nID0gZmFsc2VcblxuLyoqXG4gKiBSZXNldCB0aGUgYmF0Y2hlcidzIHN0YXRlLlxuICovXG5cbmZ1bmN0aW9uIHJlc2V0ICgpIHtcbiAgcXVldWUgPSBbXVxuICB1c2VyUXVldWUgPSBbXVxuICBoYXMgPSB7fVxuICB3YWl0aW5nID0gZmFsc2VcbiAgZmx1c2hpbmcgPSBmYWxzZVxufVxuXG4vKipcbiAqIEZsdXNoIGJvdGggcXVldWVzIGFuZCBydW4gdGhlIGpvYnMuXG4gKi9cblxuZnVuY3Rpb24gZmx1c2ggKCkge1xuICBmbHVzaGluZyA9IHRydWVcbiAgcnVuKHF1ZXVlKVxuICBydW4odXNlclF1ZXVlKVxuICByZXNldCgpXG59XG5cbi8qKlxuICogUnVuIHRoZSBqb2JzIGluIGEgc2luZ2xlIHF1ZXVlLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHF1ZXVlXG4gKi9cblxuZnVuY3Rpb24gcnVuIChxdWV1ZSkge1xuICAvLyBkbyBub3QgY2FjaGUgbGVuZ3RoIGJlY2F1c2UgbW9yZSBqb2JzIG1pZ2h0IGJlIHB1c2hlZFxuICAvLyBhcyB3ZSBydW4gZXhpc3Rpbmcgam9ic1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgcXVldWVbaV0ucnVuKClcbiAgfVxufVxuXG4vKipcbiAqIFB1c2ggYSBqb2IgaW50byB0aGUgam9iIHF1ZXVlLlxuICogSm9icyB3aXRoIGR1cGxpY2F0ZSBJRHMgd2lsbCBiZSBza2lwcGVkIHVubGVzcyBpdCdzXG4gKiBwdXNoZWQgd2hlbiB0aGUgcXVldWUgaXMgYmVpbmcgZmx1c2hlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gam9iXG4gKiAgIHByb3BlcnRpZXM6XG4gKiAgIC0ge1N0cmluZ3xOdW1iZXJ9IGlkXG4gKiAgIC0ge0Z1bmN0aW9ufSAgICAgIHJ1blxuICovXG5cbmV4cG9ydHMucHVzaCA9IGZ1bmN0aW9uIChqb2IpIHtcbiAgdmFyIGlkID0gam9iLmlkXG4gIGlmICghaWQgfHwgIWhhc1tpZF0gfHwgZmx1c2hpbmcpIHtcbiAgICBpZiAoIWhhc1tpZF0pIHtcbiAgICAgIGhhc1tpZF0gPSAxXG4gICAgfSBlbHNlIHtcbiAgICAgIGhhc1tpZF0rK1xuICAgICAgLy8gZGV0ZWN0IHBvc3NpYmxlIGluZmluaXRlIHVwZGF0ZSBsb29wc1xuICAgICAgaWYgKGhhc1tpZF0gPiBNQVhfVVBEQVRFX0NPVU5UKSB7XG4gICAgICAgIF8ud2FybihcbiAgICAgICAgICAnWW91IG1heSBoYXZlIGFuIGluZmluaXRlIHVwZGF0ZSBsb29wIGZvciB0aGUgJyArXG4gICAgICAgICAgJ3dhdGNoZXIgd2l0aCBleHByZXNzaW9uOiBcIicgKyBqb2IuZXhwcmVzc2lvbiArICdcIi4nXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICAgIC8vIEEgdXNlciB3YXRjaGVyIGNhbGxiYWNrIGNvdWxkIHRyaWdnZXIgYW5vdGhlclxuICAgIC8vIGRpcmVjdGl2ZSB1cGRhdGUgZHVyaW5nIHRoZSBmbHVzaGluZzsgYXQgdGhhdCB0aW1lXG4gICAgLy8gdGhlIGRpcmVjdGl2ZSBxdWV1ZSB3b3VsZCBhbHJlYWR5IGhhdmUgYmVlbiBydW4sIHNvXG4gICAgLy8gd2UgY2FsbCB0aGF0IHVwZGF0ZSBpbW1lZGlhdGVseSBhcyBpdCBpcyBwdXNoZWQuXG4gICAgaWYgKGZsdXNoaW5nICYmICFqb2IudXNlcikge1xuICAgICAgam9iLnJ1bigpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgOyhqb2IudXNlciA/IHVzZXJRdWV1ZSA6IHF1ZXVlKS5wdXNoKGpvYilcbiAgICBpZiAoIXdhaXRpbmcpIHtcbiAgICAgIHdhaXRpbmcgPSB0cnVlXG4gICAgICBfLm5leHRUaWNrKGZsdXNoKVxuICAgIH1cbiAgfVxufSIsIi8qKlxuICogQSBkb3VibHkgbGlua2VkIGxpc3QtYmFzZWQgTGVhc3QgUmVjZW50bHkgVXNlZCAoTFJVKVxuICogY2FjaGUuIFdpbGwga2VlcCBtb3N0IHJlY2VudGx5IHVzZWQgaXRlbXMgd2hpbGVcbiAqIGRpc2NhcmRpbmcgbGVhc3QgcmVjZW50bHkgdXNlZCBpdGVtcyB3aGVuIGl0cyBsaW1pdCBpc1xuICogcmVhY2hlZC4gVGhpcyBpcyBhIGJhcmUtYm9uZSB2ZXJzaW9uIG9mXG4gKiBSYXNtdXMgQW5kZXJzc29uJ3MganMtbHJ1OlxuICpcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL3JzbXMvanMtbHJ1XG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGxpbWl0XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBDYWNoZSAobGltaXQpIHtcbiAgdGhpcy5zaXplID0gMFxuICB0aGlzLmxpbWl0ID0gbGltaXRcbiAgdGhpcy5oZWFkID0gdGhpcy50YWlsID0gdW5kZWZpbmVkXG4gIHRoaXMuX2tleW1hcCA9IHt9XG59XG5cbnZhciBwID0gQ2FjaGUucHJvdG90eXBlXG5cbi8qKlxuICogUHV0IDx2YWx1ZT4gaW50byB0aGUgY2FjaGUgYXNzb2NpYXRlZCB3aXRoIDxrZXk+LlxuICogUmV0dXJucyB0aGUgZW50cnkgd2hpY2ggd2FzIHJlbW92ZWQgdG8gbWFrZSByb29tIGZvclxuICogdGhlIG5ldyBlbnRyeS4gT3RoZXJ3aXNlIHVuZGVmaW5lZCBpcyByZXR1cm5lZC5cbiAqIChpLmUuIGlmIHRoZXJlIHdhcyBlbm91Z2ggcm9vbSBhbHJlYWR5KS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtFbnRyeXx1bmRlZmluZWR9XG4gKi9cblxucC5wdXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB2YXIgZW50cnkgPSB7XG4gICAga2V5OmtleSxcbiAgICB2YWx1ZTp2YWx1ZVxuICB9XG4gIHRoaXMuX2tleW1hcFtrZXldID0gZW50cnlcbiAgaWYgKHRoaXMudGFpbCkge1xuICAgIHRoaXMudGFpbC5uZXdlciA9IGVudHJ5XG4gICAgZW50cnkub2xkZXIgPSB0aGlzLnRhaWxcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmhlYWQgPSBlbnRyeVxuICB9XG4gIHRoaXMudGFpbCA9IGVudHJ5XG4gIGlmICh0aGlzLnNpemUgPT09IHRoaXMubGltaXQpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlmdCgpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zaXplKytcbiAgfVxufVxuXG4vKipcbiAqIFB1cmdlIHRoZSBsZWFzdCByZWNlbnRseSB1c2VkIChvbGRlc3QpIGVudHJ5IGZyb20gdGhlXG4gKiBjYWNoZS4gUmV0dXJucyB0aGUgcmVtb3ZlZCBlbnRyeSBvciB1bmRlZmluZWQgaWYgdGhlXG4gKiBjYWNoZSB3YXMgZW1wdHkuXG4gKi9cblxucC5zaGlmdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVudHJ5ID0gdGhpcy5oZWFkXG4gIGlmIChlbnRyeSkge1xuICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXdlclxuICAgIHRoaXMuaGVhZC5vbGRlciA9IHVuZGVmaW5lZFxuICAgIGVudHJ5Lm5ld2VyID0gZW50cnkub2xkZXIgPSB1bmRlZmluZWRcbiAgICB0aGlzLl9rZXltYXBbZW50cnkua2V5XSA9IHVuZGVmaW5lZFxuICB9XG4gIHJldHVybiBlbnRyeVxufVxuXG4vKipcbiAqIEdldCBhbmQgcmVnaXN0ZXIgcmVjZW50IHVzZSBvZiA8a2V5Pi4gUmV0dXJucyB0aGUgdmFsdWVcbiAqIGFzc29jaWF0ZWQgd2l0aCA8a2V5PiBvciB1bmRlZmluZWQgaWYgbm90IGluIGNhY2hlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmV0dXJuRW50cnlcbiAqIEByZXR1cm4ge0VudHJ5fCp9XG4gKi9cblxucC5nZXQgPSBmdW5jdGlvbiAoa2V5LCByZXR1cm5FbnRyeSkge1xuICB2YXIgZW50cnkgPSB0aGlzLl9rZXltYXBba2V5XVxuICBpZiAoZW50cnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gIGlmIChlbnRyeSA9PT0gdGhpcy50YWlsKSB7XG4gICAgcmV0dXJuIHJldHVybkVudHJ5XG4gICAgICA/IGVudHJ5XG4gICAgICA6IGVudHJ5LnZhbHVlXG4gIH1cbiAgLy8gSEVBRC0tLS0tLS0tLS0tLS0tVEFJTFxuICAvLyAgIDwub2xkZXIgICAubmV3ZXI+XG4gIC8vICA8LS0tIGFkZCBkaXJlY3Rpb24gLS1cbiAgLy8gICBBICBCICBDICA8RD4gIEVcbiAgaWYgKGVudHJ5Lm5ld2VyKSB7XG4gICAgaWYgKGVudHJ5ID09PSB0aGlzLmhlYWQpIHtcbiAgICAgIHRoaXMuaGVhZCA9IGVudHJ5Lm5ld2VyXG4gICAgfVxuICAgIGVudHJ5Lm5ld2VyLm9sZGVyID0gZW50cnkub2xkZXIgLy8gQyA8LS0gRS5cbiAgfVxuICBpZiAoZW50cnkub2xkZXIpIHtcbiAgICBlbnRyeS5vbGRlci5uZXdlciA9IGVudHJ5Lm5ld2VyIC8vIEMuIC0tPiBFXG4gIH1cbiAgZW50cnkubmV3ZXIgPSB1bmRlZmluZWQgLy8gRCAtLXhcbiAgZW50cnkub2xkZXIgPSB0aGlzLnRhaWwgLy8gRC4gLS0+IEVcbiAgaWYgKHRoaXMudGFpbCkge1xuICAgIHRoaXMudGFpbC5uZXdlciA9IGVudHJ5IC8vIEUuIDwtLSBEXG4gIH1cbiAgdGhpcy50YWlsID0gZW50cnlcbiAgcmV0dXJuIHJldHVybkVudHJ5XG4gICAgPyBlbnRyeVxuICAgIDogZW50cnkudmFsdWVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDYWNoZSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbnZhciB0ZXh0UGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZXh0JylcbnZhciBkaXJQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL2RpcmVjdGl2ZScpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcblxuLyoqXG4gKiBDb21waWxlIGEgdGVtcGxhdGUgYW5kIHJldHVybiBhIHJldXNhYmxlIGNvbXBvc2l0ZSBsaW5rXG4gKiBmdW5jdGlvbiwgd2hpY2ggcmVjdXJzaXZlbHkgY29udGFpbnMgbW9yZSBsaW5rIGZ1bmN0aW9uc1xuICogaW5zaWRlLiBUaGlzIHRvcCBsZXZlbCBjb21waWxlIGZ1bmN0aW9uIHNob3VsZCBvbmx5IGJlXG4gKiBjYWxsZWQgb24gaW5zdGFuY2Ugcm9vdCBub2Rlcy5cbiAqXG4gKiBXaGVuIHRoZSBgYXNQYXJlbnRgIGZsYWcgaXMgdHJ1ZSwgdGhpcyBtZWFucyB3ZSBhcmUgZG9pbmdcbiAqIGEgcGFydGlhbCBjb21waWxlIGZvciBhIGNvbXBvbmVudCdzIHBhcmVudCBzY29wZSBtYXJrdXBcbiAqIChTZWUgIzUwMikuIFRoaXMgY291bGQgKipvbmx5KiogYmUgdHJpZ2dlcmVkIGR1cmluZ1xuICogY29tcGlsYXRpb24gb2YgYHYtY29tcG9uZW50YCwgYW5kIHdlIG5lZWQgdG8gc2tpcCB2LXdpdGgsXG4gKiB2LXJlZiAmIHYtY29tcG9uZW50IGluIHRoaXMgc2l0dWF0aW9uLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcGFydGlhbFxuICogQHBhcmFtIHtCb29sZWFufSBhc1BhcmVudCAtIGNvbXBpbGluZyBhIGNvbXBvbmVudFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lciBhcyBpdHMgcGFyZW50LlxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21waWxlIChlbCwgb3B0aW9ucywgcGFydGlhbCwgYXNQYXJlbnQpIHtcbiAgdmFyIGlzQmxvY2sgPSBlbC5ub2RlVHlwZSA9PT0gMTFcbiAgdmFyIHBhcmFtcyA9ICFwYXJ0aWFsICYmIG9wdGlvbnMucGFyYW1BdHRyaWJ1dGVzXG4gIC8vIGlmIGVsIGlzIGEgZnJhZ21lbnQsIHRoaXMgaXMgYSBibG9jayBpbnN0YW5jZVxuICAvLyBhbmQgcGFyYW1BdHRyaWJ1dGVzIHdpbGwgYmUgc3RvcmVkIG9uIHRoZSBmaXJzdFxuICAvLyBlbGVtZW50IGluIHRoZSB0ZW1wbGF0ZS4gKGV4Y2x1ZGluZyB0aGUgX2Jsb2NrU3RhcnRcbiAgLy8gY29tbWVudCBub2RlKVxuICB2YXIgcGFyYW1zRWwgPSBpc0Jsb2NrID8gZWwuY2hpbGROb2Rlc1sxXSA6IGVsXG4gIHZhciBwYXJhbXNMaW5rRm4gPSBwYXJhbXNcbiAgICA/IGNvbXBpbGVQYXJhbUF0dHJpYnV0ZXMocGFyYW1zRWwsIHBhcmFtcywgb3B0aW9ucylcbiAgICA6IG51bGxcbiAgdmFyIG5vZGVMaW5rRm4gPSBpc0Jsb2NrXG4gICAgPyBudWxsXG4gICAgOiBjb21waWxlTm9kZShlbCwgb3B0aW9ucywgYXNQYXJlbnQpXG4gIHZhciBjaGlsZExpbmtGbiA9XG4gICAgIShub2RlTGlua0ZuICYmIG5vZGVMaW5rRm4udGVybWluYWwpICYmXG4gICAgZWwudGFnTmFtZSAhPT0gJ1NDUklQVCcgJiZcbiAgICBlbC5oYXNDaGlsZE5vZGVzKClcbiAgICAgID8gY29tcGlsZU5vZGVMaXN0KGVsLmNoaWxkTm9kZXMsIG9wdGlvbnMpXG4gICAgICA6IG51bGxcblxuICAvKipcbiAgICogQSBsaW5rZXIgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGEgYWxyZWFkeSBjb21waWxlZFxuICAgKiBwaWVjZSBvZiBET00sIHdoaWNoIGluc3RhbnRpYXRlcyBhbGwgZGlyZWN0aXZlXG4gICAqIGluc3RhbmNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHZtXG4gICAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gICAqL1xuXG4gIHJldHVybiBmdW5jdGlvbiBsaW5rICh2bSwgZWwpIHtcbiAgICB2YXIgb3JpZ2luYWxEaXJDb3VudCA9IHZtLl9kaXJlY3RpdmVzLmxlbmd0aFxuICAgIGlmIChwYXJhbXNMaW5rRm4pIHtcbiAgICAgIHZhciBwYXJhbXNFbCA9IGlzQmxvY2sgPyBlbC5jaGlsZE5vZGVzWzFdIDogZWxcbiAgICAgIHBhcmFtc0xpbmtGbih2bSwgcGFyYW1zRWwpXG4gICAgfVxuICAgIC8vIGNhY2hlIGNoaWxkTm9kZXMgYmVmb3JlIGxpbmtpbmcgcGFyZW50LCBmaXggIzY1N1xuICAgIHZhciBjaGlsZE5vZGVzID0gXy50b0FycmF5KGVsLmNoaWxkTm9kZXMpXG4gICAgaWYgKG5vZGVMaW5rRm4pIG5vZGVMaW5rRm4odm0sIGVsKVxuICAgIGlmIChjaGlsZExpbmtGbikgY2hpbGRMaW5rRm4odm0sIGNoaWxkTm9kZXMpXG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGlzIGlzIGEgcGFydGlhbCBjb21waWxlLCB0aGUgbGlua2VyIGZ1bmN0aW9uXG4gICAgICogcmV0dXJucyBhbiB1bmxpbmsgZnVuY3Rpb24gdGhhdCB0ZWFyc2Rvd24gYWxsXG4gICAgICogZGlyZWN0aXZlcyBpbnN0YW5jZXMgZ2VuZXJhdGVkIGR1cmluZyB0aGUgcGFydGlhbFxuICAgICAqIGxpbmtpbmcuXG4gICAgICovXG5cbiAgICBpZiAocGFydGlhbCkge1xuICAgICAgdmFyIGRpcnMgPSB2bS5fZGlyZWN0aXZlcy5zbGljZShvcmlnaW5hbERpckNvdW50KVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHVubGluayAoKSB7XG4gICAgICAgIHZhciBpID0gZGlycy5sZW5ndGhcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgIGRpcnNbaV0uX3RlYXJkb3duKClcbiAgICAgICAgfVxuICAgICAgICBpID0gdm0uX2RpcmVjdGl2ZXMuaW5kZXhPZihkaXJzWzBdKVxuICAgICAgICB2bS5fZGlyZWN0aXZlcy5zcGxpY2UoaSwgZGlycy5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIG5vZGUgYW5kIHJldHVybiBhIG5vZGVMaW5rRm4gYmFzZWQgb24gdGhlXG4gKiBub2RlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSBhc1BhcmVudFxuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVOb2RlIChub2RlLCBvcHRpb25zLCBhc1BhcmVudCkge1xuICB2YXIgdHlwZSA9IG5vZGUubm9kZVR5cGVcbiAgaWYgKHR5cGUgPT09IDEgJiYgbm9kZS50YWdOYW1lICE9PSAnU0NSSVBUJykge1xuICAgIHJldHVybiBjb21waWxlRWxlbWVudChub2RlLCBvcHRpb25zLCBhc1BhcmVudClcbiAgfSBlbHNlIGlmICh0eXBlID09PSAzICYmIGNvbmZpZy5pbnRlcnBvbGF0ZSkge1xuICAgIHJldHVybiBjb21waWxlVGV4dE5vZGUobm9kZSwgb3B0aW9ucylcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYW4gZWxlbWVudCBhbmQgcmV0dXJuIGEgbm9kZUxpbmtGbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtCb29sZWFufSBhc1BhcmVudFxuICogQHJldHVybiB7RnVuY3Rpb258bnVsbH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlRWxlbWVudCAoZWwsIG9wdGlvbnMsIGFzUGFyZW50KSB7XG4gIHZhciBsaW5rRm4sIHRhZywgY29tcG9uZW50XG4gIC8vIGNoZWNrIGN1c3RvbSBlbGVtZW50IGNvbXBvbmVudCwgYnV0IG9ubHkgb24gbm9uLXJvb3RcbiAgaWYgKCFhc1BhcmVudCAmJiAhZWwuX192dWVfXykge1xuICAgIHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgIGNvbXBvbmVudCA9XG4gICAgICB0YWcuaW5kZXhPZignLScpID4gMCAmJlxuICAgICAgb3B0aW9ucy5jb21wb25lbnRzW3RhZ11cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoY29uZmlnLnByZWZpeCArICdjb21wb25lbnQnLCB0YWcpXG4gICAgfVxuICB9XG4gIGlmIChjb21wb25lbnQgfHwgZWwuaGFzQXR0cmlidXRlcygpKSB7XG4gICAgLy8gY2hlY2sgdGVybWluYWwgZGlyZWNpdHZlc1xuICAgIGlmICghYXNQYXJlbnQpIHtcbiAgICAgIGxpbmtGbiA9IGNoZWNrVGVybWluYWxEaXJlY3RpdmVzKGVsLCBvcHRpb25zKVxuICAgIH1cbiAgICAvLyBpZiBub3QgdGVybWluYWwsIGJ1aWxkIG5vcm1hbCBsaW5rIGZ1bmN0aW9uXG4gICAgaWYgKCFsaW5rRm4pIHtcbiAgICAgIHZhciBkaXJzID0gY29sbGVjdERpcmVjdGl2ZXMoZWwsIG9wdGlvbnMsIGFzUGFyZW50KVxuICAgICAgbGlua0ZuID0gZGlycy5sZW5ndGhcbiAgICAgICAgPyBtYWtlRGlyZWN0aXZlc0xpbmtGbihkaXJzKVxuICAgICAgICA6IG51bGxcbiAgICB9XG4gIH1cbiAgLy8gaWYgdGhlIGVsZW1lbnQgaXMgYSB0ZXh0YXJlYSwgd2UgbmVlZCB0byBpbnRlcnBvbGF0ZVxuICAvLyBpdHMgY29udGVudCBvbiBpbml0aWFsIHJlbmRlci5cbiAgaWYgKGVsLnRhZ05hbWUgPT09ICdURVhUQVJFQScpIHtcbiAgICB2YXIgcmVhbExpbmtGbiA9IGxpbmtGblxuICAgIGxpbmtGbiA9IGZ1bmN0aW9uICh2bSwgZWwpIHtcbiAgICAgIGVsLnZhbHVlID0gdm0uJGludGVycG9sYXRlKGVsLnZhbHVlKVxuICAgICAgaWYgKHJlYWxMaW5rRm4pIHJlYWxMaW5rRm4odm0sIGVsKVxuICAgIH1cbiAgICBsaW5rRm4udGVybWluYWwgPSB0cnVlXG4gIH1cbiAgcmV0dXJuIGxpbmtGblxufVxuXG4vKipcbiAqIEJ1aWxkIGEgbXVsdGktZGlyZWN0aXZlIGxpbmsgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtBcnJheX0gZGlyZWN0aXZlc1xuICogQHJldHVybiB7RnVuY3Rpb259IGRpcmVjdGl2ZXNMaW5rRm5cbiAqL1xuXG5mdW5jdGlvbiBtYWtlRGlyZWN0aXZlc0xpbmtGbiAoZGlyZWN0aXZlcykge1xuICByZXR1cm4gZnVuY3Rpb24gZGlyZWN0aXZlc0xpbmtGbiAodm0sIGVsKSB7XG4gICAgLy8gcmV2ZXJzZSBhcHBseSBiZWNhdXNlIGl0J3Mgc29ydGVkIGxvdyB0byBoaWdoXG4gICAgdmFyIGkgPSBkaXJlY3RpdmVzLmxlbmd0aFxuICAgIHZhciBkaXIsIGosIGtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBkaXIgPSBkaXJlY3RpdmVzW2ldXG4gICAgICBpZiAoZGlyLl9saW5rKSB7XG4gICAgICAgIC8vIGN1c3RvbSBsaW5rIGZuXG4gICAgICAgIGRpci5fbGluayh2bSwgZWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBrID0gZGlyLmRlc2NyaXB0b3JzLmxlbmd0aFxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgazsgaisrKSB7XG4gICAgICAgICAgdm0uX2JpbmREaXIoZGlyLm5hbWUsIGVsLFxuICAgICAgICAgICAgICAgICAgICAgIGRpci5kZXNjcmlwdG9yc1tqXSwgZGlyLmRlZilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYSB0ZXh0Tm9kZSBhbmQgcmV0dXJuIGEgbm9kZUxpbmtGbi5cbiAqXG4gKiBAcGFyYW0ge1RleHROb2RlfSBub2RlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258bnVsbH0gdGV4dE5vZGVMaW5rRm5cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlVGV4dE5vZGUgKG5vZGUsIG9wdGlvbnMpIHtcbiAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2Uobm9kZS5ub2RlVmFsdWUpXG4gIGlmICghdG9rZW5zKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICB2YXIgZWwsIHRva2VuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHRva2VuID0gdG9rZW5zW2ldXG4gICAgZWwgPSB0b2tlbi50YWdcbiAgICAgID8gcHJvY2Vzc1RleHRUb2tlbih0b2tlbiwgb3B0aW9ucylcbiAgICAgIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9rZW4udmFsdWUpXG4gICAgZnJhZy5hcHBlbmRDaGlsZChlbClcbiAgfVxuICByZXR1cm4gbWFrZVRleHROb2RlTGlua0ZuKHRva2VucywgZnJhZywgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBQcm9jZXNzIGEgc2luZ2xlIHRleHQgdG9rZW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRva2VuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuXG5mdW5jdGlvbiBwcm9jZXNzVGV4dFRva2VuICh0b2tlbiwgb3B0aW9ucykge1xuICB2YXIgZWxcbiAgaWYgKHRva2VuLm9uZVRpbWUpIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRva2VuLnZhbHVlKVxuICB9IGVsc2Uge1xuICAgIGlmICh0b2tlbi5odG1sKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtaHRtbCcpXG4gICAgICBzZXRUb2tlblR5cGUoJ2h0bWwnKVxuICAgIH0gZWxzZSBpZiAodG9rZW4ucGFydGlhbCkge1xuICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXBhcnRpYWwnKVxuICAgICAgc2V0VG9rZW5UeXBlKCdwYXJ0aWFsJylcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSUUgd2lsbCBjbGVhbiB1cCBlbXB0eSB0ZXh0Tm9kZXMgZHVyaW5nXG4gICAgICAvLyBmcmFnLmNsb25lTm9kZSh0cnVlKSwgc28gd2UgaGF2ZSB0byBnaXZlIGl0XG4gICAgICAvLyBzb21ldGhpbmcgaGVyZS4uLlxuICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnICcpXG4gICAgICBzZXRUb2tlblR5cGUoJ3RleHQnKVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzZXRUb2tlblR5cGUgKHR5cGUpIHtcbiAgICB0b2tlbi50eXBlID0gdHlwZVxuICAgIHRva2VuLmRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1t0eXBlXVxuICAgIHRva2VuLmRlc2NyaXB0b3IgPSBkaXJQYXJzZXIucGFyc2UodG9rZW4udmFsdWUpWzBdXG4gIH1cbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogQnVpbGQgYSBmdW5jdGlvbiB0aGF0IHByb2Nlc3NlcyBhIHRleHROb2RlLlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gdG9rZW5zXG4gKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IGZyYWdcbiAqL1xuXG5mdW5jdGlvbiBtYWtlVGV4dE5vZGVMaW5rRm4gKHRva2VucywgZnJhZykge1xuICByZXR1cm4gZnVuY3Rpb24gdGV4dE5vZGVMaW5rRm4gKHZtLCBlbCkge1xuICAgIHZhciBmcmFnQ2xvbmUgPSBmcmFnLmNsb25lTm9kZSh0cnVlKVxuICAgIHZhciBjaGlsZE5vZGVzID0gXy50b0FycmF5KGZyYWdDbG9uZS5jaGlsZE5vZGVzKVxuICAgIHZhciB0b2tlbiwgdmFsdWUsIG5vZGVcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHRva2Vucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldXG4gICAgICB2YWx1ZSA9IHRva2VuLnZhbHVlXG4gICAgICBpZiAodG9rZW4udGFnKSB7XG4gICAgICAgIG5vZGUgPSBjaGlsZE5vZGVzW2ldXG4gICAgICAgIGlmICh0b2tlbi5vbmVUaW1lKSB7XG4gICAgICAgICAgdmFsdWUgPSB2bS4kZXZhbCh2YWx1ZSlcbiAgICAgICAgICBpZiAodG9rZW4uaHRtbCkge1xuICAgICAgICAgICAgXy5yZXBsYWNlKG5vZGUsIHRlbXBsYXRlUGFyc2VyLnBhcnNlKHZhbHVlLCB0cnVlKSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSB2YWx1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2bS5fYmluZERpcih0b2tlbi50eXBlLCBub2RlLFxuICAgICAgICAgICAgICAgICAgICAgIHRva2VuLmRlc2NyaXB0b3IsIHRva2VuLmRlZilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBfLnJlcGxhY2UoZWwsIGZyYWdDbG9uZSlcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYSBub2RlIGxpc3QgYW5kIHJldHVybiBhIGNoaWxkTGlua0ZuLlxuICpcbiAqIEBwYXJhbSB7Tm9kZUxpc3R9IG5vZGVMaXN0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVOb2RlTGlzdCAobm9kZUxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGxpbmtGbnMgPSBbXVxuICB2YXIgbm9kZUxpbmtGbiwgY2hpbGRMaW5rRm4sIG5vZGVcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2RlTGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBub2RlID0gbm9kZUxpc3RbaV1cbiAgICBub2RlTGlua0ZuID0gY29tcGlsZU5vZGUobm9kZSwgb3B0aW9ucylcbiAgICBjaGlsZExpbmtGbiA9XG4gICAgICAhKG5vZGVMaW5rRm4gJiYgbm9kZUxpbmtGbi50ZXJtaW5hbCkgJiZcbiAgICAgIG5vZGUudGFnTmFtZSAhPT0gJ1NDUklQVCcgJiZcbiAgICAgIG5vZGUuaGFzQ2hpbGROb2RlcygpXG4gICAgICAgID8gY29tcGlsZU5vZGVMaXN0KG5vZGUuY2hpbGROb2Rlcywgb3B0aW9ucylcbiAgICAgICAgOiBudWxsXG4gICAgbGlua0Zucy5wdXNoKG5vZGVMaW5rRm4sIGNoaWxkTGlua0ZuKVxuICB9XG4gIHJldHVybiBsaW5rRm5zLmxlbmd0aFxuICAgID8gbWFrZUNoaWxkTGlua0ZuKGxpbmtGbnMpXG4gICAgOiBudWxsXG59XG5cbi8qKlxuICogTWFrZSBhIGNoaWxkIGxpbmsgZnVuY3Rpb24gZm9yIGEgbm9kZSdzIGNoaWxkTm9kZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheTxGdW5jdGlvbj59IGxpbmtGbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBjaGlsZExpbmtGblxuICovXG5cbmZ1bmN0aW9uIG1ha2VDaGlsZExpbmtGbiAobGlua0Zucykge1xuICByZXR1cm4gZnVuY3Rpb24gY2hpbGRMaW5rRm4gKHZtLCBub2Rlcykge1xuICAgIHZhciBub2RlLCBub2RlTGlua0ZuLCBjaGlsZHJlbkxpbmtGblxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gMCwgbCA9IGxpbmtGbnMubGVuZ3RoOyBpIDwgbDsgbisrKSB7XG4gICAgICBub2RlID0gbm9kZXNbbl1cbiAgICAgIG5vZGVMaW5rRm4gPSBsaW5rRm5zW2krK11cbiAgICAgIGNoaWxkcmVuTGlua0ZuID0gbGlua0Zuc1tpKytdXG4gICAgICAvLyBjYWNoZSBjaGlsZE5vZGVzIGJlZm9yZSBsaW5raW5nIHBhcmVudCwgZml4ICM2NTdcbiAgICAgIHZhciBjaGlsZE5vZGVzID0gXy50b0FycmF5KG5vZGUuY2hpbGROb2RlcylcbiAgICAgIGlmIChub2RlTGlua0ZuKSB7XG4gICAgICAgIG5vZGVMaW5rRm4odm0sIG5vZGUpXG4gICAgICB9XG4gICAgICBpZiAoY2hpbGRyZW5MaW5rRm4pIHtcbiAgICAgICAgY2hpbGRyZW5MaW5rRm4odm0sIGNoaWxkTm9kZXMpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBwYXJhbSBhdHRyaWJ1dGVzIG9uIGEgcm9vdCBlbGVtZW50IGFuZCByZXR1cm5cbiAqIGEgcGFyYW1BdHRyaWJ1dGVzIGxpbmsgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtBcnJheX0gYXR0cnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gcGFyYW1zTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZVBhcmFtQXR0cmlidXRlcyAoZWwsIGF0dHJzLCBvcHRpb25zKSB7XG4gIHZhciBwYXJhbXMgPSBbXVxuICB2YXIgaSA9IGF0dHJzLmxlbmd0aFxuICB2YXIgbmFtZSwgdmFsdWUsIHBhcmFtXG4gIHdoaWxlIChpLS0pIHtcbiAgICBuYW1lID0gYXR0cnNbaV1cbiAgICBpZiAoL1tBLVpdLy50ZXN0KG5hbWUpKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdZb3Ugc2VlbSB0byBiZSB1c2luZyBjYW1lbENhc2UgZm9yIGEgcGFyYW1BdHRyaWJ1dGUsICcgK1xuICAgICAgICAnYnV0IEhUTUwgZG9lc25cXCd0IGRpZmZlcmVudGlhdGUgYmV0d2VlbiB1cHBlciBhbmQgJyArXG4gICAgICAgICdsb3dlciBjYXNlLiBZb3Ugc2hvdWxkIHVzZSBoeXBoZW4tZGVsaW1pdGVkICcgK1xuICAgICAgICAnYXR0cmlidXRlIG5hbWVzLiBGb3IgbW9yZSBpbmZvIHNlZSAnICtcbiAgICAgICAgJ2h0dHA6Ly92dWVqcy5vcmcvYXBpL29wdGlvbnMuaHRtbCNwYXJhbUF0dHJpYnV0ZXMnXG4gICAgICApXG4gICAgfVxuICAgIHZhbHVlID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpXG4gICAgaWYgKHZhbHVlICE9PSBudWxsKSB7XG4gICAgICBwYXJhbSA9IHtcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9XG4gICAgICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZSh2YWx1ZSlcbiAgICAgIGlmICh0b2tlbnMpIHtcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gICAgICAgIGlmICh0b2tlbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIF8ud2FybihcbiAgICAgICAgICAgICdJbnZhbGlkIHBhcmFtIGF0dHJpYnV0ZSBiaW5kaW5nOiBcIicgK1xuICAgICAgICAgICAgbmFtZSArICc9XCInICsgdmFsdWUgKyAnXCInICtcbiAgICAgICAgICAgICdcXG5Eb25cXCd0IG1peCBiaW5kaW5nIHRhZ3Mgd2l0aCBwbGFpbiB0ZXh0ICcgK1xuICAgICAgICAgICAgJ2luIHBhcmFtIGF0dHJpYnV0ZSBiaW5kaW5ncy4nXG4gICAgICAgICAgKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyYW0uZHluYW1pYyA9IHRydWVcbiAgICAgICAgICBwYXJhbS52YWx1ZSA9IHRva2Vuc1swXS52YWx1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwYXJhbXMucHVzaChwYXJhbSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1ha2VQYXJhbXNMaW5rRm4ocGFyYW1zLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIEJ1aWxkIGEgZnVuY3Rpb24gdGhhdCBhcHBsaWVzIHBhcmFtIGF0dHJpYnV0ZXMgdG8gYSB2bS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYXJhbXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gcGFyYW1zTGlua0ZuXG4gKi9cblxudmFyIGRhdGFBdHRyUkUgPSAvXmRhdGEtL1xuXG5mdW5jdGlvbiBtYWtlUGFyYW1zTGlua0ZuIChwYXJhbXMsIG9wdGlvbnMpIHtcbiAgdmFyIGRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1snd2l0aCddXG4gIHJldHVybiBmdW5jdGlvbiBwYXJhbXNMaW5rRm4gKHZtLCBlbCkge1xuICAgIHZhciBpID0gcGFyYW1zLmxlbmd0aFxuICAgIHZhciBwYXJhbSwgcGF0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHBhcmFtID0gcGFyYW1zW2ldXG4gICAgICAvLyBwYXJhbXMgY291bGQgY29udGFpbiBkYXNoZXMsIHdoaWNoIHdpbGwgYmVcbiAgICAgIC8vIGludGVycHJldGVkIGFzIG1pbnVzIGNhbGN1bGF0aW9ucyBieSB0aGUgcGFyc2VyXG4gICAgICAvLyBzbyB3ZSBuZWVkIHRvIHdyYXAgdGhlIHBhdGggaGVyZVxuICAgICAgcGF0aCA9IF8uY2FtZWxpemUocGFyYW0ubmFtZS5yZXBsYWNlKGRhdGFBdHRyUkUsICcnKSlcbiAgICAgIGlmIChwYXJhbS5keW5hbWljKSB7XG4gICAgICAgIC8vIGR5bmFtaWMgcGFyYW0gYXR0cmlidHVlcyBhcmUgYm91bmQgYXMgdi13aXRoLlxuICAgICAgICAvLyB3ZSBjYW4gZGlyZWN0bHkgZHVjayB0aGUgZGVzY3JpcHRvciBoZXJlIGJlYWN1c2VcbiAgICAgICAgLy8gcGFyYW0gYXR0cmlidXRlcyBjYW5ub3QgdXNlIGV4cHJlc3Npb25zIG9yXG4gICAgICAgIC8vIGZpbHRlcnMuXG4gICAgICAgIHZtLl9iaW5kRGlyKCd3aXRoJywgZWwsIHtcbiAgICAgICAgICBhcmc6IHBhdGgsXG4gICAgICAgICAgZXhwcmVzc2lvbjogcGFyYW0udmFsdWVcbiAgICAgICAgfSwgZGVmKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8ganVzdCBzZXQgb25jZVxuICAgICAgICB2bS4kc2V0KHBhdGgsIHBhcmFtLnZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGFuIGVsZW1lbnQgZm9yIHRlcm1pbmFsIGRpcmVjdGl2ZXMgaW4gZml4ZWQgb3JkZXIuXG4gKiBJZiBpdCBmaW5kcyBvbmUsIHJldHVybiBhIHRlcm1pbmFsIGxpbmsgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0ZXJtaW5hbExpbmtGblxuICovXG5cbnZhciB0ZXJtaW5hbERpcmVjdGl2ZXMgPSBbXG4gICdyZXBlYXQnLFxuICAnaWYnLFxuICAnY29tcG9uZW50J1xuXVxuXG5mdW5jdGlvbiBza2lwICgpIHt9XG5za2lwLnRlcm1pbmFsID0gdHJ1ZVxuXG5mdW5jdGlvbiBjaGVja1Rlcm1pbmFsRGlyZWN0aXZlcyAoZWwsIG9wdGlvbnMpIHtcbiAgaWYgKF8uYXR0cihlbCwgJ3ByZScpICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHNraXBcbiAgfVxuICB2YXIgdmFsdWUsIGRpck5hbWVcbiAgLyoganNoaW50IGJvc3M6IHRydWUgKi9cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBkaXJOYW1lID0gdGVybWluYWxEaXJlY3RpdmVzW2ldXG4gICAgaWYgKHZhbHVlID0gXy5hdHRyKGVsLCBkaXJOYW1lKSkge1xuICAgICAgcmV0dXJuIG1ha2VUZXJpbWluYWxMaW5rRm4oZWwsIGRpck5hbWUsIHZhbHVlLCBvcHRpb25zKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJ1aWxkIGEgbGluayBmdW5jdGlvbiBmb3IgYSB0ZXJtaW5hbCBkaXJlY3RpdmUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IGRpck5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0ZXJtaW5hbExpbmtGblxuICovXG5cbmZ1bmN0aW9uIG1ha2VUZXJpbWluYWxMaW5rRm4gKGVsLCBkaXJOYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgZGVzY3JpcHRvciA9IGRpclBhcnNlci5wYXJzZSh2YWx1ZSlbMF1cbiAgdmFyIGRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1tkaXJOYW1lXVxuICB2YXIgdGVybWluYWxMaW5rRm4gPSBmdW5jdGlvbiAodm0sIGVsKSB7XG4gICAgdm0uX2JpbmREaXIoZGlyTmFtZSwgZWwsIGRlc2NyaXB0b3IsIGRlZilcbiAgfVxuICB0ZXJtaW5hbExpbmtGbi50ZXJtaW5hbCA9IHRydWVcbiAgcmV0dXJuIHRlcm1pbmFsTGlua0ZuXG59XG5cbi8qKlxuICogQ29sbGVjdCB0aGUgZGlyZWN0aXZlcyBvbiBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFzUGFyZW50XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBjb2xsZWN0RGlyZWN0aXZlcyAoZWwsIG9wdGlvbnMsIGFzUGFyZW50KSB7XG4gIHZhciBhdHRycyA9IF8udG9BcnJheShlbC5hdHRyaWJ1dGVzKVxuICB2YXIgaSA9IGF0dHJzLmxlbmd0aFxuICB2YXIgZGlycyA9IFtdXG4gIHZhciBhdHRyLCBhdHRyTmFtZSwgZGlyLCBkaXJOYW1lLCBkaXJEZWZcbiAgd2hpbGUgKGktLSkge1xuICAgIGF0dHIgPSBhdHRyc1tpXVxuICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lXG4gICAgaWYgKGF0dHJOYW1lLmluZGV4T2YoY29uZmlnLnByZWZpeCkgPT09IDApIHtcbiAgICAgIGRpck5hbWUgPSBhdHRyTmFtZS5zbGljZShjb25maWcucHJlZml4Lmxlbmd0aClcbiAgICAgIGlmIChhc1BhcmVudCAmJlxuICAgICAgICAgIChkaXJOYW1lID09PSAnd2l0aCcgfHxcbiAgICAgICAgICAgZGlyTmFtZSA9PT0gJ2NvbXBvbmVudCcpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBkaXJEZWYgPSBvcHRpb25zLmRpcmVjdGl2ZXNbZGlyTmFtZV1cbiAgICAgIF8uYXNzZXJ0QXNzZXQoZGlyRGVmLCAnZGlyZWN0aXZlJywgZGlyTmFtZSlcbiAgICAgIGlmIChkaXJEZWYpIHtcbiAgICAgICAgZGlycy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBkaXJOYW1lLFxuICAgICAgICAgIGRlc2NyaXB0b3JzOiBkaXJQYXJzZXIucGFyc2UoYXR0ci52YWx1ZSksXG4gICAgICAgICAgZGVmOiBkaXJEZWZcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5pbnRlcnBvbGF0ZSkge1xuICAgICAgZGlyID0gY29sbGVjdEF0dHJEaXJlY3RpdmUoZWwsIGF0dHJOYW1lLCBhdHRyLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucylcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgZGlycy5wdXNoKGRpcilcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gc29ydCBieSBwcmlvcml0eSwgTE9XIHRvIEhJR0hcbiAgZGlycy5zb3J0KGRpcmVjdGl2ZUNvbXBhcmF0b3IpXG4gIHJldHVybiBkaXJzXG59XG5cbi8qKlxuICogQ2hlY2sgYW4gYXR0cmlidXRlIGZvciBwb3RlbnRpYWwgZHluYW1pYyBiaW5kaW5ncyxcbiAqIGFuZCByZXR1cm4gYSBkaXJlY3RpdmUgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gY29sbGVjdEF0dHJEaXJlY3RpdmUgKGVsLCBuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5fc2tpcEF0dHJzICYmXG4gICAgICBvcHRpb25zLl9za2lwQXR0cnMuaW5kZXhPZihuYW1lKSA+IC0xKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UodmFsdWUpXG4gIGlmICh0b2tlbnMpIHtcbiAgICB2YXIgZGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzLmF0dHJcbiAgICB2YXIgaSA9IHRva2Vucy5sZW5ndGhcbiAgICB2YXIgYWxsT25lVGltZSA9IHRydWVcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB2YXIgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICAgIGlmICh0b2tlbi50YWcgJiYgIXRva2VuLm9uZVRpbWUpIHtcbiAgICAgICAgYWxsT25lVGltZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBkZWY6IGRlZixcbiAgICAgIF9saW5rOiBhbGxPbmVUaW1lXG4gICAgICAgID8gZnVuY3Rpb24gKHZtLCBlbCkge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKG5hbWUsIHZtLiRpbnRlcnBvbGF0ZSh2YWx1ZSkpXG4gICAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uICh2bSwgZWwpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRleHRQYXJzZXIudG9rZW5zVG9FeHAodG9rZW5zLCB2bSlcbiAgICAgICAgICAgIHZhciBkZXNjID0gZGlyUGFyc2VyLnBhcnNlKG5hbWUgKyAnOicgKyB2YWx1ZSlbMF1cbiAgICAgICAgICAgIHZtLl9iaW5kRGlyKCdhdHRyJywgZWwsIGRlc2MsIGRlZilcbiAgICAgICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGlyZWN0aXZlIHByaW9yaXR5IHNvcnQgY29tcGFyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICovXG5cbmZ1bmN0aW9uIGRpcmVjdGl2ZUNvbXBhcmF0b3IgKGEsIGIpIHtcbiAgYSA9IGEuZGVmLnByaW9yaXR5IHx8IDBcbiAgYiA9IGIuZGVmLnByaW9yaXR5IHx8IDBcbiAgcmV0dXJuIGEgPiBiID8gMSA6IC0xXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxuXG4vKipcbiAqIFByb2Nlc3MgYW4gZWxlbWVudCBvciBhIERvY3VtZW50RnJhZ21lbnQgYmFzZWQgb24gYVxuICogaW5zdGFuY2Ugb3B0aW9uIG9iamVjdC4gVGhpcyBhbGxvd3MgdXMgdG8gdHJhbnNjbHVkZVxuICogYSB0ZW1wbGF0ZSBub2RlL2ZyYWdtZW50IGJlZm9yZSB0aGUgaW5zdGFuY2UgaXMgY3JlYXRlZCxcbiAqIHNvIHRoZSBwcm9jZXNzZWQgZnJhZ21lbnQgY2FuIHRoZW4gYmUgY2xvbmVkIGFuZCByZXVzZWRcbiAqIGluIHYtcmVwZWF0LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2NsdWRlIChlbCwgb3B0aW9ucykge1xuICAvLyBmb3IgdGVtcGxhdGUgdGFncywgd2hhdCB3ZSB3YW50IGlzIGl0cyBjb250ZW50IGFzXG4gIC8vIGEgZG9jdW1lbnRGcmFnbWVudCAoZm9yIGJsb2NrIGluc3RhbmNlcylcbiAgaWYgKGVsLnRhZ05hbWUgPT09ICdURU1QTEFURScpIHtcbiAgICBlbCA9IHRlbXBsYXRlUGFyc2VyLnBhcnNlKGVsKVxuICB9XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMudGVtcGxhdGUpIHtcbiAgICBlbCA9IHRyYW5zY2x1ZGVUZW1wbGF0ZShlbCwgb3B0aW9ucylcbiAgfVxuICBpZiAoZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgXy5wcmVwZW5kKGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3Ytc3RhcnQnKSwgZWwpXG4gICAgZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1lbmQnKSlcbiAgfVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHRoZSB0ZW1wbGF0ZSBvcHRpb24uXG4gKiBJZiB0aGUgcmVwbGFjZSBvcHRpb24gaXMgdHJ1ZSB0aGlzIHdpbGwgc3dhcCB0aGUgJGVsLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNjbHVkZVRlbXBsYXRlIChlbCwgb3B0aW9ucykge1xuICB2YXIgdGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlXG4gIHZhciBmcmFnID0gdGVtcGxhdGVQYXJzZXIucGFyc2UodGVtcGxhdGUsIHRydWUpXG4gIGlmICghZnJhZykge1xuICAgIF8ud2FybignSW52YWxpZCB0ZW1wbGF0ZSBvcHRpb246ICcgKyB0ZW1wbGF0ZSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgcmF3Q29udGVudCA9IG9wdGlvbnMuX2NvbnRlbnQgfHwgXy5leHRyYWN0Q29udGVudChlbClcbiAgICBpZiAob3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICBpZiAoZnJhZy5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdHJhbnNjbHVkZUNvbnRlbnQoZnJhZywgcmF3Q29udGVudClcbiAgICAgICAgXy5jb3B5QXR0cmlidXRlcyhlbCwgZnJhZy5maXJzdENoaWxkKVxuICAgICAgICByZXR1cm4gZnJhZ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlcGxhY2VyID0gZnJhZy5maXJzdENoaWxkXG4gICAgICAgIF8uY29weUF0dHJpYnV0ZXMoZWwsIHJlcGxhY2VyKVxuICAgICAgICB0cmFuc2NsdWRlQ29udGVudChyZXBsYWNlciwgcmF3Q29udGVudClcbiAgICAgICAgcmV0dXJuIHJlcGxhY2VyXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKGZyYWcpXG4gICAgICB0cmFuc2NsdWRlQ29udGVudChlbCwgcmF3Q29udGVudClcbiAgICAgIHJldHVybiBlbFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlc29sdmUgPGNvbnRlbnQ+IGluc2VydGlvbiBwb2ludHMgbWltaWNraW5nIHRoZSBiZWhhdmlvclxuICogb2YgdGhlIFNoYWRvdyBET00gc3BlYzpcbiAqXG4gKiAgIGh0dHA6Ly93M2MuZ2l0aHViLmlvL3dlYmNvbXBvbmVudHMvc3BlYy9zaGFkb3cvI2luc2VydGlvbi1wb2ludHNcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmF3XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNjbHVkZUNvbnRlbnQgKGVsLCByYXcpIHtcbiAgdmFyIG91dGxldHMgPSBnZXRPdXRsZXRzKGVsKVxuICB2YXIgaSA9IG91dGxldHMubGVuZ3RoXG4gIGlmICghaSkgcmV0dXJuXG4gIHZhciBvdXRsZXQsIHNlbGVjdCwgc2VsZWN0ZWQsIGosIG1haW5cblxuICBmdW5jdGlvbiBpc0RpcmVjdENoaWxkIChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUucGFyZW50Tm9kZSA9PT0gcmF3XG4gIH1cblxuICAvLyBmaXJzdCBwYXNzLCBjb2xsZWN0IGNvcnJlc3BvbmRpbmcgY29udGVudFxuICAvLyBmb3IgZWFjaCBvdXRsZXQuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBvdXRsZXQgPSBvdXRsZXRzW2ldXG4gICAgaWYgKHJhdykge1xuICAgICAgc2VsZWN0ID0gb3V0bGV0LmdldEF0dHJpYnV0ZSgnc2VsZWN0JylcbiAgICAgIGlmIChzZWxlY3QpIHsgIC8vIHNlbGVjdCBjb250ZW50XG4gICAgICAgIHNlbGVjdGVkID0gcmF3LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0KVxuICAgICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gYWNjb3JkaW5nIHRvIFNoYWRvdyBET00gc3BlYywgYHNlbGVjdGAgY2FuXG4gICAgICAgICAgLy8gb25seSBzZWxlY3QgZGlyZWN0IGNoaWxkcmVuIG9mIHRoZSBob3N0IG5vZGUuXG4gICAgICAgICAgLy8gZW5mb3JjaW5nIHRoaXMgYWxzbyBmaXhlcyAjNzg2LlxuICAgICAgICAgIHNlbGVjdGVkID0gW10uZmlsdGVyLmNhbGwoc2VsZWN0ZWQsIGlzRGlyZWN0Q2hpbGQpXG4gICAgICAgIH1cbiAgICAgICAgb3V0bGV0LmNvbnRlbnQgPSBzZWxlY3RlZC5sZW5ndGhcbiAgICAgICAgICA/IHNlbGVjdGVkXG4gICAgICAgICAgOiBfLnRvQXJyYXkob3V0bGV0LmNoaWxkTm9kZXMpXG4gICAgICB9IGVsc2UgeyAvLyBkZWZhdWx0IGNvbnRlbnRcbiAgICAgICAgbWFpbiA9IG91dGxldFxuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIGZhbGxiYWNrIGNvbnRlbnRcbiAgICAgIG91dGxldC5jb250ZW50ID0gXy50b0FycmF5KG91dGxldC5jaGlsZE5vZGVzKVxuICAgIH1cbiAgfVxuICAvLyBzZWNvbmQgcGFzcywgYWN0dWFsbHkgaW5zZXJ0IHRoZSBjb250ZW50c1xuICBmb3IgKGkgPSAwLCBqID0gb3V0bGV0cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICBvdXRsZXQgPSBvdXRsZXRzW2ldXG4gICAgaWYgKG91dGxldCAhPT0gbWFpbikge1xuICAgICAgaW5zZXJ0Q29udGVudEF0KG91dGxldCwgb3V0bGV0LmNvbnRlbnQpXG4gICAgfVxuICB9XG4gIC8vIGZpbmFsbHkgaW5zZXJ0IHRoZSBtYWluIGNvbnRlbnRcbiAgaWYgKG1haW4pIHtcbiAgICBpbnNlcnRDb250ZW50QXQobWFpbiwgXy50b0FycmF5KHJhdy5jaGlsZE5vZGVzKSlcbiAgfVxufVxuXG4vKipcbiAqIEdldCA8Y29udGVudD4gb3V0bGV0cyBmcm9tIHRoZSBlbGVtZW50L2xpc3RcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8QXJyYXl9IGVsXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG52YXIgY29uY2F0ID0gW10uY29uY2F0XG5mdW5jdGlvbiBnZXRPdXRsZXRzIChlbCkge1xuICByZXR1cm4gXy5pc0FycmF5KGVsKVxuICAgID8gY29uY2F0LmFwcGx5KFtdLCBlbC5tYXAoZ2V0T3V0bGV0cykpXG4gICAgOiBlbC5xdWVyeVNlbGVjdG9yQWxsXG4gICAgICA/IF8udG9BcnJheShlbC5xdWVyeVNlbGVjdG9yQWxsKCdjb250ZW50JykpXG4gICAgICA6IFtdXG59XG5cbi8qKlxuICogSW5zZXJ0IGFuIGFycmF5IG9mIG5vZGVzIGF0IG91dGxldCxcbiAqIHRoZW4gcmVtb3ZlIHRoZSBvdXRsZXQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBvdXRsZXRcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbnRlbnRzXG4gKi9cblxuZnVuY3Rpb24gaW5zZXJ0Q29udGVudEF0IChvdXRsZXQsIGNvbnRlbnRzKSB7XG4gIC8vIG5vdCB1c2luZyB1dGlsIERPTSBtZXRob2RzIGhlcmUgYmVjYXVzZVxuICAvLyBwYXJlbnROb2RlIGNhbiBiZSBjYWNoZWRcbiAgdmFyIHBhcmVudCA9IG91dGxldC5wYXJlbnROb2RlXG4gIGZvciAodmFyIGkgPSAwLCBqID0gY29udGVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgcGFyZW50Lmluc2VydEJlZm9yZShjb250ZW50c1tpXSwgb3V0bGV0KVxuICB9XG4gIHBhcmVudC5yZW1vdmVDaGlsZChvdXRsZXQpXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIFRoZSBwcmVmaXggdG8gbG9vayBmb3Igd2hlbiBwYXJzaW5nIGRpcmVjdGl2ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuXG4gIHByZWZpeDogJ3YtJyxcblxuICAvKipcbiAgICogV2hldGhlciB0byBwcmludCBkZWJ1ZyBtZXNzYWdlcy5cbiAgICogQWxzbyBlbmFibGVzIHN0YWNrIHRyYWNlIGZvciB3YXJuaW5ncy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIGRlYnVnOiBmYWxzZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byBzdXBwcmVzcyB3YXJuaW5ncy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIHNpbGVudDogZmFsc2UsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgYWxsb3cgb2JzZXJ2ZXIgdG8gYWx0ZXIgZGF0YSBvYmplY3RzJ1xuICAgKiBfX3Byb3RvX18uXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBwcm90bzogdHJ1ZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byBwYXJzZSBtdXN0YWNoZSB0YWdzIGluIHRlbXBsYXRlcy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIGludGVycG9sYXRlOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHVzZSBhc3luYyByZW5kZXJpbmcuXG4gICAqL1xuXG4gIGFzeW5jOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHdhcm4gYWdhaW5zdCBlcnJvcnMgY2F1Z2h0IHdoZW4gZXZhbHVhdGluZ1xuICAgKiBleHByZXNzaW9ucy5cbiAgICovXG5cbiAgd2FybkV4cHJlc3Npb25FcnJvcnM6IHRydWUsXG5cbiAgLyoqXG4gICAqIEludGVybmFsIGZsYWcgdG8gaW5kaWNhdGUgdGhlIGRlbGltaXRlcnMgaGF2ZSBiZWVuXG4gICAqIGNoYW5nZWQuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBfZGVsaW1pdGVyc0NoYW5nZWQ6IHRydWVcblxufVxuXG4vKipcbiAqIEludGVycG9sYXRpb24gZGVsaW1pdGVycy5cbiAqIFdlIG5lZWQgdG8gbWFyayB0aGUgY2hhbmdlZCBmbGFnIHNvIHRoYXQgdGhlIHRleHQgcGFyc2VyXG4gKiBrbm93cyBpdCBuZWVkcyB0byByZWNvbXBpbGUgdGhlIHJlZ2V4LlxuICpcbiAqIEB0eXBlIHtBcnJheTxTdHJpbmc+fVxuICovXG5cbnZhciBkZWxpbWl0ZXJzID0gWyd7eycsICd9fSddXG5PYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLmV4cG9ydHMsICdkZWxpbWl0ZXJzJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZGVsaW1pdGVyc1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICBkZWxpbWl0ZXJzID0gdmFsXG4gICAgdGhpcy5fZGVsaW1pdGVyc0NoYW5nZWQgPSB0cnVlXG4gIH1cbn0pIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBXYXRjaGVyID0gcmVxdWlyZSgnLi93YXRjaGVyJylcbnZhciB0ZXh0UGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL3RleHQnKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2Vycy9leHByZXNzaW9uJylcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSBsaW5rcyBhIERPTSBlbGVtZW50IHdpdGggYSBwaWVjZSBvZiBkYXRhLFxuICogd2hpY2ggaXMgdGhlIHJlc3VsdCBvZiBldmFsdWF0aW5nIGFuIGV4cHJlc3Npb24uXG4gKiBJdCByZWdpc3RlcnMgYSB3YXRjaGVyIHdpdGggdGhlIGV4cHJlc3Npb24gYW5kIGNhbGxzXG4gKiB0aGUgRE9NIHVwZGF0ZSBmdW5jdGlvbiB3aGVuIGEgY2hhbmdlIGlzIHRyaWdnZXJlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzY3JpcHRvclxuICogICAgICAgICAgICAgICAgIC0ge1N0cmluZ30gZXhwcmVzc2lvblxuICogICAgICAgICAgICAgICAgIC0ge1N0cmluZ30gW2FyZ11cbiAqICAgICAgICAgICAgICAgICAtIHtBcnJheTxPYmplY3Q+fSBbZmlsdGVyc11cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWYgLSBkaXJlY3RpdmUgZGVmaW5pdGlvbiBvYmplY3RcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIERpcmVjdGl2ZSAobmFtZSwgZWwsIHZtLCBkZXNjcmlwdG9yLCBkZWYpIHtcbiAgLy8gcHVibGljXG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5lbCA9IGVsXG4gIHRoaXMudm0gPSB2bVxuICAvLyBjb3B5IGRlc2NyaXB0b3IgcHJvcHNcbiAgdGhpcy5yYXcgPSBkZXNjcmlwdG9yLnJhd1xuICB0aGlzLmV4cHJlc3Npb24gPSBkZXNjcmlwdG9yLmV4cHJlc3Npb25cbiAgdGhpcy5hcmcgPSBkZXNjcmlwdG9yLmFyZ1xuICB0aGlzLmZpbHRlcnMgPSBfLnJlc29sdmVGaWx0ZXJzKHZtLCBkZXNjcmlwdG9yLmZpbHRlcnMpXG4gIC8vIHByaXZhdGVcbiAgdGhpcy5fbG9ja2VkID0gZmFsc2VcbiAgdGhpcy5fYm91bmQgPSBmYWxzZVxuICAvLyBpbml0XG4gIHRoaXMuX2JpbmQoZGVmKVxufVxuXG52YXIgcCA9IERpcmVjdGl2ZS5wcm90b3R5cGVcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBkaXJlY3RpdmUsIG1peGluIGRlZmluaXRpb24gcHJvcGVydGllcyxcbiAqIHNldHVwIHRoZSB3YXRjaGVyLCBjYWxsIGRlZmluaXRpb24gYmluZCgpIGFuZCB1cGRhdGUoKVxuICogaWYgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmXG4gKi9cblxucC5fYmluZCA9IGZ1bmN0aW9uIChkZWYpIHtcbiAgaWYgKHRoaXMubmFtZSAhPT0gJ2Nsb2FrJyAmJiB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSkge1xuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKGNvbmZpZy5wcmVmaXggKyB0aGlzLm5hbWUpXG4gIH1cbiAgaWYgKHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLnVwZGF0ZSA9IGRlZlxuICB9IGVsc2Uge1xuICAgIF8uZXh0ZW5kKHRoaXMsIGRlZilcbiAgfVxuICB0aGlzLl93YXRjaGVyRXhwID0gdGhpcy5leHByZXNzaW9uXG4gIHRoaXMuX2NoZWNrRHluYW1pY0xpdGVyYWwoKVxuICBpZiAodGhpcy5iaW5kKSB7XG4gICAgdGhpcy5iaW5kKClcbiAgfVxuICBpZiAodGhpcy5fd2F0Y2hlckV4cCAmJlxuICAgICAgKHRoaXMudXBkYXRlIHx8IHRoaXMudHdvV2F5KSAmJlxuICAgICAgKCF0aGlzLmlzTGl0ZXJhbCB8fCB0aGlzLl9pc0R5bmFtaWNMaXRlcmFsKSAmJlxuICAgICAgIXRoaXMuX2NoZWNrU3RhdGVtZW50KCkpIHtcbiAgICAvLyB3cmFwcGVkIHVwZGF0ZXIgZm9yIGNvbnRleHRcbiAgICB2YXIgZGlyID0gdGhpc1xuICAgIHZhciB1cGRhdGUgPSB0aGlzLl91cGRhdGUgPSB0aGlzLnVwZGF0ZVxuICAgICAgPyBmdW5jdGlvbiAodmFsLCBvbGRWYWwpIHtcbiAgICAgICAgICBpZiAoIWRpci5fbG9ja2VkKSB7XG4gICAgICAgICAgICBkaXIudXBkYXRlKHZhbCwgb2xkVmFsKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgOiBmdW5jdGlvbiAoKSB7fSAvLyBub29wIGlmIG5vIHVwZGF0ZSBpcyBwcm92aWRlZFxuICAgIC8vIHVzZSByYXcgZXhwcmVzc2lvbiBhcyBpZGVudGlmaWVyIGJlY2F1c2UgZmlsdGVyc1xuICAgIC8vIG1ha2UgdGhlbSBkaWZmZXJlbnQgd2F0Y2hlcnNcbiAgICB2YXIgd2F0Y2hlciA9IHRoaXMudm0uX3dhdGNoZXJzW3RoaXMucmF3XVxuICAgIC8vIHYtcmVwZWF0IGFsd2F5cyBjcmVhdGVzIGEgbmV3IHdhdGNoZXIgYmVjYXVzZSBpdCBoYXNcbiAgICAvLyBhIHNwZWNpYWwgZmlsdGVyIHRoYXQncyBib3VuZCB0byBpdHMgZGlyZWN0aXZlXG4gICAgLy8gaW5zdGFuY2UuXG4gICAgaWYgKCF3YXRjaGVyIHx8IHRoaXMubmFtZSA9PT0gJ3JlcGVhdCcpIHtcbiAgICAgIHdhdGNoZXIgPSB0aGlzLnZtLl93YXRjaGVyc1t0aGlzLnJhd10gPSBuZXcgV2F0Y2hlcihcbiAgICAgICAgdGhpcy52bSxcbiAgICAgICAgdGhpcy5fd2F0Y2hlckV4cCxcbiAgICAgICAgdXBkYXRlLCAvLyBjYWxsYmFja1xuICAgICAgICB7XG4gICAgICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgICAgIHR3b1dheTogdGhpcy50d29XYXksXG4gICAgICAgICAgZGVlcDogdGhpcy5kZWVwXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgd2F0Y2hlci5hZGRDYih1cGRhdGUpXG4gICAgfVxuICAgIHRoaXMuX3dhdGNoZXIgPSB3YXRjaGVyXG4gICAgaWYgKHRoaXMuX2luaXRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB3YXRjaGVyLnNldCh0aGlzLl9pbml0VmFsdWUpXG4gICAgfSBlbHNlIGlmICh0aGlzLnVwZGF0ZSkge1xuICAgICAgdGhpcy51cGRhdGUod2F0Y2hlci52YWx1ZSlcbiAgICB9XG4gIH1cbiAgdGhpcy5fYm91bmQgPSB0cnVlXG59XG5cbi8qKlxuICogY2hlY2sgaWYgdGhpcyBpcyBhIGR5bmFtaWMgbGl0ZXJhbCBiaW5kaW5nLlxuICpcbiAqIGUuZy4gdi1jb21wb25lbnQ9XCJ7e2N1cnJlbnRWaWV3fX1cIlxuICovXG5cbnAuX2NoZWNrRHluYW1pY0xpdGVyYWwgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBleHByZXNzaW9uID0gdGhpcy5leHByZXNzaW9uXG4gIGlmIChleHByZXNzaW9uICYmIHRoaXMuaXNMaXRlcmFsKSB7XG4gICAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UoZXhwcmVzc2lvbilcbiAgICBpZiAodG9rZW5zKSB7XG4gICAgICB2YXIgZXhwID0gdGV4dFBhcnNlci50b2tlbnNUb0V4cCh0b2tlbnMpXG4gICAgICB0aGlzLmV4cHJlc3Npb24gPSB0aGlzLnZtLiRnZXQoZXhwKVxuICAgICAgdGhpcy5fd2F0Y2hlckV4cCA9IGV4cFxuICAgICAgdGhpcy5faXNEeW5hbWljTGl0ZXJhbCA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZGlyZWN0aXZlIGlzIGEgZnVuY3Rpb24gY2FsbGVyXG4gKiBhbmQgaWYgdGhlIGV4cHJlc3Npb24gaXMgYSBjYWxsYWJsZSBvbmUuIElmIGJvdGggdHJ1ZSxcbiAqIHdlIHdyYXAgdXAgdGhlIGV4cHJlc3Npb24gYW5kIHVzZSBpdCBhcyB0aGUgZXZlbnRcbiAqIGhhbmRsZXIuXG4gKlxuICogZS5nLiB2LW9uPVwiY2xpY2s6IGErK1wiXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5wLl9jaGVja1N0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV4cHJlc3Npb24gPSB0aGlzLmV4cHJlc3Npb25cbiAgaWYgKFxuICAgIGV4cHJlc3Npb24gJiYgdGhpcy5hY2NlcHRTdGF0ZW1lbnQgJiZcbiAgICAhZXhwUGFyc2VyLnBhdGhUZXN0UkUudGVzdChleHByZXNzaW9uKVxuICApIHtcbiAgICB2YXIgZm4gPSBleHBQYXJzZXIucGFyc2UoZXhwcmVzc2lvbikuZ2V0XG4gICAgdmFyIHZtID0gdGhpcy52bVxuICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgZm4uY2FsbCh2bSwgdm0pXG4gICAgfVxuICAgIGlmICh0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGhhbmRsZXIgPSBfLmFwcGx5RmlsdGVycyhcbiAgICAgICAgaGFuZGxlcixcbiAgICAgICAgdGhpcy5maWx0ZXJzLnJlYWQsXG4gICAgICAgIHZtXG4gICAgICApXG4gICAgfVxuICAgIHRoaXMudXBkYXRlKGhhbmRsZXIpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBhbiBhdHRyaWJ1dGUgZGlyZWN0aXZlIHBhcmFtLCBlLmcuIGxhenlcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbnAuX2NoZWNrUGFyYW0gPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgcGFyYW0gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShuYW1lKVxuICBpZiAocGFyYW0gIT09IG51bGwpIHtcbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShuYW1lKVxuICB9XG4gIHJldHVybiBwYXJhbVxufVxuXG4vKipcbiAqIFRlYXJkb3duIHRoZSB3YXRjaGVyIGFuZCBjYWxsIHVuYmluZC5cbiAqL1xuXG5wLl90ZWFyZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuX2JvdW5kKSB7XG4gICAgaWYgKHRoaXMudW5iaW5kKSB7XG4gICAgICB0aGlzLnVuYmluZCgpXG4gICAgfVxuICAgIHZhciB3YXRjaGVyID0gdGhpcy5fd2F0Y2hlclxuICAgIGlmICh3YXRjaGVyICYmIHdhdGNoZXIuYWN0aXZlKSB7XG4gICAgICB3YXRjaGVyLnJlbW92ZUNiKHRoaXMuX3VwZGF0ZSlcbiAgICAgIGlmICghd2F0Y2hlci5hY3RpdmUpIHtcbiAgICAgICAgdGhpcy52bS5fd2F0Y2hlcnNbdGhpcy5yYXddID0gbnVsbFxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9ib3VuZCA9IGZhbHNlXG4gICAgdGhpcy52bSA9IHRoaXMuZWwgPSB0aGlzLl93YXRjaGVyID0gbnVsbFxuICB9XG59XG5cbi8qKlxuICogU2V0IHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIHdpdGggdGhlIHNldHRlci5cbiAqIFRoaXMgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbiB0d28td2F5IGRpcmVjdGl2ZXNcbiAqIGUuZy4gdi1tb2RlbC5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGxvY2sgLSBwcmV2ZW50IHdydGllIHRyaWdnZXJpbmcgdXBkYXRlLlxuICogQHB1YmxpY1xuICovXG5cbnAuc2V0ID0gZnVuY3Rpb24gKHZhbHVlLCBsb2NrKSB7XG4gIGlmICh0aGlzLnR3b1dheSkge1xuICAgIGlmIChsb2NrKSB7XG4gICAgICB0aGlzLl9sb2NrZWQgPSB0cnVlXG4gICAgfVxuICAgIHRoaXMuX3dhdGNoZXIuc2V0KHZhbHVlKVxuICAgIGlmIChsb2NrKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIF8ubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLl9sb2NrZWQgPSBmYWxzZVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBEaXJlY3RpdmUiLCIvLyB4bGlua1xudmFyIHhsaW5rTlMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaydcbnZhciB4bGlua1JFID0gL154bGluazovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHByaW9yaXR5OiA4NTAsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBuYW1lID0gdGhpcy5hcmdcbiAgICB0aGlzLnVwZGF0ZSA9IHhsaW5rUkUudGVzdChuYW1lKVxuICAgICAgPyB4bGlua0hhbmRsZXJcbiAgICAgIDogZGVmYXVsdEhhbmRsZXJcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRIYW5kbGVyICh2YWx1ZSkge1xuICBpZiAodmFsdWUgfHwgdmFsdWUgPT09IDApIHtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZSh0aGlzLmFyZywgdmFsdWUpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUodGhpcy5hcmcpXG4gIH1cbn1cblxuZnVuY3Rpb24geGxpbmtIYW5kbGVyICh2YWx1ZSkge1xuICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlTlMoeGxpbmtOUywgdGhpcy5hcmcsIHZhbHVlKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlTlMoeGxpbmtOUywgJ2hyZWYnKVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBhZGRDbGFzcyA9IF8uYWRkQ2xhc3NcbnZhciByZW1vdmVDbGFzcyA9IF8ucmVtb3ZlQ2xhc3NcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKHRoaXMuYXJnKSB7XG4gICAgdmFyIG1ldGhvZCA9IHZhbHVlID8gYWRkQ2xhc3MgOiByZW1vdmVDbGFzc1xuICAgIG1ldGhvZCh0aGlzLmVsLCB0aGlzLmFyZylcbiAgfSBlbHNlIHtcbiAgICBpZiAodGhpcy5sYXN0VmFsKSB7XG4gICAgICByZW1vdmVDbGFzcyh0aGlzLmVsLCB0aGlzLmxhc3RWYWwpXG4gICAgfVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgYWRkQ2xhc3ModGhpcy5lbCwgdmFsdWUpXG4gICAgICB0aGlzLmxhc3RWYWwgPSB2YWx1ZVxuICAgIH1cbiAgfVxufSIsInZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIHRoaXMudm0uJG9uY2UoJ2hvb2s6Y29tcGlsZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoY29uZmlnLnByZWZpeCArICdjbG9haycpXG4gICAgfSlcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgLyoqXG4gICAqIFNldHVwLiBUd28gcG9zc2libGUgdXNhZ2VzOlxuICAgKlxuICAgKiAtIHN0YXRpYzpcbiAgICogICB2LWNvbXBvbmVudD1cImNvbXBcIlxuICAgKlxuICAgKiAtIGR5bmFtaWM6XG4gICAqICAgdi1jb21wb25lbnQ9XCJ7e2N1cnJlbnRWaWV3fX1cIlxuICAgKi9cblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmVsLl9fdnVlX18pIHtcbiAgICAgIC8vIGNyZWF0ZSBhIHJlZiBhbmNob3JcbiAgICAgIHRoaXMucmVmID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1jb21wb25lbnQnKVxuICAgICAgXy5yZXBsYWNlKHRoaXMuZWwsIHRoaXMucmVmKVxuICAgICAgLy8gY2hlY2sga2VlcC1hbGl2ZSBvcHRpb25zLlxuICAgICAgLy8gSWYgeWVzLCBpbnN0ZWFkIG9mIGRlc3Ryb3lpbmcgdGhlIGFjdGl2ZSB2bSB3aGVuXG4gICAgICAvLyBoaWRpbmcgKHYtaWYpIG9yIHN3aXRjaGluZyAoZHluYW1pYyBsaXRlcmFsKSBpdCxcbiAgICAgIC8vIHdlIHNpbXBseSByZW1vdmUgaXQgZnJvbSB0aGUgRE9NIGFuZCBzYXZlIGl0IGluIGFcbiAgICAgIC8vIGNhY2hlIG9iamVjdCwgd2l0aCBpdHMgY29uc3RydWN0b3IgaWQgYXMgdGhlIGtleS5cbiAgICAgIHRoaXMua2VlcEFsaXZlID0gdGhpcy5fY2hlY2tQYXJhbSgna2VlcC1hbGl2ZScpICE9IG51bGxcbiAgICAgIC8vIGNoZWNrIHJlZlxuICAgICAgdGhpcy5yZWZJRCA9IF8uYXR0cih0aGlzLmVsLCAncmVmJylcbiAgICAgIGlmICh0aGlzLmtlZXBBbGl2ZSkge1xuICAgICAgICB0aGlzLmNhY2hlID0ge31cbiAgICAgIH1cbiAgICAgIC8vIGNoZWNrIGlubGluZS10ZW1wbGF0ZVxuICAgICAgaWYgKHRoaXMuX2NoZWNrUGFyYW0oJ2lubGluZS10ZW1wbGF0ZScpICE9PSBudWxsKSB7XG4gICAgICAgIC8vIGV4dHJhY3QgaW5saW5lIHRlbXBsYXRlIGFzIGEgRG9jdW1lbnRGcmFnbWVudFxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gXy5leHRyYWN0Q29udGVudCh0aGlzLmVsLCB0cnVlKVxuICAgICAgfVxuICAgICAgLy8gaWYgc3RhdGljLCBidWlsZCByaWdodCBub3cuXG4gICAgICBpZiAoIXRoaXMuX2lzRHluYW1pY0xpdGVyYWwpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlQ3Rvcih0aGlzLmV4cHJlc3Npb24pXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuYnVpbGQoKVxuICAgICAgICBjaGlsZC4kYmVmb3JlKHRoaXMucmVmKVxuICAgICAgICB0aGlzLnNldEN1cnJlbnQoY2hpbGQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBjaGVjayBkeW5hbWljIGNvbXBvbmVudCBwYXJhbXNcbiAgICAgICAgdGhpcy5yZWFkeUV2ZW50ID0gdGhpcy5fY2hlY2tQYXJhbSgnd2FpdC1mb3InKVxuICAgICAgICB0aGlzLnRyYW5zTW9kZSA9IHRoaXMuX2NoZWNrUGFyYW0oJ3RyYW5zaXRpb24tbW9kZScpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3YtY29tcG9uZW50PVwiJyArIHRoaXMuZXhwcmVzc2lvbiArICdcIiBjYW5ub3QgYmUgJyArXG4gICAgICAgICd1c2VkIG9uIGFuIGFscmVhZHkgbW91bnRlZCBpbnN0YW5jZS4nXG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIHRoZSBjb21wb25lbnQgY29uc3RydWN0b3IgdG8gdXNlIHdoZW4gY3JlYXRpbmdcbiAgICogdGhlIGNoaWxkIHZtLlxuICAgKi9cblxuICByZXNvbHZlQ3RvcjogZnVuY3Rpb24gKGlkKSB7XG4gICAgdGhpcy5jdG9ySWQgPSBpZFxuICAgIHRoaXMuQ3RvciA9IHRoaXMudm0uJG9wdGlvbnMuY29tcG9uZW50c1tpZF1cbiAgICBfLmFzc2VydEFzc2V0KHRoaXMuQ3RvciwgJ2NvbXBvbmVudCcsIGlkKVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZS9pbnNlcnQgYSBuZXcgY2hpbGQgdm0uXG4gICAqIElmIGtlZXAgYWxpdmUgYW5kIGhhcyBjYWNoZWQgaW5zdGFuY2UsIGluc2VydCB0aGF0XG4gICAqIGluc3RhbmNlOyBvdGhlcndpc2UgYnVpbGQgYSBuZXcgb25lIGFuZCBjYWNoZSBpdC5cbiAgICpcbiAgICogQHJldHVybiB7VnVlfSAtIHRoZSBjcmVhdGVkIGluc3RhbmNlXG4gICAqL1xuXG4gIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICB2YXIgY2FjaGVkID0gdGhpcy5jYWNoZVt0aGlzLmN0b3JJZF1cbiAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlZFxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdmFyIGVsID0gdGVtcGxhdGVQYXJzZXIuY2xvbmUodGhpcy5lbClcbiAgICBpZiAodGhpcy5DdG9yKSB7XG4gICAgICB2YXIgY2hpbGQgPSB2bS4kYWRkQ2hpbGQoe1xuICAgICAgICBlbDogZWwsXG4gICAgICAgIHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlLFxuICAgICAgICBfYXNDb21wb25lbnQ6IHRydWVcbiAgICAgIH0sIHRoaXMuQ3RvcilcbiAgICAgIGlmICh0aGlzLmtlZXBBbGl2ZSkge1xuICAgICAgICB0aGlzLmNhY2hlW3RoaXMuY3RvcklkXSA9IGNoaWxkXG4gICAgICB9XG4gICAgICByZXR1cm4gY2hpbGRcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRlYXJkb3duIHRoZSBjdXJyZW50IGNoaWxkLCBidXQgZGVmZXJzIGNsZWFudXAgc29cbiAgICogdGhhdCB3ZSBjYW4gc2VwYXJhdGUgdGhlIGRlc3Ryb3kgYW5kIHJlbW92YWwgc3RlcHMuXG4gICAqL1xuXG4gIHVuYnVpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkVk1cbiAgICBpZiAoIWNoaWxkIHx8IHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gdGhlIHNvbGUgcHVycG9zZSBvZiBgZGVmZXJDbGVhbnVwYCBpcyBzbyB0aGF0IHdlIGNhblxuICAgIC8vIFwiZGVhY3RpdmF0ZVwiIHRoZSB2bSByaWdodCBub3cgYW5kIHBlcmZvcm0gRE9NIHJlbW92YWxcbiAgICAvLyBsYXRlci5cbiAgICBjaGlsZC4kZGVzdHJveShmYWxzZSwgdHJ1ZSlcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGN1cnJlbnQgZGVzdHJveWVkIGNoaWxkIGFuZCBtYW51YWxseSBkb1xuICAgKiB0aGUgY2xlYW51cCBhZnRlciByZW1vdmFsLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICAgKi9cblxuICByZW1vdmU6IGZ1bmN0aW9uIChjaGlsZCwgY2IpIHtcbiAgICB2YXIga2VlcEFsaXZlID0gdGhpcy5rZWVwQWxpdmVcbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGNoaWxkLiRyZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWtlZXBBbGl2ZSkgY2hpbGQuX2NsZWFudXAoKVxuICAgICAgICBpZiAoY2IpIGNiKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChjYikge1xuICAgICAgY2IoKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlIGNhbGxiYWNrIGZvciB0aGUgZHluYW1pYyBsaXRlcmFsIHNjZW5hcmlvLFxuICAgKiBlLmcuIHYtY29tcG9uZW50PVwie3t2aWV3fX1cIlxuICAgKi9cblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIC8vIGp1c3QgZGVzdHJveSBhbmQgcmVtb3ZlIGN1cnJlbnRcbiAgICAgIHRoaXMudW5idWlsZCgpXG4gICAgICB0aGlzLnJlbW92ZSh0aGlzLmNoaWxkVk0pXG4gICAgICB0aGlzLnVuc2V0Q3VycmVudCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzb2x2ZUN0b3IodmFsdWUpXG4gICAgICB0aGlzLnVuYnVpbGQoKVxuICAgICAgdmFyIG5ld0NvbXBvbmVudCA9IHRoaXMuYnVpbGQoKVxuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICBpZiAodGhpcy5yZWFkeUV2ZW50KSB7XG4gICAgICAgIG5ld0NvbXBvbmVudC4kb25jZSh0aGlzLnJlYWR5RXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnN3YXBUbyhuZXdDb21wb25lbnQpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN3YXBUbyhuZXdDb21wb25lbnQpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBY3R1YWxseSBzd2FwIHRoZSBjb21wb25lbnRzLCBkZXBlbmRpbmcgb24gdGhlXG4gICAqIHRyYW5zaXRpb24gbW9kZS4gRGVmYXVsdHMgdG8gc2ltdWx0YW5lb3VzLlxuICAgKlxuICAgKiBAcGFyYW0ge1Z1ZX0gdGFyZ2V0XG4gICAqL1xuXG4gIHN3YXBUbzogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5jaGlsZFZNXG4gICAgdGhpcy51bnNldEN1cnJlbnQoKVxuICAgIHRoaXMuc2V0Q3VycmVudCh0YXJnZXQpXG4gICAgc3dpdGNoIChzZWxmLnRyYW5zTW9kZSkge1xuICAgICAgY2FzZSAnaW4tb3V0JzpcbiAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5yZWYsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnJlbW92ZShjdXJyZW50KVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnb3V0LWluJzpcbiAgICAgICAgc2VsZi5yZW1vdmUoY3VycmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRhcmdldC4kYmVmb3JlKHNlbGYucmVmKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc2VsZi5yZW1vdmUoY3VycmVudClcbiAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5yZWYpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQgY2hpbGRWTSBhbmQgcGFyZW50IHJlZlxuICAgKi9cbiAgXG4gIHNldEN1cnJlbnQ6IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHRoaXMuY2hpbGRWTSA9IGNoaWxkXG4gICAgdmFyIHJlZklEID0gY2hpbGQuX3JlZklEIHx8IHRoaXMucmVmSURcbiAgICBpZiAocmVmSUQpIHtcbiAgICAgIHRoaXMudm0uJFtyZWZJRF0gPSBjaGlsZFxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVW5zZXQgY2hpbGRWTSBhbmQgcGFyZW50IHJlZlxuICAgKi9cblxuICB1bnNldEN1cnJlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkVk1cbiAgICB0aGlzLmNoaWxkVk0gPSBudWxsXG4gICAgdmFyIHJlZklEID0gKGNoaWxkICYmIGNoaWxkLl9yZWZJRCkgfHwgdGhpcy5yZWZJRFxuICAgIGlmIChyZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3JlZklEXSA9IG51bGxcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVuYmluZC5cbiAgICovXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy51bmJ1aWxkKClcbiAgICAvLyBkZXN0cm95IGFsbCBrZWVwLWFsaXZlIGNhY2hlZCBpbnN0YW5jZXNcbiAgICBpZiAodGhpcy5jYWNoZSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMuY2FjaGUpIHtcbiAgICAgICAgdGhpcy5jYWNoZVtrZXldLiRkZXN0cm95KClcbiAgICAgIH1cbiAgICAgIHRoaXMuY2FjaGUgPSBudWxsXG4gICAgfVxuICB9XG5cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudm0uJCRbdGhpcy5leHByZXNzaW9uXSA9IHRoaXMuZWxcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBkZWxldGUgdGhpcy52bS4kJFt0aGlzLmV4cHJlc3Npb25dXG4gIH1cbiAgXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7IFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLmVsLl9fdnVlX19cbiAgICBpZiAoIWNoaWxkIHx8IHRoaXMudm0gIT09IGNoaWxkLiRwYXJlbnQpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ2B2LWV2ZW50c2Agc2hvdWxkIG9ubHkgYmUgdXNlZCBvbiBhIGNoaWxkIGNvbXBvbmVudCAnICtcbiAgICAgICAgJ2Zyb20gdGhlIHBhcmVudCB0ZW1wbGF0ZS4nXG4gICAgICApXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIG1ldGhvZCA9IHRoaXMudm1bdGhpcy5leHByZXNzaW9uXVxuICAgIGlmICghbWV0aG9kKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdgdi1ldmVudHNgIGNhbm5vdCBmaW5kIG1ldGhvZCBcIicgKyB0aGlzLmV4cHJlc3Npb24gK1xuICAgICAgICAnXCIgb24gdGhlIHBhcmVudCBpbnN0YW5jZS4nXG4gICAgICApXG4gICAgfVxuICAgIGNoaWxkLiRvbih0aGlzLmFyZywgbWV0aG9kKVxuICB9XG5cbiAgLy8gd2hlbiBjaGlsZCBpcyBkZXN0cm95ZWQsIGFsbCBldmVudHMgYXJlIHR1cm5lZCBvZmYsXG4gIC8vIHNvIG5vIG5lZWQgZm9yIHVuYmluZCBoZXJlLlxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gYSBjb21tZW50IG5vZGUgbWVhbnMgdGhpcyBpcyBhIGJpbmRpbmcgZm9yXG4gICAgLy8ge3t7IGlubGluZSB1bmVzY2FwZWQgaHRtbCB9fX1cbiAgICBpZiAodGhpcy5lbC5ub2RlVHlwZSA9PT0gOCkge1xuICAgICAgLy8gaG9sZCBub2Rlc1xuICAgICAgdGhpcy5ub2RlcyA9IFtdXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFsdWUgPSBfLnRvU3RyaW5nKHZhbHVlKVxuICAgIGlmICh0aGlzLm5vZGVzKSB7XG4gICAgICB0aGlzLnN3YXAodmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgc3dhcDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLy8gcmVtb3ZlIG9sZCBub2Rlc1xuICAgIHZhciBpID0gdGhpcy5ub2Rlcy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBfLnJlbW92ZSh0aGlzLm5vZGVzW2ldKVxuICAgIH1cbiAgICAvLyBjb252ZXJ0IG5ldyB2YWx1ZSB0byBhIGZyYWdtZW50XG4gICAgLy8gZG8gbm90IGF0dGVtcHQgdG8gcmV0cmlldmUgZnJvbSBpZCBzZWxlY3RvclxuICAgIHZhciBmcmFnID0gdGVtcGxhdGVQYXJzZXIucGFyc2UodmFsdWUsIHRydWUsIHRydWUpXG4gICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSB0byB0aGVzZSBub2RlcyBzbyB3ZSBjYW4gcmVtb3ZlIGxhdGVyXG4gICAgdGhpcy5ub2RlcyA9IF8udG9BcnJheShmcmFnLmNoaWxkTm9kZXMpXG4gICAgXy5iZWZvcmUoZnJhZywgdGhpcy5lbClcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcbnZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgaWYgKCFlbC5fX3Z1ZV9fKSB7XG4gICAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1pZi1zdGFydCcpXG4gICAgICB0aGlzLmVuZCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtaWYtZW5kJylcbiAgICAgIF8ucmVwbGFjZShlbCwgdGhpcy5lbmQpXG4gICAgICBfLmJlZm9yZSh0aGlzLnN0YXJ0LCB0aGlzLmVuZClcblxuICAgICAgLy8gTm90ZTogY29udGVudCB0cmFuc2NsdXNpb24gaXMgbm90IGF2YWlsYWJsZSBmb3JcbiAgICAgIC8vIDx0ZW1wbGF0ZT4gYmxvY2tzXG4gICAgICBpZiAoZWwudGFnTmFtZSA9PT0gJ1RFTVBMQVRFJykge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGVQYXJzZXIucGFyc2UoZWwsIHRydWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICAgIHRoaXMudGVtcGxhdGUuYXBwZW5kQ2hpbGQodGVtcGxhdGVQYXJzZXIuY2xvbmUoZWwpKVxuICAgICAgICB0aGlzLmNoZWNrQ29udGVudCgpXG4gICAgICB9XG4gICAgICAvLyBjb21waWxlIHRoZSBuZXN0ZWQgcGFydGlhbFxuICAgICAgdGhpcy5saW5rZXIgPSBjb21waWxlKFxuICAgICAgICB0aGlzLnRlbXBsYXRlLFxuICAgICAgICB0aGlzLnZtLiRvcHRpb25zLFxuICAgICAgICB0cnVlXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW52YWxpZCA9IHRydWVcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3YtaWY9XCInICsgdGhpcy5leHByZXNzaW9uICsgJ1wiIGNhbm5vdCBiZSAnICtcbiAgICAgICAgJ3VzZWQgb24gYW4gYWxyZWFkeSBtb3VudGVkIGluc3RhbmNlLidcbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgLy8gY2hlY2sgaWYgdGhlcmUgYXJlIGFueSBjb250ZW50IG5vZGVzIGZyb20gcGFyZW50LlxuICAvLyB0aGVzZSBub2RlcyBhcmUgY29tcGlsZWQgYnkgdGhlIHBhcmVudCBhbmQgc2hvdWxkXG4gIC8vIG5vdCBiZSBjbG9uZWQgZHVyaW5nIGEgcmUtY29tcGlsYXRpb24gLSBvdGhlcndpc2UgdGhlXG4gIC8vIHBhcmVudCBkaXJlY3RpdmVzIGJvdW5kIHRvIHRoZW0gd2lsbCBubyBsb25nZXIgd29yay5cbiAgLy8gKHNlZSAjNzM2KVxuICBjaGVja0NvbnRlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbm9kZSA9IGVsLmNoaWxkTm9kZXNbaV1cbiAgICAgIC8vIF9pc0NvbnRlbnQgaXMgYSBmbGFnIHNldCBpbiBpbnN0YW5jZS9jb21waWxlXG4gICAgICAvLyBhZnRlciB0aGUgcmF3IGNvbnRlbnQgaGFzIGJlZW4gY29tcGlsZWQgYnkgcGFyZW50XG4gICAgICBpZiAobm9kZS5faXNDb250ZW50KSB7XG4gICAgICAgIDsodGhpcy5jb250ZW50Tm9kZXMgPSB0aGlzLmNvbnRlbnROb2RlcyB8fCBbXSkucHVzaChub2RlKVxuICAgICAgICA7KHRoaXMuY29udGVudFBvc2l0aW9ucyA9IHRoaXMuY29udGVudFBvc2l0aW9ucyB8fCBbXSkucHVzaChpKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBrZWVwIHRyYWNrIG9mIGFueSB0cmFuc2NsdWRlZCBjb21wb25lbnRzIGNvbnRhaW5lZCB3aXRoaW5cbiAgICAvLyB0aGUgY29uZGl0aW9uYWwgYmxvY2suIHdlIG5lZWQgdG8gY2FsbCBhdHRhY2gvZGV0YWNoIGhvb2tzXG4gICAgLy8gZm9yIHRoZW0uXG4gICAgdGhpcy50cmFuc0NwbnRzID1cbiAgICAgIHRoaXMudm0uX3RyYW5zQ3BudHMgJiZcbiAgICAgIHRoaXMudm0uX3RyYW5zQ3BudHMuZmlsdGVyKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHJldHVybiBlbC5jb250YWlucyhjLiRlbClcbiAgICAgIH0pXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5pbnZhbGlkKSByZXR1cm5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIC8vIGF2b2lkIGR1cGxpY2F0ZSBjb21waWxlcywgc2luY2UgdXBkYXRlKCkgY2FuIGJlXG4gICAgICAvLyBjYWxsZWQgd2l0aCBkaWZmZXJlbnQgdHJ1dGh5IHZhbHVlc1xuICAgICAgaWYgKCF0aGlzLnVubGluaykge1xuICAgICAgICB2YXIgZnJhZyA9IHRlbXBsYXRlUGFyc2VyLmNsb25lKHRoaXMudGVtcGxhdGUpXG4gICAgICAgIC8vIHBlcnNpc3QgY29udGVudCBub2RlcyBmcm9tIHBhcmVudC5cbiAgICAgICAgaWYgKHRoaXMuY29udGVudE5vZGVzKSB7XG4gICAgICAgICAgdmFyIGVsID0gZnJhZy5jaGlsZE5vZGVzWzBdXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0aGlzLmNvbnRlbnROb2Rlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5jb250ZW50Tm9kZXNbaV1cbiAgICAgICAgICAgIHZhciBqID0gdGhpcy5jb250ZW50UG9zaXRpb25zW2ldXG4gICAgICAgICAgICBlbC5yZXBsYWNlQ2hpbGQobm9kZSwgZWwuY2hpbGROb2Rlc1tqXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21waWxlKGZyYWcpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgIH1cbiAgfSxcblxuICAvLyBOT1RFOiB0aGlzIGZ1bmN0aW9uIGlzIHNoYXJlZCBpbiB2LXBhcnRpYWxcbiAgY29tcGlsZTogZnVuY3Rpb24gKGZyYWcpIHtcbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdmFyIG9yaWdpbmFsQ2hpbGRMZW5ndGggPSB2bS5fY2hpbGRyZW4ubGVuZ3RoXG4gICAgdGhpcy51bmxpbmsgPSB0aGlzLmxpbmtlclxuICAgICAgPyB0aGlzLmxpbmtlcih2bSwgZnJhZylcbiAgICAgIDogdm0uJGNvbXBpbGUoZnJhZylcbiAgICB0cmFuc2l0aW9uLmJsb2NrQXBwZW5kKGZyYWcsIHRoaXMuZW5kLCB2bSlcbiAgICB0aGlzLmNoaWxkcmVuID0gdm0uX2NoaWxkcmVuLnNsaWNlKG9yaWdpbmFsQ2hpbGRMZW5ndGgpXG4gICAgaWYgKHRoaXMudHJhbnNDcG50cykge1xuICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW4uY29uY2F0KHRoaXMudHJhbnNDcG50cylcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoICYmIF8uaW5Eb2Modm0uJGVsKSkge1xuICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBjaGlsZC5fY2FsbEhvb2soJ2F0dGFjaGVkJylcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIC8vIE5PVEU6IHRoaXMgZnVuY3Rpb24gaXMgc2hhcmVkIGluIHYtcGFydGlhbFxuICB0ZWFyZG93bjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy51bmxpbmspIHJldHVyblxuICAgIHRyYW5zaXRpb24uYmxvY2tSZW1vdmUodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMudm0pXG4gICAgaWYgKHRoaXMuY2hpbGRyZW4gJiYgXy5pbkRvYyh0aGlzLnZtLiRlbCkpIHtcbiAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgaWYgKCFjaGlsZC5faXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICBjaGlsZC5fY2FsbEhvb2soJ2RldGFjaGVkJylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy51bmxpbmsoKVxuICAgIHRoaXMudW5saW5rID0gbnVsbFxuICB9LFxuXG4gIC8vIE5PVEU6IHRoaXMgZnVuY3Rpb24gaXMgc2hhcmVkIGluIHYtcGFydGlhbFxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy51bmxpbmspIHRoaXMudW5saW5rKClcbiAgfVxuXG59IiwiLy8gbWFuaXB1bGF0aW9uIGRpcmVjdGl2ZXNcbmV4cG9ydHMudGV4dCAgICAgICA9IHJlcXVpcmUoJy4vdGV4dCcpXG5leHBvcnRzLmh0bWwgICAgICAgPSByZXF1aXJlKCcuL2h0bWwnKVxuZXhwb3J0cy5hdHRyICAgICAgID0gcmVxdWlyZSgnLi9hdHRyJylcbmV4cG9ydHMuc2hvdyAgICAgICA9IHJlcXVpcmUoJy4vc2hvdycpXG5leHBvcnRzWydjbGFzcyddICAgPSByZXF1aXJlKCcuL2NsYXNzJylcbmV4cG9ydHMuZWwgICAgICAgICA9IHJlcXVpcmUoJy4vZWwnKVxuZXhwb3J0cy5yZWYgICAgICAgID0gcmVxdWlyZSgnLi9yZWYnKVxuZXhwb3J0cy5jbG9hayAgICAgID0gcmVxdWlyZSgnLi9jbG9haycpXG5leHBvcnRzLnN0eWxlICAgICAgPSByZXF1aXJlKCcuL3N0eWxlJylcbmV4cG9ydHMucGFydGlhbCAgICA9IHJlcXVpcmUoJy4vcGFydGlhbCcpXG5leHBvcnRzLnRyYW5zaXRpb24gPSByZXF1aXJlKCcuL3RyYW5zaXRpb24nKVxuXG4vLyBldmVudCBsaXN0ZW5lciBkaXJlY3RpdmVzXG5leHBvcnRzLm9uICAgICAgICAgPSByZXF1aXJlKCcuL29uJylcbmV4cG9ydHMubW9kZWwgICAgICA9IHJlcXVpcmUoJy4vbW9kZWwnKVxuXG4vLyBjaGlsZCB2bSBkaXJlY3RpdmVzXG5leHBvcnRzLmNvbXBvbmVudCAgPSByZXF1aXJlKCcuL2NvbXBvbmVudCcpXG5leHBvcnRzLnJlcGVhdCAgICAgPSByZXF1aXJlKCcuL3JlcGVhdCcpXG5leHBvcnRzWydpZiddICAgICAgPSByZXF1aXJlKCcuL2lmJylcblxuLy8gY2hpbGQgdm0gY29tbXVuaWNhdGlvbiBkaXJlY3RpdmVzXG5leHBvcnRzWyd3aXRoJ10gICAgPSByZXF1aXJlKCcuL3dpdGgnKVxuZXhwb3J0cy5ldmVudHMgICAgID0gcmVxdWlyZSgnLi9ldmVudHMnKSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy5saXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuc2V0KGVsLmNoZWNrZWQsIHRydWUpXG4gICAgfVxuICAgIF8ub24oZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICAgIGlmIChlbC5jaGVja2VkKSB7XG4gICAgICB0aGlzLl9pbml0VmFsdWUgPSBlbC5jaGVja2VkXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5lbC5jaGVja2VkID0gISF2YWx1ZVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIF8ub2ZmKHRoaXMuZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGVsID0gdGhpcy5lbFxuXG4gICAgLy8gY2hlY2sgcGFyYW1zXG4gICAgLy8gLSBsYXp5OiB1cGRhdGUgbW9kZWwgb24gXCJjaGFuZ2VcIiBpbnN0ZWFkIG9mIFwiaW5wdXRcIlxuICAgIHZhciBsYXp5ID0gdGhpcy5fY2hlY2tQYXJhbSgnbGF6eScpICE9IG51bGxcbiAgICAvLyAtIG51bWJlcjogY2FzdCB2YWx1ZSBpbnRvIG51bWJlciB3aGVuIHVwZGF0aW5nIG1vZGVsLlxuICAgIHZhciBudW1iZXIgPSB0aGlzLl9jaGVja1BhcmFtKCdudW1iZXInKSAhPSBudWxsXG4gICAgLy8gLSBkZWJvdW5jZTogZGVib3VuY2UgdGhlIGlucHV0IGxpc3RlbmVyXG4gICAgdmFyIGRlYm91bmNlID0gcGFyc2VJbnQodGhpcy5fY2hlY2tQYXJhbSgnZGVib3VuY2UnKSwgMTApXG5cbiAgICAvLyBoYW5kbGUgY29tcG9zaXRpb24gZXZlbnRzLlxuICAgIC8vIGh0dHA6Ly9ibG9nLmV2YW55b3UubWUvMjAxNC8wMS8wMy9jb21wb3NpdGlvbi1ldmVudC9cbiAgICB2YXIgY3BMb2NrZWQgPSBmYWxzZVxuICAgIHRoaXMuY3BMb2NrID0gZnVuY3Rpb24gKCkge1xuICAgICAgY3BMb2NrZWQgPSB0cnVlXG4gICAgfVxuICAgIHRoaXMuY3BVbmxvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjcExvY2tlZCA9IGZhbHNlXG4gICAgICAvLyBpbiBJRTExIHRoZSBcImNvbXBvc2l0aW9uZW5kXCIgZXZlbnQgZmlyZXMgQUZURVJcbiAgICAgIC8vIHRoZSBcImlucHV0XCIgZXZlbnQsIHNvIHRoZSBpbnB1dCBoYW5kbGVyIGlzIGJsb2NrZWRcbiAgICAgIC8vIGF0IHRoZSBlbmQuLi4gaGF2ZSB0byBjYWxsIGl0IGhlcmUuXG4gICAgICBzZXQoKVxuICAgIH1cbiAgICBfLm9uKGVsLCdjb21wb3NpdGlvbnN0YXJ0JywgdGhpcy5jcExvY2spXG4gICAgXy5vbihlbCwnY29tcG9zaXRpb25lbmQnLCB0aGlzLmNwVW5sb2NrKVxuXG4gICAgLy8gc2hhcmVkIHNldHRlclxuICAgIGZ1bmN0aW9uIHNldCAoKSB7XG4gICAgICBzZWxmLnNldChcbiAgICAgICAgbnVtYmVyID8gXy50b051bWJlcihlbC52YWx1ZSkgOiBlbC52YWx1ZSxcbiAgICAgICAgdHJ1ZVxuICAgICAgKVxuICAgIH1cblxuICAgIC8vIGlmIHRoZSBkaXJlY3RpdmUgaGFzIGZpbHRlcnMsIHdlIG5lZWQgdG9cbiAgICAvLyByZWNvcmQgY3Vyc29yIHBvc2l0aW9uIGFuZCByZXN0b3JlIGl0IGFmdGVyIHVwZGF0aW5nXG4gICAgLy8gdGhlIGlucHV0IHdpdGggdGhlIGZpbHRlcmVkIHZhbHVlLlxuICAgIC8vIGFsc28gZm9yY2UgdXBkYXRlIGZvciB0eXBlPVwicmFuZ2VcIiBpbnB1dHMgdG8gZW5hYmxlXG4gICAgLy8gXCJsb2NrIGluIHJhbmdlXCIgKHNlZSAjNTA2KVxuICAgIHZhciBoYXNSZWFkRmlsdGVyID0gdGhpcy5maWx0ZXJzICYmIHRoaXMuZmlsdGVycy5yZWFkXG4gICAgdGhpcy5saXN0ZW5lciA9IGhhc1JlYWRGaWx0ZXIgfHwgZWwudHlwZSA9PT0gJ3JhbmdlJ1xuICAgICAgPyBmdW5jdGlvbiB0ZXh0SW5wdXRMaXN0ZW5lciAoKSB7XG4gICAgICAgICAgaWYgKGNwTG9ja2VkKSByZXR1cm5cbiAgICAgICAgICB2YXIgY2hhcnNPZmZzZXRcbiAgICAgICAgICAvLyBzb21lIEhUTUw1IGlucHV0IHR5cGVzIHRocm93IGVycm9yIGhlcmVcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gcmVjb3JkIGhvdyBtYW55IGNoYXJzIGZyb20gdGhlIGVuZCBvZiBpbnB1dFxuICAgICAgICAgICAgLy8gdGhlIGN1cnNvciB3YXMgYXRcbiAgICAgICAgICAgIGNoYXJzT2Zmc2V0ID0gZWwudmFsdWUubGVuZ3RoIC0gZWwuc2VsZWN0aW9uU3RhcnRcbiAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgIC8vIEZpeCBJRTEwLzExIGluZmluaXRlIHVwZGF0ZSBjeWNsZVxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS95eXg5OTA4MDMvdnVlL2lzc3Vlcy81OTJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICBpZiAoY2hhcnNPZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0KClcbiAgICAgICAgICBfLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGZvcmNlIGEgdmFsdWUgdXBkYXRlLCBiZWNhdXNlIGluXG4gICAgICAgICAgICAvLyBjZXJ0YWluIGNhc2VzIHRoZSB3cml0ZSBmaWx0ZXJzIG91dHB1dCB0aGVcbiAgICAgICAgICAgIC8vIHNhbWUgcmVzdWx0IGZvciBkaWZmZXJlbnQgaW5wdXQgdmFsdWVzLCBhbmRcbiAgICAgICAgICAgIC8vIHRoZSBPYnNlcnZlciBzZXQgZXZlbnRzIHdvbid0IGJlIHRyaWdnZXJlZC5cbiAgICAgICAgICAgIHZhciBuZXdWYWwgPSBzZWxmLl93YXRjaGVyLnZhbHVlXG4gICAgICAgICAgICBzZWxmLnVwZGF0ZShuZXdWYWwpXG4gICAgICAgICAgICBpZiAoY2hhcnNPZmZzZXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB2YXIgY3Vyc29yUG9zID1cbiAgICAgICAgICAgICAgICBfLnRvU3RyaW5nKG5ld1ZhbCkubGVuZ3RoIC0gY2hhcnNPZmZzZXRcbiAgICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgOiBmdW5jdGlvbiB0ZXh0SW5wdXRMaXN0ZW5lciAoKSB7XG4gICAgICAgICAgaWYgKGNwTG9ja2VkKSByZXR1cm5cbiAgICAgICAgICBzZXQoKVxuICAgICAgICB9XG5cbiAgICBpZiAoZGVib3VuY2UpIHtcbiAgICAgIHRoaXMubGlzdGVuZXIgPSBfLmRlYm91bmNlKHRoaXMubGlzdGVuZXIsIGRlYm91bmNlKVxuICAgIH1cbiAgICB0aGlzLmV2ZW50ID0gbGF6eSA/ICdjaGFuZ2UnIDogJ2lucHV0J1xuICAgIC8vIFN1cHBvcnQgalF1ZXJ5IGV2ZW50cywgc2luY2UgalF1ZXJ5LnRyaWdnZXIoKSBkb2Vzbid0XG4gICAgLy8gdHJpZ2dlciBuYXRpdmUgZXZlbnRzIGluIHNvbWUgY2FzZXMgYW5kIHNvbWUgcGx1Z2luc1xuICAgIC8vIHJlbHkgb24gJC50cmlnZ2VyKClcbiAgICAvLyBcbiAgICAvLyBXZSB3YW50IHRvIG1ha2Ugc3VyZSBpZiBhIGxpc3RlbmVyIGlzIGF0dGFjaGVkIHVzaW5nXG4gICAgLy8galF1ZXJ5LCBpdCBpcyBhbHNvIHJlbW92ZWQgd2l0aCBqUXVlcnksIHRoYXQncyB3aHlcbiAgICAvLyB3ZSBkbyB0aGUgY2hlY2sgZm9yIGVhY2ggZGlyZWN0aXZlIGluc3RhbmNlIGFuZFxuICAgIC8vIHN0b3JlIHRoYXQgY2hlY2sgcmVzdWx0IG9uIGl0c2VsZi4gVGhpcyBhbHNvIGFsbG93c1xuICAgIC8vIGVhc2llciB0ZXN0IGNvdmVyYWdlIGNvbnRyb2wgYnkgdW5zZXR0aW5nIHRoZSBnbG9iYWxcbiAgICAvLyBqUXVlcnkgdmFyaWFibGUgaW4gdGVzdHMuXG4gICAgdGhpcy5oYXNqUXVlcnkgPSB0eXBlb2YgalF1ZXJ5ID09PSAnZnVuY3Rpb24nXG4gICAgaWYgKHRoaXMuaGFzalF1ZXJ5KSB7XG4gICAgICBqUXVlcnkoZWwpLm9uKHRoaXMuZXZlbnQsIHRoaXMubGlzdGVuZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIF8ub24oZWwsIHRoaXMuZXZlbnQsIHRoaXMubGlzdGVuZXIpXG4gICAgfVxuXG4gICAgLy8gSUU5IGRvZXNuJ3QgZmlyZSBpbnB1dCBldmVudCBvbiBiYWNrc3BhY2UvZGVsL2N1dFxuICAgIGlmICghbGF6eSAmJiBfLmlzSUU5KSB7XG4gICAgICB0aGlzLm9uQ3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfLm5leHRUaWNrKHNlbGYubGlzdGVuZXIpXG4gICAgICB9XG4gICAgICB0aGlzLm9uRGVsID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gNDYgfHwgZS5rZXlDb2RlID09PSA4KSB7XG4gICAgICAgICAgc2VsZi5saXN0ZW5lcigpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF8ub24oZWwsICdjdXQnLCB0aGlzLm9uQ3V0KVxuICAgICAgXy5vbihlbCwgJ2tleXVwJywgdGhpcy5vbkRlbClcbiAgICB9XG5cbiAgICAvLyBzZXQgaW5pdGlhbCB2YWx1ZSBpZiBwcmVzZW50XG4gICAgaWYgKFxuICAgICAgZWwuaGFzQXR0cmlidXRlKCd2YWx1ZScpIHx8XG4gICAgICAoZWwudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJyAmJiBlbC52YWx1ZS50cmltKCkpXG4gICAgKSB7XG4gICAgICB0aGlzLl9pbml0VmFsdWUgPSBudW1iZXJcbiAgICAgICAgPyBfLnRvTnVtYmVyKGVsLnZhbHVlKVxuICAgICAgICA6IGVsLnZhbHVlXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5lbC52YWx1ZSA9IF8udG9TdHJpbmcodmFsdWUpXG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIGlmICh0aGlzLmhhc2pRdWVyeSkge1xuICAgICAgalF1ZXJ5KGVsKS5vZmYodGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9IGVsc2Uge1xuICAgICAgXy5vZmYoZWwsIHRoaXMuZXZlbnQsIHRoaXMubGlzdGVuZXIpXG4gICAgfVxuICAgIF8ub2ZmKGVsLCdjb21wb3NpdGlvbnN0YXJ0JywgdGhpcy5jcExvY2spXG4gICAgXy5vZmYoZWwsJ2NvbXBvc2l0aW9uZW5kJywgdGhpcy5jcFVubG9jaylcbiAgICBpZiAodGhpcy5vbkN1dCkge1xuICAgICAgXy5vZmYoZWwsJ2N1dCcsIHRoaXMub25DdXQpXG4gICAgICBfLm9mZihlbCwna2V5dXAnLCB0aGlzLm9uRGVsKVxuICAgIH1cbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcblxudmFyIGhhbmRsZXJzID0ge1xuICBfZGVmYXVsdDogcmVxdWlyZSgnLi9kZWZhdWx0JyksXG4gIHJhZGlvOiByZXF1aXJlKCcuL3JhZGlvJyksXG4gIHNlbGVjdDogcmVxdWlyZSgnLi9zZWxlY3QnKSxcbiAgY2hlY2tib3g6IHJlcXVpcmUoJy4vY2hlY2tib3gnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBwcmlvcml0eTogODAwLFxuICB0d29XYXk6IHRydWUsXG4gIGhhbmRsZXJzOiBoYW5kbGVycyxcblxuICAvKipcbiAgICogUG9zc2libGUgZWxlbWVudHM6XG4gICAqICAgPHNlbGVjdD5cbiAgICogICA8dGV4dGFyZWE+XG4gICAqICAgPGlucHV0IHR5cGU9XCIqXCI+XG4gICAqICAgICAtIHRleHRcbiAgICogICAgIC0gY2hlY2tib3hcbiAgICogICAgIC0gcmFkaW9cbiAgICogICAgIC0gbnVtYmVyXG4gICAqICAgICAtIFRPRE86IG1vcmUgdHlwZXMgbWF5IGJlIHN1cHBsaWVkIGFzIGEgcGx1Z2luXG4gICAqL1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBmcmllbmRseSB3YXJuaW5nLi4uXG4gICAgdmFyIGZpbHRlcnMgPSB0aGlzLmZpbHRlcnNcbiAgICBpZiAoZmlsdGVycyAmJiBmaWx0ZXJzLnJlYWQgJiYgIWZpbHRlcnMud3JpdGUpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0l0IHNlZW1zIHlvdSBhcmUgdXNpbmcgYSByZWFkLW9ubHkgZmlsdGVyIHdpdGggJyArXG4gICAgICAgICd2LW1vZGVsLiBZb3UgbWlnaHQgd2FudCB0byB1c2UgYSB0d28td2F5IGZpbHRlciAnICtcbiAgICAgICAgJ3RvIGVuc3VyZSBjb3JyZWN0IGJlaGF2aW9yLidcbiAgICAgIClcbiAgICB9XG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIHZhciB0YWcgPSBlbC50YWdOYW1lXG4gICAgdmFyIGhhbmRsZXJcbiAgICBpZiAodGFnID09PSAnSU5QVVQnKSB7XG4gICAgICBoYW5kbGVyID0gaGFuZGxlcnNbZWwudHlwZV0gfHwgaGFuZGxlcnMuX2RlZmF1bHRcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gJ1NFTEVDVCcpIHtcbiAgICAgIGhhbmRsZXIgPSBoYW5kbGVycy5zZWxlY3RcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgaGFuZGxlciA9IGhhbmRsZXJzLl9kZWZhdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIF8ud2FybihcInYtbW9kZWwgZG9lc24ndCBzdXBwb3J0IGVsZW1lbnQgdHlwZTogXCIgKyB0YWcpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaGFuZGxlci5iaW5kLmNhbGwodGhpcylcbiAgICB0aGlzLnVwZGF0ZSA9IGhhbmRsZXIudXBkYXRlXG4gICAgdGhpcy51bmJpbmQgPSBoYW5kbGVyLnVuYmluZFxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIHRoaXMubGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnNldChlbC52YWx1ZSwgdHJ1ZSlcbiAgICB9XG4gICAgXy5vbihlbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gICAgaWYgKGVsLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2luaXRWYWx1ZSA9IGVsLnZhbHVlXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICB0aGlzLmVsLmNoZWNrZWQgPSB2YWx1ZSA9PSB0aGlzLmVsLnZhbHVlXG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgXy5vZmYodGhpcy5lbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4uLy4uL3dhdGNoZXInKVxudmFyIGRpclBhcnNlciA9IHJlcXVpcmUoJy4uLy4uL3BhcnNlcnMvZGlyZWN0aXZlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICAvLyBjaGVjayBvcHRpb25zIHBhcmFtXG4gICAgdmFyIG9wdGlvbnNQYXJhbSA9IHRoaXMuX2NoZWNrUGFyYW0oJ29wdGlvbnMnKVxuICAgIGlmIChvcHRpb25zUGFyYW0pIHtcbiAgICAgIGluaXRPcHRpb25zLmNhbGwodGhpcywgb3B0aW9uc1BhcmFtKVxuICAgIH1cbiAgICB0aGlzLm51bWJlciA9IHRoaXMuX2NoZWNrUGFyYW0oJ251bWJlcicpICE9IG51bGxcbiAgICB0aGlzLm11bHRpcGxlID0gZWwuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpXG4gICAgdGhpcy5saXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHNlbGYubXVsdGlwbGVcbiAgICAgICAgPyBnZXRNdWx0aVZhbHVlKGVsKVxuICAgICAgICA6IGVsLnZhbHVlXG4gICAgICB2YWx1ZSA9IHNlbGYubnVtYmVyXG4gICAgICAgID8gXy5pc0FycmF5KHZhbHVlKVxuICAgICAgICAgID8gdmFsdWUubWFwKF8udG9OdW1iZXIpXG4gICAgICAgICAgOiBfLnRvTnVtYmVyKHZhbHVlKVxuICAgICAgICA6IHZhbHVlXG4gICAgICBzZWxmLnNldCh2YWx1ZSwgdHJ1ZSlcbiAgICB9XG4gICAgXy5vbihlbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gICAgY2hlY2tJbml0aWFsVmFsdWUuY2FsbCh0aGlzKVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgZWwuc2VsZWN0ZWRJbmRleCA9IC0xXG4gICAgdmFyIG11bHRpID0gdGhpcy5tdWx0aXBsZSAmJiBfLmlzQXJyYXkodmFsdWUpXG4gICAgdmFyIG9wdGlvbnMgPSBlbC5vcHRpb25zXG4gICAgdmFyIGkgPSBvcHRpb25zLmxlbmd0aFxuICAgIHZhciBvcHRpb25cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBvcHRpb24gPSBvcHRpb25zW2ldXG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSBtdWx0aVxuICAgICAgICA/IGluZGV4T2YodmFsdWUsIG9wdGlvbi52YWx1ZSkgPiAtMVxuICAgICAgICA6IHZhbHVlID09IG9wdGlvbi52YWx1ZVxuICAgIH1cbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBfLm9mZih0aGlzLmVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgICBpZiAodGhpcy5vcHRpb25XYXRjaGVyKSB7XG4gICAgICB0aGlzLm9wdGlvbldhdGNoZXIudGVhcmRvd24oKVxuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgb3B0aW9uIGxpc3QgZnJvbSB0aGUgcGFyYW0uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cHJlc3Npb25cbiAqL1xuXG5mdW5jdGlvbiBpbml0T3B0aW9ucyAoZXhwcmVzc2lvbikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIGRlc2NyaXB0b3IgPSBkaXJQYXJzZXIucGFyc2UoZXhwcmVzc2lvbilbMF1cbiAgZnVuY3Rpb24gb3B0aW9uVXBkYXRlV2F0Y2hlciAodmFsdWUpIHtcbiAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgc2VsZi5lbC5pbm5lckhUTUwgPSAnJ1xuICAgICAgYnVpbGRPcHRpb25zKHNlbGYuZWwsIHZhbHVlKVxuICAgICAgaWYgKHNlbGYuX3dhdGNoZXIpIHtcbiAgICAgICAgc2VsZi51cGRhdGUoc2VsZi5fd2F0Y2hlci52YWx1ZSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgXy53YXJuKCdJbnZhbGlkIG9wdGlvbnMgdmFsdWUgZm9yIHYtbW9kZWw6ICcgKyB2YWx1ZSlcbiAgICB9XG4gIH1cbiAgdGhpcy5vcHRpb25XYXRjaGVyID0gbmV3IFdhdGNoZXIoXG4gICAgdGhpcy52bSxcbiAgICBkZXNjcmlwdG9yLmV4cHJlc3Npb24sXG4gICAgb3B0aW9uVXBkYXRlV2F0Y2hlcixcbiAgICB7XG4gICAgICBkZWVwOiB0cnVlLFxuICAgICAgZmlsdGVyczogXy5yZXNvbHZlRmlsdGVycyh0aGlzLnZtLCBkZXNjcmlwdG9yLmZpbHRlcnMpXG4gICAgfVxuICApXG4gIC8vIHVwZGF0ZSB3aXRoIGluaXRpYWwgdmFsdWVcbiAgb3B0aW9uVXBkYXRlV2F0Y2hlcih0aGlzLm9wdGlvbldhdGNoZXIudmFsdWUpXG59XG5cbi8qKlxuICogQnVpbGQgdXAgb3B0aW9uIGVsZW1lbnRzLiBJRTkgZG9lc24ndCBjcmVhdGUgb3B0aW9uc1xuICogd2hlbiBzZXR0aW5nIGlubmVySFRNTCBvbiA8c2VsZWN0PiBlbGVtZW50cywgc28gd2UgaGF2ZVxuICogdG8gdXNlIERPTSBBUEkgaGVyZS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBhcmVudCAtIGEgPHNlbGVjdD4gb3IgYW4gPG9wdGdyb3VwPlxuICogQHBhcmFtIHtBcnJheX0gb3B0aW9uc1xuICovXG5cbmZ1bmN0aW9uIGJ1aWxkT3B0aW9ucyAocGFyZW50LCBvcHRpb25zKSB7XG4gIHZhciBvcCwgZWxcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvcHRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIG9wID0gb3B0aW9uc1tpXVxuICAgIGlmICghb3Aub3B0aW9ucykge1xuICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKVxuICAgICAgaWYgKHR5cGVvZiBvcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZWwudGV4dCA9IGVsLnZhbHVlID0gb3BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLnRleHQgPSBvcC50ZXh0XG4gICAgICAgIGVsLnZhbHVlID0gb3AudmFsdWVcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRncm91cCcpXG4gICAgICBlbC5sYWJlbCA9IG9wLmxhYmVsXG4gICAgICBidWlsZE9wdGlvbnMoZWwsIG9wLm9wdGlvbnMpXG4gICAgfVxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChlbClcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIHRoZSBpbml0aWFsIHZhbHVlIGZvciBzZWxlY3RlZCBvcHRpb25zLlxuICovXG5cbmZ1bmN0aW9uIGNoZWNrSW5pdGlhbFZhbHVlICgpIHtcbiAgdmFyIGluaXRWYWx1ZVxuICB2YXIgb3B0aW9ucyA9IHRoaXMuZWwub3B0aW9uc1xuICBmb3IgKHZhciBpID0gMCwgbCA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKG9wdGlvbnNbaV0uaGFzQXR0cmlidXRlKCdzZWxlY3RlZCcpKSB7XG4gICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAoaW5pdFZhbHVlIHx8IChpbml0VmFsdWUgPSBbXSkpXG4gICAgICAgICAgLnB1c2gob3B0aW9uc1tpXS52YWx1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRWYWx1ZSA9IG9wdGlvbnNbaV0udmFsdWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHR5cGVvZiBpbml0VmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdGhpcy5faW5pdFZhbHVlID0gdGhpcy5udW1iZXJcbiAgICAgID8gXy50b051bWJlcihpbml0VmFsdWUpXG4gICAgICA6IGluaXRWYWx1ZVxuICB9XG59XG5cbi8qKlxuICogSGVscGVyIHRvIGV4dHJhY3QgYSB2YWx1ZSBhcnJheSBmb3Igc2VsZWN0W211bHRpcGxlXVxuICpcbiAqIEBwYXJhbSB7U2VsZWN0RWxlbWVudH0gZWxcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIGdldE11bHRpVmFsdWUgKGVsKSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyXG4gICAgLmNhbGwoZWwub3B0aW9ucywgZmlsdGVyU2VsZWN0ZWQpXG4gICAgLm1hcChnZXRPcHRpb25WYWx1ZSlcbn1cblxuZnVuY3Rpb24gZmlsdGVyU2VsZWN0ZWQgKG9wKSB7XG4gIHJldHVybiBvcC5zZWxlY3RlZFxufVxuXG5mdW5jdGlvbiBnZXRPcHRpb25WYWx1ZSAob3ApIHtcbiAgcmV0dXJuIG9wLnZhbHVlIHx8IG9wLnRleHRcbn1cblxuLyoqXG4gKiBOYXRpdmUgQXJyYXkuaW5kZXhPZiB1c2VzIHN0cmljdCBlcXVhbCwgYnV0IGluIHRoaXNcbiAqIGNhc2Ugd2UgbmVlZCB0byBtYXRjaCBzdHJpbmcvbnVtYmVycyB3aXRoIHNvZnQgZXF1YWwuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyXG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbmZ1bmN0aW9uIGluZGV4T2YgKGFyciwgdmFsKSB7XG4gIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gIHZhciBpID0gYXJyLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWYgKGFycltpXSA9PSB2YWwpIHJldHVybiBpXG4gIH1cbiAgcmV0dXJuIC0xXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYWNjZXB0U3RhdGVtZW50OiB0cnVlLFxuICBwcmlvcml0eTogNzAwLFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBkZWFsIHdpdGggaWZyYW1lc1xuICAgIGlmIChcbiAgICAgIHRoaXMuZWwudGFnTmFtZSA9PT0gJ0lGUkFNRScgJiZcbiAgICAgIHRoaXMuYXJnICE9PSAnbG9hZCdcbiAgICApIHtcbiAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgdGhpcy5pZnJhbWVCaW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfLm9uKHNlbGYuZWwuY29udGVudFdpbmRvdywgc2VsZi5hcmcsIHNlbGYuaGFuZGxlcilcbiAgICAgIH1cbiAgICAgIF8ub24odGhpcy5lbCwgJ2xvYWQnLCB0aGlzLmlmcmFtZUJpbmQpXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0RpcmVjdGl2ZSBcInYtb246JyArIHRoaXMuZXhwcmVzc2lvbiArICdcIiAnICtcbiAgICAgICAgJ2V4cGVjdHMgYSBmdW5jdGlvbiB2YWx1ZS4nXG4gICAgICApXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5yZXNldCgpXG4gICAgdmFyIHZtID0gdGhpcy52bVxuICAgIHRoaXMuaGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnRhcmdldFZNID0gdm1cbiAgICAgIHZtLiRldmVudCA9IGVcbiAgICAgIHZhciByZXMgPSBoYW5kbGVyKGUpXG4gICAgICB2bS4kZXZlbnQgPSBudWxsXG4gICAgICByZXR1cm4gcmVzXG4gICAgfVxuICAgIGlmICh0aGlzLmlmcmFtZUJpbmQpIHtcbiAgICAgIHRoaXMuaWZyYW1lQmluZCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIF8ub24odGhpcy5lbCwgdGhpcy5hcmcsIHRoaXMuaGFuZGxlcilcbiAgICB9XG4gIH0sXG5cbiAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmlmcmFtZUJpbmRcbiAgICAgID8gdGhpcy5lbC5jb250ZW50V2luZG93XG4gICAgICA6IHRoaXMuZWxcbiAgICBpZiAodGhpcy5oYW5kbGVyKSB7XG4gICAgICBfLm9mZihlbCwgdGhpcy5hcmcsIHRoaXMuaGFuZGxlcilcbiAgICB9XG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZXNldCgpXG4gICAgXy5vZmYodGhpcy5lbCwgJ2xvYWQnLCB0aGlzLmlmcmFtZUJpbmQpXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG52YXIgdklmID0gcmVxdWlyZSgnLi9pZicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICAvLyBzYW1lIGxvZ2ljIHJldXNlIGZyb20gdi1pZlxuICBjb21waWxlOiB2SWYuY29tcGlsZSxcbiAgdGVhcmRvd246IHZJZi50ZWFyZG93bixcbiAgdW5iaW5kOiB2SWYudW5iaW5kLFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy5zdGFydCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtcGFydGlhbC1zdGFydCcpXG4gICAgdGhpcy5lbmQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXBhcnRpYWwtZW5kJylcbiAgICBpZiAoZWwubm9kZVR5cGUgIT09IDgpIHtcbiAgICAgIGVsLmlubmVySFRNTCA9ICcnXG4gICAgfVxuICAgIGlmIChlbC50YWdOYW1lID09PSAnVEVNUExBVEUnIHx8IGVsLm5vZGVUeXBlID09PSA4KSB7XG4gICAgICBfLnJlcGxhY2UoZWwsIHRoaXMuZW5kKVxuICAgIH0gZWxzZSB7XG4gICAgICBlbC5hcHBlbmRDaGlsZCh0aGlzLmVuZClcbiAgICB9XG4gICAgXy5iZWZvcmUodGhpcy5zdGFydCwgdGhpcy5lbmQpXG4gICAgaWYgKCF0aGlzLl9pc0R5bmFtaWNMaXRlcmFsKSB7XG4gICAgICB0aGlzLmluc2VydCh0aGlzLmV4cHJlc3Npb24pXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgdGhpcy50ZWFyZG93bigpXG4gICAgdGhpcy5pbnNlcnQoaWQpXG4gIH0sXG5cbiAgaW5zZXJ0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgcGFydGlhbCA9IHRoaXMudm0uJG9wdGlvbnMucGFydGlhbHNbaWRdXG4gICAgXy5hc3NlcnRBc3NldChwYXJ0aWFsLCAncGFydGlhbCcsIGlkKVxuICAgIGlmIChwYXJ0aWFsKSB7XG4gICAgICB0aGlzLmNvbXBpbGUodGVtcGxhdGVQYXJzZXIucGFyc2UocGFydGlhbCwgdHJ1ZSkpXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXMuZWwuX192dWVfX1xuICAgIGlmICghdm0pIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3YtcmVmIHNob3VsZCBvbmx5IGJlIHVzZWQgb24gYSBjb21wb25lbnQgcm9vdCBlbGVtZW50LidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyBJZiB3ZSBnZXQgaGVyZSwgaXQgbWVhbnMgdGhpcyBpcyBhIGB2LXJlZmAgb24gYVxuICAgIC8vIGNoaWxkLCBiZWNhdXNlIHBhcmVudCBzY29wZSBgdi1yZWZgIGlzIHN0cmlwcGVkIGluXG4gICAgLy8gYHYtY29tcG9uZW50YCBhbHJlYWR5LiBTbyB3ZSBqdXN0IHJlY29yZCBvdXIgb3duIHJlZlxuICAgIC8vIGhlcmUgLSBpdCB3aWxsIG92ZXJ3cml0ZSBwYXJlbnQgcmVmIGluIGB2LWNvbXBvbmVudGAsXG4gICAgLy8gaWYgYW55LlxuICAgIHZtLl9yZWZJRCA9IHRoaXMuZXhwcmVzc2lvblxuICB9XG4gIFxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgaXNPYmplY3QgPSBfLmlzT2JqZWN0XG52YXIgaXNQbGFpbk9iamVjdCA9IF8uaXNQbGFpbk9iamVjdFxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZXhwcmVzc2lvbicpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG52YXIgdHJhbnNjbHVkZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL3RyYW5zY2x1ZGUnKVxudmFyIG1lcmdlT3B0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWwvbWVyZ2Utb3B0aW9uJylcbnZhciB1aWQgPSAwXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBTZXR1cC5cbiAgICovXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIHVpZCBhcyBhIGNhY2hlIGlkZW50aWZpZXJcbiAgICB0aGlzLmlkID0gJ19fdl9yZXBlYXRfJyArICgrK3VpZClcbiAgICAvLyB3ZSBuZWVkIHRvIGluc2VydCB0aGUgb2JqVG9BcnJheSBjb252ZXJ0ZXJcbiAgICAvLyBhcyB0aGUgZmlyc3QgcmVhZCBmaWx0ZXIsIGJlY2F1c2UgaXQgaGFzIHRvIGJlIGludm9rZWRcbiAgICAvLyBiZWZvcmUgYW55IHVzZXIgZmlsdGVycy4gKGNhbid0IGRvIGl0IGluIGB1cGRhdGVgKVxuICAgIGlmICghdGhpcy5maWx0ZXJzKSB7XG4gICAgICB0aGlzLmZpbHRlcnMgPSB7fVxuICAgIH1cbiAgICAvLyBhZGQgdGhlIG9iamVjdCAtPiBhcnJheSBjb252ZXJ0IGZpbHRlclxuICAgIHZhciBvYmplY3RDb252ZXJ0ZXIgPSBfLmJpbmQob2JqVG9BcnJheSwgdGhpcylcbiAgICBpZiAoIXRoaXMuZmlsdGVycy5yZWFkKSB7XG4gICAgICB0aGlzLmZpbHRlcnMucmVhZCA9IFtvYmplY3RDb252ZXJ0ZXJdXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsdGVycy5yZWFkLnVuc2hpZnQob2JqZWN0Q29udmVydGVyKVxuICAgIH1cbiAgICAvLyBzZXR1cCByZWYgbm9kZVxuICAgIHRoaXMucmVmID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1yZXBlYXQnKVxuICAgIF8ucmVwbGFjZSh0aGlzLmVsLCB0aGlzLnJlZilcbiAgICAvLyBjaGVjayBpZiB0aGlzIGlzIGEgYmxvY2sgcmVwZWF0XG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZWwudGFnTmFtZSA9PT0gJ1RFTVBMQVRFJ1xuICAgICAgPyB0ZW1wbGF0ZVBhcnNlci5wYXJzZSh0aGlzLmVsLCB0cnVlKVxuICAgICAgOiB0aGlzLmVsXG4gICAgLy8gY2hlY2sgb3RoZXIgZGlyZWN0aXZlcyB0aGF0IG5lZWQgdG8gYmUgaGFuZGxlZFxuICAgIC8vIGF0IHYtcmVwZWF0IGxldmVsXG4gICAgdGhpcy5jaGVja0lmKClcbiAgICB0aGlzLmNoZWNrUmVmKClcbiAgICB0aGlzLmNoZWNrQ29tcG9uZW50KClcbiAgICAvLyBjaGVjayBmb3IgdHJhY2tieSBwYXJhbVxuICAgIHRoaXMuaWRLZXkgPVxuICAgICAgdGhpcy5fY2hlY2tQYXJhbSgndHJhY2stYnknKSB8fFxuICAgICAgdGhpcy5fY2hlY2tQYXJhbSgndHJhY2tieScpIC8vIDAuMTEuMCBjb21wYXRcbiAgICB0aGlzLmNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICB9LFxuXG4gIC8qKlxuICAgKiBXYXJuIGFnYWluc3Qgdi1pZiB1c2FnZS5cbiAgICovXG5cbiAgY2hlY2tJZjogZnVuY3Rpb24gKCkge1xuICAgIGlmIChfLmF0dHIodGhpcy5lbCwgJ2lmJykgIT09IG51bGwpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0RvblxcJ3QgdXNlIHYtaWYgd2l0aCB2LXJlcGVhdC4gJyArXG4gICAgICAgICdVc2Ugdi1zaG93IG9yIHRoZSBcImZpbHRlckJ5XCIgZmlsdGVyIGluc3RlYWQuJ1xuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgaWYgdi1yZWYvIHYtZWwgaXMgYWxzbyBwcmVzZW50LlxuICAgKi9cblxuICBjaGVja1JlZjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZWZJRCA9IF8uYXR0cih0aGlzLmVsLCAncmVmJylcbiAgICB0aGlzLnJlZklEID0gcmVmSURcbiAgICAgID8gdGhpcy52bS4kaW50ZXJwb2xhdGUocmVmSUQpXG4gICAgICA6IG51bGxcbiAgICB2YXIgZWxJZCA9IF8uYXR0cih0aGlzLmVsLCAnZWwnKVxuICAgIHRoaXMuZWxJZCA9IGVsSWRcbiAgICAgID8gdGhpcy52bS4kaW50ZXJwb2xhdGUoZWxJZClcbiAgICAgIDogbnVsbFxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgY29tcG9uZW50IGNvbnN0cnVjdG9yIHRvIHVzZSBmb3IgcmVwZWF0ZWRcbiAgICogaW5zdGFuY2VzLiBJZiBzdGF0aWMgd2UgcmVzb2x2ZSBpdCBub3csIG90aGVyd2lzZSBpdFxuICAgKiBuZWVkcyB0byBiZSByZXNvbHZlZCBhdCBidWlsZCB0aW1lIHdpdGggYWN0dWFsIGRhdGEuXG4gICAqL1xuXG4gIGNoZWNrQ29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlkID0gXy5hdHRyKHRoaXMuZWwsICdjb21wb25lbnQnKVxuICAgIHZhciBvcHRpb25zID0gdGhpcy52bS4kb3B0aW9uc1xuICAgIGlmICghaWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgY29uc3RydWN0b3JcbiAgICAgIHRoaXMuQ3RvciA9IF8uVnVlXG4gICAgICAvLyBpbmxpbmUgcmVwZWF0cyBzaG91bGQgaW5oZXJpdFxuICAgICAgdGhpcy5pbmhlcml0ID0gdHJ1ZVxuICAgICAgLy8gaW1wb3J0YW50OiB0cmFuc2NsdWRlIHdpdGggbm8gb3B0aW9ucywganVzdFxuICAgICAgLy8gdG8gZW5zdXJlIGJsb2NrIHN0YXJ0IGFuZCBibG9jayBlbmRcbiAgICAgIHRoaXMudGVtcGxhdGUgPSB0cmFuc2NsdWRlKHRoaXMudGVtcGxhdGUpXG4gICAgICB0aGlzLl9saW5rRm4gPSBjb21waWxlKHRoaXMudGVtcGxhdGUsIG9wdGlvbnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXNDb21wb25lbnQgPSB0cnVlXG4gICAgICAvLyBjaGVjayBpbmxpbmUtdGVtcGxhdGVcbiAgICAgIGlmICh0aGlzLl9jaGVja1BhcmFtKCdpbmxpbmUtdGVtcGxhdGUnKSAhPT0gbnVsbCkge1xuICAgICAgICAvLyBleHRyYWN0IGlubGluZSB0ZW1wbGF0ZSBhcyBhIERvY3VtZW50RnJhZ21lbnRcbiAgICAgICAgdGhpcy5pbmxpbmVUZW1wYWx0ZSA9IF8uZXh0cmFjdENvbnRlbnQodGhpcy5lbCwgdHJ1ZSlcbiAgICAgIH1cbiAgICAgIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKGlkKVxuICAgICAgaWYgKCF0b2tlbnMpIHsgLy8gc3RhdGljIGNvbXBvbmVudFxuICAgICAgICB2YXIgQ3RvciA9IHRoaXMuQ3RvciA9IG9wdGlvbnMuY29tcG9uZW50c1tpZF1cbiAgICAgICAgXy5hc3NlcnRBc3NldChDdG9yLCAnY29tcG9uZW50JywgaWQpXG4gICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gcGFyZW50IHNjb3BlIGRpcmVjdGl2ZXMgYW5kIG5vXG4gICAgICAgIC8vIGNvbnRlbnQgdG8gYmUgdHJhbnNjbHVkZWQsIHdlIGNhbiBvcHRpbWl6ZSB0aGVcbiAgICAgICAgLy8gcmVuZGVyaW5nIGJ5IHByZS10cmFuc2NsdWRpbmcgKyBjb21waWxpbmcgaGVyZVxuICAgICAgICAvLyBhbmQgcHJvdmlkZSBhIGxpbmsgZnVuY3Rpb24gdG8gZXZlcnkgaW5zdGFuY2UuXG4gICAgICAgIGlmICghdGhpcy5lbC5oYXNDaGlsZE5vZGVzKCkgJiZcbiAgICAgICAgICAgICF0aGlzLmVsLmhhc0F0dHJpYnV0ZXMoKSkge1xuICAgICAgICAgIC8vIG1lcmdlIGFuIGVtcHR5IG9iamVjdCB3aXRoIG93bmVyIHZtIGFzIHBhcmVudFxuICAgICAgICAgIC8vIHNvIGNoaWxkIHZtcyBjYW4gYWNjZXNzIHBhcmVudCBhc3NldHMuXG4gICAgICAgICAgdmFyIG1lcmdlZCA9IG1lcmdlT3B0aW9ucyhDdG9yLm9wdGlvbnMsIHt9LCB7XG4gICAgICAgICAgICAkcGFyZW50OiB0aGlzLnZtXG4gICAgICAgICAgfSlcbiAgICAgICAgICBtZXJnZWQudGVtcGxhdGUgPSB0aGlzLmlubGluZVRlbXBhbHRlIHx8IG1lcmdlZC50ZW1wbGF0ZVxuICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSB0cmFuc2NsdWRlKHRoaXMudGVtcGxhdGUsIG1lcmdlZClcbiAgICAgICAgICB0aGlzLl9saW5rRm4gPSBjb21waWxlKHRoaXMudGVtcGxhdGUsIG1lcmdlZCwgZmFsc2UsIHRydWUpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRvIGJlIHJlc29sdmVkIGxhdGVyXG4gICAgICAgIHZhciBjdG9yRXhwID0gdGV4dFBhcnNlci50b2tlbnNUb0V4cCh0b2tlbnMpXG4gICAgICAgIHRoaXMuY3RvckdldHRlciA9IGV4cFBhcnNlci5wYXJzZShjdG9yRXhwKS5nZXRcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZS5cbiAgICogVGhpcyBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIEFycmF5IG11dGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl8TnVtYmVyfFN0cmluZ30gZGF0YVxuICAgKi9cblxuICB1cGRhdGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgW11cbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBkYXRhXG4gICAgaWYgKHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICBkYXRhID0gcmFuZ2UoZGF0YSlcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBkYXRhID0gXy50b0FycmF5KGRhdGEpXG4gICAgfVxuICAgIHRoaXMudm1zID0gdGhpcy5kaWZmKGRhdGEsIHRoaXMudm1zKVxuICAgIC8vIHVwZGF0ZSB2LXJlZlxuICAgIGlmICh0aGlzLnJlZklEKSB7XG4gICAgICB0aGlzLnZtLiRbdGhpcy5yZWZJRF0gPSB0aGlzLnZtc1xuICAgIH1cbiAgICBpZiAodGhpcy5lbElkKSB7XG4gICAgICB0aGlzLnZtLiQkW3RoaXMuZWxJZF0gPSB0aGlzLnZtcy5tYXAoZnVuY3Rpb24gKHZtKSB7XG4gICAgICAgIHJldHVybiB2bS4kZWxcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBEaWZmLCBiYXNlZCBvbiBuZXcgZGF0YSBhbmQgb2xkIGRhdGEsIGRldGVybWluZSB0aGVcbiAgICogbWluaW11bSBhbW91bnQgb2YgRE9NIG1hbmlwdWxhdGlvbnMgbmVlZGVkIHRvIG1ha2UgdGhlXG4gICAqIERPTSByZWZsZWN0IHRoZSBuZXcgZGF0YSBBcnJheS5cbiAgICpcbiAgICogVGhlIGFsZ29yaXRobSBkaWZmcyB0aGUgbmV3IGRhdGEgQXJyYXkgYnkgc3RvcmluZyBhXG4gICAqIGhpZGRlbiByZWZlcmVuY2UgdG8gYW4gb3duZXIgdm0gaW5zdGFuY2Ugb24gcHJldmlvdXNseVxuICAgKiBzZWVuIGRhdGEuIFRoaXMgYWxsb3dzIHVzIHRvIGFjaGlldmUgTyhuKSB3aGljaCBpc1xuICAgKiBiZXR0ZXIgdGhhbiBhIGxldmVuc2h0ZWluIGRpc3RhbmNlIGJhc2VkIGFsZ29yaXRobSxcbiAgICogd2hpY2ggaXMgTyhtICogbikuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IGRhdGFcbiAgICogQHBhcmFtIHtBcnJheX0gb2xkVm1zXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cblxuICBkaWZmOiBmdW5jdGlvbiAoZGF0YSwgb2xkVm1zKSB7XG4gICAgdmFyIGlkS2V5ID0gdGhpcy5pZEtleVxuICAgIHZhciBjb252ZXJ0ZWQgPSB0aGlzLmNvbnZlcnRlZFxuICAgIHZhciByZWYgPSB0aGlzLnJlZlxuICAgIHZhciBhbGlhcyA9IHRoaXMuYXJnXG4gICAgdmFyIGluaXQgPSAhb2xkVm1zXG4gICAgdmFyIHZtcyA9IG5ldyBBcnJheShkYXRhLmxlbmd0aClcbiAgICB2YXIgb2JqLCByYXcsIHZtLCBpLCBsXG4gICAgLy8gRmlyc3QgcGFzcywgZ28gdGhyb3VnaCB0aGUgbmV3IEFycmF5IGFuZCBmaWxsIHVwXG4gICAgLy8gdGhlIG5ldyB2bXMgYXJyYXkuIElmIGEgcGllY2Ugb2YgZGF0YSBoYXMgYSBjYWNoZWRcbiAgICAvLyBpbnN0YW5jZSBmb3IgaXQsIHdlIHJldXNlIGl0LiBPdGhlcndpc2UgYnVpbGQgYSBuZXdcbiAgICAvLyBpbnN0YW5jZS5cbiAgICBmb3IgKGkgPSAwLCBsID0gZGF0YS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIG9iaiA9IGRhdGFbaV1cbiAgICAgIHJhdyA9IGNvbnZlcnRlZCA/IG9iai4kdmFsdWUgOiBvYmpcbiAgICAgIHZtID0gIWluaXQgJiYgdGhpcy5nZXRWbShyYXcpXG4gICAgICBpZiAodm0pIHsgLy8gcmV1c2FibGUgaW5zdGFuY2VcbiAgICAgICAgdm0uX3JldXNlZCA9IHRydWVcbiAgICAgICAgdm0uJGluZGV4ID0gaSAvLyB1cGRhdGUgJGluZGV4XG4gICAgICAgIGlmIChjb252ZXJ0ZWQpIHtcbiAgICAgICAgICB2bS4ka2V5ID0gb2JqLiRrZXkgLy8gdXBkYXRlICRrZXlcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWRLZXkpIHsgLy8gc3dhcCB0cmFjayBieSBpZCBkYXRhXG4gICAgICAgICAgaWYgKGFsaWFzKSB7XG4gICAgICAgICAgICB2bVthbGlhc10gPSByYXdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0uX3NldERhdGEocmF3KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gbmV3IGluc3RhbmNlXG4gICAgICAgIHZtID0gdGhpcy5idWlsZChvYmosIGksIHRydWUpXG4gICAgICAgIHZtLl9uZXcgPSB0cnVlXG4gICAgICAgIHZtLl9yZXVzZWQgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdm1zW2ldID0gdm1cbiAgICAgIC8vIGluc2VydCBpZiB0aGlzIGlzIGZpcnN0IHJ1blxuICAgICAgaWYgKGluaXQpIHtcbiAgICAgICAgdm0uJGJlZm9yZShyZWYpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHRoaXMgaXMgdGhlIGZpcnN0IHJ1biwgd2UncmUgZG9uZS5cbiAgICBpZiAoaW5pdCkge1xuICAgICAgcmV0dXJuIHZtc1xuICAgIH1cbiAgICAvLyBTZWNvbmQgcGFzcywgZ28gdGhyb3VnaCB0aGUgb2xkIHZtIGluc3RhbmNlcyBhbmRcbiAgICAvLyBkZXN0cm95IHRob3NlIHdobyBhcmUgbm90IHJldXNlZCAoYW5kIHJlbW92ZSB0aGVtXG4gICAgLy8gZnJvbSBjYWNoZSlcbiAgICBmb3IgKGkgPSAwLCBsID0gb2xkVm1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdm0gPSBvbGRWbXNbaV1cbiAgICAgIGlmICghdm0uX3JldXNlZCkge1xuICAgICAgICB0aGlzLnVuY2FjaGVWbSh2bSlcbiAgICAgICAgdm0uJGRlc3Ryb3kodHJ1ZSlcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZmluYWwgcGFzcywgbW92ZS9pbnNlcnQgbmV3IGluc3RhbmNlcyBpbnRvIHRoZVxuICAgIC8vIHJpZ2h0IHBsYWNlLiBXZSdyZSBnb2luZyBpbiByZXZlcnNlIGhlcmUgYmVjYXVzZVxuICAgIC8vIGluc2VydEJlZm9yZSByZWxpZXMgb24gdGhlIG5leHQgc2libGluZyB0byBiZVxuICAgIC8vIHJlc29sdmVkLlxuICAgIHZhciB0YXJnZXROZXh0LCBjdXJyZW50TmV4dFxuICAgIGkgPSB2bXMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdm0gPSB2bXNbaV1cbiAgICAgIC8vIHRoaXMgaXMgdGhlIHZtIHRoYXQgd2Ugc2hvdWxkIGJlIGluIGZyb250IG9mXG4gICAgICB0YXJnZXROZXh0ID0gdm1zW2kgKyAxXVxuICAgICAgaWYgKCF0YXJnZXROZXh0KSB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGxhc3QgaXRlbS4gSWYgaXQncyByZXVzZWQgdGhlblxuICAgICAgICAvLyBldmVyeXRoaW5nIGVsc2Ugd2lsbCBldmVudHVhbGx5IGJlIGluIHRoZSByaWdodFxuICAgICAgICAvLyBwbGFjZSwgc28gbm8gbmVlZCB0byB0b3VjaCBpdC4gT3RoZXJ3aXNlLCBpbnNlcnRcbiAgICAgICAgLy8gaXQuXG4gICAgICAgIGlmICghdm0uX3JldXNlZCkge1xuICAgICAgICAgIHZtLiRiZWZvcmUocmVmKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBtYWtlIHN1cmUgdG8gaW5zZXJ0IGJlZm9yZSB0aGUgY29tbWVudCBub2RlIGlmXG4gICAgICAgIC8vIHRoZSB2bXMgYXJlIGJsb2NrIGluc3RhbmNlc1xuICAgICAgICB2YXIgbmV4dEVsID0gdGFyZ2V0TmV4dC5fYmxvY2tTdGFydCB8fCB0YXJnZXROZXh0LiRlbFxuICAgICAgICBpZiAodm0uX3JldXNlZCkge1xuICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHZtIHdlIGFyZSBhY3R1YWxseSBpbiBmcm9udCBvZlxuICAgICAgICAgIGN1cnJlbnROZXh0ID0gZmluZE5leHRWbSh2bSwgcmVmKVxuICAgICAgICAgIC8vIHdlIG9ubHkgbmVlZCB0byBtb3ZlIGlmIHdlIGFyZSBub3QgaW4gdGhlIHJpZ2h0XG4gICAgICAgICAgLy8gcGxhY2UgYWxyZWFkeS5cbiAgICAgICAgICBpZiAoY3VycmVudE5leHQgIT09IHRhcmdldE5leHQpIHtcbiAgICAgICAgICAgIHZtLiRiZWZvcmUobmV4dEVsLCBudWxsLCBmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbmV3IGluc3RhbmNlLCBpbnNlcnQgdG8gZXhpc3RpbmcgbmV4dFxuICAgICAgICAgIHZtLiRiZWZvcmUobmV4dEVsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2bS5fbmV3ID0gZmFsc2VcbiAgICAgIHZtLl9yZXVzZWQgPSBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdm1zXG4gIH0sXG5cbiAgLyoqXG4gICAqIEJ1aWxkIGEgbmV3IGluc3RhbmNlIGFuZCBjYWNoZSBpdC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gbmVlZENhY2hlXG4gICAqL1xuXG4gIGJ1aWxkOiBmdW5jdGlvbiAoZGF0YSwgaW5kZXgsIG5lZWRDYWNoZSkge1xuICAgIHZhciBvcmlnaW5hbCA9IGRhdGFcbiAgICB2YXIgbWV0YSA9IHsgJGluZGV4OiBpbmRleCB9XG4gICAgaWYgKHRoaXMuY29udmVydGVkKSB7XG4gICAgICBtZXRhLiRrZXkgPSBvcmlnaW5hbC4ka2V5XG4gICAgfVxuICAgIHZhciByYXcgPSB0aGlzLmNvbnZlcnRlZCA/IGRhdGEuJHZhbHVlIDogZGF0YVxuICAgIHZhciBhbGlhcyA9IHRoaXMuYXJnXG4gICAgdmFyIGhhc0FsaWFzID0gIWlzT2JqZWN0KHJhdykgfHwgIWlzUGxhaW5PYmplY3QoZGF0YSkgfHwgYWxpYXNcbiAgICAvLyB3cmFwIHRoZSByYXcgZGF0YSB3aXRoIGFsaWFzXG4gICAgZGF0YSA9IGhhc0FsaWFzID8ge30gOiByYXdcbiAgICBpZiAoYWxpYXMpIHtcbiAgICAgIGRhdGFbYWxpYXNdID0gcmF3XG4gICAgfSBlbHNlIGlmIChoYXNBbGlhcykge1xuICAgICAgbWV0YS4kdmFsdWUgPSByYXdcbiAgICB9XG4gICAgLy8gcmVzb2x2ZSBjb25zdHJ1Y3RvclxuICAgIHZhciBDdG9yID0gdGhpcy5DdG9yIHx8IHRoaXMucmVzb2x2ZUN0b3IoZGF0YSwgbWV0YSlcbiAgICB2YXIgdm0gPSB0aGlzLnZtLiRhZGRDaGlsZCh7XG4gICAgICBlbDogdGVtcGxhdGVQYXJzZXIuY2xvbmUodGhpcy50ZW1wbGF0ZSksXG4gICAgICBfYXNDb21wb25lbnQ6IHRoaXMuYXNDb21wb25lbnQsXG4gICAgICBfbGlua0ZuOiB0aGlzLl9saW5rRm4sXG4gICAgICBfbWV0YTogbWV0YSxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBpbmhlcml0OiB0aGlzLmluaGVyaXQsXG4gICAgICB0ZW1wbGF0ZTogdGhpcy5pbmxpbmVUZW1wYWx0ZVxuICAgIH0sIEN0b3IpXG4gICAgLy8gZmxhZyB0aGlzIGluc3RhbmNlIGFzIGEgcmVwZWF0IGluc3RhbmNlXG4gICAgLy8gc28gdGhhdCB3ZSBjYW4gc2tpcCBpdCBpbiB2bS5fZGlnZXN0XG4gICAgdm0uX3JlcGVhdCA9IHRydWVcbiAgICAvLyBjYWNoZSBpbnN0YW5jZVxuICAgIGlmIChuZWVkQ2FjaGUpIHtcbiAgICAgIHRoaXMuY2FjaGVWbShyYXcsIHZtKVxuICAgIH1cbiAgICAvLyBzeW5jIGJhY2sgY2hhbmdlcyBmb3IgJHZhbHVlLCBwYXJ0aWN1bGFybHkgZm9yXG4gICAgLy8gdHdvLXdheSBiaW5kaW5ncyBvZiBwcmltaXRpdmUgdmFsdWVzXG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdm0uJHdhdGNoKCckdmFsdWUnLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICBpZiAoc2VsZi5jb252ZXJ0ZWQpIHtcbiAgICAgICAgc2VsZi5yYXdWYWx1ZVt2bS4ka2V5XSA9IHZhbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5yYXdWYWx1ZS4kc2V0KHZtLiRpbmRleCwgdmFsKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHZtXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlc29sdmUgYSBjb250cnVjdG9yIHRvIHVzZSBmb3IgYW4gaW5zdGFuY2UuXG4gICAqIFRoZSB0cmlja3kgcGFydCBoZXJlIGlzIHRoYXQgdGhlcmUgY291bGQgYmUgZHluYW1pY1xuICAgKiBjb21wb25lbnRzIGRlcGVuZGluZyBvbiBpbnN0YW5jZSBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YVxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG5cbiAgcmVzb2x2ZUN0b3I6IGZ1bmN0aW9uIChkYXRhLCBtZXRhKSB7XG4gICAgLy8gY3JlYXRlIGEgdGVtcG9yYXJ5IGNvbnRleHQgb2JqZWN0IGFuZCBjb3B5IGRhdGFcbiAgICAvLyBhbmQgbWV0YSBwcm9wZXJ0aWVzIG9udG8gaXQuXG4gICAgLy8gdXNlIF8uZGVmaW5lIHRvIGF2b2lkIGFjY2lkZW50YWxseSBvdmVyd3JpdGluZyBzY29wZVxuICAgIC8vIHByb3BlcnRpZXMuXG4gICAgdmFyIGNvbnRleHQgPSBPYmplY3QuY3JlYXRlKHRoaXMudm0pXG4gICAgdmFyIGtleVxuICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgIF8uZGVmaW5lKGNvbnRleHQsIGtleSwgZGF0YVtrZXldKVxuICAgIH1cbiAgICBmb3IgKGtleSBpbiBtZXRhKSB7XG4gICAgICBfLmRlZmluZShjb250ZXh0LCBrZXksIG1ldGFba2V5XSlcbiAgICB9XG4gICAgdmFyIGlkID0gdGhpcy5jdG9yR2V0dGVyLmNhbGwoY29udGV4dCwgY29udGV4dClcbiAgICB2YXIgQ3RvciA9IHRoaXMudm0uJG9wdGlvbnMuY29tcG9uZW50c1tpZF1cbiAgICBfLmFzc2VydEFzc2V0KEN0b3IsICdjb21wb25lbnQnLCBpZClcbiAgICByZXR1cm4gQ3RvclxuICB9LFxuXG4gIC8qKlxuICAgKiBVbmJpbmQsIHRlYXJkb3duIGV2ZXJ5dGhpbmdcbiAgICovXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucmVmSUQpIHtcbiAgICAgIHRoaXMudm0uJFt0aGlzLnJlZklEXSA9IG51bGxcbiAgICB9XG4gICAgaWYgKHRoaXMudm1zKSB7XG4gICAgICB2YXIgaSA9IHRoaXMudm1zLmxlbmd0aFxuICAgICAgdmFyIHZtXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZtID0gdGhpcy52bXNbaV1cbiAgICAgICAgdGhpcy51bmNhY2hlVm0odm0pXG4gICAgICAgIHZtLiRkZXN0cm95KClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhY2hlIGEgdm0gaW5zdGFuY2UgYmFzZWQgb24gaXRzIGRhdGEuXG4gICAqXG4gICAqIElmIHRoZSBkYXRhIGlzIGFuIG9iamVjdCwgd2Ugc2F2ZSB0aGUgdm0ncyByZWZlcmVuY2Ugb25cbiAgICogdGhlIGRhdGEgb2JqZWN0IGFzIGEgaGlkZGVuIHByb3BlcnR5LiBPdGhlcndpc2Ugd2VcbiAgICogY2FjaGUgdGhlbSBpbiBhbiBvYmplY3QgYW5kIGZvciBlYWNoIHByaW1pdGl2ZSB2YWx1ZVxuICAgKiB0aGVyZSBpcyBhbiBhcnJheSBpbiBjYXNlIHRoZXJlIGFyZSBkdXBsaWNhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge1Z1ZX0gdm1cbiAgICovXG5cbiAgY2FjaGVWbTogZnVuY3Rpb24gKGRhdGEsIHZtKSB7XG4gICAgdmFyIGlkS2V5ID0gdGhpcy5pZEtleVxuICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGVcbiAgICB2YXIgaWRcbiAgICBpZiAoaWRLZXkpIHtcbiAgICAgIGlkID0gZGF0YVtpZEtleV1cbiAgICAgIGlmICghY2FjaGVbaWRdKSB7XG4gICAgICAgIGNhY2hlW2lkXSA9IHZtXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLndhcm4oJ0R1cGxpY2F0ZSB0cmFjay1ieSBrZXkgaW4gdi1yZXBlYXQ6ICcgKyBpZClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBpZCA9IHRoaXMuaWRcbiAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICBpZiAoZGF0YVtpZF0gPT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhW2lkXSA9IHZtXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy53YXJuKFxuICAgICAgICAgICAgJ0R1cGxpY2F0ZSBvYmplY3RzIGFyZSBub3Qgc3VwcG9ydGVkIGluIHYtcmVwZWF0ICcgK1xuICAgICAgICAgICAgJ3doZW4gdXNpbmcgY29tcG9uZW50cyBvciB0cmFuc2l0aW9ucy4nXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmRlZmluZShkYXRhLCB0aGlzLmlkLCB2bSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjYWNoZVtkYXRhXSkge1xuICAgICAgICBjYWNoZVtkYXRhXSA9IFt2bV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhY2hlW2RhdGFdLnB1c2godm0pXG4gICAgICB9XG4gICAgfVxuICAgIHZtLl9yYXcgPSBkYXRhXG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyeSB0byBnZXQgYSBjYWNoZWQgaW5zdGFuY2UgZnJvbSBhIHBpZWNlIG9mIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEByZXR1cm4ge1Z1ZXx1bmRlZmluZWR9XG4gICAqL1xuXG4gIGdldFZtOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmICh0aGlzLmlkS2V5KSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVtkYXRhW3RoaXMuaWRLZXldXVxuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhW3RoaXMuaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBjYWNoZWQgPSB0aGlzLmNhY2hlW2RhdGFdXG4gICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgIHZhciBpID0gMFxuICAgICAgICB2YXIgdm0gPSBjYWNoZWRbaV1cbiAgICAgICAgLy8gc2luY2UgZHVwbGljYXRlZCB2bSBpbnN0YW5jZXMgbWlnaHQgYmUgYSByZXVzZWRcbiAgICAgICAgLy8gb25lIE9SIGEgbmV3bHkgY3JlYXRlZCBvbmUsIHdlIG5lZWQgdG8gcmV0dXJuIHRoZVxuICAgICAgICAvLyBmaXJzdCBpbnN0YW5jZSB0aGF0IGlzIG5laXRoZXIgb2YgdGhlc2UuXG4gICAgICAgIHdoaWxlICh2bSAmJiAodm0uX3JldXNlZCB8fCB2bS5fbmV3KSkge1xuICAgICAgICAgIHZtID0gY2FjaGVkWysraV1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdm1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIERlbGV0ZSBhIGNhY2hlZCB2bSBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHZtXG4gICAqL1xuXG4gIHVuY2FjaGVWbTogZnVuY3Rpb24gKHZtKSB7XG4gICAgdmFyIGRhdGEgPSB2bS5fcmF3XG4gICAgaWYgKHRoaXMuaWRLZXkpIHtcbiAgICAgIHRoaXMuY2FjaGVbZGF0YVt0aGlzLmlkS2V5XV0gPSBudWxsXG4gICAgfSBlbHNlIGlmIChpc09iamVjdChkYXRhKSkge1xuICAgICAgZGF0YVt0aGlzLmlkXSA9IG51bGxcbiAgICAgIHZtLl9yYXcgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FjaGVbZGF0YV0ucG9wKClcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIEhlbHBlciB0byBmaW5kIHRoZSBuZXh0IGVsZW1lbnQgdGhhdCBpcyBhbiBpbnN0YW5jZVxuICogcm9vdCBub2RlLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGEgZGVzdHJveWVkIHZtJ3NcbiAqIGVsZW1lbnQgY291bGQgc3RpbGwgYmUgbGluZ2VyaW5nIGluIHRoZSBET00gYmVmb3JlIGl0c1xuICogbGVhdmluZyB0cmFuc2l0aW9uIGZpbmlzaGVzLCBidXQgaXRzIF9fdnVlX18gcmVmZXJlbmNlXG4gKiBzaG91bGQgaGF2ZSBiZWVuIHJlbW92ZWQgc28gd2UgY2FuIHNraXAgdGhlbS5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Q29tbWVudE5vZGV9IHJlZlxuICogQHJldHVybiB7VnVlfVxuICovXG5cbmZ1bmN0aW9uIGZpbmROZXh0Vm0gKHZtLCByZWYpIHtcbiAgdmFyIGVsID0gKHZtLl9ibG9ja0VuZCB8fCB2bS4kZWwpLm5leHRTaWJsaW5nXG4gIHdoaWxlICghZWwuX192dWVfXyAmJiBlbCAhPT0gcmVmKSB7XG4gICAgZWwgPSBlbC5uZXh0U2libGluZ1xuICB9XG4gIHJldHVybiBlbC5fX3Z1ZV9fXG59XG5cbi8qKlxuICogQXR0ZW1wdCB0byBjb252ZXJ0IG5vbi1BcnJheSBvYmplY3RzIHRvIGFycmF5LlxuICogVGhpcyBpcyB0aGUgZGVmYXVsdCBmaWx0ZXIgaW5zdGFsbGVkIHRvIGV2ZXJ5IHYtcmVwZWF0XG4gKiBkaXJlY3RpdmUuXG4gKlxuICogSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCAqKnRoZSBkaXJlY3RpdmUqKiBhcyBgdGhpc2BcbiAqIGNvbnRleHQgc28gdGhhdCB3ZSBjYW4gbWFyayB0aGUgcmVwZWF0IGFycmF5IGFzIGNvbnZlcnRlZFxuICogZnJvbSBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBvYmpUb0FycmF5IChvYmopIHtcbiAgLy8gcmVnYXJkbGVzcyBvZiB0eXBlLCBzdG9yZSB0aGUgdW4tZmlsdGVyZWQgcmF3IHZhbHVlLlxuICB0aGlzLnJhd1ZhbHVlID0gb2JqXG4gIGlmICghaXNQbGFpbk9iamVjdChvYmopKSB7XG4gICAgcmV0dXJuIG9ialxuICB9XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHZhciByZXMgPSBuZXcgQXJyYXkoaSlcbiAgdmFyIGtleVxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIHJlc1tpXSA9IHtcbiAgICAgICRrZXk6IGtleSxcbiAgICAgICR2YWx1ZTogb2JqW2tleV1cbiAgICB9XG4gIH1cbiAgLy8gYHRoaXNgIHBvaW50cyB0byB0aGUgcmVwZWF0IGRpcmVjdGl2ZSBpbnN0YW5jZVxuICB0aGlzLmNvbnZlcnRlZCA9IHRydWVcbiAgcmV0dXJuIHJlc1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHJhbmdlIGFycmF5IGZyb20gZ2l2ZW4gbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiByYW5nZSAobikge1xuICB2YXIgaSA9IC0xXG4gIHZhciByZXQgPSBuZXcgQXJyYXkobilcbiAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICByZXRbaV0gPSBpXG4gIH1cbiAgcmV0dXJuIHJldFxufSIsInZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBlbCA9IHRoaXMuZWxcbiAgdHJhbnNpdGlvbi5hcHBseShlbCwgdmFsdWUgPyAxIDogLTEsIGZ1bmN0aW9uICgpIHtcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnJyA6ICdub25lJ1xuICB9LCB0aGlzLnZtKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJy1tb3otJywgJy1tcy0nXVxudmFyIGNhbWVsUHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnbXMnXVxudmFyIGltcG9ydGFudFJFID0gLyFpbXBvcnRhbnQ7PyQvXG52YXIgY2FtZWxSRSA9IC8oW2Etel0pKFtBLVpdKS9nXG52YXIgdGVzdEVsID0gbnVsbFxudmFyIHByb3BDYWNoZSA9IHt9XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGRlZXA6IHRydWUsXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5hcmcpIHtcbiAgICAgIHRoaXMuc2V0UHJvcCh0aGlzLmFyZywgdmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIGNhY2hlIG9iamVjdCBzdHlsZXMgc28gdGhhdCBvbmx5IGNoYW5nZWQgcHJvcHNcbiAgICAgICAgLy8gYXJlIGFjdHVhbGx5IHVwZGF0ZWQuXG4gICAgICAgIGlmICghdGhpcy5jYWNoZSkgdGhpcy5jYWNoZSA9IHt9XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gdmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNldFByb3AocHJvcCwgdmFsdWVbcHJvcF0pXG4gICAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICAgICAgICBpZiAodmFsdWVbcHJvcF0gIT0gdGhpcy5jYWNoZVtwcm9wXSkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZVtwcm9wXSA9IHZhbHVlW3Byb3BdXG4gICAgICAgICAgICB0aGlzLnNldFByb3AocHJvcCwgdmFsdWVbcHJvcF0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsLnN0eWxlLmNzc1RleHQgPSB2YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzZXRQcm9wOiBmdW5jdGlvbiAocHJvcCwgdmFsdWUpIHtcbiAgICBwcm9wID0gbm9ybWFsaXplKHByb3ApXG4gICAgaWYgKCFwcm9wKSByZXR1cm4gLy8gdW5zdXBwb3J0ZWQgcHJvcFxuICAgIC8vIGNhc3QgcG9zc2libGUgbnVtYmVycy9ib29sZWFucyBpbnRvIHN0cmluZ3NcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkgdmFsdWUgKz0gJydcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHZhciBpc0ltcG9ydGFudCA9IGltcG9ydGFudFJFLnRlc3QodmFsdWUpXG4gICAgICAgID8gJ2ltcG9ydGFudCdcbiAgICAgICAgOiAnJ1xuICAgICAgaWYgKGlzSW1wb3J0YW50KSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShpbXBvcnRhbnRSRSwgJycpLnRyaW0oKVxuICAgICAgfVxuICAgICAgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wLCB2YWx1ZSwgaXNJbXBvcnRhbnQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcClcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIENTUyBwcm9wZXJ0eSBuYW1lLlxuICogLSBjYWNoZSByZXN1bHRcbiAqIC0gYXV0byBwcmVmaXhcbiAqIC0gY2FtZWxDYXNlIC0+IGRhc2gtY2FzZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gbm9ybWFsaXplIChwcm9wKSB7XG4gIGlmIChwcm9wQ2FjaGVbcHJvcF0pIHtcbiAgICByZXR1cm4gcHJvcENhY2hlW3Byb3BdXG4gIH1cbiAgdmFyIHJlcyA9IHByZWZpeChwcm9wKVxuICBwcm9wQ2FjaGVbcHJvcF0gPSBwcm9wQ2FjaGVbcmVzXSA9IHJlc1xuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogQXV0byBkZXRlY3QgdGhlIGFwcHJvcHJpYXRlIHByZWZpeCBmb3IgYSBDU1MgcHJvcGVydHkuXG4gKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvNTIzNjkyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBwcmVmaXggKHByb3ApIHtcbiAgcHJvcCA9IHByb3AucmVwbGFjZShjYW1lbFJFLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpXG4gIHZhciBjYW1lbCA9IF8uY2FtZWxpemUocHJvcClcbiAgdmFyIHVwcGVyID0gY2FtZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYW1lbC5zbGljZSgxKVxuICBpZiAoIXRlc3RFbCkge1xuICAgIHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIH1cbiAgaWYgKGNhbWVsIGluIHRlc3RFbC5zdHlsZSkge1xuICAgIHJldHVybiBwcm9wXG4gIH1cbiAgdmFyIGkgPSBwcmVmaXhlcy5sZW5ndGhcbiAgdmFyIHByZWZpeGVkXG4gIHdoaWxlIChpLS0pIHtcbiAgICBwcmVmaXhlZCA9IGNhbWVsUHJlZml4ZXNbaV0gKyB1cHBlclxuICAgIGlmIChwcmVmaXhlZCBpbiB0ZXN0RWwuc3R5bGUpIHtcbiAgICAgIHJldHVybiBwcmVmaXhlc1tpXSArIHByb3BcbiAgICB9XG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hdHRyID0gdGhpcy5lbC5ub2RlVHlwZSA9PT0gM1xuICAgICAgPyAnbm9kZVZhbHVlJ1xuICAgICAgOiAndGV4dENvbnRlbnQnXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmVsW3RoaXMuYXR0cl0gPSBfLnRvU3RyaW5nKHZhbHVlKVxuICB9XG4gIFxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHByaW9yaXR5OiAxMDAwLFxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZWwuX192X3RyYW5zID0ge1xuICAgICAgaWQ6IHRoaXMuZXhwcmVzc2lvbixcbiAgICAgIC8vIHJlc29sdmUgdGhlIGN1c3RvbSB0cmFuc2l0aW9uIGZ1bmN0aW9ucyBub3dcbiAgICAgIGZuczogdGhpcy52bS4kb3B0aW9ucy50cmFuc2l0aW9uc1t0aGlzLmV4cHJlc3Npb25dXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIFdhdGNoZXIgPSByZXF1aXJlKCcuLi93YXRjaGVyJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgcHJpb3JpdHk6IDkwMCxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgY2hpbGQgPSB0aGlzLnZtXG4gICAgdmFyIHBhcmVudCA9IGNoaWxkLiRwYXJlbnRcbiAgICB2YXIgY2hpbGRLZXkgPSB0aGlzLmFyZyB8fCAnJGRhdGEnXG4gICAgdmFyIHBhcmVudEtleSA9IHRoaXMuZXhwcmVzc2lvblxuXG4gICAgaWYgKHRoaXMuZWwgIT09IGNoaWxkLiRlbCkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAndi13aXRoIGNhbiBvbmx5IGJlIHVzZWQgb24gaW5zdGFuY2Ugcm9vdCBlbGVtZW50cy4nXG4gICAgICApXG4gICAgfSBlbHNlIGlmICghcGFyZW50KSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICd2LXdpdGggbXVzdCBiZSB1c2VkIG9uIGFuIGluc3RhbmNlIHdpdGggYSBwYXJlbnQuJ1xuICAgICAgKVxuICAgIH0gZWxzZSB7XG5cbiAgICAgIC8vIHNpbXBsZSBsb2NrIHRvIGF2b2lkIGNpcmN1bGFyIHVwZGF0ZXMuXG4gICAgICAvLyB3aXRob3V0IHRoaXMgaXQgd291bGQgc3RhYmlsaXplIHRvbywgYnV0IHRoaXMgbWFrZXNcbiAgICAgIC8vIHN1cmUgaXQgZG9lc24ndCBjYXVzZSBvdGhlciB3YXRjaGVycyB0byByZS1ldmFsdWF0ZS5cbiAgICAgIHZhciBsb2NrZWQgPSBmYWxzZVxuICAgICAgdmFyIGxvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvY2tlZCA9IHRydWVcbiAgICAgICAgXy5uZXh0VGljayh1bmxvY2spXG4gICAgICB9XG4gICAgICB2YXIgdW5sb2NrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsb2NrZWQgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLnBhcmVudFdhdGNoZXIgPSBuZXcgV2F0Y2hlcihcbiAgICAgICAgcGFyZW50LFxuICAgICAgICBwYXJlbnRLZXksXG4gICAgICAgIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICBpZiAoIWxvY2tlZCkge1xuICAgICAgICAgICAgbG9jaygpXG4gICAgICAgICAgICBjaGlsZC4kc2V0KGNoaWxkS2V5LCB2YWwpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgICBcbiAgICAgIC8vIHNldCB0aGUgY2hpbGQgaW5pdGlhbCB2YWx1ZSBmaXJzdCwgYmVmb3JlIHNldHRpbmdcbiAgICAgIC8vIHVwIHRoZSBjaGlsZCB3YXRjaGVyIHRvIGF2b2lkIHRyaWdnZXJpbmcgaXRcbiAgICAgIC8vIGltbWVkaWF0ZWx5LlxuICAgICAgY2hpbGQuJHNldChjaGlsZEtleSwgdGhpcy5wYXJlbnRXYXRjaGVyLnZhbHVlKVxuXG4gICAgICB0aGlzLmNoaWxkV2F0Y2hlciA9IG5ldyBXYXRjaGVyKFxuICAgICAgICBjaGlsZCxcbiAgICAgICAgY2hpbGRLZXksXG4gICAgICAgIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICBpZiAoIWxvY2tlZCkge1xuICAgICAgICAgICAgbG9jaygpXG4gICAgICAgICAgICBwYXJlbnQuJHNldChwYXJlbnRLZXksIHZhbClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50V2F0Y2hlcikge1xuICAgICAgdGhpcy5wYXJlbnRXYXRjaGVyLnRlYXJkb3duKClcbiAgICAgIHRoaXMuY2hpbGRXYXRjaGVyLnRlYXJkb3duKClcbiAgICB9XG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgUGF0aCA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvcGF0aCcpXG5cbi8qKlxuICogRmlsdGVyIGZpbHRlciBmb3Igdi1yZXBlYXRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoS2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gW2RlbGltaXRlcl1cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhS2V5XG4gKi9cblxuZXhwb3J0cy5maWx0ZXJCeSA9IGZ1bmN0aW9uIChhcnIsIHNlYXJjaEtleSwgZGVsaW1pdGVyLCBkYXRhS2V5KSB7XG4gIC8vIGFsbG93IG9wdGlvbmFsIGBpbmAgZGVsaW1pdGVyXG4gIC8vIGJlY2F1c2Ugd2h5IG5vdFxuICBpZiAoZGVsaW1pdGVyICYmIGRlbGltaXRlciAhPT0gJ2luJykge1xuICAgIGRhdGFLZXkgPSBkZWxpbWl0ZXJcbiAgfVxuICAvLyBnZXQgdGhlIHNlYXJjaCBzdHJpbmdcbiAgdmFyIHNlYXJjaCA9XG4gICAgXy5zdHJpcFF1b3RlcyhzZWFyY2hLZXkpIHx8XG4gICAgdGhpcy4kZ2V0KHNlYXJjaEtleSlcbiAgaWYgKCFzZWFyY2gpIHtcbiAgICByZXR1cm4gYXJyXG4gIH1cbiAgc2VhcmNoID0gKCcnICsgc2VhcmNoKS50b0xvd2VyQ2FzZSgpXG4gIC8vIGdldCB0aGUgb3B0aW9uYWwgZGF0YUtleVxuICBkYXRhS2V5ID1cbiAgICBkYXRhS2V5ICYmXG4gICAgKF8uc3RyaXBRdW90ZXMoZGF0YUtleSkgfHwgdGhpcy4kZ2V0KGRhdGFLZXkpKVxuICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBkYXRhS2V5XG4gICAgICA/IGNvbnRhaW5zKFBhdGguZ2V0KGl0ZW0sIGRhdGFLZXkpLCBzZWFyY2gpXG4gICAgICA6IGNvbnRhaW5zKGl0ZW0sIHNlYXJjaClcbiAgfSlcbn1cblxuLyoqXG4gKiBGaWx0ZXIgZmlsdGVyIGZvciB2LXJlcGVhdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzb3J0S2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gcmV2ZXJzZUtleVxuICovXG5cbmV4cG9ydHMub3JkZXJCeSA9IGZ1bmN0aW9uIChhcnIsIHNvcnRLZXksIHJldmVyc2VLZXkpIHtcbiAgdmFyIGtleSA9XG4gICAgXy5zdHJpcFF1b3Rlcyhzb3J0S2V5KSB8fFxuICAgIHRoaXMuJGdldChzb3J0S2V5KVxuICBpZiAoIWtleSkge1xuICAgIHJldHVybiBhcnJcbiAgfVxuICB2YXIgb3JkZXIgPSAxXG4gIGlmIChyZXZlcnNlS2V5KSB7XG4gICAgaWYgKHJldmVyc2VLZXkgPT09ICctMScpIHtcbiAgICAgIG9yZGVyID0gLTFcbiAgICB9IGVsc2UgaWYgKHJldmVyc2VLZXkuY2hhckNvZGVBdCgwKSA9PT0gMHgyMSkgeyAvLyAhXG4gICAgICByZXZlcnNlS2V5ID0gcmV2ZXJzZUtleS5zbGljZSgxKVxuICAgICAgb3JkZXIgPSB0aGlzLiRnZXQocmV2ZXJzZUtleSkgPyAxIDogLTFcbiAgICB9IGVsc2Uge1xuICAgICAgb3JkZXIgPSB0aGlzLiRnZXQocmV2ZXJzZUtleSkgPyAtMSA6IDFcbiAgICB9XG4gIH1cbiAgLy8gc29ydCBvbiBhIGNvcHkgdG8gYXZvaWQgbXV0YXRpbmcgb3JpZ2luYWwgYXJyYXlcbiAgcmV0dXJuIGFyci5zbGljZSgpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICBhID0gXy5pc09iamVjdChhKSA/IFBhdGguZ2V0KGEsIGtleSkgOiBhXG4gICAgYiA9IF8uaXNPYmplY3QoYikgPyBQYXRoLmdldChiLCBrZXkpIDogYlxuICAgIHJldHVybiBhID09PSBiID8gMCA6IGEgPiBiID8gb3JkZXIgOiAtb3JkZXJcbiAgfSlcbn1cblxuLyoqXG4gKiBTdHJpbmcgY29udGFpbiBoZWxwZXJcbiAqXG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaFxuICovXG5cbmZ1bmN0aW9uIGNvbnRhaW5zICh2YWwsIHNlYXJjaCkge1xuICBpZiAoXy5pc09iamVjdCh2YWwpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHZhbCkge1xuICAgICAgaWYgKGNvbnRhaW5zKHZhbFtrZXldLCBzZWFyY2gpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHZhbCAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbC50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpID4gLTFcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbi8qKlxuICogU3RyaW5naWZ5IHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRlbnRcbiAqL1xuXG5leHBvcnRzLmpzb24gPSB7XG4gIHJlYWQ6IGZ1bmN0aW9uICh2YWx1ZSwgaW5kZW50KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZydcbiAgICAgID8gdmFsdWVcbiAgICAgIDogSlNPTi5zdHJpbmdpZnkodmFsdWUsIG51bGwsIE51bWJlcihpbmRlbnQpIHx8IDIpXG4gIH0sXG4gIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogJ2FiYycgPT4gJ0FiYydcbiAqL1xuXG5leHBvcnRzLmNhcGl0YWxpemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkgcmV0dXJuICcnXG4gIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKVxuICByZXR1cm4gdmFsdWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB2YWx1ZS5zbGljZSgxKVxufVxuXG4vKipcbiAqICdhYmMnID0+ICdBQkMnXG4gKi9cblxuZXhwb3J0cy51cHBlcmNhc2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMClcbiAgICA/IHZhbHVlLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKVxuICAgIDogJydcbn1cblxuLyoqXG4gKiAnQWJDJyA9PiAnYWJjJ1xuICovXG5cbmV4cG9ydHMubG93ZXJjYXNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgfHwgdmFsdWUgPT09IDApXG4gICAgPyB2YWx1ZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcbiAgICA6ICcnXG59XG5cbi8qKlxuICogMTIzNDUgPT4gJDEyLDM0NS4wMFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzaWduXG4gKi9cblxudmFyIGRpZ2l0c1JFID0gLyhcXGR7M30pKD89XFxkKS9nXG5cbmV4cG9ydHMuY3VycmVuY3kgPSBmdW5jdGlvbiAodmFsdWUsIHNpZ24pIHtcbiAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKVxuICBpZiAoIWlzRmluaXRlKHZhbHVlKSB8fCAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSkgcmV0dXJuICcnXG4gIHNpZ24gPSBzaWduIHx8ICckJ1xuICB2YXIgcyA9IE1hdGguZmxvb3IoTWF0aC5hYnModmFsdWUpKS50b1N0cmluZygpLFxuICAgIGkgPSBzLmxlbmd0aCAlIDMsXG4gICAgaCA9IGkgPiAwXG4gICAgICA/IChzLnNsaWNlKDAsIGkpICsgKHMubGVuZ3RoID4gMyA/ICcsJyA6ICcnKSlcbiAgICAgIDogJycsXG4gICAgdiA9IE1hdGguYWJzKHBhcnNlSW50KCh2YWx1ZSAqIDEwMCkgJSAxMDAsIDEwKSksXG4gICAgZiA9ICcuJyArICh2IDwgMTAgPyAoJzAnICsgdikgOiB2KVxuICByZXR1cm4gKHZhbHVlIDwgMCA/ICctJyA6ICcnKSArXG4gICAgc2lnbiArIGggKyBzLnNsaWNlKGkpLnJlcGxhY2UoZGlnaXRzUkUsICckMSwnKSArIGZcbn1cblxuLyoqXG4gKiAnaXRlbScgPT4gJ2l0ZW1zJ1xuICpcbiAqIEBwYXJhbXNcbiAqICBhbiBhcnJheSBvZiBzdHJpbmdzIGNvcnJlc3BvbmRpbmcgdG9cbiAqICB0aGUgc2luZ2xlLCBkb3VibGUsIHRyaXBsZSAuLi4gZm9ybXMgb2YgdGhlIHdvcmQgdG9cbiAqICBiZSBwbHVyYWxpemVkLiBXaGVuIHRoZSBudW1iZXIgdG8gYmUgcGx1cmFsaXplZFxuICogIGV4Y2VlZHMgdGhlIGxlbmd0aCBvZiB0aGUgYXJncywgaXQgd2lsbCB1c2UgdGhlIGxhc3RcbiAqICBlbnRyeSBpbiB0aGUgYXJyYXkuXG4gKlxuICogIGUuZy4gWydzaW5nbGUnLCAnZG91YmxlJywgJ3RyaXBsZScsICdtdWx0aXBsZSddXG4gKi9cblxuZXhwb3J0cy5wbHVyYWxpemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIGFyZ3MgPSBfLnRvQXJyYXkoYXJndW1lbnRzLCAxKVxuICByZXR1cm4gYXJncy5sZW5ndGggPiAxXG4gICAgPyAoYXJnc1t2YWx1ZSAlIDEwIC0gMV0gfHwgYXJnc1thcmdzLmxlbmd0aCAtIDFdKVxuICAgIDogKGFyZ3NbMF0gKyAodmFsdWUgPT09IDEgPyAnJyA6ICdzJykpXG59XG5cbi8qKlxuICogQSBzcGVjaWFsIGZpbHRlciB0aGF0IHRha2VzIGEgaGFuZGxlciBmdW5jdGlvbixcbiAqIHdyYXBzIGl0IHNvIGl0IG9ubHkgZ2V0cyB0cmlnZ2VyZWQgb24gc3BlY2lmaWNcbiAqIGtleXByZXNzZXMuIHYtb24gb25seS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKi9cblxudmFyIGtleUNvZGVzID0ge1xuICBlbnRlciAgICA6IDEzLFxuICB0YWIgICAgICA6IDksXG4gICdkZWxldGUnIDogNDYsXG4gIHVwICAgICAgIDogMzgsXG4gIGxlZnQgICAgIDogMzcsXG4gIHJpZ2h0ICAgIDogMzksXG4gIGRvd24gICAgIDogNDAsXG4gIGVzYyAgICAgIDogMjdcbn1cblxuZXhwb3J0cy5rZXkgPSBmdW5jdGlvbiAoaGFuZGxlciwga2V5KSB7XG4gIGlmICghaGFuZGxlcikgcmV0dXJuXG4gIHZhciBjb2RlID0ga2V5Q29kZXNba2V5XVxuICBpZiAoIWNvZGUpIHtcbiAgICBjb2RlID0gcGFyc2VJbnQoa2V5LCAxMClcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlID09PSBjb2RlKSB7XG4gICAgICByZXR1cm4gaGFuZGxlci5jYWxsKHRoaXMsIGUpXG4gICAgfVxuICB9XG59XG5cbi8vIGV4cG9zZSBrZXljb2RlIGhhc2hcbmV4cG9ydHMua2V5LmtleUNvZGVzID0ga2V5Q29kZXNcblxuLyoqXG4gKiBJbnN0YWxsIHNwZWNpYWwgYXJyYXkgZmlsdGVyc1xuICovXG5cbl8uZXh0ZW5kKGV4cG9ydHMsIHJlcXVpcmUoJy4vYXJyYXktZmlsdGVycycpKVxuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBEaXJlY3RpdmUgPSByZXF1aXJlKCcuLi9kaXJlY3RpdmUnKVxudmFyIGNvbXBpbGUgPSByZXF1aXJlKCcuLi9jb21waWxlci9jb21waWxlJylcbnZhciB0cmFuc2NsdWRlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvdHJhbnNjbHVkZScpXG5cbi8qKlxuICogVHJhbnNjbHVkZSwgY29tcGlsZSBhbmQgbGluayBlbGVtZW50LlxuICpcbiAqIElmIGEgcHJlLWNvbXBpbGVkIGxpbmtlciBpcyBhdmFpbGFibGUsIHRoYXQgbWVhbnMgdGhlXG4gKiBwYXNzZWQgaW4gZWxlbWVudCB3aWxsIGJlIHByZS10cmFuc2NsdWRlZCBhbmQgY29tcGlsZWRcbiAqIGFzIHdlbGwgLSBhbGwgd2UgbmVlZCB0byBkbyBpcyB0byBjYWxsIHRoZSBsaW5rZXIuXG4gKlxuICogT3RoZXJ3aXNlIHdlIG5lZWQgdG8gY2FsbCB0cmFuc2NsdWRlL2NvbXBpbGUvbGluayBoZXJlLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cblxuZXhwb3J0cy5fY29tcGlsZSA9IGZ1bmN0aW9uIChlbCkge1xuICB2YXIgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnNcbiAgdmFyIHBhcmVudCA9IG9wdGlvbnMuX3BhcmVudFxuICBpZiAob3B0aW9ucy5fbGlua0ZuKSB7XG4gICAgdGhpcy5faW5pdEVsZW1lbnQoZWwpXG4gICAgb3B0aW9ucy5fbGlua0ZuKHRoaXMsIGVsKVxuICB9IGVsc2Uge1xuICAgIHZhciByYXcgPSBlbFxuICAgIGlmIChvcHRpb25zLl9hc0NvbXBvbmVudCkge1xuICAgICAgLy8gc2VwYXJhdGUgY29udGFpbmVyIGVsZW1lbnQgYW5kIGNvbnRlbnRcbiAgICAgIHZhciBjb250ZW50ID0gb3B0aW9ucy5fY29udGVudCA9IF8uZXh0cmFjdENvbnRlbnQocmF3KVxuICAgICAgLy8gY3JlYXRlIHR3byBzZXBhcmF0ZSBsaW5la3JzIGZvciBjb250YWluZXIgYW5kIGNvbnRlbnRcbiAgICAgIHZhciBwYXJlbnRPcHRpb25zID0gcGFyZW50LiRvcHRpb25zXG4gICAgICBcbiAgICAgIC8vIGhhY2s6IHdlIG5lZWQgdG8gc2tpcCB0aGUgcGFyYW1BdHRyaWJ1dGVzIGZvciB0aGlzXG4gICAgICAvLyBjaGlsZCBpbnN0YW5jZSB3aGVuIGNvbXBpbGluZyBpdHMgcGFyZW50IGNvbnRhaW5lclxuICAgICAgLy8gbGlua2VyLiB0aGVyZSBjb3VsZCBiZSBhIGJldHRlciB3YXkgdG8gZG8gdGhpcy5cbiAgICAgIHBhcmVudE9wdGlvbnMuX3NraXBBdHRycyA9IG9wdGlvbnMucGFyYW1BdHRyaWJ1dGVzXG4gICAgICB2YXIgY29udGFpbmVyTGlua0ZuID1cbiAgICAgICAgY29tcGlsZShyYXcsIHBhcmVudE9wdGlvbnMsIHRydWUsIHRydWUpXG4gICAgICBwYXJlbnRPcHRpb25zLl9za2lwQXR0cnMgPSBudWxsXG5cbiAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgIHZhciBvbCA9IHBhcmVudC5fY2hpbGRyZW4ubGVuZ3RoXG4gICAgICAgIHZhciBjb250ZW50TGlua0ZuID1cbiAgICAgICAgICBjb21waWxlKGNvbnRlbnQsIHBhcmVudE9wdGlvbnMsIHRydWUpXG4gICAgICAgIC8vIGNhbGwgY29udGVudCBsaW5rZXIgbm93LCBiZWZvcmUgdHJhbnNjbHVzaW9uXG4gICAgICAgIHRoaXMuX2NvbnRlbnRVbmxpbmtGbiA9IGNvbnRlbnRMaW5rRm4ocGFyZW50LCBjb250ZW50KVxuICAgICAgICAvLyBtYXJrIGFsbCBjb21waWxlZCBub2RlcyBhcyB0cmFuc2NsdWRlZCwgc28gdGhhdFxuICAgICAgICAvLyBkaXJlY3RpdmVzIHRoYXQgZG8gcGFydGlhbCBjb21waWxhdGlvbiwgZS5nLiB2LWlmXG4gICAgICAgIC8vIGFuZCB2LXBhcnRpYWwgY2FuIGRldGVjdCB0aGVtIGFuZCBwZXJzaXN0IHRoZW1cbiAgICAgICAgLy8gdGhyb3VnaCByZS1jb21waWxhdGlvbnMuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29udGVudC5jaGlsZE5vZGVzW2ldLl9pc0NvbnRlbnQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdHJhbnNDcG50cyA9IHBhcmVudC5fY2hpbGRyZW4uc2xpY2Uob2wpXG4gICAgICB9XG4gICAgICAvLyB0cmFuY2x1ZGUsIHRoaXMgcG9zc2libHkgcmVwbGFjZXMgb3JpZ2luYWxcbiAgICAgIGVsID0gdHJhbnNjbHVkZShlbCwgb3B0aW9ucylcbiAgICAgIHRoaXMuX2luaXRFbGVtZW50KGVsKVxuICAgICAgLy8gbm93IGNhbGwgdGhlIGNvbnRhaW5lciBsaW5rZXIgb24gdGhlIHJlc29sdmVkIGVsXG4gICAgICB0aGlzLl9jb250YWluZXJVbmxpbmtGbiA9IGNvbnRhaW5lckxpbmtGbihwYXJlbnQsIGVsKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBzaW1wbHkgdHJhbnNjbHVkZVxuICAgICAgZWwgPSB0cmFuc2NsdWRlKGVsLCBvcHRpb25zKVxuICAgICAgdGhpcy5faW5pdEVsZW1lbnQoZWwpXG4gICAgfVxuICAgIHZhciBsaW5rRm4gPSBjb21waWxlKGVsLCBvcHRpb25zKVxuICAgIGxpbmtGbih0aGlzLCBlbClcbiAgICBpZiAob3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICBfLnJlcGxhY2UocmF3LCBlbClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBpbnN0YW5jZSBlbGVtZW50LiBDYWxsZWQgaW4gdGhlIHB1YmxpY1xuICogJG1vdW50KCkgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqL1xuXG5leHBvcnRzLl9pbml0RWxlbWVudCA9IGZ1bmN0aW9uIChlbCkge1xuICBpZiAoZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgdGhpcy5faXNCbG9jayA9IHRydWVcbiAgICB0aGlzLl9ibG9ja1N0YXJ0ID0gZWwuZmlyc3RDaGlsZFxuICAgIHRoaXMuJGVsID0gZWwuY2hpbGROb2Rlc1sxXVxuICAgIHRoaXMuX2Jsb2NrRW5kID0gZWwubGFzdENoaWxkXG4gICAgdGhpcy5fYmxvY2tGcmFnbWVudCA9IGVsXG4gIH0gZWxzZSB7XG4gICAgdGhpcy4kZWwgPSBlbFxuICB9XG4gIHRoaXMuJGVsLl9fdnVlX18gPSB0aGlzXG4gIHRoaXMuX2NhbGxIb29rKCdiZWZvcmVDb21waWxlJylcbn1cblxuLyoqXG4gKiBDcmVhdGUgYW5kIGJpbmQgYSBkaXJlY3RpdmUgdG8gYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIGRpcmVjdGl2ZSBuYW1lXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgICAtIHRhcmdldCBub2RlXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzYyAtIHBhcnNlZCBkaXJlY3RpdmUgZGVzY3JpcHRvclxuICogQHBhcmFtIHtPYmplY3R9IGRlZiAgLSBkaXJlY3RpdmUgZGVmaW5pdGlvbiBvYmplY3RcbiAqL1xuXG5leHBvcnRzLl9iaW5kRGlyID0gZnVuY3Rpb24gKG5hbWUsIG5vZGUsIGRlc2MsIGRlZikge1xuICB0aGlzLl9kaXJlY3RpdmVzLnB1c2goXG4gICAgbmV3IERpcmVjdGl2ZShuYW1lLCBub2RlLCB0aGlzLCBkZXNjLCBkZWYpXG4gIClcbn1cblxuLyoqXG4gKiBUZWFyZG93biBhbiBpbnN0YW5jZSwgdW5vYnNlcnZlcyB0aGUgZGF0YSwgdW5iaW5kIGFsbCB0aGVcbiAqIGRpcmVjdGl2ZXMsIHR1cm4gb2ZmIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzLCBldGMuXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSByZW1vdmUgLSB3aGV0aGVyIHRvIHJlbW92ZSB0aGUgRE9NIG5vZGUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRlZmVyQ2xlYW51cCAtIGlmIHRydWUsIGRlZmVyIGNsZWFudXAgdG9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmUgY2FsbGVkIGxhdGVyXG4gKi9cblxuZXhwb3J0cy5fZGVzdHJveSA9IGZ1bmN0aW9uIChyZW1vdmUsIGRlZmVyQ2xlYW51cCkge1xuICBpZiAodGhpcy5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgIHJldHVyblxuICB9XG4gIHRoaXMuX2NhbGxIb29rKCdiZWZvcmVEZXN0cm95JylcbiAgdGhpcy5faXNCZWluZ0Rlc3Ryb3llZCA9IHRydWVcbiAgdmFyIGlcbiAgLy8gcmVtb3ZlIHNlbGYgZnJvbSBwYXJlbnQuIG9ubHkgbmVjZXNzYXJ5XG4gIC8vIGlmIHBhcmVudCBpcyBub3QgYmVpbmcgZGVzdHJveWVkIGFzIHdlbGwuXG4gIHZhciBwYXJlbnQgPSB0aGlzLiRwYXJlbnRcbiAgaWYgKHBhcmVudCAmJiAhcGFyZW50Ll9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgaSA9IHBhcmVudC5fY2hpbGRyZW4uaW5kZXhPZih0aGlzKVxuICAgIHBhcmVudC5fY2hpbGRyZW4uc3BsaWNlKGksIDEpXG4gIH1cbiAgLy8gZGVzdHJveSBhbGwgY2hpbGRyZW4uXG4gIGkgPSB0aGlzLl9jaGlsZHJlbi5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIHRoaXMuX2NoaWxkcmVuW2ldLiRkZXN0cm95KClcbiAgfVxuICAvLyB0ZWFyZG93biBwYXJlbnQgbGlua2Vyc1xuICBpZiAodGhpcy5fY29udGFpbmVyVW5saW5rRm4pIHtcbiAgICB0aGlzLl9jb250YWluZXJVbmxpbmtGbigpXG4gIH1cbiAgaWYgKHRoaXMuX2NvbnRlbnRVbmxpbmtGbikge1xuICAgIHRoaXMuX2NvbnRlbnRVbmxpbmtGbigpXG4gIH1cbiAgLy8gdGVhcmRvd24gYWxsIGRpcmVjdGl2ZXMuIHRoaXMgYWxzbyB0ZWFyc2Rvd24gYWxsXG4gIC8vIGRpcmVjdGl2ZS1vd25lZCB3YXRjaGVycy4gaW50ZW50aW9uYWxseSBjaGVjayBmb3JcbiAgLy8gZGlyZWN0aXZlcyBhcnJheSBsZW5ndGggb24gZXZlcnkgbG9vcCBzaW5jZSBkaXJlY3RpdmVzXG4gIC8vIHRoYXQgbWFuYWdlcyBwYXJ0aWFsIGNvbXBpbGF0aW9uIGNhbiBzcGxpY2Ugb25lcyBvdXRcbiAgZm9yIChpID0gMDsgaSA8IHRoaXMuX2RpcmVjdGl2ZXMubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9kaXJlY3RpdmVzW2ldLl90ZWFyZG93bigpXG4gIH1cbiAgLy8gdGVhcmRvd24gYWxsIHVzZXIgd2F0Y2hlcnMuXG4gIHZhciB3YXRjaGVyXG4gIGZvciAoaSBpbiB0aGlzLl91c2VyV2F0Y2hlcnMpIHtcbiAgICB3YXRjaGVyID0gdGhpcy5fdXNlcldhdGNoZXJzW2ldXG4gICAgaWYgKHdhdGNoZXIpIHtcbiAgICAgIHdhdGNoZXIudGVhcmRvd24oKVxuICAgIH1cbiAgfVxuICAvLyByZW1vdmUgcmVmZXJlbmNlIHRvIHNlbGYgb24gJGVsXG4gIGlmICh0aGlzLiRlbCkge1xuICAgIHRoaXMuJGVsLl9fdnVlX18gPSBudWxsXG4gIH1cbiAgLy8gcmVtb3ZlIERPTSBlbGVtZW50XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAocmVtb3ZlICYmIHRoaXMuJGVsKSB7XG4gICAgdGhpcy4kcmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2NsZWFudXAoKVxuICAgIH0pXG4gIH0gZWxzZSBpZiAoIWRlZmVyQ2xlYW51cCkge1xuICAgIHRoaXMuX2NsZWFudXAoKVxuICB9XG59XG5cbi8qKlxuICogQ2xlYW4gdXAgdG8gZW5zdXJlIGdhcmJhZ2UgY29sbGVjdGlvbi5cbiAqIFRoaXMgaXMgY2FsbGVkIGFmdGVyIHRoZSBsZWF2ZSB0cmFuc2l0aW9uIGlmIHRoZXJlXG4gKiBpcyBhbnkuXG4gKi9cblxuZXhwb3J0cy5fY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gcmVtb3ZlIHJlZmVyZW5jZSBmcm9tIGRhdGEgb2JcbiAgdGhpcy5fZGF0YS5fX29iX18ucmVtb3ZlVm0odGhpcylcbiAgdGhpcy5fZGF0YSA9XG4gIHRoaXMuX3dhdGNoZXJzID1cbiAgdGhpcy5fdXNlcldhdGNoZXJzID1cbiAgdGhpcy5fd2F0Y2hlckxpc3QgPVxuICB0aGlzLiRlbCA9XG4gIHRoaXMuJHBhcmVudCA9XG4gIHRoaXMuJHJvb3QgPVxuICB0aGlzLl9jaGlsZHJlbiA9XG4gIHRoaXMuX3RyYW5zQ3BudHMgPVxuICB0aGlzLl9kaXJlY3RpdmVzID0gbnVsbFxuICAvLyBjYWxsIHRoZSBsYXN0IGhvb2suLi5cbiAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlXG4gIHRoaXMuX2NhbGxIb29rKCdkZXN0cm95ZWQnKVxuICAvLyB0dXJuIG9mZiBhbGwgaW5zdGFuY2UgbGlzdGVuZXJzLlxuICB0aGlzLiRvZmYoKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgaW5Eb2MgPSBfLmluRG9jXG5cbi8qKlxuICogU2V0dXAgdGhlIGluc3RhbmNlJ3Mgb3B0aW9uIGV2ZW50cyAmIHdhdGNoZXJzLlxuICogSWYgdGhlIHZhbHVlIGlzIGEgc3RyaW5nLCB3ZSBwdWxsIGl0IGZyb20gdGhlXG4gKiBpbnN0YW5jZSdzIG1ldGhvZHMgYnkgbmFtZS5cbiAqL1xuXG5leHBvcnRzLl9pbml0RXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnNcbiAgcmVnaXN0ZXJDYWxsYmFja3ModGhpcywgJyRvbicsIG9wdGlvbnMuZXZlbnRzKVxuICByZWdpc3RlckNhbGxiYWNrcyh0aGlzLCAnJHdhdGNoJywgb3B0aW9ucy53YXRjaClcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBjYWxsYmFja3MgZm9yIG9wdGlvbiBldmVudHMgYW5kIHdhdGNoZXJzLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGhhc2hcbiAqL1xuXG5mdW5jdGlvbiByZWdpc3RlckNhbGxiYWNrcyAodm0sIGFjdGlvbiwgaGFzaCkge1xuICBpZiAoIWhhc2gpIHJldHVyblxuICB2YXIgaGFuZGxlcnMsIGtleSwgaSwgalxuICBmb3IgKGtleSBpbiBoYXNoKSB7XG4gICAgaGFuZGxlcnMgPSBoYXNoW2tleV1cbiAgICBpZiAoXy5pc0FycmF5KGhhbmRsZXJzKSkge1xuICAgICAgZm9yIChpID0gMCwgaiA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICByZWdpc3Rlcih2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXJzW2ldKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdpc3Rlcih2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXJzKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEhlbHBlciB0byByZWdpc3RlciBhbiBldmVudC93YXRjaCBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gaGFuZGxlclxuICovXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyICh2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXIpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgaGFuZGxlclxuICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZtW2FjdGlvbl0oa2V5LCBoYW5kbGVyKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG1ldGhvZHMgPSB2bS4kb3B0aW9ucy5tZXRob2RzXG4gICAgdmFyIG1ldGhvZCA9IG1ldGhvZHMgJiYgbWV0aG9kc1toYW5kbGVyXVxuICAgIGlmIChtZXRob2QpIHtcbiAgICAgIHZtW2FjdGlvbl0oa2V5LCBtZXRob2QpXG4gICAgfSBlbHNlIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ1Vua25vd24gbWV0aG9kOiBcIicgKyBoYW5kbGVyICsgJ1wiIHdoZW4gJyArXG4gICAgICAgICdyZWdpc3RlcmluZyBjYWxsYmFjayBmb3IgJyArIGFjdGlvbiArXG4gICAgICAgICc6IFwiJyArIGtleSArICdcIi4nXG4gICAgICApXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2V0dXAgcmVjdXJzaXZlIGF0dGFjaGVkL2RldGFjaGVkIGNhbGxzXG4gKi9cblxuZXhwb3J0cy5faW5pdERPTUhvb2tzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLiRvbignaG9vazphdHRhY2hlZCcsIG9uQXR0YWNoZWQpXG4gIHRoaXMuJG9uKCdob29rOmRldGFjaGVkJywgb25EZXRhY2hlZClcbn1cblxuLyoqXG4gKiBDYWxsYmFjayB0byByZWN1cnNpdmVseSBjYWxsIGF0dGFjaGVkIGhvb2sgb24gY2hpbGRyZW5cbiAqL1xuXG5mdW5jdGlvbiBvbkF0dGFjaGVkICgpIHtcbiAgdGhpcy5faXNBdHRhY2hlZCA9IHRydWVcbiAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChjYWxsQXR0YWNoKVxuICBpZiAodGhpcy5fdHJhbnNDcG50cykge1xuICAgIHRoaXMuX3RyYW5zQ3BudHMuZm9yRWFjaChjYWxsQXR0YWNoKVxuICB9XG59XG5cbi8qKlxuICogSXRlcmF0b3IgdG8gY2FsbCBhdHRhY2hlZCBob29rXG4gKiBcbiAqIEBwYXJhbSB7VnVlfSBjaGlsZFxuICovXG5cbmZ1bmN0aW9uIGNhbGxBdHRhY2ggKGNoaWxkKSB7XG4gIGlmICghY2hpbGQuX2lzQXR0YWNoZWQgJiYgaW5Eb2MoY2hpbGQuJGVsKSkge1xuICAgIGNoaWxkLl9jYWxsSG9vaygnYXR0YWNoZWQnKVxuICB9XG59XG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gcmVjdXJzaXZlbHkgY2FsbCBkZXRhY2hlZCBob29rIG9uIGNoaWxkcmVuXG4gKi9cblxuZnVuY3Rpb24gb25EZXRhY2hlZCAoKSB7XG4gIHRoaXMuX2lzQXR0YWNoZWQgPSBmYWxzZVxuICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGNhbGxEZXRhY2gpXG4gIGlmICh0aGlzLl90cmFuc0NwbnRzKSB7XG4gICAgdGhpcy5fdHJhbnNDcG50cy5mb3JFYWNoKGNhbGxEZXRhY2gpXG4gIH1cbn1cblxuLyoqXG4gKiBJdGVyYXRvciB0byBjYWxsIGRldGFjaGVkIGhvb2tcbiAqIFxuICogQHBhcmFtIHtWdWV9IGNoaWxkXG4gKi9cblxuZnVuY3Rpb24gY2FsbERldGFjaCAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLl9pc0F0dGFjaGVkICYmICFpbkRvYyhjaGlsZC4kZWwpKSB7XG4gICAgY2hpbGQuX2NhbGxIb29rKCdkZXRhY2hlZCcpXG4gIH1cbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGFsbCBoYW5kbGVycyBmb3IgYSBob29rXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhvb2tcbiAqL1xuXG5leHBvcnRzLl9jYWxsSG9vayA9IGZ1bmN0aW9uIChob29rKSB7XG4gIHZhciBoYW5kbGVycyA9IHRoaXMuJG9wdGlvbnNbaG9va11cbiAgaWYgKGhhbmRsZXJzKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIGhhbmRsZXJzW2ldLmNhbGwodGhpcylcbiAgICB9XG4gIH1cbiAgdGhpcy4kZW1pdCgnaG9vazonICsgaG9vaylcbn0iLCJ2YXIgbWVyZ2VPcHRpb25zID0gcmVxdWlyZSgnLi4vdXRpbC9tZXJnZS1vcHRpb24nKVxuXG4vKipcbiAqIFRoZSBtYWluIGluaXQgc2VxdWVuY2UuIFRoaXMgaXMgY2FsbGVkIGZvciBldmVyeVxuICogaW5zdGFuY2UsIGluY2x1ZGluZyBvbmVzIHRoYXQgYXJlIGNyZWF0ZWQgZnJvbSBleHRlbmRlZFxuICogY29uc3RydWN0b3JzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhpcyBvcHRpb25zIG9iamVjdCBzaG91bGQgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHJlc3VsdCBvZiBtZXJnaW5nIGNsYXNzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgYW5kIHRoZSBvcHRpb25zIHBhc3NlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB0byB0aGUgY29uc3RydWN0b3IuXG4gKi9cblxuZXhwb3J0cy5faW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICB0aGlzLiRlbCAgICAgICAgICAgPSBudWxsXG4gIHRoaXMuJHBhcmVudCAgICAgICA9IG9wdGlvbnMuX3BhcmVudFxuICB0aGlzLiRyb290ICAgICAgICAgPSBvcHRpb25zLl9yb290IHx8IHRoaXNcbiAgdGhpcy4kICAgICAgICAgICAgID0ge30gLy8gY2hpbGQgdm0gcmVmZXJlbmNlc1xuICB0aGlzLiQkICAgICAgICAgICAgPSB7fSAvLyBlbGVtZW50IHJlZmVyZW5jZXNcbiAgdGhpcy5fd2F0Y2hlckxpc3QgID0gW10gLy8gYWxsIHdhdGNoZXJzIGFzIGFuIGFycmF5XG4gIHRoaXMuX3dhdGNoZXJzICAgICA9IHt9IC8vIGludGVybmFsIHdhdGNoZXJzIGFzIGEgaGFzaFxuICB0aGlzLl91c2VyV2F0Y2hlcnMgPSB7fSAvLyB1c2VyIHdhdGNoZXJzIGFzIGEgaGFzaFxuICB0aGlzLl9kaXJlY3RpdmVzICAgPSBbXSAvLyBhbGwgZGlyZWN0aXZlc1xuXG4gIC8vIGEgZmxhZyB0byBhdm9pZCB0aGlzIGJlaW5nIG9ic2VydmVkXG4gIHRoaXMuX2lzVnVlID0gdHJ1ZVxuXG4gIC8vIGV2ZW50cyBib29ra2VlcGluZ1xuICB0aGlzLl9ldmVudHMgICAgICAgICA9IHt9ICAgIC8vIHJlZ2lzdGVyZWQgY2FsbGJhY2tzXG4gIHRoaXMuX2V2ZW50c0NvdW50ICAgID0ge30gICAgLy8gZm9yICRicm9hZGNhc3Qgb3B0aW1pemF0aW9uXG4gIHRoaXMuX2V2ZW50Q2FuY2VsbGVkID0gZmFsc2UgLy8gZm9yIGV2ZW50IGNhbmNlbGxhdGlvblxuXG4gIC8vIGJsb2NrIGluc3RhbmNlIHByb3BlcnRpZXNcbiAgdGhpcy5faXNCbG9jayAgICAgPSBmYWxzZVxuICB0aGlzLl9ibG9ja1N0YXJ0ICA9ICAgICAgICAgIC8vIEB0eXBlIHtDb21tZW50Tm9kZX1cbiAgdGhpcy5fYmxvY2tFbmQgICAgPSBudWxsICAgICAvLyBAdHlwZSB7Q29tbWVudE5vZGV9XG5cbiAgLy8gbGlmZWN5Y2xlIHN0YXRlXG4gIHRoaXMuX2lzQ29tcGlsZWQgID1cbiAgdGhpcy5faXNEZXN0cm95ZWQgPVxuICB0aGlzLl9pc1JlYWR5ICAgICA9XG4gIHRoaXMuX2lzQXR0YWNoZWQgID1cbiAgdGhpcy5faXNCZWluZ0Rlc3Ryb3llZCA9IGZhbHNlXG5cbiAgLy8gY2hpbGRyZW5cbiAgdGhpcy5fY2hpbGRyZW4gPSBbXVxuICB0aGlzLl9jaGlsZEN0b3JzID0ge31cblxuICAvLyB0cmFuc2NsdXNpb24gdW5saW5rIGZ1bmN0aW9uc1xuICB0aGlzLl9jb250YWluZXJVbmxpbmtGbiA9XG4gIHRoaXMuX2NvbnRlbnRVbmxpbmtGbiA9IG51bGxcblxuICAvLyB0cmFuc2NsdWRlZCBjb21wb25lbnRzIHRoYXQgYmVsb25nIHRvIHRoZSBwYXJlbnQuXG4gIC8vIG5lZWQgdG8ga2VlcCB0cmFjayBvZiB0aGVtIHNvIHRoYXQgd2UgY2FuIGNhbGxcbiAgLy8gYXR0YWNoZWQvZGV0YWNoZWQgaG9va3Mgb24gdGhlbS5cbiAgdGhpcy5fdHJhbnNDcG50cyA9IG51bGxcblxuICAvLyBwcm9wcyB1c2VkIGluIHYtcmVwZWF0IGRpZmZpbmdcbiAgdGhpcy5fbmV3ID0gdHJ1ZVxuICB0aGlzLl9yZXVzZWQgPSBmYWxzZVxuXG4gIC8vIG1lcmdlIG9wdGlvbnMuXG4gIG9wdGlvbnMgPSB0aGlzLiRvcHRpb25zID0gbWVyZ2VPcHRpb25zKFxuICAgIHRoaXMuY29uc3RydWN0b3Iub3B0aW9ucyxcbiAgICBvcHRpb25zLFxuICAgIHRoaXNcbiAgKVxuXG4gIC8vIHNldCBkYXRhIGFmdGVyIG1lcmdlLlxuICB0aGlzLl9kYXRhID0gb3B0aW9ucy5kYXRhIHx8IHt9XG5cbiAgLy8gaW5pdGlhbGl6ZSBkYXRhIG9ic2VydmF0aW9uIGFuZCBzY29wZSBpbmhlcml0YW5jZS5cbiAgdGhpcy5faW5pdFNjb3BlKClcblxuICAvLyBzZXR1cCBldmVudCBzeXN0ZW0gYW5kIG9wdGlvbiBldmVudHMuXG4gIHRoaXMuX2luaXRFdmVudHMoKVxuXG4gIC8vIGNhbGwgY3JlYXRlZCBob29rXG4gIHRoaXMuX2NhbGxIb29rKCdjcmVhdGVkJylcblxuICAvLyBpZiBgZWxgIG9wdGlvbiBpcyBwYXNzZWQsIHN0YXJ0IGNvbXBpbGF0aW9uLlxuICBpZiAob3B0aW9ucy5lbCkge1xuICAgIHRoaXMuJG1vdW50KG9wdGlvbnMuZWwpXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIE9ic2VydmVyID0gcmVxdWlyZSgnLi4vb2JzZXJ2ZXInKVxudmFyIERlcCA9IHJlcXVpcmUoJy4uL29ic2VydmVyL2RlcCcpXG5cbi8qKlxuICogU2V0dXAgdGhlIHNjb3BlIG9mIGFuIGluc3RhbmNlLCB3aGljaCBjb250YWluczpcbiAqIC0gb2JzZXJ2ZWQgZGF0YVxuICogLSBjb21wdXRlZCBwcm9wZXJ0aWVzXG4gKiAtIHVzZXIgbWV0aG9kc1xuICogLSBtZXRhIHByb3BlcnRpZXNcbiAqL1xuXG5leHBvcnRzLl9pbml0U2NvcGUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2luaXREYXRhKClcbiAgdGhpcy5faW5pdENvbXB1dGVkKClcbiAgdGhpcy5faW5pdE1ldGhvZHMoKVxuICB0aGlzLl9pbml0TWV0YSgpXG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgZGF0YS4gXG4gKi9cblxuZXhwb3J0cy5faW5pdERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIHByb3h5IGRhdGEgb24gaW5zdGFuY2VcbiAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZGF0YSlcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICB2YXIga2V5XG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgaWYgKCFfLmlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgdGhpcy5fcHJveHkoa2V5KVxuICAgIH1cbiAgfVxuICAvLyBvYnNlcnZlIGRhdGFcbiAgT2JzZXJ2ZXIuY3JlYXRlKGRhdGEpLmFkZFZtKHRoaXMpXG59XG5cbi8qKlxuICogU3dhcCB0aGUgaXNudGFuY2UncyAkZGF0YS4gQ2FsbGVkIGluICRkYXRhJ3Mgc2V0dGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBuZXdEYXRhXG4gKi9cblxuZXhwb3J0cy5fc2V0RGF0YSA9IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gIG5ld0RhdGEgPSBuZXdEYXRhIHx8IHt9XG4gIHZhciBvbGREYXRhID0gdGhpcy5fZGF0YVxuICB0aGlzLl9kYXRhID0gbmV3RGF0YVxuICB2YXIga2V5cywga2V5LCBpXG4gIC8vIHVucHJveHkga2V5cyBub3QgcHJlc2VudCBpbiBuZXcgZGF0YVxuICBrZXlzID0gT2JqZWN0LmtleXMob2xkRGF0YSlcbiAgaSA9IGtleXMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgaWYgKCFfLmlzUmVzZXJ2ZWQoa2V5KSAmJiAhKGtleSBpbiBuZXdEYXRhKSkge1xuICAgICAgdGhpcy5fdW5wcm94eShrZXkpXG4gICAgfVxuICB9XG4gIC8vIHByb3h5IGtleXMgbm90IGFscmVhZHkgcHJveGllZCxcbiAgLy8gYW5kIHRyaWdnZXIgY2hhbmdlIGZvciBjaGFuZ2VkIHZhbHVlc1xuICBrZXlzID0gT2JqZWN0LmtleXMobmV3RGF0YSlcbiAgaSA9IGtleXMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KGtleSkgJiYgIV8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICAvLyBuZXcgcHJvcGVydHlcbiAgICAgIHRoaXMuX3Byb3h5KGtleSlcbiAgICB9XG4gIH1cbiAgb2xkRGF0YS5fX29iX18ucmVtb3ZlVm0odGhpcylcbiAgT2JzZXJ2ZXIuY3JlYXRlKG5ld0RhdGEpLmFkZFZtKHRoaXMpXG4gIHRoaXMuX2RpZ2VzdCgpXG59XG5cbi8qKlxuICogUHJveHkgYSBwcm9wZXJ0eSwgc28gdGhhdFxuICogdm0ucHJvcCA9PT0gdm0uX2RhdGEucHJvcFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG5leHBvcnRzLl9wcm94eSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgLy8gbmVlZCB0byBzdG9yZSByZWYgdG8gc2VsZiBoZXJlXG4gIC8vIGJlY2F1c2UgdGhlc2UgZ2V0dGVyL3NldHRlcnMgbWlnaHRcbiAgLy8gYmUgY2FsbGVkIGJ5IGNoaWxkIGluc3RhbmNlcyFcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCBrZXksIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIHByb3h5R2V0dGVyICgpIHtcbiAgICAgIHJldHVybiBzZWxmLl9kYXRhW2tleV1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gcHJveHlTZXR0ZXIgKHZhbCkge1xuICAgICAgc2VsZi5fZGF0YVtrZXldID0gdmFsXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFVucHJveHkgYSBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKi9cblxuZXhwb3J0cy5fdW5wcm94eSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgZGVsZXRlIHRoaXNba2V5XVxufVxuXG4vKipcbiAqIEZvcmNlIHVwZGF0ZSBvbiBldmVyeSB3YXRjaGVyIGluIHNjb3BlLlxuICovXG5cbmV4cG9ydHMuX2RpZ2VzdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGkgPSB0aGlzLl93YXRjaGVyTGlzdC5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIHRoaXMuX3dhdGNoZXJMaXN0W2ldLnVwZGF0ZSgpXG4gIH1cbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW5cbiAgaSA9IGNoaWxkcmVuLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICBpZiAoIWNoaWxkLl9yZXBlYXQgJiYgY2hpbGQuJG9wdGlvbnMuaW5oZXJpdCkge1xuICAgICAgY2hpbGQuX2RpZ2VzdCgpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2V0dXAgY29tcHV0ZWQgcHJvcGVydGllcy4gVGhleSBhcmUgZXNzZW50aWFsbHlcbiAqIHNwZWNpYWwgZ2V0dGVyL3NldHRlcnNcbiAqL1xuXG5mdW5jdGlvbiBub29wICgpIHt9XG5leHBvcnRzLl9pbml0Q29tcHV0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjb21wdXRlZCA9IHRoaXMuJG9wdGlvbnMuY29tcHV0ZWRcbiAgaWYgKGNvbXB1dGVkKSB7XG4gICAgZm9yICh2YXIga2V5IGluIGNvbXB1dGVkKSB7XG4gICAgICB2YXIgdXNlckRlZiA9IGNvbXB1dGVkW2tleV1cbiAgICAgIHZhciBkZWYgPSB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiB1c2VyRGVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRlZi5nZXQgPSBfLmJpbmQodXNlckRlZiwgdGhpcylcbiAgICAgICAgZGVmLnNldCA9IG5vb3BcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZi5nZXQgPSB1c2VyRGVmLmdldFxuICAgICAgICAgID8gXy5iaW5kKHVzZXJEZWYuZ2V0LCB0aGlzKVxuICAgICAgICAgIDogbm9vcFxuICAgICAgICBkZWYuc2V0ID0gdXNlckRlZi5zZXRcbiAgICAgICAgICA/IF8uYmluZCh1c2VyRGVmLnNldCwgdGhpcylcbiAgICAgICAgICA6IG5vb3BcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIGRlZilcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXR1cCBpbnN0YW5jZSBtZXRob2RzLiBNZXRob2RzIG11c3QgYmUgYm91bmQgdG8gdGhlXG4gKiBpbnN0YW5jZSBzaW5jZSB0aGV5IG1pZ2h0IGJlIGNhbGxlZCBieSBjaGlsZHJlblxuICogaW5oZXJpdGluZyB0aGVtLlxuICovXG5cbmV4cG9ydHMuX2luaXRNZXRob2RzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbWV0aG9kcyA9IHRoaXMuJG9wdGlvbnMubWV0aG9kc1xuICBpZiAobWV0aG9kcykge1xuICAgIGZvciAodmFyIGtleSBpbiBtZXRob2RzKSB7XG4gICAgICB0aGlzW2tleV0gPSBfLmJpbmQobWV0aG9kc1trZXldLCB0aGlzKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEluaXRpYWxpemUgbWV0YSBpbmZvcm1hdGlvbiBsaWtlICRpbmRleCwgJGtleSAmICR2YWx1ZS5cbiAqL1xuXG5leHBvcnRzLl9pbml0TWV0YSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1ldGFzID0gdGhpcy4kb3B0aW9ucy5fbWV0YVxuICBpZiAobWV0YXMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWV0YXMpIHtcbiAgICAgIHRoaXMuX2RlZmluZU1ldGEoa2V5LCBtZXRhc1trZXldKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIERlZmluZSBhIG1ldGEgcHJvcGVydHksIGUuZyAkaW5kZXgsICRrZXksICR2YWx1ZVxuICogd2hpY2ggb25seSBleGlzdHMgb24gdGhlIHZtIGluc3RhbmNlIGJ1dCBub3QgaW4gJGRhdGEuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICovXG5cbmV4cG9ydHMuX2RlZmluZU1ldGEgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGVwID0gbmV3IERlcCgpXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIG1ldGFHZXR0ZXIgKCkge1xuICAgICAgaWYgKE9ic2VydmVyLnRhcmdldCkge1xuICAgICAgICBPYnNlcnZlci50YXJnZXQuYWRkRGVwKGRlcClcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBtZXRhU2V0dGVyICh2YWwpIHtcbiAgICAgIGlmICh2YWwgIT09IHZhbHVlKSB7XG4gICAgICAgIHZhbHVlID0gdmFsXG4gICAgICAgIGRlcC5ub3RpZnkoKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGVcbnZhciBhcnJheU1ldGhvZHMgPSBPYmplY3QuY3JlYXRlKGFycmF5UHJvdG8pXG5cbi8qKlxuICogSW50ZXJjZXB0IG11dGF0aW5nIG1ldGhvZHMgYW5kIGVtaXQgZXZlbnRzXG4gKi9cblxuO1tcbiAgJ3B1c2gnLFxuICAncG9wJyxcbiAgJ3NoaWZ0JyxcbiAgJ3Vuc2hpZnQnLFxuICAnc3BsaWNlJyxcbiAgJ3NvcnQnLFxuICAncmV2ZXJzZSdcbl1cbi5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgLy8gY2FjaGUgb3JpZ2luYWwgbWV0aG9kXG4gIHZhciBvcmlnaW5hbCA9IGFycmF5UHJvdG9bbWV0aG9kXVxuICBfLmRlZmluZShhcnJheU1ldGhvZHMsIG1ldGhvZCwgZnVuY3Rpb24gbXV0YXRvciAoKSB7XG4gICAgLy8gYXZvaWQgbGVha2luZyBhcmd1bWVudHM6XG4gICAgLy8gaHR0cDovL2pzcGVyZi5jb20vY2xvc3VyZS13aXRoLWFyZ3VtZW50c1xuICAgIHZhciBpID0gYXJndW1lbnRzLmxlbmd0aFxuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGkpXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXVxuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncylcbiAgICB2YXIgb2IgPSB0aGlzLl9fb2JfX1xuICAgIHZhciBpbnNlcnRlZFxuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICBjYXNlICdwdXNoJzpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICd1bnNoaWZ0JzpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdzcGxpY2UnOlxuICAgICAgICBpbnNlcnRlZCA9IGFyZ3Muc2xpY2UoMilcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgaWYgKGluc2VydGVkKSBvYi5vYnNlcnZlQXJyYXkoaW5zZXJ0ZWQpXG4gICAgLy8gbm90aWZ5IGNoYW5nZVxuICAgIG9iLm5vdGlmeSgpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9KVxufSlcblxuLyoqXG4gKiBTd2FwIHRoZSBlbGVtZW50IGF0IHRoZSBnaXZlbiBpbmRleCB3aXRoIGEgbmV3IHZhbHVlXG4gKiBhbmQgZW1pdHMgY29ycmVzcG9uZGluZyBldmVudC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHsqfSAtIHJlcGxhY2VkIGVsZW1lbnRcbiAqL1xuXG5fLmRlZmluZShcbiAgYXJyYXlQcm90byxcbiAgJyRzZXQnLFxuICBmdW5jdGlvbiAkc2V0IChpbmRleCwgdmFsKSB7XG4gICAgaWYgKGluZGV4ID49IHRoaXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmxlbmd0aCA9IGluZGV4ICsgMVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDEsIHZhbClbMF1cbiAgfVxuKVxuXG4vKipcbiAqIENvbnZlbmllbmNlIG1ldGhvZCB0byByZW1vdmUgdGhlIGVsZW1lbnQgYXQgZ2l2ZW4gaW5kZXguXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbl8uZGVmaW5lKFxuICBhcnJheVByb3RvLFxuICAnJHJlbW92ZScsXG4gIGZ1bmN0aW9uICRyZW1vdmUgKGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHtcbiAgICAgIGluZGV4ID0gdGhpcy5pbmRleE9mKGluZGV4KVxuICAgIH1cbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAxKVswXVxuICAgIH1cbiAgfVxuKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TWV0aG9kcyIsInZhciB1aWQgPSAwXG52YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIEEgZGVwIGlzIGFuIG9ic2VydmFibGUgdGhhdCBjYW4gaGF2ZSBtdWx0aXBsZVxuICogZGlyZWN0aXZlcyBzdWJzY3JpYmluZyB0byBpdC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBEZXAgKCkge1xuICB0aGlzLmlkID0gKyt1aWRcbiAgdGhpcy5zdWJzID0gW11cbn1cblxudmFyIHAgPSBEZXAucHJvdG90eXBlXG5cbi8qKlxuICogQWRkIGEgZGlyZWN0aXZlIHN1YnNjcmliZXIuXG4gKlxuICogQHBhcmFtIHtEaXJlY3RpdmV9IHN1YlxuICovXG5cbnAuYWRkU3ViID0gZnVuY3Rpb24gKHN1Yikge1xuICB0aGlzLnN1YnMucHVzaChzdWIpXG59XG5cbi8qKlxuICogUmVtb3ZlIGEgZGlyZWN0aXZlIHN1YnNjcmliZXIuXG4gKlxuICogQHBhcmFtIHtEaXJlY3RpdmV9IHN1YlxuICovXG5cbnAucmVtb3ZlU3ViID0gZnVuY3Rpb24gKHN1Yikge1xuICBpZiAodGhpcy5zdWJzLmxlbmd0aCkge1xuICAgIHZhciBpID0gdGhpcy5zdWJzLmluZGV4T2Yoc3ViKVxuICAgIGlmIChpID4gLTEpIHRoaXMuc3Vicy5zcGxpY2UoaSwgMSlcbiAgfVxufVxuXG4vKipcbiAqIE5vdGlmeSBhbGwgc3Vic2NyaWJlcnMgb2YgYSBuZXcgdmFsdWUuXG4gKi9cblxucC5ub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIHN0YWJsaXplIHRoZSBzdWJzY3JpYmVyIGxpc3QgZmlyc3RcbiAgdmFyIHN1YnMgPSBfLnRvQXJyYXkodGhpcy5zdWJzKVxuICBmb3IgKHZhciBpID0gMCwgbCA9IHN1YnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgc3Vic1tpXS51cGRhdGUoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVwIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIERlcCA9IHJlcXVpcmUoJy4vZGVwJylcbnZhciBhcnJheU1ldGhvZHMgPSByZXF1aXJlKCcuL2FycmF5JylcbnZhciBhcnJheUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhcnJheU1ldGhvZHMpXG5yZXF1aXJlKCcuL29iamVjdCcpXG5cbnZhciB1aWQgPSAwXG5cbi8qKlxuICogVHlwZSBlbnVtc1xuICovXG5cbnZhciBBUlJBWSAgPSAwXG52YXIgT0JKRUNUID0gMVxuXG4vKipcbiAqIEF1Z21lbnQgYW4gdGFyZ2V0IE9iamVjdCBvciBBcnJheSBieSBpbnRlcmNlcHRpbmdcbiAqIHRoZSBwcm90b3R5cGUgY2hhaW4gdXNpbmcgX19wcm90b19fXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IHRhcmdldFxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvXG4gKi9cblxuZnVuY3Rpb24gcHJvdG9BdWdtZW50ICh0YXJnZXQsIHNyYykge1xuICB0YXJnZXQuX19wcm90b19fID0gc3JjXG59XG5cbi8qKlxuICogQXVnbWVudCBhbiB0YXJnZXQgT2JqZWN0IG9yIEFycmF5IGJ5IGRlZmluaW5nXG4gKiBoaWRkZW4gcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gdGFyZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG9cbiAqL1xuXG5mdW5jdGlvbiBjb3B5QXVnbWVudCAodGFyZ2V0LCBzcmMsIGtleXMpIHtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICB2YXIga2V5XG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgXy5kZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldKVxuICB9XG59XG5cbi8qKlxuICogT2JzZXJ2ZXIgY2xhc3MgdGhhdCBhcmUgYXR0YWNoZWQgdG8gZWFjaCBvYnNlcnZlZFxuICogb2JqZWN0LiBPbmNlIGF0dGFjaGVkLCB0aGUgb2JzZXJ2ZXIgY29udmVydHMgdGFyZ2V0XG4gKiBvYmplY3QncyBwcm9wZXJ0eSBrZXlzIGludG8gZ2V0dGVyL3NldHRlcnMgdGhhdFxuICogY29sbGVjdCBkZXBlbmRlbmNpZXMgYW5kIGRpc3BhdGNoZXMgdXBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gdmFsdWVcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBPYnNlcnZlciAodmFsdWUsIHR5cGUpIHtcbiAgdGhpcy5pZCA9ICsrdWlkXG4gIHRoaXMudmFsdWUgPSB2YWx1ZVxuICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgdGhpcy5kZXBzID0gW11cbiAgXy5kZWZpbmUodmFsdWUsICdfX29iX18nLCB0aGlzKVxuICBpZiAodHlwZSA9PT0gQVJSQVkpIHtcbiAgICB2YXIgYXVnbWVudCA9IGNvbmZpZy5wcm90byAmJiBfLmhhc1Byb3RvXG4gICAgICA/IHByb3RvQXVnbWVudFxuICAgICAgOiBjb3B5QXVnbWVudFxuICAgIGF1Z21lbnQodmFsdWUsIGFycmF5TWV0aG9kcywgYXJyYXlLZXlzKVxuICAgIHRoaXMub2JzZXJ2ZUFycmF5KHZhbHVlKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09IE9CSkVDVCkge1xuICAgIHRoaXMud2Fsayh2YWx1ZSlcbiAgfVxufVxuXG5PYnNlcnZlci50YXJnZXQgPSBudWxsXG5cbnZhciBwID0gT2JzZXJ2ZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXR0ZW1wdCB0byBjcmVhdGUgYW4gb2JzZXJ2ZXIgaW5zdGFuY2UgZm9yIGEgdmFsdWUsXG4gKiByZXR1cm5zIHRoZSBuZXcgb2JzZXJ2ZXIgaWYgc3VjY2Vzc2Z1bGx5IG9ic2VydmVkLFxuICogb3IgdGhlIGV4aXN0aW5nIG9ic2VydmVyIGlmIHRoZSB2YWx1ZSBhbHJlYWR5IGhhcyBvbmUuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7T2JzZXJ2ZXJ8dW5kZWZpbmVkfVxuICogQHN0YXRpY1xuICovXG5cbk9ic2VydmVyLmNyZWF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAoXG4gICAgdmFsdWUgJiZcbiAgICB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgnX19vYl9fJykgJiZcbiAgICB2YWx1ZS5fX29iX18gaW5zdGFuY2VvZiBPYnNlcnZlclxuICApIHtcbiAgICByZXR1cm4gdmFsdWUuX19vYl9fXG4gIH0gZWxzZSBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2ZXIodmFsdWUsIEFSUkFZKVxuICB9IGVsc2UgaWYgKFxuICAgIF8uaXNQbGFpbk9iamVjdCh2YWx1ZSkgJiZcbiAgICAhdmFsdWUuX2lzVnVlIC8vIGF2b2lkIFZ1ZSBpbnN0YW5jZVxuICApIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmVyKHZhbHVlLCBPQkpFQ1QpXG4gIH1cbn1cblxuLyoqXG4gKiBXYWxrIHRocm91Z2ggZWFjaCBwcm9wZXJ0eSBhbmQgY29udmVydCB0aGVtIGludG9cbiAqIGdldHRlci9zZXR0ZXJzLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSBjYWxsZWQgd2hlblxuICogdmFsdWUgdHlwZSBpcyBPYmplY3QuIFByb3BlcnRpZXMgcHJlZml4ZWQgd2l0aCBgJGAgb3IgYF9gXG4gKiBhbmQgYWNjZXNzb3IgcHJvcGVydGllcyBhcmUgaWdub3JlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKi9cblxucC53YWxrID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iailcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICB2YXIga2V5LCBwcmVmaXhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBwcmVmaXggPSBrZXkuY2hhckNvZGVBdCgwKVxuICAgIGlmIChwcmVmaXggIT09IDB4MjQgJiYgcHJlZml4ICE9PSAweDVGKSB7IC8vIHNraXAgJCBvciBfXG4gICAgICB0aGlzLmNvbnZlcnQoa2V5LCBvYmpba2V5XSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUcnkgdG8gY2FyZXRlIGFuIG9ic2VydmVyIGZvciBhIGNoaWxkIHZhbHVlLFxuICogYW5kIGlmIHZhbHVlIGlzIGFycmF5LCBsaW5rIGRlcCB0byB0aGUgYXJyYXkuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0RlcHx1bmRlZmluZWR9XG4gKi9cblxucC5vYnNlcnZlID0gZnVuY3Rpb24gKHZhbCkge1xuICByZXR1cm4gT2JzZXJ2ZXIuY3JlYXRlKHZhbClcbn1cblxuLyoqXG4gKiBPYnNlcnZlIGEgbGlzdCBvZiBBcnJheSBpdGVtcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtc1xuICovXG5cbnAub2JzZXJ2ZUFycmF5ID0gZnVuY3Rpb24gKGl0ZW1zKSB7XG4gIHZhciBpID0gaXRlbXMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB0aGlzLm9ic2VydmUoaXRlbXNbaV0pXG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcHJvcGVydHkgaW50byBnZXR0ZXIvc2V0dGVyIHNvIHdlIGNhbiBlbWl0XG4gKiB0aGUgZXZlbnRzIHdoZW4gdGhlIHByb3BlcnR5IGlzIGFjY2Vzc2VkL2NoYW5nZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5wLmNvbnZlcnQgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgdmFyIG9iID0gdGhpc1xuICB2YXIgY2hpbGRPYiA9IG9iLm9ic2VydmUodmFsKVxuICB2YXIgZGVwID0gbmV3IERlcCgpXG4gIGlmIChjaGlsZE9iKSB7XG4gICAgY2hpbGRPYi5kZXBzLnB1c2goZGVwKVxuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYi52YWx1ZSwga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBPYnNlcnZlci50YXJnZXQgaXMgYSB3YXRjaGVyIHdob3NlIGdldHRlciBpc1xuICAgICAgLy8gY3VycmVudGx5IGJlaW5nIGV2YWx1YXRlZC5cbiAgICAgIGlmIChvYi5hY3RpdmUgJiYgT2JzZXJ2ZXIudGFyZ2V0KSB7XG4gICAgICAgIE9ic2VydmVyLnRhcmdldC5hZGREZXAoZGVwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbFxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsID09PSB2YWwpIHJldHVyblxuICAgICAgLy8gcmVtb3ZlIGRlcCBmcm9tIG9sZCB2YWx1ZVxuICAgICAgdmFyIG9sZENoaWxkT2IgPSB2YWwgJiYgdmFsLl9fb2JfX1xuICAgICAgaWYgKG9sZENoaWxkT2IpIHtcbiAgICAgICAgdmFyIG9sZERlcHMgPSBvbGRDaGlsZE9iLmRlcHNcbiAgICAgICAgb2xkRGVwcy5zcGxpY2Uob2xkRGVwcy5pbmRleE9mKGRlcCksIDEpXG4gICAgICB9XG4gICAgICB2YWwgPSBuZXdWYWxcbiAgICAgIC8vIGFkZCBkZXAgdG8gbmV3IHZhbHVlXG4gICAgICB2YXIgbmV3Q2hpbGRPYiA9IG9iLm9ic2VydmUobmV3VmFsKVxuICAgICAgaWYgKG5ld0NoaWxkT2IpIHtcbiAgICAgICAgbmV3Q2hpbGRPYi5kZXBzLnB1c2goZGVwKVxuICAgICAgfVxuICAgICAgZGVwLm5vdGlmeSgpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIE5vdGlmeSBjaGFuZ2Ugb24gYWxsIHNlbGYgZGVwcyBvbiBhbiBvYnNlcnZlci5cbiAqIFRoaXMgaXMgY2FsbGVkIHdoZW4gYSBtdXRhYmxlIHZhbHVlIG11dGF0ZXMuIGUuZy5cbiAqIHdoZW4gYW4gQXJyYXkncyBtdXRhdGluZyBtZXRob2RzIGFyZSBjYWxsZWQsIG9yIGFuXG4gKiBPYmplY3QncyAkYWRkLyRkZWxldGUgYXJlIGNhbGxlZC5cbiAqL1xuXG5wLm5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGRlcHMgPSB0aGlzLmRlcHNcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBkZXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGRlcHNbaV0ubm90aWZ5KClcbiAgfVxufVxuXG4vKipcbiAqIEFkZCBhbiBvd25lciB2bSwgc28gdGhhdCB3aGVuICRhZGQvJGRlbGV0ZSBtdXRhdGlvbnNcbiAqIGhhcHBlbiB3ZSBjYW4gbm90aWZ5IG93bmVyIHZtcyB0byBwcm94eSB0aGUga2V5cyBhbmRcbiAqIGRpZ2VzdCB0aGUgd2F0Y2hlcnMuIFRoaXMgaXMgb25seSBjYWxsZWQgd2hlbiB0aGUgb2JqZWN0XG4gKiBpcyBvYnNlcnZlZCBhcyBhbiBpbnN0YW5jZSdzIHJvb3QgJGRhdGEuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKi9cblxucC5hZGRWbSA9IGZ1bmN0aW9uICh2bSkge1xuICAodGhpcy52bXMgPSB0aGlzLnZtcyB8fCBbXSkucHVzaCh2bSlcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW4gb3duZXIgdm0uIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIG9iamVjdCBpc1xuICogc3dhcHBlZCBvdXQgYXMgYW4gaW5zdGFuY2UncyAkZGF0YSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKi9cblxucC5yZW1vdmVWbSA9IGZ1bmN0aW9uICh2bSkge1xuICB0aGlzLnZtcy5zcGxpY2UodGhpcy52bXMuaW5kZXhPZih2bSksIDEpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZXJ2ZXJcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgb2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlXG5cbi8qKlxuICogQWRkIGEgbmV3IHByb3BlcnR5IHRvIGFuIG9ic2VydmVkIG9iamVjdFxuICogYW5kIGVtaXRzIGNvcnJlc3BvbmRpbmcgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHB1YmxpY1xuICovXG5cbl8uZGVmaW5lKFxuICBvYmpQcm90byxcbiAgJyRhZGQnLFxuICBmdW5jdGlvbiAkYWRkIChrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHJldHVyblxuICAgIHZhciBvYiA9IHRoaXMuX19vYl9fXG4gICAgaWYgKCFvYiB8fCBfLmlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgb2IuY29udmVydChrZXksIHZhbClcbiAgICBpZiAob2Iudm1zKSB7XG4gICAgICB2YXIgaSA9IG9iLnZtcy5sZW5ndGhcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdmFyIHZtID0gb2Iudm1zW2ldXG4gICAgICAgIHZtLl9wcm94eShrZXkpXG4gICAgICAgIHZtLl9kaWdlc3QoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvYi5ub3RpZnkoKVxuICAgIH1cbiAgfVxuKVxuXG4vKipcbiAqIERlbGV0ZXMgYSBwcm9wZXJ0eSBmcm9tIGFuIG9ic2VydmVkIG9iamVjdFxuICogYW5kIGVtaXRzIGNvcnJlc3BvbmRpbmcgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcHVibGljXG4gKi9cblxuXy5kZWZpbmUoXG4gIG9ialByb3RvLFxuICAnJGRlbGV0ZScsXG4gIGZ1bmN0aW9uICRkZWxldGUgKGtleSkge1xuICAgIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm5cbiAgICBkZWxldGUgdGhpc1trZXldXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICBpZiAoIW9iIHx8IF8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKG9iLnZtcykge1xuICAgICAgdmFyIGkgPSBvYi52bXMubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciB2bSA9IG9iLnZtc1tpXVxuICAgICAgICB2bS5fdW5wcm94eShrZXkpXG4gICAgICAgIHZtLl9kaWdlc3QoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvYi5ub3RpZnkoKVxuICAgIH1cbiAgfVxuKSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgY2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbnZhciBhcmdSRSA9IC9eW15cXHtcXD9dKyR8XidbXiddKickfF5cIlteXCJdKlwiJC9cbnZhciBmaWx0ZXJUb2tlblJFID0gL1teXFxzJ1wiXSt8J1teJ10rJ3xcIlteXCJdK1wiL2dcblxuLyoqXG4gKiBQYXJzZXIgc3RhdGVcbiAqL1xuXG52YXIgc3RyXG52YXIgYywgaSwgbFxudmFyIGluU2luZ2xlXG52YXIgaW5Eb3VibGVcbnZhciBjdXJseVxudmFyIHNxdWFyZVxudmFyIHBhcmVuXG52YXIgYmVnaW5cbnZhciBhcmdJbmRleFxudmFyIGRpcnNcbnZhciBkaXJcbnZhciBsYXN0RmlsdGVySW5kZXhcbnZhciBhcmdcblxuLyoqXG4gKiBQdXNoIGEgZGlyZWN0aXZlIG9iamVjdCBpbnRvIHRoZSByZXN1bHQgQXJyYXlcbiAqL1xuXG5mdW5jdGlvbiBwdXNoRGlyICgpIHtcbiAgZGlyLnJhdyA9IHN0ci5zbGljZShiZWdpbiwgaSkudHJpbSgpXG4gIGlmIChkaXIuZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZGlyLmV4cHJlc3Npb24gPSBzdHIuc2xpY2UoYXJnSW5kZXgsIGkpLnRyaW0oKVxuICB9IGVsc2UgaWYgKGxhc3RGaWx0ZXJJbmRleCAhPT0gYmVnaW4pIHtcbiAgICBwdXNoRmlsdGVyKClcbiAgfVxuICBpZiAoaSA9PT0gMCB8fCBkaXIuZXhwcmVzc2lvbikge1xuICAgIGRpcnMucHVzaChkaXIpXG4gIH1cbn1cblxuLyoqXG4gKiBQdXNoIGEgZmlsdGVyIHRvIHRoZSBjdXJyZW50IGRpcmVjdGl2ZSBvYmplY3RcbiAqL1xuXG5mdW5jdGlvbiBwdXNoRmlsdGVyICgpIHtcbiAgdmFyIGV4cCA9IHN0ci5zbGljZShsYXN0RmlsdGVySW5kZXgsIGkpLnRyaW0oKVxuICB2YXIgZmlsdGVyXG4gIGlmIChleHApIHtcbiAgICBmaWx0ZXIgPSB7fVxuICAgIHZhciB0b2tlbnMgPSBleHAubWF0Y2goZmlsdGVyVG9rZW5SRSlcbiAgICBmaWx0ZXIubmFtZSA9IHRva2Vuc1swXVxuICAgIGZpbHRlci5hcmdzID0gdG9rZW5zLmxlbmd0aCA+IDEgPyB0b2tlbnMuc2xpY2UoMSkgOiBudWxsXG4gIH1cbiAgaWYgKGZpbHRlcikge1xuICAgIChkaXIuZmlsdGVycyA9IGRpci5maWx0ZXJzIHx8IFtdKS5wdXNoKGZpbHRlcilcbiAgfVxuICBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxufVxuXG4vKipcbiAqIFBhcnNlIGEgZGlyZWN0aXZlIHN0cmluZyBpbnRvIGFuIEFycmF5IG9mIEFTVC1saWtlXG4gKiBvYmplY3RzIHJlcHJlc2VudGluZyBkaXJlY3RpdmVzLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogXCJjbGljazogYSA9IGEgKyAxIHwgdXBwZXJjYXNlXCIgd2lsbCB5aWVsZDpcbiAqIHtcbiAqICAgYXJnOiAnY2xpY2snLFxuICogICBleHByZXNzaW9uOiAnYSA9IGEgKyAxJyxcbiAqICAgZmlsdGVyczogW1xuICogICAgIHsgbmFtZTogJ3VwcGVyY2FzZScsIGFyZ3M6IG51bGwgfVxuICogICBdXG4gKiB9XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKHMpIHtcblxuICB2YXIgaGl0ID0gY2FjaGUuZ2V0KHMpXG4gIGlmIChoaXQpIHtcbiAgICByZXR1cm4gaGl0XG4gIH1cblxuICAvLyByZXNldCBwYXJzZXIgc3RhdGVcbiAgc3RyID0gc1xuICBpblNpbmdsZSA9IGluRG91YmxlID0gZmFsc2VcbiAgY3VybHkgPSBzcXVhcmUgPSBwYXJlbiA9IGJlZ2luID0gYXJnSW5kZXggPSAwXG4gIGxhc3RGaWx0ZXJJbmRleCA9IDBcbiAgZGlycyA9IFtdXG4gIGRpciA9IHt9XG4gIGFyZyA9IG51bGxcblxuICBmb3IgKGkgPSAwLCBsID0gc3RyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChpblNpbmdsZSkge1xuICAgICAgLy8gY2hlY2sgc2luZ2xlIHF1b3RlXG4gICAgICBpZiAoYyA9PT0gMHgyNykgaW5TaW5nbGUgPSAhaW5TaW5nbGVcbiAgICB9IGVsc2UgaWYgKGluRG91YmxlKSB7XG4gICAgICAvLyBjaGVjayBkb3VibGUgcXVvdGVcbiAgICAgIGlmIChjID09PSAweDIyKSBpbkRvdWJsZSA9ICFpbkRvdWJsZVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjID09PSAweDJDICYmIC8vIGNvbW1hXG4gICAgICAhcGFyZW4gJiYgIWN1cmx5ICYmICFzcXVhcmVcbiAgICApIHtcbiAgICAgIC8vIHJlYWNoZWQgdGhlIGVuZCBvZiBhIGRpcmVjdGl2ZVxuICAgICAgcHVzaERpcigpXG4gICAgICAvLyByZXNldCAmIHNraXAgdGhlIGNvbW1hXG4gICAgICBkaXIgPSB7fVxuICAgICAgYmVnaW4gPSBhcmdJbmRleCA9IGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGMgPT09IDB4M0EgJiYgLy8gY29sb25cbiAgICAgICFkaXIuZXhwcmVzc2lvbiAmJlxuICAgICAgIWRpci5hcmdcbiAgICApIHtcbiAgICAgIC8vIGFyZ3VtZW50XG4gICAgICBhcmcgPSBzdHIuc2xpY2UoYmVnaW4sIGkpLnRyaW0oKVxuICAgICAgLy8gdGVzdCBmb3IgdmFsaWQgYXJndW1lbnQgaGVyZVxuICAgICAgLy8gc2luY2Ugd2UgbWF5IGhhdmUgY2F1Z2h0IHN0dWZmIGxpa2UgZmlyc3QgaGFsZiBvZlxuICAgICAgLy8gYW4gb2JqZWN0IGxpdGVyYWwgb3IgYSB0ZXJuYXJ5IGV4cHJlc3Npb24uXG4gICAgICBpZiAoYXJnUkUudGVzdChhcmcpKSB7XG4gICAgICAgIGFyZ0luZGV4ID0gaSArIDFcbiAgICAgICAgZGlyLmFyZyA9IF8uc3RyaXBRdW90ZXMoYXJnKSB8fCBhcmdcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgYyA9PT0gMHg3QyAmJiAvLyBwaXBlXG4gICAgICBzdHIuY2hhckNvZGVBdChpICsgMSkgIT09IDB4N0MgJiZcbiAgICAgIHN0ci5jaGFyQ29kZUF0KGkgLSAxKSAhPT0gMHg3Q1xuICAgICkge1xuICAgICAgaWYgKGRpci5leHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gZmlyc3QgZmlsdGVyLCBlbmQgb2YgZXhwcmVzc2lvblxuICAgICAgICBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxuICAgICAgICBkaXIuZXhwcmVzc2lvbiA9IHN0ci5zbGljZShhcmdJbmRleCwgaSkudHJpbSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhbHJlYWR5IGhhcyBmaWx0ZXJcbiAgICAgICAgcHVzaEZpbHRlcigpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICBjYXNlIDB4MjI6IGluRG91YmxlID0gdHJ1ZTsgYnJlYWsgLy8gXCJcbiAgICAgICAgY2FzZSAweDI3OiBpblNpbmdsZSA9IHRydWU7IGJyZWFrIC8vICdcbiAgICAgICAgY2FzZSAweDI4OiBwYXJlbisrOyBicmVhayAgICAgICAgIC8vIChcbiAgICAgICAgY2FzZSAweDI5OiBwYXJlbi0tOyBicmVhayAgICAgICAgIC8vIClcbiAgICAgICAgY2FzZSAweDVCOiBzcXVhcmUrKzsgYnJlYWsgICAgICAgIC8vIFtcbiAgICAgICAgY2FzZSAweDVEOiBzcXVhcmUtLTsgYnJlYWsgICAgICAgIC8vIF1cbiAgICAgICAgY2FzZSAweDdCOiBjdXJseSsrOyBicmVhayAgICAgICAgIC8vIHtcbiAgICAgICAgY2FzZSAweDdEOiBjdXJseS0tOyBicmVhayAgICAgICAgIC8vIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaSA9PT0gMCB8fCBiZWdpbiAhPT0gaSkge1xuICAgIHB1c2hEaXIoKVxuICB9XG5cbiAgY2FjaGUucHV0KHMsIGRpcnMpXG4gIHJldHVybiBkaXJzXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9wYXRoJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciBleHByZXNzaW9uQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcblxudmFyIGtleXdvcmRzID1cbiAgJ01hdGgsRGF0ZSxicmVhayxjYXNlLGNhdGNoLGNvbnRpbnVlLGRlYnVnZ2VyLGRlZmF1bHQsJyArXG4gICdkZWxldGUsZG8sZWxzZSxmYWxzZSxmaW5hbGx5LGZvcixmdW5jdGlvbixpZixpbiwnICtcbiAgJ2luc3RhbmNlb2YsbmV3LG51bGwscmV0dXJuLHN3aXRjaCx0aGlzLHRocm93LHRydWUsdHJ5LCcgK1xuICAndHlwZW9mLHZhcix2b2lkLHdoaWxlLHdpdGgsdW5kZWZpbmVkLGFic3RyYWN0LGJvb2xlYW4sJyArXG4gICdieXRlLGNoYXIsY2xhc3MsY29uc3QsZG91YmxlLGVudW0sZXhwb3J0LGV4dGVuZHMsJyArXG4gICdmaW5hbCxmbG9hdCxnb3RvLGltcGxlbWVudHMsaW1wb3J0LGludCxpbnRlcmZhY2UsbG9uZywnICtcbiAgJ25hdGl2ZSxwYWNrYWdlLHByaXZhdGUscHJvdGVjdGVkLHB1YmxpYyxzaG9ydCxzdGF0aWMsJyArXG4gICdzdXBlcixzeW5jaHJvbml6ZWQsdGhyb3dzLHRyYW5zaWVudCx2b2xhdGlsZSwnICtcbiAgJ2FyZ3VtZW50cyxsZXQseWllbGQnXG5cbnZhciB3c1JFID0gL1xccy9nXG52YXIgbmV3bGluZVJFID0gL1xcbi9nXG52YXIgc2F2ZVJFID0gL1tcXHssXVxccypbXFx3XFwkX10rXFxzKjp8KCdbXiddKid8XCJbXlwiXSpcIil8bmV3IC9nXG52YXIgcmVzdG9yZVJFID0gL1wiKFxcZCspXCIvZ1xudmFyIHBhdGhUZXN0UkUgPSAvXltBLVphLXpfJF1bXFx3JF0qKFxcLltBLVphLXpfJF1bXFx3JF0qfFxcWycuKj8nXFxdfFxcW1wiLio/XCJcXF18XFxbXFxkK1xcXSkqJC9cbnZhciBwYXRoUmVwbGFjZVJFID0gL1teXFx3JFxcLl0oW0EtWmEtel8kXVtcXHckXSooXFwuW0EtWmEtel8kXVtcXHckXSp8XFxbJy4qPydcXF18XFxbXCIuKj9cIlxcXSkqKS9nXG52YXIga2V5d29yZHNSRSA9IG5ldyBSZWdFeHAoJ14oJyArIGtleXdvcmRzLnJlcGxhY2UoLywvZywgJ1xcXFxifCcpICsgJ1xcXFxiKScpXG52YXIgYm9vbGVhbkxpdGVyYWxSRSA9IC9eKHRydWV8ZmFsc2UpJC9cblxuLyoqXG4gKiBTYXZlIC8gUmV3cml0ZSAvIFJlc3RvcmVcbiAqXG4gKiBXaGVuIHJld3JpdGluZyBwYXRocyBmb3VuZCBpbiBhbiBleHByZXNzaW9uLCBpdCBpc1xuICogcG9zc2libGUgZm9yIHRoZSBzYW1lIGxldHRlciBzZXF1ZW5jZXMgdG8gYmUgZm91bmQgaW5cbiAqIHN0cmluZ3MgYW5kIE9iamVjdCBsaXRlcmFsIHByb3BlcnR5IGtleXMuIFRoZXJlZm9yZSB3ZVxuICogcmVtb3ZlIGFuZCBzdG9yZSB0aGVzZSBwYXJ0cyBpbiBhIHRlbXBvcmFyeSBhcnJheSwgYW5kXG4gKiByZXN0b3JlIHRoZW0gYWZ0ZXIgdGhlIHBhdGggcmV3cml0ZS5cbiAqL1xuXG52YXIgc2F2ZWQgPSBbXVxuXG4vKipcbiAqIFNhdmUgcmVwbGFjZXJcbiAqXG4gKiBUaGUgc2F2ZSByZWdleCBjYW4gbWF0Y2ggdHdvIHBvc3NpYmxlIGNhc2VzOlxuICogMS4gQW4gb3BlbmluZyBvYmplY3QgbGl0ZXJhbFxuICogMi4gQSBzdHJpbmdcbiAqIElmIG1hdGNoZWQgYXMgYSBwbGFpbiBzdHJpbmcsIHdlIG5lZWQgdG8gZXNjYXBlIGl0c1xuICogbmV3bGluZXMsIHNpbmNlIHRoZSBzdHJpbmcgbmVlZHMgdG8gYmUgcHJlc2VydmVkIHdoZW5cbiAqIGdlbmVyYXRpbmcgdGhlIGZ1bmN0aW9uIGJvZHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGlzU3RyaW5nIC0gc3RyIGlmIG1hdGNoZWQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ30gLSBwbGFjZWhvbGRlciB3aXRoIGluZGV4XG4gKi9cblxuZnVuY3Rpb24gc2F2ZSAoc3RyLCBpc1N0cmluZykge1xuICB2YXIgaSA9IHNhdmVkLmxlbmd0aFxuICBzYXZlZFtpXSA9IGlzU3RyaW5nXG4gICAgPyBzdHIucmVwbGFjZShuZXdsaW5lUkUsICdcXFxcbicpXG4gICAgOiBzdHJcbiAgcmV0dXJuICdcIicgKyBpICsgJ1wiJ1xufVxuXG4vKipcbiAqIFBhdGggcmV3cml0ZSByZXBsYWNlclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByYXdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiByZXdyaXRlIChyYXcpIHtcbiAgdmFyIGMgPSByYXcuY2hhckF0KDApXG4gIHZhciBwYXRoID0gcmF3LnNsaWNlKDEpXG4gIGlmIChrZXl3b3Jkc1JFLnRlc3QocGF0aCkpIHtcbiAgICByZXR1cm4gcmF3XG4gIH0gZWxzZSB7XG4gICAgcGF0aCA9IHBhdGguaW5kZXhPZignXCInKSA+IC0xXG4gICAgICA/IHBhdGgucmVwbGFjZShyZXN0b3JlUkUsIHJlc3RvcmUpXG4gICAgICA6IHBhdGhcbiAgICByZXR1cm4gYyArICdzY29wZS4nICsgcGF0aFxuICB9XG59XG5cbi8qKlxuICogUmVzdG9yZSByZXBsYWNlclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBpIC0gbWF0Y2hlZCBzYXZlIGluZGV4XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gcmVzdG9yZSAoc3RyLCBpKSB7XG4gIHJldHVybiBzYXZlZFtpXVxufVxuXG4vKipcbiAqIFJld3JpdGUgYW4gZXhwcmVzc2lvbiwgcHJlZml4aW5nIGFsbCBwYXRoIGFjY2Vzc29ycyB3aXRoXG4gKiBgc2NvcGUuYCBhbmQgZ2VuZXJhdGUgZ2V0dGVyL3NldHRlciBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHBhcmFtIHtCb29sZWFufSBuZWVkU2V0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlRXhwRm5zIChleHAsIG5lZWRTZXQpIHtcbiAgLy8gcmVzZXQgc3RhdGVcbiAgc2F2ZWQubGVuZ3RoID0gMFxuICAvLyBzYXZlIHN0cmluZ3MgYW5kIG9iamVjdCBsaXRlcmFsIGtleXNcbiAgdmFyIGJvZHkgPSBleHBcbiAgICAucmVwbGFjZShzYXZlUkUsIHNhdmUpXG4gICAgLnJlcGxhY2Uod3NSRSwgJycpXG4gIC8vIHJld3JpdGUgYWxsIHBhdGhzXG4gIC8vIHBhZCAxIHNwYWNlIGhlcmUgYmVjYXVlIHRoZSByZWdleCBtYXRjaGVzIDEgZXh0cmEgY2hhclxuICBib2R5ID0gKCcgJyArIGJvZHkpXG4gICAgLnJlcGxhY2UocGF0aFJlcGxhY2VSRSwgcmV3cml0ZSlcbiAgICAucmVwbGFjZShyZXN0b3JlUkUsIHJlc3RvcmUpXG4gIHZhciBnZXR0ZXIgPSBtYWtlR2V0dGVyKGJvZHkpXG4gIGlmIChnZXR0ZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICBib2R5OiBib2R5LFxuICAgICAgc2V0OiBuZWVkU2V0XG4gICAgICAgID8gbWFrZVNldHRlcihib2R5KVxuICAgICAgICA6IG51bGxcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIGdldHRlciBzZXR0ZXJzIGZvciBhIHNpbXBsZSBwYXRoLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVQYXRoRm5zIChleHApIHtcbiAgdmFyIGdldHRlciwgcGF0aFxuICBpZiAoZXhwLmluZGV4T2YoJ1snKSA8IDApIHtcbiAgICAvLyByZWFsbHkgc2ltcGxlIHBhdGhcbiAgICBwYXRoID0gZXhwLnNwbGl0KCcuJylcbiAgICBnZXR0ZXIgPSBQYXRoLmNvbXBpbGVHZXR0ZXIocGF0aClcbiAgfSBlbHNlIHtcbiAgICAvLyBkbyB0aGUgcmVhbCBwYXJzaW5nXG4gICAgcGF0aCA9IFBhdGgucGFyc2UoZXhwKVxuICAgIGdldHRlciA9IHBhdGguZ2V0XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQ6IGdldHRlcixcbiAgICAvLyBhbHdheXMgZ2VuZXJhdGUgc2V0dGVyIGZvciBzaW1wbGUgcGF0aHNcbiAgICBzZXQ6IGZ1bmN0aW9uIChvYmosIHZhbCkge1xuICAgICAgUGF0aC5zZXQob2JqLCBwYXRoLCB2YWwpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQnVpbGQgYSBnZXR0ZXIgZnVuY3Rpb24uIFJlcXVpcmVzIGV2YWwuXG4gKlxuICogV2UgaXNvbGF0ZSB0aGUgdHJ5L2NhdGNoIHNvIGl0IGRvZXNuJ3QgYWZmZWN0IHRoZVxuICogb3B0aW1pemF0aW9uIG9mIHRoZSBwYXJzZSBmdW5jdGlvbiB3aGVuIGl0IGlzIG5vdCBjYWxsZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGJvZHlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlR2V0dGVyIChib2R5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignc2NvcGUnLCAncmV0dXJuICcgKyBib2R5ICsgJzsnKVxuICB9IGNhdGNoIChlKSB7XG4gICAgXy53YXJuKFxuICAgICAgJ0ludmFsaWQgZXhwcmVzc2lvbi4gJyArXG4gICAgICAnR2VuZXJhdGVkIGZ1bmN0aW9uIGJvZHk6ICcgKyBib2R5XG4gICAgKVxuICB9XG59XG5cbi8qKlxuICogQnVpbGQgYSBzZXR0ZXIgZnVuY3Rpb24uXG4gKlxuICogVGhpcyBpcyBvbmx5IG5lZWRlZCBpbiByYXJlIHNpdHVhdGlvbnMgbGlrZSBcImFbYl1cIiB3aGVyZVxuICogYSBzZXR0YWJsZSBwYXRoIHJlcXVpcmVzIGR5bmFtaWMgZXZhbHVhdGlvbi5cbiAqXG4gKiBUaGlzIHNldHRlciBmdW5jdGlvbiBtYXkgdGhyb3cgZXJyb3Igd2hlbiBjYWxsZWQgaWYgdGhlXG4gKiBleHByZXNzaW9uIGJvZHkgaXMgbm90IGEgdmFsaWQgbGVmdC1oYW5kIGV4cHJlc3Npb24gaW5cbiAqIGFzc2lnbm1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGJvZHlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlU2V0dGVyIChib2R5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignc2NvcGUnLCAndmFsdWUnLCBib2R5ICsgJz12YWx1ZTsnKVxuICB9IGNhdGNoIChlKSB7XG4gICAgXy53YXJuKCdJbnZhbGlkIHNldHRlciBmdW5jdGlvbiBib2R5OiAnICsgYm9keSlcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBzZXR0ZXIgZXhpc3RlbmNlIG9uIGEgY2FjaGUgaGl0LlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhpdFxuICovXG5cbmZ1bmN0aW9uIGNoZWNrU2V0dGVyIChoaXQpIHtcbiAgaWYgKCFoaXQuc2V0KSB7XG4gICAgaGl0LnNldCA9IG1ha2VTZXR0ZXIoaGl0LmJvZHkpXG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSBhbiBleHByZXNzaW9uIGludG8gcmUtd3JpdHRlbiBnZXR0ZXIvc2V0dGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG5lZWRTZXRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoZXhwLCBuZWVkU2V0KSB7XG4gIGV4cCA9IGV4cC50cmltKClcbiAgLy8gdHJ5IGNhY2hlXG4gIHZhciBoaXQgPSBleHByZXNzaW9uQ2FjaGUuZ2V0KGV4cClcbiAgaWYgKGhpdCkge1xuICAgIGlmIChuZWVkU2V0KSB7XG4gICAgICBjaGVja1NldHRlcihoaXQpXG4gICAgfVxuICAgIHJldHVybiBoaXRcbiAgfVxuICAvLyB3ZSBkbyBhIHNpbXBsZSBwYXRoIGNoZWNrIHRvIG9wdGltaXplIGZvciB0aGVtLlxuICAvLyB0aGUgY2hlY2sgZmFpbHMgdmFsaWQgcGF0aHMgd2l0aCB1bnVzYWwgd2hpdGVzcGFjZXMsXG4gIC8vIGJ1dCB0aGF0J3MgdG9vIHJhcmUgYW5kIHdlIGRvbid0IGNhcmUuXG4gIC8vIGFsc28gc2tpcCBib29sZWFuIGxpdGVyYWxzIGFuZCBwYXRocyB0aGF0IHN0YXJ0IHdpdGhcbiAgLy8gZ2xvYmFsIFwiTWF0aFwiXG4gIHZhciByZXMgPVxuICAgIHBhdGhUZXN0UkUudGVzdChleHApICYmXG4gICAgIWJvb2xlYW5MaXRlcmFsUkUudGVzdChleHApICYmXG4gICAgZXhwLnNsaWNlKDAsIDUpICE9PSAnTWF0aC4nXG4gICAgICA/IGNvbXBpbGVQYXRoRm5zKGV4cClcbiAgICAgIDogY29tcGlsZUV4cEZucyhleHAsIG5lZWRTZXQpXG4gIGV4cHJlc3Npb25DYWNoZS5wdXQoZXhwLCByZXMpXG4gIHJldHVybiByZXNcbn1cblxuLy8gRXhwb3J0IHRoZSBwYXRoUmVnZXggZm9yIGV4dGVybmFsIHVzZVxuZXhwb3J0cy5wYXRoVGVzdFJFID0gcGF0aFRlc3RSRSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgcGF0aENhY2hlID0gbmV3IENhY2hlKDEwMDApXG52YXIgaWRlbnRSRSA9IC9eWyRfYS16QS1aXStbXFx3JF0qJC9cblxuLyoqXG4gKiBQYXRoLXBhcnNpbmcgYWxnb3JpdGhtIHNjb29wZWQgZnJvbSBQb2x5bWVyL29ic2VydmUtanNcbiAqL1xuXG52YXIgcGF0aFN0YXRlTWFjaGluZSA9IHtcbiAgJ2JlZm9yZVBhdGgnOiB7XG4gICAgJ3dzJzogWydiZWZvcmVQYXRoJ10sXG4gICAgJ2lkZW50JzogWydpbklkZW50JywgJ2FwcGVuZCddLFxuICAgICdbJzogWydiZWZvcmVFbGVtZW50J10sXG4gICAgJ2VvZic6IFsnYWZ0ZXJQYXRoJ11cbiAgfSxcblxuICAnaW5QYXRoJzoge1xuICAgICd3cyc6IFsnaW5QYXRoJ10sXG4gICAgJy4nOiBbJ2JlZm9yZUlkZW50J10sXG4gICAgJ1snOiBbJ2JlZm9yZUVsZW1lbnQnXSxcbiAgICAnZW9mJzogWydhZnRlclBhdGgnXVxuICB9LFxuXG4gICdiZWZvcmVJZGVudCc6IHtcbiAgICAnd3MnOiBbJ2JlZm9yZUlkZW50J10sXG4gICAgJ2lkZW50JzogWydpbklkZW50JywgJ2FwcGVuZCddXG4gIH0sXG5cbiAgJ2luSWRlbnQnOiB7XG4gICAgJ2lkZW50JzogWydpbklkZW50JywgJ2FwcGVuZCddLFxuICAgICcwJzogWydpbklkZW50JywgJ2FwcGVuZCddLFxuICAgICdudW1iZXInOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ10sXG4gICAgJ3dzJzogWydpblBhdGgnLCAncHVzaCddLFxuICAgICcuJzogWydiZWZvcmVJZGVudCcsICdwdXNoJ10sXG4gICAgJ1snOiBbJ2JlZm9yZUVsZW1lbnQnLCAncHVzaCddLFxuICAgICdlb2YnOiBbJ2FmdGVyUGF0aCcsICdwdXNoJ11cbiAgfSxcblxuICAnYmVmb3JlRWxlbWVudCc6IHtcbiAgICAnd3MnOiBbJ2JlZm9yZUVsZW1lbnQnXSxcbiAgICAnMCc6IFsnYWZ0ZXJaZXJvJywgJ2FwcGVuZCddLFxuICAgICdudW1iZXInOiBbJ2luSW5kZXgnLCAnYXBwZW5kJ10sXG4gICAgXCInXCI6IFsnaW5TaW5nbGVRdW90ZScsICdhcHBlbmQnLCAnJ10sXG4gICAgJ1wiJzogWydpbkRvdWJsZVF1b3RlJywgJ2FwcGVuZCcsICcnXVxuICB9LFxuXG4gICdhZnRlclplcm8nOiB7XG4gICAgJ3dzJzogWydhZnRlckVsZW1lbnQnLCAncHVzaCddLFxuICAgICddJzogWydpblBhdGgnLCAncHVzaCddXG4gIH0sXG5cbiAgJ2luSW5kZXgnOiB7XG4gICAgJzAnOiBbJ2luSW5kZXgnLCAnYXBwZW5kJ10sXG4gICAgJ251bWJlcic6IFsnaW5JbmRleCcsICdhcHBlbmQnXSxcbiAgICAnd3MnOiBbJ2FmdGVyRWxlbWVudCddLFxuICAgICddJzogWydpblBhdGgnLCAncHVzaCddXG4gIH0sXG5cbiAgJ2luU2luZ2xlUXVvdGUnOiB7XG4gICAgXCInXCI6IFsnYWZ0ZXJFbGVtZW50J10sXG4gICAgJ2VvZic6ICdlcnJvcicsXG4gICAgJ2Vsc2UnOiBbJ2luU2luZ2xlUXVvdGUnLCAnYXBwZW5kJ11cbiAgfSxcblxuICAnaW5Eb3VibGVRdW90ZSc6IHtcbiAgICAnXCInOiBbJ2FmdGVyRWxlbWVudCddLFxuICAgICdlb2YnOiAnZXJyb3InLFxuICAgICdlbHNlJzogWydpbkRvdWJsZVF1b3RlJywgJ2FwcGVuZCddXG4gIH0sXG5cbiAgJ2FmdGVyRWxlbWVudCc6IHtcbiAgICAnd3MnOiBbJ2FmdGVyRWxlbWVudCddLFxuICAgICddJzogWydpblBhdGgnLCAncHVzaCddXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9vcCAoKSB7fVxuXG4vKipcbiAqIERldGVybWluZSB0aGUgdHlwZSBvZiBhIGNoYXJhY3RlciBpbiBhIGtleXBhdGguXG4gKlxuICogQHBhcmFtIHtDaGFyfSBjaGFyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHR5cGVcbiAqL1xuXG5mdW5jdGlvbiBnZXRQYXRoQ2hhclR5cGUgKGNoYXIpIHtcbiAgaWYgKGNoYXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAnZW9mJ1xuICB9XG5cbiAgdmFyIGNvZGUgPSBjaGFyLmNoYXJDb2RlQXQoMClcblxuICBzd2l0Y2goY29kZSkge1xuICAgIGNhc2UgMHg1QjogLy8gW1xuICAgIGNhc2UgMHg1RDogLy8gXVxuICAgIGNhc2UgMHgyRTogLy8gLlxuICAgIGNhc2UgMHgyMjogLy8gXCJcbiAgICBjYXNlIDB4Mjc6IC8vICdcbiAgICBjYXNlIDB4MzA6IC8vIDBcbiAgICAgIHJldHVybiBjaGFyXG5cbiAgICBjYXNlIDB4NUY6IC8vIF9cbiAgICBjYXNlIDB4MjQ6IC8vICRcbiAgICAgIHJldHVybiAnaWRlbnQnXG5cbiAgICBjYXNlIDB4MjA6IC8vIFNwYWNlXG4gICAgY2FzZSAweDA5OiAvLyBUYWJcbiAgICBjYXNlIDB4MEE6IC8vIE5ld2xpbmVcbiAgICBjYXNlIDB4MEQ6IC8vIFJldHVyblxuICAgIGNhc2UgMHhBMDogIC8vIE5vLWJyZWFrIHNwYWNlXG4gICAgY2FzZSAweEZFRkY6ICAvLyBCeXRlIE9yZGVyIE1hcmtcbiAgICBjYXNlIDB4MjAyODogIC8vIExpbmUgU2VwYXJhdG9yXG4gICAgY2FzZSAweDIwMjk6ICAvLyBQYXJhZ3JhcGggU2VwYXJhdG9yXG4gICAgICByZXR1cm4gJ3dzJ1xuICB9XG5cbiAgLy8gYS16LCBBLVpcbiAgaWYgKCgweDYxIDw9IGNvZGUgJiYgY29kZSA8PSAweDdBKSB8fFxuICAgICAgKDB4NDEgPD0gY29kZSAmJiBjb2RlIDw9IDB4NUEpKSB7XG4gICAgcmV0dXJuICdpZGVudCdcbiAgfVxuXG4gIC8vIDEtOVxuICBpZiAoMHgzMSA8PSBjb2RlICYmIGNvZGUgPD0gMHgzOSkge1xuICAgIHJldHVybiAnbnVtYmVyJ1xuICB9XG5cbiAgcmV0dXJuICdlbHNlJ1xufVxuXG4vKipcbiAqIFBhcnNlIGEgc3RyaW5nIHBhdGggaW50byBhbiBhcnJheSBvZiBzZWdtZW50c1xuICogVG9kbyBpbXBsZW1lbnQgY2FjaGVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHJldHVybiB7QXJyYXl8dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlUGF0aCAocGF0aCkge1xuICB2YXIga2V5cyA9IFtdXG4gIHZhciBpbmRleCA9IC0xXG4gIHZhciBtb2RlID0gJ2JlZm9yZVBhdGgnXG4gIHZhciBjLCBuZXdDaGFyLCBrZXksIHR5cGUsIHRyYW5zaXRpb24sIGFjdGlvbiwgdHlwZU1hcFxuXG4gIHZhciBhY3Rpb25zID0ge1xuICAgIHB1c2g6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAga2V5cy5wdXNoKGtleSlcbiAgICAgIGtleSA9IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgYXBwZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXkgPSBuZXdDaGFyXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBrZXkgKz0gbmV3Q2hhclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1heWJlVW5lc2NhcGVRdW90ZSAoKSB7XG4gICAgdmFyIG5leHRDaGFyID0gcGF0aFtpbmRleCArIDFdXG4gICAgaWYgKChtb2RlID09PSAnaW5TaW5nbGVRdW90ZScgJiYgbmV4dENoYXIgPT09IFwiJ1wiKSB8fFxuICAgICAgICAobW9kZSA9PT0gJ2luRG91YmxlUXVvdGUnICYmIG5leHRDaGFyID09PSAnXCInKSkge1xuICAgICAgaW5kZXgrK1xuICAgICAgbmV3Q2hhciA9IG5leHRDaGFyXG4gICAgICBhY3Rpb25zLmFwcGVuZCgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHdoaWxlIChtb2RlKSB7XG4gICAgaW5kZXgrK1xuICAgIGMgPSBwYXRoW2luZGV4XVxuXG4gICAgaWYgKGMgPT09ICdcXFxcJyAmJiBtYXliZVVuZXNjYXBlUXVvdGUoKSkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICB0eXBlID0gZ2V0UGF0aENoYXJUeXBlKGMpXG4gICAgdHlwZU1hcCA9IHBhdGhTdGF0ZU1hY2hpbmVbbW9kZV1cbiAgICB0cmFuc2l0aW9uID0gdHlwZU1hcFt0eXBlXSB8fCB0eXBlTWFwWydlbHNlJ10gfHwgJ2Vycm9yJ1xuXG4gICAgaWYgKHRyYW5zaXRpb24gPT09ICdlcnJvcicpIHtcbiAgICAgIHJldHVybiAvLyBwYXJzZSBlcnJvclxuICAgIH1cblxuICAgIG1vZGUgPSB0cmFuc2l0aW9uWzBdXG4gICAgYWN0aW9uID0gYWN0aW9uc1t0cmFuc2l0aW9uWzFdXSB8fCBub29wXG4gICAgbmV3Q2hhciA9IHRyYW5zaXRpb25bMl0gPT09IHVuZGVmaW5lZFxuICAgICAgPyBjXG4gICAgICA6IHRyYW5zaXRpb25bMl1cbiAgICBhY3Rpb24oKVxuXG4gICAgaWYgKG1vZGUgPT09ICdhZnRlclBhdGgnKSB7XG4gICAgICByZXR1cm4ga2V5c1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEZvcm1hdCBhIGFjY2Vzc29yIHNlZ21lbnQgYmFzZWQgb24gaXRzIHR5cGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBY2Nlc3NvcihrZXkpIHtcbiAgaWYgKGlkZW50UkUudGVzdChrZXkpKSB7IC8vIGlkZW50aWZpZXJcbiAgICByZXR1cm4gJy4nICsga2V5XG4gIH0gZWxzZSBpZiAoK2tleSA9PT0ga2V5ID4+PiAwKSB7IC8vIGJyYWNrZXQgaW5kZXhcbiAgICByZXR1cm4gJ1snICsga2V5ICsgJ10nXG4gIH0gZWxzZSB7IC8vIGJyYWNrZXQgc3RyaW5nXG4gICAgcmV0dXJuICdbXCInICsga2V5LnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIl0nXG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlcyBhIGdldHRlciBmdW5jdGlvbiB3aXRoIGEgZml4ZWQgcGF0aC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5leHBvcnRzLmNvbXBpbGVHZXR0ZXIgPSBmdW5jdGlvbiAocGF0aCkge1xuICB2YXIgYm9keSA9ICdyZXR1cm4gbycgKyBwYXRoLm1hcChmb3JtYXRBY2Nlc3Nvcikuam9pbignJylcbiAgcmV0dXJuIG5ldyBGdW5jdGlvbignbycsIGJvZHkpXG59XG5cbi8qKlxuICogRXh0ZXJuYWwgcGFyc2UgdGhhdCBjaGVjayBmb3IgYSBjYWNoZSBoaXQgZmlyc3RcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHJldHVybiB7QXJyYXl8dW5kZWZpbmVkfVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAocGF0aCkge1xuICB2YXIgaGl0ID0gcGF0aENhY2hlLmdldChwYXRoKVxuICBpZiAoIWhpdCkge1xuICAgIGhpdCA9IHBhcnNlUGF0aChwYXRoKVxuICAgIGlmIChoaXQpIHtcbiAgICAgIGhpdC5nZXQgPSBleHBvcnRzLmNvbXBpbGVHZXR0ZXIoaGl0KVxuICAgICAgcGF0aENhY2hlLnB1dChwYXRoLCBoaXQpXG4gICAgfVxuICB9XG4gIHJldHVybiBoaXRcbn1cblxuLyoqXG4gKiBHZXQgZnJvbSBhbiBvYmplY3QgZnJvbSBhIHBhdGggc3RyaW5nXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqL1xuXG5leHBvcnRzLmdldCA9IGZ1bmN0aW9uIChvYmosIHBhdGgpIHtcbiAgcGF0aCA9IGV4cG9ydHMucGFyc2UocGF0aClcbiAgaWYgKHBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5nZXQob2JqKVxuICB9XG59XG5cbi8qKlxuICogU2V0IG9uIGFuIG9iamVjdCBmcm9tIGEgcGF0aFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nIHwgQXJyYXl9IHBhdGhcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZXhwb3J0cy5zZXQgPSBmdW5jdGlvbiAob2JqLCBwYXRoLCB2YWwpIHtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgIHBhdGggPSBleHBvcnRzLnBhcnNlKHBhdGgpXG4gIH1cbiAgaWYgKCFwYXRoIHx8ICFfLmlzT2JqZWN0KG9iaikpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICB2YXIgbGFzdCwga2V5XG4gIGZvciAodmFyIGkgPSAwLCBsID0gcGF0aC5sZW5ndGggLSAxOyBpIDwgbDsgaSsrKSB7XG4gICAgbGFzdCA9IG9ialxuICAgIGtleSA9IHBhdGhbaV1cbiAgICBvYmogPSBvYmpba2V5XVxuICAgIGlmICghXy5pc09iamVjdChvYmopKSB7XG4gICAgICBvYmogPSB7fVxuICAgICAgbGFzdC4kYWRkKGtleSwgb2JqKVxuICAgIH1cbiAgfVxuICBrZXkgPSBwYXRoW2ldXG4gIGlmIChrZXkgaW4gb2JqKSB7XG4gICAgb2JqW2tleV0gPSB2YWxcbiAgfSBlbHNlIHtcbiAgICBvYmouJGFkZChrZXksIHZhbClcbiAgfVxuICByZXR1cm4gdHJ1ZVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgdGVtcGxhdGVDYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxudmFyIGlkU2VsZWN0b3JDYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxuXG52YXIgbWFwID0ge1xuICBfZGVmYXVsdCA6IFswLCAnJywgJyddLFxuICBsZWdlbmQgICA6IFsxLCAnPGZpZWxkc2V0PicsICc8L2ZpZWxkc2V0PiddLFxuICB0ciAgICAgICA6IFsyLCAnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPiddLFxuICBjb2wgICAgICA6IFtcbiAgICAyLFxuICAgICc8dGFibGU+PHRib2R5PjwvdGJvZHk+PGNvbGdyb3VwPicsXG4gICAgJzwvY29sZ3JvdXA+PC90YWJsZT4nXG4gIF1cbn1cblxubWFwLnRkID1cbm1hcC50aCA9IFtcbiAgMyxcbiAgJzx0YWJsZT48dGJvZHk+PHRyPicsXG4gICc8L3RyPjwvdGJvZHk+PC90YWJsZT4nXG5dXG5cbm1hcC5vcHRpb24gPVxubWFwLm9wdGdyb3VwID0gW1xuICAxLFxuICAnPHNlbGVjdCBtdWx0aXBsZT1cIm11bHRpcGxlXCI+JyxcbiAgJzwvc2VsZWN0Pidcbl1cblxubWFwLnRoZWFkID1cbm1hcC50Ym9keSA9XG5tYXAuY29sZ3JvdXAgPVxubWFwLmNhcHRpb24gPVxubWFwLnRmb290ID0gWzEsICc8dGFibGU+JywgJzwvdGFibGU+J11cblxubWFwLmcgPVxubWFwLmRlZnMgPVxubWFwLnN5bWJvbCA9XG5tYXAudXNlID1cbm1hcC5pbWFnZSA9XG5tYXAudGV4dCA9XG5tYXAuY2lyY2xlID1cbm1hcC5lbGxpcHNlID1cbm1hcC5saW5lID1cbm1hcC5wYXRoID1cbm1hcC5wb2x5Z29uID1cbm1hcC5wb2x5bGluZSA9XG5tYXAucmVjdCA9IFtcbiAgMSxcbiAgJzxzdmcgJyArXG4gICAgJ3htbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiAnICtcbiAgICAneG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgJyArXG4gICAgJ3htbG5zOmV2PVwiaHR0cDovL3d3dy53My5vcmcvMjAwMS94bWwtZXZlbnRzXCInICtcbiAgICAndmVyc2lvbj1cIjEuMVwiPicsXG4gICc8L3N2Zz4nXG5dXG5cbnZhciB0YWdSRSA9IC88KFtcXHc6XSspL1xudmFyIGVudGl0eVJFID0gLyZcXHcrOy9cblxuLyoqXG4gKiBDb252ZXJ0IGEgc3RyaW5nIHRlbXBsYXRlIHRvIGEgRG9jdW1lbnRGcmFnbWVudC5cbiAqIERldGVybWluZXMgY29ycmVjdCB3cmFwcGluZyBieSB0YWcgdHlwZXMuIFdyYXBwaW5nXG4gKiBzdHJhdGVneSBmb3VuZCBpbiBqUXVlcnkgJiBjb21wb25lbnQvZG9taWZ5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZVN0cmluZ1xuICogQHJldHVybiB7RG9jdW1lbnRGcmFnbWVudH1cbiAqL1xuXG5mdW5jdGlvbiBzdHJpbmdUb0ZyYWdtZW50ICh0ZW1wbGF0ZVN0cmluZykge1xuICAvLyB0cnkgYSBjYWNoZSBoaXQgZmlyc3RcbiAgdmFyIGhpdCA9IHRlbXBsYXRlQ2FjaGUuZ2V0KHRlbXBsYXRlU3RyaW5nKVxuICBpZiAoaGl0KSB7XG4gICAgcmV0dXJuIGhpdFxuICB9XG5cbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgdmFyIHRhZ01hdGNoID0gdGVtcGxhdGVTdHJpbmcubWF0Y2godGFnUkUpXG4gIHZhciBlbnRpdHlNYXRjaCA9IGVudGl0eVJFLnRlc3QodGVtcGxhdGVTdHJpbmcpXG5cbiAgaWYgKCF0YWdNYXRjaCAmJiAhZW50aXR5TWF0Y2gpIHtcbiAgICAvLyB0ZXh0IG9ubHksIHJldHVybiBhIHNpbmdsZSB0ZXh0IG5vZGUuXG4gICAgZnJhZy5hcHBlbmRDaGlsZChcbiAgICAgIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRlbXBsYXRlU3RyaW5nKVxuICAgIClcbiAgfSBlbHNlIHtcblxuICAgIHZhciB0YWcgICAgPSB0YWdNYXRjaCAmJiB0YWdNYXRjaFsxXVxuICAgIHZhciB3cmFwICAgPSBtYXBbdGFnXSB8fCBtYXAuX2RlZmF1bHRcbiAgICB2YXIgZGVwdGggID0gd3JhcFswXVxuICAgIHZhciBwcmVmaXggPSB3cmFwWzFdXG4gICAgdmFyIHN1ZmZpeCA9IHdyYXBbMl1cbiAgICB2YXIgbm9kZSAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIG5vZGUuaW5uZXJIVE1MID0gcHJlZml4ICsgdGVtcGxhdGVTdHJpbmcudHJpbSgpICsgc3VmZml4XG4gICAgd2hpbGUgKGRlcHRoLS0pIHtcbiAgICAgIG5vZGUgPSBub2RlLmxhc3RDaGlsZFxuICAgIH1cblxuICAgIHZhciBjaGlsZFxuICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICB3aGlsZSAoY2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgfVxuICB9XG5cbiAgdGVtcGxhdGVDYWNoZS5wdXQodGVtcGxhdGVTdHJpbmcsIGZyYWcpXG4gIHJldHVybiBmcmFnXG59XG5cbi8qKlxuICogQ29udmVydCBhIHRlbXBsYXRlIG5vZGUgdG8gYSBEb2N1bWVudEZyYWdtZW50LlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7RG9jdW1lbnRGcmFnbWVudH1cbiAqL1xuXG5mdW5jdGlvbiBub2RlVG9GcmFnbWVudCAobm9kZSkge1xuICB2YXIgdGFnID0gbm9kZS50YWdOYW1lXG4gIC8vIGlmIGl0cyBhIHRlbXBsYXRlIHRhZyBhbmQgdGhlIGJyb3dzZXIgc3VwcG9ydHMgaXQsXG4gIC8vIGl0cyBjb250ZW50IGlzIGFscmVhZHkgYSBkb2N1bWVudCBmcmFnbWVudC5cbiAgaWYgKFxuICAgIHRhZyA9PT0gJ1RFTVBMQVRFJyAmJlxuICAgIG5vZGUuY29udGVudCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnRcbiAgKSB7XG4gICAgcmV0dXJuIG5vZGUuY29udGVudFxuICB9XG4gIC8vIHNjcmlwdCB0ZW1wbGF0ZVxuICBpZiAodGFnID09PSAnU0NSSVBUJykge1xuICAgIHJldHVybiBzdHJpbmdUb0ZyYWdtZW50KG5vZGUudGV4dENvbnRlbnQpXG4gIH1cbiAgLy8gbm9ybWFsIG5vZGUsIGNsb25lIGl0IHRvIGF2b2lkIG11dGF0aW5nIHRoZSBvcmlnaW5hbFxuICB2YXIgY2xvbmUgPSBleHBvcnRzLmNsb25lKG5vZGUpXG4gIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gIHZhciBjaGlsZFxuICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gIHdoaWxlIChjaGlsZCA9IGNsb25lLmZpcnN0Q2hpbGQpIHtcbiAgICBmcmFnLmFwcGVuZENoaWxkKGNoaWxkKVxuICB9XG4gIHJldHVybiBmcmFnXG59XG5cbi8vIFRlc3QgZm9yIHRoZSBwcmVzZW5jZSBvZiB0aGUgU2FmYXJpIHRlbXBsYXRlIGNsb25pbmcgYnVnXG4vLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM3NzU1XG52YXIgaGFzQnJva2VuVGVtcGxhdGUgPSBfLmluQnJvd3NlclxuICA/IChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBhLmlubmVySFRNTCA9ICc8dGVtcGxhdGU+MTwvdGVtcGxhdGU+J1xuICAgICAgcmV0dXJuICFhLmNsb25lTm9kZSh0cnVlKS5maXJzdENoaWxkLmlubmVySFRNTFxuICAgIH0pKClcbiAgOiBmYWxzZVxuXG4vLyBUZXN0IGZvciBJRTEwLzExIHRleHRhcmVhIHBsYWNlaG9sZGVyIGNsb25lIGJ1Z1xudmFyIGhhc1RleHRhcmVhQ2xvbmVCdWcgPSBfLmluQnJvd3NlclxuICA/IChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJylcbiAgICAgIHQucGxhY2Vob2xkZXIgPSAndCdcbiAgICAgIHJldHVybiB0LmNsb25lTm9kZSh0cnVlKS52YWx1ZSA9PT0gJ3QnXG4gICAgfSkoKVxuICA6IGZhbHNlXG5cbi8qKlxuICogMS4gRGVhbCB3aXRoIFNhZmFyaSBjbG9uaW5nIG5lc3RlZCA8dGVtcGxhdGU+IGJ1ZyBieVxuICogICAgbWFudWFsbHkgY2xvbmluZyBhbGwgdGVtcGxhdGUgaW5zdGFuY2VzLlxuICogMi4gRGVhbCB3aXRoIElFMTAvMTEgdGV4dGFyZWEgcGxhY2Vob2xkZXIgYnVnIGJ5IHNldHRpbmdcbiAqICAgIHRoZSBjb3JyZWN0IHZhbHVlIGFmdGVyIGNsb25pbmcuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9IG5vZGVcbiAqIEByZXR1cm4ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH1cbiAqL1xuXG5leHBvcnRzLmNsb25lID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgdmFyIHJlcyA9IG5vZGUuY2xvbmVOb2RlKHRydWUpXG4gIHZhciBpLCBvcmlnaW5hbCwgY2xvbmVkXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoaGFzQnJva2VuVGVtcGxhdGUpIHtcbiAgICBvcmlnaW5hbCA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVxuICAgIGlmIChvcmlnaW5hbC5sZW5ndGgpIHtcbiAgICAgIGNsb25lZCA9IHJlcy5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpXG4gICAgICBpID0gY2xvbmVkLmxlbmd0aFxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjbG9uZWRbaV0ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoXG4gICAgICAgICAgb3JpZ2luYWxbaV0uY2xvbmVOb2RlKHRydWUpLFxuICAgICAgICAgIGNsb25lZFtpXVxuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAoaGFzVGV4dGFyZWFDbG9uZUJ1Zykge1xuICAgIGlmIChub2RlLnRhZ05hbWUgPT09ICdURVhUQVJFQScpIHtcbiAgICAgIHJlcy52YWx1ZSA9IG5vZGUudmFsdWVcbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ2luYWwgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJylcbiAgICAgIGlmIChvcmlnaW5hbC5sZW5ndGgpIHtcbiAgICAgICAgY2xvbmVkID0gcmVzLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RleHRhcmVhJylcbiAgICAgICAgaSA9IGNsb25lZC5sZW5ndGhcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgIGNsb25lZFtpXS52YWx1ZSA9IG9yaWdpbmFsW2ldLnZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG4vKipcbiAqIFByb2Nlc3MgdGhlIHRlbXBsYXRlIG9wdGlvbiBhbmQgbm9ybWFsaXplcyBpdCBpbnRvIGFcbiAqIGEgRG9jdW1lbnRGcmFnbWVudCB0aGF0IGNhbiBiZSB1c2VkIGFzIGEgcGFydGlhbCBvciBhXG4gKiBpbnN0YW5jZSB0ZW1wbGF0ZS5cbiAqXG4gKiBAcGFyYW0geyp9IHRlbXBsYXRlXG4gKiAgICBQb3NzaWJsZSB2YWx1ZXMgaW5jbHVkZTpcbiAqICAgIC0gRG9jdW1lbnRGcmFnbWVudCBvYmplY3RcbiAqICAgIC0gTm9kZSBvYmplY3Qgb2YgdHlwZSBUZW1wbGF0ZVxuICogICAgLSBpZCBzZWxlY3RvcjogJyNzb21lLXRlbXBsYXRlLWlkJ1xuICogICAgLSB0ZW1wbGF0ZSBzdHJpbmc6ICc8ZGl2PjxzcGFuPnt7bXNnfX08L3NwYW4+PC9kaXY+J1xuICogQHBhcmFtIHtCb29sZWFufSBjbG9uZVxuICogQHBhcmFtIHtCb29sZWFufSBub1NlbGVjdG9yXG4gKiBAcmV0dXJuIHtEb2N1bWVudEZyYWdtZW50fHVuZGVmaW5lZH1cbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBjbG9uZSwgbm9TZWxlY3Rvcikge1xuICB2YXIgbm9kZSwgZnJhZ1xuXG4gIC8vIGlmIHRoZSB0ZW1wbGF0ZSBpcyBhbHJlYWR5IGEgZG9jdW1lbnQgZnJhZ21lbnQsXG4gIC8vIGRvIG5vdGhpbmdcbiAgaWYgKHRlbXBsYXRlIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCkge1xuICAgIHJldHVybiBjbG9uZVxuICAgICAgPyB0ZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSlcbiAgICAgIDogdGVtcGxhdGVcbiAgfVxuXG4gIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gaWQgc2VsZWN0b3JcbiAgICBpZiAoIW5vU2VsZWN0b3IgJiYgdGVtcGxhdGUuY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgIC8vIGlkIHNlbGVjdG9yIGNhbiBiZSBjYWNoZWQgdG9vXG4gICAgICBmcmFnID0gaWRTZWxlY3RvckNhY2hlLmdldCh0ZW1wbGF0ZSlcbiAgICAgIGlmICghZnJhZykge1xuICAgICAgICBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGUuc2xpY2UoMSkpXG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgZnJhZyA9IG5vZGVUb0ZyYWdtZW50KG5vZGUpXG4gICAgICAgICAgLy8gc2F2ZSBzZWxlY3RvciB0byBjYWNoZVxuICAgICAgICAgIGlkU2VsZWN0b3JDYWNoZS5wdXQodGVtcGxhdGUsIGZyYWcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm9ybWFsIHN0cmluZyB0ZW1wbGF0ZVxuICAgICAgZnJhZyA9IHN0cmluZ1RvRnJhZ21lbnQodGVtcGxhdGUpXG4gICAgfVxuICB9IGVsc2UgaWYgKHRlbXBsYXRlLm5vZGVUeXBlKSB7XG4gICAgLy8gYSBkaXJlY3Qgbm9kZVxuICAgIGZyYWcgPSBub2RlVG9GcmFnbWVudCh0ZW1wbGF0ZSlcbiAgfVxuXG4gIHJldHVybiBmcmFnICYmIGNsb25lXG4gICAgPyBleHBvcnRzLmNsb25lKGZyYWcpXG4gICAgOiBmcmFnXG59IiwidmFyIENhY2hlID0gcmVxdWlyZSgnLi4vY2FjaGUnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG52YXIgZGlyUGFyc2VyID0gcmVxdWlyZSgnLi9kaXJlY3RpdmUnKVxudmFyIHJlZ2V4RXNjYXBlUkUgPSAvWy0uKis/XiR7fSgpfFtcXF1cXC9cXFxcXS9nXG52YXIgY2FjaGUsIHRhZ1JFLCBodG1sUkUsIGZpcnN0Q2hhciwgbGFzdENoYXJcblxuLyoqXG4gKiBFc2NhcGUgYSBzdHJpbmcgc28gaXQgY2FuIGJlIHVzZWQgaW4gYSBSZWdFeHBcbiAqIGNvbnN0cnVjdG9yLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqL1xuXG5mdW5jdGlvbiBlc2NhcGVSZWdleCAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShyZWdleEVzY2FwZVJFLCAnXFxcXCQmJylcbn1cblxuLyoqXG4gKiBDb21waWxlIHRoZSBpbnRlcnBvbGF0aW9uIHRhZyByZWdleC5cbiAqXG4gKiBAcmV0dXJuIHtSZWdFeHB9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZVJlZ2V4ICgpIHtcbiAgY29uZmlnLl9kZWxpbWl0ZXJzQ2hhbmdlZCA9IGZhbHNlXG4gIHZhciBvcGVuID0gY29uZmlnLmRlbGltaXRlcnNbMF1cbiAgdmFyIGNsb3NlID0gY29uZmlnLmRlbGltaXRlcnNbMV1cbiAgZmlyc3RDaGFyID0gb3Blbi5jaGFyQXQoMClcbiAgbGFzdENoYXIgPSBjbG9zZS5jaGFyQXQoY2xvc2UubGVuZ3RoIC0gMSlcbiAgdmFyIGZpcnN0Q2hhclJFID0gZXNjYXBlUmVnZXgoZmlyc3RDaGFyKVxuICB2YXIgbGFzdENoYXJSRSA9IGVzY2FwZVJlZ2V4KGxhc3RDaGFyKVxuICB2YXIgb3BlblJFID0gZXNjYXBlUmVnZXgob3BlbilcbiAgdmFyIGNsb3NlUkUgPSBlc2NhcGVSZWdleChjbG9zZSlcbiAgdGFnUkUgPSBuZXcgUmVnRXhwKFxuICAgIGZpcnN0Q2hhclJFICsgJz8nICsgb3BlblJFICtcbiAgICAnKC4rPyknICtcbiAgICBjbG9zZVJFICsgbGFzdENoYXJSRSArICc/JyxcbiAgICAnZydcbiAgKVxuICBodG1sUkUgPSBuZXcgUmVnRXhwKFxuICAgICdeJyArIGZpcnN0Q2hhclJFICsgb3BlblJFICtcbiAgICAnLionICtcbiAgICBjbG9zZVJFICsgbGFzdENoYXJSRSArICckJ1xuICApXG4gIC8vIHJlc2V0IGNhY2hlXG4gIGNhY2hlID0gbmV3IENhY2hlKDEwMDApXG59XG5cbi8qKlxuICogUGFyc2UgYSB0ZW1wbGF0ZSB0ZXh0IHN0cmluZyBpbnRvIGFuIGFycmF5IG9mIHRva2Vucy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybiB7QXJyYXk8T2JqZWN0PiB8IG51bGx9XG4gKiAgICAgICAgICAgICAgIC0ge1N0cmluZ30gdHlwZVxuICogICAgICAgICAgICAgICAtIHtTdHJpbmd9IHZhbHVlXG4gKiAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IFtodG1sXVxuICogICAgICAgICAgICAgICAtIHtCb29sZWFufSBbb25lVGltZV1cbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgaWYgKGNvbmZpZy5fZGVsaW1pdGVyc0NoYW5nZWQpIHtcbiAgICBjb21waWxlUmVnZXgoKVxuICB9XG4gIHZhciBoaXQgPSBjYWNoZS5nZXQodGV4dClcbiAgaWYgKGhpdCkge1xuICAgIHJldHVybiBoaXRcbiAgfVxuICBpZiAoIXRhZ1JFLnRlc3QodGV4dCkpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHZhciB0b2tlbnMgPSBbXVxuICB2YXIgbGFzdEluZGV4ID0gdGFnUkUubGFzdEluZGV4ID0gMFxuICB2YXIgbWF0Y2gsIGluZGV4LCB2YWx1ZSwgZmlyc3QsIG9uZVRpbWUsIHBhcnRpYWxcbiAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICB3aGlsZSAobWF0Y2ggPSB0YWdSRS5leGVjKHRleHQpKSB7XG4gICAgaW5kZXggPSBtYXRjaC5pbmRleFxuICAgIC8vIHB1c2ggdGV4dCB0b2tlblxuICAgIGlmIChpbmRleCA+IGxhc3RJbmRleCkge1xuICAgICAgdG9rZW5zLnB1c2goe1xuICAgICAgICB2YWx1ZTogdGV4dC5zbGljZShsYXN0SW5kZXgsIGluZGV4KVxuICAgICAgfSlcbiAgICB9XG4gICAgLy8gdGFnIHRva2VuXG4gICAgZmlyc3QgPSBtYXRjaFsxXS5jaGFyQ29kZUF0KDApXG4gICAgb25lVGltZSA9IGZpcnN0ID09PSAweDJBIC8vICpcbiAgICBwYXJ0aWFsID0gZmlyc3QgPT09IDB4M0UgLy8gPlxuICAgIHZhbHVlID0gKG9uZVRpbWUgfHwgcGFydGlhbClcbiAgICAgID8gbWF0Y2hbMV0uc2xpY2UoMSlcbiAgICAgIDogbWF0Y2hbMV1cbiAgICB0b2tlbnMucHVzaCh7XG4gICAgICB0YWc6IHRydWUsXG4gICAgICB2YWx1ZTogdmFsdWUudHJpbSgpLFxuICAgICAgaHRtbDogaHRtbFJFLnRlc3QobWF0Y2hbMF0pLFxuICAgICAgb25lVGltZTogb25lVGltZSxcbiAgICAgIHBhcnRpYWw6IHBhcnRpYWxcbiAgICB9KVxuICAgIGxhc3RJbmRleCA9IGluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoXG4gIH1cbiAgaWYgKGxhc3RJbmRleCA8IHRleHQubGVuZ3RoKSB7XG4gICAgdG9rZW5zLnB1c2goe1xuICAgICAgdmFsdWU6IHRleHQuc2xpY2UobGFzdEluZGV4KVxuICAgIH0pXG4gIH1cbiAgY2FjaGUucHV0KHRleHQsIHRva2VucylcbiAgcmV0dXJuIHRva2Vuc1xufVxuXG4vKipcbiAqIEZvcm1hdCBhIGxpc3Qgb2YgdG9rZW5zIGludG8gYW4gZXhwcmVzc2lvbi5cbiAqIGUuZy4gdG9rZW5zIHBhcnNlZCBmcm9tICdhIHt7Yn19IGMnIGNhbiBiZSBzZXJpYWxpemVkXG4gKiBpbnRvIG9uZSBzaW5nbGUgZXhwcmVzc2lvbiBhcyAnXCJhIFwiICsgYiArIFwiIGNcIicuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdG9rZW5zXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMudG9rZW5zVG9FeHAgPSBmdW5jdGlvbiAodG9rZW5zLCB2bSkge1xuICByZXR1cm4gdG9rZW5zLmxlbmd0aCA+IDFcbiAgICA/IHRva2Vucy5tYXAoZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgIHJldHVybiBmb3JtYXRUb2tlbih0b2tlbiwgdm0pXG4gICAgICB9KS5qb2luKCcrJylcbiAgICA6IGZvcm1hdFRva2VuKHRva2Vuc1swXSwgdm0sIHRydWUpXG59XG5cbi8qKlxuICogRm9ybWF0IGEgc2luZ2xlIHRva2VuLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlblxuICogQHBhcmFtIHtWdWV9IFt2bV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2luZ2xlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0VG9rZW4gKHRva2VuLCB2bSwgc2luZ2xlKSB7XG4gIHJldHVybiB0b2tlbi50YWdcbiAgICA/IHZtICYmIHRva2VuLm9uZVRpbWVcbiAgICAgID8gJ1wiJyArIHZtLiRldmFsKHRva2VuLnZhbHVlKSArICdcIidcbiAgICAgIDogc2luZ2xlXG4gICAgICAgID8gdG9rZW4udmFsdWVcbiAgICAgICAgOiBpbmxpbmVGaWx0ZXJzKHRva2VuLnZhbHVlKVxuICAgIDogJ1wiJyArIHRva2VuLnZhbHVlICsgJ1wiJ1xufVxuXG4vKipcbiAqIEZvciBhbiBhdHRyaWJ1dGUgd2l0aCBtdWx0aXBsZSBpbnRlcnBvbGF0aW9uIHRhZ3MsXG4gKiBlLmcuIGF0dHI9XCJzb21lLXt7dGhpbmcgfCBmaWx0ZXJ9fVwiLCBpbiBvcmRlciB0byBjb21iaW5lXG4gKiB0aGUgd2hvbGUgdGhpbmcgaW50byBhIHNpbmdsZSB3YXRjaGFibGUgZXhwcmVzc2lvbiwgd2VcbiAqIGhhdmUgdG8gaW5saW5lIHRob3NlIGZpbHRlcnMuIFRoaXMgZnVuY3Rpb24gZG9lcyBleGFjdGx5XG4gKiB0aGF0LiBUaGlzIGlzIGEgYml0IGhhY2t5IGJ1dCBpdCBhdm9pZHMgaGVhdnkgY2hhbmdlc1xuICogdG8gZGlyZWN0aXZlIHBhcnNlciBhbmQgd2F0Y2hlciBtZWNoYW5pc20uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbnZhciBmaWx0ZXJSRSA9IC9bXnxdXFx8W158XS9cbmZ1bmN0aW9uIGlubGluZUZpbHRlcnMgKGV4cCkge1xuICBpZiAoIWZpbHRlclJFLnRlc3QoZXhwKSkge1xuICAgIHJldHVybiAnKCcgKyBleHAgKyAnKSdcbiAgfSBlbHNlIHtcbiAgICB2YXIgZGlyID0gZGlyUGFyc2VyLnBhcnNlKGV4cClbMF1cbiAgICBpZiAoIWRpci5maWx0ZXJzKSB7XG4gICAgICByZXR1cm4gJygnICsgZXhwICsgJyknXG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cCA9IGRpci5leHByZXNzaW9uXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGRpci5maWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgZmlsdGVyID0gZGlyLmZpbHRlcnNbaV1cbiAgICAgICAgdmFyIGFyZ3MgPSBmaWx0ZXIuYXJnc1xuICAgICAgICAgID8gJyxcIicgKyBmaWx0ZXIuYXJncy5qb2luKCdcIixcIicpICsgJ1wiJ1xuICAgICAgICAgIDogJydcbiAgICAgICAgZmlsdGVyID0gJ3RoaXMuJG9wdGlvbnMuZmlsdGVyc1tcIicgKyBmaWx0ZXIubmFtZSArICdcIl0nXG4gICAgICAgIGV4cCA9ICcoJyArIGZpbHRlciArICcucmVhZHx8JyArIGZpbHRlciArICcpJyArXG4gICAgICAgICAgJy5hcHBseSh0aGlzLFsnICsgZXhwICsgYXJncyArICddKSdcbiAgICAgIH1cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGFkZENsYXNzID0gXy5hZGRDbGFzc1xudmFyIHJlbW92ZUNsYXNzID0gXy5yZW1vdmVDbGFzc1xudmFyIHRyYW5zRHVyYXRpb25Qcm9wID0gXy50cmFuc2l0aW9uUHJvcCArICdEdXJhdGlvbidcbnZhciBhbmltRHVyYXRpb25Qcm9wID0gXy5hbmltYXRpb25Qcm9wICsgJ0R1cmF0aW9uJ1xuXG52YXIgcXVldWUgPSBbXVxudmFyIHF1ZXVlZCA9IGZhbHNlXG5cbi8qKlxuICogUHVzaCBhIGpvYiBpbnRvIHRoZSB0cmFuc2l0aW9uIHF1ZXVlLCB3aGljaCBpcyB0byBiZVxuICogZXhlY3V0ZWQgb24gbmV4dCBmcmFtZS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsICAgIC0gdGFyZ2V0IGVsZW1lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXIgICAgLSAxOiBlbnRlciwgLTE6IGxlYXZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcCAgIC0gdGhlIGFjdHVhbCBkb20gb3BlcmF0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xzICAgIC0gdGhlIGNsYXNzTmFtZSB0byByZW1vdmUgd2hlbiB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uIGlzIGRvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdIC0gdXNlciBzdXBwbGllZCBjYWxsYmFjay5cbiAqL1xuXG5mdW5jdGlvbiBwdXNoIChlbCwgZGlyLCBvcCwgY2xzLCBjYikge1xuICBxdWV1ZS5wdXNoKHtcbiAgICBlbCAgOiBlbCxcbiAgICBkaXIgOiBkaXIsXG4gICAgY2IgIDogY2IsXG4gICAgY2xzIDogY2xzLFxuICAgIG9wICA6IG9wXG4gIH0pXG4gIGlmICghcXVldWVkKSB7XG4gICAgcXVldWVkID0gdHJ1ZVxuICAgIF8ubmV4dFRpY2soZmx1c2gpXG4gIH1cbn1cblxuLyoqXG4gKiBGbHVzaCB0aGUgcXVldWUsIGFuZCBkbyBvbmUgZm9yY2VkIHJlZmxvdyBiZWZvcmVcbiAqIHRyaWdnZXJpbmcgdHJhbnNpdGlvbnMuXG4gKi9cblxuZnVuY3Rpb24gZmx1c2ggKCkge1xuICAvKiBqc2hpbnQgdW51c2VkOiBmYWxzZSAqL1xuICB2YXIgZiA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgcXVldWUuZm9yRWFjaChydW4pXG4gIHF1ZXVlID0gW11cbiAgcXVldWVkID0gZmFsc2Vcbn1cblxuLyoqXG4gKiBSdW4gYSB0cmFuc2l0aW9uIGpvYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gam9iXG4gKi9cblxuZnVuY3Rpb24gcnVuIChqb2IpIHtcblxuICB2YXIgZWwgPSBqb2IuZWxcbiAgdmFyIGRhdGEgPSBlbC5fX3ZfdHJhbnNcbiAgdmFyIGNscyA9IGpvYi5jbHNcbiAgdmFyIGNiID0gam9iLmNiXG4gIHZhciBvcCA9IGpvYi5vcFxuICB2YXIgdHJhbnNpdGlvblR5cGUgPSBnZXRUcmFuc2l0aW9uVHlwZShlbCwgZGF0YSwgY2xzKVxuXG4gIGlmIChqb2IuZGlyID4gMCkgeyAvLyBFTlRFUlxuICAgIGlmICh0cmFuc2l0aW9uVHlwZSA9PT0gMSkge1xuICAgICAgLy8gdHJpZ2dlciB0cmFuc2l0aW9uIGJ5IHJlbW92aW5nIGVudGVyIGNsYXNzXG4gICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgLy8gb25seSBuZWVkIHRvIGxpc3RlbiBmb3IgdHJhbnNpdGlvbmVuZCBpZiB0aGVyZSdzXG4gICAgICAvLyBhIHVzZXIgY2FsbGJhY2tcbiAgICAgIGlmIChjYikgc2V0dXBUcmFuc2l0aW9uQ2IoXy50cmFuc2l0aW9uRW5kRXZlbnQpXG4gICAgfSBlbHNlIGlmICh0cmFuc2l0aW9uVHlwZSA9PT0gMikge1xuICAgICAgLy8gYW5pbWF0aW9ucyBhcmUgdHJpZ2dlcmVkIHdoZW4gY2xhc3MgaXMgYWRkZWRcbiAgICAgIC8vIHNvIHdlIGp1c3QgbGlzdGVuIGZvciBhbmltYXRpb25lbmQgdG8gcmVtb3ZlIGl0LlxuICAgICAgc2V0dXBUcmFuc2l0aW9uQ2IoXy5hbmltYXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm8gdHJhbnNpdGlvbiBhcHBsaWNhYmxlXG4gICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgaWYgKGNiKSBjYigpXG4gICAgfVxuICB9IGVsc2UgeyAvLyBMRUFWRVxuICAgIGlmICh0cmFuc2l0aW9uVHlwZSkge1xuICAgICAgLy8gbGVhdmUgdHJhbnNpdGlvbnMvYW5pbWF0aW9ucyBhcmUgYm90aCB0cmlnZ2VyZWRcbiAgICAgIC8vIGJ5IGFkZGluZyB0aGUgY2xhc3MsIGp1c3QgcmVtb3ZlIGl0IG9uIGVuZCBldmVudC5cbiAgICAgIHZhciBldmVudCA9IHRyYW5zaXRpb25UeXBlID09PSAxXG4gICAgICAgID8gXy50cmFuc2l0aW9uRW5kRXZlbnRcbiAgICAgICAgOiBfLmFuaW1hdGlvbkVuZEV2ZW50XG4gICAgICBzZXR1cFRyYW5zaXRpb25DYihldmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBvcCgpXG4gICAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvcCgpXG4gICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgaWYgKGNiKSBjYigpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB1cCBhIHRyYW5zaXRpb24gZW5kIGNhbGxiYWNrLCBzdG9yZSB0aGUgY2FsbGJhY2tcbiAgICogb24gdGhlIGVsZW1lbnQncyBfX3ZfdHJhbnMgZGF0YSBvYmplY3QsIHNvIHdlIGNhblxuICAgKiBjbGVhbiBpdCB1cCBpZiBhbm90aGVyIHRyYW5zaXRpb24gaXMgdHJpZ2dlcmVkIGJlZm9yZVxuICAgKiB0aGUgY2FsbGJhY2sgaXMgZmlyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2xlYW51cEZuXVxuICAgKi9cblxuICBmdW5jdGlvbiBzZXR1cFRyYW5zaXRpb25DYiAoZXZlbnQsIGNsZWFudXBGbikge1xuICAgIGRhdGEuZXZlbnQgPSBldmVudFxuICAgIHZhciBvbkVuZCA9IGRhdGEuY2FsbGJhY2sgPSBmdW5jdGlvbiB0cmFuc2l0aW9uQ2IgKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgICAgXy5vZmYoZWwsIGV2ZW50LCBvbkVuZClcbiAgICAgICAgZGF0YS5ldmVudCA9IGRhdGEuY2FsbGJhY2sgPSBudWxsXG4gICAgICAgIGlmIChjbGVhbnVwRm4pIGNsZWFudXBGbigpXG4gICAgICAgIGlmIChjYikgY2IoKVxuICAgICAgfVxuICAgIH1cbiAgICBfLm9uKGVsLCBldmVudCwgb25FbmQpXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgYW4gZWxlbWVudCdzIHRyYW5zaXRpb24gdHlwZSBiYXNlZCBvbiB0aGVcbiAqIGNhbGN1bGF0ZWQgc3R5bGVzXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqICAgICAgICAgMSAtIHRyYW5zaXRpb25cbiAqICAgICAgICAgMiAtIGFuaW1hdGlvblxuICovXG5cbmZ1bmN0aW9uIGdldFRyYW5zaXRpb25UeXBlIChlbCwgZGF0YSwgY2xhc3NOYW1lKSB7XG4gIHZhciB0eXBlID0gZGF0YS5jYWNoZSAmJiBkYXRhLmNhY2hlW2NsYXNzTmFtZV1cbiAgaWYgKHR5cGUpIHJldHVybiB0eXBlXG4gIHZhciBpbmxpbmVTdHlsZXMgPSBlbC5zdHlsZVxuICB2YXIgY29tcHV0ZWRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClcbiAgdmFyIHRyYW5zRHVyYXRpb24gPVxuICAgIGlubGluZVN0eWxlc1t0cmFuc0R1cmF0aW9uUHJvcF0gfHxcbiAgICBjb21wdXRlZFN0eWxlc1t0cmFuc0R1cmF0aW9uUHJvcF1cbiAgaWYgKHRyYW5zRHVyYXRpb24gJiYgdHJhbnNEdXJhdGlvbiAhPT0gJzBzJykge1xuICAgIHR5cGUgPSAxXG4gIH0gZWxzZSB7XG4gICAgdmFyIGFuaW1EdXJhdGlvbiA9XG4gICAgICBpbmxpbmVTdHlsZXNbYW5pbUR1cmF0aW9uUHJvcF0gfHxcbiAgICAgIGNvbXB1dGVkU3R5bGVzW2FuaW1EdXJhdGlvblByb3BdXG4gICAgaWYgKGFuaW1EdXJhdGlvbiAmJiBhbmltRHVyYXRpb24gIT09ICcwcycpIHtcbiAgICAgIHR5cGUgPSAyXG4gICAgfVxuICB9XG4gIGlmICh0eXBlKSB7XG4gICAgaWYgKCFkYXRhLmNhY2hlKSBkYXRhLmNhY2hlID0ge31cbiAgICBkYXRhLmNhY2hlW2NsYXNzTmFtZV0gPSB0eXBlXG4gIH1cbiAgcmV0dXJuIHR5cGVcbn1cblxuLyoqXG4gKiBBcHBseSBDU1MgdHJhbnNpdGlvbiB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXJlY3Rpb24gLSAxOiBlbnRlciwgLTE6IGxlYXZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcCAtIHRoZSBhY3R1YWwgRE9NIG9wZXJhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSB0YXJnZXQgZWxlbWVudCdzIHRyYW5zaXRpb24gZGF0YVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsLCBkaXJlY3Rpb24sIG9wLCBkYXRhLCBjYikge1xuICB2YXIgcHJlZml4ID0gZGF0YS5pZCB8fCAndidcbiAgdmFyIGVudGVyQ2xhc3MgPSBwcmVmaXggKyAnLWVudGVyJ1xuICB2YXIgbGVhdmVDbGFzcyA9IHByZWZpeCArICctbGVhdmUnXG4gIC8vIGNsZWFuIHVwIHBvdGVudGlhbCBwcmV2aW91cyB1bmZpbmlzaGVkIHRyYW5zaXRpb25cbiAgaWYgKGRhdGEuY2FsbGJhY2spIHtcbiAgICBfLm9mZihlbCwgZGF0YS5ldmVudCwgZGF0YS5jYWxsYmFjaylcbiAgICByZW1vdmVDbGFzcyhlbCwgZW50ZXJDbGFzcylcbiAgICByZW1vdmVDbGFzcyhlbCwgbGVhdmVDbGFzcylcbiAgICBkYXRhLmV2ZW50ID0gZGF0YS5jYWxsYmFjayA9IG51bGxcbiAgfVxuICBpZiAoZGlyZWN0aW9uID4gMCkgeyAvLyBlbnRlclxuICAgIGFkZENsYXNzKGVsLCBlbnRlckNsYXNzKVxuICAgIG9wKClcbiAgICBwdXNoKGVsLCBkaXJlY3Rpb24sIG51bGwsIGVudGVyQ2xhc3MsIGNiKVxuICB9IGVsc2UgeyAvLyBsZWF2ZVxuICAgIGFkZENsYXNzKGVsLCBsZWF2ZUNsYXNzKVxuICAgIHB1c2goZWwsIGRpcmVjdGlvbiwgb3AsIGxlYXZlQ2xhc3MsIGNiKVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBhcHBseUNTU1RyYW5zaXRpb24gPSByZXF1aXJlKCcuL2NzcycpXG52YXIgYXBwbHlKU1RyYW5zaXRpb24gPSByZXF1aXJlKCcuL2pzJylcblxuLyoqXG4gKiBBcHBlbmQgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLmFwcGVuZCA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpXG4gIH0sIHZtLCBjYilcbn1cblxuLyoqXG4gKiBJbnNlcnRCZWZvcmUgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLmJlZm9yZSA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICBfLmJlZm9yZShlbCwgdGFyZ2V0KVxuICB9LCB2bSwgY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIHdpdGggdHJhbnNpdGlvbi5cbiAqXG4gKiBAb2FyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLnJlbW92ZSA9IGZ1bmN0aW9uIChlbCwgdm0sIGNiKSB7XG4gIGFwcGx5KGVsLCAtMSwgZnVuY3Rpb24gKCkge1xuICAgIF8ucmVtb3ZlKGVsKVxuICB9LCB2bSwgY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5IGFwcGVuZGluZyB0byBhbm90aGVyIHBhcmVudCB3aXRoIHRyYW5zaXRpb24uXG4gKiBUaGlzIGlzIG9ubHkgdXNlZCBpbiBibG9jayBvcGVyYXRpb25zLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLnJlbW92ZVRoZW5BcHBlbmQgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIGFwcGx5KGVsLCAtMSwgZnVuY3Rpb24gKCkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgfSwgdm0sIGNiKVxufVxuXG4vKipcbiAqIEFwcGVuZCB0aGUgY2hpbGROb2RlcyBvZiBhIGZyYWdtZW50IHRvIHRhcmdldC5cbiAqXG4gKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IGJsb2NrXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKi9cblxuZXhwb3J0cy5ibG9ja0FwcGVuZCA9IGZ1bmN0aW9uIChibG9jaywgdGFyZ2V0LCB2bSkge1xuICB2YXIgbm9kZXMgPSBfLnRvQXJyYXkoYmxvY2suY2hpbGROb2RlcylcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2Rlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBleHBvcnRzLmJlZm9yZShub2Rlc1tpXSwgdGFyZ2V0LCB2bSlcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIGJsb2NrIG9mIG5vZGVzIGJldHdlZW4gdHdvIGVkZ2Ugbm9kZXMuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBzdGFydFxuICogQHBhcmFtIHtOb2RlfSBlbmRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbmV4cG9ydHMuYmxvY2tSZW1vdmUgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgdm0pIHtcbiAgdmFyIG5vZGUgPSBzdGFydC5uZXh0U2libGluZ1xuICB2YXIgbmV4dFxuICB3aGlsZSAobm9kZSAhPT0gZW5kKSB7XG4gICAgbmV4dCA9IG5vZGUubmV4dFNpYmxpbmdcbiAgICBleHBvcnRzLnJlbW92ZShub2RlLCB2bSlcbiAgICBub2RlID0gbmV4dFxuICB9XG59XG5cbi8qKlxuICogQXBwbHkgdHJhbnNpdGlvbnMgd2l0aCBhbiBvcGVyYXRpb24gY2FsbGJhY2suXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpcmVjdGlvblxuICogICAgICAgICAgICAgICAgICAxOiBlbnRlclxuICogICAgICAgICAgICAgICAgIC0xOiBsZWF2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AgLSB0aGUgYWN0dWFsIERPTSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbnZhciBhcHBseSA9IGV4cG9ydHMuYXBwbHkgPSBmdW5jdGlvbiAoZWwsIGRpcmVjdGlvbiwgb3AsIHZtLCBjYikge1xuICB2YXIgdHJhbnNEYXRhID0gZWwuX192X3RyYW5zXG4gIGlmIChcbiAgICAhdHJhbnNEYXRhIHx8XG4gICAgIXZtLl9pc0NvbXBpbGVkIHx8XG4gICAgLy8gaWYgdGhlIHZtIGlzIGJlaW5nIG1hbmlwdWxhdGVkIGJ5IGEgcGFyZW50IGRpcmVjdGl2ZVxuICAgIC8vIGR1cmluZyB0aGUgcGFyZW50J3MgY29tcGlsYXRpb24gcGhhc2UsIHNraXAgdGhlXG4gICAgLy8gYW5pbWF0aW9uLlxuICAgICh2bS4kcGFyZW50ICYmICF2bS4kcGFyZW50Ll9pc0NvbXBpbGVkKVxuICApIHtcbiAgICBvcCgpXG4gICAgaWYgKGNiKSBjYigpXG4gICAgcmV0dXJuXG4gIH1cbiAgLy8gZGV0ZXJtaW5lIHRoZSB0cmFuc2l0aW9uIHR5cGUgb24gdGhlIGVsZW1lbnRcbiAgdmFyIGpzVHJhbnNpdGlvbiA9IHRyYW5zRGF0YS5mbnNcbiAgaWYgKGpzVHJhbnNpdGlvbikge1xuICAgIC8vIGpzXG4gICAgYXBwbHlKU1RyYW5zaXRpb24oXG4gICAgICBlbCxcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIG9wLFxuICAgICAgdHJhbnNEYXRhLFxuICAgICAganNUcmFuc2l0aW9uLFxuICAgICAgdm0sXG4gICAgICBjYlxuICAgIClcbiAgfSBlbHNlIGlmIChfLnRyYW5zaXRpb25FbmRFdmVudCkge1xuICAgIC8vIGNzc1xuICAgIGFwcGx5Q1NTVHJhbnNpdGlvbihcbiAgICAgIGVsLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgb3AsXG4gICAgICB0cmFuc0RhdGEsXG4gICAgICBjYlxuICAgIClcbiAgfSBlbHNlIHtcbiAgICAvLyBub3QgYXBwbGljYWJsZVxuICAgIG9wKClcbiAgICBpZiAoY2IpIGNiKClcbiAgfVxufSIsIi8qKlxuICogQXBwbHkgSmF2YVNjcmlwdCBlbnRlci9sZWF2ZSBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpcmVjdGlvbiAtIDE6IGVudGVyLCAtMTogbGVhdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wIC0gdGhlIGFjdHVhbCBET00gb3BlcmF0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIHRhcmdldCBlbGVtZW50J3MgdHJhbnNpdGlvbiBkYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmIC0gdHJhbnNpdGlvbiBkZWZpbml0aW9uIG9iamVjdFxuICogQHBhcmFtIHtWdWV9IHZtIC0gdGhlIG93bmVyIHZtIG9mIHRoZSBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWwsIGRpcmVjdGlvbiwgb3AsIGRhdGEsIGRlZiwgdm0sIGNiKSB7XG4gIC8vIGlmIHRoZSBlbGVtZW50IGlzIHRoZSByb290IG9mIGFuIGluc3RhbmNlLFxuICAvLyB1c2UgdGhhdCBpbnN0YW5jZSBhcyB0aGUgdHJhbnNpdGlvbiBmdW5jdGlvbiBjb250ZXh0XG4gIHZtID0gZWwuX192dWVfXyB8fCB2bVxuICBpZiAoZGF0YS5jYW5jZWwpIHtcbiAgICBkYXRhLmNhbmNlbCgpXG4gICAgZGF0YS5jYW5jZWwgPSBudWxsXG4gIH1cbiAgaWYgKGRpcmVjdGlvbiA+IDApIHsgLy8gZW50ZXJcbiAgICBpZiAoZGVmLmJlZm9yZUVudGVyKSB7XG4gICAgICBkZWYuYmVmb3JlRW50ZXIuY2FsbCh2bSwgZWwpXG4gICAgfVxuICAgIG9wKClcbiAgICBpZiAoZGVmLmVudGVyKSB7XG4gICAgICBkYXRhLmNhbmNlbCA9IGRlZi5lbnRlci5jYWxsKHZtLCBlbCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXRhLmNhbmNlbCA9IG51bGxcbiAgICAgICAgaWYgKGNiKSBjYigpXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoY2IpIHtcbiAgICAgIGNiKClcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGxlYXZlXG4gICAgaWYgKGRlZi5sZWF2ZSkge1xuICAgICAgZGF0YS5jYW5jZWwgPSBkZWYubGVhdmUuY2FsbCh2bSwgZWwsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGF0YS5jYW5jZWwgPSBudWxsXG4gICAgICAgIG9wKClcbiAgICAgICAgaWYgKGNiKSBjYigpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvcCgpXG4gICAgICBpZiAoY2IpIGNiKClcbiAgICB9XG4gIH1cbn0iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxuLyoqXG4gKiBFbmFibGUgZGVidWcgdXRpbGl0aWVzLiBUaGUgZW5hYmxlRGVidWcoKSBmdW5jdGlvbiBhbmRcbiAqIGFsbCBfLmxvZygpICYgXy53YXJuKCkgY2FsbHMgd2lsbCBiZSBkcm9wcGVkIGluIHRoZVxuICogbWluaWZpZWQgcHJvZHVjdGlvbiBidWlsZC5cbiAqL1xuXG5lbmFibGVEZWJ1ZygpXG5cbmZ1bmN0aW9uIGVuYWJsZURlYnVnICgpIHtcblxuICB2YXIgaGFzQ29uc29sZSA9IHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJ1xuICBcbiAgLyoqXG4gICAqIExvZyBhIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2dcbiAgICovXG5cbiAgZXhwb3J0cy5sb2cgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgaWYgKGhhc0NvbnNvbGUgJiYgY29uZmlnLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZygnW1Z1ZSBpbmZvXTogJyArIG1zZylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2UndmUgZ290IGEgcHJvYmxlbSBoZXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbXNnXG4gICAqL1xuXG4gIHZhciB3YXJuZWQgPSBmYWxzZVxuICBleHBvcnRzLndhcm4gPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgaWYgKGhhc0NvbnNvbGUgJiYgKCFjb25maWcuc2lsZW50IHx8IGNvbmZpZy5kZWJ1ZykpIHtcbiAgICAgIGlmICghY29uZmlnLmRlYnVnICYmICF3YXJuZWQpIHtcbiAgICAgICAgd2FybmVkID0gdHJ1ZVxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAnU2V0IGBWdWUuY29uZmlnLmRlYnVnID0gdHJ1ZWAgdG8gZW5hYmxlIGRlYnVnIG1vZGUuJ1xuICAgICAgICApXG4gICAgICB9XG4gICAgICBjb25zb2xlLndhcm4oJ1tWdWUgd2Fybl06ICcgKyBtc2cpXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgIGlmIChjb25maWcuZGVidWcpIHtcbiAgICAgICAgLyoganNoaW50IGRlYnVnOiB0cnVlICovXG4gICAgICAgIGRlYnVnZ2VyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCBhc3NldCBleGlzdHNcbiAgICovXG5cbiAgZXhwb3J0cy5hc3NlcnRBc3NldCA9IGZ1bmN0aW9uICh2YWwsIHR5cGUsIGlkKSB7XG4gICAgaWYgKCF2YWwpIHtcbiAgICAgIGV4cG9ydHMud2FybignRmFpbGVkIHRvIHJlc29sdmUgJyArIHR5cGUgKyAnOiAnICsgaWQpXG4gICAgfVxuICB9XG59IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG5cbi8qKlxuICogQ2hlY2sgaWYgYSBub2RlIGlzIGluIHRoZSBkb2N1bWVudC5cbiAqIE5vdGU6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jb250YWlucyBzaG91bGQgd29yayBoZXJlXG4gKiBidXQgYWx3YXlzIHJldHVybnMgZmFsc2UgZm9yIGNvbW1lbnQgbm9kZXMgaW4gcGhhbnRvbWpzLFxuICogbWFraW5nIHVuaXQgdGVzdHMgZGlmZmljdWx0LiBUaGlzIGlzIGZpeGVkIGJ5eSBkb2luZyB0aGVcbiAqIGNvbnRhaW5zKCkgY2hlY2sgb24gdGhlIG5vZGUncyBwYXJlbnROb2RlIGluc3RlYWQgb2ZcbiAqIHRoZSBub2RlIGl0c2VsZi5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxudmFyIGRvYyA9XG4gIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50XG5cbmV4cG9ydHMuaW5Eb2MgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgcGFyZW50ID0gbm9kZSAmJiBub2RlLnBhcmVudE5vZGVcbiAgcmV0dXJuIGRvYyA9PT0gbm9kZSB8fFxuICAgIGRvYyA9PT0gcGFyZW50IHx8XG4gICAgISEocGFyZW50ICYmIHBhcmVudC5ub2RlVHlwZSA9PT0gMSAmJiAoZG9jLmNvbnRhaW5zKHBhcmVudCkpKVxufVxuXG4vKipcbiAqIEV4dHJhY3QgYW4gYXR0cmlidXRlIGZyb20gYSBub2RlLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJcbiAqL1xuXG5leHBvcnRzLmF0dHIgPSBmdW5jdGlvbiAobm9kZSwgYXR0cikge1xuICBhdHRyID0gY29uZmlnLnByZWZpeCArIGF0dHJcbiAgdmFyIHZhbCA9IG5vZGUuZ2V0QXR0cmlidXRlKGF0dHIpXG4gIGlmICh2YWwgIT09IG51bGwpIHtcbiAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuLyoqXG4gKiBJbnNlcnQgZWwgYmVmb3JlIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKi9cblxuZXhwb3J0cy5iZWZvcmUgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCkge1xuICB0YXJnZXQucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldClcbn1cblxuLyoqXG4gKiBJbnNlcnQgZWwgYWZ0ZXIgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqL1xuXG5leHBvcnRzLmFmdGVyID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQpIHtcbiAgaWYgKHRhcmdldC5uZXh0U2libGluZykge1xuICAgIGV4cG9ydHMuYmVmb3JlKGVsLCB0YXJnZXQubmV4dFNpYmxpbmcpXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZWwpXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgZWwgZnJvbSBET01cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKi9cblxuZXhwb3J0cy5yZW1vdmUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbClcbn1cblxuLyoqXG4gKiBQcmVwZW5kIGVsIHRvIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKi9cblxuZXhwb3J0cy5wcmVwZW5kID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQpIHtcbiAgaWYgKHRhcmdldC5maXJzdENoaWxkKSB7XG4gICAgZXhwb3J0cy5iZWZvcmUoZWwsIHRhcmdldC5maXJzdENoaWxkKVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgfVxufVxuXG4vKipcbiAqIFJlcGxhY2UgdGFyZ2V0IHdpdGggZWxcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5cbmV4cG9ydHMucmVwbGFjZSA9IGZ1bmN0aW9uICh0YXJnZXQsIGVsKSB7XG4gIHZhciBwYXJlbnQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICBpZiAocGFyZW50KSB7XG4gICAgcGFyZW50LnJlcGxhY2VDaGlsZChlbCwgdGFyZ2V0KVxuICB9XG59XG5cbi8qKlxuICogQ29weSBhdHRyaWJ1dGVzIGZyb20gb25lIGVsZW1lbnQgdG8gYW5vdGhlci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGZyb21cbiAqIEBwYXJhbSB7RWxlbWVudH0gdG9cbiAqL1xuXG5leHBvcnRzLmNvcHlBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gIGlmIChmcm9tLmhhc0F0dHJpYnV0ZXMoKSkge1xuICAgIHZhciBhdHRycyA9IGZyb20uYXR0cmlidXRlc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgYXR0ciA9IGF0dHJzW2ldXG4gICAgICB0by5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lciBzaG9ydGhhbmQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbmV4cG9ydHMub24gPSBmdW5jdGlvbiAoZWwsIGV2ZW50LCBjYikge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYilcbn1cblxuLyoqXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXIgc2hvcnRoYW5kLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5leHBvcnRzLm9mZiA9IGZ1bmN0aW9uIChlbCwgZXZlbnQsIGNiKSB7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNiKVxufVxuXG4vKipcbiAqIEFkZCBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIElFICYgU1ZHXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJvbmd9IGNsc1xuICovXG5cbmV4cG9ydHMuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNscykge1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChjbHMpXG4gIH0gZWxzZSB7XG4gICAgdmFyIGN1ciA9ICcgJyArIChlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpICsgJyAnXG4gICAgaWYgKGN1ci5pbmRleE9mKCcgJyArIGNscyArICcgJykgPCAwKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgKGN1ciArIGNscykudHJpbSgpKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIElFICYgU1ZHXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJvbmd9IGNsc1xuICovXG5cbmV4cG9ydHMucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNscykge1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbHMpXG4gIH0gZWxzZSB7XG4gICAgdmFyIGN1ciA9ICcgJyArIChlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpICsgJyAnXG4gICAgdmFyIHRhciA9ICcgJyArIGNscyArICcgJ1xuICAgIHdoaWxlIChjdXIuaW5kZXhPZih0YXIpID49IDApIHtcbiAgICAgIGN1ciA9IGN1ci5yZXBsYWNlKHRhciwgJyAnKVxuICAgIH1cbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY3VyLnRyaW0oKSlcbiAgfVxufVxuXG4vKipcbiAqIEV4dHJhY3QgcmF3IGNvbnRlbnQgaW5zaWRlIGFuIGVsZW1lbnQgaW50byBhIHRlbXBvcmFyeVxuICogY29udGFpbmVyIGRpdlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYXNGcmFnbWVudFxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5leHBvcnRzLmV4dHJhY3RDb250ZW50ID0gZnVuY3Rpb24gKGVsLCBhc0ZyYWdtZW50KSB7XG4gIHZhciBjaGlsZFxuICB2YXIgcmF3Q29udGVudFxuICBpZiAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgcmF3Q29udGVudCA9IGFzRnJhZ21lbnRcbiAgICAgID8gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIHdoaWxlIChjaGlsZCA9IGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHJhd0NvbnRlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgfVxuICB9XG4gIHJldHVybiByYXdDb250ZW50XG59XG4iLCIvKipcbiAqIENhbiB3ZSB1c2UgX19wcm90b19fP1xuICpcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaGFzUHJvdG8gPSAnX19wcm90b19fJyBpbiB7fVxuXG4vKipcbiAqIEluZGljYXRlcyB3ZSBoYXZlIGEgd2luZG93XG4gKlxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xudmFyIGluQnJvd3NlciA9IGV4cG9ydHMuaW5Ccm93c2VyID1cbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgdG9TdHJpbmcuY2FsbCh3aW5kb3cpICE9PSAnW29iamVjdCBPYmplY3RdJ1xuXG4vKipcbiAqIERlZmVyIGEgdGFzayB0byBleGVjdXRlIGl0IGFzeW5jaHJvbm91c2x5LiBJZGVhbGx5IHRoaXNcbiAqIHNob3VsZCBiZSBleGVjdXRlZCBhcyBhIG1pY3JvdGFzaywgc28gd2UgbGV2ZXJhZ2VcbiAqIE11dGF0aW9uT2JzZXJ2ZXIgaWYgaXQncyBhdmFpbGFibGUsIGFuZCBmYWxsYmFjayB0b1xuICogc2V0VGltZW91dCgwKS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICovXG5cbmV4cG9ydHMubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgY2FsbGJhY2tzID0gW11cbiAgdmFyIHBlbmRpbmcgPSBmYWxzZVxuICB2YXIgdGltZXJGdW5jXG4gIGZ1bmN0aW9uIGhhbmRsZSAoKSB7XG4gICAgcGVuZGluZyA9IGZhbHNlXG4gICAgdmFyIGNvcGllcyA9IGNhbGxiYWNrcy5zbGljZSgwKVxuICAgIGNhbGxiYWNrcyA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3BpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvcGllc1tpXSgpXG4gICAgfVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIGNvdW50ZXIgPSAxXG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoaGFuZGxlKVxuICAgIHZhciB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvdW50ZXIpXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0ZXh0Tm9kZSwge1xuICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZVxuICAgIH0pXG4gICAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgY291bnRlciA9IChjb3VudGVyICsgMSkgJSAyXG4gICAgICB0ZXh0Tm9kZS5kYXRhID0gY291bnRlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aW1lckZ1bmMgPSBzZXRUaW1lb3V0XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChjYiwgY3R4KSB7XG4gICAgdmFyIGZ1bmMgPSBjdHhcbiAgICAgID8gZnVuY3Rpb24gKCkgeyBjYi5jYWxsKGN0eCkgfVxuICAgICAgOiBjYlxuICAgIGNhbGxiYWNrcy5wdXNoKGZ1bmMpXG4gICAgaWYgKHBlbmRpbmcpIHJldHVyblxuICAgIHBlbmRpbmcgPSB0cnVlXG4gICAgdGltZXJGdW5jKGhhbmRsZSwgMClcbiAgfVxufSkoKVxuXG4vKipcbiAqIERldGVjdCBpZiB3ZSBhcmUgaW4gSUU5Li4uXG4gKlxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cblxuZXhwb3J0cy5pc0lFOSA9XG4gIGluQnJvd3NlciAmJlxuICBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgOS4wJykgPiAwXG5cbi8qKlxuICogU25pZmYgdHJhbnNpdGlvbi9hbmltYXRpb24gZXZlbnRzXG4gKi9cblxuaWYgKGluQnJvd3NlciAmJiAhZXhwb3J0cy5pc0lFOSkge1xuICB2YXIgaXNXZWJraXRUcmFucyA9XG4gICAgd2luZG93Lm9udHJhbnNpdGlvbmVuZCA9PT0gdW5kZWZpbmVkICYmXG4gICAgd2luZG93Lm9ud2Via2l0dHJhbnNpdGlvbmVuZCAhPT0gdW5kZWZpbmVkXG4gIHZhciBpc1dlYmtpdEFuaW0gPVxuICAgIHdpbmRvdy5vbmFuaW1hdGlvbmVuZCA9PT0gdW5kZWZpbmVkICYmXG4gICAgd2luZG93Lm9ud2Via2l0YW5pbWF0aW9uZW5kICE9PSB1bmRlZmluZWRcbiAgZXhwb3J0cy50cmFuc2l0aW9uUHJvcCA9IGlzV2Via2l0VHJhbnNcbiAgICA/ICdXZWJraXRUcmFuc2l0aW9uJ1xuICAgIDogJ3RyYW5zaXRpb24nXG4gIGV4cG9ydHMudHJhbnNpdGlvbkVuZEV2ZW50ID0gaXNXZWJraXRUcmFuc1xuICAgID8gJ3dlYmtpdFRyYW5zaXRpb25FbmQnXG4gICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgZXhwb3J0cy5hbmltYXRpb25Qcm9wID0gaXNXZWJraXRBbmltXG4gICAgPyAnV2Via2l0QW5pbWF0aW9uJ1xuICAgIDogJ2FuaW1hdGlvbidcbiAgZXhwb3J0cy5hbmltYXRpb25FbmRFdmVudCA9IGlzV2Via2l0QW5pbVxuICAgID8gJ3dlYmtpdEFuaW1hdGlvbkVuZCdcbiAgICA6ICdhbmltYXRpb25lbmQnXG59IiwidmFyIF8gPSByZXF1aXJlKCcuL2RlYnVnJylcblxuLyoqXG4gKiBSZXNvbHZlIHJlYWQgJiB3cml0ZSBmaWx0ZXJzIGZvciBhIHZtIGluc3RhbmNlLiBUaGVcbiAqIGZpbHRlcnMgZGVzY3JpcHRvciBBcnJheSBjb21lcyBmcm9tIHRoZSBkaXJlY3RpdmUgcGFyc2VyLlxuICpcbiAqIFRoaXMgaXMgZXh0cmFjdGVkIGludG8gaXRzIG93biB1dGlsaXR5IHNvIGl0IGNhblxuICogYmUgdXNlZCBpbiBtdWx0aXBsZSBzY2VuYXJpb3MuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZpbHRlcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmV4cG9ydHMucmVzb2x2ZUZpbHRlcnMgPSBmdW5jdGlvbiAodm0sIGZpbHRlcnMsIHRhcmdldCkge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgcmVzID0gdGFyZ2V0IHx8IHt9XG4gIC8vIHZhciByZWdpc3RyeSA9IHZtLiRvcHRpb25zLmZpbHRlcnNcbiAgZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG4gICAgdmFyIGRlZiA9IHZtLiRvcHRpb25zLmZpbHRlcnNbZi5uYW1lXVxuICAgIF8uYXNzZXJ0QXNzZXQoZGVmLCAnZmlsdGVyJywgZi5uYW1lKVxuICAgIGlmICghZGVmKSByZXR1cm5cbiAgICB2YXIgYXJncyA9IGYuYXJnc1xuICAgIHZhciByZWFkZXIsIHdyaXRlclxuICAgIGlmICh0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZWFkZXIgPSBkZWZcbiAgICB9IGVsc2Uge1xuICAgICAgcmVhZGVyID0gZGVmLnJlYWRcbiAgICAgIHdyaXRlciA9IGRlZi53cml0ZVxuICAgIH1cbiAgICBpZiAocmVhZGVyKSB7XG4gICAgICBpZiAoIXJlcy5yZWFkKSByZXMucmVhZCA9IFtdXG4gICAgICByZXMucmVhZC5wdXNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gYXJnc1xuICAgICAgICAgID8gcmVhZGVyLmFwcGx5KHZtLCBbdmFsdWVdLmNvbmNhdChhcmdzKSlcbiAgICAgICAgICA6IHJlYWRlci5jYWxsKHZtLCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmICh3cml0ZXIpIHtcbiAgICAgIGlmICghcmVzLndyaXRlKSByZXMud3JpdGUgPSBbXVxuICAgICAgcmVzLndyaXRlLnB1c2goZnVuY3Rpb24gKHZhbHVlLCBvbGRWYWwpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NcbiAgICAgICAgICA/IHdyaXRlci5hcHBseSh2bSwgW3ZhbHVlLCBvbGRWYWxdLmNvbmNhdChhcmdzKSlcbiAgICAgICAgICA6IHdyaXRlci5jYWxsKHZtLCB2YWx1ZSwgb2xkVmFsKVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBBcHBseSBmaWx0ZXJzIHRvIGEgdmFsdWVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge0FycmF5fSBmaWx0ZXJzXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Kn0gb2xkVmFsXG4gKiBAcmV0dXJuIHsqfVxuICovXG5cbmV4cG9ydHMuYXBwbHlGaWx0ZXJzID0gZnVuY3Rpb24gKHZhbHVlLCBmaWx0ZXJzLCB2bSwgb2xkVmFsKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIGZvciAodmFyIGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YWx1ZSA9IGZpbHRlcnNbaV0uY2FsbCh2bSwgdmFsdWUsIG9sZFZhbClcbiAgfVxuICByZXR1cm4gdmFsdWVcbn0iLCJ2YXIgbGFuZyAgID0gcmVxdWlyZSgnLi9sYW5nJylcbnZhciBleHRlbmQgPSBsYW5nLmV4dGVuZFxuXG5leHRlbmQoZXhwb3J0cywgbGFuZylcbmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2VudicpKVxuZXh0ZW5kKGV4cG9ydHMsIHJlcXVpcmUoJy4vZG9tJykpXG5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9maWx0ZXInKSlcbmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2RlYnVnJykpIiwiLyoqXG4gKiBDaGVjayBpcyBhIHN0cmluZyBzdGFydHMgd2l0aCAkIG9yIF9cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNSZXNlcnZlZCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgdmFyIGMgPSAoc3RyICsgJycpLmNoYXJDb2RlQXQoMClcbiAgcmV0dXJuIGMgPT09IDB4MjQgfHwgYyA9PT0gMHg1RlxufVxuXG4vKipcbiAqIEd1YXJkIHRleHQgb3V0cHV0LCBtYWtlIHN1cmUgdW5kZWZpbmVkIG91dHB1dHNcbiAqIGVtcHR5IHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLnRvU3RyaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgPyAnJ1xuICAgIDogdmFsdWUudG9TdHJpbmcoKVxufVxuXG4vKipcbiAqIENoZWNrIGFuZCBjb252ZXJ0IHBvc3NpYmxlIG51bWVyaWMgbnVtYmVycyBiZWZvcmVcbiAqIHNldHRpbmcgYmFjayB0byBkYXRhXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7KnxOdW1iZXJ9XG4gKi9cblxuZXhwb3J0cy50b051bWJlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gKFxuICAgIGlzTmFOKHZhbHVlKSB8fFxuICAgIHZhbHVlID09PSBudWxsIHx8XG4gICAgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbidcbiAgKSA/IHZhbHVlXG4gICAgOiBOdW1iZXIodmFsdWUpXG59XG5cbi8qKlxuICogU3RyaXAgcXVvdGVzIGZyb20gYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmcgfCBmYWxzZX1cbiAqL1xuXG5leHBvcnRzLnN0cmlwUXVvdGVzID0gZnVuY3Rpb24gKHN0cikge1xuICB2YXIgYSA9IHN0ci5jaGFyQ29kZUF0KDApXG4gIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoc3RyLmxlbmd0aCAtIDEpXG4gIHJldHVybiBhID09PSBiICYmIChhID09PSAweDIyIHx8IGEgPT09IDB4MjcpXG4gICAgPyBzdHIuc2xpY2UoMSwgLTEpXG4gICAgOiBmYWxzZVxufVxuXG4vKipcbiAqIFJlcGxhY2UgaGVscGVyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IF8gLSBtYXRjaGVkIGRlbGltaXRlclxuICogQHBhcmFtIHtTdHJpbmd9IGMgLSBtYXRjaGVkIGNoYXJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdG9VcHBlciAoXywgYykge1xuICByZXR1cm4gYyA/IGMudG9VcHBlckNhc2UgKCkgOiAnJ1xufVxuXG4vKipcbiAqIENhbWVsaXplIGEgaHlwaGVuLWRlbG1pdGVkIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGNhbWVsUkUgPSAvLShcXHcpL2dcbmV4cG9ydHMuY2FtZWxpemUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbFJFLCB0b1VwcGVyKVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGh5cGhlbi91bmRlcnNjb3JlL3NsYXNoIGRlbGltaXRlcmVkIG5hbWVzIGludG9cbiAqIGNhbWVsaXplZCBjbGFzc05hbWVzLlxuICpcbiAqIGUuZy4gbXktY29tcG9uZW50ID0+IE15Q29tcG9uZW50XG4gKiAgICAgIHNvbWVfZWxzZSAgICA9PiBTb21lRWxzZVxuICogICAgICBzb21lL2NvbXAgICAgPT4gU29tZUNvbXBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGNsYXNzaWZ5UkUgPSAvKD86XnxbLV9cXC9dKShcXHcpL2dcbmV4cG9ydHMuY2xhc3NpZnkgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjbGFzc2lmeVJFLCB0b1VwcGVyKVxufVxuXG4vKipcbiAqIFNpbXBsZSBiaW5kLCBmYXN0ZXIgdGhhbiBuYXRpdmVcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24gKGZuLCBjdHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZm4uYXBwbHkoY3R4LCBhcmd1bWVudHMpXG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIEFycmF5LWxpa2Ugb2JqZWN0IHRvIGEgcmVhbCBBcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LWxpa2V9IGxpc3RcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3RhcnRdIC0gc3RhcnQgaW5kZXhcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmV4cG9ydHMudG9BcnJheSA9IGZ1bmN0aW9uIChsaXN0LCBzdGFydCkge1xuICBzdGFydCA9IHN0YXJ0IHx8IDBcbiAgdmFyIGkgPSBsaXN0Lmxlbmd0aCAtIHN0YXJ0XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoaSlcbiAgd2hpbGUgKGktLSkge1xuICAgIHJldFtpXSA9IGxpc3RbaSArIHN0YXJ0XVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBNaXggcHJvcGVydGllcyBpbnRvIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRvXG4gKiBAcGFyYW0ge09iamVjdH0gZnJvbVxuICovXG5cbmV4cG9ydHMuZXh0ZW5kID0gZnVuY3Rpb24gKHRvLCBmcm9tKSB7XG4gIGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgdG9ba2V5XSA9IGZyb21ba2V5XVxuICB9XG4gIHJldHVybiB0b1xufVxuXG4vKipcbiAqIFF1aWNrIG9iamVjdCBjaGVjayAtIHRoaXMgaXMgcHJpbWFyaWx5IHVzZWQgdG8gdGVsbFxuICogT2JqZWN0cyBmcm9tIHByaW1pdGl2ZSB2YWx1ZXMgd2hlbiB3ZSBrbm93IHRoZSB2YWx1ZVxuICogaXMgYSBKU09OLWNvbXBsaWFudCB0eXBlLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNPYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcbn1cblxuLyoqXG4gKiBTdHJpY3Qgb2JqZWN0IHR5cGUgY2hlY2suIE9ubHkgcmV0dXJucyB0cnVlXG4gKiBmb3IgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbmV4cG9ydHMuaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbn1cblxuLyoqXG4gKiBBcnJheSB0eXBlIGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKVxufVxuXG4vKipcbiAqIERlZmluZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2VudW1lcmFibGVdXG4gKi9cblxuZXhwb3J0cy5kZWZpbmUgPSBmdW5jdGlvbiAob2JqLCBrZXksIHZhbCwgZW51bWVyYWJsZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICB2YWx1ZSAgICAgICAgOiB2YWwsXG4gICAgZW51bWVyYWJsZSAgIDogISFlbnVtZXJhYmxlLFxuICAgIHdyaXRhYmxlICAgICA6IHRydWUsXG4gICAgY29uZmlndXJhYmxlIDogdHJ1ZVxuICB9KVxufVxuXG4vKipcbiAqIERlYm91bmNlIGEgZnVuY3Rpb24gc28gaXQgb25seSBnZXRzIGNhbGxlZCBhZnRlciB0aGVcbiAqIGlucHV0IHN0b3BzIGFycml2aW5nIGFmdGVyIHRoZSBnaXZlbiB3YWl0IHBlcmlvZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXG4gKiBAcGFyYW0ge051bWJlcn0gd2FpdFxuICogQHJldHVybiB7RnVuY3Rpb259IC0gdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICovXG5cbmV4cG9ydHMuZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdFxuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGFzdCA9IERhdGUubm93KCkgLSB0aW1lc3RhbXBcbiAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+PSAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsXG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbFxuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY29udGV4dCA9IHRoaXNcbiAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgdGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgIGlmICghdGltZW91dCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi9pbmRleCcpXG52YXIgZXh0ZW5kID0gXy5leHRlbmRcblxuLyoqXG4gKiBPcHRpb24gb3ZlcndyaXRpbmcgc3RyYXRlZ2llcyBhcmUgZnVuY3Rpb25zIHRoYXQgaGFuZGxlXG4gKiBob3cgdG8gbWVyZ2UgYSBwYXJlbnQgb3B0aW9uIHZhbHVlIGFuZCBhIGNoaWxkIG9wdGlvblxuICogdmFsdWUgaW50byB0aGUgZmluYWwgdmFsdWUuXG4gKlxuICogQWxsIHN0cmF0ZWd5IGZ1bmN0aW9ucyBmb2xsb3cgdGhlIHNhbWUgc2lnbmF0dXJlOlxuICpcbiAqIEBwYXJhbSB7Kn0gcGFyZW50VmFsXG4gKiBAcGFyYW0geyp9IGNoaWxkVmFsXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXVxuICovXG5cbnZhciBzdHJhdHMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbi8qKlxuICogSGVscGVyIHRoYXQgcmVjdXJzaXZlbHkgbWVyZ2VzIHR3byBkYXRhIG9iamVjdHMgdG9nZXRoZXIuXG4gKi9cblxuZnVuY3Rpb24gbWVyZ2VEYXRhICh0bywgZnJvbSkge1xuICB2YXIga2V5LCB0b1ZhbCwgZnJvbVZhbFxuICBmb3IgKGtleSBpbiBmcm9tKSB7XG4gICAgdG9WYWwgPSB0b1trZXldXG4gICAgZnJvbVZhbCA9IGZyb21ba2V5XVxuICAgIGlmICghdG8uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgdG8uJGFkZChrZXksIGZyb21WYWwpXG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHRvVmFsKSAmJiBfLmlzT2JqZWN0KGZyb21WYWwpKSB7XG4gICAgICBtZXJnZURhdGEodG9WYWwsIGZyb21WYWwpXG4gICAgfVxuICB9XG4gIHJldHVybiB0b1xufVxuXG4vKipcbiAqIERhdGFcbiAqL1xuXG5zdHJhdHMuZGF0YSA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsLCB2bSkge1xuICBpZiAoIXZtKSB7XG4gICAgLy8gaW4gYSBWdWUuZXh0ZW5kIG1lcmdlLCBib3RoIHNob3VsZCBiZSBmdW5jdGlvbnNcbiAgICBpZiAoIWNoaWxkVmFsKSB7XG4gICAgICByZXR1cm4gcGFyZW50VmFsXG4gICAgfVxuICAgIGlmICh0eXBlb2YgY2hpbGRWYWwgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ1RoZSBcImRhdGFcIiBvcHRpb24gc2hvdWxkIGJlIGEgZnVuY3Rpb24gJyArXG4gICAgICAgICd0aGF0IHJldHVybnMgYSBwZXItaW5zdGFuY2UgdmFsdWUgaW4gY29tcG9uZW50ICcgK1xuICAgICAgICAnZGVmaW5pdGlvbnMuJ1xuICAgICAgKVxuICAgICAgcmV0dXJuIHBhcmVudFZhbFxuICAgIH1cbiAgICBpZiAoIXBhcmVudFZhbCkge1xuICAgICAgcmV0dXJuIGNoaWxkVmFsXG4gICAgfVxuICAgIC8vIHdoZW4gcGFyZW50VmFsICYgY2hpbGRWYWwgYXJlIGJvdGggcHJlc2VudCxcbiAgICAvLyB3ZSBuZWVkIHRvIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgICAvLyBtZXJnZWQgcmVzdWx0IG9mIGJvdGggZnVuY3Rpb25zLi4uIG5vIG5lZWQgdG9cbiAgICAvLyBjaGVjayBpZiBwYXJlbnRWYWwgaXMgYSBmdW5jdGlvbiBoZXJlIGJlY2F1c2VcbiAgICAvLyBpdCBoYXMgdG8gYmUgYSBmdW5jdGlvbiB0byBwYXNzIHByZXZpb3VzIG1lcmdlcy5cbiAgICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkRGF0YUZuICgpIHtcbiAgICAgIHJldHVybiBtZXJnZURhdGEoXG4gICAgICAgIGNoaWxkVmFsLmNhbGwodGhpcyksXG4gICAgICAgIHBhcmVudFZhbC5jYWxsKHRoaXMpXG4gICAgICApXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGluc3RhbmNlIG1lcmdlLCByZXR1cm4gcmF3IG9iamVjdFxuICAgIHZhciBpbnN0YW5jZURhdGEgPSB0eXBlb2YgY2hpbGRWYWwgPT09ICdmdW5jdGlvbidcbiAgICAgID8gY2hpbGRWYWwuY2FsbCh2bSlcbiAgICAgIDogY2hpbGRWYWxcbiAgICB2YXIgZGVmYXVsdERhdGEgPSB0eXBlb2YgcGFyZW50VmFsID09PSAnZnVuY3Rpb24nXG4gICAgICA/IHBhcmVudFZhbC5jYWxsKHZtKVxuICAgICAgOiB1bmRlZmluZWRcbiAgICBpZiAoaW5zdGFuY2VEYXRhKSB7XG4gICAgICByZXR1cm4gbWVyZ2VEYXRhKGluc3RhbmNlRGF0YSwgZGVmYXVsdERhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkZWZhdWx0RGF0YVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEVsXG4gKi9cblxuc3RyYXRzLmVsID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwsIHZtKSB7XG4gIGlmICghdm0gJiYgY2hpbGRWYWwgJiYgdHlwZW9mIGNoaWxkVmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgXy53YXJuKFxuICAgICAgJ1RoZSBcImVsXCIgb3B0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uICcgK1xuICAgICAgJ3RoYXQgcmV0dXJucyBhIHBlci1pbnN0YW5jZSB2YWx1ZSBpbiBjb21wb25lbnQgJyArXG4gICAgICAnZGVmaW5pdGlvbnMuJ1xuICAgIClcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgcmV0ID0gY2hpbGRWYWwgfHwgcGFyZW50VmFsXG4gIC8vIGludm9rZSB0aGUgZWxlbWVudCBmYWN0b3J5IGlmIHRoaXMgaXMgaW5zdGFuY2UgbWVyZ2VcbiAgcmV0dXJuIHZtICYmIHR5cGVvZiByZXQgPT09ICdmdW5jdGlvbidcbiAgICA/IHJldC5jYWxsKHZtKVxuICAgIDogcmV0XG59XG5cbi8qKlxuICogSG9va3MgYW5kIHBhcmFtIGF0dHJpYnV0ZXMgYXJlIG1lcmdlZCBhcyBhcnJheXMuXG4gKi9cblxuc3RyYXRzLmNyZWF0ZWQgPVxuc3RyYXRzLnJlYWR5ID1cbnN0cmF0cy5hdHRhY2hlZCA9XG5zdHJhdHMuZGV0YWNoZWQgPVxuc3RyYXRzLmJlZm9yZUNvbXBpbGUgPVxuc3RyYXRzLmNvbXBpbGVkID1cbnN0cmF0cy5iZWZvcmVEZXN0cm95ID1cbnN0cmF0cy5kZXN0cm95ZWQgPVxuc3RyYXRzLnBhcmFtQXR0cmlidXRlcyA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIHJldHVybiBjaGlsZFZhbFxuICAgID8gcGFyZW50VmFsXG4gICAgICA/IHBhcmVudFZhbC5jb25jYXQoY2hpbGRWYWwpXG4gICAgICA6IF8uaXNBcnJheShjaGlsZFZhbClcbiAgICAgICAgPyBjaGlsZFZhbFxuICAgICAgICA6IFtjaGlsZFZhbF1cbiAgICA6IHBhcmVudFZhbFxufVxuXG4vKipcbiAqIEFzc2V0c1xuICpcbiAqIFdoZW4gYSB2bSBpcyBwcmVzZW50IChpbnN0YW5jZSBjcmVhdGlvbiksIHdlIG5lZWQgdG8gZG9cbiAqIGEgdGhyZWUtd2F5IG1lcmdlIGJldHdlZW4gY29uc3RydWN0b3Igb3B0aW9ucywgaW5zdGFuY2VcbiAqIG9wdGlvbnMgYW5kIHBhcmVudCBvcHRpb25zLlxuICovXG5cbnN0cmF0cy5kaXJlY3RpdmVzID1cbnN0cmF0cy5maWx0ZXJzID1cbnN0cmF0cy5wYXJ0aWFscyA9XG5zdHJhdHMudHJhbnNpdGlvbnMgPVxuc3RyYXRzLmNvbXBvbmVudHMgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCwgdm0sIGtleSkge1xuICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShcbiAgICB2bSAmJiB2bS4kcGFyZW50XG4gICAgICA/IHZtLiRwYXJlbnQuJG9wdGlvbnNba2V5XVxuICAgICAgOiBfLlZ1ZS5vcHRpb25zW2tleV1cbiAgKVxuICBpZiAocGFyZW50VmFsKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwYXJlbnRWYWwpXG4gICAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICAgIHZhciBmaWVsZFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGZpZWxkID0ga2V5c1tpXVxuICAgICAgcmV0W2ZpZWxkXSA9IHBhcmVudFZhbFtmaWVsZF1cbiAgICB9XG4gIH1cbiAgaWYgKGNoaWxkVmFsKSBleHRlbmQocmV0LCBjaGlsZFZhbClcbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIEV2ZW50cyAmIFdhdGNoZXJzLlxuICpcbiAqIEV2ZW50cyAmIHdhdGNoZXJzIGhhc2hlcyBzaG91bGQgbm90IG92ZXJ3cml0ZSBvbmVcbiAqIGFub3RoZXIsIHNvIHdlIG1lcmdlIHRoZW0gYXMgYXJyYXlzLlxuICovXG5cbnN0cmF0cy53YXRjaCA9XG5zdHJhdHMuZXZlbnRzID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgaWYgKCFjaGlsZFZhbCkgcmV0dXJuIHBhcmVudFZhbFxuICBpZiAoIXBhcmVudFZhbCkgcmV0dXJuIGNoaWxkVmFsXG4gIHZhciByZXQgPSB7fVxuICBleHRlbmQocmV0LCBwYXJlbnRWYWwpXG4gIGZvciAodmFyIGtleSBpbiBjaGlsZFZhbCkge1xuICAgIHZhciBwYXJlbnQgPSByZXRba2V5XVxuICAgIHZhciBjaGlsZCA9IGNoaWxkVmFsW2tleV1cbiAgICBpZiAocGFyZW50ICYmICFfLmlzQXJyYXkocGFyZW50KSkge1xuICAgICAgcGFyZW50ID0gW3BhcmVudF1cbiAgICB9XG4gICAgcmV0W2tleV0gPSBwYXJlbnRcbiAgICAgID8gcGFyZW50LmNvbmNhdChjaGlsZClcbiAgICAgIDogW2NoaWxkXVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBPdGhlciBvYmplY3QgaGFzaGVzLlxuICovXG5cbnN0cmF0cy5tZXRob2RzID1cbnN0cmF0cy5jb21wdXRlZCA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIGlmICghY2hpbGRWYWwpIHJldHVybiBwYXJlbnRWYWxcbiAgaWYgKCFwYXJlbnRWYWwpIHJldHVybiBjaGlsZFZhbFxuICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRWYWwpXG4gIGV4dGVuZChyZXQsIGNoaWxkVmFsKVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogRGVmYXVsdCBzdHJhdGVneS5cbiAqL1xuXG52YXIgZGVmYXVsdFN0cmF0ID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgcmV0dXJuIGNoaWxkVmFsID09PSB1bmRlZmluZWRcbiAgICA/IHBhcmVudFZhbFxuICAgIDogY2hpbGRWYWxcbn1cblxuLyoqXG4gKiBNYWtlIHN1cmUgY29tcG9uZW50IG9wdGlvbnMgZ2V0IGNvbnZlcnRlZCB0byBhY3R1YWxcbiAqIGNvbnN0cnVjdG9ycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50c1xuICovXG5cbmZ1bmN0aW9uIGd1YXJkQ29tcG9uZW50cyAoY29tcG9uZW50cykge1xuICBpZiAoY29tcG9uZW50cykge1xuICAgIHZhciBkZWZcbiAgICBmb3IgKHZhciBrZXkgaW4gY29tcG9uZW50cykge1xuICAgICAgZGVmID0gY29tcG9uZW50c1trZXldXG4gICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KGRlZikpIHtcbiAgICAgICAgZGVmLm5hbWUgPSBrZXlcbiAgICAgICAgY29tcG9uZW50c1trZXldID0gXy5WdWUuZXh0ZW5kKGRlZilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZSB0d28gb3B0aW9uIG9iamVjdHMgaW50byBhIG5ldyBvbmUuXG4gKiBDb3JlIHV0aWxpdHkgdXNlZCBpbiBib3RoIGluc3RhbnRpYXRpb24gYW5kIGluaGVyaXRhbmNlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJlbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjaGlsZFxuICogQHBhcmFtIHtWdWV9IFt2bV0gLSBpZiB2bSBpcyBwcmVzZW50LCBpbmRpY2F0ZXMgdGhpcyBpc1xuICogICAgICAgICAgICAgICAgICAgICBhbiBpbnN0YW50aWF0aW9uIG1lcmdlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VPcHRpb25zIChwYXJlbnQsIGNoaWxkLCB2bSkge1xuICBndWFyZENvbXBvbmVudHMoY2hpbGQuY29tcG9uZW50cylcbiAgdmFyIG9wdGlvbnMgPSB7fVxuICB2YXIga2V5XG4gIGlmIChjaGlsZC5taXhpbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkLm1peGlucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHBhcmVudCA9IG1lcmdlT3B0aW9ucyhwYXJlbnQsIGNoaWxkLm1peGluc1tpXSwgdm0pXG4gICAgfVxuICB9XG4gIGZvciAoa2V5IGluIHBhcmVudCkge1xuICAgIG1lcmdlKGtleSlcbiAgfVxuICBmb3IgKGtleSBpbiBjaGlsZCkge1xuICAgIGlmICghKHBhcmVudC5oYXNPd25Qcm9wZXJ0eShrZXkpKSkge1xuICAgICAgbWVyZ2Uoa2V5KVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtZXJnZSAoa2V5KSB7XG4gICAgdmFyIHN0cmF0ID0gc3RyYXRzW2tleV0gfHwgZGVmYXVsdFN0cmF0XG4gICAgb3B0aW9uc1trZXldID0gc3RyYXQocGFyZW50W2tleV0sIGNoaWxkW2tleV0sIHZtLCBrZXkpXG4gIH1cbiAgcmV0dXJuIG9wdGlvbnNcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgZXh0ZW5kID0gXy5leHRlbmRcblxuLyoqXG4gKiBUaGUgZXhwb3NlZCBWdWUgY29uc3RydWN0b3IuXG4gKlxuICogQVBJIGNvbnZlbnRpb25zOlxuICogLSBwdWJsaWMgQVBJIG1ldGhvZHMvcHJvcGVydGllcyBhcmUgcHJlZmlleGVkIHdpdGggYCRgXG4gKiAtIGludGVybmFsIG1ldGhvZHMvcHJvcGVydGllcyBhcmUgcHJlZml4ZWQgd2l0aCBgX2BcbiAqIC0gbm9uLXByZWZpeGVkIHByb3BlcnRpZXMgYXJlIGFzc3VtZWQgdG8gYmUgcHJveGllZCB1c2VyXG4gKiAgIGRhdGEuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gVnVlIChvcHRpb25zKSB7XG4gIHRoaXMuX2luaXQob3B0aW9ucylcbn1cblxuLyoqXG4gKiBNaXhpbiBnbG9iYWwgQVBJXG4gKi9cblxuZXh0ZW5kKFZ1ZSwgcmVxdWlyZSgnLi9hcGkvZ2xvYmFsJykpXG5cbi8qKlxuICogVnVlIGFuZCBldmVyeSBjb25zdHJ1Y3RvciB0aGF0IGV4dGVuZHMgVnVlIGhhcyBhblxuICogYXNzb2NpYXRlZCBvcHRpb25zIG9iamVjdCwgd2hpY2ggY2FuIGJlIGFjY2Vzc2VkIGR1cmluZ1xuICogY29tcGlsYXRpb24gc3RlcHMgYXMgYHRoaXMuY29uc3RydWN0b3Iub3B0aW9uc2AuXG4gKlxuICogVGhlc2UgY2FuIGJlIHNlZW4gYXMgdGhlIGRlZmF1bHQgb3B0aW9ucyBvZiBldmVyeVxuICogVnVlIGluc3RhbmNlLlxuICovXG5cblZ1ZS5vcHRpb25zID0ge1xuICBkaXJlY3RpdmVzICA6IHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLFxuICBmaWx0ZXJzICAgICA6IHJlcXVpcmUoJy4vZmlsdGVycycpLFxuICBwYXJ0aWFscyAgICA6IHt9LFxuICB0cmFuc2l0aW9ucyA6IHt9LFxuICBjb21wb25lbnRzICA6IHt9XG59XG5cbi8qKlxuICogQnVpbGQgdXAgdGhlIHByb3RvdHlwZVxuICovXG5cbnZhciBwID0gVnVlLnByb3RvdHlwZVxuXG4vKipcbiAqICRkYXRhIGhhcyBhIHNldHRlciB3aGljaCBkb2VzIGEgYnVuY2ggb2ZcbiAqIHRlYXJkb3duL3NldHVwIHdvcmtcbiAqL1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkocCwgJyRkYXRhJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YVxuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gICAgdGhpcy5fc2V0RGF0YShuZXdEYXRhKVxuICB9XG59KVxuXG4vKipcbiAqIE1peGluIGludGVybmFsIGluc3RhbmNlIG1ldGhvZHNcbiAqL1xuXG5leHRlbmQocCwgcmVxdWlyZSgnLi9pbnN0YW5jZS9pbml0JykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9pbnN0YW5jZS9ldmVudHMnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2luc3RhbmNlL3Njb3BlJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9pbnN0YW5jZS9jb21waWxlJykpXG5cbi8qKlxuICogTWl4aW4gcHVibGljIEFQSSBtZXRob2RzXG4gKi9cblxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2RhdGEnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9kb20nKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9ldmVudHMnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9jaGlsZCcpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2xpZmVjeWNsZScpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IF8uVnVlID0gVnVlIiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4vY29uZmlnJylcbnZhciBPYnNlcnZlciA9IHJlcXVpcmUoJy4vb2JzZXJ2ZXInKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2Vycy9leHByZXNzaW9uJylcbnZhciBiYXRjaGVyID0gcmVxdWlyZSgnLi9iYXRjaGVyJylcbnZhciB1aWQgPSAwXG5cbi8qKlxuICogQSB3YXRjaGVyIHBhcnNlcyBhbiBleHByZXNzaW9uLCBjb2xsZWN0cyBkZXBlbmRlbmNpZXMsXG4gKiBhbmQgZmlyZXMgY2FsbGJhY2sgd2hlbiB0aGUgZXhwcmVzc2lvbiB2YWx1ZSBjaGFuZ2VzLlxuICogVGhpcyBpcyB1c2VkIGZvciBib3RoIHRoZSAkd2F0Y2goKSBhcGkgYW5kIGRpcmVjdGl2ZXMuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiAgICAgICAgICAgICAgICAgLSB7QXJyYXl9IGZpbHRlcnNcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSB0d29XYXlcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSBkZWVwXG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gdXNlclxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gV2F0Y2hlciAodm0sIGV4cHJlc3Npb24sIGNiLCBvcHRpb25zKSB7XG4gIHRoaXMudm0gPSB2bVxuICB2bS5fd2F0Y2hlckxpc3QucHVzaCh0aGlzKVxuICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uXG4gIHRoaXMuY2JzID0gW2NiXVxuICB0aGlzLmlkID0gKyt1aWQgLy8gdWlkIGZvciBiYXRjaGluZ1xuICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdGhpcy5kZWVwID0gISFvcHRpb25zLmRlZXBcbiAgdGhpcy51c2VyID0gISFvcHRpb25zLnVzZXJcbiAgdGhpcy5kZXBzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAvLyBzZXR1cCBmaWx0ZXJzIGlmIGFueS5cbiAgLy8gV2UgZGVsZWdhdGUgZGlyZWN0aXZlIGZpbHRlcnMgaGVyZSB0byB0aGUgd2F0Y2hlclxuICAvLyBiZWNhdXNlIHRoZXkgbmVlZCB0byBiZSBpbmNsdWRlZCBpbiB0aGUgZGVwZW5kZW5jeVxuICAvLyBjb2xsZWN0aW9uIHByb2Nlc3MuXG4gIGlmIChvcHRpb25zLmZpbHRlcnMpIHtcbiAgICB0aGlzLnJlYWRGaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzLnJlYWRcbiAgICB0aGlzLndyaXRlRmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycy53cml0ZVxuICB9XG4gIC8vIHBhcnNlIGV4cHJlc3Npb24gZm9yIGdldHRlci9zZXR0ZXJcbiAgdmFyIHJlcyA9IGV4cFBhcnNlci5wYXJzZShleHByZXNzaW9uLCBvcHRpb25zLnR3b1dheSlcbiAgdGhpcy5nZXR0ZXIgPSByZXMuZ2V0XG4gIHRoaXMuc2V0dGVyID0gcmVzLnNldFxuICB0aGlzLnZhbHVlID0gdGhpcy5nZXQoKVxufVxuXG52YXIgcCA9IFdhdGNoZXIucHJvdG90eXBlXG5cbi8qKlxuICogQWRkIGEgZGVwZW5kZW5jeSB0byB0aGlzIGRpcmVjdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge0RlcH0gZGVwXG4gKi9cblxucC5hZGREZXAgPSBmdW5jdGlvbiAoZGVwKSB7XG4gIHZhciBpZCA9IGRlcC5pZFxuICBpZiAoIXRoaXMubmV3RGVwc1tpZF0pIHtcbiAgICB0aGlzLm5ld0RlcHNbaWRdID0gZGVwXG4gICAgaWYgKCF0aGlzLmRlcHNbaWRdKSB7XG4gICAgICB0aGlzLmRlcHNbaWRdID0gZGVwXG4gICAgICBkZXAuYWRkU3ViKHRoaXMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRXZhbHVhdGUgdGhlIGdldHRlciwgYW5kIHJlLWNvbGxlY3QgZGVwZW5kZW5jaWVzLlxuICovXG5cbnAuZ2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmJlZm9yZUdldCgpXG4gIHZhciB2bSA9IHRoaXMudm1cbiAgdmFyIHZhbHVlXG4gIHRyeSB7XG4gICAgdmFsdWUgPSB0aGlzLmdldHRlci5jYWxsKHZtLCB2bSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChjb25maWcud2FybkV4cHJlc3Npb25FcnJvcnMpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0Vycm9yIHdoZW4gZXZhbHVhdGluZyBleHByZXNzaW9uIFwiJyArXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiArICdcIjpcXG4gICAnICsgZVxuICAgICAgKVxuICAgIH1cbiAgfVxuICAvLyBcInRvdWNoXCIgZXZlcnkgcHJvcGVydHkgc28gdGhleSBhcmUgYWxsIHRyYWNrZWQgYXNcbiAgLy8gZGVwZW5kZW5jaWVzIGZvciBkZWVwIHdhdGNoaW5nXG4gIGlmICh0aGlzLmRlZXApIHtcbiAgICB0cmF2ZXJzZSh2YWx1ZSlcbiAgfVxuICB2YWx1ZSA9IF8uYXBwbHlGaWx0ZXJzKHZhbHVlLCB0aGlzLnJlYWRGaWx0ZXJzLCB2bSlcbiAgdGhpcy5hZnRlckdldCgpXG4gIHJldHVybiB2YWx1ZVxufVxuXG4vKipcbiAqIFNldCB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZSB3aXRoIHRoZSBzZXR0ZXIuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICovXG5cbnAuc2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciB2bSA9IHRoaXMudm1cbiAgdmFsdWUgPSBfLmFwcGx5RmlsdGVycyhcbiAgICB2YWx1ZSwgdGhpcy53cml0ZUZpbHRlcnMsIHZtLCB0aGlzLnZhbHVlXG4gIClcbiAgdHJ5IHtcbiAgICB0aGlzLnNldHRlci5jYWxsKHZtLCB2bSwgdmFsdWUpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoY29uZmlnLndhcm5FeHByZXNzaW9uRXJyb3JzKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdFcnJvciB3aGVuIGV2YWx1YXRpbmcgc2V0dGVyIFwiJyArXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiArICdcIjpcXG4gICAnICsgZVxuICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFByZXBhcmUgZm9yIGRlcGVuZGVuY3kgY29sbGVjdGlvbi5cbiAqL1xuXG5wLmJlZm9yZUdldCA9IGZ1bmN0aW9uICgpIHtcbiAgT2JzZXJ2ZXIudGFyZ2V0ID0gdGhpc1xuICB0aGlzLm5ld0RlcHMgPSB7fVxufVxuXG4vKipcbiAqIENsZWFuIHVwIGZvciBkZXBlbmRlbmN5IGNvbGxlY3Rpb24uXG4gKi9cblxucC5hZnRlckdldCA9IGZ1bmN0aW9uICgpIHtcbiAgT2JzZXJ2ZXIudGFyZ2V0ID0gbnVsbFxuICBmb3IgKHZhciBpZCBpbiB0aGlzLmRlcHMpIHtcbiAgICBpZiAoIXRoaXMubmV3RGVwc1tpZF0pIHtcbiAgICAgIHRoaXMuZGVwc1tpZF0ucmVtb3ZlU3ViKHRoaXMpXG4gICAgfVxuICB9XG4gIHRoaXMuZGVwcyA9IHRoaXMubmV3RGVwc1xufVxuXG4vKipcbiAqIFN1YnNjcmliZXIgaW50ZXJmYWNlLlxuICogV2lsbCBiZSBjYWxsZWQgd2hlbiBhIGRlcGVuZGVuY3kgY2hhbmdlcy5cbiAqL1xuXG5wLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFjb25maWcuYXN5bmMgfHwgY29uZmlnLmRlYnVnKSB7XG4gICAgdGhpcy5ydW4oKVxuICB9IGVsc2Uge1xuICAgIGJhdGNoZXIucHVzaCh0aGlzKVxuICB9XG59XG5cbi8qKlxuICogQmF0Y2hlciBqb2IgaW50ZXJmYWNlLlxuICogV2lsbCBiZSBjYWxsZWQgYnkgdGhlIGJhdGNoZXIuXG4gKi9cblxucC5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0KClcbiAgICBpZiAoXG4gICAgICB2YWx1ZSAhPT0gdGhpcy52YWx1ZSB8fFxuICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHxcbiAgICAgIHRoaXMuZGVlcFxuICAgICkge1xuICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy52YWx1ZVxuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgICB2YXIgY2JzID0gdGhpcy5jYnNcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2JzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjYnNbaV0odmFsdWUsIG9sZFZhbHVlKVxuICAgICAgICAvLyBpZiBhIGNhbGxiYWNrIGFsc28gcmVtb3ZlZCBvdGhlciBjYWxsYmFja3MsXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gYWRqdXN0IHRoZSBsb29wIGFjY29yZGluZ2x5LlxuICAgICAgICB2YXIgcmVtb3ZlZCA9IGwgLSBjYnMubGVuZ3RoXG4gICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgaSAtPSByZW1vdmVkXG4gICAgICAgICAgbCAtPSByZW1vdmVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgYSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbnAuYWRkQ2IgPSBmdW5jdGlvbiAoY2IpIHtcbiAgdGhpcy5jYnMucHVzaChjYilcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbnAucmVtb3ZlQ2IgPSBmdW5jdGlvbiAoY2IpIHtcbiAgdmFyIGNicyA9IHRoaXMuY2JzXG4gIGlmIChjYnMubGVuZ3RoID4gMSkge1xuICAgIHZhciBpID0gY2JzLmluZGV4T2YoY2IpXG4gICAgaWYgKGkgPiAtMSkge1xuICAgICAgY2JzLnNwbGljZShpLCAxKVxuICAgIH1cbiAgfSBlbHNlIGlmIChjYiA9PT0gY2JzWzBdKSB7XG4gICAgdGhpcy50ZWFyZG93bigpXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgc2VsZiBmcm9tIGFsbCBkZXBlbmRlbmNpZXMnIHN1YmNyaWJlciBsaXN0LlxuICovXG5cbnAudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gdm0ncyB3YXRjaGVyIGxpc3RcbiAgICAvLyB3ZSBjYW4gc2tpcCB0aGlzIGlmIHRoZSB2bSBpZiBiZWluZyBkZXN0cm95ZWRcbiAgICAvLyB3aGljaCBjYW4gaW1wcm92ZSB0ZWFyZG93biBwZXJmb3JtYW5jZS5cbiAgICBpZiAoIXRoaXMudm0uX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICAgIHZhciBsaXN0ID0gdGhpcy52bS5fd2F0Y2hlckxpc3RcbiAgICAgIGxpc3Quc3BsaWNlKGxpc3QuaW5kZXhPZih0aGlzKSlcbiAgICB9XG4gICAgZm9yICh2YXIgaWQgaW4gdGhpcy5kZXBzKSB7XG4gICAgICB0aGlzLmRlcHNbaWRdLnJlbW92ZVN1Yih0aGlzKVxuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy52bSA9IHRoaXMuY2JzID0gdGhpcy52YWx1ZSA9IG51bGxcbiAgfVxufVxuXG5cbi8qKlxuICogUmVjcnVzaXZlbHkgdHJhdmVyc2UgYW4gb2JqZWN0IHRvIGV2b2tlIGFsbCBjb252ZXJ0ZWRcbiAqIGdldHRlcnMsIHNvIHRoYXQgZXZlcnkgbmVzdGVkIHByb3BlcnR5IGluc2lkZSB0aGUgb2JqZWN0XG4gKiBpcyBjb2xsZWN0ZWQgYXMgYSBcImRlZXBcIiBkZXBlbmRlbmN5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqL1xuXG5mdW5jdGlvbiB0cmF2ZXJzZSAob2JqKSB7XG4gIHZhciBrZXksIHZhbCwgaVxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICB2YWwgPSBvYmpba2V5XVxuICAgIGlmIChfLmlzQXJyYXkodmFsKSkge1xuICAgICAgaSA9IHZhbC5sZW5ndGhcbiAgICAgIHdoaWxlIChpLS0pIHRyYXZlcnNlKHZhbFtpXSlcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QodmFsKSkge1xuICAgICAgdHJhdmVyc2UodmFsKVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdhdGNoZXIiLCJtb2R1bGUuZXhwb3J0cyA9ICc8dGVtcGxhdGUgdi1pZj1cIm1vZGVsXCI+XFxuXHQ8YSBocmVmPVwiIy97eyBtb2RlbC5wcm9wZXJ0eSB9fS9uZXdcIiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBwdWxsLXJpZ2h0XCI+QWRkIG5ldyB7eyBtb2RlbC5sYWJlbCB8IGxvd2VyY2FzZSB9fTwvYT5cXG5cdDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWhvdmVyXCI+XFxuXHRcdDx0aGVhZD5cXG5cdFx0XHQ8dHI+XFxuXHRcdFx0XHQ8dGggdi1yZXBlYXQ9XCJmaWVsZHNcIj57eyBsYWJlbCB9fTwvdGg+XFxuXHRcdFx0PC90cj5cXG5cdFx0PC90aGVhZD5cXG5cdFx0PHRib2R5IHYtaWY9XCJlbnRyaWVzXCI+XFxuXHRcdFx0PHRyIHYtcmVwZWF0PVwiZW50cnkgOiBlbnRyaWVzXCIgdi1vbj1cImNsaWNrOiBlZGl0KCRldmVudCwgJGtleSlcIiBkYXRhLWlkPVwie3sgJGtleSB9fVwiIGNsYXNzPVwiY2xpY2thYmxlXCI+XFxuXHRcdFx0XHQ8dGQgdi1yZXBlYXQ9XCJmaWVsZHNcIj57eyBlbnRyeVtwcm9wZXJ0eV0gfX08L3RkPlxcblx0XHRcdDwvdHI+XFxuXHRcdDwvdGJvZHk+XFxuXHRcdDx0Ym9keSB2LWlmPVwiIWVudHJpZXNcIj5cXG5cdFx0XHQ8dHI+XFxuXHRcdFx0XHQ8dGQgY29sc3Bhbj1cInt7IG1vZGVsLmZpZWxkcy5sZW5ndGggfX1cIj5cXG5cdFx0XHRcdFx0PGVtIGNsYXNzPVwidGV4dC1tdXRlZFwiPkxvYWRpbmcge3sgbW9kZWwubGFiZWwgfCBsb3dlcmNhc2UgfCBwbHVyYWwgfX0maGVsbGlwOzwvZW0+XFxuXHRcdFx0XHQ8L3RkPlxcblx0XHRcdDwvdHI+XFxuXHRcdDwvdGJvZHk+XFxuXHQ8L3RhYmxlPlxcbjwvdGVtcGxhdGU+XFxuJzsiLCJ2YXIgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpXG5cbnZhciBkYXRhUmVmID0gbmV3IEZpcmViYXNlKCdodHRwczovL2VudHJpZXMuZmlyZWJhc2VJTy5jb20vZGF0YS8nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5oZXJpdDogdHJ1ZSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vZW50cmllcy5odG1sJyksXG5cdG1ldGhvZHM6IHtcblx0XHRhY3RpdmF0ZU1vZGVsOiBmdW5jdGlvbiAobW9kZWwpIHtcblx0XHRcdHRoaXMuZW50cmllcyA9IG51bGxcblx0XHRcdGRhdGFSZWYuY2hpbGQobW9kZWwpLm9uY2UoJ3ZhbHVlJywgZnVuY3Rpb24gKHNuYXBzaG90KSB7XG5cdFx0XHRcdHRoaXMuZW50cmllcyA9IHNuYXBzaG90LnZhbCgpXG5cdFx0XHR9LmJpbmQodGhpcykpXG5cdFx0fSxcblx0XHRlZGl0OiBmdW5jdGlvbiAoZXZlbnQsIGlkKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRpZiAoaWQpIHtcblx0XHRcdFx0bG9jYXRpb24uYXNzaWduKCcjLycgKyB0aGlzLmFjdGl2ZU1vZGVsICsgJy8nICsgaWQpXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRkYXRhOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGVudHJpZXM6IG51bGxcblx0XHR9XG5cdH0sXG5cdGNvbXB1dGVkOiB7XG5cdFx0ZmllbGRzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RlbC5maWVsZHMuZmlsdGVyKGZ1bmN0aW9uIChmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIGZpbHRlci5saXN0ZWRcblx0XHRcdH0pXG5cdFx0fVxuXHR9LFxuXHRjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuYWN0aXZlTW9kZWwpIHtcblx0XHRcdHRoaXMuYWN0aXZhdGVNb2RlbCh0aGlzLmFjdGl2ZU1vZGVsKVxuXHRcdH1cblx0fSxcblx0d2F0Y2g6IHtcblx0XHRhY3RpdmVNb2RlbDogZnVuY3Rpb24gKG1vZGVsKSB7XG5cdFx0XHR0aGlzLmFjdGl2YXRlTW9kZWwobW9kZWwpXG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8dGVtcGxhdGUgdi1pZj1cImlzUmVhZHlcIj5cXG5cdDxmb3JtIHYtb249XCJzdWJtaXQ6IHNhdmUoJGV2ZW50KVwiIGNsYXNzPVwiZm9ybS1ob3Jpem9udGFsXCI+XFxuXHRcdDxmaWVsZHNldD5cXG5cdFx0XHQ8bGVnZW5kIHYtaWY9XCJpc05ld1wiPlxcblx0XHRcdFx0TmV3IHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIH19XFxuXHRcdFx0PC9sZWdlbmQ+XFxuXHRcdFx0PGxlZ2VuZCB2LWlmPVwiIWlzTmV3XCI+XFxuXHRcdFx0XHRFZGl0IHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIH19XFxuXHRcdFx0XHQ8c21hbGwgY2xhc3M9XCJ0ZXh0LW11dGVkIHB1bGwtcmlnaHRcIj57eyBhY3RpdmVFbnRyeSB9fTwvc21hbGw+XFxuXHRcdFx0PC9sZWdlbmQ+XFxuXFxuXHRcdFx0PGRpdiB2LXJlcGVhdD1cIm1vZGVsLmZpZWxkc1wiIHYtY29tcG9uZW50PVwie3sgY29tcG9uZW50Rm9yKHR5cGUpIH19XCI+PC9kaXY+XFxuXHRcdFx0PGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2wtc20tb2Zmc2V0LTIgY29sLXNtLTJcIj5cXG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBidG4tbGdcIiB0eXBlPVwic3VibWl0XCI+U2F2ZTwvYnV0dG9uPlxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdDwvZmllbGRzZXQ+XFxuXHQ8L2Zvcm0+XFxuXHQ8cCBjbGFzcz1cInRleHQtcmlnaHRcIiB2LWlmPVwiIWlzTmV3XCI+XFxuXHRcdDxidXR0b24gdi1vbj1cImNsaWNrOiByZW1vdmUoJGV2ZW50KVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGlua1wiPlxcblx0XHRcdERlbGV0ZSB0aGlzIHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIH19P1xcblx0XHQ8L2J1dHRvbj5cXG5cdDwvcD5cXG48L3RlbXBsYXRlPlxcblxcbjxlbSB2LWlmPVwiIWlzUmVhZHlcIiBjbGFzcz1cInRleHQtbXV0ZWRcIj5Mb2FkaW5nIHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIH19JmhlbGxpcDs8L2VtPlxcbic7IiwidmFyIEZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKVxuXG52YXIgZGF0YVJlZiA9IG5ldyBGaXJlYmFzZSgnaHR0cHM6Ly9lbnRyaWVzLmZpcmViYXNlSU8uY29tL2RhdGEvJylcblxuZnVuY3Rpb24gaXNFbXB0eSAobykge1xuXHRmb3IgKHZhciBwIGluIG8pIHtcblx0XHRpZiAoby5oYXNPd25Qcm9wZXJ0eShwKSkge1xuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cnVlXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbmhlcml0OiB0cnVlLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi9lbnRyeS5odG1sJyksXG5cdGNvbXBvbmVudHM6IHtcblx0XHR0ZXh0RmllbGQ6IHJlcXVpcmUoJy4uL2ZpZWxkcy90ZXh0JyksXG5cdFx0bWFya2Rvd25GaWVsZDogcmVxdWlyZSgnLi4vZmllbGRzL21hcmtkb3duJyksXG5cdFx0ZW50cnlGaWVsZDogcmVxdWlyZSgnLi4vZmllbGRzL2VudHJ5Jylcblx0fSxcblx0bWV0aG9kczoge1xuXHRcdGNvbXBvbmVudEZvcjogZnVuY3Rpb24gKHR5cGUpIHtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICd0ZXh0Jzpcblx0XHRcdFx0XHRyZXR1cm4gJ3RleHRGaWVsZCdcblx0XHRcdFx0Y2FzZSAnbWFya2Rvd24nOlxuXHRcdFx0XHRcdHJldHVybiAnbWFya2Rvd25GaWVsZCdcblx0XHRcdFx0Y2FzZSAnZW50cnknOlxuXHRcdFx0XHRcdHJldHVybiAnZW50cnlGaWVsZCdcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRyZXR1cm4gJ3RleHRGaWVsZCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdGxvYWRFbnRyeTogZnVuY3Rpb24gKGlkKSB7XG5cdFx0XHR0aGlzLmVudHJ5ID0ge31cblx0XHRcdGlmIChpZCA9PT0gJ25ldycpIHJldHVyblxuXG5cdFx0XHRkYXRhUmVmLmNoaWxkKHRoaXMuYWN0aXZlTW9kZWwpLmNoaWxkKGlkKS5vbmNlKCd2YWx1ZScsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuXHRcdFx0XHR0aGlzLmVudHJ5ID0gc25hcHNob3QudmFsKClcblx0XHRcdH0uYmluZCh0aGlzKSlcblx0XHR9LFxuXHRcdHNhdmU6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0XHR2YXIgZG9uZSA9IChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdDb3VsZCBub3Qgc2F2ZTonLCBlcnIpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0bG9jYXRpb24uYXNzaWduKCcjLycgKyB0aGlzLmFjdGl2ZU1vZGVsKVxuXHRcdFx0XHR9XG5cdFx0XHR9KS5iaW5kKHRoaXMpXG5cblx0XHRcdHZhciByZWYgPSBkYXRhUmVmLmNoaWxkKHRoaXMuYWN0aXZlTW9kZWwpXG5cdFx0XHRpZiAodGhpcy5pc05ldykge1xuXHRcdFx0XHRyZWYucHVzaCh0aGlzLmVudHJ5LCBkb25lKVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJlZi5jaGlsZCh0aGlzLmFjdGl2ZUVudHJ5KS51cGRhdGUodGhpcy5lbnRyeSwgZG9uZSlcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlbW92ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRcdC8vIFRPRE86IGFkZCB1bmRvXG5cdFx0XHRpZiAoIXdpbmRvdy5jb25maXJtKCdUaGlzIGNhbm5vdCBiZSB1bmRvbmUuIENvbnRpbnVlPycpKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXG5cdFx0XHRkYXRhUmVmLmNoaWxkKHRoaXMuYWN0aXZlTW9kZWwpLmNoaWxkKHRoaXMuYWN0aXZlRW50cnkpLnJlbW92ZShmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgcmVtb3ZlOicsIGVycilcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRsb2NhdGlvbi5hc3NpZ24oJyMvJyArIHRoaXMuYWN0aXZlTW9kZWwpXG5cdFx0XHRcdH1cblx0XHRcdH0uYmluZCh0aGlzKSlcblx0XHR9XG5cdH0sXG5cdGRhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZW50cnk6IHt9XG5cdFx0fVxuXHR9LFxuXHRjb21wdXRlZDoge1xuXHRcdGlzTmV3OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hY3RpdmVFbnRyeSA9PT0gJ25ldydcblx0XHR9LFxuXHRcdGlzUmVhZHk6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAhaXNFbXB0eSh0aGlzLmVudHJ5KSB8fCB0aGlzLmlzTmV3XG5cdFx0fVxuXHR9LFxuXHRjcmVhdGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuYWN0aXZlRW50cnkpIHtcblx0XHRcdHRoaXMubG9hZEVudHJ5KHRoaXMuYWN0aXZlRW50cnkpXG5cdFx0fVxuXHR9LFxuXHR3YXRjaDoge1xuXHRcdGFjdGl2ZUVudHJ5OiBmdW5jdGlvbiAoaWQpIHtcblx0XHRcdHRoaXMubG9hZEVudHJ5KGlkKVxuXHRcdH1cblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG5cdDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgY29sLXNtLTJcIj57eyBsYWJlbCB9fTwvbGFiZWw+XFxuXHQ8ZGl2IGNsYXNzPVwiY29sLXNtLTZcIj5cXG5cdFx0PHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHYtaWY9XCJpc1JlYWR5XCIgdi1tb2RlbD1cInZhbHVlXCIgb3B0aW9ucz1cIm9wdGlvbnNcIiB2LWF0dHI9XCJyZXF1aXJlZDogcmVxdWlyZWRcIj48L3NlbGVjdD5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwidmFyIEZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKVxuXG52YXIgbW9kZWxzID0gcmVxdWlyZSgnLi4vLi4vLi4vbW9kZWxzJylcbnZhciBkYXRhUmVmID0gbmV3IEZpcmViYXNlKCdodHRwczovL2VudHJpZXMuZmlyZWJhc2VJTy5jb20vZGF0YS8nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5oZXJpdDogdHJ1ZSxcblx0cmVwbGFjZTogdHJ1ZSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vZW50cnkuaHRtbCcpLFxuXHRkYXRhOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG9wdGlvbnM6IG51bGxcblx0XHR9XG5cdH0sXG5cdGNvbXB1dGVkOiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAodGhpcy5lbnRyeSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmVudHJ5W3RoaXMucHJvcGVydHldXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRpZiAodGhpcy5lbnRyeSkge1xuXHRcdFx0XHRcdHRoaXMuZW50cnlbdGhpcy5wcm9wZXJ0eV0gPSB2YWx1ZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpc1JlYWR5OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gKHRoaXMub3B0aW9ucyAhPSBudWxsKVxuXHRcdH1cblx0fSxcblx0Y3JlYXRlZDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBtb2RlbCA9IG1vZGVsc1t0aGlzLm1vZGVsXVxuXHRcdGRhdGFSZWYuY2hpbGQobW9kZWwucHJvcGVydHkpLm9uY2UoJ3ZhbHVlJywgZnVuY3Rpb24gKHNuYXBzaG90KSB7XG5cdFx0XHQvLyBUT0RPOiBmaWd1cmUgb3V0IGJldHRlciBcInVuc2VsZWN0ZWRcIiBvcHRpb25cblx0XHRcdC8vICAgICAgIGlkZWFsbHkgYWxsb3cgdGhlIGRpc2FibGVkIGF0dHJpYnV0ZSBpbiBoZXJlXG5cdFx0XHR2YXIgb3B0aW9ucyA9IFt7IHRleHQ6ICcnLCB2YWx1ZTogbnVsbCB9XVxuXHRcdFx0c25hcHNob3QuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdFx0b3B0aW9ucy5wdXNoKHtcblx0XHRcdFx0XHR2YWx1ZTogY2hpbGQucmVmKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgcHJvcGVydHkgY29uZmlndXJhYmxlXG5cdFx0XHRcdFx0dGV4dDogY2hpbGQudmFsKCkubmFtZVxuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcblx0XHR9LmJpbmQodGhpcykpXG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbmhlcml0OiB0cnVlLFxuXHRyZXBsYWNlOiB0cnVlLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi9tYXJrZG93bi5odG1sJyksXG5cdGNvbXB1dGVkOiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAodGhpcy5lbnRyeSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmVudHJ5W3RoaXMucHJvcGVydHldXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRpZiAodGhpcy5lbnRyeSkge1xuXHRcdFx0XHRcdHRoaXMuZW50cnlbdGhpcy5wcm9wZXJ0eV0gPSB2YWx1ZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcblx0PGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBjb2wtc20tMlwiPnt7IGxhYmVsIH19PC9sYWJlbD5cXG5cdDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPlxcblx0XHQ8dGV4dGFyZWEgcm93cz1cIjEyXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB2LW1vZGVsPVwidmFsdWVcIiB2LWF0dHI9XCJyZXF1aXJlZDogcmVxdWlyZWRcIj48L3RleHRhcmVhPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5oZXJpdDogdHJ1ZSxcblx0cmVwbGFjZTogdHJ1ZSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vdGV4dC5odG1sJyksXG5cdGNvbXB1dGVkOiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAodGhpcy5lbnRyeSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmVudHJ5W3RoaXMucHJvcGVydHldXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRpZiAodGhpcy5lbnRyeSkge1xuXHRcdFx0XHRcdHRoaXMuZW50cnlbdGhpcy5wcm9wZXJ0eV0gPSB2YWx1ZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcblx0PGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBjb2wtc20tMlwiPnt7IGxhYmVsIH19PC9sYWJlbD5cXG5cdDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPlxcblx0XHQ8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB2LW1vZGVsPVwidmFsdWVcIiB2LWF0dHI9XCJ0eXBlOiB0eXBlLCByZXF1aXJlZDogcmVxdWlyZWRcIj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaGVyaXQ6IHRydWUsXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL25hdi5odG1sJylcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJsaXN0LWdyb3VwXCI+XFxuXHQ8YSB2LXJlcGVhdD1cIm1vZGVsc1wiIGhyZWY9XCIjL3t7IHByb3BlcnR5IH19XCIgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0ge3sgYWN0aXZlTW9kZWwgPT09IHByb3BlcnR5ID8gXFwnYWN0aXZlXFwnIDogXFwnXFwnIH19XCI+e3sgbGFiZWwgfCBwbHVyYWwgfX08L2E+XFxuPC9kaXY+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XFxuXHQ8ZGl2IGNsYXNzPVwicm93XCI+XFxuXHRcdDxkaXYgY2xhc3M9XCJjb2wtc20tMlwiPlxcblx0XHRcdDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgcGxhY2Vob2xkZXI9XCJGaW5kIGNvbnRlbnQmaGVsbGlwO1wiPlxcblx0XHRcdDxocj5cXG5cdFx0XHQ8ZGl2IHYtY29tcG9uZW50PVwibmF2XCI+PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0XHQ8ZGl2IGNsYXNzPVwiY29sLXNtLTEwXCI+XFxuXHRcdFx0PGRpdiB2LWNvbXBvbmVudD1cInt7IHZpZXcgfX1cIj48L2Rpdj5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsInZhciBWdWUgPSByZXF1aXJlKCd2dWUnKVxudmFyIGRpcmVjdG9yID0gcmVxdWlyZSgnZGlyZWN0b3InKVxudmFyIHBsdXJhbGl6ZSA9IHJlcXVpcmUoJ3BsdXJhbGl6ZScpXG5cbnZhciBtb2RlbHMgPSByZXF1aXJlKCcuL21vZGVscycpXG5cblxudmFyIGFwcCA9IG5ldyBWdWUoe1xuXHRlbDogZG9jdW1lbnQuYm9keSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vY29udGFpbmVyLmh0bWwnKSxcblx0Y29tcG9uZW50czoge1xuXHRcdG5hdjogcmVxdWlyZSgnLi9jb21wb25lbnRzL25hdicpLFxuXHRcdGVudHJpZXM6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9lbnRyaWVzJyksXG5cdFx0ZW50cnk6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9lbnRyeScpXG5cdH0sXG5cdGZpbHRlcnM6IHtcblx0XHRwbHVyYWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHBsdXJhbGl6ZSh2YWx1ZSlcblx0XHR9XG5cdH0sXG5cdGRhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dmlldzogbnVsbCxcblx0XHRcdG1vZGVsczogbW9kZWxzLFxuXHRcdFx0YWN0aXZlTW9kZWw6IG51bGwsXG5cdFx0XHRtb2RlbDogbnVsbCxcblx0XHRcdGFjdGl2ZUVudHJ5OiBudWxsLFxuXHRcdFx0ZW50cnk6IG51bGxcblx0XHR9XG5cdH1cbn0pXG5cblxudmFyIHJvdXRlciA9IG5ldyBkaXJlY3Rvci5Sb3V0ZXIoKVxuXG5yb3V0ZXIub24oJy8nLCBmdW5jdGlvbiAoKSB7XG5cdGxvY2F0aW9uLnJlcGxhY2UoJyMvJyArIGFwcC5tb2RlbHNbMF0ucHJvcGVydHkpXG59KVxuXG5yb3V0ZXIub24oJy86dHlwZScsIGZ1bmN0aW9uICh0eXBlKSB7XG5cdGFwcC52aWV3ID0gJ2VudHJpZXMnXG5cdGFwcC5tb2RlbCA9IG1vZGVsc1t0eXBlXVxuXHRhcHAuYWN0aXZlTW9kZWwgPSBhcHAubW9kZWwgPyB0eXBlIDogbnVsbFxufSlcblxucm91dGVyLm9uKCcvOnR5cGUvOmlkJywgZnVuY3Rpb24gKHR5cGUsIGlkKSB7XG5cdGFwcC52aWV3ID0gJ2VudHJ5J1xuXHRhcHAubW9kZWwgPSBtb2RlbHNbdHlwZV1cblx0YXBwLmFjdGl2ZU1vZGVsID0gYXBwLm1vZGVsID8gdHlwZSA6IG51bGxcblx0YXBwLmFjdGl2ZUVudHJ5ID0gaWRcbn0pXG5cbnJvdXRlci5jb25maWd1cmUoe1xuXHRub3Rmb3VuZDogZnVuY3Rpb24gKCkge1xuXHRcdGNvbnNvbGUubG9nKCdObyByb3V0ZSBmb3VuZCBmb3IgcGF0aDonLCB0aGlzLnBhdGgpXG5cdH1cbn0pXG5cbnJvdXRlci5pbml0KCcvJylcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRsYWJlbDogJ0F1dGhvcicsXG5cdHByb3BlcnR5OiAnYXV0aG9ycycsXG5cdHR5cGU6ICdjb2xsZWN0aW9uJyxcblx0ZmllbGRzOiBbXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdOYW1lJyxcblx0XHRcdHByb3BlcnR5OiAnbmFtZScsXG5cdFx0XHR0eXBlOiAndGV4dCcsXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdGxpc3RlZDogdHJ1ZVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdUd2l0dGVyJyxcblx0XHRcdHByb3BlcnR5OiAndHdpdHRlcicsXG5cdFx0XHR0eXBlOiAndGV4dCcsXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdGxpc3RlZDogdHJ1ZVxuXHRcdH1cblx0XVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdHBvc3RzOiByZXF1aXJlKCcuL3Bvc3QnKSxcblx0YXV0aG9yczogcmVxdWlyZSgnLi9hdXRob3InKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGxhYmVsOiAnQmxvZyBwb3N0Jyxcblx0cHJvcGVydHk6ICdwb3N0cycsXG5cdHR5cGU6ICdjb2xsZWN0aW9uJyxcblx0ZmllbGRzOiBbXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdBdXRob3InLFxuXHRcdFx0cHJvcGVydHk6ICdhdXRob3InLFxuXHRcdFx0dHlwZTogJ2VudHJ5Jyxcblx0XHRcdG1vZGVsOiAnYXV0aG9ycycsXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdUaXRsZScsXG5cdFx0XHRwcm9wZXJ0eTogJ3RpdGxlJyxcblx0XHRcdHR5cGU6ICd0ZXh0Jyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlLFxuXHRcdFx0bGlzdGVkOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ1N1bW1hcnknLFxuXHRcdFx0cHJvcGVydHk6ICdzdW1tYXJ5Jyxcblx0XHRcdHR5cGU6ICd0ZXh0Jyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlLFxuXHRcdFx0bGlzdGVkOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ1Bvc3QgYm9keScsXG5cdFx0XHRwcm9wZXJ0eTogJ2JvZHknLFxuXHRcdFx0dHlwZTogJ21hcmtkb3duJyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0fVxuXHRdXG59XG4iXX0=
