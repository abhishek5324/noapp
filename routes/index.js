const profileRoute = require("./profile.route");
const userRoute = require("../routes/user.route")
const {authenticateToken} = require("../middleware/auth")

const initRouter = (app) => {
  const routes = [];
  app.use(authenticateToken)
  return new Promise((resolve, reject) => {
    routes.push(profileRoute);
    routes.push(userRoute)
    return resolve(routes);
  }).then((routes) => {
    routes.forEach((route) => {
      app.use(route)
    });
  });
};

module.exports = { initRouter };
