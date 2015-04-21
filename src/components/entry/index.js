var Firebase = require('firebase')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

function isEmpty (o) {
	for (var p in o) {
		if (o.hasOwnProperty(p)) {
			return false
		}
	}
	return true
}

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
			this.entry = {}
			if (id === 'new') return

			dataRef.child(this.activeModel).child(id).once('value', function (snapshot) {
				this.entry = snapshot.val()
			}.bind(this))
		},
		save: function (event) {
			event.preventDefault()

			var done = (function (err) {
				if (err) {
					console.error('Could not save:', err)
				}
				else {
					location.assign('#/' + this.activeModel)
				}
			}).bind(this)

			var ref = dataRef.child(this.activeModel)
			if (this.isNew) {
				ref.push(this.entry, done)
			}
			else {
				ref.child(this.activeEntry).update(this.entry, done)
			}
		},
		remove: function (event) {
			event.preventDefault()

			// TODO: add undo
			if (!window.confirm('This cannot be undone. Continue?')) {
				return
			}

			dataRef.child(this.activeModel).child(this.activeEntry).remove(function (err) {
				if (err) {
					console.error('Could not remove:', err)
				}
				else {
					location.assign('#/' + this.activeModel)
				}
			}.bind(this))
		}
	},
	data: function () {
		return {
			entry: {}
		}
	},
	computed: {
		isNew: function () {
			return this.activeEntry === 'new'
		},
		isReady: function () {
			return !isEmpty(this.entry) || this.isNew
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
