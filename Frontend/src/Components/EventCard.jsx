import React, { useCallback } from "react";
import Swal from "sweetalert2";

// Props: events: Array of event objects
// Expected event shape (flexible):
// { eventName, eventDescription, eventCategory, ticketPrice, ticketType,
//   startDate, venueName, organizerName, maxAttendees }
const EventCard = ({ events = [] }) => {
  const handleBookEvent = useCallback((event) => {
    Swal.fire({
      icon: "success",
      title: "Ticket booked",
      text: `Booked ticket for ${event?.eventName || "Event"}`,
      timer: 1500,
      showConfirmButton: false,
    });
  }, []);

  const handleShare = useCallback(async (event) => {
    const shareText = `Check out this event: ${event?.eventName || "Event"}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: event?.eventName || "Event", text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        Swal.fire({ icon: "info", title: "Copied", text: "Share text copied to clipboard" });
      }
    } catch (_) {}
  }, []);

  const handleDownloadImage = useCallback(async (id) => {
    // Placeholder implementation; real DOM capture removed for stability
    Swal.fire({ icon: "info", title: "Download", text: "PNG download is not implemented in this stub." });
  }, []);

  const handleDownloadPDF = useCallback(async (event) => {
    // Placeholder implementation; real PDF generation removed for stability
    Swal.fire({ icon: "info", title: "Download", text: "PDF download is not implemented in this stub." });
  }, []);

  const handleDeleteEvent = useCallback(async (eventName) => {
    const res = await Swal.fire({
      icon: "warning",
      title: "Delete event?",
      text: `Are you sure you want to delete ${eventName}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (res.isConfirmed) {
      Swal.fire({ icon: "success", title: "Deleted", text: `${eventName} removed` });
    }
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Events</h2>
      {events.length === 0 ? (
        <p className="text-gray-300">No events to display.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <div key={idx} className="bg-gray-900/60 rounded-2xl border border-gray-800 p-6 shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-900/30 rounded-full mb-2">
                    {event.eventCategory || "General"}
                  </span>
                  <h3 className="text-xl font-bold text-white">{event.eventName || "Untitled Event"}</h3>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    ${event.ticketPrice ?? 0}
                  </div>
                  <div className="text-xs text-gray-400">{event.ticketType || "Ticket"}</div>
                </div>
              </div>

              <p className="text-gray-400 mb-4 line-clamp-3">{event.eventDescription || "No description"}</p>

              <div className="space-y-2 text-gray-300 text-sm mb-6">
                <div>📅 {event.startDate ? new Date(event.startDate).toLocaleString() : "TBA"}</div>
                <div>📍 {event.venueName || "Venue"}</div>
                <div>👤 {event.organizerName || "Organizer"}</div>
                <div>👥 {event.maxAttendees ?? "—"} attendees max</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleBookEvent(event)} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white">Book</button>
                <button onClick={() => handleShare(event)} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white">Share</button>
                <button onClick={() => handleDownloadImage(idx)} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white">PNG</button>
                <button onClick={() => handleDownloadPDF(event)} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white">PDF</button>
              </div>

              <button
                onClick={() => handleDeleteEvent(event.eventName || "Event")}
                className="mt-3 w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/30"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCard;
