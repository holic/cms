module.exports = {
	inherit: true,
	replace: true,
	computed: {
		value: {
			get: function () {
				if (this.entry && this.property) {
					return this.entry[this.property]
				}
			},
			set: function (value) {
				if (this.entry && this.property) {
					this.entry.$set(this.property, value)
				}
			}
		}
	}
}
