const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserVerification = require("../models/UserVerification");
const nodemailer = require("nodemailer");
const { v4, uuidv4 } = require("uuid");
require("dotenv").config();
const bcrypt = require("bcryptjs");

let transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})

let mailOption = {
    from: process.env.AUTH_EMAIL,
    to: "testing@gmail.com",
    subject: "Testing for email sending",
    text: "It Worked !!"
};

transpoter.verify((error, success) => {
    if(error) {
        console.log(error)
    } else {
        console.log("Ready for message");
        console.log(success);
    }
})

router.post("/signup", (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;
    // name = name.trim();
    // email = email.trim();
    // password = password.trim();
    // dateOfBirth = dateOfBirth.trim();

    if(name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.status(404).json({message: "All fields are empty"});
    } else if (password.length < 4) {
        res.status(404).json({ message: "Password is to small !!" })
    } else {
        User.find({email}).then(result => {

            console.log(result);

            if(result.length) {
                res.status(404).json({ message: "User already exist !!" })
            } else {
                    bcrypt.genSalt(12, (err, salt) => {
                        if(err) throw err;
                        bcrypt.hash(password, salt, (err, hash) => {
                            if(err) throw err;
                            User({
                                name: name,
                                email: email,
                                password: hash,
                                dateOfBirth: dateOfBirth,
                                verified: false
                            }).save().then(result => {
                                res.status(202).json({ message: "Signup Successful", data: result })
                            }).catch(err => {
                                res.status(404).json({ message: "An error occured while saving user account !!" })
                            })
                        })
                    })

               
            }

        }).catch(err => {
            console.log(err);
            res.status(404).json({ message: "An error occured while checking for existing user !!" })
        })
    }
})

router.post("/login", (req, res) => {
    // console.log(req.body);
    let { email, password } = req.body;
    // email = email.trim();
    // password = password.trim();

    if(email == "" || password == "") {
        res.status(404).json({
            message: "Email and Pass fild is empty !!"
        })
    } else {
        User.find({email}).then(data => {

            console.log(email);
            

            if(data.length) {
                const hash = data[0].password;
                bcrypt.compareSync(hash, password).then(result => {
                    if(result) {
                        res.status(202).json({ message: "Signin Successful !!" })
                    } else {
                        res.status(404).json({ message: "Invalid Password !!" })
                    }
                }).catch(err => {
                    console.log(err);
                    res.status(404).json({ message: "An error occur while comparing the passwords !!" })
                })
            } else {
                
                res.status(404).json({ message: "Something Went wrong while login/signin !!" })
            }
        }).catch(err => {
           
            res.status(404).json({ message: "Error occured while checking for existing user" })
        })
    }
})

module.exports = router;