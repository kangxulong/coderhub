const fs = require("fs")

const fileService = require("../service/file.service");
const userService = require("../service/user.service");

const {AVATAR_PATH} = require("../constants/file-path")

class UserController {
  async create(ctx,next) {
    // 获取用户请求的参数
    const user = ctx.request.body;
    // 查询数据（mysql操作，会有很多，故进行抽取）
    const result = await userService.create(user);

    // 返回数据
    ctx.body = result;
  }
  async avatarInfo(ctx,next) {
    const {userId} = ctx.params;
    const avatarInfo = await fileService.getAvatarInfoById(userId);

    // 如果不是下载文件，则需要设置mimetype，否则访问就会是
    ctx.response.set("content-type",avatarInfo.mimetype)
    
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
  }
}

module.exports = new UserController();