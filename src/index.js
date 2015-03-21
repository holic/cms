var m = require('mithril')


var app = {}
app.controller = function () {
	app.vm.init()
}

app.vm = {
	posts: m.prop([]),
	save: function (event) {
		event.preventDefault()
		app.vm.posts().push(app.vm.toJSON())
		app.vm.clear()
		console.log(app.vm.posts())
	},
	clear: function () {
		app.vm.fields.forEach(function (field) {
			field.vm.clear()
		})
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
		m('div.page-header', [
			m('h1', vm.label + 's')
		]),
		m('table.table.table-striped.table-hover', [
			m('thead', [
				m('tr', [
					m('th', 'Title'),
					m('th', 'Summary')
				])
			]),
			m('tbody', [
				app.vm.posts().map(function (post) {
					return m('tr', [
						m('td', post.title),
						m('td', post.summary)
					])
				})
			])
		]),
		m('form.form-horizontal', { onsubmit: app.vm.save }, [
			m('fieldset', [
				m('legend', 'New ' + vm.label.toLowerCase()),
				vm.fields.map(function (field) {
					return field && field.view && field.view()
				}),
				m('div.form-group', [
					m('div.col-sm-offset-2.col-sm-4', [
						m('button.btn.btn-success.btn-block', { type: 'submit' }, 'Save')
					])
				])
			])
		])
	])
}


m.module(document.body, app)
