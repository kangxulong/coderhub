const connections = require("../app/database");

class LabelService {
	async create(name) {
		const statement = `INSERT INTO label (name) VALUES(?);`;
		const [result] = await connections.execute(statement, [name]);
		return result;
	}
	async getLabelByName(name) {
		const statement = `SELECT * FROM label WHERE name = ?;`;
		try {
			const [result] = await connections.execute(statement, [name]);
			if (!result[0]) {
				throw new Error();
			}
			// 如果取到数据则返回true
			return result[0];
		} catch (error) {
			console.log(error);
		}
	}
	async getLabels(offset,limit) {
		const statement = `SELECT * FROM label LIMIT ?,?;`;
		const [result] = await connections.execute(statement,[offset,limit]);
		return result
	}
}

module.exports = new LabelService();
