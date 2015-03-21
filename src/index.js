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
	},
	edit: function (i, event) {
		event.preventDefault()
		alert('Not yet implemented.')
	},
	remove: function (i, event) {
		event.preventDefault()
		app.vm.posts().splice(i, 1)
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

	var listedFields = app.vm.fields.filter(function (field) {
		return field.config.listed
	})

	return m('.container', [
		m('div.page-header', [
			m('h1', vm.label + 's')
		]),
		(app.vm.posts().length ? m('table.table.table-striped.table-hover', [
			m('thead', [
				m('tr', [
					listedFields.map(function (field) {
						return m('th', field.config.label)
					}),
					m('th[colspan="2"]')
				])
			]),
			m('tbody', [
				app.vm.posts().map(function (post, i) {
					return m('tr', [
						listedFields.map(function (field) {
							return m('td', post[field.config.property])
						}),
						m('td', [
							m('a[href="#"]', { onclick: app.vm.edit.bind(this, i) }, [
								m('i.glyphicon.glyphicon-edit')
							])
						]),
						m('td', [
							m('a[href="#"]', { onclick: app.vm.remove.bind(this, i) }, [
								m('i.glyphicon.glyphicon-trash')
							])
						])
					])
				})
			])
		]) : null),
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
