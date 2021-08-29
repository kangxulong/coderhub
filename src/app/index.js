const Koa = require("koa");
const bodyparser = require("koa-bodyparser");

const useRoute = require("../router")
const errorHandler = require("./error.handle")

const app = new Koa();

// 使用bodyparser转换用户传入的json参数
app.use(bodyparser())

// 简化了app.use(router.route());
useRoute(app)

app.on("error",errorHandler)


module.exports = app;