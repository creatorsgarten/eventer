// dummy home.test.tsx

import { render, screen } from "@testing-library/react";
import React from "react";
import HomePage from "./page";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";

describe("HomePage", () => {
	it("renders the home page", () => {
		render(<HomePage />);

		expect(screen.getByText("Eventer")).toBeInTheDocument();
	});
});
