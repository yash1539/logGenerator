CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  unix_ts BIGINT,
  user_id INT,
  event_name VARCHAR(255)
);