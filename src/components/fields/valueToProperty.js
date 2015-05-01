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
					// We use $add/$delete here because once a property has been observed,
					// Vue cannot detect newly added/deleted properties.
					if (value == null) {
						this.entry.$delete(this.property)
					}
					else {
						this.entry.$add(this.property, value)
					}
				}
			}
		}
	}
}
