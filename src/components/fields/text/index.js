module.exports = {
	inherit: true,
	replace: true,
	template: require('./text.html'),
	computed: {
		value: {
			get: function () {
				if (this.entry && this.property) {
					return this.entry[this.property]
				}
			},
			set: function (value) {
				if (this.entry && this.property) {
					// One caveat here is that once the observation has been initiated,
					// Vue.js will not be able to detect newly added or deleted properties.
					// To get around that, observed objects are augmented with $add and $delete methods.
					this.entry.$add(this.property, value)
				}
			}
		},
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
