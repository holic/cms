export default {
	label: 'blog post',
	property: 'posts',
	type: 'collection',
	fields: [
		{
			label: 'title',
			property: 'title',
			type: 'text',
			required: true,
			listed: true
		},
		{
			label: 'author',
			property: 'author',
			type: 'ref',
			model: 'authors',
			ref_label_property: 'name',
			required: true
		},
		{
			label: 'header image',
			property: 'header_image',
			type: 'image'
		},
		{
			label: 'post body',
			property: 'body',
			type: 'markdown',
			required: true
		}
	]
}
