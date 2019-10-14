const { Map } = require("immutable");
const qs = require("qs");

const array_intersect = (arr1, arr2) => arr1.filter(x => arr2.includes(x));
const array_diff = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

// const matches = (text, pattern) => ({
//   [Symbol.iterator]: function*() {
//     const clone = new RegExp(pattern.source, pattern.flags);
//     let match = null;
//     do {
//       match = clone.exec(text);
//       if (match) {
//         yield match;
//       }
//     } while (match);
//   }
// });

class Router {
  constructor(routes = {}) {
    this.routes = Object.entries(routes).map(([pattern, path]) => {
      const variables = pattern.match(/(?<=\{)([^\}]+?)(?=\})/g) || [];
      const regexpString = pattern.replace(
        /\{([^\}]+?)\}/g,
        (str, variable) => {
          return `(?<${variable}>[^\/\?\#]+)`;
        }
      );

      const regexpStringFull =
        regexpString + `(?:\\?(?<_query>.*))?(?:#(?<_fragment>.*))?`;

      const regexp = new RegExp(`^${regexpStringFull}$`);

      return {
        pattern,
        regexp,
        path,
        variables
      };
    });
  }

  parse(url) {
    const query = {};
    const route = this.routes.find(({ regexp, path: p }) => {
      const result = regexp.exec(url);
      if (!result) {
        return false;
      }
      const groups = result.groups || {};
      const _query = groups._query || "";
      const _fragment = groups._fragment || "";
      delete groups._query;
      delete groups._fragment;
      Object.entries(groups).forEach(([k, v]) => {
        query[k] = v;
      });
      Object.entries(qs.parse(_query)).forEach(([k, v]) => {
        query[k] = v;
      });

      return true;
    });

    if (route === undefined) {
      return null;
    }

    return { path: route.path, params: query };
  }

  generate(path, query = {}) {
    let paramsMap = Map(query);

    const route = this.routes.find(({ variables, path: p }) => {
      if (variables.length > 0) {
        if (array_diff(variables, Object.keys(query)).length > 0) {
          return false;
        }
      }

      return path == p;
    });

    if (route === undefined) {
      throw new Error(
        `Can't find route by params: ${JSON.stringify([path, query])}`
      );
    }

    const { pattern } = route;

    let url = pattern.replace(/\{([^\}]+?)\}/g, (match, key) => {
      const replacement = paramsMap.get(key);

      paramsMap = paramsMap.remove(key);

      return replacement;
    });

    if (paramsMap.size > 0) {
      url = url + "?" + qs.stringify(paramsMap.toJS());
    }

    return url;
  }
}

module.exports = {
  Router
};
