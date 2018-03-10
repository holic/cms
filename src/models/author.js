export default {
  label: "author",
  property: "authors",
  type: "collection",
  fields: [
    {
      label: "name",
      property: "name",
      type: "text",
      required: true,
      listed: true
    },
    {
      label: "Twitter",
      property: "twitter",
      type: "text",
      required: true,
      listed: true
    }
  ]
};
