const errorTypes = require("../constants/errorTypes");
const service = require("../service/user.service");
const md5password = require("../utils/password-handle");

const verifyUser = async(ctx,next) => {

  // 获取传入的用户名和密码
  const {username, password} = ctx.request.body;
  // 验证用户名和密码是否为空
  if(!username || !password) {
    // 通过不同的常量来判断不同的错误处理，可以在errorhandler函数中进行处理
    const error = new Error(errorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error",error,ctx);
  }
  // 验证用户名是否已被注册
  const result = await service.getUserByName(username);
  // 此处返回的result依然是一个数组
  const user = result[0];
  if(user){
    const error = new Error(errorTypes.USERNAME_IS_EXISTS)
    return ctx.app.emit("error",error,ctx)
  }
  await next()
}

// 对传入的密码进行加密后存入数据库中
const handlePassword = async (ctx,next) => {
  const {password} = ctx.request.body;
  ctx.request.body.password = md5password(password);

  await next()
}

// 不止一个处理函数
module.exports = {
  verifyUser,
  handlePassword
};