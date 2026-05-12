"use client";

import {
	AlertCircle,
	Calendar,
	ChevronRight,
	Clock,
	Loader2,
	LogOut,
	MapPin,
	Plus,
	Search,
	X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useCreateEvent } from "@/hooks/use-create-event";
import { type EventItem, useGetEvents } from "@/hooks/use-get-events";
import { useSession } from "@/hooks/use-session";
import { createClient } from "@/lib/supabase";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CARD_GRADIENTS = [
	["#7c3aed", "#a78bfa"],
	["#0891b2", "#22d3ee"],
	["#059669", "#34d399"],
	["#d97706", "#fbbf24"],
	["#dc2626", "#f87171"],
	["#db2777", "#f472b6"],
	["#2563eb", "#60a5fa"],
	["#7c3aed", "#ec4899"],
] as const;

function getGradient(id: string): readonly [string, string] {
	const hash = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
	return CARD_GRADIENTS[hash % CARD_GRADIENTS.length] ?? CARD_GRADIENTS[0];
}

function formatDateTH(date: string | Date) {
	return new Date(date).toLocaleDateString("th-TH", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

function formatDateShortTH(date: string | Date) {
	return new Date(date).toLocaleDateString("th-TH", {
		day: "numeric",
		month: "short",
	});
}

function getDaysUntil(date: string | Date) {
	return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ─── Create Event Modal ───────────────────────────────────────────────────────

interface CreateModalProps {
	onClose: () => void;
}

function CreateEventModal({ onClose }: CreateModalProps) {
	const router = useRouter();
	const { createEventAsync, isPending } = useCreateEvent();
	const firstInputRef = useRef<HTMLInputElement>(null);

	const [form, setForm] = useState({
		name: "",
		startDate: "",
		endDate: "",
		location: "",
		description: "",
	});
	const [error, setError] = useState<string | null>(null);

	const set =
		(field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
			setForm((prev) => ({ ...prev, [field]: e.target.value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!form.name.trim()) return setError("กรุณากรอกชื่ออีเวนต์");
		if (!form.startDate) return setError("กรุณาเลือกวันเริ่มต้น");
		if (!form.endDate) return setError("กรุณาเลือกวันสิ้นสุด");
		if (new Date(form.endDate) < new Date(form.startDate)) return setError("วันสิ้นสุดต้องอยู่หลังวันเริ่มต้น");
		if (!form.location.trim()) return setError("กรุณากรอกสถานที่");

		try {
			const result = await createEventAsync({
				name: form.name.trim(),
				startDate: new Date(form.startDate).toISOString(),
				endDate: new Date(form.endDate).toISOString(),
				location: form.location.trim(),
				description: form.description.trim() || null,
			});
			const newId = (result as { data?: { id?: string } })?.data?.id;
			if (newId) {
				router.push(`/event/${newId}`);
			} else {
				onClose();
			}
		} catch {
			setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
		>
			<div
				className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
				style={{ animation: "modalIn 0.2s ease both" }}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
					<div>
						<h2 className="text-lg font-bold text-gray-900">สร้างอีเวนต์ใหม่</h2>
						<p className="text-xs text-gray-400 mt-0.5">กรอกข้อมูลเพื่อเริ่มจัดงาน</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						disabled={isPending}
						className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
					{/* Name */}
					<div>
						<label htmlFor="event-name" className="block text-sm font-medium text-gray-700 mb-1.5">
							ชื่ออีเวนต์ <span className="text-red-400">*</span>
						</label>
						<input
							id="event-name"
							ref={firstInputRef}
							type="text"
							value={form.name}
							onChange={set("name")}
							placeholder="เช่น งานคอนเสิร์ต Summer Vibes 2025"
							className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
						/>
					</div>

					{/* Dates row */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label
								htmlFor="event-start-date"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								วันเริ่มต้น <span className="text-red-400">*</span>
							</label>
							<input
								id="event-start-date"
								type="datetime-local"
								value={form.startDate}
								onChange={set("startDate")}
								className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
							/>
						</div>
						<div>
							<label
								htmlFor="event-end-date"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								วันสิ้นสุด <span className="text-red-400">*</span>
							</label>
							<input
								id="event-end-date"
								type="datetime-local"
								value={form.endDate}
								min={form.startDate}
								onChange={set("endDate")}
								className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
							/>
						</div>
					</div>

					{/* Location */}
					<div>
						<label
							htmlFor="event-location"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							สถานที่ <span className="text-red-400">*</span>
						</label>
						<input
							id="event-location"
							type="text"
							value={form.location}
							onChange={set("location")}
							placeholder="เช่น IMPACT Arena, เมืองทองธานี"
							className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
						/>
					</div>

					{/* Description */}
					<div>
						<label
							htmlFor="event-description"
							className="block text-sm font-medium text-gray-700 mb-1.5"
						>
							รายละเอียด <span className="text-gray-300 font-normal">(ไม่บังคับ)</span>
						</label>
						<textarea
							id="event-description"
							value={form.description}
							onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
							placeholder="รายละเอียดเพิ่มเติมของอีเวนต์..."
							rows={3}
							className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 resize-none transition-all"
						/>
					</div>

					{/* Error */}
					{error && (
						<div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl px-3.5 py-2.5 border border-red-100">
							<AlertCircle className="w-4 h-4 flex-shrink-0" />
							{error}
						</div>
					)}

					{/* Actions */}
					<div className="flex gap-3 pt-1">
						<button
							type="button"
							onClick={onClose}
							disabled={isPending}
							className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
						>
							ยกเลิก
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
						>
							{isPending ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									กำลังสร้าง...
								</>
							) : (
								"สร้างอีเวนต์"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event, index }: { event: EventItem; index: number }) {
	const router = useRouter();
	const [from, to] = getGradient(event.id);
	const startD = new Date(event.startDate);
	const endD = new Date(event.endDate);
	const isSameDay = startD.toDateString() === endD.toDateString();
	const daysUntil = getDaysUntil(event.startDate);
	const isOngoing = daysUntil <= 0 && endD >= new Date();
	const isPast = endD < new Date();

	return (
		// biome-ignore lint/a11y/useSemanticElements: card layout requires div with nested interactive elements
		<div
			className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
			style={{ animationDelay: `${index * 50}ms`, animation: "fadeUp 0.4s ease both" }}
			onClick={() => router.push(`/event/${event.id}`)}
			onKeyDown={(e) => e.key === "Enter" && router.push(`/event/${event.id}`)}
			role="button"
			tabIndex={0}
		>
			{/* Gradient header */}
			<div
				className="h-28 relative flex flex-col justify-between p-4"
				style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
			>
				<div className="flex justify-between items-start">
					<span
						className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
							isPast
								? "bg-black/20 text-white/80"
								: isOngoing
									? "bg-white/30 text-white animate-pulse"
									: "bg-white/20 text-white"
						}`}
					>
						{isPast
							? "ผ่านมาแล้ว"
							: isOngoing
								? "กำลังจัดอีเวนต์"
								: daysUntil === 0
									? "วันนี้!"
									: `อีก ${daysUntil} วัน`}
					</span>
					<div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
						<span className="text-white font-bold text-base leading-none">
							{event.name.charAt(0).toUpperCase()}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-1.5 bg-black/15 backdrop-blur-sm rounded-lg px-3 py-1.5 w-fit">
					<Calendar className="w-3 h-3 text-white/80 flex-shrink-0" />
					<span className="text-white text-xs font-medium">
						{isSameDay
							? formatDateShortTH(event.startDate)
							: `${formatDateShortTH(event.startDate)} – ${formatDateShortTH(event.endDate)}`}
					</span>
				</div>
			</div>

			{/* Body */}
			<div className="p-4 flex flex-col flex-1">
				<h3 className="font-bold text-gray-900 text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
					{event.name}
				</h3>
				{event.description && (
					<p className="text-gray-400 text-xs leading-relaxed mb-2.5 line-clamp-2">
						{event.description}
					</p>
				)}
				<div className="flex items-center gap-1.5 text-gray-400 text-xs mb-auto mt-1">
					<MapPin className="w-3 h-3 flex-shrink-0 text-gray-300" />
					<span className="truncate">{event.location}</span>
				</div>
				<div className="flex items-center gap-1.5 text-gray-300 text-xs mt-2.5 mb-3">
					<Clock className="w-3 h-3 flex-shrink-0" />
					<span>
						{isSameDay
							? formatDateTH(event.startDate)
							: `${formatDateTH(event.startDate)} – ${formatDateTH(event.endDate)}`}
					</span>
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						router.push(`/event/${event.id}`);
					}}
					className="w-full flex items-center justify-center gap-1 text-purple-600 text-sm font-medium hover:bg-purple-50 rounded-xl py-2 transition-colors border border-purple-100 group-hover:border-purple-200 group-hover:bg-purple-50"
				>
					จัดการอีเวนต์
					<ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
				</button>
			</div>
		</div>
	);
}

function SkeletonCard() {
	return (
		<div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
			<div className="h-28 bg-gradient-to-br from-gray-200 to-gray-100" />
			<div className="p-4 space-y-3">
				<div className="h-4 bg-gray-100 rounded-lg w-3/4" />
				<div className="h-3 bg-gray-100 rounded w-full" />
				<div className="h-3 bg-gray-100 rounded w-2/3" />
				<div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
				<div className="h-9 bg-gray-50 rounded-xl mt-3" />
			</div>
		</div>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "upcoming" | "ongoing" | "past";

const FILTER_LABELS: Record<FilterTab, string> = {
	all: "ทั้งหมด",
	upcoming: "กำลังจะมา",
	ongoing: "กำลังจัดอีเวนต์",
	past: "ผ่านมาแล้ว",
};

export default function EventsListPage() {
	const router = useRouter();
	const { user } = useSession();
	const { events, isLoading } = useGetEvents();
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<FilterTab>("all");
	const [showCreate, setShowCreate] = useState(false);
	const supabase = createClient();

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/auth/login");
	};

	const now = new Date();

	const filtered = events.filter((event) => {
		if (search) {
			const q = search.toLowerCase();
			const matches =
				event.name.toLowerCase().includes(q) ||
				(event.description ?? "").toLowerCase().includes(q) ||
				event.location.toLowerCase().includes(q);
			if (!matches) return false;
		}
		const start = new Date(event.startDate);
		const end = new Date(event.endDate);
		if (filter === "upcoming") return start > now;
		if (filter === "ongoing") return start <= now && end >= now;
		if (filter === "past") return end < now;
		return true;
	});

	const counts: Record<FilterTab, number> = {
		all: events.length,
		upcoming: events.filter((e) => new Date(e.startDate) > now).length,
		ongoing: events.filter((e) => new Date(e.startDate) <= now && new Date(e.endDate) >= now)
			.length,
		past: events.filter((e) => new Date(e.endDate) < now).length,
	};

	return (
		<>
			<style>{`
				@keyframes fadeUp {
					from { opacity: 0; transform: translateY(16px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				@keyframes modalIn {
					from { opacity: 0; transform: scale(0.96) translateY(8px); }
					to   { opacity: 1; transform: scale(1) translateY(0); }
				}
			`}</style>

			{showCreate && <CreateEventModal onClose={() => setShowCreate(false)} />}

			<div className="min-h-screen bg-gray-50">
				{/* Navbar */}
				<header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
						<div className="flex items-center gap-2.5 flex-shrink-0">
							<div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-sm">
								<span className="text-white font-bold text-sm">E</span>
							</div>
							<span className="font-bold text-gray-900 text-lg tracking-tight hidden sm:block">
								Eventer
							</span>
						</div>

						<div className="relative hidden md:block flex-1 max-w-sm">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="ค้นหาอีเวนต์..."
								className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all"
							/>
						</div>

						<div className="flex items-center gap-2 sm:gap-3">
							<button
								type="button"
								onClick={() => setShowCreate(true)}
								className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-3.5 py-2 text-sm font-medium transition-colors shadow-sm flex-shrink-0"
							>
								<Plus className="w-4 h-4" />
								<span className="hidden sm:inline">สร้างอีเวนต์ใหม่</span>
							</button>

							<div className="flex items-center gap-2 pl-2 border-l border-gray-100">
								{user?.avatar_url ? (
									<Image
										src={user.avatar_url}
										alt="Profile"
										width={32}
										height={32}
										className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-100"
									/>
								) : (
									<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
										<span className="text-purple-700 font-bold text-sm">
											{user?.name?.charAt(0)?.toUpperCase() ?? "U"}
										</span>
									</div>
								)}
								<span className="text-sm font-medium text-gray-700 hidden lg:block max-w-[120px] truncate">
									{user?.name ?? ""}
								</span>
								<button
									type="button"
									onClick={handleSignOut}
									className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
									title="ออกจากระบบ"
								>
									<LogOut className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>
				</header>

				<main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
					{/* Title row */}
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
						<div>
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
								อีเวนต์ของฉัน
							</h1>
							<p className="text-gray-400 text-sm mt-1">จัดการและติดตามอีเวนต์ทั้งหมดของคุณ</p>
						</div>
						{!isLoading && events.length > 0 && (
							<div className="flex gap-4 text-center">
								<div>
									<p className="text-xl font-bold text-gray-900">{events.length}</p>
									<p className="text-xs text-gray-400">ทั้งหมด</p>
								</div>
								<div className="w-px bg-gray-100" />
								<div>
									<p className="text-xl font-bold text-purple-600">{counts.upcoming}</p>
									<p className="text-xs text-gray-400">กำลังจะมา</p>
								</div>
								{counts.ongoing > 0 && (
									<>
										<div className="w-px bg-gray-100" />
										<div>
											<p className="text-xl font-bold text-green-500">{counts.ongoing}</p>
											<p className="text-xs text-gray-400">กำลังจัด</p>
										</div>
									</>
								)}
							</div>
						)}
					</div>

					{/* Mobile search */}
					<div className="relative md:hidden mb-4">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="ค้นหาอีเวนต์..."
							className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
						/>
					</div>

					{/* Filter tabs */}
					<div className="flex gap-2 mb-7 overflow-x-auto pb-1">
						{(Object.keys(FILTER_LABELS) as FilterTab[]).map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => setFilter(tab)}
								className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
									filter === tab
										? "bg-purple-600 text-white shadow-sm"
										: "bg-white border border-gray-200 text-gray-500 hover:border-purple-200 hover:text-purple-600"
								}`}
							>
								{FILTER_LABELS[tab]}
								{counts[tab] > 0 && (
									<span
										className={`text-xs px-1.5 py-0.5 rounded-full ${
											filter === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
										}`}
									>
										{counts[tab]}
									</span>
								)}
							</button>
						))}
					</div>

					{/* Grid */}
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
							{Array.from({ length: 8 }).map((_, i) => (
								<SkeletonCard key={i} />
							))}
						</div>
					) : filtered.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-28 text-center">
							<div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-5 border border-purple-100">
								<Calendar className="w-8 h-8 text-purple-300" />
							</div>
							<h3 className="text-lg font-semibold text-gray-700 mb-2">
								{search || filter !== "all" ? "ไม่พบอีเวนต์ที่ตรงกัน" : "ยังไม่มีอีเวนต์"}
							</h3>
							<p className="text-gray-400 text-sm max-w-xs mb-5">
								{search || filter !== "all"
									? "ลองค้นหาด้วยคำอื่นหรือเปลี่ยนตัวกรอง"
									: "กดปุ่มด้านล่างเพื่อสร้างอีเวนต์แรกของคุณ"}
							</p>
							{!search && filter === "all" && (
								<button
									type="button"
									onClick={() => setShowCreate(true)}
									className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors shadow-sm"
								>
									<Plus className="w-4 h-4" />
									สร้างอีเวนต์ใหม่
								</button>
							)}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
							{filtered.map((event, i) => (
								<EventCard key={event.id} event={event} index={i} />
							))}
						</div>
					)}

					{!isLoading && events.length > 0 && (
						<p className="text-center text-xs text-gray-300 mt-10">
							แสดง {filtered.length} จาก {events.length} อีเวนต์
						</p>
					)}
				</main>
			</div>
		</>
	);
}
