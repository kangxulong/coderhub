const connections = require("../app/database");

class momentService {
	async create(userId, content) {
		const statement = `INSERT INTO moment(user_id,content)VALUES(?,?)`;
		const [result] = await connections.execute(statement, [userId, content]);
		console.log(result);
		return result;
	}
	async getMomentById(momentId) {
    // mysql 5.7之后默认开启ONLY_FULL_GROUP_BY

    // 这样查询有个bug，会根据comment的数量来进行多次左查询标签，所以会出现很多个重复标签
		// const statement = `
    //   SELECT 
    //     m.id id,
    //     m.content content,
    //     m.createAt createTime,
    //     m.updateAt uodateTime,
    //   JSON_OBJECT("id",u.id,"userName",u.name) user,
    //   IF(COUNT(c.id),JSON_ARRAYAGG(
    //     JSON_OBJECT("id",c.id,"content", c.content,"commentId",c.comment_id,"createTime",c.createAt,"updateTime",c.updateAt,
    //       "user",JSON_OBJECT("id",cu.id,"name",cu.name)
    //     )
    //   ),NULL) comments,
    //   IF(COUNT(l.id),JSON_ARRAYAGG(
    //     JSON_OBJECT("id",l.id,"name",l.name)
    //   ) ,NULL) labels
    //   FROM moment m
    //   LEFT JOIN users u ON m.user_id = u.id
    //   LEFT JOIN comment c ON c.moment_id = m.id
    //   LEFT JOIN users cu ON cu.id = c.user_id
    //   LEFT JOIN moment_label ml ON ml.moment_id = m.id
    //   LEFT JOIN label l ON l.id = ml.label_id
    //   WHERE m.id = ?
    //   GROUP BY id;
    //   `

    const statement = `
      SELECT 
        m.id id,
        m.content content,
        m.createAt createTime,
        m.updateAt uodateTime,
      JSON_OBJECT("id",u.id,"userName",u.name,"avatarUrl",u.avatar_url) user,
      (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
        JSON_OBJECT("id",c.id,"content", c.content,"commentId",c.comment_id,"createTime",c.createAt,"updateTime",c.updateAt,
          "user",JSON_OBJECT("id",cu.id,"name",cu.name,"avatarUrl",cu.avatar_url)
        )
      ),NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id WHERE c.moment_id = m.id) comments,
      IF(COUNT(l.id),JSON_ARRAYAGG(
        JSON_OBJECT("id",l.id,"name",l.name)
      ) ,NULL) labels,
      (SELECT JSON_ARRAYAGG(CONCAT("http://localhost:8888/moment/images/",p.filename)) FROM picture p WHERE p.moment_id = m.id) images
      FROM moment m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON ml.moment_id = m.id
      LEFT JOIN label l ON l.id = ml.label_id
      WHERE m.id = ?
      GROUP BY id;
    `

		try {
			const [result] = await connections.execute(statement, [momentId]);
			console.log(result);
			return result[0];
		} catch (error) {
      console.log(error);
    }
	}
	async getMomentList(offset, size) {
		const statement = `
      SELECT 
        m.id id,
        m.content content,
        m.createAt createTime,
        m.updateAt updateTime,
      JSON_OBJECT("id",u.id,"userName",u.name) user,
      (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
      (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
      (SELECT JSON_ARRAYAGG(CONCAT("http://localhost:8888/moment/images/",p.filename)) FROM picture p WHERE p.moment_id = m.id) images
      FROM moment m
      LEFT JOIN users u ON m.user_id = u.id
      LIMIT ?,?;
      GROUP BY m.id
    `;
		const [result] = await connections.execute(statement, [offset, size]);
		return result;
	}
	async update(content, momentId) {
		const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
		const [result] = await connections.execute(statement, [content, momentId]);
		return result;
	}
	async remove(momentId) {
		const statement = `DELETE FROM moment WHERE id = ?`;
		const [result] = await connections.execute(statement, [momentId]);
		return result;
	}
	async hasLabels(momentId, labelId) {
		const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;
		const [result] = await connections.execute(statement, [momentId, labelId]);
		// 从结果中取数据，如果有数据，则为true
		return result[0] ? true : false;
	}
	async addLabel(momentId, labelId) {
		const statement = `INSERT INTO moment_label (moment_id,label_id) VALUES(?,?);`;
		const [result] = await connections.execute(statement, [momentId, labelId]);
		return result;
	}
}

module.exports = new momentService();
