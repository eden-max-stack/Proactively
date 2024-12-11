const db = require('../config/db');  // Assuming your DB connection setup is here
const nodemailer = require("nodemailer");

// Function to get bookings for the current date
const getBookings = async (req, res) => {
  try {
    // Query to get bookings for today's date
    const query = `SELECT speaker_id, session_time FROM bookings WHERE booking_date = CURDATE()`;
    const [rows] = await db.execute(query);  // Execute the query
    
    // Format the bookings into a speaker_id to session_time mapping
    const bookings = rows.reduce((acc, booking) => {
      acc[booking.speaker_id] = acc[booking.speaker_id] || [];
      acc[booking.speaker_id].push(booking.session_time);
      return acc;
    }, {});

    // Send the response with the formatted bookings
    res.json(bookings);
  } catch (error) {
    // Catch any errors and log them
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};
const bookSession = async (req, res) => {
    const { speakerId, sessionTime } = req.body;
    const userId = req.user; // Assuming user ID is available from authentication

    // Check if the speakerId exists in the speaker_profiles table
    const checkSpeakerQuery = `SELECT * FROM speaker_profiles WHERE user_id = ?`;
    const [checkSpeakerResult] = await db.execute(checkSpeakerQuery, [speakerId]);

    if (checkSpeakerResult.length === 0) {
        return res.status(400).json({ message: 'Invalid speaker ID' });
    }

    // Check if the session is already booked
    const existingBookingQuery = `SELECT * FROM bookings WHERE speaker_id = ? AND session_time = ? AND booking_date = CURDATE()`;
    const [existingBooking] = await db.execute(existingBookingQuery, [speakerId, sessionTime]);

    if (existingBooking.length > 0) {
        return res.status(400).json({ message: 'Session already booked' });
    }

    // Add new booking
    const bookingQuery = `INSERT INTO bookings (user_id, speaker_id, session_time, booking_date) VALUES (?, ?, ?, CURDATE())`;
    console.log(userId, speakerId, sessionTime);
    await db.execute(bookingQuery, [userId, speakerId, sessionTime]);

    // fetching email ID to send emails regarding booked sessions
    const userEmailQuery = `SELECT email FROM users WHERE username = "${userId}"`;
    const speakerEmailQuery = `SELECT email FROM users WHERE username = "${speakerId}"`;

    var userEmail = await db.execute(userEmailQuery);
    userEmail = userEmail[0][0].email;
    console.log(userEmail);
    var speakerEmail = await db.execute(speakerEmailQuery);
    speakerEmail = speakerEmail[0][0].email;
    console.log(speakerEmail);

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'marshall30@ethereal.email',
          pass: '3QsaNNFqU8SS8vCspM'
      }
  });

    const info = await transporter.sendMail({
      from: '"Marshall Carroll 👻" <marshall30@ethereal.email>', // sender address
      to: `${userEmail}, ${speakerEmail}`, // list of receivers
      subject: "Hello. your session is booked", // Subject line
      text: "Hello world?", 
    });

    console.log("Message sent: %s", info.messageId); // email sent to user and speaker

    res.json({ message: 'Booking successful' });
};

module.exports = {
  getBookings,
  bookSession
};
