'use strict';
const urllib = require('urllib');
const vm = require('vm');
const NativeModule = require('module');
const assert = require('assert');
const easyHelper = require('easy-helper');
const Resource = require('server-side-render-resource');

module.exports = class RenderManager {
    constructor(app){
      this.app = app;
    }

    async render(name, locals, options) {
      switch(this.app.config.env) {
        case 'local':
          return await this.renderMemory(name, locals, options)
        default: 
          return await this.renderFile(name, locals, options);
      }
    }
  
    async renderMemory(name, locals, options) {
      const pkg = await this.app.packageManager.getDevPackage(name);
      assert(pkg, `No running app found`);
      const { entry, engine, tag, version } = pkg;
      const easyInfo = easyHelper.getEasyInfo(pkg.name);
      const webUrl = easyInfo.web && easyInfo.web.url || 'http://localhost:9000';
      const nodeUrl = easyInfo.node && easyInfo.node.url || 'http://localhost:9001';
      const publicPath = easyInfo.web.webpack.publicPath || `/public/${tag}/${version}/`;
      const res = await Promise.all([
        urllib.request(`${webUrl}${publicPath}manifest.json`, { dataType: 'json', timeout: 10000 }),
        urllib.request(`${nodeUrl}${publicPath}${entry}`, { dataType: 'text', timeout: 10000 })
      ]);
      const manifest = res[0].data;
      const code = res[1].data;
      let html = this.app.config.render.template;
      switch(engine) {
        case 'vue':
          html = await this.app.vue.render(code, locals, options);
          break;
        case 'react':
          const wrapper = NativeModule.wrap(code);
          vm.runInThisContext(wrapper)(exports, require, module, __filename, __dirname);
          const reactClass = module.exports && module.exports.default ? module.exports : exports.default ? exports : module.exports;
          html = await this.app.react.renderElement(reactClass, locals);
          break;
        default: 
          break; 
      }
      const resourceConfig = {
        ...this.app.config.vuessr,
        manifest
      };
      const resource = new Resource(this.app, resourceConfig);
      return resource.inject(html, entry, {}, {});
    }
  
    async renderFile(name, locals, options) {
      const result =  await this.app.packageManager.validate(name);
      if (result.state.code === 20000 ) {
        const { filepath, entry, manifest } = result.data;
        const resConfig = { ...this.app.config.vuessr, manifest };
        const resource = new Resource(this.app, resConfig);
        let html = this.app.config.render.template;
        switch(engine) {
          case 'vue':
            html = await this.app.vue.render(filepath, locals, options);
            break;
          case 'react':
            html = this.app.react.render(filepath, locals, options);
            break;
          default: 
            break; 
        }
        return resource.inject(html, entry, {}, {});
      } else {
        return `${result.state.msg}:${result.state.code}` ;
      }
    }
};