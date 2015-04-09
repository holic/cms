var m = require('mithril')
var pluralize = require('pluralize')

var models = require('./models')


function controller (module) {
	this.controller = new module.controller
	this.view = module.view
}

function view (controller) {
	return
		m('.container', [
			m('.row', [
				m('.col-sm-2', [
					m('input.form-control', { placeholder: 'Find content...' }),
					m('hr'),
					m('.list-group', [
						models.map(function (model) {
							return m('a.list-group-item', { href: '/' + model.property, config: m.route }, pluralize(model.label))
						})
					])
				]),
				m('.col-sm-10', [
					controller.view(controller.controller)
				])
			])
		])
}



module.exports = function (module) {
	return {
		controller: function () {
			return new controller(module)
		},
		view: view
	}
}
