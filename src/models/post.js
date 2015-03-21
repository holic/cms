module.exports = {
	label: 'Blog post',
	property: 'posts',
	type: 'collection',
	fields: [
		{
			label: 'Title',
			property: 'title',
			type: 'text',
			required: true
		},
		{
			label: 'Summary',
			property: 'summary',
			type: 'text',
			required: true
		},
		{
			label: 'Post body',
			property: 'body',
			type: 'markdown',
			required: true
		}
	]
}
