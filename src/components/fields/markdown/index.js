module.exports = {
	inherit: true,
	template: require('./markdown.html'),
	computed: {
		// TODO: setter
		value: function () {
			return this.entry[this.property]
		}
	}
}
