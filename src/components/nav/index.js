var models = require('../../models')

module.exports = {
	template: require('./nav.html'),
	methods: {
		isActive: function (property) {
			return property === this.$route.params.model
		}
	},
	computed: {
		models: function () {
			return models
		}
	}
}
