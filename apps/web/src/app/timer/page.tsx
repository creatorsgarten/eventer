"use client";

import { Clock, Flame, QrCode, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useTimer } from "@/hooks/use-timer";
// import Button from "@/components/ui/button";

export default function TimerPage() {
	const { data, isLoading, error } = useTimer();
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const interval = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<Timer className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
					<div className="text-lg font-medium">Loading...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-500 text-lg font-medium">Error: {error.value.summary}</div>
				</div>
			</div>
		);
	}
	//TODO: change time format to seconds

	const formatTime = (date: Date) =>
		`${date.getHours().toString().padStart(2, "0")}.${date.getMinutes().toString().padStart(2, "0")}`;
	const parseTime = (iso: string) => {
		const date = new Date(iso);
		return date.getHours() * 60 + date.getMinutes();
	};

	const toDisplayTime = (mins: number) =>
		`${String(Math.floor(mins / 60)).padStart(2, "0")}.${String(mins % 60).padStart(2, "0")}`;

	const currentIndex = data?.findIndex((t) => {
		const now = currentTime.getHours() * 60 + currentTime.getMinutes();
		return now >= parseTime(t.start) && now < parseTime(t.end);
	});

	const current = data[currentIndex];
	const next = data[currentIndex + 1];
	const progress = (() => {
		if (!current) return { percent: 0, start: "--.--", end: "--.--" };
		const startMin = parseTime(current.start);
		const endMin = parseTime(current.end);
		const nowMin = currentTime.getHours() * 60 + currentTime.getMinutes();
		const duration = endMin - startMin;
		const passed = nowMin - startMin;
		return {
			percent: Math.min(100, Math.max(0, (passed / duration) * 100)),
			start: toDisplayTime(startMin),
			end: toDisplayTime(endMin),
		};
	})();

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-md mx-auto p-4">
				{/* Header */}
				<div className="flex justify-between items-center mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
					<div>
						<h1 className="text-xl font-bold text-gray-900">Timer Page</h1>
						<div className="text-sm flex items-center gap-2 mt-2 text-purple-600">
							<Clock className="w-4 h-4" />
							<span className="font-semibold">{formatTime(currentTime)}</span>
						</div>
					</div>
					<div className="w-14 h-14 flex items-center justify-center rounded-xl border-2 bg-purple-600 border-purple-600">
						<QrCode className="w-7 h-7 text-white" />
					</div>
				</div>

				{/* Current Slot */}
				{current && (
					<div className="border-2 rounded-xl p-6 mb-6 shadow-lg border-purple-600 text-center">
						<div className="text-xs font-bold tracking-wider mb-4 px-4 py-2 rounded-full inline-block bg-purple-600 text-white">
							HAPPENING NOW
						</div>
						<div className="text-2xl font-bold text-gray-900 mb-2">{current.activity}</div>
						<div className="text-base text-gray-600 mb-5 leading-7 tracking-normal">
							{current.remarks || current.activity}
						</div>
						<div className="mb-4">
							<div className="flex justify-between text-sm font-semibold text-gray-700 mb-3">
								<span>{progress.start}</span>
								<span>{progress.end}</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-3">
								<div
									className="h-3 rounded-full transition-all duration-1000 ease-out"
									style={{
										width: `${progress.percent}%`,
										backgroundColor: "#7F56D9",
									}}
								></div>
							</div>
							<div className="text-xs text-gray-500 mt-2 text-center font-medium">
								{Math.round(progress.percent)}% complete
							</div>
						</div>
					</div>
				)}

				{/* Next Up */}
				{next && (
					<div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
						<div className="text-xs font-bold tracking-wider mb-3 text-purple-600">NEXT UP</div>
						<div className="text-lg font-bold text-gray-900 mb-1">{next.activity}</div>
						<div className="text-sm text-gray-600 mb-3">{next.remarks || next.activity}</div>
						<div className="text-sm font-semibold px-3 py-2 rounded-lg inline-block text-white bg-purple-600">
							{toDisplayTime(parseTime(next.start))} - {toDisplayTime(parseTime(next.end))}
						</div>
					</div>
				)}

				{/* Agenda List */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="px-5 py-4 border-b border-gray-200 bg-purple-600">
						<h3 className="font-bold text-white text-lg">Agenda</h3>
					</div>
					<div className="divide-y divide-gray-100">
						{data?.map((t, i) => (
							<div
								key={t.id}
								className={`p-5 ${i === currentIndex ? "border-l-4 bg-purple-100" : ""}`}
								style={{
									borderLeftColor: i === currentIndex ? "#7F56D9" : "transparent",
								}}
							>
								<div className="flex justify-between items-center">
									<div className="flex-1">
										<div className="font-semibold text-gray-900 text-base mb-1 flex items-center gap-2">
											{t.activity}
											{i === currentIndex && <Flame className="w-4 h-4 text-orange-500" />}
										</div>
										<div className="text-sm text-gray-600">{t.remarks || t.activity}</div>
									</div>
									<div className="ml-4">
										<div
											className="text-sm font-semibold px-3 py-2 rounded-lg"
											style={{
												backgroundColor: i === currentIndex ? "#7F56D9" : "transparent",
												color: i === currentIndex ? "white" : "#7F56D9",
											}}
										>
											{toDisplayTime(parseTime(t.start))} - {toDisplayTime(parseTime(t.end))}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="mt-8 text-center">
					<a href="/admin" className="text-sm font-medium underline text-purple-600">
						Admin Panel
					</a>
				</div>
			</div>
		</div>
	);
}

//     <div className="flex flex-col items-center justify-center min-h-screen font-main">
//       <h1 className="text-2xl font-bold mb-4">Timer</h1>
//       <div className="text-lg">
//         {data?.map((timer) => (
//           <div key={timer.id} className="mb-2">
//             <p>
//               {timer.activity}: {timer.duration} seconds
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
