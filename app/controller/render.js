
'use strict';
module.exports = app => {
  return class RenderController extends app.Controller {
    async render(ctx) {
      await ctx.render(ctx.path, {});
    }
  };
};