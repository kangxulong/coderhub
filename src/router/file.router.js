const Router = require("koa-router");
const { 
  verifyAuth 
} = require("../middleware/auth.middleware");
const {
  avatarHandler,
  pictureHandler,
  pictureResize
} = require("../middleware/file.middleware")
const {
  saveAvatarInfo,
  savePictureInfo
} = require("../controller/file.controller.js")

const fileRouter = new Router({prefix:"/uploads"});

fileRouter.post("/avatar",verifyAuth,avatarHandler,saveAvatarInfo);

fileRouter.post("/picture",verifyAuth,pictureHandler,pictureResize,savePictureInfo)

module.exports = fileRouter;