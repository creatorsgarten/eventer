"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ShowcaseItemProps {
	title: string;
	description: string;
	imagePath: string;
}

const showcaseItems: ShowcaseItemProps[] = [
	{
		title: "สร้างตารางอีเวนท์",
		description: "วางแผนกิจกรรมแต่ละวันได้อย่างชัดเจน\nพร้อมกำหนดเวลาและลำดับงานที่เป็นระบบ",
		imagePath: "/showcase1.svg",
	},
	{
		title: "แบ่งหน้าที่เป็นทีม",
		description: "มอบหมายงานให้แต่ละฝ่ายได้ชัดเจน ไม่ว่าจะเป็น\nContent, Support หรือ Organizer",
		imagePath: "/showcase2.svg",
	},
	{
		title: "ปรับแต่งได้ตามต้องการ",
		description: "สร้าง แก้ไข หรือลบงานได้อิสระ\nรองรับการทำงานที่ยืดหยุ่นและคล่องตัว",
		imagePath: "/showcase3.svg",
	},
];

export const ShowcaseSection = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [imgKey, setImgKey] = useState(0);

	// Auto-advance showcase every 4 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % showcaseItems.length);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	// Change key to trigger animation on image change
	useEffect(() => {
		setImgKey((prev) => prev + 1);
	}, []);

	return (
		<section className="py-20 px-5 max-w-6xl mx-auto md:py-12 md:px-4">
			<h2 className="text-4xl font-bold text-gray-900 mb-15 text-left leading-tight md:text-3xl md:text-center">
				พวกเราทำอะไรได้บ้าง ?
			</h2>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-75 items-center md:gap-8">
				{/* Left: List */}
				<div className="flex flex-col gap-0">
					{showcaseItems.map((item, idx) => (
						<button
							key={item.title}
							className={`flex items-start gap-5 py-7 bg-transparent border-none cursor-pointer text-left transition-colors duration-300 border-b border-gray-200 hover:bg-gray-50 md:py-5 ${
								activeIndex === idx ? "bg-indigo-50" : ""
							}`}
							onClick={() => setActiveIndex(idx)}
							type="button"
						>
							<div
								className={`w-2 h-25 rounded-full transition-colors duration-300 flex-shrink-0 md:h-16 ${
									activeIndex === idx ? "bg-purple-600" : "bg-gray-300"
								}`}
							/>
							<div>
								<h3 className="text-2xl font-semibold text-gray-900 mb-3 leading-tight md:text-xl">
									{item.title}
								</h3>
								<p className="text-base text-gray-600 leading-relaxed font-normal md:text-sm">
									{item.description.split("\n").map((line, i) => (
										<span key={i}>
											{line}
											{i < item.description.split("\n").length - 1 && <br />}
										</span>
									))}
								</p>
							</div>
						</button>
					))}
				</div>

				{/* Right: Image */}
				<div
					className="animate-fadeInScale lg:order-2 order-1"
					key={imgKey}
					style={{
						animation: "fadeInScale 0.5s cubic-bezier(0.23, 1.01, 0.32, 1)",
						transformOrigin: "center",
					}}
				>
					{showcaseItems[activeIndex] && (
						<Image
							src={showcaseItems[activeIndex].imagePath}
							alt={showcaseItems[activeIndex].title}
							width={400}
							height={400}
							className="max-w-full max-h-[500px] h-auto rounded-xl scale-120 md:scale-100 md:mx-auto md:block"
							priority
						/>
					)}
				</div>
			</div>
		</section>
	);
};
