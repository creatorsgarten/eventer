import { describe, expect, it } from "vitest";
import {
	DemoSection,
	EmailSection,
	FeatureSection,
	FooterSection,
	HeroSection,
	ShowcaseSection,
	TestimonialSection,
} from "@/components/home";

describe("Home Page Components", () => {
	it("renders HeroSection", () => {
		expect(HeroSection).toBeDefined();
	});

	it("renders FeatureSection", () => {
		expect(FeatureSection).toBeDefined();
	});

	it("renders ShowcaseSection", () => {
		expect(ShowcaseSection).toBeDefined();
	});

	it("renders DemoSection", () => {
		expect(DemoSection).toBeDefined();
	});

	it("renders TestimonialSection", () => {
		expect(TestimonialSection).toBeDefined();
	});

	it("renders EmailSection", () => {
		expect(EmailSection).toBeDefined();
	});

	it("renders FooterSection", () => {
		expect(FooterSection).toBeDefined();
	});
});
