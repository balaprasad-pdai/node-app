const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file if present
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
// Read MESSAGE from environment (falls back to 'Hello World!')
const message = process.env.MESSAGE || 'Hello World!';

app.get('/', (req, res) => {
  res.send(message);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} - MESSAGE=${message}`);
});