var m = require('mithril')

var layout = require('./layout')
var list = require('./list')
var edit = require('./edit')


m.route.mode = 'hash'

m.route(document.body, '/', {
	'/': layout(list),
	'/:type': list,
	'/:type/new': edit,
	'/:type/:id': edit
})
