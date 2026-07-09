const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(` RAILWAY RESERVATION SYSTEM API SERVER STARTED             `);
  console.log(` Running on port: ${PORT}                                   `);
  console.log(` Base URL: http://localhost:${PORT}/api                    `);
  console.log(`==========================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`[Unhandled Rejection] Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
