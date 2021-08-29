const errorTypes = require("../constants/errorTypes");

const errorHandler = (error, ctx) => {
	let status, message;
	// 判定error.message和errorType的值
	switch (error.message) {
		case errorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED:
			status = 400; //400:传入的请求参数有问题
			message = "请求错误，请检查请求参数";
			break;
		case errorTypes.USERNAME_IS_EXISTS:
			status = 409; //conflict冲突，409代表发生冲突
			message = "用户名已存在";
			break;
		case errorTypes.USERNAME_DOSE_NOT_EXISTS:
			status = 400; //conflict冲突，409代表发生冲突
			message = "用户名不存在";
			break;
		case errorTypes.PASSWORD_IS_INCORRECT:
			status = 400; //conflict冲突，409代表发生冲突
			message = "密码不正确";
			break;
		case errorTypes.UNAUTHORIZATION:
			status = 401; //未授权
			message = "token授权无效，请先登录";
			break;
		case errorTypes.UNPERMISSION:
			status = 401; //未授权
			message = "您无权进行操作";
			break;
		default:
			status = 404;
			message = "NOT FOUND";
			break;
	}
	ctx.status = status;
	ctx.body = message;
};

module.exports = errorHandler;
