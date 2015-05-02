var valueToProperty = require('../valueToProperty')

module.exports = {
	mixins: [valueToProperty],
	template: require('./image.html'),
	data: function () {
		return {
			uploading: false
		}
	},
	computed: {
		thumbnail: function () {
			return this.value + '-/resize/300/'
		}
	},
	methods: {
		upload: function (event) {
			event.preventDefault()

			var vm = this

			uploadcare.openDialog(null, {
				crop: 'disabled',
				imagesOnly: true
			})
			.done(function (file) {
				console.log('Uploading file:', file)
				vm.uploading = true

				file.promise()
				.always(function () {
					vm.uploading = false
				})
				.done(function (fileInfo) {
					console.log('Uploaded file data:', fileInfo)
					vm.value = fileInfo.originalUrl
				})
			})
		},
		remove: function (event) {
			event.preventDefault()
			this.value = null
		}
	}
}
