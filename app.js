const myKoa = require('./lib/application.js');
const app = new myKoa();

app.use(async (ctx, next) => {
  console.log('入口1');
  await next();
  console.log('出口2');
});

app.use(async (ctx, next) => {
  console.log('入口2');
  await next();
  console.log('出口1');
});

app.listen(8085, function () {
  console.log('server listening on 8085');
});
