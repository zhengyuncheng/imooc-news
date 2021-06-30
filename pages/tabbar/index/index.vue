<template>
	<view class="home">
		<!-- 自定义导航栏 -->
		<navbar></navbar>
		<tab :list="tabList" @tab="tab"></tab>
		<view class="home-list">
			<list :tab='tabList'></list>
		</view>
		<!-- <list-scroll>
			<list-card mode='base'></list-card>
			<list-card mode='image'></list-card>
			<list-card mode='column'></list-card>
		</list-scroll> -->
	</view>
</template>

<script>
	// easyCom components/组件名/组件名.vue  局部引入
	// import navbar from '../../../components/navbar/navbar.vue'
	export default {
		// components:{
		// 	navbar
		// },
		data() {
			return {
				tabList: []
			}
		},
		onLoad() {
			this.getLabel()
		},
		methods: {
			getLabel() {
				// 调用云函数方法
				this.$api.get_label().then(res => {
					this.tabList = res.data
				})
			},
			tab({data, index}) {
				
			}
		}
	}
</script>

<style lang="scss">
page {
	height: 100%;
	display: flex;
}
.home {
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow: hidden;
	.home-list {
		flex: 1;
		box-sizing: border-box;
	}
}
</style>
