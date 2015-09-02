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

	router.afterEach(function (transition) {
		// help hash-based navigation get back to the top of the page
		window.scrollTo(0, 0)
	})

}
