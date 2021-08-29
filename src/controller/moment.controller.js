const fs = require("fs");

const fileService = require("../service/file.service");
const momentService = require("../service/moment.service");

const { PICTURE_PATH } = require("../constants/file-path");

class momentController {
	async create(ctx, next) {
		// 1.获取用户id和请求参数中的content
		const { id } = ctx.user;
		const { content } = ctx.request.body;
		// 将数据写入数据库的表中
		const result = await momentService.create(id, content);
		ctx.body = result;
	}
	async detail(ctx, next) {
		// 获取请求参数
		const { momentId } = ctx.params;
		// 根据请求参数在数据库中查询数据
		const result = await momentService.getMomentById(momentId);
		console.log(result);
		ctx.body = result;
	}
	async list(ctx, next) {
		// 获取参数中的offset(第几页）和size（一页显示多少）
		const { offset, size } = ctx.query;
		// 数据库中查询
		const result = await momentService.getMomentList(offset, size);
		ctx.body = result;
	}
	async update(ctx, next) {
		console.log("进行动态的更新");
		// 获取参数
		const { momentId } = ctx.params;
		const { content } = ctx.request.body;
		// 进行数据修改
		const result = await momentService.update(content, momentId);
		ctx.body = result;
	}
	async remove(ctx, next) {
		const { momentId } = ctx.params;

		const result = await momentService.remove(momentId);
		ctx.body = result;
	}
	async addLabel(ctx, next) {
		// 获取所有参数
		const { labels } = ctx;
		const { momentId } = ctx.params;
		// 添加所有标签
		for (let label of labels) {
			const isExist = await momentService.hasLabels(momentId, label.id);
			if (!isExist) {
				try {
					await momentService.addLabel(momentId, label.id);
				} catch (error) {
					console.log(error);
				}
			}
		}
		ctx.body = {
			statusCode: 200,
			info: "为动态创建标签成功",
		};
	}

	async pictureInfo(ctx, next) {
		console.log("获取动态图片");
		let { filename } = ctx.params;
		// 因为下面有对filename做处理，所以查询只能在filenam处理之前，否则查询不出结果
		const pictureInfo = await fileService.getPictureByFilename(filename);

		// 要求前端传入size参数，根据参数不同给出不同尺寸的图片
		const { type } = ctx.query;
		// type的类型为string
		console.log(typeof(type));
		const types = ["1280", "640","320"];
		console.log(`typeSome${types.some(item=>item === type)}`)
		try {
			if (types.some(item => item === type)) {
				console.log("拼接filename");
				filename = filename + "-" + type;
				console.log(`filename:${filename}`);
			}
		} catch (error) {
			console.log(error);
		}
		// 设置mimetype,不设置的话就会直接下载文件
		ctx.response.set("content-type", pictureInfo.mimetype);

		ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
	}
}

module.exports = new momentController();
