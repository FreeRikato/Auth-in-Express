require('dotenv').config
const { userMiddleware } = require('../middleware/user')
const { Router } = require('express')
const userRouter = Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Course } = require('../db')

userRouter.post('/signup', async (req, res)=>{
    const {username, password} = req.body

    if(!username || !password) return res.status(400).json({
        message: "Empty credentials, Please send valid credentials for signup"
    })

    try{
        const hashedPassword = await bcrypt.hash(password, 10)
    
        await User.create({
            username,
            password: hashedPassword
        })

        res.status(200).json({
            message: "User added Succesfully"
        })
    }
    catch(e){
        res.status(400).json({
            message: "There is an error adding User credentials to the database",
            error: e
        })
    }
})

userRouter.post('/login', async (req, res)=>{
    const {username, password} = req.body

    if(!username || !password) return res.status(400).json({
        message: "Empty credentials, Please send valid credentials for login"
    })

    try{
        const user = await User.findOne({ username: username })

        if(!user) return res.status(404).json({
            message: 'No such User exists in the database'
        })

        const exist = await bcrypt.compare(password, user.password)

        if(!exist) return res.status(401).json({
            message: 'Wrong Password for the User login'
        })

        const token = jwt.sign({username : username}, process.env.SECRET_ACCESS_KEY)

        res.status(200).json({
            message: "User added Succesfully",
            token: token
        })
    }
    catch(e){
        res.status(400).json({
            message: "There is an error accessing User credentials from the database",
            error: e
        })
    }

})

userRouter.get('/purchasedCourses', userMiddleware, async (req, res)=>{
    try{

        const username = req.username
        const userDetails = await User.findOne({
            username
        })
        console.log(userDetails.purchasedCourses)
        const courses = await Course.find({
            _id: {
                '$in' : userDetails.purchasedCourses
            }
        })
        res.status(200).json(courses)
    }
    catch(e){
        res.status(400).json({
            message: "There is an error in retrieving the courses from the database",
            error: e
        })
    }
})

userRouter.post('/courses/:courseId', userMiddleware, async (req, res)=>{
    try{
        const courseId = req.params.courseId
        const username = req.username

        const course = await Course.findById(courseId);

        if (!course) {
        return res.status(404).json({
            message: "Course not found"
        });
        }
    
        await User.updateOne({
            username: username
        },{
            "$push": {
                purchasedCourses: courseId
            }
        })

        res.status(200).json({
      message: `Course purchased successfully. Title: ${course.title}, Price: ${course.price}`
    });
  } catch (e) {
    res.status(400).json({
      message: "There is an error in purchasing the course",
      error: e.message
    });
  }
})


module.exports = {
    userRouter
}