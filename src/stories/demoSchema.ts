import type { FormSchema } from "../form_engine/types";

const loadCountries = async () => {
  await new Promise(r => setTimeout(r, 800));
  return [
    { label: "India", value: "IN" },
    { label: "United States", value: "US" },
    { label: "Germany", value: "DE" }
  ];
};

export const demoSchema: FormSchema = {
  id: "storybook-demo-form",
  fields: [
    {
      id: "name",
      type: "text",
      label: "Full Name",
      validation: { required: true, minLength: 3 }
    },
    {
      id: "subscribe",
      type: "checkbox",
      label: "Subscribe to newsletter"
    },
    {
      id: "country",
      type: "select",
      label: "Country",
      loadOptions: loadCountries // ✅ stable reference
    }
  ]
};