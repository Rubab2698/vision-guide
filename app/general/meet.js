const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const { v4: uuidv4 } = require('uuid');
const axiosRetry = require('axios-retry').default;
const axios = require('axios');

// Generate a UUID
const uniqueId = uuidv4();
console.log('Unique ID:', uniqueId);

// Google Calendar API configuration
const CLIENT_ID = "749622528930-0l81q4glvi55pt7ptnav9ceharne7h6l.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const AUTH_REFRESH_TOKEN = "1//041UFAzS85JgDCgYIARAAGAQSNwF-L9IrvyPhGLBrnkhbbnDqWM7Vco6NVGzsPNgJ_fizcFV4hP6xS8pt51P5LhW3jg229DofOCc";

// Get client's timezone
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Create OAuth2 client
const oAuthClient = new OAuth2(CLIENT_ID, CLIENT_SECRET);
oAuthClient.setCredentials({ refresh_token: AUTH_REFRESH_TOKEN });

function exponentialBackoffDelay(retryNumber) {
  const delay = Math.pow(2, retryNumber) * 1000; // Exponential backoff formula
  return delay;
}

// Configure axios to retry requests
axiosRetry(axios, {
  retries: 3, // Number of retry attempts
  retryDelay: exponentialBackoffDelay, // Exponential backoff retry delay
});

// Create Calendar API instance
const calendar = google.calendar({ version: 'v3', auth: oAuthClient });

async function sendMeetingLink(eventId, attendees) {
  try {
    const createdEvent = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });

    const meetingLink = createdEvent.data.hangoutLink;

    if (!meetingLink) {
      console.error('Meeting link not available');
      return;
    }

    const promises = attendees.map(async (attendee) => {
      await calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        sendNotifications: true,
        resource: {
          attendees: [{ email: attendee.email, displayName: attendee.displayName }],
          sendUpdates: 'all',
          notifications: [{
            type: 'email',
            method: 'email',
            attendees: [{ email: attendee.email, displayName: attendee.displayName }],
            sendUpdates: 'all',
          }],
        },
      });
      console.log(`Meeting link sent to ${attendee.email}`);
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error sending meeting link:', error);
    throw error;
  }
}

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
      };
  
      const createdEvent = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendNotifications: true, // Send notifications to attendees
      });
  
      console.log('Event created:', createdEvent.data);
  
      const meetingLink = createdEvent.data.hangoutLink;
      if (!meetingLink) {
        console.error('Meeting link not available');
        throw new Error('Meeting link not available');
      }
  
      await sendMeetingLink(createdEvent.data.id, eventData.attendees);
  
      // Return both event data and meeting link
      return { event: createdEvent.data, meetingLink: meetingLink };
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }
  
  module.exports = createMeetingEvent;
  
