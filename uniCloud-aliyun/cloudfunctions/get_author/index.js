'use strict';
// 获取数据库的引用
const db = uniCloud.database()
// 获取聚合的引用
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		user_id
	} = event
	
	const userinfo = await db.collection('user').doc(user_id).get()
	const author_likes_ids = userinfo.data[0].author_likes_ids

	// 聚合：更精细化的去处理数据（求和 、分组、指定返回某些字段）
	const list = await db.collection('user')
		.aggregate()
		// 追加字段
		.addFields({
			is_like: $.in(['$id', author_likes_ids])
		})
		.match({
			is_like:true
		})
		.end()
	
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
