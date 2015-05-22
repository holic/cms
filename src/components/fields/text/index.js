var field = require('../field')
var valueToProperty = require('../valueToProperty')

module.exports = {
	mixins: [field, valueToProperty],
	template: require('./text.html'),
	computed: {
		inputType: function () {
			switch (this.field.type) {
				case 'text':
				case 'email':
					return this.field.type
			}
			return 'text'
		}
	}
}
