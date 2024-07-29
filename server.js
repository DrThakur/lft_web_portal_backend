const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const connectDB= require('./Config/db');


process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception occured! Shutting down...");
  process.exit(1);
});


const app = require('./app');


// connect to Database
connectDB();



const port = process.env.PORT || 8002;

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("Unhandled rejection occured! Shutting down...");
  
    server.close(() => {
      process.exit(1);
    });
  });
  
// Connect to the database
// connectDB().then(() => {
//     // Start the server only after a successful database connection
//     app.listen(port, () => {
//         console.log(`Server is running on http://localhost:${port}`);
//     });
// }).catch((err) => {
//     console.error('Failed to connect to the database:', err);
// });