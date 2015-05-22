module.exports = {
	computed: {
		value: {
			get: function () {
				if (this.entry && this.field && this.field.property) {
					return this.entry[this.field.property]
				}
			},
			set: function (value) {
				if (this.entry && this.field && this.field.property) {
					this.entry.$set(this.field.property, value)
				}
			}
		}
	}
}
