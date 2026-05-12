import Image from "next/image";
import Link from "next/link";

export const DemoSection = () => {
	return (
		<section className="flex flex-col lg:flex-row items-center justify-center gap-6 py-8 bg-white px-4 max-w-6xl mx-auto mb-8 lg:gap-10 lg:py-12">
			<div className="flex-shrink-0 flex items-start justify-center order-2 lg:order-1">
				<Image
					src="/demo-img.png"
					alt="Demo image"
					width={1200}
					height={1000}
					className="w-full h-auto max-w-[300px] sm:max-w-[420px] lg:w-[700px] lg:h-[600px] lg:max-w-none object-contain"
					priority
				/>
			</div>
			<div className="flex-1 flex flex-col items-center justify-center text-center order-1 lg:order-2 lg:items-start lg:text-left">
				<h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight tracking-tight sm:text-3xl lg:text-[38px]">
					บริหารเวลาอีเวนต์ได้แม่นยำ
					<br />
					ไม่หลุดไทม์ไลน์
				</h2>
				<p className="text-sm text-gray-600 mb-8 leading-relaxed sm:text-base sm:mb-10">
					ช่วยให้ทีมของคุณทำงานราบรื่น ตรงเวลา และมั่นใจในทุกช่วงของอีเวนต์
				</p>
				<Link
					href="#"
					className="inline-flex items-center gap-4 text-base font-semibold text-purple-400 bg-transparent border-none outline-none no-underline cursor-pointer transition-colors duration-200 p-0 hover:text-purple-700 hover:underline focus:text-purple-700 focus:underline lg:gap-6 lg:text-lg"
				>
					ทดลองใช้เลย <span aria-hidden>→</span>
				</Link>
			</div>
		</section>
	);
};
