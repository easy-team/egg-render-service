
module.exports = app => {
  app.get('*', app.controller.render.render);
};
