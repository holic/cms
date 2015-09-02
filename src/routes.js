var models = require('./models')

module.exports = function (router) {

	router.map({
		'/:model': {
			component: require('./views/entries')
		},
		'/:model/:id': {
			component: require('./views/entry')
		}
	})

	router.redirect({
		'/': '/' + models[Object.keys(models)[0]].property
	})

}