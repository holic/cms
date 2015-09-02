var Vue = require('vue')
var Router = require('vue-router')

Vue.use(Router)

Vue.config.debug = true


var router = new Router({
	hashbang: false
})

require('./routes')(router)


router.start(require('./app'), '#app')
