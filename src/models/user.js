const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 3
    },
    lastname: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: [true, "email id already exists"],

        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')

            }
        }
    },
    gender:{
        type: String,
        required: true,

    },
    phone: {
        type: Number,
        required: true,
        min: 10,
        unique: [true, "phone number already exists"],
    },
    age:{
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    date:{
        type: Date,
        default: Date.now
    }


})

//Generating tokens 
UserSchema.methods.generateAuthToken = async function(){
    try {
        const token = await jwt.sign({_id:this._id.toString()},"process.env.SECRET_KEY")
        this.tokens=this.tokens.concat({token})
        // console.log(token)
        await this.save()
        return token

        // const userVerify = await jwt.verify(token, "process.env.SECRET_KEY")
        //         console.log(userVerify)
        
    } catch (error) {
        res.send("Something is wrong")
    }
} 


//Password hashing using Bcryptjs
UserSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
        this.confirmpassword = await bcrypt.hash(this.confirmpassword,10)
        // console.log(`hashed password is ${this.password}`)
        // this.confirmpassword=undefined;
    }
    next()
})

const User = new mongoose.model("User" , UserSchema)

module.exports = User;