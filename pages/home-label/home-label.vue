<template>
	<view class="label">
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					我的标签
				</view>
				<view class="label-edit" @click="editLabel">
					{{is_edit ? '完成' : '编辑'}}
				</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view class="label-content">
				<view class="label-content_item" v-for="(item, index) in labelList" :key="index">
					{{item.name}}
					<uni-icons v-if="is_edit" @click="del(index)" class="icons-close" type="clear" size="20"
						color="red"></uni-icons>
				</view>
			</view>
			<view v-if="labelList.length === 0 && !loading" class="no-data">
				当前没有数据
			</view>
		</view>
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">
					标签推荐
				</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view class="label-content">
				<view class="label-content_item" v-for="(item, index) in list" :key="item._id" @click="add(index)">
					{{item.name}}
				</view>
			</view>
			<view v-if="list.length === 0 && !loading" class="no-data">
				当前没有数据
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				is_edit: false,
				labelList: [],
				list: [],
				loading: true
			}
		},
		onLoad() {
			this.getLabel()
		},
		methods: {
			editLabel() {
				this.is_edit = !this.is_edit
				if (!this.is_edit) {
					this.setUpdateLabel(this.labelList)
				}
			},
			getLabel() {
				this.$api.get_label({
						type: 'all'
					})
					.finally(res => {
						this.loading = false
					})
					.then(res => {
						const {
							data
						} = res
						this.labelList = data.filter(item => {
							return item.current
						})
						this.list = data.filter(item => !item.current)
					})
			},
			add(index) {
				if (!this.is_edit) return
				this.labelList.push(this.list[index])
				this.list.splice(index, 1)
			},
			del(index) {
				this.list.push(this.labelList[index])
				this.labelList.splice(index, 1)
			},
			setUpdateLabel(label) {
				const newList = label.map(item => item._id)
				uni.showLoading()
				this.$api.update_label({
						label: newList
					})
					.then(res => {
						uni.hideLoading()
						uni.showToast({
							title: '更新成功'
						})
						uni.$emit('labelChange')
					})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.label {
		.label-box {
			background-color: #FFFFFF;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				padding: 10px;
				color: #666;
				border: 1px solid #f5f5f5;

				.label-edit {
					color: #30b33a;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content_item {
					padding: 2px 5px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px solid #666;
					font-size: 14px;
					color: #666;
					position: relative;

					.icons-close {
						position: absolute;
						right: -8px;
						top: -8px;
						background-color: #FFFFFF;
					}
				}
			}
		}
		.no-data {
			text-align: center;
			padding: 50px 0;
			color: #999999;
			font-size: 14px;
			width: 100%;
		}
	}
</style>
