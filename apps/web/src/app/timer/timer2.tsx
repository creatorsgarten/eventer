"use client"

import { useState, useEffect } from "react"
import { QrCode, Clock, Flame } from "lucide-react"
import { Button } from "@eventer/ui/components/ui/button"
import { supabase } from "../../../../backend/src/infrastructure/db/supabase"

interface SessionEnd {
  slotId: string // This will be the agenda item's UUID
  actualEndTime: Date
  scheduledEndTime: Date
  difference: number // in minutes
}

// Updated TimeSlot interface to match Supabase schema
interface TimeSlot {
  id: string // UUID
  eventId: string // UUID
  start: string // ISO string, e.g., "2025-07-14T09:00:00.000Z"
  end: string // ISO string, e.g., "2025-07-14T10:00:00.000Z"
  activity: string // Maps to UI 'title'
  personincharge: string // UUID of user
  duration: number
  remarks: string | null // Additional remarks/description
}

// Placeholder for a default event ID. In a real app, this would be dynamic.
const DEFAULT_EVENT_ID = process.env.NEXT_PUBLIC_DEFAULT_EVENT_ID

interface AdjustedTimeSlot extends TimeSlot {
  adjustedStartTime: string
  adjustedEndTime: string
  isAdjusted: boolean
}

export default function HackathonSchedule() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sessionEnds, setSessionEnds] = useState<SessionEnd[]>([])
  const [showRealTimeAgenda, setShowRealTimeAgenda] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]) // State for fetched agenda items

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Reload session ends from localStorage on each tick to sync with admin changes
      const savedSessionEnds = localStorage.getItem("sessionEnds")
      if (savedSessionEnds) {
        const parsed = JSON.parse(savedSessionEnds).map((se: any) => ({
          ...se,
          actualEndTime: new Date(se.actualEndTime),
          scheduledEndTime: new Date(se.scheduledEndTime),
        }))
        setSessionEnds(parsed)
      } else {
        setSessionEnds([])
      }
    }, 1000)

    // Fetch agenda items from Supabase
    const fetchAgendaItems = async () => {
      const { data, error } = await supabase
        .from("agenda_slots") // Assuming your table name is 'agenda_slots'
        .select("id, eventId, start, end, activity, personincharge, remarks")
        .eq("eventId", DEFAULT_EVENT_ID) // Filter by the default event ID
        .order("start", { ascending: true }) // Order by start time

      if (error) {
        console.error("Error fetching agenda items:", error)
      } else {
        setTimeSlots(data as TimeSlot[])
      }
    }

    fetchAgendaItems()

    return () => clearInterval(timer)
  }, []) // Empty dependency array means this runs once on mount

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}.${minutes}`
  }

  // Converts an ISO string to minutes from midnight
  const parseIsoToMinutes = (isoString: string): number => {
    const date = new Date(isoString)
    return date.getHours() * 60 + date.getMinutes()
  }

  // Converts minutes from midnight to "HH.MM" format for display
  const minutesToDisplayTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}.${mins.toString().padStart(2, "0")}`
  }

  const calculateRealTimeAgenda = (): AdjustedTimeSlot[] => {
    if (timeSlots.length === 0) {
      return []
    }

    // Sort session ends by slot order (not by time ended)
    const sortedSessionEnds = sessionEnds.sort((a, b) => {
      const indexA = timeSlots.findIndex((slot) => slot.id === a.slotId)
      const indexB = timeSlots.findIndex((slot) => slot.id === b.slotId)
      return indexA - indexB
    })

    let cumulativeShift = 0
    const adjustedSlots: AdjustedTimeSlot[] = []

    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i]
      const sessionEnd = sortedSessionEnds.find((se) => se.slotId === slot.id)

      // Calculate start time with cumulative shift
      const originalStartMinutes = parseIsoToMinutes(slot.start)
      const adjustedStartMinutes = originalStartMinutes + cumulativeShift
      const adjustedStartTime = minutesToDisplayTime(adjustedStartMinutes)

      let adjustedEndTime: string
      let isAdjusted = cumulativeShift !== 0

      if (sessionEnd) {
        // This session was ended by admin, use actual end time
        const actualEndMinutes = sessionEnd.actualEndTime.getHours() * 60 + sessionEnd.actualEndTime.getMinutes()
        adjustedEndTime = minutesToDisplayTime(actualEndMinutes)

        // Update cumulative shift for next sessions
        const originalEndMinutes = parseIsoToMinutes(slot.end)
        cumulativeShift = actualEndMinutes - originalEndMinutes
        isAdjusted = true
      } else {
        // Calculate end time with current cumulative shift
        const originalEndMinutes = parseIsoToMinutes(slot.end)
        const adjustedEndMinutes = originalEndMinutes + cumulativeShift
        adjustedEndTime = minutesToDisplayTime(adjustedEndMinutes)
      }

      adjustedSlots.push({
        ...slot,
        title: slot.activity, // Map activity to title for display
        titleTh: slot.activity, // Assuming activity is also the Thai title for now
        adjustedStartTime,
        adjustedEndTime,
        isAdjusted,
      })
    }

    return adjustedSlots
  }

  const getCurrentSlotIndex = (currentTime: Date, sessionEnds: SessionEnd[]): number => {
    if (timeSlots.length === 0) return 0 // Handle empty agenda

    const currentHour = currentTime.getHours()
    const currentMinute = currentTime.getMinutes()
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    // Find the latest ended session
    const sortedEndedSessions = sessionEnds.sort((a, b) => b.actualEndTime.getTime() - a.actualEndTime.getTime())

    if (sortedEndedSessions.length > 0) {
      const latestEndedSession = sortedEndedSessions[0]
      const endedSlotIndex = timeSlots.findIndex((slot) => slot.id === latestEndedSession.slotId)

      // If we found the ended session and there's a next slot, move to next slot
      if (endedSlotIndex !== -1 && endedSlotIndex < timeSlots.length - 1) {
        return endedSlotIndex + 1
      }
    }

    // Original logic for time-based slot detection
    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i]
      const startTimeInMinutes = parseIsoToMinutes(slot.start)
      const endTimeInMinutes = parseIsoToMinutes(slot.end)

      if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
        return i
      }
    }

    if (timeSlots.length > 0 && currentTimeInMinutes < parseIsoToMinutes(timeSlots[0].start)) {
      return 0
    }

    return timeSlots.length > 0 ? timeSlots.length - 1 : 0
  }

//   const getSessionEndInfo = (slotId: string): SessionEnd | undefined => {
//     return sessionEnds.find((se) => se.slotId === slotId)
//   }

//   const formatAPNotation = (difference: number): string => {
//     if (difference > 0) {
//       return `AP+${difference}`
//     } else if (difference < 0) {
//       return `AP${difference}`
//     }
//     return "AP+0"
//   }

  const getLatestAPNotation = (): { notation: string; isLate: boolean } | null => {
    if (sessionEnds.length === 0) return null

    const latestSession = sessionEnds.sort((a, b) => b.actualEndTime.getTime() - a.actualEndTime.getTime())[0]

    const difference = latestSession.difference
    const isLate = difference > 0

    if (difference > 0) {
      return { notation: `AP+${difference}`, isLate: true }
    } else if (difference < 0) {
      return { notation: `AP${difference}`, isLate: false }
    }
    return { notation: "AP+0", isLate: false }
  }

  const calculateSlotProgress = (): { progress: number; startTime: string; endTime: string } => {
    if (timeSlots.length === 0) return { progress: 0, startTime: "--.--", endTime: "--.--" }

    const currentSlot = timeSlots[currentSlotIndex]
    const realTimeAgenda = calculateRealTimeAgenda()
    const currentRealTimeSlot = realTimeAgenda[currentSlotIndex]

    const startTime = showRealTimeAgenda
      ? currentRealTimeSlot.adjustedStartTime
      : minutesToDisplayTime(parseIsoToMinutes(currentSlot.start))
    const endTime = showRealTimeAgenda
      ? currentRealTimeSlot.adjustedEndTime
      : minutesToDisplayTime(parseIsoToMinutes(currentSlot.end))

    const startMinutes = parseIsoToMinutes(
      showRealTimeAgenda ? currentRealTimeSlot.adjustedStartTime : currentSlot.start,
    )
    const endMinutes = parseIsoToMinutes(showRealTimeAgenda ? currentRealTimeSlot.adjustedEndTime : currentSlot.end)
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()

    const totalDuration = endMinutes - startMinutes
    const elapsed = Math.max(0, currentMinutes - startMinutes)
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))

    return { progress, startTime, endTime }
  }


  
  if (timeSlots.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading agenda...</p>
      </div>
    )
  }
  
  const currentSlotIndex = getCurrentSlotIndex(currentTime, sessionEnds)
  const currentSlot = timeSlots[currentSlotIndex]
  const nextSlot = currentSlotIndex < timeSlots.length - 1 ? timeSlots[currentSlotIndex + 1] : null

  const realTimeAgenda = calculateRealTimeAgenda()
  const slotProgress = calculateSlotProgress()

  


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Stupid Hackathon 8</h1>
            <div className="text-sm flex items-center gap-2 mt-2" style={{ color: "#7F56D9" }}>
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{formatTime(currentTime)}</span>
            </div>
          </div>
          <div
            className="w-14 h-14 flex items-center justify-center rounded-xl border-2"
            style={{ backgroundColor: "#7F56D9", borderColor: "#7F56D9" }}
          >
            <QrCode className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Current Slot - Main Focus */}
        <div className="border-2 rounded-xl p-6 mb-6 shadow-lg" style={{ borderColor: "#7F56D9" }}>
          <div className="text-center">
            <div
              className="text-xs font-bold tracking-wider mb-4 px-4 py-2 rounded-full inline-block text-white"
              style={{ backgroundColor: "#7F56D9" }}
            >
              HAPPENING NOW
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{currentSlot.activity}</div>
            <div className="text-base text-gray-600 mb-5 leading-7 tracking-normal">
              {currentSlot.remarks || currentSlot.activity}
            </div>

            {/* AP Notation */}
            {(() => {
              const latestAP = getLatestAPNotation()
              return (
                latestAP && (
                  <div
                    className={`text-sm font-bold mb-5 px-4 py-2 rounded-full inline-block text-white`}
                    style={{
                      backgroundColor: latestAP.isLate ? "#F28B14" : "#10B981",
                    }}
                  >
                    {latestAP.notation}
                  </div>
                )
              )
            })()}

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-semibold text-gray-700 mb-3">
                <span>{slotProgress.startTime}</span>
                <span>{slotProgress.endTime}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${slotProgress.progress}%`,
                    backgroundColor: "#7F56D9",
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center font-medium">
                {Math.round(slotProgress.progress)}% complete
              </div>
            </div>
          </div>
        </div>

        {/* Next Up */}
        {nextSlot && (
          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
            <div className="text-xs font-bold tracking-wider mb-3" style={{ color: "#7F56D9" }}>
              NEXT UP
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">{nextSlot.activity}</div>
            <div className="text-sm text-gray-600 mb-3">{nextSlot.remarks || nextSlot.activity}</div>
            <div
              className="text-sm font-semibold px-3 py-2 rounded-lg inline-block text-white"
              style={{ backgroundColor: "#7F56D9" }}
            >
              {showRealTimeAgenda
                ? `${realTimeAgenda[currentSlotIndex + 1]?.adjustedStartTime} - ${
                    realTimeAgenda[currentSlotIndex + 1]?.adjustedEndTime
                  }`
                : `${minutesToDisplayTime(parseIsoToMinutes(nextSlot.start))} - ${minutesToDisplayTime(parseIsoToMinutes(nextSlot.end))}`}
            </div>
          </div>
        )}

        {/* Schedule Toggle */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <span className={`text-sm font-semibold ${!showRealTimeAgenda ? "text-gray-900" : "text-gray-500"}`}>
            Planned
          </span>
          <Button
            onClick={() => setShowRealTimeAgenda(!showRealTimeAgenda)}
            variant="outline"
            size="sm"
            className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors border-2 p-0"
            style={{
              backgroundColor: showRealTimeAgenda ? "#7F56D9" : "white",
              borderColor: "#7F56D9",
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full transition-transform text-justify ${
                showRealTimeAgenda ? "translate-x-[8px] bg-white" : "translate-x-[-8px]"
              }`}
              style={{
                backgroundColor: showRealTimeAgenda ? "white" : "#7F56D9",
              }}
            />
          </Button>
          <span className={`text-sm font-semibold ${showRealTimeAgenda ? "text-gray-900" : "text-gray-500"}`}>
            Real-time
          </span>
        </div>

        {/* Full Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200" style={{ backgroundColor: "#7F56D9" }}>
            <h3 className="font-bold text-white text-lg">Agenda</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {showRealTimeAgenda
              ? // Real-time agenda view
                realTimeAgenda.map((slot, index) => (
                  <div
                    key={slot.id}
                    className={`p-5 ${index === currentSlotIndex ? "border-l-4 bg-purple-100" : ""}`}
                    style={{
                      borderLeftColor: index === currentSlotIndex ? "#7F56D9" : "transparent",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base mb-1 flex items-center gap-2">
                          {slot.activity}
                          {index === currentSlotIndex && <Flame className="w-4 h-4 text-orange-500" />}
                        </div>
                        <div className="text-sm text-gray-600">{slot.remarks || slot.activity}</div>
                      </div>
                      <div className="ml-4">
                        <div
                          className="text-sm font-semibold px-3 py-2 rounded-lg"
                          style={{
                            backgroundColor: index === currentSlotIndex ? "#7F56D9" : "transparent",
                            color: index === currentSlotIndex ? "white" : "#7F56D9",
                          }}
                        >
                          {slot.adjustedStartTime} - {slot.adjustedEndTime}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : // Planned agenda view (original)
                timeSlots.map((slot, index) => (
                  <div
                    key={slot.id}
                    className={`p-5 ${index === currentSlotIndex ? "border-l-4 bg-purple-100" : ""}`}
                    style={{
                      borderLeftColor: index === currentSlotIndex ? "#7F56D9" : "transparent",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-base mb-1">{slot.activity}</div>
                        <div className="text-sm text-gray-600">{slot.remarks || slot.activity}</div>
                      </div>
                      <div className="ml-4">
                        <div
                          className="text-sm font-semibold px-3 py-2 rounded-lg"
                          style={{
                            backgroundColor: index === currentSlotIndex ? "#7F56D9" : "transparent",
                            color: index === currentSlotIndex ? "white" : "#7F56D9",
                          }}
                        >
                          {minutesToDisplayTime(parseIsoToMinutes(slot.start))} -{" "}
                          {minutesToDisplayTime(parseIsoToMinutes(slot.end))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-8 text-center">
          <a href="/admin" className="text-sm font-medium underline" style={{ color: "#7F56D9" }}>
            Admin Panel
          </a>
        </div>
      </div>
    </div>
  )
}
