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

// router.on('/', function () {
// 	for (var k in models) {
// 		location.replace('#/' + models[k].property)
// 		return
// 	}
// })

// router.on('/:type', function (type) {
// 	app.view = 'entriesView'
// 	app.model = models[type]
// 	app.activeModel = app.model ? type : null
// })

// router.on('/:type/:id', function (type, id) {
// 	app.view = 'entryView'
// 	app.model = models[type]
// 	app.activeModel = app.model ? type : null
// 	app.activeEntry = id
// })

// router.configure({
// 	notfound: function () {
// 		console.log('No route found for path:', this.path)
// 	}
// })

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
		edit: function (event, id) {
			event.preventDefault()
			if (id) {
				location.assign('#/' + this.model.property + '/' + id)
			}
		}
	},
	computed: {
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
		this.entriesRef.once('value', function (snapshot) {
			this.$set('entries', snapshot.val())
		}.bind(this))
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

		vm.entryRef.once('value', function (snapshot) {
			set(snapshot.val())
		})
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmlyZWJhc2UvbGliL2ZpcmViYXNlLXdlYi5qcyIsIm5vZGVfbW9kdWxlcy9wbHVyYWxpemUvcGx1cmFsaXplLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS1yb3V0ZXIvbm9kZV9tb2R1bGVzL2luc2VydC1jc3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlLXJvdXRlci9ub2RlX21vZHVsZXMvcm91dGUtcmVjb2duaXplci9kaXN0L3JvdXRlLXJlY29nbml6ZXIuanMiLCJub2RlX21vZHVsZXMvdnVlLXJvdXRlci9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlLXJvdXRlci9zcmMvbGluay5qcyIsIm5vZGVfbW9kdWxlcy92dWUtcm91dGVyL3NyYy92aWV3LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2NoaWxkLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2RhdGEuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvZG9tLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYXBpL2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2FwaS9nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9hcGkvbGlmZWN5Y2xlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvYmF0Y2hlci5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NhY2hlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvY29tcGlsZXIvY29tcGlsZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2NvbXBpbGVyL3RyYW5zY2x1ZGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9jb25maWcuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2F0dHIuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL2NsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9jbG9hay5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvY29tcG9uZW50LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9lbC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9odG1sLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9pZi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL2NoZWNrYm94LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9kZWZhdWx0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9tb2RlbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvbW9kZWwvcmFkaW8uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL21vZGVsL3NlbGVjdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvb24uanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3Byb3AuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9kaXJlY3RpdmVzL3JlZi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvcmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9zaG93LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvZGlyZWN0aXZlcy9zdHlsZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvdGV4dC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2RpcmVjdGl2ZXMvdHJhbnNpdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2ZpbHRlcnMvYXJyYXktZmlsdGVycy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2ZpbHRlcnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9jb21waWxlLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2UvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvaW5zdGFuY2UvaW5pdC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL2luc3RhbmNlL21pc2MuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9pbnN0YW5jZS9zY29wZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL29ic2VydmVyL2FycmF5LmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvb2JzZXJ2ZXIvZGVwLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvb2JzZXJ2ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9vYnNlcnZlci9vYmplY3QuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL2RpcmVjdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvZXhwcmVzc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvcGF0aC5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3BhcnNlcnMvdGVtcGxhdGUuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy9wYXJzZXJzL3RleHQuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uL2Nzcy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3RyYW5zaXRpb24vaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy90cmFuc2l0aW9uL2pzLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9kZWJ1Zy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvZG9tLmpzIiwibm9kZV9tb2R1bGVzL3Z1ZS9zcmMvdXRpbC9lbnYuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2ZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL2xhbmcuanMiLCJub2RlX21vZHVsZXMvdnVlL3NyYy91dGlsL21lcmdlLW9wdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3V0aWwvbWlzYy5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3Z1ZS5qcyIsIm5vZGVfbW9kdWxlcy92dWUvc3JjL3dhdGNoZXIuanMiLCJzcmMvY29tcG9uZW50cy9maWVsZHMvZW50cnkvZW50cnkuaHRtbCIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy9lbnRyeS9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy9maWVsZC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy9pbWFnZS9pbWFnZS5odG1sIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL2ltYWdlL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL21hcmtkb3duL2luZGV4LmpzIiwic3JjL2NvbXBvbmVudHMvZmllbGRzL21hcmtkb3duL21hcmtkb3duLmh0bWwiLCJzcmMvY29tcG9uZW50cy9maWVsZHMvdGV4dC9pbmRleC5qcyIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy90ZXh0L3RleHQuaHRtbCIsInNyYy9jb21wb25lbnRzL2ZpZWxkcy92YWx1ZVRvUHJvcGVydHkuanMiLCJzcmMvY29tcG9uZW50cy9uYXYvaW5kZXguanMiLCJzcmMvY29tcG9uZW50cy9uYXYvbmF2Lmh0bWwiLCJzcmMvY29udGFpbmVyLmh0bWwiLCJzcmMvaW5kZXguanMiLCJzcmMvbW9kZWxzL2F1dGhvci5qcyIsInNyYy9tb2RlbHMvaW5kZXguanMiLCJzcmMvbW9kZWxzL3Bvc3QuanMiLCJzcmMvdmlld3MvZW50cmllcy9lbnRyaWVzLmh0bWwiLCJzcmMvdmlld3MvZW50cmllcy9pbmRleC5qcyIsInNyYy92aWV3cy9lbnRyeS9lbnRyeS5odG1sIiwic3JjL3ZpZXdzL2VudHJ5L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdm9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqc0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2htQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25RQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohIEBsaWNlbnNlIEZpcmViYXNlIHYyLjIuNFxuICAgIExpY2Vuc2U6IGh0dHBzOi8vd3d3LmZpcmViYXNlLmNvbS90ZXJtcy90ZXJtcy1vZi1zZXJ2aWNlLmh0bWwgKi9cbihmdW5jdGlvbigpIHt2YXIgaCxhYT10aGlzO2Z1bmN0aW9uIG4oYSl7cmV0dXJuIHZvaWQgMCE9PWF9ZnVuY3Rpb24gYmEoKXt9ZnVuY3Rpb24gY2EoYSl7YS51Yj1mdW5jdGlvbigpe3JldHVybiBhLnRmP2EudGY6YS50Zj1uZXcgYX19XG5mdW5jdGlvbiBkYShhKXt2YXIgYj10eXBlb2YgYTtpZihcIm9iamVjdFwiPT1iKWlmKGEpe2lmKGEgaW5zdGFuY2VvZiBBcnJheSlyZXR1cm5cImFycmF5XCI7aWYoYSBpbnN0YW5jZW9mIE9iamVjdClyZXR1cm4gYjt2YXIgYz1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSk7aWYoXCJbb2JqZWN0IFdpbmRvd11cIj09YylyZXR1cm5cIm9iamVjdFwiO2lmKFwiW29iamVjdCBBcnJheV1cIj09Y3x8XCJudW1iZXJcIj09dHlwZW9mIGEubGVuZ3RoJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5zcGxpY2UmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLnByb3BlcnR5SXNFbnVtZXJhYmxlJiYhYS5wcm9wZXJ0eUlzRW51bWVyYWJsZShcInNwbGljZVwiKSlyZXR1cm5cImFycmF5XCI7aWYoXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT1jfHxcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5jYWxsJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgYS5wcm9wZXJ0eUlzRW51bWVyYWJsZSYmIWEucHJvcGVydHlJc0VudW1lcmFibGUoXCJjYWxsXCIpKXJldHVyblwiZnVuY3Rpb25cIn1lbHNlIHJldHVyblwibnVsbFwiO1xuZWxzZSBpZihcImZ1bmN0aW9uXCI9PWImJlwidW5kZWZpbmVkXCI9PXR5cGVvZiBhLmNhbGwpcmV0dXJuXCJvYmplY3RcIjtyZXR1cm4gYn1mdW5jdGlvbiBlYShhKXtyZXR1cm5cImFycmF5XCI9PWRhKGEpfWZ1bmN0aW9uIGZhKGEpe3ZhciBiPWRhKGEpO3JldHVyblwiYXJyYXlcIj09Ynx8XCJvYmplY3RcIj09YiYmXCJudW1iZXJcIj09dHlwZW9mIGEubGVuZ3RofWZ1bmN0aW9uIHAoYSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGF9ZnVuY3Rpb24gZ2EoYSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGF9ZnVuY3Rpb24gaGEoYSl7cmV0dXJuXCJmdW5jdGlvblwiPT1kYShhKX1mdW5jdGlvbiBpYShhKXt2YXIgYj10eXBlb2YgYTtyZXR1cm5cIm9iamVjdFwiPT1iJiZudWxsIT1hfHxcImZ1bmN0aW9uXCI9PWJ9ZnVuY3Rpb24gamEoYSxiLGMpe3JldHVybiBhLmNhbGwuYXBwbHkoYS5iaW5kLGFyZ3VtZW50cyl9XG5mdW5jdGlvbiBrYShhLGIsYyl7aWYoIWEpdGhyb3cgRXJyb3IoKTtpZigyPGFyZ3VtZW50cy5sZW5ndGgpe3ZhciBkPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywyKTtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO0FycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KGMsZCk7cmV0dXJuIGEuYXBwbHkoYixjKX19cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkoYixhcmd1bWVudHMpfX1mdW5jdGlvbiBxKGEsYixjKXtxPUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kJiYtMSE9RnVuY3Rpb24ucHJvdG90eXBlLmJpbmQudG9TdHJpbmcoKS5pbmRleE9mKFwibmF0aXZlIGNvZGVcIik/amE6a2E7cmV0dXJuIHEuYXBwbHkobnVsbCxhcmd1bWVudHMpfXZhciBsYT1EYXRlLm5vd3x8ZnVuY3Rpb24oKXtyZXR1cm4rbmV3IERhdGV9O1xuZnVuY3Rpb24gbWEoYSxiKXtmdW5jdGlvbiBjKCl7fWMucHJvdG90eXBlPWIucHJvdG90eXBlO2EuWmc9Yi5wcm90b3R5cGU7YS5wcm90b3R5cGU9bmV3IGM7YS5wcm90b3R5cGUuY29uc3RydWN0b3I9YTthLlZnPWZ1bmN0aW9uKGEsYyxmKXtmb3IodmFyIGc9QXJyYXkoYXJndW1lbnRzLmxlbmd0aC0yKSxrPTI7azxhcmd1bWVudHMubGVuZ3RoO2srKylnW2stMl09YXJndW1lbnRzW2tdO3JldHVybiBiLnByb3RvdHlwZVtjXS5hcHBseShhLGcpfX07ZnVuY3Rpb24gcihhLGIpe2Zvcih2YXIgYyBpbiBhKWIuY2FsbCh2b2lkIDAsYVtjXSxjLGEpfWZ1bmN0aW9uIG5hKGEsYil7dmFyIGM9e30sZDtmb3IoZCBpbiBhKWNbZF09Yi5jYWxsKHZvaWQgMCxhW2RdLGQsYSk7cmV0dXJuIGN9ZnVuY3Rpb24gb2EoYSxiKXtmb3IodmFyIGMgaW4gYSlpZighYi5jYWxsKHZvaWQgMCxhW2NdLGMsYSkpcmV0dXJuITE7cmV0dXJuITB9ZnVuY3Rpb24gcGEoYSl7dmFyIGI9MCxjO2ZvcihjIGluIGEpYisrO3JldHVybiBifWZ1bmN0aW9uIHFhKGEpe2Zvcih2YXIgYiBpbiBhKXJldHVybiBifWZ1bmN0aW9uIHJhKGEpe3ZhciBiPVtdLGM9MCxkO2ZvcihkIGluIGEpYltjKytdPWFbZF07cmV0dXJuIGJ9ZnVuY3Rpb24gc2EoYSl7dmFyIGI9W10sYz0wLGQ7Zm9yKGQgaW4gYSliW2MrK109ZDtyZXR1cm4gYn1mdW5jdGlvbiB0YShhLGIpe2Zvcih2YXIgYyBpbiBhKWlmKGFbY109PWIpcmV0dXJuITA7cmV0dXJuITF9XG5mdW5jdGlvbiB1YShhLGIsYyl7Zm9yKHZhciBkIGluIGEpaWYoYi5jYWxsKGMsYVtkXSxkLGEpKXJldHVybiBkfWZ1bmN0aW9uIHZhKGEsYil7dmFyIGM9dWEoYSxiLHZvaWQgMCk7cmV0dXJuIGMmJmFbY119ZnVuY3Rpb24gd2EoYSl7Zm9yKHZhciBiIGluIGEpcmV0dXJuITE7cmV0dXJuITB9ZnVuY3Rpb24geGEoYSl7dmFyIGI9e30sYztmb3IoYyBpbiBhKWJbY109YVtjXTtyZXR1cm4gYn12YXIgeWE9XCJjb25zdHJ1Y3RvciBoYXNPd25Qcm9wZXJ0eSBpc1Byb3RvdHlwZU9mIHByb3BlcnR5SXNFbnVtZXJhYmxlIHRvTG9jYWxlU3RyaW5nIHRvU3RyaW5nIHZhbHVlT2ZcIi5zcGxpdChcIiBcIik7XG5mdW5jdGlvbiB6YShhLGIpe2Zvcih2YXIgYyxkLGU9MTtlPGFyZ3VtZW50cy5sZW5ndGg7ZSsrKXtkPWFyZ3VtZW50c1tlXTtmb3IoYyBpbiBkKWFbY109ZFtjXTtmb3IodmFyIGY9MDtmPHlhLmxlbmd0aDtmKyspYz15YVtmXSxPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZCxjKSYmKGFbY109ZFtjXSl9fTtmdW5jdGlvbiBBYShhKXthPVN0cmluZyhhKTtpZigvXlxccyokLy50ZXN0KGEpPzA6L15bXFxdLDp7fVxcc1xcdTIwMjhcXHUyMDI5XSokLy50ZXN0KGEucmVwbGFjZSgvXFxcXFtcIlxcXFxcXC9iZm5ydHVdL2csXCJAXCIpLnJlcGxhY2UoL1wiW15cIlxcXFxcXG5cXHJcXHUyMDI4XFx1MjAyOVxceDAwLVxceDA4XFx4MGEtXFx4MWZdKlwifHRydWV8ZmFsc2V8bnVsbHwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPy9nLFwiXVwiKS5yZXBsYWNlKC8oPzpefDp8LCkoPzpbXFxzXFx1MjAyOFxcdTIwMjldKlxcWykrL2csXCJcIikpKXRyeXtyZXR1cm4gZXZhbChcIihcIithK1wiKVwiKX1jYXRjaChiKXt9dGhyb3cgRXJyb3IoXCJJbnZhbGlkIEpTT04gc3RyaW5nOiBcIithKTt9ZnVuY3Rpb24gQmEoKXt0aGlzLlBkPXZvaWQgMH1cbmZ1bmN0aW9uIENhKGEsYixjKXtzd2l0Y2godHlwZW9mIGIpe2Nhc2UgXCJzdHJpbmdcIjpEYShiLGMpO2JyZWFrO2Nhc2UgXCJudW1iZXJcIjpjLnB1c2goaXNGaW5pdGUoYikmJiFpc05hTihiKT9iOlwibnVsbFwiKTticmVhaztjYXNlIFwiYm9vbGVhblwiOmMucHVzaChiKTticmVhaztjYXNlIFwidW5kZWZpbmVkXCI6Yy5wdXNoKFwibnVsbFwiKTticmVhaztjYXNlIFwib2JqZWN0XCI6aWYobnVsbD09Yil7Yy5wdXNoKFwibnVsbFwiKTticmVha31pZihlYShiKSl7dmFyIGQ9Yi5sZW5ndGg7Yy5wdXNoKFwiW1wiKTtmb3IodmFyIGU9XCJcIixmPTA7ZjxkO2YrKyljLnB1c2goZSksZT1iW2ZdLENhKGEsYS5QZD9hLlBkLmNhbGwoYixTdHJpbmcoZiksZSk6ZSxjKSxlPVwiLFwiO2MucHVzaChcIl1cIik7YnJlYWt9Yy5wdXNoKFwie1wiKTtkPVwiXCI7Zm9yKGYgaW4gYilPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYixmKSYmKGU9YltmXSxcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiYoYy5wdXNoKGQpLERhKGYsYyksXG5jLnB1c2goXCI6XCIpLENhKGEsYS5QZD9hLlBkLmNhbGwoYixmLGUpOmUsYyksZD1cIixcIikpO2MucHVzaChcIn1cIik7YnJlYWs7Y2FzZSBcImZ1bmN0aW9uXCI6YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcihcIlVua25vd24gdHlwZTogXCIrdHlwZW9mIGIpO319dmFyIEVhPXsnXCInOidcXFxcXCInLFwiXFxcXFwiOlwiXFxcXFxcXFxcIixcIi9cIjpcIlxcXFwvXCIsXCJcXGJcIjpcIlxcXFxiXCIsXCJcXGZcIjpcIlxcXFxmXCIsXCJcXG5cIjpcIlxcXFxuXCIsXCJcXHJcIjpcIlxcXFxyXCIsXCJcXHRcIjpcIlxcXFx0XCIsXCJcXHgwQlwiOlwiXFxcXHUwMDBiXCJ9LEZhPS9cXHVmZmZmLy50ZXN0KFwiXFx1ZmZmZlwiKT8vW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHVmZmZmXS9nOi9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxceGZmXS9nO1xuZnVuY3Rpb24gRGEoYSxiKXtiLnB1c2goJ1wiJyxhLnJlcGxhY2UoRmEsZnVuY3Rpb24oYSl7aWYoYSBpbiBFYSlyZXR1cm4gRWFbYV07dmFyIGI9YS5jaGFyQ29kZUF0KDApLGU9XCJcXFxcdVwiOzE2PmI/ZSs9XCIwMDBcIjoyNTY+Yj9lKz1cIjAwXCI6NDA5Nj5iJiYoZSs9XCIwXCIpO3JldHVybiBFYVthXT1lK2IudG9TdHJpbmcoMTYpfSksJ1wiJyl9O2Z1bmN0aW9uIEdhKCl7cmV0dXJuIE1hdGguZmxvb3IoMjE0NzQ4MzY0OCpNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNikrTWF0aC5hYnMoTWF0aC5mbG9vcigyMTQ3NDgzNjQ4Kk1hdGgucmFuZG9tKCkpXmxhKCkpLnRvU3RyaW5nKDM2KX07dmFyIEhhO2E6e3ZhciBJYT1hYS5uYXZpZ2F0b3I7aWYoSWEpe3ZhciBKYT1JYS51c2VyQWdlbnQ7aWYoSmEpe0hhPUphO2JyZWFrIGF9fUhhPVwiXCJ9O2Z1bmN0aW9uIEthKCl7dGhpcy5XYT0tMX07ZnVuY3Rpb24gTGEoKXt0aGlzLldhPS0xO3RoaXMuV2E9NjQ7dGhpcy5SPVtdO3RoaXMubGU9W107dGhpcy5UZj1bXTt0aGlzLklkPVtdO3RoaXMuSWRbMF09MTI4O2Zvcih2YXIgYT0xO2E8dGhpcy5XYTsrK2EpdGhpcy5JZFthXT0wO3RoaXMuYmU9dGhpcy4kYj0wO3RoaXMucmVzZXQoKX1tYShMYSxLYSk7TGEucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKCl7dGhpcy5SWzBdPTE3MzI1ODQxOTM7dGhpcy5SWzFdPTQwMjMyMzM0MTc7dGhpcy5SWzJdPTI1NjIzODMxMDI7dGhpcy5SWzNdPTI3MTczMzg3ODt0aGlzLlJbNF09MzI4NTM3NzUyMDt0aGlzLmJlPXRoaXMuJGI9MH07XG5mdW5jdGlvbiBNYShhLGIsYyl7Y3x8KGM9MCk7dmFyIGQ9YS5UZjtpZihwKGIpKWZvcih2YXIgZT0wOzE2PmU7ZSsrKWRbZV09Yi5jaGFyQ29kZUF0KGMpPDwyNHxiLmNoYXJDb2RlQXQoYysxKTw8MTZ8Yi5jaGFyQ29kZUF0KGMrMik8PDh8Yi5jaGFyQ29kZUF0KGMrMyksYys9NDtlbHNlIGZvcihlPTA7MTY+ZTtlKyspZFtlXT1iW2NdPDwyNHxiW2MrMV08PDE2fGJbYysyXTw8OHxiW2MrM10sYys9NDtmb3IoZT0xNjs4MD5lO2UrKyl7dmFyIGY9ZFtlLTNdXmRbZS04XV5kW2UtMTRdXmRbZS0xNl07ZFtlXT0oZjw8MXxmPj4+MzEpJjQyOTQ5NjcyOTV9Yj1hLlJbMF07Yz1hLlJbMV07Zm9yKHZhciBnPWEuUlsyXSxrPWEuUlszXSxsPWEuUls0XSxtLGU9MDs4MD5lO2UrKyk0MD5lPzIwPmU/KGY9a15jJihnXmspLG09MTUxODUwMDI0OSk6KGY9Y15nXmssbT0xODU5Nzc1MzkzKTo2MD5lPyhmPWMmZ3xrJihjfGcpLG09MjQwMDk1OTcwOCk6KGY9Y15nXmssbT0zMzk1NDY5NzgyKSxmPShiPDxcbjV8Yj4+PjI3KStmK2wrbStkW2VdJjQyOTQ5NjcyOTUsbD1rLGs9ZyxnPShjPDwzMHxjPj4+MikmNDI5NDk2NzI5NSxjPWIsYj1mO2EuUlswXT1hLlJbMF0rYiY0Mjk0OTY3Mjk1O2EuUlsxXT1hLlJbMV0rYyY0Mjk0OTY3Mjk1O2EuUlsyXT1hLlJbMl0rZyY0Mjk0OTY3Mjk1O2EuUlszXT1hLlJbM10rayY0Mjk0OTY3Mjk1O2EuUls0XT1hLlJbNF0rbCY0Mjk0OTY3Mjk1fVxuTGEucHJvdG90eXBlLnVwZGF0ZT1mdW5jdGlvbihhLGIpe2lmKG51bGwhPWEpe24oYil8fChiPWEubGVuZ3RoKTtmb3IodmFyIGM9Yi10aGlzLldhLGQ9MCxlPXRoaXMubGUsZj10aGlzLiRiO2Q8Yjspe2lmKDA9PWYpZm9yKDtkPD1jOylNYSh0aGlzLGEsZCksZCs9dGhpcy5XYTtpZihwKGEpKWZvcig7ZDxiOyl7aWYoZVtmXT1hLmNoYXJDb2RlQXQoZCksKytmLCsrZCxmPT10aGlzLldhKXtNYSh0aGlzLGUpO2Y9MDticmVha319ZWxzZSBmb3IoO2Q8YjspaWYoZVtmXT1hW2RdLCsrZiwrK2QsZj09dGhpcy5XYSl7TWEodGhpcyxlKTtmPTA7YnJlYWt9fXRoaXMuJGI9Zjt0aGlzLmJlKz1ifX07dmFyIHQ9QXJyYXkucHJvdG90eXBlLE5hPXQuaW5kZXhPZj9mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHQuaW5kZXhPZi5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2M9bnVsbD09Yz8wOjA+Yz9NYXRoLm1heCgwLGEubGVuZ3RoK2MpOmM7aWYocChhKSlyZXR1cm4gcChiKSYmMT09Yi5sZW5ndGg/YS5pbmRleE9mKGIsYyk6LTE7Zm9yKDtjPGEubGVuZ3RoO2MrKylpZihjIGluIGEmJmFbY109PT1iKXJldHVybiBjO3JldHVybi0xfSxPYT10LmZvckVhY2g/ZnVuY3Rpb24oYSxiLGMpe3QuZm9yRWFjaC5jYWxsKGEsYixjKX06ZnVuY3Rpb24oYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPXAoYSk/YS5zcGxpdChcIlwiKTphLGY9MDtmPGQ7ZisrKWYgaW4gZSYmYi5jYWxsKGMsZVtmXSxmLGEpfSxQYT10LmZpbHRlcj9mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHQuZmlsdGVyLmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9W10sZj0wLGc9cChhKT9cbmEuc3BsaXQoXCJcIik6YSxrPTA7azxkO2srKylpZihrIGluIGcpe3ZhciBsPWdba107Yi5jYWxsKGMsbCxrLGEpJiYoZVtmKytdPWwpfXJldHVybiBlfSxRYT10Lm1hcD9mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHQubWFwLmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9QXJyYXkoZCksZj1wKGEpP2Euc3BsaXQoXCJcIik6YSxnPTA7ZzxkO2crKylnIGluIGYmJihlW2ddPWIuY2FsbChjLGZbZ10sZyxhKSk7cmV0dXJuIGV9LFJhPXQucmVkdWNlP2Z1bmN0aW9uKGEsYixjLGQpe2Zvcih2YXIgZT1bXSxmPTEsZz1hcmd1bWVudHMubGVuZ3RoO2Y8ZztmKyspZS5wdXNoKGFyZ3VtZW50c1tmXSk7ZCYmKGVbMF09cShiLGQpKTtyZXR1cm4gdC5yZWR1Y2UuYXBwbHkoYSxlKX06ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9YztPYShhLGZ1bmN0aW9uKGMsZyl7ZT1iLmNhbGwoZCxlLGMsZyxhKX0pO3JldHVybiBlfSxTYT10LmV2ZXJ5P2Z1bmN0aW9uKGEsYixcbmMpe3JldHVybiB0LmV2ZXJ5LmNhbGwoYSxiLGMpfTpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPWEubGVuZ3RoLGU9cChhKT9hLnNwbGl0KFwiXCIpOmEsZj0wO2Y8ZDtmKyspaWYoZiBpbiBlJiYhYi5jYWxsKGMsZVtmXSxmLGEpKXJldHVybiExO3JldHVybiEwfTtmdW5jdGlvbiBUYShhLGIpe3ZhciBjPVVhKGEsYix2b2lkIDApO3JldHVybiAwPmM/bnVsbDpwKGEpP2EuY2hhckF0KGMpOmFbY119ZnVuY3Rpb24gVWEoYSxiLGMpe2Zvcih2YXIgZD1hLmxlbmd0aCxlPXAoYSk/YS5zcGxpdChcIlwiKTphLGY9MDtmPGQ7ZisrKWlmKGYgaW4gZSYmYi5jYWxsKGMsZVtmXSxmLGEpKXJldHVybiBmO3JldHVybi0xfWZ1bmN0aW9uIFZhKGEsYil7dmFyIGM9TmEoYSxiKTswPD1jJiZ0LnNwbGljZS5jYWxsKGEsYywxKX1mdW5jdGlvbiBXYShhLGIsYyl7cmV0dXJuIDI+PWFyZ3VtZW50cy5sZW5ndGg/dC5zbGljZS5jYWxsKGEsYik6dC5zbGljZS5jYWxsKGEsYixjKX1cbmZ1bmN0aW9uIFhhKGEsYil7YS5zb3J0KGJ8fFlhKX1mdW5jdGlvbiBZYShhLGIpe3JldHVybiBhPmI/MTphPGI/LTE6MH07dmFyIFphPS0xIT1IYS5pbmRleE9mKFwiT3BlcmFcIil8fC0xIT1IYS5pbmRleE9mKFwiT1BSXCIpLCRhPS0xIT1IYS5pbmRleE9mKFwiVHJpZGVudFwiKXx8LTEhPUhhLmluZGV4T2YoXCJNU0lFXCIpLGFiPS0xIT1IYS5pbmRleE9mKFwiR2Vja29cIikmJi0xPT1IYS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJ3ZWJraXRcIikmJiEoLTEhPUhhLmluZGV4T2YoXCJUcmlkZW50XCIpfHwtMSE9SGEuaW5kZXhPZihcIk1TSUVcIikpLGJiPS0xIT1IYS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJ3ZWJraXRcIik7XG4oZnVuY3Rpb24oKXt2YXIgYT1cIlwiLGI7aWYoWmEmJmFhLm9wZXJhKXJldHVybiBhPWFhLm9wZXJhLnZlcnNpb24saGEoYSk/YSgpOmE7YWI/Yj0vcnZcXDooW15cXCk7XSspKFxcKXw7KS86JGE/Yj0vXFxiKD86TVNJRXxydilbOiBdKFteXFwpO10rKShcXCl8OykvOmJiJiYoYj0vV2ViS2l0XFwvKFxcUyspLyk7YiYmKGE9KGE9Yi5leGVjKEhhKSk/YVsxXTpcIlwiKTtyZXR1cm4gJGEmJihiPShiPWFhLmRvY3VtZW50KT9iLmRvY3VtZW50TW9kZTp2b2lkIDAsYj5wYXJzZUZsb2F0KGEpKT9TdHJpbmcoYik6YX0pKCk7dmFyIGNiPW51bGwsZGI9bnVsbCxlYj1udWxsO2Z1bmN0aW9uIGZiKGEsYil7aWYoIWZhKGEpKXRocm93IEVycm9yKFwiZW5jb2RlQnl0ZUFycmF5IHRha2VzIGFuIGFycmF5IGFzIGEgcGFyYW1ldGVyXCIpO2diKCk7Zm9yKHZhciBjPWI/ZGI6Y2IsZD1bXSxlPTA7ZTxhLmxlbmd0aDtlKz0zKXt2YXIgZj1hW2VdLGc9ZSsxPGEubGVuZ3RoLGs9Zz9hW2UrMV06MCxsPWUrMjxhLmxlbmd0aCxtPWw/YVtlKzJdOjAsdj1mPj4yLGY9KGYmMyk8PDR8az4+NCxrPShrJjE1KTw8MnxtPj42LG09bSY2MztsfHwobT02NCxnfHwoaz02NCkpO2QucHVzaChjW3ZdLGNbZl0sY1trXSxjW21dKX1yZXR1cm4gZC5qb2luKFwiXCIpfVxuZnVuY3Rpb24gZ2IoKXtpZighY2Ipe2NiPXt9O2RiPXt9O2ViPXt9O2Zvcih2YXIgYT0wOzY1PmE7YSsrKWNiW2FdPVwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIi5jaGFyQXQoYSksZGJbYV09XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OS1fLlwiLmNoYXJBdChhKSxlYltkYlthXV09YSw2Mjw9YSYmKGViW1wiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIi5jaGFyQXQoYSldPWEpfX07ZnVuY3Rpb24gdShhLGIpe3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSxiKX1mdW5jdGlvbiB3KGEsYil7aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsYikpcmV0dXJuIGFbYl19ZnVuY3Rpb24gaGIoYSxiKXtmb3IodmFyIGMgaW4gYSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSxjKSYmYihjLGFbY10pfWZ1bmN0aW9uIGliKGEpe3ZhciBiPXt9O2hiKGEsZnVuY3Rpb24oYSxkKXtiW2FdPWR9KTtyZXR1cm4gYn07ZnVuY3Rpb24gamIoYSl7dmFyIGI9W107aGIoYSxmdW5jdGlvbihhLGQpe2VhKGQpP09hKGQsZnVuY3Rpb24oZCl7Yi5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChhKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQoZCkpfSk6Yi5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChhKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQoZCkpfSk7cmV0dXJuIGIubGVuZ3RoP1wiJlwiK2Iuam9pbihcIiZcIik6XCJcIn1mdW5jdGlvbiBrYihhKXt2YXIgYj17fTthPWEucmVwbGFjZSgvXlxcPy8sXCJcIikuc3BsaXQoXCImXCIpO09hKGEsZnVuY3Rpb24oYSl7YSYmKGE9YS5zcGxpdChcIj1cIiksYlthWzBdXT1hWzFdKX0pO3JldHVybiBifTtmdW5jdGlvbiB4KGEsYixjLGQpe3ZhciBlO2Q8Yj9lPVwiYXQgbGVhc3QgXCIrYjpkPmMmJihlPTA9PT1jP1wibm9uZVwiOlwibm8gbW9yZSB0aGFuIFwiK2MpO2lmKGUpdGhyb3cgRXJyb3IoYStcIiBmYWlsZWQ6IFdhcyBjYWxsZWQgd2l0aCBcIitkKygxPT09ZD9cIiBhcmd1bWVudC5cIjpcIiBhcmd1bWVudHMuXCIpK1wiIEV4cGVjdHMgXCIrZStcIi5cIik7fWZ1bmN0aW9uIHooYSxiLGMpe3ZhciBkPVwiXCI7c3dpdGNoKGIpe2Nhc2UgMTpkPWM/XCJmaXJzdFwiOlwiRmlyc3RcIjticmVhaztjYXNlIDI6ZD1jP1wic2Vjb25kXCI6XCJTZWNvbmRcIjticmVhaztjYXNlIDM6ZD1jP1widGhpcmRcIjpcIlRoaXJkXCI7YnJlYWs7Y2FzZSA0OmQ9Yz9cImZvdXJ0aFwiOlwiRm91cnRoXCI7YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcihcImVycm9yUHJlZml4IGNhbGxlZCB3aXRoIGFyZ3VtZW50TnVtYmVyID4gNC4gIE5lZWQgdG8gdXBkYXRlIGl0P1wiKTt9cmV0dXJuIGE9YStcIiBmYWlsZWQ6IFwiKyhkK1wiIGFyZ3VtZW50IFwiKX1cbmZ1bmN0aW9uIEEoYSxiLGMsZCl7aWYoKCFkfHxuKGMpKSYmIWhhKGMpKXRocm93IEVycm9yKHooYSxiLGQpK1wibXVzdCBiZSBhIHZhbGlkIGZ1bmN0aW9uLlwiKTt9ZnVuY3Rpb24gbGIoYSxiLGMpe2lmKG4oYykmJighaWEoYyl8fG51bGw9PT1jKSl0aHJvdyBFcnJvcih6KGEsYiwhMCkrXCJtdXN0IGJlIGEgdmFsaWQgY29udGV4dCBvYmplY3QuXCIpO307ZnVuY3Rpb24gbWIoYSl7cmV0dXJuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBKU09OJiZuKEpTT04ucGFyc2UpP0pTT04ucGFyc2UoYSk6QWEoYSl9ZnVuY3Rpb24gQihhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIEpTT04mJm4oSlNPTi5zdHJpbmdpZnkpKWE9SlNPTi5zdHJpbmdpZnkoYSk7ZWxzZXt2YXIgYj1bXTtDYShuZXcgQmEsYSxiKTthPWIuam9pbihcIlwiKX1yZXR1cm4gYX07ZnVuY3Rpb24gbmIoKXt0aGlzLlNkPUN9bmIucHJvdG90eXBlLmo9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuU2Qub2EoYSl9O25iLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLlNkLnRvU3RyaW5nKCl9O2Z1bmN0aW9uIG9iKCl7fW9iLnByb3RvdHlwZS5wZj1mdW5jdGlvbigpe3JldHVybiBudWxsfTtvYi5wcm90b3R5cGUueGU9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07dmFyIHBiPW5ldyBvYjtmdW5jdGlvbiBxYihhLGIsYyl7dGhpcy5RZj1hO3RoaXMuS2E9Yjt0aGlzLkhkPWN9cWIucHJvdG90eXBlLnBmPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuS2EuRDtpZihyYihiLGEpKXJldHVybiBiLmooKS5NKGEpO2I9bnVsbCE9dGhpcy5IZD9uZXcgc2IodGhpcy5IZCwhMCwhMSk6dGhpcy5LYS51KCk7cmV0dXJuIHRoaXMuUWYuWGEoYSxiKX07cWIucHJvdG90eXBlLnhlPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1udWxsIT10aGlzLkhkP3RoaXMuSGQ6dGIodGhpcy5LYSk7YT10aGlzLlFmLm1lKGQsYiwxLGMsYSk7cmV0dXJuIDA9PT1hLmxlbmd0aD9udWxsOmFbMF19O2Z1bmN0aW9uIHViKCl7dGhpcy50Yj1bXX1mdW5jdGlvbiB2YihhLGIpe2Zvcih2YXIgYz1udWxsLGQ9MDtkPGIubGVuZ3RoO2QrKyl7dmFyIGU9YltkXSxmPWUuWWIoKTtudWxsPT09Y3x8Zi5aKGMuWWIoKSl8fChhLnRiLnB1c2goYyksYz1udWxsKTtudWxsPT09YyYmKGM9bmV3IHdiKGYpKTtjLmFkZChlKX1jJiZhLnRiLnB1c2goYyl9ZnVuY3Rpb24geGIoYSxiLGMpe3ZiKGEsYyk7eWIoYSxmdW5jdGlvbihhKXtyZXR1cm4gYS5aKGIpfSl9ZnVuY3Rpb24gemIoYSxiLGMpe3ZiKGEsYyk7eWIoYSxmdW5jdGlvbihhKXtyZXR1cm4gYS5jb250YWlucyhiKXx8Yi5jb250YWlucyhhKX0pfVxuZnVuY3Rpb24geWIoYSxiKXtmb3IodmFyIGM9ITAsZD0wO2Q8YS50Yi5sZW5ndGg7ZCsrKXt2YXIgZT1hLnRiW2RdO2lmKGUpaWYoZT1lLlliKCksYihlKSl7Zm9yKHZhciBlPWEudGJbZF0sZj0wO2Y8ZS5zZC5sZW5ndGg7ZisrKXt2YXIgZz1lLnNkW2ZdO2lmKG51bGwhPT1nKXtlLnNkW2ZdPW51bGw7dmFyIGs9Zy5VYigpO0FiJiZCYihcImV2ZW50OiBcIitnLnRvU3RyaW5nKCkpO0NiKGspfX1hLnRiW2RdPW51bGx9ZWxzZSBjPSExfWMmJihhLnRiPVtdKX1mdW5jdGlvbiB3YihhKXt0aGlzLnFhPWE7dGhpcy5zZD1bXX13Yi5wcm90b3R5cGUuYWRkPWZ1bmN0aW9uKGEpe3RoaXMuc2QucHVzaChhKX07d2IucHJvdG90eXBlLlliPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucWF9O2Z1bmN0aW9uIEQoYSxiLGMsZCl7dGhpcy50eXBlPWE7dGhpcy5KYT1iO3RoaXMuWWE9Yzt0aGlzLkplPWQ7dGhpcy5OZD12b2lkIDB9ZnVuY3Rpb24gRGIoYSl7cmV0dXJuIG5ldyBEKEViLGEpfXZhciBFYj1cInZhbHVlXCI7ZnVuY3Rpb24gRmIoYSxiLGMsZCl7dGhpcy50ZT1iO3RoaXMuV2Q9Yzt0aGlzLk5kPWQ7dGhpcy5yZD1hfUZiLnByb3RvdHlwZS5ZYj1mdW5jdGlvbigpe3ZhciBhPXRoaXMuV2QubGMoKTtyZXR1cm5cInZhbHVlXCI9PT10aGlzLnJkP2EucGF0aDphLnBhcmVudCgpLnBhdGh9O0ZiLnByb3RvdHlwZS55ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJkfTtGYi5wcm90b3R5cGUuVWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50ZS5VYih0aGlzKX07RmIucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuWWIoKS50b1N0cmluZygpK1wiOlwiK3RoaXMucmQrXCI6XCIrQih0aGlzLldkLmxmKCkpfTtmdW5jdGlvbiBHYihhLGIsYyl7dGhpcy50ZT1hO3RoaXMuZXJyb3I9Yjt0aGlzLnBhdGg9Y31HYi5wcm90b3R5cGUuWWI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXRofTtHYi5wcm90b3R5cGUueWU9ZnVuY3Rpb24oKXtyZXR1cm5cImNhbmNlbFwifTtcbkdiLnByb3RvdHlwZS5VYj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnRlLlViKHRoaXMpfTtHYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXRoLnRvU3RyaW5nKCkrXCI6Y2FuY2VsXCJ9O2Z1bmN0aW9uIHNiKGEsYixjKXt0aGlzLkI9YTt0aGlzLiQ9Yjt0aGlzLlRiPWN9ZnVuY3Rpb24gSGIoYSl7cmV0dXJuIGEuJH1mdW5jdGlvbiByYihhLGIpe3JldHVybiBhLiQmJiFhLlRifHxhLkIuSGEoYil9c2IucHJvdG90eXBlLmo9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5CfTtmdW5jdGlvbiBJYihhKXt0aGlzLmRnPWE7dGhpcy5BZD1udWxsfUliLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmRnLmdldCgpLGI9eGEoYSk7aWYodGhpcy5BZClmb3IodmFyIGMgaW4gdGhpcy5BZCliW2NdLT10aGlzLkFkW2NdO3RoaXMuQWQ9YTtyZXR1cm4gYn07ZnVuY3Rpb24gSmIoYSxiKXt0aGlzLk1mPXt9O3RoaXMuWWQ9bmV3IEliKGEpO3RoaXMuY2E9Yjt2YXIgYz0xRTQrMkU0Kk1hdGgucmFuZG9tKCk7c2V0VGltZW91dChxKHRoaXMuSGYsdGhpcyksTWF0aC5mbG9vcihjKSl9SmIucHJvdG90eXBlLkhmPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5ZZC5nZXQoKSxiPXt9LGM9ITEsZDtmb3IoZCBpbiBhKTA8YVtkXSYmdSh0aGlzLk1mLGQpJiYoYltkXT1hW2RdLGM9ITApO2MmJnRoaXMuY2EuVGUoYik7c2V0VGltZW91dChxKHRoaXMuSGYsdGhpcyksTWF0aC5mbG9vcig2RTUqTWF0aC5yYW5kb20oKSkpfTtmdW5jdGlvbiBLYigpe3RoaXMuRGM9e319ZnVuY3Rpb24gTGIoYSxiLGMpe24oYyl8fChjPTEpO3UoYS5EYyxiKXx8KGEuRGNbYl09MCk7YS5EY1tiXSs9Y31LYi5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIHhhKHRoaXMuRGMpfTt2YXIgTWI9e30sTmI9e307ZnVuY3Rpb24gT2IoYSl7YT1hLnRvU3RyaW5nKCk7TWJbYV18fChNYlthXT1uZXcgS2IpO3JldHVybiBNYlthXX1mdW5jdGlvbiBQYihhLGIpe3ZhciBjPWEudG9TdHJpbmcoKTtOYltjXXx8KE5iW2NdPWIoKSk7cmV0dXJuIE5iW2NdfTtmdW5jdGlvbiBFKGEsYil7dGhpcy5uYW1lPWE7dGhpcy5TPWJ9ZnVuY3Rpb24gUWIoYSxiKXtyZXR1cm4gbmV3IEUoYSxiKX07ZnVuY3Rpb24gUmIoYSxiKXtyZXR1cm4gU2IoYS5uYW1lLGIubmFtZSl9ZnVuY3Rpb24gVGIoYSxiKXtyZXR1cm4gU2IoYSxiKX07ZnVuY3Rpb24gVWIoYSxiLGMpe3RoaXMudHlwZT1WYjt0aGlzLnNvdXJjZT1hO3RoaXMucGF0aD1iO3RoaXMuSWE9Y31VYi5wcm90b3R5cGUuV2M9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucGF0aC5lKCk/bmV3IFViKHRoaXMuc291cmNlLEYsdGhpcy5JYS5NKGEpKTpuZXcgVWIodGhpcy5zb3VyY2UsRyh0aGlzLnBhdGgpLHRoaXMuSWEpfTtVYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIk9wZXJhdGlvbihcIit0aGlzLnBhdGgrXCI6IFwiK3RoaXMuc291cmNlLnRvU3RyaW5nKCkrXCIgb3ZlcndyaXRlOiBcIit0aGlzLklhLnRvU3RyaW5nKCkrXCIpXCJ9O2Z1bmN0aW9uIFdiKGEsYil7dGhpcy50eXBlPVhiO3RoaXMuc291cmNlPVliO3RoaXMucGF0aD1hO3RoaXMuVmU9Yn1XYi5wcm90b3R5cGUuV2M9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXRoLmUoKT90aGlzOm5ldyBXYihHKHRoaXMucGF0aCksdGhpcy5WZSl9O1diLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiT3BlcmF0aW9uKFwiK3RoaXMucGF0aCtcIjogXCIrdGhpcy5zb3VyY2UudG9TdHJpbmcoKStcIiBhY2sgd3JpdGUgcmV2ZXJ0PVwiK3RoaXMuVmUrXCIpXCJ9O2Z1bmN0aW9uIFpiKGEsYil7dGhpcy50eXBlPSRiO3RoaXMuc291cmNlPWE7dGhpcy5wYXRoPWJ9WmIucHJvdG90eXBlLldjPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGF0aC5lKCk/bmV3IFpiKHRoaXMuc291cmNlLEYpOm5ldyBaYih0aGlzLnNvdXJjZSxHKHRoaXMucGF0aCkpfTtaYi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIk9wZXJhdGlvbihcIit0aGlzLnBhdGgrXCI6IFwiK3RoaXMuc291cmNlLnRvU3RyaW5nKCkrXCIgbGlzdGVuX2NvbXBsZXRlKVwifTtmdW5jdGlvbiBhYyhhLGIpe3RoaXMuTGE9YTt0aGlzLnhhPWI/YjpiY31oPWFjLnByb3RvdHlwZTtoLk5hPWZ1bmN0aW9uKGEsYil7cmV0dXJuIG5ldyBhYyh0aGlzLkxhLHRoaXMueGEuTmEoYSxiLHRoaXMuTGEpLlgobnVsbCxudWxsLCExLG51bGwsbnVsbCkpfTtoLnJlbW92ZT1mdW5jdGlvbihhKXtyZXR1cm4gbmV3IGFjKHRoaXMuTGEsdGhpcy54YS5yZW1vdmUoYSx0aGlzLkxhKS5YKG51bGwsbnVsbCwhMSxudWxsLG51bGwpKX07aC5nZXQ9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiLGM9dGhpcy54YTshYy5lKCk7KXtiPXRoaXMuTGEoYSxjLmtleSk7aWYoMD09PWIpcmV0dXJuIGMudmFsdWU7MD5iP2M9Yy5sZWZ0OjA8YiYmKGM9Yy5yaWdodCl9cmV0dXJuIG51bGx9O1xuZnVuY3Rpb24gY2MoYSxiKXtmb3IodmFyIGMsZD1hLnhhLGU9bnVsbDshZC5lKCk7KXtjPWEuTGEoYixkLmtleSk7aWYoMD09PWMpe2lmKGQubGVmdC5lKCkpcmV0dXJuIGU/ZS5rZXk6bnVsbDtmb3IoZD1kLmxlZnQ7IWQucmlnaHQuZSgpOylkPWQucmlnaHQ7cmV0dXJuIGQua2V5fTA+Yz9kPWQubGVmdDowPGMmJihlPWQsZD1kLnJpZ2h0KX10aHJvdyBFcnJvcihcIkF0dGVtcHRlZCB0byBmaW5kIHByZWRlY2Vzc29yIGtleSBmb3IgYSBub25leGlzdGVudCBrZXkuICBXaGF0IGdpdmVzP1wiKTt9aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueGEuZSgpfTtoLmNvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueGEuY291bnQoKX07aC5SYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnhhLlJjKCl9O2guZWM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy54YS5lYygpfTtoLmhhPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnhhLmhhKGEpfTtcbmguV2I9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBkYyh0aGlzLnhhLG51bGwsdGhpcy5MYSwhMSxhKX07aC5YYj1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgZGModGhpcy54YSxhLHRoaXMuTGEsITEsYil9O2guWmI9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IGRjKHRoaXMueGEsYSx0aGlzLkxhLCEwLGIpfTtoLnJmPWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgZGModGhpcy54YSxudWxsLHRoaXMuTGEsITAsYSl9O2Z1bmN0aW9uIGRjKGEsYixjLGQsZSl7dGhpcy5SZD1lfHxudWxsO3RoaXMuRWU9ZDt0aGlzLlBhPVtdO2ZvcihlPTE7IWEuZSgpOylpZihlPWI/YyhhLmtleSxiKToxLGQmJihlKj0tMSksMD5lKWE9dGhpcy5FZT9hLmxlZnQ6YS5yaWdodDtlbHNlIGlmKDA9PT1lKXt0aGlzLlBhLnB1c2goYSk7YnJlYWt9ZWxzZSB0aGlzLlBhLnB1c2goYSksYT10aGlzLkVlP2EucmlnaHQ6YS5sZWZ0fVxuZnVuY3Rpb24gSChhKXtpZigwPT09YS5QYS5sZW5ndGgpcmV0dXJuIG51bGw7dmFyIGI9YS5QYS5wb3AoKSxjO2M9YS5SZD9hLlJkKGIua2V5LGIudmFsdWUpOntrZXk6Yi5rZXksdmFsdWU6Yi52YWx1ZX07aWYoYS5FZSlmb3IoYj1iLmxlZnQ7IWIuZSgpOylhLlBhLnB1c2goYiksYj1iLnJpZ2h0O2Vsc2UgZm9yKGI9Yi5yaWdodDshYi5lKCk7KWEuUGEucHVzaChiKSxiPWIubGVmdDtyZXR1cm4gY31mdW5jdGlvbiBlYyhhKXtpZigwPT09YS5QYS5sZW5ndGgpcmV0dXJuIG51bGw7dmFyIGI7Yj1hLlBhO2I9YltiLmxlbmd0aC0xXTtyZXR1cm4gYS5SZD9hLlJkKGIua2V5LGIudmFsdWUpOntrZXk6Yi5rZXksdmFsdWU6Yi52YWx1ZX19ZnVuY3Rpb24gZmMoYSxiLGMsZCxlKXt0aGlzLmtleT1hO3RoaXMudmFsdWU9Yjt0aGlzLmNvbG9yPW51bGwhPWM/YzohMDt0aGlzLmxlZnQ9bnVsbCE9ZD9kOmJjO3RoaXMucmlnaHQ9bnVsbCE9ZT9lOmJjfWg9ZmMucHJvdG90eXBlO1xuaC5YPWZ1bmN0aW9uKGEsYixjLGQsZSl7cmV0dXJuIG5ldyBmYyhudWxsIT1hP2E6dGhpcy5rZXksbnVsbCE9Yj9iOnRoaXMudmFsdWUsbnVsbCE9Yz9jOnRoaXMuY29sb3IsbnVsbCE9ZD9kOnRoaXMubGVmdCxudWxsIT1lP2U6dGhpcy5yaWdodCl9O2guY291bnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5sZWZ0LmNvdW50KCkrMSt0aGlzLnJpZ2h0LmNvdW50KCl9O2guZT1mdW5jdGlvbigpe3JldHVybiExfTtoLmhhPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmxlZnQuaGEoYSl8fGEodGhpcy5rZXksdGhpcy52YWx1ZSl8fHRoaXMucmlnaHQuaGEoYSl9O2Z1bmN0aW9uIGdjKGEpe3JldHVybiBhLmxlZnQuZSgpP2E6Z2MoYS5sZWZ0KX1oLlJjPWZ1bmN0aW9uKCl7cmV0dXJuIGdjKHRoaXMpLmtleX07aC5lYz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnJpZ2h0LmUoKT90aGlzLmtleTp0aGlzLnJpZ2h0LmVjKCl9O1xuaC5OYT1mdW5jdGlvbihhLGIsYyl7dmFyIGQsZTtlPXRoaXM7ZD1jKGEsZS5rZXkpO2U9MD5kP2UuWChudWxsLG51bGwsbnVsbCxlLmxlZnQuTmEoYSxiLGMpLG51bGwpOjA9PT1kP2UuWChudWxsLGIsbnVsbCxudWxsLG51bGwpOmUuWChudWxsLG51bGwsbnVsbCxudWxsLGUucmlnaHQuTmEoYSxiLGMpKTtyZXR1cm4gaGMoZSl9O2Z1bmN0aW9uIGljKGEpe2lmKGEubGVmdC5lKCkpcmV0dXJuIGJjO2EubGVmdC5mYSgpfHxhLmxlZnQubGVmdC5mYSgpfHwoYT1qYyhhKSk7YT1hLlgobnVsbCxudWxsLG51bGwsaWMoYS5sZWZ0KSxudWxsKTtyZXR1cm4gaGMoYSl9XG5oLnJlbW92ZT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ7Yz10aGlzO2lmKDA+YihhLGMua2V5KSljLmxlZnQuZSgpfHxjLmxlZnQuZmEoKXx8Yy5sZWZ0LmxlZnQuZmEoKXx8KGM9amMoYykpLGM9Yy5YKG51bGwsbnVsbCxudWxsLGMubGVmdC5yZW1vdmUoYSxiKSxudWxsKTtlbHNle2MubGVmdC5mYSgpJiYoYz1rYyhjKSk7Yy5yaWdodC5lKCl8fGMucmlnaHQuZmEoKXx8Yy5yaWdodC5sZWZ0LmZhKCl8fChjPWxjKGMpLGMubGVmdC5sZWZ0LmZhKCkmJihjPWtjKGMpLGM9bGMoYykpKTtpZigwPT09YihhLGMua2V5KSl7aWYoYy5yaWdodC5lKCkpcmV0dXJuIGJjO2Q9Z2MoYy5yaWdodCk7Yz1jLlgoZC5rZXksZC52YWx1ZSxudWxsLG51bGwsaWMoYy5yaWdodCkpfWM9Yy5YKG51bGwsbnVsbCxudWxsLG51bGwsYy5yaWdodC5yZW1vdmUoYSxiKSl9cmV0dXJuIGhjKGMpfTtoLmZhPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29sb3J9O1xuZnVuY3Rpb24gaGMoYSl7YS5yaWdodC5mYSgpJiYhYS5sZWZ0LmZhKCkmJihhPW1jKGEpKTthLmxlZnQuZmEoKSYmYS5sZWZ0LmxlZnQuZmEoKSYmKGE9a2MoYSkpO2EubGVmdC5mYSgpJiZhLnJpZ2h0LmZhKCkmJihhPWxjKGEpKTtyZXR1cm4gYX1mdW5jdGlvbiBqYyhhKXthPWxjKGEpO2EucmlnaHQubGVmdC5mYSgpJiYoYT1hLlgobnVsbCxudWxsLG51bGwsbnVsbCxrYyhhLnJpZ2h0KSksYT1tYyhhKSxhPWxjKGEpKTtyZXR1cm4gYX1mdW5jdGlvbiBtYyhhKXtyZXR1cm4gYS5yaWdodC5YKG51bGwsbnVsbCxhLmNvbG9yLGEuWChudWxsLG51bGwsITAsbnVsbCxhLnJpZ2h0LmxlZnQpLG51bGwpfWZ1bmN0aW9uIGtjKGEpe3JldHVybiBhLmxlZnQuWChudWxsLG51bGwsYS5jb2xvcixudWxsLGEuWChudWxsLG51bGwsITAsYS5sZWZ0LnJpZ2h0LG51bGwpKX1cbmZ1bmN0aW9uIGxjKGEpe3JldHVybiBhLlgobnVsbCxudWxsLCFhLmNvbG9yLGEubGVmdC5YKG51bGwsbnVsbCwhYS5sZWZ0LmNvbG9yLG51bGwsbnVsbCksYS5yaWdodC5YKG51bGwsbnVsbCwhYS5yaWdodC5jb2xvcixudWxsLG51bGwpKX1mdW5jdGlvbiBuYygpe31oPW5jLnByb3RvdHlwZTtoLlg9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307aC5OYT1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgZmMoYSxiLG51bGwpfTtoLnJlbW92ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzfTtoLmNvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIDB9O2guZT1mdW5jdGlvbigpe3JldHVybiEwfTtoLmhhPWZ1bmN0aW9uKCl7cmV0dXJuITF9O2guUmM9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH07aC5lYz1mdW5jdGlvbigpe3JldHVybiBudWxsfTtoLmZhPWZ1bmN0aW9uKCl7cmV0dXJuITF9O3ZhciBiYz1uZXcgbmM7ZnVuY3Rpb24gb2MoYSxiKXtyZXR1cm4gYSYmXCJvYmplY3RcIj09PXR5cGVvZiBhPyhKKFwiLnN2XCJpbiBhLFwiVW5leHBlY3RlZCBsZWFmIG5vZGUgb3IgcHJpb3JpdHkgY29udGVudHNcIiksYlthW1wiLnN2XCJdXSk6YX1mdW5jdGlvbiBwYyhhLGIpe3ZhciBjPW5ldyBxYztyYyhhLG5ldyBLKFwiXCIpLGZ1bmN0aW9uKGEsZSl7Yy5tYyhhLHNjKGUsYikpfSk7cmV0dXJuIGN9ZnVuY3Rpb24gc2MoYSxiKXt2YXIgYz1hLkEoKS5LKCksYz1vYyhjLGIpLGQ7aWYoYS5OKCkpe3ZhciBlPW9jKGEuQmEoKSxiKTtyZXR1cm4gZSE9PWEuQmEoKXx8YyE9PWEuQSgpLksoKT9uZXcgdGMoZSxMKGMpKTphfWQ9YTtjIT09YS5BKCkuSygpJiYoZD1kLmRhKG5ldyB0YyhjKSkpO2EuVShNLGZ1bmN0aW9uKGEsYyl7dmFyIGU9c2MoYyxiKTtlIT09YyYmKGQ9ZC5RKGEsZSkpfSk7cmV0dXJuIGR9O2Z1bmN0aW9uIEsoYSxiKXtpZigxPT1hcmd1bWVudHMubGVuZ3RoKXt0aGlzLm89YS5zcGxpdChcIi9cIik7Zm9yKHZhciBjPTAsZD0wO2Q8dGhpcy5vLmxlbmd0aDtkKyspMDx0aGlzLm9bZF0ubGVuZ3RoJiYodGhpcy5vW2NdPXRoaXMub1tkXSxjKyspO3RoaXMuby5sZW5ndGg9Yzt0aGlzLlk9MH1lbHNlIHRoaXMubz1hLHRoaXMuWT1ifWZ1bmN0aW9uIE4oYSxiKXt2YXIgYz1PKGEpO2lmKG51bGw9PT1jKXJldHVybiBiO2lmKGM9PT1PKGIpKXJldHVybiBOKEcoYSksRyhiKSk7dGhyb3cgRXJyb3IoXCJJTlRFUk5BTCBFUlJPUjogaW5uZXJQYXRoIChcIitiK1wiKSBpcyBub3Qgd2l0aGluIG91dGVyUGF0aCAoXCIrYStcIilcIik7fWZ1bmN0aW9uIE8oYSl7cmV0dXJuIGEuWT49YS5vLmxlbmd0aD9udWxsOmEub1thLlldfWZ1bmN0aW9uIHVjKGEpe3JldHVybiBhLm8ubGVuZ3RoLWEuWX1cbmZ1bmN0aW9uIEcoYSl7dmFyIGI9YS5ZO2I8YS5vLmxlbmd0aCYmYisrO3JldHVybiBuZXcgSyhhLm8sYil9ZnVuY3Rpb24gdmMoYSl7cmV0dXJuIGEuWTxhLm8ubGVuZ3RoP2Eub1thLm8ubGVuZ3RoLTFdOm51bGx9aD1LLnByb3RvdHlwZTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7Zm9yKHZhciBhPVwiXCIsYj10aGlzLlk7Yjx0aGlzLm8ubGVuZ3RoO2IrKylcIlwiIT09dGhpcy5vW2JdJiYoYSs9XCIvXCIrdGhpcy5vW2JdKTtyZXR1cm4gYXx8XCIvXCJ9O2guc2xpY2U9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuby5zbGljZSh0aGlzLlkrKGF8fDApKX07aC5wYXJlbnQ9ZnVuY3Rpb24oKXtpZih0aGlzLlk+PXRoaXMuby5sZW5ndGgpcmV0dXJuIG51bGw7Zm9yKHZhciBhPVtdLGI9dGhpcy5ZO2I8dGhpcy5vLmxlbmd0aC0xO2IrKylhLnB1c2godGhpcy5vW2JdKTtyZXR1cm4gbmV3IEsoYSwwKX07XG5oLnc9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVtdLGM9dGhpcy5ZO2M8dGhpcy5vLmxlbmd0aDtjKyspYi5wdXNoKHRoaXMub1tjXSk7aWYoYSBpbnN0YW5jZW9mIEspZm9yKGM9YS5ZO2M8YS5vLmxlbmd0aDtjKyspYi5wdXNoKGEub1tjXSk7ZWxzZSBmb3IoYT1hLnNwbGl0KFwiL1wiKSxjPTA7YzxhLmxlbmd0aDtjKyspMDxhW2NdLmxlbmd0aCYmYi5wdXNoKGFbY10pO3JldHVybiBuZXcgSyhiLDApfTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ZPj10aGlzLm8ubGVuZ3RofTtoLlo9ZnVuY3Rpb24oYSl7aWYodWModGhpcykhPT11YyhhKSlyZXR1cm4hMTtmb3IodmFyIGI9dGhpcy5ZLGM9YS5ZO2I8PXRoaXMuby5sZW5ndGg7YisrLGMrKylpZih0aGlzLm9bYl0hPT1hLm9bY10pcmV0dXJuITE7cmV0dXJuITB9O1xuaC5jb250YWlucz1mdW5jdGlvbihhKXt2YXIgYj10aGlzLlksYz1hLlk7aWYodWModGhpcyk+dWMoYSkpcmV0dXJuITE7Zm9yKDtiPHRoaXMuby5sZW5ndGg7KXtpZih0aGlzLm9bYl0hPT1hLm9bY10pcmV0dXJuITE7KytiOysrY31yZXR1cm4hMH07dmFyIEY9bmV3IEsoXCJcIik7ZnVuY3Rpb24gd2MoYSxiKXt0aGlzLlFhPWEuc2xpY2UoKTt0aGlzLkVhPU1hdGgubWF4KDEsdGhpcy5RYS5sZW5ndGgpO3RoaXMua2Y9Yjtmb3IodmFyIGM9MDtjPHRoaXMuUWEubGVuZ3RoO2MrKyl0aGlzLkVhKz14Yyh0aGlzLlFhW2NdKTt5Yyh0aGlzKX13Yy5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihhKXswPHRoaXMuUWEubGVuZ3RoJiYodGhpcy5FYSs9MSk7dGhpcy5RYS5wdXNoKGEpO3RoaXMuRWErPXhjKGEpO3ljKHRoaXMpfTt3Yy5wcm90b3R5cGUucG9wPWZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5RYS5wb3AoKTt0aGlzLkVhLT14YyhhKTswPHRoaXMuUWEubGVuZ3RoJiYtLXRoaXMuRWF9O1xuZnVuY3Rpb24geWMoYSl7aWYoNzY4PGEuRWEpdGhyb3cgRXJyb3IoYS5rZitcImhhcyBhIGtleSBwYXRoIGxvbmdlciB0aGFuIDc2OCBieXRlcyAoXCIrYS5FYStcIikuXCIpO2lmKDMyPGEuUWEubGVuZ3RoKXRocm93IEVycm9yKGEua2YrXCJwYXRoIHNwZWNpZmllZCBleGNlZWRzIHRoZSBtYXhpbXVtIGRlcHRoIHRoYXQgY2FuIGJlIHdyaXR0ZW4gKDMyKSBvciBvYmplY3QgY29udGFpbnMgYSBjeWNsZSBcIit6YyhhKSk7fWZ1bmN0aW9uIHpjKGEpe3JldHVybiAwPT1hLlFhLmxlbmd0aD9cIlwiOlwiaW4gcHJvcGVydHkgJ1wiK2EuUWEuam9pbihcIi5cIikrXCInXCJ9O2Z1bmN0aW9uIEFjKCl7dGhpcy53Yz17fX1BYy5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGEsYil7bnVsbD09Yj9kZWxldGUgdGhpcy53Y1thXTp0aGlzLndjW2FdPWJ9O0FjLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIHUodGhpcy53YyxhKT90aGlzLndjW2FdOm51bGx9O0FjLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oYSl7ZGVsZXRlIHRoaXMud2NbYV19O0FjLnByb3RvdHlwZS51Zj0hMDtmdW5jdGlvbiBCYyhhKXt0aGlzLkVjPWE7dGhpcy5NZD1cImZpcmViYXNlOlwifWg9QmMucHJvdG90eXBlO2guc2V0PWZ1bmN0aW9uKGEsYil7bnVsbD09Yj90aGlzLkVjLnJlbW92ZUl0ZW0odGhpcy5NZCthKTp0aGlzLkVjLnNldEl0ZW0odGhpcy5NZCthLEIoYikpfTtoLmdldD1mdW5jdGlvbihhKXthPXRoaXMuRWMuZ2V0SXRlbSh0aGlzLk1kK2EpO3JldHVybiBudWxsPT1hP251bGw6bWIoYSl9O2gucmVtb3ZlPWZ1bmN0aW9uKGEpe3RoaXMuRWMucmVtb3ZlSXRlbSh0aGlzLk1kK2EpfTtoLnVmPSExO2gudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5FYy50b1N0cmluZygpfTtmdW5jdGlvbiBDYyhhKXt0cnl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cmJlwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93W2FdKXt2YXIgYj13aW5kb3dbYV07Yi5zZXRJdGVtKFwiZmlyZWJhc2U6c2VudGluZWxcIixcImNhY2hlXCIpO2IucmVtb3ZlSXRlbShcImZpcmViYXNlOnNlbnRpbmVsXCIpO3JldHVybiBuZXcgQmMoYil9fWNhdGNoKGMpe31yZXR1cm4gbmV3IEFjfXZhciBEYz1DYyhcImxvY2FsU3RvcmFnZVwiKSxQPUNjKFwic2Vzc2lvblN0b3JhZ2VcIik7ZnVuY3Rpb24gRWMoYSxiLGMsZCxlKXt0aGlzLmhvc3Q9YS50b0xvd2VyQ2FzZSgpO3RoaXMuZG9tYWluPXRoaXMuaG9zdC5zdWJzdHIodGhpcy5ob3N0LmluZGV4T2YoXCIuXCIpKzEpO3RoaXMubGI9Yjt0aGlzLkNiPWM7dGhpcy5UZz1kO3RoaXMuTGQ9ZXx8XCJcIjt0aGlzLk9hPURjLmdldChcImhvc3Q6XCIrYSl8fHRoaXMuaG9zdH1mdW5jdGlvbiBGYyhhLGIpe2IhPT1hLk9hJiYoYS5PYT1iLFwicy1cIj09PWEuT2Euc3Vic3RyKDAsMikmJkRjLnNldChcImhvc3Q6XCIrYS5ob3N0LGEuT2EpKX1FYy5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXt2YXIgYT0odGhpcy5sYj9cImh0dHBzOi8vXCI6XCJodHRwOi8vXCIpK3RoaXMuaG9zdDt0aGlzLkxkJiYoYSs9XCI8XCIrdGhpcy5MZCtcIj5cIik7cmV0dXJuIGF9O3ZhciBHYz1mdW5jdGlvbigpe3ZhciBhPTE7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGErK319KCk7ZnVuY3Rpb24gSihhLGIpe2lmKCFhKXRocm93IEhjKGIpO31mdW5jdGlvbiBIYyhhKXtyZXR1cm4gRXJyb3IoXCJGaXJlYmFzZSAoMi4yLjQpIElOVEVSTkFMIEFTU0VSVCBGQUlMRUQ6IFwiK2EpfVxuZnVuY3Rpb24gSWMoYSl7dHJ5e3ZhciBiO2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgYXRvYiliPWF0b2IoYSk7ZWxzZXtnYigpO2Zvcih2YXIgYz1lYixkPVtdLGU9MDtlPGEubGVuZ3RoOyl7dmFyIGY9Y1thLmNoYXJBdChlKyspXSxnPWU8YS5sZW5ndGg/Y1thLmNoYXJBdChlKV06MDsrK2U7dmFyIGs9ZTxhLmxlbmd0aD9jW2EuY2hhckF0KGUpXTo2NDsrK2U7dmFyIGw9ZTxhLmxlbmd0aD9jW2EuY2hhckF0KGUpXTo2NDsrK2U7aWYobnVsbD09Znx8bnVsbD09Z3x8bnVsbD09a3x8bnVsbD09bCl0aHJvdyBFcnJvcigpO2QucHVzaChmPDwyfGc+PjQpOzY0IT1rJiYoZC5wdXNoKGc8PDQmMjQwfGs+PjIpLDY0IT1sJiZkLnB1c2goazw8NiYxOTJ8bCkpfWlmKDgxOTI+ZC5sZW5ndGgpYj1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsZCk7ZWxzZXthPVwiXCI7Zm9yKGM9MDtjPGQubGVuZ3RoO2MrPTgxOTIpYSs9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLFdhKGQsYyxcbmMrODE5MikpO2I9YX19cmV0dXJuIGJ9Y2F0Y2gobSl7QmIoXCJiYXNlNjREZWNvZGUgZmFpbGVkOiBcIixtKX1yZXR1cm4gbnVsbH1mdW5jdGlvbiBKYyhhKXt2YXIgYj1LYyhhKTthPW5ldyBMYTthLnVwZGF0ZShiKTt2YXIgYj1bXSxjPTgqYS5iZTs1Nj5hLiRiP2EudXBkYXRlKGEuSWQsNTYtYS4kYik6YS51cGRhdGUoYS5JZCxhLldhLShhLiRiLTU2KSk7Zm9yKHZhciBkPWEuV2EtMTs1Njw9ZDtkLS0pYS5sZVtkXT1jJjI1NSxjLz0yNTY7TWEoYSxhLmxlKTtmb3IoZD1jPTA7NT5kO2QrKylmb3IodmFyIGU9MjQ7MDw9ZTtlLT04KWJbY109YS5SW2RdPj5lJjI1NSwrK2M7cmV0dXJuIGZiKGIpfVxuZnVuY3Rpb24gTGMoYSl7Zm9yKHZhciBiPVwiXCIsYz0wO2M8YXJndW1lbnRzLmxlbmd0aDtjKyspYj1mYShhcmd1bWVudHNbY10pP2IrTGMuYXBwbHkobnVsbCxhcmd1bWVudHNbY10pOlwib2JqZWN0XCI9PT10eXBlb2YgYXJndW1lbnRzW2NdP2IrQihhcmd1bWVudHNbY10pOmIrYXJndW1lbnRzW2NdLGIrPVwiIFwiO3JldHVybiBifXZhciBBYj1udWxsLE1jPSEwO2Z1bmN0aW9uIEJiKGEpeyEwPT09TWMmJihNYz0hMSxudWxsPT09QWImJiEwPT09UC5nZXQoXCJsb2dnaW5nX2VuYWJsZWRcIikmJk5jKCEwKSk7aWYoQWIpe3ZhciBiPUxjLmFwcGx5KG51bGwsYXJndW1lbnRzKTtBYihiKX19ZnVuY3Rpb24gT2MoYSl7cmV0dXJuIGZ1bmN0aW9uKCl7QmIoYSxhcmd1bWVudHMpfX1cbmZ1bmN0aW9uIFBjKGEpe2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSl7dmFyIGI9XCJGSVJFQkFTRSBJTlRFUk5BTCBFUlJPUjogXCIrTGMuYXBwbHkobnVsbCxhcmd1bWVudHMpO1widW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZS5lcnJvcj9jb25zb2xlLmVycm9yKGIpOmNvbnNvbGUubG9nKGIpfX1mdW5jdGlvbiBRYyhhKXt2YXIgYj1MYy5hcHBseShudWxsLGFyZ3VtZW50cyk7dGhyb3cgRXJyb3IoXCJGSVJFQkFTRSBGQVRBTCBFUlJPUjogXCIrYik7fWZ1bmN0aW9uIFEoYSl7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBjb25zb2xlKXt2YXIgYj1cIkZJUkVCQVNFIFdBUk5JTkc6IFwiK0xjLmFwcGx5KG51bGwsYXJndW1lbnRzKTtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUud2Fybj9jb25zb2xlLndhcm4oYik6Y29uc29sZS5sb2coYil9fVxuZnVuY3Rpb24gUmMoYSl7dmFyIGI9XCJcIixjPVwiXCIsZD1cIlwiLGU9XCJcIixmPSEwLGc9XCJodHRwc1wiLGs9NDQzO2lmKHAoYSkpe3ZhciBsPWEuaW5kZXhPZihcIi8vXCIpOzA8PWwmJihnPWEuc3Vic3RyaW5nKDAsbC0xKSxhPWEuc3Vic3RyaW5nKGwrMikpO2w9YS5pbmRleE9mKFwiL1wiKTstMT09PWwmJihsPWEubGVuZ3RoKTtiPWEuc3Vic3RyaW5nKDAsbCk7ZT1cIlwiO2E9YS5zdWJzdHJpbmcobCkuc3BsaXQoXCIvXCIpO2ZvcihsPTA7bDxhLmxlbmd0aDtsKyspaWYoMDxhW2xdLmxlbmd0aCl7dmFyIG09YVtsXTt0cnl7bT1kZWNvZGVVUklDb21wb25lbnQobS5yZXBsYWNlKC9cXCsvZyxcIiBcIikpfWNhdGNoKHYpe31lKz1cIi9cIittfWE9Yi5zcGxpdChcIi5cIik7Mz09PWEubGVuZ3RoPyhjPWFbMV0sZD1hWzBdLnRvTG93ZXJDYXNlKCkpOjI9PT1hLmxlbmd0aCYmKGM9YVswXSk7bD1iLmluZGV4T2YoXCI6XCIpOzA8PWwmJihmPVwiaHR0cHNcIj09PWd8fFwid3NzXCI9PT1nLGs9Yi5zdWJzdHJpbmcobCsxKSxpc0Zpbml0ZShrKSYmXG4oaz1TdHJpbmcoaykpLGs9cChrKT8vXlxccyotPzB4L2kudGVzdChrKT9wYXJzZUludChrLDE2KTpwYXJzZUludChrLDEwKTpOYU4pfXJldHVybntob3N0OmIscG9ydDprLGRvbWFpbjpjLFFnOmQsbGI6ZixzY2hlbWU6ZyxaYzplfX1mdW5jdGlvbiBTYyhhKXtyZXR1cm4gZ2EoYSkmJihhIT1hfHxhPT1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl8fGE9PU51bWJlci5ORUdBVElWRV9JTkZJTklUWSl9XG5mdW5jdGlvbiBUYyhhKXtpZihcImNvbXBsZXRlXCI9PT1kb2N1bWVudC5yZWFkeVN0YXRlKWEoKTtlbHNle3ZhciBiPSExLGM9ZnVuY3Rpb24oKXtkb2N1bWVudC5ib2R5P2J8fChiPSEwLGEoKSk6c2V0VGltZW91dChjLE1hdGguZmxvb3IoMTApKX07ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj8oZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjLCExKSx3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixjLCExKSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQmJihkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uKCl7XCJjb21wbGV0ZVwiPT09ZG9jdW1lbnQucmVhZHlTdGF0ZSYmYygpfSksd2luZG93LmF0dGFjaEV2ZW50KFwib25sb2FkXCIsYykpfX1cbmZ1bmN0aW9uIFNiKGEsYil7aWYoYT09PWIpcmV0dXJuIDA7aWYoXCJbTUlOX05BTUVdXCI9PT1hfHxcIltNQVhfTkFNRV1cIj09PWIpcmV0dXJuLTE7aWYoXCJbTUlOX05BTUVdXCI9PT1ifHxcIltNQVhfTkFNRV1cIj09PWEpcmV0dXJuIDE7dmFyIGM9VWMoYSksZD1VYyhiKTtyZXR1cm4gbnVsbCE9PWM/bnVsbCE9PWQ/MD09Yy1kP2EubGVuZ3RoLWIubGVuZ3RoOmMtZDotMTpudWxsIT09ZD8xOmE8Yj8tMToxfWZ1bmN0aW9uIFZjKGEsYil7aWYoYiYmYSBpbiBiKXJldHVybiBiW2FdO3Rocm93IEVycm9yKFwiTWlzc2luZyByZXF1aXJlZCBrZXkgKFwiK2ErXCIpIGluIG9iamVjdDogXCIrQihiKSk7fVxuZnVuY3Rpb24gV2MoYSl7aWYoXCJvYmplY3RcIiE9PXR5cGVvZiBhfHxudWxsPT09YSlyZXR1cm4gQihhKTt2YXIgYj1bXSxjO2ZvcihjIGluIGEpYi5wdXNoKGMpO2Iuc29ydCgpO2M9XCJ7XCI7Zm9yKHZhciBkPTA7ZDxiLmxlbmd0aDtkKyspMCE9PWQmJihjKz1cIixcIiksYys9QihiW2RdKSxjKz1cIjpcIixjKz1XYyhhW2JbZF1dKTtyZXR1cm4gYytcIn1cIn1mdW5jdGlvbiBYYyhhLGIpe2lmKGEubGVuZ3RoPD1iKXJldHVyblthXTtmb3IodmFyIGM9W10sZD0wO2Q8YS5sZW5ndGg7ZCs9YilkK2I+YT9jLnB1c2goYS5zdWJzdHJpbmcoZCxhLmxlbmd0aCkpOmMucHVzaChhLnN1YnN0cmluZyhkLGQrYikpO3JldHVybiBjfWZ1bmN0aW9uIFljKGEsYil7aWYoZWEoYSkpZm9yKHZhciBjPTA7YzxhLmxlbmd0aDsrK2MpYihjLGFbY10pO2Vsc2UgcihhLGIpfVxuZnVuY3Rpb24gWmMoYSl7SighU2MoYSksXCJJbnZhbGlkIEpTT04gbnVtYmVyXCIpO3ZhciBiLGMsZCxlOzA9PT1hPyhkPWM9MCxiPS1JbmZpbml0eT09PTEvYT8xOjApOihiPTA+YSxhPU1hdGguYWJzKGEpLGE+PU1hdGgucG93KDIsLTEwMjIpPyhkPU1hdGgubWluKE1hdGguZmxvb3IoTWF0aC5sb2coYSkvTWF0aC5MTjIpLDEwMjMpLGM9ZCsxMDIzLGQ9TWF0aC5yb3VuZChhKk1hdGgucG93KDIsNTItZCktTWF0aC5wb3coMiw1MikpKTooYz0wLGQ9TWF0aC5yb3VuZChhL01hdGgucG93KDIsLTEwNzQpKSkpO2U9W107Zm9yKGE9NTI7YTstLWEpZS5wdXNoKGQlMj8xOjApLGQ9TWF0aC5mbG9vcihkLzIpO2ZvcihhPTExO2E7LS1hKWUucHVzaChjJTI/MTowKSxjPU1hdGguZmxvb3IoYy8yKTtlLnB1c2goYj8xOjApO2UucmV2ZXJzZSgpO2I9ZS5qb2luKFwiXCIpO2M9XCJcIjtmb3IoYT0wOzY0PmE7YSs9OClkPXBhcnNlSW50KGIuc3Vic3RyKGEsOCksMikudG9TdHJpbmcoMTYpLDE9PT1kLmxlbmd0aCYmXG4oZD1cIjBcIitkKSxjKz1kO3JldHVybiBjLnRvTG93ZXJDYXNlKCl9dmFyICRjPS9eLT9cXGR7MSwxMH0kLztmdW5jdGlvbiBVYyhhKXtyZXR1cm4gJGMudGVzdChhKSYmKGE9TnVtYmVyKGEpLC0yMTQ3NDgzNjQ4PD1hJiYyMTQ3NDgzNjQ3Pj1hKT9hOm51bGx9ZnVuY3Rpb24gQ2IoYSl7dHJ5e2EoKX1jYXRjaChiKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7UShcIkV4Y2VwdGlvbiB3YXMgdGhyb3duIGJ5IHVzZXIgY2FsbGJhY2suXCIsYi5zdGFja3x8XCJcIik7dGhyb3cgYjt9LE1hdGguZmxvb3IoMCkpfX1mdW5jdGlvbiBSKGEsYil7aWYoaGEoYSkpe3ZhciBjPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKS5zbGljZSgpO0NiKGZ1bmN0aW9uKCl7YS5hcHBseShudWxsLGMpfSl9fTtmdW5jdGlvbiBLYyhhKXtmb3IodmFyIGI9W10sYz0wLGQ9MDtkPGEubGVuZ3RoO2QrKyl7dmFyIGU9YS5jaGFyQ29kZUF0KGQpOzU1Mjk2PD1lJiY1NjMxOT49ZSYmKGUtPTU1Mjk2LGQrKyxKKGQ8YS5sZW5ndGgsXCJTdXJyb2dhdGUgcGFpciBtaXNzaW5nIHRyYWlsIHN1cnJvZ2F0ZS5cIiksZT02NTUzNisoZTw8MTApKyhhLmNoYXJDb2RlQXQoZCktNTYzMjApKTsxMjg+ZT9iW2MrK109ZTooMjA0OD5lP2JbYysrXT1lPj42fDE5MjooNjU1MzY+ZT9iW2MrK109ZT4+MTJ8MjI0OihiW2MrK109ZT4+MTh8MjQwLGJbYysrXT1lPj4xMiY2M3wxMjgpLGJbYysrXT1lPj42JjYzfDEyOCksYltjKytdPWUmNjN8MTI4KX1yZXR1cm4gYn1mdW5jdGlvbiB4YyhhKXtmb3IodmFyIGI9MCxjPTA7YzxhLmxlbmd0aDtjKyspe3ZhciBkPWEuY2hhckNvZGVBdChjKTsxMjg+ZD9iKys6MjA0OD5kP2IrPTI6NTUyOTY8PWQmJjU2MzE5Pj1kPyhiKz00LGMrKyk6Yis9M31yZXR1cm4gYn07ZnVuY3Rpb24gYWQoYSl7dmFyIGI9e30sYz17fSxkPXt9LGU9XCJcIjt0cnl7dmFyIGY9YS5zcGxpdChcIi5cIiksYj1tYihJYyhmWzBdKXx8XCJcIiksYz1tYihJYyhmWzFdKXx8XCJcIiksZT1mWzJdLGQ9Yy5kfHx7fTtkZWxldGUgYy5kfWNhdGNoKGcpe31yZXR1cm57V2c6YixBYzpjLGRhdGE6ZCxOZzplfX1mdW5jdGlvbiBiZChhKXthPWFkKGEpLkFjO3JldHVyblwib2JqZWN0XCI9PT10eXBlb2YgYSYmYS5oYXNPd25Qcm9wZXJ0eShcImlhdFwiKT93KGEsXCJpYXRcIik6bnVsbH1mdW5jdGlvbiBjZChhKXthPWFkKGEpO3ZhciBiPWEuQWM7cmV0dXJuISFhLk5nJiYhIWImJlwib2JqZWN0XCI9PT10eXBlb2YgYiYmYi5oYXNPd25Qcm9wZXJ0eShcImlhdFwiKX07ZnVuY3Rpb24gZGQoYSl7dGhpcy5WPWE7dGhpcy5nPWEubi5nfWZ1bmN0aW9uIGVkKGEsYixjLGQpe3ZhciBlPVtdLGY9W107T2EoYixmdW5jdGlvbihiKXtcImNoaWxkX2NoYW5nZWRcIj09PWIudHlwZSYmYS5nLnhkKGIuSmUsYi5KYSkmJmYucHVzaChuZXcgRChcImNoaWxkX21vdmVkXCIsYi5KYSxiLllhKSl9KTtmZChhLGUsXCJjaGlsZF9yZW1vdmVkXCIsYixkLGMpO2ZkKGEsZSxcImNoaWxkX2FkZGVkXCIsYixkLGMpO2ZkKGEsZSxcImNoaWxkX21vdmVkXCIsZixkLGMpO2ZkKGEsZSxcImNoaWxkX2NoYW5nZWRcIixiLGQsYyk7ZmQoYSxlLEViLGIsZCxjKTtyZXR1cm4gZX1mdW5jdGlvbiBmZChhLGIsYyxkLGUsZil7ZD1QYShkLGZ1bmN0aW9uKGEpe3JldHVybiBhLnR5cGU9PT1jfSk7WGEoZCxxKGEuZWcsYSkpO09hKGQsZnVuY3Rpb24oYyl7dmFyIGQ9Z2QoYSxjLGYpO09hKGUsZnVuY3Rpb24oZSl7ZS5KZihjLnR5cGUpJiZiLnB1c2goZS5jcmVhdGVFdmVudChkLGEuVikpfSl9KX1cbmZ1bmN0aW9uIGdkKGEsYixjKXtcInZhbHVlXCIhPT1iLnR5cGUmJlwiY2hpbGRfcmVtb3ZlZFwiIT09Yi50eXBlJiYoYi5OZD1jLnFmKGIuWWEsYi5KYSxhLmcpKTtyZXR1cm4gYn1kZC5wcm90b3R5cGUuZWc9ZnVuY3Rpb24oYSxiKXtpZihudWxsPT1hLllhfHxudWxsPT1iLllhKXRocm93IEhjKFwiU2hvdWxkIG9ubHkgY29tcGFyZSBjaGlsZF8gZXZlbnRzLlwiKTtyZXR1cm4gdGhpcy5nLmNvbXBhcmUobmV3IEUoYS5ZYSxhLkphKSxuZXcgRShiLllhLGIuSmEpKX07ZnVuY3Rpb24gaGQoKXt0aGlzLmViPXt9fVxuZnVuY3Rpb24gaWQoYSxiKXt2YXIgYz1iLnR5cGUsZD1iLllhO0ooXCJjaGlsZF9hZGRlZFwiPT1jfHxcImNoaWxkX2NoYW5nZWRcIj09Y3x8XCJjaGlsZF9yZW1vdmVkXCI9PWMsXCJPbmx5IGNoaWxkIGNoYW5nZXMgc3VwcG9ydGVkIGZvciB0cmFja2luZ1wiKTtKKFwiLnByaW9yaXR5XCIhPT1kLFwiT25seSBub24tcHJpb3JpdHkgY2hpbGQgY2hhbmdlcyBjYW4gYmUgdHJhY2tlZC5cIik7dmFyIGU9dyhhLmViLGQpO2lmKGUpe3ZhciBmPWUudHlwZTtpZihcImNoaWxkX2FkZGVkXCI9PWMmJlwiY2hpbGRfcmVtb3ZlZFwiPT1mKWEuZWJbZF09bmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsYi5KYSxkLGUuSmEpO2Vsc2UgaWYoXCJjaGlsZF9yZW1vdmVkXCI9PWMmJlwiY2hpbGRfYWRkZWRcIj09ZilkZWxldGUgYS5lYltkXTtlbHNlIGlmKFwiY2hpbGRfcmVtb3ZlZFwiPT1jJiZcImNoaWxkX2NoYW5nZWRcIj09ZilhLmViW2RdPW5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLGUuSmUsZCk7ZWxzZSBpZihcImNoaWxkX2NoYW5nZWRcIj09YyYmXG5cImNoaWxkX2FkZGVkXCI9PWYpYS5lYltkXT1uZXcgRChcImNoaWxkX2FkZGVkXCIsYi5KYSxkKTtlbHNlIGlmKFwiY2hpbGRfY2hhbmdlZFwiPT1jJiZcImNoaWxkX2NoYW5nZWRcIj09ZilhLmViW2RdPW5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGIuSmEsZCxlLkplKTtlbHNlIHRocm93IEhjKFwiSWxsZWdhbCBjb21iaW5hdGlvbiBvZiBjaGFuZ2VzOiBcIitiK1wiIG9jY3VycmVkIGFmdGVyIFwiK2UpO31lbHNlIGEuZWJbZF09Yn07ZnVuY3Rpb24gamQoYSxiLGMpe3RoaXMuUGI9YTt0aGlzLnFiPWI7dGhpcy5zYj1jfHxudWxsfWg9amQucHJvdG90eXBlO2guSmY9ZnVuY3Rpb24oYSl7cmV0dXJuXCJ2YWx1ZVwiPT09YX07aC5jcmVhdGVFdmVudD1mdW5jdGlvbihhLGIpe3ZhciBjPWIubi5nO3JldHVybiBuZXcgRmIoXCJ2YWx1ZVwiLHRoaXMsbmV3IFMoYS5KYSxiLmxjKCksYykpfTtoLlViPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc2I7aWYoXCJjYW5jZWxcIj09PWEueWUoKSl7Sih0aGlzLnFiLFwiUmFpc2luZyBhIGNhbmNlbCBldmVudCBvbiBhIGxpc3RlbmVyIHdpdGggbm8gY2FuY2VsIGNhbGxiYWNrXCIpO3ZhciBjPXRoaXMucWI7cmV0dXJuIGZ1bmN0aW9uKCl7Yy5jYWxsKGIsYS5lcnJvcil9fXZhciBkPXRoaXMuUGI7cmV0dXJuIGZ1bmN0aW9uKCl7ZC5jYWxsKGIsYS5XZCl9fTtoLmZmPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHRoaXMucWI/bmV3IEdiKHRoaXMsYSxiKTpudWxsfTtcbmgubWF0Y2hlcz1mdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIGpkP2EuUGImJnRoaXMuUGI/YS5QYj09PXRoaXMuUGImJmEuc2I9PT10aGlzLnNiOiEwOiExfTtoLnNmPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPT10aGlzLlBifTtmdW5jdGlvbiBrZChhLGIsYyl7dGhpcy5nYT1hO3RoaXMucWI9Yjt0aGlzLnNiPWN9aD1rZC5wcm90b3R5cGU7aC5KZj1mdW5jdGlvbihhKXthPVwiY2hpbGRyZW5fYWRkZWRcIj09PWE/XCJjaGlsZF9hZGRlZFwiOmE7cmV0dXJuKFwiY2hpbGRyZW5fcmVtb3ZlZFwiPT09YT9cImNoaWxkX3JlbW92ZWRcIjphKWluIHRoaXMuZ2F9O2guZmY9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5xYj9uZXcgR2IodGhpcyxhLGIpOm51bGx9O1xuaC5jcmVhdGVFdmVudD1mdW5jdGlvbihhLGIpe0oobnVsbCE9YS5ZYSxcIkNoaWxkIGV2ZW50cyBzaG91bGQgaGF2ZSBhIGNoaWxkTmFtZS5cIik7dmFyIGM9Yi5sYygpLncoYS5ZYSk7cmV0dXJuIG5ldyBGYihhLnR5cGUsdGhpcyxuZXcgUyhhLkphLGMsYi5uLmcpLGEuTmQpfTtoLlViPWZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc2I7aWYoXCJjYW5jZWxcIj09PWEueWUoKSl7Sih0aGlzLnFiLFwiUmFpc2luZyBhIGNhbmNlbCBldmVudCBvbiBhIGxpc3RlbmVyIHdpdGggbm8gY2FuY2VsIGNhbGxiYWNrXCIpO3ZhciBjPXRoaXMucWI7cmV0dXJuIGZ1bmN0aW9uKCl7Yy5jYWxsKGIsYS5lcnJvcil9fXZhciBkPXRoaXMuZ2FbYS5yZF07cmV0dXJuIGZ1bmN0aW9uKCl7ZC5jYWxsKGIsYS5XZCxhLk5kKX19O1xuaC5tYXRjaGVzPWZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBrZCl7aWYoIXRoaXMuZ2F8fCFhLmdhKXJldHVybiEwO2lmKHRoaXMuc2I9PT1hLnNiKXt2YXIgYj1wYShhLmdhKTtpZihiPT09cGEodGhpcy5nYSkpe2lmKDE9PT1iKXt2YXIgYj1xYShhLmdhKSxjPXFhKHRoaXMuZ2EpO3JldHVybiBjPT09YiYmKCFhLmdhW2JdfHwhdGhpcy5nYVtjXXx8YS5nYVtiXT09PXRoaXMuZ2FbY10pfXJldHVybiBvYSh0aGlzLmdhLGZ1bmN0aW9uKGIsYyl7cmV0dXJuIGEuZ2FbY109PT1ifSl9fX1yZXR1cm4hMX07aC5zZj1mdW5jdGlvbigpe3JldHVybiBudWxsIT09dGhpcy5nYX07ZnVuY3Rpb24gbGQoYSl7dGhpcy5nPWF9aD1sZC5wcm90b3R5cGU7aC5HPWZ1bmN0aW9uKGEsYixjLGQsZSl7SihhLkljKHRoaXMuZyksXCJBIG5vZGUgbXVzdCBiZSBpbmRleGVkIGlmIG9ubHkgYSBjaGlsZCBpcyB1cGRhdGVkXCIpO2Q9YS5NKGIpO2lmKGQuWihjKSlyZXR1cm4gYTtudWxsIT1lJiYoYy5lKCk/YS5IYShiKT9pZChlLG5ldyBEKFwiY2hpbGRfcmVtb3ZlZFwiLGQsYikpOkooYS5OKCksXCJBIGNoaWxkIHJlbW92ZSB3aXRob3V0IGFuIG9sZCBjaGlsZCBvbmx5IG1ha2VzIHNlbnNlIG9uIGEgbGVhZiBub2RlXCIpOmQuZSgpP2lkKGUsbmV3IEQoXCJjaGlsZF9hZGRlZFwiLGMsYikpOmlkKGUsbmV3IEQoXCJjaGlsZF9jaGFuZ2VkXCIsYyxiLGQpKSk7cmV0dXJuIGEuTigpJiZjLmUoKT9hOmEuUShiLGMpLm1iKHRoaXMuZyl9O1xuaC50YT1mdW5jdGlvbihhLGIsYyl7bnVsbCE9YyYmKGEuTigpfHxhLlUoTSxmdW5jdGlvbihhLGUpe2IuSGEoYSl8fGlkKGMsbmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIsZSxhKSl9KSxiLk4oKXx8Yi5VKE0sZnVuY3Rpb24oYixlKXtpZihhLkhhKGIpKXt2YXIgZj1hLk0oYik7Zi5aKGUpfHxpZChjLG5ldyBEKFwiY2hpbGRfY2hhbmdlZFwiLGUsYixmKSl9ZWxzZSBpZChjLG5ldyBEKFwiY2hpbGRfYWRkZWRcIixlLGIpKX0pKTtyZXR1cm4gYi5tYih0aGlzLmcpfTtoLmRhPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuZSgpP0M6YS5kYShiKX07aC5HYT1mdW5jdGlvbigpe3JldHVybiExfTtoLlZiPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O2Z1bmN0aW9uIG1kKGEpe3RoaXMuQWU9bmV3IGxkKGEuZyk7dGhpcy5nPWEuZzt2YXIgYjthLmxhPyhiPW5kKGEpLGI9YS5nLk9jKG9kKGEpLGIpKTpiPWEuZy5TYygpO3RoaXMuZGQ9YjthLm5hPyhiPXBkKGEpLGE9YS5nLk9jKHFkKGEpLGIpKTphPWEuZy5QYygpO3RoaXMuRmM9YX1oPW1kLnByb3RvdHlwZTtoLm1hdGNoZXM9ZnVuY3Rpb24oYSl7cmV0dXJuIDA+PXRoaXMuZy5jb21wYXJlKHRoaXMuZGQsYSkmJjA+PXRoaXMuZy5jb21wYXJlKGEsdGhpcy5GYyl9O2guRz1mdW5jdGlvbihhLGIsYyxkLGUpe3RoaXMubWF0Y2hlcyhuZXcgRShiLGMpKXx8KGM9Qyk7cmV0dXJuIHRoaXMuQWUuRyhhLGIsYyxkLGUpfTtoLnRhPWZ1bmN0aW9uKGEsYixjKXtiLk4oKSYmKGI9Qyk7dmFyIGQ9Yi5tYih0aGlzLmcpLGQ9ZC5kYShDKSxlPXRoaXM7Yi5VKE0sZnVuY3Rpb24oYSxiKXtlLm1hdGNoZXMobmV3IEUoYSxiKSl8fChkPWQuUShhLEMpKX0pO3JldHVybiB0aGlzLkFlLnRhKGEsZCxjKX07XG5oLmRhPWZ1bmN0aW9uKGEpe3JldHVybiBhfTtoLkdhPWZ1bmN0aW9uKCl7cmV0dXJuITB9O2guVmI9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5BZX07ZnVuY3Rpb24gcmQoYSl7dGhpcy5yYT1uZXcgbWQoYSk7dGhpcy5nPWEuZztKKGEuaWEsXCJPbmx5IHZhbGlkIGlmIGxpbWl0IGhhcyBiZWVuIHNldFwiKTt0aGlzLmphPWEuamE7dGhpcy5KYj0hc2QoYSl9aD1yZC5wcm90b3R5cGU7aC5HPWZ1bmN0aW9uKGEsYixjLGQsZSl7dGhpcy5yYS5tYXRjaGVzKG5ldyBFKGIsYykpfHwoYz1DKTtyZXR1cm4gYS5NKGIpLlooYyk/YTphLkRiKCk8dGhpcy5qYT90aGlzLnJhLlZiKCkuRyhhLGIsYyxkLGUpOnRkKHRoaXMsYSxiLGMsZCxlKX07XG5oLnRhPWZ1bmN0aW9uKGEsYixjKXt2YXIgZDtpZihiLk4oKXx8Yi5lKCkpZD1DLm1iKHRoaXMuZyk7ZWxzZSBpZigyKnRoaXMuamE8Yi5EYigpJiZiLkljKHRoaXMuZykpe2Q9Qy5tYih0aGlzLmcpO2I9dGhpcy5KYj9iLlpiKHRoaXMucmEuRmMsdGhpcy5nKTpiLlhiKHRoaXMucmEuZGQsdGhpcy5nKTtmb3IodmFyIGU9MDswPGIuUGEubGVuZ3RoJiZlPHRoaXMuamE7KXt2YXIgZj1IKGIpLGc7aWYoZz10aGlzLkpiPzA+PXRoaXMuZy5jb21wYXJlKHRoaXMucmEuZGQsZik6MD49dGhpcy5nLmNvbXBhcmUoZix0aGlzLnJhLkZjKSlkPWQuUShmLm5hbWUsZi5TKSxlKys7ZWxzZSBicmVha319ZWxzZXtkPWIubWIodGhpcy5nKTtkPWQuZGEoQyk7dmFyIGssbCxtO2lmKHRoaXMuSmIpe2I9ZC5yZih0aGlzLmcpO2s9dGhpcy5yYS5GYztsPXRoaXMucmEuZGQ7dmFyIHY9dWQodGhpcy5nKTttPWZ1bmN0aW9uKGEsYil7cmV0dXJuIHYoYixhKX19ZWxzZSBiPWQuV2IodGhpcy5nKSxrPXRoaXMucmEuZGQsXG5sPXRoaXMucmEuRmMsbT11ZCh0aGlzLmcpO2Zvcih2YXIgZT0wLHk9ITE7MDxiLlBhLmxlbmd0aDspZj1IKGIpLCF5JiYwPj1tKGssZikmJih5PSEwKSwoZz15JiZlPHRoaXMuamEmJjA+PW0oZixsKSk/ZSsrOmQ9ZC5RKGYubmFtZSxDKX1yZXR1cm4gdGhpcy5yYS5WYigpLnRhKGEsZCxjKX07aC5kYT1mdW5jdGlvbihhKXtyZXR1cm4gYX07aC5HYT1mdW5jdGlvbigpe3JldHVybiEwfTtoLlZiPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmEuVmIoKX07XG5mdW5jdGlvbiB0ZChhLGIsYyxkLGUsZil7dmFyIGc7aWYoYS5KYil7dmFyIGs9dWQoYS5nKTtnPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGsoYixhKX19ZWxzZSBnPXVkKGEuZyk7SihiLkRiKCk9PWEuamEsXCJcIik7dmFyIGw9bmV3IEUoYyxkKSxtPWEuSmI/d2QoYixhLmcpOnhkKGIsYS5nKSx2PWEucmEubWF0Y2hlcyhsKTtpZihiLkhhKGMpKXt2YXIgeT1iLk0oYyksbT1lLnhlKGEuZyxtLGEuSmIpO251bGwhPW0mJm0ubmFtZT09YyYmKG09ZS54ZShhLmcsbSxhLkpiKSk7ZT1udWxsPT1tPzE6ZyhtLGwpO2lmKHYmJiFkLmUoKSYmMDw9ZSlyZXR1cm4gbnVsbCE9ZiYmaWQoZixuZXcgRChcImNoaWxkX2NoYW5nZWRcIixkLGMseSkpLGIuUShjLGQpO251bGwhPWYmJmlkKGYsbmV3IEQoXCJjaGlsZF9yZW1vdmVkXCIseSxjKSk7Yj1iLlEoYyxDKTtyZXR1cm4gbnVsbCE9bSYmYS5yYS5tYXRjaGVzKG0pPyhudWxsIT1mJiZpZChmLG5ldyBEKFwiY2hpbGRfYWRkZWRcIixtLlMsbS5uYW1lKSksYi5RKG0ubmFtZSxcbm0uUykpOmJ9cmV0dXJuIGQuZSgpP2I6diYmMDw9ZyhtLGwpPyhudWxsIT1mJiYoaWQoZixuZXcgRChcImNoaWxkX3JlbW92ZWRcIixtLlMsbS5uYW1lKSksaWQoZixuZXcgRChcImNoaWxkX2FkZGVkXCIsZCxjKSkpLGIuUShjLGQpLlEobS5uYW1lLEMpKTpifTtmdW5jdGlvbiB5ZChhLGIpe3RoaXMuaGU9YTt0aGlzLmNnPWJ9ZnVuY3Rpb24gemQoYSl7dGhpcy5JPWF9XG56ZC5wcm90b3R5cGUuYmI9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9bmV3IGhkLGY7aWYoYi50eXBlPT09VmIpYi5zb3VyY2UudmU/Yz1BZCh0aGlzLGEsYi5wYXRoLGIuSWEsYyxkLGUpOihKKGIuc291cmNlLm9mLFwiVW5rbm93biBzb3VyY2UuXCIpLGY9Yi5zb3VyY2UuYWYsYz1CZCh0aGlzLGEsYi5wYXRoLGIuSWEsYyxkLGYsZSkpO2Vsc2UgaWYoYi50eXBlPT09Q2QpYi5zb3VyY2UudmU/Yz1EZCh0aGlzLGEsYi5wYXRoLGIuY2hpbGRyZW4sYyxkLGUpOihKKGIuc291cmNlLm9mLFwiVW5rbm93biBzb3VyY2UuXCIpLGY9Yi5zb3VyY2UuYWYsYz1FZCh0aGlzLGEsYi5wYXRoLGIuY2hpbGRyZW4sYyxkLGYsZSkpO2Vsc2UgaWYoYi50eXBlPT09WGIpaWYoYi5WZSlpZihmPWIucGF0aCxudWxsIT1jLnNjKGYpKWM9YTtlbHNle2I9bmV3IHFiKGMsYSxkKTtkPWEuRC5qKCk7aWYoZi5lKCl8fFwiLnByaW9yaXR5XCI9PT1PKGYpKUhiKGEudSgpKT9iPWMudWEodGIoYSkpOihiPWEudSgpLmooKSxcbkooYiBpbnN0YW5jZW9mIFQsXCJzZXJ2ZXJDaGlsZHJlbiB3b3VsZCBiZSBjb21wbGV0ZSBpZiBsZWFmIG5vZGVcIiksYj1jLnhjKGIpKSxiPXRoaXMuSS50YShkLGIsZSk7ZWxzZXtmPU8oZik7dmFyIGc9Yy5YYShmLGEudSgpKTtudWxsPT1nJiZyYihhLnUoKSxmKSYmKGc9ZC5NKGYpKTtiPW51bGwhPWc/dGhpcy5JLkcoZCxmLGcsYixlKTphLkQuaigpLkhhKGYpP3RoaXMuSS5HKGQsZixDLGIsZSk6ZDtiLmUoKSYmSGIoYS51KCkpJiYoZD1jLnVhKHRiKGEpKSxkLk4oKSYmKGI9dGhpcy5JLnRhKGIsZCxlKSkpfWQ9SGIoYS51KCkpfHxudWxsIT1jLnNjKEYpO2M9RmQoYSxiLGQsdGhpcy5JLkdhKCkpfWVsc2UgYz1HZCh0aGlzLGEsYi5wYXRoLGMsZCxlKTtlbHNlIGlmKGIudHlwZT09PSRiKWQ9Yi5wYXRoLGI9YS51KCksZj1iLmooKSxnPWIuJHx8ZC5lKCksYz1IZCh0aGlzLG5ldyBJZChhLkQsbmV3IHNiKGYsZyxiLlRiKSksZCxjLHBiLGUpO2Vsc2UgdGhyb3cgSGMoXCJVbmtub3duIG9wZXJhdGlvbiB0eXBlOiBcIitcbmIudHlwZSk7ZT1yYShlLmViKTtkPWM7Yj1kLkQ7Yi4kJiYoZj1iLmooKS5OKCl8fGIuaigpLmUoKSxnPUpkKGEpLCgwPGUubGVuZ3RofHwhYS5ELiR8fGYmJiFiLmooKS5aKGcpfHwhYi5qKCkuQSgpLlooZy5BKCkpKSYmZS5wdXNoKERiKEpkKGQpKSkpO3JldHVybiBuZXcgeWQoYyxlKX07XG5mdW5jdGlvbiBIZChhLGIsYyxkLGUsZil7dmFyIGc9Yi5EO2lmKG51bGwhPWQuc2MoYykpcmV0dXJuIGI7dmFyIGs7aWYoYy5lKCkpSihIYihiLnUoKSksXCJJZiBjaGFuZ2UgcGF0aCBpcyBlbXB0eSwgd2UgbXVzdCBoYXZlIGNvbXBsZXRlIHNlcnZlciBkYXRhXCIpLGIudSgpLlRiPyhlPXRiKGIpLGQ9ZC54YyhlIGluc3RhbmNlb2YgVD9lOkMpKTpkPWQudWEodGIoYikpLGY9YS5JLnRhKGIuRC5qKCksZCxmKTtlbHNle3ZhciBsPU8oYyk7aWYoXCIucHJpb3JpdHlcIj09bClKKDE9PXVjKGMpLFwiQ2FuJ3QgaGF2ZSBhIHByaW9yaXR5IHdpdGggYWRkaXRpb25hbCBwYXRoIGNvbXBvbmVudHNcIiksZj1nLmooKSxrPWIudSgpLmooKSxkPWQuaGQoYyxmLGspLGY9bnVsbCE9ZD9hLkkuZGEoZixkKTpnLmooKTtlbHNle3ZhciBtPUcoYyk7cmIoZyxsKT8oaz1iLnUoKS5qKCksZD1kLmhkKGMsZy5qKCksayksZD1udWxsIT1kP2cuaigpLk0obCkuRyhtLGQpOmcuaigpLk0obCkpOmQ9ZC5YYShsLGIudSgpKTtcbmY9bnVsbCE9ZD9hLkkuRyhnLmooKSxsLGQsZSxmKTpnLmooKX19cmV0dXJuIEZkKGIsZixnLiR8fGMuZSgpLGEuSS5HYSgpKX1mdW5jdGlvbiBCZChhLGIsYyxkLGUsZixnLGspe3ZhciBsPWIudSgpO2c9Zz9hLkk6YS5JLlZiKCk7aWYoYy5lKCkpZD1nLnRhKGwuaigpLGQsbnVsbCk7ZWxzZSBpZihnLkdhKCkmJiFsLlRiKWQ9bC5qKCkuRyhjLGQpLGQ9Zy50YShsLmooKSxkLG51bGwpO2Vsc2V7dmFyIG09TyhjKTtpZigoYy5lKCk/IWwuJHx8bC5UYjohcmIobCxPKGMpKSkmJjE8dWMoYykpcmV0dXJuIGI7ZD1sLmooKS5NKG0pLkcoRyhjKSxkKTtkPVwiLnByaW9yaXR5XCI9PW0/Zy5kYShsLmooKSxkKTpnLkcobC5qKCksbSxkLHBiLG51bGwpfWw9bC4kfHxjLmUoKTtiPW5ldyBJZChiLkQsbmV3IHNiKGQsbCxnLkdhKCkpKTtyZXR1cm4gSGQoYSxiLGMsZSxuZXcgcWIoZSxiLGYpLGspfVxuZnVuY3Rpb24gQWQoYSxiLGMsZCxlLGYsZyl7dmFyIGs9Yi5EO2U9bmV3IHFiKGUsYixmKTtpZihjLmUoKSlnPWEuSS50YShiLkQuaigpLGQsZyksYT1GZChiLGcsITAsYS5JLkdhKCkpO2Vsc2UgaWYoZj1PKGMpLFwiLnByaW9yaXR5XCI9PT1mKWc9YS5JLmRhKGIuRC5qKCksZCksYT1GZChiLGcsay4kLGsuVGIpO2Vsc2V7dmFyIGw9RyhjKTtjPWsuaigpLk0oZik7aWYoIWwuZSgpKXt2YXIgbT1lLnBmKGYpO2Q9bnVsbCE9bT9cIi5wcmlvcml0eVwiPT09dmMobCkmJm0ub2EobC5wYXJlbnQoKSkuZSgpP206bS5HKGwsZCk6Q31jLlooZCk/YT1iOihnPWEuSS5HKGsuaigpLGYsZCxlLGcpLGE9RmQoYixnLGsuJCxhLkkuR2EoKSkpfXJldHVybiBhfVxuZnVuY3Rpb24gRGQoYSxiLGMsZCxlLGYsZyl7dmFyIGs9YjtLZChkLGZ1bmN0aW9uKGQsbSl7dmFyIHY9Yy53KGQpO3JiKGIuRCxPKHYpKSYmKGs9QWQoYSxrLHYsbSxlLGYsZykpfSk7S2QoZCxmdW5jdGlvbihkLG0pe3ZhciB2PWMudyhkKTtyYihiLkQsTyh2KSl8fChrPUFkKGEsayx2LG0sZSxmLGcpKX0pO3JldHVybiBrfWZ1bmN0aW9uIExkKGEsYil7S2QoYixmdW5jdGlvbihiLGQpe2E9YS5HKGIsZCl9KTtyZXR1cm4gYX1cbmZ1bmN0aW9uIEVkKGEsYixjLGQsZSxmLGcsayl7aWYoYi51KCkuaigpLmUoKSYmIUhiKGIudSgpKSlyZXR1cm4gYjt2YXIgbD1iO2M9Yy5lKCk/ZDpNZChOZCxjLGQpO3ZhciBtPWIudSgpLmooKTtjLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGMsZCl7aWYobS5IYShjKSl7dmFyIEk9Yi51KCkuaigpLk0oYyksST1MZChJLGQpO2w9QmQoYSxsLG5ldyBLKGMpLEksZSxmLGcsayl9fSk7Yy5jaGlsZHJlbi5oYShmdW5jdGlvbihjLGQpe3ZhciBJPSFIYihiLnUoKSkmJm51bGw9PWQudmFsdWU7bS5IYShjKXx8SXx8KEk9Yi51KCkuaigpLk0oYyksST1MZChJLGQpLGw9QmQoYSxsLG5ldyBLKGMpLEksZSxmLGcsaykpfSk7cmV0dXJuIGx9XG5mdW5jdGlvbiBHZChhLGIsYyxkLGUsZil7aWYobnVsbCE9ZC5zYyhjKSlyZXR1cm4gYjt2YXIgZz1uZXcgcWIoZCxiLGUpLGs9ZT1iLkQuaigpO2lmKEhiKGIudSgpKSl7aWYoYy5lKCkpZT1kLnVhKHRiKGIpKSxrPWEuSS50YShiLkQuaigpLGUsZik7ZWxzZSBpZihcIi5wcmlvcml0eVwiPT09TyhjKSl7dmFyIGw9ZC5YYShPKGMpLGIudSgpKTtudWxsPT1sfHxlLmUoKXx8ZS5BKCkuWihsKXx8KGs9YS5JLmRhKGUsbCkpfWVsc2UgbD1PKGMpLGU9ZC5YYShsLGIudSgpKSxudWxsIT1lJiYoaz1hLkkuRyhiLkQuaigpLGwsZSxnLGYpKTtlPSEwfWVsc2UgaWYoYi5ELiR8fGMuZSgpKWs9ZSxlPWIuRC5qKCksZS5OKCl8fGUuVShNLGZ1bmN0aW9uKGMpe3ZhciBlPWQuWGEoYyxiLnUoKSk7bnVsbCE9ZSYmKGs9YS5JLkcoayxjLGUsZyxmKSl9KSxlPWIuRC4kO2Vsc2V7bD1PKGMpO2lmKDE9PXVjKGMpfHxyYihiLkQsbCkpYz1kLlhhKGwsYi51KCkpLG51bGwhPWMmJihrPWEuSS5HKGUsbCxjLFxuZyxmKSk7ZT0hMX1yZXR1cm4gRmQoYixrLGUsYS5JLkdhKCkpfTtmdW5jdGlvbiBPZCgpe312YXIgUGQ9e307ZnVuY3Rpb24gdWQoYSl7cmV0dXJuIHEoYS5jb21wYXJlLGEpfU9kLnByb3RvdHlwZS54ZD1mdW5jdGlvbihhLGIpe3JldHVybiAwIT09dGhpcy5jb21wYXJlKG5ldyBFKFwiW01JTl9OQU1FXVwiLGEpLG5ldyBFKFwiW01JTl9OQU1FXVwiLGIpKX07T2QucHJvdG90eXBlLlNjPWZ1bmN0aW9uKCl7cmV0dXJuIFFkfTtmdW5jdGlvbiBSZChhKXt0aGlzLmJjPWF9bWEoUmQsT2QpO2g9UmQucHJvdG90eXBlO2guSGM9ZnVuY3Rpb24oYSl7cmV0dXJuIWEuTSh0aGlzLmJjKS5lKCl9O2guY29tcGFyZT1mdW5jdGlvbihhLGIpe3ZhciBjPWEuUy5NKHRoaXMuYmMpLGQ9Yi5TLk0odGhpcy5iYyksYz1jLkNjKGQpO3JldHVybiAwPT09Yz9TYihhLm5hbWUsYi5uYW1lKTpjfTtoLk9jPWZ1bmN0aW9uKGEsYil7dmFyIGM9TChhKSxjPUMuUSh0aGlzLmJjLGMpO3JldHVybiBuZXcgRShiLGMpfTtcbmguUGM9ZnVuY3Rpb24oKXt2YXIgYT1DLlEodGhpcy5iYyxTZCk7cmV0dXJuIG5ldyBFKFwiW01BWF9OQU1FXVwiLGEpfTtoLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmN9O2Z1bmN0aW9uIFRkKCl7fW1hKFRkLE9kKTtoPVRkLnByb3RvdHlwZTtoLmNvbXBhcmU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLlMuQSgpLGQ9Yi5TLkEoKSxjPWMuQ2MoZCk7cmV0dXJuIDA9PT1jP1NiKGEubmFtZSxiLm5hbWUpOmN9O2guSGM9ZnVuY3Rpb24oYSl7cmV0dXJuIWEuQSgpLmUoKX07aC54ZD1mdW5jdGlvbihhLGIpe3JldHVybiFhLkEoKS5aKGIuQSgpKX07aC5TYz1mdW5jdGlvbigpe3JldHVybiBRZH07aC5QYz1mdW5jdGlvbigpe3JldHVybiBuZXcgRShcIltNQVhfTkFNRV1cIixuZXcgdGMoXCJbUFJJT1JJVFktUE9TVF1cIixTZCkpfTtoLk9jPWZ1bmN0aW9uKGEsYil7dmFyIGM9TChhKTtyZXR1cm4gbmV3IEUoYixuZXcgdGMoXCJbUFJJT1JJVFktUE9TVF1cIixjKSl9O1xuaC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiLnByaW9yaXR5XCJ9O3ZhciBNPW5ldyBUZDtmdW5jdGlvbiBVZCgpe31tYShVZCxPZCk7aD1VZC5wcm90b3R5cGU7aC5jb21wYXJlPWZ1bmN0aW9uKGEsYil7cmV0dXJuIFNiKGEubmFtZSxiLm5hbWUpfTtoLkhjPWZ1bmN0aW9uKCl7dGhyb3cgSGMoXCJLZXlJbmRleC5pc0RlZmluZWRPbiBub3QgZXhwZWN0ZWQgdG8gYmUgY2FsbGVkLlwiKTt9O2gueGQ9ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5TYz1mdW5jdGlvbigpe3JldHVybiBRZH07aC5QYz1mdW5jdGlvbigpe3JldHVybiBuZXcgRShcIltNQVhfTkFNRV1cIixDKX07aC5PYz1mdW5jdGlvbihhKXtKKHAoYSksXCJLZXlJbmRleCBpbmRleFZhbHVlIG11c3QgYWx3YXlzIGJlIGEgc3RyaW5nLlwiKTtyZXR1cm4gbmV3IEUoYSxDKX07aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiLmtleVwifTt2YXIgVmQ9bmV3IFVkO2Z1bmN0aW9uIFdkKCl7fW1hKFdkLE9kKTtoPVdkLnByb3RvdHlwZTtcbmguY29tcGFyZT1mdW5jdGlvbihhLGIpe3ZhciBjPWEuUy5DYyhiLlMpO3JldHVybiAwPT09Yz9TYihhLm5hbWUsYi5uYW1lKTpjfTtoLkhjPWZ1bmN0aW9uKCl7cmV0dXJuITB9O2gueGQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4hYS5aKGIpfTtoLlNjPWZ1bmN0aW9uKCl7cmV0dXJuIFFkfTtoLlBjPWZ1bmN0aW9uKCl7cmV0dXJuIFhkfTtoLk9jPWZ1bmN0aW9uKGEsYil7dmFyIGM9TChhKTtyZXR1cm4gbmV3IEUoYixjKX07aC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiLnZhbHVlXCJ9O3ZhciBZZD1uZXcgV2Q7ZnVuY3Rpb24gWmQoKXt0aGlzLlJiPXRoaXMubmE9dGhpcy5MYj10aGlzLmxhPXRoaXMuaWE9ITE7dGhpcy5qYT0wO3RoaXMuTmI9XCJcIjt0aGlzLmRjPW51bGw7dGhpcy54Yj1cIlwiO3RoaXMuYWM9bnVsbDt0aGlzLnZiPVwiXCI7dGhpcy5nPU19dmFyICRkPW5ldyBaZDtmdW5jdGlvbiBzZChhKXtyZXR1cm5cIlwiPT09YS5OYj9hLmxhOlwibFwiPT09YS5OYn1mdW5jdGlvbiBvZChhKXtKKGEubGEsXCJPbmx5IHZhbGlkIGlmIHN0YXJ0IGhhcyBiZWVuIHNldFwiKTtyZXR1cm4gYS5kY31mdW5jdGlvbiBuZChhKXtKKGEubGEsXCJPbmx5IHZhbGlkIGlmIHN0YXJ0IGhhcyBiZWVuIHNldFwiKTtyZXR1cm4gYS5MYj9hLnhiOlwiW01JTl9OQU1FXVwifWZ1bmN0aW9uIHFkKGEpe0ooYS5uYSxcIk9ubHkgdmFsaWQgaWYgZW5kIGhhcyBiZWVuIHNldFwiKTtyZXR1cm4gYS5hY31cbmZ1bmN0aW9uIHBkKGEpe0ooYS5uYSxcIk9ubHkgdmFsaWQgaWYgZW5kIGhhcyBiZWVuIHNldFwiKTtyZXR1cm4gYS5SYj9hLnZiOlwiW01BWF9OQU1FXVwifWZ1bmN0aW9uIGFlKGEpe3ZhciBiPW5ldyBaZDtiLmlhPWEuaWE7Yi5qYT1hLmphO2IubGE9YS5sYTtiLmRjPWEuZGM7Yi5MYj1hLkxiO2IueGI9YS54YjtiLm5hPWEubmE7Yi5hYz1hLmFjO2IuUmI9YS5SYjtiLnZiPWEudmI7Yi5nPWEuZztyZXR1cm4gYn1oPVpkLnByb3RvdHlwZTtoLkdlPWZ1bmN0aW9uKGEpe3ZhciBiPWFlKHRoaXMpO2IuaWE9ITA7Yi5qYT1hO2IuTmI9XCJcIjtyZXR1cm4gYn07aC5IZT1mdW5jdGlvbihhKXt2YXIgYj1hZSh0aGlzKTtiLmlhPSEwO2IuamE9YTtiLk5iPVwibFwiO3JldHVybiBifTtoLkllPWZ1bmN0aW9uKGEpe3ZhciBiPWFlKHRoaXMpO2IuaWE9ITA7Yi5qYT1hO2IuTmI9XCJyXCI7cmV0dXJuIGJ9O1xuaC5YZD1mdW5jdGlvbihhLGIpe3ZhciBjPWFlKHRoaXMpO2MubGE9ITA7bihhKXx8KGE9bnVsbCk7Yy5kYz1hO251bGwhPWI/KGMuTGI9ITAsYy54Yj1iKTooYy5MYj0hMSxjLnhiPVwiXCIpO3JldHVybiBjfTtoLnFkPWZ1bmN0aW9uKGEsYil7dmFyIGM9YWUodGhpcyk7Yy5uYT0hMDtuKGEpfHwoYT1udWxsKTtjLmFjPWE7bihiKT8oYy5SYj0hMCxjLnZiPWIpOihjLllnPSExLGMudmI9XCJcIik7cmV0dXJuIGN9O2Z1bmN0aW9uIGJlKGEsYil7dmFyIGM9YWUoYSk7Yy5nPWI7cmV0dXJuIGN9ZnVuY3Rpb24gY2UoYSl7dmFyIGI9e307YS5sYSYmKGIuc3A9YS5kYyxhLkxiJiYoYi5zbj1hLnhiKSk7YS5uYSYmKGIuZXA9YS5hYyxhLlJiJiYoYi5lbj1hLnZiKSk7aWYoYS5pYSl7Yi5sPWEuamE7dmFyIGM9YS5OYjtcIlwiPT09YyYmKGM9c2QoYSk/XCJsXCI6XCJyXCIpO2IudmY9Y31hLmchPT1NJiYoYi5pPWEuZy50b1N0cmluZygpKTtyZXR1cm4gYn1cbmZ1bmN0aW9uIGRlKGEpe3JldHVybiEoYS5sYXx8YS5uYXx8YS5pYSl9ZnVuY3Rpb24gZWUoYSl7dmFyIGI9e307aWYoZGUoYSkmJmEuZz09TSlyZXR1cm4gYjt2YXIgYzthLmc9PT1NP2M9XCIkcHJpb3JpdHlcIjphLmc9PT1ZZD9jPVwiJHZhbHVlXCI6KEooYS5nIGluc3RhbmNlb2YgUmQsXCJVbnJlY29nbml6ZWQgaW5kZXggdHlwZSFcIiksYz1hLmcudG9TdHJpbmcoKSk7Yi5vcmRlckJ5PUIoYyk7YS5sYSYmKGIuc3RhcnRBdD1CKGEuZGMpLGEuTGImJihiLnN0YXJ0QXQrPVwiLFwiK0IoYS54YikpKTthLm5hJiYoYi5lbmRBdD1CKGEuYWMpLGEuUmImJihiLmVuZEF0Kz1cIixcIitCKGEudmIpKSk7YS5pYSYmKHNkKGEpP2IubGltaXRUb0ZpcnN0PWEuamE6Yi5saW1pdFRvTGFzdD1hLmphKTtyZXR1cm4gYn1oLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIEIoY2UodGhpcykpfTtmdW5jdGlvbiBmZShhLGIpe3RoaXMueWQ9YTt0aGlzLmNjPWJ9ZmUucHJvdG90eXBlLmdldD1mdW5jdGlvbihhKXt2YXIgYj13KHRoaXMueWQsYSk7aWYoIWIpdGhyb3cgRXJyb3IoXCJObyBpbmRleCBkZWZpbmVkIGZvciBcIithKTtyZXR1cm4gYj09PVBkP251bGw6Yn07ZnVuY3Rpb24gZ2UoYSxiLGMpe3ZhciBkPW5hKGEueWQsZnVuY3Rpb24oZCxmKXt2YXIgZz13KGEuY2MsZik7SihnLFwiTWlzc2luZyBpbmRleCBpbXBsZW1lbnRhdGlvbiBmb3IgXCIrZik7aWYoZD09PVBkKXtpZihnLkhjKGIuUykpe2Zvcih2YXIgaz1bXSxsPWMuV2IoUWIpLG09SChsKTttOyltLm5hbWUhPWIubmFtZSYmay5wdXNoKG0pLG09SChsKTtrLnB1c2goYik7cmV0dXJuIGhlKGssdWQoZykpfXJldHVybiBQZH1nPWMuZ2V0KGIubmFtZSk7az1kO2cmJihrPWsucmVtb3ZlKG5ldyBFKGIubmFtZSxnKSkpO3JldHVybiBrLk5hKGIsYi5TKX0pO3JldHVybiBuZXcgZmUoZCxhLmNjKX1cbmZ1bmN0aW9uIGllKGEsYixjKXt2YXIgZD1uYShhLnlkLGZ1bmN0aW9uKGEpe2lmKGE9PT1QZClyZXR1cm4gYTt2YXIgZD1jLmdldChiLm5hbWUpO3JldHVybiBkP2EucmVtb3ZlKG5ldyBFKGIubmFtZSxkKSk6YX0pO3JldHVybiBuZXcgZmUoZCxhLmNjKX12YXIgamU9bmV3IGZlKHtcIi5wcmlvcml0eVwiOlBkfSx7XCIucHJpb3JpdHlcIjpNfSk7ZnVuY3Rpb24gdGMoYSxiKXt0aGlzLkM9YTtKKG4odGhpcy5DKSYmbnVsbCE9PXRoaXMuQyxcIkxlYWZOb2RlIHNob3VsZG4ndCBiZSBjcmVhdGVkIHdpdGggbnVsbC91bmRlZmluZWQgdmFsdWUuXCIpO3RoaXMuYmE9Ynx8QztrZSh0aGlzLmJhKTt0aGlzLkJiPW51bGx9aD10Yy5wcm90b3R5cGU7aC5OPWZ1bmN0aW9uKCl7cmV0dXJuITB9O2guQT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmJhfTtoLmRhPWZ1bmN0aW9uKGEpe3JldHVybiBuZXcgdGModGhpcy5DLGEpfTtoLk09ZnVuY3Rpb24oYSl7cmV0dXJuXCIucHJpb3JpdHlcIj09PWE/dGhpcy5iYTpDfTtoLm9hPWZ1bmN0aW9uKGEpe3JldHVybiBhLmUoKT90aGlzOlwiLnByaW9yaXR5XCI9PT1PKGEpP3RoaXMuYmE6Q307aC5IYT1mdW5jdGlvbigpe3JldHVybiExfTtoLnFmPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9O1xuaC5RPWZ1bmN0aW9uKGEsYil7cmV0dXJuXCIucHJpb3JpdHlcIj09PWE/dGhpcy5kYShiKTpiLmUoKSYmXCIucHJpb3JpdHlcIiE9PWE/dGhpczpDLlEoYSxiKS5kYSh0aGlzLmJhKX07aC5HPWZ1bmN0aW9uKGEsYil7dmFyIGM9TyhhKTtpZihudWxsPT09YylyZXR1cm4gYjtpZihiLmUoKSYmXCIucHJpb3JpdHlcIiE9PWMpcmV0dXJuIHRoaXM7SihcIi5wcmlvcml0eVwiIT09Y3x8MT09PXVjKGEpLFwiLnByaW9yaXR5IG11c3QgYmUgdGhlIGxhc3QgdG9rZW4gaW4gYSBwYXRoXCIpO3JldHVybiB0aGlzLlEoYyxDLkcoRyhhKSxiKSl9O2guZT1mdW5jdGlvbigpe3JldHVybiExfTtoLkRiPWZ1bmN0aW9uKCl7cmV0dXJuIDB9O2guSz1mdW5jdGlvbihhKXtyZXR1cm4gYSYmIXRoaXMuQSgpLmUoKT97XCIudmFsdWVcIjp0aGlzLkJhKCksXCIucHJpb3JpdHlcIjp0aGlzLkEoKS5LKCl9OnRoaXMuQmEoKX07XG5oLmhhc2g9ZnVuY3Rpb24oKXtpZihudWxsPT09dGhpcy5CYil7dmFyIGE9XCJcIjt0aGlzLmJhLmUoKXx8KGErPVwicHJpb3JpdHk6XCIrbGUodGhpcy5iYS5LKCkpK1wiOlwiKTt2YXIgYj10eXBlb2YgdGhpcy5DLGE9YSsoYitcIjpcIiksYT1cIm51bWJlclwiPT09Yj9hK1pjKHRoaXMuQyk6YSt0aGlzLkM7dGhpcy5CYj1KYyhhKX1yZXR1cm4gdGhpcy5CYn07aC5CYT1mdW5jdGlvbigpe3JldHVybiB0aGlzLkN9O2guQ2M9ZnVuY3Rpb24oYSl7aWYoYT09PUMpcmV0dXJuIDE7aWYoYSBpbnN0YW5jZW9mIFQpcmV0dXJuLTE7SihhLk4oKSxcIlVua25vd24gbm9kZSB0eXBlXCIpO3ZhciBiPXR5cGVvZiBhLkMsYz10eXBlb2YgdGhpcy5DLGQ9TmEobWUsYiksZT1OYShtZSxjKTtKKDA8PWQsXCJVbmtub3duIGxlYWYgdHlwZTogXCIrYik7SigwPD1lLFwiVW5rbm93biBsZWFmIHR5cGU6IFwiK2MpO3JldHVybiBkPT09ZT9cIm9iamVjdFwiPT09Yz8wOnRoaXMuQzxhLkM/LTE6dGhpcy5DPT09YS5DPzA6MTplLWR9O1xudmFyIG1lPVtcIm9iamVjdFwiLFwiYm9vbGVhblwiLFwibnVtYmVyXCIsXCJzdHJpbmdcIl07dGMucHJvdG90eXBlLm1iPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9O3RjLnByb3RvdHlwZS5JYz1mdW5jdGlvbigpe3JldHVybiEwfTt0Yy5wcm90b3R5cGUuWj1mdW5jdGlvbihhKXtyZXR1cm4gYT09PXRoaXM/ITA6YS5OKCk/dGhpcy5DPT09YS5DJiZ0aGlzLmJhLlooYS5iYSk6ITF9O3RjLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiBCKHRoaXMuSyghMCkpfTtmdW5jdGlvbiBUKGEsYixjKXt0aGlzLm09YTsodGhpcy5iYT1iKSYma2UodGhpcy5iYSk7YS5lKCkmJkooIXRoaXMuYmF8fHRoaXMuYmEuZSgpLFwiQW4gZW1wdHkgbm9kZSBjYW5ub3QgaGF2ZSBhIHByaW9yaXR5XCIpO3RoaXMud2I9Yzt0aGlzLkJiPW51bGx9aD1ULnByb3RvdHlwZTtoLk49ZnVuY3Rpb24oKXtyZXR1cm4hMX07aC5BPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYmF8fEN9O2guZGE9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMubS5lKCk/dGhpczpuZXcgVCh0aGlzLm0sYSx0aGlzLndiKX07aC5NPWZ1bmN0aW9uKGEpe2lmKFwiLnByaW9yaXR5XCI9PT1hKXJldHVybiB0aGlzLkEoKTthPXRoaXMubS5nZXQoYSk7cmV0dXJuIG51bGw9PT1hP0M6YX07aC5vYT1mdW5jdGlvbihhKXt2YXIgYj1PKGEpO3JldHVybiBudWxsPT09Yj90aGlzOnRoaXMuTShiKS5vYShHKGEpKX07aC5IYT1mdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9PXRoaXMubS5nZXQoYSl9O1xuaC5RPWZ1bmN0aW9uKGEsYil7SihiLFwiV2Ugc2hvdWxkIGFsd2F5cyBiZSBwYXNzaW5nIHNuYXBzaG90IG5vZGVzXCIpO2lmKFwiLnByaW9yaXR5XCI9PT1hKXJldHVybiB0aGlzLmRhKGIpO3ZhciBjPW5ldyBFKGEsYiksZCxlO2IuZSgpPyhkPXRoaXMubS5yZW1vdmUoYSksYz1pZSh0aGlzLndiLGMsdGhpcy5tKSk6KGQ9dGhpcy5tLk5hKGEsYiksYz1nZSh0aGlzLndiLGMsdGhpcy5tKSk7ZT1kLmUoKT9DOnRoaXMuYmE7cmV0dXJuIG5ldyBUKGQsZSxjKX07aC5HPWZ1bmN0aW9uKGEsYil7dmFyIGM9TyhhKTtpZihudWxsPT09YylyZXR1cm4gYjtKKFwiLnByaW9yaXR5XCIhPT1PKGEpfHwxPT09dWMoYSksXCIucHJpb3JpdHkgbXVzdCBiZSB0aGUgbGFzdCB0b2tlbiBpbiBhIHBhdGhcIik7dmFyIGQ9dGhpcy5NKGMpLkcoRyhhKSxiKTtyZXR1cm4gdGhpcy5RKGMsZCl9O2guZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm0uZSgpfTtoLkRiPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubS5jb3VudCgpfTtcbnZhciBuZT0vXigwfFsxLTldXFxkKikkLztoPVQucHJvdG90eXBlO2guSz1mdW5jdGlvbihhKXtpZih0aGlzLmUoKSlyZXR1cm4gbnVsbDt2YXIgYj17fSxjPTAsZD0wLGU9ITA7dGhpcy5VKE0sZnVuY3Rpb24oZixnKXtiW2ZdPWcuSyhhKTtjKys7ZSYmbmUudGVzdChmKT9kPU1hdGgubWF4KGQsTnVtYmVyKGYpKTplPSExfSk7aWYoIWEmJmUmJmQ8MipjKXt2YXIgZj1bXSxnO2ZvcihnIGluIGIpZltnXT1iW2ddO3JldHVybiBmfWEmJiF0aGlzLkEoKS5lKCkmJihiW1wiLnByaW9yaXR5XCJdPXRoaXMuQSgpLksoKSk7cmV0dXJuIGJ9O2guaGFzaD1mdW5jdGlvbigpe2lmKG51bGw9PT10aGlzLkJiKXt2YXIgYT1cIlwiO3RoaXMuQSgpLmUoKXx8KGErPVwicHJpb3JpdHk6XCIrbGUodGhpcy5BKCkuSygpKStcIjpcIik7dGhpcy5VKE0sZnVuY3Rpb24oYixjKXt2YXIgZD1jLmhhc2goKTtcIlwiIT09ZCYmKGErPVwiOlwiK2IrXCI6XCIrZCl9KTt0aGlzLkJiPVwiXCI9PT1hP1wiXCI6SmMoYSl9cmV0dXJuIHRoaXMuQmJ9O1xuaC5xZj1mdW5jdGlvbihhLGIsYyl7cmV0dXJuKGM9b2UodGhpcyxjKSk/KGE9Y2MoYyxuZXcgRShhLGIpKSk/YS5uYW1lOm51bGw6Y2ModGhpcy5tLGEpfTtmdW5jdGlvbiB3ZChhLGIpe3ZhciBjO2M9KGM9b2UoYSxiKSk/KGM9Yy5SYygpKSYmYy5uYW1lOmEubS5SYygpO3JldHVybiBjP25ldyBFKGMsYS5tLmdldChjKSk6bnVsbH1mdW5jdGlvbiB4ZChhLGIpe3ZhciBjO2M9KGM9b2UoYSxiKSk/KGM9Yy5lYygpKSYmYy5uYW1lOmEubS5lYygpO3JldHVybiBjP25ldyBFKGMsYS5tLmdldChjKSk6bnVsbH1oLlU9ZnVuY3Rpb24oYSxiKXt2YXIgYz1vZSh0aGlzLGEpO3JldHVybiBjP2MuaGEoZnVuY3Rpb24oYSl7cmV0dXJuIGIoYS5uYW1lLGEuUyl9KTp0aGlzLm0uaGEoYil9O2guV2I9ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuWGIoYS5TYygpLGEpfTtcbmguWGI9ZnVuY3Rpb24oYSxiKXt2YXIgYz1vZSh0aGlzLGIpO2lmKGMpcmV0dXJuIGMuWGIoYSxmdW5jdGlvbihhKXtyZXR1cm4gYX0pO2Zvcih2YXIgYz10aGlzLm0uWGIoYS5uYW1lLFFiKSxkPWVjKGMpO251bGwhPWQmJjA+Yi5jb21wYXJlKGQsYSk7KUgoYyksZD1lYyhjKTtyZXR1cm4gY307aC5yZj1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5aYihhLlBjKCksYSl9O2guWmI9ZnVuY3Rpb24oYSxiKXt2YXIgYz1vZSh0aGlzLGIpO2lmKGMpcmV0dXJuIGMuWmIoYSxmdW5jdGlvbihhKXtyZXR1cm4gYX0pO2Zvcih2YXIgYz10aGlzLm0uWmIoYS5uYW1lLFFiKSxkPWVjKGMpO251bGwhPWQmJjA8Yi5jb21wYXJlKGQsYSk7KUgoYyksZD1lYyhjKTtyZXR1cm4gY307aC5DYz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lKCk/YS5lKCk/MDotMTphLk4oKXx8YS5lKCk/MTphPT09U2Q/LTE6MH07XG5oLm1iPWZ1bmN0aW9uKGEpe2lmKGE9PT1WZHx8dGEodGhpcy53Yi5jYyxhLnRvU3RyaW5nKCkpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMud2IsYz10aGlzLm07SihhIT09VmQsXCJLZXlJbmRleCBhbHdheXMgZXhpc3RzIGFuZCBpc24ndCBtZWFudCB0byBiZSBhZGRlZCB0byB0aGUgSW5kZXhNYXAuXCIpO2Zvcih2YXIgZD1bXSxlPSExLGM9Yy5XYihRYiksZj1IKGMpO2Y7KWU9ZXx8YS5IYyhmLlMpLGQucHVzaChmKSxmPUgoYyk7ZD1lP2hlKGQsdWQoYSkpOlBkO2U9YS50b1N0cmluZygpO2M9eGEoYi5jYyk7Y1tlXT1hO2E9eGEoYi55ZCk7YVtlXT1kO3JldHVybiBuZXcgVCh0aGlzLm0sdGhpcy5iYSxuZXcgZmUoYSxjKSl9O2guSWM9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1WZHx8dGEodGhpcy53Yi5jYyxhLnRvU3RyaW5nKCkpfTtcbmguWj1mdW5jdGlvbihhKXtpZihhPT09dGhpcylyZXR1cm4hMDtpZihhLk4oKSlyZXR1cm4hMTtpZih0aGlzLkEoKS5aKGEuQSgpKSYmdGhpcy5tLmNvdW50KCk9PT1hLm0uY291bnQoKSl7dmFyIGI9dGhpcy5XYihNKTthPWEuV2IoTSk7Zm9yKHZhciBjPUgoYiksZD1IKGEpO2MmJmQ7KXtpZihjLm5hbWUhPT1kLm5hbWV8fCFjLlMuWihkLlMpKXJldHVybiExO2M9SChiKTtkPUgoYSl9cmV0dXJuIG51bGw9PT1jJiZudWxsPT09ZH1yZXR1cm4hMX07ZnVuY3Rpb24gb2UoYSxiKXtyZXR1cm4gYj09PVZkP251bGw6YS53Yi5nZXQoYi50b1N0cmluZygpKX1oLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIEIodGhpcy5LKCEwKSl9O2Z1bmN0aW9uIEwoYSxiKXtpZihudWxsPT09YSlyZXR1cm4gQzt2YXIgYz1udWxsO1wib2JqZWN0XCI9PT10eXBlb2YgYSYmXCIucHJpb3JpdHlcImluIGE/Yz1hW1wiLnByaW9yaXR5XCJdOlwidW5kZWZpbmVkXCIhPT10eXBlb2YgYiYmKGM9Yik7SihudWxsPT09Y3x8XCJzdHJpbmdcIj09PXR5cGVvZiBjfHxcIm51bWJlclwiPT09dHlwZW9mIGN8fFwib2JqZWN0XCI9PT10eXBlb2YgYyYmXCIuc3ZcImluIGMsXCJJbnZhbGlkIHByaW9yaXR5IHR5cGUgZm91bmQ6IFwiK3R5cGVvZiBjKTtcIm9iamVjdFwiPT09dHlwZW9mIGEmJlwiLnZhbHVlXCJpbiBhJiZudWxsIT09YVtcIi52YWx1ZVwiXSYmKGE9YVtcIi52YWx1ZVwiXSk7aWYoXCJvYmplY3RcIiE9PXR5cGVvZiBhfHxcIi5zdlwiaW4gYSlyZXR1cm4gbmV3IHRjKGEsTChjKSk7aWYoYSBpbnN0YW5jZW9mIEFycmF5KXt2YXIgZD1DLGU9YTtyKGUsZnVuY3Rpb24oYSxiKXtpZih1KGUsYikmJlwiLlwiIT09Yi5zdWJzdHJpbmcoMCwxKSl7dmFyIGM9TChhKTtpZihjLk4oKXx8IWMuZSgpKWQ9XG5kLlEoYixjKX19KTtyZXR1cm4gZC5kYShMKGMpKX12YXIgZj1bXSxnPSExLGs9YTtoYihrLGZ1bmN0aW9uKGEpe2lmKFwic3RyaW5nXCIhPT10eXBlb2YgYXx8XCIuXCIhPT1hLnN1YnN0cmluZygwLDEpKXt2YXIgYj1MKGtbYV0pO2IuZSgpfHwoZz1nfHwhYi5BKCkuZSgpLGYucHVzaChuZXcgRShhLGIpKSl9fSk7aWYoMD09Zi5sZW5ndGgpcmV0dXJuIEM7dmFyIGw9aGUoZixSYixmdW5jdGlvbihhKXtyZXR1cm4gYS5uYW1lfSxUYik7aWYoZyl7dmFyIG09aGUoZix1ZChNKSk7cmV0dXJuIG5ldyBUKGwsTChjKSxuZXcgZmUoe1wiLnByaW9yaXR5XCI6bX0se1wiLnByaW9yaXR5XCI6TX0pKX1yZXR1cm4gbmV3IFQobCxMKGMpLGplKX12YXIgcGU9TWF0aC5sb2coMik7XG5mdW5jdGlvbiBxZShhKXt0aGlzLmNvdW50PXBhcnNlSW50KE1hdGgubG9nKGErMSkvcGUsMTApO3RoaXMuaGY9dGhpcy5jb3VudC0xO3RoaXMuYmc9YSsxJnBhcnNlSW50KEFycmF5KHRoaXMuY291bnQrMSkuam9pbihcIjFcIiksMil9ZnVuY3Rpb24gcmUoYSl7dmFyIGI9IShhLmJnJjE8PGEuaGYpO2EuaGYtLTtyZXR1cm4gYn1cbmZ1bmN0aW9uIGhlKGEsYixjLGQpe2Z1bmN0aW9uIGUoYixkKXt2YXIgZj1kLWI7aWYoMD09ZilyZXR1cm4gbnVsbDtpZigxPT1mKXt2YXIgbT1hW2JdLHY9Yz9jKG0pOm07cmV0dXJuIG5ldyBmYyh2LG0uUywhMSxudWxsLG51bGwpfXZhciBtPXBhcnNlSW50KGYvMiwxMCkrYixmPWUoYixtKSx5PWUobSsxLGQpLG09YVttXSx2PWM/YyhtKTptO3JldHVybiBuZXcgZmModixtLlMsITEsZix5KX1hLnNvcnQoYik7dmFyIGY9ZnVuY3Rpb24oYil7ZnVuY3Rpb24gZChiLGcpe3ZhciBrPXYtYix5PXY7di09Yjt2YXIgeT1lKGsrMSx5KSxrPWFba10sST1jP2Moayk6ayx5PW5ldyBmYyhJLGsuUyxnLG51bGwseSk7Zj9mLmxlZnQ9eTptPXk7Zj15fWZvcih2YXIgZj1udWxsLG09bnVsbCx2PWEubGVuZ3RoLHk9MDt5PGIuY291bnQ7Kyt5KXt2YXIgST1yZShiKSx2ZD1NYXRoLnBvdygyLGIuY291bnQtKHkrMSkpO0k/ZCh2ZCwhMSk6KGQodmQsITEpLGQodmQsITApKX1yZXR1cm4gbX0obmV3IHFlKGEubGVuZ3RoKSk7XG5yZXR1cm4gbnVsbCE9PWY/bmV3IGFjKGR8fGIsZik6bmV3IGFjKGR8fGIpfWZ1bmN0aW9uIGxlKGEpe3JldHVyblwibnVtYmVyXCI9PT10eXBlb2YgYT9cIm51bWJlcjpcIitaYyhhKTpcInN0cmluZzpcIithfWZ1bmN0aW9uIGtlKGEpe2lmKGEuTigpKXt2YXIgYj1hLksoKTtKKFwic3RyaW5nXCI9PT10eXBlb2YgYnx8XCJudW1iZXJcIj09PXR5cGVvZiBifHxcIm9iamVjdFwiPT09dHlwZW9mIGImJnUoYixcIi5zdlwiKSxcIlByaW9yaXR5IG11c3QgYmUgYSBzdHJpbmcgb3IgbnVtYmVyLlwiKX1lbHNlIEooYT09PVNkfHxhLmUoKSxcInByaW9yaXR5IG9mIHVuZXhwZWN0ZWQgdHlwZS5cIik7SihhPT09U2R8fGEuQSgpLmUoKSxcIlByaW9yaXR5IG5vZGVzIGNhbid0IGhhdmUgYSBwcmlvcml0eSBvZiB0aGVpciBvd24uXCIpfXZhciBDPW5ldyBUKG5ldyBhYyhUYiksbnVsbCxqZSk7ZnVuY3Rpb24gc2UoKXtULmNhbGwodGhpcyxuZXcgYWMoVGIpLEMsamUpfW1hKHNlLFQpO2g9c2UucHJvdG90eXBlO1xuaC5DYz1mdW5jdGlvbihhKXtyZXR1cm4gYT09PXRoaXM/MDoxfTtoLlo9ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT10aGlzfTtoLkE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307aC5NPWZ1bmN0aW9uKCl7cmV0dXJuIEN9O2guZT1mdW5jdGlvbigpe3JldHVybiExfTt2YXIgU2Q9bmV3IHNlLFFkPW5ldyBFKFwiW01JTl9OQU1FXVwiLEMpLFhkPW5ldyBFKFwiW01BWF9OQU1FXVwiLFNkKTtmdW5jdGlvbiBJZChhLGIpe3RoaXMuRD1hO3RoaXMuVWQ9Yn1mdW5jdGlvbiBGZChhLGIsYyxkKXtyZXR1cm4gbmV3IElkKG5ldyBzYihiLGMsZCksYS5VZCl9ZnVuY3Rpb24gSmQoYSl7cmV0dXJuIGEuRC4kP2EuRC5qKCk6bnVsbH1JZC5wcm90b3R5cGUudT1mdW5jdGlvbigpe3JldHVybiB0aGlzLlVkfTtmdW5jdGlvbiB0YihhKXtyZXR1cm4gYS5VZC4kP2EuVWQuaigpOm51bGx9O2Z1bmN0aW9uIHRlKGEsYil7dGhpcy5WPWE7dmFyIGM9YS5uLGQ9bmV3IGxkKGMuZyksYz1kZShjKT9uZXcgbGQoYy5nKTpjLmlhP25ldyByZChjKTpuZXcgbWQoYyk7dGhpcy5HZj1uZXcgemQoYyk7dmFyIGU9Yi51KCksZj1iLkQsZz1kLnRhKEMsZS5qKCksbnVsbCksaz1jLnRhKEMsZi5qKCksbnVsbCk7dGhpcy5LYT1uZXcgSWQobmV3IHNiKGssZi4kLGMuR2EoKSksbmV3IHNiKGcsZS4kLGQuR2EoKSkpO3RoaXMuWmE9W107dGhpcy5pZz1uZXcgZGQoYSl9ZnVuY3Rpb24gdWUoYSl7cmV0dXJuIGEuVn1oPXRlLnByb3RvdHlwZTtoLnU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5LYS51KCkuaigpfTtoLmhiPWZ1bmN0aW9uKGEpe3ZhciBiPXRiKHRoaXMuS2EpO3JldHVybiBiJiYoZGUodGhpcy5WLm4pfHwhYS5lKCkmJiFiLk0oTyhhKSkuZSgpKT9iLm9hKGEpOm51bGx9O2guZT1mdW5jdGlvbigpe3JldHVybiAwPT09dGhpcy5aYS5sZW5ndGh9O2guT2I9ZnVuY3Rpb24oYSl7dGhpcy5aYS5wdXNoKGEpfTtcbmgua2I9ZnVuY3Rpb24oYSxiKXt2YXIgYz1bXTtpZihiKXtKKG51bGw9PWEsXCJBIGNhbmNlbCBzaG91bGQgY2FuY2VsIGFsbCBldmVudCByZWdpc3RyYXRpb25zLlwiKTt2YXIgZD10aGlzLlYucGF0aDtPYSh0aGlzLlphLGZ1bmN0aW9uKGEpeyhhPWEuZmYoYixkKSkmJmMucHVzaChhKX0pfWlmKGEpe2Zvcih2YXIgZT1bXSxmPTA7Zjx0aGlzLlphLmxlbmd0aDsrK2Ype3ZhciBnPXRoaXMuWmFbZl07aWYoIWcubWF0Y2hlcyhhKSllLnB1c2goZyk7ZWxzZSBpZihhLnNmKCkpe2U9ZS5jb25jYXQodGhpcy5aYS5zbGljZShmKzEpKTticmVha319dGhpcy5aYT1lfWVsc2UgdGhpcy5aYT1bXTtyZXR1cm4gY307XG5oLmJiPWZ1bmN0aW9uKGEsYixjKXthLnR5cGU9PT1DZCYmbnVsbCE9PWEuc291cmNlLkliJiYoSih0Yih0aGlzLkthKSxcIldlIHNob3VsZCBhbHdheXMgaGF2ZSBhIGZ1bGwgY2FjaGUgYmVmb3JlIGhhbmRsaW5nIG1lcmdlc1wiKSxKKEpkKHRoaXMuS2EpLFwiTWlzc2luZyBldmVudCBjYWNoZSwgZXZlbiB0aG91Z2ggd2UgaGF2ZSBhIHNlcnZlciBjYWNoZVwiKSk7dmFyIGQ9dGhpcy5LYTthPXRoaXMuR2YuYmIoZCxhLGIsYyk7Yj10aGlzLkdmO2M9YS5oZTtKKGMuRC5qKCkuSWMoYi5JLmcpLFwiRXZlbnQgc25hcCBub3QgaW5kZXhlZFwiKTtKKGMudSgpLmooKS5JYyhiLkkuZyksXCJTZXJ2ZXIgc25hcCBub3QgaW5kZXhlZFwiKTtKKEhiKGEuaGUudSgpKXx8IUhiKGQudSgpKSxcIk9uY2UgYSBzZXJ2ZXIgc25hcCBpcyBjb21wbGV0ZSwgaXQgc2hvdWxkIG5ldmVyIGdvIGJhY2tcIik7dGhpcy5LYT1hLmhlO3JldHVybiB2ZSh0aGlzLGEuY2csYS5oZS5ELmooKSxudWxsKX07XG5mdW5jdGlvbiB3ZShhLGIpe3ZhciBjPWEuS2EuRCxkPVtdO2MuaigpLk4oKXx8Yy5qKCkuVShNLGZ1bmN0aW9uKGEsYil7ZC5wdXNoKG5ldyBEKFwiY2hpbGRfYWRkZWRcIixiLGEpKX0pO2MuJCYmZC5wdXNoKERiKGMuaigpKSk7cmV0dXJuIHZlKGEsZCxjLmooKSxiKX1mdW5jdGlvbiB2ZShhLGIsYyxkKXtyZXR1cm4gZWQoYS5pZyxiLGMsZD9bZF06YS5aYSl9O2Z1bmN0aW9uIHhlKGEsYixjKXt0aGlzLnR5cGU9Q2Q7dGhpcy5zb3VyY2U9YTt0aGlzLnBhdGg9Yjt0aGlzLmNoaWxkcmVuPWN9eGUucHJvdG90eXBlLldjPWZ1bmN0aW9uKGEpe2lmKHRoaXMucGF0aC5lKCkpcmV0dXJuIGE9dGhpcy5jaGlsZHJlbi5zdWJ0cmVlKG5ldyBLKGEpKSxhLmUoKT9udWxsOmEudmFsdWU/bmV3IFViKHRoaXMuc291cmNlLEYsYS52YWx1ZSk6bmV3IHhlKHRoaXMuc291cmNlLEYsYSk7SihPKHRoaXMucGF0aCk9PT1hLFwiQ2FuJ3QgZ2V0IGEgbWVyZ2UgZm9yIGEgY2hpbGQgbm90IG9uIHRoZSBwYXRoIG9mIHRoZSBvcGVyYXRpb25cIik7cmV0dXJuIG5ldyB4ZSh0aGlzLnNvdXJjZSxHKHRoaXMucGF0aCksdGhpcy5jaGlsZHJlbil9O3hlLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiT3BlcmF0aW9uKFwiK3RoaXMucGF0aCtcIjogXCIrdGhpcy5zb3VyY2UudG9TdHJpbmcoKStcIiBtZXJnZTogXCIrdGhpcy5jaGlsZHJlbi50b1N0cmluZygpK1wiKVwifTt2YXIgVmI9MCxDZD0xLFhiPTIsJGI9MztmdW5jdGlvbiB5ZShhLGIsYyxkKXt0aGlzLnZlPWE7dGhpcy5vZj1iO3RoaXMuSWI9Yzt0aGlzLmFmPWQ7SighZHx8YixcIlRhZ2dlZCBxdWVyaWVzIG11c3QgYmUgZnJvbSBzZXJ2ZXIuXCIpfXZhciBZYj1uZXcgeWUoITAsITEsbnVsbCwhMSksemU9bmV3IHllKCExLCEwLG51bGwsITEpO3llLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLnZlP1widXNlclwiOnRoaXMuYWY/XCJzZXJ2ZXIocXVlcnlJRD1cIit0aGlzLkliK1wiKVwiOlwic2VydmVyXCJ9O2Z1bmN0aW9uIEFlKGEsYil7dGhpcy5mPU9jKFwicDpyZXN0OlwiKTt0aGlzLkg9YTt0aGlzLkdiPWI7dGhpcy5GYT1udWxsO3RoaXMuYWE9e319ZnVuY3Rpb24gQmUoYSxiKXtpZihuKGIpKXJldHVyblwidGFnJFwiK2I7dmFyIGM9YS5uO0ooZGUoYykmJmMuZz09TSxcInNob3VsZCBoYXZlIGEgdGFnIGlmIGl0J3Mgbm90IGEgZGVmYXVsdCBxdWVyeS5cIik7cmV0dXJuIGEucGF0aC50b1N0cmluZygpfWg9QWUucHJvdG90eXBlO1xuaC54Zj1mdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1hLnBhdGgudG9TdHJpbmcoKTt0aGlzLmYoXCJMaXN0ZW4gY2FsbGVkIGZvciBcIitlK1wiIFwiK2Eud2EoKSk7dmFyIGY9QmUoYSxjKSxnPXt9O3RoaXMuYWFbZl09ZzthPWVlKGEubik7dmFyIGs9dGhpcztDZSh0aGlzLGUrXCIuanNvblwiLGEsZnVuY3Rpb24oYSxiKXt2YXIgdj1iOzQwND09PWEmJihhPXY9bnVsbCk7bnVsbD09PWEmJmsuR2IoZSx2LCExLGMpO3coay5hYSxmKT09PWcmJmQoYT80MDE9PWE/XCJwZXJtaXNzaW9uX2RlbmllZFwiOlwicmVzdF9lcnJvcjpcIithOlwib2tcIixudWxsKX0pfTtoLk9mPWZ1bmN0aW9uKGEsYil7dmFyIGM9QmUoYSxiKTtkZWxldGUgdGhpcy5hYVtjXX07aC5QPWZ1bmN0aW9uKGEsYil7dGhpcy5GYT1hO3ZhciBjPWFkKGEpLGQ9Yy5kYXRhLGM9Yy5BYyYmYy5BYy5leHA7YiYmYihcIm9rXCIse2F1dGg6ZCxleHBpcmVzOmN9KX07aC5lZT1mdW5jdGlvbihhKXt0aGlzLkZhPW51bGw7YShcIm9rXCIsbnVsbCl9O1xuaC5MZT1mdW5jdGlvbigpe307aC5CZj1mdW5jdGlvbigpe307aC5HZD1mdW5jdGlvbigpe307aC5wdXQ9ZnVuY3Rpb24oKXt9O2gueWY9ZnVuY3Rpb24oKXt9O2guVGU9ZnVuY3Rpb24oKXt9O1xuZnVuY3Rpb24gQ2UoYSxiLGMsZCl7Yz1jfHx7fTtjLmZvcm1hdD1cImV4cG9ydFwiO2EuRmEmJihjLmF1dGg9YS5GYSk7dmFyIGU9KGEuSC5sYj9cImh0dHBzOi8vXCI6XCJodHRwOi8vXCIpK2EuSC5ob3N0K2IrXCI/XCIramIoYyk7YS5mKFwiU2VuZGluZyBSRVNUIHJlcXVlc3QgZm9yIFwiK2UpO3ZhciBmPW5ldyBYTUxIdHRwUmVxdWVzdDtmLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2lmKGQmJjQ9PT1mLnJlYWR5U3RhdGUpe2EuZihcIlJFU1QgUmVzcG9uc2UgZm9yIFwiK2UrXCIgcmVjZWl2ZWQuIHN0YXR1czpcIixmLnN0YXR1cyxcInJlc3BvbnNlOlwiLGYucmVzcG9uc2VUZXh0KTt2YXIgYj1udWxsO2lmKDIwMDw9Zi5zdGF0dXMmJjMwMD5mLnN0YXR1cyl7dHJ5e2I9bWIoZi5yZXNwb25zZVRleHQpfWNhdGNoKGMpe1EoXCJGYWlsZWQgdG8gcGFyc2UgSlNPTiByZXNwb25zZSBmb3IgXCIrZStcIjogXCIrZi5yZXNwb25zZVRleHQpfWQobnVsbCxiKX1lbHNlIDQwMSE9PWYuc3RhdHVzJiY0MDQhPT1cbmYuc3RhdHVzJiZRKFwiR290IHVuc3VjY2Vzc2Z1bCBSRVNUIHJlc3BvbnNlIGZvciBcIitlK1wiIFN0YXR1czogXCIrZi5zdGF0dXMpLGQoZi5zdGF0dXMpO2Q9bnVsbH19O2Yub3BlbihcIkdFVFwiLGUsITApO2Yuc2VuZCgpfTtmdW5jdGlvbiBEZShhLGIpe3RoaXMudmFsdWU9YTt0aGlzLmNoaWxkcmVuPWJ8fEVlfXZhciBFZT1uZXcgYWMoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYT09PWI/MDphPGI/LTE6MX0pO2Z1bmN0aW9uIEZlKGEpe3ZhciBiPU5kO3IoYSxmdW5jdGlvbihhLGQpe2I9Yi5zZXQobmV3IEsoZCksYSl9KTtyZXR1cm4gYn1oPURlLnByb3RvdHlwZTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbD09PXRoaXMudmFsdWUmJnRoaXMuY2hpbGRyZW4uZSgpfTtmdW5jdGlvbiBHZShhLGIsYyl7aWYobnVsbCE9YS52YWx1ZSYmYyhhLnZhbHVlKSlyZXR1cm57cGF0aDpGLHZhbHVlOmEudmFsdWV9O2lmKGIuZSgpKXJldHVybiBudWxsO3ZhciBkPU8oYik7YT1hLmNoaWxkcmVuLmdldChkKTtyZXR1cm4gbnVsbCE9PWE/KGI9R2UoYSxHKGIpLGMpLG51bGwhPWI/e3BhdGg6KG5ldyBLKGQpKS53KGIucGF0aCksdmFsdWU6Yi52YWx1ZX06bnVsbCk6bnVsbH1cbmZ1bmN0aW9uIEhlKGEsYil7cmV0dXJuIEdlKGEsYixmdW5jdGlvbigpe3JldHVybiEwfSl9aC5zdWJ0cmVlPWZ1bmN0aW9uKGEpe2lmKGEuZSgpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMuY2hpbGRyZW4uZ2V0KE8oYSkpO3JldHVybiBudWxsIT09Yj9iLnN1YnRyZWUoRyhhKSk6TmR9O2guc2V0PWZ1bmN0aW9uKGEsYil7aWYoYS5lKCkpcmV0dXJuIG5ldyBEZShiLHRoaXMuY2hpbGRyZW4pO3ZhciBjPU8oYSksZD0odGhpcy5jaGlsZHJlbi5nZXQoYyl8fE5kKS5zZXQoRyhhKSxiKSxjPXRoaXMuY2hpbGRyZW4uTmEoYyxkKTtyZXR1cm4gbmV3IERlKHRoaXMudmFsdWUsYyl9O1xuaC5yZW1vdmU9ZnVuY3Rpb24oYSl7aWYoYS5lKCkpcmV0dXJuIHRoaXMuY2hpbGRyZW4uZSgpP05kOm5ldyBEZShudWxsLHRoaXMuY2hpbGRyZW4pO3ZhciBiPU8oYSksYz10aGlzLmNoaWxkcmVuLmdldChiKTtyZXR1cm4gYz8oYT1jLnJlbW92ZShHKGEpKSxiPWEuZSgpP3RoaXMuY2hpbGRyZW4ucmVtb3ZlKGIpOnRoaXMuY2hpbGRyZW4uTmEoYixhKSxudWxsPT09dGhpcy52YWx1ZSYmYi5lKCk/TmQ6bmV3IERlKHRoaXMudmFsdWUsYikpOnRoaXN9O2guZ2V0PWZ1bmN0aW9uKGEpe2lmKGEuZSgpKXJldHVybiB0aGlzLnZhbHVlO3ZhciBiPXRoaXMuY2hpbGRyZW4uZ2V0KE8oYSkpO3JldHVybiBiP2IuZ2V0KEcoYSkpOm51bGx9O1xuZnVuY3Rpb24gTWQoYSxiLGMpe2lmKGIuZSgpKXJldHVybiBjO3ZhciBkPU8oYik7Yj1NZChhLmNoaWxkcmVuLmdldChkKXx8TmQsRyhiKSxjKTtkPWIuZSgpP2EuY2hpbGRyZW4ucmVtb3ZlKGQpOmEuY2hpbGRyZW4uTmEoZCxiKTtyZXR1cm4gbmV3IERlKGEudmFsdWUsZCl9ZnVuY3Rpb24gSWUoYSxiKXtyZXR1cm4gSmUoYSxGLGIpfWZ1bmN0aW9uIEplKGEsYixjKXt2YXIgZD17fTthLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGEsZil7ZFthXT1KZShmLGIudyhhKSxjKX0pO3JldHVybiBjKGIsYS52YWx1ZSxkKX1mdW5jdGlvbiBLZShhLGIsYyl7cmV0dXJuIExlKGEsYixGLGMpfWZ1bmN0aW9uIExlKGEsYixjLGQpe3ZhciBlPWEudmFsdWU/ZChjLGEudmFsdWUpOiExO2lmKGUpcmV0dXJuIGU7aWYoYi5lKCkpcmV0dXJuIG51bGw7ZT1PKGIpO3JldHVybihhPWEuY2hpbGRyZW4uZ2V0KGUpKT9MZShhLEcoYiksYy53KGUpLGQpOm51bGx9XG5mdW5jdGlvbiBNZShhLGIsYyl7dmFyIGQ9RjtpZighYi5lKCkpe3ZhciBlPSEwO2EudmFsdWUmJihlPWMoZCxhLnZhbHVlKSk7ITA9PT1lJiYoZT1PKGIpLChhPWEuY2hpbGRyZW4uZ2V0KGUpKSYmTmUoYSxHKGIpLGQudyhlKSxjKSl9fWZ1bmN0aW9uIE5lKGEsYixjLGQpe2lmKGIuZSgpKXJldHVybiBhO2EudmFsdWUmJmQoYyxhLnZhbHVlKTt2YXIgZT1PKGIpO3JldHVybihhPWEuY2hpbGRyZW4uZ2V0KGUpKT9OZShhLEcoYiksYy53KGUpLGQpOk5kfWZ1bmN0aW9uIEtkKGEsYil7T2UoYSxGLGIpfWZ1bmN0aW9uIE9lKGEsYixjKXthLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGEsZSl7T2UoZSxiLncoYSksYyl9KTthLnZhbHVlJiZjKGIsYS52YWx1ZSl9ZnVuY3Rpb24gUGUoYSxiKXthLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGEsZCl7ZC52YWx1ZSYmYihhLGQudmFsdWUpfSl9dmFyIE5kPW5ldyBEZShudWxsKTtcbkRlLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3ZhciBhPXt9O0tkKHRoaXMsZnVuY3Rpb24oYixjKXthW2IudG9TdHJpbmcoKV09Yy50b1N0cmluZygpfSk7cmV0dXJuIEIoYSl9O2Z1bmN0aW9uIFFlKGEpe3RoaXMuVz1hfXZhciBSZT1uZXcgUWUobmV3IERlKG51bGwpKTtmdW5jdGlvbiBTZShhLGIsYyl7aWYoYi5lKCkpcmV0dXJuIG5ldyBRZShuZXcgRGUoYykpO3ZhciBkPUhlKGEuVyxiKTtpZihudWxsIT1kKXt2YXIgZT1kLnBhdGgsZD1kLnZhbHVlO2I9TihlLGIpO2Q9ZC5HKGIsYyk7cmV0dXJuIG5ldyBRZShhLlcuc2V0KGUsZCkpfWE9TWQoYS5XLGIsbmV3IERlKGMpKTtyZXR1cm4gbmV3IFFlKGEpfWZ1bmN0aW9uIFRlKGEsYixjKXt2YXIgZD1hO2hiKGMsZnVuY3Rpb24oYSxjKXtkPVNlKGQsYi53KGEpLGMpfSk7cmV0dXJuIGR9UWUucHJvdG90eXBlLk9kPWZ1bmN0aW9uKGEpe2lmKGEuZSgpKXJldHVybiBSZTthPU1kKHRoaXMuVyxhLE5kKTtyZXR1cm4gbmV3IFFlKGEpfTtmdW5jdGlvbiBVZShhLGIpe3ZhciBjPUhlKGEuVyxiKTtyZXR1cm4gbnVsbCE9Yz9hLlcuZ2V0KGMucGF0aCkub2EoTihjLnBhdGgsYikpOm51bGx9XG5mdW5jdGlvbiBWZShhKXt2YXIgYj1bXSxjPWEuVy52YWx1ZTtudWxsIT1jP2MuTigpfHxjLlUoTSxmdW5jdGlvbihhLGMpe2IucHVzaChuZXcgRShhLGMpKX0pOmEuVy5jaGlsZHJlbi5oYShmdW5jdGlvbihhLGMpe251bGwhPWMudmFsdWUmJmIucHVzaChuZXcgRShhLGMudmFsdWUpKX0pO3JldHVybiBifWZ1bmN0aW9uIFdlKGEsYil7aWYoYi5lKCkpcmV0dXJuIGE7dmFyIGM9VWUoYSxiKTtyZXR1cm4gbnVsbCE9Yz9uZXcgUWUobmV3IERlKGMpKTpuZXcgUWUoYS5XLnN1YnRyZWUoYikpfVFlLnByb3RvdHlwZS5lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuVy5lKCl9O1FlLnByb3RvdHlwZS5hcHBseT1mdW5jdGlvbihhKXtyZXR1cm4gWGUoRix0aGlzLlcsYSl9O1xuZnVuY3Rpb24gWGUoYSxiLGMpe2lmKG51bGwhPWIudmFsdWUpcmV0dXJuIGMuRyhhLGIudmFsdWUpO3ZhciBkPW51bGw7Yi5jaGlsZHJlbi5oYShmdW5jdGlvbihiLGYpe1wiLnByaW9yaXR5XCI9PT1iPyhKKG51bGwhPT1mLnZhbHVlLFwiUHJpb3JpdHkgd3JpdGVzIG11c3QgYWx3YXlzIGJlIGxlYWYgbm9kZXNcIiksZD1mLnZhbHVlKTpjPVhlKGEudyhiKSxmLGMpfSk7Yy5vYShhKS5lKCl8fG51bGw9PT1kfHwoYz1jLkcoYS53KFwiLnByaW9yaXR5XCIpLGQpKTtyZXR1cm4gY307ZnVuY3Rpb24gWWUoKXt0aGlzLlQ9UmU7dGhpcy56YT1bXTt0aGlzLkxjPS0xfWg9WWUucHJvdG90eXBlO1xuaC5PZD1mdW5jdGlvbihhKXt2YXIgYj1VYSh0aGlzLnphLGZ1bmN0aW9uKGIpe3JldHVybiBiLmllPT09YX0pO0ooMDw9YixcInJlbW92ZVdyaXRlIGNhbGxlZCB3aXRoIG5vbmV4aXN0ZW50IHdyaXRlSWQuXCIpO3ZhciBjPXRoaXMuemFbYl07dGhpcy56YS5zcGxpY2UoYiwxKTtmb3IodmFyIGQ9Yy52aXNpYmxlLGU9ITEsZj10aGlzLnphLmxlbmd0aC0xO2QmJjA8PWY7KXt2YXIgZz10aGlzLnphW2ZdO2cudmlzaWJsZSYmKGY+PWImJlplKGcsYy5wYXRoKT9kPSExOmMucGF0aC5jb250YWlucyhnLnBhdGgpJiYoZT0hMCkpO2YtLX1pZihkKXtpZihlKXRoaXMuVD0kZSh0aGlzLnphLGFmLEYpLHRoaXMuTGM9MDx0aGlzLnphLmxlbmd0aD90aGlzLnphW3RoaXMuemEubGVuZ3RoLTFdLmllOi0xO2Vsc2UgaWYoYy5JYSl0aGlzLlQ9dGhpcy5ULk9kKGMucGF0aCk7ZWxzZXt2YXIgaz10aGlzO3IoYy5jaGlsZHJlbixmdW5jdGlvbihhLGIpe2suVD1rLlQuT2QoYy5wYXRoLncoYikpfSl9cmV0dXJuIGMucGF0aH1yZXR1cm4gbnVsbH07XG5oLnVhPWZ1bmN0aW9uKGEsYixjLGQpe2lmKGN8fGQpe3ZhciBlPVdlKHRoaXMuVCxhKTtyZXR1cm4hZCYmZS5lKCk/YjpkfHxudWxsIT1ifHxudWxsIT1VZShlLEYpPyhlPSRlKHRoaXMuemEsZnVuY3Rpb24oYil7cmV0dXJuKGIudmlzaWJsZXx8ZCkmJighY3x8ISgwPD1OYShjLGIuaWUpKSkmJihiLnBhdGguY29udGFpbnMoYSl8fGEuY29udGFpbnMoYi5wYXRoKSl9LGEpLGI9Ynx8QyxlLmFwcGx5KGIpKTpudWxsfWU9VWUodGhpcy5ULGEpO2lmKG51bGwhPWUpcmV0dXJuIGU7ZT1XZSh0aGlzLlQsYSk7cmV0dXJuIGUuZSgpP2I6bnVsbCE9Ynx8bnVsbCE9VWUoZSxGKT8oYj1ifHxDLGUuYXBwbHkoYikpOm51bGx9O1xuaC54Yz1mdW5jdGlvbihhLGIpe3ZhciBjPUMsZD1VZSh0aGlzLlQsYSk7aWYoZClkLk4oKXx8ZC5VKE0sZnVuY3Rpb24oYSxiKXtjPWMuUShhLGIpfSk7ZWxzZSBpZihiKXt2YXIgZT1XZSh0aGlzLlQsYSk7Yi5VKE0sZnVuY3Rpb24oYSxiKXt2YXIgZD1XZShlLG5ldyBLKGEpKS5hcHBseShiKTtjPWMuUShhLGQpfSk7T2EoVmUoZSksZnVuY3Rpb24oYSl7Yz1jLlEoYS5uYW1lLGEuUyl9KX1lbHNlIGU9V2UodGhpcy5ULGEpLE9hKFZlKGUpLGZ1bmN0aW9uKGEpe2M9Yy5RKGEubmFtZSxhLlMpfSk7cmV0dXJuIGN9O2guaGQ9ZnVuY3Rpb24oYSxiLGMsZCl7SihjfHxkLFwiRWl0aGVyIGV4aXN0aW5nRXZlbnRTbmFwIG9yIGV4aXN0aW5nU2VydmVyU25hcCBtdXN0IGV4aXN0XCIpO2E9YS53KGIpO2lmKG51bGwhPVVlKHRoaXMuVCxhKSlyZXR1cm4gbnVsbDthPVdlKHRoaXMuVCxhKTtyZXR1cm4gYS5lKCk/ZC5vYShiKTphLmFwcGx5KGQub2EoYikpfTtcbmguWGE9ZnVuY3Rpb24oYSxiLGMpe2E9YS53KGIpO3ZhciBkPVVlKHRoaXMuVCxhKTtyZXR1cm4gbnVsbCE9ZD9kOnJiKGMsYik/V2UodGhpcy5ULGEpLmFwcGx5KGMuaigpLk0oYikpOm51bGx9O2guc2M9ZnVuY3Rpb24oYSl7cmV0dXJuIFVlKHRoaXMuVCxhKX07aC5tZT1mdW5jdGlvbihhLGIsYyxkLGUsZil7dmFyIGc7YT1XZSh0aGlzLlQsYSk7Zz1VZShhLEYpO2lmKG51bGw9PWcpaWYobnVsbCE9YilnPWEuYXBwbHkoYik7ZWxzZSByZXR1cm5bXTtnPWcubWIoZik7aWYoZy5lKCl8fGcuTigpKXJldHVybltdO2I9W107YT11ZChmKTtlPWU/Zy5aYihjLGYpOmcuWGIoYyxmKTtmb3IoZj1IKGUpO2YmJmIubGVuZ3RoPGQ7KTAhPT1hKGYsYykmJmIucHVzaChmKSxmPUgoZSk7cmV0dXJuIGJ9O1xuZnVuY3Rpb24gWmUoYSxiKXtyZXR1cm4gYS5JYT9hLnBhdGguY29udGFpbnMoYik6ISF1YShhLmNoaWxkcmVuLGZ1bmN0aW9uKGMsZCl7cmV0dXJuIGEucGF0aC53KGQpLmNvbnRhaW5zKGIpfSl9ZnVuY3Rpb24gYWYoYSl7cmV0dXJuIGEudmlzaWJsZX1cbmZ1bmN0aW9uICRlKGEsYixjKXtmb3IodmFyIGQ9UmUsZT0wO2U8YS5sZW5ndGg7KytlKXt2YXIgZj1hW2VdO2lmKGIoZikpe3ZhciBnPWYucGF0aDtpZihmLklhKWMuY29udGFpbnMoZyk/KGc9TihjLGcpLGQ9U2UoZCxnLGYuSWEpKTpnLmNvbnRhaW5zKGMpJiYoZz1OKGcsYyksZD1TZShkLEYsZi5JYS5vYShnKSkpO2Vsc2UgaWYoZi5jaGlsZHJlbilpZihjLmNvbnRhaW5zKGcpKWc9TihjLGcpLGQ9VGUoZCxnLGYuY2hpbGRyZW4pO2Vsc2V7aWYoZy5jb250YWlucyhjKSlpZihnPU4oZyxjKSxnLmUoKSlkPVRlKGQsRixmLmNoaWxkcmVuKTtlbHNlIGlmKGY9dyhmLmNoaWxkcmVuLE8oZykpKWY9Zi5vYShHKGcpKSxkPVNlKGQsRixmKX1lbHNlIHRocm93IEhjKFwiV3JpdGVSZWNvcmQgc2hvdWxkIGhhdmUgLnNuYXAgb3IgLmNoaWxkcmVuXCIpO319cmV0dXJuIGR9ZnVuY3Rpb24gYmYoYSxiKXt0aGlzLk1iPWE7dGhpcy5XPWJ9aD1iZi5wcm90b3R5cGU7XG5oLnVhPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gdGhpcy5XLnVhKHRoaXMuTWIsYSxiLGMpfTtoLnhjPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLlcueGModGhpcy5NYixhKX07aC5oZD1mdW5jdGlvbihhLGIsYyl7cmV0dXJuIHRoaXMuVy5oZCh0aGlzLk1iLGEsYixjKX07aC5zYz1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5XLnNjKHRoaXMuTWIudyhhKSl9O2gubWU9ZnVuY3Rpb24oYSxiLGMsZCxlKXtyZXR1cm4gdGhpcy5XLm1lKHRoaXMuTWIsYSxiLGMsZCxlKX07aC5YYT1mdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLlcuWGEodGhpcy5NYixhLGIpfTtoLnc9ZnVuY3Rpb24oYSl7cmV0dXJuIG5ldyBiZih0aGlzLk1iLncoYSksdGhpcy5XKX07ZnVuY3Rpb24gY2YoKXt0aGlzLnlhPXt9fWg9Y2YucHJvdG90eXBlO2guZT1mdW5jdGlvbigpe3JldHVybiB3YSh0aGlzLnlhKX07aC5iYj1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9YS5zb3VyY2UuSWI7aWYobnVsbCE9PWQpcmV0dXJuIGQ9dyh0aGlzLnlhLGQpLEoobnVsbCE9ZCxcIlN5bmNUcmVlIGdhdmUgdXMgYW4gb3AgZm9yIGFuIGludmFsaWQgcXVlcnkuXCIpLGQuYmIoYSxiLGMpO3ZhciBlPVtdO3IodGhpcy55YSxmdW5jdGlvbihkKXtlPWUuY29uY2F0KGQuYmIoYSxiLGMpKX0pO3JldHVybiBlfTtoLk9iPWZ1bmN0aW9uKGEsYixjLGQsZSl7dmFyIGY9YS53YSgpLGc9dyh0aGlzLnlhLGYpO2lmKCFnKXt2YXIgZz1jLnVhKGU/ZDpudWxsKSxrPSExO2c/az0hMDooZz1kIGluc3RhbmNlb2YgVD9jLnhjKGQpOkMsaz0hMSk7Zz1uZXcgdGUoYSxuZXcgSWQobmV3IHNiKGcsaywhMSksbmV3IHNiKGQsZSwhMSkpKTt0aGlzLnlhW2ZdPWd9Zy5PYihiKTtyZXR1cm4gd2UoZyxiKX07XG5oLmtiPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1hLndhKCksZT1bXSxmPVtdLGc9bnVsbCE9ZGYodGhpcyk7aWYoXCJkZWZhdWx0XCI9PT1kKXt2YXIgaz10aGlzO3IodGhpcy55YSxmdW5jdGlvbihhLGQpe2Y9Zi5jb25jYXQoYS5rYihiLGMpKTthLmUoKSYmKGRlbGV0ZSBrLnlhW2RdLGRlKGEuVi5uKXx8ZS5wdXNoKGEuVikpfSl9ZWxzZXt2YXIgbD13KHRoaXMueWEsZCk7bCYmKGY9Zi5jb25jYXQobC5rYihiLGMpKSxsLmUoKSYmKGRlbGV0ZSB0aGlzLnlhW2RdLGRlKGwuVi5uKXx8ZS5wdXNoKGwuVikpKX1nJiZudWxsPT1kZih0aGlzKSYmZS5wdXNoKG5ldyBVKGEuayxhLnBhdGgpKTtyZXR1cm57SGc6ZSxqZzpmfX07ZnVuY3Rpb24gZWYoYSl7cmV0dXJuIFBhKHJhKGEueWEpLGZ1bmN0aW9uKGEpe3JldHVybiFkZShhLlYubil9KX1oLmhiPWZ1bmN0aW9uKGEpe3ZhciBiPW51bGw7cih0aGlzLnlhLGZ1bmN0aW9uKGMpe2I9Ynx8Yy5oYihhKX0pO3JldHVybiBifTtcbmZ1bmN0aW9uIGZmKGEsYil7aWYoZGUoYi5uKSlyZXR1cm4gZGYoYSk7dmFyIGM9Yi53YSgpO3JldHVybiB3KGEueWEsYyl9ZnVuY3Rpb24gZGYoYSl7cmV0dXJuIHZhKGEueWEsZnVuY3Rpb24oYSl7cmV0dXJuIGRlKGEuVi5uKX0pfHxudWxsfTtmdW5jdGlvbiBnZihhKXt0aGlzLnNhPU5kO3RoaXMuSGI9bmV3IFllO3RoaXMuJGU9e307dGhpcy5rYz17fTt0aGlzLk1jPWF9ZnVuY3Rpb24gaGYoYSxiLGMsZCxlKXt2YXIgZj1hLkhiLGc9ZTtKKGQ+Zi5MYyxcIlN0YWNraW5nIGFuIG9sZGVyIHdyaXRlIG9uIHRvcCBvZiBuZXdlciBvbmVzXCIpO24oZyl8fChnPSEwKTtmLnphLnB1c2goe3BhdGg6YixJYTpjLGllOmQsdmlzaWJsZTpnfSk7ZyYmKGYuVD1TZShmLlQsYixjKSk7Zi5MYz1kO3JldHVybiBlP2pmKGEsbmV3IFViKFliLGIsYykpOltdfWZ1bmN0aW9uIGtmKGEsYixjLGQpe3ZhciBlPWEuSGI7SihkPmUuTGMsXCJTdGFja2luZyBhbiBvbGRlciBtZXJnZSBvbiB0b3Agb2YgbmV3ZXIgb25lc1wiKTtlLnphLnB1c2goe3BhdGg6YixjaGlsZHJlbjpjLGllOmQsdmlzaWJsZTohMH0pO2UuVD1UZShlLlQsYixjKTtlLkxjPWQ7Yz1GZShjKTtyZXR1cm4gamYoYSxuZXcgeGUoWWIsYixjKSl9XG5mdW5jdGlvbiBsZihhLGIsYyl7Yz1jfHwhMTtiPWEuSGIuT2QoYik7cmV0dXJuIG51bGw9PWI/W106amYoYSxuZXcgV2IoYixjKSl9ZnVuY3Rpb24gbWYoYSxiLGMpe2M9RmUoYyk7cmV0dXJuIGpmKGEsbmV3IHhlKHplLGIsYykpfWZ1bmN0aW9uIG5mKGEsYixjLGQpe2Q9b2YoYSxkKTtpZihudWxsIT1kKXt2YXIgZT1wZihkKTtkPWUucGF0aDtlPWUuSWI7Yj1OKGQsYik7Yz1uZXcgVWIobmV3IHllKCExLCEwLGUsITApLGIsYyk7cmV0dXJuIHFmKGEsZCxjKX1yZXR1cm5bXX1mdW5jdGlvbiByZihhLGIsYyxkKXtpZihkPW9mKGEsZCkpe3ZhciBlPXBmKGQpO2Q9ZS5wYXRoO2U9ZS5JYjtiPU4oZCxiKTtjPUZlKGMpO2M9bmV3IHhlKG5ldyB5ZSghMSwhMCxlLCEwKSxiLGMpO3JldHVybiBxZihhLGQsYyl9cmV0dXJuW119XG5nZi5wcm90b3R5cGUuT2I9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLnBhdGgsZD1udWxsLGU9ITE7TWUodGhpcy5zYSxjLGZ1bmN0aW9uKGEsYil7dmFyIGY9TihhLGMpO2Q9Yi5oYihmKTtlPWV8fG51bGwhPWRmKGIpO3JldHVybiFkfSk7dmFyIGY9dGhpcy5zYS5nZXQoYyk7Zj8oZT1lfHxudWxsIT1kZihmKSxkPWR8fGYuaGIoRikpOihmPW5ldyBjZix0aGlzLnNhPXRoaXMuc2Euc2V0KGMsZikpO3ZhciBnO251bGwhPWQ/Zz0hMDooZz0hMSxkPUMsUGUodGhpcy5zYS5zdWJ0cmVlKGMpLGZ1bmN0aW9uKGEsYil7dmFyIGM9Yi5oYihGKTtjJiYoZD1kLlEoYSxjKSl9KSk7dmFyIGs9bnVsbCE9ZmYoZixhKTtpZighayYmIWRlKGEubikpe3ZhciBsPXNmKGEpO0ooIShsIGluIHRoaXMua2MpLFwiVmlldyBkb2VzIG5vdCBleGlzdCwgYnV0IHdlIGhhdmUgYSB0YWdcIik7dmFyIG09dGYrKzt0aGlzLmtjW2xdPW07dGhpcy4kZVtcIl9cIittXT1sfWc9Zi5PYihhLGIsbmV3IGJmKGMsdGhpcy5IYiksXG5kLGcpO2t8fGV8fChmPWZmKGYsYSksZz1nLmNvbmNhdCh1Zih0aGlzLGEsZikpKTtyZXR1cm4gZ307XG5nZi5wcm90b3R5cGUua2I9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEucGF0aCxlPXRoaXMuc2EuZ2V0KGQpLGY9W107aWYoZSYmKFwiZGVmYXVsdFwiPT09YS53YSgpfHxudWxsIT1mZihlLGEpKSl7Zj1lLmtiKGEsYixjKTtlLmUoKSYmKHRoaXMuc2E9dGhpcy5zYS5yZW1vdmUoZCkpO2U9Zi5IZztmPWYuamc7Yj0tMSE9PVVhKGUsZnVuY3Rpb24oYSl7cmV0dXJuIGRlKGEubil9KTt2YXIgZz1LZSh0aGlzLnNhLGQsZnVuY3Rpb24oYSxiKXtyZXR1cm4gbnVsbCE9ZGYoYil9KTtpZihiJiYhZyYmKGQ9dGhpcy5zYS5zdWJ0cmVlKGQpLCFkLmUoKSkpZm9yKHZhciBkPXZmKGQpLGs9MDtrPGQubGVuZ3RoOysrayl7dmFyIGw9ZFtrXSxtPWwuVixsPXdmKHRoaXMsbCk7dGhpcy5NYy5YZShtLHhmKHRoaXMsbSksbC51ZCxsLkopfWlmKCFnJiYwPGUubGVuZ3RoJiYhYylpZihiKXRoaXMuTWMuWmQoYSxudWxsKTtlbHNle3ZhciB2PXRoaXM7T2EoZSxmdW5jdGlvbihhKXthLndhKCk7dmFyIGI9di5rY1tzZihhKV07XG52Lk1jLlpkKGEsYil9KX15Zih0aGlzLGUpfXJldHVybiBmfTtnZi5wcm90b3R5cGUudWE9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLkhiLGQ9S2UodGhpcy5zYSxhLGZ1bmN0aW9uKGIsYyl7dmFyIGQ9TihiLGEpO2lmKGQ9Yy5oYihkKSlyZXR1cm4gZH0pO3JldHVybiBjLnVhKGEsZCxiLCEwKX07ZnVuY3Rpb24gdmYoYSl7cmV0dXJuIEllKGEsZnVuY3Rpb24oYSxjLGQpe2lmKGMmJm51bGwhPWRmKGMpKXJldHVybltkZihjKV07dmFyIGU9W107YyYmKGU9ZWYoYykpO3IoZCxmdW5jdGlvbihhKXtlPWUuY29uY2F0KGEpfSk7cmV0dXJuIGV9KX1mdW5jdGlvbiB5ZihhLGIpe2Zvcih2YXIgYz0wO2M8Yi5sZW5ndGg7KytjKXt2YXIgZD1iW2NdO2lmKCFkZShkLm4pKXt2YXIgZD1zZihkKSxlPWEua2NbZF07ZGVsZXRlIGEua2NbZF07ZGVsZXRlIGEuJGVbXCJfXCIrZV19fX1cbmZ1bmN0aW9uIHVmKGEsYixjKXt2YXIgZD1iLnBhdGgsZT14ZihhLGIpO2M9d2YoYSxjKTtiPWEuTWMuWGUoYixlLGMudWQsYy5KKTtkPWEuc2Euc3VidHJlZShkKTtpZihlKUoobnVsbD09ZGYoZC52YWx1ZSksXCJJZiB3ZSdyZSBhZGRpbmcgYSBxdWVyeSwgaXQgc2hvdWxkbid0IGJlIHNoYWRvd2VkXCIpO2Vsc2UgZm9yKGU9SWUoZCxmdW5jdGlvbihhLGIsYyl7aWYoIWEuZSgpJiZiJiZudWxsIT1kZihiKSlyZXR1cm5bdWUoZGYoYikpXTt2YXIgZD1bXTtiJiYoZD1kLmNvbmNhdChRYShlZihiKSxmdW5jdGlvbihhKXtyZXR1cm4gYS5WfSkpKTtyKGMsZnVuY3Rpb24oYSl7ZD1kLmNvbmNhdChhKX0pO3JldHVybiBkfSksZD0wO2Q8ZS5sZW5ndGg7KytkKWM9ZVtkXSxhLk1jLlpkKGMseGYoYSxjKSk7cmV0dXJuIGJ9XG5mdW5jdGlvbiB3ZihhLGIpe3ZhciBjPWIuVixkPXhmKGEsYyk7cmV0dXJue3VkOmZ1bmN0aW9uKCl7cmV0dXJuKGIudSgpfHxDKS5oYXNoKCl9LEo6ZnVuY3Rpb24oYil7aWYoXCJva1wiPT09Yil7aWYoZCl7dmFyIGY9Yy5wYXRoO2lmKGI9b2YoYSxkKSl7dmFyIGc9cGYoYik7Yj1nLnBhdGg7Zz1nLkliO2Y9TihiLGYpO2Y9bmV3IFpiKG5ldyB5ZSghMSwhMCxnLCEwKSxmKTtiPXFmKGEsYixmKX1lbHNlIGI9W119ZWxzZSBiPWpmKGEsbmV3IFpiKHplLGMucGF0aCkpO3JldHVybiBifWY9XCJVbmtub3duIEVycm9yXCI7XCJ0b29fYmlnXCI9PT1iP2Y9XCJUaGUgZGF0YSByZXF1ZXN0ZWQgZXhjZWVkcyB0aGUgbWF4aW11bSBzaXplIHRoYXQgY2FuIGJlIGFjY2Vzc2VkIHdpdGggYSBzaW5nbGUgcmVxdWVzdC5cIjpcInBlcm1pc3Npb25fZGVuaWVkXCI9PWI/Zj1cIkNsaWVudCBkb2Vzbid0IGhhdmUgcGVybWlzc2lvbiB0byBhY2Nlc3MgdGhlIGRlc2lyZWQgZGF0YS5cIjpcInVuYXZhaWxhYmxlXCI9PWImJlxuKGY9XCJUaGUgc2VydmljZSBpcyB1bmF2YWlsYWJsZVwiKTtmPUVycm9yKGIrXCI6IFwiK2YpO2YuY29kZT1iLnRvVXBwZXJDYXNlKCk7cmV0dXJuIGEua2IoYyxudWxsLGYpfX19ZnVuY3Rpb24gc2YoYSl7cmV0dXJuIGEucGF0aC50b1N0cmluZygpK1wiJFwiK2Eud2EoKX1mdW5jdGlvbiBwZihhKXt2YXIgYj1hLmluZGV4T2YoXCIkXCIpO0ooLTEhPT1iJiZiPGEubGVuZ3RoLTEsXCJCYWQgcXVlcnlLZXkuXCIpO3JldHVybntJYjphLnN1YnN0cihiKzEpLHBhdGg6bmV3IEsoYS5zdWJzdHIoMCxiKSl9fWZ1bmN0aW9uIG9mKGEsYil7dmFyIGM9YS4kZSxkPVwiX1wiK2I7cmV0dXJuIGQgaW4gYz9jW2RdOnZvaWQgMH1mdW5jdGlvbiB4ZihhLGIpe3ZhciBjPXNmKGIpO3JldHVybiB3KGEua2MsYyl9dmFyIHRmPTE7XG5mdW5jdGlvbiBxZihhLGIsYyl7dmFyIGQ9YS5zYS5nZXQoYik7SihkLFwiTWlzc2luZyBzeW5jIHBvaW50IGZvciBxdWVyeSB0YWcgdGhhdCB3ZSdyZSB0cmFja2luZ1wiKTtyZXR1cm4gZC5iYihjLG5ldyBiZihiLGEuSGIpLG51bGwpfWZ1bmN0aW9uIGpmKGEsYil7cmV0dXJuIHpmKGEsYixhLnNhLG51bGwsbmV3IGJmKEYsYS5IYikpfWZ1bmN0aW9uIHpmKGEsYixjLGQsZSl7aWYoYi5wYXRoLmUoKSlyZXR1cm4gQWYoYSxiLGMsZCxlKTt2YXIgZj1jLmdldChGKTtudWxsPT1kJiZudWxsIT1mJiYoZD1mLmhiKEYpKTt2YXIgZz1bXSxrPU8oYi5wYXRoKSxsPWIuV2Moayk7aWYoKGM9Yy5jaGlsZHJlbi5nZXQoaykpJiZsKXZhciBtPWQ/ZC5NKGspOm51bGwsaz1lLncoayksZz1nLmNvbmNhdCh6ZihhLGwsYyxtLGspKTtmJiYoZz1nLmNvbmNhdChmLmJiKGIsZSxkKSkpO3JldHVybiBnfVxuZnVuY3Rpb24gQWYoYSxiLGMsZCxlKXt2YXIgZj1jLmdldChGKTtudWxsPT1kJiZudWxsIT1mJiYoZD1mLmhiKEYpKTt2YXIgZz1bXTtjLmNoaWxkcmVuLmhhKGZ1bmN0aW9uKGMsZil7dmFyIG09ZD9kLk0oYyk6bnVsbCx2PWUudyhjKSx5PWIuV2MoYyk7eSYmKGc9Zy5jb25jYXQoQWYoYSx5LGYsbSx2KSkpfSk7ZiYmKGc9Zy5jb25jYXQoZi5iYihiLGUsZCkpKTtyZXR1cm4gZ307ZnVuY3Rpb24gQmYoKXt0aGlzLmNoaWxkcmVuPXt9O3RoaXMua2Q9MDt0aGlzLnZhbHVlPW51bGx9ZnVuY3Rpb24gQ2YoYSxiLGMpe3RoaXMuRGQ9YT9hOlwiXCI7dGhpcy5ZYz1iP2I6bnVsbDt0aGlzLkI9Yz9jOm5ldyBCZn1mdW5jdGlvbiBEZihhLGIpe2Zvcih2YXIgYz1iIGluc3RhbmNlb2YgSz9iOm5ldyBLKGIpLGQ9YSxlO251bGwhPT0oZT1PKGMpKTspZD1uZXcgQ2YoZSxkLHcoZC5CLmNoaWxkcmVuLGUpfHxuZXcgQmYpLGM9RyhjKTtyZXR1cm4gZH1oPUNmLnByb3RvdHlwZTtoLkJhPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuQi52YWx1ZX07ZnVuY3Rpb24gRWYoYSxiKXtKKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgYixcIkNhbm5vdCBzZXQgdmFsdWUgdG8gdW5kZWZpbmVkXCIpO2EuQi52YWx1ZT1iO0ZmKGEpfWguY2xlYXI9ZnVuY3Rpb24oKXt0aGlzLkIudmFsdWU9bnVsbDt0aGlzLkIuY2hpbGRyZW49e307dGhpcy5CLmtkPTA7RmYodGhpcyl9O1xuaC50ZD1mdW5jdGlvbigpe3JldHVybiAwPHRoaXMuQi5rZH07aC5lPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGw9PT10aGlzLkJhKCkmJiF0aGlzLnRkKCl9O2guVT1mdW5jdGlvbihhKXt2YXIgYj10aGlzO3IodGhpcy5CLmNoaWxkcmVuLGZ1bmN0aW9uKGMsZCl7YShuZXcgQ2YoZCxiLGMpKX0pfTtmdW5jdGlvbiBHZihhLGIsYyxkKXtjJiYhZCYmYihhKTthLlUoZnVuY3Rpb24oYSl7R2YoYSxiLCEwLGQpfSk7YyYmZCYmYihhKX1mdW5jdGlvbiBIZihhLGIpe2Zvcih2YXIgYz1hLnBhcmVudCgpO251bGwhPT1jJiYhYihjKTspYz1jLnBhcmVudCgpfWgucGF0aD1mdW5jdGlvbigpe3JldHVybiBuZXcgSyhudWxsPT09dGhpcy5ZYz90aGlzLkRkOnRoaXMuWWMucGF0aCgpK1wiL1wiK3RoaXMuRGQpfTtoLm5hbWU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5EZH07aC5wYXJlbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ZY307XG5mdW5jdGlvbiBGZihhKXtpZihudWxsIT09YS5ZYyl7dmFyIGI9YS5ZYyxjPWEuRGQsZD1hLmUoKSxlPXUoYi5CLmNoaWxkcmVuLGMpO2QmJmU/KGRlbGV0ZSBiLkIuY2hpbGRyZW5bY10sYi5CLmtkLS0sRmYoYikpOmR8fGV8fChiLkIuY2hpbGRyZW5bY109YS5CLGIuQi5rZCsrLEZmKGIpKX19O2Z1bmN0aW9uIElmKGEpe0ooZWEoYSkmJjA8YS5sZW5ndGgsXCJSZXF1aXJlcyBhIG5vbi1lbXB0eSBhcnJheVwiKTt0aGlzLlVmPWE7dGhpcy5OYz17fX1JZi5wcm90b3R5cGUuZGU9ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9dGhpcy5OY1thXXx8W10sZD0wO2Q8Yy5sZW5ndGg7ZCsrKWNbZF0ueWMuYXBwbHkoY1tkXS5NYSxBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkpfTtJZi5wcm90b3R5cGUuRWI9ZnVuY3Rpb24oYSxiLGMpe0pmKHRoaXMsYSk7dGhpcy5OY1thXT10aGlzLk5jW2FdfHxbXTt0aGlzLk5jW2FdLnB1c2goe3ljOmIsTWE6Y30pOyhhPXRoaXMuemUoYSkpJiZiLmFwcGx5KGMsYSl9O0lmLnByb3RvdHlwZS5nYz1mdW5jdGlvbihhLGIsYyl7SmYodGhpcyxhKTthPXRoaXMuTmNbYV18fFtdO2Zvcih2YXIgZD0wO2Q8YS5sZW5ndGg7ZCsrKWlmKGFbZF0ueWM9PT1iJiYoIWN8fGM9PT1hW2RdLk1hKSl7YS5zcGxpY2UoZCwxKTticmVha319O1xuZnVuY3Rpb24gSmYoYSxiKXtKKFRhKGEuVWYsZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1ifSksXCJVbmtub3duIGV2ZW50OiBcIitiKX07dmFyIEtmPWZ1bmN0aW9uKCl7dmFyIGE9MCxiPVtdO3JldHVybiBmdW5jdGlvbihjKXt2YXIgZD1jPT09YTthPWM7Zm9yKHZhciBlPUFycmF5KDgpLGY9NzswPD1mO2YtLSllW2ZdPVwiLTAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWl9hYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiLmNoYXJBdChjJTY0KSxjPU1hdGguZmxvb3IoYy82NCk7SigwPT09YyxcIkNhbm5vdCBwdXNoIGF0IHRpbWUgPT0gMFwiKTtjPWUuam9pbihcIlwiKTtpZihkKXtmb3IoZj0xMTswPD1mJiY2Mz09PWJbZl07Zi0tKWJbZl09MDtiW2ZdKyt9ZWxzZSBmb3IoZj0wOzEyPmY7ZisrKWJbZl09TWF0aC5mbG9vcig2NCpNYXRoLnJhbmRvbSgpKTtmb3IoZj0wOzEyPmY7ZisrKWMrPVwiLTAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWl9hYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiLmNoYXJBdChiW2ZdKTtKKDIwPT09Yy5sZW5ndGgsXCJuZXh0UHVzaElkOiBMZW5ndGggc2hvdWxkIGJlIDIwLlwiKTtcbnJldHVybiBjfX0oKTtmdW5jdGlvbiBMZigpe0lmLmNhbGwodGhpcyxbXCJvbmxpbmVcIl0pO3RoaXMuaWM9ITA7aWYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cmJlwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93LmFkZEV2ZW50TGlzdGVuZXIpe3ZhciBhPXRoaXM7d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvbmxpbmVcIixmdW5jdGlvbigpe2EuaWN8fChhLmljPSEwLGEuZGUoXCJvbmxpbmVcIiwhMCkpfSwhMSk7d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJvZmZsaW5lXCIsZnVuY3Rpb24oKXthLmljJiYoYS5pYz0hMSxhLmRlKFwib25saW5lXCIsITEpKX0sITEpfX1tYShMZixJZik7TGYucHJvdG90eXBlLnplPWZ1bmN0aW9uKGEpe0ooXCJvbmxpbmVcIj09PWEsXCJVbmtub3duIGV2ZW50IHR5cGU6IFwiK2EpO3JldHVyblt0aGlzLmljXX07Y2EoTGYpO2Z1bmN0aW9uIE1mKCl7SWYuY2FsbCh0aGlzLFtcInZpc2libGVcIl0pO3ZhciBhLGI7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudCYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyJiYoXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudC5oaWRkZW4/KGI9XCJ2aXNpYmlsaXR5Y2hhbmdlXCIsYT1cImhpZGRlblwiKTpcInVuZGVmaW5lZFwiIT09dHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbj8oYj1cIm1venZpc2liaWxpdHljaGFuZ2VcIixhPVwibW96SGlkZGVuXCIpOlwidW5kZWZpbmVkXCIhPT10eXBlb2YgZG9jdW1lbnQubXNIaWRkZW4/KGI9XCJtc3Zpc2liaWxpdHljaGFuZ2VcIixhPVwibXNIaWRkZW5cIik6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4mJihiPVwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiLGE9XCJ3ZWJraXRIaWRkZW5cIikpO3RoaXMudWM9ITA7aWYoYil7dmFyIGM9dGhpcztkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGIsXG5mdW5jdGlvbigpe3ZhciBiPSFkb2N1bWVudFthXTtiIT09Yy51YyYmKGMudWM9YixjLmRlKFwidmlzaWJsZVwiLGIpKX0sITEpfX1tYShNZixJZik7TWYucHJvdG90eXBlLnplPWZ1bmN0aW9uKGEpe0ooXCJ2aXNpYmxlXCI9PT1hLFwiVW5rbm93biBldmVudCB0eXBlOiBcIithKTtyZXR1cm5bdGhpcy51Y119O2NhKE1mKTt2YXIgTmY9L1tcXFtcXF0uIyRcXC9cXHUwMDAwLVxcdTAwMUZcXHUwMDdGXS8sT2Y9L1tcXFtcXF0uIyRcXHUwMDAwLVxcdTAwMUZcXHUwMDdGXS87ZnVuY3Rpb24gUGYoYSl7cmV0dXJuIHAoYSkmJjAhPT1hLmxlbmd0aCYmIU5mLnRlc3QoYSl9ZnVuY3Rpb24gUWYoYSl7cmV0dXJuIG51bGw9PT1hfHxwKGEpfHxnYShhKSYmIVNjKGEpfHxpYShhKSYmdShhLFwiLnN2XCIpfWZ1bmN0aW9uIFJmKGEsYixjLGQpe2QmJiFuKGIpfHxTZih6KGEsMSxkKSxiLGMpfVxuZnVuY3Rpb24gU2YoYSxiLGMpe2MgaW5zdGFuY2VvZiBLJiYoYz1uZXcgd2MoYyxhKSk7aWYoIW4oYikpdGhyb3cgRXJyb3IoYStcImNvbnRhaW5zIHVuZGVmaW5lZCBcIit6YyhjKSk7aWYoaGEoYikpdGhyb3cgRXJyb3IoYStcImNvbnRhaW5zIGEgZnVuY3Rpb24gXCIremMoYykrXCIgd2l0aCBjb250ZW50czogXCIrYi50b1N0cmluZygpKTtpZihTYyhiKSl0aHJvdyBFcnJvcihhK1wiY29udGFpbnMgXCIrYi50b1N0cmluZygpK1wiIFwiK3pjKGMpKTtpZihwKGIpJiZiLmxlbmd0aD4xMDQ4NTc2MC8zJiYxMDQ4NTc2MDx4YyhiKSl0aHJvdyBFcnJvcihhK1wiY29udGFpbnMgYSBzdHJpbmcgZ3JlYXRlciB0aGFuIDEwNDg1NzYwIHV0ZjggYnl0ZXMgXCIremMoYykrXCIgKCdcIitiLnN1YnN0cmluZygwLDUwKStcIi4uLicpXCIpO2lmKGlhKGIpKXt2YXIgZD0hMSxlPSExO2hiKGIsZnVuY3Rpb24oYixnKXtpZihcIi52YWx1ZVwiPT09YilkPSEwO2Vsc2UgaWYoXCIucHJpb3JpdHlcIiE9PWImJlwiLnN2XCIhPT1iJiYoZT1cbiEwLCFQZihiKSkpdGhyb3cgRXJyb3IoYStcIiBjb250YWlucyBhbiBpbnZhbGlkIGtleSAoXCIrYitcIikgXCIremMoYykrJy4gIEtleXMgbXVzdCBiZSBub24tZW1wdHkgc3RyaW5ncyBhbmQgY2FuXFwndCBjb250YWluIFwiLlwiLCBcIiNcIiwgXCIkXCIsIFwiL1wiLCBcIltcIiwgb3IgXCJdXCInKTtjLnB1c2goYik7U2YoYSxnLGMpO2MucG9wKCl9KTtpZihkJiZlKXRocm93IEVycm9yKGErJyBjb250YWlucyBcIi52YWx1ZVwiIGNoaWxkICcremMoYykrXCIgaW4gYWRkaXRpb24gdG8gYWN0dWFsIGNoaWxkcmVuLlwiKTt9fVxuZnVuY3Rpb24gVGYoYSxiLGMpe2lmKCFpYShiKXx8ZWEoYikpdGhyb3cgRXJyb3IoeihhLDEsITEpK1wiIG11c3QgYmUgYW4gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIGNoaWxkcmVuIHRvIHJlcGxhY2UuXCIpO2lmKHUoYixcIi52YWx1ZVwiKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrJyBtdXN0IG5vdCBjb250YWluIFwiLnZhbHVlXCIuICBUbyBvdmVyd3JpdGUgd2l0aCBhIGxlYWYgdmFsdWUsIGp1c3QgdXNlIC5zZXQoKSBpbnN0ZWFkLicpO1JmKGEsYixjLCExKX1cbmZ1bmN0aW9uIFVmKGEsYixjKXtpZihTYyhjKSl0aHJvdyBFcnJvcih6KGEsYiwhMSkrXCJpcyBcIitjLnRvU3RyaW5nKCkrXCIsIGJ1dCBtdXN0IGJlIGEgdmFsaWQgRmlyZWJhc2UgcHJpb3JpdHkgKGEgc3RyaW5nLCBmaW5pdGUgbnVtYmVyLCBzZXJ2ZXIgdmFsdWUsIG9yIG51bGwpLlwiKTtpZighUWYoYykpdGhyb3cgRXJyb3IoeihhLGIsITEpK1wibXVzdCBiZSBhIHZhbGlkIEZpcmViYXNlIHByaW9yaXR5IChhIHN0cmluZywgZmluaXRlIG51bWJlciwgc2VydmVyIHZhbHVlLCBvciBudWxsKS5cIik7fVxuZnVuY3Rpb24gVmYoYSxiLGMpe2lmKCFjfHxuKGIpKXN3aXRjaChiKXtjYXNlIFwidmFsdWVcIjpjYXNlIFwiY2hpbGRfYWRkZWRcIjpjYXNlIFwiY2hpbGRfcmVtb3ZlZFwiOmNhc2UgXCJjaGlsZF9jaGFuZ2VkXCI6Y2FzZSBcImNoaWxkX21vdmVkXCI6YnJlYWs7ZGVmYXVsdDp0aHJvdyBFcnJvcih6KGEsMSxjKSsnbXVzdCBiZSBhIHZhbGlkIGV2ZW50IHR5cGU6IFwidmFsdWVcIiwgXCJjaGlsZF9hZGRlZFwiLCBcImNoaWxkX3JlbW92ZWRcIiwgXCJjaGlsZF9jaGFuZ2VkXCIsIG9yIFwiY2hpbGRfbW92ZWRcIi4nKTt9fWZ1bmN0aW9uIFdmKGEsYixjLGQpe2lmKCghZHx8bihjKSkmJiFQZihjKSl0aHJvdyBFcnJvcih6KGEsYixkKSsnd2FzIGFuIGludmFsaWQga2V5OiBcIicrYysnXCIuICBGaXJlYmFzZSBrZXlzIG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ3MgYW5kIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIi9cIiwgXCJbXCIsIG9yIFwiXVwiKS4nKTt9XG5mdW5jdGlvbiBYZihhLGIpe2lmKCFwKGIpfHwwPT09Yi5sZW5ndGh8fE9mLnRlc3QoYikpdGhyb3cgRXJyb3IoeihhLDEsITEpKyd3YXMgYW4gaW52YWxpZCBwYXRoOiBcIicrYisnXCIuIFBhdGhzIG11c3QgYmUgbm9uLWVtcHR5IHN0cmluZ3MgYW5kIGNhblxcJ3QgY29udGFpbiBcIi5cIiwgXCIjXCIsIFwiJFwiLCBcIltcIiwgb3IgXCJdXCInKTt9ZnVuY3Rpb24gWWYoYSxiKXtpZihcIi5pbmZvXCI9PT1PKGIpKXRocm93IEVycm9yKGErXCIgZmFpbGVkOiBDYW4ndCBtb2RpZnkgZGF0YSB1bmRlciAvLmluZm8vXCIpO31mdW5jdGlvbiBaZihhLGIpe2lmKCFwKGIpKXRocm93IEVycm9yKHooYSwxLCExKStcIm11c3QgYmUgYSB2YWxpZCBjcmVkZW50aWFsIChhIHN0cmluZykuXCIpO31mdW5jdGlvbiAkZihhLGIsYyl7aWYoIXAoYykpdGhyb3cgRXJyb3IoeihhLGIsITEpK1wibXVzdCBiZSBhIHZhbGlkIHN0cmluZy5cIik7fVxuZnVuY3Rpb24gYWcoYSxiLGMsZCl7aWYoIWR8fG4oYykpaWYoIWlhKGMpfHxudWxsPT09Yyl0aHJvdyBFcnJvcih6KGEsYixkKStcIm11c3QgYmUgYSB2YWxpZCBvYmplY3QuXCIpO31mdW5jdGlvbiBiZyhhLGIsYyl7aWYoIWlhKGIpfHxudWxsPT09Ynx8IXUoYixjKSl0aHJvdyBFcnJvcih6KGEsMSwhMSkrJ211c3QgY29udGFpbiB0aGUga2V5IFwiJytjKydcIicpO2lmKCFwKHcoYixjKSkpdGhyb3cgRXJyb3IoeihhLDEsITEpKydtdXN0IGNvbnRhaW4gdGhlIGtleSBcIicrYysnXCIgd2l0aCB0eXBlIFwic3RyaW5nXCInKTt9O2Z1bmN0aW9uIGNnKCl7dGhpcy5zZXQ9e319aD1jZy5wcm90b3R5cGU7aC5hZGQ9ZnVuY3Rpb24oYSxiKXt0aGlzLnNldFthXT1udWxsIT09Yj9iOiEwfTtoLmNvbnRhaW5zPWZ1bmN0aW9uKGEpe3JldHVybiB1KHRoaXMuc2V0LGEpfTtoLmdldD1mdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5jb250YWlucyhhKT90aGlzLnNldFthXTp2b2lkIDB9O2gucmVtb3ZlPWZ1bmN0aW9uKGEpe2RlbGV0ZSB0aGlzLnNldFthXX07aC5jbGVhcj1mdW5jdGlvbigpe3RoaXMuc2V0PXt9fTtoLmU9ZnVuY3Rpb24oKXtyZXR1cm4gd2EodGhpcy5zZXQpfTtoLmNvdW50PWZ1bmN0aW9uKCl7cmV0dXJuIHBhKHRoaXMuc2V0KX07ZnVuY3Rpb24gZGcoYSxiKXtyKGEuc2V0LGZ1bmN0aW9uKGEsZCl7YihkLGEpfSl9aC5rZXlzPWZ1bmN0aW9uKCl7dmFyIGE9W107cih0aGlzLnNldCxmdW5jdGlvbihiLGMpe2EucHVzaChjKX0pO3JldHVybiBhfTtmdW5jdGlvbiBxYygpe3RoaXMubT10aGlzLkM9bnVsbH1xYy5wcm90b3R5cGUuZmluZD1mdW5jdGlvbihhKXtpZihudWxsIT10aGlzLkMpcmV0dXJuIHRoaXMuQy5vYShhKTtpZihhLmUoKXx8bnVsbD09dGhpcy5tKXJldHVybiBudWxsO3ZhciBiPU8oYSk7YT1HKGEpO3JldHVybiB0aGlzLm0uY29udGFpbnMoYik/dGhpcy5tLmdldChiKS5maW5kKGEpOm51bGx9O3FjLnByb3RvdHlwZS5tYz1mdW5jdGlvbihhLGIpe2lmKGEuZSgpKXRoaXMuQz1iLHRoaXMubT1udWxsO2Vsc2UgaWYobnVsbCE9PXRoaXMuQyl0aGlzLkM9dGhpcy5DLkcoYSxiKTtlbHNle251bGw9PXRoaXMubSYmKHRoaXMubT1uZXcgY2cpO3ZhciBjPU8oYSk7dGhpcy5tLmNvbnRhaW5zKGMpfHx0aGlzLm0uYWRkKGMsbmV3IHFjKTtjPXRoaXMubS5nZXQoYyk7YT1HKGEpO2MubWMoYSxiKX19O1xuZnVuY3Rpb24gZWcoYSxiKXtpZihiLmUoKSlyZXR1cm4gYS5DPW51bGwsYS5tPW51bGwsITA7aWYobnVsbCE9PWEuQyl7aWYoYS5DLk4oKSlyZXR1cm4hMTt2YXIgYz1hLkM7YS5DPW51bGw7Yy5VKE0sZnVuY3Rpb24oYixjKXthLm1jKG5ldyBLKGIpLGMpfSk7cmV0dXJuIGVnKGEsYil9cmV0dXJuIG51bGwhPT1hLm0/KGM9TyhiKSxiPUcoYiksYS5tLmNvbnRhaW5zKGMpJiZlZyhhLm0uZ2V0KGMpLGIpJiZhLm0ucmVtb3ZlKGMpLGEubS5lKCk/KGEubT1udWxsLCEwKTohMSk6ITB9ZnVuY3Rpb24gcmMoYSxiLGMpe251bGwhPT1hLkM/YyhiLGEuQyk6YS5VKGZ1bmN0aW9uKGEsZSl7dmFyIGY9bmV3IEsoYi50b1N0cmluZygpK1wiL1wiK2EpO3JjKGUsZixjKX0pfXFjLnByb3RvdHlwZS5VPWZ1bmN0aW9uKGEpe251bGwhPT10aGlzLm0mJmRnKHRoaXMubSxmdW5jdGlvbihiLGMpe2EoYixjKX0pfTt2YXIgZmc9XCJhdXRoLmZpcmViYXNlLmNvbVwiO2Z1bmN0aW9uIGdnKGEsYixjKXt0aGlzLmxkPWF8fHt9O3RoaXMuY2U9Ynx8e307dGhpcy5hYj1jfHx7fTt0aGlzLmxkLnJlbWVtYmVyfHwodGhpcy5sZC5yZW1lbWJlcj1cImRlZmF1bHRcIil9dmFyIGhnPVtcInJlbWVtYmVyXCIsXCJyZWRpcmVjdFRvXCJdO2Z1bmN0aW9uIGlnKGEpe3ZhciBiPXt9LGM9e307aGIoYXx8e30sZnVuY3Rpb24oYSxlKXswPD1OYShoZyxhKT9iW2FdPWU6Y1thXT1lfSk7cmV0dXJuIG5ldyBnZyhiLHt9LGMpfTtmdW5jdGlvbiBqZyhhLGIpe3RoaXMuUGU9W1wic2Vzc2lvblwiLGEuTGQsYS5DYl0uam9pbihcIjpcIik7dGhpcy4kZD1ifWpnLnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24oYSxiKXtpZighYilpZih0aGlzLiRkLmxlbmd0aCliPXRoaXMuJGRbMF07ZWxzZSB0aHJvdyBFcnJvcihcImZiLmxvZ2luLlNlc3Npb25NYW5hZ2VyIDogTm8gc3RvcmFnZSBvcHRpb25zIGF2YWlsYWJsZSFcIik7Yi5zZXQodGhpcy5QZSxhKX07amcucHJvdG90eXBlLmdldD1mdW5jdGlvbigpe3ZhciBhPVFhKHRoaXMuJGQscSh0aGlzLm5nLHRoaXMpKSxhPVBhKGEsZnVuY3Rpb24oYSl7cmV0dXJuIG51bGwhPT1hfSk7WGEoYSxmdW5jdGlvbihhLGMpe3JldHVybiBiZChjLnRva2VuKS1iZChhLnRva2VuKX0pO3JldHVybiAwPGEubGVuZ3RoP2Euc2hpZnQoKTpudWxsfTtqZy5wcm90b3R5cGUubmc9ZnVuY3Rpb24oYSl7dHJ5e3ZhciBiPWEuZ2V0KHRoaXMuUGUpO2lmKGImJmIudG9rZW4pcmV0dXJuIGJ9Y2F0Y2goYyl7fXJldHVybiBudWxsfTtcbmpnLnByb3RvdHlwZS5jbGVhcj1mdW5jdGlvbigpe3ZhciBhPXRoaXM7T2EodGhpcy4kZCxmdW5jdGlvbihiKXtiLnJlbW92ZShhLlBlKX0pfTtmdW5jdGlvbiBrZygpe3JldHVyblwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiYhISh3aW5kb3cuY29yZG92YXx8d2luZG93LnBob25lZ2FwfHx3aW5kb3cuUGhvbmVHYXApJiYvaW9zfGlwaG9uZXxpcG9kfGlwYWR8YW5kcm9pZHxibGFja2JlcnJ5fGllbW9iaWxlL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KX1mdW5jdGlvbiBsZygpe3JldHVyblwidW5kZWZpbmVkXCIhPT10eXBlb2YgbG9jYXRpb24mJi9eZmlsZTpcXC8vLnRlc3QobG9jYXRpb24uaHJlZil9XG5mdW5jdGlvbiBtZygpe2lmKFwidW5kZWZpbmVkXCI9PT10eXBlb2YgbmF2aWdhdG9yKXJldHVybiExO3ZhciBhPW5hdmlnYXRvci51c2VyQWdlbnQ7aWYoXCJNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXJcIj09PW5hdmlnYXRvci5hcHBOYW1lKXtpZigoYT1hLm1hdGNoKC9NU0lFIChbMC05XXsxLH1bXFwuMC05XXswLH0pLykpJiYxPGEubGVuZ3RoKXJldHVybiA4PD1wYXJzZUZsb2F0KGFbMV0pfWVsc2UgaWYoLTE8YS5pbmRleE9mKFwiVHJpZGVudFwiKSYmKGE9YS5tYXRjaCgvcnY6KFswLTldezIsMn1bXFwuMC05XXswLH0pLykpJiYxPGEubGVuZ3RoKXJldHVybiA4PD1wYXJzZUZsb2F0KGFbMV0pO3JldHVybiExfTtmdW5jdGlvbiBuZygpe3ZhciBhPXdpbmRvdy5vcGVuZXIuZnJhbWVzLGI7Zm9yKGI9YS5sZW5ndGgtMTswPD1iO2ItLSl0cnl7aWYoYVtiXS5sb2NhdGlvbi5wcm90b2NvbD09PXdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCYmYVtiXS5sb2NhdGlvbi5ob3N0PT09d2luZG93LmxvY2F0aW9uLmhvc3QmJlwiX193aW5jaGFuX3JlbGF5X2ZyYW1lXCI9PT1hW2JdLm5hbWUpcmV0dXJuIGFbYl19Y2F0Y2goYyl7fXJldHVybiBudWxsfWZ1bmN0aW9uIG9nKGEsYixjKXthLmF0dGFjaEV2ZW50P2EuYXR0YWNoRXZlbnQoXCJvblwiK2IsYyk6YS5hZGRFdmVudExpc3RlbmVyJiZhLmFkZEV2ZW50TGlzdGVuZXIoYixjLCExKX1mdW5jdGlvbiBwZyhhLGIsYyl7YS5kZXRhY2hFdmVudD9hLmRldGFjaEV2ZW50KFwib25cIitiLGMpOmEucmVtb3ZlRXZlbnRMaXN0ZW5lciYmYS5yZW1vdmVFdmVudExpc3RlbmVyKGIsYywhMSl9XG5mdW5jdGlvbiBxZyhhKXsvXmh0dHBzPzpcXC9cXC8vLnRlc3QoYSl8fChhPXdpbmRvdy5sb2NhdGlvbi5ocmVmKTt2YXIgYj0vXihodHRwcz86XFwvXFwvW1xcLV9hLXpBLVpcXC4wLTk6XSspLy5leGVjKGEpO3JldHVybiBiP2JbMV06YX1mdW5jdGlvbiByZyhhKXt2YXIgYj1cIlwiO3RyeXthPWEucmVwbGFjZShcIiNcIixcIlwiKTt2YXIgYz1rYihhKTtjJiZ1KGMsXCJfX2ZpcmViYXNlX3JlcXVlc3Rfa2V5XCIpJiYoYj13KGMsXCJfX2ZpcmViYXNlX3JlcXVlc3Rfa2V5XCIpKX1jYXRjaChkKXt9cmV0dXJuIGJ9ZnVuY3Rpb24gc2coKXt2YXIgYT1SYyhmZyk7cmV0dXJuIGEuc2NoZW1lK1wiOi8vXCIrYS5ob3N0K1wiL3YyXCJ9ZnVuY3Rpb24gdGcoYSl7cmV0dXJuIHNnKCkrXCIvXCIrYStcIi9hdXRoL2NoYW5uZWxcIn07ZnVuY3Rpb24gdWcoYSl7dmFyIGI9dGhpczt0aGlzLnpjPWE7dGhpcy5hZT1cIipcIjttZygpP3RoaXMuUWM9dGhpcy53ZD1uZygpOih0aGlzLlFjPXdpbmRvdy5vcGVuZXIsdGhpcy53ZD13aW5kb3cpO2lmKCFiLlFjKXRocm93XCJVbmFibGUgdG8gZmluZCByZWxheSBmcmFtZVwiO29nKHRoaXMud2QsXCJtZXNzYWdlXCIscSh0aGlzLmhjLHRoaXMpKTtvZyh0aGlzLndkLFwibWVzc2FnZVwiLHEodGhpcy5BZix0aGlzKSk7dHJ5e3ZnKHRoaXMse2E6XCJyZWFkeVwifSl9Y2F0Y2goYyl7b2codGhpcy5RYyxcImxvYWRcIixmdW5jdGlvbigpe3ZnKGIse2E6XCJyZWFkeVwifSl9KX1vZyh3aW5kb3csXCJ1bmxvYWRcIixxKHRoaXMueWcsdGhpcykpfWZ1bmN0aW9uIHZnKGEsYil7Yj1CKGIpO21nKCk/YS5RYy5kb1Bvc3QoYixhLmFlKTphLlFjLnBvc3RNZXNzYWdlKGIsYS5hZSl9XG51Zy5wcm90b3R5cGUuaGM9ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcyxjO3RyeXtjPW1iKGEuZGF0YSl9Y2F0Y2goZCl7fWMmJlwicmVxdWVzdFwiPT09Yy5hJiYocGcod2luZG93LFwibWVzc2FnZVwiLHRoaXMuaGMpLHRoaXMuYWU9YS5vcmlnaW4sdGhpcy56YyYmc2V0VGltZW91dChmdW5jdGlvbigpe2IuemMoYi5hZSxjLmQsZnVuY3Rpb24oYSxjKXtiLmFnPSFjO2IuemM9dm9pZCAwO3ZnKGIse2E6XCJyZXNwb25zZVwiLGQ6YSxmb3JjZUtlZXBXaW5kb3dPcGVuOmN9KX0pfSwwKSl9O3VnLnByb3RvdHlwZS55Zz1mdW5jdGlvbigpe3RyeXtwZyh0aGlzLndkLFwibWVzc2FnZVwiLHRoaXMuQWYpfWNhdGNoKGEpe310aGlzLnpjJiYodmcodGhpcyx7YTpcImVycm9yXCIsZDpcInVua25vd24gY2xvc2VkIHdpbmRvd1wifSksdGhpcy56Yz12b2lkIDApO3RyeXt3aW5kb3cuY2xvc2UoKX1jYXRjaChiKXt9fTt1Zy5wcm90b3R5cGUuQWY9ZnVuY3Rpb24oYSl7aWYodGhpcy5hZyYmXCJkaWVcIj09PWEuZGF0YSl0cnl7d2luZG93LmNsb3NlKCl9Y2F0Y2goYil7fX07ZnVuY3Rpb24gd2coYSl7dGhpcy5vYz1HYSgpK0dhKCkrR2EoKTt0aGlzLkRmPWF9d2cucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiKXtQLnNldChcInJlZGlyZWN0X3JlcXVlc3RfaWRcIix0aGlzLm9jKTtQLnNldChcInJlZGlyZWN0X3JlcXVlc3RfaWRcIix0aGlzLm9jKTtiLnJlcXVlc3RJZD10aGlzLm9jO2IucmVkaXJlY3RUbz1iLnJlZGlyZWN0VG98fHdpbmRvdy5sb2NhdGlvbi5ocmVmO2ErPSgvXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCIpK2piKGIpO3dpbmRvdy5sb2NhdGlvbj1hfTt3Zy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiFsZygpJiYha2coKX07d2cucHJvdG90eXBlLkJjPWZ1bmN0aW9uKCl7cmV0dXJuXCJyZWRpcmVjdFwifTt2YXIgeGc9e05FVFdPUktfRVJST1I6XCJVbmFibGUgdG8gY29udGFjdCB0aGUgRmlyZWJhc2Ugc2VydmVyLlwiLFNFUlZFUl9FUlJPUjpcIkFuIHVua25vd24gc2VydmVyIGVycm9yIG9jY3VycmVkLlwiLFRSQU5TUE9SVF9VTkFWQUlMQUJMRTpcIlRoZXJlIGFyZSBubyBsb2dpbiB0cmFuc3BvcnRzIGF2YWlsYWJsZSBmb3IgdGhlIHJlcXVlc3RlZCBtZXRob2QuXCIsUkVRVUVTVF9JTlRFUlJVUFRFRDpcIlRoZSBicm93c2VyIHJlZGlyZWN0ZWQgdGhlIHBhZ2UgYmVmb3JlIHRoZSBsb2dpbiByZXF1ZXN0IGNvdWxkIGNvbXBsZXRlLlwiLFVTRVJfQ0FOQ0VMTEVEOlwiVGhlIHVzZXIgY2FuY2VsbGVkIGF1dGhlbnRpY2F0aW9uLlwifTtmdW5jdGlvbiB5ZyhhKXt2YXIgYj1FcnJvcih3KHhnLGEpLGEpO2IuY29kZT1hO3JldHVybiBifTtmdW5jdGlvbiB6ZyhhKXtpZighYS53aW5kb3dfZmVhdHVyZXN8fFwidW5kZWZpbmVkXCIhPT10eXBlb2YgbmF2aWdhdG9yJiYoLTEhPT1uYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJGZW5uZWMvXCIpfHwtMSE9PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZpcmVmb3gvXCIpJiYtMSE9PW5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkFuZHJvaWRcIikpKWEud2luZG93X2ZlYXR1cmVzPXZvaWQgMDthLndpbmRvd19uYW1lfHwoYS53aW5kb3dfbmFtZT1cIl9ibGFua1wiKTt0aGlzLm9wdGlvbnM9YX1cbnpnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKGEpe2cmJihkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGcpLGc9dm9pZCAwKTt2JiYodj1jbGVhckludGVydmFsKHYpKTtwZyh3aW5kb3csXCJtZXNzYWdlXCIsZSk7cGcod2luZG93LFwidW5sb2FkXCIsZCk7aWYobSYmIWEpdHJ5e20uY2xvc2UoKX1jYXRjaChiKXtrLnBvc3RNZXNzYWdlKFwiZGllXCIsbCl9bT1rPXZvaWQgMH1mdW5jdGlvbiBlKGEpe2lmKGEub3JpZ2luPT09bCl0cnl7dmFyIGI9bWIoYS5kYXRhKTtcInJlYWR5XCI9PT1iLmE/ay5wb3N0TWVzc2FnZSh5LGwpOlwiZXJyb3JcIj09PWIuYT8oZCghMSksYyYmKGMoYi5kKSxjPW51bGwpKTpcInJlc3BvbnNlXCI9PT1iLmEmJihkKGIuZm9yY2VLZWVwV2luZG93T3BlbiksYyYmKGMobnVsbCxiLmQpLGM9bnVsbCkpfWNhdGNoKGUpe319dmFyIGY9bWcoKSxnLGs7aWYoIXRoaXMub3B0aW9ucy5yZWxheV91cmwpcmV0dXJuIGMoRXJyb3IoXCJpbnZhbGlkIGFyZ3VtZW50czogb3JpZ2luIG9mIHVybCBhbmQgcmVsYXlfdXJsIG11c3QgbWF0Y2hcIikpO1xudmFyIGw9cWcoYSk7aWYobCE9PXFnKHRoaXMub3B0aW9ucy5yZWxheV91cmwpKWMmJnNldFRpbWVvdXQoZnVuY3Rpb24oKXtjKEVycm9yKFwiaW52YWxpZCBhcmd1bWVudHM6IG9yaWdpbiBvZiB1cmwgYW5kIHJlbGF5X3VybCBtdXN0IG1hdGNoXCIpKX0sMCk7ZWxzZXtmJiYoZz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpLGcuc2V0QXR0cmlidXRlKFwic3JjXCIsdGhpcy5vcHRpb25zLnJlbGF5X3VybCksZy5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLGcuc2V0QXR0cmlidXRlKFwibmFtZVwiLFwiX193aW5jaGFuX3JlbGF5X2ZyYW1lXCIpLGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZyksaz1nLmNvbnRlbnRXaW5kb3cpO2ErPSgvXFw/Ly50ZXN0KGEpP1wiXCI6XCI/XCIpK2piKGIpO3ZhciBtPXdpbmRvdy5vcGVuKGEsdGhpcy5vcHRpb25zLndpbmRvd19uYW1lLHRoaXMub3B0aW9ucy53aW5kb3dfZmVhdHVyZXMpO2t8fChrPW0pO3ZhciB2PXNldEludGVydmFsKGZ1bmN0aW9uKCl7bSYmbS5jbG9zZWQmJlxuKGQoITEpLGMmJihjKHlnKFwiVVNFUl9DQU5DRUxMRURcIikpLGM9bnVsbCkpfSw1MDApLHk9Qih7YTpcInJlcXVlc3RcIixkOmJ9KTtvZyh3aW5kb3csXCJ1bmxvYWRcIixkKTtvZyh3aW5kb3csXCJtZXNzYWdlXCIsZSl9fTtcbnpnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuXCJwb3N0TWVzc2FnZVwiaW4gd2luZG93JiYhbGcoKSYmIShrZygpfHxcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1dpbmRvd3MgUGhvbmUvKXx8d2luZG93LldpbmRvd3MmJi9ebXMtYXBweDovLnRlc3QobG9jYXRpb24uaHJlZikpfHxcInVuZGVmaW5lZFwiIT09dHlwZW9mIG5hdmlnYXRvciYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiB3aW5kb3cmJihuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oaVBob25lfGlQb2R8aVBhZCkuKkFwcGxlV2ViS2l0KD8hLipTYWZhcmkpL2kpfHxuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9DcmlPUy8pfHxuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9Ud2l0dGVyIGZvciBpUGhvbmUvKXx8bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvRkJBTlxcL0ZCSU9TLyl8fHdpbmRvdy5uYXZpZ2F0b3Iuc3RhbmRhbG9uZSkpJiYhKFwidW5kZWZpbmVkXCIhPT1cbnR5cGVvZiBuYXZpZ2F0b3ImJm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1BoYW50b21KUy8pKX07emcucHJvdG90eXBlLkJjPWZ1bmN0aW9uKCl7cmV0dXJuXCJwb3B1cFwifTtmdW5jdGlvbiBBZyhhKXthLm1ldGhvZHx8KGEubWV0aG9kPVwiR0VUXCIpO2EuaGVhZGVyc3x8KGEuaGVhZGVycz17fSk7YS5oZWFkZXJzLmNvbnRlbnRfdHlwZXx8KGEuaGVhZGVycy5jb250ZW50X3R5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCIpO2EuaGVhZGVycy5jb250ZW50X3R5cGU9YS5oZWFkZXJzLmNvbnRlbnRfdHlwZS50b0xvd2VyQ2FzZSgpO3RoaXMub3B0aW9ucz1hfVxuQWcucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoKXtjJiYoYyh5ZyhcIlJFUVVFU1RfSU5URVJSVVBURURcIikpLGM9bnVsbCl9dmFyIGU9bmV3IFhNTEh0dHBSZXF1ZXN0LGY9dGhpcy5vcHRpb25zLm1ldGhvZC50b1VwcGVyQ2FzZSgpLGc7b2cod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCk7ZS5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtpZihjJiY0PT09ZS5yZWFkeVN0YXRlKXt2YXIgYTtpZigyMDA8PWUuc3RhdHVzJiYzMDA+ZS5zdGF0dXMpe3RyeXthPW1iKGUucmVzcG9uc2VUZXh0KX1jYXRjaChiKXt9YyhudWxsLGEpfWVsc2UgNTAwPD1lLnN0YXR1cyYmNjAwPmUuc3RhdHVzP2MoeWcoXCJTRVJWRVJfRVJST1JcIikpOmMoeWcoXCJORVRXT1JLX0VSUk9SXCIpKTtjPW51bGw7cGcod2luZG93LFwiYmVmb3JldW5sb2FkXCIsZCl9fTtpZihcIkdFVFwiPT09ZilhKz0oL1xcPy8udGVzdChhKT9cIlwiOlwiP1wiKStqYihiKSxnPW51bGw7ZWxzZXt2YXIgaz10aGlzLm9wdGlvbnMuaGVhZGVycy5jb250ZW50X3R5cGU7XG5cImFwcGxpY2F0aW9uL2pzb25cIj09PWsmJihnPUIoYikpO1wiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCI9PT1rJiYoZz1qYihiKSl9ZS5vcGVuKGYsYSwhMCk7YT17XCJYLVJlcXVlc3RlZC1XaXRoXCI6XCJYTUxIdHRwUmVxdWVzdFwiLEFjY2VwdDpcImFwcGxpY2F0aW9uL2pzb247dGV4dC9wbGFpblwifTt6YShhLHRoaXMub3B0aW9ucy5oZWFkZXJzKTtmb3IodmFyIGwgaW4gYSllLnNldFJlcXVlc3RIZWFkZXIobCxhW2xdKTtlLnNlbmQoZyl9O0FnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuISF3aW5kb3cuWE1MSHR0cFJlcXVlc3QmJlwic3RyaW5nXCI9PT10eXBlb2YobmV3IFhNTEh0dHBSZXF1ZXN0KS5yZXNwb25zZVR5cGUmJighKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgbmF2aWdhdG9yJiYobmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvTVNJRS8pfHxuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9UcmlkZW50LykpKXx8bWcoKSl9O0FnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwianNvblwifTtmdW5jdGlvbiBCZyhhKXt0aGlzLm9jPUdhKCkrR2EoKStHYSgpO3RoaXMuRGY9YX1cbkJnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKCl7YyYmKGMoeWcoXCJVU0VSX0NBTkNFTExFRFwiKSksYz1udWxsKX12YXIgZT10aGlzLGY9UmMoZmcpLGc7Yi5yZXF1ZXN0SWQ9dGhpcy5vYztiLnJlZGlyZWN0VG89Zi5zY2hlbWUrXCI6Ly9cIitmLmhvc3QrXCIvYmxhbmsvcGFnZS5odG1sXCI7YSs9L1xcPy8udGVzdChhKT9cIlwiOlwiP1wiO2ErPWpiKGIpOyhnPXdpbmRvdy5vcGVuKGEsXCJfYmxhbmtcIixcImxvY2F0aW9uPW5vXCIpKSYmaGEoZy5hZGRFdmVudExpc3RlbmVyKT8oZy5hZGRFdmVudExpc3RlbmVyKFwibG9hZHN0YXJ0XCIsZnVuY3Rpb24oYSl7dmFyIGI7aWYoYj1hJiZhLnVybClhOnt0cnl7dmFyIG09ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7bS5ocmVmPWEudXJsO2I9bS5ob3N0PT09Zi5ob3N0JiZcIi9ibGFuay9wYWdlLmh0bWxcIj09PW0ucGF0aG5hbWU7YnJlYWsgYX1jYXRjaCh2KXt9Yj0hMX1iJiYoYT1yZyhhLnVybCksZy5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXhpdFwiLFxuZCksZy5jbG9zZSgpLGE9bmV3IGdnKG51bGwsbnVsbCx7cmVxdWVzdElkOmUub2MscmVxdWVzdEtleTphfSksZS5EZi5yZXF1ZXN0V2l0aENyZWRlbnRpYWwoXCIvYXV0aC9zZXNzaW9uXCIsYSxjKSxjPW51bGwpfSksZy5hZGRFdmVudExpc3RlbmVyKFwiZXhpdFwiLGQpKTpjKHlnKFwiVFJBTlNQT1JUX1VOQVZBSUxBQkxFXCIpKX07QmcuaXNBdmFpbGFibGU9ZnVuY3Rpb24oKXtyZXR1cm4ga2coKX07QmcucHJvdG90eXBlLkJjPWZ1bmN0aW9uKCl7cmV0dXJuXCJyZWRpcmVjdFwifTtmdW5jdGlvbiBDZyhhKXthLmNhbGxiYWNrX3BhcmFtZXRlcnx8KGEuY2FsbGJhY2tfcGFyYW1ldGVyPVwiY2FsbGJhY2tcIik7dGhpcy5vcHRpb25zPWE7d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucD13aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wfHx7fX1cbkNnLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiBkKCl7YyYmKGMoeWcoXCJSRVFVRVNUX0lOVEVSUlVQVEVEXCIpKSxjPW51bGwpfWZ1bmN0aW9uIGUoKXtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7d2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucFtmXT12b2lkIDA7d2Eod2luZG93Ll9fZmlyZWJhc2VfYXV0aF9qc29ucCkmJih3aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wPXZvaWQgMCk7dHJ5e3ZhciBhPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGYpO2EmJmEucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChhKX1jYXRjaChiKXt9fSwxKTtwZyh3aW5kb3csXCJiZWZvcmV1bmxvYWRcIixkKX12YXIgZj1cImZuXCIrKG5ldyBEYXRlKS5nZXRUaW1lKCkrTWF0aC5mbG9vcig5OTk5OSpNYXRoLnJhbmRvbSgpKTtiW3RoaXMub3B0aW9ucy5jYWxsYmFja19wYXJhbWV0ZXJdPVwiX19maXJlYmFzZV9hdXRoX2pzb25wLlwiK2Y7YSs9KC9cXD8vLnRlc3QoYSk/XCJcIjpcIj9cIikramIoYik7XG5vZyh3aW5kb3csXCJiZWZvcmV1bmxvYWRcIixkKTt3aW5kb3cuX19maXJlYmFzZV9hdXRoX2pzb25wW2ZdPWZ1bmN0aW9uKGEpe2MmJihjKG51bGwsYSksYz1udWxsKTtlKCl9O0RnKGYsYSxjKX07XG5mdW5jdGlvbiBEZyhhLGIsYyl7c2V0VGltZW91dChmdW5jdGlvbigpe3RyeXt2YXIgZD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO2QudHlwZT1cInRleHQvamF2YXNjcmlwdFwiO2QuaWQ9YTtkLmFzeW5jPSEwO2Quc3JjPWI7ZC5vbmVycm9yPWZ1bmN0aW9uKCl7dmFyIGI9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYSk7bnVsbCE9PWImJmIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChiKTtjJiZjKHlnKFwiTkVUV09SS19FUlJPUlwiKSl9O3ZhciBlPWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKTsoZSYmMCE9ZS5sZW5ndGg/ZVswXTpkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKGQpfWNhdGNoKGYpe2MmJmMoeWcoXCJORVRXT1JLX0VSUk9SXCIpKX19LDApfUNnLmlzQXZhaWxhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuITB9O0NnLnByb3RvdHlwZS5CYz1mdW5jdGlvbigpe3JldHVyblwianNvblwifTtmdW5jdGlvbiBFZyhhLGIsYyxkKXtJZi5jYWxsKHRoaXMsW1wiYXV0aF9zdGF0dXNcIl0pO3RoaXMuSD1hO3RoaXMuZGY9Yjt0aGlzLlNnPWM7dGhpcy5LZT1kO3RoaXMucmM9bmV3IGpnKGEsW0RjLFBdKTt0aGlzLm5iPW51bGw7dGhpcy5SZT0hMTtGZyh0aGlzKX1tYShFZyxJZik7aD1FZy5wcm90b3R5cGU7aC53ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm5ifHxudWxsfTtmdW5jdGlvbiBGZyhhKXtQLmdldChcInJlZGlyZWN0X3JlcXVlc3RfaWRcIikmJkdnKGEpO3ZhciBiPWEucmMuZ2V0KCk7YiYmYi50b2tlbj8oSGcoYSxiKSxhLmRmKGIudG9rZW4sZnVuY3Rpb24oYyxkKXtJZyhhLGMsZCwhMSxiLnRva2VuLGIpfSxmdW5jdGlvbihiLGQpe0pnKGEsXCJyZXN1bWVTZXNzaW9uKClcIixiLGQpfSkpOkhnKGEsbnVsbCl9XG5mdW5jdGlvbiBLZyhhLGIsYyxkLGUsZil7XCJmaXJlYmFzZWlvLWRlbW8uY29tXCI9PT1hLkguZG9tYWluJiZRKFwiRmlyZWJhc2UgYXV0aGVudGljYXRpb24gaXMgbm90IHN1cHBvcnRlZCBvbiBkZW1vIEZpcmViYXNlcyAoKi5maXJlYmFzZWlvLWRlbW8uY29tKS4gVG8gc2VjdXJlIHlvdXIgRmlyZWJhc2UsIGNyZWF0ZSBhIHByb2R1Y3Rpb24gRmlyZWJhc2UgYXQgaHR0cHM6Ly93d3cuZmlyZWJhc2UuY29tLlwiKTthLmRmKGIsZnVuY3Rpb24oZixrKXtJZyhhLGYsaywhMCxiLGMsZHx8e30sZSl9LGZ1bmN0aW9uKGIsYyl7SmcoYSxcImF1dGgoKVwiLGIsYyxmKX0pfWZ1bmN0aW9uIExnKGEsYil7YS5yYy5jbGVhcigpO0hnKGEsbnVsbCk7YS5TZyhmdW5jdGlvbihhLGQpe2lmKFwib2tcIj09PWEpUihiLG51bGwpO2Vsc2V7dmFyIGU9KGF8fFwiZXJyb3JcIikudG9VcHBlckNhc2UoKSxmPWU7ZCYmKGYrPVwiOiBcIitkKTtmPUVycm9yKGYpO2YuY29kZT1lO1IoYixmKX19KX1cbmZ1bmN0aW9uIElnKGEsYixjLGQsZSxmLGcsayl7XCJva1wiPT09Yj8oZCYmKGI9Yy5hdXRoLGYuYXV0aD1iLGYuZXhwaXJlcz1jLmV4cGlyZXMsZi50b2tlbj1jZChlKT9lOlwiXCIsYz1udWxsLGImJnUoYixcInVpZFwiKT9jPXcoYixcInVpZFwiKTp1KGYsXCJ1aWRcIikmJihjPXcoZixcInVpZFwiKSksZi51aWQ9YyxjPVwiY3VzdG9tXCIsYiYmdShiLFwicHJvdmlkZXJcIik/Yz13KGIsXCJwcm92aWRlclwiKTp1KGYsXCJwcm92aWRlclwiKSYmKGM9dyhmLFwicHJvdmlkZXJcIikpLGYucHJvdmlkZXI9YyxhLnJjLmNsZWFyKCksY2QoZSkmJihnPWd8fHt9LGM9RGMsXCJzZXNzaW9uT25seVwiPT09Zy5yZW1lbWJlciYmKGM9UCksXCJub25lXCIhPT1nLnJlbWVtYmVyJiZhLnJjLnNldChmLGMpKSxIZyhhLGYpKSxSKGssbnVsbCxmKSk6KGEucmMuY2xlYXIoKSxIZyhhLG51bGwpLGY9YT0oYnx8XCJlcnJvclwiKS50b1VwcGVyQ2FzZSgpLGMmJihmKz1cIjogXCIrYyksZj1FcnJvcihmKSxmLmNvZGU9YSxSKGssZikpfVxuZnVuY3Rpb24gSmcoYSxiLGMsZCxlKXtRKGIrXCIgd2FzIGNhbmNlbGVkOiBcIitkKTthLnJjLmNsZWFyKCk7SGcoYSxudWxsKTthPUVycm9yKGQpO2EuY29kZT1jLnRvVXBwZXJDYXNlKCk7UihlLGEpfWZ1bmN0aW9uIE1nKGEsYixjLGQsZSl7TmcoYSk7Yz1uZXcgZ2coZHx8e30se30sY3x8e30pO09nKGEsW0FnLENnXSxcIi9hdXRoL1wiK2IsYyxlKX1cbmZ1bmN0aW9uIFBnKGEsYixjLGQpe05nKGEpO3ZhciBlPVt6ZyxCZ107Yz1pZyhjKTtcImFub255bW91c1wiPT09Ynx8XCJwYXNzd29yZFwiPT09Yj9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7UihkLHlnKFwiVFJBTlNQT1JUX1VOQVZBSUxBQkxFXCIpKX0sMCk6KGMuY2Uud2luZG93X2ZlYXR1cmVzPVwibWVudWJhcj15ZXMsbW9kYWw9eWVzLGFsd2F5c1JhaXNlZD15ZXNsb2NhdGlvbj15ZXMscmVzaXphYmxlPXllcyxzY3JvbGxiYXJzPXllcyxzdGF0dXM9eWVzLGhlaWdodD02MjUsd2lkdGg9NjI1LHRvcD1cIisoXCJvYmplY3RcIj09PXR5cGVvZiBzY3JlZW4/LjUqKHNjcmVlbi5oZWlnaHQtNjI1KTowKStcIixsZWZ0PVwiKyhcIm9iamVjdFwiPT09dHlwZW9mIHNjcmVlbj8uNSooc2NyZWVuLndpZHRoLTYyNSk6MCksYy5jZS5yZWxheV91cmw9dGcoYS5ILkNiKSxjLmNlLnJlcXVlc3RXaXRoQ3JlZGVudGlhbD1xKGEucGMsYSksT2coYSxlLFwiL2F1dGgvXCIrYixjLGQpKX1cbmZ1bmN0aW9uIEdnKGEpe3ZhciBiPVAuZ2V0KFwicmVkaXJlY3RfcmVxdWVzdF9pZFwiKTtpZihiKXt2YXIgYz1QLmdldChcInJlZGlyZWN0X2NsaWVudF9vcHRpb25zXCIpO1AucmVtb3ZlKFwicmVkaXJlY3RfcmVxdWVzdF9pZFwiKTtQLnJlbW92ZShcInJlZGlyZWN0X2NsaWVudF9vcHRpb25zXCIpO3ZhciBkPVtBZyxDZ10sYj17cmVxdWVzdElkOmIscmVxdWVzdEtleTpyZyhkb2N1bWVudC5sb2NhdGlvbi5oYXNoKX0sYz1uZXcgZ2coYyx7fSxiKTthLlJlPSEwO3RyeXtkb2N1bWVudC5sb2NhdGlvbi5oYXNoPWRvY3VtZW50LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgvJl9fZmlyZWJhc2VfcmVxdWVzdF9rZXk9KFthLXpBLXowLTldKikvLFwiXCIpfWNhdGNoKGUpe31PZyhhLGQsXCIvYXV0aC9zZXNzaW9uXCIsYyxmdW5jdGlvbigpe3RoaXMuUmU9ITF9LmJpbmQoYSkpfX1cbmgucmU9ZnVuY3Rpb24oYSxiKXtOZyh0aGlzKTt2YXIgYz1pZyhhKTtjLmFiLl9tZXRob2Q9XCJQT1NUXCI7dGhpcy5wYyhcIi91c2Vyc1wiLGMsZnVuY3Rpb24oYSxjKXthP1IoYixhKTpSKGIsYSxjKX0pfTtoLlNlPWZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcztOZyh0aGlzKTt2YXIgZD1cIi91c2Vycy9cIitlbmNvZGVVUklDb21wb25lbnQoYS5lbWFpbCksZT1pZyhhKTtlLmFiLl9tZXRob2Q9XCJERUxFVEVcIjt0aGlzLnBjKGQsZSxmdW5jdGlvbihhLGQpeyFhJiZkJiZkLnVpZCYmYy5uYiYmYy5uYi51aWQmJmMubmIudWlkPT09ZC51aWQmJkxnKGMpO1IoYixhKX0pfTtoLm9lPWZ1bmN0aW9uKGEsYil7TmcodGhpcyk7dmFyIGM9XCIvdXNlcnMvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGEuZW1haWwpK1wiL3Bhc3N3b3JkXCIsZD1pZyhhKTtkLmFiLl9tZXRob2Q9XCJQVVRcIjtkLmFiLnBhc3N3b3JkPWEubmV3UGFzc3dvcmQ7dGhpcy5wYyhjLGQsZnVuY3Rpb24oYSl7UihiLGEpfSl9O1xuaC5uZT1mdW5jdGlvbihhLGIpe05nKHRoaXMpO3ZhciBjPVwiL3VzZXJzL1wiK2VuY29kZVVSSUNvbXBvbmVudChhLm9sZEVtYWlsKStcIi9lbWFpbFwiLGQ9aWcoYSk7ZC5hYi5fbWV0aG9kPVwiUFVUXCI7ZC5hYi5lbWFpbD1hLm5ld0VtYWlsO2QuYWIucGFzc3dvcmQ9YS5wYXNzd29yZDt0aGlzLnBjKGMsZCxmdW5jdGlvbihhKXtSKGIsYSl9KX07aC5VZT1mdW5jdGlvbihhLGIpe05nKHRoaXMpO3ZhciBjPVwiL3VzZXJzL1wiK2VuY29kZVVSSUNvbXBvbmVudChhLmVtYWlsKStcIi9wYXNzd29yZFwiLGQ9aWcoYSk7ZC5hYi5fbWV0aG9kPVwiUE9TVFwiO3RoaXMucGMoYyxkLGZ1bmN0aW9uKGEpe1IoYixhKX0pfTtoLnBjPWZ1bmN0aW9uKGEsYixjKXtRZyh0aGlzLFtBZyxDZ10sYSxiLGMpfTtcbmZ1bmN0aW9uIE9nKGEsYixjLGQsZSl7UWcoYSxiLGMsZCxmdW5jdGlvbihiLGMpeyFiJiZjJiZjLnRva2VuJiZjLnVpZD9LZyhhLGMudG9rZW4sYyxkLmxkLGZ1bmN0aW9uKGEsYil7YT9SKGUsYSk6UihlLG51bGwsYil9KTpSKGUsYnx8eWcoXCJVTktOT1dOX0VSUk9SXCIpKX0pfVxuZnVuY3Rpb24gUWcoYSxiLGMsZCxlKXtiPVBhKGIsZnVuY3Rpb24oYSl7cmV0dXJuXCJmdW5jdGlvblwiPT09dHlwZW9mIGEuaXNBdmFpbGFibGUmJmEuaXNBdmFpbGFibGUoKX0pOzA9PT1iLmxlbmd0aD9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7UihlLHlnKFwiVFJBTlNQT1JUX1VOQVZBSUxBQkxFXCIpKX0sMCk6KGI9bmV3IChiLnNoaWZ0KCkpKGQuY2UpLGQ9aWIoZC5hYiksZC52PVwianMtMi4yLjRcIixkLnRyYW5zcG9ydD1iLkJjKCksZC5zdXBwcmVzc19zdGF0dXNfY29kZXM9ITAsYT1zZygpK1wiL1wiK2EuSC5DYitjLGIub3BlbihhLGQsZnVuY3Rpb24oYSxiKXtpZihhKVIoZSxhKTtlbHNlIGlmKGImJmIuZXJyb3Ipe3ZhciBjPUVycm9yKGIuZXJyb3IubWVzc2FnZSk7Yy5jb2RlPWIuZXJyb3IuY29kZTtjLmRldGFpbHM9Yi5lcnJvci5kZXRhaWxzO1IoZSxjKX1lbHNlIFIoZSxudWxsLGIpfSkpfVxuZnVuY3Rpb24gSGcoYSxiKXt2YXIgYz1udWxsIT09YS5uYnx8bnVsbCE9PWI7YS5uYj1iO2MmJmEuZGUoXCJhdXRoX3N0YXR1c1wiLGIpO2EuS2UobnVsbCE9PWIpfWguemU9ZnVuY3Rpb24oYSl7SihcImF1dGhfc3RhdHVzXCI9PT1hLCdpbml0aWFsIGV2ZW50IG11c3QgYmUgb2YgdHlwZSBcImF1dGhfc3RhdHVzXCInKTtyZXR1cm4gdGhpcy5SZT9udWxsOlt0aGlzLm5iXX07ZnVuY3Rpb24gTmcoYSl7dmFyIGI9YS5IO2lmKFwiZmlyZWJhc2Vpby5jb21cIiE9PWIuZG9tYWluJiZcImZpcmViYXNlaW8tZGVtby5jb21cIiE9PWIuZG9tYWluJiZcImF1dGguZmlyZWJhc2UuY29tXCI9PT1mZyl0aHJvdyBFcnJvcihcIlRoaXMgY3VzdG9tIEZpcmViYXNlIHNlcnZlciAoJ1wiK2EuSC5kb21haW4rXCInKSBkb2VzIG5vdCBzdXBwb3J0IGRlbGVnYXRlZCBsb2dpbi5cIik7fTtmdW5jdGlvbiBSZyhhKXt0aGlzLmhjPWE7dGhpcy5LZD1bXTt0aGlzLlFiPTA7dGhpcy5wZT0tMTt0aGlzLkZiPW51bGx9ZnVuY3Rpb24gU2coYSxiLGMpe2EucGU9YjthLkZiPWM7YS5wZTxhLlFiJiYoYS5GYigpLGEuRmI9bnVsbCl9ZnVuY3Rpb24gVGcoYSxiLGMpe2ZvcihhLktkW2JdPWM7YS5LZFthLlFiXTspe3ZhciBkPWEuS2RbYS5RYl07ZGVsZXRlIGEuS2RbYS5RYl07Zm9yKHZhciBlPTA7ZTxkLmxlbmd0aDsrK2UpaWYoZFtlXSl7dmFyIGY9YTtDYihmdW5jdGlvbigpe2YuaGMoZFtlXSl9KX1pZihhLlFiPT09YS5wZSl7YS5GYiYmKGNsZWFyVGltZW91dChhLkZiKSxhLkZiKCksYS5GYj1udWxsKTticmVha31hLlFiKyt9fTtmdW5jdGlvbiBVZyhhLGIsYyl7dGhpcy5xZT1hO3RoaXMuZj1PYyhhKTt0aGlzLm9iPXRoaXMucGI9MDt0aGlzLlZhPU9iKGIpO3RoaXMuVmQ9Yzt0aGlzLkdjPSExO3RoaXMuZ2Q9ZnVuY3Rpb24oYSl7Yi5ob3N0IT09Yi5PYSYmKGEubnM9Yi5DYik7dmFyIGM9W10sZjtmb3IoZiBpbiBhKWEuaGFzT3duUHJvcGVydHkoZikmJmMucHVzaChmK1wiPVwiK2FbZl0pO3JldHVybihiLmxiP1wiaHR0cHM6Ly9cIjpcImh0dHA6Ly9cIikrYi5PYStcIi8ubHA/XCIrYy5qb2luKFwiJlwiKX19dmFyIFZnLFdnO1xuVWcucHJvdG90eXBlLm9wZW49ZnVuY3Rpb24oYSxiKXt0aGlzLmdmPTA7dGhpcy5rYT1iO3RoaXMuemY9bmV3IFJnKGEpO3RoaXMuemI9ITE7dmFyIGM9dGhpczt0aGlzLnJiPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtjLmYoXCJUaW1lZCBvdXQgdHJ5aW5nIHRvIGNvbm5lY3QuXCIpO2MuaWIoKTtjLnJiPW51bGx9LE1hdGguZmxvb3IoM0U0KSk7VGMoZnVuY3Rpb24oKXtpZighYy56Yil7Yy5UYT1uZXcgWGcoZnVuY3Rpb24oYSxiLGQsayxsKXtZZyhjLGFyZ3VtZW50cyk7aWYoYy5UYSlpZihjLnJiJiYoY2xlYXJUaW1lb3V0KGMucmIpLGMucmI9bnVsbCksYy5HYz0hMCxcInN0YXJ0XCI9PWEpYy5pZD1iLGMuRmY9ZDtlbHNlIGlmKFwiY2xvc2VcIj09PWEpYj8oYy5UYS5UZD0hMSxTZyhjLnpmLGIsZnVuY3Rpb24oKXtjLmliKCl9KSk6Yy5pYigpO2Vsc2UgdGhyb3cgRXJyb3IoXCJVbnJlY29nbml6ZWQgY29tbWFuZCByZWNlaXZlZDogXCIrYSk7fSxmdW5jdGlvbihhLGIpe1lnKGMsYXJndW1lbnRzKTtcblRnKGMuemYsYSxiKX0sZnVuY3Rpb24oKXtjLmliKCl9LGMuZ2QpO3ZhciBhPXtzdGFydDpcInRcIn07YS5zZXI9TWF0aC5mbG9vcigxRTgqTWF0aC5yYW5kb20oKSk7Yy5UYS5mZSYmKGEuY2I9Yy5UYS5mZSk7YS52PVwiNVwiO2MuVmQmJihhLnM9Yy5WZCk7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBsb2NhdGlvbiYmbG9jYXRpb24uaHJlZiYmLTEhPT1sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJmaXJlYmFzZWlvLmNvbVwiKSYmKGEucj1cImZcIik7YT1jLmdkKGEpO2MuZihcIkNvbm5lY3RpbmcgdmlhIGxvbmctcG9sbCB0byBcIithKTtaZyhjLlRhLGEsZnVuY3Rpb24oKXt9KX19KX07XG5VZy5wcm90b3R5cGUuc3RhcnQ9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLlRhLGI9dGhpcy5GZjthLnJnPXRoaXMuaWQ7YS5zZz1iO2ZvcihhLmtlPSEwOyRnKGEpOyk7YT10aGlzLmlkO2I9dGhpcy5GZjt0aGlzLmZjPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7dmFyIGM9e2RmcmFtZTpcInRcIn07Yy5pZD1hO2MucHc9Yjt0aGlzLmZjLnNyYz10aGlzLmdkKGMpO3RoaXMuZmMuc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZmMpfTtVZy5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3JldHVybiFXZyYmIShcIm9iamVjdFwiPT09dHlwZW9mIHdpbmRvdyYmd2luZG93LmNocm9tZSYmd2luZG93LmNocm9tZS5leHRlbnNpb24mJiEvXmNocm9tZS8udGVzdCh3aW5kb3cubG9jYXRpb24uaHJlZikpJiYhKFwib2JqZWN0XCI9PT10eXBlb2YgV2luZG93cyYmXCJvYmplY3RcIj09PXR5cGVvZiBXaW5kb3dzLlVnKSYmKFZnfHwhMCl9O2g9VWcucHJvdG90eXBlO1xuaC5CZD1mdW5jdGlvbigpe307aC5jZD1mdW5jdGlvbigpe3RoaXMuemI9ITA7dGhpcy5UYSYmKHRoaXMuVGEuY2xvc2UoKSx0aGlzLlRhPW51bGwpO3RoaXMuZmMmJihkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuZmMpLHRoaXMuZmM9bnVsbCk7dGhpcy5yYiYmKGNsZWFyVGltZW91dCh0aGlzLnJiKSx0aGlzLnJiPW51bGwpfTtoLmliPWZ1bmN0aW9uKCl7dGhpcy56Ynx8KHRoaXMuZihcIkxvbmdwb2xsIGlzIGNsb3NpbmcgaXRzZWxmXCIpLHRoaXMuY2QoKSx0aGlzLmthJiYodGhpcy5rYSh0aGlzLkdjKSx0aGlzLmthPW51bGwpKX07aC5jbG9zZT1mdW5jdGlvbigpe3RoaXMuemJ8fCh0aGlzLmYoXCJMb25ncG9sbCBpcyBiZWluZyBjbG9zZWQuXCIpLHRoaXMuY2QoKSl9O1xuaC5zZW5kPWZ1bmN0aW9uKGEpe2E9QihhKTt0aGlzLnBiKz1hLmxlbmd0aDtMYih0aGlzLlZhLFwiYnl0ZXNfc2VudFwiLGEubGVuZ3RoKTthPUtjKGEpO2E9ZmIoYSwhMCk7YT1YYyhhLDE4NDApO2Zvcih2YXIgYj0wO2I8YS5sZW5ndGg7YisrKXt2YXIgYz10aGlzLlRhO2MuJGMucHVzaCh7Smc6dGhpcy5nZixSZzphLmxlbmd0aCxqZjphW2JdfSk7Yy5rZSYmJGcoYyk7dGhpcy5nZisrfX07ZnVuY3Rpb24gWWcoYSxiKXt2YXIgYz1CKGIpLmxlbmd0aDthLm9iKz1jO0xiKGEuVmEsXCJieXRlc19yZWNlaXZlZFwiLGMpfVxuZnVuY3Rpb24gWGcoYSxiLGMsZCl7dGhpcy5nZD1kO3RoaXMuamI9Yzt0aGlzLk9lPW5ldyBjZzt0aGlzLiRjPVtdO3RoaXMuc2U9TWF0aC5mbG9vcigxRTgqTWF0aC5yYW5kb20oKSk7dGhpcy5UZD0hMDt0aGlzLmZlPUdjKCk7d2luZG93W1wicExQQ29tbWFuZFwiK3RoaXMuZmVdPWE7d2luZG93W1wicFJUTFBDQlwiK3RoaXMuZmVdPWI7YT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO2Euc3R5bGUuZGlzcGxheT1cIm5vbmVcIjtpZihkb2N1bWVudC5ib2R5KXtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO3RyeXthLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnR8fEJiKFwiTm8gSUUgZG9tYWluIHNldHRpbmcgcmVxdWlyZWRcIil9Y2F0Y2goZSl7YS5zcmM9XCJqYXZhc2NyaXB0OnZvaWQoKGZ1bmN0aW9uKCl7ZG9jdW1lbnQub3BlbigpO2RvY3VtZW50LmRvbWFpbj0nXCIrZG9jdW1lbnQuZG9tYWluK1wiJztkb2N1bWVudC5jbG9zZSgpO30pKCkpXCJ9fWVsc2UgdGhyb3dcIkRvY3VtZW50IGJvZHkgaGFzIG5vdCBpbml0aWFsaXplZC4gV2FpdCB0byBpbml0aWFsaXplIEZpcmViYXNlIHVudGlsIGFmdGVyIHRoZSBkb2N1bWVudCBpcyByZWFkeS5cIjtcbmEuY29udGVudERvY3VtZW50P2EuZ2I9YS5jb250ZW50RG9jdW1lbnQ6YS5jb250ZW50V2luZG93P2EuZ2I9YS5jb250ZW50V2luZG93LmRvY3VtZW50OmEuZG9jdW1lbnQmJihhLmdiPWEuZG9jdW1lbnQpO3RoaXMuQ2E9YTthPVwiXCI7dGhpcy5DYS5zcmMmJlwiamF2YXNjcmlwdDpcIj09PXRoaXMuQ2Euc3JjLnN1YnN0cigwLDExKSYmKGE9JzxzY3JpcHQ+ZG9jdW1lbnQuZG9tYWluPVwiJytkb2N1bWVudC5kb21haW4rJ1wiO1xceDNjL3NjcmlwdD4nKTthPVwiPGh0bWw+PGJvZHk+XCIrYStcIjwvYm9keT48L2h0bWw+XCI7dHJ5e3RoaXMuQ2EuZ2Iub3BlbigpLHRoaXMuQ2EuZ2Iud3JpdGUoYSksdGhpcy5DYS5nYi5jbG9zZSgpfWNhdGNoKGYpe0JiKFwiZnJhbWUgd3JpdGluZyBleGNlcHRpb25cIiksZi5zdGFjayYmQmIoZi5zdGFjayksQmIoZil9fVxuWGcucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7dGhpcy5rZT0hMTtpZih0aGlzLkNhKXt0aGlzLkNhLmdiLmJvZHkuaW5uZXJIVE1MPVwiXCI7dmFyIGE9dGhpcztzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bnVsbCE9PWEuQ2EmJihkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEuQ2EpLGEuQ2E9bnVsbCl9LE1hdGguZmxvb3IoMCkpfXZhciBiPXRoaXMuamI7YiYmKHRoaXMuamI9bnVsbCxiKCkpfTtcbmZ1bmN0aW9uICRnKGEpe2lmKGEua2UmJmEuVGQmJmEuT2UuY291bnQoKTwoMDxhLiRjLmxlbmd0aD8yOjEpKXthLnNlKys7dmFyIGI9e307Yi5pZD1hLnJnO2IucHc9YS5zZztiLnNlcj1hLnNlO2Zvcih2YXIgYj1hLmdkKGIpLGM9XCJcIixkPTA7MDxhLiRjLmxlbmd0aDspaWYoMTg3MD49YS4kY1swXS5qZi5sZW5ndGgrMzArYy5sZW5ndGgpe3ZhciBlPWEuJGMuc2hpZnQoKSxjPWMrXCImc2VnXCIrZCtcIj1cIitlLkpnK1wiJnRzXCIrZCtcIj1cIitlLlJnK1wiJmRcIitkK1wiPVwiK2UuamY7ZCsrfWVsc2UgYnJlYWs7YWgoYSxiK2MsYS5zZSk7cmV0dXJuITB9cmV0dXJuITF9ZnVuY3Rpb24gYWgoYSxiLGMpe2Z1bmN0aW9uIGQoKXthLk9lLnJlbW92ZShjKTskZyhhKX1hLk9lLmFkZChjLDEpO3ZhciBlPXNldFRpbWVvdXQoZCxNYXRoLmZsb29yKDI1RTMpKTtaZyhhLGIsZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQoZSk7ZCgpfSl9XG5mdW5jdGlvbiBaZyhhLGIsYyl7c2V0VGltZW91dChmdW5jdGlvbigpe3RyeXtpZihhLlRkKXt2YXIgZD1hLkNhLmdiLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7ZC50eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI7ZC5hc3luYz0hMDtkLnNyYz1iO2Qub25sb2FkPWQub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7dmFyIGE9ZC5yZWFkeVN0YXRlO2EmJlwibG9hZGVkXCIhPT1hJiZcImNvbXBsZXRlXCIhPT1hfHwoZC5vbmxvYWQ9ZC5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCxkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxjKCkpfTtkLm9uZXJyb3I9ZnVuY3Rpb24oKXtCYihcIkxvbmctcG9sbCBzY3JpcHQgZmFpbGVkIHRvIGxvYWQ6IFwiK2IpO2EuVGQ9ITE7YS5jbG9zZSgpfTthLkNhLmdiLmJvZHkuYXBwZW5kQ2hpbGQoZCl9fWNhdGNoKGUpe319LE1hdGguZmxvb3IoMSkpfTt2YXIgYmg9bnVsbDtcInVuZGVmaW5lZFwiIT09dHlwZW9mIE1veldlYlNvY2tldD9iaD1Nb3pXZWJTb2NrZXQ6XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBXZWJTb2NrZXQmJihiaD1XZWJTb2NrZXQpO2Z1bmN0aW9uIGNoKGEsYixjKXt0aGlzLnFlPWE7dGhpcy5mPU9jKHRoaXMucWUpO3RoaXMuZnJhbWVzPXRoaXMuSmM9bnVsbDt0aGlzLm9iPXRoaXMucGI9dGhpcy5iZj0wO3RoaXMuVmE9T2IoYik7dGhpcy5mYj0oYi5sYj9cIndzczovL1wiOlwid3M6Ly9cIikrYi5PYStcIi8ud3M/dj01XCI7XCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBsb2NhdGlvbiYmbG9jYXRpb24uaHJlZiYmLTEhPT1sb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJmaXJlYmFzZWlvLmNvbVwiKSYmKHRoaXMuZmIrPVwiJnI9ZlwiKTtiLmhvc3QhPT1iLk9hJiYodGhpcy5mYj10aGlzLmZiK1wiJm5zPVwiK2IuQ2IpO2MmJih0aGlzLmZiPXRoaXMuZmIrXCImcz1cIitjKX12YXIgZGg7XG5jaC5wcm90b3R5cGUub3Blbj1mdW5jdGlvbihhLGIpe3RoaXMuamI9Yjt0aGlzLndnPWE7dGhpcy5mKFwiV2Vic29ja2V0IGNvbm5lY3RpbmcgdG8gXCIrdGhpcy5mYik7dGhpcy5HYz0hMTtEYy5zZXQoXCJwcmV2aW91c193ZWJzb2NrZXRfZmFpbHVyZVwiLCEwKTt0cnl7dGhpcy52YT1uZXcgYmgodGhpcy5mYil9Y2F0Y2goYyl7dGhpcy5mKFwiRXJyb3IgaW5zdGFudGlhdGluZyBXZWJTb2NrZXQuXCIpO3ZhciBkPWMubWVzc2FnZXx8Yy5kYXRhO2QmJnRoaXMuZihkKTt0aGlzLmliKCk7cmV0dXJufXZhciBlPXRoaXM7dGhpcy52YS5vbm9wZW49ZnVuY3Rpb24oKXtlLmYoXCJXZWJzb2NrZXQgY29ubmVjdGVkLlwiKTtlLkdjPSEwfTt0aGlzLnZhLm9uY2xvc2U9ZnVuY3Rpb24oKXtlLmYoXCJXZWJzb2NrZXQgY29ubmVjdGlvbiB3YXMgZGlzY29ubmVjdGVkLlwiKTtlLnZhPW51bGw7ZS5pYigpfTt0aGlzLnZhLm9ubWVzc2FnZT1mdW5jdGlvbihhKXtpZihudWxsIT09ZS52YSlpZihhPWEuZGF0YSxlLm9iKz1cbmEubGVuZ3RoLExiKGUuVmEsXCJieXRlc19yZWNlaXZlZFwiLGEubGVuZ3RoKSxlaChlKSxudWxsIT09ZS5mcmFtZXMpZmgoZSxhKTtlbHNle2E6e0oobnVsbD09PWUuZnJhbWVzLFwiV2UgYWxyZWFkeSBoYXZlIGEgZnJhbWUgYnVmZmVyXCIpO2lmKDY+PWEubGVuZ3RoKXt2YXIgYj1OdW1iZXIoYSk7aWYoIWlzTmFOKGIpKXtlLmJmPWI7ZS5mcmFtZXM9W107YT1udWxsO2JyZWFrIGF9fWUuYmY9MTtlLmZyYW1lcz1bXX1udWxsIT09YSYmZmgoZSxhKX19O3RoaXMudmEub25lcnJvcj1mdW5jdGlvbihhKXtlLmYoXCJXZWJTb2NrZXQgZXJyb3IuICBDbG9zaW5nIGNvbm5lY3Rpb24uXCIpOyhhPWEubWVzc2FnZXx8YS5kYXRhKSYmZS5mKGEpO2UuaWIoKX19O2NoLnByb3RvdHlwZS5zdGFydD1mdW5jdGlvbigpe307XG5jaC5pc0F2YWlsYWJsZT1mdW5jdGlvbigpe3ZhciBhPSExO2lmKFwidW5kZWZpbmVkXCIhPT10eXBlb2YgbmF2aWdhdG9yJiZuYXZpZ2F0b3IudXNlckFnZW50KXt2YXIgYj1uYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkIChbMC05XXswLH1cXC5bMC05XXswLH0pLyk7YiYmMTxiLmxlbmd0aCYmNC40PnBhcnNlRmxvYXQoYlsxXSkmJihhPSEwKX1yZXR1cm4hYSYmbnVsbCE9PWJoJiYhZGh9O2NoLnJlc3BvbnNlc1JlcXVpcmVkVG9CZUhlYWx0aHk9MjtjaC5oZWFsdGh5VGltZW91dD0zRTQ7aD1jaC5wcm90b3R5cGU7aC5CZD1mdW5jdGlvbigpe0RjLnJlbW92ZShcInByZXZpb3VzX3dlYnNvY2tldF9mYWlsdXJlXCIpfTtmdW5jdGlvbiBmaChhLGIpe2EuZnJhbWVzLnB1c2goYik7aWYoYS5mcmFtZXMubGVuZ3RoPT1hLmJmKXt2YXIgYz1hLmZyYW1lcy5qb2luKFwiXCIpO2EuZnJhbWVzPW51bGw7Yz1tYihjKTthLndnKGMpfX1cbmguc2VuZD1mdW5jdGlvbihhKXtlaCh0aGlzKTthPUIoYSk7dGhpcy5wYis9YS5sZW5ndGg7TGIodGhpcy5WYSxcImJ5dGVzX3NlbnRcIixhLmxlbmd0aCk7YT1YYyhhLDE2Mzg0KTsxPGEubGVuZ3RoJiZ0aGlzLnZhLnNlbmQoU3RyaW5nKGEubGVuZ3RoKSk7Zm9yKHZhciBiPTA7YjxhLmxlbmd0aDtiKyspdGhpcy52YS5zZW5kKGFbYl0pfTtoLmNkPWZ1bmN0aW9uKCl7dGhpcy56Yj0hMDt0aGlzLkpjJiYoY2xlYXJJbnRlcnZhbCh0aGlzLkpjKSx0aGlzLkpjPW51bGwpO3RoaXMudmEmJih0aGlzLnZhLmNsb3NlKCksdGhpcy52YT1udWxsKX07aC5pYj1mdW5jdGlvbigpe3RoaXMuemJ8fCh0aGlzLmYoXCJXZWJTb2NrZXQgaXMgY2xvc2luZyBpdHNlbGZcIiksdGhpcy5jZCgpLHRoaXMuamImJih0aGlzLmpiKHRoaXMuR2MpLHRoaXMuamI9bnVsbCkpfTtoLmNsb3NlPWZ1bmN0aW9uKCl7dGhpcy56Ynx8KHRoaXMuZihcIldlYlNvY2tldCBpcyBiZWluZyBjbG9zZWRcIiksdGhpcy5jZCgpKX07XG5mdW5jdGlvbiBlaChhKXtjbGVhckludGVydmFsKGEuSmMpO2EuSmM9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXthLnZhJiZhLnZhLnNlbmQoXCIwXCIpO2VoKGEpfSxNYXRoLmZsb29yKDQ1RTMpKX07ZnVuY3Rpb24gZ2goYSl7aGgodGhpcyxhKX12YXIgaWg9W1VnLGNoXTtmdW5jdGlvbiBoaChhLGIpe3ZhciBjPWNoJiZjaC5pc0F2YWlsYWJsZSgpLGQ9YyYmIShEYy51Znx8ITA9PT1EYy5nZXQoXCJwcmV2aW91c193ZWJzb2NrZXRfZmFpbHVyZVwiKSk7Yi5UZyYmKGN8fFEoXCJ3c3M6Ly8gVVJMIHVzZWQsIGJ1dCBicm93c2VyIGlzbid0IGtub3duIHRvIHN1cHBvcnQgd2Vic29ja2V0cy4gIFRyeWluZyBhbnl3YXkuXCIpLGQ9ITApO2lmKGQpYS5lZD1bY2hdO2Vsc2V7dmFyIGU9YS5lZD1bXTtZYyhpaCxmdW5jdGlvbihhLGIpe2ImJmIuaXNBdmFpbGFibGUoKSYmZS5wdXNoKGIpfSl9fWZ1bmN0aW9uIGpoKGEpe2lmKDA8YS5lZC5sZW5ndGgpcmV0dXJuIGEuZWRbMF07dGhyb3cgRXJyb3IoXCJObyB0cmFuc3BvcnRzIGF2YWlsYWJsZVwiKTt9O2Z1bmN0aW9uIGtoKGEsYixjLGQsZSxmKXt0aGlzLmlkPWE7dGhpcy5mPU9jKFwiYzpcIit0aGlzLmlkK1wiOlwiKTt0aGlzLmhjPWM7dGhpcy5WYz1kO3RoaXMua2E9ZTt0aGlzLk1lPWY7dGhpcy5IPWI7dGhpcy5KZD1bXTt0aGlzLmVmPTA7dGhpcy5OZj1uZXcgZ2goYik7dGhpcy5VYT0wO3RoaXMuZihcIkNvbm5lY3Rpb24gY3JlYXRlZFwiKTtsaCh0aGlzKX1cbmZ1bmN0aW9uIGxoKGEpe3ZhciBiPWpoKGEuTmYpO2EuTD1uZXcgYihcImM6XCIrYS5pZCtcIjpcIithLmVmKyssYS5IKTthLlFlPWIucmVzcG9uc2VzUmVxdWlyZWRUb0JlSGVhbHRoeXx8MDt2YXIgYz1taChhLGEuTCksZD1uaChhLGEuTCk7YS5mZD1hLkw7YS5iZD1hLkw7YS5GPW51bGw7YS5BYj0hMTtzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS5MJiZhLkwub3BlbihjLGQpfSxNYXRoLmZsb29yKDApKTtiPWIuaGVhbHRoeVRpbWVvdXR8fDA7MDxiJiYoYS52ZD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7YS52ZD1udWxsO2EuQWJ8fChhLkwmJjEwMjQwMDxhLkwub2I/KGEuZihcIkNvbm5lY3Rpb24gZXhjZWVkZWQgaGVhbHRoeSB0aW1lb3V0IGJ1dCBoYXMgcmVjZWl2ZWQgXCIrYS5MLm9iK1wiIGJ5dGVzLiAgTWFya2luZyBjb25uZWN0aW9uIGhlYWx0aHkuXCIpLGEuQWI9ITAsYS5MLkJkKCkpOmEuTCYmMTAyNDA8YS5MLnBiP2EuZihcIkNvbm5lY3Rpb24gZXhjZWVkZWQgaGVhbHRoeSB0aW1lb3V0IGJ1dCBoYXMgc2VudCBcIitcbmEuTC5wYitcIiBieXRlcy4gIExlYXZpbmcgY29ubmVjdGlvbiBhbGl2ZS5cIik6KGEuZihcIkNsb3NpbmcgdW5oZWFsdGh5IGNvbm5lY3Rpb24gYWZ0ZXIgdGltZW91dC5cIiksYS5jbG9zZSgpKSl9LE1hdGguZmxvb3IoYikpKX1mdW5jdGlvbiBuaChhLGIpe3JldHVybiBmdW5jdGlvbihjKXtiPT09YS5MPyhhLkw9bnVsbCxjfHwwIT09YS5VYT8xPT09YS5VYSYmYS5mKFwiUmVhbHRpbWUgY29ubmVjdGlvbiBsb3N0LlwiKTooYS5mKFwiUmVhbHRpbWUgY29ubmVjdGlvbiBmYWlsZWQuXCIpLFwicy1cIj09PWEuSC5PYS5zdWJzdHIoMCwyKSYmKERjLnJlbW92ZShcImhvc3Q6XCIrYS5ILmhvc3QpLGEuSC5PYT1hLkguaG9zdCkpLGEuY2xvc2UoKSk6Yj09PWEuRj8oYS5mKFwiU2Vjb25kYXJ5IGNvbm5lY3Rpb24gbG9zdC5cIiksYz1hLkYsYS5GPW51bGwsYS5mZCE9PWMmJmEuYmQhPT1jfHxhLmNsb3NlKCkpOmEuZihcImNsb3NpbmcgYW4gb2xkIGNvbm5lY3Rpb25cIil9fVxuZnVuY3Rpb24gbWgoYSxiKXtyZXR1cm4gZnVuY3Rpb24oYyl7aWYoMiE9YS5VYSlpZihiPT09YS5iZCl7dmFyIGQ9VmMoXCJ0XCIsYyk7Yz1WYyhcImRcIixjKTtpZihcImNcIj09ZCl7aWYoZD1WYyhcInRcIixjKSxcImRcImluIGMpaWYoYz1jLmQsXCJoXCI9PT1kKXt2YXIgZD1jLnRzLGU9Yy52LGY9Yy5oO2EuVmQ9Yy5zO0ZjKGEuSCxmKTswPT1hLlVhJiYoYS5MLnN0YXJ0KCksb2goYSxhLkwsZCksXCI1XCIhPT1lJiZRKFwiUHJvdG9jb2wgdmVyc2lvbiBtaXNtYXRjaCBkZXRlY3RlZFwiKSxjPWEuTmYsKGM9MTxjLmVkLmxlbmd0aD9jLmVkWzFdOm51bGwpJiZwaChhLGMpKX1lbHNlIGlmKFwiblwiPT09ZCl7YS5mKFwicmVjdmQgZW5kIHRyYW5zbWlzc2lvbiBvbiBwcmltYXJ5XCIpO2EuYmQ9YS5GO2ZvcihjPTA7YzxhLkpkLmxlbmd0aDsrK2MpYS5GZChhLkpkW2NdKTthLkpkPVtdO3FoKGEpfWVsc2VcInNcIj09PWQ/KGEuZihcIkNvbm5lY3Rpb24gc2h1dGRvd24gY29tbWFuZCByZWNlaXZlZC4gU2h1dHRpbmcgZG93bi4uLlwiKSxcbmEuTWUmJihhLk1lKGMpLGEuTWU9bnVsbCksYS5rYT1udWxsLGEuY2xvc2UoKSk6XCJyXCI9PT1kPyhhLmYoXCJSZXNldCBwYWNrZXQgcmVjZWl2ZWQuICBOZXcgaG9zdDogXCIrYyksRmMoYS5ILGMpLDE9PT1hLlVhP2EuY2xvc2UoKToocmgoYSksbGgoYSkpKTpcImVcIj09PWQ/UGMoXCJTZXJ2ZXIgRXJyb3I6IFwiK2MpOlwib1wiPT09ZD8oYS5mKFwiZ290IHBvbmcgb24gcHJpbWFyeS5cIiksc2goYSksdGgoYSkpOlBjKFwiVW5rbm93biBjb250cm9sIHBhY2tldCBjb21tYW5kOiBcIitkKX1lbHNlXCJkXCI9PWQmJmEuRmQoYyl9ZWxzZSBpZihiPT09YS5GKWlmKGQ9VmMoXCJ0XCIsYyksYz1WYyhcImRcIixjKSxcImNcIj09ZClcInRcImluIGMmJihjPWMudCxcImFcIj09PWM/dWgoYSk6XCJyXCI9PT1jPyhhLmYoXCJHb3QgYSByZXNldCBvbiBzZWNvbmRhcnksIGNsb3NpbmcgaXRcIiksYS5GLmNsb3NlKCksYS5mZCE9PWEuRiYmYS5iZCE9PWEuRnx8YS5jbG9zZSgpKTpcIm9cIj09PWMmJihhLmYoXCJnb3QgcG9uZyBvbiBzZWNvbmRhcnkuXCIpLFxuYS5MZi0tLHVoKGEpKSk7ZWxzZSBpZihcImRcIj09ZClhLkpkLnB1c2goYyk7ZWxzZSB0aHJvdyBFcnJvcihcIlVua25vd24gcHJvdG9jb2wgbGF5ZXI6IFwiK2QpO2Vsc2UgYS5mKFwibWVzc2FnZSBvbiBvbGQgY29ubmVjdGlvblwiKX19a2gucHJvdG90eXBlLkRhPWZ1bmN0aW9uKGEpe3ZoKHRoaXMse3Q6XCJkXCIsZDphfSl9O2Z1bmN0aW9uIHFoKGEpe2EuZmQ9PT1hLkYmJmEuYmQ9PT1hLkYmJihhLmYoXCJjbGVhbmluZyB1cCBhbmQgcHJvbW90aW5nIGEgY29ubmVjdGlvbjogXCIrYS5GLnFlKSxhLkw9YS5GLGEuRj1udWxsKX1cbmZ1bmN0aW9uIHVoKGEpezA+PWEuTGY/KGEuZihcIlNlY29uZGFyeSBjb25uZWN0aW9uIGlzIGhlYWx0aHkuXCIpLGEuQWI9ITAsYS5GLkJkKCksYS5GLnN0YXJ0KCksYS5mKFwic2VuZGluZyBjbGllbnQgYWNrIG9uIHNlY29uZGFyeVwiKSxhLkYuc2VuZCh7dDpcImNcIixkOnt0OlwiYVwiLGQ6e319fSksYS5mKFwiRW5kaW5nIHRyYW5zbWlzc2lvbiBvbiBwcmltYXJ5XCIpLGEuTC5zZW5kKHt0OlwiY1wiLGQ6e3Q6XCJuXCIsZDp7fX19KSxhLmZkPWEuRixxaChhKSk6KGEuZihcInNlbmRpbmcgcGluZyBvbiBzZWNvbmRhcnkuXCIpLGEuRi5zZW5kKHt0OlwiY1wiLGQ6e3Q6XCJwXCIsZDp7fX19KSl9a2gucHJvdG90eXBlLkZkPWZ1bmN0aW9uKGEpe3NoKHRoaXMpO3RoaXMuaGMoYSl9O2Z1bmN0aW9uIHNoKGEpe2EuQWJ8fChhLlFlLS0sMD49YS5RZSYmKGEuZihcIlByaW1hcnkgY29ubmVjdGlvbiBpcyBoZWFsdGh5LlwiKSxhLkFiPSEwLGEuTC5CZCgpKSl9XG5mdW5jdGlvbiBwaChhLGIpe2EuRj1uZXcgYihcImM6XCIrYS5pZCtcIjpcIithLmVmKyssYS5ILGEuVmQpO2EuTGY9Yi5yZXNwb25zZXNSZXF1aXJlZFRvQmVIZWFsdGh5fHwwO2EuRi5vcGVuKG1oKGEsYS5GKSxuaChhLGEuRikpO3NldFRpbWVvdXQoZnVuY3Rpb24oKXthLkYmJihhLmYoXCJUaW1lZCBvdXQgdHJ5aW5nIHRvIHVwZ3JhZGUuXCIpLGEuRi5jbG9zZSgpKX0sTWF0aC5mbG9vcig2RTQpKX1mdW5jdGlvbiBvaChhLGIsYyl7YS5mKFwiUmVhbHRpbWUgY29ubmVjdGlvbiBlc3RhYmxpc2hlZC5cIik7YS5MPWI7YS5VYT0xO2EuVmMmJihhLlZjKGMpLGEuVmM9bnVsbCk7MD09PWEuUWU/KGEuZihcIlByaW1hcnkgY29ubmVjdGlvbiBpcyBoZWFsdGh5LlwiKSxhLkFiPSEwKTpzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGgoYSl9LE1hdGguZmxvb3IoNUUzKSl9XG5mdW5jdGlvbiB0aChhKXthLkFifHwxIT09YS5VYXx8KGEuZihcInNlbmRpbmcgcGluZyBvbiBwcmltYXJ5LlwiKSx2aChhLHt0OlwiY1wiLGQ6e3Q6XCJwXCIsZDp7fX19KSl9ZnVuY3Rpb24gdmgoYSxiKXtpZigxIT09YS5VYSl0aHJvd1wiQ29ubmVjdGlvbiBpcyBub3QgY29ubmVjdGVkXCI7YS5mZC5zZW5kKGIpfWtoLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpezIhPT10aGlzLlVhJiYodGhpcy5mKFwiQ2xvc2luZyByZWFsdGltZSBjb25uZWN0aW9uLlwiKSx0aGlzLlVhPTIscmgodGhpcyksdGhpcy5rYSYmKHRoaXMua2EoKSx0aGlzLmthPW51bGwpKX07ZnVuY3Rpb24gcmgoYSl7YS5mKFwiU2h1dHRpbmcgZG93biBhbGwgY29ubmVjdGlvbnNcIik7YS5MJiYoYS5MLmNsb3NlKCksYS5MPW51bGwpO2EuRiYmKGEuRi5jbG9zZSgpLGEuRj1udWxsKTthLnZkJiYoY2xlYXJUaW1lb3V0KGEudmQpLGEudmQ9bnVsbCl9O2Z1bmN0aW9uIHdoKGEsYixjLGQpe3RoaXMuaWQ9eGgrKzt0aGlzLmY9T2MoXCJwOlwiK3RoaXMuaWQrXCI6XCIpO3RoaXMud2Y9dGhpcy5EZT0hMTt0aGlzLmFhPXt9O3RoaXMucGE9W107dGhpcy5YYz0wO3RoaXMuVWM9W107dGhpcy5tYT0hMTt0aGlzLiRhPTFFMzt0aGlzLkNkPTNFNTt0aGlzLkdiPWI7dGhpcy5UYz1jO3RoaXMuTmU9ZDt0aGlzLkg9YTt0aGlzLldlPW51bGw7dGhpcy5RZD17fTt0aGlzLklnPTA7dGhpcy5tZj0hMDt0aGlzLktjPXRoaXMuRmU9bnVsbDt5aCh0aGlzLDApO01mLnViKCkuRWIoXCJ2aXNpYmxlXCIsdGhpcy56Zyx0aGlzKTstMT09PWEuaG9zdC5pbmRleE9mKFwiZmJsb2NhbFwiKSYmTGYudWIoKS5FYihcIm9ubGluZVwiLHRoaXMueGcsdGhpcyl9dmFyIHhoPTAsemg9MDtoPXdoLnByb3RvdHlwZTtcbmguRGE9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPSsrdGhpcy5JZzthPXtyOmQsYTphLGI6Yn07dGhpcy5mKEIoYSkpO0oodGhpcy5tYSxcInNlbmRSZXF1ZXN0IGNhbGwgd2hlbiB3ZSdyZSBub3QgY29ubmVjdGVkIG5vdCBhbGxvd2VkLlwiKTt0aGlzLlNhLkRhKGEpO2MmJih0aGlzLlFkW2RdPWMpfTtoLnhmPWZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPWEud2EoKSxmPWEucGF0aC50b1N0cmluZygpO3RoaXMuZihcIkxpc3RlbiBjYWxsZWQgZm9yIFwiK2YrXCIgXCIrZSk7dGhpcy5hYVtmXT10aGlzLmFhW2ZdfHx7fTtKKCF0aGlzLmFhW2ZdW2VdLFwibGlzdGVuKCkgY2FsbGVkIHR3aWNlIGZvciBzYW1lIHBhdGgvcXVlcnlJZC5cIik7YT17SjpkLHVkOmIsRmc6YSx0YWc6Y307dGhpcy5hYVtmXVtlXT1hO3RoaXMubWEmJkFoKHRoaXMsYSl9O1xuZnVuY3Rpb24gQWgoYSxiKXt2YXIgYz1iLkZnLGQ9Yy5wYXRoLnRvU3RyaW5nKCksZT1jLndhKCk7YS5mKFwiTGlzdGVuIG9uIFwiK2QrXCIgZm9yIFwiK2UpO3ZhciBmPXtwOmR9O2IudGFnJiYoZi5xPWNlKGMubiksZi50PWIudGFnKTtmLmg9Yi51ZCgpO2EuRGEoXCJxXCIsZixmdW5jdGlvbihmKXt2YXIgaz1mLmQsbD1mLnM7aWYoayYmXCJvYmplY3RcIj09PXR5cGVvZiBrJiZ1KGssXCJ3XCIpKXt2YXIgbT13KGssXCJ3XCIpO2VhKG0pJiYwPD1OYShtLFwibm9faW5kZXhcIikmJlEoXCJVc2luZyBhbiB1bnNwZWNpZmllZCBpbmRleC4gQ29uc2lkZXIgYWRkaW5nIFwiKygnXCIuaW5kZXhPblwiOiBcIicrYy5uLmcudG9TdHJpbmcoKSsnXCInKStcIiBhdCBcIitjLnBhdGgudG9TdHJpbmcoKStcIiB0byB5b3VyIHNlY3VyaXR5IHJ1bGVzIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2VcIil9KGEuYWFbZF0mJmEuYWFbZF1bZV0pPT09YiYmKGEuZihcImxpc3RlbiByZXNwb25zZVwiLGYpLFwib2tcIiE9PWwmJkJoKGEsZCxlKSxiLkomJlxuYi5KKGwsaykpfSl9aC5QPWZ1bmN0aW9uKGEsYixjKXt0aGlzLkZhPXtmZzphLG5mOiExLHljOmIsamQ6Y307dGhpcy5mKFwiQXV0aGVudGljYXRpbmcgdXNpbmcgY3JlZGVudGlhbDogXCIrYSk7Q2godGhpcyk7KGI9NDA9PWEubGVuZ3RoKXx8KGE9YWQoYSkuQWMsYj1cIm9iamVjdFwiPT09dHlwZW9mIGEmJiEwPT09dyhhLFwiYWRtaW5cIikpO2ImJih0aGlzLmYoXCJBZG1pbiBhdXRoIGNyZWRlbnRpYWwgZGV0ZWN0ZWQuICBSZWR1Y2luZyBtYXggcmVjb25uZWN0IHRpbWUuXCIpLHRoaXMuQ2Q9M0U0KX07aC5lZT1mdW5jdGlvbihhKXtkZWxldGUgdGhpcy5GYTt0aGlzLm1hJiZ0aGlzLkRhKFwidW5hdXRoXCIse30sZnVuY3Rpb24oYil7YShiLnMsYi5kKX0pfTtcbmZ1bmN0aW9uIENoKGEpe3ZhciBiPWEuRmE7YS5tYSYmYiYmYS5EYShcImF1dGhcIix7Y3JlZDpiLmZnfSxmdW5jdGlvbihjKXt2YXIgZD1jLnM7Yz1jLmR8fFwiZXJyb3JcIjtcIm9rXCIhPT1kJiZhLkZhPT09YiYmZGVsZXRlIGEuRmE7Yi5uZj9cIm9rXCIhPT1kJiZiLmpkJiZiLmpkKGQsYyk6KGIubmY9ITAsYi55YyYmYi55YyhkLGMpKX0pfWguT2Y9ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLnBhdGgudG9TdHJpbmcoKSxkPWEud2EoKTt0aGlzLmYoXCJVbmxpc3RlbiBjYWxsZWQgZm9yIFwiK2MrXCIgXCIrZCk7aWYoQmgodGhpcyxjLGQpJiZ0aGlzLm1hKXt2YXIgZT1jZShhLm4pO3RoaXMuZihcIlVubGlzdGVuIG9uIFwiK2MrXCIgZm9yIFwiK2QpO2M9e3A6Y307YiYmKGMucT1lLGMudD1iKTt0aGlzLkRhKFwiblwiLGMpfX07aC5MZT1mdW5jdGlvbihhLGIsYyl7dGhpcy5tYT9EaCh0aGlzLFwib1wiLGEsYixjKTp0aGlzLlVjLnB1c2goe1pjOmEsYWN0aW9uOlwib1wiLGRhdGE6YixKOmN9KX07XG5oLkJmPWZ1bmN0aW9uKGEsYixjKXt0aGlzLm1hP0RoKHRoaXMsXCJvbVwiLGEsYixjKTp0aGlzLlVjLnB1c2goe1pjOmEsYWN0aW9uOlwib21cIixkYXRhOmIsSjpjfSl9O2guR2Q9ZnVuY3Rpb24oYSxiKXt0aGlzLm1hP0RoKHRoaXMsXCJvY1wiLGEsbnVsbCxiKTp0aGlzLlVjLnB1c2goe1pjOmEsYWN0aW9uOlwib2NcIixkYXRhOm51bGwsSjpifSl9O2Z1bmN0aW9uIERoKGEsYixjLGQsZSl7Yz17cDpjLGQ6ZH07YS5mKFwib25EaXNjb25uZWN0IFwiK2IsYyk7YS5EYShiLGMsZnVuY3Rpb24oYSl7ZSYmc2V0VGltZW91dChmdW5jdGlvbigpe2UoYS5zLGEuZCl9LE1hdGguZmxvb3IoMCkpfSl9aC5wdXQ9ZnVuY3Rpb24oYSxiLGMsZCl7RWgodGhpcyxcInBcIixhLGIsYyxkKX07aC55Zj1mdW5jdGlvbihhLGIsYyxkKXtFaCh0aGlzLFwibVwiLGEsYixjLGQpfTtcbmZ1bmN0aW9uIEVoKGEsYixjLGQsZSxmKXtkPXtwOmMsZDpkfTtuKGYpJiYoZC5oPWYpO2EucGEucHVzaCh7YWN0aW9uOmIsSWY6ZCxKOmV9KTthLlhjKys7Yj1hLnBhLmxlbmd0aC0xO2EubWE/RmgoYSxiKTphLmYoXCJCdWZmZXJpbmcgcHV0OiBcIitjKX1mdW5jdGlvbiBGaChhLGIpe3ZhciBjPWEucGFbYl0uYWN0aW9uLGQ9YS5wYVtiXS5JZixlPWEucGFbYl0uSjthLnBhW2JdLkdnPWEubWE7YS5EYShjLGQsZnVuY3Rpb24oZCl7YS5mKGMrXCIgcmVzcG9uc2VcIixkKTtkZWxldGUgYS5wYVtiXTthLlhjLS07MD09PWEuWGMmJihhLnBhPVtdKTtlJiZlKGQucyxkLmQpfSl9aC5UZT1mdW5jdGlvbihhKXt0aGlzLm1hJiYoYT17YzphfSx0aGlzLmYoXCJyZXBvcnRTdGF0c1wiLGEpLHRoaXMuRGEoXCJzXCIsYSxmdW5jdGlvbihhKXtcIm9rXCIhPT1hLnMmJnRoaXMuZihcInJlcG9ydFN0YXRzXCIsXCJFcnJvciBzZW5kaW5nIHN0YXRzOiBcIithLmQpfSkpfTtcbmguRmQ9ZnVuY3Rpb24oYSl7aWYoXCJyXCJpbiBhKXt0aGlzLmYoXCJmcm9tIHNlcnZlcjogXCIrQihhKSk7dmFyIGI9YS5yLGM9dGhpcy5RZFtiXTtjJiYoZGVsZXRlIHRoaXMuUWRbYl0sYyhhLmIpKX1lbHNle2lmKFwiZXJyb3JcImluIGEpdGhyb3dcIkEgc2VydmVyLXNpZGUgZXJyb3IgaGFzIG9jY3VycmVkOiBcIithLmVycm9yO1wiYVwiaW4gYSYmKGI9YS5hLGM9YS5iLHRoaXMuZihcImhhbmRsZVNlcnZlck1lc3NhZ2VcIixiLGMpLFwiZFwiPT09Yj90aGlzLkdiKGMucCxjLmQsITEsYy50KTpcIm1cIj09PWI/dGhpcy5HYihjLnAsYy5kLCEwLGMudCk6XCJjXCI9PT1iP0doKHRoaXMsYy5wLGMucSk6XCJhY1wiPT09Yj8oYT1jLnMsYj1jLmQsYz10aGlzLkZhLGRlbGV0ZSB0aGlzLkZhLGMmJmMuamQmJmMuamQoYSxiKSk6XCJzZFwiPT09Yj90aGlzLldlP3RoaXMuV2UoYyk6XCJtc2dcImluIGMmJlwidW5kZWZpbmVkXCIhPT10eXBlb2YgY29uc29sZSYmY29uc29sZS5sb2coXCJGSVJFQkFTRTogXCIrYy5tc2cucmVwbGFjZShcIlxcblwiLFxuXCJcXG5GSVJFQkFTRTogXCIpKTpQYyhcIlVucmVjb2duaXplZCBhY3Rpb24gcmVjZWl2ZWQgZnJvbSBzZXJ2ZXI6IFwiK0IoYikrXCJcXG5BcmUgeW91IHVzaW5nIHRoZSBsYXRlc3QgY2xpZW50P1wiKSl9fTtoLlZjPWZ1bmN0aW9uKGEpe3RoaXMuZihcImNvbm5lY3Rpb24gcmVhZHlcIik7dGhpcy5tYT0hMDt0aGlzLktjPShuZXcgRGF0ZSkuZ2V0VGltZSgpO3RoaXMuTmUoe3NlcnZlclRpbWVPZmZzZXQ6YS0obmV3IERhdGUpLmdldFRpbWUoKX0pO3RoaXMubWYmJihhPXt9LGFbXCJzZGsuanMuXCIrXCIyLjIuNFwiLnJlcGxhY2UoL1xcLi9nLFwiLVwiKV09MSxrZygpJiYoYVtcImZyYW1ld29yay5jb3Jkb3ZhXCJdPTEpLHRoaXMuVGUoYSkpO0hoKHRoaXMpO3RoaXMubWY9ITE7dGhpcy5UYyghMCl9O1xuZnVuY3Rpb24geWgoYSxiKXtKKCFhLlNhLFwiU2NoZWR1bGluZyBhIGNvbm5lY3Qgd2hlbiB3ZSdyZSBhbHJlYWR5IGNvbm5lY3RlZC9pbmc/XCIpO2EuU2ImJmNsZWFyVGltZW91dChhLlNiKTthLlNiPXNldFRpbWVvdXQoZnVuY3Rpb24oKXthLlNiPW51bGw7SWgoYSl9LE1hdGguZmxvb3IoYikpfWguemc9ZnVuY3Rpb24oYSl7YSYmIXRoaXMudWMmJnRoaXMuJGE9PT10aGlzLkNkJiYodGhpcy5mKFwiV2luZG93IGJlY2FtZSB2aXNpYmxlLiAgUmVkdWNpbmcgZGVsYXkuXCIpLHRoaXMuJGE9MUUzLHRoaXMuU2F8fHloKHRoaXMsMCkpO3RoaXMudWM9YX07aC54Zz1mdW5jdGlvbihhKXthPyh0aGlzLmYoXCJCcm93c2VyIHdlbnQgb25saW5lLlwiKSx0aGlzLiRhPTFFMyx0aGlzLlNhfHx5aCh0aGlzLDApKToodGhpcy5mKFwiQnJvd3NlciB3ZW50IG9mZmxpbmUuICBLaWxsaW5nIGNvbm5lY3Rpb24uXCIpLHRoaXMuU2EmJnRoaXMuU2EuY2xvc2UoKSl9O1xuaC5DZj1mdW5jdGlvbigpe3RoaXMuZihcImRhdGEgY2xpZW50IGRpc2Nvbm5lY3RlZFwiKTt0aGlzLm1hPSExO3RoaXMuU2E9bnVsbDtmb3IodmFyIGE9MDthPHRoaXMucGEubGVuZ3RoO2ErKyl7dmFyIGI9dGhpcy5wYVthXTtiJiZcImhcImluIGIuSWYmJmIuR2cmJihiLkomJmIuSihcImRpc2Nvbm5lY3RcIiksZGVsZXRlIHRoaXMucGFbYV0sdGhpcy5YYy0tKX0wPT09dGhpcy5YYyYmKHRoaXMucGE9W10pO3RoaXMuUWQ9e307SmgodGhpcykmJih0aGlzLnVjP3RoaXMuS2MmJigzRTQ8KG5ldyBEYXRlKS5nZXRUaW1lKCktdGhpcy5LYyYmKHRoaXMuJGE9MUUzKSx0aGlzLktjPW51bGwpOih0aGlzLmYoXCJXaW5kb3cgaXNuJ3QgdmlzaWJsZS4gIERlbGF5aW5nIHJlY29ubmVjdC5cIiksdGhpcy4kYT10aGlzLkNkLHRoaXMuRmU9KG5ldyBEYXRlKS5nZXRUaW1lKCkpLGE9TWF0aC5tYXgoMCx0aGlzLiRhLSgobmV3IERhdGUpLmdldFRpbWUoKS10aGlzLkZlKSksYSo9TWF0aC5yYW5kb20oKSx0aGlzLmYoXCJUcnlpbmcgdG8gcmVjb25uZWN0IGluIFwiK1xuYStcIm1zXCIpLHloKHRoaXMsYSksdGhpcy4kYT1NYXRoLm1pbih0aGlzLkNkLDEuMyp0aGlzLiRhKSk7dGhpcy5UYyghMSl9O2Z1bmN0aW9uIEloKGEpe2lmKEpoKGEpKXthLmYoXCJNYWtpbmcgYSBjb25uZWN0aW9uIGF0dGVtcHRcIik7YS5GZT0obmV3IERhdGUpLmdldFRpbWUoKTthLktjPW51bGw7dmFyIGI9cShhLkZkLGEpLGM9cShhLlZjLGEpLGQ9cShhLkNmLGEpLGU9YS5pZCtcIjpcIit6aCsrO2EuU2E9bmV3IGtoKGUsYS5ILGIsYyxkLGZ1bmN0aW9uKGIpe1EoYitcIiAoXCIrYS5ILnRvU3RyaW5nKCkrXCIpXCIpO2Eud2Y9ITB9KX19aC55Yj1mdW5jdGlvbigpe3RoaXMuRGU9ITA7dGhpcy5TYT90aGlzLlNhLmNsb3NlKCk6KHRoaXMuU2ImJihjbGVhclRpbWVvdXQodGhpcy5TYiksdGhpcy5TYj1udWxsKSx0aGlzLm1hJiZ0aGlzLkNmKCkpfTtoLnFjPWZ1bmN0aW9uKCl7dGhpcy5EZT0hMTt0aGlzLiRhPTFFMzt0aGlzLlNhfHx5aCh0aGlzLDApfTtcbmZ1bmN0aW9uIEdoKGEsYixjKXtjPWM/UWEoYyxmdW5jdGlvbihhKXtyZXR1cm4gV2MoYSl9KS5qb2luKFwiJFwiKTpcImRlZmF1bHRcIjsoYT1CaChhLGIsYykpJiZhLkomJmEuSihcInBlcm1pc3Npb25fZGVuaWVkXCIpfWZ1bmN0aW9uIEJoKGEsYixjKXtiPShuZXcgSyhiKSkudG9TdHJpbmcoKTt2YXIgZDtuKGEuYWFbYl0pPyhkPWEuYWFbYl1bY10sZGVsZXRlIGEuYWFbYl1bY10sMD09PXBhKGEuYWFbYl0pJiZkZWxldGUgYS5hYVtiXSk6ZD12b2lkIDA7cmV0dXJuIGR9ZnVuY3Rpb24gSGgoYSl7Q2goYSk7cihhLmFhLGZ1bmN0aW9uKGIpe3IoYixmdW5jdGlvbihiKXtBaChhLGIpfSl9KTtmb3IodmFyIGI9MDtiPGEucGEubGVuZ3RoO2IrKylhLnBhW2JdJiZGaChhLGIpO2Zvcig7YS5VYy5sZW5ndGg7KWI9YS5VYy5zaGlmdCgpLERoKGEsYi5hY3Rpb24sYi5aYyxiLmRhdGEsYi5KKX1mdW5jdGlvbiBKaChhKXt2YXIgYjtiPUxmLnViKCkuaWM7cmV0dXJuIWEud2YmJiFhLkRlJiZifTt2YXIgVj17bGc6ZnVuY3Rpb24oKXtWZz1kaD0hMH19O1YuZm9yY2VMb25nUG9sbGluZz1WLmxnO1YubWc9ZnVuY3Rpb24oKXtXZz0hMH07Vi5mb3JjZVdlYlNvY2tldHM9Vi5tZztWLk1nPWZ1bmN0aW9uKGEsYil7YS5rLlJhLldlPWJ9O1Yuc2V0U2VjdXJpdHlEZWJ1Z0NhbGxiYWNrPVYuTWc7Vi5ZZT1mdW5jdGlvbihhLGIpe2Euay5ZZShiKX07Vi5zdGF0cz1WLlllO1YuWmU9ZnVuY3Rpb24oYSxiKXthLmsuWmUoYil9O1Yuc3RhdHNJbmNyZW1lbnRDb3VudGVyPVYuWmU7Vi5wZD1mdW5jdGlvbihhKXtyZXR1cm4gYS5rLnBkfTtWLmRhdGFVcGRhdGVDb3VudD1WLnBkO1YucGc9ZnVuY3Rpb24oYSxiKXthLmsuQ2U9Yn07Vi5pbnRlcmNlcHRTZXJ2ZXJEYXRhPVYucGc7Vi52Zz1mdW5jdGlvbihhKXtuZXcgdWcoYSl9O1Yub25Qb3B1cE9wZW49Vi52ZztWLktnPWZ1bmN0aW9uKGEpe2ZnPWF9O1Yuc2V0QXV0aGVudGljYXRpb25TZXJ2ZXI9Vi5LZztmdW5jdGlvbiBTKGEsYixjKXt0aGlzLkI9YTt0aGlzLlY9Yjt0aGlzLmc9Y31TLnByb3RvdHlwZS5LPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC52YWxcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5LKCl9O1MucHJvdG90eXBlLnZhbD1TLnByb3RvdHlwZS5LO1MucHJvdG90eXBlLmxmPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5leHBvcnRWYWxcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5LKCEwKX07Uy5wcm90b3R5cGUuZXhwb3J0VmFsPVMucHJvdG90eXBlLmxmO1MucHJvdG90eXBlLmtnPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5leGlzdHNcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIXRoaXMuQi5lKCl9O1MucHJvdG90eXBlLmV4aXN0cz1TLnByb3RvdHlwZS5rZztcblMucHJvdG90eXBlLnc9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5jaGlsZFwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtnYShhKSYmKGE9U3RyaW5nKGEpKTtYZihcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5jaGlsZFwiLGEpO3ZhciBiPW5ldyBLKGEpLGM9dGhpcy5WLncoYik7cmV0dXJuIG5ldyBTKHRoaXMuQi5vYShiKSxjLE0pfTtTLnByb3RvdHlwZS5jaGlsZD1TLnByb3RvdHlwZS53O1MucHJvdG90eXBlLkhhPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuaGFzQ2hpbGRcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7WGYoXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuaGFzQ2hpbGRcIixhKTt2YXIgYj1uZXcgSyhhKTtyZXR1cm4hdGhpcy5CLm9hKGIpLmUoKX07Uy5wcm90b3R5cGUuaGFzQ2hpbGQ9Uy5wcm90b3R5cGUuSGE7XG5TLnByb3RvdHlwZS5BPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5nZXRQcmlvcml0eVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5CLkEoKS5LKCl9O1MucHJvdG90eXBlLmdldFByaW9yaXR5PVMucHJvdG90eXBlLkE7Uy5wcm90b3R5cGUuZm9yRWFjaD1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmZvckVhY2hcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7QShcIkZpcmViYXNlLkRhdGFTbmFwc2hvdC5mb3JFYWNoXCIsMSxhLCExKTtpZih0aGlzLkIuTigpKXJldHVybiExO3ZhciBiPXRoaXM7cmV0dXJuISF0aGlzLkIuVSh0aGlzLmcsZnVuY3Rpb24oYyxkKXtyZXR1cm4gYShuZXcgUyhkLGIuVi53KGMpLE0pKX0pfTtTLnByb3RvdHlwZS5mb3JFYWNoPVMucHJvdG90eXBlLmZvckVhY2g7XG5TLnByb3RvdHlwZS50ZD1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5EYXRhU25hcHNob3QuaGFzQ2hpbGRyZW5cIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMuQi5OKCk/ITE6IXRoaXMuQi5lKCl9O1MucHJvdG90eXBlLmhhc0NoaWxkcmVuPVMucHJvdG90eXBlLnRkO1MucHJvdG90eXBlLm5hbWU9ZnVuY3Rpb24oKXtRKFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lm5hbWUoKSBiZWluZyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIEZpcmViYXNlLkRhdGFTbmFwc2hvdC5rZXkoKSBpbnN0ZWFkLlwiKTt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lm5hbWVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7cmV0dXJuIHRoaXMua2V5KCl9O1MucHJvdG90eXBlLm5hbWU9Uy5wcm90b3R5cGUubmFtZTtTLnByb3RvdHlwZS5rZXk9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LmtleVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5WLmtleSgpfTtcblMucHJvdG90eXBlLmtleT1TLnByb3RvdHlwZS5rZXk7Uy5wcm90b3R5cGUuRGI9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90Lm51bUNoaWxkcmVuXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLkIuRGIoKX07Uy5wcm90b3R5cGUubnVtQ2hpbGRyZW49Uy5wcm90b3R5cGUuRGI7Uy5wcm90b3R5cGUubGM9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuRGF0YVNuYXBzaG90LnJlZlwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5WfTtTLnByb3RvdHlwZS5yZWY9Uy5wcm90b3R5cGUubGM7ZnVuY3Rpb24gS2goYSxiKXt0aGlzLkg9YTt0aGlzLlZhPU9iKGEpO3RoaXMuZWE9bmV3IHViO3RoaXMuRWQ9MTt0aGlzLlJhPW51bGw7Ynx8MDw9KFwib2JqZWN0XCI9PT10eXBlb2Ygd2luZG93JiZ3aW5kb3cubmF2aWdhdG9yJiZ3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudHx8XCJcIikuc2VhcmNoKC9nb29nbGVib3R8Z29vZ2xlIHdlYm1hc3RlciB0b29sc3xiaW5nYm90fHlhaG9vISBzbHVycHxiYWlkdXNwaWRlcnx5YW5kZXhib3R8ZHVja2R1Y2tib3QvaSk/KHRoaXMuY2E9bmV3IEFlKHRoaXMuSCxxKHRoaXMuR2IsdGhpcykpLHNldFRpbWVvdXQocSh0aGlzLlRjLHRoaXMsITApLDApKTp0aGlzLmNhPXRoaXMuUmE9bmV3IHdoKHRoaXMuSCxxKHRoaXMuR2IsdGhpcykscSh0aGlzLlRjLHRoaXMpLHEodGhpcy5OZSx0aGlzKSk7dGhpcy5QZz1QYihhLHEoZnVuY3Rpb24oKXtyZXR1cm4gbmV3IEpiKHRoaXMuVmEsdGhpcy5jYSl9LHRoaXMpKTt0aGlzLnRjPW5ldyBDZjt0aGlzLkJlPVxubmV3IG5iO3ZhciBjPXRoaXM7dGhpcy56ZD1uZXcgZ2Yoe1hlOmZ1bmN0aW9uKGEsYixmLGcpe2I9W107Zj1jLkJlLmooYS5wYXRoKTtmLmUoKXx8KGI9amYoYy56ZCxuZXcgVWIoemUsYS5wYXRoLGYpKSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZyhcIm9rXCIpfSwwKSk7cmV0dXJuIGJ9LFpkOmJhfSk7TGgodGhpcyxcImNvbm5lY3RlZFwiLCExKTt0aGlzLmthPW5ldyBxYzt0aGlzLlA9bmV3IEVnKGEscSh0aGlzLmNhLlAsdGhpcy5jYSkscSh0aGlzLmNhLmVlLHRoaXMuY2EpLHEodGhpcy5LZSx0aGlzKSk7dGhpcy5wZD0wO3RoaXMuQ2U9bnVsbDt0aGlzLk89bmV3IGdmKHtYZTpmdW5jdGlvbihhLGIsZixnKXtjLmNhLnhmKGEsZixiLGZ1bmN0aW9uKGIsZSl7dmFyIGY9ZyhiLGUpO3piKGMuZWEsYS5wYXRoLGYpfSk7cmV0dXJuW119LFpkOmZ1bmN0aW9uKGEsYil7Yy5jYS5PZihhLGIpfX0pfWg9S2gucHJvdG90eXBlO1xuaC50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybih0aGlzLkgubGI/XCJodHRwczovL1wiOlwiaHR0cDovL1wiKSt0aGlzLkguaG9zdH07aC5uYW1lPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuSC5DYn07ZnVuY3Rpb24gTWgoYSl7YT1hLkJlLmoobmV3IEsoXCIuaW5mby9zZXJ2ZXJUaW1lT2Zmc2V0XCIpKS5LKCl8fDA7cmV0dXJuKG5ldyBEYXRlKS5nZXRUaW1lKCkrYX1mdW5jdGlvbiBOaChhKXthPWE9e3RpbWVzdGFtcDpNaChhKX07YS50aW1lc3RhbXA9YS50aW1lc3RhbXB8fChuZXcgRGF0ZSkuZ2V0VGltZSgpO3JldHVybiBhfVxuaC5HYj1mdW5jdGlvbihhLGIsYyxkKXt0aGlzLnBkKys7dmFyIGU9bmV3IEsoYSk7Yj10aGlzLkNlP3RoaXMuQ2UoYSxiKTpiO2E9W107ZD9jPyhiPW5hKGIsZnVuY3Rpb24oYSl7cmV0dXJuIEwoYSl9KSxhPXJmKHRoaXMuTyxlLGIsZCkpOihiPUwoYiksYT1uZih0aGlzLk8sZSxiLGQpKTpjPyhkPW5hKGIsZnVuY3Rpb24oYSl7cmV0dXJuIEwoYSl9KSxhPW1mKHRoaXMuTyxlLGQpKTooZD1MKGIpLGE9amYodGhpcy5PLG5ldyBVYih6ZSxlLGQpKSk7ZD1lOzA8YS5sZW5ndGgmJihkPU9oKHRoaXMsZSkpO3piKHRoaXMuZWEsZCxhKX07aC5UYz1mdW5jdGlvbihhKXtMaCh0aGlzLFwiY29ubmVjdGVkXCIsYSk7ITE9PT1hJiZQaCh0aGlzKX07aC5OZT1mdW5jdGlvbihhKXt2YXIgYj10aGlzO1ljKGEsZnVuY3Rpb24oYSxkKXtMaChiLGQsYSl9KX07aC5LZT1mdW5jdGlvbihhKXtMaCh0aGlzLFwiYXV0aGVudGljYXRlZFwiLGEpfTtcbmZ1bmN0aW9uIExoKGEsYixjKXtiPW5ldyBLKFwiLy5pbmZvL1wiK2IpO2M9TChjKTt2YXIgZD1hLkJlO2QuU2Q9ZC5TZC5HKGIsYyk7Yz1qZihhLnpkLG5ldyBVYih6ZSxiLGMpKTt6YihhLmVhLGIsYyl9aC5LYj1mdW5jdGlvbihhLGIsYyxkKXt0aGlzLmYoXCJzZXRcIix7cGF0aDphLnRvU3RyaW5nKCksdmFsdWU6YixYZzpjfSk7dmFyIGU9TmgodGhpcyk7Yj1MKGIsYyk7dmFyIGU9c2MoYixlKSxmPXRoaXMuRWQrKyxlPWhmKHRoaXMuTyxhLGUsZiwhMCk7dmIodGhpcy5lYSxlKTt2YXIgZz10aGlzO3RoaXMuY2EucHV0KGEudG9TdHJpbmcoKSxiLksoITApLGZ1bmN0aW9uKGIsYyl7dmFyIGU9XCJva1wiPT09YjtlfHxRKFwic2V0IGF0IFwiK2ErXCIgZmFpbGVkOiBcIitiKTtlPWxmKGcuTyxmLCFlKTt6YihnLmVhLGEsZSk7UWgoZCxiLGMpfSk7ZT1SaCh0aGlzLGEpO09oKHRoaXMsZSk7emIodGhpcy5lYSxlLFtdKX07XG5oLnVwZGF0ZT1mdW5jdGlvbihhLGIsYyl7dGhpcy5mKFwidXBkYXRlXCIse3BhdGg6YS50b1N0cmluZygpLHZhbHVlOmJ9KTt2YXIgZD0hMCxlPU5oKHRoaXMpLGY9e307cihiLGZ1bmN0aW9uKGEsYil7ZD0hMTt2YXIgYz1MKGEpO2ZbYl09c2MoYyxlKX0pO2lmKGQpQmIoXCJ1cGRhdGUoKSBjYWxsZWQgd2l0aCBlbXB0eSBkYXRhLiAgRG9uJ3QgZG8gYW55dGhpbmcuXCIpLFFoKGMsXCJva1wiKTtlbHNle3ZhciBnPXRoaXMuRWQrKyxrPWtmKHRoaXMuTyxhLGYsZyk7dmIodGhpcy5lYSxrKTt2YXIgbD10aGlzO3RoaXMuY2EueWYoYS50b1N0cmluZygpLGIsZnVuY3Rpb24oYixkKXt2YXIgZT1cIm9rXCI9PT1iO2V8fFEoXCJ1cGRhdGUgYXQgXCIrYStcIiBmYWlsZWQ6IFwiK2IpO3ZhciBlPWxmKGwuTyxnLCFlKSxmPWE7MDxlLmxlbmd0aCYmKGY9T2gobCxhKSk7emIobC5lYSxmLGUpO1FoKGMsYixkKX0pO2I9UmgodGhpcyxhKTtPaCh0aGlzLGIpO3piKHRoaXMuZWEsYSxbXSl9fTtcbmZ1bmN0aW9uIFBoKGEpe2EuZihcIm9uRGlzY29ubmVjdEV2ZW50c1wiKTt2YXIgYj1OaChhKSxjPVtdO3JjKHBjKGEua2EsYiksRixmdW5jdGlvbihiLGUpe2M9Yy5jb25jYXQoamYoYS5PLG5ldyBVYih6ZSxiLGUpKSk7dmFyIGY9UmgoYSxiKTtPaChhLGYpfSk7YS5rYT1uZXcgcWM7emIoYS5lYSxGLGMpfWguR2Q9ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzO3RoaXMuY2EuR2QoYS50b1N0cmluZygpLGZ1bmN0aW9uKGQsZSl7XCJva1wiPT09ZCYmZWcoYy5rYSxhKTtRaChiLGQsZSl9KX07ZnVuY3Rpb24gU2goYSxiLGMsZCl7dmFyIGU9TChjKTthLmNhLkxlKGIudG9TdHJpbmcoKSxlLksoITApLGZ1bmN0aW9uKGMsZyl7XCJva1wiPT09YyYmYS5rYS5tYyhiLGUpO1FoKGQsYyxnKX0pfWZ1bmN0aW9uIFRoKGEsYixjLGQsZSl7dmFyIGY9TChjLGQpO2EuY2EuTGUoYi50b1N0cmluZygpLGYuSyghMCksZnVuY3Rpb24oYyxkKXtcIm9rXCI9PT1jJiZhLmthLm1jKGIsZik7UWgoZSxjLGQpfSl9XG5mdW5jdGlvbiBVaChhLGIsYyxkKXt2YXIgZT0hMCxmO2ZvcihmIGluIGMpZT0hMTtlPyhCYihcIm9uRGlzY29ubmVjdCgpLnVwZGF0ZSgpIGNhbGxlZCB3aXRoIGVtcHR5IGRhdGEuICBEb24ndCBkbyBhbnl0aGluZy5cIiksUWgoZCxcIm9rXCIpKTphLmNhLkJmKGIudG9TdHJpbmcoKSxjLGZ1bmN0aW9uKGUsZil7aWYoXCJva1wiPT09ZSlmb3IodmFyIGwgaW4gYyl7dmFyIG09TChjW2xdKTthLmthLm1jKGIudyhsKSxtKX1RaChkLGUsZil9KX1mdW5jdGlvbiBWaChhLGIsYyl7Yz1cIi5pbmZvXCI9PT1PKGIucGF0aCk/YS56ZC5PYihiLGMpOmEuTy5PYihiLGMpO3hiKGEuZWEsYi5wYXRoLGMpfWgueWI9ZnVuY3Rpb24oKXt0aGlzLlJhJiZ0aGlzLlJhLnliKCl9O2gucWM9ZnVuY3Rpb24oKXt0aGlzLlJhJiZ0aGlzLlJhLnFjKCl9O1xuaC5ZZT1mdW5jdGlvbihhKXtpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUpe2E/KHRoaXMuWWR8fCh0aGlzLllkPW5ldyBJYih0aGlzLlZhKSksYT10aGlzLllkLmdldCgpKTphPXRoaXMuVmEuZ2V0KCk7dmFyIGI9UmEoc2EoYSksZnVuY3Rpb24oYSxiKXtyZXR1cm4gTWF0aC5tYXgoYi5sZW5ndGgsYSl9LDApLGM7Zm9yKGMgaW4gYSl7Zm9yKHZhciBkPWFbY10sZT1jLmxlbmd0aDtlPGIrMjtlKyspYys9XCIgXCI7Y29uc29sZS5sb2coYytkKX19fTtoLlplPWZ1bmN0aW9uKGEpe0xiKHRoaXMuVmEsYSk7dGhpcy5QZy5NZlthXT0hMH07aC5mPWZ1bmN0aW9uKGEpe3ZhciBiPVwiXCI7dGhpcy5SYSYmKGI9dGhpcy5SYS5pZCtcIjpcIik7QmIoYixhcmd1bWVudHMpfTtcbmZ1bmN0aW9uIFFoKGEsYixjKXthJiZDYihmdW5jdGlvbigpe2lmKFwib2tcIj09YilhKG51bGwpO2Vsc2V7dmFyIGQ9KGJ8fFwiZXJyb3JcIikudG9VcHBlckNhc2UoKSxlPWQ7YyYmKGUrPVwiOiBcIitjKTtlPUVycm9yKGUpO2UuY29kZT1kO2EoZSl9fSl9O2Z1bmN0aW9uIFdoKGEsYixjLGQsZSl7ZnVuY3Rpb24gZigpe31hLmYoXCJ0cmFuc2FjdGlvbiBvbiBcIitiKTt2YXIgZz1uZXcgVShhLGIpO2cuRWIoXCJ2YWx1ZVwiLGYpO2M9e3BhdGg6Yix1cGRhdGU6YyxKOmQsc3RhdHVzOm51bGwsRWY6R2MoKSxjZjplLEtmOjAsZ2U6ZnVuY3Rpb24oKXtnLmdjKFwidmFsdWVcIixmKX0samU6bnVsbCxBYTpudWxsLG1kOm51bGwsbmQ6bnVsbCxvZDpudWxsfTtkPWEuTy51YShiLHZvaWQgMCl8fEM7Yy5tZD1kO2Q9Yy51cGRhdGUoZC5LKCkpO2lmKG4oZCkpe1NmKFwidHJhbnNhY3Rpb24gZmFpbGVkOiBEYXRhIHJldHVybmVkIFwiLGQsYy5wYXRoKTtjLnN0YXR1cz0xO2U9RGYoYS50YyxiKTt2YXIgaz1lLkJhKCl8fFtdO2sucHVzaChjKTtFZihlLGspO1wib2JqZWN0XCI9PT10eXBlb2YgZCYmbnVsbCE9PWQmJnUoZCxcIi5wcmlvcml0eVwiKT8oaz13KGQsXCIucHJpb3JpdHlcIiksSihRZihrKSxcIkludmFsaWQgcHJpb3JpdHkgcmV0dXJuZWQgYnkgdHJhbnNhY3Rpb24uIFByaW9yaXR5IG11c3QgYmUgYSB2YWxpZCBzdHJpbmcsIGZpbml0ZSBudW1iZXIsIHNlcnZlciB2YWx1ZSwgb3IgbnVsbC5cIikpOlxuaz0oYS5PLnVhKGIpfHxDKS5BKCkuSygpO2U9TmgoYSk7ZD1MKGQsayk7ZT1zYyhkLGUpO2MubmQ9ZDtjLm9kPWU7Yy5BYT1hLkVkKys7Yz1oZihhLk8sYixlLGMuQWEsYy5jZik7emIoYS5lYSxiLGMpO1hoKGEpfWVsc2UgYy5nZSgpLGMubmQ9bnVsbCxjLm9kPW51bGwsYy5KJiYoYT1uZXcgUyhjLm1kLG5ldyBVKGEsYy5wYXRoKSxNKSxjLkoobnVsbCwhMSxhKSl9ZnVuY3Rpb24gWGgoYSxiKXt2YXIgYz1ifHxhLnRjO2J8fFloKGEsYyk7aWYobnVsbCE9PWMuQmEoKSl7dmFyIGQ9WmgoYSxjKTtKKDA8ZC5sZW5ndGgsXCJTZW5kaW5nIHplcm8gbGVuZ3RoIHRyYW5zYWN0aW9uIHF1ZXVlXCIpO1NhKGQsZnVuY3Rpb24oYSl7cmV0dXJuIDE9PT1hLnN0YXR1c30pJiYkaChhLGMucGF0aCgpLGQpfWVsc2UgYy50ZCgpJiZjLlUoZnVuY3Rpb24oYil7WGgoYSxiKX0pfVxuZnVuY3Rpb24gJGgoYSxiLGMpe2Zvcih2YXIgZD1RYShjLGZ1bmN0aW9uKGEpe3JldHVybiBhLkFhfSksZT1hLk8udWEoYixkKXx8QyxkPWUsZT1lLmhhc2goKSxmPTA7ZjxjLmxlbmd0aDtmKyspe3ZhciBnPWNbZl07SigxPT09Zy5zdGF0dXMsXCJ0cnlUb1NlbmRUcmFuc2FjdGlvblF1ZXVlXzogaXRlbXMgaW4gcXVldWUgc2hvdWxkIGFsbCBiZSBydW4uXCIpO2cuc3RhdHVzPTI7Zy5LZisrO3ZhciBrPU4oYixnLnBhdGgpLGQ9ZC5HKGssZy5uZCl9ZD1kLksoITApO2EuY2EucHV0KGIudG9TdHJpbmcoKSxkLGZ1bmN0aW9uKGQpe2EuZihcInRyYW5zYWN0aW9uIHB1dCByZXNwb25zZVwiLHtwYXRoOmIudG9TdHJpbmcoKSxzdGF0dXM6ZH0pO3ZhciBlPVtdO2lmKFwib2tcIj09PWQpe2Q9W107Zm9yKGY9MDtmPGMubGVuZ3RoO2YrKyl7Y1tmXS5zdGF0dXM9MztlPWUuY29uY2F0KGxmKGEuTyxjW2ZdLkFhKSk7aWYoY1tmXS5KKXt2YXIgZz1jW2ZdLm9kLGs9bmV3IFUoYSxjW2ZdLnBhdGgpO2QucHVzaChxKGNbZl0uSixcbm51bGwsbnVsbCwhMCxuZXcgUyhnLGssTSkpKX1jW2ZdLmdlKCl9WWgoYSxEZihhLnRjLGIpKTtYaChhKTt6YihhLmVhLGIsZSk7Zm9yKGY9MDtmPGQubGVuZ3RoO2YrKylDYihkW2ZdKX1lbHNle2lmKFwiZGF0YXN0YWxlXCI9PT1kKWZvcihmPTA7ZjxjLmxlbmd0aDtmKyspY1tmXS5zdGF0dXM9ND09PWNbZl0uc3RhdHVzPzU6MTtlbHNlIGZvcihRKFwidHJhbnNhY3Rpb24gYXQgXCIrYi50b1N0cmluZygpK1wiIGZhaWxlZDogXCIrZCksZj0wO2Y8Yy5sZW5ndGg7ZisrKWNbZl0uc3RhdHVzPTUsY1tmXS5qZT1kO09oKGEsYil9fSxlKX1mdW5jdGlvbiBPaChhLGIpe3ZhciBjPWFpKGEsYiksZD1jLnBhdGgoKSxjPVpoKGEsYyk7YmkoYSxjLGQpO3JldHVybiBkfVxuZnVuY3Rpb24gYmkoYSxiLGMpe2lmKDAhPT1iLmxlbmd0aCl7Zm9yKHZhciBkPVtdLGU9W10sZj1RYShiLGZ1bmN0aW9uKGEpe3JldHVybiBhLkFhfSksZz0wO2c8Yi5sZW5ndGg7ZysrKXt2YXIgaz1iW2ddLGw9TihjLGsucGF0aCksbT0hMSx2O0oobnVsbCE9PWwsXCJyZXJ1blRyYW5zYWN0aW9uc1VuZGVyTm9kZV86IHJlbGF0aXZlUGF0aCBzaG91bGQgbm90IGJlIG51bGwuXCIpO2lmKDU9PT1rLnN0YXR1cyltPSEwLHY9ay5qZSxlPWUuY29uY2F0KGxmKGEuTyxrLkFhLCEwKSk7ZWxzZSBpZigxPT09ay5zdGF0dXMpaWYoMjU8PWsuS2YpbT0hMCx2PVwibWF4cmV0cnlcIixlPWUuY29uY2F0KGxmKGEuTyxrLkFhLCEwKSk7ZWxzZXt2YXIgeT1hLk8udWEoay5wYXRoLGYpfHxDO2subWQ9eTt2YXIgST1iW2ddLnVwZGF0ZSh5LksoKSk7bihJKT8oU2YoXCJ0cmFuc2FjdGlvbiBmYWlsZWQ6IERhdGEgcmV0dXJuZWQgXCIsSSxrLnBhdGgpLGw9TChJKSxcIm9iamVjdFwiPT09dHlwZW9mIEkmJm51bGwhPVxuSSYmdShJLFwiLnByaW9yaXR5XCIpfHwobD1sLmRhKHkuQSgpKSkseT1rLkFhLEk9TmgoYSksST1zYyhsLEkpLGsubmQ9bCxrLm9kPUksay5BYT1hLkVkKyssVmEoZix5KSxlPWUuY29uY2F0KGhmKGEuTyxrLnBhdGgsSSxrLkFhLGsuY2YpKSxlPWUuY29uY2F0KGxmKGEuTyx5LCEwKSkpOihtPSEwLHY9XCJub2RhdGFcIixlPWUuY29uY2F0KGxmKGEuTyxrLkFhLCEwKSkpfXpiKGEuZWEsYyxlKTtlPVtdO20mJihiW2ddLnN0YXR1cz0zLHNldFRpbWVvdXQoYltnXS5nZSxNYXRoLmZsb29yKDApKSxiW2ddLkomJihcIm5vZGF0YVwiPT09dj8oaz1uZXcgVShhLGJbZ10ucGF0aCksZC5wdXNoKHEoYltnXS5KLG51bGwsbnVsbCwhMSxuZXcgUyhiW2ddLm1kLGssTSkpKSk6ZC5wdXNoKHEoYltnXS5KLG51bGwsRXJyb3IodiksITEsbnVsbCkpKSl9WWgoYSxhLnRjKTtmb3IoZz0wO2c8ZC5sZW5ndGg7ZysrKUNiKGRbZ10pO1hoKGEpfX1cbmZ1bmN0aW9uIGFpKGEsYil7Zm9yKHZhciBjLGQ9YS50YztudWxsIT09KGM9TyhiKSkmJm51bGw9PT1kLkJhKCk7KWQ9RGYoZCxjKSxiPUcoYik7cmV0dXJuIGR9ZnVuY3Rpb24gWmgoYSxiKXt2YXIgYz1bXTtjaShhLGIsYyk7Yy5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEuRWYtYi5FZn0pO3JldHVybiBjfWZ1bmN0aW9uIGNpKGEsYixjKXt2YXIgZD1iLkJhKCk7aWYobnVsbCE9PWQpZm9yKHZhciBlPTA7ZTxkLmxlbmd0aDtlKyspYy5wdXNoKGRbZV0pO2IuVShmdW5jdGlvbihiKXtjaShhLGIsYyl9KX1mdW5jdGlvbiBZaChhLGIpe3ZhciBjPWIuQmEoKTtpZihjKXtmb3IodmFyIGQ9MCxlPTA7ZTxjLmxlbmd0aDtlKyspMyE9PWNbZV0uc3RhdHVzJiYoY1tkXT1jW2VdLGQrKyk7Yy5sZW5ndGg9ZDtFZihiLDA8Yy5sZW5ndGg/YzpudWxsKX1iLlUoZnVuY3Rpb24oYil7WWgoYSxiKX0pfVxuZnVuY3Rpb24gUmgoYSxiKXt2YXIgYz1haShhLGIpLnBhdGgoKSxkPURmKGEudGMsYik7SGYoZCxmdW5jdGlvbihiKXtkaShhLGIpfSk7ZGkoYSxkKTtHZihkLGZ1bmN0aW9uKGIpe2RpKGEsYil9KTtyZXR1cm4gY31cbmZ1bmN0aW9uIGRpKGEsYil7dmFyIGM9Yi5CYSgpO2lmKG51bGwhPT1jKXtmb3IodmFyIGQ9W10sZT1bXSxmPS0xLGc9MDtnPGMubGVuZ3RoO2crKyk0IT09Y1tnXS5zdGF0dXMmJigyPT09Y1tnXS5zdGF0dXM/KEooZj09PWctMSxcIkFsbCBTRU5UIGl0ZW1zIHNob3VsZCBiZSBhdCBiZWdpbm5pbmcgb2YgcXVldWUuXCIpLGY9ZyxjW2ddLnN0YXR1cz00LGNbZ10uamU9XCJzZXRcIik6KEooMT09PWNbZ10uc3RhdHVzLFwiVW5leHBlY3RlZCB0cmFuc2FjdGlvbiBzdGF0dXMgaW4gYWJvcnRcIiksY1tnXS5nZSgpLGU9ZS5jb25jYXQobGYoYS5PLGNbZ10uQWEsITApKSxjW2ddLkomJmQucHVzaChxKGNbZ10uSixudWxsLEVycm9yKFwic2V0XCIpLCExLG51bGwpKSkpOy0xPT09Zj9FZihiLG51bGwpOmMubGVuZ3RoPWYrMTt6YihhLmVhLGIucGF0aCgpLGUpO2ZvcihnPTA7ZzxkLmxlbmd0aDtnKyspQ2IoZFtnXSl9fTtmdW5jdGlvbiBXKCl7dGhpcy5uYz17fTt0aGlzLlBmPSExfWNhKFcpO1cucHJvdG90eXBlLnliPWZ1bmN0aW9uKCl7Zm9yKHZhciBhIGluIHRoaXMubmMpdGhpcy5uY1thXS55YigpfTtXLnByb3RvdHlwZS5pbnRlcnJ1cHQ9Vy5wcm90b3R5cGUueWI7Vy5wcm90b3R5cGUucWM9ZnVuY3Rpb24oKXtmb3IodmFyIGEgaW4gdGhpcy5uYyl0aGlzLm5jW2FdLnFjKCl9O1cucHJvdG90eXBlLnJlc3VtZT1XLnByb3RvdHlwZS5xYztXLnByb3RvdHlwZS51ZT1mdW5jdGlvbigpe3RoaXMuUGY9ITB9O2Z1bmN0aW9uIFgoYSxiKXt0aGlzLmFkPWE7dGhpcy5xYT1ifVgucHJvdG90eXBlLmNhbmNlbD1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuY2FuY2VsXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5jYW5jZWxcIiwxLGEsITApO3RoaXMuYWQuR2QodGhpcy5xYSxhfHxudWxsKX07WC5wcm90b3R5cGUuY2FuY2VsPVgucHJvdG90eXBlLmNhbmNlbDtYLnByb3RvdHlwZS5yZW1vdmU9ZnVuY3Rpb24oYSl7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnJlbW92ZVwiLDAsMSxhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnJlbW92ZVwiLHRoaXMucWEpO0EoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5yZW1vdmVcIiwxLGEsITApO1NoKHRoaXMuYWQsdGhpcy5xYSxudWxsLGEpfTtYLnByb3RvdHlwZS5yZW1vdmU9WC5wcm90b3R5cGUucmVtb3ZlO1xuWC5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnNldFwiLHRoaXMucWEpO1JmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsYSx0aGlzLnFhLCExKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0XCIsMixiLCEwKTtTaCh0aGlzLmFkLHRoaXMucWEsYSxiKX07WC5wcm90b3R5cGUuc2V0PVgucHJvdG90eXBlLnNldDtcblgucHJvdG90eXBlLktiPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsdGhpcy5xYSk7UmYoXCJGaXJlYmFzZS5vbkRpc2Nvbm5lY3QoKS5zZXRXaXRoUHJpb3JpdHlcIixhLHRoaXMucWEsITEpO1VmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsMixiKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkuc2V0V2l0aFByaW9yaXR5XCIsMyxjLCEwKTtUaCh0aGlzLmFkLHRoaXMucWEsYSxiLGMpfTtYLnByb3RvdHlwZS5zZXRXaXRoUHJpb3JpdHk9WC5wcm90b3R5cGUuS2I7XG5YLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlXCIsdGhpcy5xYSk7aWYoZWEoYSkpe2Zvcih2YXIgYz17fSxkPTA7ZDxhLmxlbmd0aDsrK2QpY1tcIlwiK2RdPWFbZF07YT1jO1EoXCJQYXNzaW5nIGFuIEFycmF5IHRvIEZpcmViYXNlLm9uRGlzY29ubmVjdCgpLnVwZGF0ZSgpIGlzIGRlcHJlY2F0ZWQuIFVzZSBzZXQoKSBpZiB5b3Ugd2FudCB0byBvdmVyd3JpdGUgdGhlIGV4aXN0aW5nIGRhdGEsIG9yIGFuIE9iamVjdCB3aXRoIGludGVnZXIga2V5cyBpZiB5b3UgcmVhbGx5IGRvIHdhbnQgdG8gb25seSB1cGRhdGUgc29tZSBvZiB0aGUgY2hpbGRyZW4uXCIpfVRmKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlXCIsYSx0aGlzLnFhKTtBKFwiRmlyZWJhc2Uub25EaXNjb25uZWN0KCkudXBkYXRlXCIsMixiLCEwKTtcblVoKHRoaXMuYWQsdGhpcy5xYSxhLGIpfTtYLnByb3RvdHlwZS51cGRhdGU9WC5wcm90b3R5cGUudXBkYXRlO2Z1bmN0aW9uIFkoYSxiLGMsZCl7dGhpcy5rPWE7dGhpcy5wYXRoPWI7dGhpcy5uPWM7dGhpcy5qYz1kfVxuZnVuY3Rpb24gZWkoYSl7dmFyIGI9bnVsbCxjPW51bGw7YS5sYSYmKGI9b2QoYSkpO2EubmEmJihjPXFkKGEpKTtpZihhLmc9PT1WZCl7aWYoYS5sYSl7aWYoXCJbTUlOX05BTUVdXCIhPW5kKGEpKXRocm93IEVycm9yKFwiUXVlcnk6IFdoZW4gb3JkZXJpbmcgYnkga2V5LCB5b3UgbWF5IG9ubHkgcGFzcyBvbmUgYXJndW1lbnQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLCBvciBlcXVhbFRvKCkuXCIpO2lmKFwic3RyaW5nXCIhPT10eXBlb2YgYil0aHJvdyBFcnJvcihcIlF1ZXJ5OiBXaGVuIG9yZGVyaW5nIGJ5IGtleSwgdGhlIGFyZ3VtZW50IHBhc3NlZCB0byBzdGFydEF0KCksIGVuZEF0KCksb3IgZXF1YWxUbygpIG11c3QgYmUgYSBzdHJpbmcuXCIpO31pZihhLm5hKXtpZihcIltNQVhfTkFNRV1cIiE9cGQoYSkpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBrZXksIHlvdSBtYXkgb25seSBwYXNzIG9uZSBhcmd1bWVudCB0byBzdGFydEF0KCksIGVuZEF0KCksIG9yIGVxdWFsVG8oKS5cIik7aWYoXCJzdHJpbmdcIiE9PVxudHlwZW9mIGMpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBrZXksIHRoZSBhcmd1bWVudCBwYXNzZWQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLG9yIGVxdWFsVG8oKSBtdXN0IGJlIGEgc3RyaW5nLlwiKTt9fWVsc2UgaWYoYS5nPT09TSl7aWYobnVsbCE9YiYmIVFmKGIpfHxudWxsIT1jJiYhUWYoYykpdGhyb3cgRXJyb3IoXCJRdWVyeTogV2hlbiBvcmRlcmluZyBieSBwcmlvcml0eSwgdGhlIGZpcnN0IGFyZ3VtZW50IHBhc3NlZCB0byBzdGFydEF0KCksIGVuZEF0KCksIG9yIGVxdWFsVG8oKSBtdXN0IGJlIGEgdmFsaWQgcHJpb3JpdHkgdmFsdWUgKG51bGwsIGEgbnVtYmVyLCBvciBhIHN0cmluZykuXCIpO31lbHNlIGlmKEooYS5nIGluc3RhbmNlb2YgUmR8fGEuZz09PVlkLFwidW5rbm93biBpbmRleCB0eXBlLlwiKSxudWxsIT1iJiZcIm9iamVjdFwiPT09dHlwZW9mIGJ8fG51bGwhPWMmJlwib2JqZWN0XCI9PT10eXBlb2YgYyl0aHJvdyBFcnJvcihcIlF1ZXJ5OiBGaXJzdCBhcmd1bWVudCBwYXNzZWQgdG8gc3RhcnRBdCgpLCBlbmRBdCgpLCBvciBlcXVhbFRvKCkgY2Fubm90IGJlIGFuIG9iamVjdC5cIik7XG59ZnVuY3Rpb24gZmkoYSl7aWYoYS5sYSYmYS5uYSYmYS5pYSYmKCFhLmlhfHxcIlwiPT09YS5OYikpdGhyb3cgRXJyb3IoXCJRdWVyeTogQ2FuJ3QgY29tYmluZSBzdGFydEF0KCksIGVuZEF0KCksIGFuZCBsaW1pdCgpLiBVc2UgbGltaXRUb0ZpcnN0KCkgb3IgbGltaXRUb0xhc3QoKSBpbnN0ZWFkLlwiKTt9ZnVuY3Rpb24gZ2koYSxiKXtpZighMD09PWEuamMpdGhyb3cgRXJyb3IoYitcIjogWW91IGNhbid0IGNvbWJpbmUgbXVsdGlwbGUgb3JkZXJCeSBjYWxscy5cIik7fVkucHJvdG90eXBlLmxjPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5LnJlZlwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gbmV3IFUodGhpcy5rLHRoaXMucGF0aCl9O1kucHJvdG90eXBlLnJlZj1ZLnByb3RvdHlwZS5sYztcblkucHJvdG90eXBlLkViPWZ1bmN0aW9uKGEsYixjLGQpe3goXCJRdWVyeS5vblwiLDIsNCxhcmd1bWVudHMubGVuZ3RoKTtWZihcIlF1ZXJ5Lm9uXCIsYSwhMSk7QShcIlF1ZXJ5Lm9uXCIsMixiLCExKTt2YXIgZT1oaShcIlF1ZXJ5Lm9uXCIsYyxkKTtpZihcInZhbHVlXCI9PT1hKVZoKHRoaXMuayx0aGlzLG5ldyBqZChiLGUuY2FuY2VsfHxudWxsLGUuTWF8fG51bGwpKTtlbHNle3ZhciBmPXt9O2ZbYV09YjtWaCh0aGlzLmssdGhpcyxuZXcga2QoZixlLmNhbmNlbCxlLk1hKSl9cmV0dXJuIGJ9O1kucHJvdG90eXBlLm9uPVkucHJvdG90eXBlLkViO1xuWS5wcm90b3R5cGUuZ2M9ZnVuY3Rpb24oYSxiLGMpe3goXCJRdWVyeS5vZmZcIiwwLDMsYXJndW1lbnRzLmxlbmd0aCk7VmYoXCJRdWVyeS5vZmZcIixhLCEwKTtBKFwiUXVlcnkub2ZmXCIsMixiLCEwKTtsYihcIlF1ZXJ5Lm9mZlwiLDMsYyk7dmFyIGQ9bnVsbCxlPW51bGw7XCJ2YWx1ZVwiPT09YT9kPW5ldyBqZChifHxudWxsLG51bGwsY3x8bnVsbCk6YSYmKGImJihlPXt9LGVbYV09YiksZD1uZXcga2QoZSxudWxsLGN8fG51bGwpKTtlPXRoaXMuaztkPVwiLmluZm9cIj09PU8odGhpcy5wYXRoKT9lLnpkLmtiKHRoaXMsZCk6ZS5PLmtiKHRoaXMsZCk7eGIoZS5lYSx0aGlzLnBhdGgsZCl9O1kucHJvdG90eXBlLm9mZj1ZLnByb3RvdHlwZS5nYztcblkucHJvdG90eXBlLkFnPWZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gYyhnKXtmJiYoZj0hMSxlLmdjKGEsYyksYi5jYWxsKGQuTWEsZykpfXgoXCJRdWVyeS5vbmNlXCIsMiw0LGFyZ3VtZW50cy5sZW5ndGgpO1ZmKFwiUXVlcnkub25jZVwiLGEsITEpO0EoXCJRdWVyeS5vbmNlXCIsMixiLCExKTt2YXIgZD1oaShcIlF1ZXJ5Lm9uY2VcIixhcmd1bWVudHNbMl0sYXJndW1lbnRzWzNdKSxlPXRoaXMsZj0hMDt0aGlzLkViKGEsYyxmdW5jdGlvbihiKXtlLmdjKGEsYyk7ZC5jYW5jZWwmJmQuY2FuY2VsLmNhbGwoZC5NYSxiKX0pfTtZLnByb3RvdHlwZS5vbmNlPVkucHJvdG90eXBlLkFnO1xuWS5wcm90b3R5cGUuR2U9ZnVuY3Rpb24oYSl7UShcIlF1ZXJ5LmxpbWl0KCkgYmVpbmcgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBRdWVyeS5saW1pdFRvRmlyc3QoKSBvciBRdWVyeS5saW1pdFRvTGFzdCgpIGluc3RlYWQuXCIpO3goXCJRdWVyeS5saW1pdFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZighZ2EoYSl8fE1hdGguZmxvb3IoYSkhPT1hfHwwPj1hKXRocm93IEVycm9yKFwiUXVlcnkubGltaXQ6IEZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLlwiKTtpZih0aGlzLm4uaWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdDogTGltaXQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gbGltaXQsIGxpbWl0VG9GaXJzdCwgb3JsaW1pdFRvTGFzdC5cIik7dmFyIGI9dGhpcy5uLkdlKGEpO2ZpKGIpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGIsdGhpcy5qYyl9O1kucHJvdG90eXBlLmxpbWl0PVkucHJvdG90eXBlLkdlO1xuWS5wcm90b3R5cGUuSGU9ZnVuY3Rpb24oYSl7eChcIlF1ZXJ5LmxpbWl0VG9GaXJzdFwiLDEsMSxhcmd1bWVudHMubGVuZ3RoKTtpZighZ2EoYSl8fE1hdGguZmxvb3IoYSkhPT1hfHwwPj1hKXRocm93IEVycm9yKFwiUXVlcnkubGltaXRUb0ZpcnN0OiBGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlci5cIik7aWYodGhpcy5uLmlhKXRocm93IEVycm9yKFwiUXVlcnkubGltaXRUb0ZpcnN0OiBMaW1pdCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBsaW1pdCwgbGltaXRUb0ZpcnN0LCBvciBsaW1pdFRvTGFzdCkuXCIpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLHRoaXMubi5IZShhKSx0aGlzLmpjKX07WS5wcm90b3R5cGUubGltaXRUb0ZpcnN0PVkucHJvdG90eXBlLkhlO1xuWS5wcm90b3R5cGUuSWU9ZnVuY3Rpb24oYSl7eChcIlF1ZXJ5LmxpbWl0VG9MYXN0XCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKCFnYShhKXx8TWF0aC5mbG9vcihhKSE9PWF8fDA+PWEpdGhyb3cgRXJyb3IoXCJRdWVyeS5saW1pdFRvTGFzdDogRmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIuXCIpO2lmKHRoaXMubi5pYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmxpbWl0VG9MYXN0OiBMaW1pdCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBsaW1pdCwgbGltaXRUb0ZpcnN0LCBvciBsaW1pdFRvTGFzdCkuXCIpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLHRoaXMubi5JZShhKSx0aGlzLmpjKX07WS5wcm90b3R5cGUubGltaXRUb0xhc3Q9WS5wcm90b3R5cGUuSWU7XG5ZLnByb3RvdHlwZS5CZz1mdW5jdGlvbihhKXt4KFwiUXVlcnkub3JkZXJCeUNoaWxkXCIsMSwxLGFyZ3VtZW50cy5sZW5ndGgpO2lmKFwiJGtleVwiPT09YSl0aHJvdyBFcnJvcignUXVlcnkub3JkZXJCeUNoaWxkOiBcIiRrZXlcIiBpcyBpbnZhbGlkLiAgVXNlIFF1ZXJ5Lm9yZGVyQnlLZXkoKSBpbnN0ZWFkLicpO2lmKFwiJHByaW9yaXR5XCI9PT1hKXRocm93IEVycm9yKCdRdWVyeS5vcmRlckJ5Q2hpbGQ6IFwiJHByaW9yaXR5XCIgaXMgaW52YWxpZC4gIFVzZSBRdWVyeS5vcmRlckJ5UHJpb3JpdHkoKSBpbnN0ZWFkLicpO2lmKFwiJHZhbHVlXCI9PT1hKXRocm93IEVycm9yKCdRdWVyeS5vcmRlckJ5Q2hpbGQ6IFwiJHZhbHVlXCIgaXMgaW52YWxpZC4gIFVzZSBRdWVyeS5vcmRlckJ5VmFsdWUoKSBpbnN0ZWFkLicpO1dmKFwiUXVlcnkub3JkZXJCeUNoaWxkXCIsMSxhLCExKTtnaSh0aGlzLFwiUXVlcnkub3JkZXJCeUNoaWxkXCIpO3ZhciBiPWJlKHRoaXMubixuZXcgUmQoYSkpO2VpKGIpO3JldHVybiBuZXcgWSh0aGlzLmssXG50aGlzLnBhdGgsYiwhMCl9O1kucHJvdG90eXBlLm9yZGVyQnlDaGlsZD1ZLnByb3RvdHlwZS5CZztZLnByb3RvdHlwZS5DZz1mdW5jdGlvbigpe3goXCJRdWVyeS5vcmRlckJ5S2V5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2dpKHRoaXMsXCJRdWVyeS5vcmRlckJ5S2V5XCIpO3ZhciBhPWJlKHRoaXMubixWZCk7ZWkoYSk7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYSwhMCl9O1kucHJvdG90eXBlLm9yZGVyQnlLZXk9WS5wcm90b3R5cGUuQ2c7WS5wcm90b3R5cGUuRGc9ZnVuY3Rpb24oKXt4KFwiUXVlcnkub3JkZXJCeVByaW9yaXR5XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2dpKHRoaXMsXCJRdWVyeS5vcmRlckJ5UHJpb3JpdHlcIik7dmFyIGE9YmUodGhpcy5uLE0pO2VpKGEpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGEsITApfTtZLnByb3RvdHlwZS5vcmRlckJ5UHJpb3JpdHk9WS5wcm90b3R5cGUuRGc7XG5ZLnByb3RvdHlwZS5FZz1mdW5jdGlvbigpe3goXCJRdWVyeS5vcmRlckJ5VmFsdWVcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Z2kodGhpcyxcIlF1ZXJ5Lm9yZGVyQnlWYWx1ZVwiKTt2YXIgYT1iZSh0aGlzLm4sWWQpO2VpKGEpO3JldHVybiBuZXcgWSh0aGlzLmssdGhpcy5wYXRoLGEsITApfTtZLnByb3RvdHlwZS5vcmRlckJ5VmFsdWU9WS5wcm90b3R5cGUuRWc7XG5ZLnByb3RvdHlwZS5YZD1mdW5jdGlvbihhLGIpe3goXCJRdWVyeS5zdGFydEF0XCIsMCwyLGFyZ3VtZW50cy5sZW5ndGgpO1JmKFwiUXVlcnkuc3RhcnRBdFwiLGEsdGhpcy5wYXRoLCEwKTtXZihcIlF1ZXJ5LnN0YXJ0QXRcIiwyLGIsITApO3ZhciBjPXRoaXMubi5YZChhLGIpO2ZpKGMpO2VpKGMpO2lmKHRoaXMubi5sYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LnN0YXJ0QXQ6IFN0YXJ0aW5nIHBvaW50IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIHN0YXJ0QXQgb3IgZXF1YWxUbykuXCIpO24oYSl8fChiPWE9bnVsbCk7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYyx0aGlzLmpjKX07WS5wcm90b3R5cGUuc3RhcnRBdD1ZLnByb3RvdHlwZS5YZDtcblkucHJvdG90eXBlLnFkPWZ1bmN0aW9uKGEsYil7eChcIlF1ZXJ5LmVuZEF0XCIsMCwyLGFyZ3VtZW50cy5sZW5ndGgpO1JmKFwiUXVlcnkuZW5kQXRcIixhLHRoaXMucGF0aCwhMCk7V2YoXCJRdWVyeS5lbmRBdFwiLDIsYiwhMCk7dmFyIGM9dGhpcy5uLnFkKGEsYik7ZmkoYyk7ZWkoYyk7aWYodGhpcy5uLm5hKXRocm93IEVycm9yKFwiUXVlcnkuZW5kQXQ6IEVuZGluZyBwb2ludCB3YXMgYWxyZWFkeSBzZXQgKGJ5IGFub3RoZXIgY2FsbCB0byBlbmRBdCBvciBlcXVhbFRvKS5cIik7cmV0dXJuIG5ldyBZKHRoaXMuayx0aGlzLnBhdGgsYyx0aGlzLmpjKX07WS5wcm90b3R5cGUuZW5kQXQ9WS5wcm90b3R5cGUucWQ7XG5ZLnByb3RvdHlwZS5oZz1mdW5jdGlvbihhLGIpe3goXCJRdWVyeS5lcXVhbFRvXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1JmKFwiUXVlcnkuZXF1YWxUb1wiLGEsdGhpcy5wYXRoLCExKTtXZihcIlF1ZXJ5LmVxdWFsVG9cIiwyLGIsITApO2lmKHRoaXMubi5sYSl0aHJvdyBFcnJvcihcIlF1ZXJ5LmVxdWFsVG86IFN0YXJ0aW5nIHBvaW50IHdhcyBhbHJlYWR5IHNldCAoYnkgYW5vdGhlciBjYWxsIHRvIGVuZEF0IG9yIGVxdWFsVG8pLlwiKTtpZih0aGlzLm4ubmEpdGhyb3cgRXJyb3IoXCJRdWVyeS5lcXVhbFRvOiBFbmRpbmcgcG9pbnQgd2FzIGFscmVhZHkgc2V0IChieSBhbm90aGVyIGNhbGwgdG8gZW5kQXQgb3IgZXF1YWxUbykuXCIpO3JldHVybiB0aGlzLlhkKGEsYikucWQoYSxiKX07WS5wcm90b3R5cGUuZXF1YWxUbz1ZLnByb3RvdHlwZS5oZztcblkucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7eChcIlF1ZXJ5LnRvU3RyaW5nXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO2Zvcih2YXIgYT10aGlzLnBhdGgsYj1cIlwiLGM9YS5ZO2M8YS5vLmxlbmd0aDtjKyspXCJcIiE9PWEub1tjXSYmKGIrPVwiL1wiK2VuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoYS5vW2NdKSkpO2E9dGhpcy5rLnRvU3RyaW5nKCkrKGJ8fFwiL1wiKTtiPWpiKGVlKHRoaXMubikpO3JldHVybiBhKz1iLnJlcGxhY2UoL14mLyxcIlwiKX07WS5wcm90b3R5cGUudG9TdHJpbmc9WS5wcm90b3R5cGUudG9TdHJpbmc7WS5wcm90b3R5cGUud2E9ZnVuY3Rpb24oKXt2YXIgYT1XYyhjZSh0aGlzLm4pKTtyZXR1cm5cInt9XCI9PT1hP1wiZGVmYXVsdFwiOmF9O1xuZnVuY3Rpb24gaGkoYSxiLGMpe3ZhciBkPXtjYW5jZWw6bnVsbCxNYTpudWxsfTtpZihiJiZjKWQuY2FuY2VsPWIsQShhLDMsZC5jYW5jZWwsITApLGQuTWE9YyxsYihhLDQsZC5NYSk7ZWxzZSBpZihiKWlmKFwib2JqZWN0XCI9PT10eXBlb2YgYiYmbnVsbCE9PWIpZC5NYT1iO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT09dHlwZW9mIGIpZC5jYW5jZWw9YjtlbHNlIHRocm93IEVycm9yKHooYSwzLCEwKStcIiBtdXN0IGVpdGhlciBiZSBhIGNhbmNlbCBjYWxsYmFjayBvciBhIGNvbnRleHQgb2JqZWN0LlwiKTtyZXR1cm4gZH07dmFyIFo9e307Wi52Yz13aDtaLkRhdGFDb25uZWN0aW9uPVoudmM7d2gucHJvdG90eXBlLk9nPWZ1bmN0aW9uKGEsYil7dGhpcy5EYShcInFcIix7cDphfSxiKX07Wi52Yy5wcm90b3R5cGUuc2ltcGxlTGlzdGVuPVoudmMucHJvdG90eXBlLk9nO3doLnByb3RvdHlwZS5nZz1mdW5jdGlvbihhLGIpe3RoaXMuRGEoXCJlY2hvXCIse2Q6YX0sYil9O1oudmMucHJvdG90eXBlLmVjaG89Wi52Yy5wcm90b3R5cGUuZ2c7d2gucHJvdG90eXBlLmludGVycnVwdD13aC5wcm90b3R5cGUueWI7Wi5TZj1raDtaLlJlYWxUaW1lQ29ubmVjdGlvbj1aLlNmO2toLnByb3RvdHlwZS5zZW5kUmVxdWVzdD1raC5wcm90b3R5cGUuRGE7a2gucHJvdG90eXBlLmNsb3NlPWtoLnByb3RvdHlwZS5jbG9zZTtcbloub2c9ZnVuY3Rpb24oYSl7dmFyIGI9d2gucHJvdG90eXBlLnB1dDt3aC5wcm90b3R5cGUucHV0PWZ1bmN0aW9uKGMsZCxlLGYpe24oZikmJihmPWEoKSk7Yi5jYWxsKHRoaXMsYyxkLGUsZil9O3JldHVybiBmdW5jdGlvbigpe3doLnByb3RvdHlwZS5wdXQ9Yn19O1ouaGlqYWNrSGFzaD1aLm9nO1ouUmY9RWM7Wi5Db25uZWN0aW9uVGFyZ2V0PVouUmY7Wi53YT1mdW5jdGlvbihhKXtyZXR1cm4gYS53YSgpfTtaLnF1ZXJ5SWRlbnRpZmllcj1aLndhO1oucWc9ZnVuY3Rpb24oYSl7cmV0dXJuIGEuay5SYS5hYX07Wi5saXN0ZW5zPVoucWc7Wi51ZT1mdW5jdGlvbihhKXthLnVlKCl9O1ouZm9yY2VSZXN0Q2xpZW50PVoudWU7ZnVuY3Rpb24gVShhLGIpe3ZhciBjLGQsZTtpZihhIGluc3RhbmNlb2YgS2gpYz1hLGQ9YjtlbHNle3goXCJuZXcgRmlyZWJhc2VcIiwxLDIsYXJndW1lbnRzLmxlbmd0aCk7ZD1SYyhhcmd1bWVudHNbMF0pO2M9ZC5RZztcImZpcmViYXNlXCI9PT1kLmRvbWFpbiYmUWMoZC5ob3N0K1wiIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQuIFBsZWFzZSB1c2UgPFlPVVIgRklSRUJBU0U+LmZpcmViYXNlaW8uY29tIGluc3RlYWRcIik7Y3x8UWMoXCJDYW5ub3QgcGFyc2UgRmlyZWJhc2UgdXJsLiBQbGVhc2UgdXNlIGh0dHBzOi8vPFlPVVIgRklSRUJBU0U+LmZpcmViYXNlaW8uY29tXCIpO2QubGJ8fFwidW5kZWZpbmVkXCIhPT10eXBlb2Ygd2luZG93JiZ3aW5kb3cubG9jYXRpb24mJndpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCYmLTEhPT13aW5kb3cubG9jYXRpb24ucHJvdG9jb2wuaW5kZXhPZihcImh0dHBzOlwiKSYmUShcIkluc2VjdXJlIEZpcmViYXNlIGFjY2VzcyBmcm9tIGEgc2VjdXJlIHBhZ2UuIFBsZWFzZSB1c2UgaHR0cHMgaW4gY2FsbHMgdG8gbmV3IEZpcmViYXNlKCkuXCIpO1xuYz1uZXcgRWMoZC5ob3N0LGQubGIsYyxcIndzXCI9PT1kLnNjaGVtZXx8XCJ3c3NcIj09PWQuc2NoZW1lKTtkPW5ldyBLKGQuWmMpO2U9ZC50b1N0cmluZygpO3ZhciBmOyEoZj0hcChjLmhvc3QpfHwwPT09Yy5ob3N0Lmxlbmd0aHx8IVBmKGMuQ2IpKSYmKGY9MCE9PWUubGVuZ3RoKSYmKGUmJihlPWUucmVwbGFjZSgvXlxcLypcXC5pbmZvKFxcL3wkKS8sXCIvXCIpKSxmPSEocChlKSYmMCE9PWUubGVuZ3RoJiYhT2YudGVzdChlKSkpO2lmKGYpdGhyb3cgRXJyb3IoeihcIm5ldyBGaXJlYmFzZVwiLDEsITEpKydtdXN0IGJlIGEgdmFsaWQgZmlyZWJhc2UgVVJMIGFuZCB0aGUgcGF0aCBjYW5cXCd0IGNvbnRhaW4gXCIuXCIsIFwiI1wiLCBcIiRcIiwgXCJbXCIsIG9yIFwiXVwiLicpO2lmKGIpaWYoYiBpbnN0YW5jZW9mIFcpZT1iO2Vsc2UgaWYocChiKSllPVcudWIoKSxjLkxkPWI7ZWxzZSB0aHJvdyBFcnJvcihcIkV4cGVjdGVkIGEgdmFsaWQgRmlyZWJhc2UuQ29udGV4dCBmb3Igc2Vjb25kIGFyZ3VtZW50IHRvIG5ldyBGaXJlYmFzZSgpXCIpO1xuZWxzZSBlPVcudWIoKTtmPWMudG9TdHJpbmcoKTt2YXIgZz13KGUubmMsZik7Z3x8KGc9bmV3IEtoKGMsZS5QZiksZS5uY1tmXT1nKTtjPWd9WS5jYWxsKHRoaXMsYyxkLCRkLCExKX1tYShVLFkpO3ZhciBpaT1VLGppPVtcIkZpcmViYXNlXCJdLGtpPWFhO2ppWzBdaW4ga2l8fCFraS5leGVjU2NyaXB0fHxraS5leGVjU2NyaXB0KFwidmFyIFwiK2ppWzBdKTtmb3IodmFyIGxpO2ppLmxlbmd0aCYmKGxpPWppLnNoaWZ0KCkpOykhamkubGVuZ3RoJiZuKGlpKT9raVtsaV09aWk6a2k9a2lbbGldP2tpW2xpXTpraVtsaV09e307VS5wcm90b3R5cGUubmFtZT1mdW5jdGlvbigpe1EoXCJGaXJlYmFzZS5uYW1lKCkgYmVpbmcgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBGaXJlYmFzZS5rZXkoKSBpbnN0ZWFkLlwiKTt4KFwiRmlyZWJhc2UubmFtZVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5rZXkoKX07VS5wcm90b3R5cGUubmFtZT1VLnByb3RvdHlwZS5uYW1lO1xuVS5wcm90b3R5cGUua2V5PWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLmtleVwiLDAsMCxhcmd1bWVudHMubGVuZ3RoKTtyZXR1cm4gdGhpcy5wYXRoLmUoKT9udWxsOnZjKHRoaXMucGF0aCl9O1UucHJvdG90eXBlLmtleT1VLnByb3RvdHlwZS5rZXk7VS5wcm90b3R5cGUudz1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UuY2hpbGRcIiwxLDEsYXJndW1lbnRzLmxlbmd0aCk7aWYoZ2EoYSkpYT1TdHJpbmcoYSk7ZWxzZSBpZighKGEgaW5zdGFuY2VvZiBLKSlpZihudWxsPT09Tyh0aGlzLnBhdGgpKXt2YXIgYj1hO2ImJihiPWIucmVwbGFjZSgvXlxcLypcXC5pbmZvKFxcL3wkKS8sXCIvXCIpKTtYZihcIkZpcmViYXNlLmNoaWxkXCIsYil9ZWxzZSBYZihcIkZpcmViYXNlLmNoaWxkXCIsYSk7cmV0dXJuIG5ldyBVKHRoaXMuayx0aGlzLnBhdGgudyhhKSl9O1UucHJvdG90eXBlLmNoaWxkPVUucHJvdG90eXBlLnc7XG5VLnByb3RvdHlwZS5wYXJlbnQ9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UucGFyZW50XCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3ZhciBhPXRoaXMucGF0aC5wYXJlbnQoKTtyZXR1cm4gbnVsbD09PWE/bnVsbDpuZXcgVSh0aGlzLmssYSl9O1UucHJvdG90eXBlLnBhcmVudD1VLnByb3RvdHlwZS5wYXJlbnQ7VS5wcm90b3R5cGUucm9vdD1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5yZWZcIiwwLDAsYXJndW1lbnRzLmxlbmd0aCk7Zm9yKHZhciBhPXRoaXM7bnVsbCE9PWEucGFyZW50KCk7KWE9YS5wYXJlbnQoKTtyZXR1cm4gYX07VS5wcm90b3R5cGUucm9vdD1VLnByb3RvdHlwZS5yb290O1xuVS5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnNldFwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtZZihcIkZpcmViYXNlLnNldFwiLHRoaXMucGF0aCk7UmYoXCJGaXJlYmFzZS5zZXRcIixhLHRoaXMucGF0aCwhMSk7QShcIkZpcmViYXNlLnNldFwiLDIsYiwhMCk7dGhpcy5rLktiKHRoaXMucGF0aCxhLG51bGwsYnx8bnVsbCl9O1UucHJvdG90eXBlLnNldD1VLnByb3RvdHlwZS5zZXQ7XG5VLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UudXBkYXRlXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2UudXBkYXRlXCIsdGhpcy5wYXRoKTtpZihlYShhKSl7Zm9yKHZhciBjPXt9LGQ9MDtkPGEubGVuZ3RoOysrZCljW1wiXCIrZF09YVtkXTthPWM7UShcIlBhc3NpbmcgYW4gQXJyYXkgdG8gRmlyZWJhc2UudXBkYXRlKCkgaXMgZGVwcmVjYXRlZC4gVXNlIHNldCgpIGlmIHlvdSB3YW50IHRvIG92ZXJ3cml0ZSB0aGUgZXhpc3RpbmcgZGF0YSwgb3IgYW4gT2JqZWN0IHdpdGggaW50ZWdlciBrZXlzIGlmIHlvdSByZWFsbHkgZG8gd2FudCB0byBvbmx5IHVwZGF0ZSBzb21lIG9mIHRoZSBjaGlsZHJlbi5cIil9VGYoXCJGaXJlYmFzZS51cGRhdGVcIixhLHRoaXMucGF0aCk7QShcIkZpcmViYXNlLnVwZGF0ZVwiLDIsYiwhMCk7dGhpcy5rLnVwZGF0ZSh0aGlzLnBhdGgsYSxifHxudWxsKX07VS5wcm90b3R5cGUudXBkYXRlPVUucHJvdG90eXBlLnVwZGF0ZTtcblUucHJvdG90eXBlLktiPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5XCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uuc2V0V2l0aFByaW9yaXR5XCIsdGhpcy5wYXRoKTtSZihcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLGEsdGhpcy5wYXRoLCExKTtVZihcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLDIsYik7QShcIkZpcmViYXNlLnNldFdpdGhQcmlvcml0eVwiLDMsYywhMCk7aWYoXCIubGVuZ3RoXCI9PT10aGlzLmtleSgpfHxcIi5rZXlzXCI9PT10aGlzLmtleSgpKXRocm93XCJGaXJlYmFzZS5zZXRXaXRoUHJpb3JpdHkgZmFpbGVkOiBcIit0aGlzLmtleSgpK1wiIGlzIGEgcmVhZC1vbmx5IG9iamVjdC5cIjt0aGlzLmsuS2IodGhpcy5wYXRoLGEsYixjfHxudWxsKX07VS5wcm90b3R5cGUuc2V0V2l0aFByaW9yaXR5PVUucHJvdG90eXBlLktiO1xuVS5wcm90b3R5cGUucmVtb3ZlPWZ1bmN0aW9uKGEpe3goXCJGaXJlYmFzZS5yZW1vdmVcIiwwLDEsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5yZW1vdmVcIix0aGlzLnBhdGgpO0EoXCJGaXJlYmFzZS5yZW1vdmVcIiwxLGEsITApO3RoaXMuc2V0KG51bGwsYSl9O1UucHJvdG90eXBlLnJlbW92ZT1VLnByb3RvdHlwZS5yZW1vdmU7XG5VLnByb3RvdHlwZS50cmFuc2FjdGlvbj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLnRyYW5zYWN0aW9uXCIsMSwzLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2UudHJhbnNhY3Rpb25cIix0aGlzLnBhdGgpO0EoXCJGaXJlYmFzZS50cmFuc2FjdGlvblwiLDEsYSwhMSk7QShcIkZpcmViYXNlLnRyYW5zYWN0aW9uXCIsMixiLCEwKTtpZihuKGMpJiZcImJvb2xlYW5cIiE9dHlwZW9mIGMpdGhyb3cgRXJyb3IoeihcIkZpcmViYXNlLnRyYW5zYWN0aW9uXCIsMywhMCkrXCJtdXN0IGJlIGEgYm9vbGVhbi5cIik7aWYoXCIubGVuZ3RoXCI9PT10aGlzLmtleSgpfHxcIi5rZXlzXCI9PT10aGlzLmtleSgpKXRocm93XCJGaXJlYmFzZS50cmFuc2FjdGlvbiBmYWlsZWQ6IFwiK3RoaXMua2V5KCkrXCIgaXMgYSByZWFkLW9ubHkgb2JqZWN0LlwiO1widW5kZWZpbmVkXCI9PT10eXBlb2YgYyYmKGM9ITApO1doKHRoaXMuayx0aGlzLnBhdGgsYSxifHxudWxsLGMpfTtVLnByb3RvdHlwZS50cmFuc2FjdGlvbj1VLnByb3RvdHlwZS50cmFuc2FjdGlvbjtcblUucHJvdG90eXBlLkxnPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnNldFByaW9yaXR5XCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO1lmKFwiRmlyZWJhc2Uuc2V0UHJpb3JpdHlcIix0aGlzLnBhdGgpO1VmKFwiRmlyZWJhc2Uuc2V0UHJpb3JpdHlcIiwxLGEpO0EoXCJGaXJlYmFzZS5zZXRQcmlvcml0eVwiLDIsYiwhMCk7dGhpcy5rLktiKHRoaXMucGF0aC53KFwiLnByaW9yaXR5XCIpLGEsbnVsbCxiKX07VS5wcm90b3R5cGUuc2V0UHJpb3JpdHk9VS5wcm90b3R5cGUuTGc7XG5VLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnB1c2hcIiwwLDIsYXJndW1lbnRzLmxlbmd0aCk7WWYoXCJGaXJlYmFzZS5wdXNoXCIsdGhpcy5wYXRoKTtSZihcIkZpcmViYXNlLnB1c2hcIixhLHRoaXMucGF0aCwhMCk7QShcIkZpcmViYXNlLnB1c2hcIiwyLGIsITApO3ZhciBjPU1oKHRoaXMuayksYz1LZihjKSxjPXRoaXMudyhjKTtcInVuZGVmaW5lZFwiIT09dHlwZW9mIGEmJm51bGwhPT1hJiZjLnNldChhLGIpO3JldHVybiBjfTtVLnByb3RvdHlwZS5wdXNoPVUucHJvdG90eXBlLnB1c2g7VS5wcm90b3R5cGUuamI9ZnVuY3Rpb24oKXtZZihcIkZpcmViYXNlLm9uRGlzY29ubmVjdFwiLHRoaXMucGF0aCk7cmV0dXJuIG5ldyBYKHRoaXMuayx0aGlzLnBhdGgpfTtVLnByb3RvdHlwZS5vbkRpc2Nvbm5lY3Q9VS5wcm90b3R5cGUuamI7XG5VLnByb3RvdHlwZS5QPWZ1bmN0aW9uKGEsYixjKXtRKFwiRmlyZWJhc2VSZWYuYXV0aCgpIGJlaW5nIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgRmlyZWJhc2VSZWYuYXV0aFdpdGhDdXN0b21Ub2tlbigpIGluc3RlYWQuXCIpO3goXCJGaXJlYmFzZS5hdXRoXCIsMSwzLGFyZ3VtZW50cy5sZW5ndGgpO1pmKFwiRmlyZWJhc2UuYXV0aFwiLGEpO0EoXCJGaXJlYmFzZS5hdXRoXCIsMixiLCEwKTtBKFwiRmlyZWJhc2UuYXV0aFwiLDMsYiwhMCk7S2codGhpcy5rLlAsYSx7fSx7cmVtZW1iZXI6XCJub25lXCJ9LGIsYyl9O1UucHJvdG90eXBlLmF1dGg9VS5wcm90b3R5cGUuUDtVLnByb3RvdHlwZS5lZT1mdW5jdGlvbihhKXt4KFwiRmlyZWJhc2UudW5hdXRoXCIsMCwxLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS51bmF1dGhcIiwxLGEsITApO0xnKHRoaXMuay5QLGEpfTtVLnByb3RvdHlwZS51bmF1dGg9VS5wcm90b3R5cGUuZWU7XG5VLnByb3RvdHlwZS53ZT1mdW5jdGlvbigpe3goXCJGaXJlYmFzZS5nZXRBdXRoXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO3JldHVybiB0aGlzLmsuUC53ZSgpfTtVLnByb3RvdHlwZS5nZXRBdXRoPVUucHJvdG90eXBlLndlO1UucHJvdG90eXBlLnVnPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLm9uQXV0aFwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2Uub25BdXRoXCIsMSxhLCExKTtsYihcIkZpcmViYXNlLm9uQXV0aFwiLDIsYik7dGhpcy5rLlAuRWIoXCJhdXRoX3N0YXR1c1wiLGEsYil9O1UucHJvdG90eXBlLm9uQXV0aD1VLnByb3RvdHlwZS51ZztVLnByb3RvdHlwZS50Zz1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5vZmZBdXRoXCIsMSwyLGFyZ3VtZW50cy5sZW5ndGgpO0EoXCJGaXJlYmFzZS5vZmZBdXRoXCIsMSxhLCExKTtsYihcIkZpcmViYXNlLm9mZkF1dGhcIiwyLGIpO3RoaXMuay5QLmdjKFwiYXV0aF9zdGF0dXNcIixhLGIpfTtVLnByb3RvdHlwZS5vZmZBdXRoPVUucHJvdG90eXBlLnRnO1xuVS5wcm90b3R5cGUuV2Y9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5hdXRoV2l0aEN1c3RvbVRva2VuXCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpO1pmKFwiRmlyZWJhc2UuYXV0aFdpdGhDdXN0b21Ub2tlblwiLGEpO0EoXCJGaXJlYmFzZS5hdXRoV2l0aEN1c3RvbVRva2VuXCIsMixiLCExKTthZyhcIkZpcmViYXNlLmF1dGhXaXRoQ3VzdG9tVG9rZW5cIiwzLGMsITApO0tnKHRoaXMuay5QLGEse30sY3x8e30sYil9O1UucHJvdG90eXBlLmF1dGhXaXRoQ3VzdG9tVG9rZW49VS5wcm90b3R5cGUuV2Y7VS5wcm90b3R5cGUuWGY9ZnVuY3Rpb24oYSxiLGMpe3goXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUG9wdXBcIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7JGYoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUG9wdXBcIiwxLGEpO0EoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoUG9wdXBcIiwyLGIsITEpO2FnKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFBvcHVwXCIsMyxjLCEwKTtQZyh0aGlzLmsuUCxhLGMsYil9O1xuVS5wcm90b3R5cGUuYXV0aFdpdGhPQXV0aFBvcHVwPVUucHJvdG90eXBlLlhmO1UucHJvdG90eXBlLllmPWZ1bmN0aW9uKGEsYixjKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFJlZGlyZWN0XCIsMiwzLGFyZ3VtZW50cy5sZW5ndGgpOyRmKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFJlZGlyZWN0XCIsMSxhKTtBKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFJlZGlyZWN0XCIsMixiLCExKTthZyhcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhSZWRpcmVjdFwiLDMsYywhMCk7dmFyIGQ9dGhpcy5rLlA7TmcoZCk7dmFyIGU9W3dnXSxmPWlnKGMpO1wiYW5vbnltb3VzXCI9PT1hfHxcImZpcmViYXNlXCI9PT1hP1IoYix5ZyhcIlRSQU5TUE9SVF9VTkFWQUlMQUJMRVwiKSk6KFAuc2V0KFwicmVkaXJlY3RfY2xpZW50X29wdGlvbnNcIixmLmxkKSxPZyhkLGUsXCIvYXV0aC9cIithLGYsYikpfTtVLnByb3RvdHlwZS5hdXRoV2l0aE9BdXRoUmVkaXJlY3Q9VS5wcm90b3R5cGUuWWY7XG5VLnByb3RvdHlwZS5aZj1mdW5jdGlvbihhLGIsYyxkKXt4KFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsMyw0LGFyZ3VtZW50cy5sZW5ndGgpOyRmKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsMSxhKTtBKFwiRmlyZWJhc2UuYXV0aFdpdGhPQXV0aFRva2VuXCIsMyxjLCExKTthZyhcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDQsZCwhMCk7cChiKT8oJGYoXCJGaXJlYmFzZS5hdXRoV2l0aE9BdXRoVG9rZW5cIiwyLGIpLE1nKHRoaXMuay5QLGErXCIvdG9rZW5cIix7YWNjZXNzX3Rva2VuOmJ9LGQsYykpOihhZyhcIkZpcmViYXNlLmF1dGhXaXRoT0F1dGhUb2tlblwiLDIsYiwhMSksTWcodGhpcy5rLlAsYStcIi90b2tlblwiLGIsZCxjKSl9O1UucHJvdG90eXBlLmF1dGhXaXRoT0F1dGhUb2tlbj1VLnByb3RvdHlwZS5aZjtcblUucHJvdG90eXBlLlZmPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDEsMixhcmd1bWVudHMubGVuZ3RoKTtBKFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMSxhLCExKTthZyhcIkZpcmViYXNlLmF1dGhBbm9ueW1vdXNseVwiLDIsYiwhMCk7TWcodGhpcy5rLlAsXCJhbm9ueW1vdXNcIix7fSxiLGEpfTtVLnByb3RvdHlwZS5hdXRoQW5vbnltb3VzbHk9VS5wcm90b3R5cGUuVmY7XG5VLnByb3RvdHlwZS4kZj1mdW5jdGlvbihhLGIsYyl7eChcIkZpcmViYXNlLmF1dGhXaXRoUGFzc3dvcmRcIiwyLDMsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5hdXRoV2l0aFBhc3N3b3JkXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLmF1dGhXaXRoUGFzc3dvcmRcIixhLFwiZW1haWxcIik7YmcoXCJGaXJlYmFzZS5hdXRoV2l0aFBhc3N3b3JkXCIsYSxcInBhc3N3b3JkXCIpO0EoXCJGaXJlYmFzZS5hdXRoQW5vbnltb3VzbHlcIiwyLGIsITEpO2FnKFwiRmlyZWJhc2UuYXV0aEFub255bW91c2x5XCIsMyxjLCEwKTtNZyh0aGlzLmsuUCxcInBhc3N3b3JkXCIsYSxjLGIpfTtVLnByb3RvdHlwZS5hdXRoV2l0aFBhc3N3b3JkPVUucHJvdG90eXBlLiRmO1xuVS5wcm90b3R5cGUucmU9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLDIsMixhcmd1bWVudHMubGVuZ3RoKTthZyhcIkZpcmViYXNlLmNyZWF0ZVVzZXJcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UuY3JlYXRlVXNlclwiLGEsXCJlbWFpbFwiKTtiZyhcIkZpcmViYXNlLmNyZWF0ZVVzZXJcIixhLFwicGFzc3dvcmRcIik7QShcIkZpcmViYXNlLmNyZWF0ZVVzZXJcIiwyLGIsITEpO3RoaXMuay5QLnJlKGEsYil9O1UucHJvdG90eXBlLmNyZWF0ZVVzZXI9VS5wcm90b3R5cGUucmU7VS5wcm90b3R5cGUuU2U9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UucmVtb3ZlVXNlclwiLDIsMixhcmd1bWVudHMubGVuZ3RoKTthZyhcIkZpcmViYXNlLnJlbW92ZVVzZXJcIiwxLGEsITEpO2JnKFwiRmlyZWJhc2UucmVtb3ZlVXNlclwiLGEsXCJlbWFpbFwiKTtiZyhcIkZpcmViYXNlLnJlbW92ZVVzZXJcIixhLFwicGFzc3dvcmRcIik7QShcIkZpcmViYXNlLnJlbW92ZVVzZXJcIiwyLGIsITEpO3RoaXMuay5QLlNlKGEsYil9O1xuVS5wcm90b3R5cGUucmVtb3ZlVXNlcj1VLnByb3RvdHlwZS5TZTtVLnByb3RvdHlwZS5vZT1mdW5jdGlvbihhLGIpe3goXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLDIsMixhcmd1bWVudHMubGVuZ3RoKTthZyhcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLmNoYW5nZVBhc3N3b3JkXCIsYSxcImVtYWlsXCIpO2JnKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIixhLFwib2xkUGFzc3dvcmRcIik7YmcoXCJGaXJlYmFzZS5jaGFuZ2VQYXNzd29yZFwiLGEsXCJuZXdQYXNzd29yZFwiKTtBKFwiRmlyZWJhc2UuY2hhbmdlUGFzc3dvcmRcIiwyLGIsITEpO3RoaXMuay5QLm9lKGEsYil9O1UucHJvdG90eXBlLmNoYW5nZVBhc3N3b3JkPVUucHJvdG90eXBlLm9lO1xuVS5wcm90b3R5cGUubmU9ZnVuY3Rpb24oYSxiKXt4KFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLDEsYSwhMSk7YmcoXCJGaXJlYmFzZS5jaGFuZ2VFbWFpbFwiLGEsXCJvbGRFbWFpbFwiKTtiZyhcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsYSxcIm5ld0VtYWlsXCIpO2JnKFwiRmlyZWJhc2UuY2hhbmdlRW1haWxcIixhLFwicGFzc3dvcmRcIik7QShcIkZpcmViYXNlLmNoYW5nZUVtYWlsXCIsMixiLCExKTt0aGlzLmsuUC5uZShhLGIpfTtVLnByb3RvdHlwZS5jaGFuZ2VFbWFpbD1VLnByb3RvdHlwZS5uZTtcblUucHJvdG90eXBlLlVlPWZ1bmN0aW9uKGEsYil7eChcIkZpcmViYXNlLnJlc2V0UGFzc3dvcmRcIiwyLDIsYXJndW1lbnRzLmxlbmd0aCk7YWcoXCJGaXJlYmFzZS5yZXNldFBhc3N3b3JkXCIsMSxhLCExKTtiZyhcIkZpcmViYXNlLnJlc2V0UGFzc3dvcmRcIixhLFwiZW1haWxcIik7QShcIkZpcmViYXNlLnJlc2V0UGFzc3dvcmRcIiwyLGIsITEpO3RoaXMuay5QLlVlKGEsYil9O1UucHJvdG90eXBlLnJlc2V0UGFzc3dvcmQ9VS5wcm90b3R5cGUuVWU7VS5nb09mZmxpbmU9ZnVuY3Rpb24oKXt4KFwiRmlyZWJhc2UuZ29PZmZsaW5lXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO1cudWIoKS55YigpfTtVLmdvT25saW5lPWZ1bmN0aW9uKCl7eChcIkZpcmViYXNlLmdvT25saW5lXCIsMCwwLGFyZ3VtZW50cy5sZW5ndGgpO1cudWIoKS5xYygpfTtcbmZ1bmN0aW9uIE5jKGEsYil7SighYnx8ITA9PT1hfHwhMT09PWEsXCJDYW4ndCB0dXJuIG9uIGN1c3RvbSBsb2dnZXJzIHBlcnNpc3RlbnRseS5cIik7ITA9PT1hPyhcInVuZGVmaW5lZFwiIT09dHlwZW9mIGNvbnNvbGUmJihcImZ1bmN0aW9uXCI9PT10eXBlb2YgY29uc29sZS5sb2c/QWI9cShjb25zb2xlLmxvZyxjb25zb2xlKTpcIm9iamVjdFwiPT09dHlwZW9mIGNvbnNvbGUubG9nJiYoQWI9ZnVuY3Rpb24oYSl7Y29uc29sZS5sb2coYSl9KSksYiYmUC5zZXQoXCJsb2dnaW5nX2VuYWJsZWRcIiwhMCkpOmE/QWI9YTooQWI9bnVsbCxQLnJlbW92ZShcImxvZ2dpbmdfZW5hYmxlZFwiKSl9VS5lbmFibGVMb2dnaW5nPU5jO1UuU2VydmVyVmFsdWU9e1RJTUVTVEFNUDp7XCIuc3ZcIjpcInRpbWVzdGFtcFwifX07VS5TREtfVkVSU0lPTj1cIjIuMi40XCI7VS5JTlRFUk5BTD1WO1UuQ29udGV4dD1XO1UuVEVTVF9BQ0NFU1M9Wjt9KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpcmViYXNlO1xuIiwiKGZ1bmN0aW9uIChyb290LCBwbHVyYWxpemUpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKHR5cGVvZiByZXF1aXJlID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBwbHVyYWxpemUoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQsIHJlZ2lzdGVycyBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcGx1cmFsaXplKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWwuXG4gICAgcm9vdC5wbHVyYWxpemUgPSBwbHVyYWxpemUoKTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKCkge1xuICAvLyBSdWxlIHN0b3JhZ2UgLSBwbHVyYWxpemUgYW5kIHNpbmd1bGFyaXplIG5lZWQgdG8gYmUgcnVuIHNlcXVlbnRpYWxseSxcbiAgLy8gd2hpbGUgb3RoZXIgcnVsZXMgY2FuIGJlIG9wdGltaXplZCB1c2luZyBhbiBvYmplY3QgZm9yIGluc3RhbnQgbG9va3Vwcy5cbiAgdmFyIHBsdXJhbFJ1bGVzICAgICAgPSBbXTtcbiAgdmFyIHNpbmd1bGFyUnVsZXMgICAgPSBbXTtcbiAgdmFyIHVuY291bnRhYmxlcyAgICAgPSB7fTtcbiAgdmFyIGlycmVndWxhclBsdXJhbHMgPSB7fTtcbiAgdmFyIGlycmVndWxhclNpbmdsZXMgPSB7fTtcblxuICAvKipcbiAgICogVGl0bGUgY2FzZSBhIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gdG9UaXRsZUNhc2UgKHN0cikge1xuICAgIHJldHVybiBzdHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHIuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2FuaXRpemUgYSBwbHVyYWxpemF0aW9uIHJ1bGUgdG8gYSB1c2FibGUgcmVndWxhciBleHByZXNzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gIHsoUmVnRXhwfHN0cmluZyl9IHJ1bGVcbiAgICogQHJldHVybiB7UmVnRXhwfVxuICAgKi9cbiAgZnVuY3Rpb24gc2FuaXRpemVSdWxlIChydWxlKSB7XG4gICAgaWYgKHR5cGVvZiBydWxlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJ14nICsgcnVsZSArICckJywgJ2knKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcnVsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXNzIGluIGEgd29yZCB0b2tlbiB0byBwcm9kdWNlIGEgZnVuY3Rpb24gdGhhdCBjYW4gcmVwbGljYXRlIHRoZSBjYXNlIG9uXG4gICAqIGFub3RoZXIgd29yZC5cbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHdvcmRcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIHRva2VuXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgZnVuY3Rpb24gcmVzdG9yZUNhc2UgKHdvcmQsIHRva2VuKSB7XG4gICAgLy8gVXBwZXIgY2FzZWQgd29yZHMuIEUuZy4gXCJIRUxMT1wiLlxuICAgIGlmICh3b3JkID09PSB3b3JkLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgIHJldHVybiB0b2tlbi50b1VwcGVyQ2FzZSgpO1xuICAgIH1cblxuICAgIC8vIFRpdGxlIGNhc2VkIHdvcmRzLiBFLmcuIFwiVGl0bGVcIi5cbiAgICBpZiAod29yZFswXSA9PT0gd29yZFswXS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICByZXR1cm4gdG9UaXRsZUNhc2UodG9rZW4pO1xuICAgIH1cblxuICAgIC8vIExvd2VyIGNhc2VkIHdvcmRzLiBFLmcuIFwidGVzdFwiLlxuICAgIHJldHVybiB0b2tlbi50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVycG9sYXRlIGEgcmVnZXhwIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtICB7W3R5cGVdfSBzdHIgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBhcmdzIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlIChzdHIsIGFyZ3MpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1xcJChcXGR7MSwyfSkvZywgZnVuY3Rpb24gKG1hdGNoLCBpbmRleCkge1xuICAgICAgcmV0dXJuIGFyZ3NbaW5kZXhdIHx8ICcnO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhbml0aXplIGEgd29yZCBieSBwYXNzaW5nIGluIHRoZSB3b3JkIGFuZCBzYW5pdGl6YXRpb24gcnVsZXMuXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICB3b3JkXG4gICAqIEBwYXJhbSAge0FycmF5fSAgICBjb2xsZWN0aW9uXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHNhbml0aXplV29yZCAod29yZCwgY29sbGVjdGlvbikge1xuICAgIC8vIEVtcHR5IHN0cmluZyBvciBkb2Vzbid0IG5lZWQgZml4aW5nLlxuICAgIGlmICghd29yZC5sZW5ndGggfHwgdW5jb3VudGFibGVzLmhhc093blByb3BlcnR5KHdvcmQpKSB7XG4gICAgICByZXR1cm4gd29yZDtcbiAgICB9XG5cbiAgICB2YXIgbGVuID0gY29sbGVjdGlvbi5sZW5ndGg7XG5cbiAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIHNhbml0aXphdGlvbiBydWxlcyBhbmQgdXNlIHRoZSBmaXJzdCBvbmUgdG8gbWF0Y2guXG4gICAgd2hpbGUgKGxlbi0tKSB7XG4gICAgICB2YXIgcnVsZSA9IGNvbGxlY3Rpb25bbGVuXTtcblxuICAgICAgLy8gSWYgdGhlIHJ1bGUgcGFzc2VzLCByZXR1cm4gdGhlIHJlcGxhY2VtZW50LlxuICAgICAgaWYgKHJ1bGVbMF0udGVzdCh3b3JkKSkge1xuICAgICAgICByZXR1cm4gd29yZC5yZXBsYWNlKHJ1bGVbMF0sIGZ1bmN0aW9uIChtYXRjaCwgaW5kZXgsIHdvcmQpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gaW50ZXJwb2xhdGUocnVsZVsxXSwgYXJndW1lbnRzKTtcblxuICAgICAgICAgIGlmIChtYXRjaCA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN0b3JlQ2FzZSh3b3JkW2luZGV4IC0gMV0sIHJlc3VsdCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlc3RvcmVDYXNlKG1hdGNoLCByZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gd29yZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGEgd29yZCB3aXRoIHRoZSB1cGRhdGVkIHdvcmQuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gICByZXBsYWNlTWFwXG4gICAqIEBwYXJhbSAge09iamVjdH0gICBrZWVwTWFwXG4gICAqIEBwYXJhbSAge0FycmF5fSAgICBydWxlc1xuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICovXG4gIGZ1bmN0aW9uIHJlcGxhY2VXb3JkIChyZXBsYWNlTWFwLCBrZWVwTWFwLCBydWxlcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAod29yZCkge1xuICAgICAgLy8gR2V0IHRoZSBjb3JyZWN0IHRva2VuIGFuZCBjYXNlIHJlc3RvcmF0aW9uIGZ1bmN0aW9ucy5cbiAgICAgIHZhciB0b2tlbiA9IHdvcmQudG9Mb3dlckNhc2UoKTtcblxuICAgICAgLy8gQ2hlY2sgYWdhaW5zdCB0aGUga2VlcCBvYmplY3QgbWFwLlxuICAgICAgaWYgKGtlZXBNYXAuaGFzT3duUHJvcGVydHkodG9rZW4pKSB7XG4gICAgICAgIHJldHVybiByZXN0b3JlQ2FzZSh3b3JkLCB0b2tlbik7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGFnYWluc3QgdGhlIHJlcGxhY2VtZW50IG1hcCBmb3IgYSBkaXJlY3Qgd29yZCByZXBsYWNlbWVudC5cbiAgICAgIGlmIChyZXBsYWNlTWFwLmhhc093blByb3BlcnR5KHRva2VuKSkge1xuICAgICAgICByZXR1cm4gcmVzdG9yZUNhc2Uod29yZCwgcmVwbGFjZU1hcFt0b2tlbl0pO1xuICAgICAgfVxuXG4gICAgICAvLyBSdW4gYWxsIHRoZSBydWxlcyBhZ2FpbnN0IHRoZSB3b3JkLlxuICAgICAgcmV0dXJuIHNhbml0aXplV29yZCh3b3JkLCBydWxlcyk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgb3Igc2luZ3VsYXJpemUgYSB3b3JkIGJhc2VkIG9uIHRoZSBwYXNzZWQgaW4gY291bnQuXG4gICAqXG4gICAqIEBwYXJhbSAge1N0cmluZ30gIHdvcmRcbiAgICogQHBhcmFtICB7TnVtYmVyfSAgY291bnRcbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gaW5jbHVzaXZlXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHBsdXJhbGl6ZSAod29yZCwgY291bnQsIGluY2x1c2l2ZSkge1xuICAgIHZhciBwbHVyYWxpemVkID0gY291bnQgPT09IDEgP1xuICAgICAgcGx1cmFsaXplLnNpbmd1bGFyKHdvcmQpIDogcGx1cmFsaXplLnBsdXJhbCh3b3JkKTtcblxuICAgIHJldHVybiAoaW5jbHVzaXZlID8gY291bnQgKyAnICcgOiAnJykgKyBwbHVyYWxpemVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFBsdXJhbGl6ZSBhIHdvcmQuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHBsdXJhbGl6ZS5wbHVyYWwgPSByZXBsYWNlV29yZChcbiAgICBpcnJlZ3VsYXJTaW5nbGVzLCBpcnJlZ3VsYXJQbHVyYWxzLCBwbHVyYWxSdWxlc1xuICApO1xuXG4gIC8qKlxuICAgKiBTaW5ndWxhcml6ZSBhIHdvcmQuXG4gICAqXG4gICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICovXG4gIHBsdXJhbGl6ZS5zaW5ndWxhciA9IHJlcGxhY2VXb3JkKFxuICAgIGlycmVndWxhclBsdXJhbHMsIGlycmVndWxhclNpbmdsZXMsIHNpbmd1bGFyUnVsZXNcbiAgKTtcblxuICAvKipcbiAgICogQWRkIGEgcGx1cmFsaXphdGlvbiBydWxlIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwKX0gcnVsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICAgcmVwbGFjZW1lbnRcbiAgICovXG4gIHBsdXJhbGl6ZS5hZGRQbHVyYWxSdWxlID0gZnVuY3Rpb24gKHJ1bGUsIHJlcGxhY2VtZW50KSB7XG4gICAgcGx1cmFsUnVsZXMucHVzaChbc2FuaXRpemVSdWxlKHJ1bGUpLCByZXBsYWNlbWVudF0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgYSBzaW5ndWxhcml6YXRpb24gcnVsZSB0byB0aGUgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cCl9IHJ1bGVcbiAgICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgIHJlcGxhY2VtZW50XG4gICAqL1xuICBwbHVyYWxpemUuYWRkU2luZ3VsYXJSdWxlID0gZnVuY3Rpb24gKHJ1bGUsIHJlcGxhY2VtZW50KSB7XG4gICAgc2luZ3VsYXJSdWxlcy5wdXNoKFtzYW5pdGl6ZVJ1bGUocnVsZSksIHJlcGxhY2VtZW50XSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhbiB1bmNvdW50YWJsZSB3b3JkIHJ1bGUuXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xSZWdFeHApfSB3b3JkXG4gICAqL1xuICBwbHVyYWxpemUuYWRkVW5jb3VudGFibGVSdWxlID0gZnVuY3Rpb24gKHdvcmQpIHtcbiAgICBpZiAodHlwZW9mIHdvcmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdW5jb3VudGFibGVzW3dvcmQudG9Mb3dlckNhc2UoKV0gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFNldCBzaW5ndWxhciBhbmQgcGx1cmFsIHJlZmVyZW5jZXMgZm9yIHRoZSB3b3JkLlxuICAgIHBsdXJhbGl6ZS5hZGRQbHVyYWxSdWxlKHdvcmQsICckMCcpO1xuICAgIHBsdXJhbGl6ZS5hZGRTaW5ndWxhclJ1bGUod29yZCwgJyQwJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBpcnJlZ3VsYXIgd29yZCBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2luZ2xlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwbHVyYWxcbiAgICovXG4gIHBsdXJhbGl6ZS5hZGRJcnJlZ3VsYXJSdWxlID0gZnVuY3Rpb24gKHNpbmdsZSwgcGx1cmFsKSB7XG4gICAgcGx1cmFsID0gcGx1cmFsLnRvTG93ZXJDYXNlKCk7XG4gICAgc2luZ2xlID0gc2luZ2xlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBpcnJlZ3VsYXJTaW5nbGVzW3NpbmdsZV0gPSBwbHVyYWw7XG4gICAgaXJyZWd1bGFyUGx1cmFsc1twbHVyYWxdID0gc2luZ2xlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBJcnJlZ3VsYXIgcnVsZXMuXG4gICAqL1xuICBbXG4gICAgLy8gUHJvbm91bnMuXG4gICAgWydJJywgICAgICAgICd3ZSddLFxuICAgIFsnbWUnLCAgICAgICAndXMnXSxcbiAgICBbJ2hlJywgICAgICAgJ3RoZXknXSxcbiAgICBbJ3NoZScsICAgICAgJ3RoZXknXSxcbiAgICBbJ3RoZW0nLCAgICAgJ3RoZW0nXSxcbiAgICBbJ215c2VsZicsICAgJ291cnNlbHZlcyddLFxuICAgIFsneW91cnNlbGYnLCAneW91cnNlbHZlcyddLFxuICAgIFsnaXRzZWxmJywgICAndGhlbXNlbHZlcyddLFxuICAgIFsnaGVyc2VsZicsICAndGhlbXNlbHZlcyddLFxuICAgIFsnaGltc2VsZicsICAndGhlbXNlbHZlcyddLFxuICAgIFsndGhlbXNlbGYnLCAndGhlbXNlbHZlcyddLFxuICAgIFsndGhpcycsICAgICAndGhlc2UnXSxcbiAgICBbJ3RoYXQnLCAgICAgJ3Rob3NlJ10sXG4gICAgLy8gV29yZHMgZW5kaW5nIGluIHdpdGggYSBjb25zb25hbnQgYW5kIGBvYC5cbiAgICBbJ2VjaG8nLCAnZWNob2VzJ10sXG4gICAgWydkaW5nbycsICdkaW5nb2VzJ10sXG4gICAgWyd2b2xjYW5vJywgJ3ZvbGNhbm9lcyddLFxuICAgIFsndG9ybmFkbycsICd0b3JuYWRvZXMnXSxcbiAgICBbJ3RvcnBlZG8nLCAndG9ycGVkb2VzJ10sXG4gICAgLy8gRW5kcyB3aXRoIGB1c2AuXG4gICAgWydnZW51cycsICAnZ2VuZXJhJ10sXG4gICAgWyd2aXNjdXMnLCAndmlzY2VyYSddLFxuICAgIC8vIEVuZHMgd2l0aCBgbWFgLlxuICAgIFsnc3RpZ21hJywgICAnc3RpZ21hdGEnXSxcbiAgICBbJ3N0b21hJywgICAgJ3N0b21hdGEnXSxcbiAgICBbJ2RvZ21hJywgICAgJ2RvZ21hdGEnXSxcbiAgICBbJ2xlbW1hJywgICAgJ2xlbW1hdGEnXSxcbiAgICBbJ3NjaGVtYScsICAgJ3NjaGVtYXRhJ10sXG4gICAgWydhbmF0aGVtYScsICdhbmF0aGVtYXRhJ10sXG4gICAgLy8gT3RoZXIgaXJyZWd1bGFyIHJ1bGVzLlxuICAgIFsnb3gnLCAgICAgICdveGVuJ10sXG4gICAgWydheGUnLCAgICAgJ2F4ZXMnXSxcbiAgICBbJ2RpZScsICAgICAnZGljZSddLFxuICAgIFsneWVzJywgICAgICd5ZXNlcyddLFxuICAgIFsnZm9vdCcsICAgICdmZWV0J10sXG4gICAgWydlYXZlJywgICAgJ2VhdmVzJ10sXG4gICAgWydnb29zZScsICAgJ2dlZXNlJ10sXG4gICAgWyd0b290aCcsICAgJ3RlZXRoJ10sXG4gICAgWydxdWl6JywgICAgJ3F1aXp6ZXMnXSxcbiAgICBbJ2h1bWFuJywgICAnaHVtYW5zJ10sXG4gICAgWydwcm9vZicsICAgJ3Byb29mcyddLFxuICAgIFsnY2FydmUnLCAgICdjYXJ2ZXMnXSxcbiAgICBbJ3ZhbHZlJywgICAndmFsdmVzJ10sXG4gICAgWyd0aGllZicsICAgJ3RoaWV2ZXMnXSxcbiAgICBbJ2dlbmllJywgICAnZ2VuaWVzJ10sXG4gICAgWydncm9vdmUnLCAgJ2dyb292ZXMnXSxcbiAgICBbJ3BpY2theGUnLCAncGlja2F4ZXMnXSxcbiAgICBbJ3doaXNrZXknLCAnd2hpc2tpZXMnXVxuICBdLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICByZXR1cm4gcGx1cmFsaXplLmFkZElycmVndWxhclJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBQbHVyYWxpemF0aW9uIHJ1bGVzLlxuICAgKi9cbiAgW1xuICAgIFsvcz8kL2ksICdzJ10sXG4gICAgWy8oW15hZWlvdV1lc2UpJC9pLCAnJDEnXSxcbiAgICBbLyhheHx0ZXN0KWlzJC9pLCAnJDFlcyddLFxuICAgIFsvKGFsaWFzfFteYW91XXVzfHRsYXN8Z2FzfHJpcykkL2ksICckMWVzJ10sXG4gICAgWy8oZVttbl11KXM/JC9pLCAnJDFzJ10sXG4gICAgWy8oW15sXWlhc3xbYWVpb3VdbGFzfFtlbWp6cl1hc3xbaXVdYW0pJC9pLCAnJDEnXSxcbiAgICBbLyhhbHVtbnxzeWxsYWJ8b2N0b3B8dmlyfHJhZGl8bnVjbGV8ZnVuZ3xjYWN0fHN0aW11bHx0ZXJtaW58YmFjaWxsfGZvY3x1dGVyfGxvY3xzdHJhdCkoPzp1c3xpKSQvaSwgJyQxaSddLFxuICAgIFsvKGFsdW1ufGFsZ3x2ZXJ0ZWJyKSg/OmF8YWUpJC9pLCAnJDFhZSddLFxuICAgIFsvKHNlcmFwaHxjaGVydWIpKD86aW0pPyQvaSwgJyQxaW0nXSxcbiAgICBbLyhoZXJ8YXR8Z3IpbyQvaSwgJyQxb2VzJ10sXG4gICAgWy8oYWdlbmR8YWRkZW5kfG1pbGxlbm5pfGRhdHxleHRyZW18YmFjdGVyaXxkZXNpZGVyYXR8c3RyYXR8Y2FuZGVsYWJyfGVycmF0fG92fHN5bXBvc2l8Y3VycmljdWx8YXV0b21hdHxxdW9yKSg/OmF8dW0pJC9pLCAnJDFhJ10sXG4gICAgWy8oYXBoZWxpfGh5cGVyYmF0fHBlcmloZWxpfGFzeW5kZXR8bm91bWVufHBoZW5vbWVufGNyaXRlcml8b3JnYW58cHJvbGVnb21lbnxcXHcraGVkcikoPzphfG9uKSQvaSwgJyQxYSddLFxuICAgIFsvc2lzJC9pLCAnc2VzJ10sXG4gICAgWy8oPzooaSlmZXwoYXJ8bHxlYXxlb3xvYXxob28pZikkL2ksICckMSQydmVzJ10sXG4gICAgWy8oW15hZWlvdXldfHF1KXkkL2ksICckMWllcyddLFxuICAgIFsvKFteY2hdW2llb11bbG5dKWV5JC9pLCAnJDFpZXMnXSxcbiAgICBbLyh4fGNofHNzfHNofHp6KSQvaSwgJyQxZXMnXSxcbiAgICBbLyhtYXRyfGNvZHxtdXJ8c2lsfHZlcnR8aW5kfGFwcGVuZCkoPzppeHxleCkkL2ksICckMWljZXMnXSxcbiAgICBbLyhtfGwpKD86aWNlfG91c2UpJC9pLCAnJDFpY2UnXSxcbiAgICBbLyhwZSkoPzpyc29ufG9wbGUpJC9pLCAnJDFvcGxlJ10sXG4gICAgWy8oY2hpbGQpKD86cmVuKT8kL2ksICckMXJlbiddLFxuICAgIFsvZWF1eCQvaSwgJyQwJ10sXG4gICAgWy9tW2FlXW4kL2ksICdtZW4nXVxuICBdLmZvckVhY2goZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICByZXR1cm4gcGx1cmFsaXplLmFkZFBsdXJhbFJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBTaW5ndWxhcml6YXRpb24gcnVsZXMuXG4gICAqL1xuICBbXG4gICAgWy9zJC9pLCAnJ10sXG4gICAgWy8oc3MpJC9pLCAnJDEnXSxcbiAgICBbLygoYSluYWx5fChiKWF8KGQpaWFnbm98KHApYXJlbnRoZXwocClyb2dub3wocyl5bm9wfCh0KWhlKSg/OnNpc3xzZXMpJC9pLCAnJDFzaXMnXSxcbiAgICBbLyheYW5hbHkpKD86c2lzfHNlcykkL2ksICckMXNpcyddLFxuICAgIFsvKFteYWVmbG9yXSl2ZXMkL2ksICckMWZlJ10sXG4gICAgWy8oaGl2ZXx0aXZlfGRyP2l2ZSlzJC9pLCAnJDEnXSxcbiAgICBbLyhhcnwoPzp3b3xbYWVdKWx8W2VvXVthb10pdmVzJC9pLCAnJDFmJ10sXG4gICAgWy8oW15hZWlvdXldfHF1KWllcyQvaSwgJyQxeSddLFxuICAgIFsvKF5bcGxdfHpvbWJ8Xig/Om5lY2spP3R8W2Flb11bbHRdfGN1dClpZXMkL2ksICckMWllJ10sXG4gICAgWy8oW15jXVtlb3JdbnxzbWlsKWllcyQvaSwgJyQxZXknXSxcbiAgICBbLyhtfGwpaWNlJC9pLCAnJDFvdXNlJ10sXG4gICAgWy8oc2VyYXBofGNoZXJ1YilpbSQvaSwgJyQxJ10sXG4gICAgWy8oeHxjaHxzc3xzaHx6enx0dG98Z298Y2hvfGFsaWFzfFteYW91XXVzfHRsYXN8Z2FzfCg/OmhlcnxhdHxncilvfHJpcykoPzplcyk/JC9pLCAnJDEnXSxcbiAgICBbLyhlW21uXXUpcz8kL2ksICckMSddLFxuICAgIFsvKG1vdmllfHR3ZWx2ZSlzJC9pLCAnJDEnXSxcbiAgICBbLyhjcmlzfHRlc3R8ZGlhZ25vcykoPzppc3xlcykkL2ksICckMWlzJ10sXG4gICAgWy8oYWx1bW58c3lsbGFifG9jdG9wfHZpcnxyYWRpfG51Y2xlfGZ1bmd8Y2FjdHxzdGltdWx8dGVybWlufGJhY2lsbHxmb2N8dXRlcnxsb2N8c3RyYXQpKD86dXN8aSkkL2ksICckMXVzJ10sXG4gICAgWy8oYWdlbmR8YWRkZW5kfG1pbGxlbm5pfGRhdHxleHRyZW18YmFjdGVyaXxkZXNpZGVyYXR8c3RyYXR8Y2FuZGVsYWJyfGVycmF0fG92fHN5bXBvc2l8Y3VycmljdWx8YXV0b21hdHxxdW9yKWEkL2ksICckMXVtJ10sXG4gICAgWy8oYXBoZWxpfGh5cGVyYmF0fHBlcmloZWxpfGFzeW5kZXR8bm91bWVufHBoZW5vbWVufGNyaXRlcml8b3JnYW58cHJvbGVnb21lbnxcXHcraGVkcilhJC9pLCAnJDFvbiddLFxuICAgIFsvKGFsdW1ufGFsZ3x2ZXJ0ZWJyKWFlJC9pLCAnJDFhJ10sXG4gICAgWy8oY29kfG11cnxzaWx8dmVydHxpbmQpaWNlcyQvaSwgJyQxZXgnXSxcbiAgICBbLyhtYXRyfGFwcGVuZClpY2VzJC9pLCAnJDFpeCddLFxuICAgIFsvKHBlKShyc29ufG9wbGUpJC9pLCAnJDFyc29uJ10sXG4gICAgWy8oY2hpbGQpcmVuJC9pLCAnJDEnXSxcbiAgICBbLyhlYXUpeD8kL2ksICckMSddLFxuICAgIFsvbWVuJC9pLCAnbWFuJ11cbiAgXS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlKSB7XG4gICAgcmV0dXJuIHBsdXJhbGl6ZS5hZGRTaW5ndWxhclJ1bGUocnVsZVswXSwgcnVsZVsxXSk7XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBVbmNvdW50YWJsZSBydWxlcy5cbiAgICovXG4gIFtcbiAgICAvLyBTaW5ndWxhciB3b3JkcyB3aXRoIG5vIHBsdXJhbHMuXG4gICAgJ2FkdmljZScsXG4gICAgJ2FnZW5kYScsXG4gICAgJ2Jpc29uJyxcbiAgICAnYnJlYW0nLFxuICAgICdidWZmYWxvJyxcbiAgICAnY2FycCcsXG4gICAgJ2NoYXNzaXMnLFxuICAgICdjb2QnLFxuICAgICdjb29wZXJhdGlvbicsXG4gICAgJ2NvcnBzJyxcbiAgICAnZGlnZXN0aW9uJyxcbiAgICAnZGVicmlzJyxcbiAgICAnZGlhYmV0ZXMnLFxuICAgICdlbmVyZ3knLFxuICAgICdlcXVpcG1lbnQnLFxuICAgICdlbGsnLFxuICAgICdleGNyZXRpb24nLFxuICAgICdleHBlcnRpc2UnLFxuICAgICdmbG91bmRlcicsXG4gICAgJ2dhbGxvd3MnLFxuICAgICdncmFmZml0aScsXG4gICAgJ2hlYWRxdWFydGVycycsXG4gICAgJ2hlYWx0aCcsXG4gICAgJ2hlcnBlcycsXG4gICAgJ2hpZ2hqaW5rcycsXG4gICAgJ2hvbWV3b3JrJyxcbiAgICAnaW5mb3JtYXRpb24nLFxuICAgICdqZWFucycsXG4gICAgJ2p1c3RpY2UnLFxuICAgICdrdWRvcycsXG4gICAgJ2xhYm91cicsXG4gICAgJ21hY2hpbmVyeScsXG4gICAgJ21hY2tlcmVsJyxcbiAgICAnbWVkaWEnLFxuICAgICdtZXdzJyxcbiAgICAnbW9vc2UnLFxuICAgICduZXdzJyxcbiAgICAncGlrZScsXG4gICAgJ3BsYW5rdG9uJyxcbiAgICAncGxpZXJzJyxcbiAgICAncG9sbHV0aW9uJyxcbiAgICAncHJlbWlzZXMnLFxuICAgICdyYWluJyxcbiAgICAncmljZScsXG4gICAgJ3NhbG1vbicsXG4gICAgJ3NjaXNzb3JzJyxcbiAgICAnc2VyaWVzJyxcbiAgICAnc2V3YWdlJyxcbiAgICAnc2hhbWJsZXMnLFxuICAgICdzaHJpbXAnLFxuICAgICdzcGVjaWVzJyxcbiAgICAnc3RhZmYnLFxuICAgICdzd2luZScsXG4gICAgJ3Ryb3V0JyxcbiAgICAndHVuYScsXG4gICAgJ3doaXRpbmcnLFxuICAgICd3aWxkZWJlZXN0JyxcbiAgICAnd2lsZGxpZmUnLFxuICAgIC8vIFJlZ2V4ZXMuXG4gICAgL3BveCQvaSwgLy8gXCJjaGlja3BveFwiLCBcInNtYWxscG94XCJcbiAgICAvb2lzJC9pLFxuICAgIC9kZWVyJC9pLCAvLyBcImRlZXJcIiwgXCJyZWluZGVlclwiXG4gICAgL2Zpc2gkL2ksIC8vIFwiZmlzaFwiLCBcImJsb3dmaXNoXCIsIFwiYW5nZWxmaXNoXCJcbiAgICAvc2hlZXAkL2ksXG4gICAgL21lYXNsZXMkL2ksXG4gICAgL1teYWVpb3VdZXNlJC9pIC8vIFwiY2hpbmVzZVwiLCBcImphcGFuZXNlXCJcbiAgXS5mb3JFYWNoKHBsdXJhbGl6ZS5hZGRVbmNvdW50YWJsZVJ1bGUpO1xuXG4gIHJldHVybiBwbHVyYWxpemU7XG59KTtcbiIsInZhciBpbnNlcnRlZCA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MsIG9wdGlvbnMpIHtcbiAgICBpZiAoaW5zZXJ0ZWRbY3NzXSkgcmV0dXJuO1xuICAgIGluc2VydGVkW2Nzc10gPSB0cnVlO1xuICAgIFxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBlbGVtLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuXG4gICAgaWYgKCd0ZXh0Q29udGVudCcgaW4gZWxlbSkge1xuICAgICAgZWxlbS50ZXh0Q29udGVudCA9IGNzcztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gICAgfVxuICAgIFxuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnByZXBlbmQpIHtcbiAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoZWxlbSwgaGVhZC5jaGlsZE5vZGVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGVsZW0pO1xuICAgIH1cbn07XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkVGFyZ2V0KHBhdGgsIG1hdGNoZXIsIGRlbGVnYXRlKSB7XG4gICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgdGhpcy5tYXRjaGVyID0gbWF0Y2hlcjtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcbiAgICB9XG5cbiAgICAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRUYXJnZXQucHJvdG90eXBlID0ge1xuICAgICAgdG86IGZ1bmN0aW9uKHRhcmdldCwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gdGhpcy5kZWxlZ2F0ZTtcblxuICAgICAgICBpZiAoZGVsZWdhdGUgJiYgZGVsZWdhdGUud2lsbEFkZFJvdXRlKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gZGVsZWdhdGUud2lsbEFkZFJvdXRlKHRoaXMubWF0Y2hlci50YXJnZXQsIHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hdGNoZXIuYWRkKHRoaXMucGF0aCwgdGFyZ2V0KTtcblxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2subGVuZ3RoID09PSAwKSB7IHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGhhdmUgYW4gYXJndW1lbnQgaW4gdGhlIGZ1bmN0aW9uIHBhc3NlZCB0byBgdG9gXCIpOyB9XG4gICAgICAgICAgdGhpcy5tYXRjaGVyLmFkZENoaWxkKHRoaXMucGF0aCwgdGFyZ2V0LCBjYWxsYmFjaywgdGhpcy5kZWxlZ2F0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciRkc2wkJE1hdGNoZXIodGFyZ2V0KSB7XG4gICAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgICAgdGhpcy5jaGlsZHJlbiA9IHt9O1xuICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgfVxuXG4gICAgJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkTWF0Y2hlci5wcm90b3R5cGUgPSB7XG4gICAgICBhZGQ6IGZ1bmN0aW9uKHBhdGgsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5yb3V0ZXNbcGF0aF0gPSBoYW5kbGVyO1xuICAgICAgfSxcblxuICAgICAgYWRkQ2hpbGQ6IGZ1bmN0aW9uKHBhdGgsIHRhcmdldCwgY2FsbGJhY2ssIGRlbGVnYXRlKSB7XG4gICAgICAgIHZhciBtYXRjaGVyID0gbmV3ICQkcm91dGUkcmVjb2duaXplciRkc2wkJE1hdGNoZXIodGFyZ2V0KTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbltwYXRoXSA9IG1hdGNoZXI7XG5cbiAgICAgICAgdmFyIG1hdGNoID0gJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkZ2VuZXJhdGVNYXRjaChwYXRoLCBtYXRjaGVyLCBkZWxlZ2F0ZSk7XG5cbiAgICAgICAgaWYgKGRlbGVnYXRlICYmIGRlbGVnYXRlLmNvbnRleHRFbnRlcmVkKSB7XG4gICAgICAgICAgZGVsZWdhdGUuY29udGV4dEVudGVyZWQodGFyZ2V0LCBtYXRjaCk7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhtYXRjaCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciRkc2wkJGdlbmVyYXRlTWF0Y2goc3RhcnRpbmdQYXRoLCBtYXRjaGVyLCBkZWxlZ2F0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHBhdGgsIG5lc3RlZENhbGxiYWNrKSB7XG4gICAgICAgIHZhciBmdWxsUGF0aCA9IHN0YXJ0aW5nUGF0aCArIHBhdGg7XG5cbiAgICAgICAgaWYgKG5lc3RlZENhbGxiYWNrKSB7XG4gICAgICAgICAgbmVzdGVkQ2FsbGJhY2soJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkZ2VuZXJhdGVNYXRjaChmdWxsUGF0aCwgbWF0Y2hlciwgZGVsZWdhdGUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbmV3ICQkcm91dGUkcmVjb2duaXplciRkc2wkJFRhcmdldChzdGFydGluZ1BhdGggKyBwYXRoLCBtYXRjaGVyLCBkZWxlZ2F0ZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkYWRkUm91dGUocm91dGVBcnJheSwgcGF0aCwgaGFuZGxlcikge1xuICAgICAgdmFyIGxlbiA9IDA7XG4gICAgICBmb3IgKHZhciBpPTAsIGw9cm91dGVBcnJheS5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICAgIGxlbiArPSByb3V0ZUFycmF5W2ldLnBhdGgubGVuZ3RoO1xuICAgICAgfVxuXG4gICAgICBwYXRoID0gcGF0aC5zdWJzdHIobGVuKTtcbiAgICAgIHZhciByb3V0ZSA9IHsgcGF0aDogcGF0aCwgaGFuZGxlcjogaGFuZGxlciB9O1xuICAgICAgcm91dGVBcnJheS5wdXNoKHJvdXRlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRlYWNoUm91dGUoYmFzZVJvdXRlLCBtYXRjaGVyLCBjYWxsYmFjaywgYmluZGluZykge1xuICAgICAgdmFyIHJvdXRlcyA9IG1hdGNoZXIucm91dGVzO1xuXG4gICAgICBmb3IgKHZhciBwYXRoIGluIHJvdXRlcykge1xuICAgICAgICBpZiAocm91dGVzLmhhc093blByb3BlcnR5KHBhdGgpKSB7XG4gICAgICAgICAgdmFyIHJvdXRlQXJyYXkgPSBiYXNlUm91dGUuc2xpY2UoKTtcbiAgICAgICAgICAkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRhZGRSb3V0ZShyb3V0ZUFycmF5LCBwYXRoLCByb3V0ZXNbcGF0aF0pO1xuXG4gICAgICAgICAgaWYgKG1hdGNoZXIuY2hpbGRyZW5bcGF0aF0pIHtcbiAgICAgICAgICAgICQkcm91dGUkcmVjb2duaXplciRkc2wkJGVhY2hSb3V0ZShyb3V0ZUFycmF5LCBtYXRjaGVyLmNoaWxkcmVuW3BhdGhdLCBjYWxsYmFjaywgYmluZGluZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoYmluZGluZywgcm91dGVBcnJheSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyICQkcm91dGUkcmVjb2duaXplciRkc2wkJGRlZmF1bHQgPSBmdW5jdGlvbihjYWxsYmFjaywgYWRkUm91dGVDYWxsYmFjaykge1xuICAgICAgdmFyIG1hdGNoZXIgPSBuZXcgJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkTWF0Y2hlcigpO1xuXG4gICAgICBjYWxsYmFjaygkJHJvdXRlJHJlY29nbml6ZXIkZHNsJCRnZW5lcmF0ZU1hdGNoKFwiXCIsIG1hdGNoZXIsIHRoaXMuZGVsZWdhdGUpKTtcblxuICAgICAgJCRyb3V0ZSRyZWNvZ25pemVyJGRzbCQkZWFjaFJvdXRlKFtdLCBtYXRjaGVyLCBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICBpZiAoYWRkUm91dGVDYWxsYmFjaykgeyBhZGRSb3V0ZUNhbGxiYWNrKHRoaXMsIHJvdXRlKTsgfVxuICAgICAgICBlbHNlIHsgdGhpcy5hZGQocm91dGUpOyB9XG4gICAgICB9LCB0aGlzKTtcbiAgICB9O1xuXG4gICAgdmFyICQkcm91dGUkcmVjb2duaXplciQkc3BlY2lhbHMgPSBbXG4gICAgICAnLycsICcuJywgJyonLCAnKycsICc/JywgJ3wnLFxuICAgICAgJygnLCAnKScsICdbJywgJ10nLCAneycsICd9JywgJ1xcXFwnXG4gICAgXTtcblxuICAgIHZhciAkJHJvdXRlJHJlY29nbml6ZXIkJGVzY2FwZVJlZ2V4ID0gbmV3IFJlZ0V4cCgnKFxcXFwnICsgJCRyb3V0ZSRyZWNvZ25pemVyJCRzcGVjaWFscy5qb2luKCd8XFxcXCcpICsgJyknLCAnZycpO1xuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJCRpc0FycmF5KHRlc3QpIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGVzdCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbiAgICB9XG5cbiAgICAvLyBBIFNlZ21lbnQgcmVwcmVzZW50cyBhIHNlZ21lbnQgaW4gdGhlIG9yaWdpbmFsIHJvdXRlIGRlc2NyaXB0aW9uLlxuICAgIC8vIEVhY2ggU2VnbWVudCB0eXBlIHByb3ZpZGVzIGFuIGBlYWNoQ2hhcmAgYW5kIGByZWdleGAgbWV0aG9kLlxuICAgIC8vXG4gICAgLy8gVGhlIGBlYWNoQ2hhcmAgbWV0aG9kIGludm9rZXMgdGhlIGNhbGxiYWNrIHdpdGggb25lIG9yIG1vcmUgY2hhcmFjdGVyXG4gICAgLy8gc3BlY2lmaWNhdGlvbnMuIEEgY2hhcmFjdGVyIHNwZWNpZmljYXRpb24gY29uc3VtZXMgb25lIG9yIG1vcmUgaW5wdXRcbiAgICAvLyBjaGFyYWN0ZXJzLlxuICAgIC8vXG4gICAgLy8gVGhlIGByZWdleGAgbWV0aG9kIHJldHVybnMgYSByZWdleCBmcmFnbWVudCBmb3IgdGhlIHNlZ21lbnQuIElmIHRoZVxuICAgIC8vIHNlZ21lbnQgaXMgYSBkeW5hbWljIG9mIHN0YXIgc2VnbWVudCwgdGhlIHJlZ2V4IGZyYWdtZW50IGFsc28gaW5jbHVkZXNcbiAgICAvLyBhIGNhcHR1cmUuXG4gICAgLy9cbiAgICAvLyBBIGNoYXJhY3RlciBzcGVjaWZpY2F0aW9uIGNvbnRhaW5zOlxuICAgIC8vXG4gICAgLy8gKiBgdmFsaWRDaGFyc2A6IGEgU3RyaW5nIHdpdGggYSBsaXN0IG9mIGFsbCB2YWxpZCBjaGFyYWN0ZXJzLCBvclxuICAgIC8vICogYGludmFsaWRDaGFyc2A6IGEgU3RyaW5nIHdpdGggYSBsaXN0IG9mIGFsbCBpbnZhbGlkIGNoYXJhY3RlcnNcbiAgICAvLyAqIGByZXBlYXRgOiB0cnVlIGlmIHRoZSBjaGFyYWN0ZXIgc3BlY2lmaWNhdGlvbiBjYW4gcmVwZWF0XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkJFN0YXRpY1NlZ21lbnQoc3RyaW5nKSB7IHRoaXMuc3RyaW5nID0gc3RyaW5nOyB9XG4gICAgJCRyb3V0ZSRyZWNvZ25pemVyJCRTdGF0aWNTZWdtZW50LnByb3RvdHlwZSA9IHtcbiAgICAgIGVhY2hDaGFyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICB2YXIgc3RyaW5nID0gdGhpcy5zdHJpbmcsIGNoO1xuXG4gICAgICAgIGZvciAodmFyIGk9MCwgbD1zdHJpbmcubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICAgIGNoID0gc3RyaW5nLmNoYXJBdChpKTtcbiAgICAgICAgICBjYWxsYmFjayh7IHZhbGlkQ2hhcnM6IGNoIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICByZWdleDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmluZy5yZXBsYWNlKCQkcm91dGUkcmVjb2duaXplciQkZXNjYXBlUmVnZXgsICdcXFxcJDEnKTtcbiAgICAgIH0sXG5cbiAgICAgIGdlbmVyYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5nO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkJER5bmFtaWNTZWdtZW50KG5hbWUpIHsgdGhpcy5uYW1lID0gbmFtZTsgfVxuICAgICQkcm91dGUkcmVjb2duaXplciQkRHluYW1pY1NlZ21lbnQucHJvdG90eXBlID0ge1xuICAgICAgZWFjaENoYXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIGNhbGxiYWNrKHsgaW52YWxpZENoYXJzOiBcIi9cIiwgcmVwZWF0OiB0cnVlIH0pO1xuICAgICAgfSxcblxuICAgICAgcmVnZXg6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gXCIoW14vXSspXCI7XG4gICAgICB9LFxuXG4gICAgICBnZW5lcmF0ZTogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBwYXJhbXNbdGhpcy5uYW1lXTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJCRTdGFyU2VnbWVudChuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWU7IH1cbiAgICAkJHJvdXRlJHJlY29nbml6ZXIkJFN0YXJTZWdtZW50LnByb3RvdHlwZSA9IHtcbiAgICAgIGVhY2hDaGFyOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayh7IGludmFsaWRDaGFyczogXCJcIiwgcmVwZWF0OiB0cnVlIH0pO1xuICAgICAgfSxcblxuICAgICAgcmVnZXg6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gXCIoLispXCI7XG4gICAgICB9LFxuXG4gICAgICBnZW5lcmF0ZTogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBwYXJhbXNbdGhpcy5uYW1lXTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJCRFcHNpbG9uU2VnbWVudCgpIHt9XG4gICAgJCRyb3V0ZSRyZWNvZ25pemVyJCRFcHNpbG9uU2VnbWVudC5wcm90b3R5cGUgPSB7XG4gICAgICBlYWNoQ2hhcjogZnVuY3Rpb24oKSB7fSxcbiAgICAgIHJlZ2V4OiBmdW5jdGlvbigpIHsgcmV0dXJuIFwiXCI7IH0sXG4gICAgICBnZW5lcmF0ZTogZnVuY3Rpb24oKSB7IHJldHVybiBcIlwiOyB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciQkcGFyc2Uocm91dGUsIG5hbWVzLCB0eXBlcykge1xuICAgICAgLy8gbm9ybWFsaXplIHJvdXRlIGFzIG5vdCBzdGFydGluZyB3aXRoIGEgXCIvXCIuIFJlY29nbml0aW9uIHdpbGxcbiAgICAgIC8vIGFsc28gbm9ybWFsaXplLlxuICAgICAgaWYgKHJvdXRlLmNoYXJBdCgwKSA9PT0gXCIvXCIpIHsgcm91dGUgPSByb3V0ZS5zdWJzdHIoMSk7IH1cblxuICAgICAgdmFyIHNlZ21lbnRzID0gcm91dGUuc3BsaXQoXCIvXCIpLCByZXN1bHRzID0gW107XG5cbiAgICAgIGZvciAodmFyIGk9MCwgbD1zZWdtZW50cy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICAgIHZhciBzZWdtZW50ID0gc2VnbWVudHNbaV0sIG1hdGNoO1xuXG4gICAgICAgIGlmIChtYXRjaCA9IHNlZ21lbnQubWF0Y2goL146KFteXFwvXSspJC8pKSB7XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyAkJHJvdXRlJHJlY29nbml6ZXIkJER5bmFtaWNTZWdtZW50KG1hdGNoWzFdKSk7XG4gICAgICAgICAgbmFtZXMucHVzaChtYXRjaFsxXSk7XG4gICAgICAgICAgdHlwZXMuZHluYW1pY3MrKztcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaCA9IHNlZ21lbnQubWF0Y2goL15cXCooW15cXC9dKykkLykpIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gobmV3ICQkcm91dGUkcmVjb2duaXplciQkU3RhclNlZ21lbnQobWF0Y2hbMV0pKTtcbiAgICAgICAgICBuYW1lcy5wdXNoKG1hdGNoWzFdKTtcbiAgICAgICAgICB0eXBlcy5zdGFycysrO1xuICAgICAgICB9IGVsc2UgaWYoc2VnbWVudCA9PT0gXCJcIikge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChuZXcgJCRyb3V0ZSRyZWNvZ25pemVyJCRFcHNpbG9uU2VnbWVudCgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRzLnB1c2gobmV3ICQkcm91dGUkcmVjb2duaXplciQkU3RhdGljU2VnbWVudChzZWdtZW50KSk7XG4gICAgICAgICAgdHlwZXMuc3RhdGljcysrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIC8vIEEgU3RhdGUgaGFzIGEgY2hhcmFjdGVyIHNwZWNpZmljYXRpb24gYW5kIChgY2hhclNwZWNgKSBhbmQgYSBsaXN0IG9mIHBvc3NpYmxlXG4gICAgLy8gc3Vic2VxdWVudCBzdGF0ZXMgKGBuZXh0U3RhdGVzYCkuXG4gICAgLy9cbiAgICAvLyBJZiBhIFN0YXRlIGlzIGFuIGFjY2VwdGluZyBzdGF0ZSwgaXQgd2lsbCBhbHNvIGhhdmUgc2V2ZXJhbCBhZGRpdGlvbmFsXG4gICAgLy8gcHJvcGVydGllczpcbiAgICAvL1xuICAgIC8vICogYHJlZ2V4YDogQSByZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBpcyB1c2VkIHRvIGV4dHJhY3QgcGFyYW1ldGVycyBmcm9tIHBhdGhzXG4gICAgLy8gICB0aGF0IHJlYWNoZWQgdGhpcyBhY2NlcHRpbmcgc3RhdGUuXG4gICAgLy8gKiBgaGFuZGxlcnNgOiBJbmZvcm1hdGlvbiBvbiBob3cgdG8gY29udmVydCB0aGUgbGlzdCBvZiBjYXB0dXJlcyBpbnRvIGNhbGxzXG4gICAgLy8gICB0byByZWdpc3RlcmVkIGhhbmRsZXJzIHdpdGggdGhlIHNwZWNpZmllZCBwYXJhbWV0ZXJzXG4gICAgLy8gKiBgdHlwZXNgOiBIb3cgbWFueSBzdGF0aWMsIGR5bmFtaWMgb3Igc3RhciBzZWdtZW50cyBpbiB0aGlzIHJvdXRlLiBVc2VkIHRvXG4gICAgLy8gICBkZWNpZGUgd2hpY2ggcm91dGUgdG8gdXNlIGlmIG11bHRpcGxlIHJlZ2lzdGVyZWQgcm91dGVzIG1hdGNoIGEgcGF0aC5cbiAgICAvL1xuICAgIC8vIEN1cnJlbnRseSwgU3RhdGUgaXMgaW1wbGVtZW50ZWQgbmFpdmVseSBieSBsb29waW5nIG92ZXIgYG5leHRTdGF0ZXNgIGFuZFxuICAgIC8vIGNvbXBhcmluZyBhIGNoYXJhY3RlciBzcGVjaWZpY2F0aW9uIGFnYWluc3QgYSBjaGFyYWN0ZXIuIEEgbW9yZSBlZmZpY2llbnRcbiAgICAvLyBpbXBsZW1lbnRhdGlvbiB3b3VsZCB1c2UgYSBoYXNoIG9mIGtleXMgcG9pbnRpbmcgYXQgb25lIG9yIG1vcmUgbmV4dCBzdGF0ZXMuXG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkJFN0YXRlKGNoYXJTcGVjKSB7XG4gICAgICB0aGlzLmNoYXJTcGVjID0gY2hhclNwZWM7XG4gICAgICB0aGlzLm5leHRTdGF0ZXMgPSBbXTtcbiAgICB9XG5cbiAgICAkJHJvdXRlJHJlY29nbml6ZXIkJFN0YXRlLnByb3RvdHlwZSA9IHtcbiAgICAgIGdldDogZnVuY3Rpb24oY2hhclNwZWMpIHtcbiAgICAgICAgdmFyIG5leHRTdGF0ZXMgPSB0aGlzLm5leHRTdGF0ZXM7XG5cbiAgICAgICAgZm9yICh2YXIgaT0wLCBsPW5leHRTdGF0ZXMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICAgIHZhciBjaGlsZCA9IG5leHRTdGF0ZXNbaV07XG5cbiAgICAgICAgICB2YXIgaXNFcXVhbCA9IGNoaWxkLmNoYXJTcGVjLnZhbGlkQ2hhcnMgPT09IGNoYXJTcGVjLnZhbGlkQ2hhcnM7XG4gICAgICAgICAgaXNFcXVhbCA9IGlzRXF1YWwgJiYgY2hpbGQuY2hhclNwZWMuaW52YWxpZENoYXJzID09PSBjaGFyU3BlYy5pbnZhbGlkQ2hhcnM7XG5cbiAgICAgICAgICBpZiAoaXNFcXVhbCkgeyByZXR1cm4gY2hpbGQ7IH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgcHV0OiBmdW5jdGlvbihjaGFyU3BlYykge1xuICAgICAgICB2YXIgc3RhdGU7XG5cbiAgICAgICAgLy8gSWYgdGhlIGNoYXJhY3RlciBzcGVjaWZpY2F0aW9uIGFscmVhZHkgZXhpc3RzIGluIGEgY2hpbGQgb2YgdGhlIGN1cnJlbnRcbiAgICAgICAgLy8gc3RhdGUsIGp1c3QgcmV0dXJuIHRoYXQgc3RhdGUuXG4gICAgICAgIGlmIChzdGF0ZSA9IHRoaXMuZ2V0KGNoYXJTcGVjKSkgeyByZXR1cm4gc3RhdGU7IH1cblxuICAgICAgICAvLyBNYWtlIGEgbmV3IHN0YXRlIGZvciB0aGUgY2hhcmFjdGVyIHNwZWNcbiAgICAgICAgc3RhdGUgPSBuZXcgJCRyb3V0ZSRyZWNvZ25pemVyJCRTdGF0ZShjaGFyU3BlYyk7XG5cbiAgICAgICAgLy8gSW5zZXJ0IHRoZSBuZXcgc3RhdGUgYXMgYSBjaGlsZCBvZiB0aGUgY3VycmVudCBzdGF0ZVxuICAgICAgICB0aGlzLm5leHRTdGF0ZXMucHVzaChzdGF0ZSk7XG5cbiAgICAgICAgLy8gSWYgdGhpcyBjaGFyYWN0ZXIgc3BlY2lmaWNhdGlvbiByZXBlYXRzLCBpbnNlcnQgdGhlIG5ldyBzdGF0ZSBhcyBhIGNoaWxkXG4gICAgICAgIC8vIG9mIGl0c2VsZi4gTm90ZSB0aGF0IHRoaXMgd2lsbCBub3QgdHJpZ2dlciBhbiBpbmZpbml0ZSBsb29wIGJlY2F1c2UgZWFjaFxuICAgICAgICAvLyB0cmFuc2l0aW9uIGR1cmluZyByZWNvZ25pdGlvbiBjb25zdW1lcyBhIGNoYXJhY3Rlci5cbiAgICAgICAgaWYgKGNoYXJTcGVjLnJlcGVhdCkge1xuICAgICAgICAgIHN0YXRlLm5leHRTdGF0ZXMucHVzaChzdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gdGhlIG5ldyBzdGF0ZVxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9LFxuXG4gICAgICAvLyBGaW5kIGEgbGlzdCBvZiBjaGlsZCBzdGF0ZXMgbWF0Y2hpbmcgdGhlIG5leHQgY2hhcmFjdGVyXG4gICAgICBtYXRjaDogZnVuY3Rpb24oY2gpIHtcbiAgICAgICAgLy8gREVCVUcgXCJQcm9jZXNzaW5nIGBcIiArIGNoICsgXCJgOlwiXG4gICAgICAgIHZhciBuZXh0U3RhdGVzID0gdGhpcy5uZXh0U3RhdGVzLFxuICAgICAgICAgICAgY2hpbGQsIGNoYXJTcGVjLCBjaGFycztcblxuICAgICAgICAvLyBERUJVRyBcIiAgXCIgKyBkZWJ1Z1N0YXRlKHRoaXMpXG4gICAgICAgIHZhciByZXR1cm5lZCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGk9MCwgbD1uZXh0U3RhdGVzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgICBjaGlsZCA9IG5leHRTdGF0ZXNbaV07XG5cbiAgICAgICAgICBjaGFyU3BlYyA9IGNoaWxkLmNoYXJTcGVjO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiAoY2hhcnMgPSBjaGFyU3BlYy52YWxpZENoYXJzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmIChjaGFycy5pbmRleE9mKGNoKSAhPT0gLTEpIHsgcmV0dXJuZWQucHVzaChjaGlsZCk7IH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiAoY2hhcnMgPSBjaGFyU3BlYy5pbnZhbGlkQ2hhcnMpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKGNoYXJzLmluZGV4T2YoY2gpID09PSAtMSkgeyByZXR1cm5lZC5wdXNoKGNoaWxkKTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXR1cm5lZDtcbiAgICAgIH1cblxuICAgICAgLyoqIElGIERFQlVHXG4gICAgICAsIGRlYnVnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYXJTcGVjID0gdGhpcy5jaGFyU3BlYyxcbiAgICAgICAgICAgIGRlYnVnID0gXCJbXCIsXG4gICAgICAgICAgICBjaGFycyA9IGNoYXJTcGVjLnZhbGlkQ2hhcnMgfHwgY2hhclNwZWMuaW52YWxpZENoYXJzO1xuXG4gICAgICAgIGlmIChjaGFyU3BlYy5pbnZhbGlkQ2hhcnMpIHsgZGVidWcgKz0gXCJeXCI7IH1cbiAgICAgICAgZGVidWcgKz0gY2hhcnM7XG4gICAgICAgIGRlYnVnICs9IFwiXVwiO1xuXG4gICAgICAgIGlmIChjaGFyU3BlYy5yZXBlYXQpIHsgZGVidWcgKz0gXCIrXCI7IH1cblxuICAgICAgICByZXR1cm4gZGVidWc7XG4gICAgICB9XG4gICAgICBFTkQgSUYgKiovXG4gICAgfTtcblxuICAgIC8qKiBJRiBERUJVR1xuICAgIGZ1bmN0aW9uIGRlYnVnKGxvZykge1xuICAgICAgY29uc29sZS5sb2cobG9nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWJ1Z1N0YXRlKHN0YXRlKSB7XG4gICAgICByZXR1cm4gc3RhdGUubmV4dFN0YXRlcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICBpZiAobi5uZXh0U3RhdGVzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gXCIoIFwiICsgbi5kZWJ1ZygpICsgXCIgW2FjY2VwdGluZ10gKVwiOyB9XG4gICAgICAgIHJldHVybiBcIiggXCIgKyBuLmRlYnVnKCkgKyBcIiA8dGhlbj4gXCIgKyBuLm5leHRTdGF0ZXMubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIHMuZGVidWcoKSB9KS5qb2luKFwiIG9yIFwiKSArIFwiIClcIjtcbiAgICAgIH0pLmpvaW4oXCIsIFwiKVxuICAgIH1cbiAgICBFTkQgSUYgKiovXG5cbiAgICAvLyBUaGlzIGlzIGEgc29tZXdoYXQgbmFpdmUgc3RyYXRlZ3ksIGJ1dCBzaG91bGQgd29yayBpbiBhIGxvdCBvZiBjYXNlc1xuICAgIC8vIEEgYmV0dGVyIHN0cmF0ZWd5IHdvdWxkIHByb3Blcmx5IHJlc29sdmUgL3Bvc3RzLzppZC9uZXcgYW5kIC9wb3N0cy9lZGl0LzppZC5cbiAgICAvL1xuICAgIC8vIFRoaXMgc3RyYXRlZ3kgZ2VuZXJhbGx5IHByZWZlcnMgbW9yZSBzdGF0aWMgYW5kIGxlc3MgZHluYW1pYyBtYXRjaGluZy5cbiAgICAvLyBTcGVjaWZpY2FsbHksIGl0XG4gICAgLy9cbiAgICAvLyAgKiBwcmVmZXJzIGZld2VyIHN0YXJzIHRvIG1vcmUsIHRoZW5cbiAgICAvLyAgKiBwcmVmZXJzIHVzaW5nIHN0YXJzIGZvciBsZXNzIG9mIHRoZSBtYXRjaCB0byBtb3JlLCB0aGVuXG4gICAgLy8gICogcHJlZmVycyBmZXdlciBkeW5hbWljIHNlZ21lbnRzIHRvIG1vcmUsIHRoZW5cbiAgICAvLyAgKiBwcmVmZXJzIG1vcmUgc3RhdGljIHNlZ21lbnRzIHRvIG1vcmVcbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkJHNvcnRTb2x1dGlvbnMoc3RhdGVzKSB7XG4gICAgICByZXR1cm4gc3RhdGVzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICBpZiAoYS50eXBlcy5zdGFycyAhPT0gYi50eXBlcy5zdGFycykgeyByZXR1cm4gYS50eXBlcy5zdGFycyAtIGIudHlwZXMuc3RhcnM7IH1cblxuICAgICAgICBpZiAoYS50eXBlcy5zdGFycykge1xuICAgICAgICAgIGlmIChhLnR5cGVzLnN0YXRpY3MgIT09IGIudHlwZXMuc3RhdGljcykgeyByZXR1cm4gYi50eXBlcy5zdGF0aWNzIC0gYS50eXBlcy5zdGF0aWNzOyB9XG4gICAgICAgICAgaWYgKGEudHlwZXMuZHluYW1pY3MgIT09IGIudHlwZXMuZHluYW1pY3MpIHsgcmV0dXJuIGIudHlwZXMuZHluYW1pY3MgLSBhLnR5cGVzLmR5bmFtaWNzOyB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYS50eXBlcy5keW5hbWljcyAhPT0gYi50eXBlcy5keW5hbWljcykgeyByZXR1cm4gYS50eXBlcy5keW5hbWljcyAtIGIudHlwZXMuZHluYW1pY3M7IH1cbiAgICAgICAgaWYgKGEudHlwZXMuc3RhdGljcyAhPT0gYi50eXBlcy5zdGF0aWNzKSB7IHJldHVybiBiLnR5cGVzLnN0YXRpY3MgLSBhLnR5cGVzLnN0YXRpY3M7IH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciQkcmVjb2duaXplQ2hhcihzdGF0ZXMsIGNoKSB7XG4gICAgICB2YXIgbmV4dFN0YXRlcyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpPTAsIGw9c3RhdGVzLmxlbmd0aDsgaTxsOyBpKyspIHtcbiAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW2ldO1xuXG4gICAgICAgIG5leHRTdGF0ZXMgPSBuZXh0U3RhdGVzLmNvbmNhdChzdGF0ZS5tYXRjaChjaCkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV4dFN0YXRlcztcbiAgICB9XG5cbiAgICB2YXIgJCRyb3V0ZSRyZWNvZ25pemVyJCRvQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbihwcm90bykge1xuICAgICAgZnVuY3Rpb24gRigpIHt9XG4gICAgICBGLnByb3RvdHlwZSA9IHByb3RvO1xuICAgICAgcmV0dXJuIG5ldyBGKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciQkUmVjb2duaXplUmVzdWx0cyhxdWVyeVBhcmFtcykge1xuICAgICAgdGhpcy5xdWVyeVBhcmFtcyA9IHF1ZXJ5UGFyYW1zIHx8IHt9O1xuICAgIH1cbiAgICAkJHJvdXRlJHJlY29nbml6ZXIkJFJlY29nbml6ZVJlc3VsdHMucHJvdG90eXBlID0gJCRyb3V0ZSRyZWNvZ25pemVyJCRvQ3JlYXRlKHtcbiAgICAgIHNwbGljZTogQXJyYXkucHJvdG90eXBlLnNwbGljZSxcbiAgICAgIHNsaWNlOiAgQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgICAgcHVzaDogICBBcnJheS5wcm90b3R5cGUucHVzaCxcbiAgICAgIGxlbmd0aDogMCxcbiAgICAgIHF1ZXJ5UGFyYW1zOiBudWxsXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiAkJHJvdXRlJHJlY29nbml6ZXIkJGZpbmRIYW5kbGVyKHN0YXRlLCBwYXRoLCBxdWVyeVBhcmFtcykge1xuICAgICAgdmFyIGhhbmRsZXJzID0gc3RhdGUuaGFuZGxlcnMsIHJlZ2V4ID0gc3RhdGUucmVnZXg7XG4gICAgICB2YXIgY2FwdHVyZXMgPSBwYXRoLm1hdGNoKHJlZ2V4KSwgY3VycmVudENhcHR1cmUgPSAxO1xuICAgICAgdmFyIHJlc3VsdCA9IG5ldyAkJHJvdXRlJHJlY29nbml6ZXIkJFJlY29nbml6ZVJlc3VsdHMocXVlcnlQYXJhbXMpO1xuXG4gICAgICBmb3IgKHZhciBpPTAsIGw9aGFuZGxlcnMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGhhbmRsZXJzW2ldLCBuYW1lcyA9IGhhbmRsZXIubmFtZXMsIHBhcmFtcyA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGo9MCwgbT1uYW1lcy5sZW5ndGg7IGo8bTsgaisrKSB7XG4gICAgICAgICAgcGFyYW1zW25hbWVzW2pdXSA9IGNhcHR1cmVzW2N1cnJlbnRDYXB0dXJlKytdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0LnB1c2goeyBoYW5kbGVyOiBoYW5kbGVyLmhhbmRsZXIsIHBhcmFtczogcGFyYW1zLCBpc0R5bmFtaWM6ICEhbmFtZXMubGVuZ3RoIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkcm91dGUkcmVjb2duaXplciQkYWRkU2VnbWVudChjdXJyZW50U3RhdGUsIHNlZ21lbnQpIHtcbiAgICAgIHNlZ21lbnQuZWFjaENoYXIoZnVuY3Rpb24oY2gpIHtcbiAgICAgICAgdmFyIHN0YXRlO1xuXG4gICAgICAgIGN1cnJlbnRTdGF0ZSA9IGN1cnJlbnRTdGF0ZS5wdXQoY2gpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBjdXJyZW50U3RhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCRyb3V0ZSRyZWNvZ25pemVyJCRkZWNvZGVRdWVyeVBhcmFtUGFydChwYXJ0KSB7XG4gICAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNDAxL2ludGVyYWN0L2Zvcm1zLmh0bWwjaC0xNy4xMy40LjFcbiAgICAgIHBhcnQgPSBwYXJ0LnJlcGxhY2UoL1xcKy9nbSwgJyUyMCcpO1xuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChwYXJ0KTtcbiAgICB9XG5cbiAgICAvLyBUaGUgbWFpbiBpbnRlcmZhY2VcblxuICAgIHZhciAkJHJvdXRlJHJlY29nbml6ZXIkJFJvdXRlUmVjb2duaXplciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5yb290U3RhdGUgPSBuZXcgJCRyb3V0ZSRyZWNvZ25pemVyJCRTdGF0ZSgpO1xuICAgICAgdGhpcy5uYW1lcyA9IHt9O1xuICAgIH07XG5cblxuICAgICQkcm91dGUkcmVjb2duaXplciQkUm91dGVSZWNvZ25pemVyLnByb3RvdHlwZSA9IHtcbiAgICAgIGFkZDogZnVuY3Rpb24ocm91dGVzLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBjdXJyZW50U3RhdGUgPSB0aGlzLnJvb3RTdGF0ZSwgcmVnZXggPSBcIl5cIixcbiAgICAgICAgICAgIHR5cGVzID0geyBzdGF0aWNzOiAwLCBkeW5hbWljczogMCwgc3RhcnM6IDAgfSxcbiAgICAgICAgICAgIGhhbmRsZXJzID0gW10sIGFsbFNlZ21lbnRzID0gW10sIG5hbWU7XG5cbiAgICAgICAgdmFyIGlzRW1wdHkgPSB0cnVlO1xuXG4gICAgICAgIGZvciAodmFyIGk9MCwgbD1yb3V0ZXMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICAgIHZhciByb3V0ZSA9IHJvdXRlc1tpXSwgbmFtZXMgPSBbXTtcblxuICAgICAgICAgIHZhciBzZWdtZW50cyA9ICQkcm91dGUkcmVjb2duaXplciQkcGFyc2Uocm91dGUucGF0aCwgbmFtZXMsIHR5cGVzKTtcblxuICAgICAgICAgIGFsbFNlZ21lbnRzID0gYWxsU2VnbWVudHMuY29uY2F0KHNlZ21lbnRzKTtcblxuICAgICAgICAgIGZvciAodmFyIGo9MCwgbT1zZWdtZW50cy5sZW5ndGg7IGo8bTsgaisrKSB7XG4gICAgICAgICAgICB2YXIgc2VnbWVudCA9IHNlZ21lbnRzW2pdO1xuXG4gICAgICAgICAgICBpZiAoc2VnbWVudCBpbnN0YW5jZW9mICQkcm91dGUkcmVjb2duaXplciQkRXBzaWxvblNlZ21lbnQpIHsgY29udGludWU7IH1cblxuICAgICAgICAgICAgaXNFbXB0eSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBBZGQgYSBcIi9cIiBmb3IgdGhlIG5ldyBzZWdtZW50XG4gICAgICAgICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50U3RhdGUucHV0KHsgdmFsaWRDaGFyczogXCIvXCIgfSk7XG4gICAgICAgICAgICByZWdleCArPSBcIi9cIjtcblxuICAgICAgICAgICAgLy8gQWRkIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNlZ21lbnQgdG8gdGhlIE5GQSBhbmQgcmVnZXhcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9ICQkcm91dGUkcmVjb2duaXplciQkYWRkU2VnbWVudChjdXJyZW50U3RhdGUsIHNlZ21lbnQpO1xuICAgICAgICAgICAgcmVnZXggKz0gc2VnbWVudC5yZWdleCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBoYW5kbGVyID0geyBoYW5kbGVyOiByb3V0ZS5oYW5kbGVyLCBuYW1lczogbmFtZXMgfTtcbiAgICAgICAgICBoYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgICAgICBjdXJyZW50U3RhdGUgPSBjdXJyZW50U3RhdGUucHV0KHsgdmFsaWRDaGFyczogXCIvXCIgfSk7XG4gICAgICAgICAgcmVnZXggKz0gXCIvXCI7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50U3RhdGUuaGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICAgICAgY3VycmVudFN0YXRlLnJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleCArIFwiJFwiKTtcbiAgICAgICAgY3VycmVudFN0YXRlLnR5cGVzID0gdHlwZXM7XG5cbiAgICAgICAgaWYgKG5hbWUgPSBvcHRpb25zICYmIG9wdGlvbnMuYXMpIHtcbiAgICAgICAgICB0aGlzLm5hbWVzW25hbWVdID0ge1xuICAgICAgICAgICAgc2VnbWVudHM6IGFsbFNlZ21lbnRzLFxuICAgICAgICAgICAgaGFuZGxlcnM6IGhhbmRsZXJzXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgaGFuZGxlcnNGb3I6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdmFyIHJvdXRlID0gdGhpcy5uYW1lc1tuYW1lXSwgcmVzdWx0ID0gW107XG4gICAgICAgIGlmICghcm91dGUpIHsgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gcm91dGUgbmFtZWQgXCIgKyBuYW1lKTsgfVxuXG4gICAgICAgIGZvciAodmFyIGk9MCwgbD1yb3V0ZS5oYW5kbGVycy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocm91dGUuaGFuZGxlcnNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0sXG5cbiAgICAgIGhhc1JvdXRlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMubmFtZXNbbmFtZV07XG4gICAgICB9LFxuXG4gICAgICBnZW5lcmF0ZTogZnVuY3Rpb24obmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIHZhciByb3V0ZSA9IHRoaXMubmFtZXNbbmFtZV0sIG91dHB1dCA9IFwiXCI7XG4gICAgICAgIGlmICghcm91dGUpIHsgdGhyb3cgbmV3IEVycm9yKFwiVGhlcmUgaXMgbm8gcm91dGUgbmFtZWQgXCIgKyBuYW1lKTsgfVxuXG4gICAgICAgIHZhciBzZWdtZW50cyA9IHJvdXRlLnNlZ21lbnRzO1xuXG4gICAgICAgIGZvciAodmFyIGk9MCwgbD1zZWdtZW50cy5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHNlZ21lbnQgPSBzZWdtZW50c1tpXTtcblxuICAgICAgICAgIGlmIChzZWdtZW50IGluc3RhbmNlb2YgJCRyb3V0ZSRyZWNvZ25pemVyJCRFcHNpbG9uU2VnbWVudCkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgICAgb3V0cHV0ICs9IFwiL1wiO1xuICAgICAgICAgIG91dHB1dCArPSBzZWdtZW50LmdlbmVyYXRlKHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3V0cHV0LmNoYXJBdCgwKSAhPT0gJy8nKSB7IG91dHB1dCA9ICcvJyArIG91dHB1dDsgfVxuXG4gICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLnF1ZXJ5UGFyYW1zKSB7XG4gICAgICAgICAgb3V0cHV0ICs9IHRoaXMuZ2VuZXJhdGVRdWVyeVN0cmluZyhwYXJhbXMucXVlcnlQYXJhbXMsIHJvdXRlLmhhbmRsZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICB9LFxuXG4gICAgICBnZW5lcmF0ZVF1ZXJ5U3RyaW5nOiBmdW5jdGlvbihwYXJhbXMsIGhhbmRsZXJzKSB7XG4gICAgICAgIHZhciBwYWlycyA9IFtdO1xuICAgICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgICBmb3IodmFyIGtleSBpbiBwYXJhbXMpIHtcbiAgICAgICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBrZXlzLnNvcnQoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGtleXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcmFtc1trZXldO1xuICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHBhaXIgPSBlbmNvZGVVUklDb21wb25lbnQoa2V5KTtcbiAgICAgICAgICBpZiAoJCRyb3V0ZSRyZWNvZ25pemVyJCRpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgdmFyIGFycmF5UGFpciA9IGtleSArICdbXScgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWVbal0pO1xuICAgICAgICAgICAgICBwYWlycy5wdXNoKGFycmF5UGFpcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhaXIgKz0gXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICAgICAgICAgICAgcGFpcnMucHVzaChwYWlyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFpcnMubGVuZ3RoID09PSAwKSB7IHJldHVybiAnJzsgfVxuXG4gICAgICAgIHJldHVybiBcIj9cIiArIHBhaXJzLmpvaW4oXCImXCIpO1xuICAgICAgfSxcblxuICAgICAgcGFyc2VRdWVyeVN0cmluZzogZnVuY3Rpb24ocXVlcnlTdHJpbmcpIHtcbiAgICAgICAgdmFyIHBhaXJzID0gcXVlcnlTdHJpbmcuc3BsaXQoXCImXCIpLCBxdWVyeVBhcmFtcyA9IHt9O1xuICAgICAgICBmb3IodmFyIGk9MDsgaSA8IHBhaXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHBhaXIgICAgICA9IHBhaXJzW2ldLnNwbGl0KCc9JyksXG4gICAgICAgICAgICAgIGtleSAgICAgICA9ICQkcm91dGUkcmVjb2duaXplciQkZGVjb2RlUXVlcnlQYXJhbVBhcnQocGFpclswXSksXG4gICAgICAgICAgICAgIGtleUxlbmd0aCA9IGtleS5sZW5ndGgsXG4gICAgICAgICAgICAgIGlzQXJyYXkgPSBmYWxzZSxcbiAgICAgICAgICAgICAgdmFsdWU7XG4gICAgICAgICAgaWYgKHBhaXIubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICd0cnVlJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9IYW5kbGUgYXJyYXlzXG4gICAgICAgICAgICBpZiAoa2V5TGVuZ3RoID4gMiAmJiBrZXkuc2xpY2Uoa2V5TGVuZ3RoIC0yKSA9PT0gJ1tdJykge1xuICAgICAgICAgICAgICBpc0FycmF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAga2V5ID0ga2V5LnNsaWNlKDAsIGtleUxlbmd0aCAtIDIpO1xuICAgICAgICAgICAgICBpZighcXVlcnlQYXJhbXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5UGFyYW1zW2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSBwYWlyWzFdID8gJCRyb3V0ZSRyZWNvZ25pemVyJCRkZWNvZGVRdWVyeVBhcmFtUGFydChwYWlyWzFdKSA6ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNBcnJheSkge1xuICAgICAgICAgICAgcXVlcnlQYXJhbXNba2V5XS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcXVlcnlQYXJhbXNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcXVlcnlQYXJhbXM7XG4gICAgICB9LFxuXG4gICAgICByZWNvZ25pemU6IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICAgICAgdmFyIHN0YXRlcyA9IFsgdGhpcy5yb290U3RhdGUgXSxcbiAgICAgICAgICAgIHBhdGhMZW4sIGksIGwsIHF1ZXJ5U3RhcnQsIHF1ZXJ5UGFyYW1zID0ge30sXG4gICAgICAgICAgICBpc1NsYXNoRHJvcHBlZCA9IGZhbHNlO1xuXG4gICAgICAgIHF1ZXJ5U3RhcnQgPSBwYXRoLmluZGV4T2YoJz8nKTtcbiAgICAgICAgaWYgKHF1ZXJ5U3RhcnQgIT09IC0xKSB7XG4gICAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gcGF0aC5zdWJzdHIocXVlcnlTdGFydCArIDEsIHBhdGgubGVuZ3RoKTtcbiAgICAgICAgICBwYXRoID0gcGF0aC5zdWJzdHIoMCwgcXVlcnlTdGFydCk7XG4gICAgICAgICAgcXVlcnlQYXJhbXMgPSB0aGlzLnBhcnNlUXVlcnlTdHJpbmcocXVlcnlTdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0aCA9IGRlY29kZVVSSShwYXRoKTtcblxuICAgICAgICAvLyBERUJVRyBHUk9VUCBwYXRoXG5cbiAgICAgICAgaWYgKHBhdGguY2hhckF0KDApICE9PSBcIi9cIikgeyBwYXRoID0gXCIvXCIgKyBwYXRoOyB9XG5cbiAgICAgICAgcGF0aExlbiA9IHBhdGgubGVuZ3RoO1xuICAgICAgICBpZiAocGF0aExlbiA+IDEgJiYgcGF0aC5jaGFyQXQocGF0aExlbiAtIDEpID09PSBcIi9cIikge1xuICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigwLCBwYXRoTGVuIC0gMSk7XG4gICAgICAgICAgaXNTbGFzaERyb3BwZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpPTAsIGw9cGF0aC5sZW5ndGg7IGk8bDsgaSsrKSB7XG4gICAgICAgICAgc3RhdGVzID0gJCRyb3V0ZSRyZWNvZ25pemVyJCRyZWNvZ25pemVDaGFyKHN0YXRlcywgcGF0aC5jaGFyQXQoaSkpO1xuICAgICAgICAgIGlmICghc3RhdGVzLmxlbmd0aCkgeyBicmVhazsgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRU5EIERFQlVHIEdST1VQXG5cbiAgICAgICAgdmFyIHNvbHV0aW9ucyA9IFtdO1xuICAgICAgICBmb3IgKGk9MCwgbD1zdGF0ZXMubGVuZ3RoOyBpPGw7IGkrKykge1xuICAgICAgICAgIGlmIChzdGF0ZXNbaV0uaGFuZGxlcnMpIHsgc29sdXRpb25zLnB1c2goc3RhdGVzW2ldKTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGVzID0gJCRyb3V0ZSRyZWNvZ25pemVyJCRzb3J0U29sdXRpb25zKHNvbHV0aW9ucyk7XG5cbiAgICAgICAgdmFyIHN0YXRlID0gc29sdXRpb25zWzBdO1xuXG4gICAgICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5oYW5kbGVycykge1xuICAgICAgICAgIC8vIGlmIGEgdHJhaWxpbmcgc2xhc2ggd2FzIGRyb3BwZWQgYW5kIGEgc3RhciBzZWdtZW50IGlzIHRoZSBsYXN0IHNlZ21lbnRcbiAgICAgICAgICAvLyBzcGVjaWZpZWQsIHB1dCB0aGUgdHJhaWxpbmcgc2xhc2ggYmFja1xuICAgICAgICAgIGlmIChpc1NsYXNoRHJvcHBlZCAmJiBzdGF0ZS5yZWdleC5zb3VyY2Uuc2xpY2UoLTUpID09PSBcIiguKykkXCIpIHtcbiAgICAgICAgICAgIHBhdGggPSBwYXRoICsgXCIvXCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAkJHJvdXRlJHJlY29nbml6ZXIkJGZpbmRIYW5kbGVyKHN0YXRlLCBwYXRoLCBxdWVyeVBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJCRyb3V0ZSRyZWNvZ25pemVyJCRSb3V0ZVJlY29nbml6ZXIucHJvdG90eXBlLm1hcCA9ICQkcm91dGUkcmVjb2duaXplciRkc2wkJGRlZmF1bHQ7XG5cbiAgICAkJHJvdXRlJHJlY29nbml6ZXIkJFJvdXRlUmVjb2duaXplci5WRVJTSU9OID0gJzAuMS41JztcblxuICAgIHZhciAkJHJvdXRlJHJlY29nbml6ZXIkJGRlZmF1bHQgPSAkJHJvdXRlJHJlY29nbml6ZXIkJFJvdXRlUmVjb2duaXplcjtcblxuICAgIC8qIGdsb2JhbCBkZWZpbmU6dHJ1ZSBtb2R1bGU6dHJ1ZSB3aW5kb3c6IHRydWUgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmVbJ2FtZCddKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiAkJHJvdXRlJHJlY29nbml6ZXIkJGRlZmF1bHQ7IH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlWydleHBvcnRzJ10pIHtcbiAgICAgIG1vZHVsZVsnZXhwb3J0cyddID0gJCRyb3V0ZSRyZWNvZ25pemVyJCRkZWZhdWx0O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzWydSb3V0ZVJlY29nbml6ZXInXSA9ICQkcm91dGUkcmVjb2duaXplciQkZGVmYXVsdDtcbiAgICB9XG59KS5jYWxsKHRoaXMpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1yb3V0ZS1yZWNvZ25pemVyLmpzLm1hcCIsInZhciBSZWNvZ25pemVyID0gcmVxdWlyZSgncm91dGUtcmVjb2duaXplcicpXG52YXIgaGFzUHVzaFN0YXRlID0gdHlwZW9mIGhpc3RvcnkgIT09ICd1bmRlZmluZWQnICYmIGhpc3RvcnkucHVzaFN0YXRlXG5cbi8qKlxuICogUm91dGVyIGNvbnN0cnVjdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogICAgICAgICAgICAgICAgIC0ge1N0cmluZ30gcm9vdFxuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IGhhc2hiYW5nICAoZGVmYXVsdDogdHJ1ZSlcbiAqICAgICAgICAgICAgICAgICAtIHtCb29sZWFufSBwdXNoc3RhdGUgKGRlZmF1bHQ6IGZhbHNlKVxuICovXG5cbmZ1bmN0aW9uIFZ1ZVJvdXRlciAob3B0aW9ucykge1xuICB0aGlzLl9yZWNvZ25pemVyID0gbmV3IFJlY29nbml6ZXIoKVxuICB0aGlzLl9zdGFydGVkID0gZmFsc2VcbiAgdGhpcy5fdm0gPSBudWxsXG4gIHRoaXMuX2N1cnJlbnRQYXRoID0gbnVsbFxuICB0aGlzLl9ub3Rmb3VuZEhhbmRsZXIgPSBudWxsXG4gIHRoaXMuX3Jvb3QgPSBudWxsXG4gIHRoaXMuX2hhc1B1c2hTdGF0ZSA9IGhhc1B1c2hTdGF0ZVxuICB2YXIgcm9vdCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5yb290XG4gIGlmIChyb290KSB7XG4gICAgLy8gbWFrZSBzdXJlIHRoZXJlJ3MgdGhlIHN0YXJ0aW5nIHNsYXNoXG4gICAgaWYgKHJvb3QuY2hhckF0KDApICE9PSAnLycpIHtcbiAgICAgIHJvb3QgPSAnLycgKyByb290XG4gICAgfVxuICAgIC8vIHJlbW92ZSB0cmFpbGluZyBzbGFzaFxuICAgIHRoaXMuX3Jvb3QgPSByb290LnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgfVxuICB0aGlzLl9oYXNoYmFuZyA9ICEob3B0aW9ucyAmJiBvcHRpb25zLmhhc2hiYW5nID09PSBmYWxzZSlcbiAgdGhpcy5fcHVzaHN0YXRlID0gISEoaGFzUHVzaFN0YXRlICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5wdXNoc3RhdGUpXG59XG5cbnZhciBwID0gVnVlUm91dGVyLnByb3RvdHlwZVxuXG4vL1xuLy8gUHVibGljIEFQSVxuLy9cbi8vXG5cbi8qKlxuICogUmVnaXN0ZXIgYSBtYXAgb2YgdG9wLWxldmVsIHBhdGhzLlxuICovXG5cbnAubWFwID0gZnVuY3Rpb24gKG1hcCkge1xuICBmb3IgKHZhciByb3V0ZSBpbiBtYXApIHtcbiAgICB0aGlzLm9uKHJvdXRlLCBtYXBbcm91dGVdKVxuICB9XG59XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBzaW5nbGUgcm9vdC1sZXZlbCBwYXRoXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJvb3RQYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gKiAgICAgICAgICAgICAgICAgLSB7U3RyaW5nfSBjb21wb25lbnRcbiAqICAgICAgICAgICAgICAgICAtIHtPYmplY3R9IFtzdWJSb3V0ZXNdXG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gW2ZvcmNlUmVmcmVzaF1cbiAqICAgICAgICAgICAgICAgICAtIHtGdW5jdGlvbn0gW2JlZm9yZV1cbiAqICAgICAgICAgICAgICAgICAtIHtGdW5jdGlvbn0gW2FmdGVyXVxuICovXG5cbnAub24gPSBmdW5jdGlvbiAocm9vdFBhdGgsIGNvbmZpZykge1xuICBpZiAocm9vdFBhdGggPT09ICcqJykge1xuICAgIHRoaXMubm90Zm91bmQoY29uZmlnKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuX2FkZFJvdXRlKHJvb3RQYXRoLCBjb25maWcsIFtdKVxuICB9XG59XG5cbi8qKlxuICogU2V0IHRoZSBub3Rmb3VuZCByb3V0ZSBjb25maWcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICovXG5cbnAubm90Zm91bmQgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gIHRoaXMuX25vdGZvdW5kSGFuZGxlciA9IFt7IGhhbmRsZXI6IGNvbmZpZyB9XVxufVxuXG4vKipcbiAqIFNldCByZWRpcmVjdHMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG1hcFxuICovXG5cbnAucmVkaXJlY3QgPSBmdW5jdGlvbiAobWFwKSB7XG4gIC8vIFRPRE9cbiAgLy8gdXNlIGFub3RoZXIgcmVjb2duaXplciB0byByZWNvZ25pemUgcmVkaXJlY3RzXG59XG5cbi8qKlxuICogTmF2aWdhdGUgdG8gYSBnaXZlbiBwYXRoLlxuICogVGhlIHBhdGggaXMgYXNzdW1lZCB0byBiZSBhbHJlYWR5IGRlY29kZWQsIGFuZCB3aWxsXG4gKiBiZSByZXNvbHZlZCBhZ2FpbnN0IHJvb3QgKGlmIHByb3ZpZGVkKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKi9cblxucC5nbyA9IGZ1bmN0aW9uIChwYXRoLCBvcHRpb25zKSB7XG4gIGlmICh0aGlzLl9wdXNoc3RhdGUpIHtcbiAgICAvLyBtYWtlIGl0IHJlbGF0aXZlIHRvIHJvb3RcbiAgICBwYXRoID0gdGhpcy5fcm9vdFxuICAgICAgPyB0aGlzLl9yb290ICsgJy8nICsgcGF0aC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICA6IHBhdGhcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlcGxhY2UpIHtcbiAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKHt9LCAnJywgcGF0aClcbiAgICB9IGVsc2Uge1xuICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCBwYXRoKVxuICAgIH1cbiAgICB0aGlzLl9tYXRjaChwYXRoKVxuICB9IGVsc2Uge1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL14jIT8vLCAnJylcbiAgICBsb2NhdGlvbi5oYXNoID0gdGhpcy5faGFzaGJhbmdcbiAgICAgID8gJyEnICsgcGF0aFxuICAgICAgOiBwYXRoXG4gIH1cbn1cblxuLyoqXG4gKiBTdGFydCB0aGUgcm91dGVyLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbnAuc3RhcnQgPSBmdW5jdGlvbiAodm0pIHtcbiAgaWYgKHRoaXMuX3N0YXJ0ZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuICB0aGlzLl9zdGFydGVkID0gdHJ1ZVxuICB0aGlzLl92bSA9IHRoaXMuX3ZtIHx8IHZtXG4gIGlmICghdGhpcy5fdm0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAndnVlLXJvdXRlciBtdXN0IGJlIHN0YXJ0ZWQgd2l0aCBhIHJvb3QgVnVlIGluc3RhbmNlLidcbiAgICApXG4gIH1cbiAgaWYgKHRoaXMuX3B1c2hzdGF0ZSkge1xuICAgIHRoaXMuaW5pdEhpc3RvcnlNb2RlKClcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmluaXRIYXNoTW9kZSgpXG4gIH1cbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGhhc2ggbW9kZS5cbiAqL1xuXG5wLmluaXRIYXNoTW9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHRoaXMub25Sb3V0ZUNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBmb3JtYXQgaGFzaGJhbmdcbiAgICBpZiAoXG4gICAgICBzZWxmLl9oYXNoYmFuZyAmJlxuICAgICAgbG9jYXRpb24uaGFzaCAmJlxuICAgICAgbG9jYXRpb24uaGFzaC5jaGFyQXQoMSkgIT09ICchJ1xuICAgICkge1xuICAgICAgbG9jYXRpb24uaGFzaCA9ICchJyArIGxvY2F0aW9uLmhhc2guc2xpY2UoMSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB2YXIgaGFzaCA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZSgvXiMhPy8sICcnKVxuICAgIHZhciB1cmwgPSBoYXNoICsgbG9jYXRpb24uc2VhcmNoXG4gICAgdXJsID0gZGVjb2RlVVJJKHVybClcbiAgICBzZWxmLl9tYXRjaCh1cmwpXG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLm9uUm91dGVDaGFuZ2UpXG4gIHRoaXMub25Sb3V0ZUNoYW5nZSgpXG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBIVE1MNSBoaXN0b3J5IG1vZGUuXG4gKi9cblxucC5pbml0SGlzdG9yeU1vZGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB0aGlzLm9uUm91dGVDaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHVybCA9IGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoXG4gICAgdXJsID0gZGVjb2RlVVJJKHVybClcbiAgICBzZWxmLl9tYXRjaCh1cmwpXG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgdGhpcy5vblJvdXRlQ2hhbmdlKVxuICB0aGlzLm9uUm91dGVDaGFuZ2UoKVxufVxuXG4vKipcbiAqIFN0b3AgbGlzdGVuaW5nIHRvIHJvdXRlIGNoYW5nZXMuXG4gKi9cblxucC5zdG9wID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZXZlbnQgPSB0aGlzLl9wdXNoc3RhdGVcbiAgICA/ICdwb3BzdGF0ZSdcbiAgICA6ICdoYXNoY2hhbmdlJ1xuICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgdGhpcy5vblJvdXRlQ2hhbmdlKVxuICB0aGlzLl92bS5yb3V0ZSA9IG51bGxcbiAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlXG59XG5cbi8vXG4vLyBQcml2YXRlIE1ldGhvZHNcbi8vXG5cbi8qKlxuICogQWRkIGEgcm91dGUgY29udGFpbmluZyBhIGxpc3Qgb2Ygc2VnbWVudHMgdG8gdGhlIGludGVybmFsXG4gKiByb3V0ZSByZWNvZ25pemVyLiBXaWxsIGJlIGNhbGxlZCByZWN1cnNpdmVseSB0byBhZGQgYWxsXG4gKiBwb3NzaWJsZSBzdWItcm91dGVzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gKiBAcGFyYW0ge0FycmF5fSBzZWdtZW50c1xuICovXG5wLl9hZGRSb3V0ZSA9IGZ1bmN0aW9uIChwYXRoLCBjb25maWcsIHNlZ21lbnRzKSB7XG4gIHNlZ21lbnRzLnB1c2goe1xuICAgIHBhdGg6IHBhdGgsXG4gICAgaGFuZGxlcjogY29uZmlnXG4gIH0pXG4gIHRoaXMuX3JlY29nbml6ZXIuYWRkKHNlZ21lbnRzKVxuICBpZiAoY29uZmlnLnN1YlJvdXRlcykge1xuICAgIGZvciAodmFyIHN1YlBhdGggaW4gY29uZmlnLnN1YlJvdXRlcykge1xuICAgICAgLy8gcmVjdXJzaXZlbHkgd2FsayBhbGwgc3ViIHJvdXRlc1xuICAgICAgdGhpcy5fYWRkUm91dGUoXG4gICAgICAgIHN1YlBhdGgsXG4gICAgICAgIGNvbmZpZy5zdWJSb3V0ZXNbc3ViUGF0aF0sXG4gICAgICAgIC8vIHBhc3MgYSBjb3B5IGluIHJlY3Vyc2lvbiB0byBhdm9pZCBtdXRhdGluZ1xuICAgICAgICAvLyBhY3Jvc3MgYnJhbmNoZXNcbiAgICAgICAgc2VnbWVudHMuc2xpY2UoKVxuICAgICAgKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1hdGNoIGEgVVJMIHBhdGggYW5kIHNldCB0aGUgcm91dGUgY29udGV4dCBvbiB2bSxcbiAqIHRyaWdnZXJpbmcgdmlldyB1cGRhdGVzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKi9cbnAuX21hdGNoID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgaWYgKHBhdGggPT09IHRoaXMuX2N1cnJlbnRQYXRoKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgdGhpcy5fY3VycmVudFBhdGggPSBwYXRoXG4gIC8vIG5vcm1hbGl6ZSBhZ2FpbnN0IHJvb3RcbiAgaWYgKFxuICAgIHRoaXMuX3B1c2hzdGF0ZSAmJlxuICAgIHRoaXMuX3Jvb3QgJiZcbiAgICBwYXRoLmluZGV4T2YodGhpcy5fcm9vdCkgPT09IDBcbiAgKSB7XG4gICAgcGF0aCA9IHBhdGguc2xpY2UodGhpcy5fcm9vdC5sZW5ndGgpXG4gIH1cbiAgdmFyIG1hdGNoZWQgPSB0aGlzLl9yZWNvZ25pemVyLnJlY29nbml6ZShwYXRoKVxuICAvLyBhZ2dyZWdhdGUgcGFyYW1zXG4gIHZhciBwYXJhbXNcbiAgaWYgKG1hdGNoZWQpIHtcbiAgICBwYXJhbXMgPSBbXS5yZWR1Y2UuY2FsbChtYXRjaGVkLCBmdW5jdGlvbiAocHJldiwgY3VyKSB7XG4gICAgICBpZiAoY3VyLnBhcmFtcykge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gY3VyLnBhcmFtcykge1xuICAgICAgICAgIHByZXZba2V5XSA9IGN1ci5wYXJhbXNba2V5XVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJldlxuICAgIH0sIHt9KVxuICB9XG4gIC8vIGNvbnN0cnVjdCByb3V0ZSBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0ge1xuICAgIHBhdGg6IHBhdGgsXG4gICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgcXVlcnk6IG1hdGNoZWQgJiYgbWF0Y2hlZC5xdWVyeVBhcmFtcyxcbiAgICBfbWF0Y2hlZDogbWF0Y2hlZCB8fCB0aGlzLl9ub3Rmb3VuZEhhbmRsZXIsXG4gICAgX21hdGNoZWRDb3VudDogMCxcbiAgICBfcm91dGVyOiB0aGlzXG4gIH1cbiAgdGhpcy5fdm0uJHNldCgncm91dGUnLCBjb250ZXh0KVxufVxuXG4vKipcbiAqIEluc3RhbGxhdGlvbiBpbnRlcmZhY2UuXG4gKiBJbnN0YWxsIHRoZSBuZWNlc3NhcnkgZGlyZWN0aXZlcy5cbiAqL1xuXG5WdWVSb3V0ZXIuaW5zdGFsbCA9IGZ1bmN0aW9uIChWdWUpIHtcbiAgcmVxdWlyZSgnLi92aWV3JykoVnVlKVxuICByZXF1aXJlKCcuL2xpbmsnKShWdWUpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVnVlUm91dGVyIiwiLy8gaW5zdGFsbCB2LWxpbmssIHdoaWNoIHByb3ZpZGVzIG5hdmlnYXRpb24gc3VwcG9ydCBmb3Jcbi8vIEhUTUw1IGhpc3RvcnkgbW9kZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChWdWUpIHtcblxuICBWdWUuZGlyZWN0aXZlKCdsaW5rJywge1xuXG4gICAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZtID0gdGhpcy52bVxuICAgICAgdmFyIGhyZWYgPSB0aGlzLmV4cHJlc3Npb25cbiAgICAgIGlmICh0aGlzLmVsLnRhZ05hbWUgPT09ICdBJykge1xuICAgICAgICB0aGlzLmVsLmhyZWYgPSBocmVmXG4gICAgICB9XG4gICAgICB0aGlzLmhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdm0ucm91dGUuX3JvdXRlci5nbyhocmVmKVxuICAgICAgfVxuICAgICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlcilcbiAgICB9LFxuXG4gICAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVyKVxuICAgIH1cblxuICB9KVxuXG59IiwiLy8gaW5zdGFsbCB0aGUgdi12aWV3IGRpcmVjdGl2ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChWdWUpIHtcblxuICAvLyBpbnNlcnQgZ2xvYmFsIGNzcyB0byBtYWtlIHN1cmUgcm91dGVyLXZpZXcgaGFzXG4gIC8vIGRpc3BsYXk6YmxvY2sgc28gdGhhdCB0cmFuc2l0aW9ucyB3b3JrIHByb3Blcmx5XG4gIHJlcXVpcmUoJ2luc2VydC1jc3MnKSgncm91dGVyLXZpZXd7ZGlzcGxheTpibG9jazt9JylcblxuICB2YXIgXyA9IFZ1ZS51dGlsXG4gIHZhciBjb21wb25lbnQgPSBWdWUuZGlyZWN0aXZlKCdfY29tcG9uZW50JylcbiAgdmFyIHRlbXBsYXRlUGFyc2VyID0gVnVlLnBhcnNlcnMudGVtcGxhdGVcblxuICAvLyB2LXZpZXcgZXh0ZW5kcyB2LWNvbXBvbmVudFxuICB2YXIgdmlld0RlZiA9IF8uZXh0ZW5kKHt9LCBjb21wb25lbnQpXG5cbiAgLy8gd2l0aCBzb21lIG92ZXJyaWRlc1xuICBfLmV4dGVuZCh2aWV3RGVmLCB7XG5cbiAgICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyByZWFjdCB0byByb3V0ZSBjaGFuZ2VcbiAgICAgIHRoaXMuY3VycmVudFJvdXRlID0gbnVsbFxuICAgICAgdGhpcy5jdXJyZW50Q29tcG9uZW50SWQgPSBudWxsXG4gICAgICB0aGlzLm9uUm91dGVDaGFuZ2UgPSBfLmJpbmQodGhpcy5vblJvdXRlQ2hhbmdlLCB0aGlzKVxuICAgICAgdGhpcy51bndhdGNoID0gdGhpcy52bS4kd2F0Y2goJ3JvdXRlJywgdGhpcy5vblJvdXRlQ2hhbmdlKVxuICAgICAgLy8gZm9yY2UgZHluYW1pYyBkaXJlY3RpdmUgc28gdi1jb21wb25lbnQgZG9lc24ndFxuICAgICAgLy8gYXR0ZW1wdCB0byBidWlsZCByaWdodCBub3dcbiAgICAgIHRoaXMuX2lzRHluYW1pY0xpdGVyYWwgPSB0cnVlXG4gICAgICAvLyBmaW5hbGx5LCBpbml0IGJ5IGRlbGVnYXRpbmcgdG8gdi1jb21wb25lbnRcbiAgICAgIGNvbXBvbmVudC5iaW5kLmNhbGwodGhpcylcbiAgICAgIGlmICh0aGlzLnZtLnJvdXRlKSB7XG4gICAgICAgIHRoaXMub25Sb3V0ZUNoYW5nZSh0aGlzLnZtLnJvdXRlKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBvblJvdXRlQ2hhbmdlOiBmdW5jdGlvbiAocm91dGUpIHtcbiAgICAgIHZhciBwcmV2aW91c1JvdXRlID0gdGhpcy5jdXJyZW50Um91dGVcbiAgICAgIHRoaXMuY3VycmVudFJvdXRlID0gcm91dGVcblxuICAgICAgaWYgKCFyb3V0ZS5fbWF0Y2hlZCkge1xuICAgICAgICAvLyByb3V0ZSBub3QgZm91bmQsIHRoaXMgb3V0bGV0IGlzIGludmFsaWRhdGVkXG4gICAgICAgIHJldHVybiB0aGlzLmludmFsaWRhdGUoKVxuICAgICAgfVxuXG4gICAgICB2YXIgc2VnbWVudCA9IHJvdXRlLl9tYXRjaGVkW3JvdXRlLl9tYXRjaGVkQ291bnRdXG4gICAgICBpZiAoIXNlZ21lbnQpIHtcbiAgICAgICAgLy8gbm8gc2VnbWVudCB0aGF0IG1hdGNoZXMgdGhpcyBvdXRsZXRcbiAgICAgICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZSgpXG4gICAgICB9XG5cbiAgICAgIC8vIG11dGF0ZSB0aGUgcm91dGUgYXMgd2UgcGFzcyBpdCBmdXJ0aGVyIGRvd24gdGhlXG4gICAgICAvLyBjaGFpbi4gdGhpcyBzZXJpZXMgb2YgbXV0YXRpb24gaXMgZG9uZSBleGFjdGx5IG9uY2VcbiAgICAgIC8vIGZvciBldmVyeSByb3V0ZSBhcyB3ZSBtYXRjaCB0aGUgY29tcG9uZW50cyB0byByZW5kZXIuXG4gICAgICByb3V0ZS5fbWF0Y2hlZENvdW50KytcbiAgICAgIC8vIHRyaWdnZXIgY29tcG9uZW50IHN3aXRjaFxuICAgICAgdmFyIGhhbmRsZXIgPSBzZWdtZW50LmhhbmRsZXJcbiAgICAgIGlmIChoYW5kbGVyLmNvbXBvbmVudCAhPT0gdGhpcy5jdXJyZW50Q29tcG9uZW50SWQgfHxcbiAgICAgICAgICBoYW5kbGVyLmFsd2F5c1JlZnJlc2gpIHtcbiAgICAgICAgLy8gY2FsbCBiZWZvcmUgaG9va1xuICAgICAgICBpZiAoaGFuZGxlci5iZWZvcmUpIHtcbiAgICAgICAgICB2YXIgYmVmb3JlUmVzdWx0ID0gaGFuZGxlci5iZWZvcmUocm91dGUsIHByZXZpb3VzUm91dGUpXG4gICAgICAgICAgaWYgKGJlZm9yZVJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmIChyb3V0ZS5fcm91dGVyLl9oYXNQdXNoU3RhdGUpIHtcbiAgICAgICAgICAgICAgaGlzdG9yeS5iYWNrKClcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJldmlvdXNSb3V0ZSkge1xuICAgICAgICAgICAgICByb3V0ZS5fcm91dGVyLmdvKHByZXZpb3VzUm91dGUucGF0aClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRDb21wb25lbnRJZCA9IGhhbmRsZXIuY29tcG9uZW50XG4gICAgICAgIC8vIGFjdHVhbGx5IHN3aXRjaCBjb21wb25lbnRcbiAgICAgICAgdGhpcy5yZWFsVXBkYXRlKGhhbmRsZXIuY29tcG9uZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgLy8gY2FsbCBhZnRlciBob29rXG4gICAgICAgICAgaWYgKGhhbmRsZXIuYWZ0ZXIpIHtcbiAgICAgICAgICAgIGhhbmRsZXIuYWZ0ZXIocm91dGUsIHByZXZpb3VzUm91dGUpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNoaWxkVk0pIHtcbiAgICAgICAgLy8gdXBkYXRlIHJvdXRlIGNvbnRleHRcbiAgICAgICAgdGhpcy5jaGlsZFZNLnJvdXRlID0gcm91dGVcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgaW52YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5jdXJyZW50Q29tcG9uZW50SWQgPSBudWxsXG4gICAgICB0aGlzLnJlYWxVcGRhdGUobnVsbClcbiAgICB9LFxuXG4gICAgLy8gY3VycmVudGx5IGR1cGxpY2F0aW5nIHNvbWUgbG9naWMgZnJvbSB2LWNvbXBvbmVudFxuICAgIC8vIFRPRE86IG1ha2UgaXQgY2xlYW5lclxuICAgIGJ1aWxkOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcm91dGUgPSB0aGlzLmN1cnJlbnRSb3V0ZVxuICAgICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgIHZhciBjYWNoZWQgPSB0aGlzLmNhY2hlW3RoaXMuY3RvcklkXVxuICAgICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgICAgY2FjaGVkLnJvdXRlID0gcm91dGVcbiAgICAgICAgICByZXR1cm4gY2FjaGVkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICAgIHZhciBlbCA9IHRlbXBsYXRlUGFyc2VyLmNsb25lKHRoaXMuZWwpXG4gICAgICBpZiAodGhpcy5DdG9yKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHZtLiRhZGRDaGlsZCh7XG4gICAgICAgICAgZWw6IGVsLFxuICAgICAgICAgIHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlLFxuICAgICAgICAgIF9hc0NvbXBvbmVudDogdHJ1ZSxcbiAgICAgICAgICBfaG9zdDogdGhpcy5faG9zdCxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICByb3V0ZTogcm91dGVcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMuQ3RvcilcbiAgICAgICAgaWYgKHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICAgICAgdGhpcy5jYWNoZVt0aGlzLmN0b3JJZF0gPSBjaGlsZFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZFxuICAgICAgfVxuICAgIH0sXG5cbiAgICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMudW53YXRjaCgpXG4gICAgICBjb21wb25lbnQudW5iaW5kLmNhbGwodGhpcylcbiAgICB9XG5cbiAgfSlcblxuICBWdWUuZWxlbWVudERpcmVjdGl2ZSgncm91dGVyLXZpZXcnLCB2aWV3RGVmKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbi8qKlxuICogQ3JlYXRlIGEgY2hpbGQgaW5zdGFuY2UgdGhhdCBwcm90b3R5cGFsbHkgaW5laHJpdHNcbiAqIGRhdGEgb24gcGFyZW50LiBUbyBhY2hpZXZlIHRoYXQgd2UgY3JlYXRlIGFuIGludGVybWVkaWF0ZVxuICogY29uc3RydWN0b3Igd2l0aCBpdHMgcHJvdG90eXBlIHBvaW50aW5nIHRvIHBhcmVudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW0Jhc2VDdG9yXVxuICogQHJldHVybiB7VnVlfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuJGFkZENoaWxkID0gZnVuY3Rpb24gKG9wdHMsIEJhc2VDdG9yKSB7XG4gIEJhc2VDdG9yID0gQmFzZUN0b3IgfHwgXy5WdWVcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgdmFyIHBhcmVudCA9IHRoaXNcbiAgdmFyIENoaWxkVnVlXG4gIHZhciBpbmhlcml0ID0gb3B0cy5pbmhlcml0ICE9PSB1bmRlZmluZWRcbiAgICA/IG9wdHMuaW5oZXJpdFxuICAgIDogQmFzZUN0b3Iub3B0aW9ucy5pbmhlcml0XG4gIGlmIChpbmhlcml0KSB7XG4gICAgdmFyIGN0b3JzID0gcGFyZW50Ll9jaGlsZEN0b3JzXG4gICAgQ2hpbGRWdWUgPSBjdG9yc1tCYXNlQ3Rvci5jaWRdXG4gICAgaWYgKCFDaGlsZFZ1ZSkge1xuICAgICAgdmFyIG9wdGlvbk5hbWUgPSBCYXNlQ3Rvci5vcHRpb25zLm5hbWVcbiAgICAgIHZhciBjbGFzc05hbWUgPSBvcHRpb25OYW1lXG4gICAgICAgID8gXy5jbGFzc2lmeShvcHRpb25OYW1lKVxuICAgICAgICA6ICdWdWVDb21wb25lbnQnXG4gICAgICBDaGlsZFZ1ZSA9IG5ldyBGdW5jdGlvbihcbiAgICAgICAgJ3JldHVybiBmdW5jdGlvbiAnICsgY2xhc3NOYW1lICsgJyAob3B0aW9ucykgeycgK1xuICAgICAgICAndGhpcy5jb25zdHJ1Y3RvciA9ICcgKyBjbGFzc05hbWUgKyAnOycgK1xuICAgICAgICAndGhpcy5faW5pdChvcHRpb25zKSB9J1xuICAgICAgKSgpXG4gICAgICBDaGlsZFZ1ZS5vcHRpb25zID0gQmFzZUN0b3Iub3B0aW9uc1xuICAgICAgQ2hpbGRWdWUucHJvdG90eXBlID0gdGhpc1xuICAgICAgY3RvcnNbQmFzZUN0b3IuY2lkXSA9IENoaWxkVnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIENoaWxkVnVlID0gQmFzZUN0b3JcbiAgfVxuICBvcHRzLl9wYXJlbnQgPSBwYXJlbnRcbiAgb3B0cy5fcm9vdCA9IHBhcmVudC4kcm9vdFxuICB2YXIgY2hpbGQgPSBuZXcgQ2hpbGRWdWUob3B0cylcbiAgcmV0dXJuIGNoaWxkXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBXYXRjaGVyID0gcmVxdWlyZSgnLi4vd2F0Y2hlcicpXG52YXIgUGF0aCA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvcGF0aCcpXG52YXIgdGV4dFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGV4dCcpXG52YXIgZGlyUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9kaXJlY3RpdmUnKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZXhwcmVzc2lvbicpXG52YXIgZmlsdGVyUkUgPSAvW158XVxcfFtefF0vXG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZSBmcm9tIGFuIGV4cHJlc3Npb24gb24gdGhpcyB2bS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcmV0dXJuIHsqfVxuICovXG5cbmV4cG9ydHMuJGdldCA9IGZ1bmN0aW9uIChleHApIHtcbiAgdmFyIHJlcyA9IGV4cFBhcnNlci5wYXJzZShleHApXG4gIGlmIChyZXMpIHtcbiAgICByZXR1cm4gcmVzLmdldC5jYWxsKHRoaXMsIHRoaXMpXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgdGhlIHZhbHVlIGZyb20gYW4gZXhwcmVzc2lvbiBvbiB0aGlzIHZtLlxuICogVGhlIGV4cHJlc3Npb24gbXVzdCBiZSBhIHZhbGlkIGxlZnQtaGFuZFxuICogZXhwcmVzc2lvbiBpbiBhbiBhc3NpZ25tZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKi9cblxuZXhwb3J0cy4kc2V0ID0gZnVuY3Rpb24gKGV4cCwgdmFsKSB7XG4gIHZhciByZXMgPSBleHBQYXJzZXIucGFyc2UoZXhwLCB0cnVlKVxuICBpZiAocmVzICYmIHJlcy5zZXQpIHtcbiAgICByZXMuc2V0LmNhbGwodGhpcywgdGhpcywgdmFsKVxuICB9XG59XG5cbi8qKlxuICogQWRkIGEgcHJvcGVydHkgb24gdGhlIFZNXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5leHBvcnRzLiRhZGQgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgdGhpcy5fZGF0YS4kYWRkKGtleSwgdmFsKVxufVxuXG4vKipcbiAqIERlbGV0ZSBhIHByb3BlcnR5IG9uIHRoZSBWTVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqL1xuXG5leHBvcnRzLiRkZWxldGUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHRoaXMuX2RhdGEuJGRlbGV0ZShrZXkpXG59XG5cbi8qKlxuICogV2F0Y2ggYW4gZXhwcmVzc2lvbiwgdHJpZ2dlciBjYWxsYmFjayB3aGVuIGl0c1xuICogdmFsdWUgY2hhbmdlcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICogQHBhcmFtIHtCb29sZWFufSBbZGVlcF1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2ltbWVkaWF0ZV1cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIHVud2F0Y2hGblxuICovXG5cbmV4cG9ydHMuJHdhdGNoID0gZnVuY3Rpb24gKGV4cCwgY2IsIGRlZXAsIGltbWVkaWF0ZSkge1xuICB2YXIgdm0gPSB0aGlzXG4gIHZhciBrZXkgPSBkZWVwID8gZXhwICsgJyoqZGVlcCoqJyA6IGV4cFxuICB2YXIgd2F0Y2hlciA9IHZtLl91c2VyV2F0Y2hlcnNba2V5XVxuICB2YXIgd3JhcHBlZENiID0gZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XG4gICAgY2IuY2FsbCh2bSwgdmFsLCBvbGRWYWwpXG4gIH1cbiAgaWYgKCF3YXRjaGVyKSB7XG4gICAgd2F0Y2hlciA9IHZtLl91c2VyV2F0Y2hlcnNba2V5XSA9XG4gICAgICBuZXcgV2F0Y2hlcih2bSwgZXhwLCB3cmFwcGVkQ2IsIHtcbiAgICAgICAgZGVlcDogZGVlcCxcbiAgICAgICAgdXNlcjogdHJ1ZVxuICAgICAgfSlcbiAgfSBlbHNlIHtcbiAgICB3YXRjaGVyLmFkZENiKHdyYXBwZWRDYilcbiAgfVxuICBpZiAoaW1tZWRpYXRlKSB7XG4gICAgd3JhcHBlZENiKHdhdGNoZXIudmFsdWUpXG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHVud2F0Y2hGbiAoKSB7XG4gICAgd2F0Y2hlci5yZW1vdmVDYih3cmFwcGVkQ2IpXG4gICAgaWYgKCF3YXRjaGVyLmFjdGl2ZSkge1xuICAgICAgdm0uX3VzZXJXYXRjaGVyc1trZXldID0gbnVsbFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV2YWx1YXRlIGEgdGV4dCBkaXJlY3RpdmUsIGluY2x1ZGluZyBmaWx0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZXhwb3J0cy4kZXZhbCA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gIC8vIGNoZWNrIGZvciBmaWx0ZXJzLlxuICBpZiAoZmlsdGVyUkUudGVzdCh0ZXh0KSkge1xuICAgIHZhciBkaXIgPSBkaXJQYXJzZXIucGFyc2UodGV4dClbMF1cbiAgICAvLyB0aGUgZmlsdGVyIHJlZ2V4IGNoZWNrIG1pZ2h0IGdpdmUgZmFsc2UgcG9zaXRpdmVcbiAgICAvLyBmb3IgcGlwZXMgaW5zaWRlIHN0cmluZ3MsIHNvIGl0J3MgcG9zc2libGUgdGhhdFxuICAgIC8vIHdlIGRvbid0IGdldCBhbnkgZmlsdGVycyBoZXJlXG4gICAgcmV0dXJuIGRpci5maWx0ZXJzXG4gICAgICA/IF8uYXBwbHlGaWx0ZXJzKFxuICAgICAgICAgIHRoaXMuJGdldChkaXIuZXhwcmVzc2lvbiksXG4gICAgICAgICAgXy5yZXNvbHZlRmlsdGVycyh0aGlzLCBkaXIuZmlsdGVycykucmVhZCxcbiAgICAgICAgICB0aGlzXG4gICAgICAgIClcbiAgICAgIDogdGhpcy4kZ2V0KGRpci5leHByZXNzaW9uKVxuICB9IGVsc2Uge1xuICAgIC8vIG5vIGZpbHRlclxuICAgIHJldHVybiB0aGlzLiRnZXQodGV4dClcbiAgfVxufVxuXG4vKipcbiAqIEludGVycG9sYXRlIGEgcGllY2Ugb2YgdGVtcGxhdGUgdGV4dC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMuJGludGVycG9sYXRlID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgdmFyIHRva2VucyA9IHRleHRQYXJzZXIucGFyc2UodGV4dClcbiAgdmFyIHZtID0gdGhpc1xuICBpZiAodG9rZW5zKSB7XG4gICAgcmV0dXJuIHRva2Vucy5sZW5ndGggPT09IDFcbiAgICAgID8gdm0uJGV2YWwodG9rZW5zWzBdLnZhbHVlKVxuICAgICAgOiB0b2tlbnMubWFwKGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgIHJldHVybiB0b2tlbi50YWdcbiAgICAgICAgICAgID8gdm0uJGV2YWwodG9rZW4udmFsdWUpXG4gICAgICAgICAgICA6IHRva2VuLnZhbHVlXG4gICAgICAgIH0pLmpvaW4oJycpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRleHRcbiAgfVxufVxuXG4vKipcbiAqIExvZyBpbnN0YW5jZSBkYXRhIGFzIGEgcGxhaW4gSlMgb2JqZWN0XG4gKiBzbyB0aGF0IGl0IGlzIGVhc2llciB0byBpbnNwZWN0IGluIGNvbnNvbGUuXG4gKiBUaGlzIG1ldGhvZCBhc3N1bWVzIGNvbnNvbGUgaXMgYXZhaWxhYmxlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbcGF0aF1cbiAqL1xuXG5leHBvcnRzLiRsb2cgPSBmdW5jdGlvbiAocGF0aCkge1xuICB2YXIgZGF0YSA9IHBhdGhcbiAgICA/IFBhdGguZ2V0KHRoaXMuX2RhdGEsIHBhdGgpXG4gICAgOiB0aGlzLl9kYXRhXG4gIGlmIChkYXRhKSB7XG4gICAgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gIH1cbiAgY29uc29sZS5sb2coZGF0YSlcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIHRyYW5zaXRpb24gPSByZXF1aXJlKCcuLi90cmFuc2l0aW9uJylcblxuLyoqXG4gKiBBcHBlbmQgaW5zdGFuY2UgdG8gdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRhcHBlbmRUbyA9IGZ1bmN0aW9uICh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbikge1xuICByZXR1cm4gaW5zZXJ0KFxuICAgIHRoaXMsIHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uLFxuICAgIGFwcGVuZCwgdHJhbnNpdGlvbi5hcHBlbmRcbiAgKVxufVxuXG4vKipcbiAqIFByZXBlbmQgaW5zdGFuY2UgdG8gdGFyZ2V0XG4gKlxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3dpdGhUcmFuc2l0aW9uXSAtIGRlZmF1bHRzIHRvIHRydWVcbiAqL1xuXG5leHBvcnRzLiRwcmVwZW5kVG8gPSBmdW5jdGlvbiAodGFyZ2V0LCBjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICBpZiAodGFyZ2V0Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgIHRoaXMuJGJlZm9yZSh0YXJnZXQuZmlyc3RDaGlsZCwgY2IsIHdpdGhUcmFuc2l0aW9uKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuJGFwcGVuZFRvKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogSW5zZXJ0IGluc3RhbmNlIGJlZm9yZSB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICovXG5cbmV4cG9ydHMuJGJlZm9yZSA9IGZ1bmN0aW9uICh0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbikge1xuICByZXR1cm4gaW5zZXJ0KFxuICAgIHRoaXMsIHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uLFxuICAgIGJlZm9yZSwgdHJhbnNpdGlvbi5iZWZvcmVcbiAgKVxufVxuXG4vKipcbiAqIEluc2VydCBpbnN0YW5jZSBhZnRlciB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICovXG5cbmV4cG9ydHMuJGFmdGVyID0gZnVuY3Rpb24gKHRhcmdldCwgY2IsIHdpdGhUcmFuc2l0aW9uKSB7XG4gIHRhcmdldCA9IHF1ZXJ5KHRhcmdldClcbiAgaWYgKHRhcmdldC5uZXh0U2libGluZykge1xuICAgIHRoaXMuJGJlZm9yZSh0YXJnZXQubmV4dFNpYmxpbmcsIGNiLCB3aXRoVHJhbnNpdGlvbilcbiAgfSBlbHNlIHtcbiAgICB0aGlzLiRhcHBlbmRUbyh0YXJnZXQucGFyZW50Tm9kZSwgY2IsIHdpdGhUcmFuc2l0aW9uKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUmVtb3ZlIGluc3RhbmNlIGZyb20gRE9NXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dIC0gZGVmYXVsdHMgdG8gdHJ1ZVxuICovXG5cbmV4cG9ydHMuJHJlbW92ZSA9IGZ1bmN0aW9uIChjYiwgd2l0aFRyYW5zaXRpb24pIHtcbiAgdmFyIGluRG9jID0gdGhpcy5faXNBdHRhY2hlZCAmJiBfLmluRG9jKHRoaXMuJGVsKVxuICAvLyBpZiB3ZSBhcmUgbm90IGluIGRvY3VtZW50LCBubyBuZWVkIHRvIGNoZWNrXG4gIC8vIGZvciB0cmFuc2l0aW9uc1xuICBpZiAoIWluRG9jKSB3aXRoVHJhbnNpdGlvbiA9IGZhbHNlXG4gIHZhciBvcFxuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIHJlYWxDYiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoaW5Eb2MpIHNlbGYuX2NhbGxIb29rKCdkZXRhY2hlZCcpXG4gICAgaWYgKGNiKSBjYigpXG4gIH1cbiAgaWYgKFxuICAgIHRoaXMuX2lzQmxvY2sgJiZcbiAgICAhdGhpcy5fYmxvY2tGcmFnbWVudC5oYXNDaGlsZE5vZGVzKClcbiAgKSB7XG4gICAgb3AgPSB3aXRoVHJhbnNpdGlvbiA9PT0gZmFsc2VcbiAgICAgID8gYXBwZW5kXG4gICAgICA6IHRyYW5zaXRpb24ucmVtb3ZlVGhlbkFwcGVuZFxuICAgIGJsb2NrT3AodGhpcywgdGhpcy5fYmxvY2tGcmFnbWVudCwgb3AsIHJlYWxDYilcbiAgfSBlbHNlIHtcbiAgICBvcCA9IHdpdGhUcmFuc2l0aW9uID09PSBmYWxzZVxuICAgICAgPyByZW1vdmVcbiAgICAgIDogdHJhbnNpdGlvbi5yZW1vdmVcbiAgICBvcCh0aGlzLiRlbCwgdGhpcywgcmVhbENiKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogU2hhcmVkIERPTSBpbnNlcnRpb24gZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICogQHBhcmFtIHtCb29sZWFufSBbd2l0aFRyYW5zaXRpb25dXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcDEgLSBvcCBmb3Igbm9uLXRyYW5zaXRpb24gaW5zZXJ0XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcDIgLSBvcCBmb3IgdHJhbnNpdGlvbiBpbnNlcnRcbiAqIEByZXR1cm4gdm1cbiAqL1xuXG5mdW5jdGlvbiBpbnNlcnQgKHZtLCB0YXJnZXQsIGNiLCB3aXRoVHJhbnNpdGlvbiwgb3AxLCBvcDIpIHtcbiAgdGFyZ2V0ID0gcXVlcnkodGFyZ2V0KVxuICB2YXIgdGFyZ2V0SXNEZXRhY2hlZCA9ICFfLmluRG9jKHRhcmdldClcbiAgdmFyIG9wID0gd2l0aFRyYW5zaXRpb24gPT09IGZhbHNlIHx8IHRhcmdldElzRGV0YWNoZWRcbiAgICA/IG9wMVxuICAgIDogb3AyXG4gIHZhciBzaG91bGRDYWxsSG9vayA9XG4gICAgIXRhcmdldElzRGV0YWNoZWQgJiZcbiAgICAhdm0uX2lzQXR0YWNoZWQgJiZcbiAgICAhXy5pbkRvYyh2bS4kZWwpXG4gIGlmICh2bS5faXNCbG9jaykge1xuICAgIGJsb2NrT3Aodm0sIHRhcmdldCwgb3AsIGNiKVxuICB9IGVsc2Uge1xuICAgIG9wKHZtLiRlbCwgdGFyZ2V0LCB2bSwgY2IpXG4gIH1cbiAgaWYgKHNob3VsZENhbGxIb29rKSB7XG4gICAgdm0uX2NhbGxIb29rKCdhdHRhY2hlZCcpXG4gIH1cbiAgcmV0dXJuIHZtXG59XG5cbi8qKlxuICogRXhlY3V0ZSBhIHRyYW5zaXRpb24gb3BlcmF0aW9uIG9uIGEgYmxvY2sgaW5zdGFuY2UsXG4gKiBpdGVyYXRpbmcgdGhyb3VnaCBhbGwgaXRzIGJsb2NrIG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtOb2RlfSB0YXJnZXRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbmZ1bmN0aW9uIGJsb2NrT3AgKHZtLCB0YXJnZXQsIG9wLCBjYikge1xuICB2YXIgY3VycmVudCA9IHZtLl9ibG9ja1N0YXJ0XG4gIHZhciBlbmQgPSB2bS5fYmxvY2tFbmRcbiAgdmFyIG5leHRcbiAgd2hpbGUgKG5leHQgIT09IGVuZCkge1xuICAgIG5leHQgPSBjdXJyZW50Lm5leHRTaWJsaW5nXG4gICAgb3AoY3VycmVudCwgdGFyZ2V0LCB2bSlcbiAgICBjdXJyZW50ID0gbmV4dFxuICB9XG4gIG9wKGVuZCwgdGFyZ2V0LCB2bSwgY2IpXG59XG5cbi8qKlxuICogQ2hlY2sgZm9yIHNlbGVjdG9yc1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsXG4gKi9cblxuZnVuY3Rpb24gcXVlcnkgKGVsKSB7XG4gIHJldHVybiB0eXBlb2YgZWwgPT09ICdzdHJpbmcnXG4gICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKVxuICAgIDogZWxcbn1cblxuLyoqXG4gKiBBcHBlbmQgb3BlcmF0aW9uIHRoYXQgdGFrZXMgYSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGVsXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtIC0gdW51c2VkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZnVuY3Rpb24gYXBwZW5kIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgdGFyZ2V0LmFwcGVuZENoaWxkKGVsKVxuICBpZiAoY2IpIGNiKClcbn1cblxuLyoqXG4gKiBJbnNlcnRCZWZvcmUgb3BlcmF0aW9uIHRoYXQgdGFrZXMgYSBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IGVsXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtIC0gdW51c2VkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZnVuY3Rpb24gYmVmb3JlIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgXy5iZWZvcmUoZWwsIHRhcmdldClcbiAgaWYgKGNiKSBjYigpXG59XG5cbi8qKlxuICogUmVtb3ZlIG9wZXJhdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtOb2RlfSBlbFxuICogQHBhcmFtIHtWdWV9IHZtIC0gdW51c2VkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxuZnVuY3Rpb24gcmVtb3ZlIChlbCwgdm0sIGNiKSB7XG4gIF8ucmVtb3ZlKGVsKVxuICBpZiAoY2IpIGNiKClcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5cbmV4cG9ydHMuJG9uID0gZnVuY3Rpb24gKGV2ZW50LCBmbikge1xuICAodGhpcy5fZXZlbnRzW2V2ZW50XSB8fCAodGhpcy5fZXZlbnRzW2V2ZW50XSA9IFtdKSlcbiAgICAucHVzaChmbilcbiAgbW9kaWZ5TGlzdGVuZXJDb3VudCh0aGlzLCBldmVudCwgMSlcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcbiAqIHRpbWUgdGhlbiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5cbmV4cG9ydHMuJG9uY2UgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBmdW5jdGlvbiBvbiAoKSB7XG4gICAgc2VsZi4kb2ZmKGV2ZW50LCBvbilcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cbiAgb24uZm4gPSBmblxuICB0aGlzLiRvbihldmVudCwgb24pXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuXG5leHBvcnRzLiRvZmYgPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gIHZhciBjYnNcbiAgLy8gYWxsXG4gIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGlmICh0aGlzLiRwYXJlbnQpIHtcbiAgICAgIGZvciAoZXZlbnQgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICAgIGNicyA9IHRoaXMuX2V2ZW50c1tldmVudF1cbiAgICAgICAgaWYgKGNicykge1xuICAgICAgICAgIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIC1jYnMubGVuZ3RoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICAvLyBzcGVjaWZpYyBldmVudFxuICBjYnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdXG4gIGlmICghY2JzKSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIC1jYnMubGVuZ3RoKVxuICAgIHRoaXMuX2V2ZW50c1tldmVudF0gPSBudWxsXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICAvLyBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYlxuICB2YXIgaSA9IGNicy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGNiID0gY2JzW2ldXG4gICAgaWYgKGNiID09PSBmbiB8fCBjYi5mbiA9PT0gZm4pIHtcbiAgICAgIG1vZGlmeUxpc3RlbmVyQ291bnQodGhpcywgZXZlbnQsIC0xKVxuICAgICAgY2JzLnNwbGljZShpLCAxKVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBUcmlnZ2VyIGFuIGV2ZW50IG9uIHNlbGYuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKi9cblxuZXhwb3J0cy4kZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xuICB0aGlzLl9ldmVudENhbmNlbGxlZCA9IGZhbHNlXG4gIHZhciBjYnMgPSB0aGlzLl9ldmVudHNbZXZlbnRdXG4gIGlmIChjYnMpIHtcbiAgICAvLyBhdm9pZCBsZWFraW5nIGFyZ3VtZW50czpcbiAgICAvLyBodHRwOi8vanNwZXJmLmNvbS9jbG9zdXJlLXdpdGgtYXJndW1lbnRzXG4gICAgdmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMVxuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGkpXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV1cbiAgICB9XG4gICAgaSA9IDBcbiAgICBjYnMgPSBjYnMubGVuZ3RoID4gMVxuICAgICAgPyBfLnRvQXJyYXkoY2JzKVxuICAgICAgOiBjYnNcbiAgICBmb3IgKHZhciBsID0gY2JzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGNic1tpXS5hcHBseSh0aGlzLCBhcmdzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fZXZlbnRDYW5jZWxsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgYnJvYWRjYXN0IGFuIGV2ZW50IHRvIGFsbCBjaGlsZHJlbiBpbnN0YW5jZXMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0gey4uLip9IGFkZGl0aW9uYWwgYXJndW1lbnRzXG4gKi9cblxuZXhwb3J0cy4kYnJvYWRjYXN0ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIC8vIGlmIG5vIGNoaWxkIGhhcyByZWdpc3RlcmVkIGZvciB0aGlzIGV2ZW50LFxuICAvLyB0aGVuIHRoZXJlJ3Mgbm8gbmVlZCB0byBicm9hZGNhc3QuXG4gIGlmICghdGhpcy5fZXZlbnRzQ291bnRbZXZlbnRdKSByZXR1cm5cbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGNoaWxkLiRlbWl0LmFwcGx5KGNoaWxkLCBhcmd1bWVudHMpXG4gICAgaWYgKCFjaGlsZC5fZXZlbnRDYW5jZWxsZWQpIHtcbiAgICAgIGNoaWxkLiRicm9hZGNhc3QuYXBwbHkoY2hpbGQsIGFyZ3VtZW50cylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBSZWN1cnNpdmVseSBwcm9wYWdhdGUgYW4gZXZlbnQgdXAgdGhlIHBhcmVudCBjaGFpbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7Li4uKn0gYWRkaXRpb25hbCBhcmd1bWVudHNcbiAqL1xuXG5leHBvcnRzLiRkaXNwYXRjaCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHBhcmVudCA9IHRoaXMuJHBhcmVudFxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgcGFyZW50LiRlbWl0LmFwcGx5KHBhcmVudCwgYXJndW1lbnRzKVxuICAgIHBhcmVudCA9IHBhcmVudC5fZXZlbnRDYW5jZWxsZWRcbiAgICAgID8gbnVsbFxuICAgICAgOiBwYXJlbnQuJHBhcmVudFxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogTW9kaWZ5IHRoZSBsaXN0ZW5lciBjb3VudHMgb24gYWxsIHBhcmVudHMuXG4gKiBUaGlzIGJvb2trZWVwaW5nIGFsbG93cyAkYnJvYWRjYXN0IHRvIHJldHVybiBlYXJseSB3aGVuXG4gKiBubyBjaGlsZCBoYXMgbGlzdGVuZWQgdG8gYSBjZXJ0YWluIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge051bWJlcn0gY291bnRcbiAqL1xuXG52YXIgaG9va1JFID0gL15ob29rOi9cbmZ1bmN0aW9uIG1vZGlmeUxpc3RlbmVyQ291bnQgKHZtLCBldmVudCwgY291bnQpIHtcbiAgdmFyIHBhcmVudCA9IHZtLiRwYXJlbnRcbiAgLy8gaG9va3MgZG8gbm90IGdldCBicm9hZGNhc3RlZCBzbyBubyBuZWVkXG4gIC8vIHRvIGRvIGJvb2trZWVwaW5nIGZvciB0aGVtXG4gIGlmICghcGFyZW50IHx8ICFjb3VudCB8fCBob29rUkUudGVzdChldmVudCkpIHJldHVyblxuICB3aGlsZSAocGFyZW50KSB7XG4gICAgcGFyZW50Ll9ldmVudHNDb3VudFtldmVudF0gPVxuICAgICAgKHBhcmVudC5fZXZlbnRzQ291bnRbZXZlbnRdIHx8IDApICsgY291bnRcbiAgICBwYXJlbnQgPSBwYXJlbnQuJHBhcmVudFxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBtZXJnZU9wdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsL21lcmdlLW9wdGlvbicpXG5cbi8qKlxuICogRXhwb3NlIHVzZWZ1bCBpbnRlcm5hbHNcbiAqL1xuXG5leHBvcnRzLnV0aWwgPSBfXG5leHBvcnRzLm5leHRUaWNrID0gXy5uZXh0VGlja1xuZXhwb3J0cy5jb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuXG5leHBvcnRzLmNvbXBpbGVyID0ge1xuICBjb21waWxlOiByZXF1aXJlKCcuLi9jb21waWxlci9jb21waWxlJyksXG4gIHRyYW5zY2x1ZGU6IHJlcXVpcmUoJy4uL2NvbXBpbGVyL3RyYW5zY2x1ZGUnKVxufVxuXG5leHBvcnRzLnBhcnNlcnMgPSB7XG4gIHBhdGg6IHJlcXVpcmUoJy4uL3BhcnNlcnMvcGF0aCcpLFxuICB0ZXh0OiByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKSxcbiAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKSxcbiAgZGlyZWN0aXZlOiByZXF1aXJlKCcuLi9wYXJzZXJzL2RpcmVjdGl2ZScpLFxuICBleHByZXNzaW9uOiByZXF1aXJlKCcuLi9wYXJzZXJzL2V4cHJlc3Npb24nKVxufVxuXG4vKipcbiAqIEVhY2ggaW5zdGFuY2UgY29uc3RydWN0b3IsIGluY2x1ZGluZyBWdWUsIGhhcyBhIHVuaXF1ZVxuICogY2lkLiBUaGlzIGVuYWJsZXMgdXMgdG8gY3JlYXRlIHdyYXBwZWQgXCJjaGlsZFxuICogY29uc3RydWN0b3JzXCIgZm9yIHByb3RvdHlwYWwgaW5oZXJpdGFuY2UgYW5kIGNhY2hlIHRoZW0uXG4gKi9cblxuZXhwb3J0cy5jaWQgPSAwXG52YXIgY2lkID0gMVxuXG4vKipcbiAqIENsYXNzIGluZWhyaXRhbmNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGV4dGVuZE9wdGlvbnNcbiAqL1xuXG5leHBvcnRzLmV4dGVuZCA9IGZ1bmN0aW9uIChleHRlbmRPcHRpb25zKSB7XG4gIGV4dGVuZE9wdGlvbnMgPSBleHRlbmRPcHRpb25zIHx8IHt9XG4gIHZhciBTdXBlciA9IHRoaXNcbiAgdmFyIFN1YiA9IGNyZWF0ZUNsYXNzKFxuICAgIGV4dGVuZE9wdGlvbnMubmFtZSB8fFxuICAgIFN1cGVyLm9wdGlvbnMubmFtZSB8fFxuICAgICdWdWVDb21wb25lbnQnXG4gIClcbiAgU3ViLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoU3VwZXIucHJvdG90eXBlKVxuICBTdWIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3ViXG4gIFN1Yi5jaWQgPSBjaWQrK1xuICBTdWIub3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhcbiAgICBTdXBlci5vcHRpb25zLFxuICAgIGV4dGVuZE9wdGlvbnNcbiAgKVxuICBTdWJbJ3N1cGVyJ10gPSBTdXBlclxuICAvLyBhbGxvdyBmdXJ0aGVyIGV4dGVuc2lvblxuICBTdWIuZXh0ZW5kID0gU3VwZXIuZXh0ZW5kXG4gIC8vIGNyZWF0ZSBhc3NldCByZWdpc3RlcnMsIHNvIGV4dGVuZGVkIGNsYXNzZXNcbiAgLy8gY2FuIGhhdmUgdGhlaXIgcHJpdmF0ZSBhc3NldHMgdG9vLlxuICBjcmVhdGVBc3NldFJlZ2lzdGVycyhTdWIpXG4gIHJldHVybiBTdWJcbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHN1Yi1jbGFzcyBjb25zdHJ1Y3RvciB3aXRoIHRoZVxuICogZ2l2ZW4gbmFtZS4gVGhpcyBnaXZlcyB1cyBtdWNoIG5pY2VyIG91dHB1dCB3aGVuXG4gKiBsb2dnaW5nIGluc3RhbmNlcyBpbiB0aGUgY29uc29sZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlQ2xhc3MgKG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBGdW5jdGlvbihcbiAgICAncmV0dXJuIGZ1bmN0aW9uICcgKyBfLmNsYXNzaWZ5KG5hbWUpICtcbiAgICAnIChvcHRpb25zKSB7IHRoaXMuX2luaXQob3B0aW9ucykgfSdcbiAgKSgpXG59XG5cbi8qKlxuICogUGx1Z2luIHN5c3RlbVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBwbHVnaW5cbiAqL1xuXG5leHBvcnRzLnVzZSA9IGZ1bmN0aW9uIChwbHVnaW4pIHtcbiAgLy8gYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gIHZhciBhcmdzID0gXy50b0FycmF5KGFyZ3VtZW50cywgMSlcbiAgYXJncy51bnNoaWZ0KHRoaXMpXG4gIGlmICh0eXBlb2YgcGx1Z2luLmluc3RhbGwgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwbHVnaW4uaW5zdGFsbC5hcHBseShwbHVnaW4sIGFyZ3MpXG4gIH0gZWxzZSB7XG4gICAgcGx1Z2luLmFwcGx5KG51bGwsIGFyZ3MpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBEZWZpbmUgYXNzZXQgcmVnaXN0cmF0aW9uIG1ldGhvZHMgb24gYSBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBDb25zdHJ1Y3RvclxuICovXG5cbnZhciBhc3NldFR5cGVzID0gW1xuICAnZGlyZWN0aXZlJyxcbiAgJ2VsZW1lbnREaXJlY3RpdmUnLFxuICAnZmlsdGVyJyxcbiAgJ3RyYW5zaXRpb24nXG5dXG5cbmZ1bmN0aW9uIGNyZWF0ZUFzc2V0UmVnaXN0ZXJzIChDb25zdHJ1Y3Rvcikge1xuXG4gIC8qIEFzc2V0IHJlZ2lzdHJhdGlvbiBtZXRob2RzIHNoYXJlIHRoZSBzYW1lIHNpZ25hdHVyZTpcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkXG4gICAqIEBwYXJhbSB7Kn0gZGVmaW5pdGlvblxuICAgKi9cblxuICBhc3NldFR5cGVzLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBDb25zdHJ1Y3Rvclt0eXBlXSA9IGZ1bmN0aW9uIChpZCwgZGVmaW5pdGlvbikge1xuICAgICAgaWYgKCFkZWZpbml0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ11baWRdXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnNbdHlwZSArICdzJ11baWRdID0gZGVmaW5pdGlvblxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICAvKipcbiAgICogQ29tcG9uZW50IHJlZ2lzdHJhdGlvbiBuZWVkcyB0byBhdXRvbWF0aWNhbGx5IGludm9rZVxuICAgKiBWdWUuZXh0ZW5kIG9uIG9iamVjdCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZFxuICAgKiBAcGFyYW0ge09iamVjdHxGdW5jdGlvbn0gZGVmaW5pdGlvblxuICAgKi9cblxuICBDb25zdHJ1Y3Rvci5jb21wb25lbnQgPSBmdW5jdGlvbiAoaWQsIGRlZmluaXRpb24pIHtcbiAgICBpZiAoIWRlZmluaXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29tcG9uZW50c1tpZF1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKF8uaXNQbGFpbk9iamVjdChkZWZpbml0aW9uKSkge1xuICAgICAgICBkZWZpbml0aW9uLm5hbWUgPSBpZFxuICAgICAgICBkZWZpbml0aW9uID0gXy5WdWUuZXh0ZW5kKGRlZmluaXRpb24pXG4gICAgICB9XG4gICAgICB0aGlzLm9wdGlvbnMuY29tcG9uZW50c1tpZF0gPSBkZWZpbml0aW9uXG4gICAgfVxuICB9XG59XG5cbmNyZWF0ZUFzc2V0UmVnaXN0ZXJzKGV4cG9ydHMpIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG5cbi8qKlxuICogU2V0IGluc3RhbmNlIHRhcmdldCBlbGVtZW50IGFuZCBraWNrIG9mZiB0aGUgY29tcGlsYXRpb25cbiAqIHByb2Nlc3MuIFRoZSBwYXNzZWQgaW4gYGVsYCBjYW4gYmUgYSBzZWxlY3RvciBzdHJpbmcsIGFuXG4gKiBleGlzdGluZyBFbGVtZW50LCBvciBhIERvY3VtZW50RnJhZ21lbnQgKGZvciBibG9ja1xuICogaW5zdGFuY2VzKS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8RG9jdW1lbnRGcmFnbWVudHxzdHJpbmd9IGVsXG4gKiBAcHVibGljXG4gKi9cblxuZXhwb3J0cy4kbW91bnQgPSBmdW5jdGlvbiAoZWwpIHtcbiAgaWYgKHRoaXMuX2lzQ29tcGlsZWQpIHtcbiAgICBfLndhcm4oJyRtb3VudCgpIHNob3VsZCBiZSBjYWxsZWQgb25seSBvbmNlLicpXG4gICAgcmV0dXJuXG4gIH1cbiAgaWYgKCFlbCkge1xuICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgfSBlbHNlIGlmICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIHNlbGVjdG9yID0gZWxcbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpXG4gICAgaWYgKCFlbCkge1xuICAgICAgXy53YXJuKCdDYW5ub3QgZmluZCBlbGVtZW50OiAnICsgc2VsZWN0b3IpXG4gICAgICByZXR1cm5cbiAgICB9XG4gIH1cbiAgdGhpcy5fY29tcGlsZShlbClcbiAgdGhpcy5faXNDb21waWxlZCA9IHRydWVcbiAgdGhpcy5fY2FsbEhvb2soJ2NvbXBpbGVkJylcbiAgaWYgKF8uaW5Eb2ModGhpcy4kZWwpKSB7XG4gICAgdGhpcy5fY2FsbEhvb2soJ2F0dGFjaGVkJylcbiAgICB0aGlzLl9pbml0RE9NSG9va3MoKVxuICAgIHJlYWR5LmNhbGwodGhpcylcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9pbml0RE9NSG9va3MoKVxuICAgIHRoaXMuJG9uY2UoJ2hvb2s6YXR0YWNoZWQnLCByZWFkeSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIE1hcmsgYW4gaW5zdGFuY2UgYXMgcmVhZHkuXG4gKi9cblxuZnVuY3Rpb24gcmVhZHkgKCkge1xuICB0aGlzLl9pc0F0dGFjaGVkID0gdHJ1ZVxuICB0aGlzLl9pc1JlYWR5ID0gdHJ1ZVxuICB0aGlzLl9jYWxsSG9vaygncmVhZHknKVxufVxuXG4vKipcbiAqIFRlYXJkb3duIHRoZSBpbnN0YW5jZSwgc2ltcGx5IGRlbGVnYXRlIHRvIHRoZSBpbnRlcm5hbFxuICogX2Rlc3Ryb3kuXG4gKi9cblxuZXhwb3J0cy4kZGVzdHJveSA9IGZ1bmN0aW9uIChyZW1vdmUsIGRlZmVyQ2xlYW51cCkge1xuICB0aGlzLl9kZXN0cm95KHJlbW92ZSwgZGVmZXJDbGVhbnVwKVxufVxuXG4vKipcbiAqIFBhcnRpYWxseSBjb21waWxlIGEgcGllY2Ugb2YgRE9NIGFuZCByZXR1cm4gYVxuICogZGVjb21waWxlIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0cy4kY29tcGlsZSA9IGZ1bmN0aW9uIChlbCkge1xuICByZXR1cm4gY29tcGlsZShlbCwgdGhpcy4kb3B0aW9ucywgdHJ1ZSkodGhpcywgZWwpXG59IiwidmFyIF8gPSByZXF1aXJlKCcuL3V0aWwnKVxudmFyIE1BWF9VUERBVEVfQ09VTlQgPSAxMFxuXG4vLyB3ZSBoYXZlIHR3byBzZXBhcmF0ZSBxdWV1ZXM6IG9uZSBmb3IgZGlyZWN0aXZlIHVwZGF0ZXNcbi8vIGFuZCBvbmUgZm9yIHVzZXIgd2F0Y2hlciByZWdpc3RlcmVkIHZpYSAkd2F0Y2goKS5cbi8vIHdlIHdhbnQgdG8gZ3VhcmFudGVlIGRpcmVjdGl2ZSB1cGRhdGVzIHRvIGJlIGNhbGxlZFxuLy8gYmVmb3JlIHVzZXIgd2F0Y2hlcnMgc28gdGhhdCB3aGVuIHVzZXIgd2F0Y2hlcnMgYXJlXG4vLyB0cmlnZ2VyZWQsIHRoZSBET00gd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gaW4gdXBkYXRlZFxuLy8gc3RhdGUuXG52YXIgcXVldWUgPSBbXVxudmFyIHVzZXJRdWV1ZSA9IFtdXG52YXIgaGFzID0ge31cbnZhciB3YWl0aW5nID0gZmFsc2VcbnZhciBmbHVzaGluZyA9IGZhbHNlXG5cbi8qKlxuICogUmVzZXQgdGhlIGJhdGNoZXIncyBzdGF0ZS5cbiAqL1xuXG5mdW5jdGlvbiByZXNldCAoKSB7XG4gIHF1ZXVlID0gW11cbiAgdXNlclF1ZXVlID0gW11cbiAgaGFzID0ge31cbiAgd2FpdGluZyA9IGZhbHNlXG4gIGZsdXNoaW5nID0gZmFsc2Vcbn1cblxuLyoqXG4gKiBGbHVzaCBib3RoIHF1ZXVlcyBhbmQgcnVuIHRoZSBqb2JzLlxuICovXG5cbmZ1bmN0aW9uIGZsdXNoICgpIHtcbiAgZmx1c2hpbmcgPSB0cnVlXG4gIHJ1bihxdWV1ZSlcbiAgcnVuKHVzZXJRdWV1ZSlcbiAgcmVzZXQoKVxufVxuXG4vKipcbiAqIFJ1biB0aGUgam9icyBpbiBhIHNpbmdsZSBxdWV1ZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBxdWV1ZVxuICovXG5cbmZ1bmN0aW9uIHJ1biAocXVldWUpIHtcbiAgLy8gZG8gbm90IGNhY2hlIGxlbmd0aCBiZWNhdXNlIG1vcmUgam9icyBtaWdodCBiZSBwdXNoZWRcbiAgLy8gYXMgd2UgcnVuIGV4aXN0aW5nIGpvYnNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHF1ZXVlW2ldLnJ1bigpXG4gIH1cbn1cblxuLyoqXG4gKiBQdXNoIGEgam9iIGludG8gdGhlIGpvYiBxdWV1ZS5cbiAqIEpvYnMgd2l0aCBkdXBsaWNhdGUgSURzIHdpbGwgYmUgc2tpcHBlZCB1bmxlc3MgaXQnc1xuICogcHVzaGVkIHdoZW4gdGhlIHF1ZXVlIGlzIGJlaW5nIGZsdXNoZWQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGpvYlxuICogICBwcm9wZXJ0aWVzOlxuICogICAtIHtTdHJpbmd8TnVtYmVyfSBpZFxuICogICAtIHtGdW5jdGlvbn0gICAgICBydW5cbiAqL1xuXG5leHBvcnRzLnB1c2ggPSBmdW5jdGlvbiAoam9iKSB7XG4gIHZhciBpZCA9IGpvYi5pZFxuICBpZiAoIWlkIHx8ICFoYXNbaWRdIHx8IGZsdXNoaW5nKSB7XG4gICAgaWYgKCFoYXNbaWRdKSB7XG4gICAgICBoYXNbaWRdID0gMVxuICAgIH0gZWxzZSB7XG4gICAgICBoYXNbaWRdKytcbiAgICAgIC8vIGRldGVjdCBwb3NzaWJsZSBpbmZpbml0ZSB1cGRhdGUgbG9vcHNcbiAgICAgIGlmIChoYXNbaWRdID4gTUFYX1VQREFURV9DT1VOVCkge1xuICAgICAgICBfLndhcm4oXG4gICAgICAgICAgJ1lvdSBtYXkgaGF2ZSBhbiBpbmZpbml0ZSB1cGRhdGUgbG9vcCBmb3IgdGhlICcgK1xuICAgICAgICAgICd3YXRjaGVyIHdpdGggZXhwcmVzc2lvbjogXCInICsgam9iLmV4cHJlc3Npb24gKyAnXCIuJ1xuICAgICAgICApXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgICAvLyBBIHVzZXIgd2F0Y2hlciBjYWxsYmFjayBjb3VsZCB0cmlnZ2VyIGFub3RoZXJcbiAgICAvLyBkaXJlY3RpdmUgdXBkYXRlIGR1cmluZyB0aGUgZmx1c2hpbmc7IGF0IHRoYXQgdGltZVxuICAgIC8vIHRoZSBkaXJlY3RpdmUgcXVldWUgd291bGQgYWxyZWFkeSBoYXZlIGJlZW4gcnVuLCBzb1xuICAgIC8vIHdlIGNhbGwgdGhhdCB1cGRhdGUgaW1tZWRpYXRlbHkgYXMgaXQgaXMgcHVzaGVkLlxuICAgIGlmIChmbHVzaGluZyAmJiAham9iLnVzZXIpIHtcbiAgICAgIGpvYi5ydW4oKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIDsoam9iLnVzZXIgPyB1c2VyUXVldWUgOiBxdWV1ZSkucHVzaChqb2IpXG4gICAgaWYgKCF3YWl0aW5nKSB7XG4gICAgICB3YWl0aW5nID0gdHJ1ZVxuICAgICAgXy5uZXh0VGljayhmbHVzaClcbiAgICB9XG4gIH1cbn0iLCIvKipcbiAqIEEgZG91Ymx5IGxpbmtlZCBsaXN0LWJhc2VkIExlYXN0IFJlY2VudGx5IFVzZWQgKExSVSlcbiAqIGNhY2hlLiBXaWxsIGtlZXAgbW9zdCByZWNlbnRseSB1c2VkIGl0ZW1zIHdoaWxlXG4gKiBkaXNjYXJkaW5nIGxlYXN0IHJlY2VudGx5IHVzZWQgaXRlbXMgd2hlbiBpdHMgbGltaXQgaXNcbiAqIHJlYWNoZWQuIFRoaXMgaXMgYSBiYXJlLWJvbmUgdmVyc2lvbiBvZlxuICogUmFzbXVzIEFuZGVyc3NvbidzIGpzLWxydTpcbiAqXG4gKiAgIGh0dHBzOi8vZ2l0aHViLmNvbS9yc21zL2pzLWxydVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBsaW1pdFxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxuZnVuY3Rpb24gQ2FjaGUgKGxpbWl0KSB7XG4gIHRoaXMuc2l6ZSA9IDBcbiAgdGhpcy5saW1pdCA9IGxpbWl0XG4gIHRoaXMuaGVhZCA9IHRoaXMudGFpbCA9IHVuZGVmaW5lZFxuICB0aGlzLl9rZXltYXAgPSB7fVxufVxuXG52YXIgcCA9IENhY2hlLnByb3RvdHlwZVxuXG4vKipcbiAqIFB1dCA8dmFsdWU+IGludG8gdGhlIGNhY2hlIGFzc29jaWF0ZWQgd2l0aCA8a2V5Pi5cbiAqIFJldHVybnMgdGhlIGVudHJ5IHdoaWNoIHdhcyByZW1vdmVkIHRvIG1ha2Ugcm9vbSBmb3JcbiAqIHRoZSBuZXcgZW50cnkuIE90aGVyd2lzZSB1bmRlZmluZWQgaXMgcmV0dXJuZWQuXG4gKiAoaS5lLiBpZiB0aGVyZSB3YXMgZW5vdWdoIHJvb20gYWxyZWFkeSkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7RW50cnl8dW5kZWZpbmVkfVxuICovXG5cbnAucHV0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdmFyIGVudHJ5ID0ge1xuICAgIGtleTprZXksXG4gICAgdmFsdWU6dmFsdWVcbiAgfVxuICB0aGlzLl9rZXltYXBba2V5XSA9IGVudHJ5XG4gIGlmICh0aGlzLnRhaWwpIHtcbiAgICB0aGlzLnRhaWwubmV3ZXIgPSBlbnRyeVxuICAgIGVudHJ5Lm9sZGVyID0gdGhpcy50YWlsXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5oZWFkID0gZW50cnlcbiAgfVxuICB0aGlzLnRhaWwgPSBlbnRyeVxuICBpZiAodGhpcy5zaXplID09PSB0aGlzLmxpbWl0KSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpZnQoKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuc2l6ZSsrXG4gIH1cbn1cblxuLyoqXG4gKiBQdXJnZSB0aGUgbGVhc3QgcmVjZW50bHkgdXNlZCAob2xkZXN0KSBlbnRyeSBmcm9tIHRoZVxuICogY2FjaGUuIFJldHVybnMgdGhlIHJlbW92ZWQgZW50cnkgb3IgdW5kZWZpbmVkIGlmIHRoZVxuICogY2FjaGUgd2FzIGVtcHR5LlxuICovXG5cbnAuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlbnRyeSA9IHRoaXMuaGVhZFxuICBpZiAoZW50cnkpIHtcbiAgICB0aGlzLmhlYWQgPSB0aGlzLmhlYWQubmV3ZXJcbiAgICB0aGlzLmhlYWQub2xkZXIgPSB1bmRlZmluZWRcbiAgICBlbnRyeS5uZXdlciA9IGVudHJ5Lm9sZGVyID0gdW5kZWZpbmVkXG4gICAgdGhpcy5fa2V5bWFwW2VudHJ5LmtleV0gPSB1bmRlZmluZWRcbiAgfVxuICByZXR1cm4gZW50cnlcbn1cblxuLyoqXG4gKiBHZXQgYW5kIHJlZ2lzdGVyIHJlY2VudCB1c2Ugb2YgPGtleT4uIFJldHVybnMgdGhlIHZhbHVlXG4gKiBhc3NvY2lhdGVkIHdpdGggPGtleT4gb3IgdW5kZWZpbmVkIGlmIG5vdCBpbiBjYWNoZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge0Jvb2xlYW59IHJldHVybkVudHJ5XG4gKiBAcmV0dXJuIHtFbnRyeXwqfVxuICovXG5cbnAuZ2V0ID0gZnVuY3Rpb24gKGtleSwgcmV0dXJuRW50cnkpIHtcbiAgdmFyIGVudHJ5ID0gdGhpcy5fa2V5bWFwW2tleV1cbiAgaWYgKGVudHJ5ID09PSB1bmRlZmluZWQpIHJldHVyblxuICBpZiAoZW50cnkgPT09IHRoaXMudGFpbCkge1xuICAgIHJldHVybiByZXR1cm5FbnRyeVxuICAgICAgPyBlbnRyeVxuICAgICAgOiBlbnRyeS52YWx1ZVxuICB9XG4gIC8vIEhFQUQtLS0tLS0tLS0tLS0tLVRBSUxcbiAgLy8gICA8Lm9sZGVyICAgLm5ld2VyPlxuICAvLyAgPC0tLSBhZGQgZGlyZWN0aW9uIC0tXG4gIC8vICAgQSAgQiAgQyAgPEQ+ICBFXG4gIGlmIChlbnRyeS5uZXdlcikge1xuICAgIGlmIChlbnRyeSA9PT0gdGhpcy5oZWFkKSB7XG4gICAgICB0aGlzLmhlYWQgPSBlbnRyeS5uZXdlclxuICAgIH1cbiAgICBlbnRyeS5uZXdlci5vbGRlciA9IGVudHJ5Lm9sZGVyIC8vIEMgPC0tIEUuXG4gIH1cbiAgaWYgKGVudHJ5Lm9sZGVyKSB7XG4gICAgZW50cnkub2xkZXIubmV3ZXIgPSBlbnRyeS5uZXdlciAvLyBDLiAtLT4gRVxuICB9XG4gIGVudHJ5Lm5ld2VyID0gdW5kZWZpbmVkIC8vIEQgLS14XG4gIGVudHJ5Lm9sZGVyID0gdGhpcy50YWlsIC8vIEQuIC0tPiBFXG4gIGlmICh0aGlzLnRhaWwpIHtcbiAgICB0aGlzLnRhaWwubmV3ZXIgPSBlbnRyeSAvLyBFLiA8LS0gRFxuICB9XG4gIHRoaXMudGFpbCA9IGVudHJ5XG4gIHJldHVybiByZXR1cm5FbnRyeVxuICAgID8gZW50cnlcbiAgICA6IGVudHJ5LnZhbHVlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FjaGUiLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGNvbmZpZyA9IHJlcXVpcmUoJy4uL2NvbmZpZycpXG52YXIgdGV4dFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGV4dCcpXG52YXIgZGlyUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy9kaXJlY3RpdmUnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG5cbi8vIGludGVybmFsIGRpcmVjdGl2ZXNcbnZhciBwcm9wRGVmID0gcmVxdWlyZSgnLi4vZGlyZWN0aXZlcy9wcm9wJylcbnZhciBjb21wb25lbnREZWYgPSByZXF1aXJlKCcuLi9kaXJlY3RpdmVzL2NvbXBvbmVudCcpXG5cbi8vIHRlcm1pbmFsIGRpcmVjdGl2ZXNcbnZhciB0ZXJtaW5hbERpcmVjdGl2ZXMgPSBbXG4gICdyZXBlYXQnLFxuICAnaWYnXG5dXG5cbm1vZHVsZS5leHBvcnRzID0gY29tcGlsZVxuXG4vKipcbiAqIENvbXBpbGUgYSB0ZW1wbGF0ZSBhbmQgcmV0dXJuIGEgcmV1c2FibGUgY29tcG9zaXRlIGxpbmtcbiAqIGZ1bmN0aW9uLCB3aGljaCByZWN1cnNpdmVseSBjb250YWlucyBtb3JlIGxpbmsgZnVuY3Rpb25zXG4gKiBpbnNpZGUuIFRoaXMgdG9wIGxldmVsIGNvbXBpbGUgZnVuY3Rpb24gc2hvdWxkIG9ubHkgYmVcbiAqIGNhbGxlZCBvbiBpbnN0YW5jZSByb290IG5vZGVzLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gcGFydGlhbFxuICogQHBhcmFtIHtCb29sZWFufSB0cmFuc2NsdWRlZFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZSAoZWwsIG9wdGlvbnMsIHBhcnRpYWwsIHRyYW5zY2x1ZGVkKSB7XG4gIC8vIGxpbmsgZnVuY3Rpb24gZm9yIHRoZSBub2RlIGl0c2VsZi5cbiAgdmFyIG5vZGVMaW5rRm4gPSBvcHRpb25zLl9hc0NvbXBvbmVudCAmJiAhcGFydGlhbFxuICAgID8gY29tcGlsZVJvb3QoZWwsIG9wdGlvbnMpXG4gICAgOiBjb21waWxlTm9kZShlbCwgb3B0aW9ucylcbiAgLy8gbGluayBmdW5jdGlvbiBmb3IgdGhlIGNoaWxkTm9kZXNcbiAgdmFyIGNoaWxkTGlua0ZuID1cbiAgICAhKG5vZGVMaW5rRm4gJiYgbm9kZUxpbmtGbi50ZXJtaW5hbCkgJiZcbiAgICBlbC50YWdOYW1lICE9PSAnU0NSSVBUJyAmJlxuICAgIGVsLmhhc0NoaWxkTm9kZXMoKVxuICAgICAgPyBjb21waWxlTm9kZUxpc3QoZWwuY2hpbGROb2Rlcywgb3B0aW9ucylcbiAgICAgIDogbnVsbFxuXG4gIC8qKlxuICAgKiBBIGNvbXBvc2l0ZSBsaW5rZXIgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGEgYWxyZWFkeVxuICAgKiBjb21waWxlZCBwaWVjZSBvZiBET00sIHdoaWNoIGluc3RhbnRpYXRlcyBhbGwgZGlyZWN0aXZlXG4gICAqIGluc3RhbmNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHZtXG4gICAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNvbXBvc2l0ZUxpbmtGbiAodm0sIGVsKSB7XG4gICAgLy8gc2F2ZSBvcmlnaW5hbCBkaXJlY3RpdmUgY291bnQgYmVmb3JlIGxpbmtpbmdcbiAgICAvLyBzbyB3ZSBjYW4gY2FwdHVyZSB0aGUgZGlyZWN0aXZlcyBjcmVhdGVkIGR1cmluZyBhXG4gICAgLy8gcGFydGlhbCBjb21waWxhdGlvbi5cbiAgICB2YXIgb3JpZ2luYWxEaXJDb3VudCA9IHZtLl9kaXJlY3RpdmVzLmxlbmd0aFxuICAgIHZhciBwYXJlbnRPcmlnaW5hbERpckNvdW50ID1cbiAgICAgIHZtLiRwYXJlbnQgJiYgdm0uJHBhcmVudC5fZGlyZWN0aXZlcy5sZW5ndGhcbiAgICAvLyBjYWNoZSBjaGlsZE5vZGVzIGJlZm9yZSBsaW5raW5nIHBhcmVudCwgZml4ICM2NTdcbiAgICB2YXIgY2hpbGROb2RlcyA9IF8udG9BcnJheShlbC5jaGlsZE5vZGVzKVxuICAgIC8vIGlmIHRoaXMgaXMgYSB0cmFuc2NsdWRlZCBjb21waWxlLCBsaW5rZXJzIG5lZWQgdG8gYmVcbiAgICAvLyBjYWxsZWQgaW4gc291cmNlIHNjb3BlLCBhbmQgdGhlIGhvc3QgbmVlZHMgdG8gYmVcbiAgICAvLyBwYXNzZWQgZG93bi5cbiAgICB2YXIgc291cmNlID0gdHJhbnNjbHVkZWQgPyB2bS4kcGFyZW50IDogdm1cbiAgICB2YXIgaG9zdCA9IHRyYW5zY2x1ZGVkID8gdm0gOiB1bmRlZmluZWRcbiAgICAvLyBsaW5rXG4gICAgaWYgKG5vZGVMaW5rRm4pIG5vZGVMaW5rRm4oc291cmNlLCBlbCwgaG9zdClcbiAgICBpZiAoY2hpbGRMaW5rRm4pIGNoaWxkTGlua0ZuKHNvdXJjZSwgY2hpbGROb2RlcywgaG9zdClcblxuICAgIHZhciBzZWxmRGlycyA9IHZtLl9kaXJlY3RpdmVzLnNsaWNlKG9yaWdpbmFsRGlyQ291bnQpXG4gICAgdmFyIHBhcmVudERpcnMgPSB2bS4kcGFyZW50ICYmXG4gICAgICB2bS4kcGFyZW50Ll9kaXJlY3RpdmVzLnNsaWNlKHBhcmVudE9yaWdpbmFsRGlyQ291bnQpXG5cbiAgICAvKipcbiAgICAgKiBUaGUgbGlua2VyIGZ1bmN0aW9uIHJldHVybnMgYW4gdW5saW5rIGZ1bmN0aW9uIHRoYXRcbiAgICAgKiB0ZWFyc2Rvd24gYWxsIGRpcmVjdGl2ZXMgaW5zdGFuY2VzIGdlbmVyYXRlZCBkdXJpbmdcbiAgICAgKiB0aGUgcHJvY2Vzcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZGVzdHJveWluZ1xuICAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbiB1bmxpbmsgKGRlc3Ryb3lpbmcpIHtcbiAgICAgIHRlYXJkb3duRGlycyh2bSwgc2VsZkRpcnMsIGRlc3Ryb3lpbmcpXG4gICAgICBpZiAocGFyZW50RGlycykge1xuICAgICAgICB0ZWFyZG93bkRpcnModm0uJHBhcmVudCwgcGFyZW50RGlycylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyB0cmFuc2NsdWRlZCBsaW5rRm5zIGFyZSB0ZXJtaW5hbCwgYmVjYXVzZSBpdCB0YWtlc1xuICAvLyBvdmVyIHRoZSBlbnRpcmUgc3ViLXRyZWUuXG4gIGlmICh0cmFuc2NsdWRlZCkge1xuICAgIGNvbXBvc2l0ZUxpbmtGbi50ZXJtaW5hbCA9IHRydWVcbiAgfVxuXG4gIHJldHVybiBjb21wb3NpdGVMaW5rRm5cbn1cblxuLyoqXG4gKiBUZWFyZG93biBhIHN1YnNldCBvZiBkaXJlY3RpdmVzIG9uIGEgdm0uXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0FycmF5fSBkaXJzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRlc3Ryb3lpbmdcbiAqL1xuXG5mdW5jdGlvbiB0ZWFyZG93bkRpcnMgKHZtLCBkaXJzLCBkZXN0cm95aW5nKSB7XG4gIHZhciBpID0gZGlycy5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGRpcnNbaV0uX3RlYXJkb3duKClcbiAgICBpZiAoIWRlc3Ryb3lpbmcpIHtcbiAgICAgIHZtLl9kaXJlY3RpdmVzLiRyZW1vdmUoZGlyc1tpXSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIHRoZSByb290IGVsZW1lbnQgb2YgYSBjb21wb25lbnQuIFRoZXJlIGFyZVxuICogMyB0eXBlcyBvZiB0aGluZ3MgdG8gcHJvY2VzcyBoZXJlOlxuICogXG4gKiAxLiBwcm9wcyBvbiBwYXJlbnQgY29udGFpbmVyIChjaGlsZCBzY29wZSlcbiAqIDIuIG90aGVyIGF0dHJzIG9uIHBhcmVudCBjb250YWluZXIgKHBhcmVudCBzY29wZSlcbiAqIDMuIGF0dHJzIG9uIHRoZSBjb21wb25lbnQgdGVtcGxhdGUgcm9vdCBub2RlLCBpZlxuICogICAgcmVwbGFjZTp0cnVlIChjaGlsZCBzY29wZSlcbiAqXG4gKiBBbHNvLCBpZiB0aGlzIGlzIGEgYmxvY2sgaW5zdGFuY2UsIHdlIG9ubHkgbmVlZCB0b1xuICogY29tcGlsZSAxICYgMiBoZXJlLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlUm9vdCAoZWwsIG9wdGlvbnMpIHtcbiAgdmFyIGlzQmxvY2sgPSBlbC5ub2RlVHlwZSA9PT0gMTEgLy8gRG9jdW1lbnRGcmFnbWVudFxuICB2YXIgY29udGFpbmVyQXR0cnMgPSBvcHRpb25zLl9jb250YWluZXJBdHRyc1xuICB2YXIgcmVwbGFjZXJBdHRycyA9IG9wdGlvbnMuX3JlcGxhY2VyQXR0cnNcbiAgdmFyIHByb3BzID0gb3B0aW9ucy5wcm9wc1xuICB2YXIgcHJvcHNMaW5rRm4sIHBhcmVudExpbmtGbiwgcmVwbGFjZXJMaW5rRm5cbiAgLy8gMS4gcHJvcHNcbiAgcHJvcHNMaW5rRm4gPSBwcm9wc1xuICAgID8gY29tcGlsZVByb3BzKGVsLCBjb250YWluZXJBdHRycywgcHJvcHMpXG4gICAgOiBudWxsXG4gIGlmICghaXNCbG9jaykge1xuICAgIC8vIDIuIGNvbnRhaW5lciBhdHRyaWJ1dGVzXG4gICAgaWYgKGNvbnRhaW5lckF0dHJzKSB7XG4gICAgICBwYXJlbnRMaW5rRm4gPSBjb21waWxlRGlyZWN0aXZlcyhjb250YWluZXJBdHRycywgb3B0aW9ucylcbiAgICB9XG4gICAgaWYgKHJlcGxhY2VyQXR0cnMpIHtcbiAgICAgIC8vIDMuIHJlcGxhY2VyIGF0dHJpYnV0ZXNcbiAgICAgIHJlcGxhY2VyTGlua0ZuID0gY29tcGlsZURpcmVjdGl2ZXMocmVwbGFjZXJBdHRycywgb3B0aW9ucylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIHJvb3RMaW5rRm4gKHZtLCBlbCwgaG9zdCkge1xuICAgIC8vIGV4cGxpY2l0bHkgcGFzc2luZyBudWxsIHRvIHByb3BzXG4gICAgLy8gbGlua2VycyBiZWNhdXNlIHRoZXkgZG9uJ3QgbmVlZCBhIHJlYWwgZWxlbWVudFxuICAgIGlmIChwcm9wc0xpbmtGbikgcHJvcHNMaW5rRm4odm0sIG51bGwpXG4gICAgaWYgKHBhcmVudExpbmtGbikgcGFyZW50TGlua0ZuKHZtLiRwYXJlbnQsIGVsLCBob3N0KVxuICAgIGlmIChyZXBsYWNlckxpbmtGbikgcmVwbGFjZXJMaW5rRm4odm0sIGVsLCBob3N0KVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIG5vZGUgYW5kIHJldHVybiBhIG5vZGVMaW5rRm4gYmFzZWQgb24gdGhlXG4gKiBub2RlIHR5cGUuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258bnVsbH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlTm9kZSAobm9kZSwgb3B0aW9ucykge1xuICB2YXIgdHlwZSA9IG5vZGUubm9kZVR5cGVcbiAgaWYgKHR5cGUgPT09IDEgJiYgbm9kZS50YWdOYW1lICE9PSAnU0NSSVBUJykge1xuICAgIHJldHVybiBjb21waWxlRWxlbWVudChub2RlLCBvcHRpb25zKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09IDMgJiYgY29uZmlnLmludGVycG9sYXRlICYmIG5vZGUuZGF0YS50cmltKCkpIHtcbiAgICByZXR1cm4gY29tcGlsZVRleHROb2RlKG5vZGUsIG9wdGlvbnMpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG4vKipcbiAqIENvbXBpbGUgYW4gZWxlbWVudCBhbmQgcmV0dXJuIGEgbm9kZUxpbmtGbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258bnVsbH1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlRWxlbWVudCAoZWwsIG9wdGlvbnMpIHtcbiAgaWYgKGNoZWNrVHJhbnNjbHVzaW9uKGVsKSkge1xuICAgIC8vIHVud3JhcCB0ZXh0Tm9kZVxuICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ19fdnVlX193cmFwJykpIHtcbiAgICAgIGVsID0gZWwuZmlyc3RDaGlsZFxuICAgIH1cbiAgICByZXR1cm4gY29tcGlsZShlbCwgb3B0aW9ucy5fcGFyZW50LiRvcHRpb25zLCB0cnVlLCB0cnVlKVxuICB9XG4gIHZhciBsaW5rRm5cbiAgdmFyIGhhc0F0dHJzID0gZWwuaGFzQXR0cmlidXRlcygpXG4gIC8vIGNoZWNrIGVsZW1lbnQgZGlyZWN0aXZlc1xuICBsaW5rRm4gPSBjaGVja0VsZW1lbnREaXJlY3RpdmVzKGVsLCBvcHRpb25zKVxuICAvLyBjaGVjayB0ZXJtaW5hbCBkaXJlY2l0dmVzIChyZXBlYXQgJiBpZilcbiAgaWYgKCFsaW5rRm4gJiYgaGFzQXR0cnMpIHtcbiAgICBsaW5rRm4gPSBjaGVja1Rlcm1pbmFsRGlyZWN0aXZlcyhlbCwgb3B0aW9ucylcbiAgfVxuICAvLyBjaGVjayBjb21wb25lbnRcbiAgaWYgKCFsaW5rRm4pIHtcbiAgICBsaW5rRm4gPSBjaGVja0NvbXBvbmVudChlbCwgb3B0aW9ucylcbiAgfVxuICAvLyBub3JtYWwgZGlyZWN0aXZlc1xuICBpZiAoIWxpbmtGbiAmJiBoYXNBdHRycykge1xuICAgIGxpbmtGbiA9IGNvbXBpbGVEaXJlY3RpdmVzKGVsLCBvcHRpb25zKVxuICB9XG4gIC8vIGlmIHRoZSBlbGVtZW50IGlzIGEgdGV4dGFyZWEsIHdlIG5lZWQgdG8gaW50ZXJwb2xhdGVcbiAgLy8gaXRzIGNvbnRlbnQgb24gaW5pdGlhbCByZW5kZXIuXG4gIGlmIChlbC50YWdOYW1lID09PSAnVEVYVEFSRUEnKSB7XG4gICAgdmFyIHJlYWxMaW5rRm4gPSBsaW5rRm5cbiAgICBsaW5rRm4gPSBmdW5jdGlvbiAodm0sIGVsKSB7XG4gICAgICBlbC52YWx1ZSA9IHZtLiRpbnRlcnBvbGF0ZShlbC52YWx1ZSlcbiAgICAgIGlmIChyZWFsTGlua0ZuKSByZWFsTGlua0ZuKHZtLCBlbClcbiAgICB9XG4gICAgbGlua0ZuLnRlcm1pbmFsID0gdHJ1ZVxuICB9XG4gIHJldHVybiBsaW5rRm5cbn1cblxuLyoqXG4gKiBDb21waWxlIGEgdGV4dE5vZGUgYW5kIHJldHVybiBhIG5vZGVMaW5rRm4uXG4gKlxuICogQHBhcmFtIHtUZXh0Tm9kZX0gbm9kZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufG51bGx9IHRleHROb2RlTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZVRleHROb2RlIChub2RlLCBvcHRpb25zKSB7XG4gIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKG5vZGUuZGF0YSlcbiAgaWYgKCF0b2tlbnMpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gIHZhciBlbCwgdG9rZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICBlbCA9IHRva2VuLnRhZ1xuICAgICAgPyBwcm9jZXNzVGV4dFRva2VuKHRva2VuLCBvcHRpb25zKVxuICAgICAgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0b2tlbi52YWx1ZSlcbiAgICBmcmFnLmFwcGVuZENoaWxkKGVsKVxuICB9XG4gIHJldHVybiBtYWtlVGV4dE5vZGVMaW5rRm4odG9rZW5zLCBmcmFnLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIFByb2Nlc3MgYSBzaW5nbGUgdGV4dCB0b2tlbi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdG9rZW5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5cbmZ1bmN0aW9uIHByb2Nlc3NUZXh0VG9rZW4gKHRva2VuLCBvcHRpb25zKSB7XG4gIHZhciBlbFxuICBpZiAodG9rZW4ub25lVGltZSkge1xuICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodG9rZW4udmFsdWUpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHRva2VuLmh0bWwpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1odG1sJylcbiAgICAgIHNldFRva2VuVHlwZSgnaHRtbCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElFIHdpbGwgY2xlYW4gdXAgZW1wdHkgdGV4dE5vZGVzIGR1cmluZ1xuICAgICAgLy8gZnJhZy5jbG9uZU5vZGUodHJ1ZSksIHNvIHdlIGhhdmUgdG8gZ2l2ZSBpdFxuICAgICAgLy8gc29tZXRoaW5nIGhlcmUuLi5cbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAnKVxuICAgICAgc2V0VG9rZW5UeXBlKCd0ZXh0JylcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0VG9rZW5UeXBlICh0eXBlKSB7XG4gICAgdG9rZW4udHlwZSA9IHR5cGVcbiAgICB0b2tlbi5kZWYgPSBvcHRpb25zLmRpcmVjdGl2ZXNbdHlwZV1cbiAgICB0b2tlbi5kZXNjcmlwdG9yID0gZGlyUGFyc2VyLnBhcnNlKHRva2VuLnZhbHVlKVswXVxuICB9XG4gIHJldHVybiBlbFxufVxuXG4vKipcbiAqIEJ1aWxkIGEgZnVuY3Rpb24gdGhhdCBwcm9jZXNzZXMgYSB0ZXh0Tm9kZS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHRva2Vuc1xuICogQHBhcmFtIHtEb2N1bWVudEZyYWdtZW50fSBmcmFnXG4gKi9cblxuZnVuY3Rpb24gbWFrZVRleHROb2RlTGlua0ZuICh0b2tlbnMsIGZyYWcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRleHROb2RlTGlua0ZuICh2bSwgZWwpIHtcbiAgICB2YXIgZnJhZ0Nsb25lID0gZnJhZy5jbG9uZU5vZGUodHJ1ZSlcbiAgICB2YXIgY2hpbGROb2RlcyA9IF8udG9BcnJheShmcmFnQ2xvbmUuY2hpbGROb2RlcylcbiAgICB2YXIgdG9rZW4sIHZhbHVlLCBub2RlXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXVxuICAgICAgdmFsdWUgPSB0b2tlbi52YWx1ZVxuICAgICAgaWYgKHRva2VuLnRhZykge1xuICAgICAgICBub2RlID0gY2hpbGROb2Rlc1tpXVxuICAgICAgICBpZiAodG9rZW4ub25lVGltZSkge1xuICAgICAgICAgIHZhbHVlID0gdm0uJGV2YWwodmFsdWUpXG4gICAgICAgICAgaWYgKHRva2VuLmh0bWwpIHtcbiAgICAgICAgICAgIF8ucmVwbGFjZShub2RlLCB0ZW1wbGF0ZVBhcnNlci5wYXJzZSh2YWx1ZSwgdHJ1ZSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUuZGF0YSA9IHZhbHVlXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZtLl9iaW5kRGlyKHRva2VuLnR5cGUsIG5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgdG9rZW4uZGVzY3JpcHRvciwgdG9rZW4uZGVmKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIF8ucmVwbGFjZShlbCwgZnJhZ0Nsb25lKVxuICB9XG59XG5cbi8qKlxuICogQ29tcGlsZSBhIG5vZGUgbGlzdCBhbmQgcmV0dXJuIGEgY2hpbGRMaW5rRm4uXG4gKlxuICogQHBhcmFtIHtOb2RlTGlzdH0gbm9kZUxpc3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbnx1bmRlZmluZWR9XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZU5vZGVMaXN0IChub2RlTGlzdCwgb3B0aW9ucykge1xuICB2YXIgbGlua0ZucyA9IFtdXG4gIHZhciBub2RlTGlua0ZuLCBjaGlsZExpbmtGbiwgbm9kZVxuICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGVMaXN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIG5vZGUgPSBub2RlTGlzdFtpXVxuICAgIG5vZGVMaW5rRm4gPSBjb21waWxlTm9kZShub2RlLCBvcHRpb25zKVxuICAgIGNoaWxkTGlua0ZuID1cbiAgICAgICEobm9kZUxpbmtGbiAmJiBub2RlTGlua0ZuLnRlcm1pbmFsKSAmJlxuICAgICAgbm9kZS50YWdOYW1lICE9PSAnU0NSSVBUJyAmJlxuICAgICAgbm9kZS5oYXNDaGlsZE5vZGVzKClcbiAgICAgICAgPyBjb21waWxlTm9kZUxpc3Qobm9kZS5jaGlsZE5vZGVzLCBvcHRpb25zKVxuICAgICAgICA6IG51bGxcbiAgICBsaW5rRm5zLnB1c2gobm9kZUxpbmtGbiwgY2hpbGRMaW5rRm4pXG4gIH1cbiAgcmV0dXJuIGxpbmtGbnMubGVuZ3RoXG4gICAgPyBtYWtlQ2hpbGRMaW5rRm4obGlua0ZucylcbiAgICA6IG51bGxcbn1cblxuLyoqXG4gKiBNYWtlIGEgY2hpbGQgbGluayBmdW5jdGlvbiBmb3IgYSBub2RlJ3MgY2hpbGROb2Rlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PEZ1bmN0aW9uPn0gbGlua0Zuc1xuICogQHJldHVybiB7RnVuY3Rpb259IGNoaWxkTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gbWFrZUNoaWxkTGlua0ZuIChsaW5rRm5zKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjaGlsZExpbmtGbiAodm0sIG5vZGVzLCBob3N0KSB7XG4gICAgdmFyIG5vZGUsIG5vZGVMaW5rRm4sIGNoaWxkcmVuTGlua0ZuXG4gICAgZm9yICh2YXIgaSA9IDAsIG4gPSAwLCBsID0gbGlua0Zucy5sZW5ndGg7IGkgPCBsOyBuKyspIHtcbiAgICAgIG5vZGUgPSBub2Rlc1tuXVxuICAgICAgbm9kZUxpbmtGbiA9IGxpbmtGbnNbaSsrXVxuICAgICAgY2hpbGRyZW5MaW5rRm4gPSBsaW5rRm5zW2krK11cbiAgICAgIC8vIGNhY2hlIGNoaWxkTm9kZXMgYmVmb3JlIGxpbmtpbmcgcGFyZW50LCBmaXggIzY1N1xuICAgICAgdmFyIGNoaWxkTm9kZXMgPSBfLnRvQXJyYXkobm9kZS5jaGlsZE5vZGVzKVxuICAgICAgaWYgKG5vZGVMaW5rRm4pIHtcbiAgICAgICAgbm9kZUxpbmtGbih2bSwgbm9kZSwgaG9zdClcbiAgICAgIH1cbiAgICAgIGlmIChjaGlsZHJlbkxpbmtGbikge1xuICAgICAgICBjaGlsZHJlbkxpbmtGbih2bSwgY2hpbGROb2RlcywgaG9zdClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIHBhcmFtIGF0dHJpYnV0ZXMgb24gYSByb290IGVsZW1lbnQgYW5kIHJldHVyblxuICogYSBwcm9wcyBsaW5rIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IGF0dHJzXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wTmFtZXNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBwcm9wc0xpbmtGblxuICovXG5cbi8vIHJlZ2V4IHRvIHRlc3QgaWYgYSBwYXRoIGlzIFwic2V0dGFibGVcIlxuLy8gaWYgbm90IHRoZSBwcm9wIGJpbmRpbmcgaXMgYXV0b21hdGljYWxseSBvbmUtd2F5LlxudmFyIHNldHRhYmxlUGF0aFJFID0gL15bQS1aYS16XyRdW1xcdyRdKihcXC5bQS1aYS16XyRdW1xcdyRdKnxcXFtbXlxcW1xcXV1cXF0pKiQvXG5cbmZ1bmN0aW9uIGNvbXBpbGVQcm9wcyAoZWwsIGF0dHJzLCBwcm9wTmFtZXMpIHtcbiAgdmFyIHByb3BzID0gW11cbiAgdmFyIGkgPSBwcm9wTmFtZXMubGVuZ3RoXG4gIHZhciBuYW1lLCB2YWx1ZSwgcHJvcFxuICB3aGlsZSAoaS0tKSB7XG4gICAgbmFtZSA9IHByb3BOYW1lc1tpXVxuICAgIGlmICgvW0EtWl0vLnRlc3QobmFtZSkpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ1lvdSBzZWVtIHRvIGJlIHVzaW5nIGNhbWVsQ2FzZSBmb3IgYSBjb21wb25lbnQgcHJvcCwgJyArXG4gICAgICAgICdidXQgSFRNTCBkb2VzblxcJ3QgZGlmZmVyZW50aWF0ZSBiZXR3ZWVuIHVwcGVyIGFuZCAnICtcbiAgICAgICAgJ2xvd2VyIGNhc2UuIFlvdSBzaG91bGQgdXNlIGh5cGhlbi1kZWxpbWl0ZWQgJyArXG4gICAgICAgICdhdHRyaWJ1dGUgbmFtZXMuIEZvciBtb3JlIGluZm8gc2VlICcgK1xuICAgICAgICAnaHR0cDovL3Z1ZWpzLm9yZy9hcGkvb3B0aW9ucy5odG1sI3Byb3BzJ1xuICAgICAgKVxuICAgIH1cbiAgICB2YWx1ZSA9IGF0dHJzW25hbWVdXG4gICAgLyoganNoaW50IGVxZXFlcTpmYWxzZSAqL1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICBwcm9wID0ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH1cbiAgICAgIHZhciB0b2tlbnMgPSB0ZXh0UGFyc2VyLnBhcnNlKHZhbHVlKVxuICAgICAgaWYgKHRva2Vucykge1xuICAgICAgICBpZiAoZWwgJiYgZWwubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbiAgICAgICAgfVxuICAgICAgICBhdHRyc1tuYW1lXSA9IG51bGxcbiAgICAgICAgcHJvcC5keW5hbWljID0gdHJ1ZVxuICAgICAgICBwcm9wLnZhbHVlID0gdGV4dFBhcnNlci50b2tlbnNUb0V4cCh0b2tlbnMpXG4gICAgICAgIHByb3Aub25lVGltZSA9XG4gICAgICAgICAgdG9rZW5zLmxlbmd0aCA+IDEgfHxcbiAgICAgICAgICB0b2tlbnNbMF0ub25lVGltZSB8fFxuICAgICAgICAgICFzZXR0YWJsZVBhdGhSRS50ZXN0KHByb3AudmFsdWUpXG4gICAgICB9XG4gICAgICBwcm9wcy5wdXNoKHByb3ApXG4gICAgfVxuICB9XG4gIHJldHVybiBtYWtlUHJvcHNMaW5rRm4ocHJvcHMpXG59XG5cbi8qKlxuICogQnVpbGQgYSBmdW5jdGlvbiB0aGF0IGFwcGxpZXMgcHJvcHMgdG8gYSB2bS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wc1xuICogQHJldHVybiB7RnVuY3Rpb259IHByb3BzTGlua0ZuXG4gKi9cblxudmFyIGRhdGFBdHRyUkUgPSAvXmRhdGEtL1xuXG5mdW5jdGlvbiBtYWtlUHJvcHNMaW5rRm4gKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwcm9wc0xpbmtGbiAodm0sIGVsKSB7XG4gICAgdmFyIGkgPSBwcm9wcy5sZW5ndGhcbiAgICB2YXIgcHJvcCwgcGF0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHByb3AgPSBwcm9wc1tpXVxuICAgICAgLy8gcHJvcHMgY291bGQgY29udGFpbiBkYXNoZXMsIHdoaWNoIHdpbGwgYmVcbiAgICAgIC8vIGludGVycHJldGVkIGFzIG1pbnVzIGNhbGN1bGF0aW9ucyBieSB0aGUgcGFyc2VyXG4gICAgICAvLyBzbyB3ZSBuZWVkIHRvIHdyYXAgdGhlIHBhdGggaGVyZVxuICAgICAgcGF0aCA9IF8uY2FtZWxpemUocHJvcC5uYW1lLnJlcGxhY2UoZGF0YUF0dHJSRSwgJycpKVxuICAgICAgaWYgKHByb3AuZHluYW1pYykge1xuICAgICAgICB2bS5fYmluZERpcigncHJvcCcsIGVsLCB7XG4gICAgICAgICAgYXJnOiBwYXRoLFxuICAgICAgICAgIGV4cHJlc3Npb246IHByb3AudmFsdWUsXG4gICAgICAgICAgb25lV2F5OiBwcm9wLm9uZVRpbWVcbiAgICAgICAgfSwgcHJvcERlZilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGp1c3Qgc2V0IG9uY2VcbiAgICAgICAgdm0uJHNldChwYXRoLCBwcm9wLnZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBlbGVtZW50IGRpcmVjdGl2ZXMgKGN1c3RvbSBlbGVtZW50cyB0aGF0IHNob3VsZFxuICogYmUgcmVzb3ZsZWQgYXMgdGVybWluYWwgZGlyZWN0aXZlcykuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuXG5mdW5jdGlvbiBjaGVja0VsZW1lbnREaXJlY3RpdmVzIChlbCwgb3B0aW9ucykge1xuICB2YXIgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIHZhciBkZWYgPSBvcHRpb25zLmVsZW1lbnREaXJlY3RpdmVzW3RhZ11cbiAgaWYgKGRlZikge1xuICAgIHJldHVybiBtYWtlVGVybWluYWxOb2RlTGlua0ZuKGVsLCB0YWcsICcnLCBvcHRpb25zLCBkZWYpXG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBpZiBhbiBlbGVtZW50IGlzIGEgY29tcG9uZW50LiBJZiB5ZXMsIHJldHVyblxuICogYSBjb21wb25lbnQgbGluayBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb258dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIGNoZWNrQ29tcG9uZW50IChlbCwgb3B0aW9ucykge1xuICB2YXIgY29tcG9uZW50SWQgPSBfLmNoZWNrQ29tcG9uZW50KGVsLCBvcHRpb25zKVxuICBpZiAoY29tcG9uZW50SWQpIHtcbiAgICB2YXIgY29tcG9uZW50TGlua0ZuID0gZnVuY3Rpb24gKHZtLCBlbCwgaG9zdCkge1xuICAgICAgdm0uX2JpbmREaXIoJ2NvbXBvbmVudCcsIGVsLCB7XG4gICAgICAgIGV4cHJlc3Npb246IGNvbXBvbmVudElkXG4gICAgICB9LCBjb21wb25lbnREZWYsIGhvc3QpXG4gICAgfVxuICAgIGNvbXBvbmVudExpbmtGbi50ZXJtaW5hbCA9IHRydWVcbiAgICByZXR1cm4gY29tcG9uZW50TGlua0ZuXG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayBhbiBlbGVtZW50IGZvciB0ZXJtaW5hbCBkaXJlY3RpdmVzIGluIGZpeGVkIG9yZGVyLlxuICogSWYgaXQgZmluZHMgb25lLCByZXR1cm4gYSB0ZXJtaW5hbCBsaW5rIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGVybWluYWxMaW5rRm5cbiAqL1xuXG5mdW5jdGlvbiBjaGVja1Rlcm1pbmFsRGlyZWN0aXZlcyAoZWwsIG9wdGlvbnMpIHtcbiAgaWYgKF8uYXR0cihlbCwgJ3ByZScpICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHNraXBcbiAgfVxuICB2YXIgdmFsdWUsIGRpck5hbWVcbiAgLyoganNoaW50IGJvc3M6IHRydWUgKi9cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB0ZXJtaW5hbERpcmVjdGl2ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgZGlyTmFtZSA9IHRlcm1pbmFsRGlyZWN0aXZlc1tpXVxuICAgIGlmICgodmFsdWUgPSBfLmF0dHIoZWwsIGRpck5hbWUpKSAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG1ha2VUZXJtaW5hbE5vZGVMaW5rRm4oZWwsIGRpck5hbWUsIHZhbHVlLCBvcHRpb25zKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBza2lwICgpIHt9XG5za2lwLnRlcm1pbmFsID0gdHJ1ZVxuXG4vKipcbiAqIEJ1aWxkIGEgbm9kZSBsaW5rIGZ1bmN0aW9uIGZvciBhIHRlcm1pbmFsIGRpcmVjdGl2ZS5cbiAqIEEgdGVybWluYWwgbGluayBmdW5jdGlvbiB0ZXJtaW5hdGVzIHRoZSBjdXJyZW50XG4gKiBjb21waWxhdGlvbiByZWN1cnNpb24gYW5kIGhhbmRsZXMgY29tcGlsYXRpb24gb2YgdGhlXG4gKiBzdWJ0cmVlIGluIHRoZSBkaXJlY3RpdmUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IGRpck5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbZGVmXVxuICogQHJldHVybiB7RnVuY3Rpb259IHRlcm1pbmFsTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gbWFrZVRlcm1pbmFsTm9kZUxpbmtGbiAoZWwsIGRpck5hbWUsIHZhbHVlLCBvcHRpb25zLCBkZWYpIHtcbiAgdmFyIGRlc2NyaXB0b3IgPSBkaXJQYXJzZXIucGFyc2UodmFsdWUpWzBdXG4gIGRlZiA9IGRlZiB8fCBvcHRpb25zLmRpcmVjdGl2ZXNbZGlyTmFtZV1cbiAgdmFyIGZuID0gZnVuY3Rpb24gdGVybWluYWxOb2RlTGlua0ZuICh2bSwgZWwsIGhvc3QpIHtcbiAgICB2bS5fYmluZERpcihkaXJOYW1lLCBlbCwgZGVzY3JpcHRvciwgZGVmLCBob3N0KVxuICB9XG4gIGZuLnRlcm1pbmFsID0gdHJ1ZVxuICByZXR1cm4gZm5cbn1cblxuLyoqXG4gKiBDb21waWxlIHRoZSBkaXJlY3RpdmVzIG9uIGFuIGVsZW1lbnQgYW5kIHJldHVybiBhIGxpbmtlci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbE9yQXR0cnNcbiAqICAgICAgICAtIGNvdWxkIGJlIGFuIG9iamVjdCBvZiBhbHJlYWR5LWV4dHJhY3RlZFxuICogICAgICAgICAgY29udGFpbmVyIGF0dHJpYnV0ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZnVuY3Rpb24gY29tcGlsZURpcmVjdGl2ZXMgKGVsT3JBdHRycywgb3B0aW9ucykge1xuICB2YXIgYXR0cnMgPSBfLmlzUGxhaW5PYmplY3QoZWxPckF0dHJzKVxuICAgID8gbWFwVG9MaXN0KGVsT3JBdHRycylcbiAgICA6IGVsT3JBdHRycy5hdHRyaWJ1dGVzXG4gIHZhciBpID0gYXR0cnMubGVuZ3RoXG4gIHZhciBkaXJzID0gW11cbiAgdmFyIGF0dHIsIG5hbWUsIHZhbHVlLCBkaXIsIGRpck5hbWUsIGRpckRlZlxuICB3aGlsZSAoaS0tKSB7XG4gICAgYXR0ciA9IGF0dHJzW2ldXG4gICAgbmFtZSA9IGF0dHIubmFtZVxuICAgIHZhbHVlID0gYXR0ci52YWx1ZVxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgY29udGludWVcbiAgICBpZiAobmFtZS5pbmRleE9mKGNvbmZpZy5wcmVmaXgpID09PSAwKSB7XG4gICAgICBkaXJOYW1lID0gbmFtZS5zbGljZShjb25maWcucHJlZml4Lmxlbmd0aClcbiAgICAgIGRpckRlZiA9IG9wdGlvbnMuZGlyZWN0aXZlc1tkaXJOYW1lXVxuICAgICAgXy5hc3NlcnRBc3NldChkaXJEZWYsICdkaXJlY3RpdmUnLCBkaXJOYW1lKVxuICAgICAgaWYgKGRpckRlZikge1xuICAgICAgICBkaXJzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGRpck5hbWUsXG4gICAgICAgICAgZGVzY3JpcHRvcnM6IGRpclBhcnNlci5wYXJzZSh2YWx1ZSksXG4gICAgICAgICAgZGVmOiBkaXJEZWZcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNvbmZpZy5pbnRlcnBvbGF0ZSkge1xuICAgICAgZGlyID0gY29sbGVjdEF0dHJEaXJlY3RpdmUobmFtZSwgdmFsdWUsIG9wdGlvbnMpXG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIGRpcnMucHVzaChkaXIpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIC8vIHNvcnQgYnkgcHJpb3JpdHksIExPVyB0byBISUdIXG4gIGlmIChkaXJzLmxlbmd0aCkge1xuICAgIGRpcnMuc29ydChkaXJlY3RpdmVDb21wYXJhdG9yKVxuICAgIHJldHVybiBtYWtlTm9kZUxpbmtGbihkaXJzKVxuICB9XG59XG5cbi8qKlxuICogQ29udmVydCBhIG1hcCAoT2JqZWN0KSBvZiBhdHRyaWJ1dGVzIHRvIGFuIEFycmF5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXBcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIG1hcFRvTGlzdCAobWFwKSB7XG4gIHZhciBsaXN0ID0gW11cbiAgZm9yICh2YXIga2V5IGluIG1hcCkge1xuICAgIGxpc3QucHVzaCh7XG4gICAgICBuYW1lOiBrZXksXG4gICAgICB2YWx1ZTogbWFwW2tleV1cbiAgICB9KVxuICB9XG4gIHJldHVybiBsaXN0XG59XG5cbi8qKlxuICogQnVpbGQgYSBsaW5rIGZ1bmN0aW9uIGZvciBhbGwgZGlyZWN0aXZlcyBvbiBhIHNpbmdsZSBub2RlLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGRpcmVjdGl2ZXNcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBkaXJlY3RpdmVzTGlua0ZuXG4gKi9cblxuZnVuY3Rpb24gbWFrZU5vZGVMaW5rRm4gKGRpcmVjdGl2ZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG5vZGVMaW5rRm4gKHZtLCBlbCwgaG9zdCkge1xuICAgIC8vIHJldmVyc2UgYXBwbHkgYmVjYXVzZSBpdCdzIHNvcnRlZCBsb3cgdG8gaGlnaFxuICAgIHZhciBpID0gZGlyZWN0aXZlcy5sZW5ndGhcbiAgICB2YXIgZGlyLCBqLCBrXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgZGlyID0gZGlyZWN0aXZlc1tpXVxuICAgICAgaWYgKGRpci5fbGluaykge1xuICAgICAgICAvLyBjdXN0b20gbGluayBmblxuICAgICAgICBkaXIuX2xpbmsodm0sIGVsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgayA9IGRpci5kZXNjcmlwdG9ycy5sZW5ndGhcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGs7IGorKykge1xuICAgICAgICAgIHZtLl9iaW5kRGlyKGRpci5uYW1lLCBlbCxcbiAgICAgICAgICAgIGRpci5kZXNjcmlwdG9yc1tqXSwgZGlyLmRlZiwgaG9zdClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGFuIGF0dHJpYnV0ZSBmb3IgcG90ZW50aWFsIGR5bmFtaWMgYmluZGluZ3MsXG4gKiBhbmQgcmV0dXJuIGEgZGlyZWN0aXZlIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmZ1bmN0aW9uIGNvbGxlY3RBdHRyRGlyZWN0aXZlIChuYW1lLCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZSh2YWx1ZSlcbiAgaWYgKHRva2Vucykge1xuICAgIHZhciBkZWYgPSBvcHRpb25zLmRpcmVjdGl2ZXMuYXR0clxuICAgIHZhciBpID0gdG9rZW5zLmxlbmd0aFxuICAgIHZhciBhbGxPbmVUaW1lID0gdHJ1ZVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpXVxuICAgICAgaWYgKHRva2VuLnRhZyAmJiAhdG9rZW4ub25lVGltZSkge1xuICAgICAgICBhbGxPbmVUaW1lID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlZjogZGVmLFxuICAgICAgX2xpbms6IGFsbE9uZVRpbWVcbiAgICAgICAgPyBmdW5jdGlvbiAodm0sIGVsKSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUobmFtZSwgdm0uJGludGVycG9sYXRlKHZhbHVlKSlcbiAgICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKHZtLCBlbCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGV4dFBhcnNlci50b2tlbnNUb0V4cCh0b2tlbnMsIHZtKVxuICAgICAgICAgICAgdmFyIGRlc2MgPSBkaXJQYXJzZXIucGFyc2UobmFtZSArICc6JyArIHZhbHVlKVswXVxuICAgICAgICAgICAgdm0uX2JpbmREaXIoJ2F0dHInLCBlbCwgZGVzYywgZGVmKVxuICAgICAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgcHJpb3JpdHkgc29ydCBjb21wYXJhdG9yXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBiXG4gKi9cblxuZnVuY3Rpb24gZGlyZWN0aXZlQ29tcGFyYXRvciAoYSwgYikge1xuICBhID0gYS5kZWYucHJpb3JpdHkgfHwgMFxuICBiID0gYi5kZWYucHJpb3JpdHkgfHwgMFxuICByZXR1cm4gYSA+IGIgPyAxIDogLTFcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIGVsZW1lbnQgaXMgdHJhbnNjbHVkZWRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnZhciB0cmFuc2NsdWRlZEZsYWdBdHRyID0gJ19fdnVlX190cmFuc2NsdWRlZCdcbmZ1bmN0aW9uIGNoZWNrVHJhbnNjbHVzaW9uIChlbCkge1xuICBpZiAoZWwubm9kZVR5cGUgPT09IDEgJiYgZWwuaGFzQXR0cmlidXRlKHRyYW5zY2x1ZGVkRmxhZ0F0dHIpKSB7XG4gICAgZWwucmVtb3ZlQXR0cmlidXRlKHRyYW5zY2x1ZGVkRmxhZ0F0dHIpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxudmFyIHRyYW5zY2x1ZGVkRmxhZ0F0dHIgPSAnX192dWVfX3RyYW5zY2x1ZGVkJ1xuXG4vKipcbiAqIFByb2Nlc3MgYW4gZWxlbWVudCBvciBhIERvY3VtZW50RnJhZ21lbnQgYmFzZWQgb24gYVxuICogaW5zdGFuY2Ugb3B0aW9uIG9iamVjdC4gVGhpcyBhbGxvd3MgdXMgdG8gdHJhbnNjbHVkZVxuICogYSB0ZW1wbGF0ZSBub2RlL2ZyYWdtZW50IGJlZm9yZSB0aGUgaW5zdGFuY2UgaXMgY3JlYXRlZCxcbiAqIHNvIHRoZSBwcm9jZXNzZWQgZnJhZ21lbnQgY2FuIHRoZW4gYmUgY2xvbmVkIGFuZCByZXVzZWRcbiAqIGluIHYtcmVwZWF0LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB0cmFuc2NsdWRlIChlbCwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLl9hc0NvbXBvbmVudCkge1xuICAgIC8vIGV4dHJhY3QgY29udGFpbmVyIGF0dHJpYnV0ZXMgdG8gcGFzcyB0aGVtIGRvd25cbiAgICAvLyB0byBjb21waWxlciwgYmVjYXVzZSB0aGV5IG5lZWQgdG8gYmUgY29tcGlsZWQgaW5cbiAgICAvLyBwYXJlbnQgc2NvcGUuIHdlIGFyZSBtdXRhdGluZyB0aGUgb3B0aW9ucyBvYmplY3QgaGVyZVxuICAgIC8vIGFzc3VtaW5nIHRoZSBzYW1lIG9iamVjdCB3aWxsIGJlIHVzZWQgZm9yIGNvbXBpbGVcbiAgICAvLyByaWdodCBhZnRlciB0aGlzLlxuICAgIG9wdGlvbnMuX2NvbnRhaW5lckF0dHJzID0gZXh0cmFjdEF0dHJzKGVsKVxuICAgIC8vIE1hcmsgY29udGVudCBub2RlcyBhbmQgYXR0cnMgc28gdGhhdCB0aGUgY29tcGlsZXJcbiAgICAvLyBrbm93cyB0aGV5IHNob3VsZCBiZSBjb21waWxlZCBpbiBwYXJlbnQgc2NvcGUuXG4gICAgdmFyIGkgPSBlbC5jaGlsZE5vZGVzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHZhciBub2RlID0gZWwuY2hpbGROb2Rlc1tpXVxuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUodHJhbnNjbHVkZWRGbGFnQXR0ciwgJycpXG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMgJiYgbm9kZS5kYXRhLnRyaW0oKSkge1xuICAgICAgICAvLyB3cmFwIHRyYW5zY2x1ZGVkIHRleHROb2RlcyBpbiBzcGFucywgYmVjYXVzZVxuICAgICAgICAvLyByYXcgdGV4dE5vZGVzIGNhbid0IGJlIHBlcnNpc3RlZCB0aHJvdWdoIGNsb25lc1xuICAgICAgICAvLyBieSBhdHRhY2hpbmcgYXR0cmlidXRlcy5cbiAgICAgICAgdmFyIHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgd3JhcHBlci50ZXh0Q29udGVudCA9IG5vZGUuZGF0YVxuICAgICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnX192dWVfX3dyYXAnLCAnJylcbiAgICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUodHJhbnNjbHVkZWRGbGFnQXR0ciwgJycpXG4gICAgICAgIGVsLnJlcGxhY2VDaGlsZCh3cmFwcGVyLCBub2RlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBmb3IgdGVtcGxhdGUgdGFncywgd2hhdCB3ZSB3YW50IGlzIGl0cyBjb250ZW50IGFzXG4gIC8vIGEgZG9jdW1lbnRGcmFnbWVudCAoZm9yIGJsb2NrIGluc3RhbmNlcylcbiAgaWYgKGVsLnRhZ05hbWUgPT09ICdURU1QTEFURScpIHtcbiAgICBlbCA9IHRlbXBsYXRlUGFyc2VyLnBhcnNlKGVsKVxuICB9XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMudGVtcGxhdGUpIHtcbiAgICBlbCA9IHRyYW5zY2x1ZGVUZW1wbGF0ZShlbCwgb3B0aW9ucylcbiAgfVxuICBpZiAoZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgXy5wcmVwZW5kKGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3Ytc3RhcnQnKSwgZWwpXG4gICAgZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1lbmQnKSlcbiAgfVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHRoZSB0ZW1wbGF0ZSBvcHRpb24uXG4gKiBJZiB0aGUgcmVwbGFjZSBvcHRpb24gaXMgdHJ1ZSB0aGlzIHdpbGwgc3dhcCB0aGUgJGVsLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcmV0dXJuIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZnVuY3Rpb24gdHJhbnNjbHVkZVRlbXBsYXRlIChlbCwgb3B0aW9ucykge1xuICB2YXIgdGVtcGxhdGUgPSBvcHRpb25zLnRlbXBsYXRlXG4gIHZhciBmcmFnID0gdGVtcGxhdGVQYXJzZXIucGFyc2UodGVtcGxhdGUsIHRydWUpXG4gIGlmICghZnJhZykge1xuICAgIF8ud2FybignSW52YWxpZCB0ZW1wbGF0ZSBvcHRpb246ICcgKyB0ZW1wbGF0ZSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgcmF3Q29udGVudCA9IG9wdGlvbnMuX2NvbnRlbnQgfHwgXy5leHRyYWN0Q29udGVudChlbClcbiAgICB2YXIgcmVwbGFjZXIgPSBmcmFnLmZpcnN0Q2hpbGRcbiAgICBpZiAob3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGZyYWcuY2hpbGROb2Rlcy5sZW5ndGggPiAxIHx8XG4gICAgICAgIHJlcGxhY2VyLm5vZGVUeXBlICE9PSAxIHx8XG4gICAgICAgIC8vIHdoZW4gcm9vdCBub2RlIGhhcyB2LXJlcGVhdCwgdGhlIGluc3RhbmNlIGVuZHMgdXBcbiAgICAgICAgLy8gaGF2aW5nIG11bHRpcGxlIHRvcC1sZXZlbCBub2RlcywgdGh1cyBiZWNvbWluZyBhXG4gICAgICAgIC8vIGJsb2NrIGluc3RhbmNlLiAoIzgzNSlcbiAgICAgICAgcmVwbGFjZXIuaGFzQXR0cmlidXRlKGNvbmZpZy5wcmVmaXggKyAncmVwZWF0JylcbiAgICAgICkge1xuICAgICAgICB0cmFuc2NsdWRlQ29udGVudChmcmFnLCByYXdDb250ZW50KVxuICAgICAgICByZXR1cm4gZnJhZ1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy5fcmVwbGFjZXJBdHRycyA9IGV4dHJhY3RBdHRycyhyZXBsYWNlcilcbiAgICAgICAgbWVyZ2VBdHRycyhlbCwgcmVwbGFjZXIpXG4gICAgICAgIHRyYW5zY2x1ZGVDb250ZW50KHJlcGxhY2VyLCByYXdDb250ZW50KVxuICAgICAgICByZXR1cm4gcmVwbGFjZXJcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZWwuYXBwZW5kQ2hpbGQoZnJhZylcbiAgICAgIHRyYW5zY2x1ZGVDb250ZW50KGVsLCByYXdDb250ZW50KVxuICAgICAgcmV0dXJuIGVsXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVzb2x2ZSA8Y29udGVudD4gaW5zZXJ0aW9uIHBvaW50cyBtaW1pY2tpbmcgdGhlIGJlaGF2aW9yXG4gKiBvZiB0aGUgU2hhZG93IERPTSBzcGVjOlxuICpcbiAqICAgaHR0cDovL3czYy5naXRodWIuaW8vd2ViY29tcG9uZW50cy9zcGVjL3NoYWRvdy8jaW5zZXJ0aW9uLXBvaW50c1xuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBlbFxuICogQHBhcmFtIHtFbGVtZW50fSByYXdcbiAqL1xuXG5mdW5jdGlvbiB0cmFuc2NsdWRlQ29udGVudCAoZWwsIHJhdykge1xuICB2YXIgb3V0bGV0cyA9IGdldE91dGxldHMoZWwpXG4gIHZhciBpID0gb3V0bGV0cy5sZW5ndGhcbiAgaWYgKCFpKSByZXR1cm5cbiAgdmFyIG91dGxldCwgc2VsZWN0LCBzZWxlY3RlZCwgaiwgbWFpblxuXG4gIGZ1bmN0aW9uIGlzRGlyZWN0Q2hpbGQgKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5wYXJlbnROb2RlID09PSByYXdcbiAgfVxuXG4gIC8vIGZpcnN0IHBhc3MsIGNvbGxlY3QgY29ycmVzcG9uZGluZyBjb250ZW50XG4gIC8vIGZvciBlYWNoIG91dGxldC5cbiAgd2hpbGUgKGktLSkge1xuICAgIG91dGxldCA9IG91dGxldHNbaV1cbiAgICBpZiAocmF3KSB7XG4gICAgICBzZWxlY3QgPSBvdXRsZXQuZ2V0QXR0cmlidXRlKCdzZWxlY3QnKVxuICAgICAgaWYgKHNlbGVjdCkgeyAgLy8gc2VsZWN0IGNvbnRlbnRcbiAgICAgICAgc2VsZWN0ZWQgPSByYXcucXVlcnlTZWxlY3RvckFsbChzZWxlY3QpXG4gICAgICAgIGlmIChzZWxlY3RlZC5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBhY2NvcmRpbmcgdG8gU2hhZG93IERPTSBzcGVjLCBgc2VsZWN0YCBjYW5cbiAgICAgICAgICAvLyBvbmx5IHNlbGVjdCBkaXJlY3QgY2hpbGRyZW4gb2YgdGhlIGhvc3Qgbm9kZS5cbiAgICAgICAgICAvLyBlbmZvcmNpbmcgdGhpcyBhbHNvIGZpeGVzICM3ODYuXG4gICAgICAgICAgc2VsZWN0ZWQgPSBbXS5maWx0ZXIuY2FsbChzZWxlY3RlZCwgaXNEaXJlY3RDaGlsZClcbiAgICAgICAgfVxuICAgICAgICBvdXRsZXQuY29udGVudCA9IHNlbGVjdGVkLmxlbmd0aFxuICAgICAgICAgID8gc2VsZWN0ZWRcbiAgICAgICAgICA6IF8udG9BcnJheShvdXRsZXQuY2hpbGROb2RlcylcbiAgICAgIH0gZWxzZSB7IC8vIGRlZmF1bHQgY29udGVudFxuICAgICAgICBtYWluID0gb3V0bGV0XG4gICAgICB9XG4gICAgfSBlbHNlIHsgLy8gZmFsbGJhY2sgY29udGVudFxuICAgICAgb3V0bGV0LmNvbnRlbnQgPSBfLnRvQXJyYXkob3V0bGV0LmNoaWxkTm9kZXMpXG4gICAgfVxuICB9XG4gIC8vIHNlY29uZCBwYXNzLCBhY3R1YWxseSBpbnNlcnQgdGhlIGNvbnRlbnRzXG4gIGZvciAoaSA9IDAsIGogPSBvdXRsZXRzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgIG91dGxldCA9IG91dGxldHNbaV1cbiAgICBpZiAob3V0bGV0ICE9PSBtYWluKSB7XG4gICAgICBpbnNlcnRDb250ZW50QXQob3V0bGV0LCBvdXRsZXQuY29udGVudClcbiAgICB9XG4gIH1cbiAgLy8gZmluYWxseSBpbnNlcnQgdGhlIG1haW4gY29udGVudFxuICBpZiAobWFpbikge1xuICAgIGluc2VydENvbnRlbnRBdChtYWluLCBfLnRvQXJyYXkocmF3LmNoaWxkTm9kZXMpKVxuICB9XG59XG5cbi8qKlxuICogR2V0IDxjb250ZW50PiBvdXRsZXRzIGZyb20gdGhlIGVsZW1lbnQvbGlzdFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxBcnJheX0gZWxcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbnZhciBjb25jYXQgPSBbXS5jb25jYXRcbmZ1bmN0aW9uIGdldE91dGxldHMgKGVsKSB7XG4gIHJldHVybiBfLmlzQXJyYXkoZWwpXG4gICAgPyBjb25jYXQuYXBwbHkoW10sIGVsLm1hcChnZXRPdXRsZXRzKSlcbiAgICA6IGVsLnF1ZXJ5U2VsZWN0b3JBbGxcbiAgICAgID8gXy50b0FycmF5KGVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2NvbnRlbnQnKSlcbiAgICAgIDogW11cbn1cblxuLyoqXG4gKiBJbnNlcnQgYW4gYXJyYXkgb2Ygbm9kZXMgYXQgb3V0bGV0LFxuICogdGhlbiByZW1vdmUgdGhlIG91dGxldC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IG91dGxldFxuICogQHBhcmFtIHtBcnJheX0gY29udGVudHNcbiAqL1xuXG5mdW5jdGlvbiBpbnNlcnRDb250ZW50QXQgKG91dGxldCwgY29udGVudHMpIHtcbiAgLy8gbm90IHVzaW5nIHV0aWwgRE9NIG1ldGhvZHMgaGVyZSBiZWNhdXNlXG4gIC8vIHBhcmVudE5vZGUgY2FuIGJlIGNhY2hlZFxuICB2YXIgcGFyZW50ID0gb3V0bGV0LnBhcmVudE5vZGVcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBjb250ZW50cy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKGNvbnRlbnRzW2ldLCBvdXRsZXQpXG4gIH1cbiAgcGFyZW50LnJlbW92ZUNoaWxkKG91dGxldClcbn1cblxuLyoqXG4gKiBIZWxwZXIgdG8gZXh0cmFjdCBhIGNvbXBvbmVudCBjb250YWluZXIncyBhdHRyaWJ1dGUgbmFtZXNcbiAqIGludG8gYSBtYXAuIFRoZSByZXN1bHRpbmcgbWFwIHdpbGwgYmUgdXNlZCBpbiBjb21waWxlciB0b1xuICogZGV0ZXJtaW5lIHdoZXRoZXIgYW4gYXR0cmlidXRlIGlzIHRyYW5zY2x1ZGVkLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqL1xuXG5mdW5jdGlvbiBleHRyYWN0QXR0cnMgKGVsKSB7XG4gIHZhciBhdHRycyA9IGVsLmF0dHJpYnV0ZXNcbiAgdmFyIHJlcyA9IHt9XG4gIHZhciBpID0gYXR0cnMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICByZXNbYXR0cnNbaV0ubmFtZV0gPSBhdHRyc1tpXS52YWx1ZVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBNZXJnZSB0aGUgYXR0cmlidXRlcyBvZiB0d28gZWxlbWVudHMsIGFuZCBtYWtlIHN1cmVcbiAqIHRoZSBjbGFzcyBuYW1lcyBhcmUgbWVyZ2VkIHByb3Blcmx5LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZnJvbVxuICogQHBhcmFtIHtFbGVtZW50fSB0b1xuICovXG5cbmZ1bmN0aW9uIG1lcmdlQXR0cnMgKGZyb20sIHRvKSB7XG4gIHZhciBhdHRycyA9IGZyb20uYXR0cmlidXRlc1xuICB2YXIgaSA9IGF0dHJzLmxlbmd0aFxuICB2YXIgbmFtZSwgdmFsdWVcbiAgd2hpbGUgKGktLSkge1xuICAgIG5hbWUgPSBhdHRyc1tpXS5uYW1lXG4gICAgdmFsdWUgPSBhdHRyc1tpXS52YWx1ZVxuICAgIGlmICghdG8uaGFzQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICB0by5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpXG4gICAgfSBlbHNlIGlmIChuYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICB0by5jbGFzc05hbWUgPSB0by5jbGFzc05hbWUgKyAnICcgKyB2YWx1ZVxuICAgIH1cbiAgfVxufSIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIC8qKlxuICAgKiBUaGUgcHJlZml4IHRvIGxvb2sgZm9yIHdoZW4gcGFyc2luZyBkaXJlY3RpdmVzLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cblxuICBwcmVmaXg6ICd2LScsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcHJpbnQgZGVidWcgbWVzc2FnZXMuXG4gICAqIEFsc28gZW5hYmxlcyBzdGFjayB0cmFjZSBmb3Igd2FybmluZ3MuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBkZWJ1ZzogZmFsc2UsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gc3VwcHJlc3Mgd2FybmluZ3MuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBzaWxlbnQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGFsbG93IG9ic2VydmVyIHRvIGFsdGVyIGRhdGEgb2JqZWN0cydcbiAgICogX19wcm90b19fLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgcHJvdG86IHRydWUsXG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcGFyc2UgbXVzdGFjaGUgdGFncyBpbiB0ZW1wbGF0ZXMuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cblxuICBpbnRlcnBvbGF0ZTogdHJ1ZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byB1c2UgYXN5bmMgcmVuZGVyaW5nLlxuICAgKi9cblxuICBhc3luYzogdHJ1ZSxcblxuICAvKipcbiAgICogV2hldGhlciB0byB3YXJuIGFnYWluc3QgZXJyb3JzIGNhdWdodCB3aGVuIGV2YWx1YXRpbmdcbiAgICogZXhwcmVzc2lvbnMuXG4gICAqL1xuXG4gIHdhcm5FeHByZXNzaW9uRXJyb3JzOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBmbGFnIHRvIGluZGljYXRlIHRoZSBkZWxpbWl0ZXJzIGhhdmUgYmVlblxuICAgKiBjaGFuZ2VkLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG5cbiAgX2RlbGltaXRlcnNDaGFuZ2VkOiB0cnVlXG5cbn1cblxuLyoqXG4gKiBJbnRlcnBvbGF0aW9uIGRlbGltaXRlcnMuXG4gKiBXZSBuZWVkIHRvIG1hcmsgdGhlIGNoYW5nZWQgZmxhZyBzbyB0aGF0IHRoZSB0ZXh0IHBhcnNlclxuICoga25vd3MgaXQgbmVlZHMgdG8gcmVjb21waWxlIHRoZSByZWdleC5cbiAqXG4gKiBAdHlwZSB7QXJyYXk8U3RyaW5nPn1cbiAqL1xuXG52YXIgZGVsaW1pdGVycyA9IFsne3snLCAnfX0nXVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZS5leHBvcnRzLCAnZGVsaW1pdGVycycsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGRlbGltaXRlcnNcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgZGVsaW1pdGVycyA9IHZhbFxuICAgIHRoaXMuX2RlbGltaXRlcnNDaGFuZ2VkID0gdHJ1ZVxuICB9XG59KSIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG52YXIgV2F0Y2hlciA9IHJlcXVpcmUoJy4vd2F0Y2hlcicpXG52YXIgdGV4dFBhcnNlciA9IHJlcXVpcmUoJy4vcGFyc2Vycy90ZXh0JylcbnZhciBleHBQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcnMvZXhwcmVzc2lvbicpXG5cbi8qKlxuICogQSBkaXJlY3RpdmUgbGlua3MgYSBET00gZWxlbWVudCB3aXRoIGEgcGllY2Ugb2YgZGF0YSxcbiAqIHdoaWNoIGlzIHRoZSByZXN1bHQgb2YgZXZhbHVhdGluZyBhbiBleHByZXNzaW9uLlxuICogSXQgcmVnaXN0ZXJzIGEgd2F0Y2hlciB3aXRoIHRoZSBleHByZXNzaW9uIGFuZCBjYWxsc1xuICogdGhlIERPTSB1cGRhdGUgZnVuY3Rpb24gd2hlbiBhIGNoYW5nZSBpcyB0cmlnZ2VyZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7Tm9kZX0gZWxcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtPYmplY3R9IGRlc2NyaXB0b3JcbiAqICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IGV4cHJlc3Npb25cbiAqICAgICAgICAgICAgICAgICAtIHtTdHJpbmd9IFthcmddXG4gKiAgICAgICAgICAgICAgICAgLSB7QXJyYXk8T2JqZWN0Pn0gW2ZpbHRlcnNdXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmIC0gZGlyZWN0aXZlIGRlZmluaXRpb24gb2JqZWN0XG4gKiBAcGFyYW0ge1Z1ZXx1bmRlZmluZWR9IGhvc3QgLSB0cmFuc2NsdXNpb24gaG9zdCB0YXJnZXRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIERpcmVjdGl2ZSAobmFtZSwgZWwsIHZtLCBkZXNjcmlwdG9yLCBkZWYsIGhvc3QpIHtcbiAgLy8gcHVibGljXG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5lbCA9IGVsXG4gIHRoaXMudm0gPSB2bVxuICAvLyBjb3B5IGRlc2NyaXB0b3IgcHJvcHNcbiAgdGhpcy5yYXcgPSBkZXNjcmlwdG9yLnJhd1xuICB0aGlzLmV4cHJlc3Npb24gPSBkZXNjcmlwdG9yLmV4cHJlc3Npb25cbiAgdGhpcy5hcmcgPSBkZXNjcmlwdG9yLmFyZ1xuICB0aGlzLmZpbHRlcnMgPSBfLnJlc29sdmVGaWx0ZXJzKHZtLCBkZXNjcmlwdG9yLmZpbHRlcnMpXG4gIC8vIHByaXZhdGVcbiAgdGhpcy5fZGVzY3JpcHRvciA9IGRlc2NyaXB0b3JcbiAgdGhpcy5faG9zdCA9IGhvc3RcbiAgdGhpcy5fbG9ja2VkID0gZmFsc2VcbiAgdGhpcy5fYm91bmQgPSBmYWxzZVxuICAvLyBpbml0XG4gIHRoaXMuX2JpbmQoZGVmKVxufVxuXG52YXIgcCA9IERpcmVjdGl2ZS5wcm90b3R5cGVcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBkaXJlY3RpdmUsIG1peGluIGRlZmluaXRpb24gcHJvcGVydGllcyxcbiAqIHNldHVwIHRoZSB3YXRjaGVyLCBjYWxsIGRlZmluaXRpb24gYmluZCgpIGFuZCB1cGRhdGUoKVxuICogaWYgcHJlc2VudC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmXG4gKi9cblxucC5fYmluZCA9IGZ1bmN0aW9uIChkZWYpIHtcbiAgaWYgKHRoaXMubmFtZSAhPT0gJ2Nsb2FrJyAmJiB0aGlzLmVsICYmIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKSB7XG4gICAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoY29uZmlnLnByZWZpeCArIHRoaXMubmFtZSlcbiAgfVxuICBpZiAodHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMudXBkYXRlID0gZGVmXG4gIH0gZWxzZSB7XG4gICAgXy5leHRlbmQodGhpcywgZGVmKVxuICB9XG4gIHRoaXMuX3dhdGNoZXJFeHAgPSB0aGlzLmV4cHJlc3Npb25cbiAgdGhpcy5fY2hlY2tEeW5hbWljTGl0ZXJhbCgpXG4gIGlmICh0aGlzLmJpbmQpIHtcbiAgICB0aGlzLmJpbmQoKVxuICB9XG4gIGlmICh0aGlzLl93YXRjaGVyRXhwICYmXG4gICAgICAodGhpcy51cGRhdGUgfHwgdGhpcy50d29XYXkpICYmXG4gICAgICAoIXRoaXMuaXNMaXRlcmFsIHx8IHRoaXMuX2lzRHluYW1pY0xpdGVyYWwpICYmXG4gICAgICAhdGhpcy5fY2hlY2tTdGF0ZW1lbnQoKSkge1xuICAgIC8vIHdyYXBwZWQgdXBkYXRlciBmb3IgY29udGV4dFxuICAgIHZhciBkaXIgPSB0aGlzXG4gICAgdmFyIHVwZGF0ZSA9IHRoaXMuX3VwZGF0ZSA9IHRoaXMudXBkYXRlXG4gICAgICA/IGZ1bmN0aW9uICh2YWwsIG9sZFZhbCkge1xuICAgICAgICAgIGlmICghZGlyLl9sb2NrZWQpIHtcbiAgICAgICAgICAgIGRpci51cGRhdGUodmFsLCBvbGRWYWwpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uICgpIHt9IC8vIG5vb3AgaWYgbm8gdXBkYXRlIGlzIHByb3ZpZGVkXG4gICAgLy8gdXNlIHJhdyBleHByZXNzaW9uIGFzIGlkZW50aWZpZXIgYmVjYXVzZSBmaWx0ZXJzXG4gICAgLy8gbWFrZSB0aGVtIGRpZmZlcmVudCB3YXRjaGVyc1xuICAgIHZhciB3YXRjaGVyID0gdGhpcy52bS5fd2F0Y2hlcnNbdGhpcy5yYXddXG4gICAgLy8gdi1yZXBlYXQgYWx3YXlzIGNyZWF0ZXMgYSBuZXcgd2F0Y2hlciBiZWNhdXNlIGl0IGhhc1xuICAgIC8vIGEgc3BlY2lhbCBmaWx0ZXIgdGhhdCdzIGJvdW5kIHRvIGl0cyBkaXJlY3RpdmVcbiAgICAvLyBpbnN0YW5jZS5cbiAgICBpZiAoIXdhdGNoZXIgfHwgdGhpcy5uYW1lID09PSAncmVwZWF0Jykge1xuICAgICAgd2F0Y2hlciA9IHRoaXMudm0uX3dhdGNoZXJzW3RoaXMucmF3XSA9IG5ldyBXYXRjaGVyKFxuICAgICAgICB0aGlzLnZtLFxuICAgICAgICB0aGlzLl93YXRjaGVyRXhwLFxuICAgICAgICB1cGRhdGUsIC8vIGNhbGxiYWNrXG4gICAgICAgIHtcbiAgICAgICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlcnMsXG4gICAgICAgICAgdHdvV2F5OiB0aGlzLnR3b1dheSxcbiAgICAgICAgICBkZWVwOiB0aGlzLmRlZXBcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB3YXRjaGVyLmFkZENiKHVwZGF0ZSlcbiAgICB9XG4gICAgdGhpcy5fd2F0Y2hlciA9IHdhdGNoZXJcbiAgICBpZiAodGhpcy5faW5pdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHdhdGNoZXIuc2V0KHRoaXMuX2luaXRWYWx1ZSlcbiAgICB9IGVsc2UgaWYgKHRoaXMudXBkYXRlKSB7XG4gICAgICB0aGlzLnVwZGF0ZSh3YXRjaGVyLnZhbHVlKVxuICAgIH1cbiAgfVxuICB0aGlzLl9ib3VuZCA9IHRydWVcbn1cblxuLyoqXG4gKiBjaGVjayBpZiB0aGlzIGlzIGEgZHluYW1pYyBsaXRlcmFsIGJpbmRpbmcuXG4gKlxuICogZS5nLiB2LWNvbXBvbmVudD1cInt7Y3VycmVudFZpZXd9fVwiXG4gKi9cblxucC5fY2hlY2tEeW5hbWljTGl0ZXJhbCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGV4cHJlc3Npb24gPSB0aGlzLmV4cHJlc3Npb25cbiAgaWYgKGV4cHJlc3Npb24gJiYgdGhpcy5pc0xpdGVyYWwpIHtcbiAgICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZShleHByZXNzaW9uKVxuICAgIGlmICh0b2tlbnMpIHtcbiAgICAgIHZhciBleHAgPSB0ZXh0UGFyc2VyLnRva2Vuc1RvRXhwKHRva2VucylcbiAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IHRoaXMudm0uJGdldChleHApXG4gICAgICB0aGlzLl93YXRjaGVyRXhwID0gZXhwXG4gICAgICB0aGlzLl9pc0R5bmFtaWNMaXRlcmFsID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBkaXJlY3RpdmUgaXMgYSBmdW5jdGlvbiBjYWxsZXJcbiAqIGFuZCBpZiB0aGUgZXhwcmVzc2lvbiBpcyBhIGNhbGxhYmxlIG9uZS4gSWYgYm90aCB0cnVlLFxuICogd2Ugd3JhcCB1cCB0aGUgZXhwcmVzc2lvbiBhbmQgdXNlIGl0IGFzIHRoZSBldmVudFxuICogaGFuZGxlci5cbiAqXG4gKiBlLmcuIHYtb249XCJjbGljazogYSsrXCJcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnAuX2NoZWNrU3RhdGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcmVzc2lvblxuICBpZiAoXG4gICAgZXhwcmVzc2lvbiAmJiB0aGlzLmFjY2VwdFN0YXRlbWVudCAmJlxuICAgICFleHBQYXJzZXIuaXNTaW1wbGVQYXRoKGV4cHJlc3Npb24pXG4gICkge1xuICAgIHZhciBmbiA9IGV4cFBhcnNlci5wYXJzZShleHByZXNzaW9uKS5nZXRcbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBmbi5jYWxsKHZtLCB2bSlcbiAgICB9XG4gICAgaWYgKHRoaXMuZmlsdGVycykge1xuICAgICAgaGFuZGxlciA9IF8uYXBwbHlGaWx0ZXJzKFxuICAgICAgICBoYW5kbGVyLFxuICAgICAgICB0aGlzLmZpbHRlcnMucmVhZCxcbiAgICAgICAgdm1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy51cGRhdGUoaGFuZGxlcilcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgZm9yIGFuIGF0dHJpYnV0ZSBkaXJlY3RpdmUgcGFyYW0sIGUuZy4gbGF6eVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxucC5fY2hlY2tQYXJhbSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBwYXJhbSA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKG5hbWUpXG4gIGlmIChwYXJhbSAhPT0gbnVsbCkge1xuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG4gIH1cbiAgcmV0dXJuIHBhcmFtXG59XG5cbi8qKlxuICogVGVhcmRvd24gdGhlIHdhdGNoZXIgYW5kIGNhbGwgdW5iaW5kLlxuICovXG5cbnAuX3RlYXJkb3duID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fYm91bmQpIHtcbiAgICBpZiAodGhpcy51bmJpbmQpIHtcbiAgICAgIHRoaXMudW5iaW5kKClcbiAgICB9XG4gICAgdmFyIHdhdGNoZXIgPSB0aGlzLl93YXRjaGVyXG4gICAgaWYgKHdhdGNoZXIgJiYgd2F0Y2hlci5hY3RpdmUpIHtcbiAgICAgIHdhdGNoZXIucmVtb3ZlQ2IodGhpcy5fdXBkYXRlKVxuICAgICAgaWYgKCF3YXRjaGVyLmFjdGl2ZSkge1xuICAgICAgICB0aGlzLnZtLl93YXRjaGVyc1t0aGlzLnJhd10gPSBudWxsXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2JvdW5kID0gZmFsc2VcbiAgICB0aGlzLnZtID0gdGhpcy5lbCA9IHRoaXMuX3dhdGNoZXIgPSBudWxsXG4gIH1cbn1cblxuLyoqXG4gKiBTZXQgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgd2l0aCB0aGUgc2V0dGVyLlxuICogVGhpcyBzaG91bGQgb25seSBiZSB1c2VkIGluIHR3by13YXkgZGlyZWN0aXZlc1xuICogZS5nLiB2LW1vZGVsLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwdWJsaWNcbiAqL1xuXG5wLnNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAodGhpcy50d29XYXkpIHtcbiAgICB0aGlzLl93aXRoTG9jayhmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl93YXRjaGVyLnNldCh2YWx1ZSlcbiAgICB9KVxuICB9XG59XG5cbi8qKlxuICogRXhlY3V0ZSBhIGZ1bmN0aW9uIHdoaWxlIHByZXZlbnRpbmcgdGhhdCBmdW5jdGlvbiBmcm9tXG4gKiB0cmlnZ2VyaW5nIHVwZGF0ZXMgb24gdGhpcyBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuXG5wLl93aXRoTG9jayA9IGZ1bmN0aW9uIChmbikge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgc2VsZi5fbG9ja2VkID0gdHJ1ZVxuICBmbi5jYWxsKHNlbGYpXG4gIF8ubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuX2xvY2tlZCA9IGZhbHNlXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGlyZWN0aXZlIiwiLy8geGxpbmtcbnZhciB4bGlua05TID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnXG52YXIgeGxpbmtSRSA9IC9eeGxpbms6L1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBwcmlvcml0eTogODUwLFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmFtZSA9IHRoaXMuYXJnXG4gICAgdGhpcy51cGRhdGUgPSB4bGlua1JFLnRlc3QobmFtZSlcbiAgICAgID8geGxpbmtIYW5kbGVyXG4gICAgICA6IGRlZmF1bHRIYW5kbGVyXG4gIH1cblxufVxuXG5mdW5jdGlvbiBkZWZhdWx0SGFuZGxlciAodmFsdWUpIHtcbiAgaWYgKHZhbHVlIHx8IHZhbHVlID09PSAwKSB7XG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUodGhpcy5hcmcsIHZhbHVlKVxuICB9IGVsc2Uge1xuICAgIHRoaXMuZWwucmVtb3ZlQXR0cmlidXRlKHRoaXMuYXJnKVxuICB9XG59XG5cbmZ1bmN0aW9uIHhsaW5rSGFuZGxlciAodmFsdWUpIHtcbiAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZU5TKHhsaW5rTlMsIHRoaXMuYXJnLCB2YWx1ZSlcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZU5TKHhsaW5rTlMsICdocmVmJylcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgYWRkQ2xhc3MgPSBfLmFkZENsYXNzXG52YXIgcmVtb3ZlQ2xhc3MgPSBfLnJlbW92ZUNsYXNzXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICh0aGlzLmFyZykge1xuICAgIHZhciBtZXRob2QgPSB2YWx1ZSA/IGFkZENsYXNzIDogcmVtb3ZlQ2xhc3NcbiAgICBtZXRob2QodGhpcy5lbCwgdGhpcy5hcmcpXG4gIH0gZWxzZSB7XG4gICAgaWYgKHRoaXMubGFzdFZhbCkge1xuICAgICAgcmVtb3ZlQ2xhc3ModGhpcy5lbCwgdGhpcy5sYXN0VmFsKVxuICAgIH1cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGFkZENsYXNzKHRoaXMuZWwsIHZhbHVlKVxuICAgICAgdGhpcy5sYXN0VmFsID0gdmFsdWVcbiAgICB9XG4gIH1cbn0iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB0aGlzLnZtLiRvbmNlKCdob29rOmNvbXBpbGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGNvbmZpZy5wcmVmaXggKyAnY2xvYWsnKVxuICAgIH0pXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgaXNMaXRlcmFsOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBTZXR1cC4gVHdvIHBvc3NpYmxlIHVzYWdlczpcbiAgICpcbiAgICogLSBzdGF0aWM6XG4gICAqICAgdi1jb21wb25lbnQ9XCJjb21wXCJcbiAgICpcbiAgICogLSBkeW5hbWljOlxuICAgKiAgIHYtY29tcG9uZW50PVwie3tjdXJyZW50Vmlld319XCJcbiAgICovXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5lbC5fX3Z1ZV9fKSB7XG4gICAgICAvLyBjcmVhdGUgYSByZWYgYW5jaG9yXG4gICAgICB0aGlzLnJlZiA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtY29tcG9uZW50JylcbiAgICAgIF8ucmVwbGFjZSh0aGlzLmVsLCB0aGlzLnJlZilcbiAgICAgIC8vIGNoZWNrIGtlZXAtYWxpdmUgb3B0aW9ucy5cbiAgICAgIC8vIElmIHllcywgaW5zdGVhZCBvZiBkZXN0cm95aW5nIHRoZSBhY3RpdmUgdm0gd2hlblxuICAgICAgLy8gaGlkaW5nICh2LWlmKSBvciBzd2l0Y2hpbmcgKGR5bmFtaWMgbGl0ZXJhbCkgaXQsXG4gICAgICAvLyB3ZSBzaW1wbHkgcmVtb3ZlIGl0IGZyb20gdGhlIERPTSBhbmQgc2F2ZSBpdCBpbiBhXG4gICAgICAvLyBjYWNoZSBvYmplY3QsIHdpdGggaXRzIGNvbnN0cnVjdG9yIGlkIGFzIHRoZSBrZXkuXG4gICAgICB0aGlzLmtlZXBBbGl2ZSA9IHRoaXMuX2NoZWNrUGFyYW0oJ2tlZXAtYWxpdmUnKSAhPSBudWxsXG4gICAgICAvLyBjaGVjayByZWZcbiAgICAgIHRoaXMucmVmSUQgPSBfLmF0dHIodGhpcy5lbCwgJ3JlZicpXG4gICAgICBpZiAodGhpcy5rZWVwQWxpdmUpIHtcbiAgICAgICAgdGhpcy5jYWNoZSA9IHt9XG4gICAgICB9XG4gICAgICAvLyBjaGVjayBpbmxpbmUtdGVtcGxhdGVcbiAgICAgIGlmICh0aGlzLl9jaGVja1BhcmFtKCdpbmxpbmUtdGVtcGxhdGUnKSAhPT0gbnVsbCkge1xuICAgICAgICAvLyBleHRyYWN0IGlubGluZSB0ZW1wbGF0ZSBhcyBhIERvY3VtZW50RnJhZ21lbnRcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IF8uZXh0cmFjdENvbnRlbnQodGhpcy5lbCwgdHJ1ZSlcbiAgICAgIH1cbiAgICAgIC8vIGNvbXBvbmVudCByZXNvbHV0aW9uIHJlbGF0ZWQgc3RhdGVcbiAgICAgIHRoaXMuX3BlbmRpbmdDYiA9XG4gICAgICB0aGlzLmN0b3JJZCA9XG4gICAgICB0aGlzLkN0b3IgPSBudWxsXG4gICAgICAvLyBpZiBzdGF0aWMsIGJ1aWxkIHJpZ2h0IG5vdy5cbiAgICAgIGlmICghdGhpcy5faXNEeW5hbWljTGl0ZXJhbCkge1xuICAgICAgICB0aGlzLnJlc29sdmVDdG9yKHRoaXMuZXhwcmVzc2lvbiwgXy5iaW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLmJ1aWxkKClcbiAgICAgICAgICBjaGlsZC4kYmVmb3JlKHRoaXMucmVmKVxuICAgICAgICAgIHRoaXMuc2V0Q3VycmVudChjaGlsZClcbiAgICAgICAgfSwgdGhpcykpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBjaGVjayBkeW5hbWljIGNvbXBvbmVudCBwYXJhbXNcbiAgICAgICAgdGhpcy5yZWFkeUV2ZW50ID0gdGhpcy5fY2hlY2tQYXJhbSgnd2FpdC1mb3InKVxuICAgICAgICB0aGlzLnRyYW5zTW9kZSA9IHRoaXMuX2NoZWNrUGFyYW0oJ3RyYW5zaXRpb24tbW9kZScpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3YtY29tcG9uZW50PVwiJyArIHRoaXMuZXhwcmVzc2lvbiArICdcIiBjYW5ub3QgYmUgJyArXG4gICAgICAgICd1c2VkIG9uIGFuIGFscmVhZHkgbW91bnRlZCBpbnN0YW5jZS4nXG4gICAgICApXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBQdWJsaWMgdXBkYXRlLCBjYWxsZWQgYnkgdGhlIHdhdGNoZXIgaW4gdGhlIGR5bmFtaWNcbiAgICogbGl0ZXJhbCBzY2VuYXJpbywgZS5nLiB2LWNvbXBvbmVudD1cInt7dmlld319XCJcbiAgICovXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLnJlYWxVcGRhdGUodmFsdWUpXG4gIH0sXG5cbiAgLyoqXG4gICAqIFN3aXRjaCBkeW5hbWljIGNvbXBvbmVudHMuIE1heSByZXNvbHZlIHRoZSBjb21wb25lbnRcbiAgICogYXN5bmNocm9ub3VzbHksIGFuZCBwZXJmb3JtIHRyYW5zaXRpb24gYmFzZWQgb25cbiAgICogc3BlY2lmaWVkIHRyYW5zaXRpb24gbW9kZS4gQWNjZXB0cyBhbiBhc3luYyBjYWxsYmFja1xuICAgKiB3aGljaCBpcyBjYWxsZWQgd2hlbiB0aGUgdHJhbnNpdGlvbiBlbmRzLiAoVGhpcyBpc1xuICAgKiBleHBvc2VkIGZvciB2dWUtcm91dGVyKVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICAgKi9cblxuICByZWFsVXBkYXRlOiBmdW5jdGlvbiAodmFsdWUsIGNiKSB7XG4gICAgdGhpcy5pbnZhbGlkYXRlUGVuZGluZygpXG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgLy8ganVzdCByZW1vdmUgY3VycmVudFxuICAgICAgdGhpcy51bmJ1aWxkKClcbiAgICAgIHRoaXMucmVtb3ZlKHRoaXMuY2hpbGRWTSwgY2IpXG4gICAgICB0aGlzLnVuc2V0Q3VycmVudCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzb2x2ZUN0b3IodmFsdWUsIF8uYmluZChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudW5idWlsZCgpXG4gICAgICAgIHZhciBuZXdDb21wb25lbnQgPSB0aGlzLmJ1aWxkKClcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAgIGlmICh0aGlzLnJlYWR5RXZlbnQpIHtcbiAgICAgICAgICBuZXdDb21wb25lbnQuJG9uY2UodGhpcy5yZWFkeUV2ZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLnN3YXBUbyhuZXdDb21wb25lbnQsIGNiKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zd2FwVG8obmV3Q29tcG9uZW50LCBjYilcbiAgICAgICAgfVxuICAgICAgfSwgdGhpcykpXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZXNvbHZlIHRoZSBjb21wb25lbnQgY29uc3RydWN0b3IgdG8gdXNlIHdoZW4gY3JlYXRpbmdcbiAgICogdGhlIGNoaWxkIHZtLlxuICAgKi9cblxuICByZXNvbHZlQ3RvcjogZnVuY3Rpb24gKGlkLCBjYikge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBwZW5kaW5nQ2IgPSB0aGlzLl9wZW5kaW5nQ2IgPSBmdW5jdGlvbiAoY3Rvcikge1xuICAgICAgaWYgKCFwZW5kaW5nQ2IuaW52YWxpZGF0ZWQpIHtcbiAgICAgICAgc2VsZi5jdG9ySWQgPSBpZFxuICAgICAgICBzZWxmLkN0b3IgPSBjdG9yXG4gICAgICAgIGNiKClcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy52bS5fcmVzb2x2ZUNvbXBvbmVudChpZCwgcGVuZGluZ0NiKVxuICB9LFxuXG4gIC8qKlxuICAgKiBXaGVuIHRoZSBjb21wb25lbnQgY2hhbmdlcyBvciB1bmJpbmRzIGJlZm9yZSBhbiBhc3luY1xuICAgKiBjb25zdHJ1Y3RvciBpcyByZXNvbHZlZCwgd2UgbmVlZCB0byBpbnZhbGlkYXRlIGl0c1xuICAgKiBwZW5kaW5nIGNhbGxiYWNrLlxuICAgKi9cblxuICBpbnZhbGlkYXRlUGVuZGluZzogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9wZW5kaW5nQ2IpIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdDYi5pbnZhbGlkYXRlZCA9IHRydWVcbiAgICAgIHRoaXMuX3BlbmRpbmdDYiA9IG51bGxcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluc3RhbnRpYXRlL2luc2VydCBhIG5ldyBjaGlsZCB2bS5cbiAgICogSWYga2VlcCBhbGl2ZSBhbmQgaGFzIGNhY2hlZCBpbnN0YW5jZSwgaW5zZXJ0IHRoYXRcbiAgICogaW5zdGFuY2U7IG90aGVyd2lzZSBidWlsZCBhIG5ldyBvbmUgYW5kIGNhY2hlIGl0LlxuICAgKlxuICAgKiBAcmV0dXJuIHtWdWV9IC0gdGhlIGNyZWF0ZWQgaW5zdGFuY2VcbiAgICovXG5cbiAgYnVpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5rZWVwQWxpdmUpIHtcbiAgICAgIHZhciBjYWNoZWQgPSB0aGlzLmNhY2hlW3RoaXMuY3RvcklkXVxuICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICByZXR1cm4gY2FjaGVkXG4gICAgICB9XG4gICAgfVxuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICB2YXIgZWwgPSB0ZW1wbGF0ZVBhcnNlci5jbG9uZSh0aGlzLmVsKVxuICAgIGlmICh0aGlzLkN0b3IpIHtcbiAgICAgIHZhciBjaGlsZCA9IHZtLiRhZGRDaGlsZCh7XG4gICAgICAgIGVsOiBlbCxcbiAgICAgICAgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUsXG4gICAgICAgIF9hc0NvbXBvbmVudDogdHJ1ZSxcbiAgICAgICAgX2hvc3Q6IHRoaXMuX2hvc3RcbiAgICAgIH0sIHRoaXMuQ3RvcilcbiAgICAgIGlmICh0aGlzLmtlZXBBbGl2ZSkge1xuICAgICAgICB0aGlzLmNhY2hlW3RoaXMuY3RvcklkXSA9IGNoaWxkXG4gICAgICB9XG4gICAgICByZXR1cm4gY2hpbGRcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRlYXJkb3duIHRoZSBjdXJyZW50IGNoaWxkLCBidXQgZGVmZXJzIGNsZWFudXAgc29cbiAgICogdGhhdCB3ZSBjYW4gc2VwYXJhdGUgdGhlIGRlc3Ryb3kgYW5kIHJlbW92YWwgc3RlcHMuXG4gICAqL1xuXG4gIHVuYnVpbGQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkVk1cbiAgICBpZiAoIWNoaWxkIHx8IHRoaXMua2VlcEFsaXZlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gdGhlIHNvbGUgcHVycG9zZSBvZiBgZGVmZXJDbGVhbnVwYCBpcyBzbyB0aGF0IHdlIGNhblxuICAgIC8vIFwiZGVhY3RpdmF0ZVwiIHRoZSB2bSByaWdodCBub3cgYW5kIHBlcmZvcm0gRE9NIHJlbW92YWxcbiAgICAvLyBsYXRlci5cbiAgICBjaGlsZC4kZGVzdHJveShmYWxzZSwgdHJ1ZSlcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGN1cnJlbnQgZGVzdHJveWVkIGNoaWxkIGFuZCBtYW51YWxseSBkb1xuICAgKiB0aGUgY2xlYW51cCBhZnRlciByZW1vdmFsLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICAgKi9cblxuICByZW1vdmU6IGZ1bmN0aW9uIChjaGlsZCwgY2IpIHtcbiAgICB2YXIga2VlcEFsaXZlID0gdGhpcy5rZWVwQWxpdmVcbiAgICBpZiAoY2hpbGQpIHtcbiAgICAgIGNoaWxkLiRyZW1vdmUoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWtlZXBBbGl2ZSkgY2hpbGQuX2NsZWFudXAoKVxuICAgICAgICBpZiAoY2IpIGNiKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChjYikge1xuICAgICAgY2IoKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQWN0dWFsbHkgc3dhcCB0aGUgY29tcG9uZW50cywgZGVwZW5kaW5nIG9uIHRoZVxuICAgKiB0cmFuc2l0aW9uIG1vZGUuIERlZmF1bHRzIHRvIHNpbXVsdGFuZW91cy5cbiAgICpcbiAgICogQHBhcmFtIHtWdWV9IHRhcmdldFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gICAqL1xuXG4gIHN3YXBUbzogZnVuY3Rpb24gKHRhcmdldCwgY2IpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgY3VycmVudCA9IHRoaXMuY2hpbGRWTVxuICAgIHRoaXMudW5zZXRDdXJyZW50KClcbiAgICB0aGlzLnNldEN1cnJlbnQodGFyZ2V0KVxuICAgIHN3aXRjaCAoc2VsZi50cmFuc01vZGUpIHtcbiAgICAgIGNhc2UgJ2luLW91dCc6XG4gICAgICAgIHRhcmdldC4kYmVmb3JlKHNlbGYucmVmLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5yZW1vdmUoY3VycmVudCwgY2IpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdvdXQtaW4nOlxuICAgICAgICBzZWxmLnJlbW92ZShjdXJyZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5yZWYsIGNiKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgc2VsZi5yZW1vdmUoY3VycmVudClcbiAgICAgICAgdGFyZ2V0LiRiZWZvcmUoc2VsZi5yZWYsIGNiKVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU2V0IGNoaWxkVk0gYW5kIHBhcmVudCByZWZcbiAgICovXG4gIFxuICBzZXRDdXJyZW50OiBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICB0aGlzLmNoaWxkVk0gPSBjaGlsZFxuICAgIHZhciByZWZJRCA9IGNoaWxkLl9yZWZJRCB8fCB0aGlzLnJlZklEXG4gICAgaWYgKHJlZklEKSB7XG4gICAgICB0aGlzLnZtLiRbcmVmSURdID0gY2hpbGRcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFVuc2V0IGNoaWxkVk0gYW5kIHBhcmVudCByZWZcbiAgICovXG5cbiAgdW5zZXRDdXJyZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZFZNXG4gICAgdGhpcy5jaGlsZFZNID0gbnVsbFxuICAgIHZhciByZWZJRCA9IChjaGlsZCAmJiBjaGlsZC5fcmVmSUQpIHx8IHRoaXMucmVmSURcbiAgICBpZiAocmVmSUQpIHtcbiAgICAgIHRoaXMudm0uJFtyZWZJRF0gPSBudWxsXG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBVbmJpbmQuXG4gICAqL1xuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaW52YWxpZGF0ZVBlbmRpbmcoKVxuICAgIHRoaXMudW5idWlsZCgpXG4gICAgLy8gZGVzdHJveSBhbGwga2VlcC1hbGl2ZSBjYWNoZWQgaW5zdGFuY2VzXG4gICAgaWYgKHRoaXMuY2FjaGUpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmNhY2hlKSB7XG4gICAgICAgIHRoaXMuY2FjaGVba2V5XS4kZGVzdHJveSgpXG4gICAgICB9XG4gICAgICB0aGlzLmNhY2hlID0gbnVsbFxuICAgIH1cbiAgfVxuXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgaXNMaXRlcmFsOiB0cnVlLFxuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnZtLiQkW3RoaXMuZXhwcmVzc2lvbl0gPSB0aGlzLmVsXG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgZGVsZXRlIHRoaXMudm0uJCRbdGhpcy5leHByZXNzaW9uXVxuICB9XG4gIFxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGFjY2VwdFN0YXRlbWVudDogdHJ1ZSxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNoaWxkID0gdGhpcy5lbC5fX3Z1ZV9fXG4gICAgaWYgKCFjaGlsZCB8fCB0aGlzLnZtICE9PSBjaGlsZC4kcGFyZW50KSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdgdi1ldmVudHNgIHNob3VsZCBvbmx5IGJlIHVzZWQgb24gYSBjaGlsZCBjb21wb25lbnQgJyArXG4gICAgICAgICdmcm9tIHRoZSBwYXJlbnQgdGVtcGxhdGUuJ1xuICAgICAgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGhhbmRsZXIsIG9sZEhhbmRsZXIpIHtcbiAgICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ0RpcmVjdGl2ZSBcInYtZXZlbnRzOicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIgJyArXG4gICAgICAgICdleHBlY3RzIGEgZnVuY3Rpb24gdmFsdWUuJ1xuICAgICAgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHZhciBjaGlsZCA9IHRoaXMuZWwuX192dWVfX1xuICAgIGlmIChvbGRIYW5kbGVyKSB7XG4gICAgICBjaGlsZC4kb2ZmKHRoaXMuYXJnLCBvbGRIYW5kbGVyKVxuICAgIH1cbiAgICBjaGlsZC4kb24odGhpcy5hcmcsIGhhbmRsZXIpXG4gIH1cblxuICAvLyB3aGVuIGNoaWxkIGlzIGRlc3Ryb3llZCwgYWxsIGV2ZW50cyBhcmUgdHVybmVkIG9mZixcbiAgLy8gc28gbm8gbmVlZCBmb3IgdW5iaW5kIGhlcmUuXG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIHRlbXBsYXRlUGFyc2VyID0gcmVxdWlyZSgnLi4vcGFyc2Vycy90ZW1wbGF0ZScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBhIGNvbW1lbnQgbm9kZSBtZWFucyB0aGlzIGlzIGEgYmluZGluZyBmb3JcbiAgICAvLyB7e3sgaW5saW5lIHVuZXNjYXBlZCBodG1sIH19fVxuICAgIGlmICh0aGlzLmVsLm5vZGVUeXBlID09PSA4KSB7XG4gICAgICAvLyBob2xkIG5vZGVzXG4gICAgICB0aGlzLm5vZGVzID0gW11cbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YWx1ZSA9IF8udG9TdHJpbmcodmFsdWUpXG4gICAgaWYgKHRoaXMubm9kZXMpIHtcbiAgICAgIHRoaXMuc3dhcCh2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5pbm5lckhUTUwgPSB2YWx1ZVxuICAgIH1cbiAgfSxcblxuICBzd2FwOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAvLyByZW1vdmUgb2xkIG5vZGVzXG4gICAgdmFyIGkgPSB0aGlzLm5vZGVzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIF8ucmVtb3ZlKHRoaXMubm9kZXNbaV0pXG4gICAgfVxuICAgIC8vIGNvbnZlcnQgbmV3IHZhbHVlIHRvIGEgZnJhZ21lbnRcbiAgICAvLyBkbyBub3QgYXR0ZW1wdCB0byByZXRyaWV2ZSBmcm9tIGlkIHNlbGVjdG9yXG4gICAgdmFyIGZyYWcgPSB0ZW1wbGF0ZVBhcnNlci5wYXJzZSh2YWx1ZSwgdHJ1ZSwgdHJ1ZSlcbiAgICAvLyBzYXZlIGEgcmVmZXJlbmNlIHRvIHRoZXNlIG5vZGVzIHNvIHdlIGNhbiByZW1vdmUgbGF0ZXJcbiAgICB0aGlzLm5vZGVzID0gXy50b0FycmF5KGZyYWcuY2hpbGROb2RlcylcbiAgICBfLmJlZm9yZShmcmFnLCB0aGlzLmVsKVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGNvbXBpbGUgPSByZXF1aXJlKCcuLi9jb21waWxlci9jb21waWxlJylcbnZhciB0ZW1wbGF0ZVBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvdGVtcGxhdGUnKVxudmFyIHRyYW5zaXRpb24gPSByZXF1aXJlKCcuLi90cmFuc2l0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICBpZiAoIWVsLl9fdnVlX18pIHtcbiAgICAgIHRoaXMuc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCd2LWlmLXN0YXJ0JylcbiAgICAgIHRoaXMuZW5kID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgndi1pZi1lbmQnKVxuICAgICAgXy5yZXBsYWNlKGVsLCB0aGlzLmVuZClcbiAgICAgIF8uYmVmb3JlKHRoaXMuc3RhcnQsIHRoaXMuZW5kKVxuICAgICAgaWYgKGVsLnRhZ05hbWUgPT09ICdURU1QTEFURScpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlUGFyc2VyLnBhcnNlKGVsLCB0cnVlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICAgICAgICB0aGlzLnRlbXBsYXRlLmFwcGVuZENoaWxkKHRlbXBsYXRlUGFyc2VyLmNsb25lKGVsKSlcbiAgICAgIH1cbiAgICAgIC8vIGNvbXBpbGUgdGhlIG5lc3RlZCBwYXJ0aWFsXG4gICAgICB0aGlzLmxpbmtlciA9IGNvbXBpbGUoXG4gICAgICAgIHRoaXMudGVtcGxhdGUsXG4gICAgICAgIHRoaXMudm0uJG9wdGlvbnMsXG4gICAgICAgIHRydWVcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnZhbGlkID0gdHJ1ZVxuICAgICAgXy53YXJuKFxuICAgICAgICAndi1pZj1cIicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIgY2Fubm90IGJlICcgK1xuICAgICAgICAndXNlZCBvbiBhbiBhbHJlYWR5IG1vdW50ZWQgaW5zdGFuY2UuJ1xuICAgICAgKVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmludmFsaWQpIHJldHVyblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgLy8gYXZvaWQgZHVwbGljYXRlIGNvbXBpbGVzLCBzaW5jZSB1cGRhdGUoKSBjYW4gYmVcbiAgICAgIC8vIGNhbGxlZCB3aXRoIGRpZmZlcmVudCB0cnV0aHkgdmFsdWVzXG4gICAgICBpZiAoIXRoaXMudW5saW5rKSB7XG4gICAgICAgIHRoaXMuY29tcGlsZSgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGVhcmRvd24oKVxuICAgIH1cbiAgfSxcblxuICBjb21waWxlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZtID0gdGhpcy52bVxuICAgIHZhciBmcmFnID0gdGVtcGxhdGVQYXJzZXIuY2xvbmUodGhpcy50ZW1wbGF0ZSlcbiAgICAvLyB0aGUgbGlua2VyIGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlIHByZXNlbnQgYmVjYXVzZVxuICAgIC8vIHRoaXMgZnVuY3Rpb24gbWlnaHQgZ2V0IGNhbGxlZCBieSB2LXBhcnRpYWwgXG4gICAgdGhpcy51bmxpbmsgPSB0aGlzLmxpbmtlcih2bSwgZnJhZylcbiAgICB0cmFuc2l0aW9uLmJsb2NrQXBwZW5kKGZyYWcsIHRoaXMuZW5kLCB2bSlcbiAgICAvLyBjYWxsIGF0dGFjaGVkIGZvciBhbGwgdGhlIGNoaWxkIGNvbXBvbmVudHMgY3JlYXRlZFxuICAgIC8vIGR1cmluZyB0aGUgY29tcGlsYXRpb25cbiAgICBpZiAoXy5pbkRvYyh2bS4kZWwpKSB7XG4gICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmdldENvbnRhaW5lZENvbXBvbmVudHMoKVxuICAgICAgaWYgKGNoaWxkcmVuKSBjaGlsZHJlbi5mb3JFYWNoKGNhbGxBdHRhY2gpXG4gICAgfVxuICB9LFxuXG4gIHRlYXJkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnVubGluaykgcmV0dXJuXG4gICAgLy8gY29sbGVjdCBjaGlsZHJlbiBiZWZvcmVoYW5kXG4gICAgdmFyIGNoaWxkcmVuXG4gICAgaWYgKF8uaW5Eb2ModGhpcy52bS4kZWwpKSB7XG4gICAgICBjaGlsZHJlbiA9IHRoaXMuZ2V0Q29udGFpbmVkQ29tcG9uZW50cygpXG4gICAgfVxuICAgIHRyYW5zaXRpb24uYmxvY2tSZW1vdmUodGhpcy5zdGFydCwgdGhpcy5lbmQsIHRoaXMudm0pXG4gICAgaWYgKGNoaWxkcmVuKSBjaGlsZHJlbi5mb3JFYWNoKGNhbGxEZXRhY2gpXG4gICAgdGhpcy51bmxpbmsoKVxuICAgIHRoaXMudW5saW5rID0gbnVsbFxuICB9LFxuXG4gIGdldENvbnRhaW5lZENvbXBvbmVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdm0gPSB0aGlzLnZtXG4gICAgdmFyIHN0YXJ0ID0gdGhpcy5zdGFydC5uZXh0U2libGluZ1xuICAgIHZhciBlbmQgPSB0aGlzLmVuZFxuICAgIHZhciBzZWxmQ29tcG9lbnRzID1cbiAgICAgIHZtLl9jaGlsZHJlbi5sZW5ndGggJiZcbiAgICAgIHZtLl9jaGlsZHJlbi5maWx0ZXIoY29udGFpbnMpXG4gICAgdmFyIHRyYW5zQ29tcG9uZW50cyA9XG4gICAgICB2bS5fdHJhbnNDcG50cyAmJlxuICAgICAgdm0uX3RyYW5zQ3BudHMuZmlsdGVyKGNvbnRhaW5zKVxuXG4gICAgZnVuY3Rpb24gY29udGFpbnMgKGMpIHtcbiAgICAgIHZhciBjdXIgPSBzdGFydFxuICAgICAgdmFyIG5leHRcbiAgICAgIHdoaWxlIChuZXh0ICE9PSBlbmQpIHtcbiAgICAgICAgbmV4dCA9IGN1ci5uZXh0U2libGluZ1xuICAgICAgICBpZiAoY3VyLmNvbnRhaW5zKGMuJGVsKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgY3VyID0gbmV4dFxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGZDb21wb2VudHNcbiAgICAgID8gdHJhbnNDb21wb25lbnRzXG4gICAgICAgID8gc2VsZkNvbXBvZW50cy5jb25jYXQodHJhbnNDb21wb25lbnRzKVxuICAgICAgICA6IHNlbGZDb21wb2VudHNcbiAgICAgIDogdHJhbnNDb21wb25lbnRzXG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudW5saW5rKSB0aGlzLnVubGluaygpXG4gIH1cblxufVxuXG5mdW5jdGlvbiBjYWxsQXR0YWNoIChjaGlsZCkge1xuICBpZiAoIWNoaWxkLl9pc0F0dGFjaGVkKSB7XG4gICAgY2hpbGQuX2NhbGxIb29rKCdhdHRhY2hlZCcpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2FsbERldGFjaCAoY2hpbGQpIHtcbiAgaWYgKGNoaWxkLl9pc0F0dGFjaGVkKSB7XG4gICAgY2hpbGQuX2NhbGxIb29rKCdkZXRhY2hlZCcpXG4gIH1cbn0iLCIvLyBtYW5pcHVsYXRpb24gZGlyZWN0aXZlc1xuZXhwb3J0cy50ZXh0ICAgICAgID0gcmVxdWlyZSgnLi90ZXh0JylcbmV4cG9ydHMuaHRtbCAgICAgICA9IHJlcXVpcmUoJy4vaHRtbCcpXG5leHBvcnRzLmF0dHIgICAgICAgPSByZXF1aXJlKCcuL2F0dHInKVxuZXhwb3J0cy5zaG93ICAgICAgID0gcmVxdWlyZSgnLi9zaG93JylcbmV4cG9ydHNbJ2NsYXNzJ10gICA9IHJlcXVpcmUoJy4vY2xhc3MnKVxuZXhwb3J0cy5lbCAgICAgICAgID0gcmVxdWlyZSgnLi9lbCcpXG5leHBvcnRzLnJlZiAgICAgICAgPSByZXF1aXJlKCcuL3JlZicpXG5leHBvcnRzLmNsb2FrICAgICAgPSByZXF1aXJlKCcuL2Nsb2FrJylcbmV4cG9ydHMuc3R5bGUgICAgICA9IHJlcXVpcmUoJy4vc3R5bGUnKVxuZXhwb3J0cy50cmFuc2l0aW9uID0gcmVxdWlyZSgnLi90cmFuc2l0aW9uJylcblxuLy8gZXZlbnQgbGlzdGVuZXIgZGlyZWN0aXZlc1xuZXhwb3J0cy5vbiAgICAgICAgID0gcmVxdWlyZSgnLi9vbicpXG5leHBvcnRzLm1vZGVsICAgICAgPSByZXF1aXJlKCcuL21vZGVsJylcblxuLy8gbG9naWMgY29udHJvbCBkaXJlY3RpdmVzXG5leHBvcnRzLnJlcGVhdCAgICAgPSByZXF1aXJlKCcuL3JlcGVhdCcpXG5leHBvcnRzWydpZiddICAgICAgPSByZXF1aXJlKCcuL2lmJylcblxuLy8gY2hpbGQgdm0gY29tbXVuaWNhdGlvbiBkaXJlY3RpdmVzXG5leHBvcnRzLmV2ZW50cyAgICAgPSByZXF1aXJlKCcuL2V2ZW50cycpXG5cbi8vIGludGVybmFsIGRpcmVjdGl2ZXMgdGhhdCBzaG91bGQgbm90IGJlIHVzZWQgZGlyZWN0bHlcbi8vIGJ1dCB3ZSBzdGlsbCB3YW50IHRvIGV4cG9zZSB0aGVtIGZvciBhZHZhbmNlZCB1c2FnZS5cbmV4cG9ydHMuX2NvbXBvbmVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50JylcbmV4cG9ydHMuX3Byb3AgICAgICA9IHJlcXVpcmUoJy4vcHJvcCcpIiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5zZXQoZWwuY2hlY2tlZClcbiAgICB9XG4gICAgXy5vbihlbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gICAgaWYgKGVsLmNoZWNrZWQpIHtcbiAgICAgIHRoaXMuX2luaXRWYWx1ZSA9IGVsLmNoZWNrZWRcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmVsLmNoZWNrZWQgPSAhIXZhbHVlXG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgXy5vZmYodGhpcy5lbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG5cbiAgICAvLyBjaGVjayBwYXJhbXNcbiAgICAvLyAtIGxhenk6IHVwZGF0ZSBtb2RlbCBvbiBcImNoYW5nZVwiIGluc3RlYWQgb2YgXCJpbnB1dFwiXG4gICAgdmFyIGxhenkgPSB0aGlzLl9jaGVja1BhcmFtKCdsYXp5JykgIT0gbnVsbFxuICAgIC8vIC0gbnVtYmVyOiBjYXN0IHZhbHVlIGludG8gbnVtYmVyIHdoZW4gdXBkYXRpbmcgbW9kZWwuXG4gICAgdmFyIG51bWJlciA9IHRoaXMuX2NoZWNrUGFyYW0oJ251bWJlcicpICE9IG51bGxcbiAgICAvLyAtIGRlYm91bmNlOiBkZWJvdW5jZSB0aGUgaW5wdXQgbGlzdGVuZXJcbiAgICB2YXIgZGVib3VuY2UgPSBwYXJzZUludCh0aGlzLl9jaGVja1BhcmFtKCdkZWJvdW5jZScpLCAxMClcblxuICAgIC8vIGhhbmRsZSBjb21wb3NpdGlvbiBldmVudHMuXG4gICAgLy8gaHR0cDovL2Jsb2cuZXZhbnlvdS5tZS8yMDE0LzAxLzAzL2NvbXBvc2l0aW9uLWV2ZW50L1xuICAgIHZhciBjcExvY2tlZCA9IGZhbHNlXG4gICAgdGhpcy5jcExvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjcExvY2tlZCA9IHRydWVcbiAgICB9XG4gICAgdGhpcy5jcFVubG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNwTG9ja2VkID0gZmFsc2VcbiAgICAgIC8vIGluIElFMTEgdGhlIFwiY29tcG9zaXRpb25lbmRcIiBldmVudCBmaXJlcyBBRlRFUlxuICAgICAgLy8gdGhlIFwiaW5wdXRcIiBldmVudCwgc28gdGhlIGlucHV0IGhhbmRsZXIgaXMgYmxvY2tlZFxuICAgICAgLy8gYXQgdGhlIGVuZC4uLiBoYXZlIHRvIGNhbGwgaXQgaGVyZS5cbiAgICAgIHNldCgpXG4gICAgfVxuICAgIF8ub24oZWwsJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNwTG9jaylcbiAgICBfLm9uKGVsLCdjb21wb3NpdGlvbmVuZCcsIHRoaXMuY3BVbmxvY2spXG5cbiAgICAvLyBzaGFyZWQgc2V0dGVyXG4gICAgZnVuY3Rpb24gc2V0ICgpIHtcbiAgICAgIHZhciB2YWwgPSBudW1iZXJcbiAgICAgICAgPyBfLnRvTnVtYmVyKGVsLnZhbHVlKVxuICAgICAgICA6IGVsLnZhbHVlXG4gICAgICBzZWxmLnNldCh2YWwpXG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGRpcmVjdGl2ZSBoYXMgZmlsdGVycywgd2UgbmVlZCB0b1xuICAgIC8vIHJlY29yZCBjdXJzb3IgcG9zaXRpb24gYW5kIHJlc3RvcmUgaXQgYWZ0ZXIgdXBkYXRpbmdcbiAgICAvLyB0aGUgaW5wdXQgd2l0aCB0aGUgZmlsdGVyZWQgdmFsdWUuXG4gICAgLy8gYWxzbyBmb3JjZSB1cGRhdGUgZm9yIHR5cGU9XCJyYW5nZVwiIGlucHV0cyB0byBlbmFibGVcbiAgICAvLyBcImxvY2sgaW4gcmFuZ2VcIiAoc2VlICM1MDYpXG4gICAgdmFyIGhhc1JlYWRGaWx0ZXIgPSB0aGlzLmZpbHRlcnMgJiYgdGhpcy5maWx0ZXJzLnJlYWRcbiAgICB0aGlzLmxpc3RlbmVyID0gaGFzUmVhZEZpbHRlciB8fCBlbC50eXBlID09PSAncmFuZ2UnXG4gICAgICA/IGZ1bmN0aW9uIHRleHRJbnB1dExpc3RlbmVyICgpIHtcbiAgICAgICAgICBpZiAoY3BMb2NrZWQpIHJldHVyblxuICAgICAgICAgIHZhciBjaGFyc09mZnNldFxuICAgICAgICAgIC8vIHNvbWUgSFRNTDUgaW5wdXQgdHlwZXMgdGhyb3cgZXJyb3IgaGVyZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyByZWNvcmQgaG93IG1hbnkgY2hhcnMgZnJvbSB0aGUgZW5kIG9mIGlucHV0XG4gICAgICAgICAgICAvLyB0aGUgY3Vyc29yIHdhcyBhdFxuICAgICAgICAgICAgY2hhcnNPZmZzZXQgPSBlbC52YWx1ZS5sZW5ndGggLSBlbC5zZWxlY3Rpb25TdGFydFxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgLy8gRml4IElFMTAvMTEgaW5maW5pdGUgdXBkYXRlIGN5Y2xlXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3l5eDk5MDgwMy92dWUvaXNzdWVzLzU5MlxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgICAgICAgIGlmIChjaGFyc09mZnNldCA8IDApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBzZXQoKVxuICAgICAgICAgIF8ubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gZm9yY2UgYSB2YWx1ZSB1cGRhdGUsIGJlY2F1c2UgaW5cbiAgICAgICAgICAgIC8vIGNlcnRhaW4gY2FzZXMgdGhlIHdyaXRlIGZpbHRlcnMgb3V0cHV0IHRoZVxuICAgICAgICAgICAgLy8gc2FtZSByZXN1bHQgZm9yIGRpZmZlcmVudCBpbnB1dCB2YWx1ZXMsIGFuZFxuICAgICAgICAgICAgLy8gdGhlIE9ic2VydmVyIHNldCBldmVudHMgd29uJ3QgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IHNlbGYuX3dhdGNoZXIudmFsdWVcbiAgICAgICAgICAgIHNlbGYudXBkYXRlKG5ld1ZhbClcbiAgICAgICAgICAgIGlmIChjaGFyc09mZnNldCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHZhciBjdXJzb3JQb3MgPVxuICAgICAgICAgICAgICAgIF8udG9TdHJpbmcobmV3VmFsKS5sZW5ndGggLSBjaGFyc09mZnNldFxuICAgICAgICAgICAgICBlbC5zZXRTZWxlY3Rpb25SYW5nZShjdXJzb3JQb3MsIGN1cnNvclBvcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uIHRleHRJbnB1dExpc3RlbmVyICgpIHtcbiAgICAgICAgICBpZiAoY3BMb2NrZWQpIHJldHVyblxuICAgICAgICAgIHNldCgpXG4gICAgICAgIH1cblxuICAgIGlmIChkZWJvdW5jZSkge1xuICAgICAgdGhpcy5saXN0ZW5lciA9IF8uZGVib3VuY2UodGhpcy5saXN0ZW5lciwgZGVib3VuY2UpXG4gICAgfVxuICAgIHRoaXMuZXZlbnQgPSBsYXp5ID8gJ2NoYW5nZScgOiAnaW5wdXQnXG4gICAgLy8gU3VwcG9ydCBqUXVlcnkgZXZlbnRzLCBzaW5jZSBqUXVlcnkudHJpZ2dlcigpIGRvZXNuJ3RcbiAgICAvLyB0cmlnZ2VyIG5hdGl2ZSBldmVudHMgaW4gc29tZSBjYXNlcyBhbmQgc29tZSBwbHVnaW5zXG4gICAgLy8gcmVseSBvbiAkLnRyaWdnZXIoKVxuICAgIC8vIFxuICAgIC8vIFdlIHdhbnQgdG8gbWFrZSBzdXJlIGlmIGEgbGlzdGVuZXIgaXMgYXR0YWNoZWQgdXNpbmdcbiAgICAvLyBqUXVlcnksIGl0IGlzIGFsc28gcmVtb3ZlZCB3aXRoIGpRdWVyeSwgdGhhdCdzIHdoeVxuICAgIC8vIHdlIGRvIHRoZSBjaGVjayBmb3IgZWFjaCBkaXJlY3RpdmUgaW5zdGFuY2UgYW5kXG4gICAgLy8gc3RvcmUgdGhhdCBjaGVjayByZXN1bHQgb24gaXRzZWxmLiBUaGlzIGFsc28gYWxsb3dzXG4gICAgLy8gZWFzaWVyIHRlc3QgY292ZXJhZ2UgY29udHJvbCBieSB1bnNldHRpbmcgdGhlIGdsb2JhbFxuICAgIC8vIGpRdWVyeSB2YXJpYWJsZSBpbiB0ZXN0cy5cbiAgICB0aGlzLmhhc2pRdWVyeSA9IHR5cGVvZiBqUXVlcnkgPT09ICdmdW5jdGlvbidcbiAgICBpZiAodGhpcy5oYXNqUXVlcnkpIHtcbiAgICAgIGpRdWVyeShlbCkub24odGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9IGVsc2Uge1xuICAgICAgXy5vbihlbCwgdGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9XG5cbiAgICAvLyBJRTkgZG9lc24ndCBmaXJlIGlucHV0IGV2ZW50IG9uIGJhY2tzcGFjZS9kZWwvY3V0XG4gICAgaWYgKCFsYXp5ICYmIF8uaXNJRTkpIHtcbiAgICAgIHRoaXMub25DdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF8ubmV4dFRpY2soc2VsZi5saXN0ZW5lcilcbiAgICAgIH1cbiAgICAgIHRoaXMub25EZWwgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSA0NiB8fCBlLmtleUNvZGUgPT09IDgpIHtcbiAgICAgICAgICBzZWxmLmxpc3RlbmVyKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXy5vbihlbCwgJ2N1dCcsIHRoaXMub25DdXQpXG4gICAgICBfLm9uKGVsLCAna2V5dXAnLCB0aGlzLm9uRGVsKVxuICAgIH1cblxuICAgIC8vIHNldCBpbml0aWFsIHZhbHVlIGlmIHByZXNlbnRcbiAgICBpZiAoXG4gICAgICBlbC5oYXNBdHRyaWJ1dGUoJ3ZhbHVlJykgfHxcbiAgICAgIChlbC50YWdOYW1lID09PSAnVEVYVEFSRUEnICYmIGVsLnZhbHVlLnRyaW0oKSlcbiAgICApIHtcbiAgICAgIHRoaXMuX2luaXRWYWx1ZSA9IG51bWJlclxuICAgICAgICA/IF8udG9OdW1iZXIoZWwudmFsdWUpXG4gICAgICAgIDogZWwudmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmVsLnZhbHVlID0gXy50b1N0cmluZyh2YWx1ZSlcbiAgfSxcblxuICB1bmJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgaWYgKHRoaXMuaGFzalF1ZXJ5KSB7XG4gICAgICBqUXVlcnkoZWwpLm9mZih0aGlzLmV2ZW50LCB0aGlzLmxpc3RlbmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICBfLm9mZihlbCwgdGhpcy5ldmVudCwgdGhpcy5saXN0ZW5lcilcbiAgICB9XG4gICAgXy5vZmYoZWwsJ2NvbXBvc2l0aW9uc3RhcnQnLCB0aGlzLmNwTG9jaylcbiAgICBfLm9mZihlbCwnY29tcG9zaXRpb25lbmQnLCB0aGlzLmNwVW5sb2NrKVxuICAgIGlmICh0aGlzLm9uQ3V0KSB7XG4gICAgICBfLm9mZihlbCwnY3V0JywgdGhpcy5vbkN1dClcbiAgICAgIF8ub2ZmKGVsLCdrZXl1cCcsIHRoaXMub25EZWwpXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxuXG52YXIgaGFuZGxlcnMgPSB7XG4gIF9kZWZhdWx0OiByZXF1aXJlKCcuL2RlZmF1bHQnKSxcbiAgcmFkaW86IHJlcXVpcmUoJy4vcmFkaW8nKSxcbiAgc2VsZWN0OiByZXF1aXJlKCcuL3NlbGVjdCcpLFxuICBjaGVja2JveDogcmVxdWlyZSgnLi9jaGVja2JveCcpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHByaW9yaXR5OiA4MDAsXG4gIHR3b1dheTogdHJ1ZSxcbiAgaGFuZGxlcnM6IGhhbmRsZXJzLFxuXG4gIC8qKlxuICAgKiBQb3NzaWJsZSBlbGVtZW50czpcbiAgICogICA8c2VsZWN0PlxuICAgKiAgIDx0ZXh0YXJlYT5cbiAgICogICA8aW5wdXQgdHlwZT1cIipcIj5cbiAgICogICAgIC0gdGV4dFxuICAgKiAgICAgLSBjaGVja2JveFxuICAgKiAgICAgLSByYWRpb1xuICAgKiAgICAgLSBudW1iZXJcbiAgICogICAgIC0gVE9ETzogbW9yZSB0eXBlcyBtYXkgYmUgc3VwcGxpZWQgYXMgYSBwbHVnaW5cbiAgICovXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIC8vIGZyaWVuZGx5IHdhcm5pbmcuLi5cbiAgICB2YXIgZmlsdGVycyA9IHRoaXMuZmlsdGVyc1xuICAgIGlmIChmaWx0ZXJzICYmIGZpbHRlcnMucmVhZCAmJiAhZmlsdGVycy53cml0ZSkge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnSXQgc2VlbXMgeW91IGFyZSB1c2luZyBhIHJlYWQtb25seSBmaWx0ZXIgd2l0aCAnICtcbiAgICAgICAgJ3YtbW9kZWwuIFlvdSBtaWdodCB3YW50IHRvIHVzZSBhIHR3by13YXkgZmlsdGVyICcgK1xuICAgICAgICAndG8gZW5zdXJlIGNvcnJlY3QgYmVoYXZpb3IuJ1xuICAgICAgKVxuICAgIH1cbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgdmFyIHRhZyA9IGVsLnRhZ05hbWVcbiAgICB2YXIgaGFuZGxlclxuICAgIGlmICh0YWcgPT09ICdJTlBVVCcpIHtcbiAgICAgIGhhbmRsZXIgPSBoYW5kbGVyc1tlbC50eXBlXSB8fCBoYW5kbGVycy5fZGVmYXVsdFxuICAgIH0gZWxzZSBpZiAodGFnID09PSAnU0VMRUNUJykge1xuICAgICAgaGFuZGxlciA9IGhhbmRsZXJzLnNlbGVjdFxuICAgIH0gZWxzZSBpZiAodGFnID09PSAnVEVYVEFSRUEnKSB7XG4gICAgICBoYW5kbGVyID0gaGFuZGxlcnMuX2RlZmF1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgXy53YXJuKCd2LW1vZGVsIGRvZXMgbm90IHN1cHBvcnQgZWxlbWVudCB0eXBlOiAnICsgdGFnKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGhhbmRsZXIuYmluZC5jYWxsKHRoaXMpXG4gICAgdGhpcy51cGRhdGUgPSBoYW5kbGVyLnVwZGF0ZVxuICAgIHRoaXMudW5iaW5kID0gaGFuZGxlci51bmJpbmRcbiAgfVxuXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi8uLi91dGlsJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBlbCA9IHRoaXMuZWxcbiAgICB0aGlzLmxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5zZXQoZWwudmFsdWUpXG4gICAgfVxuICAgIF8ub24oZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICAgIGlmIChlbC5jaGVja2VkKSB7XG4gICAgICB0aGlzLl9pbml0VmFsdWUgPSBlbC52YWx1ZVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgdGhpcy5lbC5jaGVja2VkID0gdmFsdWUgPT0gdGhpcy5lbC52YWx1ZVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIF8ub2ZmKHRoaXMuZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uLy4uL3V0aWwnKVxudmFyIFdhdGNoZXIgPSByZXF1aXJlKCcuLi8uLi93YXRjaGVyJylcbnZhciBkaXJQYXJzZXIgPSByZXF1aXJlKCcuLi8uLi9wYXJzZXJzL2RpcmVjdGl2ZScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgZWwgPSB0aGlzLmVsXG4gICAgLy8gY2hlY2sgb3B0aW9ucyBwYXJhbVxuICAgIHZhciBvcHRpb25zUGFyYW0gPSB0aGlzLl9jaGVja1BhcmFtKCdvcHRpb25zJylcbiAgICBpZiAob3B0aW9uc1BhcmFtKSB7XG4gICAgICBpbml0T3B0aW9ucy5jYWxsKHRoaXMsIG9wdGlvbnNQYXJhbSlcbiAgICB9XG4gICAgdGhpcy5udW1iZXIgPSB0aGlzLl9jaGVja1BhcmFtKCdudW1iZXInKSAhPSBudWxsXG4gICAgdGhpcy5tdWx0aXBsZSA9IGVsLmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKVxuICAgIHRoaXMubGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBzZWxmLm11bHRpcGxlXG4gICAgICAgID8gZ2V0TXVsdGlWYWx1ZShlbClcbiAgICAgICAgOiBlbC52YWx1ZVxuICAgICAgdmFsdWUgPSBzZWxmLm51bWJlclxuICAgICAgICA/IF8uaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgICA/IHZhbHVlLm1hcChfLnRvTnVtYmVyKVxuICAgICAgICAgIDogXy50b051bWJlcih2YWx1ZSlcbiAgICAgICAgOiB2YWx1ZVxuICAgICAgc2VsZi5zZXQodmFsdWUpXG4gICAgfVxuICAgIF8ub24oZWwsICdjaGFuZ2UnLCB0aGlzLmxpc3RlbmVyKVxuICAgIGNoZWNrSW5pdGlhbFZhbHVlLmNhbGwodGhpcylcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXG4gICAgdmFyIGVsID0gdGhpcy5lbFxuICAgIGVsLnNlbGVjdGVkSW5kZXggPSAtMVxuICAgIHZhciBtdWx0aSA9IHRoaXMubXVsdGlwbGUgJiYgXy5pc0FycmF5KHZhbHVlKVxuICAgIHZhciBvcHRpb25zID0gZWwub3B0aW9uc1xuICAgIHZhciBpID0gb3B0aW9ucy5sZW5ndGhcbiAgICB2YXIgb3B0aW9uXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgb3B0aW9uID0gb3B0aW9uc1tpXVxuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gbXVsdGlcbiAgICAgICAgPyBpbmRleE9mKHZhbHVlLCBvcHRpb24udmFsdWUpID4gLTFcbiAgICAgICAgOiB2YWx1ZSA9PSBvcHRpb24udmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgXy5vZmYodGhpcy5lbCwgJ2NoYW5nZScsIHRoaXMubGlzdGVuZXIpXG4gICAgaWYgKHRoaXMub3B0aW9uV2F0Y2hlcikge1xuICAgICAgdGhpcy5vcHRpb25XYXRjaGVyLnRlYXJkb3duKClcbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIEluaXRpYWxpemUgdGhlIG9wdGlvbiBsaXN0IGZyb20gdGhlIHBhcmFtLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHByZXNzaW9uXG4gKi9cblxuZnVuY3Rpb24gaW5pdE9wdGlvbnMgKGV4cHJlc3Npb24pIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciBkZXNjcmlwdG9yID0gZGlyUGFyc2VyLnBhcnNlKGV4cHJlc3Npb24pWzBdXG4gIGZ1bmN0aW9uIG9wdGlvblVwZGF0ZVdhdGNoZXIgKHZhbHVlKSB7XG4gICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHNlbGYuZWwuaW5uZXJIVE1MID0gJydcbiAgICAgIGJ1aWxkT3B0aW9ucyhzZWxmLmVsLCB2YWx1ZSlcbiAgICAgIGlmIChzZWxmLl93YXRjaGVyKSB7XG4gICAgICAgIHNlbGYudXBkYXRlKHNlbGYuX3dhdGNoZXIudmFsdWUpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIF8ud2FybignSW52YWxpZCBvcHRpb25zIHZhbHVlIGZvciB2LW1vZGVsOiAnICsgdmFsdWUpXG4gICAgfVxuICB9XG4gIHRoaXMub3B0aW9uV2F0Y2hlciA9IG5ldyBXYXRjaGVyKFxuICAgIHRoaXMudm0sXG4gICAgZGVzY3JpcHRvci5leHByZXNzaW9uLFxuICAgIG9wdGlvblVwZGF0ZVdhdGNoZXIsXG4gICAge1xuICAgICAgZGVlcDogdHJ1ZSxcbiAgICAgIGZpbHRlcnM6IF8ucmVzb2x2ZUZpbHRlcnModGhpcy52bSwgZGVzY3JpcHRvci5maWx0ZXJzKVxuICAgIH1cbiAgKVxuICAvLyB1cGRhdGUgd2l0aCBpbml0aWFsIHZhbHVlXG4gIG9wdGlvblVwZGF0ZVdhdGNoZXIodGhpcy5vcHRpb25XYXRjaGVyLnZhbHVlKVxufVxuXG4vKipcbiAqIEJ1aWxkIHVwIG9wdGlvbiBlbGVtZW50cy4gSUU5IGRvZXNuJ3QgY3JlYXRlIG9wdGlvbnNcbiAqIHdoZW4gc2V0dGluZyBpbm5lckhUTUwgb24gPHNlbGVjdD4gZWxlbWVudHMsIHNvIHdlIGhhdmVcbiAqIHRvIHVzZSBET00gQVBJIGhlcmUuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBwYXJlbnQgLSBhIDxzZWxlY3Q+IG9yIGFuIDxvcHRncm91cD5cbiAqIEBwYXJhbSB7QXJyYXl9IG9wdGlvbnNcbiAqL1xuXG5mdW5jdGlvbiBidWlsZE9wdGlvbnMgKHBhcmVudCwgb3B0aW9ucykge1xuICB2YXIgb3AsIGVsXG4gIGZvciAodmFyIGkgPSAwLCBsID0gb3B0aW9ucy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBvcCA9IG9wdGlvbnNbaV1cbiAgICBpZiAoIW9wLm9wdGlvbnMpIHtcbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJylcbiAgICAgIGlmICh0eXBlb2Ygb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVsLnRleHQgPSBlbC52YWx1ZSA9IG9wXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC50ZXh0ID0gb3AudGV4dFxuICAgICAgICBlbC52YWx1ZSA9IG9wLnZhbHVlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0Z3JvdXAnKVxuICAgICAgZWwubGFiZWwgPSBvcC5sYWJlbFxuICAgICAgYnVpbGRPcHRpb25zKGVsLCBvcC5vcHRpb25zKVxuICAgIH1cbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWwpXG4gIH1cbn1cblxuLyoqXG4gKiBDaGVjayB0aGUgaW5pdGlhbCB2YWx1ZSBmb3Igc2VsZWN0ZWQgb3B0aW9ucy5cbiAqL1xuXG5mdW5jdGlvbiBjaGVja0luaXRpYWxWYWx1ZSAoKSB7XG4gIHZhciBpbml0VmFsdWVcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLmVsLm9wdGlvbnNcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBvcHRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChvcHRpb25zW2ldLmhhc0F0dHJpYnV0ZSgnc2VsZWN0ZWQnKSkge1xuICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgKGluaXRWYWx1ZSB8fCAoaW5pdFZhbHVlID0gW10pKVxuICAgICAgICAgIC5wdXNoKG9wdGlvbnNbaV0udmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0VmFsdWUgPSBvcHRpb25zW2ldLnZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICh0eXBlb2YgaW5pdFZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRoaXMuX2luaXRWYWx1ZSA9IHRoaXMubnVtYmVyXG4gICAgICA/IF8udG9OdW1iZXIoaW5pdFZhbHVlKVxuICAgICAgOiBpbml0VmFsdWVcbiAgfVxufVxuXG4vKipcbiAqIEhlbHBlciB0byBleHRyYWN0IGEgdmFsdWUgYXJyYXkgZm9yIHNlbGVjdFttdWx0aXBsZV1cbiAqXG4gKiBAcGFyYW0ge1NlbGVjdEVsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqL1xuXG5mdW5jdGlvbiBnZXRNdWx0aVZhbHVlIChlbCkge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmZpbHRlclxuICAgIC5jYWxsKGVsLm9wdGlvbnMsIGZpbHRlclNlbGVjdGVkKVxuICAgIC5tYXAoZ2V0T3B0aW9uVmFsdWUpXG59XG5cbmZ1bmN0aW9uIGZpbHRlclNlbGVjdGVkIChvcCkge1xuICByZXR1cm4gb3Auc2VsZWN0ZWRcbn1cblxuZnVuY3Rpb24gZ2V0T3B0aW9uVmFsdWUgKG9wKSB7XG4gIHJldHVybiBvcC52YWx1ZSB8fCBvcC50ZXh0XG59XG5cbi8qKlxuICogTmF0aXZlIEFycmF5LmluZGV4T2YgdXNlcyBzdHJpY3QgZXF1YWwsIGJ1dCBpbiB0aGlzXG4gKiBjYXNlIHdlIG5lZWQgdG8gbWF0Y2ggc3RyaW5nL251bWJlcnMgd2l0aCBzb2Z0IGVxdWFsLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5mdW5jdGlvbiBpbmRleE9mIChhcnIsIHZhbCkge1xuICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICB2YXIgaSA9IGFyci5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChhcnJbaV0gPT0gdmFsKSByZXR1cm4gaVxuICB9XG4gIHJldHVybiAtMVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGFjY2VwdFN0YXRlbWVudDogdHJ1ZSxcbiAgcHJpb3JpdHk6IDcwMCxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gZGVhbCB3aXRoIGlmcmFtZXNcbiAgICBpZiAoXG4gICAgICB0aGlzLmVsLnRhZ05hbWUgPT09ICdJRlJBTUUnICYmXG4gICAgICB0aGlzLmFyZyAhPT0gJ2xvYWQnXG4gICAgKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgIHRoaXMuaWZyYW1lQmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXy5vbihzZWxmLmVsLmNvbnRlbnRXaW5kb3csIHNlbGYuYXJnLCBzZWxmLmhhbmRsZXIpXG4gICAgICB9XG4gICAgICBfLm9uKHRoaXMuZWwsICdsb2FkJywgdGhpcy5pZnJhbWVCaW5kKVxuICAgIH1cbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdEaXJlY3RpdmUgXCJ2LW9uOicgKyB0aGlzLmV4cHJlc3Npb24gKyAnXCIgJyArXG4gICAgICAgICdleHBlY3RzIGEgZnVuY3Rpb24gdmFsdWUuJ1xuICAgICAgKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucmVzZXQoKVxuICAgIHZhciB2bSA9IHRoaXMudm1cbiAgICB0aGlzLmhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgZS50YXJnZXRWTSA9IHZtXG4gICAgICB2bS4kZXZlbnQgPSBlXG4gICAgICB2YXIgcmVzID0gaGFuZGxlcihlKVxuICAgICAgdm0uJGV2ZW50ID0gbnVsbFxuICAgICAgcmV0dXJuIHJlc1xuICAgIH1cbiAgICBpZiAodGhpcy5pZnJhbWVCaW5kKSB7XG4gICAgICB0aGlzLmlmcmFtZUJpbmQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBfLm9uKHRoaXMuZWwsIHRoaXMuYXJnLCB0aGlzLmhhbmRsZXIpXG4gICAgfVxuICB9LFxuXG4gIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVsID0gdGhpcy5pZnJhbWVCaW5kXG4gICAgICA/IHRoaXMuZWwuY29udGVudFdpbmRvd1xuICAgICAgOiB0aGlzLmVsXG4gICAgaWYgKHRoaXMuaGFuZGxlcikge1xuICAgICAgXy5vZmYoZWwsIHRoaXMuYXJnLCB0aGlzLmhhbmRsZXIpXG4gICAgfVxuICB9LFxuXG4gIHVuYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVzZXQoKVxuICAgIF8ub2ZmKHRoaXMuZWwsICdsb2FkJywgdGhpcy5pZnJhbWVCaW5kKVxuICB9XG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBXYXRjaGVyID0gcmVxdWlyZSgnLi4vd2F0Y2hlcicpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBjaGlsZCA9IHRoaXMudm1cbiAgICB2YXIgcGFyZW50ID0gY2hpbGQuJHBhcmVudFxuICAgIHZhciBjaGlsZEtleSA9IHRoaXMuYXJnXG4gICAgdmFyIHBhcmVudEtleSA9IHRoaXMuZXhwcmVzc2lvblxuXG4gICAgLy8gc2ltcGxlIGxvY2sgdG8gYXZvaWQgY2lyY3VsYXIgdXBkYXRlcy5cbiAgICAvLyB3aXRob3V0IHRoaXMgaXQgd291bGQgc3RhYmlsaXplIHRvbywgYnV0IHRoaXMgbWFrZXNcbiAgICAvLyBzdXJlIGl0IGRvZXNuJ3QgY2F1c2Ugb3RoZXIgd2F0Y2hlcnMgdG8gcmUtZXZhbHVhdGUuXG4gICAgdmFyIGxvY2tlZCA9IGZhbHNlXG4gICAgdmFyIGxvY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBsb2NrZWQgPSB0cnVlXG4gICAgICBfLm5leHRUaWNrKHVubG9jaylcbiAgICB9XG4gICAgdmFyIHVubG9jayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxvY2tlZCA9IGZhbHNlXG4gICAgfVxuXG4gICAgdGhpcy5wYXJlbnRXYXRjaGVyID0gbmV3IFdhdGNoZXIoXG4gICAgICBwYXJlbnQsXG4gICAgICBwYXJlbnRLZXksXG4gICAgICBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgIGlmICghbG9ja2VkKSB7XG4gICAgICAgICAgbG9jaygpXG4gICAgICAgICAgY2hpbGQuJHNldChjaGlsZEtleSwgdmFsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuICAgIFxuICAgIC8vIHNldCB0aGUgY2hpbGQgaW5pdGlhbCB2YWx1ZSBmaXJzdCwgYmVmb3JlIHNldHRpbmdcbiAgICAvLyB1cCB0aGUgY2hpbGQgd2F0Y2hlciB0byBhdm9pZCB0cmlnZ2VyaW5nIGl0XG4gICAgLy8gaW1tZWRpYXRlbHkuXG4gICAgY2hpbGQuJHNldChjaGlsZEtleSwgdGhpcy5wYXJlbnRXYXRjaGVyLnZhbHVlKVxuXG4gICAgLy8gb25seSBzZXR1cCB0d28td2F5IGJpbmRpbmcgaWYgdGhpcyBpcyBub3QgYSBvbmUtd2F5XG4gICAgLy8gYmluZGluZy5cbiAgICBpZiAoIXRoaXMuX2Rlc2NyaXB0b3Iub25lV2F5KSB7XG4gICAgICB0aGlzLmNoaWxkV2F0Y2hlciA9IG5ldyBXYXRjaGVyKFxuICAgICAgICBjaGlsZCxcbiAgICAgICAgY2hpbGRLZXksXG4gICAgICAgIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICBpZiAoIWxvY2tlZCkge1xuICAgICAgICAgICAgbG9jaygpXG4gICAgICAgICAgICBwYXJlbnQuJHNldChwYXJlbnRLZXksIHZhbClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50V2F0Y2hlcikge1xuICAgICAgdGhpcy5wYXJlbnRXYXRjaGVyLnRlYXJkb3duKClcbiAgICB9XG4gICAgaWYgKHRoaXMuY2hpbGRXYXRjaGVyKSB7XG4gICAgICB0aGlzLmNoaWxkV2F0Y2hlci50ZWFyZG93bigpXG4gICAgfVxuICB9XG5cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBpc0xpdGVyYWw6IHRydWUsXG5cbiAgYmluZDogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2bSA9IHRoaXMuZWwuX192dWVfX1xuICAgIGlmICghdm0pIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ3YtcmVmIHNob3VsZCBvbmx5IGJlIHVzZWQgb24gYSBjb21wb25lbnQgcm9vdCBlbGVtZW50LidcbiAgICAgIClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICAvLyBJZiB3ZSBnZXQgaGVyZSwgaXQgbWVhbnMgdGhpcyBpcyBhIGB2LXJlZmAgb24gYVxuICAgIC8vIGNoaWxkLCBiZWNhdXNlIHBhcmVudCBzY29wZSBgdi1yZWZgIGlzIHN0cmlwcGVkIGluXG4gICAgLy8gYHYtY29tcG9uZW50YCBhbHJlYWR5LiBTbyB3ZSBqdXN0IHJlY29yZCBvdXIgb3duIHJlZlxuICAgIC8vIGhlcmUgLSBpdCB3aWxsIG92ZXJ3cml0ZSBwYXJlbnQgcmVmIGluIGB2LWNvbXBvbmVudGAsXG4gICAgLy8gaWYgYW55LlxuICAgIHZtLl9yZWZJRCA9IHRoaXMuZXhwcmVzc2lvblxuICB9XG4gIFxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgaXNPYmplY3QgPSBfLmlzT2JqZWN0XG52YXIgaXNQbGFpbk9iamVjdCA9IF8uaXNQbGFpbk9iamVjdFxudmFyIHRleHRQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RleHQnKVxudmFyIGV4cFBhcnNlciA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvZXhwcmVzc2lvbicpXG52YXIgdGVtcGxhdGVQYXJzZXIgPSByZXF1aXJlKCcuLi9wYXJzZXJzL3RlbXBsYXRlJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG52YXIgdHJhbnNjbHVkZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL3RyYW5zY2x1ZGUnKVxudmFyIG1lcmdlT3B0aW9ucyA9IHJlcXVpcmUoJy4uL3V0aWwvbWVyZ2Utb3B0aW9uJylcbnZhciB1aWQgPSAwXG5cbi8vIGFzeW5jIGNvbXBvbmVudCByZXNvbHV0aW9uIHN0YXRlc1xudmFyIFVOUkVTT0xWRUQgPSAwXG52YXIgUEVORElORyA9IDFcbnZhciBSRVNPTFZFRCA9IDJcbnZhciBBQk9SVEVEID0gM1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKipcbiAgICogU2V0dXAuXG4gICAqL1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAvLyB1aWQgYXMgYSBjYWNoZSBpZGVudGlmaWVyXG4gICAgdGhpcy5pZCA9ICdfX3ZfcmVwZWF0XycgKyAoKyt1aWQpXG4gICAgLy8gd2UgbmVlZCB0byBpbnNlcnQgdGhlIG9ialRvQXJyYXkgY29udmVydGVyXG4gICAgLy8gYXMgdGhlIGZpcnN0IHJlYWQgZmlsdGVyLCBiZWNhdXNlIGl0IGhhcyB0byBiZSBpbnZva2VkXG4gICAgLy8gYmVmb3JlIGFueSB1c2VyIGZpbHRlcnMuIChjYW4ndCBkbyBpdCBpbiBgdXBkYXRlYClcbiAgICBpZiAoIXRoaXMuZmlsdGVycykge1xuICAgICAgdGhpcy5maWx0ZXJzID0ge31cbiAgICB9XG4gICAgLy8gYWRkIHRoZSBvYmplY3QgLT4gYXJyYXkgY29udmVydCBmaWx0ZXJcbiAgICB2YXIgb2JqZWN0Q29udmVydGVyID0gXy5iaW5kKG9ialRvQXJyYXksIHRoaXMpXG4gICAgaWYgKCF0aGlzLmZpbHRlcnMucmVhZCkge1xuICAgICAgdGhpcy5maWx0ZXJzLnJlYWQgPSBbb2JqZWN0Q29udmVydGVyXVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpbHRlcnMucmVhZC51bnNoaWZ0KG9iamVjdENvbnZlcnRlcilcbiAgICB9XG4gICAgLy8gc2V0dXAgcmVmIG5vZGVcbiAgICB0aGlzLnJlZiA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ3YtcmVwZWF0JylcbiAgICBfLnJlcGxhY2UodGhpcy5lbCwgdGhpcy5yZWYpXG4gICAgLy8gY2hlY2sgaWYgdGhpcyBpcyBhIGJsb2NrIHJlcGVhdFxuICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLmVsLnRhZ05hbWUgPT09ICdURU1QTEFURSdcbiAgICAgID8gdGVtcGxhdGVQYXJzZXIucGFyc2UodGhpcy5lbCwgdHJ1ZSlcbiAgICAgIDogdGhpcy5lbFxuICAgIC8vIGNoZWNrIG90aGVyIGRpcmVjdGl2ZXMgdGhhdCBuZWVkIHRvIGJlIGhhbmRsZWRcbiAgICAvLyBhdCB2LXJlcGVhdCBsZXZlbFxuICAgIHRoaXMuY2hlY2tJZigpXG4gICAgdGhpcy5jaGVja1JlZigpXG4gICAgdGhpcy5jaGVja0NvbXBvbmVudCgpXG4gICAgLy8gY2hlY2sgZm9yIHRyYWNrYnkgcGFyYW1cbiAgICB0aGlzLmlkS2V5ID1cbiAgICAgIHRoaXMuX2NoZWNrUGFyYW0oJ3RyYWNrLWJ5JykgfHxcbiAgICAgIHRoaXMuX2NoZWNrUGFyYW0oJ3RyYWNrYnknKSAvLyAwLjExLjAgY29tcGF0XG4gICAgdGhpcy5jYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgfSxcblxuICAvKipcbiAgICogV2FybiBhZ2FpbnN0IHYtaWYgdXNhZ2UuXG4gICAqL1xuXG4gIGNoZWNrSWY6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoXy5hdHRyKHRoaXMuZWwsICdpZicpICE9PSBudWxsKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdEb25cXCd0IHVzZSB2LWlmIHdpdGggdi1yZXBlYXQuICcgK1xuICAgICAgICAnVXNlIHYtc2hvdyBvciB0aGUgXCJmaWx0ZXJCeVwiIGZpbHRlciBpbnN0ZWFkLidcbiAgICAgIClcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHYtcmVmLyB2LWVsIGlzIGFsc28gcHJlc2VudC5cbiAgICovXG5cbiAgY2hlY2tSZWY6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVmSUQgPSBfLmF0dHIodGhpcy5lbCwgJ3JlZicpXG4gICAgdGhpcy5yZWZJRCA9IHJlZklEXG4gICAgICA/IHRoaXMudm0uJGludGVycG9sYXRlKHJlZklEKVxuICAgICAgOiBudWxsXG4gICAgdmFyIGVsSWQgPSBfLmF0dHIodGhpcy5lbCwgJ2VsJylcbiAgICB0aGlzLmVsSWQgPSBlbElkXG4gICAgICA/IHRoaXMudm0uJGludGVycG9sYXRlKGVsSWQpXG4gICAgICA6IG51bGxcbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2sgdGhlIGNvbXBvbmVudCBjb25zdHJ1Y3RvciB0byB1c2UgZm9yIHJlcGVhdGVkXG4gICAqIGluc3RhbmNlcy4gSWYgc3RhdGljIHdlIHJlc29sdmUgaXQgbm93LCBvdGhlcndpc2UgaXRcbiAgICogbmVlZHMgdG8gYmUgcmVzb2x2ZWQgYXQgYnVpbGQgdGltZSB3aXRoIGFjdHVhbCBkYXRhLlxuICAgKi9cblxuICBjaGVja0NvbXBvbmVudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY29tcG9uZW50U3RhdGUgPSBVTlJFU09MVkVEXG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLnZtLiRvcHRpb25zXG4gICAgdmFyIGlkID0gXy5jaGVja0NvbXBvbmVudCh0aGlzLmVsLCBvcHRpb25zKVxuICAgIGlmICghaWQpIHtcbiAgICAgIC8vIGRlZmF1bHQgY29uc3RydWN0b3JcbiAgICAgIHRoaXMuQ3RvciA9IF8uVnVlXG4gICAgICAvLyBpbmxpbmUgcmVwZWF0cyBzaG91bGQgaW5oZXJpdFxuICAgICAgdGhpcy5pbmhlcml0ID0gdHJ1ZVxuICAgICAgLy8gaW1wb3J0YW50OiB0cmFuc2NsdWRlIHdpdGggbm8gb3B0aW9ucywganVzdFxuICAgICAgLy8gdG8gZW5zdXJlIGJsb2NrIHN0YXJ0IGFuZCBibG9jayBlbmRcbiAgICAgIHRoaXMudGVtcGxhdGUgPSB0cmFuc2NsdWRlKHRoaXMudGVtcGxhdGUpXG4gICAgICB2YXIgY29weSA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zKVxuICAgICAgY29weS5fYXNDb21wb25lbnQgPSBmYWxzZVxuICAgICAgdGhpcy5fbGlua0ZuID0gY29tcGlsZSh0aGlzLnRlbXBsYXRlLCBjb3B5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLkN0b3IgPSBudWxsXG4gICAgICB0aGlzLmFzQ29tcG9uZW50ID0gdHJ1ZVxuICAgICAgLy8gY2hlY2sgaW5saW5lLXRlbXBsYXRlXG4gICAgICBpZiAodGhpcy5fY2hlY2tQYXJhbSgnaW5saW5lLXRlbXBsYXRlJykgIT09IG51bGwpIHtcbiAgICAgICAgLy8gZXh0cmFjdCBpbmxpbmUgdGVtcGxhdGUgYXMgYSBEb2N1bWVudEZyYWdtZW50XG4gICAgICAgIHRoaXMuaW5saW5lVGVtcGFsdGUgPSBfLmV4dHJhY3RDb250ZW50KHRoaXMuZWwsIHRydWUpXG4gICAgICB9XG4gICAgICB2YXIgdG9rZW5zID0gdGV4dFBhcnNlci5wYXJzZShpZClcbiAgICAgIGlmICh0b2tlbnMpIHtcbiAgICAgICAgLy8gZHluYW1pYyBjb21wb25lbnQgdG8gYmUgcmVzb2x2ZWQgbGF0ZXJcbiAgICAgICAgdmFyIGN0b3JFeHAgPSB0ZXh0UGFyc2VyLnRva2Vuc1RvRXhwKHRva2VucylcbiAgICAgICAgdGhpcy5jdG9yR2V0dGVyID0gZXhwUGFyc2VyLnBhcnNlKGN0b3JFeHApLmdldFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3RhdGljXG4gICAgICAgIHRoaXMuY29tcG9uZW50SWQgPSBpZFxuICAgICAgICB0aGlzLnBlbmRpbmdEYXRhID0gbnVsbFxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICByZXNvbHZlQ29tcG9uZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb21wb25lbnRTdGF0ZSA9IFBFTkRJTkdcbiAgICB0aGlzLnZtLl9yZXNvbHZlQ29tcG9uZW50KHRoaXMuY29tcG9uZW50SWQsIF8uYmluZChmdW5jdGlvbiAoQ3Rvcikge1xuICAgICAgaWYgKHRoaXMuY29tcG9uZW50U3RhdGUgPT09IEFCT1JURUQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLkN0b3IgPSBDdG9yXG4gICAgICB2YXIgbWVyZ2VkID0gbWVyZ2VPcHRpb25zKEN0b3Iub3B0aW9ucywge30sIHtcbiAgICAgICAgJHBhcmVudDogdGhpcy52bVxuICAgICAgfSlcbiAgICAgIG1lcmdlZC50ZW1wbGF0ZSA9IHRoaXMuaW5saW5lVGVtcGFsdGUgfHwgbWVyZ2VkLnRlbXBsYXRlXG4gICAgICBtZXJnZWQuX2FzQ29tcG9uZW50ID0gdHJ1ZVxuICAgICAgbWVyZ2VkLl9wYXJlbnQgPSB0aGlzLnZtXG4gICAgICB0aGlzLnRlbXBsYXRlID0gdHJhbnNjbHVkZSh0aGlzLnRlbXBsYXRlLCBtZXJnZWQpXG4gICAgICAvLyBJbXBvcnRhbnQ6IG1hcmsgdGhlIHRlbXBsYXRlIGFzIGEgcm9vdCBub2RlIHNvIHRoYXRcbiAgICAgIC8vIGN1c3RvbSBlbGVtZW50IGNvbXBvbmVudHMgZG9uJ3QgZ2V0IGNvbXBpbGVkIHR3aWNlLlxuICAgICAgLy8gZml4ZXMgIzgyMlxuICAgICAgdGhpcy50ZW1wbGF0ZS5fX3Z1ZV9fID0gdHJ1ZVxuICAgICAgdGhpcy5fbGlua0ZuID0gY29tcGlsZSh0aGlzLnRlbXBsYXRlLCBtZXJnZWQpXG4gICAgICB0aGlzLmNvbXBvbmVudFN0YXRlID0gUkVTT0xWRURcbiAgICAgIHRoaXMucmVhbFVwZGF0ZSh0aGlzLnBlbmRpbmdEYXRhKVxuICAgICAgdGhpcy5wZW5kaW5nRGF0YSA9IG51bGxcbiAgICB9LCB0aGlzKSlcbiAgfSxcblxuICAgIC8qKlxuICAgKiBSZXNvbHZlIGEgZHluYW1pYyBjb21wb25lbnQgdG8gdXNlIGZvciBhbiBpbnN0YW5jZS5cbiAgICogVGhlIHRyaWNreSBwYXJ0IGhlcmUgaXMgdGhhdCB0aGVyZSBjb3VsZCBiZSBkeW5hbWljXG4gICAqIGNvbXBvbmVudHMgZGVwZW5kaW5nIG9uIGluc3RhbmNlIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cblxuICByZXNvbHZlRHluYW1pY0NvbXBvbmVudDogZnVuY3Rpb24gKGRhdGEsIG1ldGEpIHtcbiAgICAvLyBjcmVhdGUgYSB0ZW1wb3JhcnkgY29udGV4dCBvYmplY3QgYW5kIGNvcHkgZGF0YVxuICAgIC8vIGFuZCBtZXRhIHByb3BlcnRpZXMgb250byBpdC5cbiAgICAvLyB1c2UgXy5kZWZpbmUgdG8gYXZvaWQgYWNjaWRlbnRhbGx5IG92ZXJ3cml0aW5nIHNjb3BlXG4gICAgLy8gcHJvcGVydGllcy5cbiAgICB2YXIgY29udGV4dCA9IE9iamVjdC5jcmVhdGUodGhpcy52bSlcbiAgICB2YXIga2V5XG4gICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgXy5kZWZpbmUoY29udGV4dCwga2V5LCBkYXRhW2tleV0pXG4gICAgfVxuICAgIGZvciAoa2V5IGluIG1ldGEpIHtcbiAgICAgIF8uZGVmaW5lKGNvbnRleHQsIGtleSwgbWV0YVtrZXldKVxuICAgIH1cbiAgICB2YXIgaWQgPSB0aGlzLmN0b3JHZXR0ZXIuY2FsbChjb250ZXh0LCBjb250ZXh0KVxuICAgIHZhciBDdG9yID0gdGhpcy52bS4kb3B0aW9ucy5jb21wb25lbnRzW2lkXVxuICAgIF8uYXNzZXJ0QXNzZXQoQ3RvciwgJ2NvbXBvbmVudCcsIGlkKVxuICAgIGlmICghQ3Rvci5vcHRpb25zKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdBc3luYyByZXNvbHV0aW9uIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHYtcmVwZWF0ICcgK1xuICAgICAgICAnKyBkeW5hbWljIGNvbXBvbmVudC4gKGNvbXBvbmVudDogJyArIGlkICsgJyknXG4gICAgICApXG4gICAgICByZXR1cm4gXy5WdWVcbiAgICB9XG4gICAgcmV0dXJuIEN0b3JcbiAgfSxcblxuICAvKipcbiAgICogVXBkYXRlLlxuICAgKiBUaGlzIGlzIGNhbGxlZCB3aGVuZXZlciB0aGUgQXJyYXkgbXV0YXRlcy4gSWYgd2UgaGF2ZVxuICAgKiBhIGNvbXBvbmVudCwgd2UgbWlnaHQgbmVlZCB0byB3YWl0IGZvciBpdCB0byByZXNvbHZlXG4gICAqIGFzeW5jaHJvbm91c2x5LlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fE51bWJlcnxTdHJpbmd9IGRhdGFcbiAgICovXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudElkKSB7XG4gICAgICB2YXIgc3RhdGUgPSB0aGlzLmNvbXBvbmVudFN0YXRlXG4gICAgICBpZiAoc3RhdGUgPT09IFVOUkVTT0xWRUQpIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nRGF0YSA9IGRhdGFcbiAgICAgICAgLy8gb25jZSByZXNvbHZlZCwgaXQgd2lsbCBjYWxsIHJlYWxVcGRhdGVcbiAgICAgICAgdGhpcy5yZXNvbHZlQ29tcG9uZW50KClcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFBFTkRJTkcpIHtcbiAgICAgICAgdGhpcy5wZW5kaW5nRGF0YSA9IGRhdGFcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XG4gICAgICAgIHRoaXMucmVhbFVwZGF0ZShkYXRhKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWxVcGRhdGUoZGF0YSlcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSByZWFsIHVwZGF0ZSB0aGF0IGFjdHVhbGx5IG1vZGlmaWVzIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl8TnVtYmVyfFN0cmluZ30gZGF0YVxuICAgKi9cblxuICByZWFsVXBkYXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IFtdXG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgZGF0YVxuICAgIGlmICh0eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgZGF0YSA9IHJhbmdlKGRhdGEpXG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgZGF0YSA9IF8udG9BcnJheShkYXRhKVxuICAgIH1cbiAgICB0aGlzLnZtcyA9IHRoaXMuZGlmZihkYXRhLCB0aGlzLnZtcylcbiAgICAvLyB1cGRhdGUgdi1yZWZcbiAgICBpZiAodGhpcy5yZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3RoaXMucmVmSURdID0gdGhpcy52bXNcbiAgICB9XG4gICAgaWYgKHRoaXMuZWxJZCkge1xuICAgICAgdGhpcy52bS4kJFt0aGlzLmVsSWRdID0gdGhpcy52bXMubWFwKGZ1bmN0aW9uICh2bSkge1xuICAgICAgICByZXR1cm4gdm0uJGVsXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRGlmZiwgYmFzZWQgb24gbmV3IGRhdGEgYW5kIG9sZCBkYXRhLCBkZXRlcm1pbmUgdGhlXG4gICAqIG1pbmltdW0gYW1vdW50IG9mIERPTSBtYW5pcHVsYXRpb25zIG5lZWRlZCB0byBtYWtlIHRoZVxuICAgKiBET00gcmVmbGVjdCB0aGUgbmV3IGRhdGEgQXJyYXkuXG4gICAqXG4gICAqIFRoZSBhbGdvcml0aG0gZGlmZnMgdGhlIG5ldyBkYXRhIEFycmF5IGJ5IHN0b3JpbmcgYVxuICAgKiBoaWRkZW4gcmVmZXJlbmNlIHRvIGFuIG93bmVyIHZtIGluc3RhbmNlIG9uIHByZXZpb3VzbHlcbiAgICogc2VlbiBkYXRhLiBUaGlzIGFsbG93cyB1cyB0byBhY2hpZXZlIE8obikgd2hpY2ggaXNcbiAgICogYmV0dGVyIHRoYW4gYSBsZXZlbnNodGVpbiBkaXN0YW5jZSBiYXNlZCBhbGdvcml0aG0sXG4gICAqIHdoaWNoIGlzIE8obSAqIG4pLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhXG4gICAqIEBwYXJhbSB7QXJyYXl9IG9sZFZtc1xuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG5cbiAgZGlmZjogZnVuY3Rpb24gKGRhdGEsIG9sZFZtcykge1xuICAgIHZhciBpZEtleSA9IHRoaXMuaWRLZXlcbiAgICB2YXIgY29udmVydGVkID0gdGhpcy5jb252ZXJ0ZWRcbiAgICB2YXIgcmVmID0gdGhpcy5yZWZcbiAgICB2YXIgYWxpYXMgPSB0aGlzLmFyZ1xuICAgIHZhciBpbml0ID0gIW9sZFZtc1xuICAgIHZhciB2bXMgPSBuZXcgQXJyYXkoZGF0YS5sZW5ndGgpXG4gICAgdmFyIG9iaiwgcmF3LCB2bSwgaSwgbFxuICAgIC8vIEZpcnN0IHBhc3MsIGdvIHRocm91Z2ggdGhlIG5ldyBBcnJheSBhbmQgZmlsbCB1cFxuICAgIC8vIHRoZSBuZXcgdm1zIGFycmF5LiBJZiBhIHBpZWNlIG9mIGRhdGEgaGFzIGEgY2FjaGVkXG4gICAgLy8gaW5zdGFuY2UgZm9yIGl0LCB3ZSByZXVzZSBpdC4gT3RoZXJ3aXNlIGJ1aWxkIGEgbmV3XG4gICAgLy8gaW5zdGFuY2UuXG4gICAgZm9yIChpID0gMCwgbCA9IGRhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBvYmogPSBkYXRhW2ldXG4gICAgICByYXcgPSBjb252ZXJ0ZWQgPyBvYmouJHZhbHVlIDogb2JqXG4gICAgICB2bSA9ICFpbml0ICYmIHRoaXMuZ2V0Vm0ocmF3LCBjb252ZXJ0ZWQgPyBvYmouJGtleSA6IG51bGwpXG4gICAgICBpZiAodm0pIHsgLy8gcmV1c2FibGUgaW5zdGFuY2VcbiAgICAgICAgdm0uX3JldXNlZCA9IHRydWVcbiAgICAgICAgdm0uJGluZGV4ID0gaSAvLyB1cGRhdGUgJGluZGV4XG4gICAgICAgIC8vIHVwZGF0ZSBkYXRhIGZvciB0cmFjay1ieSBvciBvYmplY3QgcmVwZWF0LFxuICAgICAgICAvLyBzaW5jZSBpbiB0aGVzZSB0d28gY2FzZXMgdGhlIGRhdGEgaXMgcmVwbGFjZWRcbiAgICAgICAgLy8gcmF0aGVyIHRoYW4gbXV0YXRlZC5cbiAgICAgICAgaWYgKGlkS2V5IHx8IGNvbnZlcnRlZCkge1xuICAgICAgICAgIGlmIChhbGlhcykge1xuICAgICAgICAgICAgdm1bYWxpYXNdID0gcmF3XG4gICAgICAgICAgfSBlbHNlIGlmIChfLmlzUGxhaW5PYmplY3QocmF3KSkge1xuICAgICAgICAgICAgdm0uJGRhdGEgPSByYXdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0uJHZhbHVlID0gcmF3XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBuZXcgaW5zdGFuY2VcbiAgICAgICAgdm0gPSB0aGlzLmJ1aWxkKG9iaiwgaSwgdHJ1ZSlcbiAgICAgICAgLy8gdGhlIF9uZXcgZmxhZyBpcyB1c2VkIGluIHRoZSBzZWNvbmQgcGFzcyBmb3JcbiAgICAgICAgLy8gdm0gY2FjaGUgcmV0cml2YWwsIGJ1dCBpZiB0aGlzIGlzIHRoZSBpbml0IHBoYXNlXG4gICAgICAgIC8vIHRoZSBmbGFnIGNhbiBqdXN0IGJlIHNldCB0byBmYWxzZSBkaXJlY3RseS5cbiAgICAgICAgdm0uX25ldyA9ICFpbml0XG4gICAgICAgIHZtLl9yZXVzZWQgPSBmYWxzZVxuICAgICAgfVxuICAgICAgdm1zW2ldID0gdm1cbiAgICAgIC8vIGluc2VydCBpZiB0aGlzIGlzIGZpcnN0IHJ1blxuICAgICAgaWYgKGluaXQpIHtcbiAgICAgICAgdm0uJGJlZm9yZShyZWYpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIGlmIHRoaXMgaXMgdGhlIGZpcnN0IHJ1biwgd2UncmUgZG9uZS5cbiAgICBpZiAoaW5pdCkge1xuICAgICAgcmV0dXJuIHZtc1xuICAgIH1cbiAgICAvLyBTZWNvbmQgcGFzcywgZ28gdGhyb3VnaCB0aGUgb2xkIHZtIGluc3RhbmNlcyBhbmRcbiAgICAvLyBkZXN0cm95IHRob3NlIHdobyBhcmUgbm90IHJldXNlZCAoYW5kIHJlbW92ZSB0aGVtXG4gICAgLy8gZnJvbSBjYWNoZSlcbiAgICBmb3IgKGkgPSAwLCBsID0gb2xkVm1zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdm0gPSBvbGRWbXNbaV1cbiAgICAgIGlmICghdm0uX3JldXNlZCkge1xuICAgICAgICB0aGlzLnVuY2FjaGVWbSh2bSlcbiAgICAgICAgdm0uJGRlc3Ryb3kodHJ1ZSlcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZmluYWwgcGFzcywgbW92ZS9pbnNlcnQgbmV3IGluc3RhbmNlcyBpbnRvIHRoZVxuICAgIC8vIHJpZ2h0IHBsYWNlLiBXZSdyZSBnb2luZyBpbiByZXZlcnNlIGhlcmUgYmVjYXVzZVxuICAgIC8vIGluc2VydEJlZm9yZSByZWxpZXMgb24gdGhlIG5leHQgc2libGluZyB0byBiZVxuICAgIC8vIHJlc29sdmVkLlxuICAgIHZhciB0YXJnZXROZXh0LCBjdXJyZW50TmV4dFxuICAgIGkgPSB2bXMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdm0gPSB2bXNbaV1cbiAgICAgIC8vIHRoaXMgaXMgdGhlIHZtIHRoYXQgd2Ugc2hvdWxkIGJlIGluIGZyb250IG9mXG4gICAgICB0YXJnZXROZXh0ID0gdm1zW2kgKyAxXVxuICAgICAgaWYgKCF0YXJnZXROZXh0KSB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGxhc3QgaXRlbS4gSWYgaXQncyByZXVzZWQgdGhlblxuICAgICAgICAvLyBldmVyeXRoaW5nIGVsc2Ugd2lsbCBldmVudHVhbGx5IGJlIGluIHRoZSByaWdodFxuICAgICAgICAvLyBwbGFjZSwgc28gbm8gbmVlZCB0byB0b3VjaCBpdC4gT3RoZXJ3aXNlLCBpbnNlcnRcbiAgICAgICAgLy8gaXQuXG4gICAgICAgIGlmICghdm0uX3JldXNlZCkge1xuICAgICAgICAgIHZtLiRiZWZvcmUocmVmKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV4dEVsID0gdGFyZ2V0TmV4dC4kZWxcbiAgICAgICAgaWYgKHZtLl9yZXVzZWQpIHtcbiAgICAgICAgICAvLyB0aGlzIGlzIHRoZSB2bSB3ZSBhcmUgYWN0dWFsbHkgaW4gZnJvbnQgb2ZcbiAgICAgICAgICBjdXJyZW50TmV4dCA9IGZpbmROZXh0Vm0odm0sIHJlZilcbiAgICAgICAgICAvLyB3ZSBvbmx5IG5lZWQgdG8gbW92ZSBpZiB3ZSBhcmUgbm90IGluIHRoZSByaWdodFxuICAgICAgICAgIC8vIHBsYWNlIGFscmVhZHkuXG4gICAgICAgICAgaWYgKGN1cnJlbnROZXh0ICE9PSB0YXJnZXROZXh0KSB7XG4gICAgICAgICAgICB2bS4kYmVmb3JlKG5leHRFbCwgbnVsbCwgZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG5ldyBpbnN0YW5jZSwgaW5zZXJ0IHRvIGV4aXN0aW5nIG5leHRcbiAgICAgICAgICB2bS4kYmVmb3JlKG5leHRFbClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdm0uX25ldyA9IGZhbHNlXG4gICAgICB2bS5fcmV1c2VkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHZtc1xuICB9LFxuXG4gIC8qKlxuICAgKiBCdWlsZCBhIG5ldyBpbnN0YW5jZSBhbmQgY2FjaGUgaXQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG5lZWRDYWNoZVxuICAgKi9cblxuICBidWlsZDogZnVuY3Rpb24gKGRhdGEsIGluZGV4LCBuZWVkQ2FjaGUpIHtcbiAgICB2YXIgbWV0YSA9IHsgJGluZGV4OiBpbmRleCB9XG4gICAgaWYgKHRoaXMuY29udmVydGVkKSB7XG4gICAgICBtZXRhLiRrZXkgPSBkYXRhLiRrZXlcbiAgICB9XG4gICAgdmFyIHJhdyA9IHRoaXMuY29udmVydGVkID8gZGF0YS4kdmFsdWUgOiBkYXRhXG4gICAgdmFyIGFsaWFzID0gdGhpcy5hcmdcbiAgICBpZiAoYWxpYXMpIHtcbiAgICAgIGRhdGEgPSB7fVxuICAgICAgZGF0YVthbGlhc10gPSByYXdcbiAgICB9IGVsc2UgaWYgKCFpc1BsYWluT2JqZWN0KHJhdykpIHtcbiAgICAgIC8vIG5vbi1vYmplY3QgdmFsdWVzXG4gICAgICBkYXRhID0ge31cbiAgICAgIG1ldGEuJHZhbHVlID0gcmF3XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmF1bHRcbiAgICAgIGRhdGEgPSByYXdcbiAgICB9XG4gICAgLy8gcmVzb2x2ZSBjb25zdHJ1Y3RvclxuICAgIHZhciBDdG9yID0gdGhpcy5DdG9yIHx8IHRoaXMucmVzb2x2ZUR5bmFtaWNDb21wb25lbnQoZGF0YSwgbWV0YSlcbiAgICB2YXIgdm0gPSB0aGlzLnZtLiRhZGRDaGlsZCh7XG4gICAgICBlbDogdGVtcGxhdGVQYXJzZXIuY2xvbmUodGhpcy50ZW1wbGF0ZSksXG4gICAgICBfYXNDb21wb25lbnQ6IHRoaXMuYXNDb21wb25lbnQsXG4gICAgICBfaG9zdDogdGhpcy5faG9zdCxcbiAgICAgIF9saW5rRm46IHRoaXMuX2xpbmtGbixcbiAgICAgIF9tZXRhOiBtZXRhLFxuICAgICAgZGF0YTogZGF0YSxcbiAgICAgIGluaGVyaXQ6IHRoaXMuaW5oZXJpdCxcbiAgICAgIHRlbXBsYXRlOiB0aGlzLmlubGluZVRlbXBhbHRlXG4gICAgfSwgQ3RvcilcbiAgICAvLyBmbGFnIHRoaXMgaW5zdGFuY2UgYXMgYSByZXBlYXQgaW5zdGFuY2VcbiAgICAvLyBzbyB0aGF0IHdlIGNhbiBza2lwIGl0IGluIHZtLl9kaWdlc3RcbiAgICB2bS5fcmVwZWF0ID0gdHJ1ZVxuICAgIC8vIGNhY2hlIGluc3RhbmNlXG4gICAgaWYgKG5lZWRDYWNoZSkge1xuICAgICAgdGhpcy5jYWNoZVZtKHJhdywgdm0sIHRoaXMuY29udmVydGVkID8gbWV0YS4ka2V5IDogbnVsbClcbiAgICB9XG4gICAgLy8gc3luYyBiYWNrIGNoYW5nZXMgZm9yIHR3by13YXkgYmluZGluZ3Mgb2YgcHJpbWl0aXZlIHZhbHVlc1xuICAgIHZhciB0eXBlID0gdHlwZW9mIHJhd1xuICAgIGlmICh0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgdmFyIGRpciA9IHRoaXNcbiAgICAgIHZtLiR3YXRjaChhbGlhcyB8fCAnJHZhbHVlJywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICBkaXIuX3dpdGhMb2NrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoZGlyLmNvbnZlcnRlZCkge1xuICAgICAgICAgICAgZGlyLnJhd1ZhbHVlW3ZtLiRrZXldID0gdmFsXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpci5yYXdWYWx1ZS4kc2V0KHZtLiRpbmRleCwgdmFsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB2bVxuICB9LFxuXG4gIC8qKlxuICAgKiBVbmJpbmQsIHRlYXJkb3duIGV2ZXJ5dGhpbmdcbiAgICovXG5cbiAgdW5iaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jb21wb25lbnRTdGF0ZSA9IEFCT1JURURcbiAgICBpZiAodGhpcy5yZWZJRCkge1xuICAgICAgdGhpcy52bS4kW3RoaXMucmVmSURdID0gbnVsbFxuICAgIH1cbiAgICBpZiAodGhpcy52bXMpIHtcbiAgICAgIHZhciBpID0gdGhpcy52bXMubGVuZ3RoXG4gICAgICB2YXIgdm1cbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgdm0gPSB0aGlzLnZtc1tpXVxuICAgICAgICB0aGlzLnVuY2FjaGVWbSh2bSlcbiAgICAgICAgdm0uJGRlc3Ryb3koKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2FjaGUgYSB2bSBpbnN0YW5jZSBiYXNlZCBvbiBpdHMgZGF0YS5cbiAgICpcbiAgICogSWYgdGhlIGRhdGEgaXMgYW4gb2JqZWN0LCB3ZSBzYXZlIHRoZSB2bSdzIHJlZmVyZW5jZSBvblxuICAgKiB0aGUgZGF0YSBvYmplY3QgYXMgYSBoaWRkZW4gcHJvcGVydHkuIE90aGVyd2lzZSB3ZVxuICAgKiBjYWNoZSB0aGVtIGluIGFuIG9iamVjdCBhbmQgZm9yIGVhY2ggcHJpbWl0aXZlIHZhbHVlXG4gICAqIHRoZXJlIGlzIGFuIGFycmF5IGluIGNhc2UgdGhlcmUgYXJlIGR1cGxpY2F0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7VnVlfSB2bVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2tleV1cbiAgICovXG5cbiAgY2FjaGVWbTogZnVuY3Rpb24gKGRhdGEsIHZtLCBrZXkpIHtcbiAgICB2YXIgaWRLZXkgPSB0aGlzLmlkS2V5XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZVxuICAgIHZhciBpZFxuICAgIGlmIChrZXkgfHwgaWRLZXkpIHtcbiAgICAgIGlkID0gaWRLZXkgPyBkYXRhW2lkS2V5XSA6IGtleVxuICAgICAgaWYgKCFjYWNoZVtpZF0pIHtcbiAgICAgICAgY2FjaGVbaWRdID0gdm1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8ud2FybignRHVwbGljYXRlIHRyYWNrLWJ5IGtleSBpbiB2LXJlcGVhdDogJyArIGlkKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIGlkID0gdGhpcy5pZFxuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgIGlmIChkYXRhW2lkXSA9PT0gbnVsbCkge1xuICAgICAgICAgIGRhdGFbaWRdID0gdm1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfLndhcm4oXG4gICAgICAgICAgICAnRHVwbGljYXRlIG9iamVjdHMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gdi1yZXBlYXQgJyArXG4gICAgICAgICAgICAnd2hlbiB1c2luZyBjb21wb25lbnRzIG9yIHRyYW5zaXRpb25zLidcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF8uZGVmaW5lKGRhdGEsIGlkLCB2bSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFjYWNoZVtkYXRhXSkge1xuICAgICAgICBjYWNoZVtkYXRhXSA9IFt2bV1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhY2hlW2RhdGFdLnB1c2godm0pXG4gICAgICB9XG4gICAgfVxuICAgIHZtLl9yYXcgPSBkYXRhXG4gIH0sXG5cbiAgLyoqXG4gICAqIFRyeSB0byBnZXQgYSBjYWNoZWQgaW5zdGFuY2UgZnJvbSBhIHBpZWNlIG9mIGRhdGEuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICAgKiBAcmV0dXJuIHtWdWV8dW5kZWZpbmVkfVxuICAgKi9cblxuICBnZXRWbTogZnVuY3Rpb24gKGRhdGEsIGtleSkge1xuICAgIHZhciBpZEtleSA9IHRoaXMuaWRLZXlcbiAgICBpZiAoa2V5IHx8IGlkS2V5KSB7XG4gICAgICB2YXIgaWQgPSBpZEtleSA/IGRhdGFbaWRLZXldIDoga2V5XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVtpZF1cbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICByZXR1cm4gZGF0YVt0aGlzLmlkXVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY2FjaGVkID0gdGhpcy5jYWNoZVtkYXRhXVxuICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICB2YXIgaSA9IDBcbiAgICAgICAgdmFyIHZtID0gY2FjaGVkW2ldXG4gICAgICAgIC8vIHNpbmNlIGR1cGxpY2F0ZWQgdm0gaW5zdGFuY2VzIG1pZ2h0IGJlIGEgcmV1c2VkXG4gICAgICAgIC8vIG9uZSBPUiBhIG5ld2x5IGNyZWF0ZWQgb25lLCB3ZSBuZWVkIHRvIHJldHVybiB0aGVcbiAgICAgICAgLy8gZmlyc3QgaW5zdGFuY2UgdGhhdCBpcyBuZWl0aGVyIG9mIHRoZXNlLlxuICAgICAgICB3aGlsZSAodm0gJiYgKHZtLl9yZXVzZWQgfHwgdm0uX25ldykpIHtcbiAgICAgICAgICB2bSA9IGNhY2hlZFsrK2ldXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZtXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWxldGUgYSBjYWNoZWQgdm0gaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7VnVlfSB2bVxuICAgKi9cblxuICB1bmNhY2hlVm06IGZ1bmN0aW9uICh2bSkge1xuICAgIHZhciBkYXRhID0gdm0uX3Jhd1xuICAgIHZhciBpZEtleSA9IHRoaXMuaWRLZXlcbiAgICBpZiAoaWRLZXkgfHwgdGhpcy5jb252ZXJ0ZWQpIHtcbiAgICAgIHZhciBpZCA9IGlkS2V5ID8gZGF0YVtpZEtleV0gOiB2bS4ka2V5XG4gICAgICB0aGlzLmNhY2hlW2lkXSA9IG51bGxcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBkYXRhW3RoaXMuaWRdID0gbnVsbFxuICAgICAgdm0uX3JhdyA9IG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYWNoZVtkYXRhXS5wb3AoKVxuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogSGVscGVyIHRvIGZpbmQgdGhlIG5leHQgZWxlbWVudCB0aGF0IGlzIGFuIGluc3RhbmNlXG4gKiByb290IG5vZGUuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYSBkZXN0cm95ZWQgdm0nc1xuICogZWxlbWVudCBjb3VsZCBzdGlsbCBiZSBsaW5nZXJpbmcgaW4gdGhlIERPTSBiZWZvcmUgaXRzXG4gKiBsZWF2aW5nIHRyYW5zaXRpb24gZmluaXNoZXMsIGJ1dCBpdHMgX192dWVfXyByZWZlcmVuY2VcbiAqIHNob3VsZCBoYXZlIGJlZW4gcmVtb3ZlZCBzbyB3ZSBjYW4gc2tpcCB0aGVtLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtDb21tZW50Tm9kZX0gcmVmXG4gKiBAcmV0dXJuIHtWdWV9XG4gKi9cblxuZnVuY3Rpb24gZmluZE5leHRWbSAodm0sIHJlZikge1xuICB2YXIgZWwgPSAodm0uX2Jsb2NrRW5kIHx8IHZtLiRlbCkubmV4dFNpYmxpbmdcbiAgd2hpbGUgKCFlbC5fX3Z1ZV9fICYmIGVsICE9PSByZWYpIHtcbiAgICBlbCA9IGVsLm5leHRTaWJsaW5nXG4gIH1cbiAgcmV0dXJuIGVsLl9fdnVlX19cbn1cblxuLyoqXG4gKiBBdHRlbXB0IHRvIGNvbnZlcnQgbm9uLUFycmF5IG9iamVjdHMgdG8gYXJyYXkuXG4gKiBUaGlzIGlzIHRoZSBkZWZhdWx0IGZpbHRlciBpbnN0YWxsZWQgdG8gZXZlcnkgdi1yZXBlYXRcbiAqIGRpcmVjdGl2ZS5cbiAqXG4gKiBJdCB3aWxsIGJlIGNhbGxlZCB3aXRoICoqdGhlIGRpcmVjdGl2ZSoqIGFzIGB0aGlzYFxuICogY29udGV4dCBzbyB0aGF0IHdlIGNhbiBtYXJrIHRoZSByZXBlYXQgYXJyYXkgYXMgY29udmVydGVkXG4gKiBmcm9tIGFuIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0geyp9IG9ialxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG9ialRvQXJyYXkgKG9iaikge1xuICAvLyByZWdhcmRsZXNzIG9mIHR5cGUsIHN0b3JlIHRoZSB1bi1maWx0ZXJlZCByYXcgdmFsdWUuXG4gIHRoaXMucmF3VmFsdWUgPSBvYmpcbiAgaWYgKCFpc1BsYWluT2JqZWN0KG9iaikpIHtcbiAgICByZXR1cm4gb2JqXG4gIH1cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG4gIHZhciBpID0ga2V5cy5sZW5ndGhcbiAgdmFyIHJlcyA9IG5ldyBBcnJheShpKVxuICB2YXIga2V5XG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgcmVzW2ldID0ge1xuICAgICAgJGtleToga2V5LFxuICAgICAgJHZhbHVlOiBvYmpba2V5XVxuICAgIH1cbiAgfVxuICAvLyBgdGhpc2AgcG9pbnRzIHRvIHRoZSByZXBlYXQgZGlyZWN0aXZlIGluc3RhbmNlXG4gIHRoaXMuY29udmVydGVkID0gdHJ1ZVxuICByZXR1cm4gcmVzXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgcmFuZ2UgYXJyYXkgZnJvbSBnaXZlbiBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmZ1bmN0aW9uIHJhbmdlIChuKSB7XG4gIHZhciBpID0gLTFcbiAgdmFyIHJldCA9IG5ldyBBcnJheShuKVxuICB3aGlsZSAoKytpIDwgbikge1xuICAgIHJldFtpXSA9IGlcbiAgfVxuICByZXR1cm4gcmV0XG59IiwidmFyIHRyYW5zaXRpb24gPSByZXF1aXJlKCcuLi90cmFuc2l0aW9uJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIGVsID0gdGhpcy5lbFxuICB0cmFuc2l0aW9uLmFwcGx5KGVsLCB2YWx1ZSA/IDEgOiAtMSwgZnVuY3Rpb24gKCkge1xuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/ICcnIDogJ25vbmUnXG4gIH0sIHRoaXMudm0pXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBwcmVmaXhlcyA9IFsnLXdlYmtpdC0nLCAnLW1vei0nLCAnLW1zLSddXG52YXIgY2FtZWxQcmVmaXhlcyA9IFsnV2Via2l0JywgJ01veicsICdtcyddXG52YXIgaW1wb3J0YW50UkUgPSAvIWltcG9ydGFudDs/JC9cbnZhciBjYW1lbFJFID0gLyhbYS16XSkoW0EtWl0pL2dcbnZhciB0ZXN0RWwgPSBudWxsXG52YXIgcHJvcENhY2hlID0ge31cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgZGVlcDogdHJ1ZSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmFyZykge1xuICAgICAgdGhpcy5zZXRQcm9wKHRoaXMuYXJnLCB2YWx1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gY2FjaGUgb2JqZWN0IHN0eWxlcyBzbyB0aGF0IG9ubHkgY2hhbmdlZCBwcm9wc1xuICAgICAgICAvLyBhcmUgYWN0dWFsbHkgdXBkYXRlZC5cbiAgICAgICAgaWYgKCF0aGlzLmNhY2hlKSB0aGlzLmNhY2hlID0ge31cbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiB2YWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0UHJvcChwcm9wLCB2YWx1ZVtwcm9wXSlcbiAgICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgICAgICAgIGlmICh2YWx1ZVtwcm9wXSAhPSB0aGlzLmNhY2hlW3Byb3BdKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlW3Byb3BdID0gdmFsdWVbcHJvcF1cbiAgICAgICAgICAgIHRoaXMuc2V0UHJvcChwcm9wLCB2YWx1ZVtwcm9wXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUuY3NzVGV4dCA9IHZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHNldFByb3A6IGZ1bmN0aW9uIChwcm9wLCB2YWx1ZSkge1xuICAgIHByb3AgPSBub3JtYWxpemUocHJvcClcbiAgICBpZiAoIXByb3ApIHJldHVybiAvLyB1bnN1cHBvcnRlZCBwcm9wXG4gICAgLy8gY2FzdCBwb3NzaWJsZSBudW1iZXJzL2Jvb2xlYW5zIGludG8gc3RyaW5nc1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB2YWx1ZSArPSAnJ1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdmFyIGlzSW1wb3J0YW50ID0gaW1wb3J0YW50UkUudGVzdCh2YWx1ZSlcbiAgICAgICAgPyAnaW1wb3J0YW50J1xuICAgICAgICA6ICcnXG4gICAgICBpZiAoaXNJbXBvcnRhbnQpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKGltcG9ydGFudFJFLCAnJykudHJpbSgpXG4gICAgICB9XG4gICAgICB0aGlzLmVsLnN0eWxlLnNldFByb3BlcnR5KHByb3AsIHZhbHVlLCBpc0ltcG9ydGFudClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShwcm9wKVxuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogTm9ybWFsaXplIGEgQ1NTIHByb3BlcnR5IG5hbWUuXG4gKiAtIGNhY2hlIHJlc3VsdFxuICogLSBhdXRvIHByZWZpeFxuICogLSBjYW1lbENhc2UgLT4gZGFzaC1jYXNlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5mdW5jdGlvbiBub3JtYWxpemUgKHByb3ApIHtcbiAgaWYgKHByb3BDYWNoZVtwcm9wXSkge1xuICAgIHJldHVybiBwcm9wQ2FjaGVbcHJvcF1cbiAgfVxuICB2YXIgcmVzID0gcHJlZml4KHByb3ApXG4gIHByb3BDYWNoZVtwcm9wXSA9IHByb3BDYWNoZVtyZXNdID0gcmVzXG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBBdXRvIGRldGVjdCB0aGUgYXBwcm9wcmlhdGUgcHJlZml4IGZvciBhIENTUyBwcm9wZXJ0eS5cbiAqIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC81MjM2OTJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHByZWZpeCAocHJvcCkge1xuICBwcm9wID0gcHJvcC5yZXBsYWNlKGNhbWVsUkUsICckMS0kMicpLnRvTG93ZXJDYXNlKClcbiAgdmFyIGNhbWVsID0gXy5jYW1lbGl6ZShwcm9wKVxuICB2YXIgdXBwZXIgPSBjYW1lbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNhbWVsLnNsaWNlKDEpXG4gIGlmICghdGVzdEVsKSB7XG4gICAgdGVzdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgfVxuICBpZiAoY2FtZWwgaW4gdGVzdEVsLnN0eWxlKSB7XG4gICAgcmV0dXJuIHByb3BcbiAgfVxuICB2YXIgaSA9IHByZWZpeGVzLmxlbmd0aFxuICB2YXIgcHJlZml4ZWRcbiAgd2hpbGUgKGktLSkge1xuICAgIHByZWZpeGVkID0gY2FtZWxQcmVmaXhlc1tpXSArIHVwcGVyXG4gICAgaWYgKHByZWZpeGVkIGluIHRlc3RFbC5zdHlsZSkge1xuICAgICAgcmV0dXJuIHByZWZpeGVzW2ldICsgcHJvcFxuICAgIH1cbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGJpbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmF0dHIgPSB0aGlzLmVsLm5vZGVUeXBlID09PSAzXG4gICAgICA/ICdub2RlVmFsdWUnXG4gICAgICA6ICd0ZXh0Q29udGVudCdcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuZWxbdGhpcy5hdHRyXSA9IF8udG9TdHJpbmcodmFsdWUpXG4gIH1cbiAgXG59IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgcHJpb3JpdHk6IDEwMDAsXG4gIGlzTGl0ZXJhbDogdHJ1ZSxcblxuICBiaW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9pc0R5bmFtaWNMaXRlcmFsKSB7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLmV4cHJlc3Npb24pXG4gICAgfVxuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIHZtID0gdGhpcy5lbC5fX3Z1ZV9fIHx8IHRoaXMudm1cbiAgICB0aGlzLmVsLl9fdl90cmFucyA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIC8vIHJlc29sdmUgdGhlIGN1c3RvbSB0cmFuc2l0aW9uIGZ1bmN0aW9ucyBub3dcbiAgICAgIC8vIHNvIHRoZSB0cmFuc2l0aW9uIG1vZHVsZSBrbm93cyB0aGlzIGlzIGFcbiAgICAgIC8vIGphdmFzY3JpcHQgdHJhbnNpdGlvbiB3aXRob3V0IGhhdmluZyB0byBjaGVja1xuICAgICAgLy8gY29tcHV0ZWQgQ1NTLlxuICAgICAgZm5zOiB2bS4kb3B0aW9ucy50cmFuc2l0aW9uc1tpZF1cbiAgICB9XG4gIH1cblxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgUGF0aCA9IHJlcXVpcmUoJy4uL3BhcnNlcnMvcGF0aCcpXG5cbi8qKlxuICogRmlsdGVyIGZpbHRlciBmb3Igdi1yZXBlYXRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoS2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gW2RlbGltaXRlcl1cbiAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhS2V5XG4gKi9cblxuZXhwb3J0cy5maWx0ZXJCeSA9IGZ1bmN0aW9uIChhcnIsIHNlYXJjaEtleSwgZGVsaW1pdGVyLCBkYXRhS2V5KSB7XG4gIC8vIGFsbG93IG9wdGlvbmFsIGBpbmAgZGVsaW1pdGVyXG4gIC8vIGJlY2F1c2Ugd2h5IG5vdFxuICBpZiAoZGVsaW1pdGVyICYmIGRlbGltaXRlciAhPT0gJ2luJykge1xuICAgIGRhdGFLZXkgPSBkZWxpbWl0ZXJcbiAgfVxuICAvLyBnZXQgdGhlIHNlYXJjaCBzdHJpbmdcbiAgdmFyIHNlYXJjaCA9XG4gICAgXy5zdHJpcFF1b3RlcyhzZWFyY2hLZXkpIHx8XG4gICAgdGhpcy4kZ2V0KHNlYXJjaEtleSlcbiAgaWYgKCFzZWFyY2gpIHtcbiAgICByZXR1cm4gYXJyXG4gIH1cbiAgc2VhcmNoID0gKCcnICsgc2VhcmNoKS50b0xvd2VyQ2FzZSgpXG4gIC8vIGdldCB0aGUgb3B0aW9uYWwgZGF0YUtleVxuICBkYXRhS2V5ID1cbiAgICBkYXRhS2V5ICYmXG4gICAgKF8uc3RyaXBRdW90ZXMoZGF0YUtleSkgfHwgdGhpcy4kZ2V0KGRhdGFLZXkpKVxuICByZXR1cm4gYXJyLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgIHJldHVybiBkYXRhS2V5XG4gICAgICA/IGNvbnRhaW5zKFBhdGguZ2V0KGl0ZW0sIGRhdGFLZXkpLCBzZWFyY2gpXG4gICAgICA6IGNvbnRhaW5zKGl0ZW0sIHNlYXJjaClcbiAgfSlcbn1cblxuLyoqXG4gKiBGaWx0ZXIgZmlsdGVyIGZvciB2LXJlcGVhdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzb3J0S2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gcmV2ZXJzZUtleVxuICovXG5cbmV4cG9ydHMub3JkZXJCeSA9IGZ1bmN0aW9uIChhcnIsIHNvcnRLZXksIHJldmVyc2VLZXkpIHtcbiAgdmFyIGtleSA9XG4gICAgXy5zdHJpcFF1b3Rlcyhzb3J0S2V5KSB8fFxuICAgIHRoaXMuJGdldChzb3J0S2V5KVxuICBpZiAoIWtleSkge1xuICAgIHJldHVybiBhcnJcbiAgfVxuICB2YXIgb3JkZXIgPSAxXG4gIGlmIChyZXZlcnNlS2V5KSB7XG4gICAgaWYgKHJldmVyc2VLZXkgPT09ICctMScpIHtcbiAgICAgIG9yZGVyID0gLTFcbiAgICB9IGVsc2UgaWYgKHJldmVyc2VLZXkuY2hhckNvZGVBdCgwKSA9PT0gMHgyMSkgeyAvLyAhXG4gICAgICByZXZlcnNlS2V5ID0gcmV2ZXJzZUtleS5zbGljZSgxKVxuICAgICAgb3JkZXIgPSB0aGlzLiRnZXQocmV2ZXJzZUtleSkgPyAxIDogLTFcbiAgICB9IGVsc2Uge1xuICAgICAgb3JkZXIgPSB0aGlzLiRnZXQocmV2ZXJzZUtleSkgPyAtMSA6IDFcbiAgICB9XG4gIH1cbiAgLy8gc29ydCBvbiBhIGNvcHkgdG8gYXZvaWQgbXV0YXRpbmcgb3JpZ2luYWwgYXJyYXlcbiAgcmV0dXJuIGFyci5zbGljZSgpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICBpZiAoa2V5ICE9PSAnJGtleScgJiYga2V5ICE9PSAnJHZhbHVlJykge1xuICAgICAgaWYgKGEgJiYgJyR2YWx1ZScgaW4gYSkgYSA9IGEuJHZhbHVlXG4gICAgICBpZiAoYiAmJiAnJHZhbHVlJyBpbiBiKSBiID0gYi4kdmFsdWVcbiAgICB9XG4gICAgYSA9IF8uaXNPYmplY3QoYSkgPyBQYXRoLmdldChhLCBrZXkpIDogYVxuICAgIGIgPSBfLmlzT2JqZWN0KGIpID8gUGF0aC5nZXQoYiwga2V5KSA6IGJcbiAgICByZXR1cm4gYSA9PT0gYiA/IDAgOiBhID4gYiA/IG9yZGVyIDogLW9yZGVyXG4gIH0pXG59XG5cbi8qKlxuICogU3RyaW5nIGNvbnRhaW4gaGVscGVyXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWFyY2hcbiAqL1xuXG5mdW5jdGlvbiBjb250YWlucyAodmFsLCBzZWFyY2gpIHtcbiAgaWYgKF8uaXNQbGFpbk9iamVjdCh2YWwpKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHZhbCkge1xuICAgICAgaWYgKGNvbnRhaW5zKHZhbFtrZXldLCBzZWFyY2gpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKF8uaXNBcnJheSh2YWwpKSB7XG4gICAgdmFyIGkgPSB2YWwubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWYgKGNvbnRhaW5zKHZhbFtpXSwgc2VhcmNoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh2YWwgIT0gbnVsbCkge1xuICAgIHJldHVybiB2YWwudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoKSA+IC0xXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIFN0cmluZ2lmeSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZW50XG4gKi9cblxuZXhwb3J0cy5qc29uID0ge1xuICByZWFkOiBmdW5jdGlvbiAodmFsdWUsIGluZGVudCkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICA/IHZhbHVlXG4gICAgICA6IEpTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCBOdW1iZXIoaW5kZW50KSB8fCAyKVxuICB9LFxuICB3cml0ZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKHZhbHVlKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqICdhYmMnID0+ICdBYmMnXG4gKi9cblxuZXhwb3J0cy5jYXBpdGFsaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHJldHVybiAnJ1xuICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKClcbiAgcmV0dXJuIHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc2xpY2UoMSlcbn1cblxuLyoqXG4gKiAnYWJjJyA9PiAnQUJDJ1xuICovXG5cbmV4cG9ydHMudXBwZXJjYXNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgfHwgdmFsdWUgPT09IDApXG4gICAgPyB2YWx1ZS50b1N0cmluZygpLnRvVXBwZXJDYXNlKClcbiAgICA6ICcnXG59XG5cbi8qKlxuICogJ0FiQycgPT4gJ2FiYydcbiAqL1xuXG5leHBvcnRzLmxvd2VyY2FzZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlIHx8IHZhbHVlID09PSAwKVxuICAgID8gdmFsdWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgOiAnJ1xufVxuXG4vKipcbiAqIDEyMzQ1ID0+ICQxMiwzNDUuMDBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc2lnblxuICovXG5cbnZhciBkaWdpdHNSRSA9IC8oXFxkezN9KSg/PVxcZCkvZ1xuXG5leHBvcnRzLmN1cnJlbmN5ID0gZnVuY3Rpb24gKHZhbHVlLCBzaWduKSB7XG4gIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSlcbiAgaWYgKCFpc0Zpbml0ZSh2YWx1ZSkgfHwgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMCkpIHJldHVybiAnJ1xuICBzaWduID0gc2lnbiB8fCAnJCdcbiAgdmFyIHMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHZhbHVlKSkudG9TdHJpbmcoKSxcbiAgICBpID0gcy5sZW5ndGggJSAzLFxuICAgIGggPSBpID4gMFxuICAgICAgPyAocy5zbGljZSgwLCBpKSArIChzLmxlbmd0aCA+IDMgPyAnLCcgOiAnJykpXG4gICAgICA6ICcnLFxuICAgIHYgPSBNYXRoLmFicyhwYXJzZUludCgodmFsdWUgKiAxMDApICUgMTAwLCAxMCkpLFxuICAgIGYgPSAnLicgKyAodiA8IDEwID8gKCcwJyArIHYpIDogdilcbiAgcmV0dXJuICh2YWx1ZSA8IDAgPyAnLScgOiAnJykgK1xuICAgIHNpZ24gKyBoICsgcy5zbGljZShpKS5yZXBsYWNlKGRpZ2l0c1JFLCAnJDEsJykgKyBmXG59XG5cbi8qKlxuICogJ2l0ZW0nID0+ICdpdGVtcydcbiAqXG4gKiBAcGFyYW1zXG4gKiAgYW4gYXJyYXkgb2Ygc3RyaW5ncyBjb3JyZXNwb25kaW5nIHRvXG4gKiAgdGhlIHNpbmdsZSwgZG91YmxlLCB0cmlwbGUgLi4uIGZvcm1zIG9mIHRoZSB3b3JkIHRvXG4gKiAgYmUgcGx1cmFsaXplZC4gV2hlbiB0aGUgbnVtYmVyIHRvIGJlIHBsdXJhbGl6ZWRcbiAqICBleGNlZWRzIHRoZSBsZW5ndGggb2YgdGhlIGFyZ3MsIGl0IHdpbGwgdXNlIHRoZSBsYXN0XG4gKiAgZW50cnkgaW4gdGhlIGFycmF5LlxuICpcbiAqICBlLmcuIFsnc2luZ2xlJywgJ2RvdWJsZScsICd0cmlwbGUnLCAnbXVsdGlwbGUnXVxuICovXG5cbmV4cG9ydHMucGx1cmFsaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBhcmdzID0gXy50b0FycmF5KGFyZ3VtZW50cywgMSlcbiAgcmV0dXJuIGFyZ3MubGVuZ3RoID4gMVxuICAgID8gKGFyZ3NbdmFsdWUgJSAxMCAtIDFdIHx8IGFyZ3NbYXJncy5sZW5ndGggLSAxXSlcbiAgICA6IChhcmdzWzBdICsgKHZhbHVlID09PSAxID8gJycgOiAncycpKVxufVxuXG4vKipcbiAqIEEgc3BlY2lhbCBmaWx0ZXIgdGhhdCB0YWtlcyBhIGhhbmRsZXIgZnVuY3Rpb24sXG4gKiB3cmFwcyBpdCBzbyBpdCBvbmx5IGdldHMgdHJpZ2dlcmVkIG9uIHNwZWNpZmljXG4gKiBrZXlwcmVzc2VzLiB2LW9uIG9ubHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICovXG5cbnZhciBrZXlDb2RlcyA9IHtcbiAgZW50ZXIgICAgOiAxMyxcbiAgdGFiICAgICAgOiA5LFxuICAnZGVsZXRlJyA6IDQ2LFxuICB1cCAgICAgICA6IDM4LFxuICBsZWZ0ICAgICA6IDM3LFxuICByaWdodCAgICA6IDM5LFxuICBkb3duICAgICA6IDQwLFxuICBlc2MgICAgICA6IDI3XG59XG5cbmV4cG9ydHMua2V5ID0gZnVuY3Rpb24gKGhhbmRsZXIsIGtleSkge1xuICBpZiAoIWhhbmRsZXIpIHJldHVyblxuICB2YXIgY29kZSA9IGtleUNvZGVzW2tleV1cbiAgaWYgKCFjb2RlKSB7XG4gICAgY29kZSA9IHBhcnNlSW50KGtleSwgMTApXG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gY29kZSkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIuY2FsbCh0aGlzLCBlKVxuICAgIH1cbiAgfVxufVxuXG4vLyBleHBvc2Uga2V5Y29kZSBoYXNoXG5leHBvcnRzLmtleS5rZXlDb2RlcyA9IGtleUNvZGVzXG5cbi8qKlxuICogSW5zdGFsbCBzcGVjaWFsIGFycmF5IGZpbHRlcnNcbiAqL1xuXG5fLmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2FycmF5LWZpbHRlcnMnKSlcbiIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgRGlyZWN0aXZlID0gcmVxdWlyZSgnLi4vZGlyZWN0aXZlJylcbnZhciBjb21waWxlID0gcmVxdWlyZSgnLi4vY29tcGlsZXIvY29tcGlsZScpXG52YXIgdHJhbnNjbHVkZSA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL3RyYW5zY2x1ZGUnKVxuXG4vKipcbiAqIFRyYW5zY2x1ZGUsIGNvbXBpbGUgYW5kIGxpbmsgZWxlbWVudC5cbiAqXG4gKiBJZiBhIHByZS1jb21waWxlZCBsaW5rZXIgaXMgYXZhaWxhYmxlLCB0aGF0IG1lYW5zIHRoZVxuICogcGFzc2VkIGluIGVsZW1lbnQgd2lsbCBiZSBwcmUtdHJhbnNjbHVkZWQgYW5kIGNvbXBpbGVkXG4gKiBhcyB3ZWxsIC0gYWxsIHdlIG5lZWQgdG8gZG8gaXMgdG8gY2FsbCB0aGUgbGlua2VyLlxuICpcbiAqIE90aGVyd2lzZSB3ZSBuZWVkIHRvIGNhbGwgdHJhbnNjbHVkZS9jb21waWxlL2xpbmsgaGVyZS5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5cbmV4cG9ydHMuX2NvbXBpbGUgPSBmdW5jdGlvbiAoZWwpIHtcbiAgdmFyIG9wdGlvbnMgPSB0aGlzLiRvcHRpb25zXG4gIGlmIChvcHRpb25zLl9saW5rRm4pIHtcbiAgICAvLyBwcmUtdHJhbnNjbHVkZWQgd2l0aCBsaW5rZXIsIGp1c3QgdXNlIGl0XG4gICAgdGhpcy5faW5pdEVsZW1lbnQoZWwpXG4gICAgdGhpcy5fdW5saW5rRm4gPSBvcHRpb25zLl9saW5rRm4odGhpcywgZWwpXG4gIH0gZWxzZSB7XG4gICAgLy8gdHJhbnNjbHVkZSBhbmQgaW5pdCBlbGVtZW50XG4gICAgLy8gdHJhbnNjbHVkZSBjYW4gcG90ZW50aWFsbHkgcmVwbGFjZSBvcmlnaW5hbFxuICAgIC8vIHNvIHdlIG5lZWQgdG8ga2VlcCByZWZlcmVuY2VcbiAgICB2YXIgb3JpZ2luYWwgPSBlbFxuICAgIGVsID0gdHJhbnNjbHVkZShlbCwgb3B0aW9ucylcbiAgICB0aGlzLl9pbml0RWxlbWVudChlbClcbiAgICAvLyBjb21waWxlIGFuZCBsaW5rIHRoZSByZXN0XG4gICAgdGhpcy5fdW5saW5rRm4gPSBjb21waWxlKGVsLCBvcHRpb25zKSh0aGlzLCBlbClcbiAgICAvLyBmaW5hbGx5IHJlcGxhY2Ugb3JpZ2luYWxcbiAgICBpZiAob3B0aW9ucy5yZXBsYWNlKSB7XG4gICAgICBfLnJlcGxhY2Uob3JpZ2luYWwsIGVsKVxuICAgIH1cbiAgfVxuICByZXR1cm4gZWxcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIGluc3RhbmNlIGVsZW1lbnQuIENhbGxlZCBpbiB0aGUgcHVibGljXG4gKiAkbW91bnQoKSBtZXRob2QuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5cbmV4cG9ydHMuX2luaXRFbGVtZW50ID0gZnVuY3Rpb24gKGVsKSB7XG4gIGlmIChlbCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICB0aGlzLl9pc0Jsb2NrID0gdHJ1ZVxuICAgIHRoaXMuJGVsID0gdGhpcy5fYmxvY2tTdGFydCA9IGVsLmZpcnN0Q2hpbGRcbiAgICB0aGlzLl9ibG9ja0VuZCA9IGVsLmxhc3RDaGlsZFxuICAgIHRoaXMuX2Jsb2NrRnJhZ21lbnQgPSBlbFxuICB9IGVsc2Uge1xuICAgIHRoaXMuJGVsID0gZWxcbiAgfVxuICB0aGlzLiRlbC5fX3Z1ZV9fID0gdGhpc1xuICB0aGlzLl9jYWxsSG9vaygnYmVmb3JlQ29tcGlsZScpXG59XG5cbi8qKlxuICogQ3JlYXRlIGFuZCBiaW5kIGEgZGlyZWN0aXZlIHRvIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBkaXJlY3RpdmUgbmFtZVxuICogQHBhcmFtIHtOb2RlfSBub2RlICAgLSB0YXJnZXQgbm9kZVxuICogQHBhcmFtIHtPYmplY3R9IGRlc2MgLSBwYXJzZWQgZGlyZWN0aXZlIGRlc2NyaXB0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWYgIC0gZGlyZWN0aXZlIGRlZmluaXRpb24gb2JqZWN0XG4gKiBAcGFyYW0ge1Z1ZXx1bmRlZmluZWR9IGhvc3QgLSB0cmFuc2NsdXNpb24gaG9zdCBjb21wb25lbnRcbiAqL1xuXG5leHBvcnRzLl9iaW5kRGlyID0gZnVuY3Rpb24gKG5hbWUsIG5vZGUsIGRlc2MsIGRlZiwgaG9zdCkge1xuICB0aGlzLl9kaXJlY3RpdmVzLnB1c2goXG4gICAgbmV3IERpcmVjdGl2ZShuYW1lLCBub2RlLCB0aGlzLCBkZXNjLCBkZWYsIGhvc3QpXG4gIClcbn1cblxuLyoqXG4gKiBUZWFyZG93biBhbiBpbnN0YW5jZSwgdW5vYnNlcnZlcyB0aGUgZGF0YSwgdW5iaW5kIGFsbCB0aGVcbiAqIGRpcmVjdGl2ZXMsIHR1cm4gb2ZmIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzLCBldGMuXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSByZW1vdmUgLSB3aGV0aGVyIHRvIHJlbW92ZSB0aGUgRE9NIG5vZGUuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRlZmVyQ2xlYW51cCAtIGlmIHRydWUsIGRlZmVyIGNsZWFudXAgdG9cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmUgY2FsbGVkIGxhdGVyXG4gKi9cblxuZXhwb3J0cy5fZGVzdHJveSA9IGZ1bmN0aW9uIChyZW1vdmUsIGRlZmVyQ2xlYW51cCkge1xuICBpZiAodGhpcy5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgIHJldHVyblxuICB9XG4gIHRoaXMuX2NhbGxIb29rKCdiZWZvcmVEZXN0cm95JylcbiAgdGhpcy5faXNCZWluZ0Rlc3Ryb3llZCA9IHRydWVcbiAgdmFyIGlcbiAgLy8gcmVtb3ZlIHNlbGYgZnJvbSBwYXJlbnQuIG9ubHkgbmVjZXNzYXJ5XG4gIC8vIGlmIHBhcmVudCBpcyBub3QgYmVpbmcgZGVzdHJveWVkIGFzIHdlbGwuXG4gIHZhciBwYXJlbnQgPSB0aGlzLiRwYXJlbnRcbiAgaWYgKHBhcmVudCAmJiAhcGFyZW50Ll9pc0JlaW5nRGVzdHJveWVkKSB7XG4gICAgcGFyZW50Ll9jaGlsZHJlbi4kcmVtb3ZlKHRoaXMpXG4gIH1cbiAgLy8gc2FtZSBmb3IgdHJhbnNjbHVzaW9uIGhvc3QuXG4gIHZhciBob3N0ID0gdGhpcy5faG9zdFxuICBpZiAoaG9zdCAmJiAhaG9zdC5faXNCZWluZ0Rlc3Ryb3llZCkge1xuICAgIGhvc3QuX3RyYW5zQ3BudHMuJHJlbW92ZSh0aGlzKVxuICB9XG4gIC8vIGRlc3Ryb3kgYWxsIGNoaWxkcmVuLlxuICBpID0gdGhpcy5fY2hpbGRyZW4ubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB0aGlzLl9jaGlsZHJlbltpXS4kZGVzdHJveSgpXG4gIH1cbiAgLy8gdGVhcmRvd24gYWxsIGRpcmVjdGl2ZXMuIHRoaXMgYWxzbyB0ZWFyc2Rvd24gYWxsXG4gIC8vIGRpcmVjdGl2ZS1vd25lZCB3YXRjaGVycy5cbiAgaWYgKHRoaXMuX3VubGlua0ZuKSB7XG4gICAgLy8gcGFzc2luZyBkZXN0cm95aW5nOiB0cnVlIHRvIGF2b2lkIHNlYXJjaGluZyBhbmRcbiAgICAvLyBzcGxpY2luZyB0aGUgZGlyZWN0aXZlc1xuICAgIHRoaXMuX3VubGlua0ZuKHRydWUpXG4gIH1cbiAgLy8gdGVhcmRvd24gYWxsIHVzZXIgd2F0Y2hlcnMuXG4gIHZhciB3YXRjaGVyXG4gIGZvciAoaSBpbiB0aGlzLl91c2VyV2F0Y2hlcnMpIHtcbiAgICB3YXRjaGVyID0gdGhpcy5fdXNlcldhdGNoZXJzW2ldXG4gICAgaWYgKHdhdGNoZXIpIHtcbiAgICAgIHdhdGNoZXIudGVhcmRvd24oKVxuICAgIH1cbiAgfVxuICAvLyByZW1vdmUgcmVmZXJlbmNlIHRvIHNlbGYgb24gJGVsXG4gIGlmICh0aGlzLiRlbCkge1xuICAgIHRoaXMuJGVsLl9fdnVlX18gPSBudWxsXG4gIH1cbiAgLy8gcmVtb3ZlIERPTSBlbGVtZW50XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAocmVtb3ZlICYmIHRoaXMuJGVsKSB7XG4gICAgdGhpcy4kcmVtb3ZlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2NsZWFudXAoKVxuICAgIH0pXG4gIH0gZWxzZSBpZiAoIWRlZmVyQ2xlYW51cCkge1xuICAgIHRoaXMuX2NsZWFudXAoKVxuICB9XG59XG5cbi8qKlxuICogQ2xlYW4gdXAgdG8gZW5zdXJlIGdhcmJhZ2UgY29sbGVjdGlvbi5cbiAqIFRoaXMgaXMgY2FsbGVkIGFmdGVyIHRoZSBsZWF2ZSB0cmFuc2l0aW9uIGlmIHRoZXJlXG4gKiBpcyBhbnkuXG4gKi9cblxuZXhwb3J0cy5fY2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gcmVtb3ZlIHJlZmVyZW5jZSBmcm9tIGRhdGEgb2JcbiAgdGhpcy5fZGF0YS5fX29iX18ucmVtb3ZlVm0odGhpcylcbiAgdGhpcy5fZGF0YSA9XG4gIHRoaXMuX3dhdGNoZXJzID1cbiAgdGhpcy5fdXNlcldhdGNoZXJzID1cbiAgdGhpcy5fd2F0Y2hlckxpc3QgPVxuICB0aGlzLiRlbCA9XG4gIHRoaXMuJHBhcmVudCA9XG4gIHRoaXMuJHJvb3QgPVxuICB0aGlzLl9jaGlsZHJlbiA9XG4gIHRoaXMuX3RyYW5zQ3BudHMgPVxuICB0aGlzLl9kaXJlY3RpdmVzID0gbnVsbFxuICAvLyBjYWxsIHRoZSBsYXN0IGhvb2suLi5cbiAgdGhpcy5faXNEZXN0cm95ZWQgPSB0cnVlXG4gIHRoaXMuX2NhbGxIb29rKCdkZXN0cm95ZWQnKVxuICAvLyB0dXJuIG9mZiBhbGwgaW5zdGFuY2UgbGlzdGVuZXJzLlxuICB0aGlzLiRvZmYoKVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgaW5Eb2MgPSBfLmluRG9jXG5cbi8qKlxuICogU2V0dXAgdGhlIGluc3RhbmNlJ3Mgb3B0aW9uIGV2ZW50cyAmIHdhdGNoZXJzLlxuICogSWYgdGhlIHZhbHVlIGlzIGEgc3RyaW5nLCB3ZSBwdWxsIGl0IGZyb20gdGhlXG4gKiBpbnN0YW5jZSdzIG1ldGhvZHMgYnkgbmFtZS5cbiAqL1xuXG5leHBvcnRzLl9pbml0RXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnNcbiAgcmVnaXN0ZXJDYWxsYmFja3ModGhpcywgJyRvbicsIG9wdGlvbnMuZXZlbnRzKVxuICByZWdpc3RlckNhbGxiYWNrcyh0aGlzLCAnJHdhdGNoJywgb3B0aW9ucy53YXRjaClcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBjYWxsYmFja3MgZm9yIG9wdGlvbiBldmVudHMgYW5kIHdhdGNoZXJzLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGhhc2hcbiAqL1xuXG5mdW5jdGlvbiByZWdpc3RlckNhbGxiYWNrcyAodm0sIGFjdGlvbiwgaGFzaCkge1xuICBpZiAoIWhhc2gpIHJldHVyblxuICB2YXIgaGFuZGxlcnMsIGtleSwgaSwgalxuICBmb3IgKGtleSBpbiBoYXNoKSB7XG4gICAgaGFuZGxlcnMgPSBoYXNoW2tleV1cbiAgICBpZiAoXy5pc0FycmF5KGhhbmRsZXJzKSkge1xuICAgICAgZm9yIChpID0gMCwgaiA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICByZWdpc3Rlcih2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXJzW2ldKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdpc3Rlcih2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXJzKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEhlbHBlciB0byByZWdpc3RlciBhbiBldmVudC93YXRjaCBjYWxsYmFjay5cbiAqXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7U3RyaW5nfSBhY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gaGFuZGxlclxuICovXG5cbmZ1bmN0aW9uIHJlZ2lzdGVyICh2bSwgYWN0aW9uLCBrZXksIGhhbmRsZXIpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgaGFuZGxlclxuICBpZiAodHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZtW2FjdGlvbl0oa2V5LCBoYW5kbGVyKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIG1ldGhvZHMgPSB2bS4kb3B0aW9ucy5tZXRob2RzXG4gICAgdmFyIG1ldGhvZCA9IG1ldGhvZHMgJiYgbWV0aG9kc1toYW5kbGVyXVxuICAgIGlmIChtZXRob2QpIHtcbiAgICAgIHZtW2FjdGlvbl0oa2V5LCBtZXRob2QpXG4gICAgfSBlbHNlIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ1Vua25vd24gbWV0aG9kOiBcIicgKyBoYW5kbGVyICsgJ1wiIHdoZW4gJyArXG4gICAgICAgICdyZWdpc3RlcmluZyBjYWxsYmFjayBmb3IgJyArIGFjdGlvbiArXG4gICAgICAgICc6IFwiJyArIGtleSArICdcIi4nXG4gICAgICApXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2V0dXAgcmVjdXJzaXZlIGF0dGFjaGVkL2RldGFjaGVkIGNhbGxzXG4gKi9cblxuZXhwb3J0cy5faW5pdERPTUhvb2tzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLiRvbignaG9vazphdHRhY2hlZCcsIG9uQXR0YWNoZWQpXG4gIHRoaXMuJG9uKCdob29rOmRldGFjaGVkJywgb25EZXRhY2hlZClcbn1cblxuLyoqXG4gKiBDYWxsYmFjayB0byByZWN1cnNpdmVseSBjYWxsIGF0dGFjaGVkIGhvb2sgb24gY2hpbGRyZW5cbiAqL1xuXG5mdW5jdGlvbiBvbkF0dGFjaGVkICgpIHtcbiAgdGhpcy5faXNBdHRhY2hlZCA9IHRydWVcbiAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChjYWxsQXR0YWNoKVxuICBpZiAodGhpcy5fdHJhbnNDcG50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl90cmFuc0NwbnRzLmZvckVhY2goY2FsbEF0dGFjaClcbiAgfVxufVxuXG4vKipcbiAqIEl0ZXJhdG9yIHRvIGNhbGwgYXR0YWNoZWQgaG9va1xuICogXG4gKiBAcGFyYW0ge1Z1ZX0gY2hpbGRcbiAqL1xuXG5mdW5jdGlvbiBjYWxsQXR0YWNoIChjaGlsZCkge1xuICBpZiAoIWNoaWxkLl9pc0F0dGFjaGVkICYmIGluRG9jKGNoaWxkLiRlbCkpIHtcbiAgICBjaGlsZC5fY2FsbEhvb2soJ2F0dGFjaGVkJylcbiAgfVxufVxuXG4vKipcbiAqIENhbGxiYWNrIHRvIHJlY3Vyc2l2ZWx5IGNhbGwgZGV0YWNoZWQgaG9vayBvbiBjaGlsZHJlblxuICovXG5cbmZ1bmN0aW9uIG9uRGV0YWNoZWQgKCkge1xuICB0aGlzLl9pc0F0dGFjaGVkID0gZmFsc2VcbiAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChjYWxsRGV0YWNoKVxuICBpZiAodGhpcy5fdHJhbnNDcG50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl90cmFuc0NwbnRzLmZvckVhY2goY2FsbERldGFjaClcbiAgfVxufVxuXG4vKipcbiAqIEl0ZXJhdG9yIHRvIGNhbGwgZGV0YWNoZWQgaG9va1xuICogXG4gKiBAcGFyYW0ge1Z1ZX0gY2hpbGRcbiAqL1xuXG5mdW5jdGlvbiBjYWxsRGV0YWNoIChjaGlsZCkge1xuICBpZiAoY2hpbGQuX2lzQXR0YWNoZWQgJiYgIWluRG9jKGNoaWxkLiRlbCkpIHtcbiAgICBjaGlsZC5fY2FsbEhvb2soJ2RldGFjaGVkJylcbiAgfVxufVxuXG4vKipcbiAqIFRyaWdnZXIgYWxsIGhhbmRsZXJzIGZvciBhIGhvb2tcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gaG9va1xuICovXG5cbmV4cG9ydHMuX2NhbGxIb29rID0gZnVuY3Rpb24gKGhvb2spIHtcbiAgdmFyIGhhbmRsZXJzID0gdGhpcy4kb3B0aW9uc1tob29rXVxuICBpZiAoaGFuZGxlcnMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGhhbmRsZXJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgaGFuZGxlcnNbaV0uY2FsbCh0aGlzKVxuICAgIH1cbiAgfVxuICB0aGlzLiRlbWl0KCdob29rOicgKyBob29rKVxufSIsInZhciBtZXJnZU9wdGlvbnMgPSByZXF1aXJlKCcuLi91dGlsL21lcmdlLW9wdGlvbicpXG5cbi8qKlxuICogVGhlIG1haW4gaW5pdCBzZXF1ZW5jZS4gVGhpcyBpcyBjYWxsZWQgZm9yIGV2ZXJ5XG4gKiBpbnN0YW5jZSwgaW5jbHVkaW5nIG9uZXMgdGhhdCBhcmUgY3JlYXRlZCBmcm9tIGV4dGVuZGVkXG4gKiBjb25zdHJ1Y3RvcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSB0aGlzIG9wdGlvbnMgb2JqZWN0IHNob3VsZCBiZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcmVzdWx0IG9mIG1lcmdpbmcgY2xhc3NcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyBhbmQgdGhlIG9wdGlvbnMgcGFzc2VkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGluIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAqL1xuXG5leHBvcnRzLl9pbml0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIHRoaXMuJGVsICAgICAgICAgICA9IG51bGxcbiAgdGhpcy4kcGFyZW50ICAgICAgID0gb3B0aW9ucy5fcGFyZW50XG4gIHRoaXMuJHJvb3QgICAgICAgICA9IG9wdGlvbnMuX3Jvb3QgfHwgdGhpc1xuICB0aGlzLiQgICAgICAgICAgICAgPSB7fSAvLyBjaGlsZCB2bSByZWZlcmVuY2VzXG4gIHRoaXMuJCQgICAgICAgICAgICA9IHt9IC8vIGVsZW1lbnQgcmVmZXJlbmNlc1xuICB0aGlzLl93YXRjaGVyTGlzdCAgPSBbXSAvLyBhbGwgd2F0Y2hlcnMgYXMgYW4gYXJyYXlcbiAgdGhpcy5fd2F0Y2hlcnMgICAgID0ge30gLy8gaW50ZXJuYWwgd2F0Y2hlcnMgYXMgYSBoYXNoXG4gIHRoaXMuX3VzZXJXYXRjaGVycyA9IHt9IC8vIHVzZXIgd2F0Y2hlcnMgYXMgYSBoYXNoXG4gIHRoaXMuX2RpcmVjdGl2ZXMgICA9IFtdIC8vIGFsbCBkaXJlY3RpdmVzXG5cbiAgLy8gYSBmbGFnIHRvIGF2b2lkIHRoaXMgYmVpbmcgb2JzZXJ2ZWRcbiAgdGhpcy5faXNWdWUgPSB0cnVlXG5cbiAgLy8gZXZlbnRzIGJvb2trZWVwaW5nXG4gIHRoaXMuX2V2ZW50cyAgICAgICAgID0ge30gICAgLy8gcmVnaXN0ZXJlZCBjYWxsYmFja3NcbiAgdGhpcy5fZXZlbnRzQ291bnQgICAgPSB7fSAgICAvLyBmb3IgJGJyb2FkY2FzdCBvcHRpbWl6YXRpb25cbiAgdGhpcy5fZXZlbnRDYW5jZWxsZWQgPSBmYWxzZSAvLyBmb3IgZXZlbnQgY2FuY2VsbGF0aW9uXG5cbiAgLy8gYmxvY2sgaW5zdGFuY2UgcHJvcGVydGllc1xuICB0aGlzLl9pc0Jsb2NrICAgICA9IGZhbHNlXG4gIHRoaXMuX2Jsb2NrU3RhcnQgID0gICAgICAgICAgLy8gQHR5cGUge0NvbW1lbnROb2RlfVxuICB0aGlzLl9ibG9ja0VuZCAgICA9IG51bGwgICAgIC8vIEB0eXBlIHtDb21tZW50Tm9kZX1cblxuICAvLyBsaWZlY3ljbGUgc3RhdGVcbiAgdGhpcy5faXNDb21waWxlZCAgPVxuICB0aGlzLl9pc0Rlc3Ryb3llZCA9XG4gIHRoaXMuX2lzUmVhZHkgICAgID1cbiAgdGhpcy5faXNBdHRhY2hlZCAgPVxuICB0aGlzLl9pc0JlaW5nRGVzdHJveWVkID0gZmFsc2VcbiAgdGhpcy5fdW5saW5rRm4gICAgPSBudWxsXG5cbiAgLy8gY2hpbGRyZW5cbiAgdGhpcy5fY2hpbGRyZW4gPSBbXVxuICB0aGlzLl9jaGlsZEN0b3JzID0ge31cblxuICAvLyB0cmFuc2NsdWRlZCBjb21wb25lbnRzIHRoYXQgYmVsb25nIHRvIHRoZSBwYXJlbnQuXG4gIC8vIG5lZWQgdG8ga2VlcCB0cmFjayBvZiB0aGVtIHNvIHRoYXQgd2UgY2FuIGNhbGxcbiAgLy8gYXR0YWNoZWQvZGV0YWNoZWQgaG9va3Mgb24gdGhlbS5cbiAgdGhpcy5fdHJhbnNDcG50cyA9IFtdXG4gIHRoaXMuX2hvc3QgPSBvcHRpb25zLl9ob3N0XG5cbiAgLy8gcHVzaCBzZWxmIGludG8gcGFyZW50IC8gdHJhbnNjbHVzaW9uIGhvc3RcbiAgaWYgKHRoaXMuJHBhcmVudCkge1xuICAgIHRoaXMuJHBhcmVudC5fY2hpbGRyZW4ucHVzaCh0aGlzKVxuICB9XG4gIGlmICh0aGlzLl9ob3N0KSB7XG4gICAgdGhpcy5faG9zdC5fdHJhbnNDcG50cy5wdXNoKHRoaXMpXG4gIH1cblxuICAvLyBwcm9wcyB1c2VkIGluIHYtcmVwZWF0IGRpZmZpbmdcbiAgdGhpcy5fbmV3ID0gdHJ1ZVxuICB0aGlzLl9yZXVzZWQgPSBmYWxzZVxuXG4gIC8vIG1lcmdlIG9wdGlvbnMuXG4gIG9wdGlvbnMgPSB0aGlzLiRvcHRpb25zID0gbWVyZ2VPcHRpb25zKFxuICAgIHRoaXMuY29uc3RydWN0b3Iub3B0aW9ucyxcbiAgICBvcHRpb25zLFxuICAgIHRoaXNcbiAgKVxuXG4gIC8vIHNldCBkYXRhIGFmdGVyIG1lcmdlLlxuICB0aGlzLl9kYXRhID0gb3B0aW9ucy5kYXRhIHx8IHt9XG5cbiAgLy8gaW5pdGlhbGl6ZSBkYXRhIG9ic2VydmF0aW9uIGFuZCBzY29wZSBpbmhlcml0YW5jZS5cbiAgdGhpcy5faW5pdFNjb3BlKClcblxuICAvLyBzZXR1cCBldmVudCBzeXN0ZW0gYW5kIG9wdGlvbiBldmVudHMuXG4gIHRoaXMuX2luaXRFdmVudHMoKVxuXG4gIC8vIGNhbGwgY3JlYXRlZCBob29rXG4gIHRoaXMuX2NhbGxIb29rKCdjcmVhdGVkJylcblxuICAvLyBpZiBgZWxgIG9wdGlvbiBpcyBwYXNzZWQsIHN0YXJ0IGNvbXBpbGF0aW9uLlxuICBpZiAob3B0aW9ucy5lbCkge1xuICAgIHRoaXMuJG1vdW50KG9wdGlvbnMuZWwpXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxuXG4vKipcbiAqIEFwcGx5IGEgZmlsdGVyIHRvIGEgbGlzdCBvZiBhcmd1bWVudHMuXG4gKiBUaGlzIGlzIG9ubHkgdXNlZCBpbnRlcm5hbGx5IGluc2lkZSBleHByZXNzaW9ucyB3aXRoXG4gKiBpbmxpbmVkIGZpbHRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlkXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzXG4gKiBAcmV0dXJuIHsqfVxuICovXG5cbmV4cG9ydHMuX2FwcGx5RmlsdGVyID0gZnVuY3Rpb24gKGlkLCBhcmdzKSB7XG4gIHZhciByZWdpc3RyeSA9IHRoaXMuJG9wdGlvbnMuZmlsdGVyc1xuICB2YXIgZmlsdGVyID0gcmVnaXN0cnlbaWRdXG4gIF8uYXNzZXJ0QXNzZXQoZmlsdGVyLCAnZmlsdGVyJywgaWQpXG4gIHJldHVybiAoZmlsdGVyLnJlYWQgfHwgZmlsdGVyKS5hcHBseSh0aGlzLCBhcmdzKVxufVxuXG4vKipcbiAqIFJlc29sdmUgYSBjb21wb25lbnQsIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBjb21wb25lbnRcbiAqIGlzIGRlZmluZWQgbm9ybWFsbHkgb3IgdXNpbmcgYW4gYXN5bmMgZmFjdG9yeSBmdW5jdGlvbi5cbiAqIFJlc29sdmVzIHN5bmNocm9ub3VzbHkgaWYgYWxyZWFkeSByZXNvbHZlZCwgb3RoZXJ3aXNlXG4gKiByZXNvbHZlcyBhc3luY2hyb25vdXNseSBhbmQgY2FjaGVzIHRoZSByZXNvbHZlZFxuICogY29uc3RydWN0b3Igb24gdGhlIGZhY3RvcnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGlkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbmV4cG9ydHMuX3Jlc29sdmVDb21wb25lbnQgPSBmdW5jdGlvbiAoaWQsIGNiKSB7XG4gIHZhciByZWdpc3RyeSA9IHRoaXMuJG9wdGlvbnMuY29tcG9uZW50c1xuICB2YXIgZmFjdG9yeSA9IHJlZ2lzdHJ5W2lkXVxuICBfLmFzc2VydEFzc2V0KGZhY3RvcnksICdjb21wb25lbnQnLCBpZClcbiAgLy8gYXN5bmMgY29tcG9uZW50IGZhY3RvcnlcbiAgaWYgKCFmYWN0b3J5Lm9wdGlvbnMpIHtcbiAgICBpZiAoZmFjdG9yeS5yZXNvbHZlZCkge1xuICAgICAgLy8gY2FjaGVkXG4gICAgICBjYihmYWN0b3J5LnJlc29sdmVkKVxuICAgIH0gZWxzZSBpZiAoZmFjdG9yeS5yZXF1ZXN0ZWQpIHtcbiAgICAgIGZhY3RvcnkucGVuZGluZ0NhbGxiYWNrcy5wdXNoKGNiKVxuICAgIH0gZWxzZSB7XG4gICAgICBmYWN0b3J5LnJlcXVlc3RlZCA9IHRydWVcbiAgICAgIHZhciBjYnMgPSBmYWN0b3J5LnBlbmRpbmdDYWxsYmFja3MgPSBbY2JdXG4gICAgICBmYWN0b3J5KGZ1bmN0aW9uIHJlc29sdmUgKHJlcykge1xuICAgICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KHJlcykpIHtcbiAgICAgICAgICByZXMgPSBfLlZ1ZS5leHRlbmQocmVzKVxuICAgICAgICB9XG4gICAgICAgIC8vIGNhY2hlIHJlc29sdmVkXG4gICAgICAgIGZhY3RvcnkucmVzb2x2ZWQgPSByZXNcbiAgICAgICAgLy8gaW52b2tlIGNhbGxiYWNrc1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBjYnNbaV0ocmVzKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBub3JtYWwgY29tcG9uZW50XG4gICAgY2IoZmFjdG9yeSlcbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgT2JzZXJ2ZXIgPSByZXF1aXJlKCcuLi9vYnNlcnZlcicpXG52YXIgRGVwID0gcmVxdWlyZSgnLi4vb2JzZXJ2ZXIvZGVwJylcblxuLyoqXG4gKiBTZXR1cCB0aGUgc2NvcGUgb2YgYW4gaW5zdGFuY2UsIHdoaWNoIGNvbnRhaW5zOlxuICogLSBvYnNlcnZlZCBkYXRhXG4gKiAtIGNvbXB1dGVkIHByb3BlcnRpZXNcbiAqIC0gdXNlciBtZXRob2RzXG4gKiAtIG1ldGEgcHJvcGVydGllc1xuICovXG5cbmV4cG9ydHMuX2luaXRTY29wZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5faW5pdERhdGEoKVxuICB0aGlzLl9pbml0Q29tcHV0ZWQoKVxuICB0aGlzLl9pbml0TWV0aG9kcygpXG4gIHRoaXMuX2luaXRNZXRhKClcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBkYXRhLiBcbiAqL1xuXG5leHBvcnRzLl9pbml0RGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gcHJveHkgZGF0YSBvbiBpbnN0YW5jZVxuICB2YXIgZGF0YSA9IHRoaXMuX2RhdGFcbiAgdmFyIGksIGtleVxuICAvLyBtYWtlIHN1cmUgYWxsIHByb3BzIHByb3BlcnRpZXMgYXJlIG9ic2VydmVkXG4gIHZhciBwcm9wcyA9IHRoaXMuJG9wdGlvbnMucHJvcHNcbiAgaWYgKHByb3BzKSB7XG4gICAgaSA9IHByb3BzLmxlbmd0aFxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGtleSA9IF8uY2FtZWxpemUocHJvcHNbaV0pXG4gICAgICBpZiAoIShrZXkgaW4gZGF0YSkpIHtcbiAgICAgICAgZGF0YVtrZXldID0gbnVsbFxuICAgICAgfVxuICAgIH1cbiAgfVxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpXG4gIGkgPSBrZXlzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIGlmICghXy5pc1Jlc2VydmVkKGtleSkpIHtcbiAgICAgIHRoaXMuX3Byb3h5KGtleSlcbiAgICB9XG4gIH1cbiAgLy8gb2JzZXJ2ZSBkYXRhXG4gIE9ic2VydmVyLmNyZWF0ZShkYXRhKS5hZGRWbSh0aGlzKVxufVxuXG4vKipcbiAqIFN3YXAgdGhlIGlzbnRhbmNlJ3MgJGRhdGEuIENhbGxlZCBpbiAkZGF0YSdzIHNldHRlci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gbmV3RGF0YVxuICovXG5cbmV4cG9ydHMuX3NldERhdGEgPSBmdW5jdGlvbiAobmV3RGF0YSkge1xuICBuZXdEYXRhID0gbmV3RGF0YSB8fCB7fVxuICB2YXIgb2xkRGF0YSA9IHRoaXMuX2RhdGFcbiAgdGhpcy5fZGF0YSA9IG5ld0RhdGFcbiAgdmFyIGtleXMsIGtleSwgaVxuICAvLyB1bnByb3h5IGtleXMgbm90IHByZXNlbnQgaW4gbmV3IGRhdGFcbiAga2V5cyA9IE9iamVjdC5rZXlzKG9sZERhdGEpXG4gIGkgPSBrZXlzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIGlmICghXy5pc1Jlc2VydmVkKGtleSkgJiYgIShrZXkgaW4gbmV3RGF0YSkpIHtcbiAgICAgIHRoaXMuX3VucHJveHkoa2V5KVxuICAgIH1cbiAgfVxuICAvLyBwcm94eSBrZXlzIG5vdCBhbHJlYWR5IHByb3hpZWQsXG4gIC8vIGFuZCB0cmlnZ2VyIGNoYW5nZSBmb3IgY2hhbmdlZCB2YWx1ZXNcbiAga2V5cyA9IE9iamVjdC5rZXlzKG5ld0RhdGEpXG4gIGkgPSBrZXlzLmxlbmd0aFxuICB3aGlsZSAoaS0tKSB7XG4gICAga2V5ID0ga2V5c1tpXVxuICAgIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmICFfLmlzUmVzZXJ2ZWQoa2V5KSkge1xuICAgICAgLy8gbmV3IHByb3BlcnR5XG4gICAgICB0aGlzLl9wcm94eShrZXkpXG4gICAgfVxuICB9XG4gIG9sZERhdGEuX19vYl9fLnJlbW92ZVZtKHRoaXMpXG4gIE9ic2VydmVyLmNyZWF0ZShuZXdEYXRhKS5hZGRWbSh0aGlzKVxuICB0aGlzLl9kaWdlc3QoKVxufVxuXG4vKipcbiAqIFByb3h5IGEgcHJvcGVydHksIHNvIHRoYXRcbiAqIHZtLnByb3AgPT09IHZtLl9kYXRhLnByb3BcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKi9cblxuZXhwb3J0cy5fcHJveHkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIC8vIG5lZWQgdG8gc3RvcmUgcmVmIHRvIHNlbGYgaGVyZVxuICAvLyBiZWNhdXNlIHRoZXNlIGdldHRlci9zZXR0ZXJzIG1pZ2h0XG4gIC8vIGJlIGNhbGxlZCBieSBjaGlsZCBpbnN0YW5jZXMhXG4gIHZhciBzZWxmID0gdGhpc1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwga2V5LCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBwcm94eUdldHRlciAoKSB7XG4gICAgICByZXR1cm4gc2VsZi5fZGF0YVtrZXldXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHByb3h5U2V0dGVyICh2YWwpIHtcbiAgICAgIHNlbGYuX2RhdGFba2V5XSA9IHZhbFxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBVbnByb3h5IGEgcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICovXG5cbmV4cG9ydHMuX3VucHJveHkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIGRlbGV0ZSB0aGlzW2tleV1cbn1cblxuLyoqXG4gKiBGb3JjZSB1cGRhdGUgb24gZXZlcnkgd2F0Y2hlciBpbiBzY29wZS5cbiAqL1xuXG5leHBvcnRzLl9kaWdlc3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpID0gdGhpcy5fd2F0Y2hlckxpc3QubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB0aGlzLl93YXRjaGVyTGlzdFtpXS51cGRhdGUoKVxuICB9XG4gIHZhciBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuXG4gIGkgPSBjaGlsZHJlbi5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgaWYgKGNoaWxkLiRvcHRpb25zLmluaGVyaXQpIHtcbiAgICAgIGNoaWxkLl9kaWdlc3QoKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNldHVwIGNvbXB1dGVkIHByb3BlcnRpZXMuIFRoZXkgYXJlIGVzc2VudGlhbGx5XG4gKiBzcGVjaWFsIGdldHRlci9zZXR0ZXJzXG4gKi9cblxuZnVuY3Rpb24gbm9vcCAoKSB7fVxuZXhwb3J0cy5faW5pdENvbXB1dGVkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY29tcHV0ZWQgPSB0aGlzLiRvcHRpb25zLmNvbXB1dGVkXG4gIGlmIChjb21wdXRlZCkge1xuICAgIGZvciAodmFyIGtleSBpbiBjb21wdXRlZCkge1xuICAgICAgdmFyIHVzZXJEZWYgPSBjb21wdXRlZFtrZXldXG4gICAgICB2YXIgZGVmID0ge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdXNlckRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkZWYuZ2V0ID0gXy5iaW5kKHVzZXJEZWYsIHRoaXMpXG4gICAgICAgIGRlZi5zZXQgPSBub29wXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWYuZ2V0ID0gdXNlckRlZi5nZXRcbiAgICAgICAgICA/IF8uYmluZCh1c2VyRGVmLmdldCwgdGhpcylcbiAgICAgICAgICA6IG5vb3BcbiAgICAgICAgZGVmLnNldCA9IHVzZXJEZWYuc2V0XG4gICAgICAgICAgPyBfLmJpbmQodXNlckRlZi5zZXQsIHRoaXMpXG4gICAgICAgICAgOiBub29wXG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBkZWYpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2V0dXAgaW5zdGFuY2UgbWV0aG9kcy4gTWV0aG9kcyBtdXN0IGJlIGJvdW5kIHRvIHRoZVxuICogaW5zdGFuY2Ugc2luY2UgdGhleSBtaWdodCBiZSBjYWxsZWQgYnkgY2hpbGRyZW5cbiAqIGluaGVyaXRpbmcgdGhlbS5cbiAqL1xuXG5leHBvcnRzLl9pbml0TWV0aG9kcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1ldGhvZHMgPSB0aGlzLiRvcHRpb25zLm1ldGhvZHNcbiAgaWYgKG1ldGhvZHMpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWV0aG9kcykge1xuICAgICAgdGhpc1trZXldID0gXy5iaW5kKG1ldGhvZHNba2V5XSwgdGhpcylcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBJbml0aWFsaXplIG1ldGEgaW5mb3JtYXRpb24gbGlrZSAkaW5kZXgsICRrZXkgJiAkdmFsdWUuXG4gKi9cblxuZXhwb3J0cy5faW5pdE1ldGEgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtZXRhcyA9IHRoaXMuJG9wdGlvbnMuX21ldGFcbiAgaWYgKG1ldGFzKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG1ldGFzKSB7XG4gICAgICB0aGlzLl9kZWZpbmVNZXRhKGtleSwgbWV0YXNba2V5XSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBtZXRhIHByb3BlcnR5LCBlLmcgJGluZGV4LCAka2V5LCAkdmFsdWVcbiAqIHdoaWNoIG9ubHkgZXhpc3RzIG9uIHRoZSB2bSBpbnN0YW5jZSBidXQgbm90IGluICRkYXRhLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuXG5leHBvcnRzLl9kZWZpbmVNZXRhID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgdmFyIGRlcCA9IG5ldyBEZXAoKVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiBtZXRhR2V0dGVyICgpIHtcbiAgICAgIGlmIChPYnNlcnZlci50YXJnZXQpIHtcbiAgICAgICAgT2JzZXJ2ZXIudGFyZ2V0LmFkZERlcChkZXApXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gbWV0YVNldHRlciAodmFsKSB7XG4gICAgICBpZiAodmFsICE9PSB2YWx1ZSkge1xuICAgICAgICB2YWx1ZSA9IHZhbFxuICAgICAgICBkZXAubm90aWZ5KClcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlXG52YXIgYXJyYXlNZXRob2RzID0gT2JqZWN0LmNyZWF0ZShhcnJheVByb3RvKVxuXG4vKipcbiAqIEludGVyY2VwdCBtdXRhdGluZyBtZXRob2RzIGFuZCBlbWl0IGV2ZW50c1xuICovXG5cbjtbXG4gICdwdXNoJyxcbiAgJ3BvcCcsXG4gICdzaGlmdCcsXG4gICd1bnNoaWZ0JyxcbiAgJ3NwbGljZScsXG4gICdzb3J0JyxcbiAgJ3JldmVyc2UnXG5dXG4uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gIC8vIGNhY2hlIG9yaWdpbmFsIG1ldGhvZFxuICB2YXIgb3JpZ2luYWwgPSBhcnJheVByb3RvW21ldGhvZF1cbiAgXy5kZWZpbmUoYXJyYXlNZXRob2RzLCBtZXRob2QsIGZ1bmN0aW9uIG11dGF0b3IgKCkge1xuICAgIC8vIGF2b2lkIGxlYWtpbmcgYXJndW1lbnRzOlxuICAgIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2Nsb3N1cmUtd2l0aC1hcmd1bWVudHNcbiAgICB2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShpKVxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV1cbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICB2YXIgaW5zZXJ0ZWRcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAncHVzaCc6XG4gICAgICAgIGluc2VydGVkID0gYXJnc1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAndW5zaGlmdCc6XG4gICAgICAgIGluc2VydGVkID0gYXJnc1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnc3BsaWNlJzpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzLnNsaWNlKDIpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIGlmIChpbnNlcnRlZCkgb2Iub2JzZXJ2ZUFycmF5KGluc2VydGVkKVxuICAgIC8vIG5vdGlmeSBjaGFuZ2VcbiAgICBvYi5ub3RpZnkoKVxuICAgIHJldHVybiByZXN1bHRcbiAgfSlcbn0pXG5cbi8qKlxuICogU3dhcCB0aGUgZWxlbWVudCBhdCB0aGUgZ2l2ZW4gaW5kZXggd2l0aCBhIG5ldyB2YWx1ZVxuICogYW5kIGVtaXRzIGNvcnJlc3BvbmRpbmcgZXZlbnQuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4XG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHJldHVybiB7Kn0gLSByZXBsYWNlZCBlbGVtZW50XG4gKi9cblxuXy5kZWZpbmUoXG4gIGFycmF5UHJvdG8sXG4gICckc2V0JyxcbiAgZnVuY3Rpb24gJHNldCAoaW5kZXgsIHZhbCkge1xuICAgIGlmIChpbmRleCA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgdGhpcy5sZW5ndGggPSBpbmRleCArIDFcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAxLCB2YWwpWzBdXG4gIH1cbilcblxuLyoqXG4gKiBDb252ZW5pZW5jZSBtZXRob2QgdG8gcmVtb3ZlIHRoZSBlbGVtZW50IGF0IGdpdmVuIGluZGV4LlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5fLmRlZmluZShcbiAgYXJyYXlQcm90byxcbiAgJyRyZW1vdmUnLFxuICBmdW5jdGlvbiAkcmVtb3ZlIChpbmRleCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdGhpcy5sZW5ndGgpIHJldHVyblxuICAgIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgICBpbmRleCA9IF8uaW5kZXhPZih0aGlzLCBpbmRleClcbiAgICB9XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuc3BsaWNlKGluZGV4LCAxKVxuICAgIH1cbiAgfVxuKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TWV0aG9kcyIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG5cbi8qKlxuICogQSBkZXAgaXMgYW4gb2JzZXJ2YWJsZSB0aGF0IGNhbiBoYXZlIG11bHRpcGxlXG4gKiBkaXJlY3RpdmVzIHN1YnNjcmliaW5nIHRvIGl0LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIERlcCAoKSB7XG4gIHRoaXMuc3VicyA9IFtdXG59XG5cbnZhciBwID0gRGVwLnByb3RvdHlwZVxuXG4vKipcbiAqIEFkZCBhIGRpcmVjdGl2ZSBzdWJzY3JpYmVyLlxuICpcbiAqIEBwYXJhbSB7RGlyZWN0aXZlfSBzdWJcbiAqL1xuXG5wLmFkZFN1YiA9IGZ1bmN0aW9uIChzdWIpIHtcbiAgdGhpcy5zdWJzLnB1c2goc3ViKVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIGRpcmVjdGl2ZSBzdWJzY3JpYmVyLlxuICpcbiAqIEBwYXJhbSB7RGlyZWN0aXZlfSBzdWJcbiAqL1xuXG5wLnJlbW92ZVN1YiA9IGZ1bmN0aW9uIChzdWIpIHtcbiAgdGhpcy5zdWJzLiRyZW1vdmUoc3ViKVxufVxuXG4vKipcbiAqIE5vdGlmeSBhbGwgc3Vic2NyaWJlcnMgb2YgYSBuZXcgdmFsdWUuXG4gKi9cblxucC5ub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIHN0YWJsaXplIHRoZSBzdWJzY3JpYmVyIGxpc3QgZmlyc3RcbiAgdmFyIHN1YnMgPSBfLnRvQXJyYXkodGhpcy5zdWJzKVxuICBmb3IgKHZhciBpID0gMCwgbCA9IHN1YnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgc3Vic1tpXS51cGRhdGUoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVwIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIERlcCA9IHJlcXVpcmUoJy4vZGVwJylcbnZhciBhcnJheU1ldGhvZHMgPSByZXF1aXJlKCcuL2FycmF5JylcbnZhciBhcnJheUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhhcnJheU1ldGhvZHMpXG5yZXF1aXJlKCcuL29iamVjdCcpXG5cbnZhciB1aWQgPSAwXG5cbi8qKlxuICogVHlwZSBlbnVtc1xuICovXG5cbnZhciBBUlJBWSAgPSAwXG52YXIgT0JKRUNUID0gMVxuXG4vKipcbiAqIEF1Z21lbnQgYW4gdGFyZ2V0IE9iamVjdCBvciBBcnJheSBieSBpbnRlcmNlcHRpbmdcbiAqIHRoZSBwcm90b3R5cGUgY2hhaW4gdXNpbmcgX19wcm90b19fXG4gKlxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IHRhcmdldFxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvXG4gKi9cblxuZnVuY3Rpb24gcHJvdG9BdWdtZW50ICh0YXJnZXQsIHNyYykge1xuICB0YXJnZXQuX19wcm90b19fID0gc3JjXG59XG5cbi8qKlxuICogQXVnbWVudCBhbiB0YXJnZXQgT2JqZWN0IG9yIEFycmF5IGJ5IGRlZmluaW5nXG4gKiBoaWRkZW4gcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gdGFyZ2V0XG4gKiBAcGFyYW0ge09iamVjdH0gcHJvdG9cbiAqL1xuXG5mdW5jdGlvbiBjb3B5QXVnbWVudCAodGFyZ2V0LCBzcmMsIGtleXMpIHtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICB2YXIga2V5XG4gIHdoaWxlIChpLS0pIHtcbiAgICBrZXkgPSBrZXlzW2ldXG4gICAgXy5kZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldKVxuICB9XG59XG5cbi8qKlxuICogT2JzZXJ2ZXIgY2xhc3MgdGhhdCBhcmUgYXR0YWNoZWQgdG8gZWFjaCBvYnNlcnZlZFxuICogb2JqZWN0LiBPbmNlIGF0dGFjaGVkLCB0aGUgb2JzZXJ2ZXIgY29udmVydHMgdGFyZ2V0XG4gKiBvYmplY3QncyBwcm9wZXJ0eSBrZXlzIGludG8gZ2V0dGVyL3NldHRlcnMgdGhhdFxuICogY29sbGVjdCBkZXBlbmRlbmNpZXMgYW5kIGRpc3BhdGNoZXMgdXBkYXRlcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gdmFsdWVcbiAqIEBwYXJhbSB7TnVtYmVyfSB0eXBlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG5mdW5jdGlvbiBPYnNlcnZlciAodmFsdWUsIHR5cGUpIHtcbiAgdGhpcy5pZCA9ICsrdWlkXG4gIHRoaXMudmFsdWUgPSB2YWx1ZVxuICB0aGlzLmFjdGl2ZSA9IHRydWVcbiAgdGhpcy5kZXBzID0gW11cbiAgXy5kZWZpbmUodmFsdWUsICdfX29iX18nLCB0aGlzKVxuICBpZiAodHlwZSA9PT0gQVJSQVkpIHtcbiAgICB2YXIgYXVnbWVudCA9IGNvbmZpZy5wcm90byAmJiBfLmhhc1Byb3RvXG4gICAgICA/IHByb3RvQXVnbWVudFxuICAgICAgOiBjb3B5QXVnbWVudFxuICAgIGF1Z21lbnQodmFsdWUsIGFycmF5TWV0aG9kcywgYXJyYXlLZXlzKVxuICAgIHRoaXMub2JzZXJ2ZUFycmF5KHZhbHVlKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09IE9CSkVDVCkge1xuICAgIHRoaXMud2Fsayh2YWx1ZSlcbiAgfVxufVxuXG5PYnNlcnZlci50YXJnZXQgPSBudWxsXG5cbnZhciBwID0gT2JzZXJ2ZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXR0ZW1wdCB0byBjcmVhdGUgYW4gb2JzZXJ2ZXIgaW5zdGFuY2UgZm9yIGEgdmFsdWUsXG4gKiByZXR1cm5zIHRoZSBuZXcgb2JzZXJ2ZXIgaWYgc3VjY2Vzc2Z1bGx5IG9ic2VydmVkLFxuICogb3IgdGhlIGV4aXN0aW5nIG9ic2VydmVyIGlmIHRoZSB2YWx1ZSBhbHJlYWR5IGhhcyBvbmUuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7T2JzZXJ2ZXJ8dW5kZWZpbmVkfVxuICogQHN0YXRpY1xuICovXG5cbk9ic2VydmVyLmNyZWF0ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBpZiAoXG4gICAgdmFsdWUgJiZcbiAgICB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgnX19vYl9fJykgJiZcbiAgICB2YWx1ZS5fX29iX18gaW5zdGFuY2VvZiBPYnNlcnZlclxuICApIHtcbiAgICByZXR1cm4gdmFsdWUuX19vYl9fXG4gIH0gZWxzZSBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2ZXIodmFsdWUsIEFSUkFZKVxuICB9IGVsc2UgaWYgKFxuICAgIF8uaXNQbGFpbk9iamVjdCh2YWx1ZSkgJiZcbiAgICAhdmFsdWUuX2lzVnVlIC8vIGF2b2lkIFZ1ZSBpbnN0YW5jZVxuICApIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmVyKHZhbHVlLCBPQkpFQ1QpXG4gIH1cbn1cblxuLyoqXG4gKiBXYWxrIHRocm91Z2ggZWFjaCBwcm9wZXJ0eSBhbmQgY29udmVydCB0aGVtIGludG9cbiAqIGdldHRlci9zZXR0ZXJzLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSBjYWxsZWQgd2hlblxuICogdmFsdWUgdHlwZSBpcyBPYmplY3QuIFByb3BlcnRpZXMgcHJlZml4ZWQgd2l0aCBgJGAgb3IgYF9gXG4gKiBhbmQgYWNjZXNzb3IgcHJvcGVydGllcyBhcmUgaWdub3JlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKi9cblxucC53YWxrID0gZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iailcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aFxuICB2YXIga2V5LCBwcmVmaXhcbiAgd2hpbGUgKGktLSkge1xuICAgIGtleSA9IGtleXNbaV1cbiAgICBwcmVmaXggPSBrZXkuY2hhckNvZGVBdCgwKVxuICAgIGlmIChwcmVmaXggIT09IDB4MjQgJiYgcHJlZml4ICE9PSAweDVGKSB7IC8vIHNraXAgJCBvciBfXG4gICAgICB0aGlzLmNvbnZlcnQoa2V5LCBvYmpba2V5XSlcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUcnkgdG8gY2FyZXRlIGFuIG9ic2VydmVyIGZvciBhIGNoaWxkIHZhbHVlLFxuICogYW5kIGlmIHZhbHVlIGlzIGFycmF5LCBsaW5rIGRlcCB0byB0aGUgYXJyYXkuXG4gKlxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEByZXR1cm4ge0RlcHx1bmRlZmluZWR9XG4gKi9cblxucC5vYnNlcnZlID0gZnVuY3Rpb24gKHZhbCkge1xuICByZXR1cm4gT2JzZXJ2ZXIuY3JlYXRlKHZhbClcbn1cblxuLyoqXG4gKiBPYnNlcnZlIGEgbGlzdCBvZiBBcnJheSBpdGVtcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBpdGVtc1xuICovXG5cbnAub2JzZXJ2ZUFycmF5ID0gZnVuY3Rpb24gKGl0ZW1zKSB7XG4gIHZhciBpID0gaXRlbXMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB0aGlzLm9ic2VydmUoaXRlbXNbaV0pXG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgcHJvcGVydHkgaW50byBnZXR0ZXIvc2V0dGVyIHNvIHdlIGNhbiBlbWl0XG4gKiB0aGUgZXZlbnRzIHdoZW4gdGhlIHByb3BlcnR5IGlzIGFjY2Vzc2VkL2NoYW5nZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqL1xuXG5wLmNvbnZlcnQgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgdmFyIG9iID0gdGhpc1xuICB2YXIgY2hpbGRPYiA9IG9iLm9ic2VydmUodmFsKVxuICB2YXIgZGVwID0gbmV3IERlcCgpXG4gIGlmIChjaGlsZE9iKSB7XG4gICAgY2hpbGRPYi5kZXBzLnB1c2goZGVwKVxuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYi52YWx1ZSwga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBPYnNlcnZlci50YXJnZXQgaXMgYSB3YXRjaGVyIHdob3NlIGdldHRlciBpc1xuICAgICAgLy8gY3VycmVudGx5IGJlaW5nIGV2YWx1YXRlZC5cbiAgICAgIGlmIChvYi5hY3RpdmUgJiYgT2JzZXJ2ZXIudGFyZ2V0KSB7XG4gICAgICAgIE9ic2VydmVyLnRhcmdldC5hZGREZXAoZGVwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbFxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsKSB7XG4gICAgICBpZiAobmV3VmFsID09PSB2YWwpIHJldHVyblxuICAgICAgLy8gcmVtb3ZlIGRlcCBmcm9tIG9sZCB2YWx1ZVxuICAgICAgdmFyIG9sZENoaWxkT2IgPSB2YWwgJiYgdmFsLl9fb2JfX1xuICAgICAgaWYgKG9sZENoaWxkT2IpIHtcbiAgICAgICAgb2xkQ2hpbGRPYi5kZXBzLiRyZW1vdmUoZGVwKVxuICAgICAgfVxuICAgICAgdmFsID0gbmV3VmFsXG4gICAgICAvLyBhZGQgZGVwIHRvIG5ldyB2YWx1ZVxuICAgICAgdmFyIG5ld0NoaWxkT2IgPSBvYi5vYnNlcnZlKG5ld1ZhbClcbiAgICAgIGlmIChuZXdDaGlsZE9iKSB7XG4gICAgICAgIG5ld0NoaWxkT2IuZGVwcy5wdXNoKGRlcClcbiAgICAgIH1cbiAgICAgIGRlcC5ub3RpZnkoKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBOb3RpZnkgY2hhbmdlIG9uIGFsbCBzZWxmIGRlcHMgb24gYW4gb2JzZXJ2ZXIuXG4gKiBUaGlzIGlzIGNhbGxlZCB3aGVuIGEgbXV0YWJsZSB2YWx1ZSBtdXRhdGVzLiBlLmcuXG4gKiB3aGVuIGFuIEFycmF5J3MgbXV0YXRpbmcgbWV0aG9kcyBhcmUgY2FsbGVkLCBvciBhblxuICogT2JqZWN0J3MgJGFkZC8kZGVsZXRlIGFyZSBjYWxsZWQuXG4gKi9cblxucC5ub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkZXBzID0gdGhpcy5kZXBzXG4gIGZvciAodmFyIGkgPSAwLCBsID0gZGVwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBkZXBzW2ldLm5vdGlmeSgpXG4gIH1cbn1cblxuLyoqXG4gKiBBZGQgYW4gb3duZXIgdm0sIHNvIHRoYXQgd2hlbiAkYWRkLyRkZWxldGUgbXV0YXRpb25zXG4gKiBoYXBwZW4gd2UgY2FuIG5vdGlmeSBvd25lciB2bXMgdG8gcHJveHkgdGhlIGtleXMgYW5kXG4gKiBkaWdlc3QgdGhlIHdhdGNoZXJzLiBUaGlzIGlzIG9ubHkgY2FsbGVkIHdoZW4gdGhlIG9iamVjdFxuICogaXMgb2JzZXJ2ZWQgYXMgYW4gaW5zdGFuY2UncyByb290ICRkYXRhLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbnAuYWRkVm0gPSBmdW5jdGlvbiAodm0pIHtcbiAgKHRoaXMudm1zID0gdGhpcy52bXMgfHwgW10pLnB1c2godm0pXG59XG5cbi8qKlxuICogUmVtb3ZlIGFuIG93bmVyIHZtLiBUaGlzIGlzIGNhbGxlZCB3aGVuIHRoZSBvYmplY3QgaXNcbiAqIHN3YXBwZWQgb3V0IGFzIGFuIGluc3RhbmNlJ3MgJGRhdGEgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbnAucmVtb3ZlVm0gPSBmdW5jdGlvbiAodm0pIHtcbiAgdGhpcy52bXMuJHJlbW92ZSh2bSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlcnZlclxuIiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBvYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGVcblxuLyoqXG4gKiBBZGQgYSBuZXcgcHJvcGVydHkgdG8gYW4gb2JzZXJ2ZWQgb2JqZWN0XG4gKiBhbmQgZW1pdHMgY29ycmVzcG9uZGluZyBldmVudFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7Kn0gdmFsXG4gKiBAcHVibGljXG4gKi9cblxuXy5kZWZpbmUoXG4gIG9ialByb3RvLFxuICAnJGFkZCcsXG4gIGZ1bmN0aW9uICRhZGQgKGtleSwgdmFsKSB7XG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkgcmV0dXJuXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICBpZiAoIW9iIHx8IF8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICB0aGlzW2tleV0gPSB2YWxcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBvYi5jb252ZXJ0KGtleSwgdmFsKVxuICAgIGlmIChvYi52bXMpIHtcbiAgICAgIHZhciBpID0gb2Iudm1zLmxlbmd0aFxuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICB2YXIgdm0gPSBvYi52bXNbaV1cbiAgICAgICAgdm0uX3Byb3h5KGtleSlcbiAgICAgICAgdm0uX2RpZ2VzdCgpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iLm5vdGlmeSgpXG4gICAgfVxuICB9XG4pXG5cbi8qKlxuICogU2V0IGEgcHJvcGVydHkgb24gYW4gb2JzZXJ2ZWQgb2JqZWN0LCBjYWxsaW5nIGFkZCB0b1xuICogZW5zdXJlIHRoZSBwcm9wZXJ0eSBpcyBvYnNlcnZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyp9IHZhbFxuICogQHB1YmxpY1xuICovXG5cbl8uZGVmaW5lKFxuICBvYmpQcm90byxcbiAgJyRzZXQnLFxuICBmdW5jdGlvbiAkc2V0IChrZXksIHZhbCkge1xuICAgIHRoaXMuJGFkZChrZXksIHZhbClcbiAgICB0aGlzW2tleV0gPSB2YWxcbiAgfVxuKVxuXG4vKipcbiAqIERlbGV0ZXMgYSBwcm9wZXJ0eSBmcm9tIGFuIG9ic2VydmVkIG9iamVjdFxuICogYW5kIGVtaXRzIGNvcnJlc3BvbmRpbmcgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcHVibGljXG4gKi9cblxuXy5kZWZpbmUoXG4gIG9ialByb3RvLFxuICAnJGRlbGV0ZScsXG4gIGZ1bmN0aW9uICRkZWxldGUgKGtleSkge1xuICAgIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSByZXR1cm5cbiAgICBkZWxldGUgdGhpc1trZXldXG4gICAgdmFyIG9iID0gdGhpcy5fX29iX19cbiAgICBpZiAoIW9iIHx8IF8uaXNSZXNlcnZlZChrZXkpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKG9iLnZtcykge1xuICAgICAgdmFyIGkgPSBvYi52bXMubGVuZ3RoXG4gICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIHZhciB2bSA9IG9iLnZtc1tpXVxuICAgICAgICB2bS5fdW5wcm94eShrZXkpXG4gICAgICAgIHZtLl9kaWdlc3QoKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvYi5ub3RpZnkoKVxuICAgIH1cbiAgfVxuKSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgY2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbnZhciBhcmdSRSA9IC9eW15cXHtcXD9dKyR8XidbXiddKickfF5cIlteXCJdKlwiJC9cbnZhciBmaWx0ZXJUb2tlblJFID0gL1teXFxzJ1wiXSt8J1teJ10rJ3xcIlteXCJdK1wiL2dcblxuLyoqXG4gKiBQYXJzZXIgc3RhdGVcbiAqL1xuXG52YXIgc3RyXG52YXIgYywgaSwgbFxudmFyIGluU2luZ2xlXG52YXIgaW5Eb3VibGVcbnZhciBjdXJseVxudmFyIHNxdWFyZVxudmFyIHBhcmVuXG52YXIgYmVnaW5cbnZhciBhcmdJbmRleFxudmFyIGRpcnNcbnZhciBkaXJcbnZhciBsYXN0RmlsdGVySW5kZXhcbnZhciBhcmdcblxuLyoqXG4gKiBQdXNoIGEgZGlyZWN0aXZlIG9iamVjdCBpbnRvIHRoZSByZXN1bHQgQXJyYXlcbiAqL1xuXG5mdW5jdGlvbiBwdXNoRGlyICgpIHtcbiAgZGlyLnJhdyA9IHN0ci5zbGljZShiZWdpbiwgaSkudHJpbSgpXG4gIGlmIChkaXIuZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZGlyLmV4cHJlc3Npb24gPSBzdHIuc2xpY2UoYXJnSW5kZXgsIGkpLnRyaW0oKVxuICB9IGVsc2UgaWYgKGxhc3RGaWx0ZXJJbmRleCAhPT0gYmVnaW4pIHtcbiAgICBwdXNoRmlsdGVyKClcbiAgfVxuICBpZiAoaSA9PT0gMCB8fCBkaXIuZXhwcmVzc2lvbikge1xuICAgIGRpcnMucHVzaChkaXIpXG4gIH1cbn1cblxuLyoqXG4gKiBQdXNoIGEgZmlsdGVyIHRvIHRoZSBjdXJyZW50IGRpcmVjdGl2ZSBvYmplY3RcbiAqL1xuXG5mdW5jdGlvbiBwdXNoRmlsdGVyICgpIHtcbiAgdmFyIGV4cCA9IHN0ci5zbGljZShsYXN0RmlsdGVySW5kZXgsIGkpLnRyaW0oKVxuICB2YXIgZmlsdGVyXG4gIGlmIChleHApIHtcbiAgICBmaWx0ZXIgPSB7fVxuICAgIHZhciB0b2tlbnMgPSBleHAubWF0Y2goZmlsdGVyVG9rZW5SRSlcbiAgICBmaWx0ZXIubmFtZSA9IHRva2Vuc1swXVxuICAgIGZpbHRlci5hcmdzID0gdG9rZW5zLmxlbmd0aCA+IDEgPyB0b2tlbnMuc2xpY2UoMSkgOiBudWxsXG4gIH1cbiAgaWYgKGZpbHRlcikge1xuICAgIChkaXIuZmlsdGVycyA9IGRpci5maWx0ZXJzIHx8IFtdKS5wdXNoKGZpbHRlcilcbiAgfVxuICBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxufVxuXG4vKipcbiAqIFBhcnNlIGEgZGlyZWN0aXZlIHN0cmluZyBpbnRvIGFuIEFycmF5IG9mIEFTVC1saWtlXG4gKiBvYmplY3RzIHJlcHJlc2VudGluZyBkaXJlY3RpdmVzLlxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogXCJjbGljazogYSA9IGEgKyAxIHwgdXBwZXJjYXNlXCIgd2lsbCB5aWVsZDpcbiAqIHtcbiAqICAgYXJnOiAnY2xpY2snLFxuICogICBleHByZXNzaW9uOiAnYSA9IGEgKyAxJyxcbiAqICAgZmlsdGVyczogW1xuICogICAgIHsgbmFtZTogJ3VwcGVyY2FzZScsIGFyZ3M6IG51bGwgfVxuICogICBdXG4gKiB9XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7QXJyYXk8T2JqZWN0Pn1cbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKHMpIHtcblxuICB2YXIgaGl0ID0gY2FjaGUuZ2V0KHMpXG4gIGlmIChoaXQpIHtcbiAgICByZXR1cm4gaGl0XG4gIH1cblxuICAvLyByZXNldCBwYXJzZXIgc3RhdGVcbiAgc3RyID0gc1xuICBpblNpbmdsZSA9IGluRG91YmxlID0gZmFsc2VcbiAgY3VybHkgPSBzcXVhcmUgPSBwYXJlbiA9IGJlZ2luID0gYXJnSW5kZXggPSAwXG4gIGxhc3RGaWx0ZXJJbmRleCA9IDBcbiAgZGlycyA9IFtdXG4gIGRpciA9IHt9XG4gIGFyZyA9IG51bGxcblxuICBmb3IgKGkgPSAwLCBsID0gc3RyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChpblNpbmdsZSkge1xuICAgICAgLy8gY2hlY2sgc2luZ2xlIHF1b3RlXG4gICAgICBpZiAoYyA9PT0gMHgyNykgaW5TaW5nbGUgPSAhaW5TaW5nbGVcbiAgICB9IGVsc2UgaWYgKGluRG91YmxlKSB7XG4gICAgICAvLyBjaGVjayBkb3VibGUgcXVvdGVcbiAgICAgIGlmIChjID09PSAweDIyKSBpbkRvdWJsZSA9ICFpbkRvdWJsZVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjID09PSAweDJDICYmIC8vIGNvbW1hXG4gICAgICAhcGFyZW4gJiYgIWN1cmx5ICYmICFzcXVhcmVcbiAgICApIHtcbiAgICAgIC8vIHJlYWNoZWQgdGhlIGVuZCBvZiBhIGRpcmVjdGl2ZVxuICAgICAgcHVzaERpcigpXG4gICAgICAvLyByZXNldCAmIHNraXAgdGhlIGNvbW1hXG4gICAgICBkaXIgPSB7fVxuICAgICAgYmVnaW4gPSBhcmdJbmRleCA9IGxhc3RGaWx0ZXJJbmRleCA9IGkgKyAxXG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGMgPT09IDB4M0EgJiYgLy8gY29sb25cbiAgICAgICFkaXIuZXhwcmVzc2lvbiAmJlxuICAgICAgIWRpci5hcmdcbiAgICApIHtcbiAgICAgIC8vIGFyZ3VtZW50XG4gICAgICBhcmcgPSBzdHIuc2xpY2UoYmVnaW4sIGkpLnRyaW0oKVxuICAgICAgLy8gdGVzdCBmb3IgdmFsaWQgYXJndW1lbnQgaGVyZVxuICAgICAgLy8gc2luY2Ugd2UgbWF5IGhhdmUgY2F1Z2h0IHN0dWZmIGxpa2UgZmlyc3QgaGFsZiBvZlxuICAgICAgLy8gYW4gb2JqZWN0IGxpdGVyYWwgb3IgYSB0ZXJuYXJ5IGV4cHJlc3Npb24uXG4gICAgICBpZiAoYXJnUkUudGVzdChhcmcpKSB7XG4gICAgICAgIGFyZ0luZGV4ID0gaSArIDFcbiAgICAgICAgZGlyLmFyZyA9IF8uc3RyaXBRdW90ZXMoYXJnKSB8fCBhcmdcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgYyA9PT0gMHg3QyAmJiAvLyBwaXBlXG4gICAgICBzdHIuY2hhckNvZGVBdChpICsgMSkgIT09IDB4N0MgJiZcbiAgICAgIHN0ci5jaGFyQ29kZUF0KGkgLSAxKSAhPT0gMHg3Q1xuICAgICkge1xuICAgICAgaWYgKGRpci5leHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gZmlyc3QgZmlsdGVyLCBlbmQgb2YgZXhwcmVzc2lvblxuICAgICAgICBsYXN0RmlsdGVySW5kZXggPSBpICsgMVxuICAgICAgICBkaXIuZXhwcmVzc2lvbiA9IHN0ci5zbGljZShhcmdJbmRleCwgaSkudHJpbSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhbHJlYWR5IGhhcyBmaWx0ZXJcbiAgICAgICAgcHVzaEZpbHRlcigpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAoYykge1xuICAgICAgICBjYXNlIDB4MjI6IGluRG91YmxlID0gdHJ1ZTsgYnJlYWsgLy8gXCJcbiAgICAgICAgY2FzZSAweDI3OiBpblNpbmdsZSA9IHRydWU7IGJyZWFrIC8vICdcbiAgICAgICAgY2FzZSAweDI4OiBwYXJlbisrOyBicmVhayAgICAgICAgIC8vIChcbiAgICAgICAgY2FzZSAweDI5OiBwYXJlbi0tOyBicmVhayAgICAgICAgIC8vIClcbiAgICAgICAgY2FzZSAweDVCOiBzcXVhcmUrKzsgYnJlYWsgICAgICAgIC8vIFtcbiAgICAgICAgY2FzZSAweDVEOiBzcXVhcmUtLTsgYnJlYWsgICAgICAgIC8vIF1cbiAgICAgICAgY2FzZSAweDdCOiBjdXJseSsrOyBicmVhayAgICAgICAgIC8vIHtcbiAgICAgICAgY2FzZSAweDdEOiBjdXJseS0tOyBicmVhayAgICAgICAgIC8vIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaSA9PT0gMCB8fCBiZWdpbiAhPT0gaSkge1xuICAgIHB1c2hEaXIoKVxuICB9XG5cbiAgY2FjaGUucHV0KHMsIGRpcnMpXG4gIHJldHVybiBkaXJzXG59IiwidmFyIF8gPSByZXF1aXJlKCcuLi91dGlsJylcbnZhciBQYXRoID0gcmVxdWlyZSgnLi9wYXRoJylcbnZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciBleHByZXNzaW9uQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcblxudmFyIGFsbG93ZWRLZXl3b3JkcyA9XG4gICdNYXRoLERhdGUsdGhpcyx0cnVlLGZhbHNlLG51bGwsdW5kZWZpbmVkLEluZmluaXR5LE5hTiwnICtcbiAgJ2lzTmFOLGlzRmluaXRlLGRlY29kZVVSSSxkZWNvZGVVUklDb21wb25lbnQsZW5jb2RlVVJJLCcgK1xuICAnZW5jb2RlVVJJQ29tcG9uZW50LHBhcnNlSW50LHBhcnNlRmxvYXQnXG52YXIgYWxsb3dlZEtleXdvcmRzUkUgPVxuICBuZXcgUmVnRXhwKCdeKCcgKyBhbGxvd2VkS2V5d29yZHMucmVwbGFjZSgvLC9nLCAnXFxcXGJ8JykgKyAnXFxcXGIpJylcblxuLy8ga2V5d29yZHMgdGhhdCBkb24ndCBtYWtlIHNlbnNlIGluc2lkZSBleHByZXNzaW9uc1xudmFyIGltcHJvcGVyS2V5d29yZHMgPVxuICAnYnJlYWssY2FzZSxjbGFzcyxjYXRjaCxjb25zdCxjb250aW51ZSxkZWJ1Z2dlcixkZWZhdWx0LCcgK1xuICAnZGVsZXRlLGRvLGVsc2UsZXhwb3J0LGV4dGVuZHMsZmluYWxseSxmb3IsZnVuY3Rpb24saWYsJyArXG4gICdpbXBvcnQsaW4saW5zdGFuY2VvZixsZXQscmV0dXJuLHN1cGVyLHN3aXRjaCx0aHJvdyx0cnksJyArXG4gICd2YXIsd2hpbGUsd2l0aCx5aWVsZCxlbnVtLGF3YWl0LGltcGxlbWVudHMscGFja2FnZSwnICtcbiAgJ3Byb2N0ZWN0ZWQsc3RhdGljLGludGVyZmFjZSxwcml2YXRlLHB1YmxpYydcbnZhciBpbXByb3BlcktleXdvcmRzUkUgPVxuICBuZXcgUmVnRXhwKCdeKCcgKyBpbXByb3BlcktleXdvcmRzLnJlcGxhY2UoLywvZywgJ1xcXFxifCcpICsgJ1xcXFxiKScpXG5cbnZhciB3c1JFID0gL1xccy9nXG52YXIgbmV3bGluZVJFID0gL1xcbi9nXG52YXIgc2F2ZVJFID0gL1tcXHssXVxccypbXFx3XFwkX10rXFxzKjp8KCdbXiddKid8XCJbXlwiXSpcIil8bmV3IHx0eXBlb2YgfHZvaWQgL2dcbnZhciByZXN0b3JlUkUgPSAvXCIoXFxkKylcIi9nXG52YXIgcGF0aFRlc3RSRSA9IC9eW0EtWmEtel8kXVtcXHckXSooXFwuW0EtWmEtel8kXVtcXHckXSp8XFxbJy4qPydcXF18XFxbXCIuKj9cIlxcXXxcXFtcXGQrXFxdKSokL1xudmFyIHBhdGhSZXBsYWNlUkUgPSAvW15cXHckXFwuXShbQS1aYS16XyRdW1xcdyRdKihcXC5bQS1aYS16XyRdW1xcdyRdKnxcXFsnLio/J1xcXXxcXFtcIi4qP1wiXFxdKSopL2dcbnZhciBib29sZWFuTGl0ZXJhbFJFID0gL14odHJ1ZXxmYWxzZSkkL1xuXG4vKipcbiAqIFNhdmUgLyBSZXdyaXRlIC8gUmVzdG9yZVxuICpcbiAqIFdoZW4gcmV3cml0aW5nIHBhdGhzIGZvdW5kIGluIGFuIGV4cHJlc3Npb24sIGl0IGlzXG4gKiBwb3NzaWJsZSBmb3IgdGhlIHNhbWUgbGV0dGVyIHNlcXVlbmNlcyB0byBiZSBmb3VuZCBpblxuICogc3RyaW5ncyBhbmQgT2JqZWN0IGxpdGVyYWwgcHJvcGVydHkga2V5cy4gVGhlcmVmb3JlIHdlXG4gKiByZW1vdmUgYW5kIHN0b3JlIHRoZXNlIHBhcnRzIGluIGEgdGVtcG9yYXJ5IGFycmF5LCBhbmRcbiAqIHJlc3RvcmUgdGhlbSBhZnRlciB0aGUgcGF0aCByZXdyaXRlLlxuICovXG5cbnZhciBzYXZlZCA9IFtdXG5cbi8qKlxuICogU2F2ZSByZXBsYWNlclxuICpcbiAqIFRoZSBzYXZlIHJlZ2V4IGNhbiBtYXRjaCB0d28gcG9zc2libGUgY2FzZXM6XG4gKiAxLiBBbiBvcGVuaW5nIG9iamVjdCBsaXRlcmFsXG4gKiAyLiBBIHN0cmluZ1xuICogSWYgbWF0Y2hlZCBhcyBhIHBsYWluIHN0cmluZywgd2UgbmVlZCB0byBlc2NhcGUgaXRzXG4gKiBuZXdsaW5lcywgc2luY2UgdGhlIHN0cmluZyBuZWVkcyB0byBiZSBwcmVzZXJ2ZWQgd2hlblxuICogZ2VuZXJhdGluZyB0aGUgZnVuY3Rpb24gYm9keS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge1N0cmluZ30gaXNTdHJpbmcgLSBzdHIgaWYgbWF0Y2hlZCBhcyBhIHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSAtIHBsYWNlaG9sZGVyIHdpdGggaW5kZXhcbiAqL1xuXG5mdW5jdGlvbiBzYXZlIChzdHIsIGlzU3RyaW5nKSB7XG4gIHZhciBpID0gc2F2ZWQubGVuZ3RoXG4gIHNhdmVkW2ldID0gaXNTdHJpbmdcbiAgICA/IHN0ci5yZXBsYWNlKG5ld2xpbmVSRSwgJ1xcXFxuJylcbiAgICA6IHN0clxuICByZXR1cm4gJ1wiJyArIGkgKyAnXCInXG59XG5cbi8qKlxuICogUGF0aCByZXdyaXRlIHJlcGxhY2VyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHJhd1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmZ1bmN0aW9uIHJld3JpdGUgKHJhdykge1xuICB2YXIgYyA9IHJhdy5jaGFyQXQoMClcbiAgdmFyIHBhdGggPSByYXcuc2xpY2UoMSlcbiAgaWYgKGFsbG93ZWRLZXl3b3Jkc1JFLnRlc3QocGF0aCkpIHtcbiAgICByZXR1cm4gcmF3XG4gIH0gZWxzZSB7XG4gICAgcGF0aCA9IHBhdGguaW5kZXhPZignXCInKSA+IC0xXG4gICAgICA/IHBhdGgucmVwbGFjZShyZXN0b3JlUkUsIHJlc3RvcmUpXG4gICAgICA6IHBhdGhcbiAgICByZXR1cm4gYyArICdzY29wZS4nICsgcGF0aFxuICB9XG59XG5cbi8qKlxuICogUmVzdG9yZSByZXBsYWNlclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBpIC0gbWF0Y2hlZCBzYXZlIGluZGV4XG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gcmVzdG9yZSAoc3RyLCBpKSB7XG4gIHJldHVybiBzYXZlZFtpXVxufVxuXG4vKipcbiAqIFJld3JpdGUgYW4gZXhwcmVzc2lvbiwgcHJlZml4aW5nIGFsbCBwYXRoIGFjY2Vzc29ycyB3aXRoXG4gKiBgc2NvcGUuYCBhbmQgZ2VuZXJhdGUgZ2V0dGVyL3NldHRlciBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHBhcmFtIHtCb29sZWFufSBuZWVkU2V0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuXG5mdW5jdGlvbiBjb21waWxlRXhwRm5zIChleHAsIG5lZWRTZXQpIHtcbiAgaWYgKGltcHJvcGVyS2V5d29yZHNSRS50ZXN0KGV4cCkpIHtcbiAgICBfLndhcm4oXG4gICAgICAnQXZvaWQgdXNpbmcgcmVzZXJ2ZWQga2V5d29yZHMgaW4gZXhwcmVzc2lvbjogJ1xuICAgICAgKyBleHBcbiAgICApXG4gIH1cbiAgLy8gcmVzZXQgc3RhdGVcbiAgc2F2ZWQubGVuZ3RoID0gMFxuICAvLyBzYXZlIHN0cmluZ3MgYW5kIG9iamVjdCBsaXRlcmFsIGtleXNcbiAgdmFyIGJvZHkgPSBleHBcbiAgICAucmVwbGFjZShzYXZlUkUsIHNhdmUpXG4gICAgLnJlcGxhY2Uod3NSRSwgJycpXG4gIC8vIHJld3JpdGUgYWxsIHBhdGhzXG4gIC8vIHBhZCAxIHNwYWNlIGhlcmUgYmVjYXVlIHRoZSByZWdleCBtYXRjaGVzIDEgZXh0cmEgY2hhclxuICBib2R5ID0gKCcgJyArIGJvZHkpXG4gICAgLnJlcGxhY2UocGF0aFJlcGxhY2VSRSwgcmV3cml0ZSlcbiAgICAucmVwbGFjZShyZXN0b3JlUkUsIHJlc3RvcmUpXG4gIHZhciBnZXR0ZXIgPSBtYWtlR2V0dGVyKGJvZHkpXG4gIGlmIChnZXR0ZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICBib2R5OiBib2R5LFxuICAgICAgc2V0OiBuZWVkU2V0XG4gICAgICAgID8gbWFrZVNldHRlcihib2R5KVxuICAgICAgICA6IG51bGxcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlIGdldHRlciBzZXR0ZXJzIGZvciBhIHNpbXBsZSBwYXRoLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBleHBcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVQYXRoRm5zIChleHApIHtcbiAgdmFyIGdldHRlciwgcGF0aFxuICBpZiAoZXhwLmluZGV4T2YoJ1snKSA8IDApIHtcbiAgICAvLyByZWFsbHkgc2ltcGxlIHBhdGhcbiAgICBwYXRoID0gZXhwLnNwbGl0KCcuJylcbiAgICBnZXR0ZXIgPSBQYXRoLmNvbXBpbGVHZXR0ZXIocGF0aClcbiAgfSBlbHNlIHtcbiAgICAvLyBkbyB0aGUgcmVhbCBwYXJzaW5nXG4gICAgcGF0aCA9IFBhdGgucGFyc2UoZXhwKVxuICAgIGdldHRlciA9IHBhdGguZ2V0XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQ6IGdldHRlcixcbiAgICAvLyBhbHdheXMgZ2VuZXJhdGUgc2V0dGVyIGZvciBzaW1wbGUgcGF0aHNcbiAgICBzZXQ6IGZ1bmN0aW9uIChvYmosIHZhbCkge1xuICAgICAgUGF0aC5zZXQob2JqLCBwYXRoLCB2YWwpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQnVpbGQgYSBnZXR0ZXIgZnVuY3Rpb24uIFJlcXVpcmVzIGV2YWwuXG4gKlxuICogV2UgaXNvbGF0ZSB0aGUgdHJ5L2NhdGNoIHNvIGl0IGRvZXNuJ3QgYWZmZWN0IHRoZVxuICogb3B0aW1pemF0aW9uIG9mIHRoZSBwYXJzZSBmdW5jdGlvbiB3aGVuIGl0IGlzIG5vdCBjYWxsZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGJvZHlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlR2V0dGVyIChib2R5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignc2NvcGUnLCAncmV0dXJuICcgKyBib2R5ICsgJzsnKVxuICB9IGNhdGNoIChlKSB7XG4gICAgXy53YXJuKFxuICAgICAgJ0ludmFsaWQgZXhwcmVzc2lvbi4gJyArXG4gICAgICAnR2VuZXJhdGVkIGZ1bmN0aW9uIGJvZHk6ICcgKyBib2R5XG4gICAgKVxuICB9XG59XG5cbi8qKlxuICogQnVpbGQgYSBzZXR0ZXIgZnVuY3Rpb24uXG4gKlxuICogVGhpcyBpcyBvbmx5IG5lZWRlZCBpbiByYXJlIHNpdHVhdGlvbnMgbGlrZSBcImFbYl1cIiB3aGVyZVxuICogYSBzZXR0YWJsZSBwYXRoIHJlcXVpcmVzIGR5bmFtaWMgZXZhbHVhdGlvbi5cbiAqXG4gKiBUaGlzIHNldHRlciBmdW5jdGlvbiBtYXkgdGhyb3cgZXJyb3Igd2hlbiBjYWxsZWQgaWYgdGhlXG4gKiBleHByZXNzaW9uIGJvZHkgaXMgbm90IGEgdmFsaWQgbGVmdC1oYW5kIGV4cHJlc3Npb24gaW5cbiAqIGFzc2lnbm1lbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGJvZHlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufHVuZGVmaW5lZH1cbiAqL1xuXG5mdW5jdGlvbiBtYWtlU2V0dGVyIChib2R5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignc2NvcGUnLCAndmFsdWUnLCBib2R5ICsgJz12YWx1ZTsnKVxuICB9IGNhdGNoIChlKSB7XG4gICAgXy53YXJuKCdJbnZhbGlkIHNldHRlciBmdW5jdGlvbiBib2R5OiAnICsgYm9keSlcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIGZvciBzZXR0ZXIgZXhpc3RlbmNlIG9uIGEgY2FjaGUgaGl0LlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhpdFxuICovXG5cbmZ1bmN0aW9uIGNoZWNrU2V0dGVyIChoaXQpIHtcbiAgaWYgKCFoaXQuc2V0KSB7XG4gICAgaGl0LnNldCA9IG1ha2VTZXR0ZXIoaGl0LmJvZHkpXG4gIH1cbn1cblxuLyoqXG4gKiBQYXJzZSBhbiBleHByZXNzaW9uIGludG8gcmUtd3JpdHRlbiBnZXR0ZXIvc2V0dGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG5lZWRTZXRcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoZXhwLCBuZWVkU2V0KSB7XG4gIGV4cCA9IGV4cC50cmltKClcbiAgLy8gdHJ5IGNhY2hlXG4gIHZhciBoaXQgPSBleHByZXNzaW9uQ2FjaGUuZ2V0KGV4cClcbiAgaWYgKGhpdCkge1xuICAgIGlmIChuZWVkU2V0KSB7XG4gICAgICBjaGVja1NldHRlcihoaXQpXG4gICAgfVxuICAgIHJldHVybiBoaXRcbiAgfVxuICAvLyB3ZSBkbyBhIHNpbXBsZSBwYXRoIGNoZWNrIHRvIG9wdGltaXplIGZvciB0aGVtLlxuICAvLyB0aGUgY2hlY2sgZmFpbHMgdmFsaWQgcGF0aHMgd2l0aCB1bnVzYWwgd2hpdGVzcGFjZXMsXG4gIC8vIGJ1dCB0aGF0J3MgdG9vIHJhcmUgYW5kIHdlIGRvbid0IGNhcmUuXG4gIC8vIGFsc28gc2tpcCBib29sZWFuIGxpdGVyYWxzIGFuZCBwYXRocyB0aGF0IHN0YXJ0IHdpdGhcbiAgLy8gZ2xvYmFsIFwiTWF0aFwiXG4gIHZhciByZXMgPSBleHBvcnRzLmlzU2ltcGxlUGF0aChleHApXG4gICAgPyBjb21waWxlUGF0aEZucyhleHApXG4gICAgOiBjb21waWxlRXhwRm5zKGV4cCwgbmVlZFNldClcbiAgZXhwcmVzc2lvbkNhY2hlLnB1dChleHAsIHJlcylcbiAgcmV0dXJuIHJlc1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGFuIGV4cHJlc3Npb24gaXMgYSBzaW1wbGUgcGF0aC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXhwXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNTaW1wbGVQYXRoID0gZnVuY3Rpb24gKGV4cCkge1xuICByZXR1cm4gcGF0aFRlc3RSRS50ZXN0KGV4cCkgJiZcbiAgICAvLyBkb24ndCB0cmVhdCB0cnVlL2ZhbHNlIGFzIHBhdGhzXG4gICAgIWJvb2xlYW5MaXRlcmFsUkUudGVzdChleHApICYmXG4gICAgLy8gTWF0aCBjb25zdGFudHMgZS5nLiBNYXRoLlBJLCBNYXRoLkUgZXRjLlxuICAgIGV4cC5zbGljZSgwLCA1KSAhPT0gJ01hdGguJ1xufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgQ2FjaGUgPSByZXF1aXJlKCcuLi9jYWNoZScpXG52YXIgcGF0aENhY2hlID0gbmV3IENhY2hlKDEwMDApXG52YXIgaWRlbnRSRSA9IC9eWyRfYS16QS1aXStbXFx3JF0qJC9cblxuLyoqXG4gKiBQYXRoLXBhcnNpbmcgYWxnb3JpdGhtIHNjb29wZWQgZnJvbSBQb2x5bWVyL29ic2VydmUtanNcbiAqL1xuXG52YXIgcGF0aFN0YXRlTWFjaGluZSA9IHtcbiAgJ2JlZm9yZVBhdGgnOiB7XG4gICAgJ3dzJzogWydiZWZvcmVQYXRoJ10sXG4gICAgJ2lkZW50JzogWydpbklkZW50JywgJ2FwcGVuZCddLFxuICAgICdbJzogWydiZWZvcmVFbGVtZW50J10sXG4gICAgJ2VvZic6IFsnYWZ0ZXJQYXRoJ11cbiAgfSxcblxuICAnaW5QYXRoJzoge1xuICAgICd3cyc6IFsnaW5QYXRoJ10sXG4gICAgJy4nOiBbJ2JlZm9yZUlkZW50J10sXG4gICAgJ1snOiBbJ2JlZm9yZUVsZW1lbnQnXSxcbiAgICAnZW9mJzogWydhZnRlclBhdGgnXVxuICB9LFxuXG4gICdiZWZvcmVJZGVudCc6IHtcbiAgICAnd3MnOiBbJ2JlZm9yZUlkZW50J10sXG4gICAgJ2lkZW50JzogWydpbklkZW50JywgJ2FwcGVuZCddXG4gIH0sXG5cbiAgJ2luSWRlbnQnOiB7XG4gICAgJ2lkZW50JzogWydpbklkZW50JywgJ2FwcGVuZCddLFxuICAgICcwJzogWydpbklkZW50JywgJ2FwcGVuZCddLFxuICAgICdudW1iZXInOiBbJ2luSWRlbnQnLCAnYXBwZW5kJ10sXG4gICAgJ3dzJzogWydpblBhdGgnLCAncHVzaCddLFxuICAgICcuJzogWydiZWZvcmVJZGVudCcsICdwdXNoJ10sXG4gICAgJ1snOiBbJ2JlZm9yZUVsZW1lbnQnLCAncHVzaCddLFxuICAgICdlb2YnOiBbJ2FmdGVyUGF0aCcsICdwdXNoJ11cbiAgfSxcblxuICAnYmVmb3JlRWxlbWVudCc6IHtcbiAgICAnd3MnOiBbJ2JlZm9yZUVsZW1lbnQnXSxcbiAgICAnMCc6IFsnYWZ0ZXJaZXJvJywgJ2FwcGVuZCddLFxuICAgICdudW1iZXInOiBbJ2luSW5kZXgnLCAnYXBwZW5kJ10sXG4gICAgXCInXCI6IFsnaW5TaW5nbGVRdW90ZScsICdhcHBlbmQnLCAnJ10sXG4gICAgJ1wiJzogWydpbkRvdWJsZVF1b3RlJywgJ2FwcGVuZCcsICcnXVxuICB9LFxuXG4gICdhZnRlclplcm8nOiB7XG4gICAgJ3dzJzogWydhZnRlckVsZW1lbnQnLCAncHVzaCddLFxuICAgICddJzogWydpblBhdGgnLCAncHVzaCddXG4gIH0sXG5cbiAgJ2luSW5kZXgnOiB7XG4gICAgJzAnOiBbJ2luSW5kZXgnLCAnYXBwZW5kJ10sXG4gICAgJ251bWJlcic6IFsnaW5JbmRleCcsICdhcHBlbmQnXSxcbiAgICAnd3MnOiBbJ2FmdGVyRWxlbWVudCddLFxuICAgICddJzogWydpblBhdGgnLCAncHVzaCddXG4gIH0sXG5cbiAgJ2luU2luZ2xlUXVvdGUnOiB7XG4gICAgXCInXCI6IFsnYWZ0ZXJFbGVtZW50J10sXG4gICAgJ2VvZic6ICdlcnJvcicsXG4gICAgJ2Vsc2UnOiBbJ2luU2luZ2xlUXVvdGUnLCAnYXBwZW5kJ11cbiAgfSxcblxuICAnaW5Eb3VibGVRdW90ZSc6IHtcbiAgICAnXCInOiBbJ2FmdGVyRWxlbWVudCddLFxuICAgICdlb2YnOiAnZXJyb3InLFxuICAgICdlbHNlJzogWydpbkRvdWJsZVF1b3RlJywgJ2FwcGVuZCddXG4gIH0sXG5cbiAgJ2FmdGVyRWxlbWVudCc6IHtcbiAgICAnd3MnOiBbJ2FmdGVyRWxlbWVudCddLFxuICAgICddJzogWydpblBhdGgnLCAncHVzaCddXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9vcCAoKSB7fVxuXG4vKipcbiAqIERldGVybWluZSB0aGUgdHlwZSBvZiBhIGNoYXJhY3RlciBpbiBhIGtleXBhdGguXG4gKlxuICogQHBhcmFtIHtDaGFyfSBjaGFyXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHR5cGVcbiAqL1xuXG5mdW5jdGlvbiBnZXRQYXRoQ2hhclR5cGUgKGNoYXIpIHtcbiAgaWYgKGNoYXIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiAnZW9mJ1xuICB9XG5cbiAgdmFyIGNvZGUgPSBjaGFyLmNoYXJDb2RlQXQoMClcblxuICBzd2l0Y2goY29kZSkge1xuICAgIGNhc2UgMHg1QjogLy8gW1xuICAgIGNhc2UgMHg1RDogLy8gXVxuICAgIGNhc2UgMHgyRTogLy8gLlxuICAgIGNhc2UgMHgyMjogLy8gXCJcbiAgICBjYXNlIDB4Mjc6IC8vICdcbiAgICBjYXNlIDB4MzA6IC8vIDBcbiAgICAgIHJldHVybiBjaGFyXG5cbiAgICBjYXNlIDB4NUY6IC8vIF9cbiAgICBjYXNlIDB4MjQ6IC8vICRcbiAgICAgIHJldHVybiAnaWRlbnQnXG5cbiAgICBjYXNlIDB4MjA6IC8vIFNwYWNlXG4gICAgY2FzZSAweDA5OiAvLyBUYWJcbiAgICBjYXNlIDB4MEE6IC8vIE5ld2xpbmVcbiAgICBjYXNlIDB4MEQ6IC8vIFJldHVyblxuICAgIGNhc2UgMHhBMDogIC8vIE5vLWJyZWFrIHNwYWNlXG4gICAgY2FzZSAweEZFRkY6ICAvLyBCeXRlIE9yZGVyIE1hcmtcbiAgICBjYXNlIDB4MjAyODogIC8vIExpbmUgU2VwYXJhdG9yXG4gICAgY2FzZSAweDIwMjk6ICAvLyBQYXJhZ3JhcGggU2VwYXJhdG9yXG4gICAgICByZXR1cm4gJ3dzJ1xuICB9XG5cbiAgLy8gYS16LCBBLVpcbiAgaWYgKCgweDYxIDw9IGNvZGUgJiYgY29kZSA8PSAweDdBKSB8fFxuICAgICAgKDB4NDEgPD0gY29kZSAmJiBjb2RlIDw9IDB4NUEpKSB7XG4gICAgcmV0dXJuICdpZGVudCdcbiAgfVxuXG4gIC8vIDEtOVxuICBpZiAoMHgzMSA8PSBjb2RlICYmIGNvZGUgPD0gMHgzOSkge1xuICAgIHJldHVybiAnbnVtYmVyJ1xuICB9XG5cbiAgcmV0dXJuICdlbHNlJ1xufVxuXG4vKipcbiAqIFBhcnNlIGEgc3RyaW5nIHBhdGggaW50byBhbiBhcnJheSBvZiBzZWdtZW50c1xuICogVG9kbyBpbXBsZW1lbnQgY2FjaGVcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHJldHVybiB7QXJyYXl8dW5kZWZpbmVkfVxuICovXG5cbmZ1bmN0aW9uIHBhcnNlUGF0aCAocGF0aCkge1xuICB2YXIga2V5cyA9IFtdXG4gIHZhciBpbmRleCA9IC0xXG4gIHZhciBtb2RlID0gJ2JlZm9yZVBhdGgnXG4gIHZhciBjLCBuZXdDaGFyLCBrZXksIHR5cGUsIHRyYW5zaXRpb24sIGFjdGlvbiwgdHlwZU1hcFxuXG4gIHZhciBhY3Rpb25zID0ge1xuICAgIHB1c2g6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAga2V5cy5wdXNoKGtleSlcbiAgICAgIGtleSA9IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgYXBwZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXkgPSBuZXdDaGFyXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBrZXkgKz0gbmV3Q2hhclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1heWJlVW5lc2NhcGVRdW90ZSAoKSB7XG4gICAgdmFyIG5leHRDaGFyID0gcGF0aFtpbmRleCArIDFdXG4gICAgaWYgKChtb2RlID09PSAnaW5TaW5nbGVRdW90ZScgJiYgbmV4dENoYXIgPT09IFwiJ1wiKSB8fFxuICAgICAgICAobW9kZSA9PT0gJ2luRG91YmxlUXVvdGUnICYmIG5leHRDaGFyID09PSAnXCInKSkge1xuICAgICAgaW5kZXgrK1xuICAgICAgbmV3Q2hhciA9IG5leHRDaGFyXG4gICAgICBhY3Rpb25zLmFwcGVuZCgpXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHdoaWxlIChtb2RlKSB7XG4gICAgaW5kZXgrK1xuICAgIGMgPSBwYXRoW2luZGV4XVxuXG4gICAgaWYgKGMgPT09ICdcXFxcJyAmJiBtYXliZVVuZXNjYXBlUXVvdGUoKSkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICB0eXBlID0gZ2V0UGF0aENoYXJUeXBlKGMpXG4gICAgdHlwZU1hcCA9IHBhdGhTdGF0ZU1hY2hpbmVbbW9kZV1cbiAgICB0cmFuc2l0aW9uID0gdHlwZU1hcFt0eXBlXSB8fCB0eXBlTWFwWydlbHNlJ10gfHwgJ2Vycm9yJ1xuXG4gICAgaWYgKHRyYW5zaXRpb24gPT09ICdlcnJvcicpIHtcbiAgICAgIHJldHVybiAvLyBwYXJzZSBlcnJvclxuICAgIH1cblxuICAgIG1vZGUgPSB0cmFuc2l0aW9uWzBdXG4gICAgYWN0aW9uID0gYWN0aW9uc1t0cmFuc2l0aW9uWzFdXSB8fCBub29wXG4gICAgbmV3Q2hhciA9IHRyYW5zaXRpb25bMl0gPT09IHVuZGVmaW5lZFxuICAgICAgPyBjXG4gICAgICA6IHRyYW5zaXRpb25bMl1cbiAgICBhY3Rpb24oKVxuXG4gICAgaWYgKG1vZGUgPT09ICdhZnRlclBhdGgnKSB7XG4gICAgICByZXR1cm4ga2V5c1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEZvcm1hdCBhIGFjY2Vzc29yIHNlZ21lbnQgYmFzZWQgb24gaXRzIHR5cGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBY2Nlc3NvcihrZXkpIHtcbiAgaWYgKGlkZW50UkUudGVzdChrZXkpKSB7IC8vIGlkZW50aWZpZXJcbiAgICByZXR1cm4gJy4nICsga2V5XG4gIH0gZWxzZSBpZiAoK2tleSA9PT0ga2V5ID4+PiAwKSB7IC8vIGJyYWNrZXQgaW5kZXhcbiAgICByZXR1cm4gJ1snICsga2V5ICsgJ10nXG4gIH0gZWxzZSB7IC8vIGJyYWNrZXQgc3RyaW5nXG4gICAgcmV0dXJuICdbXCInICsga2V5LnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIl0nXG4gIH1cbn1cblxuLyoqXG4gKiBDb21waWxlcyBhIGdldHRlciBmdW5jdGlvbiB3aXRoIGEgZml4ZWQgcGF0aC5cbiAqIFRoZSBmaXhlZCBwYXRoIGdldHRlciBzdXByZXNzZXMgZXJyb3JzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHBhdGhcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5cbmV4cG9ydHMuY29tcGlsZUdldHRlciA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gIHZhciBib2R5ID0gJ3JldHVybiBvJyArIHBhdGgubWFwKGZvcm1hdEFjY2Vzc29yKS5qb2luKCcnKVxuICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdvJywgJ3RyeSB7JyArIGJvZHkgKyAnfSBjYXRjaCAoZSkge30nKVxufVxuXG4vKipcbiAqIEV4dGVybmFsIHBhcnNlIHRoYXQgY2hlY2sgZm9yIGEgY2FjaGUgaGl0IGZpcnN0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEByZXR1cm4ge0FycmF5fHVuZGVmaW5lZH1cbiAqL1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgdmFyIGhpdCA9IHBhdGhDYWNoZS5nZXQocGF0aClcbiAgaWYgKCFoaXQpIHtcbiAgICBoaXQgPSBwYXJzZVBhdGgocGF0aClcbiAgICBpZiAoaGl0KSB7XG4gICAgICBoaXQuZ2V0ID0gZXhwb3J0cy5jb21waWxlR2V0dGVyKGhpdClcbiAgICAgIHBhdGhDYWNoZS5wdXQocGF0aCwgaGl0KVxuICAgIH1cbiAgfVxuICByZXR1cm4gaGl0XG59XG5cbi8qKlxuICogR2V0IGZyb20gYW4gb2JqZWN0IGZyb20gYSBwYXRoIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKi9cblxuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiAob2JqLCBwYXRoKSB7XG4gIHBhdGggPSBleHBvcnRzLnBhcnNlKHBhdGgpXG4gIGlmIChwYXRoKSB7XG4gICAgcmV0dXJuIHBhdGguZ2V0KG9iailcbiAgfVxufVxuXG4vKipcbiAqIFNldCBvbiBhbiBvYmplY3QgZnJvbSBhIHBhdGhcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge1N0cmluZyB8IEFycmF5fSBwYXRoXG4gKiBAcGFyYW0geyp9IHZhbFxuICovXG5cbmV4cG9ydHMuc2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgdmFsKSB7XG4gIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICBwYXRoID0gZXhwb3J0cy5wYXJzZShwYXRoKVxuICB9XG4gIGlmICghcGF0aCB8fCAhXy5pc09iamVjdChvYmopKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgdmFyIGxhc3QsIGtleVxuICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGgubGVuZ3RoIC0gMTsgaSA8IGw7IGkrKykge1xuICAgIGxhc3QgPSBvYmpcbiAgICBrZXkgPSBwYXRoW2ldXG4gICAgb2JqID0gb2JqW2tleV1cbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkge1xuICAgICAgb2JqID0ge31cbiAgICAgIGxhc3QuJGFkZChrZXksIG9iailcbiAgICB9XG4gIH1cbiAga2V5ID0gcGF0aFtpXVxuICBpZiAoa2V5IGluIG9iaikge1xuICAgIG9ialtrZXldID0gdmFsXG4gIH0gZWxzZSB7XG4gICAgb2JqLiRhZGQoa2V5LCB2YWwpXG4gIH1cbiAgcmV0dXJuIHRydWVcbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIENhY2hlID0gcmVxdWlyZSgnLi4vY2FjaGUnKVxudmFyIHRlbXBsYXRlQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcbnZhciBpZFNlbGVjdG9yQ2FjaGUgPSBuZXcgQ2FjaGUoMTAwMClcblxudmFyIG1hcCA9IHtcbiAgX2RlZmF1bHQgOiBbMCwgJycsICcnXSxcbiAgbGVnZW5kICAgOiBbMSwgJzxmaWVsZHNldD4nLCAnPC9maWVsZHNldD4nXSxcbiAgdHIgICAgICAgOiBbMiwgJzx0YWJsZT48dGJvZHk+JywgJzwvdGJvZHk+PC90YWJsZT4nXSxcbiAgY29sICAgICAgOiBbXG4gICAgMixcbiAgICAnPHRhYmxlPjx0Ym9keT48L3Rib2R5Pjxjb2xncm91cD4nLFxuICAgICc8L2NvbGdyb3VwPjwvdGFibGU+J1xuICBdXG59XG5cbm1hcC50ZCA9XG5tYXAudGggPSBbXG4gIDMsXG4gICc8dGFibGU+PHRib2R5Pjx0cj4nLFxuICAnPC90cj48L3Rib2R5PjwvdGFibGU+J1xuXVxuXG5tYXAub3B0aW9uID1cbm1hcC5vcHRncm91cCA9IFtcbiAgMSxcbiAgJzxzZWxlY3QgbXVsdGlwbGU9XCJtdWx0aXBsZVwiPicsXG4gICc8L3NlbGVjdD4nXG5dXG5cbm1hcC50aGVhZCA9XG5tYXAudGJvZHkgPVxubWFwLmNvbGdyb3VwID1cbm1hcC5jYXB0aW9uID1cbm1hcC50Zm9vdCA9IFsxLCAnPHRhYmxlPicsICc8L3RhYmxlPiddXG5cbm1hcC5nID1cbm1hcC5kZWZzID1cbm1hcC5zeW1ib2wgPVxubWFwLnVzZSA9XG5tYXAuaW1hZ2UgPVxubWFwLnRleHQgPVxubWFwLmNpcmNsZSA9XG5tYXAuZWxsaXBzZSA9XG5tYXAubGluZSA9XG5tYXAucGF0aCA9XG5tYXAucG9seWdvbiA9XG5tYXAucG9seWxpbmUgPVxubWFwLnJlY3QgPSBbXG4gIDEsXG4gICc8c3ZnICcgK1xuICAgICd4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgJyArXG4gICAgJ3htbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiICcgK1xuICAgICd4bWxuczpldj1cImh0dHA6Ly93d3cudzMub3JnLzIwMDEveG1sLWV2ZW50c1wiJyArXG4gICAgJ3ZlcnNpb249XCIxLjFcIj4nLFxuICAnPC9zdmc+J1xuXVxuXG52YXIgdGFnUkUgPSAvPChbXFx3Ol0rKS9cbnZhciBlbnRpdHlSRSA9IC8mXFx3KzsvXG5cbi8qKlxuICogQ29udmVydCBhIHN0cmluZyB0ZW1wbGF0ZSB0byBhIERvY3VtZW50RnJhZ21lbnQuXG4gKiBEZXRlcm1pbmVzIGNvcnJlY3Qgd3JhcHBpbmcgYnkgdGFnIHR5cGVzLiBXcmFwcGluZ1xuICogc3RyYXRlZ3kgZm91bmQgaW4galF1ZXJ5ICYgY29tcG9uZW50L2RvbWlmeS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGVtcGxhdGVTdHJpbmdcbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZnVuY3Rpb24gc3RyaW5nVG9GcmFnbWVudCAodGVtcGxhdGVTdHJpbmcpIHtcbiAgLy8gdHJ5IGEgY2FjaGUgaGl0IGZpcnN0XG4gIHZhciBoaXQgPSB0ZW1wbGF0ZUNhY2hlLmdldCh0ZW1wbGF0ZVN0cmluZylcbiAgaWYgKGhpdCkge1xuICAgIHJldHVybiBoaXRcbiAgfVxuXG4gIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gIHZhciB0YWdNYXRjaCA9IHRlbXBsYXRlU3RyaW5nLm1hdGNoKHRhZ1JFKVxuICB2YXIgZW50aXR5TWF0Y2ggPSBlbnRpdHlSRS50ZXN0KHRlbXBsYXRlU3RyaW5nKVxuXG4gIGlmICghdGFnTWF0Y2ggJiYgIWVudGl0eU1hdGNoKSB7XG4gICAgLy8gdGV4dCBvbmx5LCByZXR1cm4gYSBzaW5nbGUgdGV4dCBub2RlLlxuICAgIGZyYWcuYXBwZW5kQ2hpbGQoXG4gICAgICBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZW1wbGF0ZVN0cmluZylcbiAgICApXG4gIH0gZWxzZSB7XG5cbiAgICB2YXIgdGFnICAgID0gdGFnTWF0Y2ggJiYgdGFnTWF0Y2hbMV1cbiAgICB2YXIgd3JhcCAgID0gbWFwW3RhZ10gfHwgbWFwLl9kZWZhdWx0XG4gICAgdmFyIGRlcHRoICA9IHdyYXBbMF1cbiAgICB2YXIgcHJlZml4ID0gd3JhcFsxXVxuICAgIHZhciBzdWZmaXggPSB3cmFwWzJdXG4gICAgdmFyIG5vZGUgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgICBub2RlLmlubmVySFRNTCA9IHByZWZpeCArIHRlbXBsYXRlU3RyaW5nLnRyaW0oKSArIHN1ZmZpeFxuICAgIHdoaWxlIChkZXB0aC0tKSB7XG4gICAgICBub2RlID0gbm9kZS5sYXN0Q2hpbGRcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRcbiAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gICAgd2hpbGUgKGNoaWxkID0gbm9kZS5maXJzdENoaWxkKSB7XG4gICAgICBmcmFnLmFwcGVuZENoaWxkKGNoaWxkKVxuICAgIH1cbiAgfVxuXG4gIHRlbXBsYXRlQ2FjaGUucHV0KHRlbXBsYXRlU3RyaW5nLCBmcmFnKVxuICByZXR1cm4gZnJhZ1xufVxuXG4vKipcbiAqIENvbnZlcnQgYSB0ZW1wbGF0ZSBub2RlIHRvIGEgRG9jdW1lbnRGcmFnbWVudC5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZnVuY3Rpb24gbm9kZVRvRnJhZ21lbnQgKG5vZGUpIHtcbiAgdmFyIHRhZyA9IG5vZGUudGFnTmFtZVxuICAvLyBpZiBpdHMgYSB0ZW1wbGF0ZSB0YWcgYW5kIHRoZSBicm93c2VyIHN1cHBvcnRzIGl0LFxuICAvLyBpdHMgY29udGVudCBpcyBhbHJlYWR5IGEgZG9jdW1lbnQgZnJhZ21lbnQuXG4gIGlmIChcbiAgICB0YWcgPT09ICdURU1QTEFURScgJiZcbiAgICBub2RlLmNvbnRlbnQgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50XG4gICkge1xuICAgIHJldHVybiBub2RlLmNvbnRlbnRcbiAgfVxuICAvLyBzY3JpcHQgdGVtcGxhdGVcbiAgaWYgKHRhZyA9PT0gJ1NDUklQVCcpIHtcbiAgICByZXR1cm4gc3RyaW5nVG9GcmFnbWVudChub2RlLnRleHRDb250ZW50KVxuICB9XG4gIC8vIG5vcm1hbCBub2RlLCBjbG9uZSBpdCB0byBhdm9pZCBtdXRhdGluZyB0aGUgb3JpZ2luYWxcbiAgdmFyIGNsb25lID0gZXhwb3J0cy5jbG9uZShub2RlKVxuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICB2YXIgY2hpbGRcbiAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICB3aGlsZSAoY2hpbGQgPSBjbG9uZS5maXJzdENoaWxkKSB7XG4gICAgZnJhZy5hcHBlbmRDaGlsZChjaGlsZClcbiAgfVxuICByZXR1cm4gZnJhZ1xufVxuXG4vLyBUZXN0IGZvciB0aGUgcHJlc2VuY2Ugb2YgdGhlIFNhZmFyaSB0ZW1wbGF0ZSBjbG9uaW5nIGJ1Z1xuLy8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEzNzc1NVxudmFyIGhhc0Jyb2tlblRlbXBsYXRlID0gXy5pbkJyb3dzZXJcbiAgPyAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgYS5pbm5lckhUTUwgPSAnPHRlbXBsYXRlPjE8L3RlbXBsYXRlPidcbiAgICAgIHJldHVybiAhYS5jbG9uZU5vZGUodHJ1ZSkuZmlyc3RDaGlsZC5pbm5lckhUTUxcbiAgICB9KSgpXG4gIDogZmFsc2VcblxuLy8gVGVzdCBmb3IgSUUxMC8xMSB0ZXh0YXJlYSBwbGFjZWhvbGRlciBjbG9uZSBidWdcbnZhciBoYXNUZXh0YXJlYUNsb25lQnVnID0gXy5pbkJyb3dzZXJcbiAgPyAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgICB0LnBsYWNlaG9sZGVyID0gJ3QnXG4gICAgICByZXR1cm4gdC5jbG9uZU5vZGUodHJ1ZSkudmFsdWUgPT09ICd0J1xuICAgIH0pKClcbiAgOiBmYWxzZVxuXG4vKipcbiAqIDEuIERlYWwgd2l0aCBTYWZhcmkgY2xvbmluZyBuZXN0ZWQgPHRlbXBsYXRlPiBidWcgYnlcbiAqICAgIG1hbnVhbGx5IGNsb25pbmcgYWxsIHRlbXBsYXRlIGluc3RhbmNlcy5cbiAqIDIuIERlYWwgd2l0aCBJRTEwLzExIHRleHRhcmVhIHBsYWNlaG9sZGVyIGJ1ZyBieSBzZXR0aW5nXG4gKiAgICB0aGUgY29ycmVjdCB2YWx1ZSBhZnRlciBjbG9uaW5nLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxEb2N1bWVudEZyYWdtZW50fSBub2RlXG4gKiBAcmV0dXJuIHtFbGVtZW50fERvY3VtZW50RnJhZ21lbnR9XG4gKi9cblxuZXhwb3J0cy5jbG9uZSA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIHZhciByZXMgPSBub2RlLmNsb25lTm9kZSh0cnVlKVxuICB2YXIgaSwgb3JpZ2luYWwsIGNsb25lZFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGhhc0Jyb2tlblRlbXBsYXRlKSB7XG4gICAgb3JpZ2luYWwgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3RlbXBsYXRlJylcbiAgICBpZiAob3JpZ2luYWwubGVuZ3RoKSB7XG4gICAgICBjbG9uZWQgPSByZXMucXVlcnlTZWxlY3RvckFsbCgndGVtcGxhdGUnKVxuICAgICAgaSA9IGNsb25lZC5sZW5ndGhcbiAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgY2xvbmVkW2ldLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKFxuICAgICAgICAgIG9yaWdpbmFsW2ldLmNsb25lTm9kZSh0cnVlKSxcbiAgICAgICAgICBjbG9uZWRbaV1cbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKGhhc1RleHRhcmVhQ2xvbmVCdWcpIHtcbiAgICBpZiAobm9kZS50YWdOYW1lID09PSAnVEVYVEFSRUEnKSB7XG4gICAgICByZXMudmFsdWUgPSBub2RlLnZhbHVlXG4gICAgfSBlbHNlIHtcbiAgICAgIG9yaWdpbmFsID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpXG4gICAgICBpZiAob3JpZ2luYWwubGVuZ3RoKSB7XG4gICAgICAgIGNsb25lZCA9IHJlcy5xdWVyeVNlbGVjdG9yQWxsKCd0ZXh0YXJlYScpXG4gICAgICAgIGkgPSBjbG9uZWQubGVuZ3RoXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICBjbG9uZWRbaV0udmFsdWUgPSBvcmlnaW5hbFtpXS52YWx1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBQcm9jZXNzIHRoZSB0ZW1wbGF0ZSBvcHRpb24gYW5kIG5vcm1hbGl6ZXMgaXQgaW50byBhXG4gKiBhIERvY3VtZW50RnJhZ21lbnQgdGhhdCBjYW4gYmUgdXNlZCBhcyBhIHBhcnRpYWwgb3IgYVxuICogaW5zdGFuY2UgdGVtcGxhdGUuXG4gKlxuICogQHBhcmFtIHsqfSB0ZW1wbGF0ZVxuICogICAgUG9zc2libGUgdmFsdWVzIGluY2x1ZGU6XG4gKiAgICAtIERvY3VtZW50RnJhZ21lbnQgb2JqZWN0XG4gKiAgICAtIE5vZGUgb2JqZWN0IG9mIHR5cGUgVGVtcGxhdGVcbiAqICAgIC0gaWQgc2VsZWN0b3I6ICcjc29tZS10ZW1wbGF0ZS1pZCdcbiAqICAgIC0gdGVtcGxhdGUgc3RyaW5nOiAnPGRpdj48c3Bhbj57e21zZ319PC9zcGFuPjwvZGl2PidcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2xvbmVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gbm9TZWxlY3RvclxuICogQHJldHVybiB7RG9jdW1lbnRGcmFnbWVudHx1bmRlZmluZWR9XG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgY2xvbmUsIG5vU2VsZWN0b3IpIHtcbiAgdmFyIG5vZGUsIGZyYWdcblxuICAvLyBpZiB0aGUgdGVtcGxhdGUgaXMgYWxyZWFkeSBhIGRvY3VtZW50IGZyYWdtZW50LFxuICAvLyBkbyBub3RoaW5nXG4gIGlmICh0ZW1wbGF0ZSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICByZXR1cm4gY2xvbmVcbiAgICAgID8gdGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpXG4gICAgICA6IHRlbXBsYXRlXG4gIH1cblxuICBpZiAodHlwZW9mIHRlbXBsYXRlID09PSAnc3RyaW5nJykge1xuICAgIC8vIGlkIHNlbGVjdG9yXG4gICAgaWYgKCFub1NlbGVjdG9yICYmIHRlbXBsYXRlLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAvLyBpZCBzZWxlY3RvciBjYW4gYmUgY2FjaGVkIHRvb1xuICAgICAgZnJhZyA9IGlkU2VsZWN0b3JDYWNoZS5nZXQodGVtcGxhdGUpXG4gICAgICBpZiAoIWZyYWcpIHtcbiAgICAgICAgbm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlLnNsaWNlKDEpKVxuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIGZyYWcgPSBub2RlVG9GcmFnbWVudChub2RlKVxuICAgICAgICAgIC8vIHNhdmUgc2VsZWN0b3IgdG8gY2FjaGVcbiAgICAgICAgICBpZFNlbGVjdG9yQ2FjaGUucHV0KHRlbXBsYXRlLCBmcmFnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG5vcm1hbCBzdHJpbmcgdGVtcGxhdGVcbiAgICAgIGZyYWcgPSBzdHJpbmdUb0ZyYWdtZW50KHRlbXBsYXRlKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0ZW1wbGF0ZS5ub2RlVHlwZSkge1xuICAgIC8vIGEgZGlyZWN0IG5vZGVcbiAgICBmcmFnID0gbm9kZVRvRnJhZ21lbnQodGVtcGxhdGUpXG4gIH1cblxuICByZXR1cm4gZnJhZyAmJiBjbG9uZVxuICAgID8gZXhwb3J0cy5jbG9uZShmcmFnKVxuICAgIDogZnJhZ1xufSIsInZhciBDYWNoZSA9IHJlcXVpcmUoJy4uL2NhY2hlJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxudmFyIGRpclBhcnNlciA9IHJlcXVpcmUoJy4vZGlyZWN0aXZlJylcbnZhciByZWdleEVzY2FwZVJFID0gL1stLiorP14ke30oKXxbXFxdXFwvXFxcXF0vZ1xudmFyIGNhY2hlLCB0YWdSRSwgaHRtbFJFLCBmaXJzdENoYXIsIGxhc3RDaGFyXG5cbi8qKlxuICogRXNjYXBlIGEgc3RyaW5nIHNvIGl0IGNhbiBiZSB1c2VkIGluIGEgUmVnRXhwXG4gKiBjb25zdHJ1Y3Rvci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlUmVnZXggKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UocmVnZXhFc2NhcGVSRSwgJ1xcXFwkJicpXG59XG5cbi8qKlxuICogQ29tcGlsZSB0aGUgaW50ZXJwb2xhdGlvbiB0YWcgcmVnZXguXG4gKlxuICogQHJldHVybiB7UmVnRXhwfVxuICovXG5cbmZ1bmN0aW9uIGNvbXBpbGVSZWdleCAoKSB7XG4gIGNvbmZpZy5fZGVsaW1pdGVyc0NoYW5nZWQgPSBmYWxzZVxuICB2YXIgb3BlbiA9IGNvbmZpZy5kZWxpbWl0ZXJzWzBdXG4gIHZhciBjbG9zZSA9IGNvbmZpZy5kZWxpbWl0ZXJzWzFdXG4gIGZpcnN0Q2hhciA9IG9wZW4uY2hhckF0KDApXG4gIGxhc3RDaGFyID0gY2xvc2UuY2hhckF0KGNsb3NlLmxlbmd0aCAtIDEpXG4gIHZhciBmaXJzdENoYXJSRSA9IGVzY2FwZVJlZ2V4KGZpcnN0Q2hhcilcbiAgdmFyIGxhc3RDaGFyUkUgPSBlc2NhcGVSZWdleChsYXN0Q2hhcilcbiAgdmFyIG9wZW5SRSA9IGVzY2FwZVJlZ2V4KG9wZW4pXG4gIHZhciBjbG9zZVJFID0gZXNjYXBlUmVnZXgoY2xvc2UpXG4gIHRhZ1JFID0gbmV3IFJlZ0V4cChcbiAgICBmaXJzdENoYXJSRSArICc/JyArIG9wZW5SRSArXG4gICAgJyguKz8pJyArXG4gICAgY2xvc2VSRSArIGxhc3RDaGFyUkUgKyAnPycsXG4gICAgJ2cnXG4gIClcbiAgaHRtbFJFID0gbmV3IFJlZ0V4cChcbiAgICAnXicgKyBmaXJzdENoYXJSRSArIG9wZW5SRSArXG4gICAgJy4qJyArXG4gICAgY2xvc2VSRSArIGxhc3RDaGFyUkUgKyAnJCdcbiAgKVxuICAvLyByZXNldCBjYWNoZVxuICBjYWNoZSA9IG5ldyBDYWNoZSgxMDAwKVxufVxuXG4vKipcbiAqIFBhcnNlIGEgdGVtcGxhdGUgdGV4dCBzdHJpbmcgaW50byBhbiBhcnJheSBvZiB0b2tlbnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAqIEByZXR1cm4ge0FycmF5PE9iamVjdD4gfCBudWxsfVxuICogICAgICAgICAgICAgICAtIHtTdHJpbmd9IHR5cGVcbiAqICAgICAgICAgICAgICAgLSB7U3RyaW5nfSB2YWx1ZVxuICogICAgICAgICAgICAgICAtIHtCb29sZWFufSBbaHRtbF1cbiAqICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gW29uZVRpbWVdXG4gKi9cblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gIGlmIChjb25maWcuX2RlbGltaXRlcnNDaGFuZ2VkKSB7XG4gICAgY29tcGlsZVJlZ2V4KClcbiAgfVxuICB2YXIgaGl0ID0gY2FjaGUuZ2V0KHRleHQpXG4gIGlmIChoaXQpIHtcbiAgICByZXR1cm4gaGl0XG4gIH1cbiAgaWYgKCF0YWdSRS50ZXN0KHRleHQpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICB2YXIgdG9rZW5zID0gW11cbiAgdmFyIGxhc3RJbmRleCA9IHRhZ1JFLmxhc3RJbmRleCA9IDBcbiAgdmFyIG1hdGNoLCBpbmRleCwgdmFsdWUsIGZpcnN0LCBvbmVUaW1lXG4gIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgd2hpbGUgKG1hdGNoID0gdGFnUkUuZXhlYyh0ZXh0KSkge1xuICAgIGluZGV4ID0gbWF0Y2guaW5kZXhcbiAgICAvLyBwdXNoIHRleHQgdG9rZW5cbiAgICBpZiAoaW5kZXggPiBsYXN0SW5kZXgpIHtcbiAgICAgIHRva2Vucy5wdXNoKHtcbiAgICAgICAgdmFsdWU6IHRleHQuc2xpY2UobGFzdEluZGV4LCBpbmRleClcbiAgICAgIH0pXG4gICAgfVxuICAgIC8vIHRhZyB0b2tlblxuICAgIGZpcnN0ID0gbWF0Y2hbMV0uY2hhckNvZGVBdCgwKVxuICAgIG9uZVRpbWUgPSBmaXJzdCA9PT0gMHgyQSAvLyAqXG4gICAgdmFsdWUgPSBvbmVUaW1lXG4gICAgICA/IG1hdGNoWzFdLnNsaWNlKDEpXG4gICAgICA6IG1hdGNoWzFdXG4gICAgdG9rZW5zLnB1c2goe1xuICAgICAgdGFnOiB0cnVlLFxuICAgICAgdmFsdWU6IHZhbHVlLnRyaW0oKSxcbiAgICAgIGh0bWw6IGh0bWxSRS50ZXN0KG1hdGNoWzBdKSxcbiAgICAgIG9uZVRpbWU6IG9uZVRpbWVcbiAgICB9KVxuICAgIGxhc3RJbmRleCA9IGluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoXG4gIH1cbiAgaWYgKGxhc3RJbmRleCA8IHRleHQubGVuZ3RoKSB7XG4gICAgdG9rZW5zLnB1c2goe1xuICAgICAgdmFsdWU6IHRleHQuc2xpY2UobGFzdEluZGV4KVxuICAgIH0pXG4gIH1cbiAgY2FjaGUucHV0KHRleHQsIHRva2VucylcbiAgcmV0dXJuIHRva2Vuc1xufVxuXG4vKipcbiAqIEZvcm1hdCBhIGxpc3Qgb2YgdG9rZW5zIGludG8gYW4gZXhwcmVzc2lvbi5cbiAqIGUuZy4gdG9rZW5zIHBhcnNlZCBmcm9tICdhIHt7Yn19IGMnIGNhbiBiZSBzZXJpYWxpemVkXG4gKiBpbnRvIG9uZSBzaW5nbGUgZXhwcmVzc2lvbiBhcyAnXCJhIFwiICsgYiArIFwiIGNcIicuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdG9rZW5zXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXVxuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5cbmV4cG9ydHMudG9rZW5zVG9FeHAgPSBmdW5jdGlvbiAodG9rZW5zLCB2bSkge1xuICByZXR1cm4gdG9rZW5zLmxlbmd0aCA+IDFcbiAgICA/IHRva2Vucy5tYXAoZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgIHJldHVybiBmb3JtYXRUb2tlbih0b2tlbiwgdm0pXG4gICAgICB9KS5qb2luKCcrJylcbiAgICA6IGZvcm1hdFRva2VuKHRva2Vuc1swXSwgdm0sIHRydWUpXG59XG5cbi8qKlxuICogRm9ybWF0IGEgc2luZ2xlIHRva2VuLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0b2tlblxuICogQHBhcmFtIHtWdWV9IFt2bV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gc2luZ2xlXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gZm9ybWF0VG9rZW4gKHRva2VuLCB2bSwgc2luZ2xlKSB7XG4gIHJldHVybiB0b2tlbi50YWdcbiAgICA/IHZtICYmIHRva2VuLm9uZVRpbWVcbiAgICAgID8gJ1wiJyArIHZtLiRldmFsKHRva2VuLnZhbHVlKSArICdcIidcbiAgICAgIDogaW5saW5lRmlsdGVycyh0b2tlbi52YWx1ZSwgc2luZ2xlKVxuICAgIDogJ1wiJyArIHRva2VuLnZhbHVlICsgJ1wiJ1xufVxuXG4vKipcbiAqIEZvciBhbiBhdHRyaWJ1dGUgd2l0aCBtdWx0aXBsZSBpbnRlcnBvbGF0aW9uIHRhZ3MsXG4gKiBlLmcuIGF0dHI9XCJzb21lLXt7dGhpbmcgfCBmaWx0ZXJ9fVwiLCBpbiBvcmRlciB0byBjb21iaW5lXG4gKiB0aGUgd2hvbGUgdGhpbmcgaW50byBhIHNpbmdsZSB3YXRjaGFibGUgZXhwcmVzc2lvbiwgd2VcbiAqIGhhdmUgdG8gaW5saW5lIHRob3NlIGZpbHRlcnMuIFRoaXMgZnVuY3Rpb24gZG9lcyBleGFjdGx5XG4gKiB0aGF0LiBUaGlzIGlzIGEgYml0IGhhY2t5IGJ1dCBpdCBhdm9pZHMgaGVhdnkgY2hhbmdlc1xuICogdG8gZGlyZWN0aXZlIHBhcnNlciBhbmQgd2F0Y2hlciBtZWNoYW5pc20uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV4cFxuICogQHBhcmFtIHtCb29sZWFufSBzaW5nbGVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG52YXIgZmlsdGVyUkUgPSAvW158XVxcfFtefF0vXG5mdW5jdGlvbiBpbmxpbmVGaWx0ZXJzIChleHAsIHNpbmdsZSkge1xuICBpZiAoIWZpbHRlclJFLnRlc3QoZXhwKSkge1xuICAgIHJldHVybiBzaW5nbGVcbiAgICAgID8gZXhwXG4gICAgICA6ICcoJyArIGV4cCArICcpJ1xuICB9IGVsc2Uge1xuICAgIHZhciBkaXIgPSBkaXJQYXJzZXIucGFyc2UoZXhwKVswXVxuICAgIGlmICghZGlyLmZpbHRlcnMpIHtcbiAgICAgIHJldHVybiAnKCcgKyBleHAgKyAnKSdcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwID0gZGlyLmV4cHJlc3Npb25cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gZGlyLmZpbHRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBmaWx0ZXIgPSBkaXIuZmlsdGVyc1tpXVxuICAgICAgICB2YXIgYXJncyA9IGZpbHRlci5hcmdzXG4gICAgICAgICAgPyAnLFwiJyArIGZpbHRlci5hcmdzLmpvaW4oJ1wiLFwiJykgKyAnXCInXG4gICAgICAgICAgOiAnJ1xuICAgICAgICBleHAgPSAndGhpcy5fYXBwbHlGaWx0ZXIoXCInICsgZmlsdGVyLm5hbWUgKyAnXCIsWycgKyBleHAgKyBhcmdzICsgJ10pJ1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV4cFxuICAgIH1cbiAgfVxufSIsInZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpXG52YXIgYWRkQ2xhc3MgPSBfLmFkZENsYXNzXG52YXIgcmVtb3ZlQ2xhc3MgPSBfLnJlbW92ZUNsYXNzXG52YXIgdHJhbnNEdXJhdGlvblByb3AgPSBfLnRyYW5zaXRpb25Qcm9wICsgJ0R1cmF0aW9uJ1xudmFyIGFuaW1EdXJhdGlvblByb3AgPSBfLmFuaW1hdGlvblByb3AgKyAnRHVyYXRpb24nXG5cbnZhciBxdWV1ZSA9IFtdXG52YXIgcXVldWVkID0gZmFsc2VcblxuLyoqXG4gKiBQdXNoIGEgam9iIGludG8gdGhlIHRyYW5zaXRpb24gcXVldWUsIHdoaWNoIGlzIHRvIGJlXG4gKiBleGVjdXRlZCBvbiBuZXh0IGZyYW1lLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWwgICAgLSB0YXJnZXQgZWxlbWVudFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpciAgICAtIDE6IGVudGVyLCAtMTogbGVhdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wICAgLSB0aGUgYWN0dWFsIGRvbSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBjbHMgICAgLSB0aGUgY2xhc3NOYW1lIHRvIHJlbW92ZSB3aGVuIHRoZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb24gaXMgZG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl0gLSB1c2VyIHN1cHBsaWVkIGNhbGxiYWNrLlxuICovXG5cbmZ1bmN0aW9uIHB1c2ggKGVsLCBkaXIsIG9wLCBjbHMsIGNiKSB7XG4gIHF1ZXVlLnB1c2goe1xuICAgIGVsICA6IGVsLFxuICAgIGRpciA6IGRpcixcbiAgICBjYiAgOiBjYixcbiAgICBjbHMgOiBjbHMsXG4gICAgb3AgIDogb3BcbiAgfSlcbiAgaWYgKCFxdWV1ZWQpIHtcbiAgICBxdWV1ZWQgPSB0cnVlXG4gICAgXy5uZXh0VGljayhmbHVzaClcbiAgfVxufVxuXG4vKipcbiAqIEZsdXNoIHRoZSBxdWV1ZSwgYW5kIGRvIG9uZSBmb3JjZWQgcmVmbG93IGJlZm9yZVxuICogdHJpZ2dlcmluZyB0cmFuc2l0aW9ucy5cbiAqL1xuXG5mdW5jdGlvbiBmbHVzaCAoKSB7XG4gIHZhciBmID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Lm9mZnNldEhlaWdodFxuICBxdWV1ZS5mb3JFYWNoKHJ1bilcbiAgcXVldWUgPSBbXVxuICBxdWV1ZWQgPSBmYWxzZVxuICAvKiBkdW1teSByZXR1cm4sIHNvIGpzIGxpbnRlcnMgZG9uJ3QgY29tcGxhaW4gYWJvdXQgdW51c2VkIHZhcmlhYmxlIGYgKi9cbiAgcmV0dXJuIGZcbn1cblxuLyoqXG4gKiBSdW4gYSB0cmFuc2l0aW9uIGpvYi5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gam9iXG4gKi9cblxuZnVuY3Rpb24gcnVuIChqb2IpIHtcblxuICB2YXIgZWwgPSBqb2IuZWxcbiAgdmFyIGRhdGEgPSBlbC5fX3ZfdHJhbnNcbiAgdmFyIGNscyA9IGpvYi5jbHNcbiAgdmFyIGNiID0gam9iLmNiXG4gIHZhciBvcCA9IGpvYi5vcFxuICB2YXIgdHJhbnNpdGlvblR5cGUgPSBnZXRUcmFuc2l0aW9uVHlwZShlbCwgZGF0YSwgY2xzKVxuXG4gIGlmIChqb2IuZGlyID4gMCkgeyAvLyBFTlRFUlxuICAgIGlmICh0cmFuc2l0aW9uVHlwZSA9PT0gMSkge1xuICAgICAgLy8gdHJpZ2dlciB0cmFuc2l0aW9uIGJ5IHJlbW92aW5nIGVudGVyIGNsYXNzXG4gICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgLy8gb25seSBuZWVkIHRvIGxpc3RlbiBmb3IgdHJhbnNpdGlvbmVuZCBpZiB0aGVyZSdzXG4gICAgICAvLyBhIHVzZXIgY2FsbGJhY2tcbiAgICAgIGlmIChjYikgc2V0dXBUcmFuc2l0aW9uQ2IoXy50cmFuc2l0aW9uRW5kRXZlbnQpXG4gICAgfSBlbHNlIGlmICh0cmFuc2l0aW9uVHlwZSA9PT0gMikge1xuICAgICAgLy8gYW5pbWF0aW9ucyBhcmUgdHJpZ2dlcmVkIHdoZW4gY2xhc3MgaXMgYWRkZWRcbiAgICAgIC8vIHNvIHdlIGp1c3QgbGlzdGVuIGZvciBhbmltYXRpb25lbmQgdG8gcmVtb3ZlIGl0LlxuICAgICAgc2V0dXBUcmFuc2l0aW9uQ2IoXy5hbmltYXRpb25FbmRFdmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gbm8gdHJhbnNpdGlvbiBhcHBsaWNhYmxlXG4gICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgaWYgKGNiKSBjYigpXG4gICAgfVxuICB9IGVsc2UgeyAvLyBMRUFWRVxuICAgIGlmICh0cmFuc2l0aW9uVHlwZSkge1xuICAgICAgLy8gbGVhdmUgdHJhbnNpdGlvbnMvYW5pbWF0aW9ucyBhcmUgYm90aCB0cmlnZ2VyZWRcbiAgICAgIC8vIGJ5IGFkZGluZyB0aGUgY2xhc3MsIGp1c3QgcmVtb3ZlIGl0IG9uIGVuZCBldmVudC5cbiAgICAgIHZhciBldmVudCA9IHRyYW5zaXRpb25UeXBlID09PSAxXG4gICAgICAgID8gXy50cmFuc2l0aW9uRW5kRXZlbnRcbiAgICAgICAgOiBfLmFuaW1hdGlvbkVuZEV2ZW50XG4gICAgICBzZXR1cFRyYW5zaXRpb25DYihldmVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBvcCgpXG4gICAgICAgIHJlbW92ZUNsYXNzKGVsLCBjbHMpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvcCgpXG4gICAgICByZW1vdmVDbGFzcyhlbCwgY2xzKVxuICAgICAgaWYgKGNiKSBjYigpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB1cCBhIHRyYW5zaXRpb24gZW5kIGNhbGxiYWNrLCBzdG9yZSB0aGUgY2FsbGJhY2tcbiAgICogb24gdGhlIGVsZW1lbnQncyBfX3ZfdHJhbnMgZGF0YSBvYmplY3QsIHNvIHdlIGNhblxuICAgKiBjbGVhbiBpdCB1cCBpZiBhbm90aGVyIHRyYW5zaXRpb24gaXMgdHJpZ2dlcmVkIGJlZm9yZVxuICAgKiB0aGUgY2FsbGJhY2sgaXMgZmlyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2xlYW51cEZuXVxuICAgKi9cblxuICBmdW5jdGlvbiBzZXR1cFRyYW5zaXRpb25DYiAoZXZlbnQsIGNsZWFudXBGbikge1xuICAgIGRhdGEuZXZlbnQgPSBldmVudFxuICAgIHZhciBvbkVuZCA9IGRhdGEuY2FsbGJhY2sgPSBmdW5jdGlvbiB0cmFuc2l0aW9uQ2IgKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgICAgXy5vZmYoZWwsIGV2ZW50LCBvbkVuZClcbiAgICAgICAgZGF0YS5ldmVudCA9IGRhdGEuY2FsbGJhY2sgPSBudWxsXG4gICAgICAgIGlmIChjbGVhbnVwRm4pIGNsZWFudXBGbigpXG4gICAgICAgIGlmIChjYikgY2IoKVxuICAgICAgfVxuICAgIH1cbiAgICBfLm9uKGVsLCBldmVudCwgb25FbmQpXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgYW4gZWxlbWVudCdzIHRyYW5zaXRpb24gdHlwZSBiYXNlZCBvbiB0aGVcbiAqIGNhbGN1bGF0ZWQgc3R5bGVzXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqICAgICAgICAgMSAtIHRyYW5zaXRpb25cbiAqICAgICAgICAgMiAtIGFuaW1hdGlvblxuICovXG5cbmZ1bmN0aW9uIGdldFRyYW5zaXRpb25UeXBlIChlbCwgZGF0YSwgY2xhc3NOYW1lKSB7XG4gIHZhciB0eXBlID0gZGF0YS5jYWNoZSAmJiBkYXRhLmNhY2hlW2NsYXNzTmFtZV1cbiAgaWYgKHR5cGUpIHJldHVybiB0eXBlXG4gIHZhciBpbmxpbmVTdHlsZXMgPSBlbC5zdHlsZVxuICB2YXIgY29tcHV0ZWRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbClcbiAgdmFyIHRyYW5zRHVyYXRpb24gPVxuICAgIGlubGluZVN0eWxlc1t0cmFuc0R1cmF0aW9uUHJvcF0gfHxcbiAgICBjb21wdXRlZFN0eWxlc1t0cmFuc0R1cmF0aW9uUHJvcF1cbiAgaWYgKHRyYW5zRHVyYXRpb24gJiYgdHJhbnNEdXJhdGlvbiAhPT0gJzBzJykge1xuICAgIHR5cGUgPSAxXG4gIH0gZWxzZSB7XG4gICAgdmFyIGFuaW1EdXJhdGlvbiA9XG4gICAgICBpbmxpbmVTdHlsZXNbYW5pbUR1cmF0aW9uUHJvcF0gfHxcbiAgICAgIGNvbXB1dGVkU3R5bGVzW2FuaW1EdXJhdGlvblByb3BdXG4gICAgaWYgKGFuaW1EdXJhdGlvbiAmJiBhbmltRHVyYXRpb24gIT09ICcwcycpIHtcbiAgICAgIHR5cGUgPSAyXG4gICAgfVxuICB9XG4gIGlmICh0eXBlKSB7XG4gICAgaWYgKCFkYXRhLmNhY2hlKSBkYXRhLmNhY2hlID0ge31cbiAgICBkYXRhLmNhY2hlW2NsYXNzTmFtZV0gPSB0eXBlXG4gIH1cbiAgcmV0dXJuIHR5cGVcbn1cblxuLyoqXG4gKiBBcHBseSBDU1MgdHJhbnNpdGlvbiB0byBhbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBkaXJlY3Rpb24gLSAxOiBlbnRlciwgLTE6IGxlYXZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcCAtIHRoZSBhY3R1YWwgRE9NIG9wZXJhdGlvblxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSB0YXJnZXQgZWxlbWVudCdzIHRyYW5zaXRpb24gZGF0YVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGVsLCBkaXJlY3Rpb24sIG9wLCBkYXRhLCBjYikge1xuICB2YXIgcHJlZml4ID0gZGF0YS5pZCB8fCAndidcbiAgdmFyIGVudGVyQ2xhc3MgPSBwcmVmaXggKyAnLWVudGVyJ1xuICB2YXIgbGVhdmVDbGFzcyA9IHByZWZpeCArICctbGVhdmUnXG4gIC8vIGNsZWFuIHVwIHBvdGVudGlhbCBwcmV2aW91cyB1bmZpbmlzaGVkIHRyYW5zaXRpb25cbiAgaWYgKGRhdGEuY2FsbGJhY2spIHtcbiAgICBfLm9mZihlbCwgZGF0YS5ldmVudCwgZGF0YS5jYWxsYmFjaylcbiAgICByZW1vdmVDbGFzcyhlbCwgZW50ZXJDbGFzcylcbiAgICByZW1vdmVDbGFzcyhlbCwgbGVhdmVDbGFzcylcbiAgICBkYXRhLmV2ZW50ID0gZGF0YS5jYWxsYmFjayA9IG51bGxcbiAgfVxuICBpZiAoZGlyZWN0aW9uID4gMCkgeyAvLyBlbnRlclxuICAgIGFkZENsYXNzKGVsLCBlbnRlckNsYXNzKVxuICAgIG9wKClcbiAgICBwdXNoKGVsLCBkaXJlY3Rpb24sIG51bGwsIGVudGVyQ2xhc3MsIGNiKVxuICB9IGVsc2UgeyAvLyBsZWF2ZVxuICAgIGFkZENsYXNzKGVsLCBsZWF2ZUNsYXNzKVxuICAgIHB1c2goZWwsIGRpcmVjdGlvbiwgb3AsIGxlYXZlQ2xhc3MsIGNiKVxuICB9XG59XG4iLCJ2YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKVxudmFyIGFwcGx5Q1NTVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vY3NzJylcbnZhciBhcHBseUpTVHJhbnNpdGlvbiA9IHJlcXVpcmUoJy4vanMnKVxudmFyIGRvYyA9IHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogZG9jdW1lbnRcblxuLyoqXG4gKiBBcHBlbmQgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLmFwcGVuZCA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpXG4gIH0sIHZtLCBjYilcbn1cblxuLyoqXG4gKiBJbnNlcnRCZWZvcmUgd2l0aCB0cmFuc2l0aW9uLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLmJlZm9yZSA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0LCB2bSwgY2IpIHtcbiAgYXBwbHkoZWwsIDEsIGZ1bmN0aW9uICgpIHtcbiAgICBfLmJlZm9yZShlbCwgdGFyZ2V0KVxuICB9LCB2bSwgY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIHdpdGggdHJhbnNpdGlvbi5cbiAqXG4gKiBAb2FyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLnJlbW92ZSA9IGZ1bmN0aW9uIChlbCwgdm0sIGNiKSB7XG4gIGFwcGx5KGVsLCAtMSwgZnVuY3Rpb24gKCkge1xuICAgIF8ucmVtb3ZlKGVsKVxuICB9LCB2bSwgY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIGJ5IGFwcGVuZGluZyB0byBhbm90aGVyIHBhcmVudCB3aXRoIHRyYW5zaXRpb24uXG4gKiBUaGlzIGlzIG9ubHkgdXNlZCBpbiBibG9jayBvcGVyYXRpb25zLlxuICpcbiAqIEBvYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl1cbiAqL1xuXG5leHBvcnRzLnJlbW92ZVRoZW5BcHBlbmQgPSBmdW5jdGlvbiAoZWwsIHRhcmdldCwgdm0sIGNiKSB7XG4gIGFwcGx5KGVsLCAtMSwgZnVuY3Rpb24gKCkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChlbClcbiAgfSwgdm0sIGNiKVxufVxuXG4vKipcbiAqIEFwcGVuZCB0aGUgY2hpbGROb2RlcyBvZiBhIGZyYWdtZW50IHRvIHRhcmdldC5cbiAqXG4gKiBAcGFyYW0ge0RvY3VtZW50RnJhZ21lbnR9IGJsb2NrXG4gKiBAcGFyYW0ge05vZGV9IHRhcmdldFxuICogQHBhcmFtIHtWdWV9IHZtXG4gKi9cblxuZXhwb3J0cy5ibG9ja0FwcGVuZCA9IGZ1bmN0aW9uIChibG9jaywgdGFyZ2V0LCB2bSkge1xuICB2YXIgbm9kZXMgPSBfLnRvQXJyYXkoYmxvY2suY2hpbGROb2RlcylcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBub2Rlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBleHBvcnRzLmJlZm9yZShub2Rlc1tpXSwgdGFyZ2V0LCB2bSlcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBhIGJsb2NrIG9mIG5vZGVzIGJldHdlZW4gdHdvIGVkZ2Ugbm9kZXMuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBzdGFydFxuICogQHBhcmFtIHtOb2RlfSBlbmRcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICovXG5cbmV4cG9ydHMuYmxvY2tSZW1vdmUgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgdm0pIHtcbiAgdmFyIG5vZGUgPSBzdGFydC5uZXh0U2libGluZ1xuICB2YXIgbmV4dFxuICB3aGlsZSAobm9kZSAhPT0gZW5kKSB7XG4gICAgbmV4dCA9IG5vZGUubmV4dFNpYmxpbmdcbiAgICBleHBvcnRzLnJlbW92ZShub2RlLCB2bSlcbiAgICBub2RlID0gbmV4dFxuICB9XG59XG5cbi8qKlxuICogQXBwbHkgdHJhbnNpdGlvbnMgd2l0aCBhbiBvcGVyYXRpb24gY2FsbGJhY2suXG4gKlxuICogQG9hcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpcmVjdGlvblxuICogICAgICAgICAgICAgICAgICAxOiBlbnRlclxuICogICAgICAgICAgICAgICAgIC0xOiBsZWF2ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gb3AgLSB0aGUgYWN0dWFsIERPTSBvcGVyYXRpb25cbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXVxuICovXG5cbnZhciBhcHBseSA9IGV4cG9ydHMuYXBwbHkgPSBmdW5jdGlvbiAoZWwsIGRpcmVjdGlvbiwgb3AsIHZtLCBjYikge1xuICB2YXIgdHJhbnNEYXRhID0gZWwuX192X3RyYW5zXG4gIGlmIChcbiAgICAhdHJhbnNEYXRhIHx8XG4gICAgIXZtLl9pc0NvbXBpbGVkIHx8XG4gICAgLy8gaWYgdGhlIHZtIGlzIGJlaW5nIG1hbmlwdWxhdGVkIGJ5IGEgcGFyZW50IGRpcmVjdGl2ZVxuICAgIC8vIGR1cmluZyB0aGUgcGFyZW50J3MgY29tcGlsYXRpb24gcGhhc2UsIHNraXAgdGhlXG4gICAgLy8gYW5pbWF0aW9uLlxuICAgICh2bS4kcGFyZW50ICYmICF2bS4kcGFyZW50Ll9pc0NvbXBpbGVkKVxuICApIHtcbiAgICBvcCgpXG4gICAgaWYgKGNiKSBjYigpXG4gICAgcmV0dXJuXG4gIH1cbiAgLy8gZGV0ZXJtaW5lIHRoZSB0cmFuc2l0aW9uIHR5cGUgb24gdGhlIGVsZW1lbnRcbiAgdmFyIGpzVHJhbnNpdGlvbiA9IHRyYW5zRGF0YS5mbnNcbiAgaWYgKGpzVHJhbnNpdGlvbikge1xuICAgIC8vIGpzXG4gICAgYXBwbHlKU1RyYW5zaXRpb24oXG4gICAgICBlbCxcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIG9wLFxuICAgICAgdHJhbnNEYXRhLFxuICAgICAganNUcmFuc2l0aW9uLFxuICAgICAgdm0sXG4gICAgICBjYlxuICAgIClcbiAgfSBlbHNlIGlmIChcbiAgICBfLnRyYW5zaXRpb25FbmRFdmVudCAmJlxuICAgIC8vIHNraXAgQ1NTIHRyYW5zaXRpb25zIGlmIHBhZ2UgaXMgbm90IHZpc2libGUgLVxuICAgIC8vIHRoaXMgc29sdmVzIHRoZSBpc3N1ZSBvZiB0cmFuc2l0aW9uZW5kIGV2ZW50cyBub3RcbiAgICAvLyBmaXJpbmcgdW50aWwgdGhlIHBhZ2UgaXMgdmlzaWJsZSBhZ2Fpbi5cbiAgICAvLyBwYWdlVmlzaWJpbGl0eSBBUEkgaXMgc3VwcG9ydGVkIGluIElFMTArLCBzYW1lIGFzXG4gICAgLy8gQ1NTIHRyYW5zaXRpb25zLlxuICAgICEoZG9jICYmIGRvYy5oaWRkZW4pXG4gICkge1xuICAgIC8vIGNzc1xuICAgIGFwcGx5Q1NTVHJhbnNpdGlvbihcbiAgICAgIGVsLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgb3AsXG4gICAgICB0cmFuc0RhdGEsXG4gICAgICBjYlxuICAgIClcbiAgfSBlbHNlIHtcbiAgICAvLyBub3QgYXBwbGljYWJsZVxuICAgIG9wKClcbiAgICBpZiAoY2IpIGNiKClcbiAgfVxufSIsIi8qKlxuICogQXBwbHkgSmF2YVNjcmlwdCBlbnRlci9sZWF2ZSBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtOdW1iZXJ9IGRpcmVjdGlvbiAtIDE6IGVudGVyLCAtMTogbGVhdmVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9wIC0gdGhlIGFjdHVhbCBET00gb3BlcmF0aW9uXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIHRhcmdldCBlbGVtZW50J3MgdHJhbnNpdGlvbiBkYXRhXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmIC0gdHJhbnNpdGlvbiBkZWZpbml0aW9uIG9iamVjdFxuICogQHBhcmFtIHtWdWV9IHZtIC0gdGhlIG93bmVyIHZtIG9mIHRoZSBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWwsIGRpcmVjdGlvbiwgb3AsIGRhdGEsIGRlZiwgdm0sIGNiKSB7XG4gIC8vIGlmIHRoZSBlbGVtZW50IGlzIHRoZSByb290IG9mIGFuIGluc3RhbmNlLFxuICAvLyB1c2UgdGhhdCBpbnN0YW5jZSBhcyB0aGUgdHJhbnNpdGlvbiBmdW5jdGlvbiBjb250ZXh0XG4gIHZtID0gZWwuX192dWVfXyB8fCB2bVxuICBpZiAoZGF0YS5jYW5jZWwpIHtcbiAgICBkYXRhLmNhbmNlbCgpXG4gICAgZGF0YS5jYW5jZWwgPSBudWxsXG4gIH1cbiAgaWYgKGRpcmVjdGlvbiA+IDApIHsgLy8gZW50ZXJcbiAgICBpZiAoZGVmLmJlZm9yZUVudGVyKSB7XG4gICAgICBkZWYuYmVmb3JlRW50ZXIuY2FsbCh2bSwgZWwpXG4gICAgfVxuICAgIG9wKClcbiAgICBpZiAoZGVmLmVudGVyKSB7XG4gICAgICBkYXRhLmNhbmNlbCA9IGRlZi5lbnRlci5jYWxsKHZtLCBlbCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXRhLmNhbmNlbCA9IG51bGxcbiAgICAgICAgaWYgKGNiKSBjYigpXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoY2IpIHtcbiAgICAgIGNiKClcbiAgICB9XG4gIH0gZWxzZSB7IC8vIGxlYXZlXG4gICAgaWYgKGRlZi5sZWF2ZSkge1xuICAgICAgZGF0YS5jYW5jZWwgPSBkZWYubGVhdmUuY2FsbCh2bSwgZWwsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGF0YS5jYW5jZWwgPSBudWxsXG4gICAgICAgIG9wKClcbiAgICAgICAgaWYgKGNiKSBjYigpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBvcCgpXG4gICAgICBpZiAoY2IpIGNiKClcbiAgICB9XG4gIH1cbn0iLCJ2YXIgY29uZmlnID0gcmVxdWlyZSgnLi4vY29uZmlnJylcblxuLyoqXG4gKiBFbmFibGUgZGVidWcgdXRpbGl0aWVzLiBUaGUgZW5hYmxlRGVidWcoKSBmdW5jdGlvbiBhbmRcbiAqIGFsbCBfLmxvZygpICYgXy53YXJuKCkgY2FsbHMgd2lsbCBiZSBkcm9wcGVkIGluIHRoZVxuICogbWluaWZpZWQgcHJvZHVjdGlvbiBidWlsZC5cbiAqL1xuXG5lbmFibGVEZWJ1ZygpXG5cbmZ1bmN0aW9uIGVuYWJsZURlYnVnICgpIHtcblxuICB2YXIgaGFzQ29uc29sZSA9IHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJ1xuICBcbiAgLyoqXG4gICAqIExvZyBhIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2dcbiAgICovXG5cbiAgZXhwb3J0cy5sb2cgPSBmdW5jdGlvbiAobXNnKSB7XG4gICAgaWYgKGhhc0NvbnNvbGUgJiYgY29uZmlnLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmxvZygnW1Z1ZSBpbmZvXTogJyArIG1zZylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2UndmUgZ290IGEgcHJvYmxlbSBoZXJlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbXNnXG4gICAqL1xuXG4gIGV4cG9ydHMud2FybiA9IGZ1bmN0aW9uIChtc2cpIHtcbiAgICBpZiAoaGFzQ29uc29sZSAmJiAoIWNvbmZpZy5zaWxlbnQgfHwgY29uZmlnLmRlYnVnKSkge1xuICAgICAgY29uc29sZS53YXJuKCdbVnVlIHdhcm5dOiAnICsgbXNnKVxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICBpZiAoY29uZmlnLmRlYnVnKSB7XG4gICAgICAgIC8qIGpzaGludCBkZWJ1ZzogdHJ1ZSAqL1xuICAgICAgICBkZWJ1Z2dlclxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgYXNzZXQgZXhpc3RzXG4gICAqL1xuXG4gIGV4cG9ydHMuYXNzZXJ0QXNzZXQgPSBmdW5jdGlvbiAodmFsLCB0eXBlLCBpZCkge1xuICAgIGlmICghdmFsKSB7XG4gICAgICBleHBvcnRzLndhcm4oJ0ZhaWxlZCB0byByZXNvbHZlICcgKyB0eXBlICsgJzogJyArIGlkKVxuICAgIH1cbiAgfVxufSIsInZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKVxuXG4vKipcbiAqIENoZWNrIGlmIGEgbm9kZSBpcyBpbiB0aGUgZG9jdW1lbnQuXG4gKiBOb3RlOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY29udGFpbnMgc2hvdWxkIHdvcmsgaGVyZVxuICogYnV0IGFsd2F5cyByZXR1cm5zIGZhbHNlIGZvciBjb21tZW50IG5vZGVzIGluIHBoYW50b21qcyxcbiAqIG1ha2luZyB1bml0IHRlc3RzIGRpZmZpY3VsdC4gVGhpcyBpcyBmaXhlZCBieXkgZG9pbmcgdGhlXG4gKiBjb250YWlucygpIGNoZWNrIG9uIHRoZSBub2RlJ3MgcGFyZW50Tm9kZSBpbnN0ZWFkIG9mXG4gKiB0aGUgbm9kZSBpdHNlbGYuXG4gKlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnZhciBkb2MgPVxuICB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmXG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudFxuXG5leHBvcnRzLmluRG9jID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgdmFyIHBhcmVudCA9IG5vZGUgJiYgbm9kZS5wYXJlbnROb2RlXG4gIHJldHVybiBkb2MgPT09IG5vZGUgfHxcbiAgICBkb2MgPT09IHBhcmVudCB8fFxuICAgICEhKHBhcmVudCAmJiBwYXJlbnQubm9kZVR5cGUgPT09IDEgJiYgKGRvYy5jb250YWlucyhwYXJlbnQpKSlcbn1cblxuLyoqXG4gKiBFeHRyYWN0IGFuIGF0dHJpYnV0ZSBmcm9tIGEgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyXG4gKi9cblxuZXhwb3J0cy5hdHRyID0gZnVuY3Rpb24gKG5vZGUsIGF0dHIpIHtcbiAgYXR0ciA9IGNvbmZpZy5wcmVmaXggKyBhdHRyXG4gIHZhciB2YWwgPSBub2RlLmdldEF0dHJpYnV0ZShhdHRyKVxuICBpZiAodmFsICE9PSBudWxsKSB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0cilcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbi8qKlxuICogSW5zZXJ0IGVsIGJlZm9yZSB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICovXG5cbmV4cG9ydHMuYmVmb3JlID0gZnVuY3Rpb24gKGVsLCB0YXJnZXQpIHtcbiAgdGFyZ2V0LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQpXG59XG5cbi8qKlxuICogSW5zZXJ0IGVsIGFmdGVyIHRhcmdldFxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7RWxlbWVudH0gdGFyZ2V0XG4gKi9cblxuZXhwb3J0cy5hZnRlciA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQubmV4dFNpYmxpbmcpIHtcbiAgICBleHBvcnRzLmJlZm9yZShlbCwgdGFyZ2V0Lm5leHRTaWJsaW5nKVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKGVsKVxuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlIGVsIGZyb20gRE9NXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICovXG5cbmV4cG9ydHMucmVtb3ZlID0gZnVuY3Rpb24gKGVsKSB7XG4gIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpXG59XG5cbi8qKlxuICogUHJlcGVuZCBlbCB0byB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHRhcmdldFxuICovXG5cbmV4cG9ydHMucHJlcGVuZCA9IGZ1bmN0aW9uIChlbCwgdGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQuZmlyc3RDaGlsZCkge1xuICAgIGV4cG9ydHMuYmVmb3JlKGVsLCB0YXJnZXQuZmlyc3RDaGlsZClcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWwpXG4gIH1cbn1cblxuLyoqXG4gKiBSZXBsYWNlIHRhcmdldCB3aXRoIGVsXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqL1xuXG5leHBvcnRzLnJlcGxhY2UgPSBmdW5jdGlvbiAodGFyZ2V0LCBlbCkge1xuICB2YXIgcGFyZW50ID0gdGFyZ2V0LnBhcmVudE5vZGVcbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5yZXBsYWNlQ2hpbGQoZWwsIHRhcmdldClcbiAgfVxufVxuXG4vKipcbiAqIEFkZCBldmVudCBsaXN0ZW5lciBzaG9ydGhhbmQuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICovXG5cbmV4cG9ydHMub24gPSBmdW5jdGlvbiAoZWwsIGV2ZW50LCBjYikge1xuICBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYilcbn1cblxuLyoqXG4gKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXIgc2hvcnRoYW5kLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5leHBvcnRzLm9mZiA9IGZ1bmN0aW9uIChlbCwgZXZlbnQsIGNiKSB7XG4gIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNiKVxufVxuXG4vKipcbiAqIEFkZCBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIElFICYgU1ZHXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJvbmd9IGNsc1xuICovXG5cbmV4cG9ydHMuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNscykge1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LmFkZChjbHMpXG4gIH0gZWxzZSB7XG4gICAgdmFyIGN1ciA9ICcgJyArIChlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpICsgJyAnXG4gICAgaWYgKGN1ci5pbmRleE9mKCcgJyArIGNscyArICcgJykgPCAwKSB7XG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgKGN1ciArIGNscykudHJpbSgpKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZSBjbGFzcyB3aXRoIGNvbXBhdGliaWxpdHkgZm9yIElFICYgU1ZHXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJvbmd9IGNsc1xuICovXG5cbmV4cG9ydHMucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNscykge1xuICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbHMpXG4gIH0gZWxzZSB7XG4gICAgdmFyIGN1ciA9ICcgJyArIChlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpICsgJyAnXG4gICAgdmFyIHRhciA9ICcgJyArIGNscyArICcgJ1xuICAgIHdoaWxlIChjdXIuaW5kZXhPZih0YXIpID49IDApIHtcbiAgICAgIGN1ciA9IGN1ci5yZXBsYWNlKHRhciwgJyAnKVxuICAgIH1cbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY3VyLnRyaW0oKSlcbiAgfVxufVxuXG4vKipcbiAqIEV4dHJhY3QgcmF3IGNvbnRlbnQgaW5zaWRlIGFuIGVsZW1lbnQgaW50byBhIHRlbXBvcmFyeVxuICogY29udGFpbmVyIGRpdlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYXNGcmFnbWVudFxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuXG5leHBvcnRzLmV4dHJhY3RDb250ZW50ID0gZnVuY3Rpb24gKGVsLCBhc0ZyYWdtZW50KSB7XG4gIHZhciBjaGlsZFxuICB2YXIgcmF3Q29udGVudFxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgaWYgKFxuICAgIGVsLnRhZ05hbWUgPT09ICdURU1QTEFURScgJiZcbiAgICBlbC5jb250ZW50IGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudFxuICApIHtcbiAgICBlbCA9IGVsLmNvbnRlbnRcbiAgfVxuICBpZiAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgcmF3Q29udGVudCA9IGFzRnJhZ21lbnRcbiAgICAgID8gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgICA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIHdoaWxlIChjaGlsZCA9IGVsLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHJhd0NvbnRlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpXG4gICAgfVxuICB9XG4gIHJldHVybiByYXdDb250ZW50XG59XG4iLCIvKipcbiAqIENhbiB3ZSB1c2UgX19wcm90b19fP1xuICpcbiAqIEB0eXBlIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaGFzUHJvdG8gPSAnX19wcm90b19fJyBpbiB7fVxuXG4vKipcbiAqIEluZGljYXRlcyB3ZSBoYXZlIGEgd2luZG93XG4gKlxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xudmFyIGluQnJvd3NlciA9IGV4cG9ydHMuaW5Ccm93c2VyID1cbiAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgdG9TdHJpbmcuY2FsbCh3aW5kb3cpICE9PSAnW29iamVjdCBPYmplY3RdJ1xuXG4vKipcbiAqIERlZmVyIGEgdGFzayB0byBleGVjdXRlIGl0IGFzeW5jaHJvbm91c2x5LiBJZGVhbGx5IHRoaXNcbiAqIHNob3VsZCBiZSBleGVjdXRlZCBhcyBhIG1pY3JvdGFzaywgc28gd2UgbGV2ZXJhZ2VcbiAqIE11dGF0aW9uT2JzZXJ2ZXIgaWYgaXQncyBhdmFpbGFibGUsIGFuZCBmYWxsYmFjayB0b1xuICogc2V0VGltZW91dCgwKS5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYlxuICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICovXG5cbmV4cG9ydHMubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgY2FsbGJhY2tzID0gW11cbiAgdmFyIHBlbmRpbmcgPSBmYWxzZVxuICB2YXIgdGltZXJGdW5jXG4gIGZ1bmN0aW9uIGhhbmRsZSAoKSB7XG4gICAgcGVuZGluZyA9IGZhbHNlXG4gICAgdmFyIGNvcGllcyA9IGNhbGxiYWNrcy5zbGljZSgwKVxuICAgIGNhbGxiYWNrcyA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3BpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvcGllc1tpXSgpXG4gICAgfVxuICB9XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICBpZiAodHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIGNvdW50ZXIgPSAxXG4gICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoaGFuZGxlKVxuICAgIHZhciB0ZXh0Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNvdW50ZXIpXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0ZXh0Tm9kZSwge1xuICAgICAgY2hhcmFjdGVyRGF0YTogdHJ1ZVxuICAgIH0pXG4gICAgdGltZXJGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgY291bnRlciA9IChjb3VudGVyICsgMSkgJSAyXG4gICAgICB0ZXh0Tm9kZS5kYXRhID0gY291bnRlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aW1lckZ1bmMgPSBzZXRUaW1lb3V0XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChjYiwgY3R4KSB7XG4gICAgdmFyIGZ1bmMgPSBjdHhcbiAgICAgID8gZnVuY3Rpb24gKCkgeyBjYi5jYWxsKGN0eCkgfVxuICAgICAgOiBjYlxuICAgIGNhbGxiYWNrcy5wdXNoKGZ1bmMpXG4gICAgaWYgKHBlbmRpbmcpIHJldHVyblxuICAgIHBlbmRpbmcgPSB0cnVlXG4gICAgdGltZXJGdW5jKGhhbmRsZSwgMClcbiAgfVxufSkoKVxuXG4vKipcbiAqIERldGVjdCBpZiB3ZSBhcmUgaW4gSUU5Li4uXG4gKlxuICogQHR5cGUge0Jvb2xlYW59XG4gKi9cblxuZXhwb3J0cy5pc0lFOSA9XG4gIGluQnJvd3NlciAmJlxuICBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ01TSUUgOS4wJykgPiAwXG5cbi8qKlxuICogU25pZmYgdHJhbnNpdGlvbi9hbmltYXRpb24gZXZlbnRzXG4gKi9cblxuaWYgKGluQnJvd3NlciAmJiAhZXhwb3J0cy5pc0lFOSkge1xuICB2YXIgaXNXZWJraXRUcmFucyA9XG4gICAgd2luZG93Lm9udHJhbnNpdGlvbmVuZCA9PT0gdW5kZWZpbmVkICYmXG4gICAgd2luZG93Lm9ud2Via2l0dHJhbnNpdGlvbmVuZCAhPT0gdW5kZWZpbmVkXG4gIHZhciBpc1dlYmtpdEFuaW0gPVxuICAgIHdpbmRvdy5vbmFuaW1hdGlvbmVuZCA9PT0gdW5kZWZpbmVkICYmXG4gICAgd2luZG93Lm9ud2Via2l0YW5pbWF0aW9uZW5kICE9PSB1bmRlZmluZWRcbiAgZXhwb3J0cy50cmFuc2l0aW9uUHJvcCA9IGlzV2Via2l0VHJhbnNcbiAgICA/ICdXZWJraXRUcmFuc2l0aW9uJ1xuICAgIDogJ3RyYW5zaXRpb24nXG4gIGV4cG9ydHMudHJhbnNpdGlvbkVuZEV2ZW50ID0gaXNXZWJraXRUcmFuc1xuICAgID8gJ3dlYmtpdFRyYW5zaXRpb25FbmQnXG4gICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgZXhwb3J0cy5hbmltYXRpb25Qcm9wID0gaXNXZWJraXRBbmltXG4gICAgPyAnV2Via2l0QW5pbWF0aW9uJ1xuICAgIDogJ2FuaW1hdGlvbidcbiAgZXhwb3J0cy5hbmltYXRpb25FbmRFdmVudCA9IGlzV2Via2l0QW5pbVxuICAgID8gJ3dlYmtpdEFuaW1hdGlvbkVuZCdcbiAgICA6ICdhbmltYXRpb25lbmQnXG59IiwidmFyIF8gPSByZXF1aXJlKCcuL2RlYnVnJylcblxuLyoqXG4gKiBSZXNvbHZlIHJlYWQgJiB3cml0ZSBmaWx0ZXJzIGZvciBhIHZtIGluc3RhbmNlLiBUaGVcbiAqIGZpbHRlcnMgZGVzY3JpcHRvciBBcnJheSBjb21lcyBmcm9tIHRoZSBkaXJlY3RpdmUgcGFyc2VyLlxuICpcbiAqIFRoaXMgaXMgZXh0cmFjdGVkIGludG8gaXRzIG93biB1dGlsaXR5IHNvIGl0IGNhblxuICogYmUgdXNlZCBpbiBtdWx0aXBsZSBzY2VuYXJpb3MuXG4gKlxuICogQHBhcmFtIHtWdWV9IHZtXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGZpbHRlcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XVxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5cbmV4cG9ydHMucmVzb2x2ZUZpbHRlcnMgPSBmdW5jdGlvbiAodm0sIGZpbHRlcnMsIHRhcmdldCkge1xuICBpZiAoIWZpbHRlcnMpIHtcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgcmVzID0gdGFyZ2V0IHx8IHt9XG4gIC8vIHZhciByZWdpc3RyeSA9IHZtLiRvcHRpb25zLmZpbHRlcnNcbiAgZmlsdGVycy5mb3JFYWNoKGZ1bmN0aW9uIChmKSB7XG4gICAgdmFyIGRlZiA9IHZtLiRvcHRpb25zLmZpbHRlcnNbZi5uYW1lXVxuICAgIF8uYXNzZXJ0QXNzZXQoZGVmLCAnZmlsdGVyJywgZi5uYW1lKVxuICAgIGlmICghZGVmKSByZXR1cm5cbiAgICB2YXIgYXJncyA9IGYuYXJnc1xuICAgIHZhciByZWFkZXIsIHdyaXRlclxuICAgIGlmICh0eXBlb2YgZGVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZWFkZXIgPSBkZWZcbiAgICB9IGVsc2Uge1xuICAgICAgcmVhZGVyID0gZGVmLnJlYWRcbiAgICAgIHdyaXRlciA9IGRlZi53cml0ZVxuICAgIH1cbiAgICBpZiAocmVhZGVyKSB7XG4gICAgICBpZiAoIXJlcy5yZWFkKSByZXMucmVhZCA9IFtdXG4gICAgICByZXMucmVhZC5wdXNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gYXJnc1xuICAgICAgICAgID8gcmVhZGVyLmFwcGx5KHZtLCBbdmFsdWVdLmNvbmNhdChhcmdzKSlcbiAgICAgICAgICA6IHJlYWRlci5jYWxsKHZtLCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmICh3cml0ZXIpIHtcbiAgICAgIGlmICghcmVzLndyaXRlKSByZXMud3JpdGUgPSBbXVxuICAgICAgcmVzLndyaXRlLnB1c2goZnVuY3Rpb24gKHZhbHVlLCBvbGRWYWwpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NcbiAgICAgICAgICA/IHdyaXRlci5hcHBseSh2bSwgW3ZhbHVlLCBvbGRWYWxdLmNvbmNhdChhcmdzKSlcbiAgICAgICAgICA6IHdyaXRlci5jYWxsKHZtLCB2YWx1ZSwgb2xkVmFsKVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG4gIHJldHVybiByZXNcbn1cblxuLyoqXG4gKiBBcHBseSBmaWx0ZXJzIHRvIGEgdmFsdWVcbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge0FycmF5fSBmaWx0ZXJzXG4gKiBAcGFyYW0ge1Z1ZX0gdm1cbiAqIEBwYXJhbSB7Kn0gb2xkVmFsXG4gKiBAcmV0dXJuIHsqfVxuICovXG5cbmV4cG9ydHMuYXBwbHlGaWx0ZXJzID0gZnVuY3Rpb24gKHZhbHVlLCBmaWx0ZXJzLCB2bSwgb2xkVmFsKSB7XG4gIGlmICghZmlsdGVycykge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG4gIGZvciAodmFyIGkgPSAwLCBsID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YWx1ZSA9IGZpbHRlcnNbaV0uY2FsbCh2bSwgdmFsdWUsIG9sZFZhbClcbiAgfVxuICByZXR1cm4gdmFsdWVcbn0iLCJ2YXIgbGFuZyAgID0gcmVxdWlyZSgnLi9sYW5nJylcbnZhciBleHRlbmQgPSBsYW5nLmV4dGVuZFxuXG5leHRlbmQoZXhwb3J0cywgbGFuZylcbmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2VudicpKVxuZXh0ZW5kKGV4cG9ydHMsIHJlcXVpcmUoJy4vZG9tJykpXG5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9maWx0ZXInKSlcbmV4dGVuZChleHBvcnRzLCByZXF1aXJlKCcuL2RlYnVnJykpXG5leHRlbmQoZXhwb3J0cywgcmVxdWlyZSgnLi9taXNjJykpIiwiLyoqXG4gKiBDaGVjayBpcyBhIHN0cmluZyBzdGFydHMgd2l0aCAkIG9yIF9cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNSZXNlcnZlZCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgdmFyIGMgPSAoc3RyICsgJycpLmNoYXJDb2RlQXQoMClcbiAgcmV0dXJuIGMgPT09IDB4MjQgfHwgYyA9PT0gMHg1RlxufVxuXG4vKipcbiAqIEd1YXJkIHRleHQgb3V0cHV0LCBtYWtlIHN1cmUgdW5kZWZpbmVkIG91dHB1dHNcbiAqIGVtcHR5IHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuXG5leHBvcnRzLnRvU3RyaW5nID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgPyAnJ1xuICAgIDogdmFsdWUudG9TdHJpbmcoKVxufVxuXG4vKipcbiAqIENoZWNrIGFuZCBjb252ZXJ0IHBvc3NpYmxlIG51bWVyaWMgbnVtYmVycyBiZWZvcmVcbiAqIHNldHRpbmcgYmFjayB0byBkYXRhXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7KnxOdW1iZXJ9XG4gKi9cblxuZXhwb3J0cy50b051bWJlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gKFxuICAgIGlzTmFOKHZhbHVlKSB8fFxuICAgIHZhbHVlID09PSBudWxsIHx8XG4gICAgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbidcbiAgKSA/IHZhbHVlXG4gICAgOiBOdW1iZXIodmFsdWUpXG59XG5cbi8qKlxuICogU3RyaXAgcXVvdGVzIGZyb20gYSBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmcgfCBmYWxzZX1cbiAqL1xuXG5leHBvcnRzLnN0cmlwUXVvdGVzID0gZnVuY3Rpb24gKHN0cikge1xuICB2YXIgYSA9IHN0ci5jaGFyQ29kZUF0KDApXG4gIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoc3RyLmxlbmd0aCAtIDEpXG4gIHJldHVybiBhID09PSBiICYmIChhID09PSAweDIyIHx8IGEgPT09IDB4MjcpXG4gICAgPyBzdHIuc2xpY2UoMSwgLTEpXG4gICAgOiBmYWxzZVxufVxuXG4vKipcbiAqIFJlcGxhY2UgaGVscGVyXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IF8gLSBtYXRjaGVkIGRlbGltaXRlclxuICogQHBhcmFtIHtTdHJpbmd9IGMgLSBtYXRjaGVkIGNoYXJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdG9VcHBlciAoXywgYykge1xuICByZXR1cm4gYyA/IGMudG9VcHBlckNhc2UgKCkgOiAnJ1xufVxuXG4vKipcbiAqIENhbWVsaXplIGEgaHlwaGVuLWRlbG1pdGVkIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGNhbWVsUkUgPSAvLShcXHcpL2dcbmV4cG9ydHMuY2FtZWxpemUgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjYW1lbFJFLCB0b1VwcGVyKVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGh5cGhlbi91bmRlcnNjb3JlL3NsYXNoIGRlbGltaXRlcmVkIG5hbWVzIGludG9cbiAqIGNhbWVsaXplZCBjbGFzc05hbWVzLlxuICpcbiAqIGUuZy4gbXktY29tcG9uZW50ID0+IE15Q29tcG9uZW50XG4gKiAgICAgIHNvbWVfZWxzZSAgICA9PiBTb21lRWxzZVxuICogICAgICBzb21lL2NvbXAgICAgPT4gU29tZUNvbXBcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cblxudmFyIGNsYXNzaWZ5UkUgPSAvKD86XnxbLV9cXC9dKShcXHcpL2dcbmV4cG9ydHMuY2xhc3NpZnkgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZShjbGFzc2lmeVJFLCB0b1VwcGVyKVxufVxuXG4vKipcbiAqIFNpbXBsZSBiaW5kLCBmYXN0ZXIgdGhhbiBuYXRpdmVcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtPYmplY3R9IGN0eFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cblxuZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24gKGZuLCBjdHgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgdmFyIGwgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgcmV0dXJuIGxcbiAgICAgID8gbCA+IDFcbiAgICAgICAgPyBmbi5hcHBseShjdHgsIGFyZ3VtZW50cylcbiAgICAgICAgOiBmbi5jYWxsKGN0eCwgYSlcbiAgICAgIDogZm4uY2FsbChjdHgpXG4gIH1cbn1cblxuLyoqXG4gKiBDb252ZXJ0IGFuIEFycmF5LWxpa2Ugb2JqZWN0IHRvIGEgcmVhbCBBcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LWxpa2V9IGxpc3RcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3RhcnRdIC0gc3RhcnQgaW5kZXhcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG5cbmV4cG9ydHMudG9BcnJheSA9IGZ1bmN0aW9uIChsaXN0LCBzdGFydCkge1xuICBzdGFydCA9IHN0YXJ0IHx8IDBcbiAgdmFyIGkgPSBsaXN0Lmxlbmd0aCAtIHN0YXJ0XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoaSlcbiAgd2hpbGUgKGktLSkge1xuICAgIHJldFtpXSA9IGxpc3RbaSArIHN0YXJ0XVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBNaXggcHJvcGVydGllcyBpbnRvIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRvXG4gKiBAcGFyYW0ge09iamVjdH0gZnJvbVxuICovXG5cbmV4cG9ydHMuZXh0ZW5kID0gZnVuY3Rpb24gKHRvLCBmcm9tKSB7XG4gIGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgdG9ba2V5XSA9IGZyb21ba2V5XVxuICB9XG4gIHJldHVybiB0b1xufVxuXG4vKipcbiAqIFF1aWNrIG9iamVjdCBjaGVjayAtIHRoaXMgaXMgcHJpbWFyaWx5IHVzZWQgdG8gdGVsbFxuICogT2JqZWN0cyBmcm9tIHByaW1pdGl2ZSB2YWx1ZXMgd2hlbiB3ZSBrbm93IHRoZSB2YWx1ZVxuICogaXMgYSBKU09OLWNvbXBsaWFudCB0eXBlLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNPYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcbn1cblxuLyoqXG4gKiBTdHJpY3Qgb2JqZWN0IHR5cGUgY2hlY2suIE9ubHkgcmV0dXJucyB0cnVlXG4gKiBmb3IgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcbmV4cG9ydHMuaXNQbGFpbk9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSdcbn1cblxuLyoqXG4gKiBBcnJheSB0eXBlIGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNBcnJheSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKVxufVxuXG4vKipcbiAqIERlZmluZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2VudW1lcmFibGVdXG4gKi9cblxuZXhwb3J0cy5kZWZpbmUgPSBmdW5jdGlvbiAob2JqLCBrZXksIHZhbCwgZW51bWVyYWJsZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICB2YWx1ZSAgICAgICAgOiB2YWwsXG4gICAgZW51bWVyYWJsZSAgIDogISFlbnVtZXJhYmxlLFxuICAgIHdyaXRhYmxlICAgICA6IHRydWUsXG4gICAgY29uZmlndXJhYmxlIDogdHJ1ZVxuICB9KVxufVxuXG4vKipcbiAqIERlYm91bmNlIGEgZnVuY3Rpb24gc28gaXQgb25seSBnZXRzIGNhbGxlZCBhZnRlciB0aGVcbiAqIGlucHV0IHN0b3BzIGFycml2aW5nIGFmdGVyIHRoZSBnaXZlbiB3YWl0IHBlcmlvZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXG4gKiBAcGFyYW0ge051bWJlcn0gd2FpdFxuICogQHJldHVybiB7RnVuY3Rpb259IC0gdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICovXG5cbmV4cG9ydHMuZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdFxuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGFzdCA9IERhdGUubm93KCkgLSB0aW1lc3RhbXBcbiAgICBpZiAobGFzdCA8IHdhaXQgJiYgbGFzdCA+PSAwKSB7XG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsXG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpXG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbFxuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgY29udGV4dCA9IHRoaXNcbiAgICBhcmdzID0gYXJndW1lbnRzXG4gICAgdGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgIGlmICghdGltZW91dCkge1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpXG4gICAgfVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuXG4vKipcbiAqIE1hbnVhbCBpbmRleE9mIGJlY2F1c2UgaXQncyBzbGlnaHRseSBmYXN0ZXIgdGhhblxuICogbmF0aXZlLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyclxuICogQHBhcmFtIHsqfSBvYmpcbiAqL1xuXG5leHBvcnRzLmluZGV4T2YgPSBmdW5jdGlvbiAoYXJyLCBvYmopIHtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKGFycltpXSA9PT0gb2JqKSByZXR1cm4gaVxuICB9XG4gIHJldHVybiAtMVxufSIsInZhciBfID0gcmVxdWlyZSgnLi9pbmRleCcpXG52YXIgZXh0ZW5kID0gXy5leHRlbmRcblxuLyoqXG4gKiBPcHRpb24gb3ZlcndyaXRpbmcgc3RyYXRlZ2llcyBhcmUgZnVuY3Rpb25zIHRoYXQgaGFuZGxlXG4gKiBob3cgdG8gbWVyZ2UgYSBwYXJlbnQgb3B0aW9uIHZhbHVlIGFuZCBhIGNoaWxkIG9wdGlvblxuICogdmFsdWUgaW50byB0aGUgZmluYWwgdmFsdWUuXG4gKlxuICogQWxsIHN0cmF0ZWd5IGZ1bmN0aW9ucyBmb2xsb3cgdGhlIHNhbWUgc2lnbmF0dXJlOlxuICpcbiAqIEBwYXJhbSB7Kn0gcGFyZW50VmFsXG4gKiBAcGFyYW0geyp9IGNoaWxkVmFsXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXVxuICovXG5cbnZhciBzdHJhdHMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbi8qKlxuICogSGVscGVyIHRoYXQgcmVjdXJzaXZlbHkgbWVyZ2VzIHR3byBkYXRhIG9iamVjdHMgdG9nZXRoZXIuXG4gKi9cblxuZnVuY3Rpb24gbWVyZ2VEYXRhICh0bywgZnJvbSkge1xuICB2YXIga2V5LCB0b1ZhbCwgZnJvbVZhbFxuICBmb3IgKGtleSBpbiBmcm9tKSB7XG4gICAgdG9WYWwgPSB0b1trZXldXG4gICAgZnJvbVZhbCA9IGZyb21ba2V5XVxuICAgIGlmICghdG8uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgdG8uJGFkZChrZXksIGZyb21WYWwpXG4gICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHRvVmFsKSAmJiBfLmlzT2JqZWN0KGZyb21WYWwpKSB7XG4gICAgICBtZXJnZURhdGEodG9WYWwsIGZyb21WYWwpXG4gICAgfVxuICB9XG4gIHJldHVybiB0b1xufVxuXG4vKipcbiAqIERhdGFcbiAqL1xuXG5zdHJhdHMuZGF0YSA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsLCB2bSkge1xuICBpZiAoIXZtKSB7XG4gICAgLy8gaW4gYSBWdWUuZXh0ZW5kIG1lcmdlLCBib3RoIHNob3VsZCBiZSBmdW5jdGlvbnNcbiAgICBpZiAoIWNoaWxkVmFsKSB7XG4gICAgICByZXR1cm4gcGFyZW50VmFsXG4gICAgfVxuICAgIGlmICh0eXBlb2YgY2hpbGRWYWwgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIF8ud2FybihcbiAgICAgICAgJ1RoZSBcImRhdGFcIiBvcHRpb24gc2hvdWxkIGJlIGEgZnVuY3Rpb24gJyArXG4gICAgICAgICd0aGF0IHJldHVybnMgYSBwZXItaW5zdGFuY2UgdmFsdWUgaW4gY29tcG9uZW50ICcgK1xuICAgICAgICAnZGVmaW5pdGlvbnMuJ1xuICAgICAgKVxuICAgICAgcmV0dXJuIHBhcmVudFZhbFxuICAgIH1cbiAgICBpZiAoIXBhcmVudFZhbCkge1xuICAgICAgcmV0dXJuIGNoaWxkVmFsXG4gICAgfVxuICAgIC8vIHdoZW4gcGFyZW50VmFsICYgY2hpbGRWYWwgYXJlIGJvdGggcHJlc2VudCxcbiAgICAvLyB3ZSBuZWVkIHRvIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgICAvLyBtZXJnZWQgcmVzdWx0IG9mIGJvdGggZnVuY3Rpb25zLi4uIG5vIG5lZWQgdG9cbiAgICAvLyBjaGVjayBpZiBwYXJlbnRWYWwgaXMgYSBmdW5jdGlvbiBoZXJlIGJlY2F1c2VcbiAgICAvLyBpdCBoYXMgdG8gYmUgYSBmdW5jdGlvbiB0byBwYXNzIHByZXZpb3VzIG1lcmdlcy5cbiAgICByZXR1cm4gZnVuY3Rpb24gbWVyZ2VkRGF0YUZuICgpIHtcbiAgICAgIHJldHVybiBtZXJnZURhdGEoXG4gICAgICAgIGNoaWxkVmFsLmNhbGwodGhpcyksXG4gICAgICAgIHBhcmVudFZhbC5jYWxsKHRoaXMpXG4gICAgICApXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGluc3RhbmNlIG1lcmdlLCByZXR1cm4gcmF3IG9iamVjdFxuICAgIHZhciBpbnN0YW5jZURhdGEgPSB0eXBlb2YgY2hpbGRWYWwgPT09ICdmdW5jdGlvbidcbiAgICAgID8gY2hpbGRWYWwuY2FsbCh2bSlcbiAgICAgIDogY2hpbGRWYWxcbiAgICB2YXIgZGVmYXVsdERhdGEgPSB0eXBlb2YgcGFyZW50VmFsID09PSAnZnVuY3Rpb24nXG4gICAgICA/IHBhcmVudFZhbC5jYWxsKHZtKVxuICAgICAgOiB1bmRlZmluZWRcbiAgICBpZiAoaW5zdGFuY2VEYXRhKSB7XG4gICAgICByZXR1cm4gbWVyZ2VEYXRhKGluc3RhbmNlRGF0YSwgZGVmYXVsdERhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkZWZhdWx0RGF0YVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEVsXG4gKi9cblxuc3RyYXRzLmVsID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwsIHZtKSB7XG4gIGlmICghdm0gJiYgY2hpbGRWYWwgJiYgdHlwZW9mIGNoaWxkVmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgXy53YXJuKFxuICAgICAgJ1RoZSBcImVsXCIgb3B0aW9uIHNob3VsZCBiZSBhIGZ1bmN0aW9uICcgK1xuICAgICAgJ3RoYXQgcmV0dXJucyBhIHBlci1pbnN0YW5jZSB2YWx1ZSBpbiBjb21wb25lbnQgJyArXG4gICAgICAnZGVmaW5pdGlvbnMuJ1xuICAgIClcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgcmV0ID0gY2hpbGRWYWwgfHwgcGFyZW50VmFsXG4gIC8vIGludm9rZSB0aGUgZWxlbWVudCBmYWN0b3J5IGlmIHRoaXMgaXMgaW5zdGFuY2UgbWVyZ2VcbiAgcmV0dXJuIHZtICYmIHR5cGVvZiByZXQgPT09ICdmdW5jdGlvbidcbiAgICA/IHJldC5jYWxsKHZtKVxuICAgIDogcmV0XG59XG5cbi8qKlxuICogSG9va3MgYW5kIHBhcmFtIGF0dHJpYnV0ZXMgYXJlIG1lcmdlZCBhcyBhcnJheXMuXG4gKi9cblxuc3RyYXRzLmNyZWF0ZWQgPVxuc3RyYXRzLnJlYWR5ID1cbnN0cmF0cy5hdHRhY2hlZCA9XG5zdHJhdHMuZGV0YWNoZWQgPVxuc3RyYXRzLmJlZm9yZUNvbXBpbGUgPVxuc3RyYXRzLmNvbXBpbGVkID1cbnN0cmF0cy5iZWZvcmVEZXN0cm95ID1cbnN0cmF0cy5kZXN0cm95ZWQgPVxuc3RyYXRzLnByb3BzID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgcmV0dXJuIGNoaWxkVmFsXG4gICAgPyBwYXJlbnRWYWxcbiAgICAgID8gcGFyZW50VmFsLmNvbmNhdChjaGlsZFZhbClcbiAgICAgIDogXy5pc0FycmF5KGNoaWxkVmFsKVxuICAgICAgICA/IGNoaWxkVmFsXG4gICAgICAgIDogW2NoaWxkVmFsXVxuICAgIDogcGFyZW50VmFsXG59XG5cbi8qKlxuICogQXNzZXRzXG4gKlxuICogV2hlbiBhIHZtIGlzIHByZXNlbnQgKGluc3RhbmNlIGNyZWF0aW9uKSwgd2UgbmVlZCB0byBkb1xuICogYSB0aHJlZS13YXkgbWVyZ2UgYmV0d2VlbiBjb25zdHJ1Y3RvciBvcHRpb25zLCBpbnN0YW5jZVxuICogb3B0aW9ucyBhbmQgcGFyZW50IG9wdGlvbnMuXG4gKi9cblxuc3RyYXRzLmRpcmVjdGl2ZXMgPVxuc3RyYXRzLmZpbHRlcnMgPVxuc3RyYXRzLnRyYW5zaXRpb25zID1cbnN0cmF0cy5jb21wb25lbnRzID1cbnN0cmF0cy5lbGVtZW50RGlyZWN0aXZlcyA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsLCB2bSwga2V5KSB7XG4gIHZhciByZXQgPSBPYmplY3QuY3JlYXRlKFxuICAgIHZtICYmIHZtLiRwYXJlbnRcbiAgICAgID8gdm0uJHBhcmVudC4kb3B0aW9uc1trZXldXG4gICAgICA6IF8uVnVlLm9wdGlvbnNba2V5XVxuICApXG4gIGlmIChwYXJlbnRWYWwpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHBhcmVudFZhbClcbiAgICB2YXIgaSA9IGtleXMubGVuZ3RoXG4gICAgdmFyIGZpZWxkXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgZmllbGQgPSBrZXlzW2ldXG4gICAgICByZXRbZmllbGRdID0gcGFyZW50VmFsW2ZpZWxkXVxuICAgIH1cbiAgfVxuICBpZiAoY2hpbGRWYWwpIGV4dGVuZChyZXQsIGNoaWxkVmFsKVxuICByZXR1cm4gcmV0XG59XG5cbi8qKlxuICogRXZlbnRzICYgV2F0Y2hlcnMuXG4gKlxuICogRXZlbnRzICYgd2F0Y2hlcnMgaGFzaGVzIHNob3VsZCBub3Qgb3ZlcndyaXRlIG9uZVxuICogYW5vdGhlciwgc28gd2UgbWVyZ2UgdGhlbSBhcyBhcnJheXMuXG4gKi9cblxuc3RyYXRzLndhdGNoID1cbnN0cmF0cy5ldmVudHMgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICBpZiAoIWNoaWxkVmFsKSByZXR1cm4gcGFyZW50VmFsXG4gIGlmICghcGFyZW50VmFsKSByZXR1cm4gY2hpbGRWYWxcbiAgdmFyIHJldCA9IHt9XG4gIGV4dGVuZChyZXQsIHBhcmVudFZhbClcbiAgZm9yICh2YXIga2V5IGluIGNoaWxkVmFsKSB7XG4gICAgdmFyIHBhcmVudCA9IHJldFtrZXldXG4gICAgdmFyIGNoaWxkID0gY2hpbGRWYWxba2V5XVxuICAgIGlmIChwYXJlbnQgJiYgIV8uaXNBcnJheShwYXJlbnQpKSB7XG4gICAgICBwYXJlbnQgPSBbcGFyZW50XVxuICAgIH1cbiAgICByZXRba2V5XSA9IHBhcmVudFxuICAgICAgPyBwYXJlbnQuY29uY2F0KGNoaWxkKVxuICAgICAgOiBbY2hpbGRdXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIE90aGVyIG9iamVjdCBoYXNoZXMuXG4gKi9cblxuc3RyYXRzLm1ldGhvZHMgPVxuc3RyYXRzLmNvbXB1dGVkID0gZnVuY3Rpb24gKHBhcmVudFZhbCwgY2hpbGRWYWwpIHtcbiAgaWYgKCFjaGlsZFZhbCkgcmV0dXJuIHBhcmVudFZhbFxuICBpZiAoIXBhcmVudFZhbCkgcmV0dXJuIGNoaWxkVmFsXG4gIHZhciByZXQgPSBPYmplY3QuY3JlYXRlKHBhcmVudFZhbClcbiAgZXh0ZW5kKHJldCwgY2hpbGRWYWwpXG4gIHJldHVybiByZXRcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHN0cmF0ZWd5LlxuICovXG5cbnZhciBkZWZhdWx0U3RyYXQgPSBmdW5jdGlvbiAocGFyZW50VmFsLCBjaGlsZFZhbCkge1xuICByZXR1cm4gY2hpbGRWYWwgPT09IHVuZGVmaW5lZFxuICAgID8gcGFyZW50VmFsXG4gICAgOiBjaGlsZFZhbFxufVxuXG4vKipcbiAqIE1ha2Ugc3VyZSBjb21wb25lbnQgb3B0aW9ucyBnZXQgY29udmVydGVkIHRvIGFjdHVhbFxuICogY29uc3RydWN0b3JzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb21wb25lbnRzXG4gKi9cblxuZnVuY3Rpb24gZ3VhcmRDb21wb25lbnRzIChjb21wb25lbnRzKSB7XG4gIGlmIChjb21wb25lbnRzKSB7XG4gICAgdmFyIGRlZlxuICAgIGZvciAodmFyIGtleSBpbiBjb21wb25lbnRzKSB7XG4gICAgICBkZWYgPSBjb21wb25lbnRzW2tleV1cbiAgICAgIGlmIChfLmlzUGxhaW5PYmplY3QoZGVmKSkge1xuICAgICAgICBkZWYubmFtZSA9IGtleVxuICAgICAgICBjb21wb25lbnRzW2tleV0gPSBfLlZ1ZS5leHRlbmQoZGVmKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlIHR3byBvcHRpb24gb2JqZWN0cyBpbnRvIGEgbmV3IG9uZS5cbiAqIENvcmUgdXRpbGl0eSB1c2VkIGluIGJvdGggaW5zdGFudGlhdGlvbiBhbmQgaW5oZXJpdGFuY2UuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHBhcmVudFxuICogQHBhcmFtIHtPYmplY3R9IGNoaWxkXG4gKiBAcGFyYW0ge1Z1ZX0gW3ZtXSAtIGlmIHZtIGlzIHByZXNlbnQsIGluZGljYXRlcyB0aGlzIGlzXG4gKiAgICAgICAgICAgICAgICAgICAgIGFuIGluc3RhbnRpYXRpb24gbWVyZ2UuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtZXJnZU9wdGlvbnMgKHBhcmVudCwgY2hpbGQsIHZtKSB7XG4gIGd1YXJkQ29tcG9uZW50cyhjaGlsZC5jb21wb25lbnRzKVxuICB2YXIgb3B0aW9ucyA9IHt9XG4gIHZhciBrZXlcbiAgaWYgKGNoaWxkLm1peGlucykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGQubWl4aW5zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgcGFyZW50ID0gbWVyZ2VPcHRpb25zKHBhcmVudCwgY2hpbGQubWl4aW5zW2ldLCB2bSlcbiAgICB9XG4gIH1cbiAgZm9yIChrZXkgaW4gcGFyZW50KSB7XG4gICAgbWVyZ2Uoa2V5KVxuICB9XG4gIGZvciAoa2V5IGluIGNoaWxkKSB7XG4gICAgaWYgKCEocGFyZW50Lmhhc093blByb3BlcnR5KGtleSkpKSB7XG4gICAgICBtZXJnZShrZXkpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1lcmdlIChrZXkpIHtcbiAgICB2YXIgc3RyYXQgPSBzdHJhdHNba2V5XSB8fCBkZWZhdWx0U3RyYXRcbiAgICBvcHRpb25zW2tleV0gPSBzdHJhdChwYXJlbnRba2V5XSwgY2hpbGRba2V5XSwgdm0sIGtleSlcbiAgfVxuICByZXR1cm4gb3B0aW9uc1xufSIsIi8qKlxuICogQ2hlY2sgaWYgYW4gZWxlbWVudCBpcyBhIGNvbXBvbmVudCwgaWYgeWVzIHJldHVybiBpdHNcbiAqIGNvbXBvbmVudCBpZC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfHVuZGVmaW5lZH1cbiAqL1xuXG5leHBvcnRzLmNoZWNrQ29tcG9uZW50ID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG4gIHZhciB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgaWYgKHRhZyA9PT0gJ2NvbXBvbmVudCcpIHtcbiAgICAvLyBkeW5hbWljIHN5bnRheFxuICAgIHZhciBleHAgPSBlbC5nZXRBdHRyaWJ1dGUoJ2lzJylcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoJ2lzJylcbiAgICByZXR1cm4gZXhwXG4gIH0gZWxzZSBpZiAob3B0aW9ucy5jb21wb25lbnRzW3RhZ10pIHtcbiAgICByZXR1cm4gdGFnXG4gIH1cbn0iLCJ2YXIgXyA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgZXh0ZW5kID0gXy5leHRlbmRcblxuLyoqXG4gKiBUaGUgZXhwb3NlZCBWdWUgY29uc3RydWN0b3IuXG4gKlxuICogQVBJIGNvbnZlbnRpb25zOlxuICogLSBwdWJsaWMgQVBJIG1ldGhvZHMvcHJvcGVydGllcyBhcmUgcHJlZmlleGVkIHdpdGggYCRgXG4gKiAtIGludGVybmFsIG1ldGhvZHMvcHJvcGVydGllcyBhcmUgcHJlZml4ZWQgd2l0aCBgX2BcbiAqIC0gbm9uLXByZWZpeGVkIHByb3BlcnRpZXMgYXJlIGFzc3VtZWQgdG8gYmUgcHJveGllZCB1c2VyXG4gKiAgIGRhdGEuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gVnVlIChvcHRpb25zKSB7XG4gIHRoaXMuX2luaXQob3B0aW9ucylcbn1cblxuLyoqXG4gKiBNaXhpbiBnbG9iYWwgQVBJXG4gKi9cblxuZXh0ZW5kKFZ1ZSwgcmVxdWlyZSgnLi9hcGkvZ2xvYmFsJykpXG5cbi8qKlxuICogVnVlIGFuZCBldmVyeSBjb25zdHJ1Y3RvciB0aGF0IGV4dGVuZHMgVnVlIGhhcyBhblxuICogYXNzb2NpYXRlZCBvcHRpb25zIG9iamVjdCwgd2hpY2ggY2FuIGJlIGFjY2Vzc2VkIGR1cmluZ1xuICogY29tcGlsYXRpb24gc3RlcHMgYXMgYHRoaXMuY29uc3RydWN0b3Iub3B0aW9uc2AuXG4gKlxuICogVGhlc2UgY2FuIGJlIHNlZW4gYXMgdGhlIGRlZmF1bHQgb3B0aW9ucyBvZiBldmVyeVxuICogVnVlIGluc3RhbmNlLlxuICovXG5cblZ1ZS5vcHRpb25zID0ge1xuICBkaXJlY3RpdmVzICA6IHJlcXVpcmUoJy4vZGlyZWN0aXZlcycpLFxuICBmaWx0ZXJzICAgICA6IHJlcXVpcmUoJy4vZmlsdGVycycpLFxuICB0cmFuc2l0aW9ucyA6IHt9LFxuICBjb21wb25lbnRzICA6IHt9LFxuICBlbGVtZW50RGlyZWN0aXZlczoge31cbn1cblxuLyoqXG4gKiBCdWlsZCB1cCB0aGUgcHJvdG90eXBlXG4gKi9cblxudmFyIHAgPSBWdWUucHJvdG90eXBlXG5cbi8qKlxuICogJGRhdGEgaGFzIGEgc2V0dGVyIHdoaWNoIGRvZXMgYSBidW5jaCBvZlxuICogdGVhcmRvd24vc2V0dXAgd29ya1xuICovXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShwLCAnJGRhdGEnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhXG4gIH0sXG4gIHNldDogZnVuY3Rpb24gKG5ld0RhdGEpIHtcbiAgICBpZiAobmV3RGF0YSAhPT0gdGhpcy5fZGF0YSkge1xuICAgICAgdGhpcy5fc2V0RGF0YShuZXdEYXRhKVxuICAgIH1cbiAgfVxufSlcblxuLyoqXG4gKiBNaXhpbiBpbnRlcm5hbCBpbnN0YW5jZSBtZXRob2RzXG4gKi9cblxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vaW5zdGFuY2UvaW5pdCcpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vaW5zdGFuY2UvZXZlbnRzJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9pbnN0YW5jZS9zY29wZScpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vaW5zdGFuY2UvY29tcGlsZScpKVxuZXh0ZW5kKHAsIHJlcXVpcmUoJy4vaW5zdGFuY2UvbWlzYycpKVxuXG4vKipcbiAqIE1peGluIHB1YmxpYyBBUEkgbWV0aG9kc1xuICovXG5cbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9kYXRhJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvZG9tJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvZXZlbnRzJykpXG5leHRlbmQocCwgcmVxdWlyZSgnLi9hcGkvY2hpbGQnKSlcbmV4dGVuZChwLCByZXF1aXJlKCcuL2FwaS9saWZlY3ljbGUnKSlcblxubW9kdWxlLmV4cG9ydHMgPSBfLlZ1ZSA9IFZ1ZSIsInZhciBfID0gcmVxdWlyZSgnLi91dGlsJylcbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpXG52YXIgT2JzZXJ2ZXIgPSByZXF1aXJlKCcuL29ic2VydmVyJylcbnZhciBleHBQYXJzZXIgPSByZXF1aXJlKCcuL3BhcnNlcnMvZXhwcmVzc2lvbicpXG52YXIgYmF0Y2hlciA9IHJlcXVpcmUoJy4vYmF0Y2hlcicpXG52YXIgdWlkID0gMFxuXG4vKipcbiAqIEEgd2F0Y2hlciBwYXJzZXMgYW4gZXhwcmVzc2lvbiwgY29sbGVjdHMgZGVwZW5kZW5jaWVzLFxuICogYW5kIGZpcmVzIGNhbGxiYWNrIHdoZW4gdGhlIGV4cHJlc3Npb24gdmFsdWUgY2hhbmdlcy5cbiAqIFRoaXMgaXMgdXNlZCBmb3IgYm90aCB0aGUgJHdhdGNoKCkgYXBpIGFuZCBkaXJlY3RpdmVzLlxuICpcbiAqIEBwYXJhbSB7VnVlfSB2bVxuICogQHBhcmFtIHtTdHJpbmd9IGV4cHJlc3Npb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogICAgICAgICAgICAgICAgIC0ge0FycmF5fSBmaWx0ZXJzXG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gdHdvV2F5XG4gKiAgICAgICAgICAgICAgICAgLSB7Qm9vbGVhbn0gZGVlcFxuICogICAgICAgICAgICAgICAgIC0ge0Jvb2xlYW59IHVzZXJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbmZ1bmN0aW9uIFdhdGNoZXIgKHZtLCBleHByZXNzaW9uLCBjYiwgb3B0aW9ucykge1xuICB0aGlzLnZtID0gdm1cbiAgdm0uX3dhdGNoZXJMaXN0LnB1c2godGhpcylcbiAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvblxuICB0aGlzLmNicyA9IFtjYl1cbiAgdGhpcy5pZCA9ICsrdWlkIC8vIHVpZCBmb3IgYmF0Y2hpbmdcbiAgdGhpcy5hY3RpdmUgPSB0cnVlXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gIHRoaXMuZGVlcCA9ICEhb3B0aW9ucy5kZWVwXG4gIHRoaXMudXNlciA9ICEhb3B0aW9ucy51c2VyXG4gIHRoaXMuZGVwcyA9IFtdXG4gIHRoaXMubmV3RGVwcyA9IFtdXG4gIC8vIHNldHVwIGZpbHRlcnMgaWYgYW55LlxuICAvLyBXZSBkZWxlZ2F0ZSBkaXJlY3RpdmUgZmlsdGVycyBoZXJlIHRvIHRoZSB3YXRjaGVyXG4gIC8vIGJlY2F1c2UgdGhleSBuZWVkIHRvIGJlIGluY2x1ZGVkIGluIHRoZSBkZXBlbmRlbmN5XG4gIC8vIGNvbGxlY3Rpb24gcHJvY2Vzcy5cbiAgaWYgKG9wdGlvbnMuZmlsdGVycykge1xuICAgIHRoaXMucmVhZEZpbHRlcnMgPSBvcHRpb25zLmZpbHRlcnMucmVhZFxuICAgIHRoaXMud3JpdGVGaWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzLndyaXRlXG4gIH1cbiAgLy8gcGFyc2UgZXhwcmVzc2lvbiBmb3IgZ2V0dGVyL3NldHRlclxuICB2YXIgcmVzID0gZXhwUGFyc2VyLnBhcnNlKGV4cHJlc3Npb24sIG9wdGlvbnMudHdvV2F5KVxuICB0aGlzLmdldHRlciA9IHJlcy5nZXRcbiAgdGhpcy5zZXR0ZXIgPSByZXMuc2V0XG4gIHRoaXMudmFsdWUgPSB0aGlzLmdldCgpXG59XG5cbnZhciBwID0gV2F0Y2hlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBZGQgYSBkZXBlbmRlbmN5IHRvIHRoaXMgZGlyZWN0aXZlLlxuICpcbiAqIEBwYXJhbSB7RGVwfSBkZXBcbiAqL1xuXG5wLmFkZERlcCA9IGZ1bmN0aW9uIChkZXApIHtcbiAgdmFyIG5ld0RlcHMgPSB0aGlzLm5ld0RlcHNcbiAgdmFyIG9sZCA9IHRoaXMuZGVwc1xuICBpZiAoXy5pbmRleE9mKG5ld0RlcHMsIGRlcCkgPCAwKSB7XG4gICAgbmV3RGVwcy5wdXNoKGRlcClcbiAgICB2YXIgaSA9IF8uaW5kZXhPZihvbGQsIGRlcClcbiAgICBpZiAoaSA8IDApIHtcbiAgICAgIGRlcC5hZGRTdWIodGhpcylcbiAgICB9IGVsc2Uge1xuICAgICAgb2xkW2ldID0gbnVsbFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV2YWx1YXRlIHRoZSBnZXR0ZXIsIGFuZCByZS1jb2xsZWN0IGRlcGVuZGVuY2llcy5cbiAqL1xuXG5wLmdldCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5iZWZvcmVHZXQoKVxuICB2YXIgdm0gPSB0aGlzLnZtXG4gIHZhciB2YWx1ZVxuICB0cnkge1xuICAgIHZhbHVlID0gdGhpcy5nZXR0ZXIuY2FsbCh2bSwgdm0pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoY29uZmlnLndhcm5FeHByZXNzaW9uRXJyb3JzKSB7XG4gICAgICBfLndhcm4oXG4gICAgICAgICdFcnJvciB3aGVuIGV2YWx1YXRpbmcgZXhwcmVzc2lvbiBcIicgK1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gKyAnXCI6XFxuICAgJyArIGVcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgLy8gXCJ0b3VjaFwiIGV2ZXJ5IHByb3BlcnR5IHNvIHRoZXkgYXJlIGFsbCB0cmFja2VkIGFzXG4gIC8vIGRlcGVuZGVuY2llcyBmb3IgZGVlcCB3YXRjaGluZ1xuICBpZiAodGhpcy5kZWVwKSB7XG4gICAgdHJhdmVyc2UodmFsdWUpXG4gIH1cbiAgdmFsdWUgPSBfLmFwcGx5RmlsdGVycyh2YWx1ZSwgdGhpcy5yZWFkRmlsdGVycywgdm0pXG4gIHRoaXMuYWZ0ZXJHZXQoKVxuICByZXR1cm4gdmFsdWVcbn1cblxuLyoqXG4gKiBTZXQgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgd2l0aCB0aGUgc2V0dGVyLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuXG5wLnNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgdm0gPSB0aGlzLnZtXG4gIHZhbHVlID0gXy5hcHBseUZpbHRlcnMoXG4gICAgdmFsdWUsIHRoaXMud3JpdGVGaWx0ZXJzLCB2bSwgdGhpcy52YWx1ZVxuICApXG4gIHRyeSB7XG4gICAgdGhpcy5zZXR0ZXIuY2FsbCh2bSwgdm0sIHZhbHVlKVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGNvbmZpZy53YXJuRXhwcmVzc2lvbkVycm9ycykge1xuICAgICAgXy53YXJuKFxuICAgICAgICAnRXJyb3Igd2hlbiBldmFsdWF0aW5nIHNldHRlciBcIicgK1xuICAgICAgICB0aGlzLmV4cHJlc3Npb24gKyAnXCI6XFxuICAgJyArIGVcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcmVwYXJlIGZvciBkZXBlbmRlbmN5IGNvbGxlY3Rpb24uXG4gKi9cblxucC5iZWZvcmVHZXQgPSBmdW5jdGlvbiAoKSB7XG4gIE9ic2VydmVyLnRhcmdldCA9IHRoaXNcbn1cblxuLyoqXG4gKiBDbGVhbiB1cCBmb3IgZGVwZW5kZW5jeSBjb2xsZWN0aW9uLlxuICovXG5cbnAuYWZ0ZXJHZXQgPSBmdW5jdGlvbiAoKSB7XG4gIE9ic2VydmVyLnRhcmdldCA9IG51bGxcbiAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoXG4gIHdoaWxlIChpLS0pIHtcbiAgICB2YXIgZGVwID0gdGhpcy5kZXBzW2ldXG4gICAgaWYgKGRlcCkge1xuICAgICAgZGVwLnJlbW92ZVN1Yih0aGlzKVxuICAgIH1cbiAgfVxuICB0aGlzLmRlcHMgPSB0aGlzLm5ld0RlcHNcbiAgdGhpcy5uZXdEZXBzID0gW11cbn1cblxuLyoqXG4gKiBTdWJzY3JpYmVyIGludGVyZmFjZS5cbiAqIFdpbGwgYmUgY2FsbGVkIHdoZW4gYSBkZXBlbmRlbmN5IGNoYW5nZXMuXG4gKi9cblxucC51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghY29uZmlnLmFzeW5jIHx8IGNvbmZpZy5kZWJ1Zykge1xuICAgIHRoaXMucnVuKClcbiAgfSBlbHNlIHtcbiAgICBiYXRjaGVyLnB1c2godGhpcylcbiAgfVxufVxuXG4vKipcbiAqIEJhdGNoZXIgam9iIGludGVyZmFjZS5cbiAqIFdpbGwgYmUgY2FsbGVkIGJ5IHRoZSBiYXRjaGVyLlxuICovXG5cbnAucnVuID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmdldCgpXG4gICAgaWYgKFxuICAgICAgdmFsdWUgIT09IHRoaXMudmFsdWUgfHxcbiAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpIHx8XG4gICAgICB0aGlzLmRlZXBcbiAgICApIHtcbiAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMudmFsdWVcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgICAgdmFyIGNicyA9IHRoaXMuY2JzXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNicy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY2JzW2ldKHZhbHVlLCBvbGRWYWx1ZSlcbiAgICAgICAgLy8gaWYgYSBjYWxsYmFjayBhbHNvIHJlbW92ZWQgb3RoZXIgY2FsbGJhY2tzLFxuICAgICAgICAvLyB3ZSBuZWVkIHRvIGFkanVzdCB0aGUgbG9vcCBhY2NvcmRpbmdseS5cbiAgICAgICAgdmFyIHJlbW92ZWQgPSBsIC0gY2JzLmxlbmd0aFxuICAgICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICAgIGkgLT0gcmVtb3ZlZFxuICAgICAgICAgIGwgLT0gcmVtb3ZlZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQWRkIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5wLmFkZENiID0gZnVuY3Rpb24gKGNiKSB7XG4gIHRoaXMuY2JzLnB1c2goY2IpXG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2FsbGJhY2suXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAqL1xuXG5wLnJlbW92ZUNiID0gZnVuY3Rpb24gKGNiKSB7XG4gIHZhciBjYnMgPSB0aGlzLmNic1xuICBpZiAoY2JzLmxlbmd0aCA+IDEpIHtcbiAgICBjYnMuJHJlbW92ZShjYilcbiAgfSBlbHNlIGlmIChjYiA9PT0gY2JzWzBdKSB7XG4gICAgdGhpcy50ZWFyZG93bigpXG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmUgc2VsZiBmcm9tIGFsbCBkZXBlbmRlbmNpZXMnIHN1YmNyaWJlciBsaXN0LlxuICovXG5cbnAudGVhcmRvd24gPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIC8vIHJlbW92ZSBzZWxmIGZyb20gdm0ncyB3YXRjaGVyIGxpc3RcbiAgICAvLyB3ZSBjYW4gc2tpcCB0aGlzIGlmIHRoZSB2bSBpZiBiZWluZyBkZXN0cm95ZWRcbiAgICAvLyB3aGljaCBjYW4gaW1wcm92ZSB0ZWFyZG93biBwZXJmb3JtYW5jZS5cbiAgICBpZiAoIXRoaXMudm0uX2lzQmVpbmdEZXN0cm95ZWQpIHtcbiAgICAgIHRoaXMudm0uX3dhdGNoZXJMaXN0LiRyZW1vdmUodGhpcylcbiAgICB9XG4gICAgdmFyIGkgPSB0aGlzLmRlcHMubGVuZ3RoXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgdGhpcy5kZXBzW2ldLnJlbW92ZVN1Yih0aGlzKVxuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy52bSA9IHRoaXMuY2JzID0gdGhpcy52YWx1ZSA9IG51bGxcbiAgfVxufVxuXG5cbi8qKlxuICogUmVjcnVzaXZlbHkgdHJhdmVyc2UgYW4gb2JqZWN0IHRvIGV2b2tlIGFsbCBjb252ZXJ0ZWRcbiAqIGdldHRlcnMsIHNvIHRoYXQgZXZlcnkgbmVzdGVkIHByb3BlcnR5IGluc2lkZSB0aGUgb2JqZWN0XG4gKiBpcyBjb2xsZWN0ZWQgYXMgYSBcImRlZXBcIiBkZXBlbmRlbmN5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqL1xuXG5mdW5jdGlvbiB0cmF2ZXJzZSAob2JqKSB7XG4gIHZhciBrZXksIHZhbCwgaVxuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICB2YWwgPSBvYmpba2V5XVxuICAgIGlmIChfLmlzQXJyYXkodmFsKSkge1xuICAgICAgaSA9IHZhbC5sZW5ndGhcbiAgICAgIHdoaWxlIChpLS0pIHRyYXZlcnNlKHZhbFtpXSlcbiAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3QodmFsKSkge1xuICAgICAgdHJhdmVyc2UodmFsKVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFdhdGNoZXIiLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcblx0PGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBjb2wtc20tMlwiPnt7IGZpZWxkLmxhYmVsIH19PC9sYWJlbD5cXG5cdDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPlxcblx0XHQ8c2VsZWN0IHYtaWY9XCJvcHRpb25zXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB2LW1vZGVsPVwidmFsdWVcIiBvcHRpb25zPVwib3B0aW9uc1wiIHYtYXR0cj1cInJlcXVpcmVkOiBmaWVsZC5yZXF1aXJlZFwiPjwvc2VsZWN0Plxcblx0XHQ8cCB2LWlmPVwiIW9wdGlvbnNcIiBjbGFzcz1cImZvcm0tY29udHJvbC1zdGF0aWNcIj5cXG5cdFx0XHQ8ZW0gY2xhc3M9XCJ0ZXh0LW11dGVkXCI+TG9hZGluZyB7eyBmaWVsZC5sYWJlbCB8IGxvd2VyY2FzZSB8IHBsdXJhbCB9fSZoZWxsaXA7PC9lbT5cXG5cdFx0PC9wPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCJ2YXIgRmlyZWJhc2UgPSByZXF1aXJlKCdmaXJlYmFzZScpXG5cbnZhciBmaWVsZCA9IHJlcXVpcmUoJy4uL2ZpZWxkJylcbnZhciB2YWx1ZVRvUHJvcGVydHkgPSByZXF1aXJlKCcuLi92YWx1ZVRvUHJvcGVydHknKVxudmFyIG1vZGVscyA9IHJlcXVpcmUoJy4uLy4uLy4uL21vZGVscycpXG52YXIgZGF0YVJlZiA9IG5ldyBGaXJlYmFzZSgnaHR0cHM6Ly9lbnRyaWVzLmZpcmViYXNlSU8uY29tL2RhdGEvJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG1peGluczogW2ZpZWxkLCB2YWx1ZVRvUHJvcGVydHldLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi9lbnRyeS5odG1sJyksXG5cdGRhdGE6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0b3B0aW9uczogbnVsbFxuXHRcdH1cblx0fSxcblx0Y29tcGlsZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbW9kZWwgPSBtb2RlbHNbdGhpcy5maWVsZC5tb2RlbF1cblxuXHRcdGRhdGFSZWYuY2hpbGQobW9kZWwucHJvcGVydHkpLm9uY2UoJ3ZhbHVlJywgZnVuY3Rpb24gKHNuYXBzaG90KSB7XG5cdFx0XHQvLyBUT0RPOiBmaWd1cmUgb3V0IGJldHRlciBcInVuc2VsZWN0ZWRcIiBvcHRpb25cblx0XHRcdC8vICAgICAgIGlkZWFsbHkgYWxsb3cgdGhlIGRpc2FibGVkIGF0dHJpYnV0ZSBpbiBoZXJlXG5cdFx0XHR2YXIgb3B0aW9ucyA9IFt7IHRleHQ6ICcnLCB2YWx1ZTogbnVsbCB9XVxuXHRcdFx0c25hcHNob3QuZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcblx0XHRcdFx0b3B0aW9ucy5wdXNoKHtcblx0XHRcdFx0XHR2YWx1ZTogY2hpbGQucmVmKCkudG9TdHJpbmcoKSxcblx0XHRcdFx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgcHJvcGVydHkgY29uZmlndXJhYmxlXG5cdFx0XHRcdFx0dGV4dDogY2hpbGQudmFsKCkubmFtZVxuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcblx0XHR9LmJpbmQodGhpcykpXG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRyZXBsYWNlOiB0cnVlLFxuXHRwcm9wczogWydmaWVsZCcsICdlbnRyeSddXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcblx0PGRpdiBjbGFzcz1cImNvbC1zbS1vZmZzZXQtMiBjb2wtc20tNlwiPlxcblx0XHQ8ZW0gY2xhc3M9XCJ0ZXh0LW11dGVkXCIgdi1pZj1cInVwbG9hZGluZ1wiPlVwbG9hZGluZyZoZWxsaXA7PC9lbT5cXG5cdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiB2LWlmPVwiIXZhbHVlICYmICF1cGxvYWRpbmdcIiB2LW9uPVwiY2xpY2s6IHVwbG9hZFwiPlVwbG9hZCB7eyBmaWVsZC5sYWJlbCB8IGxvd2VyY2FzZSB9fTwvYnV0dG9uPlxcblx0XHQ8dGVtcGxhdGUgdi1pZj1cInZhbHVlICYmICF1cGxvYWRpbmdcIj5cXG5cdFx0XHQ8aW1nIGNsYXNzPVwiaW1nLXRodW1ibmFpbCBjbGlja2FibGVcIiB2LWF0dHI9XCJzcmM6IHRodW1ibmFpbFwiIHYtb249XCJjbGljazogdXBsb2FkXCI+XFxuXHRcdFx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXhzIGJ0bi1kZWZhdWx0XCIgdi1vbj1cImNsaWNrOiByZW1vdmVcIj5SZW1vdmUge3sgZmllbGQubGFiZWwgfCBsb3dlcmNhc2UgfX08L2J1dHRvbj5cXG5cdFx0PC90ZW1wbGF0ZT5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwidmFyIGZpZWxkID0gcmVxdWlyZSgnLi4vZmllbGQnKVxudmFyIHZhbHVlVG9Qcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL3ZhbHVlVG9Qcm9wZXJ0eScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRtaXhpbnM6IFtmaWVsZCwgdmFsdWVUb1Byb3BlcnR5XSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vaW1hZ2UuaHRtbCcpLFxuXHRkYXRhOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVwbG9hZGluZzogZmFsc2Vcblx0XHR9XG5cdH0sXG5cdGNvbXB1dGVkOiB7XG5cdFx0dGh1bWJuYWlsOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy52YWx1ZSArICctL3Jlc2l6ZS8zMDAvJ1xuXHRcdH1cblx0fSxcblx0bWV0aG9kczoge1xuXHRcdHVwbG9hZDogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRcdHZhciB2bSA9IHRoaXNcblxuXHRcdFx0dXBsb2FkY2FyZS5vcGVuRGlhbG9nKG51bGwsIHtcblx0XHRcdFx0Y3JvcDogJ2Rpc2FibGVkJyxcblx0XHRcdFx0aW1hZ2VzT25seTogdHJ1ZVxuXHRcdFx0fSlcblx0XHRcdC5kb25lKGZ1bmN0aW9uIChmaWxlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdVcGxvYWRpbmcgZmlsZTonLCBmaWxlKVxuXHRcdFx0XHR2bS51cGxvYWRpbmcgPSB0cnVlXG5cblx0XHRcdFx0ZmlsZS5wcm9taXNlKClcblx0XHRcdFx0LmFsd2F5cyhmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dm0udXBsb2FkaW5nID0gZmFsc2Vcblx0XHRcdFx0fSlcblx0XHRcdFx0LmRvbmUoZnVuY3Rpb24gKGZpbGVJbmZvKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ1VwbG9hZGVkIGZpbGUgZGF0YTonLCBmaWxlSW5mbylcblx0XHRcdFx0XHR2bS52YWx1ZSA9IGZpbGVJbmZvLm9yaWdpbmFsVXJsXG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblx0XHRcdHRoaXMudmFsdWUgPSBudWxsXG5cdFx0fVxuXHR9XG59XG4iLCJ2YXIgZmllbGQgPSByZXF1aXJlKCcuLi9maWVsZCcpXG52YXIgdmFsdWVUb1Byb3BlcnR5ID0gcmVxdWlyZSgnLi4vdmFsdWVUb1Byb3BlcnR5JylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG1peGluczogW2ZpZWxkLCB2YWx1ZVRvUHJvcGVydHldLFxuXHR0ZW1wbGF0ZTogcmVxdWlyZSgnLi9tYXJrZG93bi5odG1sJylcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gJzxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XFxuXHQ8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGNvbC1zbS0yXCI+e3sgZmllbGQubGFiZWwgfX08L2xhYmVsPlxcblx0PGRpdiBjbGFzcz1cImNvbC1zbS02XCI+XFxuXHRcdDx0ZXh0YXJlYSByb3dzPVwiMTJcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHYtbW9kZWw9XCJ2YWx1ZVwiIHYtYXR0cj1cInJlcXVpcmVkOiBmaWVsZC5yZXF1aXJlZFwiPjwvdGV4dGFyZWE+XFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nOyIsInZhciBmaWVsZCA9IHJlcXVpcmUoJy4uL2ZpZWxkJylcbnZhciB2YWx1ZVRvUHJvcGVydHkgPSByZXF1aXJlKCcuLi92YWx1ZVRvUHJvcGVydHknKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bWl4aW5zOiBbZmllbGQsIHZhbHVlVG9Qcm9wZXJ0eV0sXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL3RleHQuaHRtbCcpLFxuXHRjb21wdXRlZDoge1xuXHRcdGlucHV0VHlwZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0c3dpdGNoICh0aGlzLmZpZWxkLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSAndGV4dCc6XG5cdFx0XHRcdGNhc2UgJ2VtYWlsJzpcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5maWVsZC50eXBlXG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gJ3RleHQnXG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxcblx0PGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBjb2wtc20tMlwiPnt7IGZpZWxkLmxhYmVsIH19PC9sYWJlbD5cXG5cdDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPlxcblx0XHQ8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB2LW1vZGVsPVwidmFsdWVcIiB2LWF0dHI9XCJ0eXBlOiBpbnB1dFR5cGUsIHJlcXVpcmVkOiBmaWVsZC5yZXF1aXJlZFwiPlxcblx0PC9kaXY+XFxuPC9kaXY+XFxuJzsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0Y29tcHV0ZWQ6IHtcblx0XHR2YWx1ZToge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGlmICh0aGlzLmVudHJ5ICYmIHRoaXMuZmllbGQgJiYgdGhpcy5maWVsZC5wcm9wZXJ0eSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmVudHJ5W3RoaXMuZmllbGQucHJvcGVydHldXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRpZiAodGhpcy5lbnRyeSAmJiB0aGlzLmZpZWxkICYmIHRoaXMuZmllbGQucHJvcGVydHkpIHtcblx0XHRcdFx0XHR0aGlzLmVudHJ5LiRzZXQodGhpcy5maWVsZC5wcm9wZXJ0eSwgdmFsdWUpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRwcm9wczogWydtb2RlbHMnLCAnbW9kZWwnXSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vbmF2Lmh0bWwnKSxcblx0bWV0aG9kczoge1xuXHRcdGlzQWN0aXZlOiBmdW5jdGlvbiAocHJvcGVydHkpIHtcblx0XHRcdHJldHVybiBwcm9wZXJ0eSA9PT0gdGhpcy5tb2RlbFxuXHRcdH1cblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cXG5cdDxhIHYtcmVwZWF0PVwibW9kZWxzXCIgaHJlZj1cIiMve3sgcHJvcGVydHkgfX1cIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbVwiIHYtY2xhc3M9XCJhY3RpdmU6IGlzQWN0aXZlKHByb3BlcnR5KVwiPnt7IGxhYmVsIHwgcGx1cmFsIH19PC9hPlxcbjwvZGl2Plxcbic7IiwibW9kdWxlLmV4cG9ydHMgPSAnPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxcblx0PGRpdiBjbGFzcz1cInJvd1wiPlxcblx0XHQ8ZGl2IGNsYXNzPVwiY29sLXNtLTJcIj5cXG5cdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIHBsYWNlaG9sZGVyPVwiRmluZCBjb250ZW50JmhlbGxpcDtcIj5cXG5cdFx0XHQ8aHI+XFxuXHRcdFx0PG5hdiBtb2RlbHM9XCJ7eyBtb2RlbHMgfX1cIiBtb2RlbD1cInt7IHJvdXRlLnBhcmFtcy5tb2RlbCB9fVwiPjwvbmF2Plxcblx0XHQ8L2Rpdj5cXG5cdFx0PGRpdiBjbGFzcz1cImNvbC1zbS0xMFwiPlxcblx0XHRcdDxyb3V0ZXItdmlldz48L3JvdXRlci12aWV3Plxcblx0XHQ8L2Rpdj5cXG5cdDwvZGl2PlxcbjwvZGl2Plxcbic7IiwidmFyIFZ1ZSA9IHJlcXVpcmUoJ3Z1ZScpXG52YXIgUm91dGVyID0gcmVxdWlyZSgndnVlLXJvdXRlcicpXG52YXIgcGx1cmFsaXplID0gcmVxdWlyZSgncGx1cmFsaXplJylcblxudmFyIG1vZGVscyA9IHJlcXVpcmUoJy4vbW9kZWxzJylcblxuXG5WdWUudXNlKFJvdXRlcilcblxuXG52YXIgYXBwID0gbmV3IFZ1ZSh7XG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL2NvbnRhaW5lci5odG1sJyksXG5cdGNvbXBvbmVudHM6IHtcblx0XHRuYXY6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9uYXYnKSxcblx0XHQndmlldy1lbnRyaWVzJzogcmVxdWlyZSgnLi92aWV3cy9lbnRyaWVzJyksXG5cdFx0J3ZpZXctZW50cnknOiByZXF1aXJlKCcuL3ZpZXdzL2VudHJ5Jylcblx0fSxcblx0ZmlsdGVyczoge1xuXHRcdHBsdXJhbDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gcGx1cmFsaXplKHZhbHVlKVxuXHRcdH1cblx0fSxcblx0ZGF0YTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR2aWV3OiBudWxsLFxuXHRcdFx0YWN0aXZlTW9kZWw6IG51bGwsXG5cdFx0XHRtb2RlbDogbnVsbCxcblx0XHRcdGFjdGl2ZUVudHJ5OiBudWxsLFxuXHRcdFx0ZW50cnk6IG51bGxcblx0XHR9XG5cdH0sXG5cdGNvbXB1dGVkOiB7XG5cdFx0bW9kZWxzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gbW9kZWxzXG5cdFx0fVxuXHR9XG59KVxuXG5cbnZhciByb3V0ZXIgPSBuZXcgUm91dGVyKHsgaGFzaGJhbmc6IGZhbHNlIH0pXG5cbnJvdXRlci5tYXAoe1xuXHQnLzptb2RlbCc6IHtcblx0XHRjb21wb25lbnQ6ICd2aWV3LWVudHJpZXMnXG5cdH0sXG5cdCcvOm1vZGVsLzppZCc6IHtcblx0XHRjb21wb25lbnQ6ICd2aWV3LWVudHJ5J1xuXHR9XG59KVxuXG5yb3V0ZXIucmVkaXJlY3Qoe1xuXHQnLyc6ICcvJyArIG1vZGVsc1tPYmplY3Qua2V5cyhtb2RlbHMpWzBdXS5wcm9wZXJ0eVxufSlcblxuLy8gcm91dGVyLm9uKCcvJywgZnVuY3Rpb24gKCkge1xuLy8gXHRmb3IgKHZhciBrIGluIG1vZGVscykge1xuLy8gXHRcdGxvY2F0aW9uLnJlcGxhY2UoJyMvJyArIG1vZGVsc1trXS5wcm9wZXJ0eSlcbi8vIFx0XHRyZXR1cm5cbi8vIFx0fVxuLy8gfSlcblxuLy8gcm91dGVyLm9uKCcvOnR5cGUnLCBmdW5jdGlvbiAodHlwZSkge1xuLy8gXHRhcHAudmlldyA9ICdlbnRyaWVzVmlldydcbi8vIFx0YXBwLm1vZGVsID0gbW9kZWxzW3R5cGVdXG4vLyBcdGFwcC5hY3RpdmVNb2RlbCA9IGFwcC5tb2RlbCA/IHR5cGUgOiBudWxsXG4vLyB9KVxuXG4vLyByb3V0ZXIub24oJy86dHlwZS86aWQnLCBmdW5jdGlvbiAodHlwZSwgaWQpIHtcbi8vIFx0YXBwLnZpZXcgPSAnZW50cnlWaWV3J1xuLy8gXHRhcHAubW9kZWwgPSBtb2RlbHNbdHlwZV1cbi8vIFx0YXBwLmFjdGl2ZU1vZGVsID0gYXBwLm1vZGVsID8gdHlwZSA6IG51bGxcbi8vIFx0YXBwLmFjdGl2ZUVudHJ5ID0gaWRcbi8vIH0pXG5cbi8vIHJvdXRlci5jb25maWd1cmUoe1xuLy8gXHRub3Rmb3VuZDogZnVuY3Rpb24gKCkge1xuLy8gXHRcdGNvbnNvbGUubG9nKCdObyByb3V0ZSBmb3VuZCBmb3IgcGF0aDonLCB0aGlzLnBhdGgpXG4vLyBcdH1cbi8vIH0pXG5cbnJvdXRlci5zdGFydChhcHApXG5hcHAuJG1vdW50KGRvY3VtZW50LmJvZHkpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0bGFiZWw6ICdBdXRob3InLFxuXHRwcm9wZXJ0eTogJ2F1dGhvcnMnLFxuXHR0eXBlOiAnY29sbGVjdGlvbicsXG5cdGZpZWxkczogW1xuXHRcdHtcblx0XHRcdGxhYmVsOiAnTmFtZScsXG5cdFx0XHRwcm9wZXJ0eTogJ25hbWUnLFxuXHRcdFx0dHlwZTogJ3RleHQnLFxuXHRcdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRsaXN0ZWQ6IHRydWVcblx0XHR9LFxuXHRcdHtcblx0XHRcdGxhYmVsOiAnVHdpdHRlcicsXG5cdFx0XHRwcm9wZXJ0eTogJ3R3aXR0ZXInLFxuXHRcdFx0dHlwZTogJ3RleHQnLFxuXHRcdFx0cmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRsaXN0ZWQ6IHRydWVcblx0XHR9XG5cdF1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRwb3N0czogcmVxdWlyZSgnLi9wb3N0JyksXG5cdGF1dGhvcnM6IHJlcXVpcmUoJy4vYXV0aG9yJylcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRsYWJlbDogJ0Jsb2cgcG9zdCcsXG5cdHByb3BlcnR5OiAncG9zdHMnLFxuXHR0eXBlOiAnY29sbGVjdGlvbicsXG5cdGZpZWxkczogW1xuXHRcdHtcblx0XHRcdGxhYmVsOiAnVGl0bGUnLFxuXHRcdFx0cHJvcGVydHk6ICd0aXRsZScsXG5cdFx0XHR0eXBlOiAndGV4dCcsXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZSxcblx0XHRcdGxpc3RlZDogdHJ1ZVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdBdXRob3InLFxuXHRcdFx0cHJvcGVydHk6ICdhdXRob3InLFxuXHRcdFx0dHlwZTogJ2VudHJ5Jyxcblx0XHRcdG1vZGVsOiAnYXV0aG9ycycsXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdIZWFkZXIgaW1hZ2UnLFxuXHRcdFx0cHJvcGVydHk6ICdoZWFkZXJfaW1hZ2UnLFxuXHRcdFx0dHlwZTogJ2ltYWdlJ1xuXHRcdH0sXG5cdFx0e1xuXHRcdFx0bGFiZWw6ICdQb3N0IGJvZHknLFxuXHRcdFx0cHJvcGVydHk6ICdib2R5Jyxcblx0XHRcdHR5cGU6ICdtYXJrZG93bicsXG5cdFx0XHRyZXF1aXJlZDogdHJ1ZVxuXHRcdH1cblx0XVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSAnPHRlbXBsYXRlIHYtaWY9XCJtb2RlbFwiPlxcblx0PGEgaHJlZj1cIiMve3sgbW9kZWwucHJvcGVydHkgfX0vbmV3XCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3MgcHVsbC1yaWdodFwiPkFkZCBuZXcge3sgbW9kZWwubGFiZWwgfCBsb3dlcmNhc2UgfX08L2E+XFxuXHQ8dGFibGUgY2xhc3M9XCJ0YWJsZSB0YWJsZS1ob3ZlclwiPlxcblx0XHQ8dGhlYWQ+XFxuXHRcdFx0PHRyPlxcblx0XHRcdFx0PHRoIHYtcmVwZWF0PVwiZmllbGRzXCI+e3sgbGFiZWwgfX08L3RoPlxcblx0XHRcdDwvdHI+XFxuXHRcdDwvdGhlYWQ+XFxuXHRcdDx0Ym9keSB2LWlmPVwiZW50cmllc1wiPlxcblx0XHRcdDx0ciB2LXJlcGVhdD1cImVudHJ5IDogZW50cmllc1wiIHYtb249XCJjbGljazogZWRpdCgkZXZlbnQsICRrZXkpXCIgZGF0YS1pZD1cInt7ICRrZXkgfX1cIiBjbGFzcz1cImNsaWNrYWJsZVwiPlxcblx0XHRcdFx0PHRkIHYtcmVwZWF0PVwiZmllbGRzXCI+e3sgZW50cnlbcHJvcGVydHldIH19PC90ZD5cXG5cdFx0XHQ8L3RyPlxcblx0XHQ8L3Rib2R5Plxcblx0XHQ8dGJvZHkgdi1pZj1cIiFlbnRyaWVzXCI+XFxuXHRcdFx0PHRyPlxcblx0XHRcdFx0PHRkIGNvbHNwYW49XCJ7eyBtb2RlbC5maWVsZHMubGVuZ3RoIH19XCI+XFxuXHRcdFx0XHRcdDxlbSBjbGFzcz1cInRleHQtbXV0ZWRcIj5Mb2FkaW5nIHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIHwgcGx1cmFsIH19JmhlbGxpcDs8L2VtPlxcblx0XHRcdFx0PC90ZD5cXG5cdFx0XHQ8L3RyPlxcblx0XHQ8L3Rib2R5Plxcblx0PC90YWJsZT5cXG48L3RlbXBsYXRlPlxcbic7IiwidmFyIEZpcmViYXNlID0gcmVxdWlyZSgnZmlyZWJhc2UnKVxudmFyIG1vZGVscyA9IHJlcXVpcmUoJy4uLy4uL21vZGVscycpXG5cbnZhciBkYXRhUmVmID0gbmV3IEZpcmViYXNlKCdodHRwczovL2VudHJpZXMuZmlyZWJhc2VJTy5jb20vZGF0YS8nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5oZXJpdDogdHJ1ZSxcblx0dGVtcGxhdGU6IHJlcXVpcmUoJy4vZW50cmllcy5odG1sJyksXG5cdG1ldGhvZHM6IHtcblx0XHRlZGl0OiBmdW5jdGlvbiAoZXZlbnQsIGlkKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRpZiAoaWQpIHtcblx0XHRcdFx0bG9jYXRpb24uYXNzaWduKCcjLycgKyB0aGlzLm1vZGVsLnByb3BlcnR5ICsgJy8nICsgaWQpXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRjb21wdXRlZDoge1xuXHRcdG1vZGVsOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gbW9kZWxzW3RoaXMucm91dGUucGFyYW1zLm1vZGVsXVxuXHRcdH0sXG5cdFx0ZmllbGRzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RlbC5maWVsZHMuZmlsdGVyKGZ1bmN0aW9uIChmaWx0ZXIpIHtcblx0XHRcdFx0cmV0dXJuIGZpbHRlci5saXN0ZWRcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRlbnRyaWVzUmVmOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZGF0YVJlZi5jaGlsZCh0aGlzLm1vZGVsLnByb3BlcnR5KVxuXHRcdH1cblx0fSxcblx0Y3JlYXRlZDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuZW50cmllc1JlZi5vbmNlKCd2YWx1ZScsIGZ1bmN0aW9uIChzbmFwc2hvdCkge1xuXHRcdFx0dGhpcy4kc2V0KCdlbnRyaWVzJywgc25hcHNob3QudmFsKCkpXG5cdFx0fS5iaW5kKHRoaXMpKVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICc8dGVtcGxhdGUgdi1pZj1cImVudHJ5XCI+XFxuXHQ8Zm9ybSB2LW9uPVwic3VibWl0OiBzYXZlKCRldmVudClcIiBjbGFzcz1cImZvcm0taG9yaXpvbnRhbFwiPlxcblx0XHQ8ZmllbGRzZXQ+XFxuXHRcdFx0PGxlZ2VuZCB2LWlmPVwiaXNOZXdcIj5cXG5cdFx0XHRcdE5ldyB7eyBtb2RlbC5sYWJlbCB8IGxvd2VyY2FzZSB9fVxcblx0XHRcdDwvbGVnZW5kPlxcblx0XHRcdDxsZWdlbmQgdi1pZj1cIiFpc05ld1wiPlxcblx0XHRcdFx0RWRpdCB7eyBtb2RlbC5sYWJlbCB8IGxvd2VyY2FzZSB9fVxcblx0XHRcdFx0PHNtYWxsIGNsYXNzPVwidGV4dC1tdXRlZCBwdWxsLXJpZ2h0XCI+e3sgaWQgfX08L3NtYWxsPlxcblx0XHRcdDwvbGVnZW5kPlxcblxcblx0XHRcdDx0ZW1wbGF0ZSB2LXJlcGVhdD1cImZpZWxkOiBtb2RlbC5maWVsZHNcIj5cXG5cdFx0XHRcdDxjb21wb25lbnQgaXM9XCJ7eyBjb21wb25lbnRGb3IoZmllbGQudHlwZSkgfX1cIiBmaWVsZD1cInt7IGZpZWxkIH19XCIgZW50cnk9XCJ7eyBlbnRyeSB9fVwiPjwvY29tcG9uZW50Plxcblx0XHRcdDwvdGVtcGxhdGU+XFxuXHRcdFx0PGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjb2wtc20tb2Zmc2V0LTIgY29sLXNtLTJcIj5cXG5cdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tc3VjY2VzcyBidG4tbGdcIiB0eXBlPVwic3VibWl0XCI+U2F2ZTwvYnV0dG9uPlxcblx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0PC9kaXY+XFxuXHRcdDwvZmllbGRzZXQ+XFxuXHQ8L2Zvcm0+XFxuXHQ8cCBjbGFzcz1cInRleHQtcmlnaHRcIiB2LWlmPVwiIWlzTmV3XCI+XFxuXHRcdDxidXR0b24gdi1vbj1cImNsaWNrOiByZW1vdmUoJGV2ZW50KVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGlua1wiPlxcblx0XHRcdERlbGV0ZSB0aGlzIHt7IG1vZGVsLmxhYmVsIHwgbG93ZXJjYXNlIH19P1xcblx0XHQ8L2J1dHRvbj5cXG5cdDwvcD5cXG48L3RlbXBsYXRlPlxcblxcbjxlbSB2LWlmPVwiIWVudHJ5XCIgY2xhc3M9XCJ0ZXh0LW11dGVkXCI+TG9hZGluZyB7eyBtb2RlbC5sYWJlbCB8IGxvd2VyY2FzZSB9fSZoZWxsaXA7PC9lbT5cXG4nOyIsInZhciBGaXJlYmFzZSA9IHJlcXVpcmUoJ2ZpcmViYXNlJylcbnZhciBtb2RlbHMgPSByZXF1aXJlKCcuLi8uLi9tb2RlbHMnKVxuXG52YXIgZGF0YVJlZiA9IG5ldyBGaXJlYmFzZSgnaHR0cHM6Ly9lbnRyaWVzLmZpcmViYXNlSU8uY29tL2RhdGEvJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaGVyaXQ6IHRydWUsXG5cdHRlbXBsYXRlOiByZXF1aXJlKCcuL2VudHJ5Lmh0bWwnKSxcblx0Y29tcG9uZW50czoge1xuXHRcdHRleHRGaWVsZDogcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9maWVsZHMvdGV4dCcpLFxuXHRcdG1hcmtkb3duRmllbGQ6IHJlcXVpcmUoJy4uLy4uL2NvbXBvbmVudHMvZmllbGRzL21hcmtkb3duJyksXG5cdFx0ZW50cnlGaWVsZDogcmVxdWlyZSgnLi4vLi4vY29tcG9uZW50cy9maWVsZHMvZW50cnknKSxcblx0XHRpbWFnZUZpZWxkOiByZXF1aXJlKCcuLi8uLi9jb21wb25lbnRzL2ZpZWxkcy9pbWFnZScpXG5cdH0sXG5cdG1ldGhvZHM6IHtcblx0XHRjb21wb25lbnRGb3I6IGZ1bmN0aW9uICh0eXBlKSB7XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAndGV4dCc6XG5cdFx0XHRcdFx0cmV0dXJuICd0ZXh0RmllbGQnXG5cdFx0XHRcdGNhc2UgJ21hcmtkb3duJzpcblx0XHRcdFx0XHRyZXR1cm4gJ21hcmtkb3duRmllbGQnXG5cdFx0XHRcdGNhc2UgJ2VudHJ5Jzpcblx0XHRcdFx0XHRyZXR1cm4gJ2VudHJ5RmllbGQnXG5cdFx0XHRcdGNhc2UgJ2ltYWdlJzpcblx0XHRcdFx0XHRyZXR1cm4gJ2ltYWdlRmllbGQnXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0cmV0dXJuICd0ZXh0RmllbGQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzYXZlOiBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuXHRcdFx0dmFyIHZtID0gdGhpc1xuXG5cdFx0XHR2YXIgZG9uZSA9IChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdDb3VsZCBub3Qgc2F2ZTonLCBlcnIpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dm0uJHNldCgnaGFzQ2hhbmdlZCcsIGZhbHNlKVxuXHRcdFx0XHRcdGxvY2F0aW9uLmFzc2lnbignIy8nICsgdm0ubW9kZWwucHJvcGVydHkpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cblx0XHRcdC8vIHNraXAgc2F2ZSB3aGVuIG5vdGhpbmcgaGFzIGNoYW5nZWRcblx0XHRcdGlmICghdm0uaGFzQ2hhbmdlZCkgcmV0dXJuIGRvbmUoKVxuXG5cdFx0XHRpZiAodm0uaXNOZXcpIHtcblx0XHRcdFx0dm0uZW50cmllc1JlZi5wdXNoKHZtLmVudHJ5LCBkb25lKVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHZtLmVudHJ5UmVmLnVwZGF0ZSh2bS5lbnRyeSwgZG9uZSlcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlbW92ZTogZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRcdC8vIFRPRE86IGFkZCB1bmRvXG5cdFx0XHRpZiAoIXdpbmRvdy5jb25maXJtKCdUaGlzIGNhbm5vdCBiZSB1bmRvbmUuIENvbnRpbnVlPycpKSB7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmVudHJ5UmVmLnJlbW92ZShmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdDb3VsZCBub3QgcmVtb3ZlOicsIGVycilcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRsb2NhdGlvbi5hc3NpZ24oJyMvJyArIHRoaXMubW9kZWwucHJvcGVydHkpXG5cdFx0XHRcdH1cblx0XHRcdH0uYmluZCh0aGlzKSlcblx0XHR9XG5cdH0sXG5cdGNvbXB1dGVkOiB7XG5cdFx0bW9kZWw6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBtb2RlbHNbdGhpcy5yb3V0ZS5wYXJhbXMubW9kZWxdXG5cdFx0fSxcblx0XHRpZDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMucm91dGUucGFyYW1zLmlkXG5cdFx0fSxcblx0XHRlbnRyaWVzUmVmOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZGF0YVJlZi5jaGlsZCh0aGlzLm1vZGVsLnByb3BlcnR5KVxuXHRcdH0sXG5cdFx0ZW50cnlSZWY6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLmVudHJpZXNSZWYuY2hpbGQodGhpcy5pZClcblx0XHR9LFxuXHRcdGlzTmV3OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pZCA9PT0gJ25ldydcblx0XHR9XG5cdH0sXG5cdGNyZWF0ZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdm0gPSB0aGlzXG5cblx0XHRmdW5jdGlvbiBzZXQgKGVudHJ5KSB7XG5cdFx0XHR2bS4kc2V0KCdlbnRyeScsIGVudHJ5KVxuXHRcdFx0dmFyIHVud2F0Y2ggPSB2bS4kd2F0Y2goJ2VudHJ5JywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR2bS4kc2V0KCdoYXNDaGFuZ2VkJywgdHJ1ZSlcblx0XHRcdFx0dW53YXRjaCgpXG5cdFx0XHR9LCB0cnVlKVxuXHRcdH1cblxuXHRcdGlmICh2bS5pc05ldykge1xuXHRcdFx0c2V0KHt9KVxuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXG5cdFx0dm0uZW50cnlSZWYub25jZSgndmFsdWUnLCBmdW5jdGlvbiAoc25hcHNob3QpIHtcblx0XHRcdHNldChzbmFwc2hvdC52YWwoKSlcblx0XHR9KVxuXHR9LFxuXHRhdHRhY2hlZDogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2bSA9IHRoaXNcblx0XHQvLyBUT0RPOiBtYWtlIHRoaXMgd29yayBmb3IgYmFjayBidXR0b24gKHB1c2ggc3RhdGUpXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0aWYgKHZtLmhhc0NoYW5nZWQpIHtcblx0XHRcdFx0dmFyIGNvbmZpcm0gPSAnWW91IGhhdmUgdW5zYXZlZCBjaGFuZ2VzLlxcbkxlYXZpbmcgdGhpcyBwYWdlIHdpbGwgZGlzY2FyZCB0aGVzZSBjaGFuZ2VzLidcblxuXHRcdFx0XHRyZXR1cm4gKGV2ZW50IHx8IHdpbmRvdy5ldmVudCkucmV0dXJuVmFsdWUgPSBjb25maXJtXG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UpXG5cdH1cbn1cbiJdfQ==
