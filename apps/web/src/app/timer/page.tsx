"use client"

import { useEffect, useState } from "react"
//import { supabase } from "../../../../backend/src/infrastructure/db/supabase"


interface TimeSlot {
  id: string
  eventId: string
  start: string
  end: string
  activity: string
  personincharge: string
  duration: number
  remarks: string | null
}

const DEFAULT_EVENT_ID = process.env.NEXT_PUBLIC_DEFAULT_EVENT_ID

export default function TimerPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())


// TODO: Seperate fetching from useEffect
  useEffect(() => {
    const fetchAgenda = async () => {
      const res = await fetch(`/agenda/timer?eventId=${DEFAULT_EVENT_ID}`)
      const data = await res.json()
      setTimeSlots(data)
    }
    fetchAgenda()
    const interval = setInterval(fetchAgenda, 3000)
      return () => clearInterval(interval)
    }, [])

      const formatTime = (isoString: string) => {
      const date = new Date(isoString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

  return (
    <main className="min-h-screen p-6 bg-white text-gray-900">
      <h1 className="text-2xl font-bold mb-4">⏱️ Timer View</h1>

      <div className="space-y-4">
        {timeSlots.length === 0 ? (
          <p className="text-gray-500">Loading agenda...</p>
        ) : (
          timeSlots.map((slot) => {
            const start = new Date(slot.start)
            const end = new Date(slot.end)
            const now = currentTime

            const isOngoing = now >= start && now < end
            const isPast = now >= end

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border shadow-sm ${
                  isOngoing
                    ? "border-green-500 bg-green-50"
                    : isPast
                    ? "border-gray-300 bg-gray-100"
                    : "border-blue-400 bg-blue-50"
                }`}
              >
                <h2 className="text-lg font-semibold">{slot.activity}</h2>
                <p className="text-sm text-gray-600">{slot.remarks || "No description."}</p>
                <p className="text-sm mt-2">
                  🕒 {formatTime(slot.start)} - {formatTime(slot.end)}
                </p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  {isOngoing
                    ? "🔴 In Progress"
                    : isPast
                    ? "✅ Ended"
                    : "⏳ Upcoming"}
                </p>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}