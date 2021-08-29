const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path")

dotenv.config();

// 此处使用绝对路径防止启动目录的不对导致相对路径拼接错误
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname,"./keys/private.key"));
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname,"./keys/public.key"));

module.exports = {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD
} = process.env

// 这两条不能写在最顶上，因为上面process.env处理对module.exports对象进行了重新赋值
module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.PUBLIC_KEY = PUBLIC_KEY;