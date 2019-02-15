!function(e,t){for(var r in t)e[r]=t[r]}(exports,function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/public/bec1be26/0.1.4/",r(r.s=2)}([function(e,t){e.exports=require("vue")},function(e,t){e.exports=require("vuex-router-sync")},function(e,t,r){"use strict";r.r(t);var n=r(0),o=r.n(n),i={computed:{isNode:()=>!0,title(){return this.meta&&this.meta.title||"Render"},description(){return this.meta&&this.meta.description||"Render-Service"},keywords(){return this.meta&&this.meta.keywords||"Render, Vue Render Service, React Render Service"}}},s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return e.isNode?r("html",[e._ssrNode("<head><title>"+e._ssrEscape(e._s(e.title))+'</title> <meta name="keywords"'+e._ssrAttr("content",e.keywords)+'> <meta name="description"'+e._ssrAttr("content",e.description)+'> <meta http-equiv="content-type" content="text/html;charset=utf-8"> <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"> <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"></head> '),e._ssrNode("<body>","</body>",[e._ssrNode('<div id="app">',"</div>",[e._t("default")],2)])],2):e.isNode?e._e():r("div",{attrs:{id:"app"}},[e._t("default")],2)};function a(e,t,r,n,o,i,s,a){var u=typeof(e=e||{}).default;"object"!==u&&"function"!==u||(e=e.default);var c,d="function"==typeof e?e.options:e;if(t&&(d.render=t,d.staticRenderFns=r,d._compiled=!0),n&&(d.functional=!0),i&&(d._scopeId=i),s?(c=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),o&&o.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(s)},d._ssrRegister=c):o&&(c=a?function(){o.call(this,this.$root.$options.shadowRoot)}:o),c)if(d.functional){d._injectStyles=c;var l=d.render;d.render=function(e,t){return c.call(t),l(e,t)}}else{var f=d.beforeCreate;d.beforeCreate=f?[].concat(f,c):[c]}return{exports:e,options:d}}s._withStripped=!0;var u=a(i,s,[],!1,null,null,"8c5c4560");u.options.__file="src/component/layout.vue";var c={components:{Layout:u.exports},data:()=>({})},d=function(){var e=this.$createElement,t=this._self._c||e;return t("Layout",[t("h1",[this._v("Render Service")])])};d._withStripped=!0;var l=a(c,d,[],!1,null,null,"7d7938fe");l.options.__file="src/page/home/index.vue";var f=l.exports,p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e};t.default=function(e){const t="function"==typeof f.store?f.store(e.state):f.store,n="function"==typeof f.router?f.router():f.router;if(t&&n){return(0,r(1).sync)(t,n),n.push(e.state.url),new Promise((r,i)=>{n.onReady(()=>{const s=n.getMatchedComponents();return s?Promise.all(s.map(e=>e.methods&&e.methods.fetchApi?e.methods.fetchApi(t):null)).then(()=>{e.state=p({},t.state,e.state);const i=(f.hook||o.a.hook||{}).render||f.hookRender||o.a.hookRender;i&&i(e,f);const s=p({},f,{store:t,router:n});return r(new o.a(s))}):i({code:"404"})})})}const i=o.a.extend(f),s=(f.hook||o.a.hook||{}).render||f.hookRender||o.a.hookRender;return s&&s(e,f),new i(p({},f,{data:e.state}))}}]));