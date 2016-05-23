export default {
  label: 'page',
  property: 'pages',
  type: 'collection',
  fields: [
    {
      label: 'page title',
      property: 'title',
      type: 'text',
      required: true,
      listed: true
    },
    {
      label: 'page content',
      property: 'body',
      type: 'group',
      required: true,
      types: [{
        label: 'text block',
        name: 'text',
        type: 'markdown'
      }, {
        label: 'left-aligned image',
        name: 'left_image',
        type: 'image'
      }, {
        label: 'right-aligned image',
        name: 'right_image',
        type: 'image'
      }, {
        label: 'centered image',
        name: 'center_image',
        type: 'image'
      }]
    }
  ]
}
