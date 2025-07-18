"use client";

import {
	DemoSection,
	// EmailSection,
	FeatureSection,
	FooterSection,
	HeroSection,
	ShowcaseSection,
	TestimonialSection,
} from "@/modules/home";

export default function Home() {
	return (
		<div className="grid grid-rows-[1fr_auto] font-main items-center justify-items-center min-h-screen">
			<HeroSection />
			<FeatureSection />
			<ShowcaseSection />
			<DemoSection />
			<TestimonialSection />
			{/* <EmailSection /> */}
			<FooterSection />
		</div>
	);
}
