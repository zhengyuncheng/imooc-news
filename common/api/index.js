
// import { get_label } from './list.js'
// export default {
// 	get_label
// }

// 批量导出文件
const requireApi = require.context(
	// api 目录的相对路径
	'.',
	// 是否查询子目录
	false,
	// 查询文件的一个后缀
	/.js$/
)
// console.log('requireApi.keys()', requireApi.keys())
let module = {}
requireApi.keys().forEach((key,index) => {
	if (key === './index.js') return
	// console.log('key', key)
	// console.log('requireApi(key)', requireApi(key))
	Object.assign(module, requireApi(key))
})
// console.log(module)
export default module