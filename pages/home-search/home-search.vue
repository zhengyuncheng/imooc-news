<template>
	<view class="home">
		<navbar :isSearch="true" @input='change'></navbar>
		<view class="home-list">
			<view v-if="is_history" class="label-box">
				<view class="label-header">
					<text class="label-title">搜索历史</text>
					<text class="label-clear">清空</text>
				</view>
				<view v-if="historyLists.length > 0" class="label-content">
					<view class="label-content_item" v-for="item in historyLists"> {{item.name}} </view>
				</view>
				<view v-else class="no-data">
					没有搜索历史
				</view>
			</view>
			<!-- <button type="default" @click="testBtn">添加历史记录</button> -->
			<list-scroll v-else class="list-scroll">
				<list-card  v-for="(item, index) in searchList" :key="index" :item="item"></list-card>
			</list-scroll>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				// historyLists: []
				is_history: false,
				searchList: []
			}
		},
		computed: {
			...mapState(['historyLists'])
		},
		onLoad() {
			this.getList()
		},
		methods: {
			change(value){
				// console.log(value)
				// this.getList(value)
				// 做标记
				if (this.mark) {
					this.mark = true
					this.timer = setTimeout(() => {
						this.getList(value)
						this.mark = false
					},1000)
				}
			},
			testBtn(){
				this.$store.dispatch('set_history', {
					name: 'test'
				})
			},
			getList(value) {
				this.$api.get_list({
						name: value
					})
					.then(res => {
						const {data} = res
						this.searchList = data
						console.log(data)
					})
			},
		}
	}
</script>

<style lang="scss">
page {
	height: 100%;
	display: flex;
	background-color: #f5f5f5;
}
.home {
	display: flex;
	flex-direction: column;
	flex: 1;
	.label-box {
		background-color: #FFFFFF;
		margin-bottom: 10px;
		.label-header {
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color: #666;
			padding: 10px 15px;
			border-bottom: 1px solid #f5f5f5;
			.label-title {
				color: $mk-base-color;
			}
			.label-clear {
				color: #30b33a;
				font-weight: bold;
			}
		}
		.label-content {
			display: flex;
			flex-wrap: wrap;
			padding: 15px;
			padding-top: 0;
			.label-content_item {
				padding: 2px 10px;
				margin-top: 12px;
				margin-right: 10px;
				border-radius: 5px;
				border: 1px solid #666;
				font-size: 14px;
				color: #666;
			}
		}
	}
	.no-data {
		height: 200px;
		line-height: 200px;
		width: 100%;
		text-align: center;
		font-size: 12px;
		color: #666;
	}
	
}
</style>
