require('dotenv').config();

const http = require('http');

const app = require('./src/app');
const { initializeSocket } = require('./src/config/socket');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});