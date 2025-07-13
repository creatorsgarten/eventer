"use client";

import { useState } from "react";

export const EmailSection = () => {
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Newsletter signup:", email);
	};

	return (
		<section className="bg-white/80 w-full max-w-6xl mx-auto rounded-2xl p-10 backdrop-blur-sm flex flex-col lg:flex-row gap-80 lg:gap-20 md:p-6 md:gap-8">
			<div className="ml-12 w-full text-left">
				<h3 className="flex text-[32px] font-semibold text-gray-900 mb-7 leading-tight flex-col md:text-2xl">
					สนับสนุนข่าวสารจากเรา
					<br />
					เพื่อไม่พลาดอัปเดต ฟีเจอร์ใหม่
				</h3>
			</div>
			<div className="text-center w-full">
				<form onSubmit={handleSubmit} className="mt-7 md:mt-0">
					<div className="flex gap-3 items-center md:flex-col md:gap-4">
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="flex-1 px-5 py-4 border border-gray-300 rounded-xl text-base bg-white transition-all duration-200 focus:outline-none focus:border-purple-500 focus:shadow-sm focus:shadow-purple-500/10 md:w-full"
							required
						/>
						<button
							type="submit"
							className="px-6 py-4 bg-purple-500 text-white border-none rounded-xl text-base font-medium cursor-pointer transition-all duration-200 flex items-center gap-2 whitespace-nowrap hover:bg-purple-700 hover:-translate-y-0.5 md:w-full md:justify-center"
						>
							สมัครเลย →
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};
