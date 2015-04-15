var Vue = require('vue')
var pluralize = require('pluralize')

new Vue({
	el: document.body,
	template: require('./container.html'),
	components: {
		nav: require('./components/nav')
	},
	filters: {
		plural: function (value) {
			return pluralize(value)
		}
	},
	data: function () {
		return {
			view: null
		}
	}
})
