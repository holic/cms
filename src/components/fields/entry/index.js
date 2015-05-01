var Firebase = require('firebase')

var valueToProperty = require('../valueToProperty')
var models = require('../../../models')
var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	mixins: [valueToProperty],
	template: require('./entry.html'),
	data: function () {
		return {
			options: null
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
