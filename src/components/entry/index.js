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
		markdownField: require('../fields/markdown'),
		entryField: require('../fields/entry'),
		imageField: require('../fields/image')
	},
	methods: {
		componentFor: function (type) {
			switch (type) {
				case 'text':
					return 'textField'
				case 'markdown':
					return 'markdownField'
				case 'entry':
					return 'entryField'
				case 'image':
					return 'imageField'
				default:
					return 'textField'
			}
		},
		loadEntry: function (id) {
			var vm = this

			vm.entry = {}
			if (id === 'new') return

			dataRef.child(vm.activeModel).child(id).once('value', function (snapshot) {
				vm.entry = snapshot.val()

				// dirty checking
				var unwatch = vm.$watch('entry', function () {
					vm.entryHasChanges = true
					unwatch()
				}, true)
			})
		},
		save: function (event) {
			event.preventDefault()

			var vm = this

			var done = (function (err) {
				if (err) {
					console.error('Could not save:', err)
				}
				else {
					vm.entryHasChanges = false
					location.assign('#/' + vm.activeModel)
				}
			})

			var ref = dataRef.child(vm.activeModel)
			if (vm.isNew) {
				ref.push(vm.entry, done)
			}
			else {
				ref.child(vm.activeEntry).update(vm.entry, done)
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
			entry: {},
			entryHasChanges: false
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
	attached: function () {
		var vm = this
		// TODO: make this work for back button (push state)
		window.addEventListener('beforeunload', function (event) {
			if (vm.entryHasChanges) {
				var confirm = 'You have unsaved changes.\nLeaving this page will discard these changes.'

				return (event || window.event).returnValue = confirm
			}
		}, false)
	},
	watch: {
		activeEntry: function (id) {
			this.loadEntry(id)
		}
	}
}
