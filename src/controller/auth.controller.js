const jwt = require("jsonwebtoken");

const {PRIVATE_KEY} = require("../app/config");

class AuthController{
  async login(ctx,next) {
    // 从user中取出id、name作为token的payload
    const {id,name} = ctx.user;
    // 创建token,使用id和name作为payload，使用非对称加密，私钥使用openSSL生成，加密算法使用RS256,设置过期时间expiresIn为一天
    const token = jwt.sign({id,name},PRIVATE_KEY,{
      algorithm:"RS256",
      expiresIn:60*60*24
    })

    ctx.body = {
      id,
      name,
      token
    }
  }
  async success(ctx,next) {
    ctx.body = "授权成功";
    await next()
  }
}

module.exports = new AuthController();