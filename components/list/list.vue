<template>
	<swiper class="home-swiper">
		<swiper-item class="swiper-item" v-for="(item, index) in tab" :key="index">
			<list-item></list-item>
		</swiper-item>
	</swiper>
</template>

<script>
	import listItem from './list-item.vue'
	export default {
		name:"list",
		props: {
			tab: {
				type: Array,
				default() {
					return []
				}
			}
		},
		components:{
			listItem
		},
		data() {
			return {
				
			};
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
