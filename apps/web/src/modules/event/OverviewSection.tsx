import { useEffect, useState } from "react";

type EventData = {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	location: string;
};

// Dummy event data for demonstration
const eventData: EventData = {
	id: "1",
	name: "Stupid Hackathon 2025",
	startDate: "2025-07-26T09:00:00",
	endDate: "2025-07-28T17:00:00",
	location: "Bangkok, Thailand",
};

function formatDate(dateStr: string) {
	const date = new Date(dateStr);
	return date.toLocaleDateString("th-TH", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

function formatTime(date: Date) {
	return date.toLocaleTimeString("th-TH", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

function OverviewSection() {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
		const interval = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="p-4 lg:p-8 space-y-4 lg:space-y">
			{/* Tabs - Mobile responsive */}
			<div className="flex border-b border-gray-200 overflow-x-auto">
				<button
					type="button"
					className="px-4 py-2 text-sm font-medium text-purple-600 border-b-2 border-purple-600 whitespace-nowrap"
				>
					ภาพรวม
				</button>
				<button
					type="button"
					className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 whitespace-nowrap"
				>
					กิจกรรมย่อย
				</button>
			</div>

			{/* Hero Section - Mobile responsive */}
			<div
				className="rounded-xl lg:rounded-2xl p-4 lg:p-6 xl:p-8 text-white relative overflow-hidden"
				style={{
					background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)",
				}}
			>
				<div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
					<div className="flex-1">
						<h2 className="text-xl lg:text-2xl xl:text-3xl font-bold mb-2">{eventData.name}</h2>
						<p className="text-purple-100 mb-1 text-sm lg:text-base">
							{formatDate(eventData.startDate)} - {formatDate(eventData.endDate)}
						</p>
						<p className="text-purple-100 mb-4 lg:mb-6 xl:mb-8 text-sm lg:text-base">
							{eventData.location}
						</p>

						{/* AP Timer Button - Mobile responsive */}
						<button
							type="button"
							className="w-full sm:w-auto hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm bg-orange-500 rounded-xl lg:rounded-2xl px-4 py-2 lg:py-3 text-sm lg:text-base font-medium transition-colors duration-200"
							onClick={() => {
								window.location.href = "/timer";
							}}
						>
							🕓 AP Timer
						</button>
					</div>

					{/* Time Card - Mobile responsive */}
					<div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 text-gray-900 w-full lg:w-80">
						<div className="text-center mb-4">
							<div className="text-xs text-gray-500 mb-2">เวลาปัจจุบัน</div>
							<div className="text-2xl lg:text-3xl xl:text-4xl font-bold">
								{hasMounted ? formatTime(currentTime) : "--:--:--"}
							</div>
						</div>

						{/* Progress Bar */}
						<div className="mb-4">
							<div className="flex justify-between text-xs text-gray-500 mb-2">
								<span>--:--</span>
								<span>--:--</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div className="bg-orange-500 h-2 rounded-full" style={{ width: "0%" }}></div>
							</div>
						</div>

						{/* Event Info - Mobile responsive */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm">
							<div className="text-center sm:text-left">
								<div className="text-gray-500 mb-1">กิจกรรมปัจจุบัน</div>
								<div className="font-medium">No Schedule</div>
							</div>
							<div className="text-center sm:text-left">
								<div className="text-gray-500 mb-1">กิจกรรมต่อไป</div>
								<div className="font-medium">No Schedule</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OverviewSection;
