const app = require("./app")
// 导入数据库数据以加载数据库相关设置，测试数据库
require("./app/database")
const config = require("./app/config")

app.listen(config.APP_PORT,() => {
  console.log(`服务器在${config.APP_PORT}端口启动成功`);
})