import { Router } from "./Router";

const router = new Router({
  "/users/{id}/{name}": "users/show",
  "/users/{id}": "users/show",
  "/users": "users/index",
  "/": "homepage/index"
});

it("works", () => {
  expect(router).toBeInstanceOf(Router);
});

it("can generate urls", () => {
  expect(router.generate("homepage/index")).toEqual("/");
  expect(router.generate("homepage/index", { key: "val" })).toEqual(
    "/?key=val"
  );
  expect(router.generate("users/show", { id: 15 })).toEqual("/users/15");
  expect(router.generate("users/show", { id: 15, some: "value" })).toEqual(
    "/users/15?some=value"
  );
});

it("can parse urls", () => {
  expect(router.parse("/")).toEqual({
    path: "homepage/index",
    params: {}
  });
  expect(router.parse("/users/15")).toEqual({
    path: "users/show",
    params: { id: "15" }
  });
  expect(router.parse("/users/15?some=value")).toEqual({
    path: "users/show",
    params: { id: "15", some: "value" }
  });
});
