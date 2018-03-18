export default {
  label: "content type",
  property: "content_types",
  type: "collection",
  fields: [
    {
      label: "property",
      property: "property",
      description: "Lowercase, plural slug using underscores, e.g. `content_types`",
      type: "text",
      required: true,
      listed: true
    },
    {
      label: "label",
      property: "label",
      description: "Lowercase, singular English label, e.g. `content type`",
      type: "text",
      required: true,
      listed: true
    },
    {
      label: "type",
      property: "type",
      type: "options",
      options: [
        {
          label: "collection",
          value: "collection"
        }
      ],
      required: true,
      listed: true
    },
    {
      label: "fields configuration",
      property: "config",
      type: "json",
      required: true
    }
  ]
};
