'use strict';
const urllib = require('urllib');
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
      const pkg = await this.app.packageManager.getPackage(name);
      const easyInfo = easyHelper.getEasyInfo(pkg.name);
      const webUrl = easyInfo.web && easyInfo.web.url || 'http://localhost:9000';
      const nodeUrl = easyInfo.node && easyInfo.node.url || 'http://localhost:9001';
      const res = await Promise.all([
        urllib.request(`${webUrl}/public/manifest.json`, { dataType: 'json', timeout: 10000 }),
        urllib.request(`${nodeUrl}/public/home.js`, { dataType: 'text', timeout: 10000 })
      ]);
      const manifest = res[0].data;
      const code = res[1].data;
      const html = await this.app.vue.render(code, locals, options);
      const resourceConfig = {
        ...this.app.config.vuessr,
        manifest
      };
      const resource = new Resource(this.app, resourceConfig);
      return resource.inject(html, 'home.js', {}, {});
    }
  
    async renderFile(name, locals, options) {
      const result =  await this.app.packageManager.validate(name);
      if (result.state.code === 20000 ) {
        const { filepath, entry, manifest } = result.data;
        const resConfig = { ...this.app.config.vuessr, manifest };
        const resource = new Resource(this.app, resConfig);
        const html = await this.app.vue.render(filepath, locals, options);
        return resource.inject(html, entry, {}, {});
      } else {
        return `${result.state.msg}:${result.state.code}` ;
      }
    }

};