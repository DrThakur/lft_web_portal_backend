const mongoose =require('mongoose');


// MongoDB Connection
// mongoose.connect('mongodb+srv://drankitkumarthakur:AUQznVx6j6ZOrWj0@lftbackend.ouuqvr6.mongodb.net/?retryWrites=true&w=majority&appName=lftBackend');

// const db = mongoose.connection;
// db.on('error',console.error.bind(console, 'connection error:'));
// db.once('open',()=> {
//     console.log('COnnected to MongoDB');
// });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;