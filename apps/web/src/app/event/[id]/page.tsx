"use client";

import {
	Bell,
	Check,
	Clock,
	Globe,
	Lock,
	LogOut,
	Menu,
	MoreHorizontal,
	Search,
	X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useGetAgenda } from "@/hooks/use-get-agenda";
import { useGetEvent } from "@/hooks/use-get-event";
import { useSession } from "@/hooks/use-session";
import { useSessionManager } from "@/hooks/use-session-manager";
import { createClient } from "@/lib/supabase";
import AgendaSection from "../../../modules/event/AgendaSection";
import ExtraSection from "../../../modules/event/ExtraSection";
import GanttSection from "../../../modules/event/GanttSection";
import OverviewSection from "../../../modules/event/OverviewSection";
import StaffSection from "../../../modules/event/StaffSection";

export interface EventData {
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
	createdBy?: string;
}

interface NavigationItem {
	id: string;
	label: string;
	component: React.ComponentType<{ eventData: EventData }>;
	badge?: number;
}

const FALLBACK_EVENT: EventData = {
	id: "",
	name: "Event",
	description: "",
	startDate: new Date().toISOString().split("T")[0] ?? "",
	endDate: new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "",
	location: "TBD",
	type: "custom",
	isPublic: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

export default function EventManagementSPA() {
	const params = useParams();
	const router = useRouter();
	const eventId = params.id as string;

	const [currentTime, setCurrentTime] = useState(new Date());
	const [hasMounted, setHasMounted] = useState(false);
	const [activeSection, setActiveSection] = useState("overview");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const [isPublic, setIsPublic] = useState(true);
	const [savedFeedback, setSavedFeedback] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const userMenuRef = useRef<HTMLDivElement>(null);
	const notifRef = useRef<HTMLDivElement>(null);

	const { user } = useSession();
	const supabase = createClient();

	const { event: backendEvent, isLoading: eventLoading } = useGetEvent(eventId);

	const eventData: EventData = backendEvent
		? {
				id: String(backendEvent.id ?? eventId),
				name: String(backendEvent.name ?? "Event"),
				description: String(backendEvent.description ?? ""),
				startDate:
					backendEvent.startDate instanceof Date
						? ((backendEvent.startDate as Date).toISOString().split("T")[0] ?? "")
						: (String(backendEvent.startDate ?? "").split("T")[0] ?? ""),
				endDate:
					backendEvent.endDate instanceof Date
						? ((backendEvent.endDate as Date).toISOString().split("T")[0] ?? "")
						: (String(backendEvent.endDate ?? "").split("T")[0] ?? ""),
				location: String(backendEvent.location ?? "TBD"),
				type: "custom",
				isPublic,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				createdBy: String(backendEvent.createdBy ?? ""),
			}
		: { ...FALLBACK_EVENT, id: eventId, isPublic };

	const { getLatestAPNotation, sessionEnds } = useSessionManager();
	const { data: agendaData } = useGetAgenda();

	const notifications = sessionEnds
		.filter((se) => se.difference > 0)
		.sort((a, b) => b.actualEndTime.getTime() - a.actualEndTime.getTime())
		.slice(0, 10)
		.map((se) => {
			const slot = (agendaData ?? []).find(
				(s: { id: string; activity?: string }) => s.id === se.slotId
			);
			return {
				id: se.slotId,
				message: `"${slot?.activity ?? se.slotId}" ended AP+${se.difference}m late`,
				time: se.actualEndTime,
			};
		});

	const latestAP = hasMounted ? getLatestAPNotation() : null;
	const unreadCount = notifications.length;

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/auth/login");
	};

	const handleSave = useCallback(() => {
		setSavedFeedback(true);
		setTimeout(() => setSavedFeedback(false), 2000);
	}, []);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
				setIsUserMenuOpen(false);
			}
			if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
				setIsNotifOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		setHasMounted(true);
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (backendEvent) setIsPublic(true);
	}, [backendEvent]);

	const formatTime = (date: Date) => {
		const h = date.getHours().toString().padStart(2, "0");
		const m = date.getMinutes().toString().padStart(2, "0");
		const s = date.getSeconds().toString().padStart(2, "0");
		return `${h}:${m}:${s}`;
	};

	const navigationItems: NavigationItem[] = [
		{ id: "overview", label: "Overview", component: OverviewSection },
		{ id: "agenda", label: "Agenda (AP)", component: AgendaSection },
		{ id: "gantt", label: "Gantt Chart", component: GanttSection },
		{ id: "teams", label: "Staff & Participant", component: StaffSection },
		{ id: "extra", label: "Extra", component: ExtraSection },
	];

	const filteredNavItems = searchQuery
		? navigationItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
		: navigationItems;

	const handleSectionChange = (sectionId: string) => {
		setActiveSection(sectionId);
		window.history.replaceState({}, "", `?section=${sectionId}`);
	};

	const currentSection = navigationItems.find((item) => item.id === activeSection);
	const CurrentComponent = currentSection?.component ?? OverviewSection;

	return (
		<div className="h-screen bg-gray-50 flex overflow-hidden">
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
					onKeyDown={(e) => e.key === "Escape" && setIsMobileMenuOpen(false)}
					role="button"
					tabIndex={0}
					aria-label="Close mobile menu"
				/>
			)}

			{/* Left Sidebar */}
			<div
				className={`
					${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
					lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
					w-64 bg-white border-r border-gray-200 flex flex-col h-full
					transition-transform duration-300 ease-in-out
				`}
			>
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
						<button
							type="button"
							onClick={() => router.push("/event")}
							className="flex items-center gap-2 hover:opacity-80 transition-opacity"
						>
							<div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
								<span className="text-white font-bold text-sm">E</span>
							</div>
							<span className="font-bold text-xl">Eventer</span>
						</button>
					</div>
				</div>

				{/* Search */}
				<div className="p-4 border-b border-gray-200">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							placeholder="ค้นหาเมนู"
							className="pl-10 bg-gray-50 border-gray-200 text-sm"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				{/* Navigation */}
				<div className="flex-1 p-4 overflow-y-auto">
					<div className="space-y-2">
						<div className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-2 rounded-lg truncate">
							{eventLoading ? "Loading..." : eventData.name}
						</div>
						<div className="ml-4 space-y-1">
							{filteredNavItems.map((item) => (
								<button
									key={item.id}
									type="button"
									onClick={() => {
										handleSectionChange(item.id);
										setIsMobileMenuOpen(false);
									}}
									className={`w-full text-left text-sm px-3 py-2 rounded cursor-pointer transition-colors ${
										activeSection === item.id
											? "text-purple-600 bg-purple-50 font-medium"
											: "text-gray-600 hover:bg-gray-50"
									}`}
								>
									<div className="flex items-center justify-between">
										<span>{item.label}</span>
										{item.badge !== undefined && (
											<span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
												{item.badge}
											</span>
										)}
									</div>
								</button>
							))}
						</div>

						<button
							type="button"
							onClick={() => setIsNotifOpen((p) => !p)}
							className="w-full text-left text-sm text-gray-600 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
						>
							การแจ้งเตือน
							{unreadCount > 0 && (
								<span className="ml-2 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium">
									{unreadCount}
								</span>
							)}
						</button>

						{latestAP && (
							<div
								className={`mx-3 px-3 py-2 rounded-lg text-xs font-medium ${
									latestAP.isLate
										? "bg-red-50 text-red-700 border border-red-200"
										: "bg-green-50 text-green-700 border border-green-200"
								}`}
							>
								Event running: {latestAP.notation}
							</div>
						)}
					</div>
				</div>

				{/* Bottom */}
				<div className="p-4 border-t border-gray-200 space-y-3">
					<div className="hidden lg:block text-sm text-gray-600">
						<a
							href="mailto:support@eventer.app"
							className="flex items-center gap-2 mb-2 hover:text-purple-600"
						>
							<div className="w-4 h-4 bg-gray-300 rounded-full" />
							<span>ติดต่อซัพพอร์ต</span>
						</a>
						<button
							type="button"
							onClick={() => handleSectionChange("extra")}
							className="flex items-center gap-2 hover:text-purple-600"
						>
							<div className="w-4 h-4 bg-gray-300 rounded-full" />
							<span>ตั้งค่าการใช้งาน</span>
						</button>
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
									{user?.name?.charAt(0)?.toUpperCase() ?? "U"}
								</span>
							</div>
						)}
						<div className="flex-1 min-w-0">
							<div className="text-sm font-medium truncate">{user?.name ?? "Loading..."}</div>
							<div className="text-xs text-gray-500 truncate">{user?.email ?? "Loading..."}</div>
						</div>

						<div ref={userMenuRef} className="relative hidden lg:flex">
							<Button
								type="button"
								className="w-6 h-6 p-0"
								onClick={() => setIsUserMenuOpen((p) => !p)}
							>
								<MoreHorizontal className="w-4 h-4" />
							</Button>
							{isUserMenuOpen && (
								<div className="absolute bottom-8 right-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
									<button
										type="button"
										onClick={handleSignOut}
										className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
									>
										<LogOut className="w-4 h-4" />
										Sign out
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
				{/* Header */}
				<div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 sticky top-0 z-30 flex-shrink-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3 min-w-0 flex-1">
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
										onClick={() => router.push("/event")}
										className="hover:text-purple-600 transition-colors"
									>
										อีเวนต์ของฉัน
									</button>
									<span>/</span>
									<span className="truncate">{currentSection?.label ?? "Overview"}</span>
								</div>
								<h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
									{eventLoading ? "Loading..." : eventData.name}
								</h1>
								<div className="text-xs lg:text-sm text-gray-500 flex items-center gap-1 mt-1">
									<Clock className="w-3 h-3 flex-shrink-0" />
									<span>{hasMounted ? formatTime(currentTime) : "--:--:--"}</span>
									{latestAP && (
										<span
											className={`ml-2 px-1.5 py-0.5 rounded text-xs font-mono font-semibold ${
												latestAP.isLate ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
											}`}
										>
											{latestAP.notation}
										</span>
									)}
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
							<div ref={notifRef} className="relative">
								<button
									type="button"
									onClick={() => setIsNotifOpen((p) => !p)}
									className="relative p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
									aria-label="Notifications"
								>
									<Bell className="w-5 h-5" />
									{unreadCount > 0 && (
										<span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
											{unreadCount > 9 ? "9+" : unreadCount}
										</span>
									)}
								</button>

								{isNotifOpen && (
									<div className="absolute top-10 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
										<div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
											<span className="font-semibold text-sm">การแจ้งเตือน</span>
											{unreadCount > 0 && (
												<span className="text-xs text-gray-500">{unreadCount} รายการ</span>
											)}
										</div>
										<div className="max-h-64 overflow-y-auto">
											{notifications.length === 0 ? (
												<div className="px-4 py-6 text-center text-sm text-gray-400">
													ไม่มีการแจ้งเตือน
												</div>
											) : (
												notifications.map((n) => (
													<div
														key={n.id}
														className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 text-sm"
													>
														<p className="text-gray-800">{n.message}</p>
														<p className="text-xs text-gray-400 mt-1">
															{n.time.toLocaleTimeString("th-TH")}
														</p>
													</div>
												))
											)}
										</div>
									</div>
								)}
							</div>

							<Button
								type="button"
								size="sm"
								onClick={handleSave}
								className="hidden sm:flex items-center gap-1 text-gray-700 bg-transparent border border-gray-200 hover:bg-gray-50"
							>
								{savedFeedback ? (
									<>
										<Check className="w-3 h-3 text-green-600" />
										<span className="text-green-600">Saved</span>
									</>
								) : (
									"Save"
								)}
							</Button>

							<Button
								type="button"
								size="sm"
								onClick={() => setIsPublic((p) => !p)}
								className={`rounded-xl lg:rounded-2xl px-3 lg:px-5 py-1 lg:py-2 text-xs lg:text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
									isPublic
										? "bg-orange-500 hover:bg-orange-600 text-white"
										: "bg-gray-700 hover:bg-gray-800 text-white"
								}`}
							>
								{isPublic ? (
									<Globe className="w-3 h-3 lg:w-4 lg:h-4" />
								) : (
									<Lock className="w-3 h-3 lg:w-4 lg:h-4" />
								)}
								<span className="hidden sm:inline">{isPublic ? "Public" : "Private"}</span>
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
