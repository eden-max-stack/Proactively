const db = require('../config/db'); // Assuming your DB connection setup is here
const nodemailer = require('nodemailer');
const getCalendarClient = require('../index');

// Function to get bookings for the current date
const getBookings = async (req, res) => {
  try {
    const query = `SELECT speaker_id, session_time FROM bookings WHERE booking_date = CURDATE()`;
    const [rows] = await db.execute(query);

    const bookings = rows.reduce((acc, booking) => {
      acc[booking.speaker_id] = acc[booking.speaker_id] || [];
      acc[booking.speaker_id].push(booking.session_time);
      return acc;
    }, {});

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

const bookSession = async (req, res) => {
  try {
    const { speakerId, sessionTime } = req.body;
    const userId = req.user; // Assuming user ID is available from authentication

    // Check if the speaker ID exists in the speaker_profiles table
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
    await db.execute(bookingQuery, [userId, speakerId, sessionTime]);

    // Fetch email IDs for notification
    const userQuery = `SELECT email FROM users WHERE username = ?`;
    const [userResult] = await db.execute(userQuery, [userId]);
    const [speakerResult] = await db.execute(userQuery, [speakerId]);

    const userEmail = userResult[0]?.email;
    const speakerEmail = speakerResult[0]?.email;

    if (!userEmail || !speakerEmail) {
      return res.status(400).json({ message: 'Unable to fetch email addresses for notification' });
    }

    // Send email notifications
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'marshall30@ethereal.email',
        pass: '3QsaNNFqU8SS8vCspM',
      },
    });

    const sessionDate = new Date().toISOString().slice(0, 10);

    const emailInfo = await transporter.sendMail({
      from: '"Proactively" <marshall30@ethereal.email>',
      to: `${userEmail}, ${speakerEmail}`,
      subject: 'Session Booking Confirmation',
      text: `Hello,

Your speaker session has been successfully booked.

Details:
- Speaker ID: ${speakerId}
- Session Time: ${sessionTime} HRS
- Date: ${sessionDate}

Please check your Google Calendar for more details.`,
    });

    console.log('Email sent: %s', emailInfo.messageId);

    // Send Google Calendar invite
    const { calendar, auth } = await getCalendarClient();
    const startDateTime = setHourInISOString(new Date().toISOString(), sessionTime.slice(0, 2));
    const endDateTime = setHourInISOString(new Date().toISOString(), parseInt(sessionTime.slice(0, 2)) + 1);

    const session = {
      summary: `Speaker session with ${speakerId}`,
      start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
      end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' },
      attendees: [
        { email: userEmail },
        { email: speakerEmail },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    calendar.events.insert({
      auth,
      calendarId: 'primary',
      resource: session,
    }, (err, event) => {
      if (err) {
        console.error('Error creating calendar event:', err);
        return res.status(500).json({ message: 'Error creating calendar event', error: err.message });
      }
      console.log('Event created: %s', event.htmlLink);
      res.json({ message: 'Booking successful', calendarLink: event.htmlLink });
    });
  } catch (error) {
    console.error('Error booking session:', error);
    res.status(500).json({ message: 'Error booking session', error: error.message });
  }
};

function setHourInISOString(dateISOString, newHour) {
  const date = new Date(dateISOString);
  date.setHours(newHour, 0, 0, 0);
  return date.toISOString();
}

module.exports = {
  getBookings,
  bookSession,
};
