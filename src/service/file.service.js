const connections = require("../app/database");

class FileService {
	async createAvater(filename, mimetype, size, userId) {
		const statement = `INSERT INTO avatar (filename,mimetype,size,user_id) VALUES(?,?,?,?);`;
		try {
			const [result] = await connections.execute(statement, [
				filename,
				mimetype,
				size,
				userId,
			]);

			return result;
		} catch (error) {
			console.log(error);
		}
	}

	async getAvatarInfoById(userId) {
		const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
		const [result] = await connections.execute(statement, [userId]);
		return result[0];
	}

	async createPicture(filename, mimetype, size, userId, momentId) {
		try {
			const statement = `INSERT INTO picture (filename,mimetype,size,user_id,moment_id) VALUES(?,?,?,?,?);`;
			const [result] = await connections.execute(statement, [
				filename,
				mimetype,
				size,
				userId,
				momentId,
			]);
			return result;
		} catch (error) {
			console.log(error);
		}
	}

	async getPictureByFilename(filename) {
		try {
			const statement = `SELECT * FROM picture WHERE filename = ?;`;
			const [result] = await connections.execute(statement, [filename]);
			
			return result[0];
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = new FileService();
