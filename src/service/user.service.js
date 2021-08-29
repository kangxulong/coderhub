const connections = require("../app/database");

class UserService {
	async create(user) {
		// 获取传入的参数user中的字段
		const { username, password } = user;
		// 将参数插入数据库中
		const statement = `INSERT INTO users(name,password) VALUES(?,?);`;
		const result = await connections.execute(statement, [username, password]);
		// 返回插入后的数据，在controller中调用后
		return result;
	}

	async getUserByName(username) {
		const statement = `SELECT * FROM users WHERE name = ?;`;
		const result = await connections.execute(statement, [username]);
		return result[0];
	}

	async updateAvatarUrlById(avatarUrl, userId) {
		const statement = `UPDATE users SET avatar_url = ? WHERE id = ?;`;

		try {
			const [result] = await connections.execute(statement, [
				avatarUrl,
				userId
			]);
			return result;
		} catch (error) {
      console.log(error);
    }
	}
}

module.exports = new UserService();
