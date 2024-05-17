// Specify necessary libraries and imports
require('dotenv').config()
const mongoose = require('mongoose')

// Connect to Database: MongoDB with promises
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB connection Successful'))
.catch((error)=>console.log(`There is an error in connecting to the database ${error}`))

// Define the Schema for the database - Admin, User and Course

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    purchasedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, { timestamps: true })

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageLink: String,
    price: Number
}, { timestamps: true })

// Create model with the above Schema - Admin, User and Course

const Admin = mongoose.model('Admin', AdminSchema)
const User = mongoose.model('User', UserSchema)
const Course = mongoose.model('Course', CourseSchema)

// Export the created database models to be used for the Backend
module.exports = {
    Admin,
    User,
    Course
}