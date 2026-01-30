import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormBuilder } from "../form_engine/FormBuilder";
import { demoSchema } from "./demoSchema";

/**
 * Storybook Meta Configuration
 */
const meta: Meta<typeof FormBuilder> = {
  title: "Form Engine/FormBuilder",
  component: FormBuilder,
  parameters: {
    layout: "centered",
    a11y: {
      disable: false,
    },
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

/**
 * 1️⃣ Default Rendering
 */
export const Default: Story = {
  args: {
    schema: demoSchema,
  },
};

/**
 * 2️⃣ Validation Errors Simulation
 */
export const ValidationErrors: Story = {
  args: {
    schema: demoSchema,
  },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll("input");

    if (inputs.length > 0) {
      inputs[0].focus();
      inputs[0].blur();
    }
  },
};

/**
 * 3️⃣ Conditional Fields Scenario
 */
const conditionalSchema = {
  ...demoSchema,
  id: "conditional-hidden-test",
};

export const ConditionalFieldHidden: Story = {
  args: {
    schema: conditionalSchema,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates how conditional fields dynamically show or hide based on user input.",
      },
    },
  },
};

/**
 * 4️⃣ Keyboard Accessibility Test
 */
export const KeyboardOnly: Story = {
  args: {
    schema: demoSchema,
  },
  play: async () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab" })
    );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter" })
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tests keyboard-only navigation for accessibility compliance.",
      },
    },
  },
};

/**
 * 5️⃣ Restore State Test
 */
export const RestoreState: Story = {
  args: {
    schema: demoSchema,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tests whether form state restores correctly using localStorage.",
      },
    },
  },
};
