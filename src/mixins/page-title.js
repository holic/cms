module.exports = {
	watch: {
		title: {
			immediate: true,
			handler: function (title) {
				if (title) {
					document.title = title + ' – CMS'
				}
			}
		}
	}
}
