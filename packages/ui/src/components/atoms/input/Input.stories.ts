import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
	title: "Atoms/Input",
	component: Input,
	tags: ["autodocs"],
	argTypes: {
		className: { control: "text" },
		type: { control: "text" },
	},
};

type Story = StoryObj<typeof Input>;

export const Default: Story = {
	args: {
		type: "text",
		className: "",
		placeholder: "Enter text here",
	},
};

export default meta;
