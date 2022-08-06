const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')

const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')

// JSON secret
const JWT_SECRET = process.env.JWT_SECRET;

// ROUTE 1 : Create a user at: /api/auth/createuser
router.post('/createuser', [
    body('name', 'Name should have at least 3 characters').isLength( { min: 3}),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password should have at least 3 characters').isLength({ min : 3 })
] , async (req, res) => {
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User.findOne( { email : req.body.email })
        if (user){
            return res.status(400).send({success, error:'A user with this email is already registered'})
        }

        //* Hashing the password
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        
       
        //* Creating a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        
        const data = {
            user: {
                id: user.id
            }
        }

        const jwt_token = jwt.sign(data, JWT_SECRET)
        success=true
        return res.send({success,jwt_token})

    } catch (error) {
        console.error(error.message)
        return res.status(500).send({ success, error: 'Internal Server Error' })
    }
})

// ROUTE 2: Login endpoint: /api/auth/login
router.post('/login', [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password should not be blank').exists()
] , async(req, res) => {
let success = false;
    try {
        const { email , password } = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).send({success, error: 'Please enter correct credentials'})
        }
        const pass_compare = await bcrypt.compare(password, user.password)
        if (!pass_compare){
            return res.status(400).send({success, error: 'Please enter correct credentials'})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        const jwtToken = jwt.sign(payload , JWT_SECRET)
        success = true;
        res.send({success, jwtToken})
    } catch (error) {
        console.error(error.message)
        return res.status(500).send({ success, error: 'Internal Server Error' })
    }
});

// ROUTE 3: Logged in User Information : /api/auth/userinfo
router.post('/userinfo', fetchuser, async (req, res) => {
    let success = false;
    try {
        const userid = req.user.id
        const userInfo = await User.findById(userid).select("-password")
        success = true
        res.send({success, userInfo})
    } catch (error) {
        console.error(error.message)
        res.status(500).send({success, error: 'Internal Server Error'})
    }

})

module.exports = router;