var Firebase = require('firebase')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

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
		},
		loadEntry: function (id) {
			this.entry = null
			if (id === 'new') return

			dataRef.child(this.activeModel).child(id).once('value', function (snapshot) {
				this.entry = snapshot.val()
			}.bind(this))
		}
	},
	data: function () {
		return {
			entry: null
		}
	},
	computed: {
		isNew: function () {
			return this.activeEntry === 'new'
		},
		isReady: function () {
			return this.entry || this.isNew
		}
	},
	created: function () {
		if (this.activeEntry) {
			this.loadEntry(this.activeEntry)
		}
	},
	watch: {
		activeEntry: function (id) {
			this.loadEntry(id)
		}
	}
}
