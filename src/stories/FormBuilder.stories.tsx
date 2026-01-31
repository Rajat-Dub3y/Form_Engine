import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormBuilder } from "../form_engine/FormBuilder";
import { demoSchema } from "./demoSchema";
import type { FormSchema } from "../form_engine/types";


const meta: Meta<typeof FormBuilder> = {
  title: "Form Engine/FormBuilder",
  component: FormBuilder,
  parameters: {
    layout: "centered",
    a11y: { disable: false },
    docs: {
      description: {
        component:
          "FormBuilder dynamically renders forms using JSON schema with validation, accessibility, and conditional rendering support.",
      },
    },
  },
  decorators: [
    (Story) => {
      localStorage.clear();
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof FormBuilder>;

export const Default: Story = {
  args: {
    schema: demoSchema,
  },
};

export const ValidationErrors: Story = {
  args: {
    schema: demoSchema,
  },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll("input");
    if (inputs.length > 0) {
      const first = inputs[0];
      first?.focus();
      first?.blur();
    }
  },
};

export const AsyncValidation: Story = {
  args: {
    schema: demoSchema,
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector(
      'input[id="name"]'
    ) as HTMLInputElement | null;

    if (input) {
      input.focus();
      input.value = "taken";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.blur();
      await new Promise((r) => setTimeout(r, 600));
    }
  },
};


const conditionalSchema: FormSchema = {
  ...demoSchema,
  id: "conditional-hidden-test",
};

export const ConditionalFieldHidden: Story = {
  args: {
    schema: conditionalSchema,
  },
};

export const KeyboardOnly: Story = {
  args: {
    schema: demoSchema,
  },
  play: async () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
  },
};

const edgeCaseSchema: FormSchema = {
  id: "edge-cases",
  fields: [
    { id: "longText", type: "text", label: "Very long text" },
    {
      id: "manyAddresses",
      type: "repeater",
      label: "Many Addresses",
      fields: [{ id: "street", type: "text", label: "Street" }],
    },
  ],
};

export const EdgeCases: Story = {
  args: { schema: edgeCaseSchema },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector(
      'input[id="longText"]'
    ) as HTMLInputElement | null;

    if (input) {
      input.focus();
      input.value = "A".repeat(5000);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.blur();
    }

    const add = Array.from(
      canvasElement.querySelectorAll("button")
    ).find((b) => b.textContent === "Add") as HTMLButtonElement | undefined;

    if (add) {
      for (let i = 0; i < 10; i++) add.click();
    }
  },
};

const failureSchema: FormSchema = {
  id: "failure-states",
  fields: [
    {
      id: "must",
      type: "text",
      label: "Must fill",
      validation: { required: true },
    },
    {
      id: "badSelect",
      type: "select",
      label: "Bad Select",
      loadOptions: async () => {
        throw new Error("nope");
      },
    },
  ],
};

export const FailureStates: Story = {
  args: { schema: failureSchema },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector(
      'input[id="must"]'
    ) as HTMLInputElement | null;

    if (input) {
      input.focus();
      input.blur();
    }

    await new Promise((r) => setTimeout(r, 200));
  },
};

const loadingSchema: FormSchema = {
  id: "loading-state",
  fields: [
    {
      id: "slow",
      type: "select",
      label: "Slow Select",
      loadOptions: async () => {
        await new Promise((r) => setTimeout(r, 2000));
        return [{ label: "One", value: "1" }];
      },
    },
  ],
};

export const LoadingState: Story = {
  args: { schema: loadingSchema },
  play: async () => {
    await new Promise((r) => setTimeout(r, 200));
  },
};

export const HighContrast: Story = {
  args: { schema: demoSchema },
  play: async ({ canvasElement }) => {
    const origBg = canvasElement.style.backgroundColor;
    const origColor = canvasElement.style.color;

    canvasElement.style.backgroundColor = "#000";
    canvasElement.style.color = "#fff";

    const labels = Array.from(canvasElement.querySelectorAll("label"));
    labels.forEach((l) => ((l as HTMLElement).style.fontWeight = "700"));

    setTimeout(() => {
      canvasElement.style.backgroundColor = origBg;
      canvasElement.style.color = origColor;
      labels.forEach((l) => ((l as HTMLElement).style.fontWeight = ""));
    }, 2500);
  },
};
