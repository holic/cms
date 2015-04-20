module.exports = {
	inherit: true,
	template: require('./text.html'),
	computed: {
		// TODO: setter
		value: function () {
			return this.entry[this.property]
		}
	}
}
