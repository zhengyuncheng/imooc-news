<template>
	<view class="icons" @click.stop="likeTap">
		<uni-icons :type="like ? 'heart-filled' : 'heart'" size="20" color="#f07373"></uni-icons>
	</view>
</template>

<script>
	export default {
		name: "likes",
		props: {
			item: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				like: false
			};
		},
		created() {
			this.like = this.item.is_like
		},
		watch:{
			item(newVal) {
				this.like = newVal.is_like
			}
		},
		methods: {
			likeTap(){
				this.like = !this.like
				this.setUdateLikes()
			},
			setUdateLikes() {
				uni.showLoading()
				this.$api.update_like({
					user_id: '60dc09f65e31f500012bc1cd',
					article_id: this.item._id
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: this.like ? '收藏成功' : '取消收藏',
						icon: 'none'
					})
				}).catch(err => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style>
	.icons {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
