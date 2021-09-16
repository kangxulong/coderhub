const { APP_HOST, APP_PORT } = require("../app/config");

const fileService = require("../service/file.service");
const userService = require("../service/user.service");

class FileController {
	async saveAvatarInfo(ctx, next) {
		console.log("头像上传");
		// 1. 取出头像图片信息
		const { filename, mimetype, size, path } = ctx.req.file;
		const { id } = ctx.user;
		// 2. 将图像信息保存到数据库中
		await fileService.createAvater(filename, mimetype, size, id);

		// 3.将图片地址保存到user表中
		// 获取头像图片地址
		const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
		console.log(avatarUrl);
		// 保存到表中
		await userService.updateAvatarUrlById(avatarUrl, id);

		// 3.返回信息
		ctx.body = {
			status: 200,
			message: "上传头像成功",
		};
	}
	async savePictureInfo(ctx, next) {
		try {
			const files = ctx.req.files;
			const { id } = ctx.user;
			const { momentId } = ctx.query;
			console.log(momentId, id);
			for (let file of files) {
				const { filename, mimetype, size } = file;
				console.log(filename, mimetype, size);
				// 将信息存储到数据表中
				await fileService.createPicture(filename, mimetype, size, id, momentId);
			}

			ctx.body = "动态配图上传成功";
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = new FileController();
