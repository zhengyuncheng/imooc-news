<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height: statusBarHeight + 'px'}"></view>
			<!-- 导航栏内容 -->
			<view class="navbar-content" :class="{search: isSearch}" :style="{height: navBarHeight + 'px', width: windowWith + 'px'}" @click.stop='openSearch'>
				<view class="navbar-content_search-icons" >
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>
				<view v-if="!isSearch" class="navbar-search">
					<!-- 不在搜索页显示 -->
					<view class="navbar-search_icon">
						<!-- <text class="iconfont icon-search"></text> -->
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-search_text">
						uni-app.
					</view>
				</view>
				<view v-if="isSearch" class="navbar-search">
					<!-- 搜索页显示 -->
					<input type="text" v-model="value" @input='inputChange' placeholder="请输入您要输入的内容..."/>
				</view>
			</view>
		</view>
		<!-- 占位标签 -->
		<view :style="{height: navBarHeight + statusBarHeight + 'px'}"></view>
	</view>
</template>

<script>
	export default {
		name: "navbar",
		props: {
			isSearch: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 45,
				windowWith: 375,
				value: ''
			};
		},
		created() {
			// 获取手机系统信息
			const info = uni.getSystemInfoSync()
			// 设置状态栏高度
			this.statusBarHeight = info.statusBarHeight
			this.windowWith = info.windowWidth
			// console.log(info)
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			// 获取胶囊的位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			// console.log((menuButtonInfo))
			// (胶囊底部高度 - 状态栏的高度) + （胶囊顶部高度 - 状态栏内的高度) = 导航栏的高度
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight)
			this.windowWith = menuButtonInfo.left
			// #endif
		},
		methods: {
			openSearch(){
				if (this.isSearch) return
				uni.navigateTo({
					url: '/pages/home-search/home-search'
				})
			},
			inputChange(e) {
				const { value } = e.detail
				this.$emit('input', value)
			}
		}
	}
</script>

<style lang="scss">
	@import '../../common/css/icons.css';

	.navbar {
		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: $mk-base-color;

			.navbar-content {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 15px;
				height: 45px;
				box-sizing: border-box;
				&.search {
					padding-left: 0;
					.navbar-content_search-icons {
						margin-left: 10px;
						margin-right: 10px;
					}
					.navbar-search {
						border-radius: 5px;
						input {
							font-size: 14px;
							color: #999;
						}
					}
				}
				.navbar-search {
					display: flex;
					align-items: center;
					padding: 0 10px;
					width: 100%;
					height: 30px;
					border-radius: 30px;
					background-color: #fff;

					.navbar-search_icon {
						margin-right: 10px;
					}

					.navbar-search_text {
						width: 100%;
						font-size: 14px;
						color: #999;
					}
				}

				&.search {
					padding-left: 0;

					.navbar-content__search-icons {
						margin-left: 10px;
						margin-right: 10px;
					}

					.navbar-search {
						border-radius: 5px;
					}
				}
			}
		}
	}
</style>
