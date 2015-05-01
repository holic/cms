module.exports = {
	label: 'Blog post',
	property: 'posts',
	type: 'collection',
	fields: [
		{
			label: 'Author',
			property: 'author',
			type: 'entry',
			model: 'authors',
			required: true
		},
		{
			label: 'Title',
			property: 'title',
			type: 'text',
			required: true,
			listed: true
		},
		{
			label: 'Header image',
			property: 'header_image',
			type: 'image'
		},
		{
			label: 'Post body',
			property: 'body',
			type: 'markdown',
			required: true
		}
	]
}
