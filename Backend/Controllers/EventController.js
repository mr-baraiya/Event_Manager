const Event = require("../Models/Event.models");

// Get Event
const getEvent = async (req, res) => {
    try {
        const event = await Event.find();
        if (!event || event.length === 0) {
            return res.status(404).send("Event Not Found");
        }
        res.status(200).json(event); // Use json() for sending response as JSON
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

// Get Event by Name
const getEventByName = async (req, res) => {
    try {
        const event = await Event.findOne({ eventName: req.params.eventName });

        if (!event) {
            return res.status(404).send("Event Not Found");
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

// Create Event
const createEvent = async (req, res) => {
    const { eventName, eventCategory, eventDescription, startDate, endDate, venueName, venueAddress, organizerName, organizerContact, ticketPrice, ticketType, maxAttendees } = req.body;

    if (!eventName || !eventCategory || !eventDescription || !startDate || !endDate || !venueName || !venueAddress || !organizerName || !organizerContact || !ticketPrice || !ticketType || !maxAttendees) {
        return res.status(400).send("All fields are required");
    }

    const event = new Event({ eventName, eventCategory, eventDescription, startDate, endDate, venueName, venueAddress, organizerName, organizerContact, ticketPrice, ticketType, maxAttendees });

    try {
        const savedEvent = await event.save();
        res.status(201).json(savedEvent); // Send 201 for successful creation
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Update Event
const updateEvent = async (req, res) => {
    try {
        const findEvent = await Event.findOne({ eventName: req.params.eventName });

        if (!findEvent) {
            return res.status(404).send('No Event found with that Name');
        }

        // Use findByIdAndUpdate for better update handling
        const upEvent = await Event.findOneAndUpdate(
            { eventName: req.params.eventName }, 
            { $set: req.body },
            { new: true } // Return the updated document
        );
        
        res.status(200).json({ message: "Event Updated Successfully", event: upEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Delete Event
const deleteEvent = async (req, res) => {
    try {
        const findEvent = await Event.findOneAndDelete({ eventName: req.params.eventName });
        if (!findEvent) {
            return res.status(404).send('No Event found with that Name');
        }

        res.status(200).json({ message: "Event Deleted Successfully", event: findEvent });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { getEvent, getEventByName, createEvent, updateEvent, deleteEvent };