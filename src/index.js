var Vue = require('vue')
var director = require('director')
var pluralize = require('pluralize')


var app = new Vue({
	el: document.body,
	template: require('./container.html'),
	components: {
		nav: require('./components/nav'),
		entries: require('./components/entries')
	},
	filters: {
		plural: function (value) {
			return pluralize(value)
		}
	},
	data: function () {
		var models = require('./models')

		return {
			view: null,
			models: models,
			activeModel: null
		}
	}
})


var router = new director.Router()

router.on('/', function () {
	location.replace('#/' + app.models[0].property)
})

router.on('/:type', function (type) {
	var active
	app.models.forEach(function (model) {
		if (type === model.property) {
			active = type
		}
	})

	app.view = 'entries'
	app.activeModel = active
})

router.configure({
	notfound: function () {
		console.log('No route found for path:', this.path)
	}
})

router.init('/')
