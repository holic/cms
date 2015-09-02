var Firebase = require('firebase')

var field = require('../field')
var valueToProperty = require('../valueToProperty')
var models = require('../../../models')
var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	mixins: [field, valueToProperty],
	template: require('./entry.html'),
	data: function () {
		return {
			options: null
		}
	},
	compiled: function () {
		var model = models[this.field.model]

		dataRef.child(model.property).once('value', function (snapshot) {
			var options = [{
				text: '',
				value: null,
				disabled: this.field.required
			}]
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
