const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth =async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser =  jwt.verify(token,'process.env.SECRET_KEY')

        const user = await User.findOne({_id:verifyUser._id})
        console.log(user.firstname)

        req.token=token
        req.user = user
        next()  
        
    } catch (error) {
        // res.redirect('/')
        res.status(404).send(error)
    }

}

module.exports = auth