var valueToProperty = require('../valueToProperty')

module.exports = {
	mixins: [valueToProperty],
	template: require('./image.html'),
	computed: {
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
