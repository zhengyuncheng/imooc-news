 export default function $http(options) {
	 const {url, data} = options
	 const dataObj = {
		 user_id: '60dc09f65e31f500012bc1cd',
		 ...data
	 }
	 return new Promise((resolve, reject) => {
		// 调用云函数方法
		uniCloud.callFunction({
			name: url,
			data: dataObj,
			
		}).then(res => {
			if (res.result.code === 200) {
				resolve(res.result)
			} else {
				reject(res.result)
			}
		}).catch(err => {
			reject(err)
		}) 
	})
 }