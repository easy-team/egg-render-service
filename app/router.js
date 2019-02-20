
module.exports = app => {
  app.redirect('/', '/react', 302);
  app.get('*', app.controller.render.render);
};
