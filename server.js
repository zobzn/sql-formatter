const express = require("express");
const next = require("next");
const path = require("path");

const { parse } = require("url");
const router = require("./config/router");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: path.resolve(__dirname, ".") });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all("*", (req, res) => {
    // const parsedUrl = parse(req.url, true);
    // const { pathname, query } = parsedUrl;

    const route = router.parse(req.url);

    if (route === null) {
      console.log("request", req.url);
      return app.render(req, res);
    } else {
      console.log("request", route);
      return app.render(req, res, "/" + route.path, route.params);
    }
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
