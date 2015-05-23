var Firebase = require('firebase')
var models = require('../../models')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	inherit: true,
	template: require('./entries.html'),
	methods: {
		edit: function (event, id) {
			event.preventDefault()
			if (id) {
				location.assign('#/' + this.model.property + '/' + id)
			}
		}
	},
	computed: {
		model: function () {
			return models[this.route.params.model]
		},
		fields: function () {
			return this.model.fields.filter(function (filter) {
				return filter.listed
			})
		},
		entriesRef: function () {
			return dataRef.child(this.model.property)
		}
	},
	created: function () {
		this.entriesRef.once('value', function (snapshot) {
			this.$set('entries', snapshot.val())
		}.bind(this))
	}
}
