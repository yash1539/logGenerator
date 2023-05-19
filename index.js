const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'your-db-user',
  host: 'your-db-host',
  database: 'your-db-name',
  password: 'your-db-password',
  port: 5432, // default PostgreSQL port
});

// Buffer to store logs before flushing to the database
let logBuffer = [];

// Write logs to file and flush to the database periodically
setInterval(() => {
  if (logBuffer.length > 0) {
    const logs = logBuffer.splice(0, logBuffer.length); // Flush logs from buffer
    fs.appendFile('logs.txt', JSON.stringify(logs) + '\n', (err) => {
      if (err) {
        console.error('Error writing logs to file:', err);
      }
    });
    insertLogsToDatabase(logs); // Insert logs to the database
  }
}, 30000); // Flush logs every 30 seconds

// Function to insert logs to the database
async function insertLogsToDatabase(logs) {
  try {
    const client = await pool.connect();
    const insertQuery = `INSERT INTO logs (id, unix_ts, user_id, event_name) VALUES ($1, $2, $3, $4)`;
    for (const log of logs) {
      await client.query(insertQuery, [log.id, log.unix_ts, log.user_id, log.event_name]);
    }
    client.release();
  } catch (err) {
    console.error('Error inserting logs to the database:', err);
  }
}

app.use(express.json());

// HTTP endpoint to receive logs
app.post('/log', (req, res) => {
  const log = req.body;
  logBuffer.push(log);
  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Log routing service listening at http://localhost:${port}`);
});