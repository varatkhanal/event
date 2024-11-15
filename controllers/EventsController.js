const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllEvents = async (req, res) => {
  try {
    // Fetch all events from the database
    const events = await prisma.event.findMany();
    return res.status(200).json({ events });
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming you have stored the user's ID in the session

    // Assuming the required data is sent in the request body
    const { title, description, date, location } = req.body;

    // Validate if required fields are present
    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: 'Incomplete data provided' });
    }

    // Create a new event
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        date,
        location,
        userId: userId, // Connect the event to the user
      },
    });

    return res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getAllEvents, createEvent };
