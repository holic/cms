var valueToProperty = require('../valueToProperty')

module.exports = {
	mixins: [valueToProperty],
	template: require('./markdown.html')
}
