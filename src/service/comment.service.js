const connections = require("../app/database");

class CommentService {
	async create(momentId, userId, content) {
		const statement = `INSERT INTO comment(moment_id,user_id,content) VALUES(?,?,?);`;

		const [result] = await connections.execute(statement, [
			momentId,
			userId,
			content,
		]);

		return result;
	}

	async reply(momentId, userId, content, commentId) {
		const statement = `INSERT INTO comment(moment_id,user_id,content,comment_id) Value(?,?,?,?);`;
		const [result] = await connections.execute(statement, [
			momentId,
			userId,
			content,
			commentId,
		]);

		console.log(result);
		return result;
	}
	async update(commentId, content) {
		const statement = `UPDATE comment SET content = ? WHERE id = ?;`;
		const [result] = await connections.execute(statement, [content, commentId]);
		return result;
	}
	async remove(commentId) {
		const statement = `DELETE FROM comment WHERE id = ?;`;
		const [result] = await connections.execute(statement, [commentId]);
		return result;
	}
	async getCommentsByMomentId(momentId) {
		const statement = `
    SELECT 
      com.id,com.content,com.comment_id commentID,com.createAt createTime,
      JSON_OBJECT('id',u.id,'name',u.name)
    FROM comment com
    LEFT JOIN users u ON u.id = com.user_id
    WHERE moment_id = ?;`;
		try {
			const [result] = await connections.execute(statement, [momentId]);
			return result;
		} catch (error) {
      console.log(error);
    }
	}
}

module.exports = new CommentService();
