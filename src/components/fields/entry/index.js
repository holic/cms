var Firebase = require('firebase')

var models = require('../../../models')
var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	inherit: true,
	replace: true,
	template: require('./entry.html'),
	data: function () {
		return {
			options: null
		}
	},
	computed: {
		value: {
			get: function () {
				if (this.entry && this.property) {
					return this.entry[this.property]
				}
			},
			set: function (value) {
				if (this.entry && this.property) {
					// One caveat here is that once the observation has been initiated,
					// Vue.js will not be able to detect newly added or deleted properties.
					// To get around that, observed objects are augmented with $add and $delete methods.
					this.entry.$add(this.property, value)
				}
			}
		}
	},
	created: function () {
		var model = models[this.model]

		dataRef.child(model.property).once('value', function (snapshot) {
			// TODO: figure out better "unselected" option
			//       ideally allow the disabled attribute in here
			var options = [{ text: '', value: null }]
			snapshot.forEach(function (child) {
				options.push({
					value: child.ref().toString(),
					// TODO: make this property configurable
					text: child.val().name
				})
			})
			this.options = options
		}.bind(this))
	}
}
