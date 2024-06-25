const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const { v4: uuidv4 } = require('uuid');
const axiosRetry = require('axios-retry').default;
const axios = require('axios');
const {getPaymentAxios,getPaymentByMeetingId} = require('../payment/payment.service');
// Generate a UUID
const uniqueId = uuidv4();

// Google Calendar API configuration
const CLIENT_ID = process.env.MEET_CLIENT_ID;
const CLIENT_SECRET =process.env.MEET_CLIENT_SECRET;
const AUTH_REFRESH_TOKEN = process.env.MEET_AUTH_REFRESH_TOKEN
// Get client's timezone
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Create OAuth2 client
const oAuthClient = new OAuth2(CLIENT_ID, CLIENT_SECRET);
oAuthClient.setCredentials({ refresh_token: AUTH_REFRESH_TOKEN });

// Configure axios to retry requests
axiosRetry(axios, {
  retries: 3, // Number of retry attempts
  retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000, // Exponential backoff retry delay
});

// Create Calendar API instance
const calendar = google.calendar({ version: 'v3', auth: oAuthClient });

async function createMeetingEvent(eventData) {
  try {
    const event = {
      summary: eventData.summary,
      description: 'Meeting created with Google Calendar API and Google Meet',
      start: {
        dateTime: eventData.startTime,
        timeZone: timeZone,
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: timeZone,
      },
      conferenceData: {
        createRequest: { requestId: uniqueId },
      },
      attendees: eventData.attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 }, // Email reminder 1 hour before
          { method: 'popup', minutes: 10 }, // Popup reminder 10 minutes before
        ],
      },
    };

    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendNotifications: true, // Send notifications to attendees
    });

    console.log('Event created:', createdEvent.data);

    const meetingLink = createdEvent.data.hangoutLink;
    const eventId = createdEvent.data.id; // Capture the event ID
    if (!meetingLink) {
      console.error('Meeting link not available');
      throw new Error('Meeting link not available');
    }

    // Set timeout for 1 hour before meeting start time
    const startTime = new Date(eventData.startTime).getTime();
    const oneHourBefore = startTime - 3600000; // 1 hour in milliseconds
    const now = Date.now();
    const delay = oneHourBefore - now;

    if (delay > 0) {
      setTimeout(async () => {
        const eventtId = [eventId]
        const paymentConfirmed = await getPaymentByMeetingId(eventtId);
        if (!paymentConfirmed.status) {
          await deleteMeetingEvent(eventId);
          console.log('Meeting canceled due to payment status.');
        } else {  
          console.log('Payment confirmed. Meeting will proceed.');
        }
      }, delay);
    }

    // Return event data, meeting link, and event ID
    return { event: createdEvent.data, meetingLink: meetingLink, eventId: eventId };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}


async function deleteMeetingEvent(eventId) {
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all' // This ensures notifications are sent to attendees
    });

    console.log('Event deleted:', eventId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

module.exports = { createMeetingEvent, deleteMeetingEvent };
