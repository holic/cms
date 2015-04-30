module.exports = {
	inherit: true,
	replace: true,
	template: require('./text.html'),
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
