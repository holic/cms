module.exports = {
	inherit: true,
	template: require('./entries.html'),
	data: function () {
		var active = this.activeModel
		var activeModel
		this.models.forEach(function (model) {
			if (model.property === active) {
				activeModel = model
			}
		})
		return {
			model: activeModel,
			entries: require('../../fixtures/posts.json')
		}
	}
}
