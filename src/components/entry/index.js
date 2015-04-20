module.exports = {
	inherit: true,
	template: require('./entry.html'),
	components: {
		textField: require('../fields/text'),
		markdownField: require('../fields/markdown')
	},
	methods: {
		componentFor: function (type) {
			switch (type) {
				case 'markdown':
					return 'markdownField'
				default:
					return 'textField'
			}
		}
	}
}
