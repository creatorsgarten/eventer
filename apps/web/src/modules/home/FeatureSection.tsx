import Image from "next/image";

// Types and Interfaces
interface FeatureCardProps {
	icon: string;
	title: string;
	description: string;
}

// Utility Components
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
	<div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6 max-w-sm flex-1 min-w-[200px] flex flex-col items-center">
		<div className="mb-4">
			<Image src={icon} alt="" width={100} height={100} />
		</div>
		<h3 className="text-base font-bold mb-2 text-center">{title}</h3>
		<p className="text-gray-600 text-sm leading-relaxed text-center">{description}</p>
	</div>
);

export const FeatureSection = () => {
	const features: FeatureCardProps[] = [
		{
			icon: "/calendar-feature.svg",
			title: "จัดการตารางเวลา ณ วันงาน",
			description: "ปรับเปลี่ยนตารางเวลาแบบเรียลไทม์\nและสามารถ sync กับ Staff ทุกคนได้ทันที",
		},
		{
			icon: "/star-feature.svg",
			title: "สร้างเทมเพลตสำหรับสปอนเซอร์",
			description: "ลดเวลาในการทำเอกสารเพื่อผู้สนับสนุน ผู้น่ารักของคุณให้ติดต่อได้ง่ายขึ้น",
		},
		{
			icon: "/staff-feature.svg",
			title: "สภาพพร้อมงานได้ทันที",
			description: "คลิกเดียวเท่านั้น! Staff และอาสาสมัครทุกคน สามารถเข้าถึงข้อมูลของทั้งอีเวนต์ของคุณในทันที",
		},
		{
			icon: "/resource-feature.svg",
			title: "บริหารข้อมูลทรัพยากร",
			description: "ห้องที่ใช้, อาหาร, ที่จอดรถ รายชื่อ Staff\nและบทบาททั้งหมด แบบมัดรวมในที่เดียว",
		},
	];

	return (
		<section className="bg-indigo-50 w-full py-14">
			<div className="max-w-6xl mx-auto text-center">
				<h2 className="text-gray-900 text-2xl font-bold mb-2">
					เราจะช่วยให้การจัดอีเวนต์สะดวกขึ้นได้อย่างไร
				</h2>
				<p className="text-gray-900 text-base mb-10">
					เราออกแบบโดยอิงพื้นฐานจาก Pain Point นักจัดอีเวนต์หลากๆ ที่
				</p>
				<div className="flex justify-center gap-6 flex-wrap max-w-7xl mx-auto">
					{features.map((feature, index) => (
						<FeatureCard key={index} {...feature} />
					))}
				</div>
			</div>
		</section>
	);
};
