const fs = require("fs");

// 读取当前文件(__dirname当前文件)所在的目录
const useRoute = (app) => {
  fs.readdirSync(__dirname).forEach(file => {
    if(file === "index.js") return;
    const router = require(`./${file}`);
    app.use(router.routes());
    app.use(router.allowedMethods());
  })
}
// const result = fs.readdirSync(__dirname);
// result.forEach(file => {
//   if(file === "index.js") return;
//   console.log(file);
// })

module.exports = useRoute;