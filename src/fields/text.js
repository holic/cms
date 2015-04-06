var m = require('mithril')

module.exports = function (config) {
	var vm = {
		value: m.prop(''),
		clear: function () {
			vm.value('')
		},
		toJSON: function () {
			return vm.value()
		},
		populate: function (data) {
			vm.value(data)
		}
	}
	var view = function () {
		return [
			m('div.form-group', [
				m('label.control-label.col-sm-2', config.label),
				m('div.col-sm-4', [
					m('input.form-control', { type: config.type, value: vm.value(), oninput: m.withAttr('value', vm.value), required: config.required })
				])
			])
		]
	}
	return { vm: vm, view: view, config: config, toJSON: vm.toJSON }
}
