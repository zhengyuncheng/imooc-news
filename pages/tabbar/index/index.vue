<template>
	<view class="home">
		<!-- 自定义导航栏 -->
		<navbar></navbar>
		<tab :list="tabList" @tab="tab" :tabIndex='tabIndex'></tab>
		<view class="home-list">
			<list :tab='tabList' :activeIndex='activeIndex' @change='change'></list>
		</view>
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
				tabList: [],
				tabIndex: 0,
				activeIndex: 0
			}
		},
		onLoad() {
			this.getLabel()
		},
		methods: {
			change(current){
				this.tabIndex = current
				this.activeIndex = current
			},
			getLabel() {
				// 调用云函数方法
				this.$api.get_label().then(res => {
					this.tabList = res.data
					this.tabList.unshift({
						name: '全部'
					})
				})
			},
			tab({data, index}) {
				this.activeIndex = index
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
