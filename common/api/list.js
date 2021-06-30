import $http from '../http.js'
export const get_label = (data) => {
	return $http({
		url: 'get_label',
		data
	})
}
