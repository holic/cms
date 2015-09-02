var Firebase = require('firebase')
var models = require('../../models')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')

module.exports = {
	template: require('./entry.html'),
	components: {
		textField: require('../../components/fields/text'),
		markdownField: require('../../components/fields/markdown'),
		refField: require('../../components/fields/ref'),
		imageField: require('../../components/fields/image')
	},
	data: function () {
		return {
			entry: null,
			hasChanged: false
		}
	},
	computed: {
		path: function () {
			return this.$route.params.model + '/' + this.$route.params.id
		},
		model: function () {
			return models[this.$route.params.model]
		},
		id: function () {
			return this.$route.params.id
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
	methods: {
		componentFor: function (type) {
			switch (type) {
				case 'text':
					return 'textField'
				case 'markdown':
					return 'markdownField'
				case 'ref':
					return 'refField'
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
					// TODO: better error handling
					console.error('Could not save:', err)
					alert('Could not save. See console for details.')
					return
				}

				vm.hasChanged = false
				vm.$route.router.go('/' + vm.model.property)
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
					// TODO: better error handling
					console.error('Could not remove:', err)
					alert('Could not remove. See console for details.')
					return
				}

				vm.hasChanged = false
				this.$route.router.go('/' + this.model.property)
			}.bind(this))
		}
	},
	watch: {
		path: {
			immediate: true,
			handler: function () {
				var vm = this

				function set (entry) {
					vm.entry = entry
					var unwatch = vm.$watch('entry', function () {
						vm.hasChanged = true
						unwatch()
					}, {
						deep: true
					})
				}

				if (vm.isNew) {
					set({})
					return
				}

				vm.entry = null
				vm.entryRef.once('value', function (snapshot) {
					set(snapshot.val())
				})
			}
		}
	},
	route: {
		// If this can't be deactivated, VueRouter uses .replace. This is generally fine
		// and leads to a good experience when navigating forward, but causes weirdness
		// when navigating backwards. Not sure how to solve this!
		canDeactivate: function () {
			if (this.hasChanged) {
				return window.confirm('You have unsaved changes.\nLeaving this page will discard these changes.')
			}
			return true
		}
	}
}
