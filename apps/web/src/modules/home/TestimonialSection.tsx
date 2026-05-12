import Image from "next/image";

export const TestimonialSection = () => {
	// Example logos, replace with your own logo paths
	const logos = [
		"/cuslogo/creatorsgarten.svg",
		"/cuslogo/cuee.png",
		"/cuslogo/ioic_black.png",
		"/cuslogo/thinc.png",
	];

	// Repeat enough times so the strip always exceeds the viewport width on any screen
	const scrollingLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

	return (
		<section className="w-full py-10 mx-auto mb-8 overflow-hidden px-4 sm:py-14">
			<h2 className="text-2xl font-bold text-gray-900 text-center mb-8 tracking-tight sm:text-4xl sm:mb-10">
				พันธมิตรของเรา
			</h2>
			<div
				className="w-screen overflow-hidden relative -ml-[50vw] -mr-[50vw] left-1/2 right-1/2"
				style={{
					maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
					WebkitMaskImage:
						"linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
				}}
			>
				<div className="flex items-center gap-6 animate-scroll will-change-transform sm:gap-12">
					{scrollingLogos.map((logo, idx) => (
						<div
							className="flex-shrink-0 flex items-center justify-center min-w-[100px] min-h-[100px] sm:min-w-[160px] sm:min-h-[160px]"
							key={idx}
						>
							<Image
								src={logo}
								alt={`Company logo ${(idx % logos.length) + 1}`}
								width={120}
								height={60}
								className="w-auto h-[60px] sm:h-[100px] max-w-[100px] sm:max-w-[160px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
								draggable={false}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
