'use strict';
module.exports = {
  async render(name, locals, options) {
    this.body = await this.app.renderManager.render(name, locals, options);
  }
};