var m = require('mithril')
var pluralize = require('pluralize')


var controller = function () {
	vm.init()
}


var vm = {
	entries: m.prop([]),
	remove: function (i, event) {
		event.preventDefault()
		vm.entries().splice(i, 1)
	},
	init: function () {
		var Post = require('./models/post')

		var TextField = require('./fields/text')
		var MarkdownField = require('./fields/markdown')

		this.label = Post.label
		this.fields = Post.fields.map(function (field) {
			switch (field.type) {
				case 'markdown':
					return new MarkdownField(field)
				default:
					return new TextField(field)
			}
		})

		this.entries(require('./fixtures/posts'))
	}
}


var view = function () {
	if (vm.entries().length === 0) {
		return null
	}

	var listedFields = vm.fields.filter(function (field) {
		return field.config.listed
	})

	return
		m('table.table.table-hover', [
			m('thead', [
				m('tr', [
					listedFields.map(function (field) {
						return m('th', field.config.label)
					}),
					m('th[colspan="2"]')
				])
			]),
			m('tbody', [
				vm.entries().map(function (entry, i) {
					return m('tr', [
						listedFields.map(function (field) {
							return m('td', entry[field.config.property])
						}),
						m('td', [
							m('a', { href: '/' + m.route.param('type') + '/' + entry.id, config: m.route }, [
								m('i.glyphicon.glyphicon-edit')
							])
						]),
						m('td', [
							m('a[href="#"]', { onclick: vm.remove.bind(this, i) }, [
								m('i.glyphicon.glyphicon-trash')
							])
						])
					])
				})
			])
		])
}


module.exports = {
	controller: controller,
	vm: vm,
	view: view
}
