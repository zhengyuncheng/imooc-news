<template>
	<view class="detail">
		<view class="detail-title">
			{{formData.title}}
		</view>
		<view class="detail-header">
			<view class="detail-header_logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header_content">
				<view class="detail-header_content-title">
					{{formData.author.author_name}}
				</view>
				<view class="detail-header_content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.create_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header_button"
				@click="follow(formData.author.id)">{{formData.is_author_like?'关注': '取消关注'}}</button>
		</view>
		<view class="detail-content">
			<view class="detail-html">
				<!-- <rich-text></rich-text> 也可以实现富文本 -->
				<!-- <uParse :content="formData.content" :noData="noData"></uParse> -->
				内容区域
			</view>
			<view class="detail-comment">
				<view class="comment-title">
					最新评论
				</view>
				<view class="comment-content" v-for="(item,index) in commentsList" :key='index'>
					<comments-box :comments='item' @reply="reply"></comments-box>
				</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="detail-bottom_input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom_icons">
				<view class="detail-bottom_icons-box">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>

				</view>
				<view class="detail-bottom_icons-box" @click="likeTap(formData._id)">
					<uni-icons :type="formData.is_like?'heart-filled':'heart' " size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom_icons-box" @click="thumbsup(formData._id)">
					<uni-icons :type="formData.is_thumbs_up?'hand-thumbsup-filled':'hand-thumbsup'" size="22" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<!-- ref只能绑定自定义组件，不能绑定原生组件 view,text,image -->
		<uni-popup ref="popup" type="bottom" :maskClick="false">
			<view class="popup-wrap">
				<view class="popup-header">
					<text @click="closeComment">取消</text>
					<text @click="submit">发布</text>
				</view>
				<view class="popup-content">
					<textarea class="popup-textarea" v-model="commentValue" placeholder="请输入评论内容..." maxlength="200"
						fixed />
					<view class="popup-count">
						{{commentValue.length}}/200
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue' // 富文本
	export default {
		components: {
			uParse
		},
		data() {
			return {
				formData: {},
				noData: `<p style='text-align:center;color:#666;'> 详情加载中... </p>`,
				commentValue: '',
				commentsList: [],
				replyFormData: {}
			}
		},
		onLoad(query) {
			this.formData = JSON.parse(query.params)
			this.get_detail()
			this.getComments()
		},
		methods: {
			thumbsup(article_id){
				this.setUpdateThumbs(article_id)
			},
			// 收藏
			likeTap(article_id) {
				this.setUpdateLike(article_id)
			},
			// 关注
			follow(author_id) {
				this.setUpdateAuthor(author_id)
			},
			openComment() { //打开评论发布窗口
				this.$refs.popup.open()
			},
			closeComment() {
				this.$refs.popup.close()
			},
			submit() {
				if (!this.commentValue) {
					uni.showToast({
						title: '请输入评论内容',
						icon: 'none'
					})
					return
				}
				this.setUpdateComment({
					content: this.commentValue,
					...this.replyFormData
				})
			},
			getComments() {
				this.$api.get_comments({
						article_id: this.formData._id
					})
					.then(res => {
						console.log(res)
						const {
							data
						} = res
						this.commentsList = data
					})
			},
			setUpdateComment(content) {
				const formData = {
					article_id: this.formData._id,
					...content
				}
				uni.showLoading()
				this.$api.update_comment(formData)
					.then(res => {
						this.getComments()
						uni.hideLoading()
						uni.showToast({
							title: '评论发布成功'
						})
						this.closeComment()
						this.replyFormData = null
						this.commentValue = ''
						console.log(res)
					})
			},
			get_detail() {
				this.$api.get_detail({
						article_id: this.formData._id
					})
					.finally(res => {
						uni.hideLoading()
					})
					.then(res => {
						// console.log(res)
						const {
							data
						} = res
						this.formData = data
					})
			},
			reply(e) {
				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"is_reply": e.is_reply
				}
				if (e.comments.reply_id) {
					this.replyFormData.reply_id = e.comments.reply_id
				}
				console.log(this.replyFormData)
				this.openComment()
			},
			// 关注作者
			setUpdateAuthor(author_id) {
				uni.showLoading()
				this.$api.update_author({
					author_id
				}).then(res => {
					console.log(res)
					this.formData.is_author_like = !this.formData.is_author_like
					uni.showToast({
						title: !this.formData.is_author_like ? '关注作者成功' : '取消关注成功'
					})
				}).finally(res => {
					uni.hideLoading()
				})
			},
			// 收藏文章
			setUpdateLike(article_id) {
				uni.showLoading()
				this.$api.update_like({
					article_id
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					this.formData.is_like = !this.formData.is_like
					uni.showToast({
						title: this.formData.is_like?'收藏成功': '取消收藏'
					})
					uni.$emit('update_article')
				})
			},
			// 点赞
			setUpdateThumbs(article_id){
				uni.showLoading()
				this.$api.update_thumbsup({
					article_id
				}).then(res => {
					console.log(res)
					uni.hideLoading()
					uni.showToast({
						title: res.msg
					})
					if (!this.formData.is_thumbs_up) {
						this.formData.thumbs_up_count++
					} 
					this.formData.is_thumbs_up = true
					
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		padding: 15px 0;
		padding-bottom: 50px;

		.detail-title {
			padding: 0 15px;
			font-size: 18px;
			font-weight: bold;
			color: #333;
		}

		.detail-header {
			display: flex;
			align-items: center;
			margin-top: 10px;
			padding: 0 15px;

			.detail-header_logo {
				flex-shrink: 0;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.detail-header_content {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				font-size: 12px;
				padding-left: 10px;

				.detail-header_content-title {
					font-size: 14px;
					color: #333;
				}

				.detail-header_content-info {
					color: #999;

					text {
						margin-right: 10px;
					}
				}
			}

			.detail-header_button {
				flex-shrink: 0;
				height: 30px;
				font-size: 12px;
				background-color: $mk-base-color;
				color: #FFFFFF;
			}
		}

		.detail-content {
			margin-top: 20px;
			min-height: 500px;

			.detail-html {
				padding: 15px;
			}

			.detail-comment {
				margin-top: 30px;

				.comment-title {
					padding: 10px 15px;
					font-size: 14px;
					color: #666;
					border-bottom: 1px solid #f5f5f5;
				}

				.comment-content {
					padding: 0 15px;
					border-top: 1px solid #eee;
				}
			}
		}

		.detail-bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 44px;
			border-top: 1px solid #f5f5f5;
			background-color: #fff;
			box-sizing: border-box;

			.detail-bottom_input {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-left: 10px;
				padding: 0 10px;
				width: 100%;
				height: 30px;
				border: 1px solid #ddd;
				border-radius: 5px;

				text {
					font-size: 14px;
					color: #999;
				}
			}

			.detail-bottom_icons {
				display: flex;
				flex-shrink: 0;
				padding: 0 10px;

				.detail-bottom_icons-box {
					display: flex;
					align-items: center;
					position: relative;
					width: 44px;
					justify-content: center;
				}
			}
		}

		.popup-wrap {
			background-color: #FFFFFF;

			.popup-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				border-bottom: 1px solid #F5F5F5;

				>text {
					height: 50px;
					line-height: 50px;
					padding: 0 15px;
				}
			}

			.popup-content {
				width: 100%;
				padding: 15px;
				box-sizing: border-box;

				.popup-textarea {
					width: 100%;
					height: 200px;
				}

				.popup-count {
					display: flex;
					justify-content: flex-end;
					font-size: 12px;
					color: #999;
				}
			}
		}
	}
</style>
