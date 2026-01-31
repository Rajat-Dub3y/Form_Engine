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
    { id: "name", type: "text", label: "Full Name", validation: { required: true, minLength: 3 }, asyncValidate: async (value) => {
      await new Promise(r => setTimeout(r, 500));
      if (typeof value === 'string' && value.toLowerCase() === 'taken') return 'This name is already taken';
      return null;
    } },
    { id: "subscribe", type: "checkbox", label: "Subscribe to newsletter" },
    { id: "country", type: "select", label: "Country", loadOptions: loadCountries },
    { id: "profile", type: "group", label: "Profile", fields: [
      { id: "firstName", type: "text", label: "First Name", validation: { required: true } },
      { id: "lastName", type: "text", label: "Last Name" }
    ]},
    { id: "addresses", type: "repeater", label: "Addresses", fields: [
      { id: "street", type: "text", label: "Street" },
      { id: "city", type: "text", label: "City" },
      { id: "primary", type: "checkbox", label: "Primary" }
    ]}
  ]
};