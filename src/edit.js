var m = require('mithril')
var pluralize = require('pluralize')


var controller = function () {
	vm.init()
}


var vm = {
	entries: m.prop([]),
	active: m.prop(),
	save: function (event) {
		event.preventDefault()

		var active = vm.active()
		var data = vm.toJSON()

		if (active == null) {
			// new entry
			data.created_at = (new Date()).toISOString()
			vm.entries().push(data)
		}
		else {
			// update existing entry
			var entry = vm.entries()[active]
			Object.keys(data).forEach(function (key) {
				if (entry[key] !== data[key]) {
					entry[key] = data[key]
					entry.updated_at = (new Date()).toISOString()
				}
			})
		}

		vm.clear()
	},
	edit: function (i, event) {
		event.preventDefault()
		var data = vm.entries()[i]
		vm.fields.forEach(function (field) {
			field.vm.populate(data[field.config.property])
		})
		vm.active(i)
		m.redraw()
	},
	remove: function (i, event) {
		event.preventDefault()
		vm.entries().splice(i, 1)
	},
	clear: function () {
		vm.fields.forEach(function (field) {
			field.vm.clear()
		})
		vm.active(null)
	},
	toJSON: function () {
		var data = {}
		vm.fields.forEach(function (field) {
			data[field.config.property] = field.toJSON()
		})
		return data
	},
	init: function () {
		var Post = require('./models/post')

		var TextField = require('./fields/text')
		var MarkdownField = require('./fields/markdown')

		this.label = Post.label
		this.fields = Post.fields.map(function (field) {
			switch (field.type) {
				case 'text':
				case 'email':
					return new TextField(field)
				case 'markdown':
					return new MarkdownField(field)
			}
		})

		this.entries(require('./fixtures/posts'))
	}
}


var view = function () {
	return
		m('form.form-horizontal', { onsubmit: vm.save }, [
			m('fieldset', [
				m('legend', [
					vm.active() != null
						? m('button.btn.btn-xs.btn-danger.pull-right', { type: 'button', onclick: vm.clear }, 'Cancel')
						: null,
					vm.active() != null
						? ('Editing ' + vm.label.toLowerCase() + ' #' + (vm.active() + 1))
						: ('New ' + vm.label.toLowerCase())
				]),
				vm.fields.map(function (field) {
					return field && field.view && field.view()
				}),
				m('.form-group', [
					m('.col-sm-offset-2.col-sm-2', [
						m('button.btn.btn-success.btn-lg', { type: 'submit' }, 'Save')
					])
				])
			])
		])
}


module.exports = {
	controller: controller,
	vm: vm,
	view: view
}