var field = require('../field')
var valueToProperty = require('../valueToProperty')

module.exports = {
	mixins: [field, valueToProperty],
	template: require('./markdown.html')
}
