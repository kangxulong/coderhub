const connections = require("../app/database");

class AuthService {
	async checkResource(tableName,momentId, userId) {
		try {
			const statement = `SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?;`;
			const [result] = await connections.execute(statement, [momentId, userId]);
			console.log(result.length);
			return result.length === 0 ? false : true;
		} catch (error) {
      console.log(error);
    }
	}
}

module.exports = new AuthService();
