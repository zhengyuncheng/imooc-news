<template>
	<swiper class="home-swiper" :current="activeIndex" @change="change">
		<swiper-item class="swiper-item" v-for="(item, index) in tab" :key="index">
			<list-item :list='listCartData[index]' :load='load[index]' @loadmore="loadmore"></list-item>
		</swiper-item>
	</swiper>
</template>

<script>
	import listItem from './list-item.vue'
	export default {
		name: "list",
		props: {
			tab: {
				type: Array,
				default () {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		components: {
			listItem
		},
		data() {
			return {
				list: [],
				// js 的限制 listCardData[index] = data 不会触发更新
				listCartData: {},
				load: {},
				pageSize: 5
			};
		},
		watch: {
			tab(newVal) {
				if (newVal.length === 0) return
				this.listCartData = {}
				this.getList(this.activeIndex)
			}
		},
		created() {
			// tab 还没有赋值
			// this.getList(0)
			uni.$on('update_article', () => {
				this.getList(this.activeIndex)
			})
		},
		methods: {
			change(e) {
				const {
					current
				} = e.detail
				this.$emit('change', current)
				// 当数据不存在或者 数据为空的情况下 请求数据
				if (!this.listCartData[current] || this.listCartData[current].length === 0) {
					this.getList(current)
				}

			},
			getList(current) {
				if (!this.load[current]) {
					this.load[current] = {
						page: 1,
						loading: 'loading'
					}
				}
				this.$api.get_list({
						name: this.tab[current].name,
						page: this.load[current].page,
						pageSize: this.pageSize
					})
					.then(res => {
						// this.listCartData[current] = data
						if (res.data.length === 0) {
							let oldLoad = {}
							oldLoad.loading = 'noMore'
							oldLoad.page = this.load[current].page
							this.$set(this.load, current, oldLoad)
						}
						let oldList = this.listCartData[current] || []
						oldList.push(...res.data)
						this.$set(this.listCartData, current, oldList)
					})
			},
			loadmore() {
				if (this.load[this.activeIndex].loading === 'noMore') return
				console.log('触发上拉', this.load[this.activeIndex].page)
				this.load[this.activeIndex].page++
				this.getList(this.activeIndex)
			}
		}
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;

			.list-scroll {
				height: 100%;
			}
		}
	}
</style>
