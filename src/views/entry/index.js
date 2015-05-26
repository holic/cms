var Firebase = require('firebase')
var models = require('../../models')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	inherit: true,
	template: require('./entry.html'),
	components: {
		textField: require('../../components/fields/text'),
		markdownField: require('../../components/fields/markdown'),
		entryField: require('../../components/fields/entry'),
		imageField: require('../../components/fields/image')
	},
	methods: {
		loadEntry: function () {
			var vm = this

			function set (entry) {
				vm.$set('entry', entry)
				var unwatch = vm.$watch('entry', function () {
					vm.$set('hasChanged', true)
					unwatch()
				}, true)
			}

			if (vm.isNew) {
				set({})
				return
			}

			vm.entry = null
			vm.entryRef.once('value', function (snapshot) {
				set(snapshot.val())
			})
		},
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
		save: function (event) {
			event.preventDefault()

			var vm = this

			var done = (function (err) {
				if (err) {
					console.error('Could not save:', err)
				}
				else {
					vm.$set('hasChanged', false)
					location.assign('#/' + vm.model.property)
				}
			})

			// skip save when nothing has changed
			if (!vm.hasChanged) return done()

			if (vm.isNew) {
				vm.entriesRef.push(vm.entry, done)
			}
			else {
				vm.entryRef.update(vm.entry, done)
			}
		},
		remove: function (event) {
			event.preventDefault()

			// TODO: add undo
			if (!window.confirm('This cannot be undone. Continue?')) {
				return
			}

			this.entryRef.remove(function (err) {
				if (err) {
					console.error('Could not remove:', err)
				}
				else {
					location.assign('#/' + this.model.property)
				}
			}.bind(this))
		}
	},
	computed: {
		path: function () {
			return this.route.params.model + '/' + this.route.params.id
		},
		model: function () {
			return models[this.route.params.model]
		},
		id: function () {
			return this.route.params.id
		},
		entriesRef: function () {
			return dataRef.child(this.model.property)
		},
		entryRef: function () {
			return this.entriesRef.child(this.id)
		},
		isNew: function () {
			return this.id === 'new'
		}
	},
	created: function () {
		this.$watch('path', this.loadEntry, false, true)
	},
	attached: function () {
		var vm = this
		// TODO: make this work for back button (push state)
		window.addEventListener('beforeunload', function (event) {
			if (vm.hasChanged) {
				var confirm = 'You have unsaved changes.\nLeaving this page will discard these changes.'

				return (event || window.event).returnValue = confirm
			}
		}, false)
	}
}
