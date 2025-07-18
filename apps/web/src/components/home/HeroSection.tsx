"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const HeroSection = () => {
	const [{ headerVisible, leftVisible, rightVisible }, setVisibility] = useState({
		headerVisible: false,
		leftVisible: false,
		rightVisible: false,
	});

	// Animate on mount
	useEffect(() => {
		const timings = [
			{ state: "headerVisible", delay: 200 },
			{ state: "leftVisible", delay: 400 },
			{ state: "rightVisible", delay: 600 },
		];

		timings.forEach(({ state, delay }) => {
			setTimeout(() => setVisibility((prev) => ({ ...prev, [state]: true })), delay);
		});
	}, []);

	return (
		<div className="relative overflow-hidden bg-gradient-to-r w-full bg-purple-600 from-purple-600 via-purple-400 to-purple-600">
			{/* Background Pattern */}
			<div className="xl:max-w-6xl mx-auto px-6 py-12 relative z-10 md:px-4 md:py-8">
				{/* Header */}
				<header
					className={`flex justify-between items-center mb-16 transition-all duration-700 md:flex-col md:gap-4 md:mb-8 ${
						headerVisible
							? "opacity-100 transform translate-y-0"
							: "opacity-0 transform -translate-y-4"
					}`}
				>
					<h1 className="text-white text-3xl font-bold ml-4 flex-1 md:ml-0">Eventer</h1>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-2 items-start mx-8 pt-8 gap-8 md:pt-4">
					{/* Left Content */}
					<div
						className={`flex flex-col gap-8 transition-all duration-700 ${
							leftVisible
								? "opacity-100 transform translate-x-0"
								: "opacity-0 transform -translate-x-5"
						}`}
					>
						<div className="flex flex-col items-start gap-4">
							<h2 className="text-white text-5xl font-bold leading-tight font-inter md:text-4xl">
								รับจบทุกงานใน
								<br />
								แพลตฟอร์มเดียว
							</h2>
							<p className="text-purple-100 text-lg leading-relaxed md:text-base">
								จัดการทุกอีเวนต์ได้ครบ จบในที่เดียว
								<br />
								ลดความยุ่งยากจากการใช้หลายเครื่องมือด้วย Eventer
							</p>
						</div>
						<div className="flex gap-4 mt-6">
							<button
								type="button"
								className="transition-transform duration-100 outline-none self-start"
								style={{ transition: "transform 0.1s" }}
								onMouseDown={(e) => {
									e.currentTarget.style.transform = "scale(0.95)";
								}}
								onMouseUp={(e) => {
									e.currentTarget.style.transform = "scale(1)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = "scale(1)";
								}}
								onFocus={(e) => {
									e.currentTarget.style.transform = "scale(1.05)";
								}}
								onBlur={(e) => {
									e.currentTarget.style.transform = "scale(1)";
								}}
							>
								<Link href="/auth/login">
									<span className="bg-white text-purple-400 px-12 py-3 rounded-full font-semibold text-base cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl">
										ทดลองใช้เลย
									</span>
								</Link>
							</button>
						</div>
					</div>

					{/* Right Content - Hero Images */}
					<div
						className={`relative h-[600px] items-start transition-all duration-800 md:h-[400px] md:static md:flex md:justify-center md:mb-8 ${
							rightVisible
								? "opacity-100 transform translate-y-0"
								: "opacity-0 transform translate-y-24"
						}`}
					>
						{/* Mobile App Interface Image */}
						<div className="flex items-start absolute left-0 top-0 scale-80 md:static md:justify-center md:scale-100">
							<Image
								src="/mainpic.svg"
								alt="Eventer Mobile App Interface"
								width={1920}
								height={1080}
								className="rounded-3xl shadow-2xl w-full object-cover max-w-full h-auto lg:w-full md:max-w-[480px]"
								priority
							/>
						</div>

						{/* Desktop Timer Widget Image */}
						<div className="">{/* You can add timer widget image or content here */}</div>
					</div>
				</div>
			</div>
			<Image
				src="/Union.png"
				alt="Eventer Mobile App Interface"
				width={1920}
				height={1080}
				className="absolute bottom-0 left-0 w-full h-48 xl:h-32 z-10 pointer-events-none object-cover"
				priority
			/>
		</div>
	);
};
