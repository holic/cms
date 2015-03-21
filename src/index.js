var m = require('mithril')


var app = {}
app.controller = function () {
	app.vm.init()
}

app.vm = {
	save: function (event) {
		event.preventDefault()
		console.log(app.vm.toJSON())
	},
	toJSON: function () {
		var data = {}
		app.vm.fields.forEach(function (field) {
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
	}
}

app.view = function () {
	var vm = app.vm
	return m('.container', [
		m('form.form-horizontal', { onsubmit: app.vm.save }, [
			m('fieldset', [
				m('legend', vm.label),
				vm.fields.map(function (field) {
					return field && field.view && field.view()
				}),
				m('div.form-group', [
					m('div.col-sm-offset-2.col-sm-10', [
						m('button.btn.btn-success', { type: 'submit' }, 'Save')
					])
				])
			])
		])
	])
}


m.module(document.body, app)
