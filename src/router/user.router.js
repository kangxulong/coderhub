const Router = require("koa-router");
const {
  create,
  avatarInfo
} = require("../controller/user.controller");
const {
  verifyUser,
  handlePassword
}= require("../middleware/user.middleware")

// 给userRouter添加前缀
const userRouter = new Router({prefix:"/users"})

userRouter.post("/",verifyUser,handlePassword,create);

// 获取用户头像
userRouter.get("/:userId/avatar",avatarInfo)

module.exports = userRouter;