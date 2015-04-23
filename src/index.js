var Vue = require('vue')
var director = require('director')
var pluralize = require('pluralize')

var models = require('./models')


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
	app.model = models[type]
	app.activeModel = app.model ? type : null
})

router.on('/:type/:id', function (type, id) {
	app.view = 'entry'
	app.model = models[type]
	app.activeModel = app.model ? type : null
	app.activeEntry = id
})

router.configure({
	notfound: function () {
		console.log('No route found for path:', this.path)
	}
})

router.init('/')
