'use strict';
// 获取数据库索引
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		user_id,
		feedbackImages = [],
		content = ""
	} = event

	await db.collection('feedback').add({
		user_id,
		feedbackImages,
		content
	})

	//返回数据给客户端
	return {
		code: 200,
		msg: '更新成功'
	}
};
