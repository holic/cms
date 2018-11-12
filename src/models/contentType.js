export default {
  label: "content type",
  property: "content_types",
  type: "collection",
  fields: [
    {
      label: "property",
      property: "property",
      description:
        "Lowercase, plural slug using underscores, e.g. `content_types`",
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
    // TODO: move this to a group of fields
    {
      label: "fields configuration",
      property: "config",
      type: "json",
      required: true
    },
    {
      label: "fields configuration",
      property: "config",
      type: "group",
      types: [
        {
          label: "field",
          name: "field",
          type: "contentFieldSettings"
        }
      ],
      migrate: value => {
        try {
          const items = JSON.parse(value);
          return items.map(item => ({
            type: "contentFieldSettings",
            value: item
          }));
        } catch (e) {}

        return value;
      }
    },
    {
      label: "field",
      property: "__field",
      type: "contentFieldSettings"
    }
    // TODO: add sort field
  ]
};
