require('dotenv').config
const { adminMiddleware } = require('../middleware/admin')
const { Router } = require('express')
const adminRouter = Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Admin, Course } = require('../db')

adminRouter.post('/signup', async (req, res)=>{
    const {username, password} = req.body

    if(!username || !password) return res.status(400).json({
        message: "Empty credentials, Please send valid credentials for signup"
    })

    try{
        const hashedPassword = await bcrypt.hash(password, 10)
    
        await Admin.create({
            username,
            password: hashedPassword
        })

        res.status(200).json({
            message: "Admin added Succesfully"
        })
    }
    catch(e){
        res.status(400).json({
            message: "There is an error adding Admin credentials to the database",
            error: e
        })
    }
})

adminRouter.post('/login', async (req, res)=>{
    const {username, password} = req.body

    if(!username || !password) return res.status(400).json({
        message: "Empty credentials, Please send valid credentials for login"
    })

    try{
        const admin = await Admin.findOne({ username: username })

        if(!admin) return res.status(404).json({
            message: 'No such Admin exists in the database'
        })

        const exist = await bcrypt.compare(password, admin.password)

        if(!exist) return res.status(401).json({
            message: 'Wrong Password for the Admin login'
        })

        const token = jwt.sign({username : username}, process.env.SECRET_ACCESS_KEY)

        res.status(200).json({
            message: "Admin added Succesfully",
            token: token
        })
    }
    catch(e){
        res.status(400).json({
            message: "There is an error accessing Admin credentials from the database",
            error: e
        })
    }

})

adminRouter.get('/courses', adminMiddleware, async (req, res)=>{
    try{
        const courses = await Course.find({})
        res.status(200).json(courses)
    }
    catch(e){
        res.status(400).json({
            message: "There is an error in retrieving the courses from the database",
            error: e
        })
    }
})

adminRouter.post('/courses', adminMiddleware, async (req, res)=>{
    try{
        const {title, description, imageLink, price} = req.body

        if(!title || !description || !imageLink || !price) return res.status(400).json({
            message: "Don't send any blank fields for title, description, imageLink or price"
        })

        await Course.create({
            title,
            description,
            imageLink,
            price
        })

        res.status(200).json({
            message: `Course created successfully Title: ${title} Price: ${price}`
        })
    }
    catch(e){
        res.status(400).json({
            message: "There is an error in retrieving the courses from the database",
            error: e
        })
    }
})

module.exports = {
    adminRouter
}