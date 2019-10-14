const { Router } = require("../lib/Router");

const router = new Router({
  "/users/{id}/{name}": "users/show",
  "/users/{id}": "users/show",
  "/users": "users/index",
  "/": "homepage/index"
});

module.exports = router;
