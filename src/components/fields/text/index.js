module.exports = {
	inherit: true,
	replace: true,
	template: require('./text.html'),
	computed: {
		// TODO: setter
		value: function () {
			return this.entry
				? this.entry[this.property]
				: null
		}
	}
}
