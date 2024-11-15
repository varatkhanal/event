const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Inside your booking controller
const createBooking = async (req, res) => {
    try {
      const {eventId, event } = req.body;
      let userId = req.session.userId;
      
      let savedEvent;
      // Check if user exists
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Check if event ID is provided
      if (eventId) {
        // If event ID is provided, check if the event exists
        savedEvent = await prisma.event.findUnique({ where: { id: eventId } });
        if (!savedEvent) {
          return res.status(404).json({ error: 'Event not found' });
        }
      } else if (event) {
        let { title, description, date, location} =event;
        // If custom event details are provided, create a new event
        savedEvent = await prisma.event.create({
            data: {
                title,
                description,
                date,
                location,
                userId:userId, // Connect the event to the user
              },
        });
      } else {
        return res.status(400).json({ error: 'Please provide either an event ID or custom event details' });
      }

      // Create new booking
      const booking = await prisma.booking.create({
        data: {
          eventId: savedEvent.id,
          userId,
          isConfirmed: false,
          // Add other fields as needed
        },
      });
  
      return res.status(201).json(booking);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
}
const getAllBooking = async(req, res) => {
    try {
        // Retrieve all bookings
        const allBookings = await prisma.booking.findMany();
        return res.status(200).json(allBookings);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {createBooking,getAllBooking};