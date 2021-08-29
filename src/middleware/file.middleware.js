const Jimp = require("jimp");
const path = require("path");
const multer = require("koa-multer");

const { AVATAR_PATH, PICTURE_PATH } = require("../constants/file-path");

const avatarUpload = multer({
	dest: AVATAR_PATH,
});

const avatarHandler = avatarUpload.single("avatar");

const pictureUpload = multer({
	dest: PICTURE_PATH,
});

const pictureHandler = pictureUpload.array("picture");

const pictureResize = async (ctx, next) => {
	try {
		const files = ctx.req.files;
		for (let file of files) {
			const destPath = path.join(file.destination, file.filename);

			Jimp.read(file.path).then((image) => {
				image.resize(1280, Jimp.AUTO).write(`${destPath}-1280`);
				image.resize(640, Jimp.AUTO).write(`${destPath}-640`);
				image.resize(320, Jimp.AUTO).write(`${destPath}-320`);
			});
		}
		await next();
	} catch (error) {
    console.log(error);
  }
};

module.exports = {
	avatarHandler,
	pictureHandler,
	pictureResize,
};
