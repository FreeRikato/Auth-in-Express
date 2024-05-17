require('dotenv').config()
const jwt = require('jsonwebtoken')

const adminMiddleware = (req, res, next) => {
    const auth = req.headers.authorization
    const token = auth.split(' ')[1]
    
    if(!token) res.status(400).json({
        message: "No session"
    })
    
    try{
        const verified = jwt.verify(token, process.env.SECRET_ACCESS_KEY)
        req.username = verified.username
        next()
    }
    catch(error){
        res.status({
            message: "Error in parsing the JWT session token",
            error: error
        })
    }
}

module.exports = {
    adminMiddleware
}