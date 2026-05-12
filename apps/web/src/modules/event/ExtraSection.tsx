"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventData } from "@/app/event/page";
import { Button } from "@/components/atoms/button";

type Tab = "notes" | "sponsor";

function formatDateTH(iso: string): string {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString("th-TH", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function buildSponsorTemplate(eventData: EventData): string {
	const startTH = formatDateTH(eventData.startDate);
	const endTH = formatDateTH(eventData.endDate);
	const dateRange = startTH === endTH ? startTH : `${startTH} – ${endTH}`;

	return `เรื่อง  ขอเรียนเชิญเข้าร่วมสนับสนุนกิจกรรม "${eventData.name}"

เรียน  ท่านผู้สนับสนุน

ด้วยคณะผู้จัดงานมีกำหนดจัดกิจกรรม "${eventData.name}" ในระหว่างวันที่ ${dateRange}
ณ ${eventData.location || "สถานที่ TBD"}

${eventData.description ? `รายละเอียดกิจกรรม:\n${eventData.description}\n\n` : ""}วัตถุประสงค์ของการจัดงานมุ่งเน้นการสร้างประโยชน์แก่ผู้เข้าร่วมและชุมชน คณะผู้จัดงานขอเรียนเชิญท่านพิจารณาให้การสนับสนุนกิจกรรมดังกล่าวในรูปแบบที่ท่านเห็นสมควร

จึงเรียนมาเพื่อโปรดพิจารณา และขอขอบพระคุณเป็นอย่างสูง

ขอแสดงความนับถือ
คณะผู้จัดงาน ${eventData.name}`;
}

export default function ExtraSection({ eventData }: { eventData: EventData }) {
	const [activeTab, setActiveTab] = useState<Tab>("notes");
	const [notes, setNotes] = useState("");
	const [copied, setCopied] = useState(false);

	const notesKey = `eventer-notes-${eventData.id}`;

	// Load notes from localStorage
	useEffect(() => {
		try {
			const saved = localStorage.getItem(notesKey);
			if (saved !== null) setNotes(saved);
		} catch {
			// localStorage unavailable
		}
	}, [notesKey]);

	// Persist notes on change
	const handleNotesChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const value = e.target.value;
			setNotes(value);
			try {
				localStorage.setItem(notesKey, value);
			} catch {
				// localStorage unavailable
			}
		},
		[notesKey]
	);

	const sponsorTemplate = buildSponsorTemplate(eventData);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(sponsorTemplate);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Fallback: select all in textarea
			const el = document.getElementById("sponsor-template") as HTMLTextAreaElement | null;
			el?.select();
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 lg:p-8">
			<div className="mb-6">
				<h1 className="text-2xl lg:text-3xl font-bold">Extra</h1>
				<p className="text-gray-600 text-sm mt-1">{eventData.name}</p>
			</div>

			{/* Tab switcher */}
			<div className="flex gap-1 bg-gray-200 p-1 rounded-lg w-fit mb-6">
				<button
					type="button"
					onClick={() => setActiveTab("notes")}
					className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "notes" ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
				>
					📝 Notes
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("sponsor")}
					className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "sponsor" ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
				>
					📄 Sponsor Template
				</button>
			</div>

			{activeTab === "notes" && (
				<div className="bg-white rounded-lg shadow-sm border p-4">
					<div className="flex items-center justify-between mb-3">
						<h2 className="font-semibold text-gray-800">Event Notes</h2>
						<span className="text-xs text-gray-400">Auto-saved</span>
					</div>
					<textarea
						value={notes}
						onChange={handleNotesChange}
						placeholder={`Add notes for "${eventData.name}"…`}
						rows={16}
						className="w-full resize-y text-sm text-gray-700 placeholder:text-gray-400 border border-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
					/>
					<p className="text-xs text-gray-400 mt-2">Notes are saved locally in your browser.</p>
				</div>
			)}

			{activeTab === "sponsor" && (
				<div className="bg-white rounded-lg shadow-sm border p-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
						<h2 className="font-semibold text-gray-800">Sponsor Template (ภาษาไทย)</h2>
						<Button
							variant="default"
							size="sm"
							onClick={handleCopy}
							className={`w-full sm:w-auto ${copied ? "bg-green-600 hover:bg-green-700" : ""}`}
						>
							{copied ? "✓ Copied!" : "Copy to Clipboard"}
						</Button>
					</div>

					<textarea
						id="sponsor-template"
						readOnly
						value={sponsorTemplate}
						rows={20}
						className="w-full resize-y text-sm font-mono text-gray-700 border border-gray-200 rounded-md p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
					/>

					<p className="text-xs text-gray-400 mt-2">
						Template auto-filled from event details. Edit the copied text as needed.
					</p>
				</div>
			)}
		</div>
	);
}
