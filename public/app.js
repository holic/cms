(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],4:[function(require,module,exports){
(function() {
    "use strict";
    function $$route$recognizer$dsl$$Target(path, matcher, delegate) {
      this.path = path;
      this.matcher = matcher;
      this.delegate = delegate;
    }

    $$route$recognizer$dsl$$Target.prototype = {
      to: function(target, callback) {
        var delegate = this.delegate;

        if (delegate && delegate.willAddRoute) {
          target = delegate.willAddRoute(this.matcher.target, target);
        }

        this.matcher.add(this.path, target);

        if (callback) {
          if (callback.length === 0) { throw new Error("You must have an argument in the function passed to `to`"); }
          this.matcher.addChild(this.path, target, callback, this.delegate);
        }
        return this;
      }
    };

    function $$route$recognizer$dsl$$Matcher(target) {
      this.routes = {};
      this.children = {};
      this.target = target;
    }

    $$route$recognizer$dsl$$Matcher.prototype = {
      add: function(path, handler) {
        this.routes[path] = handler;
      },

      addChild: function(path, target, callback, delegate) {
        var matcher = new $$route$recognizer$dsl$$Matcher(target);
        this.children[path] = matcher;

        var match = $$route$recognizer$dsl$$generateMatch(path, matcher, delegate);

        if (delegate && delegate.contextEntered) {
          delegate.contextEntered(target, match);
        }

        callback(match);
      }
    };

    function $$route$recognizer$dsl$$generateMatch(startingPath, matcher, delegate) {
      return function(path, nestedCallback) {
        var fullPath = startingPath + path;

        if (nestedCallback) {
          nestedCallback($$route$recognizer$dsl$$generateMatch(fullPath, matcher, delegate));
        } else {
          return new $$route$recognizer$dsl$$Target(startingPath + path, matcher, delegate);
        }
      };
    }

    function $$route$recognizer$dsl$$addRoute(routeArray, path, handler) {
      var len = 0;
      for (var i=0, l=routeArray.length; i<l; i++) {
        len += routeArray[i].path.length;
      }

      path = path.substr(len);
      var route = { path: path, handler: handler };
      routeArray.push(route);
    }

    function $$route$recognizer$dsl$$eachRoute(baseRoute, matcher, callback, binding) {
      var routes = matcher.routes;

      for (var path in routes) {
        if (routes.hasOwnProperty(path)) {
          var routeArray = baseRoute.slice();
          $$route$recognizer$dsl$$addRoute(routeArray, path, routes[path]);

          if (matcher.children[path]) {
            $$route$recognizer$dsl$$eachRoute(routeArray, matcher.children[path], callback, binding);
          } else {
            callback.call(binding, routeArray);
          }
        }
      }
    }

    var $$route$recognizer$dsl$$default = function(callback, addRouteCallback) {
      var matcher = new $$route$recognizer$dsl$$Matcher();

      callback($$route$recognizer$dsl$$generateMatch("", matcher, this.delegate));

      $$route$recognizer$dsl$$eachRoute([], matcher, function(route) {
        if (addRouteCallback) { addRouteCallback(this, route); }
        else { this.add(route); }
      }, this);
    };

    var $$route$recognizer$$specials = [
      '/', '.', '*', '+', '?', '|',
      '(', ')', '[', ']', '{', '}', '\\'
    ];

    var $$route$recognizer$$escapeRegex = new RegExp('(\\' + $$route$recognizer$$specials.join('|\\') + ')', 'g');

    function $$route$recognizer$$isArray(test) {
      return Object.prototype.toString.call(test) === "[object Array]";
    }

    // A Segment represents a segment in the original route description.
    // Each Segment type provides an `eachChar` and `regex` method.
    //
    // The `eachChar` method invokes the callback with one or more character
    // specifications. A character specification consumes one or more input
    // characters.
    //
    // The `regex` method returns a regex fragment for the segment. If the
    // segment is a dynamic of star segment, the regex fragment also includes
    // a capture.
    //
    // A character specification contains:
    //
    // * `validChars`: a String with a list of all valid characters, or
    // * `invalidChars`: a String with a list of all invalid characters
    // * `repeat`: true if the character specification can repeat

    function $$route$recognizer$$StaticSegment(string) { this.string = string; }
    $$route$recognizer$$StaticSegment.prototype = {
      eachChar: function(callback) {
        var string = this.string, ch;

        for (var i=0, l=string.length; i<l; i++) {
          ch = string.charAt(i);
          callback({ validChars: ch });
        }
      },

      regex: function() {
        return this.string.replace($$route$recognizer$$escapeRegex, '\\$1');
      },

      generate: function() {
        return this.string;
      }
    };

    function $$route$recognizer$$DynamicSegment(name) { this.name = name; }
    $$route$recognizer$$DynamicSegment.prototype = {
      eachChar: function(callback) {
        callback({ invalidChars: "/", repeat: true });
      },

      regex: function() {
        return "([^/]+)";
      },

      generate: function(params) {
        return params[this.name];
      }
    };

    function $$route$recognizer$$StarSegment(name) { this.name = name; }
    $$route$recognizer$$StarSegment.prototype = {
      eachChar: function(callback) {
        callback({ invalidChars: "", repeat: true });
      },

      regex: function() {
        return "(.+)";
      },

      generate: function(params) {
        return params[this.name];
      }
    };

    function $$route$recognizer$$EpsilonSegment() {}
    $$route$recognizer$$EpsilonSegment.prototype = {
      eachChar: function() {},
      regex: function() { return ""; },
      generate: function() { return ""; }
    };

    function $$route$recognizer$$parse(route, names, types) {
      // normalize route as not starting with a "/". Recognition will
      // also normalize.
      if (route.charAt(0) === "/") { route = route.substr(1); }

      var segments = route.split("/"), results = [];

      for (var i=0, l=segments.length; i<l; i++) {
        var segment = segments[i], match;

        if (match = segment.match(/^:([^\/]+)$/)) {
          results.push(new $$route$recognizer$$DynamicSegment(match[1]));
          names.push(match[1]);
          types.dynamics++;
        } else if (match = segment.match(/^\*([^\/]+)$/)) {
          results.push(new $$route$recognizer$$StarSegment(match[1]));
          names.push(match[1]);
          types.stars++;
        } else if(segment === "") {
          results.push(new $$route$recognizer$$EpsilonSegment());
        } else {
          results.push(new $$route$recognizer$$StaticSegment(segment));
          types.statics++;
        }
      }

      return results;
    }

    // A State has a character specification and (`charSpec`) and a list of possible
    // subsequent states (`nextStates`).
    //
    // If a State is an accepting state, it will also have several additional
    // properties:
    //
    // * `regex`: A regular expression that is used to extract parameters from paths
    //   that reached this accepting state.
    // * `handlers`: Information on how to convert the list of captures into calls
    //   to registered handlers with the specified parameters
    // * `types`: How many static, dynamic or star segments in this route. Used to
    //   decide which route to use if multiple registered routes match a path.
    //
    // Currently, State is implemented naively by looping over `nextStates` and
    // comparing a character specification against a character. A more efficient
    // implementation would use a hash of keys pointing at one or more next states.

    function $$route$recognizer$$State(charSpec) {
      this.charSpec = charSpec;
      this.nextStates = [];
    }

    $$route$recognizer$$State.prototype = {
      get: function(charSpec) {
        var nextStates = this.nextStates;

        for (var i=0, l=nextStates.length; i<l; i++) {
          var child = nextStates[i];

          var isEqual = child.charSpec.validChars === charSpec.validChars;
          isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;

          if (isEqual) { return child; }
        }
      },

      put: function(charSpec) {
        var state;

        // If the character specification already exists in a child of the current
        // state, just return that state.
        if (state = this.get(charSpec)) { return state; }

        // Make a new state for the character spec
        state = new $$route$recognizer$$State(charSpec);

        // Insert the new state as a child of the current state
        this.nextStates.push(state);

        // If this character specification repeats, insert the new state as a child
        // of itself. Note that this will not trigger an infinite loop because each
        // transition during recognition consumes a character.
        if (charSpec.repeat) {
          state.nextStates.push(state);
        }

        // Return the new state
        return state;
      },

      // Find a list of child states matching the next character
      match: function(ch) {
        // DEBUG "Processing `" + ch + "`:"
        var nextStates = this.nextStates,
            child, charSpec, chars;

        // DEBUG "  " + debugState(this)
        var returned = [];

        for (var i=0, l=nextStates.length; i<l; i++) {
          child = nextStates[i];

          charSpec = child.charSpec;

          if (typeof (chars = charSpec.validChars) !== 'undefined') {
            if (chars.indexOf(ch) !== -1) { returned.push(child); }
          } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
            if (chars.indexOf(ch) === -1) { returned.push(child); }
          }
        }

        return returned;
      }

      /** IF DEBUG
      , debug: function() {
        var charSpec = this.charSpec,
            debug = "[",
            chars = charSpec.validChars || charSpec.invalidChars;

        if (charSpec.invalidChars) { debug += "^"; }
        debug += chars;
        debug += "]";

        if (charSpec.repeat) { debug += "+"; }

        return debug;
      }
      END IF **/
    };

    /** IF DEBUG
    function debug(log) {
      console.log(log);
    }

    function debugState(state) {
      return state.nextStates.map(function(n) {
        if (n.nextStates.length === 0) { return "( " + n.debug() + " [accepting] )"; }
        return "( " + n.debug() + " <then> " + n.nextStates.map(function(s) { return s.debug() }).join(" or ") + " )";
      }).join(", ")
    }
    END IF **/

    // This is a somewhat naive strategy, but should work in a lot of cases
    // A better strategy would properly resolve /posts/:id/new and /posts/edit/:id.
    //
    // This strategy generally prefers more static and less dynamic matching.
    // Specifically, it
    //
    //  * prefers fewer stars to more, then
    //  * prefers using stars for less of the match to more, then
    //  * prefers fewer dynamic segments to more, then
    //  * prefers more static segments to more
    function $$route$recognizer$$sortSolutions(states) {
      return states.sort(function(a, b) {
        if (a.types.stars !== b.types.stars) { return a.types.stars - b.types.stars; }

        if (a.types.stars) {
          if (a.types.statics !== b.types.statics) { return b.types.statics - a.types.statics; }
          if (a.types.dynamics !== b.types.dynamics) { return b.types.dynamics - a.types.dynamics; }
        }

        if (a.types.dynamics !== b.types.dynamics) { return a.types.dynamics - b.types.dynamics; }
        if (a.types.statics !== b.types.statics) { return b.types.statics - a.types.statics; }

        return 0;
      });
    }

    function $$route$recognizer$$recognizeChar(states, ch) {
      var nextStates = [];

      for (var i=0, l=states.length; i<l; i++) {
        var state = states[i];

        nextStates = nextStates.concat(state.match(ch));
      }

      return nextStates;
    }

    var $$route$recognizer$$oCreate = Object.create || function(proto) {
      function F() {}
      F.prototype = proto;
      return new F();
    };

    function $$route$recognizer$$RecognizeResults(queryParams) {
      this.queryParams = queryParams || {};
    }
    $$route$recognizer$$RecognizeResults.prototype = $$route$recognizer$$oCreate({
      splice: Array.prototype.splice,
      slice:  Array.prototype.slice,
      push:   Array.prototype.push,
      length: 0,
      queryParams: null
    });

    function $$route$recognizer$$findHandler(state, path, queryParams) {
      var handlers = state.handlers, regex = state.regex;
      var captures = path.match(regex), currentCapture = 1;
      var result = new $$route$recognizer$$RecognizeResults(queryParams);

      for (var i=0, l=handlers.length; i<l; i++) {
        var handler = handlers[i], names = handler.names, params = {};

        for (var j=0, m=names.length; j<m; j++) {
          params[names[j]] = captures[currentCapture++];
        }

        result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
      }

      return result;
    }

    function $$route$recognizer$$addSegment(currentState, segment) {
      segment.eachChar(function(ch) {
        var state;

        currentState = currentState.put(ch);
      });

      return currentState;
    }

    function $$route$recognizer$$decodeQueryParamPart(part) {
      // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
      part = part.replace(/\+/gm, '%20');
      return decodeURIComponent(part);
    }

    // The main interface

    var $$route$recognizer$$RouteRecognizer = function() {
      this.rootState = new $$route$recognizer$$State();
      this.names = {};
    };


    $$route$recognizer$$RouteRecognizer.prototype = {
      add: function(routes, options) {
        var currentState = this.rootState, regex = "^",
            types = { statics: 0, dynamics: 0, stars: 0 },
            handlers = [], allSegments = [], name;

        var isEmpty = true;

        for (var i=0, l=routes.length; i<l; i++) {
          var route = routes[i], names = [];

          var segments = $$route$recognizer$$parse(route.path, names, types);

          allSegments = allSegments.concat(segments);

          for (var j=0, m=segments.length; j<m; j++) {
            var segment = segments[j];

            if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }

            isEmpty = false;

            // Add a "/" for the new segment
            currentState = currentState.put({ validChars: "/" });
            regex += "/";

            // Add a representation of the segment to the NFA and regex
            currentState = $$route$recognizer$$addSegment(currentState, segment);
            regex += segment.regex();
          }

          var handler = { handler: route.handler, names: names };
          handlers.push(handler);
        }

        if (isEmpty) {
          currentState = currentState.put({ validChars: "/" });
          regex += "/";
        }

        currentState.handlers = handlers;
        currentState.regex = new RegExp(regex + "$");
        currentState.types = types;

        if (name = options && options.as) {
          this.names[name] = {
            segments: allSegments,
            handlers: handlers
          };
        }
      },

      handlersFor: function(name) {
        var route = this.names[name], result = [];
        if (!route) { throw new Error("There is no route named " + name); }

        for (var i=0, l=route.handlers.length; i<l; i++) {
          result.push(route.handlers[i]);
        }

        return result;
      },

      hasRoute: function(name) {
        return !!this.names[name];
      },

      generate: function(name, params) {
        var route = this.names[name], output = "";
        if (!route) { throw new Error("There is no route named " + name); }

        var segments = route.segments;

        for (var i=0, l=segments.length; i<l; i++) {
          var segment = segments[i];

          if (segment instanceof $$route$recognizer$$EpsilonSegment) { continue; }

          output += "/";
          output += segment.generate(params);
        }

        if (output.charAt(0) !== '/') { output = '/' + output; }

        if (params && params.queryParams) {
          output += this.generateQueryString(params.queryParams, route.handlers);
        }

        return output;
      },

      generateQueryString: function(params, handlers) {
        var pairs = [];
        var keys = [];
        for(var key in params) {
          if (params.hasOwnProperty(key)) {
            keys.push(key);
          }
        }
        keys.sort();
        for (var i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          var value = params[key];
          if (value == null) {
            continue;
          }
          var pair = encodeURIComponent(key);
          if ($$route$recognizer$$isArray(value)) {
            for (var j = 0, l = value.length; j < l; j++) {
              var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
              pairs.push(arrayPair);
            }
          } else {
            pair += "=" + encodeURIComponent(value);
            pairs.push(pair);
          }
        }

        if (pairs.length === 0) { return ''; }

        return "?" + pairs.join("&");
      },

      parseQueryString: function(queryString) {
        var pairs = queryString.split("&"), queryParams = {};
        for(var i=0; i < pairs.length; i++) {
          var pair      = pairs[i].split('='),
              key       = $$route$recognizer$$decodeQueryParamPart(pair[0]),
              keyLength = key.length,
              isArray = false,
              value;
          if (pair.length === 1) {
            value = 'true';
          } else {
            //Handle arrays
            if (keyLength > 2 && key.slice(keyLength -2) === '[]') {
              isArray = true;
              key = key.slice(0, keyLength - 2);
              if(!queryParams[key]) {
                queryParams[key] = [];
              }
            }
            value = pair[1] ? $$route$recognizer$$decodeQueryParamPart(pair[1]) : '';
          }
          if (isArray) {
            queryParams[key].push(value);
          } else {
            queryParams[key] = value;
          }
        }
        return queryParams;
      },

      recognize: function(path) {
        var states = [ this.rootState ],
            pathLen, i, l, queryStart, queryParams = {},
            isSlashDropped = false;

        queryStart = path.indexOf('?');
        if (queryStart !== -1) {
          var queryString = path.substr(queryStart + 1, path.length);
          path = path.substr(0, queryStart);
          queryParams = this.parseQueryString(queryString);
        }

        path = decodeURI(path);

        // DEBUG GROUP path

        if (path.charAt(0) !== "/") { path = "/" + path; }

        pathLen = path.length;
        if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
          path = path.substr(0, pathLen - 1);
          isSlashDropped = true;
        }

        for (i=0, l=path.length; i<l; i++) {
          states = $$route$recognizer$$recognizeChar(states, path.charAt(i));
          if (!states.length) { break; }
        }

        // END DEBUG GROUP

        var solutions = [];
        for (i=0, l=states.length; i<l; i++) {
          if (states[i].handlers) { solutions.push(states[i]); }
        }

        states = $$route$recognizer$$sortSolutions(solutions);

        var state = solutions[0];

        if (state && state.handlers) {
          // if a trailing slash was dropped and a star segment is the last segment
          // specified, put the trailing slash back
          if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
            path = path + "/";
          }
          return $$route$recognizer$$findHandler(state, path, queryParams);
        }
      }
    };

    $$route$recognizer$$RouteRecognizer.prototype.map = $$route$recognizer$dsl$$default;

    $$route$recognizer$$RouteRecognizer.VERSION = '0.1.5';

    var $$route$recognizer$$default = $$route$recognizer$$RouteRecognizer;

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return $$route$recognizer$$default; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = $$route$recognizer$$default;
    } else if (typeof this !== 'undefined') {
      this['RouteRecognizer'] = $$route$recognizer$$default;
    }
}).call(this);

//# sourceMappingURL=route-recognizer.js.map
},{}],5:[function(require,module,exports){
var Recognizer = require('route-recognizer')
var hasPushState = typeof history !== 'undefined' && history.pushState

/**
 * Router constructor
 *
 * @param {Object} [options]
 *                 - {String} root
 *                 - {Boolean} hashbang  (default: true)
 *                 - {Boolean} pushstate (default: false)
 */

function VueRouter (options) {
  this._recognizer = new Recognizer()
  this._started = false
  this._vm = null
  this._currentPath = null
  this._notfoundHandler = null
  this._root = null
  this._hasPushState = hasPushState
  var root = options && options.root
  if (root) {
    // make sure there's the starting slash
    if (root.charAt(0) !== '/') {
      root = '/' + root
    }
    // remove trailing slash
    this._root = root.replace(/\/$/, '')
  }
  this._hashbang = !(options && options.hashbang === false)
  this._pushstate = !!(hasPushState && options && options.pushstate)
}

var p = VueRouter.prototype

//
// Public API
//
//

/**
 * Register a map of top-level paths.
 */

p.map = function (map) {
  for (var route in map) {
    this.on(route, map[route])
  }
}

/**
 * Register a single root-level path
 *
 * @param {String} rootPath
 * @param {Object} config
 *                 - {String} component
 *                 - {Object} [subRoutes]
 *                 - {Boolean} [forceRefresh]
 *                 - {Function} [before]
 *                 - {Function} [after]
 */

p.on = function (rootPath, config) {
  if (rootPath === '*') {
    this.notfound(config)
  } else {
    this._addRoute(rootPath, config, [])
  }
}

/**
 * Set the notfound route config.
 *
 * @param {Object} config
 */

p.notfound = function (config) {
  this._notfoundHandler = [{ handler: config }]
}

/**
 * Set redirects.
 *
 * @param {Object} map
 */

p.redirect = function (map) {
  // TODO
  // use another recognizer to recognize redirects
}

/**
 * Navigate to a given path.
 * The path is assumed to be already decoded, and will
 * be resolved against root (if provided)
 *
 * @param {String} path
 * @param {Object} [options]
 */

p.go = function (path, options) {
  if (this._pushstate) {
    // make it relative to root
    path = this._root
      ? this._root + '/' + path.replace(/^\//, '')
      : path
    if (options && options.replace) {
      history.replaceState({}, '', path)
    } else {
      history.pushState({}, '', path)
    }
    this._match(path)
  } else {
    path = path.replace(/^#!?/, '')
    location.hash = this._hashbang
      ? '!' + path
      : path
  }
}

/**
 * Start the router.
 *
 * @param {Vue} vm
 */

p.start = function (vm) {
  if (this._started) {
    return
  }
  this._started = true
  this._vm = this._vm || vm
  if (!this._vm) {
    throw new Error(
      'vue-router must be started with a root Vue instance.'
    )
  }
  if (this._pushstate) {
    this.initHistoryMode()
  } else {
    this.initHashMode()
  }
}

/**
 * Initialize hash mode.
 */

p.initHashMode = function () {
  var self = this
  this.onRouteChange = function () {
    // format hashbang
    if (
      self._hashbang &&
      location.hash &&
      location.hash.charAt(1) !== '!'
    ) {
      location.hash = '!' + location.hash.slice(1)
      return
    }
    var hash = location.hash.replace(/^#!?/, '')
    var url = hash + location.search
    url = decodeURI(url)
    self._match(url)
  }
  window.addEventListener('hashchange', this.onRouteChange)
  this.onRouteChange()
}

/**
 * Initialize HTML5 history mode.
 */

p.initHistoryMode = function () {
  var self = this
  this.onRouteChange = function () {
    var url = location.pathname + location.search
    url = decodeURI(url)
    self._match(url)
  }
  window.addEventListener('popstate', this.onRouteChange)
  this.onRouteChange()
}

/**
 * Stop listening to route changes.
 */

p.stop = function () {
  var event = this._pushstate
    ? 'popstate'
    : 'hashchange'
  window.removeEventListener(event, this.onRouteChange)
  this._vm.route = null
  this._started = false
}

//
// Private Methods
//

/**
 * Add a route containing a list of segments to the internal
 * route recognizer. Will be called recursively to add all
 * possible sub-routes.
 *
 * @param {String} path
 * @param {Object} config
 * @param {Array} segments
 */
p._addRoute = function (path, config, segments) {
  segments.push({
    path: path,
    handler: config
  })
  this._recognizer.add(segments)
  if (config.subRoutes) {
    for (var subPath in config.subRoutes) {
      // recursively walk all sub routes
      this._addRoute(
        subPath,
        config.subRoutes[subPath],
        // pass a copy in recursion to avoid mutating
        // across branches
        segments.slice()
      )
    }
  }
}

/**
 * Match a URL path and set the route context on vm,
 * triggering view updates.
 *
 * @param {String} path
 */
p._match = function (path) {
  if (path === this._currentPath) {
    return
  }
  this._currentPath = path
  // normalize against root
  if (
    this._pushstate &&
    this._root &&
    path.indexOf(this._root) === 0
  ) {
    path = path.slice(this._root.length)
  }
  var matched = this._recognizer.recognize(path)
  // aggregate params
  var params
  if (matched) {
    params = [].reduce.call(matched, function (prev, cur) {
      if (cur.params) {
        for (var key in cur.params) {
          prev[key] = cur.params[key]
        }
      }
      return prev
    }, {})
  }
  // construct route context
  var context = {
    path: path,
    params: params,
    query: matched && matched.queryParams,
    _matched: matched || this._notfoundHandler,
    _matchedCount: 0,
    _router: this
  }
  this._vm.$set('route', context)
}

/**
 * Installation interface.
 * Install the necessary directives.
 */

VueRouter.install = function (Vue) {
  require('./view')(Vue)
  require('./link')(Vue)
}

module.exports = VueRouter
},{"./link":6,"./view":7,"route-recognizer":4}],6:[function(require,module,exports){
// install v-link, which provides navigation support for
// HTML5 history mode

module.exports = function (Vue) {

  Vue.directive('link', {

    bind: function () {
      var vm = this.vm
      var href = this.expression
      if (this.el.tagName === 'A') {
        this.el.href = href
      }
      this.handler = function (e) {
        e.preventDefault()
        vm.route._router.go(href)
      }
      this.el.addEventListener('click', this.handler)
    },

    unbind: function () {
      this.el.removeEventListener('click', this.handler)
    }

  })

}
},{}],7:[function(require,module,exports){
// install the v-view directive

module.exports = function (Vue) {

  // insert global css to make sure router-view has
  // display:block so that transitions work properly
  require('insert-css')('router-view{display:block;}')

  var _ = Vue.util
  var component = Vue.directive('_component')
  var templateParser = Vue.parsers.template

  // v-view extends v-component
  var viewDef = _.extend({}, component)

  // with some overrides
  _.extend(viewDef, {

    bind: function () {
      // react to route change
      this.currentRoute = null
      this.currentComponentId = null
      this.onRouteChange = _.bind(this.onRouteChange, this)
      this.unwatch = this.vm.$watch('route', this.onRouteChange)
      // force dynamic directive so v-component doesn't
      // attempt to build right now
      this._isDynamicLiteral = true
      // finally, init by delegating to v-component
      component.bind.call(this)
      if (this.vm.route) {
        this.onRouteChange(this.vm.route)
      }
    },

    onRouteChange: function (route) {
      var previousRoute = this.currentRoute
      this.currentRoute = route

      if (!route._matched) {
        // route not found, this outlet is invalidated
        return this.invalidate()
      }

      var segment = route._matched[route._matchedCount]
      if (!segment) {
        // no segment that matches this outlet
        return this.invalidate()
      }

      // mutate the route as we pass it further down the
      // chain. this series of mutation is done exactly once
      // for every route as we match the components to render.
      route._matchedCount++
      // trigger component switch
      var handler = segment.handler
      if (handler.component !== this.currentComponentId ||
          handler.alwaysRefresh) {
        // call before hook
        if (handler.before) {
          var beforeResult = handler.before(route, previousRoute)
          if (beforeResult === false) {
            if (route._router._hasPushState) {
              history.back()
            } else if (previousRoute) {
              route._router.go(previousRoute.path)
            }
            return
          }
        }
        this.currentComponentId = handler.component
        // actually switch component
        this.realUpdate(handler.component, function () {
          // call after hook
          if (handler.after) {
            handler.after(route, previousRoute)
          }
        })
      } else if (this.childVM) {
        // update route context
        this.childVM.route = route
      }
    },

    invalidate: function () {
      this.currentComponentId = null
      this.realUpdate(null)
    },

    // currently duplicating some logic from v-component
    // TODO: make it cleaner
    build: function () {
      var route = this.currentRoute
      if (this.keepAlive) {
        var cached = this.cache[this.ctorId]
        if (cached) {
          cached.route = route
          return cached
        }
      }
      var vm = this.vm
      var el = templateParser.clone(this.el)
      if (this.Ctor) {
        var child = vm.$addChild({
          el: el,
          template: this.template,
          _asComponent: true,
          _host: this._host,
          data: {
            route: route
          }
        }, this.Ctor)
        if (this.keepAlive) {
          this.cache[this.ctorId] = child
        }
        return child
      }
    },

    unbind: function () {
      this.unwatch()
      component.unbind.call(this)
    }

  })

  Vue.elementDirective('router-view', viewDef)
}
},{"insert-css":3}],8:[function(require,module,exports){
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
  return child
}
},{"../util":65}],9:[function(require,module,exports){
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
    return res.get.call(this, this)
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
},{"../parsers/directive":53,"../parsers/expression":54,"../parsers/path":55,"../parsers/text":57,"../util":65,"../watcher":70}],10:[function(require,module,exports){
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
},{"../transition":59,"../util":65}],11:[function(require,module,exports){
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
},{"../util":65}],12:[function(require,module,exports){
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
  'elementDirective',
  'filter',
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
},{"../compiler/compile":16,"../compiler/transclude":17,"../config":18,"../parsers/directive":53,"../parsers/expression":54,"../parsers/path":55,"../parsers/template":56,"../parsers/text":57,"../util":65,"../util/merge-option":67}],13:[function(require,module,exports){
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
},{"../compiler/compile":16,"../util":65}],14:[function(require,module,exports){
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
},{"./util":65}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
var _ = require('../util')
var config = require('../config')
var textParser = require('../parsers/text')
var dirParser = require('../parsers/directive')
var templateParser = require('../parsers/template')

// internal directives
var propDef = require('../directives/prop')
var componentDef = require('../directives/component')

// terminal directives
var terminalDirectives = [
  'repeat',
  'if'
]

module.exports = compile

/**
 * Compile a template and return a reusable composite link
 * function, which recursively contains more link functions
 * inside. This top level compile function should only be
 * called on instance root nodes.
 *
 * @param {Element|DocumentFragment} el
 * @param {Object} options
 * @param {Boolean} partial
 * @param {Boolean} transcluded
 * @return {Function}
 */

function compile (el, options, partial, transcluded) {
  // link function for the node itself.
  var nodeLinkFn = options._asComponent && !partial
    ? compileRoot(el, options)
    : compileNode(el, options)
  // link function for the childNodes
  var childLinkFn =
    !(nodeLinkFn && nodeLinkFn.terminal) &&
    el.tagName !== 'SCRIPT' &&
    el.hasChildNodes()
      ? compileNodeList(el.childNodes, options)
      : null

  /**
   * A composite linker function to be called on a already
   * compiled piece of DOM, which instantiates all directive
   * instances.
   *
   * @param {Vue} vm
   * @param {Element|DocumentFragment} el
   * @return {Function|undefined}
   */

  function compositeLinkFn (vm, el) {
    // save original directive count before linking
    // so we can capture the directives created during a
    // partial compilation.
    var originalDirCount = vm._directives.length
    var parentOriginalDirCount =
      vm.$parent && vm.$parent._directives.length
    // cache childNodes before linking parent, fix #657
    var childNodes = _.toArray(el.childNodes)
    // if this is a transcluded compile, linkers need to be
    // called in source scope, and the host needs to be
    // passed down.
    var source = transcluded ? vm.$parent : vm
    var host = transcluded ? vm : undefined
    // link
    if (nodeLinkFn) nodeLinkFn(source, el, host)
    if (childLinkFn) childLinkFn(source, childNodes, host)

    var selfDirs = vm._directives.slice(originalDirCount)
    var parentDirs = vm.$parent &&
      vm.$parent._directives.slice(parentOriginalDirCount)

    /**
     * The linker function returns an unlink function that
     * tearsdown all directives instances generated during
     * the process.
     *
     * @param {Boolean} destroying
     */
    return function unlink (destroying) {
      teardownDirs(vm, selfDirs, destroying)
      if (parentDirs) {
        teardownDirs(vm.$parent, parentDirs)
      }
    }
  }

  // transcluded linkFns are terminal, because it takes
  // over the entire sub-tree.
  if (transcluded) {
    compositeLinkFn.terminal = true
  }

  return compositeLinkFn
}

/**
 * Teardown a subset of directives on a vm.
 *
 * @param {Vue} vm
 * @param {Array} dirs
 * @param {Boolean} destroying
 */

function teardownDirs (vm, dirs, destroying) {
  var i = dirs.length
  while (i--) {
    dirs[i]._teardown()
    if (!destroying) {
      vm._directives.$remove(dirs[i])
    }
  }
}

/**
 * Compile the root element of a component. There are
 * 3 types of things to process here:
 * 
 * 1. props on parent container (child scope)
 * 2. other attrs on parent container (parent scope)
 * 3. attrs on the component template root node, if
 *    replace:true (child scope)
 *
 * Also, if this is a block instance, we only need to
 * compile 1 & 2 here.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function}
 */

function compileRoot (el, options) {
  var isBlock = el.nodeType === 11 // DocumentFragment
  var containerAttrs = options._containerAttrs
  var replacerAttrs = options._replacerAttrs
  var props = options.props
  var propsLinkFn, parentLinkFn, replacerLinkFn
  // 1. props
  propsLinkFn = props
    ? compileProps(el, containerAttrs, props)
    : null
  if (!isBlock) {
    // 2. container attributes
    if (containerAttrs) {
      parentLinkFn = compileDirectives(containerAttrs, options)
    }
    if (replacerAttrs) {
      // 3. replacer attributes
      replacerLinkFn = compileDirectives(replacerAttrs, options)
    }
  }
  return function rootLinkFn (vm, el, host) {
    // explicitly passing null to props
    // linkers because they don't need a real element
    if (propsLinkFn) propsLinkFn(vm, null)
    if (parentLinkFn) parentLinkFn(vm.$parent, el, host)
    if (replacerLinkFn) replacerLinkFn(vm, el, host)
  }
}

/**
 * Compile a node and return a nodeLinkFn based on the
 * node type.
 *
 * @param {Node} node
 * @param {Object} options
 * @return {Function|null}
 */

function compileNode (node, options) {
  var type = node.nodeType
  if (type === 1 && node.tagName !== 'SCRIPT') {
    return compileElement(node, options)
  } else if (type === 3 && config.interpolate && node.data.trim()) {
    return compileTextNode(node, options)
  } else {
    return null
  }
}

/**
 * Compile an element and return a nodeLinkFn.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|null}
 */

function compileElement (el, options) {
  if (checkTransclusion(el)) {
    // unwrap textNode
    if (el.hasAttribute('__vue__wrap')) {
      el = el.firstChild
    }
    return compile(el, options._parent.$options, true, true)
  }
  var linkFn
  var hasAttrs = el.hasAttributes()
  // check element directives
  linkFn = checkElementDirectives(el, options)
  // check terminal direcitves (repeat & if)
  if (!linkFn && hasAttrs) {
    linkFn = checkTerminalDirectives(el, options)
  }
  // check component
  if (!linkFn) {
    linkFn = checkComponent(el, options)
  }
  // normal directives
  if (!linkFn && hasAttrs) {
    linkFn = compileDirectives(el, options)
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
 * Compile a textNode and return a nodeLinkFn.
 *
 * @param {TextNode} node
 * @param {Object} options
 * @return {Function|null} textNodeLinkFn
 */

function compileTextNode (node, options) {
  var tokens = textParser.parse(node.data)
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
            node.data = value
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
  return function childLinkFn (vm, nodes, host) {
    var node, nodeLinkFn, childrenLinkFn
    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
      node = nodes[n]
      nodeLinkFn = linkFns[i++]
      childrenLinkFn = linkFns[i++]
      // cache childNodes before linking parent, fix #657
      var childNodes = _.toArray(node.childNodes)
      if (nodeLinkFn) {
        nodeLinkFn(vm, node, host)
      }
      if (childrenLinkFn) {
        childrenLinkFn(vm, childNodes, host)
      }
    }
  }
}

/**
 * Compile param attributes on a root element and return
 * a props link function.
 *
 * @param {Element|DocumentFragment} el
 * @param {Object} attrs
 * @param {Array} propNames
 * @return {Function} propsLinkFn
 */

// regex to test if a path is "settable"
// if not the prop binding is automatically one-way.
var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]\])*$/

function compileProps (el, attrs, propNames) {
  var props = []
  var i = propNames.length
  var name, value, prop
  while (i--) {
    name = propNames[i]
    if (/[A-Z]/.test(name)) {
      _.warn(
        'You seem to be using camelCase for a component prop, ' +
        'but HTML doesn\'t differentiate between upper and ' +
        'lower case. You should use hyphen-delimited ' +
        'attribute names. For more info see ' +
        'http://vuejs.org/api/options.html#props'
      )
    }
    value = attrs[name]
    /* jshint eqeqeq:false */
    if (value != null) {
      prop = {
        name: name,
        value: value
      }
      var tokens = textParser.parse(value)
      if (tokens) {
        if (el && el.nodeType === 1) {
          el.removeAttribute(name)
        }
        attrs[name] = null
        prop.dynamic = true
        prop.value = textParser.tokensToExp(tokens)
        prop.oneTime =
          tokens.length > 1 ||
          tokens[0].oneTime ||
          !settablePathRE.test(prop.value)
      }
      props.push(prop)
    }
  }
  return makePropsLinkFn(props)
}

/**
 * Build a function that applies props to a vm.
 *
 * @param {Array} props
 * @return {Function} propsLinkFn
 */

var dataAttrRE = /^data-/

function makePropsLinkFn (props) {
  return function propsLinkFn (vm, el) {
    var i = props.length
    var prop, path
    while (i--) {
      prop = props[i]
      // props could contain dashes, which will be
      // interpreted as minus calculations by the parser
      // so we need to wrap the path here
      path = _.camelize(prop.name.replace(dataAttrRE, ''))
      if (prop.dynamic) {
        vm._bindDir('prop', el, {
          arg: path,
          expression: prop.value,
          oneWay: prop.oneTime
        }, propDef)
      } else {
        // just set once
        vm.$set(path, prop.value)
      }
    }
  }
}

/**
 * Check for element directives (custom elements that should
 * be resovled as terminal directives).
 *
 * @param {Element} el
 * @param {Object} options
 */

function checkElementDirectives (el, options) {
  var tag = el.tagName.toLowerCase()
  var def = options.elementDirectives[tag]
  if (def) {
    return makeTerminalNodeLinkFn(el, tag, '', options, def)
  }
}

/**
 * Check if an element is a component. If yes, return
 * a component link function.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|undefined}
 */

function checkComponent (el, options) {
  var componentId = _.checkComponent(el, options)
  if (componentId) {
    var componentLinkFn = function (vm, el, host) {
      vm._bindDir('component', el, {
        expression: componentId
      }, componentDef, host)
    }
    componentLinkFn.terminal = true
    return componentLinkFn
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

function checkTerminalDirectives (el, options) {
  if (_.attr(el, 'pre') !== null) {
    return skip
  }
  var value, dirName
  /* jshint boss: true */
  for (var i = 0, l = terminalDirectives.length; i < l; i++) {
    dirName = terminalDirectives[i]
    if ((value = _.attr(el, dirName)) !== null) {
      return makeTerminalNodeLinkFn(el, dirName, value, options)
    }
  }
}

function skip () {}
skip.terminal = true

/**
 * Build a node link function for a terminal directive.
 * A terminal link function terminates the current
 * compilation recursion and handles compilation of the
 * subtree in the directive.
 *
 * @param {Element} el
 * @param {String} dirName
 * @param {String} value
 * @param {Object} options
 * @param {Object} [def]
 * @return {Function} terminalLinkFn
 */

function makeTerminalNodeLinkFn (el, dirName, value, options, def) {
  var descriptor = dirParser.parse(value)[0]
  def = def || options.directives[dirName]
  var fn = function terminalNodeLinkFn (vm, el, host) {
    vm._bindDir(dirName, el, descriptor, def, host)
  }
  fn.terminal = true
  return fn
}

/**
 * Compile the directives on an element and return a linker.
 *
 * @param {Element|Object} elOrAttrs
 *        - could be an object of already-extracted
 *          container attributes.
 * @param {Object} options
 * @return {Function}
 */

function compileDirectives (elOrAttrs, options) {
  var attrs = _.isPlainObject(elOrAttrs)
    ? mapToList(elOrAttrs)
    : elOrAttrs.attributes
  var i = attrs.length
  var dirs = []
  var attr, name, value, dir, dirName, dirDef
  while (i--) {
    attr = attrs[i]
    name = attr.name
    value = attr.value
    if (value === null) continue
    if (name.indexOf(config.prefix) === 0) {
      dirName = name.slice(config.prefix.length)
      dirDef = options.directives[dirName]
      _.assertAsset(dirDef, 'directive', dirName)
      if (dirDef) {
        dirs.push({
          name: dirName,
          descriptors: dirParser.parse(value),
          def: dirDef
        })
      }
    } else if (config.interpolate) {
      dir = collectAttrDirective(name, value, options)
      if (dir) {
        dirs.push(dir)
      }
    }
  }
  // sort by priority, LOW to HIGH
  if (dirs.length) {
    dirs.sort(directiveComparator)
    return makeNodeLinkFn(dirs)
  }
}

/**
 * Convert a map (Object) of attributes to an Array.
 *
 * @param {Object} map
 * @return {Array}
 */

function mapToList (map) {
  var list = []
  for (var key in map) {
    list.push({
      name: key,
      value: map[key]
    })
  }
  return list
}

/**
 * Build a link function for all directives on a single node.
 *
 * @param {Array} directives
 * @return {Function} directivesLinkFn
 */

function makeNodeLinkFn (directives) {
  return function nodeLinkFn (vm, el, host) {
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
            dir.descriptors[j], dir.def, host)
        }
      }
    }
  }
}

/**
 * Check an attribute for potential dynamic bindings,
 * and return a directive object.
 *
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 * @return {Object}
 */

function collectAttrDirective (name, value, options) {
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

/**
 * Check whether an element is transcluded
 *
 * @param {Element} el
 * @return {Boolean}
 */

var transcludedFlagAttr = '__vue__transcluded'
function checkTransclusion (el) {
  if (el.nodeType === 1 && el.hasAttribute(transcludedFlagAttr)) {
    el.removeAttribute(transcludedFlagAttr)
    return true
  }
}
},{"../config":18,"../directives/component":23,"../directives/prop":35,"../parsers/directive":53,"../parsers/template":56,"../parsers/text":57,"../util":65}],17:[function(require,module,exports){
var _ = require('../util')
var config = require('../config')
var templateParser = require('../parsers/template')
var transcludedFlagAttr = '__vue__transcluded'

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
  if (options && options._asComponent) {
    // extract container attributes to pass them down
    // to compiler, because they need to be compiled in
    // parent scope. we are mutating the options object here
    // assuming the same object will be used for compile
    // right after this.
    options._containerAttrs = extractAttrs(el)
    // Mark content nodes and attrs so that the compiler
    // knows they should be compiled in parent scope.
    var i = el.childNodes.length
    while (i--) {
      var node = el.childNodes[i]
      if (node.nodeType === 1) {
        node.setAttribute(transcludedFlagAttr, '')
      } else if (node.nodeType === 3 && node.data.trim()) {
        // wrap transcluded textNodes in spans, because
        // raw textNodes can't be persisted through clones
        // by attaching attributes.
        var wrapper = document.createElement('span')
        wrapper.textContent = node.data
        wrapper.setAttribute('__vue__wrap', '')
        wrapper.setAttribute(transcludedFlagAttr, '')
        el.replaceChild(wrapper, node)
      }
    }
  }
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
    var replacer = frag.firstChild
    if (options.replace) {
      if (
        frag.childNodes.length > 1 ||
        replacer.nodeType !== 1 ||
        // when root node has v-repeat, the instance ends up
        // having multiple top-level nodes, thus becoming a
        // block instance. (#835)
        replacer.hasAttribute(config.prefix + 'repeat')
      ) {
        transcludeContent(frag, rawContent)
        return frag
      } else {
        options._replacerAttrs = extractAttrs(replacer)
        mergeAttrs(el, replacer)
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

/**
 * Helper to extract a component container's attribute names
 * into a map. The resulting map will be used in compiler to
 * determine whether an attribute is transcluded.
 *
 * @param {Element} el
 */

function extractAttrs (el) {
  var attrs = el.attributes
  var res = {}
  var i = attrs.length
  while (i--) {
    res[attrs[i].name] = attrs[i].value
  }
  return res
}

/**
 * Merge the attributes of two elements, and make sure
 * the class names are merged properly.
 *
 * @param {Element} from
 * @param {Element} to
 */

function mergeAttrs (from, to) {
  var attrs = from.attributes
  var i = attrs.length
  var name, value
  while (i--) {
    name = attrs[i].name
    value = attrs[i].value
    if (!to.hasAttribute(name)) {
      to.setAttribute(name, value)
    } else if (name === 'class') {
      to.className = to.className + ' ' + value
    }
  }
}
},{"../config":18,"../parsers/template":56,"../util":65}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
 * @param {Vue|undefined} host - transclusion host target
 * @constructor
 */

function Directive (name, el, vm, descriptor, def, host) {
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
  this._descriptor = descriptor
  this._host = host
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
  if (this.name !== 'cloak' && this.el && this.el.removeAttribute) {
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
    !expParser.isSimplePath(expression)
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
 * @public
 */

p.set = function (value) {
  if (this.twoWay) {
    this._withLock(function () {
      this._watcher.set(value)
    })
  }
}

/**
 * Execute a function while preventing that function from
 * triggering updates on this directive instance.
 *
 * @param {Function} fn
 */

p._withLock = function (fn) {
  var self = this
  self._locked = true
  fn.call(self)
  _.nextTick(function () {
    self._locked = false
  })
}

module.exports = Directive
},{"./config":18,"./parsers/expression":54,"./parsers/text":57,"./util":65,"./watcher":70}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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
},{"../util":65}],22:[function(require,module,exports){
var config = require('../config')

module.exports = {

  bind: function () {
    var el = this.el
    this.vm.$once('hook:compiled', function () {
      el.removeAttribute(config.prefix + 'cloak')
    })
  }

}
},{"../config":18}],23:[function(require,module,exports){
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
      // component resolution related state
      this._pendingCb =
      this.ctorId =
      this.Ctor = null
      // if static, build right now.
      if (!this._isDynamicLiteral) {
        this.resolveCtor(this.expression, _.bind(function () {
          var child = this.build()
          child.$before(this.ref)
          this.setCurrent(child)
        }, this))
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
   * Public update, called by the watcher in the dynamic
   * literal scenario, e.g. v-component="{{view}}"
   */

  update: function (value) {
    this.realUpdate(value)
  },

  /**
   * Switch dynamic components. May resolve the component
   * asynchronously, and perform transition based on
   * specified transition mode. Accepts an async callback
   * which is called when the transition ends. (This is
   * exposed for vue-router)
   *
   * @param {String} value
   * @param {Function} [cb]
   */

  realUpdate: function (value, cb) {
    this.invalidatePending()
    if (!value) {
      // just remove current
      this.unbuild()
      this.remove(this.childVM, cb)
      this.unsetCurrent()
    } else {
      this.resolveCtor(value, _.bind(function () {
        this.unbuild()
        var newComponent = this.build()
        var self = this
        if (this.readyEvent) {
          newComponent.$once(this.readyEvent, function () {
            self.swapTo(newComponent, cb)
          })
        } else {
          this.swapTo(newComponent, cb)
        }
      }, this))
    }
  },

  /**
   * Resolve the component constructor to use when creating
   * the child vm.
   */

  resolveCtor: function (id, cb) {
    var self = this
    var pendingCb = this._pendingCb = function (ctor) {
      if (!pendingCb.invalidated) {
        self.ctorId = id
        self.Ctor = ctor
        cb()
      }
    }
    this.vm._resolveComponent(id, pendingCb)
  },

  /**
   * When the component changes or unbinds before an async
   * constructor is resolved, we need to invalidate its
   * pending callback.
   */

  invalidatePending: function () {
    if (this._pendingCb) {
      this._pendingCb.invalidated = true
      this._pendingCb = null
    }
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
        _asComponent: true,
        _host: this._host
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
   * Actually swap the components, depending on the
   * transition mode. Defaults to simultaneous.
   *
   * @param {Vue} target
   * @param {Function} [cb]
   */

  swapTo: function (target, cb) {
    var self = this
    var current = this.childVM
    this.unsetCurrent()
    this.setCurrent(target)
    switch (self.transMode) {
      case 'in-out':
        target.$before(self.ref, function () {
          self.remove(current, cb)
        })
        break
      case 'out-in':
        self.remove(current, function () {
          target.$before(self.ref, cb)
        })
        break
      default:
        self.remove(current)
        target.$before(self.ref, cb)
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
    this.invalidatePending()
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
},{"../parsers/template":56,"../util":65}],24:[function(require,module,exports){
module.exports = {

  isLiteral: true,

  bind: function () {
    this.vm.$$[this.expression] = this.el
  },

  unbind: function () {
    delete this.vm.$$[this.expression]
  }
  
}
},{}],25:[function(require,module,exports){
var _ = require('../util')

module.exports = {

  acceptStatement: true,

  bind: function () {
    var child = this.el.__vue__
    if (!child || this.vm !== child.$parent) {
      _.warn(
        '`v-events` should only be used on a child component ' +
        'from the parent template.'
      )
      return
    }
  },

  update: function (handler, oldHandler) {
    if (typeof handler !== 'function') {
      _.warn(
        'Directive "v-events:' + this.expression + '" ' +
        'expects a function value.'
      )
      return
    }
    var child = this.el.__vue__
    if (oldHandler) {
      child.$off(this.arg, oldHandler)
    }
    child.$on(this.arg, handler)
  }

  // when child is destroyed, all events are turned off,
  // so no need for unbind here.

}
},{"../util":65}],26:[function(require,module,exports){
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
},{"../parsers/template":56,"../util":65}],27:[function(require,module,exports){
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
      if (el.tagName === 'TEMPLATE') {
        this.template = templateParser.parse(el, true)
      } else {
        this.template = document.createDocumentFragment()
        this.template.appendChild(templateParser.clone(el))
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

  update: function (value) {
    if (this.invalid) return
    if (value) {
      // avoid duplicate compiles, since update() can be
      // called with different truthy values
      if (!this.unlink) {
        this.compile()
      }
    } else {
      this.teardown()
    }
  },

  compile: function () {
    var vm = this.vm
    var frag = templateParser.clone(this.template)
    // the linker is not guaranteed to be present because
    // this function might get called by v-partial 
    this.unlink = this.linker(vm, frag)
    transition.blockAppend(frag, this.end, vm)
    // call attached for all the child components created
    // during the compilation
    if (_.inDoc(vm.$el)) {
      var children = this.getContainedComponents()
      if (children) children.forEach(callAttach)
    }
  },

  teardown: function () {
    if (!this.unlink) return
    // collect children beforehand
    var children
    if (_.inDoc(this.vm.$el)) {
      children = this.getContainedComponents()
    }
    transition.blockRemove(this.start, this.end, this.vm)
    if (children) children.forEach(callDetach)
    this.unlink()
    this.unlink = null
  },

  getContainedComponents: function () {
    var vm = this.vm
    var start = this.start.nextSibling
    var end = this.end
    var selfCompoents =
      vm._children.length &&
      vm._children.filter(contains)
    var transComponents =
      vm._transCpnts &&
      vm._transCpnts.filter(contains)

    function contains (c) {
      var cur = start
      var next
      while (next !== end) {
        next = cur.nextSibling
        if (cur.contains(c.$el)) {
          return true
        }
        cur = next
      }
      return false
    }

    return selfCompoents
      ? transComponents
        ? selfCompoents.concat(transComponents)
        : selfCompoents
      : transComponents
  },

  unbind: function () {
    if (this.unlink) this.unlink()
  }

}

function callAttach (child) {
  if (!child._isAttached) {
    child._callHook('attached')
  }
}

function callDetach (child) {
  if (child._isAttached) {
    child._callHook('detached')
  }
}
},{"../compiler/compile":16,"../parsers/template":56,"../transition":59,"../util":65}],28:[function(require,module,exports){
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
exports.transition = require('./transition')

// event listener directives
exports.on         = require('./on')
exports.model      = require('./model')

// logic control directives
exports.repeat     = require('./repeat')
exports['if']      = require('./if')

// child vm communication directives
exports.events     = require('./events')

// internal directives that should not be used directly
// but we still want to expose them for advanced usage.
exports._component = require('./component')
exports._prop      = require('./prop')
},{"./attr":20,"./class":21,"./cloak":22,"./component":23,"./el":24,"./events":25,"./html":26,"./if":27,"./model":31,"./on":34,"./prop":35,"./ref":36,"./repeat":37,"./show":38,"./style":39,"./text":40,"./transition":41}],29:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    this.listener = function () {
      self.set(el.checked)
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
},{"../../util":65}],30:[function(require,module,exports){
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
      var val = number
        ? _.toNumber(el.value)
        : el.value
      self.set(val)
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
},{"../../util":65}],31:[function(require,module,exports){
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
      _.warn('v-model does not support element type: ' + tag)
      return
    }
    handler.bind.call(this)
    this.update = handler.update
    this.unbind = handler.unbind
  }

}
},{"../../util":65,"./checkbox":29,"./default":30,"./radio":32,"./select":33}],32:[function(require,module,exports){
var _ = require('../../util')

module.exports = {

  bind: function () {
    var self = this
    var el = this.el
    this.listener = function () {
      self.set(el.value)
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
},{"../../util":65}],33:[function(require,module,exports){
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
      self.set(value)
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
},{"../../parsers/directive":53,"../../util":65,"../../watcher":70}],34:[function(require,module,exports){
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
},{"../util":65}],35:[function(require,module,exports){
var _ = require('../util')
var Watcher = require('../watcher')

module.exports = {

  bind: function () {

    var child = this.vm
    var parent = child.$parent
    var childKey = this.arg
    var parentKey = this.expression

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

    // only setup two-way binding if this is not a one-way
    // binding.
    if (!this._descriptor.oneWay) {
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
    }
    if (this.childWatcher) {
      this.childWatcher.teardown()
    }
  }

}
},{"../util":65,"../watcher":70}],36:[function(require,module,exports){
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
},{"../util":65}],37:[function(require,module,exports){
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

// async component resolution states
var UNRESOLVED = 0
var PENDING = 1
var RESOLVED = 2
var ABORTED = 3

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
    this.componentState = UNRESOLVED
    var options = this.vm.$options
    var id = _.checkComponent(this.el, options)
    if (!id) {
      // default constructor
      this.Ctor = _.Vue
      // inline repeats should inherit
      this.inherit = true
      // important: transclude with no options, just
      // to ensure block start and block end
      this.template = transclude(this.template)
      var copy = _.extend({}, options)
      copy._asComponent = false
      this._linkFn = compile(this.template, copy)
    } else {
      this.Ctor = null
      this.asComponent = true
      // check inline-template
      if (this._checkParam('inline-template') !== null) {
        // extract inline template as a DocumentFragment
        this.inlineTempalte = _.extractContent(this.el, true)
      }
      var tokens = textParser.parse(id)
      if (tokens) {
        // dynamic component to be resolved later
        var ctorExp = textParser.tokensToExp(tokens)
        this.ctorGetter = expParser.parse(ctorExp).get
      } else {
        // static
        this.componentId = id
        this.pendingData = null
      }
    }
  },

  resolveComponent: function () {
    this.componentState = PENDING
    this.vm._resolveComponent(this.componentId, _.bind(function (Ctor) {
      if (this.componentState === ABORTED) {
        return
      }
      this.Ctor = Ctor
      var merged = mergeOptions(Ctor.options, {}, {
        $parent: this.vm
      })
      merged.template = this.inlineTempalte || merged.template
      merged._asComponent = true
      merged._parent = this.vm
      this.template = transclude(this.template, merged)
      // Important: mark the template as a root node so that
      // custom element components don't get compiled twice.
      // fixes #822
      this.template.__vue__ = true
      this._linkFn = compile(this.template, merged)
      this.componentState = RESOLVED
      this.realUpdate(this.pendingData)
      this.pendingData = null
    }, this))
  },

    /**
   * Resolve a dynamic component to use for an instance.
   * The tricky part here is that there could be dynamic
   * components depending on instance data.
   *
   * @param {Object} data
   * @param {Object} meta
   * @return {Function}
   */

  resolveDynamicComponent: function (data, meta) {
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
    if (!Ctor.options) {
      _.warn(
        'Async resolution is not supported for v-repeat ' +
        '+ dynamic component. (component: ' + id + ')'
      )
      return _.Vue
    }
    return Ctor
  },

  /**
   * Update.
   * This is called whenever the Array mutates. If we have
   * a component, we might need to wait for it to resolve
   * asynchronously.
   *
   * @param {Array|Number|String} data
   */

  update: function (data) {
    if (this.componentId) {
      var state = this.componentState
      if (state === UNRESOLVED) {
        this.pendingData = data
        // once resolved, it will call realUpdate
        this.resolveComponent()
      } else if (state === PENDING) {
        this.pendingData = data
      } else if (state === RESOLVED) {
        this.realUpdate(data)
      }
    } else {
      this.realUpdate(data)
    }
  },

  /**
   * The real update that actually modifies the DOM.
   *
   * @param {Array|Number|String} data
   */

  realUpdate: function (data) {
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
      vm = !init && this.getVm(raw, converted ? obj.$key : null)
      if (vm) { // reusable instance
        vm._reused = true
        vm.$index = i // update $index
        // update data for track-by or object repeat,
        // since in these two cases the data is replaced
        // rather than mutated.
        if (idKey || converted) {
          if (alias) {
            vm[alias] = raw
          } else if (_.isPlainObject(raw)) {
            vm.$data = raw
          } else {
            vm.$value = raw
          }
        }
      } else { // new instance
        vm = this.build(obj, i, true)
        // the _new flag is used in the second pass for
        // vm cache retrival, but if this is the init phase
        // the flag can just be set to false directly.
        vm._new = !init
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
        var nextEl = targetNext.$el
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
    var meta = { $index: index }
    if (this.converted) {
      meta.$key = data.$key
    }
    var raw = this.converted ? data.$value : data
    var alias = this.arg
    if (alias) {
      data = {}
      data[alias] = raw
    } else if (!isPlainObject(raw)) {
      // non-object values
      data = {}
      meta.$value = raw
    } else {
      // default
      data = raw
    }
    // resolve constructor
    var Ctor = this.Ctor || this.resolveDynamicComponent(data, meta)
    var vm = this.vm.$addChild({
      el: templateParser.clone(this.template),
      _asComponent: this.asComponent,
      _host: this._host,
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
      this.cacheVm(raw, vm, this.converted ? meta.$key : null)
    }
    // sync back changes for two-way bindings of primitive values
    var type = typeof raw
    if (type === 'string' || type === 'number') {
      var dir = this
      vm.$watch(alias || '$value', function (val) {
        dir._withLock(function () {
          if (dir.converted) {
            dir.rawValue[vm.$key] = val
          } else {
            dir.rawValue.$set(vm.$index, val)
          }
        })
      })
    }
    return vm
  },

  /**
   * Unbind, teardown everything
   */

  unbind: function () {
    this.componentState = ABORTED
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
   * @param {String} [key]
   */

  cacheVm: function (data, vm, key) {
    var idKey = this.idKey
    var cache = this.cache
    var id
    if (key || idKey) {
      id = idKey ? data[idKey] : key
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
        _.define(data, id, vm)
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
   * @param {String} [key]
   * @return {Vue|undefined}
   */

  getVm: function (data, key) {
    var idKey = this.idKey
    if (key || idKey) {
      var id = idKey ? data[idKey] : key
      return this.cache[id]
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
    var idKey = this.idKey
    if (idKey || this.converted) {
      var id = idKey ? data[idKey] : vm.$key
      this.cache[id] = null
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
},{"../compiler/compile":16,"../compiler/transclude":17,"../parsers/expression":54,"../parsers/template":56,"../parsers/text":57,"../util":65,"../util/merge-option":67}],38:[function(require,module,exports){
var transition = require('../transition')

module.exports = function (value) {
  var el = this.el
  transition.apply(el, value ? 1 : -1, function () {
    el.style.display = value ? '' : 'none'
  }, this.vm)
}
},{"../transition":59}],39:[function(require,module,exports){
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
},{"../util":65}],40:[function(require,module,exports){
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
},{"../util":65}],41:[function(require,module,exports){
module.exports = {

  priority: 1000,
  isLiteral: true,

  bind: function () {
    if (!this._isDynamicLiteral) {
      this.update(this.expression)
    }
  },

  update: function (id) {
    var vm = this.el.__vue__ || this.vm
    this.el.__v_trans = {
      id: id,
      // resolve the custom transition functions now
      // so the transition module knows this is a
      // javascript transition without having to check
      // computed CSS.
      fns: vm.$options.transitions[id]
    }
  }

}
},{}],42:[function(require,module,exports){
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
    if (key !== '$key' && key !== '$value') {
      if (a && '$value' in a) a = a.$value
      if (b && '$value' in b) b = b.$value
    }
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
  if (_.isPlainObject(val)) {
    for (var key in val) {
      if (contains(val[key], search)) {
        return true
      }
    }
  } else if (_.isArray(val)) {
    var i = val.length
    while (i--) {
      if (contains(val[i], search)) {
        return true
      }
    }
  } else if (val != null) {
    return val.toString().toLowerCase().indexOf(search) > -1
  }
}
},{"../parsers/path":55,"../util":65}],43:[function(require,module,exports){
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

},{"../util":65,"./array-filters":42}],44:[function(require,module,exports){
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
  if (options._linkFn) {
    // pre-transcluded with linker, just use it
    this._initElement(el)
    this._unlinkFn = options._linkFn(this, el)
  } else {
    // transclude and init element
    // transclude can potentially replace original
    // so we need to keep reference
    var original = el
    el = transclude(el, options)
    this._initElement(el)
    // compile and link the rest
    this._unlinkFn = compile(el, options)(this, el)
    // finally replace original
    if (options.replace) {
      _.replace(original, el)
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
    this.$el = this._blockStart = el.firstChild
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
 * @param {Vue|undefined} host - transclusion host component
 */

exports._bindDir = function (name, node, desc, def, host) {
  this._directives.push(
    new Directive(name, node, this, desc, def, host)
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
    parent._children.$remove(this)
  }
  // same for transclusion host.
  var host = this._host
  if (host && !host._isBeingDestroyed) {
    host._transCpnts.$remove(this)
  }
  // destroy all children.
  i = this._children.length
  while (i--) {
    this._children[i].$destroy()
  }
  // teardown all directives. this also tearsdown all
  // directive-owned watchers.
  if (this._unlinkFn) {
    // passing destroying: true to avoid searching and
    // splicing the directives
    this._unlinkFn(true)
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
},{"../compiler/compile":16,"../compiler/transclude":17,"../directive":19,"../util":65}],45:[function(require,module,exports){
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
  if (this._transCpnts.length) {
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
  if (this._transCpnts.length) {
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
},{"../util":65}],46:[function(require,module,exports){
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
  this._unlinkFn    = null

  // children
  this._children = []
  this._childCtors = {}

  // transcluded components that belong to the parent.
  // need to keep track of them so that we can call
  // attached/detached hooks on them.
  this._transCpnts = []
  this._host = options._host

  // push self into parent / transclusion host
  if (this.$parent) {
    this.$parent._children.push(this)
  }
  if (this._host) {
    this._host._transCpnts.push(this)
  }

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
},{"../util/merge-option":67}],47:[function(require,module,exports){
var _ = require('../util')

/**
 * Apply a filter to a list of arguments.
 * This is only used internally inside expressions with
 * inlined filters.
 *
 * @param {String} id
 * @param {Array} args
 * @return {*}
 */

exports._applyFilter = function (id, args) {
  var registry = this.$options.filters
  var filter = registry[id]
  _.assertAsset(filter, 'filter', id)
  return (filter.read || filter).apply(this, args)
}

/**
 * Resolve a component, depending on whether the component
 * is defined normally or using an async factory function.
 * Resolves synchronously if already resolved, otherwise
 * resolves asynchronously and caches the resolved
 * constructor on the factory.
 *
 * @param {String} id
 * @param {Function} cb
 */

exports._resolveComponent = function (id, cb) {
  var registry = this.$options.components
  var factory = registry[id]
  _.assertAsset(factory, 'component', id)
  // async component factory
  if (!factory.options) {
    if (factory.resolved) {
      // cached
      cb(factory.resolved)
    } else if (factory.requested) {
      factory.pendingCallbacks.push(cb)
    } else {
      factory.requested = true
      var cbs = factory.pendingCallbacks = [cb]
      factory(function resolve (res) {
        if (_.isPlainObject(res)) {
          res = _.Vue.extend(res)
        }
        // cache resolved
        factory.resolved = res
        // invoke callbacks
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res)
        }
      })
    }
  } else {
    // normal component
    cb(factory)
  }
}
},{"../util":65}],48:[function(require,module,exports){
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
  var i, key
  // make sure all props properties are observed
  var props = this.$options.props
  if (props) {
    i = props.length
    while (i--) {
      key = _.camelize(props[i])
      if (!(key in data)) {
        data[key] = null
      }
    }
  }
  var keys = Object.keys(data)
  i = keys.length
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
    if (child.$options.inherit) {
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
},{"../observer":51,"../observer/dep":50,"../util":65}],49:[function(require,module,exports){
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
    /* istanbul ignore if */
    if (!this.length) return
    if (typeof index !== 'number') {
      index = _.indexOf(this, index)
    }
    if (index > -1) {
      this.splice(index, 1)
    }
  }
)

module.exports = arrayMethods
},{"../util":65}],50:[function(require,module,exports){
var _ = require('../util')

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 *
 * @constructor
 */

function Dep () {
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
  this.subs.$remove(sub)
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
},{"../util":65}],51:[function(require,module,exports){
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
        oldChildOb.deps.$remove(dep)
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
  this.vms.$remove(vm)
}

module.exports = Observer

},{"../config":18,"../util":65,"./array":49,"./dep":50,"./object":52}],52:[function(require,module,exports){
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
 * Set a property on an observed object, calling add to
 * ensure the property is observed.
 *
 * @param {String} key
 * @param {*} val
 * @public
 */

_.define(
  objProto,
  '$set',
  function $set (key, val) {
    this.$add(key, val)
    this[key] = val
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
},{"../util":65}],53:[function(require,module,exports){
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
},{"../cache":15,"../util":65}],54:[function(require,module,exports){
var _ = require('../util')
var Path = require('./path')
var Cache = require('../cache')
var expressionCache = new Cache(1000)

var allowedKeywords =
  'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
  'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
  'encodeURIComponent,parseInt,parseFloat'
var allowedKeywordsRE =
  new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')

// keywords that don't make sense inside expressions
var improperKeywords =
  'break,case,class,catch,const,continue,debugger,default,' +
  'delete,do,else,export,extends,finally,for,function,if,' +
  'import,in,instanceof,let,return,super,switch,throw,try,' +
  'var,while,with,yield,enum,await,implements,package,' +
  'proctected,static,interface,private,public'
var improperKeywordsRE =
  new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')

var wsRE = /\s/g
var newlineRE = /\n/g
var saveRE = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|new |typeof |void /g
var restoreRE = /"(\d+)"/g
var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\])*$/
var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g
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
  if (allowedKeywordsRE.test(path)) {
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
  if (improperKeywordsRE.test(exp)) {
    _.warn(
      'Avoid using reserved keywords in expression: '
      + exp
    )
  }
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
  var res = exports.isSimplePath(exp)
    ? compilePathFns(exp)
    : compileExpFns(exp, needSet)
  expressionCache.put(exp, res)
  return res
}

/**
 * Check if an expression is a simple path.
 *
 * @param {String} exp
 * @return {Boolean}
 */

exports.isSimplePath = function (exp) {
  return pathTestRE.test(exp) &&
    // don't treat true/false as paths
    !booleanLiteralRE.test(exp) &&
    // Math constants e.g. Math.PI, Math.E etc.
    exp.slice(0, 5) !== 'Math.'
}
},{"../cache":15,"../util":65,"./path":55}],55:[function(require,module,exports){
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
 * The fixed path getter supresses errors.
 *
 * @param {Array} path
 * @return {Function}
 */

exports.compileGetter = function (path) {
  var body = 'return o' + path.map(formatAccessor).join('')
  return new Function('o', 'try {' + body + '} catch (e) {}')
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
},{"../cache":15,"../util":65}],56:[function(require,module,exports){
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
},{"../cache":15,"../util":65}],57:[function(require,module,exports){
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
  var match, index, value, first, oneTime
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
    value = oneTime
      ? match[1].slice(1)
      : match[1]
    tokens.push({
      tag: true,
      value: value.trim(),
      html: htmlRE.test(match[0]),
      oneTime: oneTime
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
      : inlineFilters(token.value, single)
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
 * @param {Boolean} single
 * @return {String}
 */

var filterRE = /[^|]\|[^|]/
function inlineFilters (exp, single) {
  if (!filterRE.test(exp)) {
    return single
      ? exp
      : '(' + exp + ')'
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
        exp = 'this._applyFilter("' + filter.name + '",[' + exp + args + '])'
      }
      return exp
    }
  }
}
},{"../cache":15,"../config":18,"./directive":53}],58:[function(require,module,exports){
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
  var f = document.documentElement.offsetHeight
  queue.forEach(run)
  queue = []
  queued = false
  /* dummy return, so js linters don't complain about unused variable f */
  return f
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

},{"../util":65}],59:[function(require,module,exports){
var _ = require('../util')
var applyCSSTransition = require('./css')
var applyJSTransition = require('./js')
var doc = typeof document === 'undefined' ? null : document

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
  } else if (
    _.transitionEndEvent &&
    // skip CSS transitions if page is not visible -
    // this solves the issue of transitionend events not
    // firing until the page is visible again.
    // pageVisibility API is supported in IE10+, same as
    // CSS transitions.
    !(doc && doc.hidden)
  ) {
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
},{"../util":65,"./css":58,"./js":60}],60:[function(require,module,exports){
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
},{}],61:[function(require,module,exports){
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

  exports.warn = function (msg) {
    if (hasConsole && (!config.silent || config.debug)) {
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
},{"../config":18}],62:[function(require,module,exports){
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
  /* istanbul ignore if */
  if (
    el.tagName === 'TEMPLATE' &&
    el.content instanceof DocumentFragment
  ) {
    el = el.content
  }
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

},{"../config":18}],63:[function(require,module,exports){
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
},{}],64:[function(require,module,exports){
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
},{"./debug":61}],65:[function(require,module,exports){
var lang   = require('./lang')
var extend = lang.extend

extend(exports, lang)
extend(exports, require('./env'))
extend(exports, require('./dom'))
extend(exports, require('./filter'))
extend(exports, require('./debug'))
extend(exports, require('./misc'))
},{"./debug":61,"./dom":62,"./env":63,"./filter":64,"./lang":66,"./misc":68}],66:[function(require,module,exports){
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
  return function (a) {
    var l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
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

/**
 * Manual indexOf because it's slightly faster than
 * native.
 *
 * @param {Array} arr
 * @param {*} obj
 */

exports.indexOf = function (arr, obj) {
  for (var i = 0, l = arr.length; i < l; i++) {
    if (arr[i] === obj) return i
  }
  return -1
}
},{}],67:[function(require,module,exports){
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
strats.props = function (parentVal, childVal) {
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
strats.transitions =
strats.components =
strats.elementDirectives = function (parentVal, childVal, vm, key) {
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
},{"./index":65}],68:[function(require,module,exports){
/**
 * Check if an element is a component, if yes return its
 * component id.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {String|undefined}
 */

exports.checkComponent = function (el, options) {
  var tag = el.tagName.toLowerCase()
  if (tag === 'component') {
    // dynamic syntax
    var exp = el.getAttribute('is')
    el.removeAttribute('is')
    return exp
  } else if (options.components[tag]) {
    return tag
  }
}
},{}],69:[function(require,module,exports){
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
  transitions : {},
  components  : {},
  elementDirectives: {}
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
    if (newData !== this._data) {
      this._setData(newData)
    }
  }
})

/**
 * Mixin internal instance methods
 */

extend(p, require('./instance/init'))
extend(p, require('./instance/events'))
extend(p, require('./instance/scope'))
extend(p, require('./instance/compile'))
extend(p, require('./instance/misc'))

/**
 * Mixin public API methods
 */

extend(p, require('./api/data'))
extend(p, require('./api/dom'))
extend(p, require('./api/events'))
extend(p, require('./api/child'))
extend(p, require('./api/lifecycle'))

module.exports = _.Vue = Vue
},{"./api/child":8,"./api/data":9,"./api/dom":10,"./api/events":11,"./api/global":12,"./api/lifecycle":13,"./directives":28,"./filters":43,"./instance/compile":44,"./instance/events":45,"./instance/init":46,"./instance/misc":47,"./instance/scope":48,"./util":65}],70:[function(require,module,exports){
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
  this.deps = []
  this.newDeps = []
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
  var newDeps = this.newDeps
  var old = this.deps
  if (_.indexOf(newDeps, dep) < 0) {
    newDeps.push(dep)
    var i = _.indexOf(old, dep)
    if (i < 0) {
      dep.addSub(this)
    } else {
      old[i] = null
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
}

/**
 * Clean up for dependency collection.
 */

p.afterGet = function () {
  Observer.target = null
  var i = this.deps.length
  while (i--) {
    var dep = this.deps[i]
    if (dep) {
      dep.removeSub(this)
    }
  }
  this.deps = this.newDeps
  this.newDeps = []
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
    cbs.$remove(cb)
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
      this.vm._watcherList.$remove(this)
    }
    var i = this.deps.length
    while (i--) {
      this.deps[i].removeSub(this)
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
},{"./batcher":14,"./config":18,"./observer":51,"./parsers/expression":54,"./util":65}],71:[function(require,module,exports){
module.exports = '<div class="form-group">\n	<label class="control-label col-sm-2">{{ field.label }}</label>\n	<div class="col-sm-6">\n		<select v-if="options" class="form-control" v-model="value" options="options" v-attr="required: field.required"></select>\n		<p v-if="!options" class="form-control-static">\n			<em class="text-muted">Loading {{ field.label | lowercase | plural }}&hellip;</em>\n		</p>\n	</div>\n</div>\n';
},{}],72:[function(require,module,exports){
var Firebase = require('firebase')

var field = require('../field')
var valueToProperty = require('../valueToProperty')
var models = require('../../../models')
var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	mixins: [field, valueToProperty],
	template: require('./entry.html'),
	data: function () {
		return {
			options: null
		}
	},
	compiled: function () {
		var model = models[this.field.model]

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

},{"../../../models":86,"../field":73,"../valueToProperty":80,"./entry.html":71,"firebase":1}],73:[function(require,module,exports){
module.exports = {
	replace: true,
	props: ['field', 'entry']
}

},{}],74:[function(require,module,exports){
module.exports = '<div class="form-group">\n	<div class="col-sm-offset-2 col-sm-6">\n		<em class="text-muted" v-if="uploading">Uploading&hellip;</em>\n		<button type="button" class="btn btn-primary" v-if="!value && !uploading" v-on="click: upload">Upload {{ field.label | lowercase }}</button>\n		<template v-if="value && !uploading">\n			<img class="img-thumbnail clickable" v-attr="src: thumbnail" v-on="click: upload">\n			<button type="button" class="btn btn-xs btn-default" v-on="click: remove">Remove {{ field.label | lowercase }}</button>\n		</template>\n	</div>\n</div>\n';
},{}],75:[function(require,module,exports){
var field = require('../field')
var valueToProperty = require('../valueToProperty')

module.exports = {
	mixins: [field, valueToProperty],
	template: require('./image.html'),
	data: function () {
		return {
			uploading: false
		}
	},
	computed: {
		thumbnail: function () {
			return this.value + '-/resize/300/'
		}
	},
	methods: {
		upload: function (event) {
			event.preventDefault()

			var vm = this

			uploadcare.openDialog(null, {
				crop: 'disabled',
				imagesOnly: true
			})
			.done(function (file) {
				console.log('Uploading file:', file)
				vm.uploading = true

				file.promise()
				.always(function () {
					vm.uploading = false
				})
				.done(function (fileInfo) {
					console.log('Uploaded file data:', fileInfo)
					vm.value = fileInfo.originalUrl
				})
			})
		},
		remove: function (event) {
			event.preventDefault()
			this.value = null
		}
	}
}

},{"../field":73,"../valueToProperty":80,"./image.html":74}],76:[function(require,module,exports){
var field = require('../field')
var valueToProperty = require('../valueToProperty')

module.exports = {
	mixins: [field, valueToProperty],
	template: require('./markdown.html')
}

},{"../field":73,"../valueToProperty":80,"./markdown.html":77}],77:[function(require,module,exports){
module.exports = '<div class="form-group">\n	<label class="control-label col-sm-2">{{ field.label }}</label>\n	<div class="col-sm-6">\n		<textarea rows="12" class="form-control" v-model="value" v-attr="required: field.required"></textarea>\n	</div>\n</div>\n';
},{}],78:[function(require,module,exports){
var field = require('../field')
var valueToProperty = require('../valueToProperty')

module.exports = {
	mixins: [field, valueToProperty],
	template: require('./text.html'),
	computed: {
		inputType: function () {
			switch (this.field.type) {
				case 'text':
				case 'email':
					return this.field.type
			}
			return 'text'
		}
	}
}

},{"../field":73,"../valueToProperty":80,"./text.html":79}],79:[function(require,module,exports){
module.exports = '<div class="form-group">\n	<label class="control-label col-sm-2">{{ field.label }}</label>\n	<div class="col-sm-6">\n		<input class="form-control" v-model="value" v-attr="type: inputType, required: field.required">\n	</div>\n</div>\n';
},{}],80:[function(require,module,exports){
module.exports = {
	computed: {
		value: {
			get: function () {
				if (this.entry && this.field && this.field.property) {
					return this.entry[this.field.property]
				}
			},
			set: function (value) {
				if (this.entry && this.field && this.field.property) {
					this.entry.$set(this.field.property, value)
				}
			}
		}
	}
}

},{}],81:[function(require,module,exports){
module.exports = {
	props: ['models', 'model'],
	template: require('./nav.html'),
	methods: {
		isActive: function (property) {
			return property === this.model
		}
	},
	created: function () {
		this.$watch('model', function () {
			console.log(this.$root)
		})
	}
}

},{"./nav.html":82}],82:[function(require,module,exports){
module.exports = '<div class="list-group">\n	<a v-repeat="models" href="#/{{ property }}" class="list-group-item" v-class="active: isActive(property)">{{ label | plural }}</a>\n</div>\n';
},{}],83:[function(require,module,exports){
module.exports = '<div class="container">\n	<div class="row">\n		<div class="col-sm-2">\n			<input type="text" class="form-control" placeholder="Find content&hellip;">\n			<hr>\n			<nav models="{{ models }}" model="{{ route.params.model }}"></nav>\n		</div>\n		<div class="col-sm-10">\n			<router-view></router-view>\n		</div>\n	</div>\n</div>\n';
},{}],84:[function(require,module,exports){
var Vue = require('vue')
var Router = require('vue-router')
var pluralize = require('pluralize')

var models = require('./models')


Vue.use(Router)


var app = new Vue({
	template: require('./container.html'),
	components: {
		nav: require('./components/nav'),
		'view-entries': require('./views/entries'),
		'view-entry': require('./views/entry')
	},
	filters: {
		plural: function (value) {
			return pluralize(value)
		}
	},
	data: function () {
		return {
			view: null,
			activeModel: null,
			model: null,
			activeEntry: null,
			entry: null
		}
	},
	computed: {
		models: function () {
			return models
		}
	}
})


var router = new Router({ hashbang: false })

router.map({
	'/:model': {
		component: 'view-entries'
	},
	'/:model/:id': {
		component: 'view-entry'
	}
})

router.redirect({
	'/': '/' + models[Object.keys(models)[0]].property
})


router.start(app)
app.$mount(document.body)

},{"./components/nav":81,"./container.html":83,"./models":86,"./views/entries":89,"./views/entry":91,"pluralize":2,"vue":69,"vue-router":5}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
module.exports = {
	posts: require('./post'),
	authors: require('./author')
}

},{"./author":85,"./post":87}],87:[function(require,module,exports){
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
			label: 'Author',
			property: 'author',
			type: 'entry',
			model: 'authors',
			required: true
		},
		{
			label: 'Header image',
			property: 'header_image',
			type: 'image'
		},
		{
			label: 'Post body',
			property: 'body',
			type: 'markdown',
			required: true
		}
	]
}

},{}],88:[function(require,module,exports){
module.exports = '<template v-if="model">\n	<a href="#/{{ model.property }}/new" class="btn btn-success pull-right">Add new {{ model.label | lowercase }}</a>\n	<table class="table table-hover">\n		<thead>\n			<tr>\n				<th v-repeat="fields">{{ label }}</th>\n			</tr>\n		</thead>\n		<tbody v-if="entries">\n			<tr v-repeat="entry : entries" v-on="click: edit($event, $key)" data-id="{{ $key }}" class="clickable">\n				<td v-repeat="fields">{{ entry[property] }}</td>\n			</tr>\n		</tbody>\n		<tbody v-if="!entries">\n			<tr>\n				<td colspan="{{ model.fields.length }}">\n					<em class="text-muted">Loading {{ model.label | lowercase | plural }}&hellip;</em>\n				</td>\n			</tr>\n		</tbody>\n	</table>\n</template>\n';
},{}],89:[function(require,module,exports){
var Firebase = require('firebase')
var models = require('../../models')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	inherit: true,
	template: require('./entries.html'),
	methods: {
		loadEntries: function () {
			this.$delete('entries')
			this.entriesRef.once('value', function (snapshot) {
				this.$set('entries', snapshot.val())
			}.bind(this))
		},
		edit: function (event, id) {
			event.preventDefault()
			if (id) {
				location.assign('#/' + this.model.property + '/' + id)
			}
		}
	},
	computed: {
		path: function () {
			return this.route.params.model
		},
		model: function () {
			return models[this.route.params.model]
		},
		fields: function () {
			return this.model.fields.filter(function (filter) {
				return filter.listed
			})
		},
		entriesRef: function () {
			return dataRef.child(this.model.property)
		}
	},
	created: function () {
		this.$watch('path', this.loadEntries, false, true)
	}
}

},{"../../models":86,"./entries.html":88,"firebase":1}],90:[function(require,module,exports){
module.exports = '<template v-if="entry">\n	<form v-on="submit: save($event)" class="form-horizontal">\n		<fieldset>\n			<legend v-if="isNew">\n				New {{ model.label | lowercase }}\n			</legend>\n			<legend v-if="!isNew">\n				Edit {{ model.label | lowercase }}\n				<small class="text-muted pull-right">{{ id }}</small>\n			</legend>\n\n			<template v-repeat="field: model.fields">\n				<component is="{{ componentFor(field.type) }}" field="{{ field }}" entry="{{ entry }}"></component>\n			</template>\n			<div class="form-group">\n				<div class="col-sm-offset-2 col-sm-2">\n					<button class="btn btn-success btn-lg" type="submit">Save</button>\n				</div>\n			</div>\n		</fieldset>\n	</form>\n	<p class="text-right" v-if="!isNew">\n		<button v-on="click: remove($event)" type="button" class="btn btn-link">\n			Delete this {{ model.label | lowercase }}?\n		</button>\n	</p>\n</template>\n\n<em v-if="!entry" class="text-muted">Loading {{ model.label | lowercase }}&hellip;</em>\n';
},{}],91:[function(require,module,exports){
var Firebase = require('firebase')
var models = require('../../models')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	inherit: true,
	template: require('./entry.html'),
	components: {
		textField: require('../../components/fields/text'),
		markdownField: require('../../components/fields/markdown'),
		entryField: require('../../components/fields/entry'),
		imageField: require('../../components/fields/image')
	},
	methods: {
		loadEntry: function () {
			var vm = this

			function set (entry) {
				vm.$set('entry', entry)
				var unwatch = vm.$watch('entry', function () {
					vm.$set('hasChanged', true)
					unwatch()
				}, true)
			}

			if (vm.isNew) {
				set({})
				return
			}

			vm.entry = null
			vm.entryRef.once('value', function (snapshot) {
				setTimeout(function () {
					set(snapshot.val())
				}, 2000)
			})
		},
		componentFor: function (type) {
			switch (type) {
				case 'text':
					return 'textField'
				case 'markdown':
					return 'markdownField'
				case 'entry':
					return 'entryField'
				case 'image':
					return 'imageField'
				default:
					return 'textField'
			}
		},
		save: function (event) {
			event.preventDefault()

			var vm = this

			var done = (function (err) {
				if (err) {
					console.error('Could not save:', err)
				}
				else {
					vm.$set('hasChanged', false)
					location.assign('#/' + vm.model.property)
				}
			})

			// skip save when nothing has changed
			if (!vm.hasChanged) return done()

			if (vm.isNew) {
				vm.entriesRef.push(vm.entry, done)
			}
			else {
				vm.entryRef.update(vm.entry, done)
			}
		},
		remove: function (event) {
			event.preventDefault()

			// TODO: add undo
			if (!window.confirm('This cannot be undone. Continue?')) {
				return
			}

			this.entryRef.remove(function (err) {
				if (err) {
					console.error('Could not remove:', err)
				}
				else {
					location.assign('#/' + this.model.property)
				}
			}.bind(this))
		}
	},
	computed: {
		path: function () {
			return this.route.params.model + '/' + this.route.params.id
		},
		model: function () {
			return models[this.route.params.model]
		},
		id: function () {
			return this.route.params.id
		},
		entriesRef: function () {
			return dataRef.child(this.model.property)
		},
		entryRef: function () {
			return this.entriesRef.child(this.id)
		},
		isNew: function () {
			return this.id === 'new'
		}
	},
	created: function () {
		this.$watch('path', this.loadEntry, false, true)
	},
	attached: function () {
		var vm = this
		// TODO: make this work for back button (push state)
		window.addEventListener('beforeunload', function (event) {
			if (vm.hasChanged) {
				var confirm = 'You have unsaved changes.\nLeaving this page will discard these changes.'

				return (event || window.event).returnValue = confirm
			}
		}, false)
	}
}

},{"../../components/fields/entry":72,"../../components/fields/image":75,"../../components/fields/markdown":76,"../../components/fields/text":78,"../../models":86,"./entry.html":90,"firebase":1}]},{},[84])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmlyZWJhc2UvbGliL2ZpcmViYXNlLXdlYi5qcyIsIm5vZGVfbW9kdWxlcy9wbHVyYWxpemUvcGx1cmFsaXplLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS1yb3V0ZXIvbm9kZV9tb2R1bGVzL2luc2VydC1jc3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlLXJvdXRlci9ub2RlX21vZHVsZXMvcm91dGUtcmVjb2duaXplci9kaXN0L3JvdXRlLXJlY29nbml6ZXIuanMiLCJub2RlX21vZHVsZXMvdnVlLXJvdXRlci9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlLXJvdXRlci9zcmMvbGluay5qcyIsIm5vZGVfbW9kdWxlcy92dWUtcm91dGVyL3NyYy92aWV3LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2NoaWxkLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2RhdGEuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvZG9tLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2FwaS9nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvbGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmF0Y2hlci5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NhY2hlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY29tcGlsZXIvY29tcGlsZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NvbXBpbGVyL3RyYW5zY2x1ZGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9jb25maWcuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2F0dHIuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2NsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9jbG9hay5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9lbC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9odG1sLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9pZi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL2NoZWNrYm94LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9kZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvbW9kZWwvcmFkaW8uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL3NlbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvb24uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3Byb3AuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3JlZi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9zaG93LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9zdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvdGV4dC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvdHJhbnNpdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2ZpbHRlcnMvYXJyYXktZmlsdGVycy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2ZpbHRlcnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9jb21waWxlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2UvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2UvaW5pdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2luc3RhbmNlL21pc2MuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9zY29wZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyL2FycmF5LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvb2JzZXJ2ZXIvZGVwLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvb2JzZXJ2ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9vYnNlcnZlci9vYmplY3QuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvZXhwcmVzc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvcGF0aC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvdGVtcGxhdGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL3RleHQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uL2Nzcy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3RyYW5zaXRpb24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uL2pzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9kZWJ1Zy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvZG9tLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9lbnYuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2ZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2xhbmcuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL21lcmdlLW9wdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvbWlzYy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3Z1ZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3dhdGNoZXIuanMiLCJzcmMvY29tcG9uZW50cy9maWVsZHMvZW50cnkvZW50cnkuaHRtbCIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy9lbnRyeS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy9maWVsZC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy9pbWFnZS9pbWFnZS5odG1sIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL2ltYWdlL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL21hcmtkb3duL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL21hcmtkb3duL21hcmtkb3duLmh0bWwiLCJzcmMvY29tcG9uZW50cy9maWVsZHMvdGV4dC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy90ZXh0L3RleHQuaHRtbCIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy92YWx1ZVRvUHJvcGVydHkuanMiLCJzcmMvY29tcG9uZW50cy9uYXYvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9uYXYvbmF2Lmh0bWwiLCJzcmMvY29udGFpbmVyLmh0bWwiLCJzcmMvaW5kZXguanMiLCJzcmMvbW9kZWxzL2F1dGhvci5qcyIsInNyYy9tb2RlbHMvaW5kZXguanMiLCJzcmMvbW9kZWxzL3Bvc3QuanMiLCJzcmMvdmlld3MvZW50cmllcy9lbnRyaWVzLmh0bWwiLCJzcmMvdmlld3MvZW50cmllcy9pbmRleC5qcyIsInNyYy92aWV3cy9lbnRyeS9lbnRyeS5odG1sIiwic3JjL3ZpZXdzL2VudHJ5L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdm9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqc0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2htQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBAbGljZW5zZSBGaXJlYmFzZSB2Mi4yLjRcbiAgICBMaWNlbnNlOiBodHRwczovL3d3dy5maXJlYmFzZS5jb20vdGVybXMvdGVybXMtb2Ytc2VydmljZS5odG1sICovXG4oZnVuY3Rpb24oKSB7dmFyIGgsYWE9dGhpcztmdW5jdGlvbiBuKGEpe3JldHVybiB2b2lkIDAhPT1hfWZ1bmN0aW9uIGJhKCl7fWZ1bmN0aW9uIGNhKGEpe2EudWI9ZnVuY3Rpb24oKXtyZXR1cm4gYS50Zj9hLnRmOmEudGY9bmV3IGF9fVxuZnVuY3Rpb24gZGEoYSl7dmFyIGI9dHlwZW9mIGE7aWYoXCJvYmplY3RcIj09YilpZihhKXtpZihhIGluc3RhbmNlb2YgQXJyYXkpcmV0dXJuXCJhcnJheVwiO2lmKGEgaW5zdGFuY2VvZiBPYmplY3QpcmV0dXJuIGI7dmFyIGM9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpO2lmKFwiW29iamVjdCBXaW5kb3ddXCI9PWMpcmV0dXJuXCJvYmplY3RcIjtpZihcIltvYmplY3QgQXJyYXldXCI9PWN8fFwibnVtYmVyXCI9PXR5cGVvZiBhLmxlbmd0aCYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuc3BsaWNlJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5wcm9wZXJ0eUlzRW51bWVyYWJsZSYmIWEucHJvcGVydHlJc0VudW1lcmFibGUoXCJzcGxpY2VcIikpcmV0dXJuXCJhcnJheVwiO2lmKFwiW29iamVjdCBGdW5jdGlvbl1cIj09Y3x8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuY2FsbCYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEucHJvcGVydHlJc0VudW1lcmFibGUmJiFhLnByb3BlcnR5SXNFbnVtZXJhYmxlKFwiY2FsbFwiKSlyZXR1cm5cImZ1bmN0aW9uXCJ9ZWxzZSByZXR1cm5cIm51bGxcIjtcbmVsc2UgaWYoXCJmdW5jdGlvblwiPT1iJiZcInVuZGVmaW5lZFwiPT10eXBlb2YgYS5jYWxsKXJldHVyblwib2JqZWN0XCI7cmV0dXJuIGJ9ZnVuY3Rpb24gZWEoYSl7cmV0dXJuXCJhcnJheVwiPT1kYShhKX1mdW5jdGlvbiBmYShhKXt2YXIgYj1kYShhKTtyZXR1cm5cImFycmF5XCI9PWJ8fFwib2JqZWN0XCI9PWImJlwibnVtYmVyXCI9PXR5cGVvZiBhLmxlbmd0aH1mdW5jdGlvbiBwKGEpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBhfWZ1bmN0aW9uIGdhKGEpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiBhfWZ1bmN0aW9uIGhhKGEpe3JldHVyblwiZnVuY3Rpb25cIj09ZGEoYSl9ZnVuY3Rpb24gaWEoYSl7dmFyIGI9dHlwZW9mIGE7cmV0dXJuXCJvYmplY3RcIj09YiYmbnVsbCE9YXx8XCJmdW5jdGlvblwiPT1ifWZ1bmN0aW9uIGphKGEsYixjKXtyZXR1cm4gYS5jYWxsLmFwcGx5KGEuYmluZCxhcmd1bWVudHMpfVxuZnVuY3Rpb24ga2EoYSxiLGMpe2lmKCFhKXRocm93IEVycm9yKCk7aWYoMjxhcmd1bWVudHMubGVuZ3RoKXt2YXIgZD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMik7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGM9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtBcnJheS5wcm90b3R5cGUudW5zaGlmdC5hcHBseShjLGQpO3JldHVybiBhLmFwcGx5KGIsYyl9fXJldHVybiBmdW5jdGlvbigpe3JldHVybiBhLmFwcGx5KGIsYXJndW1lbnRzKX19ZnVuY3Rpb24gcShhLGIsYyl7cT1GdW5jdGlvbi5wcm90b3R5cGUuYmluZCYmLTEhPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kLnRvU3RyaW5nKCkuaW5kZXhPZihcIm5hdGl2ZSBjb2RlXCIpP2phOmthO3JldHVybiBxLmFwcGx5KG51bGwsYXJndW1lbnRzKX12YXIgbGE9RGF0ZS5ub3d8fGZ1bmN0aW9uKCl7cmV0dXJuK25ldyBEYXRlfTtcbmZ1bmN0aW9uIG1hKGEsYil7ZnVuY3Rpb24gYygpe31jLnByb3RvdHlwZT1iLnByb3RvdHlwZTthLlpnPWIucHJvdG90eXBlO2EucHJvdG90eXBlPW5ldyBjO2EucHJvdG90eXBlLmNvbnN0cnVjdG9yPWE7YS5WZz1mdW5jdGlvbihhLGMsZil7Zm9yKHZhciBnPUFycmF5KGFyZ3VtZW50cy5sZW5ndGgtMiksaz0yO2s8YXJndW1lbnRzLmxlbmd0aDtrKyspZ1trLTJdPWFyZ3VtZW50c1trXTtyZXR1cm4gYi5wcm90b3R5cGVbY10uYXBwbHkoYSxnKX19O2Z1bmN0aW9uIHIoYSxiKXtmb3IodmFyIGMgaW4gYSliLmNhbGwodm9pZCAwLGFbY10sYyxhKX1mdW5jdGlvbiBuYShhLGIpe3ZhciBjPXt9LGQ7Zm9yKGQgaW4gYSljW2RdPWIuY2FsbCh2b2lkIDAsYVtkXSxkLGEpO3JldHVybiBjfWZ1bmN0aW9uIG9hKGEsYil7Zm9yKHZhciBjIGluIGEpaWYoIWIuY2FsbCh2b2lkIDAsYVtjXSxjLGEpKXJldHVybiExO3JldHVybiEwfWZ1bmN0aW9uIHBhKGEpe3ZhciBiPTAsYztmb3IoYyBpbiBhKWIrKztyZXR1cm4gYn1mdW5jdGlvbiBxYShhKXtmb3IodmFyIGIgaW4gYSlyZXR1cm4gYn1mdW5jdGlvbiByYShhKXt2YXIgYj1bXSxjPTAsZDtmb3IoZCBpbiBhKWJbYysrXT1hW2RdO3JldHVybiBifWZ1bmN0aW9uIHNhKGEpe3ZhciBiPVtdLGM9MCxkO2ZvcihkIGluIGEpYltjKytdPWQ7cmV0dXJuIGJ9ZnVuY3Rpb24gdGEoYSxiKXtmb3IodmFyIGMgaW4gYSlpZihhW2NdPT1iKXJldHVybiEwO3JldHVybiExfVxuZnVuY3Rpb24gdWEoYSxiLGMpe2Zvcih2YXIgZCBpbiBhKWlmKGIuY2FsbChjLGFbZF0sZCxhKSlyZXR1cm4gZH1mdW5jdGlvbiB2YShhLGIpe3ZhciBjPXVhKGEsYix2b2lkIDApO3JldHVybiBjJiZhW2NdfWZ1bmN0aW9uIHdhKGEpe2Zvcih2YXIgYiBpbiBhKXJldHVybiExO3JldHVybiEwfWZ1bmN0aW9uIHhhKGEpe3ZhciBiPXt9LGM7Zm9yKGMgaW4gYSliW2NdPWFbY107cmV0dXJuIGJ9dmFyIHlhPVwiY29uc3RydWN0b3IgaGFzT3duUHJvcGVydHkgaXNQcm90b3R5cGVPZiBwcm9wZXJ0eUlzRW51bWVyYWJsZSB0b0xvY2FsZVN0cmluZyB0b1N0cmluZyB2YWx1ZU9mXCIuc3BsaXQoXCIgXCIpO1xuZnVuY3Rpb24gemEoYSxiKXtmb3IodmFyIGMsZCxlPTE7ZTxhcmd1bWVudHMubGVuZ3RoO2UrKyl7ZD1hcmd1bWVudHNbZV07Zm9yKGMgaW4gZClhW2NdPWRbY107Zm9yKHZhciBmPTA7Zjx5YS5sZW5ndGg7ZisrKWM9eWFbZl0sT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGQsYykmJihhW2NdPWRbY10pfX07ZnVuY3Rpb24gQWEoYSl7YT1TdHJpbmcoYSk7aWYoL15cXHMqJC8udGVzdChhKT8wOi9eW1xcXSw6e31cXHNcXHUyMDI4XFx1MjAyOV0qJC8udGVzdChhLnJlcGxhY2UoL1xcXFxbXCJcXFxcXFwvYmZucnR1XS9nLFwiQFwiKS5yZXBsYWNlKC9cIlteXCJcXFxcXFxuXFxyXFx1MjAyOFxcdTIwMjlcXHgwMC1cXHgwOFxceDBhLVxceDFmXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZyxcIl1cIikucmVwbGFjZSgvKD86Xnw6fCwpKD86W1xcc1xcdTIwMjhcXHUyMDI5XSpcXFspKy9nLFwiXCIpKSl0cnl7cmV0dXJuIGV2YWwoXCIoXCIrYStcIilcIil9Y2F0Y2goYil7fXRocm93IEVycm9yKFwiSW52YWxpZCBKU09OIHN0cmluZzogXCIrYSk7fWZ1bmN0aW9uIEJhKCl7dGhpcy5QZD12b2lkIDB9XG5mdW5jdGlvbiBDYShhLGIsYyl7c3dpdGNoKHR5cGVvZiBiKXtjYXNlIFwic3RyaW5nXCI6RGEoYixjKTticmVhaztjYXNlIFwibnVtYmVyXCI6Yy5wdXNoKGlzRmluaXRlKGIpJiYhaXNOYU4oYik/YjpcIm51bGxcIik7YnJlYWs7Y2FzZSBcImJvb2xlYW5cIjpjLnB1c2goYik7YnJlYWs7Y2FzZSBcInVuZGVmaW5lZFwiOmMucHVzaChcIm51bGxcIik7YnJlYWs7Y2FzZSBcIm9iamVjdFwiOmlmKG51bGw9PWIpe2MucHVzaChcIm51bGxcIik7YnJlYWt9aWYoZWEoYikpe3ZhciBkPWIubGVuZ3RoO2MucHVzaChcIltcIik7Zm9yKHZhciBlPVwiXCIsZj0wO2Y8ZDtmKyspYy5wdXNoKGUpLGU9YltmXSxDYShhLGEuUGQ/YS5QZC5jYWxsKGIsU3RyaW5nKGYpLGUpOmUsYyksZT1cIixcIjtjLnB1c2goXCJdXCIpO2JyZWFrfWMucHVzaChcIntcIik7ZD1cIlwiO2ZvcihmIGluIGIpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsZikmJihlPWJbZl0sXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmKGMucHVzaChkKSxEYShmLGMpLFxuYy5wdXNoKFwiOlwiKSxDYShhLGEuUGQ/YS5QZC5jYWxsKGIsZixlKTplLGMpLGQ9XCIsXCIpKTtjLnB1c2goXCJ9XCIpO2JyZWFrO2Nhc2UgXCJmdW5jdGlvblwiOmJyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IoXCJVbmtub3duIHR5cGU6IFwiK3R5cGVvZiBiKTt9fXZhciBFYT17J1wiJzonXFxcXFwiJyxcIlxcXFxcIjpcIlxcXFxcXFxcXCIsXCIvXCI6XCJcXFxcL1wiLFwiXFxiXCI6XCJcXFxcYlwiLFwiXFxmXCI6XCJcXFxcZlwiLFwiXFxuXCI6XCJcXFxcblwiLFwiXFxyXCI6XCJcXFxcclwiLFwiXFx0XCI6XCJcXFxcdFwiLFwiXFx4MEJcIjpcIlxcXFx1MDAwYlwifSxGYT0vXFx1ZmZmZi8udGVzdChcIlxcdWZmZmZcIik/L1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx1ZmZmZl0vZzovW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHhmZl0vZztcbmZ1bmN0aW9uIERhKGEsYil7Yi5wdXNoKCdcIicsYS5yZXBsYWNlKEZhLGZ1bmN0aW9uKGEpe2lmKGEgaW4gRWEpcmV0dXJuIEVhW2FdO3ZhciBiPWEuY2hhckNvZGVBdCgwKSxlPVwiXFxcXHVcIjsxNj5iP2UrPVwiMDAwXCI6MjU2PmI/ZSs9XCIwMFwiOjQwOTY+YiYmKGUrPVwiMFwiKTtyZXR1cm4gRWFbYV09ZStiLnRvU3RyaW5nKDE2KX0pLCdcIicpfTtmdW5jdGlvbiBHYSgpe3JldHVybiBNYXRoLmZsb29yKDIxNDc0ODM2NDgqTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpK01hdGguYWJzKE1hdGguZmxvb3IoMjE0NzQ4MzY0OCpNYXRoLnJhbmRvbSgpKV5sYSgpKS50b1N0cmluZygzNil9O3ZhciBIYTthOnt2YXIgSWE9YWEubmF2aWdhdG9yO2lmKElhKXt2YXIgSmE9SWEudXNlckFnZW50O2lmKEphKXtIYT1KYTticmVhayBhfX1IYT1cIlwifTtmdW5jdGlvbiBLYSgpe3RoaXMuV2E9LTF9O2Z1bmN0aW9uIExhKCl7dGhpcy5XYT0tMTt0aGlzLldhPTY0O3RoaXMuUj1bXTt0aGlzLmxlPVtdO3RoaXMuVGY9W107dGhpcy5JZD1bXTt0aGlzLklkWzBdPTEyODtmb3IodmFyIGE9MTthPHRoaXMuV2E7KythKXRoaXMuSWRbYV09MDt0aGlzLmJlPXRoaXMuJGI9MDt0aGlzLnJlc2V0KCl9bWEoTGEsS2EpO0xhLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuUlswXT0xNzMyNTg0MTkzO3RoaXMuUlsxXT00MDIzMjMzNDE3O3RoaXMuUlsyXT0yNTYyMzgzMTAyO3RoaXMuUlszXT0yNzE3MzM4Nzg7dGhpcy5SWzRdPTMyODUzNzc1MjA7dGhpcy5iZT10aGlzLiRiPTB9O1xuZnVuY3Rpb24gTWEoYSxiLGMpe2N8fChjPTApO3ZhciBkPWEuVGY7aWYocChiKSlmb3IodmFyIGU9MDsxNj5lO2UrKylkW2VdPWIuY2hhckNvZGVBdChjKTw8MjR8Yi5jaGFyQ29kZUF0KGMrMSk8PDE2fGIuY2hhckNvZGVBdChjKzIpPDw4fGIuY2hhckNvZGVBdChjKzMpLGMrPTQ7ZWxzZSBmb3IoZT0wOzE2PmU7ZSsrKWRbZV09YltjXTw8MjR8YltjKzFdPDwxNnxiW2MrMl08PDh8YltjKzNdLGMrPTQ7Zm9yKGU9MTY7ODA+ZTtlKyspe3ZhciBmPWRbZS0zXV5kW2UtOF1eZFtlLTE0XV5kW2UtMTZdO2RbZV09KGY8PDF8Zj4+PjMxKSY0Mjk0OTY3Mjk1fWI9YS5SWzBdO2M9YS5SWzFdO2Zvcih2YXIgZz1hLlJbMl0saz1hLlJbM10sbD1hLlJbNF0sbSxlPTA7ODA+ZTtlKyspNDA+ZT8yMD5lPyhmPWteYyYoZ15rKSxtPTE1MTg1MDAyNDkpOihmPWNeZ15rLG09MTg1OTc3NTM5Myk6NjA+ZT8oZj1jJmd8ayYoY3xnKSxtPTI0MDA5NTk3MDgpOihmPWNeZ15rLG09MzM5NTQ2OTc4MiksZj0oYjw8XG41fGI+Pj4yNykrZitsK20rZFtlXSY0Mjk0OTY3Mjk1LGw9ayxrPWcsZz0oYzw8MzB8Yz4+PjIpJjQyOTQ5NjcyOTUsYz1iLGI9ZjthLlJbMF09YS5SWzBdK2ImNDI5NDk2NzI5NTthLlJbMV09YS5SWzFdK2MmNDI5NDk2NzI5NTthLlJbMl09YS5SWzJdK2cmNDI5NDk2NzI5NTthLlJbM109YS5SWzNdK2smNDI5NDk2NzI5NTthLlJbNF09YS5SWzRdK2wmNDI5NDk2NzI5NX1cbkxhLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oYSxiKXtpZihudWxsIT1hKXtuKGIpfHwoYj1hLmxlbmd0aCk7Zm9yKHZhciBjPWItdGhpcy5XYSxkPTAsZT10aGlzLmxlLGY9dGhpcy4kYjtkPGI7KXtpZigwPT1mKWZvcig7ZDw9YzspTWEodGhpcyxhLGQpLGQrPXRoaXMuV2E7aWYocChhKSlmb3IoO2Q8Yjspe2lmKGVbZl09YS5jaGFyQ29kZUF0KGQpLCsrZiwrK2QsZj09dGhpcy5XYSl7TWEodGhpcyxlKTtmPTA7YnJlYWt9fWVsc2UgZm9yKDtkPGI7KWlmKGVbZl09YVtkXSwrK2YsKytkLGY9PXRoaXMuV2Epe01hKHRoaXMsZSk7Zj0wO2JyZWFrfX10aGlzLiRiPWY7dGhpcy5iZSs9Yn19O3ZhciB0PUFycmF5LnByb3RvdHlwZSxOYT10LmluZGV4T2Y/ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0LmluZGV4T2YuY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtjPW51bGw9PWM/MDowPmM/TWF0aC5tYXgoMCxhLmxlbmd0aCtjKTpjO2lmKHAoYSkpcmV0dXJuIHAoYikmJjE9PWIubGVuZ3RoP2EuaW5kZXhPZihiLGMpOi0xO2Zvcig7YzxhLmxlbmd0aDtjKyspaWYoYyBpbiBhJiZhW2NdPT09YilyZXR1cm4gYztyZXR1cm4tMX0sT2E9dC5mb3JFYWNoP2Z1bmN0aW9uKGEsYixjKXt0LmZvckVhY2guY2FsbChhLGIsYyl9OmZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1wKGEpP2Euc3BsaXQoXCJcIik6YSxmPTA7ZjxkO2YrKylmIGluIGUmJmIuY2FsbChjLGVbZl0sZixhKX0sUGE9dC5maWx0ZXI/ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0LmZpbHRlci5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPVtdLGY9MCxnPXAoYSk/XG5hLnNwbGl0KFwiXCIpOmEsaz0wO2s8ZDtrKyspaWYoayBpbiBnKXt2YXIgbD1nW2tdO2IuY2FsbChjLGwsayxhKSYmKGVbZisrXT1sKX1yZXR1cm4gZX0sUWE9dC5tYXA/ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0Lm1hcC5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPUFycmF5KGQpLGY9cChhKT9hLnNwbGl0KFwiXCIpOmEsZz0wO2c8ZDtnKyspZyBpbiBmJiYoZVtnXT1iLmNhbGwoYyxmW2ddLGcsYSkpO3JldHVybiBlfSxSYT10LnJlZHVjZT9mdW5jdGlvbihhLGIsYyxkKXtmb3IodmFyIGU9W10sZj0xLGc9YXJndW1lbnRzLmxlbmd0aDtmPGc7ZisrKWUucHVzaChhcmd1bWVudHNbZl0pO2QmJihlWzBdPXEoYixkKSk7cmV0dXJuIHQucmVkdWNlLmFwcGx5KGEsZSl9OmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWM7T2EoYSxmdW5jdGlvbihjLGcpe2U9Yi5jYWxsKGQsZSxjLGcsYSl9KTtyZXR1cm4gZX0sU2E9dC5ldmVyeT9mdW5jdGlvbihhLGIsXG5jKXtyZXR1cm4gdC5ldmVyeS5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPXAoYSk/YS5zcGxpdChcIlwiKTphLGY9MDtmPGQ7ZisrKWlmKGYgaW4gZSYmIWIuY2FsbChjLGVbZl0sZixhKSlyZXR1cm4hMTtyZXR1cm4hMH07ZnVuY3Rpb24gVGEoYSxiKXt2YXIgYz1VYShhLGIsdm9pZCAwKTtyZXR1cm4gMD5jP251bGw6cChhKT9hLmNoYXJBdChjKTphW2NdfWZ1bmN0aW9uIFVhKGEsYixjKXtmb3IodmFyIGQ9YS5sZW5ndGgsZT1wKGEpP2Euc3BsaXQoXCJcIik6YSxmPTA7ZjxkO2YrKylpZihmIGluIGUmJmIuY2FsbChjLGVbZl0sZixhKSlyZXR1cm4gZjtyZXR1cm4tMX1mdW5jdGlvbiBWYShhLGIpe3ZhciBjPU5hKGEsYik7MDw9YyYmdC5zcGxpY2UuY2FsbChhLGMsMSl9ZnVuY3Rpb24gV2EoYSxiLGMpe3JldHVybiAyPj1hcmd1bWVudHMubGVuZ3RoP3Quc2xpY2UuY2FsbChhLGIpOnQuc2xpY2UuY2FsbChhLGIsYyl9XG5mdW5jdGlvbiBYYShhLGIpe2Euc29ydChifHxZYSl9ZnVuY3Rpb24gWWEoYSxiKXtyZXR1cm4gYT5iPzE6YTxiPy0xOjB9O3ZhciBaYT0tMSE9SGEuaW5kZXhPZihcIk9wZXJhXCIpfHwtMSE9SGEuaW5kZXhPZihcIk9QUlwiKSwkYT0tMSE9SGEuaW5kZXhPZihcIlRyaWRlbnRcIil8fC0xIT1IYS5pbmRleE9mKFwiTVNJRVwiKSxhYj0tMSE9SGEuaW5kZXhPZihcIkdlY2tvXCIpJiYtMT09SGEudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwid2Via2l0XCIpJiYhKC0xIT1IYS5pbmRleE9mKFwiVHJpZGVudFwiKXx8LTEhPUhhLmluZGV4T2YoXCJNU0lFXCIpKSxiYj0tMSE9SGEudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwid2Via2l0XCIpO1xuKGZ1bmN0aW9uKCl7dmFyIGE9XCJcIixiO2lmKFphJiZhYS5vcGVyYSlyZXR1cm4gYT1hYS5vcGVyYS52ZXJzaW9uLGhhKGEpP2EoKTphO2FiP2I9L3J2XFw6KFteXFwpO10rKShcXCl8OykvOiRhP2I9L1xcYig/Ok1TSUV8cnYpWzogXShbXlxcKTtdKykoXFwpfDspLzpiYiYmKGI9L1dlYktpdFxcLyhcXFMrKS8pO2ImJihhPShhPWIuZXhlYyhIYSkpP2FbMV06XCJcIik7cmV0dXJuICRhJiYoYj0oYj1hYS5kb2N1bWVudCk/Yi5kb2N1bWVudE1vZGU6dm9pZCAwLGI+cGFyc2VGbG9hdChhKSk/U3RyaW5nKGIpOmF9KSgpO3ZhciBjYj1udWxsLGRiPW51bGwsZWI9bnVsbDtmdW5jdGlvbiBmYihhLGIpe2lmKCFmYShhKSl0aHJvdyBFcnJvcihcImVuY29kZUJ5dGVBcnJheSB0YWtlcyBhbiBhcnJheSBhcyBhIHBhcmFtZXRlclwiKTtnYigpO2Zvcih2YXIgYz1iP2RiOmNiLGQ9W10sZT0wO2U8YS5sZW5ndGg7ZSs9Myl7dmFyIGY9YVtlXSxnPWUrMTxhLmxlbmd0aCxrPWc/YVtlKzFdOjAsbD1lKzI8YS5sZW5ndGgsbT1sP2FbZSsyXTowLHY9Zj4+MixmPShmJjMpPDw0fGs+PjQsaz0oayYxNSk8PDJ8bT4+NixtPW0mNjM7bHx8KG09NjQsZ3x8KGs9NjQpKTtkLnB1c2goY1t2XSxjW2ZdLGNba10sY1ttXSl9cmV0dXJuIGQuam9pbihcIlwiKX1cbmZ1bmN0aW9uIGdiKCl7aWYoIWNiKXtjYj17fTtkYj17fTtlYj17fTtmb3IodmFyIGE9MDs2NT5hO2ErKyljYlthXT1cIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCIuY2hhckF0KGEpLGRiW2FdPVwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODktXy5cIi5jaGFyQXQoYSksZWJbZGJbYV1dPWEsNjI8PWEmJihlYltcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCIuY2hhckF0KGEpXT1hKX19O2Z1bmN0aW9uIHUoYSxiKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsYil9ZnVuY3Rpb24gdyhhLGIpe2lmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhLGIpKXJldHVybiBhW2JdfWZ1bmN0aW9uIGhiKGEsYil7Zm9yKHZhciBjIGluIGEpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsYykmJmIoYyxhW2NdKX1mdW5jdGlvbiBpYihhKXt2YXIgYj17fTtoYihhLGZ1bmN0aW9uKGEsZCl7YlthXT1kfSk7cmV0dXJuIGJ9O2Z1bmN0aW9uIGpiKGEpe3ZhciBiPVtdO2hiKGEsZnVuY3Rpb24oYSxkKXtlYShkKT9PYShkLGZ1bmN0aW9uKGQpe2IucHVzaChlbmNvZGVVUklDb21wb25lbnQoYSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGQpKX0pOmIucHVzaChlbmNvZGVVUklDb21wb25lbnQoYSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGQpKX0pO3JldHVybiBiLmxlbmd0aD9cIiZcIitiLmpvaW4oXCImXCIpOlwiXCJ9ZnVuY3Rpb24ga2IoYSl7dmFyIGI9e307YT1hLnJlcGxhY2UoL15cXD8vLFwiXCIpLnNwbGl0KFwiJlwiKTtPYShhLGZ1bmN0aW9uKGEpe2EmJihhPWEuc3BsaXQoXCI9XCIpLGJbYVswXV09YVsxXSl9KTtyZXR1cm4gYn07ZnVuY3Rpb24geChhLGIsYyxkKXt2YXIgZTtkPGI/ZT1cImF0IGxlYXN0IFwiK2I6ZD5jJiYoZT0wPT09Yz9cIm5vbmVcIjpcIm5vIG1vcmUgdGhhbiBcIitjKTtpZihlKXRocm93IEVycm9yKGErXCIgZmFpbGVkOiBXYXMgY2FsbGVkIHdpdGggXCIrZCsoMT09PWQ/XCIgYXJndW1lbnQuXCI6XCIgYXJndW1lbnRzLlwiKStcIiBFeHBlY3RzIFwiK2UrXCIuXCIpO31mdW5jdGlvbiB6KGEsYixjKXt2YXIgZD1cIlwiO3N3aXRjaChiKXtjYXNlIDE6ZD1jP1wiZmlyc3RcIjpcIkZpcnN0XCI7YnJlYWs7Y2FzZSAyOmQ9Yz9cInNlY29uZFwiOlwiU2Vjb25kXCI7YnJlYWs7Y2FzZSAzOmQ9Yz9cInRoaXJkXCI6XCJUaGlyZFwiO2JyZWFrO2Nhc2UgNDpkPWM/XCJmb3VydGhcIjpcIkZvdXJ0aFwiO2JyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IoXCJlcnJvclByZWZpeCBjYWxsZWQgd2l0aCBhcmd1bWVudE51bWJlciA+IDQuICBOZWVkIHRvIHVwZGF0ZSBpdD9cIik7fXJldHVybiBhPWErXCIgZmFpbGVkOiBcIisoZCtcIiBhcmd1bWVudCBcIil9XG5mdW5jdGlvbiBBKGEsYixjLGQpe2lmKCghZHx8bihjKSkmJiFoYShjKSl0aHJvdyBFcnJvcih6KGEsYixkKStcIm11c3QgYmUgYSB2YWxpZCBmdW5jdGlvbi5cIik7fWZ1bmN0aW9uIGxiKGEsYixjKXtpZihuKGMpJiYoIWlhKGMpfHxudWxsPT09YykpdGhyb3cgRXJyb3IoeihhLGIsITApK1wibXVzdCBiZSBhIHZhbGlkIGNvbnRleHQgb2JqZWN0LlwiKTt9O2Z1bmN0aW9uIG1iKGEpe3JldHVyblwidW5kZWZpbmVkXCIhPT10eXBlb2YgSlNPTiYmbihKU09OLnBhcnNlKT9KU09OLnBhcnNlKGEpOkFhKGEpfWZ1bmN0aW9uIEIoYSl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBKU09OJiZuKEpTT04uc3RyaW5naWZ5KSlhPUpTT04uc3RyaW5naWZ5KGEpO2Vsc2V7dmFyIGI9W107Q2EobmV3IEJhLGEsYik7YT1iLmpvaW4oXCJcIil9cmV0dXJuIGF9O2Z1bmN0aW9uIG5iKCl7dGhpcy5TZD1DfW5iLnByb3RvdHlwZS5qPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlNkLm9hKGEpfTtuYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5TZC50b1N0cmluZygpfTtmdW5jdGlvbiBvYigpe31vYi5wcm90b3R5cGUucGY9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07b2IucHJvdG90eXBlLnhlPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O3ZhciBwYj1uZXcgb2I7ZnVuY3Rpb24gcWIoYSxiLGMpe3RoaXMuUWY9YTt0aGlzLkthPWI7dGhpcy5IZD1jfXFiLnByb3RvdHlwZS5wZj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLkthLkQ7aWYocmIoYixhKSlyZXR1cm4gYi5qKCkuTShhKTtiPW51bGwhPXRoaXMuSGQ/bmV3IHNiKHRoaXMuSGQsITAsITEpOnRoaXMuS2EudSgpO3JldHVybiB0aGlzLlFmLlhhKGEsYil9O3FiLnByb3RvdHlwZS54ZT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9bnVsbCE9dGhpcy5IZD90aGlzLkhkOnRiKHRoaXMuS2EpO2E9dGhpcy5RZi5tZShkLGIsMSxjLGEpO3JldHVybiAwPT09YS5sZW5ndGg/bnVsbDphWzBdfTtmdW5jdGlvbiB1Yigpe3RoaXMudGI9W119ZnVuY3Rpb24gdmIoYSxiKXtmb3IodmFyIGM9bnVsbCxkPTA7ZDxiLmxlbmd0aDtkKyspe3ZhciBlPWJbZF0sZj1lLlliKCk7bnVsbD09PWN8fGYuWihjLlliKCkpfHwoYS50Yi5wdXNoKGMpLGM9bnVsbCk7bnVsbD09PWMmJihjPW5ldyB3YihmKSk7Yy5hZGQoZSl9YyYmYS50Yi5wdXNoKGMpfWZ1bmN0aW9uIHhiKGEsYixjKXt2YihhLGMpO3liKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGEuWihiKX0pfWZ1bmN0aW9uIHpiKGEsYixjKXt2YihhLGMpO3liKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGEuY29udGFpbnMoYil8fGIuY29udGFpbnMoYSl9KX1cbmZ1bmN0aW9uIHliKGEsYil7Zm9yKHZhciBjPSEwLGQ9MDtkPGEudGIubGVuZ3RoO2QrKyl7dmFyIGU9YS50YltkXTtpZihlKWlmKGU9ZS5ZYigpLGIoZSkpe2Zvcih2YXIgZT1hLnRiW2RdLGY9MDtmPGUuc2QubGVuZ3RoO2YrKyl7dmFyIGc9ZS5zZFtmXTtpZihudWxsIT09Zyl7ZS5zZFtmXT1udWxsO3ZhciBrPWcuVWIoKTtBYiYmQmIoXCJldmVudDogXCIrZy50b1N0cmluZygpKTtDYihrKX19YS50YltkXT1udWxsfWVsc2UgYz0hMX1jJiYoYS50Yj1bXSl9ZnVuY3Rpb24gd2IoYSl7dGhpcy5xYT1hO3RoaXMuc2Q9W119d2IucHJvdG90eXBlLmFkZD1mdW5jdGlvbihhKXt0aGlzLnNkLnB1c2goYSl9O3diLnByb3RvdHlwZS5ZYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnFhfTtmdW5jdGlvbiBEKGEsYixjLGQpe3RoaXMudHlwZT1hO3RoaXMuSmE9Yjt0aGlzLllhPWM7dGhpcy5KZT1kO3RoaXMuTmQ9dm9pZCAwfWZ1bmN0aW9uIERiKGEpe3JldHVybiBuZXcgRChFYixhKX12YXIgRWI9XCJ2YWx1ZVwiO2Z1bmN0aW9uIEZiKGEsYixjLGQpe3RoaXMudGU9Yjt0aGlzLldkPWM7dGhpcy5OZD1kO3RoaXMucmQ9YX1GYi5wcm90b3R5cGUuWWI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLldkLmxjKCk7cmV0dXJuXCJ2YWx1ZVwiPT09dGhpcy5yZD9hLnBhdGg6YS5wYXJlbnQoKS5wYXRofTtGYi5wcm90b3R5cGUueWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZH07RmIucHJvdG90eXBlLlViPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGUuVWIodGhpcyl9O0ZiLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLlliKCkudG9TdHJpbmcoKStcIjpcIit0aGlzLnJkK1wiOlwiK0IodGhpcy5XZC5sZigpKX07ZnVuY3Rpb24gR2IoYSxiLGMpe3RoaXMudGU9YTt0aGlzLmVycm9yPWI7dGhpcy5wYXRoPWN9R2IucHJvdG90eXBlLlliPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF0aH07R2IucHJvdG90eXBlLnllPWZ1bmN0aW9uKCl7cmV0dXJuXCJjYW5jZWxcIn07XG5HYi5wcm90b3R5cGUuVWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50ZS5VYih0aGlzKX07R2IucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF0aC50b1N0cmluZygpK1wiOmNhbmNlbFwifTtmdW5jdGlvbiBzYihhLGIsYyl7dGhpcy5CPWE7dGhpcy4kPWI7dGhpcy5UYj1jfWZ1bmN0aW9uIEhiKGEpe3JldHVybiBhLiR9ZnVuY3Rpb24gcmIoYSxiKXtyZXR1cm4gYS4kJiYhYS5UYnx8YS5CLkhhKGIpfXNiLnByb3RvdHlwZS5qPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuQn07ZnVuY3Rpb24gSWIoYSl7dGhpcy5kZz1hO3RoaXMuQWQ9bnVsbH1JYi5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5kZy5nZXQoKSxiPXhhKGEpO2lmKHRoaXMuQWQpZm9yKHZhciBjIGluIHRoaXMuQWQpYltjXS09dGhpcy5BZFtjXTt0aGlzLkFkPWE7cmV0dXJuIGJ9O2Z1bmN0aW9uIEpiKGEsYil7dGhpcy5NZj17fTt0aGlzLllkPW5ldyBJYihhKTt0aGlzLmNhPWI7dmFyIGM9MUU0KzJFNCpNYXRoLnJhbmRvbSgpO3NldFRpbWVvdXQocSh0aGlzLkhmLHRoaXMpLE1hdGguZmxvb3IoYykpfUpiLnByb3RvdHlwZS5IZj1mdW5jdGlvbigpe3ZhciBhPXRoaXMuWWQuZ2V0KCksYj17fSxjPSExLGQ7Zm9yKGQgaW4gYSkwPGFbZF0mJnUodGhpcy5NZixkKSYmKGJbZF09YVtkXSxjPSEwKTtjJiZ0aGlzLmNhLlRlKGIpO3NldFRpbWVvdXQocSh0aGlzLkhmLHRoaXMpLE1hdGguZmxvb3IoNkU1Kk1hdGgucmFuZG9tKCkpKX07ZnVuY3Rpb24gS2IoKXt0aGlzLkRjPXt9fWZ1bmN0aW9uIExiKGEsYixjKXtuKGMpfHwoYz0xKTt1KGEuRGMsYil8fChhLkRjW2JdPTApO2EuRGNbYl0rPWN9S2IucHJvdG90eXBlLmdldD1mdW5jdGlvbigpe3JldHVybiB4YSh0aGlzLkRjKX07dmFyIE1iPXt9LE5iPXt9O2Z1bmN0aW9uIE9iKGEpe2E9YS50b1N0cmluZygpO01iW2FdfHwoTWJbYV09bmV3IEtiKTtyZXR1cm4gTWJbYV19ZnVuY3Rpb24gUGIoYSxiKXt2YXIgYz1hLnRvU3RyaW5nKCk7TmJbY118fChOYltjXT1iKCkpO3JldHVybiBOYltjXX07ZnVuY3Rpb24gRShhLGIpe3RoaXMubmFtZT1hO3RoaXMuUz1ifWZ1bmN0aW9uIFFiKGEsYil7cmV0dXJuIG5ldyBFKGEsYil9O2Z1bmN0aW9uIFJiKGEsYil7cmV0dXJuIFNiKGEubmFtZSxiLm5hbWUpfWZ1bmN0aW9uIFRiKGEsYil7cmV0dXJuIFNiKGEsYil9O2Z1bmN0aW9uIFViKGEsYixjKXt0aGlzLnR5cGU9VmI7dGhpcy5zb3VyY2U9YTt0aGlzLnBhdGg9Yjt0aGlzLklhPWN9VWIucHJvdG90eXBlLldjPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnBhdGguZSgpP25ldyBVYih0aGlzLnNvdXJjZSxGLHRoaXMuSWEuTShhKSk6bmV3IFViKHRoaXMuc291cmNlLEcodGhpcy5wYXRoKSx0aGlzLklhKX07VWIucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJPcGVyYXRpb24oXCIrdGhpcy5wYXRoK1wiOiBcIit0aGlzLnNvdXJjZS50b1N0cmluZygpK1wiIG92ZXJ3cml0ZTogXCIrdGhpcy5JYS50b1N0cmluZygpK1wiKVwifTtmdW5jdGlvbiBXYihhLGIpe3RoaXMudHlwZT1YYjt0aGlzLnNvdXJjZT1ZYjt0aGlzLnBhdGg9YTt0aGlzLlZlPWJ9V2IucHJvdG90eXBlLldjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF0aC5lKCk/dGhpczpuZXcgV2IoRyh0aGlzLnBhdGgpLHRoaXMuVmUpfTtXYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIk9wZXJhdGlvbihcIit0aGlzLnBhdGgrXCI6IFwiK3RoaXMuc291cmNlLnRvU3RyaW5nKCkrXCIgYWNrIHdyaXRlIHJldmVydD1cIit0aGlzLlZlK1wiKVwifTtmdW5jdGlvbiBaYihhLGIpe3RoaXMudHlwZT0kYjt0aGlzLnNvdXJjZT1hO3RoaXMucGF0aD1ifVpiLnByb3RvdHlwZS5XYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnBhdGguZSgpP25ldyBaYih0aGlzLnNvdXJjZSxGKTpuZXcgWmIodGhpcy5zb3VyY2UsRyh0aGlzLnBhdGgpKX07WmIucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuXCJPcGVyYXRpb24oXCIrdGhpcy5wYXRoK1wiOiBcIit0aGlzLnNvdXJjZS50b1N0cmluZygpK1wiIGxpc3Rlbl9jb21wbGV0ZSlcIn07ZnVuY3Rpb24gYWMoYSxiKXt0aGlzLkxhPWE7dGhpcy54YT1iP2I6YmN9aD1hYy5wcm90b3R5cGU7aC5OYT1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgYWModGhpcy5MYSx0aGlzLnhhLk5hKGEsYix0aGlzLkxhKS5YKG51bGwsbnVsbCwhMSxudWxsLG51bGwpKX07aC5yZW1vdmU9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBhYyh0aGlzLkxhLHRoaXMueGEucmVtb3ZlKGEsdGhpcy5MYSkuWChudWxsLG51bGwsITEsbnVsbCxudWxsKSl9O2guZ2V0PWZ1bmN0aW9uKGEpe2Zvcih2YXIgYixjPXRoaXMueGE7IWMuZSgpOyl7Yj10aGlzLkxhKGEsYy5rZXkpO2lmKDA9PT1iKXJldHVybiBjLnZhbHVlOzA+Yj9jPWMubGVmdDowPGImJihjPWMucmlnaHQpfXJldHVybiBudWxsfTtcbmZ1bmN0aW9uIGNjKGEsYil7Zm9yKHZhciBjLGQ9YS54YSxlPW51bGw7IWQuZSgpOyl7Yz1hLkxhKGIsZC5rZXkpO2lmKDA9PT1jKXtpZihkLmxlZnQuZSgpKXJldHVybiBlP2Uua2V5Om51bGw7Zm9yKGQ9ZC5sZWZ0OyFkLnJpZ2h0LmUoKTspZD1kLnJpZ2h0O3JldHVybiBkLmtleX0wPmM/ZD1kLmxlZnQ6MDxjJiYoZT1kLGQ9ZC5yaWdodCl9dGhyb3cgRXJyb3IoXCJBdHRlbXB0ZWQgdG8gZmluZCBwcmVkZWNlc3NvciBrZXkgZm9yIGEgbm9uZXhpc3RlbnQga2V5LiAgV2hhdCBnaXZlcz9cIik7fWguZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnhhLmUoKX07aC5jb3VudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnhhLmNvdW50KCl9O2guUmM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54YS5SYygpfTtoLmVjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueGEuZWMoKX07aC5oYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy54YS5oYShhKX07XG5oLldiPWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgZGModGhpcy54YSxudWxsLHRoaXMuTGEsITEsYSl9O2guWGI9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGRjKHRoaXMueGEsYSx0aGlzLkxhLCExLGIpfTtoLlpiPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBkYyh0aGlzLnhhLGEsdGhpcy5MYSwhMCxiKX07aC5yZj1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IGRjKHRoaXMueGEsbnVsbCx0aGlzLkxhLCEwLGEpfTtmdW5jdGlvbiBkYyhhLGIsYyxkLGUpe3RoaXMuUmQ9ZXx8bnVsbDt0aGlzLkVlPWQ7dGhpcy5QYT1bXTtmb3IoZT0xOyFhLmUoKTspaWYoZT1iP2MoYS5rZXksYik6MSxkJiYoZSo9LTEpLDA+ZSlhPXRoaXMuRWU/YS5sZWZ0OmEucmlnaHQ7ZWxzZSBpZigwPT09ZSl7dGhpcy5QYS5wdXNoKGEpO2JyZWFrfWVsc2UgdGhpcy5QYS5wdXNoKGEpLGE9dGhpcy5FZT9hLnJpZ2h0OmEubGVmdH1cbmZ1bmN0aW9uIEgoYSl7aWYoMD09PWEuUGEubGVuZ3RoKXJldHVybiBudWxsO3ZhciBiPWEuUGEucG9wKCksYztjPWEuUmQ/YS5SZChiLmtleSxiLnZhbHVlKTp7a2V5OmIua2V5LHZhbHVlOmIudmFsdWV9O2lmKGEuRWUpZm9yKGI9Yi5sZWZ0OyFiLmUoKTspYS5QYS5wdXNoKGIpLGI9Yi5yaWdodDtlbHNlIGZvcihiPWIucmlnaHQ7IWIuZSgpOylhLlBhLnB1c2goYiksYj1iLmxlZnQ7cmV0dXJuIGN9ZnVuY3Rpb24gZWMoYSl7aWYoMD09PWEuUGEubGVuZ3RoKXJldHVybiBudWxsO3ZhciBiO2I9YS5QYTtiPWJbYi5sZW5ndGgtMV07cmV0dXJuIGEuUmQ/YS5SZChiLmtleSxiLnZhbHVlKTp7a2V5OmIua2V5LHZhbHVlOmIudmFsdWV9fWZ1bmN0aW9uIGZjKGEsYixjLGQsZSl7dGhpcy5rZXk9YTt0aGlzLnZhbHVlPWI7dGhpcy5jb2xvcj1udWxsIT1jP2M6ITA7dGhpcy5sZWZ0PW51bGwhPWQ/ZDpiYzt0aGlzLnJpZ2h0PW51bGwhPWU/ZTpiY31oPWZjLnByb3RvdHlwZTtcbmguWD1mdW5jdGlvbihhLGIsYyxkLGUpe3JldHVybiBuZXcgZmMobnVsbCE9YT9hOnRoaXMua2V5LG51bGwhPWI/Yjp0aGlzLnZhbHVlLG51bGwhPWM/Yzp0aGlzLmNvbG9yLG51bGwhPWQ/ZDp0aGlzLmxlZnQsbnVsbCE9ZT9lOnRoaXMucmlnaHQpfTtoLmNvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubGVmdC5jb3VudCgpKzErdGhpcy5yaWdodC5jb3VudCgpfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5oYT1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5sZWZ0LmhhKGEpfHxhKHRoaXMua2V5LHRoaXMudmFsdWUpfHx0aGlzLnJpZ2h0LmhhKGEpfTtmdW5jdGlvbiBnYyhhKXtyZXR1cm4gYS5sZWZ0LmUoKT9hOmdjKGEubGVmdCl9aC5SYz1mdW5jdGlvbigpe3JldHVybiBnYyh0aGlzKS5rZXl9O2guZWM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yaWdodC5lKCk/dGhpcy5rZXk6dGhpcy5yaWdodC5lYygpfTtcbmguTmE9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGU7ZT10aGlzO2Q9YyhhLGUua2V5KTtlPTA+ZD9lLlgobnVsbCxudWxsLG51bGwsZS5sZWZ0Lk5hKGEsYixjKSxudWxsKTowPT09ZD9lLlgobnVsbCxiLG51bGwsbnVsbCxudWxsKTplLlgobnVsbCxudWxsLG51bGwsbnVsbCxlLnJpZ2h0Lk5hKGEsYixjKSk7cmV0dXJuIGhjKGUpfTtmdW5jdGlvbiBpYyhhKXtpZihhLmxlZnQuZSgpKXJldHVybiBiYzthLmxlZnQuZmEoKXx8YS5sZWZ0LmxlZnQuZmEoKXx8KGE9amMoYSkpO2E9YS5YKG51bGwsbnVsbCxudWxsLGljKGEubGVmdCksbnVsbCk7cmV0dXJuIGhjKGEpfVxuaC5yZW1vdmU9ZnVuY3Rpb24oYSxiKXt2YXIgYyxkO2M9dGhpcztpZigwPmIoYSxjLmtleSkpYy5sZWZ0LmUoKXx8Yy5sZWZ0LmZhKCl8fGMubGVmdC5sZWZ0LmZhKCl8fChjPWpjKGMpKSxjPWMuWChudWxsLG51bGwsbnVsbCxjLmxlZnQucmVtb3ZlKGEsYiksbnVsbCk7ZWxzZXtjLmxlZnQuZmEoKSYmKGM9a2MoYykpO2MucmlnaHQuZSgpfHxjLnJpZ2h0LmZhKCl8fGMucmlnaHQubGVmdC5mYSgpfHwoYz1sYyhjKSxjLmxlZnQubGVmdC5mYSgpJiYoYz1rYyhjKSxjPWxjKGMpKSk7aWYoMD09PWIoYSxjLmtleSkpe2lmKGMucmlnaHQuZSgpKXJldHVybiBiYztkPWdjKGMucmlnaHQpO2M9Yy5YKGQua2V5LGQudmFsdWUsbnVsbCxudWxsLGljKGMucmlnaHQpKX1jPWMuWChudWxsLG51bGwsbnVsbCxudWxsLGMucmlnaHQucmVtb3ZlKGEsYikpfXJldHVybiBoYyhjKX07aC5mYT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmNvbG9yfTtcbmZ1bmN0aW9uIGhjKGEpe2EucmlnaHQuZmEoKSYmIWEubGVmdC5mYSgpJiYoYT1tYyhhKSk7YS5sZWZ0LmZhKCkmJmEubGVmdC5sZWZ0LmZhKCkmJihhPWtjKGEpKTthLmxlZnQuZmEoKSYmYS5yaWdodC5mYSgpJiYoYT1sYyhhKSk7cmV0dXJuIGF9ZnVuY3Rpb24gamMoYSl7YT1sYyhhKTthLnJpZ2h0LmxlZnQuZmEoKSYmKGE9YS5YKG51bGwsbnVsbCxudWxsLG51bGwsa2MoYS5yaWdodCkpLGE9bWMoYSksYT1sYyhhKSk7cmV0dXJuIGF9ZnVuY3Rpb24gbWMoYSl7cmV0dXJuIGEucmlnaHQuWChudWxsLG51bGwsYS5jb2xvcixhLlgobnVsbCxudWxsLCEwLG51bGwsYS5yaWdodC5sZWZ0KSxudWxsKX1mdW5jdGlvbiBrYyhhKXtyZXR1cm4gYS5sZWZ0LlgobnVsbCxudWxsLGEuY29sb3IsbnVsbCxhLlgobnVsbCxudWxsLCEwLGEubGVmdC5yaWdodCxudWxsKSl9XG5mdW5jdGlvbiBsYyhhKXtyZXR1cm4gYS5YKG51bGwsbnVsbCwhYS5jb2xvcixhLmxlZnQuWChudWxsLG51bGwsIWEubGVmdC5jb2xvcixudWxsLG51bGwpLGEucmlnaHQuWChudWxsLG51bGwsIWEucmlnaHQuY29sb3IsbnVsbCxudWxsKSl9ZnVuY3Rpb24gbmMoKXt9aD1uYy5wcm90b3R5cGU7aC5YPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O2guTmE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGZjKGEsYixudWxsKX07aC5yZW1vdmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307aC5jb3VudD1mdW5jdGlvbigpe3JldHVybiAwfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC5oYT1mdW5jdGlvbigpe3JldHVybiExfTtoLlJjPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O2guZWM9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07aC5mYT1mdW5jdGlvbigpe3JldHVybiExfTt2YXIgYmM9bmV3IG5jO2Z1bmN0aW9uIG9jKGEsYil7cmV0dXJuIGEmJlwib2JqZWN0XCI9PT10eXBlb2YgYT8oSihcIi5zdlwiaW4gYSxcIlVuZXhwZWN0ZWQgbGVhZiBub2RlIG9yIHByaW9yaXR5IGNvbnRlbnRzXCIpLGJbYVtcIi5zdlwiXV0pOmF9ZnVuY3Rpb24gcGMoYSxiKXt2YXIgYz1uZXcgcWM7cmMoYSxuZXcgSyhcIlwiKSxmdW5jdGlvbihhLGUpe2MubWMoYSxzYyhlLGIpKX0pO3JldHVybiBjfWZ1bmN0aW9uIHNjKGEsYil7dmFyIGM9YS5BKCkuSygpLGM9b2MoYyxiKSxkO2lmKGEuTigpKXt2YXIgZT1vYyhhLkJhKCksYik7cmV0dXJuIGUhPT1hLkJhKCl8fGMhPT1hLkEoKS5LKCk/bmV3IHRjKGUsTChjKSk6YX1kPWE7YyE9PWEuQSgpLksoKSYmKGQ9ZC5kYShuZXcgdGMoYykpKTthLlUoTSxmdW5jdGlvbihhLGMpe3ZhciBlPXNjKGMsYik7ZSE9PWMmJihkPWQuUShhLGUpKX0pO3JldHVybiBkfTtmdW5jdGlvbiBLKGEsYil7aWYoMT09YXJndW1lbnRzLmxlbmd0aCl7dGhpcy5vPWEuc3BsaXQoXCIvXCIpO2Zvcih2YXIgYz0wLGQ9MDtkPHRoaXMuby5sZW5ndGg7ZCsrKTA8dGhpcy5vW2RdLmxlbmd0aCYmKHRoaXMub1tjXT10aGlzLm9bZF0sYysrKTt0aGlzLm8ubGVuZ3RoPWM7dGhpcy5ZPTB9ZWxzZSB0aGlzLm89YSx0aGlzLlk9Yn1mdW5jdGlvbiBOKGEsYil7dmFyIGM9TyhhKTtpZihudWxsPT09YylyZXR1cm4gYjtpZihjPT09TyhiKSlyZXR1cm4gTihHKGEpLEcoYikpO3Rocm93IEVycm9yKFwiSU5URVJOQUwgRVJST1I6IGlubmVyUGF0aCAoXCIrYitcIikgaXMgbm90IHdpdGhpbiBvdXRlclBhdGggKFwiK2ErXCIpXCIpO31mdW5jdGlvbiBPKGEpe3JldHVybiBhLlk+PWEuby5sZW5ndGg/bnVsbDphLm9bYS5ZXX1mdW5jdGlvbiB1YyhhKXtyZXR1cm4gYS5vLmxlbmd0aC1hLll9XG5mdW5jdGlvbiBHKGEpe3ZhciBiPWEuWTtiPGEuby5sZW5ndGgmJmIrKztyZXR1cm4gbmV3IEsoYS5vLGIpfWZ1bmN0aW9uIHZjKGEpe3JldHVybiBhLlk8YS5vLmxlbmd0aD9hLm9bYS5vLmxlbmd0aC0xXTpudWxsfWg9Sy5wcm90b3R5cGU7aC50b1N0cmluZz1mdW5jdGlvbigpe2Zvcih2YXIgYT1cIlwiLGI9dGhpcy5ZO2I8dGhpcy5vLmxlbmd0aDtiKyspXCJcIiE9PXRoaXMub1tiXSYmKGErPVwiL1wiK3RoaXMub1tiXSk7cmV0dXJuIGF8fFwiL1wifTtoLnNsaWNlPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLm8uc2xpY2UodGhpcy5ZKyhhfHwwKSl9O2gucGFyZW50PWZ1bmN0aW9uKCl7aWYodGhpcy5ZPj10aGlzLm8ubGVuZ3RoKXJldHVybiBudWxsO2Zvcih2YXIgYT1bXSxiPXRoaXMuWTtiPHRoaXMuby5sZW5ndGgtMTtiKyspYS5wdXNoKHRoaXMub1tiXSk7cmV0dXJuIG5ldyBLKGEsMCl9O1xuaC53PWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj1bXSxjPXRoaXMuWTtjPHRoaXMuby5sZW5ndGg7YysrKWIucHVzaCh0aGlzLm9bY10pO2lmKGEgaW5zdGFuY2VvZiBLKWZvcihjPWEuWTtjPGEuby5sZW5ndGg7YysrKWIucHVzaChhLm9bY10pO2Vsc2UgZm9yKGE9YS5zcGxpdChcIi9cIiksYz0wO2M8YS5sZW5ndGg7YysrKTA8YVtjXS5sZW5ndGgmJmIucHVzaChhW2NdKTtyZXR1cm4gbmV3IEsoYiwwKX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuWT49dGhpcy5vLmxlbmd0aH07aC5aPWZ1bmN0aW9uKGEpe2lmKHVjKHRoaXMpIT09dWMoYSkpcmV0dXJuITE7Zm9yKHZhciBiPXRoaXMuWSxjPWEuWTtiPD10aGlzLm8ubGVuZ3RoO2IrKyxjKyspaWYodGhpcy5vW2JdIT09YS5vW2NdKXJldHVybiExO3JldHVybiEwfTtcbmguY29udGFpbnM9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5ZLGM9YS5ZO2lmKHVjKHRoaXMpPnVjKGEpKXJldHVybiExO2Zvcig7Yjx0aGlzLm8ubGVuZ3RoOyl7aWYodGhpcy5vW2JdIT09YS5vW2NdKXJldHVybiExOysrYjsrK2N9cmV0dXJuITB9O3ZhciBGPW5ldyBLKFwiXCIpO2Z1bmN0aW9uIHdjKGEsYil7dGhpcy5RYT1hLnNsaWNlKCk7dGhpcy5FYT1NYXRoLm1heCgxLHRoaXMuUWEubGVuZ3RoKTt0aGlzLmtmPWI7Zm9yKHZhciBjPTA7Yzx0aGlzLlFhLmxlbmd0aDtjKyspdGhpcy5FYSs9eGModGhpcy5RYVtjXSk7eWModGhpcyl9d2MucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oYSl7MDx0aGlzLlFhLmxlbmd0aCYmKHRoaXMuRWErPTEpO3RoaXMuUWEucHVzaChhKTt0aGlzLkVhKz14YyhhKTt5Yyh0aGlzKX07d2MucHJvdG90eXBlLnBvcD1mdW5jdGlvbigpe3ZhciBhPXRoaXMuUWEucG9wKCk7dGhpcy5FYS09eGMoYSk7MDx0aGlzLlFhLmxlbmd0aCYmLS10aGlzLkVhfTtcbmZ1bmN0aW9uIHljKGEpe2lmKDc2ODxhLkVhKXRocm93IEVycm9yKGEua2YrXCJoYXMgYSBrZXkgcGF0aCBsb25nZXIgdGhhbiA3NjggYnl0ZXMgKFwiK2EuRWErXCIpLlwiKTtpZigzMjxhLlFhLmxlbmd0aCl0aHJvdyBFcnJvcihhLmtmK1wicGF0aCBzcGVjaWZpZWQgZXhjZWVkcyB0aGUgbWF4aW11bSBkZXB0aCB0aGF0IGNhbiBiZSB3cml0dGVuICgzMikgb3Igb2JqZWN0IGNvbnRhaW5zIGEgY3ljbGUgXCIremMoYSkpO31mdW5jdGlvbiB6YyhhKXtyZXR1cm4gMD09YS5RYS5sZW5ndGg/XCJcIjpcImluIHByb3BlcnR5ICdcIithLlFhLmpvaW4oXCIuXCIpK1wiJ1wifTtmdW5jdGlvbiBBYygpe3RoaXMud2M9e319QWMucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe251bGw9PWI/ZGVsZXRlIHRoaXMud2NbYV06dGhpcy53Y1thXT1ifTtBYy5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKGEpe3JldHVybiB1KHRoaXMud2MsYSk/dGhpcy53Y1thXTpudWxsfTtBYy5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGEpe2RlbGV0ZSB0aGlzLndjW2FdfTtBYy5wcm90b3R5cGUudWY9ITA7ZnVuY3Rpb24gQmMoYSl7dGhpcy5FYz1hO3RoaXMuTWQ9XCJmaXJlYmFzZTpcIn1oPUJjLnByb3RvdHlwZTtoLnNldD1mdW5jdGlvbihhLGIpe251bGw9PWI/dGhpcy5FYy5yZW1vdmVJdGVtKHRoaXMuTWQrYSk6dGhpcy5FYy5zZXRJdGVtKHRoaXMuTWQrYSxCKGIpKX07aC5nZXQ9ZnVuY3Rpb24oYSl7YT10aGlzLkVjLmdldEl0ZW0odGhpcy5NZCthKTtyZXR1cm4gbnVsbD09YT9udWxsOm1iKGEpfTtoLnJlbW92ZT1mdW5jdGlvbihhKXt0aGlzLkVjLnJlbW92ZUl0ZW0odGhpcy5NZCthKX07aC51Zj0hMTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuRWMudG9TdHJpbmcoKX07ZnVuY3Rpb24gQ2MoYSl7dHJ5e2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvd1thXSl7dmFyIGI9d2luZG93W2FdO2Iuc2V0SXRlbShcImZpcmViYXNlOnNlbnRpbmVsXCIsXCJjYWNoZVwiKTtiLnJlbW92ZUl0ZW0oXCJmaXJlYmFzZTpzZW50aW5lbFwiKTtyZXR1cm4gbmV3IEJjKGIpfX1jYXRjaChjKXt9cmV0dXJuIG5ldyBBY312YXIgRGM9Q2MoXCJsb2NhbFN0b3JhZ2VcIiksUD1DYyhcInNlc3Npb25TdG9yYWdlXCIpO2Z1bmN0aW9uIEVjKGEsYixjLGQsZSl7dGhpcy5ob3N0PWEudG9Mb3dlckNhc2UoKTt0aGlzLmRvbWFpbj10aGlzLmhvc3Quc3Vic3RyKHRoaXMuaG9zdC5pbmRleE9mKFwiLlwiKSsxKTt0aGlzLmxiPWI7dGhpcy5DYj1jO3RoaXMuVGc9ZDt0aGlzLkxkPWV8fFwiXCI7dGhpcy5PYT1EYy5nZXQoXCJob3N0OlwiK2EpfHx0aGlzLmhvc3R9ZnVuY3Rpb24gRmMoYSxiKXtiIT09YS5PYSYmKGEuT2E9YixcInMtXCI9PT1hLk9hLnN1YnN0cigwLDIpJiZEYy5zZXQoXCJob3N0OlwiK2EuaG9zdCxhLk9hKSl9RWMucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7dmFyIGE9KHRoaXMubGI/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKSt0aGlzLmhvc3Q7dGhpcy5MZCYmKGErPVwiPFwiK3RoaXMuTGQrXCI+XCIpO3JldHVybiBhfTt2YXIgR2M9ZnVuY3Rpb24oKXt2YXIgYT0xO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBhKyt9fSgpO2Z1bmN0aW9uIEooYSxiKXtpZighYSl0aHJvdyBIYyhiKTt9ZnVuY3Rpb24gSGMoYSl7cmV0dXJuIEVycm9yKFwiRmlyZWJhc2UgKDIuMi40KSBJTlRFUk5BTCBBU1NFUlQgRkFJTEVEOiBcIithKX1cbmZ1bmN0aW9uIEljKGEpe3RyeXt2YXIgYjtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGF0b2IpYj1hdG9iKGEpO2Vsc2V7Z2IoKTtmb3IodmFyIGM9ZWIsZD1bXSxlPTA7ZTxhLmxlbmd0aDspe3ZhciBmPWNbYS5jaGFyQXQoZSsrKV0sZz1lPGEubGVuZ3RoP2NbYS5jaGFyQXQoZSldOjA7KytlO3ZhciBrPWU8YS5sZW5ndGg/Y1thLmNoYXJBdChlKV06NjQ7KytlO3ZhciBsPWU8YS5sZW5ndGg/Y1thLmNoYXJBdChlKV06NjQ7KytlO2lmKG51bGw9PWZ8fG51bGw9PWd8fG51bGw9PWt8fG51bGw9PWwpdGhyb3cgRXJyb3IoKTtkLnB1c2goZjw8MnxnPj40KTs2NCE9ayYmKGQucHVzaChnPDw0JjI0MHxrPj4yKSw2NCE9bCYmZC5wdXNoKGs8PDYmMTkyfGwpKX1pZig4MTkyPmQubGVuZ3RoKWI9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGQpO2Vsc2V7YT1cIlwiO2ZvcihjPTA7YzxkLmxlbmd0aDtjKz04MTkyKWErPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxXYShkLGMsXG5jKzgxOTIpKTtiPWF9fXJldHVybiBifWNhdGNoKG0pe0JiKFwiYmFzZTY0RGVjb2RlIGZhaWxlZDogXCIsbSl9cmV0dXJuIG51bGx9ZnVuY3Rpb24gSmMoYSl7dmFyIGI9S2MoYSk7YT1uZXcgTGE7YS51cGRhdGUoYik7dmFyIGI9W10sYz04KmEuYmU7NTY+YS4kYj9hLnVwZGF0ZShhLklkLDU2LWEuJGIpOmEudXBkYXRlKGEuSWQsYS5XYS0oYS4kYi01NikpO2Zvcih2YXIgZD1hLldhLTE7NTY8PWQ7ZC0tKWEubGVbZF09YyYyNTUsYy89MjU2O01hKGEsYS5sZSk7Zm9yKGQ9Yz0wOzU+ZDtkKyspZm9yKHZhciBlPTI0OzA8PWU7ZS09OCliW2NdPWEuUltkXT4+ZSYyNTUsKytjO3JldHVybiBmYihiKX1cbmZ1bmN0aW9uIExjKGEpe2Zvcih2YXIgYj1cIlwiLGM9MDtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKWI9ZmEoYXJndW1lbnRzW2NdKT9iK0xjLmFwcGx5KG51bGwsYXJndW1lbnRzW2NdKTpcIm9iamVjdFwiPT09dHlwZW9mIGFyZ3VtZW50c1tjXT9iK0IoYXJndW1lbnRzW2NdKTpiK2FyZ3VtZW50c1tjXSxiKz1cIiBcIjtyZXR1cm4gYn12YXIgQWI9bnVsbCxNYz0hMDtmdW5jdGlvbiBCYihhKXshMD09PU1jJiYoTWM9ITEsbnVsbD09PUFiJiYhMD09PVAuZ2V0KFwibG9nZ2luZ19lbmFibGVkXCIpJiZOYyghMCkpO2lmKEFiKXt2YXIgYj1MYy5hcHBseShudWxsLGFyZ3VtZW50cyk7QWIoYil9fWZ1bmN0aW9uIE9jKGEpe3JldHVybiBmdW5jdGlvbigpe0JiKGEsYXJndW1lbnRzKX19XG5mdW5jdGlvbiBQYyhhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUpe3ZhciBiPVwiRklSRUJBU0UgSU5URVJOQUwgRVJST1I6IFwiK0xjLmFwcGx5KG51bGwsYXJndW1lbnRzKTtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUuZXJyb3I/Y29uc29sZS5lcnJvcihiKTpjb25zb2xlLmxvZyhiKX19ZnVuY3Rpb24gUWMoYSl7dmFyIGI9TGMuYXBwbHkobnVsbCxhcmd1bWVudHMpO3Rocm93IEVycm9yKFwiRklSRUJBU0UgRkFUQUwgRVJST1I6IFwiK2IpO31mdW5jdGlvbiBRKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7dmFyIGI9XCJGSVJFQkFTRSBXQVJOSU5HOiBcIitMYy5hcHBseShudWxsLGFyZ3VtZW50cyk7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlLndhcm4/Y29uc29sZS53YXJuKGIpOmNvbnNvbGUubG9nKGIpfX1cbmZ1bmN0aW9uIFJjKGEpe3ZhciBiPVwiXCIsYz1cIlwiLGQ9XCJcIixlPVwiXCIsZj0hMCxnPVwiaHR0cHNcIixrPTQ0MztpZihwKGEpKXt2YXIgbD1hLmluZGV4T2YoXCIvL1wiKTswPD1sJiYoZz1hLnN1YnN0cmluZygwLGwtMSksYT1hLnN1YnN0cmluZyhsKzIpKTtsPWEuaW5kZXhPZihcIi9cIik7LTE9PT1sJiYobD1hLmxlbmd0aCk7Yj1hLnN1YnN0cmluZygwLGwpO2U9XCJcIjthPWEuc3Vic3RyaW5nKGwpLnNwbGl0KFwiL1wiKTtmb3IobD0wO2w8YS5sZW5ndGg7bCsrKWlmKDA8YVtsXS5sZW5ndGgpe3ZhciBtPWFbbF07dHJ5e209ZGVjb2RlVVJJQ29tcG9uZW50KG0ucmVwbGFjZSgvXFwrL2csXCIgXCIpKX1jYXRjaCh2KXt9ZSs9XCIvXCIrbX1hPWIuc3BsaXQoXCIuXCIpOzM9PT1hLmxlbmd0aD8oYz1hWzFdLGQ9YVswXS50b0xvd2VyQ2FzZSgpKToyPT09YS5sZW5ndGgmJihjPWFbMF0pO2w9Yi5pbmRleE9mKFwiOlwiKTswPD1sJiYoZj1cImh0dHBzXCI9PT1nfHxcIndzc1wiPT09ZyxrPWIuc3Vic3RyaW5nKGwrMSksaXNGaW5pdGUoaykmJlxuKGs9U3RyaW5nKGspKSxrPXAoayk/L15cXHMqLT8weC9pLnRlc3Qoayk/cGFyc2VJbnQoaywxNik6cGFyc2VJbnQoaywxMCk6TmFOKX1yZXR1cm57aG9zdDpiLHBvcnQ6ayxkb21haW46YyxRZzpkLGxiOmYsc2NoZW1lOmcsWmM6ZX19ZnVuY3Rpb24gU2MoYSl7cmV0dXJuIGdhKGEpJiYoYSE9YXx8YT09TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfHxhPT1OdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFkpfVxuZnVuY3Rpb24gVGMoYSl7aWYoXCJjb21wbGV0ZVwiPT09ZG9jdW1lbnQucmVhZHlTdGF0ZSlhKCk7ZWxzZXt2YXIgYj0hMSxjPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuYm9keT9ifHwoYj0hMCxhKCkpOnNldFRpbWVvdXQoYyxNYXRoLmZsb29yKDEwKSl9O2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/KGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsYywhMSksd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsYywhMSkpOmRvY3VtZW50LmF0dGFjaEV2ZW50JiYoZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIixmdW5jdGlvbigpe1wiY29tcGxldGVcIj09PWRvY3VtZW50LnJlYWR5U3RhdGUmJmMoKX0pLHdpbmRvdy5hdHRhY2hFdmVudChcIm9ubG9hZFwiLGMpKX19XG5mdW5jdGlvbiBTYihhLGIpe2lmKGE9PT1iKXJldHVybiAwO2lmKFwiW01JTl9OQU1FXVwiPT09YXx8XCJbTUFYX05BTUVdXCI9PT1iKXJldHVybi0xO2lmKFwiW01JTl9OQU1FXVwiPT09Ynx8XCJbTUFYX05BTUVdXCI9PT1hKXJldHVybiAxO3ZhciBjPVVjKGEpLGQ9VWMoYik7cmV0dXJuIG51bGwhPT1jP251bGwhPT1kPzA9PWMtZD9hLmxlbmd0aC1iLmxlbmd0aDpjLWQ6LTE6bnVsbCE9PWQ/MTphPGI/LTE6MX1mdW5jdGlvbiBWYyhhLGIpe2lmKGImJmEgaW4gYilyZXR1cm4gYlthXTt0aHJvdyBFcnJvcihcIk1pc3NpbmcgcmVxdWlyZWQga2V5IChcIithK1wiKSBpbiBvYmplY3Q6IFwiK0IoYikpO31cbmZ1bmN0aW9uIFdjKGEpe2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYXx8bnVsbD09PWEpcmV0dXJuIEIoYSk7dmFyIGI9W10sYztmb3IoYyBpbiBhKWIucHVzaChjKTtiLnNvcnQoKTtjPVwie1wiO2Zvcih2YXIgZD0wO2Q8Yi5sZW5ndGg7ZCsrKTAhPT1kJiYoYys9XCIsXCIpLGMrPUIoYltkXSksYys9XCI6XCIsYys9V2MoYVtiW2RdXSk7cmV0dXJuIGMrXCJ9XCJ9ZnVuY3Rpb24gWGMoYSxiKXtpZihhLmxlbmd0aDw9YilyZXR1cm5bYV07Zm9yKHZhciBjPVtdLGQ9MDtkPGEubGVuZ3RoO2QrPWIpZCtiPmE/Yy5wdXNoKGEuc3Vic3RyaW5nKGQsYS5sZW5ndGgpKTpjLnB1c2goYS5zdWJzdHJpbmcoZCxkK2IpKTtyZXR1cm4gY31mdW5jdGlvbiBZYyhhLGIpe2lmKGVhKGEpKWZvcih2YXIgYz0wO2M8YS5sZW5ndGg7KytjKWIoYyxhW2NdKTtlbHNlIHIoYSxiKX1cbmZ1bmN0aW9uIFpjKGEpe0ooIVNjKGEpLFwiSW52YWxpZCBKU09OIG51bWJlclwiKTt2YXIgYixjLGQsZTswPT09YT8oZD1jPTAsYj0tSW5maW5pdHk9PT0xL2E/MTowKTooYj0wPmEsYT1NYXRoLmFicyhhKSxhPj1NYXRoLnBvdygyLC0xMDIyKT8oZD1NYXRoLm1pbihNYXRoLmZsb29yKE1hdGgubG9nKGEpL01hdGguTE4yKSwxMDIzKSxjPWQrMTAyMyxkPU1hdGgucm91bmQoYSpNYXRoLnBvdygyLDUyLWQpLU1hdGgucG93KDIsNTIpKSk6KGM9MCxkPU1hdGgucm91bmQoYS9NYXRoLnBvdygyLC0xMDc0KSkpKTtlPVtdO2ZvcihhPTUyO2E7LS1hKWUucHVzaChkJTI/MTowKSxkPU1hdGguZmxvb3IoZC8yKTtmb3IoYT0xMTthOy0tYSllLnB1c2goYyUyPzE6MCksYz1NYXRoLmZsb29yKGMvMik7ZS5wdXNoKGI/MTowKTtlLnJldmVyc2UoKTtiPWUuam9pbihcIlwiKTtjPVwiXCI7Zm9yKGE9MDs2ND5hO2ErPTgpZD1wYXJzZUludChiLnN1YnN0cihhLDgpLDIpLnRvU3RyaW5nKDE2KSwxPT09ZC5sZW5ndGgmJlxuKGQ9XCIwXCIrZCksYys9ZDtyZXR1cm4gYy50b0xvd2VyQ2FzZSgpfXZhciAkYz0vXi0/XFxkezEsMTB9JC87ZnVuY3Rpb24gVWMoYSl7cmV0dXJuICRjLnRlc3QoYSkmJihhPU51bWJlcihhKSwtMjE0NzQ4MzY0ODw9YSYmMjE0NzQ4MzY0Nz49YSk/YTpudWxsfWZ1bmN0aW9uIENiKGEpe3RyeXthKCl9Y2F0Y2goYil7c2V0VGltZW91dChmdW5jdGlvbigpe1EoXCJFeGNlcHRpb24gd2FzIHRocm93biBieSB1c2VyIGNhbGxiYWNrLlwiLGIuc3RhY2t8fFwiXCIpO3Rocm93IGI7fSxNYXRoLmZsb29yKDApKX19ZnVuY3Rpb24gUihhLGIpe2lmKGhhKGEpKXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkuc2xpY2UoKTtDYihmdW5jdGlvbigpe2EuYXBwbHkobnVsbCxjKX0pfX07ZnVuY3Rpb24gS2MoYSl7Zm9yKHZhciBiPVtdLGM9MCxkPTA7ZDxhLmxlbmd0aDtkKyspe3ZhciBlPWEuY2hhckNvZGVBdChkKTs1NTI5Njw9ZSYmNTYzMTk+PWUmJihlLT01NTI5NixkKyssSihkPGEubGVuZ3RoLFwiU3Vycm9nYXRlIHBhaXIgbWlzc2luZyB0cmFpbCBzdXJyb2dhdGUuXCIpLGU9NjU1MzYrKGU8PDEwKSsoYS5jaGFyQ29kZUF0KGQpLTU2MzIwKSk7MTI4PmU/YltjKytdPWU6KDIwNDg+ZT9iW2MrK109ZT4+NnwxOTI6KDY1NTM2PmU/YltjKytdPWU+PjEyfDIyNDooYltjKytdPWU+PjE4fDI0MCxiW2MrK109ZT4+MTImNjN8MTI4KSxiW2MrK109ZT4+NiY2M3wxMjgpLGJbYysrXT1lJjYzfDEyOCl9cmV0dXJuIGJ9ZnVuY3Rpb24geGMoYSl7Zm9yKHZhciBiPTAsYz0wO2M8YS5sZW5ndGg7YysrKXt2YXIgZD1hLmNoYXJDb2RlQXQoYyk7MTI4PmQ/YisrOjIwNDg+ZD9iKz0yOjU1Mjk2PD1kJiY1NjMxOT49ZD8oYis9NCxjKyspOmIrPTN9cmV0dXJuIGJ9O2Z1bmN0aW9uIGFkKGEpe3ZhciBiPXt9LGM9e30sZD17fSxlPVwiXCI7dHJ5e3ZhciBmPWEuc3BsaXQoXCIuXCIpLGI9bWIoSWMoZlswXSl8fFwiXCIpLGM9bWIoSWMoZlsxXSl8fFwiXCIpLGU9ZlsyXSxkPWMuZHx8e307ZGVsZXRlIGMuZH1jYXRjaChnKXt9cmV0dXJue1dnOmIsQWM6YyxkYXRhOmQsTmc6ZX19ZnVuY3Rpb24gYmQoYSl7YT1hZChhKS5BYztyZXR1cm5cIm9iamVjdFwiPT09dHlwZW9mIGEmJmEuaGFzT3duUHJvcGVydHkoXCJpYXRcIik/dyhhLFwiaWF0XCIpOm51bGx9ZnVuY3Rpb24gY2QoYSl7YT1hZChhKTt2YXIgYj1hLkFjO3JldHVybiEhYS5OZyYmISFiJiZcIm9iamVjdFwiPT09dHlwZW9mIGImJmIuaGFzT3duUHJvcGVydHkoXCJpYXRcIil9O2Z1bmN0aW9uIGRkKGEpe3RoaXMuVj1hO3RoaXMuZz1hLm4uZ31mdW5jdGlvbiBlZChhLGIsYyxkKXt2YXIgZT1bXSxmPVtdO09hKGIsZnVuY3Rpb24oYil7XCJjaGlsZF9jaGFuZ2VkXCI9PT1iLnR5cGUmJmEuZy54ZChiLkplLGIuSmEpJiZmLnB1c2gobmV3IEQoXCJjaGlsZF9tb3ZlZFwiLGIuSmEsYi5ZYSkpfSk7ZmQoYSxlLFwiY2hpbGRfcmVtb3ZlZFwiLGIsZCxjKTtmZChhLGUsXCJjaGlsZF9hZGRlZFwiLGIsZCxjKTtmZChhLGUsXCJjaGlsZF9tb3ZlZFwiLGYsZCxjKTtmZChhLGUsXCJjaGlsZF9jaGFuZ2VkXCIsYixkLGMpO2ZkKGEsZSxFYixiLGQsYyk7cmV0dXJuIGV9ZnVuY3Rpb24gZmQoYSxiLGMsZCxlLGYpe2Q9UGEoZCxmdW5jdGlvbihhKXtyZXR1cm4gYS50eXBlPT09Y30pO1hhKGQscShhLmVnLGEpKTtPYShkLGZ1bmN0aW9uKGMpe3ZhciBkPWdkKGEsYyxmKTtPYShlLGZ1bmN0aW9uKGUpe2UuSmYoYy50eXBlKSYmYi5wdXNoKGUuY3JlYXRlRXZlbnQoZCxhLlYpKX0pfSl9XG5mdW5jdGlvbiBnZChhLGIsYyl7XCJ2YWx1ZVwiIT09Yi50eXBlJiZcImNoaWxkX3JlbW92ZWRcIiE9PWIudHlwZSYmKGIuTmQ9Yy5xZihiLllhLGIuSmEsYS5nKSk7cmV0dXJuIGJ9ZGQucHJvdG90eXBlLmVnPWZ1bmN0aW9uKGEsYil7aWYobnVsbD09YS5ZYXx8bnVsbD09Yi5ZYSl0aHJvdyBIYyhcIlNob3VsZCBvbmx5IGNvbXBhcmUgY2hpbGRfIGV2ZW50cy5cIik7cmV0dXJuIHRoaXMuZy5jb21wYXJlKG5ldyBFKGEuWWEsYS5KYSksbmV3IEUoYi5ZYSxiLkphKSl9O2Z1bmN0aW9uIGhkKCl7dGhpcy5lYj17fX1cbmZ1bmN0aW9uIGlkKGEsYil7dmFyIGM9Yi50eXBlLGQ9Yi5ZYTtKKFwiY2hpbGRfYWRkZWRcIj09Y3x8XCJjaGlsZF9jaGFuZ2VkXCI9PWN8fFwiY2hpbGRfcmVtb3ZlZFwiPT1jLFwiT25seSBjaGlsZCBjaGFuZ2VzIHN1cHBvcnRlZCBmb3IgdHJhY2tpbmdcIik7SihcIi5wcmlvcml0eVwiIT09ZCxcIk9ubHkgbm9uLXByaW9yaXR5IGNoaWxkIGNoYW5nZXMgY2FuIGJlIHRyYWNrZWQuXCIpO3ZhciBlPXcoYS5lYixkKTtpZihlKXt2YXIgZj1lLnR5cGU7aWYoXCJjaGlsZF9hZGRlZFwiPT1jJiZcImNoaWxkX3JlbW92ZWRcIj09ZilhLmViW2RdPW5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGIuSmEsZCxlLkphKTtlbHNlIGlmKFwiY2hpbGRfcmVtb3ZlZFwiPT1jJiZcImNoaWxkX2FkZGVkXCI9PWYpZGVsZXRlIGEuZWJbZF07ZWxzZSBpZihcImNoaWxkX3JlbW92ZWRcIj09YyYmXCJjaGlsZF9jaGFuZ2VkXCI9PWYpYS5lYltkXT1uZXcgRChcImNoaWxkX3JlbW92ZWRcIixlLkplLGQpO2Vsc2UgaWYoXCJjaGlsZF9jaGFuZ2VkXCI9PWMmJlxuXCJjaGlsZF9hZGRlZFwiPT1mKWEuZWJbZF09bmV3IEQoXCJjaGlsZF9hZGRlZFwiLGIuSmEsZCk7ZWxzZSBpZihcImNoaWxkX2NoYW5nZWRcIj09YyYmXCJjaGlsZF9jaGFuZ2VkXCI9PWYpYS5lYltkXT1uZXcgRChcImNoaWxkX2NoYW5nZWRcIixiLkphLGQsZS5KZSk7ZWxzZSB0aHJvdyBIYyhcIklsbGVnYWwgY29tYmluYXRpb24gb2YgY2hhbmdlczogXCIrYitcIiBvY2N1cnJlZCBhZnRlciBcIitlKTt9ZWxzZSBhLmViW2RdPWJ9O2Z1bmN0aW9uIGpkKGEsYixjKXt0aGlzLlBiPWE7dGhpcy5xYj1iO3RoaXMuc2I9Y3x8bnVsbH1oPWpkLnByb3RvdHlwZTtoLkpmPWZ1bmN0aW9uKGEpe3JldHVyblwidmFsdWVcIj09PWF9O2guY3JlYXRlRXZlbnQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1iLm4uZztyZXR1cm4gbmV3IEZiKFwidmFsdWVcIix0aGlzLG5ldyBTKGEuSmEsYi5sYygpLGMpKX07aC5VYj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnNiO2lmKFwiY2FuY2VsXCI9PT1hLnllKCkpe0oodGhpcy5xYixcIlJhaXNpbmcgYSBjYW5jZWwgZXZlbnQgb24gYSBsaXN0ZW5lciB3aXRoIG5vIGNhbmNlbCBjYWxsYmFja1wiKTt2YXIgYz10aGlzLnFiO3JldHVybiBmdW5jdGlvbigpe2MuY2FsbChiLGEuZXJyb3IpfX12YXIgZD10aGlzLlBiO3JldHVybiBmdW5jdGlvbigpe2QuY2FsbChiLGEuV2QpfX07aC5mZj1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnFiP25ldyBHYih0aGlzLGEsYik6bnVsbH07XG5oLm1hdGNoZXM9ZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBqZD9hLlBiJiZ0aGlzLlBiP2EuUGI9PT10aGlzLlBiJiZhLnNiPT09dGhpcy5zYjohMDohMX07aC5zZj1mdW5jdGlvbigpe3JldHVybiBudWxsIT09dGhpcy5QYn07ZnVuY3Rpb24ga2QoYSxiLGMpe3RoaXMuZ2E9YTt0aGlzLnFiPWI7dGhpcy5zYj1jfWg9a2QucHJvdG90eXBlO2guSmY9ZnVuY3Rpb24oYSl7YT1cImNoaWxkcmVuX2FkZGVkXCI9PT1hP1wiY2hpbGRfYWRkZWRcIjphO3JldHVybihcImNoaWxkcmVuX3JlbW92ZWRcIj09PWE/XCJjaGlsZF9yZW1vdmVkXCI6YSlpbiB0aGlzLmdhfTtoLmZmPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMucWI/bmV3IEdiKHRoaXMsYSxiKTpudWxsfTtcbmguY3JlYXRlRXZlbnQ9ZnVuY3Rpb24oYSxiKXtKKG51bGwhPWEuWWEsXCJDaGlsZCBldmVudHMgc2hvdWxkIGhhdmUgYSBjaGlsZE5hbWUuXCIpO3ZhciBjPWIubGMoKS53KGEuWWEpO3JldHVybiBuZXcgRmIoYS50eXBlLHRoaXMsbmV3IFMoYS5KYSxjLGIubi5nKSxhLk5kKX07aC5VYj1mdW5jdGlvbihhKXt2YXIgYj10aGlzLnNiO2lmKFwiY2FuY2VsXCI9PT1hLnllKCkpe0oodGhpcy5xYixcIlJhaXNpbmcgYSBjYW5jZWwgZXZlbnQgb24gYSBsaXN0ZW5lciB3aXRoIG5vIGNhbmNlbCBjYWxsYmFja1wiKTt2YXIgYz10aGlzLnFiO3JldHVybiBmdW5jdGlvbigpe2MuY2FsbChiLGEuZXJyb3IpfX12YXIgZD10aGlzLmdhW2EucmRdO3JldHVybiBmdW5jdGlvbigpe2QuY2FsbChiLGEuV2QsYS5OZCl9fTtcbmgubWF0Y2hlcz1mdW5jdGlvbihhKXtpZihhIGluc3RhbmNlb2Yga2Qpe2lmKCF0aGlzLmdhfHwhYS5nYSlyZXR1cm4hMDtpZih0aGlzLnNiPT09YS5zYil7dmFyIGI9cGEoYS5nYSk7aWYoYj09PXBhKHRoaXMuZ2EpKXtpZigxPT09Yil7dmFyIGI9cWEoYS5nYSksYz1xYSh0aGlzLmdhKTtyZXR1cm4gYz09PWImJighYS5nYVtiXXx8IXRoaXMuZ2FbY118fGEuZ2FbYl09PT10aGlzLmdhW2NdKX1yZXR1cm4gb2EodGhpcy5nYSxmdW5jdGlvbihiLGMpe3JldHVybiBhLmdhW2NdPT09Yn0pfX19cmV0dXJuITF9O2guc2Y9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9PXRoaXMuZ2F9O2Z1bmN0aW9uIGxkKGEpe3RoaXMuZz1hfWg9bGQucHJvdG90eXBlO2guRz1mdW5jdGlvbihhLGIsYyxkLGUpe0ooYS5JYyh0aGlzLmcpLFwiQSBub2RlIG11c3QgYmUgaW5kZXhlZCBpZiBvbmx5IGEgY2hpbGQgaXMgdXBkYXRlZFwiKTtkPWEuTShiKTtpZihkLlooYykpcmV0dXJuIGE7bnVsbCE9ZSYmKGMuZSgpP2EuSGEoYik/aWQoZSxuZXcgRChcImNoaWxkX3JlbW92ZWRcIixkLGIpKTpKKGEuTigpLFwiQSBjaGlsZCByZW1vdmUgd2l0aG91dCBhbiBvbGQgY2hpbGQgb25seSBtYWtlcyBzZW5zZSBvbiBhIGxlYWYgbm9kZVwiKTpkLmUoKT9pZChlLG5ldyBEKFwiY2hpbGRfYWRkZWRcIixjLGIpKTppZChlLG5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGMsYixkKSkpO3JldHVybiBhLk4oKSYmYy5lKCk/YTphLlEoYixjKS5tYih0aGlzLmcpfTtcbmgudGE9ZnVuY3Rpb24oYSxiLGMpe251bGwhPWMmJihhLk4oKXx8YS5VKE0sZnVuY3Rpb24oYSxlKXtiLkhhKGEpfHxpZChjLG5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLGUsYSkpfSksYi5OKCl8fGIuVShNLGZ1bmN0aW9uKGIsZSl7aWYoYS5IYShiKSl7dmFyIGY9YS5NKGIpO2YuWihlKXx8aWQoYyxuZXcgRChcImNoaWxkX2NoYW5nZWRcIixlLGIsZikpfWVsc2UgaWQoYyxuZXcgRChcImNoaWxkX2FkZGVkXCIsZSxiKSl9KSk7cmV0dXJuIGIubWIodGhpcy5nKX07aC5kYT1mdW5jdGlvbihhLGIpe3JldHVybiBhLmUoKT9DOmEuZGEoYil9O2guR2E9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5WYj1mdW5jdGlvbigpe3JldHVybiB0aGlzfTtmdW5jdGlvbiBtZChhKXt0aGlzLkFlPW5ldyBsZChhLmcpO3RoaXMuZz1hLmc7dmFyIGI7YS5sYT8oYj1uZChhKSxiPWEuZy5PYyhvZChhKSxiKSk6Yj1hLmcuU2MoKTt0aGlzLmRkPWI7YS5uYT8oYj1wZChhKSxhPWEuZy5PYyhxZChhKSxiKSk6YT1hLmcuUGMoKTt0aGlzLkZjPWF9aD1tZC5wcm90b3R5cGU7aC5tYXRjaGVzPWZ1bmN0aW9uKGEpe3JldHVybiAwPj10aGlzLmcuY29tcGFyZSh0aGlzLmRkLGEpJiYwPj10aGlzLmcuY29tcGFyZShhLHRoaXMuRmMpfTtoLkc9ZnVuY3Rpb24oYSxiLGMsZCxlKXt0aGlzLm1hdGNoZXMobmV3IEUoYixjKSl8fChjPUMpO3JldHVybiB0aGlzLkFlLkcoYSxiLGMsZCxlKX07aC50YT1mdW5jdGlvbihhLGIsYyl7Yi5OKCkmJihiPUMpO3ZhciBkPWIubWIodGhpcy5nKSxkPWQuZGEoQyksZT10aGlzO2IuVShNLGZ1bmN0aW9uKGEsYil7ZS5tYXRjaGVzKG5ldyBFKGEsYikpfHwoZD1kLlEoYSxDKSl9KTtyZXR1cm4gdGhpcy5BZS50YShhLGQsYyl9O1xuaC5kYT1mdW5jdGlvbihhKXtyZXR1cm4gYX07aC5HYT1mdW5jdGlvbigpe3JldHVybiEwfTtoLlZiPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuQWV9O2Z1bmN0aW9uIHJkKGEpe3RoaXMucmE9bmV3IG1kKGEpO3RoaXMuZz1hLmc7SihhLmlhLFwiT25seSB2YWxpZCBpZiBsaW1pdCBoYXMgYmVlbiBzZXRcIik7dGhpcy5qYT1hLmphO3RoaXMuSmI9IXNkKGEpfWg9cmQucHJvdG90eXBlO2guRz1mdW5jdGlvbihhLGIsYyxkLGUpe3RoaXMucmEubWF0Y2hlcyhuZXcgRShiLGMpKXx8KGM9Qyk7cmV0dXJuIGEuTShiKS5aKGMpP2E6YS5EYigpPHRoaXMuamE/dGhpcy5yYS5WYigpLkcoYSxiLGMsZCxlKTp0ZCh0aGlzLGEsYixjLGQsZSl9O1xuaC50YT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ7aWYoYi5OKCl8fGIuZSgpKWQ9Qy5tYih0aGlzLmcpO2Vsc2UgaWYoMip0aGlzLmphPGIuRGIoKSYmYi5JYyh0aGlzLmcpKXtkPUMubWIodGhpcy5nKTtiPXRoaXMuSmI/Yi5aYih0aGlzLnJhLkZjLHRoaXMuZyk6Yi5YYih0aGlzLnJhLmRkLHRoaXMuZyk7Zm9yKHZhciBlPTA7MDxiLlBhLmxlbmd0aCYmZTx0aGlzLmphOyl7dmFyIGY9SChiKSxnO2lmKGc9dGhpcy5KYj8wPj10aGlzLmcuY29tcGFyZSh0aGlzLnJhLmRkLGYpOjA+PXRoaXMuZy5jb21wYXJlKGYsdGhpcy5yYS5GYykpZD1kLlEoZi5uYW1lLGYuUyksZSsrO2Vsc2UgYnJlYWt9fWVsc2V7ZD1iLm1iKHRoaXMuZyk7ZD1kLmRhKEMpO3ZhciBrLGwsbTtpZih0aGlzLkpiKXtiPWQucmYodGhpcy5nKTtrPXRoaXMucmEuRmM7bD10aGlzLnJhLmRkO3ZhciB2PXVkKHRoaXMuZyk7bT1mdW5jdGlvbihhLGIpe3JldHVybiB2KGIsYSl9fWVsc2UgYj1kLldiKHRoaXMuZyksaz10aGlzLnJhLmRkLFxubD10aGlzLnJhLkZjLG09dWQodGhpcy5nKTtmb3IodmFyIGU9MCx5PSExOzA8Yi5QYS5sZW5ndGg7KWY9SChiKSwheSYmMD49bShrLGYpJiYoeT0hMCksKGc9eSYmZTx0aGlzLmphJiYwPj1tKGYsbCkpP2UrKzpkPWQuUShmLm5hbWUsQyl9cmV0dXJuIHRoaXMucmEuVmIoKS50YShhLGQsYyl9O2guZGE9ZnVuY3Rpb24oYSl7cmV0dXJuIGF9O2guR2E9ZnVuY3Rpb24oKXtyZXR1cm4hMH07aC5WYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJhLlZiKCl9O1xuZnVuY3Rpb24gdGQoYSxiLGMsZCxlLGYpe3ZhciBnO2lmKGEuSmIpe3ZhciBrPXVkKGEuZyk7Zz1mdW5jdGlvbihhLGIpe3JldHVybiBrKGIsYSl9fWVsc2UgZz11ZChhLmcpO0ooYi5EYigpPT1hLmphLFwiXCIpO3ZhciBsPW5ldyBFKGMsZCksbT1hLkpiP3dkKGIsYS5nKTp4ZChiLGEuZyksdj1hLnJhLm1hdGNoZXMobCk7aWYoYi5IYShjKSl7dmFyIHk9Yi5NKGMpLG09ZS54ZShhLmcsbSxhLkpiKTtudWxsIT1tJiZtLm5hbWU9PWMmJihtPWUueGUoYS5nLG0sYS5KYikpO2U9bnVsbD09bT8xOmcobSxsKTtpZih2JiYhZC5lKCkmJjA8PWUpcmV0dXJuIG51bGwhPWYmJmlkKGYsbmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsZCxjLHkpKSxiLlEoYyxkKTtudWxsIT1mJiZpZChmLG5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLHksYykpO2I9Yi5RKGMsQyk7cmV0dXJuIG51bGwhPW0mJmEucmEubWF0Y2hlcyhtKT8obnVsbCE9ZiYmaWQoZixuZXcgRChcImNoaWxkX2FkZGVkXCIsbS5TLG0ubmFtZSkpLGIuUShtLm5hbWUsXG5tLlMpKTpifXJldHVybiBkLmUoKT9iOnYmJjA8PWcobSxsKT8obnVsbCE9ZiYmKGlkKGYsbmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIsbS5TLG0ubmFtZSkpLGlkKGYsbmV3IEQoXCJjaGlsZF9hZGRlZFwiLGQsYykpKSxiLlEoYyxkKS5RKG0ubmFtZSxDKSk6Yn07ZnVuY3Rpb24geWQoYSxiKXt0aGlzLmhlPWE7dGhpcy5jZz1ifWZ1bmN0aW9uIHpkKGEpe3RoaXMuST1hfVxuemQucHJvdG90eXBlLmJiPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPW5ldyBoZCxmO2lmKGIudHlwZT09PVZiKWIuc291cmNlLnZlP2M9QWQodGhpcyxhLGIucGF0aCxiLklhLGMsZCxlKTooSihiLnNvdXJjZS5vZixcIlVua25vd24gc291cmNlLlwiKSxmPWIuc291cmNlLmFmLGM9QmQodGhpcyxhLGIucGF0aCxiLklhLGMsZCxmLGUpKTtlbHNlIGlmKGIudHlwZT09PUNkKWIuc291cmNlLnZlP2M9RGQodGhpcyxhLGIucGF0aCxiLmNoaWxkcmVuLGMsZCxlKTooSihiLnNvdXJjZS5vZixcIlVua25vd24gc291cmNlLlwiKSxmPWIuc291cmNlLmFmLGM9RWQodGhpcyxhLGIucGF0aCxiLmNoaWxkcmVuLGMsZCxmLGUpKTtlbHNlIGlmKGIudHlwZT09PVhiKWlmKGIuVmUpaWYoZj1iLnBhdGgsbnVsbCE9Yy5zYyhmKSljPWE7ZWxzZXtiPW5ldyBxYihjLGEsZCk7ZD1hLkQuaigpO2lmKGYuZSgpfHxcIi5wcmlvcml0eVwiPT09TyhmKSlIYihhLnUoKSk/Yj1jLnVhKHRiKGEpKTooYj1hLnUoKS5qKCksXG5KKGIgaW5zdGFuY2VvZiBULFwic2VydmVyQ2hpbGRyZW4gd291bGQgYmUgY29tcGxldGUgaWYgbGVhZiBub2RlXCIpLGI9Yy54YyhiKSksYj10aGlzLkkudGEoZCxiLGUpO2Vsc2V7Zj1PKGYpO3ZhciBnPWMuWGEoZixhLnUoKSk7bnVsbD09ZyYmcmIoYS51KCksZikmJihnPWQuTShmKSk7Yj1udWxsIT1nP3RoaXMuSS5HKGQsZixnLGIsZSk6YS5ELmooKS5IYShmKT90aGlzLkkuRyhkLGYsQyxiLGUpOmQ7Yi5lKCkmJkhiKGEudSgpKSYmKGQ9Yy51YSh0YihhKSksZC5OKCkmJihiPXRoaXMuSS50YShiLGQsZSkpKX1kPUhiKGEudSgpKXx8bnVsbCE9Yy5zYyhGKTtjPUZkKGEsYixkLHRoaXMuSS5HYSgpKX1lbHNlIGM9R2QodGhpcyxhLGIucGF0aCxjLGQsZSk7ZWxzZSBpZihiLnR5cGU9PT0kYilkPWIucGF0aCxiPWEudSgpLGY9Yi5qKCksZz1iLiR8fGQuZSgpLGM9SGQodGhpcyxuZXcgSWQoYS5ELG5ldyBzYihmLGcsYi5UYikpLGQsYyxwYixlKTtlbHNlIHRocm93IEhjKFwiVW5rbm93biBvcGVyYXRpb24gdHlwZTogXCIrXG5iLnR5cGUpO2U9cmEoZS5lYik7ZD1jO2I9ZC5EO2IuJCYmKGY9Yi5qKCkuTigpfHxiLmooKS5lKCksZz1KZChhKSwoMDxlLmxlbmd0aHx8IWEuRC4kfHxmJiYhYi5qKCkuWihnKXx8IWIuaigpLkEoKS5aKGcuQSgpKSkmJmUucHVzaChEYihKZChkKSkpKTtyZXR1cm4gbmV3IHlkKGMsZSl9O1xuZnVuY3Rpb24gSGQoYSxiLGMsZCxlLGYpe3ZhciBnPWIuRDtpZihudWxsIT1kLnNjKGMpKXJldHVybiBiO3ZhciBrO2lmKGMuZSgpKUooSGIoYi51KCkpLFwiSWYgY2hhbmdlIHBhdGggaXMgZW1wdHksIHdlIG11c3QgaGF2ZSBjb21wbGV0ZSBzZXJ2ZXIgZGF0YVwiKSxiLnUoKS5UYj8oZT10YihiKSxkPWQueGMoZSBpbnN0YW5jZW9mIFQ/ZTpDKSk6ZD1kLnVhKHRiKGIpKSxmPWEuSS50YShiLkQuaigpLGQsZik7ZWxzZXt2YXIgbD1PKGMpO2lmKFwiLnByaW9yaXR5XCI9PWwpSigxPT11YyhjKSxcIkNhbid0IGhhdmUgYSBwcmlvcml0eSB3aXRoIGFkZGl0aW9uYWwgcGF0aCBjb21wb25lbnRzXCIpLGY9Zy5qKCksaz1iLnUoKS5qKCksZD1kLmhkKGMsZixrKSxmPW51bGwhPWQ/YS5JLmRhKGYsZCk6Zy5qKCk7ZWxzZXt2YXIgbT1HKGMpO3JiKGcsbCk/KGs9Yi51KCkuaigpLGQ9ZC5oZChjLGcuaigpLGspLGQ9bnVsbCE9ZD9nLmooKS5NKGwpLkcobSxkKTpnLmooKS5NKGwpKTpkPWQuWGEobCxiLnUoKSk7XG5mPW51bGwhPWQ/YS5JLkcoZy5qKCksbCxkLGUsZik6Zy5qKCl9fXJldHVybiBGZChiLGYsZy4kfHxjLmUoKSxhLkkuR2EoKSl9ZnVuY3Rpb24gQmQoYSxiLGMsZCxlLGYsZyxrKXt2YXIgbD1iLnUoKTtnPWc/YS5JOmEuSS5WYigpO2lmKGMuZSgpKWQ9Zy50YShsLmooKSxkLG51bGwpO2Vsc2UgaWYoZy5HYSgpJiYhbC5UYilkPWwuaigpLkcoYyxkKSxkPWcudGEobC5qKCksZCxudWxsKTtlbHNle3ZhciBtPU8oYyk7aWYoKGMuZSgpPyFsLiR8fGwuVGI6IXJiKGwsTyhjKSkpJiYxPHVjKGMpKXJldHVybiBiO2Q9bC5qKCkuTShtKS5HKEcoYyksZCk7ZD1cIi5wcmlvcml0eVwiPT1tP2cuZGEobC5qKCksZCk6Zy5HKGwuaigpLG0sZCxwYixudWxsKX1sPWwuJHx8Yy5lKCk7Yj1uZXcgSWQoYi5ELG5ldyBzYihkLGwsZy5HYSgpKSk7cmV0dXJuIEhkKGEsYixjLGUsbmV3IHFiKGUsYixmKSxrKX1cbmZ1bmN0aW9uIEFkKGEsYixjLGQsZSxmLGcpe3ZhciBrPWIuRDtlPW5ldyBxYihlLGIsZik7aWYoYy5lKCkpZz1hLkkudGEoYi5ELmooKSxkLGcpLGE9RmQoYixnLCEwLGEuSS5HYSgpKTtlbHNlIGlmKGY9TyhjKSxcIi5wcmlvcml0eVwiPT09ZilnPWEuSS5kYShiLkQuaigpLGQpLGE9RmQoYixnLGsuJCxrLlRiKTtlbHNle3ZhciBsPUcoYyk7Yz1rLmooKS5NKGYpO2lmKCFsLmUoKSl7dmFyIG09ZS5wZihmKTtkPW51bGwhPW0/XCIucHJpb3JpdHlcIj09PXZjKGwpJiZtLm9hKGwucGFyZW50KCkpLmUoKT9tOm0uRyhsLGQpOkN9Yy5aKGQpP2E9YjooZz1hLkkuRyhrLmooKSxmLGQsZSxnKSxhPUZkKGIsZyxrLiQsYS5JLkdhKCkpKX1yZXR1cm4gYX1cbmZ1bmN0aW9uIERkKGEsYixjLGQsZSxmLGcpe3ZhciBrPWI7S2QoZCxmdW5jdGlvbihkLG0pe3ZhciB2PWMudyhkKTtyYihiLkQsTyh2KSkmJihrPUFkKGEsayx2LG0sZSxmLGcpKX0pO0tkKGQsZnVuY3Rpb24oZCxtKXt2YXIgdj1jLncoZCk7cmIoYi5ELE8odikpfHwoaz1BZChhLGssdixtLGUsZixnKSl9KTtyZXR1cm4ga31mdW5jdGlvbiBMZChhLGIpe0tkKGIsZnVuY3Rpb24oYixkKXthPWEuRyhiLGQpfSk7cmV0dXJuIGF9XG5mdW5jdGlvbiBFZChhLGIsYyxkLGUsZixnLGspe2lmKGIudSgpLmooKS5lKCkmJiFIYihiLnUoKSkpcmV0dXJuIGI7dmFyIGw9YjtjPWMuZSgpP2Q6TWQoTmQsYyxkKTt2YXIgbT1iLnUoKS5qKCk7Yy5jaGlsZHJlbi5oYShmdW5jdGlvbihjLGQpe2lmKG0uSGEoYykpe3ZhciBJPWIudSgpLmooKS5NKGMpLEk9TGQoSSxkKTtsPUJkKGEsbCxuZXcgSyhjKSxJLGUsZixnLGspfX0pO2MuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYyxkKXt2YXIgST0hSGIoYi51KCkpJiZudWxsPT1kLnZhbHVlO20uSGEoYyl8fEl8fChJPWIudSgpLmooKS5NKGMpLEk9TGQoSSxkKSxsPUJkKGEsbCxuZXcgSyhjKSxJLGUsZixnLGspKX0pO3JldHVybiBsfVxuZnVuY3Rpb24gR2QoYSxiLGMsZCxlLGYpe2lmKG51bGwhPWQuc2MoYykpcmV0dXJuIGI7dmFyIGc9bmV3IHFiKGQsYixlKSxrPWU9Yi5ELmooKTtpZihIYihiLnUoKSkpe2lmKGMuZSgpKWU9ZC51YSh0YihiKSksaz1hLkkudGEoYi5ELmooKSxlLGYpO2Vsc2UgaWYoXCIucHJpb3JpdHlcIj09PU8oYykpe3ZhciBsPWQuWGEoTyhjKSxiLnUoKSk7bnVsbD09bHx8ZS5lKCl8fGUuQSgpLloobCl8fChrPWEuSS5kYShlLGwpKX1lbHNlIGw9TyhjKSxlPWQuWGEobCxiLnUoKSksbnVsbCE9ZSYmKGs9YS5JLkcoYi5ELmooKSxsLGUsZyxmKSk7ZT0hMH1lbHNlIGlmKGIuRC4kfHxjLmUoKSlrPWUsZT1iLkQuaigpLGUuTigpfHxlLlUoTSxmdW5jdGlvbihjKXt2YXIgZT1kLlhhKGMsYi51KCkpO251bGwhPWUmJihrPWEuSS5HKGssYyxlLGcsZikpfSksZT1iLkQuJDtlbHNle2w9TyhjKTtpZigxPT11YyhjKXx8cmIoYi5ELGwpKWM9ZC5YYShsLGIudSgpKSxudWxsIT1jJiYoaz1hLkkuRyhlLGwsYyxcbmcsZikpO2U9ITF9cmV0dXJuIEZkKGIsayxlLGEuSS5HYSgpKX07ZnVuY3Rpb24gT2QoKXt9dmFyIFBkPXt9O2Z1bmN0aW9uIHVkKGEpe3JldHVybiBxKGEuY29tcGFyZSxhKX1PZC5wcm90b3R5cGUueGQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gMCE9PXRoaXMuY29tcGFyZShuZXcgRShcIltNSU5fTkFNRV1cIixhKSxuZXcgRShcIltNSU5fTkFNRV1cIixiKSl9O09kLnByb3RvdHlwZS5TYz1mdW5jdGlvbigpe3JldHVybiBRZH07ZnVuY3Rpb24gUmQoYSl7dGhpcy5iYz1hfW1hKFJkLE9kKTtoPVJkLnByb3RvdHlwZTtoLkhjPWZ1bmN0aW9uKGEpe3JldHVybiFhLk0odGhpcy5iYykuZSgpfTtoLmNvbXBhcmU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLlMuTSh0aGlzLmJjKSxkPWIuUy5NKHRoaXMuYmMpLGM9Yy5DYyhkKTtyZXR1cm4gMD09PWM/U2IoYS5uYW1lLGIubmFtZSk6Y307aC5PYz1mdW5jdGlvbihhLGIpe3ZhciBjPUwoYSksYz1DLlEodGhpcy5iYyxjKTtyZXR1cm4gbmV3IEUoYixjKX07XG5oLlBjPWZ1bmN0aW9uKCl7dmFyIGE9Qy5RKHRoaXMuYmMsU2QpO3JldHVybiBuZXcgRShcIltNQVhfTkFNRV1cIixhKX07aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJjfTtmdW5jdGlvbiBUZCgpe31tYShUZCxPZCk7aD1UZC5wcm90b3R5cGU7aC5jb21wYXJlPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5TLkEoKSxkPWIuUy5BKCksYz1jLkNjKGQpO3JldHVybiAwPT09Yz9TYihhLm5hbWUsYi5uYW1lKTpjfTtoLkhjPWZ1bmN0aW9uKGEpe3JldHVybiFhLkEoKS5lKCl9O2gueGQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4hYS5BKCkuWihiLkEoKSl9O2guU2M9ZnVuY3Rpb24oKXtyZXR1cm4gUWR9O2guUGM9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEUoXCJbTUFYX05BTUVdXCIsbmV3IHRjKFwiW1BSSU9SSVRZLVBPU1RdXCIsU2QpKX07aC5PYz1mdW5jdGlvbihhLGIpe3ZhciBjPUwoYSk7cmV0dXJuIG5ldyBFKGIsbmV3IHRjKFwiW1BSSU9SSVRZLVBPU1RdXCIsYykpfTtcbmgudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIi5wcmlvcml0eVwifTt2YXIgTT1uZXcgVGQ7ZnVuY3Rpb24gVWQoKXt9bWEoVWQsT2QpO2g9VWQucHJvdG90eXBlO2guY29tcGFyZT1mdW5jdGlvbihhLGIpe3JldHVybiBTYihhLm5hbWUsYi5uYW1lKX07aC5IYz1mdW5jdGlvbigpe3Rocm93IEhjKFwiS2V5SW5kZXguaXNEZWZpbmVkT24gbm90IGV4cGVjdGVkIHRvIGJlIGNhbGxlZC5cIik7fTtoLnhkPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guU2M9ZnVuY3Rpb24oKXtyZXR1cm4gUWR9O2guUGM9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEUoXCJbTUFYX05BTUVdXCIsQyl9O2guT2M9ZnVuY3Rpb24oYSl7SihwKGEpLFwiS2V5SW5kZXggaW5kZXhWYWx1ZSBtdXN0IGFsd2F5cyBiZSBhIHN0cmluZy5cIik7cmV0dXJuIG5ldyBFKGEsQyl9O2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIi5rZXlcIn07dmFyIFZkPW5ldyBVZDtmdW5jdGlvbiBXZCgpe31tYShXZCxPZCk7aD1XZC5wcm90b3R5cGU7XG5oLmNvbXBhcmU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLlMuQ2MoYi5TKTtyZXR1cm4gMD09PWM/U2IoYS5uYW1lLGIubmFtZSk6Y307aC5IYz1mdW5jdGlvbigpe3JldHVybiEwfTtoLnhkPWZ1bmN0aW9uKGEsYil7cmV0dXJuIWEuWihiKX07aC5TYz1mdW5jdGlvbigpe3JldHVybiBRZH07aC5QYz1mdW5jdGlvbigpe3JldHVybiBYZH07aC5PYz1mdW5jdGlvbihhLGIpe3ZhciBjPUwoYSk7cmV0dXJuIG5ldyBFKGIsYyl9O2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIi52YWx1ZVwifTt2YXIgWWQ9bmV3IFdkO2Z1bmN0aW9uIFpkKCl7dGhpcy5SYj10aGlzLm5hPXRoaXMuTGI9dGhpcy5sYT10aGlzLmlhPSExO3RoaXMuamE9MDt0aGlzLk5iPVwiXCI7dGhpcy5kYz1udWxsO3RoaXMueGI9XCJcIjt0aGlzLmFjPW51bGw7dGhpcy52Yj1cIlwiO3RoaXMuZz1NfXZhciAkZD1uZXcgWmQ7ZnVuY3Rpb24gc2QoYSl7cmV0dXJuXCJcIj09PWEuTmI/YS5sYTpcImxcIj09PWEuTmJ9ZnVuY3Rpb24gb2QoYSl7SihhLmxhLFwiT25seSB2YWxpZCBpZiBzdGFydCBoYXMgYmVlbiBzZXRcIik7cmV0dXJuIGEuZGN9ZnVuY3Rpb24gbmQoYSl7SihhLmxhLFwiT25seSB2YWxpZCBpZiBzdGFydCBoYXMgYmVlbiBzZXRcIik7cmV0dXJuIGEuTGI/YS54YjpcIltNSU5fTkFNRV1cIn1mdW5jdGlvbiBxZChhKXtKKGEubmEsXCJPbmx5IHZhbGlkIGlmIGVuZCBoYXMgYmVlbiBzZXRcIik7cmV0dXJuIGEuYWN9XG5mdW5jdGlvbiBwZChhKXtKKGEubmEsXCJPbmx5IHZhbGlkIGlmIGVuZCBoYXMgYmVlbiBzZXRcIik7cmV0dXJuIGEuUmI/YS52YjpcIltNQVhfTkFNRV1cIn1mdW5jdGlvbiBhZShhKXt2YXIgYj1uZXcgWmQ7Yi5pYT1hLmlhO2IuamE9YS5qYTtiLmxhPWEubGE7Yi5kYz1hLmRjO2IuTGI9YS5MYjtiLnhiPWEueGI7Yi5uYT1hLm5hO2IuYWM9YS5hYztiLlJiPWEuUmI7Yi52Yj1hLnZiO2IuZz1hLmc7cmV0dXJuIGJ9aD1aZC5wcm90b3R5cGU7aC5HZT1mdW5jdGlvbihhKXt2YXIgYj1hZSh0aGlzKTtiLmlhPSEwO2IuamE9YTtiLk5iPVwiXCI7cmV0dXJuIGJ9O2guSGU9ZnVuY3Rpb24oYSl7dmFyIGI9YWUodGhpcyk7Yi5pYT0hMDtiLmphPWE7Yi5OYj1cImxcIjtyZXR1cm4gYn07aC5JZT1mdW5jdGlvbihhKXt2YXIgYj1hZSh0aGlzKTtiLmlhPSEwO2IuamE9YTtiLk5iPVwiclwiO3JldHVybiBifTtcbmguWGQ9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hZSh0aGlzKTtjLmxhPSEwO24oYSl8fChhPW51bGwpO2MuZGM9YTtudWxsIT1iPyhjLkxiPSEwLGMueGI9Yik6KGMuTGI9ITEsYy54Yj1cIlwiKTtyZXR1cm4gY307aC5xZD1mdW5jdGlvbihhLGIpe3ZhciBjPWFlKHRoaXMpO2MubmE9ITA7bihhKXx8KGE9bnVsbCk7Yy5hYz1hO24oYik/KGMuUmI9ITAsYy52Yj1iKTooYy5ZZz0hMSxjLnZiPVwiXCIpO3JldHVybiBjfTtmdW5jdGlvbiBiZShhLGIpe3ZhciBjPWFlKGEpO2MuZz1iO3JldHVybiBjfWZ1bmN0aW9uIGNlKGEpe3ZhciBiPXt9O2EubGEmJihiLnNwPWEuZGMsYS5MYiYmKGIuc249YS54YikpO2EubmEmJihiLmVwPWEuYWMsYS5SYiYmKGIuZW49YS52YikpO2lmKGEuaWEpe2IubD1hLmphO3ZhciBjPWEuTmI7XCJcIj09PWMmJihjPXNkKGEpP1wibFwiOlwiclwiKTtiLnZmPWN9YS5nIT09TSYmKGIuaT1hLmcudG9TdHJpbmcoKSk7cmV0dXJuIGJ9XG5mdW5jdGlvbiBkZShhKXtyZXR1cm4hKGEubGF8fGEubmF8fGEuaWEpfWZ1bmN0aW9uIGVlKGEpe3ZhciBiPXt9O2lmKGRlKGEpJiZhLmc9PU0pcmV0dXJuIGI7dmFyIGM7YS5nPT09TT9jPVwiJHByaW9yaXR5XCI6YS5nPT09WWQ/Yz1cIiR2YWx1ZVwiOihKKGEuZyBpbnN0YW5jZW9mIFJkLFwiVW5yZWNvZ25pemVkIGluZGV4IHR5cGUhXCIpLGM9YS5nLnRvU3RyaW5nKCkpO2Iub3JkZXJCeT1CKGMpO2EubGEmJihiLnN0YXJ0QXQ9QihhLmRjKSxhLkxiJiYoYi5zdGFydEF0Kz1cIixcIitCKGEueGIpKSk7YS5uYSYmKGIuZW5kQXQ9QihhLmFjKSxhLlJiJiYoYi5lbmRBdCs9XCIsXCIrQihhLnZiKSkpO2EuaWEmJihzZChhKT9iLmxpbWl0VG9GaXJzdD1hLmphOmIubGltaXRUb0xhc3Q9YS5qYSk7cmV0dXJuIGJ9aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBCKGNlKHRoaXMpKX07ZnVuY3Rpb24gZmUoYSxiKXt0aGlzLnlkPWE7dGhpcy5jYz1ifWZlLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oYSl7dmFyIGI9dyh0aGlzLnlkLGEpO2lmKCFiKXRocm93IEVycm9yKFwiTm8gaW5kZXggZGVmaW5lZCBmb3IgXCIrYSk7cmV0dXJuIGI9PT1QZD9udWxsOmJ9O2Z1bmN0aW9uIGdlKGEsYixjKXt2YXIgZD1uYShhLnlkLGZ1bmN0aW9uKGQsZil7dmFyIGc9dyhhLmNjLGYpO0ooZyxcIk1pc3NpbmcgaW5kZXggaW1wbGVtZW50YXRpb24gZm9yIFwiK2YpO2lmKGQ9PT1QZCl7aWYoZy5IYyhiLlMpKXtmb3IodmFyIGs9W10sbD1jLldiKFFiKSxtPUgobCk7bTspbS5uYW1lIT1iLm5hbWUmJmsucHVzaChtKSxtPUgobCk7ay5wdXNoKGIpO3JldHVybiBoZShrLHVkKGcpKX1yZXR1cm4gUGR9Zz1jLmdldChiLm5hbWUpO2s9ZDtnJiYoaz1rLnJlbW92ZShuZXcgRShiLm5hbWUsZykpKTtyZXR1cm4gay5OYShiLGIuUyl9KTtyZXR1cm4gbmV3IGZlKGQsYS5jYyl9XG5mdW5jdGlvbiBpZShhLGIsYyl7dmFyIGQ9bmEoYS55ZCxmdW5jdGlvbihhKXtpZihhPT09UGQpcmV0dXJuIGE7dmFyIGQ9Yy5nZXQoYi5uYW1lKTtyZXR1cm4gZD9hLnJlbW92ZShuZXcgRShiLm5hbWUsZCkpOmF9KTtyZXR1cm4gbmV3IGZlKGQsYS5jYyl9dmFyIGplPW5ldyBmZSh7XCIucHJpb3JpdHlcIjpQZH0se1wiLnByaW9yaXR5XCI6TX0pO2Z1bmN0aW9uIHRjKGEsYil7dGhpcy5DPWE7SihuKHRoaXMuQykmJm51bGwhPT10aGlzLkMsXCJMZWFmTm9kZSBzaG91bGRuJ3QgYmUgY3JlYXRlZCB3aXRoIG51bGwvdW5kZWZpbmVkIHZhbHVlLlwiKTt0aGlzLmJhPWJ8fEM7a2UodGhpcy5iYSk7dGhpcy5CYj1udWxsfWg9dGMucHJvdG90eXBlO2guTj1mdW5jdGlvbigpe3JldHVybiEwfTtoLkE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5iYX07aC5kYT1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IHRjKHRoaXMuQyxhKX07aC5NPWZ1bmN0aW9uKGEpe3JldHVyblwiLnByaW9yaXR5XCI9PT1hP3RoaXMuYmE6Q307aC5vYT1mdW5jdGlvbihhKXtyZXR1cm4gYS5lKCk/dGhpczpcIi5wcmlvcml0eVwiPT09TyhhKT90aGlzLmJhOkN9O2guSGE9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5xZj1mdW5jdGlvbigpe3JldHVybiBudWxsfTtcbmguUT1mdW5jdGlvbihhLGIpe3JldHVyblwiLnByaW9yaXR5XCI9PT1hP3RoaXMuZGEoYik6Yi5lKCkmJlwiLnByaW9yaXR5XCIhPT1hP3RoaXM6Qy5RKGEsYikuZGEodGhpcy5iYSl9O2guRz1mdW5jdGlvbihhLGIpe3ZhciBjPU8oYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7aWYoYi5lKCkmJlwiLnByaW9yaXR5XCIhPT1jKXJldHVybiB0aGlzO0ooXCIucHJpb3JpdHlcIiE9PWN8fDE9PT11YyhhKSxcIi5wcmlvcml0eSBtdXN0IGJlIHRoZSBsYXN0IHRva2VuIGluIGEgcGF0aFwiKTtyZXR1cm4gdGhpcy5RKGMsQy5HKEcoYSksYikpfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5EYj1mdW5jdGlvbigpe3JldHVybiAwfTtoLks9ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJiF0aGlzLkEoKS5lKCk/e1wiLnZhbHVlXCI6dGhpcy5CYSgpLFwiLnByaW9yaXR5XCI6dGhpcy5BKCkuSygpfTp0aGlzLkJhKCl9O1xuaC5oYXNoPWZ1bmN0aW9uKCl7aWYobnVsbD09PXRoaXMuQmIpe3ZhciBhPVwiXCI7dGhpcy5iYS5lKCl8fChhKz1cInByaW9yaXR5OlwiK2xlKHRoaXMuYmEuSygpKStcIjpcIik7dmFyIGI9dHlwZW9mIHRoaXMuQyxhPWErKGIrXCI6XCIpLGE9XCJudW1iZXJcIj09PWI/YStaYyh0aGlzLkMpOmErdGhpcy5DO3RoaXMuQmI9SmMoYSl9cmV0dXJuIHRoaXMuQmJ9O2guQmE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5DfTtoLkNjPWZ1bmN0aW9uKGEpe2lmKGE9PT1DKXJldHVybiAxO2lmKGEgaW5zdGFuY2VvZiBUKXJldHVybi0xO0ooYS5OKCksXCJVbmtub3duIG5vZGUgdHlwZVwiKTt2YXIgYj10eXBlb2YgYS5DLGM9dHlwZW9mIHRoaXMuQyxkPU5hKG1lLGIpLGU9TmEobWUsYyk7SigwPD1kLFwiVW5rbm93biBsZWFmIHR5cGU6IFwiK2IpO0ooMDw9ZSxcIlVua25vd24gbGVhZiB0eXBlOiBcIitjKTtyZXR1cm4gZD09PWU/XCJvYmplY3RcIj09PWM/MDp0aGlzLkM8YS5DPy0xOnRoaXMuQz09PWEuQz8wOjE6ZS1kfTtcbnZhciBtZT1bXCJvYmplY3RcIixcImJvb2xlYW5cIixcIm51bWJlclwiLFwic3RyaW5nXCJdO3RjLnByb3RvdHlwZS5tYj1mdW5jdGlvbigpe3JldHVybiB0aGlzfTt0Yy5wcm90b3R5cGUuSWM9ZnVuY3Rpb24oKXtyZXR1cm4hMH07dGMucHJvdG90eXBlLlo9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT10aGlzPyEwOmEuTigpP3RoaXMuQz09PWEuQyYmdGhpcy5iYS5aKGEuYmEpOiExfTt0Yy5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gQih0aGlzLksoITApKX07ZnVuY3Rpb24gVChhLGIsYyl7dGhpcy5tPWE7KHRoaXMuYmE9YikmJmtlKHRoaXMuYmEpO2EuZSgpJiZKKCF0aGlzLmJhfHx0aGlzLmJhLmUoKSxcIkFuIGVtcHR5IG5vZGUgY2Fubm90IGhhdmUgYSBwcmlvcml0eVwiKTt0aGlzLndiPWM7dGhpcy5CYj1udWxsfWg9VC5wcm90b3R5cGU7aC5OPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guQT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJhfHxDfTtoLmRhPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLm0uZSgpP3RoaXM6bmV3IFQodGhpcy5tLGEsdGhpcy53Yil9O2guTT1mdW5jdGlvbihhKXtpZihcIi5wcmlvcml0eVwiPT09YSlyZXR1cm4gdGhpcy5BKCk7YT10aGlzLm0uZ2V0KGEpO3JldHVybiBudWxsPT09YT9DOmF9O2gub2E9ZnVuY3Rpb24oYSl7dmFyIGI9TyhhKTtyZXR1cm4gbnVsbD09PWI/dGhpczp0aGlzLk0oYikub2EoRyhhKSl9O2guSGE9ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGwhPT10aGlzLm0uZ2V0KGEpfTtcbmguUT1mdW5jdGlvbihhLGIpe0ooYixcIldlIHNob3VsZCBhbHdheXMgYmUgcGFzc2luZyBzbmFwc2hvdCBub2Rlc1wiKTtpZihcIi5wcmlvcml0eVwiPT09YSlyZXR1cm4gdGhpcy5kYShiKTt2YXIgYz1uZXcgRShhLGIpLGQsZTtiLmUoKT8oZD10aGlzLm0ucmVtb3ZlKGEpLGM9aWUodGhpcy53YixjLHRoaXMubSkpOihkPXRoaXMubS5OYShhLGIpLGM9Z2UodGhpcy53YixjLHRoaXMubSkpO2U9ZC5lKCk/Qzp0aGlzLmJhO3JldHVybiBuZXcgVChkLGUsYyl9O2guRz1mdW5jdGlvbihhLGIpe3ZhciBjPU8oYSk7aWYobnVsbD09PWMpcmV0dXJuIGI7SihcIi5wcmlvcml0eVwiIT09TyhhKXx8MT09PXVjKGEpLFwiLnByaW9yaXR5IG11c3QgYmUgdGhlIGxhc3QgdG9rZW4gaW4gYSBwYXRoXCIpO3ZhciBkPXRoaXMuTShjKS5HKEcoYSksYik7cmV0dXJuIHRoaXMuUShjLGQpfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tLmUoKX07aC5EYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLm0uY291bnQoKX07XG52YXIgbmU9L14oMHxbMS05XVxcZCopJC87aD1ULnByb3RvdHlwZTtoLks9ZnVuY3Rpb24oYSl7aWYodGhpcy5lKCkpcmV0dXJuIG51bGw7dmFyIGI9e30sYz0wLGQ9MCxlPSEwO3RoaXMuVShNLGZ1bmN0aW9uKGYsZyl7YltmXT1nLksoYSk7YysrO2UmJm5lLnRlc3QoZik/ZD1NYXRoLm1heChkLE51bWJlcihmKSk6ZT0hMX0pO2lmKCFhJiZlJiZkPDIqYyl7dmFyIGY9W10sZztmb3IoZyBpbiBiKWZbZ109YltnXTtyZXR1cm4gZn1hJiYhdGhpcy5BKCkuZSgpJiYoYltcIi5wcmlvcml0eVwiXT10aGlzLkEoKS5LKCkpO3JldHVybiBifTtoLmhhc2g9ZnVuY3Rpb24oKXtpZihudWxsPT09dGhpcy5CYil7dmFyIGE9XCJcIjt0aGlzLkEoKS5lKCl8fChhKz1cInByaW9yaXR5OlwiK2xlKHRoaXMuQSgpLksoKSkrXCI6XCIpO3RoaXMuVShNLGZ1bmN0aW9uKGIsYyl7dmFyIGQ9Yy5oYXNoKCk7XCJcIiE9PWQmJihhKz1cIjpcIitiK1wiOlwiK2QpfSk7dGhpcy5CYj1cIlwiPT09YT9cIlwiOkpjKGEpfXJldHVybiB0aGlzLkJifTtcbmgucWY9ZnVuY3Rpb24oYSxiLGMpe3JldHVybihjPW9lKHRoaXMsYykpPyhhPWNjKGMsbmV3IEUoYSxiKSkpP2EubmFtZTpudWxsOmNjKHRoaXMubSxhKX07ZnVuY3Rpb24gd2QoYSxiKXt2YXIgYztjPShjPW9lKGEsYikpPyhjPWMuUmMoKSkmJmMubmFtZTphLm0uUmMoKTtyZXR1cm4gYz9uZXcgRShjLGEubS5nZXQoYykpOm51bGx9ZnVuY3Rpb24geGQoYSxiKXt2YXIgYztjPShjPW9lKGEsYikpPyhjPWMuZWMoKSkmJmMubmFtZTphLm0uZWMoKTtyZXR1cm4gYz9uZXcgRShjLGEubS5nZXQoYykpOm51bGx9aC5VPWZ1bmN0aW9uKGEsYil7dmFyIGM9b2UodGhpcyxhKTtyZXR1cm4gYz9jLmhhKGZ1bmN0aW9uKGEpe3JldHVybiBiKGEubmFtZSxhLlMpfSk6dGhpcy5tLmhhKGIpfTtoLldiPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlhiKGEuU2MoKSxhKX07XG5oLlhiPWZ1bmN0aW9uKGEsYil7dmFyIGM9b2UodGhpcyxiKTtpZihjKXJldHVybiBjLlhiKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGF9KTtmb3IodmFyIGM9dGhpcy5tLlhiKGEubmFtZSxRYiksZD1lYyhjKTtudWxsIT1kJiYwPmIuY29tcGFyZShkLGEpOylIKGMpLGQ9ZWMoYyk7cmV0dXJuIGN9O2gucmY9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuWmIoYS5QYygpLGEpfTtoLlpiPWZ1bmN0aW9uKGEsYil7dmFyIGM9b2UodGhpcyxiKTtpZihjKXJldHVybiBjLlpiKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGF9KTtmb3IodmFyIGM9dGhpcy5tLlpiKGEubmFtZSxRYiksZD1lYyhjKTtudWxsIT1kJiYwPGIuY29tcGFyZShkLGEpOylIKGMpLGQ9ZWMoYyk7cmV0dXJuIGN9O2guQ2M9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZSgpP2EuZSgpPzA6LTE6YS5OKCl8fGEuZSgpPzE6YT09PVNkPy0xOjB9O1xuaC5tYj1mdW5jdGlvbihhKXtpZihhPT09VmR8fHRhKHRoaXMud2IuY2MsYS50b1N0cmluZygpKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLndiLGM9dGhpcy5tO0ooYSE9PVZkLFwiS2V5SW5kZXggYWx3YXlzIGV4aXN0cyBhbmQgaXNuJ3QgbWVhbnQgdG8gYmUgYWRkZWQgdG8gdGhlIEluZGV4TWFwLlwiKTtmb3IodmFyIGQ9W10sZT0hMSxjPWMuV2IoUWIpLGY9SChjKTtmOyllPWV8fGEuSGMoZi5TKSxkLnB1c2goZiksZj1IKGMpO2Q9ZT9oZShkLHVkKGEpKTpQZDtlPWEudG9TdHJpbmcoKTtjPXhhKGIuY2MpO2NbZV09YTthPXhhKGIueWQpO2FbZV09ZDtyZXR1cm4gbmV3IFQodGhpcy5tLHRoaXMuYmEsbmV3IGZlKGEsYykpfTtoLkljPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09VmR8fHRhKHRoaXMud2IuY2MsYS50b1N0cmluZygpKX07XG5oLlo9ZnVuY3Rpb24oYSl7aWYoYT09PXRoaXMpcmV0dXJuITA7aWYoYS5OKCkpcmV0dXJuITE7aWYodGhpcy5BKCkuWihhLkEoKSkmJnRoaXMubS5jb3VudCgpPT09YS5tLmNvdW50KCkpe3ZhciBiPXRoaXMuV2IoTSk7YT1hLldiKE0pO2Zvcih2YXIgYz1IKGIpLGQ9SChhKTtjJiZkOyl7aWYoYy5uYW1lIT09ZC5uYW1lfHwhYy5TLlooZC5TKSlyZXR1cm4hMTtjPUgoYik7ZD1IKGEpfXJldHVybiBudWxsPT09YyYmbnVsbD09PWR9cmV0dXJuITF9O2Z1bmN0aW9uIG9lKGEsYil7cmV0dXJuIGI9PT1WZD9udWxsOmEud2IuZ2V0KGIudG9TdHJpbmcoKSl9aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBCKHRoaXMuSyghMCkpfTtmdW5jdGlvbiBMKGEsYil7aWYobnVsbD09PWEpcmV0dXJuIEM7dmFyIGM9bnVsbDtcIm9iamVjdFwiPT09dHlwZW9mIGEmJlwiLnByaW9yaXR5XCJpbiBhP2M9YVtcIi5wcmlvcml0eVwiXTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGImJihjPWIpO0oobnVsbD09PWN8fFwic3RyaW5nXCI9PT10eXBlb2YgY3x8XCJudW1iZXJcIj09PXR5cGVvZiBjfHxcIm9iamVjdFwiPT09dHlwZW9mIGMmJlwiLnN2XCJpbiBjLFwiSW52YWxpZCBwcmlvcml0eSB0eXBlIGZvdW5kOiBcIit0eXBlb2YgYyk7XCJvYmplY3RcIj09PXR5cGVvZiBhJiZcIi52YWx1ZVwiaW4gYSYmbnVsbCE9PWFbXCIudmFsdWVcIl0mJihhPWFbXCIudmFsdWVcIl0pO2lmKFwib2JqZWN0XCIhPT10eXBlb2YgYXx8XCIuc3ZcImluIGEpcmV0dXJuIG5ldyB0YyhhLEwoYykpO2lmKGEgaW5zdGFuY2VvZiBBcnJheSl7dmFyIGQ9QyxlPWE7cihlLGZ1bmN0aW9uKGEsYil7aWYodShlLGIpJiZcIi5cIiE9PWIuc3Vic3RyaW5nKDAsMSkpe3ZhciBjPUwoYSk7aWYoYy5OKCl8fCFjLmUoKSlkPVxuZC5RKGIsYyl9fSk7cmV0dXJuIGQuZGEoTChjKSl9dmFyIGY9W10sZz0hMSxrPWE7aGIoayxmdW5jdGlvbihhKXtpZihcInN0cmluZ1wiIT09dHlwZW9mIGF8fFwiLlwiIT09YS5zdWJzdHJpbmcoMCwxKSl7dmFyIGI9TChrW2FdKTtiLmUoKXx8KGc9Z3x8IWIuQSgpLmUoKSxmLnB1c2gobmV3IEUoYSxiKSkpfX0pO2lmKDA9PWYubGVuZ3RoKXJldHVybiBDO3ZhciBsPWhlKGYsUmIsZnVuY3Rpb24oYSl7cmV0dXJuIGEubmFtZX0sVGIpO2lmKGcpe3ZhciBtPWhlKGYsdWQoTSkpO3JldHVybiBuZXcgVChsLEwoYyksbmV3IGZlKHtcIi5wcmlvcml0eVwiOm19LHtcIi5wcmlvcml0eVwiOk19KSl9cmV0dXJuIG5ldyBUKGwsTChjKSxqZSl9dmFyIHBlPU1hdGgubG9nKDIpO1xuZnVuY3Rpb24gcWUoYSl7dGhpcy5jb3VudD1wYXJzZUludChNYXRoLmxvZyhhKzEpL3BlLDEwKTt0aGlzLmhmPXRoaXMuY291bnQtMTt0aGlzLmJnPWErMSZwYXJzZUludChBcnJheSh0aGlzLmNvdW50KzEpLmpvaW4oXCIxXCIpLDIpfWZ1bmN0aW9uIHJlKGEpe3ZhciBiPSEoYS5iZyYxPDxhLmhmKTthLmhmLS07cmV0dXJuIGJ9XG5mdW5jdGlvbiBoZShhLGIsYyxkKXtmdW5jdGlvbiBlKGIsZCl7dmFyIGY9ZC1iO2lmKDA9PWYpcmV0dXJuIG51bGw7aWYoMT09Zil7dmFyIG09YVtiXSx2PWM/YyhtKTptO3JldHVybiBuZXcgZmModixtLlMsITEsbnVsbCxudWxsKX12YXIgbT1wYXJzZUludChmLzIsMTApK2IsZj1lKGIsbSkseT1lKG0rMSxkKSxtPWFbbV0sdj1jP2MobSk6bTtyZXR1cm4gbmV3IGZjKHYsbS5TLCExLGYseSl9YS5zb3J0KGIpO3ZhciBmPWZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGQoYixnKXt2YXIgaz12LWIseT12O3YtPWI7dmFyIHk9ZShrKzEseSksaz1hW2tdLEk9Yz9jKGspOmsseT1uZXcgZmMoSSxrLlMsZyxudWxsLHkpO2Y/Zi5sZWZ0PXk6bT15O2Y9eX1mb3IodmFyIGY9bnVsbCxtPW51bGwsdj1hLmxlbmd0aCx5PTA7eTxiLmNvdW50OysreSl7dmFyIEk9cmUoYiksdmQ9TWF0aC5wb3coMixiLmNvdW50LSh5KzEpKTtJP2QodmQsITEpOihkKHZkLCExKSxkKHZkLCEwKSl9cmV0dXJuIG19KG5ldyBxZShhLmxlbmd0aCkpO1xucmV0dXJuIG51bGwhPT1mP25ldyBhYyhkfHxiLGYpOm5ldyBhYyhkfHxiKX1mdW5jdGlvbiBsZShhKXtyZXR1cm5cIm51bWJlclwiPT09dHlwZW9mIGE/XCJudW1iZXI6XCIrWmMoYSk6XCJzdHJpbmc6XCIrYX1mdW5jdGlvbiBrZShhKXtpZihhLk4oKSl7dmFyIGI9YS5LKCk7SihcInN0cmluZ1wiPT09dHlwZW9mIGJ8fFwibnVtYmVyXCI9PT10eXBlb2YgYnx8XCJvYmplY3RcIj09PXR5cGVvZiBiJiZ1KGIsXCIuc3ZcIiksXCJQcmlvcml0eSBtdXN0IGJlIGEgc3RyaW5nIG9yIG51bWJlci5cIil9ZWxzZSBKKGE9PT1TZHx8YS5lKCksXCJwcmlvcml0eSBvZiB1bmV4cGVjdGVkIHR5cGUuXCIpO0ooYT09PVNkfHxhLkEoKS5lKCksXCJQcmlvcml0eSBub2RlcyBjYW4ndCBoYXZlIGEgcHJpb3JpdHkgb2YgdGhlaXIgb3duLlwiKX12YXIgQz1uZXcgVChuZXcgYWMoVGIpLG51bGwsamUpO2Z1bmN0aW9uIHNlKCl7VC5jYWxsKHRoaXMsbmV3IGFjKFRiKSxDLGplKX1tYShzZSxUKTtoPXNlLnByb3RvdHlwZTtcbmguQ2M9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT10aGlzPzA6MX07aC5aPWZ1bmN0aW9uKGEpe3JldHVybiBhPT09dGhpc307aC5BPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O2guTT1mdW5jdGlvbigpe3JldHVybiBDfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4hMX07dmFyIFNkPW5ldyBzZSxRZD1uZXcgRShcIltNSU5fTkFNRV1cIixDKSxYZD1uZXcgRShcIltNQVhfTkFNRV1cIixTZCk7ZnVuY3Rpb24gSWQoYSxiKXt0aGlzLkQ9YTt0aGlzLlVkPWJ9ZnVuY3Rpb24gRmQoYSxiLGMsZCl7cmV0dXJuIG5ldyBJZChuZXcgc2IoYixjLGQpLGEuVWQpfWZ1bmN0aW9uIEpkKGEpe3JldHVybiBhLkQuJD9hLkQuaigpOm51bGx9SWQucHJvdG90eXBlLnU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5VZH07ZnVuY3Rpb24gdGIoYSl7cmV0dXJuIGEuVWQuJD9hLlVkLmooKTpudWxsfTtmdW5jdGlvbiB0ZShhLGIpe3RoaXMuVj1hO3ZhciBjPWEubixkPW5ldyBsZChjLmcpLGM9ZGUoYyk/bmV3IGxkKGMuZyk6Yy5pYT9uZXcgcmQoYyk6bmV3IG1kKGMpO3RoaXMuR2Y9bmV3IHpkKGMpO3ZhciBlPWIudSgpLGY9Yi5ELGc9ZC50YShDLGUuaigpLG51bGwpLGs9Yy50YShDLGYuaigpLG51bGwpO3RoaXMuS2E9bmV3IElkKG5ldyBzYihrLGYuJCxjLkdhKCkpLG5ldyBzYihnLGUuJCxkLkdhKCkpKTt0aGlzLlphPVtdO3RoaXMuaWc9bmV3IGRkKGEpfWZ1bmN0aW9uIHVlKGEpe3JldHVybiBhLlZ9aD10ZS5wcm90b3R5cGU7aC51PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuS2EudSgpLmooKX07aC5oYj1mdW5jdGlvbihhKXt2YXIgYj10Yih0aGlzLkthKTtyZXR1cm4gYiYmKGRlKHRoaXMuVi5uKXx8IWEuZSgpJiYhYi5NKE8oYSkpLmUoKSk/Yi5vYShhKTpudWxsfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gMD09PXRoaXMuWmEubGVuZ3RofTtoLk9iPWZ1bmN0aW9uKGEpe3RoaXMuWmEucHVzaChhKX07XG5oLmtiPWZ1bmN0aW9uKGEsYil7dmFyIGM9W107aWYoYil7SihudWxsPT1hLFwiQSBjYW5jZWwgc2hvdWxkIGNhbmNlbCBhbGwgZXZlbnQgcmVnaXN0cmF0aW9ucy5cIik7dmFyIGQ9dGhpcy5WLnBhdGg7T2EodGhpcy5aYSxmdW5jdGlvbihhKXsoYT1hLmZmKGIsZCkpJiZjLnB1c2goYSl9KX1pZihhKXtmb3IodmFyIGU9W10sZj0wO2Y8dGhpcy5aYS5sZW5ndGg7KytmKXt2YXIgZz10aGlzLlphW2ZdO2lmKCFnLm1hdGNoZXMoYSkpZS5wdXNoKGcpO2Vsc2UgaWYoYS5zZigpKXtlPWUuY29uY2F0KHRoaXMuWmEuc2xpY2UoZisxKSk7YnJlYWt9fXRoaXMuWmE9ZX1lbHNlIHRoaXMuWmE9W107cmV0dXJuIGN9O1xuaC5iYj1mdW5jdGlvbihhLGIsYyl7YS50eXBlPT09Q2QmJm51bGwhPT1hLnNvdXJjZS5JYiYmKEoodGIodGhpcy5LYSksXCJXZSBzaG91bGQgYWx3YXlzIGhhdmUgYSBmdWxsIGNhY2hlIGJlZm9yZSBoYW5kbGluZyBtZXJnZXNcIiksSihKZCh0aGlzLkthKSxcIk1pc3NpbmcgZXZlbnQgY2FjaGUsIGV2ZW4gdGhvdWdoIHdlIGhhdmUgYSBzZXJ2ZXIgY2FjaGVcIikpO3ZhciBkPXRoaXMuS2E7YT10aGlzLkdmLmJiKGQsYSxiLGMpO2I9dGhpcy5HZjtjPWEuaGU7SihjLkQuaigpLkljKGIuSS5nKSxcIkV2ZW50IHNuYXAgbm90IGluZGV4ZWRcIik7SihjLnUoKS5qKCkuSWMoYi5JLmcpLFwiU2VydmVyIHNuYXAgbm90IGluZGV4ZWRcIik7SihIYihhLmhlLnUoKSl8fCFIYihkLnUoKSksXCJPbmNlIGEgc2VydmVyIHNuYXAgaXMgY29tcGxldGUsIGl0IHNob3VsZCBuZXZlciBnbyBiYWNrXCIpO3RoaXMuS2E9YS5oZTtyZXR1cm4gdmUodGhpcyxhLmNnLGEuaGUuRC5qKCksbnVsbCl9O1xuZnVuY3Rpb24gd2UoYSxiKXt2YXIgYz1hLkthLkQsZD1bXTtjLmooKS5OKCl8fGMuaigpLlUoTSxmdW5jdGlvbihhLGIpe2QucHVzaChuZXcgRChcImNoaWxkX2FkZGVkXCIsYixhKSl9KTtjLiQmJmQucHVzaChEYihjLmooKSkpO3JldHVybiB2ZShhLGQsYy5qKCksYil9ZnVuY3Rpb24gdmUoYSxiLGMsZCl7cmV0dXJuIGVkKGEuaWcsYixjLGQ/W2RdOmEuWmEpfTtmdW5jdGlvbiB4ZShhLGIsYyl7dGhpcy50eXBlPUNkO3RoaXMuc291cmNlPWE7dGhpcy5wYXRoPWI7dGhpcy5jaGlsZHJlbj1jfXhlLnByb3RvdHlwZS5XYz1mdW5jdGlvbihhKXtpZih0aGlzLnBhdGguZSgpKXJldHVybiBhPXRoaXMuY2hpbGRyZW4uc3VidHJlZShuZXcgSyhhKSksYS5lKCk/bnVsbDphLnZhbHVlP25ldyBVYih0aGlzLnNvdXJjZSxGLGEudmFsdWUpOm5ldyB4ZSh0aGlzLnNvdXJjZSxGLGEpO0ooTyh0aGlzLnBhdGgpPT09YSxcIkNhbid0IGdldCBhIG1lcmdlIGZvciBhIGNoaWxkIG5vdCBvbiB0aGUgcGF0aCBvZiB0aGUgb3BlcmF0aW9uXCIpO3JldHVybiBuZXcgeGUodGhpcy5zb3VyY2UsRyh0aGlzLnBhdGgpLHRoaXMuY2hpbGRyZW4pfTt4ZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIk9wZXJhdGlvbihcIit0aGlzLnBhdGgrXCI6IFwiK3RoaXMuc291cmNlLnRvU3RyaW5nKCkrXCIgbWVyZ2U6IFwiK3RoaXMuY2hpbGRyZW4udG9TdHJpbmcoKStcIilcIn07dmFyIFZiPTAsQ2Q9MSxYYj0yLCRiPTM7ZnVuY3Rpb24geWUoYSxiLGMsZCl7dGhpcy52ZT1hO3RoaXMub2Y9Yjt0aGlzLkliPWM7dGhpcy5hZj1kO0ooIWR8fGIsXCJUYWdnZWQgcXVlcmllcyBtdXN0IGJlIGZyb20gc2VydmVyLlwiKX12YXIgWWI9bmV3IHllKCEwLCExLG51bGwsITEpLHplPW5ldyB5ZSghMSwhMCxudWxsLCExKTt5ZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52ZT9cInVzZXJcIjp0aGlzLmFmP1wic2VydmVyKHF1ZXJ5SUQ9XCIrdGhpcy5JYitcIilcIjpcInNlcnZlclwifTtmdW5jdGlvbiBBZShhLGIpe3RoaXMuZj1PYyhcInA6cmVzdDpcIik7dGhpcy5IPWE7dGhpcy5HYj1iO3RoaXMuRmE9bnVsbDt0aGlzLmFhPXt9fWZ1bmN0aW9uIEJlKGEsYil7aWYobihiKSlyZXR1cm5cInRhZyRcIitiO3ZhciBjPWEubjtKKGRlKGMpJiZjLmc9PU0sXCJzaG91bGQgaGF2ZSBhIHRhZyBpZiBpdCdzIG5vdCBhIGRlZmF1bHQgcXVlcnkuXCIpO3JldHVybiBhLnBhdGgudG9TdHJpbmcoKX1oPUFlLnByb3RvdHlwZTtcbmgueGY9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YS5wYXRoLnRvU3RyaW5nKCk7dGhpcy5mKFwiTGlzdGVuIGNhbGxlZCBmb3IgXCIrZStcIiBcIithLndhKCkpO3ZhciBmPUJlKGEsYyksZz17fTt0aGlzLmFhW2ZdPWc7YT1lZShhLm4pO3ZhciBrPXRoaXM7Q2UodGhpcyxlK1wiLmpzb25cIixhLGZ1bmN0aW9uKGEsYil7dmFyIHY9Yjs0MDQ9PT1hJiYoYT12PW51bGwpO251bGw9PT1hJiZrLkdiKGUsdiwhMSxjKTt3KGsuYWEsZik9PT1nJiZkKGE/NDAxPT1hP1wicGVybWlzc2lvbl9kZW5pZWRcIjpcInJlc3RfZXJyb3I6XCIrYTpcIm9rXCIsbnVsbCl9KX07aC5PZj1mdW5jdGlvbihhLGIpe3ZhciBjPUJlKGEsYik7ZGVsZXRlIHRoaXMuYWFbY119O2guUD1mdW5jdGlvbihhLGIpe3RoaXMuRmE9YTt2YXIgYz1hZChhKSxkPWMuZGF0YSxjPWMuQWMmJmMuQWMuZXhwO2ImJmIoXCJva1wiLHthdXRoOmQsZXhwaXJlczpjfSl9O2guZWU9ZnVuY3Rpb24oYSl7dGhpcy5GYT1udWxsO2EoXCJva1wiLG51bGwpfTtcbmguTGU9ZnVuY3Rpb24oKXt9O2guQmY9ZnVuY3Rpb24oKXt9O2guR2Q9ZnVuY3Rpb24oKXt9O2gucHV0PWZ1bmN0aW9uKCl7fTtoLnlmPWZ1bmN0aW9uKCl7fTtoLlRlPWZ1bmN0aW9uKCl7fTtcbmZ1bmN0aW9uIENlKGEsYixjLGQpe2M9Y3x8e307Yy5mb3JtYXQ9XCJleHBvcnRcIjthLkZhJiYoYy5hdXRoPWEuRmEpO3ZhciBlPShhLkgubGI/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKSthLkguaG9zdCtiK1wiP1wiK2piKGMpO2EuZihcIlNlbmRpbmcgUkVTVCByZXF1ZXN0IGZvciBcIitlKTt2YXIgZj1uZXcgWE1MSHR0cFJlcXVlc3Q7Zi5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtpZihkJiY0PT09Zi5yZWFkeVN0YXRlKXthLmYoXCJSRVNUIFJlc3BvbnNlIGZvciBcIitlK1wiIHJlY2VpdmVkLiBzdGF0dXM6XCIsZi5zdGF0dXMsXCJyZXNwb25zZTpcIixmLnJlc3BvbnNlVGV4dCk7dmFyIGI9bnVsbDtpZigyMDA8PWYuc3RhdHVzJiYzMDA+Zi5zdGF0dXMpe3RyeXtiPW1iKGYucmVzcG9uc2VUZXh0KX1jYXRjaChjKXtRKFwiRmFpbGVkIHRvIHBhcnNlIEpTT04gcmVzcG9uc2UgZm9yIFwiK2UrXCI6IFwiK2YucmVzcG9uc2VUZXh0KX1kKG51bGwsYil9ZWxzZSA0MDEhPT1mLnN0YXR1cyYmNDA0IT09XG5mLnN0YXR1cyYmUShcIkdvdCB1bnN1Y2Nlc3NmdWwgUkVTVCByZXNwb25zZSBmb3IgXCIrZStcIiBTdGF0dXM6IFwiK2Yuc3RhdHVzKSxkKGYuc3RhdHVzKTtkPW51bGx9fTtmLm9wZW4oXCJHRVRcIixlLCEwKTtmLnNlbmQoKX07ZnVuY3Rpb24gRGUoYSxiKXt0aGlzLnZhbHVlPWE7dGhpcy5jaGlsZHJlbj1ifHxFZX12YXIgRWU9bmV3IGFjKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9PT1iPzA6YTxiPy0xOjF9KTtmdW5jdGlvbiBGZShhKXt2YXIgYj1OZDtyKGEsZnVuY3Rpb24oYSxkKXtiPWIuc2V0KG5ldyBLKGQpLGEpfSk7cmV0dXJuIGJ9aD1EZS5wcm90b3R5cGU7aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGw9PT10aGlzLnZhbHVlJiZ0aGlzLmNoaWxkcmVuLmUoKX07ZnVuY3Rpb24gR2UoYSxiLGMpe2lmKG51bGwhPWEudmFsdWUmJmMoYS52YWx1ZSkpcmV0dXJue3BhdGg6Rix2YWx1ZTphLnZhbHVlfTtpZihiLmUoKSlyZXR1cm4gbnVsbDt2YXIgZD1PKGIpO2E9YS5jaGlsZHJlbi5nZXQoZCk7cmV0dXJuIG51bGwhPT1hPyhiPUdlKGEsRyhiKSxjKSxudWxsIT1iP3twYXRoOihuZXcgSyhkKSkudyhiLnBhdGgpLHZhbHVlOmIudmFsdWV9Om51bGwpOm51bGx9XG5mdW5jdGlvbiBIZShhLGIpe3JldHVybiBHZShhLGIsZnVuY3Rpb24oKXtyZXR1cm4hMH0pfWguc3VidHJlZT1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLmNoaWxkcmVuLmdldChPKGEpKTtyZXR1cm4gbnVsbCE9PWI/Yi5zdWJ0cmVlKEcoYSkpOk5kfTtoLnNldD1mdW5jdGlvbihhLGIpe2lmKGEuZSgpKXJldHVybiBuZXcgRGUoYix0aGlzLmNoaWxkcmVuKTt2YXIgYz1PKGEpLGQ9KHRoaXMuY2hpbGRyZW4uZ2V0KGMpfHxOZCkuc2V0KEcoYSksYiksYz10aGlzLmNoaWxkcmVuLk5hKGMsZCk7cmV0dXJuIG5ldyBEZSh0aGlzLnZhbHVlLGMpfTtcbmgucmVtb3ZlPWZ1bmN0aW9uKGEpe2lmKGEuZSgpKXJldHVybiB0aGlzLmNoaWxkcmVuLmUoKT9OZDpuZXcgRGUobnVsbCx0aGlzLmNoaWxkcmVuKTt2YXIgYj1PKGEpLGM9dGhpcy5jaGlsZHJlbi5nZXQoYik7cmV0dXJuIGM/KGE9Yy5yZW1vdmUoRyhhKSksYj1hLmUoKT90aGlzLmNoaWxkcmVuLnJlbW92ZShiKTp0aGlzLmNoaWxkcmVuLk5hKGIsYSksbnVsbD09PXRoaXMudmFsdWUmJmIuZSgpP05kOm5ldyBEZSh0aGlzLnZhbHVlLGIpKTp0aGlzfTtoLmdldD1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gdGhpcy52YWx1ZTt2YXIgYj10aGlzLmNoaWxkcmVuLmdldChPKGEpKTtyZXR1cm4gYj9iLmdldChHKGEpKTpudWxsfTtcbmZ1bmN0aW9uIE1kKGEsYixjKXtpZihiLmUoKSlyZXR1cm4gYzt2YXIgZD1PKGIpO2I9TWQoYS5jaGlsZHJlbi5nZXQoZCl8fE5kLEcoYiksYyk7ZD1iLmUoKT9hLmNoaWxkcmVuLnJlbW92ZShkKTphLmNoaWxkcmVuLk5hKGQsYik7cmV0dXJuIG5ldyBEZShhLnZhbHVlLGQpfWZ1bmN0aW9uIEllKGEsYil7cmV0dXJuIEplKGEsRixiKX1mdW5jdGlvbiBKZShhLGIsYyl7dmFyIGQ9e307YS5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGYpe2RbYV09SmUoZixiLncoYSksYyl9KTtyZXR1cm4gYyhiLGEudmFsdWUsZCl9ZnVuY3Rpb24gS2UoYSxiLGMpe3JldHVybiBMZShhLGIsRixjKX1mdW5jdGlvbiBMZShhLGIsYyxkKXt2YXIgZT1hLnZhbHVlP2QoYyxhLnZhbHVlKTohMTtpZihlKXJldHVybiBlO2lmKGIuZSgpKXJldHVybiBudWxsO2U9TyhiKTtyZXR1cm4oYT1hLmNoaWxkcmVuLmdldChlKSk/TGUoYSxHKGIpLGMudyhlKSxkKTpudWxsfVxuZnVuY3Rpb24gTWUoYSxiLGMpe3ZhciBkPUY7aWYoIWIuZSgpKXt2YXIgZT0hMDthLnZhbHVlJiYoZT1jKGQsYS52YWx1ZSkpOyEwPT09ZSYmKGU9TyhiKSwoYT1hLmNoaWxkcmVuLmdldChlKSkmJk5lKGEsRyhiKSxkLncoZSksYykpfX1mdW5jdGlvbiBOZShhLGIsYyxkKXtpZihiLmUoKSlyZXR1cm4gYTthLnZhbHVlJiZkKGMsYS52YWx1ZSk7dmFyIGU9TyhiKTtyZXR1cm4oYT1hLmNoaWxkcmVuLmdldChlKSk/TmUoYSxHKGIpLGMudyhlKSxkKTpOZH1mdW5jdGlvbiBLZChhLGIpe09lKGEsRixiKX1mdW5jdGlvbiBPZShhLGIsYyl7YS5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGUpe09lKGUsYi53KGEpLGMpfSk7YS52YWx1ZSYmYyhiLGEudmFsdWUpfWZ1bmN0aW9uIFBlKGEsYil7YS5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGQpe2QudmFsdWUmJmIoYSxkLnZhbHVlKX0pfXZhciBOZD1uZXcgRGUobnVsbCk7XG5EZS5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt2YXIgYT17fTtLZCh0aGlzLGZ1bmN0aW9uKGIsYyl7YVtiLnRvU3RyaW5nKCldPWMudG9TdHJpbmcoKX0pO3JldHVybiBCKGEpfTtmdW5jdGlvbiBRZShhKXt0aGlzLlc9YX12YXIgUmU9bmV3IFFlKG5ldyBEZShudWxsKSk7ZnVuY3Rpb24gU2UoYSxiLGMpe2lmKGIuZSgpKXJldHVybiBuZXcgUWUobmV3IERlKGMpKTt2YXIgZD1IZShhLlcsYik7aWYobnVsbCE9ZCl7dmFyIGU9ZC5wYXRoLGQ9ZC52YWx1ZTtiPU4oZSxiKTtkPWQuRyhiLGMpO3JldHVybiBuZXcgUWUoYS5XLnNldChlLGQpKX1hPU1kKGEuVyxiLG5ldyBEZShjKSk7cmV0dXJuIG5ldyBRZShhKX1mdW5jdGlvbiBUZShhLGIsYyl7dmFyIGQ9YTtoYihjLGZ1bmN0aW9uKGEsYyl7ZD1TZShkLGIudyhhKSxjKX0pO3JldHVybiBkfVFlLnByb3RvdHlwZS5PZD1mdW5jdGlvbihhKXtpZihhLmUoKSlyZXR1cm4gUmU7YT1NZCh0aGlzLlcsYSxOZCk7cmV0dXJuIG5ldyBRZShhKX07ZnVuY3Rpb24gVWUoYSxiKXt2YXIgYz1IZShhLlcsYik7cmV0dXJuIG51bGwhPWM/YS5XLmdldChjLnBhdGgpLm9hKE4oYy5wYXRoLGIpKTpudWxsfVxuZnVuY3Rpb24gVmUoYSl7dmFyIGI9W10sYz1hLlcudmFsdWU7bnVsbCE9Yz9jLk4oKXx8Yy5VKE0sZnVuY3Rpb24oYSxjKXtiLnB1c2gobmV3IEUoYSxjKSl9KTphLlcuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYSxjKXtudWxsIT1jLnZhbHVlJiZiLnB1c2gobmV3IEUoYSxjLnZhbHVlKSl9KTtyZXR1cm4gYn1mdW5jdGlvbiBXZShhLGIpe2lmKGIuZSgpKXJldHVybiBhO3ZhciBjPVVlKGEsYik7cmV0dXJuIG51bGwhPWM/bmV3IFFlKG5ldyBEZShjKSk6bmV3IFFlKGEuVy5zdWJ0cmVlKGIpKX1RZS5wcm90b3R5cGUuZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLlcuZSgpfTtRZS5wcm90b3R5cGUuYXBwbHk9ZnVuY3Rpb24oYSl7cmV0dXJuIFhlKEYsdGhpcy5XLGEpfTtcbmZ1bmN0aW9uIFhlKGEsYixjKXtpZihudWxsIT1iLnZhbHVlKXJldHVybiBjLkcoYSxiLnZhbHVlKTt2YXIgZD1udWxsO2IuY2hpbGRyZW4uaGEoZnVuY3Rpb24oYixmKXtcIi5wcmlvcml0eVwiPT09Yj8oSihudWxsIT09Zi52YWx1ZSxcIlByaW9yaXR5IHdyaXRlcyBtdXN0IGFsd2F5cyBiZSBsZWFmIG5vZGVzXCIpLGQ9Zi52YWx1ZSk6Yz1YZShhLncoYiksZixjKX0pO2Mub2EoYSkuZSgpfHxudWxsPT09ZHx8KGM9Yy5HKGEudyhcIi5wcmlvcml0eVwiKSxkKSk7cmV0dXJuIGN9O2Z1bmN0aW9uIFllKCl7dGhpcy5UPVJlO3RoaXMuemE9W107dGhpcy5MYz0tMX1oPVllLnByb3RvdHlwZTtcbmguT2Q9ZnVuY3Rpb24oYSl7dmFyIGI9VWEodGhpcy56YSxmdW5jdGlvbihiKXtyZXR1cm4gYi5pZT09PWF9KTtKKDA8PWIsXCJyZW1vdmVXcml0ZSBjYWxsZWQgd2l0aCBub25leGlzdGVudCB3cml0ZUlkLlwiKTt2YXIgYz10aGlzLnphW2JdO3RoaXMuemEuc3BsaWNlKGIsMSk7Zm9yKHZhciBkPWMudmlzaWJsZSxlPSExLGY9dGhpcy56YS5sZW5ndGgtMTtkJiYwPD1mOyl7dmFyIGc9dGhpcy56YVtmXTtnLnZpc2libGUmJihmPj1iJiZaZShnLGMucGF0aCk/ZD0hMTpjLnBhdGguY29udGFpbnMoZy5wYXRoKSYmKGU9ITApKTtmLS19aWYoZCl7aWYoZSl0aGlzLlQ9JGUodGhpcy56YSxhZixGKSx0aGlzLkxjPTA8dGhpcy56YS5sZW5ndGg/dGhpcy56YVt0aGlzLnphLmxlbmd0aC0xXS5pZTotMTtlbHNlIGlmKGMuSWEpdGhpcy5UPXRoaXMuVC5PZChjLnBhdGgpO2Vsc2V7dmFyIGs9dGhpcztyKGMuY2hpbGRyZW4sZnVuY3Rpb24oYSxiKXtrLlQ9ay5ULk9kKGMucGF0aC53KGIpKX0pfXJldHVybiBjLnBhdGh9cmV0dXJuIG51bGx9O1xuaC51YT1mdW5jdGlvbihhLGIsYyxkKXtpZihjfHxkKXt2YXIgZT1XZSh0aGlzLlQsYSk7cmV0dXJuIWQmJmUuZSgpP2I6ZHx8bnVsbCE9Ynx8bnVsbCE9VWUoZSxGKT8oZT0kZSh0aGlzLnphLGZ1bmN0aW9uKGIpe3JldHVybihiLnZpc2libGV8fGQpJiYoIWN8fCEoMDw9TmEoYyxiLmllKSkpJiYoYi5wYXRoLmNvbnRhaW5zKGEpfHxhLmNvbnRhaW5zKGIucGF0aCkpfSxhKSxiPWJ8fEMsZS5hcHBseShiKSk6bnVsbH1lPVVlKHRoaXMuVCxhKTtpZihudWxsIT1lKXJldHVybiBlO2U9V2UodGhpcy5ULGEpO3JldHVybiBlLmUoKT9iOm51bGwhPWJ8fG51bGwhPVVlKGUsRik/KGI9Ynx8QyxlLmFwcGx5KGIpKTpudWxsfTtcbmgueGM9ZnVuY3Rpb24oYSxiKXt2YXIgYz1DLGQ9VWUodGhpcy5ULGEpO2lmKGQpZC5OKCl8fGQuVShNLGZ1bmN0aW9uKGEsYil7Yz1jLlEoYSxiKX0pO2Vsc2UgaWYoYil7dmFyIGU9V2UodGhpcy5ULGEpO2IuVShNLGZ1bmN0aW9uKGEsYil7dmFyIGQ9V2UoZSxuZXcgSyhhKSkuYXBwbHkoYik7Yz1jLlEoYSxkKX0pO09hKFZlKGUpLGZ1bmN0aW9uKGEpe2M9Yy5RKGEubmFtZSxhLlMpfSl9ZWxzZSBlPVdlKHRoaXMuVCxhKSxPYShWZShlKSxmdW5jdGlvbihhKXtjPWMuUShhLm5hbWUsYS5TKX0pO3JldHVybiBjfTtoLmhkPWZ1bmN0aW9uKGEsYixjLGQpe0ooY3x8ZCxcIkVpdGhlciBleGlzdGluZ0V2ZW50U25hcCBvciBleGlzdGluZ1NlcnZlclNuYXAgbXVzdCBleGlzdFwiKTthPWEudyhiKTtpZihudWxsIT1VZSh0aGlzLlQsYSkpcmV0dXJuIG51bGw7YT1XZSh0aGlzLlQsYSk7cmV0dXJuIGEuZSgpP2Qub2EoYik6YS5hcHBseShkLm9hKGIpKX07XG5oLlhhPWZ1bmN0aW9uKGEsYixjKXthPWEudyhiKTt2YXIgZD1VZSh0aGlzLlQsYSk7cmV0dXJuIG51bGwhPWQ/ZDpyYihjLGIpP1dlKHRoaXMuVCxhKS5hcHBseShjLmooKS5NKGIpKTpudWxsfTtoLnNjPWZ1bmN0aW9uKGEpe3JldHVybiBVZSh0aGlzLlQsYSl9O2gubWU9ZnVuY3Rpb24oYSxiLGMsZCxlLGYpe3ZhciBnO2E9V2UodGhpcy5ULGEpO2c9VWUoYSxGKTtpZihudWxsPT1nKWlmKG51bGwhPWIpZz1hLmFwcGx5KGIpO2Vsc2UgcmV0dXJuW107Zz1nLm1iKGYpO2lmKGcuZSgpfHxnLk4oKSlyZXR1cm5bXTtiPVtdO2E9dWQoZik7ZT1lP2cuWmIoYyxmKTpnLlhiKGMsZik7Zm9yKGY9SChlKTtmJiZiLmxlbmd0aDxkOykwIT09YShmLGMpJiZiLnB1c2goZiksZj1IKGUpO3JldHVybiBifTtcbmZ1bmN0aW9uIFplKGEsYil7cmV0dXJuIGEuSWE/YS5wYXRoLmNvbnRhaW5zKGIpOiEhdWEoYS5jaGlsZHJlbixmdW5jdGlvbihjLGQpe3JldHVybiBhLnBhdGgudyhkKS5jb250YWlucyhiKX0pfWZ1bmN0aW9uIGFmKGEpe3JldHVybiBhLnZpc2libGV9XG5mdW5jdGlvbiAkZShhLGIsYyl7Zm9yKHZhciBkPVJlLGU9MDtlPGEubGVuZ3RoOysrZSl7dmFyIGY9YVtlXTtpZihiKGYpKXt2YXIgZz1mLnBhdGg7aWYoZi5JYSljLmNvbnRhaW5zKGcpPyhnPU4oYyxnKSxkPVNlKGQsZyxmLklhKSk6Zy5jb250YWlucyhjKSYmKGc9TihnLGMpLGQ9U2UoZCxGLGYuSWEub2EoZykpKTtlbHNlIGlmKGYuY2hpbGRyZW4paWYoYy5jb250YWlucyhnKSlnPU4oYyxnKSxkPVRlKGQsZyxmLmNoaWxkcmVuKTtlbHNle2lmKGcuY29udGFpbnMoYykpaWYoZz1OKGcsYyksZy5lKCkpZD1UZShkLEYsZi5jaGlsZHJlbik7ZWxzZSBpZihmPXcoZi5jaGlsZHJlbixPKGcpKSlmPWYub2EoRyhnKSksZD1TZShkLEYsZil9ZWxzZSB0aHJvdyBIYyhcIldyaXRlUmVjb3JkIHNob3VsZCBoYXZlIC5zbmFwIG9yIC5jaGlsZHJlblwiKTt9fXJldHVybiBkfWZ1bmN0aW9uIGJmKGEsYil7dGhpcy5NYj1hO3RoaXMuVz1ifWg9YmYucHJvdG90eXBlO1xuaC51YT1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHRoaXMuVy51YSh0aGlzLk1iLGEsYixjKX07aC54Yz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5XLnhjKHRoaXMuTWIsYSl9O2guaGQ9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0aGlzLlcuaGQodGhpcy5NYixhLGIsYyl9O2guc2M9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuVy5zYyh0aGlzLk1iLncoYSkpfTtoLm1lPWZ1bmN0aW9uKGEsYixjLGQsZSl7cmV0dXJuIHRoaXMuVy5tZSh0aGlzLk1iLGEsYixjLGQsZSl9O2guWGE9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5XLlhhKHRoaXMuTWIsYSxiKX07aC53PWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgYmYodGhpcy5NYi53KGEpLHRoaXMuVyl9O2Z1bmN0aW9uIGNmKCl7dGhpcy55YT17fX1oPWNmLnByb3RvdHlwZTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gd2EodGhpcy55YSl9O2guYmI9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEuc291cmNlLkliO2lmKG51bGwhPT1kKXJldHVybiBkPXcodGhpcy55YSxkKSxKKG51bGwhPWQsXCJTeW5jVHJlZSBnYXZlIHVzIGFuIG9wIGZvciBhbiBpbnZhbGlkIHF1ZXJ5LlwiKSxkLmJiKGEsYixjKTt2YXIgZT1bXTtyKHRoaXMueWEsZnVuY3Rpb24oZCl7ZT1lLmNvbmNhdChkLmJiKGEsYixjKSl9KTtyZXR1cm4gZX07aC5PYj1mdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmPWEud2EoKSxnPXcodGhpcy55YSxmKTtpZighZyl7dmFyIGc9Yy51YShlP2Q6bnVsbCksaz0hMTtnP2s9ITA6KGc9ZCBpbnN0YW5jZW9mIFQ/Yy54YyhkKTpDLGs9ITEpO2c9bmV3IHRlKGEsbmV3IElkKG5ldyBzYihnLGssITEpLG5ldyBzYihkLGUsITEpKSk7dGhpcy55YVtmXT1nfWcuT2IoYik7cmV0dXJuIHdlKGcsYil9O1xuaC5rYj1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9YS53YSgpLGU9W10sZj1bXSxnPW51bGwhPWRmKHRoaXMpO2lmKFwiZGVmYXVsdFwiPT09ZCl7dmFyIGs9dGhpcztyKHRoaXMueWEsZnVuY3Rpb24oYSxkKXtmPWYuY29uY2F0KGEua2IoYixjKSk7YS5lKCkmJihkZWxldGUgay55YVtkXSxkZShhLlYubil8fGUucHVzaChhLlYpKX0pfWVsc2V7dmFyIGw9dyh0aGlzLnlhLGQpO2wmJihmPWYuY29uY2F0KGwua2IoYixjKSksbC5lKCkmJihkZWxldGUgdGhpcy55YVtkXSxkZShsLlYubil8fGUucHVzaChsLlYpKSl9ZyYmbnVsbD09ZGYodGhpcykmJmUucHVzaChuZXcgVShhLmssYS5wYXRoKSk7cmV0dXJue0hnOmUsamc6Zn19O2Z1bmN0aW9uIGVmKGEpe3JldHVybiBQYShyYShhLnlhKSxmdW5jdGlvbihhKXtyZXR1cm4hZGUoYS5WLm4pfSl9aC5oYj1mdW5jdGlvbihhKXt2YXIgYj1udWxsO3IodGhpcy55YSxmdW5jdGlvbihjKXtiPWJ8fGMuaGIoYSl9KTtyZXR1cm4gYn07XG5mdW5jdGlvbiBmZihhLGIpe2lmKGRlKGIubikpcmV0dXJuIGRmKGEpO3ZhciBjPWIud2EoKTtyZXR1cm4gdyhhLnlhLGMpfWZ1bmN0aW9uIGRmKGEpe3JldHVybiB2YShhLnlhLGZ1bmN0aW9uKGEpe3JldHVybiBkZShhLlYubil9KXx8bnVsbH07ZnVuY3Rpb24gZ2YoYSl7dGhpcy5zYT1OZDt0aGlzLkhiPW5ldyBZZTt0aGlzLiRlPXt9O3RoaXMua2M9e307dGhpcy5NYz1hfWZ1bmN0aW9uIGhmKGEsYixjLGQsZSl7dmFyIGY9YS5IYixnPWU7SihkPmYuTGMsXCJTdGFja2luZyBhbiBvbGRlciB3cml0ZSBvbiB0b3Agb2YgbmV3ZXIgb25lc1wiKTtuKGcpfHwoZz0hMCk7Zi56YS5wdXNoKHtwYXRoOmIsSWE6YyxpZTpkLHZpc2libGU6Z30pO2cmJihmLlQ9U2UoZi5ULGIsYykpO2YuTGM9ZDtyZXR1cm4gZT9qZihhLG5ldyBVYihZYixiLGMpKTpbXX1mdW5jdGlvbiBrZihhLGIsYyxkKXt2YXIgZT1hLkhiO0ooZD5lLkxjLFwiU3RhY2tpbmcgYW4gb2xkZXIgbWVyZ2Ugb24gdG9wIG9mIG5ld2VyIG9uZXNcIik7ZS56YS5wdXNoKHtwYXRoOmIsY2hpbGRyZW46YyxpZTpkLHZpc2libGU6ITB9KTtlLlQ9VGUoZS5ULGIsYyk7ZS5MYz1kO2M9RmUoYyk7cmV0dXJuIGpmKGEsbmV3IHhlKFliLGIsYykpfVxuZnVuY3Rpb24gbGYoYSxiLGMpe2M9Y3x8ITE7Yj1hLkhiLk9kKGIpO3JldHVybiBudWxsPT1iP1tdOmpmKGEsbmV3IFdiKGIsYykpfWZ1bmN0aW9uIG1mKGEsYixjKXtjPUZlKGMpO3JldHVybiBqZihhLG5ldyB4ZSh6ZSxiLGMpKX1mdW5jdGlvbiBuZihhLGIsYyxkKXtkPW9mKGEsZCk7aWYobnVsbCE9ZCl7dmFyIGU9cGYoZCk7ZD1lLnBhdGg7ZT1lLkliO2I9TihkLGIpO2M9bmV3IFViKG5ldyB5ZSghMSwhMCxlLCEwKSxiLGMpO3JldHVybiBxZihhLGQsYyl9cmV0dXJuW119ZnVuY3Rpb24gcmYoYSxiLGMsZCl7aWYoZD1vZihhLGQpKXt2YXIgZT1wZihkKTtkPWUucGF0aDtlPWUuSWI7Yj1OKGQsYik7Yz1GZShjKTtjPW5ldyB4ZShuZXcgeWUoITEsITAsZSwhMCksYixjKTtyZXR1cm4gcWYoYSxkLGMpfXJldHVybltdfVxuZ2YucHJvdG90eXBlLk9iPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5wYXRoLGQ9bnVsbCxlPSExO01lKHRoaXMuc2EsYyxmdW5jdGlvbihhLGIpe3ZhciBmPU4oYSxjKTtkPWIuaGIoZik7ZT1lfHxudWxsIT1kZihiKTtyZXR1cm4hZH0pO3ZhciBmPXRoaXMuc2EuZ2V0KGMpO2Y/KGU9ZXx8bnVsbCE9ZGYoZiksZD1kfHxmLmhiKEYpKTooZj1uZXcgY2YsdGhpcy5zYT10aGlzLnNhLnNldChjLGYpKTt2YXIgZztudWxsIT1kP2c9ITA6KGc9ITEsZD1DLFBlKHRoaXMuc2Euc3VidHJlZShjKSxmdW5jdGlvbihhLGIpe3ZhciBjPWIuaGIoRik7YyYmKGQ9ZC5RKGEsYykpfSkpO3ZhciBrPW51bGwhPWZmKGYsYSk7aWYoIWsmJiFkZShhLm4pKXt2YXIgbD1zZihhKTtKKCEobCBpbiB0aGlzLmtjKSxcIlZpZXcgZG9lcyBub3QgZXhpc3QsIGJ1dCB3ZSBoYXZlIGEgdGFnXCIpO3ZhciBtPXRmKys7dGhpcy5rY1tsXT1tO3RoaXMuJGVbXCJfXCIrbV09bH1nPWYuT2IoYSxiLG5ldyBiZihjLHRoaXMuSGIpLFxuZCxnKTtrfHxlfHwoZj1mZihmLGEpLGc9Zy5jb25jYXQodWYodGhpcyxhLGYpKSk7cmV0dXJuIGd9O1xuZ2YucHJvdG90eXBlLmtiPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLnBhdGgsZT10aGlzLnNhLmdldChkKSxmPVtdO2lmKGUmJihcImRlZmF1bHRcIj09PWEud2EoKXx8bnVsbCE9ZmYoZSxhKSkpe2Y9ZS5rYihhLGIsYyk7ZS5lKCkmJih0aGlzLnNhPXRoaXMuc2EucmVtb3ZlKGQpKTtlPWYuSGc7Zj1mLmpnO2I9LTEhPT1VYShlLGZ1bmN0aW9uKGEpe3JldHVybiBkZShhLm4pfSk7dmFyIGc9S2UodGhpcy5zYSxkLGZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGwhPWRmKGIpfSk7aWYoYiYmIWcmJihkPXRoaXMuc2Euc3VidHJlZShkKSwhZC5lKCkpKWZvcih2YXIgZD12ZihkKSxrPTA7azxkLmxlbmd0aDsrK2spe3ZhciBsPWRba10sbT1sLlYsbD13Zih0aGlzLGwpO3RoaXMuTWMuWGUobSx4Zih0aGlzLG0pLGwudWQsbC5KKX1pZighZyYmMDxlLmxlbmd0aCYmIWMpaWYoYil0aGlzLk1jLlpkKGEsbnVsbCk7ZWxzZXt2YXIgdj10aGlzO09hKGUsZnVuY3Rpb24oYSl7YS53YSgpO3ZhciBiPXYua2Nbc2YoYSldO1xudi5NYy5aZChhLGIpfSl9eWYodGhpcyxlKX1yZXR1cm4gZn07Z2YucHJvdG90eXBlLnVhPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5IYixkPUtlKHRoaXMuc2EsYSxmdW5jdGlvbihiLGMpe3ZhciBkPU4oYixhKTtpZihkPWMuaGIoZCkpcmV0dXJuIGR9KTtyZXR1cm4gYy51YShhLGQsYiwhMCl9O2Z1bmN0aW9uIHZmKGEpe3JldHVybiBJZShhLGZ1bmN0aW9uKGEsYyxkKXtpZihjJiZudWxsIT1kZihjKSlyZXR1cm5bZGYoYyldO3ZhciBlPVtdO2MmJihlPWVmKGMpKTtyKGQsZnVuY3Rpb24oYSl7ZT1lLmNvbmNhdChhKX0pO3JldHVybiBlfSl9ZnVuY3Rpb24geWYoYSxiKXtmb3IodmFyIGM9MDtjPGIubGVuZ3RoOysrYyl7dmFyIGQ9YltjXTtpZighZGUoZC5uKSl7dmFyIGQ9c2YoZCksZT1hLmtjW2RdO2RlbGV0ZSBhLmtjW2RdO2RlbGV0ZSBhLiRlW1wiX1wiK2VdfX19XG5mdW5jdGlvbiB1ZihhLGIsYyl7dmFyIGQ9Yi5wYXRoLGU9eGYoYSxiKTtjPXdmKGEsYyk7Yj1hLk1jLlhlKGIsZSxjLnVkLGMuSik7ZD1hLnNhLnN1YnRyZWUoZCk7aWYoZSlKKG51bGw9PWRmKGQudmFsdWUpLFwiSWYgd2UncmUgYWRkaW5nIGEgcXVlcnksIGl0IHNob3VsZG4ndCBiZSBzaGFkb3dlZFwiKTtlbHNlIGZvcihlPUllKGQsZnVuY3Rpb24oYSxiLGMpe2lmKCFhLmUoKSYmYiYmbnVsbCE9ZGYoYikpcmV0dXJuW3VlKGRmKGIpKV07dmFyIGQ9W107YiYmKGQ9ZC5jb25jYXQoUWEoZWYoYiksZnVuY3Rpb24oYSl7cmV0dXJuIGEuVn0pKSk7cihjLGZ1bmN0aW9uKGEpe2Q9ZC5jb25jYXQoYSl9KTtyZXR1cm4gZH0pLGQ9MDtkPGUubGVuZ3RoOysrZCljPWVbZF0sYS5NYy5aZChjLHhmKGEsYykpO3JldHVybiBifVxuZnVuY3Rpb24gd2YoYSxiKXt2YXIgYz1iLlYsZD14ZihhLGMpO3JldHVybnt1ZDpmdW5jdGlvbigpe3JldHVybihiLnUoKXx8QykuaGFzaCgpfSxKOmZ1bmN0aW9uKGIpe2lmKFwib2tcIj09PWIpe2lmKGQpe3ZhciBmPWMucGF0aDtpZihiPW9mKGEsZCkpe3ZhciBnPXBmKGIpO2I9Zy5wYXRoO2c9Zy5JYjtmPU4oYixmKTtmPW5ldyBaYihuZXcgeWUoITEsITAsZywhMCksZik7Yj1xZihhLGIsZil9ZWxzZSBiPVtdfWVsc2UgYj1qZihhLG5ldyBaYih6ZSxjLnBhdGgpKTtyZXR1cm4gYn1mPVwiVW5rbm93biBFcnJvclwiO1widG9vX2JpZ1wiPT09Yj9mPVwiVGhlIGRhdGEgcmVxdWVzdGVkIGV4Y2VlZHMgdGhlIG1heGltdW0gc2l6ZSB0aGF0IGNhbiBiZSBhY2Nlc3NlZCB3aXRoIGEgc2luZ2xlIHJlcXVlc3QuXCI6XCJwZXJtaXNzaW9uX2RlbmllZFwiPT1iP2Y9XCJDbGllbnQgZG9lc24ndCBoYXZlIHBlcm1pc3Npb24gdG8gYWNjZXNzIHRoZSBkZXNpcmVkIGRhdGEuXCI6XCJ1bmF2YWlsYWJsZVwiPT1iJiZcbihmPVwiVGhlIHNlcnZpY2UgaXMgdW5hdmFpbGFibGVcIik7Zj1FcnJvcihiK1wiOiBcIitmKTtmLmNvZGU9Yi50b1VwcGVyQ2FzZSgpO3JldHVybiBhLmtiKGMsbnVsbCxmKX19fWZ1bmN0aW9uIHNmKGEpe3JldHVybiBhLnBhdGgudG9TdHJpbmcoKStcIiRcIithLndhKCl9ZnVuY3Rpb24gcGYoYSl7dmFyIGI9YS5pbmRleE9mKFwiJFwiKTtKKC0xIT09YiYmYjxhLmxlbmd0aC0xLFwiQmFkIHF1ZXJ5S2V5LlwiKTtyZXR1cm57SWI6YS5zdWJzdHIoYisxKSxwYXRoOm5ldyBLKGEuc3Vic3RyKDAsYikpfX1mdW5jdGlvbiBvZihhLGIpe3ZhciBjPWEuJGUsZD1cIl9cIitiO3JldHVybiBkIGluIGM/Y1tkXTp2b2lkIDB9ZnVuY3Rpb24geGYoYSxiKXt2YXIgYz1zZihiKTtyZXR1cm4gdyhhLmtjLGMpfXZhciB0Zj0xO1xuZnVuY3Rpb24gcWYoYSxiLGMpe3ZhciBkPWEuc2EuZ2V0KGIpO0ooZCxcIk1pc3Npbmcgc3luYyBwb2ludCBmb3IgcXVlcnkgdGFnIHRoYXQgd2UncmUgdHJhY2tpbmdcIik7cmV0dXJuIGQuYmIoYyxuZXcgYmYoYixhLkhiKSxudWxsKX1mdW5jdGlvbiBqZihhLGIpe3JldHVybiB6ZihhLGIsYS5zYSxudWxsLG5ldyBiZihGLGEuSGIpKX1mdW5jdGlvbiB6ZihhLGIsYyxkLGUpe2lmKGIucGF0aC5lKCkpcmV0dXJuIEFmKGEsYixjLGQsZSk7dmFyIGY9Yy5nZXQoRik7bnVsbD09ZCYmbnVsbCE9ZiYmKGQ9Zi5oYihGKSk7dmFyIGc9W10saz1PKGIucGF0aCksbD1iLldjKGspO2lmKChjPWMuY2hpbGRyZW4uZ2V0KGspKSYmbCl2YXIgbT1kP2QuTShrKTpudWxsLGs9ZS53KGspLGc9Zy5jb25jYXQoemYoYSxsLGMsbSxrKSk7ZiYmKGc9Zy5jb25jYXQoZi5iYihiLGUsZCkpKTtyZXR1cm4gZ31cbmZ1bmN0aW9uIEFmKGEsYixjLGQsZSl7dmFyIGY9Yy5nZXQoRik7bnVsbD09ZCYmbnVsbCE9ZiYmKGQ9Zi5oYihGKSk7dmFyIGc9W107Yy5jaGlsZHJlbi5oYShmdW5jdGlvbihjLGYpe3ZhciBtPWQ/ZC5NKGMpOm51bGwsdj1lLncoYykseT1iLldjKGMpO3kmJihnPWcuY29uY2F0KEFmKGEseSxmLG0sdikpKX0pO2YmJihnPWcuY29uY2F0KGYuYmIoYixlLGQpKSk7cmV0dXJuIGd9O2Z1bmN0aW9uIEJmKCl7dGhpcy5jaGlsZHJlbj17fTt0aGlzLmtkPTA7dGhpcy52YWx1ZT1udWxsfWZ1bmN0aW9uIENmKGEsYixjKXt0aGlzLkRkPWE/YTpcIlwiO3RoaXMuWWM9Yj9iOm51bGw7dGhpcy5CPWM/YzpuZXcgQmZ9ZnVuY3Rpb24gRGYoYSxiKXtmb3IodmFyIGM9YiBpbnN0YW5jZW9mIEs/YjpuZXcgSyhiKSxkPWEsZTtudWxsIT09KGU9TyhjKSk7KWQ9bmV3IENmKGUsZCx3KGQuQi5jaGlsZHJlbixlKXx8bmV3IEJmKSxjPUcoYyk7cmV0dXJuIGR9aD1DZi5wcm90b3R5cGU7aC5CYT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkIudmFsdWV9O2Z1bmN0aW9uIEVmKGEsYil7SihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGIsXCJDYW5ub3Qgc2V0IHZhbHVlIHRvIHVuZGVmaW5lZFwiKTthLkIudmFsdWU9YjtGZihhKX1oLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5CLnZhbHVlPW51bGw7dGhpcy5CLmNoaWxkcmVuPXt9O3RoaXMuQi5rZD0wO0ZmKHRoaXMpfTtcbmgudGQ9ZnVuY3Rpb24oKXtyZXR1cm4gMDx0aGlzLkIua2R9O2guZT1mdW5jdGlvbigpe3JldHVybiBudWxsPT09dGhpcy5CYSgpJiYhdGhpcy50ZCgpfTtoLlU9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztyKHRoaXMuQi5jaGlsZHJlbixmdW5jdGlvbihjLGQpe2EobmV3IENmKGQsYixjKSl9KX07ZnVuY3Rpb24gR2YoYSxiLGMsZCl7YyYmIWQmJmIoYSk7YS5VKGZ1bmN0aW9uKGEpe0dmKGEsYiwhMCxkKX0pO2MmJmQmJmIoYSl9ZnVuY3Rpb24gSGYoYSxiKXtmb3IodmFyIGM9YS5wYXJlbnQoKTtudWxsIT09YyYmIWIoYyk7KWM9Yy5wYXJlbnQoKX1oLnBhdGg9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEsobnVsbD09PXRoaXMuWWM/dGhpcy5EZDp0aGlzLlljLnBhdGgoKStcIi9cIit0aGlzLkRkKX07aC5uYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuRGR9O2gucGFyZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuWWN9O1xuZnVuY3Rpb24gRmYoYSl7aWYobnVsbCE9PWEuWWMpe3ZhciBiPWEuWWMsYz1hLkRkLGQ9YS5lKCksZT11KGIuQi5jaGlsZHJlbixjKTtkJiZlPyhkZWxldGUgYi5CLmNoaWxkcmVuW2NdLGIuQi5rZC0tLEZmKGIpKTpkfHxlfHwoYi5CLmNoaWxkcmVuW2NdPWEuQixiLkIua2QrKyxGZihiKSl9fTtmdW5jdGlvbiBJZihhKXtKKGVhKGEpJiYwPGEubGVuZ3RoLFwiUmVxdWlyZXMgYSBub24tZW1wdHkgYXJyYXlcIik7dGhpcy5VZj1hO3RoaXMuTmM9e319SWYucHJvdG90eXBlLmRlPWZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPXRoaXMuTmNbYV18fFtdLGQ9MDtkPGMubGVuZ3RoO2QrKyljW2RdLnljLmFwcGx5KGNbZF0uTWEsQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpKX07SWYucHJvdG90eXBlLkViPWZ1bmN0aW9uKGEsYixjKXtKZih0aGlzLGEpO3RoaXMuTmNbYV09dGhpcy5OY1thXXx8W107dGhpcy5OY1thXS5wdXNoKHt5YzpiLE1hOmN9KTsoYT10aGlzLnplKGEpKSYmYi5hcHBseShjLGEpfTtJZi5wcm90b3R5cGUuZ2M9ZnVuY3Rpb24oYSxiLGMpe0pmKHRoaXMsYSk7YT10aGlzLk5jW2FdfHxbXTtmb3IodmFyIGQ9MDtkPGEubGVuZ3RoO2QrKylpZihhW2RdLnljPT09YiYmKCFjfHxjPT09YVtkXS5NYSkpe2Euc3BsaWNlKGQsMSk7YnJlYWt9fTtcbmZ1bmN0aW9uIEpmKGEsYil7SihUYShhLlVmLGZ1bmN0aW9uKGEpe3JldHVybiBhPT09Yn0pLFwiVW5rbm93biBldmVudDogXCIrYil9O3ZhciBLZj1mdW5jdGlvbigpe3ZhciBhPTAsYj1bXTtyZXR1cm4gZnVuY3Rpb24oYyl7dmFyIGQ9Yz09PWE7YT1jO2Zvcih2YXIgZT1BcnJheSg4KSxmPTc7MDw9ZjtmLS0pZVtmXT1cIi0wMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpfYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIi5jaGFyQXQoYyU2NCksYz1NYXRoLmZsb29yKGMvNjQpO0ooMD09PWMsXCJDYW5ub3QgcHVzaCBhdCB0aW1lID09IDBcIik7Yz1lLmpvaW4oXCJcIik7aWYoZCl7Zm9yKGY9MTE7MDw9ZiYmNjM9PT1iW2ZdO2YtLSliW2ZdPTA7YltmXSsrfWVsc2UgZm9yKGY9MDsxMj5mO2YrKyliW2ZdPU1hdGguZmxvb3IoNjQqTWF0aC5yYW5kb20oKSk7Zm9yKGY9MDsxMj5mO2YrKyljKz1cIi0wMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpfYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpcIi5jaGFyQXQoYltmXSk7SigyMD09PWMubGVuZ3RoLFwibmV4dFB1c2hJZDogTGVuZ3RoIHNob3VsZCBiZSAyMC5cIik7XG5yZXR1cm4gY319KCk7ZnVuY3Rpb24gTGYoKXtJZi5jYWxsKHRoaXMsW1wib25saW5lXCJdKTt0aGlzLmljPSEwO2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKXt2YXIgYT10aGlzO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib25saW5lXCIsZnVuY3Rpb24oKXthLmljfHwoYS5pYz0hMCxhLmRlKFwib25saW5lXCIsITApKX0sITEpO3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwib2ZmbGluZVwiLGZ1bmN0aW9uKCl7YS5pYyYmKGEuaWM9ITEsYS5kZShcIm9ubGluZVwiLCExKSl9LCExKX19bWEoTGYsSWYpO0xmLnByb3RvdHlwZS56ZT1mdW5jdGlvbihhKXtKKFwib25saW5lXCI9PT1hLFwiVW5rbm93biBldmVudCB0eXBlOiBcIithKTtyZXR1cm5bdGhpcy5pY119O2NhKExmKTtmdW5jdGlvbiBNZigpe0lmLmNhbGwodGhpcyxbXCJ2aXNpYmxlXCJdKTt2YXIgYSxiO1widW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciYmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQuaGlkZGVuPyhiPVwidmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJoaWRkZW5cIik6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4/KGI9XCJtb3p2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cIm1vekhpZGRlblwiKTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuPyhiPVwibXN2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cIm1zSGlkZGVuXCIpOlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuJiYoYj1cIndlYmtpdHZpc2liaWxpdHljaGFuZ2VcIixhPVwid2Via2l0SGlkZGVuXCIpKTt0aGlzLnVjPSEwO2lmKGIpe3ZhciBjPXRoaXM7ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihiLFxuZnVuY3Rpb24oKXt2YXIgYj0hZG9jdW1lbnRbYV07YiE9PWMudWMmJihjLnVjPWIsYy5kZShcInZpc2libGVcIixiKSl9LCExKX19bWEoTWYsSWYpO01mLnByb3RvdHlwZS56ZT1mdW5jdGlvbihhKXtKKFwidmlzaWJsZVwiPT09YSxcIlVua25vd24gZXZlbnQgdHlwZTogXCIrYSk7cmV0dXJuW3RoaXMudWNdfTtjYShNZik7dmFyIE5mPS9bXFxbXFxdLiMkXFwvXFx1MDAwMC1cXHUwMDFGXFx1MDA3Rl0vLE9mPS9bXFxbXFxdLiMkXFx1MDAwMC1cXHUwMDFGXFx1MDA3Rl0vO2Z1bmN0aW9uIFBmKGEpe3JldHVybiBwKGEpJiYwIT09YS5sZW5ndGgmJiFOZi50ZXN0KGEpfWZ1bmN0aW9uIFFmKGEpe3JldHVybiBudWxsPT09YXx8cChhKXx8Z2EoYSkmJiFTYyhhKXx8aWEoYSkmJnUoYSxcIi5zdlwiKX1mdW5jdGlvbiBSZihhLGIsYyxkKXtkJiYhbihiKXx8U2YoeihhLDEsZCksYixjKX1cbmZ1bmN0aW9uIFNmKGEsYixjKXtjIGluc3RhbmNlb2YgSyYmKGM9bmV3IHdjKGMsYSkpO2lmKCFuKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyB1bmRlZmluZWQgXCIremMoYykpO2lmKGhhKGIpKXRocm93IEVycm9yKGErXCJjb250YWlucyBhIGZ1bmN0aW9uIFwiK3pjKGMpK1wiIHdpdGggY29udGVudHM6IFwiK2IudG9TdHJpbmcoKSk7aWYoU2MoYikpdGhyb3cgRXJyb3IoYStcImNvbnRhaW5zIFwiK2IudG9TdHJpbmcoKStcIiBcIit6YyhjKSk7aWYocChiKSYmYi5sZW5ndGg+MTA0ODU3NjAvMyYmMTA0ODU3NjA8eGMoYikpdGhyb3cgRXJyb3IoYStcImNvbnRhaW5zIGEgc3RyaW5nIGdyZWF0ZXIgdGhhbiAxMDQ4NTc2MCB1dGY4IGJ5dGVzIFwiK3pjKGMpK1wiICgnXCIrYi5zdWJzdHJpbmcoMCw1MCkrXCIuLi4nKVwiKTtpZihpYShiKSl7dmFyIGQ9ITEsZT0hMTtoYihiLGZ1bmN0aW9uKGIsZyl7aWYoXCIudmFsdWVcIj09PWIpZD0hMDtlbHNlIGlmKFwiLnByaW9yaXR5XCIhPT1iJiZcIi5zdlwiIT09YiYmKGU9XG4hMCwhUGYoYikpKXRocm93IEVycm9yKGErXCIgY29udGFpbnMgYW4gaW52YWxpZCBrZXkgKFwiK2IrXCIpIFwiK3pjKGMpKycuICBLZXlzIG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ3MgYW5kIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIi9cIiwgXCJbXCIsIG9yIFwiXVwiJyk7Yy5wdXNoKGIpO1NmKGEsZyxjKTtjLnBvcCgpfSk7aWYoZCYmZSl0aHJvdyBFcnJvcihhKycgY29udGFpbnMgXCIudmFsdWVcIiBjaGlsZCAnK3pjKGMpK1wiIGluIGFkZGl0aW9uIHRvIGFjdHVhbCBjaGlsZHJlbi5cIik7fX1cbmZ1bmN0aW9uIFRmKGEsYixjKXtpZighaWEoYil8fGVhKGIpKXRocm93IEVycm9yKHooYSwxLCExKStcIiBtdXN0IGJlIGFuIE9iamVjdCBjb250YWluaW5nIHRoZSBjaGlsZHJlbiB0byByZXBsYWNlLlwiKTtpZih1KGIsXCIudmFsdWVcIikpdGhyb3cgRXJyb3IoeihhLDEsITEpKycgbXVzdCBub3QgY29udGFpbiBcIi52YWx1ZVwiLiAgVG8gb3ZlcndyaXRlIHdpdGggYSBsZWFmIHZhbHVlLCBqdXN0IHVzZSAuc2V0KCkgaW5zdGVhZC4nKTtSZihhLGIsYywhMSl9XG5mdW5jdGlvbiBVZihhLGIsYyl7aWYoU2MoYykpdGhyb3cgRXJyb3IoeihhLGIsITEpK1wiaXMgXCIrYy50b1N0cmluZygpK1wiLCBidXQgbXVzdCBiZSBhIHZhbGlkIEZpcmViYXNlIHByaW9yaXR5IChhIHN0cmluZywgZmluaXRlIG51bWJlciwgc2VydmVyIHZhbHVlLCBvciBudWxsKS5cIik7aWYoIVFmKGMpKXRocm93IEVycm9yKHooYSxiLCExKStcIm11c3QgYmUgYSB2YWxpZCBGaXJlYmFzZSBwcmlvcml0eSAoYSBzdHJpbmcsIGZpbml0ZSBudW1iZXIsIHNlcnZlciB2YWx1ZSwgb3IgbnVsbCkuXCIpO31cbmZ1bmN0aW9uIFZmKGEsYixjKXtpZighY3x8bihiKSlzd2l0Y2goYil7Y2FzZSBcInZhbHVlXCI6Y2FzZSBcImNoaWxkX2FkZGVkXCI6Y2FzZSBcImNoaWxkX3JlbW92ZWRcIjpjYXNlIFwiY2hpbGRfY2hhbmdlZFwiOmNhc2UgXCJjaGlsZF9tb3ZlZFwiOmJyZWFrO2RlZmF1bHQ6dGhyb3cgRXJyb3IoeihhLDEsYykrJ211c3QgYmUgYSB2YWxpZCBldmVudCB0eXBlOiBcInZhbHVlXCIsIFwiY2hpbGRfYWRkZWRcIiwgXCJjaGlsZF9yZW1vdmVkXCIsIFwiY2hpbGRfY2hhbmdlZFwiLCBvciBcImNoaWxkX21vdmVkXCIuJyk7fX1mdW5jdGlvbiBXZihhLGIsYyxkKXtpZigoIWR8fG4oYykpJiYhUGYoYykpdGhyb3cgRXJyb3IoeihhLGIsZCkrJ3dhcyBhbiBpbnZhbGlkIGtleTogXCInK2MrJ1wiLiAgRmlyZWJhc2Uga2V5cyBtdXN0IGJlIG5vbi1lbXB0eSBzdHJpbmdzIGFuZCBjYW5cXCd0IGNvbnRhaW4gXCIuXCIsIFwiI1wiLCBcIiRcIiwgXCIvXCIsIFwiW1wiLCBvciBcIl1cIikuJyk7fVxuZnVuY3Rpb24gWGYoYSxiKXtpZighcChiKXx8MD09PWIubGVuZ3RofHxPZi50ZXN0KGIpKXRocm93IEVycm9yKHooYSwxLCExKSsnd2FzIGFuIGludmFsaWQgcGF0aDogXCInK2IrJ1wiLiBQYXRocyBtdXN0IGJlIG5vbi1lbXB0eSBzdHJpbmdzIGFuZCBjYW5cXCd0IGNvbnRhaW4gXCIuXCIsIFwiI1wiLCBcIiRcIiwgXCJbXCIsIG9yIFwiXVwiJyk7fWZ1bmN0aW9uIFlmKGEsYil7aWYoXCIuaW5mb1wiPT09TyhiKSl0aHJvdyBFcnJvcihhK1wiIGZhaWxlZDogQ2FuJ3QgbW9kaWZ5IGRhdGEgdW5kZXIgLy5pbmZvL1wiKTt9ZnVuY3Rpb24gWmYoYSxiKXtpZighcChiKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrXCJtdXN0IGJlIGEgdmFsaWQgY3JlZGVudGlhbCAoYSBzdHJpbmcpLlwiKTt9ZnVuY3Rpb24gJGYoYSxiLGMpe2lmKCFwKGMpKXRocm93IEVycm9yKHooYSxiLCExKStcIm11c3QgYmUgYSB2YWxpZCBzdHJpbmcuXCIpO31cbmZ1bmN0aW9uIGFnKGEsYixjLGQpe2lmKCFkfHxuKGMpKWlmKCFpYShjKXx8bnVsbD09PWMpdGhyb3cgRXJyb3IoeihhLGIsZCkrXCJtdXN0IGJlIGEgdmFsaWQgb2JqZWN0LlwiKTt9ZnVuY3Rpb24gYmcoYSxiLGMpe2lmKCFpYShiKXx8bnVsbD09PWJ8fCF1KGIsYykpdGhyb3cgRXJyb3IoeihhLDEsITEpKydtdXN0IGNvbnRhaW4gdGhlIGtleSBcIicrYysnXCInKTtpZighcCh3KGIsYykpKXRocm93IEVycm9yKHooYSwxLCExKSsnbXVzdCBjb250YWluIHRoZSBrZXkgXCInK2MrJ1wiIHdpdGggdHlwZSBcInN0cmluZ1wiJyk7fTtmdW5jdGlvbiBjZygpe3RoaXMuc2V0PXt9fWg9Y2cucHJvdG90eXBlO2guYWRkPWZ1bmN0aW9uKGEsYil7dGhpcy5zZXRbYV09bnVsbCE9PWI/YjohMH07aC5jb250YWlucz1mdW5jdGlvbihhKXtyZXR1cm4gdSh0aGlzLnNldCxhKX07aC5nZXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY29udGFpbnMoYSk/dGhpcy5zZXRbYV06dm9pZCAwfTtoLnJlbW92ZT1mdW5jdGlvbihhKXtkZWxldGUgdGhpcy5zZXRbYV19O2guY2xlYXI9ZnVuY3Rpb24oKXt0aGlzLnNldD17fX07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHdhKHRoaXMuc2V0KX07aC5jb3VudD1mdW5jdGlvbigpe3JldHVybiBwYSh0aGlzLnNldCl9O2Z1bmN0aW9uIGRnKGEsYil7cihhLnNldCxmdW5jdGlvbihhLGQpe2IoZCxhKX0pfWgua2V5cz1mdW5jdGlvbigpe3ZhciBhPVtdO3IodGhpcy5zZXQsZnVuY3Rpb24oYixjKXthLnB1c2goYyl9KTtyZXR1cm4gYX07ZnVuY3Rpb24gcWMoKXt0aGlzLm09dGhpcy5DPW51bGx9cWMucHJvdG90eXBlLmZpbmQ9ZnVuY3Rpb24oYSl7aWYobnVsbCE9dGhpcy5DKXJldHVybiB0aGlzLkMub2EoYSk7aWYoYS5lKCl8fG51bGw9PXRoaXMubSlyZXR1cm4gbnVsbDt2YXIgYj1PKGEpO2E9RyhhKTtyZXR1cm4gdGhpcy5tLmNvbnRhaW5zKGIpP3RoaXMubS5nZXQoYikuZmluZChhKTpudWxsfTtxYy5wcm90b3R5cGUubWM9ZnVuY3Rpb24oYSxiKXtpZihhLmUoKSl0aGlzLkM9Yix0aGlzLm09bnVsbDtlbHNlIGlmKG51bGwhPT10aGlzLkMpdGhpcy5DPXRoaXMuQy5HKGEsYik7ZWxzZXtudWxsPT10aGlzLm0mJih0aGlzLm09bmV3IGNnKTt2YXIgYz1PKGEpO3RoaXMubS5jb250YWlucyhjKXx8dGhpcy5tLmFkZChjLG5ldyBxYyk7Yz10aGlzLm0uZ2V0KGMpO2E9RyhhKTtjLm1jKGEsYil9fTtcbmZ1bmN0aW9uIGVnKGEsYil7aWYoYi5lKCkpcmV0dXJuIGEuQz1udWxsLGEubT1udWxsLCEwO2lmKG51bGwhPT1hLkMpe2lmKGEuQy5OKCkpcmV0dXJuITE7dmFyIGM9YS5DO2EuQz1udWxsO2MuVShNLGZ1bmN0aW9uKGIsYyl7YS5tYyhuZXcgSyhiKSxjKX0pO3JldHVybiBlZyhhLGIpfXJldHVybiBudWxsIT09YS5tPyhjPU8oYiksYj1HKGIpLGEubS5jb250YWlucyhjKSYmZWcoYS5tLmdldChjKSxiKSYmYS5tLnJlbW92ZShjKSxhLm0uZSgpPyhhLm09bnVsbCwhMCk6ITEpOiEwfWZ1bmN0aW9uIHJjKGEsYixjKXtudWxsIT09YS5DP2MoYixhLkMpOmEuVShmdW5jdGlvbihhLGUpe3ZhciBmPW5ldyBLKGIudG9TdHJpbmcoKStcIi9cIithKTtyYyhlLGYsYyl9KX1xYy5wcm90b3R5cGUuVT1mdW5jdGlvbihhKXtudWxsIT09dGhpcy5tJiZkZyh0aGlzLm0sZnVuY3Rpb24oYixjKXthKGIsYyl9KX07dmFyIGZnPVwiYXV0aC5maXJlYmFzZS5jb21cIjtmdW5jdGlvbiBnZyhhLGIsYyl7dGhpcy5sZD1hfHx7fTt0aGlzLmNlPWJ8fHt9O3RoaXMuYWI9Y3x8e307dGhpcy5sZC5yZW1lbWJlcnx8KHRoaXMubGQucmVtZW1iZXI9XCJkZWZhdWx0XCIpfXZhciBoZz1bXCJyZW1lbWJlclwiLFwicmVkaXJlY3RUb1wiXTtmdW5jdGlvbiBpZyhhKXt2YXIgYj17fSxjPXt9O2hiKGF8fHt9LGZ1bmN0aW9uKGEsZSl7MDw9TmEoaGcsYSk/YlthXT1lOmNbYV09ZX0pO3JldHVybiBuZXcgZ2coYix7fSxjKX07ZnVuY3Rpb24gamcoYSxiKXt0aGlzLlBlPVtcInNlc3Npb25cIixhLkxkLGEuQ2JdLmpvaW4oXCI6XCIpO3RoaXMuJGQ9Yn1qZy5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGEsYil7aWYoIWIpaWYodGhpcy4kZC5sZW5ndGgpYj10aGlzLiRkWzBdO2Vsc2UgdGhyb3cgRXJyb3IoXCJmYi5sb2dpbi5TZXNzaW9uTWFuYWdlciA6IE5vIHN0b3JhZ2Ugb3B0aW9ucyBhdmFpbGFibGUhXCIpO2Iuc2V0KHRoaXMuUGUsYSl9O2pnLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKXt2YXIgYT1RYSh0aGlzLiRkLHEodGhpcy5uZyx0aGlzKSksYT1QYShhLGZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT09YX0pO1hhKGEsZnVuY3Rpb24oYSxjKXtyZXR1cm4gYmQoYy50b2tlbiktYmQoYS50b2tlbil9KTtyZXR1cm4gMDxhLmxlbmd0aD9hLnNoaWZ0KCk6bnVsbH07amcucHJvdG90eXBlLm5nPWZ1bmN0aW9uKGEpe3RyeXt2YXIgYj1hLmdldCh0aGlzLlBlKTtpZihiJiZiLnRva2VuKXJldHVybiBifWNhdGNoKGMpe31yZXR1cm4gbnVsbH07XG5qZy5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXt2YXIgYT10aGlzO09hKHRoaXMuJGQsZnVuY3Rpb24oYil7Yi5yZW1vdmUoYS5QZSl9KX07ZnVuY3Rpb24ga2coKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmISEod2luZG93LmNvcmRvdmF8fHdpbmRvdy5waG9uZWdhcHx8d2luZG93LlBob25lR2FwKSYmL2lvc3xpcGhvbmV8aXBvZHxpcGFkfGFuZHJvaWR8YmxhY2tiZXJyeXxpZW1vYmlsZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCl9ZnVuY3Rpb24gbGcoKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIGxvY2F0aW9uJiYvXmZpbGU6XFwvLy50ZXN0KGxvY2F0aW9uLmhyZWYpfVxuZnVuY3Rpb24gbWcoKXtpZihcInVuZGVmaW5lZFwiPT09dHlwZW9mIG5hdmlnYXRvcilyZXR1cm4hMTt2YXIgYT1uYXZpZ2F0b3IudXNlckFnZW50O2lmKFwiTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyXCI9PT1uYXZpZ2F0b3IuYXBwTmFtZSl7aWYoKGE9YS5tYXRjaCgvTVNJRSAoWzAtOV17MSx9W1xcLjAtOV17MCx9KS8pKSYmMTxhLmxlbmd0aClyZXR1cm4gODw9cGFyc2VGbG9hdChhWzFdKX1lbHNlIGlmKC0xPGEuaW5kZXhPZihcIlRyaWRlbnRcIikmJihhPWEubWF0Y2goL3J2OihbMC05XXsyLDJ9W1xcLjAtOV17MCx9KS8pKSYmMTxhLmxlbmd0aClyZXR1cm4gODw9cGFyc2VGbG9hdChhWzFdKTtyZXR1cm4hMX07ZnVuY3Rpb24gbmcoKXt2YXIgYT13aW5kb3cub3BlbmVyLmZyYW1lcyxiO2ZvcihiPWEubGVuZ3RoLTE7MDw9YjtiLS0pdHJ5e2lmKGFbYl0ubG9jYXRpb24ucHJvdG9jb2w9PT13aW5kb3cubG9jYXRpb24ucHJvdG9jb2wmJmFbYl0ubG9jYXRpb24uaG9zdD09PXdpbmRvdy5sb2NhdGlvbi5ob3N0JiZcIl9fd2luY2hhbl9yZWxheV9mcmFtZVwiPT09YVtiXS5uYW1lKXJldHVybiBhW2JdfWNhdGNoKGMpe31yZXR1cm4gbnVsbH1mdW5jdGlvbiBvZyhhLGIsYyl7YS5hdHRhY2hFdmVudD9hLmF0dGFjaEV2ZW50KFwib25cIitiLGMpOmEuYWRkRXZlbnRMaXN0ZW5lciYmYS5hZGRFdmVudExpc3RlbmVyKGIsYywhMSl9ZnVuY3Rpb24gcGcoYSxiLGMpe2EuZGV0YWNoRXZlbnQ/YS5kZXRhY2hFdmVudChcIm9uXCIrYixjKTphLnJlbW92ZUV2ZW50TGlzdGVuZXImJmEucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLGMsITEpfVxuZnVuY3Rpb24gcWcoYSl7L15odHRwcz86XFwvXFwvLy50ZXN0KGEpfHwoYT13aW5kb3cubG9jYXRpb24uaHJlZik7dmFyIGI9L14oaHR0cHM/OlxcL1xcL1tcXC1fYS16QS1aXFwuMC05Ol0rKS8uZXhlYyhhKTtyZXR1cm4gYj9iWzFdOmF9ZnVuY3Rpb24gcmcoYSl7dmFyIGI9XCJcIjt0cnl7YT1hLnJlcGxhY2UoXCIjXCIsXCJcIik7dmFyIGM9a2IoYSk7YyYmdShjLFwiX19maXJlYmFzZV9yZXF1ZXN0X2tleVwiKSYmKGI9dyhjLFwiX19maXJlYmFzZV9yZXF1ZXN0X2tleVwiKSl9Y2F0Y2goZCl7fXJldHVybiBifWZ1bmN0aW9uIHNnKCl7dmFyIGE9UmMoZmcpO3JldHVybiBhLnNjaGVtZStcIjovL1wiK2EuaG9zdCtcIi92MlwifWZ1bmN0aW9uIHRnKGEpe3JldHVybiBzZygpK1wiL1wiK2ErXCIvYXV0aC9jaGFubmVsXCJ9O2Z1bmN0aW9uIHVnKGEpe3ZhciBiPXRoaXM7dGhpcy56Yz1hO3RoaXMuYWU9XCIqXCI7bWcoKT90aGlzLlFjPXRoaXMud2Q9bmcoKToodGhpcy5RYz13aW5kb3cub3BlbmVyLHRoaXMud2Q9d2luZG93KTtpZighYi5RYyl0aHJvd1wiVW5hYmxlIHRvIGZpbmQgcmVsYXkgZnJhbWVcIjtvZyh0aGlzLndkLFwibWVzc2FnZVwiLHEodGhpcy5oYyx0aGlzKSk7b2codGhpcy53ZCxcIm1lc3NhZ2VcIixxKHRoaXMuQWYsdGhpcykpO3RyeXt2Zyh0aGlzLHthOlwicmVhZHlcIn0pfWNhdGNoKGMpe29nKHRoaXMuUWMsXCJsb2FkXCIsZnVuY3Rpb24oKXt2ZyhiLHthOlwicmVhZHlcIn0pfSl9b2cod2luZG93LFwidW5sb2FkXCIscSh0aGlzLnlnLHRoaXMpKX1mdW5jdGlvbiB2ZyhhLGIpe2I9QihiKTttZygpP2EuUWMuZG9Qb3N0KGIsYS5hZSk6YS5RYy5wb3N0TWVzc2FnZShiLGEuYWUpfVxudWcucHJvdG90eXBlLmhjPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMsYzt0cnl7Yz1tYihhLmRhdGEpfWNhdGNoKGQpe31jJiZcInJlcXVlc3RcIj09PWMuYSYmKHBnKHdpbmRvdyxcIm1lc3NhZ2VcIix0aGlzLmhjKSx0aGlzLmFlPWEub3JpZ2luLHRoaXMuemMmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtiLnpjKGIuYWUsYy5kLGZ1bmN0aW9uKGEsYyl7Yi5hZz0hYztiLnpjPXZvaWQgMDt2ZyhiLHthOlwicmVzcG9uc2VcIixkOmEsZm9yY2VLZWVwV2luZG93T3BlbjpjfSl9KX0sMCkpfTt1Zy5wcm90b3R5cGUueWc9ZnVuY3Rpb24oKXt0cnl7cGcodGhpcy53ZCxcIm1lc3NhZ2VcIix0aGlzLkFmKX1jYXRjaChhKXt9dGhpcy56YyYmKHZnKHRoaXMse2E6XCJlcnJvclwiLGQ6XCJ1bmtub3duIGNsb3NlZCB3aW5kb3dcIn0pLHRoaXMuemM9dm9pZCAwKTt0cnl7d2luZG93LmNsb3NlKCl9Y2F0Y2goYil7fX07dWcucHJvdG90eXBlLkFmPWZ1bmN0aW9uKGEpe2lmKHRoaXMuYWcmJlwiZGllXCI9PT1hLmRhdGEpdHJ5e3dpbmRvdy5jbG9zZSgpfWNhdGNoKGIpe319O2Z1bmN0aW9uIHdnKGEpe3RoaXMub2M9R2EoKStHYSgpK0dhKCk7dGhpcy5EZj1hfXdnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYil7UC5zZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIsdGhpcy5vYyk7UC5zZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIsdGhpcy5vYyk7Yi5yZXF1ZXN0SWQ9dGhpcy5vYztiLnJlZGlyZWN0VG89Yi5yZWRpcmVjdFRvfHx3aW5kb3cubG9jYXRpb24uaHJlZjthKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKStqYihiKTt3aW5kb3cubG9jYXRpb249YX07d2cuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hbGcoKSYmIWtnKCl9O3dnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwicmVkaXJlY3RcIn07dmFyIHhnPXtORVRXT1JLX0VSUk9SOlwiVW5hYmxlIHRvIGNvbnRhY3QgdGhlIEZpcmViYXNlIHNlcnZlci5cIixTRVJWRVJfRVJST1I6XCJBbiB1bmtub3duIHNlcnZlciBlcnJvciBvY2N1cnJlZC5cIixUUkFOU1BPUlRfVU5BVkFJTEFCTEU6XCJUaGVyZSBhcmUgbm8gbG9naW4gdHJhbnNwb3J0cyBhdmFpbGFibGUgZm9yIHRoZSByZXF1ZXN0ZWQgbWV0aG9kLlwiLFJFUVVFU1RfSU5URVJSVVBURUQ6XCJUaGUgYnJvd3NlciByZWRpcmVjdGVkIHRoZSBwYWdlIGJlZm9yZSB0aGUgbG9naW4gcmVxdWVzdCBjb3VsZCBjb21wbGV0ZS5cIixVU0VSX0NBTkNFTExFRDpcIlRoZSB1c2VyIGNhbmNlbGxlZCBhdXRoZW50aWNhdGlvbi5cIn07ZnVuY3Rpb24geWcoYSl7dmFyIGI9RXJyb3Iodyh4ZyxhKSxhKTtiLmNvZGU9YTtyZXR1cm4gYn07ZnVuY3Rpb24gemcoYSl7aWYoIWEud2luZG93X2ZlYXR1cmVzfHxcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmKC0xIT09bmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiRmVubmVjL1wiKXx8LTEhPT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJGaXJlZm94L1wiKSYmLTEhPT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJBbmRyb2lkXCIpKSlhLndpbmRvd19mZWF0dXJlcz12b2lkIDA7YS53aW5kb3dfbmFtZXx8KGEud2luZG93X25hbWU9XCJfYmxhbmtcIik7dGhpcy5vcHRpb25zPWF9XG56Zy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZChhKXtnJiYoZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChnKSxnPXZvaWQgMCk7diYmKHY9Y2xlYXJJbnRlcnZhbCh2KSk7cGcod2luZG93LFwibWVzc2FnZVwiLGUpO3BnKHdpbmRvdyxcInVubG9hZFwiLGQpO2lmKG0mJiFhKXRyeXttLmNsb3NlKCl9Y2F0Y2goYil7ay5wb3N0TWVzc2FnZShcImRpZVwiLGwpfW09az12b2lkIDB9ZnVuY3Rpb24gZShhKXtpZihhLm9yaWdpbj09PWwpdHJ5e3ZhciBiPW1iKGEuZGF0YSk7XCJyZWFkeVwiPT09Yi5hP2sucG9zdE1lc3NhZ2UoeSxsKTpcImVycm9yXCI9PT1iLmE/KGQoITEpLGMmJihjKGIuZCksYz1udWxsKSk6XCJyZXNwb25zZVwiPT09Yi5hJiYoZChiLmZvcmNlS2VlcFdpbmRvd09wZW4pLGMmJihjKG51bGwsYi5kKSxjPW51bGwpKX1jYXRjaChlKXt9fXZhciBmPW1nKCksZyxrO2lmKCF0aGlzLm9wdGlvbnMucmVsYXlfdXJsKXJldHVybiBjKEVycm9yKFwiaW52YWxpZCBhcmd1bWVudHM6IG9yaWdpbiBvZiB1cmwgYW5kIHJlbGF5X3VybCBtdXN0IG1hdGNoXCIpKTtcbnZhciBsPXFnKGEpO2lmKGwhPT1xZyh0aGlzLm9wdGlvbnMucmVsYXlfdXJsKSljJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YyhFcnJvcihcImludmFsaWQgYXJndW1lbnRzOiBvcmlnaW4gb2YgdXJsIGFuZCByZWxheV91cmwgbXVzdCBtYXRjaFwiKSl9LDApO2Vsc2V7ZiYmKGc9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKSxnLnNldEF0dHJpYnV0ZShcInNyY1wiLHRoaXMub3B0aW9ucy5yZWxheV91cmwpLGcuc3R5bGUuZGlzcGxheT1cIm5vbmVcIixnLnNldEF0dHJpYnV0ZShcIm5hbWVcIixcIl9fd2luY2hhbl9yZWxheV9mcmFtZVwiKSxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGcpLGs9Zy5jb250ZW50V2luZG93KTthKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKStqYihiKTt2YXIgbT13aW5kb3cub3BlbihhLHRoaXMub3B0aW9ucy53aW5kb3dfbmFtZSx0aGlzLm9wdGlvbnMud2luZG93X2ZlYXR1cmVzKTtrfHwoaz1tKTt2YXIgdj1zZXRJbnRlcnZhbChmdW5jdGlvbigpe20mJm0uY2xvc2VkJiZcbihkKCExKSxjJiYoYyh5ZyhcIlVTRVJfQ0FOQ0VMTEVEXCIpKSxjPW51bGwpKX0sNTAwKSx5PUIoe2E6XCJyZXF1ZXN0XCIsZDpifSk7b2cod2luZG93LFwidW5sb2FkXCIsZCk7b2cod2luZG93LFwibWVzc2FnZVwiLGUpfX07XG56Zy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVyblwicG9zdE1lc3NhZ2VcImluIHdpbmRvdyYmIWxnKCkmJiEoa2coKXx8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJihuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lLyl8fHdpbmRvdy5XaW5kb3dzJiYvXm1zLWFwcHg6Ly50ZXN0KGxvY2F0aW9uLmhyZWYpKXx8XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBuYXZpZ2F0b3ImJlwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiYobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKGlQaG9uZXxpUG9kfGlQYWQpLipBcHBsZVdlYktpdCg/IS4qU2FmYXJpKS9pKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQ3JpT1MvKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHdpdHRlciBmb3IgaVBob25lLyl8fG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0ZCQU5cXC9GQklPUy8pfHx3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSYmIShcInVuZGVmaW5lZFwiIT09XG50eXBlb2YgbmF2aWdhdG9yJiZuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9QaGFudG9tSlMvKSl9O3pnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwicG9wdXBcIn07ZnVuY3Rpb24gQWcoYSl7YS5tZXRob2R8fChhLm1ldGhvZD1cIkdFVFwiKTthLmhlYWRlcnN8fChhLmhlYWRlcnM9e30pO2EuaGVhZGVycy5jb250ZW50X3R5cGV8fChhLmhlYWRlcnMuY29udGVudF90eXBlPVwiYXBwbGljYXRpb24vanNvblwiKTthLmhlYWRlcnMuY29udGVudF90eXBlPWEuaGVhZGVycy5jb250ZW50X3R5cGUudG9Mb3dlckNhc2UoKTt0aGlzLm9wdGlvbnM9YX1cbkFnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKCl7YyYmKGMoeWcoXCJSRVFVRVNUX0lOVEVSUlVQVEVEXCIpKSxjPW51bGwpfXZhciBlPW5ldyBYTUxIdHRwUmVxdWVzdCxmPXRoaXMub3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKSxnO29nKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpO2Uub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7aWYoYyYmND09PWUucmVhZHlTdGF0ZSl7dmFyIGE7aWYoMjAwPD1lLnN0YXR1cyYmMzAwPmUuc3RhdHVzKXt0cnl7YT1tYihlLnJlc3BvbnNlVGV4dCl9Y2F0Y2goYil7fWMobnVsbCxhKX1lbHNlIDUwMDw9ZS5zdGF0dXMmJjYwMD5lLnN0YXR1cz9jKHlnKFwiU0VSVkVSX0VSUk9SXCIpKTpjKHlnKFwiTkVUV09SS19FUlJPUlwiKSk7Yz1udWxsO3BnKHdpbmRvdyxcImJlZm9yZXVubG9hZFwiLGQpfX07aWYoXCJHRVRcIj09PWYpYSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikramIoYiksZz1udWxsO2Vsc2V7dmFyIGs9dGhpcy5vcHRpb25zLmhlYWRlcnMuY29udGVudF90eXBlO1xuXCJhcHBsaWNhdGlvbi9qc29uXCI9PT1rJiYoZz1CKGIpKTtcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiPT09ayYmKGc9amIoYikpfWUub3BlbihmLGEsITApO2E9e1wiWC1SZXF1ZXN0ZWQtV2l0aFwiOlwiWE1MSHR0cFJlcXVlc3RcIixBY2NlcHQ6XCJhcHBsaWNhdGlvbi9qc29uO3RleHQvcGxhaW5cIn07emEoYSx0aGlzLm9wdGlvbnMuaGVhZGVycyk7Zm9yKHZhciBsIGluIGEpZS5zZXRSZXF1ZXN0SGVhZGVyKGwsYVtsXSk7ZS5zZW5kKGcpfTtBZy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiEhd2luZG93LlhNTEh0dHBSZXF1ZXN0JiZcInN0cmluZ1wiPT09dHlwZW9mKG5ldyBYTUxIdHRwUmVxdWVzdCkucmVzcG9uc2VUeXBlJiYoIShcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL01TSUUvKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvVHJpZGVudC8pKSl8fG1nKCkpfTtBZy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cImpzb25cIn07ZnVuY3Rpb24gQmcoYSl7dGhpcy5vYz1HYSgpK0dhKCkrR2EoKTt0aGlzLkRmPWF9XG5CZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKHlnKFwiVVNFUl9DQU5DRUxMRURcIikpLGM9bnVsbCl9dmFyIGU9dGhpcyxmPVJjKGZnKSxnO2IucmVxdWVzdElkPXRoaXMub2M7Yi5yZWRpcmVjdFRvPWYuc2NoZW1lK1wiOi8vXCIrZi5ob3N0K1wiL2JsYW5rL3BhZ2UuaHRtbFwiO2ErPS9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIjthKz1qYihiKTsoZz13aW5kb3cub3BlbihhLFwiX2JsYW5rXCIsXCJsb2NhdGlvbj1ub1wiKSkmJmhhKGcuYWRkRXZlbnRMaXN0ZW5lcik/KGcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRzdGFydFwiLGZ1bmN0aW9uKGEpe3ZhciBiO2lmKGI9YSYmYS51cmwpYTp7dHJ5e3ZhciBtPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO20uaHJlZj1hLnVybDtiPW0uaG9zdD09PWYuaG9zdCYmXCIvYmxhbmsvcGFnZS5odG1sXCI9PT1tLnBhdGhuYW1lO2JyZWFrIGF9Y2F0Y2godil7fWI9ITF9YiYmKGE9cmcoYS51cmwpLGcucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImV4aXRcIixcbmQpLGcuY2xvc2UoKSxhPW5ldyBnZyhudWxsLG51bGwse3JlcXVlc3RJZDplLm9jLHJlcXVlc3RLZXk6YX0pLGUuRGYucmVxdWVzdFdpdGhDcmVkZW50aWFsKFwiL2F1dGgvc2Vzc2lvblwiLGEsYyksYz1udWxsKX0pLGcuYWRkRXZlbnRMaXN0ZW5lcihcImV4aXRcIixkKSk6Yyh5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9O0JnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuIGtnKCl9O0JnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwicmVkaXJlY3RcIn07ZnVuY3Rpb24gQ2coYSl7YS5jYWxsYmFja19wYXJhbWV0ZXJ8fChhLmNhbGxiYWNrX3BhcmFtZXRlcj1cImNhbGxiYWNrXCIpO3RoaXMub3B0aW9ucz1hO3dpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnA9d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucHx8e319XG5DZy5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIsYyl7ZnVuY3Rpb24gZCgpe2MmJihjKHlnKFwiUkVRVUVTVF9JTlRFUlJVUFRFRFwiKSksYz1udWxsKX1mdW5jdGlvbiBlKCl7c2V0VGltZW91dChmdW5jdGlvbigpe3dpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnBbZl09dm9pZCAwO3dhKHdpbmRvdy5fX2ZpcmViYXNlX2F1dGhfanNvbnApJiYod2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucD12b2lkIDApO3RyeXt2YXIgYT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChmKTthJiZhLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYSl9Y2F0Y2goYil7fX0sMSk7cGcod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCl9dmFyIGY9XCJmblwiKyhuZXcgRGF0ZSkuZ2V0VGltZSgpK01hdGguZmxvb3IoOTk5OTkqTWF0aC5yYW5kb20oKSk7Ylt0aGlzLm9wdGlvbnMuY2FsbGJhY2tfcGFyYW1ldGVyXT1cIl9fZmlyZWJhc2VfYXV0aF9qc29ucC5cIitmO2ErPSgvXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCIpK2piKGIpO1xub2cod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCk7d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucFtmXT1mdW5jdGlvbihhKXtjJiYoYyhudWxsLGEpLGM9bnVsbCk7ZSgpfTtEZyhmLGEsYyl9O1xuZnVuY3Rpb24gRGcoYSxiLGMpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0cnl7dmFyIGQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtkLnR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIjtkLmlkPWE7ZC5hc3luYz0hMDtkLnNyYz1iO2Qub25lcnJvcj1mdW5jdGlvbigpe3ZhciBiPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGEpO251bGwhPT1iJiZiLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYik7YyYmYyh5ZyhcIk5FVFdPUktfRVJST1JcIikpfTt2YXIgZT1kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIik7KGUmJjAhPWUubGVuZ3RoP2VbMF06ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZChkKX1jYXRjaChmKXtjJiZjKHlnKFwiTkVUV09SS19FUlJPUlwiKSl9fSwwKX1DZy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiEwfTtDZy5wcm90b3R5cGUuQmM9ZnVuY3Rpb24oKXtyZXR1cm5cImpzb25cIn07ZnVuY3Rpb24gRWcoYSxiLGMsZCl7SWYuY2FsbCh0aGlzLFtcImF1dGhfc3RhdHVzXCJdKTt0aGlzLkg9YTt0aGlzLmRmPWI7dGhpcy5TZz1jO3RoaXMuS2U9ZDt0aGlzLnJjPW5ldyBqZyhhLFtEYyxQXSk7dGhpcy5uYj1udWxsO3RoaXMuUmU9ITE7RmcodGhpcyl9bWEoRWcsSWYpO2g9RWcucHJvdG90eXBlO2gud2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uYnx8bnVsbH07ZnVuY3Rpb24gRmcoYSl7UC5nZXQoXCJyZWRpcmVjdF9yZXF1ZXN0X2lkXCIpJiZHZyhhKTt2YXIgYj1hLnJjLmdldCgpO2ImJmIudG9rZW4/KEhnKGEsYiksYS5kZihiLnRva2VuLGZ1bmN0aW9uKGMsZCl7SWcoYSxjLGQsITEsYi50b2tlbixiKX0sZnVuY3Rpb24oYixkKXtKZyhhLFwicmVzdW1lU2Vzc2lvbigpXCIsYixkKX0pKTpIZyhhLG51bGwpfVxuZnVuY3Rpb24gS2coYSxiLGMsZCxlLGYpe1wiZmlyZWJhc2Vpby1kZW1vLmNvbVwiPT09YS5ILmRvbWFpbiYmUShcIkZpcmViYXNlIGF1dGhlbnRpY2F0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgb24gZGVtbyBGaXJlYmFzZXMgKCouZmlyZWJhc2Vpby1kZW1vLmNvbSkuIFRvIHNlY3VyZSB5b3VyIEZpcmViYXNlLCBjcmVhdGUgYSBwcm9kdWN0aW9uIEZpcmViYXNlIGF0IGh0dHBzOi8vd3d3LmZpcmViYXNlLmNvbS5cIik7YS5kZihiLGZ1bmN0aW9uKGYsayl7SWcoYSxmLGssITAsYixjLGR8fHt9LGUpfSxmdW5jdGlvbihiLGMpe0pnKGEsXCJhdXRoKClcIixiLGMsZil9KX1mdW5jdGlvbiBMZyhhLGIpe2EucmMuY2xlYXIoKTtIZyhhLG51bGwpO2EuU2coZnVuY3Rpb24oYSxkKXtpZihcIm9rXCI9PT1hKVIoYixudWxsKTtlbHNle3ZhciBlPShhfHxcImVycm9yXCIpLnRvVXBwZXJDYXNlKCksZj1lO2QmJihmKz1cIjogXCIrZCk7Zj1FcnJvcihmKTtmLmNvZGU9ZTtSKGIsZil9fSl9XG5mdW5jdGlvbiBJZyhhLGIsYyxkLGUsZixnLGspe1wib2tcIj09PWI/KGQmJihiPWMuYXV0aCxmLmF1dGg9YixmLmV4cGlyZXM9Yy5leHBpcmVzLGYudG9rZW49Y2QoZSk/ZTpcIlwiLGM9bnVsbCxiJiZ1KGIsXCJ1aWRcIik/Yz13KGIsXCJ1aWRcIik6dShmLFwidWlkXCIpJiYoYz13KGYsXCJ1aWRcIikpLGYudWlkPWMsYz1cImN1c3RvbVwiLGImJnUoYixcInByb3ZpZGVyXCIpP2M9dyhiLFwicHJvdmlkZXJcIik6dShmLFwicHJvdmlkZXJcIikmJihjPXcoZixcInByb3ZpZGVyXCIpKSxmLnByb3ZpZGVyPWMsYS5yYy5jbGVhcigpLGNkKGUpJiYoZz1nfHx7fSxjPURjLFwic2Vzc2lvbk9ubHlcIj09PWcucmVtZW1iZXImJihjPVApLFwibm9uZVwiIT09Zy5yZW1lbWJlciYmYS5yYy5zZXQoZixjKSksSGcoYSxmKSksUihrLG51bGwsZikpOihhLnJjLmNsZWFyKCksSGcoYSxudWxsKSxmPWE9KGJ8fFwiZXJyb3JcIikudG9VcHBlckNhc2UoKSxjJiYoZis9XCI6IFwiK2MpLGY9RXJyb3IoZiksZi5jb2RlPWEsUihrLGYpKX1cbmZ1bmN0aW9uIEpnKGEsYixjLGQsZSl7UShiK1wiIHdhcyBjYW5jZWxlZDogXCIrZCk7YS5yYy5jbGVhcigpO0hnKGEsbnVsbCk7YT1FcnJvcihkKTthLmNvZGU9Yy50b1VwcGVyQ2FzZSgpO1IoZSxhKX1mdW5jdGlvbiBNZyhhLGIsYyxkLGUpe05nKGEpO2M9bmV3IGdnKGR8fHt9LHt9LGN8fHt9KTtPZyhhLFtBZyxDZ10sXCIvYXV0aC9cIitiLGMsZSl9XG5mdW5jdGlvbiBQZyhhLGIsYyxkKXtOZyhhKTt2YXIgZT1bemcsQmddO2M9aWcoYyk7XCJhbm9ueW1vdXNcIj09PWJ8fFwicGFzc3dvcmRcIj09PWI/c2V0VGltZW91dChmdW5jdGlvbigpe1IoZCx5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9LDApOihjLmNlLndpbmRvd19mZWF0dXJlcz1cIm1lbnViYXI9eWVzLG1vZGFsPXllcyxhbHdheXNSYWlzZWQ9eWVzbG9jYXRpb249eWVzLHJlc2l6YWJsZT15ZXMsc2Nyb2xsYmFycz15ZXMsc3RhdHVzPXllcyxoZWlnaHQ9NjI1LHdpZHRoPTYyNSx0b3A9XCIrKFwib2JqZWN0XCI9PT10eXBlb2Ygc2NyZWVuPy41KihzY3JlZW4uaGVpZ2h0LTYyNSk6MCkrXCIsbGVmdD1cIisoXCJvYmplY3RcIj09PXR5cGVvZiBzY3JlZW4/LjUqKHNjcmVlbi53aWR0aC02MjUpOjApLGMuY2UucmVsYXlfdXJsPXRnKGEuSC5DYiksYy5jZS5yZXF1ZXN0V2l0aENyZWRlbnRpYWw9cShhLnBjLGEpLE9nKGEsZSxcIi9hdXRoL1wiK2IsYyxkKSl9XG5mdW5jdGlvbiBHZyhhKXt2YXIgYj1QLmdldChcInJlZGlyZWN0X3JlcXVlc3RfaWRcIik7aWYoYil7dmFyIGM9UC5nZXQoXCJyZWRpcmVjdF9jbGllbnRfb3B0aW9uc1wiKTtQLnJlbW92ZShcInJlZGlyZWN0X3JlcXVlc3RfaWRcIik7UC5yZW1vdmUoXCJyZWRpcmVjdF9jbGllbnRfb3B0aW9uc1wiKTt2YXIgZD1bQWcsQ2ddLGI9e3JlcXVlc3RJZDpiLHJlcXVlc3RLZXk6cmcoZG9jdW1lbnQubG9jYXRpb24uaGFzaCl9LGM9bmV3IGdnKGMse30sYik7YS5SZT0hMDt0cnl7ZG9jdW1lbnQubG9jYXRpb24uaGFzaD1kb2N1bWVudC5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoLyZfX2ZpcmViYXNlX3JlcXVlc3Rfa2V5PShbYS16QS16MC05XSopLyxcIlwiKX1jYXRjaChlKXt9T2coYSxkLFwiL2F1dGgvc2Vzc2lvblwiLGMsZnVuY3Rpb24oKXt0aGlzLlJlPSExfS5iaW5kKGEpKX19XG5oLnJlPWZ1bmN0aW9uKGEsYil7TmcodGhpcyk7dmFyIGM9aWcoYSk7Yy5hYi5fbWV0aG9kPVwiUE9TVFwiO3RoaXMucGMoXCIvdXNlcnNcIixjLGZ1bmN0aW9uKGEsYyl7YT9SKGIsYSk6UihiLGEsYyl9KX07aC5TZT1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7TmcodGhpcyk7dmFyIGQ9XCIvdXNlcnMvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGEuZW1haWwpLGU9aWcoYSk7ZS5hYi5fbWV0aG9kPVwiREVMRVRFXCI7dGhpcy5wYyhkLGUsZnVuY3Rpb24oYSxkKXshYSYmZCYmZC51aWQmJmMubmImJmMubmIudWlkJiZjLm5iLnVpZD09PWQudWlkJiZMZyhjKTtSKGIsYSl9KX07aC5vZT1mdW5jdGlvbihhLGIpe05nKHRoaXMpO3ZhciBjPVwiL3VzZXJzL1wiK2VuY29kZVVSSUNvbXBvbmVudChhLmVtYWlsKStcIi9wYXNzd29yZFwiLGQ9aWcoYSk7ZC5hYi5fbWV0aG9kPVwiUFVUXCI7ZC5hYi5wYXNzd29yZD1hLm5ld1Bhc3N3b3JkO3RoaXMucGMoYyxkLGZ1bmN0aW9uKGEpe1IoYixhKX0pfTtcbmgubmU9ZnVuY3Rpb24oYSxiKXtOZyh0aGlzKTt2YXIgYz1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5vbGRFbWFpbCkrXCIvZW1haWxcIixkPWlnKGEpO2QuYWIuX21ldGhvZD1cIlBVVFwiO2QuYWIuZW1haWw9YS5uZXdFbWFpbDtkLmFiLnBhc3N3b3JkPWEucGFzc3dvcmQ7dGhpcy5wYyhjLGQsZnVuY3Rpb24oYSl7UihiLGEpfSl9O2guVWU9ZnVuY3Rpb24oYSxiKXtOZyh0aGlzKTt2YXIgYz1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5lbWFpbCkrXCIvcGFzc3dvcmRcIixkPWlnKGEpO2QuYWIuX21ldGhvZD1cIlBPU1RcIjt0aGlzLnBjKGMsZCxmdW5jdGlvbihhKXtSKGIsYSl9KX07aC5wYz1mdW5jdGlvbihhLGIsYyl7UWcodGhpcyxbQWcsQ2ddLGEsYixjKX07XG5mdW5jdGlvbiBPZyhhLGIsYyxkLGUpe1FnKGEsYixjLGQsZnVuY3Rpb24oYixjKXshYiYmYyYmYy50b2tlbiYmYy51aWQ/S2coYSxjLnRva2VuLGMsZC5sZCxmdW5jdGlvbihhLGIpe2E/UihlLGEpOlIoZSxudWxsLGIpfSk6UihlLGJ8fHlnKFwiVU5LTk9XTl9FUlJPUlwiKSl9KX1cbmZ1bmN0aW9uIFFnKGEsYixjLGQsZSl7Yj1QYShiLGZ1bmN0aW9uKGEpe3JldHVyblwiZnVuY3Rpb25cIj09PXR5cGVvZiBhLmlzQXZhaWxhYmxlJiZhLmlzQXZhaWxhYmxlKCl9KTswPT09Yi5sZW5ndGg/c2V0VGltZW91dChmdW5jdGlvbigpe1IoZSx5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSl9LDApOihiPW5ldyAoYi5zaGlmdCgpKShkLmNlKSxkPWliKGQuYWIpLGQudj1cImpzLTIuMi40XCIsZC50cmFuc3BvcnQ9Yi5CYygpLGQuc3VwcHJlc3Nfc3RhdHVzX2NvZGVzPSEwLGE9c2coKStcIi9cIithLkguQ2IrYyxiLm9wZW4oYSxkLGZ1bmN0aW9uKGEsYil7aWYoYSlSKGUsYSk7ZWxzZSBpZihiJiZiLmVycm9yKXt2YXIgYz1FcnJvcihiLmVycm9yLm1lc3NhZ2UpO2MuY29kZT1iLmVycm9yLmNvZGU7Yy5kZXRhaWxzPWIuZXJyb3IuZGV0YWlscztSKGUsYyl9ZWxzZSBSKGUsbnVsbCxiKX0pKX1cbmZ1bmN0aW9uIEhnKGEsYil7dmFyIGM9bnVsbCE9PWEubmJ8fG51bGwhPT1iO2EubmI9YjtjJiZhLmRlKFwiYXV0aF9zdGF0dXNcIixiKTthLktlKG51bGwhPT1iKX1oLnplPWZ1bmN0aW9uKGEpe0ooXCJhdXRoX3N0YXR1c1wiPT09YSwnaW5pdGlhbCBldmVudCBtdXN0IGJlIG9mIHR5cGUgXCJhdXRoX3N0YXR1c1wiJyk7cmV0dXJuIHRoaXMuUmU/bnVsbDpbdGhpcy5uYl19O2Z1bmN0aW9uIE5nKGEpe3ZhciBiPWEuSDtpZihcImZpcmViYXNlaW8uY29tXCIhPT1iLmRvbWFpbiYmXCJmaXJlYmFzZWlvLWRlbW8uY29tXCIhPT1iLmRvbWFpbiYmXCJhdXRoLmZpcmViYXNlLmNvbVwiPT09ZmcpdGhyb3cgRXJyb3IoXCJUaGlzIGN1c3RvbSBGaXJlYmFzZSBzZXJ2ZXIgKCdcIithLkguZG9tYWluK1wiJykgZG9lcyBub3Qgc3VwcG9ydCBkZWxlZ2F0ZWQgbG9naW4uXCIpO307ZnVuY3Rpb24gUmcoYSl7dGhpcy5oYz1hO3RoaXMuS2Q9W107dGhpcy5RYj0wO3RoaXMucGU9LTE7dGhpcy5GYj1udWxsfWZ1bmN0aW9uIFNnKGEsYixjKXthLnBlPWI7YS5GYj1jO2EucGU8YS5RYiYmKGEuRmIoKSxhLkZiPW51bGwpfWZ1bmN0aW9uIFRnKGEsYixjKXtmb3IoYS5LZFtiXT1jO2EuS2RbYS5RYl07KXt2YXIgZD1hLktkW2EuUWJdO2RlbGV0ZSBhLktkW2EuUWJdO2Zvcih2YXIgZT0wO2U8ZC5sZW5ndGg7KytlKWlmKGRbZV0pe3ZhciBmPWE7Q2IoZnVuY3Rpb24oKXtmLmhjKGRbZV0pfSl9aWYoYS5RYj09PWEucGUpe2EuRmImJihjbGVhclRpbWVvdXQoYS5GYiksYS5GYigpLGEuRmI9bnVsbCk7YnJlYWt9YS5RYisrfX07ZnVuY3Rpb24gVWcoYSxiLGMpe3RoaXMucWU9YTt0aGlzLmY9T2MoYSk7dGhpcy5vYj10aGlzLnBiPTA7dGhpcy5WYT1PYihiKTt0aGlzLlZkPWM7dGhpcy5HYz0hMTt0aGlzLmdkPWZ1bmN0aW9uKGEpe2IuaG9zdCE9PWIuT2EmJihhLm5zPWIuQ2IpO3ZhciBjPVtdLGY7Zm9yKGYgaW4gYSlhLmhhc093blByb3BlcnR5KGYpJiZjLnB1c2goZitcIj1cIithW2ZdKTtyZXR1cm4oYi5sYj9cImh0dHBzOi8vXCI6XCJodHRwOi8vXCIpK2IuT2ErXCIvLmxwP1wiK2Muam9pbihcIiZcIil9fXZhciBWZyxXZztcblVnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYil7dGhpcy5nZj0wO3RoaXMua2E9Yjt0aGlzLnpmPW5ldyBSZyhhKTt0aGlzLnpiPSExO3ZhciBjPXRoaXM7dGhpcy5yYj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Yy5mKFwiVGltZWQgb3V0IHRyeWluZyB0byBjb25uZWN0LlwiKTtjLmliKCk7Yy5yYj1udWxsfSxNYXRoLmZsb29yKDNFNCkpO1RjKGZ1bmN0aW9uKCl7aWYoIWMuemIpe2MuVGE9bmV3IFhnKGZ1bmN0aW9uKGEsYixkLGssbCl7WWcoYyxhcmd1bWVudHMpO2lmKGMuVGEpaWYoYy5yYiYmKGNsZWFyVGltZW91dChjLnJiKSxjLnJiPW51bGwpLGMuR2M9ITAsXCJzdGFydFwiPT1hKWMuaWQ9YixjLkZmPWQ7ZWxzZSBpZihcImNsb3NlXCI9PT1hKWI/KGMuVGEuVGQ9ITEsU2coYy56ZixiLGZ1bmN0aW9uKCl7Yy5pYigpfSkpOmMuaWIoKTtlbHNlIHRocm93IEVycm9yKFwiVW5yZWNvZ25pemVkIGNvbW1hbmQgcmVjZWl2ZWQ6IFwiK2EpO30sZnVuY3Rpb24oYSxiKXtZZyhjLGFyZ3VtZW50cyk7XG5UZyhjLnpmLGEsYil9LGZ1bmN0aW9uKCl7Yy5pYigpfSxjLmdkKTt2YXIgYT17c3RhcnQ6XCJ0XCJ9O2Euc2VyPU1hdGguZmxvb3IoMUU4Kk1hdGgucmFuZG9tKCkpO2MuVGEuZmUmJihhLmNiPWMuVGEuZmUpO2Eudj1cIjVcIjtjLlZkJiYoYS5zPWMuVmQpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgbG9jYXRpb24mJmxvY2F0aW9uLmhyZWYmJi0xIT09bG9jYXRpb24uaHJlZi5pbmRleE9mKFwiZmlyZWJhc2Vpby5jb21cIikmJihhLnI9XCJmXCIpO2E9Yy5nZChhKTtjLmYoXCJDb25uZWN0aW5nIHZpYSBsb25nLXBvbGwgdG8gXCIrYSk7WmcoYy5UYSxhLGZ1bmN0aW9uKCl7fSl9fSl9O1xuVWcucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5UYSxiPXRoaXMuRmY7YS5yZz10aGlzLmlkO2Euc2c9Yjtmb3IoYS5rZT0hMDskZyhhKTspO2E9dGhpcy5pZDtiPXRoaXMuRmY7dGhpcy5mYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO3ZhciBjPXtkZnJhbWU6XCJ0XCJ9O2MuaWQ9YTtjLnB3PWI7dGhpcy5mYy5zcmM9dGhpcy5nZChjKTt0aGlzLmZjLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmZjKX07VWcuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4hV2cmJiEoXCJvYmplY3RcIj09PXR5cGVvZiB3aW5kb3cmJndpbmRvdy5jaHJvbWUmJndpbmRvdy5jaHJvbWUuZXh0ZW5zaW9uJiYhL15jaHJvbWUvLnRlc3Qod2luZG93LmxvY2F0aW9uLmhyZWYpKSYmIShcIm9iamVjdFwiPT09dHlwZW9mIFdpbmRvd3MmJlwib2JqZWN0XCI9PT10eXBlb2YgV2luZG93cy5VZykmJihWZ3x8ITApfTtoPVVnLnByb3RvdHlwZTtcbmguQmQ9ZnVuY3Rpb24oKXt9O2guY2Q9ZnVuY3Rpb24oKXt0aGlzLnpiPSEwO3RoaXMuVGEmJih0aGlzLlRhLmNsb3NlKCksdGhpcy5UYT1udWxsKTt0aGlzLmZjJiYoZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmZjKSx0aGlzLmZjPW51bGwpO3RoaXMucmImJihjbGVhclRpbWVvdXQodGhpcy5yYiksdGhpcy5yYj1udWxsKX07aC5pYj1mdW5jdGlvbigpe3RoaXMuemJ8fCh0aGlzLmYoXCJMb25ncG9sbCBpcyBjbG9zaW5nIGl0c2VsZlwiKSx0aGlzLmNkKCksdGhpcy5rYSYmKHRoaXMua2EodGhpcy5HYyksdGhpcy5rYT1udWxsKSl9O2guY2xvc2U9ZnVuY3Rpb24oKXt0aGlzLnpifHwodGhpcy5mKFwiTG9uZ3BvbGwgaXMgYmVpbmcgY2xvc2VkLlwiKSx0aGlzLmNkKCkpfTtcbmguc2VuZD1mdW5jdGlvbihhKXthPUIoYSk7dGhpcy5wYis9YS5sZW5ndGg7TGIodGhpcy5WYSxcImJ5dGVzX3NlbnRcIixhLmxlbmd0aCk7YT1LYyhhKTthPWZiKGEsITApO2E9WGMoYSwxODQwKTtmb3IodmFyIGI9MDtiPGEubGVuZ3RoO2IrKyl7dmFyIGM9dGhpcy5UYTtjLiRjLnB1c2goe0pnOnRoaXMuZ2YsUmc6YS5sZW5ndGgsamY6YVtiXX0pO2Mua2UmJiRnKGMpO3RoaXMuZ2YrK319O2Z1bmN0aW9uIFlnKGEsYil7dmFyIGM9QihiKS5sZW5ndGg7YS5vYis9YztMYihhLlZhLFwiYnl0ZXNfcmVjZWl2ZWRcIixjKX1cbmZ1bmN0aW9uIFhnKGEsYixjLGQpe3RoaXMuZ2Q9ZDt0aGlzLmpiPWM7dGhpcy5PZT1uZXcgY2c7dGhpcy4kYz1bXTt0aGlzLnNlPU1hdGguZmxvb3IoMUU4Kk1hdGgucmFuZG9tKCkpO3RoaXMuVGQ9ITA7dGhpcy5mZT1HYygpO3dpbmRvd1tcInBMUENvbW1hbmRcIit0aGlzLmZlXT1hO3dpbmRvd1tcInBSVExQQ0JcIit0aGlzLmZlXT1iO2E9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTthLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7aWYoZG9jdW1lbnQuYm9keSl7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTt0cnl7YS5jb250ZW50V2luZG93LmRvY3VtZW50fHxCYihcIk5vIElFIGRvbWFpbiBzZXR0aW5nIHJlcXVpcmVkXCIpfWNhdGNoKGUpe2Euc3JjPVwiamF2YXNjcmlwdDp2b2lkKChmdW5jdGlvbigpe2RvY3VtZW50Lm9wZW4oKTtkb2N1bWVudC5kb21haW49J1wiK2RvY3VtZW50LmRvbWFpbitcIic7ZG9jdW1lbnQuY2xvc2UoKTt9KSgpKVwifX1lbHNlIHRocm93XCJEb2N1bWVudCBib2R5IGhhcyBub3QgaW5pdGlhbGl6ZWQuIFdhaXQgdG8gaW5pdGlhbGl6ZSBGaXJlYmFzZSB1bnRpbCBhZnRlciB0aGUgZG9jdW1lbnQgaXMgcmVhZHkuXCI7XG5hLmNvbnRlbnREb2N1bWVudD9hLmdiPWEuY29udGVudERvY3VtZW50OmEuY29udGVudFdpbmRvdz9hLmdiPWEuY29udGVudFdpbmRvdy5kb2N1bWVudDphLmRvY3VtZW50JiYoYS5nYj1hLmRvY3VtZW50KTt0aGlzLkNhPWE7YT1cIlwiO3RoaXMuQ2Euc3JjJiZcImphdmFzY3JpcHQ6XCI9PT10aGlzLkNhLnNyYy5zdWJzdHIoMCwxMSkmJihhPSc8c2NyaXB0PmRvY3VtZW50LmRvbWFpbj1cIicrZG9jdW1lbnQuZG9tYWluKydcIjtcXHgzYy9zY3JpcHQ+Jyk7YT1cIjxodG1sPjxib2R5PlwiK2ErXCI8L2JvZHk+PC9odG1sPlwiO3RyeXt0aGlzLkNhLmdiLm9wZW4oKSx0aGlzLkNhLmdiLndyaXRlKGEpLHRoaXMuQ2EuZ2IuY2xvc2UoKX1jYXRjaChmKXtCYihcImZyYW1lIHdyaXRpbmcgZXhjZXB0aW9uXCIpLGYuc3RhY2smJkJiKGYuc3RhY2spLEJiKGYpfX1cblhnLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3RoaXMua2U9ITE7aWYodGhpcy5DYSl7dGhpcy5DYS5nYi5ib2R5LmlubmVySFRNTD1cIlwiO3ZhciBhPXRoaXM7c2V0VGltZW91dChmdW5jdGlvbigpe251bGwhPT1hLkNhJiYoZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhLkNhKSxhLkNhPW51bGwpfSxNYXRoLmZsb29yKDApKX12YXIgYj10aGlzLmpiO2ImJih0aGlzLmpiPW51bGwsYigpKX07XG5mdW5jdGlvbiAkZyhhKXtpZihhLmtlJiZhLlRkJiZhLk9lLmNvdW50KCk8KDA8YS4kYy5sZW5ndGg/MjoxKSl7YS5zZSsrO3ZhciBiPXt9O2IuaWQ9YS5yZztiLnB3PWEuc2c7Yi5zZXI9YS5zZTtmb3IodmFyIGI9YS5nZChiKSxjPVwiXCIsZD0wOzA8YS4kYy5sZW5ndGg7KWlmKDE4NzA+PWEuJGNbMF0uamYubGVuZ3RoKzMwK2MubGVuZ3RoKXt2YXIgZT1hLiRjLnNoaWZ0KCksYz1jK1wiJnNlZ1wiK2QrXCI9XCIrZS5KZytcIiZ0c1wiK2QrXCI9XCIrZS5SZytcIiZkXCIrZCtcIj1cIitlLmpmO2QrK31lbHNlIGJyZWFrO2FoKGEsYitjLGEuc2UpO3JldHVybiEwfXJldHVybiExfWZ1bmN0aW9uIGFoKGEsYixjKXtmdW5jdGlvbiBkKCl7YS5PZS5yZW1vdmUoYyk7JGcoYSl9YS5PZS5hZGQoYywxKTt2YXIgZT1zZXRUaW1lb3V0KGQsTWF0aC5mbG9vcigyNUUzKSk7WmcoYSxiLGZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGUpO2QoKX0pfVxuZnVuY3Rpb24gWmcoYSxiLGMpe3NldFRpbWVvdXQoZnVuY3Rpb24oKXt0cnl7aWYoYS5UZCl7dmFyIGQ9YS5DYS5nYi5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO2QudHlwZT1cInRleHQvamF2YXNjcmlwdFwiO2QuYXN5bmM9ITA7ZC5zcmM9YjtkLm9ubG9hZD1kLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe3ZhciBhPWQucmVhZHlTdGF0ZTthJiZcImxvYWRlZFwiIT09YSYmXCJjb21wbGV0ZVwiIT09YXx8KGQub25sb2FkPWQub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsZC5wYXJlbnROb2RlJiZkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZCksYygpKX07ZC5vbmVycm9yPWZ1bmN0aW9uKCl7QmIoXCJMb25nLXBvbGwgc2NyaXB0IGZhaWxlZCB0byBsb2FkOiBcIitiKTthLlRkPSExO2EuY2xvc2UoKX07YS5DYS5nYi5ib2R5LmFwcGVuZENoaWxkKGQpfX1jYXRjaChlKXt9fSxNYXRoLmZsb29yKDEpKX07dmFyIGJoPW51bGw7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBNb3pXZWJTb2NrZXQ/Ymg9TW96V2ViU29ja2V0OlwidW5kZWZpbmVkXCIhPT10eXBlb2YgV2ViU29ja2V0JiYoYmg9V2ViU29ja2V0KTtmdW5jdGlvbiBjaChhLGIsYyl7dGhpcy5xZT1hO3RoaXMuZj1PYyh0aGlzLnFlKTt0aGlzLmZyYW1lcz10aGlzLkpjPW51bGw7dGhpcy5vYj10aGlzLnBiPXRoaXMuYmY9MDt0aGlzLlZhPU9iKGIpO3RoaXMuZmI9KGIubGI/XCJ3c3M6Ly9cIjpcIndzOi8vXCIpK2IuT2ErXCIvLndzP3Y9NVwiO1widW5kZWZpbmVkXCIhPT10eXBlb2YgbG9jYXRpb24mJmxvY2F0aW9uLmhyZWYmJi0xIT09bG9jYXRpb24uaHJlZi5pbmRleE9mKFwiZmlyZWJhc2Vpby5jb21cIikmJih0aGlzLmZiKz1cIiZyPWZcIik7Yi5ob3N0IT09Yi5PYSYmKHRoaXMuZmI9dGhpcy5mYitcIiZucz1cIitiLkNiKTtjJiYodGhpcy5mYj10aGlzLmZiK1wiJnM9XCIrYyl9dmFyIGRoO1xuY2gucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiKXt0aGlzLmpiPWI7dGhpcy53Zz1hO3RoaXMuZihcIldlYnNvY2tldCBjb25uZWN0aW5nIHRvIFwiK3RoaXMuZmIpO3RoaXMuR2M9ITE7RGMuc2V0KFwicHJldmlvdXNfd2Vic29ja2V0X2ZhaWx1cmVcIiwhMCk7dHJ5e3RoaXMudmE9bmV3IGJoKHRoaXMuZmIpfWNhdGNoKGMpe3RoaXMuZihcIkVycm9yIGluc3RhbnRpYXRpbmcgV2ViU29ja2V0LlwiKTt2YXIgZD1jLm1lc3NhZ2V8fGMuZGF0YTtkJiZ0aGlzLmYoZCk7dGhpcy5pYigpO3JldHVybn12YXIgZT10aGlzO3RoaXMudmEub25vcGVuPWZ1bmN0aW9uKCl7ZS5mKFwiV2Vic29ja2V0IGNvbm5lY3RlZC5cIik7ZS5HYz0hMH07dGhpcy52YS5vbmNsb3NlPWZ1bmN0aW9uKCl7ZS5mKFwiV2Vic29ja2V0IGNvbm5lY3Rpb24gd2FzIGRpc2Nvbm5lY3RlZC5cIik7ZS52YT1udWxsO2UuaWIoKX07dGhpcy52YS5vbm1lc3NhZ2U9ZnVuY3Rpb24oYSl7aWYobnVsbCE9PWUudmEpaWYoYT1hLmRhdGEsZS5vYis9XG5hLmxlbmd0aCxMYihlLlZhLFwiYnl0ZXNfcmVjZWl2ZWRcIixhLmxlbmd0aCksZWgoZSksbnVsbCE9PWUuZnJhbWVzKWZoKGUsYSk7ZWxzZXthOntKKG51bGw9PT1lLmZyYW1lcyxcIldlIGFscmVhZHkgaGF2ZSBhIGZyYW1lIGJ1ZmZlclwiKTtpZig2Pj1hLmxlbmd0aCl7dmFyIGI9TnVtYmVyKGEpO2lmKCFpc05hTihiKSl7ZS5iZj1iO2UuZnJhbWVzPVtdO2E9bnVsbDticmVhayBhfX1lLmJmPTE7ZS5mcmFtZXM9W119bnVsbCE9PWEmJmZoKGUsYSl9fTt0aGlzLnZhLm9uZXJyb3I9ZnVuY3Rpb24oYSl7ZS5mKFwiV2ViU29ja2V0IGVycm9yLiAgQ2xvc2luZyBjb25uZWN0aW9uLlwiKTsoYT1hLm1lc3NhZ2V8fGEuZGF0YSkmJmUuZihhKTtlLmliKCl9fTtjaC5wcm90b3R5cGUuc3RhcnQ9ZnVuY3Rpb24oKXt9O1xuY2guaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXt2YXIgYT0hMTtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmbmF2aWdhdG9yLnVzZXJBZ2VudCl7dmFyIGI9bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQW5kcm9pZCAoWzAtOV17MCx9XFwuWzAtOV17MCx9KS8pO2ImJjE8Yi5sZW5ndGgmJjQuND5wYXJzZUZsb2F0KGJbMV0pJiYoYT0hMCl9cmV0dXJuIWEmJm51bGwhPT1iaCYmIWRofTtjaC5yZXNwb25zZXNSZXF1aXJlZFRvQmVIZWFsdGh5PTI7Y2guaGVhbHRoeVRpbWVvdXQ9M0U0O2g9Y2gucHJvdG90eXBlO2guQmQ9ZnVuY3Rpb24oKXtEYy5yZW1vdmUoXCJwcmV2aW91c193ZWJzb2NrZXRfZmFpbHVyZVwiKX07ZnVuY3Rpb24gZmgoYSxiKXthLmZyYW1lcy5wdXNoKGIpO2lmKGEuZnJhbWVzLmxlbmd0aD09YS5iZil7dmFyIGM9YS5mcmFtZXMuam9pbihcIlwiKTthLmZyYW1lcz1udWxsO2M9bWIoYyk7YS53ZyhjKX19XG5oLnNlbmQ9ZnVuY3Rpb24oYSl7ZWgodGhpcyk7YT1CKGEpO3RoaXMucGIrPWEubGVuZ3RoO0xiKHRoaXMuVmEsXCJieXRlc19zZW50XCIsYS5sZW5ndGgpO2E9WGMoYSwxNjM4NCk7MTxhLmxlbmd0aCYmdGhpcy52YS5zZW5kKFN0cmluZyhhLmxlbmd0aCkpO2Zvcih2YXIgYj0wO2I8YS5sZW5ndGg7YisrKXRoaXMudmEuc2VuZChhW2JdKX07aC5jZD1mdW5jdGlvbigpe3RoaXMuemI9ITA7dGhpcy5KYyYmKGNsZWFySW50ZXJ2YWwodGhpcy5KYyksdGhpcy5KYz1udWxsKTt0aGlzLnZhJiYodGhpcy52YS5jbG9zZSgpLHRoaXMudmE9bnVsbCl9O2guaWI9ZnVuY3Rpb24oKXt0aGlzLnpifHwodGhpcy5mKFwiV2ViU29ja2V0IGlzIGNsb3NpbmcgaXRzZWxmXCIpLHRoaXMuY2QoKSx0aGlzLmpiJiYodGhpcy5qYih0aGlzLkdjKSx0aGlzLmpiPW51bGwpKX07aC5jbG9zZT1mdW5jdGlvbigpe3RoaXMuemJ8fCh0aGlzLmYoXCJXZWJTb2NrZXQgaXMgYmVpbmcgY2xvc2VkXCIpLHRoaXMuY2QoKSl9O1xuZnVuY3Rpb24gZWgoYSl7Y2xlYXJJbnRlcnZhbChhLkpjKTthLkpjPXNldEludGVydmFsKGZ1bmN0aW9uKCl7YS52YSYmYS52YS5zZW5kKFwiMFwiKTtlaChhKX0sTWF0aC5mbG9vcig0NUUzKSl9O2Z1bmN0aW9uIGdoKGEpe2hoKHRoaXMsYSl9dmFyIGloPVtVZyxjaF07ZnVuY3Rpb24gaGgoYSxiKXt2YXIgYz1jaCYmY2guaXNBdmFpbGFibGUoKSxkPWMmJiEoRGMudWZ8fCEwPT09RGMuZ2V0KFwicHJldmlvdXNfd2Vic29ja2V0X2ZhaWx1cmVcIikpO2IuVGcmJihjfHxRKFwid3NzOi8vIFVSTCB1c2VkLCBidXQgYnJvd3NlciBpc24ndCBrbm93biB0byBzdXBwb3J0IHdlYnNvY2tldHMuICBUcnlpbmcgYW55d2F5LlwiKSxkPSEwKTtpZihkKWEuZWQ9W2NoXTtlbHNle3ZhciBlPWEuZWQ9W107WWMoaWgsZnVuY3Rpb24oYSxiKXtiJiZiLmlzQXZhaWxhYmxlKCkmJmUucHVzaChiKX0pfX1mdW5jdGlvbiBqaChhKXtpZigwPGEuZWQubGVuZ3RoKXJldHVybiBhLmVkWzBdO3Rocm93IEVycm9yKFwiTm8gdHJhbnNwb3J0cyBhdmFpbGFibGVcIik7fTtmdW5jdGlvbiBraChhLGIsYyxkLGUsZil7dGhpcy5pZD1hO3RoaXMuZj1PYyhcImM6XCIrdGhpcy5pZCtcIjpcIik7dGhpcy5oYz1jO3RoaXMuVmM9ZDt0aGlzLmthPWU7dGhpcy5NZT1mO3RoaXMuSD1iO3RoaXMuSmQ9W107dGhpcy5lZj0wO3RoaXMuTmY9bmV3IGdoKGIpO3RoaXMuVWE9MDt0aGlzLmYoXCJDb25uZWN0aW9uIGNyZWF0ZWRcIik7bGgodGhpcyl9XG5mdW5jdGlvbiBsaChhKXt2YXIgYj1qaChhLk5mKTthLkw9bmV3IGIoXCJjOlwiK2EuaWQrXCI6XCIrYS5lZisrLGEuSCk7YS5RZT1iLnJlc3BvbnNlc1JlcXVpcmVkVG9CZUhlYWx0aHl8fDA7dmFyIGM9bWgoYSxhLkwpLGQ9bmgoYSxhLkwpO2EuZmQ9YS5MO2EuYmQ9YS5MO2EuRj1udWxsO2EuQWI9ITE7c2V0VGltZW91dChmdW5jdGlvbigpe2EuTCYmYS5MLm9wZW4oYyxkKX0sTWF0aC5mbG9vcigwKSk7Yj1iLmhlYWx0aHlUaW1lb3V0fHwwOzA8YiYmKGEudmQ9c2V0VGltZW91dChmdW5jdGlvbigpe2EudmQ9bnVsbDthLkFifHwoYS5MJiYxMDI0MDA8YS5MLm9iPyhhLmYoXCJDb25uZWN0aW9uIGV4Y2VlZGVkIGhlYWx0aHkgdGltZW91dCBidXQgaGFzIHJlY2VpdmVkIFwiK2EuTC5vYitcIiBieXRlcy4gIE1hcmtpbmcgY29ubmVjdGlvbiBoZWFsdGh5LlwiKSxhLkFiPSEwLGEuTC5CZCgpKTphLkwmJjEwMjQwPGEuTC5wYj9hLmYoXCJDb25uZWN0aW9uIGV4Y2VlZGVkIGhlYWx0aHkgdGltZW91dCBidXQgaGFzIHNlbnQgXCIrXG5hLkwucGIrXCIgYnl0ZXMuICBMZWF2aW5nIGNvbm5lY3Rpb24gYWxpdmUuXCIpOihhLmYoXCJDbG9zaW5nIHVuaGVhbHRoeSBjb25uZWN0aW9uIGFmdGVyIHRpbWVvdXQuXCIpLGEuY2xvc2UoKSkpfSxNYXRoLmZsb29yKGIpKSl9ZnVuY3Rpb24gbmgoYSxiKXtyZXR1cm4gZnVuY3Rpb24oYyl7Yj09PWEuTD8oYS5MPW51bGwsY3x8MCE9PWEuVWE/MT09PWEuVWEmJmEuZihcIlJlYWx0aW1lIGNvbm5lY3Rpb24gbG9zdC5cIik6KGEuZihcIlJlYWx0aW1lIGNvbm5lY3Rpb24gZmFpbGVkLlwiKSxcInMtXCI9PT1hLkguT2Euc3Vic3RyKDAsMikmJihEYy5yZW1vdmUoXCJob3N0OlwiK2EuSC5ob3N0KSxhLkguT2E9YS5ILmhvc3QpKSxhLmNsb3NlKCkpOmI9PT1hLkY/KGEuZihcIlNlY29uZGFyeSBjb25uZWN0aW9uIGxvc3QuXCIpLGM9YS5GLGEuRj1udWxsLGEuZmQhPT1jJiZhLmJkIT09Y3x8YS5jbG9zZSgpKTphLmYoXCJjbG9zaW5nIGFuIG9sZCBjb25uZWN0aW9uXCIpfX1cbmZ1bmN0aW9uIG1oKGEsYil7cmV0dXJuIGZ1bmN0aW9uKGMpe2lmKDIhPWEuVWEpaWYoYj09PWEuYmQpe3ZhciBkPVZjKFwidFwiLGMpO2M9VmMoXCJkXCIsYyk7aWYoXCJjXCI9PWQpe2lmKGQ9VmMoXCJ0XCIsYyksXCJkXCJpbiBjKWlmKGM9Yy5kLFwiaFwiPT09ZCl7dmFyIGQ9Yy50cyxlPWMudixmPWMuaDthLlZkPWMucztGYyhhLkgsZik7MD09YS5VYSYmKGEuTC5zdGFydCgpLG9oKGEsYS5MLGQpLFwiNVwiIT09ZSYmUShcIlByb3RvY29sIHZlcnNpb24gbWlzbWF0Y2ggZGV0ZWN0ZWRcIiksYz1hLk5mLChjPTE8Yy5lZC5sZW5ndGg/Yy5lZFsxXTpudWxsKSYmcGgoYSxjKSl9ZWxzZSBpZihcIm5cIj09PWQpe2EuZihcInJlY3ZkIGVuZCB0cmFuc21pc3Npb24gb24gcHJpbWFyeVwiKTthLmJkPWEuRjtmb3IoYz0wO2M8YS5KZC5sZW5ndGg7KytjKWEuRmQoYS5KZFtjXSk7YS5KZD1bXTtxaChhKX1lbHNlXCJzXCI9PT1kPyhhLmYoXCJDb25uZWN0aW9uIHNodXRkb3duIGNvbW1hbmQgcmVjZWl2ZWQuIFNodXR0aW5nIGRvd24uLi5cIiksXG5hLk1lJiYoYS5NZShjKSxhLk1lPW51bGwpLGEua2E9bnVsbCxhLmNsb3NlKCkpOlwiclwiPT09ZD8oYS5mKFwiUmVzZXQgcGFja2V0IHJlY2VpdmVkLiAgTmV3IGhvc3Q6IFwiK2MpLEZjKGEuSCxjKSwxPT09YS5VYT9hLmNsb3NlKCk6KHJoKGEpLGxoKGEpKSk6XCJlXCI9PT1kP1BjKFwiU2VydmVyIEVycm9yOiBcIitjKTpcIm9cIj09PWQ/KGEuZihcImdvdCBwb25nIG9uIHByaW1hcnkuXCIpLHNoKGEpLHRoKGEpKTpQYyhcIlVua25vd24gY29udHJvbCBwYWNrZXQgY29tbWFuZDogXCIrZCl9ZWxzZVwiZFwiPT1kJiZhLkZkKGMpfWVsc2UgaWYoYj09PWEuRilpZihkPVZjKFwidFwiLGMpLGM9VmMoXCJkXCIsYyksXCJjXCI9PWQpXCJ0XCJpbiBjJiYoYz1jLnQsXCJhXCI9PT1jP3VoKGEpOlwiclwiPT09Yz8oYS5mKFwiR290IGEgcmVzZXQgb24gc2Vjb25kYXJ5LCBjbG9zaW5nIGl0XCIpLGEuRi5jbG9zZSgpLGEuZmQhPT1hLkYmJmEuYmQhPT1hLkZ8fGEuY2xvc2UoKSk6XCJvXCI9PT1jJiYoYS5mKFwiZ290IHBvbmcgb24gc2Vjb25kYXJ5LlwiKSxcbmEuTGYtLSx1aChhKSkpO2Vsc2UgaWYoXCJkXCI9PWQpYS5KZC5wdXNoKGMpO2Vsc2UgdGhyb3cgRXJyb3IoXCJVbmtub3duIHByb3RvY29sIGxheWVyOiBcIitkKTtlbHNlIGEuZihcIm1lc3NhZ2Ugb24gb2xkIGNvbm5lY3Rpb25cIil9fWtoLnByb3RvdHlwZS5EYT1mdW5jdGlvbihhKXt2aCh0aGlzLHt0OlwiZFwiLGQ6YX0pfTtmdW5jdGlvbiBxaChhKXthLmZkPT09YS5GJiZhLmJkPT09YS5GJiYoYS5mKFwiY2xlYW5pbmcgdXAgYW5kIHByb21vdGluZyBhIGNvbm5lY3Rpb246IFwiK2EuRi5xZSksYS5MPWEuRixhLkY9bnVsbCl9XG5mdW5jdGlvbiB1aChhKXswPj1hLkxmPyhhLmYoXCJTZWNvbmRhcnkgY29ubmVjdGlvbiBpcyBoZWFsdGh5LlwiKSxhLkFiPSEwLGEuRi5CZCgpLGEuRi5zdGFydCgpLGEuZihcInNlbmRpbmcgY2xpZW50IGFjayBvbiBzZWNvbmRhcnlcIiksYS5GLnNlbmQoe3Q6XCJjXCIsZDp7dDpcImFcIixkOnt9fX0pLGEuZihcIkVuZGluZyB0cmFuc21pc3Npb24gb24gcHJpbWFyeVwiKSxhLkwuc2VuZCh7dDpcImNcIixkOnt0OlwiblwiLGQ6e319fSksYS5mZD1hLkYscWgoYSkpOihhLmYoXCJzZW5kaW5nIHBpbmcgb24gc2Vjb25kYXJ5LlwiKSxhLkYuc2VuZCh7dDpcImNcIixkOnt0OlwicFwiLGQ6e319fSkpfWtoLnByb3RvdHlwZS5GZD1mdW5jdGlvbihhKXtzaCh0aGlzKTt0aGlzLmhjKGEpfTtmdW5jdGlvbiBzaChhKXthLkFifHwoYS5RZS0tLDA+PWEuUWUmJihhLmYoXCJQcmltYXJ5IGNvbm5lY3Rpb24gaXMgaGVhbHRoeS5cIiksYS5BYj0hMCxhLkwuQmQoKSkpfVxuZnVuY3Rpb24gcGgoYSxiKXthLkY9bmV3IGIoXCJjOlwiK2EuaWQrXCI6XCIrYS5lZisrLGEuSCxhLlZkKTthLkxmPWIucmVzcG9uc2VzUmVxdWlyZWRUb0JlSGVhbHRoeXx8MDthLkYub3BlbihtaChhLGEuRiksbmgoYSxhLkYpKTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS5GJiYoYS5mKFwiVGltZWQgb3V0IHRyeWluZyB0byB1cGdyYWRlLlwiKSxhLkYuY2xvc2UoKSl9LE1hdGguZmxvb3IoNkU0KSl9ZnVuY3Rpb24gb2goYSxiLGMpe2EuZihcIlJlYWx0aW1lIGNvbm5lY3Rpb24gZXN0YWJsaXNoZWQuXCIpO2EuTD1iO2EuVWE9MTthLlZjJiYoYS5WYyhjKSxhLlZjPW51bGwpOzA9PT1hLlFlPyhhLmYoXCJQcmltYXJ5IGNvbm5lY3Rpb24gaXMgaGVhbHRoeS5cIiksYS5BYj0hMCk6c2V0VGltZW91dChmdW5jdGlvbigpe3RoKGEpfSxNYXRoLmZsb29yKDVFMykpfVxuZnVuY3Rpb24gdGgoYSl7YS5BYnx8MSE9PWEuVWF8fChhLmYoXCJzZW5kaW5nIHBpbmcgb24gcHJpbWFyeS5cIiksdmgoYSx7dDpcImNcIixkOnt0OlwicFwiLGQ6e319fSkpfWZ1bmN0aW9uIHZoKGEsYil7aWYoMSE9PWEuVWEpdGhyb3dcIkNvbm5lY3Rpb24gaXMgbm90IGNvbm5lY3RlZFwiO2EuZmQuc2VuZChiKX1raC5wcm90b3R5cGUuY2xvc2U9ZnVuY3Rpb24oKXsyIT09dGhpcy5VYSYmKHRoaXMuZihcIkNsb3NpbmcgcmVhbHRpbWUgY29ubmVjdGlvbi5cIiksdGhpcy5VYT0yLHJoKHRoaXMpLHRoaXMua2EmJih0aGlzLmthKCksdGhpcy5rYT1udWxsKSl9O2Z1bmN0aW9uIHJoKGEpe2EuZihcIlNodXR0aW5nIGRvd24gYWxsIGNvbm5lY3Rpb25zXCIpO2EuTCYmKGEuTC5jbG9zZSgpLGEuTD1udWxsKTthLkYmJihhLkYuY2xvc2UoKSxhLkY9bnVsbCk7YS52ZCYmKGNsZWFyVGltZW91dChhLnZkKSxhLnZkPW51bGwpfTtmdW5jdGlvbiB3aChhLGIsYyxkKXt0aGlzLmlkPXhoKys7dGhpcy5mPU9jKFwicDpcIit0aGlzLmlkK1wiOlwiKTt0aGlzLndmPXRoaXMuRGU9ITE7dGhpcy5hYT17fTt0aGlzLnBhPVtdO3RoaXMuWGM9MDt0aGlzLlVjPVtdO3RoaXMubWE9ITE7dGhpcy4kYT0xRTM7dGhpcy5DZD0zRTU7dGhpcy5HYj1iO3RoaXMuVGM9Yzt0aGlzLk5lPWQ7dGhpcy5IPWE7dGhpcy5XZT1udWxsO3RoaXMuUWQ9e307dGhpcy5JZz0wO3RoaXMubWY9ITA7dGhpcy5LYz10aGlzLkZlPW51bGw7eWgodGhpcywwKTtNZi51YigpLkViKFwidmlzaWJsZVwiLHRoaXMuemcsdGhpcyk7LTE9PT1hLmhvc3QuaW5kZXhPZihcImZibG9jYWxcIikmJkxmLnViKCkuRWIoXCJvbmxpbmVcIix0aGlzLnhnLHRoaXMpfXZhciB4aD0wLHpoPTA7aD13aC5wcm90b3R5cGU7XG5oLkRhPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD0rK3RoaXMuSWc7YT17cjpkLGE6YSxiOmJ9O3RoaXMuZihCKGEpKTtKKHRoaXMubWEsXCJzZW5kUmVxdWVzdCBjYWxsIHdoZW4gd2UncmUgbm90IGNvbm5lY3RlZCBub3QgYWxsb3dlZC5cIik7dGhpcy5TYS5EYShhKTtjJiYodGhpcy5RZFtkXT1jKX07aC54Zj1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1hLndhKCksZj1hLnBhdGgudG9TdHJpbmcoKTt0aGlzLmYoXCJMaXN0ZW4gY2FsbGVkIGZvciBcIitmK1wiIFwiK2UpO3RoaXMuYWFbZl09dGhpcy5hYVtmXXx8e307SighdGhpcy5hYVtmXVtlXSxcImxpc3RlbigpIGNhbGxlZCB0d2ljZSBmb3Igc2FtZSBwYXRoL3F1ZXJ5SWQuXCIpO2E9e0o6ZCx1ZDpiLEZnOmEsdGFnOmN9O3RoaXMuYWFbZl1bZV09YTt0aGlzLm1hJiZBaCh0aGlzLGEpfTtcbmZ1bmN0aW9uIEFoKGEsYil7dmFyIGM9Yi5GZyxkPWMucGF0aC50b1N0cmluZygpLGU9Yy53YSgpO2EuZihcIkxpc3RlbiBvbiBcIitkK1wiIGZvciBcIitlKTt2YXIgZj17cDpkfTtiLnRhZyYmKGYucT1jZShjLm4pLGYudD1iLnRhZyk7Zi5oPWIudWQoKTthLkRhKFwicVwiLGYsZnVuY3Rpb24oZil7dmFyIGs9Zi5kLGw9Zi5zO2lmKGsmJlwib2JqZWN0XCI9PT10eXBlb2YgayYmdShrLFwid1wiKSl7dmFyIG09dyhrLFwid1wiKTtlYShtKSYmMDw9TmEobSxcIm5vX2luZGV4XCIpJiZRKFwiVXNpbmcgYW4gdW5zcGVjaWZpZWQgaW5kZXguIENvbnNpZGVyIGFkZGluZyBcIisoJ1wiLmluZGV4T25cIjogXCInK2Mubi5nLnRvU3RyaW5nKCkrJ1wiJykrXCIgYXQgXCIrYy5wYXRoLnRvU3RyaW5nKCkrXCIgdG8geW91ciBzZWN1cml0eSBydWxlcyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXCIpfShhLmFhW2RdJiZhLmFhW2RdW2VdKT09PWImJihhLmYoXCJsaXN0ZW4gcmVzcG9uc2VcIixmKSxcIm9rXCIhPT1sJiZCaChhLGQsZSksYi5KJiZcbmIuSihsLGspKX0pfWguUD1mdW5jdGlvbihhLGIsYyl7dGhpcy5GYT17Zmc6YSxuZjohMSx5YzpiLGpkOmN9O3RoaXMuZihcIkF1dGhlbnRpY2F0aW5nIHVzaW5nIGNyZWRlbnRpYWw6IFwiK2EpO0NoKHRoaXMpOyhiPTQwPT1hLmxlbmd0aCl8fChhPWFkKGEpLkFjLGI9XCJvYmplY3RcIj09PXR5cGVvZiBhJiYhMD09PXcoYSxcImFkbWluXCIpKTtiJiYodGhpcy5mKFwiQWRtaW4gYXV0aCBjcmVkZW50aWFsIGRldGVjdGVkLiAgUmVkdWNpbmcgbWF4IHJlY29ubmVjdCB0aW1lLlwiKSx0aGlzLkNkPTNFNCl9O2guZWU9ZnVuY3Rpb24oYSl7ZGVsZXRlIHRoaXMuRmE7dGhpcy5tYSYmdGhpcy5EYShcInVuYXV0aFwiLHt9LGZ1bmN0aW9uKGIpe2EoYi5zLGIuZCl9KX07XG5mdW5jdGlvbiBDaChhKXt2YXIgYj1hLkZhO2EubWEmJmImJmEuRGEoXCJhdXRoXCIse2NyZWQ6Yi5mZ30sZnVuY3Rpb24oYyl7dmFyIGQ9Yy5zO2M9Yy5kfHxcImVycm9yXCI7XCJva1wiIT09ZCYmYS5GYT09PWImJmRlbGV0ZSBhLkZhO2IubmY/XCJva1wiIT09ZCYmYi5qZCYmYi5qZChkLGMpOihiLm5mPSEwLGIueWMmJmIueWMoZCxjKSl9KX1oLk9mPWZ1bmN0aW9uKGEsYil7dmFyIGM9YS5wYXRoLnRvU3RyaW5nKCksZD1hLndhKCk7dGhpcy5mKFwiVW5saXN0ZW4gY2FsbGVkIGZvciBcIitjK1wiIFwiK2QpO2lmKEJoKHRoaXMsYyxkKSYmdGhpcy5tYSl7dmFyIGU9Y2UoYS5uKTt0aGlzLmYoXCJVbmxpc3RlbiBvbiBcIitjK1wiIGZvciBcIitkKTtjPXtwOmN9O2ImJihjLnE9ZSxjLnQ9Yik7dGhpcy5EYShcIm5cIixjKX19O2guTGU9ZnVuY3Rpb24oYSxiLGMpe3RoaXMubWE/RGgodGhpcyxcIm9cIixhLGIsYyk6dGhpcy5VYy5wdXNoKHtaYzphLGFjdGlvbjpcIm9cIixkYXRhOmIsSjpjfSl9O1xuaC5CZj1mdW5jdGlvbihhLGIsYyl7dGhpcy5tYT9EaCh0aGlzLFwib21cIixhLGIsYyk6dGhpcy5VYy5wdXNoKHtaYzphLGFjdGlvbjpcIm9tXCIsZGF0YTpiLEo6Y30pfTtoLkdkPWZ1bmN0aW9uKGEsYil7dGhpcy5tYT9EaCh0aGlzLFwib2NcIixhLG51bGwsYik6dGhpcy5VYy5wdXNoKHtaYzphLGFjdGlvbjpcIm9jXCIsZGF0YTpudWxsLEo6Yn0pfTtmdW5jdGlvbiBEaChhLGIsYyxkLGUpe2M9e3A6YyxkOmR9O2EuZihcIm9uRGlzY29ubmVjdCBcIitiLGMpO2EuRGEoYixjLGZ1bmN0aW9uKGEpe2UmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKGEucyxhLmQpfSxNYXRoLmZsb29yKDApKX0pfWgucHV0PWZ1bmN0aW9uKGEsYixjLGQpe0VoKHRoaXMsXCJwXCIsYSxiLGMsZCl9O2gueWY9ZnVuY3Rpb24oYSxiLGMsZCl7RWgodGhpcyxcIm1cIixhLGIsYyxkKX07XG5mdW5jdGlvbiBFaChhLGIsYyxkLGUsZil7ZD17cDpjLGQ6ZH07bihmKSYmKGQuaD1mKTthLnBhLnB1c2goe2FjdGlvbjpiLElmOmQsSjplfSk7YS5YYysrO2I9YS5wYS5sZW5ndGgtMTthLm1hP0ZoKGEsYik6YS5mKFwiQnVmZmVyaW5nIHB1dDogXCIrYyl9ZnVuY3Rpb24gRmgoYSxiKXt2YXIgYz1hLnBhW2JdLmFjdGlvbixkPWEucGFbYl0uSWYsZT1hLnBhW2JdLko7YS5wYVtiXS5HZz1hLm1hO2EuRGEoYyxkLGZ1bmN0aW9uKGQpe2EuZihjK1wiIHJlc3BvbnNlXCIsZCk7ZGVsZXRlIGEucGFbYl07YS5YYy0tOzA9PT1hLlhjJiYoYS5wYT1bXSk7ZSYmZShkLnMsZC5kKX0pfWguVGU9ZnVuY3Rpb24oYSl7dGhpcy5tYSYmKGE9e2M6YX0sdGhpcy5mKFwicmVwb3J0U3RhdHNcIixhKSx0aGlzLkRhKFwic1wiLGEsZnVuY3Rpb24oYSl7XCJva1wiIT09YS5zJiZ0aGlzLmYoXCJyZXBvcnRTdGF0c1wiLFwiRXJyb3Igc2VuZGluZyBzdGF0czogXCIrYS5kKX0pKX07XG5oLkZkPWZ1bmN0aW9uKGEpe2lmKFwiclwiaW4gYSl7dGhpcy5mKFwiZnJvbSBzZXJ2ZXI6IFwiK0IoYSkpO3ZhciBiPWEucixjPXRoaXMuUWRbYl07YyYmKGRlbGV0ZSB0aGlzLlFkW2JdLGMoYS5iKSl9ZWxzZXtpZihcImVycm9yXCJpbiBhKXRocm93XCJBIHNlcnZlci1zaWRlIGVycm9yIGhhcyBvY2N1cnJlZDogXCIrYS5lcnJvcjtcImFcImluIGEmJihiPWEuYSxjPWEuYix0aGlzLmYoXCJoYW5kbGVTZXJ2ZXJNZXNzYWdlXCIsYixjKSxcImRcIj09PWI/dGhpcy5HYihjLnAsYy5kLCExLGMudCk6XCJtXCI9PT1iP3RoaXMuR2IoYy5wLGMuZCwhMCxjLnQpOlwiY1wiPT09Yj9HaCh0aGlzLGMucCxjLnEpOlwiYWNcIj09PWI/KGE9Yy5zLGI9Yy5kLGM9dGhpcy5GYSxkZWxldGUgdGhpcy5GYSxjJiZjLmpkJiZjLmpkKGEsYikpOlwic2RcIj09PWI/dGhpcy5XZT90aGlzLldlKGMpOlwibXNnXCJpbiBjJiZcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUmJmNvbnNvbGUubG9nKFwiRklSRUJBU0U6IFwiK2MubXNnLnJlcGxhY2UoXCJcXG5cIixcblwiXFxuRklSRUJBU0U6IFwiKSk6UGMoXCJVbnJlY29nbml6ZWQgYWN0aW9uIHJlY2VpdmVkIGZyb20gc2VydmVyOiBcIitCKGIpK1wiXFxuQXJlIHlvdSB1c2luZyB0aGUgbGF0ZXN0IGNsaWVudD9cIikpfX07aC5WYz1mdW5jdGlvbihhKXt0aGlzLmYoXCJjb25uZWN0aW9uIHJlYWR5XCIpO3RoaXMubWE9ITA7dGhpcy5LYz0obmV3IERhdGUpLmdldFRpbWUoKTt0aGlzLk5lKHtzZXJ2ZXJUaW1lT2Zmc2V0OmEtKG5ldyBEYXRlKS5nZXRUaW1lKCl9KTt0aGlzLm1mJiYoYT17fSxhW1wic2RrLmpzLlwiK1wiMi4yLjRcIi5yZXBsYWNlKC9cXC4vZyxcIi1cIildPTEsa2coKSYmKGFbXCJmcmFtZXdvcmsuY29yZG92YVwiXT0xKSx0aGlzLlRlKGEpKTtIaCh0aGlzKTt0aGlzLm1mPSExO3RoaXMuVGMoITApfTtcbmZ1bmN0aW9uIHloKGEsYil7SighYS5TYSxcIlNjaGVkdWxpbmcgYSBjb25uZWN0IHdoZW4gd2UncmUgYWxyZWFkeSBjb25uZWN0ZWQvaW5nP1wiKTthLlNiJiZjbGVhclRpbWVvdXQoYS5TYik7YS5TYj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS5TYj1udWxsO0loKGEpfSxNYXRoLmZsb29yKGIpKX1oLnpnPWZ1bmN0aW9uKGEpe2EmJiF0aGlzLnVjJiZ0aGlzLiRhPT09dGhpcy5DZCYmKHRoaXMuZihcIldpbmRvdyBiZWNhbWUgdmlzaWJsZS4gIFJlZHVjaW5nIGRlbGF5LlwiKSx0aGlzLiRhPTFFMyx0aGlzLlNhfHx5aCh0aGlzLDApKTt0aGlzLnVjPWF9O2gueGc9ZnVuY3Rpb24oYSl7YT8odGhpcy5mKFwiQnJvd3NlciB3ZW50IG9ubGluZS5cIiksdGhpcy4kYT0xRTMsdGhpcy5TYXx8eWgodGhpcywwKSk6KHRoaXMuZihcIkJyb3dzZXIgd2VudCBvZmZsaW5lLiAgS2lsbGluZyBjb25uZWN0aW9uLlwiKSx0aGlzLlNhJiZ0aGlzLlNhLmNsb3NlKCkpfTtcbmguQ2Y9ZnVuY3Rpb24oKXt0aGlzLmYoXCJkYXRhIGNsaWVudCBkaXNjb25uZWN0ZWRcIik7dGhpcy5tYT0hMTt0aGlzLlNhPW51bGw7Zm9yKHZhciBhPTA7YTx0aGlzLnBhLmxlbmd0aDthKyspe3ZhciBiPXRoaXMucGFbYV07YiYmXCJoXCJpbiBiLklmJiZiLkdnJiYoYi5KJiZiLkooXCJkaXNjb25uZWN0XCIpLGRlbGV0ZSB0aGlzLnBhW2FdLHRoaXMuWGMtLSl9MD09PXRoaXMuWGMmJih0aGlzLnBhPVtdKTt0aGlzLlFkPXt9O0poKHRoaXMpJiYodGhpcy51Yz90aGlzLktjJiYoM0U0PChuZXcgRGF0ZSkuZ2V0VGltZSgpLXRoaXMuS2MmJih0aGlzLiRhPTFFMyksdGhpcy5LYz1udWxsKToodGhpcy5mKFwiV2luZG93IGlzbid0IHZpc2libGUuICBEZWxheWluZyByZWNvbm5lY3QuXCIpLHRoaXMuJGE9dGhpcy5DZCx0aGlzLkZlPShuZXcgRGF0ZSkuZ2V0VGltZSgpKSxhPU1hdGgubWF4KDAsdGhpcy4kYS0oKG5ldyBEYXRlKS5nZXRUaW1lKCktdGhpcy5GZSkpLGEqPU1hdGgucmFuZG9tKCksdGhpcy5mKFwiVHJ5aW5nIHRvIHJlY29ubmVjdCBpbiBcIitcbmErXCJtc1wiKSx5aCh0aGlzLGEpLHRoaXMuJGE9TWF0aC5taW4odGhpcy5DZCwxLjMqdGhpcy4kYSkpO3RoaXMuVGMoITEpfTtmdW5jdGlvbiBJaChhKXtpZihKaChhKSl7YS5mKFwiTWFraW5nIGEgY29ubmVjdGlvbiBhdHRlbXB0XCIpO2EuRmU9KG5ldyBEYXRlKS5nZXRUaW1lKCk7YS5LYz1udWxsO3ZhciBiPXEoYS5GZCxhKSxjPXEoYS5WYyxhKSxkPXEoYS5DZixhKSxlPWEuaWQrXCI6XCIremgrKzthLlNhPW5ldyBraChlLGEuSCxiLGMsZCxmdW5jdGlvbihiKXtRKGIrXCIgKFwiK2EuSC50b1N0cmluZygpK1wiKVwiKTthLndmPSEwfSl9fWgueWI9ZnVuY3Rpb24oKXt0aGlzLkRlPSEwO3RoaXMuU2E/dGhpcy5TYS5jbG9zZSgpOih0aGlzLlNiJiYoY2xlYXJUaW1lb3V0KHRoaXMuU2IpLHRoaXMuU2I9bnVsbCksdGhpcy5tYSYmdGhpcy5DZigpKX07aC5xYz1mdW5jdGlvbigpe3RoaXMuRGU9ITE7dGhpcy4kYT0xRTM7dGhpcy5TYXx8eWgodGhpcywwKX07XG5mdW5jdGlvbiBHaChhLGIsYyl7Yz1jP1FhKGMsZnVuY3Rpb24oYSl7cmV0dXJuIFdjKGEpfSkuam9pbihcIiRcIik6XCJkZWZhdWx0XCI7KGE9QmgoYSxiLGMpKSYmYS5KJiZhLkooXCJwZXJtaXNzaW9uX2RlbmllZFwiKX1mdW5jdGlvbiBCaChhLGIsYyl7Yj0obmV3IEsoYikpLnRvU3RyaW5nKCk7dmFyIGQ7bihhLmFhW2JdKT8oZD1hLmFhW2JdW2NdLGRlbGV0ZSBhLmFhW2JdW2NdLDA9PT1wYShhLmFhW2JdKSYmZGVsZXRlIGEuYWFbYl0pOmQ9dm9pZCAwO3JldHVybiBkfWZ1bmN0aW9uIEhoKGEpe0NoKGEpO3IoYS5hYSxmdW5jdGlvbihiKXtyKGIsZnVuY3Rpb24oYil7QWgoYSxiKX0pfSk7Zm9yKHZhciBiPTA7YjxhLnBhLmxlbmd0aDtiKyspYS5wYVtiXSYmRmgoYSxiKTtmb3IoO2EuVWMubGVuZ3RoOyliPWEuVWMuc2hpZnQoKSxEaChhLGIuYWN0aW9uLGIuWmMsYi5kYXRhLGIuSil9ZnVuY3Rpb24gSmgoYSl7dmFyIGI7Yj1MZi51YigpLmljO3JldHVybiFhLndmJiYhYS5EZSYmYn07dmFyIFY9e2xnOmZ1bmN0aW9uKCl7Vmc9ZGg9ITB9fTtWLmZvcmNlTG9uZ1BvbGxpbmc9Vi5sZztWLm1nPWZ1bmN0aW9uKCl7V2c9ITB9O1YuZm9yY2VXZWJTb2NrZXRzPVYubWc7Vi5NZz1mdW5jdGlvbihhLGIpe2Euay5SYS5XZT1ifTtWLnNldFNlY3VyaXR5RGVidWdDYWxsYmFjaz1WLk1nO1YuWWU9ZnVuY3Rpb24oYSxiKXthLmsuWWUoYil9O1Yuc3RhdHM9Vi5ZZTtWLlplPWZ1bmN0aW9uKGEsYil7YS5rLlplKGIpfTtWLnN0YXRzSW5jcmVtZW50Q291bnRlcj1WLlplO1YucGQ9ZnVuY3Rpb24oYSl7cmV0dXJuIGEuay5wZH07Vi5kYXRhVXBkYXRlQ291bnQ9Vi5wZDtWLnBnPWZ1bmN0aW9uKGEsYil7YS5rLkNlPWJ9O1YuaW50ZXJjZXB0U2VydmVyRGF0YT1WLnBnO1Yudmc9ZnVuY3Rpb24oYSl7bmV3IHVnKGEpfTtWLm9uUG9wdXBPcGVuPVYudmc7Vi5LZz1mdW5jdGlvbihhKXtmZz1hfTtWLnNldEF1dGhlbnRpY2F0aW9uU2VydmVyPVYuS2c7ZnVuY3Rpb24gUyhhLGIsYyl7dGhpcy5CPWE7dGhpcy5WPWI7dGhpcy5nPWN9Uy5wcm90b3R5cGUuSz1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QudmFsXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuSygpfTtTLnByb3RvdHlwZS52YWw9Uy5wcm90b3R5cGUuSztTLnByb3RvdHlwZS5sZj1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZXhwb3J0VmFsXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuSyghMCl9O1MucHJvdG90eXBlLmV4cG9ydFZhbD1TLnByb3RvdHlwZS5sZjtTLnByb3RvdHlwZS5rZz1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZXhpc3RzXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiF0aGlzLkIuZSgpfTtTLnByb3RvdHlwZS5leGlzdHM9Uy5wcm90b3R5cGUua2c7XG5TLnByb3RvdHlwZS53PWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuY2hpbGRcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7Z2EoYSkmJihhPVN0cmluZyhhKSk7WGYoXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuY2hpbGRcIixhKTt2YXIgYj1uZXcgSyhhKSxjPXRoaXMuVi53KGIpO3JldHVybiBuZXcgUyh0aGlzLkIub2EoYiksYyxNKX07Uy5wcm90b3R5cGUuY2hpbGQ9Uy5wcm90b3R5cGUudztTLnByb3RvdHlwZS5IYT1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lmhhc0NoaWxkXCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO1hmKFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lmhhc0NoaWxkXCIsYSk7dmFyIGI9bmV3IEsoYSk7cmV0dXJuIXRoaXMuQi5vYShiKS5lKCl9O1MucHJvdG90eXBlLmhhc0NoaWxkPVMucHJvdG90eXBlLkhhO1xuUy5wcm90b3R5cGUuQT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZ2V0UHJpb3JpdHlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5BKCkuSygpfTtTLnByb3RvdHlwZS5nZXRQcmlvcml0eT1TLnByb3RvdHlwZS5BO1MucHJvdG90eXBlLmZvckVhY2g9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5mb3JFYWNoXCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuZm9yRWFjaFwiLDEsYSwhMSk7aWYodGhpcy5CLk4oKSlyZXR1cm4hMTt2YXIgYj10aGlzO3JldHVybiEhdGhpcy5CLlUodGhpcy5nLGZ1bmN0aW9uKGMsZCl7cmV0dXJuIGEobmV3IFMoZCxiLlYudyhjKSxNKSl9KX07Uy5wcm90b3R5cGUuZm9yRWFjaD1TLnByb3RvdHlwZS5mb3JFYWNoO1xuUy5wcm90b3R5cGUudGQ9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lmhhc0NoaWxkcmVuXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuTigpPyExOiF0aGlzLkIuZSgpfTtTLnByb3RvdHlwZS5oYXNDaGlsZHJlbj1TLnByb3RvdHlwZS50ZDtTLnByb3RvdHlwZS5uYW1lPWZ1bmN0aW9uKCl7UShcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5uYW1lKCkgYmVpbmcgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBGaXJlYmFzZS5EYXRhU25hcHNob3Qua2V5KCkgaW5zdGVhZC5cIik7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5uYW1lXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLmtleSgpfTtTLnByb3RvdHlwZS5uYW1lPVMucHJvdG90eXBlLm5hbWU7Uy5wcm90b3R5cGUua2V5PWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5rZXlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuVi5rZXkoKX07XG5TLnByb3RvdHlwZS5rZXk9Uy5wcm90b3R5cGUua2V5O1MucHJvdG90eXBlLkRiPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5udW1DaGlsZHJlblwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLkRiKCl9O1MucHJvdG90eXBlLm51bUNoaWxkcmVuPVMucHJvdG90eXBlLkRiO1MucHJvdG90eXBlLmxjPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5yZWZcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuVn07Uy5wcm90b3R5cGUucmVmPVMucHJvdG90eXBlLmxjO2Z1bmN0aW9uIEtoKGEsYil7dGhpcy5IPWE7dGhpcy5WYT1PYihhKTt0aGlzLmVhPW5ldyB1Yjt0aGlzLkVkPTE7dGhpcy5SYT1udWxsO2J8fDA8PShcIm9iamVjdFwiPT09dHlwZW9mIHdpbmRvdyYmd2luZG93Lm5hdmlnYXRvciYmd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnR8fFwiXCIpLnNlYXJjaCgvZ29vZ2xlYm90fGdvb2dsZSB3ZWJtYXN0ZXIgdG9vbHN8YmluZ2JvdHx5YWhvbyEgc2x1cnB8YmFpZHVzcGlkZXJ8eWFuZGV4Ym90fGR1Y2tkdWNrYm90L2kpPyh0aGlzLmNhPW5ldyBBZSh0aGlzLkgscSh0aGlzLkdiLHRoaXMpKSxzZXRUaW1lb3V0KHEodGhpcy5UYyx0aGlzLCEwKSwwKSk6dGhpcy5jYT10aGlzLlJhPW5ldyB3aCh0aGlzLkgscSh0aGlzLkdiLHRoaXMpLHEodGhpcy5UYyx0aGlzKSxxKHRoaXMuTmUsdGhpcykpO3RoaXMuUGc9UGIoYSxxKGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBKYih0aGlzLlZhLHRoaXMuY2EpfSx0aGlzKSk7dGhpcy50Yz1uZXcgQ2Y7dGhpcy5CZT1cbm5ldyBuYjt2YXIgYz10aGlzO3RoaXMuemQ9bmV3IGdmKHtYZTpmdW5jdGlvbihhLGIsZixnKXtiPVtdO2Y9Yy5CZS5qKGEucGF0aCk7Zi5lKCl8fChiPWpmKGMuemQsbmV3IFViKHplLGEucGF0aCxmKSksc2V0VGltZW91dChmdW5jdGlvbigpe2coXCJva1wiKX0sMCkpO3JldHVybiBifSxaZDpiYX0pO0xoKHRoaXMsXCJjb25uZWN0ZWRcIiwhMSk7dGhpcy5rYT1uZXcgcWM7dGhpcy5QPW5ldyBFZyhhLHEodGhpcy5jYS5QLHRoaXMuY2EpLHEodGhpcy5jYS5lZSx0aGlzLmNhKSxxKHRoaXMuS2UsdGhpcykpO3RoaXMucGQ9MDt0aGlzLkNlPW51bGw7dGhpcy5PPW5ldyBnZih7WGU6ZnVuY3Rpb24oYSxiLGYsZyl7Yy5jYS54ZihhLGYsYixmdW5jdGlvbihiLGUpe3ZhciBmPWcoYixlKTt6YihjLmVhLGEucGF0aCxmKX0pO3JldHVybltdfSxaZDpmdW5jdGlvbihhLGIpe2MuY2EuT2YoYSxiKX19KX1oPUtoLnByb3RvdHlwZTtcbmgudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4odGhpcy5ILmxiP1wiaHR0cHM6Ly9cIjpcImh0dHA6Ly9cIikrdGhpcy5ILmhvc3R9O2gubmFtZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkguQ2J9O2Z1bmN0aW9uIE1oKGEpe2E9YS5CZS5qKG5ldyBLKFwiLmluZm8vc2VydmVyVGltZU9mZnNldFwiKSkuSygpfHwwO3JldHVybihuZXcgRGF0ZSkuZ2V0VGltZSgpK2F9ZnVuY3Rpb24gTmgoYSl7YT1hPXt0aW1lc3RhbXA6TWgoYSl9O2EudGltZXN0YW1wPWEudGltZXN0YW1wfHwobmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gYX1cbmguR2I9ZnVuY3Rpb24oYSxiLGMsZCl7dGhpcy5wZCsrO3ZhciBlPW5ldyBLKGEpO2I9dGhpcy5DZT90aGlzLkNlKGEsYik6YjthPVtdO2Q/Yz8oYj1uYShiLGZ1bmN0aW9uKGEpe3JldHVybiBMKGEpfSksYT1yZih0aGlzLk8sZSxiLGQpKTooYj1MKGIpLGE9bmYodGhpcy5PLGUsYixkKSk6Yz8oZD1uYShiLGZ1bmN0aW9uKGEpe3JldHVybiBMKGEpfSksYT1tZih0aGlzLk8sZSxkKSk6KGQ9TChiKSxhPWpmKHRoaXMuTyxuZXcgVWIoemUsZSxkKSkpO2Q9ZTswPGEubGVuZ3RoJiYoZD1PaCh0aGlzLGUpKTt6Yih0aGlzLmVhLGQsYSl9O2guVGM9ZnVuY3Rpb24oYSl7TGgodGhpcyxcImNvbm5lY3RlZFwiLGEpOyExPT09YSYmUGgodGhpcyl9O2guTmU9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcztZYyhhLGZ1bmN0aW9uKGEsZCl7TGgoYixkLGEpfSl9O2guS2U9ZnVuY3Rpb24oYSl7TGgodGhpcyxcImF1dGhlbnRpY2F0ZWRcIixhKX07XG5mdW5jdGlvbiBMaChhLGIsYyl7Yj1uZXcgSyhcIi8uaW5mby9cIitiKTtjPUwoYyk7dmFyIGQ9YS5CZTtkLlNkPWQuU2QuRyhiLGMpO2M9amYoYS56ZCxuZXcgVWIoemUsYixjKSk7emIoYS5lYSxiLGMpfWguS2I9ZnVuY3Rpb24oYSxiLGMsZCl7dGhpcy5mKFwic2V0XCIse3BhdGg6YS50b1N0cmluZygpLHZhbHVlOmIsWGc6Y30pO3ZhciBlPU5oKHRoaXMpO2I9TChiLGMpO3ZhciBlPXNjKGIsZSksZj10aGlzLkVkKyssZT1oZih0aGlzLk8sYSxlLGYsITApO3ZiKHRoaXMuZWEsZSk7dmFyIGc9dGhpczt0aGlzLmNhLnB1dChhLnRvU3RyaW5nKCksYi5LKCEwKSxmdW5jdGlvbihiLGMpe3ZhciBlPVwib2tcIj09PWI7ZXx8UShcInNldCBhdCBcIithK1wiIGZhaWxlZDogXCIrYik7ZT1sZihnLk8sZiwhZSk7emIoZy5lYSxhLGUpO1FoKGQsYixjKX0pO2U9UmgodGhpcyxhKTtPaCh0aGlzLGUpO3piKHRoaXMuZWEsZSxbXSl9O1xuaC51cGRhdGU9ZnVuY3Rpb24oYSxiLGMpe3RoaXMuZihcInVwZGF0ZVwiLHtwYXRoOmEudG9TdHJpbmcoKSx2YWx1ZTpifSk7dmFyIGQ9ITAsZT1OaCh0aGlzKSxmPXt9O3IoYixmdW5jdGlvbihhLGIpe2Q9ITE7dmFyIGM9TChhKTtmW2JdPXNjKGMsZSl9KTtpZihkKUJiKFwidXBkYXRlKCkgY2FsbGVkIHdpdGggZW1wdHkgZGF0YS4gIERvbid0IGRvIGFueXRoaW5nLlwiKSxRaChjLFwib2tcIik7ZWxzZXt2YXIgZz10aGlzLkVkKyssaz1rZih0aGlzLk8sYSxmLGcpO3ZiKHRoaXMuZWEsayk7dmFyIGw9dGhpczt0aGlzLmNhLnlmKGEudG9TdHJpbmcoKSxiLGZ1bmN0aW9uKGIsZCl7dmFyIGU9XCJva1wiPT09YjtlfHxRKFwidXBkYXRlIGF0IFwiK2ErXCIgZmFpbGVkOiBcIitiKTt2YXIgZT1sZihsLk8sZywhZSksZj1hOzA8ZS5sZW5ndGgmJihmPU9oKGwsYSkpO3piKGwuZWEsZixlKTtRaChjLGIsZCl9KTtiPVJoKHRoaXMsYSk7T2godGhpcyxiKTt6Yih0aGlzLmVhLGEsW10pfX07XG5mdW5jdGlvbiBQaChhKXthLmYoXCJvbkRpc2Nvbm5lY3RFdmVudHNcIik7dmFyIGI9TmgoYSksYz1bXTtyYyhwYyhhLmthLGIpLEYsZnVuY3Rpb24oYixlKXtjPWMuY29uY2F0KGpmKGEuTyxuZXcgVWIoemUsYixlKSkpO3ZhciBmPVJoKGEsYik7T2goYSxmKX0pO2Eua2E9bmV3IHFjO3piKGEuZWEsRixjKX1oLkdkPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpczt0aGlzLmNhLkdkKGEudG9TdHJpbmcoKSxmdW5jdGlvbihkLGUpe1wib2tcIj09PWQmJmVnKGMua2EsYSk7UWgoYixkLGUpfSl9O2Z1bmN0aW9uIFNoKGEsYixjLGQpe3ZhciBlPUwoYyk7YS5jYS5MZShiLnRvU3RyaW5nKCksZS5LKCEwKSxmdW5jdGlvbihjLGcpe1wib2tcIj09PWMmJmEua2EubWMoYixlKTtRaChkLGMsZyl9KX1mdW5jdGlvbiBUaChhLGIsYyxkLGUpe3ZhciBmPUwoYyxkKTthLmNhLkxlKGIudG9TdHJpbmcoKSxmLksoITApLGZ1bmN0aW9uKGMsZCl7XCJva1wiPT09YyYmYS5rYS5tYyhiLGYpO1FoKGUsYyxkKX0pfVxuZnVuY3Rpb24gVWgoYSxiLGMsZCl7dmFyIGU9ITAsZjtmb3IoZiBpbiBjKWU9ITE7ZT8oQmIoXCJvbkRpc2Nvbm5lY3QoKS51cGRhdGUoKSBjYWxsZWQgd2l0aCBlbXB0eSBkYXRhLiAgRG9uJ3QgZG8gYW55dGhpbmcuXCIpLFFoKGQsXCJva1wiKSk6YS5jYS5CZihiLnRvU3RyaW5nKCksYyxmdW5jdGlvbihlLGYpe2lmKFwib2tcIj09PWUpZm9yKHZhciBsIGluIGMpe3ZhciBtPUwoY1tsXSk7YS5rYS5tYyhiLncobCksbSl9UWgoZCxlLGYpfSl9ZnVuY3Rpb24gVmgoYSxiLGMpe2M9XCIuaW5mb1wiPT09TyhiLnBhdGgpP2EuemQuT2IoYixjKTphLk8uT2IoYixjKTt4YihhLmVhLGIucGF0aCxjKX1oLnliPWZ1bmN0aW9uKCl7dGhpcy5SYSYmdGhpcy5SYS55YigpfTtoLnFjPWZ1bmN0aW9uKCl7dGhpcy5SYSYmdGhpcy5SYS5xYygpfTtcbmguWWU9ZnVuY3Rpb24oYSl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlKXthPyh0aGlzLllkfHwodGhpcy5ZZD1uZXcgSWIodGhpcy5WYSkpLGE9dGhpcy5ZZC5nZXQoKSk6YT10aGlzLlZhLmdldCgpO3ZhciBiPVJhKHNhKGEpLGZ1bmN0aW9uKGEsYil7cmV0dXJuIE1hdGgubWF4KGIubGVuZ3RoLGEpfSwwKSxjO2ZvcihjIGluIGEpe2Zvcih2YXIgZD1hW2NdLGU9Yy5sZW5ndGg7ZTxiKzI7ZSsrKWMrPVwiIFwiO2NvbnNvbGUubG9nKGMrZCl9fX07aC5aZT1mdW5jdGlvbihhKXtMYih0aGlzLlZhLGEpO3RoaXMuUGcuTWZbYV09ITB9O2guZj1mdW5jdGlvbihhKXt2YXIgYj1cIlwiO3RoaXMuUmEmJihiPXRoaXMuUmEuaWQrXCI6XCIpO0JiKGIsYXJndW1lbnRzKX07XG5mdW5jdGlvbiBRaChhLGIsYyl7YSYmQ2IoZnVuY3Rpb24oKXtpZihcIm9rXCI9PWIpYShudWxsKTtlbHNle3ZhciBkPShifHxcImVycm9yXCIpLnRvVXBwZXJDYXNlKCksZT1kO2MmJihlKz1cIjogXCIrYyk7ZT1FcnJvcihlKTtlLmNvZGU9ZDthKGUpfX0pfTtmdW5jdGlvbiBXaChhLGIsYyxkLGUpe2Z1bmN0aW9uIGYoKXt9YS5mKFwidHJhbnNhY3Rpb24gb24gXCIrYik7dmFyIGc9bmV3IFUoYSxiKTtnLkViKFwidmFsdWVcIixmKTtjPXtwYXRoOmIsdXBkYXRlOmMsSjpkLHN0YXR1czpudWxsLEVmOkdjKCksY2Y6ZSxLZjowLGdlOmZ1bmN0aW9uKCl7Zy5nYyhcInZhbHVlXCIsZil9LGplOm51bGwsQWE6bnVsbCxtZDpudWxsLG5kOm51bGwsb2Q6bnVsbH07ZD1hLk8udWEoYix2b2lkIDApfHxDO2MubWQ9ZDtkPWMudXBkYXRlKGQuSygpKTtpZihuKGQpKXtTZihcInRyYW5zYWN0aW9uIGZhaWxlZDogRGF0YSByZXR1cm5lZCBcIixkLGMucGF0aCk7Yy5zdGF0dXM9MTtlPURmKGEudGMsYik7dmFyIGs9ZS5CYSgpfHxbXTtrLnB1c2goYyk7RWYoZSxrKTtcIm9iamVjdFwiPT09dHlwZW9mIGQmJm51bGwhPT1kJiZ1KGQsXCIucHJpb3JpdHlcIik/KGs9dyhkLFwiLnByaW9yaXR5XCIpLEooUWYoayksXCJJbnZhbGlkIHByaW9yaXR5IHJldHVybmVkIGJ5IHRyYW5zYWN0aW9uLiBQcmlvcml0eSBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nLCBmaW5pdGUgbnVtYmVyLCBzZXJ2ZXIgdmFsdWUsIG9yIG51bGwuXCIpKTpcbms9KGEuTy51YShiKXx8QykuQSgpLksoKTtlPU5oKGEpO2Q9TChkLGspO2U9c2MoZCxlKTtjLm5kPWQ7Yy5vZD1lO2MuQWE9YS5FZCsrO2M9aGYoYS5PLGIsZSxjLkFhLGMuY2YpO3piKGEuZWEsYixjKTtYaChhKX1lbHNlIGMuZ2UoKSxjLm5kPW51bGwsYy5vZD1udWxsLGMuSiYmKGE9bmV3IFMoYy5tZCxuZXcgVShhLGMucGF0aCksTSksYy5KKG51bGwsITEsYSkpfWZ1bmN0aW9uIFhoKGEsYil7dmFyIGM9Ynx8YS50YztifHxZaChhLGMpO2lmKG51bGwhPT1jLkJhKCkpe3ZhciBkPVpoKGEsYyk7SigwPGQubGVuZ3RoLFwiU2VuZGluZyB6ZXJvIGxlbmd0aCB0cmFuc2FjdGlvbiBxdWV1ZVwiKTtTYShkLGZ1bmN0aW9uKGEpe3JldHVybiAxPT09YS5zdGF0dXN9KSYmJGgoYSxjLnBhdGgoKSxkKX1lbHNlIGMudGQoKSYmYy5VKGZ1bmN0aW9uKGIpe1hoKGEsYil9KX1cbmZ1bmN0aW9uICRoKGEsYixjKXtmb3IodmFyIGQ9UWEoYyxmdW5jdGlvbihhKXtyZXR1cm4gYS5BYX0pLGU9YS5PLnVhKGIsZCl8fEMsZD1lLGU9ZS5oYXNoKCksZj0wO2Y8Yy5sZW5ndGg7ZisrKXt2YXIgZz1jW2ZdO0ooMT09PWcuc3RhdHVzLFwidHJ5VG9TZW5kVHJhbnNhY3Rpb25RdWV1ZV86IGl0ZW1zIGluIHF1ZXVlIHNob3VsZCBhbGwgYmUgcnVuLlwiKTtnLnN0YXR1cz0yO2cuS2YrKzt2YXIgaz1OKGIsZy5wYXRoKSxkPWQuRyhrLGcubmQpfWQ9ZC5LKCEwKTthLmNhLnB1dChiLnRvU3RyaW5nKCksZCxmdW5jdGlvbihkKXthLmYoXCJ0cmFuc2FjdGlvbiBwdXQgcmVzcG9uc2VcIix7cGF0aDpiLnRvU3RyaW5nKCksc3RhdHVzOmR9KTt2YXIgZT1bXTtpZihcIm9rXCI9PT1kKXtkPVtdO2ZvcihmPTA7ZjxjLmxlbmd0aDtmKyspe2NbZl0uc3RhdHVzPTM7ZT1lLmNvbmNhdChsZihhLk8sY1tmXS5BYSkpO2lmKGNbZl0uSil7dmFyIGc9Y1tmXS5vZCxrPW5ldyBVKGEsY1tmXS5wYXRoKTtkLnB1c2gocShjW2ZdLkosXG5udWxsLG51bGwsITAsbmV3IFMoZyxrLE0pKSl9Y1tmXS5nZSgpfVloKGEsRGYoYS50YyxiKSk7WGgoYSk7emIoYS5lYSxiLGUpO2ZvcihmPTA7ZjxkLmxlbmd0aDtmKyspQ2IoZFtmXSl9ZWxzZXtpZihcImRhdGFzdGFsZVwiPT09ZClmb3IoZj0wO2Y8Yy5sZW5ndGg7ZisrKWNbZl0uc3RhdHVzPTQ9PT1jW2ZdLnN0YXR1cz81OjE7ZWxzZSBmb3IoUShcInRyYW5zYWN0aW9uIGF0IFwiK2IudG9TdHJpbmcoKStcIiBmYWlsZWQ6IFwiK2QpLGY9MDtmPGMubGVuZ3RoO2YrKyljW2ZdLnN0YXR1cz01LGNbZl0uamU9ZDtPaChhLGIpfX0sZSl9ZnVuY3Rpb24gT2goYSxiKXt2YXIgYz1haShhLGIpLGQ9Yy5wYXRoKCksYz1aaChhLGMpO2JpKGEsYyxkKTtyZXR1cm4gZH1cbmZ1bmN0aW9uIGJpKGEsYixjKXtpZigwIT09Yi5sZW5ndGgpe2Zvcih2YXIgZD1bXSxlPVtdLGY9UWEoYixmdW5jdGlvbihhKXtyZXR1cm4gYS5BYX0pLGc9MDtnPGIubGVuZ3RoO2crKyl7dmFyIGs9YltnXSxsPU4oYyxrLnBhdGgpLG09ITEsdjtKKG51bGwhPT1sLFwicmVydW5UcmFuc2FjdGlvbnNVbmRlck5vZGVfOiByZWxhdGl2ZVBhdGggc2hvdWxkIG5vdCBiZSBudWxsLlwiKTtpZig1PT09ay5zdGF0dXMpbT0hMCx2PWsuamUsZT1lLmNvbmNhdChsZihhLk8say5BYSwhMCkpO2Vsc2UgaWYoMT09PWsuc3RhdHVzKWlmKDI1PD1rLktmKW09ITAsdj1cIm1heHJldHJ5XCIsZT1lLmNvbmNhdChsZihhLk8say5BYSwhMCkpO2Vsc2V7dmFyIHk9YS5PLnVhKGsucGF0aCxmKXx8QztrLm1kPXk7dmFyIEk9YltnXS51cGRhdGUoeS5LKCkpO24oSSk/KFNmKFwidHJhbnNhY3Rpb24gZmFpbGVkOiBEYXRhIHJldHVybmVkIFwiLEksay5wYXRoKSxsPUwoSSksXCJvYmplY3RcIj09PXR5cGVvZiBJJiZudWxsIT1cbkkmJnUoSSxcIi5wcmlvcml0eVwiKXx8KGw9bC5kYSh5LkEoKSkpLHk9ay5BYSxJPU5oKGEpLEk9c2MobCxJKSxrLm5kPWwsay5vZD1JLGsuQWE9YS5FZCsrLFZhKGYseSksZT1lLmNvbmNhdChoZihhLk8say5wYXRoLEksay5BYSxrLmNmKSksZT1lLmNvbmNhdChsZihhLk8seSwhMCkpKToobT0hMCx2PVwibm9kYXRhXCIsZT1lLmNvbmNhdChsZihhLk8say5BYSwhMCkpKX16YihhLmVhLGMsZSk7ZT1bXTttJiYoYltnXS5zdGF0dXM9MyxzZXRUaW1lb3V0KGJbZ10uZ2UsTWF0aC5mbG9vcigwKSksYltnXS5KJiYoXCJub2RhdGFcIj09PXY/KGs9bmV3IFUoYSxiW2ddLnBhdGgpLGQucHVzaChxKGJbZ10uSixudWxsLG51bGwsITEsbmV3IFMoYltnXS5tZCxrLE0pKSkpOmQucHVzaChxKGJbZ10uSixudWxsLEVycm9yKHYpLCExLG51bGwpKSkpfVloKGEsYS50Yyk7Zm9yKGc9MDtnPGQubGVuZ3RoO2crKylDYihkW2ddKTtYaChhKX19XG5mdW5jdGlvbiBhaShhLGIpe2Zvcih2YXIgYyxkPWEudGM7bnVsbCE9PShjPU8oYikpJiZudWxsPT09ZC5CYSgpOylkPURmKGQsYyksYj1HKGIpO3JldHVybiBkfWZ1bmN0aW9uIFpoKGEsYil7dmFyIGM9W107Y2koYSxiLGMpO2Muc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhLkVmLWIuRWZ9KTtyZXR1cm4gY31mdW5jdGlvbiBjaShhLGIsYyl7dmFyIGQ9Yi5CYSgpO2lmKG51bGwhPT1kKWZvcih2YXIgZT0wO2U8ZC5sZW5ndGg7ZSsrKWMucHVzaChkW2VdKTtiLlUoZnVuY3Rpb24oYil7Y2koYSxiLGMpfSl9ZnVuY3Rpb24gWWgoYSxiKXt2YXIgYz1iLkJhKCk7aWYoYyl7Zm9yKHZhciBkPTAsZT0wO2U8Yy5sZW5ndGg7ZSsrKTMhPT1jW2VdLnN0YXR1cyYmKGNbZF09Y1tlXSxkKyspO2MubGVuZ3RoPWQ7RWYoYiwwPGMubGVuZ3RoP2M6bnVsbCl9Yi5VKGZ1bmN0aW9uKGIpe1loKGEsYil9KX1cbmZ1bmN0aW9uIFJoKGEsYil7dmFyIGM9YWkoYSxiKS5wYXRoKCksZD1EZihhLnRjLGIpO0hmKGQsZnVuY3Rpb24oYil7ZGkoYSxiKX0pO2RpKGEsZCk7R2YoZCxmdW5jdGlvbihiKXtkaShhLGIpfSk7cmV0dXJuIGN9XG5mdW5jdGlvbiBkaShhLGIpe3ZhciBjPWIuQmEoKTtpZihudWxsIT09Yyl7Zm9yKHZhciBkPVtdLGU9W10sZj0tMSxnPTA7ZzxjLmxlbmd0aDtnKyspNCE9PWNbZ10uc3RhdHVzJiYoMj09PWNbZ10uc3RhdHVzPyhKKGY9PT1nLTEsXCJBbGwgU0VOVCBpdGVtcyBzaG91bGQgYmUgYXQgYmVnaW5uaW5nIG9mIHF1ZXVlLlwiKSxmPWcsY1tnXS5zdGF0dXM9NCxjW2ddLmplPVwic2V0XCIpOihKKDE9PT1jW2ddLnN0YXR1cyxcIlVuZXhwZWN0ZWQgdHJhbnNhY3Rpb24gc3RhdHVzIGluIGFib3J0XCIpLGNbZ10uZ2UoKSxlPWUuY29uY2F0KGxmKGEuTyxjW2ddLkFhLCEwKSksY1tnXS5KJiZkLnB1c2gocShjW2ddLkosbnVsbCxFcnJvcihcInNldFwiKSwhMSxudWxsKSkpKTstMT09PWY/RWYoYixudWxsKTpjLmxlbmd0aD1mKzE7emIoYS5lYSxiLnBhdGgoKSxlKTtmb3IoZz0wO2c8ZC5sZW5ndGg7ZysrKUNiKGRbZ10pfX07ZnVuY3Rpb24gVygpe3RoaXMubmM9e307dGhpcy5QZj0hMX1jYShXKTtXLnByb3RvdHlwZS55Yj1mdW5jdGlvbigpe2Zvcih2YXIgYSBpbiB0aGlzLm5jKXRoaXMubmNbYV0ueWIoKX07Vy5wcm90b3R5cGUuaW50ZXJydXB0PVcucHJvdG90eXBlLnliO1cucHJvdG90eXBlLnFjPWZ1bmN0aW9uKCl7Zm9yKHZhciBhIGluIHRoaXMubmMpdGhpcy5uY1thXS5xYygpfTtXLnByb3RvdHlwZS5yZXN1bWU9Vy5wcm90b3R5cGUucWM7Vy5wcm90b3R5cGUudWU9ZnVuY3Rpb24oKXt0aGlzLlBmPSEwfTtmdW5jdGlvbiBYKGEsYil7dGhpcy5hZD1hO3RoaXMucWE9Yn1YLnByb3RvdHlwZS5jYW5jZWw9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLmNhbmNlbFwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuY2FuY2VsXCIsMSxhLCEwKTt0aGlzLmFkLkdkKHRoaXMucWEsYXx8bnVsbCl9O1gucHJvdG90eXBlLmNhbmNlbD1YLnByb3RvdHlwZS5jYW5jZWw7WC5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5yZW1vdmVcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5yZW1vdmVcIix0aGlzLnFhKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkucmVtb3ZlXCIsMSxhLCEwKTtTaCh0aGlzLmFkLHRoaXMucWEsbnVsbCxhKX07WC5wcm90b3R5cGUucmVtb3ZlPVgucHJvdG90eXBlLnJlbW92ZTtcblgucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRcIix0aGlzLnFhKTtSZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFwiLGEsdGhpcy5xYSwhMSk7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFwiLDIsYiwhMCk7U2godGhpcy5hZCx0aGlzLnFhLGEsYil9O1gucHJvdG90eXBlLnNldD1YLnByb3RvdHlwZS5zZXQ7XG5YLnByb3RvdHlwZS5LYj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLHRoaXMucWEpO1JmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsYSx0aGlzLnFhLCExKTtVZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLDIsYik7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFdpdGhQcmlvcml0eVwiLDMsYywhMCk7VGgodGhpcy5hZCx0aGlzLnFhLGEsYixjKX07WC5wcm90b3R5cGUuc2V0V2l0aFByaW9yaXR5PVgucHJvdG90eXBlLktiO1xuWC5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZVwiLHRoaXMucWEpO2lmKGVhKGEpKXtmb3IodmFyIGM9e30sZD0wO2Q8YS5sZW5ndGg7KytkKWNbXCJcIitkXT1hW2RdO2E9YztRKFwiUGFzc2luZyBhbiBBcnJheSB0byBGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS51cGRhdGUoKSBpcyBkZXByZWNhdGVkLiBVc2Ugc2V0KCkgaWYgeW91IHdhbnQgdG8gb3ZlcndyaXRlIHRoZSBleGlzdGluZyBkYXRhLCBvciBhbiBPYmplY3Qgd2l0aCBpbnRlZ2VyIGtleXMgaWYgeW91IHJlYWxseSBkbyB3YW50IHRvIG9ubHkgdXBkYXRlIHNvbWUgb2YgdGhlIGNoaWxkcmVuLlwiKX1UZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZVwiLGEsdGhpcy5xYSk7QShcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZVwiLDIsYiwhMCk7XG5VaCh0aGlzLmFkLHRoaXMucWEsYSxiKX07WC5wcm90b3R5cGUudXBkYXRlPVgucHJvdG90eXBlLnVwZGF0ZTtmdW5jdGlvbiBZKGEsYixjLGQpe3RoaXMuaz1hO3RoaXMucGF0aD1iO3RoaXMubj1jO3RoaXMuamM9ZH1cbmZ1bmN0aW9uIGVpKGEpe3ZhciBiPW51bGwsYz1udWxsO2EubGEmJihiPW9kKGEpKTthLm5hJiYoYz1xZChhKSk7aWYoYS5nPT09VmQpe2lmKGEubGEpe2lmKFwiW01JTl9OQU1FXVwiIT1uZChhKSl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IGtleSwgeW91IG1heSBvbmx5IHBhc3Mgb25lIGFyZ3VtZW50IHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSwgb3IgZXF1YWxUbygpLlwiKTtpZihcInN0cmluZ1wiIT09dHlwZW9mIGIpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBrZXksIHRoZSBhcmd1bWVudCBwYXNzZWQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLG9yIGVxdWFsVG8oKSBtdXN0IGJlIGEgc3RyaW5nLlwiKTt9aWYoYS5uYSl7aWYoXCJbTUFYX05BTUVdXCIhPXBkKGEpKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkga2V5LCB5b3UgbWF5IG9ubHkgcGFzcyBvbmUgYXJndW1lbnQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLCBvciBlcXVhbFRvKCkuXCIpO2lmKFwic3RyaW5nXCIhPT1cbnR5cGVvZiBjKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkga2V5LCB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSxvciBlcXVhbFRvKCkgbXVzdCBiZSBhIHN0cmluZy5cIik7fX1lbHNlIGlmKGEuZz09PU0pe2lmKG51bGwhPWImJiFRZihiKXx8bnVsbCE9YyYmIVFmKGMpKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkgcHJpb3JpdHksIHRoZSBmaXJzdCBhcmd1bWVudCBwYXNzZWQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLCBvciBlcXVhbFRvKCkgbXVzdCBiZSBhIHZhbGlkIHByaW9yaXR5IHZhbHVlIChudWxsLCBhIG51bWJlciwgb3IgYSBzdHJpbmcpLlwiKTt9ZWxzZSBpZihKKGEuZyBpbnN0YW5jZW9mIFJkfHxhLmc9PT1ZZCxcInVua25vd24gaW5kZXggdHlwZS5cIiksbnVsbCE9YiYmXCJvYmplY3RcIj09PXR5cGVvZiBifHxudWxsIT1jJiZcIm9iamVjdFwiPT09dHlwZW9mIGMpdGhyb3cgRXJyb3IoXCJRdWVyeTogRmlyc3QgYXJndW1lbnQgcGFzc2VkIHRvIHN0YXJ0QXQoKSwgZW5kQXQoKSwgb3IgZXF1YWxUbygpIGNhbm5vdCBiZSBhbiBvYmplY3QuXCIpO1xufWZ1bmN0aW9uIGZpKGEpe2lmKGEubGEmJmEubmEmJmEuaWEmJighYS5pYXx8XCJcIj09PWEuTmIpKXRocm93IEVycm9yKFwiUXVlcnk6IENhbid0IGNvbWJpbmUgc3RhcnRBdCgpLCBlbmRBdCgpLCBhbmQgbGltaXQoKS4gVXNlIGxpbWl0VG9GaXJzdCgpIG9yIGxpbWl0VG9MYXN0KCkgaW5zdGVhZC5cIik7fWZ1bmN0aW9uIGdpKGEsYil7aWYoITA9PT1hLmpjKXRocm93IEVycm9yKGIrXCI6IFlvdSBjYW4ndCBjb21iaW5lIG11bHRpcGxlIG9yZGVyQnkgY2FsbHMuXCIpO31ZLnByb3RvdHlwZS5sYz1mdW5jdGlvbigpe3goXCJRdWVyeS5yZWZcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIG5ldyBVKHRoaXMuayx0aGlzLnBhdGgpfTtZLnByb3RvdHlwZS5yZWY9WS5wcm90b3R5cGUubGM7XG5ZLnByb3RvdHlwZS5FYj1mdW5jdGlvbihhLGIsYyxkKXt4KFwiUXVlcnkub25cIiwyLDQsYXJndW1lbnRzLmxlbmd0aCk7VmYoXCJRdWVyeS5vblwiLGEsITEpO0EoXCJRdWVyeS5vblwiLDIsYiwhMSk7dmFyIGU9aGkoXCJRdWVyeS5vblwiLGMsZCk7aWYoXCJ2YWx1ZVwiPT09YSlWaCh0aGlzLmssdGhpcyxuZXcgamQoYixlLmNhbmNlbHx8bnVsbCxlLk1hfHxudWxsKSk7ZWxzZXt2YXIgZj17fTtmW2FdPWI7VmgodGhpcy5rLHRoaXMsbmV3IGtkKGYsZS5jYW5jZWwsZS5NYSkpfXJldHVybiBifTtZLnByb3RvdHlwZS5vbj1ZLnByb3RvdHlwZS5FYjtcblkucHJvdG90eXBlLmdjPWZ1bmN0aW9uKGEsYixjKXt4KFwiUXVlcnkub2ZmXCIsMCwzLGFyZ3VtZW50cy5sZW5ndGgpO1ZmKFwiUXVlcnkub2ZmXCIsYSwhMCk7QShcIlF1ZXJ5Lm9mZlwiLDIsYiwhMCk7bGIoXCJRdWVyeS5vZmZcIiwzLGMpO3ZhciBkPW51bGwsZT1udWxsO1widmFsdWVcIj09PWE/ZD1uZXcgamQoYnx8bnVsbCxudWxsLGN8fG51bGwpOmEmJihiJiYoZT17fSxlW2FdPWIpLGQ9bmV3IGtkKGUsbnVsbCxjfHxudWxsKSk7ZT10aGlzLms7ZD1cIi5pbmZvXCI9PT1PKHRoaXMucGF0aCk/ZS56ZC5rYih0aGlzLGQpOmUuTy5rYih0aGlzLGQpO3hiKGUuZWEsdGhpcy5wYXRoLGQpfTtZLnByb3RvdHlwZS5vZmY9WS5wcm90b3R5cGUuZ2M7XG5ZLnByb3RvdHlwZS5BZz1mdW5jdGlvbihhLGIpe2Z1bmN0aW9uIGMoZyl7ZiYmKGY9ITEsZS5nYyhhLGMpLGIuY2FsbChkLk1hLGcpKX14KFwiUXVlcnkub25jZVwiLDIsNCxhcmd1bWVudHMubGVuZ3RoKTtWZihcIlF1ZXJ5Lm9uY2VcIixhLCExKTtBKFwiUXVlcnkub25jZVwiLDIsYiwhMSk7dmFyIGQ9aGkoXCJRdWVyeS5vbmNlXCIsYXJndW1lbnRzWzJdLGFyZ3VtZW50c1szXSksZT10aGlzLGY9ITA7dGhpcy5FYihhLGMsZnVuY3Rpb24oYil7ZS5nYyhhLGMpO2QuY2FuY2VsJiZkLmNhbmNlbC5jYWxsKGQuTWEsYil9KX07WS5wcm90b3R5cGUub25jZT1ZLnByb3RvdHlwZS5BZztcblkucHJvdG90eXBlLkdlPWZ1bmN0aW9uKGEpe1EoXCJRdWVyeS5saW1pdCgpIGJlaW5nIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgUXVlcnkubGltaXRUb0ZpcnN0KCkgb3IgUXVlcnkubGltaXRUb0xhc3QoKSBpbnN0ZWFkLlwiKTt4KFwiUXVlcnkubGltaXRcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7aWYoIWdhKGEpfHxNYXRoLmZsb29yKGEpIT09YXx8MD49YSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0OiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci5cIik7aWYodGhpcy5uLmlhKXRocm93IEVycm9yKFwiUXVlcnkubGltaXQ6IExpbWl0IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGxpbWl0LCBsaW1pdFRvRmlyc3QsIG9ybGltaXRUb0xhc3QuXCIpO3ZhciBiPXRoaXMubi5HZShhKTtmaShiKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxiLHRoaXMuamMpfTtZLnByb3RvdHlwZS5saW1pdD1ZLnByb3RvdHlwZS5HZTtcblkucHJvdG90eXBlLkhlPWZ1bmN0aW9uKGEpe3goXCJRdWVyeS5saW1pdFRvRmlyc3RcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7aWYoIWdhKGEpfHxNYXRoLmZsb29yKGEpIT09YXx8MD49YSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0VG9GaXJzdDogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCIpO2lmKHRoaXMubi5pYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0VG9GaXJzdDogTGltaXQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gbGltaXQsIGxpbWl0VG9GaXJzdCwgb3IgbGltaXRUb0xhc3QpLlwiKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCx0aGlzLm4uSGUoYSksdGhpcy5qYyl9O1kucHJvdG90eXBlLmxpbWl0VG9GaXJzdD1ZLnByb3RvdHlwZS5IZTtcblkucHJvdG90eXBlLkllPWZ1bmN0aW9uKGEpe3goXCJRdWVyeS5saW1pdFRvTGFzdFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZighZ2EoYSl8fE1hdGguZmxvb3IoYSkhPT1hfHwwPj1hKXRocm93IEVycm9yKFwiUXVlcnkubGltaXRUb0xhc3Q6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLlwiKTtpZih0aGlzLm4uaWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdFRvTGFzdDogTGltaXQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gbGltaXQsIGxpbWl0VG9GaXJzdCwgb3IgbGltaXRUb0xhc3QpLlwiKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCx0aGlzLm4uSWUoYSksdGhpcy5qYyl9O1kucHJvdG90eXBlLmxpbWl0VG9MYXN0PVkucHJvdG90eXBlLkllO1xuWS5wcm90b3R5cGUuQmc9ZnVuY3Rpb24oYSl7eChcIlF1ZXJ5Lm9yZGVyQnlDaGlsZFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZihcIiRrZXlcIj09PWEpdGhyb3cgRXJyb3IoJ1F1ZXJ5Lm9yZGVyQnlDaGlsZDogXCIka2V5XCIgaXMgaW52YWxpZC4gIFVzZSBRdWVyeS5vcmRlckJ5S2V5KCkgaW5zdGVhZC4nKTtpZihcIiRwcmlvcml0eVwiPT09YSl0aHJvdyBFcnJvcignUXVlcnkub3JkZXJCeUNoaWxkOiBcIiRwcmlvcml0eVwiIGlzIGludmFsaWQuICBVc2UgUXVlcnkub3JkZXJCeVByaW9yaXR5KCkgaW5zdGVhZC4nKTtpZihcIiR2YWx1ZVwiPT09YSl0aHJvdyBFcnJvcignUXVlcnkub3JkZXJCeUNoaWxkOiBcIiR2YWx1ZVwiIGlzIGludmFsaWQuICBVc2UgUXVlcnkub3JkZXJCeVZhbHVlKCkgaW5zdGVhZC4nKTtXZihcIlF1ZXJ5Lm9yZGVyQnlDaGlsZFwiLDEsYSwhMSk7Z2kodGhpcyxcIlF1ZXJ5Lm9yZGVyQnlDaGlsZFwiKTt2YXIgYj1iZSh0aGlzLm4sbmV3IFJkKGEpKTtlaShiKTtyZXR1cm4gbmV3IFkodGhpcy5rLFxudGhpcy5wYXRoLGIsITApfTtZLnByb3RvdHlwZS5vcmRlckJ5Q2hpbGQ9WS5wcm90b3R5cGUuQmc7WS5wcm90b3R5cGUuQ2c9ZnVuY3Rpb24oKXt4KFwiUXVlcnkub3JkZXJCeUtleVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtnaSh0aGlzLFwiUXVlcnkub3JkZXJCeUtleVwiKTt2YXIgYT1iZSh0aGlzLm4sVmQpO2VpKGEpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGEsITApfTtZLnByb3RvdHlwZS5vcmRlckJ5S2V5PVkucHJvdG90eXBlLkNnO1kucHJvdG90eXBlLkRnPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5Lm9yZGVyQnlQcmlvcml0eVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtnaSh0aGlzLFwiUXVlcnkub3JkZXJCeVByaW9yaXR5XCIpO3ZhciBhPWJlKHRoaXMubixNKTtlaShhKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxhLCEwKX07WS5wcm90b3R5cGUub3JkZXJCeVByaW9yaXR5PVkucHJvdG90eXBlLkRnO1xuWS5wcm90b3R5cGUuRWc9ZnVuY3Rpb24oKXt4KFwiUXVlcnkub3JkZXJCeVZhbHVlXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2dpKHRoaXMsXCJRdWVyeS5vcmRlckJ5VmFsdWVcIik7dmFyIGE9YmUodGhpcy5uLFlkKTtlaShhKTtyZXR1cm4gbmV3IFkodGhpcy5rLHRoaXMucGF0aCxhLCEwKX07WS5wcm90b3R5cGUub3JkZXJCeVZhbHVlPVkucHJvdG90eXBlLkVnO1xuWS5wcm90b3R5cGUuWGQ9ZnVuY3Rpb24oYSxiKXt4KFwiUXVlcnkuc3RhcnRBdFwiLDAsMixhcmd1bWVudHMubGVuZ3RoKTtSZihcIlF1ZXJ5LnN0YXJ0QXRcIixhLHRoaXMucGF0aCwhMCk7V2YoXCJRdWVyeS5zdGFydEF0XCIsMixiLCEwKTt2YXIgYz10aGlzLm4uWGQoYSxiKTtmaShjKTtlaShjKTtpZih0aGlzLm4ubGEpdGhyb3cgRXJyb3IoXCJRdWVyeS5zdGFydEF0OiBTdGFydGluZyBwb2ludCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBzdGFydEF0IG9yIGVxdWFsVG8pLlwiKTtuKGEpfHwoYj1hPW51bGwpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGMsdGhpcy5qYyl9O1kucHJvdG90eXBlLnN0YXJ0QXQ9WS5wcm90b3R5cGUuWGQ7XG5ZLnByb3RvdHlwZS5xZD1mdW5jdGlvbihhLGIpe3goXCJRdWVyeS5lbmRBdFwiLDAsMixhcmd1bWVudHMubGVuZ3RoKTtSZihcIlF1ZXJ5LmVuZEF0XCIsYSx0aGlzLnBhdGgsITApO1dmKFwiUXVlcnkuZW5kQXRcIiwyLGIsITApO3ZhciBjPXRoaXMubi5xZChhLGIpO2ZpKGMpO2VpKGMpO2lmKHRoaXMubi5uYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmVuZEF0OiBFbmRpbmcgcG9pbnQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gZW5kQXQgb3IgZXF1YWxUbykuXCIpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGMsdGhpcy5qYyl9O1kucHJvdG90eXBlLmVuZEF0PVkucHJvdG90eXBlLnFkO1xuWS5wcm90b3R5cGUuaGc9ZnVuY3Rpb24oYSxiKXt4KFwiUXVlcnkuZXF1YWxUb1wiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtSZihcIlF1ZXJ5LmVxdWFsVG9cIixhLHRoaXMucGF0aCwhMSk7V2YoXCJRdWVyeS5lcXVhbFRvXCIsMixiLCEwKTtpZih0aGlzLm4ubGEpdGhyb3cgRXJyb3IoXCJRdWVyeS5lcXVhbFRvOiBTdGFydGluZyBwb2ludCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBlbmRBdCBvciBlcXVhbFRvKS5cIik7aWYodGhpcy5uLm5hKXRocm93IEVycm9yKFwiUXVlcnkuZXF1YWxUbzogRW5kaW5nIHBvaW50IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGVuZEF0IG9yIGVxdWFsVG8pLlwiKTtyZXR1cm4gdGhpcy5YZChhLGIpLnFkKGEsYil9O1kucHJvdG90eXBlLmVxdWFsVG89WS5wcm90b3R5cGUuaGc7XG5ZLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3goXCJRdWVyeS50b1N0cmluZ1wiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtmb3IodmFyIGE9dGhpcy5wYXRoLGI9XCJcIixjPWEuWTtjPGEuby5sZW5ndGg7YysrKVwiXCIhPT1hLm9bY10mJihiKz1cIi9cIitlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKGEub1tjXSkpKTthPXRoaXMuay50b1N0cmluZygpKyhifHxcIi9cIik7Yj1qYihlZSh0aGlzLm4pKTtyZXR1cm4gYSs9Yi5yZXBsYWNlKC9eJi8sXCJcIil9O1kucHJvdG90eXBlLnRvU3RyaW5nPVkucHJvdG90eXBlLnRvU3RyaW5nO1kucHJvdG90eXBlLndhPWZ1bmN0aW9uKCl7dmFyIGE9V2MoY2UodGhpcy5uKSk7cmV0dXJuXCJ7fVwiPT09YT9cImRlZmF1bHRcIjphfTtcbmZ1bmN0aW9uIGhpKGEsYixjKXt2YXIgZD17Y2FuY2VsOm51bGwsTWE6bnVsbH07aWYoYiYmYylkLmNhbmNlbD1iLEEoYSwzLGQuY2FuY2VsLCEwKSxkLk1hPWMsbGIoYSw0LGQuTWEpO2Vsc2UgaWYoYilpZihcIm9iamVjdFwiPT09dHlwZW9mIGImJm51bGwhPT1iKWQuTWE9YjtlbHNlIGlmKFwiZnVuY3Rpb25cIj09PXR5cGVvZiBiKWQuY2FuY2VsPWI7ZWxzZSB0aHJvdyBFcnJvcih6KGEsMywhMCkrXCIgbXVzdCBlaXRoZXIgYmUgYSBjYW5jZWwgY2FsbGJhY2sgb3IgYSBjb250ZXh0IG9iamVjdC5cIik7cmV0dXJuIGR9O3ZhciBaPXt9O1oudmM9d2g7Wi5EYXRhQ29ubmVjdGlvbj1aLnZjO3doLnByb3RvdHlwZS5PZz1mdW5jdGlvbihhLGIpe3RoaXMuRGEoXCJxXCIse3A6YX0sYil9O1oudmMucHJvdG90eXBlLnNpbXBsZUxpc3Rlbj1aLnZjLnByb3RvdHlwZS5PZzt3aC5wcm90b3R5cGUuZ2c9ZnVuY3Rpb24oYSxiKXt0aGlzLkRhKFwiZWNob1wiLHtkOmF9LGIpfTtaLnZjLnByb3RvdHlwZS5lY2hvPVoudmMucHJvdG90eXBlLmdnO3doLnByb3RvdHlwZS5pbnRlcnJ1cHQ9d2gucHJvdG90eXBlLnliO1ouU2Y9a2g7Wi5SZWFsVGltZUNvbm5lY3Rpb249Wi5TZjtraC5wcm90b3R5cGUuc2VuZFJlcXVlc3Q9a2gucHJvdG90eXBlLkRhO2toLnByb3RvdHlwZS5jbG9zZT1raC5wcm90b3R5cGUuY2xvc2U7XG5aLm9nPWZ1bmN0aW9uKGEpe3ZhciBiPXdoLnByb3RvdHlwZS5wdXQ7d2gucHJvdG90eXBlLnB1dD1mdW5jdGlvbihjLGQsZSxmKXtuKGYpJiYoZj1hKCkpO2IuY2FsbCh0aGlzLGMsZCxlLGYpfTtyZXR1cm4gZnVuY3Rpb24oKXt3aC5wcm90b3R5cGUucHV0PWJ9fTtaLmhpamFja0hhc2g9Wi5vZztaLlJmPUVjO1ouQ29ubmVjdGlvblRhcmdldD1aLlJmO1oud2E9ZnVuY3Rpb24oYSl7cmV0dXJuIGEud2EoKX07Wi5xdWVyeUlkZW50aWZpZXI9Wi53YTtaLnFnPWZ1bmN0aW9uKGEpe3JldHVybiBhLmsuUmEuYWF9O1oubGlzdGVucz1aLnFnO1oudWU9ZnVuY3Rpb24oYSl7YS51ZSgpfTtaLmZvcmNlUmVzdENsaWVudD1aLnVlO2Z1bmN0aW9uIFUoYSxiKXt2YXIgYyxkLGU7aWYoYSBpbnN0YW5jZW9mIEtoKWM9YSxkPWI7ZWxzZXt4KFwibmV3IEZpcmViYXNlXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO2Q9UmMoYXJndW1lbnRzWzBdKTtjPWQuUWc7XCJmaXJlYmFzZVwiPT09ZC5kb21haW4mJlFjKGQuaG9zdCtcIiBpcyBubyBsb25nZXIgc3VwcG9ydGVkLiBQbGVhc2UgdXNlIDxZT1VSIEZJUkVCQVNFPi5maXJlYmFzZWlvLmNvbSBpbnN0ZWFkXCIpO2N8fFFjKFwiQ2Fubm90IHBhcnNlIEZpcmViYXNlIHVybC4gUGxlYXNlIHVzZSBodHRwczovLzxZT1VSIEZJUkVCQVNFPi5maXJlYmFzZWlvLmNvbVwiKTtkLmxifHxcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmd2luZG93LmxvY2F0aW9uJiZ3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wmJi0xIT09d2luZG93LmxvY2F0aW9uLnByb3RvY29sLmluZGV4T2YoXCJodHRwczpcIikmJlEoXCJJbnNlY3VyZSBGaXJlYmFzZSBhY2Nlc3MgZnJvbSBhIHNlY3VyZSBwYWdlLiBQbGVhc2UgdXNlIGh0dHBzIGluIGNhbGxzIHRvIG5ldyBGaXJlYmFzZSgpLlwiKTtcbmM9bmV3IEVjKGQuaG9zdCxkLmxiLGMsXCJ3c1wiPT09ZC5zY2hlbWV8fFwid3NzXCI9PT1kLnNjaGVtZSk7ZD1uZXcgSyhkLlpjKTtlPWQudG9TdHJpbmcoKTt2YXIgZjshKGY9IXAoYy5ob3N0KXx8MD09PWMuaG9zdC5sZW5ndGh8fCFQZihjLkNiKSkmJihmPTAhPT1lLmxlbmd0aCkmJihlJiYoZT1lLnJlcGxhY2UoL15cXC8qXFwuaW5mbyhcXC98JCkvLFwiL1wiKSksZj0hKHAoZSkmJjAhPT1lLmxlbmd0aCYmIU9mLnRlc3QoZSkpKTtpZihmKXRocm93IEVycm9yKHooXCJuZXcgRmlyZWJhc2VcIiwxLCExKSsnbXVzdCBiZSBhIHZhbGlkIGZpcmViYXNlIFVSTCBhbmQgdGhlIHBhdGggY2FuXFwndCBjb250YWluIFwiLlwiLCBcIiNcIiwgXCIkXCIsIFwiW1wiLCBvciBcIl1cIi4nKTtpZihiKWlmKGIgaW5zdGFuY2VvZiBXKWU9YjtlbHNlIGlmKHAoYikpZT1XLnViKCksYy5MZD1iO2Vsc2UgdGhyb3cgRXJyb3IoXCJFeHBlY3RlZCBhIHZhbGlkIEZpcmViYXNlLkNvbnRleHQgZm9yIHNlY29uZCBhcmd1bWVudCB0byBuZXcgRmlyZWJhc2UoKVwiKTtcbmVsc2UgZT1XLnViKCk7Zj1jLnRvU3RyaW5nKCk7dmFyIGc9dyhlLm5jLGYpO2d8fChnPW5ldyBLaChjLGUuUGYpLGUubmNbZl09Zyk7Yz1nfVkuY2FsbCh0aGlzLGMsZCwkZCwhMSl9bWEoVSxZKTt2YXIgaWk9VSxqaT1bXCJGaXJlYmFzZVwiXSxraT1hYTtqaVswXWluIGtpfHwha2kuZXhlY1NjcmlwdHx8a2kuZXhlY1NjcmlwdChcInZhciBcIitqaVswXSk7Zm9yKHZhciBsaTtqaS5sZW5ndGgmJihsaT1qaS5zaGlmdCgpKTspIWppLmxlbmd0aCYmbihpaSk/a2lbbGldPWlpOmtpPWtpW2xpXT9raVtsaV06a2lbbGldPXt9O1UucHJvdG90eXBlLm5hbWU9ZnVuY3Rpb24oKXtRKFwiRmlyZWJhc2UubmFtZSgpIGJlaW5nIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgRmlyZWJhc2Uua2V5KCkgaW5zdGVhZC5cIik7eChcIkZpcmViYXNlLm5hbWVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMua2V5KCl9O1UucHJvdG90eXBlLm5hbWU9VS5wcm90b3R5cGUubmFtZTtcblUucHJvdG90eXBlLmtleT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5rZXlcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMucGF0aC5lKCk/bnVsbDp2Yyh0aGlzLnBhdGgpfTtVLnByb3RvdHlwZS5rZXk9VS5wcm90b3R5cGUua2V5O1UucHJvdG90eXBlLnc9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLmNoaWxkXCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKGdhKGEpKWE9U3RyaW5nKGEpO2Vsc2UgaWYoIShhIGluc3RhbmNlb2YgSykpaWYobnVsbD09PU8odGhpcy5wYXRoKSl7dmFyIGI9YTtiJiYoYj1iLnJlcGxhY2UoL15cXC8qXFwuaW5mbyhcXC98JCkvLFwiL1wiKSk7WGYoXCJGaXJlYmFzZS5jaGlsZFwiLGIpfWVsc2UgWGYoXCJGaXJlYmFzZS5jaGlsZFwiLGEpO3JldHVybiBuZXcgVSh0aGlzLmssdGhpcy5wYXRoLncoYSkpfTtVLnByb3RvdHlwZS5jaGlsZD1VLnByb3RvdHlwZS53O1xuVS5wcm90b3R5cGUucGFyZW50PWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLnBhcmVudFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTt2YXIgYT10aGlzLnBhdGgucGFyZW50KCk7cmV0dXJuIG51bGw9PT1hP251bGw6bmV3IFUodGhpcy5rLGEpfTtVLnByb3RvdHlwZS5wYXJlbnQ9VS5wcm90b3R5cGUucGFyZW50O1UucHJvdG90eXBlLnJvb3Q9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UucmVmXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2Zvcih2YXIgYT10aGlzO251bGwhPT1hLnBhcmVudCgpOylhPWEucGFyZW50KCk7cmV0dXJuIGF9O1UucHJvdG90eXBlLnJvb3Q9VS5wcm90b3R5cGUucm9vdDtcblUucHJvdG90eXBlLnNldD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5zZXRcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5zZXRcIix0aGlzLnBhdGgpO1JmKFwiRmlyZWJhc2Uuc2V0XCIsYSx0aGlzLnBhdGgsITEpO0EoXCJGaXJlYmFzZS5zZXRcIiwyLGIsITApO3RoaXMuay5LYih0aGlzLnBhdGgsYSxudWxsLGJ8fG51bGwpfTtVLnByb3RvdHlwZS5zZXQ9VS5wcm90b3R5cGUuc2V0O1xuVS5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnVwZGF0ZVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnVwZGF0ZVwiLHRoaXMucGF0aCk7aWYoZWEoYSkpe2Zvcih2YXIgYz17fSxkPTA7ZDxhLmxlbmd0aDsrK2QpY1tcIlwiK2RdPWFbZF07YT1jO1EoXCJQYXNzaW5nIGFuIEFycmF5IHRvIEZpcmViYXNlLnVwZGF0ZSgpIGlzIGRlcHJlY2F0ZWQuIFVzZSBzZXQoKSBpZiB5b3Ugd2FudCB0byBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGRhdGEsIG9yIGFuIE9iamVjdCB3aXRoIGludGVnZXIga2V5cyBpZiB5b3UgcmVhbGx5IGRvIHdhbnQgdG8gb25seSB1cGRhdGUgc29tZSBvZiB0aGUgY2hpbGRyZW4uXCIpfVRmKFwiRmlyZWJhc2UudXBkYXRlXCIsYSx0aGlzLnBhdGgpO0EoXCJGaXJlYmFzZS51cGRhdGVcIiwyLGIsITApO3RoaXMuay51cGRhdGUodGhpcy5wYXRoLGEsYnx8bnVsbCl9O1UucHJvdG90eXBlLnVwZGF0ZT1VLnByb3RvdHlwZS51cGRhdGU7XG5VLnByb3RvdHlwZS5LYj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLHRoaXMucGF0aCk7UmYoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIixhLHRoaXMucGF0aCwhMSk7VWYoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIiwyLGIpO0EoXCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHlcIiwzLGMsITApO2lmKFwiLmxlbmd0aFwiPT09dGhpcy5rZXkoKXx8XCIua2V5c1wiPT09dGhpcy5rZXkoKSl0aHJvd1wiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5IGZhaWxlZDogXCIrdGhpcy5rZXkoKStcIiBpcyBhIHJlYWQtb25seSBvYmplY3QuXCI7dGhpcy5rLktiKHRoaXMucGF0aCxhLGIsY3x8bnVsbCl9O1UucHJvdG90eXBlLnNldFdpdGhQcmlvcml0eT1VLnByb3RvdHlwZS5LYjtcblUucHJvdG90eXBlLnJlbW92ZT1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UucmVtb3ZlXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2UucmVtb3ZlXCIsdGhpcy5wYXRoKTtBKFwiRmlyZWJhc2UucmVtb3ZlXCIsMSxhLCEwKTt0aGlzLnNldChudWxsLGEpfTtVLnByb3RvdHlwZS5yZW1vdmU9VS5wcm90b3R5cGUucmVtb3ZlO1xuVS5wcm90b3R5cGUudHJhbnNhY3Rpb249ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDEsMyxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnRyYW5zYWN0aW9uXCIsdGhpcy5wYXRoKTtBKFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIiwxLGEsITEpO0EoXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDIsYiwhMCk7aWYobihjKSYmXCJib29sZWFuXCIhPXR5cGVvZiBjKXRocm93IEVycm9yKHooXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDMsITApK1wibXVzdCBiZSBhIGJvb2xlYW4uXCIpO2lmKFwiLmxlbmd0aFwiPT09dGhpcy5rZXkoKXx8XCIua2V5c1wiPT09dGhpcy5rZXkoKSl0aHJvd1wiRmlyZWJhc2UudHJhbnNhY3Rpb24gZmFpbGVkOiBcIit0aGlzLmtleSgpK1wiIGlzIGEgcmVhZC1vbmx5IG9iamVjdC5cIjtcInVuZGVmaW5lZFwiPT09dHlwZW9mIGMmJihjPSEwKTtXaCh0aGlzLmssdGhpcy5wYXRoLGEsYnx8bnVsbCxjKX07VS5wcm90b3R5cGUudHJhbnNhY3Rpb249VS5wcm90b3R5cGUudHJhbnNhY3Rpb247XG5VLnByb3RvdHlwZS5MZz1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnNldFByaW9yaXR5XCIsdGhpcy5wYXRoKTtVZihcIkZpcmViYXNlLnNldFByaW9yaXR5XCIsMSxhKTtBKFwiRmlyZWJhc2Uuc2V0UHJpb3JpdHlcIiwyLGIsITApO3RoaXMuay5LYih0aGlzLnBhdGgudyhcIi5wcmlvcml0eVwiKSxhLG51bGwsYil9O1UucHJvdG90eXBlLnNldFByaW9yaXR5PVUucHJvdG90eXBlLkxnO1xuVS5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5wdXNoXCIsMCwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2UucHVzaFwiLHRoaXMucGF0aCk7UmYoXCJGaXJlYmFzZS5wdXNoXCIsYSx0aGlzLnBhdGgsITApO0EoXCJGaXJlYmFzZS5wdXNoXCIsMixiLCEwKTt2YXIgYz1NaCh0aGlzLmspLGM9S2YoYyksYz10aGlzLncoYyk7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBhJiZudWxsIT09YSYmYy5zZXQoYSxiKTtyZXR1cm4gY307VS5wcm90b3R5cGUucHVzaD1VLnByb3RvdHlwZS5wdXNoO1UucHJvdG90eXBlLmpiPWZ1bmN0aW9uKCl7WWYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3RcIix0aGlzLnBhdGgpO3JldHVybiBuZXcgWCh0aGlzLmssdGhpcy5wYXRoKX07VS5wcm90b3R5cGUub25EaXNjb25uZWN0PVUucHJvdG90eXBlLmpiO1xuVS5wcm90b3R5cGUuUD1mdW5jdGlvbihhLGIsYyl7UShcIkZpcmViYXNlUmVmLmF1dGgoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlUmVmLmF1dGhXaXRoQ3VzdG9tVG9rZW4oKSBpbnN0ZWFkLlwiKTt4KFwiRmlyZWJhc2UuYXV0aFwiLDEsMyxhcmd1bWVudHMubGVuZ3RoKTtaZihcIkZpcmViYXNlLmF1dGhcIixhKTtBKFwiRmlyZWJhc2UuYXV0aFwiLDIsYiwhMCk7QShcIkZpcmViYXNlLmF1dGhcIiwzLGIsITApO0tnKHRoaXMuay5QLGEse30se3JlbWVtYmVyOlwibm9uZVwifSxiLGMpfTtVLnByb3RvdHlwZS5hdXRoPVUucHJvdG90eXBlLlA7VS5wcm90b3R5cGUuZWU9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLnVuYXV0aFwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2UudW5hdXRoXCIsMSxhLCEwKTtMZyh0aGlzLmsuUCxhKX07VS5wcm90b3R5cGUudW5hdXRoPVUucHJvdG90eXBlLmVlO1xuVS5wcm90b3R5cGUud2U9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuZ2V0QXV0aFwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5rLlAud2UoKX07VS5wcm90b3R5cGUuZ2V0QXV0aD1VLnByb3RvdHlwZS53ZTtVLnByb3RvdHlwZS51Zz1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vbkF1dGhcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLm9uQXV0aFwiLDEsYSwhMSk7bGIoXCJGaXJlYmFzZS5vbkF1dGhcIiwyLGIpO3RoaXMuay5QLkViKFwiYXV0aF9zdGF0dXNcIixhLGIpfTtVLnByb3RvdHlwZS5vbkF1dGg9VS5wcm90b3R5cGUudWc7VS5wcm90b3R5cGUudGc9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub2ZmQXV0aFwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2Uub2ZmQXV0aFwiLDEsYSwhMSk7bGIoXCJGaXJlYmFzZS5vZmZBdXRoXCIsMixiKTt0aGlzLmsuUC5nYyhcImF1dGhfc3RhdHVzXCIsYSxiKX07VS5wcm90b3R5cGUub2ZmQXV0aD1VLnByb3RvdHlwZS50ZztcblUucHJvdG90eXBlLldmPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTtaZihcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIixhKTtBKFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aEN1c3RvbVRva2VuXCIsMyxjLCEwKTtLZyh0aGlzLmsuUCxhLHt9LGN8fHt9LGIpfTtVLnByb3RvdHlwZS5hdXRoV2l0aEN1c3RvbVRva2VuPVUucHJvdG90eXBlLldmO1UucHJvdG90eXBlLlhmPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpOyRmKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMSxhKTtBKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMixiLCExKTthZyhcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhQb3B1cFwiLDMsYywhMCk7UGcodGhpcy5rLlAsYSxjLGIpfTtcblUucHJvdG90eXBlLmF1dGhXaXRoT0F1dGhQb3B1cD1VLnByb3RvdHlwZS5YZjtVLnByb3RvdHlwZS5ZZj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDIsMyxhcmd1bWVudHMubGVuZ3RoKTskZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDEsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDIsYiwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3RcIiwzLGMsITApO3ZhciBkPXRoaXMuay5QO05nKGQpO3ZhciBlPVt3Z10sZj1pZyhjKTtcImFub255bW91c1wiPT09YXx8XCJmaXJlYmFzZVwiPT09YT9SKGIseWcoXCJUUkFOU1BPUlRfVU5BVkFJTEFCTEVcIikpOihQLnNldChcInJlZGlyZWN0X2NsaWVudF9vcHRpb25zXCIsZi5sZCksT2coZCxlLFwiL2F1dGgvXCIrYSxmLGIpKX07VS5wcm90b3R5cGUuYXV0aFdpdGhPQXV0aFJlZGlyZWN0PVUucHJvdG90eXBlLllmO1xuVS5wcm90b3R5cGUuWmY9ZnVuY3Rpb24oYSxiLGMsZCl7eChcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDMsNCxhcmd1bWVudHMubGVuZ3RoKTskZihcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDEsYSk7QShcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDMsYywhMSk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiw0LGQsITApO3AoYik/KCRmKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsMixiKSxNZyh0aGlzLmsuUCxhK1wiL3Rva2VuXCIse2FjY2Vzc190b2tlbjpifSxkLGMpKTooYWcoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwyLGIsITEpLE1nKHRoaXMuay5QLGErXCIvdG9rZW5cIixiLGQsYykpfTtVLnByb3RvdHlwZS5hdXRoV2l0aE9BdXRoVG9rZW49VS5wcm90b3R5cGUuWmY7XG5VLnByb3RvdHlwZS5WZj1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDEsYSwhMSk7YWcoXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwyLGIsITApO01nKHRoaXMuay5QLFwiYW5vbnltb3VzXCIse30sYixhKX07VS5wcm90b3R5cGUuYXV0aEFub255bW91c2x5PVUucHJvdG90eXBlLlZmO1xuVS5wcm90b3R5cGUuJGY9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5hdXRoV2l0aFBhc3N3b3JkXCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5hdXRoV2l0aFBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO2JnKFwiRmlyZWJhc2UuYXV0aFdpdGhQYXNzd29yZFwiLGEsXCJwYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMixiLCExKTthZyhcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDMsYywhMCk7TWcodGhpcy5rLlAsXCJwYXNzd29yZFwiLGEsYyxiKX07VS5wcm90b3R5cGUuYXV0aFdpdGhQYXNzd29yZD1VLnByb3RvdHlwZS4kZjtcblUucHJvdG90eXBlLnJlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmNyZWF0ZVVzZXJcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLmNyZWF0ZVVzZXJcIixhLFwiZW1haWxcIik7YmcoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5jcmVhdGVVc2VyXCIsMixiLCExKTt0aGlzLmsuUC5yZShhLGIpfTtVLnByb3RvdHlwZS5jcmVhdGVVc2VyPVUucHJvdG90eXBlLnJlO1UucHJvdG90eXBlLlNlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnJlbW92ZVVzZXJcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLnJlbW92ZVVzZXJcIixhLFwiZW1haWxcIik7YmcoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5yZW1vdmVVc2VyXCIsMixiLCExKTt0aGlzLmsuUC5TZShhLGIpfTtcblUucHJvdG90eXBlLnJlbW92ZVVzZXI9VS5wcm90b3R5cGUuU2U7VS5wcm90b3R5cGUub2U9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLGEsXCJlbWFpbFwiKTtiZyhcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsYSxcIm9sZFBhc3N3b3JkXCIpO2JnKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIixhLFwibmV3UGFzc3dvcmRcIik7QShcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsMixiLCExKTt0aGlzLmsuUC5vZShhLGIpfTtVLnByb3RvdHlwZS5jaGFuZ2VQYXNzd29yZD1VLnByb3RvdHlwZS5vZTtcblUucHJvdG90eXBlLm5lPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIixhLFwib2xkRW1haWxcIik7YmcoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLGEsXCJuZXdFbWFpbFwiKTtiZyhcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLDIsYiwhMSk7dGhpcy5rLlAubmUoYSxiKX07VS5wcm90b3R5cGUuY2hhbmdlRW1haWw9VS5wcm90b3R5cGUubmU7XG5VLnByb3RvdHlwZS5VZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsMiwyLGFyZ3VtZW50cy5sZW5ndGgpO2FnKFwiRmlyZWJhc2UucmVzZXRQYXNzd29yZFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO0EoXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsMixiLCExKTt0aGlzLmsuUC5VZShhLGIpfTtVLnByb3RvdHlwZS5yZXNldFBhc3N3b3JkPVUucHJvdG90eXBlLlVlO1UuZ29PZmZsaW5lPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLmdvT2ZmbGluZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtXLnViKCkueWIoKX07VS5nb09ubGluZT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5nb09ubGluZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtXLnViKCkucWMoKX07XG5mdW5jdGlvbiBOYyhhLGIpe0ooIWJ8fCEwPT09YXx8ITE9PT1hLFwiQ2FuJ3QgdHVybiBvbiBjdXN0b20gbG9nZ2VycyBwZXJzaXN0ZW50bHkuXCIpOyEwPT09YT8oXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlJiYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGNvbnNvbGUubG9nP0FiPXEoY29uc29sZS5sb2csY29uc29sZSk6XCJvYmplY3RcIj09PXR5cGVvZiBjb25zb2xlLmxvZyYmKEFiPWZ1bmN0aW9uKGEpe2NvbnNvbGUubG9nKGEpfSkpLGImJlAuc2V0KFwibG9nZ2luZ19lbmFibGVkXCIsITApKTphP0FiPWE6KEFiPW51bGwsUC5yZW1vdmUoXCJsb2dnaW5nX2VuYWJsZWRcIikpfVUuZW5hYmxlTG9nZ2luZz1OYztVLlNlcnZlclZhbHVlPXtUSU1FU1RBTVA6e1wiLnN2XCI6XCJ0aW1lc3RhbXBcIn19O1UuU0RLX1ZFUlNJT049XCIyLjIuNFwiO1UuSU5URVJOQUw9VjtVLkNvbnRleHQ9VztVLlRFU1RfQUNDRVNTPVo7fSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaXJlYmFzZTtcbiIsIihmdW5jdGlvbiAocm9vdCwgcGx1cmFsaXplKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gcGx1cmFsaXplKCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELCByZWdpc3RlcnMgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHBsdXJhbGl6ZSgpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsLlxuICAgIHJvb3QucGx1cmFsaXplID0gcGx1cmFsaXplKCk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgLy8gUnVsZSBzdG9yYWdlIC0gcGx1cmFsaXplIGFuZCBzaW5ndWxhcml6ZSBuZWVkIHRvIGJlIHJ1biBzZXF1ZW50aWFsbHksXG4gIC8vIHdoaWxlIG90aGVyIHJ1bGVzIGNhbiBiZSBvcHRpbWl6ZWQgdXNpbmcgYW4gb2JqZWN0IGZvciBpbnN0YW50IGxvb2t1cHMuXG4gIHZhciBwbHVyYWxSdWxlcyAgICAgID0gW107XG4gIHZhciBzaW5ndWxhclJ1bGVzICAgID0gW107XG4gIHZhciB1bmNvdW50YWJsZXMgICAgID0ge307XG4gIHZhciBpcnJlZ3VsYXJQbHVyYWxzID0ge307XG4gIHZhciBpcnJlZ3VsYXJTaW5nbGVzID0ge307XG5cbiAgLyoqXG4gICAqIFRpdGxlIGNhc2UgYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHRvVGl0bGVDYXNlIChzdHIpIHtcbiAgICByZXR1cm4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnN1YnN0cigxKS50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhbml0aXplIGEgcGx1cmFsaXphdGlvbiBydWxlIHRvIGEgdXNhYmxlIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtICB7KFJlZ0V4cHxzdHJpbmcpfSBydWxlXG4gICAqIEByZXR1cm4ge1JlZ0V4cH1cbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplUnVsZSAocnVsZSkge1xuICAgIGlmICh0eXBlb2YgcnVsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJyArIHJ1bGUgKyAnJCcsICdpJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogUGFzcyBpbiBhIHdvcmQgdG9rZW4gdG8gcHJvZHVjZSBhIGZ1bmN0aW9uIHRoYXQgY2FuIHJlcGxpY2F0ZSB0aGUgY2FzZSBvblxuICAgKiBhbm90aGVyIHdvcmQuXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB0b2tlblxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIHJlc3RvcmVDYXNlICh3b3JkLCB0b2tlbikge1xuICAgIC8vIFVwcGVyIGNhc2VkIHdvcmRzLiBFLmcuIFwiSEVMTE9cIi5cbiAgICBpZiAod29yZCA9PT0gd29yZC50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICByZXR1cm4gdG9rZW4udG9VcHBlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvLyBUaXRsZSBjYXNlZCB3b3Jkcy4gRS5nLiBcIlRpdGxlXCIuXG4gICAgaWYgKHdvcmRbMF0gPT09IHdvcmRbMF0udG9VcHBlckNhc2UoKSkge1xuICAgICAgcmV0dXJuIHRvVGl0bGVDYXNlKHRva2VuKTtcbiAgICB9XG5cbiAgICAvLyBMb3dlciBjYXNlZCB3b3Jkcy4gRS5nLiBcInRlc3RcIi5cbiAgICByZXR1cm4gdG9rZW4udG9Mb3dlckNhc2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcnBvbGF0ZSBhIHJlZ2V4cCBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gc3RyICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gYXJncyBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZSAoc3RyLCBhcmdzKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXCQoXFxkezEsMn0pL2csIGZ1bmN0aW9uIChtYXRjaCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBhcmdzW2luZGV4XSB8fCAnJztcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYW5pdGl6ZSBhIHdvcmQgYnkgcGFzc2luZyBpbiB0aGUgd29yZCBhbmQgc2FuaXRpemF0aW9uIHJ1bGVzLlxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgd29yZFxuICAgKiBAcGFyYW0gIHtBcnJheX0gICAgY29sbGVjdGlvblxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBzYW5pdGl6ZVdvcmQgKHdvcmQsIGNvbGxlY3Rpb24pIHtcbiAgICAvLyBFbXB0eSBzdHJpbmcgb3IgZG9lc24ndCBuZWVkIGZpeGluZy5cbiAgICBpZiAoIXdvcmQubGVuZ3RoIHx8IHVuY291bnRhYmxlcy5oYXNPd25Qcm9wZXJ0eSh3b3JkKSkge1xuICAgICAgcmV0dXJuIHdvcmQ7XG4gICAgfVxuXG4gICAgdmFyIGxlbiA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBzYW5pdGl6YXRpb24gcnVsZXMgYW5kIHVzZSB0aGUgZmlyc3Qgb25lIHRvIG1hdGNoLlxuICAgIHdoaWxlIChsZW4tLSkge1xuICAgICAgdmFyIHJ1bGUgPSBjb2xsZWN0aW9uW2xlbl07XG5cbiAgICAgIC8vIElmIHRoZSBydWxlIHBhc3NlcywgcmV0dXJuIHRoZSByZXBsYWNlbWVudC5cbiAgICAgIGlmIChydWxlWzBdLnRlc3Qod29yZCkpIHtcbiAgICAgICAgcmV0dXJuIHdvcmQucmVwbGFjZShydWxlWzBdLCBmdW5jdGlvbiAobWF0Y2gsIGluZGV4LCB3b3JkKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IGludGVycG9sYXRlKHJ1bGVbMV0sIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICBpZiAobWF0Y2ggPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdG9yZUNhc2Uod29yZFtpbmRleCAtIDFdLCByZXN1bHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiByZXN0b3JlQ2FzZShtYXRjaCwgcmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHdvcmQ7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhIHdvcmQgd2l0aCB0aGUgdXBkYXRlZCB3b3JkLlxuICAgKlxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgcmVwbGFjZU1hcFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAga2VlcE1hcFxuICAgKiBAcGFyYW0gIHtBcnJheX0gICAgcnVsZXNcbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuICBmdW5jdGlvbiByZXBsYWNlV29yZCAocmVwbGFjZU1hcCwga2VlcE1hcCwgcnVsZXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHdvcmQpIHtcbiAgICAgIC8vIEdldCB0aGUgY29ycmVjdCB0b2tlbiBhbmQgY2FzZSByZXN0b3JhdGlvbiBmdW5jdGlvbnMuXG4gICAgICB2YXIgdG9rZW4gPSB3b3JkLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgIC8vIENoZWNrIGFnYWluc3QgdGhlIGtlZXAgb2JqZWN0IG1hcC5cbiAgICAgIGlmIChrZWVwTWFwLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgICByZXR1cm4gcmVzdG9yZUNhc2Uod29yZCwgdG9rZW4pO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBhZ2FpbnN0IHRoZSByZXBsYWNlbWVudCBtYXAgZm9yIGEgZGlyZWN0IHdvcmQgcmVwbGFjZW1lbnQuXG4gICAgICBpZiAocmVwbGFjZU1hcC5oYXNPd25Qcm9wZXJ0eSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuIHJlc3RvcmVDYXNlKHdvcmQsIHJlcGxhY2VNYXBbdG9rZW5dKTtcbiAgICAgIH1cblxuICAgICAgLy8gUnVuIGFsbCB0aGUgcnVsZXMgYWdhaW5zdCB0aGUgd29yZC5cbiAgICAgIHJldHVybiBzYW5pdGl6ZVdvcmQod29yZCwgcnVsZXMpO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUGx1cmFsaXplIG9yIHNpbmd1bGFyaXplIGEgd29yZCBiYXNlZCBvbiB0aGUgcGFzc2VkIGluIGNvdW50LlxuICAgKlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICB3b3JkXG4gICAqIEBwYXJhbSAge051bWJlcn0gIGNvdW50XG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IGluY2x1c2l2ZVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBwbHVyYWxpemUgKHdvcmQsIGNvdW50LCBpbmNsdXNpdmUpIHtcbiAgICB2YXIgcGx1cmFsaXplZCA9IGNvdW50ID09PSAxID9cbiAgICAgIHBsdXJhbGl6ZS5zaW5ndWxhcih3b3JkKSA6IHBsdXJhbGl6ZS5wbHVyYWwod29yZCk7XG5cbiAgICByZXR1cm4gKGluY2x1c2l2ZSA/IGNvdW50ICsgJyAnIDogJycpICsgcGx1cmFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgYSB3b3JkLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwbHVyYWxpemUucGx1cmFsID0gcmVwbGFjZVdvcmQoXG4gICAgaXJyZWd1bGFyU2luZ2xlcywgaXJyZWd1bGFyUGx1cmFscywgcGx1cmFsUnVsZXNcbiAgKTtcblxuICAvKipcbiAgICogU2luZ3VsYXJpemUgYSB3b3JkLlxuICAgKlxuICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAqL1xuICBwbHVyYWxpemUuc2luZ3VsYXIgPSByZXBsYWNlV29yZChcbiAgICBpcnJlZ3VsYXJQbHVyYWxzLCBpcnJlZ3VsYXJTaW5nbGVzLCBzaW5ndWxhclJ1bGVzXG4gICk7XG5cbiAgLyoqXG4gICAqIEFkZCBhIHBsdXJhbGl6YXRpb24gcnVsZSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHJ1bGVcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgIHJlcGxhY2VtZW50XG4gICAqL1xuICBwbHVyYWxpemUuYWRkUGx1cmFsUnVsZSA9IGZ1bmN0aW9uIChydWxlLCByZXBsYWNlbWVudCkge1xuICAgIHBsdXJhbFJ1bGVzLnB1c2goW3Nhbml0aXplUnVsZShydWxlKSwgcmVwbGFjZW1lbnRdKTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGEgc2luZ3VsYXJpemF0aW9uIHJ1bGUgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApfSBydWxlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICByZXBsYWNlbWVudFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZFNpbmd1bGFyUnVsZSA9IGZ1bmN0aW9uIChydWxlLCByZXBsYWNlbWVudCkge1xuICAgIHNpbmd1bGFyUnVsZXMucHVzaChbc2FuaXRpemVSdWxlKHJ1bGUpLCByZXBsYWNlbWVudF0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gdW5jb3VudGFibGUgd29yZCBydWxlLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKX0gd29yZFxuICAgKi9cbiAgcGx1cmFsaXplLmFkZFVuY291bnRhYmxlUnVsZSA9IGZ1bmN0aW9uICh3b3JkKSB7XG4gICAgaWYgKHR5cGVvZiB3b3JkID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHVuY291bnRhYmxlc1t3b3JkLnRvTG93ZXJDYXNlKCldID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBTZXQgc2luZ3VsYXIgYW5kIHBsdXJhbCByZWZlcmVuY2VzIGZvciB0aGUgd29yZC5cbiAgICBwbHVyYWxpemUuYWRkUGx1cmFsUnVsZSh3b3JkLCAnJDAnKTtcbiAgICBwbHVyYWxpemUuYWRkU2luZ3VsYXJSdWxlKHdvcmQsICckMCcpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYW4gaXJyZWd1bGFyIHdvcmQgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNpbmdsZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGx1cmFsXG4gICAqL1xuICBwbHVyYWxpemUuYWRkSXJyZWd1bGFyUnVsZSA9IGZ1bmN0aW9uIChzaW5nbGUsIHBsdXJhbCkge1xuICAgIHBsdXJhbCA9IHBsdXJhbC50b0xvd2VyQ2FzZSgpO1xuICAgIHNpbmdsZSA9IHNpbmdsZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaXJyZWd1bGFyU2luZ2xlc1tzaW5nbGVdID0gcGx1cmFsO1xuICAgIGlycmVndWxhclBsdXJhbHNbcGx1cmFsXSA9IHNpbmdsZTtcbiAgfTtcblxuICAvKipcbiAgICogSXJyZWd1bGFyIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIC8vIFByb25vdW5zLlxuICAgIFsnSScsICAgICAgICAnd2UnXSxcbiAgICBbJ21lJywgICAgICAgJ3VzJ10sXG4gICAgWydoZScsICAgICAgICd0aGV5J10sXG4gICAgWydzaGUnLCAgICAgICd0aGV5J10sXG4gICAgWyd0aGVtJywgICAgICd0aGVtJ10sXG4gICAgWydteXNlbGYnLCAgICdvdXJzZWx2ZXMnXSxcbiAgICBbJ3lvdXJzZWxmJywgJ3lvdXJzZWx2ZXMnXSxcbiAgICBbJ2l0c2VsZicsICAgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ2hlcnNlbGYnLCAgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ2hpbXNlbGYnLCAgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ3RoZW1zZWxmJywgJ3RoZW1zZWx2ZXMnXSxcbiAgICBbJ3RoaXMnLCAgICAgJ3RoZXNlJ10sXG4gICAgWyd0aGF0JywgICAgICd0aG9zZSddLFxuICAgIC8vIFdvcmRzIGVuZGluZyBpbiB3aXRoIGEgY29uc29uYW50IGFuZCBgb2AuXG4gICAgWydlY2hvJywgJ2VjaG9lcyddLFxuICAgIFsnZGluZ28nLCAnZGluZ29lcyddLFxuICAgIFsndm9sY2FubycsICd2b2xjYW5vZXMnXSxcbiAgICBbJ3Rvcm5hZG8nLCAndG9ybmFkb2VzJ10sXG4gICAgWyd0b3JwZWRvJywgJ3RvcnBlZG9lcyddLFxuICAgIC8vIEVuZHMgd2l0aCBgdXNgLlxuICAgIFsnZ2VudXMnLCAgJ2dlbmVyYSddLFxuICAgIFsndmlzY3VzJywgJ3Zpc2NlcmEnXSxcbiAgICAvLyBFbmRzIHdpdGggYG1hYC5cbiAgICBbJ3N0aWdtYScsICAgJ3N0aWdtYXRhJ10sXG4gICAgWydzdG9tYScsICAgICdzdG9tYXRhJ10sXG4gICAgWydkb2dtYScsICAgICdkb2dtYXRhJ10sXG4gICAgWydsZW1tYScsICAgICdsZW1tYXRhJ10sXG4gICAgWydzY2hlbWEnLCAgICdzY2hlbWF0YSddLFxuICAgIFsnYW5hdGhlbWEnLCAnYW5hdGhlbWF0YSddLFxuICAgIC8vIE90aGVyIGlycmVndWxhciBydWxlcy5cbiAgICBbJ294JywgICAgICAnb3hlbiddLFxuICAgIFsnYXhlJywgICAgICdheGVzJ10sXG4gICAgWydkaWUnLCAgICAgJ2RpY2UnXSxcbiAgICBbJ3llcycsICAgICAneWVzZXMnXSxcbiAgICBbJ2Zvb3QnLCAgICAnZmVldCddLFxuICAgIFsnZWF2ZScsICAgICdlYXZlcyddLFxuICAgIFsnZ29vc2UnLCAgICdnZWVzZSddLFxuICAgIFsndG9vdGgnLCAgICd0ZWV0aCddLFxuICAgIFsncXVpeicsICAgICdxdWl6emVzJ10sXG4gICAgWydodW1hbicsICAgJ2h1bWFucyddLFxuICAgIFsncHJvb2YnLCAgICdwcm9vZnMnXSxcbiAgICBbJ2NhcnZlJywgICAnY2FydmVzJ10sXG4gICAgWyd2YWx2ZScsICAgJ3ZhbHZlcyddLFxuICAgIFsndGhpZWYnLCAgICd0aGlldmVzJ10sXG4gICAgWydnZW5pZScsICAgJ2dlbmllcyddLFxuICAgIFsnZ3Jvb3ZlJywgICdncm9vdmVzJ10sXG4gICAgWydwaWNrYXhlJywgJ3BpY2theGVzJ10sXG4gICAgWyd3aGlza2V5JywgJ3doaXNraWVzJ11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRJcnJlZ3VsYXJSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogUGx1cmFsaXphdGlvbiBydWxlcy5cbiAgICovXG4gIFtcbiAgICBbL3M/JC9pLCAncyddLFxuICAgIFsvKFteYWVpb3VdZXNlKSQvaSwgJyQxJ10sXG4gICAgWy8oYXh8dGVzdClpcyQvaSwgJyQxZXMnXSxcbiAgICBbLyhhbGlhc3xbXmFvdV11c3x0bGFzfGdhc3xyaXMpJC9pLCAnJDFlcyddLFxuICAgIFsvKGVbbW5ddSlzPyQvaSwgJyQxcyddLFxuICAgIFsvKFtebF1pYXN8W2FlaW91XWxhc3xbZW1qenJdYXN8W2l1XWFtKSQvaSwgJyQxJ10sXG4gICAgWy8oYWx1bW58c3lsbGFifG9jdG9wfHZpcnxyYWRpfG51Y2xlfGZ1bmd8Y2FjdHxzdGltdWx8dGVybWlufGJhY2lsbHxmb2N8dXRlcnxsb2N8c3RyYXQpKD86dXN8aSkkL2ksICckMWknXSxcbiAgICBbLyhhbHVtbnxhbGd8dmVydGVicikoPzphfGFlKSQvaSwgJyQxYWUnXSxcbiAgICBbLyhzZXJhcGh8Y2hlcnViKSg/OmltKT8kL2ksICckMWltJ10sXG4gICAgWy8oaGVyfGF0fGdyKW8kL2ksICckMW9lcyddLFxuICAgIFsvKGFnZW5kfGFkZGVuZHxtaWxsZW5uaXxkYXR8ZXh0cmVtfGJhY3Rlcml8ZGVzaWRlcmF0fHN0cmF0fGNhbmRlbGFicnxlcnJhdHxvdnxzeW1wb3NpfGN1cnJpY3VsfGF1dG9tYXR8cXVvcikoPzphfHVtKSQvaSwgJyQxYSddLFxuICAgIFsvKGFwaGVsaXxoeXBlcmJhdHxwZXJpaGVsaXxhc3luZGV0fG5vdW1lbnxwaGVub21lbnxjcml0ZXJpfG9yZ2FufHByb2xlZ29tZW58XFx3K2hlZHIpKD86YXxvbikkL2ksICckMWEnXSxcbiAgICBbL3NpcyQvaSwgJ3NlcyddLFxuICAgIFsvKD86KGkpZmV8KGFyfGx8ZWF8ZW98b2F8aG9vKWYpJC9pLCAnJDEkMnZlcyddLFxuICAgIFsvKFteYWVpb3V5XXxxdSl5JC9pLCAnJDFpZXMnXSxcbiAgICBbLyhbXmNoXVtpZW9dW2xuXSlleSQvaSwgJyQxaWVzJ10sXG4gICAgWy8oeHxjaHxzc3xzaHx6eikkL2ksICckMWVzJ10sXG4gICAgWy8obWF0cnxjb2R8bXVyfHNpbHx2ZXJ0fGluZHxhcHBlbmQpKD86aXh8ZXgpJC9pLCAnJDFpY2VzJ10sXG4gICAgWy8obXxsKSg/OmljZXxvdXNlKSQvaSwgJyQxaWNlJ10sXG4gICAgWy8ocGUpKD86cnNvbnxvcGxlKSQvaSwgJyQxb3BsZSddLFxuICAgIFsvKGNoaWxkKSg/OnJlbik/JC9pLCAnJDFyZW4nXSxcbiAgICBbL2VhdXgkL2ksICckMCddLFxuICAgIFsvbVthZV1uJC9pLCAnbWVuJ11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRQbHVyYWxSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogU2luZ3VsYXJpemF0aW9uIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIFsvcyQvaSwgJyddLFxuICAgIFsvKHNzKSQvaSwgJyQxJ10sXG4gICAgWy8oKGEpbmFseXwoYilhfChkKWlhZ25vfChwKWFyZW50aGV8KHApcm9nbm98KHMpeW5vcHwodCloZSkoPzpzaXN8c2VzKSQvaSwgJyQxc2lzJ10sXG4gICAgWy8oXmFuYWx5KSg/OnNpc3xzZXMpJC9pLCAnJDFzaXMnXSxcbiAgICBbLyhbXmFlZmxvcl0pdmVzJC9pLCAnJDFmZSddLFxuICAgIFsvKGhpdmV8dGl2ZXxkcj9pdmUpcyQvaSwgJyQxJ10sXG4gICAgWy8oYXJ8KD86d298W2FlXSlsfFtlb11bYW9dKXZlcyQvaSwgJyQxZiddLFxuICAgIFsvKFteYWVpb3V5XXxxdSlpZXMkL2ksICckMXknXSxcbiAgICBbLyheW3BsXXx6b21ifF4oPzpuZWNrKT90fFthZW9dW2x0XXxjdXQpaWVzJC9pLCAnJDFpZSddLFxuICAgIFsvKFteY11bZW9yXW58c21pbClpZXMkL2ksICckMWV5J10sXG4gICAgWy8obXxsKWljZSQvaSwgJyQxb3VzZSddLFxuICAgIFsvKHNlcmFwaHxjaGVydWIpaW0kL2ksICckMSddLFxuICAgIFsvKHh8Y2h8c3N8c2h8enp8dHRvfGdvfGNob3xhbGlhc3xbXmFvdV11c3x0bGFzfGdhc3woPzpoZXJ8YXR8Z3Ipb3xyaXMpKD86ZXMpPyQvaSwgJyQxJ10sXG4gICAgWy8oZVttbl11KXM/JC9pLCAnJDEnXSxcbiAgICBbLyhtb3ZpZXx0d2VsdmUpcyQvaSwgJyQxJ10sXG4gICAgWy8oY3Jpc3x0ZXN0fGRpYWdub3MpKD86aXN8ZXMpJC9pLCAnJDFpcyddLFxuICAgIFsvKGFsdW1ufHN5bGxhYnxvY3RvcHx2aXJ8cmFkaXxudWNsZXxmdW5nfGNhY3R8c3RpbXVsfHRlcm1pbnxiYWNpbGx8Zm9jfHV0ZXJ8bG9jfHN0cmF0KSg/OnVzfGkpJC9pLCAnJDF1cyddLFxuICAgIFsvKGFnZW5kfGFkZGVuZHxtaWxsZW5uaXxkYXR8ZXh0cmVtfGJhY3Rlcml8ZGVzaWRlcmF0fHN0cmF0fGNhbmRlbGFicnxlcnJhdHxvdnxzeW1wb3NpfGN1cnJpY3VsfGF1dG9tYXR8cXVvcilhJC9pLCAnJDF1bSddLFxuICAgIFsvKGFwaGVsaXxoeXBlcmJhdHxwZXJpaGVsaXxhc3luZGV0fG5vdW1lbnxwaGVub21lbnxjcml0ZXJpfG9yZ2FufHByb2xlZ29tZW58XFx3K2hlZHIpYSQvaSwgJyQxb24nXSxcbiAgICBbLyhhbHVtbnxhbGd8dmVydGVicilhZSQvaSwgJyQxYSddLFxuICAgIFsvKGNvZHxtdXJ8c2lsfHZlcnR8aW5kKWljZXMkL2ksICckMWV4J10sXG4gICAgWy8obWF0cnxhcHBlbmQpaWNlcyQvaSwgJyQxaXgnXSxcbiAgICBbLyhwZSkocnNvbnxvcGxlKSQvaSwgJyQxcnNvbiddLFxuICAgIFsvKGNoaWxkKXJlbiQvaSwgJyQxJ10sXG4gICAgWy8oZWF1KXg/JC9pLCAnJDEnXSxcbiAgICBbL21lbiQvaSwgJ21hbiddXG4gIF0uZm9yRWFjaChmdW5jdGlvbiAocnVsZSkge1xuICAgIHJldHVybiBwbHVyYWxpemUuYWRkU2luZ3VsYXJSdWxlKHJ1bGVbMF0sIHJ1bGVbMV0pO1xuICB9KTtcblxuICAvKipcbiAgICogVW5jb3VudGFibGUgcnVsZXMuXG4gICAqL1xuICBbXG4gICAgLy8gU2luZ3VsYXIgd29yZHMgd2l0aCBubyBwbHVyYWxzLlxuICAgICdhZHZpY2UnLFxuICAgICdhZ2VuZGEnLFxuICAgICdiaXNvbicsXG4gICAgJ2JyZWFtJyxcbiAgICAnYnVmZmFsbycsXG4gICAgJ2NhcnAnLFxuICAgICdjaGFzc2lzJyxcbiAgICAnY29kJyxcbiAgICAnY29vcGVyYXRpb24nLFxuICAgICdjb3JwcycsXG4gICAgJ2RpZ2VzdGlvbicsXG4gICAgJ2RlYnJpcycsXG4gICAgJ2RpYWJldGVzJyxcbiAgICAnZW5lcmd5JyxcbiAgICAnZXF1aXBtZW50JyxcbiAgICAnZWxrJyxcbiAgICAnZXhjcmV0aW9uJyxcbiAgICAnZXhwZXJ0aXNlJyxcbiAgICAnZmxvdW5kZXInLFxuICAgICdnYWxsb3dzJyxcbiAgICAnZ3JhZmZpdGknLFxuICAgICdoZWFkcXVhcnRlcnMnLFxuICAgICdoZWFsdGgnLFxuICAgICdoZXJwZXMnLFxuICAgICdoaWdoamlua3MnLFxuICAgICdob21ld29yaycsXG4gICAgJ2luZm9ybWF0aW9uJyxcbiAgICAnamVhbnMnLFxuICAgICdqdXN0aWNlJyxcbiAgICAna3Vkb3MnLFxuICAgICdsYWJvdXInLFxuICAgICdtYWNoaW5lcnknLFxuICAgICdtYWNrZXJlbCcsXG4gICAgJ21lZGlhJyxcbiAgICAnbWV3cycsXG4gICAgJ21vb3NlJyxcbiAgICAnbmV3cycsXG4gICAgJ3Bpa2UnLFxuICAgICdwbGFua3RvbicsXG4gICAgJ3BsaWVycycsXG4gICAgJ3BvbGx1dGlvbicsXG4gICAgJ3ByZW1pc2VzJyxcbiAgICAncmFpbicsXG4gICAgJ3JpY2UnLFxuICAgICdzYWxtb24nLFxuICAgICdzY2lzc29ycycsXG4gICAgJ3NlcmllcycsXG4gICAgJ3Nld2FnZScsXG4gICAgJ3NoYW1ibGVzJyxcbiAgICAnc2hyaW1wJyxcbiAgICAnc3BlY2llcycsXG4gICAgJ3N0YWZmJyxcbiAgICAnc3dpbmUnLFxuICAgICd0cm91dCcsXG4gICAgJ3R1bmEnLFxuICAgICd3aGl0aW5nJyxcbiAgICAnd2lsZGViZWVzdCcsXG4gICAgJ3dpbGRsaWZlJyxcbiAgICAvLyBSZWdleGVzLlxuICAgIC9wb3gkL2ksIC8vIFwiY2hpY2twb3hcIiwgXCJzbWFsbHBveFwiXG4gICAgL29pcyQvaSxcbiAgICAvZGVlciQvaSwgLy8gXCJkZWVyXCIsIFwicmVpbmRlZXJcIlxuICAgIC9maXNoJC9pLCAvLyBcImZpc2hcIiwgXCJibG93ZmlzaFwiLCBcImFuZ2VsZmlzaFwiXG4gICAgL3NoZWVwJC9pLFxuICAgIC9tZWFzbGVzJC9pLFxuICAgIC9bXmFlaW91XWVzZSQvaSAvLyBcImNoaW5lc2VcIiwgXCJqYXBhbmVzZVwiXG4gIF0uZm9yRWFjaChwbHVyYWxpemUuYWRkVW5jb3VudGFibGVSdWxlKTtcblxuICByZXR1cm4gcGx1cmFsaXplO1xufSk7XG4iLCJ2YXIgaW5zZXJ0ZWQgPSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzLCBvcHRpb25zKSB7XG4gICAgaWYgKGluc2VydGVkW2Nzc10pIHJldHVybjtcbiAgICBpbnNlcnRlZFtjc3NdID0gdHJ1ZTtcbiAgICBcbiAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcblxuICAgIGlmICgndGV4dENvbnRlbnQnIGluIGVsZW0pIHtcbiAgICAgIGVsZW0udGV4dENvbnRlbnQgPSBjc3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICAgIH1cbiAgICBcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5wcmVwZW5kKSB7XG4gICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKGVsZW0sIGhlYWQuY2hpbGROb2Rlc1swXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICB9XG59O1xuIiwiKGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciRkc2wkJFRhcmdldChwYXRoLCBtYXRjaGVyLCBkZWxlZ2F0ZSkge1xuICAgICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICAgIHRoaXMubWF0Y2hlciA9IG1hdGNoZXI7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gZGVsZWdhdGU7XG4gICAgfVxuXG4gICAgJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkVGFyZ2V0LnByb3RvdHlwZSA9IHtcbiAgICAgIHRvOiBmdW5jdGlvbih0YXJnZXQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IHRoaXMuZGVsZWdhdGU7XG5cbiAgICAgICAgaWYgKGRlbGVnYXRlICYmIGRlbGVnYXRlLndpbGxBZGRSb3V0ZSkge1xuICAgICAgICAgIHRhcmdldCA9IGRlbGVnYXRlLndpbGxBZGRSb3V0ZSh0aGlzLm1hdGNoZXIudGFyZ2V0LCB0YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYXRjaGVyLmFkZCh0aGlzLnBhdGgsIHRhcmdldCk7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrLmxlbmd0aCA9PT0gMCkgeyB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgbXVzdCBoYXZlIGFuIGFyZ3VtZW50IGluIHRoZSBmdW5jdGlvbiBwYXNzZWQgdG8gYHRvYFwiKTsgfVxuICAgICAgICAgIHRoaXMubWF0Y2hlci5hZGRDaGlsZCh0aGlzLnBhdGgsIHRhcmdldCwgY2FsbGJhY2ssIHRoaXMuZGVsZWdhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRNYXRjaGVyKHRhcmdldCkge1xuICAgICAgdGhpcy5yb3V0ZXMgPSB7fTtcbiAgICAgIHRoaXMuY2hpbGRyZW4gPSB7fTtcbiAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgIH1cblxuICAgICQkcm91dGUkcmVjb2duaXplciRkc2wkJE1hdGNoZXIucHJvdG90eXBlID0ge1xuICAgICAgYWRkOiBmdW5jdGlvbihwYXRoLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMucm91dGVzW3BhdGhdID0gaGFuZGxlcjtcbiAgICAgIH0sXG5cbiAgICAgIGFkZENoaWxkOiBmdW5jdGlvbihwYXRoLCB0YXJnZXQsIGNhbGxiYWNrLCBkZWxlZ2F0ZSkge1xuICAgICAgICB2YXIgbWF0Y2hlciA9IG5ldyAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRNYXRjaGVyKHRhcmdldCk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5bcGF0aF0gPSBtYXRjaGVyO1xuXG4gICAgICAgIHZhciBtYXRjaCA9ICQkcm91dGUkcmVjb2duaXplciRkc2wkJGdlbmVyYXRlTWF0Y2gocGF0aCwgbWF0Y2hlciwgZGVsZWdhdGUpO1xuXG4gICAgICAgIGlmIChkZWxlZ2F0ZSAmJiBkZWxlZ2F0ZS5jb250ZXh0RW50ZXJlZCkge1xuICAgICAgICAgIGRlbGVnYXRlLmNvbnRleHRFbnRlcmVkKHRhcmdldCwgbWF0Y2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sobWF0Y2gpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRnZW5lcmF0ZU1hdGNoKHN0YXJ0aW5nUGF0aCwgbWF0Y2hlciwgZGVsZWdhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihwYXRoLCBuZXN0ZWRDYWxsYmFjaykge1xuICAgICAgICB2YXIgZnVsbFBhdGggPSBzdGFydGluZ1BhdGggKyBwYXRoO1xuXG4gICAgICAgIGlmIChuZXN0ZWRDYWxsYmFjaykge1xuICAgICAgICAgIG5lc3RlZENhbGxiYWNrKCQkcm91dGUkcmVjb2duaXplciRkc2wkJGdlbmVyYXRlTWF0Y2goZnVsbFBhdGgsIG1hdGNoZXIsIGRlbGVnYXRlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRUYXJnZXQoc3RhcnRpbmdQYXRoICsgcGF0aCwgbWF0Y2hlciwgZGVsZWdhdGUpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciRkc2wkJGFkZFJvdXRlKHJvdXRlQXJyYXksIHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgIHZhciBsZW4gPSAwO1xuICAgICAgZm9yICh2YXIgaT0wLCBsPXJvdXRlQXJyYXkubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICBsZW4gKz0gcm91dGVBcnJheVtpXS5wYXRoLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKGxlbik7XG4gICAgICB2YXIgcm91dGUgPSB7IHBhdGg6IHBhdGgsIGhhbmRsZXI6IGhhbmRsZXIgfTtcbiAgICAgIHJvdXRlQXJyYXkucHVzaChyb3V0ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkZWFjaFJvdXRlKGJhc2VSb3V0ZSwgbWF0Y2hlciwgY2FsbGJhY2ssIGJpbmRpbmcpIHtcbiAgICAgIHZhciByb3V0ZXMgPSBtYXRjaGVyLnJvdXRlcztcblxuICAgICAgZm9yICh2YXIgcGF0aCBpbiByb3V0ZXMpIHtcbiAgICAgICAgaWYgKHJvdXRlcy5oYXNPd25Qcm9wZXJ0eShwYXRoKSkge1xuICAgICAgICAgIHZhciByb3V0ZUFycmF5ID0gYmFzZVJvdXRlLnNsaWNlKCk7XG4gICAgICAgICAgJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkYWRkUm91dGUocm91dGVBcnJheSwgcGF0aCwgcm91dGVzW3BhdGhdKTtcblxuICAgICAgICAgIGlmIChtYXRjaGVyLmNoaWxkcmVuW3BhdGhdKSB7XG4gICAgICAgICAgICAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRlYWNoUm91dGUocm91dGVBcnJheSwgbWF0Y2hlci5jaGlsZHJlbltwYXRoXSwgY2FsbGJhY2ssIGJpbmRpbmcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGJpbmRpbmcsIHJvdXRlQXJyYXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRkZWZhdWx0ID0gZnVuY3Rpb24oY2FsbGJhY2ssIGFkZFJvdXRlQ2FsbGJhY2spIHtcbiAgICAgIHZhciBtYXRjaGVyID0gbmV3ICQkcm91dGUkcmVjb2duaXplciRkc2wkJE1hdGNoZXIoKTtcblxuICAgICAgY2FsbGJhY2soJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkZ2VuZXJhdGVNYXRjaChcIlwiLCBtYXRjaGVyLCB0aGlzLmRlbGVnYXRlKSk7XG5cbiAgICAgICQkcm91dGUkcmVjb2duaXplciRkc2wkJGVhY2hSb3V0ZShbXSwgbWF0Y2hlciwgZnVuY3Rpb24ocm91dGUpIHtcbiAgICAgICAgaWYgKGFkZFJvdXRlQ2FsbGJhY2spIHsgYWRkUm91dGVDYWxsYmFjayh0aGlzLCByb3V0ZSk7IH1cbiAgICAgICAgZWxzZSB7IHRoaXMuYWRkKHJvdXRlKTsgfVxuICAgICAgfSwgdGhpcyk7XG4gICAgfTtcblxuICAgIHZhciAkJHJvdXRlJHJlY29nbml6ZXIkJHNwZWNpYWxzID0gW1xuICAgICAgJy8nLCAnLicsICcqJywgJysnLCAnPycsICd8JyxcbiAgICAgICcoJywgJyknLCAnWycsICddJywgJ3snLCAnfScsICdcXFxcJ1xuICAgIF07XG5cbiAgICB2YXIgJCRyb3V0ZSRyZWNvZ25pemVyJCRlc2NhcGVSZWdleCA9IG5ldyBSZWdFeHAoJyhcXFxcJyArICQkcm91dGUkcmVjb2duaXplciQkc3BlY2lhbHMuam9pbignfFxcXFwnKSArICcpJywgJ2cnKTtcblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciQkaXNBcnJheSh0ZXN0KSB7XG4gICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRlc3QpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgfVxuXG4gICAgLy8gQSBTZWdtZW50IHJlcHJlc2VudHMgYSBzZWdtZW50IGluIHRoZSBvcmlnaW5hbCByb3V0ZSBkZXNjcmlwdGlvbi5cbiAgICAvLyBFYWNoIFNlZ21lbnQgdHlwZSBwcm92aWRlcyBhbiBgZWFjaENoYXJgIGFuZCBgcmVnZXhgIG1ldGhvZC5cbiAgICAvL1xuICAgIC8vIFRoZSBgZWFjaENoYXJgIG1ldGhvZCBpbnZva2VzIHRoZSBjYWxsYmFjayB3aXRoIG9uZSBvciBtb3JlIGNoYXJhY3RlclxuICAgIC8vIHNwZWNpZmljYXRpb25zLiBBIGNoYXJhY3RlciBzcGVjaWZpY2F0aW9uIGNvbnN1bWVzIG9uZSBvciBtb3JlIGlucHV0XG4gICAgLy8gY2hhcmFjdGVycy5cbiAgICAvL1xuICAgIC8vIFRoZSBgcmVnZXhgIG1ldGhvZCByZXR1cm5zIGEgcmVnZXggZnJhZ21lbnQgZm9yIHRoZSBzZWdtZW50LiBJZiB0aGVcbiAgICAvLyBzZWdtZW50IGlzIGEgZHluYW1pYyBvZiBzdGFyIHNlZ21lbnQsIHRoZSByZWdleCBmcmFnbWVudCBhbHNvIGluY2x1ZGVzXG4gICAgLy8gYSBjYXB0dXJlLlxuICAgIC8vXG4gICAgLy8gQSBjaGFyYWN0ZXIgc3BlY2lmaWNhdGlvbiBjb250YWluczpcbiAgICAvL1xuICAgIC8vICogYHZhbGlkQ2hhcnNgOiBhIFN0cmluZyB3aXRoIGEgbGlzdCBvZiBhbGwgdmFsaWQgY2hhcmFjdGVycywgb3JcbiAgICAvLyAqIGBpbnZhbGlkQ2hhcnNgOiBhIFN0cmluZyB3aXRoIGEgbGlzdCBvZiBhbGwgaW52YWxpZCBjaGFyYWN0ZXJzXG4gICAgLy8gKiBgcmVwZWF0YDogdHJ1ZSBpZiB0aGUgY2hhcmFjdGVyIHNwZWNpZmljYXRpb24gY2FuIHJlcGVhdFxuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJCRTdGF0aWNTZWdtZW50KHN0cmluZykgeyB0aGlzLnN0cmluZyA9IHN0cmluZzsgfVxuICAgICQkcm91dGUkcmVjb2duaXplciQkU3RhdGljU2VnbWVudC5wcm90b3R5cGUgPSB7XG4gICAgICBlYWNoQ2hhcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHN0cmluZyA9IHRoaXMuc3RyaW5nLCBjaDtcblxuICAgICAgICBmb3IgKHZhciBpPTAsIGw9c3RyaW5nLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgICBjaCA9IHN0cmluZy5jaGFyQXQoaSk7XG4gICAgICAgICAgY2FsbGJhY2soeyB2YWxpZENoYXJzOiBjaCB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgcmVnZXg6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmcucmVwbGFjZSgkJHJvdXRlJHJlY29nbml6ZXIkJGVzY2FwZVJlZ2V4LCAnXFxcXCQxJyk7XG4gICAgICB9LFxuXG4gICAgICBnZW5lcmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmluZztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJCREeW5hbWljU2VnbWVudChuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWU7IH1cbiAgICAkJHJvdXRlJHJlY29nbml6ZXIkJER5bmFtaWNTZWdtZW50LnByb3RvdHlwZSA9IHtcbiAgICAgIGVhY2hDaGFyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayh7IGludmFsaWRDaGFyczogXCIvXCIsIHJlcGVhdDogdHJ1ZSB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHJlZ2V4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFwiKFteL10rKVwiO1xuICAgICAgfSxcblxuICAgICAgZ2VuZXJhdGU6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gcGFyYW1zW3RoaXMubmFtZV07XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciQkU3RhclNlZ21lbnQobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lOyB9XG4gICAgJCRyb3V0ZSRyZWNvZ25pemVyJCRTdGFyU2VnbWVudC5wcm90b3R5cGUgPSB7XG4gICAgICBlYWNoQ2hhcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2soeyBpbnZhbGlkQ2hhcnM6IFwiXCIsIHJlcGVhdDogdHJ1ZSB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHJlZ2V4OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFwiKC4rKVwiO1xuICAgICAgfSxcblxuICAgICAgZ2VuZXJhdGU6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgICByZXR1cm4gcGFyYW1zW3RoaXMubmFtZV07XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciQkRXBzaWxvblNlZ21lbnQoKSB7fVxuICAgICQkcm91dGUkcmVjb2duaXplciQkRXBzaWxvblNlZ21lbnQucHJvdG90eXBlID0ge1xuICAgICAgZWFjaENoYXI6IGZ1bmN0aW9uKCkge30sXG4gICAgICByZWdleDogZnVuY3Rpb24oKSB7IHJldHVybiBcIlwiOyB9LFxuICAgICAgZ2VuZXJhdGU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gXCJcIjsgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkJHBhcnNlKHJvdXRlLCBuYW1lcywgdHlwZXMpIHtcbiAgICAgIC8vIG5vcm1hbGl6ZSByb3V0ZSBhcyBub3Qgc3RhcnRpbmcgd2l0aCBhIFwiL1wiLiBSZWNvZ25pdGlvbiB3aWxsXG4gICAgICAvLyBhbHNvIG5vcm1hbGl6ZS5cbiAgICAgIGlmIChyb3V0ZS5jaGFyQXQoMCkgPT09IFwiL1wiKSB7IHJvdXRlID0gcm91dGUuc3Vic3RyKDEpOyB9XG5cbiAgICAgIHZhciBzZWdtZW50cyA9IHJvdXRlLnNwbGl0KFwiL1wiKSwgcmVzdWx0cyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpPTAsIGw9c2VnbWVudHMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICB2YXIgc2VnbWVudCA9IHNlZ21lbnRzW2ldLCBtYXRjaDtcblxuICAgICAgICBpZiAobWF0Y2ggPSBzZWdtZW50Lm1hdGNoKC9eOihbXlxcL10rKSQvKSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChuZXcgJCRyb3V0ZSRyZWNvZ25pemVyJCREeW5hbWljU2VnbWVudChtYXRjaFsxXSkpO1xuICAgICAgICAgIG5hbWVzLnB1c2gobWF0Y2hbMV0pO1xuICAgICAgICAgIHR5cGVzLmR5bmFtaWNzKys7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2ggPSBzZWdtZW50Lm1hdGNoKC9eXFwqKFteXFwvXSspJC8pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyAkJHJvdXRlJHJlY29nbml6ZXIkJFN0YXJTZWdtZW50KG1hdGNoWzFdKSk7XG4gICAgICAgICAgbmFtZXMucHVzaChtYXRjaFsxXSk7XG4gICAgICAgICAgdHlwZXMuc3RhcnMrKztcbiAgICAgICAgfSBlbHNlIGlmKHNlZ21lbnQgPT09IFwiXCIpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gobmV3ICQkcm91dGUkcmVjb2duaXplciQkRXBzaWxvblNlZ21lbnQoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyAkJHJvdXRlJHJlY29nbml6ZXIkJFN0YXRpY1NlZ21lbnQoc2VnbWVudCkpO1xuICAgICAgICAgIHR5cGVzLnN0YXRpY3MrKztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG5cbiAgICAvLyBBIFN0YXRlIGhhcyBhIGNoYXJhY3RlciBzcGVjaWZpY2F0aW9uIGFuZCAoYGNoYXJTcGVjYCkgYW5kIGEgbGlzdCBvZiBwb3NzaWJsZVxuICAgIC8vIHN1YnNlcXVlbnQgc3RhdGVzIChgbmV4dFN0YXRlc2ApLlxuICAgIC8vXG4gICAgLy8gSWYgYSBTdGF0ZSBpcyBhbiBhY2NlcHRpbmcgc3RhdGUsIGl0IHdpbGwgYWxzbyBoYXZlIHNldmVyYWwgYWRkaXRpb25hbFxuICAgIC8vIHByb3BlcnRpZXM6XG4gICAgLy9cbiAgICAvLyAqIGByZWdleGA6IEEgcmVndWxhciBleHByZXNzaW9uIHRoYXQgaXMgdXNlZCB0byBleHRyYWN0IHBhcmFtZXRlcnMgZnJvbSBwYXRoc1xuICAgIC8vICAgdGhhdCByZWFjaGVkIHRoaXMgYWNjZXB0aW5nIHN0YXRlLlxuICAgIC8vICogYGhhbmRsZXJzYDogSW5mb3JtYXRpb24gb24gaG93IHRvIGNvbnZlcnQgdGhlIGxpc3Qgb2YgY2FwdHVyZXMgaW50byBjYWxsc1xuICAgIC8vICAgdG8gcmVnaXN0ZXJlZCBoYW5kbGVycyB3aXRoIHRoZSBzcGVjaWZpZWQgcGFyYW1ldGVyc1xuICAgIC8vICogYHR5cGVzYDogSG93IG1hbnkgc3RhdGljLCBkeW5hbWljIG9yIHN0YXIgc2VnbWVudHMgaW4gdGhpcyByb3V0ZS4gVXNlZCB0b1xuICAgIC8vICAgZGVjaWRlIHdoaWNoIHJvdXRlIHRvIHVzZSBpZiBtdWx0aXBsZSByZWdpc3RlcmVkIHJvdXRlcyBtYXRjaCBhIHBhdGguXG4gICAgLy9cbiAgICAvLyBDdXJyZW50bHksIFN0YXRlIGlzIGltcGxlbWVudGVkIG5haXZlbHkgYnkgbG9vcGluZyBvdmVyIGBuZXh0U3RhdGVzYCBhbmRcbiAgICAvLyBjb21wYXJpbmcgYSBjaGFyYWN0ZXIgc3BlY2lmaWNhdGlvbiBhZ2FpbnN0IGEgY2hhcmFjdGVyLiBBIG1vcmUgZWZmaWNpZW50XG4gICAgLy8gaW1wbGVtZW50YXRpb24gd291bGQgdXNlIGEgaGFzaCBvZiBrZXlzIHBvaW50aW5nIGF0IG9uZSBvciBtb3JlIG5leHQgc3RhdGVzLlxuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJCRTdGF0ZShjaGFyU3BlYykge1xuICAgICAgdGhpcy5jaGFyU3BlYyA9IGNoYXJTcGVjO1xuICAgICAgdGhpcy5uZXh0U3RhdGVzID0gW107XG4gICAgfVxuXG4gICAgJCRyb3V0ZSRyZWNvZ25pemVyJCRTdGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKGNoYXJTcGVjKSB7XG4gICAgICAgIHZhciBuZXh0U3RhdGVzID0gdGhpcy5uZXh0U3RhdGVzO1xuXG4gICAgICAgIGZvciAodmFyIGk9MCwgbD1uZXh0U3RhdGVzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgICB2YXIgY2hpbGQgPSBuZXh0U3RhdGVzW2ldO1xuXG4gICAgICAgICAgdmFyIGlzRXF1YWwgPSBjaGlsZC5jaGFyU3BlYy52YWxpZENoYXJzID09PSBjaGFyU3BlYy52YWxpZENoYXJzO1xuICAgICAgICAgIGlzRXF1YWwgPSBpc0VxdWFsICYmIGNoaWxkLmNoYXJTcGVjLmludmFsaWRDaGFycyA9PT0gY2hhclNwZWMuaW52YWxpZENoYXJzO1xuXG4gICAgICAgICAgaWYgKGlzRXF1YWwpIHsgcmV0dXJuIGNoaWxkOyB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHB1dDogZnVuY3Rpb24oY2hhclNwZWMpIHtcbiAgICAgICAgdmFyIHN0YXRlO1xuXG4gICAgICAgIC8vIElmIHRoZSBjaGFyYWN0ZXIgc3BlY2lmaWNhdGlvbiBhbHJlYWR5IGV4aXN0cyBpbiBhIGNoaWxkIG9mIHRoZSBjdXJyZW50XG4gICAgICAgIC8vIHN0YXRlLCBqdXN0IHJldHVybiB0aGF0IHN0YXRlLlxuICAgICAgICBpZiAoc3RhdGUgPSB0aGlzLmdldChjaGFyU3BlYykpIHsgcmV0dXJuIHN0YXRlOyB9XG5cbiAgICAgICAgLy8gTWFrZSBhIG5ldyBzdGF0ZSBmb3IgdGhlIGNoYXJhY3RlciBzcGVjXG4gICAgICAgIHN0YXRlID0gbmV3ICQkcm91dGUkcmVjb2duaXplciQkU3RhdGUoY2hhclNwZWMpO1xuXG4gICAgICAgIC8vIEluc2VydCB0aGUgbmV3IHN0YXRlIGFzIGEgY2hpbGQgb2YgdGhlIGN1cnJlbnQgc3RhdGVcbiAgICAgICAgdGhpcy5uZXh0U3RhdGVzLnB1c2goc3RhdGUpO1xuXG4gICAgICAgIC8vIElmIHRoaXMgY2hhcmFjdGVyIHNwZWNpZmljYXRpb24gcmVwZWF0cywgaW5zZXJ0IHRoZSBuZXcgc3RhdGUgYXMgYSBjaGlsZFxuICAgICAgICAvLyBvZiBpdHNlbGYuIE5vdGUgdGhhdCB0aGlzIHdpbGwgbm90IHRyaWdnZXIgYW4gaW5maW5pdGUgbG9vcCBiZWNhdXNlIGVhY2hcbiAgICAgICAgLy8gdHJhbnNpdGlvbiBkdXJpbmcgcmVjb2duaXRpb24gY29uc3VtZXMgYSBjaGFyYWN0ZXIuXG4gICAgICAgIGlmIChjaGFyU3BlYy5yZXBlYXQpIHtcbiAgICAgICAgICBzdGF0ZS5uZXh0U3RhdGVzLnB1c2goc3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIHRoZSBuZXcgc3RhdGVcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfSxcblxuICAgICAgLy8gRmluZCBhIGxpc3Qgb2YgY2hpbGQgc3RhdGVzIG1hdGNoaW5nIHRoZSBuZXh0IGNoYXJhY3RlclxuICAgICAgbWF0Y2g6IGZ1bmN0aW9uKGNoKSB7XG4gICAgICAgIC8vIERFQlVHIFwiUHJvY2Vzc2luZyBgXCIgKyBjaCArIFwiYDpcIlxuICAgICAgICB2YXIgbmV4dFN0YXRlcyA9IHRoaXMubmV4dFN0YXRlcyxcbiAgICAgICAgICAgIGNoaWxkLCBjaGFyU3BlYywgY2hhcnM7XG5cbiAgICAgICAgLy8gREVCVUcgXCIgIFwiICsgZGVidWdTdGF0ZSh0aGlzKVxuICAgICAgICB2YXIgcmV0dXJuZWQgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpPTAsIGw9bmV4dFN0YXRlcy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICAgICAgY2hpbGQgPSBuZXh0U3RhdGVzW2ldO1xuXG4gICAgICAgICAgY2hhclNwZWMgPSBjaGlsZC5jaGFyU3BlYztcblxuICAgICAgICAgIGlmICh0eXBlb2YgKGNoYXJzID0gY2hhclNwZWMudmFsaWRDaGFycykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZiAoY2hhcnMuaW5kZXhPZihjaCkgIT09IC0xKSB7IHJldHVybmVkLnB1c2goY2hpbGQpOyB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgKGNoYXJzID0gY2hhclNwZWMuaW52YWxpZENoYXJzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmIChjaGFycy5pbmRleE9mKGNoKSA9PT0gLTEpIHsgcmV0dXJuZWQucHVzaChjaGlsZCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0dXJuZWQ7XG4gICAgICB9XG5cbiAgICAgIC8qKiBJRiBERUJVR1xuICAgICAgLCBkZWJ1ZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaGFyU3BlYyA9IHRoaXMuY2hhclNwZWMsXG4gICAgICAgICAgICBkZWJ1ZyA9IFwiW1wiLFxuICAgICAgICAgICAgY2hhcnMgPSBjaGFyU3BlYy52YWxpZENoYXJzIHx8IGNoYXJTcGVjLmludmFsaWRDaGFycztcblxuICAgICAgICBpZiAoY2hhclNwZWMuaW52YWxpZENoYXJzKSB7IGRlYnVnICs9IFwiXlwiOyB9XG4gICAgICAgIGRlYnVnICs9IGNoYXJzO1xuICAgICAgICBkZWJ1ZyArPSBcIl1cIjtcblxuICAgICAgICBpZiAoY2hhclNwZWMucmVwZWF0KSB7IGRlYnVnICs9IFwiK1wiOyB9XG5cbiAgICAgICAgcmV0dXJuIGRlYnVnO1xuICAgICAgfVxuICAgICAgRU5EIElGICoqL1xuICAgIH07XG5cbiAgICAvKiogSUYgREVCVUdcbiAgICBmdW5jdGlvbiBkZWJ1Zyhsb2cpIHtcbiAgICAgIGNvbnNvbGUubG9nKGxvZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVidWdTdGF0ZShzdGF0ZSkge1xuICAgICAgcmV0dXJuIHN0YXRlLm5leHRTdGF0ZXMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgaWYgKG4ubmV4dFN0YXRlcy5sZW5ndGggPT09IDApIHsgcmV0dXJuIFwiKCBcIiArIG4uZGVidWcoKSArIFwiIFthY2NlcHRpbmddIClcIjsgfVxuICAgICAgICByZXR1cm4gXCIoIFwiICsgbi5kZWJ1ZygpICsgXCIgPHRoZW4+IFwiICsgbi5uZXh0U3RhdGVzLm1hcChmdW5jdGlvbihzKSB7IHJldHVybiBzLmRlYnVnKCkgfSkuam9pbihcIiBvciBcIikgKyBcIiApXCI7XG4gICAgICB9KS5qb2luKFwiLCBcIilcbiAgICB9XG4gICAgRU5EIElGICoqL1xuXG4gICAgLy8gVGhpcyBpcyBhIHNvbWV3aGF0IG5haXZlIHN0cmF0ZWd5LCBidXQgc2hvdWxkIHdvcmsgaW4gYSBsb3Qgb2YgY2FzZXNcbiAgICAvLyBBIGJldHRlciBzdHJhdGVneSB3b3VsZCBwcm9wZXJseSByZXNvbHZlIC9wb3N0cy86aWQvbmV3IGFuZCAvcG9zdHMvZWRpdC86aWQuXG4gICAgLy9cbiAgICAvLyBUaGlzIHN0cmF0ZWd5IGdlbmVyYWxseSBwcmVmZXJzIG1vcmUgc3RhdGljIGFuZCBsZXNzIGR5bmFtaWMgbWF0Y2hpbmcuXG4gICAgLy8gU3BlY2lmaWNhbGx5LCBpdFxuICAgIC8vXG4gICAgLy8gICogcHJlZmVycyBmZXdlciBzdGFycyB0byBtb3JlLCB0aGVuXG4gICAgLy8gICogcHJlZmVycyB1c2luZyBzdGFycyBmb3IgbGVzcyBvZiB0aGUgbWF0Y2ggdG8gbW9yZSwgdGhlblxuICAgIC8vICAqIHByZWZlcnMgZmV3ZXIgZHluYW1pYyBzZWdtZW50cyB0byBtb3JlLCB0aGVuXG4gICAgLy8gICogcHJlZmVycyBtb3JlIHN0YXRpYyBzZWdtZW50cyB0byBtb3JlXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJCRzb3J0U29sdXRpb25zKHN0YXRlcykge1xuICAgICAgcmV0dXJuIHN0YXRlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgaWYgKGEudHlwZXMuc3RhcnMgIT09IGIudHlwZXMuc3RhcnMpIHsgcmV0dXJuIGEudHlwZXMuc3RhcnMgLSBiLnR5cGVzLnN0YXJzOyB9XG5cbiAgICAgICAgaWYgKGEudHlwZXMuc3RhcnMpIHtcbiAgICAgICAgICBpZiAoYS50eXBlcy5zdGF0aWNzICE9PSBiLnR5cGVzLnN0YXRpY3MpIHsgcmV0dXJuIGIudHlwZXMuc3RhdGljcyAtIGEudHlwZXMuc3RhdGljczsgfVxuICAgICAgICAgIGlmIChhLnR5cGVzLmR5bmFtaWNzICE9PSBiLnR5cGVzLmR5bmFtaWNzKSB7IHJldHVybiBiLnR5cGVzLmR5bmFtaWNzIC0gYS50eXBlcy5keW5hbWljczsgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGEudHlwZXMuZHluYW1pY3MgIT09IGIudHlwZXMuZHluYW1pY3MpIHsgcmV0dXJuIGEudHlwZXMuZHluYW1pY3MgLSBiLnR5cGVzLmR5bmFtaWNzOyB9XG4gICAgICAgIGlmIChhLnR5cGVzLnN0YXRpY3MgIT09IGIudHlwZXMuc3RhdGljcykgeyByZXR1cm4gYi50eXBlcy5zdGF0aWNzIC0gYS50eXBlcy5zdGF0aWNzOyB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkJHJlY29nbml6ZUNoYXIoc3RhdGVzLCBjaCkge1xuICAgICAgdmFyIG5leHRTdGF0ZXMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaT0wLCBsPXN0YXRlcy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHN0YXRlc1tpXTtcblxuICAgICAgICBuZXh0U3RhdGVzID0gbmV4dFN0YXRlcy5jb25jYXQoc3RhdGUubWF0Y2goY2gpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5leHRTdGF0ZXM7XG4gICAgfVxuXG4gICAgdmFyICQkcm91dGUkcmVjb2duaXplciQkb0NyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24ocHJvdG8pIHtcbiAgICAgIGZ1bmN0aW9uIEYoKSB7fVxuICAgICAgRi5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkJFJlY29nbml6ZVJlc3VsdHMocXVlcnlQYXJhbXMpIHtcbiAgICAgIHRoaXMucXVlcnlQYXJhbXMgPSBxdWVyeVBhcmFtcyB8fCB7fTtcbiAgICB9XG4gICAgJCRyb3V0ZSRyZWNvZ25pemVyJCRSZWNvZ25pemVSZXN1bHRzLnByb3RvdHlwZSA9ICQkcm91dGUkcmVjb2duaXplciQkb0NyZWF0ZSh7XG4gICAgICBzcGxpY2U6IEFycmF5LnByb3RvdHlwZS5zcGxpY2UsXG4gICAgICBzbGljZTogIEFycmF5LnByb3RvdHlwZS5zbGljZSxcbiAgICAgIHB1c2g6ICAgQXJyYXkucHJvdG90eXBlLnB1c2gsXG4gICAgICBsZW5ndGg6IDAsXG4gICAgICBxdWVyeVBhcmFtczogbnVsbFxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJCRmaW5kSGFuZGxlcihzdGF0ZSwgcGF0aCwgcXVlcnlQYXJhbXMpIHtcbiAgICAgIHZhciBoYW5kbGVycyA9IHN0YXRlLmhhbmRsZXJzLCByZWdleCA9IHN0YXRlLnJlZ2V4O1xuICAgICAgdmFyIGNhcHR1cmVzID0gcGF0aC5tYXRjaChyZWdleCksIGN1cnJlbnRDYXB0dXJlID0gMTtcbiAgICAgIHZhciByZXN1bHQgPSBuZXcgJCRyb3V0ZSRyZWNvZ25pemVyJCRSZWNvZ25pemVSZXN1bHRzKHF1ZXJ5UGFyYW1zKTtcblxuICAgICAgZm9yICh2YXIgaT0wLCBsPWhhbmRsZXJzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBoYW5kbGVyc1tpXSwgbmFtZXMgPSBoYW5kbGVyLm5hbWVzLCBwYXJhbXMgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBqPTAsIG09bmFtZXMubGVuZ3RoOyBqPG07IGorKykge1xuICAgICAgICAgIHBhcmFtc1tuYW1lc1tqXV0gPSBjYXB0dXJlc1tjdXJyZW50Q2FwdHVyZSsrXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdC5wdXNoKHsgaGFuZGxlcjogaGFuZGxlci5oYW5kbGVyLCBwYXJhbXM6IHBhcmFtcywgaXNEeW5hbWljOiAhIW5hbWVzLmxlbmd0aCB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkJGFkZFNlZ21lbnQoY3VycmVudFN0YXRlLCBzZWdtZW50KSB7XG4gICAgICBzZWdtZW50LmVhY2hDaGFyKGZ1bmN0aW9uKGNoKSB7XG4gICAgICAgIHZhciBzdGF0ZTtcblxuICAgICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50U3RhdGUucHV0KGNoKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gY3VycmVudFN0YXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciQkZGVjb2RlUXVlcnlQYXJhbVBhcnQocGFydCkge1xuICAgICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDQwMS9pbnRlcmFjdC9mb3Jtcy5odG1sI2gtMTcuMTMuNC4xXG4gICAgICBwYXJ0ID0gcGFydC5yZXBsYWNlKC9cXCsvZ20sICclMjAnKTtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocGFydCk7XG4gICAgfVxuXG4gICAgLy8gVGhlIG1haW4gaW50ZXJmYWNlXG5cbiAgICB2YXIgJCRyb3V0ZSRyZWNvZ25pemVyJCRSb3V0ZVJlY29nbml6ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucm9vdFN0YXRlID0gbmV3ICQkcm91dGUkcmVjb2duaXplciQkU3RhdGUoKTtcbiAgICAgIHRoaXMubmFtZXMgPSB7fTtcbiAgICB9O1xuXG5cbiAgICAkJHJvdXRlJHJlY29nbml6ZXIkJFJvdXRlUmVjb2duaXplci5wcm90b3R5cGUgPSB7XG4gICAgICBhZGQ6IGZ1bmN0aW9uKHJvdXRlcywgb3B0aW9ucykge1xuICAgICAgICB2YXIgY3VycmVudFN0YXRlID0gdGhpcy5yb290U3RhdGUsIHJlZ2V4ID0gXCJeXCIsXG4gICAgICAgICAgICB0eXBlcyA9IHsgc3RhdGljczogMCwgZHluYW1pY3M6IDAsIHN0YXJzOiAwIH0sXG4gICAgICAgICAgICBoYW5kbGVycyA9IFtdLCBhbGxTZWdtZW50cyA9IFtdLCBuYW1lO1xuXG4gICAgICAgIHZhciBpc0VtcHR5ID0gdHJ1ZTtcblxuICAgICAgICBmb3IgKHZhciBpPTAsIGw9cm91dGVzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgICB2YXIgcm91dGUgPSByb3V0ZXNbaV0sIG5hbWVzID0gW107XG5cbiAgICAgICAgICB2YXIgc2VnbWVudHMgPSAkJHJvdXRlJHJlY29nbml6ZXIkJHBhcnNlKHJvdXRlLnBhdGgsIG5hbWVzLCB0eXBlcyk7XG5cbiAgICAgICAgICBhbGxTZWdtZW50cyA9IGFsbFNlZ21lbnRzLmNvbmNhdChzZWdtZW50cyk7XG5cbiAgICAgICAgICBmb3IgKHZhciBqPTAsIG09c2VnbWVudHMubGVuZ3RoOyBqPG07IGorKykge1xuICAgICAgICAgICAgdmFyIHNlZ21lbnQgPSBzZWdtZW50c1tqXTtcblxuICAgICAgICAgICAgaWYgKHNlZ21lbnQgaW5zdGFuY2VvZiAkJHJvdXRlJHJlY29nbml6ZXIkJEVwc2lsb25TZWdtZW50KSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgICAgIGlzRW1wdHkgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gQWRkIGEgXCIvXCIgZm9yIHRoZSBuZXcgc2VnbWVudFxuICAgICAgICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudFN0YXRlLnB1dCh7IHZhbGlkQ2hhcnM6IFwiL1wiIH0pO1xuICAgICAgICAgICAgcmVnZXggKz0gXCIvXCI7XG5cbiAgICAgICAgICAgIC8vIEFkZCBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzZWdtZW50IHRvIHRoZSBORkEgYW5kIHJlZ2V4XG4gICAgICAgICAgICBjdXJyZW50U3RhdGUgPSAkJHJvdXRlJHJlY29nbml6ZXIkJGFkZFNlZ21lbnQoY3VycmVudFN0YXRlLCBzZWdtZW50KTtcbiAgICAgICAgICAgIHJlZ2V4ICs9IHNlZ21lbnQucmVnZXgoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgaGFuZGxlciA9IHsgaGFuZGxlcjogcm91dGUuaGFuZGxlciwgbmFtZXM6IG5hbWVzIH07XG4gICAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICAgICAgY3VycmVudFN0YXRlID0gY3VycmVudFN0YXRlLnB1dCh7IHZhbGlkQ2hhcnM6IFwiL1wiIH0pO1xuICAgICAgICAgIHJlZ2V4ICs9IFwiL1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFN0YXRlLmhhbmRsZXJzID0gaGFuZGxlcnM7XG4gICAgICAgIGN1cnJlbnRTdGF0ZS5yZWdleCA9IG5ldyBSZWdFeHAocmVnZXggKyBcIiRcIik7XG4gICAgICAgIGN1cnJlbnRTdGF0ZS50eXBlcyA9IHR5cGVzO1xuXG4gICAgICAgIGlmIChuYW1lID0gb3B0aW9ucyAmJiBvcHRpb25zLmFzKSB7XG4gICAgICAgICAgdGhpcy5uYW1lc1tuYW1lXSA9IHtcbiAgICAgICAgICAgIHNlZ21lbnRzOiBhbGxTZWdtZW50cyxcbiAgICAgICAgICAgIGhhbmRsZXJzOiBoYW5kbGVyc1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGhhbmRsZXJzRm9yOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHZhciByb3V0ZSA9IHRoaXMubmFtZXNbbmFtZV0sIHJlc3VsdCA9IFtdO1xuICAgICAgICBpZiAoIXJvdXRlKSB7IHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIHJvdXRlIG5hbWVkIFwiICsgbmFtZSk7IH1cblxuICAgICAgICBmb3IgKHZhciBpPTAsIGw9cm91dGUuaGFuZGxlcnMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHJvdXRlLmhhbmRsZXJzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LFxuXG4gICAgICBoYXNSb3V0ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgICByZXR1cm4gISF0aGlzLm5hbWVzW25hbWVdO1xuICAgICAgfSxcblxuICAgICAgZ2VuZXJhdGU6IGZ1bmN0aW9uKG5hbWUsIHBhcmFtcykge1xuICAgICAgICB2YXIgcm91dGUgPSB0aGlzLm5hbWVzW25hbWVdLCBvdXRwdXQgPSBcIlwiO1xuICAgICAgICBpZiAoIXJvdXRlKSB7IHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIHJvdXRlIG5hbWVkIFwiICsgbmFtZSk7IH1cblxuICAgICAgICB2YXIgc2VnbWVudHMgPSByb3V0ZS5zZWdtZW50cztcblxuICAgICAgICBmb3IgKHZhciBpPTAsIGw9c2VnbWVudHMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICAgIHZhciBzZWdtZW50ID0gc2VnbWVudHNbaV07XG5cbiAgICAgICAgICBpZiAoc2VnbWVudCBpbnN0YW5jZW9mICQkcm91dGUkcmVjb2duaXplciQkRXBzaWxvblNlZ21lbnQpIHsgY29udGludWU7IH1cblxuICAgICAgICAgIG91dHB1dCArPSBcIi9cIjtcbiAgICAgICAgICBvdXRwdXQgKz0gc2VnbWVudC5nZW5lcmF0ZShwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG91dHB1dC5jaGFyQXQoMCkgIT09ICcvJykgeyBvdXRwdXQgPSAnLycgKyBvdXRwdXQ7IH1cblxuICAgICAgICBpZiAocGFyYW1zICYmIHBhcmFtcy5xdWVyeVBhcmFtcykge1xuICAgICAgICAgIG91dHB1dCArPSB0aGlzLmdlbmVyYXRlUXVlcnlTdHJpbmcocGFyYW1zLnF1ZXJ5UGFyYW1zLCByb3V0ZS5oYW5kbGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfSxcblxuICAgICAgZ2VuZXJhdGVRdWVyeVN0cmluZzogZnVuY3Rpb24ocGFyYW1zLCBoYW5kbGVycykge1xuICAgICAgICB2YXIgcGFpcnMgPSBbXTtcbiAgICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAga2V5cy5zb3J0KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJhbXNba2V5XTtcbiAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBwYWlyID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSk7XG4gICAgICAgICAgaWYgKCQkcm91dGUkcmVjb2duaXplciQkaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgIHZhciBhcnJheVBhaXIgPSBrZXkgKyAnW10nICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlW2pdKTtcbiAgICAgICAgICAgICAgcGFpcnMucHVzaChhcnJheVBhaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYWlyICs9IFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgICAgICAgIHBhaXJzLnB1c2gocGFpcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhaXJzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJyc7IH1cblxuICAgICAgICByZXR1cm4gXCI/XCIgKyBwYWlycy5qb2luKFwiJlwiKTtcbiAgICAgIH0sXG5cbiAgICAgIHBhcnNlUXVlcnlTdHJpbmc6IGZ1bmN0aW9uKHF1ZXJ5U3RyaW5nKSB7XG4gICAgICAgIHZhciBwYWlycyA9IHF1ZXJ5U3RyaW5nLnNwbGl0KFwiJlwiKSwgcXVlcnlQYXJhbXMgPSB7fTtcbiAgICAgICAgZm9yKHZhciBpPTA7IGkgPCBwYWlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBwYWlyICAgICAgPSBwYWlyc1tpXS5zcGxpdCgnPScpLFxuICAgICAgICAgICAgICBrZXkgICAgICAgPSAkJHJvdXRlJHJlY29nbml6ZXIkJGRlY29kZVF1ZXJ5UGFyYW1QYXJ0KHBhaXJbMF0pLFxuICAgICAgICAgICAgICBrZXlMZW5ndGggPSBrZXkubGVuZ3RoLFxuICAgICAgICAgICAgICBpc0FycmF5ID0gZmFsc2UsXG4gICAgICAgICAgICAgIHZhbHVlO1xuICAgICAgICAgIGlmIChwYWlyLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdmFsdWUgPSAndHJ1ZSc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vSGFuZGxlIGFycmF5c1xuICAgICAgICAgICAgaWYgKGtleUxlbmd0aCA+IDIgJiYga2V5LnNsaWNlKGtleUxlbmd0aCAtMikgPT09ICdbXScpIHtcbiAgICAgICAgICAgICAgaXNBcnJheSA9IHRydWU7XG4gICAgICAgICAgICAgIGtleSA9IGtleS5zbGljZSgwLCBrZXlMZW5ndGggLSAyKTtcbiAgICAgICAgICAgICAgaWYoIXF1ZXJ5UGFyYW1zW2tleV0pIHtcbiAgICAgICAgICAgICAgICBxdWVyeVBhcmFtc1trZXldID0gW107XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gcGFpclsxXSA/ICQkcm91dGUkcmVjb2duaXplciQkZGVjb2RlUXVlcnlQYXJhbVBhcnQocGFpclsxXSkgOiAnJztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzQXJyYXkpIHtcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zW2tleV0ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHF1ZXJ5UGFyYW1zW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHF1ZXJ5UGFyYW1zO1xuICAgICAgfSxcblxuICAgICAgcmVjb2duaXplOiBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgIHZhciBzdGF0ZXMgPSBbIHRoaXMucm9vdFN0YXRlIF0sXG4gICAgICAgICAgICBwYXRoTGVuLCBpLCBsLCBxdWVyeVN0YXJ0LCBxdWVyeVBhcmFtcyA9IHt9LFxuICAgICAgICAgICAgaXNTbGFzaERyb3BwZWQgPSBmYWxzZTtcblxuICAgICAgICBxdWVyeVN0YXJ0ID0gcGF0aC5pbmRleE9mKCc/Jyk7XG4gICAgICAgIGlmIChxdWVyeVN0YXJ0ICE9PSAtMSkge1xuICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9IHBhdGguc3Vic3RyKHF1ZXJ5U3RhcnQgKyAxLCBwYXRoLmxlbmd0aCk7XG4gICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHF1ZXJ5U3RhcnQpO1xuICAgICAgICAgIHF1ZXJ5UGFyYW1zID0gdGhpcy5wYXJzZVF1ZXJ5U3RyaW5nKHF1ZXJ5U3RyaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhdGggPSBkZWNvZGVVUkkocGF0aCk7XG5cbiAgICAgICAgLy8gREVCVUcgR1JPVVAgcGF0aFxuXG4gICAgICAgIGlmIChwYXRoLmNoYXJBdCgwKSAhPT0gXCIvXCIpIHsgcGF0aCA9IFwiL1wiICsgcGF0aDsgfVxuXG4gICAgICAgIHBhdGhMZW4gPSBwYXRoLmxlbmd0aDtcbiAgICAgICAgaWYgKHBhdGhMZW4gPiAxICYmIHBhdGguY2hhckF0KHBhdGhMZW4gLSAxKSA9PT0gXCIvXCIpIHtcbiAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMCwgcGF0aExlbiAtIDEpO1xuICAgICAgICAgIGlzU2xhc2hEcm9wcGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaT0wLCBsPXBhdGgubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICAgIHN0YXRlcyA9ICQkcm91dGUkcmVjb2duaXplciQkcmVjb2duaXplQ2hhcihzdGF0ZXMsIHBhdGguY2hhckF0KGkpKTtcbiAgICAgICAgICBpZiAoIXN0YXRlcy5sZW5ndGgpIHsgYnJlYWs7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVORCBERUJVRyBHUk9VUFxuXG4gICAgICAgIHZhciBzb2x1dGlvbnMgPSBbXTtcbiAgICAgICAgZm9yIChpPTAsIGw9c3RhdGVzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgICBpZiAoc3RhdGVzW2ldLmhhbmRsZXJzKSB7IHNvbHV0aW9ucy5wdXNoKHN0YXRlc1tpXSk7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlcyA9ICQkcm91dGUkcmVjb2duaXplciQkc29ydFNvbHV0aW9ucyhzb2x1dGlvbnMpO1xuXG4gICAgICAgIHZhciBzdGF0ZSA9IHNvbHV0aW9uc1swXTtcblxuICAgICAgICBpZiAoc3RhdGUgJiYgc3RhdGUuaGFuZGxlcnMpIHtcbiAgICAgICAgICAvLyBpZiBhIHRyYWlsaW5nIHNsYXNoIHdhcyBkcm9wcGVkIGFuZCBhIHN0YXIgc2VnbWVudCBpcyB0aGUgbGFzdCBzZWdtZW50XG4gICAgICAgICAgLy8gc3BlY2lmaWVkLCBwdXQgdGhlIHRyYWlsaW5nIHNsYXNoIGJhY2tcbiAgICAgICAgICBpZiAoaXNTbGFzaERyb3BwZWQgJiYgc3RhdGUucmVnZXguc291cmNlLnNsaWNlKC01KSA9PT0gXCIoLispJFwiKSB7XG4gICAgICAgICAgICBwYXRoID0gcGF0aCArIFwiL1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJCRyb3V0ZSRyZWNvZ25pemVyJCRmaW5kSGFuZGxlcihzdGF0ZSwgcGF0aCwgcXVlcnlQYXJhbXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgICQkcm91dGUkcmVjb2duaXplciQkUm91dGVSZWNvZ25pemVyLnByb3RvdHlwZS5tYXAgPSAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRkZWZhdWx0O1xuXG4gICAgJCRyb3V0ZSRyZWNvZ25pemVyJCRSb3V0ZVJlY29nbml6ZXIuVkVSU0lPTiA9ICcwLjEuNSc7XG5cbiAgICB2YXIgJCRyb3V0ZSRyZWNvZ25pemVyJCRkZWZhdWx0ID0gJCRyb3V0ZSRyZWNvZ25pemVyJCRSb3V0ZVJlY29nbml6ZXI7XG5cbiAgICAvKiBnbG9iYWwgZGVmaW5lOnRydWUgbW9kdWxlOnRydWUgd2luZG93OiB0cnVlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gJCRyb3V0ZSRyZWNvZ25pemVyJCRkZWZhdWx0OyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSB7XG4gICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9ICQkcm91dGUkcmVjb2duaXplciQkZGVmYXVsdDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpc1snUm91dGVSZWNvZ25pemVyJ10gPSAkJHJvdXRlJHJlY29nbml6ZXIkJGRlZmF1bHQ7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cm91dGUtcmVjb2duaXplci5qcy5tYXAiLCJ2YXIgUmVjb2duaXplciA9IHJlcXVpcmUoJ3JvdXRlLXJlY29nbml6ZXInKVxudmFyIGhhc1B1c2hTdGF0ZSA9IHR5cGVvZiBoaXN0b3J5ICE9PSAndW5kZWZpbmVkJyAmJiBoaXN0b3J5LnB1c2hTdGF0ZVxuXG4vKipcbiAqIFJvdXRlciBjb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IHJvb3RcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSBoYXNoYmFuZyAgKGRlZmF1bHQ6IHRydWUpXG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gcHVzaHN0YXRlIChkZWZhdWx0OiBmYWxzZSlcbiAqL1xuXG5mdW5jdGlvbiBWdWVSb3V0ZXIgKG9wdGlvbnMpIHtcbiAgdGhpcy5fcmVjb2duaXplciA9IG5ldyBSZWNvZ25pemVyKClcbiAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlXG4gIHRoaXMuX3ZtID0gbnVsbFxuICB0aGlzLl9jdXJyZW50UGF0aCA9IG51bGxcbiAgdGhpcy5fbm90Zm91bmRIYW5kbGVyID0gbnVsbFxuICB0aGlzLl9yb290ID0gbnVsbFxuICB0aGlzLl9oYXNQdXNoU3RhdGUgPSBoYXNQdXNoU3RhdGVcbiAgdmFyIHJvb3QgPSBvcHRpb25zICYmIG9wdGlvbnMucm9vdFxuICBpZiAocm9vdCkge1xuICAgIC8vIG1ha2Ugc3VyZSB0aGVyZSdzIHRoZSBzdGFydGluZyBzbGFzaFxuICAgIGlmIChyb290LmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICByb290ID0gJy8nICsgcm9vdFxuICAgIH1cbiAgICAvLyByZW1vdmUgdHJhaWxpbmcgc2xhc2hcbiAgICB0aGlzLl9yb290ID0gcm9vdC5yZXBsYWNlKC9cXC8kLywgJycpXG4gIH1cbiAgdGhpcy5faGFzaGJhbmcgPSAhKG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNoYmFuZyA9PT0gZmFsc2UpXG4gIHRoaXMuX3B1c2hzdGF0ZSA9ICEhKGhhc1B1c2hTdGF0ZSAmJiBvcHRpb25zICYmIG9wdGlvbnMucHVzaHN0YXRlKVxufVxuXG52YXIgcCA9IFZ1ZVJvdXRlci5wcm90b3R5cGVcblxuLy9cbi8vIFB1YmxpYyBBUElcbi8vXG4vL1xuXG4vKipcbiAqIFJlZ2lzdGVyIGEgbWFwIG9mIHRvcC1sZXZlbCBwYXRocy5cbiAqL1xuXG5wLm1hcCA9IGZ1bmN0aW9uIChtYXApIHtcbiAgZm9yICh2YXIgcm91dGUgaW4gbWFwKSB7XG4gICAgdGhpcy5vbihyb3V0ZSwgbWFwW3JvdXRlXSlcbiAgfVxufVxuXG4vKipcbiAqIFJlZ2lzdGVyIGEgc2luZ2xlIHJvb3QtbGV2ZWwgcGF0aFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByb290UGF0aFxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICogICAgICAgICAgICAgICAgIC0ge1N0cmluZ30gY29tcG9uZW50XG4gKiAgICAgICAgICAgICAgICAgLSB7T2JqZWN0fSBbc3ViUm91dGVzXVxuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IFtmb3JjZVJlZnJlc2hdXG4gKiAgICAgICAgICAgICAgICAgLSB7RnVuY3Rpb259IFtiZWZvcmVdXG4gKiAgICAgICAgICAgICAgICAgLSB7RnVuY3Rpb259IFthZnRlcl1cbiAqL1xuXG5wLm9uID0gZnVuY3Rpb24gKHJvb3RQYXRoLCBjb25maWcpIHtcbiAgaWYgKHJvb3RQYXRoID09PSAnKicpIHtcbiAgICB0aGlzLm5vdGZvdW5kKGNvbmZpZylcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9hZGRSb3V0ZShyb290UGF0aCwgY29uZmlnLCBbXSlcbiAgfVxufVxuXG4vKipcbiAqIFNldCB0aGUgbm90Zm91bmQgcm91dGUgY29uZmlnLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqL1xuXG5wLm5vdGZvdW5kID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICB0aGlzLl9ub3Rmb3VuZEhhbmRsZXIgPSBbeyBoYW5kbGVyOiBjb25maWcgfV1cbn1cblxuLyoqXG4gKiBTZXQgcmVkaXJlY3RzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXBcbiAqL1xuXG5wLnJlZGlyZWN0ID0gZnVuY3Rpb24gKG1hcCkge1xuICAvLyBUT0RPXG4gIC8vIHVzZSBhbm90aGVyIHJlY29nbml6ZXIgdG8gcmVjb2duaXplIHJlZGlyZWN0c1xufVxuXG4vKipcbiAqIE5hdmlnYXRlIHRvIGEgZ2l2ZW4gcGF0aC5cbiAqIFRoZSBwYXRoIGlzIGFzc3VtZWQgdG8gYmUgYWxyZWFkeSBkZWNvZGVkLCBhbmQgd2lsbFxuICogYmUgcmVzb2x2ZWQgYWdhaW5zdCByb290IChpZiBwcm92aWRlZClcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICovXG5cbnAuZ28gPSBmdW5jdGlvbiAocGF0aCwgb3B0aW9ucykge1xuICBpZiAodGhpcy5fcHVzaHN0YXRlKSB7XG4gICAgLy8gbWFrZSBpdCByZWxhdGl2ZSB0byByb290XG4gICAgcGF0aCA9IHRoaXMuX3Jvb3RcbiAgICAgID8gdGhpcy5fcm9vdCArICcvJyArIHBhdGgucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgOiBwYXRoXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZSh7fSwgJycsIHBhdGgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgcGF0aClcbiAgICB9XG4gICAgdGhpcy5fbWF0Y2gocGF0aClcbiAgfSBlbHNlIHtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eIyE/LywgJycpXG4gICAgbG9jYXRpb24uaGFzaCA9IHRoaXMuX2hhc2hiYW5nXG4gICAgICA/ICchJyArIHBhdGhcbiAgICAgIDogcGF0aFxuICB9XG59XG5cbi8qKlxuICogU3RhcnQgdGhlIHJvdXRlci5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5wLnN0YXJ0ID0gZnVuY3Rpb24gKHZtKSB7XG4gIGlmICh0aGlzLl9zdGFydGVkKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdGhpcy5fc3RhcnRlZCA9IHRydWVcbiAgdGhpcy5fdm0gPSB0aGlzLl92bSB8fCB2bVxuICBpZiAoIXRoaXMuX3ZtKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ3Z1ZS1yb3V0ZXIgbXVzdCBiZSBzdGFydGVkIHdpdGggYSByb290IFZ1ZSBpbnN0YW5jZS4nXG4gICAgKVxuICB9XG4gIGlmICh0aGlzLl9wdXNoc3RhdGUpIHtcbiAgICB0aGlzLmluaXRIaXN0b3J5TW9kZSgpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pbml0SGFzaE1vZGUoKVxuICB9XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBoYXNoIG1vZGUuXG4gKi9cblxucC5pbml0SGFzaE1vZGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB0aGlzLm9uUm91dGVDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZm9ybWF0IGhhc2hiYW5nXG4gICAgaWYgKFxuICAgICAgc2VsZi5faGFzaGJhbmcgJiZcbiAgICAgIGxvY2F0aW9uLmhhc2ggJiZcbiAgICAgIGxvY2F0aW9uLmhhc2guY2hhckF0KDEpICE9PSAnISdcbiAgICApIHtcbiAgICAgIGxvY2F0aW9uLmhhc2ggPSAnIScgKyBsb2NhdGlvbi5oYXNoLnNsaWNlKDEpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyIGhhc2ggPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoL14jIT8vLCAnJylcbiAgICB2YXIgdXJsID0gaGFzaCArIGxvY2F0aW9uLnNlYXJjaFxuICAgIHVybCA9IGRlY29kZVVSSSh1cmwpXG4gICAgc2VsZi5fbWF0Y2godXJsKVxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5vblJvdXRlQ2hhbmdlKVxuICB0aGlzLm9uUm91dGVDaGFuZ2UoKVxufVxuXG4vKipcbiAqIEluaXRpYWxpemUgSFRNTDUgaGlzdG9yeSBtb2RlLlxuICovXG5cbnAuaW5pdEhpc3RvcnlNb2RlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdGhpcy5vblJvdXRlQ2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB1cmwgPSBsb2NhdGlvbi5wYXRobmFtZSArIGxvY2F0aW9uLnNlYXJjaFxuICAgIHVybCA9IGRlY29kZVVSSSh1cmwpXG4gICAgc2VsZi5fbWF0Y2godXJsKVxuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIHRoaXMub25Sb3V0ZUNoYW5nZSlcbiAgdGhpcy5vblJvdXRlQ2hhbmdlKClcbn1cblxuLyoqXG4gKiBTdG9wIGxpc3RlbmluZyB0byByb3V0ZSBjaGFuZ2VzLlxuICovXG5cbnAuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV2ZW50ID0gdGhpcy5fcHVzaHN0YXRlXG4gICAgPyAncG9wc3RhdGUnXG4gICAgOiAnaGFzaGNoYW5nZSdcbiAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMub25Sb3V0ZUNoYW5nZSlcbiAgdGhpcy5fdm0ucm91dGUgPSBudWxsXG4gIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZVxufVxuXG4vL1xuLy8gUHJpdmF0ZSBNZXRob2RzXG4vL1xuXG4vKipcbiAqIEFkZCBhIHJvdXRlIGNvbnRhaW5pbmcgYSBsaXN0IG9mIHNlZ21lbnRzIHRvIHRoZSBpbnRlcm5hbFxuICogcm91dGUgcmVjb2duaXplci4gV2lsbCBiZSBjYWxsZWQgcmVjdXJzaXZlbHkgdG8gYWRkIGFsbFxuICogcG9zc2libGUgc3ViLXJvdXRlcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICogQHBhcmFtIHtBcnJheX0gc2VnbWVudHNcbiAqL1xucC5fYWRkUm91dGUgPSBmdW5jdGlvbiAocGF0aCwgY29uZmlnLCBzZWdtZW50cykge1xuICBzZWdtZW50cy5wdXNoKHtcbiAgICBwYXRoOiBwYXRoLFxuICAgIGhhbmRsZXI6IGNvbmZpZ1xuICB9KVxuICB0aGlzLl9yZWNvZ25pemVyLmFkZChzZWdtZW50cylcbiAgaWYgKGNvbmZpZy5zdWJSb3V0ZXMpIHtcbiAgICBmb3IgKHZhciBzdWJQYXRoIGluIGNvbmZpZy5zdWJSb3V0ZXMpIHtcbiAgICAgIC8vIHJlY3Vyc2l2ZWx5IHdhbGsgYWxsIHN1YiByb3V0ZXNcbiAgICAgIHRoaXMuX2FkZFJvdXRlKFxuICAgICAgICBzdWJQYXRoLFxuICAgICAgICBjb25maWcuc3ViUm91dGVzW3N1YlBhdGhdLFxuICAgICAgICAvLyBwYXNzIGEgY29weSBpbiByZWN1cnNpb24gdG8gYXZvaWQgbXV0YXRpbmdcbiAgICAgICAgLy8gYWNyb3NzIGJyYW5jaGVzXG4gICAgICAgIHNlZ21lbnRzLnNsaWNlKClcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNYXRjaCBhIFVSTCBwYXRoIGFuZCBzZXQgdGhlIHJvdXRlIGNvbnRleHQgb24gdm0sXG4gKiB0cmlnZ2VyaW5nIHZpZXcgdXBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICovXG5wLl9tYXRjaCA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIGlmIChwYXRoID09PSB0aGlzLl9jdXJyZW50UGF0aCkge1xuICAgIHJldHVyblxuICB9XG4gIHRoaXMuX2N1cnJlbnRQYXRoID0gcGF0aFxuICAvLyBub3JtYWxpemUgYWdhaW5zdCByb290XG4gIGlmIChcbiAgICB0aGlzLl9wdXNoc3RhdGUgJiZcbiAgICB0aGlzLl9yb290ICYmXG4gICAgcGF0aC5pbmRleE9mKHRoaXMuX3Jvb3QpID09PSAwXG4gICkge1xuICAgIHBhdGggPSBwYXRoLnNsaWNlKHRoaXMuX3Jvb3QubGVuZ3RoKVxuICB9XG4gIHZhciBtYXRjaGVkID0gdGhpcy5fcmVjb2duaXplci5yZWNvZ25pemUocGF0aClcbiAgLy8gYWdncmVnYXRlIHBhcmFtc1xuICB2YXIgcGFyYW1zXG4gIGlmIChtYXRjaGVkKSB7XG4gICAgcGFyYW1zID0gW10ucmVkdWNlLmNhbGwobWF0Y2hlZCwgZnVuY3Rpb24gKHByZXYsIGN1cikge1xuICAgICAgaWYgKGN1ci5wYXJhbXMpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGN1ci5wYXJhbXMpIHtcbiAgICAgICAgICBwcmV2W2tleV0gPSBjdXIucGFyYW1zW2tleV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHByZXZcbiAgICB9LCB7fSlcbiAgfVxuICAvLyBjb25zdHJ1Y3Qgcm91dGUgY29udGV4dFxuICB2YXIgY29udGV4dCA9IHtcbiAgICBwYXRoOiBwYXRoLFxuICAgIHBhcmFtczogcGFyYW1zLFxuICAgIHF1ZXJ5OiBtYXRjaGVkICYmIG1hdGNoZWQucXVlcnlQYXJhbXMsXG4gICAgX21hdGNoZWQ6IG1hdGNoZWQgfHwgdGhpcy5fbm90Zm91bmRIYW5kbGVyLFxuICAgIF9tYXRjaGVkQ291bnQ6IDAsXG4gICAgX3JvdXRlcjogdGhpc1xuICB9XG4gIHRoaXMuX3ZtLiRzZXQoJ3JvdXRlJywgY29udGV4dClcbn1cblxuLyoqXG4gKiBJbnN0YWxsYXRpb24gaW50ZXJmYWNlLlxuICogSW5zdGFsbCB0aGUgbmVjZXNzYXJ5IGRpcmVjdGl2ZXMuXG4gKi9cblxuVnVlUm91dGVyLmluc3RhbGwgPSBmdW5jdGlvbiAoVnVlKSB7XG4gIHJlcXVpcmUoJy4vdmlldycpKFZ1ZSlcbiAgcmVxdWlyZSgnLi9saW5rJykoVnVlKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZ1ZVJvdXRlciIsIi8vIGluc3RhbGwgdi1saW5rLCB3aGljaCBwcm92aWRlcyBuYXZpZ2F0aW9uIHN1cHBvcnQgZm9yXG4vLyBIVE1MNSBoaXN0b3J5IG1vZGVcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVnVlKSB7XG5cbiAgVnVlLmRpcmVjdGl2ZSgnbGluaycsIHtcblxuICAgIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICAgIHZhciBocmVmID0gdGhpcy5leHByZXNzaW9uXG4gICAgICBpZiAodGhpcy5lbC50YWdOYW1lID09PSAnQScpIHtcbiAgICAgICAgdGhpcy5lbC5ocmVmID0gaHJlZlxuICAgICAgfVxuICAgICAgdGhpcy5oYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHZtLnJvdXRlLl9yb3V0ZXIuZ28oaHJlZilcbiAgICAgIH1cbiAgICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZXIpXG4gICAgfSxcblxuICAgIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5lbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlcilcbiAgICB9XG5cbiAgfSlcblxufSIsIi8vIGluc3RhbGwgdGhlIHYtdmlldyBkaXJlY3RpdmVcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVnVlKSB7XG5cbiAgLy8gaW5zZXJ0IGdsb2JhbCBjc3MgdG8gbWFrZSBzdXJlIHJvdXRlci12aWV3IGhhc1xuICAvLyBkaXNwbGF5OmJsb2NrIHNvIHRoYXQgdHJhbnNpdGlvbnMgd29yayBwcm9wZXJseVxuICByZXF1aXJlKCdpbnNlcnQtY3NzJykoJ3JvdXRlci12aWV3e2Rpc3BsYXk6YmxvY2s7fScpXG5cbiAgdmFyIF8gPSBWdWUudXRpbFxuICB2YXIgY29tcG9uZW50ID0gVnVlLmRpcmVjdGl2ZSgnX2NvbXBvbmVudCcpXG4gIHZhciB0ZW1wbGF0ZVBhcnNlciA9IFZ1ZS5wYXJzZXJzLnRlbXBsYXRlXG5cbiAgLy8gdi12aWV3IGV4dGVuZHMgdi1jb21wb25lbnRcbiAgdmFyIHZpZXdEZWYgPSBfLmV4dGVuZCh7fSwgY29tcG9uZW50KVxuXG4gIC8vIHdpdGggc29tZSBvdmVycmlkZXNcbiAgXy5leHRlbmQodmlld0RlZiwge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gcmVhY3QgdG8gcm91dGUgY2hhbmdlXG4gICAgICB0aGlzLmN1cnJlbnRSb3V0ZSA9IG51bGxcbiAgICAgIHRoaXMuY3VycmVudENvbXBvbmVudElkID0gbnVsbFxuICAgICAgdGhpcy5vblJvdXRlQ2hhbmdlID0gXy5iaW5kKHRoaXMub25Sb3V0ZUNoYW5nZSwgdGhpcylcbiAgICAgIHRoaXMudW53YXRjaCA9IHRoaXMudm0uJHdhdGNoKCdyb3V0ZScsIHRoaXMub25Sb3V0ZUNoYW5nZSlcbiAgICAgIC8vIGZvcmNlIGR5bmFtaWMgZGlyZWN0aXZlIHNvIHYtY29tcG9uZW50IGRvZXNuJ3RcbiAgICAgIC8vIGF0dGVtcHQgdG8gYnVpbGQgcmlnaHQgbm93XG4gICAgICB0aGlzLl9pc0R5bmFtaWNMaXRlcmFsID0gdHJ1ZVxuICAgICAgLy8gZmluYWxseSwgaW5pdCBieSBkZWxlZ2F0aW5nIHRvIHYtY29tcG9uZW50XG4gICAgICBjb21wb25lbnQuYmluZC5jYWxsKHRoaXMpXG4gICAgICBpZiAodGhpcy52bS5yb3V0ZSkge1xuICAgICAgICB0aGlzLm9uUm91dGVDaGFuZ2UodGhpcy52bS5yb3V0ZSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Sb3V0ZUNoYW5nZTogZnVuY3Rpb24gKHJvdXRlKSB7XG4gICAgICB2YXIgcHJldmlvdXNSb3V0ZSA9IHRoaXMuY3VycmVudFJvdXRlXG4gICAgICB0aGlzLmN1cnJlbnRSb3V0ZSA9IHJvdXRlXG5cbiAgICAgIGlmICghcm91dGUuX21hdGNoZWQpIHtcbiAgICAgICAgLy8gcm91dGUgbm90IGZvdW5kLCB0aGlzIG91dGxldCBpcyBpbnZhbGlkYXRlZFxuICAgICAgICByZXR1cm4gdGhpcy5pbnZhbGlkYXRlKClcbiAgICAgIH1cblxuICAgICAgdmFyIHNlZ21lbnQgPSByb3V0ZS5fbWF0Y2hlZFtyb3V0ZS5fbWF0Y2hlZENvdW50XVxuICAgICAgaWYgKCFzZWdtZW50KSB7XG4gICAgICAgIC8vIG5vIHNlZ21lbnQgdGhhdCBtYXRjaGVzIHRoaXMgb3V0bGV0XG4gICAgICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoKVxuICAgICAgfVxuXG4gICAgICAvLyBtdXRhdGUgdGhlIHJvdXRlIGFzIHdlIHBhc3MgaXQgZnVydGhlciBkb3duIHRoZVxuICAgICAgLy8gY2hhaW4uIHRoaXMgc2VyaWVzIG9mIG11dGF0aW9uIGlzIGRvbmUgZXhhY3RseSBvbmNlXG4gICAgICAvLyBmb3IgZXZlcnkgcm91dGUgYXMgd2UgbWF0Y2ggdGhlIGNvbXBvbmVudHMgdG8gcmVuZGVyLlxuICAgICAgcm91dGUuX21hdGNoZWRDb3VudCsrXG4gICAgICAvLyB0cmlnZ2VyIGNvbXBvbmVudCBzd2l0Y2hcbiAgICAgIHZhciBoYW5kbGVyID0gc2VnbWVudC5oYW5kbGVyXG4gICAgICBpZiAoaGFuZGxlci5jb21wb25lbnQgIT09IHRoaXMuY3VycmVudENvbXBvbmVudElkIHx8XG4gICAgICAgICAgaGFuZGxlci5hbHdheXNSZWZyZXNoKSB7XG4gICAgICAgIC8vIGNhbGwgYmVmb3JlIGhvb2tcbiAgICAgICAgaWYgKGhhbmRsZXIuYmVmb3JlKSB7XG4gICAgICAgICAgdmFyIGJlZm9yZVJlc3VsdCA9IGhhbmRsZXIuYmVmb3JlKHJvdXRlLCBwcmV2aW91c1JvdXRlKVxuICAgICAgICAgIGlmIChiZWZvcmVSZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAocm91dGUuX3JvdXRlci5faGFzUHVzaFN0YXRlKSB7XG4gICAgICAgICAgICAgIGhpc3RvcnkuYmFjaygpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByZXZpb3VzUm91dGUpIHtcbiAgICAgICAgICAgICAgcm91dGUuX3JvdXRlci5nbyhwcmV2aW91c1JvdXRlLnBhdGgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdXJyZW50Q29tcG9uZW50SWQgPSBoYW5kbGVyLmNvbXBvbmVudFxuICAgICAgICAvLyBhY3R1YWxseSBzd2l0Y2ggY29tcG9uZW50XG4gICAgICAgIHRoaXMucmVhbFVwZGF0ZShoYW5kbGVyLmNvbXBvbmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIC8vIGNhbGwgYWZ0ZXIgaG9va1xuICAgICAgICAgIGlmIChoYW5kbGVyLmFmdGVyKSB7XG4gICAgICAgICAgICBoYW5kbGVyLmFmdGVyKHJvdXRlLCBwcmV2aW91c1JvdXRlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jaGlsZFZNKSB7XG4gICAgICAgIC8vIHVwZGF0ZSByb3V0ZSBjb250ZXh0XG4gICAgICAgIHRoaXMuY2hpbGRWTS5yb3V0ZSA9IHJvdXRlXG4gICAgICB9XG4gICAgfSxcblxuICAgIGludmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY3VycmVudENvbXBvbmVudElkID0gbnVsbFxuICAgICAgdGhpcy5yZWFsVXBkYXRlKG51bGwpXG4gICAgfSxcblxuICAgIC8vIGN1cnJlbnRseSBkdXBsaWNhdGluZyBzb21lIGxvZ2ljIGZyb20gdi1jb21wb25lbnRcbiAgICAvLyBUT0RPOiBtYWtlIGl0IGNsZWFuZXJcbiAgICBidWlsZDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJvdXRlID0gdGhpcy5jdXJyZW50Um91dGVcbiAgICAgIGlmICh0aGlzLmtlZXBBbGl2ZSkge1xuICAgICAgICB2YXIgY2FjaGVkID0gdGhpcy5jYWNoZVt0aGlzLmN0b3JJZF1cbiAgICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICAgIGNhY2hlZC5yb3V0ZSA9IHJvdXRlXG4gICAgICAgICAgcmV0dXJuIGNhY2hlZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgICB2YXIgZWwgPSB0ZW1wbGF0ZVBhcnNlci5jbG9uZSh0aGlzLmVsKVxuICAgICAgaWYgKHRoaXMuQ3Rvcikge1xuICAgICAgICB2YXIgY2hpbGQgPSB2bS4kYWRkQ2hpbGQoe1xuICAgICAgICAgIGVsOiBlbCxcbiAgICAgICAgICB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSxcbiAgICAgICAgICBfYXNDb21wb25lbnQ6IHRydWUsXG4gICAgICAgICAgX2hvc3Q6IHRoaXMuX2hvc3QsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcm91dGU6IHJvdXRlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLkN0b3IpXG4gICAgICAgIGlmICh0aGlzLmtlZXBBbGl2ZSkge1xuICAgICAgICAgIHRoaXMuY2FjaGVbdGhpcy5jdG9ySWRdID0gY2hpbGRcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hpbGRcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnVud2F0Y2goKVxuICAgICAgY29tcG9uZW50LnVuYmluZC5jYWxsKHRoaXMpXG4gICAgfVxuXG4gIH0pXG5cbiAgVnVlLmVsZW1lbnREaXJlY3RpdmUoJ3JvdXRlci12aWV3Jywgdmlld0RlZilcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIENyZWF0ZSBhIGNoaWxkIGluc3RhbmNlIHRoYXQgcHJvdG90eXBhbGx5IGluZWhyaXRzXG4gKiBkYXRhIG9uIHBhcmVudC4gVG8gYWNoaWV2ZSB0aGF0IHdlIGNyZWF0ZSBhbiBpbnRlcm1lZGlhdGVcbiAqIGNvbnN0cnVjdG9yIHdpdGggaXRzIHByb3RvdHlwZSBwb2ludGluZyB0byBwYXJlbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtCYXNlQ3Rvcl1cbiAqIEByZXR1cm4ge1Z1ZX1cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLiRhZGRDaGlsZCA9IGZ1bmN0aW9uIChvcHRzLCBCYXNlQ3Rvcikge1xuICBCYXNlQ3RvciA9IEJhc2VDdG9yIHx8IF8uVnVlXG4gIG9wdHMgPSBvcHRzIHx8IHt9XG4gIHZhciBwYXJlbnQgPSB0aGlzXG4gIHZhciBDaGlsZFZ1ZVxuICB2YXIgaW5oZXJpdCA9IG9wdHMuaW5oZXJpdCAhPT0gdW5kZWZpbmVkXG4gICAgPyBvcHRzLmluaGVyaXRcbiAgICA6IEJhc2VDdG9yLm9wdGlvbnMuaW5oZXJpdFxuICBpZiAoaW5oZXJpdCkge1xuICAgIHZhciBjdG9ycyA9IHBhcmVudC5fY2hpbGRDdG9yc1xuICAgIENoaWxkVnVlID0gY3RvcnNbQmFzZUN0b3IuY2lkXVxuICAgIGlmICghQ2hpbGRWdWUpIHtcbiAgICAgIHZhciBvcHRpb25OYW1lID0gQmFzZUN0b3Iub3B0aW9ucy5uYW1lXG4gICAgICB2YXIgY2xhc3NOYW1lID0gb3B0aW9uTmFtZVxuICAgICAgICA/IF8uY2xhc3NpZnkob3B0aW9uTmFtZSlcbiAgICAgICAgOiAnVnVlQ29tcG9uZW50J1xuICAgICAgQ2hpbGRWdWUgPSBuZXcgRnVuY3Rpb24oXG4gICAgICAgICdyZXR1cm4gZnVuY3Rpb24gJyArIGNsYXNzTmFtZSArICcgKG9wdGlvbnMpIHsnICtcbiAgICAgICAgJ3RoaXMuY29uc3RydWN0b3IgPSAnICsgY2xhc3NOYW1lICsgJzsnICtcbiAgICAgICAgJ3RoaXMuX2luaXQob3B0aW9ucykgfSdcbiAgICAgICkoKVxuICAgICAgQ2hpbGRWdWUub3B0aW9ucyA9IEJhc2VDdG9yLm9wdGlvbnNcbiAgICAgIENoaWxkVnVlLnByb3RvdHlwZSA9IHRoaXNcbiAgICAgIGN0b3JzW0Jhc2VDdG9yLmNpZF0gPSBDaGlsZFZ1ZVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBDaGlsZFZ1ZSA9IEJhc2VDdG9yXG4gIH1cbiAgb3B0cy5fcGFyZW50ID0gcGFyZW50XG4gIG9wdHMuX3Jvb3QgPSBwYXJlbnQuJHJvb3RcbiAgdmFyIGNoaWxkID0gbmV3IENoaWxkVnVlKG9wdHMpXG4gIHJldHVybiBjaGlsZFxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4uL3dhdGNoZXInKVxudmFyIFBhdGggPSByZXF1aXJlKCcuLi9wYXJzZXJzL3BhdGgnKVxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKVxudmFyIGRpclBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZGlyZWN0aXZlJylcbnZhciBleHBQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxudmFyIGZpbHRlclJFID0gL1tefF1cXHxbXnxdL1xuXG4vKipcbiAqIEdldCB0aGUgdmFsdWUgZnJvbSBhbiBleHByZXNzaW9uIG9uIHRoaXMgdm0uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHJldHVybiB7Kn1cbiAqL1xuXG5leHBvcnRzLiRnZXQgPSBmdW5jdGlvbiAoZXhwKSB7XG4gIHZhciByZXMgPSBleHBQYXJzZXIucGFyc2UoZXhwKVxuICBpZiAocmVzKSB7XG4gICAgcmV0dXJuIHJlcy5nZXQuY2FsbCh0aGlzLCB0aGlzKVxuICB9XG59XG5cbi8qKlxuICogU2V0IHRoZSB2YWx1ZSBmcm9tIGFuIGV4cHJlc3Npb24gb24gdGhpcyB2bS5cbiAqIFRoZSBleHByZXNzaW9uIG11c3QgYmUgYSB2YWxpZCBsZWZ0LWhhbmRcbiAqIGV4cHJlc3Npb24gaW4gYW4gYXNzaWdubWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbmV4cG9ydHMuJHNldCA9IGZ1bmN0aW9uIChleHAsIHZhbCkge1xuICB2YXIgcmVzID0gZXhwUGFyc2VyLnBhcnNlKGV4cCwgdHJ1ZSlcbiAgaWYgKHJlcyAmJiByZXMuc2V0KSB7XG4gICAgcmVzLnNldC5jYWxsKHRoaXMsIHRoaXMsIHZhbClcbiAgfVxufVxuXG4vKipcbiAqIEFkZCBhIHByb3BlcnR5IG9uIHRoZSBWTVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZXhwb3J0cy4kYWRkID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gIHRoaXMuX2RhdGEuJGFkZChrZXksIHZhbClcbn1cblxuLyoqXG4gKiBEZWxldGUgYSBwcm9wZXJ0eSBvbiB0aGUgVk1cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKi9cblxuZXhwb3J0cy4kZGVsZXRlID0gZnVuY3Rpb24gKGtleSkge1xuICB0aGlzLl9kYXRhLiRkZWxldGUoa2V5KVxufVxuXG4vKipcbiAqIFdhdGNoIGFuIGV4cHJlc3Npb24sIHRyaWdnZXIgY2FsbGJhY2sgd2hlbiBpdHNcbiAqIHZhbHVlIGNoYW5nZXMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2RlZXBdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpbW1lZGlhdGVdXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSB1bndhdGNoRm5cbiAqL1xuXG5leHBvcnRzLiR3YXRjaCA9IGZ1bmN0aW9uIChleHAsIGNiLCBkZWVwLCBpbW1lZGlhdGUpIHtcbiAgdmFyIHZtID0gdGhpc1xuICB2YXIga2V5ID0gZGVlcCA/IGV4cCArICcqKmRlZXAqKicgOiBleHBcbiAgdmFyIHdhdGNoZXIgPSB2bS5fdXNlcldhdGNoZXJzW2tleV1cbiAgdmFyIHdyYXBwZWRDYiA9IGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xuICAgIGNiLmNhbGwodm0sIHZhbCwgb2xkVmFsKVxuICB9XG4gIGlmICghd2F0Y2hlcikge1xuICAgIHdhdGNoZXIgPSB2bS5fdXNlcldhdGNoZXJzW2tleV0gPVxuICAgICAgbmV3IFdhdGNoZXIodm0sIGV4cCwgd3JhcHBlZENiLCB7XG4gICAgICAgIGRlZXA6IGRlZXAsXG4gICAgICAgIHVzZXI6IHRydWVcbiAgICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgd2F0Y2hlci5hZGRDYih3cmFwcGVkQ2IpXG4gIH1cbiAgaWYgKGltbWVkaWF0ZSkge1xuICAgIHdyYXBwZWRDYih3YXRjaGVyLnZhbHVlKVxuICB9XG4gIHJldHVybiBmdW5jdGlvbiB1bndhdGNoRm4gKCkge1xuICAgIHdhdGNoZXIucmVtb3ZlQ2Iod3JhcHBlZENiKVxuICAgIGlmICghd2F0Y2hlci5hY3RpdmUpIHtcbiAgICAgIHZtLl91c2VyV2F0Y2hlcnNba2V5XSA9IG51bGxcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSBhIHRleHQgZGlyZWN0aXZlLCBpbmNsdWRpbmcgZmlsdGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMuJGV2YWwgPSBmdW5jdGlvbiAodGV4dCkge1xuICAvLyBjaGVjayBmb3IgZmlsdGVycy5cbiAgaWYgKGZpbHRlclJFLnRlc3QodGV4dCkpIHtcbiAgICB2YXIgZGlyID0gZGlyUGFyc2VyLnBhcnNlKHRleHQpWzBdXG4gICAgLy8gdGhlIGZpbHRlciByZWdleCBjaGVjayBtaWdodCBnaXZlIGZhbHNlIHBvc2l0aXZlXG4gICAgLy8gZm9yIHBpcGVzIGluc2lkZSBzdHJpbmdzLCBzbyBpdCdzIHBvc3NpYmxlIHRoYXRcbiAgICAvLyB3ZSBkb24ndCBnZXQgYW55IGZpbHRlcnMgaGVyZVxuICAgIHJldHVybiBkaXIuZmlsdGVyc1xuICAgICAgPyBfLmFwcGx5RmlsdGVycyhcbiAgICAgICAgICB0aGlzLiRnZXQoZGlyLmV4cHJlc3Npb24pLFxuICAgICAgICAgIF8ucmVzb2x2ZUZpbHRlcnModGhpcywgZGlyLmZpbHRlcnMpLnJlYWQsXG4gICAgICAgICAgdGhpc1xuICAgICAgICApXG4gICAgICA6IHRoaXMuJGdldChkaXIuZXhwcmVzc2lvbilcbiAgfSBlbHNlIHtcbiAgICAvLyBubyBmaWx0ZXJcbiAgICByZXR1cm4gdGhpcy4kZ2V0KHRleHQpXG4gIH1cbn1cblxuLyoqXG4gKiBJbnRlcnBvbGF0ZSBhIHBpZWNlIG9mIHRlbXBsYXRlIHRleHQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLiRpbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKHRleHQpXG4gIHZhciB2bSA9IHRoaXNcbiAgaWYgKHRva2Vucykge1xuICAgIHJldHVybiB0b2tlbnMubGVuZ3RoID09PSAxXG4gICAgICA/IHZtLiRldmFsKHRva2Vuc1swXS52YWx1ZSlcbiAgICAgIDogdG9rZW5zLm1hcChmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICByZXR1cm4gdG9rZW4udGFnXG4gICAgICAgICAgICA/IHZtLiRldmFsKHRva2VuLnZhbHVlKVxuICAgICAgICAgICAgOiB0b2tlbi52YWx1ZVxuICAgICAgICB9KS5qb2luKCcnKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB0ZXh0XG4gIH1cbn1cblxuLyoqXG4gKiBMb2cgaW5zdGFuY2UgZGF0YSBhcyBhIHBsYWluIEpTIG9iamVjdFxuICogc28gdGhhdCBpdCBpcyBlYXNpZXIgdG8gaW5zcGVjdCBpbiBjb25zb2xlLlxuICogVGhpcyBtZXRob2QgYXNzdW1lcyBjb25zb2xlIGlzIGF2YWlsYWJsZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gW3BhdGhdXG4gKi9cblxuZXhwb3J0cy4kbG9nID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIGRhdGEgPSBwYXRoXG4gICAgPyBQYXRoLmdldCh0aGlzLl9kYXRhLCBwYXRoKVxuICAgIDogdGhpcy5fZGF0YVxuICBpZiAoZGF0YSkge1xuICAgIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICB9XG4gIGNvbnNvbGUubG9nKGRhdGEpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpXG5cbi8qKlxuICogQXBwZW5kIGluc3RhbmNlIHRvIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gKi9cblxuZXhwb3J0cy4kYXBwZW5kVG8gPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgcmV0dXJuIGluc2VydChcbiAgICB0aGlzLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbixcbiAgICBhcHBlbmQsIHRyYW5zaXRpb24uYXBwZW5kXG4gIClcbn1cblxuLyoqXG4gKiBQcmVwZW5kIGluc3RhbmNlIHRvIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFt3aXRoVHJhbnNpdGlvbl0gLSBkZWZhdWx0cyB0byB0cnVlXG4gKi9cblxuZXhwb3J0cy4kcHJlcGVuZFRvID0gZnVuY3Rpb24gKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgaWYgKHRhcmdldC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICB0aGlzLiRiZWZvcmUodGFyZ2V0LmZpcnN0Q2hpbGQsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfSBlbHNlIHtcbiAgICB0aGlzLiRhcHBlbmRUbyh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIEluc2VydCBpbnN0YW5jZSBiZWZvcmUgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRiZWZvcmUgPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgcmV0dXJuIGluc2VydChcbiAgICB0aGlzLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbixcbiAgICBiZWZvcmUsIHRyYW5zaXRpb24uYmVmb3JlXG4gIClcbn1cblxuLyoqXG4gKiBJbnNlcnQgaW5zdGFuY2UgYWZ0ZXIgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRhZnRlciA9IGZ1bmN0aW9uICh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbikge1xuICB0YXJnZXQgPSBxdWVyeSh0YXJnZXQpXG4gIGlmICh0YXJnZXQubmV4dFNpYmxpbmcpIHtcbiAgICB0aGlzLiRiZWZvcmUodGFyZ2V0Lm5leHRTaWJsaW5nLCBjYiwgd2l0aFRyYW5zaXRpb24pXG4gIH0gZWxzZSB7XG4gICAgdGhpcy4kYXBwZW5kVG8odGFyZ2V0LnBhcmVudE5vZGUsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlbW92ZSBpbnN0YW5jZSBmcm9tIERPTVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRyZW1vdmUgPSBmdW5jdGlvbiAoY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHZhciBpbkRvYyA9IHRoaXMuX2lzQXR0YWNoZWQgJiYgXy5pbkRvYyh0aGlzLiRlbClcbiAgLy8gaWYgd2UgYXJlIG5vdCBpbiBkb2N1bWVudCwgbm8gbmVlZCB0byBjaGVja1xuICAvLyBmb3IgdHJhbnNpdGlvbnNcbiAgaWYgKCFpbkRvYykgd2l0aFRyYW5zaXRpb24gPSBmYWxzZVxuICB2YXIgb3BcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciByZWFsQ2IgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGluRG9jKSBzZWxmLl9jYWxsSG9vaygnZGV0YWNoZWQnKVxuICAgIGlmIChjYikgY2IoKVxuICB9XG4gIGlmIChcbiAgICB0aGlzLl9pc0Jsb2NrICYmXG4gICAgIXRoaXMuX2Jsb2NrRnJhZ21lbnQuaGFzQ2hpbGROb2RlcygpXG4gICkge1xuICAgIG9wID0gd2l0aFRyYW5zaXRpb24gPT09IGZhbHNlXG4gICAgICA/IGFwcGVuZFxuICAgICAgOiB0cmFuc2l0aW9uLnJlbW92ZVRoZW5BcHBlbmRcbiAgICBibG9ja09wKHRoaXMsIHRoaXMuX2Jsb2NrRnJhZ21lbnQsIG9wLCByZWFsQ2IpXG4gIH0gZWxzZSB7XG4gICAgb3AgPSB3aXRoVHJhbnNpdGlvbiA9PT0gZmFsc2VcbiAgICAgID8gcmVtb3ZlXG4gICAgICA6IHRyYW5zaXRpb24ucmVtb3ZlXG4gICAgb3AodGhpcy4kZWwsIHRoaXMsIHJlYWxDYilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFNoYXJlZCBET00gaW5zZXJ0aW9uIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AxIC0gb3AgZm9yIG5vbi10cmFuc2l0aW9uIGluc2VydFxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AyIC0gb3AgZm9yIHRyYW5zaXRpb24gaW5zZXJ0XG4gKiBAcmV0dXJuIHZtXG4gKi9cblxuZnVuY3Rpb24gaW5zZXJ0ICh2bSwgdGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24sIG9wMSwgb3AyKSB7XG4gIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgdmFyIHRhcmdldElzRGV0YWNoZWQgPSAhXy5pbkRvYyh0YXJnZXQpXG4gIHZhciBvcCA9IHdpdGhUcmFuc2l0aW9uID09PSBmYWxzZSB8fCB0YXJnZXRJc0RldGFjaGVkXG4gICAgPyBvcDFcbiAgICA6IG9wMlxuICB2YXIgc2hvdWxkQ2FsbEhvb2sgPVxuICAgICF0YXJnZXRJc0RldGFjaGVkICYmXG4gICAgIXZtLl9pc0F0dGFjaGVkICYmXG4gICAgIV8uaW5Eb2Modm0uJGVsKVxuICBpZiAodm0uX2lzQmxvY2spIHtcbiAgICBibG9ja09wKHZtLCB0YXJnZXQsIG9wLCBjYilcbiAgfSBlbHNlIHtcbiAgICBvcCh2bS4kZWwsIHRhcmdldCwgdm0sIGNiKVxuICB9XG4gIGlmIChzaG91bGRDYWxsSG9vaykge1xuICAgIHZtLl9jYWxsSG9vaygnYXR0YWNoZWQnKVxuICB9XG4gIHJldHVybiB2bVxufVxuXG4vKipcbiAqIEV4ZWN1dGUgYSB0cmFuc2l0aW9uIG9wZXJhdGlvbiBvbiBhIGJsb2NrIGluc3RhbmNlLFxuICogaXRlcmF0aW5nIHRocm91Z2ggYWxsIGl0cyBibG9jayBub2Rlcy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Tm9kZX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5mdW5jdGlvbiBibG9ja09wICh2bSwgdGFyZ2V0LCBvcCwgY2IpIHtcbiAgdmFyIGN1cnJlbnQgPSB2bS5fYmxvY2tTdGFydFxuICB2YXIgZW5kID0gdm0uX2Jsb2NrRW5kXG4gIHZhciBuZXh0XG4gIHdoaWxlIChuZXh0ICE9PSBlbmQpIHtcbiAgICBuZXh0ID0gY3VycmVudC5uZXh0U2libGluZ1xuICAgIG9wKGN1cnJlbnQsIHRhcmdldCwgdm0pXG4gICAgY3VycmVudCA9IG5leHRcbiAgfVxuICBvcChlbmQsIHRhcmdldCwgdm0sIGNiKVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBzZWxlY3RvcnNcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbFxuICovXG5cbmZ1bmN0aW9uIHF1ZXJ5IChlbCkge1xuICByZXR1cm4gdHlwZW9mIGVsID09PSAnc3RyaW5nJ1xuICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbClcbiAgICA6IGVsXG59XG5cbi8qKlxuICogQXBwZW5kIG9wZXJhdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmZ1bmN0aW9uIGFwcGVuZCAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgaWYgKGNiKSBjYigpXG59XG5cbi8qKlxuICogSW5zZXJ0QmVmb3JlIG9wZXJhdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmZ1bmN0aW9uIGJlZm9yZSAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIF8uYmVmb3JlKGVsLCB0YXJnZXQpXG4gIGlmIChjYikgY2IoKVxufVxuXG4vKipcbiAqIFJlbW92ZSBvcGVyYXRpb24gdGhhdCB0YWtlcyBhIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHVudXNlZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbmZ1bmN0aW9uIHJlbW92ZSAoZWwsIHZtLCBjYikge1xuICBfLnJlbW92ZShlbClcbiAgaWYgKGNiKSBjYigpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxuLyoqXG4gKiBMaXN0ZW4gb24gdGhlIGdpdmVuIGBldmVudGAgd2l0aCBgZm5gLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuXG5leHBvcnRzLiRvbiA9IGZ1bmN0aW9uIChldmVudCwgZm4pIHtcbiAgKHRoaXMuX2V2ZW50c1tldmVudF0gfHwgKHRoaXMuX2V2ZW50c1tldmVudF0gPSBbXSkpXG4gICAgLnB1c2goZm4pXG4gIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIDEpXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuXG5leHBvcnRzLiRvbmNlID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgZnVuY3Rpb24gb24gKCkge1xuICAgIHNlbGYuJG9mZihldmVudCwgb24pXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG4gIG9uLmZuID0gZm5cbiAgdGhpcy4kb24oZXZlbnQsIG9uKVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cblxuZXhwb3J0cy4kb2ZmID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICB2YXIgY2JzXG4gIC8vIGFsbFxuICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBpZiAodGhpcy4kcGFyZW50KSB7XG4gICAgICBmb3IgKGV2ZW50IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgICBjYnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdXG4gICAgICAgIGlmIChjYnMpIHtcbiAgICAgICAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtY2JzLmxlbmd0aClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9ldmVudHMgPSB7fVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgY2JzID0gdGhpcy5fZXZlbnRzW2V2ZW50XVxuICBpZiAoIWNicykge1xuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtY2JzLmxlbmd0aClcbiAgICB0aGlzLl9ldmVudHNbZXZlbnRdID0gbnVsbFxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgLy8gc3BlY2lmaWMgaGFuZGxlclxuICB2YXIgY2JcbiAgdmFyIGkgPSBjYnMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBjYiA9IGNic1tpXVxuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBtb2RpZnlMaXN0ZW5lckNvdW50KHRoaXMsIGV2ZW50LCAtMSlcbiAgICAgIGNicy5zcGxpY2UoaSwgMSlcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogVHJpZ2dlciBhbiBldmVudCBvbiBzZWxmLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICovXG5cbmV4cG9ydHMuJGVtaXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgdGhpcy5fZXZlbnRDYW5jZWxsZWQgPSBmYWxzZVxuICB2YXIgY2JzID0gdGhpcy5fZXZlbnRzW2V2ZW50XVxuICBpZiAoY2JzKSB7XG4gICAgLy8gYXZvaWQgbGVha2luZyBhcmd1bWVudHM6XG4gICAgLy8gaHR0cDovL2pzcGVyZi5jb20vY2xvc3VyZS13aXRoLWFyZ3VtZW50c1xuICAgIHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDFcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShpKVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdXG4gICAgfVxuICAgIGkgPSAwXG4gICAgY2JzID0gY2JzLmxlbmd0aCA+IDFcbiAgICAgID8gXy50b0FycmF5KGNicylcbiAgICAgIDogY2JzXG4gICAgZm9yICh2YXIgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChjYnNbaV0uYXBwbHkodGhpcywgYXJncykgPT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50Q2FuY2VsbGVkID0gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGJyb2FkY2FzdCBhbiBldmVudCB0byBhbGwgY2hpbGRyZW4gaW5zdGFuY2VzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHsuLi4qfSBhZGRpdGlvbmFsIGFyZ3VtZW50c1xuICovXG5cbmV4cG9ydHMuJGJyb2FkY2FzdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAvLyBpZiBubyBjaGlsZCBoYXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyBldmVudCxcbiAgLy8gdGhlbiB0aGVyZSdzIG5vIG5lZWQgdG8gYnJvYWRjYXN0LlxuICBpZiAoIXRoaXMuX2V2ZW50c0NvdW50W2V2ZW50XSkgcmV0dXJuXG4gIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICBjaGlsZC4kZW1pdC5hcHBseShjaGlsZCwgYXJndW1lbnRzKVxuICAgIGlmICghY2hpbGQuX2V2ZW50Q2FuY2VsbGVkKSB7XG4gICAgICBjaGlsZC4kYnJvYWRjYXN0LmFwcGx5KGNoaWxkLCBhcmd1bWVudHMpXG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgcHJvcGFnYXRlIGFuIGV2ZW50IHVwIHRoZSBwYXJlbnQgY2hhaW4uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0gey4uLip9IGFkZGl0aW9uYWwgYXJndW1lbnRzXG4gKi9cblxuZXhwb3J0cy4kZGlzcGF0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwYXJlbnQgPSB0aGlzLiRwYXJlbnRcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC4kZW1pdC5hcHBseShwYXJlbnQsIGFyZ3VtZW50cylcbiAgICBwYXJlbnQgPSBwYXJlbnQuX2V2ZW50Q2FuY2VsbGVkXG4gICAgICA/IG51bGxcbiAgICAgIDogcGFyZW50LiRwYXJlbnRcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIE1vZGlmeSB0aGUgbGlzdGVuZXIgY291bnRzIG9uIGFsbCBwYXJlbnRzLlxuICogVGhpcyBib29ra2VlcGluZyBhbGxvd3MgJGJyb2FkY2FzdCB0byByZXR1cm4gZWFybHkgd2hlblxuICogbm8gY2hpbGQgaGFzIGxpc3RlbmVkIHRvIGEgY2VydGFpbiBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50XG4gKi9cblxudmFyIGhvb2tSRSA9IC9eaG9vazovXG5mdW5jdGlvbiBtb2RpZnlMaXN0ZW5lckNvdW50ICh2bSwgZXZlbnQsIGNvdW50KSB7XG4gIHZhciBwYXJlbnQgPSB2bS4kcGFyZW50XG4gIC8vIGhvb2tzIGRvIG5vdCBnZXQgYnJvYWRjYXN0ZWQgc28gbm8gbmVlZFxuICAvLyB0byBkbyBib29ra2VlcGluZyBmb3IgdGhlbVxuICBpZiAoIXBhcmVudCB8fCAhY291bnQgfHwgaG9va1JFLnRlc3QoZXZlbnQpKSByZXR1cm5cbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC5fZXZlbnRzQ291bnRbZXZlbnRdID1cbiAgICAgIChwYXJlbnQuX2V2ZW50c0NvdW50W2V2ZW50XSB8fCAwKSArIGNvdW50XG4gICAgcGFyZW50ID0gcGFyZW50LiRwYXJlbnRcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgbWVyZ2VPcHRpb25zID0gcmVxdWlyZSgnLi4vdXRpbC9tZXJnZS1vcHRpb24nKVxuXG4vKipcbiAqIEV4cG9zZSB1c2VmdWwgaW50ZXJuYWxzXG4gKi9cblxuZXhwb3J0cy51dGlsID0gX1xuZXhwb3J0cy5uZXh0VGljayA9IF8ubmV4dFRpY2tcbmV4cG9ydHMuY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxuZXhwb3J0cy5jb21waWxlciA9IHtcbiAgY29tcGlsZTogcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpLFxuICB0cmFuc2NsdWRlOiByZXF1aXJlKCcuLi9jb21waWxlci90cmFuc2NsdWRlJylcbn1cblxuZXhwb3J0cy5wYXJzZXJzID0ge1xuICBwYXRoOiByZXF1aXJlKCcuLi9wYXJzZXJzL3BhdGgnKSxcbiAgdGV4dDogcmVxdWlyZSgnLi4vcGFyc2Vycy90ZXh0JyksXG4gIHRlbXBsYXRlOiByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJyksXG4gIGRpcmVjdGl2ZTogcmVxdWlyZSgnLi4vcGFyc2Vycy9kaXJlY3RpdmUnKSxcbiAgZXhwcmVzc2lvbjogcmVxdWlyZSgnLi4vcGFyc2Vycy9leHByZXNzaW9uJylcbn1cblxuLyoqXG4gKiBFYWNoIGluc3RhbmNlIGNvbnN0cnVjdG9yLCBpbmNsdWRpbmcgVnVlLCBoYXMgYSB1bmlxdWVcbiAqIGNpZC4gVGhpcyBlbmFibGVzIHVzIHRvIGNyZWF0ZSB3cmFwcGVkIFwiY2hpbGRcbiAqIGNvbnN0cnVjdG9yc1wiIGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlIGFuZCBjYWNoZSB0aGVtLlxuICovXG5cbmV4cG9ydHMuY2lkID0gMFxudmFyIGNpZCA9IDFcblxuLyoqXG4gKiBDbGFzcyBpbmVocml0YW5jZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBleHRlbmRPcHRpb25zXG4gKi9cblxuZXhwb3J0cy5leHRlbmQgPSBmdW5jdGlvbiAoZXh0ZW5kT3B0aW9ucykge1xuICBleHRlbmRPcHRpb25zID0gZXh0ZW5kT3B0aW9ucyB8fCB7fVxuICB2YXIgU3VwZXIgPSB0aGlzXG4gIHZhciBTdWIgPSBjcmVhdGVDbGFzcyhcbiAgICBleHRlbmRPcHRpb25zLm5hbWUgfHxcbiAgICBTdXBlci5vcHRpb25zLm5hbWUgfHxcbiAgICAnVnVlQ29tcG9uZW50J1xuICApXG4gIFN1Yi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFN1cGVyLnByb3RvdHlwZSlcbiAgU3ViLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN1YlxuICBTdWIuY2lkID0gY2lkKytcbiAgU3ViLm9wdGlvbnMgPSBtZXJnZU9wdGlvbnMoXG4gICAgU3VwZXIub3B0aW9ucyxcbiAgICBleHRlbmRPcHRpb25zXG4gIClcbiAgU3ViWydzdXBlciddID0gU3VwZXJcbiAgLy8gYWxsb3cgZnVydGhlciBleHRlbnNpb25cbiAgU3ViLmV4dGVuZCA9IFN1cGVyLmV4dGVuZFxuICAvLyBjcmVhdGUgYXNzZXQgcmVnaXN0ZXJzLCBzbyBleHRlbmRlZCBjbGFzc2VzXG4gIC8vIGNhbiBoYXZlIHRoZWlyIHByaXZhdGUgYXNzZXRzIHRvby5cbiAgY3JlYXRlQXNzZXRSZWdpc3RlcnMoU3ViKVxuICByZXR1cm4gU3ViXG59XG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBzdWItY2xhc3MgY29uc3RydWN0b3Igd2l0aCB0aGVcbiAqIGdpdmVuIG5hbWUuIFRoaXMgZ2l2ZXMgdXMgbXVjaCBuaWNlciBvdXRwdXQgd2hlblxuICogbG9nZ2luZyBpbnN0YW5jZXMgaW4gdGhlIGNvbnNvbGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNyZWF0ZUNsYXNzIChuYW1lKSB7XG4gIHJldHVybiBuZXcgRnVuY3Rpb24oXG4gICAgJ3JldHVybiBmdW5jdGlvbiAnICsgXy5jbGFzc2lmeShuYW1lKSArXG4gICAgJyAob3B0aW9ucykgeyB0aGlzLl9pbml0KG9wdGlvbnMpIH0nXG4gICkoKVxufVxuXG4vKipcbiAqIFBsdWdpbiBzeXN0ZW1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcGx1Z2luXG4gKi9cblxuZXhwb3J0cy51c2UgPSBmdW5jdGlvbiAocGx1Z2luKSB7XG4gIC8vIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICB2YXIgYXJncyA9IF8udG9BcnJheShhcmd1bWVudHMsIDEpXG4gIGFyZ3MudW5zaGlmdCh0aGlzKVxuICBpZiAodHlwZW9mIHBsdWdpbi5pbnN0YWxsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcGx1Z2luLmluc3RhbGwuYXBwbHkocGx1Z2luLCBhcmdzKVxuICB9IGVsc2Uge1xuICAgIHBsdWdpbi5hcHBseShudWxsLCBhcmdzKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogRGVmaW5lIGFzc2V0IHJlZ2lzdHJhdGlvbiBtZXRob2RzIG9uIGEgY29uc3RydWN0b3IuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ29uc3RydWN0b3JcbiAqL1xuXG52YXIgYXNzZXRUeXBlcyA9IFtcbiAgJ2RpcmVjdGl2ZScsXG4gICdlbGVtZW50RGlyZWN0aXZlJyxcbiAgJ2ZpbHRlcicsXG4gICd0cmFuc2l0aW9uJ1xuXVxuXG5mdW5jdGlvbiBjcmVhdGVBc3NldFJlZ2lzdGVycyAoQ29uc3RydWN0b3IpIHtcblxuICAvKiBBc3NldCByZWdpc3RyYXRpb24gbWV0aG9kcyBzaGFyZSB0aGUgc2FtZSBzaWduYXR1cmU6XG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZFxuICAgKiBAcGFyYW0geyp9IGRlZmluaXRpb25cbiAgICovXG5cbiAgYXNzZXRUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgQ29uc3RydWN0b3JbdHlwZV0gPSBmdW5jdGlvbiAoaWQsIGRlZmluaXRpb24pIHtcbiAgICAgIGlmICghZGVmaW5pdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcHRpb25zW3R5cGUgKyAncyddW2lkXSA9IGRlZmluaXRpb25cbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgLyoqXG4gICAqIENvbXBvbmVudCByZWdpc3RyYXRpb24gbmVlZHMgdG8gYXV0b21hdGljYWxseSBpbnZva2VcbiAgICogVnVlLmV4dGVuZCBvbiBvYmplY3QgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWRcbiAgICogQHBhcmFtIHtPYmplY3R8RnVuY3Rpb259IGRlZmluaXRpb25cbiAgICovXG5cbiAgQ29uc3RydWN0b3IuY29tcG9uZW50ID0gZnVuY3Rpb24gKGlkLCBkZWZpbml0aW9uKSB7XG4gICAgaWYgKCFkZWZpbml0aW9uKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbXBvbmVudHNbaWRdXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChfLmlzUGxhaW5PYmplY3QoZGVmaW5pdGlvbikpIHtcbiAgICAgICAgZGVmaW5pdGlvbi5uYW1lID0gaWRcbiAgICAgICAgZGVmaW5pdGlvbiA9IF8uVnVlLmV4dGVuZChkZWZpbml0aW9uKVxuICAgICAgfVxuICAgICAgdGhpcy5vcHRpb25zLmNvbXBvbmVudHNbaWRdID0gZGVmaW5pdGlvblxuICAgIH1cbiAgfVxufVxuXG5jcmVhdGVBc3NldFJlZ2lzdGVycyhleHBvcnRzKSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgY29tcGlsZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL2NvbXBpbGUnKVxuXG4vKipcbiAqIFNldCBpbnN0YW5jZSB0YXJnZXQgZWxlbWVudCBhbmQga2ljayBvZmYgdGhlIGNvbXBpbGF0aW9uXG4gKiBwcm9jZXNzLiBUaGUgcGFzc2VkIGluIGBlbGAgY2FuIGJlIGEgc2VsZWN0b3Igc3RyaW5nLCBhblxuICogZXhpc3RpbmcgRWxlbWVudCwgb3IgYSBEb2N1bWVudEZyYWdtZW50IChmb3IgYmxvY2tcbiAqIGluc3RhbmNlcykuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR8c3RyaW5nfSBlbFxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuJG1vdW50ID0gZnVuY3Rpb24gKGVsKSB7XG4gIGlmICh0aGlzLl9pc0NvbXBpbGVkKSB7XG4gICAgXy53YXJuKCckbW91bnQoKSBzaG91bGQgYmUgY2FsbGVkIG9ubHkgb25jZS4nKVxuICAgIHJldHVyblxuICB9XG4gIGlmICghZWwpIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIH0gZWxzZSBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzZWxlY3RvciA9IGVsXG4gICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKVxuICAgIGlmICghZWwpIHtcbiAgICAgIF8ud2FybignQ2Fubm90IGZpbmQgZWxlbWVudDogJyArIHNlbGVjdG9yKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICB9XG4gIHRoaXMuX2NvbXBpbGUoZWwpXG4gIHRoaXMuX2lzQ29tcGlsZWQgPSB0cnVlXG4gIHRoaXMuX2NhbGxIb29rKCdjb21waWxlZCcpXG4gIGlmIChfLmluRG9jKHRoaXMuJGVsKSkge1xuICAgIHRoaXMuX2NhbGxIb29rKCdhdHRhY2hlZCcpXG4gICAgdGhpcy5faW5pdERPTUhvb2tzKClcbiAgICByZWFkeS5jYWxsKHRoaXMpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5faW5pdERPTUhvb2tzKClcbiAgICB0aGlzLiRvbmNlKCdob29rOmF0dGFjaGVkJywgcmVhZHkpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBNYXJrIGFuIGluc3RhbmNlIGFzIHJlYWR5LlxuICovXG5cbmZ1bmN0aW9uIHJlYWR5ICgpIHtcbiAgdGhpcy5faXNBdHRhY2hlZCA9IHRydWVcbiAgdGhpcy5faXNSZWFkeSA9IHRydWVcbiAgdGhpcy5fY2FsbEhvb2soJ3JlYWR5Jylcbn1cblxuLyoqXG4gKiBUZWFyZG93biB0aGUgaW5zdGFuY2UsIHNpbXBseSBkZWxlZ2F0ZSB0byB0aGUgaW50ZXJuYWxcbiAqIF9kZXN0cm95LlxuICovXG5cbmV4cG9ydHMuJGRlc3Ryb3kgPSBmdW5jdGlvbiAocmVtb3ZlLCBkZWZlckNsZWFudXApIHtcbiAgdGhpcy5fZGVzdHJveShyZW1vdmUsIGRlZmVyQ2xlYW51cClcbn1cblxuLyoqXG4gKiBQYXJ0aWFsbHkgY29tcGlsZSBhIHBpZWNlIG9mIERPTSBhbmQgcmV0dXJuIGFcbiAqIGRlY29tcGlsZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMuJGNvbXBpbGUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgcmV0dXJuIGNvbXBpbGUoZWwsIHRoaXMuJG9wdGlvbnMsIHRydWUpKHRoaXMsIGVsKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBNQVhfVVBEQVRFX0NPVU5UID0gMTBcblxuLy8gd2UgaGF2ZSB0d28gc2VwYXJhdGUgcXVldWVzOiBvbmUgZm9yIGRpcmVjdGl2ZSB1cGRhdGVzXG4vLyBhbmQgb25lIGZvciB1c2VyIHdhdGNoZXIgcmVnaXN0ZXJlZCB2aWEgJHdhdGNoKCkuXG4vLyB3ZSB3YW50IHRvIGd1YXJhbnRlZSBkaXJlY3RpdmUgdXBkYXRlcyB0byBiZSBjYWxsZWRcbi8vIGJlZm9yZSB1c2VyIHdhdGNoZXJzIHNvIHRoYXQgd2hlbiB1c2VyIHdhdGNoZXJzIGFyZVxuLy8gdHJpZ2dlcmVkLCB0aGUgRE9NIHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIGluIHVwZGF0ZWRcbi8vIHN0YXRlLlxudmFyIHF1ZXVlID0gW11cbnZhciB1c2VyUXVldWUgPSBbXVxudmFyIGhhcyA9IHt9XG52YXIgd2FpdGluZyA9IGZhbHNlXG52YXIgZmx1c2hpbmcgPSBmYWxzZVxuXG4vKipcbiAqIFJlc2V0IHRoZSBiYXRjaGVyJ3Mgc3RhdGUuXG4gKi9cblxuZnVuY3Rpb24gcmVzZXQgKCkge1xuICBxdWV1ZSA9IFtdXG4gIHVzZXJRdWV1ZSA9IFtdXG4gIGhhcyA9IHt9XG4gIHdhaXRpbmcgPSBmYWxzZVxuICBmbHVzaGluZyA9IGZhbHNlXG59XG5cbi8qKlxuICogRmx1c2ggYm90aCBxdWV1ZXMgYW5kIHJ1biB0aGUgam9icy5cbiAqL1xuXG5mdW5jdGlvbiBmbHVzaCAoKSB7XG4gIGZsdXNoaW5nID0gdHJ1ZVxuICBydW4ocXVldWUpXG4gIHJ1bih1c2VyUXVldWUpXG4gIHJlc2V0KClcbn1cblxuLyoqXG4gKiBSdW4gdGhlIGpvYnMgaW4gYSBzaW5nbGUgcXVldWUuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcXVldWVcbiAqL1xuXG5mdW5jdGlvbiBydW4gKHF1ZXVlKSB7XG4gIC8vIGRvIG5vdCBjYWNoZSBsZW5ndGggYmVjYXVzZSBtb3JlIGpvYnMgbWlnaHQgYmUgcHVzaGVkXG4gIC8vIGFzIHdlIHJ1biBleGlzdGluZyBqb2JzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICBxdWV1ZVtpXS5ydW4oKVxuICB9XG59XG5cbi8qKlxuICogUHVzaCBhIGpvYiBpbnRvIHRoZSBqb2IgcXVldWUuXG4gKiBKb2JzIHdpdGggZHVwbGljYXRlIElEcyB3aWxsIGJlIHNraXBwZWQgdW5sZXNzIGl0J3NcbiAqIHB1c2hlZCB3aGVuIHRoZSBxdWV1ZSBpcyBiZWluZyBmbHVzaGVkLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBqb2JcbiAqICAgcHJvcGVydGllczpcbiAqICAgLSB7U3RyaW5nfE51bWJlcn0gaWRcbiAqICAgLSB7RnVuY3Rpb259ICAgICAgcnVuXG4gKi9cblxuZXhwb3J0cy5wdXNoID0gZnVuY3Rpb24gKGpvYikge1xuICB2YXIgaWQgPSBqb2IuaWRcbiAgaWYgKCFpZCB8fCAhaGFzW2lkXSB8fCBmbHVzaGluZykge1xuICAgIGlmICghaGFzW2lkXSkge1xuICAgICAgaGFzW2lkXSA9IDFcbiAgICB9IGVsc2Uge1xuICAgICAgaGFzW2lkXSsrXG4gICAgICAvLyBkZXRlY3QgcG9zc2libGUgaW5maW5pdGUgdXBkYXRlIGxvb3BzXG4gICAgICBpZiAoaGFzW2lkXSA+IE1BWF9VUERBVEVfQ09VTlQpIHtcbiAgICAgICAgXy53YXJuKFxuICAgICAgICAgICdZb3UgbWF5IGhhdmUgYW4gaW5maW5pdGUgdXBkYXRlIGxvb3AgZm9yIHRoZSAnICtcbiAgICAgICAgICAnd2F0Y2hlciB3aXRoIGV4cHJlc3Npb246IFwiJyArIGpvYi5leHByZXNzaW9uICsgJ1wiLidcbiAgICAgICAgKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQSB1c2VyIHdhdGNoZXIgY2FsbGJhY2sgY291bGQgdHJpZ2dlciBhbm90aGVyXG4gICAgLy8gZGlyZWN0aXZlIHVwZGF0ZSBkdXJpbmcgdGhlIGZsdXNoaW5nOyBhdCB0aGF0IHRpbWVcbiAgICAvLyB0aGUgZGlyZWN0aXZlIHF1ZXVlIHdvdWxkIGFscmVhZHkgaGF2ZSBiZWVuIHJ1biwgc29cbiAgICAvLyB3ZSBjYWxsIHRoYXQgdXBkYXRlIGltbWVkaWF0ZWx5IGFzIGl0IGlzIHB1c2hlZC5cbiAgICBpZiAoZmx1c2hpbmcgJiYgIWpvYi51c2VyKSB7XG4gICAgICBqb2IucnVuKClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICA7KGpvYi51c2VyID8gdXNlclF1ZXVlIDogcXVldWUpLnB1c2goam9iKVxuICAgIGlmICghd2FpdGluZykge1xuICAgICAgd2FpdGluZyA9IHRydWVcbiAgICAgIF8ubmV4dFRpY2soZmx1c2gpXG4gICAgfVxuICB9XG59IiwiLyoqXG4gKiBBIGRvdWJseSBsaW5rZWQgbGlzdC1iYXNlZCBMZWFzdCBSZWNlbnRseSBVc2VkIChMUlUpXG4gKiBjYWNoZS4gV2lsbCBrZWVwIG1vc3QgcmVjZW50bHkgdXNlZCBpdGVtcyB3aGlsZVxuICogZGlzY2FyZGluZyBsZWFzdCByZWNlbnRseSB1c2VkIGl0ZW1zIHdoZW4gaXRzIGxpbWl0IGlzXG4gKiByZWFjaGVkLiBUaGlzIGlzIGEgYmFyZS1ib25lIHZlcnNpb24gb2ZcbiAqIFJhc211cyBBbmRlcnNzb24ncyBqcy1scnU6XG4gKlxuICogICBodHRwczovL2dpdGh1Yi5jb20vcnNtcy9qcy1scnVcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbGltaXRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIENhY2hlIChsaW1pdCkge1xuICB0aGlzLnNpemUgPSAwXG4gIHRoaXMubGltaXQgPSBsaW1pdFxuICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSB1bmRlZmluZWRcbiAgdGhpcy5fa2V5bWFwID0ge31cbn1cblxudmFyIHAgPSBDYWNoZS5wcm90b3R5cGVcblxuLyoqXG4gKiBQdXQgPHZhbHVlPiBpbnRvIHRoZSBjYWNoZSBhc3NvY2lhdGVkIHdpdGggPGtleT4uXG4gKiBSZXR1cm5zIHRoZSBlbnRyeSB3aGljaCB3YXMgcmVtb3ZlZCB0byBtYWtlIHJvb20gZm9yXG4gKiB0aGUgbmV3IGVudHJ5LiBPdGhlcndpc2UgdW5kZWZpbmVkIGlzIHJldHVybmVkLlxuICogKGkuZS4gaWYgdGhlcmUgd2FzIGVub3VnaCByb29tIGFscmVhZHkpLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge0VudHJ5fHVuZGVmaW5lZH1cbiAqL1xuXG5wLnB1dCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciBlbnRyeSA9IHtcbiAgICBrZXk6a2V5LFxuICAgIHZhbHVlOnZhbHVlXG4gIH1cbiAgdGhpcy5fa2V5bWFwW2tleV0gPSBlbnRyeVxuICBpZiAodGhpcy50YWlsKSB7XG4gICAgdGhpcy50YWlsLm5ld2VyID0gZW50cnlcbiAgICBlbnRyeS5vbGRlciA9IHRoaXMudGFpbFxuICB9IGVsc2Uge1xuICAgIHRoaXMuaGVhZCA9IGVudHJ5XG4gIH1cbiAgdGhpcy50YWlsID0gZW50cnlcbiAgaWYgKHRoaXMuc2l6ZSA9PT0gdGhpcy5saW1pdCkge1xuICAgIHJldHVybiB0aGlzLnNoaWZ0KClcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNpemUrK1xuICB9XG59XG5cbi8qKlxuICogUHVyZ2UgdGhlIGxlYXN0IHJlY2VudGx5IHVzZWQgKG9sZGVzdCkgZW50cnkgZnJvbSB0aGVcbiAqIGNhY2hlLiBSZXR1cm5zIHRoZSByZW1vdmVkIGVudHJ5IG9yIHVuZGVmaW5lZCBpZiB0aGVcbiAqIGNhY2hlIHdhcyBlbXB0eS5cbiAqL1xuXG5wLnNoaWZ0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZW50cnkgPSB0aGlzLmhlYWRcbiAgaWYgKGVudHJ5KSB7XG4gICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5ld2VyXG4gICAgdGhpcy5oZWFkLm9sZGVyID0gdW5kZWZpbmVkXG4gICAgZW50cnkubmV3ZXIgPSBlbnRyeS5vbGRlciA9IHVuZGVmaW5lZFxuICAgIHRoaXMuX2tleW1hcFtlbnRyeS5rZXldID0gdW5kZWZpbmVkXG4gIH1cbiAgcmV0dXJuIGVudHJ5XG59XG5cbi8qKlxuICogR2V0IGFuZCByZWdpc3RlciByZWNlbnQgdXNlIG9mIDxrZXk+LiBSZXR1cm5zIHRoZSB2YWx1ZVxuICogYXNzb2NpYXRlZCB3aXRoIDxrZXk+IG9yIHVuZGVmaW5lZCBpZiBub3QgaW4gY2FjaGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtCb29sZWFufSByZXR1cm5FbnRyeVxuICogQHJldHVybiB7RW50cnl8Kn1cbiAqL1xuXG5wLmdldCA9IGZ1bmN0aW9uIChrZXksIHJldHVybkVudHJ5KSB7XG4gIHZhciBlbnRyeSA9IHRoaXMuX2tleW1hcFtrZXldXG4gIGlmIChlbnRyeSA9PT0gdW5kZWZpbmVkKSByZXR1cm5cbiAgaWYgKGVudHJ5ID09PSB0aGlzLnRhaWwpIHtcbiAgICByZXR1cm4gcmV0dXJuRW50cnlcbiAgICAgID8gZW50cnlcbiAgICAgIDogZW50cnkudmFsdWVcbiAgfVxuICAvLyBIRUFELS0tLS0tLS0tLS0tLS1UQUlMXG4gIC8vICAgPC5vbGRlciAgIC5uZXdlcj5cbiAgLy8gIDwtLS0gYWRkIGRpcmVjdGlvbiAtLVxuICAvLyAgIEEgIEIgIEMgIDxEPiAgRVxuICBpZiAoZW50cnkubmV3ZXIpIHtcbiAgICBpZiAoZW50cnkgPT09IHRoaXMuaGVhZCkge1xuICAgICAgdGhpcy5oZWFkID0gZW50cnkubmV3ZXJcbiAgICB9XG4gICAgZW50cnkubmV3ZXIub2xkZXIgPSBlbnRyeS5vbGRlciAvLyBDIDwtLSBFLlxuICB9XG4gIGlmIChlbnRyeS5vbGRlcikge1xuICAgIGVudHJ5Lm9sZGVyLm5ld2VyID0gZW50cnkubmV3ZXIgLy8gQy4gLS0+IEVcbiAgfVxuICBlbnRyeS5uZXdlciA9IHVuZGVmaW5lZCAvLyBEIC0teFxuICBlbnRyeS5vbGRlciA9IHRoaXMudGFpbCAvLyBELiAtLT4gRVxuICBpZiAodGhpcy50YWlsKSB7XG4gICAgdGhpcy50YWlsLm5ld2VyID0gZW50cnkgLy8gRS4gPC0tIERcbiAgfVxuICB0aGlzLnRhaWwgPSBlbnRyeVxuICByZXR1cm4gcmV0dXJuRW50cnlcbiAgICA/IGVudHJ5XG4gICAgOiBlbnRyeS52YWx1ZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhY2hlIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKVxudmFyIGRpclBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZGlyZWN0aXZlJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxuXG4vLyBpbnRlcm5hbCBkaXJlY3RpdmVzXG52YXIgcHJvcERlZiA9IHJlcXVpcmUoJy4uL2RpcmVjdGl2ZXMvcHJvcCcpXG52YXIgY29tcG9uZW50RGVmID0gcmVxdWlyZSgnLi4vZGlyZWN0aXZlcy9jb21wb25lbnQnKVxuXG4vLyB0ZXJtaW5hbCBkaXJlY3RpdmVzXG52YXIgdGVybWluYWxEaXJlY3RpdmVzID0gW1xuICAncmVwZWF0JyxcbiAgJ2lmJ1xuXVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBpbGVcblxuLyoqXG4gKiBDb21waWxlIGEgdGVtcGxhdGUgYW5kIHJldHVybiBhIHJldXNhYmxlIGNvbXBvc2l0ZSBsaW5rXG4gKiBmdW5jdGlvbiwgd2hpY2ggcmVjdXJzaXZlbHkgY29udGFpbnMgbW9yZSBsaW5rIGZ1bmN0aW9uc1xuICogaW5zaWRlLiBUaGlzIHRvcCBsZXZlbCBjb21waWxlIGZ1bmN0aW9uIHNob3VsZCBvbmx5IGJlXG4gKiBjYWxsZWQgb24gaW5zdGFuY2Ugcm9vdCBub2Rlcy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHBhcnRpYWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdHJhbnNjbHVkZWRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGUgKGVsLCBvcHRpb25zLCBwYXJ0aWFsLCB0cmFuc2NsdWRlZCkge1xuICAvLyBsaW5rIGZ1bmN0aW9uIGZvciB0aGUgbm9kZSBpdHNlbGYuXG4gIHZhciBub2RlTGlua0ZuID0gb3B0aW9ucy5fYXNDb21wb25lbnQgJiYgIXBhcnRpYWxcbiAgICA/IGNvbXBpbGVSb290KGVsLCBvcHRpb25zKVxuICAgIDogY29tcGlsZU5vZGUoZWwsIG9wdGlvbnMpXG4gIC8vIGxpbmsgZnVuY3Rpb24gZm9yIHRoZSBjaGlsZE5vZGVzXG4gIHZhciBjaGlsZExpbmtGbiA9XG4gICAgIShub2RlTGlua0ZuICYmIG5vZGVMaW5rRm4udGVybWluYWwpICYmXG4gICAgZWwudGFnTmFtZSAhPT0gJ1NDUklQVCcgJiZcbiAgICBlbC5oYXNDaGlsZE5vZGVzKClcbiAgICAgID8gY29tcGlsZU5vZGVMaXN0KGVsLmNoaWxkTm9kZXMsIG9wdGlvbnMpXG4gICAgICA6IG51bGxcblxuICAvKipcbiAgICogQSBjb21wb3NpdGUgbGlua2VyIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBhIGFscmVhZHlcbiAgICogY29tcGlsZWQgcGllY2Ugb2YgRE9NLCB3aGljaCBpbnN0YW50aWF0ZXMgYWxsIGRpcmVjdGl2ZVxuICAgKiBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7VnVlfSB2bVxuICAgKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAgICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICAgKi9cblxuICBmdW5jdGlvbiBjb21wb3NpdGVMaW5rRm4gKHZtLCBlbCkge1xuICAgIC8vIHNhdmUgb3JpZ2luYWwgZGlyZWN0aXZlIGNvdW50IGJlZm9yZSBsaW5raW5nXG4gICAgLy8gc28gd2UgY2FuIGNhcHR1cmUgdGhlIGRpcmVjdGl2ZXMgY3JlYXRlZCBkdXJpbmcgYVxuICAgIC8vIHBhcnRpYWwgY29tcGlsYXRpb24uXG4gICAgdmFyIG9yaWdpbmFsRGlyQ291bnQgPSB2bS5fZGlyZWN0aXZlcy5sZW5ndGhcbiAgICB2YXIgcGFyZW50T3JpZ2luYWxEaXJDb3VudCA9XG4gICAgICB2bS4kcGFyZW50ICYmIHZtLiRwYXJlbnQuX2RpcmVjdGl2ZXMubGVuZ3RoXG4gICAgLy8gY2FjaGUgY2hpbGROb2RlcyBiZWZvcmUgbGlua2luZyBwYXJlbnQsIGZpeCAjNjU3XG4gICAgdmFyIGNoaWxkTm9kZXMgPSBfLnRvQXJyYXkoZWwuY2hpbGROb2RlcylcbiAgICAvLyBpZiB0aGlzIGlzIGEgdHJhbnNjbHVkZWQgY29tcGlsZSwgbGlua2VycyBuZWVkIHRvIGJlXG4gICAgLy8gY2FsbGVkIGluIHNvdXJjZSBzY29wZSwgYW5kIHRoZSBob3N0IG5lZWRzIHRvIGJlXG4gICAgLy8gcGFzc2VkIGRvd24uXG4gICAgdmFyIHNvdXJjZSA9IHRyYW5zY2x1ZGVkID8gdm0uJHBhcmVudCA6IHZtXG4gICAgdmFyIGhvc3QgPSB0cmFuc2NsdWRlZCA/IHZtIDogdW5kZWZpbmVkXG4gICAgLy8gbGlua1xuICAgIGlmIChub2RlTGlua0ZuKSBub2RlTGlua0ZuKHNvdXJjZSwgZWwsIGhvc3QpXG4gICAgaWYgKGNoaWxkTGlua0ZuKSBjaGlsZExpbmtGbihzb3VyY2UsIGNoaWxkTm9kZXMsIGhvc3QpXG5cbiAgICB2YXIgc2VsZkRpcnMgPSB2bS5fZGlyZWN0aXZlcy5zbGljZShvcmlnaW5hbERpckNvdW50KVxuICAgIHZhciBwYXJlbnREaXJzID0gdm0uJHBhcmVudCAmJlxuICAgICAgdm0uJHBhcmVudC5fZGlyZWN0aXZlcy5zbGljZShwYXJlbnRPcmlnaW5hbERpckNvdW50KVxuXG4gICAgLyoqXG4gICAgICogVGhlIGxpbmtlciBmdW5jdGlvbiByZXR1cm5zIGFuIHVubGluayBmdW5jdGlvbiB0aGF0XG4gICAgICogdGVhcnNkb3duIGFsbCBkaXJlY3RpdmVzIGluc3RhbmNlcyBnZW5lcmF0ZWQgZHVyaW5nXG4gICAgICogdGhlIHByb2Nlc3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGRlc3Ryb3lpbmdcbiAgICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gdW5saW5rIChkZXN0cm95aW5nKSB7XG4gICAgICB0ZWFyZG93bkRpcnModm0sIHNlbGZEaXJzLCBkZXN0cm95aW5nKVxuICAgICAgaWYgKHBhcmVudERpcnMpIHtcbiAgICAgICAgdGVhcmRvd25EaXJzKHZtLiRwYXJlbnQsIHBhcmVudERpcnMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gdHJhbnNjbHVkZWQgbGlua0ZucyBhcmUgdGVybWluYWwsIGJlY2F1c2UgaXQgdGFrZXNcbiAgLy8gb3ZlciB0aGUgZW50aXJlIHN1Yi10cmVlLlxuICBpZiAodHJhbnNjbHVkZWQpIHtcbiAgICBjb21wb3NpdGVMaW5rRm4udGVybWluYWwgPSB0cnVlXG4gIH1cblxuICByZXR1cm4gY29tcG9zaXRlTGlua0ZuXG59XG5cbi8qKlxuICogVGVhcmRvd24gYSBzdWJzZXQgb2YgZGlyZWN0aXZlcyBvbiBhIHZtLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtBcnJheX0gZGlyc1xuICogQHBhcmFtIHtCb29sZWFufSBkZXN0cm95aW5nXG4gKi9cblxuZnVuY3Rpb24gdGVhcmRvd25EaXJzICh2bSwgZGlycywgZGVzdHJveWluZykge1xuICB2YXIgaSA9IGRpcnMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBkaXJzW2ldLl90ZWFyZG93bigpXG4gICAgaWYgKCFkZXN0cm95aW5nKSB7XG4gICAgICB2bS5fZGlyZWN0aXZlcy4kcmVtb3ZlKGRpcnNbaV0pXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSB0aGUgcm9vdCBlbGVtZW50IG9mIGEgY29tcG9uZW50LiBUaGVyZSBhcmVcbiAqIDMgdHlwZXMgb2YgdGhpbmdzIHRvIHByb2Nlc3MgaGVyZTpcbiAqIFxuICogMS4gcHJvcHMgb24gcGFyZW50IGNvbnRhaW5lciAoY2hpbGQgc2NvcGUpXG4gKiAyLiBvdGhlciBhdHRycyBvbiBwYXJlbnQgY29udGFpbmVyIChwYXJlbnQgc2NvcGUpXG4gKiAzLiBhdHRycyBvbiB0aGUgY29tcG9uZW50IHRlbXBsYXRlIHJvb3Qgbm9kZSwgaWZcbiAqICAgIHJlcGxhY2U6dHJ1ZSAoY2hpbGQgc2NvcGUpXG4gKlxuICogQWxzbywgaWYgdGhpcyBpcyBhIGJsb2NrIGluc3RhbmNlLCB3ZSBvbmx5IG5lZWQgdG9cbiAqIGNvbXBpbGUgMSAmIDIgaGVyZS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZVJvb3QgKGVsLCBvcHRpb25zKSB7XG4gIHZhciBpc0Jsb2NrID0gZWwubm9kZVR5cGUgPT09IDExIC8vIERvY3VtZW50RnJhZ21lbnRcbiAgdmFyIGNvbnRhaW5lckF0dHJzID0gb3B0aW9ucy5fY29udGFpbmVyQXR0cnNcbiAgdmFyIHJlcGxhY2VyQXR0cnMgPSBvcHRpb25zLl9yZXBsYWNlckF0dHJzXG4gIHZhciBwcm9wcyA9IG9wdGlvbnMucHJvcHNcbiAgdmFyIHByb3BzTGlua0ZuLCBwYXJlbnRMaW5rRm4sIHJlcGxhY2VyTGlua0ZuXG4gIC8vIDEuIHByb3BzXG4gIHByb3BzTGlua0ZuID0gcHJvcHNcbiAgICA/IGNvbXBpbGVQcm9wcyhlbCwgY29udGFpbmVyQXR0cnMsIHByb3BzKVxuICAgIDogbnVsbFxuICBpZiAoIWlzQmxvY2spIHtcbiAgICAvLyAyLiBjb250YWluZXIgYXR0cmlidXRlc1xuICAgIGlmIChjb250YWluZXJBdHRycykge1xuICAgICAgcGFyZW50TGlua0ZuID0gY29tcGlsZURpcmVjdGl2ZXMoY29udGFpbmVyQXR0cnMsIG9wdGlvbnMpXG4gICAgfVxuICAgIGlmIChyZXBsYWNlckF0dHJzKSB7XG4gICAgICAvLyAzLiByZXBsYWNlciBhdHRyaWJ1dGVzXG4gICAgICByZXBsYWNlckxpbmtGbiA9IGNvbXBpbGVEaXJlY3RpdmVzKHJlcGxhY2VyQXR0cnMsIG9wdGlvbnMpXG4gICAgfVxuICB9XG4gIHJldHVybiBmdW5jdGlvbiByb290TGlua0ZuICh2bSwgZWwsIGhvc3QpIHtcbiAgICAvLyBleHBsaWNpdGx5IHBhc3NpbmcgbnVsbCB0byBwcm9wc1xuICAgIC8vIGxpbmtlcnMgYmVjYXVzZSB0aGV5IGRvbid0IG5lZWQgYSByZWFsIGVsZW1lbnRcbiAgICBpZiAocHJvcHNMaW5rRm4pIHByb3BzTGlua0ZuKHZtLCBudWxsKVxuICAgIGlmIChwYXJlbnRMaW5rRm4pIHBhcmVudExpbmtGbih2bS4kcGFyZW50LCBlbCwgaG9zdClcbiAgICBpZiAocmVwbGFjZXJMaW5rRm4pIHJlcGxhY2VyTGlua0ZuKHZtLCBlbCwgaG9zdClcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYSBub2RlIGFuZCByZXR1cm4gYSBub2RlTGlua0ZuIGJhc2VkIG9uIHRoZVxuICogbm9kZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufG51bGx9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZU5vZGUgKG5vZGUsIG9wdGlvbnMpIHtcbiAgdmFyIHR5cGUgPSBub2RlLm5vZGVUeXBlXG4gIGlmICh0eXBlID09PSAxICYmIG5vZGUudGFnTmFtZSAhPT0gJ1NDUklQVCcpIHtcbiAgICByZXR1cm4gY29tcGlsZUVsZW1lbnQobm9kZSwgb3B0aW9ucylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAzICYmIGNvbmZpZy5pbnRlcnBvbGF0ZSAmJiBub2RlLmRhdGEudHJpbSgpKSB7XG4gICAgcmV0dXJuIGNvbXBpbGVUZXh0Tm9kZShub2RlLCBvcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIGFuIGVsZW1lbnQgYW5kIHJldHVybiBhIG5vZGVMaW5rRm4uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufG51bGx9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZUVsZW1lbnQgKGVsLCBvcHRpb25zKSB7XG4gIGlmIChjaGVja1RyYW5zY2x1c2lvbihlbCkpIHtcbiAgICAvLyB1bndyYXAgdGV4dE5vZGVcbiAgICBpZiAoZWwuaGFzQXR0cmlidXRlKCdfX3Z1ZV9fd3JhcCcpKSB7XG4gICAgICBlbCA9IGVsLmZpcnN0Q2hpbGRcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBpbGUoZWwsIG9wdGlvbnMuX3BhcmVudC4kb3B0aW9ucywgdHJ1ZSwgdHJ1ZSlcbiAgfVxuICB2YXIgbGlua0ZuXG4gIHZhciBoYXNBdHRycyA9IGVsLmhhc0F0dHJpYnV0ZXMoKVxuICAvLyBjaGVjayBlbGVtZW50IGRpcmVjdGl2ZXNcbiAgbGlua0ZuID0gY2hlY2tFbGVtZW50RGlyZWN0aXZlcyhlbCwgb3B0aW9ucylcbiAgLy8gY2hlY2sgdGVybWluYWwgZGlyZWNpdHZlcyAocmVwZWF0ICYgaWYpXG4gIGlmICghbGlua0ZuICYmIGhhc0F0dHJzKSB7XG4gICAgbGlua0ZuID0gY2hlY2tUZXJtaW5hbERpcmVjdGl2ZXMoZWwsIG9wdGlvbnMpXG4gIH1cbiAgLy8gY2hlY2sgY29tcG9uZW50XG4gIGlmICghbGlua0ZuKSB7XG4gICAgbGlua0ZuID0gY2hlY2tDb21wb25lbnQoZWwsIG9wdGlvbnMpXG4gIH1cbiAgLy8gbm9ybWFsIGRpcmVjdGl2ZXNcbiAgaWYgKCFsaW5rRm4gJiYgaGFzQXR0cnMpIHtcbiAgICBsaW5rRm4gPSBjb21waWxlRGlyZWN0aXZlcyhlbCwgb3B0aW9ucylcbiAgfVxuICAvLyBpZiB0aGUgZWxlbWVudCBpcyBhIHRleHRhcmVhLCB3ZSBuZWVkIHRvIGludGVycG9sYXRlXG4gIC8vIGl0cyBjb250ZW50IG9uIGluaXRpYWwgcmVuZGVyLlxuICBpZiAoZWwudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgIHZhciByZWFsTGlua0ZuID0gbGlua0ZuXG4gICAgbGlua0ZuID0gZnVuY3Rpb24gKHZtLCBlbCkge1xuICAgICAgZWwudmFsdWUgPSB2bS4kaW50ZXJwb2xhdGUoZWwudmFsdWUpXG4gICAgICBpZiAocmVhbExpbmtGbikgcmVhbExpbmtGbih2bSwgZWwpXG4gICAgfVxuICAgIGxpbmtGbi50ZXJtaW5hbCA9IHRydWVcbiAgfVxuICByZXR1cm4gbGlua0ZuXG59XG5cbi8qKlxuICogQ29tcGlsZSBhIHRleHROb2RlIGFuZCByZXR1cm4gYSBub2RlTGlua0ZuLlxuICpcbiAqIEBwYXJhbSB7VGV4dE5vZGV9IG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbnxudWxsfSB0ZXh0Tm9kZUxpbmtGblxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVUZXh0Tm9kZSAobm9kZSwgb3B0aW9ucykge1xuICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZShub2RlLmRhdGEpXG4gIGlmICghdG9rZW5zKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICB2YXIgZWwsIHRva2VuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHRva2VuID0gdG9rZW5zW2ldXG4gICAgZWwgPSB0b2tlbi50YWdcbiAgICAgID8gcHJvY2Vzc1RleHRUb2tlbih0b2tlbiwgb3B0aW9ucylcbiAgICAgIDogZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9rZW4udmFsdWUpXG4gICAgZnJhZy5hcHBlbmRDaGlsZChlbClcbiAgfVxuICByZXR1cm4gbWFrZVRleHROb2RlTGlua0ZuKHRva2VucywgZnJhZywgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBQcm9jZXNzIGEgc2luZ2xlIHRleHQgdG9rZW4uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRva2VuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuXG5mdW5jdGlvbiBwcm9jZXNzVGV4dFRva2VuICh0b2tlbiwgb3B0aW9ucykge1xuICB2YXIgZWxcbiAgaWYgKHRva2VuLm9uZVRpbWUpIHtcbiAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRva2VuLnZhbHVlKVxuICB9IGVsc2Uge1xuICAgIGlmICh0b2tlbi5odG1sKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtaHRtbCcpXG4gICAgICBzZXRUb2tlblR5cGUoJ2h0bWwnKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJRSB3aWxsIGNsZWFuIHVwIGVtcHR5IHRleHROb2RlcyBkdXJpbmdcbiAgICAgIC8vIGZyYWcuY2xvbmVOb2RlKHRydWUpLCBzbyB3ZSBoYXZlIHRvIGdpdmUgaXRcbiAgICAgIC8vIHNvbWV0aGluZyBoZXJlLi4uXG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgJylcbiAgICAgIHNldFRva2VuVHlwZSgndGV4dCcpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHNldFRva2VuVHlwZSAodHlwZSkge1xuICAgIHRva2VuLnR5cGUgPSB0eXBlXG4gICAgdG9rZW4uZGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzW3R5cGVdXG4gICAgdG9rZW4uZGVzY3JpcHRvciA9IGRpclBhcnNlci5wYXJzZSh0b2tlbi52YWx1ZSlbMF1cbiAgfVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBCdWlsZCBhIGZ1bmN0aW9uIHRoYXQgcHJvY2Vzc2VzIGEgdGV4dE5vZGUuXG4gKlxuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSB0b2tlbnNcbiAqIEBwYXJhbSB7RG9jdW1lbnRGcmFnbWVudH0gZnJhZ1xuICovXG5cbmZ1bmN0aW9uIG1ha2VUZXh0Tm9kZUxpbmtGbiAodG9rZW5zLCBmcmFnKSB7XG4gIHJldHVybiBmdW5jdGlvbiB0ZXh0Tm9kZUxpbmtGbiAodm0sIGVsKSB7XG4gICAgdmFyIGZyYWdDbG9uZSA9IGZyYWcuY2xvbmVOb2RlKHRydWUpXG4gICAgdmFyIGNoaWxkTm9kZXMgPSBfLnRvQXJyYXkoZnJhZ0Nsb25lLmNoaWxkTm9kZXMpXG4gICAgdmFyIHRva2VuLCB2YWx1ZSwgbm9kZVxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdG9rZW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICAgIHZhbHVlID0gdG9rZW4udmFsdWVcbiAgICAgIGlmICh0b2tlbi50YWcpIHtcbiAgICAgICAgbm9kZSA9IGNoaWxkTm9kZXNbaV1cbiAgICAgICAgaWYgKHRva2VuLm9uZVRpbWUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZtLiRldmFsKHZhbHVlKVxuICAgICAgICAgIGlmICh0b2tlbi5odG1sKSB7XG4gICAgICAgICAgICBfLnJlcGxhY2Uobm9kZSwgdGVtcGxhdGVQYXJzZXIucGFyc2UodmFsdWUsIHRydWUpKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLmRhdGEgPSB2YWx1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2bS5fYmluZERpcih0b2tlbi50eXBlLCBub2RlLFxuICAgICAgICAgICAgICAgICAgICAgIHRva2VuLmRlc2NyaXB0b3IsIHRva2VuLmRlZilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBfLnJlcGxhY2UoZWwsIGZyYWdDbG9uZSlcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYSBub2RlIGxpc3QgYW5kIHJldHVybiBhIGNoaWxkTGlua0ZuLlxuICpcbiAqIEBwYXJhbSB7Tm9kZUxpc3R9IG5vZGVMaXN0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVOb2RlTGlzdCAobm9kZUxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGxpbmtGbnMgPSBbXVxuICB2YXIgbm9kZUxpbmtGbiwgY2hpbGRMaW5rRm4sIG5vZGVcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2RlTGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBub2RlID0gbm9kZUxpc3RbaV1cbiAgICBub2RlTGlua0ZuID0gY29tcGlsZU5vZGUobm9kZSwgb3B0aW9ucylcbiAgICBjaGlsZExpbmtGbiA9XG4gICAgICAhKG5vZGVMaW5rRm4gJiYgbm9kZUxpbmtGbi50ZXJtaW5hbCkgJiZcbiAgICAgIG5vZGUudGFnTmFtZSAhPT0gJ1NDUklQVCcgJiZcbiAgICAgIG5vZGUuaGFzQ2hpbGROb2RlcygpXG4gICAgICAgID8gY29tcGlsZU5vZGVMaXN0KG5vZGUuY2hpbGROb2Rlcywgb3B0aW9ucylcbiAgICAgICAgOiBudWxsXG4gICAgbGlua0Zucy5wdXNoKG5vZGVMaW5rRm4sIGNoaWxkTGlua0ZuKVxuICB9XG4gIHJldHVybiBsaW5rRm5zLmxlbmd0aFxuICAgID8gbWFrZUNoaWxkTGlua0ZuKGxpbmtGbnMpXG4gICAgOiBudWxsXG59XG5cbi8qKlxuICogTWFrZSBhIGNoaWxkIGxpbmsgZnVuY3Rpb24gZm9yIGEgbm9kZSdzIGNoaWxkTm9kZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheTxGdW5jdGlvbj59IGxpbmtGbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBjaGlsZExpbmtGblxuICovXG5cbmZ1bmN0aW9uIG1ha2VDaGlsZExpbmtGbiAobGlua0Zucykge1xuICByZXR1cm4gZnVuY3Rpb24gY2hpbGRMaW5rRm4gKHZtLCBub2RlcywgaG9zdCkge1xuICAgIHZhciBub2RlLCBub2RlTGlua0ZuLCBjaGlsZHJlbkxpbmtGblxuICAgIGZvciAodmFyIGkgPSAwLCBuID0gMCwgbCA9IGxpbmtGbnMubGVuZ3RoOyBpIDwgbDsgbisrKSB7XG4gICAgICBub2RlID0gbm9kZXNbbl1cbiAgICAgIG5vZGVMaW5rRm4gPSBsaW5rRm5zW2krK11cbiAgICAgIGNoaWxkcmVuTGlua0ZuID0gbGlua0Zuc1tpKytdXG4gICAgICAvLyBjYWNoZSBjaGlsZE5vZGVzIGJlZm9yZSBsaW5raW5nIHBhcmVudCwgZml4ICM2NTdcbiAgICAgIHZhciBjaGlsZE5vZGVzID0gXy50b0FycmF5KG5vZGUuY2hpbGROb2RlcylcbiAgICAgIGlmIChub2RlTGlua0ZuKSB7XG4gICAgICAgIG5vZGVMaW5rRm4odm0sIG5vZGUsIGhvc3QpXG4gICAgICB9XG4gICAgICBpZiAoY2hpbGRyZW5MaW5rRm4pIHtcbiAgICAgICAgY2hpbGRyZW5MaW5rRm4odm0sIGNoaWxkTm9kZXMsIGhvc3QpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBwYXJhbSBhdHRyaWJ1dGVzIG9uIGEgcm9vdCBlbGVtZW50IGFuZCByZXR1cm5cbiAqIGEgcHJvcHMgbGluayBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyc1xuICogQHBhcmFtIHtBcnJheX0gcHJvcE5hbWVzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gcHJvcHNMaW5rRm5cbiAqL1xuXG4vLyByZWdleCB0byB0ZXN0IGlmIGEgcGF0aCBpcyBcInNldHRhYmxlXCJcbi8vIGlmIG5vdCB0aGUgcHJvcCBiaW5kaW5nIGlzIGF1dG9tYXRpY2FsbHkgb25lLXdheS5cbnZhciBzZXR0YWJsZVBhdGhSRSA9IC9eW0EtWmEtel8kXVtcXHckXSooXFwuW0EtWmEtel8kXVtcXHckXSp8XFxbW15cXFtcXF1dXFxdKSokL1xuXG5mdW5jdGlvbiBjb21waWxlUHJvcHMgKGVsLCBhdHRycywgcHJvcE5hbWVzKSB7XG4gIHZhciBwcm9wcyA9IFtdXG4gIHZhciBpID0gcHJvcE5hbWVzLmxlbmd0aFxuICB2YXIgbmFtZSwgdmFsdWUsIHByb3BcbiAgd2hpbGUgKGktLSkge1xuICAgIG5hbWUgPSBwcm9wTmFtZXNbaV1cbiAgICBpZiAoL1tBLVpdLy50ZXN0KG5hbWUpKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdZb3Ugc2VlbSB0byBiZSB1c2luZyBjYW1lbENhc2UgZm9yIGEgY29tcG9uZW50IHByb3AsICcgK1xuICAgICAgICAnYnV0IEhUTUwgZG9lc25cXCd0IGRpZmZlcmVudGlhdGUgYmV0d2VlbiB1cHBlciBhbmQgJyArXG4gICAgICAgICdsb3dlciBjYXNlLiBZb3Ugc2hvdWxkIHVzZSBoeXBoZW4tZGVsaW1pdGVkICcgK1xuICAgICAgICAnYXR0cmlidXRlIG5hbWVzLiBGb3IgbW9yZSBpbmZvIHNlZSAnICtcbiAgICAgICAgJ2h0dHA6Ly92dWVqcy5vcmcvYXBpL29wdGlvbnMuaHRtbCNwcm9wcydcbiAgICAgIClcbiAgICB9XG4gICAgdmFsdWUgPSBhdHRyc1tuYW1lXVxuICAgIC8qIGpzaGludCBlcWVxZXE6ZmFsc2UgKi9cbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgcHJvcCA9IHtcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9XG4gICAgICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZSh2YWx1ZSlcbiAgICAgIGlmICh0b2tlbnMpIHtcbiAgICAgICAgaWYgKGVsICYmIGVsLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gICAgICAgIH1cbiAgICAgICAgYXR0cnNbbmFtZV0gPSBudWxsXG4gICAgICAgIHByb3AuZHluYW1pYyA9IHRydWVcbiAgICAgICAgcHJvcC52YWx1ZSA9IHRleHRQYXJzZXIudG9rZW5zVG9FeHAodG9rZW5zKVxuICAgICAgICBwcm9wLm9uZVRpbWUgPVxuICAgICAgICAgIHRva2Vucy5sZW5ndGggPiAxIHx8XG4gICAgICAgICAgdG9rZW5zWzBdLm9uZVRpbWUgfHxcbiAgICAgICAgICAhc2V0dGFibGVQYXRoUkUudGVzdChwcm9wLnZhbHVlKVxuICAgICAgfVxuICAgICAgcHJvcHMucHVzaChwcm9wKVxuICAgIH1cbiAgfVxuICByZXR1cm4gbWFrZVByb3BzTGlua0ZuKHByb3BzKVxufVxuXG4vKipcbiAqIEJ1aWxkIGEgZnVuY3Rpb24gdGhhdCBhcHBsaWVzIHByb3BzIHRvIGEgdm0uXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBwcm9wc0xpbmtGblxuICovXG5cbnZhciBkYXRhQXR0clJFID0gL15kYXRhLS9cblxuZnVuY3Rpb24gbWFrZVByb3BzTGlua0ZuIChwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gcHJvcHNMaW5rRm4gKHZtLCBlbCkge1xuICAgIHZhciBpID0gcHJvcHMubGVuZ3RoXG4gICAgdmFyIHByb3AsIHBhdGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBwcm9wID0gcHJvcHNbaV1cbiAgICAgIC8vIHByb3BzIGNvdWxkIGNvbnRhaW4gZGFzaGVzLCB3aGljaCB3aWxsIGJlXG4gICAgICAvLyBpbnRlcnByZXRlZCBhcyBtaW51cyBjYWxjdWxhdGlvbnMgYnkgdGhlIHBhcnNlclxuICAgICAgLy8gc28gd2UgbmVlZCB0byB3cmFwIHRoZSBwYXRoIGhlcmVcbiAgICAgIHBhdGggPSBfLmNhbWVsaXplKHByb3AubmFtZS5yZXBsYWNlKGRhdGFBdHRyUkUsICcnKSlcbiAgICAgIGlmIChwcm9wLmR5bmFtaWMpIHtcbiAgICAgICAgdm0uX2JpbmREaXIoJ3Byb3AnLCBlbCwge1xuICAgICAgICAgIGFyZzogcGF0aCxcbiAgICAgICAgICBleHByZXNzaW9uOiBwcm9wLnZhbHVlLFxuICAgICAgICAgIG9uZVdheTogcHJvcC5vbmVUaW1lXG4gICAgICAgIH0sIHByb3BEZWYpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBqdXN0IHNldCBvbmNlXG4gICAgICAgIHZtLiRzZXQocGF0aCwgcHJvcC52YWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBmb3IgZWxlbWVudCBkaXJlY3RpdmVzIChjdXN0b20gZWxlbWVudHMgdGhhdCBzaG91bGRcbiAqIGJlIHJlc292bGVkIGFzIHRlcm1pbmFsIGRpcmVjdGl2ZXMpLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKi9cblxuZnVuY3Rpb24gY2hlY2tFbGVtZW50RGlyZWN0aXZlcyAoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICB2YXIgZGVmID0gb3B0aW9ucy5lbGVtZW50RGlyZWN0aXZlc1t0YWddXG4gIGlmIChkZWYpIHtcbiAgICByZXR1cm4gbWFrZVRlcm1pbmFsTm9kZUxpbmtGbihlbCwgdGFnLCAnJywgb3B0aW9ucywgZGVmKVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gZWxlbWVudCBpcyBhIGNvbXBvbmVudC4gSWYgeWVzLCByZXR1cm5cbiAqIGEgY29tcG9uZW50IGxpbmsgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBjaGVja0NvbXBvbmVudCAoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIGNvbXBvbmVudElkID0gXy5jaGVja0NvbXBvbmVudChlbCwgb3B0aW9ucylcbiAgaWYgKGNvbXBvbmVudElkKSB7XG4gICAgdmFyIGNvbXBvbmVudExpbmtGbiA9IGZ1bmN0aW9uICh2bSwgZWwsIGhvc3QpIHtcbiAgICAgIHZtLl9iaW5kRGlyKCdjb21wb25lbnQnLCBlbCwge1xuICAgICAgICBleHByZXNzaW9uOiBjb21wb25lbnRJZFxuICAgICAgfSwgY29tcG9uZW50RGVmLCBob3N0KVxuICAgIH1cbiAgICBjb21wb25lbnRMaW5rRm4udGVybWluYWwgPSB0cnVlXG4gICAgcmV0dXJuIGNvbXBvbmVudExpbmtGblxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgYW4gZWxlbWVudCBmb3IgdGVybWluYWwgZGlyZWN0aXZlcyBpbiBmaXhlZCBvcmRlci5cbiAqIElmIGl0IGZpbmRzIG9uZSwgcmV0dXJuIGEgdGVybWluYWwgbGluayBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259IHRlcm1pbmFsTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gY2hlY2tUZXJtaW5hbERpcmVjdGl2ZXMgKGVsLCBvcHRpb25zKSB7XG4gIGlmIChfLmF0dHIoZWwsICdwcmUnKSAhPT0gbnVsbCkge1xuICAgIHJldHVybiBza2lwXG4gIH1cbiAgdmFyIHZhbHVlLCBkaXJOYW1lXG4gIC8qIGpzaGludCBib3NzOiB0cnVlICovXG4gIGZvciAodmFyIGkgPSAwLCBsID0gdGVybWluYWxEaXJlY3RpdmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGRpck5hbWUgPSB0ZXJtaW5hbERpcmVjdGl2ZXNbaV1cbiAgICBpZiAoKHZhbHVlID0gXy5hdHRyKGVsLCBkaXJOYW1lKSkgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBtYWtlVGVybWluYWxOb2RlTGlua0ZuKGVsLCBkaXJOYW1lLCB2YWx1ZSwgb3B0aW9ucylcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc2tpcCAoKSB7fVxuc2tpcC50ZXJtaW5hbCA9IHRydWVcblxuLyoqXG4gKiBCdWlsZCBhIG5vZGUgbGluayBmdW5jdGlvbiBmb3IgYSB0ZXJtaW5hbCBkaXJlY3RpdmUuXG4gKiBBIHRlcm1pbmFsIGxpbmsgZnVuY3Rpb24gdGVybWluYXRlcyB0aGUgY3VycmVudFxuICogY29tcGlsYXRpb24gcmVjdXJzaW9uIGFuZCBoYW5kbGVzIGNvbXBpbGF0aW9uIG9mIHRoZVxuICogc3VidHJlZSBpbiB0aGUgZGlyZWN0aXZlLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBkaXJOYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gW2RlZl1cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0ZXJtaW5hbExpbmtGblxuICovXG5cbmZ1bmN0aW9uIG1ha2VUZXJtaW5hbE5vZGVMaW5rRm4gKGVsLCBkaXJOYW1lLCB2YWx1ZSwgb3B0aW9ucywgZGVmKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZGlyUGFyc2VyLnBhcnNlKHZhbHVlKVswXVxuICBkZWYgPSBkZWYgfHwgb3B0aW9ucy5kaXJlY3RpdmVzW2Rpck5hbWVdXG4gIHZhciBmbiA9IGZ1bmN0aW9uIHRlcm1pbmFsTm9kZUxpbmtGbiAodm0sIGVsLCBob3N0KSB7XG4gICAgdm0uX2JpbmREaXIoZGlyTmFtZSwgZWwsIGRlc2NyaXB0b3IsIGRlZiwgaG9zdClcbiAgfVxuICBmbi50ZXJtaW5hbCA9IHRydWVcbiAgcmV0dXJuIGZuXG59XG5cbi8qKlxuICogQ29tcGlsZSB0aGUgZGlyZWN0aXZlcyBvbiBhbiBlbGVtZW50IGFuZCByZXR1cm4gYSBsaW5rZXIuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gZWxPckF0dHJzXG4gKiAgICAgICAgLSBjb3VsZCBiZSBhbiBvYmplY3Qgb2YgYWxyZWFkeS1leHRyYWN0ZWRcbiAqICAgICAgICAgIGNvbnRhaW5lciBhdHRyaWJ1dGVzLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVEaXJlY3RpdmVzIChlbE9yQXR0cnMsIG9wdGlvbnMpIHtcbiAgdmFyIGF0dHJzID0gXy5pc1BsYWluT2JqZWN0KGVsT3JBdHRycylcbiAgICA/IG1hcFRvTGlzdChlbE9yQXR0cnMpXG4gICAgOiBlbE9yQXR0cnMuYXR0cmlidXRlc1xuICB2YXIgaSA9IGF0dHJzLmxlbmd0aFxuICB2YXIgZGlycyA9IFtdXG4gIHZhciBhdHRyLCBuYW1lLCB2YWx1ZSwgZGlyLCBkaXJOYW1lLCBkaXJEZWZcbiAgd2hpbGUgKGktLSkge1xuICAgIGF0dHIgPSBhdHRyc1tpXVxuICAgIG5hbWUgPSBhdHRyLm5hbWVcbiAgICB2YWx1ZSA9IGF0dHIudmFsdWVcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIGNvbnRpbnVlXG4gICAgaWYgKG5hbWUuaW5kZXhPZihjb25maWcucHJlZml4KSA9PT0gMCkge1xuICAgICAgZGlyTmFtZSA9IG5hbWUuc2xpY2UoY29uZmlnLnByZWZpeC5sZW5ndGgpXG4gICAgICBkaXJEZWYgPSBvcHRpb25zLmRpcmVjdGl2ZXNbZGlyTmFtZV1cbiAgICAgIF8uYXNzZXJ0QXNzZXQoZGlyRGVmLCAnZGlyZWN0aXZlJywgZGlyTmFtZSlcbiAgICAgIGlmIChkaXJEZWYpIHtcbiAgICAgICAgZGlycy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBkaXJOYW1lLFxuICAgICAgICAgIGRlc2NyaXB0b3JzOiBkaXJQYXJzZXIucGFyc2UodmFsdWUpLFxuICAgICAgICAgIGRlZjogZGlyRGVmXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjb25maWcuaW50ZXJwb2xhdGUpIHtcbiAgICAgIGRpciA9IGNvbGxlY3RBdHRyRGlyZWN0aXZlKG5hbWUsIHZhbHVlLCBvcHRpb25zKVxuICAgICAgaWYgKGRpcikge1xuICAgICAgICBkaXJzLnB1c2goZGlyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBzb3J0IGJ5IHByaW9yaXR5LCBMT1cgdG8gSElHSFxuICBpZiAoZGlycy5sZW5ndGgpIHtcbiAgICBkaXJzLnNvcnQoZGlyZWN0aXZlQ29tcGFyYXRvcilcbiAgICByZXR1cm4gbWFrZU5vZGVMaW5rRm4oZGlycylcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBtYXAgKE9iamVjdCkgb2YgYXR0cmlidXRlcyB0byBhbiBBcnJheS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBtYXBUb0xpc3QgKG1hcCkge1xuICB2YXIgbGlzdCA9IFtdXG4gIGZvciAodmFyIGtleSBpbiBtYXApIHtcbiAgICBsaXN0LnB1c2goe1xuICAgICAgbmFtZToga2V5LFxuICAgICAgdmFsdWU6IG1hcFtrZXldXG4gICAgfSlcbiAgfVxuICByZXR1cm4gbGlzdFxufVxuXG4vKipcbiAqIEJ1aWxkIGEgbGluayBmdW5jdGlvbiBmb3IgYWxsIGRpcmVjdGl2ZXMgb24gYSBzaW5nbGUgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBkaXJlY3RpdmVzXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gZGlyZWN0aXZlc0xpbmtGblxuICovXG5cbmZ1bmN0aW9uIG1ha2VOb2RlTGlua0ZuIChkaXJlY3RpdmVzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBub2RlTGlua0ZuICh2bSwgZWwsIGhvc3QpIHtcbiAgICAvLyByZXZlcnNlIGFwcGx5IGJlY2F1c2UgaXQncyBzb3J0ZWQgbG93IHRvIGhpZ2hcbiAgICB2YXIgaSA9IGRpcmVjdGl2ZXMubGVuZ3RoXG4gICAgdmFyIGRpciwgaiwga1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGRpciA9IGRpcmVjdGl2ZXNbaV1cbiAgICAgIGlmIChkaXIuX2xpbmspIHtcbiAgICAgICAgLy8gY3VzdG9tIGxpbmsgZm5cbiAgICAgICAgZGlyLl9saW5rKHZtLCBlbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGsgPSBkaXIuZGVzY3JpcHRvcnMubGVuZ3RoXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBrOyBqKyspIHtcbiAgICAgICAgICB2bS5fYmluZERpcihkaXIubmFtZSwgZWwsXG4gICAgICAgICAgICBkaXIuZGVzY3JpcHRvcnNbal0sIGRpci5kZWYsIGhvc3QpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBhbiBhdHRyaWJ1dGUgZm9yIHBvdGVudGlhbCBkeW5hbWljIGJpbmRpbmdzLFxuICogYW5kIHJldHVybiBhIGRpcmVjdGl2ZSBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5mdW5jdGlvbiBjb2xsZWN0QXR0ckRpcmVjdGl2ZSAobmFtZSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UodmFsdWUpXG4gIGlmICh0b2tlbnMpIHtcbiAgICB2YXIgZGVmID0gb3B0aW9ucy5kaXJlY3RpdmVzLmF0dHJcbiAgICB2YXIgaSA9IHRva2Vucy5sZW5ndGhcbiAgICB2YXIgYWxsT25lVGltZSA9IHRydWVcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB2YXIgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICAgIGlmICh0b2tlbi50YWcgJiYgIXRva2VuLm9uZVRpbWUpIHtcbiAgICAgICAgYWxsT25lVGltZSA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBkZWY6IGRlZixcbiAgICAgIF9saW5rOiBhbGxPbmVUaW1lXG4gICAgICAgID8gZnVuY3Rpb24gKHZtLCBlbCkge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKG5hbWUsIHZtLiRpbnRlcnBvbGF0ZSh2YWx1ZSkpXG4gICAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uICh2bSwgZWwpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRleHRQYXJzZXIudG9rZW5zVG9FeHAodG9rZW5zLCB2bSlcbiAgICAgICAgICAgIHZhciBkZXNjID0gZGlyUGFyc2VyLnBhcnNlKG5hbWUgKyAnOicgKyB2YWx1ZSlbMF1cbiAgICAgICAgICAgIHZtLl9iaW5kRGlyKCdhdHRyJywgZWwsIGRlc2MsIGRlZilcbiAgICAgICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGlyZWN0aXZlIHByaW9yaXR5IHNvcnQgY29tcGFyYXRvclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhXG4gKiBAcGFyYW0ge09iamVjdH0gYlxuICovXG5cbmZ1bmN0aW9uIGRpcmVjdGl2ZUNvbXBhcmF0b3IgKGEsIGIpIHtcbiAgYSA9IGEuZGVmLnByaW9yaXR5IHx8IDBcbiAgYiA9IGIuZGVmLnByaW9yaXR5IHx8IDBcbiAgcmV0dXJuIGEgPiBiID8gMSA6IC0xXG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhbiBlbGVtZW50IGlzIHRyYW5zY2x1ZGVkXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG52YXIgdHJhbnNjbHVkZWRGbGFnQXR0ciA9ICdfX3Z1ZV9fdHJhbnNjbHVkZWQnXG5mdW5jdGlvbiBjaGVja1RyYW5zY2x1c2lvbiAoZWwpIHtcbiAgaWYgKGVsLm5vZGVUeXBlID09PSAxICYmIGVsLmhhc0F0dHJpYnV0ZSh0cmFuc2NsdWRlZEZsYWdBdHRyKSkge1xuICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSh0cmFuc2NsdWRlZEZsYWdBdHRyKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcbnZhciB0cmFuc2NsdWRlZEZsYWdBdHRyID0gJ19fdnVlX190cmFuc2NsdWRlZCdcblxuLyoqXG4gKiBQcm9jZXNzIGFuIGVsZW1lbnQgb3IgYSBEb2N1bWVudEZyYWdtZW50IGJhc2VkIG9uIGFcbiAqIGluc3RhbmNlIG9wdGlvbiBvYmplY3QuIFRoaXMgYWxsb3dzIHVzIHRvIHRyYW5zY2x1ZGVcbiAqIGEgdGVtcGxhdGUgbm9kZS9mcmFnbWVudCBiZWZvcmUgdGhlIGluc3RhbmNlIGlzIGNyZWF0ZWQsXG4gKiBzbyB0aGUgcHJvY2Vzc2VkIGZyYWdtZW50IGNhbiB0aGVuIGJlIGNsb25lZCBhbmQgcmV1c2VkXG4gKiBpbiB2LXJlcGVhdC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNjbHVkZSAoZWwsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5fYXNDb21wb25lbnQpIHtcbiAgICAvLyBleHRyYWN0IGNvbnRhaW5lciBhdHRyaWJ1dGVzIHRvIHBhc3MgdGhlbSBkb3duXG4gICAgLy8gdG8gY29tcGlsZXIsIGJlY2F1c2UgdGhleSBuZWVkIHRvIGJlIGNvbXBpbGVkIGluXG4gICAgLy8gcGFyZW50IHNjb3BlLiB3ZSBhcmUgbXV0YXRpbmcgdGhlIG9wdGlvbnMgb2JqZWN0IGhlcmVcbiAgICAvLyBhc3N1bWluZyB0aGUgc2FtZSBvYmplY3Qgd2lsbCBiZSB1c2VkIGZvciBjb21waWxlXG4gICAgLy8gcmlnaHQgYWZ0ZXIgdGhpcy5cbiAgICBvcHRpb25zLl9jb250YWluZXJBdHRycyA9IGV4dHJhY3RBdHRycyhlbClcbiAgICAvLyBNYXJrIGNvbnRlbnQgbm9kZXMgYW5kIGF0dHJzIHNvIHRoYXQgdGhlIGNvbXBpbGVyXG4gICAgLy8ga25vd3MgdGhleSBzaG91bGQgYmUgY29tcGlsZWQgaW4gcGFyZW50IHNjb3BlLlxuICAgIHZhciBpID0gZWwuY2hpbGROb2Rlcy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICB2YXIgbm9kZSA9IGVsLmNoaWxkTm9kZXNbaV1cbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHRyYW5zY2x1ZGVkRmxhZ0F0dHIsICcnKVxuICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAzICYmIG5vZGUuZGF0YS50cmltKCkpIHtcbiAgICAgICAgLy8gd3JhcCB0cmFuc2NsdWRlZCB0ZXh0Tm9kZXMgaW4gc3BhbnMsIGJlY2F1c2VcbiAgICAgICAgLy8gcmF3IHRleHROb2RlcyBjYW4ndCBiZSBwZXJzaXN0ZWQgdGhyb3VnaCBjbG9uZXNcbiAgICAgICAgLy8gYnkgYXR0YWNoaW5nIGF0dHJpYnV0ZXMuXG4gICAgICAgIHZhciB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIHdyYXBwZXIudGV4dENvbnRlbnQgPSBub2RlLmRhdGFcbiAgICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoJ19fdnVlX193cmFwJywgJycpXG4gICAgICAgIHdyYXBwZXIuc2V0QXR0cmlidXRlKHRyYW5zY2x1ZGVkRmxhZ0F0dHIsICcnKVxuICAgICAgICBlbC5yZXBsYWNlQ2hpbGQod3JhcHBlciwgbm9kZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gZm9yIHRlbXBsYXRlIHRhZ3MsIHdoYXQgd2Ugd2FudCBpcyBpdHMgY29udGVudCBhc1xuICAvLyBhIGRvY3VtZW50RnJhZ21lbnQgKGZvciBibG9jayBpbnN0YW5jZXMpXG4gIGlmIChlbC50YWdOYW1lID09PSAnVEVNUExBVEUnKSB7XG4gICAgZWwgPSB0ZW1wbGF0ZVBhcnNlci5wYXJzZShlbClcbiAgfVxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnRlbXBsYXRlKSB7XG4gICAgZWwgPSB0cmFuc2NsdWRlVGVtcGxhdGUoZWwsIG9wdGlvbnMpXG4gIH1cbiAgaWYgKGVsIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCkge1xuICAgIF8ucHJlcGVuZChkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXN0YXJ0JyksIGVsKVxuICAgIGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtZW5kJykpXG4gIH1cbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogUHJvY2VzcyB0aGUgdGVtcGxhdGUgb3B0aW9uLlxuICogSWYgdGhlIHJlcGxhY2Ugb3B0aW9uIGlzIHRydWUgdGhpcyB3aWxsIHN3YXAgdGhlICRlbC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIHRyYW5zY2x1ZGVUZW1wbGF0ZSAoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIHRlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZVxuICB2YXIgZnJhZyA9IHRlbXBsYXRlUGFyc2VyLnBhcnNlKHRlbXBsYXRlLCB0cnVlKVxuICBpZiAoIWZyYWcpIHtcbiAgICBfLndhcm4oJ0ludmFsaWQgdGVtcGxhdGUgb3B0aW9uOiAnICsgdGVtcGxhdGUpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHJhd0NvbnRlbnQgPSBvcHRpb25zLl9jb250ZW50IHx8IF8uZXh0cmFjdENvbnRlbnQoZWwpXG4gICAgdmFyIHJlcGxhY2VyID0gZnJhZy5maXJzdENoaWxkXG4gICAgaWYgKG9wdGlvbnMucmVwbGFjZSkge1xuICAgICAgaWYgKFxuICAgICAgICBmcmFnLmNoaWxkTm9kZXMubGVuZ3RoID4gMSB8fFxuICAgICAgICByZXBsYWNlci5ub2RlVHlwZSAhPT0gMSB8fFxuICAgICAgICAvLyB3aGVuIHJvb3Qgbm9kZSBoYXMgdi1yZXBlYXQsIHRoZSBpbnN0YW5jZSBlbmRzIHVwXG4gICAgICAgIC8vIGhhdmluZyBtdWx0aXBsZSB0b3AtbGV2ZWwgbm9kZXMsIHRodXMgYmVjb21pbmcgYVxuICAgICAgICAvLyBibG9jayBpbnN0YW5jZS4gKCM4MzUpXG4gICAgICAgIHJlcGxhY2VyLmhhc0F0dHJpYnV0ZShjb25maWcucHJlZml4ICsgJ3JlcGVhdCcpXG4gICAgICApIHtcbiAgICAgICAgdHJhbnNjbHVkZUNvbnRlbnQoZnJhZywgcmF3Q29udGVudClcbiAgICAgICAgcmV0dXJuIGZyYWdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuX3JlcGxhY2VyQXR0cnMgPSBleHRyYWN0QXR0cnMocmVwbGFjZXIpXG4gICAgICAgIG1lcmdlQXR0cnMoZWwsIHJlcGxhY2VyKVxuICAgICAgICB0cmFuc2NsdWRlQ29udGVudChyZXBsYWNlciwgcmF3Q29udGVudClcbiAgICAgICAgcmV0dXJuIHJlcGxhY2VyXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsLmFwcGVuZENoaWxkKGZyYWcpXG4gICAgICB0cmFuc2NsdWRlQ29udGVudChlbCwgcmF3Q29udGVudClcbiAgICAgIHJldHVybiBlbFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlc29sdmUgPGNvbnRlbnQ+IGluc2VydGlvbiBwb2ludHMgbWltaWNraW5nIHRoZSBiZWhhdmlvclxuICogb2YgdGhlIFNoYWRvdyBET00gc3BlYzpcbiAqXG4gKiAgIGh0dHA6Ly93M2MuZ2l0aHViLmlvL3dlYmNvbXBvbmVudHMvc3BlYy9zaGFkb3cvI2luc2VydGlvbi1wb2ludHNcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gcmF3XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNjbHVkZUNvbnRlbnQgKGVsLCByYXcpIHtcbiAgdmFyIG91dGxldHMgPSBnZXRPdXRsZXRzKGVsKVxuICB2YXIgaSA9IG91dGxldHMubGVuZ3RoXG4gIGlmICghaSkgcmV0dXJuXG4gIHZhciBvdXRsZXQsIHNlbGVjdCwgc2VsZWN0ZWQsIGosIG1haW5cblxuICBmdW5jdGlvbiBpc0RpcmVjdENoaWxkIChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUucGFyZW50Tm9kZSA9PT0gcmF3XG4gIH1cblxuICAvLyBmaXJzdCBwYXNzLCBjb2xsZWN0IGNvcnJlc3BvbmRpbmcgY29udGVudFxuICAvLyBmb3IgZWFjaCBvdXRsZXQuXG4gIHdoaWxlIChpLS0pIHtcbiAgICBvdXRsZXQgPSBvdXRsZXRzW2ldXG4gICAgaWYgKHJhdykge1xuICAgICAgc2VsZWN0ID0gb3V0bGV0LmdldEF0dHJpYnV0ZSgnc2VsZWN0JylcbiAgICAgIGlmIChzZWxlY3QpIHsgIC8vIHNlbGVjdCBjb250ZW50XG4gICAgICAgIHNlbGVjdGVkID0gcmF3LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0KVxuICAgICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gYWNjb3JkaW5nIHRvIFNoYWRvdyBET00gc3BlYywgYHNlbGVjdGAgY2FuXG4gICAgICAgICAgLy8gb25seSBzZWxlY3QgZGlyZWN0IGNoaWxkcmVuIG9mIHRoZSBob3N0IG5vZGUuXG4gICAgICAgICAgLy8gZW5mb3JjaW5nIHRoaXMgYWxzbyBmaXhlcyAjNzg2LlxuICAgICAgICAgIHNlbGVjdGVkID0gW10uZmlsdGVyLmNhbGwoc2VsZWN0ZWQsIGlzRGlyZWN0Q2hpbGQpXG4gICAgICAgIH1cbiAgICAgICAgb3V0bGV0LmNvbnRlbnQgPSBzZWxlY3RlZC5sZW5ndGhcbiAgICAgICAgICA/IHNlbGVjdGVkXG4gICAgICAgICAgOiBfLnRvQXJyYXkob3V0bGV0LmNoaWxkTm9kZXMpXG4gICAgICB9IGVsc2UgeyAvLyBkZWZhdWx0IGNvbnRlbnRcbiAgICAgICAgbWFpbiA9IG91dGxldFxuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIGZhbGxiYWNrIGNvbnRlbnRcbiAgICAgIG91dGxldC5jb250ZW50ID0gXy50b0FycmF5KG91dGxldC5jaGlsZE5vZGVzKVxuICAgIH1cbiAgfVxuICAvLyBzZWNvbmQgcGFzcywgYWN0dWFsbHkgaW5zZXJ0IHRoZSBjb250ZW50c1xuICBmb3IgKGkgPSAwLCBqID0gb3V0bGV0cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICBvdXRsZXQgPSBvdXRsZXRzW2ldXG4gICAgaWYgKG91dGxldCAhPT0gbWFpbikge1xuICAgICAgaW5zZXJ0Q29udGVudEF0KG91dGxldCwgb3V0bGV0LmNvbnRlbnQpXG4gICAgfVxuICB9XG4gIC8vIGZpbmFsbHkgaW5zZXJ0IHRoZSBtYWluIGNvbnRlbnRcbiAgaWYgKG1haW4pIHtcbiAgICBpbnNlcnRDb250ZW50QXQobWFpbiwgXy50b0FycmF5KHJhdy5jaGlsZE5vZGVzKSlcbiAgfVxufVxuXG4vKipcbiAqIEdldCA8Y29udGVudD4gb3V0bGV0cyBmcm9tIHRoZSBlbGVtZW50L2xpc3RcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8QXJyYXl9IGVsXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG52YXIgY29uY2F0ID0gW10uY29uY2F0XG5mdW5jdGlvbiBnZXRPdXRsZXRzIChlbCkge1xuICByZXR1cm4gXy5pc0FycmF5KGVsKVxuICAgID8gY29uY2F0LmFwcGx5KFtdLCBlbC5tYXAoZ2V0T3V0bGV0cykpXG4gICAgOiBlbC5xdWVyeVNlbGVjdG9yQWxsXG4gICAgICA/IF8udG9BcnJheShlbC5xdWVyeVNlbGVjdG9yQWxsKCdjb250ZW50JykpXG4gICAgICA6IFtdXG59XG5cbi8qKlxuICogSW5zZXJ0IGFuIGFycmF5IG9mIG5vZGVzIGF0IG91dGxldCxcbiAqIHRoZW4gcmVtb3ZlIHRoZSBvdXRsZXQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBvdXRsZXRcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbnRlbnRzXG4gKi9cblxuZnVuY3Rpb24gaW5zZXJ0Q29udGVudEF0IChvdXRsZXQsIGNvbnRlbnRzKSB7XG4gIC8vIG5vdCB1c2luZyB1dGlsIERPTSBtZXRob2RzIGhlcmUgYmVjYXVzZVxuICAvLyBwYXJlbnROb2RlIGNhbiBiZSBjYWNoZWRcbiAgdmFyIHBhcmVudCA9IG91dGxldC5wYXJlbnROb2RlXG4gIGZvciAodmFyIGkgPSAwLCBqID0gY29udGVudHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgcGFyZW50Lmluc2VydEJlZm9yZShjb250ZW50c1tpXSwgb3V0bGV0KVxuICB9XG4gIHBhcmVudC5yZW1vdmVDaGlsZChvdXRsZXQpXG59XG5cbi8qKlxuICogSGVscGVyIHRvIGV4dHJhY3QgYSBjb21wb25lbnQgY29udGFpbmVyJ3MgYXR0cmlidXRlIG5hbWVzXG4gKiBpbnRvIGEgbWFwLiBUaGUgcmVzdWx0aW5nIG1hcCB3aWxsIGJlIHVzZWQgaW4gY29tcGlsZXIgdG9cbiAqIGRldGVybWluZSB3aGV0aGVyIGFuIGF0dHJpYnV0ZSBpcyB0cmFuc2NsdWRlZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKi9cblxuZnVuY3Rpb24gZXh0cmFjdEF0dHJzIChlbCkge1xuICB2YXIgYXR0cnMgPSBlbC5hdHRyaWJ1dGVzXG4gIHZhciByZXMgPSB7fVxuICB2YXIgaSA9IGF0dHJzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgcmVzW2F0dHJzW2ldLm5hbWVdID0gYXR0cnNbaV0udmFsdWVcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogTWVyZ2UgdGhlIGF0dHJpYnV0ZXMgb2YgdHdvIGVsZW1lbnRzLCBhbmQgbWFrZSBzdXJlXG4gKiB0aGUgY2xhc3MgbmFtZXMgYXJlIG1lcmdlZCBwcm9wZXJseS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGZyb21cbiAqIEBwYXJhbSB7RWxlbWVudH0gdG9cbiAqL1xuXG5mdW5jdGlvbiBtZXJnZUF0dHJzIChmcm9tLCB0bykge1xuICB2YXIgYXR0cnMgPSBmcm9tLmF0dHJpYnV0ZXNcbiAgdmFyIGkgPSBhdHRycy5sZW5ndGhcbiAgdmFyIG5hbWUsIHZhbHVlXG4gIHdoaWxlIChpLS0pIHtcbiAgICBuYW1lID0gYXR0cnNbaV0ubmFtZVxuICAgIHZhbHVlID0gYXR0cnNbaV0udmFsdWVcbiAgICBpZiAoIXRvLmhhc0F0dHJpYnV0ZShuYW1lKSkge1xuICAgICAgdG8uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKVxuICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgdG8uY2xhc3NOYW1lID0gdG8uY2xhc3NOYW1lICsgJyAnICsgdmFsdWVcbiAgICB9XG4gIH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgICogVGhlIHByZWZpeCB0byBsb29rIGZvciB3aGVuIHBhcnNpbmcgZGlyZWN0aXZlcy5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG5cbiAgcHJlZml4OiAndi0nLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHByaW50IGRlYnVnIG1lc3NhZ2VzLlxuICAgKiBBbHNvIGVuYWJsZXMgc3RhY2sgdHJhY2UgZm9yIHdhcm5pbmdzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgZGVidWc6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHN1cHByZXNzIHdhcm5pbmdzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgc2lsZW50OiBmYWxzZSxcblxuICAvKipcbiAgICogV2hldGhlciBhbGxvdyBvYnNlcnZlciB0byBhbHRlciBkYXRhIG9iamVjdHMnXG4gICAqIF9fcHJvdG9fXy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIHByb3RvOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHBhcnNlIG11c3RhY2hlIHRhZ3MgaW4gdGVtcGxhdGVzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgaW50ZXJwb2xhdGU6IHRydWUsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gdXNlIGFzeW5jIHJlbmRlcmluZy5cbiAgICovXG5cbiAgYXN5bmM6IHRydWUsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gd2FybiBhZ2FpbnN0IGVycm9ycyBjYXVnaHQgd2hlbiBldmFsdWF0aW5nXG4gICAqIGV4cHJlc3Npb25zLlxuICAgKi9cblxuICB3YXJuRXhwcmVzc2lvbkVycm9yczogdHJ1ZSxcblxuICAvKipcbiAgICogSW50ZXJuYWwgZmxhZyB0byBpbmRpY2F0ZSB0aGUgZGVsaW1pdGVycyBoYXZlIGJlZW5cbiAgICogY2hhbmdlZC5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuXG4gIF9kZWxpbWl0ZXJzQ2hhbmdlZDogdHJ1ZVxuXG59XG5cbi8qKlxuICogSW50ZXJwb2xhdGlvbiBkZWxpbWl0ZXJzLlxuICogV2UgbmVlZCB0byBtYXJrIHRoZSBjaGFuZ2VkIGZsYWcgc28gdGhhdCB0aGUgdGV4dCBwYXJzZXJcbiAqIGtub3dzIGl0IG5lZWRzIHRvIHJlY29tcGlsZSB0aGUgcmVnZXguXG4gKlxuICogQHR5cGUge0FycmF5PFN0cmluZz59XG4gKi9cblxudmFyIGRlbGltaXRlcnMgPSBbJ3t7JywgJ319J11cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUuZXhwb3J0cywgJ2RlbGltaXRlcnMnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBkZWxpbWl0ZXJzXG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgIGRlbGltaXRlcnMgPSB2YWxcbiAgICB0aGlzLl9kZWxpbWl0ZXJzQ2hhbmdlZCA9IHRydWVcbiAgfVxufSkiLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxudmFyIFdhdGNoZXIgPSByZXF1aXJlKCcuL3dhdGNoZXInKVxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcnMvdGV4dCcpXG52YXIgZXhwUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIGxpbmtzIGEgRE9NIGVsZW1lbnQgd2l0aCBhIHBpZWNlIG9mIGRhdGEsXG4gKiB3aGljaCBpcyB0aGUgcmVzdWx0IG9mIGV2YWx1YXRpbmcgYW4gZXhwcmVzc2lvbi5cbiAqIEl0IHJlZ2lzdGVycyBhIHdhdGNoZXIgd2l0aCB0aGUgZXhwcmVzc2lvbiBhbmQgY2FsbHNcbiAqIHRoZSBET00gdXBkYXRlIGZ1bmN0aW9uIHdoZW4gYSBjaGFuZ2UgaXMgdHJpZ2dlcmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge05vZGV9IGVsXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjcmlwdG9yXG4gKiAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfSBleHByZXNzaW9uXG4gKiAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfSBbYXJnXVxuICogICAgICAgICAgICAgICAgIC0ge0FycmF5PE9iamVjdD59IFtmaWx0ZXJzXVxuICogQHBhcmFtIHtPYmplY3R9IGRlZiAtIGRpcmVjdGl2ZSBkZWZpbml0aW9uIG9iamVjdFxuICogQHBhcmFtIHtWdWV8dW5kZWZpbmVkfSBob3N0IC0gdHJhbnNjbHVzaW9uIGhvc3QgdGFyZ2V0XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBEaXJlY3RpdmUgKG5hbWUsIGVsLCB2bSwgZGVzY3JpcHRvciwgZGVmLCBob3N0KSB7XG4gIC8vIHB1YmxpY1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuZWwgPSBlbFxuICB0aGlzLnZtID0gdm1cbiAgLy8gY29weSBkZXNjcmlwdG9yIHByb3BzXG4gIHRoaXMucmF3ID0gZGVzY3JpcHRvci5yYXdcbiAgdGhpcy5leHByZXNzaW9uID0gZGVzY3JpcHRvci5leHByZXNzaW9uXG4gIHRoaXMuYXJnID0gZGVzY3JpcHRvci5hcmdcbiAgdGhpcy5maWx0ZXJzID0gXy5yZXNvbHZlRmlsdGVycyh2bSwgZGVzY3JpcHRvci5maWx0ZXJzKVxuICAvLyBwcml2YXRlXG4gIHRoaXMuX2Rlc2NyaXB0b3IgPSBkZXNjcmlwdG9yXG4gIHRoaXMuX2hvc3QgPSBob3N0XG4gIHRoaXMuX2xvY2tlZCA9IGZhbHNlXG4gIHRoaXMuX2JvdW5kID0gZmFsc2VcbiAgLy8gaW5pdFxuICB0aGlzLl9iaW5kKGRlZilcbn1cblxudmFyIHAgPSBEaXJlY3RpdmUucHJvdG90eXBlXG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgZGlyZWN0aXZlLCBtaXhpbiBkZWZpbml0aW9uIHByb3BlcnRpZXMsXG4gKiBzZXR1cCB0aGUgd2F0Y2hlciwgY2FsbCBkZWZpbml0aW9uIGJpbmQoKSBhbmQgdXBkYXRlKClcbiAqIGlmIHByZXNlbnQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGRlZlxuICovXG5cbnAuX2JpbmQgPSBmdW5jdGlvbiAoZGVmKSB7XG4gIGlmICh0aGlzLm5hbWUgIT09ICdjbG9haycgJiYgdGhpcy5lbCAmJiB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSkge1xuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKGNvbmZpZy5wcmVmaXggKyB0aGlzLm5hbWUpXG4gIH1cbiAgaWYgKHR5cGVvZiBkZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLnVwZGF0ZSA9IGRlZlxuICB9IGVsc2Uge1xuICAgIF8uZXh0ZW5kKHRoaXMsIGRlZilcbiAgfVxuICB0aGlzLl93YXRjaGVyRXhwID0gdGhpcy5leHByZXNzaW9uXG4gIHRoaXMuX2NoZWNrRHluYW1pY0xpdGVyYWwoKVxuICBpZiAodGhpcy5iaW5kKSB7XG4gICAgdGhpcy5iaW5kKClcbiAgfVxuICBpZiAodGhpcy5fd2F0Y2hlckV4cCAmJlxuICAgICAgKHRoaXMudXBkYXRlIHx8IHRoaXMudHdvV2F5KSAmJlxuICAgICAgKCF0aGlzLmlzTGl0ZXJhbCB8fCB0aGlzLl9pc0R5bmFtaWNMaXRlcmFsKSAmJlxuICAgICAgIXRoaXMuX2NoZWNrU3RhdGVtZW50KCkpIHtcbiAgICAvLyB3cmFwcGVkIHVwZGF0ZXIgZm9yIGNvbnRleHRcbiAgICB2YXIgZGlyID0gdGhpc1xuICAgIHZhciB1cGRhdGUgPSB0aGlzLl91cGRhdGUgPSB0aGlzLnVwZGF0ZVxuICAgICAgPyBmdW5jdGlvbiAodmFsLCBvbGRWYWwpIHtcbiAgICAgICAgICBpZiAoIWRpci5fbG9ja2VkKSB7XG4gICAgICAgICAgICBkaXIudXBkYXRlKHZhbCwgb2xkVmFsKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgOiBmdW5jdGlvbiAoKSB7fSAvLyBub29wIGlmIG5vIHVwZGF0ZSBpcyBwcm92aWRlZFxuICAgIC8vIHVzZSByYXcgZXhwcmVzc2lvbiBhcyBpZGVudGlmaWVyIGJlY2F1c2UgZmlsdGVyc1xuICAgIC8vIG1ha2UgdGhlbSBkaWZmZXJlbnQgd2F0Y2hlcnNcbiAgICB2YXIgd2F0Y2hlciA9IHRoaXMudm0uX3dhdGNoZXJzW3RoaXMucmF3XVxuICAgIC8vIHYtcmVwZWF0IGFsd2F5cyBjcmVhdGVzIGEgbmV3IHdhdGNoZXIgYmVjYXVzZSBpdCBoYXNcbiAgICAvLyBhIHNwZWNpYWwgZmlsdGVyIHRoYXQncyBib3VuZCB0byBpdHMgZGlyZWN0aXZlXG4gICAgLy8gaW5zdGFuY2UuXG4gICAgaWYgKCF3YXRjaGVyIHx8IHRoaXMubmFtZSA9PT0gJ3JlcGVhdCcpIHtcbiAgICAgIHdhdGNoZXIgPSB0aGlzLnZtLl93YXRjaGVyc1t0aGlzLnJhd10gPSBuZXcgV2F0Y2hlcihcbiAgICAgICAgdGhpcy52bSxcbiAgICAgICAgdGhpcy5fd2F0Y2hlckV4cCxcbiAgICAgICAgdXBkYXRlLCAvLyBjYWxsYmFja1xuICAgICAgICB7XG4gICAgICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJzLFxuICAgICAgICAgIHR3b1dheTogdGhpcy50d29XYXksXG4gICAgICAgICAgZGVlcDogdGhpcy5kZWVwXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgd2F0Y2hlci5hZGRDYih1cGRhdGUpXG4gICAgfVxuICAgIHRoaXMuX3dhdGNoZXIgPSB3YXRjaGVyXG4gICAgaWYgKHRoaXMuX2luaXRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB3YXRjaGVyLnNldCh0aGlzLl9pbml0VmFsdWUpXG4gICAgfSBlbHNlIGlmICh0aGlzLnVwZGF0ZSkge1xuICAgICAgdGhpcy51cGRhdGUod2F0Y2hlci52YWx1ZSlcbiAgICB9XG4gIH1cbiAgdGhpcy5fYm91bmQgPSB0cnVlXG59XG5cbi8qKlxuICogY2hlY2sgaWYgdGhpcyBpcyBhIGR5bmFtaWMgbGl0ZXJhbCBiaW5kaW5nLlxuICpcbiAqIGUuZy4gdi1jb21wb25lbnQ9XCJ7e2N1cnJlbnRWaWV3fX1cIlxuICovXG5cbnAuX2NoZWNrRHluYW1pY0xpdGVyYWwgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBleHByZXNzaW9uID0gdGhpcy5leHByZXNzaW9uXG4gIGlmIChleHByZXNzaW9uICYmIHRoaXMuaXNMaXRlcmFsKSB7XG4gICAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UoZXhwcmVzc2lvbilcbiAgICBpZiAodG9rZW5zKSB7XG4gICAgICB2YXIgZXhwID0gdGV4dFBhcnNlci50b2tlbnNUb0V4cCh0b2tlbnMpXG4gICAgICB0aGlzLmV4cHJlc3Npb24gPSB0aGlzLnZtLiRnZXQoZXhwKVxuICAgICAgdGhpcy5fd2F0Y2hlckV4cCA9IGV4cFxuICAgICAgdGhpcy5faXNEeW5hbWljTGl0ZXJhbCA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgZGlyZWN0aXZlIGlzIGEgZnVuY3Rpb24gY2FsbGVyXG4gKiBhbmQgaWYgdGhlIGV4cHJlc3Npb24gaXMgYSBjYWxsYWJsZSBvbmUuIElmIGJvdGggdHJ1ZSxcbiAqIHdlIHdyYXAgdXAgdGhlIGV4cHJlc3Npb24gYW5kIHVzZSBpdCBhcyB0aGUgZXZlbnRcbiAqIGhhbmRsZXIuXG4gKlxuICogZS5nLiB2LW9uPVwiY2xpY2s6IGErK1wiXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5wLl9jaGVja1N0YXRlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV4cHJlc3Npb24gPSB0aGlzLmV4cHJlc3Npb25cbiAgaWYgKFxuICAgIGV4cHJlc3Npb24gJiYgdGhpcy5hY2NlcHRTdGF0ZW1lbnQgJiZcbiAgICAhZXhwUGFyc2VyLmlzU2ltcGxlUGF0aChleHByZXNzaW9uKVxuICApIHtcbiAgICB2YXIgZm4gPSBleHBQYXJzZXIucGFyc2UoZXhwcmVzc2lvbikuZ2V0XG4gICAgdmFyIHZtID0gdGhpcy52bVxuICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgZm4uY2FsbCh2bSwgdm0pXG4gICAgfVxuICAgIGlmICh0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGhhbmRsZXIgPSBfLmFwcGx5RmlsdGVycyhcbiAgICAgICAgaGFuZGxlcixcbiAgICAgICAgdGhpcy5maWx0ZXJzLnJlYWQsXG4gICAgICAgIHZtXG4gICAgICApXG4gICAgfVxuICAgIHRoaXMudXBkYXRlKGhhbmRsZXIpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBhbiBhdHRyaWJ1dGUgZGlyZWN0aXZlIHBhcmFtLCBlLmcuIGxhenlcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbnAuX2NoZWNrUGFyYW0gPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgcGFyYW0gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShuYW1lKVxuICBpZiAocGFyYW0gIT09IG51bGwpIHtcbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZShuYW1lKVxuICB9XG4gIHJldHVybiBwYXJhbVxufVxuXG4vKipcbiAqIFRlYXJkb3duIHRoZSB3YXRjaGVyIGFuZCBjYWxsIHVuYmluZC5cbiAqL1xuXG5wLl90ZWFyZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuX2JvdW5kKSB7XG4gICAgaWYgKHRoaXMudW5iaW5kKSB7XG4gICAgICB0aGlzLnVuYmluZCgpXG4gICAgfVxuICAgIHZhciB3YXRjaGVyID0gdGhpcy5fd2F0Y2hlclxuICAgIGlmICh3YXRjaGVyICYmIHdhdGNoZXIuYWN0aXZlKSB7XG4gICAgICB3YXRjaGVyLnJlbW92ZUNiKHRoaXMuX3VwZGF0ZSlcbiAgICAgIGlmICghd2F0Y2hlci5hY3RpdmUpIHtcbiAgICAgICAgdGhpcy52bS5fd2F0Y2hlcnNbdGhpcy5yYXddID0gbnVsbFxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9ib3VuZCA9IGZhbHNlXG4gICAgdGhpcy52bSA9IHRoaXMuZWwgPSB0aGlzLl93YXRjaGVyID0gbnVsbFxuICB9XG59XG5cbi8qKlxuICogU2V0IHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIHdpdGggdGhlIHNldHRlci5cbiAqIFRoaXMgc2hvdWxkIG9ubHkgYmUgdXNlZCBpbiB0d28td2F5IGRpcmVjdGl2ZXNcbiAqIGUuZy4gdi1tb2RlbC5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcHVibGljXG4gKi9cblxucC5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKHRoaXMudHdvV2F5KSB7XG4gICAgdGhpcy5fd2l0aExvY2soZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fd2F0Y2hlci5zZXQodmFsdWUpXG4gICAgfSlcbiAgfVxufVxuXG4vKipcbiAqIEV4ZWN1dGUgYSBmdW5jdGlvbiB3aGlsZSBwcmV2ZW50aW5nIHRoYXQgZnVuY3Rpb24gZnJvbVxuICogdHJpZ2dlcmluZyB1cGRhdGVzIG9uIHRoaXMgZGlyZWN0aXZlIGluc3RhbmNlLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cblxucC5fd2l0aExvY2sgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHNlbGYuX2xvY2tlZCA9IHRydWVcbiAgZm4uY2FsbChzZWxmKVxuICBfLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9sb2NrZWQgPSBmYWxzZVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGl2ZSIsIi8vIHhsaW5rXG52YXIgeGxpbmtOUyA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJ1xudmFyIHhsaW5rUkUgPSAvXnhsaW5rOi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgcHJpb3JpdHk6IDg1MCxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5hbWUgPSB0aGlzLmFyZ1xuICAgIHRoaXMudXBkYXRlID0geGxpbmtSRS50ZXN0KG5hbWUpXG4gICAgICA/IHhsaW5rSGFuZGxlclxuICAgICAgOiBkZWZhdWx0SGFuZGxlclxuICB9XG5cbn1cblxuZnVuY3Rpb24gZGVmYXVsdEhhbmRsZXIgKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMCkge1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKHRoaXMuYXJnLCB2YWx1ZSlcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmFyZylcbiAgfVxufVxuXG5mdW5jdGlvbiB4bGlua0hhbmRsZXIgKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGVOUyh4bGlua05TLCB0aGlzLmFyZywgdmFsdWUpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGVOUyh4bGlua05TLCAnaHJlZicpXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGFkZENsYXNzID0gXy5hZGRDbGFzc1xudmFyIHJlbW92ZUNsYXNzID0gXy5yZW1vdmVDbGFzc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAodGhpcy5hcmcpIHtcbiAgICB2YXIgbWV0aG9kID0gdmFsdWUgPyBhZGRDbGFzcyA6IHJlbW92ZUNsYXNzXG4gICAgbWV0aG9kKHRoaXMuZWwsIHRoaXMuYXJnKVxuICB9IGVsc2Uge1xuICAgIGlmICh0aGlzLmxhc3RWYWwpIHtcbiAgICAgIHJlbW92ZUNsYXNzKHRoaXMuZWwsIHRoaXMubGFzdFZhbClcbiAgICB9XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBhZGRDbGFzcyh0aGlzLmVsLCB2YWx1ZSlcbiAgICAgIHRoaXMubGFzdFZhbCA9IHZhbHVlXG4gICAgfVxuICB9XG59IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy52bS4kb25jZSgnaG9vazpjb21waWxlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShjb25maWcucHJlZml4ICsgJ2Nsb2FrJylcbiAgICB9KVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICAvKipcbiAgICogU2V0dXAuIFR3byBwb3NzaWJsZSB1c2FnZXM6XG4gICAqXG4gICAqIC0gc3RhdGljOlxuICAgKiAgIHYtY29tcG9uZW50PVwiY29tcFwiXG4gICAqXG4gICAqIC0gZHluYW1pYzpcbiAgICogICB2LWNvbXBvbmVudD1cInt7Y3VycmVudFZpZXd9fVwiXG4gICAqL1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuZWwuX192dWVfXykge1xuICAgICAgLy8gY3JlYXRlIGEgcmVmIGFuY2hvclxuICAgICAgdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LWNvbXBvbmVudCcpXG4gICAgICBfLnJlcGxhY2UodGhpcy5lbCwgdGhpcy5yZWYpXG4gICAgICAvLyBjaGVjayBrZWVwLWFsaXZlIG9wdGlvbnMuXG4gICAgICAvLyBJZiB5ZXMsIGluc3RlYWQgb2YgZGVzdHJveWluZyB0aGUgYWN0aXZlIHZtIHdoZW5cbiAgICAgIC8vIGhpZGluZyAodi1pZikgb3Igc3dpdGNoaW5nIChkeW5hbWljIGxpdGVyYWwpIGl0LFxuICAgICAgLy8gd2Ugc2ltcGx5IHJlbW92ZSBpdCBmcm9tIHRoZSBET00gYW5kIHNhdmUgaXQgaW4gYVxuICAgICAgLy8gY2FjaGUgb2JqZWN0LCB3aXRoIGl0cyBjb25zdHJ1Y3RvciBpZCBhcyB0aGUga2V5LlxuICAgICAgdGhpcy5rZWVwQWxpdmUgPSB0aGlzLl9jaGVja1BhcmFtKCdrZWVwLWFsaXZlJykgIT0gbnVsbFxuICAgICAgLy8gY2hlY2sgcmVmXG4gICAgICB0aGlzLnJlZklEID0gXy5hdHRyKHRoaXMuZWwsICdyZWYnKVxuICAgICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgIHRoaXMuY2FjaGUgPSB7fVxuICAgICAgfVxuICAgICAgLy8gY2hlY2sgaW5saW5lLXRlbXBsYXRlXG4gICAgICBpZiAodGhpcy5fY2hlY2tQYXJhbSgnaW5saW5lLXRlbXBsYXRlJykgIT09IG51bGwpIHtcbiAgICAgICAgLy8gZXh0cmFjdCBpbmxpbmUgdGVtcGxhdGUgYXMgYSBEb2N1bWVudEZyYWdtZW50XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBfLmV4dHJhY3RDb250ZW50KHRoaXMuZWwsIHRydWUpXG4gICAgICB9XG4gICAgICAvLyBjb21wb25lbnQgcmVzb2x1dGlvbiByZWxhdGVkIHN0YXRlXG4gICAgICB0aGlzLl9wZW5kaW5nQ2IgPVxuICAgICAgdGhpcy5jdG9ySWQgPVxuICAgICAgdGhpcy5DdG9yID0gbnVsbFxuICAgICAgLy8gaWYgc3RhdGljLCBidWlsZCByaWdodCBub3cuXG4gICAgICBpZiAoIXRoaXMuX2lzRHluYW1pY0xpdGVyYWwpIHtcbiAgICAgICAgdGhpcy5yZXNvbHZlQ3Rvcih0aGlzLmV4cHJlc3Npb24sIF8uYmluZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5idWlsZCgpXG4gICAgICAgICAgY2hpbGQuJGJlZm9yZSh0aGlzLnJlZilcbiAgICAgICAgICB0aGlzLnNldEN1cnJlbnQoY2hpbGQpXG4gICAgICAgIH0sIHRoaXMpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY2hlY2sgZHluYW1pYyBjb21wb25lbnQgcGFyYW1zXG4gICAgICAgIHRoaXMucmVhZHlFdmVudCA9IHRoaXMuX2NoZWNrUGFyYW0oJ3dhaXQtZm9yJylcbiAgICAgICAgdGhpcy50cmFuc01vZGUgPSB0aGlzLl9jaGVja1BhcmFtKCd0cmFuc2l0aW9uLW1vZGUnKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICd2LWNvbXBvbmVudD1cIicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIgY2Fubm90IGJlICcgK1xuICAgICAgICAndXNlZCBvbiBhbiBhbHJlYWR5IG1vdW50ZWQgaW5zdGFuY2UuJ1xuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUHVibGljIHVwZGF0ZSwgY2FsbGVkIGJ5IHRoZSB3YXRjaGVyIGluIHRoZSBkeW5hbWljXG4gICAqIGxpdGVyYWwgc2NlbmFyaW8sIGUuZy4gdi1jb21wb25lbnQ9XCJ7e3ZpZXd9fVwiXG4gICAqL1xuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5yZWFsVXBkYXRlKHZhbHVlKVxuICB9LFxuXG4gIC8qKlxuICAgKiBTd2l0Y2ggZHluYW1pYyBjb21wb25lbnRzLiBNYXkgcmVzb2x2ZSB0aGUgY29tcG9uZW50XG4gICAqIGFzeW5jaHJvbm91c2x5LCBhbmQgcGVyZm9ybSB0cmFuc2l0aW9uIGJhc2VkIG9uXG4gICAqIHNwZWNpZmllZCB0cmFuc2l0aW9uIG1vZGUuIEFjY2VwdHMgYW4gYXN5bmMgY2FsbGJhY2tcbiAgICogd2hpY2ggaXMgY2FsbGVkIHdoZW4gdGhlIHRyYW5zaXRpb24gZW5kcy4gKFRoaXMgaXNcbiAgICogZXhwb3NlZCBmb3IgdnVlLXJvdXRlcilcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAgICovXG5cbiAgcmVhbFVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlLCBjYikge1xuICAgIHRoaXMuaW52YWxpZGF0ZVBlbmRpbmcoKVxuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIC8vIGp1c3QgcmVtb3ZlIGN1cnJlbnRcbiAgICAgIHRoaXMudW5idWlsZCgpXG4gICAgICB0aGlzLnJlbW92ZSh0aGlzLmNoaWxkVk0sIGNiKVxuICAgICAgdGhpcy51bnNldEN1cnJlbnQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc29sdmVDdG9yKHZhbHVlLCBfLmJpbmQoZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnVuYnVpbGQoKVxuICAgICAgICB2YXIgbmV3Q29tcG9uZW50ID0gdGhpcy5idWlsZCgpXG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICBpZiAodGhpcy5yZWFkeUV2ZW50KSB7XG4gICAgICAgICAgbmV3Q29tcG9uZW50LiRvbmNlKHRoaXMucmVhZHlFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5zd2FwVG8obmV3Q29tcG9uZW50LCBjYilcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3dhcFRvKG5ld0NvbXBvbmVudCwgY2IpXG4gICAgICAgIH1cbiAgICAgIH0sIHRoaXMpKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUmVzb2x2ZSB0aGUgY29tcG9uZW50IGNvbnN0cnVjdG9yIHRvIHVzZSB3aGVuIGNyZWF0aW5nXG4gICAqIHRoZSBjaGlsZCB2bS5cbiAgICovXG5cbiAgcmVzb2x2ZUN0b3I6IGZ1bmN0aW9uIChpZCwgY2IpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgcGVuZGluZ0NiID0gdGhpcy5fcGVuZGluZ0NiID0gZnVuY3Rpb24gKGN0b3IpIHtcbiAgICAgIGlmICghcGVuZGluZ0NiLmludmFsaWRhdGVkKSB7XG4gICAgICAgIHNlbGYuY3RvcklkID0gaWRcbiAgICAgICAgc2VsZi5DdG9yID0gY3RvclxuICAgICAgICBjYigpXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudm0uX3Jlc29sdmVDb21wb25lbnQoaWQsIHBlbmRpbmdDYilcbiAgfSxcblxuICAvKipcbiAgICogV2hlbiB0aGUgY29tcG9uZW50IGNoYW5nZXMgb3IgdW5iaW5kcyBiZWZvcmUgYW4gYXN5bmNcbiAgICogY29uc3RydWN0b3IgaXMgcmVzb2x2ZWQsIHdlIG5lZWQgdG8gaW52YWxpZGF0ZSBpdHNcbiAgICogcGVuZGluZyBjYWxsYmFjay5cbiAgICovXG5cbiAgaW52YWxpZGF0ZVBlbmRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5fcGVuZGluZ0NiKSB7XG4gICAgICB0aGlzLl9wZW5kaW5nQ2IuaW52YWxpZGF0ZWQgPSB0cnVlXG4gICAgICB0aGlzLl9wZW5kaW5nQ2IgPSBudWxsXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBJbnN0YW50aWF0ZS9pbnNlcnQgYSBuZXcgY2hpbGQgdm0uXG4gICAqIElmIGtlZXAgYWxpdmUgYW5kIGhhcyBjYWNoZWQgaW5zdGFuY2UsIGluc2VydCB0aGF0XG4gICAqIGluc3RhbmNlOyBvdGhlcndpc2UgYnVpbGQgYSBuZXcgb25lIGFuZCBjYWNoZSBpdC5cbiAgICpcbiAgICogQHJldHVybiB7VnVlfSAtIHRoZSBjcmVhdGVkIGluc3RhbmNlXG4gICAqL1xuXG4gIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICB2YXIgY2FjaGVkID0gdGhpcy5jYWNoZVt0aGlzLmN0b3JJZF1cbiAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgcmV0dXJuIGNhY2hlZFxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdmFyIGVsID0gdGVtcGxhdGVQYXJzZXIuY2xvbmUodGhpcy5lbClcbiAgICBpZiAodGhpcy5DdG9yKSB7XG4gICAgICB2YXIgY2hpbGQgPSB2bS4kYWRkQ2hpbGQoe1xuICAgICAgICBlbDogZWwsXG4gICAgICAgIHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlLFxuICAgICAgICBfYXNDb21wb25lbnQ6IHRydWUsXG4gICAgICAgIF9ob3N0OiB0aGlzLl9ob3N0XG4gICAgICB9LCB0aGlzLkN0b3IpXG4gICAgICBpZiAodGhpcy5rZWVwQWxpdmUpIHtcbiAgICAgICAgdGhpcy5jYWNoZVt0aGlzLmN0b3JJZF0gPSBjaGlsZFxuICAgICAgfVxuICAgICAgcmV0dXJuIGNoaWxkXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBUZWFyZG93biB0aGUgY3VycmVudCBjaGlsZCwgYnV0IGRlZmVycyBjbGVhbnVwIHNvXG4gICAqIHRoYXQgd2UgY2FuIHNlcGFyYXRlIHRoZSBkZXN0cm95IGFuZCByZW1vdmFsIHN0ZXBzLlxuICAgKi9cblxuICB1bmJ1aWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZFZNXG4gICAgaWYgKCFjaGlsZCB8fCB0aGlzLmtlZXBBbGl2ZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIHRoZSBzb2xlIHB1cnBvc2Ugb2YgYGRlZmVyQ2xlYW51cGAgaXMgc28gdGhhdCB3ZSBjYW5cbiAgICAvLyBcImRlYWN0aXZhdGVcIiB0aGUgdm0gcmlnaHQgbm93IGFuZCBwZXJmb3JtIERPTSByZW1vdmFsXG4gICAgLy8gbGF0ZXIuXG4gICAgY2hpbGQuJGRlc3Ryb3koZmFsc2UsIHRydWUpXG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBjdXJyZW50IGRlc3Ryb3llZCBjaGlsZCBhbmQgbWFudWFsbHkgZG9cbiAgICogdGhlIGNsZWFudXAgYWZ0ZXIgcmVtb3ZhbC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAgICovXG5cbiAgcmVtb3ZlOiBmdW5jdGlvbiAoY2hpbGQsIGNiKSB7XG4gICAgdmFyIGtlZXBBbGl2ZSA9IHRoaXMua2VlcEFsaXZlXG4gICAgaWYgKGNoaWxkKSB7XG4gICAgICBjaGlsZC4kcmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFrZWVwQWxpdmUpIGNoaWxkLl9jbGVhbnVwKClcbiAgICAgICAgaWYgKGNiKSBjYigpXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoY2IpIHtcbiAgICAgIGNiKClcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFjdHVhbGx5IHN3YXAgdGhlIGNvbXBvbmVudHMsIGRlcGVuZGluZyBvbiB0aGVcbiAgICogdHJhbnNpdGlvbiBtb2RlLiBEZWZhdWx0cyB0byBzaW11bHRhbmVvdXMuXG4gICAqXG4gICAqIEBwYXJhbSB7VnVlfSB0YXJnZXRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICAgKi9cblxuICBzd2FwVG86IGZ1bmN0aW9uICh0YXJnZXQsIGNiKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGN1cnJlbnQgPSB0aGlzLmNoaWxkVk1cbiAgICB0aGlzLnVuc2V0Q3VycmVudCgpXG4gICAgdGhpcy5zZXRDdXJyZW50KHRhcmdldClcbiAgICBzd2l0Y2ggKHNlbGYudHJhbnNNb2RlKSB7XG4gICAgICBjYXNlICdpbi1vdXQnOlxuICAgICAgICB0YXJnZXQuJGJlZm9yZShzZWxmLnJlZiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYucmVtb3ZlKGN1cnJlbnQsIGNiKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnb3V0LWluJzpcbiAgICAgICAgc2VsZi5yZW1vdmUoY3VycmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRhcmdldC4kYmVmb3JlKHNlbGYucmVmLCBjYilcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHNlbGYucmVtb3ZlKGN1cnJlbnQpXG4gICAgICAgIHRhcmdldC4kYmVmb3JlKHNlbGYucmVmLCBjYilcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldCBjaGlsZFZNIGFuZCBwYXJlbnQgcmVmXG4gICAqL1xuICBcbiAgc2V0Q3VycmVudDogZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgdGhpcy5jaGlsZFZNID0gY2hpbGRcbiAgICB2YXIgcmVmSUQgPSBjaGlsZC5fcmVmSUQgfHwgdGhpcy5yZWZJRFxuICAgIGlmIChyZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3JlZklEXSA9IGNoaWxkXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVbnNldCBjaGlsZFZNIGFuZCBwYXJlbnQgcmVmXG4gICAqL1xuXG4gIHVuc2V0Q3VycmVudDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRWTVxuICAgIHRoaXMuY2hpbGRWTSA9IG51bGxcbiAgICB2YXIgcmVmSUQgPSAoY2hpbGQgJiYgY2hpbGQuX3JlZklEKSB8fCB0aGlzLnJlZklEXG4gICAgaWYgKHJlZklEKSB7XG4gICAgICB0aGlzLnZtLiRbcmVmSURdID0gbnVsbFxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogVW5iaW5kLlxuICAgKi9cblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmludmFsaWRhdGVQZW5kaW5nKClcbiAgICB0aGlzLnVuYnVpbGQoKVxuICAgIC8vIGRlc3Ryb3kgYWxsIGtlZXAtYWxpdmUgY2FjaGVkIGluc3RhbmNlc1xuICAgIGlmICh0aGlzLmNhY2hlKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5jYWNoZSkge1xuICAgICAgICB0aGlzLmNhY2hlW2tleV0uJGRlc3Ryb3koKVxuICAgICAgfVxuICAgICAgdGhpcy5jYWNoZSA9IG51bGxcbiAgICB9XG4gIH1cblxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy52bS4kJFt0aGlzLmV4cHJlc3Npb25dID0gdGhpcy5lbFxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGRlbGV0ZSB0aGlzLnZtLiQkW3RoaXMuZXhwcmVzc2lvbl1cbiAgfVxuICBcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBhY2NlcHRTdGF0ZW1lbnQ6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuZWwuX192dWVfX1xuICAgIGlmICghY2hpbGQgfHwgdGhpcy52bSAhPT0gY2hpbGQuJHBhcmVudCkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnYHYtZXZlbnRzYCBzaG91bGQgb25seSBiZSB1c2VkIG9uIGEgY2hpbGQgY29tcG9uZW50ICcgK1xuICAgICAgICAnZnJvbSB0aGUgcGFyZW50IHRlbXBsYXRlLidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChoYW5kbGVyLCBvbGRIYW5kbGVyKSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdEaXJlY3RpdmUgXCJ2LWV2ZW50czonICsgdGhpcy5leHByZXNzaW9uICsgJ1wiICcgK1xuICAgICAgICAnZXhwZWN0cyBhIGZ1bmN0aW9uIHZhbHVlLidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgY2hpbGQgPSB0aGlzLmVsLl9fdnVlX19cbiAgICBpZiAob2xkSGFuZGxlcikge1xuICAgICAgY2hpbGQuJG9mZih0aGlzLmFyZywgb2xkSGFuZGxlcilcbiAgICB9XG4gICAgY2hpbGQuJG9uKHRoaXMuYXJnLCBoYW5kbGVyKVxuICB9XG5cbiAgLy8gd2hlbiBjaGlsZCBpcyBkZXN0cm95ZWQsIGFsbCBldmVudHMgYXJlIHR1cm5lZCBvZmYsXG4gIC8vIHNvIG5vIG5lZWQgZm9yIHVuYmluZCBoZXJlLlxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gYSBjb21tZW50IG5vZGUgbWVhbnMgdGhpcyBpcyBhIGJpbmRpbmcgZm9yXG4gICAgLy8ge3t7IGlubGluZSB1bmVzY2FwZWQgaHRtbCB9fX1cbiAgICBpZiAodGhpcy5lbC5ub2RlVHlwZSA9PT0gOCkge1xuICAgICAgLy8gaG9sZCBub2Rlc1xuICAgICAgdGhpcy5ub2RlcyA9IFtdXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFsdWUgPSBfLnRvU3RyaW5nKHZhbHVlKVxuICAgIGlmICh0aGlzLm5vZGVzKSB7XG4gICAgICB0aGlzLnN3YXAodmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gdmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgc3dhcDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgLy8gcmVtb3ZlIG9sZCBub2Rlc1xuICAgIHZhciBpID0gdGhpcy5ub2Rlcy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBfLnJlbW92ZSh0aGlzLm5vZGVzW2ldKVxuICAgIH1cbiAgICAvLyBjb252ZXJ0IG5ldyB2YWx1ZSB0byBhIGZyYWdtZW50XG4gICAgLy8gZG8gbm90IGF0dGVtcHQgdG8gcmV0cmlldmUgZnJvbSBpZCBzZWxlY3RvclxuICAgIHZhciBmcmFnID0gdGVtcGxhdGVQYXJzZXIucGFyc2UodmFsdWUsIHRydWUsIHRydWUpXG4gICAgLy8gc2F2ZSBhIHJlZmVyZW5jZSB0byB0aGVzZSBub2RlcyBzbyB3ZSBjYW4gcmVtb3ZlIGxhdGVyXG4gICAgdGhpcy5ub2RlcyA9IF8udG9BcnJheShmcmFnLmNoaWxkTm9kZXMpXG4gICAgXy5iZWZvcmUoZnJhZywgdGhpcy5lbClcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcbnZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgaWYgKCFlbC5fX3Z1ZV9fKSB7XG4gICAgICB0aGlzLnN0YXJ0ID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1pZi1zdGFydCcpXG4gICAgICB0aGlzLmVuZCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtaWYtZW5kJylcbiAgICAgIF8ucmVwbGFjZShlbCwgdGhpcy5lbmQpXG4gICAgICBfLmJlZm9yZSh0aGlzLnN0YXJ0LCB0aGlzLmVuZClcbiAgICAgIGlmIChlbC50YWdOYW1lID09PSAnVEVNUExBVEUnKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVBhcnNlci5wYXJzZShlbCwgdHJ1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICAgICAgdGhpcy50ZW1wbGF0ZS5hcHBlbmRDaGlsZCh0ZW1wbGF0ZVBhcnNlci5jbG9uZShlbCkpXG4gICAgICB9XG4gICAgICAvLyBjb21waWxlIHRoZSBuZXN0ZWQgcGFydGlhbFxuICAgICAgdGhpcy5saW5rZXIgPSBjb21waWxlKFxuICAgICAgICB0aGlzLnRlbXBsYXRlLFxuICAgICAgICB0aGlzLnZtLiRvcHRpb25zLFxuICAgICAgICB0cnVlXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW52YWxpZCA9IHRydWVcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3YtaWY9XCInICsgdGhpcy5leHByZXNzaW9uICsgJ1wiIGNhbm5vdCBiZSAnICtcbiAgICAgICAgJ3VzZWQgb24gYW4gYWxyZWFkeSBtb3VudGVkIGluc3RhbmNlLidcbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5pbnZhbGlkKSByZXR1cm5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIC8vIGF2b2lkIGR1cGxpY2F0ZSBjb21waWxlcywgc2luY2UgdXBkYXRlKCkgY2FuIGJlXG4gICAgICAvLyBjYWxsZWQgd2l0aCBkaWZmZXJlbnQgdHJ1dGh5IHZhbHVlc1xuICAgICAgaWYgKCF0aGlzLnVubGluaykge1xuICAgICAgICB0aGlzLmNvbXBpbGUoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRlYXJkb3duKClcbiAgICB9XG4gIH0sXG5cbiAgY29tcGlsZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICB2YXIgZnJhZyA9IHRlbXBsYXRlUGFyc2VyLmNsb25lKHRoaXMudGVtcGxhdGUpXG4gICAgLy8gdGhlIGxpbmtlciBpcyBub3QgZ3VhcmFudGVlZCB0byBiZSBwcmVzZW50IGJlY2F1c2VcbiAgICAvLyB0aGlzIGZ1bmN0aW9uIG1pZ2h0IGdldCBjYWxsZWQgYnkgdi1wYXJ0aWFsIFxuICAgIHRoaXMudW5saW5rID0gdGhpcy5saW5rZXIodm0sIGZyYWcpXG4gICAgdHJhbnNpdGlvbi5ibG9ja0FwcGVuZChmcmFnLCB0aGlzLmVuZCwgdm0pXG4gICAgLy8gY2FsbCBhdHRhY2hlZCBmb3IgYWxsIHRoZSBjaGlsZCBjb21wb25lbnRzIGNyZWF0ZWRcbiAgICAvLyBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uXG4gICAgaWYgKF8uaW5Eb2Modm0uJGVsKSkge1xuICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5nZXRDb250YWluZWRDb21wb25lbnRzKClcbiAgICAgIGlmIChjaGlsZHJlbikgY2hpbGRyZW4uZm9yRWFjaChjYWxsQXR0YWNoKVxuICAgIH1cbiAgfSxcblxuICB0ZWFyZG93bjogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy51bmxpbmspIHJldHVyblxuICAgIC8vIGNvbGxlY3QgY2hpbGRyZW4gYmVmb3JlaGFuZFxuICAgIHZhciBjaGlsZHJlblxuICAgIGlmIChfLmluRG9jKHRoaXMudm0uJGVsKSkge1xuICAgICAgY2hpbGRyZW4gPSB0aGlzLmdldENvbnRhaW5lZENvbXBvbmVudHMoKVxuICAgIH1cbiAgICB0cmFuc2l0aW9uLmJsb2NrUmVtb3ZlKHRoaXMuc3RhcnQsIHRoaXMuZW5kLCB0aGlzLnZtKVxuICAgIGlmIChjaGlsZHJlbikgY2hpbGRyZW4uZm9yRWFjaChjYWxsRGV0YWNoKVxuICAgIHRoaXMudW5saW5rKClcbiAgICB0aGlzLnVubGluayA9IG51bGxcbiAgfSxcblxuICBnZXRDb250YWluZWRDb21wb25lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZtID0gdGhpcy52bVxuICAgIHZhciBzdGFydCA9IHRoaXMuc3RhcnQubmV4dFNpYmxpbmdcbiAgICB2YXIgZW5kID0gdGhpcy5lbmRcbiAgICB2YXIgc2VsZkNvbXBvZW50cyA9XG4gICAgICB2bS5fY2hpbGRyZW4ubGVuZ3RoICYmXG4gICAgICB2bS5fY2hpbGRyZW4uZmlsdGVyKGNvbnRhaW5zKVxuICAgIHZhciB0cmFuc0NvbXBvbmVudHMgPVxuICAgICAgdm0uX3RyYW5zQ3BudHMgJiZcbiAgICAgIHZtLl90cmFuc0NwbnRzLmZpbHRlcihjb250YWlucylcblxuICAgIGZ1bmN0aW9uIGNvbnRhaW5zIChjKSB7XG4gICAgICB2YXIgY3VyID0gc3RhcnRcbiAgICAgIHZhciBuZXh0XG4gICAgICB3aGlsZSAobmV4dCAhPT0gZW5kKSB7XG4gICAgICAgIG5leHQgPSBjdXIubmV4dFNpYmxpbmdcbiAgICAgICAgaWYgKGN1ci5jb250YWlucyhjLiRlbCkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIGN1ciA9IG5leHRcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBzZWxmQ29tcG9lbnRzXG4gICAgICA/IHRyYW5zQ29tcG9uZW50c1xuICAgICAgICA/IHNlbGZDb21wb2VudHMuY29uY2F0KHRyYW5zQ29tcG9uZW50cylcbiAgICAgICAgOiBzZWxmQ29tcG9lbnRzXG4gICAgICA6IHRyYW5zQ29tcG9uZW50c1xuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnVubGluaykgdGhpcy51bmxpbmsoKVxuICB9XG5cbn1cblxuZnVuY3Rpb24gY2FsbEF0dGFjaCAoY2hpbGQpIHtcbiAgaWYgKCFjaGlsZC5faXNBdHRhY2hlZCkge1xuICAgIGNoaWxkLl9jYWxsSG9vaygnYXR0YWNoZWQnKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNhbGxEZXRhY2ggKGNoaWxkKSB7XG4gIGlmIChjaGlsZC5faXNBdHRhY2hlZCkge1xuICAgIGNoaWxkLl9jYWxsSG9vaygnZGV0YWNoZWQnKVxuICB9XG59IiwiLy8gbWFuaXB1bGF0aW9uIGRpcmVjdGl2ZXNcbmV4cG9ydHMudGV4dCAgICAgICA9IHJlcXVpcmUoJy4vdGV4dCcpXG5leHBvcnRzLmh0bWwgICAgICAgPSByZXF1aXJlKCcuL2h0bWwnKVxuZXhwb3J0cy5hdHRyICAgICAgID0gcmVxdWlyZSgnLi9hdHRyJylcbmV4cG9ydHMuc2hvdyAgICAgICA9IHJlcXVpcmUoJy4vc2hvdycpXG5leHBvcnRzWydjbGFzcyddICAgPSByZXF1aXJlKCcuL2NsYXNzJylcbmV4cG9ydHMuZWwgICAgICAgICA9IHJlcXVpcmUoJy4vZWwnKVxuZXhwb3J0cy5yZWYgICAgICAgID0gcmVxdWlyZSgnLi9yZWYnKVxuZXhwb3J0cy5jbG9hayAgICAgID0gcmVxdWlyZSgnLi9jbG9haycpXG5leHBvcnRzLnN0eWxlICAgICAgPSByZXF1aXJlKCcuL3N0eWxlJylcbmV4cG9ydHMudHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vdHJhbnNpdGlvbicpXG5cbi8vIGV2ZW50IGxpc3RlbmVyIGRpcmVjdGl2ZXNcbmV4cG9ydHMub24gICAgICAgICA9IHJlcXVpcmUoJy4vb24nKVxuZXhwb3J0cy5tb2RlbCAgICAgID0gcmVxdWlyZSgnLi9tb2RlbCcpXG5cbi8vIGxvZ2ljIGNvbnRyb2wgZGlyZWN0aXZlc1xuZXhwb3J0cy5yZXBlYXQgICAgID0gcmVxdWlyZSgnLi9yZXBlYXQnKVxuZXhwb3J0c1snaWYnXSAgICAgID0gcmVxdWlyZSgnLi9pZicpXG5cbi8vIGNoaWxkIHZtIGNvbW11bmljYXRpb24gZGlyZWN0aXZlc1xuZXhwb3J0cy5ldmVudHMgICAgID0gcmVxdWlyZSgnLi9ldmVudHMnKVxuXG4vLyBpbnRlcm5hbCBkaXJlY3RpdmVzIHRoYXQgc2hvdWxkIG5vdCBiZSB1c2VkIGRpcmVjdGx5XG4vLyBidXQgd2Ugc3RpbGwgd2FudCB0byBleHBvc2UgdGhlbSBmb3IgYWR2YW5jZWQgdXNhZ2UuXG5leHBvcnRzLl9jb21wb25lbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudCcpXG5leHBvcnRzLl9wcm9wICAgICAgPSByZXF1aXJlKCcuL3Byb3AnKSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy5saXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuc2V0KGVsLmNoZWNrZWQpXG4gICAgfVxuICAgIF8ub24oZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICAgIGlmIChlbC5jaGVja2VkKSB7XG4gICAgICB0aGlzLl9pbml0VmFsdWUgPSBlbC5jaGVja2VkXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5lbC5jaGVja2VkID0gISF2YWx1ZVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIF8ub2ZmKHRoaXMuZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGVsID0gdGhpcy5lbFxuXG4gICAgLy8gY2hlY2sgcGFyYW1zXG4gICAgLy8gLSBsYXp5OiB1cGRhdGUgbW9kZWwgb24gXCJjaGFuZ2VcIiBpbnN0ZWFkIG9mIFwiaW5wdXRcIlxuICAgIHZhciBsYXp5ID0gdGhpcy5fY2hlY2tQYXJhbSgnbGF6eScpICE9IG51bGxcbiAgICAvLyAtIG51bWJlcjogY2FzdCB2YWx1ZSBpbnRvIG51bWJlciB3aGVuIHVwZGF0aW5nIG1vZGVsLlxuICAgIHZhciBudW1iZXIgPSB0aGlzLl9jaGVja1BhcmFtKCdudW1iZXInKSAhPSBudWxsXG4gICAgLy8gLSBkZWJvdW5jZTogZGVib3VuY2UgdGhlIGlucHV0IGxpc3RlbmVyXG4gICAgdmFyIGRlYm91bmNlID0gcGFyc2VJbnQodGhpcy5fY2hlY2tQYXJhbSgnZGVib3VuY2UnKSwgMTApXG5cbiAgICAvLyBoYW5kbGUgY29tcG9zaXRpb24gZXZlbnRzLlxuICAgIC8vIGh0dHA6Ly9ibG9nLmV2YW55b3UubWUvMjAxNC8wMS8wMy9jb21wb3NpdGlvbi1ldmVudC9cbiAgICB2YXIgY3BMb2NrZWQgPSBmYWxzZVxuICAgIHRoaXMuY3BMb2NrID0gZnVuY3Rpb24gKCkge1xuICAgICAgY3BMb2NrZWQgPSB0cnVlXG4gICAgfVxuICAgIHRoaXMuY3BVbmxvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjcExvY2tlZCA9IGZhbHNlXG4gICAgICAvLyBpbiBJRTExIHRoZSBcImNvbXBvc2l0aW9uZW5kXCIgZXZlbnQgZmlyZXMgQUZURVJcbiAgICAgIC8vIHRoZSBcImlucHV0XCIgZXZlbnQsIHNvIHRoZSBpbnB1dCBoYW5kbGVyIGlzIGJsb2NrZWRcbiAgICAgIC8vIGF0IHRoZSBlbmQuLi4gaGF2ZSB0byBjYWxsIGl0IGhlcmUuXG4gICAgICBzZXQoKVxuICAgIH1cbiAgICBfLm9uKGVsLCdjb21wb3NpdGlvbnN0YXJ0JywgdGhpcy5jcExvY2spXG4gICAgXy5vbihlbCwnY29tcG9zaXRpb25lbmQnLCB0aGlzLmNwVW5sb2NrKVxuXG4gICAgLy8gc2hhcmVkIHNldHRlclxuICAgIGZ1bmN0aW9uIHNldCAoKSB7XG4gICAgICB2YXIgdmFsID0gbnVtYmVyXG4gICAgICAgID8gXy50b051bWJlcihlbC52YWx1ZSlcbiAgICAgICAgOiBlbC52YWx1ZVxuICAgICAgc2VsZi5zZXQodmFsKVxuICAgIH1cblxuICAgIC8vIGlmIHRoZSBkaXJlY3RpdmUgaGFzIGZpbHRlcnMsIHdlIG5lZWQgdG9cbiAgICAvLyByZWNvcmQgY3Vyc29yIHBvc2l0aW9uIGFuZCByZXN0b3JlIGl0IGFmdGVyIHVwZGF0aW5nXG4gICAgLy8gdGhlIGlucHV0IHdpdGggdGhlIGZpbHRlcmVkIHZhbHVlLlxuICAgIC8vIGFsc28gZm9yY2UgdXBkYXRlIGZvciB0eXBlPVwicmFuZ2VcIiBpbnB1dHMgdG8gZW5hYmxlXG4gICAgLy8gXCJsb2NrIGluIHJhbmdlXCIgKHNlZSAjNTA2KVxuICAgIHZhciBoYXNSZWFkRmlsdGVyID0gdGhpcy5maWx0ZXJzICYmIHRoaXMuZmlsdGVycy5yZWFkXG4gICAgdGhpcy5saXN0ZW5lciA9IGhhc1JlYWRGaWx0ZXIgfHwgZWwudHlwZSA9PT0gJ3JhbmdlJ1xuICAgICAgPyBmdW5jdGlvbiB0ZXh0SW5wdXRMaXN0ZW5lciAoKSB7XG4gICAgICAgICAgaWYgKGNwTG9ja2VkKSByZXR1cm5cbiAgICAgICAgICB2YXIgY2hhcnNPZmZzZXRcbiAgICAgICAgICAvLyBzb21lIEhUTUw1IGlucHV0IHR5cGVzIHRocm93IGVycm9yIGhlcmVcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gcmVjb3JkIGhvdyBtYW55IGNoYXJzIGZyb20gdGhlIGVuZCBvZiBpbnB1dFxuICAgICAgICAgICAgLy8gdGhlIGN1cnNvciB3YXMgYXRcbiAgICAgICAgICAgIGNoYXJzT2Zmc2V0ID0gZWwudmFsdWUubGVuZ3RoIC0gZWwuc2VsZWN0aW9uU3RhcnRcbiAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICAgIC8vIEZpeCBJRTEwLzExIGluZmluaXRlIHVwZGF0ZSBjeWNsZVxuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS95eXg5OTA4MDMvdnVlL2lzc3Vlcy81OTJcbiAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgICBpZiAoY2hhcnNPZmZzZXQgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0KClcbiAgICAgICAgICBfLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGZvcmNlIGEgdmFsdWUgdXBkYXRlLCBiZWNhdXNlIGluXG4gICAgICAgICAgICAvLyBjZXJ0YWluIGNhc2VzIHRoZSB3cml0ZSBmaWx0ZXJzIG91dHB1dCB0aGVcbiAgICAgICAgICAgIC8vIHNhbWUgcmVzdWx0IGZvciBkaWZmZXJlbnQgaW5wdXQgdmFsdWVzLCBhbmRcbiAgICAgICAgICAgIC8vIHRoZSBPYnNlcnZlciBzZXQgZXZlbnRzIHdvbid0IGJlIHRyaWdnZXJlZC5cbiAgICAgICAgICAgIHZhciBuZXdWYWwgPSBzZWxmLl93YXRjaGVyLnZhbHVlXG4gICAgICAgICAgICBzZWxmLnVwZGF0ZShuZXdWYWwpXG4gICAgICAgICAgICBpZiAoY2hhcnNPZmZzZXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB2YXIgY3Vyc29yUG9zID1cbiAgICAgICAgICAgICAgICBfLnRvU3RyaW5nKG5ld1ZhbCkubGVuZ3RoIC0gY2hhcnNPZmZzZXRcbiAgICAgICAgICAgICAgZWwuc2V0U2VsZWN0aW9uUmFuZ2UoY3Vyc29yUG9zLCBjdXJzb3JQb3MpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgOiBmdW5jdGlvbiB0ZXh0SW5wdXRMaXN0ZW5lciAoKSB7XG4gICAgICAgICAgaWYgKGNwTG9ja2VkKSByZXR1cm5cbiAgICAgICAgICBzZXQoKVxuICAgICAgICB9XG5cbiAgICBpZiAoZGVib3VuY2UpIHtcbiAgICAgIHRoaXMubGlzdGVuZXIgPSBfLmRlYm91bmNlKHRoaXMubGlzdGVuZXIsIGRlYm91bmNlKVxuICAgIH1cbiAgICB0aGlzLmV2ZW50ID0gbGF6eSA/ICdjaGFuZ2UnIDogJ2lucHV0J1xuICAgIC8vIFN1cHBvcnQgalF1ZXJ5IGV2ZW50cywgc2luY2UgalF1ZXJ5LnRyaWdnZXIoKSBkb2Vzbid0XG4gICAgLy8gdHJpZ2dlciBuYXRpdmUgZXZlbnRzIGluIHNvbWUgY2FzZXMgYW5kIHNvbWUgcGx1Z2luc1xuICAgIC8vIHJlbHkgb24gJC50cmlnZ2VyKClcbiAgICAvLyBcbiAgICAvLyBXZSB3YW50IHRvIG1ha2Ugc3VyZSBpZiBhIGxpc3RlbmVyIGlzIGF0dGFjaGVkIHVzaW5nXG4gICAgLy8galF1ZXJ5LCBpdCBpcyBhbHNvIHJlbW92ZWQgd2l0aCBqUXVlcnksIHRoYXQncyB3aHlcbiAgICAvLyB3ZSBkbyB0aGUgY2hlY2sgZm9yIGVhY2ggZGlyZWN0aXZlIGluc3RhbmNlIGFuZFxuICAgIC8vIHN0b3JlIHRoYXQgY2hlY2sgcmVzdWx0IG9uIGl0c2VsZi4gVGhpcyBhbHNvIGFsbG93c1xuICAgIC8vIGVhc2llciB0ZXN0IGNvdmVyYWdlIGNvbnRyb2wgYnkgdW5zZXR0aW5nIHRoZSBnbG9iYWxcbiAgICAvLyBqUXVlcnkgdmFyaWFibGUgaW4gdGVzdHMuXG4gICAgdGhpcy5oYXNqUXVlcnkgPSB0eXBlb2YgalF1ZXJ5ID09PSAnZnVuY3Rpb24nXG4gICAgaWYgKHRoaXMuaGFzalF1ZXJ5KSB7XG4gICAgICBqUXVlcnkoZWwpLm9uKHRoaXMuZXZlbnQsIHRoaXMubGlzdGVuZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIF8ub24oZWwsIHRoaXMuZXZlbnQsIHRoaXMubGlzdGVuZXIpXG4gICAgfVxuXG4gICAgLy8gSUU5IGRvZXNuJ3QgZmlyZSBpbnB1dCBldmVudCBvbiBiYWNrc3BhY2UvZGVsL2N1dFxuICAgIGlmICghbGF6eSAmJiBfLmlzSUU5KSB7XG4gICAgICB0aGlzLm9uQ3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBfLm5leHRUaWNrKHNlbGYubGlzdGVuZXIpXG4gICAgICB9XG4gICAgICB0aGlzLm9uRGVsID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gNDYgfHwgZS5rZXlDb2RlID09PSA4KSB7XG4gICAgICAgICAgc2VsZi5saXN0ZW5lcigpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF8ub24oZWwsICdjdXQnLCB0aGlzLm9uQ3V0KVxuICAgICAgXy5vbihlbCwgJ2tleXVwJywgdGhpcy5vbkRlbClcbiAgICB9XG5cbiAgICAvLyBzZXQgaW5pdGlhbCB2YWx1ZSBpZiBwcmVzZW50XG4gICAgaWYgKFxuICAgICAgZWwuaGFzQXR0cmlidXRlKCd2YWx1ZScpIHx8XG4gICAgICAoZWwudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJyAmJiBlbC52YWx1ZS50cmltKCkpXG4gICAgKSB7XG4gICAgICB0aGlzLl9pbml0VmFsdWUgPSBudW1iZXJcbiAgICAgICAgPyBfLnRvTnVtYmVyKGVsLnZhbHVlKVxuICAgICAgICA6IGVsLnZhbHVlXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5lbC52YWx1ZSA9IF8udG9TdHJpbmcodmFsdWUpXG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIGlmICh0aGlzLmhhc2pRdWVyeSkge1xuICAgICAgalF1ZXJ5KGVsKS5vZmYodGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9IGVsc2Uge1xuICAgICAgXy5vZmYoZWwsIHRoaXMuZXZlbnQsIHRoaXMubGlzdGVuZXIpXG4gICAgfVxuICAgIF8ub2ZmKGVsLCdjb21wb3NpdGlvbnN0YXJ0JywgdGhpcy5jcExvY2spXG4gICAgXy5vZmYoZWwsJ2NvbXBvc2l0aW9uZW5kJywgdGhpcy5jcFVubG9jaylcbiAgICBpZiAodGhpcy5vbkN1dCkge1xuICAgICAgXy5vZmYoZWwsJ2N1dCcsIHRoaXMub25DdXQpXG4gICAgICBfLm9mZihlbCwna2V5dXAnLCB0aGlzLm9uRGVsKVxuICAgIH1cbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcblxudmFyIGhhbmRsZXJzID0ge1xuICBfZGVmYXVsdDogcmVxdWlyZSgnLi9kZWZhdWx0JyksXG4gIHJhZGlvOiByZXF1aXJlKCcuL3JhZGlvJyksXG4gIHNlbGVjdDogcmVxdWlyZSgnLi9zZWxlY3QnKSxcbiAgY2hlY2tib3g6IHJlcXVpcmUoJy4vY2hlY2tib3gnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBwcmlvcml0eTogODAwLFxuICB0d29XYXk6IHRydWUsXG4gIGhhbmRsZXJzOiBoYW5kbGVycyxcblxuICAvKipcbiAgICogUG9zc2libGUgZWxlbWVudHM6XG4gICAqICAgPHNlbGVjdD5cbiAgICogICA8dGV4dGFyZWE+XG4gICAqICAgPGlucHV0IHR5cGU9XCIqXCI+XG4gICAqICAgICAtIHRleHRcbiAgICogICAgIC0gY2hlY2tib3hcbiAgICogICAgIC0gcmFkaW9cbiAgICogICAgIC0gbnVtYmVyXG4gICAqICAgICAtIFRPRE86IG1vcmUgdHlwZXMgbWF5IGJlIHN1cHBsaWVkIGFzIGEgcGx1Z2luXG4gICAqL1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBmcmllbmRseSB3YXJuaW5nLi4uXG4gICAgdmFyIGZpbHRlcnMgPSB0aGlzLmZpbHRlcnNcbiAgICBpZiAoZmlsdGVycyAmJiBmaWx0ZXJzLnJlYWQgJiYgIWZpbHRlcnMud3JpdGUpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0l0IHNlZW1zIHlvdSBhcmUgdXNpbmcgYSByZWFkLW9ubHkgZmlsdGVyIHdpdGggJyArXG4gICAgICAgICd2LW1vZGVsLiBZb3UgbWlnaHQgd2FudCB0byB1c2UgYSB0d28td2F5IGZpbHRlciAnICtcbiAgICAgICAgJ3RvIGVuc3VyZSBjb3JyZWN0IGJlaGF2aW9yLidcbiAgICAgIClcbiAgICB9XG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIHZhciB0YWcgPSBlbC50YWdOYW1lXG4gICAgdmFyIGhhbmRsZXJcbiAgICBpZiAodGFnID09PSAnSU5QVVQnKSB7XG4gICAgICBoYW5kbGVyID0gaGFuZGxlcnNbZWwudHlwZV0gfHwgaGFuZGxlcnMuX2RlZmF1bHRcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gJ1NFTEVDVCcpIHtcbiAgICAgIGhhbmRsZXIgPSBoYW5kbGVycy5zZWxlY3RcbiAgICB9IGVsc2UgaWYgKHRhZyA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgaGFuZGxlciA9IGhhbmRsZXJzLl9kZWZhdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIF8ud2Fybigndi1tb2RlbCBkb2VzIG5vdCBzdXBwb3J0IGVsZW1lbnQgdHlwZTogJyArIHRhZylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBoYW5kbGVyLmJpbmQuY2FsbCh0aGlzKVxuICAgIHRoaXMudXBkYXRlID0gaGFuZGxlci51cGRhdGVcbiAgICB0aGlzLnVuYmluZCA9IGhhbmRsZXIudW5iaW5kXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdGhpcy5saXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuc2V0KGVsLnZhbHVlKVxuICAgIH1cbiAgICBfLm9uKGVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgICBpZiAoZWwuY2hlY2tlZCkge1xuICAgICAgdGhpcy5faW5pdFZhbHVlID0gZWwudmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgIHRoaXMuZWwuY2hlY2tlZCA9IHZhbHVlID09IHRoaXMuZWwudmFsdWVcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICBfLm9mZih0aGlzLmVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcbnZhciBXYXRjaGVyID0gcmVxdWlyZSgnLi4vLi4vd2F0Y2hlcicpXG52YXIgZGlyUGFyc2VyID0gcmVxdWlyZSgnLi4vLi4vcGFyc2Vycy9kaXJlY3RpdmUnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIC8vIGNoZWNrIG9wdGlvbnMgcGFyYW1cbiAgICB2YXIgb3B0aW9uc1BhcmFtID0gdGhpcy5fY2hlY2tQYXJhbSgnb3B0aW9ucycpXG4gICAgaWYgKG9wdGlvbnNQYXJhbSkge1xuICAgICAgaW5pdE9wdGlvbnMuY2FsbCh0aGlzLCBvcHRpb25zUGFyYW0pXG4gICAgfVxuICAgIHRoaXMubnVtYmVyID0gdGhpcy5fY2hlY2tQYXJhbSgnbnVtYmVyJykgIT0gbnVsbFxuICAgIHRoaXMubXVsdGlwbGUgPSBlbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJylcbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlID0gc2VsZi5tdWx0aXBsZVxuICAgICAgICA/IGdldE11bHRpVmFsdWUoZWwpXG4gICAgICAgIDogZWwudmFsdWVcbiAgICAgIHZhbHVlID0gc2VsZi5udW1iZXJcbiAgICAgICAgPyBfLmlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgPyB2YWx1ZS5tYXAoXy50b051bWJlcilcbiAgICAgICAgICA6IF8udG9OdW1iZXIodmFsdWUpXG4gICAgICAgIDogdmFsdWVcbiAgICAgIHNlbGYuc2V0KHZhbHVlKVxuICAgIH1cbiAgICBfLm9uKGVsLCAnY2hhbmdlJywgdGhpcy5saXN0ZW5lcilcbiAgICBjaGVja0luaXRpYWxWYWx1ZS5jYWxsKHRoaXMpXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICBlbC5zZWxlY3RlZEluZGV4ID0gLTFcbiAgICB2YXIgbXVsdGkgPSB0aGlzLm11bHRpcGxlICYmIF8uaXNBcnJheSh2YWx1ZSlcbiAgICB2YXIgb3B0aW9ucyA9IGVsLm9wdGlvbnNcbiAgICB2YXIgaSA9IG9wdGlvbnMubGVuZ3RoXG4gICAgdmFyIG9wdGlvblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIG9wdGlvbiA9IG9wdGlvbnNbaV1cbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IG11bHRpXG4gICAgICAgID8gaW5kZXhPZih2YWx1ZSwgb3B0aW9uLnZhbHVlKSA+IC0xXG4gICAgICAgIDogdmFsdWUgPT0gb3B0aW9uLnZhbHVlXG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIF8ub2ZmKHRoaXMuZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICAgIGlmICh0aGlzLm9wdGlvbldhdGNoZXIpIHtcbiAgICAgIHRoaXMub3B0aW9uV2F0Y2hlci50ZWFyZG93bigpXG4gICAgfVxuICB9XG5cbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBvcHRpb24gbGlzdCBmcm9tIHRoZSBwYXJhbS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvblxuICovXG5cbmZ1bmN0aW9uIGluaXRPcHRpb25zIChleHByZXNzaW9uKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgZGVzY3JpcHRvciA9IGRpclBhcnNlci5wYXJzZShleHByZXNzaW9uKVswXVxuICBmdW5jdGlvbiBvcHRpb25VcGRhdGVXYXRjaGVyICh2YWx1ZSkge1xuICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBzZWxmLmVsLmlubmVySFRNTCA9ICcnXG4gICAgICBidWlsZE9wdGlvbnMoc2VsZi5lbCwgdmFsdWUpXG4gICAgICBpZiAoc2VsZi5fd2F0Y2hlcikge1xuICAgICAgICBzZWxmLnVwZGF0ZShzZWxmLl93YXRjaGVyLnZhbHVlKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBfLndhcm4oJ0ludmFsaWQgb3B0aW9ucyB2YWx1ZSBmb3Igdi1tb2RlbDogJyArIHZhbHVlKVxuICAgIH1cbiAgfVxuICB0aGlzLm9wdGlvbldhdGNoZXIgPSBuZXcgV2F0Y2hlcihcbiAgICB0aGlzLnZtLFxuICAgIGRlc2NyaXB0b3IuZXhwcmVzc2lvbixcbiAgICBvcHRpb25VcGRhdGVXYXRjaGVyLFxuICAgIHtcbiAgICAgIGRlZXA6IHRydWUsXG4gICAgICBmaWx0ZXJzOiBfLnJlc29sdmVGaWx0ZXJzKHRoaXMudm0sIGRlc2NyaXB0b3IuZmlsdGVycylcbiAgICB9XG4gIClcbiAgLy8gdXBkYXRlIHdpdGggaW5pdGlhbCB2YWx1ZVxuICBvcHRpb25VcGRhdGVXYXRjaGVyKHRoaXMub3B0aW9uV2F0Y2hlci52YWx1ZSlcbn1cblxuLyoqXG4gKiBCdWlsZCB1cCBvcHRpb24gZWxlbWVudHMuIElFOSBkb2Vzbid0IGNyZWF0ZSBvcHRpb25zXG4gKiB3aGVuIHNldHRpbmcgaW5uZXJIVE1MIG9uIDxzZWxlY3Q+IGVsZW1lbnRzLCBzbyB3ZSBoYXZlXG4gKiB0byB1c2UgRE9NIEFQSSBoZXJlLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gcGFyZW50IC0gYSA8c2VsZWN0PiBvciBhbiA8b3B0Z3JvdXA+XG4gKiBAcGFyYW0ge0FycmF5fSBvcHRpb25zXG4gKi9cblxuZnVuY3Rpb24gYnVpbGRPcHRpb25zIChwYXJlbnQsIG9wdGlvbnMpIHtcbiAgdmFyIG9wLCBlbFxuICBmb3IgKHZhciBpID0gMCwgbCA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgb3AgPSBvcHRpb25zW2ldXG4gICAgaWYgKCFvcC5vcHRpb25zKSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpXG4gICAgICBpZiAodHlwZW9mIG9wID09PSAnc3RyaW5nJykge1xuICAgICAgICBlbC50ZXh0ID0gZWwudmFsdWUgPSBvcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWwudGV4dCA9IG9wLnRleHRcbiAgICAgICAgZWwudmFsdWUgPSBvcC52YWx1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGdyb3VwJylcbiAgICAgIGVsLmxhYmVsID0gb3AubGFiZWxcbiAgICAgIGJ1aWxkT3B0aW9ucyhlbCwgb3Aub3B0aW9ucylcbiAgICB9XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGVsKVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgdGhlIGluaXRpYWwgdmFsdWUgZm9yIHNlbGVjdGVkIG9wdGlvbnMuXG4gKi9cblxuZnVuY3Rpb24gY2hlY2tJbml0aWFsVmFsdWUgKCkge1xuICB2YXIgaW5pdFZhbHVlXG4gIHZhciBvcHRpb25zID0gdGhpcy5lbC5vcHRpb25zXG4gIGZvciAodmFyIGkgPSAwLCBsID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAob3B0aW9uc1tpXS5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgIChpbml0VmFsdWUgfHwgKGluaXRWYWx1ZSA9IFtdKSlcbiAgICAgICAgICAucHVzaChvcHRpb25zW2ldLnZhbHVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdFZhbHVlID0gb3B0aW9uc1tpXS52YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIGluaXRWYWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aGlzLl9pbml0VmFsdWUgPSB0aGlzLm51bWJlclxuICAgICAgPyBfLnRvTnVtYmVyKGluaXRWYWx1ZSlcbiAgICAgIDogaW5pdFZhbHVlXG4gIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgdG8gZXh0cmFjdCBhIHZhbHVlIGFycmF5IGZvciBzZWxlY3RbbXVsdGlwbGVdXG4gKlxuICogQHBhcmFtIHtTZWxlY3RFbGVtZW50fSBlbFxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cblxuZnVuY3Rpb24gZ2V0TXVsdGlWYWx1ZSAoZWwpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXJcbiAgICAuY2FsbChlbC5vcHRpb25zLCBmaWx0ZXJTZWxlY3RlZClcbiAgICAubWFwKGdldE9wdGlvblZhbHVlKVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJTZWxlY3RlZCAob3ApIHtcbiAgcmV0dXJuIG9wLnNlbGVjdGVkXG59XG5cbmZ1bmN0aW9uIGdldE9wdGlvblZhbHVlIChvcCkge1xuICByZXR1cm4gb3AudmFsdWUgfHwgb3AudGV4dFxufVxuXG4vKipcbiAqIE5hdGl2ZSBBcnJheS5pbmRleE9mIHVzZXMgc3RyaWN0IGVxdWFsLCBidXQgaW4gdGhpc1xuICogY2FzZSB3ZSBuZWVkIHRvIG1hdGNoIHN0cmluZy9udW1iZXJzIHdpdGggc29mdCBlcXVhbC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZnVuY3Rpb24gaW5kZXhPZiAoYXJyLCB2YWwpIHtcbiAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgdmFyIGkgPSBhcnIubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICBpZiAoYXJyW2ldID09IHZhbCkgcmV0dXJuIGlcbiAgfVxuICByZXR1cm4gLTFcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBhY2NlcHRTdGF0ZW1lbnQ6IHRydWUsXG4gIHByaW9yaXR5OiA3MDAsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGRlYWwgd2l0aCBpZnJhbWVzXG4gICAgaWYgKFxuICAgICAgdGhpcy5lbC50YWdOYW1lID09PSAnSUZSQU1FJyAmJlxuICAgICAgdGhpcy5hcmcgIT09ICdsb2FkJ1xuICAgICkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICB0aGlzLmlmcmFtZUJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF8ub24oc2VsZi5lbC5jb250ZW50V2luZG93LCBzZWxmLmFyZywgc2VsZi5oYW5kbGVyKVxuICAgICAgfVxuICAgICAgXy5vbih0aGlzLmVsLCAnbG9hZCcsIHRoaXMuaWZyYW1lQmluZClcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRGlyZWN0aXZlIFwidi1vbjonICsgdGhpcy5leHByZXNzaW9uICsgJ1wiICcgK1xuICAgICAgICAnZXhwZWN0cyBhIGZ1bmN0aW9uIHZhbHVlLidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnJlc2V0KClcbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdGhpcy5oYW5kbGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUudGFyZ2V0Vk0gPSB2bVxuICAgICAgdm0uJGV2ZW50ID0gZVxuICAgICAgdmFyIHJlcyA9IGhhbmRsZXIoZSlcbiAgICAgIHZtLiRldmVudCA9IG51bGxcbiAgICAgIHJldHVybiByZXNcbiAgICB9XG4gICAgaWYgKHRoaXMuaWZyYW1lQmluZCkge1xuICAgICAgdGhpcy5pZnJhbWVCaW5kKClcbiAgICB9IGVsc2Uge1xuICAgICAgXy5vbih0aGlzLmVsLCB0aGlzLmFyZywgdGhpcy5oYW5kbGVyKVxuICAgIH1cbiAgfSxcblxuICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuaWZyYW1lQmluZFxuICAgICAgPyB0aGlzLmVsLmNvbnRlbnRXaW5kb3dcbiAgICAgIDogdGhpcy5lbFxuICAgIGlmICh0aGlzLmhhbmRsZXIpIHtcbiAgICAgIF8ub2ZmKGVsLCB0aGlzLmFyZywgdGhpcy5oYW5kbGVyKVxuICAgIH1cbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlc2V0KClcbiAgICBfLm9mZih0aGlzLmVsLCAnbG9hZCcsIHRoaXMuaWZyYW1lQmluZClcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4uL3dhdGNoZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgY2hpbGQgPSB0aGlzLnZtXG4gICAgdmFyIHBhcmVudCA9IGNoaWxkLiRwYXJlbnRcbiAgICB2YXIgY2hpbGRLZXkgPSB0aGlzLmFyZ1xuICAgIHZhciBwYXJlbnRLZXkgPSB0aGlzLmV4cHJlc3Npb25cblxuICAgIC8vIHNpbXBsZSBsb2NrIHRvIGF2b2lkIGNpcmN1bGFyIHVwZGF0ZXMuXG4gICAgLy8gd2l0aG91dCB0aGlzIGl0IHdvdWxkIHN0YWJpbGl6ZSB0b28sIGJ1dCB0aGlzIG1ha2VzXG4gICAgLy8gc3VyZSBpdCBkb2Vzbid0IGNhdXNlIG90aGVyIHdhdGNoZXJzIHRvIHJlLWV2YWx1YXRlLlxuICAgIHZhciBsb2NrZWQgPSBmYWxzZVxuICAgIHZhciBsb2NrID0gZnVuY3Rpb24gKCkge1xuICAgICAgbG9ja2VkID0gdHJ1ZVxuICAgICAgXy5uZXh0VGljayh1bmxvY2spXG4gICAgfVxuICAgIHZhciB1bmxvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2NrZWQgPSBmYWxzZVxuICAgIH1cblxuICAgIHRoaXMucGFyZW50V2F0Y2hlciA9IG5ldyBXYXRjaGVyKFxuICAgICAgcGFyZW50LFxuICAgICAgcGFyZW50S2V5LFxuICAgICAgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICBpZiAoIWxvY2tlZCkge1xuICAgICAgICAgIGxvY2soKVxuICAgICAgICAgIGNoaWxkLiRzZXQoY2hpbGRLZXksIHZhbClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgICBcbiAgICAvLyBzZXQgdGhlIGNoaWxkIGluaXRpYWwgdmFsdWUgZmlyc3QsIGJlZm9yZSBzZXR0aW5nXG4gICAgLy8gdXAgdGhlIGNoaWxkIHdhdGNoZXIgdG8gYXZvaWQgdHJpZ2dlcmluZyBpdFxuICAgIC8vIGltbWVkaWF0ZWx5LlxuICAgIGNoaWxkLiRzZXQoY2hpbGRLZXksIHRoaXMucGFyZW50V2F0Y2hlci52YWx1ZSlcblxuICAgIC8vIG9ubHkgc2V0dXAgdHdvLXdheSBiaW5kaW5nIGlmIHRoaXMgaXMgbm90IGEgb25lLXdheVxuICAgIC8vIGJpbmRpbmcuXG4gICAgaWYgKCF0aGlzLl9kZXNjcmlwdG9yLm9uZVdheSkge1xuICAgICAgdGhpcy5jaGlsZFdhdGNoZXIgPSBuZXcgV2F0Y2hlcihcbiAgICAgICAgY2hpbGQsXG4gICAgICAgIGNoaWxkS2V5LFxuICAgICAgICBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgaWYgKCFsb2NrZWQpIHtcbiAgICAgICAgICAgIGxvY2soKVxuICAgICAgICAgICAgcGFyZW50LiRzZXQocGFyZW50S2V5LCB2YWwpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnBhcmVudFdhdGNoZXIpIHtcbiAgICAgIHRoaXMucGFyZW50V2F0Y2hlci50ZWFyZG93bigpXG4gICAgfVxuICAgIGlmICh0aGlzLmNoaWxkV2F0Y2hlcikge1xuICAgICAgdGhpcy5jaGlsZFdhdGNoZXIudGVhcmRvd24oKVxuICAgIH1cbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgaXNMaXRlcmFsOiB0cnVlLFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdm0gPSB0aGlzLmVsLl9fdnVlX19cbiAgICBpZiAoIXZtKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICd2LXJlZiBzaG91bGQgb25seSBiZSB1c2VkIG9uIGEgY29tcG9uZW50IHJvb3QgZWxlbWVudC4nXG4gICAgICApXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gSWYgd2UgZ2V0IGhlcmUsIGl0IG1lYW5zIHRoaXMgaXMgYSBgdi1yZWZgIG9uIGFcbiAgICAvLyBjaGlsZCwgYmVjYXVzZSBwYXJlbnQgc2NvcGUgYHYtcmVmYCBpcyBzdHJpcHBlZCBpblxuICAgIC8vIGB2LWNvbXBvbmVudGAgYWxyZWFkeS4gU28gd2UganVzdCByZWNvcmQgb3VyIG93biByZWZcbiAgICAvLyBoZXJlIC0gaXQgd2lsbCBvdmVyd3JpdGUgcGFyZW50IHJlZiBpbiBgdi1jb21wb25lbnRgLFxuICAgIC8vIGlmIGFueS5cbiAgICB2bS5fcmVmSUQgPSB0aGlzLmV4cHJlc3Npb25cbiAgfVxuICBcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGlzT2JqZWN0ID0gXy5pc09iamVjdFxudmFyIGlzUGxhaW5PYmplY3QgPSBfLmlzUGxhaW5PYmplY3RcbnZhciB0ZXh0UGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZXh0JylcbnZhciBleHBQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG52YXIgY29tcGlsZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL2NvbXBpbGUnKVxudmFyIHRyYW5zY2x1ZGUgPSByZXF1aXJlKCcuLi9jb21waWxlci90cmFuc2NsdWRlJylcbnZhciBtZXJnZU9wdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsL21lcmdlLW9wdGlvbicpXG52YXIgdWlkID0gMFxuXG4vLyBhc3luYyBjb21wb25lbnQgcmVzb2x1dGlvbiBzdGF0ZXNcbnZhciBVTlJFU09MVkVEID0gMFxudmFyIFBFTkRJTkcgPSAxXG52YXIgUkVTT0xWRUQgPSAyXG52YXIgQUJPUlRFRCA9IDNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLyoqXG4gICAqIFNldHVwLlxuICAgKi9cblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gdWlkIGFzIGEgY2FjaGUgaWRlbnRpZmllclxuICAgIHRoaXMuaWQgPSAnX192X3JlcGVhdF8nICsgKCsrdWlkKVxuICAgIC8vIHdlIG5lZWQgdG8gaW5zZXJ0IHRoZSBvYmpUb0FycmF5IGNvbnZlcnRlclxuICAgIC8vIGFzIHRoZSBmaXJzdCByZWFkIGZpbHRlciwgYmVjYXVzZSBpdCBoYXMgdG8gYmUgaW52b2tlZFxuICAgIC8vIGJlZm9yZSBhbnkgdXNlciBmaWx0ZXJzLiAoY2FuJ3QgZG8gaXQgaW4gYHVwZGF0ZWApXG4gICAgaWYgKCF0aGlzLmZpbHRlcnMpIHtcbiAgICAgIHRoaXMuZmlsdGVycyA9IHt9XG4gICAgfVxuICAgIC8vIGFkZCB0aGUgb2JqZWN0IC0+IGFycmF5IGNvbnZlcnQgZmlsdGVyXG4gICAgdmFyIG9iamVjdENvbnZlcnRlciA9IF8uYmluZChvYmpUb0FycmF5LCB0aGlzKVxuICAgIGlmICghdGhpcy5maWx0ZXJzLnJlYWQpIHtcbiAgICAgIHRoaXMuZmlsdGVycy5yZWFkID0gW29iamVjdENvbnZlcnRlcl1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5maWx0ZXJzLnJlYWQudW5zaGlmdChvYmplY3RDb252ZXJ0ZXIpXG4gICAgfVxuICAgIC8vIHNldHVwIHJlZiBub2RlXG4gICAgdGhpcy5yZWYgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LXJlcGVhdCcpXG4gICAgXy5yZXBsYWNlKHRoaXMuZWwsIHRoaXMucmVmKVxuICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBibG9jayByZXBlYXRcbiAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5lbC50YWdOYW1lID09PSAnVEVNUExBVEUnXG4gICAgICA/IHRlbXBsYXRlUGFyc2VyLnBhcnNlKHRoaXMuZWwsIHRydWUpXG4gICAgICA6IHRoaXMuZWxcbiAgICAvLyBjaGVjayBvdGhlciBkaXJlY3RpdmVzIHRoYXQgbmVlZCB0byBiZSBoYW5kbGVkXG4gICAgLy8gYXQgdi1yZXBlYXQgbGV2ZWxcbiAgICB0aGlzLmNoZWNrSWYoKVxuICAgIHRoaXMuY2hlY2tSZWYoKVxuICAgIHRoaXMuY2hlY2tDb21wb25lbnQoKVxuICAgIC8vIGNoZWNrIGZvciB0cmFja2J5IHBhcmFtXG4gICAgdGhpcy5pZEtleSA9XG4gICAgICB0aGlzLl9jaGVja1BhcmFtKCd0cmFjay1ieScpIHx8XG4gICAgICB0aGlzLl9jaGVja1BhcmFtKCd0cmFja2J5JykgLy8gMC4xMS4wIGNvbXBhdFxuICAgIHRoaXMuY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIH0sXG5cbiAgLyoqXG4gICAqIFdhcm4gYWdhaW5zdCB2LWlmIHVzYWdlLlxuICAgKi9cblxuICBjaGVja0lmOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKF8uYXR0cih0aGlzLmVsLCAnaWYnKSAhPT0gbnVsbCkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRG9uXFwndCB1c2Ugdi1pZiB3aXRoIHYtcmVwZWF0LiAnICtcbiAgICAgICAgJ1VzZSB2LXNob3cgb3IgdGhlIFwiZmlsdGVyQnlcIiBmaWx0ZXIgaW5zdGVhZC4nXG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB2LXJlZi8gdi1lbCBpcyBhbHNvIHByZXNlbnQuXG4gICAqL1xuXG4gIGNoZWNrUmVmOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlZklEID0gXy5hdHRyKHRoaXMuZWwsICdyZWYnKVxuICAgIHRoaXMucmVmSUQgPSByZWZJRFxuICAgICAgPyB0aGlzLnZtLiRpbnRlcnBvbGF0ZShyZWZJRClcbiAgICAgIDogbnVsbFxuICAgIHZhciBlbElkID0gXy5hdHRyKHRoaXMuZWwsICdlbCcpXG4gICAgdGhpcy5lbElkID0gZWxJZFxuICAgICAgPyB0aGlzLnZtLiRpbnRlcnBvbGF0ZShlbElkKVxuICAgICAgOiBudWxsXG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIHRoZSBjb21wb25lbnQgY29uc3RydWN0b3IgdG8gdXNlIGZvciByZXBlYXRlZFxuICAgKiBpbnN0YW5jZXMuIElmIHN0YXRpYyB3ZSByZXNvbHZlIGl0IG5vdywgb3RoZXJ3aXNlIGl0XG4gICAqIG5lZWRzIHRvIGJlIHJlc29sdmVkIGF0IGJ1aWxkIHRpbWUgd2l0aCBhY3R1YWwgZGF0YS5cbiAgICovXG5cbiAgY2hlY2tDb21wb25lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNvbXBvbmVudFN0YXRlID0gVU5SRVNPTFZFRFxuICAgIHZhciBvcHRpb25zID0gdGhpcy52bS4kb3B0aW9uc1xuICAgIHZhciBpZCA9IF8uY2hlY2tDb21wb25lbnQodGhpcy5lbCwgb3B0aW9ucylcbiAgICBpZiAoIWlkKSB7XG4gICAgICAvLyBkZWZhdWx0IGNvbnN0cnVjdG9yXG4gICAgICB0aGlzLkN0b3IgPSBfLlZ1ZVxuICAgICAgLy8gaW5saW5lIHJlcGVhdHMgc2hvdWxkIGluaGVyaXRcbiAgICAgIHRoaXMuaW5oZXJpdCA9IHRydWVcbiAgICAgIC8vIGltcG9ydGFudDogdHJhbnNjbHVkZSB3aXRoIG5vIG9wdGlvbnMsIGp1c3RcbiAgICAgIC8vIHRvIGVuc3VyZSBibG9jayBzdGFydCBhbmQgYmxvY2sgZW5kXG4gICAgICB0aGlzLnRlbXBsYXRlID0gdHJhbnNjbHVkZSh0aGlzLnRlbXBsYXRlKVxuICAgICAgdmFyIGNvcHkgPSBfLmV4dGVuZCh7fSwgb3B0aW9ucylcbiAgICAgIGNvcHkuX2FzQ29tcG9uZW50ID0gZmFsc2VcbiAgICAgIHRoaXMuX2xpbmtGbiA9IGNvbXBpbGUodGhpcy50ZW1wbGF0ZSwgY29weSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5DdG9yID0gbnVsbFxuICAgICAgdGhpcy5hc0NvbXBvbmVudCA9IHRydWVcbiAgICAgIC8vIGNoZWNrIGlubGluZS10ZW1wbGF0ZVxuICAgICAgaWYgKHRoaXMuX2NoZWNrUGFyYW0oJ2lubGluZS10ZW1wbGF0ZScpICE9PSBudWxsKSB7XG4gICAgICAgIC8vIGV4dHJhY3QgaW5saW5lIHRlbXBsYXRlIGFzIGEgRG9jdW1lbnRGcmFnbWVudFxuICAgICAgICB0aGlzLmlubGluZVRlbXBhbHRlID0gXy5leHRyYWN0Q29udGVudCh0aGlzLmVsLCB0cnVlKVxuICAgICAgfVxuICAgICAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UoaWQpXG4gICAgICBpZiAodG9rZW5zKSB7XG4gICAgICAgIC8vIGR5bmFtaWMgY29tcG9uZW50IHRvIGJlIHJlc29sdmVkIGxhdGVyXG4gICAgICAgIHZhciBjdG9yRXhwID0gdGV4dFBhcnNlci50b2tlbnNUb0V4cCh0b2tlbnMpXG4gICAgICAgIHRoaXMuY3RvckdldHRlciA9IGV4cFBhcnNlci5wYXJzZShjdG9yRXhwKS5nZXRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHN0YXRpY1xuICAgICAgICB0aGlzLmNvbXBvbmVudElkID0gaWRcbiAgICAgICAgdGhpcy5wZW5kaW5nRGF0YSA9IG51bGxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcmVzb2x2ZUNvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY29tcG9uZW50U3RhdGUgPSBQRU5ESU5HXG4gICAgdGhpcy52bS5fcmVzb2x2ZUNvbXBvbmVudCh0aGlzLmNvbXBvbmVudElkLCBfLmJpbmQoZnVuY3Rpb24gKEN0b3IpIHtcbiAgICAgIGlmICh0aGlzLmNvbXBvbmVudFN0YXRlID09PSBBQk9SVEVEKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdGhpcy5DdG9yID0gQ3RvclxuICAgICAgdmFyIG1lcmdlZCA9IG1lcmdlT3B0aW9ucyhDdG9yLm9wdGlvbnMsIHt9LCB7XG4gICAgICAgICRwYXJlbnQ6IHRoaXMudm1cbiAgICAgIH0pXG4gICAgICBtZXJnZWQudGVtcGxhdGUgPSB0aGlzLmlubGluZVRlbXBhbHRlIHx8IG1lcmdlZC50ZW1wbGF0ZVxuICAgICAgbWVyZ2VkLl9hc0NvbXBvbmVudCA9IHRydWVcbiAgICAgIG1lcmdlZC5fcGFyZW50ID0gdGhpcy52bVxuICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRyYW5zY2x1ZGUodGhpcy50ZW1wbGF0ZSwgbWVyZ2VkKVxuICAgICAgLy8gSW1wb3J0YW50OiBtYXJrIHRoZSB0ZW1wbGF0ZSBhcyBhIHJvb3Qgbm9kZSBzbyB0aGF0XG4gICAgICAvLyBjdXN0b20gZWxlbWVudCBjb21wb25lbnRzIGRvbid0IGdldCBjb21waWxlZCB0d2ljZS5cbiAgICAgIC8vIGZpeGVzICM4MjJcbiAgICAgIHRoaXMudGVtcGxhdGUuX192dWVfXyA9IHRydWVcbiAgICAgIHRoaXMuX2xpbmtGbiA9IGNvbXBpbGUodGhpcy50ZW1wbGF0ZSwgbWVyZ2VkKVxuICAgICAgdGhpcy5jb21wb25lbnRTdGF0ZSA9IFJFU09MVkVEXG4gICAgICB0aGlzLnJlYWxVcGRhdGUodGhpcy5wZW5kaW5nRGF0YSlcbiAgICAgIHRoaXMucGVuZGluZ0RhdGEgPSBudWxsXG4gICAgfSwgdGhpcykpXG4gIH0sXG5cbiAgICAvKipcbiAgICogUmVzb2x2ZSBhIGR5bmFtaWMgY29tcG9uZW50IHRvIHVzZSBmb3IgYW4gaW5zdGFuY2UuXG4gICAqIFRoZSB0cmlja3kgcGFydCBoZXJlIGlzIHRoYXQgdGhlcmUgY291bGQgYmUgZHluYW1pY1xuICAgKiBjb21wb25lbnRzIGRlcGVuZGluZyBvbiBpbnN0YW5jZSBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YVxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG5cbiAgcmVzb2x2ZUR5bmFtaWNDb21wb25lbnQ6IGZ1bmN0aW9uIChkYXRhLCBtZXRhKSB7XG4gICAgLy8gY3JlYXRlIGEgdGVtcG9yYXJ5IGNvbnRleHQgb2JqZWN0IGFuZCBjb3B5IGRhdGFcbiAgICAvLyBhbmQgbWV0YSBwcm9wZXJ0aWVzIG9udG8gaXQuXG4gICAgLy8gdXNlIF8uZGVmaW5lIHRvIGF2b2lkIGFjY2lkZW50YWxseSBvdmVyd3JpdGluZyBzY29wZVxuICAgIC8vIHByb3BlcnRpZXMuXG4gICAgdmFyIGNvbnRleHQgPSBPYmplY3QuY3JlYXRlKHRoaXMudm0pXG4gICAgdmFyIGtleVxuICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgIF8uZGVmaW5lKGNvbnRleHQsIGtleSwgZGF0YVtrZXldKVxuICAgIH1cbiAgICBmb3IgKGtleSBpbiBtZXRhKSB7XG4gICAgICBfLmRlZmluZShjb250ZXh0LCBrZXksIG1ldGFba2V5XSlcbiAgICB9XG4gICAgdmFyIGlkID0gdGhpcy5jdG9yR2V0dGVyLmNhbGwoY29udGV4dCwgY29udGV4dClcbiAgICB2YXIgQ3RvciA9IHRoaXMudm0uJG9wdGlvbnMuY29tcG9uZW50c1tpZF1cbiAgICBfLmFzc2VydEFzc2V0KEN0b3IsICdjb21wb25lbnQnLCBpZClcbiAgICBpZiAoIUN0b3Iub3B0aW9ucykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnQXN5bmMgcmVzb2x1dGlvbiBpcyBub3Qgc3VwcG9ydGVkIGZvciB2LXJlcGVhdCAnICtcbiAgICAgICAgJysgZHluYW1pYyBjb21wb25lbnQuIChjb21wb25lbnQ6ICcgKyBpZCArICcpJ1xuICAgICAgKVxuICAgICAgcmV0dXJuIF8uVnVlXG4gICAgfVxuICAgIHJldHVybiBDdG9yXG4gIH0sXG5cbiAgLyoqXG4gICAqIFVwZGF0ZS5cbiAgICogVGhpcyBpcyBjYWxsZWQgd2hlbmV2ZXIgdGhlIEFycmF5IG11dGF0ZXMuIElmIHdlIGhhdmVcbiAgICogYSBjb21wb25lbnQsIHdlIG1pZ2h0IG5lZWQgdG8gd2FpdCBmb3IgaXQgdG8gcmVzb2x2ZVxuICAgKiBhc3luY2hyb25vdXNseS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheXxOdW1iZXJ8U3RyaW5nfSBkYXRhXG4gICAqL1xuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRJZCkge1xuICAgICAgdmFyIHN0YXRlID0gdGhpcy5jb21wb25lbnRTdGF0ZVxuICAgICAgaWYgKHN0YXRlID09PSBVTlJFU09MVkVEKSB7XG4gICAgICAgIHRoaXMucGVuZGluZ0RhdGEgPSBkYXRhXG4gICAgICAgIC8vIG9uY2UgcmVzb2x2ZWQsIGl0IHdpbGwgY2FsbCByZWFsVXBkYXRlXG4gICAgICAgIHRoaXMucmVzb2x2ZUNvbXBvbmVudCgpXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBQRU5ESU5HKSB7XG4gICAgICAgIHRoaXMucGVuZGluZ0RhdGEgPSBkYXRhXG4gICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBSRVNPTFZFRCkge1xuICAgICAgICB0aGlzLnJlYWxVcGRhdGUoZGF0YSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWFsVXBkYXRlKGRhdGEpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgcmVhbCB1cGRhdGUgdGhhdCBhY3R1YWxseSBtb2RpZmllcyB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fE51bWJlcnxTdHJpbmd9IGRhdGFcbiAgICovXG5cbiAgcmVhbFVwZGF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCBbXVxuICAgIHZhciB0eXBlID0gdHlwZW9mIGRhdGFcbiAgICBpZiAodHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGRhdGEgPSByYW5nZShkYXRhKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGRhdGEgPSBfLnRvQXJyYXkoZGF0YSlcbiAgICB9XG4gICAgdGhpcy52bXMgPSB0aGlzLmRpZmYoZGF0YSwgdGhpcy52bXMpXG4gICAgLy8gdXBkYXRlIHYtcmVmXG4gICAgaWYgKHRoaXMucmVmSUQpIHtcbiAgICAgIHRoaXMudm0uJFt0aGlzLnJlZklEXSA9IHRoaXMudm1zXG4gICAgfVxuICAgIGlmICh0aGlzLmVsSWQpIHtcbiAgICAgIHRoaXMudm0uJCRbdGhpcy5lbElkXSA9IHRoaXMudm1zLm1hcChmdW5jdGlvbiAodm0pIHtcbiAgICAgICAgcmV0dXJuIHZtLiRlbFxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIERpZmYsIGJhc2VkIG9uIG5ldyBkYXRhIGFuZCBvbGQgZGF0YSwgZGV0ZXJtaW5lIHRoZVxuICAgKiBtaW5pbXVtIGFtb3VudCBvZiBET00gbWFuaXB1bGF0aW9ucyBuZWVkZWQgdG8gbWFrZSB0aGVcbiAgICogRE9NIHJlZmxlY3QgdGhlIG5ldyBkYXRhIEFycmF5LlxuICAgKlxuICAgKiBUaGUgYWxnb3JpdGhtIGRpZmZzIHRoZSBuZXcgZGF0YSBBcnJheSBieSBzdG9yaW5nIGFcbiAgICogaGlkZGVuIHJlZmVyZW5jZSB0byBhbiBvd25lciB2bSBpbnN0YW5jZSBvbiBwcmV2aW91c2x5XG4gICAqIHNlZW4gZGF0YS4gVGhpcyBhbGxvd3MgdXMgdG8gYWNoaWV2ZSBPKG4pIHdoaWNoIGlzXG4gICAqIGJldHRlciB0aGFuIGEgbGV2ZW5zaHRlaW4gZGlzdGFuY2UgYmFzZWQgYWxnb3JpdGhtLFxuICAgKiB3aGljaCBpcyBPKG0gKiBuKS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gZGF0YVxuICAgKiBAcGFyYW0ge0FycmF5fSBvbGRWbXNcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuXG4gIGRpZmY6IGZ1bmN0aW9uIChkYXRhLCBvbGRWbXMpIHtcbiAgICB2YXIgaWRLZXkgPSB0aGlzLmlkS2V5XG4gICAgdmFyIGNvbnZlcnRlZCA9IHRoaXMuY29udmVydGVkXG4gICAgdmFyIHJlZiA9IHRoaXMucmVmXG4gICAgdmFyIGFsaWFzID0gdGhpcy5hcmdcbiAgICB2YXIgaW5pdCA9ICFvbGRWbXNcbiAgICB2YXIgdm1zID0gbmV3IEFycmF5KGRhdGEubGVuZ3RoKVxuICAgIHZhciBvYmosIHJhdywgdm0sIGksIGxcbiAgICAvLyBGaXJzdCBwYXNzLCBnbyB0aHJvdWdoIHRoZSBuZXcgQXJyYXkgYW5kIGZpbGwgdXBcbiAgICAvLyB0aGUgbmV3IHZtcyBhcnJheS4gSWYgYSBwaWVjZSBvZiBkYXRhIGhhcyBhIGNhY2hlZFxuICAgIC8vIGluc3RhbmNlIGZvciBpdCwgd2UgcmV1c2UgaXQuIE90aGVyd2lzZSBidWlsZCBhIG5ld1xuICAgIC8vIGluc3RhbmNlLlxuICAgIGZvciAoaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgb2JqID0gZGF0YVtpXVxuICAgICAgcmF3ID0gY29udmVydGVkID8gb2JqLiR2YWx1ZSA6IG9ialxuICAgICAgdm0gPSAhaW5pdCAmJiB0aGlzLmdldFZtKHJhdywgY29udmVydGVkID8gb2JqLiRrZXkgOiBudWxsKVxuICAgICAgaWYgKHZtKSB7IC8vIHJldXNhYmxlIGluc3RhbmNlXG4gICAgICAgIHZtLl9yZXVzZWQgPSB0cnVlXG4gICAgICAgIHZtLiRpbmRleCA9IGkgLy8gdXBkYXRlICRpbmRleFxuICAgICAgICAvLyB1cGRhdGUgZGF0YSBmb3IgdHJhY2stYnkgb3Igb2JqZWN0IHJlcGVhdCxcbiAgICAgICAgLy8gc2luY2UgaW4gdGhlc2UgdHdvIGNhc2VzIHRoZSBkYXRhIGlzIHJlcGxhY2VkXG4gICAgICAgIC8vIHJhdGhlciB0aGFuIG11dGF0ZWQuXG4gICAgICAgIGlmIChpZEtleSB8fCBjb252ZXJ0ZWQpIHtcbiAgICAgICAgICBpZiAoYWxpYXMpIHtcbiAgICAgICAgICAgIHZtW2FsaWFzXSA9IHJhd1xuICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc1BsYWluT2JqZWN0KHJhdykpIHtcbiAgICAgICAgICAgIHZtLiRkYXRhID0gcmF3XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLiR2YWx1ZSA9IHJhd1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gbmV3IGluc3RhbmNlXG4gICAgICAgIHZtID0gdGhpcy5idWlsZChvYmosIGksIHRydWUpXG4gICAgICAgIC8vIHRoZSBfbmV3IGZsYWcgaXMgdXNlZCBpbiB0aGUgc2Vjb25kIHBhc3MgZm9yXG4gICAgICAgIC8vIHZtIGNhY2hlIHJldHJpdmFsLCBidXQgaWYgdGhpcyBpcyB0aGUgaW5pdCBwaGFzZVxuICAgICAgICAvLyB0aGUgZmxhZyBjYW4ganVzdCBiZSBzZXQgdG8gZmFsc2UgZGlyZWN0bHkuXG4gICAgICAgIHZtLl9uZXcgPSAhaW5pdFxuICAgICAgICB2bS5fcmV1c2VkID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHZtc1tpXSA9IHZtXG4gICAgICAvLyBpbnNlcnQgaWYgdGhpcyBpcyBmaXJzdCBydW5cbiAgICAgIGlmIChpbml0KSB7XG4gICAgICAgIHZtLiRiZWZvcmUocmVmKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBpZiB0aGlzIGlzIHRoZSBmaXJzdCBydW4sIHdlJ3JlIGRvbmUuXG4gICAgaWYgKGluaXQpIHtcbiAgICAgIHJldHVybiB2bXNcbiAgICB9XG4gICAgLy8gU2Vjb25kIHBhc3MsIGdvIHRocm91Z2ggdGhlIG9sZCB2bSBpbnN0YW5jZXMgYW5kXG4gICAgLy8gZGVzdHJveSB0aG9zZSB3aG8gYXJlIG5vdCByZXVzZWQgKGFuZCByZW1vdmUgdGhlbVxuICAgIC8vIGZyb20gY2FjaGUpXG4gICAgZm9yIChpID0gMCwgbCA9IG9sZFZtcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZtID0gb2xkVm1zW2ldXG4gICAgICBpZiAoIXZtLl9yZXVzZWQpIHtcbiAgICAgICAgdGhpcy51bmNhY2hlVm0odm0pXG4gICAgICAgIHZtLiRkZXN0cm95KHRydWUpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIGZpbmFsIHBhc3MsIG1vdmUvaW5zZXJ0IG5ldyBpbnN0YW5jZXMgaW50byB0aGVcbiAgICAvLyByaWdodCBwbGFjZS4gV2UncmUgZ29pbmcgaW4gcmV2ZXJzZSBoZXJlIGJlY2F1c2VcbiAgICAvLyBpbnNlcnRCZWZvcmUgcmVsaWVzIG9uIHRoZSBuZXh0IHNpYmxpbmcgdG8gYmVcbiAgICAvLyByZXNvbHZlZC5cbiAgICB2YXIgdGFyZ2V0TmV4dCwgY3VycmVudE5leHRcbiAgICBpID0gdm1zLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZtID0gdm1zW2ldXG4gICAgICAvLyB0aGlzIGlzIHRoZSB2bSB0aGF0IHdlIHNob3VsZCBiZSBpbiBmcm9udCBvZlxuICAgICAgdGFyZ2V0TmV4dCA9IHZtc1tpICsgMV1cbiAgICAgIGlmICghdGFyZ2V0TmV4dCkge1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBsYXN0IGl0ZW0uIElmIGl0J3MgcmV1c2VkIHRoZW5cbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlIHdpbGwgZXZlbnR1YWxseSBiZSBpbiB0aGUgcmlnaHRcbiAgICAgICAgLy8gcGxhY2UsIHNvIG5vIG5lZWQgdG8gdG91Y2ggaXQuIE90aGVyd2lzZSwgaW5zZXJ0XG4gICAgICAgIC8vIGl0LlxuICAgICAgICBpZiAoIXZtLl9yZXVzZWQpIHtcbiAgICAgICAgICB2bS4kYmVmb3JlKHJlZilcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5leHRFbCA9IHRhcmdldE5leHQuJGVsXG4gICAgICAgIGlmICh2bS5fcmV1c2VkKSB7XG4gICAgICAgICAgLy8gdGhpcyBpcyB0aGUgdm0gd2UgYXJlIGFjdHVhbGx5IGluIGZyb250IG9mXG4gICAgICAgICAgY3VycmVudE5leHQgPSBmaW5kTmV4dFZtKHZtLCByZWYpXG4gICAgICAgICAgLy8gd2Ugb25seSBuZWVkIHRvIG1vdmUgaWYgd2UgYXJlIG5vdCBpbiB0aGUgcmlnaHRcbiAgICAgICAgICAvLyBwbGFjZSBhbHJlYWR5LlxuICAgICAgICAgIGlmIChjdXJyZW50TmV4dCAhPT0gdGFyZ2V0TmV4dCkge1xuICAgICAgICAgICAgdm0uJGJlZm9yZShuZXh0RWwsIG51bGwsIGZhbHNlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBuZXcgaW5zdGFuY2UsIGluc2VydCB0byBleGlzdGluZyBuZXh0XG4gICAgICAgICAgdm0uJGJlZm9yZShuZXh0RWwpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZtLl9uZXcgPSBmYWxzZVxuICAgICAgdm0uX3JldXNlZCA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB2bXNcbiAgfSxcblxuICAvKipcbiAgICogQnVpbGQgYSBuZXcgaW5zdGFuY2UgYW5kIGNhY2hlIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAgICogQHBhcmFtIHtCb29sZWFufSBuZWVkQ2FjaGVcbiAgICovXG5cbiAgYnVpbGQ6IGZ1bmN0aW9uIChkYXRhLCBpbmRleCwgbmVlZENhY2hlKSB7XG4gICAgdmFyIG1ldGEgPSB7ICRpbmRleDogaW5kZXggfVxuICAgIGlmICh0aGlzLmNvbnZlcnRlZCkge1xuICAgICAgbWV0YS4ka2V5ID0gZGF0YS4ka2V5XG4gICAgfVxuICAgIHZhciByYXcgPSB0aGlzLmNvbnZlcnRlZCA/IGRhdGEuJHZhbHVlIDogZGF0YVxuICAgIHZhciBhbGlhcyA9IHRoaXMuYXJnXG4gICAgaWYgKGFsaWFzKSB7XG4gICAgICBkYXRhID0ge31cbiAgICAgIGRhdGFbYWxpYXNdID0gcmF3XG4gICAgfSBlbHNlIGlmICghaXNQbGFpbk9iamVjdChyYXcpKSB7XG4gICAgICAvLyBub24tb2JqZWN0IHZhbHVlc1xuICAgICAgZGF0YSA9IHt9XG4gICAgICBtZXRhLiR2YWx1ZSA9IHJhd1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWZhdWx0XG4gICAgICBkYXRhID0gcmF3XG4gICAgfVxuICAgIC8vIHJlc29sdmUgY29uc3RydWN0b3JcbiAgICB2YXIgQ3RvciA9IHRoaXMuQ3RvciB8fCB0aGlzLnJlc29sdmVEeW5hbWljQ29tcG9uZW50KGRhdGEsIG1ldGEpXG4gICAgdmFyIHZtID0gdGhpcy52bS4kYWRkQ2hpbGQoe1xuICAgICAgZWw6IHRlbXBsYXRlUGFyc2VyLmNsb25lKHRoaXMudGVtcGxhdGUpLFxuICAgICAgX2FzQ29tcG9uZW50OiB0aGlzLmFzQ29tcG9uZW50LFxuICAgICAgX2hvc3Q6IHRoaXMuX2hvc3QsXG4gICAgICBfbGlua0ZuOiB0aGlzLl9saW5rRm4sXG4gICAgICBfbWV0YTogbWV0YSxcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBpbmhlcml0OiB0aGlzLmluaGVyaXQsXG4gICAgICB0ZW1wbGF0ZTogdGhpcy5pbmxpbmVUZW1wYWx0ZVxuICAgIH0sIEN0b3IpXG4gICAgLy8gZmxhZyB0aGlzIGluc3RhbmNlIGFzIGEgcmVwZWF0IGluc3RhbmNlXG4gICAgLy8gc28gdGhhdCB3ZSBjYW4gc2tpcCBpdCBpbiB2bS5fZGlnZXN0XG4gICAgdm0uX3JlcGVhdCA9IHRydWVcbiAgICAvLyBjYWNoZSBpbnN0YW5jZVxuICAgIGlmIChuZWVkQ2FjaGUpIHtcbiAgICAgIHRoaXMuY2FjaGVWbShyYXcsIHZtLCB0aGlzLmNvbnZlcnRlZCA/IG1ldGEuJGtleSA6IG51bGwpXG4gICAgfVxuICAgIC8vIHN5bmMgYmFjayBjaGFuZ2VzIGZvciB0d28td2F5IGJpbmRpbmdzIG9mIHByaW1pdGl2ZSB2YWx1ZXNcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiByYXdcbiAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHZhciBkaXIgPSB0aGlzXG4gICAgICB2bS4kd2F0Y2goYWxpYXMgfHwgJyR2YWx1ZScsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgZGlyLl93aXRoTG9jayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKGRpci5jb252ZXJ0ZWQpIHtcbiAgICAgICAgICAgIGRpci5yYXdWYWx1ZVt2bS4ka2V5XSA9IHZhbFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXIucmF3VmFsdWUuJHNldCh2bS4kaW5kZXgsIHZhbClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdm1cbiAgfSxcblxuICAvKipcbiAgICogVW5iaW5kLCB0ZWFyZG93biBldmVyeXRoaW5nXG4gICAqL1xuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY29tcG9uZW50U3RhdGUgPSBBQk9SVEVEXG4gICAgaWYgKHRoaXMucmVmSUQpIHtcbiAgICAgIHRoaXMudm0uJFt0aGlzLnJlZklEXSA9IG51bGxcbiAgICB9XG4gICAgaWYgKHRoaXMudm1zKSB7XG4gICAgICB2YXIgaSA9IHRoaXMudm1zLmxlbmd0aFxuICAgICAgdmFyIHZtXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZtID0gdGhpcy52bXNbaV1cbiAgICAgICAgdGhpcy51bmNhY2hlVm0odm0pXG4gICAgICAgIHZtLiRkZXN0cm95KClcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIENhY2hlIGEgdm0gaW5zdGFuY2UgYmFzZWQgb24gaXRzIGRhdGEuXG4gICAqXG4gICAqIElmIHRoZSBkYXRhIGlzIGFuIG9iamVjdCwgd2Ugc2F2ZSB0aGUgdm0ncyByZWZlcmVuY2Ugb25cbiAgICogdGhlIGRhdGEgb2JqZWN0IGFzIGEgaGlkZGVuIHByb3BlcnR5LiBPdGhlcndpc2Ugd2VcbiAgICogY2FjaGUgdGhlbSBpbiBhbiBvYmplY3QgYW5kIGZvciBlYWNoIHByaW1pdGl2ZSB2YWx1ZVxuICAgKiB0aGVyZSBpcyBhbiBhcnJheSBpbiBjYXNlIHRoZXJlIGFyZSBkdXBsaWNhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge1Z1ZX0gdm1cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtrZXldXG4gICAqL1xuXG4gIGNhY2hlVm06IGZ1bmN0aW9uIChkYXRhLCB2bSwga2V5KSB7XG4gICAgdmFyIGlkS2V5ID0gdGhpcy5pZEtleVxuICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGVcbiAgICB2YXIgaWRcbiAgICBpZiAoa2V5IHx8IGlkS2V5KSB7XG4gICAgICBpZCA9IGlkS2V5ID8gZGF0YVtpZEtleV0gOiBrZXlcbiAgICAgIGlmICghY2FjaGVbaWRdKSB7XG4gICAgICAgIGNhY2hlW2lkXSA9IHZtXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLndhcm4oJ0R1cGxpY2F0ZSB0cmFjay1ieSBrZXkgaW4gdi1yZXBlYXQ6ICcgKyBpZClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBpZCA9IHRoaXMuaWRcbiAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICBpZiAoZGF0YVtpZF0gPT09IG51bGwpIHtcbiAgICAgICAgICBkYXRhW2lkXSA9IHZtXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgXy53YXJuKFxuICAgICAgICAgICAgJ0R1cGxpY2F0ZSBvYmplY3RzIGFyZSBub3Qgc3VwcG9ydGVkIGluIHYtcmVwZWF0ICcgK1xuICAgICAgICAgICAgJ3doZW4gdXNpbmcgY29tcG9uZW50cyBvciB0cmFuc2l0aW9ucy4nXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfLmRlZmluZShkYXRhLCBpZCwgdm0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghY2FjaGVbZGF0YV0pIHtcbiAgICAgICAgY2FjaGVbZGF0YV0gPSBbdm1dXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWNoZVtkYXRhXS5wdXNoKHZtKVxuICAgICAgfVxuICAgIH1cbiAgICB2bS5fcmF3ID0gZGF0YVxuICB9LFxuXG4gIC8qKlxuICAgKiBUcnkgdG8gZ2V0IGEgY2FjaGVkIGluc3RhbmNlIGZyb20gYSBwaWVjZSBvZiBkYXRhLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2tleV1cbiAgICogQHJldHVybiB7VnVlfHVuZGVmaW5lZH1cbiAgICovXG5cbiAgZ2V0Vm06IGZ1bmN0aW9uIChkYXRhLCBrZXkpIHtcbiAgICB2YXIgaWRLZXkgPSB0aGlzLmlkS2V5XG4gICAgaWYgKGtleSB8fCBpZEtleSkge1xuICAgICAgdmFyIGlkID0gaWRLZXkgPyBkYXRhW2lkS2V5XSA6IGtleVxuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVbaWRdXG4gICAgfSBlbHNlIGlmIChpc09iamVjdChkYXRhKSkge1xuICAgICAgcmV0dXJuIGRhdGFbdGhpcy5pZF1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGNhY2hlZCA9IHRoaXMuY2FjaGVbZGF0YV1cbiAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgdmFyIGkgPSAwXG4gICAgICAgIHZhciB2bSA9IGNhY2hlZFtpXVxuICAgICAgICAvLyBzaW5jZSBkdXBsaWNhdGVkIHZtIGluc3RhbmNlcyBtaWdodCBiZSBhIHJldXNlZFxuICAgICAgICAvLyBvbmUgT1IgYSBuZXdseSBjcmVhdGVkIG9uZSwgd2UgbmVlZCB0byByZXR1cm4gdGhlXG4gICAgICAgIC8vIGZpcnN0IGluc3RhbmNlIHRoYXQgaXMgbmVpdGhlciBvZiB0aGVzZS5cbiAgICAgICAgd2hpbGUgKHZtICYmICh2bS5fcmV1c2VkIHx8IHZtLl9uZXcpKSB7XG4gICAgICAgICAgdm0gPSBjYWNoZWRbKytpXVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2bVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRGVsZXRlIGEgY2FjaGVkIHZtIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0ge1Z1ZX0gdm1cbiAgICovXG5cbiAgdW5jYWNoZVZtOiBmdW5jdGlvbiAodm0pIHtcbiAgICB2YXIgZGF0YSA9IHZtLl9yYXdcbiAgICB2YXIgaWRLZXkgPSB0aGlzLmlkS2V5XG4gICAgaWYgKGlkS2V5IHx8IHRoaXMuY29udmVydGVkKSB7XG4gICAgICB2YXIgaWQgPSBpZEtleSA/IGRhdGFbaWRLZXldIDogdm0uJGtleVxuICAgICAgdGhpcy5jYWNoZVtpZF0gPSBudWxsXG4gICAgfSBlbHNlIGlmIChpc09iamVjdChkYXRhKSkge1xuICAgICAgZGF0YVt0aGlzLmlkXSA9IG51bGxcbiAgICAgIHZtLl9yYXcgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FjaGVbZGF0YV0ucG9wKClcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIEhlbHBlciB0byBmaW5kIHRoZSBuZXh0IGVsZW1lbnQgdGhhdCBpcyBhbiBpbnN0YW5jZVxuICogcm9vdCBub2RlLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGEgZGVzdHJveWVkIHZtJ3NcbiAqIGVsZW1lbnQgY291bGQgc3RpbGwgYmUgbGluZ2VyaW5nIGluIHRoZSBET00gYmVmb3JlIGl0c1xuICogbGVhdmluZyB0cmFuc2l0aW9uIGZpbmlzaGVzLCBidXQgaXRzIF9fdnVlX18gcmVmZXJlbmNlXG4gKiBzaG91bGQgaGF2ZSBiZWVuIHJlbW92ZWQgc28gd2UgY2FuIHNraXAgdGhlbS5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Q29tbWVudE5vZGV9IHJlZlxuICogQHJldHVybiB7VnVlfVxuICovXG5cbmZ1bmN0aW9uIGZpbmROZXh0Vm0gKHZtLCByZWYpIHtcbiAgdmFyIGVsID0gKHZtLl9ibG9ja0VuZCB8fCB2bS4kZWwpLm5leHRTaWJsaW5nXG4gIHdoaWxlICghZWwuX192dWVfXyAmJiBlbCAhPT0gcmVmKSB7XG4gICAgZWwgPSBlbC5uZXh0U2libGluZ1xuICB9XG4gIHJldHVybiBlbC5fX3Z1ZV9fXG59XG5cbi8qKlxuICogQXR0ZW1wdCB0byBjb252ZXJ0IG5vbi1BcnJheSBvYmplY3RzIHRvIGFycmF5LlxuICogVGhpcyBpcyB0aGUgZGVmYXVsdCBmaWx0ZXIgaW5zdGFsbGVkIHRvIGV2ZXJ5IHYtcmVwZWF0XG4gKiBkaXJlY3RpdmUuXG4gKlxuICogSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCAqKnRoZSBkaXJlY3RpdmUqKiBhcyBgdGhpc2BcbiAqIGNvbnRleHQgc28gdGhhdCB3ZSBjYW4gbWFyayB0aGUgcmVwZWF0IGFycmF5IGFzIGNvbnZlcnRlZFxuICogZnJvbSBhbiBvYmplY3QuXG4gKlxuICogQHBhcmFtIHsqfSBvYmpcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBvYmpUb0FycmF5IChvYmopIHtcbiAgLy8gcmVnYXJkbGVzcyBvZiB0eXBlLCBzdG9yZSB0aGUgdW4tZmlsdGVyZWQgcmF3IHZhbHVlLlxuICB0aGlzLnJhd1ZhbHVlID0gb2JqXG4gIGlmICghaXNQbGFpbk9iamVjdChvYmopKSB7XG4gICAgcmV0dXJuIG9ialxuICB9XG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gIHZhciByZXMgPSBuZXcgQXJyYXkoaSlcbiAgdmFyIGtleVxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIHJlc1tpXSA9IHtcbiAgICAgICRrZXk6IGtleSxcbiAgICAgICR2YWx1ZTogb2JqW2tleV1cbiAgICB9XG4gIH1cbiAgLy8gYHRoaXNgIHBvaW50cyB0byB0aGUgcmVwZWF0IGRpcmVjdGl2ZSBpbnN0YW5jZVxuICB0aGlzLmNvbnZlcnRlZCA9IHRydWVcbiAgcmV0dXJuIHJlc1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIHJhbmdlIGFycmF5IGZyb20gZ2l2ZW4gbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiByYW5nZSAobikge1xuICB2YXIgaSA9IC0xXG4gIHZhciByZXQgPSBuZXcgQXJyYXkobilcbiAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICByZXRbaV0gPSBpXG4gIH1cbiAgcmV0dXJuIHJldFxufSIsInZhciB0cmFuc2l0aW9uID0gcmVxdWlyZSgnLi4vdHJhbnNpdGlvbicpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBlbCA9IHRoaXMuZWxcbiAgdHJhbnNpdGlvbi5hcHBseShlbCwgdmFsdWUgPyAxIDogLTEsIGZ1bmN0aW9uICgpIHtcbiAgICBlbC5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnJyA6ICdub25lJ1xuICB9LCB0aGlzLnZtKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgcHJlZml4ZXMgPSBbJy13ZWJraXQtJywgJy1tb3otJywgJy1tcy0nXVxudmFyIGNhbWVsUHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnbXMnXVxudmFyIGltcG9ydGFudFJFID0gLyFpbXBvcnRhbnQ7PyQvXG52YXIgY2FtZWxSRSA9IC8oW2Etel0pKFtBLVpdKS9nXG52YXIgdGVzdEVsID0gbnVsbFxudmFyIHByb3BDYWNoZSA9IHt9XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGRlZXA6IHRydWUsXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5hcmcpIHtcbiAgICAgIHRoaXMuc2V0UHJvcCh0aGlzLmFyZywgdmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIGNhY2hlIG9iamVjdCBzdHlsZXMgc28gdGhhdCBvbmx5IGNoYW5nZWQgcHJvcHNcbiAgICAgICAgLy8gYXJlIGFjdHVhbGx5IHVwZGF0ZWQuXG4gICAgICAgIGlmICghdGhpcy5jYWNoZSkgdGhpcy5jYWNoZSA9IHt9XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gdmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNldFByb3AocHJvcCwgdmFsdWVbcHJvcF0pXG4gICAgICAgICAgLyoganNoaW50IGVxZXFlcTogZmFsc2UgKi9cbiAgICAgICAgICBpZiAodmFsdWVbcHJvcF0gIT0gdGhpcy5jYWNoZVtwcm9wXSkge1xuICAgICAgICAgICAgdGhpcy5jYWNoZVtwcm9wXSA9IHZhbHVlW3Byb3BdXG4gICAgICAgICAgICB0aGlzLnNldFByb3AocHJvcCwgdmFsdWVbcHJvcF0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVsLnN0eWxlLmNzc1RleHQgPSB2YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBzZXRQcm9wOiBmdW5jdGlvbiAocHJvcCwgdmFsdWUpIHtcbiAgICBwcm9wID0gbm9ybWFsaXplKHByb3ApXG4gICAgaWYgKCFwcm9wKSByZXR1cm4gLy8gdW5zdXBwb3J0ZWQgcHJvcFxuICAgIC8vIGNhc3QgcG9zc2libGUgbnVtYmVycy9ib29sZWFucyBpbnRvIHN0cmluZ3NcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkgdmFsdWUgKz0gJydcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHZhciBpc0ltcG9ydGFudCA9IGltcG9ydGFudFJFLnRlc3QodmFsdWUpXG4gICAgICAgID8gJ2ltcG9ydGFudCdcbiAgICAgICAgOiAnJ1xuICAgICAgaWYgKGlzSW1wb3J0YW50KSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZShpbXBvcnRhbnRSRSwgJycpLnRyaW0oKVxuICAgICAgfVxuICAgICAgdGhpcy5lbC5zdHlsZS5zZXRQcm9wZXJ0eShwcm9wLCB2YWx1ZSwgaXNJbXBvcnRhbnQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuc3R5bGUucmVtb3ZlUHJvcGVydHkocHJvcClcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSBhIENTUyBwcm9wZXJ0eSBuYW1lLlxuICogLSBjYWNoZSByZXN1bHRcbiAqIC0gYXV0byBwcmVmaXhcbiAqIC0gY2FtZWxDYXNlIC0+IGRhc2gtY2FzZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gbm9ybWFsaXplIChwcm9wKSB7XG4gIGlmIChwcm9wQ2FjaGVbcHJvcF0pIHtcbiAgICByZXR1cm4gcHJvcENhY2hlW3Byb3BdXG4gIH1cbiAgdmFyIHJlcyA9IHByZWZpeChwcm9wKVxuICBwcm9wQ2FjaGVbcHJvcF0gPSBwcm9wQ2FjaGVbcmVzXSA9IHJlc1xuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogQXV0byBkZXRlY3QgdGhlIGFwcHJvcHJpYXRlIHByZWZpeCBmb3IgYSBDU1MgcHJvcGVydHkuXG4gKiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvNTIzNjkyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBwcmVmaXggKHByb3ApIHtcbiAgcHJvcCA9IHByb3AucmVwbGFjZShjYW1lbFJFLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpXG4gIHZhciBjYW1lbCA9IF8uY2FtZWxpemUocHJvcClcbiAgdmFyIHVwcGVyID0gY2FtZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjYW1lbC5zbGljZSgxKVxuICBpZiAoIXRlc3RFbCkge1xuICAgIHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIH1cbiAgaWYgKGNhbWVsIGluIHRlc3RFbC5zdHlsZSkge1xuICAgIHJldHVybiBwcm9wXG4gIH1cbiAgdmFyIGkgPSBwcmVmaXhlcy5sZW5ndGhcbiAgdmFyIHByZWZpeGVkXG4gIHdoaWxlIChpLS0pIHtcbiAgICBwcmVmaXhlZCA9IGNhbWVsUHJlZml4ZXNbaV0gKyB1cHBlclxuICAgIGlmIChwcmVmaXhlZCBpbiB0ZXN0RWwuc3R5bGUpIHtcbiAgICAgIHJldHVybiBwcmVmaXhlc1tpXSArIHByb3BcbiAgICB9XG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hdHRyID0gdGhpcy5lbC5ub2RlVHlwZSA9PT0gM1xuICAgICAgPyAnbm9kZVZhbHVlJ1xuICAgICAgOiAndGV4dENvbnRlbnQnXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmVsW3RoaXMuYXR0cl0gPSBfLnRvU3RyaW5nKHZhbHVlKVxuICB9XG4gIFxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHByaW9yaXR5OiAxMDAwLFxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5faXNEeW5hbWljTGl0ZXJhbCkge1xuICAgICAgdGhpcy51cGRhdGUodGhpcy5leHByZXNzaW9uKVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciB2bSA9IHRoaXMuZWwuX192dWVfXyB8fCB0aGlzLnZtXG4gICAgdGhpcy5lbC5fX3ZfdHJhbnMgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICAvLyByZXNvbHZlIHRoZSBjdXN0b20gdHJhbnNpdGlvbiBmdW5jdGlvbnMgbm93XG4gICAgICAvLyBzbyB0aGUgdHJhbnNpdGlvbiBtb2R1bGUga25vd3MgdGhpcyBpcyBhXG4gICAgICAvLyBqYXZhc2NyaXB0IHRyYW5zaXRpb24gd2l0aG91dCBoYXZpbmcgdG8gY2hlY2tcbiAgICAgIC8vIGNvbXB1dGVkIENTUy5cbiAgICAgIGZuczogdm0uJG9wdGlvbnMudHJhbnNpdGlvbnNbaWRdXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIFBhdGggPSByZXF1aXJlKCcuLi9wYXJzZXJzL3BhdGgnKVxuXG4vKipcbiAqIEZpbHRlciBmaWx0ZXIgZm9yIHYtcmVwZWF0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaEtleVxuICogQHBhcmFtIHtTdHJpbmd9IFtkZWxpbWl0ZXJdXG4gKiBAcGFyYW0ge1N0cmluZ30gZGF0YUtleVxuICovXG5cbmV4cG9ydHMuZmlsdGVyQnkgPSBmdW5jdGlvbiAoYXJyLCBzZWFyY2hLZXksIGRlbGltaXRlciwgZGF0YUtleSkge1xuICAvLyBhbGxvdyBvcHRpb25hbCBgaW5gIGRlbGltaXRlclxuICAvLyBiZWNhdXNlIHdoeSBub3RcbiAgaWYgKGRlbGltaXRlciAmJiBkZWxpbWl0ZXIgIT09ICdpbicpIHtcbiAgICBkYXRhS2V5ID0gZGVsaW1pdGVyXG4gIH1cbiAgLy8gZ2V0IHRoZSBzZWFyY2ggc3RyaW5nXG4gIHZhciBzZWFyY2ggPVxuICAgIF8uc3RyaXBRdW90ZXMoc2VhcmNoS2V5KSB8fFxuICAgIHRoaXMuJGdldChzZWFyY2hLZXkpXG4gIGlmICghc2VhcmNoKSB7XG4gICAgcmV0dXJuIGFyclxuICB9XG4gIHNlYXJjaCA9ICgnJyArIHNlYXJjaCkudG9Mb3dlckNhc2UoKVxuICAvLyBnZXQgdGhlIG9wdGlvbmFsIGRhdGFLZXlcbiAgZGF0YUtleSA9XG4gICAgZGF0YUtleSAmJlxuICAgIChfLnN0cmlwUXVvdGVzKGRhdGFLZXkpIHx8IHRoaXMuJGdldChkYXRhS2V5KSlcbiAgcmV0dXJuIGFyci5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICByZXR1cm4gZGF0YUtleVxuICAgICAgPyBjb250YWlucyhQYXRoLmdldChpdGVtLCBkYXRhS2V5KSwgc2VhcmNoKVxuICAgICAgOiBjb250YWlucyhpdGVtLCBzZWFyY2gpXG4gIH0pXG59XG5cbi8qKlxuICogRmlsdGVyIGZpbHRlciBmb3Igdi1yZXBlYXRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc29ydEtleVxuICogQHBhcmFtIHtTdHJpbmd9IHJldmVyc2VLZXlcbiAqL1xuXG5leHBvcnRzLm9yZGVyQnkgPSBmdW5jdGlvbiAoYXJyLCBzb3J0S2V5LCByZXZlcnNlS2V5KSB7XG4gIHZhciBrZXkgPVxuICAgIF8uc3RyaXBRdW90ZXMoc29ydEtleSkgfHxcbiAgICB0aGlzLiRnZXQoc29ydEtleSlcbiAgaWYgKCFrZXkpIHtcbiAgICByZXR1cm4gYXJyXG4gIH1cbiAgdmFyIG9yZGVyID0gMVxuICBpZiAocmV2ZXJzZUtleSkge1xuICAgIGlmIChyZXZlcnNlS2V5ID09PSAnLTEnKSB7XG4gICAgICBvcmRlciA9IC0xXG4gICAgfSBlbHNlIGlmIChyZXZlcnNlS2V5LmNoYXJDb2RlQXQoMCkgPT09IDB4MjEpIHsgLy8gIVxuICAgICAgcmV2ZXJzZUtleSA9IHJldmVyc2VLZXkuc2xpY2UoMSlcbiAgICAgIG9yZGVyID0gdGhpcy4kZ2V0KHJldmVyc2VLZXkpID8gMSA6IC0xXG4gICAgfSBlbHNlIHtcbiAgICAgIG9yZGVyID0gdGhpcy4kZ2V0KHJldmVyc2VLZXkpID8gLTEgOiAxXG4gICAgfVxuICB9XG4gIC8vIHNvcnQgb24gYSBjb3B5IHRvIGF2b2lkIG11dGF0aW5nIG9yaWdpbmFsIGFycmF5XG4gIHJldHVybiBhcnIuc2xpY2UoKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgaWYgKGtleSAhPT0gJyRrZXknICYmIGtleSAhPT0gJyR2YWx1ZScpIHtcbiAgICAgIGlmIChhICYmICckdmFsdWUnIGluIGEpIGEgPSBhLiR2YWx1ZVxuICAgICAgaWYgKGIgJiYgJyR2YWx1ZScgaW4gYikgYiA9IGIuJHZhbHVlXG4gICAgfVxuICAgIGEgPSBfLmlzT2JqZWN0KGEpID8gUGF0aC5nZXQoYSwga2V5KSA6IGFcbiAgICBiID0gXy5pc09iamVjdChiKSA/IFBhdGguZ2V0KGIsIGtleSkgOiBiXG4gICAgcmV0dXJuIGEgPT09IGIgPyAwIDogYSA+IGIgPyBvcmRlciA6IC1vcmRlclxuICB9KVxufVxuXG4vKipcbiAqIFN0cmluZyBjb250YWluIGhlbHBlclxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoXG4gKi9cblxuZnVuY3Rpb24gY29udGFpbnMgKHZhbCwgc2VhcmNoKSB7XG4gIGlmIChfLmlzUGxhaW5PYmplY3QodmFsKSkge1xuICAgIGZvciAodmFyIGtleSBpbiB2YWwpIHtcbiAgICAgIGlmIChjb250YWlucyh2YWxba2V5XSwgc2VhcmNoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChfLmlzQXJyYXkodmFsKSkge1xuICAgIHZhciBpID0gdmFsLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGlmIChjb250YWlucyh2YWxbaV0sIHNlYXJjaCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodmFsICE9IG51bGwpIHtcbiAgICByZXR1cm4gdmFsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaCkgPiAtMVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxuLyoqXG4gKiBTdHJpbmdpZnkgdmFsdWUuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGVudFxuICovXG5cbmV4cG9ydHMuanNvbiA9IHtcbiAgcmVhZDogZnVuY3Rpb24gKHZhbHVlLCBpbmRlbnQpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJ1xuICAgICAgPyB2YWx1ZVxuICAgICAgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgTnVtYmVyKGluZGVudCkgfHwgMilcbiAgfSxcbiAgd3JpdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZSh2YWx1ZSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiAnYWJjJyA9PiAnQWJjJ1xuICovXG5cbmV4cG9ydHMuY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAoIXZhbHVlICYmIHZhbHVlICE9PSAwKSByZXR1cm4gJydcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpXG4gIHJldHVybiB2YWx1ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbHVlLnNsaWNlKDEpXG59XG5cbi8qKlxuICogJ2FiYycgPT4gJ0FCQydcbiAqL1xuXG5leHBvcnRzLnVwcGVyY2FzZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlIHx8IHZhbHVlID09PSAwKVxuICAgID8gdmFsdWUudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpXG4gICAgOiAnJ1xufVxuXG4vKipcbiAqICdBYkMnID0+ICdhYmMnXG4gKi9cblxuZXhwb3J0cy5sb3dlcmNhc2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMClcbiAgICA/IHZhbHVlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKVxuICAgIDogJydcbn1cblxuLyoqXG4gKiAxMjM0NSA9PiAkMTIsMzQ1LjAwXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNpZ25cbiAqL1xuXG52YXIgZGlnaXRzUkUgPSAvKFxcZHszfSkoPz1cXGQpL2dcblxuZXhwb3J0cy5jdXJyZW5jeSA9IGZ1bmN0aW9uICh2YWx1ZSwgc2lnbikge1xuICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpXG4gIGlmICghaXNGaW5pdGUodmFsdWUpIHx8ICghdmFsdWUgJiYgdmFsdWUgIT09IDApKSByZXR1cm4gJydcbiAgc2lnbiA9IHNpZ24gfHwgJyQnXG4gIHZhciBzID0gTWF0aC5mbG9vcihNYXRoLmFicyh2YWx1ZSkpLnRvU3RyaW5nKCksXG4gICAgaSA9IHMubGVuZ3RoICUgMyxcbiAgICBoID0gaSA+IDBcbiAgICAgID8gKHMuc2xpY2UoMCwgaSkgKyAocy5sZW5ndGggPiAzID8gJywnIDogJycpKVxuICAgICAgOiAnJyxcbiAgICB2ID0gTWF0aC5hYnMocGFyc2VJbnQoKHZhbHVlICogMTAwKSAlIDEwMCwgMTApKSxcbiAgICBmID0gJy4nICsgKHYgPCAxMCA/ICgnMCcgKyB2KSA6IHYpXG4gIHJldHVybiAodmFsdWUgPCAwID8gJy0nIDogJycpICtcbiAgICBzaWduICsgaCArIHMuc2xpY2UoaSkucmVwbGFjZShkaWdpdHNSRSwgJyQxLCcpICsgZlxufVxuXG4vKipcbiAqICdpdGVtJyA9PiAnaXRlbXMnXG4gKlxuICogQHBhcmFtc1xuICogIGFuIGFycmF5IG9mIHN0cmluZ3MgY29ycmVzcG9uZGluZyB0b1xuICogIHRoZSBzaW5nbGUsIGRvdWJsZSwgdHJpcGxlIC4uLiBmb3JtcyBvZiB0aGUgd29yZCB0b1xuICogIGJlIHBsdXJhbGl6ZWQuIFdoZW4gdGhlIG51bWJlciB0byBiZSBwbHVyYWxpemVkXG4gKiAgZXhjZWVkcyB0aGUgbGVuZ3RoIG9mIHRoZSBhcmdzLCBpdCB3aWxsIHVzZSB0aGUgbGFzdFxuICogIGVudHJ5IGluIHRoZSBhcnJheS5cbiAqXG4gKiAgZS5nLiBbJ3NpbmdsZScsICdkb3VibGUnLCAndHJpcGxlJywgJ211bHRpcGxlJ11cbiAqL1xuXG5leHBvcnRzLnBsdXJhbGl6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgYXJncyA9IF8udG9BcnJheShhcmd1bWVudHMsIDEpXG4gIHJldHVybiBhcmdzLmxlbmd0aCA+IDFcbiAgICA/IChhcmdzW3ZhbHVlICUgMTAgLSAxXSB8fCBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0pXG4gICAgOiAoYXJnc1swXSArICh2YWx1ZSA9PT0gMSA/ICcnIDogJ3MnKSlcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWwgZmlsdGVyIHRoYXQgdGFrZXMgYSBoYW5kbGVyIGZ1bmN0aW9uLFxuICogd3JhcHMgaXQgc28gaXQgb25seSBnZXRzIHRyaWdnZXJlZCBvbiBzcGVjaWZpY1xuICoga2V5cHJlc3Nlcy4gdi1vbiBvbmx5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG52YXIga2V5Q29kZXMgPSB7XG4gIGVudGVyICAgIDogMTMsXG4gIHRhYiAgICAgIDogOSxcbiAgJ2RlbGV0ZScgOiA0NixcbiAgdXAgICAgICAgOiAzOCxcbiAgbGVmdCAgICAgOiAzNyxcbiAgcmlnaHQgICAgOiAzOSxcbiAgZG93biAgICAgOiA0MCxcbiAgZXNjICAgICAgOiAyN1xufVxuXG5leHBvcnRzLmtleSA9IGZ1bmN0aW9uIChoYW5kbGVyLCBrZXkpIHtcbiAgaWYgKCFoYW5kbGVyKSByZXR1cm5cbiAgdmFyIGNvZGUgPSBrZXlDb2Rlc1trZXldXG4gIGlmICghY29kZSkge1xuICAgIGNvZGUgPSBwYXJzZUludChrZXksIDEwKVxuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT09IGNvZGUpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLmNhbGwodGhpcywgZSlcbiAgICB9XG4gIH1cbn1cblxuLy8gZXhwb3NlIGtleWNvZGUgaGFzaFxuZXhwb3J0cy5rZXkua2V5Q29kZXMgPSBrZXlDb2Rlc1xuXG4vKipcbiAqIEluc3RhbGwgc3BlY2lhbCBhcnJheSBmaWx0ZXJzXG4gKi9cblxuXy5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9hcnJheS1maWx0ZXJzJykpXG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIERpcmVjdGl2ZSA9IHJlcXVpcmUoJy4uL2RpcmVjdGl2ZScpXG52YXIgY29tcGlsZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL2NvbXBpbGUnKVxudmFyIHRyYW5zY2x1ZGUgPSByZXF1aXJlKCcuLi9jb21waWxlci90cmFuc2NsdWRlJylcblxuLyoqXG4gKiBUcmFuc2NsdWRlLCBjb21waWxlIGFuZCBsaW5rIGVsZW1lbnQuXG4gKlxuICogSWYgYSBwcmUtY29tcGlsZWQgbGlua2VyIGlzIGF2YWlsYWJsZSwgdGhhdCBtZWFucyB0aGVcbiAqIHBhc3NlZCBpbiBlbGVtZW50IHdpbGwgYmUgcHJlLXRyYW5zY2x1ZGVkIGFuZCBjb21waWxlZFxuICogYXMgd2VsbCAtIGFsbCB3ZSBuZWVkIHRvIGRvIGlzIHRvIGNhbGwgdGhlIGxpbmtlci5cbiAqXG4gKiBPdGhlcndpc2Ugd2UgbmVlZCB0byBjYWxsIHRyYW5zY2x1ZGUvY29tcGlsZS9saW5rIGhlcmUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5leHBvcnRzLl9jb21waWxlID0gZnVuY3Rpb24gKGVsKSB7XG4gIHZhciBvcHRpb25zID0gdGhpcy4kb3B0aW9uc1xuICBpZiAob3B0aW9ucy5fbGlua0ZuKSB7XG4gICAgLy8gcHJlLXRyYW5zY2x1ZGVkIHdpdGggbGlua2VyLCBqdXN0IHVzZSBpdFxuICAgIHRoaXMuX2luaXRFbGVtZW50KGVsKVxuICAgIHRoaXMuX3VubGlua0ZuID0gb3B0aW9ucy5fbGlua0ZuKHRoaXMsIGVsKVxuICB9IGVsc2Uge1xuICAgIC8vIHRyYW5zY2x1ZGUgYW5kIGluaXQgZWxlbWVudFxuICAgIC8vIHRyYW5zY2x1ZGUgY2FuIHBvdGVudGlhbGx5IHJlcGxhY2Ugb3JpZ2luYWxcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIGtlZXAgcmVmZXJlbmNlXG4gICAgdmFyIG9yaWdpbmFsID0gZWxcbiAgICBlbCA9IHRyYW5zY2x1ZGUoZWwsIG9wdGlvbnMpXG4gICAgdGhpcy5faW5pdEVsZW1lbnQoZWwpXG4gICAgLy8gY29tcGlsZSBhbmQgbGluayB0aGUgcmVzdFxuICAgIHRoaXMuX3VubGlua0ZuID0gY29tcGlsZShlbCwgb3B0aW9ucykodGhpcywgZWwpXG4gICAgLy8gZmluYWxseSByZXBsYWNlIG9yaWdpbmFsXG4gICAgaWYgKG9wdGlvbnMucmVwbGFjZSkge1xuICAgICAgXy5yZXBsYWNlKG9yaWdpbmFsLCBlbClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBpbnN0YW5jZSBlbGVtZW50LiBDYWxsZWQgaW4gdGhlIHB1YmxpY1xuICogJG1vdW50KCkgbWV0aG9kLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqL1xuXG5leHBvcnRzLl9pbml0RWxlbWVudCA9IGZ1bmN0aW9uIChlbCkge1xuICBpZiAoZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgdGhpcy5faXNCbG9jayA9IHRydWVcbiAgICB0aGlzLiRlbCA9IHRoaXMuX2Jsb2NrU3RhcnQgPSBlbC5maXJzdENoaWxkXG4gICAgdGhpcy5fYmxvY2tFbmQgPSBlbC5sYXN0Q2hpbGRcbiAgICB0aGlzLl9ibG9ja0ZyYWdtZW50ID0gZWxcbiAgfSBlbHNlIHtcbiAgICB0aGlzLiRlbCA9IGVsXG4gIH1cbiAgdGhpcy4kZWwuX192dWVfXyA9IHRoaXNcbiAgdGhpcy5fY2FsbEhvb2soJ2JlZm9yZUNvbXBpbGUnKVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbmQgYmluZCBhIGRpcmVjdGl2ZSB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gZGlyZWN0aXZlIG5hbWVcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAgIC0gdGFyZ2V0IG5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXNjIC0gcGFyc2VkIGRpcmVjdGl2ZSBkZXNjcmlwdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmICAtIGRpcmVjdGl2ZSBkZWZpbml0aW9uIG9iamVjdFxuICogQHBhcmFtIHtWdWV8dW5kZWZpbmVkfSBob3N0IC0gdHJhbnNjbHVzaW9uIGhvc3QgY29tcG9uZW50XG4gKi9cblxuZXhwb3J0cy5fYmluZERpciA9IGZ1bmN0aW9uIChuYW1lLCBub2RlLCBkZXNjLCBkZWYsIGhvc3QpIHtcbiAgdGhpcy5fZGlyZWN0aXZlcy5wdXNoKFxuICAgIG5ldyBEaXJlY3RpdmUobmFtZSwgbm9kZSwgdGhpcywgZGVzYywgZGVmLCBob3N0KVxuICApXG59XG5cbi8qKlxuICogVGVhcmRvd24gYW4gaW5zdGFuY2UsIHVub2JzZXJ2ZXMgdGhlIGRhdGEsIHVuYmluZCBhbGwgdGhlXG4gKiBkaXJlY3RpdmVzLCB0dXJuIG9mZiBhbGwgdGhlIGV2ZW50IGxpc3RlbmVycywgZXRjLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcmVtb3ZlIC0gd2hldGhlciB0byByZW1vdmUgdGhlIERPTSBub2RlLlxuICogQHBhcmFtIHtCb29sZWFufSBkZWZlckNsZWFudXAgLSBpZiB0cnVlLCBkZWZlciBjbGVhbnVwIHRvXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlIGNhbGxlZCBsYXRlclxuICovXG5cbmV4cG9ydHMuX2Rlc3Ryb3kgPSBmdW5jdGlvbiAocmVtb3ZlLCBkZWZlckNsZWFudXApIHtcbiAgaWYgKHRoaXMuX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLl9jYWxsSG9vaygnYmVmb3JlRGVzdHJveScpXG4gIHRoaXMuX2lzQmVpbmdEZXN0cm95ZWQgPSB0cnVlXG4gIHZhciBpXG4gIC8vIHJlbW92ZSBzZWxmIGZyb20gcGFyZW50LiBvbmx5IG5lY2Vzc2FyeVxuICAvLyBpZiBwYXJlbnQgaXMgbm90IGJlaW5nIGRlc3Ryb3llZCBhcyB3ZWxsLlxuICB2YXIgcGFyZW50ID0gdGhpcy4kcGFyZW50XG4gIGlmIChwYXJlbnQgJiYgIXBhcmVudC5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgIHBhcmVudC5fY2hpbGRyZW4uJHJlbW92ZSh0aGlzKVxuICB9XG4gIC8vIHNhbWUgZm9yIHRyYW5zY2x1c2lvbiBob3N0LlxuICB2YXIgaG9zdCA9IHRoaXMuX2hvc3RcbiAgaWYgKGhvc3QgJiYgIWhvc3QuX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICBob3N0Ll90cmFuc0NwbnRzLiRyZW1vdmUodGhpcylcbiAgfVxuICAvLyBkZXN0cm95IGFsbCBjaGlsZHJlbi5cbiAgaSA9IHRoaXMuX2NoaWxkcmVuLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdGhpcy5fY2hpbGRyZW5baV0uJGRlc3Ryb3koKVxuICB9XG4gIC8vIHRlYXJkb3duIGFsbCBkaXJlY3RpdmVzLiB0aGlzIGFsc28gdGVhcnNkb3duIGFsbFxuICAvLyBkaXJlY3RpdmUtb3duZWQgd2F0Y2hlcnMuXG4gIGlmICh0aGlzLl91bmxpbmtGbikge1xuICAgIC8vIHBhc3NpbmcgZGVzdHJveWluZzogdHJ1ZSB0byBhdm9pZCBzZWFyY2hpbmcgYW5kXG4gICAgLy8gc3BsaWNpbmcgdGhlIGRpcmVjdGl2ZXNcbiAgICB0aGlzLl91bmxpbmtGbih0cnVlKVxuICB9XG4gIC8vIHRlYXJkb3duIGFsbCB1c2VyIHdhdGNoZXJzLlxuICB2YXIgd2F0Y2hlclxuICBmb3IgKGkgaW4gdGhpcy5fdXNlcldhdGNoZXJzKSB7XG4gICAgd2F0Y2hlciA9IHRoaXMuX3VzZXJXYXRjaGVyc1tpXVxuICAgIGlmICh3YXRjaGVyKSB7XG4gICAgICB3YXRjaGVyLnRlYXJkb3duKClcbiAgICB9XG4gIH1cbiAgLy8gcmVtb3ZlIHJlZmVyZW5jZSB0byBzZWxmIG9uICRlbFxuICBpZiAodGhpcy4kZWwpIHtcbiAgICB0aGlzLiRlbC5fX3Z1ZV9fID0gbnVsbFxuICB9XG4gIC8vIHJlbW92ZSBET00gZWxlbWVudFxuICB2YXIgc2VsZiA9IHRoaXNcbiAgaWYgKHJlbW92ZSAmJiB0aGlzLiRlbCkge1xuICAgIHRoaXMuJHJlbW92ZShmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9jbGVhbnVwKClcbiAgICB9KVxuICB9IGVsc2UgaWYgKCFkZWZlckNsZWFudXApIHtcbiAgICB0aGlzLl9jbGVhbnVwKClcbiAgfVxufVxuXG4vKipcbiAqIENsZWFuIHVwIHRvIGVuc3VyZSBnYXJiYWdlIGNvbGxlY3Rpb24uXG4gKiBUaGlzIGlzIGNhbGxlZCBhZnRlciB0aGUgbGVhdmUgdHJhbnNpdGlvbiBpZiB0aGVyZVxuICogaXMgYW55LlxuICovXG5cbmV4cG9ydHMuX2NsZWFudXAgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIHJlbW92ZSByZWZlcmVuY2UgZnJvbSBkYXRhIG9iXG4gIHRoaXMuX2RhdGEuX19vYl9fLnJlbW92ZVZtKHRoaXMpXG4gIHRoaXMuX2RhdGEgPVxuICB0aGlzLl93YXRjaGVycyA9XG4gIHRoaXMuX3VzZXJXYXRjaGVycyA9XG4gIHRoaXMuX3dhdGNoZXJMaXN0ID1cbiAgdGhpcy4kZWwgPVxuICB0aGlzLiRwYXJlbnQgPVxuICB0aGlzLiRyb290ID1cbiAgdGhpcy5fY2hpbGRyZW4gPVxuICB0aGlzLl90cmFuc0NwbnRzID1cbiAgdGhpcy5fZGlyZWN0aXZlcyA9IG51bGxcbiAgLy8gY2FsbCB0aGUgbGFzdCBob29rLi4uXG4gIHRoaXMuX2lzRGVzdHJveWVkID0gdHJ1ZVxuICB0aGlzLl9jYWxsSG9vaygnZGVzdHJveWVkJylcbiAgLy8gdHVybiBvZmYgYWxsIGluc3RhbmNlIGxpc3RlbmVycy5cbiAgdGhpcy4kb2ZmKClcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGluRG9jID0gXy5pbkRvY1xuXG4vKipcbiAqIFNldHVwIHRoZSBpbnN0YW5jZSdzIG9wdGlvbiBldmVudHMgJiB3YXRjaGVycy5cbiAqIElmIHRoZSB2YWx1ZSBpcyBhIHN0cmluZywgd2UgcHVsbCBpdCBmcm9tIHRoZVxuICogaW5zdGFuY2UncyBtZXRob2RzIGJ5IG5hbWUuXG4gKi9cblxuZXhwb3J0cy5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLiRvcHRpb25zXG4gIHJlZ2lzdGVyQ2FsbGJhY2tzKHRoaXMsICckb24nLCBvcHRpb25zLmV2ZW50cylcbiAgcmVnaXN0ZXJDYWxsYmFja3ModGhpcywgJyR3YXRjaCcsIG9wdGlvbnMud2F0Y2gpXG59XG5cbi8qKlxuICogUmVnaXN0ZXIgY2FsbGJhY2tzIGZvciBvcHRpb24gZXZlbnRzIGFuZCB3YXRjaGVycy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoXG4gKi9cblxuZnVuY3Rpb24gcmVnaXN0ZXJDYWxsYmFja3MgKHZtLCBhY3Rpb24sIGhhc2gpIHtcbiAgaWYgKCFoYXNoKSByZXR1cm5cbiAgdmFyIGhhbmRsZXJzLCBrZXksIGksIGpcbiAgZm9yIChrZXkgaW4gaGFzaCkge1xuICAgIGhhbmRsZXJzID0gaGFzaFtrZXldXG4gICAgaWYgKF8uaXNBcnJheShoYW5kbGVycykpIHtcbiAgICAgIGZvciAoaSA9IDAsIGogPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgcmVnaXN0ZXIodm0sIGFjdGlvbiwga2V5LCBoYW5kbGVyc1tpXSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVnaXN0ZXIodm0sIGFjdGlvbiwga2V5LCBoYW5kbGVycylcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBIZWxwZXIgdG8gcmVnaXN0ZXIgYW4gZXZlbnQvd2F0Y2ggY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IGhhbmRsZXJcbiAqL1xuXG5mdW5jdGlvbiByZWdpc3RlciAodm0sIGFjdGlvbiwga2V5LCBoYW5kbGVyKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIGhhbmRsZXJcbiAgaWYgKHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2bVthY3Rpb25dKGtleSwgaGFuZGxlcilcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHZhciBtZXRob2RzID0gdm0uJG9wdGlvbnMubWV0aG9kc1xuICAgIHZhciBtZXRob2QgPSBtZXRob2RzICYmIG1ldGhvZHNbaGFuZGxlcl1cbiAgICBpZiAobWV0aG9kKSB7XG4gICAgICB2bVthY3Rpb25dKGtleSwgbWV0aG9kKVxuICAgIH0gZWxzZSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdVbmtub3duIG1ldGhvZDogXCInICsgaGFuZGxlciArICdcIiB3aGVuICcgK1xuICAgICAgICAncmVnaXN0ZXJpbmcgY2FsbGJhY2sgZm9yICcgKyBhY3Rpb24gK1xuICAgICAgICAnOiBcIicgKyBrZXkgKyAnXCIuJ1xuICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNldHVwIHJlY3Vyc2l2ZSBhdHRhY2hlZC9kZXRhY2hlZCBjYWxsc1xuICovXG5cbmV4cG9ydHMuX2luaXRET01Ib29rcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy4kb24oJ2hvb2s6YXR0YWNoZWQnLCBvbkF0dGFjaGVkKVxuICB0aGlzLiRvbignaG9vazpkZXRhY2hlZCcsIG9uRGV0YWNoZWQpXG59XG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gcmVjdXJzaXZlbHkgY2FsbCBhdHRhY2hlZCBob29rIG9uIGNoaWxkcmVuXG4gKi9cblxuZnVuY3Rpb24gb25BdHRhY2hlZCAoKSB7XG4gIHRoaXMuX2lzQXR0YWNoZWQgPSB0cnVlXG4gIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goY2FsbEF0dGFjaClcbiAgaWYgKHRoaXMuX3RyYW5zQ3BudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fdHJhbnNDcG50cy5mb3JFYWNoKGNhbGxBdHRhY2gpXG4gIH1cbn1cblxuLyoqXG4gKiBJdGVyYXRvciB0byBjYWxsIGF0dGFjaGVkIGhvb2tcbiAqIFxuICogQHBhcmFtIHtWdWV9IGNoaWxkXG4gKi9cblxuZnVuY3Rpb24gY2FsbEF0dGFjaCAoY2hpbGQpIHtcbiAgaWYgKCFjaGlsZC5faXNBdHRhY2hlZCAmJiBpbkRvYyhjaGlsZC4kZWwpKSB7XG4gICAgY2hpbGQuX2NhbGxIb29rKCdhdHRhY2hlZCcpXG4gIH1cbn1cblxuLyoqXG4gKiBDYWxsYmFjayB0byByZWN1cnNpdmVseSBjYWxsIGRldGFjaGVkIGhvb2sgb24gY2hpbGRyZW5cbiAqL1xuXG5mdW5jdGlvbiBvbkRldGFjaGVkICgpIHtcbiAgdGhpcy5faXNBdHRhY2hlZCA9IGZhbHNlXG4gIHRoaXMuX2NoaWxkcmVuLmZvckVhY2goY2FsbERldGFjaClcbiAgaWYgKHRoaXMuX3RyYW5zQ3BudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fdHJhbnNDcG50cy5mb3JFYWNoKGNhbGxEZXRhY2gpXG4gIH1cbn1cblxuLyoqXG4gKiBJdGVyYXRvciB0byBjYWxsIGRldGFjaGVkIGhvb2tcbiAqIFxuICogQHBhcmFtIHtWdWV9IGNoaWxkXG4gKi9cblxuZnVuY3Rpb24gY2FsbERldGFjaCAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLl9pc0F0dGFjaGVkICYmICFpbkRvYyhjaGlsZC4kZWwpKSB7XG4gICAgY2hpbGQuX2NhbGxIb29rKCdkZXRhY2hlZCcpXG4gIH1cbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGFsbCBoYW5kbGVycyBmb3IgYSBob29rXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhvb2tcbiAqL1xuXG5leHBvcnRzLl9jYWxsSG9vayA9IGZ1bmN0aW9uIChob29rKSB7XG4gIHZhciBoYW5kbGVycyA9IHRoaXMuJG9wdGlvbnNbaG9va11cbiAgaWYgKGhhbmRsZXJzKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBoYW5kbGVycy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIGhhbmRsZXJzW2ldLmNhbGwodGhpcylcbiAgICB9XG4gIH1cbiAgdGhpcy4kZW1pdCgnaG9vazonICsgaG9vaylcbn0iLCJ2YXIgbWVyZ2VPcHRpb25zID0gcmVxdWlyZSgnLi4vdXRpbC9tZXJnZS1vcHRpb24nKVxuXG4vKipcbiAqIFRoZSBtYWluIGluaXQgc2VxdWVuY2UuIFRoaXMgaXMgY2FsbGVkIGZvciBldmVyeVxuICogaW5zdGFuY2UsIGluY2x1ZGluZyBvbmVzIHRoYXQgYXJlIGNyZWF0ZWQgZnJvbSBleHRlbmRlZFxuICogY29uc3RydWN0b3JzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gdGhpcyBvcHRpb25zIG9iamVjdCBzaG91bGQgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHJlc3VsdCBvZiBtZXJnaW5nIGNsYXNzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgYW5kIHRoZSBvcHRpb25zIHBhc3NlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICBpbiB0byB0aGUgY29uc3RydWN0b3IuXG4gKi9cblxuZXhwb3J0cy5faW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICB0aGlzLiRlbCAgICAgICAgICAgPSBudWxsXG4gIHRoaXMuJHBhcmVudCAgICAgICA9IG9wdGlvbnMuX3BhcmVudFxuICB0aGlzLiRyb290ICAgICAgICAgPSBvcHRpb25zLl9yb290IHx8IHRoaXNcbiAgdGhpcy4kICAgICAgICAgICAgID0ge30gLy8gY2hpbGQgdm0gcmVmZXJlbmNlc1xuICB0aGlzLiQkICAgICAgICAgICAgPSB7fSAvLyBlbGVtZW50IHJlZmVyZW5jZXNcbiAgdGhpcy5fd2F0Y2hlckxpc3QgID0gW10gLy8gYWxsIHdhdGNoZXJzIGFzIGFuIGFycmF5XG4gIHRoaXMuX3dhdGNoZXJzICAgICA9IHt9IC8vIGludGVybmFsIHdhdGNoZXJzIGFzIGEgaGFzaFxuICB0aGlzLl91c2VyV2F0Y2hlcnMgPSB7fSAvLyB1c2VyIHdhdGNoZXJzIGFzIGEgaGFzaFxuICB0aGlzLl9kaXJlY3RpdmVzICAgPSBbXSAvLyBhbGwgZGlyZWN0aXZlc1xuXG4gIC8vIGEgZmxhZyB0byBhdm9pZCB0aGlzIGJlaW5nIG9ic2VydmVkXG4gIHRoaXMuX2lzVnVlID0gdHJ1ZVxuXG4gIC8vIGV2ZW50cyBib29ra2VlcGluZ1xuICB0aGlzLl9ldmVudHMgICAgICAgICA9IHt9ICAgIC8vIHJlZ2lzdGVyZWQgY2FsbGJhY2tzXG4gIHRoaXMuX2V2ZW50c0NvdW50ICAgID0ge30gICAgLy8gZm9yICRicm9hZGNhc3Qgb3B0aW1pemF0aW9uXG4gIHRoaXMuX2V2ZW50Q2FuY2VsbGVkID0gZmFsc2UgLy8gZm9yIGV2ZW50IGNhbmNlbGxhdGlvblxuXG4gIC8vIGJsb2NrIGluc3RhbmNlIHByb3BlcnRpZXNcbiAgdGhpcy5faXNCbG9jayAgICAgPSBmYWxzZVxuICB0aGlzLl9ibG9ja1N0YXJ0ICA9ICAgICAgICAgIC8vIEB0eXBlIHtDb21tZW50Tm9kZX1cbiAgdGhpcy5fYmxvY2tFbmQgICAgPSBudWxsICAgICAvLyBAdHlwZSB7Q29tbWVudE5vZGV9XG5cbiAgLy8gbGlmZWN5Y2xlIHN0YXRlXG4gIHRoaXMuX2lzQ29tcGlsZWQgID1cbiAgdGhpcy5faXNEZXN0cm95ZWQgPVxuICB0aGlzLl9pc1JlYWR5ICAgICA9XG4gIHRoaXMuX2lzQXR0YWNoZWQgID1cbiAgdGhpcy5faXNCZWluZ0Rlc3Ryb3llZCA9IGZhbHNlXG4gIHRoaXMuX3VubGlua0ZuICAgID0gbnVsbFxuXG4gIC8vIGNoaWxkcmVuXG4gIHRoaXMuX2NoaWxkcmVuID0gW11cbiAgdGhpcy5fY2hpbGRDdG9ycyA9IHt9XG5cbiAgLy8gdHJhbnNjbHVkZWQgY29tcG9uZW50cyB0aGF0IGJlbG9uZyB0byB0aGUgcGFyZW50LlxuICAvLyBuZWVkIHRvIGtlZXAgdHJhY2sgb2YgdGhlbSBzbyB0aGF0IHdlIGNhbiBjYWxsXG4gIC8vIGF0dGFjaGVkL2RldGFjaGVkIGhvb2tzIG9uIHRoZW0uXG4gIHRoaXMuX3RyYW5zQ3BudHMgPSBbXVxuICB0aGlzLl9ob3N0ID0gb3B0aW9ucy5faG9zdFxuXG4gIC8vIHB1c2ggc2VsZiBpbnRvIHBhcmVudCAvIHRyYW5zY2x1c2lvbiBob3N0XG4gIGlmICh0aGlzLiRwYXJlbnQpIHtcbiAgICB0aGlzLiRwYXJlbnQuX2NoaWxkcmVuLnB1c2godGhpcylcbiAgfVxuICBpZiAodGhpcy5faG9zdCkge1xuICAgIHRoaXMuX2hvc3QuX3RyYW5zQ3BudHMucHVzaCh0aGlzKVxuICB9XG5cbiAgLy8gcHJvcHMgdXNlZCBpbiB2LXJlcGVhdCBkaWZmaW5nXG4gIHRoaXMuX25ldyA9IHRydWVcbiAgdGhpcy5fcmV1c2VkID0gZmFsc2VcblxuICAvLyBtZXJnZSBvcHRpb25zLlxuICBvcHRpb25zID0gdGhpcy4kb3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm9wdGlvbnMsXG4gICAgb3B0aW9ucyxcbiAgICB0aGlzXG4gIClcblxuICAvLyBzZXQgZGF0YSBhZnRlciBtZXJnZS5cbiAgdGhpcy5fZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCB7fVxuXG4gIC8vIGluaXRpYWxpemUgZGF0YSBvYnNlcnZhdGlvbiBhbmQgc2NvcGUgaW5oZXJpdGFuY2UuXG4gIHRoaXMuX2luaXRTY29wZSgpXG5cbiAgLy8gc2V0dXAgZXZlbnQgc3lzdGVtIGFuZCBvcHRpb24gZXZlbnRzLlxuICB0aGlzLl9pbml0RXZlbnRzKClcblxuICAvLyBjYWxsIGNyZWF0ZWQgaG9va1xuICB0aGlzLl9jYWxsSG9vaygnY3JlYXRlZCcpXG5cbiAgLy8gaWYgYGVsYCBvcHRpb24gaXMgcGFzc2VkLCBzdGFydCBjb21waWxhdGlvbi5cbiAgaWYgKG9wdGlvbnMuZWwpIHtcbiAgICB0aGlzLiRtb3VudChvcHRpb25zLmVsKVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcblxuLyoqXG4gKiBBcHBseSBhIGZpbHRlciB0byBhIGxpc3Qgb2YgYXJndW1lbnRzLlxuICogVGhpcyBpcyBvbmx5IHVzZWQgaW50ZXJuYWxseSBpbnNpZGUgZXhwcmVzc2lvbnMgd2l0aFxuICogaW5saW5lZCBmaWx0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZFxuICogQHBhcmFtIHtBcnJheX0gYXJnc1xuICogQHJldHVybiB7Kn1cbiAqL1xuXG5leHBvcnRzLl9hcHBseUZpbHRlciA9IGZ1bmN0aW9uIChpZCwgYXJncykge1xuICB2YXIgcmVnaXN0cnkgPSB0aGlzLiRvcHRpb25zLmZpbHRlcnNcbiAgdmFyIGZpbHRlciA9IHJlZ2lzdHJ5W2lkXVxuICBfLmFzc2VydEFzc2V0KGZpbHRlciwgJ2ZpbHRlcicsIGlkKVxuICByZXR1cm4gKGZpbHRlci5yZWFkIHx8IGZpbHRlcikuYXBwbHkodGhpcywgYXJncylcbn1cblxuLyoqXG4gKiBSZXNvbHZlIGEgY29tcG9uZW50LCBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgY29tcG9uZW50XG4gKiBpcyBkZWZpbmVkIG5vcm1hbGx5IG9yIHVzaW5nIGFuIGFzeW5jIGZhY3RvcnkgZnVuY3Rpb24uXG4gKiBSZXNvbHZlcyBzeW5jaHJvbm91c2x5IGlmIGFscmVhZHkgcmVzb2x2ZWQsIG90aGVyd2lzZVxuICogcmVzb2x2ZXMgYXN5bmNocm9ub3VzbHkgYW5kIGNhY2hlcyB0aGUgcmVzb2x2ZWRcbiAqIGNvbnN0cnVjdG9yIG9uIHRoZSBmYWN0b3J5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5leHBvcnRzLl9yZXNvbHZlQ29tcG9uZW50ID0gZnVuY3Rpb24gKGlkLCBjYikge1xuICB2YXIgcmVnaXN0cnkgPSB0aGlzLiRvcHRpb25zLmNvbXBvbmVudHNcbiAgdmFyIGZhY3RvcnkgPSByZWdpc3RyeVtpZF1cbiAgXy5hc3NlcnRBc3NldChmYWN0b3J5LCAnY29tcG9uZW50JywgaWQpXG4gIC8vIGFzeW5jIGNvbXBvbmVudCBmYWN0b3J5XG4gIGlmICghZmFjdG9yeS5vcHRpb25zKSB7XG4gICAgaWYgKGZhY3RvcnkucmVzb2x2ZWQpIHtcbiAgICAgIC8vIGNhY2hlZFxuICAgICAgY2IoZmFjdG9yeS5yZXNvbHZlZClcbiAgICB9IGVsc2UgaWYgKGZhY3RvcnkucmVxdWVzdGVkKSB7XG4gICAgICBmYWN0b3J5LnBlbmRpbmdDYWxsYmFja3MucHVzaChjYilcbiAgICB9IGVsc2Uge1xuICAgICAgZmFjdG9yeS5yZXF1ZXN0ZWQgPSB0cnVlXG4gICAgICB2YXIgY2JzID0gZmFjdG9yeS5wZW5kaW5nQ2FsbGJhY2tzID0gW2NiXVxuICAgICAgZmFjdG9yeShmdW5jdGlvbiByZXNvbHZlIChyZXMpIHtcbiAgICAgICAgaWYgKF8uaXNQbGFpbk9iamVjdChyZXMpKSB7XG4gICAgICAgICAgcmVzID0gXy5WdWUuZXh0ZW5kKHJlcylcbiAgICAgICAgfVxuICAgICAgICAvLyBjYWNoZSByZXNvbHZlZFxuICAgICAgICBmYWN0b3J5LnJlc29sdmVkID0gcmVzXG4gICAgICAgIC8vIGludm9rZSBjYWxsYmFja3NcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgY2JzW2ldKHJlcylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gbm9ybWFsIGNvbXBvbmVudFxuICAgIGNiKGZhY3RvcnkpXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIE9ic2VydmVyID0gcmVxdWlyZSgnLi4vb2JzZXJ2ZXInKVxudmFyIERlcCA9IHJlcXVpcmUoJy4uL29ic2VydmVyL2RlcCcpXG5cbi8qKlxuICogU2V0dXAgdGhlIHNjb3BlIG9mIGFuIGluc3RhbmNlLCB3aGljaCBjb250YWluczpcbiAqIC0gb2JzZXJ2ZWQgZGF0YVxuICogLSBjb21wdXRlZCBwcm9wZXJ0aWVzXG4gKiAtIHVzZXIgbWV0aG9kc1xuICogLSBtZXRhIHByb3BlcnRpZXNcbiAqL1xuXG5leHBvcnRzLl9pbml0U2NvcGUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuX2luaXREYXRhKClcbiAgdGhpcy5faW5pdENvbXB1dGVkKClcbiAgdGhpcy5faW5pdE1ldGhvZHMoKVxuICB0aGlzLl9pbml0TWV0YSgpXG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSB0aGUgZGF0YS4gXG4gKi9cblxuZXhwb3J0cy5faW5pdERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIHByb3h5IGRhdGEgb24gaW5zdGFuY2VcbiAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhXG4gIHZhciBpLCBrZXlcbiAgLy8gbWFrZSBzdXJlIGFsbCBwcm9wcyBwcm9wZXJ0aWVzIGFyZSBvYnNlcnZlZFxuICB2YXIgcHJvcHMgPSB0aGlzLiRvcHRpb25zLnByb3BzXG4gIGlmIChwcm9wcykge1xuICAgIGkgPSBwcm9wcy5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBrZXkgPSBfLmNhbWVsaXplKHByb3BzW2ldKVxuICAgICAgaWYgKCEoa2V5IGluIGRhdGEpKSB7XG4gICAgICAgIGRhdGFba2V5XSA9IG51bGxcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKVxuICBpID0ga2V5cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBpZiAoIV8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICB0aGlzLl9wcm94eShrZXkpXG4gICAgfVxuICB9XG4gIC8vIG9ic2VydmUgZGF0YVxuICBPYnNlcnZlci5jcmVhdGUoZGF0YSkuYWRkVm0odGhpcylcbn1cblxuLyoqXG4gKiBTd2FwIHRoZSBpc250YW5jZSdzICRkYXRhLiBDYWxsZWQgaW4gJGRhdGEncyBzZXR0ZXIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG5ld0RhdGFcbiAqL1xuXG5leHBvcnRzLl9zZXREYXRhID0gZnVuY3Rpb24gKG5ld0RhdGEpIHtcbiAgbmV3RGF0YSA9IG5ld0RhdGEgfHwge31cbiAgdmFyIG9sZERhdGEgPSB0aGlzLl9kYXRhXG4gIHRoaXMuX2RhdGEgPSBuZXdEYXRhXG4gIHZhciBrZXlzLCBrZXksIGlcbiAgLy8gdW5wcm94eSBrZXlzIG5vdCBwcmVzZW50IGluIG5ldyBkYXRhXG4gIGtleXMgPSBPYmplY3Qua2V5cyhvbGREYXRhKVxuICBpID0ga2V5cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBpZiAoIV8uaXNSZXNlcnZlZChrZXkpICYmICEoa2V5IGluIG5ld0RhdGEpKSB7XG4gICAgICB0aGlzLl91bnByb3h5KGtleSlcbiAgICB9XG4gIH1cbiAgLy8gcHJveHkga2V5cyBub3QgYWxyZWFkeSBwcm94aWVkLFxuICAvLyBhbmQgdHJpZ2dlciBjaGFuZ2UgZm9yIGNoYW5nZWQgdmFsdWVzXG4gIGtleXMgPSBPYmplY3Qua2V5cyhuZXdEYXRhKVxuICBpID0ga2V5cy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAhXy5pc1Jlc2VydmVkKGtleSkpIHtcbiAgICAgIC8vIG5ldyBwcm9wZXJ0eVxuICAgICAgdGhpcy5fcHJveHkoa2V5KVxuICAgIH1cbiAgfVxuICBvbGREYXRhLl9fb2JfXy5yZW1vdmVWbSh0aGlzKVxuICBPYnNlcnZlci5jcmVhdGUobmV3RGF0YSkuYWRkVm0odGhpcylcbiAgdGhpcy5fZGlnZXN0KClcbn1cblxuLyoqXG4gKiBQcm94eSBhIHByb3BlcnR5LCBzbyB0aGF0XG4gKiB2bS5wcm9wID09PSB2bS5fZGF0YS5wcm9wXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICovXG5cbmV4cG9ydHMuX3Byb3h5ID0gZnVuY3Rpb24gKGtleSkge1xuICAvLyBuZWVkIHRvIHN0b3JlIHJlZiB0byBzZWxmIGhlcmVcbiAgLy8gYmVjYXVzZSB0aGVzZSBnZXR0ZXIvc2V0dGVycyBtaWdodFxuICAvLyBiZSBjYWxsZWQgYnkgY2hpbGQgaW5zdGFuY2VzIVxuICB2YXIgc2VsZiA9IHRoaXNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNlbGYsIGtleSwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gcHJveHlHZXR0ZXIgKCkge1xuICAgICAgcmV0dXJuIHNlbGYuX2RhdGFba2V5XVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBwcm94eVNldHRlciAodmFsKSB7XG4gICAgICBzZWxmLl9kYXRhW2tleV0gPSB2YWxcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogVW5wcm94eSBhIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG5leHBvcnRzLl91bnByb3h5ID0gZnVuY3Rpb24gKGtleSkge1xuICBkZWxldGUgdGhpc1trZXldXG59XG5cbi8qKlxuICogRm9yY2UgdXBkYXRlIG9uIGV2ZXJ5IHdhdGNoZXIgaW4gc2NvcGUuXG4gKi9cblxuZXhwb3J0cy5fZGlnZXN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaSA9IHRoaXMuX3dhdGNoZXJMaXN0Lmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdGhpcy5fd2F0Y2hlckxpc3RbaV0udXBkYXRlKClcbiAgfVxuICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlblxuICBpID0gY2hpbGRyZW4ubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGlmIChjaGlsZC4kb3B0aW9ucy5pbmhlcml0KSB7XG4gICAgICBjaGlsZC5fZGlnZXN0KClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXR1cCBjb21wdXRlZCBwcm9wZXJ0aWVzLiBUaGV5IGFyZSBlc3NlbnRpYWxseVxuICogc3BlY2lhbCBnZXR0ZXIvc2V0dGVyc1xuICovXG5cbmZ1bmN0aW9uIG5vb3AgKCkge31cbmV4cG9ydHMuX2luaXRDb21wdXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNvbXB1dGVkID0gdGhpcy4kb3B0aW9ucy5jb21wdXRlZFxuICBpZiAoY29tcHV0ZWQpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gY29tcHV0ZWQpIHtcbiAgICAgIHZhciB1c2VyRGVmID0gY29tcHV0ZWRba2V5XVxuICAgICAgdmFyIGRlZiA9IHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHVzZXJEZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGVmLmdldCA9IF8uYmluZCh1c2VyRGVmLCB0aGlzKVxuICAgICAgICBkZWYuc2V0ID0gbm9vcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVmLmdldCA9IHVzZXJEZWYuZ2V0XG4gICAgICAgICAgPyBfLmJpbmQodXNlckRlZi5nZXQsIHRoaXMpXG4gICAgICAgICAgOiBub29wXG4gICAgICAgIGRlZi5zZXQgPSB1c2VyRGVmLnNldFxuICAgICAgICAgID8gXy5iaW5kKHVzZXJEZWYuc2V0LCB0aGlzKVxuICAgICAgICAgIDogbm9vcFxuICAgICAgfVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwgZGVmKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNldHVwIGluc3RhbmNlIG1ldGhvZHMuIE1ldGhvZHMgbXVzdCBiZSBib3VuZCB0byB0aGVcbiAqIGluc3RhbmNlIHNpbmNlIHRoZXkgbWlnaHQgYmUgY2FsbGVkIGJ5IGNoaWxkcmVuXG4gKiBpbmhlcml0aW5nIHRoZW0uXG4gKi9cblxuZXhwb3J0cy5faW5pdE1ldGhvZHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtZXRob2RzID0gdGhpcy4kb3B0aW9ucy5tZXRob2RzXG4gIGlmIChtZXRob2RzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIHRoaXNba2V5XSA9IF8uYmluZChtZXRob2RzW2tleV0sIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBtZXRhIGluZm9ybWF0aW9uIGxpa2UgJGluZGV4LCAka2V5ICYgJHZhbHVlLlxuICovXG5cbmV4cG9ydHMuX2luaXRNZXRhID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbWV0YXMgPSB0aGlzLiRvcHRpb25zLl9tZXRhXG4gIGlmIChtZXRhcykge1xuICAgIGZvciAodmFyIGtleSBpbiBtZXRhcykge1xuICAgICAgdGhpcy5fZGVmaW5lTWV0YShrZXksIG1ldGFzW2tleV0pXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGVmaW5lIGEgbWV0YSBwcm9wZXJ0eSwgZS5nICRpbmRleCwgJGtleSwgJHZhbHVlXG4gKiB3aGljaCBvbmx5IGV4aXN0cyBvbiB0aGUgdm0gaW5zdGFuY2UgYnV0IG5vdCBpbiAkZGF0YS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cblxuZXhwb3J0cy5fZGVmaW5lTWV0YSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciBkZXAgPSBuZXcgRGVwKClcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gbWV0YUdldHRlciAoKSB7XG4gICAgICBpZiAoT2JzZXJ2ZXIudGFyZ2V0KSB7XG4gICAgICAgIE9ic2VydmVyLnRhcmdldC5hZGREZXAoZGVwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIG1ldGFTZXR0ZXIgKHZhbCkge1xuICAgICAgaWYgKHZhbCAhPT0gdmFsdWUpIHtcbiAgICAgICAgdmFsdWUgPSB2YWxcbiAgICAgICAgZGVwLm5vdGlmeSgpXG4gICAgICB9XG4gICAgfVxuICB9KVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZVxudmFyIGFycmF5TWV0aG9kcyA9IE9iamVjdC5jcmVhdGUoYXJyYXlQcm90bylcblxuLyoqXG4gKiBJbnRlcmNlcHQgbXV0YXRpbmcgbWV0aG9kcyBhbmQgZW1pdCBldmVudHNcbiAqL1xuXG47W1xuICAncHVzaCcsXG4gICdwb3AnLFxuICAnc2hpZnQnLFxuICAndW5zaGlmdCcsXG4gICdzcGxpY2UnLFxuICAnc29ydCcsXG4gICdyZXZlcnNlJ1xuXVxuLmZvckVhY2goZnVuY3Rpb24gKG1ldGhvZCkge1xuICAvLyBjYWNoZSBvcmlnaW5hbCBtZXRob2RcbiAgdmFyIG9yaWdpbmFsID0gYXJyYXlQcm90b1ttZXRob2RdXG4gIF8uZGVmaW5lKGFycmF5TWV0aG9kcywgbWV0aG9kLCBmdW5jdGlvbiBtdXRhdG9yICgpIHtcbiAgICAvLyBhdm9pZCBsZWFraW5nIGFyZ3VtZW50czpcbiAgICAvLyBodHRwOi8vanNwZXJmLmNvbS9jbG9zdXJlLXdpdGgtYXJndW1lbnRzXG4gICAgdmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoaSlcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKVxuICAgIHZhciBvYiA9IHRoaXMuX19vYl9fXG4gICAgdmFyIGluc2VydGVkXG4gICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgIGNhc2UgJ3B1c2gnOlxuICAgICAgICBpbnNlcnRlZCA9IGFyZ3NcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3Vuc2hpZnQnOlxuICAgICAgICBpbnNlcnRlZCA9IGFyZ3NcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3NwbGljZSc6XG4gICAgICAgIGluc2VydGVkID0gYXJncy5zbGljZSgyKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICBpZiAoaW5zZXJ0ZWQpIG9iLm9ic2VydmVBcnJheShpbnNlcnRlZClcbiAgICAvLyBub3RpZnkgY2hhbmdlXG4gICAgb2Iubm90aWZ5KClcbiAgICByZXR1cm4gcmVzdWx0XG4gIH0pXG59KVxuXG4vKipcbiAqIFN3YXAgdGhlIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4IHdpdGggYSBuZXcgdmFsdWVcbiAqIGFuZCBlbWl0cyBjb3JyZXNwb25kaW5nIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4geyp9IC0gcmVwbGFjZWQgZWxlbWVudFxuICovXG5cbl8uZGVmaW5lKFxuICBhcnJheVByb3RvLFxuICAnJHNldCcsXG4gIGZ1bmN0aW9uICRzZXQgKGluZGV4LCB2YWwpIHtcbiAgICBpZiAoaW5kZXggPj0gdGhpcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubGVuZ3RoID0gaW5kZXggKyAxXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNwbGljZShpbmRleCwgMSwgdmFsKVswXVxuICB9XG4pXG5cbi8qKlxuICogQ29udmVuaWVuY2UgbWV0aG9kIHRvIHJlbW92ZSB0aGUgZWxlbWVudCBhdCBnaXZlbiBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXhcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuXy5kZWZpbmUoXG4gIGFycmF5UHJvdG8sXG4gICckcmVtb3ZlJyxcbiAgZnVuY3Rpb24gJHJlbW92ZSAoaW5kZXgpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXRoaXMubGVuZ3RoKSByZXR1cm5cbiAgICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgaW5kZXggPSBfLmluZGV4T2YodGhpcywgaW5kZXgpXG4gICAgfVxuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLnNwbGljZShpbmRleCwgMSlcbiAgICB9XG4gIH1cbilcblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheU1ldGhvZHMiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIEEgZGVwIGlzIGFuIG9ic2VydmFibGUgdGhhdCBjYW4gaGF2ZSBtdWx0aXBsZVxuICogZGlyZWN0aXZlcyBzdWJzY3JpYmluZyB0byBpdC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBEZXAgKCkge1xuICB0aGlzLnN1YnMgPSBbXVxufVxuXG52YXIgcCA9IERlcC5wcm90b3R5cGVcblxuLyoqXG4gKiBBZGQgYSBkaXJlY3RpdmUgc3Vic2NyaWJlci5cbiAqXG4gKiBAcGFyYW0ge0RpcmVjdGl2ZX0gc3ViXG4gKi9cblxucC5hZGRTdWIgPSBmdW5jdGlvbiAoc3ViKSB7XG4gIHRoaXMuc3Vicy5wdXNoKHN1Yilcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBkaXJlY3RpdmUgc3Vic2NyaWJlci5cbiAqXG4gKiBAcGFyYW0ge0RpcmVjdGl2ZX0gc3ViXG4gKi9cblxucC5yZW1vdmVTdWIgPSBmdW5jdGlvbiAoc3ViKSB7XG4gIHRoaXMuc3Vicy4kcmVtb3ZlKHN1Yilcbn1cblxuLyoqXG4gKiBOb3RpZnkgYWxsIHN1YnNjcmliZXJzIG9mIGEgbmV3IHZhbHVlLlxuICovXG5cbnAubm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAvLyBzdGFibGl6ZSB0aGUgc3Vic2NyaWJlciBsaXN0IGZpcnN0XG4gIHZhciBzdWJzID0gXy50b0FycmF5KHRoaXMuc3VicylcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzdWJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHN1YnNbaV0udXBkYXRlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IERlcCIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbnZhciBEZXAgPSByZXF1aXJlKCcuL2RlcCcpXG52YXIgYXJyYXlNZXRob2RzID0gcmVxdWlyZSgnLi9hcnJheScpXG52YXIgYXJyYXlLZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYXJyYXlNZXRob2RzKVxucmVxdWlyZSgnLi9vYmplY3QnKVxuXG52YXIgdWlkID0gMFxuXG4vKipcbiAqIFR5cGUgZW51bXNcbiAqL1xuXG52YXIgQVJSQVkgID0gMFxudmFyIE9CSkVDVCA9IDFcblxuLyoqXG4gKiBBdWdtZW50IGFuIHRhcmdldCBPYmplY3Qgb3IgQXJyYXkgYnkgaW50ZXJjZXB0aW5nXG4gKiB0aGUgcHJvdG90eXBlIGNoYWluIHVzaW5nIF9fcHJvdG9fX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSB0YXJnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b1xuICovXG5cbmZ1bmN0aW9uIHByb3RvQXVnbWVudCAodGFyZ2V0LCBzcmMpIHtcbiAgdGFyZ2V0Ll9fcHJvdG9fXyA9IHNyY1xufVxuXG4vKipcbiAqIEF1Z21lbnQgYW4gdGFyZ2V0IE9iamVjdCBvciBBcnJheSBieSBkZWZpbmluZ1xuICogaGlkZGVuIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IHRhcmdldFxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvXG4gKi9cblxuZnVuY3Rpb24gY29weUF1Z21lbnQgKHRhcmdldCwgc3JjLCBrZXlzKSB7XG4gIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgdmFyIGtleVxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIF8uZGVmaW5lKHRhcmdldCwga2V5LCBzcmNba2V5XSlcbiAgfVxufVxuXG4vKipcbiAqIE9ic2VydmVyIGNsYXNzIHRoYXQgYXJlIGF0dGFjaGVkIHRvIGVhY2ggb2JzZXJ2ZWRcbiAqIG9iamVjdC4gT25jZSBhdHRhY2hlZCwgdGhlIG9ic2VydmVyIGNvbnZlcnRzIHRhcmdldFxuICogb2JqZWN0J3MgcHJvcGVydHkga2V5cyBpbnRvIGdldHRlci9zZXR0ZXJzIHRoYXRcbiAqIGNvbGxlY3QgZGVwZW5kZW5jaWVzIGFuZCBkaXNwYXRjaGVzIHVwZGF0ZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IHZhbHVlXG4gKiBAcGFyYW0ge051bWJlcn0gdHlwZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gT2JzZXJ2ZXIgKHZhbHVlLCB0eXBlKSB7XG4gIHRoaXMuaWQgPSArK3VpZFxuICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gIHRoaXMuZGVwcyA9IFtdXG4gIF8uZGVmaW5lKHZhbHVlLCAnX19vYl9fJywgdGhpcylcbiAgaWYgKHR5cGUgPT09IEFSUkFZKSB7XG4gICAgdmFyIGF1Z21lbnQgPSBjb25maWcucHJvdG8gJiYgXy5oYXNQcm90b1xuICAgICAgPyBwcm90b0F1Z21lbnRcbiAgICAgIDogY29weUF1Z21lbnRcbiAgICBhdWdtZW50KHZhbHVlLCBhcnJheU1ldGhvZHMsIGFycmF5S2V5cylcbiAgICB0aGlzLm9ic2VydmVBcnJheSh2YWx1ZSlcbiAgfSBlbHNlIGlmICh0eXBlID09PSBPQkpFQ1QpIHtcbiAgICB0aGlzLndhbGsodmFsdWUpXG4gIH1cbn1cblxuT2JzZXJ2ZXIudGFyZ2V0ID0gbnVsbFxuXG52YXIgcCA9IE9ic2VydmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF0dGVtcHQgdG8gY3JlYXRlIGFuIG9ic2VydmVyIGluc3RhbmNlIGZvciBhIHZhbHVlLFxuICogcmV0dXJucyB0aGUgbmV3IG9ic2VydmVyIGlmIHN1Y2Nlc3NmdWxseSBvYnNlcnZlZCxcbiAqIG9yIHRoZSBleGlzdGluZyBvYnNlcnZlciBpZiB0aGUgdmFsdWUgYWxyZWFkeSBoYXMgb25lLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge09ic2VydmVyfHVuZGVmaW5lZH1cbiAqIEBzdGF0aWNcbiAqL1xuXG5PYnNlcnZlci5jcmVhdGUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKFxuICAgIHZhbHVlICYmXG4gICAgdmFsdWUuaGFzT3duUHJvcGVydHkoJ19fb2JfXycpICYmXG4gICAgdmFsdWUuX19vYl9fIGluc3RhbmNlb2YgT2JzZXJ2ZXJcbiAgKSB7XG4gICAgcmV0dXJuIHZhbHVlLl9fb2JfX1xuICB9IGVsc2UgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmVyKHZhbHVlLCBBUlJBWSlcbiAgfSBlbHNlIGlmIChcbiAgICBfLmlzUGxhaW5PYmplY3QodmFsdWUpICYmXG4gICAgIXZhbHVlLl9pc1Z1ZSAvLyBhdm9pZCBWdWUgaW5zdGFuY2VcbiAgKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZlcih2YWx1ZSwgT0JKRUNUKVxuICB9XG59XG5cbi8qKlxuICogV2FsayB0aHJvdWdoIGVhY2ggcHJvcGVydHkgYW5kIGNvbnZlcnQgdGhlbSBpbnRvXG4gKiBnZXR0ZXIvc2V0dGVycy4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIHdoZW5cbiAqIHZhbHVlIHR5cGUgaXMgT2JqZWN0LiBQcm9wZXJ0aWVzIHByZWZpeGVkIHdpdGggYCRgIG9yIGBfYFxuICogYW5kIGFjY2Vzc29yIHByb3BlcnRpZXMgYXJlIGlnbm9yZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICovXG5cbnAud2FsayA9IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG4gIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgdmFyIGtleSwgcHJlZml4XG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgcHJlZml4ID0ga2V5LmNoYXJDb2RlQXQoMClcbiAgICBpZiAocHJlZml4ICE9PSAweDI0ICYmIHByZWZpeCAhPT0gMHg1RikgeyAvLyBza2lwICQgb3IgX1xuICAgICAgdGhpcy5jb252ZXJ0KGtleSwgb2JqW2tleV0pXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVHJ5IHRvIGNhcmV0ZSBhbiBvYnNlcnZlciBmb3IgYSBjaGlsZCB2YWx1ZSxcbiAqIGFuZCBpZiB2YWx1ZSBpcyBhcnJheSwgbGluayBkZXAgdG8gdGhlIGFycmF5LlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcmV0dXJuIHtEZXB8dW5kZWZpbmVkfVxuICovXG5cbnAub2JzZXJ2ZSA9IGZ1bmN0aW9uICh2YWwpIHtcbiAgcmV0dXJuIE9ic2VydmVyLmNyZWF0ZSh2YWwpXG59XG5cbi8qKlxuICogT2JzZXJ2ZSBhIGxpc3Qgb2YgQXJyYXkgaXRlbXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gaXRlbXNcbiAqL1xuXG5wLm9ic2VydmVBcnJheSA9IGZ1bmN0aW9uIChpdGVtcykge1xuICB2YXIgaSA9IGl0ZW1zLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdGhpcy5vYnNlcnZlKGl0ZW1zW2ldKVxuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBhIHByb3BlcnR5IGludG8gZ2V0dGVyL3NldHRlciBzbyB3ZSBjYW4gZW1pdFxuICogdGhlIGV2ZW50cyB3aGVuIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZC9jaGFuZ2VkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxucC5jb252ZXJ0ID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gIHZhciBvYiA9IHRoaXNcbiAgdmFyIGNoaWxkT2IgPSBvYi5vYnNlcnZlKHZhbClcbiAgdmFyIGRlcCA9IG5ldyBEZXAoKVxuICBpZiAoY2hpbGRPYikge1xuICAgIGNoaWxkT2IuZGVwcy5wdXNoKGRlcClcbiAgfVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2IudmFsdWUsIGtleSwge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgLy8gT2JzZXJ2ZXIudGFyZ2V0IGlzIGEgd2F0Y2hlciB3aG9zZSBnZXR0ZXIgaXNcbiAgICAgIC8vIGN1cnJlbnRseSBiZWluZyBldmFsdWF0ZWQuXG4gICAgICBpZiAob2IuYWN0aXZlICYmIE9ic2VydmVyLnRhcmdldCkge1xuICAgICAgICBPYnNlcnZlci50YXJnZXQuYWRkRGVwKGRlcClcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWxcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCA9PT0gdmFsKSByZXR1cm5cbiAgICAgIC8vIHJlbW92ZSBkZXAgZnJvbSBvbGQgdmFsdWVcbiAgICAgIHZhciBvbGRDaGlsZE9iID0gdmFsICYmIHZhbC5fX29iX19cbiAgICAgIGlmIChvbGRDaGlsZE9iKSB7XG4gICAgICAgIG9sZENoaWxkT2IuZGVwcy4kcmVtb3ZlKGRlcClcbiAgICAgIH1cbiAgICAgIHZhbCA9IG5ld1ZhbFxuICAgICAgLy8gYWRkIGRlcCB0byBuZXcgdmFsdWVcbiAgICAgIHZhciBuZXdDaGlsZE9iID0gb2Iub2JzZXJ2ZShuZXdWYWwpXG4gICAgICBpZiAobmV3Q2hpbGRPYikge1xuICAgICAgICBuZXdDaGlsZE9iLmRlcHMucHVzaChkZXApXG4gICAgICB9XG4gICAgICBkZXAubm90aWZ5KClcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogTm90aWZ5IGNoYW5nZSBvbiBhbGwgc2VsZiBkZXBzIG9uIGFuIG9ic2VydmVyLlxuICogVGhpcyBpcyBjYWxsZWQgd2hlbiBhIG11dGFibGUgdmFsdWUgbXV0YXRlcy4gZS5nLlxuICogd2hlbiBhbiBBcnJheSdzIG11dGF0aW5nIG1ldGhvZHMgYXJlIGNhbGxlZCwgb3IgYW5cbiAqIE9iamVjdCdzICRhZGQvJGRlbGV0ZSBhcmUgY2FsbGVkLlxuICovXG5cbnAubm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZGVwcyA9IHRoaXMuZGVwc1xuICBmb3IgKHZhciBpID0gMCwgbCA9IGRlcHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZGVwc1tpXS5ub3RpZnkoKVxuICB9XG59XG5cbi8qKlxuICogQWRkIGFuIG93bmVyIHZtLCBzbyB0aGF0IHdoZW4gJGFkZC8kZGVsZXRlIG11dGF0aW9uc1xuICogaGFwcGVuIHdlIGNhbiBub3RpZnkgb3duZXIgdm1zIHRvIHByb3h5IHRoZSBrZXlzIGFuZFxuICogZGlnZXN0IHRoZSB3YXRjaGVycy4gVGhpcyBpcyBvbmx5IGNhbGxlZCB3aGVuIHRoZSBvYmplY3RcbiAqIGlzIG9ic2VydmVkIGFzIGFuIGluc3RhbmNlJ3Mgcm9vdCAkZGF0YS5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5wLmFkZFZtID0gZnVuY3Rpb24gKHZtKSB7XG4gICh0aGlzLnZtcyA9IHRoaXMudm1zIHx8IFtdKS5wdXNoKHZtKVxufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBvd25lciB2bS4gVGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgb2JqZWN0IGlzXG4gKiBzd2FwcGVkIG91dCBhcyBhbiBpbnN0YW5jZSdzICRkYXRhIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5wLnJlbW92ZVZtID0gZnVuY3Rpb24gKHZtKSB7XG4gIHRoaXMudm1zLiRyZW1vdmUodm0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZXJ2ZXJcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgb2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlXG5cbi8qKlxuICogQWRkIGEgbmV3IHByb3BlcnR5IHRvIGFuIG9ic2VydmVkIG9iamVjdFxuICogYW5kIGVtaXRzIGNvcnJlc3BvbmRpbmcgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHB1YmxpY1xuICovXG5cbl8uZGVmaW5lKFxuICBvYmpQcm90byxcbiAgJyRhZGQnLFxuICBmdW5jdGlvbiAkYWRkIChrZXksIHZhbCkge1xuICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHJldHVyblxuICAgIHZhciBvYiA9IHRoaXMuX19vYl9fXG4gICAgaWYgKCFvYiB8fCBfLmlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgdGhpc1trZXldID0gdmFsXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgb2IuY29udmVydChrZXksIHZhbClcbiAgICBpZiAob2Iudm1zKSB7XG4gICAgICB2YXIgaSA9IG9iLnZtcy5sZW5ndGhcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdmFyIHZtID0gb2Iudm1zW2ldXG4gICAgICAgIHZtLl9wcm94eShrZXkpXG4gICAgICAgIHZtLl9kaWdlc3QoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvYi5ub3RpZnkoKVxuICAgIH1cbiAgfVxuKVxuXG4vKipcbiAqIFNldCBhIHByb3BlcnR5IG9uIGFuIG9ic2VydmVkIG9iamVjdCwgY2FsbGluZyBhZGQgdG9cbiAqIGVuc3VyZSB0aGUgcHJvcGVydHkgaXMgb2JzZXJ2ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwdWJsaWNcbiAqL1xuXG5fLmRlZmluZShcbiAgb2JqUHJvdG8sXG4gICckc2V0JyxcbiAgZnVuY3Rpb24gJHNldCAoa2V5LCB2YWwpIHtcbiAgICB0aGlzLiRhZGQoa2V5LCB2YWwpXG4gICAgdGhpc1trZXldID0gdmFsXG4gIH1cbilcblxuLyoqXG4gKiBEZWxldGVzIGEgcHJvcGVydHkgZnJvbSBhbiBvYnNlcnZlZCBvYmplY3RcbiAqIGFuZCBlbWl0cyBjb3JyZXNwb25kaW5nIGV2ZW50XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHB1YmxpY1xuICovXG5cbl8uZGVmaW5lKFxuICBvYmpQcm90byxcbiAgJyRkZWxldGUnLFxuICBmdW5jdGlvbiAkZGVsZXRlIChrZXkpIHtcbiAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuXG4gICAgZGVsZXRlIHRoaXNba2V5XVxuICAgIHZhciBvYiA9IHRoaXMuX19vYl9fXG4gICAgaWYgKCFvYiB8fCBfLmlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChvYi52bXMpIHtcbiAgICAgIHZhciBpID0gb2Iudm1zLmxlbmd0aFxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICB2YXIgdm0gPSBvYi52bXNbaV1cbiAgICAgICAgdm0uX3VucHJveHkoa2V5KVxuICAgICAgICB2bS5fZGlnZXN0KClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb2Iubm90aWZ5KClcbiAgICB9XG4gIH1cbikiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIENhY2hlID0gcmVxdWlyZSgnLi4vY2FjaGUnKVxudmFyIGNhY2hlID0gbmV3IENhY2hlKDEwMDApXG52YXIgYXJnUkUgPSAvXlteXFx7XFw/XSskfF4nW14nXSonJHxeXCJbXlwiXSpcIiQvXG52YXIgZmlsdGVyVG9rZW5SRSA9IC9bXlxccydcIl0rfCdbXiddKyd8XCJbXlwiXStcIi9nXG5cbi8qKlxuICogUGFyc2VyIHN0YXRlXG4gKi9cblxudmFyIHN0clxudmFyIGMsIGksIGxcbnZhciBpblNpbmdsZVxudmFyIGluRG91YmxlXG52YXIgY3VybHlcbnZhciBzcXVhcmVcbnZhciBwYXJlblxudmFyIGJlZ2luXG52YXIgYXJnSW5kZXhcbnZhciBkaXJzXG52YXIgZGlyXG52YXIgbGFzdEZpbHRlckluZGV4XG52YXIgYXJnXG5cbi8qKlxuICogUHVzaCBhIGRpcmVjdGl2ZSBvYmplY3QgaW50byB0aGUgcmVzdWx0IEFycmF5XG4gKi9cblxuZnVuY3Rpb24gcHVzaERpciAoKSB7XG4gIGRpci5yYXcgPSBzdHIuc2xpY2UoYmVnaW4sIGkpLnRyaW0oKVxuICBpZiAoZGlyLmV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xuICAgIGRpci5leHByZXNzaW9uID0gc3RyLnNsaWNlKGFyZ0luZGV4LCBpKS50cmltKClcbiAgfSBlbHNlIGlmIChsYXN0RmlsdGVySW5kZXggIT09IGJlZ2luKSB7XG4gICAgcHVzaEZpbHRlcigpXG4gIH1cbiAgaWYgKGkgPT09IDAgfHwgZGlyLmV4cHJlc3Npb24pIHtcbiAgICBkaXJzLnB1c2goZGlyKVxuICB9XG59XG5cbi8qKlxuICogUHVzaCBhIGZpbHRlciB0byB0aGUgY3VycmVudCBkaXJlY3RpdmUgb2JqZWN0XG4gKi9cblxuZnVuY3Rpb24gcHVzaEZpbHRlciAoKSB7XG4gIHZhciBleHAgPSBzdHIuc2xpY2UobGFzdEZpbHRlckluZGV4LCBpKS50cmltKClcbiAgdmFyIGZpbHRlclxuICBpZiAoZXhwKSB7XG4gICAgZmlsdGVyID0ge31cbiAgICB2YXIgdG9rZW5zID0gZXhwLm1hdGNoKGZpbHRlclRva2VuUkUpXG4gICAgZmlsdGVyLm5hbWUgPSB0b2tlbnNbMF1cbiAgICBmaWx0ZXIuYXJncyA9IHRva2Vucy5sZW5ndGggPiAxID8gdG9rZW5zLnNsaWNlKDEpIDogbnVsbFxuICB9XG4gIGlmIChmaWx0ZXIpIHtcbiAgICAoZGlyLmZpbHRlcnMgPSBkaXIuZmlsdGVycyB8fCBbXSkucHVzaChmaWx0ZXIpXG4gIH1cbiAgbGFzdEZpbHRlckluZGV4ID0gaSArIDFcbn1cblxuLyoqXG4gKiBQYXJzZSBhIGRpcmVjdGl2ZSBzdHJpbmcgaW50byBhbiBBcnJheSBvZiBBU1QtbGlrZVxuICogb2JqZWN0cyByZXByZXNlbnRpbmcgZGlyZWN0aXZlcy5cbiAqXG4gKiBFeGFtcGxlOlxuICpcbiAqIFwiY2xpY2s6IGEgPSBhICsgMSB8IHVwcGVyY2FzZVwiIHdpbGwgeWllbGQ6XG4gKiB7XG4gKiAgIGFyZzogJ2NsaWNrJyxcbiAqICAgZXhwcmVzc2lvbjogJ2EgPSBhICsgMScsXG4gKiAgIGZpbHRlcnM6IFtcbiAqICAgICB7IG5hbWU6ICd1cHBlcmNhc2UnLCBhcmdzOiBudWxsIH1cbiAqICAgXVxuICogfVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge0FycmF5PE9iamVjdD59XG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChzKSB7XG5cbiAgdmFyIGhpdCA9IGNhY2hlLmdldChzKVxuICBpZiAoaGl0KSB7XG4gICAgcmV0dXJuIGhpdFxuICB9XG5cbiAgLy8gcmVzZXQgcGFyc2VyIHN0YXRlXG4gIHN0ciA9IHNcbiAgaW5TaW5nbGUgPSBpbkRvdWJsZSA9IGZhbHNlXG4gIGN1cmx5ID0gc3F1YXJlID0gcGFyZW4gPSBiZWdpbiA9IGFyZ0luZGV4ID0gMFxuICBsYXN0RmlsdGVySW5kZXggPSAwXG4gIGRpcnMgPSBbXVxuICBkaXIgPSB7fVxuICBhcmcgPSBudWxsXG5cbiAgZm9yIChpID0gMCwgbCA9IHN0ci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoaW5TaW5nbGUpIHtcbiAgICAgIC8vIGNoZWNrIHNpbmdsZSBxdW90ZVxuICAgICAgaWYgKGMgPT09IDB4MjcpIGluU2luZ2xlID0gIWluU2luZ2xlXG4gICAgfSBlbHNlIGlmIChpbkRvdWJsZSkge1xuICAgICAgLy8gY2hlY2sgZG91YmxlIHF1b3RlXG4gICAgICBpZiAoYyA9PT0gMHgyMikgaW5Eb3VibGUgPSAhaW5Eb3VibGVcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgYyA9PT0gMHgyQyAmJiAvLyBjb21tYVxuICAgICAgIXBhcmVuICYmICFjdXJseSAmJiAhc3F1YXJlXG4gICAgKSB7XG4gICAgICAvLyByZWFjaGVkIHRoZSBlbmQgb2YgYSBkaXJlY3RpdmVcbiAgICAgIHB1c2hEaXIoKVxuICAgICAgLy8gcmVzZXQgJiBza2lwIHRoZSBjb21tYVxuICAgICAgZGlyID0ge31cbiAgICAgIGJlZ2luID0gYXJnSW5kZXggPSBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjID09PSAweDNBICYmIC8vIGNvbG9uXG4gICAgICAhZGlyLmV4cHJlc3Npb24gJiZcbiAgICAgICFkaXIuYXJnXG4gICAgKSB7XG4gICAgICAvLyBhcmd1bWVudFxuICAgICAgYXJnID0gc3RyLnNsaWNlKGJlZ2luLCBpKS50cmltKClcbiAgICAgIC8vIHRlc3QgZm9yIHZhbGlkIGFyZ3VtZW50IGhlcmVcbiAgICAgIC8vIHNpbmNlIHdlIG1heSBoYXZlIGNhdWdodCBzdHVmZiBsaWtlIGZpcnN0IGhhbGYgb2ZcbiAgICAgIC8vIGFuIG9iamVjdCBsaXRlcmFsIG9yIGEgdGVybmFyeSBleHByZXNzaW9uLlxuICAgICAgaWYgKGFyZ1JFLnRlc3QoYXJnKSkge1xuICAgICAgICBhcmdJbmRleCA9IGkgKyAxXG4gICAgICAgIGRpci5hcmcgPSBfLnN0cmlwUXVvdGVzKGFyZykgfHwgYXJnXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGMgPT09IDB4N0MgJiYgLy8gcGlwZVxuICAgICAgc3RyLmNoYXJDb2RlQXQoaSArIDEpICE9PSAweDdDICYmXG4gICAgICBzdHIuY2hhckNvZGVBdChpIC0gMSkgIT09IDB4N0NcbiAgICApIHtcbiAgICAgIGlmIChkaXIuZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIGZpcnN0IGZpbHRlciwgZW5kIG9mIGV4cHJlc3Npb25cbiAgICAgICAgbGFzdEZpbHRlckluZGV4ID0gaSArIDFcbiAgICAgICAgZGlyLmV4cHJlc3Npb24gPSBzdHIuc2xpY2UoYXJnSW5kZXgsIGkpLnRyaW0oKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYWxyZWFkeSBoYXMgZmlsdGVyXG4gICAgICAgIHB1c2hGaWx0ZXIoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzd2l0Y2ggKGMpIHtcbiAgICAgICAgY2FzZSAweDIyOiBpbkRvdWJsZSA9IHRydWU7IGJyZWFrIC8vIFwiXG4gICAgICAgIGNhc2UgMHgyNzogaW5TaW5nbGUgPSB0cnVlOyBicmVhayAvLyAnXG4gICAgICAgIGNhc2UgMHgyODogcGFyZW4rKzsgYnJlYWsgICAgICAgICAvLyAoXG4gICAgICAgIGNhc2UgMHgyOTogcGFyZW4tLTsgYnJlYWsgICAgICAgICAvLyApXG4gICAgICAgIGNhc2UgMHg1Qjogc3F1YXJlKys7IGJyZWFrICAgICAgICAvLyBbXG4gICAgICAgIGNhc2UgMHg1RDogc3F1YXJlLS07IGJyZWFrICAgICAgICAvLyBdXG4gICAgICAgIGNhc2UgMHg3QjogY3VybHkrKzsgYnJlYWsgICAgICAgICAvLyB7XG4gICAgICAgIGNhc2UgMHg3RDogY3VybHktLTsgYnJlYWsgICAgICAgICAvLyB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGkgPT09IDAgfHwgYmVnaW4gIT09IGkpIHtcbiAgICBwdXNoRGlyKClcbiAgfVxuXG4gIGNhY2hlLnB1dChzLCBkaXJzKVxuICByZXR1cm4gZGlyc1xufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgUGF0aCA9IHJlcXVpcmUoJy4vcGF0aCcpXG52YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgZXhwcmVzc2lvbkNhY2hlID0gbmV3IENhY2hlKDEwMDApXG5cbnZhciBhbGxvd2VkS2V5d29yZHMgPVxuICAnTWF0aCxEYXRlLHRoaXMsdHJ1ZSxmYWxzZSxudWxsLHVuZGVmaW5lZCxJbmZpbml0eSxOYU4sJyArXG4gICdpc05hTixpc0Zpbml0ZSxkZWNvZGVVUkksZGVjb2RlVVJJQ29tcG9uZW50LGVuY29kZVVSSSwnICtcbiAgJ2VuY29kZVVSSUNvbXBvbmVudCxwYXJzZUludCxwYXJzZUZsb2F0J1xudmFyIGFsbG93ZWRLZXl3b3Jkc1JFID1cbiAgbmV3IFJlZ0V4cCgnXignICsgYWxsb3dlZEtleXdvcmRzLnJlcGxhY2UoLywvZywgJ1xcXFxifCcpICsgJ1xcXFxiKScpXG5cbi8vIGtleXdvcmRzIHRoYXQgZG9uJ3QgbWFrZSBzZW5zZSBpbnNpZGUgZXhwcmVzc2lvbnNcbnZhciBpbXByb3BlcktleXdvcmRzID1cbiAgJ2JyZWFrLGNhc2UsY2xhc3MsY2F0Y2gsY29uc3QsY29udGludWUsZGVidWdnZXIsZGVmYXVsdCwnICtcbiAgJ2RlbGV0ZSxkbyxlbHNlLGV4cG9ydCxleHRlbmRzLGZpbmFsbHksZm9yLGZ1bmN0aW9uLGlmLCcgK1xuICAnaW1wb3J0LGluLGluc3RhbmNlb2YsbGV0LHJldHVybixzdXBlcixzd2l0Y2gsdGhyb3csdHJ5LCcgK1xuICAndmFyLHdoaWxlLHdpdGgseWllbGQsZW51bSxhd2FpdCxpbXBsZW1lbnRzLHBhY2thZ2UsJyArXG4gICdwcm9jdGVjdGVkLHN0YXRpYyxpbnRlcmZhY2UscHJpdmF0ZSxwdWJsaWMnXG52YXIgaW1wcm9wZXJLZXl3b3Jkc1JFID1cbiAgbmV3IFJlZ0V4cCgnXignICsgaW1wcm9wZXJLZXl3b3Jkcy5yZXBsYWNlKC8sL2csICdcXFxcYnwnKSArICdcXFxcYiknKVxuXG52YXIgd3NSRSA9IC9cXHMvZ1xudmFyIG5ld2xpbmVSRSA9IC9cXG4vZ1xudmFyIHNhdmVSRSA9IC9bXFx7LF1cXHMqW1xcd1xcJF9dK1xccyo6fCgnW14nXSonfFwiW15cIl0qXCIpfG5ldyB8dHlwZW9mIHx2b2lkIC9nXG52YXIgcmVzdG9yZVJFID0gL1wiKFxcZCspXCIvZ1xudmFyIHBhdGhUZXN0UkUgPSAvXltBLVphLXpfJF1bXFx3JF0qKFxcLltBLVphLXpfJF1bXFx3JF0qfFxcWycuKj8nXFxdfFxcW1wiLio/XCJcXF18XFxbXFxkK1xcXSkqJC9cbnZhciBwYXRoUmVwbGFjZVJFID0gL1teXFx3JFxcLl0oW0EtWmEtel8kXVtcXHckXSooXFwuW0EtWmEtel8kXVtcXHckXSp8XFxbJy4qPydcXF18XFxbXCIuKj9cIlxcXSkqKS9nXG52YXIgYm9vbGVhbkxpdGVyYWxSRSA9IC9eKHRydWV8ZmFsc2UpJC9cblxuLyoqXG4gKiBTYXZlIC8gUmV3cml0ZSAvIFJlc3RvcmVcbiAqXG4gKiBXaGVuIHJld3JpdGluZyBwYXRocyBmb3VuZCBpbiBhbiBleHByZXNzaW9uLCBpdCBpc1xuICogcG9zc2libGUgZm9yIHRoZSBzYW1lIGxldHRlciBzZXF1ZW5jZXMgdG8gYmUgZm91bmQgaW5cbiAqIHN0cmluZ3MgYW5kIE9iamVjdCBsaXRlcmFsIHByb3BlcnR5IGtleXMuIFRoZXJlZm9yZSB3ZVxuICogcmVtb3ZlIGFuZCBzdG9yZSB0aGVzZSBwYXJ0cyBpbiBhIHRlbXBvcmFyeSBhcnJheSwgYW5kXG4gKiByZXN0b3JlIHRoZW0gYWZ0ZXIgdGhlIHBhdGggcmV3cml0ZS5cbiAqL1xuXG52YXIgc2F2ZWQgPSBbXVxuXG4vKipcbiAqIFNhdmUgcmVwbGFjZXJcbiAqXG4gKiBUaGUgc2F2ZSByZWdleCBjYW4gbWF0Y2ggdHdvIHBvc3NpYmxlIGNhc2VzOlxuICogMS4gQW4gb3BlbmluZyBvYmplY3QgbGl0ZXJhbFxuICogMi4gQSBzdHJpbmdcbiAqIElmIG1hdGNoZWQgYXMgYSBwbGFpbiBzdHJpbmcsIHdlIG5lZWQgdG8gZXNjYXBlIGl0c1xuICogbmV3bGluZXMsIHNpbmNlIHRoZSBzdHJpbmcgbmVlZHMgdG8gYmUgcHJlc2VydmVkIHdoZW5cbiAqIGdlbmVyYXRpbmcgdGhlIGZ1bmN0aW9uIGJvZHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGlzU3RyaW5nIC0gc3RyIGlmIG1hdGNoZWQgYXMgYSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ30gLSBwbGFjZWhvbGRlciB3aXRoIGluZGV4XG4gKi9cblxuZnVuY3Rpb24gc2F2ZSAoc3RyLCBpc1N0cmluZykge1xuICB2YXIgaSA9IHNhdmVkLmxlbmd0aFxuICBzYXZlZFtpXSA9IGlzU3RyaW5nXG4gICAgPyBzdHIucmVwbGFjZShuZXdsaW5lUkUsICdcXFxcbicpXG4gICAgOiBzdHJcbiAgcmV0dXJuICdcIicgKyBpICsgJ1wiJ1xufVxuXG4vKipcbiAqIFBhdGggcmV3cml0ZSByZXBsYWNlclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSByYXdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiByZXdyaXRlIChyYXcpIHtcbiAgdmFyIGMgPSByYXcuY2hhckF0KDApXG4gIHZhciBwYXRoID0gcmF3LnNsaWNlKDEpXG4gIGlmIChhbGxvd2VkS2V5d29yZHNSRS50ZXN0KHBhdGgpKSB7XG4gICAgcmV0dXJuIHJhd1xuICB9IGVsc2Uge1xuICAgIHBhdGggPSBwYXRoLmluZGV4T2YoJ1wiJykgPiAtMVxuICAgICAgPyBwYXRoLnJlcGxhY2UocmVzdG9yZVJFLCByZXN0b3JlKVxuICAgICAgOiBwYXRoXG4gICAgcmV0dXJuIGMgKyAnc2NvcGUuJyArIHBhdGhcbiAgfVxufVxuXG4vKipcbiAqIFJlc3RvcmUgcmVwbGFjZXJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gaSAtIG1hdGNoZWQgc2F2ZSBpbmRleFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHJlc3RvcmUgKHN0ciwgaSkge1xuICByZXR1cm4gc2F2ZWRbaV1cbn1cblxuLyoqXG4gKiBSZXdyaXRlIGFuIGV4cHJlc3Npb24sIHByZWZpeGluZyBhbGwgcGF0aCBhY2Nlc3NvcnMgd2l0aFxuICogYHNjb3BlLmAgYW5kIGdlbmVyYXRlIGdldHRlci9zZXR0ZXIgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbmVlZFNldFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZUV4cEZucyAoZXhwLCBuZWVkU2V0KSB7XG4gIGlmIChpbXByb3BlcktleXdvcmRzUkUudGVzdChleHApKSB7XG4gICAgXy53YXJuKFxuICAgICAgJ0F2b2lkIHVzaW5nIHJlc2VydmVkIGtleXdvcmRzIGluIGV4cHJlc3Npb246ICdcbiAgICAgICsgZXhwXG4gICAgKVxuICB9XG4gIC8vIHJlc2V0IHN0YXRlXG4gIHNhdmVkLmxlbmd0aCA9IDBcbiAgLy8gc2F2ZSBzdHJpbmdzIGFuZCBvYmplY3QgbGl0ZXJhbCBrZXlzXG4gIHZhciBib2R5ID0gZXhwXG4gICAgLnJlcGxhY2Uoc2F2ZVJFLCBzYXZlKVxuICAgIC5yZXBsYWNlKHdzUkUsICcnKVxuICAvLyByZXdyaXRlIGFsbCBwYXRoc1xuICAvLyBwYWQgMSBzcGFjZSBoZXJlIGJlY2F1ZSB0aGUgcmVnZXggbWF0Y2hlcyAxIGV4dHJhIGNoYXJcbiAgYm9keSA9ICgnICcgKyBib2R5KVxuICAgIC5yZXBsYWNlKHBhdGhSZXBsYWNlUkUsIHJld3JpdGUpXG4gICAgLnJlcGxhY2UocmVzdG9yZVJFLCByZXN0b3JlKVxuICB2YXIgZ2V0dGVyID0gbWFrZUdldHRlcihib2R5KVxuICBpZiAoZ2V0dGVyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgYm9keTogYm9keSxcbiAgICAgIHNldDogbmVlZFNldFxuICAgICAgICA/IG1ha2VTZXR0ZXIoYm9keSlcbiAgICAgICAgOiBudWxsXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBnZXR0ZXIgc2V0dGVycyBmb3IgYSBzaW1wbGUgcGF0aC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlUGF0aEZucyAoZXhwKSB7XG4gIHZhciBnZXR0ZXIsIHBhdGhcbiAgaWYgKGV4cC5pbmRleE9mKCdbJykgPCAwKSB7XG4gICAgLy8gcmVhbGx5IHNpbXBsZSBwYXRoXG4gICAgcGF0aCA9IGV4cC5zcGxpdCgnLicpXG4gICAgZ2V0dGVyID0gUGF0aC5jb21waWxlR2V0dGVyKHBhdGgpXG4gIH0gZWxzZSB7XG4gICAgLy8gZG8gdGhlIHJlYWwgcGFyc2luZ1xuICAgIHBhdGggPSBQYXRoLnBhcnNlKGV4cClcbiAgICBnZXR0ZXIgPSBwYXRoLmdldFxuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0OiBnZXR0ZXIsXG4gICAgLy8gYWx3YXlzIGdlbmVyYXRlIHNldHRlciBmb3Igc2ltcGxlIHBhdGhzXG4gICAgc2V0OiBmdW5jdGlvbiAob2JqLCB2YWwpIHtcbiAgICAgIFBhdGguc2V0KG9iaiwgcGF0aCwgdmFsKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEJ1aWxkIGEgZ2V0dGVyIGZ1bmN0aW9uLiBSZXF1aXJlcyBldmFsLlxuICpcbiAqIFdlIGlzb2xhdGUgdGhlIHRyeS9jYXRjaCBzbyBpdCBkb2Vzbid0IGFmZmVjdCB0aGVcbiAqIG9wdGltaXphdGlvbiBvZiB0aGUgcGFyc2UgZnVuY3Rpb24gd2hlbiBpdCBpcyBub3QgY2FsbGVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBib2R5XG4gKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gbWFrZUdldHRlciAoYm9keSkge1xuICB0cnkge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ3Njb3BlJywgJ3JldHVybiAnICsgYm9keSArICc7JylcbiAgfSBjYXRjaCAoZSkge1xuICAgIF8ud2FybihcbiAgICAgICdJbnZhbGlkIGV4cHJlc3Npb24uICcgK1xuICAgICAgJ0dlbmVyYXRlZCBmdW5jdGlvbiBib2R5OiAnICsgYm9keVxuICAgIClcbiAgfVxufVxuXG4vKipcbiAqIEJ1aWxkIGEgc2V0dGVyIGZ1bmN0aW9uLlxuICpcbiAqIFRoaXMgaXMgb25seSBuZWVkZWQgaW4gcmFyZSBzaXR1YXRpb25zIGxpa2UgXCJhW2JdXCIgd2hlcmVcbiAqIGEgc2V0dGFibGUgcGF0aCByZXF1aXJlcyBkeW5hbWljIGV2YWx1YXRpb24uXG4gKlxuICogVGhpcyBzZXR0ZXIgZnVuY3Rpb24gbWF5IHRocm93IGVycm9yIHdoZW4gY2FsbGVkIGlmIHRoZVxuICogZXhwcmVzc2lvbiBib2R5IGlzIG5vdCBhIHZhbGlkIGxlZnQtaGFuZCBleHByZXNzaW9uIGluXG4gKiBhc3NpZ25tZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBib2R5XG4gKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gbWFrZVNldHRlciAoYm9keSkge1xuICB0cnkge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ3Njb3BlJywgJ3ZhbHVlJywgYm9keSArICc9dmFsdWU7JylcbiAgfSBjYXRjaCAoZSkge1xuICAgIF8ud2FybignSW52YWxpZCBzZXR0ZXIgZnVuY3Rpb24gYm9keTogJyArIGJvZHkpXG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBmb3Igc2V0dGVyIGV4aXN0ZW5jZSBvbiBhIGNhY2hlIGhpdC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoaXRcbiAqL1xuXG5mdW5jdGlvbiBjaGVja1NldHRlciAoaGl0KSB7XG4gIGlmICghaGl0LnNldCkge1xuICAgIGhpdC5zZXQgPSBtYWtlU2V0dGVyKGhpdC5ib2R5KVxuICB9XG59XG5cbi8qKlxuICogUGFyc2UgYW4gZXhwcmVzc2lvbiBpbnRvIHJlLXdyaXR0ZW4gZ2V0dGVyL3NldHRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHBhcmFtIHtCb29sZWFufSBuZWVkU2V0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKGV4cCwgbmVlZFNldCkge1xuICBleHAgPSBleHAudHJpbSgpXG4gIC8vIHRyeSBjYWNoZVxuICB2YXIgaGl0ID0gZXhwcmVzc2lvbkNhY2hlLmdldChleHApXG4gIGlmIChoaXQpIHtcbiAgICBpZiAobmVlZFNldCkge1xuICAgICAgY2hlY2tTZXR0ZXIoaGl0KVxuICAgIH1cbiAgICByZXR1cm4gaGl0XG4gIH1cbiAgLy8gd2UgZG8gYSBzaW1wbGUgcGF0aCBjaGVjayB0byBvcHRpbWl6ZSBmb3IgdGhlbS5cbiAgLy8gdGhlIGNoZWNrIGZhaWxzIHZhbGlkIHBhdGhzIHdpdGggdW51c2FsIHdoaXRlc3BhY2VzLFxuICAvLyBidXQgdGhhdCdzIHRvbyByYXJlIGFuZCB3ZSBkb24ndCBjYXJlLlxuICAvLyBhbHNvIHNraXAgYm9vbGVhbiBsaXRlcmFscyBhbmQgcGF0aHMgdGhhdCBzdGFydCB3aXRoXG4gIC8vIGdsb2JhbCBcIk1hdGhcIlxuICB2YXIgcmVzID0gZXhwb3J0cy5pc1NpbXBsZVBhdGgoZXhwKVxuICAgID8gY29tcGlsZVBhdGhGbnMoZXhwKVxuICAgIDogY29tcGlsZUV4cEZucyhleHAsIG5lZWRTZXQpXG4gIGV4cHJlc3Npb25DYWNoZS5wdXQoZXhwLCByZXMpXG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBleHByZXNzaW9uIGlzIGEgc2ltcGxlIHBhdGguXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmlzU2ltcGxlUGF0aCA9IGZ1bmN0aW9uIChleHApIHtcbiAgcmV0dXJuIHBhdGhUZXN0UkUudGVzdChleHApICYmXG4gICAgLy8gZG9uJ3QgdHJlYXQgdHJ1ZS9mYWxzZSBhcyBwYXRoc1xuICAgICFib29sZWFuTGl0ZXJhbFJFLnRlc3QoZXhwKSAmJlxuICAgIC8vIE1hdGggY29uc3RhbnRzIGUuZy4gTWF0aC5QSSwgTWF0aC5FIGV0Yy5cbiAgICBleHAuc2xpY2UoMCwgNSkgIT09ICdNYXRoLidcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIENhY2hlID0gcmVxdWlyZSgnLi4vY2FjaGUnKVxudmFyIHBhdGhDYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxudmFyIGlkZW50UkUgPSAvXlskX2EtekEtWl0rW1xcdyRdKiQvXG5cbi8qKlxuICogUGF0aC1wYXJzaW5nIGFsZ29yaXRobSBzY29vcGVkIGZyb20gUG9seW1lci9vYnNlcnZlLWpzXG4gKi9cblxudmFyIHBhdGhTdGF0ZU1hY2hpbmUgPSB7XG4gICdiZWZvcmVQYXRoJzoge1xuICAgICd3cyc6IFsnYmVmb3JlUGF0aCddLFxuICAgICdpZGVudCc6IFsnaW5JZGVudCcsICdhcHBlbmQnXSxcbiAgICAnWyc6IFsnYmVmb3JlRWxlbWVudCddLFxuICAgICdlb2YnOiBbJ2FmdGVyUGF0aCddXG4gIH0sXG5cbiAgJ2luUGF0aCc6IHtcbiAgICAnd3MnOiBbJ2luUGF0aCddLFxuICAgICcuJzogWydiZWZvcmVJZGVudCddLFxuICAgICdbJzogWydiZWZvcmVFbGVtZW50J10sXG4gICAgJ2VvZic6IFsnYWZ0ZXJQYXRoJ11cbiAgfSxcblxuICAnYmVmb3JlSWRlbnQnOiB7XG4gICAgJ3dzJzogWydiZWZvcmVJZGVudCddLFxuICAgICdpZGVudCc6IFsnaW5JZGVudCcsICdhcHBlbmQnXVxuICB9LFxuXG4gICdpbklkZW50Jzoge1xuICAgICdpZGVudCc6IFsnaW5JZGVudCcsICdhcHBlbmQnXSxcbiAgICAnMCc6IFsnaW5JZGVudCcsICdhcHBlbmQnXSxcbiAgICAnbnVtYmVyJzogWydpbklkZW50JywgJ2FwcGVuZCddLFxuICAgICd3cyc6IFsnaW5QYXRoJywgJ3B1c2gnXSxcbiAgICAnLic6IFsnYmVmb3JlSWRlbnQnLCAncHVzaCddLFxuICAgICdbJzogWydiZWZvcmVFbGVtZW50JywgJ3B1c2gnXSxcbiAgICAnZW9mJzogWydhZnRlclBhdGgnLCAncHVzaCddXG4gIH0sXG5cbiAgJ2JlZm9yZUVsZW1lbnQnOiB7XG4gICAgJ3dzJzogWydiZWZvcmVFbGVtZW50J10sXG4gICAgJzAnOiBbJ2FmdGVyWmVybycsICdhcHBlbmQnXSxcbiAgICAnbnVtYmVyJzogWydpbkluZGV4JywgJ2FwcGVuZCddLFxuICAgIFwiJ1wiOiBbJ2luU2luZ2xlUXVvdGUnLCAnYXBwZW5kJywgJyddLFxuICAgICdcIic6IFsnaW5Eb3VibGVRdW90ZScsICdhcHBlbmQnLCAnJ11cbiAgfSxcblxuICAnYWZ0ZXJaZXJvJzoge1xuICAgICd3cyc6IFsnYWZ0ZXJFbGVtZW50JywgJ3B1c2gnXSxcbiAgICAnXSc6IFsnaW5QYXRoJywgJ3B1c2gnXVxuICB9LFxuXG4gICdpbkluZGV4Jzoge1xuICAgICcwJzogWydpbkluZGV4JywgJ2FwcGVuZCddLFxuICAgICdudW1iZXInOiBbJ2luSW5kZXgnLCAnYXBwZW5kJ10sXG4gICAgJ3dzJzogWydhZnRlckVsZW1lbnQnXSxcbiAgICAnXSc6IFsnaW5QYXRoJywgJ3B1c2gnXVxuICB9LFxuXG4gICdpblNpbmdsZVF1b3RlJzoge1xuICAgIFwiJ1wiOiBbJ2FmdGVyRWxlbWVudCddLFxuICAgICdlb2YnOiAnZXJyb3InLFxuICAgICdlbHNlJzogWydpblNpbmdsZVF1b3RlJywgJ2FwcGVuZCddXG4gIH0sXG5cbiAgJ2luRG91YmxlUXVvdGUnOiB7XG4gICAgJ1wiJzogWydhZnRlckVsZW1lbnQnXSxcbiAgICAnZW9mJzogJ2Vycm9yJyxcbiAgICAnZWxzZSc6IFsnaW5Eb3VibGVRdW90ZScsICdhcHBlbmQnXVxuICB9LFxuXG4gICdhZnRlckVsZW1lbnQnOiB7XG4gICAgJ3dzJzogWydhZnRlckVsZW1lbnQnXSxcbiAgICAnXSc6IFsnaW5QYXRoJywgJ3B1c2gnXVxuICB9XG59XG5cbmZ1bmN0aW9uIG5vb3AgKCkge31cblxuLyoqXG4gKiBEZXRlcm1pbmUgdGhlIHR5cGUgb2YgYSBjaGFyYWN0ZXIgaW4gYSBrZXlwYXRoLlxuICpcbiAqIEBwYXJhbSB7Q2hhcn0gY2hhclxuICogQHJldHVybiB7U3RyaW5nfSB0eXBlXG4gKi9cblxuZnVuY3Rpb24gZ2V0UGF0aENoYXJUeXBlIChjaGFyKSB7XG4gIGlmIChjaGFyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gJ2VvZidcbiAgfVxuXG4gIHZhciBjb2RlID0gY2hhci5jaGFyQ29kZUF0KDApXG5cbiAgc3dpdGNoKGNvZGUpIHtcbiAgICBjYXNlIDB4NUI6IC8vIFtcbiAgICBjYXNlIDB4NUQ6IC8vIF1cbiAgICBjYXNlIDB4MkU6IC8vIC5cbiAgICBjYXNlIDB4MjI6IC8vIFwiXG4gICAgY2FzZSAweDI3OiAvLyAnXG4gICAgY2FzZSAweDMwOiAvLyAwXG4gICAgICByZXR1cm4gY2hhclxuXG4gICAgY2FzZSAweDVGOiAvLyBfXG4gICAgY2FzZSAweDI0OiAvLyAkXG4gICAgICByZXR1cm4gJ2lkZW50J1xuXG4gICAgY2FzZSAweDIwOiAvLyBTcGFjZVxuICAgIGNhc2UgMHgwOTogLy8gVGFiXG4gICAgY2FzZSAweDBBOiAvLyBOZXdsaW5lXG4gICAgY2FzZSAweDBEOiAvLyBSZXR1cm5cbiAgICBjYXNlIDB4QTA6ICAvLyBOby1icmVhayBzcGFjZVxuICAgIGNhc2UgMHhGRUZGOiAgLy8gQnl0ZSBPcmRlciBNYXJrXG4gICAgY2FzZSAweDIwMjg6ICAvLyBMaW5lIFNlcGFyYXRvclxuICAgIGNhc2UgMHgyMDI5OiAgLy8gUGFyYWdyYXBoIFNlcGFyYXRvclxuICAgICAgcmV0dXJuICd3cydcbiAgfVxuXG4gIC8vIGEteiwgQS1aXG4gIGlmICgoMHg2MSA8PSBjb2RlICYmIGNvZGUgPD0gMHg3QSkgfHxcbiAgICAgICgweDQxIDw9IGNvZGUgJiYgY29kZSA8PSAweDVBKSkge1xuICAgIHJldHVybiAnaWRlbnQnXG4gIH1cblxuICAvLyAxLTlcbiAgaWYgKDB4MzEgPD0gY29kZSAmJiBjb2RlIDw9IDB4MzkpIHtcbiAgICByZXR1cm4gJ251bWJlcidcbiAgfVxuXG4gIHJldHVybiAnZWxzZSdcbn1cblxuLyoqXG4gKiBQYXJzZSBhIHN0cmluZyBwYXRoIGludG8gYW4gYXJyYXkgb2Ygc2VnbWVudHNcbiAqIFRvZG8gaW1wbGVtZW50IGNhY2hlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEByZXR1cm4ge0FycmF5fHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBwYXJzZVBhdGggKHBhdGgpIHtcbiAgdmFyIGtleXMgPSBbXVxuICB2YXIgaW5kZXggPSAtMVxuICB2YXIgbW9kZSA9ICdiZWZvcmVQYXRoJ1xuICB2YXIgYywgbmV3Q2hhciwga2V5LCB0eXBlLCB0cmFuc2l0aW9uLCBhY3Rpb24sIHR5cGVNYXBcblxuICB2YXIgYWN0aW9ucyA9IHtcbiAgICBwdXNoOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGtleXMucHVzaChrZXkpXG4gICAgICBrZXkgPSB1bmRlZmluZWRcbiAgICB9LFxuICAgIGFwcGVuZDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAga2V5ID0gbmV3Q2hhclxuICAgICAgfSBlbHNlIHtcbiAgICAgICAga2V5ICs9IG5ld0NoYXJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYXliZVVuZXNjYXBlUXVvdGUgKCkge1xuICAgIHZhciBuZXh0Q2hhciA9IHBhdGhbaW5kZXggKyAxXVxuICAgIGlmICgobW9kZSA9PT0gJ2luU2luZ2xlUXVvdGUnICYmIG5leHRDaGFyID09PSBcIidcIikgfHxcbiAgICAgICAgKG1vZGUgPT09ICdpbkRvdWJsZVF1b3RlJyAmJiBuZXh0Q2hhciA9PT0gJ1wiJykpIHtcbiAgICAgIGluZGV4KytcbiAgICAgIG5ld0NoYXIgPSBuZXh0Q2hhclxuICAgICAgYWN0aW9ucy5hcHBlbmQoKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICB3aGlsZSAobW9kZSkge1xuICAgIGluZGV4KytcbiAgICBjID0gcGF0aFtpbmRleF1cblxuICAgIGlmIChjID09PSAnXFxcXCcgJiYgbWF5YmVVbmVzY2FwZVF1b3RlKCkpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgdHlwZSA9IGdldFBhdGhDaGFyVHlwZShjKVxuICAgIHR5cGVNYXAgPSBwYXRoU3RhdGVNYWNoaW5lW21vZGVdXG4gICAgdHJhbnNpdGlvbiA9IHR5cGVNYXBbdHlwZV0gfHwgdHlwZU1hcFsnZWxzZSddIHx8ICdlcnJvcidcblxuICAgIGlmICh0cmFuc2l0aW9uID09PSAnZXJyb3InKSB7XG4gICAgICByZXR1cm4gLy8gcGFyc2UgZXJyb3JcbiAgICB9XG5cbiAgICBtb2RlID0gdHJhbnNpdGlvblswXVxuICAgIGFjdGlvbiA9IGFjdGlvbnNbdHJhbnNpdGlvblsxXV0gfHwgbm9vcFxuICAgIG5ld0NoYXIgPSB0cmFuc2l0aW9uWzJdID09PSB1bmRlZmluZWRcbiAgICAgID8gY1xuICAgICAgOiB0cmFuc2l0aW9uWzJdXG4gICAgYWN0aW9uKClcblxuICAgIGlmIChtb2RlID09PSAnYWZ0ZXJQYXRoJykge1xuICAgICAgcmV0dXJuIGtleXNcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBGb3JtYXQgYSBhY2Nlc3NvciBzZWdtZW50IGJhc2VkIG9uIGl0cyB0eXBlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0QWNjZXNzb3Ioa2V5KSB7XG4gIGlmIChpZGVudFJFLnRlc3Qoa2V5KSkgeyAvLyBpZGVudGlmaWVyXG4gICAgcmV0dXJuICcuJyArIGtleVxuICB9IGVsc2UgaWYgKCtrZXkgPT09IGtleSA+Pj4gMCkgeyAvLyBicmFja2V0IGluZGV4XG4gICAgcmV0dXJuICdbJyArIGtleSArICddJ1xuICB9IGVsc2UgeyAvLyBicmFja2V0IHN0cmluZ1xuICAgIHJldHVybiAnW1wiJyArIGtleS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgKyAnXCJdJ1xuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZXMgYSBnZXR0ZXIgZnVuY3Rpb24gd2l0aCBhIGZpeGVkIHBhdGguXG4gKiBUaGUgZml4ZWQgcGF0aCBnZXR0ZXIgc3VwcmVzc2VzIGVycm9ycy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5leHBvcnRzLmNvbXBpbGVHZXR0ZXIgPSBmdW5jdGlvbiAocGF0aCkge1xuICB2YXIgYm9keSA9ICdyZXR1cm4gbycgKyBwYXRoLm1hcChmb3JtYXRBY2Nlc3Nvcikuam9pbignJylcbiAgcmV0dXJuIG5ldyBGdW5jdGlvbignbycsICd0cnkgeycgKyBib2R5ICsgJ30gY2F0Y2ggKGUpIHt9Jylcbn1cblxuLyoqXG4gKiBFeHRlcm5hbCBwYXJzZSB0aGF0IGNoZWNrIGZvciBhIGNhY2hlIGhpdCBmaXJzdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcmV0dXJuIHtBcnJheXx1bmRlZmluZWR9XG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBoaXQgPSBwYXRoQ2FjaGUuZ2V0KHBhdGgpXG4gIGlmICghaGl0KSB7XG4gICAgaGl0ID0gcGFyc2VQYXRoKHBhdGgpXG4gICAgaWYgKGhpdCkge1xuICAgICAgaGl0LmdldCA9IGV4cG9ydHMuY29tcGlsZUdldHRlcihoaXQpXG4gICAgICBwYXRoQ2FjaGUucHV0KHBhdGgsIGhpdClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhpdFxufVxuXG4vKipcbiAqIEdldCBmcm9tIGFuIG9iamVjdCBmcm9tIGEgcGF0aCBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICovXG5cbmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCkge1xuICBwYXRoID0gZXhwb3J0cy5wYXJzZShwYXRoKVxuICBpZiAocGF0aCkge1xuICAgIHJldHVybiBwYXRoLmdldChvYmopXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgb24gYW4gb2JqZWN0IGZyb20gYSBwYXRoXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmcgfCBBcnJheX0gcGF0aFxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5leHBvcnRzLnNldCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbCkge1xuICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgcGF0aCA9IGV4cG9ydHMucGFyc2UocGF0aClcbiAgfVxuICBpZiAoIXBhdGggfHwgIV8uaXNPYmplY3Qob2JqKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHZhciBsYXN0LCBrZXlcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPCBsOyBpKyspIHtcbiAgICBsYXN0ID0gb2JqXG4gICAga2V5ID0gcGF0aFtpXVxuICAgIG9iaiA9IG9ialtrZXldXG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHtcbiAgICAgIG9iaiA9IHt9XG4gICAgICBsYXN0LiRhZGQoa2V5LCBvYmopXG4gICAgfVxuICB9XG4gIGtleSA9IHBhdGhbaV1cbiAgaWYgKGtleSBpbiBvYmopIHtcbiAgICBvYmpba2V5XSA9IHZhbFxuICB9IGVsc2Uge1xuICAgIG9iai4kYWRkKGtleSwgdmFsKVxuICB9XG4gIHJldHVybiB0cnVlXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciB0ZW1wbGF0ZUNhY2hlID0gbmV3IENhY2hlKDEwMDApXG52YXIgaWRTZWxlY3RvckNhY2hlID0gbmV3IENhY2hlKDEwMDApXG5cbnZhciBtYXAgPSB7XG4gIF9kZWZhdWx0IDogWzAsICcnLCAnJ10sXG4gIGxlZ2VuZCAgIDogWzEsICc8ZmllbGRzZXQ+JywgJzwvZmllbGRzZXQ+J10sXG4gIHRyICAgICAgIDogWzIsICc8dGFibGU+PHRib2R5PicsICc8L3Rib2R5PjwvdGFibGU+J10sXG4gIGNvbCAgICAgIDogW1xuICAgIDIsXG4gICAgJzx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+JyxcbiAgICAnPC9jb2xncm91cD48L3RhYmxlPidcbiAgXVxufVxuXG5tYXAudGQgPVxubWFwLnRoID0gW1xuICAzLFxuICAnPHRhYmxlPjx0Ym9keT48dHI+JyxcbiAgJzwvdHI+PC90Ym9keT48L3RhYmxlPidcbl1cblxubWFwLm9wdGlvbiA9XG5tYXAub3B0Z3JvdXAgPSBbXG4gIDEsXG4gICc8c2VsZWN0IG11bHRpcGxlPVwibXVsdGlwbGVcIj4nLFxuICAnPC9zZWxlY3Q+J1xuXVxuXG5tYXAudGhlYWQgPVxubWFwLnRib2R5ID1cbm1hcC5jb2xncm91cCA9XG5tYXAuY2FwdGlvbiA9XG5tYXAudGZvb3QgPSBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXVxuXG5tYXAuZyA9XG5tYXAuZGVmcyA9XG5tYXAuc3ltYm9sID1cbm1hcC51c2UgPVxubWFwLmltYWdlID1cbm1hcC50ZXh0ID1cbm1hcC5jaXJjbGUgPVxubWFwLmVsbGlwc2UgPVxubWFwLmxpbmUgPVxubWFwLnBhdGggPVxubWFwLnBvbHlnb24gPVxubWFwLnBvbHlsaW5lID1cbm1hcC5yZWN0ID0gW1xuICAxLFxuICAnPHN2ZyAnICtcbiAgICAneG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiICcgK1xuICAgICd4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiAnICtcbiAgICAneG1sbnM6ZXY9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAxL3htbC1ldmVudHNcIicgK1xuICAgICd2ZXJzaW9uPVwiMS4xXCI+JyxcbiAgJzwvc3ZnPidcbl1cblxudmFyIHRhZ1JFID0gLzwoW1xcdzpdKykvXG52YXIgZW50aXR5UkUgPSAvJlxcdys7L1xuXG4vKipcbiAqIENvbnZlcnQgYSBzdHJpbmcgdGVtcGxhdGUgdG8gYSBEb2N1bWVudEZyYWdtZW50LlxuICogRGV0ZXJtaW5lcyBjb3JyZWN0IHdyYXBwaW5nIGJ5IHRhZyB0eXBlcy4gV3JhcHBpbmdcbiAqIHN0cmF0ZWd5IGZvdW5kIGluIGpRdWVyeSAmIGNvbXBvbmVudC9kb21pZnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlU3RyaW5nXG4gKiBAcmV0dXJuIHtEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIHN0cmluZ1RvRnJhZ21lbnQgKHRlbXBsYXRlU3RyaW5nKSB7XG4gIC8vIHRyeSBhIGNhY2hlIGhpdCBmaXJzdFxuICB2YXIgaGl0ID0gdGVtcGxhdGVDYWNoZS5nZXQodGVtcGxhdGVTdHJpbmcpXG4gIGlmIChoaXQpIHtcbiAgICByZXR1cm4gaGl0XG4gIH1cblxuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICB2YXIgdGFnTWF0Y2ggPSB0ZW1wbGF0ZVN0cmluZy5tYXRjaCh0YWdSRSlcbiAgdmFyIGVudGl0eU1hdGNoID0gZW50aXR5UkUudGVzdCh0ZW1wbGF0ZVN0cmluZylcblxuICBpZiAoIXRhZ01hdGNoICYmICFlbnRpdHlNYXRjaCkge1xuICAgIC8vIHRleHQgb25seSwgcmV0dXJuIGEgc2luZ2xlIHRleHQgbm9kZS5cbiAgICBmcmFnLmFwcGVuZENoaWxkKFxuICAgICAgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGVtcGxhdGVTdHJpbmcpXG4gICAgKVxuICB9IGVsc2Uge1xuXG4gICAgdmFyIHRhZyAgICA9IHRhZ01hdGNoICYmIHRhZ01hdGNoWzFdXG4gICAgdmFyIHdyYXAgICA9IG1hcFt0YWddIHx8IG1hcC5fZGVmYXVsdFxuICAgIHZhciBkZXB0aCAgPSB3cmFwWzBdXG4gICAgdmFyIHByZWZpeCA9IHdyYXBbMV1cbiAgICB2YXIgc3VmZml4ID0gd3JhcFsyXVxuICAgIHZhciBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgbm9kZS5pbm5lckhUTUwgPSBwcmVmaXggKyB0ZW1wbGF0ZVN0cmluZy50cmltKCkgKyBzdWZmaXhcbiAgICB3aGlsZSAoZGVwdGgtLSkge1xuICAgICAgbm9kZSA9IG5vZGUubGFzdENoaWxkXG4gICAgfVxuXG4gICAgdmFyIGNoaWxkXG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIHdoaWxlIChjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZClcbiAgICB9XG4gIH1cblxuICB0ZW1wbGF0ZUNhY2hlLnB1dCh0ZW1wbGF0ZVN0cmluZywgZnJhZylcbiAgcmV0dXJuIGZyYWdcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgdGVtcGxhdGUgbm9kZSB0byBhIERvY3VtZW50RnJhZ21lbnQuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmZ1bmN0aW9uIG5vZGVUb0ZyYWdtZW50IChub2RlKSB7XG4gIHZhciB0YWcgPSBub2RlLnRhZ05hbWVcbiAgLy8gaWYgaXRzIGEgdGVtcGxhdGUgdGFnIGFuZCB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdCxcbiAgLy8gaXRzIGNvbnRlbnQgaXMgYWxyZWFkeSBhIGRvY3VtZW50IGZyYWdtZW50LlxuICBpZiAoXG4gICAgdGFnID09PSAnVEVNUExBVEUnICYmXG4gICAgbm9kZS5jb250ZW50IGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudFxuICApIHtcbiAgICByZXR1cm4gbm9kZS5jb250ZW50XG4gIH1cbiAgLy8gc2NyaXB0IHRlbXBsYXRlXG4gIGlmICh0YWcgPT09ICdTQ1JJUFQnKSB7XG4gICAgcmV0dXJuIHN0cmluZ1RvRnJhZ21lbnQobm9kZS50ZXh0Q29udGVudClcbiAgfVxuICAvLyBub3JtYWwgbm9kZSwgY2xvbmUgaXQgdG8gYXZvaWQgbXV0YXRpbmcgdGhlIG9yaWdpbmFsXG4gIHZhciBjbG9uZSA9IGV4cG9ydHMuY2xvbmUobm9kZSlcbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgdmFyIGNoaWxkXG4gIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgd2hpbGUgKGNoaWxkID0gY2xvbmUuZmlyc3RDaGlsZCkge1xuICAgIGZyYWcuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gIH1cbiAgcmV0dXJuIGZyYWdcbn1cblxuLy8gVGVzdCBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSBTYWZhcmkgdGVtcGxhdGUgY2xvbmluZyBidWdcbi8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMzc3NTVcbnZhciBoYXNCcm9rZW5UZW1wbGF0ZSA9IF8uaW5Ccm93c2VyXG4gID8gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGEuaW5uZXJIVE1MID0gJzx0ZW1wbGF0ZT4xPC90ZW1wbGF0ZT4nXG4gICAgICByZXR1cm4gIWEuY2xvbmVOb2RlKHRydWUpLmZpcnN0Q2hpbGQuaW5uZXJIVE1MXG4gICAgfSkoKVxuICA6IGZhbHNlXG5cbi8vIFRlc3QgZm9yIElFMTAvMTEgdGV4dGFyZWEgcGxhY2Vob2xkZXIgY2xvbmUgYnVnXG52YXIgaGFzVGV4dGFyZWFDbG9uZUJ1ZyA9IF8uaW5Ccm93c2VyXG4gID8gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgICAgdC5wbGFjZWhvbGRlciA9ICd0J1xuICAgICAgcmV0dXJuIHQuY2xvbmVOb2RlKHRydWUpLnZhbHVlID09PSAndCdcbiAgICB9KSgpXG4gIDogZmFsc2VcblxuLyoqXG4gKiAxLiBEZWFsIHdpdGggU2FmYXJpIGNsb25pbmcgbmVzdGVkIDx0ZW1wbGF0ZT4gYnVnIGJ5XG4gKiAgICBtYW51YWxseSBjbG9uaW5nIGFsbCB0ZW1wbGF0ZSBpbnN0YW5jZXMuXG4gKiAyLiBEZWFsIHdpdGggSUUxMC8xMSB0ZXh0YXJlYSBwbGFjZWhvbGRlciBidWcgYnkgc2V0dGluZ1xuICogICAgdGhlIGNvcnJlY3QgdmFsdWUgYWZ0ZXIgY2xvbmluZy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudH0gbm9kZVxuICogQHJldHVybiB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fVxuICovXG5cbmV4cG9ydHMuY2xvbmUgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgcmVzID0gbm9kZS5jbG9uZU5vZGUodHJ1ZSlcbiAgdmFyIGksIG9yaWdpbmFsLCBjbG9uZWRcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChoYXNCcm9rZW5UZW1wbGF0ZSkge1xuICAgIG9yaWdpbmFsID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCd0ZW1wbGF0ZScpXG4gICAgaWYgKG9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgY2xvbmVkID0gcmVzLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylcbiAgICAgIGkgPSBjbG9uZWQubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNsb25lZFtpXS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChcbiAgICAgICAgICBvcmlnaW5hbFtpXS5jbG9uZU5vZGUodHJ1ZSksXG4gICAgICAgICAgY2xvbmVkW2ldXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChoYXNUZXh0YXJlYUNsb25lQnVnKSB7XG4gICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgcmVzLnZhbHVlID0gbm9kZS52YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBvcmlnaW5hbCA9IG5vZGUucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKVxuICAgICAgaWYgKG9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgICBjbG9uZWQgPSByZXMucXVlcnlTZWxlY3RvckFsbCgndGV4dGFyZWEnKVxuICAgICAgICBpID0gY2xvbmVkLmxlbmd0aFxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgY2xvbmVkW2ldLnZhbHVlID0gb3JpZ2luYWxbaV0udmFsdWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogUHJvY2VzcyB0aGUgdGVtcGxhdGUgb3B0aW9uIGFuZCBub3JtYWxpemVzIGl0IGludG8gYVxuICogYSBEb2N1bWVudEZyYWdtZW50IHRoYXQgY2FuIGJlIHVzZWQgYXMgYSBwYXJ0aWFsIG9yIGFcbiAqIGluc3RhbmNlIHRlbXBsYXRlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdGVtcGxhdGVcbiAqICAgIFBvc3NpYmxlIHZhbHVlcyBpbmNsdWRlOlxuICogICAgLSBEb2N1bWVudEZyYWdtZW50IG9iamVjdFxuICogICAgLSBOb2RlIG9iamVjdCBvZiB0eXBlIFRlbXBsYXRlXG4gKiAgICAtIGlkIHNlbGVjdG9yOiAnI3NvbWUtdGVtcGxhdGUtaWQnXG4gKiAgICAtIHRlbXBsYXRlIHN0cmluZzogJzxkaXY+PHNwYW4+e3ttc2d9fTwvc3Bhbj48L2Rpdj4nXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNsb25lXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG5vU2VsZWN0b3JcbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR8dW5kZWZpbmVkfVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAodGVtcGxhdGUsIGNsb25lLCBub1NlbGVjdG9yKSB7XG4gIHZhciBub2RlLCBmcmFnXG5cbiAgLy8gaWYgdGhlIHRlbXBsYXRlIGlzIGFscmVhZHkgYSBkb2N1bWVudCBmcmFnbWVudCxcbiAgLy8gZG8gbm90aGluZ1xuICBpZiAodGVtcGxhdGUgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgcmV0dXJuIGNsb25lXG4gICAgICA/IHRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKVxuICAgICAgOiB0ZW1wbGF0ZVxuICB9XG5cbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBpZCBzZWxlY3RvclxuICAgIGlmICghbm9TZWxlY3RvciAmJiB0ZW1wbGF0ZS5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgLy8gaWQgc2VsZWN0b3IgY2FuIGJlIGNhY2hlZCB0b29cbiAgICAgIGZyYWcgPSBpZFNlbGVjdG9yQ2FjaGUuZ2V0KHRlbXBsYXRlKVxuICAgICAgaWYgKCFmcmFnKSB7XG4gICAgICAgIG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZS5zbGljZSgxKSlcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICBmcmFnID0gbm9kZVRvRnJhZ21lbnQobm9kZSlcbiAgICAgICAgICAvLyBzYXZlIHNlbGVjdG9yIHRvIGNhY2hlXG4gICAgICAgICAgaWRTZWxlY3RvckNhY2hlLnB1dCh0ZW1wbGF0ZSwgZnJhZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBub3JtYWwgc3RyaW5nIHRlbXBsYXRlXG4gICAgICBmcmFnID0gc3RyaW5nVG9GcmFnbWVudCh0ZW1wbGF0ZSlcbiAgICB9XG4gIH0gZWxzZSBpZiAodGVtcGxhdGUubm9kZVR5cGUpIHtcbiAgICAvLyBhIGRpcmVjdCBub2RlXG4gICAgZnJhZyA9IG5vZGVUb0ZyYWdtZW50KHRlbXBsYXRlKVxuICB9XG5cbiAgcmV0dXJuIGZyYWcgJiYgY2xvbmVcbiAgICA/IGV4cG9ydHMuY2xvbmUoZnJhZylcbiAgICA6IGZyYWdcbn0iLCJ2YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbnZhciBkaXJQYXJzZXIgPSByZXF1aXJlKCcuL2RpcmVjdGl2ZScpXG52YXIgcmVnZXhFc2NhcGVSRSA9IC9bLS4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2dcbnZhciBjYWNoZSwgdGFnUkUsIGh0bWxSRSwgZmlyc3RDaGFyLCBsYXN0Q2hhclxuXG4vKipcbiAqIEVzY2FwZSBhIHN0cmluZyBzbyBpdCBjYW4gYmUgdXNlZCBpbiBhIFJlZ0V4cFxuICogY29uc3RydWN0b3IuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICovXG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4IChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4RXNjYXBlUkUsICdcXFxcJCYnKVxufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIGludGVycG9sYXRpb24gdGFnIHJlZ2V4LlxuICpcbiAqIEByZXR1cm4ge1JlZ0V4cH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlUmVnZXggKCkge1xuICBjb25maWcuX2RlbGltaXRlcnNDaGFuZ2VkID0gZmFsc2VcbiAgdmFyIG9wZW4gPSBjb25maWcuZGVsaW1pdGVyc1swXVxuICB2YXIgY2xvc2UgPSBjb25maWcuZGVsaW1pdGVyc1sxXVxuICBmaXJzdENoYXIgPSBvcGVuLmNoYXJBdCgwKVxuICBsYXN0Q2hhciA9IGNsb3NlLmNoYXJBdChjbG9zZS5sZW5ndGggLSAxKVxuICB2YXIgZmlyc3RDaGFyUkUgPSBlc2NhcGVSZWdleChmaXJzdENoYXIpXG4gIHZhciBsYXN0Q2hhclJFID0gZXNjYXBlUmVnZXgobGFzdENoYXIpXG4gIHZhciBvcGVuUkUgPSBlc2NhcGVSZWdleChvcGVuKVxuICB2YXIgY2xvc2VSRSA9IGVzY2FwZVJlZ2V4KGNsb3NlKVxuICB0YWdSRSA9IG5ldyBSZWdFeHAoXG4gICAgZmlyc3RDaGFyUkUgKyAnPycgKyBvcGVuUkUgK1xuICAgICcoLis/KScgK1xuICAgIGNsb3NlUkUgKyBsYXN0Q2hhclJFICsgJz8nLFxuICAgICdnJ1xuICApXG4gIGh0bWxSRSA9IG5ldyBSZWdFeHAoXG4gICAgJ14nICsgZmlyc3RDaGFyUkUgKyBvcGVuUkUgK1xuICAgICcuKicgK1xuICAgIGNsb3NlUkUgKyBsYXN0Q2hhclJFICsgJyQnXG4gIClcbiAgLy8gcmVzZXQgY2FjaGVcbiAgY2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbn1cblxuLyoqXG4gKiBQYXJzZSBhIHRlbXBsYXRlIHRleHQgc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgdG9rZW5zLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+IHwgbnVsbH1cbiAqICAgICAgICAgICAgICAgLSB7U3RyaW5nfSB0eXBlXG4gKiAgICAgICAgICAgICAgIC0ge1N0cmluZ30gdmFsdWVcbiAqICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gW2h0bWxdXG4gKiAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IFtvbmVUaW1lXVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAodGV4dCkge1xuICBpZiAoY29uZmlnLl9kZWxpbWl0ZXJzQ2hhbmdlZCkge1xuICAgIGNvbXBpbGVSZWdleCgpXG4gIH1cbiAgdmFyIGhpdCA9IGNhY2hlLmdldCh0ZXh0KVxuICBpZiAoaGl0KSB7XG4gICAgcmV0dXJuIGhpdFxuICB9XG4gIGlmICghdGFnUkUudGVzdCh0ZXh0KSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgdmFyIHRva2VucyA9IFtdXG4gIHZhciBsYXN0SW5kZXggPSB0YWdSRS5sYXN0SW5kZXggPSAwXG4gIHZhciBtYXRjaCwgaW5kZXgsIHZhbHVlLCBmaXJzdCwgb25lVGltZVxuICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gIHdoaWxlIChtYXRjaCA9IHRhZ1JFLmV4ZWModGV4dCkpIHtcbiAgICBpbmRleCA9IG1hdGNoLmluZGV4XG4gICAgLy8gcHVzaCB0ZXh0IHRva2VuXG4gICAgaWYgKGluZGV4ID4gbGFzdEluZGV4KSB7XG4gICAgICB0b2tlbnMucHVzaCh7XG4gICAgICAgIHZhbHVlOiB0ZXh0LnNsaWNlKGxhc3RJbmRleCwgaW5kZXgpXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyB0YWcgdG9rZW5cbiAgICBmaXJzdCA9IG1hdGNoWzFdLmNoYXJDb2RlQXQoMClcbiAgICBvbmVUaW1lID0gZmlyc3QgPT09IDB4MkEgLy8gKlxuICAgIHZhbHVlID0gb25lVGltZVxuICAgICAgPyBtYXRjaFsxXS5zbGljZSgxKVxuICAgICAgOiBtYXRjaFsxXVxuICAgIHRva2Vucy5wdXNoKHtcbiAgICAgIHRhZzogdHJ1ZSxcbiAgICAgIHZhbHVlOiB2YWx1ZS50cmltKCksXG4gICAgICBodG1sOiBodG1sUkUudGVzdChtYXRjaFswXSksXG4gICAgICBvbmVUaW1lOiBvbmVUaW1lXG4gICAgfSlcbiAgICBsYXN0SW5kZXggPSBpbmRleCArIG1hdGNoWzBdLmxlbmd0aFxuICB9XG4gIGlmIChsYXN0SW5kZXggPCB0ZXh0Lmxlbmd0aCkge1xuICAgIHRva2Vucy5wdXNoKHtcbiAgICAgIHZhbHVlOiB0ZXh0LnNsaWNlKGxhc3RJbmRleClcbiAgICB9KVxuICB9XG4gIGNhY2hlLnB1dCh0ZXh0LCB0b2tlbnMpXG4gIHJldHVybiB0b2tlbnNcbn1cblxuLyoqXG4gKiBGb3JtYXQgYSBsaXN0IG9mIHRva2VucyBpbnRvIGFuIGV4cHJlc3Npb24uXG4gKiBlLmcuIHRva2VucyBwYXJzZWQgZnJvbSAnYSB7e2J9fSBjJyBjYW4gYmUgc2VyaWFsaXplZFxuICogaW50byBvbmUgc2luZ2xlIGV4cHJlc3Npb24gYXMgJ1wiYSBcIiArIGIgKyBcIiBjXCInLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHRva2Vuc1xuICogQHBhcmFtIHtWdWV9IFt2bV1cbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLnRva2Vuc1RvRXhwID0gZnVuY3Rpb24gKHRva2Vucywgdm0pIHtcbiAgcmV0dXJuIHRva2Vucy5sZW5ndGggPiAxXG4gICAgPyB0b2tlbnMubWFwKGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICByZXR1cm4gZm9ybWF0VG9rZW4odG9rZW4sIHZtKVxuICAgICAgfSkuam9pbignKycpXG4gICAgOiBmb3JtYXRUb2tlbih0b2tlbnNbMF0sIHZtLCB0cnVlKVxufVxuXG4vKipcbiAqIEZvcm1hdCBhIHNpbmdsZSB0b2tlbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdG9rZW5cbiAqIEBwYXJhbSB7VnVlfSBbdm1dXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHNpbmdsZVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIGZvcm1hdFRva2VuICh0b2tlbiwgdm0sIHNpbmdsZSkge1xuICByZXR1cm4gdG9rZW4udGFnXG4gICAgPyB2bSAmJiB0b2tlbi5vbmVUaW1lXG4gICAgICA/ICdcIicgKyB2bS4kZXZhbCh0b2tlbi52YWx1ZSkgKyAnXCInXG4gICAgICA6IGlubGluZUZpbHRlcnModG9rZW4udmFsdWUsIHNpbmdsZSlcbiAgICA6ICdcIicgKyB0b2tlbi52YWx1ZSArICdcIidcbn1cblxuLyoqXG4gKiBGb3IgYW4gYXR0cmlidXRlIHdpdGggbXVsdGlwbGUgaW50ZXJwb2xhdGlvbiB0YWdzLFxuICogZS5nLiBhdHRyPVwic29tZS17e3RoaW5nIHwgZmlsdGVyfX1cIiwgaW4gb3JkZXIgdG8gY29tYmluZVxuICogdGhlIHdob2xlIHRoaW5nIGludG8gYSBzaW5nbGUgd2F0Y2hhYmxlIGV4cHJlc3Npb24sIHdlXG4gKiBoYXZlIHRvIGlubGluZSB0aG9zZSBmaWx0ZXJzLiBUaGlzIGZ1bmN0aW9uIGRvZXMgZXhhY3RseVxuICogdGhhdC4gVGhpcyBpcyBhIGJpdCBoYWNreSBidXQgaXQgYXZvaWRzIGhlYXZ5IGNoYW5nZXNcbiAqIHRvIGRpcmVjdGl2ZSBwYXJzZXIgYW5kIHdhdGNoZXIgbWVjaGFuaXNtLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2luZ2xlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGZpbHRlclJFID0gL1tefF1cXHxbXnxdL1xuZnVuY3Rpb24gaW5saW5lRmlsdGVycyAoZXhwLCBzaW5nbGUpIHtcbiAgaWYgKCFmaWx0ZXJSRS50ZXN0KGV4cCkpIHtcbiAgICByZXR1cm4gc2luZ2xlXG4gICAgICA/IGV4cFxuICAgICAgOiAnKCcgKyBleHAgKyAnKSdcbiAgfSBlbHNlIHtcbiAgICB2YXIgZGlyID0gZGlyUGFyc2VyLnBhcnNlKGV4cClbMF1cbiAgICBpZiAoIWRpci5maWx0ZXJzKSB7XG4gICAgICByZXR1cm4gJygnICsgZXhwICsgJyknXG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cCA9IGRpci5leHByZXNzaW9uXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGRpci5maWx0ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIgZmlsdGVyID0gZGlyLmZpbHRlcnNbaV1cbiAgICAgICAgdmFyIGFyZ3MgPSBmaWx0ZXIuYXJnc1xuICAgICAgICAgID8gJyxcIicgKyBmaWx0ZXIuYXJncy5qb2luKCdcIixcIicpICsgJ1wiJ1xuICAgICAgICAgIDogJydcbiAgICAgICAgZXhwID0gJ3RoaXMuX2FwcGx5RmlsdGVyKFwiJyArIGZpbHRlci5uYW1lICsgJ1wiLFsnICsgZXhwICsgYXJncyArICddKSdcbiAgICAgIH1cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGFkZENsYXNzID0gXy5hZGRDbGFzc1xudmFyIHJlbW92ZUNsYXNzID0gXy5yZW1vdmVDbGFzc1xudmFyIHRyYW5zRHVyYXRpb25Qcm9wID0gXy50cmFuc2l0aW9uUHJvcCArICdEdXJhdGlvbidcbnZhciBhbmltRHVyYXRpb25Qcm9wID0gXy5hbmltYXRpb25Qcm9wICsgJ0R1cmF0aW9uJ1xuXG52YXIgcXVldWUgPSBbXVxudmFyIHF1ZXVlZCA9IGZhbHNlXG5cbi8qKlxuICogUHVzaCBhIGpvYiBpbnRvIHRoZSB0cmFuc2l0aW9uIHF1ZXVlLCB3aGljaCBpcyB0byBiZVxuICogZXhlY3V0ZWQgb24gbmV4dCBmcmFtZS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsICAgIC0gdGFyZ2V0IGVsZW1lbnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXIgICAgLSAxOiBlbnRlciwgLTE6IGxlYXZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcCAgIC0gdGhlIGFjdHVhbCBkb20gb3BlcmF0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xzICAgIC0gdGhlIGNsYXNzTmFtZSB0byByZW1vdmUgd2hlbiB0aGVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uIGlzIGRvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdIC0gdXNlciBzdXBwbGllZCBjYWxsYmFjay5cbiAqL1xuXG5mdW5jdGlvbiBwdXNoIChlbCwgZGlyLCBvcCwgY2xzLCBjYikge1xuICBxdWV1ZS5wdXNoKHtcbiAgICBlbCAgOiBlbCxcbiAgICBkaXIgOiBkaXIsXG4gICAgY2IgIDogY2IsXG4gICAgY2xzIDogY2xzLFxuICAgIG9wICA6IG9wXG4gIH0pXG4gIGlmICghcXVldWVkKSB7XG4gICAgcXVldWVkID0gdHJ1ZVxuICAgIF8ubmV4dFRpY2soZmx1c2gpXG4gIH1cbn1cblxuLyoqXG4gKiBGbHVzaCB0aGUgcXVldWUsIGFuZCBkbyBvbmUgZm9yY2VkIHJlZmxvdyBiZWZvcmVcbiAqIHRyaWdnZXJpbmcgdHJhbnNpdGlvbnMuXG4gKi9cblxuZnVuY3Rpb24gZmx1c2ggKCkge1xuICB2YXIgZiA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgcXVldWUuZm9yRWFjaChydW4pXG4gIHF1ZXVlID0gW11cbiAgcXVldWVkID0gZmFsc2VcbiAgLyogZHVtbXkgcmV0dXJuLCBzbyBqcyBsaW50ZXJzIGRvbid0IGNvbXBsYWluIGFib3V0IHVudXNlZCB2YXJpYWJsZSBmICovXG4gIHJldHVybiBmXG59XG5cbi8qKlxuICogUnVuIGEgdHJhbnNpdGlvbiBqb2IuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGpvYlxuICovXG5cbmZ1bmN0aW9uIHJ1biAoam9iKSB7XG5cbiAgdmFyIGVsID0gam9iLmVsXG4gIHZhciBkYXRhID0gZWwuX192X3RyYW5zXG4gIHZhciBjbHMgPSBqb2IuY2xzXG4gIHZhciBjYiA9IGpvYi5jYlxuICB2YXIgb3AgPSBqb2Iub3BcbiAgdmFyIHRyYW5zaXRpb25UeXBlID0gZ2V0VHJhbnNpdGlvblR5cGUoZWwsIGRhdGEsIGNscylcblxuICBpZiAoam9iLmRpciA+IDApIHsgLy8gRU5URVJcbiAgICBpZiAodHJhbnNpdGlvblR5cGUgPT09IDEpIHtcbiAgICAgIC8vIHRyaWdnZXIgdHJhbnNpdGlvbiBieSByZW1vdmluZyBlbnRlciBjbGFzc1xuICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIC8vIG9ubHkgbmVlZCB0byBsaXN0ZW4gZm9yIHRyYW5zaXRpb25lbmQgaWYgdGhlcmUnc1xuICAgICAgLy8gYSB1c2VyIGNhbGxiYWNrXG4gICAgICBpZiAoY2IpIHNldHVwVHJhbnNpdGlvbkNiKF8udHJhbnNpdGlvbkVuZEV2ZW50KVxuICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvblR5cGUgPT09IDIpIHtcbiAgICAgIC8vIGFuaW1hdGlvbnMgYXJlIHRyaWdnZXJlZCB3aGVuIGNsYXNzIGlzIGFkZGVkXG4gICAgICAvLyBzbyB3ZSBqdXN0IGxpc3RlbiBmb3IgYW5pbWF0aW9uZW5kIHRvIHJlbW92ZSBpdC5cbiAgICAgIHNldHVwVHJhbnNpdGlvbkNiKF8uYW5pbWF0aW9uRW5kRXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vIHRyYW5zaXRpb24gYXBwbGljYWJsZVxuICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIGlmIChjYikgY2IoKVxuICAgIH1cbiAgfSBlbHNlIHsgLy8gTEVBVkVcbiAgICBpZiAodHJhbnNpdGlvblR5cGUpIHtcbiAgICAgIC8vIGxlYXZlIHRyYW5zaXRpb25zL2FuaW1hdGlvbnMgYXJlIGJvdGggdHJpZ2dlcmVkXG4gICAgICAvLyBieSBhZGRpbmcgdGhlIGNsYXNzLCBqdXN0IHJlbW92ZSBpdCBvbiBlbmQgZXZlbnQuXG4gICAgICB2YXIgZXZlbnQgPSB0cmFuc2l0aW9uVHlwZSA9PT0gMVxuICAgICAgICA/IF8udHJhbnNpdGlvbkVuZEV2ZW50XG4gICAgICAgIDogXy5hbmltYXRpb25FbmRFdmVudFxuICAgICAgc2V0dXBUcmFuc2l0aW9uQ2IoZXZlbnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb3AoKVxuICAgICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgb3AoKVxuICAgICAgcmVtb3ZlQ2xhc3MoZWwsIGNscylcbiAgICAgIGlmIChjYikgY2IoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdXAgYSB0cmFuc2l0aW9uIGVuZCBjYWxsYmFjaywgc3RvcmUgdGhlIGNhbGxiYWNrXG4gICAqIG9uIHRoZSBlbGVtZW50J3MgX192X3RyYW5zIGRhdGEgb2JqZWN0LCBzbyB3ZSBjYW5cbiAgICogY2xlYW4gaXQgdXAgaWYgYW5vdGhlciB0cmFuc2l0aW9uIGlzIHRyaWdnZXJlZCBiZWZvcmVcbiAgICogdGhlIGNhbGxiYWNrIGlzIGZpcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NsZWFudXBGbl1cbiAgICovXG5cbiAgZnVuY3Rpb24gc2V0dXBUcmFuc2l0aW9uQ2IgKGV2ZW50LCBjbGVhbnVwRm4pIHtcbiAgICBkYXRhLmV2ZW50ID0gZXZlbnRcbiAgICB2YXIgb25FbmQgPSBkYXRhLmNhbGxiYWNrID0gZnVuY3Rpb24gdHJhbnNpdGlvbkNiIChlKSB7XG4gICAgICBpZiAoZS50YXJnZXQgPT09IGVsKSB7XG4gICAgICAgIF8ub2ZmKGVsLCBldmVudCwgb25FbmQpXG4gICAgICAgIGRhdGEuZXZlbnQgPSBkYXRhLmNhbGxiYWNrID0gbnVsbFxuICAgICAgICBpZiAoY2xlYW51cEZuKSBjbGVhbnVwRm4oKVxuICAgICAgICBpZiAoY2IpIGNiKClcbiAgICAgIH1cbiAgICB9XG4gICAgXy5vbihlbCwgZXZlbnQsIG9uRW5kKVxuICB9XG59XG5cbi8qKlxuICogR2V0IGFuIGVsZW1lbnQncyB0cmFuc2l0aW9uIHR5cGUgYmFzZWQgb24gdGhlXG4gKiBjYWxjdWxhdGVkIHN0eWxlc1xuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiAgICAgICAgIDEgLSB0cmFuc2l0aW9uXG4gKiAgICAgICAgIDIgLSBhbmltYXRpb25cbiAqL1xuXG5mdW5jdGlvbiBnZXRUcmFuc2l0aW9uVHlwZSAoZWwsIGRhdGEsIGNsYXNzTmFtZSkge1xuICB2YXIgdHlwZSA9IGRhdGEuY2FjaGUgJiYgZGF0YS5jYWNoZVtjbGFzc05hbWVdXG4gIGlmICh0eXBlKSByZXR1cm4gdHlwZVxuICB2YXIgaW5saW5lU3R5bGVzID0gZWwuc3R5bGVcbiAgdmFyIGNvbXB1dGVkU3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpXG4gIHZhciB0cmFuc0R1cmF0aW9uID1cbiAgICBpbmxpbmVTdHlsZXNbdHJhbnNEdXJhdGlvblByb3BdIHx8XG4gICAgY29tcHV0ZWRTdHlsZXNbdHJhbnNEdXJhdGlvblByb3BdXG4gIGlmICh0cmFuc0R1cmF0aW9uICYmIHRyYW5zRHVyYXRpb24gIT09ICcwcycpIHtcbiAgICB0eXBlID0gMVxuICB9IGVsc2Uge1xuICAgIHZhciBhbmltRHVyYXRpb24gPVxuICAgICAgaW5saW5lU3R5bGVzW2FuaW1EdXJhdGlvblByb3BdIHx8XG4gICAgICBjb21wdXRlZFN0eWxlc1thbmltRHVyYXRpb25Qcm9wXVxuICAgIGlmIChhbmltRHVyYXRpb24gJiYgYW5pbUR1cmF0aW9uICE9PSAnMHMnKSB7XG4gICAgICB0eXBlID0gMlxuICAgIH1cbiAgfVxuICBpZiAodHlwZSkge1xuICAgIGlmICghZGF0YS5jYWNoZSkgZGF0YS5jYWNoZSA9IHt9XG4gICAgZGF0YS5jYWNoZVtjbGFzc05hbWVdID0gdHlwZVxuICB9XG4gIHJldHVybiB0eXBlXG59XG5cbi8qKlxuICogQXBwbHkgQ1NTIHRyYW5zaXRpb24gdG8gYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge051bWJlcn0gZGlyZWN0aW9uIC0gMTogZW50ZXIsIC0xOiBsZWF2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AgLSB0aGUgYWN0dWFsIERPTSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gdGFyZ2V0IGVsZW1lbnQncyB0cmFuc2l0aW9uIGRhdGFcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbCwgZGlyZWN0aW9uLCBvcCwgZGF0YSwgY2IpIHtcbiAgdmFyIHByZWZpeCA9IGRhdGEuaWQgfHwgJ3YnXG4gIHZhciBlbnRlckNsYXNzID0gcHJlZml4ICsgJy1lbnRlcidcbiAgdmFyIGxlYXZlQ2xhc3MgPSBwcmVmaXggKyAnLWxlYXZlJ1xuICAvLyBjbGVhbiB1cCBwb3RlbnRpYWwgcHJldmlvdXMgdW5maW5pc2hlZCB0cmFuc2l0aW9uXG4gIGlmIChkYXRhLmNhbGxiYWNrKSB7XG4gICAgXy5vZmYoZWwsIGRhdGEuZXZlbnQsIGRhdGEuY2FsbGJhY2spXG4gICAgcmVtb3ZlQ2xhc3MoZWwsIGVudGVyQ2xhc3MpXG4gICAgcmVtb3ZlQ2xhc3MoZWwsIGxlYXZlQ2xhc3MpXG4gICAgZGF0YS5ldmVudCA9IGRhdGEuY2FsbGJhY2sgPSBudWxsXG4gIH1cbiAgaWYgKGRpcmVjdGlvbiA+IDApIHsgLy8gZW50ZXJcbiAgICBhZGRDbGFzcyhlbCwgZW50ZXJDbGFzcylcbiAgICBvcCgpXG4gICAgcHVzaChlbCwgZGlyZWN0aW9uLCBudWxsLCBlbnRlckNsYXNzLCBjYilcbiAgfSBlbHNlIHsgLy8gbGVhdmVcbiAgICBhZGRDbGFzcyhlbCwgbGVhdmVDbGFzcylcbiAgICBwdXNoKGVsLCBkaXJlY3Rpb24sIG9wLCBsZWF2ZUNsYXNzLCBjYilcbiAgfVxufVxuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBhcHBseUNTU1RyYW5zaXRpb24gPSByZXF1aXJlKCcuL2NzcycpXG52YXIgYXBwbHlKU1RyYW5zaXRpb24gPSByZXF1aXJlKCcuL2pzJylcbnZhciBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IGRvY3VtZW50XG5cbi8qKlxuICogQXBwZW5kIHdpdGggdHJhbnNpdGlvbi5cbiAqXG4gKiBAb2FyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZXhwb3J0cy5hcHBlbmQgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIGFwcGx5KGVsLCAxLCBmdW5jdGlvbiAoKSB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsKVxuICB9LCB2bSwgY2IpXG59XG5cbi8qKlxuICogSW5zZXJ0QmVmb3JlIHdpdGggdHJhbnNpdGlvbi5cbiAqXG4gKiBAb2FyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZXhwb3J0cy5iZWZvcmUgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIGFwcGx5KGVsLCAxLCBmdW5jdGlvbiAoKSB7XG4gICAgXy5iZWZvcmUoZWwsIHRhcmdldClcbiAgfSwgdm0sIGNiKVxufVxuXG4vKipcbiAqIFJlbW92ZSB3aXRoIHRyYW5zaXRpb24uXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZXhwb3J0cy5yZW1vdmUgPSBmdW5jdGlvbiAoZWwsIHZtLCBjYikge1xuICBhcHBseShlbCwgLTEsIGZ1bmN0aW9uICgpIHtcbiAgICBfLnJlbW92ZShlbClcbiAgfSwgdm0sIGNiKVxufVxuXG4vKipcbiAqIFJlbW92ZSBieSBhcHBlbmRpbmcgdG8gYW5vdGhlciBwYXJlbnQgd2l0aCB0cmFuc2l0aW9uLlxuICogVGhpcyBpcyBvbmx5IHVzZWQgaW4gYmxvY2sgb3BlcmF0aW9ucy5cbiAqXG4gKiBAb2FyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZXhwb3J0cy5yZW1vdmVUaGVuQXBwZW5kID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQsIHZtLCBjYikge1xuICBhcHBseShlbCwgLTEsIGZ1bmN0aW9uICgpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpXG4gIH0sIHZtLCBjYilcbn1cblxuLyoqXG4gKiBBcHBlbmQgdGhlIGNoaWxkTm9kZXMgb2YgYSBmcmFnbWVudCB0byB0YXJnZXQuXG4gKlxuICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSBibG9ja1xuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbmV4cG9ydHMuYmxvY2tBcHBlbmQgPSBmdW5jdGlvbiAoYmxvY2ssIHRhcmdldCwgdm0pIHtcbiAgdmFyIG5vZGVzID0gXy50b0FycmF5KGJsb2NrLmNoaWxkTm9kZXMpXG4gIGZvciAodmFyIGkgPSAwLCBsID0gbm9kZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZXhwb3J0cy5iZWZvcmUobm9kZXNbaV0sIHRhcmdldCwgdm0pXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBibG9jayBvZiBub2RlcyBiZXR3ZWVuIHR3byBlZGdlIG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gc3RhcnRcbiAqIEBwYXJhbSB7Tm9kZX0gZW5kXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqL1xuXG5leHBvcnRzLmJsb2NrUmVtb3ZlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQsIHZtKSB7XG4gIHZhciBub2RlID0gc3RhcnQubmV4dFNpYmxpbmdcbiAgdmFyIG5leHRcbiAgd2hpbGUgKG5vZGUgIT09IGVuZCkge1xuICAgIG5leHQgPSBub2RlLm5leHRTaWJsaW5nXG4gICAgZXhwb3J0cy5yZW1vdmUobm9kZSwgdm0pXG4gICAgbm9kZSA9IG5leHRcbiAgfVxufVxuXG4vKipcbiAqIEFwcGx5IHRyYW5zaXRpb25zIHdpdGggYW4gb3BlcmF0aW9uIGNhbGxiYWNrLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXJlY3Rpb25cbiAqICAgICAgICAgICAgICAgICAgMTogZW50ZXJcbiAqICAgICAgICAgICAgICAgICAtMTogbGVhdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wIC0gdGhlIGFjdHVhbCBET00gb3BlcmF0aW9uXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG52YXIgYXBwbHkgPSBleHBvcnRzLmFwcGx5ID0gZnVuY3Rpb24gKGVsLCBkaXJlY3Rpb24sIG9wLCB2bSwgY2IpIHtcbiAgdmFyIHRyYW5zRGF0YSA9IGVsLl9fdl90cmFuc1xuICBpZiAoXG4gICAgIXRyYW5zRGF0YSB8fFxuICAgICF2bS5faXNDb21waWxlZCB8fFxuICAgIC8vIGlmIHRoZSB2bSBpcyBiZWluZyBtYW5pcHVsYXRlZCBieSBhIHBhcmVudCBkaXJlY3RpdmVcbiAgICAvLyBkdXJpbmcgdGhlIHBhcmVudCdzIGNvbXBpbGF0aW9uIHBoYXNlLCBza2lwIHRoZVxuICAgIC8vIGFuaW1hdGlvbi5cbiAgICAodm0uJHBhcmVudCAmJiAhdm0uJHBhcmVudC5faXNDb21waWxlZClcbiAgKSB7XG4gICAgb3AoKVxuICAgIGlmIChjYikgY2IoKVxuICAgIHJldHVyblxuICB9XG4gIC8vIGRldGVybWluZSB0aGUgdHJhbnNpdGlvbiB0eXBlIG9uIHRoZSBlbGVtZW50XG4gIHZhciBqc1RyYW5zaXRpb24gPSB0cmFuc0RhdGEuZm5zXG4gIGlmIChqc1RyYW5zaXRpb24pIHtcbiAgICAvLyBqc1xuICAgIGFwcGx5SlNUcmFuc2l0aW9uKFxuICAgICAgZWwsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBvcCxcbiAgICAgIHRyYW5zRGF0YSxcbiAgICAgIGpzVHJhbnNpdGlvbixcbiAgICAgIHZtLFxuICAgICAgY2JcbiAgICApXG4gIH0gZWxzZSBpZiAoXG4gICAgXy50cmFuc2l0aW9uRW5kRXZlbnQgJiZcbiAgICAvLyBza2lwIENTUyB0cmFuc2l0aW9ucyBpZiBwYWdlIGlzIG5vdCB2aXNpYmxlIC1cbiAgICAvLyB0aGlzIHNvbHZlcyB0aGUgaXNzdWUgb2YgdHJhbnNpdGlvbmVuZCBldmVudHMgbm90XG4gICAgLy8gZmlyaW5nIHVudGlsIHRoZSBwYWdlIGlzIHZpc2libGUgYWdhaW4uXG4gICAgLy8gcGFnZVZpc2liaWxpdHkgQVBJIGlzIHN1cHBvcnRlZCBpbiBJRTEwKywgc2FtZSBhc1xuICAgIC8vIENTUyB0cmFuc2l0aW9ucy5cbiAgICAhKGRvYyAmJiBkb2MuaGlkZGVuKVxuICApIHtcbiAgICAvLyBjc3NcbiAgICBhcHBseUNTU1RyYW5zaXRpb24oXG4gICAgICBlbCxcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIG9wLFxuICAgICAgdHJhbnNEYXRhLFxuICAgICAgY2JcbiAgICApXG4gIH0gZWxzZSB7XG4gICAgLy8gbm90IGFwcGxpY2FibGVcbiAgICBvcCgpXG4gICAgaWYgKGNiKSBjYigpXG4gIH1cbn0iLCIvKipcbiAqIEFwcGx5IEphdmFTY3JpcHQgZW50ZXIvbGVhdmUgZnVuY3Rpb25zLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXJlY3Rpb24gLSAxOiBlbnRlciwgLTE6IGxlYXZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcCAtIHRoZSBhY3R1YWwgRE9NIG9wZXJhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSB0YXJnZXQgZWxlbWVudCdzIHRyYW5zaXRpb24gZGF0YVxuICogQHBhcmFtIHtPYmplY3R9IGRlZiAtIHRyYW5zaXRpb24gZGVmaW5pdGlvbiBvYmplY3RcbiAqIEBwYXJhbSB7VnVlfSB2bSAtIHRoZSBvd25lciB2bSBvZiB0aGUgZWxlbWVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsLCBkaXJlY3Rpb24sIG9wLCBkYXRhLCBkZWYsIHZtLCBjYikge1xuICAvLyBpZiB0aGUgZWxlbWVudCBpcyB0aGUgcm9vdCBvZiBhbiBpbnN0YW5jZSxcbiAgLy8gdXNlIHRoYXQgaW5zdGFuY2UgYXMgdGhlIHRyYW5zaXRpb24gZnVuY3Rpb24gY29udGV4dFxuICB2bSA9IGVsLl9fdnVlX18gfHwgdm1cbiAgaWYgKGRhdGEuY2FuY2VsKSB7XG4gICAgZGF0YS5jYW5jZWwoKVxuICAgIGRhdGEuY2FuY2VsID0gbnVsbFxuICB9XG4gIGlmIChkaXJlY3Rpb24gPiAwKSB7IC8vIGVudGVyXG4gICAgaWYgKGRlZi5iZWZvcmVFbnRlcikge1xuICAgICAgZGVmLmJlZm9yZUVudGVyLmNhbGwodm0sIGVsKVxuICAgIH1cbiAgICBvcCgpXG4gICAgaWYgKGRlZi5lbnRlcikge1xuICAgICAgZGF0YS5jYW5jZWwgPSBkZWYuZW50ZXIuY2FsbCh2bSwgZWwsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGF0YS5jYW5jZWwgPSBudWxsXG4gICAgICAgIGlmIChjYikgY2IoKVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGNiKSB7XG4gICAgICBjYigpXG4gICAgfVxuICB9IGVsc2UgeyAvLyBsZWF2ZVxuICAgIGlmIChkZWYubGVhdmUpIHtcbiAgICAgIGRhdGEuY2FuY2VsID0gZGVmLmxlYXZlLmNhbGwodm0sIGVsLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRhdGEuY2FuY2VsID0gbnVsbFxuICAgICAgICBvcCgpXG4gICAgICAgIGlmIChjYikgY2IoKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgb3AoKVxuICAgICAgaWYgKGNiKSBjYigpXG4gICAgfVxuICB9XG59IiwidmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG5cbi8qKlxuICogRW5hYmxlIGRlYnVnIHV0aWxpdGllcy4gVGhlIGVuYWJsZURlYnVnKCkgZnVuY3Rpb24gYW5kXG4gKiBhbGwgXy5sb2coKSAmIF8ud2FybigpIGNhbGxzIHdpbGwgYmUgZHJvcHBlZCBpbiB0aGVcbiAqIG1pbmlmaWVkIHByb2R1Y3Rpb24gYnVpbGQuXG4gKi9cblxuZW5hYmxlRGVidWcoKVxuXG5mdW5jdGlvbiBlbmFibGVEZWJ1ZyAoKSB7XG5cbiAgdmFyIGhhc0NvbnNvbGUgPSB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCdcbiAgXG4gIC8qKlxuICAgKiBMb2cgYSBtZXNzYWdlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbXNnXG4gICAqL1xuXG4gIGV4cG9ydHMubG9nID0gZnVuY3Rpb24gKG1zZykge1xuICAgIGlmIChoYXNDb25zb2xlICYmIGNvbmZpZy5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coJ1tWdWUgaW5mb106ICcgKyBtc2cpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdlJ3ZlIGdvdCBhIHByb2JsZW0gaGVyZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZ1xuICAgKi9cblxuICBleHBvcnRzLndhcm4gPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgaWYgKGhhc0NvbnNvbGUgJiYgKCFjb25maWcuc2lsZW50IHx8IGNvbmZpZy5kZWJ1ZykpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1Z1ZSB3YXJuXTogJyArIG1zZylcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgaWYgKGNvbmZpZy5kZWJ1Zykge1xuICAgICAgICAvKiBqc2hpbnQgZGVidWc6IHRydWUgKi9cbiAgICAgICAgZGVidWdnZXJcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IGFzc2V0IGV4aXN0c1xuICAgKi9cblxuICBleHBvcnRzLmFzc2VydEFzc2V0ID0gZnVuY3Rpb24gKHZhbCwgdHlwZSwgaWQpIHtcbiAgICBpZiAoIXZhbCkge1xuICAgICAgZXhwb3J0cy53YXJuKCdGYWlsZWQgdG8gcmVzb2x2ZSAnICsgdHlwZSArICc6ICcgKyBpZClcbiAgICB9XG4gIH1cbn0iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxuLyoqXG4gKiBDaGVjayBpZiBhIG5vZGUgaXMgaW4gdGhlIGRvY3VtZW50LlxuICogTm90ZTogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNvbnRhaW5zIHNob3VsZCB3b3JrIGhlcmVcbiAqIGJ1dCBhbHdheXMgcmV0dXJucyBmYWxzZSBmb3IgY29tbWVudCBub2RlcyBpbiBwaGFudG9tanMsXG4gKiBtYWtpbmcgdW5pdCB0ZXN0cyBkaWZmaWN1bHQuIFRoaXMgaXMgZml4ZWQgYnl5IGRvaW5nIHRoZVxuICogY29udGFpbnMoKSBjaGVjayBvbiB0aGUgbm9kZSdzIHBhcmVudE5vZGUgaW5zdGVhZCBvZlxuICogdGhlIG5vZGUgaXRzZWxmLlxuICpcbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG52YXIgZG9jID1cbiAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJlxuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRcblxuZXhwb3J0cy5pbkRvYyA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIHZhciBwYXJlbnQgPSBub2RlICYmIG5vZGUucGFyZW50Tm9kZVxuICByZXR1cm4gZG9jID09PSBub2RlIHx8XG4gICAgZG9jID09PSBwYXJlbnQgfHxcbiAgICAhIShwYXJlbnQgJiYgcGFyZW50Lm5vZGVUeXBlID09PSAxICYmIChkb2MuY29udGFpbnMocGFyZW50KSkpXG59XG5cbi8qKlxuICogRXh0cmFjdCBhbiBhdHRyaWJ1dGUgZnJvbSBhIG5vZGUuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge1N0cmluZ30gYXR0clxuICovXG5cbmV4cG9ydHMuYXR0ciA9IGZ1bmN0aW9uIChub2RlLCBhdHRyKSB7XG4gIGF0dHIgPSBjb25maWcucHJlZml4ICsgYXR0clxuICB2YXIgdmFsID0gbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cilcbiAgaWYgKHZhbCAhPT0gbnVsbCkge1xuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIpXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG4vKipcbiAqIEluc2VydCBlbCBiZWZvcmUgdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqL1xuXG5leHBvcnRzLmJlZm9yZSA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0KSB7XG4gIHRhcmdldC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbCwgdGFyZ2V0KVxufVxuXG4vKipcbiAqIEluc2VydCBlbCBhZnRlciB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICovXG5cbmV4cG9ydHMuYWZ0ZXIgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCkge1xuICBpZiAodGFyZ2V0Lm5leHRTaWJsaW5nKSB7XG4gICAgZXhwb3J0cy5iZWZvcmUoZWwsIHRhcmdldC5uZXh0U2libGluZylcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChlbClcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBlbCBmcm9tIERPTVxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqL1xuXG5leHBvcnRzLnJlbW92ZSA9IGZ1bmN0aW9uIChlbCkge1xuICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKVxufVxuXG4vKipcbiAqIFByZXBlbmQgZWwgdG8gdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqL1xuXG5leHBvcnRzLnByZXBlbmQgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCkge1xuICBpZiAodGFyZ2V0LmZpcnN0Q2hpbGQpIHtcbiAgICBleHBvcnRzLmJlZm9yZShlbCwgdGFyZ2V0LmZpcnN0Q2hpbGQpXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsKVxuICB9XG59XG5cbi8qKlxuICogUmVwbGFjZSB0YXJnZXQgd2l0aCBlbFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKi9cblxuZXhwb3J0cy5yZXBsYWNlID0gZnVuY3Rpb24gKHRhcmdldCwgZWwpIHtcbiAgdmFyIHBhcmVudCA9IHRhcmdldC5wYXJlbnROb2RlXG4gIGlmIChwYXJlbnQpIHtcbiAgICBwYXJlbnQucmVwbGFjZUNoaWxkKGVsLCB0YXJnZXQpXG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgZXZlbnQgbGlzdGVuZXIgc2hvcnRoYW5kLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5leHBvcnRzLm9uID0gZnVuY3Rpb24gKGVsLCBldmVudCwgY2IpIHtcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVyIHNob3J0aGFuZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxuZXhwb3J0cy5vZmYgPSBmdW5jdGlvbiAoZWwsIGV2ZW50LCBjYikge1xuICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBjYilcbn1cblxuLyoqXG4gKiBBZGQgY2xhc3Mgd2l0aCBjb21wYXRpYmlsaXR5IGZvciBJRSAmIFNWR1xuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3Ryb25nfSBjbHNcbiAqL1xuXG5leHBvcnRzLmFkZENsYXNzID0gZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKVxuICB9IGVsc2Uge1xuICAgIHZhciBjdXIgPSAnICcgKyAoZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnKSArICcgJ1xuICAgIGlmIChjdXIuaW5kZXhPZignICcgKyBjbHMgKyAnICcpIDwgMCkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIChjdXIgKyBjbHMpLnRyaW0oKSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgY2xhc3Mgd2l0aCBjb21wYXRpYmlsaXR5IGZvciBJRSAmIFNWR1xuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3Ryb25nfSBjbHNcbiAqL1xuXG5leHBvcnRzLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xzKVxuICB9IGVsc2Uge1xuICAgIHZhciBjdXIgPSAnICcgKyAoZWwuZ2V0QXR0cmlidXRlKCdjbGFzcycpIHx8ICcnKSArICcgJ1xuICAgIHZhciB0YXIgPSAnICcgKyBjbHMgKyAnICdcbiAgICB3aGlsZSAoY3VyLmluZGV4T2YodGFyKSA+PSAwKSB7XG4gICAgICBjdXIgPSBjdXIucmVwbGFjZSh0YXIsICcgJylcbiAgICB9XG4gICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIGN1ci50cmltKCkpXG4gIH1cbn1cblxuLyoqXG4gKiBFeHRyYWN0IHJhdyBjb250ZW50IGluc2lkZSBhbiBlbGVtZW50IGludG8gYSB0ZW1wb3JhcnlcbiAqIGNvbnRhaW5lciBkaXZcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGFzRnJhZ21lbnRcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cblxuZXhwb3J0cy5leHRyYWN0Q29udGVudCA9IGZ1bmN0aW9uIChlbCwgYXNGcmFnbWVudCkge1xuICB2YXIgY2hpbGRcbiAgdmFyIHJhd0NvbnRlbnRcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gIGlmIChcbiAgICBlbC50YWdOYW1lID09PSAnVEVNUExBVEUnICYmXG4gICAgZWwuY29udGVudCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnRcbiAgKSB7XG4gICAgZWwgPSBlbC5jb250ZW50XG4gIH1cbiAgaWYgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgIHJhd0NvbnRlbnQgPSBhc0ZyYWdtZW50XG4gICAgICA/IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICB3aGlsZSAoY2hpbGQgPSBlbC5maXJzdENoaWxkKSB7XG4gICAgICByYXdDb250ZW50LmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmF3Q29udGVudFxufVxuIiwiLyoqXG4gKiBDYW4gd2UgdXNlIF9fcHJvdG9fXz9cbiAqXG4gKiBAdHlwZSB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmhhc1Byb3RvID0gJ19fcHJvdG9fXycgaW4ge31cblxuLyoqXG4gKiBJbmRpY2F0ZXMgd2UgaGF2ZSBhIHdpbmRvd1xuICpcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbnZhciBpbkJyb3dzZXIgPSBleHBvcnRzLmluQnJvd3NlciA9XG4gIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gIHRvU3RyaW5nLmNhbGwod2luZG93KSAhPT0gJ1tvYmplY3QgT2JqZWN0XSdcblxuLyoqXG4gKiBEZWZlciBhIHRhc2sgdG8gZXhlY3V0ZSBpdCBhc3luY2hyb25vdXNseS4gSWRlYWxseSB0aGlzXG4gKiBzaG91bGQgYmUgZXhlY3V0ZWQgYXMgYSBtaWNyb3Rhc2ssIHNvIHdlIGxldmVyYWdlXG4gKiBNdXRhdGlvbk9ic2VydmVyIGlmIGl0J3MgYXZhaWxhYmxlLCBhbmQgZmFsbGJhY2sgdG9cbiAqIHNldFRpbWVvdXQoMCkuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAqL1xuXG5leHBvcnRzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNhbGxiYWNrcyA9IFtdXG4gIHZhciBwZW5kaW5nID0gZmFsc2VcbiAgdmFyIHRpbWVyRnVuY1xuICBmdW5jdGlvbiBoYW5kbGUgKCkge1xuICAgIHBlbmRpbmcgPSBmYWxzZVxuICAgIHZhciBjb3BpZXMgPSBjYWxsYmFja3Muc2xpY2UoMClcbiAgICBjYWxsYmFja3MgPSBbXVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29waWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb3BpZXNbaV0oKVxuICAgIH1cbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyICE9PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBjb3VudGVyID0gMVxuICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGhhbmRsZSlcbiAgICB2YXIgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjb3VudGVyKVxuICAgIG9ic2VydmVyLm9ic2VydmUodGV4dE5vZGUsIHtcbiAgICAgIGNoYXJhY3RlckRhdGE6IHRydWVcbiAgICB9KVxuICAgIHRpbWVyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvdW50ZXIgPSAoY291bnRlciArIDEpICUgMlxuICAgICAgdGV4dE5vZGUuZGF0YSA9IGNvdW50ZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGltZXJGdW5jID0gc2V0VGltZW91dFxuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoY2IsIGN0eCkge1xuICAgIHZhciBmdW5jID0gY3R4XG4gICAgICA/IGZ1bmN0aW9uICgpIHsgY2IuY2FsbChjdHgpIH1cbiAgICAgIDogY2JcbiAgICBjYWxsYmFja3MucHVzaChmdW5jKVxuICAgIGlmIChwZW5kaW5nKSByZXR1cm5cbiAgICBwZW5kaW5nID0gdHJ1ZVxuICAgIHRpbWVyRnVuYyhoYW5kbGUsIDApXG4gIH1cbn0pKClcblxuLyoqXG4gKiBEZXRlY3QgaWYgd2UgYXJlIGluIElFOS4uLlxuICpcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNJRTkgPVxuICBpbkJyb3dzZXIgJiZcbiAgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNU0lFIDkuMCcpID4gMFxuXG4vKipcbiAqIFNuaWZmIHRyYW5zaXRpb24vYW5pbWF0aW9uIGV2ZW50c1xuICovXG5cbmlmIChpbkJyb3dzZXIgJiYgIWV4cG9ydHMuaXNJRTkpIHtcbiAgdmFyIGlzV2Via2l0VHJhbnMgPVxuICAgIHdpbmRvdy5vbnRyYW5zaXRpb25lbmQgPT09IHVuZGVmaW5lZCAmJlxuICAgIHdpbmRvdy5vbndlYmtpdHRyYW5zaXRpb25lbmQgIT09IHVuZGVmaW5lZFxuICB2YXIgaXNXZWJraXRBbmltID1cbiAgICB3aW5kb3cub25hbmltYXRpb25lbmQgPT09IHVuZGVmaW5lZCAmJlxuICAgIHdpbmRvdy5vbndlYmtpdGFuaW1hdGlvbmVuZCAhPT0gdW5kZWZpbmVkXG4gIGV4cG9ydHMudHJhbnNpdGlvblByb3AgPSBpc1dlYmtpdFRyYW5zXG4gICAgPyAnV2Via2l0VHJhbnNpdGlvbidcbiAgICA6ICd0cmFuc2l0aW9uJ1xuICBleHBvcnRzLnRyYW5zaXRpb25FbmRFdmVudCA9IGlzV2Via2l0VHJhbnNcbiAgICA/ICd3ZWJraXRUcmFuc2l0aW9uRW5kJ1xuICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gIGV4cG9ydHMuYW5pbWF0aW9uUHJvcCA9IGlzV2Via2l0QW5pbVxuICAgID8gJ1dlYmtpdEFuaW1hdGlvbidcbiAgICA6ICdhbmltYXRpb24nXG4gIGV4cG9ydHMuYW5pbWF0aW9uRW5kRXZlbnQgPSBpc1dlYmtpdEFuaW1cbiAgICA/ICd3ZWJraXRBbmltYXRpb25FbmQnXG4gICAgOiAnYW5pbWF0aW9uZW5kJ1xufSIsInZhciBfID0gcmVxdWlyZSgnLi9kZWJ1ZycpXG5cbi8qKlxuICogUmVzb2x2ZSByZWFkICYgd3JpdGUgZmlsdGVycyBmb3IgYSB2bSBpbnN0YW5jZS4gVGhlXG4gKiBmaWx0ZXJzIGRlc2NyaXB0b3IgQXJyYXkgY29tZXMgZnJvbSB0aGUgZGlyZWN0aXZlIHBhcnNlci5cbiAqXG4gKiBUaGlzIGlzIGV4dHJhY3RlZCBpbnRvIGl0cyBvd24gdXRpbGl0eSBzbyBpdCBjYW5cbiAqIGJlIHVzZWQgaW4gbXVsdGlwbGUgc2NlbmFyaW9zLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBmaWx0ZXJzXG4gKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF1cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuXG5leHBvcnRzLnJlc29sdmVGaWx0ZXJzID0gZnVuY3Rpb24gKHZtLCBmaWx0ZXJzLCB0YXJnZXQpIHtcbiAgaWYgKCFmaWx0ZXJzKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHJlcyA9IHRhcmdldCB8fCB7fVxuICAvLyB2YXIgcmVnaXN0cnkgPSB2bS4kb3B0aW9ucy5maWx0ZXJzXG4gIGZpbHRlcnMuZm9yRWFjaChmdW5jdGlvbiAoZikge1xuICAgIHZhciBkZWYgPSB2bS4kb3B0aW9ucy5maWx0ZXJzW2YubmFtZV1cbiAgICBfLmFzc2VydEFzc2V0KGRlZiwgJ2ZpbHRlcicsIGYubmFtZSlcbiAgICBpZiAoIWRlZikgcmV0dXJuXG4gICAgdmFyIGFyZ3MgPSBmLmFyZ3NcbiAgICB2YXIgcmVhZGVyLCB3cml0ZXJcbiAgICBpZiAodHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVhZGVyID0gZGVmXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWRlciA9IGRlZi5yZWFkXG4gICAgICB3cml0ZXIgPSBkZWYud3JpdGVcbiAgICB9XG4gICAgaWYgKHJlYWRlcikge1xuICAgICAgaWYgKCFyZXMucmVhZCkgcmVzLnJlYWQgPSBbXVxuICAgICAgcmVzLnJlYWQucHVzaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NcbiAgICAgICAgICA/IHJlYWRlci5hcHBseSh2bSwgW3ZhbHVlXS5jb25jYXQoYXJncykpXG4gICAgICAgICAgOiByZWFkZXIuY2FsbCh2bSwgdmFsdWUpXG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAod3JpdGVyKSB7XG4gICAgICBpZiAoIXJlcy53cml0ZSkgcmVzLndyaXRlID0gW11cbiAgICAgIHJlcy53cml0ZS5wdXNoKGZ1bmN0aW9uICh2YWx1ZSwgb2xkVmFsKSB7XG4gICAgICAgIHJldHVybiBhcmdzXG4gICAgICAgICAgPyB3cml0ZXIuYXBwbHkodm0sIFt2YWx1ZSwgb2xkVmFsXS5jb25jYXQoYXJncykpXG4gICAgICAgICAgOiB3cml0ZXIuY2FsbCh2bSwgdmFsdWUsIG9sZFZhbClcbiAgICAgIH0pXG4gICAgfVxuICB9KVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogQXBwbHkgZmlsdGVycyB0byBhIHZhbHVlXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtBcnJheX0gZmlsdGVyc1xuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0geyp9IG9sZFZhbFxuICogQHJldHVybiB7Kn1cbiAqL1xuXG5leHBvcnRzLmFwcGx5RmlsdGVycyA9IGZ1bmN0aW9uICh2YWx1ZSwgZmlsdGVycywgdm0sIG9sZFZhbCkge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuICBmb3IgKHZhciBpID0gMCwgbCA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdmFsdWUgPSBmaWx0ZXJzW2ldLmNhbGwodm0sIHZhbHVlLCBvbGRWYWwpXG4gIH1cbiAgcmV0dXJuIHZhbHVlXG59IiwidmFyIGxhbmcgICA9IHJlcXVpcmUoJy4vbGFuZycpXG52YXIgZXh0ZW5kID0gbGFuZy5leHRlbmRcblxuZXh0ZW5kKGV4cG9ydHMsIGxhbmcpXG5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9lbnYnKSlcbmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2RvbScpKVxuZXh0ZW5kKGV4cG9ydHMsIHJlcXVpcmUoJy4vZmlsdGVyJykpXG5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9kZWJ1ZycpKVxuZXh0ZW5kKGV4cG9ydHMsIHJlcXVpcmUoJy4vbWlzYycpKSIsIi8qKlxuICogQ2hlY2sgaXMgYSBzdHJpbmcgc3RhcnRzIHdpdGggJCBvciBfXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmlzUmVzZXJ2ZWQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHZhciBjID0gKHN0ciArICcnKS5jaGFyQ29kZUF0KDApXG4gIHJldHVybiBjID09PSAweDI0IHx8IGMgPT09IDB4NUZcbn1cblxuLyoqXG4gKiBHdWFyZCB0ZXh0IG91dHB1dCwgbWFrZSBzdXJlIHVuZGVmaW5lZCBvdXRwdXRzXG4gKiBlbXB0eSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy50b1N0cmluZyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgID8gJydcbiAgICA6IHZhbHVlLnRvU3RyaW5nKClcbn1cblxuLyoqXG4gKiBDaGVjayBhbmQgY29udmVydCBwb3NzaWJsZSBudW1lcmljIG51bWJlcnMgYmVmb3JlXG4gKiBzZXR0aW5nIGJhY2sgdG8gZGF0YVxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4geyp8TnVtYmVyfVxuICovXG5cbmV4cG9ydHMudG9OdW1iZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIChcbiAgICBpc05hTih2YWx1ZSkgfHxcbiAgICB2YWx1ZSA9PT0gbnVsbCB8fFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nXG4gICkgPyB2YWx1ZVxuICAgIDogTnVtYmVyKHZhbHVlKVxufVxuXG4vKipcbiAqIFN0cmlwIHF1b3RlcyBmcm9tIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nIHwgZmFsc2V9XG4gKi9cblxuZXhwb3J0cy5zdHJpcFF1b3RlcyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgdmFyIGEgPSBzdHIuY2hhckNvZGVBdCgwKVxuICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KHN0ci5sZW5ndGggLSAxKVxuICByZXR1cm4gYSA9PT0gYiAmJiAoYSA9PT0gMHgyMiB8fCBhID09PSAweDI3KVxuICAgID8gc3RyLnNsaWNlKDEsIC0xKVxuICAgIDogZmFsc2Vcbn1cblxuLyoqXG4gKiBSZXBsYWNlIGhlbHBlclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBfIC0gbWF0Y2hlZCBkZWxpbWl0ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBjIC0gbWF0Y2hlZCBjaGFyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHRvVXBwZXIgKF8sIGMpIHtcbiAgcmV0dXJuIGMgPyBjLnRvVXBwZXJDYXNlICgpIDogJydcbn1cblxuLyoqXG4gKiBDYW1lbGl6ZSBhIGh5cGhlbi1kZWxtaXRlZCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbnZhciBjYW1lbFJFID0gLy0oXFx3KS9nXG5leHBvcnRzLmNhbWVsaXplID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2FtZWxSRSwgdG9VcHBlcilcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBoeXBoZW4vdW5kZXJzY29yZS9zbGFzaCBkZWxpbWl0ZXJlZCBuYW1lcyBpbnRvXG4gKiBjYW1lbGl6ZWQgY2xhc3NOYW1lcy5cbiAqXG4gKiBlLmcuIG15LWNvbXBvbmVudCA9PiBNeUNvbXBvbmVudFxuICogICAgICBzb21lX2Vsc2UgICAgPT4gU29tZUVsc2VcbiAqICAgICAgc29tZS9jb21wICAgID0+IFNvbWVDb21wXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbnZhciBjbGFzc2lmeVJFID0gLyg/Ol58Wy1fXFwvXSkoXFx3KS9nXG5leHBvcnRzLmNsYXNzaWZ5ID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoY2xhc3NpZnlSRSwgdG9VcHBlcilcbn1cblxuLyoqXG4gKiBTaW1wbGUgYmluZCwgZmFzdGVyIHRoYW4gbmF0aXZlXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMuYmluZCA9IGZ1bmN0aW9uIChmbiwgY3R4KSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aFxuICAgIHJldHVybiBsXG4gICAgICA/IGwgPiAxXG4gICAgICAgID8gZm4uYXBwbHkoY3R4LCBhcmd1bWVudHMpXG4gICAgICAgIDogZm4uY2FsbChjdHgsIGEpXG4gICAgICA6IGZuLmNhbGwoY3R4KVxuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBhbiBBcnJheS1saWtlIG9iamVjdCB0byBhIHJlYWwgQXJyYXkuXG4gKlxuICogQHBhcmFtIHtBcnJheS1saWtlfSBsaXN0XG4gKiBAcGFyYW0ge051bWJlcn0gW3N0YXJ0XSAtIHN0YXJ0IGluZGV4XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5leHBvcnRzLnRvQXJyYXkgPSBmdW5jdGlvbiAobGlzdCwgc3RhcnQpIHtcbiAgc3RhcnQgPSBzdGFydCB8fCAwXG4gIHZhciBpID0gbGlzdC5sZW5ndGggLSBzdGFydFxuICB2YXIgcmV0ID0gbmV3IEFycmF5KGkpXG4gIHdoaWxlIChpLS0pIHtcbiAgICByZXRbaV0gPSBsaXN0W2kgKyBzdGFydF1cbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogTWl4IHByb3BlcnRpZXMgaW50byB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0b1xuICogQHBhcmFtIHtPYmplY3R9IGZyb21cbiAqL1xuXG5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uICh0bywgZnJvbSkge1xuICBmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuICAgIHRvW2tleV0gPSBmcm9tW2tleV1cbiAgfVxuICByZXR1cm4gdG9cbn1cblxuLyoqXG4gKiBRdWljayBvYmplY3QgY2hlY2sgLSB0aGlzIGlzIHByaW1hcmlseSB1c2VkIHRvIHRlbGxcbiAqIE9iamVjdHMgZnJvbSBwcmltaXRpdmUgdmFsdWVzIHdoZW4gd2Uga25vdyB0aGUgdmFsdWVcbiAqIGlzIGEgSlNPTi1jb21wbGlhbnQgdHlwZS5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmlzT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnXG59XG5cbi8qKlxuICogU3RyaWN0IG9iamVjdCB0eXBlIGNoZWNrLiBPbmx5IHJldHVybnMgdHJ1ZVxuICogZm9yIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5leHBvcnRzLmlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE9iamVjdF0nXG59XG5cbi8qKlxuICogQXJyYXkgdHlwZSBjaGVjay5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmlzQXJyYXkgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KG9iailcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtlbnVtZXJhYmxlXVxuICovXG5cbmV4cG9ydHMuZGVmaW5lID0gZnVuY3Rpb24gKG9iaiwga2V5LCB2YWwsIGVudW1lcmFibGUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgdmFsdWUgICAgICAgIDogdmFsLFxuICAgIGVudW1lcmFibGUgICA6ICEhZW51bWVyYWJsZSxcbiAgICB3cml0YWJsZSAgICAgOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZSA6IHRydWVcbiAgfSlcbn1cblxuLyoqXG4gKiBEZWJvdW5jZSBhIGZ1bmN0aW9uIHNvIGl0IG9ubHkgZ2V0cyBjYWxsZWQgYWZ0ZXIgdGhlXG4gKiBpbnB1dCBzdG9wcyBhcnJpdmluZyBhZnRlciB0aGUgZ2l2ZW4gd2FpdCBwZXJpb2QuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY1xuICogQHBhcmFtIHtOdW1iZXJ9IHdhaXRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqL1xuXG5leHBvcnRzLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHRcbiAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxhc3QgPSBEYXRlLm5vdygpIC0gdGltZXN0YW1wXG4gICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxuICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGxcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGNvbnRleHQgPSB0aGlzXG4gICAgYXJncyA9IGFyZ3VtZW50c1xuICAgIHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICBpZiAoIXRpbWVvdXQpIHtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxuLyoqXG4gKiBNYW51YWwgaW5kZXhPZiBiZWNhdXNlIGl0J3Mgc2xpZ2h0bHkgZmFzdGVyIHRoYW5cbiAqIG5hdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKi9cblxuZXhwb3J0cy5pbmRleE9mID0gZnVuY3Rpb24gKGFyciwgb2JqKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChhcnJbaV0gPT09IG9iaikgcmV0dXJuIGlcbiAgfVxuICByZXR1cm4gLTFcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vaW5kZXgnKVxudmFyIGV4dGVuZCA9IF8uZXh0ZW5kXG5cbi8qKlxuICogT3B0aW9uIG92ZXJ3cml0aW5nIHN0cmF0ZWdpZXMgYXJlIGZ1bmN0aW9ucyB0aGF0IGhhbmRsZVxuICogaG93IHRvIG1lcmdlIGEgcGFyZW50IG9wdGlvbiB2YWx1ZSBhbmQgYSBjaGlsZCBvcHRpb25cbiAqIHZhbHVlIGludG8gdGhlIGZpbmFsIHZhbHVlLlxuICpcbiAqIEFsbCBzdHJhdGVneSBmdW5jdGlvbnMgZm9sbG93IHRoZSBzYW1lIHNpZ25hdHVyZTpcbiAqXG4gKiBAcGFyYW0geyp9IHBhcmVudFZhbFxuICogQHBhcmFtIHsqfSBjaGlsZFZhbFxuICogQHBhcmFtIHtWdWV9IFt2bV1cbiAqL1xuXG52YXIgc3RyYXRzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4vKipcbiAqIEhlbHBlciB0aGF0IHJlY3Vyc2l2ZWx5IG1lcmdlcyB0d28gZGF0YSBvYmplY3RzIHRvZ2V0aGVyLlxuICovXG5cbmZ1bmN0aW9uIG1lcmdlRGF0YSAodG8sIGZyb20pIHtcbiAgdmFyIGtleSwgdG9WYWwsIGZyb21WYWxcbiAgZm9yIChrZXkgaW4gZnJvbSkge1xuICAgIHRvVmFsID0gdG9ba2V5XVxuICAgIGZyb21WYWwgPSBmcm9tW2tleV1cbiAgICBpZiAoIXRvLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRvLiRhZGQoa2V5LCBmcm9tVmFsKVxuICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdCh0b1ZhbCkgJiYgXy5pc09iamVjdChmcm9tVmFsKSkge1xuICAgICAgbWVyZ2VEYXRhKHRvVmFsLCBmcm9tVmFsKVxuICAgIH1cbiAgfVxuICByZXR1cm4gdG9cbn1cblxuLyoqXG4gKiBEYXRhXG4gKi9cblxuc3RyYXRzLmRhdGEgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCwgdm0pIHtcbiAgaWYgKCF2bSkge1xuICAgIC8vIGluIGEgVnVlLmV4dGVuZCBtZXJnZSwgYm90aCBzaG91bGQgYmUgZnVuY3Rpb25zXG4gICAgaWYgKCFjaGlsZFZhbCkge1xuICAgICAgcmV0dXJuIHBhcmVudFZhbFxuICAgIH1cbiAgICBpZiAodHlwZW9mIGNoaWxkVmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdUaGUgXCJkYXRhXCIgb3B0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uICcgK1xuICAgICAgICAndGhhdCByZXR1cm5zIGEgcGVyLWluc3RhbmNlIHZhbHVlIGluIGNvbXBvbmVudCAnICtcbiAgICAgICAgJ2RlZmluaXRpb25zLidcbiAgICAgIClcbiAgICAgIHJldHVybiBwYXJlbnRWYWxcbiAgICB9XG4gICAgaWYgKCFwYXJlbnRWYWwpIHtcbiAgICAgIHJldHVybiBjaGlsZFZhbFxuICAgIH1cbiAgICAvLyB3aGVuIHBhcmVudFZhbCAmIGNoaWxkVmFsIGFyZSBib3RoIHByZXNlbnQsXG4gICAgLy8gd2UgbmVlZCB0byByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gICAgLy8gbWVyZ2VkIHJlc3VsdCBvZiBib3RoIGZ1bmN0aW9ucy4uLiBubyBuZWVkIHRvXG4gICAgLy8gY2hlY2sgaWYgcGFyZW50VmFsIGlzIGEgZnVuY3Rpb24gaGVyZSBiZWNhdXNlXG4gICAgLy8gaXQgaGFzIHRvIGJlIGEgZnVuY3Rpb24gdG8gcGFzcyBwcmV2aW91cyBtZXJnZXMuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZERhdGFGbiAoKSB7XG4gICAgICByZXR1cm4gbWVyZ2VEYXRhKFxuICAgICAgICBjaGlsZFZhbC5jYWxsKHRoaXMpLFxuICAgICAgICBwYXJlbnRWYWwuY2FsbCh0aGlzKVxuICAgICAgKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBpbnN0YW5jZSBtZXJnZSwgcmV0dXJuIHJhdyBvYmplY3RcbiAgICB2YXIgaW5zdGFuY2VEYXRhID0gdHlwZW9mIGNoaWxkVmFsID09PSAnZnVuY3Rpb24nXG4gICAgICA/IGNoaWxkVmFsLmNhbGwodm0pXG4gICAgICA6IGNoaWxkVmFsXG4gICAgdmFyIGRlZmF1bHREYXRhID0gdHlwZW9mIHBhcmVudFZhbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBwYXJlbnRWYWwuY2FsbCh2bSlcbiAgICAgIDogdW5kZWZpbmVkXG4gICAgaWYgKGluc3RhbmNlRGF0YSkge1xuICAgICAgcmV0dXJuIG1lcmdlRGF0YShpbnN0YW5jZURhdGEsIGRlZmF1bHREYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGVmYXVsdERhdGFcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFbFxuICovXG5cbnN0cmF0cy5lbCA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsLCB2bSkge1xuICBpZiAoIXZtICYmIGNoaWxkVmFsICYmIHR5cGVvZiBjaGlsZFZhbCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8ud2FybihcbiAgICAgICdUaGUgXCJlbFwiIG9wdGlvbiBzaG91bGQgYmUgYSBmdW5jdGlvbiAnICtcbiAgICAgICd0aGF0IHJldHVybnMgYSBwZXItaW5zdGFuY2UgdmFsdWUgaW4gY29tcG9uZW50ICcgK1xuICAgICAgJ2RlZmluaXRpb25zLidcbiAgICApXG4gICAgcmV0dXJuXG4gIH1cbiAgdmFyIHJldCA9IGNoaWxkVmFsIHx8IHBhcmVudFZhbFxuICAvLyBpbnZva2UgdGhlIGVsZW1lbnQgZmFjdG9yeSBpZiB0aGlzIGlzIGluc3RhbmNlIG1lcmdlXG4gIHJldHVybiB2bSAmJiB0eXBlb2YgcmV0ID09PSAnZnVuY3Rpb24nXG4gICAgPyByZXQuY2FsbCh2bSlcbiAgICA6IHJldFxufVxuXG4vKipcbiAqIEhvb2tzIGFuZCBwYXJhbSBhdHRyaWJ1dGVzIGFyZSBtZXJnZWQgYXMgYXJyYXlzLlxuICovXG5cbnN0cmF0cy5jcmVhdGVkID1cbnN0cmF0cy5yZWFkeSA9XG5zdHJhdHMuYXR0YWNoZWQgPVxuc3RyYXRzLmRldGFjaGVkID1cbnN0cmF0cy5iZWZvcmVDb21waWxlID1cbnN0cmF0cy5jb21waWxlZCA9XG5zdHJhdHMuYmVmb3JlRGVzdHJveSA9XG5zdHJhdHMuZGVzdHJveWVkID1cbnN0cmF0cy5wcm9wcyA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIHJldHVybiBjaGlsZFZhbFxuICAgID8gcGFyZW50VmFsXG4gICAgICA/IHBhcmVudFZhbC5jb25jYXQoY2hpbGRWYWwpXG4gICAgICA6IF8uaXNBcnJheShjaGlsZFZhbClcbiAgICAgICAgPyBjaGlsZFZhbFxuICAgICAgICA6IFtjaGlsZFZhbF1cbiAgICA6IHBhcmVudFZhbFxufVxuXG4vKipcbiAqIEFzc2V0c1xuICpcbiAqIFdoZW4gYSB2bSBpcyBwcmVzZW50IChpbnN0YW5jZSBjcmVhdGlvbiksIHdlIG5lZWQgdG8gZG9cbiAqIGEgdGhyZWUtd2F5IG1lcmdlIGJldHdlZW4gY29uc3RydWN0b3Igb3B0aW9ucywgaW5zdGFuY2VcbiAqIG9wdGlvbnMgYW5kIHBhcmVudCBvcHRpb25zLlxuICovXG5cbnN0cmF0cy5kaXJlY3RpdmVzID1cbnN0cmF0cy5maWx0ZXJzID1cbnN0cmF0cy50cmFuc2l0aW9ucyA9XG5zdHJhdHMuY29tcG9uZW50cyA9XG5zdHJhdHMuZWxlbWVudERpcmVjdGl2ZXMgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCwgdm0sIGtleSkge1xuICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShcbiAgICB2bSAmJiB2bS4kcGFyZW50XG4gICAgICA/IHZtLiRwYXJlbnQuJG9wdGlvbnNba2V5XVxuICAgICAgOiBfLlZ1ZS5vcHRpb25zW2tleV1cbiAgKVxuICBpZiAocGFyZW50VmFsKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwYXJlbnRWYWwpXG4gICAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICAgIHZhciBmaWVsZFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGZpZWxkID0ga2V5c1tpXVxuICAgICAgcmV0W2ZpZWxkXSA9IHBhcmVudFZhbFtmaWVsZF1cbiAgICB9XG4gIH1cbiAgaWYgKGNoaWxkVmFsKSBleHRlbmQocmV0LCBjaGlsZFZhbClcbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIEV2ZW50cyAmIFdhdGNoZXJzLlxuICpcbiAqIEV2ZW50cyAmIHdhdGNoZXJzIGhhc2hlcyBzaG91bGQgbm90IG92ZXJ3cml0ZSBvbmVcbiAqIGFub3RoZXIsIHNvIHdlIG1lcmdlIHRoZW0gYXMgYXJyYXlzLlxuICovXG5cbnN0cmF0cy53YXRjaCA9XG5zdHJhdHMuZXZlbnRzID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgaWYgKCFjaGlsZFZhbCkgcmV0dXJuIHBhcmVudFZhbFxuICBpZiAoIXBhcmVudFZhbCkgcmV0dXJuIGNoaWxkVmFsXG4gIHZhciByZXQgPSB7fVxuICBleHRlbmQocmV0LCBwYXJlbnRWYWwpXG4gIGZvciAodmFyIGtleSBpbiBjaGlsZFZhbCkge1xuICAgIHZhciBwYXJlbnQgPSByZXRba2V5XVxuICAgIHZhciBjaGlsZCA9IGNoaWxkVmFsW2tleV1cbiAgICBpZiAocGFyZW50ICYmICFfLmlzQXJyYXkocGFyZW50KSkge1xuICAgICAgcGFyZW50ID0gW3BhcmVudF1cbiAgICB9XG4gICAgcmV0W2tleV0gPSBwYXJlbnRcbiAgICAgID8gcGFyZW50LmNvbmNhdChjaGlsZClcbiAgICAgIDogW2NoaWxkXVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBPdGhlciBvYmplY3QgaGFzaGVzLlxuICovXG5cbnN0cmF0cy5tZXRob2RzID1cbnN0cmF0cy5jb21wdXRlZCA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XG4gIGlmICghY2hpbGRWYWwpIHJldHVybiBwYXJlbnRWYWxcbiAgaWYgKCFwYXJlbnRWYWwpIHJldHVybiBjaGlsZFZhbFxuICB2YXIgcmV0ID0gT2JqZWN0LmNyZWF0ZShwYXJlbnRWYWwpXG4gIGV4dGVuZChyZXQsIGNoaWxkVmFsKVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogRGVmYXVsdCBzdHJhdGVneS5cbiAqL1xuXG52YXIgZGVmYXVsdFN0cmF0ID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgcmV0dXJuIGNoaWxkVmFsID09PSB1bmRlZmluZWRcbiAgICA/IHBhcmVudFZhbFxuICAgIDogY2hpbGRWYWxcbn1cblxuLyoqXG4gKiBNYWtlIHN1cmUgY29tcG9uZW50IG9wdGlvbnMgZ2V0IGNvbnZlcnRlZCB0byBhY3R1YWxcbiAqIGNvbnN0cnVjdG9ycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29tcG9uZW50c1xuICovXG5cbmZ1bmN0aW9uIGd1YXJkQ29tcG9uZW50cyAoY29tcG9uZW50cykge1xuICBpZiAoY29tcG9uZW50cykge1xuICAgIHZhciBkZWZcbiAgICBmb3IgKHZhciBrZXkgaW4gY29tcG9uZW50cykge1xuICAgICAgZGVmID0gY29tcG9uZW50c1trZXldXG4gICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KGRlZikpIHtcbiAgICAgICAgZGVmLm5hbWUgPSBrZXlcbiAgICAgICAgY29tcG9uZW50c1trZXldID0gXy5WdWUuZXh0ZW5kKGRlZilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNZXJnZSB0d28gb3B0aW9uIG9iamVjdHMgaW50byBhIG5ldyBvbmUuXG4gKiBDb3JlIHV0aWxpdHkgdXNlZCBpbiBib3RoIGluc3RhbnRpYXRpb24gYW5kIGluaGVyaXRhbmNlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJlbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjaGlsZFxuICogQHBhcmFtIHtWdWV9IFt2bV0gLSBpZiB2bSBpcyBwcmVzZW50LCBpbmRpY2F0ZXMgdGhpcyBpc1xuICogICAgICAgICAgICAgICAgICAgICBhbiBpbnN0YW50aWF0aW9uIG1lcmdlLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWVyZ2VPcHRpb25zIChwYXJlbnQsIGNoaWxkLCB2bSkge1xuICBndWFyZENvbXBvbmVudHMoY2hpbGQuY29tcG9uZW50cylcbiAgdmFyIG9wdGlvbnMgPSB7fVxuICB2YXIga2V5XG4gIGlmIChjaGlsZC5taXhpbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkLm1peGlucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHBhcmVudCA9IG1lcmdlT3B0aW9ucyhwYXJlbnQsIGNoaWxkLm1peGluc1tpXSwgdm0pXG4gICAgfVxuICB9XG4gIGZvciAoa2V5IGluIHBhcmVudCkge1xuICAgIG1lcmdlKGtleSlcbiAgfVxuICBmb3IgKGtleSBpbiBjaGlsZCkge1xuICAgIGlmICghKHBhcmVudC5oYXNPd25Qcm9wZXJ0eShrZXkpKSkge1xuICAgICAgbWVyZ2Uoa2V5KVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtZXJnZSAoa2V5KSB7XG4gICAgdmFyIHN0cmF0ID0gc3RyYXRzW2tleV0gfHwgZGVmYXVsdFN0cmF0XG4gICAgb3B0aW9uc1trZXldID0gc3RyYXQocGFyZW50W2tleV0sIGNoaWxkW2tleV0sIHZtLCBrZXkpXG4gIH1cbiAgcmV0dXJuIG9wdGlvbnNcbn0iLCIvKipcbiAqIENoZWNrIGlmIGFuIGVsZW1lbnQgaXMgYSBjb21wb25lbnQsIGlmIHllcyByZXR1cm4gaXRzXG4gKiBjb21wb25lbnQgaWQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge1N0cmluZ3x1bmRlZmluZWR9XG4gKi9cblxuZXhwb3J0cy5jaGVja0NvbXBvbmVudCA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuICB2YXIgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmICh0YWcgPT09ICdjb21wb25lbnQnKSB7XG4gICAgLy8gZHluYW1pYyBzeW50YXhcbiAgICB2YXIgZXhwID0gZWwuZ2V0QXR0cmlidXRlKCdpcycpXG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKCdpcycpXG4gICAgcmV0dXJuIGV4cFxuICB9IGVsc2UgaWYgKG9wdGlvbnMuY29tcG9uZW50c1t0YWddKSB7XG4gICAgcmV0dXJuIHRhZ1xuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIGV4dGVuZCA9IF8uZXh0ZW5kXG5cbi8qKlxuICogVGhlIGV4cG9zZWQgVnVlIGNvbnN0cnVjdG9yLlxuICpcbiAqIEFQSSBjb252ZW50aW9uczpcbiAqIC0gcHVibGljIEFQSSBtZXRob2RzL3Byb3BlcnRpZXMgYXJlIHByZWZpZXhlZCB3aXRoIGAkYFxuICogLSBpbnRlcm5hbCBtZXRob2RzL3Byb3BlcnRpZXMgYXJlIHByZWZpeGVkIHdpdGggYF9gXG4gKiAtIG5vbi1wcmVmaXhlZCBwcm9wZXJ0aWVzIGFyZSBhc3N1bWVkIHRvIGJlIHByb3hpZWQgdXNlclxuICogICBkYXRhLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFZ1ZSAob3B0aW9ucykge1xuICB0aGlzLl9pbml0KG9wdGlvbnMpXG59XG5cbi8qKlxuICogTWl4aW4gZ2xvYmFsIEFQSVxuICovXG5cbmV4dGVuZChWdWUsIHJlcXVpcmUoJy4vYXBpL2dsb2JhbCcpKVxuXG4vKipcbiAqIFZ1ZSBhbmQgZXZlcnkgY29uc3RydWN0b3IgdGhhdCBleHRlbmRzIFZ1ZSBoYXMgYW5cbiAqIGFzc29jaWF0ZWQgb3B0aW9ucyBvYmplY3QsIHdoaWNoIGNhbiBiZSBhY2Nlc3NlZCBkdXJpbmdcbiAqIGNvbXBpbGF0aW9uIHN0ZXBzIGFzIGB0aGlzLmNvbnN0cnVjdG9yLm9wdGlvbnNgLlxuICpcbiAqIFRoZXNlIGNhbiBiZSBzZWVuIGFzIHRoZSBkZWZhdWx0IG9wdGlvbnMgb2YgZXZlcnlcbiAqIFZ1ZSBpbnN0YW5jZS5cbiAqL1xuXG5WdWUub3B0aW9ucyA9IHtcbiAgZGlyZWN0aXZlcyAgOiByZXF1aXJlKCcuL2RpcmVjdGl2ZXMnKSxcbiAgZmlsdGVycyAgICAgOiByZXF1aXJlKCcuL2ZpbHRlcnMnKSxcbiAgdHJhbnNpdGlvbnMgOiB7fSxcbiAgY29tcG9uZW50cyAgOiB7fSxcbiAgZWxlbWVudERpcmVjdGl2ZXM6IHt9XG59XG5cbi8qKlxuICogQnVpbGQgdXAgdGhlIHByb3RvdHlwZVxuICovXG5cbnZhciBwID0gVnVlLnByb3RvdHlwZVxuXG4vKipcbiAqICRkYXRhIGhhcyBhIHNldHRlciB3aGljaCBkb2VzIGEgYnVuY2ggb2ZcbiAqIHRlYXJkb3duL3NldHVwIHdvcmtcbiAqL1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkocCwgJyRkYXRhJywge1xuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGF0YVxuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIChuZXdEYXRhKSB7XG4gICAgaWYgKG5ld0RhdGEgIT09IHRoaXMuX2RhdGEpIHtcbiAgICAgIHRoaXMuX3NldERhdGEobmV3RGF0YSlcbiAgICB9XG4gIH1cbn0pXG5cbi8qKlxuICogTWl4aW4gaW50ZXJuYWwgaW5zdGFuY2UgbWV0aG9kc1xuICovXG5cbmV4dGVuZChwLCByZXF1aXJlKCcuL2luc3RhbmNlL2luaXQnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2luc3RhbmNlL2V2ZW50cycpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vaW5zdGFuY2Uvc2NvcGUnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2luc3RhbmNlL2NvbXBpbGUnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2luc3RhbmNlL21pc2MnKSlcblxuLyoqXG4gKiBNaXhpbiBwdWJsaWMgQVBJIG1ldGhvZHNcbiAqL1xuXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvZGF0YScpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2RvbScpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2V2ZW50cycpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vYXBpL2NoaWxkJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvbGlmZWN5Y2xlJykpXG5cbm1vZHVsZS5leHBvcnRzID0gXy5WdWUgPSBWdWUiLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKVxudmFyIE9ic2VydmVyID0gcmVxdWlyZSgnLi9vYnNlcnZlcicpXG52YXIgZXhwUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxudmFyIGJhdGNoZXIgPSByZXF1aXJlKCcuL2JhdGNoZXInKVxudmFyIHVpZCA9IDBcblxuLyoqXG4gKiBBIHdhdGNoZXIgcGFyc2VzIGFuIGV4cHJlc3Npb24sIGNvbGxlY3RzIGRlcGVuZGVuY2llcyxcbiAqIGFuZCBmaXJlcyBjYWxsYmFjayB3aGVuIHRoZSBleHByZXNzaW9uIHZhbHVlIGNoYW5nZXMuXG4gKiBUaGlzIGlzIHVzZWQgZm9yIGJvdGggdGhlICR3YXRjaCgpIGFwaSBhbmQgZGlyZWN0aXZlcy5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBleHByZXNzaW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqICAgICAgICAgICAgICAgICAtIHtBcnJheX0gZmlsdGVyc1xuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IHR3b1dheVxuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IGRlZXBcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSB1c2VyXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBXYXRjaGVyICh2bSwgZXhwcmVzc2lvbiwgY2IsIG9wdGlvbnMpIHtcbiAgdGhpcy52bSA9IHZtXG4gIHZtLl93YXRjaGVyTGlzdC5wdXNoKHRoaXMpXG4gIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb25cbiAgdGhpcy5jYnMgPSBbY2JdXG4gIHRoaXMuaWQgPSArK3VpZCAvLyB1aWQgZm9yIGJhdGNoaW5nXG4gIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB0aGlzLmRlZXAgPSAhIW9wdGlvbnMuZGVlcFxuICB0aGlzLnVzZXIgPSAhIW9wdGlvbnMudXNlclxuICB0aGlzLmRlcHMgPSBbXVxuICB0aGlzLm5ld0RlcHMgPSBbXVxuICAvLyBzZXR1cCBmaWx0ZXJzIGlmIGFueS5cbiAgLy8gV2UgZGVsZWdhdGUgZGlyZWN0aXZlIGZpbHRlcnMgaGVyZSB0byB0aGUgd2F0Y2hlclxuICAvLyBiZWNhdXNlIHRoZXkgbmVlZCB0byBiZSBpbmNsdWRlZCBpbiB0aGUgZGVwZW5kZW5jeVxuICAvLyBjb2xsZWN0aW9uIHByb2Nlc3MuXG4gIGlmIChvcHRpb25zLmZpbHRlcnMpIHtcbiAgICB0aGlzLnJlYWRGaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzLnJlYWRcbiAgICB0aGlzLndyaXRlRmlsdGVycyA9IG9wdGlvbnMuZmlsdGVycy53cml0ZVxuICB9XG4gIC8vIHBhcnNlIGV4cHJlc3Npb24gZm9yIGdldHRlci9zZXR0ZXJcbiAgdmFyIHJlcyA9IGV4cFBhcnNlci5wYXJzZShleHByZXNzaW9uLCBvcHRpb25zLnR3b1dheSlcbiAgdGhpcy5nZXR0ZXIgPSByZXMuZ2V0XG4gIHRoaXMuc2V0dGVyID0gcmVzLnNldFxuICB0aGlzLnZhbHVlID0gdGhpcy5nZXQoKVxufVxuXG52YXIgcCA9IFdhdGNoZXIucHJvdG90eXBlXG5cbi8qKlxuICogQWRkIGEgZGVwZW5kZW5jeSB0byB0aGlzIGRpcmVjdGl2ZS5cbiAqXG4gKiBAcGFyYW0ge0RlcH0gZGVwXG4gKi9cblxucC5hZGREZXAgPSBmdW5jdGlvbiAoZGVwKSB7XG4gIHZhciBuZXdEZXBzID0gdGhpcy5uZXdEZXBzXG4gIHZhciBvbGQgPSB0aGlzLmRlcHNcbiAgaWYgKF8uaW5kZXhPZihuZXdEZXBzLCBkZXApIDwgMCkge1xuICAgIG5ld0RlcHMucHVzaChkZXApXG4gICAgdmFyIGkgPSBfLmluZGV4T2Yob2xkLCBkZXApXG4gICAgaWYgKGkgPCAwKSB7XG4gICAgICBkZXAuYWRkU3ViKHRoaXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZFtpXSA9IG51bGxcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSB0aGUgZ2V0dGVyLCBhbmQgcmUtY29sbGVjdCBkZXBlbmRlbmNpZXMuXG4gKi9cblxucC5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuYmVmb3JlR2V0KClcbiAgdmFyIHZtID0gdGhpcy52bVxuICB2YXIgdmFsdWVcbiAgdHJ5IHtcbiAgICB2YWx1ZSA9IHRoaXMuZ2V0dGVyLmNhbGwodm0sIHZtKVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGNvbmZpZy53YXJuRXhwcmVzc2lvbkVycm9ycykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRXJyb3Igd2hlbiBldmFsdWF0aW5nIGV4cHJlc3Npb24gXCInICtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uICsgJ1wiOlxcbiAgICcgKyBlXG4gICAgICApXG4gICAgfVxuICB9XG4gIC8vIFwidG91Y2hcIiBldmVyeSBwcm9wZXJ0eSBzbyB0aGV5IGFyZSBhbGwgdHJhY2tlZCBhc1xuICAvLyBkZXBlbmRlbmNpZXMgZm9yIGRlZXAgd2F0Y2hpbmdcbiAgaWYgKHRoaXMuZGVlcCkge1xuICAgIHRyYXZlcnNlKHZhbHVlKVxuICB9XG4gIHZhbHVlID0gXy5hcHBseUZpbHRlcnModmFsdWUsIHRoaXMucmVhZEZpbHRlcnMsIHZtKVxuICB0aGlzLmFmdGVyR2V0KClcbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8qKlxuICogU2V0IHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIHdpdGggdGhlIHNldHRlci5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cblxucC5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHZtID0gdGhpcy52bVxuICB2YWx1ZSA9IF8uYXBwbHlGaWx0ZXJzKFxuICAgIHZhbHVlLCB0aGlzLndyaXRlRmlsdGVycywgdm0sIHRoaXMudmFsdWVcbiAgKVxuICB0cnkge1xuICAgIHRoaXMuc2V0dGVyLmNhbGwodm0sIHZtLCB2YWx1ZSlcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChjb25maWcud2FybkV4cHJlc3Npb25FcnJvcnMpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0Vycm9yIHdoZW4gZXZhbHVhdGluZyBzZXR0ZXIgXCInICtcbiAgICAgICAgdGhpcy5leHByZXNzaW9uICsgJ1wiOlxcbiAgICcgKyBlXG4gICAgICApXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJlcGFyZSBmb3IgZGVwZW5kZW5jeSBjb2xsZWN0aW9uLlxuICovXG5cbnAuYmVmb3JlR2V0ID0gZnVuY3Rpb24gKCkge1xuICBPYnNlcnZlci50YXJnZXQgPSB0aGlzXG59XG5cbi8qKlxuICogQ2xlYW4gdXAgZm9yIGRlcGVuZGVuY3kgY29sbGVjdGlvbi5cbiAqL1xuXG5wLmFmdGVyR2V0ID0gZnVuY3Rpb24gKCkge1xuICBPYnNlcnZlci50YXJnZXQgPSBudWxsXG4gIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAgdmFyIGRlcCA9IHRoaXMuZGVwc1tpXVxuICAgIGlmIChkZXApIHtcbiAgICAgIGRlcC5yZW1vdmVTdWIodGhpcylcbiAgICB9XG4gIH1cbiAgdGhpcy5kZXBzID0gdGhpcy5uZXdEZXBzXG4gIHRoaXMubmV3RGVwcyA9IFtdXG59XG5cbi8qKlxuICogU3Vic2NyaWJlciBpbnRlcmZhY2UuXG4gKiBXaWxsIGJlIGNhbGxlZCB3aGVuIGEgZGVwZW5kZW5jeSBjaGFuZ2VzLlxuICovXG5cbnAudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIWNvbmZpZy5hc3luYyB8fCBjb25maWcuZGVidWcpIHtcbiAgICB0aGlzLnJ1bigpXG4gIH0gZWxzZSB7XG4gICAgYmF0Y2hlci5wdXNoKHRoaXMpXG4gIH1cbn1cblxuLyoqXG4gKiBCYXRjaGVyIGpvYiBpbnRlcmZhY2UuXG4gKiBXaWxsIGJlIGNhbGxlZCBieSB0aGUgYmF0Y2hlci5cbiAqL1xuXG5wLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5nZXQoKVxuICAgIGlmIChcbiAgICAgIHZhbHVlICE9PSB0aGlzLnZhbHVlIHx8XG4gICAgICBBcnJheS5pc0FycmF5KHZhbHVlKSB8fFxuICAgICAgdGhpcy5kZWVwXG4gICAgKSB7XG4gICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgICAgIHZhciBjYnMgPSB0aGlzLmNic1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNic1tpXSh2YWx1ZSwgb2xkVmFsdWUpXG4gICAgICAgIC8vIGlmIGEgY2FsbGJhY2sgYWxzbyByZW1vdmVkIG90aGVyIGNhbGxiYWNrcyxcbiAgICAgICAgLy8gd2UgbmVlZCB0byBhZGp1c3QgdGhlIGxvb3AgYWNjb3JkaW5nbHkuXG4gICAgICAgIHZhciByZW1vdmVkID0gbCAtIGNicy5sZW5ndGhcbiAgICAgICAgaWYgKHJlbW92ZWQpIHtcbiAgICAgICAgICBpIC09IHJlbW92ZWRcbiAgICAgICAgICBsIC09IHJlbW92ZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxucC5hZGRDYiA9IGZ1bmN0aW9uIChjYikge1xuICB0aGlzLmNicy5wdXNoKGNiKVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNhbGxiYWNrLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKi9cblxucC5yZW1vdmVDYiA9IGZ1bmN0aW9uIChjYikge1xuICB2YXIgY2JzID0gdGhpcy5jYnNcbiAgaWYgKGNicy5sZW5ndGggPiAxKSB7XG4gICAgY2JzLiRyZW1vdmUoY2IpXG4gIH0gZWxzZSBpZiAoY2IgPT09IGNic1swXSkge1xuICAgIHRoaXMudGVhcmRvd24oKVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIHNlbGYgZnJvbSBhbGwgZGVwZW5kZW5jaWVzJyBzdWJjcmliZXIgbGlzdC5cbiAqL1xuXG5wLnRlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAvLyByZW1vdmUgc2VsZiBmcm9tIHZtJ3Mgd2F0Y2hlciBsaXN0XG4gICAgLy8gd2UgY2FuIHNraXAgdGhpcyBpZiB0aGUgdm0gaWYgYmVpbmcgZGVzdHJveWVkXG4gICAgLy8gd2hpY2ggY2FuIGltcHJvdmUgdGVhcmRvd24gcGVyZm9ybWFuY2UuXG4gICAgaWYgKCF0aGlzLnZtLl9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgICB0aGlzLnZtLl93YXRjaGVyTGlzdC4kcmVtb3ZlKHRoaXMpXG4gICAgfVxuICAgIHZhciBpID0gdGhpcy5kZXBzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHRoaXMuZGVwc1tpXS5yZW1vdmVTdWIodGhpcylcbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMudm0gPSB0aGlzLmNicyA9IHRoaXMudmFsdWUgPSBudWxsXG4gIH1cbn1cblxuXG4vKipcbiAqIFJlY3J1c2l2ZWx5IHRyYXZlcnNlIGFuIG9iamVjdCB0byBldm9rZSBhbGwgY29udmVydGVkXG4gKiBnZXR0ZXJzLCBzbyB0aGF0IGV2ZXJ5IG5lc3RlZCBwcm9wZXJ0eSBpbnNpZGUgdGhlIG9iamVjdFxuICogaXMgY29sbGVjdGVkIGFzIGEgXCJkZWVwXCIgZGVwZW5kZW5jeS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKi9cblxuZnVuY3Rpb24gdHJhdmVyc2UgKG9iaikge1xuICB2YXIga2V5LCB2YWwsIGlcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgdmFsID0gb2JqW2tleV1cbiAgICBpZiAoXy5pc0FycmF5KHZhbCkpIHtcbiAgICAgIGkgPSB2YWwubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB0cmF2ZXJzZSh2YWxbaV0pXG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHZhbCkpIHtcbiAgICAgIHRyYXZlcnNlKHZhbClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBXYXRjaGVyIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG5cdDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgY29sLXNtLTJcIj57eyBmaWVsZC5sYWJlbCB9fTwvbGFiZWw+XFxuXHQ8ZGl2IGNsYXNzPVwiY29sLXNtLTZcIj5cXG5cdFx0PHNlbGVjdCB2LWlmPVwib3B0aW9uc1wiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdi1tb2RlbD1cInZhbHVlXCIgb3B0aW9ucz1cIm9wdGlvbnNcIiB2LWF0dHI9XCJyZXF1aXJlZDogZmllbGQucmVxdWlyZWRcIj48L3NlbGVjdD5cXG5cdFx0PHAgdi1pZj1cIiFvcHRpb25zXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wtc3RhdGljXCI+XFxuXHRcdFx0PGVtIGNsYXNzPVwidGV4dC1tdXRlZFwiPkxvYWRpbmcge3sgZmllbGQubGFiZWwgfCBsb3dlcmNhc2UgfCBwbHVyYWwgfX0maGVsbGlwOzwvZW0+XFxuXHRcdDwvcD5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwidmFyIEZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKVxuXG52YXIgZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpXG52YXIgdmFsdWVUb1Byb3BlcnR5ID0gcmVxdWlyZSgnLi4vdmFsdWVUb1Byb3BlcnR5JylcbnZhciBtb2RlbHMgPSByZXF1aXJlKCcuLi8uLi8uLi9tb2RlbHMnKVxudmFyIGRhdGFSZWYgPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vZW50cmllcy5maXJlYmFzZUlPLmNvbS9kYXRhLycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRtaXhpbnM6IFtmaWVsZCwgdmFsdWVUb1Byb3BlcnR5XSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vZW50cnkuaHRtbCcpLFxuXHRkYXRhOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG9wdGlvbnM6IG51bGxcblx0XHR9XG5cdH0sXG5cdGNvbXBpbGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIG1vZGVsID0gbW9kZWxzW3RoaXMuZmllbGQubW9kZWxdXG5cblx0XHRkYXRhUmVmLmNoaWxkKG1vZGVsLnByb3BlcnR5KS5vbmNlKCd2YWx1ZScsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuXHRcdFx0Ly8gVE9ETzogZmlndXJlIG91dCBiZXR0ZXIgXCJ1bnNlbGVjdGVkXCIgb3B0aW9uXG5cdFx0XHQvLyAgICAgICBpZGVhbGx5IGFsbG93IHRoZSBkaXNhYmxlZCBhdHRyaWJ1dGUgaW4gaGVyZVxuXHRcdFx0dmFyIG9wdGlvbnMgPSBbeyB0ZXh0OiAnJywgdmFsdWU6IG51bGwgfV1cblx0XHRcdHNuYXBzaG90LmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG5cdFx0XHRcdG9wdGlvbnMucHVzaCh7XG5cdFx0XHRcdFx0dmFsdWU6IGNoaWxkLnJlZigpLnRvU3RyaW5nKCksXG5cdFx0XHRcdFx0Ly8gVE9ETzogbWFrZSB0aGlzIHByb3BlcnR5IGNvbmZpZ3VyYWJsZVxuXHRcdFx0XHRcdHRleHQ6IGNoaWxkLnZhbCgpLm5hbWVcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cdFx0fS5iaW5kKHRoaXMpKVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0cmVwbGFjZTogdHJ1ZSxcblx0cHJvcHM6IFsnZmllbGQnLCAnZW50cnknXVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG5cdDxkaXYgY2xhc3M9XCJjb2wtc20tb2Zmc2V0LTIgY29sLXNtLTZcIj5cXG5cdFx0PGVtIGNsYXNzPVwidGV4dC1tdXRlZFwiIHYtaWY9XCJ1cGxvYWRpbmdcIj5VcGxvYWRpbmcmaGVsbGlwOzwvZW0+XFxuXHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgdi1pZj1cIiF2YWx1ZSAmJiAhdXBsb2FkaW5nXCIgdi1vbj1cImNsaWNrOiB1cGxvYWRcIj5VcGxvYWQge3sgZmllbGQubGFiZWwgfCBsb3dlcmNhc2UgfX08L2J1dHRvbj5cXG5cdFx0PHRlbXBsYXRlIHYtaWY9XCJ2YWx1ZSAmJiAhdXBsb2FkaW5nXCI+XFxuXHRcdFx0PGltZyBjbGFzcz1cImltZy10aHVtYm5haWwgY2xpY2thYmxlXCIgdi1hdHRyPVwic3JjOiB0aHVtYm5haWxcIiB2LW9uPVwiY2xpY2s6IHVwbG9hZFwiPlxcblx0XHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi14cyBidG4tZGVmYXVsdFwiIHYtb249XCJjbGljazogcmVtb3ZlXCI+UmVtb3ZlIHt7IGZpZWxkLmxhYmVsIHwgbG93ZXJjYXNlIH19PC9idXR0b24+XFxuXHRcdDwvdGVtcGxhdGU+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsInZhciBmaWVsZCA9IHJlcXVpcmUoJy4uL2ZpZWxkJylcbnZhciB2YWx1ZVRvUHJvcGVydHkgPSByZXF1aXJlKCcuLi92YWx1ZVRvUHJvcGVydHknKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bWl4aW5zOiBbZmllbGQsIHZhbHVlVG9Qcm9wZXJ0eV0sXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL2ltYWdlLmh0bWwnKSxcblx0ZGF0YTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1cGxvYWRpbmc6IGZhbHNlXG5cdFx0fVxuXHR9LFxuXHRjb21wdXRlZDoge1xuXHRcdHRodW1ibmFpbDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudmFsdWUgKyAnLS9yZXNpemUvMzAwLydcblx0XHR9XG5cdH0sXG5cdG1ldGhvZHM6IHtcblx0XHR1cGxvYWQ6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0XHR2YXIgdm0gPSB0aGlzXG5cblx0XHRcdHVwbG9hZGNhcmUub3BlbkRpYWxvZyhudWxsLCB7XG5cdFx0XHRcdGNyb3A6ICdkaXNhYmxlZCcsXG5cdFx0XHRcdGltYWdlc09ubHk6IHRydWVcblx0XHRcdH0pXG5cdFx0XHQuZG9uZShmdW5jdGlvbiAoZmlsZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnVXBsb2FkaW5nIGZpbGU6JywgZmlsZSlcblx0XHRcdFx0dm0udXBsb2FkaW5nID0gdHJ1ZVxuXG5cdFx0XHRcdGZpbGUucHJvbWlzZSgpXG5cdFx0XHRcdC5hbHdheXMoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZtLnVwbG9hZGluZyA9IGZhbHNlXG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5kb25lKGZ1bmN0aW9uIChmaWxlSW5mbykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdVcGxvYWRlZCBmaWxlIGRhdGE6JywgZmlsZUluZm8pXG5cdFx0XHRcdFx0dm0udmFsdWUgPSBmaWxlSW5mby5vcmlnaW5hbFVybFxuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHR9LFxuXHRcdHJlbW92ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHR0aGlzLnZhbHVlID0gbnVsbFxuXHRcdH1cblx0fVxufVxuIiwidmFyIGZpZWxkID0gcmVxdWlyZSgnLi4vZmllbGQnKVxudmFyIHZhbHVlVG9Qcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL3ZhbHVlVG9Qcm9wZXJ0eScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRtaXhpbnM6IFtmaWVsZCwgdmFsdWVUb1Byb3BlcnR5XSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vbWFya2Rvd24uaHRtbCcpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcblx0PGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBjb2wtc20tMlwiPnt7IGZpZWxkLmxhYmVsIH19PC9sYWJlbD5cXG5cdDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPlxcblx0XHQ8dGV4dGFyZWEgcm93cz1cIjEyXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB2LW1vZGVsPVwidmFsdWVcIiB2LWF0dHI9XCJyZXF1aXJlZDogZmllbGQucmVxdWlyZWRcIj48L3RleHRhcmVhPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCJ2YXIgZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpXG52YXIgdmFsdWVUb1Byb3BlcnR5ID0gcmVxdWlyZSgnLi4vdmFsdWVUb1Byb3BlcnR5JylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG1peGluczogW2ZpZWxkLCB2YWx1ZVRvUHJvcGVydHldLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi90ZXh0Lmh0bWwnKSxcblx0Y29tcHV0ZWQ6IHtcblx0XHRpbnB1dFR5cGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHN3aXRjaCAodGhpcy5maWVsZC50eXBlKSB7XG5cdFx0XHRcdGNhc2UgJ3RleHQnOlxuXHRcdFx0XHRjYXNlICdlbWFpbCc6XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZmllbGQudHlwZVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICd0ZXh0J1xuXHRcdH1cblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG5cdDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgY29sLXNtLTJcIj57eyBmaWVsZC5sYWJlbCB9fTwvbGFiZWw+XFxuXHQ8ZGl2IGNsYXNzPVwiY29sLXNtLTZcIj5cXG5cdFx0PGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdi1tb2RlbD1cInZhbHVlXCIgdi1hdHRyPVwidHlwZTogaW5wdXRUeXBlLCByZXF1aXJlZDogZmllbGQucmVxdWlyZWRcIj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNvbXB1dGVkOiB7XG5cdFx0dmFsdWU6IHtcblx0XHRcdGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRpZiAodGhpcy5lbnRyeSAmJiB0aGlzLmZpZWxkICYmIHRoaXMuZmllbGQucHJvcGVydHkpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5lbnRyeVt0aGlzLmZpZWxkLnByb3BlcnR5XVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0c2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdFx0aWYgKHRoaXMuZW50cnkgJiYgdGhpcy5maWVsZCAmJiB0aGlzLmZpZWxkLnByb3BlcnR5KSB7XG5cdFx0XHRcdFx0dGhpcy5lbnRyeS4kc2V0KHRoaXMuZmllbGQucHJvcGVydHksIHZhbHVlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0cHJvcHM6IFsnbW9kZWxzJywgJ21vZGVsJ10sXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL25hdi5odG1sJyksXG5cdG1ldGhvZHM6IHtcblx0XHRpc0FjdGl2ZTogZnVuY3Rpb24gKHByb3BlcnR5KSB7XG5cdFx0XHRyZXR1cm4gcHJvcGVydHkgPT09IHRoaXMubW9kZWxcblx0XHR9XG5cdH0sXG5cdGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLiR3YXRjaCgnbW9kZWwnLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLiRyb290KVxuXHRcdH0pXG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJsaXN0LWdyb3VwXCI+XFxuXHQ8YSB2LXJlcGVhdD1cIm1vZGVsc1wiIGhyZWY9XCIjL3t7IHByb3BlcnR5IH19XCIgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW1cIiB2LWNsYXNzPVwiYWN0aXZlOiBpc0FjdGl2ZShwcm9wZXJ0eSlcIj57eyBsYWJlbCB8IHBsdXJhbCB9fTwvYT5cXG48L2Rpdj5cXG4nOyIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cXG5cdDxkaXYgY2xhc3M9XCJyb3dcIj5cXG5cdFx0PGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+XFxuXHRcdFx0PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cIkZpbmQgY29udGVudCZoZWxsaXA7XCI+XFxuXHRcdFx0PGhyPlxcblx0XHRcdDxuYXYgbW9kZWxzPVwie3sgbW9kZWxzIH19XCIgbW9kZWw9XCJ7eyByb3V0ZS5wYXJhbXMubW9kZWwgfX1cIj48L25hdj5cXG5cdFx0PC9kaXY+XFxuXHRcdDxkaXYgY2xhc3M9XCJjb2wtc20tMTBcIj5cXG5cdFx0XHQ8cm91dGVyLXZpZXc+PC9yb3V0ZXItdmlldz5cXG5cdFx0PC9kaXY+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsInZhciBWdWUgPSByZXF1aXJlKCd2dWUnKVxudmFyIFJvdXRlciA9IHJlcXVpcmUoJ3Z1ZS1yb3V0ZXInKVxudmFyIHBsdXJhbGl6ZSA9IHJlcXVpcmUoJ3BsdXJhbGl6ZScpXG5cbnZhciBtb2RlbHMgPSByZXF1aXJlKCcuL21vZGVscycpXG5cblxuVnVlLnVzZShSb3V0ZXIpXG5cblxudmFyIGFwcCA9IG5ldyBWdWUoe1xuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi9jb250YWluZXIuaHRtbCcpLFxuXHRjb21wb25lbnRzOiB7XG5cdFx0bmF2OiByZXF1aXJlKCcuL2NvbXBvbmVudHMvbmF2JyksXG5cdFx0J3ZpZXctZW50cmllcyc6IHJlcXVpcmUoJy4vdmlld3MvZW50cmllcycpLFxuXHRcdCd2aWV3LWVudHJ5JzogcmVxdWlyZSgnLi92aWV3cy9lbnRyeScpXG5cdH0sXG5cdGZpbHRlcnM6IHtcblx0XHRwbHVyYWw6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0cmV0dXJuIHBsdXJhbGl6ZSh2YWx1ZSlcblx0XHR9XG5cdH0sXG5cdGRhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dmlldzogbnVsbCxcblx0XHRcdGFjdGl2ZU1vZGVsOiBudWxsLFxuXHRcdFx0bW9kZWw6IG51bGwsXG5cdFx0XHRhY3RpdmVFbnRyeTogbnVsbCxcblx0XHRcdGVudHJ5OiBudWxsXG5cdFx0fVxuXHR9LFxuXHRjb21wdXRlZDoge1xuXHRcdG1vZGVsczogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIG1vZGVsc1xuXHRcdH1cblx0fVxufSlcblxuXG52YXIgcm91dGVyID0gbmV3IFJvdXRlcih7IGhhc2hiYW5nOiBmYWxzZSB9KVxuXG5yb3V0ZXIubWFwKHtcblx0Jy86bW9kZWwnOiB7XG5cdFx0Y29tcG9uZW50OiAndmlldy1lbnRyaWVzJ1xuXHR9LFxuXHQnLzptb2RlbC86aWQnOiB7XG5cdFx0Y29tcG9uZW50OiAndmlldy1lbnRyeSdcblx0fVxufSlcblxucm91dGVyLnJlZGlyZWN0KHtcblx0Jy8nOiAnLycgKyBtb2RlbHNbT2JqZWN0LmtleXMobW9kZWxzKVswXV0ucHJvcGVydHlcbn0pXG5cblxucm91dGVyLnN0YXJ0KGFwcClcbmFwcC4kbW91bnQoZG9jdW1lbnQuYm9keSlcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRsYWJlbDogJ0F1dGhvcicsXG5cdHByb3BlcnR5OiAnYXV0aG9ycycsXG5cdHR5cGU6ICdjb2xsZWN0aW9uJyxcblx0ZmllbGRzOiBbXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdOYW1lJyxcblx0XHRcdHByb3BlcnR5OiAnbmFtZScsXG5cdFx0XHR0eXBlOiAndGV4dCcsXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdGxpc3RlZDogdHJ1ZVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdUd2l0dGVyJyxcblx0XHRcdHByb3BlcnR5OiAndHdpdHRlcicsXG5cdFx0XHR0eXBlOiAndGV4dCcsXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdGxpc3RlZDogdHJ1ZVxuXHRcdH1cblx0XVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdHBvc3RzOiByZXF1aXJlKCcuL3Bvc3QnKSxcblx0YXV0aG9yczogcmVxdWlyZSgnLi9hdXRob3InKVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGxhYmVsOiAnQmxvZyBwb3N0Jyxcblx0cHJvcGVydHk6ICdwb3N0cycsXG5cdHR5cGU6ICdjb2xsZWN0aW9uJyxcblx0ZmllbGRzOiBbXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdUaXRsZScsXG5cdFx0XHRwcm9wZXJ0eTogJ3RpdGxlJyxcblx0XHRcdHR5cGU6ICd0ZXh0Jyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlLFxuXHRcdFx0bGlzdGVkOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ0F1dGhvcicsXG5cdFx0XHRwcm9wZXJ0eTogJ2F1dGhvcicsXG5cdFx0XHR0eXBlOiAnZW50cnknLFxuXHRcdFx0bW9kZWw6ICdhdXRob3JzJyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ0hlYWRlciBpbWFnZScsXG5cdFx0XHRwcm9wZXJ0eTogJ2hlYWRlcl9pbWFnZScsXG5cdFx0XHR0eXBlOiAnaW1hZ2UnXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRsYWJlbDogJ1Bvc3QgYm9keScsXG5cdFx0XHRwcm9wZXJ0eTogJ2JvZHknLFxuXHRcdFx0dHlwZTogJ21hcmtkb3duJyxcblx0XHRcdHJlcXVpcmVkOiB0cnVlXG5cdFx0fVxuXHRdXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8dGVtcGxhdGUgdi1pZj1cIm1vZGVsXCI+XFxuXHQ8YSBocmVmPVwiIy97eyBtb2RlbC5wcm9wZXJ0eSB9fS9uZXdcIiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBwdWxsLXJpZ2h0XCI+QWRkIG5ldyB7eyBtb2RlbC5sYWJlbCB8IGxvd2VyY2FzZSB9fTwvYT5cXG5cdDx0YWJsZSBjbGFzcz1cInRhYmxlIHRhYmxlLWhvdmVyXCI+XFxuXHRcdDx0aGVhZD5cXG5cdFx0XHQ8dHI+XFxuXHRcdFx0XHQ8dGggdi1yZXBlYXQ9XCJmaWVsZHNcIj57eyBsYWJlbCB9fTwvdGg+XFxuXHRcdFx0PC90cj5cXG5cdFx0PC90aGVhZD5cXG5cdFx0PHRib2R5IHYtaWY9XCJlbnRyaWVzXCI+XFxuXHRcdFx0PHRyIHYtcmVwZWF0PVwiZW50cnkgOiBlbnRyaWVzXCIgdi1vbj1cImNsaWNrOiBlZGl0KCRldmVudCwgJGtleSlcIiBkYXRhLWlkPVwie3sgJGtleSB9fVwiIGNsYXNzPVwiY2xpY2thYmxlXCI+XFxuXHRcdFx0XHQ8dGQgdi1yZXBlYXQ9XCJmaWVsZHNcIj57eyBlbnRyeVtwcm9wZXJ0eV0gfX08L3RkPlxcblx0XHRcdDwvdHI+XFxuXHRcdDwvdGJvZHk+XFxuXHRcdDx0Ym9keSB2LWlmPVwiIWVudHJpZXNcIj5cXG5cdFx0XHQ8dHI+XFxuXHRcdFx0XHQ8dGQgY29sc3Bhbj1cInt7IG1vZGVsLmZpZWxkcy5sZW5ndGggfX1cIj5cXG5cdFx0XHRcdFx0PGVtIGNsYXNzPVwidGV4dC1tdXRlZFwiPkxvYWRpbmcge3sgbW9kZWwubGFiZWwgfCBsb3dlcmNhc2UgfCBwbHVyYWwgfX0maGVsbGlwOzwvZW0+XFxuXHRcdFx0XHQ8L3RkPlxcblx0XHRcdDwvdHI+XFxuXHRcdDwvdGJvZHk+XFxuXHQ8L3RhYmxlPlxcbjwvdGVtcGxhdGU+XFxuJzsiLCJ2YXIgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpXG52YXIgbW9kZWxzID0gcmVxdWlyZSgnLi4vLi4vbW9kZWxzJylcblxudmFyIGRhdGFSZWYgPSBuZXcgRmlyZWJhc2UoJ2h0dHBzOi8vZW50cmllcy5maXJlYmFzZUlPLmNvbS9kYXRhLycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRpbmhlcml0OiB0cnVlLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi9lbnRyaWVzLmh0bWwnKSxcblx0bWV0aG9kczoge1xuXHRcdGxvYWRFbnRyaWVzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLiRkZWxldGUoJ2VudHJpZXMnKVxuXHRcdFx0dGhpcy5lbnRyaWVzUmVmLm9uY2UoJ3ZhbHVlJywgZnVuY3Rpb24gKHNuYXBzaG90KSB7XG5cdFx0XHRcdHRoaXMuJHNldCgnZW50cmllcycsIHNuYXBzaG90LnZhbCgpKVxuXHRcdFx0fS5iaW5kKHRoaXMpKVxuXHRcdH0sXG5cdFx0ZWRpdDogZnVuY3Rpb24gKGV2ZW50LCBpZCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXHRcdFx0aWYgKGlkKSB7XG5cdFx0XHRcdGxvY2F0aW9uLmFzc2lnbignIy8nICsgdGhpcy5tb2RlbC5wcm9wZXJ0eSArICcvJyArIGlkKVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblx0Y29tcHV0ZWQ6IHtcblx0XHRwYXRoOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yb3V0ZS5wYXJhbXMubW9kZWxcblx0XHR9LFxuXHRcdG1vZGVsOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gbW9kZWxzW3RoaXMucm91dGUucGFyYW1zLm1vZGVsXVxuXHRcdH0sXG5cdFx0ZmllbGRzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RlbC5maWVsZHMuZmlsdGVyKGZ1bmN0aW9uIChmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIGZpbHRlci5saXN0ZWRcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRlbnRyaWVzUmVmOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZGF0YVJlZi5jaGlsZCh0aGlzLm1vZGVsLnByb3BlcnR5KVxuXHRcdH1cblx0fSxcblx0Y3JlYXRlZDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuJHdhdGNoKCdwYXRoJywgdGhpcy5sb2FkRW50cmllcywgZmFsc2UsIHRydWUpXG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gJzx0ZW1wbGF0ZSB2LWlmPVwiZW50cnlcIj5cXG5cdDxmb3JtIHYtb249XCJzdWJtaXQ6IHNhdmUoJGV2ZW50KVwiIGNsYXNzPVwiZm9ybS1ob3Jpem9udGFsXCI+XFxuXHRcdDxmaWVsZHNldD5cXG5cdFx0XHQ8bGVnZW5kIHYtaWY9XCJpc05ld1wiPlxcblx0XHRcdFx0TmV3IHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIH19XFxuXHRcdFx0PC9sZWdlbmQ+XFxuXHRcdFx0PGxlZ2VuZCB2LWlmPVwiIWlzTmV3XCI+XFxuXHRcdFx0XHRFZGl0IHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIH19XFxuXHRcdFx0XHQ8c21hbGwgY2xhc3M9XCJ0ZXh0LW11dGVkIHB1bGwtcmlnaHRcIj57eyBpZCB9fTwvc21hbGw+XFxuXHRcdFx0PC9sZWdlbmQ+XFxuXFxuXHRcdFx0PHRlbXBsYXRlIHYtcmVwZWF0PVwiZmllbGQ6IG1vZGVsLmZpZWxkc1wiPlxcblx0XHRcdFx0PGNvbXBvbmVudCBpcz1cInt7IGNvbXBvbmVudEZvcihmaWVsZC50eXBlKSB9fVwiIGZpZWxkPVwie3sgZmllbGQgfX1cIiBlbnRyeT1cInt7IGVudHJ5IH19XCI+PC9jb21wb25lbnQ+XFxuXHRcdFx0PC90ZW1wbGF0ZT5cXG5cdFx0XHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcblx0XHRcdFx0PGRpdiBjbGFzcz1cImNvbC1zbS1vZmZzZXQtMiBjb2wtc20tMlwiPlxcblx0XHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzIGJ0bi1sZ1wiIHR5cGU9XCJzdWJtaXRcIj5TYXZlPC9idXR0b24+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHQ8L2Rpdj5cXG5cdFx0PC9maWVsZHNldD5cXG5cdDwvZm9ybT5cXG5cdDxwIGNsYXNzPVwidGV4dC1yaWdodFwiIHYtaWY9XCIhaXNOZXdcIj5cXG5cdFx0PGJ1dHRvbiB2LW9uPVwiY2xpY2s6IHJlbW92ZSgkZXZlbnQpXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCI+XFxuXHRcdFx0RGVsZXRlIHRoaXMge3sgbW9kZWwubGFiZWwgfCBsb3dlcmNhc2UgfX0/XFxuXHRcdDwvYnV0dG9uPlxcblx0PC9wPlxcbjwvdGVtcGxhdGU+XFxuXFxuPGVtIHYtaWY9XCIhZW50cnlcIiBjbGFzcz1cInRleHQtbXV0ZWRcIj5Mb2FkaW5nIHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIH19JmhlbGxpcDs8L2VtPlxcbic7IiwidmFyIEZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKVxudmFyIG1vZGVscyA9IHJlcXVpcmUoJy4uLy4uL21vZGVscycpXG5cbnZhciBkYXRhUmVmID0gbmV3IEZpcmViYXNlKCdodHRwczovL2VudHJpZXMuZmlyZWJhc2VJTy5jb20vZGF0YS8nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5oZXJpdDogdHJ1ZSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vZW50cnkuaHRtbCcpLFxuXHRjb21wb25lbnRzOiB7XG5cdFx0dGV4dEZpZWxkOiByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL2ZpZWxkcy90ZXh0JyksXG5cdFx0bWFya2Rvd25GaWVsZDogcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9maWVsZHMvbWFya2Rvd24nKSxcblx0XHRlbnRyeUZpZWxkOiByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL2ZpZWxkcy9lbnRyeScpLFxuXHRcdGltYWdlRmllbGQ6IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvZmllbGRzL2ltYWdlJylcblx0fSxcblx0bWV0aG9kczoge1xuXHRcdGxvYWRFbnRyeTogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHZtID0gdGhpc1xuXG5cdFx0XHRmdW5jdGlvbiBzZXQgKGVudHJ5KSB7XG5cdFx0XHRcdHZtLiRzZXQoJ2VudHJ5JywgZW50cnkpXG5cdFx0XHRcdHZhciB1bndhdGNoID0gdm0uJHdhdGNoKCdlbnRyeScsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2bS4kc2V0KCdoYXNDaGFuZ2VkJywgdHJ1ZSlcblx0XHRcdFx0XHR1bndhdGNoKClcblx0XHRcdFx0fSwgdHJ1ZSlcblx0XHRcdH1cblxuXHRcdFx0aWYgKHZtLmlzTmV3KSB7XG5cdFx0XHRcdHNldCh7fSlcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cblx0XHRcdHZtLmVudHJ5ID0gbnVsbFxuXHRcdFx0dm0uZW50cnlSZWYub25jZSgndmFsdWUnLCBmdW5jdGlvbiAoc25hcHNob3QpIHtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c2V0KHNuYXBzaG90LnZhbCgpKVxuXHRcdFx0XHR9LCAyMDAwKVxuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGNvbXBvbmVudEZvcjogZnVuY3Rpb24gKHR5cGUpIHtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlICd0ZXh0Jzpcblx0XHRcdFx0XHRyZXR1cm4gJ3RleHRGaWVsZCdcblx0XHRcdFx0Y2FzZSAnbWFya2Rvd24nOlxuXHRcdFx0XHRcdHJldHVybiAnbWFya2Rvd25GaWVsZCdcblx0XHRcdFx0Y2FzZSAnZW50cnknOlxuXHRcdFx0XHRcdHJldHVybiAnZW50cnlGaWVsZCdcblx0XHRcdFx0Y2FzZSAnaW1hZ2UnOlxuXHRcdFx0XHRcdHJldHVybiAnaW1hZ2VGaWVsZCdcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRyZXR1cm4gJ3RleHRGaWVsZCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNhdmU6IGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG5cdFx0XHR2YXIgdm0gPSB0aGlzXG5cblx0XHRcdHZhciBkb25lID0gKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBzYXZlOicsIGVycilcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR2bS4kc2V0KCdoYXNDaGFuZ2VkJywgZmFsc2UpXG5cdFx0XHRcdFx0bG9jYXRpb24uYXNzaWduKCcjLycgKyB2bS5tb2RlbC5wcm9wZXJ0eSlcblx0XHRcdFx0fVxuXHRcdFx0fSlcblxuXHRcdFx0Ly8gc2tpcCBzYXZlIHdoZW4gbm90aGluZyBoYXMgY2hhbmdlZFxuXHRcdFx0aWYgKCF2bS5oYXNDaGFuZ2VkKSByZXR1cm4gZG9uZSgpXG5cblx0XHRcdGlmICh2bS5pc05ldykge1xuXHRcdFx0XHR2bS5lbnRyaWVzUmVmLnB1c2godm0uZW50cnksIGRvbmUpXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dm0uZW50cnlSZWYudXBkYXRlKHZtLmVudHJ5LCBkb25lKVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXHRcdFx0Ly8gVE9ETzogYWRkIHVuZG9cblx0XHRcdGlmICghd2luZG93LmNvbmZpcm0oJ1RoaXMgY2Fubm90IGJlIHVuZG9uZS4gQ29udGludWU/JykpIHtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZW50cnlSZWYucmVtb3ZlKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCByZW1vdmU6JywgZXJyKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGxvY2F0aW9uLmFzc2lnbignIy8nICsgdGhpcy5tb2RlbC5wcm9wZXJ0eSlcblx0XHRcdFx0fVxuXHRcdFx0fS5iaW5kKHRoaXMpKVxuXHRcdH1cblx0fSxcblx0Y29tcHV0ZWQ6IHtcblx0XHRwYXRoOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yb3V0ZS5wYXJhbXMubW9kZWwgKyAnLycgKyB0aGlzLnJvdXRlLnBhcmFtcy5pZFxuXHRcdH0sXG5cdFx0bW9kZWw6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBtb2RlbHNbdGhpcy5yb3V0ZS5wYXJhbXMubW9kZWxdXG5cdFx0fSxcblx0XHRpZDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMucm91dGUucGFyYW1zLmlkXG5cdFx0fSxcblx0XHRlbnRyaWVzUmVmOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZGF0YVJlZi5jaGlsZCh0aGlzLm1vZGVsLnByb3BlcnR5KVxuXHRcdH0sXG5cdFx0ZW50cnlSZWY6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLmVudHJpZXNSZWYuY2hpbGQodGhpcy5pZClcblx0XHR9LFxuXHRcdGlzTmV3OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pZCA9PT0gJ25ldydcblx0XHR9XG5cdH0sXG5cdGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLiR3YXRjaCgncGF0aCcsIHRoaXMubG9hZEVudHJ5LCBmYWxzZSwgdHJ1ZSlcblx0fSxcblx0YXR0YWNoZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdm0gPSB0aGlzXG5cdFx0Ly8gVE9ETzogbWFrZSB0aGlzIHdvcmsgZm9yIGJhY2sgYnV0dG9uIChwdXNoIHN0YXRlKVxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdGlmICh2bS5oYXNDaGFuZ2VkKSB7XG5cdFx0XHRcdHZhciBjb25maXJtID0gJ1lvdSBoYXZlIHVuc2F2ZWQgY2hhbmdlcy5cXG5MZWF2aW5nIHRoaXMgcGFnZSB3aWxsIGRpc2NhcmQgdGhlc2UgY2hhbmdlcy4nXG5cblx0XHRcdFx0cmV0dXJuIChldmVudCB8fCB3aW5kb3cuZXZlbnQpLnJldHVyblZhbHVlID0gY29uZmlybVxuXHRcdFx0fVxuXHRcdH0sIGZhbHNlKVxuXHR9XG59XG4iXX0=
