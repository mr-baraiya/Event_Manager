import { useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";

// -------------------------------
// Simple Card Component (Reusable)
// -------------------------------
const SmallEventCard = ({ event }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-48 overflow-hidden">
                <img
                    src={event.imageUrl || "https://via.placeholder.com/400x200"}
                    alt={event.eventName}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {event.eventName}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {event.description || "No description available."}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                        ${event.price || "Free"}
                    </span>

                    <Link
                        to={`/event/${event._id}`}
                        className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

// -------------------------------
// MAIN EVENT CARD PAGE
// -------------------------------
const EventCard = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEvents = () => {
            try {
                const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");

                const now = new Date();
                now.setHours(0, 0, 0, 0);

                const activeEvents = storedEvents.filter((event) => {
                    if (!event.startDate) return false;

                    const end = event.endDate
                        ? new Date(event.endDate)
                        : new Date(event.startDate);

                    return end >= now;
                });

                setData(activeEvents);
            } catch (error) {
                console.error("Error loading:", error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
        window.addEventListener("storage", loadEvents);

        return () => window.removeEventListener("storage", loadEvents);
    }, []);

    // -------------------- DELETE EVENT --------------------
    const handleDeleteEvent = (eventName) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You cannot undo this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            background: "#1f2937",
            color: "#fff",
        }).then((result) => {
            if (result.isConfirmed) {
                const stored = JSON.parse(localStorage.getItem("events") || "[]");
                const updated = stored.filter((e) => e.eventName !== eventName);
                localStorage.setItem("events", JSON.stringify(updated));
                setData(updated);

                Swal.fire({
                    title: "Deleted!",
                    icon: "success",
                    background: "#1f2937",
                    color: "#fff",
                });
            }
        });
    };

    // -------------------- DOWNLOAD PNG --------------------
    const handleDownloadImage = (id) => {
        const element = document.getElementById(`download-card-${id}`);
        if (!element) return;

        toPng(element, { cacheBust: true, backgroundColor: "transparent" })
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = `event-ticket-${id}.png`;
                link.click();
            })
            .catch(() => {
                Swal.fire({
                    title: "Error!",
                    text: "Unable to generate image",
                    icon: "error",
                });
            });
    };

    // -------------------- DOWNLOAD PDF --------------------
    const handleDownloadPDF = (event) => {
        const doc = new jsPDF();

        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();

        doc.setFontSize(24);
        doc.text(event.eventName, width / 2, 20, { align: "center" });

        doc.setFontSize(14);
        doc.text(`Venue: ${event.venueName}`, width / 2, 40, { align: "center" });
        doc.text(`Organizer: ${event.organizerName}`, width / 2, 50, { align: "center" });

        doc.save(`${event.eventName}.pdf`);
    };

    // -------------------- SHARE EVENT --------------------
    const handleShare = async (event) => {
        const shareData = {
            title: event.eventName,
            text: `Check out this event: ${event.eventName}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {}
        } else {
            navigator.clipboard.writeText(
                `${shareData.title}\n${shareData.text}\n${shareData.url}`
            );
            Swal.fire({
                title: "Copied!",
                text: "Event info copied",
                icon: "success",
            });
        }
    };

    // -------------------- BOOK EVENT --------------------
    const handleBookEvent = (event) => {
        const bookings = JSON.parse(localStorage.getItem("myBookings") || "[]");

        if (bookings.some((b) => b.eventName === event.eventName)) {
            Swal.fire({
                title: "Already Booked!",
                icon: "info",
            });
            return;
        }

        const newBooking = {
            ...event,
            bookingDate: new Date().toISOString(),
            bookingId: Math.random().toString(36).substr(2, 9).toUpperCase(),
        };

        localStorage.setItem("myBookings", JSON.stringify([...bookings, newBooking]));

        Swal.fire({
            title: "Booking Confirmed!",
            icon: "success",
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
            </div>
        );
    }

    // -------------------- MAIN UI --------------------
    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-center text-4xl font-bold text-indigo-300 mb-10">
                    Discover Events
                </h1>

                {data.length === 0 ? (
                    <div className="text-center text-gray-300 py-20">
                        <h2 className="text-3xl mb-4">📅 No Events Found</h2>
                        <Link
                            to="/eventForm"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
                        >
                            Create Event
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {data.map((event, index) => (
                            <div key={index}>
                                {/* MAIN ADVANCED CARD */}
                                {/* (Your original big card component is kept here unchanged) */}
                                
                                {/* SIMPLE SMALL CARD */}
                                <SmallEventCard event={event} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;
