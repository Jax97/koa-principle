const EventEmitter = require('events');
const http = require('http');
const context = require('./context');

class Application extends EventEmitter {
  constructor() {
    super();
    this.middlewares = [];
    this.context = context || {};
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
  compose() {
    return async (ctx) => {
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, oldNext);
        };
      }
      let len = this.middlewares.length;
      let next = async () => {
        Promise.resolve();
      };

      for (let i = len - 1; i >= 0; i--) {
        let currentMiddleware = this.middlewares[i];
        next = createNext(currentMiddleware, next);
      }
      await next();
    };
  }

  createContext() {
    let ctx = Object.create(this.context);
    return ctx;
  }
  onerr(err, ctx) {
    this.omit(err, ctx);
  }
  // 最终要输出的内容
  callback() {
    return (req, res) => {
      let fn = this.compose();
      const ctx = this.createContext();
      return fn(ctx)
        .then(() => {
          res.end('hello callback');
        })
        .catch((err) => {
          console.log(err);
        });
    };
  }
}

module.exports = Application;
