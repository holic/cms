var fixtures = require('../../fixtures')

module.exports = {
	inherit: true,
	template: require('./entries.html'),
	methods: {
		activateModel: function (active) {
			var activeModel
			this.models.forEach(function (model) {
				if (model.property === active) {
					activeModel = model
				}
			})

			this.model = activeModel
			this.entries = fixtures[active]
		},
		edit: function (event, id) {
			event.preventDefault()
			if (id) {
				location.assign('#/' + this.activeModel + '/' + id)
			}
		}
	},
	data: function () {
		return {
			model: null,
			entries: null
		}
	},
	created: function () {
		if (this.activeModel) {
			this.activateModel(this.activeModel)
		}
	},
	watch: {
		activeModel: function (model) {
			this.activateModel(model)
		}
	}
}
