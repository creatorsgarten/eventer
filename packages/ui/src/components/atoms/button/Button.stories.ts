import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
	title: "Atoms/Button",
	component: Button,
	tags: ["autodocs"],
	argTypes: {
		className: { control: "text" },
		appName: { control: "text" },
	},
};

type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		appName: "Eventer",
		className: "bg-blue-500 text-white px-4 py-2 rounded",
		children: "Click Me",
	},
};

export default meta;
