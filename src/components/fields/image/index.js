module.exports = {
	inherit: true,
	replace: true,
	template: require('./image.html'),
	data: function () {
		return {
			image: null
		}
	},
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
		thumbnail: function () {
			return this.image + '-/resize/300/'
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

					// need to set this on the vm itself because
					// the DOM didn't want to update with the
					// computed property
					vm.image = vm.value
				})
			})
		}
	},
	ready: function () {
		this.image = this.value
	}
}
