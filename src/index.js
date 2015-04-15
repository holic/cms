var Vue = require('vue')
var pluralize = require('pluralize')

new Vue({
	el: document.body,
	template: require('./container.html'),
	components: {
		nav: require('./components/nav'),
		entries: require('./components/entries')
	},
	filters: {
		plural: function (value) {
			return pluralize(value)
		}
	},
	data: function () {
		var models = require('./models')

		return {
			view: 'entries',
			models: models,
			activeModel: models[0].property
		}
	}
})
