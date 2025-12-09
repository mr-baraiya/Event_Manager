import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sweet from 'sweetalert2';

const EventForm = () => {
    const [data, setData] = useState({
        eventId: "",
        eventName: "",
        eventCategory: "",
        eventDescription: "",
        startDate: "",
        endDate: "",
        venueName: "",
        venueAddress: "",
        organizerName: "",
        organizerContact: "",
        ticketPrice: "",
        ticketType: "",
        maxAttendees: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        // Event name validation
        if (!data.eventName.trim()) {
            newErrors.eventName = "Event name is required";
        } else if (data.eventName.length < 3) {
            newErrors.eventName = "Event name must be at least 3 characters";
        }
        
        // Category validation
        if (!data.eventCategory) {
            newErrors.eventCategory = "Please select a category";
        }
        
        // Description validation
        if (!data.eventDescription.trim()) {
            newErrors.eventDescription = "Description is required";
        } else if (data.eventDescription.length < 10) {
            newErrors.eventDescription = "Description must be at least 10 characters";
        }
        
        // Date validation
        if (!data.startDate) {
            newErrors.startDate = "Start date is required";
        }
        
        if (!data.endDate) {
            newErrors.endDate = "End date is required";
        }
        
        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            
            if (start > end) {
                newErrors.endDate = "End date must be after start date";
            }
        }
        
        // Venue validation
        if (!data.venueName.trim()) {
            newErrors.venueName = "Venue name is required";
        }
        
        if (!data.venueAddress.trim()) {
            newErrors.venueAddress = "Venue address is required";
        }
        
        // Organizer validation
        if (!data.organizerName.trim()) {
            newErrors.organizerName = "Organizer name is required";
        }
        
        if (!data.organizerContact.trim()) {
            newErrors.organizerContact = "Organizer contact is required";
        }
        
        // Ticket validation
        if (data.ticketPrice === "" || isNaN(data.ticketPrice)) {
            newErrors.ticketPrice = "Valid ticket price is required";
        } else if (parseFloat(data.ticketPrice) < 0) {
            newErrors.ticketPrice = "Ticket price cannot be negative";
        }
        
        if (!data.ticketType) {
            newErrors.ticketType = "Please select a ticket type";
        }
        
        if (data.maxAttendees === "" || isNaN(data.maxAttendees)) {
            newErrors.maxAttendees = "Valid number of attendees is required";
        } else if (parseInt(data.maxAttendees) <= 0) {
            newErrors.maxAttendees = "Maximum attendees must be greater than 0";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            Sweet.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please correct the errors in the form',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
            return;
        }
        
        setIsLoading(true);

        try {
            // Prepare data with proper numeric types
            const requestData = {
                ...data,
                ticketPrice: typeof data.ticketPrice === 'string' ? parseFloat(data.ticketPrice) : data.ticketPrice,
                maxAttendees: typeof data.maxAttendees === 'string' ? parseInt(data.maxAttendees) : data.maxAttendees
            };

            // Use the actual backend API instead of localStorage
            const api_url = "http://localhost:7120/event/addEvent";
            const response = await fetch(api_url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const result = await response.json();
                
                Sweet.fire({
                    icon: 'success',
                    title: 'Event Created!',
                    text: 'Your event has been successfully published to the public feed.',
                    background: '#1f2937',
                    color: '#fff',
                    confirmButtonColor: '#4f46e5'
                });
                navigate('/eventCard'); // Redirect to All Events page to see it
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create event');
            }
            
        } catch (e) {
            console.error(e);
            Sweet.fire({
                icon: 'error',
                title: 'Error',
                text: e.message || 'Something went wrong. Please try again later.',
                background: '#1f2937',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Convert numeric fields to numbers
        let finalValue = value;
        if (name === 'ticketPrice') {
            // Allow decimal numbers for ticket price
            finalValue = value;
        } else if (name === 'maxAttendees') {
            // Allow only integers for max attendees
            finalValue = value;
        }
        
        setData(prev => ({ ...prev, [name]: finalValue }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200";
    const errorInputClasses = "w-full px-4 py-3 bg-gray-800/50 border border-red-500 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";
    const errorLabelClasses = "block text-sm font-medium text-red-400 mb-2";
    const errorMessageClasses = "text-red-400 text-sm mt-1";
    const sectionTitleClasses = "text-xl font-bold text-white border-b border-gray-700 pb-2 mb-6 mt-8 first:mt-0";

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                            Create Your Event
                        </h2>
                        <p className="text-gray-400">Fill in the details below to publish your event to the world.</p>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-6">
                        {/* Event Details */}
                        <div>
                            <h3 className={sectionTitleClasses}>Event Details</h3>
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <div>
                                    <label className={errors.eventName ? errorLabelClasses : labelClasses}>Event Name</label>
                                    <input
                                        type="text"
                                        name="eventName"
                                        className={errors.eventName ? errorInputClasses : inputClasses}
                                        placeholder="e.g. Tech Conference 2024"
                                        value={data.eventName}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.eventName && <p className={errorMessageClasses}>{errors.eventName}</p>}
                                </div>
                                <div>
                                    <label className={errors.eventCategory ? errorLabelClasses : labelClasses}>Category</label>
                                    <select
                                        name="eventCategory"
                                        className={errors.eventCategory ? errorInputClasses : inputClasses}
                                        value={data.eventCategory}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" className="bg-gray-800">Select Category</option>
                                        <option value="Webinar" className="bg-gray-800">Webinar</option>
                                        <option value="Workshop" className="bg-gray-800">Workshop</option>
                                        <option value="Conference" className="bg-gray-800">Conference</option>
                                        <option value="Social Event" className="bg-gray-800">Social Event</option>
                                        <option value="Concert" className="bg-gray-800">Concert</option>
                                    </select>
                                    {errors.eventCategory && <p className={errorMessageClasses}>{errors.eventCategory}</p>}
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className={errors.eventDescription ? errorLabelClasses : labelClasses}>Description</label>
                                    <textarea
                                        name="eventDescription"
                                        className={`${errors.eventDescription ? errorInputClasses : inputClasses} resize-none`}
                                        placeholder="Tell people what your event is about..."
                                        rows="4"
                                        value={data.eventDescription}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    {errors.eventDescription && <p className={errorMessageClasses}>{errors.eventDescription}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Date and Time */}
                        <div>
                            <h3 className={sectionTitleClasses}>Date & Time</h3>
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <div>
                                    <label className={errors.startDate ? errorLabelClasses : labelClasses}>Start Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        className={errors.startDate ? errorInputClasses : inputClasses}
                                        value={data.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.startDate && <p className={errorMessageClasses}>{errors.startDate}</p>}
                                </div>
                                <div>
                                    <label className={errors.endDate ? errorLabelClasses : labelClasses}>End Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        className={errors.endDate ? errorInputClasses : inputClasses}
                                        value={data.endDate}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.endDate && <p className={errorMessageClasses}>{errors.endDate}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h3 className={sectionTitleClasses}>Location</h3>
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <div>
                                    <label className={errors.venueName ? errorLabelClasses : labelClasses}>Venue Name</label>
                                    <input
                                        type="text"
                                        name="venueName"
                                        className={errors.venueName ? errorInputClasses : inputClasses}
                                        placeholder="e.g. Grand Hall"
                                        value={data.venueName}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.venueName && <p className={errorMessageClasses}>{errors.venueName}</p>}
                                </div>
                                <div>
                                    <label className={errors.venueAddress ? errorLabelClasses : labelClasses}>Address</label>
                                    <input
                                        type="text"
                                        name="venueAddress"
                                        className={errors.venueAddress ? errorInputClasses : inputClasses}
                                        placeholder="e.g. 123 Main St, City"
                                        value={data.venueAddress}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.venueAddress && <p className={errorMessageClasses}>{errors.venueAddress}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Organizer Details */}
                        <div>
                            <h3 className={sectionTitleClasses}>Organizer</h3>
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                                <div>
                                    <label className={errors.organizerName ? errorLabelClasses : labelClasses}>Organizer Name</label>
                                    <input
                                        type="text"
                                        name="organizerName"
                                        className={errors.organizerName ? errorInputClasses : inputClasses}
                                        placeholder="Your Name or Organization"
                                        value={data.organizerName}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.organizerName && <p className={errorMessageClasses}>{errors.organizerName}</p>}
                                </div>
                                <div>
                                    <label className={errors.organizerContact ? errorLabelClasses : labelClasses}>Contact Email/Phone</label>
                                    <input
                                        type="text"
                                        name="organizerContact"
                                        className={errors.organizerContact ? errorInputClasses : inputClasses}
                                        placeholder="contact@example.com"
                                        value={data.organizerContact}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.organizerContact && <p className={errorMessageClasses}>{errors.organizerContact}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Ticketing */}
                        <div>
                            <h3 className={sectionTitleClasses}>Ticketing</h3>
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                                <div>
                                    <label className={errors.ticketPrice ? errorLabelClasses : labelClasses}>Price ($)</label>
                                    <input
                                        type="number"
                                        name="ticketPrice"
                                        className={errors.ticketPrice ? errorInputClasses : inputClasses}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={data.ticketPrice}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.ticketPrice && <p className={errorMessageClasses}>{errors.ticketPrice}</p>}
                                </div>
                                <div>
                                    <label className={errors.ticketType ? errorLabelClasses : labelClasses}>Ticket Type</label>
                                    <select
                                        name="ticketType"
                                        className={errors.ticketType ? errorInputClasses : inputClasses}
                                        value={data.ticketType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" className="bg-gray-800">Select Type</option>
                                        <option value="Free" className="bg-gray-800">Free</option>
                                        <option value="Paid" className="bg-gray-800">Paid</option>
                                        <option value="Donation" className="bg-gray-800">Donation</option>
                                    </select>
                                    {errors.ticketType && <p className={errorMessageClasses}>{errors.ticketType}</p>}
                                </div>
                                <div>
                                    <label className={errors.maxAttendees ? errorLabelClasses : labelClasses}>Max Attendees</label>
                                    <input
                                        type="number"
                                        name="maxAttendees"
                                        className={errors.maxAttendees ? errorInputClasses : inputClasses}
                                        placeholder="e.g. 100"
                                        min="1"
                                        value={data.maxAttendees}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.maxAttendees && <p className={errorMessageClasses}>{errors.maxAttendees}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-4 px-6 border border-transparent text-lg font-bold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 shadow-lg hover:shadow-indigo-500/30 ${isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Event...
                                    </span>
                                ) : (
                                    'Publish Event'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EventForm;