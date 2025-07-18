import Image from "next/image";

export const TestimonialSection = () => {
	// Example logos, replace with your own logo paths
	const logos = [
		"/cuslogo/creatorsgarten.svg",
		"/cuslogo/cuee.png",
		"/cuslogo/ioic_black.png",
		"/cuslogo/thinc.png",
	];

	// Duplicate logos for seamless infinite scroll effect
	const scrollingLogos = [...logos, ...logos];

	return (
		<section className="w-full py-14 mx-auto mb-8 overflow-hidden">
			<h2 className="text-4xl font-bold text-gray-900 text-center mb-10 tracking-tight">
				พันธมิตรของเรา
			</h2>
			<div className="w-screen overflow-hidden relative -ml-[50vw] -mr-[50vw] left-1/2 right-1/2">
				<div className="flex items-center gap-12 animate-scroll will-change-transform">
					{scrollingLogos.map((logo, idx) => (
						<div
							className="flex-shrink-0 flex items-center justify-center min-w-[200px] min-h-[200px] opacity-100 transition-opacity duration-200 hover:opacity-100"
							key={idx}
						>
							<Image
								src={logo}
								alt={`Company logo ${(idx % logos.length) + 1}`}
								width={120}
								height={60}
								className="max-w-[200px] max-h-[200px] w-auto h-[120px] object-contain hover:filter-none"
								draggable={false}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
