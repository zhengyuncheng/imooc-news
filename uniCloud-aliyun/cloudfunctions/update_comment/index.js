'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const dbCmd = db.command

exports.main = async (event, context) => {

	const {
		user_id, // 用户id
		article_id, // 文章id
		content, // 评论内容
		comment_id = '', // 评论id
		reply_id = "", // 子回复ID
		is_reply = false // 是否子回复
	} = event

	let user = await db.collection('user').doc(user_id).get()
	// 获取用户对象
	user = user.data[0]
	// 获取当前的文章信息
	const article = await db.collection('article').doc(article_id).get()
	// 获取文章下的所有评论
	const comments = article.data[0].comments

	let commentObj = {
		comment_id: genID(5), // 评论id
		comment_content: content, // 评论内容
		create_time: new Date().getTime(), // 创建时间
		is_reply:is_reply, // 却分主回复，还是子回复 
		author: {
			author_id: user._id, // 作者id
			author_name: user.author_name, // 作者名称
			avatar: user.avatar, // 作者头像
			professional: user.professional // 专业
		},
		replys: []
	}

	// 评论文章
	if (comment_id === '') {
		commentObj.replys = []
		commentObj = dbCmd.unshift(commentObj)
	} else {
		// 回复对文章的评论
		// 获取评论索引
		let commentIndex = comments.findIndex(item => item.comment_id === comment_id)

	
		let commentAuthor = ''
		if(is_reply){
			// 子回复
			commentAuthor = comments[commentIndex].replys.find(item=>item.comment_id === reply_id)
		}else{
			// 主回复
			// 获取作者信息
			commentAuthor = comments.find(item => item.comment_id === comment_id)
		}
		commentAuthor = commentAuthor.author.author_name
		commentObj.to = commentAuthor
		
		// 更新回复信息
		commentObj = {
			[commentIndex]: {
				replys: dbCmd.unshift(commentObj)
			}
		}

	}

	await db.collection('article').doc(article_id).update({
		comments: commentObj
	})

	//返回数据给客户端
	return {
		code: 200,
		msg: "数据更新成功"
	}
};


function genID(length) {
	return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}
