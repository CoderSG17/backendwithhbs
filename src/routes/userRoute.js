// const express = require('express')
// const router = new express.Router()
// const User = require('../models/user') //db mein save krne ke liye hai yeh


// router.use(express.json()); 
// router.use(express.urlencoded({extended:false}));

// router.post("/register",async(req, res) => {
//     try {
//         const password = req.body.password;
//         console.log(req.body.password)
//         const confirmpassword=req.body.confirmpassword;
        
//         if(password===confirmpassword) {
//             const registerUser = new User({
//                 "firstname":req.body.firstname,
//                 "lastname":req.body.lastname,
//                 "email":req.body.email,
//                 "gender":req.body.gender,
//                 "phone":req.body.phone,
//                 "age":req.body.age,
//                 "password":password,
//                 "confirmpassword":confirmpassword
//             })

//             const registered = await registerUser.save()
//             res.status(200).render("home")

//         }
//         else{
//             res.send('Passwords do not match')
//         }
        
//     } catch (error) {
//         console.log(error)
//         res.status(404).send()

        
//     }
// })

// module.exports = router