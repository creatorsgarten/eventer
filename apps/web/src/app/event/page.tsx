"use client";

import { Clock, Menu, MoreHorizontal, Search, X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { getSession } from "@/lib/auth";
import AgendaSection from "../../modules/event/AgendaSection";
// Import all section components
import OverviewSection from "../../modules/event/OverviewSection";

// import GanttSection from "./components/gantt-section";
// import TeamsSection from "./components/teams-section";
// import ExtraSection from "./components/extra-section";

// Types for backend readiness
interface Event {
	id: string;
	name: string;
	description: string;
	startDate: string;
	endDate: string;
	location: string;
	type: string;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
}

interface User {
	id: string;
	name: string;
	email: string;
	avatar_url?: string;
}

interface NavigationItem {
	id: string;
	label: string;
	component: React.ComponentType<{ eventData: Event }>;
	badge?: number;
}
// TODO: Change from static page to supabase
// Mock event data - ready for Supabase integration
const getEventData = (eventId: string): Event => {
	const eventMap: Record<string, Event> = {
		stupidhackathon9: {
			id: "stupidhackathon9",
			name: "Stupid Hackathon #9",
			description: "The most ridiculous hackathon in Thailand",
			startDate: "2025-07-26",
			endDate: "2025-07-27",
			location: "Bangkok, Thailand",
			type: "hackathon",
			isPublic: true,
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-01T00:00:00Z",
		},
		stupidhackathon8: {
			id: "stupidhackathon8",
			name: "Stupid Hackathon #8",
			description: "Previous edition of the hackathon",
			startDate: "2024-06-15",
			endDate: "2024-06-17",
			location: "Bangkok, Thailand",
			type: "hackathon",
			isPublic: true,
			createdAt: "2024-01-01T00:00:00Z",
			updatedAt: "2024-01-01T00:00:00Z",
		},
	};

	return (
		eventMap[eventId] || {
			id: eventId,
			name: "Event",
			description: "Event description will be added here",
			startDate: new Date().toISOString().split("T")[0] ?? "",
			endDate: new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "",
			location: "TBD",
			type: "custom",
			isPublic: true,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}
	);
};

export default function EventManagementSPA() {
	const params = useParams();
	const eventId = params.eventId as string;
	const [currentTime, setCurrentTime] = useState(new Date());
	const [hasMounted, setHasMounted] = useState(false);
	const [activeSection, setActiveSection] = useState("overview");
	const [eventData] = useState<Event>(() =>
		//setEventData
		getEventData(eventId)
	);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [user, setUser] = useState<User | null>(null);

	// Navigation items - all ready for backend
	const navigationItems: NavigationItem[] = [
		{ id: "overview", label: "Overview", component: OverviewSection },
		{ id: "agenda", label: "Agenda (AP)", component: AgendaSection },
		// { id: "gantt", label: "Gantt Chart", component: GanttSection },
		// { id: "teams", label: "Staff & Participant", component: TeamsSection },
		// { id: "extra", label: "Extra", component: ExtraSection },
	];

	useEffect(() => {
		setHasMounted(true);
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		// Fetch user session
		const fetchUser = async () => {
			try {
				const sessionUser = await getSession();
				setUser(sessionUser);
			} catch (error) {
				console.error("Failed to fetch user session:", error);
			}
		};

		fetchUser();

		return () => clearInterval(timer);
	}, []);

	const formatTime = (date: Date) => {
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		const seconds = date.getSeconds().toString().padStart(2, "0");
		return `${hours}:${minutes}:${seconds}`;
	};

	const handleSectionChange = (sectionId: string) => {
		setActiveSection(sectionId);
		// Ready for URL state management and analytics tracking
		// window.history.pushState({}, '', `/${eventId}/${sectionId}`)
	};

	// Get current section component
	const currentSection = navigationItems.find((item) => item.id === activeSection);
	const CurrentComponent = currentSection?.component || OverviewSection;

	return (
		<div className="h-screen bg-gray-50 flex overflow-hidden">
			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setIsMobileMenuOpen(false);
						}
					}}
					role="button"
					tabIndex={0}
					aria-label="Close mobile menu"
				/>
			)}

			{/* Left Sidebar - Now responsive */}
			<div
				className={`
				${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
				lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
				w-64 bg-white border-r border-gray-200 flex flex-col h-full
				transition-transform duration-300 ease-in-out
			`}
			>
				{/* Mobile close button */}
				<div className="lg:hidden flex justify-end p-4">
					<button
						type="button"
						onClick={() => setIsMobileMenuOpen(false)}
						className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Logo */}
				<div className="p-4 lg:p-6 border-b border-gray-200">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
							<span className="text-white font-bold text-sm">{"E"}</span>
						</div>
						<span className="font-bold text-xl">Eventer</span>
					</div>
				</div>

				{/* Search */}
				<div className="p-4 border-b border-gray-200">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input placeholder="ค้นหา" className="pl-10 bg-gray-50 border-gray-200 text-sm" />
					</div>
				</div>

				{/* Navigation */}
				<div className="flex-1 p-4 overflow-y-auto">
					<div className="space-y-2">
						<div className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
							{eventData.name}
						</div>
						<div className="ml-4 space-y-1">
							{navigationItems.map((item) => (
								<button
									key={item.id}
									type="button"
									onClick={() => {
										handleSectionChange(item.id);
										setIsMobileMenuOpen(false); // Close menu on mobile after selection
									}}
									className={`w-full text-left text-sm px-3 py-2 rounded cursor-pointer transition-colors ${
										activeSection === item.id
											? "text-purple-600 bg-purple-50 font-medium"
											: "text-gray-600 hover:bg-gray-50"
									}`}
								>
									<div className="flex items-center justify-between">
										<span>{item.label}</span>
										{item.badge && (
											<span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
												{item.badge}
											</span>
										)}
									</div>
								</button>
							))}
						</div>
						<div className="text-sm text-gray-600 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
							การแจ้งเตือน
							<span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
								0
							</span>
						</div>
					</div>
				</div>

				{/* Bottom Section - Simplified for mobile */}
				<div className="p-4 border-t border-gray-200 space-y-3">
					<div className="hidden lg:block text-sm text-gray-600">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-4 h-4 bg-gray-300 rounded-full"></div>
							<span>ติดต่อซัพพอร์ต</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 bg-gray-300 rounded-full"></div>
							<span>ตั้งค่าการใช้งาน</span>
						</div>
					</div>

					<div className="hidden lg:block border rounded-lg p-3 bg-slate-100">
						<div className="text-xs font-medium mb-1 text-slate-900">Used space</div>
						<div className="text-xs mb-2 text-slate-500">
							Your team has used 80% of your available space. Need more?
						</div>
						<div className="flex gap-2">
							<Button type="button" className="text-xs h-6 px-2">
								Dismiss
							</Button>
							<Button type="button" className="text-xs h-6 px-2 bg-purple-600 hover:bg-purple-700">
								Upgrade plan
							</Button>
						</div>
					</div>

					<div className="flex items-center gap-3">
						{user?.avatar_url ? (
							<Image
								src={user.avatar_url}
								alt="Profile"
								width={32}
								height={32}
								className="w-8 h-8 rounded-full object-cover"
							/>
						) : (
							<div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
								<span className="text-white font-medium text-sm">
									{user?.name?.charAt(0)?.toUpperCase() || "U"}
								</span>
							</div>
						)}
						<div className="flex-1 min-w-0">
							<div className="text-sm font-medium truncate">{user?.name || "Loading..."}</div>
							<div className="text-xs text-gray-500 truncate">{user?.email || "Loading..."}</div>
						</div>
						<Button type="button" className="w-6 h-6 p-0 lg:flex hidden">
							<MoreHorizontal className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
				{/* Header - Mobile responsive */}
				<div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-30 flex-shrink-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3 min-w-0 flex-1">
							{/* Mobile menu button */}
							<button
								type="button"
								onClick={() => setIsMobileMenuOpen(true)}
								className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
							>
								<Menu className="w-6 h-6" />
							</button>

							<div className="min-w-0 flex-1">
								<div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 mb-1">
									<button
										type="button"
										onClick={() => {
											window.location.href = "/";
										}}
										className="hover:text-purple-600 transition-colors"
									>
										หน้าหลัก
									</button>
									<span>/</span>
									<span className="truncate">{currentSection?.label || "Overview"}</span>
								</div>
								<h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
									{eventData.name}
								</h1>
								<div className="text-xs lg:text-sm text-gray-500 flex items-center gap-1 mt-1">
									<Clock className="w-3 h-3 flex-shrink-0" />
									<span>{hasMounted ? formatTime(currentTime) : "--:--:--"}</span>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
							<Button
								type="button"
								size="sm"
								className="hidden sm:flex text-gray-700 bg-transparent border-gray-100"
							>
								Save
							</Button>
							<Button
								type="button"
								size="sm"
								className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl lg:rounded-2xl px-3 lg:px-8 py-1 lg:py-2 text-xs lg:text-sm font-medium transition-colors duration-200"
							>
								<div className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 bg-white rounded-full flex-shrink-0"></div>
								<span className="hidden sm:inline">
									{eventData.isPublic ? "Public" : "Private"}
								</span>
								<span className="sm:hidden">{eventData.isPublic ? "Pub" : "Prv"}</span>
							</Button>
						</div>
					</div>
				</div>

				{/* Dynamic Content */}
				<div className="flex-1 overflow-hidden">
					{CurrentComponent && <CurrentComponent eventData={eventData} />}
				</div>
			</div>
		</div>
	);
}
