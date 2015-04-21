module.exports = {
	inherit: true,
	replace: true,
	template: require('./markdown.html'),
	computed: {
		value: {
			get: function () {
				if (this.entry) {
					return this.entry[this.property]
				}
			},
			set: function (value) {
				if (this.entry) {
					this.entry[this.property] = value
				}
			}
		}
	}
}
