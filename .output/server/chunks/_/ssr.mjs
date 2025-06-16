import { createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, RouterProvider, createRouter as createRouter$1 } from '@tanstack/react-router';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useContext, createContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'node:fs';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Euro, TrendingUp, PiggyBank, CheckCircle, Shield, BarChart3, Award, Users, Phone, Mail, MapPin } from 'lucide-react';
import { AsyncLocalStorage } from 'node:async_hooks';
import { PassThrough, Readable } from 'node:stream';
import ReactDOMServer from 'react-dom/server';
import { ReadableStream as ReadableStream$1 } from 'node:stream/web';

function StartServer(props) {
  return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
var fullPattern = " daum[ /]| deusu/| yadirectfetcher|(?:^|[^g])news(?!sapphire)|(?<! (?:channel/|google/))google(?!(app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!(?:lib))http|(?<![hg]m)score|(?<!cam)scan|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\btime/|\\||^<|^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[^ ]{50,}$|^\\d+\\b|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^active|^ad muncher|^amaya|^avsdevicesdk/|^biglotron|^bot|^bw/|^clamav[ /]|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d\\s[\\w\\.-]+$|^mozilla/\\d\\.\\d\\s\\(compatible;?(?:\\s\\w+\\/\\d+\\.\\d+)?\\)$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^python|^rank|^read|^reed|^rest|^rss|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|^{{.*}}$|analyzer|archive|ask jeeves/teoma|audit|bit\\.ly/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|convertify|crawl|cypress/|dareboost|datanyze|dejaclick|detect|dmbrowser|download|evc-batch/|exaleadcloudview|feed|firephp|functionize|gomezagent|grab|headless|httrack|hubspot marketing grader|hydra|ibisbrowser|infrawatch|insight|inspect|iplabel|ips-agent|java(?!;)|library|linkcheck|mail\\.ru/|manager|measure|neustar wpm|node|nutch|offbyone|onetrust|optimize|pageburst|pagespeed|parser|perl|phantomjs|pingdom|powermarks|preview|proxy|ptst[ /]\\d|retriever|rexx;|rigor|rss\\b|scrape|server|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|tools|torrent|transcoder|url|validator|virtuoso|wappalyzer|webglance|webkit2png|whatcms/|xtate/";
var naivePattern = /bot|crawl|http|lighthouse|scan|search|spider/i;
var pattern;
function getPattern() {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  try {
    pattern = new RegExp(fullPattern, "i");
  } catch (error) {
    pattern = naivePattern;
  }
  return pattern;
}
function isbot(userAgent) {
  return Boolean(userAgent) && getPattern().test(userAgent);
}
const stateIndexKey = "__TSR_index";
function createHistory(opts) {
  let location = opts.getLocation();
  const subscribers = /* @__PURE__ */ new Set();
  const notify = (action) => {
    location = opts.getLocation();
    subscribers.forEach((subscriber) => subscriber({ location, action }));
  };
  const handleIndexChange = (action) => {
    if (opts.notifyOnIndexChange ?? true) notify(action);
    else location = opts.getLocation();
  };
  const tryNavigation = async ({
    task,
    navigateOpts,
    ...actionInfo
  }) => {
    var _a, _b;
    const ignoreBlocker = (navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false;
    if (ignoreBlocker) {
      task();
      return;
    }
    const blockers = ((_a = opts.getBlockers) == null ? void 0 : _a.call(opts)) ?? [];
    const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
    if (typeof document !== "undefined" && blockers.length && isPushOrReplace) {
      for (const blocker of blockers) {
        const nextLocation = parseHref(actionInfo.path, actionInfo.state);
        const isBlocked = await blocker.blockerFn({
          currentLocation: location,
          nextLocation,
          action: actionInfo.type
        });
        if (isBlocked) {
          (_b = opts.onBlocked) == null ? void 0 : _b.call(opts);
          return;
        }
      }
    }
    task();
  };
  return {
    get location() {
      return location;
    },
    get length() {
      return opts.getLength();
    },
    subscribers,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    push: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex + 1, state);
      tryNavigation({
        task: () => {
          opts.pushState(path, state);
          notify({ type: "PUSH" });
        },
        navigateOpts,
        type: "PUSH",
        path,
        state
      });
    },
    replace: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex, state);
      tryNavigation({
        task: () => {
          opts.replaceState(path, state);
          notify({ type: "REPLACE" });
        },
        navigateOpts,
        type: "REPLACE",
        path,
        state
      });
    },
    go: (index, navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.go(index);
          handleIndexChange({ type: "GO", index });
        },
        navigateOpts,
        type: "GO"
      });
    },
    back: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.back((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "BACK" });
        },
        navigateOpts,
        type: "BACK"
      });
    },
    forward: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.forward((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "FORWARD" });
        },
        navigateOpts,
        type: "FORWARD"
      });
    },
    canGoBack: () => location.state[stateIndexKey] !== 0,
    createHref: (str) => opts.createHref(str),
    block: (blocker) => {
      var _a;
      if (!opts.setBlockers) return () => {
      };
      const blockers = ((_a = opts.getBlockers) == null ? void 0 : _a.call(opts)) ?? [];
      opts.setBlockers([...blockers, blocker]);
      return () => {
        var _a2, _b;
        const blockers2 = ((_a2 = opts.getBlockers) == null ? void 0 : _a2.call(opts)) ?? [];
        (_b = opts.setBlockers) == null ? void 0 : _b.call(opts, blockers2.filter((b) => b !== blocker));
      };
    },
    flush: () => {
      var _a;
      return (_a = opts.flush) == null ? void 0 : _a.call(opts);
    },
    destroy: () => {
      var _a;
      return (_a = opts.destroy) == null ? void 0 : _a.call(opts);
    },
    notify
  };
}
function assignKeyAndIndex(index, state) {
  if (!state) {
    state = {};
  }
  return {
    ...state,
    key: createRandomKey(),
    [stateIndexKey]: index
  };
}
function createMemoryHistory(opts = {
  initialEntries: ["/"]
}) {
  const entries = opts.initialEntries;
  let index = opts.initialIndex ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1) : entries.length - 1;
  const states = entries.map(
    (_entry, index2) => assignKeyAndIndex(index2, void 0)
  );
  const getLocation = () => parseHref(entries[index], states[index]);
  return createHistory({
    getLocation,
    getLength: () => entries.length,
    pushState: (path, state) => {
      if (index < entries.length - 1) {
        entries.splice(index + 1);
        states.splice(index + 1);
      }
      states.push(state);
      entries.push(path);
      index = Math.max(entries.length - 1, 0);
    },
    replaceState: (path, state) => {
      states[index] = state;
      entries[index] = path;
    },
    back: () => {
      index = Math.max(index - 1, 0);
    },
    forward: () => {
      index = Math.min(index + 1, entries.length - 1);
    },
    go: (n) => {
      index = Math.min(Math.max(index + n, 0), entries.length - 1);
    },
    createHref: (path) => path
  });
}
function parseHref(href, state) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  return {
    href,
    pathname: href.substring(
      0,
      hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length
    ),
    hash: hashIndex > -1 ? href.substring(hashIndex) : "",
    search: searchIndex > -1 ? href.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
    state: state || { [stateIndexKey]: 0, key: createRandomKey() }
  };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  {
    throw new Error(prefix);
  }
}
function pick(parent, keys) {
  return keys.reduce((obj, key) => {
    obj[key] = parent[key];
    return obj;
  }, {});
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function createControlledPromise(onResolve) {
  let resolveLoadPromise;
  let rejectLoadPromise;
  const controlledPromise = new Promise((resolve, reject) => {
    resolveLoadPromise = resolve;
    rejectLoadPromise = reject;
  });
  controlledPromise.status = "pending";
  controlledPromise.resolve = (value) => {
    controlledPromise.status = "resolved";
    controlledPromise.value = value;
    resolveLoadPromise(value);
  };
  controlledPromise.reject = (e) => {
    controlledPromise.status = "rejected";
    rejectLoadPromise(e);
  };
  return controlledPromise;
}
function joinPaths(paths) {
  return cleanPath(
    paths.filter((val) => {
      return val !== void 0;
    }).join("/")
  );
}
function cleanPath(path) {
  return path.replace(/\/{2,}/g, "/");
}
function trimPathLeft(path) {
  return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
function trimPathRight(path) {
  return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
function trimPath(path) {
  return trimPathRight(trimPathLeft(path));
}
const PARAM_RE = /^\$.{1,}$/;
const PARAM_W_CURLY_BRACES_RE = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
const WILDCARD_RE = /^\$$/;
const WILDCARD_W_CURLY_BRACES_RE = /^(.*?)\{\$\}(.*)$/;
function parsePathname(pathname) {
  if (!pathname) {
    return [];
  }
  pathname = cleanPath(pathname);
  const segments = [];
  if (pathname.slice(0, 1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: "pathname",
      value: "/"
    });
  }
  if (!pathname) {
    return segments;
  }
  const split = pathname.split("/").filter(Boolean);
  segments.push(
    ...split.map((part) => {
      const wildcardBracesMatch = part.match(WILDCARD_W_CURLY_BRACES_RE);
      if (wildcardBracesMatch) {
        const prefix2 = wildcardBracesMatch[1];
        const suffix = wildcardBracesMatch[2];
        return {
          type: "wildcard",
          value: "$",
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      const paramBracesMatch = part.match(PARAM_W_CURLY_BRACES_RE);
      if (paramBracesMatch) {
        const prefix2 = paramBracesMatch[1];
        const paramName = paramBracesMatch[2];
        const suffix = paramBracesMatch[3];
        return {
          type: "param",
          value: "" + paramName,
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      if (PARAM_RE.test(part)) {
        const paramName = part.substring(1);
        return {
          type: "param",
          value: "$" + paramName,
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      if (WILDCARD_RE.test(part)) {
        return {
          type: "wildcard",
          value: "$",
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      return {
        type: "pathname",
        value: part.includes("%25") ? part.split("%25").map((segment) => decodeURI(segment)).join("%25") : decodeURI(part)
      };
    })
  );
  if (pathname.slice(-1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: "pathname",
      value: "/"
    });
  }
  return segments;
}
function matchPathname(basepath, currentPathname, matchLocation) {
  const pathParams = matchByPath(basepath, currentPathname, matchLocation);
  if (matchLocation.to && !pathParams) {
    return;
  }
  return pathParams ?? {};
}
function removeBasepath(basepath, pathname, caseSensitive = false) {
  const normalizedBasepath = caseSensitive ? basepath : basepath.toLowerCase();
  const normalizedPathname = caseSensitive ? pathname : pathname.toLowerCase();
  switch (true) {
    // default behaviour is to serve app from the root - pathname
    // left untouched
    case normalizedBasepath === "/":
      return pathname;
    // shortcut for removing the basepath if it matches the pathname
    case normalizedPathname === normalizedBasepath:
      return "";
    // in case pathname is shorter than basepath - there is
    // nothing to remove
    case pathname.length < basepath.length:
      return pathname;
    // avoid matching partial segments - strict equality handled
    // earlier, otherwise, basepath separated from pathname with
    // separator, therefore lack of separator means partial
    // segment match (`/app` should not match `/application`)
    case normalizedPathname[normalizedBasepath.length] !== "/":
      return pathname;
    // remove the basepath from the pathname if it starts with it
    case normalizedPathname.startsWith(normalizedBasepath):
      return pathname.slice(basepath.length);
    // otherwise, return the pathname as is
    default:
      return pathname;
  }
}
function matchByPath(basepath, from, matchLocation) {
  from = removeBasepath(basepath, from, matchLocation.caseSensitive);
  const to = removeBasepath(
    basepath,
    `${matchLocation.to ?? "$"}`,
    matchLocation.caseSensitive
  );
  const baseSegments = parsePathname(from);
  const routeSegments = parsePathname(to);
  if (!from.startsWith("/")) {
    baseSegments.unshift({
      type: "pathname",
      value: "/"
    });
  }
  if (!to.startsWith("/")) {
    routeSegments.unshift({
      type: "pathname",
      value: "/"
    });
  }
  const params = {};
  const isMatch = (() => {
    var _a;
    for (let i = 0; i < Math.max(baseSegments.length, routeSegments.length); i++) {
      const baseSegment = baseSegments[i];
      const routeSegment = routeSegments[i];
      const isLastBaseSegment = i >= baseSegments.length - 1;
      const isLastRouteSegment = i >= routeSegments.length - 1;
      if (routeSegment) {
        if (routeSegment.type === "wildcard") {
          const remainingBaseSegments = baseSegments.slice(i);
          let _splat;
          if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
            if (!baseSegment) return false;
            const prefix2 = routeSegment.prefixSegment || "";
            const suffix = routeSegment.suffixSegment || "";
            const baseValue = baseSegment.value;
            if ("prefixSegment" in routeSegment) {
              if (!baseValue.startsWith(prefix2)) {
                return false;
              }
            }
            if ("suffixSegment" in routeSegment) {
              if (!((_a = baseSegments[baseSegments.length - 1]) == null ? void 0 : _a.value.endsWith(suffix))) {
                return false;
              }
            }
            let rejoinedSplat = decodeURI(
              joinPaths(remainingBaseSegments.map((d) => d.value))
            );
            if (prefix2 && rejoinedSplat.startsWith(prefix2)) {
              rejoinedSplat = rejoinedSplat.slice(prefix2.length);
            }
            if (suffix && rejoinedSplat.endsWith(suffix)) {
              rejoinedSplat = rejoinedSplat.slice(
                0,
                rejoinedSplat.length - suffix.length
              );
            }
            _splat = rejoinedSplat;
          } else {
            _splat = decodeURI(
              joinPaths(remainingBaseSegments.map((d) => d.value))
            );
          }
          params["*"] = _splat;
          params["_splat"] = _splat;
          return true;
        }
        if (routeSegment.type === "pathname") {
          if (routeSegment.value === "/" && !(baseSegment == null ? void 0 : baseSegment.value)) {
            return true;
          }
          if (baseSegment) {
            if (matchLocation.caseSensitive) {
              if (routeSegment.value !== baseSegment.value) {
                return false;
              }
            } else if (routeSegment.value.toLowerCase() !== baseSegment.value.toLowerCase()) {
              return false;
            }
          }
        }
        if (!baseSegment) {
          return false;
        }
        if (routeSegment.type === "param") {
          if (baseSegment.value === "/") {
            return false;
          }
          let _paramValue;
          if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
            const prefix2 = routeSegment.prefixSegment || "";
            const suffix = routeSegment.suffixSegment || "";
            const baseValue = baseSegment.value;
            if (prefix2 && !baseValue.startsWith(prefix2)) {
              return false;
            }
            if (suffix && !baseValue.endsWith(suffix)) {
              return false;
            }
            let paramValue = baseValue;
            if (prefix2 && paramValue.startsWith(prefix2)) {
              paramValue = paramValue.slice(prefix2.length);
            }
            if (suffix && paramValue.endsWith(suffix)) {
              paramValue = paramValue.slice(
                0,
                paramValue.length - suffix.length
              );
            }
            _paramValue = decodeURIComponent(paramValue);
          } else {
            _paramValue = decodeURIComponent(baseSegment.value);
          }
          params[routeSegment.value.substring(1)] = _paramValue;
        }
      }
      if (!isLastBaseSegment && isLastRouteSegment) {
        params["**"] = joinPaths(baseSegments.slice(i + 1).map((d) => d.value));
        return (routeSegment == null ? void 0 : routeSegment.value) !== "/";
      }
    }
    return true;
  })();
  return isMatch ? params : void 0;
}
function isNotFound(obj) {
  return !!(obj == null ? void 0 : obj.isNotFound);
}
const rootRouteId = "__root__";
function isRedirect(obj) {
  return obj instanceof Response && !!obj.options;
}
function isResolvedRedirect(obj) {
  return isRedirect(obj) && !!obj.options.href;
}
function defaultSerializeError(err) {
  if (err instanceof Error) {
    const obj = {
      name: err.name,
      message: err.message
    };
    return obj;
  }
  return {
    data: err
  };
}
function processRouteTree({
  routeTree: routeTree2,
  initRoute
}) {
  const routesById = {};
  const routesByPath = {};
  const recurseRoutes = (childRoutes) => {
    childRoutes.forEach((childRoute, i) => {
      initRoute == null ? void 0 : initRoute(childRoute, i);
      const existingRoute = routesById[childRoute.id];
      invariant(
        !existingRoute,
        `Duplicate routes found with id: ${String(childRoute.id)}`
      );
      routesById[childRoute.id] = childRoute;
      if (!childRoute.isRoot && childRoute.path) {
        const trimmedFullPath = trimPathRight(childRoute.fullPath);
        if (!routesByPath[trimmedFullPath] || childRoute.fullPath.endsWith("/")) {
          routesByPath[trimmedFullPath] = childRoute;
        }
      }
      const children = childRoute.children;
      if (children == null ? void 0 : children.length) {
        recurseRoutes(children);
      }
    });
  };
  recurseRoutes([routeTree2]);
  const scoredRoutes = [];
  const routes = Object.values(routesById);
  routes.forEach((d, i) => {
    var _a;
    if (d.isRoot || !d.path) {
      return;
    }
    const trimmed = trimPathLeft(d.fullPath);
    const parsed = parsePathname(trimmed);
    while (parsed.length > 1 && ((_a = parsed[0]) == null ? void 0 : _a.value) === "/") {
      parsed.shift();
    }
    const scores = parsed.map((segment) => {
      if (segment.value === "/") {
        return 0.75;
      }
      if (segment.type === "param" && segment.prefixSegment && segment.suffixSegment) {
        return 0.55;
      }
      if (segment.type === "param" && segment.prefixSegment) {
        return 0.52;
      }
      if (segment.type === "param" && segment.suffixSegment) {
        return 0.51;
      }
      if (segment.type === "param") {
        return 0.5;
      }
      if (segment.type === "wildcard" && segment.prefixSegment && segment.suffixSegment) {
        return 0.3;
      }
      if (segment.type === "wildcard" && segment.prefixSegment) {
        return 0.27;
      }
      if (segment.type === "wildcard" && segment.suffixSegment) {
        return 0.26;
      }
      if (segment.type === "wildcard") {
        return 0.25;
      }
      return 1;
    });
    scoredRoutes.push({ child: d, trimmed, parsed, index: i, scores });
  });
  const flatRoutes = scoredRoutes.sort((a, b) => {
    const minLength = Math.min(a.scores.length, b.scores.length);
    for (let i = 0; i < minLength; i++) {
      if (a.scores[i] !== b.scores[i]) {
        return b.scores[i] - a.scores[i];
      }
    }
    if (a.scores.length !== b.scores.length) {
      return b.scores.length - a.scores.length;
    }
    for (let i = 0; i < minLength; i++) {
      if (a.parsed[i].value !== b.parsed[i].value) {
        return a.parsed[i].value > b.parsed[i].value ? 1 : -1;
      }
    }
    return a.index - b.index;
  }).map((d, i) => {
    d.child.rank = i;
    return d.child;
  });
  return { routesById, routesByPath, flatRoutes };
}
function getMatchedRoutes({
  pathname,
  routePathname,
  basepath,
  caseSensitive,
  routesByPath,
  routesById,
  flatRoutes
}) {
  let routeParams = {};
  const trimmedPath = trimPathRight(pathname);
  const getMatchedParams = (route) => {
    var _a;
    const result = matchPathname(basepath, trimmedPath, {
      to: route.fullPath,
      caseSensitive: ((_a = route.options) == null ? void 0 : _a.caseSensitive) ?? caseSensitive
    });
    return result;
  };
  let foundRoute = routePathname !== void 0 ? routesByPath[routePathname] : void 0;
  if (foundRoute) {
    routeParams = getMatchedParams(foundRoute);
  } else {
    foundRoute = flatRoutes.find((route) => {
      const matchedParams = getMatchedParams(route);
      if (matchedParams) {
        routeParams = matchedParams;
        return true;
      }
      return false;
    });
  }
  let routeCursor = foundRoute || routesById[rootRouteId];
  const matchedRoutes = [routeCursor];
  while (routeCursor.parentRoute) {
    routeCursor = routeCursor.parentRoute;
    matchedRoutes.unshift(routeCursor);
  }
  return { matchedRoutes, routeParams, foundRoute };
}
const TSR_DEFERRED_PROMISE = Symbol.for("TSR_DEFERRED_PROMISE");
function defer(_promise, options) {
  const promise = _promise;
  if (promise[TSR_DEFERRED_PROMISE]) {
    return promise;
  }
  promise[TSR_DEFERRED_PROMISE] = { status: "pending" };
  promise.then((data) => {
    promise[TSR_DEFERRED_PROMISE].status = "success";
    promise[TSR_DEFERRED_PROMISE].data = data;
  }).catch((error) => {
    promise[TSR_DEFERRED_PROMISE].status = "error";
    promise[TSR_DEFERRED_PROMISE].error = {
      data: defaultSerializeError(error),
      __isServerError: true
    };
  });
  return promise;
}
function transformReadableStreamWithRouter(router, routerStream) {
  return transformStreamWithRouter(router, routerStream);
}
function transformPipeableStreamWithRouter(router, routerStream) {
  return Readable.fromWeb(
    transformStreamWithRouter(router, Readable.toWeb(routerStream))
  );
}
const patternBodyStart = /(<body)/;
const patternBodyEnd = /(<\/body>)/;
const patternHtmlEnd = /(<\/html>)/;
const patternHeadStart = /(<head.*?>)/;
const patternClosingTag = /(<\/[a-zA-Z][\w:.-]*?>)/g;
const textDecoder = new TextDecoder();
function createPassthrough() {
  let controller;
  const encoder = new TextEncoder();
  const stream = new ReadableStream$1({
    start(c) {
      controller = c;
    }
  });
  const res = {
    stream,
    write: (chunk) => {
      controller.enqueue(encoder.encode(chunk));
    },
    end: (chunk) => {
      if (chunk) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
      res.destroyed = true;
    },
    destroy: (error) => {
      controller.error(error);
    },
    destroyed: false
  };
  return res;
}
async function readStream(stream, opts) {
  var _a, _b, _c;
  try {
    const reader = stream.getReader();
    let chunk;
    while (!(chunk = await reader.read()).done) {
      (_a = opts.onData) == null ? void 0 : _a.call(opts, chunk);
    }
    (_b = opts.onEnd) == null ? void 0 : _b.call(opts);
  } catch (error) {
    (_c = opts.onError) == null ? void 0 : _c.call(opts, error);
  }
}
function transformStreamWithRouter(router, appStream) {
  const finalPassThrough = createPassthrough();
  let isAppRendering = true;
  let routerStreamBuffer = "";
  let pendingClosingTags = "";
  let bodyStarted = false;
  let headStarted = false;
  let leftover = "";
  let leftoverHtml = "";
  function getBufferedRouterStream() {
    const html = routerStreamBuffer;
    routerStreamBuffer = "";
    return html;
  }
  function decodeChunk(chunk) {
    if (chunk instanceof Uint8Array) {
      return textDecoder.decode(chunk);
    }
    return String(chunk);
  }
  const injectedHtmlDonePromise = createControlledPromise();
  let processingCount = 0;
  router.serverSsr.injectedHtml.forEach((promise) => {
    handleInjectedHtml(promise);
  });
  const stopListeningToInjectedHtml = router.subscribe(
    "onInjectedHtml",
    (e) => {
      handleInjectedHtml(e.promise);
    }
  );
  function handleInjectedHtml(promise) {
    processingCount++;
    promise.then((html) => {
      if (!bodyStarted) {
        routerStreamBuffer += html;
      } else {
        finalPassThrough.write(html);
      }
    }).catch(injectedHtmlDonePromise.reject).finally(() => {
      processingCount--;
      if (!isAppRendering && processingCount === 0) {
        stopListeningToInjectedHtml();
        injectedHtmlDonePromise.resolve();
      }
    });
  }
  injectedHtmlDonePromise.then(() => {
    const finalHtml = leftoverHtml + getBufferedRouterStream() + pendingClosingTags;
    finalPassThrough.end(finalHtml);
  }).catch((err) => {
    console.error("Error reading routerStream:", err);
    finalPassThrough.destroy(err);
  });
  readStream(appStream, {
    onData: (chunk) => {
      const text = decodeChunk(chunk.value);
      let chunkString = leftover + text;
      const bodyEndMatch = chunkString.match(patternBodyEnd);
      const htmlEndMatch = chunkString.match(patternHtmlEnd);
      if (!bodyStarted) {
        const bodyStartMatch = chunkString.match(patternBodyStart);
        if (bodyStartMatch) {
          bodyStarted = true;
        }
      }
      if (!headStarted) {
        const headStartMatch = chunkString.match(patternHeadStart);
        if (headStartMatch) {
          headStarted = true;
          const index = headStartMatch.index;
          const headTag = headStartMatch[0];
          const remaining = chunkString.slice(index + headTag.length);
          finalPassThrough.write(
            chunkString.slice(0, index) + headTag + getBufferedRouterStream()
          );
          chunkString = remaining;
        }
      }
      if (!bodyStarted) {
        finalPassThrough.write(chunkString);
        leftover = "";
        return;
      }
      if (bodyEndMatch && htmlEndMatch && bodyEndMatch.index < htmlEndMatch.index) {
        const bodyEndIndex = bodyEndMatch.index;
        pendingClosingTags = chunkString.slice(bodyEndIndex);
        finalPassThrough.write(
          chunkString.slice(0, bodyEndIndex) + getBufferedRouterStream()
        );
        leftover = "";
        return;
      }
      let result;
      let lastIndex = 0;
      while ((result = patternClosingTag.exec(chunkString)) !== null) {
        lastIndex = result.index + result[0].length;
      }
      if (lastIndex > 0) {
        const processed = chunkString.slice(0, lastIndex) + getBufferedRouterStream() + leftoverHtml;
        finalPassThrough.write(processed);
        leftover = chunkString.slice(lastIndex);
      } else {
        leftover = chunkString;
        leftoverHtml += getBufferedRouterStream();
      }
    },
    onEnd: () => {
      isAppRendering = false;
      if (processingCount === 0) {
        injectedHtmlDonePromise.resolve();
      }
    },
    onError: (error) => {
      console.error("Error reading appStream:", error);
      finalPassThrough.destroy(error);
    }
  });
  return finalPassThrough.stream;
}
function splitSetCookieString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitSetCookieString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
function toHeadersInstance(init) {
  if (init instanceof Headers) {
    return new Headers(init);
  } else if (Array.isArray(init)) {
    return new Headers(init);
  } else if (typeof init === "object") {
    return new Headers(init);
  } else {
    return new Headers();
  }
}
function mergeHeaders(...headers) {
  return headers.reduce((acc, header) => {
    const headersInstance = toHeadersInstance(header);
    for (const [key, value] of headersInstance.entries()) {
      if (key === "set-cookie") {
        const splitCookies = splitSetCookieString(value);
        splitCookies.forEach((cookie) => acc.append("set-cookie", cookie));
      } else {
        acc.set(key, value);
      }
    }
    return acc;
  }, new Headers());
}
const startSerializer = {
  stringify: (value) => JSON.stringify(value, function replacer(key, val) {
    const ogVal = this[key];
    const serializer = serializers.find((t) => t.stringifyCondition(ogVal));
    if (serializer) {
      return serializer.stringify(ogVal);
    }
    return val;
  }),
  parse: (value) => JSON.parse(value, function parser(key, val) {
    const ogVal = this[key];
    if (isPlainObject(ogVal)) {
      const serializer = serializers.find((t) => t.parseCondition(ogVal));
      if (serializer) {
        return serializer.parse(ogVal);
      }
    }
    return val;
  }),
  encode: (value) => {
    if (Array.isArray(value)) {
      return value.map((v) => startSerializer.encode(v));
    }
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v]) => [
          key,
          startSerializer.encode(v)
        ])
      );
    }
    const serializer = serializers.find((t) => t.stringifyCondition(value));
    if (serializer) {
      return serializer.stringify(value);
    }
    return value;
  },
  decode: (value) => {
    if (isPlainObject(value)) {
      const serializer = serializers.find((t) => t.parseCondition(value));
      if (serializer) {
        return serializer.parse(value);
      }
    }
    if (Array.isArray(value)) {
      return value.map((v) => startSerializer.decode(v));
    }
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v]) => [
          key,
          startSerializer.decode(v)
        ])
      );
    }
    return value;
  }
};
const createSerializer = (key, check, toValue, fromValue) => ({
  key,
  stringifyCondition: check,
  stringify: (value) => ({ [`$${key}`]: toValue(value) }),
  parseCondition: (value) => Object.hasOwn(value, `$${key}`),
  parse: (value) => fromValue(value[`$${key}`])
});
const serializers = [
  createSerializer(
    // Key
    "undefined",
    // Check
    (v) => v === void 0,
    // To
    () => 0,
    // From
    () => void 0
  ),
  createSerializer(
    // Key
    "date",
    // Check
    (v) => v instanceof Date,
    // To
    (v) => v.toISOString(),
    // From
    (v) => new Date(v)
  ),
  createSerializer(
    // Key
    "error",
    // Check
    (v) => v instanceof Error,
    // To
    (v) => ({
      ...v,
      message: v.message,
      stack: void 0,
      cause: v.cause
    }),
    // From
    (v) => Object.assign(new Error(v.message), v)
  ),
  createSerializer(
    // Key
    "formData",
    // Check
    (v) => v instanceof FormData,
    // To
    (v) => {
      const entries = {};
      v.forEach((value, key) => {
        const entry = entries[key];
        if (entry !== void 0) {
          if (Array.isArray(entry)) {
            entry.push(value);
          } else {
            entries[key] = [entry, value];
          }
        } else {
          entries[key] = value;
        }
      });
      return entries;
    },
    // From
    (v) => {
      const formData = new FormData();
      Object.entries(v).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => formData.append(key, val));
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    }
  ),
  createSerializer(
    // Key
    "bigint",
    // Check
    (v) => typeof v === "bigint",
    // To
    (v) => v.toString(),
    // From
    (v) => BigInt(v)
  )
];
function warning(condition, message) {
}
const globalMiddleware = [];
function createServerFn(options, __opts) {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") {
    resolvedOptions.method = "GET";
  }
  return {
    options: resolvedOptions,
    middleware: (middleware) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, {
        middleware
      }));
    },
    validator: (validator) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, {
        validator
      }));
    },
    type: (type) => {
      return createServerFn(void 0, Object.assign(resolvedOptions, {
        type
      }));
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      Object.assign(resolvedOptions, {
        ...extractedFn,
        extractedFn,
        serverFn
      });
      const resolvedMiddleware = [...resolvedOptions.middleware || [], serverFnBaseToMiddleware(resolvedOptions)];
      return Object.assign(async (opts) => {
        return executeMiddleware$1(resolvedMiddleware, "client", {
          ...extractedFn,
          ...resolvedOptions,
          data: opts == null ? void 0 : opts.data,
          headers: opts == null ? void 0 : opts.headers,
          signal: opts == null ? void 0 : opts.signal,
          context: {}
        }).then((d) => {
          if (resolvedOptions.response === "full") {
            return d;
          }
          if (d.error) throw d.error;
          return d.result;
        });
      }, {
        // This copies over the URL, function ID
        ...extractedFn,
        // The extracted function on the server-side calls
        // this function
        __executeServer: async (opts_, signal) => {
          const opts = opts_ instanceof FormData ? extractFormDataContext(opts_) : opts_;
          opts.type = typeof resolvedOptions.type === "function" ? resolvedOptions.type(opts) : resolvedOptions.type;
          const ctx = {
            ...extractedFn,
            ...opts,
            signal
          };
          const run = () => executeMiddleware$1(resolvedMiddleware, "server", ctx).then((d) => ({
            // Only send the result and sendContext back to the client
            result: d.result,
            error: d.error,
            context: d.sendContext
          }));
          if (ctx.type === "static") {
            let response;
            if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.getItem) {
              response = await serverFnStaticCache.getItem(ctx);
            }
            if (!response) {
              response = await run().then((d) => {
                return {
                  ctx: d,
                  error: null
                };
              }).catch((e) => {
                return {
                  ctx: void 0,
                  error: e
                };
              });
              if (serverFnStaticCache == null ? void 0 : serverFnStaticCache.setItem) {
                await serverFnStaticCache.setItem(ctx, response);
              }
            }
            invariant(response);
            if (response.error) {
              throw response.error;
            }
            return response.ctx;
          }
          return run();
        }
      });
    }
  };
}
async function executeMiddleware$1(middlewares, env, opts) {
  const flattenedMiddlewares = flattenMiddlewares([...globalMiddleware, ...middlewares]);
  const next = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) {
      return ctx;
    }
    if (nextMiddleware.options.validator && (env === "client" ? nextMiddleware.options.validateClient : true)) {
      ctx.data = await execValidator(nextMiddleware.options.validator, ctx.data);
    }
    const middlewareFn = env === "client" ? nextMiddleware.options.client : nextMiddleware.options.server;
    if (middlewareFn) {
      return applyMiddleware(middlewareFn, ctx, async (newCtx) => {
        return next(newCtx).catch((error) => {
          if (isRedirect(error) || isNotFound(error)) {
            return {
              ...newCtx,
              error
            };
          }
          throw error;
        });
      });
    }
    return next(ctx);
  };
  return next({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || {}
  });
}
let serverFnStaticCache;
function setServerFnStaticCache(cache) {
  const previousCache = serverFnStaticCache;
  serverFnStaticCache = typeof cache === "function" ? cache() : cache;
  return () => {
    serverFnStaticCache = previousCache;
  };
}
function createServerFnStaticCache(serverFnStaticCache2) {
  return serverFnStaticCache2;
}
async function sha1Hash(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
setServerFnStaticCache(() => {
  const getStaticCacheUrl = async (options, hash) => {
    const filename = await sha1Hash(`${options.functionId}__${hash}`);
    return `/__tsr/staticServerFnCache/${filename}.json`;
  };
  const jsonToFilenameSafeString = (json2) => {
    const sortedKeysReplacer = (key, value) => value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value).sort().reduce((acc, curr) => {
      acc[curr] = value[curr];
      return acc;
    }, {}) : value;
    const jsonString = JSON.stringify(json2 ?? "", sortedKeysReplacer);
    return jsonString.replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_");
  };
  const staticClientCache = typeof document !== "undefined" ? /* @__PURE__ */ new Map() : null;
  return createServerFnStaticCache({
    getItem: async (ctx) => {
      if (typeof document === "undefined") {
        const hash = jsonToFilenameSafeString(ctx.data);
        const url = await getStaticCacheUrl(ctx, hash);
        const publicUrl = "/Users/Nicolas.Dunke/Development/senacor/finance-planner/.output/public";
        const {
          promises: fs2
        } = await import('node:fs');
        const path = await import('node:path');
        const filePath2 = path.join(publicUrl, url);
        const [cachedResult, readError] = await fs2.readFile(filePath2, "utf-8").then((c) => [startSerializer.parse(c), null]).catch((e) => [null, e]);
        if (readError && readError.code !== "ENOENT") {
          throw readError;
        }
        return cachedResult;
      }
      return void 0;
    },
    setItem: async (ctx, response) => {
      const {
        promises: fs2
      } = await import('node:fs');
      const path = await import('node:path');
      const hash = jsonToFilenameSafeString(ctx.data);
      const url = await getStaticCacheUrl(ctx, hash);
      const publicUrl = "/Users/Nicolas.Dunke/Development/senacor/finance-planner/.output/public";
      const filePath2 = path.join(publicUrl, url);
      await fs2.mkdir(path.dirname(filePath2), {
        recursive: true
      });
      await fs2.writeFile(filePath2, startSerializer.stringify(response));
    },
    fetchItem: async (ctx) => {
      const hash = jsonToFilenameSafeString(ctx.data);
      const url = await getStaticCacheUrl(ctx, hash);
      let result = staticClientCache == null ? void 0 : staticClientCache.get(url);
      if (!result) {
        result = await fetch(url, {
          method: "GET"
        }).then((r) => r.text()).then((d) => startSerializer.parse(d));
        staticClientCache == null ? void 0 : staticClientCache.set(url, result);
      }
      return result;
    }
  });
});
function extractFormDataContext(formData) {
  const serializedContext = formData.get("__TSR_CONTEXT");
  formData.delete("__TSR_CONTEXT");
  if (typeof serializedContext !== "string") {
    return {
      context: {},
      data: formData
    };
  }
  try {
    const context = startSerializer.parse(serializedContext);
    return {
      context,
      data: formData
    };
  } catch {
    return {
      data: formData
    };
  }
}
function flattenMiddlewares(middlewares) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware) => {
    middleware.forEach((m) => {
      if (m.options.middleware) {
        recurse(m.options.middleware);
      }
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares);
  return flattened;
}
const applyMiddleware = async (middlewareFn, ctx, nextFn) => {
  return middlewareFn({
    ...ctx,
    next: async (userCtx = {}) => {
      return nextFn({
        ...ctx,
        ...userCtx,
        context: {
          ...ctx.context,
          ...userCtx.context
        },
        sendContext: {
          ...ctx.sendContext,
          ...userCtx.sendContext ?? {}
        },
        headers: mergeHeaders(ctx.headers, userCtx.headers),
        result: userCtx.result !== void 0 ? userCtx.result : ctx.response === "raw" ? userCtx : ctx.result,
        error: userCtx.error ?? ctx.error
      });
    }
  });
};
function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = validator["~standard"].validate(input);
    if (result instanceof Promise) throw new Error("Async validation not supported");
    if (result.issues) throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) {
    return validator.parse(input);
  }
  if (typeof validator === "function") {
    return validator(input);
  }
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    _types: void 0,
    options: {
      validator: options.validator,
      validateClient: options.validateClient,
      client: async ({
        next,
        sendContext,
        ...ctx
      }) => {
        var _a;
        const payload = {
          ...ctx,
          // switch the sendContext over to context
          context: sendContext,
          type: typeof ctx.type === "function" ? ctx.type(ctx) : ctx.type
        };
        if (ctx.type === "static" && "production" === "production" && typeof document !== "undefined") {
          invariant(serverFnStaticCache);
          const result = await serverFnStaticCache.fetchItem(payload);
          if (result) {
            if (result.error) {
              throw result.error;
            }
            return next(result.ctx);
          }
          warning(result, `No static cache item found for ${payload.functionId}__${JSON.stringify(payload.data)}, falling back to server function...`);
        }
        const res = await ((_a = options.extractedFn) == null ? void 0 : _a.call(options, payload));
        return next(res);
      },
      server: async ({
        next,
        ...ctx
      }) => {
        var _a;
        const result = await ((_a = options.serverFn) == null ? void 0 : _a.call(options, ctx));
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
function json(payload, init) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: mergeHeaders(
      { "content-type": "application/json" },
      init == null ? void 0 : init.headers
    )
  });
}
function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}
var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Error extends Error {
  constructor(message, opts = {}) {
    super(message, opts);
    __publicField$2(this, "statusCode", 500);
    __publicField$2(this, "fatal", false);
    __publicField$2(this, "unhandled", false);
    __publicField$2(this, "statusMessage");
    __publicField$2(this, "data");
    __publicField$2(this, "cause");
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
__publicField$2(H3Error, "__h3_error__", true);
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function isError(input) {
  var _a;
  return ((_a = input == null ? void 0 : input.constructor) == null ? void 0 : _a.__h3_error__) === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  var _a;
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return ((_a = event.node.req.connection) == null ? void 0 : _a.encrypted) ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function toWebRequest(event) {
  var _a;
  return ((_a = event.web) == null ? void 0 : _a.request) || new Request(getRequestURL(event), {
    // @ts-ignore Undici option
    duplex: "half",
    method: event.method,
    headers: event.headers,
    body: getRequestWebStream(event)
  });
}
const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  var _a, _b;
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || ((_b = (_a = event.web) == null ? void 0 : _a.request) == null ? void 0 : _b.body) || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  var _a, _b;
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = ((_b = (_a = event.web) == null ? void 0 : _a.request) == null ? void 0 : _b.body) || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}
typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function getResponseStatus$1(event) {
  return event.node.res.statusCode;
}
function getResponseHeaders$1(event) {
  return event.node.res.getHeaders();
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Event {
  constructor(req, res) {
    __publicField(this, "__is_event__", true);
    __publicField(this, "node");
    __publicField(this, "web");
    __publicField(this, "context", {});
    __publicField(this, "_method");
    __publicField(this, "_path");
    __publicField(this, "_headers");
    __publicField(this, "_requestBody");
    __publicField(this, "_handled", false);
    __publicField(this, "_onBeforeResponseCalled");
    __publicField(this, "_onAfterResponseCalled");
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}
function defineEventHandler$1(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventStorage = new AsyncLocalStorage();
function defineEventHandler(handler) {
  return defineEventHandler$1((event) => {
    return runWithEvent(event, () => handler(event));
  });
}
async function runWithEvent(event, fn) {
  return eventStorage.run(event, fn);
}
function getEvent() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return event;
}
const HTTPEventSymbol = Symbol("$HTTPEvent");
function isEvent(obj) {
  return typeof obj === "object" && (obj instanceof H3Event || (obj == null ? void 0 : obj[HTTPEventSymbol]) instanceof H3Event || (obj == null ? void 0 : obj.__is_event__) === true);
}
function createWrapperFunction(h3Function) {
  return function(...args) {
    const event = args[0];
    if (!isEvent(event)) {
      args.unshift(getEvent());
    } else {
      args[0] = event instanceof H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
    }
    return h3Function(...args);
  };
}
const getResponseStatus = createWrapperFunction(getResponseStatus$1);
const getResponseHeaders = createWrapperFunction(getResponseHeaders$1);
function requestHandler(handler) {
  return handler;
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var jsesc_1;
var hasRequiredJsesc;
function requireJsesc() {
  if (hasRequiredJsesc) return jsesc_1;
  hasRequiredJsesc = 1;
  const object = {};
  const hasOwnProperty = object.hasOwnProperty;
  const forOwn = (object2, callback) => {
    for (const key in object2) {
      if (hasOwnProperty.call(object2, key)) {
        callback(key, object2[key]);
      }
    }
  };
  const extend = (destination, source) => {
    if (!source) {
      return destination;
    }
    forOwn(source, (key, value) => {
      destination[key] = value;
    });
    return destination;
  };
  const forEach = (array, callback) => {
    const length = array.length;
    let index = -1;
    while (++index < length) {
      callback(array[index]);
    }
  };
  const fourHexEscape = (hex) => {
    return "\\u" + ("0000" + hex).slice(-4);
  };
  const hexadecimal = (code, lowercase) => {
    let hexadecimal2 = code.toString(16);
    if (lowercase) return hexadecimal2;
    return hexadecimal2.toUpperCase();
  };
  const toString = object.toString;
  const isArray = Array.isArray;
  const isBuffer = (value) => {
    return typeof Buffer === "function" && Buffer.isBuffer(value);
  };
  const isObject = (value) => {
    return toString.call(value) == "[object Object]";
  };
  const isString = (value) => {
    return typeof value == "string" || toString.call(value) == "[object String]";
  };
  const isNumber = (value) => {
    return typeof value == "number" || toString.call(value) == "[object Number]";
  };
  const isBigInt = (value) => {
    return typeof value == "bigint";
  };
  const isFunction = (value) => {
    return typeof value == "function";
  };
  const isMap = (value) => {
    return toString.call(value) == "[object Map]";
  };
  const isSet = (value) => {
    return toString.call(value) == "[object Set]";
  };
  const singleEscapes = {
    "\\": "\\\\",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "	": "\\t"
    // `\v` is omitted intentionally, because in IE < 9, '\v' == 'v'.
    // '\v': '\\x0B'
  };
  const regexSingleEscape = /[\\\b\f\n\r\t]/;
  const regexDigit = /[0-9]/;
  const regexWhitespace = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
  const escapeEverythingRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^]/g;
  const escapeNonAsciiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^ !#-&\(-\[\]-_a-~]/g;
  const jsesc2 = (argument, options) => {
    const increaseIndentation = () => {
      oldIndent = indent;
      ++options.indentLevel;
      indent = options.indent.repeat(options.indentLevel);
    };
    const defaults = {
      "escapeEverything": false,
      "minimal": false,
      "isScriptContext": false,
      "quotes": "single",
      "wrap": false,
      "es6": false,
      "json": false,
      "compact": true,
      "lowercaseHex": false,
      "numbers": "decimal",
      "indent": "	",
      "indentLevel": 0,
      "__inline1__": false,
      "__inline2__": false
    };
    const json2 = options && options.json;
    if (json2) {
      defaults.quotes = "double";
      defaults.wrap = true;
    }
    options = extend(defaults, options);
    if (options.quotes != "single" && options.quotes != "double" && options.quotes != "backtick") {
      options.quotes = "single";
    }
    const quote = options.quotes == "double" ? '"' : options.quotes == "backtick" ? "`" : "'";
    const compact = options.compact;
    const lowercaseHex = options.lowercaseHex;
    let indent = options.indent.repeat(options.indentLevel);
    let oldIndent = "";
    const inline1 = options.__inline1__;
    const inline2 = options.__inline2__;
    const newLine = compact ? "" : "\n";
    let result;
    let isEmpty = true;
    const useBinNumbers = options.numbers == "binary";
    const useOctNumbers = options.numbers == "octal";
    const useDecNumbers = options.numbers == "decimal";
    const useHexNumbers = options.numbers == "hexadecimal";
    if (json2 && argument && isFunction(argument.toJSON)) {
      argument = argument.toJSON();
    }
    if (!isString(argument)) {
      if (isMap(argument)) {
        if (argument.size == 0) {
          return "new Map()";
        }
        if (!compact) {
          options.__inline1__ = true;
          options.__inline2__ = false;
        }
        return "new Map(" + jsesc2(Array.from(argument), options) + ")";
      }
      if (isSet(argument)) {
        if (argument.size == 0) {
          return "new Set()";
        }
        return "new Set(" + jsesc2(Array.from(argument), options) + ")";
      }
      if (isBuffer(argument)) {
        if (argument.length == 0) {
          return "Buffer.from([])";
        }
        return "Buffer.from(" + jsesc2(Array.from(argument), options) + ")";
      }
      if (isArray(argument)) {
        result = [];
        options.wrap = true;
        if (inline1) {
          options.__inline1__ = false;
          options.__inline2__ = true;
        }
        if (!inline2) {
          increaseIndentation();
        }
        forEach(argument, (value) => {
          isEmpty = false;
          if (inline2) {
            options.__inline2__ = false;
          }
          result.push(
            (compact || inline2 ? "" : indent) + jsesc2(value, options)
          );
        });
        if (isEmpty) {
          return "[]";
        }
        if (inline2) {
          return "[" + result.join(", ") + "]";
        }
        return "[" + newLine + result.join("," + newLine) + newLine + (compact ? "" : oldIndent) + "]";
      } else if (isNumber(argument) || isBigInt(argument)) {
        if (json2) {
          return JSON.stringify(Number(argument));
        }
        let result2;
        if (useDecNumbers) {
          result2 = String(argument);
        } else if (useHexNumbers) {
          let hexadecimal2 = argument.toString(16);
          if (!lowercaseHex) {
            hexadecimal2 = hexadecimal2.toUpperCase();
          }
          result2 = "0x" + hexadecimal2;
        } else if (useBinNumbers) {
          result2 = "0b" + argument.toString(2);
        } else if (useOctNumbers) {
          result2 = "0o" + argument.toString(8);
        }
        if (isBigInt(argument)) {
          return result2 + "n";
        }
        return result2;
      } else if (isBigInt(argument)) {
        if (json2) {
          return JSON.stringify(Number(argument));
        }
        return argument + "n";
      } else if (!isObject(argument)) {
        if (json2) {
          return JSON.stringify(argument) || "null";
        }
        return String(argument);
      } else {
        result = [];
        options.wrap = true;
        increaseIndentation();
        forOwn(argument, (key, value) => {
          isEmpty = false;
          result.push(
            (compact ? "" : indent) + jsesc2(key, options) + ":" + (compact ? "" : " ") + jsesc2(value, options)
          );
        });
        if (isEmpty) {
          return "{}";
        }
        return "{" + newLine + result.join("," + newLine) + newLine + (compact ? "" : oldIndent) + "}";
      }
    }
    const regex = options.escapeEverything ? escapeEverythingRegex : escapeNonAsciiRegex;
    result = argument.replace(regex, (char, pair, lone, quoteChar, index, string) => {
      if (pair) {
        if (options.minimal) return pair;
        const first = pair.charCodeAt(0);
        const second = pair.charCodeAt(1);
        if (options.es6) {
          const codePoint = (first - 55296) * 1024 + second - 56320 + 65536;
          const hex2 = hexadecimal(codePoint, lowercaseHex);
          return "\\u{" + hex2 + "}";
        }
        return fourHexEscape(hexadecimal(first, lowercaseHex)) + fourHexEscape(hexadecimal(second, lowercaseHex));
      }
      if (lone) {
        return fourHexEscape(hexadecimal(lone.charCodeAt(0), lowercaseHex));
      }
      if (char == "\0" && !json2 && !regexDigit.test(string.charAt(index + 1))) {
        return "\\0";
      }
      if (quoteChar) {
        if (quoteChar == quote || options.escapeEverything) {
          return "\\" + quoteChar;
        }
        return quoteChar;
      }
      if (regexSingleEscape.test(char)) {
        return singleEscapes[char];
      }
      if (options.minimal && !regexWhitespace.test(char)) {
        return char;
      }
      const hex = hexadecimal(char.charCodeAt(0), lowercaseHex);
      if (json2 || hex.length > 2) {
        return fourHexEscape(hex);
      }
      return "\\x" + ("00" + hex).slice(-2);
    });
    if (quote == "`") {
      result = result.replace(/\$\{/g, "\\${");
    }
    if (options.isScriptContext) {
      result = result.replace(/<\/(script|style)/gi, "<\\/$1").replace(/<!--/g, json2 ? "\\u003C!--" : "\\x3C!--");
    }
    if (options.wrap) {
      result = quote + result + quote;
    }
    return result;
  };
  jsesc2.version = "3.0.2";
  jsesc_1 = jsesc2;
  return jsesc_1;
}
var jsescExports = requireJsesc();
const jsesc = /* @__PURE__ */ getDefaultExportFromCjs(jsescExports);
const minifiedTsrBootStrapScript = 'const __TSR_SSR__={matches:[],streamedValues:{},initMatch:o=>(__TSR_SSR__.matches.push(o),o.extracted?.forEach(l=>{if(l.type==="stream"){let r;l.value=new ReadableStream({start(e){r={enqueue:t=>{try{e.enqueue(t)}catch{}},close:()=>{try{e.close()}catch{}}}}}),l.value.controller=r}else{let r,e;l.value=new Promise((t,a)=>{e=a,r=t}),l.value.reject=e,l.value.resolve=r}}),!0),resolvePromise:({matchId:o,id:l,promiseState:r})=>{const e=__TSR_SSR__.matches.find(t=>t.id===o);if(e){const t=e.extracted?.[l];if(t&&t.type==="promise"&&t.value&&r.status==="success")return t.value.resolve(r.data),!0}return!1},injectChunk:({matchId:o,id:l,chunk:r})=>{const e=__TSR_SSR__.matches.find(t=>t.id===o);if(e){const t=e.extracted?.[l];if(t&&t.type==="stream"&&t.value?.controller)return t.value.controller.enqueue(new TextEncoder().encode(r.toString())),!0}return!1},closeStream:({matchId:o,id:l})=>{const r=__TSR_SSR__.matches.find(e=>e.id===o);if(r){const e=r.extracted?.[l];if(e&&e.type==="stream"&&e.value?.controller)return e.value.controller.close(),!0}return!1},cleanScripts:()=>{document.querySelectorAll(".tsr-once").forEach(o=>{o.remove()})}};window.__TSR_SSR__=__TSR_SSR__;\n';
function attachRouterServerSsrUtils(router, manifest) {
  router.ssr = {
    manifest,
    serializer: startSerializer
  };
  router.serverSsr = {
    injectedHtml: [],
    streamedKeys: /* @__PURE__ */ new Set(),
    injectHtml: (getHtml) => {
      const promise = Promise.resolve().then(getHtml);
      router.serverSsr.injectedHtml.push(promise);
      router.emit({
        type: "onInjectedHtml",
        promise
      });
      return promise.then(() => {
      });
    },
    injectScript: (getScript, opts) => {
      return router.serverSsr.injectHtml(async () => {
        const script = await getScript();
        return `<script class='tsr-once'>${script}${""}; if (typeof __TSR_SSR__ !== 'undefined') __TSR_SSR__.cleanScripts()<\/script>`;
      });
    },
    streamValue: (key, value) => {
      warning(
        !router.serverSsr.streamedKeys.has(key));
      router.serverSsr.streamedKeys.add(key);
      router.serverSsr.injectScript(
        () => `__TSR_SSR__.streamedValues['${key}'] = { value: ${jsesc(
          router.ssr.serializer.stringify(value),
          {
            isScriptContext: true,
            wrap: true,
            json: true
          }
        )}}`
      );
    },
    onMatchSettled
  };
  router.serverSsr.injectScript(() => minifiedTsrBootStrapScript, {
    logScript: false
  });
}
function dehydrateRouter(router) {
  var _a, _b, _c;
  const dehydratedRouter = {
    manifest: router.ssr.manifest,
    dehydratedData: (_b = (_a = router.options).dehydrate) == null ? void 0 : _b.call(_a),
    lastMatchId: ((_c = router.state.matches[router.state.matches.length - 1]) == null ? void 0 : _c.id) || ""
  };
  router.serverSsr.injectScript(
    () => `__TSR_SSR__.dehydrated = ${jsesc(
      router.ssr.serializer.stringify(dehydratedRouter),
      {
        isScriptContext: true,
        wrap: true,
        json: true
      }
    )}`
  );
}
function extractAsyncLoaderData(loaderData, ctx) {
  const extracted = [];
  const replaced = replaceBy(loaderData, (value, path) => {
    if (value instanceof ReadableStream) {
      const [copy1, copy2] = value.tee();
      const entry = {
        type: "stream",
        path,
        id: extracted.length,
        matchIndex: ctx.match.index,
        stream: copy2
      };
      extracted.push(entry);
      return copy1;
    } else if (value instanceof Promise) {
      const deferredPromise = defer(value);
      const entry = {
        type: "promise",
        path,
        id: extracted.length,
        matchIndex: ctx.match.index,
        promise: deferredPromise
      };
      extracted.push(entry);
    }
    return value;
  });
  return { replaced, extracted };
}
function onMatchSettled(opts) {
  const { router, match } = opts;
  let extracted = void 0;
  let serializedLoaderData = void 0;
  if (match.loaderData !== void 0) {
    const result = extractAsyncLoaderData(match.loaderData, {
      match
    });
    match.loaderData = result.replaced;
    extracted = result.extracted;
    serializedLoaderData = extracted.reduce(
      (acc, entry) => {
        return deepImmutableSetByPath(acc, ["temp", ...entry.path], void 0);
      },
      { temp: result.replaced }
    ).temp;
  }
  const initCode = `__TSR_SSR__.initMatch(${jsesc(
    {
      id: match.id,
      __beforeLoadContext: router.ssr.serializer.stringify(
        match.__beforeLoadContext
      ),
      loaderData: router.ssr.serializer.stringify(serializedLoaderData),
      error: router.ssr.serializer.stringify(match.error),
      extracted: extracted == null ? void 0 : extracted.map((entry) => pick(entry, ["type", "path"])),
      updatedAt: match.updatedAt,
      status: match.status
    },
    {
      isScriptContext: true,
      wrap: true,
      json: true
    }
  )})`;
  router.serverSsr.injectScript(() => initCode);
  if (extracted) {
    extracted.forEach((entry) => {
      if (entry.type === "promise") return injectPromise(entry);
      return injectStream(entry);
    });
  }
  function injectPromise(entry) {
    router.serverSsr.injectScript(async () => {
      await entry.promise;
      return `__TSR_SSR__.resolvePromise(${jsesc(
        {
          matchId: match.id,
          id: entry.id,
          promiseState: entry.promise[TSR_DEFERRED_PROMISE]
        },
        {
          isScriptContext: true,
          wrap: true,
          json: true
        }
      )})`;
    });
  }
  function injectStream(entry) {
    router.serverSsr.injectHtml(async () => {
      try {
        const reader = entry.stream.getReader();
        let chunk = null;
        while (!(chunk = await reader.read()).done) {
          if (chunk.value) {
            const code = `__TSR_SSR__.injectChunk(${jsesc(
              {
                matchId: match.id,
                id: entry.id,
                chunk: chunk.value
              },
              {
                isScriptContext: true,
                wrap: true,
                json: true
              }
            )})`;
            router.serverSsr.injectScript(() => code);
          }
        }
        router.serverSsr.injectScript(
          () => `__TSR_SSR__.closeStream(${jsesc(
            {
              matchId: match.id,
              id: entry.id
            },
            {
              isScriptContext: true,
              wrap: true,
              json: true
            }
          )})`
        );
      } catch (err) {
        console.error("stream read error", err);
      }
      return "";
    });
  }
}
function deepImmutableSetByPath(obj, path, value) {
  if (path.length === 0) {
    return value;
  }
  const [key, ...rest] = path;
  if (Array.isArray(obj)) {
    return obj.map((item, i) => {
      if (i === Number(key)) {
        return deepImmutableSetByPath(item, rest, value);
      }
      return item;
    });
  }
  if (isPlainObject(obj)) {
    return {
      ...obj,
      [key]: deepImmutableSetByPath(obj[key], rest, value)
    };
  }
  return obj;
}
function replaceBy(obj, cb, path = []) {
  if (isPlainArray(obj)) {
    return obj.map((value, i) => replaceBy(value, cb, [...path, `${i}`]));
  }
  if (isPlainObject(obj)) {
    const newObj2 = {};
    for (const key in obj) {
      newObj2[key] = replaceBy(obj[key], cb, [...path, key]);
    }
    return newObj2;
  }
  const newObj = cb(obj, path);
  if (newObj !== obj) {
    return newObj;
  }
  return obj;
}
const VIRTUAL_MODULES = {
  routeTree: "tanstack-start-route-tree:v",
  startManifest: "tanstack-start-manifest:v",
  serverFnManifest: "tanstack-start-server-fn-manifest:v"
};
async function loadVirtualModule(id) {
  switch (id) {
    case VIRTUAL_MODULES.routeTree:
      return await Promise.resolve().then(() => routeTree_gen);
    case VIRTUAL_MODULES.startManifest:
      return await import('./_tanstack-start-manifest_v-B7Xo7C5D.mjs');
    case VIRTUAL_MODULES.serverFnManifest:
      return await import('./_tanstack-start-server-fn-manifest_v-Cppclm6U.mjs');
    default:
      throw new Error(`Unknown virtual module: ${id}`);
  }
}
async function getStartManifest(opts) {
  const { tsrStartManifest } = await loadVirtualModule(
    VIRTUAL_MODULES.startManifest
  );
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  const manifest = {
    ...startManifest,
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).map(([k, v]) => {
        const { preloads, assets } = v;
        return [
          k,
          {
            preloads,
            assets
          }
        ];
      })
    )
  };
  return manifest;
}
function sanitizeBase$1(base) {
  return base.replace(/^\/|\/$/g, "");
}
const handleServerAction = async ({
  request
}) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort);
  const method = request.method;
  const url = new URL(request.url, "http://localhost:3000");
  const regex = new RegExp(`${sanitizeBase$1("/_serverFn")}/([^/?#]+)`);
  const match = url.pathname.match(regex);
  const serverFnId = match ? match[1] : null;
  const search = Object.fromEntries(url.searchParams.entries());
  const isCreateServerFn = "createServerFn" in search;
  const isRaw = "raw" in search;
  if (typeof serverFnId !== "string") {
    throw new Error("Invalid server action param for serverFnId: " + serverFnId);
  }
  const {
    default: serverFnManifest
  } = await loadVirtualModule(VIRTUAL_MODULES.serverFnManifest);
  const serverFnInfo = serverFnManifest[serverFnId];
  if (!serverFnInfo) {
    console.info("serverFnManifest", serverFnManifest);
    throw new Error("Server function info not found for " + serverFnId);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + serverFnId);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(`Server function module export not resolved for serverFn ID: ${serverFnId}`);
  }
  const formDataContentTypes = ["multipart/form-data", "application/x-www-form-urlencoded"];
  const response = await (async () => {
    try {
      let result = await (async () => {
        if (request.headers.get("Content-Type") && formDataContentTypes.some((type) => {
          var _a;
          return (_a = request.headers.get("Content-Type")) == null ? void 0 : _a.includes(type);
        })) {
          invariant(method.toLowerCase() !== "get", "GET requests with FormData payloads are not supported");
          return await action(await request.formData(), signal);
        }
        if (method.toLowerCase() === "get") {
          let payload2 = search;
          if (isCreateServerFn) {
            payload2 = search.payload;
          }
          payload2 = payload2 ? startSerializer.parse(payload2) : payload2;
          return await action(payload2, signal);
        }
        const jsonPayloadAsString = await request.text();
        const payload = startSerializer.parse(jsonPayloadAsString);
        if (isCreateServerFn) {
          return await action(payload, signal);
        }
        return await action(...payload, signal);
      })();
      if (result.result instanceof Response) {
        return result.result;
      }
      if (!isCreateServerFn) {
        result = result.result;
        if (result instanceof Response) {
          return result;
        }
      }
      if (isNotFound(result)) {
        return isNotFoundResponse(result);
      }
      return new Response(result !== void 0 ? startSerializer.stringify(result) : void 0, {
        status: getResponseStatus(getEvent()),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isNotFound(error)) {
        return isNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      return new Response(startSerializer.stringify(error), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  })();
  request.signal.removeEventListener("abort", abort);
  if (isRaw) {
    return response;
  }
  return response;
};
function isNotFoundResponse(error) {
  const {
    headers,
    ...rest
  } = error;
  return new Response(JSON.stringify(rest), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
function getStartResponseHeaders(opts) {
  let headers = mergeHeaders(
    getResponseHeaders(),
    {
      "Content-Type": "text/html; charset=UTF-8"
    },
    ...opts.router.state.matches.map((match) => {
      return match.headers;
    })
  );
  const { redirect } = opts.router.state;
  if (redirect) {
    headers = mergeHeaders(headers, redirect.headers);
  }
  return headers;
}
function createStartHandler({
  createRouter: createRouter2
}) {
  let serverRouteTree = null;
  return (cb) => {
    const originalFetch = globalThis.fetch;
    const startRequestResolver = async ({ request }) => {
      globalThis.fetch = async function(input, init) {
        function resolve(url2, requestOptions) {
          const fetchRequest = new Request(url2, requestOptions);
          return startRequestResolver({ request: fetchRequest });
        }
        function getOrigin() {
          return request.headers.get("Origin") || request.headers.get("Referer") || "http://localhost";
        }
        if (typeof input === "string" && input.startsWith("/")) {
          const url2 = new URL(input, getOrigin());
          return resolve(url2, init);
        } else if (typeof input === "object" && "url" in input && typeof input.url === "string" && input.url.startsWith("/")) {
          const url2 = new URL(input.url, getOrigin());
          return resolve(url2, init);
        }
        return originalFetch(input, init);
      };
      const url = new URL(request.url);
      const href = url.href.replace(url.origin, "");
      const history = createMemoryHistory({
        initialEntries: [href]
      });
      const APP_BASE = "/";
      const router = createRouter2();
      const startRoutesManifest = await getStartManifest();
      attachRouterServerSsrUtils(router, startRoutesManifest);
      router.update({
        history
      });
      const response = await (async () => {
        try {
          if (false) ;
          const serverFnBase = joinPaths([
            APP_BASE,
            trimPath("/_serverFn"),
            "/"
          ]);
          if (href.startsWith(serverFnBase)) {
            return await handleServerAction({ request });
          }
          if (serverRouteTree === null) {
            try {
              serverRouteTree = (await loadVirtualModule(VIRTUAL_MODULES.routeTree)).serverRouteTree;
            } catch (e) {
              console.log(e);
            }
          }
          if (serverRouteTree) {
            const [_matchedRoutes, response3] = await handleServerRoutes({
              routeTree: serverRouteTree,
              request,
              basePath: APP_BASE
            });
            if (response3) return response3;
          }
          const requestAcceptHeader = request.headers.get("Accept") || "*/*";
          const splitRequestAcceptHeader = requestAcceptHeader.split(",");
          const supportedMimeTypes = ["*/*", "text/html"];
          const isRouterAcceptSupported = supportedMimeTypes.some(
            (mimeType) => splitRequestAcceptHeader.some(
              (acceptedMimeType) => acceptedMimeType.trim().startsWith(mimeType)
            )
          );
          if (!isRouterAcceptSupported) {
            return json(
              {
                error: "Only HTML requests are supported here"
              },
              {
                status: 500
              }
            );
          }
          await router.load();
          if (router.state.redirect) return router.state.redirect;
          dehydrateRouter(router);
          const responseHeaders = getStartResponseHeaders({ router });
          const response2 = await cb({
            request,
            router,
            responseHeaders
          });
          return response2;
        } catch (err) {
          if (err instanceof Response) {
            return err;
          }
          throw err;
        }
      })();
      if (isRedirect(response)) {
        if (isResolvedRedirect(response)) {
          if (request.headers.get("x-tsr-redirect") === "manual") {
            return json(
              {
                ...response.options,
                isSerializedRedirect: true
              },
              {
                headers: response.headers
              }
            );
          }
          return response;
        }
        if (response.options.to && typeof response.options.to === "string" && !response.options.to.startsWith("/")) {
          throw new Error(
            `Server side redirects must use absolute paths via the 'href' or 'to' options. Received: ${JSON.stringify(response.options)}`
          );
        }
        if (["params", "search", "hash"].some(
          (d) => typeof response.options[d] === "function"
        )) {
          throw new Error(
            `Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(
              response.options
            ).filter((d) => typeof response.options[d] === "function").map((d) => `"${d}"`).join(", ")}`
          );
        }
        const redirect = router.resolveRedirect(response);
        if (request.headers.get("x-tsr-redirect") === "manual") {
          return json(
            {
              ...response.options,
              isSerializedRedirect: true
            },
            {
              headers: response.headers
            }
          );
        }
        return redirect;
      }
      return response;
    };
    return requestHandler(startRequestResolver);
  };
}
async function handleServerRoutes({
  routeTree: routeTree2,
  request,
  basePath
}) {
  const { flatRoutes, routesById, routesByPath } = processRouteTree({
    routeTree: routeTree2,
    initRoute: (route, i) => {
      route.init({
        originalIndex: i
      });
    }
  });
  const url = new URL(request.url);
  const pathname = url.pathname;
  const history = createMemoryHistory({
    initialEntries: [pathname]
  });
  const { matchedRoutes, foundRoute, routeParams } = getMatchedRoutes({
    pathname: history.location.pathname,
    basepath: basePath,
    caseSensitive: true,
    routesByPath,
    routesById,
    flatRoutes
  });
  let response;
  if (foundRoute && foundRoute.id !== rootRouteId) {
    const method = Object.keys(foundRoute.options.methods).find(
      (method2) => method2.toLowerCase() === request.method.toLowerCase()
    );
    if (method) {
      const handler = foundRoute.options.methods[method];
      if (handler) {
        const middlewares = flattenMiddlewares(
          matchedRoutes.flatMap((r) => r.options.middleware).filter(Boolean)
        ).map((d) => d.options.server);
        middlewares.push(handlerToMiddleware(handler));
        const ctx = await executeMiddleware(middlewares, {
          request,
          context: {},
          params: routeParams,
          pathname: history.location.pathname
        });
        response = ctx.response;
      }
    }
  }
  return [matchedRoutes, response];
}
function handlerToMiddleware(handler) {
  return async ({ next: _next, ...rest }) => ({
    response: await handler(rest)
  });
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (ctx2) => {
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx2;
    const result = await middleware({
      ...ctx2,
      // Allow the middleware to call the next middleware in the chain
      next: async (nextCtx) => {
        const nextResult = await next({ ...ctx2, ...nextCtx });
        return Object.assign(ctx2, handleCtxResult(nextResult));
      }
      // Allow the middleware result to extend the return context
    }).catch((err) => {
      if (isSpecialResponse(err)) {
        return {
          response: err
        };
      }
      throw err;
    });
    return Object.assign(ctx2, handleCtxResult(result));
  };
  return handleCtxResult(next(ctx));
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) {
    return {
      response: result
    };
  }
  return result;
}
function isSpecialResponse(err) {
  return isResponse(err) || isRedirect(err);
}
function isResponse(response) {
  return response instanceof Response;
}
function defineHandlerCallback(handler) {
  return handler;
}
const defaultStreamHandler = defineHandlerCallback(
  async ({ request, router, responseHeaders }) => {
    if (typeof ReactDOMServer.renderToReadableStream === "function") {
      const stream = await ReactDOMServer.renderToReadableStream(
        /* @__PURE__ */ jsx(StartServer, { router }),
        {
          signal: request.signal
        }
      );
      if (isbot(request.headers.get("User-Agent"))) {
        await stream.allReady;
      }
      const responseStream = transformReadableStreamWithRouter(
        router,
        stream
      );
      return new Response(responseStream, {
        status: router.state.statusCode,
        headers: responseHeaders
      });
    }
    if (typeof ReactDOMServer.renderToPipeableStream === "function") {
      const reactAppPassthrough = new PassThrough();
      try {
        const pipeable = ReactDOMServer.renderToPipeableStream(
          /* @__PURE__ */ jsx(StartServer, { router }),
          {
            ...isbot(request.headers.get("User-Agent")) ? {
              onAllReady() {
                pipeable.pipe(reactAppPassthrough);
              }
            } : {
              onShellReady() {
                pipeable.pipe(reactAppPassthrough);
              }
            },
            onError: (error, info) => {
              if (error instanceof Error && error.message === "ShellBoundaryError")
                return;
              console.error("Error in renderToPipeableStream:", error, info);
            }
          }
        );
      } catch (e) {
        console.error("Error in renderToPipeableStream:", e);
      }
      const responseStream = transformPipeableStreamWithRouter(
        router,
        reactAppPassthrough
      );
      return new Response(responseStream, {
        status: router.state.statusCode,
        headers: responseHeaders
      });
    }
    throw new Error(
      "No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming."
    );
  }
);
const supabaseUrl = "https://xrfomcynxqlarazjmkuw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZm9tY3lueHFsYXJhempta3V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzM4NjgsImV4cCI6MjA2NTQ0OTg2OH0.3LESJuYQhkdp4tSJAfxlkBJvunkfFk_tYC5vcwZKbog";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const auth = {
  // Sign up with email and password
  async signUp(email, password) {
    var _a;
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        username: (_a = data.user.user_metadata) == null ? void 0 : _a.username
      } : null,
      error
    };
  },
  // Sign in with email and password
  async signIn(email, password) {
    var _a;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        username: (_a = data.user.user_metadata) == null ? void 0 : _a.username
      } : null,
      error
    };
  },
  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  // Get current user
  async getCurrentUser() {
    var _a;
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user ? {
      id: user.id,
      email: user.email,
      username: (_a = user.user_metadata) == null ? void 0 : _a.username
    } : null;
  },
  // Subscribe to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      var _a;
      const user = (session == null ? void 0 : session.user) ? {
        id: session.user.id,
        email: session.user.email,
        username: (_a = session.user.user_metadata) == null ? void 0 : _a.username
      } : null;
      callback(user);
    });
  }
};
const AuthContext = createContext(void 0);
function useAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Error checking user:", err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
    const {
      data: { subscription }
    } = auth.onAuthStateChange((user2) => {
      setUser(user2);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    const result = await auth.signIn(email, password);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };
  const signUp = async (email, password) => {
    setLoading(true);
    setError(null);
    const result = await auth.signUp(email, password);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };
  const signOut = async () => {
    setLoading(true);
    setError(null);
    const result = await auth.signOut();
    if (result.error) {
      setError(result.error);
    } else {
      setUser(null);
    }
    setLoading(false);
    return result;
  };
  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children });
}
const Route$3 = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "FinanzPlaner - Intelligente Finanzverwaltung"
      }
    ]
  }),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { className: "text-foreground", children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
const createServerRpc = (functionId, serverBase, splitImportFn) => {
  invariant(
    splitImportFn);
  const url = `/${sanitizeBase(serverBase)}/${functionId}`;
  return Object.assign(splitImportFn, {
    url,
    functionId
  });
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
const filePath = "count.txt";
async function readCount() {
  return parseInt(await fs.promises.readFile(filePath, "utf-8").catch(() => "0"));
}
const getCount_createServerFn_handler = createServerRpc("src_routes_index_tsx--getCount_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getCount.__executeServer(opts, signal);
});
const getCount = createServerFn({
  method: "GET"
}).handler(getCount_createServerFn_handler, () => {
  return readCount();
});
const updateCount_createServerFn_handler = createServerRpc("src_routes_index_tsx--updateCount_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return updateCount.__executeServer(opts, signal);
});
const updateCount = createServerFn({
  method: "POST"
}).validator((d) => d).handler(updateCount_createServerFn_handler, async ({
  data
}) => {
  const count = await readCount();
  await fs.promises.writeFile(filePath, `${count + data}`);
});
const Route$2 = createFileRoute("/")({
  component: Home
});
function Home() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50", children: [
    /* @__PURE__ */ jsx("header", { className: "bg-white shadow-sm border-b", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center py-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Euro, { className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-gray-900", children: "FinanzCoach Pro" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "Deutsche Bank Gruppe" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex space-x-6", children: [
        /* @__PURE__ */ jsx("a", { href: "#services", className: "text-gray-700 hover:text-blue-600 transition-colors", children: "Leistungen" }),
        /* @__PURE__ */ jsx("a", { href: "#about", className: "text-gray-700 hover:text-blue-600 transition-colors", children: "Über mich" }),
        /* @__PURE__ */ jsx("a", { href: "#testimonials", className: "text-gray-700 hover:text-blue-600 transition-colors", children: "Referenzen" }),
        /* @__PURE__ */ jsx("a", { href: "#contact", className: "text-gray-700 hover:text-blue-600 transition-colors", children: "Kontakt" })
      ] }),
      /* @__PURE__ */ jsx(Button, { className: "bg-blue-600 hover:bg-blue-700", children: "Beratungstermin buchen" })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 lg:py-32", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Badge, { className: "mb-4 bg-blue-100 text-blue-800 border-blue-200", children: "Zertifizierte Finanzberatung" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6", children: [
          "Ihre finanzielle",
          /* @__PURE__ */ jsx("span", { className: "text-blue-600 block", children: "Zukunft beginnt heute" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 mb-8 leading-relaxed", children: "Als erfahrener FinanzCoach der Deutschen Bank helfe ich Ihnen dabei, Ihre finanziellen Ziele zu erreichen und eine sichere Zukunft aufzubauen." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
          /* @__PURE__ */ jsx(Button, { size: "lg", className: "bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4", children: "Kostenlose Erstberatung" }),
          /* @__PURE__ */ jsx(Button, { variant: "outline", size: "lg", className: "text-lg px-8 py-4", children: "Mehr erfahren" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-8 mt-8 pt-8 border-t", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900", children: "500+" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Zufriedene Kunden" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900", children: "15+" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Jahre Erfahrung" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-gray-900", children: "€50M+" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: "Verwaltetes Vermögen" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:pl-12", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur opacity-20" }),
        /* @__PURE__ */ jsxs(Card, { className: "relative bg-white border-0 shadow-2xl", children: [
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-6 w-6 text-green-600" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Portfolio Performance" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Ihre Investitionen im Überblick" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Gesamtrendite (YTD)" }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-green-600", children: "+12.4%" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full", style: {
              width: "74%"
            } }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { children: "Ziel: €250,000" }),
              /* @__PURE__ */ jsx("span", { children: "Aktuell: €185,000" })
            ] })
          ] }) })
        ] })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { id: "services", className: "py-20 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx(Badge, { className: "mb-4 bg-blue-100 text-blue-800 border-blue-200", children: "Meine Leistungen" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold text-gray-900 mb-4", children: "Umfassende Finanzberatung für Ihren Erfolg" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Von der Vermögensplanung bis zur Altersvorsorge - ich begleite Sie auf Ihrem Weg zur finanziellen Unabhängigkeit." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-300", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(PiggyBank, { className: "h-6 w-6 text-blue-600" }) }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Vermögensaufbau" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Strategien für nachhaltigen Vermögensaufbau und optimale Renditen" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }),
              "Individuelle Anlagestrategie"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }),
              "Risikomanagement"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }),
              "Diversifikation"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-300", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Shield, { className: "h-6 w-6 text-green-600" }) }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Altersvorsorge" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Planen Sie heute für einen sorgenfreien Ruhestand von morgen" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }),
              "Rentenplanung"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }),
              "Private Vorsorge"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }),
              "Steueroptimierung"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-300", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(BarChart3, { className: "h-6 w-6 text-purple-600" }) }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Finanzanalyse" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Detaillierte Analyse Ihrer aktuellen Finanzsituation" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }),
              "Portfolio-Bewertung"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }),
              "Kostenanalyse"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-500 mr-2" }),
              "Optimierungsvorschläge"
            ] })
          ] }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "about", className: "py-20", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Badge, { className: "mb-4 bg-blue-100 text-blue-800 border-blue-200", children: "Über mich" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold text-gray-900 mb-6", children: "Erfahrung, die Sie weiterbringt" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 mb-6", children: "Mit über 15 Jahren Erfahrung in der Finanzbranche und als zertifizierter Berater der Deutschen Bank bringe ich die Expertise mit, die Sie für Ihre finanziellen Entscheidungen benötigen." }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx(Award, { className: "h-5 w-5 text-blue-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "Zertifizierter Finanzplaner (CFP)" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-blue-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "Über 500 zufriedene Kunden" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5 text-blue-600" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: "Durchschnittliche Rendite: 8.5% p.a." })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { className: "bg-blue-600 hover:bg-blue-700", children: "Persönliches Gespräch vereinbaren" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:pl-12", children: /* @__PURE__ */ jsxs(Card, { className: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-blue-900", children: "Meine Qualifikationen" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-blue-900", children: "Certified Financial Planner (CFP)" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700", children: "International anerkannte Zertifizierung" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-blue-900", children: "Master in Finance" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700", children: "Frankfurt School of Finance & Management" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-blue-900", children: "Deutsche Bank Zertifizierung" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700", children: "Spezialist für Vermögensberatung" })
          ] })
        ] })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { id: "testimonials", className: "py-20 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx(Badge, { className: "mb-4 bg-blue-100 text-blue-800 border-blue-200", children: "Kundenstimmen" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold text-gray-900 mb-4", children: "Was meine Kunden sagen" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-300", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gray-300 rounded-full" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Maria Schmidt" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Unternehmerin, München" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: '"Dank der professionellen Beratung konnte ich meine Altersvorsorge optimal strukturieren. Die Rendite übertrifft meine Erwartungen!"' }),
            /* @__PURE__ */ jsx("div", { className: "flex mt-4", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-4 h-4 text-yellow-400", children: "★" }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-300", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gray-300 rounded-full" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Thomas Weber" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "IT-Manager, Hamburg" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: '"Kompetente und verständliche Beratung. Mein Portfolio ist jetzt deutlich besser diversifiziert und performt hervorragend."' }),
            /* @__PURE__ */ jsx("div", { className: "flex mt-4", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-4 h-4 text-yellow-400", children: "★" }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "hover:shadow-lg transition-shadow duration-300", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gray-300 rounded-full" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Anna Müller" }),
              /* @__PURE__ */ jsx(CardDescription, { children: "Ärztin, Berlin" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: '"Endlich habe ich einen Überblick über meine Finanzen. Die Beratung war sehr professionell und auf meine Bedürfnisse zugeschnitten."' }),
            /* @__PURE__ */ jsx("div", { className: "flex mt-4", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "w-4 h-4 text-yellow-400", children: "★" }, i)) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "contact", className: "py-20 bg-blue-600 text-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl lg:text-4xl font-bold mb-4", children: "Bereit für Ihre finanzielle Zukunft?" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-blue-100 max-w-3xl mx-auto", children: "Vereinbaren Sie noch heute Ihren kostenlosen Beratungstermin und lassen Sie uns gemeinsam Ihre finanziellen Ziele erreichen." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxs(Card, { className: "bg-white text-gray-900", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Kontakt aufnehmen" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Ich freue mich auf unser Gespräch" })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5 text-blue-600" }),
              /* @__PURE__ */ jsx("span", { children: "+49 (0) 69 123 456 789" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-blue-600" }),
              /* @__PURE__ */ jsx("span", { children: "coach@deutsche-bank-finanz.de" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-blue-600" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Deutsche Bank Filiale",
                /* @__PURE__ */ jsx("br", {}),
                "Taunusanlage 12, 60325 Frankfurt"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold", children: "Warum Deutsche Bank?" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsx(Shield, { className: "h-6 w-6 text-blue-200 mt-1" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Sicherheit & Vertrauen" }),
                /* @__PURE__ */ jsx("p", { className: "text-blue-100", children: "Über 150 Jahre Erfahrung im Bankwesen" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "h-6 w-6 text-blue-200 mt-1" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Beste Konditionen" }),
                /* @__PURE__ */ jsx("p", { className: "text-blue-100", children: "Exklusive Angebote für unsere Kunden" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
              /* @__PURE__ */ jsx(Users, { className: "h-6 w-6 text-blue-200 mt-1" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: "Persönliche Betreuung" }),
                /* @__PURE__ */ jsx("p", { className: "text-blue-100", children: "Ihr fester Ansprechpartner vor Ort" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Button, { size: "lg", className: "w-full bg-white text-blue-600 hover:bg-blue-50 text-lg py-4", children: "Termin vereinbaren" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "bg-gray-900 text-white py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-4 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Euro, { className: "h-5 w-5 text-white" }) }),
            /* @__PURE__ */ jsx("span", { className: "font-bold", children: "FinanzCoach Pro" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Ihr Partner für eine erfolgreiche finanzielle Zukunft." })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-4", children: "Services" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-400", children: [
            /* @__PURE__ */ jsx("li", { children: "Vermögensaufbau" }),
            /* @__PURE__ */ jsx("li", { children: "Altersvorsorge" }),
            /* @__PURE__ */ jsx("li", { children: "Finanzanalyse" }),
            /* @__PURE__ */ jsx("li", { children: "Steueroptimierung" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-4", children: "Unternehmen" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-400", children: [
            /* @__PURE__ */ jsx("li", { children: "Über uns" }),
            /* @__PURE__ */ jsx("li", { children: "Karriere" }),
            /* @__PURE__ */ jsx("li", { children: "Presse" }),
            /* @__PURE__ */ jsx("li", { children: "Kontakt" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold mb-4", children: "Rechtliches" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-400", children: [
            /* @__PURE__ */ jsx("li", { children: "Impressum" }),
            /* @__PURE__ */ jsx("li", { children: "Datenschutz" }),
            /* @__PURE__ */ jsx("li", { children: "AGB" }),
            /* @__PURE__ */ jsx("li", { children: "Risikohinweise" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400", children: /* @__PURE__ */ jsx("p", { children: "© 2024 Deutsche Bank AG. Alle Rechte vorbehalten." }) })
    ] }) })
  ] });
}
const $$splitComponentImporter$1 = () => import('./index-CTeKEaN1.mjs');
const Route$1 = createFileRoute("/transactions/")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component", () => Route$1.ssr)
});
const $$splitComponentImporter = () => import('./index-DsHpg12t.mjs');
const Route = createFileRoute("/dashboard/")({
  component: lazyRouteComponent($$splitComponentImporter, "component", () => Route.ssr)
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const TransactionsIndexRoute = Route$1.update({
  id: "/transactions/",
  path: "/transactions/",
  getParentRoute: () => Route$3
});
const DashboardIndexRoute = Route.update({
  id: "/dashboard/",
  path: "/dashboard/",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  DashboardIndexRoute,
  TransactionsIndexRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
const routeTree_gen = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  routeTree
}, Symbol.toStringTag, { value: "Module" }));
function createRouter() {
  const router = createRouter$1({
    routeTree,
    scrollRestoration: true
  });
  return router;
}
const serverEntry$1 = createStartHandler({
  createRouter
})(defaultStreamHandler);
const serverEntry = defineEventHandler(function(event) {
  const request = toWebRequest(event);
  return serverEntry$1({ request });
});

export { Badge as B, Card as C, CardHeader as a, CardTitle as b, cn as c, CardDescription as d, serverEntry as default, CardContent as e, Button as f, createServerRpc as g, createServerFn as h, supabase as s, useAuth as u };
//# sourceMappingURL=ssr.mjs.map
