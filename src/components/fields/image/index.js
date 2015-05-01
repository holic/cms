module.exports = {
	inherit: true,
	replace: true,
	template: require('./image.html'),
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
		thumbnail: function () {
			return this.value + '-/resize/300/'
		}
	},
	methods: {
		click: function (event) {
			event.preventDefault()

			var vm = this

			uploadcare.openDialog(null, {
				crop: 'disabled',
				imagesOnly: true
			}).done(function (file) {
				console.log('file:', file)
				file.promise().done(function (fileInfo) {
					console.log('file data:', fileInfo)

					vm.value = fileInfo.originalUrl
				})
			})
		}
	}
}
