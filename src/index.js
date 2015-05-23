var Vue = require('vue')
var Router = require('vue-router')
var pluralize = require('pluralize')

var models = require('./models')


Vue.use(Router)


var app = new Vue({
	template: require('./container.html'),
	components: {
		nav: require('./components/nav'),
		'view-entries': require('./views/entries'),
		'view-entry': require('./views/entry')
	},
	filters: {
		plural: function (value) {
			return pluralize(value)
		}
	},
	data: function () {
		return {
			view: null,
			activeModel: null,
			model: null,
			activeEntry: null,
			entry: null
		}
	},
	computed: {
		models: function () {
			return models
		}
	}
})


var router = new Router({ hashbang: false })

router.map({
	'/:model': {
		component: 'view-entries'
	},
	'/:model/:id': {
		component: 'view-entry'
	}
})

router.redirect({
	'/': '/' + models[Object.keys(models)[0]].property
})

// router.on('/', function () {
// 	for (var k in models) {
// 		location.replace('#/' + models[k].property)
// 		return
// 	}
// })

// router.on('/:type', function (type) {
// 	app.view = 'entriesView'
// 	app.model = models[type]
// 	app.activeModel = app.model ? type : null
// })

// router.on('/:type/:id', function (type, id) {
// 	app.view = 'entryView'
// 	app.model = models[type]
// 	app.activeModel = app.model ? type : null
// 	app.activeEntry = id
// })

// router.configure({
// 	notfound: function () {
// 		console.log('No route found for path:', this.path)
// 	}
// })

router.start(app)
app.$mount(document.body)
