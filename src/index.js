var Vue = require('vue')
var director = require('director')
var pluralize = require('pluralize')

var fixtures = require('./fixtures')


var app = new Vue({
	el: document.body,
	template: require('./container.html'),
	components: {
		nav: require('./components/nav'),
		entries: require('./components/entries'),
		entry: require('./components/entry')
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
			activeModel: null,
			model: null,
			activeEntry: null,
			entry: null
		}
	}
})


var router = new director.Router()

router.on('/', function () {
	location.replace('#/' + app.models[0].property)
})

router.on('/:type', function (type) {
	app.view = 'entries'
	app.activeModel = null

	app.models.forEach(function (model) {
		if (type === model.property) {
			app.activeModel = type
			app.model = model
		}
	})
})

router.on('/:type/:id', function (type, id) {
	app.view = 'entry'
	app.activeModel = null
	app.activeEntry = null

	app.models.forEach(function (model) {
		if (type === model.property) {
			app.activeModel = type
			app.model = model
		}
	})

	fixtures[type] && fixtures[type].forEach(function (entry) {
		if (id === entry.id) {
			app.activeEntry = id
			app.entry = entry
		}
	})
})

router.configure({
	notfound: function () {
		console.log('No route found for path:', this.path)
	}
})

router.init('/')
