module.exports = {
	props: ['models', 'model'],
	template: require('./nav.html'),
	methods: {
		isActive: function (property) {
			return property === this.model
		}
	},
	created: function () {
		this.$watch('model', function () {
			console.log(this.$root)
		})
	}
}
