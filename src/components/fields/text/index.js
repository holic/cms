var valueToProperty = require('../valueToProperty')

module.exports = {
	mixins: [valueToProperty],
	template: require('./text.html'),
	computed: {
		inputType: function () {
			switch (this.type) {
				case 'text':
				case 'email':
					return this.type
			}
			return 'text'
		}
	}
}
