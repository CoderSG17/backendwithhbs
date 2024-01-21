require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path');
const hbs = require('hbs');
require('./db/conn')
const User = require('./models/user')   
// const router = require('./routes/userRoute')
const bcrypt =require('bcryptjs')
const cookieParser = require('cookie-parser')
const auth = require('./middleware/auth')


const port = process.env.PORT || 4000

app.use(express.json()); 
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())

const staticPath = path.join(__dirname,'../')
app.use(express.static(staticPath)); //isse hum koi bhi static file run krwa skte hai

//We need to write this peice of code to render a file on particular path
// console.log(__dirname)  
const pathName = path.join(__dirname,'../templates/views')
// console.log(pathName)
const partialsPath = path.join(__dirname,'../templates/partials')
// console.log(partialsPath)


app.set('view engine', 'hbs')
app.set('views', pathName)
hbs.registerPartials(partialsPath)
app.set('env development');

// app.use(router)


// console.log(process.env.SECRET_KEY)
// console.log(process.env.SECRET)

app.get('/', (req, res) =>{
    res.render('home')
})
// app.get('/home', (req, res) =>{
//     res.render('home')
// })
app.get('/login', (req, res) =>{
    res.render('login')
})
app.get('/logout', auth ,async(req, res) =>{
    try {
        //for logging out single user 
        req.user.tokens = req.user.tokens.filter((currElem)=>{
            return currElem.token !== req.token
        })

        //for logging out all logged in  user 
        // req.user.tokens=[]

        
        res.clearCookie('jwt')
        console.log('Successfully logout')
        await req.user.save()
        res.render('login')
    } catch (error) {
        res.status(404).send(error)
    }
})
app.get('/register', (req, res) =>{
    res.render('register')
})
app.get('/secret',auth, (req, res) =>{
    res.render('secret')
})

app.post("/register",async(req, res) => {
    try {
        const password = req.body.password;
        // console.log(req.body.password)
        const confirmpassword=req.body.confirmpassword;
        
        if(password===confirmpassword) {
            const registerUser = new User({
                "firstname":req.body.firstname,
                "lastname":req.body.lastname,
                "email":req.body.email,
                "gender":req.body.gender,
                "phone":req.body.phone,
                "age":req.body.age,
                "password":password,
                "confirmpassword":confirmpassword
            })

            const token = await registerUser.generateAuthToken()
            console.log(token);

            res.cookie("jwt", token,{
                expires: new Date(Date.now()+90000), //90sec
                httpOnly: true,
                // secure: true     //https pr hi chale uske liye 
            })
            console.log(cookie)

            const registered = await registerUser.save()
            res.status(200).render('home')

        }
        else{
            res.send('Passwords do not match')
        }
        
    } catch (error) {
        res.status(404).send(error)

        
    }
})

app.post('/login',async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        console.log(email)
        console.log(password)

        const userEmail =  await User.findOne({ email: email})

        const isMatch = await bcrypt.compare(password,userEmail.password )

        const token = await userEmail.generateAuthToken()
        console.log(token)

        res.cookie("jwt", token,{
            expires: new Date(Date.now()+90000), //90sec
            httpOnly: true,
                // secure: true     //https pr hi chale uske liye 
            })
        // console.log(cookie)

        // console.log(`This is cookie : ${ req.cookies.jwt}`)

    
        if(isMatch){
            res.status(200).render('home')
        }
        else{
            res.status(404).send('Invalid login details')
        }

    } catch (error) {
        res.status(404).send('Invalid login details')
    }
})

//Password hashing using Bcryptjs
// const bcrypt = require('bcryptjs');

// const securePass =async(pass)=>{

//     const hashPass = await bcrypt.hash(pass,10)
//     console.log(hashPass)
//     const checkPass = await bcrypt.compare(pass,hashPass)
//     console.log(checkPass)

// }
// securePass("shray@123")


//Foe authentication we'll use JWT
// const jwt = require('jsonwebtoken')

// const createToken =async()=>{
//     const token = await jwt.sign({_id:'65aad54b5084ee5832dfbd40'},"process.env.SECRET_KEY",{
//         expiresIn:"10 minutes"
//     })
//     console.log(token)

//     const userVerify = await jwt.verify(token,"process.env.SECRET_KEY")
//     console.log(userVerify)
// }

// createToken()



app.listen(port,(req, res) => {
    console.log(`port running on ${port}`);
})