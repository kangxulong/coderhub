const jwt = require("jsonwebtoken");

const errorTypes = require("../constants/errorTypes");
const userService = require("../service/user.service");
const authService = require("../service/auth.service");
const md5password = require("../utils/password-handle");

const { PUBLIC_KEY } = require("../app/config");

const verifyLogin = async (ctx, next) => {
	// 获取请求参数中的用户名及密码
	const { username, password } = ctx.request.body;
	// 验证用户名或密码是否为空
	if (!username || !password) {
		const error = new Error(errorTypes.USERNAME_OR_PASSWORD_IS_REQUIRED);
		return ctx.app.emit("error", error, ctx);
	}
	// 查询用户是否存在
	const result = await userService.getUserByName(username);
	const user = result[0];
	if (!user) {
		const error = new Error(errorTypes.USERNAME_DOSE_NOT_EXISTS);
		return ctx.app.emit("error", error, ctx);
	}
	// 验证密码是否正确,通过判定加密后的密码和查询到的user中的密码是否相等来判定
	if (md5password(password) !== user.password) {
		const error = new Error(errorTypes.PASSWORD_IS_INCORRECT);
		return ctx.app.emit("error", error, ctx);
	}
	// 将获取到的user对象保存在ctx中以便token验证
	ctx.user = user;
	await next();
};

const verifyAuth = async (ctx, next) => {
	console.log("验证授权token的middleware");
	// 取出header中的authorization

	const authorization = ctx.header.authorization;
	if (!authorization) {
		const error = new Error(errorTypes.UNAUTHORIZATION);
		return ctx.app.emit("error", error, ctx);
	}
	// authorization字符串中有多余的"Bearer "需要处理
	const token = authorization.replace("Bearer ", "");
	try {
		// 验证token
		console.log("进行验证");
		const result = jwt.verify(token, PUBLIC_KEY, {
			algorithms: ["RS256"],
		});
		// 最好保存一下result
		ctx.user = result;
		await next();
	} catch (err) {
		const error = new Error(errorTypes.UNAUTHORIZATION);
		ctx.app.emit("error", error, ctx);
	}
};

const verifyPermission = async (ctx, next) => {
	console.log("判定是否有修改权限");

	// 获取参数
	const [resourceKey] = Object.keys(ctx.params);
	console.log(resourceKey);
	const tableName = resourceKey.replace("Id", "");
	const resourceId = ctx.params[resourceKey];
	const { id } = ctx.user;

	try {
		// 通过修改checkMoment函数为可查询多个表来验证权限
		// const isPermission = await authService.checkMoment(momentId, id);
		const isPermission = await authService.checkResource(
			tableName,
			resourceId,
			id
		);
		console.log(isPermission);
		// 如果没有权限，直接抛出错误，会在catch中捕获
		if (!isPermission) {
			throw new Error();
		}
		await next();
	} catch (err) {
		console.log(err);
		const error = new Error(errorTypes.UNPERMISSION);
		return ctx.app.emit("error", error, ctx);
	}
};

module.exports = {
	verifyLogin,
	verifyAuth,
	verifyPermission,
};
