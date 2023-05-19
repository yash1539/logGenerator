const axios = require('axios');

const log = {
  id: 1234,
  unix_ts: Math.floor(Date.now() / 1000),
  user_id: 123456,
  event_name: 'login', // or 'logout'
};

async function sendLogs() {
  try {
    await axios.post('http://log-routing-service:3000/log', log);
    console.log('Log sent successfully');
  } catch (error) {
    console.error('Error sending log:', error.message);
  }
}

// Send logs every 100 milliseconds
setInterval(sendLogs, 100);