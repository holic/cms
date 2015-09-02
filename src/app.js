var pluralize = require('pluralize')

module.exports = {
	template: require('./app.html'),
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
			view: null,
			activeModel: null,
			model: null,
			activeEntry: null,
			entry: null
		}
	}
}
