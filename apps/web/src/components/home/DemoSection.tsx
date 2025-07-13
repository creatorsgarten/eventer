import Image from "next/image";
import Link from "next/link";

export const DemoSection = () => {
	return (
		<section className="flex flex-col lg:flex-row items-center justify-center gap-10 py-12 bg-white mx-auto mb-8 max-w-none md:gap-6 md:py-8">
			<div className="flex-shrink-0 flex items-start justify-center lg:order-1 order-2">
				<Image
					src="/demo-img.png"
					alt="Demo image"
					width={1200}
					height={1000}
					className="w-[700px] h-[600px] object-contain md:w-full md:h-auto md:max-w-[400px]"
					priority
				/>
			</div>
			<div className="flex-1 flex flex-col items-start justify-center lg:order-2 order-1 md:items-center md:text-center">
				<h2 className="text-[38px] font-bold text-gray-900 mb-3 leading-tight tracking-tight md:text-3xl">
					บริหารเวลาอีเวนต์ได้แม่นยำ
					<br />
					ไม่หลุดไทม์ไลน์
				</h2>
				<p className="text-base text-gray-600 mb-10 leading-relaxed">
					ช่วยให้ทีมของคุณทำงานราบรื่น ตรงเวลา และมั่นใจในทุกช่วงของอีเวนต์
				</p>
				<Link
					href="#"
					className="inline-flex items-center gap-6 text-lg font-semibold text-purple-400 bg-transparent border-none outline-none no-underline cursor-pointer transition-colors duration-200 p-0 hover:text-purple-700 hover:underline focus:text-purple-700 focus:underline"
				>
					ทดลองใช้เลย <span aria-hidden>→</span>
				</Link>
			</div>
		</section>
	);
};
