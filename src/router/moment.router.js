const Router = require("koa-router");

const {
  create,
  detail,
  list,
  update,
  remove,
  addLabel,
  pictureInfo
} = require("../controller/moment.controller.js");
const {
  verifyAuth,
  verifyPermission
} = require("../middleware/auth.middleware")
const {
  verifyLabelExists
} = require("../middleware/label.middleware")

const momentRouter = new Router({prefix:"/moment"});

momentRouter.post("/",verifyAuth,create);
momentRouter.get("/",list);
momentRouter.get("/:momentId",detail)
// 修改动态
momentRouter.patch("/:momentId",verifyAuth,verifyPermission,update);
// 删除动态
momentRouter.delete("/:momentId",verifyAuth,verifyPermission,remove);
// 给动态添加标签
momentRouter.post("/:momentId/labels",verifyAuth,verifyPermission,verifyLabelExists,addLabel);

// 请求动态配图
momentRouter.get("/images/:filename",pictureInfo)

module.exports = momentRouter;